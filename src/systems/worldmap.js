/*
 * 台灣世界地圖：哪些地區解鎖了、點了要去哪裡
 * 資料：window.WORLD = { image?, regions: [{ id, name, map_entry, x, y, unlock_quest }] }（劇情設計師撰寫）
 *   map_entry：地圖 ID（例 "M01"，下車位置用 region 的 tx, ty，沒有就用該地圖的 start），或 { map, x, y }
 *   x, y：在世界地圖圖片上的位置；0～1 之間當成比例，大於 1 當成圖片像素座標
 *   unlock_quest：完成這個委託才解鎖；null／空字串＝一開始就解鎖
 */
(function () {
  'use strict';

  function isUnlocked(region, state) {
    var q = region.unlock_quest;
    if (!q) return true;
    var list = Array.isArray(q) ? q : [q];
    return list.every(function (id) { return state.quests[id] && state.quests[id].status === 'done'; });
  }

  /** 回傳 [{id, name, x, y, unlocked, here}] */
  function regions(world, state, currentMap) {
    return ((world && world.regions) || []).map(function (r) {
      var e = entry(r, null);
      return { id: r.id, name: r.name || r.id, x: r.x, y: r.y, unlocked: isUnlocked(r, state), here: !!(e && e.map === currentMap), raw: r };
    });
  }

  /** 進入點：{map, x, y}；maps 有給時，沒寫座標就用該地圖的 start */
  function entry(region, maps) {
    var e = region.map_entry;
    if (!e) return null;
    if (typeof e === 'string') {
      if (region.tx !== undefined && region.ty !== undefined) return { map: e, x: region.tx, y: region.ty };
      var m = maps && maps[e];
      var s = m && m.start;
      return { map: e, x: s ? s.x : undefined, y: s ? s.y : undefined };
    }
    return { map: e.map, x: e.x, y: e.y };
  }

  /** 換算成圖片上的比例位置（0～1） */
  function fraction(region, imgW, imgH) {
    var x = Number(region.x || 0), y = Number(region.y || 0);
    if (x > 1 || y > 1) return { fx: imgW ? x / imgW : 0, fy: imgH ? y / imgH : 0 };
    return { fx: x, fy: y };
  }

  var WorldMap = { isUnlocked: isUnlocked, regions: regions, entry: entry, fraction: fraction };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.WorldMap = WorldMap; }
  if (typeof module !== 'undefined') module.exports = WorldMap;
})();
