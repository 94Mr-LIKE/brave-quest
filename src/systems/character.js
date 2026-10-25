/*
 * 角色數值、背包、裝備、職業、旅店與「累倒」
 * v1.0 第一批（48 號 v2）：職業倍率、累加 1＋0.2n、保底 50%、轉職回 Lv1、每個職業分開記等級（player.jobs）、
 *   防禦會成長、裝備類別與專屬武器、武器特效（攻擊傷害 +x）、技能欄 4 格
 */
(function () {
  'use strict';
  var BASE = { hp: 30, mp: 10, atk: 6, def: 0 };        // jobs.js 的 PLAYER_BASE 沒寫時用這份
  var GROWTH = { hp: 8, mp: 2, atk: 2, def: 0.5 };      // 48 號 2.1：所有職業一樣（JOB_RULES.growth）
  var PER_LEVEL = GROWTH;                               // 舊名稱（測試、工具讀的）
  var JOB_LEVEL = 10;                                   // 見習出師等級（JOB_RULES.master_level.novice）
  var KEYS = ['hp', 'mp', 'atk', 'def'];
  function rnd(x) { return Math.floor(x + 0.5); }
  function rules(data) { return (data && data.jobRules) || {}; }
  function growth(data) { return Object.assign({}, GROWTH, rules(data).growth || {}); }
  function masterLevel(data, job) {
    var m = Object.assign({ novice: JOB_LEVEL, basic: 30 }, rules(data).master_level || {});
    return m[(job && job.tier) || 'basic'] || 30;
  }
  function jobOf(data, id) { return (data && data.jobs && data.jobs[id]) || { id: id, tier: id === 'novice' ? 'novice' : 'basic', mods: { hp: 1, mp: 1, atk: 1, def: 1 }, trait: {}, wf: [], af: [], skills: [], bonus: 1 }; }

  /** player.jobs（每個職業各自的等級、經驗值）；目前職業以 player.level／exp 為準 */
  function ensureJobs(state) {
    var p = state.player;
    if (!p.jobs || typeof p.jobs !== 'object') p.jobs = {};
    if (!p.floor || typeof p.floor !== 'object') p.floor = {};
    p.job = p.job || 'novice';
    p.jobs[p.job] = { lv: p.level, exp: p.exp };
    if (!p.jobs.novice) p.jobs.novice = { lv: 1, exp: 0 };
    return p;
  }
  /** 某個職業現在幾級（沒當過＝0） */
  function jobLevel(state, id) {
    var p = state.player;
    if (id === p.job) return p.level;
    return (p.jobs && p.jobs[id] && p.jobs[id].lv) || 0;
  }
  /** n＝已出師的職業數（不含目前職業） */
  function mastered(state, data) {
    var p = state.player, n = 0;
    Object.keys(p.jobs || {}).forEach(function (id) {
      if (id === p.job) return;
      if (jobLevel(state, id) >= masterLevel(data, jobOf(data, id))) n++;
    });
    return n;
  }
  /** 能力（不含裝備）：48 號 2.1 */
  function baseStats(state, data) {
    var p = state.player, job = jobOf(data, p.job), L = p.level, n = mastered(state, data);
    var base = Object.assign({}, BASE, (data && data.base) || {}), g = growth(data);
    var t = 1 + Number(rules(data).transfer_step === undefined ? 0.2 : rules(data).transfer_step) * n;
    var out = { n: n };
    KEYS.forEach(function (k) {
      var raw = rnd((base[k] + g[k] * (L - 1)) * (job.mods[k] === undefined ? 1 : job.mods[k]) * t);
      out[k] = Math.max(raw, Number((p.floor || {})[k]) || 0);
    });
    return out;
  }
  /** 這件裝備現在的職業能不能用（48 號 3.1：專屬武器看 jobs；其他看類別；通用大家都能用） */
  function usable(it, jobId, data) {
    if (!it) return false;
    var jobs = it.job ? (Array.isArray(it.job) ? it.job : [it.job]) : null;
    if (jobs) return jobs.indexOf(jobId) >= 0;
    var fam = it.fam || 'gen';
    if (fam === 'gen') return true;
    var job = jobOf(data, jobId), list = it.type === 'weapon' ? job.wf : job.af;
    return (list || []).indexOf(fam) >= 0;
  }
  /** 裝備類別的名字（48 號 F2；說明卡、商店用） */
  var FAM_NAME = { gen: '通用', sword: '劍', axe: '斧・錨', fist: '拳套', staff: '法杖', dagger: '短刀・弓', perform: '表演道具', whip: '鞭', heavy: '重甲', light: '輕甲', robe: '法袍' };
  function famNames(list) { return (list || []).map(function (f) { return FAM_NAME[f] || f; }).join('、'); }
  /**
   * 這個職業「現在實際裝得上」的裝備類別（說明卡用；CTO 2026-10-12）：從 items.js 現有的武器／防具推算，
   * 只列 jobs.js 的 wf／af 裡、而且真的有一件這個職業能裝的類別（通用不列）。
   * 例：第一批的船錨斧只有船員能裝 → 劍士不顯示「斧・錨」。之後加了劍士能裝的斧，就會自動出現。
   */
  function equipFams(jobId, data, slot) {
    var job = jobOf(data, jobId), list = (slot === 'armor' ? job.af : job.wf) || [], items = (data && data.items) || {};
    return list.filter(function (fam) {
      return Object.keys(items).some(function (id) { var it = items[id]; return it && it.type === slot && (it.fam || 'gen') === fam && usable(it, jobId, data); });
    });
  }
  /** 哪些職業能用（商店、背包說明用）；通用回傳 null */
  function usableJobs(it, data) {
    if (!it) return [];
    if (it.job) return Array.isArray(it.job) ? it.job.slice() : [it.job];
    if ((it.fam || 'gen') === 'gen') return null;
    return Object.keys((data && data.jobs) || {}).filter(function (id) { return usable(it, id, data); });
  }

  /**
   * 數值。data = {items, jobs, base, jobRules}（world.js 正規化後）
   * 回傳 maxHp、maxMp、power（力量＝能力的攻擊，不含武器）、atk（物攻＝力量＋武器攻擊）、def、dmgMult（裝備特效「攻擊傷害」）、
   *   技能（learned 學會的全部、skills 技能欄裡的、skill＝第一格，舊程式用）、trait、拿手科目……
   */
  function stats(state, data) {
    var p = state.player;
    var job = jobOf(data, p.job), bs = baseStats(state, data);
    var items = (data && data.items) || {};
    var w = state.equipment.weapon && items[state.equipment.weapon];
    var a = state.equipment.armor && items[state.equipment.armor];
    function eq(field) { return (w ? w[field] || 0 : 0) + (a ? a[field] || 0 : 0); }
    var dmgMult = (1 + ((w && w.fx && w.fx.dmg) || 0)) * (1 + ((a && a.fx && a.fx.dmg) || 0));
    var learned = learnedSkills(state, data), slots = slotSkills(state, data, learned);
    return {
      maxHp: bs.hp, maxMp: bs.mp + eq('mpBonus'), power: bs.atk, atk: bs.atk + eq('atk'), def: bs.def + eq('def'),
      base: bs, n: bs.n, dmgMult: dmgMult,
      job: p.job, jobName: job.name || p.job, tier: job.tier, favored: job.fav || null, favoredMult: job.bonus || 1.5,
      trait: job.trait || {}, timeMult: (job.trait && job.trait.time) || 1,
      learned: learned, skills: slots, skill: slots[0] || null
    };
  }

  /** 學會的技能：當過的每個職業，等級到了就學會（26 號 5.1 第 6 點：轉職後可以帶以前學會的技能）。見習的排前面，再依職業、等級 */
  function learnedSkills(state, data) {
    var p = state.player, out = [];
    var ids = Object.keys(p.jobs || {});
    if (ids.indexOf(p.job) < 0) ids.push(p.job);
    ids.sort(function (x, y) { return (x === 'novice' ? -1 : 0) - (y === 'novice' ? -1 : 0); });
    ids.forEach(function (id) {
      var lv = jobLevel(state, id);
      (jobOf(data, id).skills || []).forEach(function (s) { if (lv >= s.lv) out.push(s); });
    });
    return out;
  }
  /** 技能欄（4 格）：玩家設定過就照設定（只留學會的）；沒設定＝最新學會的 4 個 */
  function slotSkills(state, data, learned) {
    var max = Number(rules(data).skill_slots || 4), p = state.player;
    learned = learned || learnedSkills(state, data);
    var byId = {};
    learned.forEach(function (s) { byId[s.id] = s; });
    if (Array.isArray(p.skillSlots) && p.skillSlots.length) {
      return p.skillSlots.map(function (id) { return byId[id]; }).filter(Boolean).slice(0, max);
    }
    var cur = learned.filter(function (s) { return s.job === p.job; }), other = learned.filter(function (s) { return s.job !== p.job; });
    return other.concat(cur).slice(-max);   // 目前職業的技能優先放進去，不夠再放以前學的
  }
  function setSkillSlots(state, data, ids) {
    var learned = learnedSkills(state, data), ok = {};
    learned.forEach(function (s) { ok[s.id] = 1; });
    var max = Number(rules(data).skill_slots || 4);
    state.player.skillSlots = (ids || []).filter(function (id, i, arr) { return ok[id] && arr.indexOf(id) === i; }).slice(0, max);
    return state.player.skillSlots;
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
    var st = state; if (st.startItems && (st.startItems[id] || 0) > (st.inventory[id] || 0)) { if (st.inventory[id] > 0) st.startItems[id] = st.inventory[id]; else delete st.startItems[id]; }   // v0.9.2 先用掉一開始給的
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
    if (!usable(it, state.player.job, data)) return { ok: false, reason: 'job', jobs: usableJobs(it, data) || [] };
    state.equipment[slot] = id;
    clampVitals(state, data);
    return { ok: true, slot: slot };
  }

  function unequip(state, slot, data) {
    state.equipment[slot] = null;
    clampVitals(state, data);
  }

  // ---- 職業（48 號 2.4）
  /** 開放了沒（JOB_RULES.open_jobs；E2-B 先開 5 個＋見習） */
  function isOpen(data, jobId) {
    var open = rules(data).open_jobs;
    return jobId === 'novice' || !Array.isArray(open) || open.indexOf(jobId) >= 0;
  }
  /**
   * 能不能轉成 jobId。回傳 { ok, reason, need, back }：
   *   back＝以前當過（換回去免費、不用考、恢復原本的等級）；
   *   reason：unknown、same、closed（還沒開放）、level（見習還沒到出師等級）、trial（要先通過立志小考）
   */
  function canChangeJob(state, jobId, data) {
    var j = data.jobs[jobId], p = state.player;
    if (!j) return { ok: false, reason: 'unknown' };
    if (p.job === jobId) return { ok: false, reason: 'same' };
    if (!isOpen(data, jobId)) return { ok: false, reason: 'closed' };
    var held = jobId === 'novice' || !!(p.jobs && p.jobs[jobId]);
    if (held) return { ok: true, back: true };
    var need = masterLevel(data, jobOf(data, 'novice'));
    if (jobLevel(state, 'novice') < need) return { ok: false, reason: 'level', need: need };
    var tr = state.trial && state.trial[jobId];
    if (!(tr && tr.passedAt)) return { ok: false, reason: 'trial' };
    return { ok: true, back: false };
  }

  /** 裝備價值（48 號 3.5）：武器＝(攻擊＋魔力÷4)×特效倍率；防具＝防禦＋魔力÷4 */
  function gearValue(it) {
    if (!it) return 0;
    if (it.type === 'weapon') return ((it.atk || 0) + (it.mpBonus || 0) / 4) * (1 + ((it.fx && it.fx.dmg) || 0));
    return (it.def || 0) + (it.mpBonus || 0) / 4;
  }
  /** 轉職後：不能用的卸下（留在背包）；每一格換上背包裡能用的最好一件 */
  function autoEquip(state, data) {
    var items = data.items || {}, changed = { off: [], on: [] };
    ['weapon', 'armor'].forEach(function (slot) {
      var cur = state.equipment[slot];
      if (cur && !usable(items[cur], state.player.job, data)) { changed.off.push(cur); state.equipment[slot] = null; cur = null; }
      var best = cur, bv = cur ? gearValue(items[cur]) : 0;
      Object.keys(state.inventory || {}).forEach(function (id) {
        var it = items[id];
        if (!it || (state.inventory[id] || 0) < 1 || it.type !== slot || !usable(it, state.player.job, data)) return;
        var v = gearValue(it);
        if (v > bv) { best = id; bv = v; }
      });
      if (best && best !== state.equipment[slot]) { state.equipment[slot] = best; changed.on.push(best); }
    });
    return changed;
  }

  /**
   * 轉職（48 號 2.4）：記保底（轉職前能力不含裝備 ×floor_ratio，各項取較大值）→ 存好目前職業的等級 →
   * 新職業 Lv1、經驗值 0（以前當過就恢復原本的等級）→ 自動換裝 → 體力、魔力不補滿，只壓到新上限（v0.9.6）
   */
  function changeJob(state, jobId, data) {
    var c = canChangeJob(state, jobId, data);
    if (!c.ok) return c;
    var p = ensureJobs(state);
    var ratio = Number(rules(data).floor_ratio === undefined ? 0.5 : rules(data).floor_ratio);
    var bs = baseStats(state, data);
    KEYS.forEach(function (k) { p.floor[k] = Math.max(Number(p.floor[k]) || 0, Math.floor(bs[k] * ratio)); });
    p.jobs[p.job] = { lv: p.level, exp: p.exp };
    var from = p.job;
    p.job = jobId;
    var rec = p.jobs[jobId] || { lv: 1, exp: 0 };
    p.jobs[jobId] = rec;
    p.level = rec.lv; p.exp = rec.exp;
    p.skillSlots = null;   // 技能欄回到預設（新職業的技能優先）
    var gear = autoEquip(state, data);
    var s = stats(state, data);
    if (p.hp > s.maxHp) p.hp = s.maxHp;
    if (p.mp > s.maxMp) p.mp = s.maxMp;
    if (p.hp < 0 || p.mp < 0) clampVitals(state, data);   // -1＝舊存檔的「全滿」記號
    return { ok: true, back: !!c.back, from: from, gear: gear };
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

  /**
   * 買裝備時比較：換上這件之後物攻、防禦力、魔力上限會變多少。
   * v1.0（48 號 3.5、S11）：「更好」看裝備價值（武器＝(攻擊＋魔力÷4)×特效倍率；防具＝防禦＋魔力÷4），所以魔力、特效都算進去
   * 回傳 { slot, canEquip, reason, current, before:{atk,def,maxMp,dmgMult}, after:{...}, better }
   */
  function compareEquip(state, id, data) {
    var it = data.items[id];
    var slot = it && (it.type === 'weapon' ? 'weapon' : (it.type === 'armor' ? 'armor' : null));
    if (!slot) return { slot: null, canEquip: false, reason: 'not-equipment' };
    if (!usable(it, state.player.job, data)) return { slot: slot, canEquip: false, reason: 'job', jobs: usableJobs(it, data) || [] };
    var b = stats(state, data);
    var trial = { player: state.player, equipment: Object.assign({}, state.equipment) };
    trial.equipment[slot] = id;
    var a = stats(trial, data);
    var cur = state.equipment[slot] || null;
    var before = { atk: b.atk, def: b.def, maxMp: b.maxMp, dmgMult: b.dmgMult }, after = { atk: a.atk, def: a.def, maxMp: a.maxMp, dmgMult: a.dmgMult };
    return { slot: slot, canEquip: true, current: cur, before: before, after: after,
      better: gearValue(it) > (cur ? gearValue(data.items[cur]) : 0) };
  }

  /** v1.2（61 號 4.4）章末要不要提醒轉職：還沒轉職過（只當過見習）、見習已到出師等級（10 級） */
  function needsJobHint(state, data) {
    var p = state && state.player;
    if (!p || (p.job || 'novice') !== 'novice') return false;
    if (Object.keys(p.jobs || {}).some(function (id) { return id !== 'novice' && p.jobs[id] && p.jobs[id].lv > 0; })) return false;
    return jobLevel(state, 'novice') >= masterLevel(data, jobOf(data, 'novice'));
  }

  var Character = { FAM_NAME: FAM_NAME, famNames: famNames, equipFams: equipFams, GROWTH: GROWTH, baseStats: baseStats, ensureJobs: ensureJobs, jobLevel: jobLevel, needsJobHint: needsJobHint, mastered: mastered, usable: usable, usableJobs: usableJobs, isOpen: isOpen, gearValue: gearValue, autoEquip: autoEquip, learnedSkills: learnedSkills, slotSkills: slotSkills, setSkillSlots: setSkillSlots, compareEquip: compareEquip, BASE: BASE, PER_LEVEL: PER_LEVEL, JOB_LEVEL: JOB_LEVEL, stats: stats, clampVitals: clampVitals, restoreFull: restoreFull, count: count, addItem: addItem, removeItem: removeItem, useItem: useItem, equip: equip, unequip: unequip, canChangeJob: canChangeJob, changeJob: changeJob, setInn: setInn, rest: rest, knockout: knockout, onLevelUp: onLevelUp };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.Character = Character; }
  if (typeof module !== 'undefined') module.exports = Character;
})();
