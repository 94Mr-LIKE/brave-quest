/*
 * 怪物名冊：記錄每種怪物「遇見、打倒」次數，達成收集目標可以領獎
 * state.bestiary = { 怪物id: { seen, defeated } }；state.bestiaryClaims = { 獎勵id: true }；state.titles = [稱號]
 *
 * 收集獎勵（數量依 monsters.js 自動計算：小怪＝boss 以外、頭目＝boss）：
 *   遇見 5 種   → 金幣 50
 *   遇見 10 種  → 藥草 ×3
 *   遇見 15 種  → 稱號「怪物觀察家」
 *   遇見全部    → 貼紙「怪物博士」＋稱號「怪物博士」
 *   每種小怪各打倒 3 次 → 金幣 150＋貼紙「勇敢徽章」
 *   打倒全部頭目        → 稱號「霧散英雄」＋貼紙「五道光」
 */
(function () {
  'use strict';

  function rec(state, id) {
    var b = state.bestiary || (state.bestiary = {});
    return b[id] || (b[id] = { seen: 0, defeated: 0 });
  }
  function seen(state, id) { rec(state, id).seen += 1; }
  function defeated(state, id) { var r = rec(state, id); if (!r.seen) r.seen = 1; r.defeated += 1; }

  /** 至少出現在一張地圖（spawns，包含頭目）的怪物 id */
  function onMaps(maps) {
    var set = {};
    Object.keys(maps || {}).forEach(function (mid) { (maps[mid].spawns || []).forEach(function (s) { if (s && s.monster) set[s.monster] = true; }); });
    return set;
  }

  /**
   * 小怪、頭目名單。maps 有給時只算至少出現在一張地圖的怪物（v0.9.3：沼澤蛙被招潮蟹取代後不再出現，
   * 不能算進「遇見全部」「每種小怪都打倒 3 次」，不然永遠拿不到）。不寫死名單
   */
  function split(monsters, maps) {
    var mobs = [], bosses = [], on = maps ? onMaps(maps) : null;
    Object.keys(monsters || {}).forEach(function (id) { if (on && !on[id]) return; (monsters[id].boss ? bosses : mobs).push(id); });
    return { mobs: mobs, bosses: bosses, all: mobs.concat(bosses) };
  }

  function counts(state, monsters, maps) {
    var s = split(monsters, maps), b = state.bestiary || {};
    return {
      total: s.all.length,
      seen: s.all.filter(function (id) { return b[id] && b[id].seen > 0; }).length,
      mobsDefeated3: s.mobs.filter(function (id) { return b[id] && b[id].defeated >= 3; }).length, mobs: s.mobs.length,
      bossesDefeated: s.bosses.filter(function (id) { return b[id] && b[id].defeated > 0; }).length, bosses: s.bosses.length
    };
  }

  /** 獎勵清單（含進度與是否可領） */
  function rewards(state, monsters, maps) {
    var c = counts(state, monsters, maps);
    var list = [
      { id: 'seen5', text: '遇見 5 種怪物', have: c.seen, need: Math.min(5, c.total), reward: { gold: 50 } },
      { id: 'seen10', text: '遇見 10 種怪物', have: c.seen, need: Math.min(10, c.total), reward: { item: 'herb', n: 3 } },
      { id: 'seen15', text: '遇見 15 種怪物', have: c.seen, need: Math.min(15, c.total), reward: { title: '怪物觀察家' } },
      { id: 'seenAll', text: '遇見全部 ' + c.total + ' 種怪物', have: c.seen, need: c.total, reward: { title: '怪物博士', sticker: 'bk_doctor' } },
      { id: 'mobs3', text: '每種小怪（' + c.mobs + ' 種）都打倒 3 次', have: c.mobsDefeated3, need: c.mobs, reward: { gold: 150, sticker: 'bk_brave' } },
      { id: 'bosses', text: '打倒全部 ' + c.bosses + ' 隻頭目', have: c.bossesDefeated, need: c.bosses, reward: { title: '霧散英雄', sticker: 'bk_light' } }
    ];
    var claimed = state.bestiaryClaims || {};
    list.forEach(function (r) { r.claimed = !!claimed[r.id]; r.ready = !r.claimed && r.need > 0 && r.have >= r.need; });
    return list;
  }

  var STICKER_NAME = { bk_doctor: '怪物博士貼紙', bk_brave: '勇敢徽章貼紙', bk_light: '五道光貼紙' };

  /** 領獎。回傳 {ok, reward} */
  function claim(state, monsters, id, maps) {
    var r = rewards(state, monsters, maps).filter(function (x) { return x.id === id; })[0];
    if (!r || !r.ready) return { ok: false };
    var rw = r.reward;
    if (rw.gold) state.player.coins += rw.gold;
    if (rw.item) state.inventory[rw.item] = (state.inventory[rw.item] || 0) + (rw.n || 1);
    if (rw.title) {
      state.titles = state.titles || [];
      if (state.titles.indexOf(rw.title) < 0) state.titles.push(rw.title);
      state.player.title = rw.title;   // 新稱號直接戴上（顯示在名字旁）
    }
    if (rw.sticker && state.stickers.indexOf(rw.sticker) < 0) state.stickers.push(rw.sticker);
    (state.bestiaryClaims || (state.bestiaryClaims = {}))[id] = true;
    return { ok: true, reward: rw };
  }

  /** 舊存檔遷移：名冊是空的時候，已淨化的頭目記為遇見、打倒各 1 次 */
  function backfill(state) {
    if (state.bestiary && Object.keys(state.bestiary).length) return 0;
    var n = 0;
    Object.keys(state.bosses || {}).forEach(function (id) { if (state.bosses[id]) { rec(state, id); state.bestiary[id] = { seen: 1, defeated: 1 }; n++; } });
    return n;
  }

  /** 出沒地區：哪些地圖的 spawns 有這種怪物 */
  function habitats(monId, maps) {
    return Object.keys(maps || {}).filter(function (mid) { return (maps[mid].spawns || []).some(function (s) { return s.monster === monId; }); })
      .map(function (mid) { return maps[mid].name || mid; });
  }

  var Bestiary = { onMaps: onMaps, rec: rec, seen: seen, defeated: defeated, split: split, counts: counts, rewards: rewards, claim: claim, backfill: backfill, habitats: habitats, STICKER_NAME: STICKER_NAME };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.Bestiary = Bestiary; }
  if (typeof module !== 'undefined') module.exports = Bestiary;
})();
