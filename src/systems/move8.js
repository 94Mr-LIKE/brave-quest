/*
 * v1.0.6 斜走（八方向格子移動）規則：與畫面無關，可在 node 測試（MapScene、game.js、hud.js 只負責接到畫面上）。
 * - 方向名稱：up、down、left、right（原本的四方向）＋ upleft、upright、downleft、downright（斜向）
 * - 斜走一步的時間是直走的 √2 倍（速度看起來一樣）
 * - 不能斜穿牆角：目標格、橫向那格、縱向那格都能走才斜走；只有一邊能走就順著那邊滑；兩邊都不行就原地轉向
 * - 角色走路圖只有四方向：斜走時面向橫向（左上、左下面向左；右上、右下面向右），
 *   但原本就面向其中一個分量方向時保持原本朝向（避免閃爍）
 * - 搖桿：8 個 45° 扇區，目前方向的扇區邊界放寬 JOY_HYST_DEG 度（遲滯，手指抖動時不會在兩個方向間跳）
 */
(function () {
  'use strict';
  var DIRS = {
    up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0],
    upleft: [-1, -1], upright: [1, -1], downleft: [-1, 1], downright: [1, 1]
  };
  var OPP = { up: 'down', down: 'up', left: 'right', right: 'left' };
  // 搖桿扇區（螢幕座標：y 往下為正；atan2 角度 0°＝右、90°＝下）
  var SECTORS = ['right', 'downright', 'down', 'downleft', 'left', 'upleft', 'up', 'upright'];
  var JOY_HYST_DEG = 8;
  // 8 個鄰格：正交在前（同樣遠時優先站在正前方）
  var N8 = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];
  var DIAG_SPOT_PENALTY = 0.5;   // 點 NPC 走過去：斜角的站位多算半步（差不多遠時站在正前方說話）

  function isDiag(dir) { var d = DIRS[dir]; return !!(d && d[0] && d[1]); }

  /** 位移 → 方向名稱（各軸只看正負號）；(0,0) → null */
  function dirOf(dx, dy) {
    var v = dy < 0 ? 'up' : dy > 0 ? 'down' : '';
    var h = dx < 0 ? 'left' : dx > 0 ? 'right' : '';
    return (v + h) || null;
  }

  /** 方向的橫向、縱向分量：{ h: 'left'|'right'|null, v: 'up'|'down'|null } */
  function parts(dir) {
    var d = DIRS[dir];
    if (!d) return { h: null, v: null };
    return { h: d[0] < 0 ? 'left' : d[0] > 0 ? 'right' : null, v: d[1] < 0 ? 'up' : d[1] > 0 ? 'down' : null };
  }

  /**
   * 鍵盤：held＝{方向: 是否按住}、order＝按下的先後順序（最後按的在最後）。
   * 只按一個鍵＝原本的四方向；同時按住一個垂直鍵和一個水平鍵＝斜向（例如 ↑＋→ ＝ upright）。
   * 同一軸兩個鍵都按住（例如 ← 和 →）時，以後按的為準（和以前一樣）。
   */
  function heldDir(held, order) {
    var v = null, h = null;
    for (var i = (order || []).length - 1; i >= 0; i--) {
      var k = order[i];
      if (!held || !held[k]) continue;
      if (!v && (k === 'up' || k === 'down')) v = k;
      if (!h && (k === 'left' || k === 'right')) h = k;
    }
    if (v && h) return v + h;
    return v || h || null;
  }

  /** 走一步的時間（毫秒）：斜走是直走的 √2 倍 */
  function stepMs(base, dir) { return isDiag(dir) ? base * Math.SQRT2 : base; }

  /**
   * 斜走時角色面向哪裡（走路圖只有四方向）。
   * 直走＝那個方向；斜走＝橫向，但原本就面向其中一個分量方向時保持原本朝向。
   */
  function facingFor(dir, cur) {
    if (!DIRS[dir]) return cur || 'down';
    if (!isDiag(dir)) return dir;
    var p = parts(dir);
    if (cur === p.h || cur === p.v) return cur;
    return p.h;
  }

  /**
   * 從 (x, y) 往 dir 走一步要走到哪裡。free(x, y)＝這格可以走（沒有牆、NPC、寶箱、動物）。
   * 斜走：目標格可走，而且橫向、縱向兩個正交鄰格都可走，才斜走（不斜穿牆角）；
   *   否則只有一邊能走就改走那一邊（貼牆斜推時順著滑）；兩邊都不行就不動。
   *   兩邊都能走、只有斜角那格擋住（例如一根柱子）：往目前面向的那一邊走，沒有面向任何一邊就走橫向。
   * 回傳 { dir: 實際要走的方向（不動＝null）, x, y（走完的格子）, slid: 是不是順著牆滑 }
   */
  function resolveStep(x, y, dir, free, cur) {
    var d = DIRS[dir];
    var stay = { dir: null, x: x, y: y, slid: false };
    if (!d) return stay;
    if (!isDiag(dir)) return free(x + d[0], y + d[1]) ? { dir: dir, x: x + d[0], y: y + d[1], slid: false } : stay;
    var p = parts(dir);
    var hOk = free(x + d[0], y), vOk = free(x, y + d[1]);
    if (hOk && vOk && free(x + d[0], y + d[1])) return { dir: dir, x: x + d[0], y: y + d[1], slid: false };
    var go = null;
    if (hOk && !vOk) go = p.h;
    else if (vOk && !hOk) go = p.v;
    else if (hOk && vOk) go = cur === p.v ? p.v : p.h;
    if (!go) return stay;
    var g = DIRS[go];
    return { dir: go, x: x + g[0], y: y + g[1], slid: true };
  }

  /** 從 (x, y) 走到相鄰的 (nx, ny) 合不合規則（斜走不能穿牆角）；尋路走到一半時再檢查一次（例如水牛走過來擋住） */
  function canStep(x, y, nx, ny, free) {
    var dx = nx - x, dy = ny - y;
    if ((!dx && !dy) || Math.abs(dx) > 1 || Math.abs(dy) > 1) return false;
    if (!free(nx, ny)) return false;
    if (dx && dy) return free(nx, y) && free(x, ny);
    return true;
  }

  /**
   * 搖桿方向：dx、dy＝手指相對搖桿中心的位移（螢幕座標），force＝推的力度（0～1）。
   * 8 個 45° 扇區；prev＝目前的方向，它的扇區兩邊各放寬 JOY_HYST_DEG 度（遲滯）。力度不到 deadzone → null。
   */
  function joyDir(dx, dy, force, deadzone, prev) {
    if (!(force >= (deadzone || 0)) || (!dx && !dy)) return null;
    var ang = Math.atan2(dy, dx) * 180 / Math.PI;
    var pi = prev ? SECTORS.indexOf(prev) : -1;
    if (pi >= 0) {
      var diff = Math.abs(((ang - pi * 45) % 360 + 540) % 360 - 180);
      if (diff <= 22.5 + JOY_HYST_DEG) return prev;
    }
    return SECTORS[((Math.round(ang / 45) % 8) + 8) % 8];
  }

  /**
   * 和斜角的對象說話時要面向哪裡（不能隔著牆角說話）。
   * (px, py)＝主角、(x, y)＝斜角的對象、cur＝目前面向、walk(x, y)＝這格可走。
   * 兩個正交鄰格（橫向那格、縱向那格）都不能走 → null（隔著牆角，不算靠近）。
   * 否則轉向橫向或縱向中「較接近」的那個：目前面向其中一個、而且那格可走就不轉；
   * 目前背對其中一個方向時轉向另一個（只轉 90°）；只有一邊可走就面向那一邊。
   * 不是斜角相鄰 → null。
   */
  function talkFacing(px, py, x, y, cur, walk) {
    var dx = x - px, dy = y - py;
    if (Math.abs(dx) !== 1 || Math.abs(dy) !== 1) return null;
    var h = dx > 0 ? 'right' : 'left', v = dy > 0 ? 'down' : 'up';
    var hOk = !!walk(px + dx, py), vOk = !!walk(px, py + dy);
    if (!hOk && !vOk) return null;
    if (cur === h && hOk) return h;
    if (cur === v && vOk) return v;
    if (hOk && vOk) return cur === OPP[h] ? v : h;
    return hOk ? h : v;
  }

  /** 相鄰（正交，或斜角而且不是隔著牆角）→ true */
  function adjacent(px, py, x, y, walk) {
    var dx = Math.abs(x - px), dy = Math.abs(y - py);
    if (dx + dy === 1) return true;
    return talkFacing(px, py, x, y, null, walk) !== null;
  }

  /**
   * 按 A／空白鍵時要和誰說話：站的那格 → 面前那格 → 其他三個正交鄰格 → 斜角（兩個正交鄰格至少一個可走才算）。
   * at(x, y)＝那格可以互動的東西（沒有＝null）。回傳 { t, x, y } 或 null。
   */
  function nearby(px, py, facing, at, walk) {
    var t = at(px, py);
    if (t) return { t: t, x: px, y: py };
    var d = DIRS[facing];
    if (d && !isDiag(facing)) { t = at(px + d[0], py + d[1]); if (t) return { t: t, x: px + d[0], y: py + d[1] }; }
    for (var i = 0; i < N8.length; i++) {
      var x = px + N8[i][0], y = py + N8[i][1];
      if (N8[i][0] && N8[i][1] && talkFacing(px, py, x, y, facing, walk) === null) continue;
      t = at(x, y);
      if (t) return { t: t, x: x, y: y };
    }
    return null;
  }

  function pathCost(path, from) {
    var c = 0, x = from.c, y = from.r;
    for (var i = 0; i < path.length; i++) { c += (path[i].c !== x && path[i].r !== y) ? Math.SQRT2 : 1; x = path[i].c; y = path[i].r; }
    return c;
  }

  function pf() { return (typeof window !== 'undefined' && window && window.JQ && window.JQ.Pathfind) || (typeof require === 'function' ? require('./pathfind.js') : null); }

  /**
   * 點地圖、點放大地圖走過去：用 Pathfind 的 diag:true（8 方向、不斜穿牆角）。
   * hasTarget＝點到 NPC、寶箱等（走到旁邊再互動）；目標格不能站時也一樣找 8 個鄰格裡最近的。
   * 斜角的站位：要和對象說話時，兩個正交鄰格至少一個可走（不能隔著牆角說話），而且多算 DIAG_SPOT_PENALTY 步。
   * 回傳格子陣列（不含起點），找不到路 → null。
   */
  function planWalk(walk, cols, rows, from, x, y, hasTarget, Pathfind) {
    var PF = Pathfind || pf();
    var opts = { diag: true };
    var find = function (g) { return (g.c === from.c && g.r === from.r) ? [] : PF.findPath(walk, cols, rows, from, g, undefined, opts); };
    if (!hasTarget && walk(x, y)) return find({ c: x, r: y });
    var best = null, bestCost = Infinity;
    for (var i = 0; i < N8.length; i++) {
      var cx = x + N8[i][0], cy = y + N8[i][1], diag = !!(N8[i][0] && N8[i][1]);
      if (!walk(cx, cy)) continue;
      if (diag && hasTarget && !walk(x, cy) && !walk(cx, y)) continue;
      var path = find({ c: cx, r: cy });
      if (!path) continue;
      var cost = pathCost(path, from) + (diag ? DIAG_SPOT_PENALTY : 0);
      if (cost < bestCost) { best = path; bestCost = cost; }
    }
    if (!best && !hasTarget) {
      var n = PF.nearestWalkable(walk, cols, rows, { c: x, r: y }, from);
      if (n) best = find(n);
    }
    return best;
  }

  var Move8 = {
    DIRS: DIRS, SECTORS: SECTORS, JOY_HYST_DEG: JOY_HYST_DEG, N8: N8, DIAG_SPOT_PENALTY: DIAG_SPOT_PENALTY,
    isDiag: isDiag, dirOf: dirOf, parts: parts, heldDir: heldDir, stepMs: stepMs, facingFor: facingFor,
    resolveStep: resolveStep, canStep: canStep, joyDir: joyDir, talkFacing: talkFacing, adjacent: adjacent,
    nearby: nearby, pathCost: pathCost, planWalk: planWalk
  };
  if (typeof window !== 'undefined' && window) { window.JQ = window.JQ || {}; window.JQ.Move8 = Move8; }
  if (typeof module !== 'undefined') module.exports = Move8;
})();
