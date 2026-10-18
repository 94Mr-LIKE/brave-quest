/*
 * v1.0.6「存檔有限」提醒（老闆 2026-10-18／19）：標題畫面顯示一則簡短提醒，最多每 7 天一次。
 * 背景（事實）：WebKit 官方文件寫明 Safari 的追蹤防護會在「7 天沒有和網站互動」後刪除網站用程式存的資料（含 localStorage）；
 * 「加到主畫面」的網頁 App 不受這條限制（https://webkit.org/tracking-prevention/ ，2026-10-18 查）。
 * 上次顯示的時間記在 localStorage 的 bq_save_tip_at（本遊戲的 key 一律以 bq_ 開頭）。
 * 與畫面無關，可在 node 測試；ui/title.js 負責顯示。
 */
(function () {
  'use strict';
  var KEY = 'bq_save_tip_at';
  var INTERVAL_MS = 7 * 24 * 60 * 60 * 1000;
  // 夜班審查：iPad 主畫面的網頁 App 和 Safari 的存檔是分開的（WebKit：kept isolated from Safari），所以要先產生存檔碼再搬
  var MSG_BROWSER = '存檔只存在這台裝置的瀏覽器裡，空間和時間都有限。iPad 很久沒玩（大約 7 天）存檔可能會被清掉：' +
    '請家長先到「設定」產生存檔碼／QR Code，再把遊戲「加入主畫面」；從主畫面圖示打開後，按「用存檔碼繼續」把存檔搬過去。';
  var MSG_STANDALONE = '存檔只存在這台裝置裡，空間有限，也可能被清掉。請家長定期到「設定」用存檔碼／QR Code 備份。';

  /** 是不是從主畫面圖示開的（iPad 的 navigator.standalone，或 display-mode: standalone／fullscreen；manifest 用 fullscreen） */
  function isStandalone(win) {
    try {
      if (!win) return false;
      if (win.navigator && win.navigator.standalone === true) return true;
      if (win.matchMedia) {
        if (win.matchMedia('(display-mode: standalone)').matches) return true;
        if (win.matchMedia('(display-mode: fullscreen)').matches) return true;
      }
    } catch (e) { /* 判斷不出來就當成一般瀏覽器 */ }
    return false;
  }

  function message(standalone) { return standalone ? MSG_STANDALONE : MSG_BROWSER; }

  /** 現在該不該顯示（沒顯示過、超過 7 天、或時間倒退＝裝置時鐘被調過）；讀不到 localStorage → 不顯示 */
  function shouldShow(storage, now) {
    try {
      if (!storage) return false;
      var last = Number(storage.getItem(KEY));
      if (!last || !isFinite(last)) return true;
      return now - last >= INTERVAL_MS || now < last;
    } catch (e) { return false; }
  }

  function markShown(storage, now) {
    try { storage.setItem(KEY, String(now)); return true; } catch (e) { return false; }
  }

  /** 該顯示就記下時間並回傳要顯示的文字；不該顯示 → null */
  function take(storage, now, win) {
    if (!shouldShow(storage, now)) return null;
    if (!markShown(storage, now)) return null;
    return message(isStandalone(win));
  }

  var SaveTip = { KEY: KEY, INTERVAL_MS: INTERVAL_MS, MSG_BROWSER: MSG_BROWSER, MSG_STANDALONE: MSG_STANDALONE,
    isStandalone: isStandalone, message: message, shouldShow: shouldShow, markShown: markShown, take: take };
  if (typeof window !== 'undefined' && window) { window.JQ = window.JQ || {}; window.JQ.SaveTip = SaveTip; }
  if (typeof module !== 'undefined') module.exports = SaveTip;
})();
