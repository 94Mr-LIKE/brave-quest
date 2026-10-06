/* 音效：Web Audio 即時合成（不使用任何音檔）。第一次點擊時解鎖（iPad 需要使用者手勢才能出聲）。 */
(function () {
  'use strict';
  var ctx = null, enabled = true;

  function unlock() {
    try {
      if (!ctx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        ctx = new AC();
      }
      if (ctx.state === 'suspended') ctx.resume();
      // 播一個無聲的短音，讓 iOS 正式解鎖
      var b = ctx.createBuffer(1, 1, 22050), s = ctx.createBufferSource();
      s.buffer = b; s.connect(ctx.destination); s.start(0);
    } catch (e) { ctx = null; }
  }

  function tone(freq, start, dur, type, vol) {
    if (!ctx || !enabled) return;
    var t0 = ctx.currentTime + start;
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || 'square';
    o.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol || 0.08, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(ctx.destination);
    o.start(t0); o.stop(t0 + dur + 0.02);
  }

  function noise(start, dur, vol) {
    if (!ctx || !enabled) return;
    var len = Math.floor(ctx.sampleRate * dur);
    var b = ctx.createBuffer(1, len, ctx.sampleRate), d = b.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    var s = ctx.createBufferSource(), g = ctx.createGain();
    s.buffer = b; g.gain.value = vol || 0.06;
    s.connect(g); g.connect(ctx.destination);
    s.start(ctx.currentTime + start);
  }

  var SFX = {
    select: function () { tone(660, 0, 0.06, 'square', 0.05); },
    correct: function () { tone(784, 0, 0.1); tone(1047, 0.1, 0.18); },
    wrong: function () { tone(220, 0, 0.18, 'triangle', 0.09); tone(196, 0.16, 0.22, 'triangle', 0.08); },
    hit: function () { noise(0, 0.12, 0.08); tone(330, 0, 0.08, 'square', 0.05); },
    crit: function () { noise(0, 0.18, 0.1); tone(523, 0, 0.08); tone(784, 0.08, 0.08); tone(1047, 0.16, 0.16); },
    hurt: function () { noise(0, 0.2, 0.1); tone(140, 0, 0.2, 'sawtooth', 0.05); },
    levelup: function () { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, i * 0.1, 0.16); }); },
    chest: function () { tone(523, 0, 0.08); tone(659, 0.08, 0.08); tone(784, 0.16, 0.08); tone(1319, 0.26, 0.3, 'triangle', 0.08); },
    warp: function () { [392, 523, 659].forEach(function (f, i) { tone(f, i * 0.05, 0.1, 'triangle', 0.06); }); },
    win: function () { [659, 784, 880, 1047, 1319].forEach(function (f, i) { tone(f, i * 0.09, 0.18, 'square', 0.06); }); },
    encounter: function () { [880, 660, 880, 660].forEach(function (f, i) { tone(f, i * 0.06, 0.06, 'square', 0.05); }); },
    lamp: function () { tone(1047, 0, 0.3, 'triangle', 0.08); tone(1568, 0.12, 0.4, 'triangle', 0.06); },
    firework: function () { noise(0, 0.4, 0.07); }
  };

  function play(name) { try { if (SFX[name]) SFX[name](); } catch (e) { /* 沒有音效也不影響遊戲 */ } }
  function setEnabled(v) { enabled = !!v; }

  window.JQ = window.JQ || {};
  window.JQ.Audio = { unlock: unlock, play: play, setEnabled: setEnabled };
})();
