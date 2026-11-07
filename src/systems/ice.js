/*
 * v4.0 霧之洞窟第 2 層 M38 霜晶迴廊：冰地板滑行（71 號 2.4、第十一節「冰地板滑行 ice.js」）。純計算，可以在 node 測試。
 * 規則和地圖組的 tools/bigmaps/check_ice.js、v40_ice.py 一樣：
 *   站在一格上選一個方向走；下一格是冰（'I'）就一直滑——前面是擋路格就停在目前這格；滑進一格不是冰的可走地面（門口）就停在那格。
 *   每選一次方向算 1 步。只認 maps.js ice_rooms 的 box（含牆，含頭含尾）裡的 'I' 格；冰面上只能直走、不能斜走。
 * 遊戲裡（fx/east_fx.js）：主角走上冰格後，同一個方向自動再走一格，直到停下（不播走路動畫、不能中途轉彎）。
 */
(function () {
  'use strict';
  var DIRS = { U: [0, -1], D: [0, 1], L: [-1, 0], R: [1, 0] };
  var LONG = { U: 'up', D: 'down', L: 'left', R: 'right' }, SHORT = { up: 'U', down: 'D', left: 'L', right: 'R' };

  function inBox(x, y, b) { return x >= b[0] && x <= b[2] && y >= b[1] && y <= b[3]; }
  /** (x,y) 在哪一間冰房間的冰面上（cell(x,y) 回傳格子字元）；不在就 null */
  function roomAt(rooms, cell, x, y) {
    if (cell(x, y) !== 'I') return null;
    for (var i = 0; i < (rooms || []).length; i++) if (inBox(x, y, rooms[i].box)) return rooms[i];
    return null;
  }
  /**
   * 從 (x,y) 往 d（'U'／'D'／'L'／'R' 或 'up'…）滑：回傳停下來的格子 [x, y]；一格都動不了回傳 null。
   * isIce(x,y)：那格是冰；canEnter(x,y)：那格是不是冰都可以走（擋路格、NPC、關著的門回傳 false）
   */
  function slide(isIce, canEnter, x, y, d) {
    var v = DIRS[SHORT[d] || d];
    if (!v) return null;
    var cx = x, cy = y, moved = false;
    for (var guard = 0; guard < 400; guard++) {
      var nx = cx + v[0], ny = cy + v[1];
      if (isIce(nx, ny) && canEnter(nx, ny)) { cx = nx; cy = ny; moved = true; continue; }
      if (!isIce(nx, ny) && canEnter(nx, ny)) { cx = nx; cy = ny; moved = true; }
      break;
    }
    return moved ? [cx, cy] : null;
  }
  /** 一間冰房間：從 start 出發，每一步往四個方向滑，BFS；只走 box 裡面的格子。回傳 { prev(Map), path(goal) } 工具 */
  function search(room, isIce, canEnter, start) {
    var key = function (p) { return p[0] + ',' + p[1]; };
    var prev = new Map([[key(start), null]]), q = [start];
    for (var i = 0; i < q.length; i++) {
      var p = q[i];
      'UDLR'.split('').forEach(function (d) {
        var n = slide(isIce, canEnter, p[0], p[1], d);
        if (n && inBox(n[0], n[1], room.box) && !prev.has(key(n))) { prev.set(key(n), [p, d]); q.push(n); }
      });
    }
    return {
      prev: prev,
      pathTo: function (g) {
        if (!prev.has(key(g))) return null;
        var out = [], k = key(g);
        while (prev.get(k)) { var e = prev.get(k); out.push(e[1]); k = key(e[0]); }
        return out.reverse().join('');
      }
    };
  }
  /**
   * 照 check_ice.js 檢查一間房間：回傳 { min, path, stops, stuck, solutionOk, bad[] }
   *   最少步數要等於 room.min_steps；附的 solution 照走要走到出口；從入口走得到的每一個位置都還回得了入口或到得了出口（不會卡死）
   */
  function checkRoom(room, isIce, canEnter) {
    var bad = [], s = search(room, isIce, canEnter, room.entrance), path = s.pathTo(room.exit);
    if (path === null) bad.push(room.id + '：從入口滑不到出口（無解）');
    else if (room.min_steps !== undefined && path.length !== room.min_steps) bad.push(room.id + '：最少 ' + path.length + ' 步，資料寫 ' + room.min_steps);
    var solutionOk = null;
    if (room.solution) {
      var p = room.entrance, ok = true;
      room.solution.split('').forEach(function (d) { if (!ok) return; var n = slide(isIce, canEnter, p[0], p[1], d); if (!n) ok = false; else p = n; });
      solutionOk = ok && p[0] === room.exit[0] && p[1] === room.exit[1];
      if (!solutionOk) bad.push(room.id + '：附的解法 ' + room.solution + ' 走不到出口（停在 ' + p + '）');
      if (room.min_steps !== undefined && room.solution.length !== room.min_steps) bad.push(room.id + '：附的解法 ' + room.solution.length + ' 步，不是最少步數');
    }
    var stuck = 0;
    s.prev.forEach(function (_, k) {
      var q = k.split(',').map(Number), s2 = search(room, isIce, canEnter, q);
      if (!s2.prev.has(room.entrance.join(',')) && !s2.prev.has(room.exit.join(','))) stuck++;
    });
    if (stuck) bad.push(room.id + '：有 ' + stuck + ' 個位置回不了入口也到不了出口（會卡死）');
    return { min: path === null ? null : path.length, path: path, stops: s.prev.size, stuck: stuck, solutionOk: solutionOk, bad: bad };
  }

  var Ice = { DIRS: DIRS, LONG: LONG, SHORT: SHORT, inBox: inBox, roomAt: roomAt, slide: slide, search: search, checkRoom: checkRoom };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.Ice = Ice; }
  if (typeof module !== 'undefined') module.exports = Ice;
})();
