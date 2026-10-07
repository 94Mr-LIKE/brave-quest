/*
 * 聲音核心：共用一個 AudioContext，所有聲音都經過「主音量 → 壓縮限制器（DynamicsCompressor）」再輸出，
 * 防止爆音、讓各種音效音量一致（兒童友善：不刺耳、不突然大聲）。
 * 第一次點擊時解鎖（iPad 需要使用者手勢才能出聲）。不使用任何音檔。
 * 各種音效的實際合成在 sfx.js；這裡的 play(name) 會轉給 sfx.js。
 */
(function () {
  'use strict';
  var ctx = null, master = null, enabled = true;
  var MASTER_GAIN = 0.7;

  function build() {
    var comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -20; comp.knee.value = 12; comp.ratio.value = 10;
    comp.attack.value = 0.003; comp.release.value = 0.25;
    master = ctx.createGain();
    master.gain.value = MASTER_GAIN;
    master.connect(comp);
    comp.connect(ctx.destination);
  }

  function unlock() {
    try {
      if (!ctx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        ctx = new AC();
        build();
      }
      if (ctx.state === 'suspended') ctx.resume();
      // 播一個無聲的短音，讓 iOS 正式解鎖
      var b = ctx.createBuffer(1, 1, 22050), s = ctx.createBufferSource();
      s.buffer = b; s.connect(master); s.start(0);
    } catch (e) { ctx = null; master = null; }
  }

  /** 給 sfx.js／voice.js 用：沒有解鎖或關閉音效時回傳 null */
  function context() { return enabled && ctx && master ? { ctx: ctx, out: master } : null; }

  function play(name, arg) {
    if (!enabled || !ctx) return;
    try { if (window.JQ.Sfx) window.JQ.Sfx.play(name, arg); } catch (e) { /* 沒有音效也不影響遊戲 */ }
  }

  function setEnabled(v) { enabled = !!v; }

  window.JQ = window.JQ || {};
  window.JQ.Audio = { unlock: unlock, play: play, setEnabled: setEnabled, context: context, isEnabled: function () { return enabled; } };
})();
