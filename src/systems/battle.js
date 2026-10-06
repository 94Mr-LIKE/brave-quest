/*
 * DQ 式回合制戰鬥的數值規則（07 第 3 節）
 *
 * - 攻擊＝答一題。時間條：L1 30 秒、L2 40 秒、L3 60 秒、L4 90 秒；寬鬆 ×1.5；關閉＝不計時。朗讀時暫停。
 * - 答對：傷害 = 攻擊力 × 難度係數（L1 1.0 / L2 1.3 / L3 1.6 / L4 2.0）× 速度加成
 *         速度加成 = 1 + 0.3 × 剩餘時間比例（越快越高，最多 ×1.3）
 *         前 1/3 時間內答對 = 會心一擊，再 ×1.5
 *         拿手科目（職業）再 ×1.5
 *   （「關閉」模式沒有時間條，速度加成與會心一擊以「標準」時間計算，但不會超時）
 *   頭目戰另乘 bossMult（config.js 的 BOSS_DAMAGE_MULT）
 * - 答錯或超時：這一擊落空，換怪物攻擊（本實作：只有在答錯、超時、用道具、逃跑失敗時怪物才會攻擊）
 * - 怪物攻擊：max(1, 怪物 攻擊力 + 0~2 − 防禦力)
 * - 逃跑成功率 70%，頭目戰不能逃
 * - 頭目：3 個階段（體力 剩 2/3、1/3、0 換階段），每階段至少答對 2 題；最後一題是 L4
 * - 打倒＝怪物「清醒了，開心跑走」
 */
(function () {
  'use strict';
  var DIFF = { 1: 1.0, 2: 1.3, 3: 1.6, 4: 2.0 };
  var TIME_SEC = { 1: 30, 2: 40, 3: 60, 4: 90 };
  var MODE_MULT = { relaxed: 1.5, standard: 1, off: 0 };
  var CRIT_MULT = 1.5, FAVORED_MULT = 1.5, SPEED_MAX = 0.3;
  var FLEE_RATE = 0.7;
  var BOSS_PHASES = 3, PER_PHASE = 2;

  /** 回傳毫秒；0 代表不計時 */
  function timeLimitMs(level, mode, mult) {
    var m = MODE_MULT[mode] === undefined ? 1 : MODE_MULT[mode];
    if (m === 0) return 0;
    return Math.round((TIME_SEC[level] || 30) * 1000 * m * (mult || 1));
  }

  /**
   * o = { atk, level, elapsedMs, limitMs（0=不計時）, favored, favoredMult, mult（技能倍率）, bossMult（頭目戰倍率） }
   * 回傳 { damage, crit, speed }
   */
  function damage(o) {
    var ref = o.limitMs > 0 ? o.limitMs : (TIME_SEC[o.level] || 30) * 1000;
    var frac = Math.max(0, Math.min(1, (o.elapsedMs || 0) / ref));
    var speed = 1 + SPEED_MAX * (1 - frac);
    var crit = (o.elapsedMs || 0) <= ref / 3;
    var dmg = (o.atk || 1) * (DIFF[o.level] || 1) * speed * (crit ? CRIT_MULT : 1) * (o.favored ? (o.favoredMult || FAVORED_MULT) : 1) * (o.mult || 1) * (o.bossMult || 1);
    return { damage: Math.max(1, Math.round(dmg)), crit: crit, speed: speed };
  }

  function monsterAttack(monster, def, rng) {
    rng = rng || Math.random;
    return Math.max(1, (monster.atk || 1) + Math.floor(rng() * 3) - (def || 0));
  }

  function tryFlee(isBoss, rng) {
    if (isBoss) return false;
    return (rng || Math.random)() < FLEE_RATE;
  }

  // ---------------------------------------------------------------- 戰鬥狀態
  function create(monster) {
    var phases = monster.boss ? (monster.phases || BOSS_PHASES) : 1;
    return {
      monster: monster, hp: monster.hp, maxHp: monster.hp, boss: !!monster.boss,
      phases: phases, perPhase: monster.boss ? (monster.phase_q || PER_PHASE) : 0,
      phase: 1, phaseCorrect: 0, over: false, result: null, turns: 0, timeBuff: 1
    };
  }

  /** 頭目第 k 階段結束時的 體力 門檻（剩 2/3、1/3、0） */
  function threshold(b, k) { return Math.round(b.maxHp * (1 - k / b.phases)); }

  /**
   * 主角打中。回傳 {defeated, phaseUp, dealt}
   * 頭目：階段＝體力 門檻；每階段至少要答對 perPhase 題（還沒答夠時 體力 停在門檻上方 1 點），
   *       答夠且 體力 到門檻才換下一階段 → 最少 3×2 = 6 題（07 第 3 節），傷害不夠時會多幾題。
   */
  function hit(b, dmg) {
    b.turns += 1;
    var before = b.hp;
    if (b.boss) {
      b.phaseCorrect += 1;
      var th = threshold(b, b.phase);
      var hp = b.hp - dmg;
      if (b.phaseCorrect < b.perPhase) hp = Math.max(hp, th + 1);
      var phaseUp = false, defeated = false;
      if (hp <= th) {
        hp = th;
        b.phase += 1; b.phaseCorrect = 0;
        if (b.phase > b.phases) { defeated = true; hp = 0; } else phaseUp = true;
      }
      b.hp = Math.max(0, hp);
      if (defeated) { b.over = true; b.result = 'win'; }
      return { defeated: defeated, phaseUp: phaseUp, dealt: before - b.hp };
    }
    var d = Math.min(b.hp, dmg);
    b.hp -= d;
    if (b.hp <= 0) { b.hp = 0; b.over = true; b.result = 'win'; }
    return { defeated: b.over, phaseUp: false, dealt: d };
  }

  /**
   * 頭目的「最後一題」要 L4：最後一個階段、這階段已答對 perPhase−1 題以上，
   * 而且以 L4 的傷害估計（estL4Dmg）這一擊就能結束戰鬥。沒給估計值時只看題數。
   */
  function needsFinalL4(b, estL4Dmg) {
    if (!b.boss || b.phase !== b.phases || b.phaseCorrect < b.perPhase - 1) return false;
    return estL4Dmg === undefined ? true : b.hp - estL4Dmg <= 0;
  }

  /** 主角受到傷害。回傳 {damage, ko} */
  function heroHurt(state, dmg) {
    state.player.hp = Math.max(0, state.player.hp - dmg);
    return { damage: dmg, ko: state.player.hp <= 0 };
  }

  function rollDrops(monster, rng) {
    rng = rng || Math.random;
    var got = [];
    (monster.drops || []).forEach(function (d) {
      if (d && d.item && rng() < (d.rate === undefined ? 1 : d.rate)) got.push(d.item.replace(/^item_/, ''));
    });
    return got;
  }

  /** 打倒怪物的獎勵（不含答題本身的 經驗值）：經驗值 × 地圖係數、金幣 */
  function victoryReward(monster, coef) {
    return { exp: Math.round((monster.exp || 0) * (coef || 1)), gold: Math.round(monster.gold || 0) };
  }

  // ---------------------------------------------------------------- 時間條
  function createTimer(limitMs) { return { limit: limitMs, elapsed: 0, paused: false }; }
  function tick(t, dtMs) { if (!t.paused && t.limit > 0) t.elapsed = Math.min(t.limit, t.elapsed + dtMs); return expired(t); }
  function tickFree(t, dtMs) { if (!t.paused) t.elapsed += dtMs; } // 不計時模式：仍記錄花了多久（算傷害用）
  function expired(t) { return t.limit > 0 && t.elapsed >= t.limit; }
  function remainingFrac(t) { return t.limit > 0 ? Math.max(0, 1 - t.elapsed / t.limit) : 1; }
  function pause(t) { t.paused = true; }
  function resume(t) { t.paused = false; }

  var Battle = {
    DIFF: DIFF, TIME_SEC: TIME_SEC, MODE_MULT: MODE_MULT, CRIT_MULT: CRIT_MULT, FAVORED_MULT: FAVORED_MULT, FLEE_RATE: FLEE_RATE,
    BOSS_PHASES: BOSS_PHASES, PER_PHASE: PER_PHASE,
    timeLimitMs: timeLimitMs, damage: damage, monsterAttack: monsterAttack, tryFlee: tryFlee,
    create: create, hit: hit, needsFinalL4: needsFinalL4, heroHurt: heroHurt, rollDrops: rollDrops, victoryReward: victoryReward,
    createTimer: createTimer, tick: tick, tickFree: tickFree, expired: expired, remainingFrac: remainingFrac, pause: pause, resume: resume
  };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.Battle = Battle; }
  if (typeof module !== 'undefined') module.exports = Battle;
})();
