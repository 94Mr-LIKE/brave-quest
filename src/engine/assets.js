/*
 * 素材載入與佔位圖
 * - sprite key 的檔案位置以 window.SPRITES（data/sprites.js，CTO 維護）為準；
 *   還沒有 sprites.js 時用 data/dev_sprites.js（tools/pack_assets.py 掃描資料夾產生）。
 * - 任何 sprite key 找不到或載入失敗 → 自動畫「色塊＋文字」佔位圖，不會當掉。
 * - 雙擊 index.html（file://）時，瀏覽器不允許把本機圖片交給 WebGL，
 *   所以改用 assets/packed_assets.js 裡的 data URI；沒有打包的圖就用佔位圖。
 */
(function () {
  'use strict';
  var FILE_MODE = location.protocol === 'file:';
  var failed = {};       // 載入失敗的 key
  var requested = {};    // scene 載入時要處理的 key → {kind, label}

  /** tools/pack_assets.py 產生的美術清單（data/art_manifest.js）：有哪些地圖背景、戰鬥背景、介面圖 */
  function art() { return window.ART || { maps: {}, battle: {}, ui: {} }; }

  function packed(path) { return (window.JQ_PACKED && window.JQ_PACKED[path]) || null; }

  /** 把 docs/ 底下的相對路徑轉成可以載入的網址；不能載入時回傳 null */
  function resolveUrl(path) {
    if (!path) return null;
    if (/^data:/.test(path)) return path;
    path = path.replace(/^\.\//, '').replace(/^docs\//, '');
    if (FILE_MODE) return packed(path);
    return path;
  }

  function folderFor(key) {
    if (/^(hero|heroM|pet)_/.test(key)) return 'assets/chars/';
    if (/^npc_/.test(key)) return 'assets/npcs/';
    if (/^(mon|boss)_/.test(key)) return 'assets/monsters/';
    if (/^item_/.test(key)) return 'assets/items/';
    return 'assets/';
  }

  function kindFor(key) {
    if (/^(hero|heroM|pet)_/.test(key)) return 'walk';
    if (/^item_/.test(key)) return 'icon';
    return 'single';
  }

  /** {file, type, frameW, frameH}；不在清單裡回傳 null */
  function info(key) {
    var S = window.SPRITES || {};
    var e = S[key];
    if (!e) return null;
    var file = e.file || e.path || e.src || '';
    if (file && file.indexOf('/') < 0) file = folderFor(key) + file;
    // rows 可以是列數，或依序的方向名稱陣列（例：["down","left","right","up"]）
    var order = Array.isArray(e.rows) ? e.rows : ['down', 'left', 'right', 'up'];
    var rows = Array.isArray(e.rows) ? e.rows.length : (e.rows || 4);
    return { file: file, type: e.type || kindFor(key), frameW: e.frameW || e.frame_w || e.fw || 0, frameH: e.frameH || e.frame_h || e.fh || 0,
      cols: e.cols || 3, rows: rows, order: order, mapH: e.mapH || 0 };
  }

  /** 走路圖裡某個方向在第幾列（依 sprites.js 的 rows 順序；預設 下、左、右、上） */
  function dirRow(key, dir) {
    var inf = info(key);
    var order = (inf && inf.order) || ['down', 'left', 'right', 'up'];
    var i = order.indexOf(dir);
    return i >= 0 ? i : ({ down: 0, left: 1, right: 2, up: 3 })[dir] || 0;
  }

  function has(key) { return !!info(key) && !failed[key]; }

  /** 主角圖：女生 hero_<職業>、男生 heroM_<職業>；缺圖時 → 女生同職業 → 見習冒險者 → 佔位圖 */
  function heroKey(gender, job) {
    job = job || 'novice';
    var chain = gender === 'm' ? ['heroM_' + job, 'hero_' + job, 'heroM_novice', 'hero_novice'] : ['hero_' + job, 'hero_novice'];
    for (var i = 0; i < chain.length; i++) if (has(chain[i])) return chain[i];
    return chain[0];
  }

  function texKey(key) { return 'spr:' + key; }

  /** 在 scene.preload 裡呼叫：把需要的 sprite 加進載入佇列。label = 佔位圖上要寫的字 */
  function queue(scene, key, label) {
    if (!key) return;
    requested[key] = { kind: (info(key) || {}).type || kindFor(key), label: label || '' };
    if (scene.textures.exists(texKey(key)) || failed[key]) return;
    var inf = info(key);
    var url = inf ? resolveUrl(inf.file) : null;
    if (!url) return;
    scene.load.image(texKey(key), url);
  }

  function queueTileset(scene, set) {
    var k = 'tiles:' + set;
    if (scene.textures.exists(k)) return;
    var url = resolveUrl('assets/tiles/tiles_' + set + '.png');
    if (url) scene.load.spritesheet(k, url, { frameWidth: 16, frameHeight: 16 });
  }

  /** 地圖背景／前景圖（maps.js 的 bg、fg 欄位；只寫檔名時放在 assets/maps/） */
  function mapImagePath(file) { return file.indexOf('/') >= 0 ? file : 'assets/maps/' + file; }
  function queueMapImage(scene, file) {
    var k = 'map:' + file;
    if (scene.textures.exists(k)) return;
    var url = resolveUrl(mapImagePath(file));
    if (url) scene.load.image(k, url);
    else if ((window.JQ_PACKED_SKIPPED || []).indexOf(mapImagePath(file)) >= 0) console.info('[素材] 大地圖背景沒有打包進 file:// 模式，改用格子備援圖塊：' + file);
    else console.warn('[素材] 找不到地圖圖檔（file:// 需要先執行 tools/pack_assets.py）：' + file);
  }

  function queueBattleBg(scene, name) {
    var k = 'bg:' + name;
    if (scene.textures.exists(k)) return;
    // GPT 畫的戰鬥背景 assets/battle/bb_<地形>.png；清單裡沒有就不載入（戰鬥畫面用純色底，不會當掉）
    var gpt = art().battle[name];
    if (!gpt) return;
    var url = resolveUrl('assets/battle/' + gpt);
    if (url) scene.load.image(k, url);
  }

  /** 註冊載入失敗的處理（scene.preload 開頭呼叫一次） */
  function watch(scene) {
    scene.load.on('loaderror', function (file) {
      var k = String(file.key || '');
      if (k.indexOf('spr:') === 0) failed[k.slice(4)] = true;
      if (k.indexOf('map:') === 0) failed[k] = true;
      if (window.console) console.warn('[素材] 載入失敗，改用佔位圖：' + (file.src || file.key));
    });
  }

  function hashColor(key) {
    var h = 0;
    for (var i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
    var hue = h % 360;
    return 'hsl(' + hue + ',55%,55%)';
  }

  function placeholderCanvas(key, kind, label) {
    var c = document.createElement('canvas');
    var g = c.getContext('2d');
    var color = hashColor(key);
    var text = (label || key.replace(/^(mon|boss|npc|item|hero|heroM|pet)_/, '')).slice(0, 4);
    function block(x, y, w, h, arrow) {
      g.fillStyle = '#2a1e22'; g.fillRect(x, y, w, h);
      g.fillStyle = color; g.fillRect(x + 1, y + 1, w - 2, h - 2);
      g.fillStyle = '#ffffff';
      g.font = 'bold ' + Math.max(8, Math.floor(Math.min(w, h) / 3)) + 'px sans-serif';
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(text.slice(0, w < 30 ? 2 : 4), x + w / 2, y + h / 2);
      if (arrow) {
        g.fillStyle = '#2a1e22';
        var cx = x + w / 2, cy = y + h - 6;
        g.beginPath();
        if (arrow === 'down') { g.moveTo(cx - 4, cy - 3); g.lineTo(cx + 4, cy - 3); g.lineTo(cx, cy + 2); }
        if (arrow === 'up') { g.moveTo(cx - 4, cy + 2); g.lineTo(cx + 4, cy + 2); g.lineTo(cx, cy - 3); }
        if (arrow === 'left') { g.moveTo(cx + 3, cy - 4); g.lineTo(cx + 3, cy + 4); g.lineTo(cx - 3, cy); }
        if (arrow === 'right') { g.moveTo(cx - 3, cy - 4); g.lineTo(cx - 3, cy + 4); g.lineTo(cx + 3, cy); }
        g.fill();
      }
    }
    if (kind === 'walk') {
      var fw = 24, fh = 36;
      c.width = fw * 3; c.height = fh * 4;
      ['down', 'left', 'right', 'up'].forEach(function (dir, r) {
        for (var col = 0; col < 3; col++) block(col * fw + 2, r * fh + 4 + (col === 1 ? 0 : 1), fw - 4, fh - 6, dir);
      });
      return { canvas: c, fw: fw, fh: fh };
    }
    if (kind === 'icon') { c.width = 16; c.height = 16; block(0, 0, 16, 16); return { canvas: c, fw: 16, fh: 16 }; }
    var big = /^boss_/.test(key), mon = /^(mon|boss)_/.test(key);
    var w = big ? 112 : (mon ? 64 : 24), h = big ? 112 : (mon ? 64 : 36);
    c.width = w; c.height = h;
    if (mon) {
      g.fillStyle = '#2a1e22'; g.beginPath(); g.ellipse(w / 2, h / 2 + 4, w / 2 - 2, h / 2 - 6, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = color; g.beginPath(); g.ellipse(w / 2, h / 2 + 4, w / 2 - 4, h / 2 - 8, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#fff'; g.font = 'bold ' + Math.floor(w / 5) + 'px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(text, w / 2, h / 2 + 4);
    } else block(0, 0, w, h);
    return { canvas: c, fw: w, fh: h };
  }

  /** 在 scene.create 開頭呼叫：替已載入的走路圖切格；沒載入成功的做佔位圖 */
  function finalize(scene) {
    Object.keys(requested).forEach(function (key) {
      var r = requested[key], tk = texKey(key);
      var tex;
      if (!scene.textures.exists(tk)) {
        var ph = placeholderCanvas(key, r.kind, r.label);
        tex = scene.textures.addCanvas(tk, ph.canvas);
        if (r.kind === 'walk') addWalkFrames(tex, ph.fw, ph.fh, 3, 4);
        tex.__placeholder = true;
        return;
      }
      tex = scene.textures.get(tk);
      if (r.kind === 'walk' && !tex.__framed) {
        var src = tex.getSourceImage();
        var inf = info(key) || {};
        var cols = inf.cols || 3, rows = inf.rows || 4;
        var fw = inf.frameW || Math.floor(src.width / cols), fh = inf.frameH || Math.floor(src.height / rows);
        addWalkFrames(tex, fw, fh, cols, rows);
      }
    });
  }

  function addWalkFrames(tex, fw, fh, cols, rows) {
    for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) tex.add(r * cols + c, 0, c * fw, r * fh, fw, fh);
    tex.__framed = true; tex.__fw = fw; tex.__fh = fh;
  }

  function isPlaceholder(scene, key) { var t = scene.textures.get(texKey(key)); return !!(t && t.__placeholder); }

  /** DOM 用的小圖（頭像、道具圖示）：回傳 HTML 字串 */
  function domIcon(key, opts) {
    opts = opts || {};
    var inf = info(key);
    var url = inf && !failed[key] ? resolveUrl(inf.file) : null;
    var size = opts.size || 40;
    var alt = opts.alt || '';
    if (!url) {
      return '<span class="ph" style="display:inline-flex;align-items:center;justify-content:center;width:' + size + 'px;height:' + size +
        'px;background:' + hashColor(key) + ';border-radius:6px;font-size:' + Math.floor(size / 2.2) + 'px;color:#fff" aria-hidden="true">' +
        esc((opts.label || '?').slice(0, 1)) + '</span>';
    }
    if (inf.type === 'walk') {
      // 走路圖只顯示「面向下、站著」那一格（第 0 列第 1 格）
      var fw = inf.frameW || 24, fh = inf.frameH || 36;
      var scale = size / fh;
      return '<span role="img" aria-label="' + esc(alt) + '" style="display:inline-block;width:' + Math.round(fw * scale) + 'px;height:' + size +
        'px;background:url(\'' + url + '\') no-repeat;background-size:' + Math.round(fw * 3 * scale) + 'px ' + Math.round(fh * 4 * scale) +
        'px;background-position:-' + Math.round(fw * scale) + 'px 0;image-rendering:pixelated"></span>';
    }
    return '<img src="' + url + '" alt="' + esc(alt) + '" style="height:' + size + 'px;image-rendering:pixelated">';
  }

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /** file:// 時先載入打包的圖檔（非同步），回傳 Promise */
  function preparePack() {
    if (!FILE_MODE || window.JQ_PACKED) return Promise.resolve();
    return new Promise(function (resolve) {
      var s = document.createElement('script');
      s.src = 'assets/packed_assets.js';
      s.onload = function () { resolve(); };
      s.onerror = function () { resolve(); };
      document.head.appendChild(s);
    });
  }

  window.JQ = window.JQ || {};
  window.JQ.Assets = {
    FILE_MODE: FILE_MODE, resolveUrl: resolveUrl, info: info, has: has, heroKey: heroKey, texKey: texKey,
    dirRow: dirRow, art: art, queue: queue, queueTileset: queueTileset, queueBattleBg: queueBattleBg, queueMapImage: queueMapImage, mapImagePath: mapImagePath, watch: watch, finalize: finalize,
    isPlaceholder: isPlaceholder, domIcon: domIcon, esc: esc, preparePack: preparePack, failed: failed
  };
})();
