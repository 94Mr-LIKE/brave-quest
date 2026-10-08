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

  /**
   * v0.9 委託題目：題庫情境的說話者（例如「書店阿姨：」「漁市阿伯看著時鐘：」）換成委託人的名字，
   * 讓小朋友知道是在幫誰。只換句首的人物；番薯仔（一直跟著主角）、外國小朋友、告示牌、寶箱等不換。不改題庫本身。
   */
  var QUEST_SPEAKERS = ['賣地瓜的阿姨', '溫泉旅館老闆娘', '溫泉旅館阿姨', '溫泉研究員', '書店阿姨', '圖書館員', '老街阿伯', '漁市阿伯', '漁夫阿伯',
    '地精族長', '地精木匠', '地精工匠', '外國商人', '導護志工', '湯博士', '里長伯', '里長', '布丁', '露露', '岩岩', '嘟嘟', '商人', '地精'];
  function questScene(scene, npcName) {
    var s = String(scene || '');
    if (!npcName) return s;
    var colon = s.search(/[：:]/);
    if (colon < 0 || colon > 30) return s;   // 沒有說話者的敘述不換
    for (var i = 0; i < QUEST_SPEAKERS.length; i++) {
      var n = QUEST_SPEAKERS[i];
      if (s.indexOf(n) === 0) return n === npcName ? s : npcName + s.slice(n.length);
    }
    return s;
  }

  var DialogText = { MODES: MODES, view: view, fill: fill, questScene: questScene, QUEST_SPEAKERS: QUEST_SPEAKERS };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.DialogText = DialogText; }
  if (typeof module !== 'undefined') module.exports = DialogText;
})();
