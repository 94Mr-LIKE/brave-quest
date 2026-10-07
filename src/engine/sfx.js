/*
 * 音效與怪物叫聲：全部用 Web Audio 程序合成（不用外部音檔）。
 *
 * 怪物叫聲依 VOICES.monsters[id] = { family, size, mood, pitch_shift } 合成；沒有設定時依怪物 id 推測。
 * 11 種 family 各用不同的波形與包絡（見 FAMILY_INFO）；size 影響音高與長度；頭目加厚度（多聲部、低八度、殘響）；
 * mood 影響節奏（暴躁＝快而重、迷糊＝搖晃滑音）。
 * 觸發時機（kind）：appear 出場、hurt 被打到、attack 威嚇、wake 清醒跑走（開心上揚）、phase 頭目換階段（怒吼）。
 * 兒童友善：每個聲部音量有上限、最後經過 5kHz 低通，再進 audio.js 的壓縮限制器。
 *
 * 規劃（參數計算）與合成分開：規劃部分可以在 node 測試（module.exports）。
 */
(function () {
  'use strict';

  // ---------------------------------------------------------------- 規劃（純計算）
  var FAMILY_INFO = {
    slime:   { name: '史萊姆',   wave: 'sine',     filter: 'lowpass',  envelope: 'blip',    technique: '正弦快速下滑音、短促「啵啵」', baseHz: 520 },
    beast:   { name: '野獸',     wave: 'sawtooth', filter: 'lowpass',  envelope: 'swell',   technique: '鋸齒波＋低通濾波＋雜訊＋顫音的低吼', baseHz: 110 },
    bird:    { name: '鳥',       wave: 'sine',     filter: 'none',     envelope: 'chirp',   technique: '高頻正弦上滑音、雙聲「啾啾」', baseHz: 2100 },
    bat:     { name: '蝙蝠',     wave: 'square',   filter: 'highpass', envelope: 'pulses',  technique: '高頻方波短脈衝串「吱吱」', baseHz: 2600 },
    plant:   { name: '植物',     wave: 'noise',    filter: 'bandpass', envelope: 'rustle',  technique: '帶通雜訊沙沙聲＋木質敲擊', baseHz: 320 },
    rock:    { name: '岩石',     wave: 'noise',    filter: 'lowpass',  envelope: 'rumble',  technique: '低頻雜訊隆隆＋次低頻正弦', baseHz: 55 },
    aquatic: { name: '水生',     wave: 'sine',     filter: 'lowpass',  envelope: 'gurgle',  technique: '正弦咕嚕＋隨機頻率小水泡', baseHz: 220 },
    spirit:  { name: '精靈',     wave: 'sine',     filter: 'delay',    envelope: 'pad',     technique: '多個微失諧正弦＋延遲回授迴盪「嗚嗚」', baseHz: 330 },
    armor:   { name: '盔甲',     wave: 'fm',       filter: 'none',     envelope: 'bell',    technique: 'FM 合成鐘聲「鏗鏘」', baseHz: 440 },
    goblin:  { name: '哥布林',   wave: 'square',   filter: 'lowpass',  envelope: 'steps',   technique: '方波＋快速音高起伏的「嘻嘻」怪笑', baseHz: 300 },
    frog:    { name: '青蛙',     wave: 'pulse',    filter: 'formant',  envelope: 'croak',   technique: '脈衝串＋共振峰濾波「呱呱」', baseHz: 90 }
  };
  var FAMILIES = Object.keys(FAMILY_INFO);

  // 沒有 VOICES.monsters 時，依怪物 id 推測（第一個符合的關鍵字）
  var GUESS = [
    [/slime|dango|jelly|mud_?slime/, 'slime'], [/frog/, 'frog'], [/bat/, 'bat'], [/owl|bird|gull|crow|seagull/, 'bird'],
    [/mushroom|sprout|tree|plant|flower/, 'plant'], [/rock|golem|stone/, 'rock'], [/crab|octopus|fish|shell|aquatic/, 'aquatic'],
    [/wisp|ghost|fog|spirit|demon/, 'spirit'], [/armor|knight|robot/, 'armor'], [/goblin|imp|orc/, 'goblin'], [/boar|rabbit|wolf|bear|beast/, 'beast']
  ];
  function guessFamily(id) {
    var s = String(id || '').toLowerCase();
    for (var i = 0; i < GUESS.length; i++) if (GUESS[i][0].test(s)) return GUESS[i][1];
    return 'slime';
  }

  var SIZE = { small: { f: 1.35, d: 0.8 }, medium: { f: 1.0, d: 1.0 }, large: { f: 0.75, d: 1.25 }, huge: { f: 0.62, d: 1.45 }, boss: { f: 0.6, d: 1.5 } };
  var SIZE_ALIAS = { s: 'small', m: 'medium', l: 'large', xl: 'huge', '小': 'small', '中': 'medium', '大': 'large' };
  var MOOD = {
    grumpy: { tempo: 1.3, gain: 1.15, f: 0.95, wobble: 0 },   // 暴躁：快而重
    angry: { tempo: 1.3, gain: 1.15, f: 0.95, wobble: 0 },
    dizzy: { tempo: 0.85, gain: 0.95, f: 1.0, wobble: 1 },    // 迷糊：搖晃滑音
    confused: { tempo: 0.85, gain: 0.95, f: 1.0, wobble: 1 },
    happy: { tempo: 1.1, gain: 1.0, f: 1.08, wobble: 0 },
    playful: { tempo: 1.15, gain: 1.0, f: 1.05, wobble: 0.3 },     // 頑皮：輕快、有點跳
    mysterious: { tempo: 0.8, gain: 0.9, f: 0.97, wobble: 0.4 },  // 神祕：慢、飄
    sleepy: { tempo: 0.75, gain: 0.85, f: 0.95, wobble: 0.5 },
    shy: { tempo: 0.95, gain: 0.8, f: 1.05, wobble: 0 },
    normal: { tempo: 1.0, gain: 1.0, f: 1.0, wobble: 0 }
  };
  var MOOD_ALIAS = { '暴躁': 'grumpy', '生氣': 'angry', '迷糊': 'dizzy', '開心': 'happy', '想睡': 'sleepy', '害羞': 'shy', '頑皮': 'playful', '神祕': 'mysterious' };
  var KIND = {
    appear: { f: 1.0, d: 1.0, gain: 1.0 },
    hurt: { f: 1.25, d: 0.35, gain: 0.8 },
    attack: { f: 0.9, d: 1.1, gain: 1.1 },
    wake: { f: 1.15, d: 0.8, gain: 0.9 },
    phase: { f: 0.8, d: 1.6, gain: 1.15 }
  };

  /** 怪物的聲音設定：VOICES.monsters[id] 優先，沒有就推測 */
  function profileFor(monId, mon, voices) {
    var v = (voices && voices.monsters && voices.monsters[monId]) || {};
    var boss = !!(mon && mon.boss) || v.size === 'boss';
    var size = SIZE_ALIAS[v.size] || v.size;
    return {
      family: FAMILY_INFO[v.family] ? v.family : guessFamily(monId + ' ' + ((mon && mon.sprite) || '')),
      size: SIZE[size] ? size : (boss ? 'boss' : 'medium'),
      mood: MOOD[MOOD_ALIAS[v.mood] || v.mood] ? (MOOD_ALIAS[v.mood] || v.mood) : 'dizzy',   // 怪物都是「被霧弄迷糊」
      pitchShift: Number(v.pitch_shift || 0),
      boss: boss
    };
  }

  /** 一次叫聲的參數：f＝頻率倍率、d＝長度倍率、tempo、gain、wobble、boss（加厚） */
  function cryPlan(profile, kind) {
    var k = KIND[kind] || KIND.appear, s = SIZE[profile.size] || SIZE.medium, m = MOOD[profile.mood] || MOOD.normal;
    var semis = Math.max(-12, Math.min(12, profile.pitchShift || 0));
    var f = s.f * m.f * k.f * Math.pow(2, semis / 12);
    return {
      family: profile.family, kind: kind in KIND ? kind : 'appear',
      f: f, d: s.d * k.d / m.tempo, tempo: m.tempo,
      gain: Math.min(1.25, k.gain * m.gain), wobble: m.wobble,
      boss: profile.boss || kind === 'phase'
    };
  }

  /** 腳步聲的地形：依圖塊名稱分成 grass／stone／wood／mud */
  function terrainOf(tileName) {
    var t = String(tileName || '');
    if (/bridge|floor_wood|counter|plank/.test(t)) return 'wood';
    if (/mud|sand|swamp|water/.test(t)) return 'mud';
    if (/path|floor_stone|stairs|stone|carpet|door|rockwall|cave/.test(t)) return t === 'carpet' ? 'grass' : 'stone';
    return 'grass';
  }

  // ---------------------------------------------------------------- 合成（瀏覽器）
  var stats = { nodes: 0, cries: 0, effects: 0, byFamily: {}, last: null };   // 給測試看的計數器
  var noiseBuf = null, irBuf = null;

  function C() { return window.JQ && window.JQ.Audio ? window.JQ.Audio.context() : null; }

  function node(n) { stats.nodes++; return n; }
  function osc(c, type, hz) { var o = node(c.createOscillator()); o.type = type; o.frequency.value = hz; return o; }
  function gain(c, v) { var g = node(c.createGain()); g.gain.value = v === undefined ? 1 : v; return g; }
  function filt(c, type, hz, q) { var f = node(c.createBiquadFilter()); f.type = type; f.frequency.value = hz; f.Q.value = q || 0.7; return f; }
  function noise(c) {
    if (!noiseBuf || noiseBuf.sampleRate !== c.sampleRate) {
      noiseBuf = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
      var d = noiseBuf.getChannelData(0);
      for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    var s = node(c.createBufferSource()); s.buffer = noiseBuf; s.loop = true; return s;
  }
  function reverb(c) {
    if (!irBuf || irBuf.sampleRate !== c.sampleRate) {
      var len = Math.floor(c.sampleRate * 1.2);
      irBuf = c.createBuffer(2, len, c.sampleRate);
      for (var ch = 0; ch < 2; ch++) { var d = irBuf.getChannelData(ch); for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3); }
    }
    var cv = node(c.createConvolver()); cv.buffer = irBuf; return cv;
  }
  /** 包絡：t0 起 attack 秒升到 peak，再在 t1 前降到幾乎 0 */
  function env(g, t0, attack, peak, t1) {
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t0 + Math.max(0.003, attack));
    g.gain.exponentialRampToValueAtTime(0.0001, Math.max(t0 + attack + 0.01, t1));
  }
  function play(src, t0, t1) { src.start(t0); src.stop(t1 + 0.05); }
  /** 迷糊：慢慢搖晃的音高（±40 cents，3Hz） */
  function wobble(c, o, t0, t1, amount) {
    if (!amount) return;
    var l = osc(c, 'sine', 3), lg = gain(c, 40 * amount);
    l.connect(lg); lg.connect(o.detune); play(l, t0, t1);
  }
  function clampHz(hz) { return Math.max(30, Math.min(3800, hz)); }   // 不要太刺耳

  var RECIPES = {
    slime: function (c, out, t, P) {
      var n = P.kind === 'hurt' ? 1 : 3, step = 0.13 * P.d;
      for (var i = 0; i < n; i++) {
        var t0 = t + i * step, t1 = t0 + 0.11 * P.d;
        var o = osc(c, 'sine', clampHz(620 * P.f)), g = gain(c, 0);
        o.frequency.setValueAtTime(clampHz(640 * P.f * (1 + 0.08 * i)), t0);
        o.frequency.exponentialRampToValueAtTime(clampHz(170 * P.f), t1);
        wobble(c, o, t0, t1, P.wobble);
        env(g, t0, 0.006, 0.22 * P.gain, t1);
        o.connect(g); g.connect(out); play(o, t0, t1);
      }
      return t + n * step + 0.05;
    },
    beast: function (c, out, t, P) {
      var t1 = t + 0.55 * P.d;
      var o = osc(c, 'sawtooth', clampHz(110 * P.f));
      o.frequency.setValueAtTime(clampHz(95 * P.f), t);
      o.frequency.linearRampToValueAtTime(clampHz(125 * P.f), t + 0.2 * P.d);
      o.frequency.linearRampToValueAtTime(clampHz(85 * P.f), t1);
      var vib = osc(c, 'sine', 6), vg = gain(c, 7 * P.f); vib.connect(vg); vg.connect(o.frequency); play(vib, t, t1);
      var lp = filt(c, 'lowpass', 500 * P.f, 5);
      lp.frequency.setValueAtTime(350 * P.f, t); lp.frequency.linearRampToValueAtTime(900 * P.f, t + 0.18 * P.d); lp.frequency.linearRampToValueAtTime(400 * P.f, t1);
      var rough = osc(c, 'sine', 27), rg = gain(c, 0.25), am = gain(c, 0.75);   // 粗糙感：快速振幅調變
      rough.connect(rg); rg.connect(am.gain); play(rough, t, t1);
      var g = gain(c, 0); env(g, t, 0.06, 0.22 * P.gain, t1);
      o.connect(lp); lp.connect(am); am.connect(g); g.connect(out); play(o, t, t1);
      var nz = noise(c), nf = filt(c, 'lowpass', 800, 1), ng = gain(c, 0); env(ng, t, 0.05, 0.06 * P.gain, t1);
      nz.connect(nf); nf.connect(ng); ng.connect(out); play(nz, t, t1);
      wobble(c, o, t, t1, P.wobble);
      return t1;
    },
    bird: function (c, out, t, P) {
      var n = P.kind === 'hurt' ? 1 : 2, end = t;
      for (var i = 0; i < n; i++) {
        var t0 = t + i * 0.14 * P.d, t1 = t0 + 0.09 * P.d;
        var o = osc(c, 'sine', 0), g = gain(c, 0);
        o.frequency.setValueAtTime(clampHz((2000 + 300 * i) * P.f), t0);
        o.frequency.exponentialRampToValueAtTime(clampHz((2900 + 400 * i) * P.f), t1);
        var h2 = osc(c, 'triangle', 0), hg = gain(c, 0.25); h2.frequency.setValueAtTime(clampHz(1000 * P.f), t0); h2.frequency.exponentialRampToValueAtTime(clampHz(1450 * P.f), t1);
        env(g, t0, 0.01, 0.12 * P.gain, t1);
        o.connect(g); h2.connect(hg); hg.connect(g); g.connect(out); play(o, t0, t1); play(h2, t0, t1);
        wobble(c, o, t0, t1, P.wobble);
        end = t1;
      }
      return end;
    },
    bat: function (c, out, t, P) {
      var n = P.kind === 'hurt' ? 3 : 7, gap = 0.04 / P.tempo, hp = filt(c, 'highpass', 1400, 0.7), end = t;
      hp.connect(out);
      for (var i = 0; i < n; i++) {
        var t0 = t + i * gap, t1 = t0 + 0.014;
        var o = osc(c, 'square', clampHz((2500 + (i % 2) * 300) * P.f)), g = gain(c, 0);
        env(g, t0, 0.002, 0.06 * P.gain, t1);
        o.connect(g); g.connect(hp); play(o, t0, t1);
        end = t1;
      }
      return end + 0.05;
    },
    plant: function (c, out, t, P) {
      var t1 = t + 0.4 * P.d;
      var nz = noise(c), bp = filt(c, 'bandpass', 3000, 1.2), g = gain(c, 0);
      var trem = osc(c, 'sine', 14), tg = gain(c, 0.5), am = gain(c, 0.5); trem.connect(tg); tg.connect(am.gain); play(trem, t, t1);
      env(g, t, 0.06, 0.12 * P.gain, t1);
      nz.connect(bp); bp.connect(am); am.connect(g); g.connect(out); play(nz, t, t1);
      var knocks = P.kind === 'hurt' ? 1 : 2;
      for (var i = 0; i < knocks; i++) {   // 木質敲擊
        var k0 = t + 0.08 + i * 0.16 * P.d, k1 = k0 + 0.06;
        var o = osc(c, 'sine', clampHz(320 * P.f * (1 + 0.15 * i))), kg = gain(c, 0);
        env(kg, k0, 0.002, 0.2 * P.gain, k1);
        o.connect(kg); kg.connect(out); play(o, k0, k1);
        var ck = noise(c), cf = filt(c, 'bandpass', 1200, 4), cg = gain(c, 0); env(cg, k0, 0.001, 0.08, k0 + 0.02);
        ck.connect(cf); cf.connect(cg); cg.connect(out); play(ck, k0, k0 + 0.03);
      }
      return t1;
    },
    rock: function (c, out, t, P) {
      var t1 = t + 0.65 * P.d;
      var nz = noise(c), lp = filt(c, 'lowpass', 240, 1.5), g = gain(c, 0);
      env(g, t, 0.08, 0.3 * P.gain, t1);
      nz.connect(lp); lp.connect(g); g.connect(out); play(nz, t, t1);
      var sub = osc(c, 'sine', clampHz(60 * P.f)), sg = gain(c, 0);
      sub.frequency.setValueAtTime(clampHz(65 * P.f), t); sub.frequency.exponentialRampToValueAtTime(clampHz(45 * P.f), t1);
      env(sg, t, 0.1, 0.28 * P.gain, t1);
      sub.connect(sg); sg.connect(out); play(sub, t, t1);
      return t1;
    },
    aquatic: function (c, out, t, P) {
      var t1 = t + 0.5 * P.d;
      var o = osc(c, 'sine', clampHz(220 * P.f)), g = gain(c, 0);
      var l = osc(c, 'sine', 9), lg = gain(c, 45 * P.f); l.connect(lg); lg.connect(o.frequency); play(l, t, t1);
      var lp = filt(c, 'lowpass', 900, 2);
      env(g, t, 0.04, 0.16 * P.gain, t1);
      o.connect(lp); lp.connect(g); g.connect(out); play(o, t, t1);
      var n = P.kind === 'hurt' ? 2 : 6;
      for (var i = 0; i < n; i++) {   // 小水泡：快速上滑的短音
        var b0 = t + Math.random() * 0.4 * P.d, b1 = b0 + 0.035;
        var b = osc(c, 'sine', 0), bg = gain(c, 0), hz = clampHz((500 + Math.random() * 700) * P.f);
        b.frequency.setValueAtTime(hz, b0); b.frequency.exponentialRampToValueAtTime(clampHz(hz * 1.8), b1);
        env(bg, b0, 0.003, 0.08 * P.gain, b1);
        b.connect(bg); bg.connect(out); play(b, b0, b1);
      }
      return t1;
    },
    spirit: function (c, out, t, P) {
      var t1 = t + 0.9 * P.d;
      var dl = node(c.createDelay(1)), fb = gain(c, 0.38), wet = gain(c, 0.5);   // 延遲回授＝迴盪
      dl.delayTime.value = 0.23; dl.connect(fb); fb.connect(dl); dl.connect(wet); wet.connect(out);
      [-8, 0, 9].forEach(function (cents) {
        var o = osc(c, 'sine', clampHz(330 * P.f)), g = gain(c, 0);
        o.detune.value = cents;
        o.frequency.setValueAtTime(clampHz(300 * P.f), t);
        o.frequency.linearRampToValueAtTime(clampHz(390 * P.f), t + 0.35 * P.d);   // 嗚～ 上去再下來
        o.frequency.linearRampToValueAtTime(clampHz(280 * P.f), t1);
        env(g, t, 0.18, 0.07 * P.gain, t1);
        o.connect(g); g.connect(out); g.connect(dl); play(o, t, t1);
        wobble(c, o, t, t1, P.wobble);
      });
      return t1 + 0.6;
    },
    armor: function (c, out, t, P) {
      var strikes = P.kind === 'hurt' ? 1 : 2, end = t;
      for (var i = 0; i < strikes; i++) {   // FM 鐘聲：鏗、鏘
        var t0 = t + i * 0.13 * P.d, t1 = t0 + 0.6 * P.d;
        var fc = clampHz(440 * P.f * (i ? 1.5 : 1));
        var car = osc(c, 'sine', fc), mod = osc(c, 'sine', fc * 1.4), idx = gain(c, 0), g = gain(c, 0);
        idx.gain.setValueAtTime(fc * 2.5, t0); idx.gain.exponentialRampToValueAtTime(fc * 0.1, t1);
        mod.connect(idx); idx.connect(car.frequency);
        env(g, t0, 0.002, 0.13 * P.gain, t1);
        car.connect(g); g.connect(out); play(car, t0, t1); play(mod, t0, t1);
        end = t1;
      }
      return end;
    },
    goblin: function (c, out, t, P) {
      var n = P.kind === 'hurt' ? 2 : 5, syl = 0.075 / P.tempo, lp = filt(c, 'lowpass', 1800, 1), end = t;
      lp.connect(out);
      for (var i = 0; i < n; i++) {   // 嘻、嘻、嘻：高低交替的短音
        var t0 = t + i * syl * 1.25, t1 = t0 + syl;
        var hz = clampHz(300 * P.f * (i % 2 ? 1.25 : 1) * (1 + 0.04 * i));
        var o = osc(c, 'square', hz), g = gain(c, 0);
        o.frequency.setValueAtTime(hz, t0);
        o.frequency.exponentialRampToValueAtTime(clampHz(hz * 1.15), t1);
        env(g, t0, 0.005, 0.07 * P.gain, t1);
        o.connect(g); g.connect(lp); play(o, t0, t1);
        wobble(c, o, t0, t1, P.wobble);
        end = t1;
      }
      return end;
    },
    frog: function (c, out, t, P) {
      var n = P.kind === 'hurt' ? 1 : 2, end = t;
      for (var i = 0; i < n; i++) {   // 呱：脈衝串（35Hz 開關）通過兩個共振峰
        var t0 = t + i * 0.26 * P.d, t1 = t0 + 0.18 * P.d;
        var o = osc(c, 'sawtooth', clampHz(90 * P.f)), gate = gain(c, 0), pulse = osc(c, 'square', 35), pg = gain(c, 0.5);
        gate.gain.value = 0.5; pulse.connect(pg); pg.connect(gate.gain); play(pulse, t0, t1);
        var f1 = filt(c, 'bandpass', 600 * P.f, 3), f2 = filt(c, 'bandpass', 1200 * P.f, 5), g = gain(c, 0);
        env(g, t0, 0.01, 0.35 * P.gain, t1);
        o.connect(gate); gate.connect(f1); gate.connect(f2); f1.connect(g); f2.connect(g); g.connect(out); play(o, t0, t1);
        end = t1;
      }
      return end;
    }
  };

  /** 開心上揚聲（清醒跑走時接在叫聲後面） */
  function happyRise(c, out, t, f) {
    [0, 0.09].forEach(function (dt, i) {
      var o = osc(c, 'triangle', 0), g = gain(c, 0), t0 = t + dt, t1 = t0 + 0.16;
      o.frequency.setValueAtTime(clampHz(660 * Math.min(1.3, f) * (i ? 1.5 : 1)), t0);
      o.frequency.exponentialRampToValueAtTime(clampHz(990 * Math.min(1.3, f) * (i ? 1.5 : 1)), t1);
      env(g, t0, 0.01, 0.1, t1);
      o.connect(g); g.connect(out); play(o, t0, t1);
    });
  }

  /** 怪物叫聲。monId、mon（monsters 資料）、kind：appear/hurt/attack/wake/phase */
  function monster(monId, mon, kind) {
    var A = C();
    if (!A) return null;
    var c = A.ctx, plan = cryPlan(profileFor(monId, mon, window.VOICES), kind);
    try {
      var bus = gain(c, 1), lp = filt(c, 'lowpass', 5000, 0.7);
      bus.connect(lp); lp.connect(A.out);
      var t = c.currentTime + 0.02;
      var end = RECIPES[plan.family](c, bus, t, plan);
      if (plan.boss) {   // 頭目：低八度再疊一層、加殘響
        var low = gain(c, 0.55);
        low.connect(lp);
        RECIPES[plan.family](c, low, t + 0.015, Object.assign({}, plan, { f: plan.f * 0.5, gain: plan.gain * 0.8 }));
        var rv = reverb(c), send = gain(c, 0.35);
        bus.connect(send); send.connect(rv); rv.connect(lp);
      }
      if (plan.kind === 'wake') happyRise(c, bus, end + 0.05, plan.f);
      stats.cries++;
      stats.byFamily[plan.family] = (stats.byFamily[plan.family] || 0) + 1;
      stats.last = { id: monId, kind: plan.kind, family: plan.family, boss: plan.boss };
      return plan;
    } catch (e) { return null; }
  }

  // ---------------------------------------------------------------- 一般音效（音量一致：主旋律峰值約 0.12～0.18）
  function tone(c, out, hz, t0, dur, type, vol, glideTo) {
    var o = osc(c, type || 'triangle', clampHz(hz)), g = gain(c, 0), t1 = t0 + dur;
    if (glideTo) o.frequency.exponentialRampToValueAtTime(clampHz(glideTo), t1);
    env(g, t0, 0.008, vol || 0.14, t1);
    o.connect(g); g.connect(out); play(o, t0, t1);
  }
  function burst(c, out, t0, dur, type, hz, q, vol) {
    var nz = noise(c), f = filt(c, type, hz, q), g = gain(c, 0);
    env(g, t0, 0.004, vol, t0 + dur);
    nz.connect(f); f.connect(g); g.connect(out); play(nz, t0, t0 + dur);
  }
  function chord(c, out, t0, notes, step, dur, type, vol) { notes.forEach(function (hz, i) { tone(c, out, hz, t0 + i * step, dur, type, vol); }); }

  var EFFECTS = {
    select: function (c, o, t) { tone(c, o, 880, t, 0.05, 'triangle', 0.08); },
    correct: function (c, o, t) { chord(c, o, t, [784, 1047], 0.09, 0.2, 'triangle', 0.14); tone(c, o, 1568, t + 0.18, 0.25, 'sine', 0.05); },
    wrong: function (c, o, t) { tone(c, o, 330, t, 0.18, 'triangle', 0.12, 260); tone(c, o, 247, t + 0.17, 0.25, 'triangle', 0.1, 220); },
    hit: function (c, o, t) { burst(c, o, t, 0.08, 'bandpass', 1800, 1.5, 0.18); tone(c, o, 220, t, 0.08, 'square', 0.06, 120); },
    crit: function (c, o, t) { burst(c, o, t, 0.14, 'bandpass', 2400, 1.2, 0.2); chord(c, o, t + 0.02, [523, 784, 1047, 1319], 0.05, 0.16, 'triangle', 0.12); },
    hurt: function (c, o, t) { burst(c, o, t, 0.18, 'lowpass', 700, 1, 0.22); tone(c, o, 180, t, 0.2, 'sawtooth', 0.07, 110); },
    levelup: function (c, o, t) { chord(c, o, t, [523, 659, 784, 1047, 1319], 0.08, 0.22, 'triangle', 0.13); chord(c, o, t + 0.4, [1047, 1319, 1568], 0, 0.5, 'sine', 0.06); },
    chest: function (c, o, t) {   // 木箱「喀」一聲，再閃亮琶音
      burst(c, o, t, 0.05, 'bandpass', 900, 3, 0.18); tone(c, o, 160, t, 0.08, 'sine', 0.12, 120);
      chord(c, o, t + 0.1, [784, 988, 1175, 1568, 1976], 0.06, 0.25, 'sine', 0.1);
    },
    lamp: function (c, o, t) {   // 點燈：溫暖的鐘聲＋上揚泛音
      tone(c, o, 523, t, 0.9, 'sine', 0.12); tone(c, o, 1046, t + 0.02, 0.7, 'sine', 0.05); tone(c, o, 1568, t + 0.15, 0.6, 'triangle', 0.05, 2093);
    },
    warp: function (c, o, t) { tone(c, o, 392, t, 0.3, 'sine', 0.1, 784); tone(c, o, 523, t + 0.05, 0.3, 'triangle', 0.06, 1046); },
    win: function (c, o, t) { chord(c, o, t, [659, 784, 880, 1047, 1319], 0.09, 0.2, 'triangle', 0.12); },
    encounter: function (c, o, t) { chord(c, o, t, [880, 660, 880, 660], 0.06, 0.06, 'square', 0.06); },
    firework: function (c, o, t) { burst(c, o, t, 0.4, 'lowpass', 2500, 0.8, 0.12); chord(c, o, t + 0.05, [2093, 2637, 3136], 0.03, 0.15, 'sine', 0.03); },
    taigi: function (c, o, t) { chord(c, o, t, [587, 784], 0.08, 0.14, 'sine', 0.07); },   // 台語句提示音（沒有台語音檔時）
    footstep: function (c, o, t, terrain) {
      if (terrain === 'stone') { burst(c, o, t, 0.035, 'bandpass', 2600, 2.5, 0.07); tone(c, o, 900, t, 0.03, 'sine', 0.02); }
      else if (terrain === 'wood') { tone(c, o, 190, t, 0.07, 'sine', 0.07, 150); burst(c, o, t, 0.05, 'bandpass', 650, 3, 0.05); }
      else if (terrain === 'mud') { var nz = noise(c), f = filt(c, 'lowpass', 500, 4), g = gain(c, 0); f.frequency.setValueAtTime(300, t); f.frequency.linearRampToValueAtTime(700, t + 0.1); env(g, t, 0.03, 0.06, t + 0.12); nz.connect(f); f.connect(g); g.connect(o); play(nz, t, t + 0.12); }
      else burst(c, o, t, 0.06, 'lowpass', 900, 0.7, 0.045);   // 草地：柔軟
    }
  };

  function playEffect(name, arg) {
    var A = C();
    if (!A || !EFFECTS[name]) return false;
    try { EFFECTS[name](A.ctx, A.out, A.ctx.currentTime + 0.01, arg); stats.effects++; return true; } catch (e) { return false; }
  }

  var Sfx = {
    FAMILY_INFO: FAMILY_INFO, FAMILIES: FAMILIES, SIZE: SIZE, SIZE_ALIAS: SIZE_ALIAS, MOOD: MOOD, MOOD_ALIAS: MOOD_ALIAS, KIND: KIND, EFFECTS: Object.keys(EFFECTS),
    guessFamily: guessFamily, profileFor: profileFor, cryPlan: cryPlan, terrainOf: terrainOf,
    monster: monster, play: playEffect, stats: stats, recipes: RECIPES
  };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.Sfx = Sfx; }
  if (typeof module !== 'undefined') module.exports = Sfx;
})();
