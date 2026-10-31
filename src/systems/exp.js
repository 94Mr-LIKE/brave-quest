/*
 * 等級與經驗值。v2.0 新經濟（26 號 2.4 升級表）：升到下一級需要的經驗值＝TABLE[等級−1]×職階倍率（見習、初級 ×1.0、中級 ×1.25、高級 ×1.5，四捨五入）。
 *   TABLE＝26_v1.0數值表.xlsx「升級表」初級欄（由成品匣 wip_v20/v20_0_econ_apply.js 寫入）。Lv99 以後用 Lv98 的數字（等級上限 99，不會再升）。
 *   舊的升級表 round(40 × lv^1.5)＝oldExpToNext：只給舊存檔換算用（EconMigrate 換算進度比例、JobMigrate 的 v0.9 → v1.0 換算）。
 */
(function () {
  'use strict';
  var MAX_LEVEL = 99;

  var TABLE = [12, 16, 25, 40, 60, 85, 115, 150, 180, 210, 250, 290, 340, 380, 420, 470, 530, 590, 660, 730, 800, 880, 970, 1070, 1150, 1240, 1330, 1430, 1540, 1660, 1790, 1920, 2050, 2200, 2350, 2500, 2650, 2800, 2950, 3150, 3300, 3450, 3650, 3850, 4100, 4400, 4700, 4900, 5150, 5350, 5550, 5750, 6000, 6200, 6400, 6650, 6900, 7150, 7400, 7650, 7900, 8100, 8250, 8450, 8600, 8750, 8950, 9150, 9300, 9500, 9700, 9900, 10100, 10300, 10500, 10700, 10900, 11150, 11350, 11600, 11800, 12050, 12300, 12550, 12750, 13000, 13150, 13300, 13500, 13650, 13850, 14000, 14200, 14350, 14550, 14700, 14900, 15100];
  var TIER = { novice: 1, basic: 1, inter: 1.25, adv: 1.5 };

  /** 從 lv 升到 lv+1 需要的經驗值；tier＝職階（novice、basic、inter、adv；不給＝×1.0） */
  function expToNext(lv, tier) {
    var L = Math.max(1, Math.min(TABLE.length, Math.floor(lv) || 1));
    var k = TIER[tier] || 1;
    return k === 1 ? TABLE[L - 1] : Math.floor(TABLE[L - 1] * k + 0.5);
  }

  /** v2.0 以前的升級表（舊存檔換算用） */
  function oldExpToNext(lv) {
    return Math.round(40 * Math.pow(lv, 1.5));
  }

  /** 從 Lv1 累積到 lv 要多少經驗值（新表） */
  function cumulative(lv, tier) {
    var n = 0;
    for (var l = 1; l < lv && l < MAX_LEVEL; l++) n += expToNext(l, tier);
    return n;
  }

  /**
   * 把 amount 加到 player（{level, exp, totalExp}），回傳升了幾級。
   * player.exp 是「目前等級內」的進度。
   */
  function addExpWith(player, amount, need) {
    amount = Math.max(0, Math.floor(amount || 0));
    player.exp += amount;
    player.totalExp = (player.totalExp || 0) + amount;
    var gained = 0;
    while (player.level < MAX_LEVEL && player.exp >= need(player.level)) {
      player.exp -= need(player.level);
      player.level += 1;
      gained += 1;
    }
    return gained;
  }
  /** tier 不給＝×1.0（見習、初級；v2.1 中級職業要傳 tier） */
  function addExp(player, amount, tier) {
    return addExpWith(player, amount, function (lv) { return expToNext(lv, tier); });
  }

  /** 0~1 的進度比例（給 經驗值 條用） */
  function progress(player, tier) {
    return Math.min(1, player.exp / expToNext(player.level, tier));
  }

  var Exp = { MAX_LEVEL: MAX_LEVEL, TABLE: TABLE, TIER: TIER, expToNext: expToNext, oldExpToNext: oldExpToNext, cumulative: cumulative, addExp: addExp, addExpWith: addExpWith, progress: progress };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.Exp = Exp; }
  if (typeof module !== 'undefined') module.exports = Exp;
})();
