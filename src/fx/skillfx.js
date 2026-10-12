/*
 * v1.0 第一批（48 號 v2 2.6、F10）：技能特效，全部用程式畫（26 號 5.4 的 20 種類型）。
 *
 * - 長度照技能的 fx.ms（400–2,200 毫秒），畫在戰鬥場景（Phaser Graphics、文字、粒子），不用圖檔。
 * - 點一下（滑鼠、觸控）或按任何鍵可以跳過。
 * - 閃光每秒最多 3 次（光敏安全）：所有閃光都經過 flash()，兩次之間至少隔 334 毫秒，太近的直接略過；
 *   每次閃光的時間記在 SkillFx.flashLog（測試檢查用）。
 * - 「減少動態效果」（家長設定，或系統的 prefers-reduced-motion）：不播特效，只顯示傷害、回復的數字。
 * - 技能圖示：用特效類型的小圖示（不另外畫）。
 */
(function () {
  'use strict';
  var J = window.JQ = window.JQ || {};

  var TYPES = ['slash', 'strike', 'fire', 'ice', 'thunder', 'wind', 'water', 'light', 'heal', 'buff', 'debuff', 'note', 'star', 'comic', 'summon', 'coin', 'smoke', 'arrow', 'wave', 'burst'];
  var ICON = { slash: '⚔️', strike: '👊', fire: '🔥', ice: '❄️', thunder: '⚡', wind: '🌪️', water: '💧', light: '✨', heal: '💚', buff: '🛡️',
    debuff: '🌀', note: '🎵', star: '⭐', comic: '😆', summon: '🐾', coin: '🪙', smoke: '💨', arrow: '🏹', wave: '🌊', burst: '💥' };
  var FLASH_GAP = 334;          // 毫秒：每秒最多 3 次
  var MIN_MS = 400, MAX_MS = 2200;

  function icon(sk) { return ICON[(sk && sk.fx && sk.fx.type) || ''] || '✨'; }
  function hex(c) { var n = parseInt(String(c || '#ffffff').replace('#', ''), 16); return isNaN(n) ? 0xffffff : n; }
  function rgb(c) { var n = hex(c); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }

  /** 減少動態效果：家長設定 settings.reduceMotion（'on'／'off'／'auto'，auto＝跟系統） */
  function reduced() {
    var st = J.Game && J.Game.state, v = st && st.settings && st.settings.reduceMotion;
    if (v === 'on') return true;
    if (v === 'off') return false;
    try { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) { return false; }
  }

  var SkillFx = { TYPES: TYPES, ICON: ICON, FLASH_GAP: FLASH_GAP, icon: icon, reduced: reduced, flashLog: [], playing: null, log: [] };

  /** 畫面閃光（每秒最多 3 次） */
  function flash(scene, ms, color) {
    var now = Date.now(), L = SkillFx.flashLog;
    if (L.length && now - L[L.length - 1] < FLASH_GAP) return false;
    L.push(now);
    if (L.length > 60) L.splice(0, L.length - 60);
    var c = rgb(color);
    scene.cameras.main.flash(Math.min(ms || 160, 220), c[0], c[1], c[2]);
    return true;
  }
  SkillFx.flash = flash;

  /** 這次閃光紀錄裡，任一 1 秒視窗內最多幾次（測試用） */
  SkillFx.maxFlashesPerSecond = function (log) {
    log = log || SkillFx.flashLog;
    var best = 0;
    for (var i = 0; i < log.length; i++) {
      var n = 0;
      for (var j = i; j < log.length && log[j] - log[i] < 1000; j++) n++;
      best = Math.max(best, n);
    }
    return best;
  };

  // ---------------------------------------------------------------- 20 種畫法
  // 每一種：function (ctx) — ctx = { scene, add(物件) 登記要清掉的物件, mx, my（怪物中心）, mw, mh, hx, hy（主角那一側：畫面下方中央）, W, H, color, c（數字色）, ms, tw(設定) }
  function tw(ctx, cfg) { cfg.targets = cfg.targets; return ctx.scene.tweens.add(cfg); }
  function later(ctx, ms, fn) { ctx.scene.time.delayedCall(ms, fn); }
  function sparks(ctx, x, y, n, opt) {
    var em = ctx.scene.add.particles(x, y, 'ui:spark', Object.assign({ speed: { min: 60, max: 220 }, lifespan: 500, scale: { start: 2.4, end: 0 }, tint: ctx.c, emitting: false }, opt || {}));
    em.setDepth(45); ctx.add(em); em.explode(n);
    return em;
  }
  function text(ctx, x, y, s, size, color) {
    var t = ctx.scene.add.text(x, y, s, { fontFamily: 'sans-serif', fontSize: (size || 32) + 'px', color: color || '#ffffff', stroke: '#2a1e22', strokeThickness: 4 }).setOrigin(0.5).setDepth(46);
    ctx.add(t); return t;
  }
  function gfx(ctx) { var g = ctx.scene.add.graphics().setDepth(44); ctx.add(g); return g; }
  function projectile(ctx, draw, after) {
    var g = gfx(ctx); draw(g); g.setPosition(ctx.hx, ctx.hy);
    tw(ctx, { targets: g, x: ctx.mx, y: ctx.my, duration: Math.max(200, ctx.ms * 0.45), ease: 'Quad.in', onComplete: function () { g.setVisible(false); if (after) after(); } });
  }

  var DRAW = {
    slash: function (ctx) {
      var n = 2;
      for (var i = 0; i < n; i++) (function (i) {
        later(ctx, i * ctx.ms * 0.3, function () {
          var g = gfx(ctx), d = i % 2 ? -1 : 1;
          g.lineStyle(6, ctx.c, 1); g.beginPath(); g.moveTo(-ctx.mw * 0.5 * d, -ctx.mh * 0.5); g.lineTo(ctx.mw * 0.5 * d, ctx.mh * 0.5); g.strokePath();
          g.lineStyle(2, 0xffffff, 1); g.beginPath(); g.moveTo(-ctx.mw * 0.45 * d, -ctx.mh * 0.45); g.lineTo(ctx.mw * 0.45 * d, ctx.mh * 0.45); g.strokePath();
          g.setPosition(ctx.mx, ctx.my).setScale(0.2);
          tw(ctx, { targets: g, scale: 1, alpha: 0, duration: ctx.ms * 0.4, ease: 'Quad.out' });
        });
      })(i);
    },
    strike: function (ctx) {
      for (var i = 0; i < 3; i++) (function (i) {
        later(ctx, i * ctx.ms * 0.22, function () {
          var g = gfx(ctx); g.lineStyle(5, ctx.c, 1); g.strokeCircle(0, 0, 18);
          g.setPosition(ctx.mx + (i - 1) * 18, ctx.my + (i % 2 ? -10 : 10));
          tw(ctx, { targets: g, scale: 3, alpha: 0, duration: ctx.ms * 0.35 });
          sparks(ctx, g.x, g.y, 8);
        });
      })(i);
    },
    fire: function (ctx) {
      projectile(ctx, function (g) { g.fillStyle(ctx.c, 1); g.fillCircle(0, 0, 16); g.fillStyle(0xfff0a0, 1); g.fillCircle(-4, -4, 7); }, function () {
        sparks(ctx, ctx.mx, ctx.my, 26, { tint: [ctx.c, 0xffd34d, 0xff3a1a], speed: { min: 80, max: 260 } });
        flash(ctx.scene, 150, ctx.color);
      });
    },
    ice: function (ctx) {
      for (var i = 0; i < 6; i++) (function (i) {
        later(ctx, i * ctx.ms * 0.08, function () {
          var g = gfx(ctx), x = ctx.mx + (i - 2.5) * ctx.mw * 0.18;
          g.fillStyle(ctx.c, 0.95); g.fillTriangle(-6, -18, 6, -18, 0, 16); g.lineStyle(2, 0xffffff, 1); g.strokeTriangle(-6, -18, 6, -18, 0, 16);
          g.setPosition(x, ctx.my - ctx.mh * 0.8);
          tw(ctx, { targets: g, y: ctx.my + (i % 2 ? 6 : -6), duration: ctx.ms * 0.35, ease: 'Quad.in', onComplete: function () { sparks(ctx, x, ctx.my, 5, { tint: 0xe8f8ff }); tw(ctx, { targets: g, alpha: 0, duration: 200 }); } });
        });
      })(i);
    },
    thunder: function (ctx) {
      var g = gfx(ctx), x = ctx.mx, y0 = 0, y1 = ctx.my, steps = 7;
      g.lineStyle(7, ctx.c, 1); g.beginPath(); g.moveTo(x, y0);
      for (var i = 1; i <= steps; i++) g.lineTo(x + (i % 2 ? 22 : -22) * (i < steps ? 1 : 0), y0 + (y1 - y0) * i / steps);
      g.strokePath();
      g.setAlpha(0);
      tw(ctx, { targets: g, alpha: 1, duration: 60, yoyo: true, hold: ctx.ms * 0.3, repeat: 1 });
      flash(ctx.scene, 180, ctx.color);
      later(ctx, ctx.ms * 0.4, function () { sparks(ctx, x, y1, 20, { tint: [ctx.c, 0xffffff] }); });
    },
    wind: function (ctx) {
      for (var i = 0; i < 4; i++) (function (i) {
        var g = gfx(ctx); g.lineStyle(4, ctx.c, 0.9); g.beginPath(); g.arc(0, 0, 26 + i * 10, 0, Math.PI * 1.4); g.strokePath();
        g.setPosition(ctx.mx, ctx.my).setAlpha(0.9);
        tw(ctx, { targets: g, angle: 540, scale: 1.4, alpha: 0, duration: ctx.ms, delay: i * 80 });
      })(i);
    },
    water: function (ctx) {
      for (var i = 0; i < 10; i++) (function (i) {
        later(ctx, i * ctx.ms * 0.05, function () {
          var g = gfx(ctx); g.fillStyle(ctx.c, 0.9); g.fillCircle(0, 0, 7); g.fillTriangle(-6, -2, 6, -2, 0, -14);
          g.setPosition(ctx.mx + (Math.random() - 0.5) * ctx.mw, ctx.my + ctx.mh * 0.3);
          tw(ctx, { targets: g, y: g.y - 60 - Math.random() * 40, alpha: 0, duration: ctx.ms * 0.5 });
        });
      })(i);
      var w = gfx(ctx); w.fillStyle(ctx.c, 0.5); w.fillRect(-ctx.mw * 0.7, -10, ctx.mw * 1.4, 20); w.setPosition(ctx.mx, ctx.my + ctx.mh * 0.4);
      tw(ctx, { targets: w, y: ctx.my - ctx.mh * 0.2, alpha: 0, duration: ctx.ms * 0.7 });
    },
    light: function (ctx) {
      for (var i = 0; i < 5; i++) (function (i) {
        var g = gfx(ctx); g.fillStyle(ctx.c, 0.55); g.fillRect(-7, -ctx.my, 14, ctx.my);
        g.setPosition(ctx.mx + (i - 2) * ctx.mw * 0.22, ctx.my).setScale(1, 0).setAlpha(0.9);
        tw(ctx, { targets: g, scaleY: 1, duration: ctx.ms * 0.3, delay: i * ctx.ms * 0.08, yoyo: true, hold: ctx.ms * 0.15 });
      })(i);
      later(ctx, ctx.ms * 0.45, function () { sparks(ctx, ctx.mx, ctx.my, 24, { tint: [ctx.c, 0xffffff] }); flash(ctx.scene, 140, ctx.color); });
    },
    heal: function (ctx) {
      for (var i = 0; i < 8; i++) (function (i) {
        later(ctx, i * ctx.ms * 0.07, function () {
          var t = text(ctx, ctx.hx + (Math.random() - 0.5) * 220, ctx.hy, '✚', 26 + Math.random() * 10, '#' + ('000000' + ctx.c.toString(16)).slice(-6));
          tw(ctx, { targets: t, y: t.y - 90, alpha: 0, duration: ctx.ms * 0.6 });
        });
      })(i);
      sparks(ctx, ctx.hx, ctx.hy - 10, 16, { speed: { min: 30, max: 120 }, gravityY: -120 });
    },
    buff: function (ctx) {
      var g = gfx(ctx); g.lineStyle(6, ctx.c, 1); g.strokeCircle(0, 0, 40); g.lineStyle(2, 0xffffff, 1); g.strokeCircle(0, 0, 34);
      g.setPosition(ctx.hx, ctx.hy - 30).setScale(0.3).setAlpha(0.95);
      tw(ctx, { targets: g, scale: 1.6, duration: ctx.ms * 0.5, ease: 'Back.out', onComplete: function () { tw(ctx, { targets: g, alpha: 0, duration: ctx.ms * 0.4 }); } });
      sparks(ctx, ctx.hx, ctx.hy - 30, 14, { speed: { min: 40, max: 140 } });
    },
    debuff: function (ctx) {
      for (var i = 0; i < 3; i++) (function (i) {
        var g = gfx(ctx); g.lineStyle(4, ctx.c, 0.9); g.beginPath(); g.arc(0, 0, 20 + i * 12, 0, Math.PI * 1.6); g.strokePath();
        g.setPosition(ctx.mx, ctx.my - ctx.mh * 0.45);
        tw(ctx, { targets: g, angle: -360, alpha: 0.2, duration: ctx.ms, delay: i * 90 });
      })(i);
      var t = text(ctx, ctx.mx + ctx.mw * 0.35, ctx.my - ctx.mh * 0.55, '💫', 30); tw(ctx, { targets: t, y: t.y - 12, duration: ctx.ms * 0.5, yoyo: true });
    },
    note: function (ctx) {
      var notes = ['♪', '♫', '♬', '♪', '♫'];
      notes.forEach(function (s, i) {
        later(ctx, i * ctx.ms * 0.12, function () {
          var t = text(ctx, ctx.hx + (i - 2) * 50, ctx.hy, s, 34, '#' + ('000000' + ctx.c.toString(16)).slice(-6));
          tw(ctx, { targets: t, x: ctx.mx + (i - 2) * 26, y: ctx.my - 20 + (i % 2) * 30, angle: i % 2 ? 20 : -20, duration: ctx.ms * 0.5, ease: 'Sine.inOut',
            onComplete: function () { tw(ctx, { targets: t, alpha: 0, duration: 200 }); } });
        });
      });
    },
    star: function (ctx) {
      for (var i = 0; i < 6; i++) (function (i) {
        later(ctx, i * ctx.ms * 0.1, function () {
          var g = gfx(ctx); g.fillStyle(ctx.c, 1);
          var pts = []; for (var k = 0; k < 10; k++) { var r = k % 2 ? 6 : 15, a = -Math.PI / 2 + k * Math.PI / 5; pts.push({ x: Math.cos(a) * r, y: Math.sin(a) * r }); }
          g.fillPoints(pts, true);
          g.setPosition(ctx.mx + (Math.random() - 0.5) * ctx.mw, ctx.my - ctx.mh * 0.9);
          tw(ctx, { targets: g, y: ctx.my + (Math.random() - 0.5) * ctx.mh * 0.4, angle: 180, duration: ctx.ms * 0.35, ease: 'Quad.in', onComplete: function () { sparks(ctx, g.x, g.y, 6); g.setVisible(false); } });
        });
      })(i);
    },
    comic: function (ctx) {
      var t = text(ctx, ctx.mx, ctx.my - ctx.mh * 0.6, '❗❓', 40); t.setScale(0.2);
      tw(ctx, { targets: t, scale: 1.2, duration: ctx.ms * 0.25, ease: 'Back.out' });
      var b = text(ctx, ctx.mx - ctx.mw * 0.4, ctx.my + ctx.mh * 0.35, '🍌', 30);
      tw(ctx, { targets: b, angle: 360, x: ctx.mx + ctx.mw * 0.3, duration: ctx.ms * 0.6 });
      later(ctx, ctx.ms * 0.4, function () { var h = text(ctx, ctx.mx + ctx.mw * 0.4, ctx.my - ctx.mh * 0.2, '哈哈！', 26, '#ffe45c'); tw(ctx, { targets: h, y: h.y - 24, alpha: 0, duration: ctx.ms * 0.5 }); });
    },
    summon: function (ctx) {
      for (var i = 0; i < 4; i++) (function (i) {
        later(ctx, i * ctx.ms * 0.12, function () {
          var t = text(ctx, -30, ctx.my + ctx.mh * 0.25 - i * 14, '🐾', 30);
          tw(ctx, { targets: t, x: ctx.mx + (i - 1.5) * 30, duration: ctx.ms * 0.35, ease: 'Quad.out', onComplete: function () { sparks(ctx, t.x, t.y, 6); tw(ctx, { targets: t, alpha: 0, duration: 200 }); } });
        });
      })(i);
    },
    coin: function (ctx) {
      for (var i = 0; i < 12; i++) (function (i) {
        later(ctx, i * ctx.ms * 0.05, function () {
          var g = gfx(ctx); g.fillStyle(ctx.c, 1); g.fillEllipse(0, 0, 18, 18); g.lineStyle(2, 0x8a5a00, 1); g.strokeEllipse(0, 0, 18, 18); g.fillStyle(0xfff6c0, 1); g.fillRect(-2, -5, 4, 10);
          g.setPosition(ctx.mx + (Math.random() - 0.5) * ctx.mw * 1.2, ctx.my - ctx.mh * 0.9);
          tw(ctx, { targets: g, y: ctx.my + ctx.mh * 0.3, scaleX: 0.3, duration: ctx.ms * 0.4, ease: 'Quad.in', yoyo: false, onComplete: function () { g.setVisible(false); } });
        });
      })(i);
    },
    smoke: function (ctx) {
      for (var i = 0; i < 7; i++) (function (i) {
        var g = gfx(ctx); g.fillStyle(ctx.c, 0.7); g.fillCircle(0, 0, 18 + (i % 3) * 6);
        g.setPosition(ctx.hx + (i - 3) * 30, ctx.hy - 10).setScale(0.4);
        tw(ctx, { targets: g, scale: 1.6, alpha: 0, y: g.y - 40, duration: ctx.ms * 0.8, delay: i * 40 });
      })(i);
    },
    arrow: function (ctx) {
      for (var i = 0; i < 3; i++) (function (i) {
        later(ctx, i * ctx.ms * 0.15, function () {
          var g = gfx(ctx); g.lineStyle(3, ctx.c, 1); g.beginPath(); g.moveTo(0, 18); g.lineTo(0, -18); g.strokePath(); g.fillStyle(ctx.c, 1); g.fillTriangle(-6, -14, 6, -14, 0, -24);
          var sx = ctx.hx + (i - 1) * 60, tx = ctx.mx + (i - 1) * 20;
          g.setPosition(sx, ctx.hy).setRotation(Math.atan2(ctx.my - ctx.hy, tx - sx) + Math.PI / 2);
          tw(ctx, { targets: g, x: tx, y: ctx.my, duration: ctx.ms * 0.3, ease: 'Quad.in', onComplete: function () { sparks(ctx, tx, ctx.my, 6); g.setVisible(false); } });
        });
      })(i);
    },
    wave: function (ctx) {
      var g = gfx(ctx); g.fillStyle(ctx.c, 0.75);
      g.beginPath(); g.moveTo(-ctx.W, 40); for (var x = -ctx.W; x <= ctx.W; x += 20) g.lineTo(x, Math.sin(x / 40) * 14); g.lineTo(ctx.W, 40); g.closePath(); g.fillPath();
      g.setPosition(-ctx.W * 0.5, ctx.my + ctx.mh * 0.2);
      tw(ctx, { targets: g, x: ctx.W * 1.5, duration: ctx.ms * 0.8, ease: 'Sine.inOut' });
      later(ctx, ctx.ms * 0.4, function () { sparks(ctx, ctx.mx, ctx.my, 18, { tint: [ctx.c, 0xffffff] }); });
    },
    burst: function (ctx) {
      var g = gfx(ctx); g.fillStyle(ctx.c, 0.85);
      var pts = []; for (var k = 0; k < 24; k++) { var r = k % 2 ? 22 : 50, a = k * Math.PI / 12; pts.push({ x: Math.cos(a) * r, y: Math.sin(a) * r }); }
      g.fillPoints(pts, true); g.setPosition(ctx.mx, ctx.my).setScale(0.2);
      tw(ctx, { targets: g, scale: 1.8, alpha: 0, duration: ctx.ms * 0.6, ease: 'Quad.out' });
      sparks(ctx, ctx.mx, ctx.my, 30, { speed: { min: 120, max: 320 } });
      flash(ctx.scene, 160, ctx.color);
    }
  };
  SkillFx.DRAW = DRAW;

  /**
   * 播放技能特效。scene＝BattleScene；use＝Battle.useSkill 的結果（random 抽到回復時改用回復的畫法）。
   * done 一定只呼叫一次（播完、跳過、或減少動態效果時馬上）。
   */
  SkillFx.play = function (scene, skill, use, done) {
    var called = false, finish = function () { if (called) return; called = true; cleanup(); if (done) done(); };
    var fx = (skill && skill.fx) || {}, type = fx.type;
    if (use && use.eff === 'heal' && use.picked) type = 'heal';
    var ms = Math.max(MIN_MS, Math.min(MAX_MS, Number(fx.ms) || 700));
    SkillFx.log.push({ id: skill && skill.id, type: type, ms: ms, reduced: reduced(), at: Date.now() });
    if (SkillFx.log.length > 40) SkillFx.log.shift();
    var cleanup = function () {};
    if (!scene || !scene.sys || !scene.sys.isActive() || reduced() || !DRAW[type]) { finish(); return; }
    var C = J.CONFIG || {}, W = C.VIEW_W || 640, H = C.VIEW_H || 360, m = scene.monster;
    var objs = [];
    var ctx = { scene: scene, add: function (o) { objs.push(o); return o; }, W: W, H: H, color: fx.color, c: hex(fx.color), ms: ms,
      mx: m ? m.x : W / 2, my: m ? m.y - m.displayHeight / 2 : H / 2, mw: m ? Math.max(60, m.displayWidth) : 100, mh: m ? Math.max(60, m.displayHeight) : 100,
      hx: W / 2, hy: H - 30 };
    var label = scene.add.text(W - 8, 8, '點一下跳過 ▶▶', { fontFamily: 'sans-serif', fontSize: '14px', color: '#ffffff', backgroundColor: 'rgba(0,0,0,0.45)', padding: { x: 6, y: 3 } }).setOrigin(1, 0).setDepth(60);
    objs.push(label);
    var timer = null;
    var onKey = function (e) { if (e && (e.key === 'Tab' || e.key === 'Shift')) return; finish(); };
    var onPtr = function () { finish(); };
    cleanup = function () {
      SkillFx.playing = null;
      document.removeEventListener('keydown', onKey, true);
      document.removeEventListener('pointerdown', onPtr, true);
      if (timer) { try { timer.remove(false); } catch (e) { /* 忽略 */ } }
      objs.forEach(function (o) { try { scene.tweens.killTweensOf(o); o.destroy(); } catch (e) { /* 場景已經關了 */ } });
      objs = [];
    };
    SkillFx.playing = { id: skill && skill.id, type: type, ms: ms, skip: finish };
    try { DRAW[type](ctx); } catch (e) { finish(); return; }
    timer = scene.time.delayedCall(ms, finish);
    // 下一個事件迴圈才開始聽「跳過」，免得選技能的那一下就把特效跳掉
    setTimeout(function () { if (called) return; document.addEventListener('keydown', onKey, true); document.addEventListener('pointerdown', onPtr, true); }, 0);
  };

  J.SkillFx = SkillFx;
})();
