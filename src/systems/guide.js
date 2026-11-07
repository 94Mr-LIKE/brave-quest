/*
 * 目標指引（v3.0.1 ②；v4.0.1 改雙旗）：小地圖、放大地圖、世界地圖標紅旗「下一步」與橘旗「還沒接」；手帳顯示兩行提醒。
 *   （世界地圖清單原本就用 🚩 表示「可以去」，所以文字用 🎯，地圖上畫紅色小旗子，不混在一起）
 * 由 wip_v301/v301_features_apply.js 複製成 docs/src/systems/guide.js。純函式（node 可以 require）。
 *   家長設定可以關（state.settings.guide === false）；洞窟、解謎地圖（maps.js no_minimap: true 或 no_guide: true）照老闆舊指示不標。
 *   寶箱委託只標地區、不標寶箱位置（v0.9.1 老闆指示：寶箱要自己找）。
 * 要標哪裡（target）：
 *   1 進行中的委託（主線先、支線後，照資料順序）：可以回報 → 委託人；答題委託 → 委託人；頭目 → 頭目出沒的地方；
 *     打獵 → 會掉那樣東西的怪物出沒範圍中間；寶箱 → 只標那張地圖（沒有座標）
 *   2 v4.0.1 沒有進行中的主線：最後一個有位置的可接主線（最新地區）；副旗提醒最早漏接的主線。
 */
(function () {
  'use strict';
  var isNode = typeof module !== 'undefined' && typeof require === 'function';
  var QuestLog = isNode ? require('./questlog.js') : window.JQ.QuestLog;

  function enabled(state) { return !!state && !(state.settings && state.settings.guide === false); }
  function hiddenMap(map) { return !!map && (map.no_minimap === true || map.no_guide === true); }
  /** NPC 在哪裡：先找委託寫的地圖，再找其他地圖 → { map, x, y } */
  function npcSpot(data, npcId, prefMap) {
    var maps = (data && data.maps) || {}, order = prefMap && maps[prefMap] ? [prefMap].concat(Object.keys(maps).filter(function (k) { return k !== prefMap; })) : Object.keys(maps);
    for (var i = 0; i < order.length; i++) {
      var n = (maps[order[i]].npcs || []).filter(function (x) { return x && x.id === npcId; })[0];
      if (n) return { map: order[i], x: n.x, y: n.y };
    }
    return null;
  }
  function areaCenter(mapId, s) { var a = s.area || [s.x || 0, s.y || 0, 1, 1]; return { map: mapId, x: Math.floor(a[0] + (a[2] || 1) / 2), y: Math.floor(a[1] + (a[3] || 1) / 2) }; }
  /** 怪物出沒的地方（questId 有給時，先找那個委託的頭目出沒點） */
  function spawnSpot(data, monsterId, questId, prefMap) {
    var maps = (data && data.maps) || {}, best = null;
    Object.keys(maps).forEach(function (k) {
      (maps[k].spawns || []).forEach(function (s) {
        if (!s || s.monster !== monsterId) return;
        var score = (questId && s.quest === questId ? 2 : 0) + (k === prefMap ? 1 : 0);
        if (!best || score > best.score) best = { score: score, spot: areaCenter(k, s) };
      });
    });
    return best ? best.spot : null;
  }
  /** 會掉 itemId 的怪物出沒的地方（委託地圖優先） */
  function dropSpot(data, itemId, prefMap) {
    var mons = (data && data.monsters) || {}, ids = Object.keys(mons).filter(function (m) { return !mons[m].boss && (mons[m].drops || []).some(function (d) { return d && d.item === itemId; }); });
    var spots = ids.map(function (m) { return spawnSpot(data, m, null, prefMap); }).filter(Boolean);
    return spots.filter(function (s) { return s.map === prefMap; })[0] || spots[0] || null;
  }
  function chestMap(data, chestId) {
    var maps = (data && data.maps) || {};
    for (var k in maps) if ((maps[k].chests || []).some(function (c) { return c && c.id === chestId; })) return k;
    return null;
  }
  /** 一個委託的下一步 → { map, x, y, kind } 或 null（找不到地方） */
  function spotFor(state, data, id) {
    var Q = (data && data.quests) || {}, q = Q[id];
    if (!q) return null;
    var ready = QuestLog.canComplete(state, Q, id, data), s = null, kind = q.kind || 'help';
    if (ready) { s = npcSpot(data, q.giver, q.map); kind = 'report'; }
    else if (kind === 'boss') { var b = q.boss || q.target || q.monster; s = (b && spawnSpot(data, b, id, q.map)) || npcSpot(data, q.giver, q.map); }
    else if (kind === 'hunt') { s = (q.hunt && dropSpot(data, q.hunt.item, q.map)) || npcSpot(data, q.giver, q.map); }
    else if (kind === 'chest') { var cm = chestMap(data, q.chest || q.target); s = cm ? { map: cm, x: null, y: null } : null; }
    else s = npcSpot(data, q.giver, q.map);
    return s ? { map: s.map, x: s.x, y: s.y, kind: kind } : null;
  }
  /** 主旗＋副旗（最多兩面）；主旗在洞窟時整組隱藏，副旗在洞窟時只略過副旗。 */
  function targets(state, data) {
    if (!enabled(state) || !data || !data.quests) return [];
    var Q = data.quests, maps = data.maps || {};
    var act = QuestLog.journal(state, Q, data).active, main = act.filter(function (a) { return !a.side; }), side = act.filter(function (a) { return a.side; });
    var avail = Object.keys(Q).filter(function (id) { var q = Q[id]; return q.side !== true && !/SIDE/.test(id) && q.giver && QuestLog.status(state, Q, id) === 'available'; });
    var cands = main.concat(side).map(function (a) { return a.id; });
    if (!main.length) cands = avail.slice().reverse().concat(cands);
    var out = [];
    for (var i = 0; i < cands.length; i++) {
      var id = cands[i], s = spotFor(state, data, id);
      if (!s) continue;
      if (hiddenMap(maps[s.map])) return [];   // 下一步在洞窟、解謎地圖：照老闆指示不標
      var st = QuestLog.status(state, Q, id);
      out.push({ quest: id, title: Q[id].title || id, kind: st === 'available' ? 'new' : s.kind, map: s.map, x: s.x, y: s.y });
      break;
    }
    if (!out.length) return out;
    // 先選最早漏接的委託；沒有位置或位於隱藏地圖就省略，不改標下一個。
    var second = avail.filter(function (id) { return id !== out[0].quest; })[0];
    var ss = second && spotFor(state, data, second);
    if (ss && !hiddenMap(maps[ss.map])) {
      out.push({ quest: second, title: Q[second].title || second, kind: 'new', map: ss.map, x: ss.x, y: ss.y, secondary: true });
    }
    return out;
  }
  function target(state, data) { return targets(state, data)[0] || null; }
  /** 遊戲用：快取兩面旗，同一份狀態及資料 1 秒內不重算。 */
  var cache = { t: 0, v: [], st: null, data: null };
  function currentAll(G, now) {
    if (!G || !G.state || !G.data) return [];
    now = now || Date.now();
    if (cache.st === G.state && cache.data === G.data && now - cache.t < 1000) return cache.v;
    cache = { t: now, st: G.state, data: G.data, v: targets(G.state, G.data) };
    return cache.v;
  }
  function current(G, now) { return currentAll(G, now)[0] || null; }
  function reset() { cache = { t: 0, v: [], st: null, data: null }; }
  /** 下一步所在的地圖 id（世界地圖用）；沒有就 null */
  function goalMap(G) { var t = current(G); return t ? t.map : null; }
  function goalMaps(G) { var ts = currentAll(G); return { primary: ts[0] ? ts[0].map : null, secondary: ts[1] ? ts[1].map : null }; }
  /** 手帳、提示用的一句話 */
  function text(t, data) {
    if (!t) return '';
    var mn = ((data && data.maps && data.maps[t.map]) || {}).name || t.map;
    if (t.secondary) return '📌 還沒接：去「' + mn + '」接新委託（' + t.title + '）';
    return '🎯 下一步：' + (t.kind === 'new' ? '去「' + mn + '」接新委託' : t.kind === 'report' ? '回「' + mn + '」回報委託' : '「' + mn + '」') + '（' + t.title + '）';
  }

  var Guide = { enabled: enabled, hiddenMap: hiddenMap, npcSpot: npcSpot, spawnSpot: spawnSpot, dropSpot: dropSpot, spotFor: spotFor, targets: targets, target: target, currentAll: currentAll, current: current, reset: reset, goalMaps: goalMaps, goalMap: goalMap, text: text };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.Guide = Guide; }
  if (typeof module !== 'undefined') module.exports = Guide;
})();
