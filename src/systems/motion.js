/*
 * v3.0.1 移動流暢度的計算（86 號表第四節 #1–#4；由 wip_v301/v301_motion_apply.js 複製成 docs/src/systems/motion.js）。
 * 只放純計算，MapScene 呼叫；node 可以 require（tests/v301_motion.test.js 用同一份規則模擬 60 fps 走路）。
 *   #1 鏡頭：平滑中心 c 依時間逼近主角（時間常數 CAM_TAU_MS，和幀率無關）；鏡頭目標＝round(主角)－「取整後的落後量」，
 *      主角和鏡頭用同一個取整，主角在畫面上的位置＝畫面中心＋落後量，只會單向慢慢變，不會前後跳（落後量取整加遲滯，避免在 .5 附近來回）。
 *      離太遠（傳送、換圖）直接對準。
 *   #2 每走完一格，多出來的時間（最多 CARRY_MAX）帶到下一格。
 *   #3 番薯仔／霧仔：在 followers.js 用 PetFollow 的隊伍內插（和主角同一個步伐進度），這裡不用。
 *   #4 走路圖照移動距離換圖：每走半格換一張，順序 0-1-2-1（一輪＝2 格）；換到中間那張（經過腳）時身體往上 WALK_BOB 像素。
 *      減少動態效果時不彈。
 */
(function () {
  'use strict';
  var CAM_TAU_MS = 70;       // 鏡頭時間常數：走路時落後約 152×0.07≈11 像素，停下來 0.2 秒內回到中心
  var CAM_SNAP_TILES = 6;    // 主角和鏡頭中心差超過 6 格（傳送、換圖、退回）就直接對準
  var CAM_HYST = 1.0;        // 落後量取整的遲滯（像素）：幀間隔抖動時落後量會在 ±0.5 像素內晃，遲滯 1 像素才不會在兩個整數之間來回
  var CARRY_MAX = 50;        // 多出來的時間最多帶 50 毫秒（卡頓時不要一口氣跳很遠）
  var WALK_SEQ = [0, 1, 2, 1];
  var WALK_BOB = 2;          // 換圖時身體上下彈 2 像素（DQ 參考影片 2–3 像素）

  /** 平滑中心：c＝{x,y}（null＝第一次），回傳新的 c；tile＝每格像素 */
  function camStep(c, px, py, delta, tile) {
    var snap = CAM_SNAP_TILES * (tile || 32);
    if (!c || !isFinite(c.x) || Math.abs(px - c.x) > snap || Math.abs(py - c.y) > snap) return { x: px, y: py, ox: 0, oy: 0 };
    var a = 1 - Math.exp(-Math.max(0, Number(delta) || 0) / CAM_TAU_MS);
    return { x: c.x + (px - c.x) * a, y: c.y + (py - c.y) * a, ox: c.ox || 0, oy: c.oy || 0 };
  }
  /** 落後量取整（遲滯）：和上次的整數差 1 像素以上才換；快停下來（|落後| < 0.5）就回到 0，主角回到畫面正中間 */
  function roundLag(lag, prev) { return (prev === undefined || prev === null || Math.abs(lag) < 0.5 || Math.abs(lag - prev) >= CAM_HYST) ? Math.round(lag) : prev; }
  /** 鏡頭目標（整數）：c 的 ox、oy 會記下這一幀用的取整落後量（遲滯用） */
  function camTarget(px, py, c) {
    c.ox = roundLag(px - c.x, c.ox); c.oy = roundLag(py - c.y, c.oy);
    return { x: Math.round(px) - c.ox, y: Math.round(py) - c.oy };
  }
  function carry(t, stepMs) { return Math.min(Math.max(0, (Number(t) || 0) - (Number(stepMs) || 0)), CARRY_MAX); }
  function walkIndex(dist, tile) { return Math.floor(Math.max(0, dist) / ((tile || 32) / 2)) % 4; }
  function walkFrame(row, idx) { return row * 3 + WALK_SEQ[idx % 4]; }
  function bobFor(idx, reduce) { return !reduce && (idx % 4 === 1 || idx % 4 === 3) ? WALK_BOB : 0; }
  /** 減少動態效果：家長設定 settings.reduceMotion 'on'／'off'／'auto'（auto＝看系統 prefers-reduced-motion；mm＝window.matchMedia） */
  function reduceMotion(settings, mm) {
    var v = settings && settings.reduceMotion;
    if (v === 'on') return true;
    if (v === 'off') return false;
    try { return !!(mm && mm('(prefers-reduced-motion: reduce)').matches); } catch (e) { return false; }
  }

  var Motion = { CAM_TAU_MS: CAM_TAU_MS, CAM_SNAP_TILES: CAM_SNAP_TILES, CAM_HYST: CAM_HYST, CARRY_MAX: CARRY_MAX, WALK_SEQ: WALK_SEQ, WALK_BOB: WALK_BOB,
    camStep: camStep, camTarget: camTarget, carry: carry, walkIndex: walkIndex, walkFrame: walkFrame, bobFor: bobFor, reduceMotion: reduceMotion };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.Motion = Motion; }
  if (typeof module !== 'undefined') module.exports = Motion;
})();
