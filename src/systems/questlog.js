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

  /**
   * v4.2.10 T1b（老闆「不能有任何地方被前置任務限制」；技術長裁定）：測試模式「接委託不看前置」。
   * free＝呼叫的人確認測試模式開著、而且是玩家主動去接（和 NPC 說話、碰事件點）才傳 true：前置委託／requires_lights／requires_visit／legacy_requires 都當成達成。
   * 不放行：auto_accept（走進地圖自動接，避免走路就改存檔）、retired（Q_LAMPS 退役，五燈亮自動完成）、TM_KEEP_LOCKED（亂序會卡死或壞檔的個案）。
   * 已經有紀錄（進行中、完成）的照紀錄；沒傳 free（其他所有地方）＝和 v4.2.9 一樣。
   */
  var TM_KEEP_LOCKED = {};
  function freeOk(quests, id) { var q = quests[id]; return !!q && !q.retired && !q.auto_accept && !TM_KEEP_LOCKED[id]; }

  function status(state, quests, id, free) {
    var r = rec(state, id);
    if (r) return r.status;
    var q = quests[id];
    if (!q) return 'locked';
    // v3.0（70 號 5.2）舊南部旗標（legacySouth）時用 legacy_requires（舊前置：精靈鏈、獸人鏈照舊可接）；requires_visit＝到過那張地圖才能接（南部舊支線）
    var reqs = state.legacySouth === true && Array.isArray(q.legacy_requires) ? q.legacy_requires : (q.requires || []);
    var ok = reqs.every(function (req) { var rr = rec(state, req); return rr && rr.status === 'done'; });
    var lightsOk = (q.requires_lights || []).every(function (l) { return state.lights && state.lights[l]; });
    var visitOk = !q.requires_visit || !!(state.visited && state.visited[q.requires_visit]);
    if (free === true && !(ok && lightsOk && visitOk) && freeOk(quests, id)) return 'available';   // v4.2.10 T1b 測試模式
    return ok && lightsOk && visitOk ? 'available' : 'locked';
  }

  function giverMatches(q, npcId) { return q.giver === npcId; }

  /** 這位 NPC 現在最該處理的委託：進行中 > 可接 > null（依資料順序） */
  // v4.2.10 T1b free（測試模式）：事件委託（kind:event）不從 NPC 接，只在它自己的事件點放行
  function forNpc(state, quests, npcId, npcQuest, free) {
    var ids = Object.keys(quests).filter(function (id) { return giverMatches(quests[id], npcId); });
    if (npcQuest) {
      (Array.isArray(npcQuest) ? npcQuest : [npcQuest]).forEach(function (id) { if (quests[id] && ids.indexOf(id) < 0) ids.push(id); });
    }
    var active = ids.filter(function (id) { return status(state, quests, id) === 'active'; });
    if (active.length) return { id: active[0], status: 'active' };
    var avail = ids.filter(function (id) { return status(state, quests, id, free === true && quests[id].kind !== 'event') === 'available'; });
    if (avail.length) return { id: avail[0], status: 'available' };
    return null;
  }

  function accept(state, quests, id, free) {
    if (status(state, quests, id, free) !== 'available') return false;
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
  function firstLocked(state, quests, ids, free) {
    for (var i = 0; i < ids.length; i++) if (quests[ids[i]] && status(state, quests, ids[i], free === true && quests[ids[i]].kind !== 'event') === 'locked') return ids[i];
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
    if (kind === 'boss' && Array.isArray(q.bosses) && q.bosses.length) {   // v4.2 第 4c 批 Q_POST_3：四位霧將，順序自由
      var got = q.bosses.filter(function (m) { return !!state.bosses[m]; }).length;
      return { have: got, need: q.bosses.length, text: '淨化頭目 ' + got + '/' + q.bosses.length + (got >= q.bosses.length ? '（完成）' : '') };
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
    // v1.1：Q_LAMPS_3 只有國語、英語兩科 → 「國語、英語輪流」；五科的照舊「五科輪流」
    var subj = Array.isArray(q.subjects) && q.subjects.length ? (q.subjects.length >= 5 ? '五科輪流' : q.subjects.join('、') + '輪流') : (q.subject || '');
    return { have: r.progress || 0, need: helpCount(q), text: '幫忙答對 ' + (r.progress || 0) + '/' + helpCount(q) + ' 題（' + subj + '）' };
  }

  /**
   * v4.2.3（老闆 2026-11-15 選 A「恆春沒有台語?」）打獵／頭目委託進行中再找委託人：
   * 不再拿委託目標（只有華語）當台詞，改播「委託開始」那段對白裡委託人自己說的最後一句台語句（已上線、有台語字幕與語音）。
   * 回傳 { id: 對話鍵, index: 句序, line, lines }；lines 和原對話等長、只留那一句（句序不變，語音鍵 <對話鍵>_<句序> 才對得上），
   * 後面接一頁旁白（系統提示，華語；huayu_only 不找預錄音檔）顯示 info（目標與進度）。找不到台語句 → null（照舊用委託目標）。
   */
  // v4.2.3 技術長驗收（2026-11-15）：最後一句是「你可以去讓它清醒嗎？要小心喔。」（已答應了還再問）的 3 個頭目委託，
  // 改用同段裡的描述句（對話鍵 → 句序）。通用規則（問句往前找）會誤改 Q_AP_4、Q_YL_5 會挑錯句，所以逐一指定。
  var ACTIVE_LINE = { D_BG_4A: 0, D_JGS_3A: 1, D_YL_5A: 0 };
  function taigiOf(l, who) { return !!(l && l.who === who && l.text && !l.huayu_only && l.taigi && (l.taigi.hanji || l.taigi.tailo)); }
  function activeTalk(q, dialogs, npcId, info) {
    var id = q && q.dialog_start, d = id && dialogs && dialogs[id];
    if (!Array.isArray(d)) return null;
    var who = npcId || q.giver, k = -1;
    d.forEach(function (l, i) { if (taigiOf(l, who)) k = i; });
    if (k < 0) return null;
    if (ACTIVE_LINE.hasOwnProperty(id) && taigiOf(d[ACTIVE_LINE[id]], who)) k = ACTIVE_LINE[id];   // 指定的句子不是委託人的台語句（資料改過）就照通用規則
    var lines = d.map(function (l, i) { return i === k ? l : null; });
    if (info) lines.push({ who: 'narrator', text: info, huayu_only: true });
    return { id: id, index: k, line: d[k], lines: lines };
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
    if (rw.exp > 0) levels = Exp.addExp(state.player, rw.exp, data);   // v2.1：升級需求照目前職業的職階（data＝遊戲資料）
    if (rw.gold > 0) state.player.coins += rw.gold;
    var item = rw.item ? String(rw.item).replace(/^item_/, '') : null;
    if (item) Character.addItem(state, item, rw.item_n || 1);
    if (rw.light) {
      state.lights[rw.light] = true;
      if (state.stickers.indexOf(rw.light) < 0) state.stickers.push(rw.light);
    }
    state.quests[id] = { status: 'done', progress: (rec(state, id) || {}).progress || 0 };
    if (id === 'Q_GNO_4' && state.legacyM05) state.legacyM05 = false;   // v1.3（62 號 5.4）地精鏈做完：舊紅樹林旗標關掉，之後照台北章的數值
    if (id === 'Q_ORC_4' && state.legacySouth) state.legacySouth = false;   // v3.0（70 號 5.1）獸人鏈做完：舊南部旗標關掉
    if (q.sets_flag) { if (!state.flags || typeof state.flags !== 'object') state.flags = {}; state.flags[q.sets_flag] = true; }   // v3.0：霧仔加入（fogling_joined，codex5 跟班）
    if (q.lamp_auto && rw.light) { if (!state.lamps) state.lamps = {}; state.lamps[rw.light] = true; }   // v3.0（70 號 4.4）拿到光就自動點亮金包里的燈
    if (quests.Q_LAMPS && quests.Q_LAMPS.retired && ['國語', '英語', '數學', '自然', '社會'].every(function (l) { return state.lamps && state.lamps[l]; }) && !(state.quests.Q_LAMPS && state.quests.Q_LAMPS.status === 'done')) state.quests.Q_LAMPS = { status: 'done', progress: 0 };   // v3.0 Q_LAMPS 退役：五盞燈都亮就算完成
    if (state.story.indexOf(id) < 0) state.story.push(id);
    return { ok: true, reward: { exp: rw.exp || 0, gold: rw.gold || 0, item: item, light: rw.light || null }, levels: levels };
  }

  /** 頭目被淨化：自動完成相關 boss 委託。回傳完成結果陣列 */
  function onBossDefeated(state, quests, monsterId, data) {
    state.bosses[monsterId] = true;
    // v4.2 第 4c 批：bosses（多位頭目）也算；寫了 finish 的委託（Q_POST_3 走進光柱才完成）不在這裡自動完成
    return autoComplete(state, quests, data, function (q) { return (q.kind === 'boss') && !q.finish && (bossTarget(q) === monsterId || (Array.isArray(q.bosses) && q.bosses.indexOf(monsterId) >= 0)); });
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

  /**
   * v1.1 第二段試玩建議 S8：收集委託（hunt）的掉落保底。運氣差時（掉落率 0.5 的小雨傘曾經 8 場只掉 1 把）不用一直打。
   * 委託進行中、還沒收齊、打倒的是會掉這個收集品的怪物（頭目不算）：這場有掉 → 連續沒掉的次數歸零；
   * 沒掉 → 次數 +1；已經連續 HUNT_PITY 場沒掉 → 這場一定掉（回傳要補給的道具 id）、次數歸零。
   * 次數記在委託紀錄 state.quests[id].miss（完成委託時紀錄會換新，次數跟著清掉）。
   * drops＝這場已經掉的道具 id（還沒放進背包）。回傳要補給的道具 id 陣列（通常是空的）。
   */
  var HUNT_PITY = 4;   // 連續 4 場沒掉，第 5 場一定掉
  function huntPity(state, quests, mon, drops) {
    var add = [];
    if (!mon || mon.boss || !state || !state.quests) return add;
    drops = drops || [];
    Object.keys(quests).forEach(function (id) {
      var q = quests[id], h = q && (q.kind || 'help') === 'hunt' ? huntInfo(q) : null;
      if (!h || status(state, quests, id) !== 'active') return;
      var item = String(h.item || '').replace(/^item_/, '');
      var canDrop = (mon.drops || []).some(function (d) { return d && String(d.item || '').replace(/^item_/, '') === item; });
      if (!item || !canDrop) return;
      var r = rec(state, id);
      var got = drops.filter(function (d) { return d === item; }).length + add.filter(function (d) { return d === item; }).length;
      if (got > 0) { r.miss = 0; return; }
      if (Character.count(state, item) >= (h.n || 1)) return;   // 已經收齊：不用保底
      if ((r.miss || 0) >= HUNT_PITY) { add.push(item); r.miss = 0; return; }
      r.miss = (r.miss || 0) + 1;
    });
    return add;
  }

  /**
   * v1.4 桃竹章（63 號 4.3）冒險手帳「曙光碎片 ○／4」：數背包裡 dawn_shard_* 的珍貴道具（北、中、南、東四片；v1.4 只有北之曙光碎片）。
   * items＝ITEMS（只數 precious 的 key 道具；沒傳 items 時看 id）。回傳 { have, total }
   */
  var DAWN_SHARDS_TOTAL = 4;
  function dawnShards(state, items) {
    var inv = (state && state.inventory) || {};
    var have = Object.keys(inv).filter(function (k) { return /^dawn_shard_/.test(k) && inv[k] > 0 && (!items || !items[k] || items[k].precious); }).length;
    return { have: have, total: DAWN_SHARDS_TOTAL };
  }

  /** 手帳用：進行中與已完成 */
  function journal(state, quests, data) {
    var active = [], done = [];
    Object.keys(quests).forEach(function (id) {
      var s = status(state, quests, id);
      var q = quests[id];
      if (s === 'active') active.push({ id: id, title: q.title || id, map: q.map, kind: q.kind || 'help', goal: q.goal || '', next: q.log_next || '', objective: progress(state, quests, id, data).text, ready: canComplete(state, quests, id, data), side: q.side === true || /SIDE/.test(id) });
      else if (s === 'done') done.push({ id: id, title: q.title || id, map: q.map, next: q.log_next || '' });
    });
    return { active: active, done: done };
  }

  /**
   * v0.9.6（47 號 B02）旅店、商店老闆也有委託時怎麼辦：可以回報就先回報（'quest'）；有新委託或委託還在進行中 → 讓孩子選（'ask'）；
   * 沒有委託 → 照常營業（'service'）；不是旅店、商店的人 → 委託（'quest'）
   */
  function serviceChoice(role, f, canCompleteNow) {
    if (!f) return 'service';
    if (role !== 'inn' && role !== 'shop') return 'quest';
    if (f.status === 'active' && canCompleteNow) return 'quest';
    return 'ask';
  }

  var QuestLog = { dawnShards: dawnShards, DAWN_SHARDS_TOTAL: DAWN_SHARDS_TOTAL, serviceChoice: serviceChoice, status: status, forNpc: forNpc, accept: accept, recordHelp: recordHelp, progress: progress, activeTalk: activeTalk, canComplete: canComplete, complete: complete, onBossDefeated: onBossDefeated, onChestOpened: onChestOpened, journal: journal, bossTarget: bossTarget, chestTarget: chestTarget, helpCount: helpCount, helpSubject: helpSubject, firstLocked: firstLocked, freeOk: freeOk, TM_KEEP_LOCKED: TM_KEEP_LOCKED, HUNT_PITY: HUNT_PITY, huntPity: huntPity };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.QuestLog = QuestLog; }
  if (typeof module !== 'undefined') module.exports = QuestLog;
})();
