/*
 * v1.1 第一章（59_v1.1第一章實作規格.md 第五節）：舊存檔（schema v3 以前，v1.0.x）→ v4
 *
 * 在 Save.migrate 裡、JobMigrate 之後、補預設值之前呼叫；只在 s.version < 4 時跑
 * （存檔碼本來就保留 version，用存檔碼還原的 v1.1 存檔不會再跑一次）。
 *
 * 只新增、不刪除：不改等級、經驗、金幣、道具、職業、光、頭目紀錄、位置。全部可重複執行，結果相同。
 *   1. visited.M09 = true（舊版九份一開始就能搭車去；世界地圖 R_SHANCHENG 改成 unlock_visit: "M09" 後保留這個行為）。
 *   2. 有 quests.Q_LAMPS（進行中或完成）或國語、英語兩道光都拿到了 → quests.Q_LAMPS_3 = { status: 'done' }
 *      （同時記 chapter 至少 1：Q_LAMPS_3 完成＝第一章完成，和正常完成時一致）。
 *   3. Q_MER_3 已完成、Q_MER_4 沒有紀錄、Q_JGS_1 沒有紀錄 → quests.Q_MER_4 = { status: 'active', progress: 0 }
 *      （等於幫孩子接好委託；新規則 Q_MER_4 要先做金瓜石 Q_JGS_1，舊存檔不用回頭）。
 *   4. 留下紀錄 s.migratedCh1，讀檔進地圖後由 game.js 播一次旁白 D_MIGRATE_CH1（看完才清掉）。
 *      v1.1 第二段試玩建議 S6：原規格只在做了 2 或 3 時播；改成「只要是舊存檔升到 4 就播一次」——
 *      沒補委託的孩子（例：只做完新手教學、已拿到英語之光但哥布林鏈沒做、站在 M01 舊出口）最需要知道多了竹子湖、基隆港、金瓜石。
 * 回傳遷移紀錄：{ from, visitedM09, lamps3, mer4 }
 */
(function () {
  'use strict';
  var TARGET = 4;

  function isObj(v) { return !!v && typeof v === 'object' && !Array.isArray(v); }
  function rec(s, id) { var r = s.quests[id]; return isObj(r) && typeof r.status === 'string' ? r : null; }

  /** 只看版本號（同 JobMigrate.needs） */
  function needs(s) { return !!(s && s.player && !(s.version >= TARGET)); }

  /** s＝舊存檔（還沒補預設值）。直接改 s，回傳遷移紀錄 */
  function migrate(s) {
    var out = { from: s.version, visitedM09: false, lamps3: false, mer4: false };
    // 字典型欄位不是物件時，補預設值（repairTypes）會整個換成 {}：先換掉，才不會把這裡加的東西洗掉
    if (!isObj(s.visited)) s.visited = {};
    if (!isObj(s.quests)) s.quests = {};
    // 1. 九份算去過
    if (s.visited.M09 !== true) { s.visited.M09 = true; out.visitedM09 = true; }
    // 2. 已經在點五盞燈（或做完），或兩道光都拿到 → 第一章的點燈算完成
    var L = isObj(s.lights) ? s.lights : {};
    if (!rec(s, 'Q_LAMPS_3') && (rec(s, 'Q_LAMPS') || (L['國語'] === true && L['英語'] === true))) {
      s.quests.Q_LAMPS_3 = { status: 'done' };
      out.lamps3 = true;
    }
    if (rec(s, 'Q_LAMPS_3') && rec(s, 'Q_LAMPS_3').status === 'done' && !(typeof s.chapter === 'number' && s.chapter >= 1)) s.chapter = 1;
    // 3. 商人鏈做到 Q_MER_3、還沒接章魚 → 直接接好 Q_MER_4（不用先去金瓜石）
    var m3 = rec(s, 'Q_MER_3');
    if (m3 && m3.status === 'done' && !rec(s, 'Q_MER_4') && !rec(s, 'Q_JGS_1')) {
      s.quests.Q_MER_4 = { status: 'active', progress: 0 };
      out.mer4 = true;
    }
    // 4. 讀檔後的說明（舊存檔升級一律播一次；已經有紀錄就不覆蓋）
    if (!isObj(s.migratedCh1)) s.migratedCh1 = out;
    return out;
  }

  var Ch1Migrate = { TARGET: TARGET, needs: needs, migrate: migrate };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.Ch1Migrate = Ch1Migrate; }
  if (typeof module !== 'undefined') module.exports = Ch1Migrate;
})();
