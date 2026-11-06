/* 跟班的場景接線：單隻沿用原流程，雙跟班共用 PetFollow 的腳印。 */
(function () {
  'use strict';
  var isNode = typeof module !== 'undefined' && typeof require === 'function';
  var DATA = isNode ? require('../../data/followers.js') : window.FOLLOWERS;
  var PF = isNode ? require('./petfollow.js') : window.JQ.PetFollow;

  function specs(state) {
    return DATA.filter(function (s) { return !s.flag || !!(state && state.flags && state.flags[s.flag] === true); }).slice(0, 2);
  }

  function preload(scene) {
    var J = window.JQ;
    specs(J.Game.state).slice(1).forEach(function (s) { J.Assets.queue(scene, s.sprite, s.name); });
  }

  function build(scene) {
    var J = window.JQ, T = J.CONFIG.TILE, list = specs(J.Game.state);
    scene.followers = null;
    if (list.length < 1) return;   // v3.0.1（86 號 #3）只有番薯仔時也用隊伍內插（以前單隻用 PetFollow.step 固定速度追，實測每秒停 4.4 次）
    var party = PF.createParty({ x: scene.p.tx, y: scene.p.ty }, list.length, function (x, y) { return scene.walkable(x, y); }, scene.p.facing);
    var sprites = [scene.pet], walking = [true];
    list.slice(1).forEach(function (s) {
      var key = J.Assets.texKey(s.sprite), walk = scene.textures.get(key).has(11);
      if (walk) scene.ensureWalkAnims(key, s.sprite);
      var img = scene.add.sprite(0, 0, key, walk ? scene.idleFrame(s.sprite, 'down') : undefined).setOrigin(0.5, 1);
      if (!walk) img.setScale((s.mapH || T) / Math.max(img.height, 1));
      sprites.push(img); walking.push(walk);
    });
    scene.followers = { party: party, sprites: sprites, specs: list, walking: walking, states: list.map(function () { return PF.create('down'); }) };
    update(scene, 0);
  }

  function beginStep(scene) {
    if (scene.followers) PF.advanceParty(scene.followers.party, { x: scene.p.tx, y: scene.p.ty });
  }

  /** 回傳 true 表示已處理雙跟班；false 讓 MapScene 照原本方式更新番薯仔。 */
  function update(scene, delta) {
    var f = scene.followers;
    if (!f) return false;
    var T = window.JQ.CONFIG.TILE, p = scene.p;
    var progress = p.moving ? p.t / p.stepMs : 1;
    PF.sampleParty(f.party, progress, T).forEach(function (pos, i) {
      var spr = f.sprites[i], st = f.states[i];
      spr.setVisible(pos.visible);
      if (!pos.visible) return;
      var x = pos.x * T + T / 2, y = pos.y * T + T;
      var moved = Math.abs(spr.x - x) + Math.abs(spr.y - y) > 0.01;
      if (moved) { st.dir = PF.chooseDir(st.dir, x - spr.x, y - spr.y); st.still = 0; st.moving = true; }
      else { st.still += delta; if (st.still >= PF.IDLE_MS) st.moving = false; }
      spr.setPosition(x, y).setAlpha(1);
      var depth = y - (i + 1) * 0.1;
      if (spr.depth !== depth) spr.setDepth(depth);
      if (f.walking[i]) {
        var key = spr.texture.key + '-' + st.dir;
        if (st.moving) { if (!spr.anims.isPlaying || spr.anims.currentAnim.key !== key) spr.anims.play(key); }
        else { spr.anims.stop(); spr.setFrame(scene.idleFrame(f.specs[i].sprite, st.dir)); }
      } else if (moved && (st.dir === 'left' || st.dir === 'right')) spr.setFlipX(st.dir === 'right');
    });
    return true;
  }

  /** 霧仔在第二格，直接點牠說話，不必追著自己的隊伍跑。 */
  function onPointer(scene, pointer) {
    var f = scene.followers;
    if (!f) return false;
    var J = window.JQ, T = J.CONFIG.TILE, spr = f.sprites[1], spec = f.specs[1];
    if (!spr || !spec) return false;   // v3.0.1（86 號 #3）只有番薯仔
    if (!spr.visible || Math.floor(pointer.worldX / T) !== Math.floor(spr.x / T) ||
        Math.floor(pointer.worldY / T) !== Math.floor((spr.y - 1) / T)) return false;
    scene.p.path = []; scene.p.pending = null;
    if (J.UI.isOpen() && !J.UI.blocksMove()) J.UI.closePassMove();
    J.HUD.prompt(null);
    J.Game.say(spec.dialog, spec.lines);
    return true;
  }

  var Followers = { specs: specs, preload: preload, build: build, beginStep: beginStep, update: update, onPointer: onPointer };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.Followers = Followers; }
  if (typeof module !== 'undefined') module.exports = Followers;
})();
