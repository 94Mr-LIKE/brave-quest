/*
 * v1.0.2 罕用字替代顯示：台語漢字裡有些字在 Unicode 擴充區（例：「𠢕」U+20895，擴充 B 區），
 * 舊 iPad、Chromebook、部分 Android 的系統字型畫不出來，會變成方框（豆腐字）。
 *
 * - TABLE：罕用字 → 畫不出來時改顯示的文字（台羅）。之後有別的字，加一行就好。
 * - 偵測（瀏覽器）：用 canvas 用和對話框一樣的字型畫這個字，和「一定畫不出來的字」（豆腐字參考）比像素；
 *   一樣、或什麼都沒畫出來 → 判定這台裝置畫不出來。結果記住（每個字只量一次）。
 *   沒有 canvas（例如 node 測試）→ 當作畫得出來（不替換），由測試直接給 supported 函式。
 * - apply(text, supported)：只替換畫不出來的罕用字；其他字完全不動。
 */
(function () {
  'use strict';
  var TABLE = {
    '𠢕': 'gâu'   // 𠢕 U+20895（𠢕＝能幹、厲害）
  };
  // 豆腐字參考：Unicode 沒有分配的碼位（不同平台的「沒有這個字」圖形不一定一樣，所以放兩個不同平面的）
  var TOFU_REFS = ['󯿾' /* U+EFFFE（未分配） */, '𯿽' /* U+2FFFD（未分配） */];
  var cache = {};

  /** 字串裡有哪些在替代表的字（照出現順序、不重複） */
  function rareIn(text) {
    var out = [];
    Array.from(String(text || '')).forEach(function (c) { if (TABLE[c] && out.indexOf(c) < 0) out.push(c); });
    return out;
  }

  /** 畫不出來的罕用字換成替代文字。supported(ch) → true／false；沒給就用瀏覽器偵測 */
  function apply(text, supported) {
    var s = String(text === undefined || text === null ? '' : text);
    var rare = rareIn(s);
    if (!rare.length) return s;
    var can = supported || canRender;
    rare.forEach(function (c) { if (!can(c)) s = s.split(c).join(TABLE[c]); });
    return s;
  }

  function pixels(ctx, ch, size) {
    ctx.clearRect(0, 0, size * 2, size * 2);
    ctx.fillText(ch, size / 2, size * 1.5);
    var d = ctx.getImageData(0, 0, size * 2, size * 2).data, sig = [], ink = 0;
    for (var i = 3; i < d.length; i += 4) { sig.push(d[i] > 127 ? 1 : 0); if (d[i] > 127) ink++; }
    return { key: sig.join(''), ink: ink };
  }

  /** 瀏覽器：這個字畫得出來嗎（用 canvas 和豆腐字參考比對）。font：CSS 字型（預設用 body 的字型） */
  function canRender(ch, font) {
    if (cache[ch] !== undefined) return cache[ch];
    var ok = true;
    try {
      if (typeof document === 'undefined' || !document.createElement) return true;
      var cv = document.createElement('canvas');
      if (!cv || !cv.getContext) return true;
      var size = 32;
      cv.width = size * 2; cv.height = size * 2;
      var ctx = cv.getContext('2d', { willReadFrequently: true });
      if (!ctx || !ctx.getImageData) return true;
      var fam = font || (document.body && window.getComputedStyle ? window.getComputedStyle(document.body).fontFamily : '') || 'sans-serif';
      ctx.font = size + 'px ' + fam;
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = '#000';
      var me = pixels(ctx, ch, size);
      if (me.ink === 0) ok = false;
      else TOFU_REFS.forEach(function (t) { if (pixels(ctx, t, size).key === me.key) ok = false; });
    } catch (e) { ok = true; }   // 量不出來（例如 canvas 被擋）：照原字顯示
    cache[ch] = ok;
    return ok;
  }

  function reset() { cache = {}; }

  var RareChars = { TABLE: TABLE, TOFU_REFS: TOFU_REFS, rareIn: rareIn, apply: apply, canRender: canRender, reset: reset, _cache: function () { return cache; } };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.RareChars = RareChars; }
  if (typeof module !== 'undefined') module.exports = RareChars;
})();
