/*
 * v3.0.1 樹下效果與前景葉叢轉場（86 號表第四節 #5、#6；由 wip_v301/v301_tree_apply.js 複製成 docs/src/systems/treefx.js）
 *
 * 素材：概念美術 2026-11-04 交的原創圖（O\art_src\v1\fx\，說明.md），wip_v301/make_fx_webp.py 壓成 docs/assets/fx/：
 *   fx_broadleaf.webp（主轉場：失焦闊葉樹叢）、fx_banyan.webp（第二層：失焦榕樹葉＋氣根）、fx_shadow.webp（無縫地面樹影）、fx_leaf_1–4.png（20 像素落葉）。
 *   file:// 開啟或圖讀不到時，改用程式畫的暫代圖（不會壞）。
 *
 * #5 樹下穿越（取代以前「整隻角色蓋 35% 白色剪影」）：
 *   - 主角碰到上層格（樹冠、屋簷 U）時，主角周圍的上層格方塊依距離變透明：中心 CANOPY_MIN_ALPHA，CANOPY_R0 格內最透明，CANOPY_R1 格外不透明，
 *     中間平滑（柔邊）；用 FADE_MS 毫秒淡入淡出。Canvas、WebGL 都能用的簡單版（每一塊上層格本來就是一張小圖，只改 alpha）。
 *     【選項，這版沒做】WebGL 圓形羽化遮罩（不會看到 32 像素方格邊）：要自訂 pipeline，手機要實機量效能。
 *   - 白色剪影物件照舊建立，顯示與否照舊算（debug.ghostVisible、smoke 用它判斷「在樹下」），但透明度設 0；有整張前景圖（map.fg）的地圖照舊顯示剪影。
 *   - 樹蔭：主角在樹下時色調在 SHADE_MS 毫秒內降到 SHADE（0.85），離開回來。
 *   - 地面樹影：樹冠格和樹冠下緣的地面鋪無縫樹影（透明度 SHADOW_ALPHA），每秒漂 SHADOW_DRIFT 像素；只建鏡頭附近的（最多 SHADOW_MAX 格）。
 *   - 落葉：主角走進樹冠時飄 2–3 片（同一棵樹冷卻 2 秒），在樹下時偶爾再飄 1 片；同時最多 LEAF_MAX（4）片。南部、海邊地圖多用紅橙、褐色葉。
 * #6 換地圖轉場：失焦闊葉樹叢從左邊滑進來，0.25 秒蓋滿 → 換地圖 → 新地圖 0.35 秒繼續往右滑出；榕樹那張當第二層，從上方以 0.7 倍速度跟著滑。
 * 減少動態效果（家長設定或系統 prefers-reduced-motion）：樹冠透明照做但直接切、變暗直接變、樹影不漂、沒有落葉、轉場改回原本的淡出淡入。
 * node 可以 require（tests/v301_tree.test.js 測純計算）；畫面相關的函式只在瀏覽器裡由 MapScene 呼叫。
 */
(function () {
  'use strict';
  var CANOPY_MIN_ALPHA = 0.35, CANOPY_R0 = 0.9, CANOPY_R1 = 2.2, FADE_MS = 180, SHADE = 0.85, SHADE_MS = 150;
  var SHADOW_ALPHA = 0.35, SHADOW_DRIFT = [5, 2], SHADOW_MAX = 160;
  var LEAF_MAX = 4, LEAF_TREE_COOLDOWN = 2000, LEAF_EVERY_MS = [1200, 2000];
  var SWEEP_OUT_MS = 250, SWEEP_IN_MS = 350, SWEEP_SCALE_H = 1.6, SWEEP_COVER_FRAC = 0, BANYAN_SPEED = 0.7;
  var ART = { broadleaf: 'fx_broadleaf.webp', banyan: 'fx_banyan.webp', shadow: 'fx_shadow.webp', leaves: ['fx_leaf_1.png', 'fx_leaf_2.png', 'fx_leaf_3.png', 'fx_leaf_4.png'] };
  var WARM_LEAF_MAPS = ['M01', 'M06', 'M04', 'M08', 'M10', 'M11', 'M21', 'M22', 'M23', 'M24', 'M25'];   // 海邊、南部：紅橙欖仁葉、褐色枯葉也會掉
  var FG_DEPTH_LEAF = 45000, SWEEP_DEPTH = 90000, SHADOW_DEPTH = 1;

  function smooth(a, b, x) { var t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); }
  /** 上層格的目標透明度：dist＝這一格中心到主角身體中心（格） */
  function canopyAlpha(dist) { return CANOPY_MIN_ALPHA + (1 - CANOPY_MIN_ALPHA) * smooth(CANOPY_R0, CANOPY_R1, dist); }
  /** 往目標值走：ms 毫秒走完 0→1 的距離；reduce＝直接到 */
  function approach(cur, target, delta, reduce, ms) {
    if (reduce) return target;
    var step = Math.max(0, delta || 0) / (ms || FADE_MS);
    return cur < target ? Math.min(target, cur + step) : Math.max(target, cur - step);
  }
  function grayTint(level) { var c = Math.max(0, Math.min(255, Math.round(255 * level))); return (c << 16) | (c << 8) | c; }
  /** 地面樹影的格子：可走的上層格（樹冠底下），加上可走、不是上層格、正上方是上層格的格子（樹冠下緣） */
  function shadowCells(upperSet, walkable, w, h) {
    var out = [];
    for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
      if (!walkable(x, y)) continue;
      if (upperSet[x + ',' + y] || (y > 0 && upperSet[x + ',' + (y - 1)])) out.push({ x: x, y: y });
    }
    return out;
  }
  /** 轉場位置（畫面座標）：W、H＝畫面；iw、ih＝葉叢圖原尺寸 → { dw, dh, top, start, cover, end } */
  function sweepPlan(W, H, iw, ih) {
    var dh = Math.round(H * SWEEP_SCALE_H), dw = Math.round(iw * dh / ih);
    return { dw: dw, dh: dh, top: Math.round((H - dh) / 2), start: -dw, cover: Math.round(SWEEP_COVER_FRAC * dw), end: W };
  }
  function leafSet(mapId) { return WARM_LEAF_MAPS.indexOf(mapId) >= 0 ? [0, 1, 2, 3] : [0, 1]; }
  function reduceNow() {
    var J = typeof window !== 'undefined' && window.JQ;
    if (!J) return false;
    var st = J.Game && J.Game.state;
    if (J.Motion) return J.Motion.reduceMotion(st && st.settings, window.matchMedia && window.matchMedia.bind(window));
    var v = st && st.settings && st.settings.reduceMotion;
    if (v === 'on') return true;
    if (v === 'off') return false;
    try { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) { return false; }
  }

  // ───────── 程式畫的暫代圖（file:// 或圖讀不到時）─────────
  function canvasTex(scene, key, w, h, draw) {
    if (scene.textures.exists(key)) return key;
    var t = scene.textures.createCanvas(key, w, h);
    draw(t.getContext(), w, h);
    t.refresh();
    return key;
  }
  function fallbackTextures(scene) {
    canvasTex(scene, 'fx:shadowfb', 64, 64, function (g, w, h) {
      [[16, 16, 14], [44, 22, 12], [28, 46, 16], [56, 52, 10], [6, 50, 9]].forEach(function (b) {
        var gr = g.createRadialGradient(b[0], b[1], 0, b[0], b[1], b[2]);
        gr.addColorStop(0, 'rgba(0,0,0,0.5)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
        g.fillStyle = gr; g.fillRect(0, 0, w, h);
      });
    });
    [['fx:leaffb0', '#5f9e45', '#3d6e2c'], ['fx:leaffb1', '#d6b84a', '#9b7d22']].forEach(function (c) {
      canvasTex(scene, c[0], 8, 6, function (g) {
        g.fillStyle = c[1]; g.beginPath(); g.ellipse(4, 3, 3.6, 2.2, 0.4, 0, Math.PI * 2); g.fill();
        g.strokeStyle = c[2]; g.lineWidth = 0.8; g.beginPath(); g.moveTo(1, 4.5); g.lineTo(7, 1.5); g.stroke();
      });
    });
  }
  /** 程式畫的「模糊葉叢」：寬 1.6 倍高（和美術圖同比例），左半不透明、右邊漸疏 */
  function sweepFallback(scene) {
    return canvasTex(scene, 'fx:sweepfb', 800, 500, function (g, w, h) {
      var seed = 7;
      function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
      var base = g.createLinearGradient(0, 0, w, 0);
      base.addColorStop(0, 'rgba(14,38,18,1)'); base.addColorStop(0.62, 'rgba(14,38,18,1)'); base.addColorStop(1, 'rgba(14,38,18,0)');
      g.fillStyle = base; g.fillRect(0, 0, w, h);
      var greens = ['47,107,51', '31,77,38', '63,127,58', '23,58,29', '86,140,62'];
      for (var i = 0; i < 120; i++) {
        var x = rnd() * w, y = rnd() * h, r = 14 + rnd() * 50, edge = Math.min(1, (w - x) / (w * 0.4));
        var gr = g.createRadialGradient(x, y, 0, x, y, r), c = greens[i % greens.length], a = (0.35 + rnd() * 0.45) * edge;
        gr.addColorStop(0, 'rgba(' + c + ',' + a.toFixed(3) + ')'); gr.addColorStop(1, 'rgba(' + c + ',0)');
        g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2);
      }
    });
  }
  function tex(scene, artKey, fb) { return scene.textures.exists(artKey) ? artKey : fb; }

  // ───────── MapScene 呼叫 ─────────
  function preload(scene) {
    var J = window.JQ;
    if (J.Assets && J.Assets.FILE_MODE) return;   // file://：WebGL 讀不了本機圖，用暫代圖
    var ver = (J.Assets && J.Assets.versioned) || function (u) { return u; };
    function img(key, f) { if (!scene.textures.exists(key)) scene.load.image(key, ver('assets/fx/' + f)); }
    img('fx:broadleaf', ART.broadleaf); img('fx:banyan', ART.banyan); img('fx:shadow', ART.shadow);
    ART.leaves.forEach(function (f, i) { img('fx:leaf' + i, f); });
  }
  function build(scene) {
    var J = window.JQ;
    fallbackTextures(scene);
    var up = J.MapInfo.upperCells(scene.map, J.Game.data.tilesets).set;
    scene.tfx = {
      up: up, faded: [], tint: 1, leaves: [], leafAt: 0, treeAt: {}, wasHit: false, shadows: {}, shadowAt: 0,
      cells: shadowCells(up, function (x, y) { return scene.walkable(x, y); }, scene.size.w, scene.size.h),
      ghostOff: !scene.fgFile   // 有整張前景圖的地圖沒有一塊一塊的上層格可以變透明 → 照舊用剪影
    };
    if (scene.tfx.ghostOff && scene.ghost) scene.ghost.setAlpha(0);
    scene.events.once('shutdown', function () { scene.tfx = null; });
  }
  function nearImages(scene, cx, cy) {
    var B = 8, out = [], bx = Math.floor(cx / B), by = Math.floor(cy / B);
    for (var yy = by - 1; yy <= by + 1; yy++) for (var xx = bx - 1; xx <= bx + 1; xx++) {
      var list = scene.fgBuckets && scene.fgBuckets[xx + ',' + yy];
      if (list) for (var i = 0; i < list.length; i++) out.push(list[i]);
    }
    return out;
  }
  function dropLeaf(scene, f, c0, delay) {
    var J = window.JQ, T = J.CONFIG.TILE, set = leafSet(scene.mapId), k = set[Math.floor(Math.random() * set.length)];
    var key = scene.textures.exists('fx:leaf' + k) ? 'fx:leaf' + k : 'fx:leaffb' + (k % 2);
    var leaf = scene.add.image(c0[0] * T + 4 + Math.random() * (T - 8), c0[1] * T + T * 0.6, key).setDepth(FG_DEPTH_LEAF).setAngle(Math.random() * 360).setAlpha(0);
    var x00 = leaf.x, fall = 50 + Math.random() * 22, dur = 1700 + Math.random() * 700, sway = 6 + Math.random() * 7;
    f.leaves.push(leaf);
    scene.tweens.add({ targets: leaf, y: leaf.y + fall, angle: leaf.angle + 160 + Math.random() * 160, duration: dur, delay: delay || 0, ease: 'Sine.easeIn',
      onUpdate: function (tw) { var p = tw.progress; leaf.x = x00 + Math.sin(p * Math.PI * 2) * sway; leaf.setAlpha(p < 0.08 ? p / 0.08 : p > 0.75 ? (1 - p) * 4 : 1); },
      onComplete: function () { leaf.destroy(); if (scene.tfx) scene.tfx.leaves = scene.tfx.leaves.filter(function (l) { return l !== leaf; }); } });
  }
  function update(scene, delta, time) {
    var f = scene.tfx, J = window.JQ;
    if (!f || !scene.player) return;
    var T = J.CONFIG.TILE, pl = scene.player, reduce = reduceNow(), now = time || Date.now();
    var hit = !!(scene.ghost && scene.ghost.visible);
    if (f.ghostOff && scene.ghost && scene.ghost.alpha !== 0) scene.ghost.setAlpha(0);
    // 樹冠局部透明（柔邊、淡入淡出）
    var bx = pl.x / T, by = (pl.y - pl.displayHeight * 0.5) / T, want = new Map();
    if (hit && f.ghostOff) nearImages(scene, Math.floor(bx), Math.floor(by)).forEach(function (img) {
      if (img.fgX === undefined) return;
      var d = Math.sqrt(Math.pow(img.fgX + 0.5 - bx, 2) + Math.pow(img.fgY + 0.5 - by, 2));
      if (d < CANOPY_R1) want.set(img, canopyAlpha(d));
    });
    want.forEach(function (a, img) { if (f.faded.indexOf(img) < 0) f.faded.push(img); });
    var keep = [];
    f.faded.forEach(function (img) {
      if (!img.scene) return;
      var target = want.has(img) ? want.get(img) : 1, a = approach(img.alpha, target, delta, reduce, FADE_MS);
      if (img.alpha !== a) img.setAlpha(a);
      if (a < 1 || target < 1) keep.push(img);
    });
    f.faded = keep;
    // 樹蔭變暗（別的效果把主角染色時不動它）
    var lastTint = grayTint(f.tint);
    f.tint = approach(f.tint, hit ? SHADE : 1, delta, reduce, SHADE_MS / (1 - SHADE));   // 1 → 0.85 走 SHADE_MS 毫秒
    if (!pl.isTinted || pl.tintTopLeft === lastTint) {
      if (f.tint >= 0.999) { if (pl.isTinted) pl.clearTint(); } else pl.setTint(grayTint(f.tint));
    }
    // 地面樹影（每 200 ms 依鏡頭範圍建／收）
    if (now >= f.shadowAt) {
      f.shadowAt = now + 200;
      var v = scene.cameras.main.worldView, x0 = Math.floor(v.x / T) - 2, x1 = Math.ceil((v.x + v.width) / T) + 2, y0 = Math.floor(v.y / T) - 2, y1 = Math.ceil((v.y + v.height) / T) + 2;
      var n = 0, seen = {}, art = scene.textures.exists('fx:shadow');
      f.cells.forEach(function (c) {
        if (c.x < x0 || c.x > x1 || c.y < y0 || c.y > y1 || n >= SHADOW_MAX) return;
        var k = c.x + ',' + c.y; seen[k] = true; n++;
        if (!f.shadows[k]) {
          var ts = scene.add.tileSprite(c.x * T, c.y * T, T, T, art ? 'fx:shadow' : 'fx:shadowfb').setOrigin(0, 0).setDepth(SHADOW_DEPTH).setAlpha(SHADOW_ALPHA);
          ts.wx = c.x * T; ts.wy = c.y * T;
          f.shadows[k] = ts;
        }
      });
      Object.keys(f.shadows).forEach(function (k) { if (!seen[k]) { f.shadows[k].destroy(); delete f.shadows[k]; } });
    }
    var ox = reduce ? 0 : now / 1000 * SHADOW_DRIFT[0], oy = reduce ? 0 : now / 1000 * SHADOW_DRIFT[1];
    Object.keys(f.shadows).forEach(function (k) { var ts = f.shadows[k]; ts.setTilePosition(ts.wx + ox, ts.wy + oy); });   // 用世界座標當樹影的位置：相鄰格子接得起來
    // 樹下沙沙聲（86 號 #7；冷卻規則在 ambience.js；減少動態效果也照播）
    if (hit && !f.wasHit && J.Ambience) J.Ambience.rustle(Math.floor(pl.x / T) + ',' + Math.floor((pl.y - 1) / T), now);
    // 落葉
    if (reduce) { f.wasHit = hit; return; }
    var cx = Math.floor(pl.x / T), cy = Math.floor((pl.y - 1) / T), cand = [];
    for (var yy = cy - 3; yy <= cy; yy++) for (var xx = cx - 2; xx <= cx + 2; xx++) if (f.up[xx + ',' + yy]) cand.push([xx, yy]);
    var free = function (c) { var t0 = f.treeAt[c[0] + ',' + c[1]]; return !t0 || now - t0 >= LEAF_TREE_COOLDOWN; };
    if (hit && !f.wasHit && cand.length) {   // 剛走進樹冠：飄 2–3 片
      var nn = Math.min(LEAF_MAX - f.leaves.length, 2 + Math.floor(Math.random() * 2));
      for (var i = 0; i < nn; i++) { var c1 = cand[Math.floor(Math.random() * cand.length)]; if (!free(c1)) continue; f.treeAt[c1[0] + ',' + c1[1]] = now; dropLeaf(scene, f, c1, i * 260); }
      f.leafAt = now + LEAF_EVERY_MS[0];
    } else if (hit && now >= f.leafAt && f.leaves.length < LEAF_MAX && cand.length) {   // 在樹下：偶爾再飄 1 片
      f.leafAt = now + LEAF_EVERY_MS[0] + Math.random() * (LEAF_EVERY_MS[1] - LEAF_EVERY_MS[0]);
      var c2 = cand[Math.floor(Math.random() * cand.length)];
      if (free(c2)) { f.treeAt[c2[0] + ',' + c2[1]] = now; dropLeaf(scene, f, c2, 0); }
    }
    f.wasHit = hit;
  }
  /** 換地圖前：葉叢從左邊滑進來蓋滿畫面，蓋滿時呼叫 done。減少動態效果時回傳 false（呼叫的人照舊淡出） */
  function sweepOut(scene, done) {
    if (reduceNow()) return false;
    var J = window.JQ, cam = scene.cameras.main, W = cam.width, H = cam.height, key = tex(scene, 'fx:broadleaf', null) || sweepFallback(scene);
    var src = scene.textures.get(key).getSourceImage(), pl = sweepPlan(W, H, src.width, src.height);
    var a = scene.add.image(pl.start, pl.top, key).setOrigin(0, 0).setScrollFactor(0).setDepth(SWEEP_DEPTH).setDisplaySize(pl.dw, pl.dh);
    scene.tweens.add({ targets: a, x: pl.cover, duration: SWEEP_OUT_MS, ease: 'Sine.easeIn', onComplete: function () { done(); } });
    if (scene.textures.exists('fx:banyan')) {
      var bs = scene.textures.get('fx:banyan').getSourceImage(), bp = sweepPlan(W, H, bs.width, bs.height);
      var b = scene.add.image(-bp.dw, Math.round(-bp.dh * 0.22), 'fx:banyan').setOrigin(0, 0).setScrollFactor(0).setDepth(SWEEP_DEPTH - 1).setDisplaySize(bp.dw, bp.dh);
      scene.tweens.add({ targets: b, x: -bp.dw + BANYAN_SPEED * (pl.cover - pl.start), duration: SWEEP_OUT_MS, ease: 'Sine.easeIn' });
      J.Game.leafSweepBanyanX = -bp.dw + BANYAN_SPEED * (pl.cover - pl.start);
    }
    J.Game.leafSweepCount = (J.Game.leafSweepCount || 0) + 1;   // 測試、截圖用
    if (J.Ambience) J.Ambience.sweep(scene.mapId === 'MT1' ? 'indoor' : 'east');   // v3.0.1（86 號 #7）轉場聲：第 0.25 秒最大聲＝葉叢蓋滿那一格（葉叢由左往右掃）
    return true;
  }
  /** 新地圖：如果是葉叢轉場進來的，先蓋著，再往右滑出去。回傳 true＝已處理（呼叫的人不要再淡入） */
  function sweepIn(scene) {
    var G = window.JQ.Game;
    if (!G.leafSweepIn) return false;
    G.leafSweepIn = false;
    if (reduceNow()) return false;
    var cam = scene.cameras.main, W = cam.width, H = cam.height, key = tex(scene, 'fx:broadleaf', null) || sweepFallback(scene);
    var src = scene.textures.get(key).getSourceImage(), pl = sweepPlan(W, H, src.width, src.height);
    var a = scene.add.image(pl.cover, pl.top, key).setOrigin(0, 0).setScrollFactor(0).setDepth(SWEEP_DEPTH).setDisplaySize(pl.dw, pl.dh);
    scene.tweens.add({ targets: a, x: pl.end, duration: SWEEP_IN_MS, ease: 'Sine.easeOut', onComplete: function () { a.destroy(); } });
    if (scene.textures.exists('fx:banyan') && G.leafSweepBanyanX !== undefined) {
      var bs = scene.textures.get('fx:banyan').getSourceImage(), bp = sweepPlan(W, H, bs.width, bs.height);
      var b = scene.add.image(G.leafSweepBanyanX, Math.round(-bp.dh * 0.22), 'fx:banyan').setOrigin(0, 0).setScrollFactor(0).setDepth(SWEEP_DEPTH - 1).setDisplaySize(bp.dw, bp.dh);
      scene.tweens.add({ targets: b, x: G.leafSweepBanyanX + BANYAN_SPEED * (pl.end - pl.cover), duration: SWEEP_IN_MS, ease: 'Sine.easeOut', onComplete: function () { b.destroy(); } });
    }
    return true;
  }

  var TreeFX = { CANOPY_MIN_ALPHA: CANOPY_MIN_ALPHA, CANOPY_R0: CANOPY_R0, CANOPY_R1: CANOPY_R1, FADE_MS: FADE_MS, SHADE: SHADE, SHADE_MS: SHADE_MS, SHADOW_ALPHA: SHADOW_ALPHA,
    SHADOW_DRIFT: SHADOW_DRIFT, LEAF_MAX: LEAF_MAX, SWEEP_OUT_MS: SWEEP_OUT_MS, SWEEP_IN_MS: SWEEP_IN_MS, SWEEP_SCALE_H: SWEEP_SCALE_H, BANYAN_SPEED: BANYAN_SPEED, ART: ART,
    canopyAlpha: canopyAlpha, approach: approach, grayTint: grayTint, shadowCells: shadowCells, sweepPlan: sweepPlan, leafSet: leafSet,
    preload: preload, build: build, update: update, sweepOut: sweepOut, sweepIn: sweepIn };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.TreeFX = TreeFX; }
  if (typeof module !== 'undefined') module.exports = TreeFX;
})();
