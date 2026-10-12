/*
 * v1.0 第一批（48 號 v2 第 4 節、F7）：立志小考 — 出題、計時、及格、隔天重考、中途離開
 *
 * 規則（老闆 10/12 確認 E6-A，CTO 裁定 Q4–Q7）：
 * - 20 題：國英數自社各 4 題，每科 1 星 2 題＋2 星 2 題；第一批只出三上。
 * - 每科依序挑：沒出過 → 做錯過 → 做對過；同一場不重複 variant_group；重考時和上次重複的每科最多 1 題。
 * - 時間：標準時間 × 75%（1 星 22.5 秒、2 星 30 秒）；不受家長的「答題時間」設定影響。語音讀題、英語朗讀時不計時（畫面負責）。
 * - 答對 16 題以上及格；沒通過要隔天（台灣時間跨日，Daily.dateKey）才能再考，整場重考。
 * - 開始時先存 inProgress；中途關掉＝考過一次、沒通過（讀檔時 recover）。
 * - 今天剩不到 15 分鐘不能開始；考試中不會被每日上限打斷（畫面負責）。
 * - 獎勵：稱號「立志的＋職業名」＋護身符「職業名＋的護身符」（珍貴道具，不能賣），不加能力、不給經驗值和金幣；記進家長報表。
 * - 不能用提示、刪去卡、引導卡（畫面負責）。小考答對的題目不算進「答對過」。
 *
 * 存檔：state.trial = { 職業id: { lastFailDate, tries, lastQ:[題目id], inProgress, passedAt } }；家長報表：state.trialLog（最多 30 筆）
 */
(function () {
  'use strict';
  var isNode = typeof module !== 'undefined' && typeof require === 'function';
  var Daily = isNode ? require('./daily.js') : window.JQ.Daily;
  var Playtime = isNode ? require('./playtime.js') : window.JQ.Playtime;
  var SUBJECTS = ['國語', '英語', '數學', '自然', '社會'];
  var TIME_SEC = { 1: 30, 2: 40, 3: 60, 4: 90 };
  var DEFAULT = { pass: 16, per_subject: { 1: 2, 2: 2 }, time_ratio: 0.75, term: '三上', min_minutes_left: 15, cheer_every: 5 };
  var LOG_MAX = 30;

  function rules(data) { return Object.assign({}, DEFAULT, (data && data.jobRules && data.jobRules.trial) || {}); }
  function total(R) { var n = 0; Object.keys(R.per_subject).forEach(function (k) { n += Number(R.per_subject[k]) || 0; }); return n * SUBJECTS.length; }
  function rec(state, jobId) { state.trial = state.trial || {}; return state.trial[jobId] || null; }
  function ensure(state, jobId) { state.trial = state.trial || {}; return (state.trial[jobId] = state.trial[jobId] || { lastFailDate: '', tries: 0, lastQ: [], inProgress: null, passedAt: 0 }); }

  /** 每題的時間（毫秒）：標準時間 × 75%，和家長設定無關 */
  function timeLimitMs(level, data) { return Math.round((TIME_SEC[level] || 30) * 1000 * rules(data).time_ratio); }

  /** 見習的等級（目前是見習就看 player.level） */
  function noviceLevel(state) {
    var p = state.player;
    if (p.job === 'novice') return p.level;
    return (p.jobs && p.jobs.novice && p.jobs.novice.lv) || 0;
  }

  /**
   * 能不能開始考。回傳 { ok, reason, need, minutes }：
   *   reason：closed（還沒開放）、held（以前當過，免考）、passed（已經通過了）、level（見習還沒到出師等級）、
   *           today（今天已經考過沒通過，明天再來）、time（今天剩不到 15 分鐘）
   */
  function canStart(state, jobId, data, now) {
    var R = rules(data), JR = (data && data.jobRules) || {};
    if (!data || !data.jobs || !data.jobs[jobId] || jobId === 'novice') return { ok: false, reason: 'unknown' };
    if (Array.isArray(JR.open_jobs) && JR.open_jobs.indexOf(jobId) < 0) return { ok: false, reason: 'closed' };
    if (state.player.jobs && state.player.jobs[jobId]) return { ok: false, reason: 'held' };
    var r = rec(state, jobId);
    if (r && r.passedAt) return { ok: false, reason: 'passed' };
    var need = (JR.master_level && JR.master_level.novice) || JR.unlock_level || 10;
    if (noviceLevel(state) < need) return { ok: false, reason: 'level', need: need };
    if (r && r.lastFailDate && r.lastFailDate === Daily.dateKey(now)) return { ok: false, reason: 'today' };
    var left = state.playtime ? Playtime.remainingMin(state.playtime, state.settings, now) : Infinity;
    if (left < R.min_minutes_left) return { ok: false, reason: 'time', minutes: left };
    return { ok: true };
  }

  function shuffle(a, rng) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rng() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  /**
   * 出題：回傳 20 題（依科目、星等排好；科目內 1 星在前）。
   * opts = { rng, lastQ:[上次的題目 id], exclude(q)（例如寶箱題）, answered, qhist }
   * 排序：0＝沒出過、1＝做錯過（出過但沒答對過）、2＝做對過；同一場不重複 variant_group；和上次重複的每科最多 1 題。
   * 題目不夠時才放寬 variant_group（不放寬「只出三上」）。
   */
  function pick(state, questions, data, opts) {
    opts = opts || {};
    var R = rules(data), rng = opts.rng || Math.random;
    var answered = opts.answered || state.answered || {}, qhist = opts.qhist || state.qhist || {};
    var last = {}; (opts.lastQ || []).forEach(function (id) { last[id] = 1; });
    var seenVG = {}, out = [];
    var levels = Object.keys(R.per_subject).map(Number).sort();
    SUBJECTS.forEach(function (s) {
      var asked = {}; (qhist[s] || []).forEach(function (id) { asked[id] = 1; });
      var repeats = 0;
      levels.forEach(function (lv) {
        var want = Number(R.per_subject[lv]) || 0;
        var cands = (questions || []).filter(function (q) {
          return q && q.subject === s && Number(q.level) === lv && (!R.term || q.term === R.term) && !(opts.exclude && opts.exclude(q));
        });
        shuffle(cands, rng);
        var rank = function (q) { return answered[q.id] ? 2 : (asked[q.id] ? 1 : 0); };
        cands.sort(function (a, b) { return rank(a) - rank(b); });   // Array.sort 在 V8 是穩定排序：同等級內維持亂數順序
        var got = [];
        var take = function (relaxVG) {
          for (var i = 0; i < cands.length && got.length < want; i++) {
            var q = cands[i];
            if (got.indexOf(q) >= 0 || out.indexOf(q) >= 0) continue;
            if (last[q.id] && repeats >= 1) continue;
            if (!relaxVG && q.variant_group && seenVG[q.variant_group]) continue;
            got.push(q);
            if (last[q.id]) repeats++;
            if (q.variant_group) seenVG[q.variant_group] = 1;
          }
        };
        take(false);
        if (got.length < want) take(true);
        out = out.concat(got);
      });
    });
    return out;
  }

  /** 開始考：先記成「考試中」（中途關掉就算考過一次） */
  function begin(state, jobId, ids, now) {
    var r = ensure(state, jobId);
    r.tries = (r.tries || 0) + 1;
    r.lastQ = (ids || []).slice();
    r.inProgress = { at: now || 0, date: Daily.dateKey(now || 0) };
    return r;
  }

  function addLog(state, entry) {
    state.trialLog = state.trialLog || [];
    state.trialLog.push(entry);
    if (state.trialLog.length > LOG_MAX) state.trialLog.splice(0, state.trialLog.length - LOG_MAX);
  }

  /** 稱號、護身符的名稱（CTO Q6） */
  function titleName(jobName) { return '立志的' + jobName; }
  function amuletId(jobId) { return 'amulet_' + jobId; }

  /**
   * 考完。answers = [{ id, subject, unit, correct }]。回傳 { pass, correct, total, wrongUnits:[單元], title, amulet }
   * 通過：passedAt、稱號、護身符（珍貴道具）；沒通過：lastFailDate＝今天。都記進家長報表（state.trialLog）。
   */
  function finish(state, jobId, answers, now, data) {
    var R = rules(data), r = ensure(state, jobId);
    var correct = (answers || []).filter(function (a) { return a && a.correct; }).length;
    var pass = correct >= R.pass;
    var units = [];
    (answers || []).forEach(function (a) { if (a && !a.correct) { var u = (a.subject ? a.subject + '：' : '') + (a.unit || '（沒有單元名稱）'); if (units.indexOf(u) < 0) units.push(u); } });
    r.inProgress = null;
    var job = (data && data.jobs && data.jobs[jobId]) || { name: jobId };
    var out = { pass: pass, correct: correct, total: (answers || []).length, need: R.pass, wrongUnits: units, title: null, amulet: null };
    if (pass) {
      r.passedAt = now || 1;
      out.title = titleName(job.name);
      state.titles = state.titles || [];
      if (state.titles.indexOf(out.title) < 0) state.titles.push(out.title);
      out.amulet = amuletId(jobId);
      state.inventory = state.inventory || {};
      state.inventory[out.amulet] = Math.max(1, state.inventory[out.amulet] || 0);
    } else r.lastFailDate = Daily.dateKey(now || 0);
    addLog(state, { job: jobId, date: Daily.dateKey(now || 0), correct: correct, total: out.total, pass: pass, quit: false });
    return out;
  }

  /** 讀檔時：上次考到一半離開（inProgress 還在）→ 算考過一次、沒通過（那一天不能再考）。回傳被記成失敗的職業 id */
  function recover(state) {
    var out = [];
    Object.keys(state.trial || {}).forEach(function (id) {
      var r = state.trial[id];
      if (!r || !r.inProgress) return;
      r.lastFailDate = r.inProgress.date || r.lastFailDate || '';
      r.inProgress = null;
      addLog(state, { job: id, date: r.lastFailDate, correct: null, total: null, pass: false, quit: true });
      out.push(id);
    });
    return out;
  }

  /** 第幾題答完要番薯仔打氣（第 5、10、15 題後） */
  function cheerAfter(n, data) { var k = rules(data).cheer_every; return n > 0 && n % k === 0 && n < total(rules(data)); }
  /** 這一科考完了沒（每科 4 題，考完一科亮一盞小燈） */
  function subjectDone(n, data) { var per = total(rules(data)) / SUBJECTS.length; return n > 0 && n % per === 0; }

  var JobTrial = { SUBJECTS: SUBJECTS, DEFAULT: DEFAULT, rules: rules, total: total, timeLimitMs: timeLimitMs, noviceLevel: noviceLevel, canStart: canStart,
    pick: pick, begin: begin, finish: finish, recover: recover, titleName: titleName, amuletId: amuletId, cheerAfter: cheerAfter, subjectDone: subjectDone };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.JobTrial = JobTrial; }
  if (typeof module !== 'undefined') module.exports = JobTrial;
})();
