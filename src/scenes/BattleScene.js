/*
 * 戰鬥場景（DQ 式正面畫面）：上方戰鬥背景、怪物在正中間。
 * 指令、訊息、題目都是 DOM（見 game.js 的戰鬥流程），這裡只負責畫面效果。
 */
(function () {
  'use strict';
  var J = window.JQ;

  class BattleScene extends Phaser.Scene {
    constructor() { super('Battle'); }

    init(data) { this.data_ = data; this.flashTw = null; this.shakeTw = null; this.raging = false; }

    preload() {
      J.Assets.watch(this);
      J.Assets.queueBattleBg(this, this.data_.bg);
      J.Assets.queue(this, this.data_.mon.sprite, this.data_.mon.name);
    }

    create() {
      J.Assets.finalize(this);
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
      this.monster = this.add.image(W / 2, footY, tk).setOrigin(0.5, 1);
      // 怪物圖用原始尺寸（sprites.js 定義：一般約 96px、頭目約 160px）；佔位圖放大到同樣高度；太大才縮小
      var s = 1;
      if (J.Assets.isPlaceholder(this, mon.sprite)) s = (mon.boss ? 160 : 96) / this.monster.height;
      var maxH = bgH - 16, maxW = W - 40;
      s = Math.min(s, maxH / this.monster.height, maxW / this.monster.width);
      this.monster.setScale(s);
      this.baseScale = s;
      this.baseX = this.monster.x;
      this.shadow = this.add.ellipse(W / 2, footY - 2, this.monster.displayWidth * 0.7, 12, 0x000000, 0.25).setDepth(-1);
      this.idle = this.tweens.add({ targets: this.monster, y: this.monster.y - 5, duration: 650, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
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
      var restore = function () { if (self1.raging) m.setTint(0xff5a4a); else m.clearTint(); m.setAlpha(1); };
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
        self.tweens.add({ targets: [m, self.shadow], x: m.x + 420, alpha: 0, duration: 800, onComplete: function () { if (done) done(); } });
      } });
    }

    /**
     * 頭目換階段（v0.7）：「生氣了」的演出 —— 怒吼聲、畫面紅閃與震動、頭目變紅並脹大一下、頭上冒出「💢」。
     * 不用任何升級的音效或金色光，避免小朋友以為自己升級了。
     */
    phaseEffect() {
      var m = this.monster, self = this;
      this.cry('phase');   // 怒吼（低八度＋殘響）
      J.Audio.play('rage');
      this.cameras.main.flash(260, 255, 60, 40);
      this.cameras.main.shake(420, 0.02);
      m.setTint(0xff5a4a);
      this.raging = true;
      var bs = this.baseScale;
      this.tweens.add({ targets: m, scale: bs * 1.18, duration: 160, yoyo: true, repeat: 1, ease: 'Quad.out', onComplete: function () { m.setScale(bs); } });
      this.tweens.add({ targets: m, angle: 6, duration: 90, yoyo: true, repeat: 3, onComplete: function () { m.setAngle(0); } });
      var mark = this.add.text(m.x + m.displayWidth * 0.3, m.y - m.displayHeight - 4, '💢', { fontSize: '40px' }).setOrigin(0.5, 1).setDepth(60);
      this.tweens.add({ targets: mark, y: mark.y - 18, alpha: 0, duration: 1100, delay: 300, onComplete: function () { mark.destroy(); } });
      this.time.delayedCall(1100, function () { if (self.monster) { self.monster.clearTint(); self.raging = false; } });
    }
  }

  window.JQ = window.JQ || {};
  window.JQ.BattleScene = BattleScene;
})();
