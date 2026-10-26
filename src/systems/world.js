/*
 * 世界資料：把 window.MAPS / QUESTS / DIALOGS / MONSTERS / ITEMS / JOBS / TILESETS 正規化，
 * 補上遊戲機制一定要有的預設值，並檢查資料彼此有沒有對上（不對時只回報警告，不讓遊戲當掉）。
 */
(function () {
  'use strict';

  // 遊戲機制會直接用到的道具：資料檔沒寫時用這份
  // id 沿用 items.js（v0.1 起）：eraser 刪去卡、guide 引導卡、snack 番薯仔點心
  var CORE_ITEMS = {
    herb: { name: '藥草', type: 'consumable', price: 10, heal: 20, desc: '回復 20 點體力。', sprite: 'item_herb' },
    snack: { name: '番薯仔點心', type: 'consumable', price: 15, heal: 10, pet: 1, desc: '番薯仔最愛的點心，回復 10 點體力。', sprite: 'item_snack' },
    eraser: { name: '刪去卡', type: 'card', price: 30, desc: '選擇題可以刪掉一個錯的選項。', sprite: 'item_card_remove' },
    guide: { name: '引導卡', type: 'card', price: 40, desc: '打開第 3、4 層提示。', sprite: 'item_card_guide' }
  };

  // 主角 1 級的數值（jobs.js 的 PLAYER_BASE 沒寫時用這份；07 第 5 節）
  var CORE_BASE = { hp: 30, mp: 10, atk: 6, def: 0 };

  // v1.0 第一批（48 號 2.1–2.6）：jobs.js 沒載入時只保證有見習冒險者（真正的職業表在 jobs.js）
  var CORE_JOBS = {
    novice: { name: '見習冒險者', tier: 'novice', mods: { hp: 1, mp: 1, atk: 1, def: 1 }, fav: null, bonus: 1, trait: {}, wf: [], af: [], skills: [] }
  };
  // 48 號 2.6：17 種效果代碼（26 號 5.3 的子集）
  var EFFECTS = ['hit', 'multi', 'crit', 'hit_weak', 'hit_stun', 'hit_gold', 'steal', 'pet', 'random', 'heal', 'guard', 'revive', 'stun', 'weaken', 'atk_up', 'charge', 'time_up'];
  var DAMAGE_EFFECTS = ['hit', 'multi', 'crit', 'hit_weak', 'hit_stun', 'hit_gold', 'steal', 'pet'];
  var TIER_MULT = { novice: 0.9, basic: 1.0 };

  // 戰鬥背景別名：maps.js 的 battle_bg → 實際的背景圖
  var BG_ALIASES = { grass: 'grass', field: 'grass', forest: 'forest', swamp: 'swamp', cave: 'cave', town: 'town', castle: 'castle', rock: 'rock', harbor: 'harbor', castle_top: 'castle_top', volcano: 'volcano', badlands: 'badlands', rock_hill: 'rock' };
  function battleBg(name) { return BG_ALIASES[name] || 'grass'; }

  var TYPE_ALIASES = {
    '消耗': 'consumable', '消耗品': 'consumable', '回復': 'consumable', 'potion': 'consumable', 'use': 'consumable',
    '卡片': 'card', '道具卡': 'card', '武器': 'weapon', '防具': 'armor', '素材': 'material', 'drop': 'material',
    '食物': 'food', '點心': 'food', '鑰匙': 'key', '重要': 'key', 'equip_weapon': 'weapon', 'equip_armor': 'armor'
  };

  function normType(t, it) {
    t = String(t || '').trim();
    if (TYPE_ALIASES[t]) return TYPE_ALIASES[t];
    if (['consumable', 'card', 'weapon', 'armor', 'material', 'food', 'key'].indexOf(t) >= 0) return t;
    if (it.atk) return 'weapon';
    if (it.def) return 'armor';
    if (it.heal || it.hp) return 'consumable';
    return 'material';
  }

  function normalizeItems(raw) {
    var out = {};
    var src = raw || {};
    Object.keys(src).forEach(function (id) {
      var it = src[id] || {};
      var key = id.replace(/^item_/, '');
      var eff = it.effect || {};
      var isEquip = it.kind === 'weapon' || it.kind === 'armor' || it.type === 'weapon' || it.type === 'armor';
      out[key] = {
        name: it.name || key, type: normType(it.type || it.kind || it.category, it),
        price: Number(it.price || 0), atk: Number(it.atk || 0), def: Number(it.def || 0),
        heal: Number(it.heal || eff.hp || (isEquip ? 0 : it.hp) || 0),
        mp: isEquip ? 0 : Number(eff.mp || 0),           // 消耗品回復的魔力
        mpBonus: isEquip ? Number(it.mp || 0) : 0,       // 裝備增加的魔力上限
        pet: Number(eff.pet || it.pet || 0),
        desc: it.desc || it.description || '', sprite: it.sprite || it.icon || ('item_' + key),
        job: it.jobs || it.job || null, not_for_sale: !!it.not_for_sale,
        // v1.0（48 號 F2）：fam＝類別（沒寫＝通用）、fx.dmg＝攻擊傷害 +x、fx_desc＝給孩子看的特效說明
        fam: isEquip ? (it.fam || 'gen') : null, fx: Object.assign({}, it.fx || {}), fx_desc: it.fx_desc || '',
        precious: !!it.precious, rare: !!it.rare, quest: !!it.quest   // 重要任務道具、劇情關鍵道具（不能賣）
      };
    });
    Object.keys(CORE_ITEMS).forEach(function (id) {
      if (!out[id]) out[id] = Object.assign({ atk: 0, def: 0, heal: 0, mp: 0, mpBonus: 0, pet: 0, job: null }, CORE_ITEMS[id]);
    });
    return out;
  }

  /** 技能（48 號 F1）：補上所屬職業、職階係數、科目（＝所屬職業的拿手科目；見習沒有拿手，用怪物的科目） */
  function normalizeSkill(sk, jobId, job) {
    var tier = job.tier || 'basic';
    return {
      id: sk.id, job: jobId, lv: Number(sk.lv || 1), name: sk.name || sk.id, eff: sk.eff, arg: Object.assign({}, sk.arg || {}),
      mp: Number(sk.mp || 0), desc: sk.desc || '', fx: Object.assign({ type: 'strike', color: '#FFFFFF', ms: 600 }, sk.fx || {}),
      tier: tier, tierMult: TIER_MULT[tier] || 1, subject: job.fav || null, fav: !!job.fav,
      damage: DAMAGE_EFFECTS.indexOf(sk.eff) >= 0 || sk.eff === 'random'
    };
  }

  function normalizeJobs(raw) {
    var out = {};
    var src = Object.assign({}, CORE_JOBS, raw || {});
    Object.keys(src).forEach(function (id) {
      var j = src[id] || {};
      var mods = Object.assign({ hp: 1, mp: 1, atk: 1, def: 1 }, j.mods || {});
      var job = {
        id: id, name: j.name || id, tier: j.tier || (id === 'novice' ? 'novice' : 'basic'), mods: mods,
        fav: j.fav || null, favored: j.fav || null, bonus: Number(j.bonus || (j.fav ? 1.5 : 1)),
        trait: Object.assign({}, j.trait || {}), wf: (j.wf || []).slice(), af: (j.af || []).slice(),
        time_mult: Number((j.trait && j.trait.time) || 1),
        sprite_f: j.sprite_f || ('hero_' + id), sprite_m: j.sprite_m || ('heroM_' + id), desc: j.desc || ''
      };
      job.skills = (j.skills || []).map(function (sk) { return normalizeSkill(sk, id, job); });
      out[id] = job;
    });
    return out;
  }

  function normalizeMonsters(raw) {
    var out = {};
    var src = raw || {};
    Object.keys(src).forEach(function (id) {
      var m = src[id] || {};
      out[id] = {
        id: id, name: m.name || id, sprite: m.sprite || ('mon_' + id), level: Number(m.level || 1),
        hp: Math.max(1, Number(m.hp || 10)), atk: Number(m.atk || 2), subject: m.subject || '數學',
        exp: Number(m.exp || 5), gold: Number(m.gold || 3), drops: Array.isArray(m.drops) ? m.drops : [],
        boss: !!m.boss, battle_bg: m.battle_bg || null,
        subjects: Array.isArray(m.subjects) && m.subjects.length ? m.subjects : null,
        q_levels: Array.isArray(m.q_levels) && m.q_levels.length === 2 ? m.q_levels : null,
        phases: Number(m.phases || 3), phase_q: Number(m.phase_q || 2), last_q_level: Number(m.last_q_level || 4),
        dialog_before: m.dialog_before || null, dialog_after: m.dialog_after || null,
        desc: m.desc || '', wake: m.wake || ((m.name || id) + '清醒了，開心地跑走了。')
      };
    });
    return out;
  }

  /** JOB_RULES（48 號 F1）：沒寫的欄位用規格的預設值 */
  var DEFAULT_RULES = {
    open_jobs: ['novice'], places: [], growth: { hp: 8, mp: 2, atk: 2, def: 0.5 }, floor_ratio: 0.5, transfer_step: 0.2,
    master_level: { novice: 10, basic: 30 }, tier_mult: TIER_MULT, skill_slots: 4,
    trial: { pass: 16, per_subject: { 1: 2, 2: 2 }, time_ratio: 0.75, term: '三上', min_minutes_left: 15 },
    change_npc: 'guild', unlock_level: 10
  };
  function normalizeJobRules(r) {
    var out = Object.assign({}, DEFAULT_RULES, r || {});
    out.growth = Object.assign({}, DEFAULT_RULES.growth, (r && r.growth) || {});
    out.master_level = Object.assign({}, DEFAULT_RULES.master_level, (r && r.master_level) || {});
    out.trial = Object.assign({}, DEFAULT_RULES.trial, (r && r.trial) || {});
    if (out.open_jobs.indexOf('novice') < 0) out.open_jobs = ['novice'].concat(out.open_jobs);
    out.unlock_level = out.master_level.novice;   // 舊程式讀的「幾級可以轉職」＝見習出師等級
    return out;
  }

  /** shops.js 有兩種寫法：{id: [品項]} 或 {id: {name, items:[品項]}}，統一成後者 */
  function normalizeShops(raw) {
    if (!raw) return null;
    var out = {};
    Object.keys(raw).forEach(function (id) {
      var s = raw[id];
      out[id] = Array.isArray(s) ? { name: '', items: s } : { name: s.name || '', items: s.items || [] };
    });
    return out;
  }

  /** 從 window 讀全部資料 */
  function fromWindow(w) {
    return {
      maps: w.MAPS || {}, tilesets: w.TILESETS || {}, quests: w.QUESTS || {}, dialogs: w.DIALOGS || {},
      monsters: normalizeMonsters(w.MONSTERS), items: normalizeItems(w.ITEMS), jobs: normalizeJobs(w.JOBS),
      base: Object.assign({}, CORE_BASE, w.PLAYER_BASE || {}), jobRules: normalizeJobRules(w.JOB_RULES),
      sprites: w.SPRITES || {}, shops: normalizeShops(w.SHOPS), npcNames: w.NPC_NAMES || {}
    };
  }

  // ---------------------------------------------------------------- 地圖查詢
  function size(map) {
    var g = map.grid || [];
    var w = 0;
    g.forEach(function (row) { if (row.length > w) w = row.length; });
    return { w: w, h: g.length };
  }

  function charAt(map, x, y) {
    var row = (map.grid || [])[y];
    if (row === undefined || x < 0 || x >= row.length) return ' ';
    return row.charAt(x);
  }

  function tileDef(tilesets, map, ch) {
    var set = tilesets[map.tileset] || tilesets.village || {};
    return set[ch] || null;
  }

  /** 固定物件（寶箱、NPC、旅店/商店櫃檯）會擋路 */
  function blockers(map) {
    var b = {};
    (map.npcs || []).forEach(function (n) { b[n.x + ',' + n.y] = true; });
    (map.chests || []).forEach(function (c) { b[c.x + ',' + c.y] = true; });
    // v0.9.4 候車亭（station.shelter 左上角，3×3 格）：依 2.5D 規範只擋最下面一排（底座），上面兩排可以走到後面被遮住
    var sh = map.station && map.station.shelter;
    if (sh) for (var dx = 0; dx < 3; dx++) b[(sh.x + dx) + ',' + (sh.y + 2)] = true;
    return b;
  }

  function isWalkable(tilesets, map, x, y, block) {
    var s = size(map);
    if (x < 0 || y < 0 || x >= s.w || y >= s.h) return false;
    if (block && block[x + ',' + y]) return false;
    var d = tileDef(tilesets, map, charAt(map, x, y));
    return d ? !!d.walk : true;
  }

  function exitAt(map, x, y) {
    var ex = map.exits || [];
    for (var i = 0; i < ex.length; i++) if (ex[i].x === x && ex[i].y === y) return ex[i];
    return null;
  }

  /** v1.2（61 號 2.0）出口可以走嗎：有 requires（委託 id 或陣列）時，那些委託都完成才可以走；沒寫就一直可以走 */
  function exitOpen(ex, state) {
    if (!ex || !ex.requires) return true;
    var TM = (typeof window !== 'undefined' && window.JQ && window.JQ.TestMode) || (typeof window === 'undefined' && typeof require === 'function' ? require('./testmode.js') : null);   // v1.3.1 測試模式（大人試玩）：不擋
    if (TM && TM.on()) return true;
    var qs = (state && state.quests) || {};
    return (Array.isArray(ex.requires) ? ex.requires : [ex.requires]).every(function (id) { return !!(qs[id] && qs[id].status === 'done'); });
  }

  /** 檢查資料彼此有沒有對上。回傳警告字串陣列 */
  function validate(data) {
    var warn = [];
    var maps = data.maps;
    Object.keys(maps).forEach(function (id) {
      var m = maps[id];
      if (!Array.isArray(m.grid) || !m.grid.length) { warn.push(id + '：沒有 grid'); return; }
      if (!data.tilesets[m.tileset]) warn.push(id + '：未知的 tileset ' + m.tileset);
      var set = data.tilesets[m.tileset] || {};
      var unknown = {};
      m.grid.forEach(function (row) { for (var i = 0; i < row.length; i++) if (!set[row.charAt(i)]) unknown[row.charAt(i)] = true; });
      if (Object.keys(unknown).length) warn.push(id + '：圖例沒有的字元 ' + Object.keys(unknown).join(''));
      (m.exits || []).forEach(function (e) {
        if (!maps[e.to]) warn.push(id + '：出口通往不存在的地圖 ' + e.to);
        if (e.requires && ![].concat(e.requires).every(function (r) { return data.quests[r]; })) warn.push(id + '：出口 (' + e.x + ',' + e.y + ') 的 requires 委託不存在');
        if (e.requires_dialog && !data.dialogs[e.requires_dialog]) warn.push(id + '：出口 (' + e.x + ',' + e.y + ') 的 requires_dialog ' + e.requires_dialog + ' 不存在');
      });
      (m.npcs || []).forEach(function (n) {
        if (n.dialog && !data.dialogs[n.dialog]) warn.push(id + '：NPC ' + n.id + ' 的對話 ' + n.dialog + ' 不存在');
      });
      (m.spawns || []).forEach(function (s) { if (!data.monsters[s.monster]) warn.push(id + '：怪物 ' + s.monster + ' 不存在'); });
    });
    Object.keys(data.quests).forEach(function (qid) {
      var q = data.quests[qid];
      (q.requires || []).forEach(function (r) { if (!data.quests[r]) warn.push(qid + '：前置委託 ' + r + ' 不存在'); });
      ['dialog_start', 'dialog_end'].forEach(function (k) { if (q[k] && !data.dialogs[q[k]]) warn.push(qid + '：對話 ' + q[k] + ' 不存在'); });
    });
    return warn;
  }

  function mapCoef(level) { return [1.0, 1.1, 1.2, 1.3, 1.5][Math.max(1, Math.min(5, level | 0)) - 1]; }

  var World = { EFFECTS: EFFECTS, DAMAGE_EFFECTS: DAMAGE_EFFECTS, TIER_MULT: TIER_MULT, normalizeJobRules: normalizeJobRules, CORE_ITEMS: CORE_ITEMS, CORE_BASE: CORE_BASE, battleBg: battleBg, normalizeShops: normalizeShops, CORE_JOBS: CORE_JOBS, normalizeItems: normalizeItems, normalizeJobs: normalizeJobs, normalizeMonsters: normalizeMonsters, fromWindow: fromWindow, size: size, charAt: charAt, tileDef: tileDef, blockers: blockers, isWalkable: isWalkable, exitAt: exitAt, exitOpen: exitOpen, validate: validate, mapCoef: mapCoef };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.World = World; }
  if (typeof module !== 'undefined') module.exports = World;
})();
