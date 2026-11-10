/*
 * v4.2 第 4b 批：大結局的規則（純函式；node 可以 require）。畫面流程在 docs/src/fx/ending_flow.js。
 * 依據：v42_定案規劃.md 第三節 4b、第五節 N-END-1～11；大結局腳本 2.1（F0–F11 唯一版本）、2.2、5.3–5.7；裁定 K14；
 *   dialogs_v42_fill.js 的 ENDING_AWARDS、CERT_BOOK_RULE_4B（docs/data/ending_awards.js）。
 * 存檔欄位（4a 的 EastMigrate 已補預設）：
 *   flags.ending_done（F11 才設）、flags.ending_mv_seen（MV 播完才設）、lamps['曙光']（F8 第六盞燈亮）、
 *   certs[職業] = { d: 'YYYY-MM-DD', e: 1 }（e:1＝大結局那一張，給「重看結局」用）；titles 加「點亮曙光的人」（勇者另加「傳說中的勇者」）。
 *   金屬不存進存檔：一律由 ENDING_AWARDS.jobs[職業].metal 推出來（大結局腳本 5.3）。
 */
(function () {
  'use strict';
  var isNode = typeof module !== 'undefined' && typeof require === 'function';
  var QuestLog = isNode ? require('./questlog.js') : window.JQ.QuestLog;

  var DAWN = '曙光';                       // 第六盞燈的科目（lamps['曙光']；定案 #16）
  var TITLE_END = '點亮曙光的人';
  var END_Q1 = 'Q_END_1', END_Q2 = 'Q_END_2';
  /** F0–F11（大結局腳本 2.1）；勇者時 F7 換成 F7H（5.7 節：大結局版沒有 H0） */
  var STEPS = ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11'];

  // 高級職業還沒進 jobs.js（70 號 6.4 的建議 id）：證書名牌先用大結局腳本 5.4 表的職業名
  var ADV_NAMES = { god_hand: '神之手', thunder_sage: '天地雷鳴士', hero: '勇者' };
  function obj(x) { return !!x && typeof x === 'object' && !Array.isArray(x); }
  /** 證書資料：呼叫的人傳的 A ＞ Ending.awards（node 測試用）＞ window.ENDING_AWARDS（docs/data/ending_awards.js） */
  function awardsOf(A) { return A || Ending.awards || (typeof window !== 'undefined' && window.ENDING_AWARDS) || { jobs: {}, order: [], metal_name: {}, tier_name: {} }; }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  /** 領證日期（裝置時間）：'YYYY-MM-DD' */
  function dateKey(now) { var d = new Date(now); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  /** 證書上的日期文字：「2026 年 11 月 9 日」；從存檔碼還原的證書沒有日期 → 空字串（5.3 節） */
  function dateText(d) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(d || '')); return m ? m[1] + ' 年 ' + Number(m[2]) + ' 月 ' + Number(m[3]) + ' 日' : ''; }

  /**
   * 職業的證書與勳章資料（金屬只有這一個入口，5.3 節）。jobs＝G.data.jobs（拿職業名）。
   * 找不到資料的職業 → 銅、圖騰用木劍，console 警告，不擋頒獎（5.3 節例外）。
   */
  function jobInfo(job, jobs, A) {
    A = awardsOf(A);
    var j = (A.jobs || {})[job];
    if (!j) { if (typeof console !== 'undefined') console.warn('[證書] ENDING_AWARDS 沒有職業 ' + job + '，先用銅'); j = { tier: 'basic', metal: 'copper', praise: '', medal: ['item_wood_sword'] }; }
    var name = (jobs && jobs[job] && jobs[job].name) || ADV_NAMES[job] || job;
    var tierName = (A.tier_name || {})[j.tier] || '';
    var metalName = (A.metal_name || {})[j.metal] || j.metal;
    var fill = function (tpl, size) { return String(tpl || '').replace('{id}', job).replace('{metal}', j.metal).replace('{size}', size || ''); };
    return {
      id: job, name: name, tier: j.tier, tierName: tierName,
      nameplate: tierName ? tierName + '　' + name : name,          // 見習只寫「見習冒險者」（5.3 節）
      metal: j.metal, metalName: metalName, praise: j.praise || '', special: !!j.special,
      color: j.color || null,   // v4.2 第 4c 批：證書職業名牌的職業代表色（美術盤點 15-2；RGB 在 medals_B_proc.JOBS）

      title: j.title || null, titleId: j.title_id || null, body: j.body || A.body || [],
      certBg: j.cert_bg || A.cert_bg, medalName: j.medal_name || A.medal_name || '冒險者勳章',
      medalImg: j.medal_img || fill(A.medal_img), icon64: fill(A.medal_icon, 64), icon128: fill(A.medal_icon, 128),
      medalLine: (j.special && j.title ? j.title : name) + '・' + metalName,   // 勳章卡小字：「劍士・銅」／「傳說中的勇者・黃金」
      witnesses: j.witnesses || []
    };
  }

  /** 證書冊要顯示的職業（CERT_BOOK_RULE_4B：JOBS 裡沒有的職業先隱藏；順序＝ENDING_AWARDS.order） */
  function shownJobs(jobs, A) {
    A = awardsOf(A);
    var hide = (A.book_rule && A.book_rule.hide_if_no_job) || [];
    return (A.order || []).filter(function (id) { return hide.indexOf(id) < 0 || !!(jobs && jobs[id]); });
  }
  function hasCert(state, job) { return !!(state && obj(state.certs) && obj(state.certs[job])); }
  /** 證書冊：{ slots:[{ …jobInfo, got, date }], shown, got }；「已領 N／M」的 M＝顯示的格數 */
  function certBook(state, jobs, A) {
    var ids = shownJobs(jobs, A), slots = ids.map(function (id) {
      var info = jobInfo(id, jobs, A), c = hasCert(state, id) ? state.certs[id] : null;
      info.got = !!c; info.date = c ? c.d || '' : ''; info.ending = !!(c && c.e === 1);
      return info;
    });
    return { slots: slots, shown: slots.length, got: slots.filter(function (s) { return s.got; }).length };
  }

  /** 發證書：同職業只發一次（N-END-10）。ending＝大結局那一張（e:1）。回傳 true＝這次發了 */
  function awardCert(state, job, now, ending) {
    if (!obj(state.certs)) state.certs = {};
    if (hasCert(state, job)) return false;
    var c = { d: dateKey(now) };
    if (ending) c.e = 1;
    state.certs[job] = c;
    return true;
  }
  /** 大結局那一張證書的職業（重看結局用）；沒有就 null */
  function endingCertJob(state) {
    var c = (state && obj(state.certs)) ? state.certs : {};
    var k = Object.keys(c).filter(function (id) { return obj(c[id]) && c[id].e === 1; })[0];
    return k || null;
  }

  /** 中途關掉網頁：打贏佛格（Q_END_1 完成）但還沒 F11 → 下次開遊戲從 F1 接（大結局腳本 2.2；N-END-4） */
  function needsResume(state, quests) {
    if (!state || !quests || !quests[END_Q1]) return false;
    var r = state.quests && state.quests[END_Q1];
    return !!(r && r.status === 'done') && !(obj(state.flags) && state.flags.ending_done === true);
  }
  /** F0 結束（打贏佛格）：章末記成第九章、接下 Q_END_2（存檔由呼叫的人在這之後寫一次） */
  function afterFinalBoss(state, quests) {
    if (quests[END_Q1] && quests[END_Q1].chapter_end && !(state.chapter >= quests[END_Q1].chapter_end)) state.chapter = quests[END_Q1].chapter_end;
    if (quests[END_Q2] && QuestLog.status(state, quests, END_Q2) === 'available') QuestLog.accept(state, quests, END_Q2);
  }
  function addTitle(state, t) { if (!Array.isArray(state.titles)) state.titles = []; if (state.titles.indexOf(t) < 0) state.titles.push(t); }
  /** F8：第六盞燈亮 */
  function lightDawn(state) { if (!obj(state.lamps)) state.lamps = {}; state.lamps[DAWN] = true; }
  /**
   * F11：結局完成（N-END-1）。flags.ending_done、lamps['曙光']、稱號「點亮曙光的人」、Q_END_2 完成（經濟 0／0）。
   * 證書在 F7 發（awardCert），MV 看完的旗標在 F5 播完時設；這裡不動那兩個。
   */
  function finish(state, quests, data) {
    if (!obj(state.flags)) state.flags = {};
    lightDawn(state);
    addTitle(state, TITLE_END);
    if (quests[END_Q2]) {
      if (QuestLog.status(state, quests, END_Q2) === 'available') QuestLog.accept(state, quests, END_Q2);
      if (QuestLog.status(state, quests, END_Q2) === 'active') { QuestLog.recordHelp(state, quests, END_Q2); QuestLog.complete(state, quests, END_Q2, data); }
    }
    state.flags.ending_done = true;
    return true;
  }
  /** 勇者特別版的稱號（5.7 節；G5 老闆選 A） */
  function heroTitle(state, A) { var j = (awardsOf(A).jobs || {}).hero; if (j && j.title) addTitle(state, j.title); }

  /** 結局流程（第一次）：F1–F11，目前職業是勇者時 F7→F7H */
  function flowSteps(job) { return STEPS.map(function (s) { return s === 'F7' && job === 'hero' ? 'F7H' : s; }); }

  /**
   * 破關後和里長伯說話（大結局腳本 5.5 觸發條件，依序）：
   *   'cert'＝還沒領過的職業（勇者以外）→ 小頒獎；'hero'＝勇者還沒領 → 勇者特別版（破關後版，有 H0）；
   *   'idle_hint'＝這個職業已領、還沒領完 → D_END_CHIEF_IDLE＋D_END_CERT_HINT；'idle'＝全部領完 → 只有 D_END_CHIEF_IDLE；
   *   null＝還沒破關（照舊播 D_CHIEF_IDLE／委託）
   */
  function chiefBranch(state, jobs, A) {
    if (!(state && obj(state.flags) && state.flags.ending_done === true)) return null;
    var job = state.player && state.player.job;
    if (!hasCert(state, job)) return job === 'hero' ? 'hero' : 'cert';
    var book = certBook(state, jobs, A);
    return book.got < book.shown ? 'idle_hint' : 'idle';
  }

  /** 第六座燈座：結局後一直顯示；結局走進海風公園（F7 開始）時也顯示（opts.duringEnding） */
  function dawnLampShown(state, duringEnding) { return !!duringEnding || !!(state && obj(state.flags) && state.flags.ending_done === true); }
  /** 燈座顯示、還沒亮 → D_LAMP_DAWN_DARK（K12；N-DLG-3），亮了照舊 D_LAMP_LIT */
  function lampDialog(state, subject) {
    if (subject !== DAWN) return null;
    return state && state.lamps && state.lamps[DAWN] ? 'D_LAMP_LIT' : 'D_LAMP_DAWN_DARK';
  }

  var Ending = {
    DAWN: DAWN, TITLE_END: TITLE_END, STEPS: STEPS, END_Q1: END_Q1, END_Q2: END_Q2,
    dateKey: dateKey, dateText: dateText, jobInfo: jobInfo, shownJobs: shownJobs, hasCert: hasCert, certBook: certBook,
    awardCert: awardCert, endingCertJob: endingCertJob, needsResume: needsResume, afterFinalBoss: afterFinalBoss,
    lightDawn: lightDawn, finish: finish, heroTitle: heroTitle, flowSteps: flowSteps, chiefBranch: chiefBranch,
    dawnLampShown: dawnLampShown, lampDialog: lampDialog
  };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.EndingRules = Ending; }
  if (typeof module !== 'undefined') module.exports = Ending;
})();
