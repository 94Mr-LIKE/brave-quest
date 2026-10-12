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
  // v1.0.1（老闆實測「手機使用時，廟公語音消失」）：手機（尤其 iPhone）會在背景切換、來電、語音合成（speechSynthesis）講話、
  // 鎖螢幕之後把 AudioContext 暫停（suspended／interrupted），以前只在標題畫面點一下時解鎖一次，之後就一直沒聲音：
  // 預錄的台語語音（廟公的台詞全部是預錄台語）、音樂、音效都走 Web Audio，只剩華語的語音合成有聲音。
  // 修正：每次點畫面、按鍵都檢查一次，沒在跑就恢復；播語音前也先恢復（voice.js playFile）。
  var stats = { unlocks: 0, resumes: 0, resumed: 0, gestureResumes: 0, states: [] };

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
        // iPhone 的靜音開關：Web Audio 預設跟著靜音（語音合成照樣有聲音）。iOS 17 起可以宣告這是「播放」用途，靜音開關就不會擋掉遊戲語音
        try { if (navigator.audioSession && navigator.audioSession.type !== 'playback') navigator.audioSession.type = 'playback'; } catch (e) { /* 不支援就算了 */ }
        try { ctx.onstatechange = function () { stats.states.push(ctx.state); if (stats.states.length > 20) stats.states.shift(); }; } catch (e) { /* 忽略 */ }
      }
      if (ctx.state !== 'running') { stats.resumes++; var pr = ctx.resume(); if (pr && pr.then) pr.then(function () { if (ctx && ctx.state === 'running') stats.resumed++; }, function () {}); }
      stats.unlocks++;
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

  var RESUME_WAIT_MS = 800;
  /**
   * 沒在跑就試著恢復（不是使用者手勢時，瀏覽器可能不讓恢復）。回傳 Promise<boolean>（現在是不是在跑）。
   * v1.0.1 審查：瀏覽器不准播放時 ctx.resume() 的 promise 會一直停在等待中（iOS 中斷時也是），
   * 所以和 RESUME_WAIT_MS 的計時器競賽；逾時就回傳當下狀態，讓 voice.js 改用 <audio> 或退回提示音＋華語，不會整句沒聲音。
   */
  function ensureRunning() {
    if (!ctx) return Promise.resolve(false);
    if (ctx.state === 'running') return Promise.resolve(true);
    if (ctx.state === 'closed') return Promise.resolve(false);
    stats.resumes++;
    try {
      var done = false, tid = null;
      var pr = Promise.resolve(ctx.resume()).then(function () { return ctx.state === 'running'; }, function () { return false; });
      var timer = new Promise(function (res) {
        tid = setTimeout(function () { if (!done) stats.resumeTimeouts = (stats.resumeTimeouts || 0) + 1; res(ctx.state === 'running'); }, RESUME_WAIT_MS);
      });
      return Promise.race([pr, timer]).then(function (ok) { done = true; if (tid) clearTimeout(tid); if (ok) stats.resumed++; return ok; });
    } catch (e) { return Promise.resolve(false); }
  }

  // 每次點畫面、按鍵（使用者手勢）：已經解鎖過、但被系統暫停了 → 重新解鎖（恢復＋播一個無聲短音）
  function onGesture() { if (ctx && ctx.state !== 'running' && ctx.state !== 'closed') { stats.gestureResumes++; unlock(); } }
  if (typeof document !== 'undefined' && document.addEventListener) {
    ['pointerdown', 'touchend', 'keydown', 'click'].forEach(function (ev) { document.addEventListener(ev, onGesture, { capture: true, passive: true }); });
  }

  window.JQ = window.JQ || {};
  /**
   * v1.0.1：存檔裡關掉音樂 → music.js 一定義好 JQ.Music 就馬上關掉。
   * music.js 載入 0.8 秒後會預先下載標題曲；以前要等標題畫面讀完存檔才關，電腦忙、頁面載入慢時標題曲已經先下載了（smoke 抓到）。
   * 這個檔案在 music.js 前面載入：只讀存檔、不寫；讀不到就照原本的流程（標題畫面再判斷一次）。不改 music.js（配樂組的檔案）
   */
  (function () {
    var off = false;
    try { var raw = window.localStorage.getItem('bq_save'), s = raw && JSON.parse(raw); off = !!(s && s.settings && s.settings.music === false); } catch (e) { off = false; }
    if (!off || 'Music' in window.JQ) return;
    var val;
    try {
      Object.defineProperty(window.JQ, 'Music', { configurable: true, enumerable: true, get: function () { return val; },
        set: function (m) { val = m; try { if (m && typeof m.setEnabled === 'function') m.setEnabled(false); } catch (e) { /* 忽略 */ } } });
    } catch (e) { /* 忽略 */ }
  })();
  window.JQ.Audio = { unlock: unlock, play: play, setEnabled: setEnabled, context: context, ensureRunning: ensureRunning, stats: stats, isEnabled: function () { return enabled; } };
})();
