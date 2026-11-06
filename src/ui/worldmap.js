/*
 * 台灣世界地圖畫面（站到車站格、或和車站 NPC 說話時打開）
 * 圖：window.WORLD.image；沒寫時用 assets/ui/world_taiwan.png（art_manifest.js 有列出時）。
 * 地圖上用「編號圓點」標出各地區（避免地名太近時互相蓋住），旁邊列出同樣編號的地區按鈕。
 * 已解鎖的地區可以前往；沒解鎖的顯示鎖頭並說明要先完成哪個委託（v1.1：或要先走路去過一次，unlock_visit）。
 */
(function () {
  'use strict';
  var J = window.JQ;
  function h() { return J.UI.h.apply(null, arguments); }
  var NUM = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩', '⑪', '⑫', '⑬', '⑭', '⑮', '⑯', '⑰', '⑱', '⑲', '⑳'];

  function open(G, onPick) {
    var W = window.WORLD || { regions: [] };
    var st = G.state;
    var here = G.mapScene ? G.mapScene.mapId : null;
    var list = J.WorldMap.regions(W, st, here);
    var stage = h('div.stage');
    var side = h('ul.list.regions', { 'aria-label': '地區' });
    var handle;
    var panel = h('div.win.worldmap', {}, [
      h('button.close.ghost', { onclick: function () { handle.close(); }, 'aria-label': '關閉' }, ['✕ 關閉']),
      h('h2', { text: '🗺️ ' + (W.title || '世界地圖') }),
      h('p.small', { text: '選一個想去的地方。🔒 的地方要先完成委託，或先走路去過一次，才能搭車去。' }),
      h('div.wm-body', {}, [stage, side])
    ]);
    handle = J.UI.open(panel, { label: '世界地圖' });

    // v1.1 審查必改 1：文字規則移到 systems/worldmap.js 的 lockText（支援 unlock_visit、濾掉空的 unlock_quest，node 測得到）
    function lockedText(r) {
      return J.WorldMap.lockText(r.raw, G.data.quests, st) || '還不能去';
    }

    function go(r) {
      J.UI.confirm('要前往「' + r.name + '」嗎？', '出發', '再想想').then(function (y) {
        if (!y) return;
        handle.close(true);
        onPick(r.raw);
      });
    }

    /*
     * v2.2.1（v20_畫面審查 缺陷 1；老闆裁示方案 A）：手機小畫面（J.WorldMap.collapseFor：寬 ≤ 680 或高 ≤ 460）北部的點合成一個「北部」圓點（其他地區照真正位置）；
     * 按「北部」→ 圖放大到北部（zoomBox）、只畫北部的點，左下角「↩ 全台灣」（北部的點都在上半部，不會被它蓋住）收回。電腦、平板照舊全部畫。下面的地區清單一直列出全部。
     * 都是 <button>（鍵盤、讀屏可用、≥ 44px）；展開／收回後焦點移到「↩ 全台灣」／「北部」，讀屏念一句。
     */
    var lastSize = [0, 0], northOpen = false, refocus = null;
    function render(imgW, imgH) {
      lastSize = [imgW, imgH];
      Array.prototype.forEach.call(stage.querySelectorAll('.dot, .dot-line, .wm-back'), function (n) { n.parentNode.removeChild(n); });
      side.innerHTML = '';
      // v0.9.6（47 號 B04）圓點很近會疊在一起：照畫面上的大小把圓點推開（至少 48px），畫一條細線連回真正的位置；每個圓點都點得到
      var WM = J.WorldMap, sw = stage.clientWidth, shh = stage.clientHeight;
      var goalMap = (J.Guide && J.Game && J.Game.state) ? J.Guide.goalMap(J.Game) : null;   // v3.0.1 ②目標指引：下一步所在地圖的圓點加紅旗
      var fr = list.map(function (r) { return WM.fraction(r.raw, imgW, imgH); });
      var north = WM.northIndexes(list.map(function (r) { return r.raw; }), fr);
      var group = north.length >= 2 && WM.collapseFor(window.innerWidth, window.innerHeight);
      if (!group) northOpen = false;
      var box = group && northOpen ? WM.zoomBox(north.map(function (i) { return fr[i]; })) : null;
      var mapImg = stage.querySelector('img');
      stage.classList.toggle('wm-zoom', !!box);
      if (mapImg) mapImg.style.transform = box ? 'scale(' + box.s.toFixed(4) + ') translate(' + (-box.x0 * 100).toFixed(3) + '%, ' + (-box.y0 * 100).toFixed(3) + '%)' : '';
      // 要畫的點：i＝list 的索引（−1＝北部合併點）、f＝畫面上的比例位置
      var items = [];
      if (!group) list.forEach(function (r, i) { items.push({ i: i, f: fr[i] }); });
      else if (box) north.forEach(function (i) { items.push({ i: i, f: WM.zoomPoint(fr[i], box) }); });
      else {
        list.forEach(function (r, i) { if (north.indexOf(i) < 0) items.push({ i: i, f: fr[i] }); });
        items.push({ i: -1, f: WM.centroid(north.map(function (i) { return fr[i]; })) });
      }
      // 放大北部時，點只排在「↩ 全台灣」（左下角，44px＋上下 6px）上面，不會被它蓋住
      var spH = box ? Math.max(48, shh - 56) : shh;
      var pos = (sw > 0 && shh > 0) ? J.WorldMap.spreadDots(items.map(function (it) { return { x: it.f.fx * sw, y: it.f.fy * shh }; }), 48, sw, spH, 24) : null;
      items.forEach(function (it, k) {
        var f = it.f, left = pos ? pos[k].x / sw : f.fx, top = pos ? pos[k].y / shh : f.fy;
        var style = { left: (left * 100).toFixed(2) + '%', top: (top * 100).toFixed(2) + '%' };
        if (it.i < 0) {
          var nHere = north.some(function (i) { return list[i].here; });
          stage.appendChild(h('button.dot.dot-group' + (nHere ? '.here' : '') + (north.some(function (i) { return list[i].raw.map_entry === goalMap; }) ? '.goal' : ''), {
            style: style, 'data-region': 'north', 'aria-expanded': 'false', title: '北部（' + north.length + ' 個地方）',
            'aria-label': '北部，' + north.length + ' 個地方' + (nHere ? '，目前在這裡' : '') + '，按了放大北部',
            onclick: function () { northOpen = true; refocus = '.wm-back'; render(lastSize[0], lastSize[1]); J.UI.announce('已放大北部，共 ' + north.length + ' 個地方；按「全台灣」回到整張地圖。'); }
          }, ['北部']));
          return;
        }
        var r = list[it.i], i = it.i;
        var state = r.here ? '目前在這裡' : (r.unlocked ? '可以前往' : '還沒解鎖');
        var can = r.unlocked && !r.here;
        if (pos && Math.hypot(pos[k].x - f.fx * sw, pos[k].y - f.fy * shh) > 6) {
          // 細線：從真正的位置連到推開後的圓點
          var x0 = f.fx * sw, y0 = f.fy * shh, dx = pos[k].x - x0, dy = pos[k].y - y0;
          stage.appendChild(h('span.dot-line', { 'aria-hidden': 'true', style: { left: x0 + 'px', top: y0 + 'px', width: Math.hypot(dx, dy) + 'px', transform: 'rotate(' + Math.atan2(dy, dx) + 'rad)' } }));
        }
        stage.appendChild(h('button.dot' + (r.here ? '.here' : '') + (r.unlocked ? '' : '.locked') + (r.raw.map_entry === goalMap ? '.goal' : ''), {
          style: style, disabled: !can, title: r.name + '（' + state + '）', 'aria-label': r.name + '，' + state + (r.raw.map_entry === goalMap ? '，下一步在這裡' : ''), 'data-region': r.raw.id,
          onclick: function () { go(r); }
        }, [NUM[i] || String(i + 1)]));
      });
      if (box) stage.appendChild(h('button.wm-back', { 'aria-label': '回到全台灣地圖（收回北部）', onclick: function () { northOpen = false; refocus = '.dot-group'; render(lastSize[0], lastSize[1]); J.UI.announce('回到全台灣地圖。'); } }, ['↩ 全台灣']));
      list.forEach(function (r, i) {
        var state = r.here ? '目前在這裡' : (r.unlocked ? '可以前往' : '還沒解鎖');
        var can = r.unlocked && !r.here;
        // v0.9.6（47 號 B11）real_ref 本身已經有括號時不要再加一層
        var ref = r.raw.real_ref ? (/^[（(]/.test(r.raw.real_ref) ? r.raw.real_ref : '（' + r.raw.real_ref + '）') : '';
        side.appendChild(h('li', {}, [
          h('button.pin' + (r.here ? '.here' : ''), { disabled: !can, onclick: function () { go(r); }, 'aria-label': r.name + '，' + state },
            [(NUM[i] || (i + 1)) + ' ' + (r.here ? '📍 ' : (r.unlocked ? '🚩 ' : '🔒 ')) + r.name]),
          h('span.small', { text: (r.here ? '目前在這裡' : (r.unlocked ? ref : lockedText(r))) + (r.raw.map_entry === goalMap ? '　🎯 下一步在這裡' : '') })   // v3.0.1 ②
        ]));
      });
      if (!list.length) side.appendChild(h('li', { text: '還沒有可以去的地方。' }));
      if (refocus) { var rf = stage.querySelector(refocus); refocus = null; if (rf && rf.focus) rf.focus(); }
    }
    // 視窗大小改變（平板轉向）時圓點重新排
    var onResize = function () { if (document.body.contains(stage)) render(lastSize[0], lastSize[1]); else window.removeEventListener('resize', onResize); };
    window.addEventListener('resize', onResize);

    var file = W.image || J.Assets.art().ui.world_taiwan || null;   // 預設 assets/ui/world_taiwan.png
    var url = file ? J.Assets.resolveUrl(J.Assets.mapImagePath(file)) : null;
    if (url) {
      var img = h('img', { alt: '台灣奇幻世界地圖' });
      img.onload = function () { render(img.naturalWidth, img.naturalHeight); };
      img.onerror = function () { img.remove(); noImage(); };
      img.src = url;
      stage.appendChild(img);
      render(0, 0);
    } else noImage();

    function noImage() {
      stage.classList.add('noimg-stage');
      stage.appendChild(h('p.noimg', { text: '（世界地圖的圖還在準備中）' }));
      render(0, 0);
    }
    return handle;
  }

  window.JQ = window.JQ || {};
  window.JQ.WorldMapUI = { open: open };
})();
