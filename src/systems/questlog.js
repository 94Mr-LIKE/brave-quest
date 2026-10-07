/*
 * v0.2 委託鏈（07 第 6.4 節）：help（答題）/ hunt（收集掉落物）/ boss（擊敗頭目）/ chest（打開寶箱）
 * 狀態：locked（前置未完成）→ available → active → done
 */
(function () {
  'use strict';
  var isNode = typeof module !== 'undefined' && typeof require === 'function';
  var Character = isNode ? require('./character.js') : window.JQ.Character;
  var Exp = isNode ? require('./exp.js') : window.JQ.Exp;

  function rec(state, id) { return state.quests[id] || null; }

  function status(state, quests, id) {
    var r = rec(state, id);
    if (r) return r.status;
    var q = quests[id];
    if (!q) return 'locked';
    var ok = (q.requires || []).every(function (req) { var rr = rec(state, req); return rr && rr.status === 'done'; });
    var lightsOk = (q.requires_lights || []).every(function (l) { return state.lights && state.lights[l]; });
    return ok && lightsOk ? 'available' : 'locked';
  }

  function giverMatches(q, npcId) { return q.giver === npcId; }

  /** 這位 NPC 現在最該處理的委託：進行中 > 可接 > null（依資料順序） */
  function forNpc(state, quests, npcId, npcQuest) {
    var ids = Object.keys(quests).filter(function (id) { return giverMatches(quests[id], npcId); });
    if (npcQuest) {
      (Array.isArray(npcQuest) ? npcQuest : [npcQuest]).forEach(function (id) { if (quests[id] && ids.indexOf(id) < 0) ids.push(id); });
    }
    var active = ids.filter(function (id) { return status(state, quests, id) === 'active'; });
    if (active.length) return { id: active[0], status: 'active' };
    var avail = ids.filter(function (id) { return status(state, quests, id) === 'available'; });
    if (avail.length) return { id: avail[0], status: 'available' };
    return null;
  }

  function accept(state, quests, id) {
    if (status(state, quests, id) !== 'available') return false;
    state.quests[id] = { status: 'active', progress: 0 };
    return true;
  }

  function bossTarget(q) { return q.boss || q.target || q.monster || null; }
  function chestTarget(q) { return q.chest || q.target || null; }
  function huntInfo(q) { return q.hunt || null; }
  function helpCount(q) { return Math.max(1, q.count || 3); }

  /** help 委託第 n 題（0 起算）的科目：subject=混合 時依 subjects 輪流 */
  function helpSubject(q, n) {
    if (Array.isArray(q.subjects) && q.subjects.length) return q.subjects[(n || 0) % q.subjects.length];
    return q.subject;
  }

  /** NPC 的所有委託裡，第一個「還鎖著」的（顯示 dialog_locked 用） */
  function firstLocked(state, quests, ids) {
    for (var i = 0; i < ids.length; i++) if (quests[ids[i]] && status(state, quests, ids[i]) === 'locked') return ids[i];
    return null;
  }

  /** help 委託答對一題 */
  function recordHelp(state, quests, id) {
    var r = rec(state, id), q = quests[id];
    if (!r || r.status !== 'active' || !q) return { ready: false };
    r.progress = Math.min(helpCount(q), (r.progress || 0) + 1);
    return { ready: r.progress >= helpCount(q), progress: r.progress, count: helpCount(q) };
  }

  /** 目前進度 {have, need, text} */
  function progress(state, quests, id, data) {
    var q = quests[id], r = rec(state, id) || { progress: 0 };
    if (!q) return { have: 0, need: 1 };
    var kind = q.kind || 'help';
    if (kind === 'hunt') {
      var h = huntInfo(q) || { item: '', n: 1 };
      var item = String(h.item || '').replace(/^item_/, '');
      var have = Math.min(h.n, Character.count(state, item));
      var nm = data && data.items[item] ? data.items[item].name : item;
      return { have: have, need: h.n, text: '收集「' + nm + '」' + have + '/' + h.n };
    }
    if (kind === 'boss') {
      var b = bossTarget(q);
      var bn = data && data.monsters[b] ? data.monsters[b].name : b;
      var done = !!state.bosses[b];
      return { have: done ? 1 : 0, need: 1, text: '淨化頭目「' + bn + '」' + (done ? '（完成）' : '') };
    }
    if (kind === 'chest') {
      var c = chestTarget(q);
      var opened = !!state.chests[c];
      return { have: opened ? 1 : 0, need: 1, text: '打開寶箱' + (opened ? '（完成）' : '') };
    }
    var subj = Array.isArray(q.subjects) && q.subjects.length ? '五科輪流' : (q.subject || '');
    return { have: r.progress || 0, need: helpCount(q), text: '幫忙答對 ' + (r.progress || 0) + '/' + helpCount(q) + ' 題（' + subj + '）' };
  }

  function canComplete(state, quests, id, data) {
    if (status(state, quests, id) !== 'active') return false;
    var p = progress(state, quests, id, data);
    return p.have >= p.need;
  }

  /**
   * 完成委託並發獎勵。回傳 {ok, reward:{exp,gold,item,light}, levels}
   * hunt 會交出收集品；light 會點亮對應的燈（五道光）
   */
  function complete(state, quests, id, data) {
    if (!canComplete(state, quests, id, data)) return { ok: false };
    var q = quests[id];
    if ((q.kind || 'help') === 'hunt') {
      var h = huntInfo(q);
      Character.removeItem(state, String(h.item).replace(/^item_/, ''), h.n);
    }
    var rw = q.reward || {};
    var levels = 0;
    if (rw.exp > 0) levels = Exp.addExp(state.player, rw.exp);
    if (rw.gold > 0) state.player.coins += rw.gold;
    var item = rw.item ? String(rw.item).replace(/^item_/, '') : null;
    if (item) Character.addItem(state, item, rw.item_n || 1);
    if (rw.light) {
      state.lights[rw.light] = true;
      if (state.stickers.indexOf(rw.light) < 0) state.stickers.push(rw.light);
    }
    state.quests[id] = { status: 'done', progress: (rec(state, id) || {}).progress || 0 };
    if (state.story.indexOf(id) < 0) state.story.push(id);
    return { ok: true, reward: { exp: rw.exp || 0, gold: rw.gold || 0, item: item, light: rw.light || null }, levels: levels };
  }

  /** 頭目被淨化：自動完成相關 boss 委託。回傳完成結果陣列 */
  function onBossDefeated(state, quests, monsterId, data) {
    state.bosses[monsterId] = true;
    return autoComplete(state, quests, data, function (q) { return (q.kind === 'boss') && bossTarget(q) === monsterId; });
  }

  function onChestOpened(state, quests, chestId, data) {
    state.chests[chestId] = true;
    return autoComplete(state, quests, data, function (q) { return q.kind === 'chest' && chestTarget(q) === chestId; });
  }

  function autoComplete(state, quests, data, match) {
    var out = [];
    Object.keys(quests).forEach(function (id) {
      if (match(quests[id]) && status(state, quests, id) === 'active') {
        var r = complete(state, quests, id, data);
        if (r.ok) { r.id = id; out.push(r); }
      }
    });
    return out;
  }

  /** 手帳用：進行中與已完成 */
  function journal(state, quests, data) {
    var active = [], done = [];
    Object.keys(quests).forEach(function (id) {
      var s = status(state, quests, id);
      var q = quests[id];
      if (s === 'active') active.push({ id: id, title: q.title || id, map: q.map, kind: q.kind || 'help', goal: q.goal || '', next: q.log_next || '', objective: progress(state, quests, id, data).text, ready: canComplete(state, quests, id, data), side: /SIDE/.test(id) });
      else if (s === 'done') done.push({ id: id, title: q.title || id, map: q.map, next: q.log_next || '' });
    });
    return { active: active, done: done };
  }

  var QuestLog = { status: status, forNpc: forNpc, accept: accept, recordHelp: recordHelp, progress: progress, canComplete: canComplete, complete: complete, onBossDefeated: onBossDefeated, onChestOpened: onChestOpened, journal: journal, bossTarget: bossTarget, chestTarget: chestTarget, helpCount: helpCount, helpSubject: helpSubject, firstLocked: firstLocked };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.QuestLog = QuestLog; }
  if (typeof module !== 'undefined') module.exports = QuestLog;
})();
