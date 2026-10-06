/*
 * 台灣世界地圖畫面（站到車站格、或和車站 NPC 說話時打開）
 * 圖：window.WORLD.image；沒寫時用 assets/ui/world_taiwan.png（art_manifest.js 有列出時）。
 * 地圖上用「編號圓點」標出各地區（避免地名太近時互相蓋住），旁邊列出同樣編號的地區按鈕。
 * 已解鎖的地區可以前往；沒解鎖的顯示鎖頭並說明要先完成哪個委託。
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
      h('p.small', { text: '選一個想去的地方。🔒 的地方要先完成委託才能去。' }),
      h('div.wm-body', {}, [stage, side])
    ]);
    handle = J.UI.open(panel, { label: '世界地圖' });

    function lockedText(r) {
      var ids = Array.isArray(r.raw.unlock_quest) ? r.raw.unlock_quest : [r.raw.unlock_quest];
      return '完成' + ids.map(function (id) { var q = G.data.quests[id]; return '「' + (q ? q.title : id) + '」'; }).join('、') + '才能去';
    }

    function go(r) {
      J.UI.confirm('要前往「' + r.name + '」嗎？', '出發', '再想想').then(function (y) {
        if (!y) return;
        handle.close(true);
        onPick(r.raw);
      });
    }

    function render(imgW, imgH) {
      Array.prototype.forEach.call(stage.querySelectorAll('.dot'), function (n) { n.parentNode.removeChild(n); });
      side.innerHTML = '';
      list.forEach(function (r, i) {
        var f = J.WorldMap.fraction(r.raw, imgW, imgH);
        var state = r.here ? '目前在這裡' : (r.unlocked ? '可以前往' : '還沒解鎖');
        var can = r.unlocked && !r.here;
        stage.appendChild(h('button.dot' + (r.here ? '.here' : '') + (r.unlocked ? '' : '.locked'), {
          style: { left: (f.fx * 100).toFixed(2) + '%', top: (f.fy * 100).toFixed(2) + '%' },
          disabled: !can, title: r.name + '（' + state + '）', 'aria-label': r.name + '，' + state,
          onclick: function () { go(r); }
        }, [NUM[i] || String(i + 1)]));
        side.appendChild(h('li', {}, [
          h('button.pin' + (r.here ? '.here' : ''), { disabled: !can, onclick: function () { go(r); }, 'aria-label': r.name + '，' + state },
            [(NUM[i] || (i + 1)) + ' ' + (r.here ? '📍 ' : (r.unlocked ? '🚩 ' : '🔒 ')) + r.name]),
          h('span.small', { text: r.here ? '目前在這裡' : (r.unlocked ? (r.raw.real_ref ? '（' + r.raw.real_ref + '）' : '') : lockedText(r)) })
        ]));
      });
      if (!list.length) side.appendChild(h('li', { text: '還沒有可以去的地方。' }));
    }

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
