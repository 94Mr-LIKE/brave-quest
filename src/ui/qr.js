/*
 * QR Code 繪製：用 lib/qrcode.js（qrcode-generator 2.0.4，MIT）算出黑白格，自己畫在 canvas 上
 * （不用 innerHTML、不用 eval，符合 CSP）。
 */
(function () {
  'use strict';

  /** 回傳 { ok:true, canvas, modules } 或 { ok:false, error } */
  function render(text, opts) {
    opts = opts || {};
    if (typeof window.qrcode !== 'function') return { ok: false, error: '找不到 QR Code 程式（lib/qrcode.js）' };
    var qr;
    try {
      qr = window.qrcode(0, opts.level || 'L');   // 0 = 自動選最小的版本
      qr.addData(text, 'Byte');
      qr.make();
    } catch (e) {
      return { ok: false, error: '存檔太大，放不進一張 QR Code。請改用文字存檔碼。' };
    }
    var n = qr.getModuleCount();
    var quiet = 4;                                   // QR Code 規定四周留白 4 格
    var cell = Math.max(2, Math.floor((opts.size || 360) / (n + quiet * 2)));
    var c = document.createElement('canvas');
    c.width = c.height = (n + quiet * 2) * cell;
    var g = c.getContext('2d');
    g.fillStyle = '#ffffff';
    g.fillRect(0, 0, c.width, c.height);
    g.fillStyle = '#000000';
    for (var r = 0; r < n; r++) for (var col = 0; col < n; col++) if (qr.isDark(r, col)) g.fillRect((col + quiet) * cell, (r + quiet) * cell, cell, cell);
    c.setAttribute('role', 'img');
    c.setAttribute('aria-label', '存檔 QR Code');
    c.className = 'qr';
    return { ok: true, canvas: c, modules: n };
  }

  window.JQ = window.JQ || {};
  window.JQ.QR = { render: render };
})();
