/*
 * 小地圖（v0.4，v0.5 支援大地圖）：畫面右上角的背景縮圖＋主角、NPC、出口、商店旅店、車站、寶箱；點一下放大，
 * 放大後旁邊列出「本地圖 NPC（點一下閃爍位置）」與「本地圖怪物（圖示、名稱、等級、遇見／打倒）」。
 * - 依地圖大小自動縮放；大地圖（超過 LOCAL_W×LOCAL_H 格）時，右上角小地圖只顯示主角附近（以主角為中心）
 * - 放大地圖一律顯示整張，並標示 NPC、出口、商店、寶箱（已開／未開）
 */
(function () {
  'use strict';
  var J = window.JQ;
  function h() { return J.UI.h.apply(null, arguments); }
  var SHOP_COLOR = { weapon: '#e0603a', armor: '#3b8fd6', item: '#2f8f4a', general: '#d0a020', inn: '#a15ad8' };
  var SHOP_SHORT = { weapon: '武', armor: '防', item: '道', general: '雜', inn: '旅' };
  // v0.9.6（47 號 B07）小地圖的委託記號：顏色、符號和頭頂的泡泡（MapScene.makeUiTextures 的 ui:bang、ui:ready）一樣
  var MARKS = { 'new': { color: '#ffd34d', sym: '!' }, ready: { color: '#7be08a', sym: '?' }, proverb: { color: '#7fc8ff', sym: '?' } };   // v1.3.1 可以挑錯（藍色）
  var LOCAL_W = 40, LOCAL_H = 25;   // 大地圖時小地圖顯示的範圍（格）
  var box = null, canvas = null, caption = null, levelCap = null, timer = 0, gridCache = {}, bigHandle = null;
  /** 「寶箱：還剩 N 個」（這張地圖還沒打開的寶箱數；沒有寶箱的地圖不顯示） */
  function chestText(info) {
    var cs = info.chests || [];
    if (!cs.length) return '';
    return '寶箱：還剩 ' + cs.filter(function (c) { return !c.open; }).length + ' 個';
  }

  /** 沒有背景圖時的底圖：可走／不可走上色（每格 4 像素，整張只畫一次） */
  function gridImage(info) {
    var key = info.mapId + ':' + info.w + 'x' + info.h;
    if (gridCache[key]) return gridCache[key];
    var c = document.createElement('canvas'); c.width = info.w * 4; c.height = info.h * 4;
    var g = c.getContext('2d');
    for (var y = 0; y < info.h; y++) for (var x = 0; x < info.w; x++) { g.fillStyle = info.walk(x, y) ? '#7cc45a' : '#3d5a3d'; g.fillRect(x * 4, y * 4, 4, 4); }
    gridCache[key] = c;
    return c;
  }

  /** 大地圖用局部顯示：以主角為中心、不超出地圖的範圍（格） */
  function viewFor(info, local) {
    if (!local || (info.w <= LOCAL_W && info.h <= LOCAL_H)) return { x: 0, y: 0, w: info.w, h: info.h };
    var w = Math.min(info.w, LOCAL_W), hh = Math.min(info.h, LOCAL_H);
    var x = Math.max(0, Math.min(info.w - w, info.player.x - Math.floor(w / 2)));
    var y = Math.max(0, Math.min(info.h - hh, info.player.y - Math.floor(hh / 2)));
    return { x: x, y: y, w: w, h: hh };
  }

  /** 置中寫字時，讓整個字串留在 0～canvasW 之內（左右留 3px）：回傳新的中心 x */
  function labelX(x, textW, canvasW) {
    var half = textW / 2 + 3;
    if (textW + 6 >= canvasW) return canvasW / 2;
    return Math.max(half, Math.min(canvasW - half, x));
  }
  /**
   * v0.9.6（47 號 B13、B14）放大地圖畫布的大小上限：橫向（電腦、平板橫放）用一半寬，面板靠左放，右邊露出遊戲畫面可以點；
   * 直向（平板直放）用幾乎整個寬度，人物清單排到下面
   */
  function bigMax(vw, vh) {
    if (vh > vw) return { w: Math.min(700, vw - 60), h: Math.min(440, vh * 0.42) };
    return { w: Math.min(580, vw * 0.5), h: Math.min(440, vh * 0.62) };
  }

  /**
   * v1.0.5（老闆 2026-10-14：小朋友還沒學過方位）方位圖的位置與大小：左下角，四個字「北東南西」都在畫布裡。
   * 地圖一律「上北下南、左西右東」（maps.js：金包里北邊是海、往南到擎天草原、往東到野柳，和真實地理一致）。
   * 放左下角、不放四邊正中間：出口常在四邊正中間，字會擋住出口。回傳 { cx, cy, arm, fs, outer }（像素）
   */
  function compassBox(W, H, big) {
    var fs = big ? Math.max(13, Math.min(18, Math.round(Math.min(W, H) * 0.045))) : Math.max(10, Math.min(13, Math.round(Math.min(W, H) * 0.11)));
    var arm = Math.round(fs * 1.25), outer = arm + Math.round(fs * 0.75), pad = big ? 6 : 3;
    return { cx: pad + outer, cy: H - pad - outer, arm: arm, fs: fs, outer: outer };
  }
  /** 畫方位圖：半透明深色圓底、紅色箭頭指北、四個字。畫在圓點下面，不蓋住人物、出口、委託記號 */
  function drawCompass(g, W, H, big) {
    var c = compassBox(W, H, big), cx = c.cx, cy = c.cy, a = c.arm, s = c.fs * 0.32;
    g.save();
    g.beginPath(); g.arc(cx, cy, c.outer, 0, Math.PI * 2);
    g.fillStyle = 'rgba(11,18,54,0.55)'; g.fill();
    g.lineWidth = 1; g.strokeStyle = 'rgba(255,255,255,0.55)'; g.stroke();
    var tip = a - c.fs * 0.55;   // 箭頭不碰到字
    g.lineWidth = big ? 2 : 1.5; g.strokeStyle = 'rgba(255,255,255,0.8)';
    g.beginPath(); g.moveTo(cx - tip, cy); g.lineTo(cx + tip, cy); g.moveTo(cx, cy); g.lineTo(cx, cy + tip); g.stroke();
    g.beginPath(); g.moveTo(cx, cy - tip); g.lineTo(cx - s, cy); g.lineTo(cx + s, cy); g.closePath();   // 指北的紅色箭頭
    g.fillStyle = '#ff5a5a'; g.fill();
    g.font = 'bold ' + c.fs + 'px "Microsoft JhengHei","PingFang TC","Noto Sans TC",sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round'; g.lineWidth = 3; g.strokeStyle = 'rgba(10,16,48,0.95)';
    [['北', 0, -a, '#ffb0b0'], ['南', 0, a, '#ffffff'], ['西', -a, 0, '#ffffff'], ['東', a, 0, '#ffffff']].forEach(function (d) {
      g.strokeText(d[0], cx + d[1], cy + d[2]); g.fillStyle = d[3]; g.fillText(d[0], cx + d[1], cy + d[2]);
    });
    g.restore();
  }

  /** v0.9.5 放大地圖上的地點名稱（白字深色描邊，小字；不蓋住圓點） */
  function drawPlaces(g, info, view, cw, ch) {
    var list = info.places || [];
    if (!list.length) return;
    var fs = Math.max(11, Math.min(15, Math.round(Math.min(cw, ch) * 2)));
    g.font = 'bold ' + fs + 'px "Microsoft JhengHei","PingFang TC","Noto Sans TC",sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round';
    var CW = view.w * cw;
    list.forEach(function (pl) {
      var x = (pl.x - view.x) * cw, y = (pl.y - view.y) * ch;
      if (x < 0 || y < 0 || x > CW || y > view.h * ch) return;
      // v0.9.6（47 號 B13）地名夾在畫布裡（平板直向「海風國小（校門與操場）」左邊被切掉）
      x = labelX(x, g.measureText(pl.name).width, CW);
      g.lineWidth = 3; g.strokeStyle = 'rgba(10,16,48,0.9)'; g.strokeText(pl.name, x, y);
      g.fillStyle = '#fff6d8'; g.fillText(pl.name, x, y);
    });
  }

  /** 畫一張地圖（小地圖與放大圖共用）。view＝顯示範圍（格）；blink = {x,y,until}：閃爍的位置；mark＝{x,y}：點放大地圖要走去的地方 */
  function draw(cv, info, big, blink, view, mark) {
    view = view || { x: 0, y: 0, w: info.w, h: info.h };
    var g = cv.getContext('2d'), W = cv.width, H = cv.height;
    var cw = W / view.w, ch = H / view.h, r = Math.max(2.5, Math.min(cw, ch) * (big ? 0.42 : 0.6));
    if (big && info.w > LOCAL_W) r = Math.max(3.5, Math.min(cw, ch) * 0.75);   // 大地圖整張看時每格很小，圓點畫大一點
    g.clearRect(0, 0, W, H);
    var src = info.bg, ok = false;
    if (src) {
      try {
        var kx = src.width / info.w, ky = src.height / info.h;
        g.drawImage(src, view.x * kx, view.y * ky, view.w * kx, view.h * ky, 0, 0, W, H);
        ok = true;
      } catch (e) { ok = false; }
    }
    if (!ok) g.drawImage(gridImage(info), view.x * 4, view.y * 4, view.w * 4, view.h * 4, 0, 0, W, H);
    g.fillStyle = 'rgba(10,18,50,0.18)'; g.fillRect(0, 0, W, H);
    drawCompass(g, W, H, big);
    if (big) drawPlaces(g, info, view, cw, ch);
    function px(x) { return (x - view.x + 0.5) * cw; }
    function py(y) { return (y - view.y + 0.5) * ch; }
    function inside(x, y) { return x >= view.x - 1 && y >= view.y - 1 && x <= view.x + view.w && y <= view.y + view.h; }
    function dot(x, y, color, rad) {
      if (!inside(x, y)) return;
      g.beginPath(); g.arc(px(x), py(y), rad, 0, Math.PI * 2);
      g.fillStyle = color; g.fill();
      g.lineWidth = big ? 2 : 1; g.strokeStyle = '#1d2b5e'; g.stroke();
    }
    info.exits.forEach(function (e) { if (inside(e.x, e.y)) { g.fillStyle = '#6ae0f0'; g.fillRect((e.x - view.x) * cw, (e.y - view.y) * ch, Math.max(2, cw), Math.max(2, ch)); } });
    if (info.station && inside(info.station.x, info.station.y)) { g.fillStyle = '#ffffff'; g.fillRect((info.station.x - view.x) * cw, (info.station.y - view.y) * ch, Math.max(3, cw), Math.max(3, ch)); }
    // v0.9.1 老闆指示：寶箱不標位置（讓小朋友自己找），只在旁邊顯示「寶箱：還剩 N 個」
    info.npcs.forEach(function (n) { dot(n.x, n.y, '#4aa3ff', r); });
    // 商店、旅店畫在店主人上面（比較大的彩色圓圈＋字），才看得出是店
    info.shops.forEach(function (s) {
      dot(s.x, s.y, SHOP_COLOR[s.kind] || '#d0a020', r * 1.25);
      if (big && inside(s.x, s.y)) { g.fillStyle = '#fff'; g.font = 'bold ' + Math.round(r * 1.6) + 'px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(SHOP_SHORT[s.kind] || '店', px(s.x), py(s.y)); }
    });
    info.monsters.forEach(function (m) { dot(m.x, m.y, m.boss ? '#ff5050' : '#ff9a7a', r * (m.boss ? 1.2 : 0.8)); });
    if (mark && inside(mark.x, mark.y) && !(mark.x === info.player.x && mark.y === info.player.y)) {   // 要走去的地方：白色叉叉
      var mx = px(mark.x), my = py(mark.y), mr = Math.max(4, r * 1.1);
      g.lineCap = 'round';
      g.lineWidth = 5; g.strokeStyle = '#1d2b5e';
      g.beginPath(); g.moveTo(mx - mr, my - mr); g.lineTo(mx + mr, my + mr); g.moveTo(mx + mr, my - mr); g.lineTo(mx - mr, my + mr); g.stroke();
      g.lineWidth = 2.5; g.strokeStyle = '#ffffff';
      g.beginPath(); g.moveTo(mx - mr, my - mr); g.lineTo(mx + mr, my + mr); g.moveTo(mx + mr, my - mr); g.lineTo(mx - mr, my + mr); g.stroke();
    }
    dot(info.player.x, info.player.y, '#ffd34d', r * 1.3);
    // v0.9.5 有委託可以接／可以回報的人：圓點上方畫記號（和頭頂的記號同一個判斷）。
    // v0.9.6（47 號 B07）和頭頂一致：有新委託＝黃色「!」（ui:bang #ffd34d）；可以回報＝綠色「?」（ui:ready #7be08a）
    info.npcs.forEach(function (n) {
      if (!n.mark || !inside(n.x, n.y)) return;
      var m = MARKS[n.mark] || MARKS['new'];
      // 圓點上方一個醒目的圓形徽章，裡面一個粗的符號（全形字在小字時太細，看不出來）
      var rad = big ? Math.max(8, r * 1.8) : Math.max(6, r * 1.4);
      var bx = px(n.x), by = py(n.y) - r - rad * 0.95;
      g.beginPath(); g.arc(bx, by, rad, 0, Math.PI * 2);
      g.fillStyle = m.color; g.fill();
      g.lineWidth = big ? 2.5 : 2; g.strokeStyle = '#1d2b5e'; g.stroke();
      g.fillStyle = '#1d2b5e';
      if (m.sym === '!') {
        var bw = Math.max(2, rad * 0.32);
        g.fillRect(bx - bw / 2, by - rad * 0.62, bw, rad * 0.78);   // 「!」的直線
        g.fillRect(bx - bw / 2, by + rad * 0.3, bw, bw);             // 「!」的點
      } else {
        g.font = '900 ' + Math.round(rad * 1.5) + 'px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
        g.fillText('?', bx, by + rad * 0.08);
      }
    });
    if (blink && Date.now() < blink.until && Math.floor(Date.now() / 200) % 2 === 0) {
      g.beginPath(); g.arc(px(blink.x), py(blink.y), r * 3, 0, Math.PI * 2); g.lineWidth = 3; g.strokeStyle = '#ffd34d'; g.stroke();
    }
  }

  function size(info, maxW, maxH) {
    var s = Math.min(maxW / info.w, maxH / info.h);
    return { w: Math.round(info.w * s), h: Math.round(info.h * s) };
  }

  /** 換地圖時呼叫：建立（或更新）右上角的小地圖 */
  function attach(G, scene) {
    var hud = document.getElementById('hud');
    if (!box) {
      canvas = h('canvas', { 'aria-hidden': 'true' });
      caption = h('span.mm-caption');
      levelCap = h('span.mm-level');   // v0.9.3 建議等級「Lv1–4」
      // v0.9.6（47 號 B03）放大地圖已經開著時再點小地圖＝關掉（不再疊出第二張）
      box = h('button.minimap', { onclick: function () { if (bigHandle) { bigHandle.close(); return; } if (!G.blocked()) openBig(G); }, 'aria-label': '小地圖（點一下放大）' }, [levelCap, canvas, caption]);
      hud.appendChild(box);
    }
    // v2.0（老闆 2026-10-26）洞窟、迷宮（maps.js no_minimap: true）：小地圖整個不顯示（連寶箱數也不顯示）、放大地圖也關掉；換到一般地圖就恢復
    var off = !!(scene.map && scene.map.no_minimap === true);
    box.hidden = off;
    if (off) { clearInterval(timer); timer = 0; if (bigHandle) bigHandle.close(); Minimap.offLog = (Minimap.offLog || 0) + 1; return; }
    var info = scene.minimapInfo();
    var v0 = viewFor(info, true);
    var sz = size({ w: v0.w, h: v0.h }, 170, 110);
    canvas.width = sz.w; canvas.height = sz.h;
    box.dataset.local = String(v0.w < info.w || v0.h < info.h);   // 測試用：是不是局部顯示
    box.setAttribute('aria-label', '小地圖：' + (info.name || '') + '（點一下放大）' + (chestText(info) ? '，' + chestText(info) : ''));
    caption.textContent = chestText(info);
    caption.hidden = !caption.textContent;
    levelCap.textContent = J.MapInfo.levelText(scene.map, scene.mapId) ? '建議 ' + J.MapInfo.levelText(scene.map, scene.mapId) : '';
    levelCap.hidden = !levelCap.textContent;
    clearInterval(timer);
    timer = setInterval(function () {
      if (!G.mapScene || G.mapScene !== scene || !scene.p || !scene.sys.isActive()) return;
      try { var inf = scene.minimapInfo(); draw(canvas, inf, false, null, viewFor(inf, true)); caption.textContent = chestText(inf); caption.hidden = !caption.textContent; } catch (e) { /* 換圖中 */ }
    }, 300);
    draw(canvas, info, false, null, v0);
  }

  /** 放大的地圖（整張）＋NPC 名單＋怪物列表 */
  function openBig(G) {
    var sc = G.mapScene;
    if (!sc) return null;
    if (sc.map && sc.map.no_minimap === true) return null;   // v2.0 洞窟、迷宮不給地圖
    var info = sc.minimapInfo(), D = G.data, st = G.state;
    if (bigHandle && document.body.contains(bigHandle.node)) return bigHandle;   // v0.9.6 B03 已經開著就不再開
    var mx = bigMax(window.innerWidth, window.innerHeight), sz = size(info, mx.w, mx.h);
    var big = h('canvas.minimap-big', { width: sz.w, height: sz.h, role: 'img', 'aria-label': (info.name || '') + '的地圖（點一下地圖，主角就會走過去）' });
    var blink = null, dest = null;
    function redraw() {
      if (!sc.p || G.mapScene !== sc) return;
      var inf = sc.minimapInfo();
      if (dest && ((inf.player.x === dest.x && inf.player.y === dest.y) || !sc.p.path.length && !sc.p.moving)) dest = null;   // 走到了（或被擋下來）就拿掉叉叉
      draw(big, inf, true, blink, null, dest);
    }
    var t = setInterval(redraw, 150);
    // v0.9.5（老闆：放大地圖打開後點畫面不能走）：點放大地圖上的一格 → 主角用 A* 走過去，地圖保持開著，「你」跟著動
    big.addEventListener('click', function (e) {
      if (!sc.p || G.mapScene !== sc || G.blocked()) return;
      var r = big.getBoundingClientRect();
      var inf = sc.minimapInfo();
      var tile = J.MapInfo.tileFromMinimap(e.clientX - r.left - big.clientLeft, e.clientY - r.top - big.clientTop, big.clientWidth, big.clientHeight, { x: 0, y: 0, w: inf.w, h: inf.h });
      if (!tile) return;
      var to = sc.walkFromMap(tile.x, tile.y);
      Minimap.lastTap = { tile: tile, to: to };   // 測試用
      if (to) { dest = to; J.Audio.play('select'); redraw(); }
    });
    var npcList = h('ul.list.compact', { 'aria-label': '本地圖的人' });
    info.npcs.forEach(function (n) {
      // v0.9.5 有委託可以接／回報的人，名單上也加「！」
      npcList.appendChild(h('li', {}, [h('button', { onclick: function () { blink = { x: n.x, y: n.y, until: Date.now() + 2000 }; sc.flashAt(n.x, n.y); } },
        ['📍 ' + n.name + (n.mark ? (n.mark === 'ready' ? '（？可以回報）' : n.mark === 'proverb' ? '（？可以挑錯）' : '（！有委託）') : '')])]));
    });
    (info.places || []).forEach(function (pl) { npcList.appendChild(h('li.mm-place', {}, [h('span', { text: '🏯 ' + pl.name })])); });
    info.shops.forEach(function (s) { npcList.appendChild(h('li', {}, [h('span', { text: '🏠 ' + s.text + '（' + (SHOP_SHORT[s.kind] || '') + '）' })])); });
    if (!info.npcs.length) npcList.appendChild(h('li', { text: '這裡沒有人。' }));
    if (chestText(info)) npcList.appendChild(h('li.mm-chests', {}, [h('span', { text: '🧰 ' + chestText(info) + '（位置要自己找喔）' })]));
    var monList = h('ul.list.compact', { 'aria-label': '本地圖的怪物' });
    var ids = [];
    (sc.map.spawns || []).forEach(function (s) { if (D.monsters[s.monster] && ids.indexOf(s.monster) < 0) ids.push(s.monster); });
    ids.forEach(function (id) {
      var m = D.monsters[id], r = (st.bestiary || {})[id] || { seen: 0, defeated: 0 }, known = r.seen > 0;
      monList.appendChild(h('li', {}, [h('span.icon.book-icon' + (known ? '' : '.unknown'), { html: J.Assets.domIcon(m.sprite, { size: 40, label: '?', alt: '' }) }),
        h('div.what', {}, [h('b', { text: known ? m.name + '　等級 ' + m.level : '？？？' }),
          h('div.small', { text: known ? ('已遇見 ' + r.seen + ' 次・已打倒 ' + r.defeated + ' 次') : '還沒遇見' })])]));
    });
    if (!ids.length) monList.appendChild(h('li', { text: '這裡沒有怪物。' }));
    var legend = h('p.small', { text: '方位：上面是北，下面是南，左邊是西，右邊是東。點地圖上的地方，主角就會走過去。🟡 你　🔵 人　！ 有委託　？ 可以回報　🟠 怪物　🔷 出口　⬜ 車站　彩色圓圈：武＝武器店、防＝防具店、道＝道具店、雜＝雜貨店、旅＝旅店' });
    var handle;
    var mapBox = h('div.mm-map', {}, [big, legend]);
    mapBox.style.width = sz.w + 6 + 'px';   // 圖例跟著地圖寬度換行
    var panel = h('div.win.panel.minimap-panel', {}, [h('button.close.ghost', { onclick: function () { handle.close(); }, 'aria-label': '關閉' }, ['✕ 關閉']),
      h('h2', { text: '🗺️ ' + J.MapInfo.nameWithLevel({ name: info.name || '地圖', rec_level: sc.map.rec_level }, sc.mapId) + '（' + info.w + '×' + info.h + ' 格）' }),
      h('div.mm-body', {}, [mapBox, h('div.mm-side', {}, [h('h3', { text: '這裡的人（點一下看位置）' }), npcList, h('h3', { text: '這裡的怪物' }), monList])])]);
    // v0.9.3 放大地圖開著時主角仍然可以走（方向鍵、搖桿），地圖上的「你」會跟著動
    handle = J.UI.open(panel, { label: (info.name || '') + '的地圖', passMove: true, onClose: function () { clearInterval(t); if (bigHandle === handle) bigHandle = null; } });
    bigHandle = handle;
    if (panel.parentNode) panel.parentNode.classList.add('mm-wrap');   // v0.9.6 B14：面板靠左放（見 style.css）
    draw(big, info, true);
    return handle;
  }

  var Minimap = { MARKS: MARKS, labelX: labelX, compassBox: compassBox, bigMax: bigMax, isBigOpen: function () { return !!(bigHandle && document.body.contains(bigHandle.node)); }, chestText: chestText, attach: attach, openBig: openBig, draw: draw, viewFor: viewFor, LOCAL_W: LOCAL_W, LOCAL_H: LOCAL_H, lastTap: null };
  window.JQ = window.JQ || {};
  window.JQ.Minimap = Minimap;
})();
