/*
 * 遊戲流程控制：標題 → 建角／讀檔 → 地圖、對話、委託、寶箱、戰鬥、商店、旅店、轉職、存檔、遊玩時間
 * 規則都在 src/systems/*（可在 node 測試）；這裡只負責把規則接到畫面上。
 */
(function () {
  'use strict';
  var J = window.JQ;
  var SLOT = 'main';

  var C = J.CONFIG;
  var G = {
    state: null, data: null, questions: [], provider: null, phaser: null, mapScene: null, busy: false,
    held: {}, heldOrder: [], tickTimer: 0, lastSave: 0, npcIndex: {}, battleCtx: null,
    joy: { dir: null, force: 0 },
    // 開發者模式（碰撞格子疊圖，會看到寶箱位置）：只在本機開啟（localhost、127.0.0.1、file://）；正式網站帶了參數也不開
    DEBUG: /[?&]debug=1\b/.test(location.search) && (location.protocol === 'file:' || /^(localhost|127\.0\.0\.1|\[::1\]|::1)$/.test(location.hostname)),
    BIGPILOT: /[?&]debug=bigpilot\b/.test(location.search),   // v0.5：試做大地圖（art_src/bigpilot）暫時取代 M02
    // 測試用：把最大貼圖尺寸調小（例如 ?maxtex=1024），檢查大背景自動切塊
    MAX_TEX_OVERRIDE: (function () { var m = /[?&]maxtex=(\d+)/.exec(location.search); return m ? Math.max(256, Number(m[1])) : 0; })(),
    mapLoadLog: []   // 地圖背景載入時間紀錄（debug.mapLoadLog()）
  };

  // ---------------------------------------------------------------- 啟動
  G.boot = function () {
    G.data = J.World.fromWindow(window);
    if (G.BIGPILOT && J.BigPilot) J.BigPilot.load(G);
    var norm = J.Answer.normalizeQuestions(window.QUESTIONS || []);
    G.questions = norm.valid;
    if (norm.invalid.length) console.warn('[題庫] 有 ' + norm.invalid.length + ' 題格式不對，已略過：', norm.invalid.slice(0, 5));
    var warn = J.World.validate(G.data);
    if (warn.length) console.warn('[世界資料] ' + warn.length + ' 則提醒：', warn.slice(0, 10));
    Object.keys(G.data.maps).forEach(function (mid) {
      (G.data.maps[mid].npcs || []).forEach(function (n) { G.npcIndex[n.id] = { npc: n, map: mid }; });
    });
    var storage = null;
    try { storage = window.localStorage; storage.getItem('bq_save'); } catch (e) { storage = null; }
    if (!storage) {   // 瀏覽器封鎖網站資料時：改用記憶體（關掉就沒了），提醒用存檔碼備份
      var mem = {};
      storage = { getItem: function (k) { return k in mem ? mem[k] : null; }, setItem: function (k, v) { mem[k] = String(v); }, removeItem: function (k) { delete mem[k]; }, _m: mem };
      setTimeout(function () { J.UI.toast('這台裝置無法存檔，請用存檔碼備份進度。', 6000); }, 1500);
    }
    J.SaveProvider.migrateLegacyKeys(storage);   // 舊 key「jinshan-quest-save」→「bq_save」
    G.provider = new J.SaveProvider.LocalSaveProvider(storage);
    // 請瀏覽器把本站資料標成「持久保存」，降低存檔被自動清除的機會（不支援或被拒絕都不影響遊戲）
    try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(function () {}); } catch (e) { /* 忽略 */ }
    J.UI.init();
    J.HUD.init({
      journal: function () { if (!G.blocked()) J.Menus.journal(G); },
      quests: function () { if (!G.blocked()) J.Menus.questList(G); },
      bag: function () { if (!G.blocked()) J.Menus.bag(G); },
      settings: function () { if (!G.blocked()) J.Settings.open(G); },
      joystick: function (dir, force) { G.joy = { dir: dir, force: force }; },
      // 在搖桿上「輕點一下」（沒有拖曳）：當作點了搖桿底下的地圖（例如搖桿蓋住的寶箱）
      mapTap: function (cx, cy) { G.lastMapTap = { x: cx, y: cy }; if (G.mapScene && !G.blocked() && !J.UI.isOpen()) G.mapScene.tapAtClient(cx, cy); },
      action: function () { if (G.mapScene && !J.UI.isOpen()) G.mapScene.actionKey(); },
      cancel: function () {
        // B 鍵：有視窗就關掉（同 Esc），沒有就打開背包選單
        if (J.UI.isOpen()) { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); return; }
        if (!G.blocked() && G.state) J.Menus.bag(G);
      }
    });
    document.title = C.GAME_TITLE;
    G.bindKeys();
    G.showTitle();
  };

  G.blocked = function () { return G.busy || (G.battleCtx && !G.battleCtx.over); };

  G.showTitle = function () {
    J.HUD.show(false);
    Promise.all([G.provider.load(SLOT), G.provider.loadError(SLOT)]).then(function (r) {
      var s = r[0], err = r[1];
      var titleHandle = J.Title.show({
        summary: s ? { name: s.player.name, level: s.player.level, job: s.player.job } : null,
        loadError: s ? '' : err, migrated: !!(s && s.migratedFrom),
        onContinue: function () { G.state = s; G.startWorld(false); },
        onNew: function (name, gender) { G.newGame(name, gender); },
        onImport: function (code) {
          return J.SaveCode.importAny(code).then(function (res) {
          if (!res.ok) return res.error;
          // 本機已經有存檔時，先確認才取代（審查 F-13）；取消就什麼都不動
          var ask = s ? J.UI.confirm('這會取代目前的存檔（等級 ' + s.player.level + '、名字 ' + s.player.name + '），確定嗎？', '確定取代', '取消')
            : Promise.resolve(true);
          return ask.then(function (yes) {
            if (!yes) return '已取消，原本的存檔沒有變動。';
            G.state = res.state;
            G.save(true);
            G.startWorld(false);
            return '';
          });
          });
        }
      });
      G.titleHandle = titleHandle;
      // 標題曲（還沒點畫面解鎖聲音時，music.js 會記住、解鎖後自動開始）；存檔裡關掉音樂就不播
      // 存檔裡關掉音樂：標題畫面就先關（music.js 不會下載任何音樂檔）
      if (s && s.settings && s.settings.music === false) { if (G.musicReady()) { try { window.JQ.Music.setEnabled(false); } catch (e) { /* 忽略 */ } } }
      else G.bgm('title');
      G.checkLoadLink(s);
    });
  };

  /** 把網址上的 #load=… 拿掉（避免重新整理又跳出來；也不讓存檔碼留在瀏覽紀錄的網址列） */
  G.clearLoadHash = function () {
    try { history.replaceState(null, '', location.href.split('#')[0]); } catch (e) { try { location.hash = ''; } catch (x) { /* 忽略 */ } }
  };

  /**
   * 掃 QR Code 開啟的網址：<遊戲網址>#load=<存檔碼>
   * 先驗證存檔碼；本機已有存檔時說明會取代哪一份，按「讀取」才覆蓋，取消就什麼都不動。
   */
  G.checkLoadLink = function (local) {
    var code = J.SaveCode.parseHash(location.hash);
    if (!code) return;
    G.clearLoadHash();   // 先清掉網址上的存檔碼：就算存檔碼有問題讓頁面卡住，重新整理也不會再讀一次
    J.SaveCode.importAny(code).then(function (res) {
      if (!res.ok) { G.clearLoadHash(); J.UI.toast('QR Code 存檔讀不出來：' + res.error + '（原本的存檔沒有變動）', 6000); return; }
      var p = res.state.player;
      var msg = '要讀取這個 QR Code 的存檔嗎？（名字 ' + p.name + '、等級 ' + p.level + '）' +
        (local ? '這會取代目前的存檔（等級 ' + local.player.level + '、名字 ' + local.player.name + '）。' : '');
      J.UI.confirm(msg, '讀取存檔', '取消').then(function (yes) {
        G.clearLoadHash();
        if (!yes) { J.UI.toast('已取消，原本的存檔沒有變動。'); return; }
        J.Audio.unlock();   // 按鈕是使用者手勢：順便解鎖 iPad 音效
        G.state = res.state;
        G.save(true);
        if (G.titleHandle) G.titleHandle.close(true);
        G.startWorld(false);
      });
    });
  };

  G.newGame = function (name, gender) {
    var st = J.State.createNewState(name, gender, Date.now());
    var m1 = G.data.maps.M01 ? 'M01' : Object.keys(G.data.maps)[0];
    var map = G.data.maps[m1];
    var start = map.start || { x: 2, y: 2 };
    st.mapDims = J.MapInfo.currentDims(G.data.maps);   // 新遊戲的座標就是目前地圖的座標
    st.location = { map: m1, x: start.x, y: start.y };
    if (map.inn) st.lastInn = { map: m1, x: map.inn.x, y: map.inn.y + 1 };
    else st.lastInn = { map: m1, x: start.x, y: start.y };
    G.state = st;
    G.startWorld(true);
  };

  G.startWorld = function (isNew) {
    var st = G.state;
    J.Daily.ensure(st.daily, Date.now());
    J.Character.clampVitals(st, G.data);
    // v0.5：地圖放大後，舊存檔的位置（location、lastInn）換算到新地圖最近能站的格子
    var moved = J.MapInfo.migrateCoords(st, G.data.maps, G.data.tilesets);
    if (moved.length) console.info('[存檔] 地圖尺寸改變，位置已換算：', moved);
    // v0.7：上次在戰鬥中關掉或重新整理 → 存檔裡還有沒結算的經驗值，現在結算（進地圖後再顯示升級）
    G.pendingLevelUp = J.Session.settlePlayerExp(st);
    G.applySettings(true);
    G.save(true);
    J.HUD.show(true);
    G.refreshHud();
    setTimeout(G.onResize, 50);   // HUD 出現後量它的高度（直向時畫面貼在 HUD 下面）
    var loc = st.location && G.data.maps[st.location.map] ? st.location : { map: 'M01', x: undefined, y: undefined };
    G.ensurePhaser(function () {
      G.phaser.scene.start('Map', { mapId: loc.map, x: loc.x, y: loc.y });
    });
    G.pendingIntro = !!isNew;
    if (G.tickTimer) clearInterval(G.tickTimer);
    G.tickTimer = setInterval(G.tick, 1000);
    if (J.Playtime.isOverLimit(st.playtime, st.settings, Date.now())) setTimeout(function () { J.Settings.limitScreen(G); }, 600);
  };

  G.ensurePhaser = function (cb) {
    if (G.phaser) { cb(); return; }
    var portrait = G.layoutMode();
    var z = G.zoomPlan();
    G.phaser = new Phaser.Game({
      type: Phaser.AUTO, parent: 'game', width: C.VIEW_W, height: C.VIEW_H, pixelArt: true, roundPixels: true,
      backgroundColor: '#0e1430', banner: false, audio: { noAudio: true },
      input: { keyboard: false },
      // v0.9 直向：畫面放大到滿寬、貼在 HUD 下面（以前置中，上面空了一大塊）
      scale: z.integer ? { mode: Phaser.Scale.NONE, zoom: z.zoom, autoCenter: Phaser.Scale.CENTER_BOTH }
        : { mode: Phaser.Scale.FIT, autoCenter: portrait ? Phaser.Scale.CENTER_HORIZONTALLY : Phaser.Scale.CENTER_BOTH },
      scene: []
    });
    G.phaser.scene.add('Map', J.MapScene, false);
    G.phaser.scene.add('Battle', J.BattleScene, false);
    window.addEventListener('resize', G.onResize);
    G.phaser.events.once('ready', cb);
  };

  /**
   * 放大方式：能用整數倍又不浪費太多畫面時用整數倍（像素一樣大）；
   * 否則用等比例填滿（FIT），避免在 1.8 倍這類視窗留下一大圈黑邊。
   */
  G.zoomPlan = function () {
    var f = Math.min(window.innerWidth / C.VIEW_W, window.innerHeight / C.VIEW_H);
    var n = Math.floor(f);
    if (G.isPortrait()) return { integer: false, zoom: 1 };   // 直向一律等比例放大到滿寬
    return { integer: n >= 1 && f - n < 0.2, zoom: Math.max(1, n) };
  };
  G.isPortrait = function () { return window.innerHeight > window.innerWidth * 1.05; };
  /** 直向（平板直拿）：body.portrait，畫面貼在 HUD 下面；記下 HUD 高度給 CSS 用 */
  G.layoutMode = function () {
    var portrait = G.isPortrait();
    document.body.classList.toggle('portrait', portrait);
    var hud = document.getElementById('hud');
    if (hud && !hud.hidden && hud.offsetHeight) document.documentElement.style.setProperty('--hud-h', hud.offsetHeight + 'px');
    return portrait;
  };
  G.onResize = function () {
    var portrait = G.layoutMode();
    if (!G.phaser || !G.phaser.scale) return;
    var sc = G.phaser.scale, z = G.zoomPlan();
    if (sc.scaleMode === Phaser.Scale.NONE && z.integer) sc.setZoom(z.zoom);
    if (sc.scaleMode === Phaser.Scale.FIT) {
      var want = portrait ? Phaser.Scale.CENTER_HORIZONTALLY : Phaser.Scale.CENTER_BOTH;
      if (sc.autoCenter !== want) { sc.autoCenter = want; }
      sc.refresh();
    }
  };

  // ---------------------------------------------------------------- 共用
  G.stats = function () { return J.Character.stats(G.state, G.data); };
  G.refreshHud = function () { if (G.state) J.HUD.update(G.state, G.stats()); };
  /** 戰鬥進行中（還沒結束）？ */
  G.inBattle = function () { return !!(G.battleCtx && !G.battleCtx.over && !G.battleCtx.won); };   // 打贏（won）之後就可以存檔
  /**
   * 存檔。v0.9 老闆指示「非戰鬥時間才可存檔」：戰鬥中（自動存檔、答題、怪物攻擊、離開頁面…）一律不寫入，
   * 戰鬥結束（G.bend）才寫。戰鬥中途重新整理 → 回到戰鬥前的狀態（這場答題的金幣、經驗值都還沒寫入，不會重複拿）。
   */
  G.save = function (force) {
    if (!G.state) return Promise.resolve();
    if (G.inBattle()) { G.saveSkipped = (G.saveSkipped || 0) + 1; return Promise.resolve(false); }
    G.lastSave = Date.now();
    return G.provider.save(SLOT, G.state).catch(function (e) { J.UI.toast('存檔失敗：' + e.message); });
  };
  G.applySettings = function () {
    var s = G.state.settings;
    J.Audio.setEnabled(s.sound !== false);
    J.TTS.setEnabled(s.tts !== false);
    // v0.9.3：音量「小／中／大」、語速預設「稍快」、家長選的語音（數值見 state.js 的 AUDIO）
    var A = J.State.AUDIO;
    J.Voice.configure({ volume: A.voiceVolume(s), rateMult: A.voiceSpeed(s), pref: s.voiceLang || 'taigi', voiceName: s.voiceName || '',
      allowCloud: s.voiceCloud !== false, playerName: G.state.player.name || '' });   // 雲端語音念的文字會把這個名字換成「勇者」
    J.HUD.setTouchMode(s.touchControls || 'auto');
    if (G.musicReady()) {
      try { window.JQ.Music.setEnabled(s.music !== false); window.JQ.Music.setVolume(A.musicVolume(s)); } catch (e) { /* 忽略 */ }
    }
    if (G.limitHandle && !J.Playtime.isOverLimit(G.state.playtime, s, Date.now())) { G.limitHandle.close(true); G.limitHandle = null; }
  };
  G.resume = function () { };

  // ---------------------------------------------------------------- 音樂（作曲家的 music.js；還沒完成時安全略過）
  /** JQ.Music 有沒有載入（API：playBgm(id)、stopBgm(ms)、jingle(id,onEnd)、setVolume、setEnabled） */
  G.musicReady = function () { return typeof window.JQ.Music !== 'undefined' && !!window.JQ.Music && typeof window.JQ.Music.playBgm === 'function'; };
  G.musicLog = [];   // 測試用：遊戲要求播過哪些音樂
  G.bgm = function (id) {
    G.musicLog.push('bgm:' + id);
    G.currentBgm = id;
    if (!G.musicReady() || (G.state && G.state.settings.music === false)) return;
    // v0.9.3 還沒讀存檔（標題畫面）時也用新的預設音量「中」
    if (!G.state) { try { window.JQ.Music.setVolume(J.State.AUDIO.MUSIC_VOL.mid); } catch (e) { /* 忽略 */ } }
    try { window.JQ.Music.playBgm(id); } catch (e) { /* 音樂出錯不影響遊戲 */ }
  };
  G.stopBgm = function (ms) { if (G.musicReady()) { try { window.JQ.Music.stopBgm(ms || 300); } catch (e) { /* 忽略 */ } } };
  /**
   * 短曲（勝利、升級、委託完成、旅店休息、珍貴道具、點燈、累倒、開寶箱、結局）。
   * 沒有 music.js 時改播音效 fallback；onEnd 一定會被呼叫（最多等 maxMs）。
   */
  G.jingle = function (id, onEnd, fallback, maxMs) {
    G.musicLog.push('jingle:' + id);
    var called = false;
    var done = function () { if (called) return; called = true; if (onEnd) onEnd(); };
    var useMusic = G.musicReady() && !(G.state && G.state.settings.music === false) && typeof window.JQ.Music.jingle === 'function';
    if (useMusic) {
      try { window.JQ.Music.jingle(id, done); } catch (e) { useMusic = false; }
    }
    if (!useMusic) { if (fallback) J.Audio.play(fallback); setTimeout(done, Math.min(maxMs || 1500, 1500)); }
    else setTimeout(done, maxMs || 9000);   // 保險：music.js 沒呼叫 onEnd 時也會繼續
  };
  G.heroKey = function () { return J.Assets.heroKey(G.state.player.gender, G.state.player.job); };

  /** 說話的人：名字與頭像 sprite */
  G.speaker = function (who) {
    var SP = window.SPEAKERS || {};
    var name = SP[who] !== undefined ? SP[who] : null;
    var sprite = null;
    if (who === 'hero' || who === 'player') { name = G.state.player.name; sprite = G.heroKey(); }
    else if (who === 'pet') { name = name || '番薯仔'; sprite = 'pet_imo'; }
    else if (who === 'narrator') { name = ''; }
    else if (/^animal:/.test(who)) { name = who.slice(7); sprite = G.animalSprite || null; }   // v0.9.3 會走動的動物（黃牛）
    // v0.9.3 B14：旅店老闆的稱呼以 SPEAKERS 為準（例：「樹屋旅店老闆娘」）
    else if (who === '__inn') { name = J.MapInfo.innKeeperName(G.mapScene && G.mapScene.map, G.data.dialogs, SP); sprite = 'npc_innkeeper'; }
    else if (/^inn_/.test(who) && !G.npcIndex[who]) { sprite = 'npc_innkeeper'; }
    else if (G.npcIndex[who]) { sprite = G.npcIndex[who].npc.sprite; name = name || G.npcIndex[who].npc.name || who; }
    else if (G.data.monsters[who]) { sprite = G.data.monsters[who].sprite; name = name || G.data.monsters[who].name; }
    if (name === null) name = who;
    return { name: J.UI.fill(name, G.state && G.state.player.name), sprite: sprite };
  };

  /** 播放 dialogs.js 的一段對話；找不到時用 fallback 句子 */
  G.say = function (id, fallback) {
    var D = G.data.dialogs || {};
    var lines = (id && D[id]) || fallback || [];
    G.busy = true;
    var s = G.state.settings;
    return J.UI.dialog(lines, {
      speaker: G.speaker, playerName: G.state.player.name, playerGender: G.state.player.gender, taigiSub: s.taigiSub,
      tts: s.tts !== false, voiceAuto: s.voiceAuto !== false, dialogId: (id && D[id]) ? id : null
    }).then(function () { G.busy = false; });
  };

  /** 職業公會所在地圖的名字（jobs.js 的 JOB_RULES.change_map） */
  G.jobMapName = function () {
    var id = G.data.jobRules && G.data.jobRules.change_map;
    return (id && G.data.maps[id] && G.data.maps[id].name) || '城裡';
  };
  /** 有五盞燈的地圖名字 */
  G.lampMapName = function () {
    var ids = Object.keys(G.data.maps).filter(function (k) { return G.data.maps[k].lamps; });
    return ids.length ? G.data.maps[ids[0]].name : '村子';
  };

  G.coef = function (mapId) { var m = G.data.maps[mapId || (G.mapScene && G.mapScene.mapId)]; return J.World.mapCoef(m ? m.level : 1); };

  /** 答對後：升級、補滿、提示 */
  G.afterReward = function (levels) {
    G.refreshHud();
    if (levels > 0) {
      J.Character.onLevelUp(G.state, G.data);
      G.jingle('levelup', null, 'levelup');
      J.UI.banner('等級提升！現在是 ' + G.state.player.level + ' 級');
      var unlock = (G.data.jobRules && G.data.jobRules.unlock_level) || 5;
      if (G.state.player.level >= unlock && G.state.player.level - levels < unlock) J.UI.toast('可以到' + G.jobMapName() + '的職業公會轉職了！', 4000);
      G.refreshHud();
    }
  };

  // ---------------------------------------------------------------- 地圖
  G.onMapReady = function (scene) {
    G.mapScene = scene;
    G.mapChanging = 0;
    if (G.pendingChange) { var pc = G.pendingChange; G.pendingChange = null; setTimeout(function () { G.changeMap(pc[0], pc[1], pc[2], pc[3]); }, 0); }
    if (G.pendingLevelUp > 0) { var plv = G.pendingLevelUp; G.pendingLevelUp = 0; setTimeout(function () { G.afterReward(plv); }, 800); }
    var st = G.state, map = scene.map;
    st.location = { map: scene.mapId, x: scene.p.tx, y: scene.p.ty };
    st.visited[scene.mapId] = true;
    if (map.inn) {
      var w = function (x, y) { return scene.walkable(x, y); };
      var spot = w(map.inn.x, map.inn.y + 1) ? { c: map.inn.x, r: map.inn.y + 1 } : J.Pathfind.nearestWalkable(w, scene.size.w, scene.size.h, { c: map.inn.x, r: map.inn.y }, null);
      if (spot) J.Character.setInn(st, scene.mapId, spot.c, spot.r);
    }
    J.HUD.mapBanner(J.MapInfo.nameWithLevel(map, scene.mapId));   // v0.9.3 地名＋建議等級「擎天草原 Lv1–4」
    G.bgm(J.MapInfo.bgmFor(map));
    if (J.Minimap) J.Minimap.attach(G, scene);
    G.refreshHud();
    G.save();
    if (G.pendingIntro) {
      G.pendingIntro = false;
      setTimeout(function () { G.say('D_INTRO', [{ who: 'pet', text: '我是番薯仔！我們一起把光找回來吧！' }]).then(function () { J.UI.toast('找頭上有「！」的人說話吧！', 4000); }); }, 400);
    }
  };

  G.changeMap = function (to, x, y, facing) {
    if (!G.data.maps[to]) { console.warn('[地圖] 不存在：' + to); return; }
    J.UI.closePassMove();   // v0.9.3 開著放大地圖走到出口：換地圖前把舊地圖關掉
    G.state.location = { map: to, x: x, y: y };
    G.save();
    var sc = G.mapScene;
    // 上一次換地圖還沒完成（場景重新開始、圖檔還在載入）：等它好了（onMapReady）再換，避免同一張圖被兩個載入器同時載入
    if (G.mapChanging && Date.now() - G.mapChanging < 20000) { G.pendingChange = [to, x, y, facing]; return; }
    if (sc && sc.load && sc.load.isLoading && sc.load.isLoading()) { G.pendingChange = [to, x, y, facing]; return; }
    G.mapChanging = Date.now();
    sc.scene.restart({ mapId: to, x: x, y: y, facing: facing });
  };

  // ---------------------------------------------------------------- 鍵盤與方向
  G.bindKeys = function () {
    var MAP = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', w: 'up', s: 'down', a: 'left', d: 'right', W: 'up', S: 'down', A: 'left', D: 'right' };
    window.addEventListener('keydown', function (e) {
      var tag = e.target && e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      // v0.9.3 放大地圖（passMove 視窗）開著時方向鍵照樣能走；其他視窗開著時不動
      if (J.UI.blocksMove()) return;
      if (MAP[e.key]) { G.setHeld(MAP[e.key], true); e.preventDefault(); }
      else if (J.UI.isOpen()) return;
      else if ((e.key === 'z' || e.key === 'Z' || e.key === ' ' || e.key === 'Enter') && (tag !== 'BUTTON')) {
        if (G.mapScene && G.state) { e.preventDefault(); G.mapScene.actionKey(); }
      }
    });
    window.addEventListener('keyup', function (e) { if (MAP[e.key]) G.setHeld(MAP[e.key], false); });
    window.addEventListener('blur', function () { G.held = {}; G.heldOrder = []; });
  };
  G.setHeld = function (d, on) {
    G.held[d] = on;
    G.heldOrder = G.heldOrder.filter(function (x) { return x !== d; });
    if (on) G.heldOrder.push(d);
  };
  G.heldDir = function () {
    if (G.joy.dir) return G.joy.dir;
    for (var i = G.heldOrder.length - 1; i >= 0; i--) if (G.held[G.heldOrder[i]]) return G.heldOrder[i];
    return null;
  };
  /** 移動速度倍率：搖桿推越遠走越快（0.7～1.25 倍）；鍵盤、點擊是 1 倍 */
  G.moveSpeed = function () {
    if (!G.joy.dir) return 1;
    return 0.55 + 0.7 * Math.max(0, Math.min(1, G.joy.force));
  };

  // ---------------------------------------------------------------- NPC 與委託
  function npcRole(npc, map) {
    if (npc.virtual) return { role: 'inn', info: map.inn };
    if (map.inn && map.inn.npc === npc.id) return { role: 'inn', info: map.inn };
    if (map.shop && map.shop.npc === npc.id) return { role: 'shop', info: map.shop };
    var ex = (map.extra_shops || []).filter(function (s) { return s.npc === npc.id; })[0];
    if (ex) return { role: 'shop', info: ex };
    if (npc.id === ((G.data.jobRules && G.data.jobRules.change_npc) || 'guild')) return { role: 'guild' };
    if (npc.role === 'travel' || npc.travel) return { role: 'travel' };
    return { role: 'quest' };
  }
  function questIds(npc) { return npc.quests && npc.quests.length ? npc.quests : (npc.quest ? [npc.quest] : []); }

  /** NPC 頭上的記號：'bang'（有新委託）、'ready'（可以回報）、null */
  G.npcMarker = function (npc) {
    if (npc.virtual) return null;
    var f = J.QuestLog.forNpc(G.state, G.data.quests, npc.id, questIds(npc));
    if (!f) return null;
    if (f.status === 'available') return 'bang';
    var q = G.data.quests[f.id];
    if (J.QuestLog.canComplete(G.state, G.data.quests, f.id, G.data)) return 'ready';
    if ((q.kind || 'help') === 'help') return 'bang';
    return null;
  };

  G.talkTo = function (npc, scene) {
    if (G.blocked()) return;
    var map = scene.map, st = G.state, Q = G.data.quests;
    var r = npcRole(npc, map);
    var ids = questIds(npc);
    var f = ids.length ? J.QuestLog.forNpc(st, Q, npc.id, ids) : null;
    // 旅店、商店老闆如果也有委託，先處理委託
    if (f && r.role !== 'quest') r = { role: 'quest' };
    if (r.role === 'inn') { G.say(J.MapInfo.innDialog(map, npc), [{ who: npc.id, text: '歡迎！休息一下，體力就會全滿喔。' }]).then(function () { J.Menus.inn(G, scene.mapId, r.info).then(function (ok) { if (ok) G.innRest().then(function () { G.say('D_INN_REST', []); }); }); }); return; }
    if (r.role === 'shop') { G.say(npc.dialog, []).then(function () { J.Menus.shop(G, r.info.shop_id || 'general'); }); return; }
    if (r.role === 'travel') { G.say(npc.dialog, [{ who: npc.id, text: '要搭車去哪裡呢？' }]).then(function () { G.openWorldMap(); }); return; }
    if (r.role === 'guild') {
      var unlock = (G.data.jobRules && G.data.jobRules.unlock_level) || 5;
      if (st.player.level >= unlock) G.say((G.data.jobRules && G.data.jobRules.dialog_open) || 'D_GUILD_JOB', []).then(function () { J.Menus.guild(G); });
      else G.say(npc.dialog || 'D_GUILD_IDLE', [{ who: npc.id, text: '到 ' + unlock + ' 級，就能來這裡選職業喔。' }]);
      return;
    }
    if (f && f.status === 'active') {
      var q = Q[f.id];
      if (J.QuestLog.canComplete(st, Q, f.id, G.data)) { G.completeQuest(f.id, scene); return; }
      if ((q.kind || 'help') === 'help') {
        var p = J.QuestLog.progress(st, Q, f.id, G.data);
        J.UI.confirm('「' + q.title + '」：' + p.text + '。要繼續幫忙嗎？', '繼續幫忙', '等一下').then(function (y) { if (y) G.runHelp(f.id, npc, scene); });
        return;
      }
      G.say(null, [{ who: npc.id, text: q.goal || q.title }]).then(function () { J.UI.toast('進度：' + J.QuestLog.progress(st, Q, f.id, G.data).text, 3500); });
      return;
    }
    if (f && f.status === 'available') {
      var q2 = Q[f.id];
      G.say(q2.dialog_start, [{ who: npc.id, text: q2.goal || q2.title }]).then(function () {
        J.QuestLog.accept(st, Q, f.id);
        J.Audio.play('select');
        J.UI.toast('接下委託：「' + q2.title + '」', 3500);
        G.save();
        scene.refreshMarkers();
        if ((q2.kind || 'help') === 'help') G.runHelp(f.id, npc, scene);
        else if (q2.kind === 'boss') { J.UI.toast('目標：' + (q2.goal || ''), 5000); G.respawnBosses(); }
        else if (J.QuestLog.canComplete(st, Q, f.id, G.data)) G.completeQuest(f.id, scene);
      });
      return;
    }
    var locked = J.QuestLog.firstLocked(st, Q, ids);
    var lq = locked && Q[locked];
    G.say(lq && lq.dialog_locked ? lq.dialog_locked : npc.dialog, [{ who: npc.id, text: '你好呀，' + st.player.name + '！' }]);
  };

  /** 接到頭目委託後，讓頭目出現在地圖上（同一張圖時立刻出現） */
  G.respawnBosses = function () {
    var sc = G.mapScene;
    if (!sc || !sc.p) return;   // 地圖還在載入（create 之前）：建好時 buildMonsters 會自己放頭目
    (sc.map.spawns || []).forEach(function (s) {
      if (!(s.boss && s.quest)) return;
      if (sc.monsters.some(function (m) { return m.spawn === s; })) return;
      if (J.QuestLog.status(G.state, G.data.quests, s.quest) !== 'active' || G.state.bosses[s.monster]) return;
      var m = G.data.monsters[s.monster];
      if (!m || !sc.textures.exists(J.Assets.texKey(m.sprite))) { sc.scene.restart({ mapId: sc.mapId, x: sc.p.tx, y: sc.p.ty, facing: sc.p.facing }); return; }
      var mob = { spawn: s, mon: m, id: s.monster, idx: 99, active: false, sprite: null, tx: 0, ty: 0, moving: false, nextMove: 0, respawnAt: 0, boss: true };
      sc.placeMonster(mob, false);
      sc.monsters.push(mob);
    });
  };

  G.completeQuest = function (id, scene) {
    var st = G.state, Q = G.data.quests, q = Q[id];
    var lvl = st.player.level;
    var r = J.QuestLog.complete(st, Q, id, G.data);
    if (!r.ok) return Promise.resolve();
    return G.questDone(id, r, scene, st.player.level - lvl);
  };

  /** 委託完成後的共同處理：結束對話、獎勵提示、光、點燈、每日任務、結局 */
  G.questDone = function (id, r, scene, levels) {
    var st = G.state, q = G.data.quests[id];
    J.Daily.record(st.daily, 'quest').forEach(function (t) { st.player.coins += t.reward; J.UI.toast('每日小任務完成：「' + t.text + '」金幣 +' + t.reward); });
    if (id === 'Q_LAMPS' || (Array.isArray(q.subjects) && scene && scene.map.lamps)) {
      ['國語', '英語', '數學', '自然', '社會'].forEach(function (s) { st.lamps[s] = true; });
      if (scene) scene.updateLamps();
    }
    G.save();
    return G.say(q.dialog_end, []).then(function () {
      var parts = [];
      if (r.reward.gold) parts.push('金幣 +' + r.reward.gold);
      if (r.reward.exp) parts.push('經驗值 +' + r.reward.exp);
      if (r.reward.item) parts.push('得到「' + ((G.data.items[r.reward.item] || {}).name || r.reward.item) + '」');
      G.jingle('quest_clear', null, 'chest');
      J.UI.banner('委託完成：「' + q.title + '」' + (parts.length ? '\n' + parts.join('、') : ''));
      G.afterReward(levels || 0);
      if (r.reward.light) {
        G.jingle('rare_item', null, 'lamp');
        return G.say('D_LIGHT_GET', [{ who: 'pet', text: '拿回了' + r.reward.light + '之光！' }]).then(function () { J.UI.banner('拿回了「' + r.reward.light + '之光」！'); });
      }
    }).then(function () {
      if (q.log_next) J.UI.toast('下一步：' + q.log_next, 6000);
      if (scene && scene.refreshMarkers) scene.refreshMarkers();
      if (q.dialog_ending || id === 'Q_FINAL') return G.ending(q);
    });
  };

  G.ending = function (q) {
    G.state.ending = true;
    G.save();
    if (G.mapScene && G.mapScene.fireworks) G.mapScene.fireworks();
    G.jingle('ending', null, 'win', 20000);
    J.UI.banner('遺忘霧散了！五盞知識燈把大家的知識都照亮了！');
    return G.say(q.dialog_ending || 'D_ENDING', []).then(function () { J.UI.toast('冒險可以繼續：解委託、開寶箱、練習五科！', 6000); });
  };

  /** 答題委託（help）：一題一題問，答完 count 題就完成 */
  G.runHelp = function (id, npc, scene) {
    var st = G.state, Q = G.data.quests, q = Q[id];
    var lr = q.level_range || [1, 4];
    var units = q.units || [];
    var sess = J.Session.create(st, G.questions, J.QuestLog.helpSubject(q, 0), {
      mode: 'free', expMult: G.coef(scene.mapId),
      filter: function (x) { return (!units.length || units.indexOf(x.unit) >= 0) && x.level >= lr[0] && x.level <= lr[1]; }
    });
    function nextQ() {
      if (J.QuestLog.canComplete(st, Q, id, G.data)) { G.completeQuest(id, scene); return; }
      var prog = (st.quests[id] || {}).progress || 0;
      var subj = J.QuestLog.helpSubject(q, prog);
      var qq = J.Session.next(sess, Date.now(), { subject: subj });
      if (!qq) { J.UI.toast('「' + subj + '」的題目還在準備中。'); return; }
      J.Quiz.ask({
        session: sess, mode: 'help', state: st, title: q.title, subtitle: '幫忙 ' + (prog + 1) + '/' + J.QuestLog.helpCount(q) + '・' + G.speaker(npc.id).name,
        speaker: G.speaker(npc.id).name,   // 題目情境的說話者換成委託人（不改題庫）
        onSave: function () { G.save(); },
        onRewards: function (res) { G.refreshHud(); if (res) G.afterReward(res.levelsGained); },
        onDone: function (r) {
          if (r.left) { G.save(); J.UI.toast('先休息一下，隨時可以回來繼續幫忙！'); scene.refreshMarkers(); return; }
          if (!r.correct) return;
          J.QuestLog.recordHelp(st, Q, id);
          if (Array.isArray(q.subjects) && scene.map.lamps && scene.map.lamps.some(function (l) { return l.subject === subj; })) {
            st.lamps[subj] = true;
            scene.updateLamps();
            G.jingle('lamp_lit', null, 'lamp');
            J.UI.banner(subj + '燈亮了！');
          }
          G.save();
          nextQ();
        }
      });
    }
    nextQ();
  };

  // ---------------------------------------------------------------- 寶箱與燈
  G.openChest = function (chest, scene) {
    if (G.blocked()) return;
    var st = G.state;
    if (J.Chests.isOpened(st, chest.id)) { G.say('D_CHEST_DONE', [{ who: 'pet', text: '這個寶箱已經打開過了。' }]); return; }
    var spec = J.Chests.questionSpec(chest);
    G.say('D_CHEST_LOCKED', [{ who: 'pet', text: '寶箱上有數字鎖！答對就能打開。' }]).then(function () {
      var sess = J.Session.create(st, G.questions, spec.subject, { mode: 'free', expMult: G.coef(scene.mapId), filter: J.Chests.isChestQuestion });
      var q = J.Session.next(sess, Date.now(), { forceLevel: spec.level, preferType: spec.preferType });
      if (!q) { J.UI.toast('題目還在準備中。'); return; }
      J.Quiz.ask({
        session: sess, mode: 'chest', state: st, title: '寶箱的數字鎖', subtitle: '答對就能打開（可以一直重試）',
        onSave: function () { G.save(); },
        onRewards: function (res) { G.refreshHud(); if (res) G.afterReward(res.levelsGained); },
        onDone: function (r) {
          if (!r.correct) { G.save(); return; }
          var lvl = st.player.level;
          var o = J.Chests.open(st, chest, G.data.quests, G.data);
          if (!o.ok) return;
          scene.setChestOpen(chest.id);
          G.jingle('chest', null, 'chest');
          var parts = [];
          if (o.gold) parts.push('金幣 +' + o.gold);
          if (o.item) parts.push('得到「' + ((G.data.items[o.item] || {}).name || o.item) + '」');
          J.UI.banner('寶箱打開了！' + (parts.length ? parts.join('、') : ''));
          G.refreshHud();
          G.save();
          o.quests.forEach(function (qr) { G.questDone(qr.id, qr, scene, st.player.level - lvl); });
        }
      });
    });
  };

  /** 車站（maps.js 的 station）：打開世界地圖 */
  G.useStation = function (station) {
    if (G.blocked()) return;
    J.Audio.play('select');
    J.UI.toast('🚉 ' + (station.name || '車站') + '：要搭車去哪裡呢？');
    G.openWorldMap();
  };

  /** v0.9.3 面對動物按 A：「哞～」跳出一句話（不能戰鬥） */
  G.animalTalk = function (spec) {
    G.animalSprite = spec.sprite;
    J.Audio.play('select');
    return G.say(null, [{ who: 'animal:' + spec.name, text: spec.say }]);
  };

  G.inspectLamp = function (lamp, scene) {
    var st = G.state;
    if (st.lamps[lamp.subject]) { G.say('D_LAMP_LIT', [{ who: 'pet', text: lamp.subject + '燈亮亮的，好溫暖！' }]); return; }
    var text = st.lights[lamp.subject] ? '已經拿回' + lamp.subject + '之光了！去找村長點燈吧。' : '這是' + lamp.subject + '燈。要找回「' + lamp.subject + '之光」才能點亮。';
    G.say(null, [{ who: 'pet', text: text }]);
  };

  G.feedPet = function () {
    var r = J.Shop.feedPet(G.state);
    if (!r.ok) { J.UI.toast('沒有番薯仔點心了，可以到商店買。'); return; }
    J.Daily.record(G.state.daily, 'feed').forEach(function (t) { G.state.player.coins += t.reward; J.UI.toast('每日小任務完成：「' + t.text + '」金幣 +' + t.reward); });
    J.Audio.play('correct');
    J.UI.toast('番薯仔好開心！愛心 ' + r.hearts + ' 顆');
    var sc = G.mapScene;
    if (sc && sc.pet) {
      sc.tweens.add({ targets: sc.pet, y: sc.pet.y - 10, duration: 160, yoyo: true, repeat: 1 });
      sc.sparkle(sc.pet.x, sc.pet.y - 12, 0xf0705a);
    }
    G.save(); G.refreshHud();
  };

  G.onJobChanged = function () {
    J.Character.clampVitals(G.state, G.data);
    G.refreshHud();
    var sc = G.mapScene;
    if (sc) sc.scene.restart({ mapId: sc.mapId, x: sc.p.tx, y: sc.p.ty, facing: sc.p.facing });
  };

  // ---------------------------------------------------------------- 戰鬥
  /** 最終頭目：五科輪流出題、或在最高等級地圖的頭目（和最終頭目 BGM 同一個判斷） */
  G.isFinalBoss = function (mon, map) { return !!(mon && mon.boss && J.MapInfo.battleBgm(mon, map) === 'final'); };

  /**
   * v0.9.3（老闆核准）最終頭目和每日時間上限：進場前看今天還剩多少時間。
   * 剩 25 分鐘以上（或家長設定不限時）直接進場；剩 10～25 分鐘提醒可能打不完，讓孩子選；不到 10 分鐘不讓進場。
   * 最終頭目重新挑戰時從頭開始（每次進場都是新的一場）。回傳 Promise<boolean>（true＝進場）
   */
  G.finalBossGate = function () {
    var st = G.state, gate = J.Playtime.finalBossGate(st.playtime, st.settings, Date.now());
    G.lastFinalGate = gate;   // 測試用
    if (gate.action === 'go') return Promise.resolve(true);
    if (gate.action === 'ask') {
      return J.UI.confirm('今天剩 ' + gate.minutes + ' 分鐘，可能打不完，要現在挑戰還是明天再來？（沒打完的話，下次要從頭開始喔）', '現在挑戰', '明天再來')
        .then(function (yes) {
          if (!yes) return G.say(null, [{ who: 'pet', text: '好！明天精神飽滿再來挑戰！' }]).then(function () { return false; });
          return true;
        });
    }
    return G.say(null, [{ who: 'pet', text: '今天只剩 ' + gate.minutes + ' 分鐘，打不完的。明天再來挑戰吧！' }]).then(function () { return false; });
  };

  G.startBattle = function (mob, scene) {
    var map = scene.map, mon = mob.mon;
    J.UI.closePassMove();   // v0.9.3 開著放大地圖走路時遇到怪物：先把地圖關掉
    G.battleCtx = { mob: mob, mon: mon, mapId: scene.mapId, over: false };
    var bg = G.battleBgFor(mon, scene.mapId);
    J.Bestiary.seen(G.state, mon.id);   // 怪物名冊：遇見
    G.bgm(J.MapInfo.battleBgm(mon, map));
    scene.scene.sleep();
    J.HUD.show(false);
    Array.prototype.forEach.call(document.querySelectorAll('.map-banner'), function (n) { n.parentNode.removeChild(n); });
    G.phaser.scene.start('Battle', { mon: mon, bg: bg });
  };

  /** 戰鬥背景：怪物或 maps.js 指定的名稱有對應的 bb_ 圖就用；否則用 config.js 的地圖對照表；再不行用別名 */
  G.battleBgFor = function (mon, mapId) {
    var have = J.Assets.art().battle, map = G.data.maps[mapId] || {};
    var cands = [mon.battle_bg, map.battle_bg, C.BATTLE_BG_BY_MAP[mapId], C.BATTLE_BG_ALIAS[map.battle_bg], 'grass'];
    for (var i = 0; i < cands.length; i++) if (cands[i] && have[cands[i]]) return cands[i];
    return C.BATTLE_BG_BY_MAP[mapId] || 'grass';
  };

  G.battleSceneReady = function (bscene) {
    var ctx = G.battleCtx, st = G.state, mon = ctx.mon;
    ctx.scene = bscene;
    ctx.b = J.Battle.create(mon);
    var lv = mon.q_levels;
    ctx.sess = J.Session.create(st, G.questions, mon.subjects ? mon.subjects[0] : mon.subject, {
      mode: 'free', noRepeat: true, expMult: G.coef(ctx.mapId), deferExp: true,   // 經驗值到戰鬥結束才結算
      filter: function (x) { return !J.Chests.isChestQuestion(x) && (!lv || (x.level >= lv[0] && x.level <= lv[1])); }
    });
    ctx.qn = 0;
    G.battleUI(ctx);
    var intro = mon.boss && mon.dialog_before ? G.say(mon.dialog_before, []) : Promise.resolve();
    intro.then(function () {
      G.bmsg((mon.boss ? '頭目「' : '') + mon.name + (mon.boss ? '」' : '') + '出現了！' + (mon.boss ? '（不能逃跑）' : ''));
      G.bcommands(true);
    });
  };

  /** 戰鬥的 DOM 介面 */
  G.battleUI = function (ctx) {
    var h = J.UI.h, mon = ctx.mon;
    var top = h('div.win.battle-top');
    var status = h('div.win.status');
    var msg = h('div.win.msg', { 'aria-live': 'polite' });
    var cmds = h('div.win.cmds', { role: 'group', 'aria-label': '戰鬥指令' });
    var ui = h('div.battle-ui', {}, [status, msg, cmds]);
    var wrap = h('div', {}, [top, ui]);
    ctx.ui = J.UI.open(wrap, { modal: false, escClose: false, label: '戰鬥' });
    ctx.el = { top: top, status: status, msg: msg, cmds: cmds };
    G.brender();
  };

  G.brender = function () {
    var ctx = G.battleCtx, st = G.state, s = G.stats(), b = ctx.b, mon = ctx.mon, h = J.UI.h;
    var pct = function (a, m) { return Math.max(0, Math.min(100, Math.round(a / m * 100))); };
    ctx.el.top.innerHTML = '';
    // v0.9.3 頭目：寫出第幾階段、還剩幾個階段、這一階段還要答對幾題；體力條上畫出階段的分隔線
    var ph = Math.min(b.phase, b.phases), left = b.phases - ph;
    var phaseText = b.boss ? '　第 ' + ph + '/' + b.phases + ' 階段' + (left ? '（還剩 ' + left + ' 個階段）' : '（最後階段）') : '';
    ctx.el.top.appendChild(h('div.boss-phase', { text: mon.name + phaseText }));
    var marks = [];
    if (b.boss) for (var k = 1; k < b.phases; k++) marks.push(h('b.phase-mark', { style: { left: Math.round((1 - k / b.phases) * 100) + '%' } }));
    var hpPct = b.hp > 0 ? Math.max(1, pct(b.hp, b.maxHp)) : 0;   // 還有體力時至少畫 1%，不會看起來是空的
    ctx.el.top.appendChild(h('span.bar.boss', { role: 'progressbar', 'aria-label': mon.name + ' 的體力', 'aria-valuenow': String(hpPct), style: { width: '220px' } }, [h('i', { style: { width: hpPct + '%' } })].concat(marks)));
    var need = J.Battle.needCorrect(b);
    if (b.boss && !b.over && need > 0 && b.held) ctx.el.top.appendChild(h('div.small.boss-need', { text: '再答對 ' + need + ' 題' + (left ? '進入下一階段' : '就能打倒') }));
    ctx.el.status.innerHTML = '';
    ctx.el.status.appendChild(h('div', { html: '<b style="color:#ffd34d">' + J.UI.esc(st.player.name) + '</b>　等級 ' + st.player.level }));
    ctx.el.status.appendChild(h('div', {}, ['體力 ', h('span.bar.hp', { role: 'progressbar', 'aria-label': '體力' }, [h('i', { style: { width: pct(st.player.hp, s.maxHp) + '%' } })]), ' ' + st.player.hp + '/' + s.maxHp]));
    ctx.el.status.appendChild(h('div', {}, ['魔力 ', h('span.bar.mp', { role: 'progressbar', 'aria-label': '魔力' }, [h('i', { style: { width: pct(st.player.mp, s.maxMp) + '%' } })]), ' ' + st.player.mp + '/' + s.maxMp]));
  };

  G.bmsg = function (text) { var c = G.battleCtx; if (c && c.el) { c.el.msg.textContent = text; } };

  G.bcommands = function (on) {
    var ctx = G.battleCtx, h = J.UI.h, s = G.stats(), b = ctx.b;
    ctx.el.cmds.innerHTML = '';
    if (!on) return;
    var skill = s.skill;
    var skillOk = skill && G.state.player.mp >= (skill.mp || 0) && !(skill.effect === 'preempt' && b.turns > 0);
    var atk = h('button.primary', { onclick: function () { G.battack('attack'); } }, ['⚔️ 攻擊']);
    ctx.el.cmds.appendChild(atk);
    ctx.el.cmds.appendChild(h('button', { disabled: !skillOk, title: skill ? skill.desc : '轉職後才有技能', onclick: function () { G.battack('skill'); } },
      [skill ? '✨ ' + skill.name + '（魔力 ' + skill.mp + '）' : '✨ 技能']));
    ctx.el.cmds.appendChild(h('button', { onclick: G.bitems }, ['🎒 道具']));
    ctx.el.cmds.appendChild(h('button', { disabled: b.boss, onclick: G.bflee }, ['🏃 逃跑']));
    setTimeout(function () { atk.focus(); }, 30);
  };

  G.bsubject = function () {
    var ctx = G.battleCtx, mon = ctx.mon;
    if (mon.subjects && mon.subjects.length) return mon.subjects[ctx.qn % mon.subjects.length];
    return mon.subject;
  };

  G.battack = function (kind) {
    var ctx = G.battleCtx, st = G.state, s = G.stats(), b = ctx.b;
    var skill = kind === 'skill' ? s.skill : null;
    var subject = skill ? (skill.subject || s.favored || G.bsubject()) : G.bsubject();
    var bossMult = b.boss ? C.BOSS_DAMAGE_MULT : 1;
    var estL4 = J.Battle.damage({ atk: s.atk, level: 4, elapsedMs: 0, limitMs: 90000, favored: subject === s.favored, favoredMult: s.favoredMult, bossMult: bossMult }).damage;
    var force = J.Battle.needsFinalL4(b, estL4) ? 4 : undefined;
    var q = J.Session.next(ctx.sess, Date.now(), { subject: subject, forceLevel: force });
    if (!q) { G.bmsg('「' + subject + '」的題目還在準備中……'); return; }
    ctx.qn++;
    G.bcommands(false);
    var timerMs = J.Battle.timeLimitMs(q.level, st.settings.answerTime, s.timeMult * (b.timeBuff || 1));
    b.timeBuff = 1;
    J.Quiz.ask({
      session: ctx.sess, mode: 'battle', state: st, timerMs: timerMs,
      title: skill ? '技能「' + skill.name + '」' : '攻擊！', subtitle: ctx.mon.name + (force ? '・最後一擊！' : ''),
      onSave: function () { G.save(); },
      onRewards: function (res) { G.refreshHud(); if (res) G.afterReward(res.levelsGained); },
      onDone: function (r) { G.bresolve(kind, skill, q, r); }
    });
  };

  G.bresolve = function (kind, skill, q, r) {
    var ctx = G.battleCtx, st = G.state, s = G.stats(), b = ctx.b, sc = ctx.scene;
    G.brender();
    if (!r.correct) {
      J.Session.abandon(ctx.sess);
      G.bmsg(r.timeout ? '時間到！這一擊沒打出去……' : '沒打中……');
      setTimeout(G.bmonsterTurn, 700);
      return;
    }
    var favored = q.subject === s.favored;
    var hits = [], mult = 1;
    if (skill) {
      st.player.mp = Math.max(0, st.player.mp - (skill.mp || 0));
      if (skill.effect === 'double') hits = [1, 1];
      else if (skill.effect === 'all') { hits = [1]; mult = 1.5; }
      else if (skill.effect === 'preempt') hits = [1];
      else if (skill.effect === 'time') { b.timeBuff = skill.value || 1.5; G.bmsg('鼓舞之歌！下一題的時間變長了。'); sc.healEffect(); G.brender(); setTimeout(function () { G.bcommands(true); }, 600); return; }
      else if (skill.effect === 'heal') {
        var amt = Math.max(1, Math.round(s.maxHp * (skill.value || 0.3)));
        st.player.hp = Math.min(s.maxHp, st.player.hp + amt);
        sc.healEffect(); G.brender(); G.refreshHud();
        G.bmsg(skill.name + '！體力回復了 ' + amt + ' 點。');
        setTimeout(function () { G.bcommands(true); }, 600);
        return;
      }
    } else hits = [1];
    var i = 0, msgs = [];
    (function next() {
      if (i >= hits.length || b.over) { G.brender(); G.bmsg(msgs.join(' ')); if (b.over) setTimeout(G.bvictory, 700); else setTimeout(function () { G.bcommands(true); }, 500); return; }
      var d = J.Battle.damage({ atk: s.atk, level: q.level, elapsedMs: r.elapsedMs, limitMs: r.limitMs, favored: favored, favoredMult: s.favoredMult, mult: mult, bossMult: b.boss ? C.BOSS_DAMAGE_MULT : 1 });
      var h = J.Battle.hit(b, d.damage);
      sc.hitEffect(h.dealt, d.crit);
      if (h.phaseUp) sc.phaseEffect();
      // v0.9.3 生氣了 = 進入下一階段、攻擊 +20%
      if (h.phaseUp) J.UI.banner(G.battleCtx.mon.name + '生氣了！攻擊變強了！', 'rage-banner');
      var left = b.phases - Math.min(b.phase, b.phases);
      msgs.push((d.crit ? '會心一擊！' : '') + (favored && i === 0 ? '拿手科目！' : '') + '打出 ' + h.dealt + ' 點傷害！' +
        (h.phaseUp ? G.battleCtx.mon.name + '生氣了！攻擊變強了！（第 ' + Math.min(b.phase, b.phases) + '/' + b.phases + ' 階段' + (left ? '，還剩 ' + left + ' 個階段' : '，最後一個階段') + '）' : '') +
        (h.held && !b.over ? G.battleCtx.mon.name + '撐住了！再答對 ' + J.Battle.needCorrect(b) + ' 題' + (b.phase >= b.phases ? '就能打倒它！' : '就會進入下一個階段！') : ''));
      G.brender();
      i++;
      setTimeout(next, 450);
    })();
  };

  G.bmonsterTurn = function () {
    var ctx = G.battleCtx, mon = ctx.mon, s = G.stats(), st = G.state;
    var pm = J.Battle.phaseMult(ctx.b);   // v0.9.3 頭目每進一個階段傷害 +20%
    var dmg = J.Battle.monsterAttack(mon, s.def, null, pm);
    var h = J.Battle.heroHurt(st, dmg);
    ctx.lastHit = { dmg: dmg, mult: pm };   // 測試用
    ctx.scene.hurtEffect();
    G.brender(); G.refreshHud();
    G.bmsg(mon.name + (pm > 1 ? '（生氣中）' : '') + '撞了過來！受到 ' + dmg + ' 點傷害。');
    G.save();
    if (h.ko) setTimeout(G.bko, 900);
    else setTimeout(function () { G.bcommands(true); }, 700);
  };

  G.bitems = function () {
    var ctx = G.battleCtx, st = G.state, D = G.data, h = J.UI.h;
    var usable = Object.keys(st.inventory).filter(function (id) { var it = D.items[id]; return it && st.inventory[id] > 0 && it.type === 'consumable' && (it.heal > 0 || it.mp > 0); });
    ctx.el.cmds.innerHTML = '';
    if (!usable.length) { G.bmsg('沒有可以用的道具。'); }
    usable.forEach(function (id) {
      var it = D.items[id];
      ctx.el.cmds.appendChild(h('button', { onclick: function () {
        var r = J.Character.useItem(st, id, D);
        if (!r.ok) { G.bmsg(r.reason === 'full' ? '體力是滿的，不用吃喔。' : '現在不能用。'); return; }
        if (id === 'snack' || it.pet) { st.pet.hearts += 1; }
        ctx.scene.healEffect();
        G.brender(); G.refreshHud();
        G.bmsg('用了' + it.name + '，體力回復 ' + r.healed + ' 點！');
        G.bcommands(false);
        setTimeout(G.bmonsterTurn, 800);
      } }, [it.name + ' ×' + st.inventory[id]]));
    });
    ctx.el.cmds.appendChild(h('button.ghost', { onclick: function () { G.bcommands(true); } }, ['返回']));
    var f = ctx.el.cmds.querySelector('button'); if (f) f.focus();
  };

  G.bflee = function () {
    var ctx = G.battleCtx;
    G.bcommands(false);
    if (J.Battle.tryFlee(ctx.b.boss)) {
      G.state.stats.battles.fled = (G.state.stats.battles.fled || 0) + 1;
      G.bmsg('順利逃開了！');
      setTimeout(function () { G.bend('fled'); }, 700);
    } else {
      G.bmsg('逃不掉！');
      setTimeout(G.bmonsterTurn, 700);
    }
  };

  G.bvictory = function () {
    var ctx = G.battleCtx, st = G.state, mon = ctx.mon;
    ctx.scene.wakeEffect();
    var lvl = st.player.level;
    var bond = J.Battle.bond(st);   // v0.9.3 親密度（番薯仔的愛心，隱藏屬性）：掉寶率、經驗值 +N%（不加金幣、畫面不說明）
    var vr = J.Battle.victoryReward(mon, G.coef(ctx.mapId), bond);
    // v0.9.3 C1：經驗值和金幣只在打倒怪物時給（怪物的 exp×地圖係數×親密度、gold）；戰鬥中答對不給
    var ans = J.Session.settleBattle(ctx.sess);   // 只有這場完成的每日小任務金幣、舊存檔的暫存經驗值
    J.Exp.addExp(st.player, vr.exp);
    st.player.coins += vr.gold;
    ctx.reward = { exp: vr.exp, coins: vr.gold + ans.daily, monsterGold: vr.gold, daily: ans.daily, bond: bond };   // 測試用
    var drops = J.Battle.rollDrops(mon, null, bond);
    drops.forEach(function (it) { J.Character.addItem(st, it, 1); });
    st.stats.battles.won = (st.stats.battles.won || 0) + 1;
    J.Bestiary.defeated(st, mon.id);   // 怪物名冊：打倒
    G.stopBgm(200);
    G.jingle(mon.boss && drops.length ? 'rare_item' : 'victory', null, null, 7000);
    var lines = [mon.wake, '經驗值 +' + ctx.reward.exp + '　金幣 +' + ctx.reward.coins];
    if (drops.length) lines.push('得到：' + drops.map(function (d) { return (G.data.items[d] || {}).name || d; }).join('、'));
    G.bmsg(lines.join('　'));
    G.refreshHud();
    var done = [];
    if (mon.boss) done = J.QuestLog.onBossDefeated(st, G.data.quests, mon.id, G.data);
    // 打贏了：獎勵、頭目委託馬上寫入存檔（頭目戰後的對話很長，這段時間關掉分頁也不會白打）。
    // ctx.won 之後不會再有答題或攻擊，所以不會重複領獎；按「繼續」時 G.bend 再存一次。
    ctx.won = true;
    G.save();
    var levels = st.player.level - lvl;
    var after = mon.boss && mon.dialog_after ? function () { return G.say(mon.dialog_after, []); } : function () { return Promise.resolve(); };
    var h = J.UI.h;
    ctx.el.cmds.innerHTML = '';
    var btn = h('button.primary', { onclick: function () {
      btn.disabled = true;
      after().then(function () {
        G.bend('win');
        G.afterReward(levels);
        var chain = Promise.resolve();
        done.forEach(function (qr) { chain = chain.then(function () { return G.questDone(qr.id, qr, G.mapScene, 0); }); });
      });
    } }, ['繼續 ▶']);
    ctx.el.cmds.appendChild(btn);
    setTimeout(function () { btn.focus(); }, 30);
  };

  G.bko = function () {
    var ctx = G.battleCtx;
    G.bmsg('累倒了……');
    G.stopBgm(200);
    G.jingle('faint', null, 'hurt', 7000);
    G.say('D_FAINT', [{ who: 'pet', text: '我們累倒了……先回旅店休息一下吧。' }, { who: 'pet', text: '沒關係！金幣和道具都還在喔。' }]).then(function () { G.bend('ko'); });
  };

  G.bend = function (result) {
    var ctx = G.battleCtx;
    if (!ctx || ctx.over) return;
    ctx.over = true;
    // v0.9.3 逃跑、累倒：不給經驗值和金幣（只給這場完成的每日小任務金幣；打贏時 bvictory 已經給過，這裡是 0）
    var late = J.Session.settleBattle(ctx.sess);
    ctx.lateDaily = late.daily;   // 測試用
    if (late.levels > 0) setTimeout(function () { G.afterReward(late.levels); }, 900);
    if (ctx.ui) ctx.ui.close(true);
    J.TTS.stop();
    G.phaser.scene.stop('Battle');
    J.HUD.show(true);
    G.refreshHud();
    if (result === 'ko') {
      var to = J.Character.knockout(G.state, G.data, { map: 'M01', x: undefined, y: undefined });
      G.save();
      G.phaser.scene.wake('Map', { result: 'ko', mob: ctx.mob });
      G.refreshHud();
      if (to) G.mapScene.scene.restart({ mapId: to.map, x: to.x, y: to.y, facing: 'down' });
      return;
    }
    G.save();
    G.phaser.scene.wake('Map', { result: result, mob: ctx.mob });
    if (G.mapScene) G.bgm(J.MapInfo.bgmFor(G.mapScene.map));   // 回到地圖音樂
  };

  /** 旅店休息：畫面慢慢變暗，播旅店短曲，播完才亮回來（沒有音樂時約 1.5 秒） */
  G.innRest = function () {
    return new Promise(function (resolve) {
      G.busy = true;
      var veil = J.UI.h('div.inn-veil', { 'aria-hidden': 'true' }, [J.UI.h('div', { text: '💤 休息中……' })]);
      document.getElementById('ui').appendChild(veil);
      setTimeout(function () { veil.classList.add('on'); }, 20);
      G.stopBgm(400);
      G.jingle('inn_rest', function () {
        veil.classList.remove('on');
        setTimeout(function () {
          if (veil.parentNode) veil.parentNode.removeChild(veil);
          G.busy = false;
          if (G.mapScene) G.bgm(J.MapInfo.bgmFor(G.mapScene.map));
          resolve();
        }, 450);
      }, 'levelup', 8000);
    });
  };

  /** 拿到珍貴道具（職業武器、頭目掉落、名冊獎勵）時的短曲 */
  G.rareItem = function () { G.jingle('rare_item', null, 'chest'); };

  /**
   * v0.7：資料與圖檔不是同一版（瀏覽器快取到舊檔：背景尺寸≠格子數×32，或背景圖已經換掉讀不到）。
   * 顯示「遊戲剛更新，請重新整理」並提供重新整理按鈕；同一次開遊戲只問一次。
   */
  G.versionIssues = [];
  G.versionMismatch = function (info) {
    G.versionIssues.push(info);
    console.warn('[版本] 地圖資料和圖檔不是同一版：', info);
    if (G.versionAsked) return;
    G.versionAsked = true;
    setTimeout(function () {
      J.UI.confirm('遊戲剛更新了！請按「重新整理」，載入最新的地圖。（進度已經自動存好，不會不見。）', '重新整理', '等一下').then(function (yes) {
        if (!yes) return;
        Promise.resolve(G.state ? G.save(true) : null).then(function () { location.reload(); }, function () { location.reload(); });
      });
    }, 300);
  };

  // ---------------------------------------------------------------- 台灣世界地圖
  G.openWorldMap = function () {
    if (!G.state) return;
    J.WorldMapUI.open(G, function (region) {
      var e = J.WorldMap.entry(region, G.data.maps);
      if (!e || !G.data.maps[e.map]) { J.UI.toast('這個地區還在準備中。'); return; }
      J.Audio.play('warp');
      G.changeMap(e.map, e.x, e.y, 'down');
    });
  };

  // ---------------------------------------------------------------- 存檔碼、刪檔
  G.importCode = function (code) {
    J.SaveCode.importAny(code).then(function (r) {
    if (!r.ok) { J.UI.toast('讀取失敗：' + r.error, 4000); return; }
    J.UI.confirm('確定要用這個存檔碼（' + r.state.player.name + '・等級 ' + r.state.player.level + '）覆蓋目前的進度嗎？', '覆蓋', '取消').then(function (y) {
      if (!y) return;
      G.state = r.state;
      G.save(true).then(function () { location.reload(); });
    });
    });
  };

  G.deleteSave = function () {
    clearInterval(G.tickTimer);
    G.provider['delete'](SLOT).then(function () { G.state = null; location.reload(); });
  };

  // ---------------------------------------------------------------- 遊玩時間
  G.tick = function () {
    var st = G.state;
    if (!st) return;
    if (document.visibilityState === 'hidden') { J.Playtime.pause(st.playtime); return; }
    var now = Date.now();
    if (J.Daily.ensure(st.daily, now)) J.UI.toast('新的一天！每日小任務換新了。');
    var ev = J.Playtime.tick(st.playtime, st.settings, now);
    // 今日上限：不在冒險途中硬擋——戰鬥、對話、題目或其他視窗開著時先記著，結束後才顯示（上限本身不變）
    if ((ev.indexOf('limit') >= 0 || G.limitPending) && !G.limitHandle) {
      // 打贏後（勝利畫面、戰後對話）inBattle() 已是 false，但戰鬥還沒結束：一樣等到按「繼續」之後
      // v0.9.3：放大地圖（passMove 視窗）開著時還能走，不能拿來延後上限 → 用 blocksMove()，顯示上限前先關掉放大地圖
      if (G.inBattle() || (G.battleCtx && !G.battleCtx.over) || G.busy || J.UI.blocksMove() || (G.mapScene && G.mapScene.transitioning)) { G.limitPending = true; }
      else if (J.Playtime.isOverLimit(st.playtime, st.settings, now)) { G.limitPending = false; G.save(); J.UI.closeLoadBars && J.UI.closeLoadBars(); J.UI.closePassMove(); J.Settings.limitScreen(G); return; }
      else G.limitPending = false;
    }
    if (ev.indexOf('rest') >= 0) J.Settings.restReminder();
    if (now - G.lastSave > 30000) G.save();
  };
  document.addEventListener('visibilitychange', function () { if (G.state) { J.Playtime.pause(G.state.playtime); if (document.visibilityState === 'hidden') G.save(); } });

  // ---------------------------------------------------------------- 測試用（自動化測試會呼叫；一般遊玩用不到）
  G.debug = {
    state: function () { return G.state; },
    mapId: function () { return G.mapScene && G.mapScene.mapId; },
    player: function () { var p = G.mapScene && G.mapScene.p; return p ? { x: p.tx, y: p.ty, moving: p.moving } : null; },
    walkTo: function (x, y) { return G.mapScene.walkTo(x, y, G.mapScene.interactableAt(x, y)); },
    exits: function () { return (G.mapScene.map.exits || []).slice(); },
    chests: function () { return (G.mapScene.map.chests || []).map(function (c) { return { id: c.id, x: c.x, y: c.y, opened: !!G.state.chests[c.id] }; }); },
    npcs: function () { return G.mapScene.npcs.map(function (n) { return { id: n.data.id, x: n.data.x, y: n.data.y }; }); },
    animals: function () { return (G.mapScene.animals || []).map(function (a) { return { id: a.spec.id, x: a.tx, y: a.ty, area: a.spec.area, moving: a.moving }; }); },
    monsters: function () { return G.mapScene.monsters.filter(function (m) { return m.active; }).map(function (m) { return { id: m.id, x: m.tx, y: m.ty }; }); },
    /** 讓最近的怪物走到主角面前（觸發和真的碰到一樣的戰鬥流程） */
    encounter: function () {
      var sc = G.mapScene, act = sc.monsters.filter(function (m) { return m.active && !m.boss; });
      if (!act.length) return false;
      var m = act[0];
      sc.tweens.killTweensOf(m.sprite);
      m.bob = null;
      m.moving = false; m.nextMove = sc.time.now + 60000;
      m.tx = sc.p.tx; m.ty = sc.p.ty;
      m.sprite.setPosition(sc.player.x, sc.player.y);
      sc.encounterCooldown = 0;
      return true;
    },
    inBattle: function () { return !!(G.battleCtx && !G.battleCtx.over && G.battleCtx.b); },
    currentQuestion: function () {
      var s = (G.battleCtx && !G.battleCtx.over && G.battleCtx.sess) || G._lastSess;
      return s && s.q ? { id: s.q.id, type: s.q.type, answer: s.q.answer, options: s.q.options, subject: s.q.subject } : null;
    },
    teleport: function (mapId, x, y) { G.changeMap(mapId, x, y, 'down'); },
    /** 讓頭目移到主角旁邊（頭目要在委託進行中才會出現） */
    encounterBoss: function () {
      var sc = G.mapScene, b = sc.monsters.filter(function (m) { return m.active && m.boss; })[0];
      if (!b) return false;
      sc.tweens.killTweensOf(b.sprite);
      b.sprite.setPosition(sc.player.x, sc.player.y);
      sc.encounterCooldown = 0;
      return true;
    },
    setQuest: function (id, status) { G.state.quests[id] = { status: status, progress: 0 }; G.save(); },
    setHp: function (hp) { G.state.player.hp = hp; G.refreshHud(); },
    battle: function () { var c = G.battleCtx; return c && c.b ? { hp: c.b.hp, maxHp: c.b.maxHp, phase: c.b.phase, boss: c.b.boss, over: c.over } : null; },
    heroTexture: function () { return G.mapScene && G.mapScene.player.texture.key; },
    openWorldMap: function () { G.openWorldMap(); },
    /** 前景（上層格 'U'）示範：把主角所在格與上面兩格改成上層格，重新載入地圖，主角就會被前景擋住並顯示剪影 */
    fgDemo: function () {
      var sc = G.mapScene, m = sc.map, x = sc.p.tx, y = sc.p.ty;
      m.grid = m.grid.map(function (row, ry) {
        if (ry < y - 2 || ry > y) return row;
        var a = row.split('');
        for (var rx = x - 1; rx <= x + 1; rx++) if (a[rx] && sc.walkable(rx, ry) && !J.World.exitAt(m, rx, ry)) a[rx] = 'U';
        return a.join('');
      });
      sc.scene.restart({ mapId: sc.mapId, x: x, y: y, facing: 'down' });
      return true;
    },
    ghostVisible: function () { return !!(G.mapScene && G.mapScene.ghost && G.mapScene.ghost.visible); },
    seeMonsters: function (n, defeatedTimes) {
      J.Bestiary.split(G.data.monsters, G.data.maps).all.slice(0, n).forEach(function (id) { var r = J.Bestiary.rec(G.state, id); r.seen = Math.max(r.seen, 1); if (defeatedTimes) r.defeated = Math.max(r.defeated, defeatedTimes); });
      G.save();
    },
    musicLog: function () { return G.musicLog.slice(); },
    mapLoadLog: function () { return G.mapLoadLog.slice(); },
    /** 效能：目前 FPS（Phaser 量測）、畫面物件數、鏡頭附近的怪物數、背景分塊數 */
    perf: function () { var p = G.mapScene ? G.mapScene.perfInfo() : {}; p.fps = G.phaser ? Math.round(G.phaser.loop.actualFps * 10) / 10 : 0; return p; },
    camera: function () { var c = G.mapScene.cameras.main, v = c.worldView; return { x: v.x, y: v.y, w: v.width, h: v.height, mapW: G.mapScene.size.w * C.TILE, mapH: G.mapScene.size.h * C.TILE }; },
    bigPilot: function () { return G.bigPilot || null; },
    gateAsks: function () { return G.gateAsks || 0; },
    monsterTiles: function () { return G.mapScene.monsters.filter(function (m) { return m.active; }).map(function (m) { return { id: m.id, idx: m.idx, x: m.tx, y: m.ty, visited: m.visited || 0, area: m.spawn.area }; }); },
    setLevel: function (lv) { G.state.player.level = lv; J.Character.restoreFull(G.state, G.data); G.refreshHud(); }
  };

  // 讓 debug.currentQuestion 在委託／寶箱時也找得到題目
  var origAsk = J.Quiz.ask;
  J.Quiz.ask = function (o) { G._lastSess = o.session; return origAsk(o); };

  window.JQ = window.JQ || {};
  window.JQ.Game = G;
})();
