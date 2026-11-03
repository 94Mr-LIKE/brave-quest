/*
 * 番薯仔跟隨邏輯（與畫面無關，可在 node 測試）。
 * 修正「番薯仔動畫會閃」：
 *  1. 方向遲滯：斜著走時，要某一軸明顯大於另一軸（HYST 倍）才換方向，不會左右／上下來回跳。
 *  2. 停頓寬限：主角一格一格走，番薯仔每格會短暫追上；距離很近但停不到 IDLE_MS 毫秒就不切成站姿。
 *  3. 站姿沿用目前方向（原本固定切成「面朝下」，每格都在走路圖與站姿之間切換）。
 *  4. 透明度平滑：經過障礙時用漸變，不在 1 與 0.5 之間每一格硬切。
 *  5. v1.0.6 主角可以斜走：番薯仔一樣走主角走過的格子（目標＝主角上一格），主角的每一步都不斜穿牆角，
 *     所以番薯仔從上一格直線走到下一格也不會穿牆角；斜走時的方向規則和主角一樣（見 chooseDir）。
 */
(function () {
  'use strict';
  var HYST = 1.35;      // 換方向需要的軸向比例
  var NEAR = 0.6;       // 小於這個距離（像素）視為已到達
  var IDLE_MS = 220;    // 停住超過這麼久才換成站姿
  var FADE_PER_MS = 1 / 180;   // 透明度每毫秒最多變化量（約 0.18 秒從 1 到 0）
  var GHOST_ALPHA = 0.55;

  function create(dir) { return { dir: dir || 'down', still: 0, moving: false, alpha: 1 }; }

  function axisDir(dx, dy) {
    return Math.abs(dx) >= Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
  }

  /**
   * 依遲滯規則決定方向（v1.0.6 配合主角斜走，和主角同一套規則）：
   * - 某一軸明顯大於另一軸（HYST 倍以上）→ 那一軸的方向（同一軸只換正負號）
   * - 差不多斜的位移：目前面向其中一個分量方向就不換（不閃爍）；否則面向橫向（和主角斜走時一樣）
   */
  function chooseDir(cur, dx, dy) {
    var ax = Math.abs(dx), ay = Math.abs(dy);
    if (ax <= NEAR && ay <= NEAR) return cur || axisDir(dx, dy);
    var h = dx > 0 ? 'right' : 'left', v = dy > 0 ? 'down' : 'up';
    if (ay <= NEAR || ax >= ay * HYST) return h;   // 水平明顯
    if (ax <= NEAR || ay >= ax * HYST) return v;   // 垂直明顯
    if (cur === h || cur === v) return cur;        // 斜的：目前方向是其中一個分量就不換
    return h;
  }

  /**
   * 前進一幀。in：{x,y,tx,ty,delta,speed}；speed＝每毫秒像素。
   * 回傳 {x,y,dir,moving}：moving＝要播走路動畫；false＝顯示 dir 方向的站姿。
   */
  function step(st, inp) {
    var dx = inp.tx - inp.x, dy = inp.ty - inp.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    var x = inp.x, y = inp.y;
    if (dist > NEAR) {
      st.dir = chooseDir(st.dir, dx, dy);
      var sp = Math.min(dist, inp.delta * inp.speed);
      x += dx / dist * sp; y += dy / dist * sp;
      st.still = 0; st.moving = true;
    } else {
      x = inp.tx; y = inp.ty;
      st.still += inp.delta;
      if (st.still >= IDLE_MS) st.moving = false;
    }
    return { x: x, y: y, dir: st.dir, moving: st.moving };
  }

  /**
   * v1.0.6 這一步番薯仔的速度：主角每走一步就把目標換成主角的上一格，距離（dist）可能是 1 格（直走）或 √2 格（斜走）。
   * 距離超過 1 格時等比例加快，讓番薯仔每一步都在主角走完這一步之前到達目標格
   * （不會落後、從半路直線切過去穿過牆角）。base＝走 1 格的速度（每毫秒像素）、tile＝一格幾像素。
   */
  function speedFor(base, dist, tile) { return base * Math.max(1, dist / tile); }

  /** 平滑透明度：onWalkable＝目前所在格可走（不可走表示正暫時穿過障礙）。 */
  function fadeAlpha(st, onWalkable, delta) {
    var target = onWalkable ? 1 : GHOST_ALPHA;
    var stepA = FADE_PER_MS * delta;
    if (st.alpha < target) st.alpha = Math.min(target, st.alpha + stepA);
    else if (st.alpha > target) st.alpha = Math.max(target, st.alpha - stepA);
    return st.alpha;
  }

  // 跟班掛鉤：雙跟班使用共同的腳印；原本單隻的 step、速度與動畫規則保持原樣。
  function copyCell(p) { return { x: p.x, y: p.y }; }
  function sameCell(a, b) { return a.x === b.x && a.y === b.y; }
  function canFollow(a, b, walk) {
    var dx = b.x - a.x, dy = b.y - a.y;
    return Math.abs(dx) <= 1 && Math.abs(dy) <= 1 && walk(b.x, b.y) &&
      (!(dx && dy) || (walk(b.x, a.y) && walk(a.x, b.y)));
  }

  /** 進場先找連續的安全格，優先站後方；放不下的跟班等腳印夠長再出現。 */
  function createParty(leader, count, walk, facing) {
    count = Math.min(2, Math.max(0, Math.floor(count || 0)));
    var back = { up: [0, 1], down: [0, -1], left: [1, 0], right: [-1, 0] }[facing] || [0, -1];
    var dirs = [back, [0, -1], [0, 1], [-1, 0], [1, 0]], best = [copyCell(leader)];
    function extend(path) {
      if (path.length > best.length) best = path.slice();
      if (path.length > count) return true;
      var last = path[path.length - 1];
      for (var i = 0; i < dirs.length; i++) {
        var next = { x: last.x + dirs[i][0], y: last.y + dirs[i][1] };
        if (!walk(next.x, next.y) || path.some(function (p) { return sameCell(p, next); })) continue;
        if (extend(path.concat([next]))) return true;
      }
      return false;
    }
    extend(best);
    return { count: count, walk: walk, trail: best, from: best.slice() };
  }

  /** 每一步只保留主角與前兩個腳印，跟班不會從轉角抄近路。 */
  function advanceParty(party, next) {
    var head = party.trail[0];
    if (sameCell(head, next) || !party.walk(next.x, next.y)) return;
    if (Math.abs(next.x - head.x) > 1 || Math.abs(next.y - head.y) > 1) {
      party.trail = [copyCell(next)]; party.from = party.trail.slice(); return;
    }
    if (!canFollow(head, next, party.walk)) return;
    party.from = party.trail.slice();
    party.trail = [copyCell(next)].concat(party.trail).slice(0, party.count + 1);
  }

  /** 與主角用同一個步伐進度。折返重疊或空間不足時暫時收起後面的跟班。 */
  function sampleParty(party, progress, tile) {
    var k = Math.max(0, Math.min(1, progress)), taken = {}, out = [];
    tile = tile || 32;
    function at(i) {
      var to = party.trail[i], from = party.from[i] || to;
      if (!to) return null;
      return { x: from.x + (to.x - from.x) * k, y: from.y + (to.y - from.y) * k };
    }
    // 和 MapScene 一樣，橫向看中心、縱向看腳底上方一個像素。
    function cell(p) { return { x: Math.floor(p.x + 0.5), y: Math.floor(p.y + 1 - 1 / tile) }; }
    var head = cell(at(0)); taken[head.x + ',' + head.y] = true;
    for (var i = 1; i <= party.count; i++) {
      var p = at(i);
      if (!p) { out.push({ x: 0, y: 0, visible: false }); continue; }
      var c = cell(p), key = c.x + ',' + c.y;
      p.visible = party.walk(c.x, c.y) && !taken[key];
      if (p.visible) taken[key] = true;
      out.push(p);
    }
    return out;
  }

  var PetFollow = { create: create, step: step, chooseDir: chooseDir, fadeAlpha: fadeAlpha, speedFor: speedFor, IDLE_MS: IDLE_MS, GHOST_ALPHA: GHOST_ALPHA,
    createParty: createParty, advanceParty: advanceParty, sampleParty: sampleParty };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.PetFollow = PetFollow; }
  if (typeof module !== 'undefined') module.exports = PetFollow;
})();
