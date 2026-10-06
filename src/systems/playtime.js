/*
 * 遊玩時間：每日上限（隔天重置）、連續 20 分鐘休息提醒
 */
(function () {
  'use strict';
  var Daily = (typeof module !== 'undefined' && typeof require === 'function') ? require('./daily.js') : window.JQ.Daily;
  var LIMIT_OPTIONS = [15, 20, 30, 45, 60, 0]; // 0 = 不限
  var DEFAULT_LIMIT = 30;
  var REST_MS = 20 * 60 * 1000;
  var GAP_MS = 5 * 60 * 1000; // 兩次 tick 間隔超過 5 分鐘，視為中間有休息

  function create() { return { date: '', todayMs: 0, totalMs: 0, continuousMs: 0, lastTick: 0 }; }

  function rollDay(pt, now) {
    var key = Daily.dateKey(now);
    if (pt.date !== key) { pt.date = key; pt.todayMs = 0; pt.continuousMs = 0; }
  }

  function limitMs(settings) {
    var m = settings && typeof settings.dailyLimitMin === 'number' ? settings.dailyLimitMin : DEFAULT_LIMIT;
    return m > 0 ? m * 60000 : Infinity;
  }

  function isOverLimit(pt, settings, now) {
    rollDay(pt, now);
    return pt.todayMs >= limitMs(settings);
  }

  /** 每秒呼叫一次。回傳事件陣列：'rest'（該休息）、'limit'（今日已達上限） */
  function tick(pt, settings, now) {
    rollDay(pt, now);
    var events = [];
    var delta = pt.lastTick ? now - pt.lastTick : 0;
    pt.lastTick = now;
    if (delta < 0) delta = 0;
    if (delta > GAP_MS) { pt.continuousMs = 0; delta = 0; }
    delta = Math.min(delta, 5000);
    pt.todayMs += delta;
    pt.totalMs += delta;
    pt.continuousMs += delta;
    if (pt.continuousMs >= REST_MS) { pt.continuousMs = 0; events.push('rest'); }
    if (pt.todayMs >= limitMs(settings)) events.push('limit');
    return events;
  }

  /** 暫停計時（例如頁面隱藏、題目以外的停頓不需要；回到前景時呼叫，避免把離開的時間算進去） */
  function pause(pt) { pt.lastTick = 0; }

  function minutes(ms) { return Math.floor(ms / 60000); }

  var Playtime = { LIMIT_OPTIONS: LIMIT_OPTIONS, DEFAULT_LIMIT: DEFAULT_LIMIT, REST_MS: REST_MS, create: create, tick: tick, pause: pause, isOverLimit: isOverLimit, limitMs: limitMs, minutes: minutes };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.Playtime = Playtime; }
  if (typeof module !== 'undefined') module.exports = Playtime;
})();
