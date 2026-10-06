/*
 * 防亂猜冷卻：3 秒內作答且答錯，連續 2 次 → 鎖 5 秒並提示「先慢慢讀一次題目喔」
 * elapsedMs = 從題目出現（或上一次答錯回饋後）到送出的時間
 */
(function () {
  'use strict';
  var FAST_MS = 3000, LOCK_MS = 5000, STREAK = 2;

  function create() { return { fastWrong: 0, lockedUntil: 0 }; }

  function isLocked(g, now) { return now < g.lockedUntil; }
  function remainingMs(g, now) { return Math.max(0, g.lockedUntil - now); }

  /** 回傳 {locked, lockMs} */
  function onAnswer(g, correct, elapsedMs, now) {
    if (correct) { g.fastWrong = 0; return { locked: false, lockMs: 0 }; }
    if (elapsedMs < FAST_MS) g.fastWrong += 1; else g.fastWrong = 0;
    if (g.fastWrong >= STREAK) {
      g.fastWrong = 0;
      g.lockedUntil = now + LOCK_MS;
      return { locked: true, lockMs: LOCK_MS };
    }
    return { locked: false, lockMs: 0 };
  }

  var Guard = { FAST_MS: FAST_MS, LOCK_MS: LOCK_MS, create: create, isLocked: isLocked, remainingMs: remainingMs, onAnswer: onAnswer, MESSAGE: '先慢慢讀一次題目喔' };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.Guard = Guard; }
  if (typeof module !== 'undefined') module.exports = Guard;
})();
