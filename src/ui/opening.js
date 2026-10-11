/*
 * 片頭動畫（v0.9.5，老闆 2026-10-11：把 anim_lab/opening.html 試做版整合進遊戲）
 * - 播放時機：標題畫面按「點一下開始」之後、出現選單之前，配標題序曲（title）。
 * - 一定有「跳過」按鈕（Esc 也可以）；看過一次（播完或跳過）之後預設直接跳過，可以在家長設定「重看片頭動畫」。
 * - 繪圖程式沿用動畫組的試做版（Canvas 2D，畫面 = frame(t)，同一個 t 一定畫出同一張圖）；只改成外部腳本（CSP：不用 eval、不用 inline script），
 *   美術一樣用 GPT 圖（assets/ui/title.png、battle/bb_town.png、bb_grass.png、chars/ 的勇者與番薯仔、monsters/boss_fog.png），
 *   圖檔網址走 J.Assets.resolveUrl（一般網址加版本號；雙擊 index.html 的 file:// 模式用打包的 data URI）。
 * - 平板效能：畫布倍率依實際顯示像素選 1 或 1.5（上限 1.5，見 anim_lab/perf.json：iPad 尺寸 1.5 倍平均約 60fps）；
 *   粒子上限 426 個、全部在初始化時建立，每一幀不產生新物件。
 * - 圖片讀不到（例如沒有網路）：不播片頭，直接進選單（不擋住遊戲）。
 */
(function () {
  'use strict';
  var J = window.JQ = window.JQ || {};
  var SEEN_KEY = 'bq_opening_seen';
  // ====================================================================== 基本設定
  var W = 1280, H = 720, DUR = 45;            // 邏輯解析度（16:9）與片長
  var RS = 2;                                  // 文字類預先繪製的解析度倍率（畫布倍率最高 2 也清楚）
  var FONT = '"Microsoft JhengHei", "PingFang TC", "Noto Sans TC", "Heiti TC", sans-serif';

  // 分鏡表（同時給說明文件與測試用）
  var SCENES = [
    { id: 1, name: '北海岸日出', t0: 0, t1: 8, shot: 6.4 },
    { id: 2, name: '灰霧從海上湧來', t0: 8, t1: 15, shot: 12.6 },
    { id: 3, name: '五盞知識燈依序熄滅', t0: 15, t1: 24, shot: 19.7 },
    { id: 4, name: '勇者與番薯仔登場（風吹圍巾）', t0: 24, t1: 33, shot: 30.4 },
    { id: 5, name: '光點聚集', t0: 33, t1: 39, shot: 36.8 },
    { id: 6, name: '標題「勇者大冒險」浮現', t0: 39, t1: 45, shot: 44.2 }
  ];
  // 字幕（最多 6 句，給 8–9 歲的孩子看：短、口語）
  var SUBS = [
    { t0: 1.3, t1: 7.4, text: '北海岸有個小鎮，叫做金包里。' },
    { t0: 8.8, t1: 14.3, text: '有一天，灰灰的遺忘霧從海上飄來。' },
    { t0: 16.2, t1: 23.2, text: '五盞知識燈，一盞一盞熄滅了……' },
    { t0: 25.2, t1: 32.6, text: '勇者和番薯仔，決定出發！' },
    { t0: 33.6, t1: 38.4, text: '一起把知識的光找回來吧！' },
    { t0: 42.0, t1: 9999, text: '冒險，現在開始！' }
  ];
  // 五盞知識燈（科目與遊戲 maps.js 的 lamps 相同）
  var SUBJ = [
    { name: '國語', rgb: [255, 104, 104] },
    { name: '英語', rgb: [92, 172, 255] },
    { name: '數學', rgb: [255, 214, 64] },
    { name: '自然', rgb: [100, 216, 116] },
    { name: '社會', rgb: [255, 160, 72] }
  ];
  var GOLD = [255, 226, 150];

  var cv = null, ctx = null;   // 每次播放建立新的畫布（播完就移除）
  var k = 1;   // 畫布倍率（畫布像素 = 邏輯像素 × k）

  // ====================================================================== 小工具（純函式）
  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }
  function lerp(a, b, u) { return a + (b - a) * u; }
  function sstep(a, b, x) { x = clamp((x - a) / (b - a), 0, 1); return x * x * (3 - 2 * x); }
  function bump(a, b, c, d, x) { return sstep(a, b, x) * (1 - sstep(c, d, x)); }
  function fract(x) { return x - Math.floor(x); }
  function easeOutBack(u) { var c = 1.70158, v = u - 1; return 1 + (c + 1) * v * v * v + c * v * v; }
  function rng(seed) {   // mulberry32：固定種子，每次產生一樣的結果
    var s = seed >>> 0;
    return function () {
      s = (s + 0x6D2B79F5) >>> 0;
      var t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  var RT = new Float32Array(4096);   // 亂數表：粒子閃爍、燈的抖動都查表，不在每一幀產生亂數
  (function () { var r = rng(20261008); for (var i = 0; i < RT.length; i++) RT[i] = r(); })();
  function mk(w, h) { var c = document.createElement('canvas'); c.width = Math.max(1, Math.round(w)); c.height = Math.max(1, Math.round(h)); return c; }
  var BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  function dither(v, levels, x, y) {   // 量化成幾階＋Bayer 抖色：SFC 的「點點漸層」
    var q = Math.floor(v * levels + BAYER[(y & 3) * 4 + (x & 3)] / 16) / levels;
    return q < 0 ? 0 : q > 1 ? 1 : q;
  }
  function roundRect(g, x, y, w, h, r) {
    g.beginPath(); g.moveTo(x + r, y); g.lineTo(x + w - r, y); g.quadraticCurveTo(x + w, y, x + w, y + r);
    g.lineTo(x + w, y + h - r); g.quadraticCurveTo(x + w, y + h, x + w - r, y + h); g.lineTo(x + r, y + h);
    g.quadraticCurveTo(x, y + h, x, y + h - r); g.lineTo(x, y + r); g.quadraticCurveTo(x, y, x + r, y); g.closePath();
  }

  // 數值雜訊（x 方向可循環，做可無縫平鋪的霧）
  function Lattice(r, nx, ny) { this.nx = nx; this.ny = ny; this.a = new Float32Array(nx * ny); for (var i = 0; i < this.a.length; i++) this.a[i] = r(); }
  Lattice.prototype.at = function (x, y) {
    var nx = this.nx, ny = this.ny, a = this.a;
    var xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi;
    fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy);
    var x0 = ((xi % nx) + nx) % nx, x1 = (x0 + 1) % nx, y0 = clamp(yi, 0, ny - 1), y1 = clamp(yi + 1, 0, ny - 1);
    var v0 = a[y0 * nx + x0] + (a[y0 * nx + x1] - a[y0 * nx + x0]) * fx;
    var v1 = a[y1 * nx + x0] + (a[y1 * nx + x1] - a[y1 * nx + x0]) * fx;
    return v0 + (v1 - v0) * fy;
  };
  function Fbm(r, nx, ny, oct) { this.L = []; for (var o = 0; o < oct; o++) this.L.push(new Lattice(r, nx << o, (ny << o) + 1)); }
  Fbm.prototype.at = function (u, v) {   // u、v 介於 0–1
    var s = 0, amp = 1, tot = 0;
    for (var o = 0; o < this.L.length; o++) { var L = this.L[o]; s += amp * L.at(u * L.nx, v * (L.ny - 1)); tot += amp; amp *= 0.5; }
    return s / tot;
  };

  // ====================================================================== 程序產生的素材（初始化時做一次）
  /** 霧堤：低解析度、量化＋抖色，放大後是 SFC 風格的顆粒霧。front='left' 霧的前緣在左邊（往左湧），'right' 反之 */
  function makeFogBank(w, h, seed, front) {
    var r = rng(seed), F = new Fbm(r, 10, 3, 3), top = new Lattice(r, 22, 1), edge = new Lattice(r, 7, 1);
    var c = mk(w, h), g = c.getContext('2d'), img = g.createImageData(w, h), d = img.data;
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var u = x / w, v = y / h;
        var tp = 0.08 + 0.34 * top.at(u * 22, 0);
        var vy = sstep(tp, tp + 0.24, v);
        var dist = front === 'left' ? u : 1 - u, e = 0.05 + 0.08 * edge.at(v * 7, 0);
        var vx = sstep(e, e + 0.16, dist);
        var n = F.at(u, v);
        var dens = clamp(vy * vx * (0.5 + 0.75 * n), 0, 1);
        var a = dither(dens, 4, x, y);
        var tone = clamp((v - tp) / 0.45, 0, 1) * 0.8 + (1 - n) * 0.2;
        var i4 = (y * w + x) * 4;
        d[i4] = lerp(232, 150, tone); d[i4 + 1] = lerp(229, 146, tone); d[i4 + 2] = lerp(242, 172, tone); d[i4 + 3] = a * 242;
      }
    }
    g.putImageData(img, 0, 0);
    return c;
  }
  /** 可左右無縫平鋪的薄霧帶 */
  function makeFogStrip(w, h, seed) {
    var r = rng(seed), F = new Fbm(r, 8, 2, 3);
    var c = mk(w, h), g = c.getContext('2d'), img = g.createImageData(w, h), d = img.data;
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var u = x / w, v = y / h, n = F.at(u, v);
        var dens = clamp((sstep(0, 0.4, v) * (1 - sstep(0.6, 1, v))) * (n * 1.5 - 0.35), 0, 1);
        var i4 = (y * w + x) * 4;
        d[i4] = 214; d[i4 + 1] = 210; d[i4 + 2] = 228; d[i4 + 3] = dither(dens, 4, x, y) * 230;
      }
    }
    g.putImageData(img, 0, 0);
    return c;
  }
  /** 光暈：同心階梯＋抖色（SFC 光暈），中心偏白 */
  function makeGlow(n, rgb, pw) {
    var c = mk(n, n), g = c.getContext('2d'), img = g.createImageData(n, n), d = img.data, h = n / 2;
    for (var y = 0; y < n; y++) {
      for (var x = 0; x < n; x++) {
        var dx = x + 0.5 - h, dy = y + 0.5 - h, rr = Math.sqrt(dx * dx + dy * dy) / h;
        var it = Math.pow(Math.max(0, 1 - rr), pw || 1.8), q = dither(it, 5, x, y);
        var wm = clamp((q - 0.55) / 0.45, 0, 1), i4 = (y * n + x) * 4;
        d[i4] = lerp(rgb[0], 255, wm); d[i4 + 1] = lerp(rgb[1], 255, wm); d[i4 + 2] = lerp(rgb[2], 255, wm); d[i4 + 3] = q * 255;
      }
    }
    g.putImageData(img, 0, 0);
    return c;
  }
  /** 光芒（放射狀） */
  function makeRays(n, rgb) {
    var c = mk(n, n), g = c.getContext('2d'), img = g.createImageData(n, n), d = img.data, h = n / 2;
    for (var y = 0; y < n; y++) {
      for (var x = 0; x < n; x++) {
        var dx = x + 0.5 - h, dy = y + 0.5 - h, rr = Math.sqrt(dx * dx + dy * dy) / h;
        if (rr > 1) continue;
        var a = Math.atan2(dy, dx);
        var ray = Math.pow(0.5 + 0.5 * Math.cos(a * 10), 5) + 0.35 * Math.pow(0.5 + 0.5 * Math.cos(a * 17 + 1.3), 8);
        var it = clamp(ray * Math.pow(1 - rr, 1.2) * 1.1, 0, 1), i4 = (y * n + x) * 4;
        d[i4] = rgb[0]; d[i4 + 1] = rgb[1]; d[i4 + 2] = rgb[2]; d[i4 + 3] = dither(it, 4, x, y) * 255;
      }
    }
    g.putImageData(img, 0, 0);
    return c;
  }
  function pxArt(rows, colors) {   // 字串點陣圖 → 畫布
    var c = mk(rows[0].length, rows.length), g = c.getContext('2d');
    for (var y = 0; y < rows.length; y++) for (var x = 0; x < rows[y].length; x++) {
      var ch = rows[y][x]; if (colors[ch]) { g.fillStyle = colors[ch]; g.fillRect(x, y, 1, 1); }
    }
    return c;
  }
  function rgbStr(rgb, m) { m = m || 0; return 'rgb(' + Math.round(lerp(rgb[0], 255, m)) + ',' + Math.round(lerp(rgb[1], 255, m)) + ',' + Math.round(lerp(rgb[2], 255, m)) + ')'; }
  /** 知識燈（像素畫，20×76，放大 4 倍） */
  function makeLamp(rgb) {
    var c = mk(20, 76), g = c.getContext('2d');
    function p(col, x, y, w, h) { g.fillStyle = col; g.fillRect(x, y, w || 1, h || 1); }
    var D = '#232736', M = '#3b4154', L = '#5d6684';
    p(D, 9, 0, 2, 2); p(D, 7, 2, 6, 1); p(D, 5, 3, 10, 1); p(M, 4, 4, 12, 2); p(L, 5, 4, 5, 1);
    p(D, 4, 6, 12, 12);
    if (rgb) {
      p(rgbStr(rgb, 0.1), 6, 7, 8, 10); p(rgbStr(rgb, 0.5), 7, 8, 6, 8); p('#fffbea', 8, 10, 4, 4);
    } else {
      p('#363d55', 6, 7, 8, 10); p('#4a5370', 7, 8, 1, 4); p('#4a5370', 8, 8, 1, 1);
    }
    p(D, 9, 6, 2, 12); p(D, 4, 11, 12, 1);
    p(M, 5, 18, 10, 1); p(D, 6, 19, 8, 1); p(D, 8, 20, 4, 2);
    p(D, 8, 22, 4, 43); p(L, 9, 22, 1, 43); p(M, 7, 34, 6, 2); p(M, 7, 56, 6, 2);
    p(M, 6, 65, 8, 3); p(L, 6, 65, 8, 1); p('#575c6b', 3, 68, 14, 8); p('#7a8091', 3, 68, 14, 1); p('#3c404c', 3, 75, 14, 1);
    return c;
  }
  /** 燈上的科目牌（DQ 藍窗風格，文字以 RS 倍率預畫） */
  function makePlaque(text, rgb) {
    var w = 104, h = 48, c = mk(w * RS, h * RS), g = c.getContext('2d');
    g.scale(RS, RS);
    roundRect(g, 3, 3, w - 6, h - 6, 8);
    g.fillStyle = rgb ? '#22306a' : '#262935'; g.fill();
    g.lineWidth = 3; g.strokeStyle = rgb ? '#f4f1e6' : '#6f7383'; g.stroke();
    g.font = 'bold 27px ' + FONT; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.lineJoin = 'round'; g.lineWidth = 5; g.strokeStyle = '#0d1530'; g.strokeText(text, w / 2, h / 2 + 1);
    g.fillStyle = rgb ? rgbStr(rgb, 0.35) : '#8a8d99'; g.fillText(text, w / 2, h / 2 + 1);
    return c;
  }
  /** 芒草叢（前景） */
  function makeTuft(seed) {
    var w = 28, h = 44, c = mk(w, h), g = c.getContext('2d'), r = rng(seed);
    for (var b = 0; b < 9; b++) {
      var bx = 14 + (r() - 0.5) * 12, lean = (r() - 0.5) * 0.9, len = 20 + r() * 22;
      g.fillStyle = r() < 0.5 ? '#2c5524' : '#46783a';
      var x = bx, y;
      for (var s = 0; s < len; s++) { y = h - 1 - s; x = bx + lean * s + (s * s) * lean * 0.01; g.fillRect(Math.round(x), y, s < 6 ? 2 : 1, 1); }
      if (r() < 0.75) for (var q = 0; q < 8; q++) {
        g.fillStyle = q % 3 ? '#efe8d4' : '#cbbf9f';
        g.fillRect(Math.round(x + (r() - 0.5) * 4 + lean * q), Math.round(y - q * 0.9), 1, 1);
      }
    }
    return c;
  }
  /** 標題字（每個字一張） */
  function makeGlyph(ch, fs) {
    var m = mk(4, 4).getContext('2d'); m.font = '900 ' + fs + 'px ' + FONT;
    var adv = Math.ceil(m.measureText(ch).width), pad = 28, w = adv + pad * 2, h = Math.round(fs * 1.25) + pad * 2;
    var c = mk(w * RS, h * RS), g = c.getContext('2d'); g.scale(RS, RS);
    g.font = '900 ' + fs + 'px ' + FONT; g.textAlign = 'center'; g.textBaseline = 'middle';
    var cx = w / 2, cy = h / 2;
    g.fillStyle = 'rgba(8,12,40,0.55)'; g.fillText(ch, cx + 7, cy + 9);
    g.lineJoin = 'round'; g.lineWidth = 22; g.strokeStyle = '#14204a'; g.strokeText(ch, cx, cy);
    g.lineWidth = 9; g.strokeStyle = '#fff3cf'; g.strokeText(ch, cx, cy);
    var gr = g.createLinearGradient(0, cy - fs * 0.5, 0, cy + fs * 0.5);
    gr.addColorStop(0, '#fffbe6'); gr.addColorStop(0.42, '#ffd84a'); gr.addColorStop(0.58, '#ffae1f'); gr.addColorStop(1, '#e2620c');
    g.fillStyle = gr; g.fillText(ch, cx, cy);
    return { c: c, w: w, h: h, adv: adv };
  }
  /** 字幕：DQ 藍色對話窗 + 白字（逐字出現用 cx 字元邊界） */
  function makeSub(text) {
    var fs = 40, padX = 36, h = 80, m = mk(4, 4).getContext('2d'); m.font = 'bold ' + fs + 'px ' + FONT;
    var tw = Math.ceil(m.measureText(text).width), w = tw + padX * 2;
    var box = mk(w * RS, h * RS), g = box.getContext('2d'); g.scale(RS, RS);
    roundRect(g, 4, 4, w - 8, h - 8, 10);
    var gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(42,61,128,0.94)'); gr.addColorStop(1, 'rgba(29,43,94,0.94)');
    g.fillStyle = gr; g.fill(); g.lineWidth = 4; g.strokeStyle = '#f4f1e6'; g.stroke();
    roundRect(g, 9, 9, w - 18, h - 18, 7); g.lineWidth = 1.5; g.strokeStyle = 'rgba(10,16,48,0.8)'; g.stroke();
    var tc = mk(w * RS, h * RS), t = tc.getContext('2d'); t.scale(RS, RS);
    t.font = 'bold ' + fs + 'px ' + FONT; t.textBaseline = 'middle'; t.lineJoin = 'round';
    t.lineWidth = 6; t.strokeStyle = '#0d1530'; t.strokeText(text, padX, h / 2 + 2);
    t.fillStyle = '#fffdf5'; t.fillText(text, padX, h / 2 + 2);
    var n = Array.from ? Array.from(text).length : text.length, cx = new Float32Array(n + 1), chars = Array.from ? Array.from(text) : text.split(''), acc = '';
    cx[0] = padX - 4;
    for (var i = 0; i < n; i++) { acc += chars[i]; cx[i + 1] = padX + m.measureText(acc).width + 4; }
    cx[n] = w;
    return { box: box, text: tc, w: w, h: h, cx: cx, n: n };
  }

  // ====================================================================== 粒子參數池（固定上限，全部在初始化時建立）
  // 每一幀只「讀」這些陣列算位置，不新增任何物件。上限合計：星 70＋海面閃光 46＋風 40＋芒草絮 30＋光點 150＋煙 5×10＋標題光點 40 = 426
  function pool(n, fields, seed, fill) {
    var r = rng(seed), arr = new Float32Array(n * fields);
    for (var i = 0; i < n; i++) fill(arr, i * fields, r, i);
    return arr;
  }
  var N_STAR = 70, STAR = pool(N_STAR, 5, 11, function (a, o, r) { a[o] = 380 + r() * 900; a[o + 1] = r() * 210; a[o + 2] = r() < 0.18 ? 4 : 2; a[o + 3] = r() * 6.28; a[o + 4] = 1.5 + r() * 3; });
  var N_SPARK = 46, SPARK = pool(N_SPARK, 4, 12, function (a, o, r) { var v = r(); a[o + 1] = 314 + v * v * 170; a[o] = 1103 + (r() - 0.5) * (14 + (a[o + 1] - 310) * 0.75); a[o + 2] = r() * 6.28; a[o + 3] = 2 + r() * 4; });
  var N_WIND = 40, WIND = pool(N_WIND, 5, 13, function (a, o, r) { a[o] = 60 + r() * 520; a[o + 1] = 40 + r() * 120; a[o + 2] = 900 + r() * 700; a[o + 3] = r(); a[o + 4] = 0.12 + r() * 0.22; });
  var N_FLUFF = 30, FLUFF = pool(N_FLUFF, 6, 14, function (a, o, r) { a[o] = 120 + r() * 520; a[o + 1] = 0.12 + r() * 0.2; a[o + 2] = 8 + r() * 26; a[o + 3] = 1.5 + r() * 3; a[o + 4] = r(); a[o + 5] = r() < 0.3 ? 6 : 4; });
  var N_MOTE = 150, MOTE = pool(N_MOTE, 7, 15, function (a, o, r, i) {
    var big = i < 5;
    a[o] = big ? 33.3 + i * 0.28 : 33.6 + r() * 2.9;      // 出發時間
    a[o + 1] = big ? 2.5 : 1.3 + r() * 1.1;               // 飛行時間
    a[o + 2] = big ? 760 : 520 + r() * 520;               // 起始半徑
    a[o + 3] = big ? -2.6 + i * 0.55 : r() * 6.283;       // 起始角度
    a[o + 4] = (r() < 0.5 ? -1 : 1) * (1.2 + r() * 2.2);  // 繞圈量
    a[o + 5] = big ? i : (r() < 0.45 ? 5 : Math.floor(r() * 5));   // 顏色（5 = 金色）
    a[o + 6] = big ? 2 : (r() < 0.2 ? 1.3 : 0.75 + r() * 0.35);    // 大小
  });
  var N_SMOKE = 10, SMOKE = pool(5 * N_SMOKE, 3, 16, function (a, o, r) { a[o] = -Math.PI * (0.15 + r() * 0.7); a[o + 1] = 30 + r() * 70; a[o + 2] = r(); });
  var N_TMOTE = 40, TMOTE = pool(N_TMOTE, 4, 17, function (a, o, r) { a[o] = r() * 1280; a[o + 1] = 0.05 + r() * 0.08; a[o + 2] = r(); a[o + 3] = r() * 6.28; });

  // ====================================================================== 素材
  var I = {};          // 圖片
  var A = {};          // 程序產生的素材
  var SPR = window.SPRITES || {};
  function fw(id, d) { return (SPR[id] && SPR[id].frameW) || d; }
  function fh(id, d) { return (SPR[id] && SPR[id].frameH) || d; }
  var GIRL_W = fw('hero_novice', 33), GIRL_H = fh('hero_novice', 50);
  var BOY_W = fw('heroM_novice', 27), BOY_H = fh('heroM_novice', 50);
  var PET_W = fw('pet_imo', 29), PET_H = fh('pet_imo', 29);
  var FILES = {
    title: 'ui/title.png', town: 'battle/bb_town.png', grass: 'battle/bb_grass.png',
    girl: 'chars/hero_novice.png', boy: 'chars/heroM_novice.png', pet: 'chars/pet_imo.png', fog: 'monsters/boss_fog.png'
  };

  function buildAssets() {
    A.bank = [makeFogBank(640, 100, 101, 'left'), makeFogBank(640, 100, 102, 'left'), makeFogBank(640, 100, 103, 'left')];
    A.bankR = makeFogBank(640, 100, 104, 'right');
    A.strip = [makeFogStrip(320, 60, 105), makeFogStrip(320, 60, 106)];
    // 光暈貼圖大小 ≈ 畫出大小 ÷ 4：放大後抖色顆粒約 4 個邏輯像素，和 GPT 圖的像素顆粒一致
    A.glowSubj = SUBJ.map(function (s) { return makeGlow(72, s.rgb); });
    A.mote = SUBJ.map(function (s) { return makeGlow(10, s.rgb, 1.4); }).concat([makeGlow(10, GOLD, 1.4)]);
    A.glowGold = makeGlow(72, GOLD, 1.6);
    A.glowWarm = makeGlow(192, [255, 178, 96], 2.2);
    A.glowBig = makeGlow(192, GOLD, 2);
    A.rays = makeRays(192, [255, 238, 196]);
    A.lampOff = makeLamp(null);
    A.lampOn = SUBJ.map(function (s) { return makeLamp(s.rgb); });
    A.plaqueOff = SUBJ.map(function (s) { return makePlaque(s.name, null); });
    A.plaqueOn = SUBJ.map(function (s) { return makePlaque(s.name, s.rgb); });
    A.tuft = [makeTuft(201), makeTuft(202), makeTuft(203)];
    A.sun = pxArt([
      '.....XXXX.....', '...XXOOOOXX...', '..XOOOOOOOOX..', '.XOOOOOOOOOOX.', '.XOOOOOOOOOOX.', 'XOOOOOOOOOOOOX', 'XOOOOOOOOOOOOX',
      'XOOOOOOOOOOOOX', 'XOOOOOOOOOOOOX', '.XOOOOOOOOOOX.', '.XOOOOOOOOOOX.', '..XOOOOOOOOX..', '...XXOOOOXX...', '.....XXXX.....'
    ], { X: '#ffc768', O: '#fff4d2' });
    A.gull = [
      pxArt(['X.......X', '.XX...XX.', '...XXX...', '....X....'], { X: '#20213a' }),
      pxArt(['.........', 'XXX...XXX', '...XXX...', '....X....'], { X: '#20213a' })
    ];
    A.star4 = pxArt(['....X....', '....X....', '...XOX...', '..XOOOX..', 'XXOOWOOXX', '..XOOOX..', '...XOX...', '....X....', '....X....'],
      { X: '#ffe9a8', O: '#fff6d6', W: '#ffffff' });
    A.title = '勇者大冒險'.split('').map(function (ch) { return makeGlyph(ch, 128); });
    var gap = -6, total = 0;
    A.title.forEach(function (g) { total += g.adv + gap; });
    total -= gap;
    var x = W / 2 - total / 2;
    A.title.forEach(function (g) { g.x = x + g.adv / 2; x += g.adv + gap; });
    A.titleY = 168;
    // 標題合成圖（掃光用）
    var minX = A.title[0].x - A.title[0].w / 2, maxX = A.title[4].x + A.title[4].w / 2, th = A.title[0].h;
    A.tBox = { x: minX, y: A.titleY - th / 2, w: maxX - minX, h: th };
    A.tComp = mk(A.tBox.w * RS, th * RS);
    var tg = A.tComp.getContext('2d');
    A.title.forEach(function (g) { tg.drawImage(g.c, (g.x - g.w / 2 - minX) * RS, 0); });
    A.shine = mk(A.tBox.w * RS, th * RS);
    A.shineG = A.shine.getContext('2d');
    A.subs = SUBS.map(function (s) { return makeSub(s.text); });
  }
  /** 預熱：每張圖、每張預畫素材都先在主畫布上畫一次，讓瀏覽器先解碼、上傳到 GPU，避免播到一半第一次用到時卡一下 */
  function prewarm() {
    var list = [];
    Object.keys(I).forEach(function (key) { list.push(I[key]); });
    Object.keys(A).forEach(function (key) {
      var v = A[key];
      if (v && v.getContext) list.push(v);
      else if (Array.isArray(v)) v.forEach(function (x) { if (x && x.getContext) list.push(x); else if (x && x.c) list.push(x.c); else if (x && x.box) { list.push(x.box); list.push(x.text); } });
    });
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 0.02;
    list.forEach(function (img) { ctx.drawImage(img, 0, 0, 16, 16); });
    ['saturation', 'lighter'].forEach(function (op) { ctx.globalCompositeOperation = op; ctx.fillRect(0, 0, 4, 4); });
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    for (var i = 0; i < SCENES.length; i++) frame(SCENES[i].shot);   // 每個分鏡各畫一次
    return list.length;
  }

  // ====================================================================== 共用畫法
  function setAdd() { ctx.globalCompositeOperation = 'lighter'; }
  function setNormal() { ctx.globalCompositeOperation = 'source-over'; }
  function fill(color, a) { if (a <= 0.002) return; ctx.globalAlpha = a > 1 ? 1 : a; ctx.fillStyle = color; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
  function desat(a) { if (a <= 0.002) return; ctx.globalCompositeOperation = 'saturation'; fill('#808080', a); setNormal(); }
  function sprite(img, x, y, size, a) { if (a <= 0.002) return; ctx.globalAlpha = a > 1 ? 1 : a; ctx.drawImage(img, x - size / 2, y - size / 2, size, size); ctx.globalAlpha = 1; }
  function spriteWH(img, x, y, w, h, a) { if (a <= 0.002) return; ctx.globalAlpha = a > 1 ? 1 : a; ctx.drawImage(img, x - w / 2, y - h / 2, w, h); ctx.globalAlpha = 1; }
  function rotated(img, x, y, size, ang, a) {
    if (a <= 0.002) return;
    var c = Math.cos(ang), s = Math.sin(ang);
    ctx.setTransform(k * c, k * s, -k * s, k * c, k * x, k * y);
    ctx.globalAlpha = a > 1 ? 1 : a; ctx.drawImage(img, -size / 2, -size / 2, size, size); ctx.globalAlpha = 1;
    ctx.setTransform(k, 0, 0, k, 0, 0);
  }
  /** 從精靈圖切一格畫出來；x 是腳底中心、y 是腳底 */
  function frameAt(img, w, h, col, row, x, y, s) {
    ctx.drawImage(img, col * w, row * h, w, h, Math.round(x - w * s / 2), Math.round(y - h * s), w * s, h * s);
  }
  function drawSeaSparkles(t, camX, camY, sc, str) {
    if (str <= 0.01) return;
    setAdd(); ctx.fillStyle = '#fff8e2';
    for (var i = 0; i < N_SPARK; i++) {
      var o = i * 4, a = Math.sin(t * SPARK[o + 3] + SPARK[o + 2]);
      if (a <= 0) continue;
      a = a * a * a * a * str;
      if (a < 0.03) continue;
      var x = Math.round((SPARK[o] - camX) * sc), y = Math.round((SPARK[o + 1] - camY) * sc);
      if (x < -8 || x > W + 8 || y < -8 || y > H + 8) continue;
      ctx.globalAlpha = a; ctx.fillRect(x - 1, y - 1, 3, 3);
      if (a > 0.5) { ctx.fillRect(x - 6, y, 13, 1); ctx.fillRect(x, y - 4, 1, 9); }
    }
    ctx.globalAlpha = 1; setNormal();
  }
  function drawStrip(img, y, scale, scroll, a) {
    if (a <= 0.002) return;
    var tw = img.width * scale, th = img.height * scale, x0 = -fract(scroll / tw) * tw;
    ctx.globalAlpha = a > 1 ? 1 : a;
    for (var x = x0; x < W; x += tw) ctx.drawImage(img, Math.round(x), y, tw, th);
    ctx.globalAlpha = 1;
  }

  // ====================================================================== 分鏡 1＋2：北海岸日出 → 灰霧從海上湧來（title.png）
  var TS1 = 2.2, camX = 0, camY = 0;
  function coastCam(t) {
    // 先沿著天空往右平移（畫面下緣不超過 y=327，不會拍到標題圖裡的勇者），再往下搖到海面與日出
    var u1 = sstep(0, 4, t), u2 = sstep(3, 8.5, t);
    camX = Math.round(clamp(520 + 178 * u1, 0, 1280 - W / TS1));
    camY = Math.round(clamp(150 * u2 + (t > 8.5 ? (t - 8.5) * 3.5 : 0), 0, 720 - H / TS1));
  }
  function drawCoast(t) {
    coastCam(t);
    ctx.drawImage(I.title, camX, camY, W / TS1, H / TS1, 0, 0, W, H);
    var dawn = 1 - sstep(0.3, 7.2, t), fog = sstep(8, 14.6, t), clear = 1 - fog;
    fill('#0b1033', 0.8 * dawn);                       // 黎明前的藍
    // 星星
    if (dawn > 0.02) {
      ctx.fillStyle = '#fff8e0';
      for (var i = 0; i < N_STAR; i++) {
        var o = i * 5, x = Math.round((STAR[o] - camX) * TS1), y = Math.round((STAR[o + 1] - camY) * TS1);
        if (x < -4 || x > W || y < -4 || y > H) continue;
        var tw = 0.55 + 0.45 * Math.sin(t * STAR[o + 4] + STAR[o + 3]);
        ctx.globalAlpha = clamp(tw * dawn * 1.2, 0, 1); ctx.fillRect(x, y, STAR[o + 2], STAR[o + 2]);
      }
      ctx.globalAlpha = 1;
    }
    // 太陽從海平線升起
    var sunU = sstep(0.4, 6.5, t), sx = (1103 - camX) * TS1, sy = (lerp(324, 295, sunU) - camY) * TS1, hy = (311 - camY) * TS1;
    if (sx > -400 && sx < W + 400) {
      setAdd();
      sprite(A.glowWarm, sx, sy, 900, (0.25 + 0.45 * sunU) * clear);
      sprite(A.glowGold, sx, sy, 300, (0.4 + 0.5 * sunU) * clear);
      rotated(A.rays, sx, sy, 760, t * 0.05, 0.32 * sunU * clear);
      setNormal();
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, hy); ctx.clip();
      sprite(A.sun, Math.round(sx), Math.round(sy), 84, (0.55 + 0.45 * sunU) * (1 - 0.7 * fog));
      ctx.restore();
    }
    drawSeaSparkles(t, camX, camY, TS1, sunU * clear);
    // 海鷗
    for (var gI = 0; gI < 3; gI++) {
      var st = 1.6 + gI * 1.1, gx = -40 + (t - st) * (150 + gI * 25), gy = 190 + gI * 46 + Math.sin(t * 2 + gI) * 12;
      if (gx < -40 || gx > W + 40) continue;
      ctx.globalAlpha = 0.9 * clear;
      ctx.drawImage(A.gull[(Math.floor(t * 5 + gI * 1.7)) & 1], Math.round(gx), Math.round(gy), 27, 12);
      ctx.globalAlpha = 1;
    }
    // 遺忘霧
    if (fog > 0.002) {
      desat(0.85 * fog);
      fill('#a19eb6', 0.5 * fog);
      drawBank(A.bank[0], 1320 - (t - 8.3) * 260, 110, 3, 0.78);
      var ba = 0.42 * bump(10.2, 12.2, 13.6, 14.8, t);
      if (ba > 0.002) { ctx.globalAlpha = ba; ctx.drawImage(I.fog, Math.round(780 - (t - 10) * 14), Math.round(96 + Math.sin(t * 1.6) * 10), 531, 528); ctx.globalAlpha = 1; }
      drawBank(A.bank[1], 1320 - (t - 8.8) * 330, 250, 4, 0.86);
      drawBank(A.bank[2], 1320 - (t - 9.4) * 420, 400, 5, 0.95);
    }
    fill('#a9a6bd', sstep(13.6, 15, t));               // 霧把畫面整個蓋住 → 接分鏡 3
  }
  function drawBank(img, frontX, y, sc, a) {
    if (frontX >= W) return;
    ctx.globalAlpha = a; ctx.drawImage(img, Math.round(frontX), y, img.width * sc, img.height * sc); ctx.globalAlpha = 1;
  }

  // ====================================================================== 分鏡 3：五盞知識燈依序熄滅（bb_town.png）
  var TS3 = 2.25, LAMP_X = [200, 420, 640, 860, 1080], LAMP_BASE = 664, LAMP_OFF0 = 16.8, LAMP_GAP = 1.3;
  function lampLit(i, t) {
    var te = LAMP_OFF0 + LAMP_GAP * i;
    if (t >= te) return 0;
    if (t < te - 0.8) return 0.93 + 0.07 * Math.sin(t * 3.1 + i);
    // v0.9.5 審查：給兒童看的畫面不做快速閃爍（WCAG 2.3.1：每秒不超過 3 次）→ 熄滅前 0.8 秒平滑變暗，只帶每秒 2 次的微弱晃動
    var k = (t - (te - 0.8)) / 0.8;
    return Math.max(0, (1 - k) * (0.93 + 0.05 * Math.sin(t * 2 * Math.PI * 2 + i)));
  }
  function drawLamps(t) {
    var cx = 8 + 55 * sstep(15, 24, t);
    ctx.drawImage(I.town, cx, 22, W / TS3, H / TS3, 0, 0, W, H);
    desat(0.55);
    fill('#141a3a', 0.5);
    drawStrip(A.strip[0], 250, 4, t * 40 + cx * TS3 * 0.5, 0.42);
    var pan = (cx - 8) * TS3 * 1.3;   // 前景比背景移動快 → 視差
    // 地上的光
    setAdd();
    for (var i = 0; i < 5; i++) {
      var L = lampLit(i, t);
      if (L > 0) spriteWH(A.glowSubj[i], LAMP_X[i] - pan, LAMP_BASE - 6, 340, 80, 0.5 * L);
    }
    setNormal();
    for (i = 0; i < 5; i++) {
      var x = LAMP_X[i] - pan, top = LAMP_BASE - 304, hx = x, hyy = top + 46;
      L = lampLit(i, t);
      ctx.drawImage(A.lampOff, Math.round(x - 40), top, 80, 304);
      if (L > 0.002) { ctx.globalAlpha = L; ctx.drawImage(A.lampOn[i], Math.round(x - 40), top, 80, 304); ctx.globalAlpha = 1; }
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(A.plaqueOff[i], Math.round(x - 52), top + 128, 104, 48);
      if (L > 0.002) { ctx.globalAlpha = L; ctx.drawImage(A.plaqueOn[i], Math.round(x - 52), top + 128, 104, 48); ctx.globalAlpha = 1; }
      ctx.imageSmoothingEnabled = false;
      if (L > 0.002) { setAdd(); sprite(A.glowSubj[i], hx, hyy, 300 + 16 * Math.sin(t * 4 + i), 0.9 * L); setNormal(); }
      // 熄滅：冒煙＋光點飛走
      var te = LAMP_OFF0 + LAMP_GAP * i, tau = t - te;
      if (tau >= 0 && tau < 1.4) {
        ctx.fillStyle = '#cfcbe0';
        for (var s = 0; s < N_SMOKE; s++) {
          var o = (i * N_SMOKE + s) * 3, sp = SMOKE[o + 1], ang = SMOKE[o];
          var px = hx + Math.cos(ang) * sp * tau, py = hyy - 10 + Math.sin(ang) * sp * tau - 40 * tau * tau;
          var sz = Math.round((8 + 14 * tau) / 4) * 4;
          ctx.globalAlpha = 0.6 * (1 - tau / 1.4);
          ctx.fillRect(Math.round(px - sz / 2), Math.round(py - sz / 2), sz, sz);
        }
        ctx.globalAlpha = 1;
      }
      if (tau >= 0 && tau < 1.9) {
        var u = tau / 1.9, e = u * u;
        var p1x = hx - 40 + i * 20, p1y = hyy - 260, p2x = hx + 260 + i * 50, p2y = -90;
        var bx = (1 - e) * (1 - e) * hx + 2 * (1 - e) * e * p1x + e * e * p2x, by = (1 - e) * (1 - e) * hyy + 2 * (1 - e) * e * p1y + e * e * p2y;
        setAdd();
        sprite(A.glowSubj[i], bx, by, 150 * (1 - 0.4 * u), 0.8 * (1 - u * 0.5));
        sprite(A.mote[i], bx, by, 42, 1);
        setNormal();
      }
    }
    // 霧由左往右掃過
    var front = 200 + (t - LAMP_OFF0) * 169;
    var bw = A.bankR.width * 4;
    ctx.globalAlpha = 0.62; ctx.drawImage(A.bankR, Math.round(front + 60 - bw), 300, bw, 400); ctx.globalAlpha = 1;
    drawStrip(A.strip[1], 520, 5, -t * 30, 0.38);
    fill('#a9a6bd', 1 - sstep(15, 16.4, t));           // 從霧中淡入
    fill('#05060f', sstep(23.3, 24, t));                // 淡出到暗
  }

  // ====================================================================== 分鏡 4＋5：勇者登場、風吹圍巾 → 光點聚集（bb_grass.png）
  var TS4 = 2.25, WALK = [0, 1, 2, 1], WALK_END = 28.6, WALK_V = 200;
  var GIRL_ANCHOR = [9, 21, 10, 28, 10, 28], BOY_ANCHOR = [4, 22, 4, 22, 4, 22];
  var GIRL_BACK = [7, 25, 6, 27, 6, 25], BOY_BACK = [4, 26, 4, 27, 4, 25];
  var PET_HOPS = [29.3, 30.0, 35.9, 36.5];
  function windAt(t) { return clamp(0.45 + 0.5 * sstep(28.4, 29.4, t) + 0.12 * Math.sin(t * 1.7) - 0.35 * sstep(36.5, 38.5, t), 0, 1); }
  /** 圍巾尾巴：一串方塊粒子，位置是時間的波函數（不是物理模擬，所以能倒帶） */
  function drawScarf(ax, ay, main, shade, t, w, ph) {
    for (var strand = 0; strand < 2; strand++) {
      var n = strand ? 7 : 9, oy = strand ? 6 : 0, ph2 = ph + strand * 1.9;
      for (var i = n; i >= 1; i--) {
        var x = ax - i * 7 * (0.5 + 0.5 * w) + strand * 3;
        var y = ay + oy + i * 1.7 * (1.25 - w) + Math.sin(t * 11 - i * 0.8 + ph2) * (1 + i * 1.05) * (0.35 + 0.65 * w);
        var sz = i > n - 2 ? 6 : 8;
        x = Math.round(x / 2) * 2; y = Math.round(y / 2) * 2;
        ctx.fillStyle = main; ctx.fillRect(x - sz / 2, y - sz / 2, sz, sz);
        ctx.fillStyle = shade; ctx.fillRect(x - sz / 2, y + sz / 2 - 2, sz, 2);
      }
    }
  }
  function drawHero(img, fwid, fhei, col, row, x, y, anc, back, main, shade, t, w, ph) {
    var s = 4, dx = Math.round(x - fwid * s / 2), dy = Math.round(y - fhei * s);
    var a = row === 3 ? back : anc, ax = dx + a[col * 2] * s, ay = dy + a[col * 2 + 1] * s;
    if (row !== 3) drawScarf(ax, ay, main, shade, t, w, ph);
    ctx.drawImage(img, col * fwid, row * fhei, fwid, fhei, dx, dy, fwid * s, fhei * s);
    if (row === 3) drawScarf(ax, ay, main, shade, t, w, ph);
  }
  function drawField(t) {
    var cx = 4 + 60 * sstep(24, 29.2, t) + 6 * sstep(33, 39, t);
    ctx.drawImage(I.grass, cx, 40, W / TS4, H / TS4, 0, 0, W, H);
    var fog = 0.8 * (1 - sstep(34.6, 38.6, t)), w = windAt(t);
    desat(0.85 * fog);
    fill('#9d9ab4', 0.45 * fog);
    fill('#1b2040', 0.25 * fog);
    drawStrip(A.strip[0], 230, 4, t * 260 * w + cx * 2, 0.15 + 0.4 * fog);
    // 角色
    var walking = t < WALK_END, boyX = 720 - WALK_V * Math.max(0, WALK_END - t), feet = 600;
    var stepI = Math.floor((t - 24) * 7.5);
    var girlRow = t >= 33.4 ? 3 : 2, boyRow = t >= 33.65 ? 3 : 2;
    var gCol = walking ? WALK[(stepI + 2) & 3] : 1, bCol = walking ? WALK[stepI & 3] : 1, pCol = walking ? WALK[(stepI + 1) & 3] : 1;
    var hop = 0;
    for (var h = 0; h < PET_HOPS.length; h++) { var d = t - PET_HOPS[h]; if (d >= 0 && d < 0.38) hop = Math.sin(Math.PI * d / 0.38) * 28; }
    frameAt(I.pet, PET_W, PET_H, pCol, 2, boyX - 360, feet - Math.round(hop / 4) * 4, 4);
    drawHero(I.girl, GIRL_W, GIRL_H, gCol, girlRow, boyX - 190, feet, GIRL_ANCHOR, GIRL_BACK, '#f6c51e', '#c48f0c', t, w, 0);
    drawHero(I.boy, BOY_W, BOY_H, bCol, boyRow, boyX, feet, BOY_ANCHOR, BOY_BACK, '#3478e0', '#1e4ba3', t, w, 2.2);
    // 前景芒草（視差 1.6 倍，隨風彎）
    var pan = cx * TS4 * 1.6;
    for (var i = 0; i < 14; i++) {
      var tx = ((i * 110 - pan) % 1540 + 1540) % 1540 - 120, sk = -(0.06 + 0.16 * w) - 0.07 * Math.sin(t * 2.4 + i * 0.9) * (0.4 + w);
      ctx.setTransform(k * 4, 0, k * 4 * sk, k * 4, k * Math.round(tx), k * (744 + (i % 3) * 10));
      ctx.drawImage(A.tuft[i % 3], 0, -44);
    }
    ctx.setTransform(k, 0, 0, k, 0, 0);
    // 風：風絲＋芒草絮
    ctx.fillStyle = '#ffffff';
    var wv = 0.4 + 0.6 * w;
    for (i = 0; i < N_WIND; i++) {
      var o = i * 5, span = W + 400, x = W + 200 - fract(WIND[o + 3] + t * WIND[o + 2] / span) * span;
      ctx.globalAlpha = WIND[o + 4] * wv; ctx.fillRect(Math.round(x), WIND[o], Math.round(WIND[o + 1] * wv), 2);
    }
    ctx.fillStyle = '#f3eedf';
    for (i = 0; i < N_FLUFF; i++) {
      o = i * 6;
      var fx = W + 40 - fract(FLUFF[o + 4] + t * FLUFF[o + 1] * (0.5 + w)) * (W + 80), fy = FLUFF[o] + Math.sin(t * FLUFF[o + 3] + i) * FLUFF[o + 2], sz = FLUFF[o + 5];
      ctx.globalAlpha = 0.8; ctx.fillRect(Math.round(fx), Math.round(fy), sz, sz / 2); ctx.fillRect(Math.round(fx + sz / 4), Math.round(fy - sz / 4), sz / 2, sz);
    }
    ctx.globalAlpha = 1;
    if (t >= 33) drawGather(t);
    fill('#05060f', 1 - sstep(24, 24.8, t));
    fill('#ffffff', sstep(38.2, 39, t));               // 閃白 → 標題
  }
  var GX = 600, GY = 250;
  function moteXY(i, u) {   // 光點螺旋飛向聚集點：回傳寫進 MXY（不產生物件）
    var o = i * 7, r = MOTE[o + 2] * Math.pow(1 - u, 1.45), ang = MOTE[o + 3] + MOTE[o + 4] * Math.pow(1 - u, 1.2);
    MXY[0] = GX + Math.cos(ang) * r * 1.3; MXY[1] = GY + Math.sin(ang) * r * 0.75;
  }
  var MXY = new Float32Array(2);
  function drawGather(t) {
    var got = sstep(33.8, 38, t), on = sstep(33.3, 34.4, t);
    setAdd();
    sprite(A.glowWarm, GX, GY, 700 + 500 * got, 0.25 * on + 0.35 * got);
    rotated(A.rays, GX, GY, 520 + 520 * got, t * 0.5, 0.55 * sstep(35.5, 38, t));
    sprite(A.glowGold, GX, GY, 130 + 300 * got + 14 * Math.sin(t * 7), 0.6 * on + 0.4 * got);
    for (var i = 0; i < N_MOTE; i++) {
      var o = i * 7, u = (t - MOTE[o]) / MOTE[o + 1];
      if (u <= 0 || u >= 1) continue;
      var img = A.mote[MOTE[o + 5]], sz = 30 * MOTE[o + 6] * (0.65 + 0.35 * (1 - u));
      for (var j = 2; j >= 0; j--) {
        var uj = u - j * 0.035;
        if (uj <= 0) continue;
        moteXY(i, uj);
        sprite(img, Math.round(MXY[0]), Math.round(MXY[1]), sz * (1 - j * 0.25), j ? 0.5 - j * 0.15 : 1);
      }
      if (i < 5) { moteXY(i, u); sprite(A.glowSubj[i], MXY[0], MXY[1], 150, 0.7); }
    }
    setNormal();
  }

  // ====================================================================== 分鏡 6：標題浮現（title.png 全圖）
  function drawTitle(t) {
    ctx.drawImage(I.title, 0, 0, 1280, 720, 0, 0, W, H);
    setAdd();
    sprite(A.glowWarm, 1103, 295, 640 + 30 * Math.sin(t * 1.3), 0.35);
    sprite(A.glowGold, 1103, 295, 190, 0.5);
    rotated(A.rays, 1103, 295, 640, t * 0.05, 0.22);
    setNormal();
    drawSeaSparkles(t, 0, 0, 1, 0.9);
    // 上升的光點
    setAdd();
    for (var i = 0; i < N_TMOTE; i++) {
      var o = i * 4, y = 740 - fract(TMOTE[o + 2] + (t - 39) * TMOTE[o + 1]) * 800, x = TMOTE[o] + Math.sin(t * 1.3 + TMOTE[o + 3]) * 18;
      sprite(A.mote[5], Math.round(x), Math.round(y), 22, 0.55 + 0.35 * Math.sin(t * 3 + TMOTE[o + 3]));
    }
    // 標題後方光暈
    sprite(A.glowBig, W / 2, A.titleY, 900, 0.22 * sstep(40.6, 42, t));
    setNormal();
    // 標題字逐字浮現
    ctx.imageSmoothingEnabled = true;
    for (i = 0; i < A.title.length; i++) {
      var g = A.title[i], u = clamp((t - (39.9 + i * 0.17)) / 0.6, 0, 1);
      if (u <= 0) continue;
      var sc = 0.55 + 0.45 * easeOutBack(u), yy = A.titleY + (1 - easeOutBack(u)) * 46;
      ctx.globalAlpha = clamp(u * 2.5, 0, 1);
      ctx.setTransform(k * sc, 0, 0, k * sc, k * g.x, k * yy);
      ctx.drawImage(g.c, -g.w / 2, -g.h / 2, g.w, g.h);
    }
    ctx.setTransform(k, 0, 0, k, 0, 0); ctx.globalAlpha = 1;
    // 掃光（每次都從頭畫，仍是 t 的純函數）
    var su = (t - 42.0) / 0.9;
    if (su > 0 && su < 1) {
      var sg = A.shineG, bw = A.shine.width, bh = A.shine.height, bx = lerp(-0.25, 1.25, su) * bw;
      sg.globalCompositeOperation = 'source-over'; sg.clearRect(0, 0, bw, bh); sg.drawImage(A.tComp, 0, 0);
      sg.globalCompositeOperation = 'source-in'; sg.fillStyle = '#fffbe8';
      sg.beginPath(); sg.moveTo(bx, 0); sg.lineTo(bx + 70 * RS, 0); sg.lineTo(bx + 10 * RS, bh); sg.lineTo(bx - 60 * RS, bh); sg.closePath(); sg.fill();
      setAdd(); ctx.globalAlpha = 0.85; ctx.drawImage(A.shine, A.tBox.x, A.tBox.y, A.tBox.w, A.tBox.h); ctx.globalAlpha = 1; setNormal();
    }
    ctx.imageSmoothingEnabled = false;
    // 閃爍星芒
    var gl = sstep(42.4, 43, t);
    if (gl > 0) {
      setAdd();
      for (i = 0; i < 4; i++) {
        var gx = A.tBox.x + 40 + i * (A.tBox.w - 80) / 3, gy = A.tBox.y + (i & 1 ? A.tBox.h - 52 : 44);
        var tw = Math.sin(t * 4 + i * 1.7);
        if (tw > 0) sprite(A.star4, Math.round(gx), Math.round(gy), 18 + 9 * Math.round(tw * 2), gl * tw);
      }
      setNormal();
    }
    fill('#ffffff', 1 - sstep(39, 40.4, t));
  }

  // ====================================================================== 字幕（DQ 對話窗，逐字出現）
  function drawSubs(t) {
    ctx.imageSmoothingEnabled = true;
    for (var i = 0; i < SUBS.length; i++) {
      var s = SUBS[i];
      if (t < s.t0 || t > s.t1 + 0.4) continue;
      var a = Math.min(sstep(s.t0, s.t0 + 0.25, t), 1 - sstep(s.t1, s.t1 + 0.35, t));
      if (a <= 0.002) continue;
      var sb = A.subs[i], x = Math.round(W / 2 - sb.w / 2), y = Math.round(616 + (1 - sstep(s.t0, s.t0 + 0.3, t)) * 14);
      ctx.globalAlpha = a; ctx.drawImage(sb.box, x, y, sb.w, sb.h);
      var nShown = clamp(Math.floor((t - s.t0 - 0.15) * 14), 0, sb.n), rw = sb.cx[nShown];
      if (rw > 0) ctx.drawImage(sb.text, 0, 0, rw * RS, sb.h * RS, x, y, rw, sb.h);
    }
    ctx.globalAlpha = 1;
    ctx.imageSmoothingEnabled = false;
  }

  // ====================================================================== frame(t)：整支片頭的唯一入口
  var ready = false;   // 這次播放的畫布與素材都準備好了
  function frame(t) {
    t = clamp(+t || 0, 0, DUR);
    ctx.setTransform(k, 0, 0, k, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.globalAlpha = 1; setNormal();
    if (!ready) { ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); return; }
    if (t < 15) drawCoast(t);
    else if (t < 24) drawLamps(t);
    else if (t < 39) drawField(t);
    else drawTitle(t);
    drawSubs(t);
    fill('#000000', 1 - sstep(0, 1.4, t));             // 開頭從黑淡入
  }

  // ====================================================================== 播放控制（遊戲版）
  var assetsBuilt = false, loading = null;
  /** 讀圖（只讀一次）。回傳 Promise<boolean>：全部讀到才是 true */
  function loadImages() {
    if (loading) return loading;
    loading = new Promise(function (resolve) {
      var keys = Object.keys(FILES), left = keys.length, failed = [];
      keys.forEach(function (key) {
        var url = J.Assets && J.Assets.resolveUrl ? J.Assets.resolveUrl('assets/' + FILES[key]) : 'assets/' + FILES[key];
        if (!url) { failed.push(FILES[key]); if (--left === 0) resolve(false); return; }
        var img = new Image();
        img.onload = function () { I[key] = img; if (--left === 0) resolve(!failed.length); };
        img.onerror = function () { failed.push(FILES[key]); if (--left === 0) resolve(!failed.length); };
        img.src = url;
      });
    }).then(function (ok) {
      if (!ok) { loading = null; return false; }   // 下次再試
      if (!assetsBuilt) { buildAssets(); assetsBuilt = true; }
      return true;
    });
    return loading;
  }

  function storage() { try { return window.localStorage; } catch (e) { return null; } }
  /** 看過片頭了沒（播完或按跳過都算看過） */
  function seen() { var s = storage(); try { return !!(s && s.getItem(SEEN_KEY)); } catch (e) { return false; } }
  function markSeen() { var s = storage(); try { if (s) s.setItem(SEEN_KEY, '1'); } catch (e) { /* 無痕模式存不了：下次還會播，可以跳過 */ } }
  /** 第一次（沒看過）才自動播 */
  function shouldPlay() { return !seen(); }

  var cur = null;   // 這次播放 { overlay, handle, raf, t0, paused, pausedAt, done, onDone }
  var stats = { plays: 0, skips: 0, ends: 0, failed: 0, lastT: 0 };   // 測試用

  function layout() {
    if (!cur || !cv) return;
    var w = Math.floor(Math.min(window.innerWidth, window.innerHeight * 16 / 9)), h = Math.floor(w * 9 / 16);
    cur.stage.style.width = w + 'px'; cur.stage.style.height = h + 'px';
    var dev = w * (window.devicePixelRatio || 1), kk = dev > 1500 ? 1.5 : 1;   // 上限 1.5：保護平板效能
    if (kk !== k || cv.width !== Math.round(W * kk)) { k = kk; cv.width = Math.round(W * k); cv.height = Math.round(H * k); }
    if (ready) frame(curT());
  }
  function curT() {
    if (!cur || !ready) return 0;   // v0.9.6（47 號 B15）圖還沒讀完（還沒開始播）時是 0 秒，不是 45
    var now = cur.paused ? cur.pausedAt : performance.now();
    return Math.min(DUR, Math.max(0, (now - cur.t0) / 1000));
  }
  function loop() {
    if (!cur) return;
    cur.raf = 0;
    if (cur.paused) return;
    var t = curT();
    stats.lastT = t;
    frame(t);
    if (t >= DUR) { finish('end'); return; }
    cur.raf = requestAnimationFrame(loop);
  }
  function onVisibility() {
    if (!cur) return;
    if (document.visibilityState === 'hidden' && !cur.paused) { cur.paused = true; cur.pausedAt = performance.now(); }
    else if (document.visibilityState === 'visible' && cur.paused) { cur.t0 += performance.now() - cur.pausedAt; cur.paused = false; if (!cur.raf) cur.raf = requestAnimationFrame(loop); }
  }
  /** 結束（播完或跳過）：拿掉畫面，記下看過了，接著做 onDone（進選單） */
  function finish(how) {
    if (!cur || cur.done) return;
    var c = cur; c.done = true;
    if (c.raf) cancelAnimationFrame(c.raf);
    cur = null; ready = false;
    window.removeEventListener('resize', layout);
    window.removeEventListener('orientationchange', layout);
    document.removeEventListener('visibilitychange', onVisibility);
    if (how === 'skip') stats.skips++; else if (how === 'end') stats.ends++;
    if (how !== 'fail') markSeen();
    c.handle.close(true);
    cv = null; ctx = null;
    if (c.onDone) { try { c.onDone(how); } catch (e) { console.error(e); } }
  }
  function skip() { finish('skip'); }

  /**
   * 播放片頭。opts = { onDone(how)：結束後（'end' 播完／'skip' 跳過／'fail' 圖讀不到），music：要不要從頭播標題序曲 }
   * 回傳 true＝開始播（圖還在讀時先顯示「載入中」）；已經在播就回傳 false
   */
  function play(opts) {
    opts = opts || {};
    if (cur) return false;
    var h = J.UI.h;
    cv = h('canvas.opening-canvas', { width: String(W), height: String(H), 'aria-hidden': 'true' });
    ctx = cv.getContext('2d', { alpha: false });
    k = 1;
    var skipBtn = h('button.opening-skip', { type: 'button', 'aria-label': '跳過片頭', onclick: function (e) { e.stopPropagation(); skip(); } }, ['跳過 ▸▸']);
    var loadEl = h('div.opening-loading', { text: '片頭載入中……' });
    var stage = h('div.opening-stage', {}, [cv, loadEl, skipBtn]);
    // v0.9.6（47 號 B09）焦點放在片頭畫面本身（不是「跳過」）：小朋友按空白鍵、Enter 不會一下子就跳過；要跳過請點按鈕或按 Esc（Tab 也能移到按鈕）
    var overlay = h('div.opening', { role: 'dialog', 'aria-label': '片頭動畫（右下角可以跳過）', tabindex: '-1' }, [stage]);
    // 放進視窗堆疊（擋住走路、Esc 會關掉＝跳過）；不是 modal 遮罩，畫面自己蓋滿全螢幕
    var handle = J.UI.open(overlay, { modal: false, label: '片頭動畫', focus: overlay, onClose: function () { if (cur && cur.overlay === overlay) skip(); } });
    cur = { overlay: overlay, stage: stage, handle: handle, raf: 0, t0: 0, paused: false, pausedAt: 0, done: false, onDone: opts.onDone || null, music: !!opts.music };
    stats.plays++;
    var me = cur;
    window.addEventListener('resize', layout);
    window.addEventListener('orientationchange', layout);
    document.addEventListener('visibilitychange', onVisibility);
    layout();
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, cv.width, cv.height);
    loadImages().then(function (ok) {
      if (cur !== me || me.done) return;   // 讀圖的時候已經按了跳過
      if (!ok) { stats.failed++; finish('fail'); return; }
      ready = true;
      loadEl.hidden = true;
      prewarm();
      layout();
      if (me.music) {
        try { var M = J.Music; if (M && M.playBgm) { M.stopBgm(0); M.playBgm('title'); } } catch (e) { /* 沒有聲音也照常播放畫面 */ }
      }
      me.t0 = performance.now();
      if (document.visibilityState === 'hidden') { me.paused = true; me.pausedAt = me.t0; }
      me.raf = requestAnimationFrame(loop);
    });
    return true;
  }

  J.Opening = {
    DUR: DUR, SCENES: SCENES, SUBS: SUBS, SEEN_KEY: SEEN_KEY, PARTICLE_CAP: N_STAR + N_SPARK + N_WIND + N_FLUFF + N_MOTE + 5 * N_SMOKE + N_TMOTE,
    play: play, skip: skip, seen: seen, shouldPlay: shouldPlay, markSeen: markSeen,
    isPlaying: function () { return !!cur; }, time: curT, stats: stats
  };
})();
