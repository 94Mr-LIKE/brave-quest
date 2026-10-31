/*
 * v2.0 新經濟（67_經濟改版影響評估.md 第五節；老闆 2026-10-25 裁示 H1-A、L1-B）：舊存檔（schema 5 以前：v1.3、v1.3.1、v1.4…）→ 6
 *
 * 在 Save.migrate 裡、Ch3Migrate 之後、補預設值之前呼叫；只在 s.version < 6 時跑（存檔碼保留 version，用存檔碼還原的 v2.0 存檔不會再跑一次）。
 *   1. 先用舊規則結算：殘留的 player.pendingExp（v0.7～v0.9.2 的舊存檔才有）用舊升級表加上去；變化題「補回一半」（pendingVariant.bonus）歸零
 *      （新經濟委託答題不給經驗值；變化題照樣出）。
 *   2. 等級不變、能力不變（能力只看等級與職業，48 號 2.1）。每個職業（player.level／exp 和 player.jobs 的每一筆）照「這一級的進度比例」換算：
 *        新的目前經驗＝floor（舊目前經驗 ÷ 舊升級需求 × 新升級需求），最多到新升級需求 − 1（不會因為換算就升級）。
 *      舊升級需求＝round(40 × lv^1.5)（Exp.oldExpToNext）；新升級需求＝26 號升級表（Exp.expToNext）。
 *      不照總經驗值換算：舊的經驗值是新表的好幾倍（到 Lv10 累積 4,442 比 683），照總量換會一口氣升十幾級（67 號 5.1）。
 *   3. totalExp 重算＝每個職業「新表累積到目前等級＋新的目前經驗」的合計。
 *   4. 金幣、道具、裝備、委託、寶箱、頭目、名冊、題目紀錄、親密度全部不變（金幣保留＝老闆 40 號裁示）。
 *   5. 留下 s.migratedEcon，讀檔進地圖後由 game.js 播一次 D_MIGRATE_ECON（看完才清掉）。
 * 回傳遷移紀錄：{ from, jobs: { 職業: [等級, 舊經驗, 新經驗] }, pendingExp, variantBonus }
 */
(function () {
  'use strict';
  var isNode = typeof module !== 'undefined' && typeof require === 'function';
  var Exp = isNode ? require('./exp.js') : window.JQ.Exp;
  var TARGET = 6;

  function isObj(v) { return !!v && typeof v === 'object' && !Array.isArray(v); }
  function num(v) { return typeof v === 'number' && isFinite(v); }
  /** 只看版本號（同 Ch3Migrate.needs） */
  function needs(s) { return !!(s && s.player && !(s.version >= TARGET)); }
  /** 同一個等級裡的進度比例：舊表 → 新表 */
  function convert(lv, exp) {
    var L = Math.max(1, Math.floor(lv)), e = Math.max(0, Math.floor(exp));
    var oldNeed = Exp.oldExpToNext(L), newNeed = Exp.expToNext(L);
    return Math.max(0, Math.min(Math.floor(e / oldNeed * newNeed), newNeed - 1));
  }

  /** s＝舊存檔（還沒補預設值）。直接改 s，回傳遷移紀錄 */
  function migrate(s) {
    var p = s.player, rec = { from: s.version, jobs: {}, pendingExp: 0, variantBonus: 0 };
    var job = typeof p.job === 'string' && p.job ? p.job : 'novice';
    // 1. 舊規則先結算
    var pend = Number(p.pendingExp) || 0;
    if (pend > 0 && num(p.level) && num(p.exp)) { Exp.addExpWith(p, pend, Exp.oldExpToNext); rec.pendingExp = pend; }
    if (pend > 0) p.pendingExp = 0;
    if (isObj(s.pendingVariant) && Number(s.pendingVariant.bonus) > 0) { rec.variantBonus = Number(s.pendingVariant.bonus); s.pendingVariant.bonus = 0; }
    // 2. 目前職業、其他職業：照進度比例換算（等級不動）
    if (num(p.level) && num(p.exp)) {
      var ne = convert(p.level, p.exp);
      rec.jobs[job] = [Math.floor(p.level), p.exp, ne];
      p.exp = ne;
    }
    if (isObj(p.jobs)) Object.keys(p.jobs).forEach(function (k) {
      var r = p.jobs[k];
      if (!isObj(r) || !num(r.lv) || !num(r.exp)) return;
      if (k === job && num(p.level) && num(p.exp)) { p.jobs[k] = { lv: p.level, exp: p.exp }; return; }
      var n2 = convert(r.lv, r.exp);
      rec.jobs[k] = [Math.floor(r.lv), r.exp, n2];
      r.exp = n2;
    });
    // 3. totalExp：每個職業新表的累計＋目前經驗
    var total = 0, counted = {};
    if (isObj(p.jobs)) Object.keys(p.jobs).forEach(function (k) { var r = p.jobs[k]; if (isObj(r) && num(r.lv) && num(r.exp)) { total += Exp.cumulative(Math.floor(r.lv)) + Math.floor(r.exp); counted[k] = 1; } });
    if (!counted[job] && num(p.level) && num(p.exp)) total += Exp.cumulative(Math.floor(p.level)) + Math.floor(p.exp);
    p.totalExp = total;
    // 5. 讀檔後的說明（已經有紀錄就不覆蓋）
    if (!isObj(s.migratedEcon)) s.migratedEcon = rec;
    return rec;
  }

  var EconMigrate = { TARGET: TARGET, needs: needs, convert: convert, migrate: migrate };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.EconMigrate = EconMigrate; }
  if (typeof module !== 'undefined') module.exports = EconMigrate;
})();
