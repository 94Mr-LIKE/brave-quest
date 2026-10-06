/*
 * 對話文字（含台語）
 * 一句對話：{ who, text, taigi?: { hanji, tailo, huayu } }
 * 有 taigi 時：主要顯示台語漢字；下方小字顯示台羅拼音與華語翻譯（家長設定可切換）。
 * 朗讀：瀏覽器沒有台語語音，所以讀華語翻譯（沒有翻譯就讀 text）。
 *
 * mode（設定 settings.taigiSub）：
 *   'both'  台羅＋華語（預設）
 *   'huayu' 只顯示華語翻譯
 *   'tailo' 只顯示台羅
 *   'none'  都不顯示
 */
(function () {
  'use strict';
  var MODES = ['both', 'huayu', 'tailo', 'none'];

  function fill(text, name) { return String(text || '').replace(/\{(name|player|hero)\}/g, name || '小冒險者'); }

  /** 回傳 { main, tailo, huayu, speak, isTaigi } */
  function view(line, mode, name) {
    mode = MODES.indexOf(mode) >= 0 ? mode : 'both';
    var t = line && line.taigi;
    if (t && (t.hanji || t.tailo)) {
      var huayu = fill(t.huayu || line.text || '', name);
      return {
        isTaigi: true,
        main: fill(t.hanji || t.tailo, name),
        tailo: (mode === 'both' || mode === 'tailo') && t.hanji ? fill(t.tailo || '', name) : '',
        huayu: (mode === 'both' || mode === 'huayu') ? huayu : '',
        speak: huayu
      };
    }
    var text = fill(line && line.text, name);
    return { isTaigi: false, main: text, tailo: '', huayu: '', speak: text };
  }

  var DialogText = { MODES: MODES, view: view, fill: fill };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.DialogText = DialogText; }
  if (typeof module !== 'undefined') module.exports = DialogText;
})();
