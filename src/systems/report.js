/* 學習紀錄與家長報表 */
(function () {
  'use strict';
  var isNode = typeof module !== 'undefined' && typeof require === 'function';
  var Playtime = isNode ? require('./playtime.js') : window.JQ.Playtime;

  /** 每次送出答案時呼叫 */
  function recordSubmission(state, q) {
    var s = state.stats.subjects[q.subject];
    if (s) s.submissions += 1;
  }

  /** 一題完成（終於答對）時呼叫。firstTry = 第一次送出就答對且沒用提示 */
  function recordDone(state, q, firstTry) {
    var s = state.stats.subjects[q.subject];
    if (s) { s.done += 1; if (firstTry) s.firstTry += 1; }
    var key = q.subject + '|' + q.unit;
    var u = state.stats.units[key] || (state.stats.units[key] = { subject: q.subject, unit: q.unit, done: 0, firstTry: 0 });
    u.done += 1;
    if (firstTry) u.firstTry += 1;
  }

  function rate(o) { return o.done ? o.firstTry / o.done : null; }

  function build(state, now) {
    var subjects = Object.keys(state.stats.subjects).map(function (k) {
      var s = state.stats.subjects[k];
      return { subject: k, done: s.done, firstTry: s.firstTry, rate: rate(s) };
    });
    var weak = Object.keys(state.stats.units).map(function (k) {
      var u = state.stats.units[k];
      return { key: k, subject: u.subject, unit: u.unit, done: u.done, rate: rate(u) };
    }).filter(function (u) { return u.done > 0; })
      .sort(function (a, b) { return a.rate - b.rate || b.done - a.done; })
      .slice(0, 3);
    var pt = state.playtime;
    var todayKey = now ? (function () { var d = new Date(now); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); })() : pt.date;
    return {
      subjects: subjects,
      weakUnits: weak,
      todayMin: pt.date === todayKey ? Playtime.minutes(pt.todayMs) : 0,
      totalMin: Playtime.minutes(pt.totalMs),
      adventureDays: state.daily.adventureDays || 0
    };
  }

  var Report = { recordSubmission: recordSubmission, recordDone: recordDone, build: build };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.Report = Report; }
  if (typeof module !== 'undefined') module.exports = Report;
})();
