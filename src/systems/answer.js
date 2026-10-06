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

  var Answer = { SUBJECTS: SUBJECTS, TYPES: TYPES, validateQuestion: validateQuestion, normalizeQuestions: normalizeQuestions, checkAnswer: checkAnswer, correctResponse: correctResponse };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.Answer = Answer; }
  if (typeof module !== 'undefined') module.exports = Answer;
})();
