/* 啟動：file:// 時先載入打包的圖檔，再開始遊戲 */
(function () {
  'use strict';
  function start() {
    window.JQ.Assets.preparePack().then(function () {
      try { window.JQ.Game.boot(); }
      catch (e) {
        console.error(e);
        var p = document.createElement('p');
        p.style.cssText = 'color:#fff;padding:24px;font-size:22px';
        p.textContent = '遊戲啟動失敗，請重新整理頁面。（' + e.message + '）';
        document.body.appendChild(p);
      }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
