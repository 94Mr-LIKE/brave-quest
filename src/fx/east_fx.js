/*
 * v4.0 東部終章：地圖新欄位的畫面與互動（71 號 2.3–2.12）。規則在 systems/east_fields.js、cave_puzzle.js、ice.js（可以在 node 測試）。
 *
 * 掛法：這個檔在 scenes/MapScene.js 之後載入，把 MapScene.prototype 的幾個方法「包一層」（不改 MapScene.js 的原文，
 *   南部 v3.0 包、之後的整合包改 MapScene.js 都不會互相蓋掉）：
 *     create（建好地圖後掛上 EastFx）、walkable（機關的門、箱子、軟雲擋路）、tryStep（推箱子、冰上不能斜走）、
 *     walkTo（冰上點地圖＝往那個方向滑）、arrive（冰上繼續滑、推箱房間的門、踏板、光柱）、interactableAt／interact／promptText（機關、山屋小燈、遺失物…）、
 *     update（霧遮罩跟著主角、找路箭頭）、onWake（打完仗回來：五燈試煉的燈、光柱）。
 *   地圖沒有東部欄位（EastFields.hasEast）時 scene.eastFx＝null，每個包裝都直接走原本的流程（現有地圖行為完全不變）。
 *
 * 畫面：會變狀態的機關物件（踏板、石門、冰門、木柵、箱子、冰石、鏡子、光線、星石、石盤、石牌、天平、山屋小燈、遺失物、軟雲、星星、光柱、夜路、霧）
 *   都用程式畫（GPT 只畫空房間，老闆 2026-10-26）；書架圖案牌、遺失物、山屋小燈的圖示先用表情符號（美術新畫的圖示到了再換）。
 * 兒童介面：不閃爍（呼吸動畫都 ≥ 1.2 秒一次）；「減少動態效果」（家長設定或系統 prefers-reduced-motion）時不播動畫、霧改成固定的淡霧、
 *   翻牌多開 1 秒、光線直接畫線。
 */
(function () {
  'use strict';
  var J = window.JQ = window.JQ || {};
  var EF = J.EastFields, CP = J.CavePuzzle, Ice = J.Ice;
  var T = (J.CONFIG && J.CONFIG.TILE) || 32;
  var VIEW_W = (J.CONFIG && J.CONFIG.VIEW_W) || 640, VIEW_H = (J.CONFIG && J.CONFIG.VIEW_H) || 360;
  // 找路箭頭在霧上面（剪影 60000 以下）。
  // v4.2.2（老闆 2026-11-13 截圖「兩塊偏亮的方形草叢格」）：夜路的藍色層原本 39000，在上層格（40000）與光暈補片（40001）之下，
  // 夜路裡的上層格沒被染藍，一格一格比旁邊亮。改到 40002：上層格也染藍；站名牌、落葉（45000）、前景大圖（50000）、剪影（60000）照舊在上面
  var DEPTH = { GROUND: 2, PATH: 3, BEAM: 4, NIGHT: 40002, FOG: 58000, ARROW: 59000 };
  var FOG_FADE_MS = 450;
  var COMPASS_DOT_MAPS = ['M37'];            // 71 號 2.3：曙光羅盤在回音霧廊的正確的路上冒出淡金色光點
  var FOG_COLOR = { M37: '#5b6b86', M39: '#8f897c' };
  var LAMP_COLOR = { '國語': '#ffd34d', '英語': '#7be0ff', '數學': '#ff9d6a', '自然': '#7be08a', '社會': '#c89aff' };
  var MEMORY_SHOW_MS = 1000, MEMORY_EXTRA_MS = 1000;   // 不一樣的兩張開 1 秒再蓋回去；減少動態效果多開 1 秒
  var BREATH_MS = 1400;                                // 呼吸動畫一次 2.8 秒（遠低於每秒 3 次）
  var FONT = '"Microsoft JhengHei","PingFang TC","Noto Sans TC",sans-serif';
  var LA = (J.MapInfo && J.MapInfo.LAMP_ART) || { W: 32, H: 48, GLOW_Y: 24 };
  var LAMP_W = LA.W, LAMP_H = LA.H, LAMP_GLOW_Y = LA.GLOW_Y;
  var ADD = (typeof Phaser !== 'undefined' && Phaser.BlendModes) ? Phaser.BlendModes.ADD : 1;
  var EastFx = { log: [], arrows: 0 };

  function G() { return J.Game; }
  /** 測試、除錯用的紀錄（最多留 200 筆，玩很久也不會越積越多） */
  function logp(x) { var L = EastFx.log; L.push(x); if (L.length > 200) L.splice(0, L.length - 200); }
  function key(x, y) { return x + ',' + y; }
  function reduced() {
    var st = G() && G().state, v = st && st.settings && st.settings.reduceMotion;
    if (v === 'on') return true;
    if (v === 'off') return false;
    try { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) { return false; }
  }
  function speaker() { return window.SPEAKERS && window.SPEAKERS.fog_kid !== undefined ? 'fog_kid' : 'pet'; }   // 71 號 2.11.1：霧仔用華語說提示（霧仔的說話者還沒有時由番薯仔說）
  function say(text, who) { var g = G(); return g && g.say ? g.say(null, [{ who: who || speaker(), text: text }]) : Promise.resolve(); }
  /** 播 dialogs.js 的一段（劇本組 dialogs_east2.js 的 D_PZ_*、D_CAVE_*）；還沒有這段時說 fallback 那一句 */
  function sayId(id, text, who) {
    var g = G();
    logp('say:' + (id || '') + ':' + text);
    return g && g.say ? g.say(id && dialogOf(id) ? id : null, [{ who: who || speaker(), text: text }]) : Promise.resolve();
  }
  function dialogOf(id) { var g = G(), D = (g && g.data && g.data.dialogs) || window.DIALOGS || {}; return D[id] || null; }
  /** 一段對白的文字（給機關的視窗顯示提示用）；沒有就 null */
  function dialogText(id) { var d = id && dialogOf(id); return d ? d.map(function (l) { return l.text; }).join('') : null; }
  function toast(t, ms) { if (J.UI && J.UI.toast) J.UI.toast(t, ms); logp('toast:' + t); }
  function banner(t) { if (J.UI && J.UI.banner) J.UI.banner(t); logp('banner:' + t); }
  function sfx(id) { try { if (J.Audio) J.Audio.play(id); } catch (e) { /* 音效失敗不影響遊戲 */ } }

  // ═════════════════════ 程式畫的小圖（畫布 → 貼圖；同一張只畫一次） ═════════════════════
  function tex(scene, k, w, h, draw) {
    if (scene.textures.exists(k)) return k;
    var c = document.createElement('canvas'); c.width = w; c.height = h;
    draw(c.getContext('2d'), w, h);
    scene.textures.addCanvas(k, c);
    return k;
  }
  function emojiTex(scene, k, emoji, w, h, bg) {
    return tex(scene, k, w, h, function (g) {
      if (bg) bg(g, w, h);
      g.font = Math.round(h * 0.62) + 'px ' + FONT; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(emoji, w / 2, h / 2 + 1);
    });
  }
  function textTex(scene, k, text, w, h, fg, bgc, size) {
    return tex(scene, k, w, h, function (g) {
      if (bgc) { g.fillStyle = bgc; g.fillRect(0, 0, w, h); }
      g.font = 'bold ' + (size || Math.round(h * 0.5)) + 'px ' + FONT; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.lineWidth = 3; g.strokeStyle = '#0b1236'; g.strokeText(text, w / 2, h / 2 + 1);
      g.fillStyle = fg || '#fffdf5'; g.fillText(text, w / 2, h / 2 + 1);
    });
  }
  var SHAPE_COLOR = { '紅': '#e0473a', '藍': '#3d7be0' };
  function shapeTex(scene, label, slab) {
    var sa = art2(scene, shapeArtKey(label, slab));   // v4.2.6 W1c：圖形石板／答案地板用美術圖
    if (sa) return sa;
    var color = SHAPE_COLOR[label.charAt(0)] || '#888', shape = label.slice(1);
    return tex(scene, 'east:shape:' + label + (slab ? ':slab' : ''), 32, 32, function (g) {
      g.fillStyle = slab ? '#5d6470' : '#3b4252'; g.fillRect(2, 2, 28, 28);
      g.strokeStyle = '#c9d2e4'; g.lineWidth = 2; g.strokeRect(3, 3, 26, 26);
      g.fillStyle = color; g.beginPath();
      if (shape === '圓') g.arc(16, 16, 9, 0, Math.PI * 2);
      else if (shape === '三角') { g.moveTo(16, 6); g.lineTo(26, 25); g.lineTo(6, 25); g.closePath(); }
      else g.rect(7, 7, 18, 18);
      g.fill();
    });
  }
  function plateTex(scene, label, on) {
    var pa = /^[ABC]$/.test(label) ? art2(scene, 'obj_plate_' + label + '_' + (on ? 'on' : 'off')) : null;   // v4.2.6 W1c：A／B／C 踏板用美術圖
    if (pa) return pa;
    return tex(scene, 'east:plate:' + label + ':' + (on ? 1 : 0), 32, 32, function (g) {
      g.fillStyle = on ? '#ffe9a0' : '#6d7487'; g.beginPath(); g.ellipse(16, 18, 13, 9, 0, 0, Math.PI * 2); g.fill();
      g.strokeStyle = on ? '#fff7d6' : '#2b3040'; g.lineWidth = 2; g.stroke();
      g.font = 'bold 12px ' + FONT; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = on ? '#5a3a00' : '#e8ecf6'; g.fillText(label, 16, 18);
    });
  }
  function lampDotTex(scene, on, color) {
    var la = art2(scene, on ? 'obj_lamp_dot_on' : 'obj_lamp_dot_off');   // v4.2.6 W1c
    if (la) return la;
    return tex(scene, 'east:lampdot:' + (on ? color : 'off'), 14, 14, function (g) {
      g.fillStyle = on ? color : '#2b3040'; g.beginPath(); g.arc(7, 7, 6, 0, Math.PI * 2); g.fill();
      g.strokeStyle = on ? '#fffbe8' : '#9aa3b8'; g.lineWidth = 1.5; g.stroke();
    });
  }
  function blockTex(scene, kind) {
    var ak = art2(scene, { door: 'obj_gate_stone', ice: 'obj_gate_ice', wood: 'obj_gate_wood', scale: 'obj_scale' }[kind]);   // v4.2.6 W1c：門、冰門、木柵、天平用美術圖
    if (ak) return ak;
    var C = { door: ['#6b7280', '#3a3f4b'], echo: ['#6f7a8f', '#3a4252'], ice: ['#bfe8ff', '#6fb8e0'], wood: ['#9a6a3a', '#5a3a1c'], box_ice: ['#d6f1ff', '#7ab9db'],
      box_stone: ['#9b8f80', '#5e5448'], wallstone: ['#6c6560', '#3d3834'], rock: ['#e8f7ff', '#8cc6e6'], scale: ['#c9a76a', '#6a5126'] }[kind] || ['#888', '#444'];
    var tall = kind === 'door' || kind === 'echo' || kind === 'ice' || kind === 'wood';
    return tex(scene, 'east:block:' + kind, 32, tall ? 44 : 32, function (g, w, h) {
      g.fillStyle = C[1]; g.fillRect(1, 1, w - 2, h - 2);
      g.fillStyle = C[0]; g.fillRect(3, 3, w - 6, h - 8);
      if (kind === 'wood') { g.fillStyle = C[1]; [9, 16, 23].forEach(function (x) { g.fillRect(x, 3, 2, h - 8); }); }
      if (kind === 'ice' || kind === 'box_ice' || kind === 'rock') { g.fillStyle = 'rgba(255,255,255,.7)'; g.fillRect(6, 6, 6, 3); }
    });
  }
  function starTex(scene, on) {
    return tex(scene, 'east:star:' + (on ? 1 : 0), 24, 24, function (g) {
      g.fillStyle = on ? '#fff3a0' : '#c8cde0'; g.beginPath();
      for (var i = 0; i < 10; i++) { var r = i % 2 ? 4.5 : 10, a = -Math.PI / 2 + i * Math.PI / 5; g.lineTo(12 + Math.cos(a) * r, 12 + Math.sin(a) * r); }
      g.closePath(); g.fill();
    });
  }
  /**
   * v4.2.6 地圖修正（老闆「這個燈....重畫，太醜了」）：山屋小燈改用美術燈（和知識燈同一款，32×48）。
   * 山屋小燈一直亮著 → 點亮圖；最後一盞（final）→ 金色曙光款。回傳貼圖 key；美術圖沒讀到回傳 null（退回 lodgeLampTex 程式畫）
   */
  function lodgeLampArt(scene, kind) {
    var MI = J.MapInfo, k = MI && MI.lampArtKey ? MI.lampArtKey(kind === 'final', true) : null;
    return k && hasArt(scene, k) ? J.Assets.texKey(k) : null;
  }
  /** sprites.js 有登記、而且真的載入成功（不是佔位圖）：同 MapScene.hasArt */
  function hasArt(scene, k) {
    var A = J.Assets;
    if (!A || !A.has || !A.has(k)) return false;
    return !!(scene.textures && scene.textures.exists(A.texKey(k))) && !(A.isPlaceholder && A.isPlaceholder(scene, k));
  }
  /** v4.2.6 記號燈的圖案（71 號 2.5 D：畫旁邊書架的圖案）：不再有木牌，改成燈上方的小圓牌（2 倍解析度畫、縮回 22×22） */
  function lampBadgeTex(scene, icon) {
    var R = 2;
    var k = tex(scene, 'east:lampbadge:' + icon, 22 * R, 22 * R, function (g, w, h) {
      g.fillStyle = '#1e1a2e'; g.beginPath(); g.arc(w / 2, h / 2, w / 2 - 1, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#fff6d8'; g.beginPath(); g.arc(w / 2, h / 2, w / 2 - 1 - 2 * R, 0, Math.PI * 2); g.fill();
      g.font = (13 * R) + 'px ' + FONT; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(icon, w / 2, h / 2 + R);
    });
    return k;
  }
  /**
   * v4.2.6 地圖修正：東部程式畫的物件「有美術圖就用美術圖」。檔名、尺寸照 AUD 的 W2_需要的物件圖規格.md（美術 ART-OBJ 照這份畫）。
   * 圖放進 assets/ui/ 並在 sprites.js 登記後就會自動換上；還沒有圖（sprites.js 沒登記）時用下面程式畫的版本。
   */
  var ART = {
    flame: 'obj_trial_flame',                         // M40 試煉燈座的火焰 32×40（取代 🔥）
    plate: 'obj_constellation_plate',                 // M43 星座牌 32×24（v4.2.6 W1c；牌面空白，星數由程式疊）
    frost: 'obj_frost_arrow',                         // M38 霜箭頭 32×32（畫朝上，程式轉向）
    box_stone: 'obj_box_stone', box_ice: 'obj_box_ice',       // 推箱的箱子 32×40
    wallstone: 'obj_wall_stone', wall_ice: 'obj_wall_ice',   // 推箱房內牆 32×40
    pillar: 'obj_hanoi_pillar',                       // 疊石盤的柱子 32×48
    disc0: 'obj_hanoi_disc_0', disc1: 'obj_hanoi_disc_1', disc2: 'obj_hanoi_disc_2',   // 石盤 16／24／30×9
    star_off: 'obj_star_stone_off', star_on: 'obj_star_stone_on',   // M40 星石 32×32
    cloud: 'obj_soft_cloud',                          // M42 軟雲 32×32（邊角版 obj_soft_cloud_n… 這一輪不用，全部同一張）
    flame_2: 'obj_trial_flame_2',                     // 火焰第 2 幀（兩幀輪播約 4 fps）
    goal_stone: 'obj_box_target_stone', goal_ice: 'obj_box_target_ice',   // 推箱目標格 32×32（取代黃框）
    echo_open: 'obj_echo_door_open'                   // M37 回音謎門打開 56×56（關著時不畫，用背景的門）
  };
  // 美術 ART-OBJ 實際交的火焰是 44×48，腳底點＝石盆口內側前緣（物件圖清單.md：石環頂 y＋39；換算成燈座 seat 上緣往下 30 像素）
  // 技術長決定：用五科顏色的火焰（obj_trial_flame_<科目>）與燈座正面的科目記號（obj_trial_mark_<科目>，7×7，形狀＋顏色）
  var SUBJ_KEY = { '國語': 'kokugo', '英語': 'english', '數學': 'math', '自然': 'science', '社會': 'social' };
  Object.keys(SUBJ_KEY).forEach(function (sj) {
    var k = SUBJ_KEY[sj];
    ART['flame_' + k] = 'obj_trial_flame_' + k; ART['flame_' + k + '_2'] = 'obj_trial_flame_' + k + '_2'; ART['mark_' + k] = 'obj_trial_mark_' + k;
  });
  var FLAME_FOOT_Y = 30, FLAME_FPS_MS = 250;
  // 回音謎門打開圖：中心＝兩格門的中心，腳底＝門那一列下緣往下 18 像素（美術實測背景的門 y 220–271，圖腳底 274）
  var ECHO_OPEN_FOOT = 18;
  /** 有美術圖（sprites.js 登記且載入成功）就回傳美術圖的貼圖 key，沒有就回傳 fallback（程式畫的 key） */
  function artOr(scene, name, fallback) {
    var k = ART[name];
    return k && hasArt(scene, k) ? J.Assets.texKey(k) : (typeof fallback === 'function' ? fallback() : fallback);
  }
  /** v4.2.6 W1c：第 2 輪美術圖（ART-OBJ 第2輪）。有登記、載入成功就用，否則回 null（呼叫的地方退回原本的程式畫法） */
  var ART2 = ['obj_gate_stone', 'obj_gate_ice', 'obj_gate_wood', 'obj_scale', 'obj_weight_1', 'obj_weight_2', 'obj_weight_4', 'obj_weight_5', 'obj_num_pillar', 'obj_num_floor',
    'obj_loan_desk', 'obj_light_source', 'obj_crystal_on', 'obj_crystal_off', 'obj_mirror_slash', 'obj_mirror_backslash', 'obj_hint_arrow', 'obj_lamp_dot_on', 'obj_lamp_dot_off',
    'obj_plate_A_on', 'obj_plate_A_off', 'obj_plate_B_on', 'obj_plate_B_off', 'obj_plate_C_on', 'obj_plate_C_off', 'obj_card_back'];
  var CARD_ART = { 橡皮擦: 'eraser', 雨傘: 'umbrella', 鑰匙: 'key', 手帕: 'handkerchief' }, SHAPE_ART = { 紅: 'red', 藍: 'blue', 圓: 'circle', 三角: 'triangle', 方: 'square' };
  ART2.push('obj_shelf_sign_fish');
  for (var hci = 1; hci <= 12; hci++) ART2.push('obj_hard_cloud_SC' + hci);   // v4.2.6 W1d：M42 整朵硬雲
  ['eraser', 'umbrella', 'key', 'handkerchief'].forEach(function (k) { ART2.push('obj_card_' + k + '_open', 'obj_card_' + k + '_matched'); });
  ['wall', 'floor'].forEach(function (w) { ART2.push('obj_shape_' + w + '_blank'); ['red', 'blue'].forEach(function (c) { ['circle', 'triangle', 'square'].forEach(function (sh) { ART2.push('obj_shape_' + w + '_' + c + '_' + sh); }); }); });
  // M42 軟雲／硬雲九宮格版（QB-M42-R02、R03）：檔名後綴＝露在外面的邊（n s w e 的順序），四邊都接著別格＝沒有後綴
  ['soft', 'hard'].forEach(function (kd) { ['', '_n', '_s', '_w', '_e', '_ns', '_we', '_nw', '_ne', '_sw', '_se', '_nsw', '_nse', '_nwe', '_swe', '_nswe'].forEach(function (sf) { ART2.push('obj_' + kd + '_cloud' + sf); }); });
  /** 一朵雲（同一組 cells）裡，這一格哪幾邊沒有接著同一朵雲的格子 */
  function cloudEdgeKey(kind, cells, p, ground) {
    // ground(x,y)：背景本來就能走的雲格也算鄰居（硬雲接到實心雲時，接縫不多畫一道邊；技術長 W1c 第 4 點）
    var has = function (x, y) { return cells.some(function (q) { return q[0] === x && q[1] === y; }) || !!(ground && ground(x, y)); };
    var sf = (has(p[0], p[1] - 1) ? '' : 'n') + (has(p[0], p[1] + 1) ? '' : 's') + (has(p[0] - 1, p[1]) ? '' : 'w') + (has(p[0] + 1, p[1]) ? '' : 'e');
    return 'obj_' + kind + '_cloud' + (sf ? '_' + sf : '');
  }
  function art2(scene, k) { return k && hasArt(scene, k) ? J.Assets.texKey(k) : null; }
  function shapeArtKey(label, slab) {
    var c = SHAPE_ART[label.charAt(0)], sh = SHAPE_ART[label.slice(1)];
    return 'obj_shape_' + (slab ? 'wall' : 'floor') + '_' + (c && sh ? c + '_' + sh : 'blank');
  }
  /** 美術底圖＋程式疊的數字（數字柱、數字地板）：美術沒讀到回 null */
  function numOverlay(fx, x, y, artKey, n, stand) {
    var k = art2(fx.scene, artKey);
    if (!k) return null;
    var base = stand ? fx.stand(x, y, k) : fx.ground(x, y, k);
    var ty = stand ? (y + 1) * T - 40 + 24 : y * T + 15;   // 美術清單：數字柱牌面中心 (16,24)／40 高；地板中心 (16,15)
    var num = fx.image(x * T + T / 2, ty, textTex(fx.scene, 'east:numov:' + n + (stand ? ':p' : ':f'), String(n), 26, 18, '#fffbe8', null, 13), (stand ? (y + 1) * T : y * T + T / 2) + 1, 0.5, 0.5);
    return [base, num];
  }
  /** v4.2.6 試煉燈座的火焰（QB-M40-06）：程式畫的像素火焰（下寬上尖、白芯黃身橘邊），取代 🔥 表情符號 */
  function flameTex(scene, color) {
    return tex(scene, 'east:flame2:' + (color || ''), 32, 40, function (g) {
      function drop(cx, by, w, h, c) {
        g.fillStyle = c; g.beginPath(); g.moveTo(cx, by - h);
        g.bezierCurveTo(cx + w * 0.15, by - h * 0.6, cx + w / 2, by - h * 0.45, cx + w / 2, by - h * 0.22);
        g.arc(cx, by - h * 0.22, w / 2, 0, Math.PI);
        g.bezierCurveTo(cx - w / 2, by - h * 0.45, cx - w * 0.15, by - h * 0.6, cx, by - h); g.fill();
      }
      drop(16, 39, 28, 39, '#1e1a2e');
      drop(16, 38, 25, 36, '#ff7a2a'); drop(16, 37, 18, 27, '#ffc94a'); drop(16, 36, 10, 16, '#fff4c2');
    });
  }
  /** v4.2.6 霜箭頭（QB-M38-03）：粗的冰藍箭頭＋深藍外框（白冰地上也看得到），畫朝上，程式轉向 */
  function frostArrowTex(scene) {
    return tex(scene, 'east:frost2', 32, 32, function (g) {
      g.beginPath(); g.moveTo(16, 3); g.lineTo(28, 15); g.lineTo(21, 15); g.lineTo(21, 29); g.lineTo(11, 29); g.lineTo(11, 15); g.lineTo(4, 15); g.closePath();
      g.fillStyle = 'rgba(122,200,255,0.92)'; g.fill(); g.lineJoin = 'round'; g.lineWidth = 2.5; g.strokeStyle = '#123a6a'; g.stroke();
      g.fillStyle = 'rgba(255,255,255,0.85)'; g.fillRect(14, 9, 3, 16);
    });
  }
  /** v4.2.6 W1b（技術長：「↺」「oo」不要像佔位圖）：冰房重來點＝冰藍圓章＋用線條畫的迴轉箭頭（不用字型），風格同霜箭頭（冰藍底、深藍外框、白高光） */
  function iceResetTex(scene) {
    return tex(scene, 'east:reset2', 30, 30, function (g) {
      g.beginPath(); g.arc(15, 15, 13, 0, Math.PI * 2); g.fillStyle = 'rgba(122,200,255,0.88)'; g.fill(); g.lineWidth = 2.5; g.strokeStyle = '#123a6a'; g.stroke();
      g.beginPath(); g.arc(15, 15, 7, Math.PI * 0.15, Math.PI * 1.75); g.lineWidth = 3; g.strokeStyle = '#ffffff'; g.lineCap = 'round'; g.stroke();
      g.beginPath(); g.moveTo(21.5, 6.5); g.lineTo(22.5, 13.5); g.lineTo(15.5, 11.5); g.closePath(); g.fillStyle = '#ffffff'; g.fill();
      g.lineWidth = 1; g.strokeStyle = '#123a6a'; g.stroke();
    });
  }
  /** v4.2.6 W1b：冰柱上的點數牌（P2-3 提示）＝冰晶小牌（圓角、冰藍漸層、深藍外框），點數畫成菱形冰晶（不用「•」字） */
  function iceDotsTex(scene, n) {
    return tex(scene, 'east:icedots2:' + n, 32, 20, function (g, w, h) {
      var r = 5; g.beginPath(); g.moveTo(r + 1, 1); g.lineTo(w - r - 1, 1); g.quadraticCurveTo(w - 1, 1, w - 1, r + 1); g.lineTo(w - 1, h - r - 1); g.quadraticCurveTo(w - 1, h - 1, w - r - 1, h - 1);
      g.lineTo(r + 1, h - 1); g.quadraticCurveTo(1, h - 1, 1, h - r - 1); g.lineTo(1, r + 1); g.quadraticCurveTo(1, 1, r + 1, 1); g.closePath();
      var gr = g.createLinearGradient ? g.createLinearGradient(0, 0, 0, h) : null;
      if (gr) { gr.addColorStop(0, '#d8f2ff'); gr.addColorStop(1, '#7ec4ef'); g.fillStyle = gr; } else g.fillStyle = '#a8dcf7';
      g.fill(); g.lineWidth = 2; g.strokeStyle = '#123a6a'; g.stroke();
      var gap = 8, x0 = w / 2 - (n - 1) * gap / 2;
      for (var i = 0; i < n; i++) { var cx = x0 + i * gap; g.beginPath(); g.moveTo(cx, 5); g.lineTo(cx + 3.5, 10); g.lineTo(cx, 15); g.lineTo(cx - 3.5, 10); g.closePath(); g.fillStyle = '#ffffff'; g.fill(); g.lineWidth = 1.2; g.strokeStyle = '#123a6a'; g.stroke(); }
    });
  }
  /** v4.2.6 推箱的箱子與內牆（QB-M40-09）：箱子＝木框箱（亮、十字木條、提把），內牆＝深色粗石柱（暗、頂面平、有裂紋），一眼分得出 */
  function crateTex(scene, ice) {
    return tex(scene, 'east:block:box_' + (ice ? 'ice' : 'stone'), 32, 40, function (g) {
      var face = ice ? '#cfeeff' : '#c79a5e', dark = ice ? '#5c9cc4' : '#6b4521', top = ice ? '#eef9ff' : '#e0b778';
      g.fillStyle = '#1e1a2e'; g.fillRect(3, 9, 26, 30); g.fillRect(4, 5, 24, 6);
      g.fillStyle = top; g.fillRect(5, 6, 22, 6);
      g.fillStyle = face; g.fillRect(5, 12, 22, 25);
      g.strokeStyle = dark; g.lineWidth = 3; g.beginPath(); g.moveTo(6, 13); g.lineTo(26, 36); g.moveTo(26, 13); g.lineTo(6, 36); g.stroke();
      g.lineWidth = 2; g.strokeRect(6, 13, 20, 23);
      g.fillStyle = dark; g.fillRect(13, 7, 6, 3);
    });
  }
  function wallRockTex(scene, ice) {
    return tex(scene, ice ? 'east:block:wall_ice' : 'east:block:wallstone', 32, 40, function (g) {
      var face = ice ? '#7fa9c8' : '#4a4440', top = ice ? '#a9cbe2' : '#6c6560', crack = ice ? '#3d6a8c' : '#24201e';
      g.fillStyle = '#121018'; g.fillRect(1, 2, 30, 38);
      g.fillStyle = top; g.fillRect(2, 3, 28, 9);
      g.fillStyle = face; g.fillRect(2, 12, 28, 27);
      g.strokeStyle = crack; g.lineWidth = 2; g.beginPath(); g.moveTo(9, 13); g.lineTo(12, 22); g.lineTo(8, 30); g.moveTo(22, 14); g.lineTo(19, 25); g.lineTo(24, 37); g.moveTo(2, 25); g.lineTo(30, 25); g.stroke();
    });
  }
  /** v4.2.6 疊石盤的柱子（QB-M40-11）：寬石座＋細石柱，三根都畫（空柱也看得到） */
  function pillarTex(scene) {
    return tex(scene, 'east:hanoi:pillar', 32, 48, function (g) {
      g.fillStyle = '#1e1a2e'; g.fillRect(2, 38, 28, 10); g.fillRect(13, 4, 6, 36);
      g.fillStyle = '#9aa2b4'; g.fillRect(3, 39, 26, 8); g.fillStyle = '#c3c9d6'; g.fillRect(3, 39, 26, 2);
      g.fillStyle = '#b4bccb'; g.fillRect(14, 5, 4, 34); g.fillStyle = '#e1e5ee'; g.fillRect(14, 5, 1, 34);
    });
  }
  /** v4.2.6 石盤（小 16、中 24、大 30 寬，9 高；金、銀、銅），外框深色 */
  // 燈座在背景切出來的上層格（深度 40000，畫在角色上面）裡：火焰要畫在上層格之上才看得到（舊的 🔥 就是被盆緣蓋掉大半）；夜路藍色層 40002 之下
  var FLAME_DEPTH = 40001;
  var DISC_W = [16, 24, 30], DISC_H = 9, DISC_STEP = 8;
  function discTex(scene, size) {
    var w = DISC_W[size] || 20;
    return tex(scene, 'east:disc2:' + size, w, DISC_H, function (g) {
      var c = [['#ffe07a', '#c8962a'], ['#e6ebf2', '#8a93a6'], ['#d29a6a', '#7a4a2a']][size] || ['#bbb', '#666'];
      g.fillStyle = '#1e1a2e'; g.fillRect(0, 0, w, DISC_H);
      g.fillStyle = c[1]; g.fillRect(1, 1, w - 2, DISC_H - 2);
      g.fillStyle = c[0]; g.fillRect(1, 1, w - 2, 3);
    });
  }
  /** v4.2.6 M40 星石（QB-M40-07）：嵌在地上的五角星石＋號碼；沒亮灰藍、亮金黃（取代灰／黃色橢圓字牌） */
  function starStoneTex(scene, label, on) {
    return tex(scene, 'east:starstone:' + label + ':' + (on ? 1 : 0), 32, 32, function (g) {
      g.beginPath();
      for (var i = 0; i < 10; i++) { var r = i % 2 ? 6.5 : 15, a = -Math.PI / 2 + i * Math.PI / 5; g.lineTo(16 + Math.cos(a) * r, 17 + Math.sin(a) * r); }
      g.closePath(); g.fillStyle = on ? '#ffd84a' : '#7d86a0'; g.fill(); g.lineWidth = 2; g.strokeStyle = on ? '#fff6c8' : '#2b3040'; g.stroke();
      g.font = 'bold 11px ' + FONT; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = on ? '#5a3a00' : '#eef1f8'; g.fillText(label, 16, 18);
    });
  }
  /** 星石：美術 obj_star_stone_on／off 優先（號碼由程式另外疊在上面），沒有就用程式畫的五角星石 */
  function starStone(scene, label, on) {
    var ak = ART[on ? 'star_on' : 'star_off'];
    if (!hasArt(scene, ak)) return starStoneTex(scene, label, on);
    // 美術星石（星中央是平的）＋程式疊號碼：粗體 12px、深色描邊，32×32 下看得清楚（技術長：用清楚的字）
    var src = scene.textures.get(J.Assets.texKey(ak)).getSourceImage();
    return tex(scene, 'east:starstoneart:' + label + ':' + (on ? 1 : 0), 32, 32, function (g) {
      g.drawImage(src, 0, 0);
      g.font = 'bold 12px ' + FONT; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.lineWidth = 3; g.strokeStyle = on ? '#fff6c8' : '#1e1a2e'; g.strokeText(label, 16, 17);
      g.fillStyle = on ? '#5a3a00' : '#ffffff'; g.fillText(label, 16, 17);
    });
  }
  /** 硬雲（M41 雲階；v4.2.6 起 M42 軟雲答對變硬後也畫這張，不靠背景） */
  function hardCloudTex(scene) {
    return tex(scene, 'east:cloud:hard', 40, 40, function (g) {
      g.fillStyle = 'rgba(255,255,255,0.95)';
      [[12, 24, 11], [24, 20, 12], [30, 27, 9], [18, 29, 10]].forEach(function (c) { g.beginPath(); g.arc(c[0], c[1], c[2], 0, Math.PI * 2); g.fill(); });
      g.strokeStyle = 'rgba(190,205,235,0.9)'; g.lineWidth = 2; g.beginPath(); g.moveTo(4, 34); g.lineTo(36, 34); g.stroke();
    });
  }
  /** v4.2.6 M42 軟雲（QB-M42-02）：淡紫灰、半透明、蓬鬆＋細風紋，沒有虛線外框；一格一張、相鄰接得起來，和背景的實心白雲明顯不同 */
  function softCloudTex2(scene) {
    return tex(scene, 'east:cloud:soft', 32, 32, function (g) {   // v4.2.6：沿用舊的貼圖名稱（v40_ch7 S40-6 檢查程式備援圖有畫）
      g.fillStyle = 'rgba(196,184,236,0.55)';
      [[6, 18, 9], [16, 13, 10], [26, 18, 9], [16, 22, 10]].forEach(function (c) { g.beginPath(); g.arc(c[0], c[1], c[2], 0, Math.PI * 2); g.fill(); });
      g.strokeStyle = 'rgba(120,104,190,0.7)'; g.lineWidth = 1.5;
      g.beginPath(); g.moveTo(5, 14); g.quadraticCurveTo(13, 10, 20, 14); g.moveTo(11, 23); g.quadraticCurveTo(19, 19, 27, 23); g.stroke();
    });
  }
  function lodgeLampTex(scene, kind, icon) {
    return tex(scene, 'east:lodge:' + kind + ':' + (icon || ''), 26, 44, function (g) {
      g.fillStyle = '#5a3a22'; g.fillRect(12, 14, 3, 28);                                  // 柱子
      g.fillStyle = kind === 'final' ? '#ffd34d' : '#ffb347'; g.beginPath(); g.arc(13, 10, 7, 0, Math.PI * 2); g.fill();   // 小提燈
      g.strokeStyle = '#3a2410'; g.lineWidth = 2; g.stroke();
      g.fillStyle = '#b07a4a'; g.fillRect(2, 24, 22, 13); g.strokeStyle = '#3a2410'; g.strokeRect(2, 24, 22, 13);   // 木牌
      if (icon) { g.font = '11px ' + FONT; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(icon, 13, 31); }
    });
  }
  function arrowTex(scene) {
    return tex(scene, 'east:arrow', 28, 28, function (g) {
      g.fillStyle = '#ffd34d'; g.strokeStyle = '#5a3a00'; g.lineWidth = 2;
      g.beginPath(); g.moveTo(26, 14); g.lineTo(12, 3); g.lineTo(12, 9); g.lineTo(2, 9); g.lineTo(2, 19); g.lineTo(12, 19); g.lineTo(12, 25); g.closePath(); g.fill(); g.stroke();
    });
  }
  function fogTex(scene, mapId, radiusTiles) {
    var S = 4, w = Math.ceil(VIEW_W * 3 / S), h = Math.ceil(VIEW_H * 3 / S), color = FOG_COLOR[mapId] || '#6b7280';
    return tex(scene, 'east:fog:' + color + ':' + radiusTiles, w, h, function (g) {
      g.fillStyle = color; g.fillRect(0, 0, w, h);
      var r = radiusTiles * T / S, gr = g.createRadialGradient(w / 2, h / 2, r * 0.55, w / 2, h / 2, r);
      gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.globalCompositeOperation = 'destination-out'; g.fillStyle = gr; g.beginPath(); g.arc(w / 2, h / 2, r, 0, Math.PI * 2); g.fill();
      g.globalCompositeOperation = 'source-over';
    });
  }
  function dotTex(scene) { return tex(scene, 'east:dot', 10, 10, function (g) { g.fillStyle = 'rgba(255,214,90,0.85)'; g.beginPath(); g.arc(5, 5, 3.5, 0, Math.PI * 2); g.fill(); }); }

  // ═════════════════════ EastFx：一張地圖一個 ═════════════════════
  function Fx(scene) {
    this.scene = scene; this.mapId = scene.mapId; this.map = scene.map;
    this.P = EF.parse(scene.map, scene.mapId, window.PUZZLES || {}, window.LOST_ITEMS || {});
    (this.P.issues || []).forEach(function (m) { console.warn('[東部] ' + scene.mapId + ' ' + m); });
    this.block = {}; this.objs = {}; this.rt = {}; this.hintLv = {}; this.imgs = {}; this.all = [];
    this.hiddenChests = {}; this.planning = false; this.area = null; this.arrow = null; this.dots = []; this.fog = null; this.tools = null;
    this.reduced = reduced();
  }
  Fx.prototype.state = function () { return G().state; };
  Fx.prototype.add = function (o) { if (o) this.all.push(o); return o; };
  /** 拿掉一個物件（也從清單裡移除，玩很久清單不會越積越多） */
  Fx.prototype.drop = function (o) {
    if (!o) return;
    try { if (o.destroy) o.destroy(); } catch (e) { /* 已經被 Phaser 清掉 */ }
    var i = this.all.indexOf(o); if (i >= 0) this.all.splice(i, 1);
  };
  Fx.prototype.image = function (x, y, k, depth, ox, oy) { return this.add(this.scene.add.image(x, y, k).setOrigin(ox === undefined ? 0.5 : ox, oy === undefined ? 1 : oy).setDepth(depth)); };
  /** 立著的東西（門、箱子、山屋小燈…）：腳底貼在格子下緣，深度＝腳底 y（和角色一起前後排序） */
  Fx.prototype.stand = function (x, y, k) { return this.image(x * T + T / 2, (y + 1) * T, k, (y + 1) * T - 1); };
  /** 地上的東西（踏板、記號、目標格）：貼在格子上，在角色下面 */
  Fx.prototype.ground = function (x, y, k) { return this.image(x * T + T / 2, y * T + T / 2, k, DEPTH.GROUND, 0.5, 0.5); };
  /** 補間動畫。「減少動態效果」時不播：一直重複的（呼吸、漂浮）直接略過、來回的（晃一下）不動，其他的直接跳到結果 */
  Fx.prototype.tween = function (cfg) {
    if (!this.reduced && this.scene.tweens) return this.scene.tweens.add(cfg);
    if (cfg.repeat === -1) return null;
    if (!cfg.yoyo) {
      var targets = Array.isArray(cfg.targets) ? cfg.targets : [cfg.targets];
      Object.keys(cfg).forEach(function (k) {
        if (['targets', 'duration', 'yoyo', 'repeat', 'ease', 'onComplete', 'delay'].indexOf(k) >= 0 || typeof cfg[k] !== 'number') return;
        targets.forEach(function (t) { if (t) t[k] = cfg[k]; });
      });
    }
    if (cfg.onComplete) cfg.onComplete();
    return null;
  };
  Fx.prototype.later = function (ms, fn) { if (this.scene.time && this.scene.time.delayedCall) return this.scene.time.delayedCall(ms, fn); return setTimeout(fn, ms); };
  Fx.prototype.cell = function (x, y) { var row = (this.map.grid || [])[y]; return row === undefined || x < 0 || x >= row.length ? ' ' : row.charAt(x); };
  Fx.prototype.iceAt = function (x, y) { return !!Ice.roomAt(this.P.iceRooms, this.cell.bind(this), x, y); };
  Fx.prototype.blocks = function (x, y) { var k = key(x, y); return !!this.block[k] || (this.planning && this.iceAt(x, y) && !(this.scene.p && this.scene.p.tx === x && this.scene.p.ty === y)); };
  Fx.prototype.puzzle = function (id) { return this.P.puzzles.filter(function (p) { return p.id === id; })[0] || null; };
  Fx.prototype.rtOf = function (pz) { if (!this.rt[pz.id]) this.rt[pz.id] = CP.init(pz.def); return this.rt[pz.id]; };

  // ───────── 建立 ─────────
  Fx.prototype.build = function () {
    var self = this, P = this.P, st = this.state();
    EF.progress(st);
    // 山屋小燈（回復＋存檔；71 號 2.1、2.12）
    self.imgs.lamps = [];
    P.lamps.forEach(function (l) {
      // v4.2.6：美術燈（32×48，腳底貼格子下緣中央）優先；沒讀到才用程式畫的。draw:false＝背景已畫燈，不畫圖、只留互動格與光暈
      var art = lodgeLampArt(self.scene, l.kind), img = null;
      if (l.draw !== false) {
        img = self.stand(l.x, l.y, art || lodgeLampTex(self.scene, l.kind, l.icon));
        if (art && img.setDisplaySize) img.setDisplaySize(LAMP_W, LAMP_H);
      }
      var badge = null;
      if (art && l.icon) {   // 記號燈：圖案畫在燈的上方（美術燈沒有木牌）；背景燈也一樣畫在燈頂上方
        badge = self.image(l.x * T + T / 2, (l.y + 1) * T - LAMP_H - 1, lampBadgeTex(self.scene, l.icon), (l.y + 1) * T - 1, 0.5, 1);
        if (badge.setScale) badge.setScale(0.5);
      }
      self.imgs.lamps.push({ lamp: l, img: img, art: !!art, badge: badge });
      // 光暈由 MapScene 管：美術燈對準火焰（腳底上方 GLOW_Y）；程式畫的舊燈照舊（格子中心上方 8 像素）
      if (self.scene.addGlow) self.scene.addGlow(l.x * T + T / 2, art || l.draw === false ? (l.y + 1) * T - LAMP_GLOW_Y : l.y * T + T / 2 - 8, art || l.draw === false ? 0.8 : 0.6);
      self.objs[key(l.x, l.y)] = { kind: 'east', what: 'lamp', lamp: l, prompt: l.kind === 'marker' ? '點亮記號燈（回復、存檔）' : '點亮山屋小燈（回復、存檔）' };
    });
    if (P.echoDoor) {
      // v4.2.6 地圖修正（QB-M37-01：背景畫好的「大嘴巴」回音謎門被兩塊灰方塊整個蓋住）：不畫方塊，用背景的門（只擋路、可互動）
      this.imgs.echo = [];
      var ex = P.echoDoor.cells.map(function (c) { return c[0]; }), ey = P.echoDoor.cells.map(function (c) { return c[1]; });
      var eo = artOr(self.scene, 'echo_open', null);
      this.imgs.echoOpen = eo ? this.image((Math.min.apply(null, ex) + Math.max.apply(null, ex) + 1) / 2 * T, (Math.max.apply(null, ey) + 1) * T + ECHO_OPEN_FOOT, eo, (Math.max.apply(null, ey) + 1) * T - 1, 0.5, 1) : null;
      if (this.imgs.echoOpen && this.imgs.echoOpen.setVisible) this.imgs.echoOpen.setVisible(EF.has(st, 'done', 'echo_' + P.id));
      P.echoDoor.cells.forEach(function (c) { self.objs[key(c[0], c[1])] = { kind: 'east', what: 'echo', prompt: '摸摸回音謎門' }; });
    }
    // 每一道各自建：資料有問題的那一道略過（不能玩、也不擋路），其他照常；主控台寫原因
    P.puzzles = P.puzzles.filter(function (pz) {
      try { self.buildPuzzle(pz); return true; } catch (e) {
        console.error('[東部] ' + self.mapId + ' 機關 ' + pz.id + ' 畫不出來，先略過：', e);
        Object.keys(self.objs).forEach(function (k) { if (self.objs[k].pz === pz) delete self.objs[k]; });
        // 已經畫出來的（例如石門）也藏起來：略過的機關不擋路，畫面上也不要留一扇門
        (function hideAll(v) { if (!v) return; if (Array.isArray(v)) v.forEach(hideAll); else if (v.setVisible) v.setVisible(false); else if (typeof v === 'object') Object.keys(v).forEach(function (k) { hideAll(v[k]); }); })(self.imgs[pz.id]);
        if (pz.rewardChest) self.showChest(pz.rewardChest);
        EastFx.failed = (EastFx.failed || []).concat([self.mapId + ' ' + pz.id + '：' + (e && e.message)]);
        return false;
      }
    });
    this.buildIce();
    P.decals.forEach(function (d) {
      if (d.type === 'ice_pillar_dots') self.stand(d.x, d.y, iceDotsTex(self.scene, d.dots));   // v4.2.6 W1b：冰晶小牌（不再是字型「•」）
      else {   // v4.2.6（QB-M38-03）：霜箭頭改成粗的冰藍箭頭（美術 obj_frost_arrow 優先），依方向轉
        var fa = self.ground(d.x, d.y, artOr(self.scene, 'frost', function () { return frostArrowTex(self.scene); }));
        if (fa.setAngle) fa.setAngle({ N: 0, E: 90, S: 180, W: 270 }[d.dir] || 0);
      }
    });
    // 書架的圖案牌（放大 1.5 倍、從遠處看得到；71 號 2.5、2.12）
    // v4.2.6 地圖修正（QB-M39-03：背景已在每座書架上畫了分類木牌，程式又疊一塊白底圖示牌）：背景牌已經清楚，不再疊。
    // 地圖資料 shelves[].draw_sign === true（背景沒畫牌的書架）才照舊畫
    P.shelves.forEach(function (s) {
      if (s.drawSign !== true) return;
      // v4.2.6 W1c（QB-M39-R01：動物書架背景沒畫牌）：美術 obj_shelf_sign_<icon>（和背景同款的吊牌）掛在書架頂板正中，比照背景的食物牌位置
      var sk = art2(self.scene, 'obj_shelf_sign_' + s.icon);
      if (sk) { self.image((s.area[0] + s.area[2] + 1) / 2 * T, s.area[1] * T + 8, sk, (s.area[3] + 1) * T, 0.5, 0); return; }
      var img = self.image((s.area[0] + s.area[2] + 1) / 2 * T, s.area[1] * T + 2, emojiTex(self.scene, 'east:shelf:' + s.icon, s.emoji, 30, 26, function (g, w, h) { g.fillStyle = '#7a5230'; g.fillRect(0, 0, w, h); g.fillStyle = '#f3e1b5'; g.fillRect(2, 2, w - 4, h - 4); }), (s.area[3] + 1) * T, 0.5, 0);
      if (img.setScale) img.setScale(1.5);
    });
    this.buildLost();
    this.buildTrialLamps();
    this.buildClouds();
    this.buildStars();
    if (P.lightPillar && P.lightPillar.cells.length) {
      var xs = P.lightPillar.cells.map(function (c) { return c[0]; }), ys = P.lightPillar.cells.map(function (c) { return c[1]; });
      var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
      // v4.2.10 T2（老闆 11-22 截圖：光柱中間一塊比較亮的長方形）：以前是硬邊的長方形；改成左右、上下都漸淡的柔光（同位置、同大小、同顏色）
      var bw = (x1 - x0 + 1) * T, bh = (y1 - y0 + 4) * T;
      var bk = tex(this.scene, 'east:pillar:beam:' + bw + 'x' + bh, bw, bh, function (g, w, h) {
        var hz = g.createLinearGradient(0, 0, w, 0);
        hz.addColorStop(0, 'rgba(255,242,176,0)'); hz.addColorStop(0.3, 'rgba(255,242,176,0.8)'); hz.addColorStop(0.5, 'rgba(255,242,176,1)');
        hz.addColorStop(0.7, 'rgba(255,242,176,0.8)'); hz.addColorStop(1, 'rgba(255,242,176,0)');
        g.fillStyle = hz; g.fillRect(0, 0, w, h);
        g.globalCompositeOperation = 'destination-in';
        var vt = g.createLinearGradient(0, 0, 0, h);
        vt.addColorStop(0, 'rgba(0,0,0,0)'); vt.addColorStop(0.35, 'rgba(0,0,0,1)'); vt.addColorStop(0.85, 'rgba(0,0,0,1)'); vt.addColorStop(1, 'rgba(0,0,0,0)');
        g.fillStyle = vt; g.fillRect(0, 0, w, h);
        g.globalCompositeOperation = 'source-over';
      });
      var beam = this.add(this.scene.add.image((x0 + x1 + 1) / 2 * T, (y1 + 1) * T, bk).setOrigin(0.5, 1).setAlpha(0.25).setDepth((y1 + 1) * T + 1));
      if (beam.setBlendMode) beam.setBlendMode(ADD);
      this.imgs.pillar = beam;
      this.pillarGlow();
    }
    if (P.nightZone) {
      var a = P.nightZone.area;
      this.imgs.night = this.add(this.scene.add.rectangle(a[0] * T, a[1] * T, a[2] * T, a[3] * T, 0x1a2a6a, 0.32).setOrigin(0, 0).setDepth(DEPTH.NIGHT));
    }
    P.signs.forEach(function (s) {
      // v4.2.6 地圖修正（QB-M44-01：入口木牌畫成黑框寫「木牌」兩個字＝佔位字）：改用路牌的美術圖 obj_road_sign（32×48）；
      // 沒讀到才用 MapScene 程式畫的路牌（roadSignTexture，同一個木樁＋橫木牌的樣子）。字只在按 A 看木牌時出現
      var sk = hasArt(self.scene, 'obj_road_sign') ? J.Assets.texKey('obj_road_sign') : (self.scene.roadSignTexture ? self.scene.roadSignTexture() : null);
      if (sk) self.stand(s.x, s.y, sk);
      self.objs[key(s.x, s.y)] = { kind: 'east', what: 'sign', sign: s, prompt: '看看木牌' };
    });
    this.buildCloudStairs();
    this.refreshBlocks();
    this.buildFog();
    this.buildTools();
    this.relocateIfBlocked();
    this.track();
    this.refreshDots();
    // 71 號 2.12：第一次進 M37 時霧仔說一次「洞窟裡霧太濃，看不到地圖，跟著羅盤走吧！」
    if (P.noMinimap && P.id === 'M37' && !EF.has(st, 'done', 'tip_nomap')) {
      var sc = this.scene;
      this.later(700, function () {
        var g = G();
        if (!g || g.mapScene !== sc || sc.eastFx !== self || (g.blocked && g.blocked())) return;
        EF.mark(g.state, 'done', 'tip_nomap'); g.save();
        logp('tip:nomap');
        sayId('D_CAVE_NOMAP', EF.NO_MAP_TIP);
      });
    }
  };

  /** 進場時主角剛好站在擋路的格子上（例如存檔在推箱房間裡）→ 搬到最近的空格（推箱房間：起點） */
  Fx.prototype.relocateIfBlocked = function () {
    var sc = this.scene, p = sc.p;
    if (!p || !this.blocks(p.tx, p.ty)) return;
    var self = this, sk = this.P.puzzles.filter(function (pz) { return pz.type === 'sokoban' && EF.inRect(p.tx, p.ty, pz.area); })[0];
    var to = sk && sk.cells.enterTo && !this.blocks(sk.cells.enterTo[0], sk.cells.enterTo[1]) ? { c: sk.cells.enterTo[0], r: sk.cells.enterTo[1] }
      : (J.Pathfind && J.Pathfind.nearestWalkable ? J.Pathfind.nearestWalkable(function (x, y) { return sc.walkable(x, y); }, sc.size.w, sc.size.h, { c: p.tx, r: p.ty }) : null);
    if (to) this.place(to.c, to.r);
    self.relocated = (self.relocated || 0) + 1;
  };
  Fx.prototype.place = function (x, y) {
    var sc = this.scene, p = sc.p;
    p.tx = x; p.ty = y; p.moving = false; p.path = []; p.pending = null; p.prev = { x: x, y: y };
    if (sc.player && sc.player.setPosition) sc.player.setPosition(x * T + T / 2, (y + 1) * T);
    // 番薯仔跟著一起過去（推箱房間的門、冰房間回入口：不然牠會隔著牆追過來）
    if (sc.pet && sc.player) { sc.pet.x = sc.player.x; sc.pet.y = sc.player.y; sc.petTarget = { x: sc.player.x, y: sc.player.y }; }
    var g = G(); if (g && g.state) g.state.location = { map: this.mapId, x: x, y: y };
  };

  // ───────── 擋路 ─────────
  Fx.prototype.refreshBlocks = function () {
    var self = this, st = this.state();
    this.block = EF.blockedCells(this.P, st);
    this.P.puzzles.forEach(function (pz) {
      if (pz.type !== 'sokoban') return;
      self.boxCells(pz).forEach(function (c) { self.block[key(c[0], c[1])] = pz.id + ':box'; });
    });
    // 還沒解開的機關的獎勵寶箱：看不到、不擋路（解開才出現）
    Object.keys(this.hiddenChests).forEach(function (id) { var c = self.hiddenChests[id].data; if (self.scene.blocked) delete self.scene.blocked[key(c.x, c.y)]; });
  };
  Fx.prototype.boxCells = function (pz) {
    var o = pz.origin, rt = CP.solved(this.state(), pz.id) ? { boxes: CP.sokoParse(pz.def.data.rows).goals } : this.rtOf(pz);
    return rt.boxes.map(function (b) { return [o[0] + b[0], o[1] + b[1]]; });
  };

  // ───────── 機關：畫面 ─────────
  Fx.prototype.buildPuzzle = function (pz) {
    var self = this, sc = this.scene, st = this.state(), C = pz.cells, solved = CP.solved(st, pz.id), I = this.imgs[pz.id] = {};
    if (pz.rewardChest && !solved) this.hideChest(pz.rewardChest);
    switch (pz.type) {
      case 'lights': {
        var keys = CP.lightKeys(pz.def), tg = CP.lightToggles(pz.def);
        I.plates = {}; I.dots = [];
        var door = C.door || [];
        // 門上的燈（P1-1：三盞；P4-2 沒有門，燈＝星石本身）
        if (door.length) {
          I.door = door.map(function (c) { return self.stand(c[0], c[1], blockTex(sc, 'door')); });
          // 門上的燈平均排在門的正中間（門 1–3 格寬都不會疊在一起；燈之間 10px）
          var dcx = door.reduce(function (s, c) { return s + c[0]; }, 0) / door.length * T + T / 2, dcy = door[0][1];
          for (var i = 0; i < pz.def.data.n; i++) I.dots.push(this.image(dcx + (i - (pz.def.data.n - 1) / 2) * Math.min(T, Math.max(12, door.length * T / pz.def.data.n)), dcy * T + (art2(sc, 'obj_gate_stone') ? -7 : 6), lampDotTex(sc, false), (dcy + 1) * T + 1, 0.5, 0.5));
          // 踏板和燈之間的發光線
          var gl = this.add(sc.add.graphics().setDepth(DEPTH.BEAM));
          if (gl.lineStyle) gl.lineStyle(2, 0x9fe8ff, 0.45);
          keys.forEach(function (k) { var p0 = C.plates[k]; tg[k].forEach(function (li) { var d = I.dots[li]; if (d && gl.lineBetween) gl.lineBetween(p0[0] * T + T / 2, p0[1] * T + T / 2, d.x, d.y); }); });
          I.lines = gl;
        }
        I.star = !door.length;   // v4.2.6（QB-M40-07）：五角星盤的星石畫成五角星石（美術 obj_star_stone_* 優先）
        keys.forEach(function (k) { var c = C.plates[k]; I.plates[k] = self.ground(c[0], c[1], I.star ? starStone(sc, k, false) : plateTex(sc, k, false)); });
        if (!door.length) {   // 五角星盤：相鄰的星石之間畫淡淡的線（看得出「左右兩顆」）
          var g2 = this.add(sc.add.graphics().setDepth(DEPTH.GROUND - 0.5));
          if (g2.lineStyle) g2.lineStyle(2, 0xc8b8ff, 0.4);
          keys.forEach(function (k, i2) { var a = C.plates[k], b = C.plates[keys[(i2 + 1) % keys.length]]; if (g2.lineBetween) g2.lineBetween(a[0] * T + T / 2, a[1] * T + T / 2, b[0] * T + T / 2, b[1] * T + T / 2); });
          I.ring = g2;
        }
        break;
      }
      case 'pattern': {
        var seq = CP.patternSeq(pz.def, pz.def.data.length);
        I.slabs = (C.slabs || []).map(function (c, i3) { return self.stand(c[0], c[1], shapeTex(sc, seq[i3] || '？', true)); });
        (C.floors || []).forEach(function (c, i4) {
          self.ground(c[0], c[1], shapeTex(sc, pz.def.data.options[i4], false));
          self.objs[key(c[0], c[1])] = { kind: 'east', what: 'floor', pz: pz, idx: i4, prompt: '選「' + pz.def.data.options[i4] + '」' };   // 提示按鈕寫出是哪一塊（站在兩塊中間時不會選錯）
        });
        break;
      }
      case 'numseq': {
        var ns = CP.numSeq(pz.def, pz.def.data.length);
        (C.pillars || []).forEach(function (c, i5) { if (!numOverlay(self, c[0], c[1], 'obj_num_pillar', ns[i5], true)) self.stand(c[0], c[1], textTex(sc, 'east:num:pillar:' + ns[i5], String(ns[i5]), 30, 30, '#0b3a5a', '#d6f1ff', 15)); });   // v4.2.6 W1c：美術數字柱＋程式疊數字
        (C.floors || []).forEach(function (c, i6) {
          var n = pz.def.data.options[i6];
          if (!numOverlay(self, c[0], c[1], 'obj_num_floor', n, false)) self.ground(c[0], c[1], textTex(sc, 'east:num:floor:' + n, String(n), 30, 30, '#fffbe8', '#4a78a8', 15));
          self.objs[key(c[0], c[1])] = { kind: 'east', what: 'floor', pz: pz, idx: i6, prompt: '選 ' + n };
        });
        I.gate = (C.gate || []).map(function (c) { return self.stand(c[0], c[1], blockTex(sc, 'ice')); });
        break;
      }
      case 'memory': {
        I.cards = (C.cards || []).map(function (c, i7) {   // 石牌平放在地上（不擋路；站上去或站在旁邊按 A 翻牌）
          self.objs[key(c[0], c[1])] = { kind: 'east', what: 'card', pz: pz, idx: i7, prompt: '翻第 ' + (i7 + 1) + ' 張石牌' };   // 提示文字要不一樣（HUD.prompt 文字相同時不換按的對象）
          return self.ground(c[0], c[1], art2(sc, 'obj_card_back') || textTex(sc, 'east:card:back', '？', 28, 30, '#fffbe8', '#5d6470', 16));   // v4.2.6 W1c：美術翻牌
        });
        break;
      }
      case 'balance': {
        if (C.scale) {
          I.scale = this.stand(C.scale[0], C.scale[1], blockTex(sc, 'scale'));
          if (art2(sc, 'obj_scale')) {   // v4.2.6 W1c：美術天平 56×44（腳底＝格下緣中央）：左盤數字 (11,21)、右盤 (45,21)（圖內像素）
            var sx0 = C.scale[0] * T + T / 2 - 28, sy0 = (C.scale[1] + 1) * T - 44, dep = (C.scale[1] + 1) * T + 2;
            I.scaleL = this.image(sx0 + 11, sy0 + 21, textTex(sc, 'east:scaleN:' + pz.def.data.left + ':w', String(pz.def.data.left), 16, 14, '#fffbe8', null, 9), dep, 0.5, 0.5);
            I.scaleR = this.image(sx0 + 45, sy0 + 21, textTex(sc, 'east:scaleN:0:w', '0', 16, 14, '#fffbe8', null, 9), dep, 0.5, 0.5);
          } else I.scaleText = this.image(C.scale[0] * T + T / 2, C.scale[1] * T - 2, textTex(sc, 'east:scale:7|0', '7｜0', 44, 18, '#fffbe8', 'rgba(11,18,54,.75)', 12), (C.scale[1] + 1) * T + 2);
        }
        I.stones = (C.stones || []).map(function (c, i8) {
          var kg = pz.def.data.stones[i8];
          self.objs[key(c[0], c[1])] = { kind: 'east', what: 'stone', pz: pz, idx: i8, prompt: '把 ' + kg + ' 公斤的石頭放上天平（或拿下來）' };
          var wk = art2(sc, 'obj_weight_' + kg), WC = { 1: [15, 26], 2: [16, 25], 4: [14, 23], 5: [16, 20] }[kg];
          if (wk && WC) {   // v4.2.6 W1c：美術砝碼石（越重越大）＋程式在牌面寫數字（美術清單的牌面中心，圖內像素）
            var wimg = self.stand(c[0], c[1], wk);
            wimg.__num = self.image(c[0] * T + WC[0], (c[1] + 1) * T - 32 + WC[1], textTex(sc, 'east:kgN:' + kg, String(kg), 12, 12, '#fffbe8', null, kg === 1 ? 7 : 8), (c[1] + 1) * T, 0.5, 0.5);
            return wimg;
          }
          return self.stand(c[0], c[1], textTex(sc, 'east:kg:' + kg, kg + 'kg', 28, 22, '#fffbe8', '#7a7064', 11));
        });
        break;
      }
      case 'sokoban': {
        // v4.2.6（QB-M40-09、QB-M38-07）：箱子像箱子、內牆像石柱（美術 obj_box_*／obj_wall_* 優先）
        var iceRoom = this.mapId === 'M38';
        var Pp = CP.sokoParse(pz.def.data.rows), o = pz.origin, boxK = artOr(sc, iceRoom ? 'box_ice' : 'box_stone', function () { return crateTex(sc, iceRoom); });
        var wallK = artOr(sc, iceRoom ? 'wall_ice' : 'wallstone', function () { return wallRockTex(sc, iceRoom); });
        var goalK = artOr(sc, iceRoom ? 'goal_ice' : 'goal_stone', function () { return tex(sc, 'east:goal', 32, 32, function (g) { g.fillStyle = 'rgba(255,230,120,.45)'; g.fillRect(3, 3, 26, 26); g.strokeStyle = '#ffe9a0'; g.lineWidth = 2; g.strokeRect(4, 4, 24, 24); }); });
        Pp.goals.forEach(function (g3) { self.ground(o[0] + g3[0], o[1] + g3[1], goalK); });
        // 背景沒畫的內牆（P4-1 的 (54,39)、(53–55,41)）：程式畫成石塊（地圖格子本來就不能走）
        Object.keys(Pp.walls).forEach(function (k) { var a = k.split(',').map(Number); if (a[0] > 0 && a[1] > 0 && a[0] < Pp.w - 1 && a[1] < Pp.h - 1) self.stand(o[0] + a[0], o[1] + a[1], wallK); });
        I.boxes = this.boxCells(pz).map(function (c) { return self.stand(c[0], c[1], boxK); });
        if (C.door && this.mapId === 'M40') this.ground(C.door[0], C.door[1], textTex(sc, 'east:doormark:box', '▣', 30, 30, '#ffe9a0', null, 18));   // 71 號 2.12：小石室門口畫箱子圖案
        I.arrows = [];
        break;
      }
      case 'mirror': {
        I.source = this.stand(C.source[0], C.source[1], art2(sc, 'obj_light_source') || textTex(sc, 'east:source', '☀', 28, 28, '#ffd34d', '#3a3f4b', 18));   // v4.2.6 W1c：美術光源、水晶、鏡子
        I.crystal = this.stand(C.crystal[0], C.crystal[1], art2(sc, solved ? 'obj_crystal_on' : 'obj_crystal_off') || textTex(sc, 'east:crystal:' + (solved ? 1 : 0), '◆', 28, 30, solved ? '#fff3a0' : '#9fd8ff', '#2b3a55', 18));
        I.mirrors = C.mirrors.map(function (c, i9) {
          self.objs[key(c[0], c[1])] = { kind: 'east', what: 'mirror', pz: pz, idx: i9, prompt: '轉動第 ' + (i9 + 1) + ' 面鏡子' };
          return self.stand(c[0], c[1], art2(sc, 'obj_mirror_slash') || textTex(sc, 'east:mirror:/', '／', 28, 32, '#e8f7ff', '#4a5878', 20));
        });
        I.beam = this.add(sc.add.graphics().setDepth(40001));
        break;
      }
      case 'euler': {
        I.edges = this.add(sc.add.graphics().setDepth(DEPTH.BEAM));
        I.nodes = {};
        pz.def.data.nodes.forEach(function (n) {
          var c = C.stones[n];
          self.objs[key(c[0], c[1])] = { kind: 'east', what: 'node', pz: pz, node: n, prompt: '走到石頭 ' + n };
          I.nodes[n] = self.ground(c[0], c[1], textTex(sc, 'east:node:' + n + ':0', n, 28, 28, '#fffbe8', '#5d6470', 15));
        });
        break;
      }
      case 'symbol': {
        if (C.desk) {
          this.stand(C.desk[0], C.desk[1], art2(sc, 'obj_loan_desk') || textTex(sc, 'east:dial', '🔢', 28, 26, '#fff', 'rgba(90,58,34,.85)', 16));   // v4.2.6 W1c：美術借書台（不再是表情符號）
          this.objs[key(C.desk[0], C.desk[1])] = { kind: 'east', what: 'desk', pz: pz, prompt: '轉動借書台的密碼盤' };
        }
        I.gate = (C.gate || []).map(function (c) { return self.stand(c[0], c[1], blockTex(sc, 'wood')); });
        break;
      }
      case 'hanoi': {
        if (C.door) this.ground(C.door[0], C.door[1], textTex(sc, 'east:doormark:disc', '◎', 30, 30, '#ffe9a0', null, 18));   // 71 號 2.12：門口畫石盤圖案
        I.discs = [];
        // v4.2.6（QB-M40-11：空柱子什麼都沒畫卻擋路）：三根柱子都畫（美術 obj_hanoi_pillar 優先）
        var pk = artOr(sc, 'pillar', function () { return pillarTex(sc); });
        I.pillars = C.pillars.map(function (c) { return self.stand(c[0], c[1], pk); });
        C.pillars.forEach(function (c) { self.objs[key(c[0], c[1])] = { kind: 'east', what: 'hanoi', pz: pz, prompt: '搬石盤' }; });
        break;
      }
    }
    this.redrawPuzzle(pz);
  };

  Fx.prototype.redrawPuzzle = function (pz) {
    var self = this, sc = this.scene, st = this.state(), I = this.imgs[pz.id] || {}, rt = this.rtOf(pz), solved = CP.solved(st, pz.id), C = pz.cells;
    var vis = function (o, v) { if (o && o.setVisible) o.setVisible(v); };
    switch (pz.type) {
      case 'lights': {
        // P1-1：燈在門上（踏板本身不亮）；P4-2 五角星盤：星石本身就是燈
        var show = EF.puzzleVisible(st, this.P, pz), keys = CP.lightKeys(pz.def), on = solved ? pz.def.data.goal || [] : rt.on, onDoor = !!(C.door && C.door.length);
        keys.forEach(function (k, i) {
          var p = I.plates[k];
          if (p) { if (p.setTexture) p.setTexture(I.star ? starStone(sc, k, !!on[i]) : plateTex(sc, k, !onDoor && !!on[i])); vis(p, show); }
        });
        (I.dots || []).forEach(function (d, i) { if (d.setTexture) d.setTexture(lampDotTex(sc, solved || !!on[i], '#ffd34d')); });
        (I.door || []).forEach(function (d) { vis(d, !solved); });
        vis(I.lines, !solved); vis(I.ring, show);
        break;
      }
      case 'numseq': case 'symbol': (I.gate || []).forEach(function (g) { vis(g, !solved); }); break;
      case 'memory': (I.cards || []).forEach(function (c, i) {
        var up = solved || rt.matched.indexOf(i) >= 0 || rt.open.indexOf(i) >= 0 || self.revealing;
        var m = rt.matched.indexOf(i) >= 0 || solved;   // 配對好的（黃底）和翻開中的（米色）用不同的貼圖
        var ca = CARD_ART[rt.cards[i]], upK = ca && art2(sc, 'obj_card_' + ca + (m ? '_matched' : '_open')), backK = art2(sc, 'obj_card_back');   // v4.2.6 W1c：美術翻牌（物品圖，翻開／配對兩種）
        if (c.setTexture) c.setTexture(up ? (upK || textTex(sc, 'east:card:' + rt.cards[i] + (m ? ':m' : ':o'), rt.cards[i], 28, 30, '#2a1e22', m ? '#ffe9a0' : '#f3e1b5', 9)) : (backK || textTex(sc, 'east:card:back', '？', 28, 30, '#fffbe8', '#5d6470', 16)));
      }); break;
      case 'balance': {
        var d = pz.def.data, onSet = solved ? (CP.balanceAnswers(pz.def)[0] || []).map(function (kg) { return d.stones.indexOf(kg); }) : rt.on;
        (I.stones || []).forEach(function (s, i) { vis(s, onSet.indexOf(i) < 0); vis(s.__num, onSet.indexOf(i) < 0); });
        var sum = onSet.reduce(function (s2, i) { return s2 + d.stones[i]; }, 0);
        if (I.scaleR && I.scaleR.setTexture) I.scaleR.setTexture(textTex(sc, 'east:scaleN:' + sum + (sum === d.left ? ':g' : ':w'), String(sum), 16, 14, sum === d.left ? '#7be08a' : '#fffbe8', null, 9));
        if (I.scaleText && I.scaleText.setTexture) I.scaleText.setTexture(textTex(sc, 'east:scale:' + d.left + '|' + sum, d.left + '｜' + sum, 44, 18, sum === d.left ? '#7be08a' : '#fffbe8', 'rgba(11,18,54,.75)', 12));
        break;
      }
      case 'sokoban': {
        var cells = this.boxCells(pz);
        (I.boxes || []).forEach(function (b, i) { var c = cells[i]; if (c && b.setPosition) { b.setPosition(c[0] * T + T / 2, (c[1] + 1) * T); if (b.setDepth) b.setDepth((c[1] + 1) * T - 1); } });
        break;
      }
      case 'mirror': {
        var m = solved ? (CP.solve(pz.def).winning_states[0] || rt.m) : rt.m;
        (I.mirrors || []).forEach(function (img, i) { if (img.setTexture) img.setTexture(art2(sc, m[i] === '/' ? 'obj_mirror_slash' : 'obj_mirror_backslash') || textTex(sc, 'east:mirror:' + m[i], m[i] === '/' ? '／' : '＼', 28, 32, '#e8f7ff', '#4a5878', 20)); });
        var b = CP.beam(pz.def, m), o = pz.origin, g = I.beam;
        if (g && g.clear) {
          g.clear(); g.lineStyle(4, 0xffe27a, 0.85);
          var pts = [C.beamStart].concat(b.path.map(function (q) { return [o[0] + q[0], o[1] + q[1]]; }));
          for (var i = 1; i < pts.length; i++) g.lineBetween(pts[i - 1][0] * T + T / 2, pts[i - 1][1] * T + T / 2, pts[i][0] * T + T / 2, pts[i][1] * T + T / 2);
          g.lineBetween(C.source[0] * T + T / 2, C.source[1] * T + T / 2, C.beamStart[0] * T + T / 2, C.beamStart[1] * T + T / 2);
        }
        if (I.crystal && I.crystal.setTexture) I.crystal.setTexture(art2(sc, b.hit ? 'obj_crystal_on' : 'obj_crystal_off') || textTex(sc, 'east:crystal:' + (b.hit ? 1 : 0), '◆', 28, 30, b.hit ? '#fff3a0' : '#9fd8ff', '#2b3a55', 18));
        this.beamPath = b.path;   // 測試用
        break;
      }
      case 'euler': {
        var E = pz.def.data.edges, used = solved ? E.map(function () { return true; }) : E.map(function (_, i) { return !!rt.used[i]; }), g2 = I.edges;
        if (g2 && g2.clear) {
          g2.clear();
          E.forEach(function (e, i) {
            var a = C.stones[e[0]], bb = C.stones[e[1]];
            g2.lineStyle(used[i] ? 5 : 3, used[i] ? 0xffe27a : 0x9aa3b8, used[i] ? 0.95 : 0.5);
            g2.lineBetween(a[0] * T + T / 2, a[1] * T + T / 2, bb[0] * T + T / 2, bb[1] * T + T / 2);
          });
        }
        Object.keys(I.nodes || {}).forEach(function (n) { var img = I.nodes[n]; if (img.setTexture) img.setTexture(textTex(sc, 'east:node:' + n + ':' + (rt.cur === n && !solved ? 1 : 0), n, 28, 28, '#fffbe8', rt.cur === n && !solved ? '#b85a17' : '#5d6470', 15)); });
        break;
      }
      case 'hanoi': {
        (I.discs || []).forEach(function (d2) { self.drop(d2); });
        var pegs = solved ? [[], [], new Array(pz.def.data.discs).fill(0).map(function (_, i) { return pz.def.data.discs - 1 - i; })] : rt.pegs;
        I.discs = [];
        pegs.forEach(function (stack, pi) {
          var c = C.pillars[pi];
          stack.forEach(function (size, h) {
            var w = 12 + size * 7;
            // v4.2.6：石盤放大（16／24／30 寬、9 高），套在柱子上從石座往上疊（美術 obj_hanoi_disc_* 優先）
            var dk = artOr(sc, 'disc' + size, function () { return discTex(sc, size); });
            I.discs.push(self.image(c[0] * T + T / 2, (c[1] + 1) * T - 5 - h * DISC_STEP, dk, (c[1] + 1) * T + h, 0.5, 1));
          });
        });
        break;
      }
    }
  };

  Fx.prototype.hideChest = function (id) {
    var sc = this.scene, list = sc.chests || [];
    for (var i = 0; i < list.length; i++) if (list[i].data.id === id) {
      var c = list[i]; list.splice(i, 1);
      if (c.img && c.img.setVisible) c.img.setVisible(false);
      if (sc.blocked) delete sc.blocked[key(c.data.x, c.data.y)];
      this.hiddenChests[id] = c;
      return true;
    }
    return false;
  };
  Fx.prototype.showChest = function (id) {
    var c = this.hiddenChests[id], sc = this.scene;
    if (!c) return false;
    delete this.hiddenChests[id];
    (sc.chests || (sc.chests = [])).push(c);
    if (c.img && c.img.setVisible) c.img.setVisible(true);
    if (sc.blocked) sc.blocked[key(c.data.x, c.data.y)] = true;
    if (sc.sparkle && c.img && !this.reduced) sc.sparkle(c.img.x, c.img.y - T / 2, 0xffd34d);   // 減少動態效果：不放粒子
    return true;
  };

  // ───────── 冰地板（M38）─────────
  Fx.prototype.buildIce = function () {
    var self = this, sc = this.scene;
    this.P.iceRooms.forEach(function (r) {
      var rockK = artOr(sc, 'wall_ice', function () { return blockTex(sc, 'rock'); });   // v4.2.6 W1b：擋住滑行的冰岩用美術 obj_wall_ice（沒讀到才用程式方塊）
      r.rocks.forEach(function (c) { self.stand(c[0], c[1], rockK); });   // 冰石（格子本來就不能走；背景沒畫）
      if (r.reset) self.ground(r.reset[0], r.reset[1], iceResetTex(sc));   // v4.2.6 W1b：冰藍圓章＋線條迴轉箭頭（不再是字型「↺」）
    });
  };

  // ───────── 遺失物（M39）─────────
  Fx.prototype.buildLost = function () {
    var self = this, sc = this.scene, st = this.state();
    this.imgs.lost = {};
    this.P.lostItems.forEach(function (it) {
      var img = self.image(it.x * T + T / 2, (it.y + 1) * T - 6, emojiTex(sc, 'east:lost:' + it.id, it.icon, 26, 26, function (g, w, h) { g.fillStyle = 'rgba(255,255,255,.75)'; g.beginPath(); g.arc(w / 2, h / 2, w / 2 - 1, 0, Math.PI * 2); g.fill(); }), (it.y + 1) * T);
      self.imgs.lost[it.id] = img;
      if (!self.reduced) self.tween({ targets: img, y: img.y - 4, duration: BREATH_MS, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      self.objs[key(it.x, it.y)] = { kind: 'east', what: 'lost', item: it, prompt: '把' + it.name + '送回書架' };
    });
    this.redrawLost();
  };
  Fx.prototype.redrawLost = function () {
    var self = this, st = this.state();
    this.P.lostItems.forEach(function (it) { var img = self.imgs.lost && self.imgs.lost[it.id]; if (img && img.setVisible) img.setVisible(!EF.has(st, 'lost', it.id) && EF.lostVisible(st, it)); });
    this.updateFog(true);
  };

  // ───────── 五燈試煉（M40）：打倒那座燈座的霧影＝燈亮 ─────────
  Fx.prototype.buildTrialLamps = function () {
    var self = this, sc = this.scene;
    this.imgs.trial = this.P.trialLamps.map(function (t) {
      // v4.2.6（QB-M40-06：🔥 表情符號小、不在盆子正中、點亮前後差很少）：火焰圖（美術 obj_trial_flame 優先，沒有就用程式畫的像素火焰 32×40），
      // seat＝[x0, y0, x1, y1]：腳底在石盆口（水平＝燈座中心，垂直＝seat 上緣往下 FLAME_FOOT_Y）。位置從 seat 算，不寫死背景像素（M40 背景重畫後燈座會搬）
      var x = EF.flameX ? EF.flameX(t, T) : (t.seat[0] + t.seat[2] + 1) / 2 * T, y = t.seat[1] * T + FLAME_FOOT_Y, sk = SUBJ_KEY[t.subject];
      var f1 = sk && hasArt(sc, ART['flame_' + sk]) ? J.Assets.texKey(ART['flame_' + sk]) : artOr(sc, 'flame', function () { return flameTex(sc); });
      var f2 = sk && hasArt(sc, ART['flame_' + sk + '_2']) ? J.Assets.texKey(ART['flame_' + sk + '_2']) : (hasArt(sc, ART.flame_2) && f1 === J.Assets.texKey(ART.flame) ? J.Assets.texKey(ART.flame_2) : null);
      // 科目記號（7×7）：貼在燈座石台正面中央（seat 下緣往上 10 像素），沒亮也看得到形狀
      if (sk && hasArt(sc, ART['mark_' + sk])) self.image(x, (t.seat[3] + 1) * T - 10, J.Assets.texKey(ART['mark_' + sk]), FLAME_DEPTH, 0.5, 0.5);
      return { t: t, x: x, y: y, f1: f1, f2: f2, img: self.image(x, y, f1, FLAME_DEPTH, 0.5, 1), glow: null };
    });
    // 火焰兩幀輪播（約 4 fps；減少動態效果時不播）
    var flick = (this.imgs.trial || []).filter(function (o) { return o.f2; });
    if (flick.length && !this.reduced && sc.time && sc.time.addEvent) {
      var fr = 0;
      this.flameTimer = sc.time.addEvent({ delay: FLAME_FPS_MS, loop: true, callback: function () { fr = 1 - fr; flick.forEach(function (o) { if (o.img.setTexture && o.img.visible) o.img.setTexture(fr ? o.f2 : o.f1); }); } });
    }
    this.redrawTrial();
  };
  /** 燈座：打倒霧影就亮（戰鬥回來時 onWake 再畫一次）；五燈全亮後五角星盤出現 */
  Fx.prototype.redrawTrial = function () {
    var sc = this.scene, st = this.state();
    (this.imgs.trial || []).forEach(function (o) {
      var lit = EF.trialLampLit(st, o.t);
      if (o.img.setVisible) o.img.setVisible(lit);
      if (lit && !o.glow && sc.addGlow) o.glow = sc.addGlow(o.x, o.y - 14, 0.8, LAMP_COLOR[o.t.subject]);   // 光暈由 MapScene 管（場景關掉時一起清掉）
      if (!lit && o.glow && sc.removeGlow) { sc.removeGlow(o.glow); o.glow = null; }
    });
    var self = this;
    this.P.puzzles.forEach(function (pz) { if (pz.appearsAfter) self.redrawPuzzle(pz); });
  };
  /** 打完仗回到地圖（MapScene.onWake 之後）：燈座、光柱可能變了 */
  Fx.prototype.onWake = function () {
    this.redrawTrial();
    this.pillarGlow();
    this.track();
  };
  /** 光柱的亮度：四隻曙光霧將都打倒＝比較亮（呼吸動畫的範圍跟著換；舊的動畫先停掉，不然它會一直把亮度改回去） */
  Fx.prototype.pillarGlow = function () {
    var beam = this.imgs.pillar;
    if (!beam) return;
    var done = EF.bossesDone(this.state(), this.P), lv = done ? [0.5, 0.35] : [0.25, 0.15];
    if (this.pillarLevel === lv[0]) return;
    this.pillarLevel = lv[0];
    if (this.pillarTween) { try { if (this.pillarTween.remove) this.pillarTween.remove(); else if (this.pillarTween.stop) this.pillarTween.stop(); } catch (e) { /* 忽略 */ } this.pillarTween = null; }
    if (beam.setAlpha) beam.setAlpha(lv[0]);
    if (!this.reduced) this.pillarTween = this.tween({ targets: beam, alpha: lv[1], duration: BREATH_MS * 1.2, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
  };

  // ───────── 雲之深層：軟雲（M42）、星星與星座（M43）─────────
  Fx.prototype.buildClouds = function () {
    // v4.2.6（QB-M42-02：一格一格的白圓點＋虛線方框，像泡泡牆）：改成淡紫灰蓬鬆雲（美術 obj_soft_cloud 優先）
    var self = this, sc = this.scene, st = this.state(), k = this.P.softClouds.length ? artOr(sc, 'cloud', function () { return softCloudTex2(sc); }) : null;
    this.imgs.clouds = {}; this.imgs.hardClouds = {};
    // v4.2.6（技術長）：軟雲答對變硬後，那幾格一律畫實心硬雲（不再只是把軟雲藏起來、露出背景；中路 SC3–SC5 的背景是天空）
    var hk = this.P.softClouds.length ? hardCloudTex(sc) : null;
    var Wd = J.World, ts = G() && G().data && G().data.tilesets, map = this.map, allSoft = {};
    this.P.softClouds.forEach(function (c2) { c2.cells.forEach(function (q) { allSoft[key(q[0], q[1])] = true; }); });
    var groundCloud = function (x, y) { return !!allSoft[key(x, y)] || !!(Wd && ts && Wd.isWalkable(ts, map, x, y, null)); };   // 實心雲或相鄰的另一朵軟雲（相鄰兩朵都變硬時中間不畫邊）
    this.P.softClouds.forEach(function (c, ci) {
      // v4.2.6 W1d（技術長）：變硬後有整朵的美術圖 obj_hard_cloud_<id> 就畫一張（畫布＝外接矩形×32 四邊各多 8px，左上＝外接矩形左上 −(8,8)），讀不到才退回九宮格磚
      var whole = art2(sc, 'obj_hard_cloud_' + c.id);
      if (whole) {
        var xs0 = Math.min.apply(null, c.cells.map(function (q) { return q[0]; })), ys0 = Math.min.apply(null, c.cells.map(function (q) { return q[1]; }));
        var wimg = self.image(xs0 * T - 8, ys0 * T - 8, whole, DEPTH.PATH, 0, 0); if (wimg.setVisible) wimg.setVisible(false);
        self.imgs.hardClouds[c.id] = [wimg];
      } else self.imgs.hardClouds[c.id] = c.cells.map(function (p) { var img = self.ground(p[0], p[1], art2(sc, cloudEdgeKey('hard', c.cells, p, groundCloud)) || hk); if (img.setDepth) img.setDepth(DEPTH.PATH); if (img.setVisible) img.setVisible(false); return img; });
      var imgs = c.cells.map(function (p) { var img = self.ground(p[0], p[1], art2(sc, cloudEdgeKey('soft', c.cells, p)) || k); if (img.setDepth) img.setDepth((p[1] + 1) * T - 2); if (img.setAlpha) img.setAlpha(0.75); return img; });
      self.imgs.clouds[c.id] = imgs;
      if (!self.reduced && imgs.length) self.tween({ targets: imgs, alpha: 0.55, duration: BREATH_MS * 1.5, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      c.cells.forEach(function (p) { self.objs[key(p[0], p[1])] = { kind: 'east', what: 'cloud', cloud: c, prompt: '答題讓第 ' + (ci + 1) + ' 朵軟雲變硬' }; });
    });
    this.redrawClouds();
  };
  /** v4.2 第 4c 批：M41 雲階（定案第二節末段「程式畫硬雲（ending_done 後出現）」）：結局前是雲海、不畫、不能走；結局後畫成白色硬雲、可以走到 M42 */
  Fx.prototype.buildCloudStairs = function () {
    var self = this, cs = this.P.cloudStairs;
    this.imgs.stairs = [];
    if (!cs || !EF.cloudStairsOpen(this.state(), this.P)) return;
    var k = hardCloudTex(this.scene);
    cs.cells.forEach(function (p) { var img = self.ground(p[0], p[1], k); if (img.setDepth) img.setDepth(DEPTH.PATH); self.imgs.stairs.push(img); });
  };
  /** 這一格因為東部欄位「變成可以走」（目前只有開了的雲階） */
  Fx.prototype.opens = function (x, y) { return !!this.P.cloudStairs && EF.cloudStairsOpen(this.state(), this.P, x, y); };
  Fx.prototype.redrawClouds = function () {
    var self = this, st = this.state();
    this.P.softClouds.forEach(function (c) {
      var hard = EF.has(st, 'clouds', c.id);
      (self.imgs.clouds[c.id] || []).forEach(function (img) { if (img.setVisible) img.setVisible(!hard); });
      ((self.imgs.hardClouds || {})[c.id] || []).forEach(function (img) { if (img.setVisible) img.setVisible(hard); });
    });
  };
  Fx.prototype.buildStars = function () {
    var self = this, sc = this.scene;
    this.imgs.stars = {}; this.imgs.consts = {};
    this.P.stars.forEach(function (s) {
      self.imgs.stars[s.i] = self.stand(s.x, s.y, starTex(sc, true));
      self.objs[key(s.x, s.y)] = { kind: 'east', what: 'star', star: s, prompt: '撿起第 ' + (s.i + 1) + ' 顆星星' };
    });
    this.P.constellations.forEach(function (c) {
      // v4.2.6 W1c（QB-M43-03）：美術星座牌 obj_constellation_plate（32×24，牌面空白）立在圓台正前方中央（maps.js constellations[].plate＝腳底像素），
      // 星數（★／☆）由程式疊在牌面；圖沒讀到才退回舊的黑底字標籤
      var pk = artOr(sc, 'plate', null);
      if (pk && Array.isArray(c.plate)) {
        var px = c.plate[0], py = c.plate[1];
        // v4.2.6 W1e（QB-M43-R07：牌面上的星數太小數不出來）：星數改畫在牌子正上方，15px 金字＋深色描邊
        self.imgs.consts[c.id] = { plate: self.image(px, py, pk, py, 0.5, 1), stars: self.image(px, py - 24 - 9, textTex(sc, 'east:constp2:0', '☆☆☆', 50, 18, '#ffd34d', null, 15), py + 1, 0.5, 0.5) };
      } else self.imgs.consts[c.id] = self.image(c.x * T + T / 2, c.y * T + 2, textTex(sc, 'east:const:0', '☆☆☆', 44, 16, '#fff3a0', 'rgba(11,18,54,.7)', 12), (c.y + 2) * T, 0.5, 1);
      [key(c.x, c.y), key(c.x, c.y + 1)].forEach(function (k) { self.objs[k] = { kind: 'east', what: 'constellation', con: c, prompt: '看看' + c.region + '的星座' }; });
    });
    this.redrawStars();
  };
  Fx.prototype.redrawStars = function () {
    var self = this, sc = this.scene, st = this.state(), fill = EF.constellationFill(st, this.P);
    this.P.stars.forEach(function (s) { var img = self.imgs.stars[s.i]; if (img && img.setVisible) img.setVisible(!EF.has(st, 'stars', String(s.i))); });
    this.P.constellations.forEach(function (c) {
      var n = fill[c.id] || 0, img = self.imgs.consts[c.id];
      var label = new Array(n + 1).join('★') + new Array(EF.STARS_PER_CONSTELLATION - n + 1).join('☆');
      if (img && img.stars && img.stars.setTexture) img.stars.setTexture(textTex(sc, 'east:constp2:' + n, label, 50, 18, '#ffd34d', null, 15));
      else if (img && img.setTexture) img.setTexture(textTex(sc, 'east:const:' + n, label, 44, 16, '#fff3a0', 'rgba(11,18,54,.7)', 12));
    });
  };

  // ───────── 霧遮罩（M37、M39）─────────
  Fx.prototype.buildFog = function () {
    if (!this.P.fog) return;
    this.updateFog(true);
  };
  Fx.prototype.updateFog = function (force) {
    if (!this.P.fog) return;
    var sc = this.scene, p = sc.p, lv = EF.fogLevel(this.P, this.state(), p ? { x: p.tx, y: p.ty } : null, this.reduced);
    this.fogInfo = lv;   // 測試用
    var target = lv.on ? lv.alpha : 0, fresh = false;
    if (!this.fog || this.fog.radius !== lv.radius || this.fog.still !== !!lv.still) {
      if (this.fog) { this.stopFade(); this.drop(this.fog.img); }
      var img;
      if (lv.still) img = this.add(sc.add.rectangle(-VIEW_W * 1.5, -VIEW_H * 1.5, VIEW_W * 4, VIEW_H * 4, parseInt((FOG_COLOR[this.mapId] || '#6b7280').slice(1), 16), 1).setOrigin(0, 0).setScrollFactor(0).setDepth(DEPTH.FOG));
      else { img = this.add(sc.add.image(0, 0, fogTex(sc, this.mapId, lv.radius)).setOrigin(0.5, 0.5).setDepth(DEPTH.FOG)); if (img.setScale) img.setScale(4); }
      this.fog = { img: img, radius: lv.radius, still: !!lv.still, target: null, fade: null };
      fresh = true;
    }
    var f = this.fog.img;
    // 進出機關區、送回遺失物：霧慢慢變（0.45 秒），不會整個畫面一下亮一下暗；剛建好、減少動態效果時直接設定
    if (this.fog.target !== target) {
      this.fog.target = target;
      this.stopFade();
      if (fresh || force || this.reduced || !sc.tweens) { if (f.setAlpha) f.setAlpha(target); }
      else this.fog.fade = sc.tweens.add({ targets: f, alpha: target, duration: FOG_FADE_MS, ease: 'Sine.inOut' });
    }
    if (f.setVisible) f.setVisible(true);
    if (!lv.still && sc.player && f.setPosition) f.setPosition(sc.player.x, sc.player.y - T / 2);
  };
  Fx.prototype.stopFade = function () {
    var fd = this.fog && this.fog.fade;
    if (fd) { try { if (fd.remove) fd.remove(); else if (fd.stop) fd.stop(); } catch (e) { /* 忽略 */ } this.fog.fade = null; }
  };

  // ───────── 曙光羅盤的光點（M37）、番薯仔的找路箭頭（M37–M40）─────────
  Fx.prototype.reachFn = function () {
    var sc = this.scene, self = this, p = sc.p, seen = {}, q = [[p.tx, p.ty]];
    seen[key(p.tx, p.ty)] = true;
    for (var i = 0; i < q.length && i < 8000; i++) {
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) {
        var nx = q[i][0] + d[0], ny = q[i][1] + d[1], k = key(nx, ny);
        if (seen[k] || nx < 0 || ny < 0 || nx >= sc.size.w || ny >= sc.size.h || self.iceAt(nx, ny) || !sc.walkable(nx, ny)) return;
        seen[k] = true; q.push([nx, ny]);
      });
    }
    return function (x, y) { return !!seen[key(x, y)] || [[1, 0], [-1, 0], [0, 1], [0, -1]].some(function (d) { return !!seen[key(x + d[0], y + d[1])]; }); };
  };
  Fx.prototype.target = function () {
    var p = this.scene.p;
    return EF.wayTarget(this.P, this.state(), { x: p.tx, y: p.ty }, { reach: this.reachFn(), exits: this.map.exits || [] });
  };
  Fx.prototype.refreshDots = function () {
    var self = this, sc = this.scene;
    this.dots.forEach(function (d) { self.drop(d); });
    this.dots = [];
    if (COMPASS_DOT_MAPS.indexOf(this.mapId) < 0 || !EF.hasCompass(this.state()) || !sc.p) return;
    var t = this.target();
    if (!t) return;
    var path = EF.pathTo(function (x, y) { return sc.walkable(x, y) && !self.iceAt(x, y); }, sc.size.w, sc.size.h, [sc.p.tx, sc.p.ty], [t.x, t.y], 6000);
    (path || []).slice(0, 10).forEach(function (c) {
      var d = self.image(c[0] * T + T / 2, c[1] * T + T / 2, dotTex(sc), DEPTH.PATH, 0.5, 0.5);
      self.dots.push(d);
    });
    this.dotCount = this.dots.length;   // 測試用
  };
  /** 「找路」：番薯仔頭上出現箭頭，指向下一個目標（只指方向、不畫路線；30 秒後消失；不限次數、不扣分） */
  Fx.prototype.showArrow = function () {
    if (!EF.hasWayfinding(this.P)) return null;
    var sc = this.scene, t = this.target();
    if (!t) { toast('番薯仔也不知道下一步要去哪裡，先到處看看吧！'); return null; }
    var pet = sc.pet || sc.player, px = Math.floor(pet.x / T), py = Math.floor((pet.y - 1) / T);
    var ang = EF.arrowAngle(px, py, t.x, t.y);
    if (this.arrow) this.drop(this.arrow.img);
    var img = this.add(sc.add.image(pet.x, pet.y - T * 1.4, arrowTex(sc)).setOrigin(0.5, 0.5).setDepth(DEPTH.ARROW));
    if (img.setAngle) img.setAngle(ang === null ? 0 : ang);
    this.arrow = { img: img, until: Date.now() + EF.ARROW_MS, target: t, angle: ang };
    EastFx.arrows++;
    toast('番薯仔指著' + (ang === null ? '腳下' : '箭頭的方向') + '：' + t.label, 3500);
    if (J.UI && J.UI.announce) J.UI.announce('番薯仔指向' + t.label);
    return this.arrow;
  };

  // ───────── 抬頭資訊的小按鈕（洞窟：找路／機關提示／重來）─────────
  Fx.prototype.buildTools = function () {
    var hud = typeof document !== 'undefined' && document.getElementById && document.getElementById('hud');
    if (!hud || !J.UI || !J.UI.h) return;
    if (!EF.hasWayfinding(this.P) && !this.P.puzzles.length && !this.P.iceRooms.length) return;
    var h = J.UI.h, self = this;
    this.toolNoMap = this.P.noMinimap ? h('span.east-nomap', { role: 'img', 'aria-label': '洞窟裡霧太濃，看不到地圖', title: '洞窟裡看不到地圖' }, ['🌫️']) : null;
    this.toolHint = h('button.east-btn', { type: 'button', onclick: function () { self.hintPressed(); } }, ['🧭 找路']);
    this.toolReset = h('button.east-btn', { type: 'button', onclick: function () { self.resetPressed(); } }, ['↺ 重來']);
    this.tools = h('div.east-tools', { role: 'group', 'aria-label': '洞窟的找路與機關按鈕' }, [this.toolNoMap, this.toolHint, this.toolReset]);
    hud.appendChild(this.tools);
    this.syncTools();
  };
  Fx.prototype.syncTools = function () {
    if (!this.tools) return;
    var p = this.scene.p, pz = this.area, onIce = p && this.iceAt(p.tx, p.ty);
    var hintText = pz ? '💡 提示' : (EF.hasWayfinding(this.P) ? '🧭 找路' : null);
    this.toolHint.hidden = !hintText;
    if (hintText) { this.toolHint.textContent = hintText; this.toolHint.setAttribute && this.toolHint.setAttribute('aria-label', pz ? pz.def.name + '的提示（按一次看一層）' : '找路：番薯仔指出下一個要去的地方'); }
    var resettable = (pz && !CP.solved(this.state(), pz.id) && ['pattern', 'numseq', 'symbol'].indexOf(pz.type) < 0) || onIce;
    this.toolReset.hidden = !resettable;
    if (resettable) { this.toolReset.textContent = onIce && !pz ? '↺ 回到冰房間入口' : '↺ 重來'; this.toolReset.setAttribute && this.toolReset.setAttribute('aria-label', onIce && !pz ? '回到冰房間的入口重新滑' : '機關回到一開始的樣子'); }
  };
  Fx.prototype.hintPressed = function () {
    var g = G();
    if (g && g.blocked && g.blocked()) return;
    if (this.area) return this.hint(this.area);
    return this.showArrow();
  };
  /** 下一層提示：{ lv, id（對白 ID）, text（對白的文字；對白還沒載入時用 puzzles.js 的 hints） } */
  Fx.prototype.hintText = function (pz) {
    var lv = Math.min(3, (this.hintLv[pz.id] || 0) + 1);
    this.hintLv[pz.id] = lv;
    var id = pz.def.dialogs && pz.def.dialogs.hints ? pz.def.dialogs.hints[lv - 1] : null;
    return { lv: lv, id: id, text: dialogText(id) || String(pz.def.hints[lv - 1] || '').replace(/^（|）$/g, '') };
  };
  /** 機關旁的提示：按一次看第 1 層，再按看第 2、3 層；看提示不扣分、不扣錢（71 號 2.11.1）。第 3 層有些是畫面提示（翻牌一起亮、地上的箭頭） */
  Fx.prototype.hint = function (pz) {
    var h3 = this.hintText(pz);
    logp('hint:' + pz.id + ':' + h3.lv);
    if (h3.lv === 3 && pz.def.hint3 === 'reveal') this.revealCards(pz);
    // 箭頭是從一開始的樣子算的：第一次看到第 3 層時回到起點再畫；箭頭還在就不再重來（孩子推到一半再按提示，進度不會被清掉）
    if (h3.lv === 3 && pz.def.hint3 === 'arrows' && !((this.imgs[pz.id] || {}).arrows || []).length) { this.reset(pz, true); this.drawHintArrows(pz); }
    return sayId(h3.id, '提示 ' + h3.lv + '：' + h3.text);
  };
  Fx.prototype.revealCards = function (pz) {
    var self = this;
    this.revealing = true; this.redrawPuzzle(pz);
    this.later(MEMORY_SHOW_MS + (this.reduced ? MEMORY_EXTRA_MS : 0), function () { self.revealing = false; self.redrawPuzzle(pz); });
  };
  Fx.prototype.drawHintArrows = function (pz) {
    var self = this, I = this.imgs[pz.id], sc = this.scene, moves = CP.hintMoves(pz.def, pz.def.hint_steps || 5);
    (I.arrows || []).forEach(function (a) { self.drop(a); });
    I.arrows = [];
    var o = pz.origin, P0 = CP.sokoParse(pz.def.data.rows), x = o[0] + P0.player[0], y = o[1] + P0.player[1];
    moves.forEach(function (m, i) {
      var d = CP.DIRS[m], hk = art2(sc, 'obj_hint_arrow'), a;
      if (hk) {   // v4.2.6 W1c：美術提示箭頭（畫朝上、程式轉向），步數小字疊在右上
        a = self.image(x * T + T / 2, y * T + T / 2, hk, DEPTH.PATH, 0.5, 0.5);
        if (a.setAngle) a.setAngle({ up: 0, right: 90, down: 180, left: 270 }[m] || 0);
        I.arrows.push(self.image(x * T + 26, y * T + 25, textTex(sc, 'east:hintn:' + (i + 1), String(i + 1), 14, 12, '#ffe27a', null, 10), DEPTH.PATH + 0.1, 0.5, 0.5));
      } else a = self.image(x * T + T / 2, y * T + T / 2, textTex(sc, 'east:hint:' + m + ':' + (i + 1), { up: '↑', down: '↓', left: '←', right: '→' }[m] + (i + 1), 30, 30, '#ffe27a', 'rgba(11,18,54,.55)', 13), DEPTH.PATH, 0.5, 0.5);
      I.arrows.push(a);
      x += d[0]; y += d[1];
    });
    this.hintArrows = moves.slice();   // 測試用
  };
  Fx.prototype.resetPressed = function () {
    var p = this.scene.p;
    if (this.area) { this.reset(this.area, true); toast('機關回到一開始的樣子了。'); return; }
    var room = p && Ice.roomAt(this.P.iceRooms, this.cell.bind(this), p.tx, p.ty);
    if (room) { this.place(room.entrance[0], room.entrance[1]); this.track(); toast('回到冰房間的入口了，再滑一次吧！'); }
  };
  /** 機關回到一開始的樣子（解開的不動）。toStart：推箱子把主角放回起點 */
  Fx.prototype.reset = function (pz, toStart) {
    if (CP.solved(this.state(), pz.id)) return;
    this.rt[pz.id] = CP.init(pz.def);
    this.refreshBlocks();
    this.redrawPuzzle(pz);
    if (pz.type !== 'sokoban') return;
    var self = this;
    (this.imgs[pz.id].arrows || []).forEach(function (a) { self.drop(a); });
    this.imgs[pz.id].arrows = [];
    // 主角在推箱房間裡：按「重來」或站的格子被箱子占了 → 回到起點
    var p = this.scene.p;
    if (p && pz.cells.enterTo && EF.inRect(p.tx, p.ty, pz.area) && (toStart || this.block[key(p.tx, p.ty)])) this.place(pz.cells.enterTo[0], pz.cells.enterTo[1]);
  };

  // ───────── 主角在哪一道機關裡（走出去＝機關回到一開始） ─────────
  Fx.prototype.track = function () {
    var p = this.scene.p;
    if (!p) return;
    var pz = EF.puzzleAt(this.P, p.tx, p.ty);
    // 還沒出現的（星盤）、已經解開的機關區＝一般的路（按鈕回到「找路」）
    if (pz && (!EF.puzzleVisible(this.state(), this.P, pz) || CP.solved(this.state(), pz.id))) pz = null;
    if (pz !== this.area) {
      var old = this.area, st = this.state(), g = G();
      this.area = pz;
      if (old && !CP.solved(st, old.id)) this.reset(old);
      // 第一次走進機關區：霧仔說規則（D_PZ_Px_x_RULE；每份存檔一次）。之後再進來只在提示泡泡寫一次規則
      if (pz && !CP.solved(st, pz.id)) {
        if (!EF.has(st, 'done', 'rule_' + pz.id) && g && !(g.blocked && g.blocked())) { EF.mark(st, 'done', 'rule_' + pz.id); sayId(pz.def.dialogs && pz.def.dialogs.rule, pz.def.rule); }
        else toast(pz.def.name + '：' + pz.def.rule, 5000);
      }
    }
    this.syncTools();
    this.updateFog();
  };

  // ───────── 包在 MapScene 的方法裡呼叫的 ─────────
  /** 方向鍵走一步之前：冰上不能斜走、推箱子。回傳 null＝照原本的流程；true／false＝這裡處理掉了 */
  Fx.prototype.tryStep = function (dir) {
    var sc = this.scene, p = sc.p, d = J.Move8 && J.Move8.DIRS[dir];
    if (!d || !p) return null;
    var diag = !!(d[0] && d[1]);
    if (diag && (this.iceAt(p.tx, p.ty) || this.iceAt(p.tx + d[0], p.ty + d[1]) || this.iceAt(p.tx + d[0], p.ty) || this.iceAt(p.tx, p.ty + d[1]))) return this.turn(dir);
    if (diag) return null;
    var nx = p.tx + d[0], ny = p.ty + d[1];
    var pz = this.P.puzzles.filter(function (q) { return q.type === 'sokoban' && EF.inRect(nx, ny, q.area); })[0];
    if (!pz || CP.solved(this.state(), pz.id) || this.block[key(nx, ny)] !== pz.id + ':box') return null;
    var o = pz.origin, rt = this.rtOf(pz);
    rt.player = [p.tx - o[0], p.ty - o[1]];
    var r = CP.act(pz.def, rt, { move: dir });
    if (!r.ok || r.pushed === undefined || r.pushed < 0) { sfx('select'); return this.turn(dir); }
    this.rt[pz.id] = r.rt;
    this.refreshBlocks();
    var box = this.imgs[pz.id].boxes[r.pushed], bc = r.rt.boxes[r.pushed];
    if (box) this.tween({ targets: box, x: (o[0] + bc[0]) * T + T / 2, y: (o[1] + bc[1] + 1) * T, duration: 180 });
    if (box && box.setDepth) box.setDepth((o[1] + bc[1] + 1) * T - 1);
    sc.beginStep(nx, ny);
    logp('push:' + pz.id + ':' + dir);
    if (r.solved) this.later(220, this.solve.bind(this, pz));
    else if (r.stuck) { this.stuckShown = (this.stuckShown || 0) + 1; this.later(220, function () { sayId('D_PZ_STUCK', '箱子卡住了，按「重來」再試一次吧！'); }); }   // 71 號 2.11.1：卡死自動跳出
    return true;
  };
  Fx.prototype.turn = function (dir) {
    var sc = this.scene, p = sc.p;
    p.facing = J.Move8.facingFor(dir, p.facing);
    if (sc.player && sc.player.anims) { sc.player.anims.stop(); if (sc.idleFrame) sc.player.setFrame(sc.idleFrame(sc.heroKey, p.facing)); }
    return false;
  };
  /** 點地圖走過去：站在冰上時，改成往點的那一邊（橫或直、比較遠的那一邊）滑 */
  Fx.prototype.walkTo = function (x, y) {
    var p = this.scene.p;
    if (!p || !this.iceAt(p.tx, p.ty)) return null;
    if (p.moving || this.sliding) return true;   // 滑到一半（或正要踏上冰）：點地圖不理會，不能中途轉彎
    var dx = x - p.tx, dy = y - p.ty;
    if (!dx && !dy) return true;
    var dir = Math.abs(dx) >= Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
    p.path = []; p.pending = null;
    this.scene.tryStep(dir);
    return true;
  };
  /** 走完一步、原本的 arrive 之前：冰上繼續滑；推箱房間的門。回傳 true＝這裡接手了（原本的 arrive 不跑） */
  Fx.prototype.beforeArrive = function () {
    var sc = this.scene, p = sc.p;
    this.picked = false;   // 這一步有沒有選過答案（點答案地板走過去時，原本的 arrive 會先選一次）
    if (this.iceAt(p.tx, p.ty)) {
      p.path = []; p.pending = null;
      var d = J.Move8.DIRS[p.stepDir] || [0, 0];
      if (!(d[0] && d[1]) && (d[0] || d[1])) {
        var nx = p.tx + d[0], ny = p.ty + d[1];
        if (sc.walkable(nx, ny)) {
          sc.beginStep(nx, ny);
          if (sc.player && sc.player.anims) { sc.player.anims.stop(); if (sc.idleFrame) sc.player.setFrame(sc.idleFrame(sc.heroKey, p.facing)); }   // 滑行：不播走路動畫
          this.sliding = true;
          logp('slide:' + nx + ',' + ny);
          return true;
        }
      }
      this.sliding = false;
      if (G() && G().state) G().state.location = { map: this.mapId, x: p.tx, y: p.ty };
      this.track();
      return true;   // 停在冰上（冰面上沒有出口、沒有可以互動的東西）
    }
    this.sliding = false;
    // 推箱房間的門在牆上：從外面走進門＝站到起點（CTO 裁定）；從裡面走到門上＝出去（站到門外那一格）
    for (var i = 0; i < this.P.puzzles.length; i++) {
      var pz = this.P.puzzles[i], C = pz.cells;
      if (pz.type !== 'sokoban' || !C.door || C.door[0] !== p.tx || C.door[1] !== p.ty) continue;
      var fromInside = p.prev && EF.inRect(p.prev.x, p.prev.y, pz.area) && !(p.prev.x === C.door[0] && p.prev.y === C.door[1]);
      if (fromInside) {
        var out = [[0, 1], [0, -1], [1, 0], [-1, 0]].map(function (v) { return [C.door[0] + v[0], C.door[1] + v[1]]; }).filter(function (c) { return !EF.inRect(c[0], c[1], pz.area) && sc.walkable(c[0], c[1]); })[0];
        if (out) { this.place(out[0], out[1]); this.track(); return true; }
      } else if (C.enterTo && !CP.solved(this.state(), pz.id)) {
        this.rt[pz.id] = CP.init(pz.def); this.refreshBlocks(); this.redrawPuzzle(pz);
        this.place(C.enterTo[0], C.enterTo[1]); this.track();
        logp('enter:' + pz.id);
        return true;
      }
    }
    return false;
  };
  /** 原本的 arrive 之後：踏板（星石）、光柱、機關區進出、羅盤光點 */
  Fx.prototype.afterArrive = function () {
    var sc = this.scene, p = sc.p, self = this, st = this.state();
    if (sc.transitioning || !p) return;
    this.track();
    this.P.puzzles.forEach(function (pz) {
      if (CP.solved(st, pz.id) || !EF.puzzleVisible(st, self.P, pz)) return;
      if (pz.type === 'lights') CP.lightKeys(pz.def).forEach(function (k) { var c = pz.cells.plates[k]; if (c[0] === p.tx && c[1] === p.ty) self.press(pz, k); });
      // 71 號 2.11.2–3「站到對的地板上」：走上答案地板就算選（站著按 A 也可以）；答錯只出提示泡泡、不扣分
      if ((pz.type === 'pattern' || pz.type === 'numseq') && !self.picked) (pz.cells.floors || []).forEach(function (c, i) { if (c[0] === p.tx && c[1] === p.ty) self.pick(pz, i, true); });
    });
    if (this.P.lightPillar && this.P.lightPillar.cells.some(function (c) { return c[0] === p.tx && c[1] === p.ty; })) this.enterPillar();
    else this.testPillarWait = false;   // v4.2.10 T1：走出光柱後，測試模式的頭目戰才會再觸發
    this.refreshDots();
  };

  // ───────── 機關：動作 ─────────
  Fx.prototype.press = function (pz, k) {
    var r = CP.act(pz.def, this.rtOf(pz), { press: k });
    this.rt[pz.id] = r.rt;
    sfx('select');
    logp('press:' + pz.id + ':' + k);
    this.redrawPuzzle(pz);
    if (r.solved) this.solve(pz);
  };
  Fx.prototype.solve = function (pz) {
    var g = G(), st = this.state(), first = CP.markSolved(st, pz.id);
    this.refreshBlocks(); this.redrawPuzzle(pz);
    if (pz.rewardChest) this.showChest(pz.rewardChest);
    this.redrawLost();
    logp('solved:' + pz.id);
    var allNow = false;
    if (first) {
      if (g && g.jingle) g.jingle('lamp_lit', null, 'lamp');
      var r = pz.def.reward || {};
      banner('解開了！「' + pz.def.name + '」' + (r.opens ? '　門打開了！' : r.chest ? '　寶箱出現了！' : r.reveals ? '　隱藏的書架打開了！' : ''));
      // 71 號 2.11.1：12 道全部解開 → 稱號「霧之洞窟解謎王」（紀念，不加數值）
      if (CP.allSolved(st, Object.keys(window.PUZZLES || {})) && (st.titles || []).indexOf('霧之洞窟解謎王') < 0) { (st.titles = st.titles || []).push('霧之洞窟解謎王'); allNow = true; }
    }
    this.syncTools();
    if (g && g.save) g.save();
    if (first) sayId('D_PZ_SOLVED', '解開了！你好聰明！').then(function () { if (allNow) return sayId('D_PZ_ALL', '12 道機關全部解開了！得到稱號「霧之洞窟解謎王」！', 'narrator'); });
  };
  Fx.prototype.interactableAt = function (x, y) {
    var t = this.objs[key(x, y)], st = this.state();
    if (!t) return null;
    if (t.what === 'lost' && (EF.has(st, 'lost', t.item.id) || !EF.lostVisible(st, t.item))) return null;
    if (t.what === 'cloud' && EF.has(st, 'clouds', t.cloud.id)) return null;
    if (t.what === 'star' && EF.has(st, 'stars', String(t.star.i))) return null;
    if (t.what === 'echo' && EF.has(st, 'done', 'echo_' + this.P.id)) return null;
    if (t.pz && !EF.puzzleVisible(st, this.P, t.pz)) return null;
    return t;
  };
  Fx.prototype.interact = function (t) {
    var g = G();
    if (g && g.blocked && g.blocked()) return;
    logp('interact:' + t.what);
    switch (t.what) {
      case 'lamp': return this.useLamp(t.lamp);
      case 'echo': return this.echoDoor();
      case 'floor': return this.pick(t.pz, t.idx);
      case 'card': return this.flip(t.pz, t.idx);
      case 'stone': return this.toggleStone(t.pz, t.idx);
      case 'mirror': return this.rotate(t.pz, t.idx);
      case 'node': return this.visit(t.pz, t.node);
      case 'desk': return this.symbolPanel(t.pz);
      case 'hanoi': return this.hanoiPanel(t.pz);
      case 'lost': return this.returnLost(t.item);
      case 'cloud': return this.hardenCloud(t.cloud);
      case 'star': return this.takeStar(t.star);
      case 'constellation': { var n = EF.constellationFill(this.state(), this.P)[t.con.id] || 0; return say(t.con.region + '的星座：已經放回 ' + n + '／' + EF.STARS_PER_CONSTELLATION + ' 顆星。', 'pet'); }
      case 'sign': return t.sign.dialog ? sayId(t.sign.dialog, '木牌寫著：' + (t.sign.text || '……') + '。', 'pet') : say(t.sign.text || '……', 'narrator');   // v4.2 4c：M44 木牌播 D_SIGN_CHALLENGE
    }
  };
  /** 山屋小燈：點了就全滿並存檔、不收費；記成最近的休息點（71 號 2.1） */
  Fx.prototype.useLamp = function (l) {
    var g = G(), st = this.state(), p = this.scene.p;
    if (EF.mark(st, 'done', 'lamp_tip')) sayId('D_CAVE_LAMP', '是山屋小燈！點亮它，可以休息、存檔喔。', 'pet');   // 第一次點山屋小燈（劇本組 D_CAVE_LAMP）
    if (J.Character && J.Character.restoreFull) J.Character.restoreFull(st, g.data);
    if (J.Character && J.Character.setInn && p) J.Character.setInn(st, this.mapId, p.tx, p.ty);
    if (g.refreshHud) g.refreshHud();
    if (g.save) g.save();
    sfx('correct');
    if (this.scene.sparkle && !this.reduced) this.scene.sparkle(l.x * T + T / 2, l.y * T, 0xffd34d);   // 減少動態效果：不放粒子
    toast((l.kind === 'marker' ? '記號燈' + (l.shelf ? '（' + l.shelf + '書架旁）' : '') : l.kind === 'final' ? '最後的山屋小燈' : '山屋小燈') + '亮起來了！體力、魔力都補滿，也存好檔了。', 4000);
    return true;
  };
  /** 選答案地板（P1-2、P2-3）。walked＝走上去觸發的：答錯只出提示泡泡（不跳對話框，路過踩到也不煩） */
  Fx.prototype.pick = function (pz, idx, walked) {
    this.picked = true;
    if (CP.solved(this.state(), pz.id)) return toast('這道機關已經解開了。');
    var r = CP.act(pz.def, this.rtOf(pz), { pick: idx });
    this.rt[pz.id] = r.rt;
    if (r.solved) return this.solve(pz);
    sfx('wrong');
    if (walked) return toast('「' + pz.def.data.options[idx] + '」' + (r.msg || '好像不是這個。'), 3500);
    return say(r.msg || '好像不是這個。', 'pet');
  };
  Fx.prototype.flip = function (pz, idx) {
    if (CP.solved(this.state(), pz.id) || this.revealing) return;
    var self = this, r = CP.act(pz.def, this.rtOf(pz), { flip: idx });
    if (!r.ok) return;
    this.rt[pz.id] = r.rt;
    sfx('select');
    this.redrawPuzzle(pz);
    if (J.UI && J.UI.announce) J.UI.announce('翻開：' + r.rt.cards[idx]);
    if (r.solved) return this.solve(pz);
    if (r.mismatch) {
      this.revealing = false;
      this.later(MEMORY_SHOW_MS + (this.reduced ? MEMORY_EXTRA_MS : 0), function () {
        var cur = self.rt[pz.id];
        if (!cur) return;
        self.rt[pz.id] = CP.act(pz.def, cur, { close: true }).rt;
        self.redrawPuzzle(pz);
      });
    }
  };
  Fx.prototype.toggleStone = function (pz, idx) {
    if (CP.solved(this.state(), pz.id)) return toast('天平已經平平的了。');
    var r = CP.act(pz.def, this.rtOf(pz), { toggle: idx });
    if (r.ok || r.sum !== undefined) this.rt[pz.id] = r.rt;
    this.redrawPuzzle(pz);
    if (r.solved) return this.solve(pz);
    if (r.msg) toast(r.msg);
  };
  Fx.prototype.rotate = function (pz, idx) {
    if (CP.solved(this.state(), pz.id)) return toast('光已經照到水晶了。');
    var r = CP.act(pz.def, this.rtOf(pz), { rotate: idx });
    this.rt[pz.id] = r.rt;
    sfx('select');
    this.redrawPuzzle(pz);
    if (r.solved) this.solve(pz);
  };
  Fx.prototype.visit = function (pz, node) {
    if (CP.solved(this.state(), pz.id)) return toast('8 條路都已經亮了。');
    var r = CP.act(pz.def, this.rtOf(pz), { visit: node });
    if (r.ok) this.rt[pz.id] = r.rt; else toast(r.msg);
    this.redrawPuzzle(pz);
    if (r.solved) this.solve(pz);
  };

  /** 借書台的密碼盤（P3-3）：三個式子＋數字 1–9 的按鈕（DOM，螢幕報讀器讀得到） */
  Fx.prototype.symbolPanel = function (pz) {
    var self = this, h = J.UI.h, d = pz.def.data, handle;
    if (CP.solved(this.state(), pz.id)) return toast('木柵已經打開了。');
    var fb = h('p.east-feedback', { 'aria-live': 'polite' });
    var btns = [];
    for (var n = d.range[0]; n <= d.range[1]; n++) (function (v) { btns.push(h('button', { type: 'button', onclick: function () { pick(v); }, 'aria-label': d.ask + ' 是 ' + v }, [String(v)])); })(n);
    function pick(v) {
      var r = CP.act(pz.def, self.rtOf(pz), { pick: v });
      self.rt[pz.id] = r.rt;
      fb.textContent = r.msg;
      if (r.solved) { handle.close(); self.solve(pz); }
    }
    var panel = h('div.win.panel.narrow.east-panel', {}, [
      h('h2', { text: pz.def.name }), h('p', { text: pz.def.rule }),
      h('div.east-eqs', {}, d.eqs.map(function (e) { return h('p.east-eq', { text: e[0].join(' ＋ ') + ' ＝ ' + e[1] }); })),
      h('div.east-dial', { role: 'group', 'aria-label': '密碼盤' }, btns), fb,
      h('div.row.end', {}, [h('button', { type: 'button', onclick: function () { var t = self.hintText(pz); fb.textContent = '提示 ' + t.lv + '：' + t.text; } }, ['💡 提示']), h('button.ghost', { type: 'button', onclick: function () { handle.close(); } }, ['等一下'])])
    ]);
    handle = J.UI.open(panel, { label: pz.def.name });
    this.panel = { handle: handle, pick: pick, feedback: fb };   // 測試用
    return handle;
  };

  /** 疊石盤（P4-3）：三根柱子按鈕；先點要搬的柱子，再點要放的柱子 */
  Fx.prototype.hanoiPanel = function (pz) {
    var self = this, h = J.UI.h, d = pz.def.data, handle, from = null;
    if (CP.solved(this.state(), pz.id)) return toast('石盤已經全部搬好了。');
    var fb = h('p.east-feedback', { 'aria-live': 'polite' }), row = h('div.east-pegs', { role: 'group', 'aria-label': '三根柱子' }), count = h('p.small');
    function label(i) { var s = self.rtOf(pz).pegs[i]; return d.pegs[i] + '柱：' + (s.length ? s.map(function (x) { return d.names[x]; }).join('、') + '（最上面是' + d.names[s[s.length - 1]] + '）' : '空的'); }
    function render() {
      while (row.firstChild) row.removeChild(row.firstChild);   // 清空再重畫（字都用 textContent，不用 innerHTML）
      [0, 1, 2].forEach(function (i) {
        var stack = self.rtOf(pz).pegs[i];
        var b = h('button.east-peg' + (from === i ? '.selected' : ''), { type: 'button', 'aria-label': label(i), 'aria-pressed': from === i ? 'true' : 'false', onclick: function () { tap(i); } },
          [h('span.east-peg-name', { text: d.pegs[i] })].concat(stack.map(function (x) { return h('span.east-disc.east-disc-' + x, { text: d.names[x] }); })));   // east.css：column-reverse，柱名在最下面、最底下的盤子緊接在上面
        row.appendChild(b);
      });
      count.textContent = '搬了 ' + self.rtOf(pz).moves + ' 次（最少 ' + pz.def.expect.min_moves + ' 次）';
    }
    function tap(i) {
      if (from === null) { if (!self.rtOf(pz).pegs[i].length) { fb.textContent = '這根柱子是空的。'; return; } from = i; fb.textContent = '要放到哪一根柱子？'; render(); refocus(i); return; }
      if (from === i) { from = null; fb.textContent = ''; render(); refocus(i); return; }
      var r = CP.act(pz.def, self.rtOf(pz), { move: [from, i] });
      from = null;
      if (r.ok) self.rt[pz.id] = r.rt;
      fb.textContent = r.msg;
      render(); self.redrawPuzzle(pz);
      if (r.solved) { handle.close(); self.solve(pz); return; }
      refocus(i);
    }
    /** 重畫以後焦點放回剛剛按的那根柱子（用鍵盤玩的孩子不用重新找） */
    function refocus(i) { var b = row.children ? row.children[i] : null; if (b && b.focus) { try { b.focus(); } catch (e) { /* 忽略 */ } } }
    var panel = h('div.win.panel.narrow.east-panel', {}, [h('h2', { text: pz.def.name }), h('p', { text: pz.def.rule }), row, count, fb,
      h('div.row.end', {}, [
        h('button', { type: 'button', onclick: function () { var t = self.hintText(pz); fb.textContent = '提示 ' + t.lv + '：' + t.text; } }, ['💡 提示']),
        h('button', { type: 'button', onclick: function () { self.reset(pz); from = null; fb.textContent = '石盤回到一開始的樣子了。'; render(); } }, ['↺ 重來']),
        h('button.ghost', { type: 'button', onclick: function () { handle.close(); } }, ['等一下'])])]);
    render();
    handle = J.UI.open(panel, { label: pz.def.name });
    this.panel = { handle: handle, tap: tap, feedback: fb };   // 測試用
    return handle;
  };

  /** 遺失物（M39）：選要送回哪一座書架（用圖案選）；答對飛回書架、霧淡一級；答錯不扣血，東西飄走一點再回來（71 號 2.5）
   *  v4.2：第一次碰遺失物＝開始 Q_CV_2（event，播 D_CV_2A）；每送回一件記一次進度，送滿 6 件委託完成（D_CV_2B） */
  Fx.prototype.returnLost = function (it) {
    var self = this, g = G(), Q = (g && g.data && g.data.quests) || {}, st = this.state();
    if (Q.Q_CV_2 && g.runEvent && J.QuestLog.status(st, Q, 'Q_CV_2', !!(g.testModeOn && g.testModeOn())) === 'available') return g.runEvent('Q_CV_2', this.scene, { noQuiz: true }).then(function () { return self.returnLostItem(it); });
    return this.returnLostItem(it);
  };
  Fx.prototype.returnLostItem = function (it) {
    var self = this, P = this.P, st = this.state(), g = G(), Q = (g && g.data && g.data.quests) || {};
    var opts = EF.lostChoices(P, it).map(function (cat) { var s = P.shelves.filter(function (x) { return x.cat === cat; })[0]; return { value: cat, text: (s ? s.emoji + ' ' : '') + cat }; });
    return J.UI.choose('這是「' + it.en + '」（' + it.name + '）。要送回哪一座書架？', opts).then(function (v) {
      if (v === null || v === undefined) return false;
      if (v !== it.cat) {
        sfx('wrong');
        var img = self.imgs.lost[it.id];
        if (img) self.tween({ targets: img, x: img.x + T * 0.6, duration: 300, yoyo: true });
        toast('好像不是這座書架，' + it.name + '飄走了一點又飄回來。');
        return false;
      }
      EF.mark(st, 'lost', it.id);
      var s = P.shelves.filter(function (x) { return x.cat === it.cat; })[0], img2 = self.imgs.lost[it.id];
      sfx('correct');
      // 飛回書架的動畫播完才藏起來（onComplete；減少動態效果時直接跳到結果）；霧在這裡就先淡一級
      if (img2 && s) self.tween({ targets: img2, x: (s.area[0] + s.area[2] + 1) / 2 * T, y: s.area[1] * T, alpha: 0, duration: 600, onComplete: function () { self.redrawLost(); } });
      else self.redrawLost();
      self.updateFog();
      var n = EF.lostReturned(st, P);
      banner(it.name + '回到「' + it.cat + '」書架了！（' + n + '／' + P.lostItems.length + '）' + (n === 6 ? '　北門可以過了！' : ''));
      if (Q.Q_CV_2 && J.QuestLog.status(st, Q, 'Q_CV_2') === 'active') {
        J.QuestLog.recordHelp(st, Q, 'Q_CV_2');
        if (J.QuestLog.canComplete(st, Q, 'Q_CV_2', g.data) && g.completeQuest) g.completeQuest('Q_CV_2', self.scene);
      }
      if (G().save) G().save();
      return true;
    });
  };

  /**
   * v4.2 機關出題的題池（資深全端.md 10.2、K13）：組假委託 { subject, units, level_range, count }，用委託同一套 SceneFit 篩（扣寶箱題、外地、不在奇幻地圖的奇幻題）。
   * 三層：strict → loose（SceneFit.helpFilter 自己會退，照樣扣寶箱題）→ 最後保險：拿掉 units、照樣 strict（console.warn）。回傳 { filter, tier }
   */
  function askFilter(questions, fake, mapId) {
    var fit = J.SceneFit.helpFilter(questions, fake, mapId), s = fake.subject, P = fit.pools[s];
    if (P && P.loose.length) return { filter: fit.filter, tier: fit.layer[s] };
    var bare = { subject: s, level_range: fake.level_range, count: fake.count };
    if (typeof console !== 'undefined') console.warn('[機關出題] ' + mapId + ' ' + s + ' 單元「' + (fake.units || []).join('、') + '」篩完沒有題目，拿掉單元再篩');
    return { filter: function (x) { return J.SceneFit.strictFits(x, bare, mapId); }, tier: 'no_units' };
  }
  /** 題目（回音謎門、軟雲、星星用）：count 題、科目輪流；回傳 Promise<全部答對>。v4.2：照 askFilter 篩、不發答題獎勵（noPay）、篩完沒題不退回整科（noFallback） */
  Fx.prototype.ask = function (o) {
    var g = G(), st = this.state(), self = this, done = 0;
    return new Promise(function (resolve) {
      function next() {
        if (done >= o.count) { resolve(true); return; }
        var subj = o.subjects[done % o.subjects.length];
        var fit = askFilter(g.questions, { subject: subj, units: o.units || [], level_range: o.levels, count: o.count }, self.mapId);
        var sess = J.Session.create(st, g.questions, subj, { mode: 'free', filter: fit.filter, noFallback: true, noPay: true }), q = J.Session.next(sess, Date.now(), {});
        if (!q) { toast('「' + subj + '」的題目還在準備中。'); resolve(false); return; }
        J.Quiz.ask({ session: sess, mode: 'help', noPayNote: false, state: st, title: o.title, subtitle: (done + 1) + '/' + o.count,
          onSave: function () { g.save(); }, onRewards: function (res) { g.refreshHud(); if (res) g.afterReward(res.levelsGained); },
          onDone: function (r) { if (!r.correct) { g.save(); resolve(false); return; } done++; next(); } });
      }
      next();
    });
  };
  /** 回音謎門（M37）：答對 3 題國語（第貳單元 臺灣風景畫＋第肆單元 奇幻故事屋，2–4 星）門就開；答錯不扣血，可以重來（71 號 2.3）
   *  v4.2：門＝Q_CV_1（event）的觸發點；委託可接或進行中時走 G.runEvent（D_ECHO_DOOR → 3 題 → D_CV_1B），門跟著打開 */
  Fx.prototype.echoDoor = function () {
    var self = this, st = this.state(), P = this.P, g = G(), Q = (g && g.data && g.data.quests) || {};
    var qs = Q.Q_CV_1 && g.runEvent ? J.QuestLog.status(st, Q, 'Q_CV_1', !!(g.testModeOn && g.testModeOn())) : null;   // v4.2.10 T1b 測試模式：碰門就接 Q_CV_1（不看前置）
    var run = qs === 'available' || qs === 'active' ? g.runEvent('Q_CV_1', this.scene) : say('喂——？喂——？（回音霧學著你說話）門上的大嘴巴說：「答對三題，我就讓你過去。」', 'narrator').then(function () {
      return self.ask({ subjects: ['國語'], levels: [2, 4], count: 3, units: ['第貳單元 臺灣風景畫', '第肆單元 奇幻故事屋'], title: '回音謎門' });
    });
    return run.then(function (ok) {
      if (!ok) { toast('沒關係，再來找回音謎門就可以重來。'); return false; }
      EF.mark(st, 'done', 'echo_' + P.id);
      self.refreshBlocks();
      (self.imgs.echo || []).forEach(function (im) { if (im.setVisible) im.setVisible(false); });
      if (self.imgs.echoOpen && self.imgs.echoOpen.setVisible) self.imgs.echoOpen.setVisible(true);   // v4.2.6 打開的門（美術 obj_echo_door_open）
      banner('回音謎門打開了！');
      G().save();
      return true;
    });
  };
  Fx.prototype.hardenCloud = function (c) {
    var self = this, st = this.state();
    return this.ask({ subjects: [c.subject], levels: [3, 4], count: 1, title: '軟雲' }).then(function (ok) {
      if (!ok) return false;
      EF.mark(st, 'clouds', c.id);
      self.refreshBlocks(); self.redrawClouds();
      sfx('correct'); toast('軟雲變硬了，可以踩上去！');
      G().save();
      return true;
    });
  };
  /** 星星（M43）：撿星星 → 答一般題（五科輪流，3–4 星；v4.2 裁定 K9，不做卡片系統）→ 星星自動飛回星座。
   *  v4.2 第 4c 批：星星＝Q_POST_2（event）的進度；還沒接就先接下（播 D_POST_2A），15 顆都回去 → 委託完成（D_POST_2B） */
  Fx.prototype.takeStar = function (s) {
    var self = this, g = G(), Q = (g && g.data && g.data.quests) || {}, st = this.state();
    if (Q.Q_POST_2 && g.runEvent && J.QuestLog.status(st, Q, 'Q_POST_2', !!(g.testModeOn && g.testModeOn())) === 'available') return g.runEvent('Q_POST_2', this.scene, { noQuiz: true }).then(function () { return self.takeStarQuiz(s); });
    return this.takeStarQuiz(s);
  };
  Fx.prototype.takeStarQuiz = function (s) {
    var self = this, st = this.state(), P = this.P;
    return this.ask({ subjects: [EF.SUBJECTS[s.i % EF.SUBJECTS.length]], levels: [3, 4], count: 1, title: '星星' }).then(function (ok) {
      if (!ok) return false;
      EF.mark(st, 'stars', String(s.i));
      self.redrawStars();
      var con = P.constellations.filter(function (c) { return c.id === s.constellation; })[0], all = EF.constellationsDone(st, P);
      banner('星星飛回' + (con ? con.region + '的' : '') + '星座了！' + (all ? '　五個星座都完成了，北邊的星光拱門打開了！' : ''));
      var g = G(), Q = (g && g.data && g.data.quests) || {};
      if (Q.Q_POST_2 && J.QuestLog.status(st, Q, 'Q_POST_2') === 'active') {
        J.QuestLog.recordHelp(st, Q, 'Q_POST_2');
        if (all) st.quests.Q_POST_2.progress = J.QuestLog.helpCount(Q.Q_POST_2);   // 15 顆都回去就算完成（進度以星星為準）
        if (J.QuestLog.canComplete(st, Q, 'Q_POST_2', g.data) && g.completeQuest) g.completeQuest('Q_POST_2', self.scene);
      }
      G().save();
      return true;
    });
  };
  /** 光柱（M44）：四隻曙光霧將都打倒後走進去 → 稱號「曙光的源頭」（紀念，不加數值），播 D_POST_END（71 號 2.10） */
  Fx.prototype.enterPillar = function () {
    var st = this.state();
    // v4.2.10 T1（老闆「我要看見最後BOSS」）：測試模式開著時，四霧將沒打完、或光柱已經走過 → 直接進最後頭目（佛格）戰，不擋
    if (this.testBossFight(st)) return true;
    if (!EF.bossesDone(st, this.P)) { if (!this.pillarHint) { this.pillarHint = true; toast('光柱還很微弱……先打倒四座小島上的霧將吧！', 4000); } return false; }
    if (EF.has(st, 'done', 'pillar_' + this.P.id)) return false;
    EF.mark(st, 'done', 'pillar_' + this.P.id);
    if ((st.titles = st.titles || []).indexOf('曙光的源頭') < 0) st.titles.push('曙光的源頭');
    banner('拿到稱號「曙光的源頭」！');
    G().save();
    // v4.2 第 4c 批：走進光柱＝Q_POST_3 完成（boss ×4＋finish，完成時播 dialog_end＝D_POST_END）；沒有這個委託時照舊只播 D_POST_END
    var g = G(), Q = (g.data && g.data.quests) || {};
    if (Q.Q_POST_3 && g.completeQuest && J.QuestLog.canComplete(st, Q, 'Q_POST_3', g.data)) { g.completeQuest('Q_POST_3', this.scene); return true; }
    G().say('D_POST_END', [{ who: 'narrator', text: '溫暖的光從腳下升起。大家的記憶，都在這道光裡。' }]);
    return true;
  };

  /**
   * v4.2.10 T1：測試模式的光柱 → 最後頭目戰。只有測試模式開著、而且光柱原本會擋（四霧將沒打完）或已經走過（原本什麼都不做）時才接手；
   * 四霧將都打完、還沒走過光柱 → 照原本的流程（稱號、Q_POST_3）。頭目＝quests 裡 final:true 的 boss（佛格 fob_king），戰鬥照一般流程（MapScene.startBattle：每日時間檢查、BGM、結局）
   */
  var FINAL_BOSS_FALLBACK = 'fob_king';
  Fx.prototype.testBossFight = function (st) {
    var g = G(), sc = this.scene;
    if (!g || !g.testModeOn || !g.testModeOn()) return false;
    if (EF.bossesDone(st, this.P) && !EF.has(st, 'done', 'pillar_' + this.P.id)) return false;
    var Q = (g.data && g.data.quests) || {}, qid = Object.keys(Q).filter(function (k) { return Q[k].final === true && Q[k].boss; })[0];
    var mid = qid ? Q[qid].boss : FINAL_BOSS_FALLBACK, mon = g.data && g.data.monsters && g.data.monsters[mid];
    if (!mon || !sc || typeof sc.startBattle !== 'function') return false;
    if (this.testPillarWait) return true;   // 剛打完／逃開還站在光柱裡：先走出去再進來
    this.testPillarWait = true;
    g.testPillarFight = (g.testPillarFight || 0) + 1;   // 測試用
    sc.startBattle({ spawn: { monster: mid, boss: true, quest: qid || null }, mon: mon, id: mid, idx: 98, active: false, sprite: null, boss: true });
    return true;
  };

  // ───────── 每一格畫面 ─────────
  Fx.prototype.update = function () {
    var sc = this.scene;
    if (this.fog && this.fog.img && !this.fog.still && sc.player && this.fog.img.setPosition) this.fog.img.setPosition(sc.player.x, sc.player.y - T / 2);
    if (this.arrow) {
      var pet = sc.pet || sc.player;
      if (Date.now() > this.arrow.until) { this.drop(this.arrow.img); this.arrow = null; }
      else if (this.arrow.img.setPosition) this.arrow.img.setPosition(pet.x, pet.y - T * 1.4);
    }
  };
  Fx.prototype.destroy = function () {
    if (this.tools && this.tools.parentNode) this.tools.parentNode.removeChild(this.tools);
    this.tools = null;
    if (this.flameTimer && this.flameTimer.remove) { this.flameTimer.remove(); this.flameTimer = null; }   // v4.2.6 火焰輪播
    this.all.forEach(function (o) { try { if (o && o.destroy) o.destroy(); } catch (e) { /* 場景關掉時物件可能已經被 Phaser 清掉 */ } });
    this.all = []; this.dots = []; this.arrow = null;
  };

  /**
   * 建好地圖後掛上 EastFx。地圖資料有問題（缺欄位、座標錯）時不能讓整張地圖卡死：
   *   單一道機關畫不出來 → 那一道略過（buildPuzzle 外面有 try）；整個建不起來 → 拿掉 EastFx，這張地圖照一般地圖玩，主控台寫原因
   */
  function attach(scene) {
    if (scene.eastFx) { scene.eastFx.destroy(); scene.eastFx = null; }
    if (!EF || !EF.hasEast(scene.map)) return null;
    var fx = null;
    try {
      fx = new Fx(scene);
      scene.eastFx = fx;
      if (scene.events && scene.events.once) scene.events.once('shutdown', function () { if (scene.eastFx === fx) scene.eastFx = null; fx.destroy(); });
      fx.build();
    } catch (e) {
      console.error('[東部] ' + scene.mapId + ' 的東部欄位畫不出來，這張地圖先不用東部功能：', e);
      EastFx.failed = (EastFx.failed || []).concat([scene.mapId + '：' + (e && e.message)]);
      try { if (fx) fx.destroy(); } catch (e2) { /* 忽略 */ }
      scene.eastFx = null;
      return null;
    }
    // 怪物在 EastFx 掛上之前就放好了（原本的 create）：出沒範圍的快取不知道軟雲、門、山屋小燈會擋路 → 清掉快取，站在擋路格上的重新放
    if (scene.areaCache && scene.areaCache.clear) scene.areaCache.clear();
    (scene.monsters || []).forEach(function (mob) { if (mob && !mob.boss && mob.active && fx.blocks(mob.tx, mob.ty) && scene.placeMonster) scene.placeMonster(mob, true); });
    return fx;
  }

  // ═════════════════════ 包住 MapScene 的方法（只包一次）═════════════════════
  function hook(P) {
    if (!P || P.__eastHooked) return false;
    P.__eastHooked = true;
    var wrapped = [];
    function wrap(name, make) { var orig = P[name]; if (typeof orig !== 'function') { console.warn('[東部] MapScene 沒有 ' + name + '()，這個掛鉤略過'); return; } P[name] = make(orig); wrapped.push(name); }
    wrap('create', function (orig) { return function () { this.eastFx = null; var r = orig.apply(this, arguments); if (this.p && !this.transitioning) attach(this); return r; }; });
    wrap('walkable', function (orig) { return function (x, y) { var fx = this.eastFx; if (fx && fx.blocks(x, y)) return false; if (fx && fx.opens(x, y)) return true; return orig.call(this, x, y); }; });   // v4.2 4c：開了的雲階可以走
    wrap('tryStep', function (orig) { return function (dir) { var fx = this.eastFx; if (fx) { var r = fx.tryStep(dir); if (r === true || r === false) return r; } return orig.call(this, dir); }; });
    wrap('walkTo', function (orig) { return function (x, y, target) {
      var fx = this.eastFx;
      if (!fx) return orig.call(this, x, y, target);
      var r = fx.walkTo(x, y, target);
      if (r !== null) return r;
      fx.planning = true;   // 找路時冰面當成不能走（冰上要滑，不能照路線走）
      try { return orig.call(this, x, y, target); } finally { fx.planning = false; }
    }; });
    wrap('arrive', function (orig) { return function () { var fx = this.eastFx; if (fx && fx.beforeArrive()) return true; var r = orig.apply(this, arguments); if (fx && this.eastFx === fx) fx.afterArrive(r); return r; }; });
    wrap('interactableAt', function (orig) { return function (x, y) { var fx = this.eastFx, t = fx && fx.interactableAt(x, y); return t || orig.call(this, x, y); }; });
    wrap('interact', function (orig) { return function (t) {
      if (!(t && t.kind === 'east' && this.eastFx)) return orig.call(this, t);
      if (J.UI.isOpen() && !J.UI.blocksMove()) J.UI.closePassMove();
      this.p.path = [];
      if (J.HUD) J.HUD.prompt(null);
      this.eastFx.interact(t);
    }; });
    wrap('promptText', function (orig) { return function (t) { return t && t.kind === 'east' ? t.prompt : orig.call(this, t); }; });
    wrap('update', function (orig) { return function (time, delta) { var r = orig.call(this, time, delta); var fx = this.eastFx; if (fx && this.p && !this.transitioning) fx.update(time, delta); return r; }; });
    wrap('onWake', function (orig) { return function (data) { var r = orig.call(this, data); if (this.eastFx) this.eastFx.onWake(); return r; }; });
    // v4.2 出口條件的 ctx（World.exitOpen 用）：這張圖的東部欄位＋戰力（只有 pl>= 條件才算）；最後的門的鎖門台詞順序（EastFields.lockDialogs）
    P.exitContext = function (ex) {
      var g = G(), needPl = [].concat((ex && ex.requires) || []).some(function (t) { return /^pl>=/.test(t); });
      return { P: this.eastFx ? this.eastFx.P : null, pl: needPl && J.Character && J.Character.pl ? J.Character.pl(g.state, g.data) : undefined };
    };
    P.lockDialogIds = function (ex) { return EF && EF.lockDialogs ? EF.lockDialogs(ex, G().state, this.exitContext(ex)) : []; };
    EastFx.wrapped = wrapped;
    return true;
  }

  /**
   * v4.2.6 地圖修正：東部物件的美術圖在 MapScene.preload 時一起排進載入（sprites.js 有登記才載；沒登記、沒檔案就照舊程式畫）。
   * 山屋小燈：點亮款（final＝金色曙光款）
   */
  function preload(scene, map) {
    var A = J.Assets, MI = J.MapInfo;
    if (!A || !A.has || !A.queue || !EF || !EF.hasEast || !EF.hasEast(map)) return [];
    // v4.2.8（v4.2.6 審查 L1：每張東部地圖都排整份 ART2）：雲的圖（軟雲／硬雲九宮格 32 張、整朵硬雲 obj_hard_cloud_<id>）只有這張圖有 soft_clouds 才排，
    //   整朵硬雲只排這張圖有的 id（id 規則同 east_fields.js：沒寫 id＝SC<序號>）。其他謎題的圖照舊全排（只在 drawClouds 用的才濾，不會漏圖）
    var sc0 = (map.soft_clouds || []).map(function (c, i) { return 'obj_hard_cloud_' + (c.id || ('SC' + (i + 1))); });
    var keys = ART2.filter(function (k) { return /^obj_(soft|hard)_cloud(_[nswe]+)?$/.test(k) ? sc0.length > 0 : /^obj_hard_cloud_/.test(k) ? sc0.indexOf(k) >= 0 : true; });   // v4.2.6 W1c：第 2 輪美術圖（沒登記的下面會濾掉）
    var lamps = (map.lodge_lamps || []).concat((map.heal_points || []).filter(function (h) { return h.kind === 'lodge_lamp' || !h.kind; }));
    if ((map.signs || []).length) keys.push('obj_road_sign');   // M44 入口木牌（QB-M44-01）
    if (lamps.length && MI && MI.lampArtKey) {
      keys.push(MI.lampArtKey(false, true));
      if (lamps.some(function (l) { return l.kind === 'final'; })) keys.push(MI.lampArtKey(true, true));
    }
    Object.keys(ART).forEach(function (n) { keys.push(ART[n]); });   // 美術還沒交的不在 sprites.js，下一行會濾掉
    keys = keys.filter(function (k) { return A.has(k); });
    keys.forEach(function (k) { A.queue(scene, k); });
    return keys;
  }
  EastFx.preload = preload;
  // MapScene.preload 透過 MapScene.preloadHooks 呼叫（MapScene.js 原文不寫東部的程式，v40_ch7 S40-6）
  if (J.MapScene) (J.MapScene.preloadHooks = J.MapScene.preloadHooks || []).push(preload);
  EastFx.ART = ART;
  EastFx.askFilter = askFilter;   // v4.2 測試用（N-Q-4）
  EastFx.Fx = Fx; EastFx.attach = attach; EastFx.hook = hook; EastFx.reduced = reduced; EastFx.speaker = speaker;
  EastFx.BREATH_MS = BREATH_MS; EastFx.MEMORY_SHOW_MS = MEMORY_SHOW_MS; EastFx.MEMORY_EXTRA_MS = MEMORY_EXTRA_MS; EastFx.COMPASS_DOT_MAPS = COMPASS_DOT_MAPS; EastFx.DEPTH = DEPTH;
  J.EastFx = EastFx;
  hook(J.MapScene && J.MapScene.prototype);
})();
