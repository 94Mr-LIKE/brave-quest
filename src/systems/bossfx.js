/*
 * 頭目與怪物的戰鬥演出：規則（純計算，可以在 node 測試）。v1.4 桃竹章起（63 號 3.2、27 號怪物表）。
 * 畫面在 src/fx/bossfx_scene.js（包住 BattleScene、MapScene 的方法，不改原文）；本檔只決定「什麼時候演什麼」。
 *
 * 原則（63 號：只是演出，不改數值）：
 *   - 不讀寫存檔（state）、不改戰鬥狀態（Battle.create 的 b）：只讀 b.phase、b.over。傷害、題目、獎勵完全不動。
 *   - 每一場戰鬥一份演出狀態（create 回傳，掛在戰鬥場景上），打完、離開就丟掉；重新挑戰從第 1 階段開始。
 *   - 閃光每秒最多 3 次（同 skillfx.js：兩次之間至少 334 毫秒；和技能特效共用同一份紀錄）。
 *   - 「減少動態效果」（家長設定 settings.reduceMotion，或系統的 prefers-reduced-motion）由畫面那一層處理：不動、不閃，只顯示靜態圖與字。
 *
 * 之後中部、南部的頭目演出：在 SCRIPTS 加一筆（phase 1..n 的 enter／hit／attack 提示），畫法加在 bossfx_scene.js 的 DRAW。
 *
 * 演出提示（cue）：{ id, ... }。id 對到 bossfx_scene.js 的 DRAW[id]。換階段的說明（note）接在戰鬥訊息後面（畫面上方有「生氣了！」的橫幅，不另外疊字）。
 */
(function () {
  'use strict';

  var FLASH_GAP = 334;                 // 毫秒：每秒最多 3 次（同 skillfx.js）
  var FOG_MAX = 6, FOG_REVEAL = 2, FOG_STEP = 2, FOG_MIN = 1;   // 霧閘機將胸口的灰霧：6 團；齒輪露出時散 2 團；第 3 階段每答對一擊散 2 團（最少留 1 團，打倒才全散）
  var HIT_WORD = '撞了過來！';         // game.js 怪物攻擊訊息裡的動詞（G.bmonsterTurn）；有演出的怪物換成自己的說法（只換字，傷害數字不變）

  /**
   * 每隻怪物的演出。key＝monsters.js 的 id。
   *   boss：只有頭目戰才演（同一個 id 不是頭目時不演）
   *   start：戰鬥開始時的提示；phase[n]：第 n 階段（enter＝進入時、hit＝主角打中時、attack＝怪物攻擊時、verb＝攻擊訊息的動詞、note＝換到這一階段時接在戰鬥訊息後面的說明）
   *   attack／verb／noFlash／noShake 寫在最外層＝每個階段都一樣（一般怪物只有一個階段）
   *   noFlash：怪物攻擊時不用原本的紅色閃光（改用自己的柔和閃光）；noShake：不用原本的畫面晃動（改用自己的動作）
   *   every：每第 n 次攻擊多演一次（雷咚咚「偶爾連打兩下」）
   *   wake：打倒時
   */
  var SCRIPTS = {
    // 北霧將（27 號：三階段：關水門（防禦高）→ 放水花（攻擊是水花泡泡）→ 齒輪露出、答對就把霧吹散；63 號：只是演出，不改數值）
    mb_floodgate: {
      boss: true, kind: 'floodgate',
      start: [{ id: 'fog' }, { id: 'gates_close' }],
      phase: {
        1: { hit: 'clank' },
        2: { enter: [{ id: 'gates_open' }, { id: 'fountain' }], note: '水門打開，噴出水花了！', attack: 'bubbles', verb: '噴出水花泡泡，潑了過來！' },
        3: { enter: [{ id: 'fountain_stop' }, { id: 'gear_reveal' }], note: '齒輪露出來了！答對就能吹散霧！', hit: 'fog_blow', attack: 'gear_spin' }
      },
      wake: [{ id: 'fog_clear' }, { id: 'water_flow' }]
    },
    // 雷咚咚（27 號：打鼓時發出「咚」的聲音與閃光（不刺眼）；偶爾連打兩下；閃光效果要柔和，避免光敏不適）
    wx_thunder: { kind: 'drum', attack: 'drum', every: 3, noFlash: true, verb: '打起小鼓，雷聲咚咚地轟了過來！' },
    // 咻咻風精（27 號：會把主角吹退一步（演出）；速度很快）
    wx_wind: { kind: 'gust', attack: 'gust', noShake: true, verb: '用力吹過來，把你吹退了一步！' }
  };

  /**
   * 地圖的氣氛（戰鬥背景與走路地圖都會演）。63 號 2.3 M16：「風：草和布條往同一邊飄（程式或背景畫出來），可跟『減少動態效果』關掉」。
   * dir：1＝往右（東）飄、-1＝往左（西）飄。風城戰鬥背景 bb_windcity 的布條往右飄 → 1。
   */
  var AMBIENCE = { M16: { kind: 'wind', dir: 1 } };

  function scriptFor(mon) {
    if (!mon || !mon.id || !Object.prototype.hasOwnProperty.call(SCRIPTS, mon.id)) return null;
    var s = SCRIPTS[mon.id];
    if (s.boss && !mon.boss) return null;
    return s;
  }
  function ambienceFor(mapId) { return mapId && Object.prototype.hasOwnProperty.call(AMBIENCE, mapId) ? AMBIENCE[mapId] : null; }
  function phaseDef(s, n) { return (s && s.phase && s.phase[n]) || {}; }

  /** 這一場戰鬥的演出狀態。沒有演出（不是表上的怪物、地圖也沒有氣氛）回傳 null */
  function create(mon, mapId) {
    var s = scriptFor(mon), amb = ambienceFor(mapId);
    if (!s && !amb) return null;
    return {
      id: mon && mon.id, kind: s ? s.kind : null, script: s, ambience: amb, mapId: mapId || null,
      phase: 1, phases: s && s.boss ? Math.max(1, (mon && mon.phases) || 3) : 1,
      fog: 0, gates: 'open', fountain: false, gear: false, flow: false,
      attacks: 0, hits: 0, woke: false, started: false
    };
  }

  /** 戰鬥開始 */
  function start(st) {
    if (!st || st.started) return [];
    st.started = true;
    var out = [];
    if (st.ambience) out.push({ id: 'ambience', kind: st.ambience.kind, dir: st.ambience.dir });
    var s = st.script;
    if (!s) return out;
    (s.start || []).forEach(function (c) { out.push(apply(st, c)); });
    return out;
  }

  /** 把一個提示套到演出狀態上（霧、水門、噴水、齒輪），回傳加上「前後狀態」的提示 */
  function apply(st, c) {
    var o = {}; Object.keys(c).forEach(function (k) { o[k] = c[k]; });
    switch (c.id) {
      case 'fog': o.from = st.fog; st.fog = FOG_MAX; o.to = st.fog; break;
      case 'gates_close': st.gates = 'closed'; break;
      case 'gates_open': st.gates = 'open'; break;
      case 'fountain': st.fountain = true; break;
      case 'fountain_stop': st.fountain = false; break;
      case 'gear_reveal': st.gear = true; o.from = st.fog; st.fog = Math.max(FOG_MIN, st.fog - FOG_REVEAL); o.to = st.fog; break;
      case 'fog_blow': o.from = st.fog; st.fog = Math.max(FOG_MIN, st.fog - FOG_STEP); o.to = st.fog; break;
      case 'fog_clear': o.from = st.fog; st.fog = 0; o.to = 0; break;
      case 'water_flow': st.flow = true; st.fountain = false; st.gates = 'open'; break;
      default: break;
    }
    return o;
  }

  /**
   * 主角打中（每一下都會叫；多段攻擊叫好幾次）。info＝{ crit, over }。
   * 用「演出狀態的階段」判斷（換階段的那一擊，戰鬥狀態已經是下一階段，但畫面要等 phaseEffect 才換）。打倒的那一擊不演（交給 wake）。
   */
  function onHit(st, info) {
    if (!st || !st.script || st.woke) return [];
    info = info || {};
    st.hits += 1;
    if (info.over) return [];
    var h = phaseDef(st.script, st.phase).hit;
    if (!h) return [];
    if (h === 'fog_blow') { if (st.fog <= FOG_MIN) return []; return [apply(st, { id: 'fog_blow' })]; }
    return [{ id: h, crit: !!info.crit }];
  }

  /** 頭目換階段：phase＝新的階段（Battle 的 b.phase）。跳過的階段（不會發生，保險）依序補演 */
  function onPhase(st, phase) {
    if (!st || !st.script || st.woke) return [];
    var to = Math.min(Math.max(1, Math.floor(Number(phase) || 1)), st.phases), out = [];
    while (st.phase < to) {
      st.phase += 1;
      var d = phaseDef(st.script, st.phase);
      (d.enter || []).forEach(function (c) { out.push(apply(st, c)); });
    }
    return out;
  }

  /** 換到第 n 階段時接在戰鬥訊息後面的說明（沒有＝null）。只查表，不改演出狀態 */
  function phaseNote(st, n) {
    if (!st || !st.script || st.woke) return null;
    var p = Math.min(Math.max(1, Math.floor(Number(n) || 1)), st.phases);
    return p > 1 ? (phaseDef(st.script, p).note || null) : null;
  }

  /**
   * 怪物攻擊（答錯、超時、用道具、逃跑失敗之後）。
   * 回傳 { cues, noFlash, noShake, verb }：noFlash／noShake＝這次不用原本的紅色閃光／晃動；verb＝攻擊訊息「撞了過來！」要換成的字（沒有＝不換）
   */
  function onAttack(st) {
    var r = { cues: [], noFlash: false, noShake: false, verb: null };
    if (!st || !st.script || st.woke) return r;
    var s = st.script, d = phaseDef(s, st.phase);
    st.attacks += 1;
    var a = d.attack || s.attack;
    r.verb = d.verb || s.verb || null;
    r.noFlash = !!(d.noFlash || s.noFlash);
    r.noShake = !!(d.noShake || s.noShake);
    if (a) {
      var c = { id: a, n: 1 };
      if (s.every && st.attacks % s.every === 0) c.n = 2;   // 偶爾連打兩下（只是畫面；傷害還是一次）
      r.cues.push(c);
    }
    return r;
  }

  /** 打倒（清醒）。只演一次 */
  function onWake(st) {
    if (!st || st.woke) return [];
    st.woke = true;
    if (!st.script) return [];
    return (st.script.wake || []).map(function (c) { return apply(st, c); });
  }

  /** 戰鬥訊息後面接一句說明（已經有就不重複） */
  function withNote(text, note) {
    if (!note || typeof text !== 'string' || text.indexOf(note) >= 0) return text;
    return text + (text ? ' ' : '') + note;
  }

  /** 攻擊訊息換字：text 裡有「撞了過來！」而且這次有 verb 才換；其他一律原樣 */
  function attackText(text, verb) {
    if (!verb || typeof text !== 'string' || text.indexOf(HIT_WORD) < 0) return text;
    return text.replace(HIT_WORD, verb);
  }

  // ---------------------------------------------------------------- 閃光（光敏安全）
  /** 現在可以閃嗎？可以就記進 log（和 skillfx.js 的 SkillFx.flashLog 共用）。兩次之間至少 FLASH_GAP 毫秒 */
  function allowFlash(log, now) {
    if (!log) return false;
    if (log.length && now - log[log.length - 1] < FLASH_GAP) return false;
    log.push(now);
    if (log.length > 60) log.splice(0, log.length - 60);
    return true;
  }
  /** 任一 1 秒視窗內最多幾次（測試用；同 SkillFx.maxFlashesPerSecond） */
  function maxFlashesPerSecond(log) {
    var best = 0;
    for (var i = 0; i < (log || []).length; i++) {
      var n = 0;
      for (var j = i; j < log.length && log[j] - log[i] < 1000; j++) n++;
      best = Math.max(best, n);
    }
    return best;
  }
  /** 雷咚咚一次攻擊的鼓聲時間點（毫秒，從攻擊開始算）：一下＝[0]；連打兩下＝[0, DRUM_GAP]（比 FLASH_GAP 長，兩下都能柔和地亮一次） */
  var DRUM_GAP = 420;
  function drumTimes(n) { var t = []; for (var i = 0; i < Math.max(1, n || 1); i++) t.push(i * DRUM_GAP); return t; }

  /** 減少動態效果：settings.reduceMotion 'on'／'off'／'auto'（auto＝看系統 prefers-reduced-motion；mm＝window.matchMedia） */
  function reducedFrom(settings, mm) {
    var v = settings && settings.reduceMotion;
    if (v === 'on') return true;
    if (v === 'off') return false;
    try { return !!(mm && mm('(prefers-reduced-motion: reduce)').matches); } catch (e) { return false; }
  }

  var BossFx = {
    SCRIPTS: SCRIPTS, AMBIENCE: AMBIENCE, FLASH_GAP: FLASH_GAP, DRUM_GAP: DRUM_GAP, HIT_WORD: HIT_WORD,
    FOG_MAX: FOG_MAX, FOG_REVEAL: FOG_REVEAL, FOG_STEP: FOG_STEP, FOG_MIN: FOG_MIN,
    scriptFor: scriptFor, ambienceFor: ambienceFor, create: create, start: start, onHit: onHit, onPhase: onPhase, phaseNote: phaseNote, onAttack: onAttack, onWake: onWake,
    attackText: attackText, withNote: withNote, allowFlash: allowFlash, maxFlashesPerSecond: maxFlashesPerSecond, drumTimes: drumTimes, reducedFrom: reducedFrom
  };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.BossFx = BossFx; }
  if (typeof module !== 'undefined') module.exports = BossFx;
})();
