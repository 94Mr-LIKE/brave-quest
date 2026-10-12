/*
 * 存檔：localStorage key "bq_save"（含 schema version）
 *   本遊戲所有 localStorage key 一律以 "bq_" 開頭：發布網域（*.github.io）和其他專案共用 localStorage，
 *   遊戲只讀寫自己的 bq_ key。舊版的 "jinshan-quest-save" 由 SaveProvider.migrateLegacyKeys 搬過來。
 * 存檔碼：JSON → UTF-8 → Base64，格式 "JQ1-<base64>-<8 碼校驗>"
 *   校驗碼 = FNV-1a 32bit(base64 字串) 的 16 進位大寫
 * 匯入失敗一律不覆蓋原存檔（importCode 只回傳結果，由呼叫端決定是否寫入）
 */
(function () {
  'use strict';
  var isNode = typeof module !== 'undefined' && typeof require === 'function';
  var State = isNode ? require('./state.js') : window.JQ.State;
  var Bestiary = isNode ? require('./bestiary.js') : window.JQ.Bestiary;
  var JobMigrate = isNode ? require('./jobmigrate.js') : window.JQ.JobMigrate;

  var KEY_PREFIX = 'bq_';
  var SAVE_KEY = 'bq_save';
  var LEGACY_SAVE_KEY = 'jinshan-quest-save';
  var CODE_PREFIX = 'JQ1';
  var MAX_CODE_LEN = 1000000;   // 存檔碼長度上限（正常存檔遠小於此；擋掉貼上超大資料造成卡頓）

  function fnv1a(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    var hex = (h >>> 0).toString(16).toUpperCase();
    while (hex.length < 8) hex = '0' + hex;
    return hex;
  }

  function utf8ToBase64(text) {
    var bytes = new TextEncoder().encode(text);
    var bin = '';
    for (var i = 0; i < bytes.length; i += 0x8000) {
      bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    }
    return btoa(bin);
  }

  function base64ToUtf8(b64) {
    var bin = atob(b64);
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  }

  /** 檢查存檔物件是否像樣；回傳錯誤字串或 '' */
  function validateState(s) {
    if (!s || typeof s !== 'object') return '不是存檔資料';
    if (typeof s.version !== 'number' || s.version < 1) return '缺少版本號';
    if (s.version > State.SCHEMA_VERSION) return '存檔版本比遊戲新，請更新遊戲';
    if (!s.player || typeof s.player !== 'object') return '缺少角色資料';
    if (typeof s.player.level !== 'number' || s.player.level < 1) return '等級資料錯誤';
    if (typeof s.player.coins !== 'number' || s.player.coins < 0) return '金幣資料錯誤';
    if (typeof s.player.exp !== 'number' || s.player.exp < 0) return '經驗值資料錯誤';
    return '';
  }

  /**
   * v1（v0.1 單地圖五盞燈）→ v2（v0.2 多地圖冒險）
   * 保留：名字、等級、經驗、金幣、學習紀錄、適性難度、每日任務、遊玩時間、家長設定、番薯仔愛心
   * 道具：items → inventory（id 相同：eraser 刪去卡、guide 引導卡、snack 點心），另送 2 個藥草
   * 重置：五盞燈、貼紙、劇情（v0.2 的故事重新開始）、外觀（v0.2 沒有外觀商店）
   */
  function migrateV1toV2(s) {
    var items = s.items || {};
    s.inventory = { herb: 2, eraser: items.eraser || 0, guide: items.guide || 0, snack: items.snack || 0 };
    delete s.items;
    delete s.cosmetics;
    delete s.position;
    s.lamps = null; s.stickers = null; s.story = null; s.activeQuest = null;
    delete s.lamps; delete s.stickers; delete s.story;
    if (s.player) { s.player.job = 'novice'; s.player.hp = -1; s.player.mp = -1; s.player.gender = 'f'; delete s.player.palette; }
    s.migratedFrom = 1;
    s.version = 2;
    return s;
  }

  function isObj(v) { return !!v && typeof v === 'object' && !Array.isArray(v); }

  /**
   * 型別修復（資安審查 F-01）：存檔碼可以被手動改過，欄位型別和預設值不同時改回預設值，
   * 避免遊戲進行到一半丟出例外而卡住。只檢查 createNewState 定義過的欄位；
   * 預設是 null 的欄位（equipment.weapon、pendingVariant…）不在這裡處理。
   */
  function repairTypes(target, defaults, path) {
    Object.keys(defaults).forEach(function (k) {
      var dv = defaults[k], tv = target[k];
      var p = path ? path + '.' + k : k;
      if (dv === null) return;
      // 字典型欄位（背包、委託…）：只檢查整體是不是物件，不逐鍵補預設值；
      // 各筆的值由 dropBadEntries 檢查（審查 F-06：否則用完被刪掉的道具會被補回預設數量）
      if (State.DICT_KEYS.indexOf(p) >= 0) { if (!isObj(tv)) target[k] = JSON.parse(JSON.stringify(dv)); return; }
      var bad = Array.isArray(dv) ? !Array.isArray(tv)
        : isObj(dv) ? !isObj(tv)
          : typeof dv === 'number' ? !(typeof tv === 'number' && isFinite(tv))
            : typeof tv !== typeof dv;
      if (bad) target[k] = (dv && typeof dv === 'object') ? JSON.parse(JSON.stringify(dv)) : dv;
      else if (isObj(dv)) repairTypes(tv, dv, p);
    });
    return target;
  }

  /** 以 id 為鍵的表：值的型別不對就刪掉那一筆 */
  function dropBadEntries(map, ok) {
    Object.keys(map).forEach(function (k) { if (!ok(map[k])) delete map[k]; });
  }

  function repairState(s) {
    var defaults = State.createNewState(s.player.name, s.player.gender, 0);
    repairTypes(s, defaults);
    dropBadEntries(s.inventory, function (v) { return typeof v === 'number' && isFinite(v) && v >= 0; });
    dropBadEntries(s.startItems, function (v) { return typeof v === 'number' && isFinite(v) && v >= 0; });
    dropBadEntries(s.quests, function (v) { return isObj(v) && typeof v.status === 'string'; });
    dropBadEntries(s.stats.subjects, isObj);
    dropBadEntries(s.adaptive.units, isObj);
    dropBadEntries(s.stats.units, isObj);
    if (!s.daily.tasks.every(function (t) { return isObj(t) && Array.isArray(t.seen); })) { s.daily.tasks = []; s.daily.date = ''; }
    ['location', 'lastInn'].forEach(function (k) { if (s[k] !== null && !(isObj(s[k]) && typeof s[k].map === 'string')) s[k] = null; });
    if (s.pendingVariant !== null && !isObj(s.pendingVariant)) s.pendingVariant = null;
    repairJobs(s);
    return s;
  }

  function num(v) { return typeof v === 'number' && isFinite(v); }
  function int(v, min, dflt) { return num(v) ? Math.max(min, Math.floor(v)) : dflt; }
  /**
   * v1.0（夜班審查第 7 點）：職業、保底、技能欄、立志小考的每一筆都檢查型別，壞掉的改成安全值（不會算出 NaN）。
   * - player.level／exp：數字（等級 ≥1、經驗 ≥0）；player.job 不是字串 → 見習
   * - player.jobs：{ 職業: {lv ≥1 整數, exp ≥0} }，不是物件的那一筆刪掉；一定有 novice；目前職業和 level／exp 一致
   * - player.floor：只留 hp／mp／atk／def 的有限數字（≥0）
   * - player.skillSlots：null 或字串陣列
   * - trial：{ 職業: {lastFailDate 字串, tries ≥0, lastQ 字串陣列, inProgress null 或 {at, date}, passedAt ≥0} }
   * - trialLog：陣列，只留物件
   */
  function repairJobs(s) {
    var p = s.player;
    p.level = int(p.level, 1, 1);
    p.exp = int(p.exp, 0, 0);
    if (typeof p.job !== 'string' || !p.job) p.job = 'novice';
    if (!isObj(p.jobs)) p.jobs = {};
    Object.keys(p.jobs).forEach(function (k) {
      var r = p.jobs[k];
      if (!isObj(r)) { delete p.jobs[k]; return; }
      p.jobs[k] = { lv: int(r.lv, 1, 1), exp: int(r.exp, 0, 0) };
    });
    if (!p.jobs.novice) p.jobs.novice = { lv: p.job === 'novice' ? p.level : 1, exp: p.job === 'novice' ? p.exp : 0 };
    p.jobs[p.job] = { lv: p.level, exp: p.exp };
    var fl = isObj(p.floor) ? p.floor : {};
    p.floor = {};
    ['hp', 'mp', 'atk', 'def'].forEach(function (k) { if (num(fl[k]) && fl[k] > 0) p.floor[k] = fl[k]; });
    if (p.skillSlots !== null && !(Array.isArray(p.skillSlots) && p.skillSlots.every(function (x) { return typeof x === 'string'; }))) p.skillSlots = null;
    if (!isObj(s.trial)) s.trial = {};
    Object.keys(s.trial).forEach(function (k) {
      var r = s.trial[k];
      if (!isObj(r)) { delete s.trial[k]; return; }
      var ip = isObj(r.inProgress) ? { at: int(r.inProgress.at, 0, 0), date: typeof r.inProgress.date === 'string' ? r.inProgress.date : '' } : null;
      s.trial[k] = {
        lastFailDate: typeof r.lastFailDate === 'string' ? r.lastFailDate : '',
        tries: int(r.tries, 0, 0),
        lastQ: Array.isArray(r.lastQ) ? r.lastQ.filter(function (x) { return typeof x === 'string'; }) : [],
        inProgress: ip,
        passedAt: int(r.passedAt, 0, 0)
      };
    });
    s.trialLog = Array.isArray(s.trialLog) ? s.trialLog.filter(isObj) : [];
  }

  /** 舊版本存檔升級＋補預設值 */
  function migrate(s) {
    if (s.version === 1) migrateV1toV2(s);
    // v1.0 第一批（48 號第 5 節）：v2 → v3 職業資料（等級換算、遷移保底、法袍換成同價防具）；要在補預設值之前
    if (JobMigrate.needs(s)) JobMigrate.migrate(s);
    State.migrateAudio(s.settings);   // v0.9.3 語速：舊的預設 1 倍 → 新的預設「稍快」（要在補預設值之前）
    var defaults = State.createNewState(s.player && s.player.name, s.player && s.player.gender, s.createdAt || 0);
    State.fillDefaults(s, defaults);
    repairState(s);
    Bestiary.backfill(s);   // v0.4 怪物名冊：舊存檔把已淨化的頭目補記為遇見、打倒各 1 次
    State.trimStart(s);     // v0.9.2 舊存檔沒有 startItems：以建立角色時的初始配置推定，但不超過現在背包裡的數量
    s.player.name = State.cleanName(s.player.name);
    s.player.gender = State.cleanGender(s.player.gender);
    s.version = State.SCHEMA_VERSION;
    return s;
  }

  function serialize(state) { return JSON.stringify(state); }

  function save(storage, state) {
    try { storage.setItem(SAVE_KEY, serialize(state)); return true; } catch (e) { return false; }
  }

  function load(storage) {
    var raw;
    try { raw = storage.getItem(SAVE_KEY); } catch (e) { return null; }
    if (!raw) return null;
    try {
      var s = JSON.parse(raw);
      if (validateState(s)) return null;
      return migrate(s);
    } catch (e) { return null; }
  }

  function hasSave(storage) {
    try { return !!storage.getItem(SAVE_KEY); } catch (e) { return false; }
  }

  function clear(storage) {
    try { storage.removeItem(SAVE_KEY); } catch (e) { /* 忽略 */ }
  }

  function exportCode(state) {
    var b64 = utf8ToBase64(serialize(state));
    return CODE_PREFIX + '-' + b64 + '-' + fnv1a(b64);
  }

  /** 回傳 {ok:true, state} 或 {ok:false, error} */
  function importCode(code) {
    if (typeof code !== 'string') return { ok: false, error: '存檔碼是空的' };
    if (code.length > MAX_CODE_LEN) return { ok: false, error: '存檔碼太長了，不像是勇者大冒險的存檔碼' };
    var c = code.replace(/\s+/g, '');
    if (!c) return { ok: false, error: '存檔碼是空的' };
    var parts = c.split('-');
    if (parts.length !== 3 || parts[0] !== CODE_PREFIX) return { ok: false, error: '這不是勇者大冒險的存檔碼' };
    var b64 = parts[1], sum = parts[2].toUpperCase();
    if (!/^[A-Za-z0-9+/]+={0,2}$/.test(b64)) return { ok: false, error: '存檔碼有奇怪的字元' };
    if (fnv1a(b64) !== sum) return { ok: false, error: '存檔碼不完整或抄錯了（校驗碼不符）' };
    var obj;
    try { obj = JSON.parse(base64ToUtf8(b64)); } catch (e) { return { ok: false, error: '存檔碼內容壞掉了' }; }
    var err = validateState(obj);
    if (err) return { ok: false, error: err };
    try { return { ok: true, state: migrate(obj) }; } catch (e) { return { ok: false, error: '存檔碼內容壞掉了' }; }
  }

  /**
   * v1.0（夜班審查）：舊存檔升級失敗時給畫面看的說明。原本的存檔不會被動到（遷移前也另外備份一份）。
   */
  var MIGRATE_FAIL = '舊存檔升級失敗（原本的存檔還在，請先請家長產生存檔碼）';
  /** 存檔字串讀得進來嗎：格式、結構，再拿「複本」試跑一次升級（不改原本的資料）。回傳錯誤說明或 '' */
  function checkRaw(raw) {
    var obj;
    try { obj = JSON.parse(raw); } catch (e) { return '存檔內容壞掉了'; }
    var err = validateState(obj);
    if (err) return err;
    try { migrate(JSON.parse(raw)); } catch (e) { return MIGRATE_FAIL; }
    return '';
  }
  /** 讀取失敗原因（給畫面提示「存檔無法讀取，要重新開始嗎？」用）；'' 代表正常或沒有存檔 */
  function loadError(storage) {
    var raw;
    try { raw = storage.getItem(SAVE_KEY); } catch (e) { return '瀏覽器不允許讀取存檔'; }
    if (!raw) return '';
    return checkRaw(raw);
  }

  var Save = { repairJobs: repairJobs, MIGRATE_FAIL: MIGRATE_FAIL, checkRaw: checkRaw, KEY_PREFIX: KEY_PREFIX, LEGACY_SAVE_KEY: LEGACY_SAVE_KEY, MAX_CODE_LEN: MAX_CODE_LEN, repairState: repairState, loadError: loadError, migrateV1toV2: migrateV1toV2, SAVE_KEY: SAVE_KEY, CODE_PREFIX: CODE_PREFIX, fnv1a: fnv1a, utf8ToBase64: utf8ToBase64, base64ToUtf8: base64ToUtf8, validateState: validateState, migrate: migrate, save: save, load: load, hasSave: hasSave, clear: clear, exportCode: exportCode, importCode: importCode };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.Save = Save; }
  if (typeof module !== 'undefined') module.exports = Save;
})();
