/*
 * v3.0 南部（70_v3.0南部實作規格.md 第五節）：舊存檔（schema 6 以前）→ v7（本檔由 wip_v30_draft/v30_apply.js 產生；TARGET＝套用時的 SCHEMA_VERSION＋1）
 *
 * 在 Save.migrate 裡、Ch3Migrate 之後、補預設值之前呼叫；只在 s.version < 7 時跑。只新增、不刪除，全部可重複執行，結果相同。
 *   1. Q_TUT_3 已完成、Q_ORC_4 不是完成 → s.legacySouth = true（舊南部旗標）
 *   2. Q_TUT_3 已完成 → visited.M04、M10（舊版這時就能搭車去）；Q_GNO_4、Q_GOB_4 都完成 → visited.M08
 *   3. 已經接了的精靈鏈、獸人鏈紀錄照留（questlog 不重查前置）；有舊南部旗標時，Q_ELF_1、Q_ELF_4、Q_ORC_1、Q_ORC_4 用 quests.js 的 legacy_requires（舊前置）
 *   4. 打倒過遺忘霧魔或看過舊結局（ending）→ Q_FINAL 算完成；補發南之曙光碎片 dawn_shard_s；Q_V1_FOG 就能接（霧仔可以來加入）
 *   5. Q_LAMPS 退役：五道光都拿到 → 五盞燈全亮、Q_LAMPS 標完成；只拿到自然／社會之光的 → 那盞燈直接點亮（新規則：拿到光就自動點燈）
 *   6. 做了 1–5 任何一條 → s.migratedSouth（讀檔進地圖後由 game.js 播一次 D_MIGRATE_SOUTH，看完才清掉）
 * 舊南部旗標有作用時（Q_ORC_4 還沒完成）：M04、M08、M10、M11 的怪物有 legacy_s 的用舊數值、地名旁顯示舊的建議等級、地圖係數用舊等級。
 *   新地圖（M21–M25）不受影響。新遊戲永遠是 false。
 */
(function () {
  'use strict';
  var TARGET = 7;
  var LEGACY_MAPS = ['M04', 'M08', 'M10', 'M11'];
  var LEGACY_REC = { M04: [5, 8], M08: [14, 17], M10: [16, 19], M11: [18, 20] };   // v1.3 的建議等級（mapinfo.js REC_LEVEL 改版前）
  var LEGACY_LEVEL = { M04: 2, M08: 4, M10: 4, M11: 5 };   // v2.0 的地圖等級（World.mapCoef 用）
  var SUBJ = ['國語', '英語', '數學', '自然', '社會'], AUTO = ['自然', '社會'];

  function isObj(v) { return !!v && typeof v === 'object' && !Array.isArray(v); }
  function rec(s, id) { var r = s.quests && s.quests[id]; return isObj(r) && typeof r.status === 'string' ? r : null; }
  function done(s, id) { var r = rec(s, id); return !!(r && r.status === 'done'); }
  function needs(s) { return !!(s && s.player && !(s.version >= TARGET)); }
  function lampsAllOn(s) { return SUBJ.every(function (l) { return !!(s.lamps && s.lamps[l] === true); }); }

  /** s＝舊存檔（還沒補預設值）。直接改 s，回傳遷移紀錄 */
  function migrate(s) {
    var out = { from: s.version, legacySouth: false, visited: [], final: false, shard: false, lamps: [], lampsDone: false };
    ['visited', 'quests', 'lamps', 'lights', 'bosses'].forEach(function (k) { if (!isObj(s[k])) s[k] = {}; });   // 背包不在這裡補（完全沒有背包的存檔，補預設值時才給新手道具；審查 F-06）
    var tut3 = done(s, 'Q_TUT_3');
    if (tut3 && !done(s, 'Q_ORC_4') && s.legacySouth !== true) { s.legacySouth = true; out.legacySouth = true; }
    var vis = tut3 ? ['M04', 'M10'] : [];
    if (done(s, 'Q_GNO_4') && done(s, 'Q_GOB_4')) vis.push('M08');
    vis.forEach(function (m) { if (s.visited[m] !== true) { s.visited[m] = true; out.visited.push(m); } });
    if ((s.ending === true || s.bosses.fog_demon === true) && !done(s, 'Q_FINAL')) { s.quests.Q_FINAL = { status: 'done', progress: 0 }; out.final = true; }
    if (done(s, 'Q_FINAL') && isObj(s.inventory) && !(Number(s.inventory.dawn_shard_s) > 0)) { s.inventory.dawn_shard_s = 1; out.shard = true; }
    if (SUBJ.every(function (l) { return s.lights[l] === true; })) SUBJ.forEach(function (l) { if (s.lamps[l] !== true) { s.lamps[l] = true; out.lamps.push(l); } });
    AUTO.forEach(function (l) { if (s.lights[l] === true && s.lamps[l] !== true) { s.lamps[l] = true; out.lamps.push(l); } });
    if (lampsAllOn(s) && !done(s, 'Q_LAMPS')) { s.quests.Q_LAMPS = { status: 'done', progress: (rec(s, 'Q_LAMPS') || {}).progress || 0 }; out.lampsDone = true; }
    if ((out.legacySouth || out.visited.length || out.final || out.shard || out.lamps.length || out.lampsDone) && !isObj(s.migratedSouth)) s.migratedSouth = out;
    return out;
  }

  /** 舊南部旗標有沒有作用：有旗標、獸人鏈的頭目 Q_ORC_4 還沒完成 */
  function legacyActive(state) { return !!(state && state.legacySouth === true && !done(state, 'Q_ORC_4')); }
  /** 這場戰鬥要不要用舊數值：旗標有作用、怪物有 legacy_s、而且在 M04、M08、M10、M11 */
  function useLegacy(state, mon, mapId) { return !!(mon && mon.legacy_s && LEGACY_MAPS.indexOf(mapId) >= 0 && legacyActive(state)); }
  /** 組戰鬥用的怪物資料：要用舊數值時回傳合併後的複本，不改 monsters.js 本身 */
  function battleMonster(state, mon, mapId) { return useLegacy(state, mon, mapId) ? Object.assign({}, mon, mon.legacy_s) : mon; }
  /** 怪物名冊顯示用（等級）：有 legacy_s 的怪只在舊南部的四張圖出沒 */
  function displayMonster(state, mon) { return mon && mon.legacy_s && legacyActive(state) ? Object.assign({}, mon, mon.legacy_s) : mon; }
  /** 地名旁的建議等級：舊路線顯示 v1.3 的等級；其他情形回傳 null（照原本的表） */
  function legacyRec(state, mapId) { return legacyActive(state) && LEGACY_REC[mapId] ? LEGACY_REC[mapId].slice() : null; }
  /** 地圖係數用的等級（World.mapCoef）：舊路線照 v2.0 的地圖等級 */
  function mapLevel(state, mapId, lv) { return legacyActive(state) && LEGACY_LEVEL[mapId] ? LEGACY_LEVEL[mapId] : lv; }

  var SouthMigrate = { TARGET: TARGET, LEGACY_MAPS: LEGACY_MAPS, LEGACY_REC: LEGACY_REC, LEGACY_LEVEL: LEGACY_LEVEL, needs: needs, migrate: migrate, lampsAllOn: lampsAllOn,
    legacyActive: legacyActive, useLegacy: useLegacy, battleMonster: battleMonster, displayMonster: displayMonster, legacyRec: legacyRec, mapLevel: mapLevel };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.SouthMigrate = SouthMigrate; }
  if (typeof module !== 'undefined') module.exports = SouthMigrate;
})();
