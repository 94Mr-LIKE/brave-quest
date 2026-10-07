/*
 * 小地圖（v0.4）：畫面右上角的背景縮圖＋主角、NPC、出口、商店旅店、車站；點一下放大，
 * 放大後旁邊列出「本地圖 NPC（點一下閃爍位置）」與「本地圖怪物（圖示、名稱、等級、遇見／打倒）」。
 */
(function () {
  'use strict';
  var J = window.JQ;
  function h() { return J.UI.h.apply(null, arguments); }
  var SHOP_COLOR = { weapon: '#e0603a', armor: '#3b8fd6', item: '#2f8f4a', general: '#d0a020', inn: '#a15ad8' };
  var SHOP_SHORT = { weapon: '武', armor: '防', item: '道', general: '雜', inn: '旅' };
  var box = null, canvas = null, timer = 0, baseCache = {};

  /** 底圖：有背景圖就縮小背景，沒有就用可走／不可走上色 */
  function base(info, W, H) {
    var key = info.mapId + ':' + W + 'x' + H;
    if (baseCache[key]) return baseCache[key];
    var c = document.createElement('canvas'); c.width = W; c.height = H;
    var g = c.getContext('2d');
    if (info.bg) { try { g.drawImage(info.bg, 0, 0, W, H); } catch (e) { info.bg = null; } }
    if (!info.bg) {
      var cw = W / info.w, ch = H / info.h;
      for (var y = 0; y < info.h; y++) for (var x = 0; x < info.w; x++) { g.fillStyle = info.walk(x, y) ? '#7cc45a' : '#3d5a3d'; g.fillRect(x * cw, y * ch, Math.ceil(cw), Math.ceil(ch)); }
    }
    baseCache[key] = c;
    return c;
  }

  /** 畫一張地圖（小地圖與放大圖共用）。blink = {x,y,until}：閃爍的位置 */
  function draw(cv, info, big, blink) {
    var g = cv.getContext('2d'), W = cv.width, H = cv.height;
    var cw = W / info.w, ch = H / info.h, r = Math.max(2.5, Math.min(cw, ch) * (big ? 0.42 : 0.6));
    g.clearRect(0, 0, W, H);
    g.drawImage(base(info, W, H), 0, 0);
    g.fillStyle = 'rgba(10,18,50,0.18)'; g.fillRect(0, 0, W, H);
    function dot(x, y, color, rad, outline) {
      g.beginPath(); g.arc((x + 0.5) * cw, (y + 0.5) * ch, rad, 0, Math.PI * 2);
      g.fillStyle = color; g.fill();
      if (outline !== false) { g.lineWidth = big ? 2 : 1; g.strokeStyle = '#1d2b5e'; g.stroke(); }
    }
    info.exits.forEach(function (e) { g.fillStyle = '#6ae0f0'; g.fillRect(e.x * cw, e.y * ch, Math.max(2, cw), Math.max(2, ch)); });
    if (info.station) { g.fillStyle = '#ffffff'; g.fillRect(info.station.x * cw, info.station.y * ch, Math.max(3, cw), Math.max(3, ch)); }
    info.npcs.forEach(function (n) { dot(n.x, n.y, '#4aa3ff', r); });
    // 商店、旅店畫在店主人上面（比較大的彩色圓圈＋字），才看得出是店
    info.shops.forEach(function (s) {
      dot(s.x, s.y, SHOP_COLOR[s.kind] || '#d0a020', r * 1.25);
      if (big) { g.fillStyle = '#fff'; g.font = 'bold ' + Math.round(r * 1.6) + 'px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(SHOP_SHORT[s.kind] || '店', (s.x + 0.5) * cw, (s.y + 0.5) * ch); }
    });
    info.monsters.forEach(function (m) { dot(m.x, m.y, m.boss ? '#ff5050' : '#ff9a7a', r * (m.boss ? 1.2 : 0.8)); });
    dot(info.player.x, info.player.y, '#ffd34d', r * 1.3);
    if (blink && Date.now() < blink.until && Math.floor(Date.now() / 200) % 2 === 0) {
      g.beginPath(); g.arc((blink.x + 0.5) * cw, (blink.y + 0.5) * ch, r * 3, 0, Math.PI * 2); g.lineWidth = 3; g.strokeStyle = '#ffd34d'; g.stroke();
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
    var sz = size(info, 170, 110);
    canvas.width = sz.w; canvas.height = sz.h;
    box.setAttribute('aria-label', '小地圖：' + (info.name || '') + '（點一下放大）');
    clearInterval(timer);
    timer = setInterval(function () {
      if (!G.mapScene || G.mapScene !== scene || !scene.p || !scene.sys.isActive()) return;
      try { draw(canvas, scene.minimapInfo(), false); } catch (e) { /* 換圖中 */ }
    }, 300);
    draw(canvas, info, false);
  }

  /** 放大的地圖＋NPC 名單＋怪物列表 */
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
    var legend = h('p.small', { text: '🟡 你　🔵 人　🟠 怪物　🔷 出口　⬜ 車站　彩色圓圈：武＝武器店、防＝防具店、道＝道具店、雜＝雜貨店、旅＝旅店' });
    var handle;
    var mapBox = h('div.mm-map', {}, [big, legend]);
    mapBox.style.width = sz.w + 6 + 'px';   // 圖例跟著地圖寬度換行
    var panel = h('div.win.panel.minimap-panel', {}, [h('button.close.ghost', { onclick: function () { handle.close(); }, 'aria-label': '關閉' }, ['✕ 關閉']),
      h('h2', { text: '🗺️ ' + (info.name || '地圖') }),
      h('div.mm-body', {}, [mapBox, h('div.mm-side', {}, [h('h3', { text: '這裡的人（點一下看位置）' }), npcList, h('h3', { text: '這裡的怪物' }), monList])])]);
    handle = J.UI.open(panel, { label: (info.name || '') + '的地圖', onClose: function () { clearInterval(t); } });
    draw(big, info, true);
    return handle;
  }

  window.JQ = window.JQ || {};
  window.JQ.Minimap = { attach: attach, openBig: openBig, draw: draw };
})();
