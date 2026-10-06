/* 格子 A* 尋路（預設 4 方向，配合上下左右四方向走路圖；opts.diag=true 可 8 方向且不斜穿牆角） */
(function () {
  'use strict';
  var DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
  var SQRT2 = Math.SQRT2;

  /**
   * walkable(c, r) → boolean；cols, rows 為地圖大小。
   * 回傳從 start 到 goal 的格子陣列（不含 start、含 goal），找不到回傳 null。
   */
  function findPath(walkable, cols, rows, start, goal, maxNodes, opts) {
    maxNodes = maxNodes || 5000;
    var diag = !!(opts && opts.diag);
    var dirs = diag ? DIRS : DIRS.slice(0, 4);
    if (!walkable(goal.c, goal.r)) return null;
    if (start.c === goal.c && start.r === goal.r) return [];
    var key = function (c, r) { return r * cols + c; };
    var hf = diag ? h : manhattan;
    var open = [{ c: start.c, r: start.r, g: 0, f: hf(start, goal) }];
    var came = {}, gScore = {}, closed = {};
    gScore[key(start.c, start.r)] = 0;
    var expanded = 0;
    while (open.length) {
      var bi = 0;
      for (var i = 1; i < open.length; i++) if (open[i].f < open[bi].f) bi = i;
      var cur = open.splice(bi, 1)[0];
      var ck = key(cur.c, cur.r);
      if (closed[ck]) continue;
      closed[ck] = true;
      if (cur.c === goal.c && cur.r === goal.r) return rebuild(came, cur, start, cols);
      if (++expanded > maxNodes) return null;
      for (var d = 0; d < dirs.length; d++) {
        var nc = cur.c + dirs[d][0], nr = cur.r + dirs[d][1];
        if (nc < 0 || nr < 0 || nc >= cols || nr >= rows || !walkable(nc, nr)) continue;
        if (DIRS[d][0] && DIRS[d][1] && (!walkable(cur.c + DIRS[d][0], cur.r) || !walkable(cur.c, cur.r + DIRS[d][1]))) continue;
        var nk = key(nc, nr);
        if (closed[nk]) continue;
        var g = cur.g + (DIRS[d][0] && DIRS[d][1] ? SQRT2 : 1);
        if (gScore[nk] !== undefined && g >= gScore[nk]) continue;
        gScore[nk] = g;
        came[nk] = { c: cur.c, r: cur.r };
        open.push({ c: nc, r: nr, g: g, f: g + hf({ c: nc, r: nr }, goal) });
      }
    }
    return null;
  }

  function manhattan(a, b) { return Math.abs(a.c - b.c) + Math.abs(a.r - b.r); }

  function h(a, b) {
    var dx = Math.abs(a.c - b.c), dy = Math.abs(a.r - b.r);
    return (dx + dy) + (SQRT2 - 2) * Math.min(dx, dy);
  }

  function rebuild(came, node, start, cols) {
    var path = [{ c: node.c, r: node.r }];
    var k = node.r * cols + node.c;
    while (came[k]) {
      var p = came[k];
      if (p.c === start.c && p.r === start.r) break;
      path.unshift({ c: p.c, r: p.r });
      k = p.r * cols + p.c;
    }
    return path;
  }

  /** 目標不可走時，找離目標最近、且可走的格子（給點到水面/物件時用） */
  function nearestWalkable(walkable, cols, rows, goal, from) {
    var best = null, bestD = Infinity;
    for (var rad = 1; rad <= 3 && !best; rad++) {
      for (var dc = -rad; dc <= rad; dc++) {
        for (var dr = -rad; dr <= rad; dr++) {
          var c = goal.c + dc, r = goal.r + dr;
          if (c < 0 || r < 0 || c >= cols || r >= rows || !walkable(c, r)) continue;
          var d = Math.abs(dc) + Math.abs(dr) + (from ? 0.01 * (Math.abs(c - from.c) + Math.abs(r - from.r)) : 0);
          if (d < bestD) { bestD = d; best = { c: c, r: r }; }
        }
      }
    }
    return best;
  }

  var Pathfind = { findPath: findPath, nearestWalkable: nearestWalkable };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.Pathfind = Pathfind; }
  if (typeof module !== 'undefined') module.exports = Pathfind;
})();
