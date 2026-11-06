/*
 * 錯題回顧（v3.0.1 ④；競品吸收清單第 4 項，老闆 2026-11-04 核准）：冒險手帳「學習紀錄」的「再挑戰一次」。
 * 由 wip_v301/v301_features_apply.js 複製成 docs/src/systems/review.js。純函式（node 可以 require）。
 * 只用存檔裡本來就有的紀錄：qhist（每科最近出過的題目，Adaptive.pushHistory，最多 80 筆）＋ answered（答對過的題目）。
 *   要再挑戰的題＝最近出過、還沒答對過（答錯、時間到、先離開都算），寶箱題不算（留給寶箱）。答對以後 answered 會記下來，就自動離開清單（不能一直刷經驗值）。
 * 一次最多 ROUND 題；答對一題給一點經驗值 rewardExp（題目經驗值的兩成、至少 2），不給金幣。出題順序交給 Session（適性難度 Adaptive）。
 */
(function () {
  'use strict';
  var isNode = typeof module !== 'undefined' && typeof require === 'function';
  var Chests = isNode ? require('./chests.js') : window.JQ.Chests;
  var ROUND = 5;
  var SUBJECTS = ['國語', '英語', '數學', '自然', '社會'];

  /** 要再挑戰的題：[{ id, subject, level, unit }]，每一科照「最近出過的在前面」 */
  function wrongList(state, questions) {
    var qh = (state && state.qhist) || {}, ok = (state && state.answered) || {}, byId = {}, out = [], seen = {};
    (questions || []).forEach(function (q) { if (q && q.id) byId[q.id] = q; });
    SUBJECTS.concat(Object.keys(qh).filter(function (s) { return SUBJECTS.indexOf(s) < 0; })).forEach(function (s) {
      var h = Array.isArray(qh[s]) ? qh[s] : [];
      for (var i = h.length - 1; i >= 0; i--) {
        var id = h[i], q = byId[id];
        if (!q || seen[id] || ok[id] || (Chests && Chests.isChestQuestion(q))) continue;
        seen[id] = true;
        out.push({ id: id, subject: q.subject, level: q.level, unit: q.unit });
      }
    });
    return out;
  }
  /** 每一科有幾題：{ 科目: n }（沒有的科目不列） */
  function bySubject(list) { var o = {}; (list || []).forEach(function (x) { o[x.subject] = (o[x.subject] || 0) + 1; }); return o; }
  /** 答對一題給的經驗值：題目經驗值（1 星 10…4 星 50）的兩成，至少 2 */
  function rewardExp(q) { return Math.max(2, Math.round(((q && q.exp) || 10) * 0.2)); }

  var Review = { ROUND: ROUND, SUBJECTS: SUBJECTS, wrongList: wrongList, bySubject: bySubject, rewardExp: rewardExp };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.Review = Review; }
  if (typeof module !== 'undefined') module.exports = Review;
})();
