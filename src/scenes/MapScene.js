/*
 * 地圖場景：3/4 俯視地圖（邏輯格子 32px，內部解析度 640×360）
 * - 地圖有 bg（GPT 畫的整張背景圖，放 assets/maps/）就整張貼上，grid 只用來算碰撞與互動；
 *   有 fg（同尺寸透明前景，例如樹冠、屋簷）就蓋在角色上方
 * - 沒有 bg 時才退回程式產生的圖塊（開發用備援），樹冠、屋頂依「腳底 y」和角色前後排序
 * - 網址加 ?debug=1：把 grid 半透明疊在背景上（綠＝可走、紅＝擋、藍＝出口），方便校對碰撞
 * - 點擊／觸控地面用 A* 走過去；方向鍵／WASD／螢幕方向鍵也能走
 * - 看得見的怪物在 spawns 範圍遊走，碰到就進入戰鬥；戰鬥後跑走、30 秒後重生
 * - 只載入這張地圖用到的圖塊與角色圖
 */
(function () {
  'use strict';
  var J = window.JQ;
  var C = J.CONFIG;
  var T = C.TILE;          // 邏輯格子 32px
  var S = T / 16;          // 備援圖塊（16px）放大倍數
  var DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
  var ROW = { down: 0, left: 1, right: 2, up: 3 };
  var STEP_MS = C.STEP_MS;
  var RESPAWN_MS = C.MONSTER_RESPAWN_MS;

  function G() { return J.Game; }

  class MapScene extends Phaser.Scene {
    constructor() { super('Map'); }

    init(data) {
      this.mapId = data.mapId;
      this.startX = data.x; this.startY = data.y;
      this.startFacing = data.facing || 'down';
      this.map = G().data.maps[this.mapId];
    }

    preload() {
      var A = J.Assets, g = G(), map = this.map, self = this;
      A.watch(this);
      A.queueTileset(this, map.tileset);      // 寶箱、燈、傳送光圈與備援地面用
      // 背景／前景圖：maps.js 的 bg、fg 優先；沒寫時看 art_manifest.js 有沒有 bg_<地圖>.png、fg_<地圖>.png
      var artMap = A.art().maps[this.mapId] || {};
      this.bgFile = map.bg || artMap.bg || null;
      this.fgFile = map.fg || artMap.fg || null;
      if (this.bgFile) A.queueMapImage(this, this.bgFile);
      if (this.fgFile) A.queueMapImage(this, this.fgFile);
      // 寶箱與招牌（GPT 圖，sprites.js；沒有圖時用程式畫的暫代圖）
      if ((map.chests || []).length) { if (A.has('chest_closed')) A.queue(this, 'chest_closed'); if (A.has('chest_open')) A.queue(this, 'chest_open'); }
      J.MapInfo.signSpots(map).forEach(function (sg) { if (A.has('sign_' + sg.kind)) A.queue(self, 'sign_' + sg.kind); });
      this.heroKey = A.heroKey(g.state.player.gender, g.state.player.job);
      A.queue(this, this.heroKey, g.state.player.name);
      A.queue(this, 'pet_imo', '番薯仔');
      this.npcList().forEach(function (n) { A.queue(self, n.sprite || 'npc_unknown', g.speaker(n.id).name); });
      (map.spawns || []).forEach(function (s) {
        var m = g.data.monsters[s.monster];
        if (m) A.queue(self, m.sprite, m.name);
      });
    }

    /** 地圖上的 NPC，加上「沒有站櫃 NPC 的旅店」虛擬老闆 */
    npcList() {
      var map = this.map, list = (map.npcs || []).slice();
      if (map.inn && !map.inn.npc && !list.some(function (n) { return n.x === map.inn.x && n.y === map.inn.y; })) {
        list.push({ id: '__inn', x: map.inn.x, y: map.inn.y, sprite: 'npc_innkeeper', dialog: 'D_INN_IDLE', virtual: true });
      }
      return list;
    }

    create() {
      var g = G(), self = this, map = this.map;
      J.Assets.finalize(this);
      this.makeUiTextures();
      this.size = J.World.size(map);
      this.tileset = g.data.tilesets[map.tileset] || g.data.tilesets.village;
      this.frames = {};
      (window.TILE_FRAMES ? window.TILE_FRAMES.names : []).forEach(function (n, i) { self.frames[n] = i; });
      this.tex = 'tiles:' + map.tileset;
      if (!this.textures.exists(this.tex)) this.makeFallbackTiles();
      this.anims_ = [];
      this.npcs = [];
      this.monsters = [];
      this.chests = [];
      this.lamps = [];
      this.transitioning = false;
      this.encounterCooldown = this.time.now + 1500;
      this.blocked = J.World.blockers(map);
      this.npcList().forEach(function (n) { self.blocked[n.x + ',' + n.y] = true; });
      (map.lamps || []).forEach(function (l) { self.blocked[l.x + ',' + l.y] = true; });

      this.hasBg = !!(this.bgFile && this.textures.exists('map:' + this.bgFile));
      if (this.hasBg) this.buildBackground(); else this.buildTiles();
      this.buildExits();
      this.buildObjects();
      this.buildCharacters();
      this.buildMonsters();
      this.buildSigns();
      this.buildLights();
      this.buildForeground();
      if (g.DEBUG) this.buildDebugOverlay();

      var cam = this.cameras.main;
      cam.setBounds(0, 0, this.size.w * T, this.size.h * T);
      cam.startFollow(this.player, true, 0.2, 0.2);
      cam.setRoundPixels(true);
      cam.fadeIn(250, 0, 0, 0);

      this.input.on('pointerdown', function (p) { self.onPointer(p); });
      this.time.addEvent({ delay: 500, loop: true, callback: function () { self.animTick = !self.animTick; self.anims_.forEach(function (a) { a.img.setFrame(self.animTick ? a.b : a.a); }); } });
      // scene.restart() 不會清掉 this.events 上的監聽器（Phaser 只清 transition 事件），
      // 所以場景停止時要自己移除，否則每換一次地圖 onWake 就多跑一次（資安審查 F-03）
      var onWake = function (sys, data) { self.onWake(data || {}); };
      this.events.on('wake', onWake);
      this.events.once('shutdown', function () { self.events.off('wake', onWake); J.HUD.prompt(null); });
      g.onMapReady(this);
    }

    // ---------------------------------------------------------------- 圖塊
    frameOf(name) { return this.frames[name] === undefined ? 0 : this.frames[name]; }

    defAt(x, y) {
      var ch = J.World.charAt(this.map, x, y);
      var d = this.tileset[ch];
      if (!d) {
        if (!this.warned) { this.warned = {}; }
        if (!this.warned[ch]) { this.warned[ch] = 1; console.warn('[地圖] ' + this.mapId + ' 圖例沒有字元「' + ch + '」，當成地面'); }
        d = this.tileset['.'] || { tile: 'grass', walk: true };
      }
      return d;
    }

    isWater(x, y) { var d = this.defAt(x, y); return !!d.water; }

    /** 覆蓋層的排序深度：往下找到第一個可以走的格子，那一列的上緣 */
    overlayDepth(x, y) {
      var yy = y;
      while (yy + 1 < this.size.h && !this.defAt(x, yy + 1).walk) yy++;
      return (yy + 1) * T - 0.5;
    }

    buildTiles() {
      var self = this, w = this.size.w, h = this.size.h;
      var EDGE_GROUND = { path: 1, sand: 1, mud: 1 }, GRASS = { grass: 1, flowers: 1 };
      for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
          var d = this.defAt(x, y);
          var name = d.tile;
          if (d.near) {
            var nearCh = [[0, -1], [0, 1], [-1, 0], [1, 0]].map(function (o) { return J.World.charAt(self.map, x + o[0], y + o[1]); });
            Object.keys(d.near).forEach(function (c) { if (nearCh.indexOf(c) >= 0) name = d.near[c]; });
          }
          if (d.house) {
            var below = J.World.charAt(this.map, x, y + 1);
            var belowDef = this.tileset[below];
            var bottom = !(belowDef && belowDef.house);
            var nearDoor = J.World.charAt(this.map, x - 1, y) === 'D' || J.World.charAt(this.map, x + 1, y) === 'D';
            if (bottom && x % 2 === 1 && !nearDoor) name = 'window';
          }
          var depth = d.overlay ? this.overlayDepth(x, y) : 0;
          var img = this.add.image(x * T, y * T, this.tex, this.frameOf(name)).setOrigin(0, 0).setScale(S).setDepth(depth);
          if (d.anim) this.anims_.push({ img: img, a: this.frameOf(name), b: this.frameOf(name.replace(/_a$/, '_b')) });
          if (d.top && y > 0) {
            this.add.image(x * T, (y - 1) * T, this.tex, this.frameOf(d.top)).setOrigin(0, 0).setScale(S).setDepth((y + 1) * T - 0.5);
          }
          // 水岸線
          if (d.water) {
            [['n', 0, -1], ['s', 0, 1], ['w', -1, 0], ['e', 1, 0]].forEach(function (s) {
              var nx = x + s[1], ny = y + s[2];
              if (nx < 0 || ny < 0 || nx >= w || ny >= h) return;
              var nd = self.defAt(nx, ny);
              if (!nd.water && nd.tile !== 'bridge' && nd.tile !== 'stack') self.add.image(x * T, y * T, self.tex, self.frameOf('shore_' + s[0])).setOrigin(0, 0).setScale(S).setDepth(0.2);
            });
          }
          // 草地長進路面的邊緣
          if (EDGE_GROUND[name]) {
            [['n', 0, -1], ['s', 0, 1], ['w', -1, 0], ['e', 1, 0]].forEach(function (s) {
              var nx = x + s[1], ny = y + s[2];
              if (nx < 0 || ny < 0 || nx >= w || ny >= h) return;
              if (GRASS[self.defAt(nx, ny).tile]) self.add.image(x * T, y * T, self.tex, self.frameOf('edge_' + s[0])).setOrigin(0, 0).setScale(S).setDepth(0.1);
            });
          }
        }
      }
    }

    /** 整張背景圖（GPT 繪製）；尺寸應為 欄數×32 × 列數×32，不合時拉伸並提醒 */
    buildBackground() {
      var key = 'map:' + this.bgFile, W = this.size.w * T, H = this.size.h * T;
      var img = this.add.image(0, 0, key).setOrigin(0, 0).setDepth(0);
      if (img.width !== W || img.height !== H) {
        console.warn('[地圖] ' + this.mapId + ' 背景圖是 ' + img.width + '×' + img.height + '，應該是 ' + W + '×' + H + '（欄數×32 × 列數×32），已自動拉伸');
        img.setDisplaySize(W, H);
      }
    }

    /** 出口的傳送光圈 */
    buildExits() {
      var self = this;
      (this.map.exits || []).forEach(function (e) {
        var img = self.add.image(e.x * T, e.y * T, self.tex, self.frameOf('warp_a')).setOrigin(0, 0).setScale(S).setDepth(0.5).setAlpha(0.9);
        self.anims_.push({ img: img, a: self.frameOf('warp_a'), b: self.frameOf('warp_b') });
      });
    }

    /** ?debug=1：碰撞格子疊圖＋滑鼠所在格的座標與字元 */
    buildDebugOverlay() {
      var self = this, g = this.add.graphics().setDepth(60000);
      for (var y = 0; y < this.size.h; y++) {
        for (var x = 0; x < this.size.w; x++) {
          var isExit = !!J.World.exitAt(this.map, x, y), walk = this.walkable(x, y);
          g.fillStyle(isExit ? 0x3f88ff : (walk ? 0x3fd060 : 0xff3030), isExit ? 0.45 : (walk ? 0.16 : 0.38));
          g.fillRect(x * T, y * T, T, T);
          var ch = J.World.charAt(this.map, x, y);
          if (ch !== '.') this.add.text(x * T + 2, y * T + 1, ch, { fontFamily: 'monospace', fontSize: '12px', color: '#ffffff', stroke: '#000000', strokeThickness: 3 }).setDepth(60001);
        }
      }
      g.lineStyle(1, 0xffffff, 0.35);
      for (var gx = 0; gx <= this.size.w; gx++) g.lineBetween(gx * T, 0, gx * T, this.size.h * T);
      for (var gy = 0; gy <= this.size.h; gy++) g.lineBetween(0, gy * T, this.size.w * T, gy * T);
      g.lineStyle(2, 0xffd34d, 1);
      this.npcList().forEach(function (n) { g.strokeRect(n.x * T + 1, n.y * T + 1, T - 2, T - 2); });
      (this.map.chests || []).forEach(function (c) { g.strokeRect(c.x * T + 1, c.y * T + 1, T - 2, T - 2); });
      var tag = document.getElementById('debug-tag');
      if (!tag) { tag = document.createElement('div'); tag.id = 'debug-tag'; tag.className = 'win debug-tag'; document.getElementById('ui').appendChild(tag); }
      tag.textContent = this.mapId + '（開發者模式：綠＝可走、紅＝擋、藍＝出口、黃框＝NPC／寶箱）';
      this.input.on('pointermove', function (p) {
        var x = Math.floor(p.worldX / T), y = Math.floor(p.worldY / T);
        tag.textContent = self.mapId + '　x=' + x + ' y=' + y + '　字元「' + J.World.charAt(self.map, x, y) + '」' + (self.walkable(x, y) ? '可走' : '擋');
      });
    }

    /** 圖塊圖沒載入成功時（例如 file:// 沒有打包）畫最簡單的色塊，不讓遊戲當掉 */
    makeFallbackTiles() {
      var names = window.TILE_FRAMES ? window.TILE_FRAMES.names : ['grass'];
      var c = document.createElement('canvas'); c.width = names.length * T; c.height = T;
      var g = c.getContext('2d');
      names.forEach(function (n, i) {
        g.fillStyle = /water|swamp|shore/.test(n) ? '#3f88d8' : /wall|rock|roof|stack|cliff/.test(n) ? '#8a7c68' : /path|sand|bridge|floor|stairs/.test(n) ? '#d8c08a' : /tree|bush/.test(n) ? '#2f7a32' : /edge|warp|top|chest|lamp/.test(n) ? 'rgba(0,0,0,0)' : '#7cc45a';
        g.fillRect(i * T, 0, T, T);
      });
      var tex = this.textures.addCanvas(this.tex, c);
      for (var i = 0; i < names.length; i++) tex.add(i, 0, i * T, 0, T, T);
    }

    makeUiTextures() {
      var self = this;
      function bubble(key, bg, ch) {
        if (self.textures.exists(key)) return;
        var c = document.createElement('canvas'); c.width = 11; c.height = 13;
        var g = c.getContext('2d');
        g.fillStyle = '#2a1e22'; g.fillRect(1, 0, 9, 10); g.fillRect(0, 1, 11, 8); g.fillRect(4, 10, 3, 2); g.fillRect(5, 12, 1, 1);
        g.fillStyle = bg; g.fillRect(1, 1, 9, 8); g.fillRect(5, 9, 1, 2);
        g.fillStyle = '#2a1e22';
        if (ch === '!') { g.fillRect(5, 2, 1, 4); g.fillRect(5, 7, 1, 1); }
        else { g.fillRect(4, 2, 3, 1); g.fillRect(7, 3, 1, 1); g.fillRect(5, 4, 2, 1); g.fillRect(5, 5, 1, 1); g.fillRect(5, 7, 1, 1); }
        self.textures.addCanvas(key, c);
      }
      bubble('ui:bang', '#ffd34d', '!');
      if (!this.textures.exists('ui:station')) {   // 車站站牌（沒有美術圖時用）
        var sc = document.createElement('canvas'); sc.width = 20; sc.height = 40;
        var sg = sc.getContext('2d');
        sg.fillStyle = '#2a1e22'; sg.fillRect(8, 12, 4, 28); sg.fillRect(0, 0, 20, 16);
        sg.fillStyle = '#3f88d8'; sg.fillRect(1, 1, 18, 14);
        sg.fillStyle = '#ffffff'; sg.fillRect(4, 4, 12, 3); sg.fillRect(4, 9, 8, 3);
        sg.fillStyle = '#9a9aa2'; sg.fillRect(9, 16, 2, 24);
        this.textures.addCanvas('ui:station', sc);
      }
      bubble('ui:ready', '#7be08a', '?');
      if (!this.textures.exists('ui:spark')) {
        var c = document.createElement('canvas'); c.width = 4; c.height = 4;
        var g = c.getContext('2d'); g.fillStyle = '#ffffff'; g.fillRect(1, 0, 2, 4); g.fillRect(0, 1, 4, 2);
        this.textures.addCanvas('ui:spark', c);
      }
    }

    // ---------------------------------------------------------------- 物件
    buildObjects() {
      var self = this, g = G(), st = g.state;
      var stn = this.map.station;
      if (stn) {
        this.station = stn;
        var key = J.Assets.has('obj_station') ? J.Assets.texKey('obj_station') : 'ui:station';
        this.add.image(stn.x * T + T / 2, stn.y * T + T, key).setOrigin(0.5, 1).setDepth((stn.y + 1) * T - 1);
      }
      this.chestArt = this.hasArt('chest_closed') && this.hasArt('chest_open');
      (this.map.chests || []).forEach(function (c) {
        var open = !!st.chests[c.id];
        var img;
        if (self.chestArt) {
          img = self.add.image(c.x * T + T / 2, c.y * T + T, J.Assets.texKey(open ? 'chest_open' : 'chest_closed')).setOrigin(0.5, 1);
          img.setScale((T * 1.05) / img.height).setDepth((c.y + 1) * T);
        } else img = self.add.image(c.x * T, c.y * T + T, self.tex, self.frameOf(open ? 'chest_open' : 'chest_closed')).setOrigin(0, 1).setScale(S).setDepth((c.y + 1) * T);
        self.chests.push({ data: c, img: img });
      });
      (this.map.lamps || []).forEach(function (l) {
        var lit = !!st.lamps[l.subject];
        var img = self.add.image(l.x * T + T / 2, l.y * T + T, self.tex, self.frameOf(lit ? 'lamp_on' : 'lamp_off')).setOrigin(0.5, 1).setScale(S, S * 1.6).setDepth((l.y + 1) * T);
        self.lamps.push({ data: l, img: img });
      });
    }

    setChestOpen(id) {
      var self = this;
      this.chests.forEach(function (c) {
        if (c.data.id === id) {
          if (self.chestArt) { c.img.setTexture(J.Assets.texKey('chest_open')); c.img.setScale((T * 1.05) / c.img.height); self.sparkle(c.img.x, c.img.y - T / 2, 0xffd34d); }
          else { c.img.setFrame(self.frameOf('chest_open')); self.sparkle(c.img.x + T / 2, c.img.y - T / 2, 0xffd34d); }
        }
      });
    }

    updateLamps() {
      var self = this, st = G().state;
      this.lamps.forEach(function (l) {
        var lit = !!st.lamps[l.data.subject];
        var was = l.img.frame.name === self.frameOf('lamp_on');
        l.img.setFrame(self.frameOf(lit ? 'lamp_on' : 'lamp_off'));
        if (lit && !was) self.sparkle(l.img.x, l.img.y - T * 1.3, 0xfff3a0);
        // 點亮的知識燈：柔和的圓形暖光
        if (lit && !l.glow) l.glow = self.addGlow(l.img.x, l.img.y - T * 1.45, 1.1);
        if (!lit && l.glow) { l.glow.destroy(); l.glow = null; }
      });
    }

    /** sprites.js 有這張圖、而且真的載入成功（不是佔位圖） */
    hasArt(key) { return J.Assets.has(key) && this.textures.exists(J.Assets.texKey(key)) && !J.Assets.isPlaceholder(this, key); }

    // ---------------------------------------------------------------- 招牌（商店、旅店門口上方）
    buildSigns() {
      var self = this;
      this.signs = [];
      J.MapInfo.signSpots(this.map).forEach(function (sg) {
        var key = 'sign_' + sg.kind, img;
        if (self.hasArt(key)) img = self.add.image(sg.x * T + T / 2, (sg.y + 1) * T, J.Assets.texKey(key)).setOrigin(0.5, 1).setScale(1.15);
        else img = self.add.image(sg.x * T + T / 2, (sg.y + 1) * T, self.textSign(sg.kind, sg.text)).setOrigin(0.5, 1);
        img.setDepth((sg.y + 1) * T + 2);
        self.signs.push({ spot: sg, img: img });
      });
    }

    /** 沒有招牌圖時：木頭招牌＋文字 */
    textSign(kind, text) {
      var key = 'ui:signtext:' + kind;
      if (this.textures.exists(key)) return key;
      var c = document.createElement('canvas'); c.width = 64; c.height = 34;
      var g = c.getContext('2d');
      g.fillStyle = '#2a1e22'; g.fillRect(0, 2, 64, 30);
      g.fillStyle = '#b07a4a'; g.fillRect(2, 4, 60, 26);
      g.fillStyle = '#d09a62'; g.fillRect(2, 4, 60, 4);
      g.fillStyle = '#5a3a22'; g.fillRect(14, 0, 3, 4); g.fillRect(47, 0, 3, 4);
      g.fillStyle = '#fffbe8'; g.font = 'bold 18px "Microsoft JhengHei","PingFang TC","Noto Sans TC",sans-serif';
      g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, 32, 19);
      this.textures.addCanvas(key, c);
      return key;
    }

    // ---------------------------------------------------------------- 燈光：程式繪製的圓形暖色放射漸層（加法混合、輕微呼吸）
    glowTexture() {
      if (this.textures.exists('ui:glow')) return 'ui:glow';
      var c = document.createElement('canvas'); c.width = c.height = 128;
      var g = c.getContext('2d');
      var gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
      gr.addColorStop(0, 'rgba(255,228,150,0.9)');
      gr.addColorStop(0.35, 'rgba(255,190,90,0.45)');
      gr.addColorStop(0.7, 'rgba(255,150,60,0.12)');
      gr.addColorStop(1, 'rgba(255,140,50,0)');
      g.fillStyle = gr; g.beginPath(); g.arc(64, 64, 64, 0, Math.PI * 2); g.fill();
      this.textures.addCanvas('ui:glow', c);
      return 'ui:glow';
    }

    addGlow(x, y, r) {
      var img = this.add.image(x, y, this.glowTexture()).setBlendMode(Phaser.BlendModes.ADD).setDepth(39000);
      var sc = (T * 3 * (r || 1)) / 128;
      img.setScale(sc).setAlpha(0.7);
      this.tweens.add({ targets: img, alpha: 0.5, scale: sc * 0.93, duration: 1100 + Math.random() * 500, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      return img;
    }

    buildLights() {
      var self = this;
      this.lights_ = J.MapInfo.lightSpots(this.map).map(function (l) { return self.addGlow(l.x * T + T / 2, l.y * T + T / 2, l.r); });
      this.updateLamps();
    }

    // ---------------------------------------------------------------- 前景（上層格 'U'、maps.js 的 fg 圖）與 DQ6 式剪影
    buildForeground() {
      var self = this, W = this.size.w * T, H = this.size.h * T;
      var up = J.MapInfo.upperCells(this.map, G().data.tilesets);
      this.fgSet = {};
      Object.keys(up.set).forEach(function (k) { self.fgSet[k] = true; });
      var bgKey = this.hasBg ? 'map:' + this.bgFile : null;
      up.cells.forEach(function (c) {
        if (bgKey) {
          // 從背景圖切出這一格，畫在角色上方
          var img = self.add.image(0, 0, bgKey).setOrigin(0, 0);
          var sx = img.width / W, sy = img.height / H;
          img.setScale(1 / sx, 1 / sy).setCrop(c.x * T * sx, c.y * T * sy, T * sx, T * sy).setDepth(40000);
        } else {
          var d = self.defAt(c.x, c.y);
          self.add.image(c.x * T, c.y * T, self.tex, self.frameOf(d.tile)).setOrigin(0, 0).setScale(S).setDepth(40000);
        }
      });
      if (this.fgFile && this.textures.exists('map:' + this.fgFile)) {
        this.add.image(0, 0, 'map:' + this.fgFile).setOrigin(0, 0).setDisplaySize(W, H).setDepth(50000);
        this.maskFromFg('map:' + this.fgFile);
      }
      this.hasFg = Object.keys(this.fgSet).length > 0;
      // 剪影：角色被前景擋住時，在最上層畫一個約 35% 透明的單色影子表示位置
      this.ghost = this.add.sprite(this.player.x, this.player.y, this.player.texture.key, this.player.frame.name).setOrigin(0.5, 1)
        .setTint(0xdfeeff).setTintMode(Phaser.TintModes.FILL).setAlpha(0.35).setDepth(60000).setVisible(false);
    }

    /** fg 圖：哪些格子有畫東西（不透明像素夠多），角色走到那裡就顯示剪影 */
    maskFromFg(key) {
      try {
        var src = this.textures.get(key).getSourceImage();
        var W = this.size.w, H = this.size.h, c = document.createElement('canvas');
        c.width = W * 8; c.height = H * 8;   // 每格取樣 8×8
        var g = c.getContext('2d');
        g.drawImage(src, 0, 0, c.width, c.height);
        var data = g.getImageData(0, 0, c.width, c.height).data;
        for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) {
          var n = 0;
          for (var yy = 0; yy < 8; yy++) for (var xx = 0; xx < 8; xx++) if (data[((y * 8 + yy) * c.width + x * 8 + xx) * 4 + 3] > 40) n++;
          if (n >= 12) this.fgSet[x + ',' + y] = true;
        }
      } catch (e) { /* 讀不到像素就不顯示剪影 */ }
    }

    updateGhost() {
      if (!this.ghost) return;
      var pl = this.player;
      var hit = this.hasFg && J.MapInfo.rectHitsCells({ x: pl.x - pl.displayWidth / 2 + 4, y: pl.y - pl.displayHeight + 4, w: pl.displayWidth - 8, h: pl.displayHeight - 6 }, this.fgSet, T);
      this.ghost.setVisible(!!hit);
      if (hit) { this.ghost.setPosition(pl.x, pl.y); if (this.ghost.texture.key !== pl.texture.key) this.ghost.setTexture(pl.texture.key); this.ghost.setFrame(pl.frame.name); }
    }

    sparkle(x, y, tint) {
      var em = this.add.particles(x, y, 'ui:spark', { speed: { min: 40, max: 140 }, lifespan: 700, scale: { start: 2.4, end: 0 }, tint: tint || 0xffffff, emitting: false });
      em.setDepth(9000);
      em.explode(18, x, y);
      this.time.delayedCall(1200, function () { em.destroy(); });
    }

    fireworks() {
      var self = this, cam = this.cameras.main;
      var colors = [0xff8a6a, 0xffd34d, 0x7be08a, 0x6ab8ff, 0xc89aff, 0xffffff];
      var em = this.add.particles(0, 0, 'ui:spark', { speed: { min: 80, max: 240 }, lifespan: 1300, gravityY: 80, scale: { start: 2.8, end: 0 }, tint: colors, emitting: false, blendMode: 'ADD' });
      em.setDepth(9500);
      var n = 0;
      this.time.addEvent({ delay: 450, repeat: 16, callback: function () {
        var x = cam.worldView.x + 40 + Math.random() * (cam.worldView.width - 80);
        var y = cam.worldView.y + 20 + Math.random() * (cam.worldView.height * 0.5);
        em.explode(40, x, y);
        if (n++ % 2 === 0) J.Audio.play('firework');
      } });
      this.time.delayedCall(9000, function () { em.destroy(); });
    }

    // ---------------------------------------------------------------- 角色
    /** 某個方向站著不動的影格（每列中間那格） */
    idleFrame(spriteKey, dir) { return J.Assets.dirRow(spriteKey, dir) * 3 + 1; }

    ensureWalkAnims(texKey, spriteKey) {
      var self = this;
      if (this.anims.exists(texKey + '-down')) return;
      Object.keys(ROW).forEach(function (dir) {
        var r = J.Assets.dirRow(spriteKey, dir);
        self.anims.create({ key: texKey + '-' + dir, frames: [r * 3, r * 3 + 1, r * 3 + 2, r * 3 + 1].map(function (f) { return { key: texKey, frame: f }; }), frameRate: 8, repeat: -1 });
      });
    }

    buildCharacters() {
      var self = this, g = G();
      var sx = this.startX, sy = this.startY;
      if (sx === undefined || !this.walkable(sx, sy)) {
        var s = this.map.start || { x: 1, y: 1 };
        var near = J.Pathfind.nearestWalkable(function (x, y) { return self.walkable(x, y); }, this.size.w, this.size.h, { x: s.x, y: s.y, c: s.x, r: s.y }) || { c: s.x, r: s.y };
        sx = this.walkable(s.x, s.y) ? s.x : near.c; sy = this.walkable(s.x, s.y) ? s.y : near.r;
      }
      var hk = J.Assets.texKey(this.heroKey);
      this.ensureWalkAnims(hk, this.heroKey);
      this.player = this.add.sprite(sx * T + T / 2, sy * T + T, hk, this.idleFrame(this.heroKey, this.startFacing)).setOrigin(0.5, 1);
      this.p = { tx: sx, ty: sy, facing: this.startFacing, moving: false, from: null, to: null, t: 0, path: [], pending: null, prev: { x: sx, y: sy } };
      var pk = J.Assets.texKey('pet_imo');
      this.ensureWalkAnims(pk, 'pet_imo');
      // 番薯仔站在主角後面一格（那格不能走就站同一格）
      var back = DIRS[{ up: 'down', down: 'up', left: 'right', right: 'left' }[this.startFacing]];
      var bx = sx + back[0], by = sy + back[1];
      if (!this.walkable(bx, by)) { bx = sx; by = sy; }
      this.pet = this.add.sprite(bx * T + T / 2, by * T + T, pk, 1).setOrigin(0.5, 1);
      this.petTarget = { x: this.pet.x, y: this.pet.y };

      this.npcList().forEach(function (n) {
        var tk = J.Assets.texKey(n.sprite || 'npc_unknown');
        var img = self.add.image(n.x * T + T / 2, n.y * T + T, tk, self.textures.get(tk).has(1) ? 1 : undefined).setOrigin(0.5, 1).setDepth((n.y + 1) * T);
        self.tweens.add({ targets: img, y: img.y - 2, duration: 700 + (n.x * 37) % 400, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
        var mark = self.add.image(img.x, img.y - img.displayHeight - 4, 'ui:bang').setOrigin(0.5, 1).setScale(2).setDepth(9000).setVisible(false);
        self.tweens.add({ targets: mark, y: mark.y - 4, duration: 500, yoyo: true, repeat: -1 });
        self.npcs.push({ data: n, img: img, mark: mark });
      });
      this.refreshMarkers();
      this.syncDepths();
    }

    refreshMarkers() {
      var g = G();
      this.npcs.forEach(function (n) {
        var m = g.npcMarker(n.data);
        n.mark.setVisible(!!m);
        if (m) n.mark.setTexture(m === 'ready' ? 'ui:ready' : 'ui:bang');
      });
    }

    walkable(x, y) {
      if (this.blocked && this.blocked[x + ',' + y]) return false;
      return J.World.isWalkable(G().data.tilesets, this.map, x, y, null);
    }

    // ---------------------------------------------------------------- 怪物
    buildMonsters() {
      var self = this, g = G(), st = g.state;
      (this.map.spawns || []).forEach(function (s, si) {
        var m = g.data.monsters[s.monster];
        if (!m) return;
        if (s.boss || m.boss) {
          if (st.bosses[s.monster]) return;
          if (s.quest && J.QuestLog.status(st, g.data.quests, s.quest) !== 'active') return;
        }
        for (var i = 0; i < (s.count || 1); i++) {
          var mob = { spawn: s, mon: m, id: s.monster, idx: si * 10 + i, active: false, sprite: null, tx: 0, ty: 0, moving: false, nextMove: 0, respawnAt: 0, boss: !!(s.boss || m.boss) };
          self.placeMonster(mob, true);
          self.monsters.push(mob);
        }
      });
    }

    areaTiles(s) {
      var a = s.area || [0, 0, this.size.w, this.size.h], out = [];
      for (var y = a[1]; y < a[1] + a[3]; y++) for (var x = a[0]; x < a[0] + a[2]; x++) if (this.walkable(x, y) && !J.World.exitAt(this.map, x, y)) out.push({ x: x, y: y });
      return out;
    }

    placeMonster(mob, first) {
      var self = this, tiles = this.areaTiles(mob.spawn);
      if (!tiles.length) { // 範圍內沒有可走的格子（例如頭目站在 1×1 的特殊位置）
        var a = mob.spawn.area || [1, 1, 1, 1];
        tiles = [{ x: a[0], y: a[1] }];
      }
      var p = this.p;
      var far = tiles.filter(function (t) { return !p || Math.abs(t.x - p.tx) + Math.abs(t.y - p.ty) >= 4; });
      var pick = (far.length ? far : tiles)[Math.floor(Math.random() * (far.length ? far : tiles).length)];
      if (mob.boss) { var a2 = mob.spawn.area; pick = { x: a2[0], y: a2[1] }; }
      mob.tx = pick.x; mob.ty = pick.y;
      var tk = J.Assets.texKey(mob.mon.sprite);
      if (!mob.sprite) {
        mob.sprite = this.add.image(0, 0, tk).setOrigin(0.5, 1);
        // 地圖上的怪物高度：sprites.js 的 mapH 優先，否則用 config.js 的預設
        var inf = J.Assets.info(mob.mon.sprite) || {};
        var target = inf.mapH || (mob.boss ? C.MAP_BOSS_H : C.MAP_MONSTER_H);
        mob.sprite.setScale(target / Math.max(mob.sprite.height, 1));
      }
      mob.sprite.setPosition(mob.tx * T + T / 2, mob.ty * T + T).setAlpha(first ? 1 : 0).setVisible(true);
      if (!first) this.tweens.add({ targets: mob.sprite, alpha: 1, duration: 600 });
      if (!mob.bob) mob.bob = this.tweens.add({ targets: mob.sprite, scaleY: mob.sprite.scaleY * 1.08, duration: 420 + (mob.idx * 53) % 300, yoyo: true, repeat: -1 });
      mob.active = true;
      mob.path = [];
      mob.nextMove = this.time.now + 800 + Math.random() * 1500;
    }

    wanderMonsters(now) {
      var self = this;
      this.monsters.forEach(function (mob) {
        if (!mob.active) {
          if (mob.respawnAt && now >= mob.respawnAt && !mob.boss) { mob.respawnAt = 0; self.placeMonster(mob, false); }
          return;
        }
        if (mob.boss || mob.moving || now < mob.nextMove) return;
        // v0.4：spawns 的 area 是遊走範圍。在範圍內隨機挑目標格，用 A* 一格一格慢慢走過去，走到後休息一下再挑下一個
        var a = mob.spawn.area || [0, 0, self.size.w, self.size.h];
        var occupied = function (x, y) { return self.monsters.some(function (o) { return o !== mob && o.active && o.tx === x && o.ty === y; }); };
        var inArea = function (x, y) { return x >= a[0] && y >= a[1] && x < a[0] + a[2] && y < a[1] + a[3] && self.walkable(x, y) && !J.World.exitAt(self.map, x, y); };
        if (!mob.path || !mob.path.length) {
          var goal = J.MapInfo.wanderTarget(self.areaTiles(mob.spawn), { x: mob.tx, y: mob.ty });
          mob.path = goal ? (J.Pathfind.findPath(function (x, y) { return inArea(x, y) && !occupied(x, y); }, self.size.w, self.size.h, { c: mob.tx, r: mob.ty }, { c: goal.x, r: goal.y }, 800) || []) : [];
          mob.goal = goal;
          if (!mob.path.length) { mob.nextMove = now + 700 + Math.random() * 900; return; }
        }
        var t = mob.path.shift();
        if (!inArea(t.c, t.r) || occupied(t.c, t.r)) { mob.path = []; mob.nextMove = now + 400; return; }
        mob.moving = true; mob.tx = t.c; mob.ty = t.r;
        mob.visited = (mob.visited || 0) + 1;
        if (t.c * T + T / 2 < mob.sprite.x) mob.sprite.setFlipX(false); else if (t.c * T + T / 2 > mob.sprite.x) mob.sprite.setFlipX(true);
        self.tweens.add({ targets: mob.sprite, x: t.c * T + T / 2, y: t.r * T + T, duration: 520, onComplete: function () {
          mob.moving = false;
          mob.nextMove = self.time.now + (mob.path.length ? 60 : 800 + Math.random() * 1400);   // 走到目標後停一下
        } });
      });
    }

    /** 戰鬥結束：怪物清醒跑走，30 秒後在範圍內重生（頭目淨化後不再出現） */
    monsterRunAway(mob, defeated) {
      if (!mob || !mob.sprite) return;
      mob.active = false;
      var dx = mob.sprite.x >= this.player.x ? T * 2.5 : -T * 2.5;
      this.tweens.add({ targets: mob.sprite, x: mob.sprite.x + dx, y: mob.sprite.y - T / 3, alpha: 0, duration: 900, onComplete: function () { mob.sprite.setVisible(false); } });
      if (mob.boss && defeated) mob.respawnAt = 0;
      else mob.respawnAt = this.time.now + RESPAWN_MS;
    }

    // ---------------------------------------------------------------- 移動
    onPointer(pointer) {
      if (J.UI.isOpen() || this.transitioning || G().busy) return;
      var x = Math.floor(pointer.worldX / T), y = Math.floor(pointer.worldY / T);
      if (x < 0 || y < 0 || x >= this.size.w || y >= this.size.h) return;
      var target = this.interactableAt(x, y);
      if (target) {
        if (this.isAdjacent(x, y)) { this.face(x, y); this.interact(target); return; }
        this.walkTo(x, y, target);
        return;
      }
      this.walkTo(x, y, null);
    }

    isAdjacent(x, y) { return Math.abs(x - this.p.tx) + Math.abs(y - this.p.ty) === 1; }

    face(x, y) {
      var dx = x - this.p.tx, dy = y - this.p.ty;
      this.p.facing = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
      this.player.anims.stop();
      this.player.setFrame(this.idleFrame(this.heroKey, this.p.facing));
    }

    /** 走到 (x,y)；target 不是 null 時走到它旁邊再互動。回傳是否找得到路 */
    walkTo(x, y, target) {
      var self = this, p = this.p;
      var w = function (cx, cy) { return self.walkable(cx, cy); };
      var goal = { c: x, r: y };
      if (target || !w(x, y)) {
        var best = null, bestLen = Infinity;
        [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(function (d) {
          var cx = x + d[0], cy = y + d[1];
          if (!w(cx, cy)) return;
          var path = (cx === p.tx && cy === p.ty) ? [] : J.Pathfind.findPath(w, self.size.w, self.size.h, { c: p.tx, r: p.ty }, { c: cx, r: cy });
          if (path && path.length < bestLen) { best = path; bestLen = path.length; }
        });
        if (!best && !target) {
          var n = J.Pathfind.nearestWalkable(w, this.size.w, this.size.h, goal, { c: p.tx, r: p.ty });
          if (n) best = J.Pathfind.findPath(w, this.size.w, this.size.h, { c: p.tx, r: p.ty }, n);
        }
        if (!best) return false;
        p.path = best;
      } else {
        var path = J.Pathfind.findPath(w, this.size.w, this.size.h, { c: p.tx, r: p.ty }, goal);
        if (!path) return false;
        p.path = path;
      }
      p.pending = target ? { x: x, y: y, target: target } : null;
      if (!p.path.length && p.pending) this.arrive();
      return true;
    }

    tryStep(dir) {
      var p = this.p, d = DIRS[dir];
      p.facing = dir;
      var nx = p.tx + d[0], ny = p.ty + d[1];
      if (!this.walkable(nx, ny)) { this.player.anims.stop(); this.player.setFrame(this.idleFrame(this.heroKey, dir)); return false; }
      this.beginStep(nx, ny);
      return true;
    }

    beginStep(nx, ny) {
      var p = this.p;
      // 腳步聲：依腳下圖塊分草地／石板／木棧道／泥地（每兩步一聲，避免太吵）
      this.stepCount = (this.stepCount || 0) + 1;
      if (this.stepCount % 2 === 0) J.Audio.play('footstep', J.Sfx ? J.Sfx.terrainOf(this.defAt(nx, ny).tile) : 'grass');
      var dx = nx - p.tx, dy = ny - p.ty;
      p.facing = dx > 0 ? 'right' : dx < 0 ? 'left' : dy > 0 ? 'down' : 'up';
      p.moving = true; p.t = 0;
      p.from = { x: p.tx * T + T / 2, y: p.ty * T + T };
      p.to = { x: nx * T + T / 2, y: ny * T + T };
      p.stepMs = STEP_MS / G().moveSpeed();
      p.prev = { x: p.tx, y: p.ty };
      p.tx = nx; p.ty = ny;
      var key = this.player.texture.key + '-' + p.facing;
      if (!this.player.anims.isPlaying || this.player.anims.currentAnim.key !== key) this.player.anims.play(key);
      var self = this;
      var spot = J.MapInfo.petSpot(function (x, y) { return self.walkable(x, y); }, this.size.w, this.size.h, { x: p.prev.x, y: p.prev.y }, { x: p.tx, y: p.ty }) || p.prev;
      this.petTarget = { x: spot.x * T + T / 2, y: spot.y * T + T };
    }

    arrive() {
      var p = this.p, g = G();
      g.state.location = { map: this.mapId, x: p.tx, y: p.ty };
      var ex = J.World.exitAt(this.map, p.tx, p.ty);
      if (ex) { p.path = []; p.pending = null; this.goExit(ex); return true; }
      if (!p.path.length && p.pending) {
        var pend = p.pending; p.pending = null;
        this.player.anims.stop();
        this.face(pend.x, pend.y);
        this.interact(pend.target);
        return true;
      }
      return false;
    }

    goExit(ex) {
      var self = this;
      if (this.transitioning) return;
      this.transitioning = true;
      J.Audio.play('warp');
      J.HUD.prompt(null);
      this.cameras.main.fadeOut(250, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', function () { G().changeMap(ex.to, ex.tx, ex.ty, self.p.facing); });
    }

    // ---------------------------------------------------------------- 互動
    interactableAt(x, y) {
      var i;
      for (i = 0; i < this.npcs.length; i++) if (this.npcs[i].data.x === x && this.npcs[i].data.y === y) return { kind: 'npc', npc: this.npcs[i].data };
      for (i = 0; i < this.chests.length; i++) if (this.chests[i].data.x === x && this.chests[i].data.y === y) return { kind: 'chest', chest: this.chests[i].data };
      for (i = 0; i < this.lamps.length; i++) if (this.lamps[i].data.x === x && this.lamps[i].data.y === y) return { kind: 'lamp', lamp: this.lamps[i].data };
      if (this.station && this.station.x === x && this.station.y === y) return { kind: 'station', station: this.station };
      return null;
    }

    /** 面前或旁邊可以互動的東西 */
    nearbyInteractable() {
      var p = this.p, d = DIRS[p.facing];
      var on = this.interactableAt(p.tx, p.ty);    // 站在車站格上
      if (on) return { t: on, x: p.tx, y: p.ty };
      var f = this.interactableAt(p.tx + d[0], p.ty + d[1]);
      if (f) return { t: f, x: p.tx + d[0], y: p.ty + d[1] };
      var dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
      for (var i = 0; i < dirs.length; i++) {
        var x = p.tx + dirs[i][0], y = p.ty + dirs[i][1];
        var t = this.interactableAt(x, y);
        if (t) return { t: t, x: x, y: y };
      }
      return null;
    }

    actionKey() {
      if (J.UI.isOpen() || this.transitioning || this.p.moving || G().busy) return;
      var n = this.nearbyInteractable();
      if (n) { this.face(n.x, n.y); this.interact(n.t); }
    }

    interact(t) {
      var g = G();
      this.p.path = [];
      J.HUD.prompt(null);
      if (t.kind === 'npc') g.talkTo(t.npc, this);
      else if (t.kind === 'chest') g.openChest(t.chest, this);
      else if (t.kind === 'lamp') g.inspectLamp(t.lamp, this);
      else if (t.kind === 'station') g.useStation(t.station, this);
    }

    promptText(t) {
      if (t.kind === 'npc') return '和' + G().speaker(t.npc.id).name + '說話';
      if (t.kind === 'chest') return G().state.chests[t.chest.id] ? '看看寶箱' : '打開寶箱';
      if (t.kind === 'station') return '在' + (t.station.name || '車站') + '搭車';
      return '看看' + t.lamp.subject + '燈';
    }

    // ---------------------------------------------------------------- 每一格畫面
    update(time, delta) {
      var g = G(), p = this.p;
      if (!p || this.transitioning) return;
      var blocked = J.UI.isOpen() || g.busy;
      if (p.moving) {
        p.t += delta;
        var k = Math.min(1, p.t / (p.stepMs || STEP_MS));
        this.player.x = p.from.x + (p.to.x - p.from.x) * k;
        this.player.y = p.from.y + (p.to.y - p.from.y) * k;
        if (k >= 1) {
          p.moving = false;
          if (this.arrive()) { this.syncDepths(); return; }
        }
      }
      if (!p.moving && !blocked) {
        var dir = g.heldDir();
        if (dir) { p.path = []; p.pending = null; this.tryStep(dir); }
        else if (p.path.length) {
          var n = p.path.shift();
          if (this.walkable(n.c, n.r)) this.beginStep(n.c, n.r); else p.path = [];
        } else if (this.player.anims.isPlaying) { this.player.anims.stop(); this.player.setFrame(this.idleFrame(this.heroKey, p.facing)); }
      }
      // 番薯仔跟在後面
      var dx = this.petTarget.x - this.pet.x, dy = this.petTarget.y - this.pet.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 0.5) {
        var sp = Math.min(dist, delta * 0.085 * S * G().moveSpeed());
        this.pet.x += dx / dist * sp; this.pet.y += dy / dist * sp;
        var pdir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
        var pk = this.pet.texture.key + '-' + pdir;
        if (!this.pet.anims.isPlaying || this.pet.anims.currentAnim.key !== pk) this.pet.anims.play(pk);
      } else if (this.pet.anims.isPlaying) { this.pet.anims.stop(); this.pet.setFrame(this.idleFrame('pet_imo', 'down')); }
      // 番薯仔走到障礙或 NPC 上面（例如轉角時）就變半透明，像是暫時穿過去
      var ptx = Math.floor(this.pet.x / T), pty = Math.floor((this.pet.y - 1) / T);
      this.pet.setAlpha(this.walkable(ptx, pty) ? 1 : 0.5);
      this.updateGhost();

      this.wanderMonsters(time);
      this.syncDepths();
      if (!blocked && time > this.encounterCooldown) this.checkEncounter();
      if (!blocked && !p.moving) {
        var near = this.nearbyInteractable();
        var self = this;
        if (near) J.HUD.prompt(this.promptText(near.t), function () { self.face(near.x, near.y); self.interact(near.t); });
        else J.HUD.prompt(null);
      } else if (p.moving) J.HUD.prompt(null);
    }

    syncDepths() {
      this.player.setDepth(this.player.y);
      this.pet.setDepth(this.pet.y - 0.1);
      this.monsters.forEach(function (m) { if (m.sprite) m.sprite.setDepth(m.sprite.y); });
    }

    checkEncounter() {
      var px = this.player.x, py = this.player.y;
      for (var i = 0; i < this.monsters.length; i++) {
        var m = this.monsters[i];
        if (!m.active || !m.sprite) continue;
        var dx = m.sprite.x - px, dy = m.sprite.y - py;
        if (Math.abs(dx) < T * 0.65 && Math.abs(dy) < T * 0.65) { this.startBattle(m); return; }
      }
    }

    startBattle(mob) {
      var self = this;
      this.p.path = []; this.p.pending = null;
      this.p.moving = false;
      this.player.setPosition(this.p.tx * T + T / 2, this.p.ty * T + T);
      this.player.anims.stop();
      this.encounterCooldown = Infinity;
      J.HUD.prompt(null);
      J.Audio.play('encounter');
      this.cameras.main.flash(250, 255, 255, 255);
      this.time.delayedCall(260, function () { G().startBattle(mob, self); });
    }

    /** 小地圖用：地圖大小、背景、NPC、出口、店家、怪物、主角位置（格子座標） */
    minimapInfo() {
      var self = this, g = G();
      return {
        mapId: this.mapId, name: this.map.name, w: this.size.w, h: this.size.h,
        bg: this.hasBg ? this.textures.get('map:' + this.bgFile).getSourceImage() : null,
        walk: function (x, y) { return self.walkable(x, y); },
        player: { x: this.p.tx, y: this.p.ty },
        npcs: this.npcs.filter(function (n) { return !n.data.virtual; }).map(function (n) { return { id: n.data.id, name: g.speaker(n.data.id).name, x: n.data.x, y: n.data.y }; }),
        exits: (this.map.exits || []).map(function (e) { return { x: e.x, y: e.y, to: e.to, name: (g.data.maps[e.to] || {}).name || e.to }; }),
        shops: (this.signs || []).map(function (s) { return { kind: s.spot.kind, text: s.spot.text, x: s.spot.npcX, y: s.spot.npcY }; }),
        station: this.station ? { x: this.station.x, y: this.station.y, name: this.station.name } : null,
        monsters: this.monsters.filter(function (m) { return m.active; }).map(function (m) { return { id: m.id, x: m.tx, y: m.ty, boss: m.boss }; })
      };
    }

    /** 小地圖點 NPC：在遊戲畫面閃一下那個位置 */
    flashAt(x, y) {
      this.sparkle(x * T + T / 2, y * T + T / 2, 0x7be0ff);
      var ring = this.add.circle(x * T + T / 2, y * T + T / 2, T * 0.8).setStrokeStyle(3, 0xffd34d).setDepth(61000);
      this.tweens.add({ targets: ring, scale: 1.6, alpha: 0, duration: 450, repeat: 3, onComplete: function () { ring.destroy(); } });
    }

    onWake(data) {
      this.cameras.main.fadeIn(250, 0, 0, 0);
      this.encounterCooldown = this.time.now + 2000;
      if (data.mob) this.monsterRunAway(data.mob, data.result === 'win');
      this.refreshMarkers();
      this.updateLamps();
    }
  }

  window.JQ = window.JQ || {};
  window.JQ.MapScene = MapScene;
})();
