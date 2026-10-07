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
  var LOCAL_W = 40, LOCAL_H = 25;   // 大地圖時小地圖顯示的範圍（格）
  var box = null, canvas = null, timer = 0, gridCache = {};

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

  /** 畫一張地圖（小地圖與放大圖共用）。view＝顯示範圍（格）；blink = {x,y,until}：閃爍的位置 */
  function draw(cv, info, big, blink, view) {
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
    // 寶箱：沒開的是咖啡色、開過的是灰色
    (info.chests || []).forEach(function (c) {
      if (!inside(c.x, c.y)) return;
      var s = Math.max(4, Math.min(cw, ch) * (big ? 0.9 : 1.1));
      g.fillStyle = c.open ? '#9a9a9a' : '#c8873a';
      g.fillRect(px(c.x) - s / 2, py(c.y) - s * 0.4, s, s * 0.8);
      g.lineWidth = 1.5; g.strokeStyle = '#1d2b5e'; g.strokeRect(px(c.x) - s / 2, py(c.y) - s * 0.4, s, s * 0.8);
    });
    info.npcs.forEach(function (n) { dot(n.x, n.y, '#4aa3ff', r); });
    // 商店、旅店畫在店主人上面（比較大的彩色圓圈＋字），才看得出是店
    info.shops.forEach(function (s) {
      dot(s.x, s.y, SHOP_COLOR[s.kind] || '#d0a020', r * 1.25);
      if (big && inside(s.x, s.y)) { g.fillStyle = '#fff'; g.font = 'bold ' + Math.round(r * 1.6) + 'px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(SHOP_SHORT[s.kind] || '店', px(s.x), py(s.y)); }
    });
    info.monsters.forEach(function (m) { dot(m.x, m.y, m.boss ? '#ff5050' : '#ff9a7a', r * (m.boss ? 1.2 : 0.8)); });
    dot(info.player.x, info.player.y, '#ffd34d', r * 1.3);
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
      box = h('button.minimap', { onclick: function () { if (!G.blocked()) openBig(G); }, 'aria-label': '小地圖（點一下放大）' }, [canvas]);
      hud.appendChild(box);
    }
    var info = scene.minimapInfo();
    var v0 = viewFor(info, true);
    var sz = size({ w: v0.w, h: v0.h }, 170, 110);
    canvas.width = sz.w; canvas.height = sz.h;
    box.dataset.local = String(v0.w < info.w || v0.h < info.h);   // 測試用：是不是局部顯示
    box.setAttribute('aria-label', '小地圖：' + (info.name || '') + '（點一下放大）');
    clearInterval(timer);
    timer = setInterval(function () {
      if (!G.mapScene || G.mapScene !== scene || !scene.p || !scene.sys.isActive()) return;
      try { var inf = scene.minimapInfo(); draw(canvas, inf, false, null, viewFor(inf, true)); } catch (e) { /* 換圖中 */ }
    }, 300);
    draw(canvas, info, false, null, v0);
  }

  /** 放大的地圖（整張）＋NPC 名單＋怪物列表 */
  function openBig(G) {
    var sc = G.mapScene;
    if (!sc) return null;
    var info = sc.minimapInfo(), D = G.data, st = G.state;
    var sz = size(info, Math.min(580, window.innerWidth * 0.5), Math.min(440, window.innerHeight * 0.62));
    var big = h('canvas.minimap-big', { width: sz.w, height: sz.h, role: 'img', 'aria-label': (info.name || '') + '的地圖' });
    var blink = null, t = setInterval(function () { draw(big, sc.minimapInfo(), true, blink); }, 150);
    var npcList = h('ul.list.compact', { 'aria-label': '本地圖的人' });
    info.npcs.forEach(function (n) {
      npcList.appendChild(h('li', {}, [h('button', { onclick: function () { blink = { x: n.x, y: n.y, until: Date.now() + 2000 }; sc.flashAt(n.x, n.y); } }, ['📍 ' + n.name])]));
    });
    info.shops.forEach(function (s) { npcList.appendChild(h('li', {}, [h('span', { text: '🏠 ' + s.text + '（' + (SHOP_SHORT[s.kind] || '') + '）' })])); });
    if (!info.npcs.length) npcList.appendChild(h('li', { text: '這裡沒有人。' }));
    var chests = info.chests || [];
    if (chests.length) {
      var opened = chests.filter(function (c) { return c.open; }).length;
      npcList.appendChild(h('li', {}, [h('span', { text: '🧰 寶箱 ' + chests.length + ' 個（已打開 ' + opened + ' 個）' })]));
    }
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
    var legend = h('p.small', { text: '🟡 你　🔵 人　🟠 怪物　🔷 出口　⬜ 車站　🟫 寶箱（灰色＝已打開）　彩色圓圈：武＝武器店、防＝防具店、道＝道具店、雜＝雜貨店、旅＝旅店' });
    var handle;
    var mapBox = h('div.mm-map', {}, [big, legend]);
    mapBox.style.width = sz.w + 6 + 'px';   // 圖例跟著地圖寬度換行
    var panel = h('div.win.panel.minimap-panel', {}, [h('button.close.ghost', { onclick: function () { handle.close(); }, 'aria-label': '關閉' }, ['✕ 關閉']),
      h('h2', { text: '🗺️ ' + (info.name || '地圖') + '（' + info.w + '×' + info.h + ' 格）' }),
      h('div.mm-body', {}, [mapBox, h('div.mm-side', {}, [h('h3', { text: '這裡的人（點一下看位置）' }), npcList, h('h3', { text: '這裡的怪物' }), monList])])]);
    handle = J.UI.open(panel, { label: (info.name || '') + '的地圖', onClose: function () { clearInterval(t); } });
    draw(big, info, true);
    return handle;
  }

  window.JQ = window.JQ || {};
  window.JQ.Minimap = { attach: attach, openBig: openBig, draw: draw, viewFor: viewFor, LOCAL_W: LOCAL_W, LOCAL_H: LOCAL_H };
})();
