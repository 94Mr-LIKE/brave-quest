/*
 * 地圖場景：3/4 俯視地圖（邏輯格子 32px，內部解析度 640×360）
 * - 地圖有 bg（GPT 畫的整張背景圖，放 assets/maps/）就整張貼上，grid 只用來算碰撞與互動；
 *   有 fg（同尺寸透明前景，例如樹冠、屋簷）就蓋在角色上方
 * - 沒有 bg 時才退回程式產生的圖塊（開發用備援），樹冠、屋頂依「腳底 y」和角色前後排序
 * - 網址加 ?debug=1：把 grid 半透明疊在背景上（綠＝可走、紅＝擋、藍＝出口），方便校對碰撞
 * - 點擊／觸控地面用 A* 走過去；方向鍵／WASD／螢幕方向鍵也能走
 * - v1.0.6 斜走（8 方向、仍然是格子移動；規則在 systems/move8.js）：不斜穿牆角、貼牆斜推會順著滑、
 *   v4.2.2 斜走一步的時間和直走一樣（以前是 √2 倍）；走路圖只有四方向，斜走時面向橫向（原本面向其中一個分量方向就不轉）
 * - 看得見的怪物在 spawns 範圍遊走，碰到就進入戰鬥；戰鬥後跑走、30 秒後重生
 * - 只載入這張地圖用到的圖塊與角色圖
 * - v0.5 大地圖（邊長 3 倍）：背景可為 .webp；超過裝置最大貼圖尺寸時自動切塊；載入時顯示進度條；
 *   鏡頭外的怪物不播動畫、遊走降頻，NPC 動畫暫停，備援圖塊分區隱藏；深度只在改變時才設定（避免每格重新排序）
 * - v4.2.2 第三批：角色腳下影子（共用一張程式貼圖）、NPC 腳底固定的呼吸、有腳的野怪踏步／沒腳的上下飄動（第四次修改；數學在 systems/sprite_anim.js；只改畫面，不改位置）
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
  var FG_CELL_DEPTH = 40000;   // 上層格（'U'：從背景切出來、畫在角色上方的那一格）
  var LABEL_DEPTH = 45000;     // v0.9.6 站名小牌：一定在上層格之上（不然會被背景蓋掉一部分字）；在前景大圖（50000）、剪影（60000）之下
  var GLOW_DEPTH = 1;       // 燈光光暈：背景（0）與傳送光圈（0.5）之上、所有角色（深度＝腳底 y ≥ 32）之下
  var CHAR_SHADOW_DEPTH = 5;   // v4.2.2 角色腳下影子：地面、樹影（1）、東部地面標示（2–4）之上，所有角色（≥ 32）之下，不會蓋到別的角色
  var MOB_STEP_MS = 520;   // 野怪走一格的時間（v4.2.2 有腳的野怪一格踏兩步照這個算）
  var FRIEND_STEP_MS = 650;   // v4.2.2 會走動的友善動物（M33 帝雉）走一格的時間（和黃牛一樣慢）
  // 主角以外角色的剪影（coverFx）：和主角的剪影（buildForeground，那一行照舊寫數字）同色、同透明度、同深度
  var GHOST_TINT = 0xdfeeff, GHOST_ALPHA = 0.35, GHOST_DEPTH = 60000;
  var BUCKET = 8;          // 大地圖備援圖塊的分區大小（格）：鏡頭外的分區隱藏

  function G() { return J.Game; }

  class MapScene extends Phaser.Scene {
    constructor() { super('Map'); }

    init(data) {
      this.mapId = data.mapId;
      this.startX = data.x; this.startY = data.y;
      this.startFacing = data.facing || 'down';
      this.map = G().data.maps[this.mapId];
      // 場景重新開始時物件會留著上一張地圖的值：車站要先清掉（不然沒有車站的地圖會顯示上一張的「在○○站搭車」）
      this.station = null; this.stationSign = null; this.stationLabel = null; this.stationLabelInfo = null; this.stationShelter = null;
      // 上一張地圖的 hasBg、主角狀態也不要留著（create 之前讀到舊值會誤判「新地圖已經好了」）
      this.hasBg = false; this.p = null;
      this.safePts = null;   // 同樣的原因：下車點安全範圍是每張地圖各自算的
      this.animals = [];
    }

    preload() {
      var A = J.Assets, g = G(), map = this.map, self = this;
      A.watch(this);
      A.queueTileset(this, map.tileset);      // 寶箱、燈、傳送光圈與備援地面用
      // 背景／前景圖：maps.js 的 bg、fg 優先；沒寫時看 art_manifest.js 有沒有 bg_<地圖>.png、fg_<地圖>.png
      var artMap = A.art().maps[this.mapId] || {};
      this.bgFile = map.noBg ? null : (map.bg || artMap.bg || null);   // noBg：試做大地圖只用格子（備援圖塊）
      this.fgFile = map.fg || artMap.fg || null;
      if (map.noFg) this.fgFile = null;   // 試做大地圖（?debug=bigpilot）不用原本小地圖的前景
      if (this.bgFile) A.queueMapImage(this, this.bgFile);
      if (this.fgFile) A.queueMapImage(this, this.fgFile);
      // v0.5：大地圖背景（1–2MB）第一次載入時顯示進度條，並記錄載入時間（debug.mapLoadLog()）
      this.loadT0 = performance.now();
      var bigFiles = [this.bgFile, this.fgFile].filter(function (f) { return f && !self.textures.exists('map:' + f); });
      // 上一次的進度條（例如載入到一半就換地圖）先關掉，避免「地圖載入中 0%」一直留在畫面上
      this.closeLoadBar();
      if (bigFiles.length) {
        var bar = this.loadBar = J.UI.progress('地圖載入中……');
        this.loadProgress = function (v) { bar.set(v); };
        this.load.on('progress', this.loadProgress);
        this.load.once('complete', function () {
          self.closeLoadBar();
          g.mapLoadLog.push({ map: self.mapId, files: bigFiles, ms: Math.round(performance.now() - self.loadT0) });
        });
      }
      // 寶箱與招牌（GPT 圖，sprites.js；沒有圖時用程式畫的暫代圖）
      if ((map.chests || []).length) { if (A.has('chest_closed')) A.queue(this, 'chest_closed'); if (A.has('chest_open')) A.queue(this, 'chest_open'); }
      J.MapInfo.signSpots(map).forEach(function (sg) { if (A.has('sign_' + sg.kind)) A.queue(self, 'sign_' + sg.kind); });
      this.heroKey = A.heroKey(g.state.player.gender, g.state.player.job);
      A.queue(this, this.heroKey, g.state.player.name);
      A.queue(this, 'pet_imo', '番薯仔');
      if (J.TreeFX) J.TreeFX.preload(this);   // v3.0.1（86 號 #5 #6）樹影、落葉、轉場葉叢圖（docs/assets/fx）
      if (J.Followers) J.Followers.preload(this);   // v3.0 跟班掛鉤（codex5）：載入已加入的霧仔
      this.npcList().forEach(function (n) { A.queue(self, n.sprite || 'npc_unknown', g.speaker(n.id).name); });
      (map.spawns || []).forEach(function (s) {
        var m = g.data.monsters[s.monster];
        // v4.2.2 野怪多幀圖（sprites.js 有登錄 <圖像 key>_anim 才載入；美術分批交，還沒畫的怪不發請求）
        if (m) { A.queue(self, m.sprite, m.name); if (A.has(m.sprite + '_anim')) A.queue(self, m.sprite + '_anim'); }
      });
      // v4.2 第六座燈座（金色燈）、大結局過場的鎮民
      if ((map.lamps || []).some(function (l) { return l.subject === '曙光'; })) ['lamp_dawn_on', 'lamp_dawn_off'].forEach(function (k) { if (A.has(k)) A.queue(self, k); });
      if (Array.isArray(g.endingExtras) && g.endingExtrasMap === this.mapId) g.endingExtras.forEach(function (e) { if (A.has(e.sprite)) A.queue(self, e.sprite); });
      // v0.9.3 會走動的動物（黃牛）：美術還沒畫時用暫代圖（四方向走路格式）
      J.MapInfo.animalSpecs(map).forEach(function (a) { A.queue(self, a.sprite, a.name); });
      // v0.9.4 車站：新站牌、候車亭（sprites.js 有才載入；沒有時用程式畫的站牌）
      if (map.station && A.has('obj_station')) A.queue(this, 'obj_station');   // v0.9.5 每個車站都畫站牌
      if (map.station && map.station.shelter && A.has('obj_bus_shelter')) A.queue(this, 'obj_bus_shelter');
      // v0.9.5 廟內的媽祖神像（MT1）：美術的 obj_mazu_statue 還沒到時用暫代圖（色塊＋字）
      if (map.statue) A.queue(this, map.statue.sprite || J.MapInfo.STATUE_SPRITE, '媽祖');
      // v1.1 路牌（59 號 2.8；地圖物件，不是 NPC）：美術 obj_road_sign（32×48，底部置中）；沒有圖時用程式畫的木牌
      if ((map.roadsigns || []).length && A.has('obj_road_sign')) A.queue(this, 'obj_road_sign');
      (map.friendly || []).forEach(function (f) { A.queue(self, f.sprite, f.name); });   // v3.0 友善動物（黑面琵鷺、綠蠵龜）
      if (map.boat_dock && A.has('ferry_boat')) A.queue(this, 'ferry_boat');   // v4.2.2 碼頭的船（美術圖還沒登記時用程式畫的船）
    }

    /** 地圖上的 NPC，加上「沒有站櫃 NPC 的旅店」虛擬老闆 */
    /** 關掉地圖載入進度條（載入完成、場景重新開始或結束時都會呼叫） */
    closeLoadBar() {
      if (this.loadProgress) { this.load.off('progress', this.loadProgress); this.loadProgress = null; }
      if (this.loadBar) { this.loadBar.close(); this.loadBar = null; }
    }

    npcList() {
      var map = this.map, list = (map.npcs || []).slice();
      if (map.inn && !map.inn.npc && !list.some(function (n) { return n.x === map.inn.x && n.y === map.inn.y; })) {
        // v0.9.3 B14 各地旅店不一樣：台詞用 maps.js 的 inn.dialog（沒有設定才用 D_INN_IDLE）
        list.push({ id: '__inn', x: map.inn.x, y: map.inn.y, sprite: J.MapInfo.innKeeperSprite(map, G().data.dialogs, window.VOICES, J.Assets.has), dialog: J.MapInfo.innDialog(map, null), virtual: true });
      }
      return list;
    }

    create() {
      var g = G(), self = this, map = this.map;
      this.closeLoadBar();   // 保險：地圖已經建好，進度條一定要關
      this.events.once('shutdown', function () { self.closeLoadBar(); });
      J.Assets.finalize(this);
      this.makeUiTextures();
      this.size = J.World.size(map);
      // 大地圖：比畫面大兩倍以上（v0.5 的 3 倍地圖）→ 啟用分區隱藏與平滑鏡頭
      this.bigMap = this.size.w * T > C.VIEW_W * 2 || this.size.h * T > C.VIEW_H * 2;
      this.areaCache = new Map();
      this.cullAt = 0;
      // 場景重新開始（換地圖）時同一個物件會被重用：上一張地圖的分塊、分區資料要清掉
      this.safePts = null;
      this.bgChunks = null; this.buckets = null; this.groundLayer = null; this.bucketKey = null; this.fgBuckets = null; this.glows = []; this.upperSet = null;
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
      (map.lamps || []).forEach(function (l) { if (self.lampShown(l)) self.blocked[l.x + ',' + l.y] = true; });   // v4.2 第六座燈座沒出現前不擋路
      (map.roadsigns || []).forEach(function (r) { self.blocked[r.x + ',' + r.y] = true; });   // v1.1 路牌（格子本來就是 K）

      this.hasBg = !!(this.bgFile && this.textures.exists('map:' + this.bgFile));
      // file:// 模式（雙擊 index.html）沒有打包大地圖背景：改用格子備援圖塊，並提示用網址開啟（每次開遊戲只提示一次）
      if (this.bgFile && !this.hasBg && J.Assets.FILE_MODE && !g.fileBgNoticeShown) {
        g.fileBgNoticeShown = true;
        J.UI.toast('這張地圖的背景圖很大，直接開檔案時看不到；請用網址開啟遊戲，就能看到完整的地圖畫面。', 7000);
      }
      // v0.7 快取混版：背景圖讀不到，或背景尺寸不等於「格子數×32」→ 資料（maps.js）和圖檔不是同一版，請玩家重新整理（不默默改畫備援）
      this.bgMissing = false;
      if (this.bgFile && !J.Assets.FILE_MODE) {
        var bgk = 'map:' + this.bgFile, need = [this.size.w * T, this.size.h * T];
        if (!this.hasBg) {
          // v0.9.3（老闆截圖 003805）：背景沒讀到時不要退回備援方塊。先自動再讀一次（網路一時不穩）；
          // 還是讀不到才蓋上「地圖讀不到」的畫面並請玩家重新整理（孩子不會看到方塊）
          g.bgRetry = g.bgRetry || {};
          if (!g.bgRetry[this.bgFile]) {
            g.bgRetry[this.bgFile] = 1;
            delete J.Assets.failed[bgk];
            console.warn('[地圖] 背景圖沒讀到，再讀一次：' + this.bgFile);
            this.p = null; this.transitioning = true;   // 重新開始之前 update() 不要動
            this.scene.restart({ mapId: this.mapId, x: this.startX, y: this.startY, facing: this.startFacing });
            return;
          }
          this.bgMissing = true;
          g.versionMismatch({ map: this.mapId, file: this.bgFile, reason: 'missing', grid: need });
        } else {
          var bsrc = this.textures.get(bgk).getSourceImage();
          if (Math.abs(bsrc.width - need[0]) > 2 || Math.abs(bsrc.height - need[1]) > 2) g.versionMismatch({ map: this.mapId, file: this.bgFile, reason: 'size', image: [bsrc.width, bsrc.height], grid: need });
        }
      }
      if (this.hasBg) this.buildBackground();
      else if (this.bgMissing) this.buildMissingCover();
      else this.buildTiles();   // 本來就沒有背景圖的地圖（例如 ?debug=bigpilot 的格子試做）、file:// 模式
      this.buildExits();
      this.buildObjects();
      this.buildCharacters();
      // v0.9.5 地標提示：一開始就站在地標範圍裡（例如存檔在廟前）不跳提示，走出去再走進來才跳
      this.landmarkNow = this.p ? J.MapInfo.landmarkAt(map, this.p.tx, this.p.ty) : null;
      this.buildMonsters();
      this.buildAnimals();
      this.buildFriendlyWander();   // v4.2.2 M33 帝雉分散走動
      this.buildSigns();
      this.buildLights();
      this.buildForeground();
      if (J.TreeFX) J.TreeFX.build(this);   // v3.0.1（86 號 #5）樹冠局部透明、樹蔭、地面樹影、落葉
      if (g.DEBUG) this.buildDebugOverlay();

      var cam = this.cameras.main;
      // 鏡頭：限制在地圖範圍內（地圖至少和畫面一樣大，邊界不會露出黑邊）；大地圖跟得柔和一點，主角在中間一小塊範圍內走動時鏡頭不動
      cam.setBounds(0, 0, this.size.w * T, this.size.h * T);
      // v3.0.1（86 號 #1；wip_v301/v301_motion_apply.js）：鏡頭跟著「鏡頭目標」（lerp 1、不用死區），目標每幀由 updateCamTarget 算：
      //   平滑中心依時間逼近主角（JQ.Motion.camStep），目標＝round(主角)－取整後的落後量 → 主角和鏡頭一起取整，主角在畫面上不會前後跳。
      //   以前是「大地圖 lerp 0.12＋死區 2×1.5 格、小地圖 lerp 0.2」各自取整：實測主角在畫面上每秒前後跳 3.6–6 次（84 號實測）
      this.camC = null;
      this.camTarget = this.add.zone(Math.round(this.player.x), Math.round(this.player.y), 1, 1);
      cam.startFollow(this.camTarget, true, 1, 1);
      this.updateCamTarget(0);
      cam.setRoundPixels(true);
      if (!(J.TreeFX && J.TreeFX.sweepIn(this))) cam.fadeIn(250, 0, 0, 0);   // v3.0.1（86 號 #6）
      if (J.Ambience) J.Ambience.enterMap(this.mapId, this.p.tx, this.p.ty);   // v3.0.1（86 號 #7）環境音

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
      var self = this, w = this.size.w, h = this.size.h, first = this.children.list.length;
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
      if (this.bigMap) this.organizeTiles(first);
    }

    /**
     * 大地圖的備援圖塊（幾千張）：地面放進一個圖層（不參與角色的深度排序），
     * 全部圖塊依 BUCKET×BUCKET 格分區，鏡頭附近以外的區塊隱藏（cull）
     */
    organizeTiles(first) {
      var self = this, list = this.children.list.slice(first), B = BUCKET * T;
      this.groundLayer = this.add.layer().setDepth(0);
      this.buckets = {};
      list.forEach(function (o) {
        var k = Math.floor(o.x / B) + ',' + Math.floor(o.y / B);
        (self.buckets[k] || (self.buckets[k] = [])).push(o);
        if (o.depth < 1) { o.__ground = true; self.groundLayer.add(o); }
      });
      this.bucketKey = null;
      // 鏡頭外被拿出畫面清單的圖塊，換地圖時不會被 Phaser 自動清掉，要自己清
      var buckets = this.buckets;
      this.events.once('shutdown', function () {
        Object.keys(buckets).forEach(function (k) { buckets[k].forEach(function (o) { if (!o.displayList && o.scene) o.destroy(); }); });
      });
    }

    /** 整張背景圖（GPT 繪製）；尺寸應為 欄數×32 × 列數×32，不合時拉伸並提醒 */
    buildBackground() {
      var key = 'map:' + this.bgFile, W = this.size.w * T, H = this.size.h * T;
      var src = this.textures.get(key).getSourceImage();
      if (src.width !== W || src.height !== H) {
        console.warn('[地圖] ' + this.mapId + ' 背景圖是 ' + src.width + '×' + src.height + '，應該是 ' + W + '×' + H + '（欄數×32 × 列數×32），已自動拉伸');
      }
      this.bgChunks = this.addBigImage(key, 0, W, H);
    }

    /** 裝置的最大貼圖尺寸（gl.MAX_TEXTURE_SIZE；網址 ?maxtex=N 可在測試時調小，模擬 iPad／Chromebook） */
    maxTex() {
      var r = this.sys.renderer, m = (r && r.getMaxTextureSize && r.getMaxTextureSize()) || 4096;
      var o = G().MAX_TEX_OVERRIDE;
      return o && o < m ? o : m;
    }

    /**
     * 貼一張「整張地圖大小」的圖（背景或前景）。圖比最大貼圖尺寸大時，切成 2×2 或更多塊（每塊對齊格子）分別貼上。
     * 回傳分塊清單 [{ key, sx, sy, sw, sh, kx, ky }]：sx/sy/sw/sh＝這塊在原圖的範圍，kx/ky＝原圖 1 像素等於世界幾像素
     */
    addBigImage(key, depth, W, H) {
      var src = this.textures.get(key).getSourceImage();
      var iw = src.width, ih = src.height, kx = W / iw, ky = H / ih, max = this.maxTex();
      if (iw <= max && ih <= max) {
        this.add.image(0, 0, key).setOrigin(0, 0).setScale(kx, ky).setDepth(depth);
        return [{ key: key, sx: 0, sy: 0, sw: iw, sh: ih, kx: kx, ky: ky }];
      }
      var cellW = T / kx, cellH = T / ky;                         // 一格在原圖是幾像素
      var cw = Math.max(1, Math.floor(max / cellW)) * cellW, ch = Math.max(1, Math.floor(max / cellH)) * cellH;
      var nx = Math.ceil(iw / cw), ny = Math.ceil(ih / ch), out = [];
      for (var j = 0; j < ny; j++) {
        for (var i = 0; i < nx; i++) {
          var sx = Math.round(i * cw), sy = Math.round(j * ch);
          var sw = Math.min(Math.round((i + 1) * cw), iw) - sx, sh = Math.min(Math.round((j + 1) * ch), ih) - sy;
          var k = key + '#' + i + ',' + j;
          if (!this.textures.exists(k)) {
            var c = document.createElement('canvas');
            c.width = sw; c.height = sh;
            c.getContext('2d').drawImage(src, sx, sy, sw, sh, 0, 0, sw, sh);
            this.textures.addCanvas(k, c);
          }
          this.add.image(sx * kx, sy * ky, k).setOrigin(0, 0).setScale(kx, ky).setDepth(depth);
          out.push({ key: k, sx: sx, sy: sy, sw: sw, sh: sh, kx: kx, ky: ky });
        }
      }
      console.info('[地圖] ' + key + ' ' + iw + '×' + ih + ' 超過最大貼圖尺寸 ' + max + '，切成 ' + nx + '×' + ny + ' 塊');
      return out;
    }

    /** 出口的傳送光圈 */
    buildExits() {
      var self = this, st = G().state;
      (this.map.exits || []).forEach(function (e) {
        // v4.2 第 4c 批：M41 雲階（requires 含 ending_done）結局前是雲海，不畫傳送光圈
        if ([].concat(e.requires || []).indexOf('ending_done') >= 0 && !(st && st.flags && st.flags.ending_done === true)) return;
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
      bubble('ui:proverb', '#7fc8ff', '?');   // v1.3.1 可以玩諺語挑錯的阿伯（藍色）
      if (!this.textures.exists('ui:spark')) {
        var c = document.createElement('canvas'); c.width = 4; c.height = 4;
        var g = c.getContext('2d'); g.fillStyle = '#ffffff'; g.fillRect(1, 0, 2, 4); g.fillRect(0, 1, 4, 2);
        this.textures.addCanvas('ui:spark', c);
      }
      if (!this.textures.exists('fx:footshadow')) {   // v4.2.2 所有角色共用的腳下影子（寬 32、高 12 的黑色橢圓；透明度由每個影子自己設）
        var fc = document.createElement('canvas'); fc.width = 32; fc.height = 12;
        var fg = fc.getContext('2d'); fg.fillStyle = '#000000';
        // 逐格填實心像素（不用抗鋸齒的半透明邊）：像素圖風格、在雜色草地上邊緣也看得清楚
        for (var ey = 0; ey < 12; ey++) for (var ex = 0; ex < 32; ex++) if (Math.pow((ex + 0.5 - 16) / 16, 2) + Math.pow((ey + 0.5 - 6) / 6, 2) <= 1) fg.fillRect(ex, ey, 1, 1);
        this.textures.addCanvas('fx:footshadow', fc);
      }
    }

    /** v0.9.3 背景圖讀不到（重試後）：不畫備援方塊，鏡頭前蓋一層深色畫面＋文字，等玩家按「重新整理」 */
    buildMissingCover() {
      var W = this.scale.width || C.VIEW_W, H = this.scale.height || C.VIEW_H;   // v1.4 直放畫面變高時文字照樣置中
      this.cameras.main.setBackgroundColor('#0b1236');
      var cover = this.add.rectangle(-W, -H, W * 4, H * 4, 0x0b1236, 1).setOrigin(0, 0).setScrollFactor(0).setDepth(70000);
      var txt = this.add.text(W / 2, H / 2, '地圖圖片讀不到\n請按「重新整理」', { fontFamily: 'sans-serif', fontSize: '28px', color: '#fffbe8', align: 'center' })
        .setOrigin(0.5).setScrollFactor(0).setDepth(70001);
      this.missingCover = [cover, txt];
      G().bgMissingShown = (G().bgMissingShown || 0) + 1;   // 測試用
    }

    // ---------------------------------------------------------------- 物件
    buildObjects() {
      var self = this, g = G(), st = g.state;
      var stn = this.map.station;
      if (stn && stn.requires && !J.World.exitOpen({ requires: stn.requires }, st)) stn = null;   // v4.2 4c 夜班：M41 玉山站（requires ending_done）結局前不出現、不能搭
      this.station = stn || null;
      // v1.1 眺望點（59 號 2.9.4 美人山）：可以走的格子，放一支程式畫的望遠鏡；站上去或站在旁邊按 A，跳出插圖＋旁白
      this.viewpoints = (this.map.viewpoints || []).map(function (v) {
        var img = self.add.image(v.x * T + T / 2, (v.y + 1) * T - 2, self.viewpointTexture()).setOrigin(0.5, 1).setDepth((v.y + 1) * T - 2);
        return { data: v, img: img };
      });
      // v1.1 路牌：靜態圖（不浮動、沒有「！」），腳底貼在格子下緣；站在旁邊按 A 播 roadsigns[].dialog
      this.roadsigns = (this.map.roadsigns || []).map(function (r) {
        var key = self.hasArt('obj_road_sign') ? J.Assets.texKey('obj_road_sign') : self.roadSignTexture();
        var img = self.add.image(r.x * T + T / 2, (r.y + 1) * T, key).setOrigin(0.5, 1).setDepth((r.y + 1) * T - 1);
        return { data: r, img: img };
      });
      this.stationSign = null;
      // v0.9.5（老闆 2026-10-11 在金包里說「車站也沒有」：背景上的站牌看不出來）：每個車站都畫程式站牌，站牌上方寫站名。
      // （v0.9.3 的 drawSign:false 已經從 maps.js 拿掉；舊資料若還有 drawSign:false 仍照舊不畫）
      if (stn && stn.drawSign !== false) {
        // v0.9.4 B17：美術的新站牌（sprite obj_station，牌面空白），站名由程式寫在站牌上方的小牌子
        var art = this.hasArt('obj_station');
        var key = art ? J.Assets.texKey('obj_station') : 'ui:station';
        this.stationSign = this.add.image(stn.x * T + T / 2, stn.y * T + T, key).setOrigin(0.5, 1).setDepth((stn.y + 1) * T - 1);
        if (stn.name) {
          // v0.9.6（46 號地圖稽核：M04「神木森林站」只顯示「木森林站」，第一個字被白底框切掉）：
          // 不再用 Phaser 的 text（框的寬度和實際畫出來的字寬對不上），改成自己在畫布上量字寬、畫白底框和字，框一定比字寬
          var lab = this.stationLabelTexture(stn.name);
          this.stationLabel = this.add.image(stn.x * T + T / 2, stn.y * T + T - this.stationSign.displayHeight - 2, lab.key)
            .setOrigin(0.5, 1).setScale(1 / lab.res).setDepth(LABEL_DEPTH);
          // ↑ 真正切字的原因：M04 站名的左半邊壓到上層格（'U'，從背景切出來畫在角色上方，深度 40000），被背景蓋住。
          //   站名是要給人看的字，一律畫在上層格之上（LABEL_DEPTH）
          this.stationLabelInfo = { text: stn.name, textW: lab.textW, boxW: lab.boxW, displayW: this.stationLabel.displayWidth, depth: LABEL_DEPTH, fgDepth: FG_CELL_DEPTH };   // 測試用
        }
      }
      // v0.9.4 B17（老闆 D17「每個車站都可以有」）：背景沒有畫站房的車站旁放候車亭（maps.js station.shelter = 左上角格子，3×3 格；只擋最下面一排）
      this.stationShelter = null;
      if (stn && stn.shelter && this.hasArt('obj_bus_shelter')) {
        var sh = stn.shelter;
        this.stationShelter = this.add.image((sh.x + 1.5) * T, (sh.y + 3) * T, J.Assets.texKey('obj_bus_shelter')).setOrigin(0.5, 1).setDepth((sh.y + 3) * T - 1);
      }
      // v0.9.5（老闆：金包里慈護宮要看得到）：地標的匾額（maps.js landmarks[].plaque，程式畫的紅底金字，掛在廟門楣）
      // 位置＝美術在背景上留的空白匾額（M01 門楣、MT1 正殿後牆）；字（老闆 2026-10-11 指定「慈護宮」三個字）＝plaque.text
      this.plaques = [];
      J.MapInfo.plaqueSpots(this.map).forEach(function (pq) {
        var img = self.add.image(pq.x * T, pq.y * T, self.plaqueTexture(pq.text, pq.w * T, pq.h * T)).setOrigin(0.5).setDepth(Math.ceil(pq.y + 0.5) * T + 2);
        self.plaques.push({ spot: pq, img: img });
      });
      // v0.9.5 媽祖神像（MT1；在拜墊那一列面對供桌或神像按 A＝轉職）。
      // 地圖組：神座 2 格寬（statue.x 和 x+1），中心在兩格交界（MT1：像素 x=384）、神像腳底對齊 statue.y 的下緣（像素 y=192）
      // 美術圖 obj_mazu_statue（64×96）照原尺寸畫；還沒有圖時暫代圖縮成約 2.2 格高
      this.statueImg = null;
      if (this.map.statue) {
        var skey = this.map.statue.sprite || J.MapInfo.STATUE_SPRITE, sk = J.Assets.texKey(skey);
        if (this.textures.exists(sk)) {
          var si = this.add.image((this.map.statue.x + 1) * T, (this.map.statue.y + 1) * T, sk).setOrigin(0.5, 1);
          if (!this.hasArt(skey) && si.height > 0) si.setScale((T * 2.2) / si.height);
          si.setDepth((this.map.statue.y + 1) * T);
          this.statueImg = si;
        }
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
        if (!self.lampShown(l)) return;   // v4.2 第六座燈座：結局前不顯示
        var lit = !!st.lamps[l.subject];
        var dawn = self.dawnLampArt(l);
        var img = dawn ? self.add.image(l.x * T + T / 2, l.y * T + T, J.Assets.texKey(lit ? 'lamp_dawn_on' : 'lamp_dawn_off')).setOrigin(0.5, 1).setScale(S, S * 1.6).setDepth((l.y + 1) * T)
          : self.add.image(l.x * T + T / 2, l.y * T + T, self.tex, self.frameOf(lit ? 'lamp_on' : 'lamp_off')).setOrigin(0.5, 1).setScale(S, S * 1.6).setDepth((l.y + 1) * T);
        self.lamps.push({ data: l, img: img, dawn: dawn });
      });
      this.buildEndingExtras();   // v4.2 大結局：海風公園來歡迎的鎮民（只在過場出現、不說話）
      this.buildMapProps();   // v4.1 中橫：小車與雪鏈圖案告示牌
      this.buildSouth();   // v3.0 南部：友善動物、碼頭的船
    }

    /** v4.1 中橫小物：只畫既有 props，碰撞完全沿用來源地圖格子。 */
    buildMapProps() {
      var self = this;
      this.mapProps = [];
      (this.map.props || []).forEach(function (p) {
        if (p.id !== 'car_snow_chain' && p.id !== 'sign_snow_chain') return;
        if (!Array.isArray(p.cells) || !p.cells.length) return;
        var x = Math.min.apply(null, p.cells.map(function (c) { return c[0]; }));
        var y = Math.max.apply(null, p.cells.map(function (c) { return c[1]; }));
        var key = self.mapPropTexture(p.id);
        var img = self.add.image(x * T, (y + 1) * T, key).setOrigin(0, 1).setDepth((y + 1) * T);
        self.mapProps.push({ data: p, img: img });
      });
    }

    /** 小車兩格寬；牌面用輪胎＋交叉雪鏈，不寫品牌或文字。 */
    mapPropTexture(id) {
      var car = id === 'car_snow_chain';
      var key = 'ui:prop:' + id;
      if (this.textures.exists(key)) return key;
      var c = document.createElement('canvas'); c.width = car ? 64 : 32; c.height = 32;
      var x = c.getContext('2d');
      function tire(cx, cy, r) {
        x.fillStyle = '#26313b';
        x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.fill();
        x.strokeStyle = '#dce5eb'; x.lineWidth = 1.5;
        // 兩條斜鏈交叉覆在胎面，與普通輪胎區別。
        x.beginPath(); x.moveTo(cx - r * 0.7, cy - r * 0.7); x.lineTo(cx + r * 0.7, cy + r * 0.7);
        x.moveTo(cx + r * 0.7, cy - r * 0.7); x.lineTo(cx - r * 0.7, cy + r * 0.7); x.stroke();
      }
      if (car) {
        // 無品牌的淺色小車：車頂、前後車窗、車身與兩個裝雪鏈的輪胎。
        x.fillStyle = '#27404c'; x.fillRect(4, 13, 56, 14);
        x.fillStyle = '#e8eceb'; x.fillRect(5, 14, 54, 11); x.fillRect(17, 4, 28, 14);
        x.fillStyle = '#93c6d8'; x.fillRect(20, 7, 10, 9); x.fillRect(33, 7, 9, 9);
        x.fillStyle = '#fff4bf'; x.fillRect(54, 16, 5, 4);
        x.fillStyle = '#c35245'; x.fillRect(5, 16, 3, 4);
        x.fillStyle = '#6d8490'; x.fillRect(31, 7, 2, 16);
        tire(15, 25, 6); tire(49, 25, 6);
      } else {
        x.fillStyle = '#695744'; x.fillRect(14, 22, 4, 10);
        x.fillStyle = '#294951'; x.fillRect(2, 1, 28, 25);
        x.fillStyle = '#f2d77e'; x.fillRect(4, 3, 24, 21);
        tire(16, 13, 8);
      }
      this.textures.addCanvas(key, c);
      return key;
    }

    /**
     * v3.0（70 號 3.5、第七節）友善動物（maps.js friendly：黑面琵鷺、綠蠵龜；不能互動，周圍 keepaway 格內擋路）、
     * 碼頭的船（boat_dock.ship_area：背景留空、程式畫一艘白色客船；點船或在上船格按 A＝搭船，G.boardBoat）
     */
    buildSouth() {
      var self = this;
      this.friendlies = (this.map.friendly || []).map(function (f) {
        var tk = J.Assets.texKey(f.sprite), frame = self.textures.exists(tk) && self.textures.get(tk).has(1) ? 1 : undefined;
        var img = self.add.image(f.x * T + T / 2, (f.y + 1) * T, tk, frame).setOrigin(0.5, 1).setDepth((f.y + 1) * T);
        if (f.show && J.KeepAway && !J.KeepAway.shown(f, G().state)) img.setVisible(false);   // v4.2（K10）
        // v4.2.2（老闆 2026-11-13）友善動物都不會走。單張圖的（帝雉、黑熊，美術分類都是有腳的）改成腳底固定的呼吸（updateSpriteFx）；
        // 有走路圖的（黑面琵鷺、綠蠵龜：sprites.js type walk）依指示「有走路圖的不動」，原本的上下漂浮補間照舊
        var walk = frame === 1 && self.textures.get(tk).has(11), bp = J.SpriteAnim.npcPeriod(f.x, f.y);
        if (walk) self.tweens.add({ targets: img, y: img.y - 2, duration: 900 + (f.x * 53) % 500, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
        return { data: f, img: img, walk: walk, sy0: img.scaleY, bp: bp, bph: J.SpriteAnim.npcPhase(f.x, f.y, bp) };
      });
      this.boat = null;
      var bd = this.map.boat_dock;
      if (bd && Array.isArray(bd.ship_area)) {
        // v4.2.2（老闆 2026-11-14「搭船這個有點意義不明，這到底是啥?」）：以前是程式畫的白色圓角方塊＋三條黑窗，看不出是船。
        // 改成一艘俯視、船頭朝右的客船：美術圖 ferry_boat（sprites.js 有登記、載入成功）優先，沒有就用 boatTexture 程式畫的船。
        // 保持長寬比放進 ship_area（四周留 4 像素）；停船範圍是直的（M24 小琉球）就轉 90 度、船頭朝上。
        var a = bd.ship_area, key = this.hasArt('ferry_boat') ? J.Assets.texKey('ferry_boat') : this.boatTexture();
        var fit = J.Ferry && J.Ferry.boatFit ? J.Ferry.boatFit(a, T, this.textures.get(key).getSourceImage().width, this.textures.get(key).getSourceImage().height) : { x: (a[0] + a[2] / 2) * T, y: (a[1] + a[3] / 2) * T, scale: 1, angle: 0 };
        var img = this.add.image(fit.x, fit.y, key).setOrigin(0.5, 0.5).setScale(fit.scale).setAngle(fit.angle).setDepth((a[1] + a[3]) * T);
        this.boat = { data: bd, img: img, art: key !== 'ui:ferry_boat' };
        G().boatShown = { map: this.mapId, art: this.boat.art, fit: fit };   // 測試用
      }
    }

    /**
     * v4.2.2 碼頭的船（沒有美術圖時）：256×96、透明底、俯視、船頭朝右的白色小客船——尖船頭、藍色船邊線、船艙一排窗、紅色煙囪、救生圈。
     * 和美術圖規格同尺寸（C:\tmp\v422_coord\ferry_asset_need.md），換成美術圖時縮放算法不用改。
     */
    boatTexture() {
      var key = 'ui:ferry_boat';
      if (this.textures.exists(key)) return key;
      var c = document.createElement('canvas'); c.width = 256; c.height = 96;
      var x = c.getContext('2d');
      function hull(inset) {
        x.beginPath();
        x.moveTo(14 + inset, 12 + inset);
        x.lineTo(182, 12 + inset);
        x.quadraticCurveTo(228 - inset, 18 + inset, 250 - inset * 1.6, 48);
        x.quadraticCurveTo(228 - inset, 78 - inset, 182, 84 - inset);
        x.lineTo(14 + inset, 84 - inset);
        x.quadraticCurveTo(4 + inset, 84 - inset, 4 + inset, 72 - inset);
        x.lineTo(4 + inset, 24 + inset);
        x.quadraticCurveTo(4 + inset, 12 + inset, 14 + inset, 12 + inset);
        x.closePath();
      }
      hull(0); x.fillStyle = '#24324a'; x.fill();             // 深色外框
      hull(3); x.fillStyle = '#2f6fb0'; x.fill();             // 藍色船邊線
      hull(7); x.fillStyle = '#f4f1e8'; x.fill();             // 白色甲板
      x.fillStyle = '#c94a3d'; x.fillRect(200, 44, 30, 8);    // 船頭紅色記號（看得出船頭朝哪）
      x.fillStyle = '#24324a'; x.fillRect(52, 24, 112, 48);   // 船艙外框
      x.fillStyle = '#dfe7ef'; x.fillRect(55, 27, 106, 42);   // 船艙屋頂
      x.fillStyle = '#9fb8d0'; x.fillRect(55, 45, 106, 6);    // 屋脊
      x.fillStyle = '#24324a';
      for (var i = 0; i < 6; i++) { x.fillRect(60 + i * 17, 20, 10, 6); x.fillRect(60 + i * 17, 70, 10, 6); }   // 兩側一排窗
      x.fillStyle = '#24324a'; x.beginPath(); x.arc(132, 48, 11, 0, Math.PI * 2); x.fill();   // 煙囪
      x.fillStyle = '#c94a3d'; x.beginPath(); x.arc(132, 48, 8, 0, Math.PI * 2); x.fill();
      x.fillStyle = '#2a1e22'; x.beginPath(); x.arc(132, 48, 4, 0, Math.PI * 2); x.fill();
      [[30, 28], [30, 68]].forEach(function (p) {   // 船尾兩個救生圈
        x.fillStyle = '#f08a2c'; x.beginPath(); x.arc(p[0], p[1], 8, 0, Math.PI * 2); x.fill();
        x.fillStyle = '#ffffff'; x.fillRect(p[0] - 8, p[1] - 2, 16, 4); x.fillRect(p[0] - 2, p[1] - 8, 4, 16);
        x.fillStyle = '#f4f1e8'; x.beginPath(); x.arc(p[0], p[1], 3.5, 0, Math.PI * 2); x.fill();
      });
      this.textures.addCanvas(key, c);
      return key;
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

    /** v4.2 第六座燈座（subject「曙光」）：flags.ending_done 之後、或大結局走進海風公園時才顯示（EndingRules.dawnLampShown）；五盞知識燈一直顯示 */
    lampShown(l) {
      if (!l || l.subject !== '曙光') return true;
      var g = G();
      return J.EndingRules ? J.EndingRules.dawnLampShown(g.state, !!g.endingDawnLamp) : !!(g.state && g.state.flags && g.state.flags.ending_done);
    }
    /** 第六座燈座用金色的 lamp_dawn_on／off（美術 R5：程式調色）；圖沒讀到就照五盞燈的圖塊畫 */
    dawnLampArt(l) { return !!l && l.subject === '曙光' && this.hasArt('lamp_dawn_on') && this.hasArt('lamp_dawn_off'); }
    /** v4.2 大結局 F6–F10：G.endingExtras＝[{ sprite, x, y, mood }]（鎮民、里長伯；不擋路、不能說話，頭上冒「！」或「♪」） */
    buildEndingExtras() {
      var self = this, list = G().endingExtras;
      this.endingExtras = [];
      if (!Array.isArray(list) || G().endingExtrasMap !== this.mapId) return;
      list.forEach(function (e) { if (!e.later) self.addEndingExtra(e); });
    }
    addEndingExtra(e) {
      var tk = J.Assets.texKey(e.sprite);
      if (!this.textures.exists(tk)) return null;
      var img = this.add.image(e.x * T + T / 2, e.y * T + T, tk).setOrigin(0.5, 1).setDepth((e.y + 1) * T);
      var inf = J.Assets.info(e.sprite) || {};
      img.setScale((inf.mapH || T * 1.5) / Math.max(1, img.height));
      var mark = e.mood ? this.add.text(img.x, img.y - img.displayHeight - 2, e.mood, { fontFamily: 'sans-serif', fontSize: '18px', fontStyle: 'bold', color: '#ffd34d', stroke: '#2a1e22', strokeThickness: 3 }).setOrigin(0.5, 1).setDepth(9999) : null;
      var x = { spec: e, img: img, mark: mark };
      this.endingExtras.push(x);
      return x;
    }
    /** 勇者特別版 H1：一路上的朋友這時才淡入（大結局版主角走路會經過他們的位置，先出現會擋路） */
    showLaterExtras() {
      var self = this, list = G().endingExtras;
      if (!Array.isArray(list)) return 0;
      var n = 0;
      list.forEach(function (e) {
        if (!e.later || self.endingExtras.some(function (x) { return x.spec === e; })) return;
        var x = self.addEndingExtra(e);
        if (x) { n++; x.img.setAlpha(0); self.tweens.add({ targets: [x.img].concat(x.mark ? [x.mark] : []), alpha: 1, duration: self.reduceMotionNow() ? 1 : 600 }); }
      });
      return n;
    }

    updateLamps() {
      var self = this, st = G().state;
      this.lamps.forEach(function (l) {
        var lit = !!st.lamps[l.data.subject];
        if (l.dawn) {   // v4.2 第六座燈座（金色）
          var wasD = l.img.texture.key === J.Assets.texKey('lamp_dawn_on');
          l.img.setTexture(J.Assets.texKey(lit ? 'lamp_dawn_on' : 'lamp_dawn_off'));
          if (lit && !wasD) self.sparkle(l.img.x, l.img.y - T * 1.3, 0xffd36a);
          if (lit && !l.glow) l.glow = self.addGlow(l.img.x, l.img.y - T * 1.45, 1.2);
          if (!lit && l.glow) { self.removeGlow(l.glow); l.glow = null; }
          return;
        }
        var was = l.img.frame.name === self.frameOf('lamp_on');
        l.img.setFrame(self.frameOf(lit ? 'lamp_on' : 'lamp_off'));
        if (lit && !was) self.sparkle(l.img.x, l.img.y - T * 1.3, 0xfff3a0);
        // 點亮的知識燈：柔和的圓形暖光
        if (lit && !l.glow) l.glow = self.addGlow(l.img.x, l.img.y - T * 1.45, 1.1);
        if (!lit && l.glow) { self.removeGlow(l.glow); l.glow = null; }
      });
    }

    /** sprites.js 有這張圖、而且真的載入成功（不是佔位圖） */
    hasArt(key) { return J.Assets.has(key) && this.textures.exists(J.Assets.texKey(key)) && !J.Assets.isPlaceholder(this, key); }

    /** v1.1 眺望點的小望遠鏡（程式畫，24×30，底部置中）：三腳架＋鏡筒 */
    viewpointTexture() {
      var key = 'ui:viewpoint';
      if (this.textures.exists(key)) return key;
      var c = document.createElement('canvas'); c.width = 24; c.height = 30;
      var x = c.getContext('2d');
      x.strokeStyle = '#4a2e14'; x.lineWidth = 2;
      x.beginPath(); x.moveTo(12, 14); x.lineTo(5, 29); x.moveTo(12, 14); x.lineTo(19, 29); x.moveTo(12, 14); x.lineTo(12, 29); x.stroke();
      x.save(); x.translate(12, 11); x.rotate(-0.35);
      x.fillStyle = '#c9a227'; x.fillRect(-10, -3, 18, 6); x.fillStyle = '#7a5a10'; x.fillRect(6, -4, 4, 8); x.fillStyle = '#e8d27a'; x.fillRect(-10, -3, 3, 6);
      x.restore();
      this.textures.addCanvas(key, c);
      return key;
    }

    /** v1.1 路牌的備援圖（美術 obj_road_sign 沒載入時）：32×48 木樁＋橫木牌，底部置中 */
    roadSignTexture() {
      var key = 'ui:roadsign';
      if (this.textures.exists(key)) return key;
      var c = document.createElement('canvas'); c.width = 32; c.height = 48;
      var x = c.getContext('2d');
      x.fillStyle = '#6b4423'; x.fillRect(14, 18, 4, 30);
      x.fillStyle = '#a0703c'; x.fillRect(3, 6, 26, 15);
      x.strokeStyle = '#4a2e14'; x.lineWidth = 2; x.strokeRect(4, 7, 24, 13);
      x.fillStyle = '#4a2e14'; x.fillRect(8, 11, 16, 2); x.fillRect(8, 15, 12, 2);
      this.textures.addCanvas(key, c);
      return key;
    }

    // ---------------------------------------------------------------- 招牌（商店、旅店門口上方）
    buildSigns() {
      var self = this;
      this.signs = [];
      // v4.2.2：位置照 MapInfo.SIGN_PLAQUES（每家店掛在自己那棟房子上）；hidden＝背景已畫好這家店的招牌，不再畫一塊（小地圖的店家標記照留，img 為 null）
      J.MapInfo.signSpots(this.map, this.mapId).forEach(function (sg) {
        if (sg.hidden) { self.signs.push({ spot: sg, img: null }); return; }
        var key = 'sign_' + sg.kind, img;
        if (self.hasArt(key) && !sg.custom) img = self.add.image(sg.x * T + T / 2, (sg.y + 1) * T, J.Assets.texKey(key)).setOrigin(0.5, 1).setScale(1.15);
        else img = self.add.image(sg.x * T + T / 2, (sg.y + 1) * T, self.textSign(sg.kind, sg.text)).setOrigin(0.5, 1);
        img.setDepth((sg.y + 1) * T + 2);
        self.signs.push({ spot: sg, img: img });
      });
    }

    /**
     * v0.9.6（47 號 B05）慈護宮正殿：站到供桌、拜墊附近時，鏡頭往上移，讓神像露在 HUD 下面（神像在地圖最上方，鏡頭跟著主角時看不到）。
     * 鏡頭上緣對準神像上方一點（不超出地圖），主角仍在畫面裡；離開供桌一帶慢慢回到正常跟隨。
     */
    shrineCamera() {
      var st = this.map.statue, cam = this.cameras.main;
      if (!st || !this.player || !cam) return;
      var want = 0;
      if (this.p && this.p.ty <= st.y + 7) {
        var viewH = cam.worldView.height || (cam.height / (cam.zoom || 1));
        var top = Math.max(0, (st.y - 4.5) * T);   // 神像腳底在 (st.y+1)*T、約 3 格高；上緣再多留一點給 HUD
        // 鏡頭上緣＝top，但主角的腳要留在畫面裡（離下緣至少 1.2 格）
        want = Math.max(0, Math.min(this.player.y - (top + viewH / 2), viewH / 2 - T * 1.2));
      }
      var cur = cam.followOffset.y;
      if (Math.abs(cur - want) > 0.5) cam.setFollowOffset(0, cur + (want - cur) * 0.15);
      else if (cur !== want) cam.setFollowOffset(0, want);
      this.shrineCamOffset = cam.followOffset.y;   // 測試用
    }

    /**
     * v0.9.6 站名小牌：白底藍字。用同一個畫布量字寬再畫，框寬＝字寬＋左右各 5px（不會切字）。
     * 畫布用 2 倍解析度畫（res），顯示時縮回 1 倍，字比較清楚。回傳 { key, textW, boxW, res }（textW、boxW 是 1 倍的像素）
     */
    stationLabelTexture(name) {
      var res = 2, padX = 5, h = 19;
      var font = 'bold 13px "Microsoft JhengHei","PingFang TC","Noto Sans TC",sans-serif';
      var key = 'ui:stationlabel:' + name;
      var m = document.createElement('canvas').getContext('2d'); m.font = font;
      var textW = Math.ceil(m.measureText(name).width), boxW = textW + padX * 2;
      if (!this.textures.exists(key)) {
        var c = document.createElement('canvas'); c.width = boxW * res; c.height = h * res;
        var g = c.getContext('2d'); g.scale(res, res);
        g.fillStyle = '#f4f4f0'; g.fillRect(0, 0, boxW, h);
        g.font = font; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillStyle = '#1e4a8a';
        g.fillText(name, padX, h / 2 + 1);   // 從左邊 padX 開始畫，整行都在框裡
        this.textures.addCanvas(key, c);
      }
      return { key: key, textW: textW, boxW: boxW, res: res };
    }

    /** v0.9.5 地標匾額：紅底金字、金色外框（比照店家招牌的大小，字橫寫；不畫神像、不畫香火） */
    plaqueTexture(text, boxW, boxH) {
      // boxW、boxH（像素）＝背景上空白匾額的大小：照這個大小畫（字的大小跟著高度）；沒給時依字數自動決定
      var bw = Math.round(boxW || 0), bh = Math.round(boxH || 0);
      var key = 'ui:plaque:' + text + ':' + bw + 'x' + bh;
      if (this.textures.exists(key)) return key;
      var fs = bh ? Math.max(12, Math.min(26, Math.round(bh * 0.66))) : 15;
      var font = 'bold ' + fs + 'px "Microsoft JhengHei","PingFang TC","Noto Sans TC",sans-serif';
      var m = document.createElement('canvas').getContext('2d'); m.font = font;
      var w = Math.max(bw, Math.ceil(m.measureText(text).width) + 22), h = Math.max(bh, fs + 11);
      var c = document.createElement('canvas'); c.width = w; c.height = h;
      var g = c.getContext('2d');
      g.fillStyle = '#3a1208'; g.fillRect(0, 0, w, h);                 // 深色外緣
      g.fillStyle = '#e0b040'; g.fillRect(1, 1, w - 2, h - 2);         // 金框
      g.fillStyle = '#9e1a14'; g.fillRect(4, 4, w - 8, h - 8);         // 紅底
      g.fillStyle = '#b82a20'; g.fillRect(4, 4, w - 8, 3);             // 上緣亮一點
      g.fillStyle = '#f4d27a'; g.fillRect(2, 2, 2, 2); g.fillRect(w - 4, 2, 2, 2); g.fillRect(2, h - 4, 2, 2); g.fillRect(w - 4, h - 4, 2, 2);
      g.font = font; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round';
      // 匾額寬、字少（「慈護宮」）時一個字一個字平均排開，像真的橫匾；不然整行置中
      var chars = text.split(''), spread = bw && chars.length <= 4 && fs * chars.length * 1.5 < w;
      var gap = spread ? Math.min(fs * 1.9, (w - 16) / chars.length) : 0;
      chars.forEach(function (ch, i) {
        var cx = spread ? w / 2 + (i - (chars.length - 1) / 2) * gap : null;
        if (!spread && i > 0) return;
        var t = spread ? ch : text, x = spread ? cx : w / 2;
        g.lineWidth = 3; g.strokeStyle = '#4a0c06'; g.strokeText(t, x, h / 2 + 1);
        g.fillStyle = '#ffd95a'; g.fillText(t, x, h / 2 + 1);
      });
      this.textures.addCanvas(key, c);
      return key;
    }

    /** v0.9.5 走進地標範圍（例如金包里慈護宮廟前）：跳出地名提示；同一個地標要走出去再進來才會再跳 */
    checkLandmark() {
      var lm = J.MapInfo.landmarkAt(this.map, this.p.tx, this.p.ty);
      if (lm === this.landmarkNow) return;
      this.landmarkNow = lm;
      if (!lm) return;
      J.HUD.mapBanner(lm.name, 'place-banner');
      var g = G(); g.landmarkLog = (g.landmarkLog || []).concat([lm.name]).slice(-20);   // 測試用
    }

    /** 沒有招牌圖時：木頭招牌＋文字 */
    textSign(kind, text) {
      var key = 'ui:signtext:' + kind + ':' + text;   // v0.9.3 各地旅店的招牌字不一樣，貼圖要分開
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
    /** 光暈貼圖。color：'#rrggbb'（v0.9.3 藍水晶、紫水晶、祭壇）；沒有給＝原本的暖色 */
    glowTexture(color) {
      var rgb = J.MapInfo.glowRgb(color);
      var key = rgb ? 'ui:glow:' + rgb.join(',') : 'ui:glow';
      if (this.textures.exists(key)) return key;
      var c = document.createElement('canvas'); c.width = c.height = 128;
      var g = c.getContext('2d');
      var gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
      if (rgb) {
        var mix = function (a, k) { return Math.round(a + (255 - a) * k); };   // 中心偏白、外圈是指定的顏色
        gr.addColorStop(0, 'rgba(' + mix(rgb[0], 0.5) + ',' + mix(rgb[1], 0.5) + ',' + mix(rgb[2], 0.5) + ',0.9)');
        gr.addColorStop(0.35, 'rgba(' + rgb.join(',') + ',0.45)');
        gr.addColorStop(0.7, 'rgba(' + rgb.join(',') + ',0.12)');
        gr.addColorStop(1, 'rgba(' + rgb.join(',') + ',0)');
      } else {
        gr.addColorStop(0, 'rgba(255,228,150,0.9)');
        gr.addColorStop(0.35, 'rgba(255,190,90,0.45)');
        gr.addColorStop(0.7, 'rgba(255,150,60,0.12)');
        gr.addColorStop(1, 'rgba(255,140,50,0)');
      }
      g.fillStyle = gr; g.beginPath(); g.arc(64, 64, 64, 0, Math.PI * 2); g.fill();
      this.textures.addCanvas(key, c);
      return key;
    }

    addGlow(x, y, r, color) {
      // v0.7：光暈畫在角色「下面」（地面上的一圈光）。以前畫在最上層（加法混合），洞窟裡暗色的蝙蝠走進光裡會被洗白、看起來像半透明
      var img = this.add.image(x, y, this.glowTexture(color)).setBlendMode(Phaser.BlendModes.ADD).setDepth(GLOW_DEPTH);
      img.__color = color || null;   // 測試用
      var sc = (T * 3 * (r || 1)) / 128;
      img.setScale(sc).setAlpha(0.7);
      // v0.9.6（46 號地圖稽核：M01 #4、#11，M04 #9–#15 的光暈被上層格切成方塊）：
      // 上層格（'U'）是從背景切出來、蓋在角色上面的那一格，地面的光暈（深度 1）被它蓋住就缺一塊。
      // 光暈碰到的每一格上層格，另外在上層格之上（FG_CELL_DEPTH＋1）畫一塊「只裁出那一格」的同一張光暈補回去；
      // 其他地方仍然是地面光暈（角色不會被洗白）。剪影（60000）在補片之上，剪影的判斷只看格子（fgSet），不受光暈影響。
      // 有補片的光暈只做明暗呼吸、不縮放（縮放會讓補片和格子對不齊）。
      var copies = this.glowFgPatches(img, sc);
      img.__fgCopies = copies;
      var targets = [img].concat(copies);
      img.__tw = this.tweens.add(copies.length ? { targets: targets, alpha: 0.5, duration: 1100 + Math.random() * 500, yoyo: true, repeat: -1, ease: 'Sine.inOut' }
        : { targets: img, alpha: 0.5, scale: sc * 0.93, duration: 1100 + Math.random() * 500, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      (this.glows || (this.glows = [])).push(img);
      return img;
    }

    /** 光暈和上層格重疊的地方：每一格做一塊裁好的補片（同一張光暈貼圖、同位置、同大小），畫在上層格之上。回傳補片陣列 */
    glowFgPatches(img, sc) {
      var self = this, up = this.upperSet || (this.upperSet = J.MapInfo.upperCells(this.map, G().data.tilesets).set);
      var half = 64 * sc, left = img.x - half, top = img.y - half, out = [];
      var x0 = Math.floor(left / T), x1 = Math.floor((img.x + half - 0.001) / T), y0 = Math.floor(top / T), y1 = Math.floor((img.y + half - 0.001) / T);
      for (var cy = y0; cy <= y1; cy++) for (var cx = x0; cx <= x1; cx++) {
        if (!up[cx + ',' + cy]) continue;
        // 這一格在光暈貼圖（128×128）裡的範圍
        var tx = Math.max(0, (cx * T - left) / sc), ty = Math.max(0, (cy * T - top) / sc);
        var tw = Math.min(128, ((cx + 1) * T - left) / sc) - tx, th = Math.min(128, ((cy + 1) * T - top) / sc) - ty;
        if (tw <= 0 || th <= 0) continue;
        var p = self.add.image(img.x, img.y, img.texture.key).setBlendMode(Phaser.BlendModes.ADD).setDepth(FG_CELL_DEPTH + 1)
          .setScale(sc).setAlpha(img.alpha).setCrop(tx, ty, tw, th);
        p.__cell = cx + ',' + cy;   // 測試用
        out.push(p);
      }
      return out;
    }

    /** 拿掉一個光暈（連同上層格上的補片） */
    removeGlow(g) {
      if (!g) return;
      (g.__fgCopies || []).forEach(function (p) { p.destroy(); });
      if (g.__tw) g.__tw.remove();
      this.glows = (this.glows || []).filter(function (x) { return x !== g; });
      g.destroy();
    }

    buildLights() {
      var self = this;
      this.lights_ = J.MapInfo.lightSpots(this.map).map(function (l) { return self.addGlow(l.x * T + T / 2, l.y * T + T / 2, l.r, l.color); });
      this.updateLamps();
    }

    // ---------------------------------------------------------------- 前景（上層格 'U'、maps.js 的 fg 圖）與 DQ6 式剪影
    buildForeground() {
      var self = this, W = this.size.w * T, H = this.size.h * T;
      var up = J.MapInfo.upperCells(this.map, G().data.tilesets);
      this.fgSet = {};
      Object.keys(up.set).forEach(function (k) { self.fgSet[k] = true; });
      var chunks = this.hasBg ? this.bgChunks : null;
      // v0.8：前景格依 BUCKET×BUCKET 分區，鏡頭外的分區隱藏（大地圖的上層格有好幾百格）
      this.fgBuckets = {};
      this.fgBucketKey = null;
      up.cells.forEach(function (c) {
        var img;
        if (chunks) {
          // 從背景圖（或它的分塊）切出這一格，畫在角色上方
          var k0 = chunks[0], cx = c.x * T / k0.kx, cy = c.y * T / k0.ky, cw = T / k0.kx, chh = T / k0.ky;
          var ck = chunks.filter(function (k) { return cx >= k.sx - 0.5 && cx < k.sx + k.sw - 0.5 && cy >= k.sy - 0.5 && cy < k.sy + k.sh - 0.5; })[0] || k0;
          img = self.add.image(ck.sx * ck.kx, ck.sy * ck.ky, ck.key).setOrigin(0, 0).setScale(ck.kx, ck.ky)
            .setCrop(Math.max(0, cx - ck.sx), Math.max(0, cy - ck.sy), Math.min(cw, ck.sx + ck.sw - cx), Math.min(chh, ck.sy + ck.sh - cy)).setDepth(FG_CELL_DEPTH);
        } else {
          var d = self.defAt(c.x, c.y);
          img = self.add.image(c.x * T, c.y * T, self.tex, self.frameOf(d.tile)).setOrigin(0, 0).setScale(S).setDepth(FG_CELL_DEPTH);
        }
        img.fgX = c.x; img.fgY = c.y;   // v3.0.1（86 號 #5）樹冠局部透明要知道這一塊是哪一格
        var bk = Math.floor(c.x / BUCKET) + ',' + Math.floor(c.y / BUCKET);
        (self.fgBuckets[bk] || (self.fgBuckets[bk] = [])).push(img);
      });
      if (this.fgFile && this.textures.exists('map:' + this.fgFile)) {
        this.addBigImage('map:' + this.fgFile, 50000, W, H);
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

    /** 番薯仔跟隨。邏輯在 JQ.PetFollow（可單元測試），這裡只負責套到精靈上。 */
    updatePet(delta) {
      if (J.Followers && J.Followers.update(this, delta)) return;   // v3.0 跟班掛鉤（codex5）：兩隻共用腳印；單隻沿用下面的流程
      var pet = this.pet;
      if (!this.petState) this.petState = J.PetFollow.create('down');
      var r = J.PetFollow.step(this.petState, {
        x: pet.x, y: pet.y, tx: this.petTarget.x, ty: this.petTarget.y,
        delta: delta, speed: J.PetFollow.speedFor(0.085 * S * G().moveSpeed(), this.petDist || 0, T)
      });
      pet.x = r.x; pet.y = r.y;
      if (r.moving) {
        var pk = pet.texture.key + '-' + r.dir;
        if (!pet.anims.isPlaying || pet.anims.currentAnim.key !== pk) pet.anims.play(pk);
      } else if (pet.anims.isPlaying) {
        pet.anims.stop();
        pet.setFrame(this.idleFrame('pet_imo', r.dir));
      }
      // 走到障礙或 NPC 上面（例如轉角時）才慢慢變半透明，離開後慢慢恢復，不會忽明忽暗
      var ptx = Math.floor(pet.x / T), pty = Math.floor((pet.y - 1) / T);
      pet.setAlpha(J.PetFollow.fadeAlpha(this.petState, this.walkable(ptx, pty), delta));
    }

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
      this.petState = null;   // 換地圖時重設跟隨狀態（場景物件會沿用），從朝下站姿重新開始
      this.petDist = 0;
      this.petFx = {};   // v4.2.2 番薯仔腳下影子（updateSpriteFx；每張地圖重建）
      if (J.Followers) J.Followers.build(this);   // v3.0 跟班掛鉤（codex5）：每次進場重建隊伍

      this.npcList().forEach(function (n) {
        var tk = J.Assets.texKey(n.sprite || 'npc_unknown');
        var img = self.add.image(n.x * T + T / 2, n.y * T + T, tk, self.textures.get(tk).has(1) ? 1 : undefined).setOrigin(0.5, 1).setDepth((n.y + 1) * T);
        // v4.2.2 整張上下浮動改成腳底固定的呼吸（updateSpriteFx）；頭上記號的跳動照舊
        var mark = self.add.image(img.x, img.y - img.displayHeight - 4, 'ui:bang').setOrigin(0.5, 1).setScale(2).setDepth(9000).setVisible(false);
        var t2 = self.tweens.add({ targets: mark, y: mark.y - 4, duration: 500, yoyo: true, repeat: -1 });
        var bp = J.SpriteAnim.npcPeriod(n.x, n.y);
        self.npcs.push({ data: n, img: img, mark: mark, tw: [t2], sy0: img.scaleY, bp: bp, bph: J.SpriteAnim.npcPhase(n.x, n.y, bp) });
      });
      this.refreshMarkers();
      this.syncDepths();
    }

    /** v2.0（69 號 3.4）maps.js npcs[].show＝{ after, until }：after 完成以後、until 完成以前才出現（石虎寶寶）；沒出現時看不到、不擋路、不能說話、小地圖不畫 */
    updateNpcShow() {
      var g = G(), st = g.state, Q = (g.data && g.data.quests) || {}, self = this;
      (this.npcs || []).forEach(function (n) {
        var s = n.data.show;
        if (!s) return;
        var on = (!s.after || J.QuestLog.status(st, Q, s.after) === 'done') && !(s.until && J.QuestLog.status(st, Q, s.until) === 'done');
        n.hidden = !on;
        n.img.setVisible(on && n.inView !== false);
        (n.tw || []).forEach(function (t) { if (on && n.inView !== false) t.resume(); else t.pause(); });
        if (self.blocked) { if (on) self.blocked[n.data.x + ',' + n.data.y] = true; else delete self.blocked[n.data.x + ',' + n.data.y]; }
      });
      // v4.2（K10）友善動物也可以寫 show（黑熊只在 Q_YS_1 完成～Q_YS_2 未完成出現）；保護區由 KeepAway 照同一個條件判斷
      (this.friendlies || []).forEach(function (f) { if (f.data.show && J.KeepAway) f.img.setVisible(J.KeepAway.shown(f.data, st)); });
    }

    refreshMarkers() {
      var g = G();
      this.updateNpcShow();   // v2.0 石虎寶寶
      this.npcs.forEach(function (n) {
        var m = g.npcMarker(n.data);
        n.markOn = !!m;
        n.mark.setVisible(!!m && n.inView !== false);
        if (m) n.mark.setTexture(m === 'ready' ? 'ui:ready' : m === 'proverb' ? 'ui:proverb' : 'ui:bang');
      });
    }

    walkable(x, y) {
      if (J.KeepAway && J.KeepAway.blocked(this.map, x, y)) return false;   // v3.0 保持距離掛鉤（codex5）：友善動物附近不能走
      if (this.blocked && this.blocked[x + ',' + y]) return false;
      return J.World.isWalkable(G().data.tilesets, this.map, x, y, null);
    }

    // ---------------------------------------------------------------- 怪物
    buildMonsters() {
      var self = this, g = G(), st = g.state;
      this.spawnSpreadStats = { relaxed: 0, r2: 0, r4: 0 };   // 本次進圖的放寬次數（含之後重生），不寫存檔
      var pending = [];
      (this.map.spawns || []).forEach(function (s, si) {
        var m = g.data.monsters[s.monster];
        if (!m) return;
        if (s.boss || m.boss) {
          if (st.bosses[s.monster]) return;
          if (s.quest && J.QuestLog.status(st, g.data.quests, s.quest) !== 'active') return;
        }
        if (s.elite && s.quest && J.QuestLog.status(st, g.data.quests, s.quest) !== 'active') return;   // v3.0 精英：只在委託進行中出現
        for (var i = 0; i < (s.count || 1); i++) {
          var mob = { spawn: s, mon: m, id: s.monster, idx: si * 10 + i, active: false, sprite: null, tx: 0, ty: 0, moving: false, nextMove: 0, respawnAt: 0, boss: !!(s.boss || m.boss) };
          pending.push(mob);
        }
      });
      // 特殊怪沿用原站位與出現條件；先放好，讓一般野怪避開它們。
      [false, true].forEach(function (normal) {
        pending.forEach(function (mob) {
          if (J.SpawnSpread.ordinary(mob.spawn, mob.mon) !== normal) return;
          self.placeMonster(mob, true);
          self.monsters.push(mob);
        });
      });
    }

    /** v0.9 下車點（車站、搭車落點）周圍 5 格：一般怪物不會出現、也不會走進來 */
    safeAt(x, y) {
      if (!this.safePts) this.safePts = J.MapInfo.safePoints(this.map, this.mapId, (window.WORLD && window.WORLD.regions) || []);
      return J.MapInfo.inSafeZone(this.safePts, x, y);
    }

    areaTiles(s) {
      if (this.areaCache && this.areaCache.has(s)) return this.areaCache.get(s);
      var a = s.area || [0, 0, this.size.w, this.size.h], out = [];
      var boss = !!(s.boss || (G().data.monsters[s.monster] || {}).boss);
      for (var y = a[1]; y < a[1] + a[3]; y++) for (var x = a[0]; x < a[0] + a[2]; x++) if (this.walkable(x, y) && !J.World.exitAt(this.map, x, y) && (boss || !this.safeAt(x, y))) out.push({ x: x, y: y });
      if (this.areaCache) this.areaCache.set(s, out);
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
      if (J.SpawnSpread.ordinary(mob.spawn, mob.mon)) {
        var result = J.SpawnSpread.pick({ tiles: tiles,
          player: p ? { x: p.tx, y: p.ty } : null,
          occupied: this.monsters.filter(function (o) { return o !== mob && o.active; }).map(function (o) { return { x: o.tx, y: o.ty }; }),
          features: J.SpawnSpread.features(this.map), stats: this.spawnSpreadStats });
        // 分散測試逐群驗證：即使主角站最擠的位置、其他怪全塞進範圍，最低限制仍有空格。
        pick = result.tile;
      }
      mob.tx = pick.x; mob.ty = pick.y;
      var tk = J.Assets.texKey(mob.mon.sprite);
      if (!mob.sprite) {
        // v4.2.2 多幀圖（type strip、橫排 cols 格）載入了而且每一格都切好：用第 0 格建立，mobFx 換格；否則照舊用單張圖（頭目階段圖目前只在戰鬥用）
        var ak = mob.mon.sprite + '_anim', ainf = J.Assets.info(ak), atk = J.Assets.texKey(ak);
        mob.frames = ainf && ainf.type === 'strip' && this.textures.exists(atk) && this.textures.get(atk).has(ainf.cols - 1) ? ainf.cols : 0;
        mob.sprite = this.add.image(0, 0, mob.frames ? atk : tk, mob.frames ? 0 : undefined).setOrigin(0.5, 1);
        // 地圖上的怪物高度：sprites.js 的 mapH 優先，否則用 config.js 的預設
        var inf = J.Assets.info(mob.mon.sprite) || {};
        var target = inf.mapH || (mob.boss ? C.MAP_BOSS_H : C.MAP_MONSTER_H);
        mob.baseScale = target / Math.max(mob.sprite.height, 1);
        mob.sprite.setScale(mob.baseScale);
      }
      mob.sprite.setPosition(mob.tx * T + T / 2, mob.ty * T + T).setAlpha(first ? 1 : 0).setVisible(mob.inView !== false);
      if (!first) this.tweens.add({ targets: mob.sprite, alpha: 1, duration: 600 });
      // v4.2.2 站著的呼吸改在 updateSpriteFx（以前是這裡的 ×1.08 補間）
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
        var occ = {};
        self.monsters.forEach(function (o) { if (o !== mob && o.active) occ[o.tx + ',' + o.ty] = true; });
        var occupied = function (x, y) { return !!occ[x + ',' + y]; };
        var inArea = function (x, y) { return x >= a[0] && y >= a[1] && x < a[0] + a[2] && y < a[1] + a[3] && self.walkable(x, y) && !J.World.exitAt(self.map, x, y) && !self.safeAt(x, y); };
        if (!mob.path || !mob.path.length) {
          var goal = J.MapInfo.wanderTarget(self.areaTiles(mob.spawn), { x: mob.tx, y: mob.ty });
          mob.path = goal ? (J.Pathfind.findPath(function (x, y) { return inArea(x, y) && !occupied(x, y); }, self.size.w, self.size.h, { c: mob.tx, r: mob.ty }, { c: goal.x, r: goal.y }, 800) || []) : [];
          mob.goal = goal;
          if (!mob.path.length) { mob.nextMove = now + 700 + Math.random() * 900; return; }
        }
        var t = mob.path.shift();
        if (!inArea(t.c, t.r) || occupied(t.c, t.r)) { mob.path = []; mob.nextMove = now + 400; return; }
        mob.tx = t.c; mob.ty = t.r;
        mob.visited = (mob.visited || 0) + 1;
        if (mob.inView === false) {
          // 鏡頭外：不播補間動畫，直接移到下一格，而且走得比較慢（降頻），省下手機與平板的效能
          mob.sprite.setPosition(t.c * T + T / 2, t.r * T + T);
          mob.nextMove = now + (mob.path.length ? 900 : 2500 + Math.random() * 3000);
          return;
        }
        mob.moving = true; mob.stepAt = now;   // v4.2.2 踏步：這一格的左右兩步從現在開始
        if (t.c * T + T / 2 < mob.sprite.x) mob.sprite.setFlipX(false); else if (t.c * T + T / 2 > mob.sprite.x) mob.sprite.setFlipX(true);
        self.tweens.add({ targets: mob.sprite, x: t.c * T + T / 2, y: t.r * T + T, duration: MOB_STEP_MS, onComplete: function () {
          mob.moving = false;
          mob.nextMove = self.time.now + (mob.path.length ? 60 : 800 + Math.random() * 1400);   // 走到目標後停一下
        } });
      });
    }

    // ---------------------------------------------------------------- 會走動的動物（v0.9.3 B11 擎天崗的黃牛）
    /** 不能戰鬥；在範圍內的可走格慢慢隨機走動；碰到會「哞～」並走開，面對牠按 A 跳出一句話 */
    buildAnimals() {
      var self = this, g = G();
      this.animals = [];
      var taken = {};
      J.MapInfo.animalSpecs(this.map).forEach(function (spec) {
        var tiles = J.MapInfo.animalTiles(self.map, spec.area, function (x, y) { return self.walkable(x, y); });
        if (!tiles.length) { console.warn('[動物] ' + self.mapId + ' ' + spec.id + ' 的範圍裡沒有可以站的格子'); return; }
        var tk = J.Assets.texKey(spec.sprite);
        // 美術交四方向走路圖（sprites.js type: "walk"，3×4 格）後就有走路動畫；暫代圖只有一張，左右用翻轉
        var walk = self.textures.exists(tk) && self.textures.get(tk).has(11);
        if (walk) self.ensureWalkAnims(tk, spec.sprite);
        for (var i = 0; i < spec.count; i++) {
          var free = tiles.filter(function (t) { return !taken[t.x + ',' + t.y] && !(t.x === self.p.tx && t.y === self.p.ty); });
          var pick = (free.length ? free : tiles)[Math.floor(Math.random() * (free.length ? free.length : tiles.length))];
          taken[pick.x + ',' + pick.y] = true;
          var spr = self.add.sprite(pick.x * T + T / 2, pick.y * T + T, tk, walk ? self.idleFrame(spec.sprite, 'down') : undefined).setOrigin(0.5, 1);
          if (!walk) spr.setScale(C.MAP_MONSTER_H / Math.max(spr.height, 1));
          self.animals.push({ spec: spec, tiles: tiles, sprite: spr, walk: walk, tx: pick.x, ty: pick.y, facing: 'down', moving: false, path: [],
            nextMove: self.time.now + 1500 + Math.random() * 3000, idx: i });
        }
      });
      g.animalLog = this.animals.length;   // 測試用
    }

    animalAt(x, y) {
      for (var i = 0; i < (this.animals || []).length; i++) { var a = this.animals[i]; if (a.tx === x && a.ty === y) return a; }
      return null;
    }

    /** 主角碰到動物：頭上冒出「哞～」，動物馬上走開（不會擋住太久） */
    bumpAnimal(a) {
      var now = this.time.now;
      if (!a.lastBump || now - a.lastBump > 1200) {
        a.lastBump = now;
        var t = this.add.text(a.sprite.x, a.sprite.y - a.sprite.displayHeight - 4, a.spec.say, { fontFamily: 'sans-serif', fontSize: '16px', color: '#2a1e22', backgroundColor: '#fffbe8', padding: { x: 6, y: 2 } })
          .setOrigin(0.5, 1).setDepth(9000);
        this.tweens.add({ targets: t, y: t.y - 14, alpha: 0, delay: 700, duration: 600, onComplete: function () { t.destroy(); } });
        J.Audio.play('select');
        G().animalBumps = (G().animalBumps || 0) + 1;   // 測試用
      }
      a.flee = true;
      a.path = [];
      if (!a.moving) a.nextMove = Math.min(a.nextMove, now + 250);
    }

    wanderAnimals(now) {
      var self = this, p = this.p;
      (this.animals || []).forEach(function (a) {
        if (a.moving || now < a.nextMove) return;
        var occupied = function (x, y) {
          if (x === p.tx && y === p.ty) return true;
          if (p.moving && p.prev && x === p.prev.x && y === p.prev.y) return true;
          // v1.0.6 夜班審查：主角斜走途中，兩個角落格也算佔用（動物不能走進主角正在切過的角）
          if (p.moving && p.prev && p.prev.x !== p.tx && p.prev.y !== p.ty && ((x === p.tx && y === p.prev.y) || (x === p.prev.x && y === p.ty))) return true;
          return self.animals.some(function (o) { return o !== a && o.tx === x && o.ty === y; });
        };
        var ok = {};
        a.tiles.forEach(function (t) { ok[t.x + ',' + t.y] = true; });
        var can = function (x, y) { return !!ok[x + ',' + y] && !occupied(x, y); };
        if (!a.path.length) {
          var goal = a.flee ? J.MapInfo.awayTarget(a.tiles, { x: a.tx, y: a.ty }, { x: p.tx, y: p.ty }) : J.MapInfo.wanderTarget(a.tiles, { x: a.tx, y: a.ty });
          a.flee = false;
          a.path = goal ? (J.Pathfind.findPath(can, self.size.w, self.size.h, { c: a.tx, r: a.ty }, { c: goal.x, r: goal.y }, 600) || []) : [];
          if (!a.path.length) { a.nextMove = now + 1500 + Math.random() * 2000; return; }
        }
        var t = a.path.shift();
        if (!can(t.c, t.r)) { a.path = []; a.nextMove = now + 600; return; }
        var dir = t.c > a.tx ? 'right' : t.c < a.tx ? 'left' : t.r > a.ty ? 'down' : 'up';
        a.tx = t.c; a.ty = t.r; a.facing = dir;
        a.moving = true;
        var key = a.sprite.texture.key + '-' + dir;
        if (a.walk) { if (self.anims.exists(key) && (!a.sprite.anims.isPlaying || a.sprite.anims.currentAnim.key !== key)) a.sprite.anims.play(key); }
        else if (dir === 'left' || dir === 'right') a.sprite.setFlipX(dir === 'right');
        self.tweens.add({ targets: a.sprite, x: t.c * T + T / 2, y: t.r * T + T, duration: 650, onComplete: function () {
          a.moving = false;
          // 走路途中被主角碰到（flee）：這一格走完就馬上走開，不要先停下來吃草
          if (a.path.length || a.flee) { a.nextMove = self.time.now; return; }
          if (a.walk) { a.sprite.anims.stop(); a.sprite.setFrame(self.idleFrame(a.spec.sprite, a.facing)); }
          a.nextMove = self.time.now + 2000 + Math.random() * 3500;   // 走到了就停下來吃草一下
        } });
      });
    }

    /**
     * v4.2.2（老闆 2026-11-14「M33帝雉記得分散跑」）：maps.js friendly 寫 wander: true、而且有走路圖（sprites.js type walk）的友善動物
     * （目前只有 M33 兩隻帝雉）在自己的保護區裡各自慢慢走動（KeepAway.wanderTiles：離中心 radius−2 格以內）。
     * 兩隻的保護區不重疊、主角被保護區擋在外面，所以不會擠在一起、碰不到主角、不擋路；不能互動。沒寫 wander 的照舊（站著／原本的漂浮）。
     * buildSouth 建的是 image（不能播動畫），這裡換成 sprite（同位置、同深度、同顯示狀態）。
     */
    buildFriendlyWander() {
      var self = this, Wd = J.World;
      (this.friendlies || []).forEach(function (f) {
        if (!f.walk || !f.data || f.data.wander !== true || !J.KeepAway || !J.KeepAway.wanderTiles) return;
        var tiles = J.KeepAway.wanderTiles(self.map, f.data, function (x, y) {
          return !(self.blocked && self.blocked[x + ',' + y]) && Wd.isWalkable(G().data.tilesets, self.map, x, y, null) && !Wd.exitAt(self.map, x, y) && Wd.charAt(self.map, x, y) !== 'U';
        });
        if (tiles.length < 2) return;
        var tk = f.img.texture.key, old = f.img;
        self.tweens.killTweensOf(old);   // 有走路圖的原本上下漂浮；改成走路
        self.ensureWalkAnims(tk, f.data.sprite);
        f.img = self.add.sprite(f.data.x * T + T / 2, (f.data.y + 1) * T, tk, self.idleFrame(f.data.sprite, 'down')).setOrigin(0.5, 1).setDepth((f.data.y + 1) * T).setVisible(old.visible);
        old.destroy();
        var ok = {};
        tiles.forEach(function (t) { ok[t.x + ',' + t.y] = true; });
        Object.assign(f, { wander: tiles, okSet: ok, tx: f.data.x, ty: f.data.y, facing: 'down', moving: false, path: [], nextMove: self.time.now + 600 + (f.data.x * 37 + f.data.y * 11) % 1500 });
      });
    }

    /** 帝雉的走動（和黃牛 wanderAnimals 同一套：A* 走到保護區裡隨機一格，走到了停一下）；看不見（show 條件沒成立）時不走 */
    wanderFriendlies(now) {
      var self = this;
      (this.friendlies || []).forEach(function (f) {
        if (!f.wander || f.moving || now < f.nextMove || !f.img.scene) return;
        if (!f.img.visible) { f.nextMove = now + 1000; return; }
        var can = function (x, y) { return !!f.okSet[x + ',' + y] && !self.friendlies.some(function (o) { return o !== f && o.wander && o.tx === x && o.ty === y; }); };
        if (!f.path.length) {
          var goal = J.MapInfo.wanderTarget(f.wander, { x: f.tx, y: f.ty });
          f.path = goal ? (J.Pathfind.findPath(can, self.size.w, self.size.h, { c: f.tx, r: f.ty }, { c: goal.x, r: goal.y }, 400) || []) : [];
          if (!f.path.length) { f.nextMove = now + 1200 + Math.random() * 1500; return; }
        }
        var t = f.path.shift();
        if (!can(t.c, t.r)) { f.path = []; f.nextMove = now + 600; return; }
        var dir = t.c > f.tx ? 'right' : t.c < f.tx ? 'left' : t.r > f.ty ? 'down' : 'up';
        f.tx = t.c; f.ty = t.r; f.facing = dir; f.moving = true;
        var key = f.img.texture.key + '-' + dir;
        if (self.anims.exists(key) && (!f.img.anims.isPlaying || !f.img.anims.currentAnim || f.img.anims.currentAnim.key !== key)) f.img.anims.play(key);
        self.tweens.add({ targets: f.img, x: t.c * T + T / 2, y: t.r * T + T, duration: FRIEND_STEP_MS, onComplete: function () {
          f.moving = false;
          if (f.path.length) { f.nextMove = self.time.now; return; }
          f.img.anims.stop(); f.img.setFrame(self.idleFrame(f.data.sprite, f.facing));
          f.nextMove = self.time.now + 1500 + Math.random() * 3000;   // 走到了停下來啄啄地面、看看四周
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
      else mob.respawnAt = this.loopNow() + RESPAWN_MS;   // v4.2.2 DEF-01：從回到地圖這一刻開始倒數（不是開戰那一刻）
    }

    /**
     * v4.2.2 DEF-01（老闆 2026-11-14「打完怪才開始計算30秒」）：遊戲迴圈「現在」的時間（＝update(time) 收到的 time）。
     * 戰鬥時這個場景被 sleep，場景時鐘 this.time.now 只在場景 update 時更新，醒來（onWake）那一刻還停在開戰時；
     * 拿它算重生與遇怪冷卻，戰鬥超過 30 秒回來下一幀就過期 → 同一隻怪立刻重生又開戰。沒有迴圈資訊（測試的假場景）時退回場景時鐘。
     */
    loopNow() {
      var loop = this.sys && this.sys.game && this.sys.game.loop;
      return loop && typeof loop.now === 'number' && loop.now > 0 ? loop.now : this.time.now;
    }

    // ---------------------------------------------------------------- 移動
    onPointer(pointer) {
      // v0.9.5 放大地圖（passMove 視窗）開著時，點面板外露出來的遊戲畫面也能走（只有擋路的視窗才不理會）
      if (!this.p || J.UI.blocksMove() || this.transitioning || G().busy) return;
      if (J.Followers && J.Followers.onPointer(this, pointer)) return;   // v3.0 跟班掛鉤（codex5）：直接點霧仔說話
      var x = Math.floor(pointer.worldX / T), y = Math.floor(pointer.worldY / T);
      if (x < 0 || y < 0 || x >= this.size.w || y >= this.size.h) return;
      var target = this.interactableAt(x, y);
      if (target && target.kind === 'boat' && target.dock.board) { x = target.dock.board.x; y = target.dock.board.y; }   // v3.0 點船身（在水上）：走到上船格
      if (target) {
        if (this.isAdjacent(x, y)) { this.face(x, y); this.interact(target); return; }
        this.walkTo(x, y, target);
        return;
      }
      this.walkTo(x, y, null);
    }

    /** 螢幕座標（clientX、clientY）→ 地圖上的點，當作點了那裡（v0.9：搖桿上的輕點） */
    tapAtClient(cx, cy) {
      var canvas = this.sys.game.canvas, r = canvas.getBoundingClientRect();
      if (cx < r.left || cy < r.top || cx > r.right || cy > r.bottom) return;
      var gx = (cx - r.left) * (this.scale.width / r.width), gy = (cy - r.top) * (this.scale.height / r.height);
      var wp = this.cameras.main.getWorldPoint(gx, gy);
      this.onPointer({ worldX: wp.x, worldY: wp.y });
    }

    /** 相鄰：正交，或 v1.0.6 斜角（兩個正交鄰格至少一個可走，不能隔著牆角） */
    isAdjacent(x, y) {
      var self = this;
      return J.Move8.adjacent(this.p.tx, this.p.ty, x, y, function (cx, cy) { return self.walkable(cx, cy); });
    }

    /** 面向 (x,y)。v1.0.6 斜角的對象：轉向橫向或縱向中較接近的那個（Move8.talkFacing） */
    face(x, y) {
      var self = this, p = this.p, dx = x - p.tx, dy = y - p.ty;
      var diag = J.Move8.talkFacing(p.tx, p.ty, x, y, p.facing, function (cx, cy) { return self.walkable(cx, cy); });
      p.facing = diag || (Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
      this.player.anims.stop();
      this.player.setFrame(this.idleFrame(this.heroKey, p.facing));
    }

    /**
     * 走到 (x,y)；target 不是 null 時走到它旁邊再互動。回傳是否找得到路。
     * v1.0.6 尋路用 Pathfind 的 diag:true（可以斜走、不斜穿牆角）；目標格不能站時找 8 個鄰格（Move8.planWalk）
     */
    walkTo(x, y, target) {
      var self = this, p = this.p;
      if (J.KeepAway) J.KeepAway.warn(this.map, x, y, J.UI.toast);   // v3.0 保持距離掛鉤（codex5）：只對玩家點的目的地提示
      var w = function (cx, cy) { return self.walkable(cx, cy); };
      var path = J.Move8.planWalk(w, this.size.w, this.size.h, { c: p.tx, r: p.ty }, x, y, !!target, J.Pathfind);
      if (!path) return false;
      p.path = path;
      p.pending = target ? { x: x, y: y, target: target } : null;
      if (!p.path.length && p.pending) this.arrive();
      return true;
    }

    /**
     * v0.9.5 點放大地圖上的一格：用 A* 走過去（地圖保持開著）。點到不能走的格子（房子、NPC、水）就走到最近的可走格。
     * 不和 NPC、寶箱互動（只是走過去）。回傳目的地格子 {x, y}；走不到或現在不能走回傳 null
     */
    walkFromMap(x, y) {
      var p = this.p;
      if (!p || this.transitioning || G().busy || J.UI.blocksMove()) return null;
      x = Math.max(0, Math.min(this.size.w - 1, x)); y = Math.max(0, Math.min(this.size.h - 1, y));
      if (!this.walkTo(x, y, null)) return null;
      var last = p.path.length ? p.path[p.path.length - 1] : { c: p.tx, r: p.ty };
      return { x: last.c, y: last.r };
    }

    /** 能走而且沒有黃牛擋著（斜走檢查牆角時也算） */
    freeAt(x, y) { return this.walkable(x, y) && !this.animalAt(x, y); }

    /**
     * 方向鍵／搖桿走一步。v1.0.6 可以斜走（Move8.resolveStep）：
     * 不斜穿牆角；只有一邊能走就順著那邊滑；兩邊都不行就原地轉向不動
     */
    tryStep(dir) {
      var p = this.p, self = this;
      if (J.KeepAway) J.KeepAway.warnStep(this.map, p.tx, p.ty, J.Move8.DIRS[dir], J.UI.toast);   // v3.0 保持距離掛鉤（codex5）：方向鍵／搖桿嘗試靠近才提示
      var r = J.Move8.resolveStep(p.tx, p.ty, dir, function (x, y) { return self.freeAt(x, y); }, p.facing);
      if (!r.dir) {
        var an = this.blockingAnimal(p.tx, p.ty, dir);
        if (an) this.bumpAnimal(an);   // v0.9.3 碰到黃牛：哞～，牠會走開
        p.facing = J.Move8.facingFor(dir, p.facing);
        this.player.anims.stop(); this.player.setFrame(this.idleFrame(this.heroKey, p.facing));
        return false;
      }
      this.beginStep(r.x, r.y);
      return true;
    }

    /** 往 dir 走時擋路的黃牛（目標格；斜走時也看橫向、縱向那兩格） */
    blockingAnimal(x, y, dir) {
      var d = J.Move8.DIRS[dir];
      if (!d) return null;
      var cells = [[x + d[0], y + d[1]]];
      if (d[0] && d[1]) cells.push([x + d[0], y], [x, y + d[1]]);
      for (var i = 0; i < cells.length; i++) { var an = this.animalAt(cells[i][0], cells[i][1]); if (an) return an; }
      return null;
    }

    beginStep(nx, ny) {
      var p = this.p;
      // 腳步聲：依腳下圖塊分草地／石板／木棧道／泥地（每兩步一聲，避免太吵）
      this.stepCount = (this.stepCount || 0) + 1;
      if (this.stepCount % 2 === 0 && !(J.Ambience && J.Ambience.stepsReady())) J.Audio.play('footstep', J.Sfx ? J.Sfx.terrainOf(this.defAt(nx, ny).tile) : 'grass');   // v3.0.1（86 號 #8）音效包能用時改成腳落地那一格播（walkStep）
      var dx = nx - p.tx, dy = ny - p.ty;
      var dir = J.Move8.dirOf(dx, dy);
      // v1.0.6 走路圖只有四方向：斜走面向橫向，原本就面向其中一個分量方向時不轉（不閃爍）
      p.facing = J.Move8.facingFor(dir, p.facing);
      p.moving = true; p.t = this.stepCarry || 0; this.stepCarry = 0;   // v3.0.1（86 號 #2）多出來的時間帶到這一格
      p.from = { x: p.tx * T + T / 2, y: p.ty * T + T };
      p.to = { x: nx * T + T / 2, y: ny * T + T };
      // v4.2.2 斜走一步的時間和直走一樣（老闆 2026-11-13 裁定；v1.0.6 原本是 √2 倍）
      p.stepMs = J.Move8.stepMs(STEP_MS, dir) / G().moveSpeed();
      p.stepDir = dir;
      if (p.t > 0) { var k0 = Math.min(1, p.t / p.stepMs), bx0 = this.player.x, by0 = this.player.y; this.player.x = p.from.x + (p.to.x - p.from.x) * k0; this.player.y = p.from.y + (p.to.y - p.from.y) * k0; this.walkStep(Math.abs(this.player.x - bx0) + Math.abs(this.player.y - by0)); }   // v3.0.1（86 號 #2）
      p.prev = { x: p.tx, y: p.ty };
      p.tx = nx; p.ty = ny;
      var key = this.player.texture.key + '-' + p.facing;
      // v3.0.1（86 號 #4）走路圖改成照移動距離換圖（walkStep），不再播 frameRate 8 的動畫；key 留著給別的地方用
      if (this.player.anims.isPlaying) this.player.anims.stop();
      if (!this.walkAnim) this.walkAnim = { dist: 0, idx: -1 };
      if (this.walkAnim.idx < 0) this.walkStep(0);
      var self = this;
      var spot = J.MapInfo.petSpot(function (x, y) { return self.walkable(x, y); }, this.size.w, this.size.h, { x: p.prev.x, y: p.prev.y }, { x: p.tx, y: p.ty }) || p.prev;
      this.petTarget = { x: spot.x * T + T / 2, y: spot.y * T + T };
      // v1.0.6 斜走：這一步的距離可能是 √2 格，番薯仔等比例加快，一定在主角走完這一步前到達（不落後、不從半路切過牆角）
      this.petDist = Math.sqrt(Math.pow(this.petTarget.x - this.pet.x, 2) + Math.pow(this.petTarget.y - this.pet.y, 2));
      if (J.Followers) J.Followers.beginStep(this);   // v3.0 跟班掛鉤（codex5）：記下主角這一步，讓兩隻依序跟上
    }

    arrive() {
      var p = this.p, g = G();
      g.state.location = { map: this.mapId, x: p.tx, y: p.ty };
      this.checkLandmark();
      var ex = J.World.exitAt(this.map, p.tx, p.ty);
      // v1.2（61 號 2.0）出口 requires：委託還沒完成時不換圖，退回上一格、播 requires_dialog（番薯仔說明）；v4.2 東部條件帶 ctx
      if (ex && !J.World.exitOpen(ex, g.state, typeof this.exitContext === 'function' ? this.exitContext(ex) : undefined)) { p.path = []; p.pending = null; this.exitLocked(ex); return true; }
      if (ex) { p.path = []; p.pending = null; if (g.finishAt && g.finishAt(this, ex)) return true; if (g.firstExitDialog && g.firstExitDialog(this, ex)) return true; this.goExit(ex); return true; }   // 4c 夜班：M40 最後的門第一次推開播 D_SUMMIT_GATE   // v4.2 4c：Q_POST_1 走到 M42 北口＝完成（播完再換圖）
      // v4.2 事件委託的觸發格（黑熊、山莊廣場、霧中入口）：自動停下、開始事件
      if (g.eventAt && g.eventAt(this, p.tx, p.ty)) { p.path = []; p.pending = null; this.player.anims.stop(); return true; }
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
      J.HUD.prompt(null);
      if (J.Ambience) J.Ambience.leave();   // v3.0.1（86 號 #7）環境音 0.25 秒淡出
      // v3.0.1（86 號 #6）：失焦前景葉叢從左邊滑進來蓋滿畫面再換地圖；減少動態效果時 sweepOut 回傳 false，照舊淡出
      if (J.TreeFX && J.TreeFX.sweepOut(this, function () { G().leafSweepIn = true; G().changeMap(ex.to, ex.tx, ex.ty, self.p.facing); })) return;
      J.Audio.play('warp');   // v4.0.1（老闆 11-07「採用新音效」）：有葉叢轉場時只播轉場聲，不再疊 warp；這裡＝減少動態效果的舊淡出
      this.cameras.main.fadeOut(250, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', function () { G().changeMap(ex.to, ex.tx, ex.ty, self.p.facing); });
    }


    /** v1.2 鎖著的出口（exit.requires 還沒完成）：主角退回上一格（不停在出口上），番薯仔說明 requires_dialog */
    exitLocked(ex) {
      var p = this.p, g = G();
      var back = p.prev && (p.prev.x !== p.tx || p.prev.y !== p.ty) && this.walkable(p.prev.x, p.prev.y) && !J.World.exitAt(this.map, p.prev.x, p.prev.y) ? p.prev : null;
      if (back) {
        p.tx = back.x; p.ty = back.y;
        this.player.setPosition(p.tx * T + T / 2, p.ty * T + T);
        g.state.location = { map: this.mapId, x: p.tx, y: p.ty };
      }
      this.player.anims.stop();
      g.exitLockedLog = (g.exitLockedLog || []).concat([ex.requires]);   // 測試用
      var dlg = ex.requires_dialog || null;
      if (ex.requires_dialogs) [].concat(ex.requires).some(function (q) { var rr = g.state.quests[q]; if (ex.requires_dialogs[q] && !(rr && rr.status === 'done')) { dlg = ex.requires_dialogs[q]; return true; } return false; });   // v4.0 東部（71 號 4.2：M26 北口頭目沒過／島還沒去完各一句）
      // v4.2 最後的門：D_EXIT_LOCK_CV 後面依缺的條件接 _LAMP → _STAR → _PL（lockDialogIds、exitContext 由洞窟的掛鉤加上）；{pl}＝狀態頁「戰力」同一個數字（無條件捨去）
      var ids = typeof this.lockDialogIds === 'function' ? this.lockDialogIds(ex) : [];
      g.exitLockDialogs = ids;   // 測試用
      if (ids.length > 1) {
        var D = (g.data && g.data.dialogs) || {}, pl = String(Math.floor(J.Character.pl(g.state, g.data)));
        return ids.reduce(function (p, id) {
          return p.then(function () { return /\{pl\}/.test(JSON.stringify(D[id] || [])) ? g.say(null, D[id].map(function (l) { return Object.assign({}, l, { text: l.text.replace('{pl}', pl) }); })) : g.say(id, []); });
        }, Promise.resolve());
      }
      g.say(dlg, [{ who: 'pet', text: '這條路現在還不能走喔。' }]);
    }

    // ---------------------------------------------------------------- 互動
    interactableAt(x, y) {
      var i;
      for (i = 0; i < this.npcs.length; i++) if (!this.npcs[i].hidden && this.npcs[i].data.x === x && this.npcs[i].data.y === y) return { kind: 'npc', npc: this.npcs[i].data };
      for (i = 0; i < this.chests.length; i++) if (this.chests[i].data.x === x && this.chests[i].data.y === y) return { kind: 'chest', chest: this.chests[i].data };
      for (i = 0; i < this.lamps.length; i++) if (this.lamps[i].data.x === x && this.lamps[i].data.y === y) return { kind: 'lamp', lamp: this.lamps[i].data };
      if (this.station && this.station.x === x && this.station.y === y) return { kind: 'station', station: this.station };
      for (i = 0; i < (this.roadsigns || []).length; i++) if (this.roadsigns[i].data.x === x && this.roadsigns[i].data.y === y) return { kind: 'roadsign', sign: this.roadsigns[i].data };
      for (i = 0; i < (this.viewpoints || []).length; i++) if (this.viewpoints[i].data.x === x && this.viewpoints[i].data.y === y) return { kind: 'viewpoint', view: this.viewpoints[i].data };
      var sh = J.MapInfo.shrineAt(this.map, x, y);   // v0.9.5 媽祖神像、供桌
      if (sh) return { kind: 'shrine', spot: sh };
      var bd = this.map.boat_dock;   // v3.0 碼頭的船：上船格、船身都算
      if (bd && ((bd.board && bd.board.x === x && bd.board.y === y) || (Array.isArray(bd.ship_area) && x >= bd.ship_area[0] && y >= bd.ship_area[1] && x < bd.ship_area[0] + bd.ship_area[2] && y < bd.ship_area[1] + bd.ship_area[3]))) return { kind: 'boat', dock: bd };
      var an = this.animalAt(x, y);
      if (an) return { kind: 'animal', animal: an };
      return null;
    }

    /**
     * 面前或旁邊可以互動的東西：站的那格（車站）→ 面前那格 → 其他正交鄰格 →
     * v1.0.6 斜角（兩個正交鄰格至少一個可走才算，不能隔著牆角說話；actionKey 會先轉向再對話）
     */
    nearbyInteractable() {
      var p = this.p, self = this;
      return J.Move8.nearby(p.tx, p.ty, p.facing, function (x, y) { return self.interactableAt(x, y); }, function (x, y) { return self.walkable(x, y); });
    }

    actionKey() {
      if (!this.p || J.UI.isOpen() || this.transitioning || this.p.moving || G().busy) return;   // 地圖背景還在載入時 p 是 null
      var n = this.nearbyInteractable();
      if (n) { this.face(n.x, n.y); this.interact(n.t); }
    }

    interact(t) {
      var g = G();
      if (g.inEnding) return;   // v4.2 大結局過場中不能和人說話、開寶箱
      // v0.9.6（47 號 B08）放大地圖開著時和人說話、開寶箱：先關掉地圖，對話和題目才不會疊在地圖上
      if (J.UI.isOpen() && !J.UI.blocksMove()) { J.UI.closePassMove(); g.closedMapForTalk = (g.closedMapForTalk || 0) + 1; }
      this.p.path = [];
      J.HUD.prompt(null);
      if (t.kind === 'npc') g.talkTo(t.npc, this);
      else if (t.kind === 'chest') g.openChest(t.chest, this);
      else if (t.kind === 'lamp') g.inspectLamp(t.lamp, this);
      else if (t.kind === 'station') g.useStation(t.station, this);
      else if (t.kind === 'shrine') g.shrineJob(this);
      else if (t.kind === 'roadsign') g.say(t.sign.dialog, [{ who: 'pet', text: '這裡的路還不能走喔。' }]);   // v1.1 路牌：番薯仔念牌子（華語）
      else if (t.kind === 'viewpoint') g.viewpoint(t.view);   // v1.1 美人山眺望點
      else if (t.kind === 'boat') g.boardBoat(t.dock, this);   // v3.0 碼頭的船
      else if (t.kind === 'animal') { t.animal.nextMove = Math.max(t.animal.nextMove, this.time.now + 2500); g.animalTalk(t.animal.spec); }   // 說話時先站著不動
    }

    promptText(t) {
      if (t.kind === 'npc' && t.npc.ferry) return '買船票／搭船';   // v3.0 船班（codex3）
      if (t.kind === 'boat') { var bn = J.Ferry && J.Ferry.dockDestinations ? J.Ferry.dockDestinations(t.dock, G().data.maps) : []; return '搭船' + (bn.length ? '到' + bn.join('／') : ''); }   // v3.0 碼頭的船；v4.2.2 寫出目的地（「搭船到小琉球」）
      if (t.kind === 'npc') return '和' + G().speaker(t.npc.id).name + '說話';
      if (t.kind === 'animal') return '摸摸' + t.animal.spec.name;
      if (t.kind === 'chest') return G().state.chests[t.chest.id] ? '看看寶箱' : '打開寶箱';
      if (t.kind === 'station') return '在' + (t.station.name || '車站') + '搭車';
      if (t.kind === 'shrine') return '在神像前轉職';
      if (t.kind === 'roadsign') return '看看路牌';
      if (t.kind === 'viewpoint') return '看看' + (t.view.label || '風景');
      return '看看' + t.lamp.subject + '燈';
    }

    // ---------------------------------------------------------------- v3.0.1 移動流暢度（86 號 #1、#4；計算在 systems/motion.js）
    /** #1 鏡頭目標：平滑中心依時間逼近主角，目標＝round(主角)－取整後的落後量（主角和鏡頭一起取整） */
    updateCamTarget(delta) {
      if (!this.camTarget || !this.player) return;
      var pl = this.player;
      this.camC = J.Motion.camStep(this.camC, pl.x, pl.y, delta, T);
      var t = J.Motion.camTarget(pl.x, pl.y, this.camC);
      this.camTarget.x = t.x; this.camTarget.y = t.y;
    }
    /** 減少動態效果（家長設定或系統），每秒查一次 */
    reduceMotionNow() {
      var now = Date.now();
      if (!this.rmAt || now - this.rmAt > 1000) { this.rmAt = now; var st = G().state; this.rmVal = J.Motion.reduceMotion(st && st.settings, window.matchMedia && window.matchMedia.bind(window)); }
      return !!this.rmVal;
    }
    /** #4 走路圖照移動距離換圖：每半格一張（0-1-2-1）；換到中間那張時身體上彈 2 像素 */
    walkStep(dist) {
      var w = this.walkAnim || (this.walkAnim = { dist: 0, idx: -1 });
      w.dist += dist || 0;
      var idx = J.Motion.walkIndex(w.dist, T), f = J.Motion.walkFrame(J.Assets.dirRow(this.heroKey, this.p.facing), idx);
      if (this.player.texture.has(f) && this.player.frame.name !== f) this.player.setFrame(f);
      var foot = J.Ambience && this.p.moving ? J.Ambience.landingFoot(w.idx, idx) : null;   // v3.0.1（86 號 #8）腳落地：每走一格一聲，左右腳交替
      if (foot) { var tile = this.defAt(this.p.tx, this.p.ty).tile, tr = J.Sfx ? J.Sfx.terrainOf(tile) : 'grass'; J.Ambience.footstep(J.Ambience.stepSet(tr, tile, this.mapId, this.map.tileset), foot); }
      w.idx = idx;
      this.setBob(J.Motion.bobFor(idx, this.reduceMotionNow()));
    }
    setBob(px) {
      if (this.bobPx === px) return;
      this.bobPx = px;
      this.player.setOrigin(0.5, 1 + px / Math.max(1, this.player.displayHeight));   // 腳底（player.y）不變，只把圖往上畫 px 像素
    }
    resetWalk() { if (this.walkAnim) { this.walkAnim.dist = 0; this.walkAnim.idx = -1; } this.setBob(0); }

    // ---------------------------------------------------------------- 每一格畫面
    update(time, delta) {
      var g = G(), p = this.p;
      if (!p || this.transitioning) return;
      var blocked = J.UI.blocksMove() || g.busy;   // v0.9.3 放大地圖開著時也能走（passMove 視窗不擋）
      if (p.moving) {
        p.t += delta;
        var k = Math.min(1, p.t / (p.stepMs || STEP_MS));
        var wx0 = this.player.x, wy0 = this.player.y;   // v3.0.1（86 號 #4）這一幀走的距離 → 走路圖
        this.player.x = p.from.x + (p.to.x - p.from.x) * k;
        this.player.y = p.from.y + (p.to.y - p.from.y) * k;
        this.walkStep(Math.sqrt((this.player.x - wx0) * (this.player.x - wx0) + (this.player.y - wy0) * (this.player.y - wy0)));
        if (k >= 1) {
          this.stepCarry = J.Motion.carry(p.t, p.stepMs || STEP_MS);   // v3.0.1（86 號 #2）多出來的時間帶到下一格
          p.moving = false;
          if (this.arrive()) { this.stepCarry = 0; this.syncDepths(); return; }
        }
      }
      if (!p.moving && !blocked) {
        var dir = g.heldDir();
        if (dir) { p.path = []; p.pending = null; this.tryStep(dir); }
        else if (p.path.length) {
          var n = p.path.shift();
          // v1.0.6 路徑可以斜走：走之前再檢查一次牆角（黃牛可能剛好走到橫向或縱向那一格）
          var an2 = this.blockingAnimal(p.tx, p.ty, J.Move8.dirOf(n.c - p.tx, n.r - p.ty));
          var selfMs = this;
          if (an2) { this.bumpAnimal(an2); p.path = []; }
          else if (J.Move8.canStep(p.tx, p.ty, n.c, n.r, function (x, y) { return selfMs.freeAt(x, y); })) this.beginStep(n.c, n.r); else p.path = [];
        } else if (this.player.anims.isPlaying || (this.walkAnim && this.walkAnim.idx >= 0)) { this.player.anims.stop(); this.player.setFrame(this.idleFrame(this.heroKey, p.facing)); this.resetWalk(); }   // v3.0.1（86 號 #4）
      }
      this.stepCarry = 0;   // v3.0.1（86 號 #2）這一幀沒有接著走下一格，多出來的時間不留
      // 番薯仔跟在後面（防閃爍：方向有遲滯、短暫停頓不切站姿、站姿沿用目前方向、透明度平滑變化）
      this.updatePet(delta);
      this.updateCamTarget(delta);   // v3.0.1（86 號 #1）
      this.updateGhost();
      if (J.TreeFX) J.TreeFX.update(this, delta, time);   // v3.0.1（86 號 #5）
      if (J.Ambience) J.Ambience.update(p.tx, p.ty, time);   // v3.0.1（86 號 #7）區域環境音、觀景點

      this.shrineCamera();
      if (time >= this.cullAt) { this.cullAt = time + 150; this.cull(); this.fadeMinimap(); this.fadeOverlays(); }
      this.wanderMonsters(time);
      if (!g.busy) { this.wanderAnimals(time); this.wanderFriendlies(time); }
      this.updateSpriteFx(time);   // v4.2.2 第三批
      this.syncDepths();
      if (!blocked && time > this.encounterCooldown) this.checkEncounter();
      if (!blocked && !p.moving && !J.UI.isOpen()) {
        var near = this.nearbyInteractable();
        var self = this;
        if (near) J.HUD.prompt(this.promptText(near.t), function () { self.face(near.x, near.y); self.interact(near.t); });
        else J.HUD.prompt(null);
      } else if (p.moving || J.UI.isOpen()) J.HUD.prompt(null);
    }

    /**
     * v1.3 候選版畫面審查必改 1（2026-10-26）：主角走到地圖右緣時，鏡頭貼邊、主角被推到畫面最右邊，正好在右上角小地圖底下（手機最明顯）。
     * 每 150ms（和 cull 一起）算主角在螢幕上的範圍（腳底往上約 1.6 格、左右各 0.6 格），和小地圖重疊就加 .mm-fade（style.css：半透明、不擋點擊），離開就拿掉。
     * 只改透明度，版面不動；電腦版一樣適用（小地圖比較小，很少碰到）。
     */
    fadeMinimap() {
      var mm = typeof document !== 'undefined' && document.querySelector('#hud .minimap');
      if (!mm || !this.player || !this.sys || !this.sys.game || !this.sys.game.canvas) return;
      var cv = this.sys.game.canvas.getBoundingClientRect(), wv = this.cameras.main.worldView;
      if (!cv.width || !wv.width || !wv.height) return;
      var sx = cv.width / wv.width, sy = cv.height / wv.height;
      var px = cv.left + (this.player.x - wv.x) * sx, py = cv.top + (this.player.y - wv.y) * sy;
      var r = mm.getBoundingClientRect(), hw = T * 0.6 * sx, ht = T * 1.6 * sy;
      var hit = !!r.width && px + hw > r.left && px - hw < r.right && py > r.top && py - ht < r.bottom;
      if (hit !== mm.classList.contains('mm-fade')) mm.classList.toggle('mm-fade', hit);
      return hit;
    }

    /**
     * v1.4.1 上線後小問題（交接第三節第 8 點）：
     *  ・北口被 HUD 蓋住：電腦版、手機橫放的 HUD 疊在遊戲畫面上面；走到地圖最上面幾列時鏡頭貼邊，主角被畫在狀態卡或按鈕底下。
     *  ・地名橫幅蓋住主角：橫幅疊到主角身上（手機橫放最明顯；style.css 已把矮螢幕的橫幅移到主角下方，這裡處理其他情況）。
     * 和 fadeMinimap 同一套算法（主角腳底往上約 1.6 格、左右各 0.6 格；只算畫布裡看得到的部分），重疊就加 class（style.css：.hud-fade 半透明、.hero-under 變淡），離開就拿掉。
     * 直放時遊戲畫面在 HUD 下面（畫布上緣＝HUD 下緣），所以 HUD 不會被判成重疊。回傳 { 選擇器: 有沒有重疊 }（測試用）
     */
    fadeOverlays() {
      if (typeof document === 'undefined' || typeof document.querySelectorAll !== 'function' || !this.player || !this.sys || !this.sys.game || !this.sys.game.canvas) return null;
      var cv = this.sys.game.canvas.getBoundingClientRect(), wv = this.cameras.main.worldView;
      if (!cv.width || !wv.width || !wv.height) return null;
      var sx = cv.width / wv.width, sy = cv.height / wv.height;
      var px = cv.left + (this.player.x - wv.x) * sx, py = cv.top + (this.player.y - wv.y) * sy;
      var hw = T * 0.6 * sx, top = Math.max(cv.top, py - T * 1.6 * sy), bottom = Math.min(cv.top + cv.height, py), out = {};
      // v2.2.1（v20 缺陷 11、v21 L7）：委託完成的大橫幅、「下一步」「轉職成…」提示泡泡蓋到主角時也變淡
      [['#hud .hud-card', 'hud-fade'], ['#hud .hud-buttons', 'hud-fade'], ['#ui > .map-banner', 'hero-under'], ['#ui > .big-banner', 'hero-under'], ['#toasts > .toast', 'hero-under']].forEach(function (p) {
        out[p[0]] = false;
        Array.prototype.forEach.call(document.querySelectorAll(p[0]) || [], function (el) {
          var r = el.getBoundingClientRect();
          var hit = !!r.width && bottom > top && px + hw > r.left && px - hw < r.right && bottom > r.top && top < r.bottom;
          if (hit !== el.classList.contains(p[1])) el.classList.toggle(p[1], hit);
          if (hit) out[p[0]] = true;
        });
      });
      return out;
    }

    /**
     * v4.2.2（老闆 2026-11-13）：角色腳下影子、NPC 呼吸、有腳的野怪踏步、沒腳的上下飄動；數學在 systems/sprite_anim.js。
     * 只改縮放、origin（畫面往上畫）、rotation 與影子，不改 sprite.x／y：遇怪判定、深度、鏡頭外判斷、SpawnSpread、存檔都不受影響。
     * 鏡頭外（看不見）的角色只把影子藏起來；減少動態效果時不踏步、不呼吸、飄動停在最低點，影子靜止。
     */
    updateSpriteFx(now) {
      var rm = this.reduceMotionNow(), f = this.followers, fl = this.friendlies, i;
      this.footShadow(this.p, this.player, 1);
      this.footShadow(this.petFx, this.pet, 1);
      if (f) for (i = 1; i < f.sprites.length; i++) this.footShadow(f.states[i], f.sprites[i], 1);   // 第 0 隻就是番薯仔
      for (i = 0; i < this.animals.length; i++) this.footShadow(this.animals[i], this.animals[i].sprite, 1);
      if (fl) for (i = 0; i < fl.length; i++) {   // 友善動物不會走：單張圖的呼吸；有走路圖的原本漂浮照舊，影子留在地上
        if (fl[i].walk) this.footShadow(fl[i], fl[i].img, 1, fl[i].wander ? undefined : (fl[i].data.y + 1) * T); else this.standFx(fl[i], fl[i].img, now, rm);   // 會走動的（帝雉）影子跟著腳底
      }
      for (i = 0; i < this.npcs.length; i++) this.standFx(this.npcs[i], this.npcs[i].img, now, rm);
      for (i = 0; i < this.monsters.length; i++) this.mobFx(this.monsters[i], now, rm);
      // 第六次修改（老闆 2026-11-13「小番薯不見了」「野怪會完全被擋住」）：主角以外的角色被上層格蓋住時也顯示剪影（主角照舊用 updateGhost／樹冠透明）
      this.coverFx(this.petFx, this.pet);
      if (f) for (i = 1; i < f.sprites.length; i++) this.coverFx(f.states[i], f.sprites[i]);
      for (i = 0; i < this.animals.length; i++) this.coverFx(this.animals[i], this.animals[i].sprite);
      if (fl) for (i = 0; i < fl.length; i++) this.coverFx(fl[i], fl[i].img);
      for (i = 0; i < this.npcs.length; i++) this.coverFx(this.npcs[i], this.npcs[i].img);
      for (i = 0; i < this.monsters.length; i++) this.coverFx(this.monsters[i], this.monsters[i].sprite);
    }
    /**
     * 剪影（主角以外）：角色碰到上層格（fgSet，和主角 updateGhost 同一套格子、同樣內縮的判斷框）時，在最上層（GHOST_DEPTH）畫同一張貼圖、同一格、
     * 同樣 scale／origin／flip／rotation 的淺藍 35% 單色影子，而且只裁出「被蓋住的那一塊」：整隻被蓋住就是整隻剪影，蓋住下半身時上半身照常。
     * 剪影物件第一次被蓋住時才建立（hold.cover），離開就隱藏；角色銷毀時一起銷毀。只改剪影，不改角色本身。
     */
    coverFx(hold, spr) {
      if (!hold || !spr) return;
      var g = hold.cover, A = J.SpriteAnim, box = null, l = 0, t = 0;
      if (g && !g.scene) g = hold.cover = null;   // 換地圖後舊場景的物件已經銷毀
      if (!spr.scene) { if (g) { g.destroy(); hold.cover = null; } return; }
      if (this.hasFg && spr.visible && spr.alpha > 0.01) {
        var dw = spr.displayWidth, dh = spr.displayHeight;
        l = spr.x - spr.originX * dw; t = spr.y - spr.originY * dh;
        if (A.coverBox(l + 4, t + 4, dw - 8, dh - 6, this.fgSet, T)) box = A.coverBox(l, t, dw, dh, this.fgSet, T);
      }
      if (!box) { if (g && g.visible) g.setVisible(false); return; }
      if (!g) g = hold.cover = this.add.image(spr.x, spr.y, spr.texture.key, spr.frame.name).setTint(GHOST_TINT).setTintMode(Phaser.TintModes.FILL).setDepth(GHOST_DEPTH);
      if (g.texture.key !== spr.texture.key) g.setTexture(spr.texture.key, spr.frame.name); else if (g.frame.name !== spr.frame.name) g.setFrame(spr.frame.name);
      // 審查 S-1（2026-11-14 瀏覽器實測確認）：翻轉的角色若剪影也用 flipX＋左右對調的 crop，Phaser 4 WebGL 會把裁切的「位置」和「取樣 UV」各鏡射一次，
      // 左右只被蓋住一部分時輪廓取到圖的另一邊（Canvas 版剛好相反）。改成剪影不用 flipX、用負的 scaleX 翻轉（翻轉交給變換矩陣，兩種渲染器一樣），
      // crop 用「沒翻轉的貼圖座標」：顯示的第 d 欄＝貼圖第 W−1−d 欄，所以被蓋住的顯示範圍 [cx, cx+cw) 對到貼圖 [W−cx−cw, W−cx)。
      var fx = !!spr.flipX, sx = Math.abs(spr.scaleX) || 1, sy = Math.abs(spr.scaleY) || 1;
      g.setVisible(true).setPosition(spr.x, spr.y).setScale(fx ? -sx : sx, sy).setOrigin(spr.originX, spr.originY).setFlipX(false).setRotation(spr.rotation || 0).setAlpha(GHOST_ALPHA * spr.alpha);
      var cw = box.w / sx, cx = (box.x - l) / sx;
      g.setCrop(fx ? spr.width - cx - cw : cx, (box.y - t) / sy, cw, box.h / sy);
    }
    /**
     * 不會走的單張圖角色（NPC、帝雉、黑熊；美術分類都有腳）：腳底固定的呼吸（只改 scaleY），最高至少 1 像素。
     * 以後若有會走的單張圖 NPC：在它的資料記 id／sprite／baseScale／moving／stepAt，改呼叫 mobFx 同一段踏步即可（目前沒有會走的 NPC）。
     */
    standFx(o, img, now, rm) {
      var A = J.SpriteAnim, sy = o.sy0;
      if (!img.scene) { this.footShadow(o, img, 1); return; }   // 已銷毀：只收掉影子
      if (img.visible) sy = o.sy0 * (1 + A.breath(now, o.bp, A.NPC_AMP, o.bph, img.height * o.sy0, rm));
      if (img.scaleY !== sy) img.setScale(img.scaleX, sy);
      this.footShadow(o, img, 1);
    }
    /**
     * 野怪（老闆 2026-11-13）：有腳的（step）走一格踏兩步（左右傾斜＋小起伏）、站著呼吸；沒腳的（float）不論走或站都上下飄動（貼地的幅度小）。
     * 頭目與不會走的怪：step 只呼吸、float 照樣飄。打倒跑走時 step 回到原本大小、不傾斜；float 跑走中照樣飄（不會突然掉到地上）。
     * 有多幀圖的（mob.frames＞0，見 placeMonster）改成換格，rotation 一直 0；格序與每格毫秒在 SpriteAnim.animFrame。
     */
    mobFx(mob, now, rm) {
      var s = mob.sprite, A = J.SpriteAnim;
      if (!s || !mob.baseScale) return;
      if (!s.scene) { this.footShadow(mob, s, 1); return; }   // 已銷毀：只收掉影子
      if (!mob.motion) {
        mob.motion = A.motionOf(mob.id);
        mob.breathP = A.mobPeriod(mob.idx); mob.breathPh = A.mobPhase(mob.idx, mob.breathP);
        mob.floatP = A.floatPeriod(mob.idx); mob.floatPh = A.floatPhase(mob.idx, mob.floatP); mob.gnd = A.grounded(mob.id);
        mob.kind = A.animKind(mob.id); mob.animPh = A.animPhase(mob.idx, mob.frames, mob.kind);
      }
      var fl = mob.motion === 'float', lift = 0, br = 0, tilt = 0;
      if (s.visible) {
        if (mob.frames) {
          // v4.2.2 多幀圖：換格取代程式的傾斜與起伏。有腳的走一格播一輪、站著（含跑走）停並攏格＋呼吸；漂浮、飛行換格＋原本的飄動；貼地只換格不飄
          var fr = A.animFrame(mob.kind, now, mob.active && mob.moving ? (now - mob.stepAt) / MOB_STEP_MS : NaN, mob.animPh, mob.frames, rm);
          if (mob.frame !== fr) { mob.frame = fr; s.setFrame(fr); }
          if (fl && !mob.gnd) lift = A.floatLift(now, mob.floatP, mob.floatPh, rm, false);
          else if (!fl && mob.active && !mob.moving) br = A.breath(now, mob.breathP, A.MOB_AMP, mob.breathPh, s.height * mob.baseScale, rm);
        }
        else if (fl) lift = A.floatLift(now, mob.floatP, mob.floatPh, rm, mob.gnd);   // 貼地的（D 類）0～2 像素，其餘 1～7
        else if (mob.active && mob.moving) { var k = (now - mob.stepAt) / MOB_STEP_MS; lift = A.stepLift(k, rm); tilt = A.stepTilt(k, rm); }
        else if (mob.active) br = A.breath(now, mob.breathP, A.MOB_AMP, mob.breathPh, s.height * mob.baseScale, rm);
      }
      var sy = mob.baseScale * (1 + br), r = tilt * Math.PI / 180;
      if (s.scaleX !== mob.baseScale || s.scaleY !== sy || mob.lift !== lift) {
        mob.lift = lift;
        s.setScale(mob.baseScale, sy).setOrigin(0.5, 1 + lift / Math.max(1, s.displayHeight));   // 和主角的 setBob 一樣：腳底（sprite.y）不變，只把圖往上畫
      }
      if (s.rotation !== r) s.setRotation(r);   // 以 origin（腳底中央）為軸傾斜；不踏步時一律回到 0
      this.footShadow(mob, s, fl ? A.shadowScale(lift, A.FLOAT_TOP) : 1);
    }
    /**
     * 腳下影子：共用 fx:footshadow 貼圖、固定深度（地面之上、角色之下）；跟著角色的顯示、透明度、銷毀；k＝縮放（飄高時略縮小，平常 1）。
     * 影子記在角色的資料（hold.shadow：怪物、NPC、動物、主角的 p…），不加屬性到 Phaser 物件上（保持引擎物件的形狀一致）。
     */
    footShadow(hold, spr, shk, groundY) {
      if (!hold || !spr) return;
      var sh = hold.shadow, A = J.SpriteAnim;
      if (!spr.scene) { if (sh) { sh.destroy(); hold.shadow = null; } return; }
      var on = spr.visible && spr.alpha > 0.01;
      if (!sh) {
        if (!on) return;
        sh = hold.shadow = this.add.image(0, 0, 'fx:footshadow').setDepth(CHAR_SHADOW_DEPTH);
      }
      if (sh.visible !== on) sh.setVisible(on);
      if (!on) return;
      var k = A.shadowWidth(spr.displayWidth) / 32 * shk, a = A.SHADOW_ALPHA * spr.alpha;
      var gy = (groundY === undefined ? spr.y : groundY) + 1;   // 橢圓中心在腳底下 1 像素：大半露在腳外（飄動、踏步只改 origin，spr.y 一直是地面）
      if (sh.x !== spr.x || sh.y !== gy) sh.setPosition(spr.x, gy);
      if (sh.scaleX !== k) sh.setScale(k);
      if (sh.alpha !== a) sh.setAlpha(a);
    }

    syncDepths() {
      // Phaser 每次 setDepth 都會讓整個畫面重新排序，所以只有深度真的改變、而且在鏡頭附近的才設定
      function setD(o, d) { if (o.depth !== d) o.setDepth(d); }
      setD(this.player, this.player.y);
      setD(this.pet, this.pet.y - 0.1);
      this.monsters.forEach(function (m) { if (m.sprite && m.inView !== false) setD(m.sprite, m.sprite.y); });
      (this.animals || []).forEach(function (a) { if (a.inView !== false) setD(a.sprite, a.sprite.y); });
      (this.friendlies || []).forEach(function (f) { if (f.wander && f.img.scene) setD(f.img, f.img.y); });   // v4.2.2 會走動的帝雉
    }

    /**
     * 鏡頭外的東西不更新（每 150ms 檢查一次）：
     * 怪物隱藏並暫停晃動動畫（遊走改成降頻、不播補間）、NPC 隱藏並暫停動畫、備援圖塊依分區隱藏
     */
    cull() {
      var wv = this.cameras.main.worldView, m = T * 3;
      if (!wv.width) return;
      var x0 = wv.x - m, y0 = wv.y - m, x1 = wv.x + wv.width + m, y1 = wv.y + wv.height + m * 2;   // 角色圖從腳底往上長，下方多留一點
      var inView = function (x, y) { return x >= x0 && x <= x1 && y >= y0 && y <= y1; };
      this.monsters.forEach(function (mob) {
        if (!mob.sprite) return;
        var v = inView(mob.sprite.x, mob.sprite.y);
        if (v === mob.inView) return;
        mob.inView = v;
        if (mob.active) mob.sprite.setVisible(v);
      });
      (this.animals || []).forEach(function (a) {
        var v = inView(a.sprite.x, a.sprite.y);
        if (v === a.inView) return;
        a.inView = v;
        a.sprite.setVisible(v);
      });
      this.npcs.forEach(function (n) {
        var v = inView(n.img.x, n.img.y);
        if (v === n.inView) return;
        n.inView = v;
        n.img.setVisible(v && !n.hidden);   // v2.0：沒出現的 NPC（石虎寶寶）一直藏著
        n.mark.setVisible(v && !!n.markOn);
        (n.tw || []).forEach(function (t) { if (v) t.resume(); else t.pause(); });
      });
      // v0.8：鏡頭外的燈光隱藏、暫停呼吸動畫
      (this.glows || []).forEach(function (g) {
        var r = g.displayWidth / 2, v = g.x + r >= x0 && g.x - r <= x1 && g.y + r >= y0 && g.y - r <= y1;
        if (v === g.__inView) return;
        g.__inView = v;
        g.setVisible(v);
        (g.__fgCopies || []).forEach(function (p) { p.setVisible(v); });
        if (g.__tw) { if (v) g.__tw.resume(); else g.__tw.pause(); }
      });
      if (this.fgBuckets) {
        var FB = BUCKET * T, fon = {}, fkeys = [];
        for (var fy = Math.floor(y0 / FB); fy <= Math.floor(y1 / FB); fy++) for (var fx = Math.floor(x0 / FB); fx <= Math.floor(x1 / FB); fx++) { fon[fx + ',' + fy] = true; fkeys.push(fx + ',' + fy); }
        var fkey = fkeys.join(';');
        if (fkey !== this.fgBucketKey) {
          this.fgBucketKey = fkey;
          var fb = this.fgBuckets;
          Object.keys(fb).forEach(function (k) { var v = !!fon[k]; fb[k].forEach(function (o) { if (o.visible !== v) o.setVisible(v); }); });
        }
      }
      if (this.buckets) {
        var B = BUCKET * T, on = {}, keys = [];
        for (var by = Math.floor(y0 / B); by <= Math.floor(y1 / B); by++) for (var bx = Math.floor(x0 / B); bx <= Math.floor(x1 / B); bx++) { on[bx + ',' + by] = true; keys.push(bx + ',' + by); }
        var key = keys.join(';');
        if (key !== this.bucketKey) {
          this.bucketKey = key;
          var self = this;
          Object.keys(this.buckets).forEach(function (k) {
            var v = !!on[k];
            self.buckets[k].forEach(function (o) {
              // 地面（在圖層裡）只切換顯示；樹冠、屋頂等要和角色排序的，直接拿出／放回畫面清單，排序時就不用排它們
              if (o.__ground) { if (o.visible !== v) o.setVisible(v); }
              else if (v && !o.displayList) o.addToDisplayList();
              else if (!v && o.displayList) o.removeFromDisplayList();
            });
          });
        }
      }
    }

    /** 效能數據（測試用）：畫面上的物件數、看得見的怪物數 */
    perfInfo() {
      var shown = 0;
      this.children.list.forEach(function (o) { if (o.visible) shown++; });
      return {
        objects: this.children.list.length, visibleObjects: shown,
        monsters: this.monsters.length, monstersInView: this.monsters.filter(function (m) { return m.inView !== false && m.active; }).length,
        bigMap: this.bigMap, chunks: this.bgChunks ? this.bgChunks.length : 0, maxTex: this.maxTex(), size: [this.size.w, this.size.h]
      };
    }

    checkEncounter() {
      if (G().inEnding) return;   // v4.2 大結局過場（主角自動走路）不遇怪
      var px = this.player.x, py = this.player.y;
      for (var i = 0; i < this.monsters.length; i++) {
        var m = this.monsters[i];
        if (!m.active || !m.sprite) continue;
        var dx = m.sprite.x - px, dy = m.sprite.y - py;
        var near = Math.abs(dx) < T * 0.65 && Math.abs(dy) < T * 0.65;
        // v0.9.3 最終頭目：孩子選了「明天再來」之後，要先離開一下才會再問
        if (m.waitLeave) { if (Math.abs(dx) > T * 1.5 || Math.abs(dy) > T * 1.5) m.waitLeave = false; continue; }
        if (near) { this.startBattle(m); return; }
      }
    }

    startBattle(mob) {
      var self = this, g = G();
      this.p.path = []; this.p.pending = null;
      this.p.moving = false;
      this.player.setPosition(this.p.tx * T + T / 2, this.p.ty * T + T);
      this.player.anims.stop();
      this.encounterCooldown = Infinity;
      // v0.9.3（老闆核准）最終頭目戰前先看今天還剩多少時間（剩 25 分鐘以上直接進場；10～25 分鐘讓孩子選；不到 10 分鐘明天再來）
      if (mob.boss && g.isFinalBoss(mob.mon, this.map) && !mob.gateOk) {
        J.HUD.prompt(null);
        g.finalBossGate().then(function (ok) {
          if (!self.sys || !self.sys.isActive()) return;
          if (ok) { mob.gateOk = true; self.startBattle(mob); mob.gateOk = false; return; }
          mob.waitLeave = true;
          self.encounterCooldown = self.time.now + 800;
        });
        return;
      }
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
        // v0.9.5 mark：有委託可以接（'new'）或可以回報（'ready'）→ 小地圖、放大地圖畫「！」（和頭頂的記號同一個判斷 G.npcMarker）
        npcs: this.npcs.filter(function (n) { return !n.data.virtual && !n.hidden; }).map(function (n) { var mk = g.npcMarker(n.data); return { id: n.data.id, name: g.speaker(n.data.id).name, x: n.data.x, y: n.data.y, mark: mk ? (mk === 'ready' || mk === 'proverb' ? mk : 'new') : null }; }),
        exits: (this.map.exits || []).map(function (e) { return { x: e.x, y: e.y, to: e.to, name: (g.data.maps[e.to] || {}).name || e.to }; }),
        shops: (this.signs || []).map(function (s) { return { kind: s.spot.kind, text: s.spot.text, x: s.spot.npcX, y: s.spot.npcY }; }),
        station: this.station ? { x: this.station.x, y: this.station.y, name: this.station.name } : null,
        places: J.MapInfo.placeLabels(this.map),   // v0.9.5 放大地圖上寫地點名稱（金包里慈護宮等）
        chests: this.chests.map(function (c) { return { x: c.data.x, y: c.data.y, open: !!g.state.chests[c.data.id] }; }),
        monsters: this.monsters.filter(function (m) { return m.active; }).map(function (m) { return { id: m.id, x: m.tx, y: m.ty, boss: m.boss }; })
      };
    }

    /**
     * v0.9.5 媽祖的祝福（在神像前轉職）：金色光柱從上方灑在主角身上、光芒旋轉、四周冒出光點（約 1.6 秒）。
     * 不閃爍刺眼（亮度柔和、沒有快速明暗交替）。G.blessCount 測試用
     */
    blessFx() {
      var self = this, x = this.player.x, y = this.player.y - T * 0.8;
      G().blessCount = (G().blessCount || 0) + 1;
      var glow = this.add.image(x, y, this.glowTexture('#ffe08a')).setBlendMode(Phaser.BlendModes.ADD).setDepth(62000).setScale(0.2).setAlpha(0);
      this.tweens.add({ targets: glow, scale: 3.2, alpha: { from: 0.95, to: 0 }, duration: 1600, ease: 'Sine.out', onComplete: function () { glow.destroy(); } });
      // 光柱
      var beam = this.add.rectangle(x, y - T * 3, T * 1.6, T * 7, 0xfff2b0, 0.55).setBlendMode(Phaser.BlendModes.ADD).setDepth(62001).setScale(0.2, 1);
      this.tweens.add({ targets: beam, scaleX: 1, alpha: { from: 0.6, to: 0 }, duration: 1500, ease: 'Sine.inOut', onComplete: function () { beam.destroy(); } });
      // 旋轉的光芒（8 道）
      var rays = this.add.graphics({ x: x, y: y }).setDepth(62002).setBlendMode(Phaser.BlendModes.ADD);
      rays.fillStyle(0xffe9a0, 0.5);
      for (var i = 0; i < 8; i++) {
        var a = i * Math.PI / 4, a1 = a - 0.09, a2 = a + 0.09, R = T * 3;
        rays.fillTriangle(0, 0, Math.cos(a1) * R, Math.sin(a1) * R, Math.cos(a2) * R, Math.sin(a2) * R);
      }
      rays.setScale(0.3);
      this.tweens.add({ targets: rays, angle: 90, scale: 1.2, alpha: { from: 0.9, to: 0 }, duration: 1600, ease: 'Sine.out', onComplete: function () { rays.destroy(); } });
      [0, 250, 500].forEach(function (d) { self.time.delayedCall(d, function () { if (self.player) self.sparkle(self.player.x, self.player.y - T, 0xffe08a); }); });
      if (this.statueImg) this.tweens.add({ targets: this.statueImg, alpha: { from: 1, to: 0.75 }, duration: 400, yoyo: true });
    }

    /** 小地圖點 NPC：在遊戲畫面閃一下那個位置 */
    flashAt(x, y) {
      this.sparkle(x * T + T / 2, y * T + T / 2, 0x7be0ff);
      var ring = this.add.circle(x * T + T / 2, y * T + T / 2, T * 0.8).setStrokeStyle(3, 0xffd34d).setDepth(61000);
      this.tweens.add({ targets: ring, scale: 1.6, alpha: 0, duration: 450, repeat: 3, onComplete: function () { ring.destroy(); } });
    }

    onWake(data) {
      this.cameras.main.fadeIn(250, 0, 0, 0);
      if (J.Ambience) J.Ambience.battle(false);   // v3.0.1（86 號 #7）環境音 1.0 秒淡入
      this.encounterCooldown = this.loopNow() + 2000;   // v4.2.2 DEF-01：場景剛醒來，this.time.now 還停在開戰時
      if (data.mob) this.monsterRunAway(data.mob, data.result === 'win');
      this.refreshMarkers();
      this.updateLamps();
    }
  }

  window.JQ = window.JQ || {};
  window.JQ.MapScene = MapScene;
})();
