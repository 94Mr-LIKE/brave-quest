/* 委託（quest）與劇情：每區 5 題，全部答對 → 點亮該區的燈、得到貼紙、解鎖劇情短句 */
(function () {
  'use strict';
  var QUEST_LENGTH = 5;

  var REGIONS = {
    '國語': { area: '紅磚老街', npc: 'npc_bookstore', npcName: '墨香姨', role: '老街書店阿姨', sticker: 'sticker_chinese', stickerName: '書頁貼紙',
      greet: '小冒險者，書店的招牌字被海風吹得亂七八糟，可以幫我一起讀讀看嗎？',
      story: '老街的燈亮了！紅磚牆上映出暖暖的光，墨香姨說：「會讀字的人，走到哪裡都不會迷路。」' },
    '英語': { area: '燭臺海岸', npc: 'npc_tourist', npcName: 'Emma', role: '海岸的外國遊客', sticker: 'sticker_english', stickerName: '燭臺石貼紙',
      greet: 'Hello! 我是來看燭臺石的旅人 Emma。我有些英文問題想問你，可以幫幫我嗎？',
      story: '海岸的燈亮了！兩根燭臺石在海上閃閃發光，Emma 笑著說：「Thank you, my friend!」' },
    '數學': { area: '漁港魚市', npc: 'npc_fisher', npcName: '海生伯', role: '漁市阿伯', sticker: 'sticker_math', stickerName: '小魚貼紙',
      greet: '小朋友！今天魚貨很多，阿伯算到頭昏了，你來幫我算一算好不好？',
      story: '漁市的燈亮了！漁船一艘艘平安回港，海生伯說：「算得清楚，生意才做得長久啦！」' },
    '自然': { area: '白煙溫泉谷', npc: 'npc_scientist', npcName: '湯博士', role: '溫泉研究員', sticker: 'sticker_science', stickerName: '溫泉貼紙',
      greet: '你好！我在研究溫泉為什麼會冒白煙。一起來觀察和實驗吧！',
      story: '溫泉谷的燈亮了！白煙在燈光下像雲一樣飄，湯博士說：「仔細觀察，就會有新發現。」' },
    '社會': { area: '山邊古道', npc: 'npc_chief', npcName: '石里長', role: '古道里長', sticker: 'sticker_social', stickerName: '古道貼紙',
      greet: '以前的人挑著魚走過這條古道到城裡。想知道我們社區的故事嗎？',
      story: '古道的燈亮了！石階一路亮到山上，石里長說：「了解家鄉，就會更愛家鄉。」' }
  };

  var INTRO = '蹦火節前夕，廣場上守護漁港的「五盞知識燈」突然熄了！番薯仔說：「只要幫五個地區的居民解決難題，燈就會重新亮起來。我們出發吧！」';
  var ENDING = '五盞知識燈全部亮了！漁港的船兒點起火把，蹦火節開始了！大家都說：「謝謝你和番薯仔！」';

  function start(state, subject) {
    var practice = !!state.lamps[subject];
    if (!state.activeQuest || state.activeQuest.subject !== subject) {
      state.activeQuest = { subject: subject, done: 0, practice: practice };
    }
    return state.activeQuest;
  }

  /** 答對一題後呼叫。回傳 {questDone, lampLit, allLit} */
  function recordCorrect(state) {
    var q = state.activeQuest;
    if (!q) return { questDone: false, lampLit: false, allLit: false };
    q.done += 1;
    if (q.done < QUEST_LENGTH) return { questDone: false, lampLit: false, allLit: false };
    var subject = q.subject;
    var lampLit = false;
    if (!state.lamps[subject]) {
      state.lamps[subject] = true;
      lampLit = true;
      if (state.stickers.indexOf(subject) < 0) state.stickers.push(subject);
      if (state.story.indexOf(subject) < 0) state.story.push(subject);
    }
    state.activeQuest = null;
    var allLit = lampLit && litCount(state) === 5;
    if (allLit && state.story.indexOf('ending') < 0) state.story.push('ending');
    return { questDone: true, lampLit: lampLit, allLit: allLit, subject: subject };
  }

  function litCount(state) {
    return Object.keys(state.lamps).filter(function (k) { return state.lamps[k]; }).length;
  }

  function storyText(id) {
    if (id === 'intro') return INTRO;
    if (id === 'ending') return ENDING;
    return REGIONS[id] ? REGIONS[id].story : '';
  }

  var Quest = { QUEST_LENGTH: QUEST_LENGTH, REGIONS: REGIONS, INTRO: INTRO, ENDING: ENDING, start: start, recordCorrect: recordCorrect, litCount: litCount, storyText: storyText };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.Quest = Quest; }
  if (typeof module !== 'undefined') module.exports = Quest;
})();
