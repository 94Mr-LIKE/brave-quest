/*
 * 角色數值、背包、裝備、職業、旅店與「累倒」
 * 升級：體力 +8、魔力 +3、攻擊力 +2（07 第 5 節）
 */
(function () {
  'use strict';
  var BASE = { hp: 30, mp: 10, atk: 6, def: 0 };        // jobs.js 的 PLAYER_BASE 沒寫時用這份
  var PER_LEVEL = { hp: 8, mp: 3, atk: 2 };              // 見習冒險者的成長（07 第 5 節）
  var JOB_LEVEL = 5;

  /**
   * data = {items, jobs, base}（world.js 正規化後）
   * 數值 = 1 級基礎 + 目前職業的成長 ×（等級 − 1）+ 裝備
   */
  function stats(state, data) {
    var p = state.player, lv = p.level;
    var base = data.base || BASE;
    var job = (data.jobs && data.jobs[p.job]) || { growth: PER_LEVEL, time_mult: 1, bonus: 1.5 };
    var g = job.growth || PER_LEVEL;
    var w = state.equipment.weapon && data.items[state.equipment.weapon];
    var a = state.equipment.armor && data.items[state.equipment.armor];
    function eq(field) { return (w ? w[field] || 0 : 0) + (a ? a[field] || 0 : 0); }
    return {
      maxHp: base.hp + (g.hp || 0) * (lv - 1),
      maxMp: base.mp + (g.mp || 0) * (lv - 1) + eq('mpBonus'),
      atk: base.atk + (g.atk || 0) * (lv - 1) + eq('atk'),
      def: (base.def || 0) + eq('def'),
      job: p.job, jobName: job.name || p.job, favored: job.favored || null, favoredMult: job.bonus || 1.5,
      timeMult: job.time_mult || 1, skill: job.skill || null
    };
  }

  /** 把 hp/mp = -1（補滿記號）或超過上限的值修正 */
  function clampVitals(state, data) {
    var s = stats(state, data), p = state.player;
    if (p.hp < 0 || p.hp > s.maxHp) p.hp = s.maxHp;
    if (p.mp < 0 || p.mp > s.maxMp) p.mp = s.maxMp;
    return s;
  }

  function restoreFull(state, data) {
    var s = stats(state, data);
    state.player.hp = s.maxHp;
    state.player.mp = s.maxMp;
    return s;
  }

  // ---- 背包
  function count(state, id) { return state.inventory[id] || 0; }
  function addItem(state, id, n) { state.inventory[id] = count(state, id) + (n || 1); }
  function removeItem(state, id, n) {
    n = n || 1;
    if (count(state, id) < n) return false;
    state.inventory[id] -= n;
    if (state.inventory[id] === 0 && state.equipment.weapon !== id && state.equipment.armor !== id) delete state.inventory[id];
    return true;
  }

  /** 使用道具（藥草等）。回傳 {ok, healed} */
  function useItem(state, id, data) {
    var it = data.items[id];
    if (!it || count(state, id) < 1) return { ok: false, reason: 'none' };
    if (it.type === 'food') return { ok: false, reason: 'pet-food' };
    if (!(it.heal > 0 || it.mp > 0)) return { ok: false, reason: 'not-usable' };
    var s = stats(state, data);
    if (state.player.hp >= s.maxHp && !(it.mp > 0 && state.player.mp < s.maxMp)) return { ok: false, reason: 'full' };
    removeItem(state, id, 1);
    var before = state.player.hp;
    state.player.hp = Math.min(s.maxHp, state.player.hp + (it.heal || 0));
    state.player.mp = Math.min(s.maxMp, state.player.mp + (it.mp || 0));
    return { ok: true, healed: state.player.hp - before };
  }

  /** 裝備（武器/防具）。要背包裡有。回傳 {ok, reason} */
  function equip(state, id, data) {
    var it = data.items[id];
    if (!it || count(state, id) < 1) return { ok: false, reason: 'none' };
    var slot = it.type === 'weapon' ? 'weapon' : (it.type === 'armor' ? 'armor' : null);
    if (!slot) return { ok: false, reason: 'not-equipment' };
    if (it.job) {
      var jobs = Array.isArray(it.job) ? it.job : [it.job];
      if (jobs.indexOf(state.player.job) < 0) return { ok: false, reason: 'job', jobs: jobs };
    }
    state.equipment[slot] = id;
    clampVitals(state, data);
    return { ok: true, slot: slot };
  }

  function unequip(state, slot, data) {
    state.equipment[slot] = null;
    clampVitals(state, data);
  }

  // ---- 職業
  function canChangeJob(state, jobId, data) {
    var j = data.jobs[jobId];
    if (!j) return { ok: false, reason: 'unknown' };
    if (state.player.job === jobId) return { ok: false, reason: 'same' };
    var need = j.min_level || (jobId === 'novice' ? 1 : JOB_LEVEL);
    if (state.player.level < need) return { ok: false, reason: 'level', need: need };
    return { ok: true };
  }

  function changeJob(state, jobId, data) {
    var c = canChangeJob(state, jobId, data);
    if (!c.ok) return c;
    state.player.job = jobId;
    // 職業限定的裝備自動卸下
    ['weapon', 'armor'].forEach(function (slot) {
      var id = state.equipment[slot];
      var it = id && data.items[id];
      if (it && it.job) {
        var jobs = Array.isArray(it.job) ? it.job : [it.job];
        if (jobs.indexOf(jobId) < 0) state.equipment[slot] = null;
      }
    });
    restoreFull(state, data);
    return { ok: true };
  }

  // ---- 旅店、累倒
  function setInn(state, map, x, y) { state.lastInn = { map: map, x: x, y: y }; }

  function rest(state, data) { return restoreFull(state, data); }

  /** 體力 歸零：回到最近去過的旅店、體力／魔力 全滿，不扣金幣、不掉道具。回傳要去的位置 */
  function knockout(state, data, fallback) {
    var to = state.lastInn || fallback || null;
    restoreFull(state, data);
    if (to) state.location = { map: to.map, x: to.x, y: to.y };
    state.stats.battles.ko = (state.stats.battles.ko || 0) + 1;
    return to;
  }

  /** 升級時補滿 體力／魔力（給孩子正向回饋） */
  function onLevelUp(state, data) { return restoreFull(state, data); }

  var Character = { BASE: BASE, PER_LEVEL: PER_LEVEL, JOB_LEVEL: JOB_LEVEL, stats: stats, clampVitals: clampVitals, restoreFull: restoreFull, count: count, addItem: addItem, removeItem: removeItem, useItem: useItem, equip: equip, unequip: unequip, canChangeJob: canChangeJob, changeJob: changeJob, setInn: setInn, rest: rest, knockout: knockout, onLevelUp: onLevelUp };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.Character = Character; }
  if (typeof module !== 'undefined') module.exports = Character;
})();
