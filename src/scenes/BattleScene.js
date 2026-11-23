/*
 * 戰鬥場景（DQ 式正面畫面）：上方戰鬥背景、怪物在正中間。
 * 指令、訊息、題目都是 DOM（見 game.js 的戰鬥流程），這裡只負責畫面效果。
 */
(function () {
  'use strict';
  var J = window.JQ;
  var PHASE_TOP = 46;   // v4.2.8 階段多幀圖最高可以到的 y（遊戲座標；頭目體力框下緣約 41＋5 的空隙）
  var STEP_MS = 520;    // v4.2.11 有腳的怪原地踏步：一輪（兩步）的毫秒＝地圖野怪走一格（MapScene 的 MOB_STEP_MS），換格速度和地圖上同一隻一致

  class BattleScene extends Phaser.Scene {
    constructor() { super('Battle'); }

    // v4.2.11：場景物件每場戰鬥共用，上一場的多幀圖狀態（換格、維持的顯示高度、階段圖）要清掉
    init(data) { this.data_ = data; this.flashTw = null; this.shakeTw = null; this.raging = false; this.phaseAnim = null; this.phaseKey = null; this.wantH = 0; this.shadow = null;
      this.isStrip = false; this.topCache = null; this.lookMul = 1; this.lookTint = 0; this.lookLv = 0; this.aura = null; this.fitAt = 0; }   // v4.2.11 C2：框高上限快取、變身後的樣子

    /**
     * v4.2.11 C2 怪物最高點的上限（遊戲座標）：頭目框（DOM .battle-top）實際下緣換算成遊戲座標。
     * 手機直放時框的字換成 2 行、框比電腦版高，固定的 PHASE_TOP（照電腦版框高）會讓皇冠被蓋住。
     * 量不到（沒有 DOM、框不在、畫布沒有尺寸）＝PHASE_TOP。300 毫秒快取（update 每 0.5 秒問一次）
     */
    topLimit() {
      var now = Date.now(), c = this.topCache;
      if (c && now - c.t < 300) return c.v;
      var v = PHASE_TOP;
      try {
        var doc = typeof document !== 'undefined' ? document : null;
        var el = doc && doc.querySelector ? doc.querySelector('.battle-top') : null;
        var cv = this.sys && this.sys.game && this.sys.game.canvas;
        var gh = (this.scale && this.scale.height) || (J.CONFIG && J.CONFIG.VIEW_H) || 360;
        if (el && cv && el.getBoundingClientRect && cv.getBoundingClientRect) {
          var t = BattleScene.topFromRects(el.getBoundingClientRect(), cv.getBoundingClientRect(), gh);
          if (t !== null) v = t;
        }
      } catch (e) { v = PHASE_TOP; }
      if (this.footY) v = Math.min(v, this.footY - 60);   // 保險：框再怎麼長，怪物至少留 55 高
      this.topCache = { t: now, v: v };
      return v;
    }

    /** v4.2.11 C2 框的下緣（螢幕座標）→ 遊戲座標的上限：(框下緣 − 畫布上緣) × 遊戲高 ÷ 畫布螢幕高（上下飄的 5px 已在 fitScale 的 footY − 5 扣掉；電腦版實測 45.6，和舊的 46 幾乎一樣、怪物不會變小）。框不在畫面上（高 0）或畫布沒尺寸＝null */
    static topFromRects(frame, canvas, gameH) {
      if (!frame || !canvas || !(frame.height > 0) || !(canvas.height > 0) || !(gameH > 0)) return null;
      return Math.max(0, (frame.bottom - canvas.top) * gameH / canvas.height);
    }

    /**
     * v4.2.11 C2 現在這張貼圖該用的縮放：照原本的顯示高度（wantH）；多幀圖最高點（含上下飄 5px）不超過頭目框下緣（topLimit）。
     * 變身後（lookMul > 1，沒有專用變身圖的頭目）再放大，但不超過頭目框、不超出畫面寬，也不會比沒變身時小
     */
    fitScale() {
      var m = this.monster, h = this.wantH || m.height * this.baseScale;
      this.wantH = h;
      var s = h / Math.max(1, m.height);
      if (this.isStrip && this.footY) s = Math.min(s, (this.footY - 5 - this.topLimit()) / Math.max(1, m.height));
      var mul = this.lookMul || 1;
      if (mul > 1 && this.footY) {
        var W = (J.CONFIG && J.CONFIG.VIEW_W) || 640;
        s = Math.max(s, Math.min(s * mul, (this.footY - 5 - this.topLimit()) / Math.max(1, m.height), (W - 40) / Math.max(1, m.width)));
      }
      return s;
    }

    /** v4.2.11 C2 縮放補間（脹大、受擊放大）正在跑？跑的時候不重算縮放（結束時它們會 setScale） */
    scaling() {
      var m = this.monster;
      if (!m || !this.tweens || !this.tweens.getTweensOf) return false;
      return this.tweens.getTweensOf(m).some(function (t) { return (t.data || []).some(function (d) { return d && /^scale[XY]?$/.test(d.key); }); });
    }

    /** v4.2.11 C2 重新套用縮放（框高變了：轉向、框的字換行；或變身）。縮放補間在跑時不動 */
    refit() {
      if (!this.monster || this.scaling()) return false;
      var s = this.fitScale();
      if (Math.abs(s - this.baseScale) > 1e-4) { this.monster.setScale(s); this.baseScale = s; if (this.shadow) this.shadow.width = this.monster.displayWidth * 0.7; }
      this.drawAura();
      return true;
    }

    /** v4.2.11 C2 減少動態效果（家長設定；auto＝跟系統） */
    reduceNow() {
      var st = J.Game && J.Game.state;
      return J.Motion ? !!J.Motion.reduceMotion(st && st.settings, typeof window !== 'undefined' && window.matchMedia ? window.matchMedia.bind(window) : null) : false;
    }

    /**
     * v4.2.11 C2 沒有專用變身圖的頭目，第 n 條血的樣子（程式效果，不畫新圖）：每變身一次體型 ×1.07、身上光暈多一層、色調加深；
     * 第 3 條染紅（和「生氣了」同一類的紅）。佛格（有 bar_sprites）換圖，不用這個；沒有三條血（一般怪、精英、舊階段頭目）＝null
     */
    barLook() {
      var g = J.Game, b = g && g.battleCtx && g.battleCtx.b, mon = this.data_ && this.data_.mon;
      if (!b || !b.bars || !mon || mon.bar_sprites) return null;
      var lv = Math.max(0, Math.min(b.bars.length, b.bar || 1) - 1);
      return lv ? { lv: lv, mul: 1 + 0.07 * lv, tint: lv >= 2 ? 0xff7a66 : 0xffb48c } : null;
    }

    /** v4.2.11 C2 平常的顏色：變身後的色調（lookTint）；沒有就原色。受擊閃爍、生氣演出結束都回到這個，變身的樣子不會被洗掉 */
    baseTint() {
      var m = this.monster;
      if (!m) return;
      if (this.lookTint) m.setTint(this.lookTint); else m.clearTint();
    }

    /** v4.2.11 C2 變身後身上的光暈：怪物後面的橢圓光（第 2 條橘色、第 3 條紅色而且比較濃），跟著怪物的大小重畫；不會動 */
    drawAura() {
      if (!this.lookLv || !this.monster || !this.add || !this.add.graphics) return;
      var m = this.monster, g = this.aura;
      // 疊在戰鬥背景上面、怪物下面（depth −1 會被整張背景蓋住，所以同一層、在顯示清單裡排到怪物前面）
      if (!g) { g = this.aura = this.add.graphics(); if (g.setDepth) g.setDepth(m.depth || 0); if (this.children && this.children.moveBelow) this.children.moveBelow(g, m); }
      if (g.clear) g.clear();
      var cx = this.baseX || m.x, cy = (this.footY || m.y) - m.displayHeight / 2, col = this.lookLv >= 2 ? 0xff3a2a : 0xff9a30;
      // 6 層由大到小疊（邊緣淡、中間濃，看起來是一圈光）；第 3 條每層比較濃、顏色比較紅
      for (var i = 0; i < 6; i++) {
        var k = 1.4 - i * 0.1;   // 比怪物大一圈（1.4 → 0.9 倍），光從身體邊緣透出來
        g.fillStyle(col, (this.lookLv >= 2 ? 0.1 : 0.09) + i * 0.012);   // 每層透明度不同（同樣的填色 Phaser 會併成一個形狀，疊不出濃淡）
        g.fillEllipse(cx, cy, m.displayWidth * k, m.displayHeight * k);
      }
    }

    preload() {
      J.Assets.watch(this);
      J.Assets.queueBattleBg(this, this.data_.bg);
      J.Assets.queue(this, this.data_.mon.sprite, this.data_.mon.name);
      if (J.Assets.has(this.data_.mon.sprite + '_anim')) J.Assets.queue(this, this.data_.mon.sprite + '_anim');   // v4.2.11 怪物本體的多幀圖（和地圖野怪同一張）
      var ps = this.data_.mon.phase_sprites || {}, self = this;   // v4.2 佛格的階段圖（第 2、4 階段）
      Object.keys(ps).forEach(function (k) {
        if (J.Assets.has(ps[k])) J.Assets.queue(self, ps[k], self.data_.mon.name);
        if (J.Assets.has(ps[k] + '_anim')) J.Assets.queue(self, ps[k] + '_anim');   // v4.2.8 階段多幀圖（佛格 p2／p4，tools/mob_anim_import.js 匯入）
      });
    }

    /** v4.2.11 key 的多幀圖（<key>_anim）可用時回傳格數：type strip、貼圖已載入、每一格都切好（和 setPhaseSprite 同樣的判斷）；不可用回傳 0 */
    animCols(key) {
      var ak = key + '_anim', ainf = J.Assets.info(ak), atk = J.Assets.texKey(ak);
      return ainf && ainf.type === 'strip' && this.textures.exists(atk) && this.textures.get(atk).has(ainf.cols - 1) ? ainf.cols : 0;
    }

    /** 換貼圖、維持顯示高度（以原本的高度重新算縮放）；frame 省略＝單張圖 */
    swapTexture(tk, frame) {
      var m = this.monster, h = this.wantH || m.height * this.baseScale;
      this.wantH = h;   // 原本的顯示高度（多幀圖被下面那條壓低時，換回單張圖仍用原本的高度）
      // v4.2.11：先停掉還在跑的縮放補間（phaseEffect 脹大、hurtEffect 放大）。它們結束時會 setScale(換圖前的 baseScale)，把新圖的縮放蓋掉——
      // v4210-a 實機量到：佛格 p2 多幀圖變 238 高（頂到 y18，蓋到頭目體力框）、p4 變 234 高。stop() 只觸發 onStop（這兩個補間沒有），不會跑 onComplete。Phaser 4 把 scale 補間拆成 scaleX＋scaleY 兩筆
      if (this.tweens && this.tweens.getTweensOf) this.tweens.getTweensOf(m).forEach(function (t) { if ((t.data || []).some(function (d) { return d && /^scale[XY]?$/.test(d.key); })) t.stop(); });
      m.setTexture(tk, frame);
      // v4.2.8 多幀圖的畫填滿整格（佛格 p2 第 2 格的皇冠頂到格子最上緣）：最高點（含上下飄 5px）不超過頭目體力框下緣，否則皇冠被蓋住
      // v4.2.11 C2：框下緣改量 DOM（topLimit；量不到＝PHASE_TOP 46），手機直放框比較高也不會蓋到；變身後的放大也在 fitScale
      this.isStrip = frame !== undefined;
      var s = this.fitScale();
      m.setScale(s); this.baseScale = s;
      if (this.shadow) this.shadow.width = m.displayWidth * 0.7;
    }

    /**
     * v4.2 頭目換階段圖（遺忘霧王‧佛格 p2／p4）：同一個位置、同樣高度，圖讀不到就不換
     * v4.2.8（老闆 C1「按建議完成」）：那一階段有多幀圖（<key>_anim，type strip）而且每一格都切好 → 換成多幀圖，update() 換格；沒有就照舊單張圖
     */
    setPhaseSprite(key) {
      var tk = J.Assets.texKey(key), m = this.monster, self = this;
      if (!m || !this.textures.exists(tk) || J.Assets.isPlaceholder(this, key)) return false;
      var ak = key + '_anim', ainf = J.Assets.info(ak), atk = J.Assets.texKey(ak);
      var n = ainf && ainf.type === 'strip' && this.textures.exists(atk) && this.textures.get(atk).has(ainf.cols - 1) ? ainf.cols : 0;
      // 等「生氣了」的脹大動畫（phaseEffect 約 0.65 秒）結束再換
      this.time.delayedCall(700, function () {
        if (!self.monster) return;
        self.phaseKey = key;
        self.phaseAnim = n ? { n: n, f: 0, kind: J.SpriteAnim ? J.SpriteAnim.animKind(self.data_.mon.id) : 'float' } : null;
        self.swapTexture(n ? atk : tk, n ? 0 : undefined);
      });
      return true;
    }

    /** v4.2.8 進入沒有階段圖的階段（佛格第 3 階段）：停止換格、回到上一張階段單張圖（和改版前一樣） */
    stopPhaseAnim() {
      var self = this;
      if (!this.phaseAnim || !this.phaseKey) return false;   // v4.2.11 還沒換過階段圖（只在播本體多幀圖）：不動
      this.time.delayedCall(700, function () {
        if (!self.phaseAnim || !self.monster) return;
        self.phaseAnim = null;
        self.swapTexture(J.Assets.texKey(self.phaseKey));
      });
      return true;
    }

    /** v4.2.8 階段多幀圖換格：格序、每格毫秒照地圖野怪（SpriteAnim.animFrame；佛格是漂浮類 200 毫秒一格）；「減少動態效果」→ 只顯示第 1 格 */
    update(time) {
      // v4.2.11 C2：每 0.5 秒看一次頭目框下緣有沒有變（轉向、框的字換行、變身），變了就重算縮放
      if (this.monster && (!this.fitAt || time - this.fitAt > 500)) { this.fitAt = time; this.refit(); }
      var a = this.phaseAnim;
      if (!a || !this.monster || !J.SpriteAnim) return;
      if (!this.rmAt || time - this.rmAt > 1000) {
        this.rmAt = time;
        var st = J.Game && J.Game.state;
        this.rmVal = J.Motion ? J.Motion.reduceMotion(st && st.settings, window.matchMedia && window.matchMedia.bind(window)) : false;
      }
      // v4.2.11 本體多幀圖也走這裡。有腳的（step）在戰鬥中原地踏步：k＝這一輪走了多少（STEP_MS 一輪，和地圖上走一格同速）。
      // time 是遊戲迴圈的時間，不受 create() 的戰鬥加速（this.time／tweens 的 timeScale）影響：換格永遠是正常速度
      var f = J.SpriteAnim.animFrame(a.kind, time, a.kind === 'step' ? (time % STEP_MS) / STEP_MS : NaN, 0, a.n, this.rmVal);
      if (f !== a.f) { a.f = f; this.monster.setFrame(f); }
    }

    create() {
      J.Assets.finalize(this);
      // v3.0.1 ③戰鬥加速：家長設定「快」→ 這個場景的動畫、延遲兩倍速（答題時間在 quiz.js，不受影響）
      var spd = J.Game && J.Game.battleSpeedMult ? J.Game.battleSpeedMult() : 1;
      this.tweens.timeScale = 1 / spd; this.time.timeScale = 1 / spd;
      var C = J.CONFIG, W = C.VIEW_W, H = C.VIEW_H, bgH = Math.round(H * 2 / 3);
      this.cameras.main.setBackgroundColor('#0b1236');
      var bgKey = 'bg:' + this.data_.bg;
      var full = false;
      if (this.textures.exists(bgKey)) {
        var bgImg = this.add.image(0, 0, bgKey).setOrigin(0, 0);
        // GPT 戰鬥背景是整張 16:9（640×360）：鋪滿全畫面；程式產生的備援背景是上方橫幅
        full = Math.abs(bgImg.width / bgImg.height - W / H) < 0.15;
        bgImg.setDisplaySize(W, full ? H : bgH);
      } else this.add.rectangle(0, 0, W, bgH, 0x6ab8e8).setOrigin(0, 0);
      if (!full) {
        this.add.rectangle(0, bgH, W, H - bgH, 0x0b1236).setOrigin(0, 0);
        this.add.rectangle(0, bgH, W, 3, 0xf4f1e6).setOrigin(0, 0);
      } else bgH = Math.round(H * 0.74);

      var mon = this.data_.mon;
      var tk = J.Assets.texKey(mon.sprite);
      var footY = bgH - 8;
      this.footY = footY;
      this.monster = this.add.image(W / 2, footY, tk).setOrigin(0.5, 1);
      // 怪物圖用原始尺寸（sprites.js 定義：一般約 96px、頭目約 160px）；佔位圖放大到同樣高度；太大才縮小
      var s = 1;
      if (J.Assets.isPlaceholder(this, mon.sprite)) s = (mon.boss ? 160 : 96) / this.monster.height;
      var maxH = bgH - 16, maxW = W - 40;
      s = Math.min(s, maxH / this.monster.height, maxW / this.monster.width);
      this.monster.setScale(s);
      this.baseScale = s;
      // v4.2.11（老闆 2026-11-23「霧影的BOSS 在戰鬥畫面怎不會動?」）：本體有多幀圖（和地圖野怪同一張 <key>_anim）就換成多幀圖、update() 換格。
      // 顯示高度、腳底位置照單張圖（swapTexture 維持顯示高度；最高點不蓋到頭目體力框）；影子寬照單張圖
      var shW = this.monster.displayWidth * 0.7, kind = J.SpriteAnim ? J.SpriteAnim.animKind(mon.id) : 'float';
      var an = J.SpriteAnim && !J.Assets.isPlaceholder(this, mon.sprite) ? this.animCols(mon.sprite) : 0;
      if (an) { this.phaseAnim = { n: an, f: 0, kind: kind }; this.swapTexture(J.Assets.texKey(mon.sprite + '_anim'), 0); }
      this.baseX = this.monster.x;
      this.shadow = this.add.ellipse(W / 2, footY - 2, shW, 12, 0x000000, 0.25).setDepth(-1);
      // 上下飄 5px：和地圖一致——有多幀圖時，有腳的（step）、貼地的（ground）只換格不飄（地圖 mobFx 同樣規則，飄起來腳會離地）；漂浮、飛行照飄
      this.idle = an && (kind === 'step' || kind === 'ground') ? null : this.tweens.add({ targets: this.monster, y: this.monster.y - 5, duration: 650, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      this.cameras.main.fadeIn(300, 255, 255, 255);
      if (!this.textures.exists('ui:spark')) {
        var c = document.createElement('canvas'); c.width = 4; c.height = 4;
        var g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(1, 0, 2, 4); g.fillRect(0, 1, 4, 2);
        this.textures.addCanvas('ui:spark', c);
      }
      var self0 = this;
      this.time.delayedCall(320, function () { self0.cry('appear'); });   // 出場叫聲
      J.Game.battleSceneReady(this);
    }

    /** 怪物叫聲（sfx.js 依怪物的 family／size／mood 合成） */
    cry(kind) { if (J.Sfx && J.Audio.isEnabled()) J.Sfx.monster(this.data_.mon.id, this.data_.mon, kind); }

    /** 主角打中：怪物閃一下、跳數字 */
    hitEffect(dmg, crit) {
      var m = this.monster, self = this;
      J.Audio.play(crit ? 'crit' : 'hit');
      this.time.delayedCall(90, function () { self.cry('hurt'); });
      // v0.7：閃爍與晃動都從「原本的狀態」開始。以前連續打兩下（技能二連擊、會心一擊閃 4 次）時，
      // 第二個閃爍從半透明開始、結束時又回到半透明，怪物就一直半透明（看得到背後的背景）
      // v0.9.3（老闆截圖 004110「頭目是半透明的」）：原因是這裡的受擊閃爍把怪物的 alpha 降到 0.25（每次 70ms、來回 2～4 次），
      // 閃爍中的畫面就是半透明、看得到背後的戰鬥背景（圖檔本身全部不透明，已檢查 alpha）。
      // 改成「顏色閃爍」：怪物一直保持不透明（alpha 1），只把顏色在淡紅色和原色之間切換
      if (this.flashTw) { try { this.time.removeEvent(this.flashTw); } catch (e) { /* 忽略 */ } this.flashTw = null; }
      if (this.shakeTw) this.shakeTw.stop();
      m.setAlpha(1).setX(this.baseX);
      var self1 = this, flashes = (crit ? 4 : 2) * 2, k = 0;
      var restore = function () { if (self1.raging) m.setTint(0xff5a4a); else self1.baseTint(); m.setAlpha(1); };   // v4.2.11 C2：回到變身後的色調（沒變身＝原色）
      this.flashTw = this.time.addEvent({ delay: 70, repeat: flashes - 1, callback: function () {
        k++;
        if (k % 2) m.setTint(0xffb4a0); else restore();
        if (k >= flashes) restore();
      } });
      this.shakeTw = this.tweens.add({ targets: m, x: this.baseX + (crit ? 10 : 5), duration: 50, yoyo: true, repeat: 2, onComplete: function () { m.setX(self1.baseX); }, onStop: function () { m.setX(self1.baseX); } });
      if (crit) this.cameras.main.shake(180, 0.012);
      var t = this.add.text(m.x, m.y - m.displayHeight * 0.6, String(dmg), {
        fontFamily: 'sans-serif', fontSize: crit ? '36px' : '28px', fontStyle: 'bold', color: crit ? '#ffd34d' : '#ffffff', stroke: '#2a1e22', strokeThickness: 4
      }).setOrigin(0.5).setDepth(50);
      this.tweens.add({ targets: t, y: t.y - 30, alpha: 0, duration: 900, onComplete: function () { t.destroy(); } });
      var em = this.add.particles(m.x, m.y - m.displayHeight / 2, 'ui:spark', { speed: { min: 70, max: 200 }, lifespan: 420, scale: { start: 2.6, end: 0 }, tint: crit ? 0xffd34d : 0xffffff, emitting: false });
      em.setDepth(40);
      em.explode(crit ? 26 : 12);
      this.time.delayedCall(700, function () { em.destroy(); });
    }

    /** 怪物攻擊：畫面紅閃、晃動 */
    hurtEffect() {
      this.cry('attack');   // 威嚇聲，接著主角受擊聲
      this.time.delayedCall(260, function () { J.Audio.play('hurt'); });
      var m = this.monster;
      var bs = this.baseScale;
      this.tweens.add({ targets: m, scale: bs * 1.15, duration: 120, yoyo: true, onComplete: function () { m.setScale(bs); } });
      this.cameras.main.shake(220, 0.015);
      this.cameras.main.flash(200, 255, 80, 60);
    }

    /** 主角補血、技能：綠色閃光＋補血音效（v0.7：不再用升級音效，免得以為升級了） */
    healEffect() {
      J.Audio.play('heal');
      this.cameras.main.flash(250, 120, 255, 140);
    }

    /** 怪物清醒、開心跑走 */
    wakeEffect(done) {
      var m = this.monster, self = this;
      if (this.idle) this.idle.stop();
      J.Audio.play('win');
      this.cry('wake');   // 清醒了，開心的上揚聲
      this.tweens.add({ targets: m, y: m.y - 16, duration: 180, yoyo: true, repeat: 1, onComplete: function () {
        if (self.aura) { self.aura.destroy(); self.aura = null; }   // v4.2.11 C2 變身光暈跟著收掉
        self.tweens.add({ targets: [m, self.shadow], x: m.x + 420, alpha: 0, duration: 800, onComplete: function () { if (done) done(); } });
      } });
    }

    /**
     * 頭目換階段（v0.7）：「生氣了」的演出 —— 怒吼聲、畫面紅閃與震動、頭目變紅並脹大一下、頭上冒出「💢」。
     * 不用任何升級的音效或金色光，避免小朋友以為自己升級了。
     */
    phaseEffect() {
      var m = this.monster, self = this;
      // v4.2.11 C2 三條血變身：沒有專用變身圖的頭目換成這一條的樣子（barLook：放大、光暈、色調，持續到這一條打完）；
      //   減少動態效果：不閃、不震、不脹大，直接換成最後的樣子
      var look = this.barLook(), rm = this.reduceNow();
      this.cry('phase');   // 怒吼（低八度＋殘響）
      J.Audio.play('rage');
      if (!rm) {
        this.cameras.main.flash(260, 255, 60, 40);
        this.cameras.main.shake(420, 0.02);
      }
      m.setTint(0xff5a4a);
      this.raging = true;
      if (look) {
        this.lookMul = look.mul; this.lookTint = look.tint; this.lookLv = look.lv;
        var ns = this.fitScale();
        m.setScale(ns); this.baseScale = ns;
        if (this.shadow) this.shadow.width = m.displayWidth * 0.7;
        this.drawAura();
      }
      var bs = this.baseScale;
      if (!rm) {
        this.tweens.add({ targets: m, scale: bs * 1.18, duration: 160, yoyo: true, repeat: 1, ease: 'Quad.out', onComplete: function () { m.setScale(bs); } });
        this.tweens.add({ targets: m, angle: 6, duration: 90, yoyo: true, repeat: 3, onComplete: function () { m.setAngle(0); } });
      }
      var mark = this.add.text(m.x + m.displayWidth * 0.3, m.y - m.displayHeight - 4, '💢', { fontSize: '40px' }).setOrigin(0.5, 1).setDepth(60);
      if (rm) this.time.delayedCall(1100, function () { mark.destroy(); });
      else this.tweens.add({ targets: mark, y: mark.y - 18, alpha: 0, duration: 1100, delay: 300, onComplete: function () { mark.destroy(); } });
      this.time.delayedCall(1100, function () { if (self.monster) { self.raging = false; self.baseTint(); } });   // v4.2.11 C2：回到這一條的色調（沒變身＝原色）
    }
  }

  window.JQ = window.JQ || {};
  window.JQ.BattleScene = BattleScene;
})();
