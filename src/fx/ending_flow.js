/*
 * v4.2 第 4b 批：大結局的畫面流程（F0–F11，大結局腳本 2.1 節唯一版本）＋頒獎（證書卡、勳章卡）＋勇者特別版＋破關後小頒獎＋重看結局。
 * 規則（發證書、金屬、證書冊、結局完成旗標、要不要接著播）都在 docs/src/systems/ending.js（J.EndingRules，node 有測試）。
 * MV 是 docs/src/fx/ending_mv.js（J.EndingMV；本檔只接線：第一次不能跳過、播完才記 flags.ending_mv_seen、onSkip 直接往下頒獎）。
 *
 * 流程（第一次）：
 *   F0 打贏佛格（BattleScene 裡）：D_FOG_KING_ASK → 兩個選項 → D_FOG_KING_END → 最終頭目曲 3 秒淡出 → 回地圖、開始 F1（game.js bvictory → finalBoss）
 *   F1 E1 佛格化成雲海（ending_e1／_f）  F2 E2 第一道曙光  F3 霧仔變小雲（D_END_E5）  F4「終章完成！」（D_CH9_END）
 *   F5 片尾曲 MV（89.5 秒）  F6 走回金包里（M01：客運站 (46,16) → 海風公園 (31,41)，鎮民在公園等）
 *   F7 頒獎：D_END_AWARD_1 → 證書卡 → D_END_AWARD_2 → 勳章卡 → D_END_AWARD_3（勇者：F7H 特別版）
 *   F8 第六盞燈亮＋E3  F9 晚上的慶祝（D_END_NIGHT）  F10 E6＋稱號「點亮曙光的人」  F11 回到地圖 (31,41)，自動存檔一次，D_END_CERT_HINT
 * 規則：結局中選單打不開、不能存檔、不算每日時間（game.js 看 G.inEnding）；中途關網頁 → 下次從 F1 接（EndingRules.needsResume）。
 * 減少動態效果：插圖不推近、不閃白（0.5 秒淡入）、霧仔兩張圖直接交叉淡換、證書勳章淡入、不放煙火光雨（大結局腳本 2.4）。
 * 安全：只用 textContent／DOM 節點組字（不用 innerHTML 塞資料）；圖檔路徑都是專案自己的 assets/ 固定路徑。
 */
(function () {
  'use strict';
  var J = window.JQ = window.JQ || {};
  var running = false;

  // 海風公園來歡迎的鎮民（大結局腳本 5.1；只在過場出現、不說話）＋里長伯站 (31,40)
  var TOWNS = [
    { sprite: 'npc_fisher', x: 28, y: 43, mood: '！' }, { sprite: 'npc_shopkeeper', x: 30, y: 43, mood: '♪' }, { sprite: 'npc_bookstore_m', x: 32, y: 43, mood: '！' },
    { sprite: 'npc_innkeeper_m', x: 34, y: 43, mood: '♪' }, { sprite: 'npc_seaweed_uncle', x: 27, y: 39, mood: '♪' }, { sprite: 'npc_temple_keeper', x: 27, y: 41, mood: '！' },
    { sprite: 'npc_chief', x: 31, y: 40 }
  ];
  // 勇者特別版：一路上的 11 位朋友（5.7 節；H1 開始才出現，免得擋路）
  var FRIENDS = [
    ['npc_elf_elder', 28, 38], ['npc_gnome_chief', 30, 38], ['npc_orc_chief', 32, 38], ['npc_goblin_chief', 34, 38], ['npc_calla_farmer', 28, 41], ['npc_fisher_hl', 34, 41],
    ['npc_reservoir_keeper', 27, 44], ['npc_old_stationmaster', 29, 44], ['npc_lighthouse_keeper', 31, 44], ['npc_balloon_captain', 33, 44], ['npc_paiyun_volunteer', 35, 44]
  ].map(function (f, i) { return { sprite: f[0], x: f[1], y: f[2], mood: i % 2 ? '♪' : '！', later: true }; });
  var HOME_START = [46, 16], HOME_MID = [[46, 36], [39, 36]], HOME_END = [[39, 38], [34, 38], [34, 41], [31, 41]];

  // 實玩 D1：小雲霧仔 npc_fog_cloud.png 是 87×120 的 3 欄 4 列走路圖（每格 29×30，列序下左右上）；結局 F3 與 MV 只畫第 0 格
  var CLOUD_SHEET = { file: 'assets/npcs/npc_fog_cloud.png', cols: 3, rows: 4 };
  function R() { return J.EndingRules; }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function url(p) { return (J.Assets && J.Assets.resolveUrl && J.Assets.resolveUrl(p)) || p; }
  function reducedOf(G) { return J.Motion ? J.Motion.reduceMotion(G.state && G.state.settings, typeof window.matchMedia === 'function' ? window.matchMedia.bind(window) : null) : false; }
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined && text !== null) n.textContent = text; return n; }

  // ───────── 插圖舞台（F1–F4、F8–F10）：在地圖上面、對話框下面 ─────────
  function openStage(ctx) {
    var wrap = el('div', 'ending-stage' + (ctx.reduced ? ' reduced' : '')), img = el('img', 'ending-img'), fog = el('div', 'ending-fog'), card = el('div', 'ending-card'), sub = el('div', 'ending-sub');
    // 4b 夜班修正 1：aria-hidden 只放在裝飾的插圖與霧（整個舞台藏起來的話，重看模式的「跳過」按鈕讀屏軟體讀不到）
    img.alt = ''; img.setAttribute('aria-hidden', 'true'); fog.setAttribute('aria-hidden', 'true');
    // 實玩 D1：小雲圖是 3×4 走路圖，只畫第 0 格（朝下）：用 div 背景裁切（ending.css .fog-cloud background-size 300% 400%）
    var fogKid = el('div', 'fog-kid'), fogCloud = el('div', 'fog-cloud');
    fog.appendChild(fogKid); fog.appendChild(fogCloud);
    wrap.appendChild(img); wrap.appendChild(fog); wrap.appendChild(card); wrap.appendChild(sub);
    var skip = null;
    if (ctx.replay) {   // 重看：右上角「跳過 ▸▸」（Esc 也可以），整段結束（和片頭動畫一樣）
      skip = el('button', 'ending-skip', '跳過 ▸▸');
      skip.addEventListener('click', function () { ctx.skipAll(); });
      wrap.appendChild(skip);
    }
    var handle = null;
    var s = {
      node: wrap,
      open: function () { if (!handle) handle = J.UI.open(wrap, { modal: false, escClose: false }); return s; },
      show: function (file, o) {
        s.open(); o = o || {};
        wrap.classList.remove('dim', 'night');
        img.classList.remove('in'); void img.offsetWidth;
        img.src = url(file);
        img.classList.add('in');
        if (o.white && !ctx.reduced) { wrap.classList.remove('white'); void wrap.offsetWidth; wrap.classList.add('white'); }
        return s;
      },
      fog: function (mode) {
        fog.className = 'ending-fog' + (mode ? ' ' + mode : '');
        if (mode === 'kid') {
          var inf = J.Assets && J.Assets.info('npc_fog_kid');
          if (inf) { fogKid.style.backgroundImage = 'url("' + url(inf.file) + '")'; fogKid.style.width = inf.frameW * 3 + 'px'; fogKid.style.height = inf.frameH * 3 + 'px'; fogKid.style.backgroundSize = inf.frameW * 3 * 3 + 'px auto'; fogKid.style.backgroundPosition = '-' + inf.frameW * 3 + 'px 0'; }
          fogCloud.style.backgroundImage = 'url("' + url(CLOUD_SHEET.file) + '")';   // 第 0 格＝左上（朝下站著）
        }
        return s;
      },
      card: function (lines) { card.textContent = ''; (lines || []).forEach(function (t, i) { card.appendChild(el('div', i ? 'small' : 'big', t)); }); card.classList.toggle('on', !!(lines && lines.length)); return s; },
      sub: function (t) { sub.textContent = t || ''; sub.classList.toggle('on', !!t); return s; },
      dim: function (on) { wrap.classList.toggle('dim', !!on); return s; },
      night: function (on) { wrap.classList.toggle('night', !!on); return s; },
      close: function () { if (handle) { handle.close(true); handle = null; } return s; }
    };
    return s;
  }

  // ───────── 對話（重看時「跳過」會關掉正在播的對話框，對話的 Promise 照常結束）─────────
  function say(ctx, id) { if (ctx.skip) return Promise.resolve(); ctx.G.endingDialogs = (ctx.G.endingDialogs || []).concat([id]); return ctx.G.say(id, []); }
  /** 只播一段對話的前幾句（勇者特別版：D_END_AWARD_1 第 0–2 句）；句序不變，預錄音檔照樣對得上 */
  function sayPart(ctx, id, n) {
    if (ctx.skip) return Promise.resolve();
    var G = ctx.G, D = G.data.dialogs || {}, lines = (D[id] || []).slice(0, n), s = G.state.settings;
    if (!lines.length) return Promise.resolve();
    G.busy = true; G.endingDialogs = (G.endingDialogs || []).concat([id + '[0-' + (n - 1) + ']']);
    return J.UI.dialog(lines, { speaker: G.speaker, playerName: G.state.player.name, playerGender: G.state.player.gender, taigiSub: s.taigiSub, tts: s.tts !== false, voiceAuto: s.voiceAuto !== false, dialogId: id })
      .then(function () { G.busy = false; });
  }

  // ───────── 證書卡、勳章卡（5.3 節；B 組美術底圖＋程式寫字；卡片出現 2 秒後才能點掉）─────────
  var FONT = '"Microsoft JhengHei", "PingFang TC", "Noto Sans TC", sans-serif';
  var TIER_COLOR = { novice: '#4f8a3a', basic: '#2c5cb0', inter: '#7a44b0', adv: '#b07a10' };
  var LAYOUT = {   // 照 art_src/v1/tools/finale_cert_preview.py 的 LAYOUT（1536×1024 底圖座標）
    v1: { cx: 768, x0: 300, x1: 1236, top: 132, title: 116, sub: 48, name: 40, body: 38, lh: 58, sign: 40, date: 33, c_title: '#b01e1e', c_title_s: '#ffeec4', c_sub: '#966212', c_text: '#402816', sign_y: 752, chief: 3, seal: 100 },
    hero: { cx: 768, x0: 236, x1: 1300, top: 212, title: 100, sub: 42, name: 36, body: 34, lh: 50, sign: 38, date: 31, c_title: '#e2a022', c_title_s: '#562c08', c_sub: '#b06014', c_text: '#402816', sign_y: 676, chief: 3, seal: 0 }
  };
  function loadImg(src) { return new Promise(function (res) { var i = new Image(); i.onload = function () { res(i); }; i.onerror = function () { res(null); }; i.src = url(src); }); }
  /** 在 1536×1024 的畫布上畫證書（勇者用金色特別版：第二行寫稱號） */
  function drawCert(cv, info, name, dateTxt, imgs) {
    var L = info.special ? LAYOUT.hero : LAYOUT.v1, g = cv.getContext('2d');
    cv.width = 1536; cv.height = 1024;
    if (imgs.bg) g.drawImage(imgs.bg, 0, 0, 1536, 1024); else { g.fillStyle = '#fbf3df'; g.fillRect(0, 0, 1536, 1024); }
    g.textBaseline = 'top'; g.textAlign = 'center';
    var y = L.top;
    g.font = 'bold ' + L.title + 'px ' + FONT; g.lineWidth = info.special ? 12 : 8; g.strokeStyle = L.c_title_s; g.fillStyle = L.c_title;
    var title = info.special ? '★ 勇 者 之 證 ★' : '勇 者 之 證';
    g.strokeText(title, L.cx, y); g.fillText(title, L.cx, y);
    y += Math.round(L.title * 1.2);
    g.font = 'bold ' + L.sub + 'px ' + FONT; g.fillStyle = L.c_sub;
    g.fillText(info.special ? (info.title || '') + '　' + name : '— 點亮曙光的人 —', L.cx, y);
    y += Math.round(L.sub * 1.45) + 6;
    // 職業名牌（圓角色塊＋白字；色塊＝職業代表色）
    var fj = Math.round(L.sub * 0.8), ph = Math.round(fj * 1.5);
    g.font = 'bold ' + fj + 'px ' + FONT;
    var w = g.measureText(info.nameplate).width, rx = L.cx - w / 2 - ph * 0.7, rw = w + ph * 1.4;
    g.fillStyle = info.color || (info.special ? '#e8b030' : (TIER_COLOR[info.tier] || '#2c5cb0'));   // v4.2 4c：職業代表色（盤點 15-2）；沒有資料才退回階級色
    roundRect(g, rx, y - 4, rw, ph, ph / 2); g.fill();
    g.fillStyle = '#fff'; g.fillText(info.nameplate, L.cx, y + ph * 0.12 - 4);
    y += ph + Math.round(L.sub * 0.3);
    if (!info.special) { g.font = 'bold ' + L.name + 'px ' + FONT; g.fillStyle = L.c_text; fitText(g, name, L.cx, y, L.x1 - L.x0, L.name, 'bold'); y += Math.round(L.lh * 1.05); }
    g.font = L.body + 'px ' + FONT; g.fillStyle = L.c_text;
    if (info.praise) { g.fillText('「' + info.praise + '」', L.cx, y); y += L.lh; }
    (info.body || []).forEach(function (line) { fitText(g, line, L.cx, y, L.x1 - L.x0, L.body, ''); y += L.lh; });
    var sy = Math.max(L.sign_y, y + Math.round(L.lh * 0.4));
    g.textAlign = 'left'; g.font = L.date + 'px ' + FONT;
    if (dateTxt) g.fillText(dateTxt, L.x0, sy + (L.sign - L.date) * 0.6);
    g.font = 'bold ' + L.sign + 'px ' + FONT;
    var sign = '金包里　里長伯', sw = g.measureText(sign).width, sx = L.x1 - sw - (L.seal ? L.seal + 10 : 0);
    g.fillText(sign, sx, sy);
    if (imgs.chief) { var k = L.chief, cw = imgs.chief.width * k, ch = imgs.chief.height * k; g.imageSmoothingEnabled = false; g.drawImage(imgs.chief, sx - cw - 16, sy + L.sign + 6 - ch, cw, ch); g.imageSmoothingEnabled = true; }
    if (L.seal) {   // 紅印「里長伯印」
      var s = L.seal, x = L.x1 - s + 6, yy = sy + L.sign / 2 - s / 2;
      g.fillStyle = 'rgba(196,32,32,0.9)'; roundRect(g, x, yy, s, s, 10); g.fill();
      g.fillStyle = '#fff4e8'; g.font = 'bold ' + Math.round(s * 0.36) + 'px ' + FONT; g.textAlign = 'center';
      g.fillText('里長', x + s / 2, yy + s * 0.1); g.fillText('伯印', x + s / 2, yy + s * 0.5);
    }
    if (info.special && imgs.witness && imgs.witness.length) {   // 見證：一路上的朋友（縮小的走路圖）
      g.textAlign = 'left'; g.font = L.date + 'px ' + FONT; g.fillStyle = L.c_text;
      var wx = L.x0, wy = sy + L.sign + 24; g.fillText('見證：一路上的朋友', wx, wy);
      imgs.witness.forEach(function (im, i) { if (im) g.drawImage(im, wx + 300 + i * 52, wy - 10, 40, 40 * im.height / Math.max(1, im.width)); });
    }
    if (imgs.medal) {   // 右下角：勳章小圖（G8 128 px）＋金屬名
      g.drawImage(imgs.medal, 1236 - 120, 870 - 120, 120, 120);
      g.textAlign = 'center'; g.font = 'bold 26px ' + FONT; g.fillStyle = L.c_text; g.fillText(info.metalName, 1236 - 60, 874);
    }
  }
  function roundRect(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
  /** 名字太長時字縮小、不換行（5.3 節） */
  function fitText(g, t, x, y, maxW, size, weight) { var s = size; g.font = (weight ? weight + ' ' : '') + s + 'px ' + FONT; while (g.measureText(t).width > maxW && s > 18) { s -= 2; g.font = (weight ? weight + ' ' : '') + s + 'px ' + FONT; } g.fillText(t, x, y); }

  function certImages(info) {
    var list = [loadImg(info.certBg), loadImg(info.icon128), loadImg((J.Assets && J.Assets.info('npc_chief') || {}).file || 'assets/npcs/npc_chief.png')];
    var wit = info.special ? (info.witnesses || []).map(function (k) { var inf = J.Assets && J.Assets.info(k); return inf ? loadImg(inf.file) : Promise.resolve(null); }) : [];
    return Promise.all(list.concat(wit)).then(function (a) { return { bg: a[0], medal: a[1], chief: a[2], witness: a.slice(3) }; });
  }
  /** 證書卡（全螢幕）：回傳 Promise（點掉才 resolve）。opts.auto＝勇者特別版自動展開、不等點（ms 後關） */
  function certCard(ctx, job, opts) {
    opts = opts || {};
    var G = ctx.G, st = G.state, info = R().jobInfo(job, G.data.jobs);
    var c = st.certs && st.certs[job], dateTxt = R().dateText(c && c.d);
    G.endingCards = (G.endingCards || []).concat(['cert:' + job]);
    return certImages(info).then(function (imgs) {
      if (ctx.skip) return;
      var cv = el('canvas', 'cert-canvas'); drawCert(cv, info, st.player.name, dateTxt, imgs);
      return showCard(ctx, el('div', 'ending-cardwin cert' + (info.special ? ' hero' : '') + (ctx.reduced ? ' reduced' : ''), null), cv, info.special ? info.title + '・勇者之證' : '勇者之證', opts);
    });
  }
  /** 勳章卡：大字「冒險者勳章」、小字「劍士・銅」（勇者「勇者勳章」／「傳說中的勇者・黃金」） */
  function medalCard(ctx, job, opts) {
    var G = ctx.G, info = R().jobInfo(job, G.data.jobs);
    G.endingCards = (G.endingCards || []).concat(['medal:' + job + ':' + info.metal]);
    var box = el('div', 'medal-box'), img = el('img', 'medal-img');
    img.alt = info.medalName + '（' + info.medalLine + '）'; img.src = url(info.medalImg);
    img.onerror = function () { img.onerror = null; img.src = url(info.icon128); };   // 大圖讀不到用 G8 小圖
    box.appendChild(img); box.appendChild(el('div', 'medal-name', info.medalName)); box.appendChild(el('div', 'medal-line', info.medalLine));
    return showCard(ctx, el('div', 'ending-cardwin medal' + (info.special ? ' hero' : '') + (ctx.reduced ? ' reduced' : ''), null), box, info.medalName, opts || {});
  }
  function showCard(ctx, win, body, label, opts) {
    return new Promise(function (resolve) {
      if (ctx.skip) { resolve(); return; }
      var hint = el('div', 'card-hint', '點一下繼續'), done = false, handle;
      win.appendChild(body); win.appendChild(hint);
      var ready = false, minMs = opts.auto ? 0 : 2000;
      function close() { if (done || !ready) return; done = true; if (handle) handle.close(true); ctx.cardClose = null; resolve(); }
      win.addEventListener('click', close);
      win.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); close(); } });
      win.tabIndex = 0;
      handle = J.UI.open(win, { modal: true, label: label, escClose: false, focus: win });
      ctx.cardClose = function () { ready = true; close(); };
      setTimeout(function () { ready = true; hint.classList.add('on'); }, minMs);
      if (opts.auto) setTimeout(function () { ready = true; close(); }, opts.auto);
    });
  }

  // ───────── 地圖：換到 M01、自動走路 ─────────
  function gotoMap(G, id, x, y, facing) {
    var n0 = G.mapReadyCount || 0, t0 = Date.now();
    G.changeMap(id, x, y, facing || 'down');
    return new Promise(function (res) {
      (function poll() {
        var sc = G.mapScene;
        if (sc && sc.mapId === id && (G.mapReadyCount || 0) > n0 && sc.p && !sc.transitioning) { res(sc); return; }
        if (Date.now() - t0 > 20000) { res(sc); return; }
        setTimeout(poll, 100);
      })();
    });
  }
  function walkTo(G, x, y) {
    var sc = G.mapScene;
    if (!sc || !sc.p) return Promise.resolve();
    var t0 = Date.now();
    var ok = sc.walkTo(x, y, null);
    return new Promise(function (res) {
      (function poll() {
        var p = sc.p;
        if (!p || G.mapScene !== sc) { res(); return; }
        var arrived = !p.moving && !(p.path && p.path.length);
        if ((arrived && p.tx === x && p.ty === y) || !ok || Date.now() - t0 > 15000) {
          if (p.tx !== x || p.ty !== y) { p.path = []; p.tx = x; p.ty = y; p.moving = false; if (sc.player) sc.player.setPosition(x * 32 + 16, y * 32 + 32); }   // 走不到（被擋）就直接放到目的地
          res(); return;
        }
        if (arrived && sc.p.tx !== x) ok = sc.walkTo(x, y, null);   // 半路被番薯仔或動物擋一下：再走一次
        setTimeout(poll, 80);
      })();
    });
  }
  function walkPath(ctx, pts) { var c = Promise.resolve(); pts.forEach(function (pt) { c = c.then(function () { if (!ctx.skip) return walkTo(ctx.G, pt[0], pt[1]); }); }); return c; }
  function faceUp(G) { var sc = G.mapScene; if (sc && sc.p && sc.player) { sc.p.facing = 'up'; try { sc.player.setFrame(sc.idleFrame(sc.heroKey, 'up')); } catch (e) { /* 忽略 */ } } }
  function heroSprite(G) { var key = J.Assets ? J.Assets.heroKey(G.state.player.gender, G.state.player.job) : null, inf = key && J.Assets.info(key); return inf ? { src: inf.file } : null; }

  // ───────── 片尾曲 MV（F5）─────────
  function playMV(ctx) {
    var G = ctx.G, st = G.state;
    return new Promise(function (resolve) {
      if (ctx.skip || !J.EndingMV || typeof J.EndingMV.play !== 'function') { ctx.mvResult = 'none'; resolve(); return; }
      var over = false, au = null, slept = false;
      if (st.settings.music !== false && typeof Audio === 'function') {
        try { au = new Audio(url('assets/music/ending_song.m4a')); au.preload = 'auto'; au.volume = Math.min(1, J.State && J.State.AUDIO ? J.State.AUDIO.musicVolume(st.settings) * 2 : 0.7); } catch (e) { au = null; }
      }
      G.stopBgm(300);
      try { if (G.phaser && G.phaser.loop && G.phaser.loop.sleep) { G.phaser.loop.sleep(); slept = true; } } catch (e) { slept = false; }   // MV 蓋滿畫面：遊戲畫面先睡著（同重看片頭）
      document.body.classList.add('opening-on');
      function done(how, reason) {
        if (over) return; over = true;
        ctx.mvResult = how; ctx.mvReason = reason || null; G.endingMv = { how: how, reason: reason || null };   // 測試用
        document.body.classList.remove('opening-on');
        if (slept) { try { G.phaser.loop.wake(); } catch (e) { /* 忽略 */ } }
        if (au) { try { au.pause(); } catch (e) { /* 忽略 */ } }
        G.held = {}; G.heldOrder = [];
        resolve();
      }
      var first = !(st.flags && st.flags.ending_mv_seen);
      var started = J.EndingMV.play({
        female: st.player.gender === 'f', hero: heroSprite(G), cloud: { src: CLOUD_SHEET.file, cols: CLOUD_SHEET.cols, rows: CLOUD_SHEET.rows }, audio: au,   // 實玩 D1：3×4 走路圖，MV 剪影只取第 0 格（ending_mv.js silhouette row 0、col 0）
        skippable: ctx.replay || !first,   // 第一次看不能跳過（N-END-2；decisions mv.first_play_skippable＝false）
        onEnd: function () { if (!ctx.replay) { if (!st.flags || typeof st.flags !== 'object') st.flags = {}; st.flags.ending_mv_seen = true; } done('end'); },   // 播完才記
        onSkip: function (reason) { done('skip', reason); }   // 'user'／'image'／'slow' → 直接往下頒獎（K16）
      });
      if (!started) done('skip', 'busy');
      ctx.mvStop = function () { try { J.EndingMV.stop(); } catch (e) { /* 忽略 */ } done('skip', 'user'); };
    });
  }

  // ───────── 勇者特別版 H2（片尾曲 v2 58.000–89.500；J.EndingMV.HERO_SPECIAL 的時間表）─────────
  function heroSpecial(ctx, post) {
    var G = ctx.G, st = G.state, HS = (J.EndingMV && J.EndingMV.HERO_SPECIAL) || { from: 58, to: 89.5, anchors: { modulation: 62, certOpen: 72, vo: 72.1, lastChord: 82.618, tapHint: 87 } };
    var A = HS.anchors, stage = ctx.stage;
    return new Promise(function (resolve) {
      if (ctx.skip) { resolve(); return; }
      var au = null, t0 = Date.now(), fired = {}, over = false;
      if (st.settings.music !== false && typeof Audio === 'function') { try { au = new Audio(url('assets/music/ending_song.m4a')); au.volume = 0.7; au.currentTime = HS.from; var pp = au.play(); if (pp && pp.catch) pp.catch(function () { au = null; }); } catch (e) { au = null; } }
      G.stopBgm(300);
      stage.open(); stage.node.classList.add('hero-h2'); if (!ctx.reduced) stage.node.classList.add('pillars');
      function now() { return au && !au.paused && au.currentTime >= HS.from ? au.currentTime : HS.from + (Date.now() - t0) / 1000; }
      var at = function (t, key, fn) { if (!fired[key] && now() >= t) { fired[key] = true; G.heroLog = (G.heroLog || []).concat([key]); fn(); } };
      var cardP = null;
      (function tick() {
        if (over) return;
        if (ctx.skip) { finish(); return; }
        at(A.modulation, 'dawn', function () { if (!post && !st.lamps[R().DAWN]) { R().lightDawn(st); if (G.mapScene && G.mapScene.updateLamps) G.mapScene.updateLamps(); } stage.node.classList.add('merge'); });   // 大結局版：第六座燈座在轉調鈸點亮
        at(66, 'e4', function () { stage.show('assets/mv/mv_v16_e4.webp'); });
        at(69, 'night', function () { stage.show('assets/ending/ending_e3.png').night(true); if (!ctx.reduced) stage.node.classList.add('fireworks'); });
        at(A.certOpen, 'cert', function () { R().awardCert(st, 'hero', Date.now(), !post); cardP = certCard(ctx, 'hero', { auto: (A.lastChord - A.certOpen - 7) * 1000 }); });
        at(A.vo, 'vo', function () { var l = ((G.data.dialogs || {}).D_END_HERO_VO || [])[0]; if (l) { stage.sub(l.text); try { J.Voice.sayLine({ line: l, dialogId: 'D_END_HERO_VO', index: 0, who: l.who, name: G.speaker(l.who).name, playerGender: st.player.gender, playerName: st.player.name }); } catch (e) { /* 忽略 */ } } });   // 自動播、字幕自動，不用點
        at(A.lastChord - 6.6, 'medal', function () { stage.sub(''); if (ctx.cardClose) ctx.cardClose(); medalCard(ctx, 'hero', { auto: 5500 }); });
        at(A.lastChord - 4.4, 'title', function () { stage.card([((R().jobInfo('hero', G.data.jobs).title) || '傳說中的勇者')]); });
        at(A.tapHint, 'tap', function () { stage.card(['點一下繼續']); stage.node.addEventListener('click', finish, { once: true }); });
        if (now() >= HS.to + 1.5) { finish(); return; }
        setTimeout(tick, 100);
      })();
      function finish() {
        if (over) return; over = true;
        if (ctx.cardClose) ctx.cardClose();
        if (!R().hasCert(st, 'hero')) R().awardCert(st, 'hero', Date.now(), !post);
        R().heroTitle(st);
        if (au) { try { au.pause(); } catch (e) { /* 忽略 */ } }
        stage.card(null).sub('').night(false); stage.node.classList.remove('hero-h2', 'pillars', 'merge', 'fireworks');
        stage.close();
        resolve();
      }
    });
  }

  // ───────── F1–F11 ─────────
  var STEP = {
    F1: function (c) { G0(c).stopBgm(2500); c.stage.show(c.female ? 'assets/ending/ending_e1_f.png' : 'assets/ending/ending_e1.png', { white: true }); return say(c, 'D_END_E1'); },
    F2: function (c) { c.stage.show('assets/ending/ending_e2.png'); return say(c, 'D_END_E2'); },
    F3: function (c) {
      c.stage.fog('kid');
      return wait(c.reduced ? 300 : 900).then(function () { c.stage.fog(c.reduced ? 'cloud' : 'poof'); if (J.Audio) J.Audio.play('select'); return wait(c.reduced ? 500 : 700); })
        .then(function () { c.stage.fog('cloud'); return say(c, 'D_END_E5'); });
    },
    F4: function (c) { c.stage.fog(null).dim(true).card(['終章完成！']); return say(c, 'D_CH9_END').then(function () { c.stage.card(null); }); },
    F5: function (c) { return playMV(c); },
    F6: function (c) {
      var G = c.G;
      c.stage.close();
      G.endingExtras = TOWNS.concat(c.hero ? FRIENDS : []); G.endingExtrasMap = 'M01'; G.endingDawnLamp = true;
      return gotoMap(G, 'M01', HOME_START[0], HOME_START[1], 'down')
        .then(function () { return say(c, 'D_END_HOME_1'); })
        .then(function () { return walkPath(c, HOME_MID); })
        .then(function () { return say(c, 'D_END_HOME_2'); })
        .then(function () { return walkPath(c, HOME_END); })
        .then(function () { faceUp(G); return wait(300); });
    },
    F7: function (c) {
      var G = c.G, st = G.state, job = st.player.job;
      return say(c, 'D_END_AWARD_1')
        .then(function () { R().awardCert(st, job, Date.now(), true); G.jingle('quest_clear', null, 'chest'); return certCard(c, job); })
        .then(function () { J.UI.toast('勇者之證收進證書冊了'); return say(c, 'D_END_AWARD_2'); })
        .then(function () { G.jingle('rare_item', null, 'chest'); return medalCard(c, job); })
        .then(function () { return say(c, 'D_END_AWARD_3'); });
    },
    F7H: function (c) {
      var G = c.G;
      return sayPart(c, 'D_END_AWARD_1', 3)
        .then(function () { if (G.mapScene && G.mapScene.showLaterExtras) G.mapScene.showLaterExtras(); return say(c, 'D_END_HERO_1'); })
        .then(function () { return heroSpecial(c, false); })
        .then(function () { return say(c, 'D_END_HERO_2'); });
    },
    F7R: function (c) {   // 重看：大結局那一張（e:1）的證書與勳章，不發證書
      var job = R().endingCertJob(c.G.state) || c.G.state.player.job;
      return certCard(c, job).then(function () { return medalCard(c, job); });
    },
    F8: function (c) {
      var G = c.G, st = G.state, p = Promise.resolve();
      if (!c.replay && !st.lamps[R().DAWN]) {
        R().lightDawn(st);
        if (G.mapScene && G.mapScene.updateLamps) G.mapScene.updateLamps();
        G.jingle('lamp_lit', null, 'lamp');
        p = wait(1400);
      }
      return p.then(function () { c.stage.show('assets/ending/ending_e3.png'); return say(c, 'D_END_E3'); });
    },
    F9: function (c) { c.stage.night(true); return say(c, 'D_END_NIGHT'); },
    F10: function (c) {
      var G = c.G;
      c.stage.show('assets/ending/ending_e6.png');
      G.jingle('ending', null, 'win', 12000);
      c.stage.card(['稱號「' + R().TITLE_END + '」', '勇者大冒險製作團隊', '台語語音：Meta MMS-TTS（CC BY-NC 4.0）']);
      return say(c, 'D_END_E6').then(function () { c.stage.card(null); });
    },
    F11: function (c) {
      var G = c.G, st = G.state;
      c.stage.close();
      R().finish(st, G.data.quests, G.data);
      G.endingExtras = null; G.endingExtrasMap = null; G.endingDawnLamp = false;
      return gotoMap(G, 'M01', 31, 41, 'up').then(function () {
        G.inEnding = false;
        return G.save();   // F11 自動存一次（大結局腳本 2.2）
      }).then(function () {
        G.refreshHud(); J.HUD.show(true);
        return G.say('D_END_CERT_HINT', []);
      }).then(function () { var q = G.data.quests[R().END_Q2]; if (q && q.log_next) J.UI.toast('下一步：' + q.log_next, 6000); });
    }
  };
  function G0(c) { return c.G; }

  function cleanup(ctx) {
    var G = ctx.G;
    running = false;
    if (ctx.stage) ctx.stage.close();
    if (ctx.keyHandler) window.removeEventListener('keydown', ctx.keyHandler, true);
    G.inEnding = false; G.endingReplay = false;
    G.endingExtras = null; G.endingExtrasMap = null; G.endingDawnLamp = false;
    J.HUD.show(true); G.refreshHud();
    if (ctx.replay && ctx.prevBgm) { G.currentBgm = null; G.bgm(ctx.prevBgm); }
    G.endingRuns = (G.endingRuns || 0) + 1;   // 測試用
  }

  /**
   * 播大結局。opts = { replay（家長重看：可跳過、不改存檔、不發證書）, resume（中途關網頁後接著播） }。回傳 Promise<true＝播完>
   */
  function play(G, opts) {
    opts = opts || {};
    if (running || !G.state || !R()) return Promise.resolve(false);
    running = true;
    var st = G.state, replay = !!opts.replay;
    var ctx = { G: G, replay: replay, reduced: reducedOf(G), female: st.player.gender === 'f', hero: !replay && st.player.job === 'hero', skip: false, prevBgm: G.currentBgm };
    ctx.skipAll = function () {
      if (!replay || ctx.skip) return;
      ctx.skip = true;
      if (ctx.mvStop) ctx.mvStop();
      if (ctx.cardClose) ctx.cardClose();
      // 正在播的對話框：關掉（對話的 Promise 會照常結束）
      var t = J.UI.top && J.UI.top();
      if (t && t.content && t.content.classList && t.content.classList.contains('dialog')) t.handle.close();
    };
    if (replay) { ctx.keyHandler = function (e) { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); ctx.skipAll(); } }; window.addEventListener('keydown', ctx.keyHandler, true); }
    G.inEnding = true; G.endingReplay = replay; G.endingLog = [];
    J.UI.closePassMove(); J.HUD.prompt(null); J.HUD.show(false);
    ctx.stage = openStage(ctx);
    var steps = replay ? ['F1', 'F2', 'F3', 'F4', 'F5', 'F7R', 'F8', 'F9', 'F10'] : R().flowSteps(st.player.job);
    var chain = Promise.resolve();
    steps.forEach(function (s) { chain = chain.then(function () { if (ctx.skip) return; G.endingLog.push(s); return STEP[s](ctx); }); });
    return chain.then(function () { return true; }, function (e) { if (typeof console !== 'undefined') console.error('[結局]', e); return false; })
      .then(function (ok) { cleanup(ctx); return ok; });
  }

  /** F0：打贏佛格之後（戰鬥畫面還開著）：D_FOG_KING_ASK → 兩個選項 → D_FOG_KING_END → 最終頭目曲 3 秒淡出 → 回地圖 → F1 */
  function finalBoss(G, bctx) {
    var D = G.data.dialogs || {}, a = (D.D_FOG_KING_CHOICE_A || [])[0], b = (D.D_FOG_KING_CHOICE_B || [])[0];
    return G.say('D_FOG_KING_ASK', [])
      .then(function () { return J.UI.choose('你們……會記得我嗎？', [{ value: 'A', text: a ? a.text : '會！', primary: true }, { value: 'B', text: b ? b.text : '我們會把你寫進故事裡！' }]); })
      .then(function (v) { G.fogKingChoice = v || 'A'; return G.say(v === 'B' ? 'D_FOG_KING_CHOICE_B' : 'D_FOG_KING_CHOICE_A', []); })   // 兩個選項都走向同一個結局
      .then(function () { return G.say('D_FOG_KING_END', []); })
      .then(function () { G.stopBgm(3000); return wait(G.bwait ? G.bwait(1200) : 1200); })
      // 4b 夜班建議 4：bend 之後直接進結局（不再等 400 ms：play 一開始就設 inEnding，計時上限畫面、地圖音樂不會先冒出來）
      .then(function () { G.bend('win'); return play(G, {}); })
      // 4b 夜班建議 7：F0 任何一步出錯 → 關掉戰鬥、清掉結局狀態回地圖；Q_END_1 已完成、ending_done 還沒有＝needsResume，下次地圖好了（onMapReady）從 F1 接著播
      .catch(function (e) {
        if (typeof console !== 'undefined') console.error('[結局 F0]', e);
        G.finalBossErrors = (G.finalBossErrors || 0) + 1;   // 測試用
        try { if (G.battleCtx && !G.battleCtx.over) G.bend('win'); } catch (e2) { /* 戰鬥畫面已經關了 */ }
        running = false; G.inEnding = false; G.endingReplay = false;
        if (J.HUD) J.HUD.show(true);
        if (!G.endingResumeQueued && R() && R().needsResume(G.state, G.data.quests)) { G.endingResumeQueued = true; resumeWhenReady(G); }   // 等地圖好了從 F1 接（只排一次）
        return false;
      });
  }

  /** 中途關網頁後重開：等地圖好了、沒有別的對話視窗，才從 F1 接著播 */
  function resumeWhenReady(G) {
    var t0 = Date.now();
    (function poll() {
      if (running || !G.state || !R() || !R().needsResume(G.state, G.data.quests)) { G.endingResumeQueued = false; return; }
      var sc = G.mapScene, battle = G.battleCtx && !G.battleCtx.over;
      if (sc && sc.p && !sc.transitioning && !G.mapChanging && !G.busy && !battle && !(J.UI.isOpen && J.UI.isOpen())) { G.endingResumed = (G.endingResumed || 0) + 1; play(G, { resume: true }).then(function () { G.endingResumeQueued = false; }); return; }
      if (Date.now() - t0 > 120000) { G.endingResumeQueued = false; return; }
      setTimeout(poll, 400);
    })();
  }

  /** 破關後和里長伯說話（大結局腳本 5.5）：小頒獎／勇者特別版（破關後版）／平常的話 */
  function chiefTalk(G, npc, scene) {
    var R0 = R(), st = G.state, branch = R0.chiefBranch(st, G.data.jobs), job = st.player.job;
    G.lastChiefBranch = branch;   // 測試用
    if (branch === 'idle' || branch === 'idle_hint') return G.say('D_END_CHIEF_IDLE', []).then(function () { if (branch === 'idle_hint') return G.say('D_END_CERT_HINT', []); });
    if (running) return Promise.resolve();
    running = true;
    var ctx = { G: G, replay: false, reduced: reducedOf(G), female: st.player.gender === 'f', hero: branch === 'hero', skip: false };
    G.inEnding = true; G.endingReplay = false; J.HUD.prompt(null);   // 小頒獎、特別版：不算每日時間、不能存檔，結束時自動存檔（5.5 節）
    var p;
    if (branch === 'cert') {
      p = G.say('D_END_CERT_1', [])
        .then(function () { R0.awardCert(st, job, Date.now(), false); G.jingle('quest_clear', null, 'chest'); return certCard(ctx, job); })
        .then(function () { return G.say('D_END_AWARD_2', []); })
        .then(function () { G.jingle('rare_item', null, 'chest'); return medalCard(ctx, job); })
        .then(function () { return G.say('D_END_CERT_2', []); });
    } else {   // 'hero'：H0 → 海風公園 → H1 → H2 → H3 → 回原位
      ctx.stage = openStage(ctx);
      J.HUD.show(false);
      G.endingExtras = TOWNS.concat(FRIENDS); G.endingExtrasMap = 'M01';
      p = G.say('D_END_HERO_CALL', [])
        .then(function () { return gotoMap(G, 'M01', 31, 41, 'up'); })
        .then(function () { faceUp(G); if (G.mapScene && G.mapScene.showLaterExtras) G.mapScene.showLaterExtras(); return G.say('D_END_HERO_1', []); })
        .then(function () { return heroSpecial(ctx, true); })
        .then(function () { return G.say('D_END_HERO_2', []); })
        .then(function () { G.endingExtras = null; G.endingExtrasMap = null; return gotoMap(G, 'M01', 31, 41, 'up'); });
    }
    return p.catch(function (e) { if (typeof console !== 'undefined') console.error('[頒獎]', e); }).then(function () {
      running = false;
      if (ctx.stage) ctx.stage.close();
      G.endingExtras = null; G.endingExtrasMap = null;
      G.inEnding = false; J.HUD.show(true);
      G.save(); G.refreshHud();
      if (scene && scene.refreshMarkers && G.mapScene === scene) scene.refreshMarkers();
    });
  }

  /** 證書冊裡點一張領過的證書：全螢幕證書＋勳章（截圖用；右上角小「×」、Esc 也能關；畫面下方淡淡「可以截圖留念喔！」） */
  function viewCert(G, job) {
    var info = R().jobInfo(job, G.data.jobs), st = G.state, c = st.certs && st.certs[job];
    return certImages(info).then(function (imgs) {
      var cv = el('canvas', 'cert-canvas'); drawCert(cv, info, st.player.name, R().dateText(c && c.d), imgs);
      var medal = el('img', 'medal-img'); medal.alt = ''; medal.src = url(info.medalImg); medal.onerror = function () { medal.onerror = null; medal.src = url(info.icon128); };
      var side = el('div', 'cert-side'); side.appendChild(medal); side.appendChild(el('div', 'medal-name', info.medalName)); side.appendChild(el('div', 'medal-line', info.medalLine));
      var x = el('button', 'cert-x', '×'); x.setAttribute('aria-label', '關閉');
      var tip = el('div', 'cert-tip', '可以截圖留念喔！');
      var win = el('div', 'cert-view' + (info.special ? ' hero' : '') + (reducedOf(G) ? ' reduced' : ''));
      win.appendChild(cv); win.appendChild(side); win.appendChild(x); win.appendChild(tip);
      var handle = J.UI.open(win, { modal: true, label: info.name + '的勇者之證', escClose: true, focus: x });
      x.addEventListener('click', function () { handle.close(); });
      document.body.classList.add('cert-viewing');
      var mo = setInterval(function () { if (!document.body.contains(win)) { clearInterval(mo); document.body.classList.remove('cert-viewing'); } }, 300);
      return handle;
    });
  }

  J.Ending = { play: play, finalBoss: finalBoss, resumeWhenReady: resumeWhenReady, chiefTalk: chiefTalk, viewCert: viewCert, drawCert: drawCert,
    isRunning: function () { return running; }, TOWNS: TOWNS, FRIENDS: FRIENDS, HOME: { start: HOME_START, mid: HOME_MID, end: HOME_END }, LAYOUT: LAYOUT };
})();
