/*
 * DOM 介面共用工具：建立元素、視窗堆疊（含焦點管理）、提示訊息、對話框
 * 所有文字介面都用 DOM（中文清楚、螢幕報讀器讀得到），疊在 Phaser 畫布上。
 */
(function () {
  'use strict';
  var layer, toasts, live;
  var stack = [];   // 開著的視窗 [{node, onClose, prevFocus, modal}]

  function init() {
    layer = document.getElementById('layer');
    toasts = document.getElementById('toasts');
    live = document.getElementById('sr-live');
    wwObserve(document.getElementById('ui'));   // v2.2.1（v20 缺陷 2、12；v21 L1–L4、L8）：新出現的文字不在詞中間換行
    document.addEventListener('keydown', onKey, true);
    // v0.9.6（47 號 B01）用滑鼠／手指點過的 HUD 按鈕不要一直留著焦點：
    // 不然 Z 以外的「對話」鍵（空白鍵、Enter）會去按那個按鈕，重新打開背包、放大地圖。用鍵盤 Tab 過去的照舊（無障礙）
    document.addEventListener('pointerdown', function (e) {
      pointerMode = true;
      if (e.target && e.target.closest && e.target.closest('#game')) blurHud();   // 點遊戲畫面（canvas 不會搶焦點）
    }, true);
    document.addEventListener('keydown', function (e) { if (e.key === 'Tab') pointerMode = false; }, true);
    document.addEventListener('click', function (e) {
      if (!pointerMode || e.detail === 0) return;   // detail 0＝鍵盤按的
      var b = e.target && e.target.closest && e.target.closest(HUD_SEL);
      if (b) setTimeout(function () { if (document.activeElement === b) b.blur(); }, 0);
    }, true);
  }
  var pointerMode = false, HUD_SEL = '#hud button, #pad button, #prompt button';
  function inHud(el) { return !!(el && el.closest && el.closest('#hud, #pad, #prompt')); }
  function blurHud() { var a = document.activeElement; if (inHud(a) && a.blur) a.blur(); }

  function esc(s) { return window.JQ.Assets.esc(s == null ? '' : s); }

  /*
   * v1.4.1（v14_畫面審查 缺陷 5「25 金／幣」「藥／草」）：金額和「」裡的短名稱不要在中間換行。所有文字介面都經過 h()，在這裡處理一次：
   * 符合的片段包成 <jq-nb>（style.css：white-space: nowrap），其他照舊是文字；textContent 和原本一樣。沒有符合的回傳 false（呼叫端照舊放文字）
   */
  var NB_RE = /(?:金幣|經驗值)\s?[+＋]\s?\d[\d,]*|\d[\d,]*\s?金幣|\d[\d,]*\s?金(?![\u3400-\u9fff])|「[^「」\n]{1,10}」/g;
  function nbText(node, s) {
    s = String(s);
    NB_RE.lastIndex = 0;
    if (!NB_RE.test(s)) return false;
    NB_RE.lastIndex = 0;
    var i = 0, m;
    while ((m = NB_RE.exec(s))) {
      if (m.index > i) node.appendChild(document.createTextNode(s.slice(i, m.index)));
      var nb = document.createElement('jq-nb'); nb.textContent = m[0]; node.appendChild(nb);
      i = m.index + m[0].length;
    }
    if (i < s.length) node.appendChild(document.createTextNode(s.slice(i)));
    return true;
  }

  /*
   * v2.2.1（v20_畫面審查 缺陷 2、12；v21_畫面審查 L1–L4、L8；生氣了橫幅）：中文在詞中間換行（「鎮瀾／宮」「魔法戰／士」「kóo-tsik--／ooh」）。
   * 只靠 h() 不夠（對話框、戰鬥訊息是直接設 textContent）→ #ui 掛一個 MutationObserver：新出現的文字節點，把「詞」包成 <jq-nb>（style.css：不換行），
   * 換行只落在詞和詞之間。字、textContent、讀屏念的內容都不變。詞（wordRanges）：
   *   ① 金額、數值、數字＋單位（25 金幣、攻擊 +3、魔力 6、18 題、第 1/3 階段、Lv20–24）、「」裡 10 字以內、台羅有連字號的詞（kóo-tsik--ooh.）
   *   ② 遊戲裡的名字（地名、職業、道具、怪物、委託名稱、說話的人、NPC，2–8 個字）＋ WW_WORDS 補的常用詞
   *   ③ 瀏覽器分詞 Intl.Segmenter（2–6 個字；瀏覽器沒有中文詞庫時只剩 ①②，不會出錯）
   * 超過 8 個字的不包（窄的框還是可以換行，不會撐破版面）。
   */
  var WW_SKIP = 'jq-nb, #hud, .timer, #sr-live, script, style, textarea, input, select, option, svg, canvas, .author-mail, .map-banner';
  var WW_LAT = "A-Za-z\\u00C0-\\u024F\\u1E00-\\u1EFF\\u0300-\\u036F\\u207F'";
  var WW_RE = new RegExp([
    '(?:金幣|經驗值|攻擊|防禦力|防禦|魔力|體力)\\s?[+＋−-]?\\s?\\d[\\d,.]*',
    '(?:第\\s?)?\\d[\\d,.]*(?:\\s?\\/\\s?\\d+)?\\s?(?:金幣|公尺|公里|公斤|公克|公分|分鐘|小時|階段|金(?![\\u3400-\\u9fff])|題|個|秒|級|張|隻|天|次|倍|顆|元|年|月|日|步|格|盞|句|種|件|本|頁|人|位|塊|片|條|盒|包|瓶|杯|碗)',
    'Lv\\s?\\d+(?:\\s?[–~-]\\s?\\d+)?',
    '[' + WW_LAT + ']+(?:-{1,2}[' + WW_LAT + ']+)+[.,!?]?',
    '「[^「」\\n]{1,10}」'
  ].join('|'), 'g');
  var WW_CJK = /^[\u3400-\u9fff]+$/;
  var WW_WORDS = ['鎮瀾宮', '天后宮', '朝天宮', '武德宮', '慈護宮', '行天宮', '指南宮', '廣安宮', '管理員', '解說員', '研究員', '圖書館', '博物館', '老街', '拿手科目', '中級職業', '初級職業',
    '立志小考', '轉職', '委託', '寶箱', '經驗值', '金幣', '體力', '魔力', '防禦力', '攻擊', '技能', '階段', '豆干', '大漢溪', '竹塹城', '鬥相共', '機器將軍', '觀光網站', '真透', '亂跑',
    '不安全', '最有名', '最大', '逃跑', '買東西', '賣東西', '拿得動', '變高', '也能用', '也能穿', '力量', '答對', '答錯', '題目', '番薯仔', '小地圖', '世界地圖', '刪去卡', '引導卡',
    '國語', '數學', '英語', '自然', '社會', '三上', '三下', '單元'];
  var wwDict = null, wwDictFull = false, wwMax = 0, wwSeg = null, wwMade = typeof WeakSet === 'function' ? new WeakSet() : null;
  /** 詞庫：WW_WORDS＋遊戲資料的名字（只收 2–8 個中文字；資料還沒載入時先用 WW_WORDS，之後補上） */
  function wwBuildDict() {
    var w = typeof window !== 'undefined' ? window : {}, d = {}, max = 0;
    function add(s) { s = String(s == null ? '' : s).replace(/[\s「」『』（）()〔〕]/g, ''); if (s.length >= 2 && s.length <= 8 && WW_CJK.test(s)) { d[s] = 1; if (s.length > max) max = s.length; } }
    WW_WORDS.forEach(add);
    var full = !!(w.MAPS && w.ITEMS);
    [w.MAPS, w.JOBS, w.ITEMS, w.MONSTERS, w.QUESTS].forEach(function (o) { Object.keys(o || {}).forEach(function (k) { var v = o[k] || {}; add(v.name); add(v.title); (v.npcs || []).forEach(function (n) { add(n && n.name); }); }); });
    [w.SPEAKERS, w.NPC_NAMES].forEach(function (o) { Object.keys(o || {}).forEach(function (k) { add(o[k]); }); });
    wwDict = d; wwMax = max; wwDictFull = full;
  }
  /** s 裡要整塊不換行的範圍 [[開始, 結束), …]（照順序、不重疊）。純函式，node 測試直接呼叫（J.UI.wordRanges） */
  function wordRanges(s) {
    s = String(s == null ? '' : s);
    var out = [], used = [], i, m;
    if (s.length < 2) return out;
    if (!wwDict || !wwDictFull) wwBuildDict();
    function free(a, b) { for (var k = a; k < b; k++) if (used[k]) return false; return true; }
    function take(a, b) { out.push([a, b]); for (var k = a; k < b; k++) used[k] = true; }
    WW_RE.lastIndex = 0;
    while ((m = WW_RE.exec(s))) { if (m[0].length > 1 && free(m.index, m.index + m[0].length)) take(m.index, m.index + m[0].length); if (!m[0].length) WW_RE.lastIndex++; }
    for (i = 0; i < s.length; i++) {
      if (used[i] || !WW_CJK.test(s[i])) continue;
      for (var L = Math.min(wwMax, s.length - i); L >= 2; L--) { if (wwDict[s.substr(i, L)] && free(i, i + L)) { take(i, i + L); i += L - 1; break; } }
    }
    if (wwSeg === null) { try { wwSeg = (typeof Intl !== 'undefined' && Intl.Segmenter) ? new Intl.Segmenter('zh-Hant', { granularity: 'word' }) : false; } catch (e) { wwSeg = false; } }
    if (wwSeg && /[\u3400-\u9fff]{2}/.test(s)) {
      try {
        var it = wwSeg.segment(s)[Symbol.iterator](), r;
        while (!(r = it.next()).done) { var g = r.value, a = g.index, b = a + g.segment.length; if (g.isWordLike !== false && g.segment.length >= 2 && g.segment.length <= 6 && WW_CJK.test(g.segment) && free(a, b)) take(a, b); }
      } catch (e) { /* 瀏覽器分詞出錯就只用 ①② */ }
    }
    return out.sort(function (x, y) { return x[0] - y[0]; });
  }
  function wwKeep(n) { if (wwMade) wwMade.add(n); return n; }
  /** 一個文字節點：把詞包成 <jq-nb>（已經處理過、在跳過的元素裡、沒有要包的就不動） */
  function wwText(tn) {
    if (!tn || (wwMade && wwMade.has(tn))) return;
    var p = tn.parentNode, s = tn.nodeValue;
    if (!p || p.nodeType !== 1 || !s || s.length < 2 || (p.closest && p.closest(WW_SKIP))) return;
    var rs = wordRanges(s), at = 0;
    if (!rs.length) { wwKeep(tn); return; }
    var frag = document.createDocumentFragment();
    rs.forEach(function (r) {
      if (r[0] > at) frag.appendChild(wwKeep(document.createTextNode(s.slice(at, r[0]))));
      var nb = document.createElement('jq-nb'); nb.textContent = s.slice(r[0], r[1]); frag.appendChild(nb);
      at = r[1];
    });
    if (at < s.length) frag.appendChild(wwKeep(document.createTextNode(s.slice(at))));
    p.replaceChild(frag, tn);
  }
  /** 一個節點（文字或元素）：裡面所有的文字節點都處理（J.UI.wrapWords，測試、手動補處理用） */
  function wwNode(n) {
    if (!n || !n.parentNode) return;
    if (n.nodeType === 3) { wwText(n); return; }
    if (n.nodeType !== 1 || (n.closest && n.closest(WW_SKIP)) || typeof document.createTreeWalker !== 'function') return;
    var tw = document.createTreeWalker(n, 4 /* NodeFilter.SHOW_TEXT */, null), t, all = [];
    while ((t = tw.nextNode())) all.push(t);
    all.forEach(wwText);
  }
  function wwObserve(root) {
    if (!root || typeof window === 'undefined' || typeof window.MutationObserver !== 'function') return null;
    var mo = new window.MutationObserver(function (list) { list.forEach(function (m) { Array.prototype.forEach.call(m.addedNodes, wwNode); }); });
    mo.observe(root, { childList: true, subtree: true });
    wwNode(root);
    return mo;
  }

  /** h('button.primary', {onclick:fn, 'aria-label':'…'}, ['文字' 或元素…]) */
  function h(sel, attrs, children) {
    var parts = sel.split('.');
    var node = document.createElement(parts[0] || 'div');
    if (parts.length > 1) node.className = parts.slice(1).join(' ');
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v === undefined || v === null || v === false) return;
      if (k.indexOf('on') === 0 && typeof v === 'function') node.addEventListener(k.slice(2), v);
      else if (k === 'html') node.innerHTML = v;
      else if (k === 'text') { if (!nbText(node, v)) node.textContent = v; }   // v1.4.1（缺陷 5）：金額、「」裡的短名稱不換行
      else if (k === 'style' && typeof v === 'object') Object.assign(node.style, v);
      else node.setAttribute(k, v === true ? '' : v);
    });
    (children || []).forEach(function (c) {
      if (c === null || c === undefined || c === false) return;
      if (typeof c !== 'string') node.appendChild(c); else if (!nbText(node, c)) node.appendChild(document.createTextNode(c));   // v1.4.1（缺陷 5）
    });
    return node;
  }

  function focusables(node) {
    return Array.prototype.filter.call(node.querySelectorAll('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'),
      function (n) { return !n.disabled && n.offsetParent !== null; });
  }

  /**
   * 開一個視窗。opts: { modal(預設 true，有半透明遮罩), label, onClose, escClose(預設 true), focus(要先聚焦的元素) }
   * 回傳 { node, close() }
   */
  function open(content, opts) {
    opts = opts || {};
    // v0.9.3 passMove：開著時主角仍然可以走（放大地圖）。遮罩變淡而且點得穿，搖桿照常顯示
    var passMove = !!opts.passMove;
    var modal = opts.modal !== false && !passMove;
    var wrap = modal ? h('div.modal-back', {}, [content]) : (passMove ? h('div.modal-back.pass', {}, [content]) : content);
    if (opts.label) { content.setAttribute('role', 'dialog'); content.setAttribute('aria-modal', modal ? 'true' : 'false'); content.setAttribute('aria-label', opts.label); }
    layer.appendChild(wrap);
    var entry = { node: wrap, content: content, onClose: opts.onClose, prevFocus: document.activeElement, escClose: opts.escClose !== false, modal: modal, passMove: passMove };
    stack.push(entry);
    setTimeout(function () {
      var f = opts.focus || focusables(content)[0];
      if (f && document.body.contains(f)) f.focus();
    }, 30);
    var handle = {
      node: content,
      close: function (silent) {
        var i = stack.indexOf(entry);
        if (i < 0) return;
        stack.splice(i, 1);
        syncBodyClass();
        if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
        // v0.9.6（47 號 B01）用滑鼠點 HUD 按鈕打開的視窗：關掉後不要把焦點還給 HUD 按鈕（鍵盤操作的照舊還回去）
        if (pointerMode && inHud(entry.prevFocus)) { blurHud(); if (inHud(document.activeElement) || (document.activeElement && entry.content.contains(document.activeElement))) document.activeElement.blur(); }
        else if (entry.prevFocus && entry.prevFocus.focus && document.body.contains(entry.prevFocus)) { try { entry.prevFocus.focus(); } catch (e) { /* 忽略 */ } }
        if (!silent && entry.onClose) entry.onClose();
      }
    };
    entry.handle = handle;
    syncBodyClass();
    return handle;
  }

  /** body.modal-open：讓觸控 B 鍵移到遮罩上方（見 style.css） */
  function syncBodyClass() {
    document.body.classList.toggle('modal-open', stack.some(function (e) { return e.modal; }));
    // v0.5：有「有關閉鈕的視窗」（.panel）開著時，右上角的提示泡泡移到畫面下方中央，不蓋住「關閉」按鈕
    document.body.classList.toggle('panel-open', stack.some(function (e) { return (e.modal || e.passMove) && e.content.classList && e.content.classList.contains('panel'); }));
    document.body.classList.toggle('pass-open', stack.some(function (e) { return e.passMove; }));
    // v1.1 畫面品管 4：戰鬥畫面開著（直放時重新排版，見 style.css）
    document.body.classList.toggle('in-battle', stack.some(function (e) { return !!(e.content.querySelector && e.content.querySelector('.battle-ui')); }));
    if (!anyModal()) flushDeferred();   // v1.4.1：視窗全部關掉，等著的系統提示才出來
  }

  function closeAll() { while (stack.length) stack[stack.length - 1].handle.close(true); }
  function isOpen() { return stack.length > 0; }
  /** v0.9.3 有沒有「擋住走路」的視窗（放大地圖這類 passMove 視窗不算） */
  function blocksMove() { return stack.some(function (e) { return !e.passMove; }); }
  /** v0.9.3 關掉所有 passMove 視窗（遇到怪物、換地圖時） */
  function closePassMove() { stack.filter(function (e) { return e.passMove; }).forEach(function (e) { e.handle.close(); }); }
  function top() { return stack[stack.length - 1] || null; }

  function onKey(e) {
    var t = top();
    if (!t) return;
    if (e.key === 'Escape' && t.escClose) { e.preventDefault(); t.handle.close(); return; }
    if (e.key === 'Tab') {   // 焦點留在最上層視窗裡
      var f = focusables(t.content);
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      else if (!t.content.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
    }
  }

  /**
   * 提示泡泡。v0.7.2：視窗開著時，「視窗打開前」出現的提示（例如「找頭上有！的人說話吧！」）先隱藏（.bg，見 style.css），
   * 關掉視窗後再顯示，至少再停 2 秒；視窗裡的操作產生的提示（例如「已複製」「金幣不夠」）照常顯示。
   */
  /*
   * v1.1 畫面品管 6：大橫幅（委託完成…）顯示時，新的提示泡泡先排隊、已經出現的先收回排隊，橫幅結束再依序出現；
   * 矮螢幕（高度 460 以下，手機橫放）同時最多 2 個泡泡、窄的直放手機最多 1 個（放在遊戲畫面和搖桿中間），其他排隊；「下一步：」排在最前面。
   */
  var toastQueue = [], bannerCount = 0, TOAST_MAX_LOW = 2, TOAST_MAX_PORTRAIT = 1;
  function lowScreen() { return (window.innerHeight || 999) <= 460; }
  function narrowPortrait() { var w = window.innerWidth || 999, ht = window.innerHeight || 0; return w <= 680 && ht > w * 1.05; }
  function toastMax() { return lowScreen() ? TOAST_MAX_LOW : narrowPortrait() ? TOAST_MAX_PORTRAIT : Infinity; }
  function toastRoom() { return bannerCount === 0 && toasts.children.length < toastMax(); }
  function pumpToasts() { while (toastQueue.length && toastRoom()) { var t = toastQueue.shift(); showToast(t.text, t.ms); } }
  /*
   * v1.4.1 上線後小問題（交接第三節第 8 點「提示泡泡蓋題目」）：opts.defer＝系統提示（例如 G.tick 的「新的一天！」），
   * 有視窗（題目、戰鬥、對話、面板）開著時先放進 deferred，不放到畫面上、不佔泡泡名額；視窗全部關掉 0.6 秒後才出現（期間又開了視窗就再等）。
   * 題目裡自己按出來的提示（刪去卡、提示、引導卡）不加 defer，照常馬上顯示。
   */
  var deferred = [];
  function anyModal() { return stack.some(function (e) { return e.modal; }); }
  function flushDeferred() {
    if (!deferred.length) return;
    setTimeout(function () { if (anyModal()) return; deferred.splice(0).forEach(function (t) { toast(t.text, t.ms); }); }, 600);
  }
  function toast(text, ms, opts) {
    if (opts && opts.defer && anyModal()) { deferred.push({ text: text, ms: ms }); return; }
    var item = { text: text, ms: ms };
    if (/^下一步/.test(String(text))) dropStaleNext();   // v1.4.1（缺陷 4）：舊的「下一步」不再冒出來
    if (!toastRoom() || toastQueue.length) {
      if (/^下一步/.test(String(text))) toastQueue.unshift(item); else toastQueue.push(item);
      pumpToasts();
      return;
    }
    showToast(text, ms);
  }
  /*
   * v1.4.1（v14_畫面審查 缺陷 4「舊的下一步又冒出來」）：視窗開著時，之前的泡泡（.bg）藏著等、大橫幅會把泡泡收回排隊，
   * 連著做兩個委託時，上一個委託的「下一步」在視窗關掉後又冒出來、和新的疊在一起。「下一步」只留最新的一則：
   * 新的「下一步」出現時，舊的（畫面上藏著的、排隊中的）丟掉。其他提示照舊。
   */
  function dropStaleNext() {
    for (var i = toastQueue.length - 1; i >= 0; i--) if (/^下一步/.test(String(toastQueue[i].text))) toastQueue.splice(i, 1);
    Array.prototype.slice.call(toasts.children).forEach(function (n) { if (/^下一步/.test(String(n.textContent)) && n.parentNode) n.parentNode.removeChild(n); });
  }
  function showToast(text, ms) {
    var bg = !stack.some(function (e) { return e.modal; });
    var n = h('div.win.toast' + (bg ? '.bg' : ''), { text: text });
    toasts.appendChild(n);
    var remove = function () { if (n.parentNode) { n.parentNode.removeChild(n); pumpToasts(); } };
    var waited = false;
    var tick = function () {
      if (!n.parentNode) return;
      if (bg && document.body.classList.contains('modal-open')) { waited = true; setTimeout(tick, 400); return; }
      if (waited) { waited = false; setTimeout(remove, 2000); return; }
      remove();
    };
    setTimeout(tick, ms || 2600);
  }

  var bannerQueue = [];
  function banner(text, cls) {
    var big = !cls || cls === 'big-banner';
    // v1.1 試玩 M2：大橫幅一次只顯示一個；前一個還在就排隊，前一個結束再出現（不會兩個框疊在一起）
    if (big && bannerCount > 0) { bannerQueue.push(text); return; }
    var n = h('div.win.' + (cls || 'big-banner'), { text: text, 'aria-hidden': 'true' });
    document.getElementById('ui').appendChild(n);
    if (big) {
      // 已經出現的泡泡先收回排隊（橫幅結束後重新顯示），新的也排隊
      Array.prototype.slice.call(toasts.children).forEach(function (t) { t.parentNode.removeChild(t); toastQueue.push({ text: t.textContent, ms: 2600 }); });
      bannerCount++; document.body.classList.add('banner-on');
    }
    setTimeout(function () {
      if (n.parentNode) n.parentNode.removeChild(n);
      if (big) {
        bannerCount = Math.max(0, bannerCount - 1);
        if (!bannerCount && bannerQueue.length) { banner(bannerQueue.shift()); return; }
        if (!bannerCount) document.body.classList.remove('banner-on');
        pumpToasts();
      }
    }, 2700);
    announce(text);
  }

  /** 載入進度條（v0.5 大地圖背景）：回傳 { set(0–1), close() } */
  function progress(label) {
    var fill = h('div.fill');
    var pct = h('span.pct', { text: '0%' });
    var n = h('div.win.load-bar', { role: 'progressbar', 'aria-label': label, 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': '0' },
      [h('div.label', {}, [label + ' ', pct]), h('div.track', {}, [fill])]);
    document.getElementById('ui').appendChild(n);
    return {
      node: n,   // 關閉：close()；全部關掉：J.UI.closeLoadBars()
      set: function (v) {
        var p = Math.max(0, Math.min(100, Math.round((v || 0) * 100)));
        fill.style.width = p + '%'; pct.textContent = p + '%'; n.setAttribute('aria-valuenow', String(p));
      },
      close: function () { if (n.parentNode) n.parentNode.removeChild(n); }
    };
  }

  /** 關掉畫面上所有的載入進度條（例如要顯示「今天冒險到這裡」時） */
  function closeLoadBars() { Array.prototype.forEach.call(document.querySelectorAll('.load-bar'), function (n) { if (n.parentNode) n.parentNode.removeChild(n); }); }

  function announce(text) { if (live) { live.textContent = ''; setTimeout(function () { live.textContent = text; }, 30); } }

  /**
   * 對話框：lines = [{who, text, taigi?, emotion?}]；ctx.speaker(who) → {name, sprite}；ctx.playerName
   * ctx.dialogId：對話 ID（找預錄音檔用）；ctx.voiceAuto：每句自動念；ctx.playerGender
   * 回傳 Promise（看完全部句子後 resolve）
   */
  function dialog(lines, ctx) {
    ctx = ctx || {};
    // 記住原本的句序（預錄音檔用 <對話ID>_<句序> 命名），再拿掉空句
    lines = (lines || []).map(function (l, idx) { return l && l.text ? { line: l, idx: idx } : null; }).filter(Boolean);
    if (!lines.length) return Promise.resolve();
    return new Promise(function (resolve) {
      var i = 0;
      var portrait = h('div.portrait', { 'aria-hidden': 'true' });
      var speaker = h('div.speaker');
      var text = h('div.text', { 'aria-live': 'polite' });
      var tailo = h('div.tailo', { lang: 'nan-Latn-TW' });
      var huayu = h('div.huayu');
      var current = null;
      var speakBtn = h('button', { onclick: function () { say(); }, 'aria-label': '朗讀這句（台語句子播台語語音；設定成華語時念華語翻譯）' }, ['🔊']);
      var nextBtn = h('button.primary', { onclick: advance }, ['下一句 ▶']);
      var skipBtn = h('button.ghost', { onclick: finish }, ['略過']);
      var box = h('div.win.dialog', {}, [portrait, h('div.grow', {}, [speaker, text, tailo, huayu, h('div.row.end', {}, [ctx.tts === false ? null : speakBtn, h('span.grow'), skipBtn, nextBtn])])]);
      var handle = open(box, { modal: true, label: '對話', escClose: true, onClose: function () { resolve(); }, focus: nextBtn });
      function say() {
        var it = lines[i], sp = ctx.speaker ? ctx.speaker(it.line.who) : { name: it.line.who };
        window.JQ.Voice.sayLine({ line: it.line, dialogId: ctx.dialogId, index: it.idx, who: it.line.who, name: sp.name, playerGender: ctx.playerGender, playerName: ctx.playerName });
      }
      function render() {
        var l = lines[i].line;
        var sp = ctx.speaker ? ctx.speaker(l.who) : { name: l.who };
        speaker.textContent = sp.name || '';
        speaker.hidden = !sp.name;
        current = window.JQ.DialogText.view(l, ctx.taigiSub, ctx.playerName);
        // v1.0.2 罕用字（例：𠢕 U+20895）這台裝置畫不出來時改顯示台羅（rarechars.js 的替代表），不會出現方框
        var RC = window.JQ.RareChars, fam = '';
        try { fam = window.getComputedStyle(text).fontFamily; } catch (e) { fam = ''; }
        var fix = function (s) { return RC ? RC.apply(s, function (c) { return RC.canRender(c, fam); }) : s; };
        text.textContent = fix(current.main);
        text.lang = current.isTaigi ? 'nan-Hant-TW' : 'zh-Hant-TW';
        tailo.textContent = current.tailo; tailo.hidden = !current.tailo;
        huayu.textContent = current.huayu ? '（華語：' + fix(current.huayu) + '）' : ''; huayu.hidden = !current.huayu;
        portrait.innerHTML = sp.sprite ? window.JQ.Assets.domIcon(sp.sprite, { size: 80, label: sp.name || '？', alt: sp.name || '' }) : '<span class="ph">' + (sp.name ? esc(sp.name.slice(0, 1)) : '…') + '</span>';
        portrait.style.visibility = l.who === 'narrator' ? 'hidden' : 'visible';
        nextBtn.textContent = i === lines.length - 1 ? '好 ✓' : '下一句 ▶';
        skipBtn.hidden = lines.length <= 2;
        if (ctx.tts !== false && ctx.voiceAuto) say();
      }
      function advance() { window.JQ.Voice.stop(); window.JQ.Audio.play('select'); i++; if (i >= lines.length) finish(); else render(); }
      function finish() { window.JQ.Voice.stop(); handle.close(); }
      render();
    });
  }

  /** 把 {name} 換成冒險者名字 */
  function fill(text, name) { return String(text || '').replace(/\{(name|player|hero)\}/g, name || '小冒險者'); }

  /** 是／否確認視窗 → Promise<boolean> */
  function confirmBox(message, yesText, noText) {
    return new Promise(function (resolve) {
      var done = false;
      var yes = h('button.primary', { onclick: function () { done = true; handle.close(); resolve(true); } }, [yesText || '好']);
      var no = h('button', { onclick: function () { done = true; handle.close(); resolve(false); } }, [noText || '不要']);
      var box = h('div.win.panel.narrow', {}, [h('p', { text: message }), h('div.row.end', {}, [no, yes])]);
      var handle = open(box, { label: message, onClose: function () { if (!done) resolve(false); }, focus: yes });
    });
  }

  /**
   * v0.9.6 多個選項（47 號 B02：有委託的旅店、商店老闆可以選「住宿／買東西」或「委託」）。
   * options = [{ value, text, primary }]；回傳 Promise<value>，按 Esc 或關閉回傳 null（什麼都不做）
   */
  function choose(message, options) {
    return new Promise(function (resolve) {
      var done = false, handle, first = null;
      var btns = options.map(function (o) {
        var b = h('button' + (o.primary ? '.primary' : ''), { onclick: function () { done = true; handle.close(); resolve(o.value); } }, [o.text]);
        if (o.primary && !first) first = b;
        return b;
      });
      btns.push(h('button.ghost', { onclick: function () { done = true; handle.close(); resolve(null); } }, ['等一下']));
      var box = h('div.win.panel.narrow.choose-box', {}, [h('p', { text: message }), h('div.row.end', {}, btns)]);
      handle = open(box, { label: message, onClose: function () { if (!done) resolve(null); }, focus: first || btns[0] });
    });
  }

  window.JQ = window.JQ || {};
  window.JQ.UI = { wordRanges: wordRanges, wrapWords: wwNode, choose: choose, init: init, h: h, esc: esc, open: open, closeAll: closeAll, isOpen: isOpen, blocksMove: blocksMove, closePassMove: closePassMove, toast: toast, progress: progress, closeLoadBars: closeLoadBars, banner: banner, announce: announce, dialog: dialog, fill: fill, confirm: confirmBox };
})();
