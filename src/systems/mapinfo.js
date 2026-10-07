/*
 * 地圖上的輔助計算（v0.4）：上層格（前景）、招牌位置、背景音樂、怪物遊走目標、寵物站位、燈光位置
 * 純計算，可以在 node 測試。
 */
(function () {
  'use strict';
  var isNode = typeof module !== 'undefined' && typeof require === 'function';
  var World = isNode ? require('./world.js') : window.JQ.World;

  // ---------------------------------------------------------------- 上層格（DQ6 式前景）
  /**
   * tilesets.js 裡 upper:true 的字元（目前是 'U'）：可以走，但背景圖這一格要畫在角色上方。
   * 回傳 { cells:[{x,y}], set:{ "x,y": true } }
   */
  function upperCells(map, tilesets) {
    var set = {}, cells = [];
    var ts = tilesets[map.tileset] || {};
    (map.grid || []).forEach(function (row, y) {
      for (var x = 0; x < row.length; x++) {
        var d = ts[row.charAt(x)];
        if (d && d.upper) { set[x + ',' + y] = true; cells.push({ x: x, y: y }); }
      }
    });
    return { cells: cells, set: set };
  }

  /** 一個矩形（像素）有沒有碰到前景格。tile＝每格幾像素 */
  function rectHitsCells(rect, set, tile) {
    var x0 = Math.floor(rect.x / tile), x1 = Math.floor((rect.x + rect.w - 1) / tile);
    var y0 = Math.floor(rect.y / tile), y1 = Math.floor((rect.y + rect.h - 1) / tile);
    for (var y = y0; y <= y1; y++) for (var x = x0; x <= x1; x++) if (set[x + ',' + y]) return true;
    return false;
  }

  // ---------------------------------------------------------------- 招牌
  var SIGN_KIND = { general: 'general', item: 'item', weapon: 'weapon', armor: 'armor', inn: 'inn' };
  var SIGN_TEXT = { general: '雜貨', item: '道具', weapon: '武器', armor: '防具', inn: '旅店' };

  /**
   * 每間店、旅店的招牌位置：找店主人附近（2 格內）最近的門 'D'，招牌掛在門的上一格；
   * 找不到門就掛在店主人頭上一格。回傳 [{kind, text, x, y, npcX, npcY}]
   */
  function signSpots(map) {
    var shops = [];
    if (map.shop) shops.push({ kind: SIGN_KIND[map.shop.shop_id] || 'general', x: map.shop.x, y: map.shop.y });
    (map.extra_shops || []).forEach(function (s) { shops.push({ kind: SIGN_KIND[s.shop_id] || 'general', x: s.x, y: s.y }); });
    if (map.inn) shops.push({ kind: 'inn', x: map.inn.x, y: map.inn.y });
    return shops.map(function (s) {
      var best = null, bestD = 99;
      for (var dy = -2; dy <= 2; dy++) for (var dx = -2; dx <= 2; dx++) {
        if (World.charAt(map, s.x + dx, s.y + dy) !== 'D') continue;
        var d = Math.abs(dx) * 1.5 + Math.abs(dy);   // 同一直行的門優先
        if (d < bestD) { bestD = d; best = { x: s.x + dx, y: s.y + dy }; }
      }
      var at = best || { x: s.x, y: s.y };
      return { kind: s.kind, text: SIGN_TEXT[s.kind], x: at.x, y: Math.max(0, at.y - 1), npcX: s.x, npcY: s.y, onDoor: !!best };
    });
  }

  // ---------------------------------------------------------------- 背景音樂
  var MAP_BGM = ['village', 'field', 'forest', 'cave', 'town', 'castle'];
  var TILESET_BGM = { village: 'village', field: 'field', forest: 'forest', swamp: 'field', cave: 'cave', town: 'town', castle: 'castle' };

  /** 地圖的 BGM：maps.js 的 bgm 是這六種之一就用它，否則依圖塊組 */
  function bgmFor(map) {
    if (map && MAP_BGM.indexOf(map.bgm) >= 0) return map.bgm;
    return TILESET_BGM[map && map.tileset] || 'field';
  }

  /** 戰鬥 BGM：最終頭目 final（五科輪流或最高等級地圖的頭目）、頭目 boss、其他 battle */
  function battleBgm(mon, map) {
    if (!mon || !mon.boss) return 'battle';
    if ((mon.subjects && mon.subjects.length > 1) || (map && map.level >= 5)) return 'final';
    return 'boss';
  }

  // ---------------------------------------------------------------- 怪物遊走、寵物站位
  /** 在遊走範圍內挑一個目標格（盡量離目前位置 2 格以上，讓怪物走遍整個範圍） */
  function wanderTarget(tiles, from, rng) {
    rng = rng || Math.random;
    if (!tiles || !tiles.length) return null;
    var far = tiles.filter(function (t) { return Math.abs(t.x - from.x) + Math.abs(t.y - from.y) >= 2; });
    var pool = far.length ? far : tiles;
    return pool[Math.floor(rng() * pool.length)];
  }

  /** 寵物要停的格子：目標格能站就站，不能（障礙、NPC）就找最近的可站格 */
  function petSpot(walkable, cols, rows, target, from) {
    if (walkable(target.x, target.y)) return { x: target.x, y: target.y };
    var best = null, bestD = Infinity;
    for (var r = 1; r <= 3 && !best; r++) {
      for (var dy = -r; dy <= r; dy++) for (var dx = -r; dx <= r; dx++) {
        var x = target.x + dx, y = target.y + dy;
        if (x < 0 || y < 0 || x >= cols || y >= rows || !walkable(x, y)) continue;
        var d = Math.abs(dx) + Math.abs(dy) + (from ? 0.01 * (Math.abs(x - from.x) + Math.abs(y - from.y)) : 0);
        if (d < bestD) { bestD = d; best = { x: x, y: y }; }
      }
    }
    return best;
  }

  // ---------------------------------------------------------------- 燈光
  /**
   * 柔和圓形暖光的位置：maps.js 的 lights:[{x,y,r?}] 優先；
   * 沒寫時，洞窟裡的部落（type 'tribe'、tileset 'cave'，例如哥布林部落）在大型擺設 'K'（篝火、燈台）上加光。
   * 知識燈點亮後的光由程式另外加（lamps）。
   */
  function lightSpots(map) {
    if (Array.isArray(map.lights)) return map.lights.map(function (l) { return { x: l.x, y: l.y, r: l.r || 1 }; });
    var out = [];
    if (map.type === 'tribe' && map.tileset === 'cave') {
      (map.grid || []).forEach(function (row, y) { for (var x = 0; x < row.length; x++) if (row.charAt(x) === 'K') out.push({ x: x, y: y, r: 1.2 }); });
    }
    return out;
  }

  // ---------------------------------------------------------------- 放大地圖（v0.5 試做：邊長 s 倍）
  /** 最近一格「能走、不是出口、沒被用過」的格子（由近到遠，最多找 radius 圈） */
  function snapCell(ok, x, y, radius) {
    for (var r = 0; r <= (radius || 8); r++) {
      var best = null, bestD = Infinity;
      for (var dy = -r; dy <= r; dy++) for (var dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r || !ok(x + dx, y + dy)) continue;
        var d = dx * dx + dy * dy;
        if (d < bestD) { bestD = d; best = { x: x + dx, y: y + dy }; }
      }
      if (best) return best;
    }
    return { x: x, y: y };
  }

  /**
   * 把小地圖的資料（出口、NPC、寶箱、燈、車站、旅店、商店、起點、怪物範圍、燈光）套到放大 s 倍的新格子上（不改原本的物件）。
   * 原本一格 → 新的 s×s 一塊；出口取那一塊落在地圖邊上的格子；其他東西放在那一塊的中心，不能站就找最近能站的格子。
   */
  function scaleMap(map, grid, s, tilesets) {
    var out = JSON.parse(JSON.stringify(map));
    out.grid = grid.slice();
    var w = grid[0].length, h = grid.length, c = Math.floor(s / 2);
    var walk = function (x, y) { return x >= 0 && y >= 0 && x < w && y < h && World.isWalkable(tilesets, out, x, y, null); };
    out.exits = [];
    (map.exits || []).forEach(function (e) {
      var cells = [];
      for (var j = 0; j < s; j++) for (var i = 0; i < s; i++) {
        var x = e.x * s + i, y = e.y * s + j;
        var edge = (e.x === 0 && x === 0) || (e.y === 0 && y === 0) || (x === w - 1 && e.x * s + s - 1 >= w - 1) || (y === h - 1 && e.y * s + s - 1 >= h - 1);
        if (edge && walk(x, y)) cells.push({ x: x, y: y });
      }
      if (!cells.length) cells.push(snapCell(walk, e.x * s + c, e.y * s + c));
      cells.forEach(function (p) { out.exits.push({ x: p.x, y: p.y, to: e.to, tx: e.tx, ty: e.ty }); });
    });
    var used = {};
    var free = function (x, y) { return walk(x, y) && !World.exitAt(out, x, y) && !used[x + ',' + y]; };
    var place = function (o) {
      if (!o || typeof o.x !== 'number') return;
      var p = snapCell(free, o.x * s + c, o.y * s + c);
      o.x = p.x; o.y = p.y; used[p.x + ',' + p.y] = true;
    };
    (out.npcs || []).forEach(place);
    (out.chests || []).forEach(place);
    (out.lamps || []).forEach(place);
    [out.station, out.start].forEach(place);
    // 旅店、商店的座標是站櫃 NPC 的位置：跟著同一個 NPC 走
    [out.inn, out.shop].concat(out.extra_shops || []).forEach(function (o) {
      if (!o || typeof o.x !== 'number') return;
      var npc = (out.npcs || []).filter(function (n) { return o.npc && n.id === o.npc; })[0];
      if (npc) { o.x = npc.x; o.y = npc.y; } else place(o);
    });
    (out.spawns || []).forEach(function (sp) { if (sp.area) sp.area = sp.area.map(function (v) { return v * s; }); });
    if (Array.isArray(out.lights)) out.lights.forEach(function (l) { l.x = l.x * s + c; l.y = l.y * s + c; });
    return out;
  }

  /** 別張地圖走進來的落點（tx,ty）換算到放大後的地圖 */
  function scalePoint(bigMap, x, y, s, tilesets) {
    var w = bigMap.grid[0].length, h = bigMap.grid.length, c = Math.floor(s / 2);
    var ok = function (xx, yy) { return xx >= 0 && yy >= 0 && xx < w && yy < h && World.isWalkable(tilesets, bigMap, xx, yy, null) && !World.exitAt(bigMap, xx, yy); };
    return snapCell(ok, x * s + c, y * s + c);
  }

  // ---------------------------------------------------------------- 存檔座標遷移（v0.5 地圖放大）
  /**
   * v0.4（含）以前的地圖尺寸 [欄, 列]。舊存檔沒有 mapDims 戳記時，視為存檔時地圖是這個大小。
   * 以後地圖再改尺寸不用改這張表：v0.5 起存檔會記下當時每張地圖的尺寸（state.mapDims）。
   */
  var LEGACY_DIMS = { M01: [32, 20], M02: [30, 18], M03: [28, 16], M04: [30, 20], M05: [30, 19], M06: [28, 16],
    M07: [28, 16], M08: [30, 18], M09: [32, 19], M10: [28, 19], M11: [24, 14] };

  function validDim(d) { return Array.isArray(d) && d.length === 2 && d[0] > 0 && d[1] > 0 && d[0] < 1000 && d[1] < 1000; }

  /** 目前每張地圖的尺寸 { 地圖id: [欄, 列] } */
  function currentDims(maps) {
    var out = {};
    Object.keys(maps || {}).forEach(function (id) { var s = World.size(maps[id]); out[id] = [s.w, s.h]; });
    return out;
  }

  /** 在新尺寸的地圖上找一格能站的位置：依比例換算後找最近能站的格子；找不到用 start（或 start 附近能站的格子） */
  function remapPoint(map, tilesets, x, y, oldDim, newDim) {
    var blk = World.blockers(map);
    var ok = function (xx, yy) { return World.isWalkable(tilesets, map, xx, yy, blk) && !World.exitAt(map, xx, yy); };
    if (typeof x === 'number' && typeof y === 'number') {
      var kx = newDim[0] / oldDim[0], ky = newDim[1] / oldDim[1];
      var nx = Math.min(newDim[0] - 1, Math.max(0, Math.floor((x + 0.5) * kx))), ny = Math.min(newDim[1] - 1, Math.max(0, Math.floor((y + 0.5) * ky)));
      var p = snapCell(ok, nx, ny, Math.max(4, Math.ceil(Math.max(kx, ky) * 3)));
      if (ok(p.x, p.y)) return { x: p.x, y: p.y, how: 'scaled' };
    }
    var st = map.start || { x: 1, y: 1 };
    var q = snapCell(ok, st.x, st.y, 20);
    return { x: q.x, y: q.y, how: 'start' };
  }

  /**
   * 讀檔時呼叫：存檔裡以格子座標記錄的位置（location、lastInn），所在地圖的尺寸和存檔時不同就換算到最近能站的格子，
   * 找不到就送到那張地圖的 start。最後把目前的地圖尺寸記進 state.mapDims（下次比較用）。
   * 寶箱、委託、頭目都用 id 記錄，不受影響。回傳換算紀錄 [{field, map, from, to, how}]。
   */
  function migrateCoords(state, maps, tilesets) {
    var log = [], now = currentDims(maps);
    var saved = state.mapDims && Object.keys(state.mapDims).length ? state.mapDims : LEGACY_DIMS;
    ['location', 'lastInn'].forEach(function (field) {
      var loc = state[field];
      if (!loc || !maps[loc.map]) return;
      var oldDim = validDim(saved[loc.map]) ? saved[loc.map] : LEGACY_DIMS[loc.map], newDim = now[loc.map];
      if (!oldDim || (oldDim[0] === newDim[0] && oldDim[1] === newDim[1])) return;
      var map = maps[loc.map], to;
      // 旅店重生點：地圖有旅店就用「旅店老闆前一格」（和新遊戲一樣的規則）
      if (field === 'lastInn' && map.inn && World.isWalkable(tilesets, map, map.inn.x, map.inn.y + 1, World.blockers(map))) to = { x: map.inn.x, y: map.inn.y + 1, how: 'inn' };
      else to = remapPoint(map, tilesets, loc.x, loc.y, oldDim, newDim);
      log.push({ field: field, map: loc.map, from: [loc.x, loc.y], to: [to.x, to.y], how: to.how, oldDim: oldDim, newDim: newDim });
      state[field] = { map: loc.map, x: to.x, y: to.y };
    });
    state.mapDims = now;
    return log;
  }

  var MapInfo = { upperCells: upperCells, rectHitsCells: rectHitsCells, signSpots: signSpots, SIGN_TEXT: SIGN_TEXT, bgmFor: bgmFor, battleBgm: battleBgm, MAP_BGM: MAP_BGM,
    wanderTarget: wanderTarget, petSpot: petSpot, lightSpots: lightSpots, scaleMap: scaleMap, scalePoint: scalePoint, snapCell: snapCell,
    LEGACY_DIMS: LEGACY_DIMS, currentDims: currentDims, remapPoint: remapPoint, migrateCoords: migrateCoords };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.MapInfo = MapInfo; }
  if (typeof module !== 'undefined') module.exports = MapInfo;
})();
