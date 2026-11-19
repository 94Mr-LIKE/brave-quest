/*
 * v4.2.5 AC 首頁「職業樹」（交辦 AC 第四節；老闆 2026-11-16 定案，附圖 A 按鈕位置、E 橫式、F 直式）
 * - 首頁右上角「職業樹 ›」膠囊按鈕（mountButton，title.js 的 frame() 呼叫）→ 跳出式面板（J.UI.open：暗色遮罩、Esc 關、Tab 留在面板裡、關掉後焦點回按鈕）
 * - 節點、配方連線全部從 jobs.js（tier、recipe）產生；出師等級讀 JOB_RULES.master_level；圖示讀 sprites.js（hero_<id>／heroM_<id>，down 列中間格）
 * - 二轉、三轉的高度用算的（layoutColumn）：先放在配方職業的平均高度，再依高度排序、把重疊的推開到最小間距
 * - 連線是 SVG，依實際 DOM 位置計算；視窗縮放、轉向時重算（最多每 100 毫秒一次）
 * - 不連網、不寫 localStorage（只讀 bq_save 決定預設性別與「減少動態效果」）、不顯示轉職地點（老闆的決定 4）
 * 純函式（build、layoutColumn、trace、descendants、infoText、iconSpec、defaultGender）可在 node 測試：tests/v425_tiers_tree.test.js（第二部分）
 */
(function () {
  'use strict';
  var TIERS = ['novice', 'basic', 'inter', 'adv'];
  var TIER_LABEL = { novice: '見習', basic: '一轉', inter: '二轉', adv: '三轉' };
  // 一轉的上下順序（附圖 E）；職業本身從 jobs.js 讀，這裡沒列到的一轉職業排在後面
  var BASIC_ORDER = ['fighter', 'swordsman', 'mage', 'priest', 'dancer', 'bard', 'jester', 'shepherd', 'archer', 'sailor', 'tamer', 'merchant'];
  // 二轉、三轉的最小間距（單位＝一轉的一格）
  var GAP = { inter: 1.2, adv: 1.5 };
  var HINT = '點一個職業，看看要先練哪些職業。';
  var SAVE_KEY = 'bq_save';
  var SVGNS = 'http' + '://www.w3.org/2000/svg';   // SVG 的命名空間（只是名字，不會連網）

  /** recipe：jobs.js 的形狀是 { 職業 id: 等級 } → [[id, 等級], …]（照資料裡的順序） */
  function recipeOf(job) {
    var r = job && job.recipe;
    if (!r || typeof r !== 'object') return [];
    return Object.keys(r).map(function (k) { return [k, Number(r[k])]; });
  }
  function idsOfTier(jobs, tier) { return Object.keys(jobs || {}).filter(function (id) { return jobs[id] && jobs[id].tier === tier; }); }
  function basicOrder(jobs) {
    var all = idsOfTier(jobs, 'basic');
    return BASIC_ORDER.filter(function (id) { return all.indexOf(id) >= 0; }).concat(all.filter(function (id) { return BASIC_ORDER.indexOf(id) < 0; }));
  }
  function round6(v) { return Math.round(v * 1e6) / 1e6; }

  /**
   * 一欄的位置：items [{id, y（想放的高度）}]、opts {gap, min, max} → 依高度排序後的 [{id, y}]
   * 1) 依高度排序（一樣高照輸入順序）；2) 重疊的併成一組，整組放在「各自想放的高度」的平均（相鄰剛好差 gap）；
   * 3) 由上往下保證 ≥ min、和上一個至少差 gap，再由下往上保證 ≤ max。
   */
  function layoutColumn(items, opts) {
    var gap = opts.gap, min = opts.min, max = opts.max;
    var list = items.map(function (o, i) { return { id: o.id, y: o.y, i: i }; }).sort(function (a, b) { return a.y - b.y || a.i - b.i; });
    var blocks = [];   // { n 個數, sum Σ(想放的高度 − 組內序號×gap) }
    list.forEach(function (o) {
      blocks.push({ n: 1, sum: o.y });
      while (blocks.length > 1) {
        var cur = blocks[blocks.length - 1], prev = blocks[blocks.length - 2];
        if (prev.sum / prev.n + prev.n * gap <= cur.sum / cur.n + 1e-9) break;
        blocks.pop();
        prev.sum += cur.sum - prev.n * gap * cur.n;
        prev.n += cur.n;
      }
    });
    var ys = [];
    blocks.forEach(function (b) { for (var k = 0; k < b.n; k++) ys.push(b.sum / b.n + k * gap); });
    for (var i = 0; i < ys.length; i++) ys[i] = Math.max(ys[i], i ? ys[i - 1] + gap : min);
    for (var j = ys.length - 1; j >= 0; j--) ys[j] = Math.max(min, Math.min(ys[j], j < ys.length - 1 ? ys[j + 1] - gap : max));
    return list.map(function (o, k) { return { id: o.id, y: round6(ys[k]) }; });
  }

  /** 整棵樹：columns（每欄由上往下的 id）、nodes [{id, name, tier, y}]、edges 配方連線 [{from, to, lv}]、fan 見習→一轉、rows 列數 */
  function build(jobs) {
    jobs = jobs || {};
    var cols = { novice: idsOfTier(jobs, 'novice'), basic: basicOrder(jobs), inter: [], adv: [] };
    var y = {}, rows = Math.max(1, cols.basic.length), max = rows - 1;
    cols.basic.forEach(function (id, i) { y[id] = i; });
    var mid = cols.basic.length ? cols.basic.reduce(function (s, id) { return s + y[id]; }, 0) / cols.basic.length : max / 2;
    cols.novice.forEach(function (id) { y[id] = round6(mid); });
    ['inter', 'adv'].forEach(function (tier) {
      var items = idsOfTier(jobs, tier).map(function (id) {
        var src = recipeOf(jobs[id]).filter(function (r) { return y[r[0]] !== undefined; });
        return { id: id, y: src.length ? src.reduce(function (s, r) { return s + y[r[0]]; }, 0) / src.length : max / 2 };
      });
      layoutColumn(items, { gap: GAP[tier], min: 0, max: max }).forEach(function (o) { cols[tier].push(o.id); y[o.id] = o.y; });
    });
    var nodes = [], edges = [], fan = [];
    TIERS.forEach(function (tier) { cols[tier].forEach(function (id) { nodes.push({ id: id, name: jobs[id].name || id, tier: tier, y: y[id] }); }); });
    ['inter', 'adv'].forEach(function (tier) {
      cols[tier].forEach(function (id) {
        recipeOf(jobs[id]).forEach(function (r) { if (y[r[0]] !== undefined) edges.push({ from: r[0], to: id, lv: r[1] }); });
      });
    });
    cols.novice.forEach(function (n) { cols.basic.forEach(function (id) { fan.push({ from: n, to: id }); }); });
    return { columns: cols, nodes: nodes, edges: edges, fan: fan, rows: rows };
  }

  /** 排序用：職階 → 一轉照 BASIC_ORDER → 其他照資料順序 */
  function sorter(jobs) {
    var keys = Object.keys(jobs), basic = basicOrder(jobs);
    function rank(id) { var t = TIERS.indexOf(jobs[id].tier); return t * 10000 + (jobs[id].tier === 'basic' ? basic.indexOf(id) : keys.indexOf(id)); }
    return function (a, b) { return rank(a) - rank(b); };
  }

  /** 往前追：recipe（直接配方）、all（一路往前追到一轉的所有職業，不含見習）、basic（其中的一轉，照一轉順序） */
  function trace(jobs, id) {
    var recipe = recipeOf(jobs[id]).filter(function (r) { return jobs[r[0]]; });
    var seen = {}, stack = recipe.map(function (r) { return r[0]; });
    while (stack.length) {
      var k = stack.pop();
      if (seen[k] || k === id) continue;
      seen[k] = true;
      recipeOf(jobs[k]).forEach(function (r) { if (jobs[r[0]]) stack.push(r[0]); });
    }
    var all = Object.keys(seen).filter(function (k) { return jobs[k].tier !== 'novice'; }).sort(sorter(jobs));
    return { recipe: recipe, all: all, basic: all.filter(function (k) { return jobs[k].tier === 'basic'; }) };
  }

  /** 會用到它的後續職業（直接或間接） */
  function descendants(jobs, id) {
    if (!id) return [];
    return Object.keys(jobs).filter(function (k) { return k !== id && recipeOf(jobs[k]).length && trace(jobs, k).all.indexOf(id) >= 0; }).sort(sorter(jobs));
  }

  function nameOf(jobs, id) { return (jobs[id] && jobs[id].name) || id; }

  /** 見習的出師等級：JOB_RULES.master_level.novice 是正整數才回傳，缺值或寫錯 → null（不顯示那一句，第二輪審查 L3） */
  function noviceLv(rules) {
    var v = rules && rules.master_level ? rules.master_level.novice : null;
    return typeof v === 'number' && v > 0 && Math.floor(v) === v ? v : null;
  }

  /** 說明列：例「神之手　配方：戰鬥大師 Lv50＋聖騎士 Lv50（往前追：武鬥家、劍士、祭司）」 */
  function infoText(jobs, rules, id) {
    if (!id || !jobs[id]) return HINT;
    var job = jobs[id], name = nameOf(jobs, id), lv = noviceLv(rules);
    var tr = trace(jobs, id);
    if (tr.recipe.length) {
      var s = name + '　配方：' + tr.recipe.map(function (r) { return nameOf(jobs, r[0]) + ' Lv' + r[1]; }).join('＋');
      var direct = tr.recipe.map(function (r) { return r[0]; }).sort().join(',');
      if (tr.basic.length && tr.basic.slice().sort().join(',') !== direct) s += '（往前追：' + tr.basic.map(function (k) { return nameOf(jobs, k); }).join('、') + '）';
      return s;
    }
    var novice = idsOfTier(jobs, 'novice')[0];
    if (job.tier === 'basic' && novice) return lv ? name + '　條件：' + nameOf(jobs, novice) + ' Lv' + lv + ' 出師' : name;
    if (job.tier === 'novice') return lv ? name + '　Lv' + lv + ' 出師，就能選' + TIER_LABEL.basic + '職業' : name;
    return name;
  }

  /** 直接用到它的下一階職業（配方裡有它的），照職階、一轉順序排 */
  function nextOf(jobs, id) {
    if (!id) return [];
    return Object.keys(jobs).filter(function (k) { return recipeOf(jobs[k]).some(function (r) { return r[0] === id; }); }).sort(sorter(jobs));
  }

  /**
   * v4.2.8 直式配方列（手機直式欄距太窄、看不出連線）：{ src [{id, lv}]（由哪些職業轉來）, dst（選的）, next [id]（可以再轉成）, anyBasic（見習：任選一轉） }
   * 一轉的來源是見習（等級讀 JOB_RULES.master_level.novice，缺值 → lv null）；全部從 jobs.js 算，不寫死
   */
  function recipeStrip(jobs, rules, id) {
    if (!id || !jobs || !jobs[id]) return null;
    var job = jobs[id], src = recipeOf(job).filter(function (r) { return jobs[r[0]]; }).map(function (r) { return { id: r[0], lv: r[1] }; });
    var novice = idsOfTier(jobs, 'novice')[0];
    if (!src.length && job.tier === 'basic' && novice) src = [{ id: novice, lv: noviceLv(rules) }];
    return { src: src, dst: id, next: nextOf(jobs, id), anyBasic: job.tier === 'novice' };
  }

  /** 圖示切哪一格：J.Assets.info(key) → {file, fw, fh, cols, rows, col（中間格）, row（down 列）}；沒有圖 → null */
  function iconSpec(inf) {
    if (!inf || !inf.file) return null;
    var order = inf.order || ['down', 'left', 'right', 'up'];
    var row = order.indexOf('down'), cols = inf.cols || 3;
    return { file: inf.file, fw: inf.frameW || 24, fh: inf.frameH || 36, cols: cols, rows: inf.rows || order.length || 4, col: Math.floor(cols / 2), row: row >= 0 ? row : 0 };
  }

  /** 只讀這台裝置的存檔（bq_save）；讀不到、壞掉 → null */
  function readSave(storage) {
    try {
      var raw = storage && storage.getItem(SAVE_KEY);
      var s = raw ? JSON.parse(raw) : null;
      return s && typeof s === 'object' ? s : null;
    } catch (e) { return null; }
  }
  /** 預設性別：跟存檔，沒有存檔用女 */
  function defaultGender(storage) { var s = readSave(storage); return s && s.player && s.player.gender === 'm' ? 'm' : 'f'; }
  /** 存檔裡的設定（「減少動態效果」用）；沒有 → null */
  function savedSettings(storage) { var s = readSave(storage); return s && s.settings && typeof s.settings === 'object' ? s.settings : null; }

  // ---------------------------------------------------------------- 畫面（瀏覽器）
  function J() { return window.JQ; }
  function h() { return J().UI.h.apply(null, arguments); }
  function setVars(node, o) { Object.keys(o).forEach(function (k) { node.style.setProperty(k, String(o[k])); }); }
  function storage() { try { return window.localStorage; } catch (e) { return null; } }

  /** 首頁右上角的「職業樹 ›」按鈕（title.js 的 frame() 每次重畫首頁時呼叫） */
  function mountButton(root) {
    if (!root || !window.JOBS) return null;
    var btn = h('button.jt-open', { type: 'button', 'aria-haspopup': 'dialog', 'aria-label': '打開職業樹', onclick: function () { open(btn); } }, ['職業樹 ›']);
    root.appendChild(btn);
    return btn;
  }

  /** 打開職業樹面板；returnTo＝關掉後焦點回去的按鈕 */
  function open(returnTo) {
    var jobs = window.JOBS || {}, rules = window.JOB_RULES || {}, A = J().Assets;
    var tree = build(jobs), st = storage();
    var gender = defaultGender(st), selected = null;
    var mm = typeof window.matchMedia === 'function' ? window.matchMedia.bind(window) : null;
    var reduce = J().Motion ? J().Motion.reduceMotion(savedSettings(st), mm) : false;
    var mlv = noviceLv(rules);

    var gBtns = [['f', '女'], ['m', '男']].map(function (g) {
      return h('button.jt-g', { type: 'button', 'aria-pressed': String(gender === g[0]), 'aria-label': g[1] + '生圖示', onclick: function () { setGender(g[0]); } }, [g[1]]);
    });
    var closeBtn = h('button.jt-close', { type: 'button', 'aria-label': '關閉職業樹', onclick: function () { handle.close(); } }, ['✕']);
    var head = h('div.jt-head', {}, [h('div.jt-gender', { role: 'group', 'aria-label': '角色圖示' }, gBtns), h('h2.jt-title', { id: 'jt-title', text: '職業樹' }), closeBtn]);
    var labels = h('div.jt-cols', { 'aria-hidden': 'true' }, TIERS.map(function (t, i) { var n = h('span.jt-col', { text: TIER_LABEL[t] }); setVars(n, { '--col': i }); return n; }));
    var stage = h('div.jt-stage');
    setVars(stage, { '--rows': tree.rows });
    var svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('class', 'jt-lines'); svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('focusable', 'false');
    stage.appendChild(svg);

    var cards = {};
    tree.nodes.forEach(function (n) {
      var spr = h('span.jt-spr');
      var label = n.tier === 'novice' ? [h('span.jt-full', { text: n.name }), h('span.jt-short', { text: TIER_LABEL.novice })] : [h('span.jt-name', { text: n.name })];
      var btn = h('button.jt-card.jt-' + n.tier, { type: 'button', 'aria-pressed': 'false', 'aria-label': n.name + '（' + TIER_LABEL[n.tier] + '）', 'data-job': n.id,
        onclick: function () { select(selected === n.id ? null : n.id); } }, [h('span.jt-ico', { 'aria-hidden': 'true' }, [spr])].concat(label));
      setVars(btn, { '--col': TIERS.indexOf(n.tier), '--y': n.y });
      cards[n.id] = { btn: btn, spr: spr, name: n.name };
      stage.appendChild(btn);
      if (n.tier === 'novice' && mlv) {
        var note = h('span.jt-note', { text: 'Lv' + mlv + ' 出師' });
        setVars(note, { '--col': 0, '--y': n.y });
        stage.appendChild(note);
      }
    });
    var body = h('div.jt-body', {}, [labels, stage]);
    var more = h('div.jt-more', { 'aria-hidden': 'true', text: '▼ 往下滑看更多' });
    var info = h('p.jt-info', { role: 'status', 'aria-live': 'polite', text: HINT });
    // v4.2.8：直式配方列（圖示＋名稱：「戰鬥大師＋聖騎士 → 神之手」「可以再轉成 → …」）；只在手機直式顯示（CSS），讀屏照舊讀 .jt-info
    var strip = h('div.jt-recipe', { 'aria-hidden': 'true' });
    strip.hidden = true;
    var panel = h('div.win.panel.jobtree' + (reduce ? '.rm' : ''), {}, [head, h('div.jt-bodywrap', {}, [body, more]), strip, info]);

    var handle = J().UI.open(panel, { label: '職業樹', focus: closeBtn, onClose: function () {
      cleanup();
      if (returnTo && document.body.contains(returnTo)) { try { returnTo.focus(); } catch (e) { /* 忽略 */ } }
    } });
    panel.setAttribute('aria-labelledby', 'jt-title');
    panel.removeAttribute('aria-label');

    // 點遮罩關閉（按下和放開都在遮罩上才算，從面板裡拖到外面不會關）；點面板裡的空白處取消選取
    var wrap = panel.parentNode, downOnWrap = false;
    function onDown(e) { downOnWrap = e.target === wrap; }
    function onWrapClick(e) { if (e.target === wrap && downOnWrap) handle.close(); downOnWrap = false; }
    if (wrap && wrap !== panel) { wrap.addEventListener('pointerdown', onDown); wrap.addEventListener('click', onWrapClick); }
    panel.addEventListener('click', function (e) { if (selected && !(e.target.closest && e.target.closest('button'))) select(null); });

    function setGender(g) {
      gender = g;
      gBtns.forEach(function (b, i) { b.setAttribute('aria-pressed', String((i ? 'm' : 'f') === g)); });
      Object.keys(cards).forEach(function (id) {
        var c = cards[id], key = A.heroKey(g, id), spec = iconSpec(A.info(key));
        var url = spec && !(A.failed && A.failed[key]) ? A.resolveUrl(spec.file) : null;
        c.spr.classList.toggle('jt-ph', !url);
        c.spr.textContent = url ? '' : c.name.slice(0, 1);
        c.spr.style.backgroundImage = url ? 'url("' + String(url).replace(/["\\\n\r]/g, encodeURIComponent) + '")' : '';
        if (spec) setVars(c.spr, { '--fw': spec.fw, '--fh': spec.fh, '--cols': spec.cols, '--srows': spec.rows, '--c': spec.col, '--r': spec.row });
      });
      renderStrip();
    }

    // v4.2.8 直式配方列：圖示用卡片上同一個圖（複製節點，性別切換時重畫）
    function chip(id, kind, lv) {
      var c = cards[id], ico = h('span.jt-ico');
      if (c) ico.appendChild(c.spr.cloneNode(true));
      var kids = [ico, h('span.jt-cname', { text: c ? c.name : nameOf(jobs, id) })];
      if (lv) kids.push(h('span.jt-clv', { text: 'Lv' + lv }));
      return h('span.jt-chip.jt-chip-' + kind, {}, kids);
    }
    function op(t) { return h('span.jt-op', { text: t }); }
    function renderStrip() {
      while (strip.firstChild) strip.removeChild(strip.firstChild);
      var r = recipeStrip(jobs, rules, selected);
      strip.hidden = !r;
      if (!r) return;
      var row1 = h('div.jt-rrow');
      r.src.forEach(function (s, i) { if (i) row1.appendChild(op('＋')); row1.appendChild(chip(s.id, 'src', s.lv)); });
      if (r.src.length) row1.appendChild(op('→'));
      row1.appendChild(chip(r.dst, 'sel'));
      if (r.anyBasic) { row1.appendChild(op('→')); row1.appendChild(h('span.jt-rtxt', { text: (mlv ? 'Lv' + mlv + ' 出師後，' : '') + '任選一個' + TIER_LABEL.basic + '職業' })); }
      strip.appendChild(row1);
      if (r.next.length) strip.appendChild(h('div.jt-rrow', {}, [h('span.jt-rtxt', { text: '可以再轉成' }), op('→')].concat(r.next.map(function (n) { return chip(n, 'next'); }))));
      else if (!r.anyBasic) strip.appendChild(h('div.jt-rrow', {}, [h('span.jt-rtxt', { text: '這是最高階的職業' })]));
    }

    var paths = [];
    function select(id) {
      selected = id;
      var lit = {}, next = {}, nx1 = {};
      if (id) { lit[id] = true; trace(jobs, id).all.forEach(function (k) { lit[k] = true; }); descendants(jobs, id).forEach(function (k) { next[k] = true; }); nextOf(jobs, id).forEach(function (k) { nx1[k] = true; }); }
      Object.keys(cards).forEach(function (k) {
        var b = cards[k].btn;
        b.classList.toggle('is-on', !!lit[k]);
        b.classList.toggle('is-sel', k === id);
        b.classList.toggle('is-next', !!next[k]);
        b.classList.toggle('is-nx1', !!nx1[k]);   // v4.2.8：直接可以再轉成的（直式配色用）
        b.setAttribute('aria-pressed', String(k === id));
      });
      paths.forEach(function (p) {
        var on = !!(p.recipe && lit[p.from] && lit[p.to]);
        var nx = !!(p.recipe && p.from === id && nx1[p.to]);   // v4.2.8：選的 → 下一階（只有直式的 CSS 會上色）
        p.el.classList.toggle('is-on', on);
        p.el.classList.toggle('is-nx', nx);
        if (on || nx) svg.appendChild(p.el);   // 亮的線畫在最上面
      });
      panel.classList.toggle('has-sel', !!id);
      info.textContent = infoText(jobs, rules, id);
      renderStrip();
    }

    function portrait() { return !!(mm && mm('(orientation: portrait)').matches); }
    function draw() {
      if (!document.body.contains(stage)) { cleanup(); return; }
      var sr = stage.getBoundingClientRect(), W = stage.clientWidth, H = stage.clientHeight;
      svg.setAttribute('width', String(W)); svg.setAttribute('height', String(H));
      svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      paths = [];
      var box = {};
      Object.keys(cards).forEach(function (k) {
        var r = cards[k].btn.getBoundingClientRect();
        box[k] = { l: r.left - sr.left, r: r.right - sr.left, m: r.top - sr.top + r.height / 2 };
      });
      function add(d, e, recipe) {
        var p = document.createElementNS(SVGNS, 'path');
        p.setAttribute('d', d);
        svg.appendChild(p);
        paths.push({ el: p, from: e.from, to: e.to, recipe: recipe });
      }
      function curve(a, b) { var mx = (a.r + b.l) / 2; return 'M' + a.r + ' ' + a.m + 'C' + mx + ' ' + a.m + ' ' + mx + ' ' + b.m + ' ' + b.l + ' ' + b.m; }
      var tall = portrait();
      tree.fan.forEach(function (e) {
        var a = box[e.from], b = box[e.to];
        if (!a || !b) return;
        // 直式：主幹＋分枝直線（捲動時不會糾成一束）；橫式：扇形曲線
        if (tall) { var tx = (a.r + b.l) / 2; add('M' + a.r + ' ' + a.m + 'H' + tx + 'V' + b.m + 'H' + b.l, e, false); }
        else add(curve(a, b), e, false);
      });
      tree.edges.forEach(function (e) { if (box[e.from] && box[e.to]) add(curve(box[e.from], box[e.to]), e, true); });
      select(selected);
      updateMore();
    }

    // 重算節流：最多每 100 毫秒一次（最後一次一定會算）
    var timer = null, last = 0, ro = null, raf = window.requestAnimationFrame || function (f) { return setTimeout(f, 16); };
    function schedule() {
      if (timer) return;
      timer = setTimeout(function () { timer = null; last = Date.now(); raf(draw); }, Math.max(0, 100 - (Date.now() - last)));
    }
    function updateMore() { more.hidden = body.scrollHeight - body.clientHeight - body.scrollTop <= 8; }
    body.addEventListener('scroll', updateMore, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('orientationchange', schedule);
    if (typeof window.ResizeObserver === 'function') { ro = new window.ResizeObserver(schedule); ro.observe(stage); }
    var cleaned = false;
    function cleanup() {
      if (cleaned) return;
      cleaned = true;
      window.removeEventListener('resize', schedule);
      window.removeEventListener('orientationchange', schedule);
      if (ro) ro.disconnect();
      if (timer) { clearTimeout(timer); timer = null; }
    }

    setGender(gender);
    raf(draw);
    return handle;
  }

  var JobTree = { TIERS: TIERS, TIER_LABEL: TIER_LABEL, BASIC_ORDER: BASIC_ORDER, GAP: GAP, HINT: HINT,
    recipeOf: recipeOf, nextOf: nextOf, recipeStrip: recipeStrip, build: build, layoutColumn: layoutColumn, trace: trace, descendants: descendants, infoText: infoText, iconSpec: iconSpec,
    defaultGender: defaultGender, savedSettings: savedSettings, mountButton: mountButton, open: open };
  if (typeof window !== 'undefined' && window) { window.JQ = window.JQ || {}; window.JQ.JobTree = JobTree; }
  if (typeof module !== 'undefined') module.exports = JobTree;
})();
