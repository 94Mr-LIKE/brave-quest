/*
 * 適性難度：以「科目＋單元」為單位追蹤
 * - 起始 level = START_LEVEL（1）
 * - 同單元連續答對 2 題 → level + 1（上限 4）
 * - 同單元連續答錯 2 題 → level − 1（下限 1），並標記 preferLower：挑題時優先出較低 level
 * - 「答對」定義：第一次送出就答對且沒用提示；第一次送出答錯算「答錯」；
 *   用了提示才答對 → 中性（只打斷連續答對，不累計答錯）
 * - 挑題避開最近 10 題；題庫太小時才放寬
 */
(function () {
  'use strict';
  var START_LEVEL = 1, MIN_LEVEL = 1, MAX_LEVEL = 4, RECENT_SIZE = 10, HISTORY_SIZE = 80;

  function createState() { return { units: {}, recent: [] }; }
  function unitKey(subject, unit) { return subject + '|' + unit; }

  function getUnit(ad, subject, unit) {
    var k = unitKey(subject, unit);
    if (!ad.units[k]) ad.units[k] = { level: START_LEVEL, correctStreak: 0, wrongStreak: 0, preferLower: false };
    return ad.units[k];
  }

  /** result: 'correct' | 'wrong' | 'neutral'；回傳 {change, level} */
  function recordResult(ad, q, result) {
    var u = getUnit(ad, q.subject, q.unit);
    var change = 0;
    if (result === 'correct') {
      u.correctStreak += 1; u.wrongStreak = 0; u.preferLower = false;
      if (u.correctStreak >= 2) {
        if (u.level < MAX_LEVEL) { u.level += 1; change = 1; }
        u.correctStreak = 0;
      }
    } else if (result === 'wrong') {
      u.wrongStreak += 1; u.correctStreak = 0;
      if (u.wrongStreak >= 2) {
        if (u.level > MIN_LEVEL) { u.level -= 1; change = -1; }
        u.wrongStreak = 0; u.preferLower = true;
      }
    } else {
      u.correctStreak = 0;
    }
    return { change: change, level: u.level };
  }

  function pushRecent(ad, id) {
    ad.recent = (ad.recent || []).filter(function (x) { return x !== id; });
    ad.recent.push(id);
    while (ad.recent.length > RECENT_SIZE) ad.recent.shift();
  }

  /** 計算某題對這位孩子的「距離」：越小越適合 */
  function cost(ad, q, answered) {
    var u = ad.units[unitKey(q.subject, q.unit)] || { level: START_LEVEL, preferLower: false };
    var diff = q.level - u.level, c;
    if (diff === 0) c = 0;
    else if (diff < 0) c = -diff * (u.preferLower ? 0.5 : 1);
    else c = diff * (u.preferLower ? 4 : 2);
    if (answered && answered[q.id]) c += 0.75;
    return c;
  }

  /**
   * 從 questions 中挑一題 subject 科目的題目（v0.4：「最近最少出現優先」）
   * opts: { rng, answered, exclude:[id], history:[id…]（這一科最近出過的題目，舊→新，最多 HISTORY_SIZE 筆）, avoidGroup }
   * 1. 先挑「最近 80 題內沒出過」的題目（其中從來沒答對過的優先）；再依難度適合度（cost）挑
   * 2. 都出過了（題庫用完）才重複：挑「最久以前出過」的那題
   * 3. 和上一題同一個 variant_group 的題目不連續出（還有別的可選時）
   */
  function pickQuestion(questions, subject, ad, opts) {
    opts = opts || {};
    var rng = opts.rng || Math.random;
    var exclude = opts.exclude || [];
    var pool = questions.filter(function (q) { return q.subject === subject && exclude.indexOf(q.id) < 0; });
    if (!pool.length) pool = questions.filter(function (q) { return q.subject === subject; });
    if (!pool.length) return null;
    if (opts.avoidGroup) {
      var other = pool.filter(function (q) { return !q.variant_group || q.variant_group !== opts.avoidGroup; });
      if (other.length) pool = other;
    }
    var hist = opts.history || ad.recent || [];
    var pos = {};
    hist.forEach(function (id, i) { pos[id] = i; });   // 數字越大＝越近出過
    var unseen = pool.filter(function (q) { return !(q.id in pos); });
    // 題庫超過 80 題時，掉出紀錄的題目也算「最近沒出過」；其中「從來沒答對過」的再優先
    if (opts.answered) {
      var fresh = unseen.filter(function (q) { return !opts.answered[q.id]; });
      if (fresh.length) unseen = fresh;
    }
    var best = null, bestCost = Infinity;
    if (unseen.length) {
      unseen.forEach(function (q) {
        var c = cost(ad, q, opts.answered) + rng() * 0.4; // 小抖動：同成本時輪流出不同單元
        if (c < bestCost) { bestCost = c; best = q; }
      });
      return best;
    }
    // 題庫用完：最久以前出過的優先（難度只當次要考量）
    pool.forEach(function (q) {
      var c = pos[q.id] * 10 + cost(ad, q, opts.answered) + rng() * 0.4;
      if (c < bestCost) { bestCost = c; best = q; }
    });
    return best;
  }

  /** 記一筆出題紀錄（每科最多 HISTORY_SIZE 筆，存在存檔的 qhist） */
  function pushHistory(qhist, subject, id) {
    var h = (qhist[subject] = (qhist[subject] || []).filter(function (x) { return x !== id; }));
    h.push(id);
    while (h.length > HISTORY_SIZE) h.shift();
    return h;
  }

  var Adaptive = {
    START_LEVEL: START_LEVEL, MIN_LEVEL: MIN_LEVEL, MAX_LEVEL: MAX_LEVEL, RECENT_SIZE: RECENT_SIZE,
    createState: createState, unitKey: unitKey, getUnit: getUnit, recordResult: recordResult,
    pushRecent: pushRecent, pickQuestion: pickQuestion, cost: cost, pushHistory: pushHistory, HISTORY_SIZE: HISTORY_SIZE
  };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.Adaptive = Adaptive; }
  if (typeof module !== 'undefined') module.exports = Adaptive;
})();
