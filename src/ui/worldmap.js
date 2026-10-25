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

    var lastSize = [0, 0];
    function render(imgW, imgH) {
      lastSize = [imgW, imgH];
      Array.prototype.forEach.call(stage.querySelectorAll('.dot, .dot-line'), function (n) { n.parentNode.removeChild(n); });
      side.innerHTML = '';
      // v0.9.6（47 號 B04）北部的圓點（金包里、野柳、哥布林村莊、山城、紅樹林）很近會疊在一起：照畫面上的大小把圓點推開（至少 48px），
      // 畫一條細線連回真正的位置；每個圓點都點得到（1280 寬、平板都一樣）
      var sw = stage.clientWidth, shh = stage.clientHeight;
      var fr = list.map(function (r) { return J.WorldMap.fraction(r.raw, imgW, imgH); });
      var pos = (sw > 0 && shh > 0) ? J.WorldMap.spreadDots(fr.map(function (f) { return { x: f.fx * sw, y: f.fy * shh }; }), 48, sw, shh, 24) : null;
      list.forEach(function (r, i) {
        var f = fr[i];
        var state = r.here ? '目前在這裡' : (r.unlocked ? '可以前往' : '還沒解鎖');
        var can = r.unlocked && !r.here;
        var left = pos ? pos[i].x / sw : f.fx, top = pos ? pos[i].y / shh : f.fy;
        if (pos && Math.hypot(pos[i].x - f.fx * sw, pos[i].y - f.fy * shh) > 6) {
          // 細線：從真正的位置連到推開後的圓點
          var x0 = f.fx * sw, y0 = f.fy * shh, dx = pos[i].x - x0, dy = pos[i].y - y0;
          stage.appendChild(h('span.dot-line', { 'aria-hidden': 'true', style: { left: x0 + 'px', top: y0 + 'px', width: Math.hypot(dx, dy) + 'px', transform: 'rotate(' + Math.atan2(dy, dx) + 'rad)' } }));
        }
        stage.appendChild(h('button.dot' + (r.here ? '.here' : '') + (r.unlocked ? '' : '.locked'), {
          style: { left: (left * 100).toFixed(2) + '%', top: (top * 100).toFixed(2) + '%' },
          disabled: !can, title: r.name + '（' + state + '）', 'aria-label': r.name + '，' + state, 'data-region': r.raw.id,
          onclick: function () { go(r); }
        }, [NUM[i] || String(i + 1)]));
        // v0.9.6（47 號 B11）real_ref 本身已經有括號時不要再加一層
        var ref = r.raw.real_ref ? (/^[（(]/.test(r.raw.real_ref) ? r.raw.real_ref : '（' + r.raw.real_ref + '）') : '';
        side.appendChild(h('li', {}, [
          h('button.pin' + (r.here ? '.here' : ''), { disabled: !can, onclick: function () { go(r); }, 'aria-label': r.name + '，' + state },
            [(NUM[i] || (i + 1)) + ' ' + (r.here ? '📍 ' : (r.unlocked ? '🚩 ' : '🔒 ')) + r.name]),
          h('span.small', { text: r.here ? '目前在這裡' : (r.unlocked ? ref : lockedText(r)) })
        ]));
      });
      if (!list.length) side.appendChild(h('li', { text: '還沒有可以去的地方。' }));
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
