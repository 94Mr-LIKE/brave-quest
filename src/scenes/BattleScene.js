/*
 * 戰鬥場景（DQ 式正面畫面）：上方戰鬥背景、怪物在正中間。
 * 指令、訊息、題目都是 DOM（見 game.js 的戰鬥流程），這裡只負責畫面效果。
 */
(function () {
  'use strict';
  var J = window.JQ;

  class BattleScene extends Phaser.Scene {
    constructor() { super('Battle'); }

    init(data) { this.data_ = data; }

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
      this.shadow = this.add.ellipse(W / 2, footY - 2, this.monster.displayWidth * 0.7, 12, 0x000000, 0.25).setDepth(-1);
      this.idle = this.tweens.add({ targets: this.monster, y: this.monster.y - 5, duration: 650, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      this.cameras.main.fadeIn(300, 255, 255, 255);
      if (!this.textures.exists('ui:spark')) {
        var c = document.createElement('canvas'); c.width = 4; c.height = 4;
        var g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(1, 0, 2, 4); g.fillRect(0, 1, 4, 2);
        this.textures.addCanvas('ui:spark', c);
      }
      J.Game.battleSceneReady(this);
    }

    /** 主角打中：怪物閃一下、跳數字 */
    hitEffect(dmg, crit) {
      var m = this.monster;
      J.Audio.play(crit ? 'crit' : 'hit');
      this.tweens.add({ targets: m, alpha: 0.2, duration: 70, yoyo: true, repeat: crit ? 3 : 1 });
      this.tweens.add({ targets: m, x: m.x + (crit ? 10 : 5), duration: 50, yoyo: true, repeat: 2 });
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
      J.Audio.play('hurt');
      var m = this.monster;
      this.tweens.add({ targets: m, scale: this.baseScale * 1.15, duration: 120, yoyo: true });
      this.cameras.main.shake(220, 0.015);
      this.cameras.main.flash(200, 255, 80, 60);
    }

    healEffect() {
      J.Audio.play('levelup');
      this.cameras.main.flash(250, 120, 255, 140);
    }

    /** 怪物清醒、開心跑走 */
    wakeEffect(done) {
      var m = this.monster, self = this;
      if (this.idle) this.idle.stop();
      J.Audio.play('win');
      this.tweens.add({ targets: m, y: m.y - 16, duration: 180, yoyo: true, repeat: 1, onComplete: function () {
        self.tweens.add({ targets: [m, self.shadow], x: m.x + 420, alpha: 0, duration: 800, onComplete: function () { if (done) done(); } });
      } });
    }

    phaseEffect() {
      this.cameras.main.flash(300, 200, 220, 255);
      this.tweens.add({ targets: this.monster, angle: 6, duration: 90, yoyo: true, repeat: 3 });
    }
  }

  window.JQ = window.JQ || {};
  window.JQ.BattleScene = BattleScene;
})();
