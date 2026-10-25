/* 題目格式驗證與答案判斷（四種題型：choice / multi / number / order） */
(function () {
  'use strict';
  var SUBJECTS = ['國語', '英語', '數學', '自然', '社會'];
  var TYPES = ['choice', 'multi', 'number', 'order'];

  function isInt(n) { return typeof n === 'number' && isFinite(n) && Math.floor(n) === n; }

  /** 回傳錯誤訊息陣列；空陣列代表格式正確 */
  function validateQuestion(q) {
    var errs = [];
    if (!q || typeof q !== 'object') return ['不是物件'];
    if (!q.id || typeof q.id !== 'string') errs.push('缺 id');
    if (SUBJECTS.indexOf(q.subject) < 0) errs.push('subject 不在五科內');
    if (TYPES.indexOf(q.type) < 0) errs.push('type 不正確');
    if (!q.stem) errs.push('缺 stem');
    if ([1, 2, 3, 4].indexOf(q.level) < 0) errs.push('level 需為 1-4');
    var needOptions = q.type === 'choice' || q.type === 'multi' || q.type === 'order';
    if (needOptions && (!Array.isArray(q.options) || q.options.length < 2)) errs.push('options 至少 2 個');
    var n = Array.isArray(q.options) ? q.options.length : 0;
    if (q.type === 'choice' && !(isInt(q.answer) && q.answer >= 0 && q.answer < n)) errs.push('choice answer 需為選項索引');
    if (q.type === 'multi') {
      if (!Array.isArray(q.answer) || q.answer.length < 1 || q.answer.some(function (a) { return !isInt(a) || a < 0 || a >= n; })) errs.push('multi answer 需為索引陣列');
    }
    if (q.type === 'order') {
      var ok = Array.isArray(q.answer) && q.answer.length === n;
      if (ok) {
        var sorted = q.answer.slice().sort(function (a, b) { return a - b; });
        for (var i = 0; i < n; i++) if (sorted[i] !== i) ok = false;
      }
      if (!ok) errs.push('order answer 需為所有選項索引的排列');
    }
    if (q.type === 'number' && (typeof q.answer !== 'number' || !isFinite(q.answer))) errs.push('number answer 需為數字');
    if (!Array.isArray(q.hints) || q.hints.length < 3) errs.push('hints 需 3 層');
    return errs;
  }

  /** 過濾題庫：回傳 {valid:[], invalid:[{id, errors}]} */
  function normalizeQuestions(list) {
    var valid = [], invalid = [], seen = {};
    (Array.isArray(list) ? list : []).forEach(function (q) {
      var errs = validateQuestion(q);
      if (!errs.length && seen[q.id]) errs.push('id 重複');
      if (errs.length) { invalid.push({ id: q && q.id, errors: errs }); return; }
      seen[q.id] = true;
      if (!q.exp) q.exp = [10, 20, 35, 50][q.level - 1];
      if (!q.tts_lang) q.tts_lang = q.subject === '英語' ? 'en-US' : 'zh-TW';
      valid.push(q);
    });
    return { valid: valid, invalid: invalid };
  }

  /** response 形狀：choice→索引；multi→索引陣列；number→數字或字串；order→索引陣列 */
  function checkAnswer(q, response) {
    if (q.type === 'choice') return response === q.answer;
    if (q.type === 'multi') {
      if (!Array.isArray(response)) return false;
      var a = q.answer.slice().sort(), b = response.slice().sort();
      if (a.length !== b.length) return false;
      for (var i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
      return true;
    }
    if (q.type === 'number') {
      if (response === '' || response === null || response === undefined) return false;
      var v = Number(response);
      return isFinite(v) && Math.abs(v - q.answer) < 1e-9;
    }
    if (q.type === 'order') {
      if (!Array.isArray(response) || response.length !== q.answer.length) return false;
      for (var j = 0; j < response.length; j++) if (response[j] !== q.answer[j]) return false;
      return true;
    }
    return false;
  }

  /** 給測試與除錯用：產生該題的正確作答 */
  function correctResponse(q) {
    if (q.type === 'multi' || q.type === 'order') return q.answer.slice();
    return q.answer;
  }

  /**
   * v1.3 打亂選項（委託、寶箱、戰鬥的 quiz.js 和立志小考 trial.js 共用；原本只有 trial.js 有 shuffled()）
   * - 只打亂 choice、multi；order（排序題）、number 原樣回傳。
   * - 「以上皆是／以上皆非／以上都對…」這類要固定在原位的選項不動，其餘選項用 Fisher–Yates 打亂（和 trial.js 舊規則相同）。
   * - 回傳新物件（不改題庫原題）：options、answer、option_why 一起換；optionOrder[i]＝畫面第 i 個選項原本的索引。
   *   打亂過的題目帶 shuffled: true，再呼叫一次會原樣回傳（同一題重開視窗時，刪去卡的索引不會亂掉）。
   */
  var FIXED_OPTION = /^\s*(以上皆是|以上皆非|以上皆對|以上皆錯|以上都對|以上都不對|以上都是|以上都不是|以上都錯|都對|都不對|都是|都不是)\s*[。.]?\s*$/;
  function shuffleOptions(q, rng) {
    if (!q || (q.type !== 'choice' && q.type !== 'multi') || !Array.isArray(q.options) || q.shuffled) return q;
    rng = rng || Math.random;
    var n = q.options.length, idx = [], free = [];
    for (var i = 0; i < n; i++) { idx.push(i); if (!FIXED_OPTION.test(String(q.options[i]))) free.push(i); }
    var perm = free.slice();
    for (var k = perm.length - 1; k > 0; k--) { var j = Math.floor(rng() * (k + 1)); var t = perm[k]; perm[k] = perm[j]; perm[j] = t; }
    free.forEach(function (pos, m) { idx[pos] = perm[m]; });
    var c = {};
    for (var key in q) if (Object.prototype.hasOwnProperty.call(q, key)) c[key] = q[key];
    c.options = idx.map(function (o) { return q.options[o]; });
    if (Array.isArray(q.option_why) && q.option_why.length === n) c.option_why = idx.map(function (o) { return q.option_why[o]; });
    var map = function (a) { return idx.indexOf(a); };
    c.answer = Array.isArray(q.answer) ? q.answer.map(map) : map(q.answer);
    c.optionOrder = idx;
    c.shuffled = true;
    return c;
  }

  var Answer = { SUBJECTS: SUBJECTS, TYPES: TYPES, validateQuestion: validateQuestion, normalizeQuestions: normalizeQuestions, checkAnswer: checkAnswer, correctResponse: correctResponse, FIXED_OPTION: FIXED_OPTION, shuffleOptions: shuffleOptions };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.Answer = Answer; }
  if (typeof module !== 'undefined') module.exports = Answer;
})();
