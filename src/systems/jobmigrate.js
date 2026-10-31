/*
 * v1.0 第一批（48 號 v2 第 5 節、F9）：舊存檔（schema v2，v0.9.6 以前）→ v3 的職業資料
 *
 * - 先結算舊存檔留下的戰鬥經驗值（player.pendingExp；CTO Q11）。
 * - 舊見習冒險者：等級、經驗值不變（Lv10 以上也要考小考才能轉職）。
 * - 舊的 5 個職業（劍士、魔法師、弓箭手、吟遊詩人、祭司）：同一個職業、不用考；見習記成 Lv10 已出師（n＝1）。
 *   新職業的經驗值＝舊的累計經驗值 − 見習 Lv10 的累計經驗值，用 exp.js 換成等級（第 5 節的表：舊 Lv5–10 → 1、11 → 6 … 25 → 24）。
 * - 遷移保底＝舊能力（不含裝備）的 100%（每一項能力都不會比轉換前低）。舊公式：體力 30＋成長×(Lv−1)、魔力 10＋…、攻擊 6＋…、防禦 0。
 * - 裝備：法袍現在只有魔法師、祭司、吟遊詩人能穿 → 其他職業自動換成同價的職業防具（劍士→鐵甲、弓箭手→輕裝皮甲、
 *   見習→旅行斗篷＋退 800 金幣）；其他裝備 id 不變（新數值由 items.js 套用）。
 * - 金幣、委託、寶箱、頭目、名冊、題目紀錄、親密度：全部不變。
 * 回傳遷移紀錄（讀檔後播說明對話用）：{ from, job, oldLevel, newLevel, robe:{to, refund} | null }
 */
(function () {
  'use strict';
  var isNode = typeof module !== 'undefined' && typeof require === 'function';
  var Exp = isNode ? require('./exp.js') : window.JQ.Exp;
  var OLD_BASE = { hp: 30, mp: 10, atk: 6, def: 0 };
  var OLD_GROWTH = {   // v0.9.6 的 jobs.js
    novice: { hp: 8, mp: 3, atk: 2 }, swordsman: { hp: 10, mp: 1, atk: 2 }, mage: { hp: 6, mp: 5, atk: 2 },
    archer: { hp: 8, mp: 3, atk: 2 }, bard: { hp: 7, mp: 4, atk: 2 }, priest: { hp: 7, mp: 4, atk: 2 }
  };
  var ROBE_JOBS = ['mage', 'priest', 'bard'];
  var ROBE_SWAP = { swordsman: { to: 'heavy_armor', refund: 0 }, archer: { to: 'light_armor', refund: 0 }, novice: { to: 'cloak', refund: 800 } };
  var MASTER = 10;
  /**
   * v0.9.6 的裝備數值（items.js；id 在 v1.0 都還在）。夜班審查第 4 點：v1.0 有數值變低的裝備
   * （目前只有貝殼豎琴：魔力 6 → 0），舊存檔身上正在穿的，差額加進遷移保底，「舊存檔不能吃虧」。
   * GEAR_LOSS 是 OLD_GEAR 和 v1.0 items.js 的差（systems 測試會核對兩邊一致）。
   */
  var OLD_GEAR = {
    wood_sword: { atk: 3, def: 0, mp: 0 }, iron_sword: { atk: 8, def: 0, mp: 0 }, staff: { atk: 5, def: 0, mp: 8 }, bow: { atk: 7, def: 0, mp: 0 },
    harp: { atk: 4, def: 0, mp: 6 }, rod: { atk: 4, def: 1, mp: 6 }, leather: { atk: 0, def: 2, mp: 0 }, robe: { atk: 0, def: 4, mp: 5 }
  };
  var GEAR_LOSS = { harp: { mp: 6 } };

  /** 等級 L、經驗值 exp 的累計經驗值 */
  function cumulative(level, exp) {
    var n = 0;
    for (var l = 1; l < level; l++) n += Exp.oldExpToNext(l);   // v2.0 新經濟：這裡是 v0.9 → v1.0 的換算，照舊表（之後 EconMigrate 再換到新表）
    return n + (Number(exp) || 0);
  }
  /** 累計經驗值 → { lv, exp } */
  function fromCumulative(total) {
    var lv = 1, left = Math.max(0, Math.floor(total));
    while (left >= Exp.oldExpToNext(lv) && lv < 99) { left -= Exp.oldExpToNext(lv); lv++; }   // v2.0 新經濟：舊表
    return { lv: lv, exp: left };
  }
  /** 第 5 節的換算（舊職業等級 → 新職業 { lv, exp }） */
  function convertLevel(oldLevel, oldExp) { return fromCumulative(cumulative(oldLevel, oldExp) - cumulative(MASTER, 0)); }
  /** 舊公式的能力（不含裝備） */
  function oldStats(job, level) {
    var g = OLD_GROWTH[job] || OLD_GROWTH.novice, L = Math.max(1, level);
    return { hp: OLD_BASE.hp + g.hp * (L - 1), mp: OLD_BASE.mp + g.mp * (L - 1), atk: OLD_BASE.atk + g.atk * (L - 1), def: OLD_BASE.def };
  }

  /** 只看版本號：v3 的精簡存檔碼會把和預設值一樣的 player.jobs 拿掉，不能用「沒有 jobs」判斷 */
  function needs(s) { return !!(s && s.player && !(s.version >= 3)); }

  /** s＝舊存檔（還沒補預設值）。直接改 s，回傳遷移紀錄 */
  function migrate(s) {
    var p = s.player, rec = { from: s.version || 2, job: p.job || 'novice', oldLevel: p.level, newLevel: p.level, robe: null, pendingExp: 0 };
    // 1. 先結算舊存檔的戰鬥經驗值
    var pend = Number(p.pendingExp) || 0;
    if (pend > 0) { Exp.addExpWith(p, pend, Exp.oldExpToNext); rec.pendingExp = pend; rec.oldLevel = p.level; }   // v2.0 新經濟：舊規則結算（67 號 5.1）
    p.pendingExp = 0;
    var job = OLD_GROWTH[p.job] ? p.job : 'novice';
    p.job = job;
    var before = oldStats(job, p.level);
    p.floor = {};
    if (job === 'novice') {
      p.jobs = { novice: { lv: p.level, exp: p.exp } };
    } else {
      var c = convertLevel(p.level, p.exp);
      p.jobs = { novice: { lv: MASTER, exp: 0 } };
      p.jobs[job] = { lv: c.lv, exp: c.exp };
      p.level = c.lv; p.exp = c.exp;
      rec.newLevel = c.lv;
    }
    // 遷移保底 100%（見習也要：新的見習魔力成長 +2 比舊的 +3 少，S17「每項能力都不會比轉換前低」）
    ['hp', 'mp', 'atk', 'def'].forEach(function (k) { p.floor[k] = before[k]; });
    // 身上穿的裝備在 v1.0 數值變低（貝殼豎琴魔力 −6）：差額算進遷移保底（保底加在不含裝備的能力上，所以總值不會變少）
    var worn = s.equipment || {}, comp = {};
    ['weapon', 'armor'].forEach(function (slot) {
      var loss = GEAR_LOSS[worn[slot]];
      if (!loss) return;
      Object.keys(loss).forEach(function (k) { p.floor[k] = (p.floor[k] || 0) + loss[k]; comp[k] = (comp[k] || 0) + loss[k]; });
    });
    if (Object.keys(comp).length) rec.gearComp = comp;
    p.skillSlots = null;
    s.trial = s.trial || {};
    // 2. 法袍
    // 背包、裝備欄不存在時不要先建空的（補預設值時才會給新手道具；審查 F-06）
    var eq = s.equipment || {}, robeOn = eq.armor === 'robe';
    if (robeOn && ROBE_JOBS.indexOf(job) < 0) {
      var inv = s.inventory || (s.inventory = {});
      var sw = ROBE_SWAP[job] || ROBE_SWAP.novice;
      inv.robe = (inv.robe || 1) - 1;
      if (inv.robe <= 0) delete inv.robe;
      inv[sw.to] = (inv[sw.to] || 0) + 1;
      eq.armor = sw.to;
      if (sw.refund) p.coins = (Number(p.coins) || 0) + sw.refund;
      rec.robe = { to: sw.to, refund: sw.refund };
    }
    rec.before = before;
    s.migratedV3 = rec;
    return rec;
  }

  var JobMigrate = { OLD_GEAR: OLD_GEAR, GEAR_LOSS: GEAR_LOSS, OLD_GROWTH: OLD_GROWTH, ROBE_SWAP: ROBE_SWAP, cumulative: cumulative, fromCumulative: fromCumulative, convertLevel: convertLevel, oldStats: oldStats, needs: needs, migrate: migrate };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.JobMigrate = JobMigrate; }
  if (typeof module !== 'undefined') module.exports = JobMigrate;
})();
