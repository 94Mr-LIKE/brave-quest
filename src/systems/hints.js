/*
 * 提示階梯
 *  ① hints[0]（免費）
 *  ② 課本哪裡找：顯示 source_ref（免費，不顯示頁碼）
 *  ③ hints[1]（1 張引導卡 或 15 金幣）
 *  ④ hints[2]（1 張引導卡 或 15 金幣）
 * 刪去卡（只限 choice）：刪掉一個錯誤選項，至少保留正解＋1 個錯誤選項
 */
(function () {
  'use strict';
  var HINT_COIN_COST = 15;
  var STEPS = [
    { step: 1, kind: 'hint', index: 0, paid: false, label: '小提示' },
    { step: 2, kind: 'source', paid: false, label: '課本哪裡找' },
    { step: 3, kind: 'hint', index: 1, paid: true, label: '引導問題' },
    { step: 4, kind: 'hint', index: 2, paid: true, label: '更多引導' }
  ];

  /** opened = 已開到第幾層（0~4）。回傳下一層資訊或 null */
  function nextStep(opened) { return STEPS[opened] || null; }

  function sourceText(q) {
    return q.source_ref ? ('翻開 ' + q.source_ref + ' 找找看') : '這題沒有標課本位置，請再讀一次題目喔。';
  }

  function stepText(q, step) {
    if (step.kind === 'source') return sourceText(q);
    return (q.hints && q.hints[step.index]) || '再讀一次題目，圈出重要的字。';
  }

  /**
   * 付費（第 3、4 層）。method: 'card' | 'coins'。
   * state 需有 inventory.guide（引導卡 guide）與 player.coins。回傳 {ok, reason}
   */
  function pay(state, method) {
    if (method === 'card') {
      if ((state.inventory.guide || 0) < 1) return { ok: false, reason: 'no-card' };
      state.inventory.guide -= 1;
      var st = state; if (st.startItems && (st.startItems['guide'] || 0) > (st.inventory['guide'] || 0)) { if (st.inventory['guide'] > 0) st.startItems['guide'] = st.inventory['guide']; else delete st.startItems['guide']; }   // v0.9.2 先用掉一開始給的
      return { ok: true, method: 'card' };
    }
    if (state.player.coins < HINT_COIN_COST) return { ok: false, reason: 'no-coins' };
    state.player.coins -= HINT_COIN_COST;
    return { ok: true, method: 'coins' };
  }

  /** 刪去卡：回傳要刪的選項索引，或 -1（不能再刪） */
  function pickEraseOption(q, removed, rng) {
    if (q.type !== 'choice') return -1;
    rng = rng || Math.random;
    removed = removed || [];
    var wrong = [];
    for (var i = 0; i < q.options.length; i++) {
      if (i !== q.answer && removed.indexOf(i) < 0) wrong.push(i);
    }
    if (wrong.length <= 1) return -1; // 至少留 1 個錯誤選項
    return wrong[Math.floor(rng() * wrong.length)];
  }

  var Hints = { HINT_COIN_COST: HINT_COIN_COST, STEPS: STEPS, nextStep: nextStep, sourceText: sourceText, stepText: stepText, pay: pay, pickEraseOption: pickEraseOption };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.Hints = Hints; }
  if (typeof module !== 'undefined') module.exports = Hints;
})();
