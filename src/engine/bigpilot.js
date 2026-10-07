/*
 * v0.5 試做大地圖的 debug 載入（網址加 ?debug=bigpilot）
 *
 * 用 art_src/bigpilot/ 的試做大圖（M02_big_stitched2.png，2880×1728）與格子（M02_big.txt，90×54）
 * 暫時取代 M02 擎天草原：出口、NPC、寶箱、怪物範圍依 3 倍換算；別張地圖走進 M02 的落點也一起換算。
 * 只改記憶體裡的資料，不改 maps.js；重新整理（不加參數）就恢復正常。
 * maps.js 的 M02 已經是正式大地圖時（比畫面大兩倍以上），這個模式自動停用。
 *
 * art_src 在專案（jinshan-quest）外層，不會發布。要試玩時，請在「jinshan-quest 的上一層資料夾」開本機伺服器，例如：
 *   python -m http.server 8000
 *   瀏覽器開 http://127.0.0.1:8000/jinshan-quest/docs/index.html?debug=bigpilot
 * 加 &pilotbg=0 不用大圖、只用格子畫備援圖塊；加 &maxtex=1024 模擬最大貼圖尺寸 1024（大圖會自動切塊）。
 * （smoke 測試用攔截請求的方式直接提供這兩個檔案。）
 */
(function () {
  'use strict';
  var J = window.JQ;
  var BASE = '../../art_src/bigpilot/';
  var PILOT = { map: 'M02', grid: BASE + 'M02_big.txt', image: BASE + 'M02_big_stitched2.png', scale: 3 };

  function apply(G, grid) {
    var maps = G.data.maps, id = PILOT.map, s = PILOT.scale, ts = G.data.tilesets;
    var big = J.MapInfo.scaleMap(maps[id], grid, s, ts);
    big.bg = PILOT.image;
    big.noFg = true;
    // ?debug=bigpilot&pilotbg=0：不用大圖，只用格子畫備援圖塊（測試還沒有美術時的大地圖效能）
    if (/[?&]pilotbg=0(&|$)/.test(location.search)) { delete big.bg; big.noBg = true; }
    big.name = (big.name || id) + '（試做大地圖）';
    maps[id] = big;
    // 別張地圖通往 M02 的出口：落點換算到大地圖
    Object.keys(maps).forEach(function (k) {
      if (k === id) return;
      var m = maps[k];
      if (!(m.exits || []).some(function (e) { return e.to === id; })) return;
      var copy = Object.assign({}, m);
      copy.exits = m.exits.map(function (e) {
        if (e.to !== id) return e;
        var p = J.MapInfo.scalePoint(big, e.tx, e.ty, s, ts);
        return Object.assign({}, e, { tx: p.x, ty: p.y });
      });
      maps[k] = copy;
    });
    return big;
  }

  /** maps.js 的 M02 已經是正式大地圖（比畫面大兩倍以上）→ 試做模式停用，不再用試做圖取代 */
  function officialIsBig(G) {
    var m = G.data.maps[PILOT.map], C = J.CONFIG;
    if (!m) return false;
    var s = J.World.size(m);
    return s.w * C.TILE > C.VIEW_W * 2 || s.h * C.TILE > C.VIEW_H * 2;
  }

  function load(G) {
    if (officialIsBig(G)) {
      var s = J.World.size(G.data.maps[PILOT.map]);
      G.bigPilot = { status: 'disabled', reason: 'official', w: s.w, h: s.h };
      setTimeout(function () { J.UI.toast('正式大地圖已經寫入（' + PILOT.map + ' ' + s.w + '×' + s.h + ' 格），試做模式（?debug=bigpilot）停用。', 6000); }, 600);
      return Promise.resolve(G.bigPilot);
    }
    G.bigPilot = { status: 'loading' };
    var t0 = performance.now();
    return fetch(PILOT.grid, { cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.text();
    }).then(function (txt) {
      var grid = txt.split(/\r?\n/).filter(function (l) { return l.length; });
      var big = apply(G, grid);
      G.bigPilot = { status: 'ready', map: PILOT.map, w: grid[0].length, h: grid.length, image: PILOT.image, gridMs: Math.round(performance.now() - t0) };
      J.UI.toast('試做大地圖：' + big.name + '（' + grid[0].length + '×' + grid.length + ' 格）', 5000);
    }).catch(function (e) {
      G.bigPilot = { status: 'error', error: String(e && e.message || e) };
      J.UI.toast('找不到試做大地圖（請在 jinshan-quest 的上一層資料夾開本機伺服器）：' + G.bigPilot.error, 8000);
    });
  }

  window.JQ = window.JQ || {};
  window.JQ.BigPilot = { load: load, apply: apply, officialIsBig: officialIsBig, PILOT: PILOT };
})();
