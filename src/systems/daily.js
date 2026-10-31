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

  // v2.0 新經濟（67 號第二節第 8 項）：每個任務的金幣＝目前所在區 2 場戰鬥的金幣 ÷ 3（進位）；表由 wip_v20/v20_0_econ_apply.js 照「地圖 → 區」寫入。
  //   進地圖時 setMap 把還沒完成的任務換成這張圖的金幣；表裡沒有的地圖沿用上一張圖的金幣。POOL 的 reward 只用在還沒進過地圖的時候
  var MAP_GOLD = { M01: 2, M02: 2, M03: 2, M04: 4, M05: 10, M06: 4, M07: 4, M08: 10, M09: 5, M10: 12, M11: 12, MT1: 2, M46: 4, M47: 5, M48: 5, M49: 7, M14: 7, M50: 7, M51: 7, M52: 10, M13: 10, M12: 10, M53: 10, M54: 10, M15: 12, M16: 12, M17: 14, M18: 14, M19: 17, M20: 17 };
  var GOLD_DEFAULT = 2;
  function goldFor(mapId, fallback) { return MAP_GOLD[mapId] || fallback || GOLD_DEFAULT; }
  function setMap(daily, mapId) {
    if (!daily) return 0;
    var g = goldFor(mapId, daily.gold);
    daily.gold = g;
    (daily.tasks || []).forEach(function (t) { if (!t.done) t.reward = g; });
    return g;
  }

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

  function create() { return { date: '', tasks: [], adventureDays: 0, gold: 0 }; }

  /** 換日時重置任務並把冒險天數 +1。回傳 true 表示剛換日 */
  function ensure(daily, now) {
    var key = dateKey(now);
    if (daily.date === key) return false;
    daily.date = key;
    daily.tasks = tasksFor(key);
    if (daily.gold > 0) daily.tasks.forEach(function (t) { t.reward = daily.gold; });   // v2.0 新經濟：目前所在區的金幣
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

  var Daily = { MAP_GOLD: MAP_GOLD, goldFor: goldFor, setMap: setMap, POOL: POOL, dateKey: dateKey, tasksFor: tasksFor, create: create, ensure: ensure, record: record };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.Daily = Daily; }
  if (typeof module !== 'undefined') module.exports = Daily;
})();
