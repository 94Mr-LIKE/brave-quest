/*
 * v1.3.1 台語氣象諺語（劇本語音組 2026-10-25「諺語_設計與挑錯關卡.md」）：收集、挑錯關卡的規則。純計算，可以在 node 測試。
 * 資料：docs/data/proverbs.js 的 window.PROVERBS（諺語清冊）、window.PROVERB_QUIZ（挑錯關卡）；對白在 dialogs.js（D_PV_*、D_PVQ_*）。
 * 存檔：state.proverbs = { got: { PV_01: true }, quiz: { PVQ_1: true } }（一般欄位，不升 schema；got／quiz 是字典型欄位）
 * 規則：
 *   - 第一次和說這句諺語的阿伯說話（在他所在的地圖）→ 先說諺語、記成收集到（pendingFor／collect）
 *   - 收集到以後、這位阿伯沒有委託要處理時再說話 → 挑錯關卡（quizFor）：選項打亂（quizQuestion）；答對記 quiz、第一次給 20 金幣（solve），答錯給提示再選一次
 */
(function () {
  'use strict';
  var KIND = { '經驗': '看天氣的經驗', '民間說法': '民間說法', '民間傳說': '民間傳說' };
  /**
   * 自己的台詞要先講完、諺語和挑錯排在後面的人（協調員 2026-10-26 裁定）：慈護宮廟公——面對他說話一定先播慈護宮介紹（D_TEMPLE_INTRO），
   * 同一次說話接著說諺語／挑錯（smoke「面對廟公說話才介紹」照舊成立）；轉職在神像、供桌，不經過這裡，不會被擋住。其他 9 位阿伯第一次說話先說諺語
   */
  var OWN_FIRST = { temple_keeper: true };
  function ownFirst(npcId) { return OWN_FIRST[npcId] === true; }

  function ensure(state) {
    if (!state.proverbs || typeof state.proverbs !== 'object') state.proverbs = { got: {}, quiz: {} };
    if (!state.proverbs.got || typeof state.proverbs.got !== 'object') state.proverbs.got = {};
    if (!state.proverbs.quiz || typeof state.proverbs.quiz !== 'object') state.proverbs.quiz = {};
    return state.proverbs;
  }
  function has(state, id) { return !!(state && state.proverbs && state.proverbs.got && state.proverbs.got[id] === true); }
  function solved(state, id) { return !!(state && state.proverbs && state.proverbs.quiz && state.proverbs.quiz[id] === true); }

  /** 這位 NPC（在這張地圖）還沒說過的諺語；沒有就 null */
  function pendingFor(state, npcId, mapId, list) {
    var arr = Array.isArray(list) ? list : [];
    for (var i = 0; i < arr.length; i++) if (arr[i].npc === npcId && arr[i].map === mapId && !has(state, arr[i].id)) return arr[i];
    return null;
  }
  /** 記成收集到。回傳 true＝這次才收集到 */
  function collect(state, id) {
    var p = ensure(state);
    if (p.got[id] === true) return false;
    p.got[id] = true;
    return true;
  }
  /** 這位 NPC 現在可以玩的挑錯關卡（對應的諺語收集到了、還沒答對）；沒有就 null */
  function quizFor(state, npcId, mapId, quizzes) {
    var arr = Array.isArray(quizzes) ? quizzes : [];
    for (var i = 0; i < arr.length; i++) {
      var q = arr[i];
      if (q.npc === npcId && q.map === mapId && has(state, q.proverb) && !solved(state, q.id)) return q;
    }
    return null;
  }
  /** 這句諺語有沒有挑錯關卡 */
  function quizOf(proverbId, quizzes) {
    return (Array.isArray(quizzes) ? quizzes : []).filter(function (q) { return q.proverb === proverbId; })[0] || null;
  }
  /** 選了第 idx 個選項：是不是挑對了（answer＝錯的那一句的位置） */
  function check(q, idx) { return !!q && typeof idx === 'number' && idx === q.answer; }
  /**
   * 挑對了：記成答對；第一次答對給 QUIZ_GOLD 金幣（協調員 2026-10-25 裁定 20 金幣、每關只給一次——
   * 答對的紀錄就存在 state.proverbs.quiz，記過的不再給）。回傳 { first, gold }
   */
  var QUIZ_GOLD = 20;
  function solve(state, id) {
    var p = ensure(state);
    if (p.quiz[id] === true) return { first: false, gold: 0 };
    p.quiz[id] = true;
    if (state.player) state.player.coins = (Number(state.player.coins) || 0) + QUIZ_GOLD;
    return { first: true, gold: QUIZ_GOLD };
  }
  /**
   * 挑錯選單的題目：和一般答題一樣用 Answer.shuffleOptions 打亂選項（協調員裁定；不改草稿）。
   * 回傳 { type, options, answer, optionOrder }；answer＝打亂後錯的那一句的位置。shuffle＝JQ.Answer.shuffleOptions
   */
  function quizQuestion(q, shuffle, rng) {
    var base = { type: 'choice', options: q.options.slice(), answer: q.answer };
    return typeof shuffle === 'function' ? shuffle(base, rng) : base;
  }
  /** 收集進度 { got, total, solved, quizzes } */
  function progress(state, list, quizzes) {
    var arr = Array.isArray(list) ? list : [], qs = Array.isArray(quizzes) ? quizzes : [];
    return {
      got: arr.filter(function (p) { return has(state, p.id); }).length, total: arr.length,
      solved: qs.filter(function (q) { return solved(state, q.id); }).length, quizzes: qs.length
    };
  }
  function kindLabel(kind) { return KIND[kind] || kind || ''; }
  /** 番薯仔的華語解釋（諺語對白裡番薯仔的第一句） */
  function explain(p, dialogs) {
    var lines = (dialogs && p && dialogs[p.dialog]) || [];
    for (var i = 0; i < lines.length; i++) if (lines[i].who === 'pet') return lines[i].text;
    return '';
  }
  /** 挑錯選單上面的那句話（阿伯故意說錯的那一句＝ask 對白的最後一句） */
  function claim(q, dialogs) {
    var lines = (dialogs && q && dialogs[q.ask]) || [];
    return lines.length ? lines[lines.length - 1].text : '';
  }

  var Proverbs = { KIND: KIND, OWN_FIRST: OWN_FIRST, ownFirst: ownFirst, QUIZ_GOLD: QUIZ_GOLD, quizQuestion: quizQuestion, ensure: ensure, has: has, solved: solved, pendingFor: pendingFor, collect: collect, quizFor: quizFor, quizOf: quizOf,
    check: check, solve: solve, progress: progress, kindLabel: kindLabel, explain: explain, claim: claim };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.Proverbs = Proverbs; }
  if (typeof module !== 'undefined') module.exports = Proverbs;
})();
