/*
 * 壓縮存檔碼與「#load=」存檔連結（給 QR Code 用）
 *
 * v0.9 精簡壓縮碼（QR 用）："JQY-<base64url>-<8 碼校驗>"
 *   先「瘦身」再壓縮，等級 3 的存檔連結約 900 字元（以前 JQZ 約 2200～3000 字元，QR 太密掃不出來）：
 *   - 和新遊戲預設值一樣的欄位不放（讀回時補預設值）；出題紀錄 qhist、recentQ 不放（可以重新累積）
 *   - mapDims 只放存檔位置用到的地圖
 *   - 答對過的題目、學習單元統計、適性難度：用「題庫字典」的編號（題目 ID、科目|單元 排序後的序號）代替長長的文字，
 *     並記下字典的指紋（_d）；讀檔時題庫不同版（指紋不符）就略過這些編號，只保留一般進度，不會讀錯
 *   - JSON → UTF-8 → deflate-raw → base64url
 * 舊的 "JQZ-…"（整份存檔壓縮）與文字存檔碼 "JQ1-…" 一樣讀得回來。
 * 壓縮碼格式："JQZ-<base64url>-<8 碼校驗>"
 *   JSON → UTF-8 → deflate-raw（瀏覽器內建 CompressionStream，不用外部套件）→ base64url
 *   校驗碼 = FNV-1a 32bit(base64url 字串)
 *   瀏覽器不支援 CompressionStream 時，改用原本的文字存檔碼 "JQ1-…"（較長，但一樣能用）。
 * 存檔連結：<遊戲網址>#load=<存檔碼>
 *   存檔資料放在網址的 # 後面：瀏覽器不會把 # 後面的內容送給伺服器（GitHub Pages 看不到存檔）。
 * 讀取一律先驗證（格式、校驗碼、長度、存檔結構），失敗不會覆蓋原本的存檔。
 */
(function () {
  'use strict';
  var isNode = typeof module !== 'undefined' && typeof require === 'function';
  var Save = isNode ? require('./save.js') : window.JQ.Save;

  var Z_PREFIX = 'JQZ', Y_PREFIX = 'JQY';
  var State = isNode ? require('./state.js') : window.JQ.State;

  // ---------------------------------------------------------------- 瘦身（v0.9）
  var dictCache = null;
  /** 題庫字典：題目 ID 與「科目|單元」各自排序後的序號，加上指紋 */
  function dictFrom(questions) {
    var qs = questions || (typeof window !== 'undefined' && window.QUESTIONS) || [];
    var sig = qs.length + ':' + (qs[0] && qs[0].id) + ':' + (qs[qs.length - 1] && qs[qs.length - 1].id);
    if (dictCache && dictCache.sig === sig) return dictCache;
    var ids = [], units = {}, seen = {};
    qs.forEach(function (q) { if (q && q.id && !seen[q.id]) { seen[q.id] = 1; ids.push(String(q.id)); } if (q && q.subject) units[q.subject + '|' + q.unit] = 1; });
    ids.sort(); var ul = Object.keys(units).sort();
    var qi = {}, ui = {};
    ids.forEach(function (k, i) { qi[k] = i; });
    ul.forEach(function (k, i) { ui[k] = i; });
    dictCache = { sig: sig, ids: ids, units: ul, qi: qi, ui: ui, hash: ids.length ? Save.fnv1a(ids.join(',') + '#' + ul.join(',')) : '' };
    return dictCache;
  }

  // 常見的長鍵名換成「~＋短碼」（真正的鍵名不會以 ~ 開頭，所以不會撞名）
  var SHORT = { status: 's', progress: 'p', seen: 'n', defeated: 'k', location: 'L', lastInn: 'I', mapDims: 'M', inventory: 'v',
    equipment: 'q', bestiary: 'b', answered: 'A', adaptive: 'D', stats: 'S', units: 'u', subjects: 'j', submissions: 'm',
    firstTry: 'f', done: 'd', settings: 'G', player: 'P', quests: 'Q', chests: 'C', visited: 'V', playtime: 'T', daily: 'Y',
    battles: 'B', weapon: 'w', armor: 'a', createdAt: 'c', bestiaryClaims: 'K', stickers: 'X', titles: 'H', lights: 'l', lamps: 'o' };
  var LONG = {};
  Object.keys(SHORT).forEach(function (k) { LONG['~' + SHORT[k]] = k; });
  function renameKeys(v, table) {
    if (Array.isArray(v)) return v.map(function (x) { return renameKeys(x, table); });
    if (!v || typeof v !== 'object') return v;
    var o = {};
    Object.keys(v).forEach(function (k) { o[table[k] || k] = renameKeys(v[k], table); });
    return o;
  }
  var TO_SHORT = {};
  Object.keys(SHORT).forEach(function (k) { TO_SHORT[k] = '~' + SHORT[k]; });

  function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
  /** 和預設值相同的欄位拿掉（字典型欄位整個比較） */
  function diff(v, d, p) {
    if (same(v, d)) return undefined;
    if (v && d && typeof v === 'object' && typeof d === 'object' && !Array.isArray(v) && !Array.isArray(d) && State.DICT_KEYS.indexOf(p) < 0) {
      var o = {};
      Object.keys(v).forEach(function (k) { var x = diff(v[k], d[k], p ? p + '.' + k : k); if (x !== undefined) o[k] = x; });
      return o;
    }
    return v;
  }

  /** 存檔 → 精簡物件 */
  function slim(state, questions) {
    var D = dictFrom(questions);
    var s = JSON.parse(JSON.stringify(state));
    var d = State.createNewState(s.player.name, s.player.gender, s.createdAt || 0);
    delete s.qhist; delete s.recentQ;
    var key = function (k) { return k in D.ui ? D.ui[k] : k; };
    // 適性難度：只留和起始難度不同、或偏好較低難度的單元（連對連錯次數不帶）
    var au = (s.adaptive && s.adaptive.units) || {}, a = [];
    Object.keys(au).forEach(function (k) { var u = au[k] || {}; if (u.level !== 2 || u.preferLower) a.push([key(k), u.level, u.preferLower ? 1 : 0]); });
    s.adaptive = a;
    d.adaptive = [];
    // 單元統計：[單元, 完成, 一次答對] 平鋪
    var su = (s.stats && s.stats.units) || {}, b = [];
    Object.keys(su).forEach(function (k) { b.push(key(k), su[k].done || 0, su[k].firstTry || 0); });
    if (s.stats) s.stats.units = b;
    d.stats.units = [];
    // 答對過的題目：題庫序號的差值（排序後）；字典裡沒有的題目照原樣放在 answeredRaw
    var idx = [], raw = [];
    Object.keys(s.answered || {}).forEach(function (k) { if (k in D.qi) idx.push(D.qi[k]); else raw.push(k); });
    idx.sort(function (x, y) { return x - y; });
    s.answered = idx.map(function (v, i) { return i ? v - idx[i - 1] : v; });
    d.answered = [];
    if (raw.length) s.answeredRaw = raw;
    // 地圖尺寸：只留存檔位置用到的地圖
    var keep = {};
    [s.location, s.lastInn].forEach(function (l) { if (l && s.mapDims && s.mapDims[l.map]) keep[l.map] = s.mapDims[l.map]; });
    s.mapDims = keep;
    var out = diff(s, d, '') || {};
    out.version = state.version;
    out.player = out.player || {};
    ['name', 'gender', 'level', 'coins', 'exp'].forEach(function (k) { out.player[k] = state.player[k]; });
    out._d = D.hash;
    return renameKeys(out, TO_SHORT);
  }

  /** 精簡物件 → 存檔（之後再交給 Save.migrate 補預設值） */
  function unslim(o, questions) {
    o = renameKeys(o, LONG);
    var D = dictFrom(questions);
    var ok = !!o._d && o._d === D.hash;   // 題庫字典一致才解得回編號
    var name = function (k) { return typeof k === 'number' ? (ok ? D.units[k] : null) : k; };
    var units = {};
    (Array.isArray(o.adaptive) ? o.adaptive : []).forEach(function (e) {
      var k = name(e[0]);
      if (k) units[k] = { level: Number(e[1]) || 2, correctStreak: 0, wrongStreak: 0, preferLower: !!e[2] };
    });
    o.adaptive = { units: units, recent: [] };
    o.stats = o.stats || {};
    var flat = Array.isArray(o.stats.units) ? o.stats.units : [], su = {};
    for (var i = 0; i + 2 < flat.length; i += 3) {
      var k = name(flat[i]);
      if (!k) continue;
      var bar = k.indexOf('|');
      su[k] = { subject: k.slice(0, bar), unit: k.slice(bar + 1), done: Number(flat[i + 1]) || 0, firstTry: Number(flat[i + 2]) || 0 };
    }
    o.stats.units = su;
    var ans = {}, acc = 0;
    if (ok) (Array.isArray(o.answered) ? o.answered : []).forEach(function (dv, j) { acc = j ? acc + dv : dv; if (D.ids[acc]) ans[D.ids[acc]] = true; });
    (o.answeredRaw || []).forEach(function (k) { ans[k] = true; });
    o.answered = ans;
    delete o.answeredRaw;
    delete o._d;
    return o;
  }
  var MAX_JSON = 1024 * 1024;   // 解壓後最多 1MB（防壓縮炸彈；邊解壓邊數，超過就中止）
  var MAX_Z_CODE = 20000;       // 壓縮碼（JQZ／JQY）最多 2 萬字元：正常的存檔碼遠小於此（QR 用的 JQY 約 1000 字元）

  function canCompress() { return typeof CompressionStream === 'function' && typeof Response === 'function' && typeof Blob === 'function'; }
  function canDecompress() { return typeof DecompressionStream === 'function' && typeof Response === 'function' && typeof Blob === 'function'; }

  function bytesToB64url(bytes) {
    var bin = '';
    for (var i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function b64urlToBytes(s) {
    var b64 = s.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    var bin = atob(b64);
    var out = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }

  function pipe(bytes, stream) {
    return new Response(new Blob([bytes]).stream().pipeThrough(stream)).arrayBuffer().then(function (buf) { return new Uint8Array(buf); });
  }

  /** 解壓（deflate-raw），一邊解一邊累計大小，超過 max 就中止（防解壓縮炸彈：不會先解出幾百 MB 才發現） */
  function inflateCapped(bytes, max) {
    var reader;
    // 只支援 gzip、不支援 deflate-raw 的舊瀏覽器，建立時就會丟錯：轉成被拒絕的 Promise，保持 importAny「不丟例外」
    try { reader = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw')).getReader(); }
    catch (e) { return Promise.reject(e); }
    var chunks = [], total = 0;
    function step() {
      return reader.read().then(function (r) {
        if (r.done) {
          var out = new Uint8Array(total), off = 0;
          chunks.forEach(function (c) { out.set(c, off); off += c.length; });
          return out;
        }
        total += r.value.length;
        if (total > max) { try { reader.cancel(); } catch (e) { /* 忽略 */ } var err = new Error('too-big'); err.tooBig = true; throw err; }
        chunks.push(r.value);
        return step();
      });
    }
    return step();
  }

  /** 產生最短的存檔碼（Promise<string>）；不支援壓縮時回傳文字存檔碼 */
  function exportCompact(state) {
    if (!canCompress()) return Promise.resolve(Save.exportCode(state));
    var bytes = new TextEncoder().encode(JSON.stringify(state));
    return pipe(bytes, new CompressionStream('deflate-raw')).then(function (z) {
      var b = bytesToB64url(z);
      return Z_PREFIX + '-' + b + '-' + Save.fnv1a(b);
    }, function () { return Save.exportCode(state); });
  }

  /**
   * v0.9：QR 用的精簡壓縮碼 JQY（Promise<string>）。questions＝題庫（瀏覽器預設用 window.QUESTIONS）。
   * 不支援壓縮時回傳文字存檔碼。
   */
  function exportSlim(state, questions) {
    if (!canCompress()) return Promise.resolve(Save.exportCode(state));
    var bytes = new TextEncoder().encode(JSON.stringify(slim(state, questions)));
    return pipe(bytes, new CompressionStream('deflate-raw')).then(function (z) {
      var b = bytesToB64url(z);
      return Y_PREFIX + '-' + b + '-' + Save.fnv1a(b);
    }, function () { return Save.exportCode(state); });
  }

  /** 讀任何一種存檔碼（JQ1 文字碼、JQZ 壓縮碼、JQY 精簡壓縮碼）。回傳 Promise<{ok:true, state} | {ok:false, error}>，不會丟例外 */
  function importAny(code, questions) {
    if (typeof code !== 'string') return Promise.resolve({ ok: false, error: '存檔碼是空的' });
    var c = code.replace(/\s+/g, '');
    var isY = c.indexOf(Y_PREFIX + '-') === 0;
    if (c.indexOf(Z_PREFIX + '-') !== 0 && !isY) return Promise.resolve(Save.importCode(c));
    if (c.length > MAX_Z_CODE) return Promise.resolve({ ok: false, error: '存檔碼太長了' });
    var parts = c.split('-');
    // base64url 本身可能含「-」，所以校驗碼取最後一段、內容取中間全部
    if (parts.length < 3) return Promise.resolve({ ok: false, error: '存檔碼格式不對' });
    var sum = parts.pop().toUpperCase();
    var body = parts.slice(1).join('-');
    if (!/^[A-Za-z0-9_-]+$/.test(body)) return Promise.resolve({ ok: false, error: '存檔碼有奇怪的字元' });
    if (Save.fnv1a(body) !== sum) return Promise.resolve({ ok: false, error: '存檔碼不完整或抄錯了（校驗碼不符）' });
    if (!canDecompress()) return Promise.resolve({ ok: false, error: '這台裝置的瀏覽器太舊，讀不了 QR Code 存檔；請改用文字存檔碼' });
    var bytes;
    try { bytes = b64urlToBytes(body); } catch (e) { return Promise.resolve({ ok: false, error: '存檔碼內容壞掉了' }); }
    return inflateCapped(bytes, MAX_JSON).then(function (raw) {
      var obj;
      try { obj = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(raw)); } catch (e) { return { ok: false, error: '存檔碼內容壞掉了' }; }
      if (isY) { try { obj = unslim(obj, questions); } catch (e) { return { ok: false, error: '存檔碼內容壞掉了' }; } }
      var err = Save.validateState(obj);
      if (err) return { ok: false, error: err };
      try { return { ok: true, state: Save.migrate(obj) }; } catch (e) { return { ok: false, error: '存檔碼內容壞掉了' }; }
    }, function (e) { return { ok: false, error: e && e.tooBig ? '存檔內容太大了' : '存檔碼內容壞掉了' }; });
  }

  /** 遊戲網址（不含 # 之後）＋ #load=存檔碼 */
  function loadUrl(pageHref, code) {
    var base = String(pageHref || '').split('#')[0];
    return base + '#load=' + encodeURIComponent(code);
  }

  /** 從 location.hash 取出存檔碼；沒有就回傳 null */
  function parseHash(hash) {
    var m = /^#load=(.+)$/.exec(String(hash || ''));
    if (!m) return null;
    try { return decodeURIComponent(m[1]); } catch (e) { return null; }
  }

  var SaveCode = { MAX_Z_CODE: MAX_Z_CODE, MAX_JSON: MAX_JSON, Z_PREFIX: Z_PREFIX, Y_PREFIX: Y_PREFIX, slim: slim, unslim: unslim, dictFrom: dictFrom, exportSlim: exportSlim, canCompress: canCompress, exportCompact: exportCompact, importAny: importAny, loadUrl: loadUrl, parseHash: parseHash };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.SaveCode = SaveCode; }
  if (typeof module !== 'undefined') module.exports = SaveCode;
})();
