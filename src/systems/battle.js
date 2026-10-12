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
 *   v0.9.3：頭目每進入下一個階段，攻擊傷害 +20%（×1、×1.2、×1.4）；還沒答夠題數時體力停在門檻上方一小段（看得見），畫面寫「再答對 N 題」
 * - v0.9.3 親密度（番薯仔的愛心，最多 10 顆，隱藏屬性）：掉寶率、打倒怪物的經驗值都 ×（1＋N%）（不加金幣）
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
    // v1.0：武鬥家的會心區間是前 2/5（critFrac）；「一定會心」的技能（crit）自己乘 1.5，這裡不再算（noCrit）
    var crit = !o.noCrit && (o.elapsedMs || 0) <= ref * Math.max(1 / 3, Number(o.critFrac) || 0);
    var dmg = (o.atk || 1) * (DIFF[o.level] || 1) * speed * (crit ? CRIT_MULT : 1) * (o.favored ? (o.favoredMult || FAVORED_MULT) : 1) * (o.mult || 1) * (o.bossMult || 1);
    return { damage: Math.max(1, Math.round(dmg)), crit: crit, speed: speed };
  }

  /**
   * 怪物攻擊：max(1, 攻擊力 + 0~2 − 防禦力) × mult（v0.9.3 頭目階段倍率，見 phaseMult），四捨五入、至少 1
   */
  function monsterAttack(monster, def, rng, mult) {
    rng = rng || Math.random;
    var base = Math.max(1, (monster.atk || 1) + Math.floor(rng() * 3) - (def || 0));
    return Math.max(1, Math.round(base * (mult || 1)));
  }

  /** v0.9.3（老闆 2026-10-10）頭目每進入下一個階段，攻擊傷害 +20%：第 1 階段 ×1、第 2 階段 ×1.2、第 3 階段 ×1.4 */
  var PHASE_DMG_STEP = 0.2;
  function phaseMult(b) {
    if (!b || !b.boss) return 1;
    var ph = Math.max(1, Math.min(b.phase, b.phases));
    return Math.round((1 + PHASE_DMG_STEP * (ph - 1)) * 100) / 100;
  }

  /**
   * v0.9.3 親密度（番薯仔的愛心，老闆 2026-10-10 裁示的隱藏屬性，畫面上不說明、不顯示百分比）：
   * 1 顆愛心 = 1%，最多 10 顆；加在掉寶率和戰鬥經驗值上，不加金幣。
   */
  var BOND_MAX = 10;
  function bond(state) {
    var n = Math.floor(Number(state && state.pet && state.pet.hearts) || 0);
    return Math.max(0, Math.min(BOND_MAX, n));
  }
  /** 經驗值套用親密度：exp ×（1＋bondPct%），四捨五入 */
  function bondExp(exp, bondPct) { return Math.round((exp || 0) * (1 + Math.max(0, bondPct || 0) / 100)); }

  /** sure＝船員「逃跑一定成功」（頭目戰還是不能逃） */
  function tryFlee(isBoss, rng, sure) {
    if (isBoss) return false;
    if (sure) return true;
    return (rng || Math.random)() < FLEE_RATE;
  }

  // ---------------------------------------------------------------- 戰鬥狀態
  function create(monster) {
    var phases = monster.boss ? (monster.phases || BOSS_PHASES) : 1;
    return {
      monster: monster, hp: monster.hp, maxHp: monster.hp, boss: !!monster.boss,
      phases: phases, perPhase: monster.boss ? (monster.phase_q || PER_PHASE) : 0,
      phase: 1, phaseCorrect: 0, over: false, result: null, turns: 0, timeBuff: 1, fx: newFx()
    };
  }

  // ---------------------------------------------------------------- v1.0 第一批：技能效果、職業特性（48 號 2.5–2.7、26 號 5.3）
  /** 這場戰鬥裡持續中的效果（技能留下來的） */
  function newFx() {
    return { guard: 0, guardM: 1, stun: 0, stunUsed: 0, weak: 0, weakM: 1, up: 0, upM: 1, charge: 1, revive: null,
      timeUp: 0, timeM: 1, power: 0, powerM: 1, goldM: 1, steal: 0, dodged: 0 };
  }
  function fxOf(b) { if (!b.fx) b.fx = newFx(); return b.fx; }
  var ATTACK_EFFECTS = ['hit', 'multi', 'crit', 'hit_weak', 'hit_stun', 'hit_gold', 'steal', 'pet', 'random'];
  var STUN_EFFECTS = ['stun'];
  /** 技能的「攻擊威力」（給模擬、選單排序用）：不造成傷害的技能是 0 */
  function skillPower(s) {
    var t = s.tierMult || s.tier_mult || (typeof s.tier === 'number' ? s.tier : 1), a = s.arg || {};
    if (['hit', 'hit_weak', 'hit_stun', 'hit_gold', 'pet', 'steal'].indexOf(s.eff) >= 0) return (a.p || 1) * t;
    if (s.eff === 'multi') return (a.n || 1) * (a.p || 1) * t;
    if (s.eff === 'crit') return (a.p || 1) * CRIT_MULT * t;
    if (s.eff === 'random') {
      var tb = a.table || [], hs = tb.filter(function (x) { return x[0] === 'hit'; });
      return tb.length ? hs.reduce(function (x, y) { return x + y[1]; }, 0) / tb.length * t : 0;
    }
    return 0;
  }
  /**
   * 能不能選這個技能。回傳 { ok, reason }：mp（魔力不夠）、stun（頭目戰的「停止」每場只能 1 次，已經用過）、
   * armed（不倒祈願已經在身上了）
   */
  function canUseSkill(b, skill, mp) {
    if (!skill) return { ok: false, reason: 'none' };
    if ((mp || 0) < (skill.mp || 0)) return { ok: false, reason: 'mp' };
    var fx = fxOf(b);
    if (b.boss && STUN_EFFECTS.indexOf(skill.eff) >= 0 && fx.stunUsed) return { ok: false, reason: 'stun' };
    if (skill.eff === 'revive' && fx.revive) return { ok: false, reason: 'armed' };
    return { ok: true };
  }
  /** 頭目戰：答對但沒有造成傷害（回復、防護、增益、停止），這一階段也算答對一題（48 號 2.7）；體力沒變，所以不會跨過門檻 */
  function countCorrect(b) {
    if (!b.boss || b.over) return false;
    b.phaseCorrect += 1;
    b.turns += 1;
    return true;
  }
  function stunMonster(b, fx) {
    if (b.boss && fx.stunUsed) return false;
    fx.stun = 1;
    if (b.boss) fx.stunUsed = 1;
    return true;
  }
  /**
   * 答對、用了技能：先套用技能本身的效果（26 號 5.3 的 17 種）。
   * ctx = { maxHp, timerOff（家長把答題時間關掉）, trait, rng }
   * 回傳 { eff（random 抽到的結果）, attack（要不要打）, hits, mult, noCrit, heal, stunned, noEffect, offPower, counted }
   *   attack＝false 時：頭目戰這一題已經算進階段（counted），呼叫的人不用再呼叫 hit
   */
  function useSkill(b, skill, ctx) {
    ctx = ctx || {};
    var fx = fxOf(b), a = skill.arg || {}, e = skill.eff, rng = ctx.rng || Math.random, trait = ctx.trait || {};
    var out = { eff: e, attack: false, hits: 1, mult: 1, noCrit: false, heal: 0 };
    if (e === 'random') {
      var tb = a.table || [['hit', 1]], pick = tb[Math.floor(rng() * tb.length)] || tb[0];
      out.picked = pick;
      if (pick[0] === 'heal') { e = 'heal'; a = { r: pick[1] }; } else { e = 'hit'; a = { p: pick[1] }; }
      out.eff = e;
    }
    switch (e) {
      case 'heal': out.heal = Math.max(1, Math.floor((ctx.maxHp || 0) * (a.r || 0) * (trait.healPow || 1))); break;
      case 'revive': fx.revive = { r: a.r || 0.5 }; break;
      case 'guard': fx.guard = a.t || 1; fx.guardM = a.m === undefined ? 0.5 : a.m; break;
      case 'weaken': fx.weak = a.t || 1; fx.weakM = a.m === undefined ? 0.7 : a.m; break;
      case 'stun': out.stunned = stunMonster(b, fx); out.noEffect = !out.stunned; break;
      case 'atk_up': fx.up = a.t || 1; fx.upM = a.m || 1; break;
      case 'charge': fx.charge = a.m || 1; break;
      case 'time_up':
        // CTO 2026-10-12（Q1）：答題時間「關閉」時，加時間的技能（鼓舞之歌、影子步）改成接下來 t 次答對傷害 ×1.3（沿用 v0.9.6）
        if (ctx.timerOff) { fx.power = a.t || 1; fx.powerM = OFF_SONG_POWER; out.offPower = OFF_SONG_POWER; }
        else {
          fx.timeUp = a.t || 1; fx.timeM = a.m || 1.5;
          if (a.atk && !(fx.up > 0 && fx.upM >= a.atk)) { fx.up = 1; fx.upM = a.atk; }
        }
        break;
      default:
        out.attack = true;
        if (e === 'hit_weak') { fx.weak = a.t || 1; fx.weakM = a.m === undefined ? 0.8 : a.m; }
        if (e === 'hit_stun') out.stunned = stunMonster(b, fx);
        if (e === 'hit_gold') fx.goldM = Math.max(fx.goldM, a.g || 1);
        if (e === 'steal') fx.steal += 1;
        if (e === 'multi') { out.hits = a.n || 2; out.mult = a.p || 1; }
        else if (e === 'crit') { out.mult = (a.p || 1) * CRIT_MULT; out.noCrit = true; out.sureCrit = true; }
        else out.mult = a.p || 1;
        out.mult *= (skill.tierMult || 1) * (trait.skillPow || 1);
    }
    if (!out.attack) out.counted = countCorrect(b);
    return out;
  }
  /**
   * 答對後的一次攻擊（普通攻擊或攻擊技能）。48 號 2.7：多段攻擊每一下的傷害先加起來，只呼叫一次 hit（頭目階段只 +1）。
   * o = { atk, level, elapsedMs, limitMs, favored, favoredMult, bossMult, hits, mult, noCrit, sureCrit, trait, dmgMult（裝備特效）, rng }
   * 回傳 { total, parts（每一下，畫面一下一下播；加起來＝total）, crit, pet（牧羊人番薯仔追加的次數）, buffs:[用掉的增益] }
   */
  function attack(b, o) {
    var fx = fxOf(b), trait = o.trait || {}, rng = o.rng || Math.random, mult = o.mult || 1, buffs = [];
    if (fx.up > 0) { mult *= fx.upM; fx.up -= 1; buffs.push('up'); }
    if (fx.charge !== 1) { mult *= fx.charge; fx.charge = 1; buffs.push('charge'); }
    if (fx.power > 0) { mult *= fx.powerM; fx.power -= 1; buffs.push('power'); }
    var n = Math.max(1, o.hits || 1), raw = [], crit = !!o.sureCrit, pet = 0, sum = 0;
    for (var i = 0; i < n; i++) {
      var d = damage({ atk: o.atk, level: o.level, elapsedMs: o.elapsedMs, limitMs: o.limitMs, favored: o.favored, favoredMult: o.favoredMult,
        mult: mult, bossMult: o.bossMult, critFrac: trait.critFrac, noCrit: o.noCrit });
      var v = d.damage;
      crit = crit || d.crit;
      if (trait.petHit && rng() < trait.petHit) { v += Math.round((o.atk || 1) * 0.5); pet += 1; }   // 牧羊人：番薯仔追加一擊（物攻 ×0.5）
      raw.push(v); sum += v;
    }
    var k = (trait.power || 1) * (o.dmgMult || 1);   // 劍士「力量」×1.15、專屬武器特效
    var total = Math.max(1, Math.round(sum * k)), parts = [], acc = 0;
    raw.forEach(function (v, j) { var p = j === raw.length - 1 ? total - acc : Math.max(1, Math.round(v * k)); if (j < raw.length - 1) acc += p; parts.push(p); });
    if (parts[parts.length - 1] < 1) parts[parts.length - 1] = 1;
    return { total: total, parts: parts, crit: crit, pet: pet, buffs: buffs };
  }
  /** 下一題的時間條倍率（影子步、鼓舞之歌；每出一題用掉一次，不管答對答錯） */
  function nextTimeMult(b) {
    var fx = fxOf(b);
    if (fx.timeUp > 0) { fx.timeUp -= 1; return fx.timeM; }
    return 1;
  }
  /**
   * 怪物的回合（答錯、超時、用道具、逃跑失敗之後）。o = { def, trait, rng }
   * 順序：停止（迷惑舞步、安眠曲、落雷術）→ 舞者閃過（10%）→ 搞笑藝人逗笑（8%）→ 減弱 → 防護 → 劍士被打 ×0.9
   * 回傳 { skipped: 'stun'|'evade'|'laugh'|null, damage, guarded, weakened, mult（頭目階段倍率） }
   */
  function monsterTurn(b, mon, o) {
    o = o || {};
    var fx = fxOf(b), rng = o.rng || Math.random, trait = o.trait || {}, pm = phaseMult(b);
    if (fx.stun > 0) { fx.stun -= 1; return { skipped: 'stun', damage: 0, mult: pm }; }
    if (trait.evade && rng() < trait.evade) return { skipped: 'evade', damage: 0, mult: pm };
    if (trait.laugh && rng() < trait.laugh) return { skipped: 'laugh', damage: 0, mult: pm };
    var weakened = fx.weak > 0, m = { atk: (mon.atk || 1) * (weakened ? fx.weakM : 1) };
    if (weakened) fx.weak -= 1;
    var d = monsterAttack(m, o.def, rng, pm), guarded = fx.guard > 0;
    if (guarded) { d = d * fx.guardM; fx.guard -= 1; }
    d = Math.max(1, Math.ceil(d * (trait.dmgTaken || 1)));
    return { skipped: null, damage: d, guarded: guarded, weakened: weakened, mult: pm };
  }
  /** 累倒時：身上有「不倒祈願」就馬上站起來（體力回到上限 × r），用掉 */
  function tryRevive(b, state, maxHp) {
    var fx = fxOf(b);
    if (!fx.revive || state.player.hp > 0) return 0;
    var hp = Math.max(1, Math.floor((maxHp || 1) * fx.revive.r));
    state.player.hp = hp; fx.revive = null;
    return hp;
  }
  /** 神奇口袋：從怪物的掉落物裡拿一樣（沒有掉落物就拿不到） */
  function stealItem(monster, rng) {
    var ds = (monster.drops || []).filter(function (d) { return d && d.item; });
    if (!ds.length) return null;
    return ds[Math.floor((rng || Math.random)() * ds.length)].item.replace(/^item_/, '');
  }
  /** 勝利後的職業特性：吟遊詩人回魔（至少 1 點）、商人與生意興隆的金幣倍率、魔物大師的朋友卡 */
  function victoryTraits(b, trait, maxMp, rng) {
    var fx = fxOf(b), r = { mp: 0, goldMult: (trait.gold || 1) * (fx.goldM || 1), friend: false };
    if (trait.mpRegen) r.mp = Math.max(1, Math.round((maxMp || 0) * trait.mpRegen));
    if (trait.friendCard && (rng || Math.random)() < trait.friendCard) r.friend = true;
    return r;
  }

  /** 頭目第 k 階段結束時的 體力 門檻（剩 2/3、1/3、0） */
  function threshold(b, k) { return Math.round(b.maxHp * (1 - k / b.phases)); }

  /**
   * 這一階段還沒答夠題數時，體力停在門檻上方多少：這一段體力的 10%（至少 1 點）。
   * v0.9.3 修正（老闆問「BOSS 會鎖血嗎？」）：原本停在門檻上方 1 點，最後一階段就是「剩 1 點」，
   * 體力條看起來已經空了卻打不倒。改成留下看得見的一小段，並由畫面寫出「再答對 N 題」。
   */
  function holdMargin(b) {
    var seg = b.maxHp / b.phases;
    return Math.max(1, Math.round(seg * 0.1));
  }

  /** 這一階段還要答對幾題（不管傷害）才能換階段／打倒；不是頭目回傳 0 */
  function needCorrect(b) {
    if (!b.boss || b.over) return 0;
    return Math.max(0, b.perPhase - b.phaseCorrect);
  }

  /**
   * 主角打中。回傳 {defeated, phaseUp, dealt, held}
   * 頭目：階段＝體力 門檻；每階段至少要答對 perPhase 題（還沒答夠時 體力 停在門檻上方一小段，held＝true），
   *       答夠且 體力 到門檻才換下一階段 → 最少 3×2 = 6 題（07 第 3 節），傷害不夠時會多幾題。
   */
  function hit(b, dmg) {
    b.turns += 1;
    var before = b.hp;
    if (b.boss) {
      b.phaseCorrect += 1;
      var th = threshold(b, b.phase);
      var hp = b.hp - dmg, held = false;
      // 上一擊是被「撐住」的（體力是刻意留下的那一段）：這一擊答夠題數就一定過門檻，不會因為傷害小又卡住
      if (b.held && b.phaseCorrect >= b.perPhase) hp = Math.min(hp, th);
      if (b.phaseCorrect < b.perPhase && hp <= th) { hp = Math.max(hp, Math.min(before, th + holdMargin(b))); held = true; }
      var phaseUp = false, defeated = false;
      if (hp <= th) {
        hp = th;
        b.phase += 1; b.phaseCorrect = 0;
        if (b.phase > b.phases) { defeated = true; hp = 0; } else phaseUp = true;
      }
      b.hp = Math.max(0, hp);
      b.held = held;   // 體力停在門檻上方、等答夠題數（畫面顯示「再答對 N 題」）
      if (defeated) { b.over = true; b.result = 'win'; }
      return { defeated: defeated, phaseUp: phaseUp, dealt: before - b.hp, held: held };
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

  /** 掉寶。bondPct（親密度，0～10）：每一樣的掉落率 ×（1＋bondPct%）（例：30% → 33%；37 號設計），最多 100% */
  /** dropMult：v1.0 弓箭手掉寶率 ×1.5 */
  function dropRate(d, bondPct, dropMult) {
    var base = d.rate === undefined ? 1 : Number(d.rate) || 0;
    return Math.min(1, base * (1 + Math.max(0, bondPct || 0) / 100) * (dropMult || 1));
  }
  function rollDrops(monster, rng, bondPct, dropMult) {
    rng = rng || Math.random;
    var got = [];
    (monster.drops || []).forEach(function (d) {
      if (d && d.item && rng() < dropRate(d, bondPct, dropMult)) got.push(d.item.replace(/^item_/, ''));
    });
    return got;
  }

  /**
   * 打倒怪物的獎勵（不含答題本身的 經驗值）：經驗值 × 地圖係數 ×（1＋親密度%）、金幣（親密度不加金幣）×goldMult（v1.0 商人、生意興隆）。四捨五入
   */
  function victoryReward(monster, coef, bondPct, goldMult) {
    return { exp: bondExp(Math.round((monster.exp || 0) * (coef || 1)), bondPct), gold: Math.round((monster.gold || 0) * (goldMult || 1)) };
  }

  // ---------------------------------------------------------------- 時間條
  function createTimer(limitMs) { return { limit: limitMs, elapsed: 0, paused: false }; }
  function tick(t, dtMs) { if (!t.paused && t.limit > 0) t.elapsed = Math.min(t.limit, t.elapsed + dtMs); return expired(t); }
  function tickFree(t, dtMs) { if (!t.paused) t.elapsed += dtMs; } // 不計時模式：仍記錄花了多久（算傷害用）
  function expired(t) { return t.limit > 0 && t.elapsed >= t.limit; }
  function remainingFrac(t) { return t.limit > 0 ? Math.max(0, 1 - t.elapsed / t.limit) : 1; }
  function pause(t) { t.paused = true; }
  function resume(t) { t.paused = false; }

  /**
   * v0.9.6（47 號 B10）一擊的訊息。頭目到了階段門檻時，多出來的傷害會被門檻吃掉（例：會心一擊算出 50，實際只扣 4）：
   * 這時不寫「會心一擊」和小小的數字，改說「一口氣打到門檻！」，小朋友才不會以為答得快反而打得少。
   * o = { crit, favored, first（這次答對的第一擊）, dealt, damage, phaseUp, held, over }
   */
  function hitMessage(o) {
    var capped = o.dealt < o.damage && !o.over;
    var s = (o.crit && !capped ? '會心一擊！' : '') + (o.favored && o.first ? '拿手科目！' : '');
    if (capped && o.phaseUp) return s + '一口氣打到門檻！';
    return s + (o.hits > 1 ? '連打 ' + o.hits + ' 下，' : '') + '打出 ' + o.dealt + ' 點傷害！' + (o.pet ? '番薯仔也衝上去咬了一口！' : '');
  }

  // ---- v0.9.6（45 號職業稽核 F3、F5）
  /** 先制射擊只能在「這場還沒答過題」時用（答錯也算答過；原本用 b.turns，只有打中才 +1，答錯後還能用） */
  function canPreempt(questionsAsked) { return !(questionsAsked > 0); }
  /** 家長把答題時間設成「關閉」（不計時） */
  function timerOff(mode) { return MODE_MULT[mode] === 0; }
  /**
   * 「關閉時間條」時，和時間條有關的職業特色改成替代效果（不讓孩子白扣魔力）：
   * - 吟遊詩人「鼓舞之歌」：平常＝下一題時間條 ×1.5；不計時＝下一次答對的傷害 ×1.3（OFF_SONG_POWER）
   * - 弓箭手（時間條 ×1.2）：不計時＝每場戰鬥可以閃過一次「答錯後怪物的攻擊」（不扣體力）
   */
  var OFF_SONG_POWER = 1.3;
  function songEffect(mode, value) { return timerOff(mode) ? { kind: 'power', mult: OFF_SONG_POWER } : { kind: 'time', mult: value || 1.5 }; }
  /** 答錯時：弓箭手在不計時模式下這場還沒閃過 → 這次閃開（記在 b.dodgeUsed），回傳 true */
  function dodgeOnWrong(b, mode, timeMult) {
    if (!timerOff(mode) || !(timeMult > 1) || b.dodgeUsed) return false;
    b.dodgeUsed = true;
    return true;
  }
  /** 答對打出傷害時，用掉鼓舞之歌的傷害加成（沒有就是 1） */
  function takePowerBuff(b) { var m = b.powerBuff || 1; b.powerBuff = 1; return m; }

  var Battle = {
    newFx: newFx, ATTACK_EFFECTS: ATTACK_EFFECTS, skillPower: skillPower, canUseSkill: canUseSkill, countCorrect: countCorrect, useSkill: useSkill, attack: attack,
    nextTimeMult: nextTimeMult, monsterTurn: monsterTurn, tryRevive: tryRevive, stealItem: stealItem, victoryTraits: victoryTraits,
    hitMessage: hitMessage, canPreempt: canPreempt, timerOff: timerOff, OFF_SONG_POWER: OFF_SONG_POWER, songEffect: songEffect, dodgeOnWrong: dodgeOnWrong, takePowerBuff: takePowerBuff,
    DIFF: DIFF, TIME_SEC: TIME_SEC, MODE_MULT: MODE_MULT, CRIT_MULT: CRIT_MULT, FAVORED_MULT: FAVORED_MULT, FLEE_RATE: FLEE_RATE,
    BOSS_PHASES: BOSS_PHASES, PER_PHASE: PER_PHASE, PHASE_DMG_STEP: PHASE_DMG_STEP, BOND_MAX: BOND_MAX,
    timeLimitMs: timeLimitMs, damage: damage, monsterAttack: monsterAttack, phaseMult: phaseMult, bond: bond, bondExp: bondExp, tryFlee: tryFlee,
    create: create, hit: hit, holdMargin: holdMargin, needCorrect: needCorrect, needsFinalL4: needsFinalL4, heroHurt: heroHurt,
    dropRate: dropRate, rollDrops: rollDrops, victoryReward: victoryReward,
    createTimer: createTimer, tick: tick, tickFree: tickFree, expired: expired, remainingFrac: remainingFrac, pause: pause, resume: resume
  };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.Battle = Battle; }
  if (typeof module !== 'undefined') module.exports = Battle;
})();
