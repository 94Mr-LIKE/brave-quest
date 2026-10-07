/*
 * 答題流程（把 rewards / adaptive / guard / hints / quest / daily / report 串起來）
 * 與畫面無關，可在 node 底下測試。
 *
 * 兩種模式：
 *   mode 'quest'（預設，v0.1）：答對自動推進 v0.1 委託（Quest.recordCorrect）
 *   mode 'free' （v0.2）     ：戰鬥、寶箱、村民委託共用；由呼叫端決定答對後做什麼
 * 其他選項：
 *   expMult   經驗值 乘數（地圖等級係數）
 *   filter    function(q) → 是否可出（例：委託限定單元、level 範圍）
 *   noRepeat  true = 同一個 session 內同一題不出兩次（戰鬥：同一隻怪同一場戰鬥）
 */
(function () {
  'use strict';
  var isNode = typeof module !== 'undefined' && typeof require === 'function';
  var J = isNode ? {
    Answer: require('./answer.js'), Rewards: require('./rewards.js'), Adaptive: require('./adaptive.js'),
    Guard: require('./guard.js'), Hints: require('./hints.js'), Quest: require('./quest.js'),
    Daily: require('./daily.js'), Report: require('./report.js'), Exp: require('./exp.js')
  } : window.JQ;

  function create(state, questions, subject, opts) {
    opts = opts || {};
    var mode = opts.mode || 'quest';
    if (mode === 'quest') J.Quest.start(state, subject);
    return {
      state: state, questions: questions, subject: subject, rng: opts.rng || Math.random,
      mode: mode, expMult: opts.expMult || 1, filter: opts.filter || null, noRepeat: !!opts.noRepeat,
      deferExp: !!opts.deferExp, pendingExp: 0,   // v0.7 戰鬥：答對的經驗值先記在存檔 player.pendingExp，戰鬥結束才一起加（pendingExp＝這場累積多少，顯示用）
      asked: [], guard: J.Guard.create(), q: null, isVariant: false,
      wrongCount: 0, hintsOpened: 0, hintsUsed: false, erased: [], submitted: false, solved: false,
      shownAt: 0, finished: false
    };
  }

  function nearestLevel(pool, level) {
    var best = null, bestD = Infinity;
    pool.forEach(function (q) { var d = Math.abs(q.level - level) + (q.level > level ? 0.5 : 0); if (d < bestD) { bestD = d; best = q.level; } });
    return pool.filter(function (q) { return q.level === best; });
  }

  /**
   * 換下一題。o = { subject（覆寫科目）, forceLevel（指定難度，找不到就用最接近的）, preferType（優先題型） }
   * 回傳題目或 null（該科沒有題目）
   */
  function next(sess, now, o) {
    o = o || {};
    var st = sess.state, q = null, isVariant = false;
    var subject = o.subject || sess.subject;
    var pool = sess.questions.filter(function (x) { return x.subject === subject && (!sess.filter || sess.filter(x)); });
    if (!pool.length) pool = sess.questions.filter(function (x) { return x.subject === subject; });
    if (sess.noRepeat && sess.asked.length) {
      var fresh = pool.filter(function (x) { return sess.asked.indexOf(x.id) < 0; });
      if (fresh.length) pool = fresh;
    }
    if (o.preferType) {
      var typed = pool.filter(function (x) { return x.type === o.preferType; });
      if (typed.length) pool = typed;
    }
    if (o.forceLevel) pool = nearestLevel(pool, o.forceLevel);

    if (!st.qhist) st.qhist = {};
    var hist = st.qhist[subject] || [];
    var lastId = hist[hist.length - 1];
    var lastQ = lastId ? sess.questions.filter(function (x) { return x.id === lastId; })[0] : null;
    var pv = st.pendingVariant;
    if (pv && pv.subject === subject && !o.forceLevel) {
      // 變化題（ADR-005）刻意出「同概念」：同 variant_group 優先，其中挑最近沒出過的
      var picked = J.Rewards.pickVariant(pool, pv, { recent: hist, answered: st.answered, rng: sess.rng });
      if (picked) { q = picked.question; isVariant = true; } else { st.pendingVariant = null; }
    }
    if (!q) {
      q = J.Adaptive.pickQuestion(pool, subject, st.adaptive, {
        rng: sess.rng, answered: st.answered, exclude: sess.q ? [sess.q.id] : [],
        history: hist, avoidGroup: lastQ && lastQ.variant_group
      });
    }
    if (!q) return null;
    J.Adaptive.pushRecent(st.adaptive, q.id);
    J.Adaptive.pushHistory(st.qhist, subject, q.id);
    sess.asked.push(q.id);
    sess.q = q; sess.isVariant = isVariant;
    sess.wrongCount = 0; sess.hintsOpened = 0; sess.hintsUsed = false; sess.erased = []; sess.submitted = false; sess.solved = false;
    sess.shownAt = now || 0;
    return q;
  }

  /** 讓冷卻計時從現在開始（例如朗讀完或關掉回饋後） */
  function markShown(sess, now) { sess.shownAt = now; }

  /** 這題沒答對就放棄（戰鬥答錯/超時、關掉寶箱）：下一題改出同概念的變化題（ADR-005） */
  function abandon(sess) {
    if (!sess.q || sess.solved) return false;
    if (!sess.submitted) return false;
    sess.state.pendingVariant = J.Rewards.makePending(sess.q, 0);
    return true;
  }

  function submit(sess, response, now) {
    var st = sess.state, q = sess.q;
    if (!q) return { status: 'none' };
    if (J.Guard.isLocked(sess.guard, now)) return { status: 'locked', remainingMs: J.Guard.remainingMs(sess.guard, now) };
    var correct = J.Answer.checkAnswer(q, response);
    J.Report.recordSubmission(st, q);
    var g = J.Guard.onAnswer(sess.guard, correct, now - sess.shownAt, now);
    var adaptiveChange = 0;
    if (!sess.submitted) {
      sess.submitted = true;
      var res = correct ? (sess.hintsUsed ? 'neutral' : 'correct') : 'wrong';
      adaptiveChange = J.Adaptive.recordResult(st.adaptive, q, res).change;
    }
    if (!correct) {
      sess.wrongCount += 1;
      sess.shownAt = now;
      return { status: 'wrong', locked: g.locked, lockMs: g.lockMs, adaptiveChange: adaptiveChange };
    }
    sess.solved = true;

    var scaled = sess.expMult === 1 ? q : Object.assign({}, q, { exp: Math.round((q.exp || 0) * sess.expMult) });
    var reward = J.Rewards.computeReward({
      question: scaled, wrongCount: sess.wrongCount, hintsUsed: sess.hintsUsed,
      alreadyCorrect: !!st.answered[q.id], pendingVariant: sess.isVariant ? st.pendingVariant : null
    });
    if (sess.isVariant) st.pendingVariant = null;
    if (reward.needVariant) st.pendingVariant = J.Rewards.makePending(q, reward.variantBonus);
    var levels = 0;
    if (sess.deferExp) {
      // 記在存檔裡（不是只在記憶體）：戰鬥中重新整理，下次讀檔時一樣會結算，不會不見
      st.player.pendingExp = (st.player.pendingExp || 0) + reward.exp;
      sess.pendingExp += reward.exp;
    }
    else levels = J.Exp.addExp(st.player, reward.exp);
    st.player.coins += reward.coins;
    st.answered[q.id] = true;
    J.Report.recordDone(st, q, reward.firstTry);

    var dailyDone = [];
    dailyDone = dailyDone.concat(J.Daily.record(st.daily, 'correct'));
    dailyDone = dailyDone.concat(J.Daily.record(st.daily, 'subject', q.subject));
    if (reward.firstTry) dailyDone = dailyDone.concat(J.Daily.record(st.daily, 'firsttry'));
    var quest = { questDone: false, lampLit: false, allLit: false };
    if (sess.mode === 'quest') {
      quest = J.Quest.recordCorrect(st);
      if (quest.questDone) { dailyDone = dailyDone.concat(J.Daily.record(st.daily, 'quest')); sess.finished = true; }
    }
    dailyDone.forEach(function (t) { st.player.coins += t.reward; });

    return {
      status: 'correct', reward: reward, levelsGained: levels, dailyDone: dailyDone, quest: quest,
      adaptiveChange: adaptiveChange, needVariant: reward.needVariant, explanation: q.explanation || ''
    };
  }

  /**
   * 打開下一層提示。method 只在第 3、4 層需要：'card' | 'coins'
   * 回傳 {ok, step, text} 或 {ok:false, reason}
   */
  function openHint(sess, method) {
    var step = J.Hints.nextStep(sess.hintsOpened);
    if (!step) return { ok: false, reason: 'no-more' };
    if (step.paid) {
      var paid = J.Hints.pay(sess.state, method || 'card');
      if (!paid.ok) return { ok: false, reason: paid.reason, step: step };
    }
    sess.hintsOpened += 1;
    sess.hintsUsed = true;
    return { ok: true, step: step, text: J.Hints.stepText(sess.q, step) };
  }

  /** 刪去卡 */
  function useEraser(sess) {
    var st = sess.state;
    if (!sess.q || sess.q.type !== 'choice') return { ok: false, reason: 'type' };
    if ((st.inventory.eraser || 0) < 1) return { ok: false, reason: 'no-card' };
    var idx = J.Hints.pickEraseOption(sess.q, sess.erased, sess.rng);
    if (idx < 0) return { ok: false, reason: 'no-more' };
    st.inventory.eraser -= 1;
    sess.erased.push(idx);
    sess.hintsUsed = true;
    return { ok: true, index: idx };
  }

  /** 戰鬥結束：把戰鬥中答對累積的經驗值加到主角身上，回傳升了幾級 */
  function settleExp(sess) {
    if (!sess) return 0;
    sess.pendingExp = 0;
    return settlePlayerExp(sess.state);
  }

  /** 存檔裡還沒結算的戰鬥經驗值（player.pendingExp）加到主角身上並歸零，回傳升了幾級。讀檔時也會呼叫 */
  function settlePlayerExp(state) {
    var p = state && state.player;
    var exp = p ? Number(p.pendingExp) || 0 : 0;
    if (p) p.pendingExp = 0;
    return exp > 0 ? J.Exp.addExp(p, exp) : 0;
  }

  var Session = { settleExp: settleExp, settlePlayerExp: settlePlayerExp, create: create, next: next, markShown: markShown, abandon: abandon, submit: submit, openHint: openHint, useEraser: useEraser };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.Session = Session; }
  if (typeof module !== 'undefined') module.exports = Session;
})();
