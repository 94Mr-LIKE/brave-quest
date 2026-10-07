/*
 * 家長確認的「通行證」：通過一次後，設定開著的期間、以及關掉後 10 分鐘內，不再詢問。
 * 只存在記憶體（不寫進存檔，重新整理頁面就要再確認一次）。
 */
(function () {
  'use strict';
  var GRACE_MS = 10 * 60 * 1000;

  function create() { return { until: 0, panelOpen: false, asking: false }; }

  /** 現在需不需要再問？ */
  function needAsk(pass, now) { return !(pass.panelOpen || now < pass.until); }

  /** 確認通過：設定面板開著 */
  function grant(pass, now) { pass.until = now + GRACE_MS; pass.panelOpen = true; pass.asking = false; }

  /** 設定面板關掉：10 分鐘內再開不用問 */
  function closePanel(pass, now) { pass.panelOpen = false; pass.until = now + GRACE_MS; }

  /** 確認視窗已經開著時不要再開第二個 */
  function beginAsk(pass) { if (pass.asking) return false; pass.asking = true; return true; }
  function endAsk(pass) { pass.asking = false; }

  var ParentGate = { GRACE_MS: GRACE_MS, create: create, needAsk: needAsk, grant: grant, closePanel: closePanel, beginAsk: beginAsk, endAsk: endAsk };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.ParentGate = ParentGate; }
  if (typeof module !== 'undefined') module.exports = ParentGate;
})();
