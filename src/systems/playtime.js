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

  /** 今天還剩幾分鐘（無條件捨去；不限時回傳 Infinity） */
  function remainingMin(pt, settings, now) {
    rollDay(pt, now);
    var lim = limitMs(settings);
    if (lim === Infinity) return Infinity;
    return Math.max(0, Math.floor((lim - pt.todayMs) / 60000));
  }

  /**
   * v0.9.3（老闆核准）進入最終頭目戰前看今天還剩多少時間：
   * 剩 25 分鐘以上 → 'go'（直接進場）；10～25 分鐘 → 'ask'（提醒可能打不完，讓孩子自己選）；不到 10 分鐘 → 'tomorrow'（不讓進場）。
   * 回傳 { action, minutes }
   */
  var FINAL_GO_MIN = 25, FINAL_MIN = 10;
  function finalBossGate(pt, settings, now) {
    var left = remainingMin(pt, settings, now);
    return { action: left >= FINAL_GO_MIN ? 'go' : left >= FINAL_MIN ? 'ask' : 'tomorrow', minutes: left };
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

  var Playtime = { remainingMin: remainingMin, finalBossGate: finalBossGate, FINAL_GO_MIN: FINAL_GO_MIN, FINAL_MIN: FINAL_MIN, LIMIT_OPTIONS: LIMIT_OPTIONS, DEFAULT_LIMIT: DEFAULT_LIMIT, REST_MS: REST_MS, create: create, tick: tick, pause: pause, isOverLimit: isOverLimit, limitMs: limitMs, minutes: minutes };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.Playtime = Playtime; }
  if (typeof module !== 'undefined') module.exports = Playtime;
})();
