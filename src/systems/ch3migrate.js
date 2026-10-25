/*
 * v1.3 台北章（62_v1.3台北章實作規格.md 第五節）：舊存檔（schema v4 以前，v1.1／v1.2）→ v5
 *
 * 在 Save.migrate 裡、Ch1Migrate 之後、補預設值之前呼叫；只在 s.version < 5 時跑
 * （存檔碼本來就保留 version，用存檔碼還原的 v1.3 存檔不會再跑一次）。
 *
 * 只新增、不刪除：不改等級、經驗、金幣、道具、職業、光、頭目紀錄、位置。全部可重複執行，結果相同。
 *   1. Q_ELF_4 已完成 → visited.M05 = true（舊版拿到自然之光就能搭車去紅樹林，保留這個行為）。
 *   2. Q_ELF_4 已完成、Q_GNO_1 沒有紀錄 → quests.Q_GNO_1 = { status: 'active', progress: 0 }（不用先走完台北章）。
 *   3. 有 quests.Q_LAMPS（進行中或完成）或數學燈已經亮 → quests.Q_LAMPS_MATH = { status: 'done' }。
 *   4. Q_ELF_4 已完成、Q_GNO_4 還沒完成 → s.legacyM05 = true（舊紅樹林旗標，62 號 5.4 節）。
 *   5. 做了 1–4 任何一條 → 留下 s.migratedCh3，讀檔進地圖後由 game.js 播一次 D_MIGRATE_CH3（看完才清掉）。
 *
 * 舊紅樹林旗標（62 號 5.4 節）：有旗標、地精鏈還沒做完（Q_GNO_4 沒完成）時，紅樹林（M05）的泥泥怪、招潮蟹、泥巴大蛙
 *   用 monsters.js 的 legacy 數值（v1.2 上線的數字）；Q_GNO_4 完成時 QuestLog.complete 把旗標關掉。新遊戲永遠是 false。
 * 回傳遷移紀錄：{ from, visitedM05, gno1, lampsMath, legacyM05 }
 */
(function () {
  'use strict';
  var TARGET = 5;
  var LEGACY_MAP = 'M05';
  var LEGACY_REC = [9, 12];   // 舊路線紅樹林顯示的建議等級（v1.2 的 REC_LEVEL.M05）

  function isObj(v) { return !!v && typeof v === 'object' && !Array.isArray(v); }
  function rec(s, id) { var r = s.quests[id]; return isObj(r) && typeof r.status === 'string' ? r : null; }
  function done(s, id) { var r = rec(s, id); return !!(r && r.status === 'done'); }

  /** 只看版本號（同 Ch1Migrate.needs） */
  function needs(s) { return !!(s && s.player && !(s.version >= TARGET)); }

  /** s＝舊存檔（還沒補預設值）。直接改 s，回傳遷移紀錄 */
  function migrate(s) {
    var out = { from: s.version, visitedM05: false, gno1: false, lampsMath: false, legacyM05: false };
    // 字典型欄位不是物件時，補預設值（repairTypes）會整個換成 {}：先換掉，才不會把這裡加的東西洗掉
    if (!isObj(s.visited)) s.visited = {};
    if (!isObj(s.quests)) s.quests = {};
    var elf4 = done(s, 'Q_ELF_4');
    // 1. 拿到自然之光的孩子：紅樹林算去過（照樣能搭車去）
    if (elf4 && s.visited.M05 !== true) { s.visited.M05 = true; out.visitedM05 = true; }
    // 2. 還沒開始地精鏈：直接接好 Q_GNO_1（新規則要先做完北投 Q_BT_2，舊存檔不用回頭）
    if (elf4 && !rec(s, 'Q_GNO_1')) { s.quests.Q_GNO_1 = { status: 'active', progress: 0 }; out.gno1 = true; }
    // 3. 已經在點五盞燈（或做完），或數學燈已經亮 → 點數學燈算完成
    var L = isObj(s.lamps) ? s.lamps : {};
    if (!rec(s, 'Q_LAMPS_MATH') && (rec(s, 'Q_LAMPS') || L['數學'] === true)) {
      s.quests.Q_LAMPS_MATH = { status: 'done' };
      out.lampsMath = true;
      // 第二章也做完的話，記成完成到第三章（和正常完成 Q_LAMPS_MATH 時一致）；沒做第二章的不動
      if (done(s, 'Q_YL_5') && typeof s.chapter === 'number' && s.chapter >= 2 && s.chapter < 3) s.chapter = 3;
    }
    // 4. 地精鏈做到一半（或還沒開始）的舊路線：紅樹林照 v1.2 的數值打到地精鏈完成
    if (elf4 && !done(s, 'Q_GNO_4') && s.legacyM05 !== true) { s.legacyM05 = true; out.legacyM05 = true; }
    // 5. 讀檔後的說明（做了任何一條才播；已經有紀錄就不覆蓋）
    if ((out.visitedM05 || out.gno1 || out.lampsMath || out.legacyM05) && !isObj(s.migratedCh3)) s.migratedCh3 = out;
    return out;
  }

  /** 舊紅樹林旗標有沒有作用：有旗標、地精鏈的頭目 Q_GNO_4 還沒完成 */
  function legacyActive(state) {
    if (!state || state.legacyM05 !== true) return false;
    var r = state.quests && state.quests.Q_GNO_4;
    return !(r && r.status === 'done');
  }
  /** 這場戰鬥要不要用舊數值：旗標有作用、怪物有 legacy、而且是在紅樹林（M05） */
  function useLegacy(state, mon, mapId) { return !!(mon && mon.legacy && mapId === LEGACY_MAP && legacyActive(state)); }
  /** 組戰鬥用的怪物資料（62 號 5.4 節）：要用舊數值時回傳合併後的複本，不改 monsters.js 本身 */
  function battleMonster(state, mon, mapId) { return useLegacy(state, mon, mapId) ? Object.assign({}, mon, mon.legacy) : mon; }
  /** 怪物名冊顯示用（等級）：同一個判斷（有 legacy 的怪只在紅樹林出沒） */
  function displayMonster(state, mon) { return mon && mon.legacy && legacyActive(state) ? Object.assign({}, mon, mon.legacy) : mon; }
  /** 地圖名稱旁的建議等級：舊路線的紅樹林顯示 Lv9–12；其他情形回傳 null（照原本的表） */
  function legacyRec(state, mapId) { return mapId === LEGACY_MAP && legacyActive(state) ? LEGACY_REC.slice() : null; }

  var Ch3Migrate = { TARGET: TARGET, LEGACY_MAP: LEGACY_MAP, LEGACY_REC: LEGACY_REC, needs: needs, migrate: migrate, legacyActive: legacyActive, useLegacy: useLegacy, battleMonster: battleMonster, displayMonster: displayMonster, legacyRec: legacyRec };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.Ch3Migrate = Ch3Migrate; }
  if (typeof module !== 'undefined') module.exports = Ch3Migrate;
})();
