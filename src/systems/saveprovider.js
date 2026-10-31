/*
 * 存檔提供者（SaveProvider）介面
 *
 * 每個提供者都要有：
 *   id                 'local' | 'cloud' | …
 *   label              給家長看的名稱
 *   available()        → Promise<boolean>   這個提供者現在能不能用
 *   save(slot, state)  → Promise<{ok:true, savedAt}>
 *   load(slot)         → Promise<state|null>    沒有存檔回傳 null；讀到壞檔也回傳 null（不丟例外）
 *   list()             → Promise<[{slot, name, level, job, gender, savedAt}]>
 *   delete(slot)       → Promise<boolean>
 * slot 是存檔欄位名稱，預設 'main'。
 *
 * 目前只實作 LocalSaveProvider（瀏覽器 localStorage＋存檔碼）。
 * CloudSaveProvider 是空殼：研究助理查清楚兒童帳號／學校帳號／個資規定之前，不接任何 Google 服務。
 * 之後要接 Firebase 或 Google Drive，只要新增一個符合上面介面的提供者即可，遊戲其他地方不用改。
 */
(function () {
  'use strict';
  var isNode = typeof module !== 'undefined' && typeof require === 'function';
  var Save = isNode ? require('./save.js') : window.JQ.Save;

  var METHODS = ['available', 'save', 'load', 'list', 'delete'];
  var DEFAULT_SLOT = 'main';

  /** 檢查物件是否符合 SaveProvider 介面；回傳缺少的方法名稱陣列 */
  function missingMethods(p) {
    return METHODS.filter(function (m) { return !p || typeof p[m] !== 'function'; });
  }

  function keyFor(slot) {
    slot = slot || DEFAULT_SLOT;
    return slot === DEFAULT_SLOT ? Save.SAVE_KEY : Save.SAVE_KEY + ':' + slot;
  }
  /**
   * v1.0（夜班審查）：舊版存檔（schema 3 以前）升級前的備份 key：bq_save_v2_backup（其他欄位 bq_save_v2_backup:<欄位>）。
   * 不是 bq_save 或 bq_save:<欄位>，所以 list() 不會把它當成存檔欄位。
   */
  var BACKUP_KEY = Save.SAVE_KEY + '_v2_backup';
  /**
   * v1.1 第一章：v1.0.x（schema 3）存檔在 Ch1Migrate 升到 schema 4 之前的備份 key：bq_save_v3_backup（其他欄位 bq_save_v3_backup:<欄位>）。
   * 規則同 v2 備份：只寫一次、不覆蓋、list() 不列。schema 3 以前的存檔照舊只寫 v2 備份（那份就是升級前的原檔）。
   */
  var BACKUP_V3_KEY = Save.SAVE_KEY + '_v3_backup';
  /**
   * v1.3 台北章（CTO 2026-10-25 裁定）：v1.1／v1.2（schema 4）存檔在 Ch3Migrate 升到 schema 5 之前的備份 key：bq_save_v4_backup（其他欄位 bq_save_v4_backup:<欄位>）。
   * 規則同 v3 備份：只寫一次、不覆蓋、list() 不列。schema 3 的存檔照舊只寫 v3 備份（那份就是升級前的原檔）。
   */
  var BACKUP_V4_KEY = Save.SAVE_KEY + '_v4_backup';
  /**
   * v2.0 新經濟（67 號 5.2）：v1.3～v1.4（schema 5）存檔在 EconMigrate 升到 schema 6 之前的備份 key：bq_save_v5_backup（其他欄位 bq_save_v5_backup:<欄位>）。
   * 規則同 v3、v4 備份：只寫一次、不覆蓋、list() 不列。
   */
  var BACKUP_V5_KEY = Save.SAVE_KEY + '_v5_backup';
  /** which：省略＝v2 備份（v1.0.1 家長設定的還原按鈕）；'v3'＝v1.1 升級前備份 */
  function backupKeyFor(slot, which) {
    slot = slot || DEFAULT_SLOT;
    var base = which === 'v5' ? BACKUP_V5_KEY : which === 'v4' ? BACKUP_V4_KEY : which === 'v3' ? BACKUP_V3_KEY : BACKUP_KEY;   // v1.3：'v4'＝v1.3 升級前備份
    return slot === DEFAULT_SLOT ? base : base + ':' + slot;
  }

  function summary(slot, s) {
    return { slot: slot, name: s.player.name, level: s.player.level, job: s.player.job, gender: s.player.gender, savedAt: s.savedAt || 0 };
  }

  /** 列出 storage 裡所有的 key（真的 localStorage 或測試用的假 storage） */
  function allKeys(st) {
    var keys = [];
    try {
      if (typeof st.length === 'number' && typeof st.key === 'function') {
        for (var i = 0; i < st.length; i++) keys.push(st.key(i));
      } else if (st._m) keys = Object.keys(st._m);
    } catch (e) { keys = []; }
    return keys;
  }

  /**
   * 舊 key 搬家：「jinshan-quest-save」與「jinshan-quest-save:<欄位>」→「bq_save」與「bq_save:<欄位>」，搬完刪掉舊 key。
   * 新 key 已經有資料時不覆蓋（只刪舊 key 前先確認新 key 有東西）。
   * 只碰這兩種舊 key，絕不讀寫或清除其他程式（其他前綴）的 key。回傳搬了幾筆。
   */
  function migrateLegacyKeys(st) {
    var moved = 0, L = Save.LEGACY_SAVE_KEY;
    allKeys(st).forEach(function (k) {
      if (k !== L && k.indexOf(L + ':') !== 0) return;
      try {
        var nk = Save.SAVE_KEY + k.slice(L.length);
        var val = st.getItem(k);
        if (val === null) return;
        if (st.getItem(nk) === null) { st.setItem(nk, val); moved++; }
        if (st.getItem(nk) !== null) st.removeItem(k);
      } catch (e) { /* 空間不足或不允許：保留舊 key，下次再試 */ }
    });
    return moved;
  }

  /** storage：localStorage 或測試用的假 storage；now：取得時間的函式（測試可固定） */
  function LocalSaveProvider(storage, now) {
    this.id = 'local';
    this.label = '這台裝置（瀏覽器）';
    this.storage = storage;
    this.now = now || function () { return Date.now(); };
  }
  LocalSaveProvider.prototype.available = function () {
    var st = this.storage;
    return Promise.resolve((function () {
      try { var k = Save.SAVE_KEY + ':__probe'; st.setItem(k, '1'); st.removeItem(k); return true; } catch (e) { return false; }
    })());
  };
  LocalSaveProvider.prototype.save = function (slot, state) {
    var self = this;
    return new Promise(function (resolve, reject) {
      state.savedAt = self.now();
      try { self.storage.setItem(keyFor(slot), JSON.stringify(state)); resolve({ ok: true, savedAt: state.savedAt }); }
      catch (e) { reject(new Error('瀏覽器空間不足或不允許存檔')); }
    });
  };
  LocalSaveProvider.prototype.load = function (slot) {
    var st = this.storage;
    return Promise.resolve((function () {
      var raw;
      try { raw = st.getItem(keyFor(slot)); } catch (e) { return null; }
      if (!raw) return null;
      try {
        var obj = JSON.parse(raw);
        if (Save.validateState(obj)) return null;
        // 升級前先備份原本的字串（只寫一次：已經有備份就不覆蓋；寫不進去也照樣讀）
        if (!(obj.version >= 3)) {
          try { if (st.getItem(backupKeyFor(slot)) === null) st.setItem(backupKeyFor(slot), raw); } catch (e) { /* 空間不足：不擋讀檔 */ }
        } else if (obj.version === 3) {   // v1.1：Ch1Migrate（3 → 4）之前也備份一份
          try { if (st.getItem(backupKeyFor(slot, 'v3')) === null) st.setItem(backupKeyFor(slot, 'v3'), raw); } catch (e) { /* 空間不足：不擋讀檔 */ }
        } else if (obj.version === 4) {   // v1.3：Ch3Migrate（4 → 5）之前也備份一份
          try { if (st.getItem(backupKeyFor(slot, 'v4')) === null) st.setItem(backupKeyFor(slot, 'v4'), raw); } catch (e) { /* 空間不足：不擋讀檔 */ }
        } else if (obj.version === 5) {   // v2.0 新經濟：EconMigrate（5 → 6）之前也備份一份
          try { if (st.getItem(backupKeyFor(slot, 'v5')) === null) st.setItem(backupKeyFor(slot, 'v5'), raw); } catch (e) { /* 空間不足：不擋讀檔 */ }
        }
        return Save.migrate(obj);
      } catch (e) { return null; }   // 升級失敗：回傳 null，loadError 會說明原因；原本的存檔不動
    })());
  };
  /** 讀不進來的原因（'' ＝正常或沒有存檔）。格式對、但升級失敗時回傳 Save.MIGRATE_FAIL（拿複本試跑，不改原本的資料） */
  LocalSaveProvider.prototype.loadError = function (slot) {
    var raw;
    try { raw = this.storage.getItem(keyFor(slot)); } catch (e) { return Promise.resolve('瀏覽器不允許讀取存檔'); }
    if (!raw) return Promise.resolve('');
    return Promise.resolve(Save.checkRaw(raw));
  };
  /** v1.0.1：有沒有「升級前（v0.9）」的備份（家長設定的還原按鈕用） */
  LocalSaveProvider.prototype.hasBackup = function (slot, which) {
    try { return Promise.resolve(this.storage.getItem(backupKeyFor(slot, which)) !== null); } catch (e) { return Promise.resolve(false); }
  };
  /**
   * v1.0.1：把升級前的備份放回存檔欄位（重新整理後會照常再升級一次）。備份本身留著，不刪。which＝'v3' 時用 v1.1 升級前備份
   * 回傳 Promise<{ok}>；沒有備份或寫不進去回 {ok:false, reason}
   */
  LocalSaveProvider.prototype.restoreBackup = function (slot, which) {
    var st = this.storage;
    return Promise.resolve((function () {
      var raw;
      try { raw = st.getItem(backupKeyFor(slot, which)); } catch (e) { return { ok: false, reason: 'read' }; }
      if (raw === null) return { ok: false, reason: 'none' };
      try { st.setItem(keyFor(slot), raw); } catch (e) { return { ok: false, reason: 'write' }; }
      return { ok: true };
    })());
  };
  LocalSaveProvider.prototype.list = function () {
    var st = this.storage, out = [];
    allKeys(st).forEach(function (k) {   // 只看 bq_save 開頭的 key
      if (k !== Save.SAVE_KEY && k.indexOf(Save.SAVE_KEY + ':') !== 0) return;
      if (/:__probe$/.test(k)) return;
      var slot = k === Save.SAVE_KEY ? DEFAULT_SLOT : k.slice(Save.SAVE_KEY.length + 1);
      try {
        var s = JSON.parse(st.getItem(k));
        if (!Save.validateState(s)) out.push(summary(slot, s));
      } catch (e) { /* 壞檔不列出 */ }
    });
    return Promise.resolve(out);
  };
  LocalSaveProvider.prototype['delete'] = function (slot) {
    var st = this.storage;
    return Promise.resolve((function () {
      try { var had = !!st.getItem(keyFor(slot)); st.removeItem(keyFor(slot)); return had; } catch (e) { return false; }
    })());
  };
  // 存檔碼（只有本機提供者需要；雲端版不需要）
  LocalSaveProvider.prototype.exportCode = function (state) { return Save.exportCode(state); };
  LocalSaveProvider.prototype.importCode = function (code) { return Save.importCode(code); };

  /**
   * 雲端存檔空殼（準備中）。所有方法都回傳失敗，不會連到任何網路服務。
   * 之後接 Firebase / Google Drive 時，在這裡（或新檔案）實作同樣的介面。
   */
  function CloudSaveProvider() {
    this.id = 'cloud';
    this.label = 'Google 帳號（準備中）';
  }
  function notReady() { return Promise.reject(new Error('雲端存檔還在準備中')); }
  CloudSaveProvider.prototype.available = function () { return Promise.resolve(false); };
  CloudSaveProvider.prototype.save = notReady;
  CloudSaveProvider.prototype.load = notReady;
  CloudSaveProvider.prototype.list = notReady;
  CloudSaveProvider.prototype['delete'] = notReady;

  var SaveProvider = { BACKUP_KEY: BACKUP_KEY, BACKUP_V3_KEY: BACKUP_V3_KEY, BACKUP_V4_KEY: BACKUP_V4_KEY, BACKUP_V5_KEY: BACKUP_V5_KEY, backupKeyFor: backupKeyFor, migrateLegacyKeys: migrateLegacyKeys, METHODS: METHODS, DEFAULT_SLOT: DEFAULT_SLOT, missingMethods: missingMethods, keyFor: keyFor, LocalSaveProvider: LocalSaveProvider, CloudSaveProvider: CloudSaveProvider };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.SaveProvider = SaveProvider; }
  if (typeof module !== 'undefined') module.exports = SaveProvider;
})();
