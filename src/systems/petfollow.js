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

  var PetFollow = { create: create, step: step, chooseDir: chooseDir, fadeAlpha: fadeAlpha, speedFor: speedFor, IDLE_MS: IDLE_MS, GHOST_ALPHA: GHOST_ALPHA };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.PetFollow = PetFollow; }
  if (typeof module !== 'undefined') module.exports = PetFollow;
})();
