/*
 * 音樂引擎（遊戲作曲家）：用 Web Audio API 程序合成 BGM 與短曲（jingle），不使用任何音檔。
 *
 * 樂譜在 docs/data/music.js（window.MUSIC），記譜說明見該檔開頭。
 *
 * API（window.JQ.Music）：
 *   playBgm(id)          播放（迴圈）背景音樂；與目前不同時會交叉淡入淡出；同一首則不重播。
 *                        短曲播放中呼叫時，會等短曲結束再播。還沒解鎖聲音時，會記住、解鎖後自動開始。
 *   stopBgm(fadeMs)      淡出停止背景音樂（預設 600 毫秒）。
 *   jingle(id, onEnd)    播放短曲；依樂譜的 bgm 欄位把 BGM「暫停」（pause，結束後從原位置淡入接續）
 *                        或「壓低」（duck）。onEnd 一定會被呼叫（沒有聲音、關閉音樂、找不到曲目時也會非同步呼叫）。
 *   setVolume(0–1)       音樂音量（只影響音樂，不影響音效與語音）。
 *   setEnabled(bool)     開關音樂；關掉時記住目前的 BGM，打開後接續。
 *   stats                統計（目前曲目、已排程音符數、迴圈次數……），測試與除錯用。
 *   另有：list()、info(id)、current()、parse(notes)、compile(song)（試聽頁與測試用）。
 *
 * 輸出鏈：每首曲子的增益 → BGM／短曲匯流排 → 音樂主音量 → 6.5kHz 低通（兒童友善，不刺耳）
 *         → audio.js 的主音量 → 壓縮限制器 → 喇叭（和音效、語音共用同一個 AudioContext）。
 *
 * 排程：用 AudioContext 的時間軸做 lookahead 排程（每 40 毫秒檢查一次，預先排 0.2 秒內的音符），
 *       音符時間 = 起點 + 拍數 × 每拍秒數，不會因 setInterval 不準而漂移。
 * 分頁隱藏時暫停（記住位置），回來時從原位置淡入。沒有 AudioContext（node 測試）時安全地什麼都不做。
 */
(function () {
  'use strict';
  var root = typeof window !== 'undefined' ? window : {};

  // ================================================================ 記譜解析（純計算，node 可測）
  var LETTER = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  var DRUM_NAMES = { k: 'kick', s: 'snare', h: 'hat', o: 'openhat', t: 'tom', c: 'cymbal', w: 'wood' };
  var NAMES = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];

  function isRest(x) { var s = String(x).trim().toLowerCase(); return s === 'r' || s === 'rest' || s === '-'; }

  /** 音名（C4、F#3、Bb5）或 MIDI 半音數 → MIDI 編號；看不懂回傳 NaN */
  function noteToMidi(x) {
    if (typeof x === 'number') return isFinite(x) ? Math.round(x) : NaN;
    var s = String(x).trim();
    if (/^\d+$/.test(s)) return Number(s);
    var m = /^([A-G])(#|b)?(-?\d)$/.exec(s);
    if (!m) return NaN;
    return 12 * (Number(m[3]) + 1) + LETTER[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0);
  }
  function midiToName(n) { return NAMES[((n % 12) + 12) % 12] + (Math.floor(n / 12) - 1); }
  function midiToHz(n) { return 440 * Math.pow(2, (n - 69) / 12); }

  /** 展開重複記號 [ ... ]xN（可巢狀，由內而外） */
  function expand(str) {
    var re = /\[([^\[\]]*)\]\s*x(\d+)/g, prev;
    do {
      prev = str;
      str = str.replace(re, function (_, body, n) { var out = []; for (var i = 0; i < Number(n); i++) out.push(body); return ' ' + out.join(' ') + ' '; });
    } while (str !== prev);
    return str;
  }

  /**
   * 解析一條音軌 → { events:[{ beat, dur, notes:[midi] } 或 { beat, dur, drums:['kick'] }], beats, bars:[每小節拍數], errors:[] }
   * 休止符不產生事件，只推進時間。
   */
  function parseNotes(src, isDrums) {
    var res = { events: [], beats: 0, bars: [], errors: [] };
    var beat = 0;
    function addToken(pitch, len, where) {
      len = Number(len);
      if (!(len > 0) || !isFinite(len)) { res.errors.push('拍長錯誤：' + where); return 0; }
      if (isRest(pitch)) { beat += len; return len; }
      var parts = String(pitch).split('+'), ev = { beat: beat, dur: len };
      if (isDrums) {
        ev.drums = [];
        for (var i = 0; i < parts.length; i++) {
          var d = DRUM_NAMES[parts[i].trim()];
          if (d) ev.drums.push(d); else res.errors.push('不認識的鼓：' + where);
        }
      } else {
        ev.notes = [];
        for (var j = 0; j < parts.length; j++) {
          var n = noteToMidi(typeof pitch === 'number' ? pitch : parts[j]);
          if (isNaN(n)) res.errors.push('不認識的音名：' + where); else ev.notes.push(n);
        }
      }
      if ((ev.notes && ev.notes.length) || (ev.drums && ev.drums.length)) res.events.push(ev);
      beat += len;
      return len;
    }
    if (Array.isArray(src)) {
      src.forEach(function (item, k) {
        if (!Array.isArray(item) || item.length < 2) { res.errors.push('第 ' + (k + 1) + ' 個音格式錯誤'); return; }
        addToken(item[0], item[1], JSON.stringify(item));
      });
    } else if (typeof src === 'string') {
      expand(src).split('|').forEach(function (bar) {
        var toks = bar.trim().split(/\s+/).filter(Boolean);
        if (!toks.length) return;
        var sum = 0;
        toks.forEach(function (tok) {
          var i = tok.lastIndexOf(':');
          if (i <= 0) { res.errors.push('缺少拍長：' + tok); return; }
          sum += addToken(tok.slice(0, i), tok.slice(i + 1), tok);
        });
        res.bars.push(Math.round(sum * 1000) / 1000);
      });
    } else {
      res.errors.push('notes 必須是字串或陣列');
    }
    res.beats = Math.round(beat * 1000) / 1000;
    return res;
  }

  /** 編譯整首曲子：解析每條音軌、算長度 */
  function compile(song, id) {
    var tempo = Number(song && song.tempo) || 120;
    var out = { id: id || null, name: song.name || id, tempo: tempo, spb: 60 / tempo, meter: song.meter || 4, loop: !!song.loop,
      bgmMode: song.bgm || 'pause', tracks: [], beats: 0, duration: 0, errors: [], melody: -1 };
    (song.tracks || []).forEach(function (t, i) {
      var isDrums = t.instrument === 'drums';
      var p = parseNotes(t.notes, isDrums);
      p.errors.forEach(function (e) { out.errors.push('音軌 ' + (i + 1) + '：' + e); });
      if (!isDrums && !INSTRUMENTS[t.instrument]) out.errors.push('音軌 ' + (i + 1) + '：不認識的音色 ' + t.instrument);
      out.tracks.push({ instrument: t.instrument, role: t.role || (isDrums ? 'drums' : 'part'), gain: typeof t.gain === 'number' ? t.gain : 1,
        events: p.events, beats: p.beats, bars: p.bars });
      if (p.beats > out.beats) out.beats = p.beats;
      if (out.melody < 0 && t.role === 'melody') out.melody = i;
    });
    if (out.melody < 0 && out.tracks.length) out.melody = 0;
    out.duration = out.beats * out.spb;
    return out;
  }

  // ================================================================ 音色
  // gain 是每個聲部的峰值（方波／鋸齒波泛音多，所以給得比三角波小）；a/d/s/r 是包絡；lp 是低通濾波頻率
  var INSTRUMENTS = {
    lead_square: { wave: 'square', gain: 0.07, a: 0.008, d: 0.12, s: 0.7, r: 0.08, lp: 2600, vib: 0.22, desc: '方波主旋律（晶片風）＋低通' },
    lead_tri: { wave: 'triangle', gain: 0.2, a: 0.01, d: 0.1, s: 0.75, r: 0.1, vib: 0.25, desc: '三角波主旋律（柔和）' },
    lead_saw: { wave: 'sawtooth', gain: 0.065, a: 0.01, d: 0.15, s: 0.65, r: 0.1, lp: 2200, vib: 0.22, desc: '鋸齒波主旋律＋低通（有力）' },
    brass: { wave: 'sawtooth', gain: 0.07, a: 0.035, d: 0.2, s: 0.75, r: 0.12, lp: 1900, lpEnv: true, vib: 0.3, desc: '鋸齒波＋濾波包絡的銅管' },
    flute: { wave: 'triangle', gain: 0.2, a: 0.06, d: 0.1, s: 0.85, r: 0.15, vib: 0.18, sine8va: 0.25, desc: '三角波＋正弦泛音＋顫音的笛聲' },
    bell: { kind: 'bell', gain: 0.1, decay: 1.3, desc: '正弦＋泛音的八音盒鐘聲' },
    pluck: { wave: 'triangle', gain: 0.12, a: 0.003, d: 0.25, s: 0, r: 0.05, lp: 3000, desc: '撥弦（分解和弦／反拍和弦）' },
    pad: { wave: 'triangle', gain: 0.04, a: 0.3, d: 0.3, s: 0.85, r: 0.5, lp: 1500, detune: 7, desc: '兩個微失諧三角波的柔和墊音' },
    bass: { wave: 'triangle', gain: 0.24, a: 0.008, d: 0.2, s: 0.8, r: 0.08, desc: '三角波低音' },
    bass_pluck: { wave: 'square', gain: 0.065, a: 0.004, d: 0.18, s: 0.35, r: 0.05, lp: 700, desc: '方波＋低通的彈跳低音' },
    arp: { wave: 'square', gain: 0.035, a: 0.004, d: 0.1, s: 0.4, r: 0.04, lp: 1600, desc: '方波分解和弦' },
    drums: { kind: 'drums', gain: 1, desc: '雜訊＋包絡的簡易鼓組' }
  };

  // ================================================================ 合成（需要 AudioContext）
  var noiseCache = null;
  function noise(ctx) {
    if (noiseCache && noiseCache.ctx === ctx) return noiseCache.buf;
    var len = Math.floor(ctx.sampleRate * 1.0), buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    var seed = 12345;
    for (var i = 0; i < len; i++) { seed = (seed * 1103515245 + 12345) & 0x7fffffff; d[i] = seed / 0x3fffffff - 1; }
    noiseCache = { ctx: ctx, buf: buf };
    return buf;
  }

  /** 一般音色：振盪器 →（低通）→ 包絡 → out */
  function playTone(ctx, out, inst, midi, t, dur, vel) {
    var f = midiToHz(midi), peak = inst.gain * vel, sus = peak * inst.s;
    var g = ctx.createGain();
    var end = t + Math.max(dur * 0.92, inst.a + 0.02), stopAt = end + inst.r + 0.05;
    // 包絡：起音 → 衰減到持續音量 → 放開
    var t1 = t + inst.a, t2 = Math.min(t1 + inst.d, end);
    var v2 = peak + (sus - peak) * Math.min(1, (t2 - t1) / inst.d);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t1);
    g.gain.linearRampToValueAtTime(v2, t2);
    g.gain.setValueAtTime(v2, end);
    g.gain.linearRampToValueAtTime(0, end + inst.r);
    var dest = g;
    if (inst.lp) {
      var lp = ctx.createBiquadFilter();
      lp.type = 'lowpass'; lp.Q.value = 0.8;
      if (inst.lpEnv) { lp.frequency.setValueAtTime(inst.lp * 0.35, t); lp.frequency.linearRampToValueAtTime(inst.lp, t + inst.a + 0.06); lp.frequency.linearRampToValueAtTime(inst.lp * 0.7, end); }
      else lp.frequency.value = inst.lp;
      lp.connect(g); dest = lp;
    }
    g.connect(out);
    var oscs = [];
    var detunes = inst.detune ? [-inst.detune, inst.detune] : [0];
    detunes.forEach(function (dt) {
      var o = ctx.createOscillator();
      o.type = inst.wave; o.frequency.value = f; o.detune.value = dt;
      o.connect(dest); oscs.push(o);
    });
    if (inst.sine8va) {   // 笛聲：加一點高八度正弦，聲音比較亮
      var o2 = ctx.createOscillator(), g2 = ctx.createGain();
      o2.type = 'sine'; o2.frequency.value = f * 2; g2.gain.value = inst.sine8va;
      o2.connect(g2); g2.connect(dest); oscs.push(o2);
    }
    if (inst.vib && dur > 0.35) {   // 長音才加顫音，慢慢進來
      var lfo = ctx.createOscillator(), lg = ctx.createGain();
      lfo.frequency.value = 5.2; lg.gain.setValueAtTime(0, t); lg.gain.linearRampToValueAtTime(f * 0.006 * inst.vib / 0.25, t + 0.2 + dur * 0.3);
      lfo.connect(lg);
      oscs.forEach(function (o) { lg.connect(o.frequency); });
      lfo.start(t); lfo.stop(stopAt);
    }
    oscs.forEach(function (o) { o.start(t); o.stop(stopAt); });
    return oscs.length;
  }

  /** 鐘聲／八音盒：基音＋4 倍泛音，指數衰減 */
  function playBell(ctx, out, inst, midi, t, dur, vel) {
    var f = midiToHz(midi), peak = inst.gain * vel, decay = Math.max(0.4, Math.min(inst.decay, dur * 0.5 + 0.8));
    [[1, 1], [4.0, 0.18], [2.0, 0.25]].forEach(function (h) {
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = f * h[0];
      var dd = decay / (h[0] > 1 ? 2.2 : 1);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak * h[1], t + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0005, t + dd);
      o.connect(g); g.connect(out); o.start(t); o.stop(t + dd + 0.05);
    });
    return 3;
  }

  /** 鼓組：全部用雜訊或正弦＋包絡合成，音量刻意偏小（兒童友善） */
  function playDrum(ctx, out, name, t, vel) {
    var g = ctx.createGain(), src, filt;
    function noiseSrc(type, freq, q) {
      var s = ctx.createBufferSource(); s.buffer = noise(ctx);
      var fl = ctx.createBiquadFilter(); fl.type = type; fl.frequency.value = freq; if (q) fl.Q.value = q;
      s.connect(fl); fl.connect(g); return s;
    }
    function env(peak, len) { g.gain.setValueAtTime(peak * vel, t); g.gain.exponentialRampToValueAtTime(0.0005, t + len); return len; }
    var len;
    switch (name) {
      case 'kick':
        src = ctx.createOscillator(); src.type = 'sine';
        src.frequency.setValueAtTime(140, t); src.frequency.exponentialRampToValueAtTime(45, t + 0.12);
        src.connect(g); len = env(0.32, 0.22); break;
      case 'tom':
        src = ctx.createOscillator(); src.type = 'sine';
        src.frequency.setValueAtTime(140, t); src.frequency.exponentialRampToValueAtTime(85, t + 0.2);
        src.connect(g); len = env(0.24, 0.3); break;
      case 'snare':
        src = noiseSrc('bandpass', 1800, 0.8); len = env(0.11, 0.14);
        var o = ctx.createOscillator(), og = ctx.createGain(); o.type = 'triangle'; o.frequency.value = 190;
        og.gain.setValueAtTime(0.07 * vel, t); og.gain.exponentialRampToValueAtTime(0.0005, t + 0.08);
        o.connect(og); og.connect(out); o.start(t); o.stop(t + 0.1);
        break;
      case 'hat': src = noiseSrc('highpass', 7000); len = env(0.03, 0.04); break;
      case 'openhat': src = noiseSrc('highpass', 6500); len = env(0.025, 0.22); break;
      case 'cymbal': src = noiseSrc('highpass', 5000); len = env(0.035, 0.9); break;
      case 'wood':
        src = ctx.createOscillator(); src.type = 'sine'; src.frequency.value = 880;
        filt = ctx.createOscillator(); filt.type = 'sine'; filt.frequency.value = 1320;
        src.connect(g); filt.connect(g); len = env(0.07, 0.06);
        filt.start(t); filt.stop(t + len + 0.02); break;
      default: return 0;
    }
    g.connect(out);
    src.start(t); src.stop(t + len + 0.03);
    return 1;
  }

  function playEvent(ctx, out, track, ev, t, spb, accent) {
    var dur = ev.dur * spb, vel = accent ? 1 : 0.86, n = 0;
    if (ev.drums) { ev.drums.forEach(function (d) { n += playDrum(ctx, out, d, t, vel); }); return n; }
    var inst = INSTRUMENTS[track.instrument];
    if (!inst) return 0;
    var chordScale = ev.notes.length > 1 ? 1 / Math.sqrt(ev.notes.length) : 1;   // 和弦音多時每個音小聲一點
    ev.notes.forEach(function (m) {
      if (inst.kind === 'bell') n += playBell(ctx, out, inst, m, t, dur, vel * chordScale);
      else n += playTone(ctx, out, inst, m, t, dur, vel * chordScale);
    });
    return n;
  }

  // ================================================================ 播放器（一首曲子的排程狀態）
  function Player(song, ctx, bus, startTime, startBeat, fadeIn) {
    this.song = song; this.ctx = ctx;
    this.gain = ctx.createGain();
    this.gain.connect(bus);
    var now = ctx.currentTime;
    if (fadeIn > 0) { this.gain.gain.setValueAtTime(0, now); this.gain.gain.linearRampToValueAtTime(1, startTime + fadeIn); }
    else this.gain.gain.value = 1;
    this.trackGains = song.tracks.map(function (tr) { var g = ctx.createGain(); g.gain.value = tr.gain; g.connect(this.gain); return g; }, this);
    this.seek(startBeat || 0, startTime);
    this.stopped = false;
  }
  /** 從第 beat 拍開始，對齊到 atTime 秒 */
  Player.prototype.seek = function (beat, atTime) {
    var L = this.song.beats || 1;
    this.origin = atTime - beat * this.song.spb;   // 第 0 拍（第一次迴圈）的時間
    var iter = Math.floor(beat / L), inLoop = beat - iter * L;
    this.ptr = this.song.tracks.map(function (tr) {
      var i = 0; while (i < tr.events.length && tr.events[i].beat < inLoop - 1e-6) i++;
      return { i: i, iter: iter };
    });
  };
  /** 目前播到第幾拍（絕對拍數，迴圈會一直累加） */
  Player.prototype.position = function (t) { return Math.max(0, (t - this.origin) / this.song.spb); };
  Player.prototype.endTime = function () { return this.origin + this.song.duration; };
  /** 把 until 秒以前的音符排進 AudioContext */
  Player.prototype.schedule = function (until) {
    if (this.stopped) return 0;
    var s = this.song, spb = s.spb, L = s.beats, n = 0, now = this.ctx.currentTime;
    for (var k = 0; k < s.tracks.length; k++) {
      var tr = s.tracks[k], p = this.ptr[k];
      if (!tr.events.length) continue;
      for (var guard = 0; guard < 512; guard++) {
        if (p.i >= tr.events.length) {
          if (!s.loop) break;
          p.i = 0; p.iter++;
          if (k === 0) stats.loops++;
        }
        var ev = tr.events[p.i], beat = p.iter * L + ev.beat, t = this.origin + beat * spb;
        if (t >= until) break;
        if (t >= now - 0.01) { n += playEvent(this.ctx, this.trackGains[k], tr, ev, Math.max(t, now), spb, (ev.beat % s.meter) < 1e-6); stats.notes++; }
        p.i++;
      }
    }
    return n;
  };
  Player.prototype.stop = function (fadeSec) {
    if (this.stopped) return;
    this.stopped = true;
    var g = this.gain.gain, now = this.ctx.currentTime, f = Math.max(0.02, fadeSec || 0);
    try { g.cancelScheduledValues(now); g.setValueAtTime(g.value, now); g.linearRampToValueAtTime(0, now + f); } catch (e) { /* 忽略 */ }
    var gain = this.gain;
    setTimeout(function () { try { gain.disconnect(); } catch (e) { /* 忽略 */ } }, f * 1000 + 800);
  };

  // ================================================================ 音樂狀態與 API
  var LOOKAHEAD = 0.2, TICK_MS = 40, MUSIC_BASE = 0.6, LOWPASS_HZ = 6500, JINGLE_TAIL = 0.6, DUCK_LEVEL = 0.25;
  var S = {
    enabled: true, volume: 0.55, hidden: false,
    want: null,        // 想要播的 BGM（短曲結束、重新解鎖、分頁回來時會接續它）
    bgm: null, bgmId: null, held: null,   // held = { id, pos }：暫停時記住位置
    jingle: null,      // { id, player, cb, mode, end }
    bus: null, timer: null, cache: {}
  };
  var stats = { bgm: null, jingle: null, notes: 0, loops: 0, ticks: 0, jingles: 0, bgmStarts: 0, enabled: true, volume: S.volume, supported: false, lastError: null };

  function data() { return root.MUSIC || { bgm: {}, jingle: {} }; }
  function song(kind, id) {
    var key = kind + ':' + id, src = (data()[kind] || {})[id];
    if (!src) return null;
    if (!S.cache[key] || S.cache[key].src !== src) S.cache[key] = { src: src, song: compile(src, id) };
    return S.cache[key].song;
  }
  function supported() { return !!(root.AudioContext || root.webkitAudioContext); }
  function audioOut() {
    try {
      var A = root.JQ && root.JQ.Audio && root.JQ.Audio.context ? root.JQ.Audio.context() : null;
      return A && A.ctx && A.out ? A : null;
    } catch (e) { return null; }
  }
  function ensureBus(A) {
    if (S.bus && S.bus.ctx === A.ctx) return S.bus;
    var ctx = A.ctx, main = ctx.createGain(), lp = ctx.createBiquadFilter(), bgm = ctx.createGain(), jin = ctx.createGain();
    main.gain.value = S.volume * MUSIC_BASE;
    lp.type = 'lowpass'; lp.frequency.value = LOWPASS_HZ; lp.Q.value = 0.5;
    bgm.connect(main); jin.connect(main); main.connect(lp); lp.connect(A.out);
    S.bus = { ctx: ctx, main: main, bgm: bgm, jingle: jin };
    return S.bus;
  }
  function later(fn) { if (typeof fn === 'function') setTimeout(function () { try { fn(); } catch (e) { stats.lastError = String(e); } }, 0); }

  function ensureTimer() {
    stats.supported = supported();
    if (S.timer || !stats.supported) return;   // 沒有 AudioContext（node）就不開計時器
    S.timer = setInterval(tick, TICK_MS);
  }
  function stopTimer() { if (S.timer) { clearInterval(S.timer); S.timer = null; } }

  function startBgm(id, pos, fadeIn) {
    var A = audioOut(), sg = song('bgm', id);
    if (!A || !sg) return false;
    var bus = ensureBus(A), t0 = A.ctx.currentTime + 0.06;
    if (S.bgm) S.bgm.stop(0.7);
    S.bgm = new Player(sg, A.ctx, bus.bgm, t0, pos || 0, fadeIn);
    S.bgmId = id; S.held = null;
    stats.bgm = id; stats.bgmStarts++;
    S.bgm.schedule(A.ctx.currentTime + LOOKAHEAD);
    return true;
  }
  /** 暫停 BGM 並記住位置 */
  function holdBgm(fade) {
    if (!S.bgm) return;
    var A = audioOut();
    var pos = A && S.bgm.ctx === A.ctx ? S.bgm.position(A.ctx.currentTime) : 0;
    S.held = { id: S.bgmId, pos: pos };
    S.bgm.stop(fade || 0.12);
    S.bgm = null; S.bgmId = null; stats.bgm = null;
  }
  function finishJingle(cut) {
    var j = S.jingle;
    if (!j) return;
    S.jingle = null; stats.jingle = null;
    j.player.stop(cut ? 0.06 : 0.3);
    if (j.mode === 'duck' && S.bus) {
      var g = S.bus.bgm.gain, now = S.bus.ctx.currentTime;
      g.cancelScheduledValues(now); g.setValueAtTime(g.value, now); g.linearRampToValueAtTime(1, now + 0.5);
    }
    later(j.cb);
    // pause 模式：在下一次 tick 從記住的位置淡入接續 S.want
  }

  function tick() {
    stats.ticks++;
    try { step(); } catch (e) { stats.lastError = String(e && e.message || e); }
  }
  function step() {
    var A = audioOut();
    var active = !!A && S.enabled && !S.hidden;
    if (!active) {
      if (S.jingle) finishJingle(true);
      if (S.bgm) holdBgm(0.15);
      if (!S.want) stopTimer();
      return;
    }
    ensureBus(A);
    var now = A.ctx.currentTime, until = now + LOOKAHEAD;
    if (S.jingle) {
      S.jingle.player.schedule(until);
      if (now >= S.jingle.end) finishJingle(false);
    }
    if (!S.jingle && S.want && !S.bgm) {
      var resume = S.held && S.held.id === S.want;
      startBgm(S.want, resume ? S.held.pos : 0, resume ? 0.9 : 0.25);
    }
    if (S.bgm) S.bgm.schedule(until);
    if (!S.bgm && !S.jingle && !S.want) stopTimer();
  }

  function playBgm(id) {
    if (!song('bgm', id)) { stats.lastError = '找不到 BGM：' + id; return false; }
    if (S.want === id && (S.bgm || S.jingle)) return true;   // 同一首：繼續播
    S.want = id;
    if (!supported()) return false;
    if (S.jingle) { ensureTimer(); return true; }            // 短曲結束後才播
    var A = audioOut();
    if (A && S.enabled && !S.hidden) {
      var resume = S.held && S.held.id === id;
      startBgm(id, resume ? S.held.pos : 0, resume ? 0.9 : 0.3);
    }
    ensureTimer();   // 還沒解鎖聲音時，計時器會等到可以播再開始
    return true;
  }

  function stopBgm(fadeMs) {
    S.want = null; S.held = null;
    if (S.bgm) { S.bgm.stop((typeof fadeMs === 'number' ? fadeMs : 600) / 1000); S.bgm = null; }
    S.bgmId = null; stats.bgm = null;
  }

  function jingle(id, onEnd, opts) {
    var sg = song('jingle', id), A = supported() ? audioOut() : null;
    if (!sg || !A || !S.enabled || S.hidden) { if (!sg) stats.lastError = '找不到短曲：' + id; later(onEnd); return false; }
    var bus = ensureBus(A);
    if (S.jingle) finishJingle(true);   // 前一首短曲還沒播完：切掉（它的 onEnd 也會被呼叫）
    var mode = (opts && opts.bgm) || sg.bgmMode || 'pause', now = A.ctx.currentTime, delay = 0.05;
    if (mode === 'duck') {
      var g = bus.bgm.gain; g.cancelScheduledValues(now); g.setValueAtTime(g.value, now); g.linearRampToValueAtTime(DUCK_LEVEL, now + 0.08);
    } else if (S.bgm) { holdBgm(0.12); delay = 0.12; }
    var p = new Player(sg, A.ctx, bus.jingle, now + delay, 0, 0);
    S.jingle = { id: id, player: p, cb: onEnd, mode: mode, end: now + delay + sg.duration + JINGLE_TAIL };
    stats.jingle = id; stats.jingles++;
    p.schedule(now + LOOKAHEAD);
    ensureTimer();
    return true;
  }

  function setVolume(v) {
    v = Number(v); if (!isFinite(v)) return;
    S.volume = Math.max(0, Math.min(1, v)); stats.volume = S.volume;
    if (S.bus) { var g = S.bus.main.gain, now = S.bus.ctx.currentTime; try { g.cancelScheduledValues(now); g.setTargetAtTime(S.volume * MUSIC_BASE, now, 0.05); } catch (e) { g.value = S.volume * MUSIC_BASE; } }
  }

  function setEnabled(on) {
    S.enabled = !!on; stats.enabled = S.enabled;
    if (!S.enabled) { if (S.jingle) finishJingle(true); if (S.bgm) holdBgm(0.3); }
    else if (S.want) ensureTimer();   // 下一次 tick 從原位置接續
  }

  // 分頁隱藏時暫停、回來時接續
  if (typeof document !== 'undefined' && document.addEventListener) {
    document.addEventListener('visibilitychange', function () {
      S.hidden = document.visibilityState === 'hidden';
      if (S.hidden) { if (S.jingle) finishJingle(true); if (S.bgm) holdBgm(0.2); }
      else if (S.want) ensureTimer();
    });
  }

  function list() {
    var d = data(), out = [];
    ['bgm', 'jingle'].forEach(function (kind) {
      Object.keys(d[kind] || {}).forEach(function (id) { out.push(info(id, kind)); });
    });
    return out;
  }
  function info(id, kind) {
    kind = kind || ((data().bgm || {})[id] ? 'bgm' : 'jingle');
    var src = (data()[kind] || {})[id], sg = song(kind, id);
    if (!src || !sg) return null;
    return { id: id, kind: kind, name: src.name, key: src.key, tempo: sg.tempo, meter: sg.meter, beats: sg.beats,
      seconds: Math.round(sg.duration * 10) / 10, mood: src.mood, origin: src.origin, bgm: kind === 'jingle' ? sg.bgmMode : undefined,
      instruments: sg.tracks.map(function (t) { return t.instrument; }) };
  }

  var Music = {
    playBgm: playBgm, stopBgm: stopBgm, jingle: jingle, setVolume: setVolume, setEnabled: setEnabled, stats: stats,
    current: function () {
      var A = audioOut(), pos = S.bgm && A ? S.bgm.position(A.ctx.currentTime) : (S.held ? S.held.pos : 0);
      return { bgm: S.bgmId, want: S.want, jingle: S.jingle ? S.jingle.id : null, held: S.held ? S.held.id : null,
        beat: Math.round(pos * 100) / 100, enabled: S.enabled, volume: S.volume, running: !!S.timer };
    },
    isEnabled: function () { return S.enabled; },
    list: list, info: info,
    // 純計算工具（測試與試聽頁用）
    parse: parseNotes, compile: compile, expand: expand, noteToMidi: noteToMidi, midiToName: midiToName,
    INSTRUMENTS: Object.keys(INSTRUMENTS), INSTRUMENT_INFO: INSTRUMENTS, DRUMS: DRUM_NAMES
  };
  stats.supported = supported();

  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.Music = Music; }
  if (typeof module !== 'undefined' && module.exports) module.exports = Music;
})();
