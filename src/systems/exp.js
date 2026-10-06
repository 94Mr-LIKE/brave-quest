/* 等級與經驗值：經驗值 需求 = round(40 × lv^1.5) */
(function () {
  'use strict';
  var MAX_LEVEL = 99;

  /** 從 lv 升到 lv+1 需要的 經驗值 */
  function expToNext(lv) {
    return Math.round(40 * Math.pow(lv, 1.5));
  }

  /**
   * 把 amount 加到 player（{level, exp, totalExp}），回傳升了幾級。
   * player.exp 是「目前等級內」的進度。
   */
  function addExp(player, amount) {
    amount = Math.max(0, Math.floor(amount || 0));
    player.exp += amount;
    player.totalExp = (player.totalExp || 0) + amount;
    var gained = 0;
    while (player.level < MAX_LEVEL && player.exp >= expToNext(player.level)) {
      player.exp -= expToNext(player.level);
      player.level += 1;
      gained += 1;
    }
    return gained;
  }

  /** 0~1 的進度比例（給 經驗值 條用） */
  function progress(player) {
    return Math.min(1, player.exp / expToNext(player.level));
  }

  var Exp = { MAX_LEVEL: MAX_LEVEL, expToNext: expToNext, addExp: addExp, progress: progress };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.Exp = Exp; }
  if (typeof module !== 'undefined') module.exports = Exp;
})();
