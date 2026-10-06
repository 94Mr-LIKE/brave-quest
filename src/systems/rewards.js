/*
 * 獎勵規則（防亂猜）
 * - 第一次就答對、沒用任何提示（含免費提示、刪去卡）→ 經驗值 全額
 * - 用過提示或答錯後才答對 → 經驗值 × 0.5（無條件捨去），並要求馬上做一題「變化題」
 * - 變化題「第一次就答對且沒用提示」→ 補回原題的另一半（原題 exp − 已給的一半）
 *   變化題沒有一次答對 → 補回機會作廢；變化題本身依一般規則計分（可能再觸發新的變化題）
 * - 已經答對過的題目再答對 → 不給 經驗值，只給 1 金幣（但若它正好是變化題且一次答對，仍補回原題另一半）
 * - 金幣 = floor(經驗值 / 2)；重複題另 +1
 */
(function () {
  'use strict';

  /**
   * ctx = {
   *   question,            // 題目物件（需 exp）
   *   wrongCount,          // 這題答錯幾次
   *   hintsUsed,           // 是否用過任何提示或刪去卡
   *   alreadyCorrect,      // 這題以前是否已答對過
   *   pendingVariant       // 若這題是「變化題」，傳入待補回的資料 {bonus,...}；否則 null
   * }
   */
  function computeReward(ctx) {
    var q = ctx.question;
    var full = Math.max(0, Math.floor(q.exp || 0));
    var firstTry = (ctx.wrongCount || 0) === 0 && !ctx.hintsUsed;
    var bonusPaid = (ctx.pendingVariant && firstTry) ? Math.max(0, ctx.pendingVariant.bonus || 0) : 0;
    var base = 0, outcome, needVariant = false, variantBonus = 0;

    if (ctx.alreadyCorrect) {
      outcome = 'repeat';
    } else if (firstTry) {
      base = full;
      outcome = 'full';
    } else {
      base = Math.floor(full * 0.5);
      outcome = 'half';
      needVariant = true;
      variantBonus = full - base;
    }
    var exp = base + bonusPaid;
    var coins = Math.floor(exp / 2) + (ctx.alreadyCorrect ? 1 : 0);
    return {
      exp: exp, coins: coins, outcome: outcome, firstTry: firstTry,
      needVariant: needVariant, variantBonus: variantBonus,
      bonusPaid: bonusPaid, bonusForfeited: !!(ctx.pendingVariant && !firstTry)
    };
  }

  /** 建立「待補回」紀錄 */
  function makePending(q, bonus) {
    return { fromId: q.id, group: q.variant_group || null, subject: q.subject, unit: q.unit, level: q.level, bonus: bonus };
  }

  /**
   * 挑變化題：同 variant_group → 同科同單元同 level → 同科同單元 → 同科（皆排除原題）。
   * 每一層都優先「不在最近清單」且「還沒答對過」的題目。
   */
  function pickVariant(questions, pending, opts) {
    opts = opts || {};
    var recent = opts.recent || [];
    var answered = opts.answered || {};
    var rng = opts.rng || Math.random;
    var tiers = [
      function (q) { return pending.group && q.variant_group === pending.group; },
      function (q) { return q.subject === pending.subject && q.unit === pending.unit && q.level === pending.level; },
      function (q) { return q.subject === pending.subject && q.unit === pending.unit; },
      function (q) { return q.subject === pending.subject; }
    ];
    for (var t = 0; t < tiers.length; t++) {
      var pool = questions.filter(function (q) { return q.id !== pending.fromId && tiers[t](q); });
      if (!pool.length) continue;
      var fresh = pool.filter(function (q) { return recent.indexOf(q.id) < 0 && !answered[q.id]; });
      var notRecent = pool.filter(function (q) { return recent.indexOf(q.id) < 0; });
      var pick = fresh.length ? fresh : (notRecent.length ? notRecent : pool);
      return { question: pick[Math.floor(rng() * pick.length)], tier: t };
    }
    return null;
  }

  var Rewards = { computeReward: computeReward, makePending: makePending, pickVariant: pickVariant };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.Rewards = Rewards; }
  if (typeof module !== 'undefined') module.exports = Rewards;
})();
