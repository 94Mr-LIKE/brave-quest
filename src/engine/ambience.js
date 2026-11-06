/*
 * v3.0.1 地圖環境音、腳步聲、樹下沙沙聲、轉場聲（86 號表第四節 #7、#8；作曲 2026-11-04 交的音效包 O\wip_v301\audio_v301\，規格＝O\音樂試聽_C\環境音_v301\說明.md 第 6 節）
 * 由 wip_v301/v301_audio_apply.js 複製成 docs/src/engine/ambience.js；資料（每張地圖配哪幾層、循環點、音量）在 docs/data/ambience.js（window.AMBIENCE，由 manifest 轉出）。
 *
 * 規則（照作曲的規格）：
 *   - 環境音：每一層 AudioBufferSourceNode loop＝true、loopStart＝0.5、loopEnd＝0.5＋一圈（檔案前後各有 0.5 秒墊片；一定要這樣設，整檔循環會跳一下），
 *     從 loopStart＋隨機位置開始；層增益＝10^((trimDb＋地圖表 db)/20) → 環境音匯流排（＝音樂音量 × 0.268，跟著音樂音量滑桿走）→ JQ.Audio 的主輸出。
 *     最多同時 2 層；只載入現在要用的層（解碼後最多留 3 個，舊 iPad 記憶體）。
 *   - 進地圖 0.4 秒淡入；離開（換地圖）0.25 秒淡出；走進／離開區域（maps.js landmarks 或 zones 矩形）1.5 秒交叉淡化；進戰鬥 0.3 秒淡出、回地圖 1.0 秒淡入；
 *     旅店休息 1.0 秒換成夜晚蟲鳴（-6 dB）、醒來換回；分頁隱藏時匯流排靜音。
 *   - 觀景點：走進觀景區域 BGM 0.6 秒內壓低 8 dB（×0.40）、環境音 +3 dB，離開 1.0 秒恢復；互動「看看風景」BGM 壓低 10 dB（×0.32）。
 *   - 開關：音效開關（JQ.Audio 關掉＝context() 是 null）關掉就沒有環境音；音樂開關不影響環境音（照作曲建議），音量用音樂音量滑桿的值。
 *   - 腳步：走路圖「腳落地」那一格觸發（v301 走路圖照距離換圖 0-1-2-1：第 0、2 格是兩腳張開＝落地，每走一格一次）；左腳 1.03、右腳 0.97 播放速度再乘 0.98–1.02；
 *     同一種地面的檔隨機挑、不連續同一個；地面照 Sfx.terrainOf，mud 在沼澤（swamp 圖塊組、M05、M22）用泥地、其他用沙地；carpet 圖塊用地毯。
 *     音效包還沒載好或 file:// 時照舊用合成腳步聲（每兩步一聲）。
 *   - 樹下沙沙聲：主角走進樹冠（上層格）時播一次；同一棵樹冷卻 2 秒、全部冷卻 0.8 秒；-12 dB；播放速度 0.95–1.05。
 *   - 轉場聲：葉叢掃過開始時播（檔案第 0.25 秒最大聲＝葉叢蓋滿那一格）；-9 dB；室內（MT1）進出用輕的那個。
 * node 可以 require（tests/v301_audio.test.js 用假的 AudioContext 驗證）。安全：只 fetch 專案自己的 assets/audio 檔案。
 */
(function () {
  'use strict';
  var root = typeof window !== 'undefined' ? window : {};
  var BUS_PER_MUSIC = 0.268, MAX_LAYERS = 2, MAX_DECODED = 3, AREA_EVERY_MS = 250;
  var FADE = { enter: 0.4, leave: 0.25, area: 1.5, battleOut: 0.3, battleIn: 1.0, inn: 1.0 };
  var VP = { areaDuck: 0.40, interactDuck: 0.32, boostDb: 3, duckSec: 0.6, restoreSec: 1.0 };
  var STEP_RATE = { left: 1.03, right: 0.97, jitter: 0.02 }, RUSTLE = { gain: 0.251, tree: 2000, global: 800 }, SWEEP_GAIN = 0.355;
  var SWAMP_MAPS = ['M05', 'M22'];

  function D() { return root.AMBIENCE || { files: { amb: {}, step: {}, sfx: {} }, maps: {} }; }
  function dbGain(db) { return Math.pow(10, (Number(db) || 0) / 20); }
  /** 這一格（tx,ty）該播哪幾層：zones、areas（landmarks）裡第一個包含這一格的區域換成它的層，否則用地圖的 base；回傳 { layers:[{id,db}], key, viewpoint } */
  function layersAt(cfg, tx, ty) {
    if (!cfg) return { layers: [], key: '', viewpoint: null };
    function inR(r) { return r && tx >= r[0] && ty >= r[1] && tx < r[0] + r[2] && ty < r[1] + r[3]; }
    var hit = null;
    (cfg.zones || []).concat(cfg.areas || []).some(function (a) { if (inR(a.rect)) { hit = a; return true; } return false; });
    var vp = null;
    (cfg.viewpointAreas || []).some(function (a) { if (inR(a.rect)) { vp = a; return true; } return false; });
    var layers = (hit ? hit.layers : cfg.base || []).slice(0, MAX_LAYERS);
    return { layers: layers, key: (hit ? (hit.landmark || hit.name) : 'base') + (vp ? '+vp' : ''), viewpoint: vp };
  }
  function busLevel(musicVolume, boostDb) { return Math.max(0, Math.min(1, Number(musicVolume) || 0)) * BUS_PER_MUSIC * dbGain(boostDb || 0); }
  /** 腳步聲的地面組：terrainOf 的結果＋圖塊名稱＋地圖 */
  function stepSet(terrain, tileName, mapId, tileset) {
    if (tileName === 'carpet') return 'carpet';
    if (terrain === 'mud') return (tileset === 'swamp' || SWAMP_MAPS.indexOf(mapId) >= 0) ? 'mud' : 'sand';
    return terrain === 'wood' || terrain === 'stone' ? terrain : 'grass';
  }
  function stepRate(left, rnd) { return (left ? STEP_RATE.left : STEP_RATE.right) * (1 - STEP_RATE.jitter + 2 * STEP_RATE.jitter * (rnd === undefined ? Math.random() : rnd)); }
  /** 走路圖換到第 idx 格（0-1-2-1 的位置 0–3）時要不要響腳步：0、2＝兩腳張開落地；回傳 'left'／'right'／null */
  function landingFoot(prevIdx, idx) { if (idx === prevIdx) return null; return idx === 0 ? 'left' : idx === 2 ? 'right' : null; }

  // ───────── 播放狀態 ─────────
  var S = { bus: null, layers: {}, cache: {}, mapId: null, cfg: null, key: null, areaAt: 0, vp: null, interact: false, battle: false, inn: false, hidden: false,
    lastStep: {}, rustleAt: 0, treeAt: {}, stepsLoaded: false };
  var stats = { loads: [], starts: [], stops: 0, fadeOuts: 0, steps: 0, rustles: 0, sweeps: 0, duck: 1, enterMaps: [], lastBus: 0 };

  /** 音效開關（JQ.Audio）或音樂開關（JQ.Music）任一個關掉＝沒有環境音（執行長 2026-11-04：家長設定的音效／音樂開關都要能關掉環境音） */
  function audio() {
    try {
      var J = root.JQ, A = J && J.Audio && J.Audio.context();
      if (J && J.Music && typeof J.Music.isEnabled === 'function' && !J.Music.isEnabled()) return null;
      return A && A.ctx && A.out ? A : null;
    } catch (e) { return null; }
  }
  function supported() { var loc = root.location; return !!loc && loc.protocol !== 'file:' && typeof root.fetch === 'function'; }
  function musicVolume() { var M = root.JQ && root.JQ.Music; return M && M.stats && typeof M.stats.volume === 'number' ? M.stats.volume : 0.55; }
  function url(f) { var A = root.JQ && root.JQ.Assets; return A && A.versioned ? A.versioned('assets/audio/' + f) : 'assets/audio/' + f; }
  function ensureBus(A) {
    if (!S.bus || S.bus.ctx !== A.ctx) { var g = A.ctx.createGain(); g.gain.value = 0; g.connect(A.out); S.bus = { ctx: A.ctx, gain: g }; }
    return S.bus;
  }
  function ramp(param, to, sec, ctx) {
    var now = ctx.currentTime;
    try { param.cancelScheduledValues(now); param.setValueAtTime(param.value, now); param.linearRampToValueAtTime(to, now + Math.max(0.01, sec)); } catch (e) { param.value = to; }
  }
  function syncBus(sec) {
    var A = audio(); if (!A) return;
    var b = ensureBus(A), boost = S.vp || S.interact ? VP.boostDb : 0, lvl = S.hidden ? 0 : busLevel(musicVolume(), boost);
    if (Math.abs(lvl - stats.lastBus) > 1e-4 || sec) { ramp(b.gain.gain, lvl, sec || 0.2, A.ctx); stats.lastBus = lvl; }
  }
  /** 載入（fetch＋解碼）一個檔；kind＝amb／step／sfx。環境音解碼後最多留 MAX_DECODED 個（最久沒用的先丟） */
  function load(kind, id) {
    var it = S.cache[id];
    if (it) { it.used = Date.now(); return it.p; }
    var info = (D().files[kind] || {})[id], A = audio();
    if (!info || !A || !supported()) return Promise.resolve(null);
    it = S.cache[id] = { kind: kind, used: Date.now(), buf: null };
    stats.loads.push(info.file);
    it.p = root.fetch(url(info.file)).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.arrayBuffer(); })
      .then(function (bytes) { return new Promise(function (ok, bad) { var pr = A.ctx.decodeAudioData(bytes, ok, bad); if (pr && pr.then) pr.then(ok, bad); }); })
      .then(function (buf) { it.buf = buf; trimCache(); return buf; }, function () { delete S.cache[id]; return null; });
    return it.p;
  }
  function trimCache() {
    var amb = Object.keys(S.cache).filter(function (k) { return S.cache[k].kind === 'amb' && !S.layers[k]; });
    var have = Object.keys(S.cache).filter(function (k) { return S.cache[k].kind === 'amb'; }).length;
    amb.sort(function (a, b) { return S.cache[a].used - S.cache[b].used; });
    while (have > MAX_DECODED && amb.length) { delete S.cache[amb.shift()]; have--; }
  }
  function stopLayer(id, sec) {
    var L = S.layers[id], A = audio(); if (!L) return;
    delete S.layers[id]; stats.stops++;
    if (!A) { try { L.src.stop(); } catch (e) { /* 已停 */ } return; }
    ramp(L.gain.gain, 0, sec, A.ctx);
    try { L.src.stop(A.ctx.currentTime + sec + 0.05); } catch (e) { /* 已停 */ }
  }
  /** 換成這幾層（sec 秒交叉淡化）：不要的淡出停掉、還在的調音量、新的載入後從隨機位置淡入 */
  function setLayers(list, sec) {
    var A = audio(), want = {};
    list.forEach(function (l) { want[l.id] = l; });
    Object.keys(S.layers).forEach(function (id) { if (!want[id]) stopLayer(id, sec); });
    if (!A) return;
    var b = ensureBus(A);
    list.forEach(function (l) {
      var info = D().files.amb[l.id]; if (!info) return;
      var g = dbGain((info.trimDb || 0) + (l.db || 0)), L = S.layers[l.id];
      if (L) { L.target = g; ramp(L.gain.gain, g, sec, A.ctx); return; }
      var token = {};
      S.layers[l.id] = L = { token: token, target: g, src: null, gain: A.ctx.createGain(), pending: true };
      L.gain.gain.value = 0; L.gain.connect(b.gain);
      load('amb', l.id).then(function (buf) {
        var cur = S.layers[l.id];
        if (!buf || !cur || cur.token !== token) return;   // 等解碼時已經換地圖了
        var src = A.ctx.createBufferSource(), len = info.loopEnd - info.loopStart;
        src.buffer = buf; src.loop = true; src.loopStart = info.loopStart; src.loopEnd = info.loopEnd;   // 一定要設 loopStart／loopEnd（前後 0.5 秒墊片）
        src.connect(cur.gain);
        src.start(0, info.loopStart + Math.random() * len);
        cur.src = src; cur.pending = false;
        stats.starts.push(l.id);
        ramp(cur.gain.gain, cur.target, sec, A.ctx);
      });
    });
  }
  function duckBgm(level, sec) { var M = root.JQ && root.JQ.Music; stats.duck = level; if (M && typeof M.duck === 'function') M.duck(level, sec); }
  function applyVp() {
    var lvl = S.interact ? VP.interactDuck : S.vp ? VP.areaDuck : 1;
    if (lvl !== stats.duck) duckBgm(lvl, lvl < 1 ? VP.duckSec : VP.restoreSec);
    syncBus(lvl < 1 ? VP.duckSec : VP.restoreSec);
  }
  function preloadSteps() {
    if (S.stepsLoaded || !audio() || !supported()) return;
    S.stepsLoaded = true;
    Object.keys(D().files.step || {}).forEach(function (id) { if (!/_snow_/.test(id)) load('step', id); });
    Object.keys(D().files.sfx || {}).forEach(function (id) { load('sfx', id); });
  }

  // ───────── 給 MapScene／game.js 呼叫 ─────────
  function enterMap(mapId, tx, ty) {
    S.mapId = mapId; S.cfg = D().maps[mapId] || null; S.key = null; S.vp = null; S.areaAt = 0; S.battle = false;
    stats.enterMaps.push(mapId);
    preloadSteps();
    syncBus(0.05);
    var r = layersAt(S.cfg, tx, ty);
    S.key = r.key; S.vp = r.viewpoint;
    setLayers(S.inn ? [{ id: 'amb_night', db: -6 }] : r.layers, FADE.enter);
    applyVp();
  }
  function update(tx, ty, now) {
    if (!S.cfg || S.battle) return;
    now = now || Date.now();
    var on = !!audio();
    if (!on && Object.keys(S.layers).length) { Object.keys(S.layers).forEach(function (id) { stopLayer(id, 0); }); S.key = null; }   // 開關關掉：馬上停
    if (!on) return;
    if (now < S.areaAt) return;
    S.areaAt = now + AREA_EVERY_MS;
    syncBus();
    var r = layersAt(S.cfg, tx, ty);
    if (r.key === S.key) return;
    S.key = r.key;
    if (!S.inn) setLayers(r.layers, FADE.area);
    var was = !!S.vp; S.vp = r.viewpoint;
    if (was !== !!S.vp) applyVp();
  }
  /** 離開地圖（換地圖、葉叢掃過時）：0.25 秒淡出 */
  function leave(sec) {
    stats.fadeOuts++;
    Object.keys(S.layers).forEach(function (id) { stopLayer(id, sec === undefined ? FADE.leave : sec); });
    S.cfg = null; S.key = null;
    if (S.vp || S.interact) { S.vp = null; S.interact = false; applyVp(); }
  }
  function battle(on) {
    if (on) { S.battle = true; stats.fadeOuts++; var keepCfg = S.cfg, keepMap = S.mapId; Object.keys(S.layers).forEach(function (id) { stopLayer(id, FADE.battleOut); }); S.cfg = keepCfg; S.mapId = keepMap; S.key = null; }
    else if (S.battle) { S.battle = false; S.key = null; S.areaAt = 0; var G = root.JQ && root.JQ.Game, p = G && G.mapScene && G.mapScene.p; var r = layersAt(S.cfg, p ? p.tx : 0, p ? p.ty : 0); S.key = r.key; setLayers(r.layers, FADE.battleIn); }
  }
  function innRest(on) {
    S.inn = !!on;
    if (on) setLayers([{ id: 'amb_night', db: -6 }], FADE.inn);
    else { S.key = null; S.areaAt = 0; var G = root.JQ && root.JQ.Game, p = G && G.mapScene && G.mapScene.p; var r = layersAt(S.cfg, p ? p.tx : 0, p ? p.ty : 0); S.key = r.key; setLayers(r.layers, FADE.inn); }
  }
  function viewInteract(on) { S.interact = !!on; applyVp(); }
  function setHidden(h) { S.hidden = !!h; syncBus(0.2); }
  function playBuf(id, gain, rate) {
    var A = audio(), it = S.cache[id]; if (!A || !it || !it.buf) return false;
    var s = A.ctx.createBufferSource(), g = A.ctx.createGain();
    s.buffer = it.buf; s.playbackRate.value = rate || 1; g.gain.value = gain; s.connect(g); g.connect(A.out); s.start();
    return true;
  }
  /** 音效包的腳步聲能用了嗎（能用就不要再播合成的腳步聲） */
  function stepsReady() { return !!audio() && supported() && Object.keys(S.cache).some(function (k) { return S.cache[k].kind === 'step' && S.cache[k].buf; }); }
  function footstep(set, foot) {
    var ids = Object.keys(D().files.step || {}).filter(function (k) { return k.indexOf('step_' + set + '_') === 0 && S.cache[k] && S.cache[k].buf; });
    if (!ids.length) return false;
    var pool = ids.length > 1 ? ids.filter(function (k) { return k !== S.lastStep[set]; }) : ids, id = pool[Math.floor(Math.random() * pool.length)];
    S.lastStep[set] = id;
    if (playBuf(id, 1, stepRate(foot === 'left'))) { stats.steps++; return true; }
    return false;
  }
  function rustle(treeKey, now) {
    now = now || Date.now();
    if (now - S.rustleAt < RUSTLE.global || (S.treeAt[treeKey] && now - S.treeAt[treeKey] < RUSTLE.tree)) return false;
    var ids = Object.keys(D().files.sfx || {}).filter(function (k) { return /^sfx_tree_rustle_/.test(k); });
    if (!ids.length) return false;
    S.rustleAt = now; S.treeAt[treeKey] = now;
    if (playBuf(ids[Math.floor(Math.random() * ids.length)], RUSTLE.gain, 0.95 + Math.random() * 0.1)) { stats.rustles++; return true; }
    return false;
  }
  function sweep(kind) {
    var id = 'sfx_transition_sweep_' + (kind === 'west' ? 2 : kind === 'indoor' ? 3 : 1);
    if (playBuf(id, SWEEP_GAIN, 1)) { stats.sweeps++; return true; }
    return false;
  }
  if (typeof document !== 'undefined' && document.addEventListener) document.addEventListener('visibilitychange', function () { setHidden(document.visibilityState === 'hidden'); });

  var Ambience = { BUS_PER_MUSIC: BUS_PER_MUSIC, MAX_LAYERS: MAX_LAYERS, MAX_DECODED: MAX_DECODED, FADE: FADE, VP: VP, STEP_RATE: STEP_RATE, RUSTLE: RUSTLE, SWEEP_GAIN: SWEEP_GAIN,
    dbGain: dbGain, layersAt: layersAt, busLevel: busLevel, stepSet: stepSet, stepRate: stepRate, landingFoot: landingFoot,
    enterMap: enterMap, update: update, leave: leave, battle: battle, innRest: innRest, viewInteract: viewInteract, setHidden: setHidden,
    stepsReady: stepsReady, footstep: footstep, rustle: rustle, sweep: sweep, stats: stats, _state: S,
    _reset: function () { Object.keys(S.layers).forEach(function (id) { delete S.layers[id]; }); S.cache = {}; S.bus = null; S.cfg = null; S.mapId = null; S.key = null; S.vp = null; S.interact = false; S.battle = false; S.inn = false; S.hidden = false; S.stepsLoaded = false; S.lastStep = {}; S.rustleAt = 0; S.treeAt = {};
      stats.loads = []; stats.starts = []; stats.stops = 0; stats.fadeOuts = 0; stats.steps = 0; stats.rustles = 0; stats.sweeps = 0; stats.duck = 1; stats.enterMaps = []; stats.lastBus = 0; } };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.Ambience = Ambience; }
  if (typeof module !== 'undefined') module.exports = Ambience;
})();
