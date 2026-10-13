/*
 * v1.0.1 首頁「已有 N 位冒險者加入」計數器（成品匣 23_自建計數器_設定SOP.md 第三節；後端 tools/counter/worker.js）
 *
 * - 只有兩個網址：GET /count → {"count":N}、POST /new → {"count":N+1}。不送名字、存檔或任何資料。
 * - CSP 的 connect-src 只多開放 URL 這一個網址（index.html）。
 * - 建立角色成功後送一次 POST /new；同一台裝置只送一次（localStorage 的 FLAG_KEY，bq_ 開頭）。
 * - v1.0.2（老闆 2026-10-13「舊玩家也要算進去」）：遊戲啟動時，這台裝置已經有存檔（bq_save 或 bq_save:<欄位>）但還沒有旗標
 *   → 也送一次。不管有幾份存檔、建幾次角色，同一台裝置總共只送一次（共用同一個旗標）。非同步，不擋標題畫面。
 *   先記旗標再送：連不上、伺服器錯誤都不重送，也不影響遊戲。
 * - 首頁讀數字：3 秒逾時；500、離線、格式不對、file:// 開啟 → 回傳 null（不顯示），不丟例外、程式不在主控台印任何東西。
 *   （伺服器回 500 時，瀏覽器自己會在網路紀錄留一行「Failed to load resource」，那是瀏覽器的訊息，程式擋不掉。）
 */
(function () {
  'use strict';
  var URL = 'https://bq-counter.mr-bigboss-office.workers.dev';
  var FLAG_KEY = 'bq_counted';
  var TIMEOUT_MS = 3000;

  function canFetch() {
    if (typeof fetch !== 'function') return false;
    try { if (typeof location !== 'undefined' && location.protocol === 'file:') return false; } catch (e) { return false; }
    return true;
  }

  /** 有逾時的 fetch：逾時、網路錯誤一律回傳 null（不丟例外） */
  function request(path, init, timeoutMs, fetchFn) {
    var f = fetchFn || (typeof fetch === 'function' ? fetch : null);
    if (!f) return Promise.resolve(null);
    var ctrl = typeof AbortController === 'function' ? new AbortController() : null, timer = null;
    var opts = Object.assign({ mode: 'cors', credentials: 'omit', cache: 'no-store', redirect: 'error', referrerPolicy: 'no-referrer' }, init || {});
    if (ctrl) opts.signal = ctrl.signal;
    return new Promise(function (resolve) {
      var done = false, finish = function (v) { if (done) return; done = true; if (timer) clearTimeout(timer); resolve(v); };
      timer = setTimeout(function () { if (ctrl) { try { ctrl.abort(); } catch (e) { /* 忽略 */ } } finish(null); }, timeoutMs || TIMEOUT_MS);
      var p;
      try { p = f(URL + path, opts); } catch (e) { finish(null); return; }
      Promise.resolve(p).then(function (res) {
        if (!res || !res.ok) { finish(null); return; }
        return Promise.resolve(res.json()).then(function (j) { finish(j); }, function () { finish(null); });
      }, function () { finish(null); });
    });
  }

  /** 合理的人數：0 以上的整數（太大的數字當作壞資料） */
  function validCount(j) {
    var n = j && j.count;
    return typeof n === 'number' && isFinite(n) && n >= 0 && n < 1e9 && Math.floor(n) === n ? n : null;
  }

  /** 首頁的人數。回傳 Promise<number|null>（null＝不顯示） */
  function fetchCount(opts) {
    opts = opts || {};
    if (!opts.fetch && !canFetch()) return Promise.resolve(null);
    return request('/count', { method: 'GET' }, opts.timeoutMs, opts.fetch).then(validCount);
  }

  /**
   * 建立角色成功後呼叫：這台裝置還沒送過就送一次 +1。回傳 Promise<'sent'|'already'|'skipped'>
   * storage＝localStorage（測試給假的）；先記旗標再送，失敗也不重送。
   */
  function reportNew(storage, opts) {
    opts = opts || {};
    try { if (storage.getItem(FLAG_KEY)) return Promise.resolve('already'); } catch (e) { return Promise.resolve('skipped'); }
    if (!opts.fetch && !canFetch()) return Promise.resolve('skipped');
    try { storage.setItem(FLAG_KEY, '1'); } catch (e) { return Promise.resolve('skipped'); }   // 記不住旗標就不送（免得每次都 +1）
    return request('/new', { method: 'POST', keepalive: true }, opts.timeoutMs, opts.fetch).then(function () { return 'sent'; });
  }

  /** 這台裝置有沒有存檔：bq_save 或 bq_save:<欄位>（不含檢查用的 :__probe、升級前備份 bq_save_v2_backup） */
  function hasSave(storage) {
    var keys = [];
    try {
      if (typeof storage.length === 'number' && typeof storage.key === 'function') { for (var i = 0; i < storage.length; i++) keys.push(storage.key(i)); }
      else if (storage._m) keys = Object.keys(storage._m);
      if (!keys.length && storage.getItem('bq_save') !== null) keys.push('bq_save');
    } catch (e) { return false; }
    return keys.some(function (k) {
      if (k !== 'bq_save' && String(k).indexOf('bq_save:') !== 0) return false;
      if (/:__probe$/.test(k)) return false;
      try { return !!storage.getItem(k); } catch (e) { return false; }
    });
  }

  /**
   * 遊戲啟動時呼叫：有存檔、還沒送過 → 送一次（舊玩家也算進去）。回傳 Promise<'sent'|'already'|'nosave'|'skipped'>
   * 沒有存檔就不送（新玩家建角時才送，見 reportNew）。
   */
  function reportExisting(storage, opts) {
    try { if (storage.getItem(FLAG_KEY)) return Promise.resolve('already'); } catch (e) { return Promise.resolve('skipped'); }
    if (!hasSave(storage)) return Promise.resolve('nosave');
    return reportNew(storage, opts);
  }

  /** 首頁的文字 */
  function label(n) { return '已有 ' + n + ' 位冒險者加入'; }

  var Counter = { URL: URL, FLAG_KEY: FLAG_KEY, TIMEOUT_MS: TIMEOUT_MS, fetchCount: fetchCount, reportNew: reportNew, reportExisting: reportExisting, hasSave: hasSave, label: label, validCount: validCount };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.Counter = Counter; }
  if (typeof module !== 'undefined') module.exports = Counter;
})();
