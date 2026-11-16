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

  /*
   * v4.2.5 AC（老闆 2026-11-16）：轉職人數。後端 GET /count 多回 "tiers": {"1": a, "2": b, "3": c}；POST /tier/1|2|3 各 +1。
   * - 每台裝置每一轉只送一次（旗標 bq_tier1～3，和 bq_counted 完全分開）；比照 reportNew：先記旗標再送、失敗不重送、不擋遊戲、不印主控台。
   * - 首頁只顯示 TIER_SHOWN 裡的轉數；之後要顯示 3 轉，只改 TIER_SHOWN。
   * 上面的 bq_counted、/new、reportNew、reportExisting、label() 是老闆的決定 1，一行都不改（tests/v425_tiers_tree.test.js「人數 T9」釘住）。
   */
  var TIER_RANK = { basic: 1, inter: 2, adv: 3 };
  var TIER_SHOWN = [1, 2];
  var TIER_MAX = 3;
  var TIER_NAMES = { 1: '一轉', 2: '二轉', 3: '三轉' };

  function tierFlag(rank) { return 'bq_tier' + rank; }

  /** 職業的轉數：jobs.js 的 tier → 1／2／3；見習、查不到 → 0 */
  function tierOf(jobs, jobId) {
    var j = jobs && Object.prototype.hasOwnProperty.call(jobs, jobId) ? jobs[jobId] : null;
    return j && Object.prototype.hasOwnProperty.call(TIER_RANK, j.tier) ? TIER_RANK[j.tier] : 0;
  }

  /** 這一轉還沒送過就送一次 +1。回傳 Promise<'sent'|'already'|'skipped'>（做法同 reportNew，旗標不同） */
  function reportTier(storage, rank, opts) {
    opts = opts || {};
    if (typeof rank !== 'number' || rank < 1 || rank > TIER_MAX || Math.floor(rank) !== rank) return Promise.resolve('skipped');
    var key = tierFlag(rank);
    try { if (storage.getItem(key)) return Promise.resolve('already'); } catch (e) { return Promise.resolve('skipped'); }
    if (!opts.fetch && !canFetch()) return Promise.resolve('skipped');
    try { storage.setItem(key, '1'); } catch (e) { return Promise.resolve('skipped'); }   // 記不住旗標就不送（免得每次都 +1）
    return request('/tier/' + rank, { method: 'POST', keepalive: true }, opts.timeoutMs, opts.fetch).then(function () { return 'sent'; });
  }

  /** 1..r 之中還沒送過的都送。回傳 Promise<{1:'sent'|'already'|'skipped', …}>（r＝0 → {}） */
  function reportUpTo(storage, r, opts) {
    var ranks = [];
    for (var i = 1; i <= Math.min(r, TIER_MAX); i++) ranks.push(i);
    return Promise.all(ranks.map(function (k) { return reportTier(storage, k, opts); })).then(function (res) {
      var out = {};
      ranks.forEach(function (k, i) { out[k] = res[i]; });
      return out;
    });
  }

  /** 轉職成功（Character.changeJob 回 ok）之後呼叫：新職業的轉數＝r → 1..r 沒送過的都送（3 轉也照常送，首頁不顯示） */
  function reportJobChange(storage, jobId, jobs, opts) {
    return reportUpTo(storage, tierOf(jobs, jobId), opts);
  }

  /** 存檔字串 → 存檔物件。預設用專案的 Save.validateState＋Save.migrate（和讀檔同一套升級，升級後 player.jobs 一定有目前職業）；不合格回 null */
  function parseSave(raw) {
    var Save = null;
    try { Save = typeof window !== 'undefined' && window.JQ && window.JQ.Save ? window.JQ.Save : (typeof require === 'function' ? require('./save.js') : null); } catch (e) { Save = null; }
    var obj = JSON.parse(raw);
    if (!Save) return obj;
    if (Save.validateState(obj)) return null;
    return Save.migrate(obj);
  }

  /**
   * 一份存檔裡最高的轉數：player.jobs 中 lv > 0 的職業（目前職業不在 jobs 裡也算）；沒有 player.jobs → 0
   * 第二輪審查 L1：實際上線走的預設解析（parseSave）會先經過 Save.migrate，裡面的 repairJobs 會把 lv: 0 補成 1，
   * 所以「lv > 0」只在不經過 migrate 的路徑（測試傳 opts.parse＝JSON.parse）才會擋掉東西。遊戲本身不會寫出 lv 0 的紀錄
   * （changeJob 換到新職業一律從 Lv1 開始），實際影響很小；這裡保留條件只當作防呆。
   */
  function saveTier(s, jobs) {
    var p = s && typeof s === 'object' ? s.player : null;
    if (!p || typeof p !== 'object' || !p.jobs || typeof p.jobs !== 'object' || Array.isArray(p.jobs)) return 0;
    var best = 0;
    Object.keys(p.jobs).forEach(function (id) {
      var r = p.jobs[id];
      if (r && typeof r.lv === 'number' && r.lv > 0) best = Math.max(best, tierOf(jobs, id));
    });
    if (typeof p.job === 'string' && typeof p.level === 'number' && p.level > 0) best = Math.max(best, tierOf(jobs, p.job));
    return best;
  }

  /** 這台裝置所有存檔（bq_save、bq_save:<欄位>；不含 :__probe、bq_save_v2_backup 等備份）裡最高的轉數；讀不到、壞檔都略過 */
  function maxSavedTier(storage, jobs, parse) {
    var keys = [], best = 0;
    try {
      if (typeof storage.length === 'number' && typeof storage.key === 'function') { for (var i = 0; i < storage.length; i++) keys.push(storage.key(i)); }
      else if (storage._m) keys = Object.keys(storage._m);
      if (!keys.length && storage.getItem('bq_save') !== null) keys.push('bq_save');
    } catch (e) { return 0; }
    keys.forEach(function (k) {
      k = String(k);
      if (k !== 'bq_save' && k.indexOf('bq_save:') !== 0) return;
      if (/:__probe$/.test(k)) return;
      try {
        var raw = storage.getItem(k);
        if (!raw) return;
        best = Math.max(best, saveTier((parse || parseSave)(raw), jobs));
      } catch (e) { /* 壞檔略過 */ }
    });
    return best;
  }

  /** 遊戲啟動時（reportExisting 之後）呼叫：舊玩家補報。存檔裡最高轉數＝r → 1..r 沒送過的補送。opts.parse＝測試換解析函式 */
  function reportSavedTiers(storage, jobs, opts) {
    opts = opts || {};
    var r = 0;
    try { r = storage ? maxSavedTier(storage, jobs, opts.parse) : 0; } catch (e) { r = 0; }
    return reportUpTo(storage, r, opts);
  }

  /** 合理的轉職人數：tiers 是物件，1～3 都是 0 以上的整數 → {1:a, 2:b, 3:c}；否則 null（後端還沒更新、格式不對） */
  function validTiers(j) {
    var t = j && j.tiers;
    if (!t || typeof t !== 'object' || Array.isArray(t)) return null;
    var out = {};
    for (var k = 1; k <= TIER_MAX; k++) {
      var n = validCount({ count: t[k] });
      if (n === null) return null;
      out[k] = n;
    }
    return out;
  }

  /** 首頁的人數＋轉職人數（同一次 GET /count）。回傳 Promise<{count: number|null, tiers: {1,2,3}|null}> */
  function fetchStats(opts) {
    opts = opts || {};
    if (!opts.fetch && !canFetch()) return Promise.resolve({ count: null, tiers: null });
    return request('/count', { method: 'GET' }, opts.timeoutMs, opts.fetch).then(function (j) {
      var n = validCount(j);
      return { count: n, tiers: n === null ? null : validTiers(j) };   // 第二輪 S3：總人數讀不到就不給 tiers（首頁不會只剩膠囊）
    });
  }

  /** 首頁膠囊的每一段：只放 TIER_SHOWN 裡的轉數，例如 ['一轉 45 位', '二轉 12 位']；缺數字 → null（整條隱藏）。數字格式同 label() */
  function tierParts(tiers) {
    if (!tiers || typeof tiers !== 'object' || Array.isArray(tiers)) return null;
    var out = [];
    for (var i = 0; i < TIER_SHOWN.length; i++) {
      var k = TIER_SHOWN[i], n = validCount({ count: tiers[k] });
      if (n === null || !TIER_NAMES[k]) return null;
      out.push(TIER_NAMES[k] + ' ' + n + ' 位');
    }
    return out.length ? out : null;
  }
  function tierLabel(tiers) { var p = tierParts(tiers); return p ? p.join(' · ') : null; }

  var Counter = { URL: URL, FLAG_KEY: FLAG_KEY, TIMEOUT_MS: TIMEOUT_MS, fetchCount: fetchCount, reportNew: reportNew, reportExisting: reportExisting, hasSave: hasSave, label: label, validCount: validCount };
  Counter.TIER_RANK = TIER_RANK; Counter.TIER_SHOWN = TIER_SHOWN; Counter.tierFlag = tierFlag; Counter.tierOf = tierOf;
  Counter.reportTier = reportTier; Counter.reportJobChange = reportJobChange; Counter.reportSavedTiers = reportSavedTiers; Counter.maxSavedTier = maxSavedTier;
  Counter.fetchStats = fetchStats; Counter.validTiers = validTiers; Counter.tierParts = tierParts; Counter.tierLabel = tierLabel;
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.Counter = Counter; }
  if (typeof module !== 'undefined') module.exports = Counter;
})();
