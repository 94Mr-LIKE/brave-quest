/*
 * 瀏覽器縮放偵測（v0.8）：電腦版瀏覽器會依網域記住縮放比例（同網域的其他專案縮小過，這裡也跟著變小）。
 * 推估方式：window.outerWidth ÷ window.innerWidth（縮放 50% 時約 0.5、150% 時約 1.5）。
 * 只在桌機判斷：主要指標是滑鼠（pointer: fine、能 hover），而且不是 iPad／手機；平板一律不提示。
 * 注意：有觸控螢幕的 Windows 筆電 maxTouchPoints 也大於 0，所以不能只看觸控點數來判斷平板。純計算，可以在 node 測試。
 */
(function () {
  'use strict';
  var LOW = 0.85, HIGH = 1.25;

  /** iPad（新版 iPadOS 的 Safari 會假裝是 Mac：Macintosh＋多點觸控）、手機 */
  function isTabletOrPhone(o) {
    var ua = String(o.userAgent || '');
    if (/iPad|iPhone|iPod|Android|Mobile|Silk|Kindle/i.test(ua)) return true;
    return /Macintosh/.test(ua) && o.maxTouchPoints > 1;
  }

  /**
   * o = { outerWidth, innerWidth, maxTouchPoints, coarsePointer, canHover, userAgent }
   * 回傳 { ratio（推估的縮放比例，算不出來時為 null）, desktop, show（要不要提示） }
   */
  function estimate(o) {
    o = o || {};
    var desktop = !o.coarsePointer && o.canHover !== false && !isTabletOrPhone(o);
    var ow = Number(o.outerWidth) || 0, iw = Number(o.innerWidth) || 0;
    var ratio = ow > 0 && iw > 0 ? Math.round(ow / iw * 100) / 100 : null;
    return { ratio: ratio, desktop: desktop, show: desktop && ratio !== null && (ratio < LOW || ratio > HIGH) };
  }

  /** 讀目前的瀏覽器環境 */
  function current() {
    if (typeof window === 'undefined') return estimate({});
    var coarse = false, hover = true;
    try {
      coarse = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
      hover = !(window.matchMedia && window.matchMedia('(hover: none)').matches);
    } catch (e) { /* 忽略 */ }
    return estimate({ outerWidth: window.outerWidth, innerWidth: window.innerWidth, maxTouchPoints: navigator.maxTouchPoints || 0,
      coarsePointer: coarse, canHover: hover, userAgent: navigator.userAgent });
  }

  var MESSAGE = '畫面好像被縮放了：按 Ctrl＋0 可以恢復正常大小（Mac 按 ⌘＋0）';
  var Zoom = { LOW: LOW, HIGH: HIGH, MESSAGE: MESSAGE, estimate: estimate, current: current, isTabletOrPhone: isTabletOrPhone };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.Zoom = Zoom; }
  if (typeof module !== 'undefined') module.exports = Zoom;
})();
