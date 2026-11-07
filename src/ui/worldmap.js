/*
 * 台灣世界地圖畫面（站到車站格、或和車站 NPC 說話時打開）
 * 圖：window.WORLD.image；沒寫時用 assets/ui/world_taiwan.png（art_manifest.js 有列出時）。
 * v4.0.1 起不推開、不合併、不編號；整張台灣用紅點標出真正位置，旁邊列出全部地區。
 * 已解鎖的地區可以前往；沒解鎖的顯示鎖頭並說明要先完成哪個委託（v1.1：或要先走路去過一次，unlock_visit）。
 */
(function () {
  'use strict';
  var J = window.JQ;
  function h() { return J.UI.h.apply(null, arguments); }

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

    var lastSize = [0, 0];
    function render(imgW, imgH) {
      lastSize = [imgW, imgH];
      Array.prototype.forEach.call(stage.querySelectorAll('.dot'), function (n) { n.parentNode.removeChild(n); });
      side.innerHTML = '';
      var goals = J.Guide ? J.Guide.goalMaps(G) : { primary: null, secondary: null };
      var mapImg = stage.querySelector('img'), sr = stage.getBoundingClientRect();
      var ir = mapImg ? mapImg.getBoundingClientRect() : sr;
      // object-fit: contain 可能上下或左右留白：先算圖片內容框，再將比例換成圓心座標。
      var scale = imgW > 0 && imgH > 0 ? Math.min(ir.width / imgW, ir.height / imgH) : 0;
      var rw = scale ? imgW * scale : ir.width, rh = scale ? imgH * scale : ir.height;
      var ox = ir.left - sr.left + (ir.width - rw) / 2, oy = ir.top - sr.top + (ir.height - rh) / 2;
      list.forEach(function (r) {
        var f = J.WorldMap.fraction(r.raw, imgW, imgH);
        var entry = J.WorldMap.entry(r.raw), mapId = entry && entry.map;
        var primary = !!goals.primary && mapId === goals.primary, secondary = !!goals.secondary && mapId === goals.secondary;
        var state = r.here ? '目前在這裡' : (r.unlocked ? '可以前往' : '還沒解鎖');
        var label = r.name + '，' + state + (primary ? '，下一步在這裡' : '') + (secondary ? '，還有委託沒接' : '');
        var can = r.unlocked && !r.here;
        var markers = [h('span.dot-core', { 'aria-hidden': 'true' })];
        // 單旗用按鈕的偽元素；同圖雙旗多一組偽元素，兩面左右錯開。
        if (primary && secondary) markers.push(h('span.secondary-flag', { 'aria-hidden': 'true' }));
        stage.appendChild(h('button.dot' + (r.here ? '.here' : '') + (r.unlocked ? '' : '.locked') + (primary ? '.goal' : '') + (secondary ? '.goal2' : ''), {
          style: { left: (ox + f.fx * rw) + 'px', top: (oy + f.fy * rh) + 'px' },
          disabled: !can, title: label, 'aria-label': label, 'data-region': r.raw.id,
          onclick: function () { go(r); }
        }, markers));
        // real_ref 本身已經有括號時不要再加一層。
        var ref = r.raw.real_ref ? (/^[（(]/.test(r.raw.real_ref) ? r.raw.real_ref : '（' + r.raw.real_ref + '）') : '';
        side.appendChild(h('li', {}, [
          h('button.pin' + (r.here ? '.here' : ''), { disabled: !can, onclick: function () { go(r); }, 'aria-label': label },
            [(r.here ? '📍 ' : (r.unlocked ? '🚩 ' : '🔒 ')) + r.name]),
          h('span.small', { text: (r.here ? '目前在這裡' : (r.unlocked ? ref : lockedText(r))) + (primary ? '　🎯 下一步在這裡' : '') + (secondary ? '　📌 還有委託沒接' : '') })
        ]));
      });
      if (!list.length) side.appendChild(h('li', { text: '還沒有可以去的地方。' }));
    }
    // 視窗大小改變（平板轉向）時依圖片內容框重算圓點位置
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
