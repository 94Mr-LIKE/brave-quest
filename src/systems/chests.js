/*
 * 寶箱：要答對一題（優先數學 number 題）才打得開。答錯可以一直重試（不扣任何東西）。
 * 打開後永久記錄在存檔（state.chests），地圖上換成打開的圖塊。
 */
(function () {
  'use strict';
  var isNode = typeof module !== 'undefined' && typeof require === 'function';
  var Character = isNode ? require('./character.js') : window.JQ.Character;
  var QuestLog = isNode ? require('./questlog.js') : window.JQ.QuestLog;

  function isOpened(state, chestId) { return !!state.chests[chestId]; }

  /** 出題設定：科目、難度、優先題型 */
  function questionSpec(chest) {
    return { subject: chest.subject || '數學', level: chest.level || 1, preferType: 'number' };
  }

  /** 答對後呼叫：發獎勵、記錄、推進 chest 委託。回傳 {ok, gold, item, quests} */
  function open(state, chest, quests, data) {
    if (isOpened(state, chest.id)) return { ok: false, reason: 'opened' };
    var rw = chest.reward || {};
    var gold = rw.gold || 0;
    state.player.coins += gold;
    var item = rw.item ? String(rw.item).replace(/^item_/, '') : null;
    if (item) Character.addItem(state, item, rw.n || 1);
    var done = QuestLog.onChestOpened(state, quests || {}, chest.id, data);
    return { ok: true, gold: gold, item: item, quests: done };
  }

  /** 題目情境跟寶箱有關（scene/stem 含「寶箱」或 id 含 CHEST）：留給寶箱用，戰鬥不出 */
  function isChestQuestion(q) {
    if (!q) return false;
    return /寶箱/.test(q.scene || '') || /寶箱/.test(q.stem || '') || /CHEST/i.test(q.id || '');
  }

  var Chests = { isOpened: isOpened, questionSpec: questionSpec, open: open, isChestQuestion: isChestQuestion };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.Chests = Chests; }
  if (typeof module !== 'undefined') module.exports = Chests;
})();
