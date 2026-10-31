/*
 * 頭目與怪物的戰鬥演出：畫面（v1.4 桃竹章起）。規則在 systems/bossfx.js（JQ.BossFx，可以在 node 測試）。
 *
 * 掛法：這個檔在 game.js 之後、main.js 之前載入，把下面幾個方法「包一層」（不改原文；其他整合包改那些檔案不會互相蓋掉，同 v4.0 east_fx.js）：
 *   BattleScene：create（掛上演出）、hitEffect（主角打中）、hurtEffect（怪物攻擊）、phaseEffect（頭目換階段）、wakeEffect（打倒）
 *   MapScene：create（M16 新竹風城的風）
 *   Game.bmsg：怪物攻擊訊息裡的「撞了過來！」換成這隻怪物的說法（只換字，傷害數字不變）；頭目換階段的訊息後面接一句說明（水門打開、齒輪露出）
 *   表上沒有的怪物、地圖：每個包裝都直接走原本的流程（畫面與行為完全不變）。
 *
 * 只改畫面與節奏：不讀寫存檔、不改戰鬥數值（只讀 battleCtx.b 的 phase）。
 * 兒童畫面：閃光每秒最多 3 次（和技能特效共用 SkillFx.flashLog）；雷咚咚的閃光是淡黃色、最亮 22% 的柔光（淡入淡出，不是頻閃）；
 *   不出現黑畫面、尖叫或嚇人的圖；齒輪慢慢轉（6 秒一圈）。
 * 減少動態效果（家長設定或系統 prefers-reduced-motion）：本檔不建立任何動畫（tween）、不閃光、不晃動、不放粒子；
 *   改成靜態的圖（關著的水門、水花、齒輪、霧）和字（「鏘！」「咚！」「咻——」「水花泡泡！」），一段時間後消失；地圖上的風不畫。
 * 任何一步出錯都只寫 console.warn，原本的戰鬥流程照走（不會卡關）。
 */
(function () {
  'use strict';
  var J = window.JQ = window.JQ || {};
  var R = J.BossFx;
  var FONT = '"Microsoft JhengHei","PingFang TC","Noto Sans TC",sans-serif';
  var DEPTH = { OVER: 1, WIND: 5, FLOW: 6, BUBBLE: 45, FLASH: 55, TEXT: 58 };
  var MAP_DEPTH = 57000;            // 地圖上的風：在地圖、角色、前景之上，在除錯格子（60000）、讀不到地圖的提示（70000）之下
  var SOFT_FLASH = { color: 0xfff1b8, peak: 0.22, ms: 300 };
  var GEAR_TURN_MS = 6000;          // 齒輪一圈 6 秒（慢慢轉，不是閃爍）
  /**
   * 圖上的位置（比例；原點＝怪物腳底中央，x 往右、y 往上是負的；乘上怪物顯示的寬、高）。美術換圖時改這裡。
   * 霧閘機將 boss_mb_floodgate.png 165×160：胸口齒輪約 (80,65)；中間出水口與閘門約 x 55–110、y 100–150。雷咚咚 mon_wx_thunder.png 93×96：小鼓約 (37,72)。
   */
  var GEO = {
    floodgate: { gear: { x: -0.015, y: -0.59, r: 0.09 }, gate: { x0: -0.17, x1: 0.17, y0: -0.40, y1: -0.07 }, spout: { x: 0, y: -0.24 } },
    drum: { x: -0.10, y: -0.25 }
  };
  var Scene = { log: [], flashLog: [], wrapped: [], GEO: GEO, DEPTH: DEPTH, MAP_DEPTH: MAP_DEPTH, SOFT_FLASH: SOFT_FLASH, GEAR_TURN_MS: GEAR_TURN_MS };
  Scene.now = function () { return Date.now(); };   // 測試可以換掉

  function logp(x) { var L = Scene.log; L.push(x); if (L.length > 200) L.splice(0, L.length - 200); }
  function view() { var C = J.CONFIG || {}; return { W: C.VIEW_W || 640, H: C.VIEW_H || 360 }; }
  function reduced() {
    var g = J.Game, st = g && g.state;
    var mm = (typeof window !== 'undefined' && window.matchMedia) ? function (q) { return window.matchMedia(q); } : null;
    return R.reducedFrom(st && st.settings, mm);
  }
  function flashLog() { return (J.SkillFx && J.SkillFx.flashLog) || Scene.flashLog; }
  function warn(e, where) { try { console.warn('[頭目演出] ' + where + '：' + ((e && e.message) || e)); } catch (x) { /* 沒有 console */ } }
  function safe(fn, self, where) { try { return fn.call(self); } catch (e) { warn(e, where); return null; } }
  function rnd(a, b) { return a + Math.random() * (b - a); }

  // ═════════════════════ 一場戰鬥的演出 ═════════════════════
  function Fx(scene, st) {
    var V = view(), m = scene.monster;
    this.scene = scene; this.st = st; this.reduced = reduced();
    this.W = V.W; this.H = V.H;
    this.footX = m ? m.x : V.W / 2; this.footY = m ? m.y : V.H * 0.7;
    this.dw = m ? Math.max(40, m.displayWidth) : 100; this.dh = m ? Math.max(40, m.displayHeight) : 100;
    this.baseScale = scene.baseScale || (m && m.scaleX) || 1;
    this.box = null; this.puffs = []; this.slats = []; this.drops = []; this.gear = null; this.gearSpin = null; this.glow = null;
    this.fountainEv = null; this.wind = null; this.flow = null;
    this.pendingVerb = null; this.pendingNote = null; this.flashes = []; this.tweens = 0;
  }
  Fx.prototype.tw = function (cfg) { this.tweens += 1; return this.scene.tweens.add(cfg); };   // 只在沒有「減少動態效果」時呼叫
  Fx.prototype.later = function (ms, fn) { var self = this; return this.scene.time.delayedCall(ms, function () { safe(fn, self, '延後的演出'); }); };
  Fx.prototype.gfx = function (inBox, depth) {
    var g = this.scene.add.graphics();
    if (inBox && this.box) this.box.add(g); else g.setDepth(depth === undefined ? DEPTH.BUBBLE : depth);
    return g;
  };
  Fx.prototype.text = function (x, y, s, style, inBox, depth) {
    var t = this.scene.add.text(x, y, s, Object.assign({ fontFamily: FONT, fontSize: '22px', color: '#ffffff', stroke: '#1d2333', strokeThickness: 4 }, style || {})).setOrigin(0.5);
    if (inBox && this.box) this.box.add(t); else t.setDepth(depth === undefined ? DEPTH.TEXT : depth);
    return t;
  };
  /** 比例 → 容器裡的座標 */
  Fx.prototype.px = function (p) { return { x: p.x * this.dw, y: p.y * this.dh }; };
  /** 容器裡的座標 → 畫面座標（容器跟著怪物） */
  Fx.prototype.world = function (lx, ly) { var b = this.box; return b ? { x: b.x + lx * b.scaleX, y: b.y + ly * b.scaleY } : { x: this.footX + lx, y: this.footY + ly }; };
  /** 一段時間後拿掉（不用動畫） */
  Fx.prototype.dropLater = function (o, ms) { this.later(ms, function () { if (o && o.destroy) o.destroy(); }); };
  /** 淡出後拿掉；減少動態效果時直接拿掉 */
  Fx.prototype.fadeOut = function (o, ms, extra) {
    if (!o) return;
    if (this.reduced) { if (o.destroy) o.destroy(); return; }
    var cfg = { targets: o, alpha: 0, duration: ms || 400, onComplete: function () { if (o.destroy) o.destroy(); } };
    if (extra) Object.keys(extra).forEach(function (k) { cfg[k] = extra[k]; });
    this.tw(cfg);
  };

  /** 柔和閃光（淡黃色、最亮 22%、淡入淡出）；每秒最多 3 次；減少動態效果時不閃 */
  Fx.prototype.softFlash = function () {
    if (this.reduced) return false;
    var now = Scene.now();
    if (!R.allowFlash(flashLog(), now)) { logp('flash:skip'); return false; }
    this.flashes.push(now); logp('flash');
    var r = this.scene.add.rectangle(0, 0, this.W, this.H, SOFT_FLASH.color, 1).setOrigin(0, 0).setAlpha(0).setDepth(DEPTH.FLASH);
    this.tw({ targets: r, alpha: SOFT_FLASH.peak, duration: Math.round(SOFT_FLASH.ms * 0.35), yoyo: true, onComplete: function () { r.destroy(); } });
    return true;
  };

  /** 掛上：跟著怪物的容器、每格同步位置；演戰鬥開始的提示 */
  Fx.prototype.build = function () {
    var sc = this.scene, m = sc.monster, self = this;
    if (this.st.script && m) {
      this.box = sc.add.container(m.x, m.y).setDepth(DEPTH.OVER);
      this.onUpdate = function () { self.sync(); };
      sc.events.on('update', this.onUpdate);
      sc.events.once('shutdown', function () { self.shutdown(); });
    }
    this.play(R.start(this.st));
  };
  Fx.prototype.sync = function () {
    var m = this.scene.monster, b = this.box;
    if (!m || !b) return;
    b.setPosition(m.x, m.y);
    var bs = this.baseScale || 1;
    b.setScale((m.scaleX || bs) / bs, (m.scaleY || bs) / bs);
    b.setAngle(m.angle || 0);
    b.setAlpha(m.alpha === undefined ? 1 : m.alpha);
  };
  Fx.prototype.shutdown = function () {
    if (this.onUpdate) { try { this.scene.events.off('update', this.onUpdate); } catch (e) { /* 場景已經關了 */ } this.onUpdate = null; }
    if (this.fountainEv) { try { this.fountainEv.remove(false); } catch (e) { /* 忽略 */ } this.fountainEv = null; }
  };
  /** 依序演一串提示 */
  Fx.prototype.play = function (cues) {
    var self = this;
    (cues || []).forEach(function (c) {
      var d = DRAW[c.id];
      logp('cue:' + c.id + (self.reduced ? ':reduced' : ''));
      if (d) safe(function () { d(self, c); }, self, c.id); else if (c.id) warn('沒有畫法', c.id);
    });
  };
  Fx.prototype.hit = function (crit) {
    var g = J.Game, b = g && g.battleCtx && g.battleCtx.b;
    this.play(R.onHit(this.st, { crit: !!crit, over: !!(b && b.over) }));
  };
  /** 怪物攻擊之前：決定這次要不要換掉原本的閃光、晃動，記下訊息要換的字 */
  Fx.prototype.attackPlan = function () {
    var p = R.onAttack(this.st), self = this;
    this.pendingVerb = p.verb;
    if (p.verb) setTimeout(function () { self.pendingVerb = null; }, 0);   // 只給緊接著的那一句攻擊訊息用
    return p;
  };
  Fx.prototype.playAttack = function (p) { this.play(p && p.cues); };
  Fx.prototype.phase = function (n) {
    var self = this, note = R.phaseNote(this.st, n);
    // 換階段的說明接在緊接著的那一句戰鬥訊息後面（game.js：phaseEffect 之後馬上寫「生氣了！攻擊變強了！」）
    if (note) { this.pendingNote = note; setTimeout(function () { self.pendingNote = null; }, 0); }
    // 先讓原本的「生氣了」演完（閃一下、晃 0.4 秒），再換場景（關水門 → 放水花 → 齒輪露出）；演出狀態也等畫面換了才換
    if (this.reduced) this.play(R.onPhase(this.st, n)); else this.later(650, function () { self.play(R.onPhase(self.st, n)); });
  };
  Fx.prototype.wake = function () { this.play(R.onWake(this.st)); };
  /** 戰鬥訊息：攻擊的「撞了過來！」換字、換階段接說明（各只用一次） */
  Fx.prototype.decorateMsg = function (text) {
    if (this.pendingVerb) { text = R.attackText(text, this.pendingVerb); this.pendingVerb = null; }
    if (this.pendingNote) { text = R.withNote(text, this.pendingNote); this.pendingNote = null; }
    return text;
  };
  /** 測試、除錯用：目前的演出狀態 */
  Fx.prototype.info = function () {
    var st = this.st, vis = function (a) { return a.filter(function (o) { return o && o.visible !== false && o.active !== false; }).length; };
    return { id: st.id, kind: st.kind, phase: st.phase, fog: st.fog, gates: st.gates, fountain: st.fountain, gear: st.gear, flow: st.flow,
      attacks: st.attacks, hits: st.hits, woke: st.woke, reduced: this.reduced, ambience: st.ambience ? st.ambience.kind : null,
      puffs: vis(this.puffs), slats: vis(this.slats), wind: this.wind ? this.wind.length : 0, flashes: this.flashes.slice(), tweens: this.tweens };
  };

  // ═════════════════════ 畫法（cue id → 函式）═════════════════════
  function drawPuff(g, r) {
    g.fillStyle(0xc9d3dc, 0.82); g.fillCircle(0, 0, r);
    g.fillStyle(0xe9eef3, 0.7); g.fillCircle(-r * 0.32, -r * 0.3, r * 0.58);
    g.fillStyle(0xaab6c2, 0.55); g.fillCircle(r * 0.35, r * 0.25, r * 0.5);
  }
  function drawSlat(g, w, h) {
    g.fillStyle(0x7d93ab, 1); g.fillRect(-w / 2, 0, w, h);
    g.fillStyle(0x9fb3c8, 1); for (var y = 6; y < h - 2; y += 9) g.fillRect(-w / 2 + 2, y, w - 4, 2);
    g.lineStyle(2, 0x2e3d4f, 1); g.strokeRect(-w / 2, 0, w, h);
    g.fillStyle(0x2e3d4f, 1); g.fillCircle(-w / 2 + 4, 4, 1.6); g.fillCircle(w / 2 - 4, 4, 1.6);
  }
  function drawGear(g, r) {
    var pts = [];
    for (var k = 0; k < 32; k++) { var a = k * Math.PI / 16, rr = k % 4 < 2 ? r : r * 0.78; pts.push({ x: Math.cos(a) * rr, y: Math.sin(a) * rr }); }
    g.fillStyle(0xd9902e, 1); g.fillPoints(pts, true);
    g.lineStyle(2, 0x7a4a14, 1); g.strokePoints(pts, true);
    g.fillStyle(0xf2b950, 1); g.fillCircle(0, 0, r * 0.6);
    g.fillStyle(0x7a4a14, 1); g.fillCircle(0, 0, r * 0.22);
  }
  function drawDrop(g, r) { g.fillStyle(0x9fdcff, 0.9); g.fillCircle(0, 0, r); g.fillStyle(0xffffff, 0.9); g.fillCircle(-r * 0.35, -r * 0.35, r * 0.35); }
  function drawBubble(g, r) { g.fillStyle(0x9fdcff, 0.45); g.fillCircle(0, 0, r); g.lineStyle(2, 0xffffff, 0.9); g.strokeCircle(0, 0, r); g.fillStyle(0xffffff, 0.95); g.fillCircle(-r * 0.4, -r * 0.4, r * 0.25); }

  /** 拿掉前面 n 團霧（先拿中間蓋住齒輪的那一團）；blow＝被風吹走的樣子 */
  function takePuffs(fx, n, blow) {
    var left = fx.puffs.filter(function (p) { return p.visible !== false && p.active !== false; });
    left.slice(0, Math.max(0, n)).forEach(function (p) {
      if (fx.reduced) { p.setVisible(false); return; }
      fx.scene.tweens.killTweensOf(p);   // 先停掉「慢慢鼓起來」那一段，免得兩段動畫搶 scale
      fx.tw({ targets: p, x: p.x + fx.dw * 0.45, y: p.y - fx.dh * 0.08, alpha: 0, scale: 1.35, duration: blow ? 650 : 500, ease: 'Sine.out', onComplete: function () { p.setVisible(false); } });
    });
  }
  function breeze(fx, at) {
    if (fx.reduced) return;
    for (var i = 0; i < 2; i++) {
      var g = fx.gfx(true);
      g.lineStyle(3, 0xffffff, 0.85); g.beginPath(); g.arc(0, 0, 12 + i * 6, Math.PI * 0.9, Math.PI * 1.9, false); g.strokePath();
      g.setPosition(at.x - fx.dw * 0.25, at.y + (i ? 8 : -8));
      fx.fadeOut(g, 600, { x: at.x + fx.dw * 0.4 });
    }
  }
  /**
   * 風：細細的白線和幾片葉子往同一邊飄（每條 1.5–2.4 秒飄過畫面，葉子 2.6–3.4 秒，平順移動、不閃）。
   * opt = { n, leaves, dir, W, y0, y1, depth, fixed（地圖：不跟著鏡頭）, tw（建立動畫） }
   */
  function windStreaks(scene, opt) {
    var out = [], W = opt.W, dir = opt.dir || 1;
    function one(isLeaf, i) {
      var g = scene.add.graphics().setDepth(opt.depth), len = isLeaf ? 6 : Math.round(rnd(40, 90));
      if (opt.fixed && g.setScrollFactor) g.setScrollFactor(0);
      if (isLeaf) { g.fillStyle(0x8ccf6a, 0.95); g.fillEllipse(0, 0, 9, 4); g.lineStyle(1, 0x4f8a3a, 1); g.lineBetween(-4, 0, 4, 0); }
      else { g.lineStyle(2, 0xffffff, rnd(0.32, 0.5)); g.lineBetween(0, 0, -dir * len, 0); g.lineStyle(1, 0xffffff, 0.25); g.lineBetween(-dir * len, 0, -dir * len * 1.4, 1); }
      var from = dir > 0 ? -len * 1.5 - 20 : W + len * 1.5 + 20, to = dir > 0 ? W + len * 1.5 + 20 : -len * 1.5 - 20;
      g.setPosition(from, rnd(opt.y0, opt.y1));
      // 只動 x（葉子再加轉圈）；每飄過一次換一個高度（y 不在動畫裡，改了不會被蓋回去）
      var cfg = { targets: g, x: to, duration: isLeaf ? rnd(2600, 3400) : rnd(1500, 2400), delay: i * (isLeaf ? 700 : 260), repeat: -1,
        onRepeat: function () { g.y = rnd(opt.y0, opt.y1); } };
      if (isLeaf) cfg.angle = dir * 360;
      opt.tw(cfg);
      out.push(g);
    }
    for (var i = 0; i < opt.n; i++) one(false, i);
    for (var k = 0; k < (opt.leaves || 0); k++) one(true, k);
    return out;
  }

  var DRAW = {
    /** 地圖氣氛（戰鬥背景）：M16 風城的風往同一邊吹（減少動態效果時不畫） */
    ambience: function (fx, c) {
      if (c.kind !== 'wind' || fx.reduced) return;
      fx.wind = windStreaks(fx.scene, { n: 6, leaves: 2, dir: c.dir, W: fx.W, y0: 24, y1: Math.max(60, fx.footY - 24), depth: DEPTH.WIND,
        tw: function (cfg) { return fx.tw(cfg); } });
    },
    /** 胸口的大齒輪被灰霧包住（6 團：中間 1 團蓋住齒輪、旁邊 5 團） */
    fog: function (fx) {
      var G0 = fx.px(GEO.floodgate.gear), r = GEO.floodgate.gear.r * fx.dw;
      var spots = [[0, 0, 1.15]];
      for (var k = 0; k < 5; k++) { var a = -Math.PI / 2 + k * Math.PI * 2 / 5; spots.push([Math.cos(a) * r * 1.45, Math.sin(a) * r * 1.2, 0.8]); }
      spots.forEach(function (s) {
        var g = fx.gfx(true); drawPuff(g, r * s[2]); g.setPosition(G0.x + s[0], G0.y + s[1]);
        fx.puffs.push(g);
        if (!fx.reduced) fx.tw({ targets: g, scale: 1.08, duration: 1600, yoyo: true, repeat: -1, ease: 'Sine.inOut' });   // 霧慢慢鼓起來、縮回去（1.6 秒）
      });
    },
    /** 第 1 階段：關水門（三片閘門從上面落下，蓋住出水口） */
    gates_close: function (fx) {
      var A = GEO.floodgate.gate, x0 = A.x0 * fx.dw, x1 = A.x1 * fx.dw, y0 = A.y0 * fx.dh, h = (A.y1 - A.y0) * fx.dh, w = (x1 - x0) / 3;
      for (var i = 0; i < 3; i++) {
        var g = fx.gfx(true); drawSlat(g, w - 2, h); g.setPosition(x0 + w * (i + 0.5), y0);
        fx.slats.push(g);
        if (fx.reduced) continue;
        g.setY(y0 - h * 0.9).setAlpha(0);
        fx.tw({ targets: g, y: y0, alpha: 1, duration: 280, delay: 400 + i * 140, ease: 'Quad.in' });
      }
    },
    /** 第 2 階段：水門打開（閘門往上收） */
    gates_open: function (fx) {
      fx.slats.forEach(function (g, i) {
        if (fx.reduced) { g.setVisible(false); return; }
        fx.tw({ targets: g, y: g.y - fx.dh * 0.3, alpha: 0, duration: 360, delay: i * 100, ease: 'Quad.out', onComplete: function () { g.setVisible(false); } });
      });
    },
    /** 第 2 階段：放水花（出水口一直噴小水花；減少動態效果時畫一圈靜止的水花） */
    fountain: function (fx) {
      var S = fx.px(GEO.floodgate.spout);
      if (fx.reduced) {
        for (var k = 0; k < 7; k++) {
          var a = Math.PI * (0.15 + k * 0.7 / 6), g = fx.gfx(true); drawDrop(g, 3.5);
          g.setPosition(S.x + Math.cos(a) * fx.dw * 0.22 * (k % 2 ? 1 : -1), S.y + Math.sin(a) * fx.dh * 0.14);
          fx.drops.push(g);
        }
        return;
      }
      var drop1 = function () {
        var g = fx.gfx(true); drawDrop(g, rnd(2.5, 4.5)); g.setPosition(S.x + rnd(-4, 4), S.y);
        fx.tw({ targets: g, x: S.x + rnd(-0.34, 0.34) * fx.dw, y: S.y + rnd(0.1, 0.2) * fx.dh, alpha: 0, scale: 0.5, duration: 620, ease: 'Quad.in', onComplete: function () { g.destroy(); } });
      };
      var spawn = function () { for (var i = 0; i < 3; i++) drop1(); };
      spawn();
      fx.fountainEv = fx.scene.time.addEvent({ delay: 280, loop: true, callback: function () { safe(spawn, fx, 'fountain'); } });
    },
    fountain_stop: function (fx) {
      if (fx.fountainEv) { try { fx.fountainEv.remove(false); } catch (e) { /* 忽略 */ } fx.fountainEv = null; }
      fx.drops.forEach(function (g) { g.setVisible(false); });
    },
    /** 第 3 階段：齒輪露出（霧散開 2 團、齒輪變大發亮、慢慢轉） */
    gear_reveal: function (fx, c) {
      var G0 = fx.px(GEO.floodgate.gear), r = GEO.floodgate.gear.r * fx.dw * 1.1;
      takePuffs(fx, (c.from || 0) - (c.to || 0), false);
      breeze(fx, G0);
      var glow = fx.gfx(true); glow.fillStyle(0xffe2a0, 0.35); glow.fillCircle(0, 0, r * 1.5); glow.setPosition(G0.x, G0.y);
      var g = fx.gfx(true); drawGear(g, r); g.setPosition(G0.x, G0.y);
      fx.gear = g; fx.glow = glow;
      // 齒輪要在剩下的霧後面（霧還沒散完時看得到一團團霧在齒輪前面）
      fx.puffs.forEach(function (p) { if (fx.box && fx.box.bringToTop) fx.box.bringToTop(p); });
      glow.setAlpha(0.5);   // 打倒時再亮到 1（fog_clear）
      if (fx.reduced) return;
      g.setScale(0.4).setAlpha(0); glow.setAlpha(0);
      fx.tw({ targets: g, alpha: 1, duration: 380 });
      fx.tw({ targets: glow, alpha: 0.5, duration: 380 });
      fx.tw({ targets: g, scale: 1, duration: 380, ease: 'Back.out' });
      fx.gearSpin = fx.tw({ targets: g, angle: 360, duration: GEAR_TURN_MS, repeat: -1 });
    },
    /** 第 1 階段被打中：鏘！（水門關著，很硬的樣子；傷害照舊） */
    clank: function (fx) {
      var A = GEO.floodgate.gate, y = (A.y0 + A.y1) / 2 * fx.dh, t = fx.text(fx.dw * 0.24, y, '鏘！', { fontSize: '22px', color: '#e6eef7', stroke: '#26303f' }, true);
      if (fx.reduced) { fx.dropLater(t, 600); return; }
      fx.fadeOut(t, 520, { y: y - 14 });
      var p = fx.world(0, y);
      if (fx.scene.textures && fx.scene.textures.exists && fx.scene.textures.exists('ui:spark')) {
        var em = fx.scene.add.particles(p.x, p.y, 'ui:spark', { speed: { min: 50, max: 150 }, lifespan: 360, scale: { start: 2, end: 0 }, tint: 0xcfd8e3, emitting: false });
        em.setDepth(DEPTH.BUBBLE); em.explode(8);
        fx.later(500, function () { em.destroy(); });
      }
    },
    /** 第 3 階段被打中：答對就把霧吹散（每一擊散 2 團，最少留 1 團；打倒才全散） */
    fog_blow: function (fx, c) {
      takePuffs(fx, (c.from || 0) - (c.to || 0), true);
      breeze(fx, fx.px(GEO.floodgate.gear));
    },
    /** 第 2 階段攻擊：水花泡泡往主角飛過來、破掉 */
    bubbles: function (fx) {
      var S = fx.px(GEO.floodgate.spout), p0 = fx.world(S.x, S.y), ty = fx.H * 0.72;
      if (fx.reduced) { fx.dropLater(fx.text(fx.W / 2, fx.H * 0.6, '水花泡泡！', { fontSize: '20px', color: '#bfe9ff' }, false, DEPTH.BUBBLE), 800); return; }
      for (var i = 0; i < 6; i++) (function (i) {
        var g = fx.gfx(false, DEPTH.BUBBLE); drawBubble(g, rnd(6, 9)); g.setPosition(p0.x + rnd(-6, 6), p0.y).setScale(0.6);
        fx.tw({ targets: g, x: fx.W / 2 + (i - 2.5) * 52, y: ty + rnd(-14, 14), scale: 1.9, duration: 520, delay: i * 70, ease: 'Sine.in', onComplete: function () {
          var ring = fx.gfx(false, DEPTH.BUBBLE); ring.lineStyle(2, 0xffffff, 0.9); ring.strokeCircle(0, 0, 8); ring.setPosition(g.x, g.y);
          g.destroy();
          fx.fadeOut(ring, 200, { scale: 2.4 });
        } });
      })(i);
    },
    /** 第 3 階段攻擊：齒輪轉快一下 */
    gear_spin: function (fx) {
      if (fx.reduced || !fx.gearSpin) return;
      fx.gearSpin.timeScale = 6;
      fx.later(450, function () { if (fx.gearSpin) fx.gearSpin.timeScale = 1; });
    },
    /** 打倒：剩下的霧全散、齒輪暖暖地亮著 */
    fog_clear: function (fx) {
      takePuffs(fx, fx.puffs.length, true);
      if (fx.glow) { if (fx.reduced) fx.glow.setAlpha(1); else fx.tw({ targets: fx.glow, alpha: 1, duration: 500 }); }
    },
    /** 打倒：清水從出水口流下來、往田野（畫面右邊）流 */
    water_flow: function (fx) {
      DRAW.fountain_stop(fx);
      var S = fx.px(GEO.floodgate.spout), top = fx.world(S.x, S.y), gy = fx.footY - 2, P = 24;   // P：水波一段的長度（往右移一段剛好接上，不會跳）
      var fall = fx.gfx(false, DEPTH.FLOW);
      fall.fillStyle(0x8fd8ff, 0.7); fall.fillRect(top.x - fx.dw * 0.06, top.y, fx.dw * 0.12, Math.max(4, gy - top.y));
      var g = fx.gfx(false, DEPTH.FLOW);
      for (var k = 0; k < 4; k++) {
        g.lineStyle(3, k % 2 ? 0xbfeaff : 0x6cc8f5, 0.85); g.beginPath();
        for (var x = top.x - P; x <= fx.W + P + 6; x += 4) { var y = gy + k * 5 + Math.sin((x + k * 6) * Math.PI * 2 / P) * 2; if (x === top.x - P) g.moveTo(x, y); else g.lineTo(x, y); }
        g.strokePath();
      }
      fx.flow = g;
      if (fx.reduced) return;
      g.setAlpha(0); fall.setAlpha(0);
      fx.tw({ targets: [g, fall], alpha: 1, duration: 400 });
      fx.tw({ targets: g, x: P, duration: 600, repeat: -1 });   // 水一直往右流（0.6 秒一段，平順，不閃）
    },
    /** 雷咚咚：咚！（小鼓的位置冒字、一圈淡淡的聲波、柔和閃光；連打兩下時隔 0.42 秒再一次） */
    drum: function (fx, c) {
      var D = fx.px(GEO.drum), n = c.n || 1;
      if (fx.reduced) {
        for (var k = 0; k < n; k++) fx.dropLater(fx.text(D.x + k * 30 - (n - 1) * 15, D.y - fx.dh * 0.1, '咚！', { fontSize: '24px', color: '#ffe27a', stroke: '#3a2a10' }, true), 800);
        return;
      }
      R.drumTimes(n).forEach(function (t, k) {
        fx.later(t, function () {
          var tx = fx.text(D.x + k * 22, D.y - fx.dh * 0.1, '咚！', { fontSize: '26px', color: '#ffe27a', stroke: '#3a2a10' }, true);
          tx.setScale(0.6);
          fx.tw({ targets: tx, scale: 1.15, duration: 160, ease: 'Back.out', onComplete: function () { fx.fadeOut(tx, 420, { y: tx.y - 16 }); } });
          var ring = fx.gfx(true); ring.lineStyle(3, 0xffe27a, 0.8); ring.strokeCircle(0, 0, 10); ring.setPosition(D.x, D.y);
          fx.fadeOut(ring, 380, { scale: 4.4 });
          fx.softFlash();
        });
      });
    },
    /** 咻咻風精：一陣風吹向主角，怪物看起來變遠（主角被吹退一步） */
    gust: function (fx) {
      var sc = fx.scene, m = sc.monster, mid = fx.world(0, -fx.dh * 0.5);
      if (fx.reduced) { fx.dropLater(fx.text(mid.x + fx.dw * 0.55, mid.y, '咻——', { fontSize: '24px', color: '#dfffe9', stroke: '#1f4a35' }), 800); return; }
      for (var i = 0; i < 6; i++) (function (i) {
        var g = fx.gfx(false, DEPTH.BUBBLE); g.lineStyle(4, 0xe6fff0, 0.85); g.beginPath(); g.arc(0, 0, 18, 0, Math.PI * 1.2, false); g.strokePath();
        g.setPosition(mid.x, mid.y);
        fx.tw({ targets: g, x: fx.W / 2 + (i - 2.5) * 110, y: fx.H * 0.8, scale: 2.4, alpha: 0, angle: (i < 3 ? -90 : 90), duration: 480, delay: i * 45, ease: 'Quad.in', onComplete: function () { g.destroy(); } });
      })(i);
      var t = fx.text(mid.x + fx.dw * 0.55, mid.y, '咻——', { fontSize: '24px', color: '#dfffe9', stroke: '#1f4a35' });
      fx.fadeOut(t, 700, { x: t.x + 30 });
      if (!m) return;
      var bs = fx.baseScale, shadow = sc.shadow, sw = shadow ? shadow.scaleX : 1;
      fx.later(260, function () {   // 原本的「撲過來」（0.24 秒）結束之後
        fx.tw({ targets: m, scale: bs * 0.88, duration: 200, hold: 180, yoyo: true, ease: 'Quad.out', onComplete: function () { m.setScale(bs); } });
        if (shadow) fx.tw({ targets: shadow, scaleX: sw * 0.88, duration: 200, hold: 180, yoyo: true, onComplete: function () { shadow.setScale(sw, shadow.scaleY); } });
      });
    }
  };
  Scene.DRAW = DRAW;

  // ═════════════════════ 地圖上的風（M16）═════════════════════
  function mapAmbience(scene) {
    scene.bossWind = null;
    var amb = R.ambienceFor(scene.mapId);
    if (!amb || amb.kind !== 'wind' || reduced()) return null;
    var V = view(), n = 0;
    var list = windStreaks(scene, { n: 8, leaves: 3, dir: amb.dir, W: V.W, y0: 10, y1: V.H - 10, depth: MAP_DEPTH, fixed: true,
      tw: function (cfg) { n += 1; return scene.tweens.add(cfg); } });
    var w = scene.bossWind = { dir: amb.dir, objs: list, tweens: n, visible: true };
    // 玩的途中家長打開「減少動態效果」：風馬上停、藏起來（下一張地圖就不畫）
    w.check = scene.time.addEvent({ delay: 1000, loop: true, callback: function () {
      if (!reduced() || !w.visible) return;
      w.visible = false;
      list.forEach(function (o) { try { scene.tweens.killTweensOf(o); o.setVisible(false); } catch (e) { /* 忽略 */ } });
    } });
    logp('map-wind:' + scene.mapId);
    return w;
  }

  // ═════════════════════ 掛上戰鬥場景 ═════════════════════
  function attach(scene) {
    scene.bossFx = null;
    var g = J.Game, ctx = g && g.battleCtx, mon = (scene.data_ && scene.data_.mon) || (ctx && ctx.mon);
    var st = R.create(mon, ctx && ctx.mapId);
    if (!st) return null;
    var fx = new Fx(scene, st);
    scene.bossFx = fx;
    fx.build();
    logp('attach:' + (st.id || '') + (st.ambience ? ':' + st.ambience.kind : '') + (fx.reduced ? ':reduced' : ''));
    return fx;
  }
  function currentPhase() { var g = J.Game, b = g && g.battleCtx && g.battleCtx.b; return b ? Math.min(b.phase, b.phases) : 1; }

  function wrap(P, name, make, tag) {
    var orig = P[name];
    if (typeof orig !== 'function') { warn('沒有 ' + name + '()，這個掛鉤略過', tag); return; }
    P[name] = make(orig);
    Scene.wrapped.push(tag + '.' + name);
  }
  /** 暫時把鏡頭的 flash／shake 換成什麼都不做（只在原本的 hurtEffect 執行那一下），結束後換回來 */
  function muteCamera(cam, keys) {
    var saved = [];
    keys.forEach(function (k) {
      saved.push([k, Object.prototype.hasOwnProperty.call(cam, k), cam[k]]);
      cam[k] = function () { return cam; };
    });
    return function () { saved.forEach(function (s) { if (s[1]) cam[s[0]] = s[2]; else delete cam[s[0]]; }); };
  }

  function hookBattle(P) {
    if (!P || P.__bossFxHooked) return false;
    P.__bossFxHooked = true;
    wrap(P, 'create', function (orig) { return function () { this.bossFx = null; var r = orig.apply(this, arguments); safe(function () { attach(this); }, this, 'create'); return r; }; }, 'BattleScene');
    wrap(P, 'hitEffect', function (orig) { return function (dmg, crit) {
      var r = orig.apply(this, arguments), fx = this.bossFx;
      if (fx) safe(function () { fx.hit(crit); }, this, 'hitEffect');
      return r;
    }; }, 'BattleScene');
    wrap(P, 'hurtEffect', function (orig) { return function () {
      var fx = this.bossFx, plan = fx ? safe(function () { return fx.attackPlan(); }, this, 'hurtEffect') : null;
      var cam = this.cameras && this.cameras.main, keys = [];
      if (plan && plan.noFlash) keys.push('flash');
      if (plan && plan.noShake) keys.push('shake');
      var restore = cam && keys.length ? muteCamera(cam, keys) : null;
      try { return orig.apply(this, arguments); }
      finally {
        if (restore) restore();
        if (plan) safe(function () { fx.playAttack(plan); }, this, 'hurtEffect');
      }
    }; }, 'BattleScene');
    wrap(P, 'phaseEffect', function (orig) { return function () {
      var r = orig.apply(this, arguments), fx = this.bossFx;
      if (fx) safe(function () { fx.phase(currentPhase()); }, this, 'phaseEffect');
      return r;
    }; }, 'BattleScene');
    wrap(P, 'wakeEffect', function (orig) { return function () {
      var fx = this.bossFx;
      if (fx) safe(function () { fx.wake(); }, this, 'wakeEffect');
      return orig.apply(this, arguments);
    }; }, 'BattleScene');
    return true;
  }
  function hookMap(P) {
    if (!P || P.__bossFxHooked) return false;
    P.__bossFxHooked = true;
    wrap(P, 'create', function (orig) { return function () {
      this.bossWind = null;
      var r = orig.apply(this, arguments);
      if (this.p && !this.transitioning) safe(function () { mapAmbience(this); }, this, 'MapScene.create');
      return r;
    }; }, 'MapScene');
    return true;
  }
  function hookGame(G) {
    if (!G || G.__bossFxHooked || typeof G.bmsg !== 'function') return false;
    G.__bossFxHooked = true;
    var orig = G.bmsg;
    G.bmsg = function (text) {
      var c = G.battleCtx, fx = c && c.scene && c.scene.bossFx;
      if (fx) text = fx.decorateMsg(text);
      return orig.call(this, text);
    };
    Scene.wrapped.push('Game.bmsg');
    return true;
  }

  /** 測試、除錯用：這一場戰鬥的演出狀態（沒有演出＝null）；地圖上的風 */
  Scene.current = function () { var g = J.Game, c = g && g.battleCtx, fx = c && c.scene && c.scene.bossFx; return fx ? fx.info() : null; };
  Scene.mapWind = function () { var g = J.Game, w = g && g.mapScene && g.mapScene.bossWind; return w ? { dir: w.dir, count: w.objs.length, visible: w.visible } : null; };
  Scene.Fx = Fx; Scene.attach = attach; Scene.mapAmbience = mapAmbience; Scene.reduced = reduced;
  Scene.hookBattle = hookBattle; Scene.hookMap = hookMap; Scene.hookGame = hookGame;
  J.BossFxScene = Scene;

  if (!R) { warn('沒有載入 systems/bossfx.js', '載入'); return; }
  hookBattle(J.BattleScene && J.BattleScene.prototype);
  hookMap(J.MapScene && J.MapScene.prototype);
  hookGame(J.Game);
})();
