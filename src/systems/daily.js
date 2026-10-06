/*
 * 每日小任務：每天 3 個，完成自動發金幣。
 * 只記「累計冒險天數」，不做連續登入、不會因為沒來而歸零。
 */
(function () {
  'use strict';
  var POOL = [
    { id: 'correct5', text: '答對 5 題', event: 'correct', target: 5, reward: 10 },
    { id: 'quest1', text: '完成 1 個委託', event: 'quest', target: 1, reward: 15 },
    { id: 'feed1', text: '餵番薯仔 1 次', event: 'feed', target: 1, reward: 5 },
    { id: 'subjects2', text: '答對 2 個不同科目的題目', event: 'subject', target: 2, reward: 10 },
    { id: 'firsttry3', text: '自己想、一次就答對 3 題', event: 'firsttry', target: 3, reward: 10 }
  ];

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  /** 本地日期字串 YYYY-MM-DD */
  function dateKey(now) {
    var d = new Date(now);
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  function hash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    return h >>> 0;
  }

  /** 依日期決定當天 3 個任務（同一天結果固定）；第一個固定是「答對 5 題」 */
  function tasksFor(key) {
    var rest = POOL.slice(1);
    var h = hash(key);
    var picked = [POOL[0]];
    while (picked.length < 3) {
      var idx = h % rest.length;
      picked.push(rest.splice(idx, 1)[0]);
      h = Math.floor(h / 7) + 13;
    }
    return picked.map(function (t) { return { id: t.id, text: t.text, event: t.event, target: t.target, reward: t.reward, progress: 0, done: false, seen: [] }; });
  }

  function create() { return { date: '', tasks: [], adventureDays: 0 }; }

  /** 換日時重置任務並把冒險天數 +1。回傳 true 表示剛換日 */
  function ensure(daily, now) {
    var key = dateKey(now);
    if (daily.date === key) return false;
    daily.date = key;
    daily.tasks = tasksFor(key);
    daily.adventureDays = (daily.adventureDays || 0) + 1;
    return true;
  }

  /**
   * 記錄事件。event: 'correct' | 'quest' | 'feed' | 'subject'（payload=科目）| 'firsttry'
   * 回傳本次剛完成的任務陣列（呼叫端負責加金幣）
   */
  function record(daily, event, payload) {
    var done = [];
    daily.tasks.forEach(function (t) {
      if (t.done || t.event !== event) return;
      if (event === 'subject') {
        if (t.seen.indexOf(payload) >= 0) return;
        t.seen.push(payload);
      }
      t.progress += 1;
      if (t.progress >= t.target) { t.progress = t.target; t.done = true; done.push(t); }
    });
    return done;
  }

  var Daily = { POOL: POOL, dateKey: dateKey, tasksFor: tasksFor, create: create, ensure: ensure, record: record };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.Daily = Daily; }
  if (typeof module !== 'undefined') module.exports = Daily;
})();
