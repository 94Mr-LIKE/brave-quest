/*
 * 壓縮存檔碼與「#load=」存檔連結（給 QR Code 用）
 *
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

  var Z_PREFIX = 'JQZ';
  var MAX_JSON = 1024 * 1024;   // 解壓後最多 1MB（防壓縮炸彈）

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

  /** 產生最短的存檔碼（Promise<string>）；不支援壓縮時回傳文字存檔碼 */
  function exportCompact(state) {
    if (!canCompress()) return Promise.resolve(Save.exportCode(state));
    var bytes = new TextEncoder().encode(JSON.stringify(state));
    return pipe(bytes, new CompressionStream('deflate-raw')).then(function (z) {
      var b = bytesToB64url(z);
      return Z_PREFIX + '-' + b + '-' + Save.fnv1a(b);
    }, function () { return Save.exportCode(state); });
  }

  /** 讀任何一種存檔碼（JQ1 文字碼或 JQZ 壓縮碼）。回傳 Promise<{ok:true, state} | {ok:false, error}>，不會丟例外 */
  function importAny(code) {
    if (typeof code !== 'string') return Promise.resolve({ ok: false, error: '存檔碼是空的' });
    var c = code.replace(/\s+/g, '');
    if (c.indexOf(Z_PREFIX + '-') !== 0) return Promise.resolve(Save.importCode(c));
    if (c.length > Save.MAX_CODE_LEN) return Promise.resolve({ ok: false, error: '存檔碼太長了' });
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
    return pipe(bytes, new DecompressionStream('deflate-raw')).then(function (raw) {
      if (raw.length > MAX_JSON) return { ok: false, error: '存檔內容太大了' };
      var obj;
      try { obj = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(raw)); } catch (e) { return { ok: false, error: '存檔碼內容壞掉了' }; }
      var err = Save.validateState(obj);
      if (err) return { ok: false, error: err };
      try { return { ok: true, state: Save.migrate(obj) }; } catch (e) { return { ok: false, error: '存檔碼內容壞掉了' }; }
    }, function () { return { ok: false, error: '存檔碼內容壞掉了' }; });
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

  var SaveCode = { Z_PREFIX: Z_PREFIX, canCompress: canCompress, exportCompact: exportCompact, importAny: importAny, loadUrl: loadUrl, parseHash: parseHash };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.SaveCode = SaveCode; }
  if (typeof module !== 'undefined') module.exports = SaveCode;
})();
