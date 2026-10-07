/*
 * 番薯仔跟隨邏輯（與畫面無關，可在 node 測試）。
 * 修正「番薯仔動畫會閃」：
 *  1. 方向遲滯：斜著走時，要某一軸明顯大於另一軸（HYST 倍）才換方向，不會左右／上下來回跳。
 *  2. 停頓寬限：主角一格一格走，番薯仔每格會短暫追上；距離很近但停不到 IDLE_MS 毫秒就不切成站姿。
 *  3. 站姿沿用目前方向（原本固定切成「面朝下」，每格都在走路圖與站姿之間切換）。
 *  4. 透明度平滑：經過障礙時用漸變，不在 1 與 0.5 之間每一格硬切。
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

  /** 依遲滯規則決定方向：目前方向所在的軸仍有明顯位移就不換。 */
  function chooseDir(cur, dx, dy) {
    var ax = Math.abs(dx), ay = Math.abs(dy);
    var curHoriz = cur === 'left' || cur === 'right';
    var want = axisDir(dx, dy);
    var wantHoriz = want === 'left' || want === 'right';
    if (wantHoriz === curHoriz) return want;                 // 同一軸，只是正負號
    if (wantHoriz && ax < ay * HYST && ay > NEAR) return cur;  // 想換成水平，但水平不夠明顯
    if (!wantHoriz && ay < ax * HYST && ax > NEAR) return cur; // 想換成垂直，但垂直不夠明顯
    return want;
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

  /** 平滑透明度：onWalkable＝目前所在格可走（不可走表示正暫時穿過障礙）。 */
  function fadeAlpha(st, onWalkable, delta) {
    var target = onWalkable ? 1 : GHOST_ALPHA;
    var stepA = FADE_PER_MS * delta;
    if (st.alpha < target) st.alpha = Math.min(target, st.alpha + stepA);
    else if (st.alpha > target) st.alpha = Math.max(target, st.alpha - stepA);
    return st.alpha;
  }

  var PetFollow = { create: create, step: step, chooseDir: chooseDir, fadeAlpha: fadeAlpha, IDLE_MS: IDLE_MS, GHOST_ALPHA: GHOST_ALPHA };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.PetFollow = PetFollow; }
  if (typeof module !== 'undefined') module.exports = PetFollow;
})();
