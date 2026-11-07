/*
 * 委託題目的情境篩選（v2.2.1b；v20_畫面審查 缺陷 9「豆干店的帳抽到小油坑、米粉師傅抽到湯博士」；2026-11-02 情境會議決議第 3 步）
 * 由 wip_v20/v221b_scene_apply.js 複製成 docs/src/systems/scenefit.js。node 可以 require（tools/qbank/check_scene_fit.js、測試、validate_world 共用同一份規則）。
 *
 * 題目可以標（questions.js，都可以不寫）：
 *   scene_scope：'generic'（通用，不依字詞改判）｜'home'（金包里／金山＝主角的家鄉）｜'Mxx' 或 ['Mxx', …]（只適合這幾張地圖）｜'fantasy'（地精、精靈這類奇幻情境）；沒寫＝看掃描
 *   place_role ：'key'（地名是解題關鍵，不能拿到外地用；預設）｜'decor'（地名只是裝飾，寬鬆層可以用）
 *   speaker    ：情境開頭的說話者（例：「登山阿伯」）；有寫時換說話者用它，不用 QUEST_SPEAKERS 清單猜
 * 沒寫 scene_scope 時現場掃描情境＋題幹（地區不存在題庫裡）：
 *   沒有命中地名、奇幻詞 → generic；只命中金包里（M01）而且是社會科 → home（社會科的家鄉單元）；命中地名 → 那幾張地圖（每一個都要是這張地圖才算本地）；
 *   只命中奇幻詞 → fantasy。掃描命中地名卻沒寫 scene_scope 的，tools/qbank/check_scene_fit.js 會列出來給考題設計師標註。
 * 抽題（helpFilter）：
 *   第一層（嚴格）＝單元＋難度＋skip_scene（舊規則）＋不是寶箱題（Chests.isChestQuestion）＋ generic／本地圖／home；外地（key）、奇幻（不在奇幻地圖時）不抽
 *   第二層（寬鬆）＝舊規則＋不是寶箱題。只有某一科的第一層少於這一科要答的題數時才退回，runHelp 會 console.warn；不再落到 session.js 的「整科都抽」
 * 換說話者只對 generic 的題（家鄉、本地、奇幻題的說話者是情境的一部分）；home 題在金包里以外的地圖前面加一句過場（委託可以寫 home_intro）。
 * 地名表（PLACES）：已含 v3.0 南部 M21–M25（2026-11-04 加）；v4.0 東部加新地圖時要把新地圖的地名從 OTHER 搬到那張地圖（例：花蓮、台東）。
 */
(function () {
  'use strict';
  var isNode = typeof module !== 'undefined' && typeof require === 'function';
  var Chests = isNode ? require('./chests.js') : (window.JQ && window.JQ.Chests);

  var HOME_MAP = 'M01';
  /** 地名 → 地圖。只放專有地名（「溫泉」「漁港」「老街」「豆干」「米粉」「紅樹林」「惡地」這類到處都有的詞、地形不放，免得誤判）。一個詞可以對到好幾張地圖 */
  var PLACES = {
    M01: ['金包里', '金山', '磺火漁港', '磺港', '慈護宮', '燭火雙岩', '燭臺雙嶼', '中角'],
    M02: ['擎天草原', '擎天崗'],
    M03: ['硫磺谷', '七星山', '小油坑', '陽明山'],
    M04: ['神木森林', '阿里山', '嘉義'],
    M06: ['海蝕洞', '野柳', '女王頭'],
    M08: ['月世界'],
    M09: ['山城市集', '九份'],
    M10: ['府城', '赤崁'],
    M46: ['竹子湖', '海芋', '蓬萊米'],
    M47: ['基隆', '雨港', '和平島', '正濱'],
    M48: ['金瓜石', '黃金博物館'],
    M49: ['草嶺'],
    M14: ['頭城', '礁溪', '龜山島', '搶孤'],
    M50: ['三星'],
    M51: ['蘇澳', '南方澳', '冷泉'],
    M52: ['坪林', '包種茶'],
    M13: ['木柵', '貓空', '鐵觀音', '指南宮'],
    M12: ['台北城', '大稻埕', '迪化街', '北門', '行天宮'],
    M53: ['北投', '關渡', '地熱谷'],
    M54: ['信義區', '台北101', '臺北101', '象山', '四四南村'],
    M15: ['石門水庫', '大溪', '桃園'],
    M16: ['新竹', '風城', '迎曦門'],
    M17: ['苗栗', '三義', '勝興', '大湖', '舊山線'],
    M18: ['大甲', '藺草', '鎮瀾宮', '台中', '臺中'],
    M19: ['鹿港', '九曲巷', '摸乳巷', '彰化'],
    M20: ['北港', '朝天宮', '武德宮', '笨港', '雲林'],
    // v3.0 南部（M21–M25；v2.2 沒有這幾張地圖時，這些詞一樣算外地）
    M22: ['鹿耳門', '台江', '四草'],
    M23: ['大樹區', '高屏舊鐵橋', '佛光山'],   // 「大樹」「舊鐵橋」是一般詞，只收專名
    M24: ['小琉球'],
    M25: ['屏東', '恆春', '墾丁', '鵝鑾鼻', '東港', '車城'],
    'M10,M21': ['安平', '億載金城', '劍獅'],
    // 縣市名對到好幾張地圖
    'M10,M21,M22': ['台南', '臺南'],
    'M08,M23': ['高雄'],
    'M14,M50,M51,M49': ['宜蘭', '蘭陽', '羅東', '冬山'],
    'M12,M13,M53,M54': ['台北', '臺北'],
    // v4.0 東部（M26–M29；wip_v40/v40_apply.js，地名照考題設計師 交接_東部補題.md 第二節）
    M26: ['卑南', '鹿野', '縱谷', '知本', '池上', '三仙台', '小野柳'],
    M27: ['綠島'],
    M28: ['蘭嶼', '達悟', '拼板舟'],
    M29: ['花蓮', '太魯閣', '林田山', '七星潭', '清水斷崖', '燕子口'],
    'M26,M27,M28': ['台東', '臺東'],
    // 遊戲裡沒有的地方（永遠算外地）
    OTHER: ['南投', '澎湖', '金門', '馬祖', '日月潭', '玉山', '淡水']
  };
  /** 奇幻情境：這些詞（或這些角色當主詞、說話者）＝fantasy，只在奇幻地圖抽 */
  var FANTASY_WORDS = ['地精', '精靈', '獸人', '哥布林', '魔法', '魔王', '咒語', '巫師'];
  var FANTASY_SPEAKERS = ['布丁', '露露', '岩岩', '嘟嘟'];
  var FANTASY_MAPS = ['M04', 'M05', 'M07', 'M08', 'M10', 'M11'];
  var DEFAULT_HOME_INTRO = '聽說你從金包里（現在的金山）來？說說你家鄉的事給我聽。';   // 遊戲設計師之後挑定；委託可以用 home_intro 換
  var MAP_ID_RE = /^M[0-9A-Z]{2,3}$/;

  var WORDS = [];   // [詞, [地圖…]]，長的先比
  Object.keys(PLACES).forEach(function (k) { var maps = k.split(','); PLACES[k].forEach(function (w) { WORDS.push([w, maps]); }); });
  WORDS.sort(function (a, b) { return b[0].length - a[0].length; });

  function text(q) { return String((q && q.scene) || '') + ' ' + String((q && q.stem) || ''); }
  /** 掃描一段文字：{ maps: [命中的地圖（含 OTHER）], words: [命中的地名], fantasy: [命中的奇幻詞] }。長的詞先吃掉，短的詞不會在同一段重複算（台北101 不會再算台北） */
  function scan(s, scene, stem) {
    s = String(s || '');
    var used = [], maps = [], words = [], fantasy = [];
    WORDS.forEach(function (p) {
      var w = p[0], i = -1;
      while ((i = s.indexOf(w, i + 1)) >= 0) {
        var clash = false;
        for (var k = i; k < i + w.length; k++) if (used[k]) { clash = true; break; }
        if (clash) continue;
        for (k = i; k < i + w.length; k++) used[k] = true;
        if (words.indexOf(w) < 0) words.push(w);
        p[1].forEach(function (m) { if (maps.indexOf(m) < 0) maps.push(m); });
      }
    });
    FANTASY_WORDS.forEach(function (w) { if (s.indexOf(w) >= 0) fantasy.push(w); });
    // 奇幻角色：情境或題幹以名字開頭（「布丁寫了…」「嘟嘟買…」），或寫成「名字：」；只出現在句子中間的（「買了 3 個布丁」）不算
    var sc = String(scene || ''), sm = String(stem || '');
    FANTASY_SPEAKERS.forEach(function (n) { if (sc.indexOf(n) === 0 || sm.indexOf(n) === 0 || s.indexOf(n + '：') >= 0 || s.indexOf(n + ':') >= 0) fantasy.push(n); });
    return { maps: maps, words: words, fantasy: fantasy };
  }

  /**
   * 一題的情境範圍：{ scope: 'generic'|'home'|'fantasy'|[地圖…], role: 'key'|'decor', explicit: 有沒有寫 scene_scope, any: 掃描到的地圖要「每一個都是這張圖」(false) 還是「其中一個是」(true), hits }
   */
  function scopeOf(q) {
    var role = q && q.place_role === 'decor' ? 'decor' : 'key';
    var hits = scan(text(q), q && q.scene, q && q.stem);
    var ss = q && q.scene_scope;
    if (ss !== undefined && ss !== null && ss !== '') {
      var scope = ss === 'home' || ss === 'fantasy' || ss === 'generic' ? ss : (Array.isArray(ss) ? ss.slice() : [ss]);
      return { scope: scope, role: role, explicit: true, any: true, hits: hits };
    }
    if (hits.maps.length) {
      if (hits.maps.length === 1 && hits.maps[0] === HOME_MAP && q.subject === '社會') return { scope: 'home', role: role, explicit: false, any: false, hits: hits };
      return { scope: hits.maps.slice(), role: role, explicit: false, any: false, hits: hits };
    }
    if (hits.fantasy.length) return { scope: 'fantasy', role: role, explicit: false, any: false, hits: hits };
    return { scope: 'generic', role: role, explicit: false, any: false, hits: hits };
  }
  /** 這一題對 mapId 來說是哪一種：'generic'｜'home'｜'local'｜'fantasy-ok'｜'fantasy'（不在奇幻地圖）｜'foreign' */
  function fitKind(q, mapId) {
    var s = scopeOf(q), sc = s.scope;
    if (sc === 'generic') return 'generic';
    if (sc === 'home') return mapId === HOME_MAP ? 'local' : 'home';
    if (sc === 'fantasy') return FANTASY_MAPS.indexOf(mapId) >= 0 ? 'fantasy-ok' : 'fantasy';
    var ok = s.any ? sc.indexOf(mapId) >= 0 : sc.every(function (m) { return m === mapId; });
    return ok ? 'local' : 'foreign';
  }
  function isChest(q) { return !!(Chests && Chests.isChestQuestion(q)); }

  /** 委託每一步的科目（同 questlog.js helpSubject）與每一科要答幾題 */
  function helpSubject(quest, n) { return Array.isArray(quest.subjects) && quest.subjects.length ? quest.subjects[(n || 0) % quest.subjects.length] : quest.subject; }
  function needBySubject(quest) {
    var out = {}, n = Math.max(1, quest.count || 1);
    for (var i = 0; i < n; i++) { var s = helpSubject(quest, i); out[s] = (out[s] || 0) + 1; }
    return out;
  }
  /** 原題池的單元與星等條件，補丁工具也共用；科目由呼叫端判斷。 */
  function unitLevelFits(x, quest) {
    var lr = quest.level_range || [1, 4], units = quest.units || [];
    return (!units.length || units.indexOf(x.unit) >= 0) && x.level >= lr[0] && x.level <= lr[1];
  }
  /** 舊規則：單元＋難度＋skip_scene（v1.4.1） */
  function baseFits(x, quest) {
    var skip = quest.skip_scene || [];
    return unitLevelFits(x, quest) &&
      !skip.some(function (w) { return String(x.scene || '').indexOf(w) >= 0 || String(x.stem || '').indexOf(w) >= 0; });
  }
  function looseFits(x, quest) { return baseFits(x, quest) && !isChest(x); }
  function strictFits(x, quest, mapId) {
    if (!looseFits(x, quest)) return false;
    var k = fitKind(x, mapId);
    return k === 'generic' || k === 'home' || k === 'local' || k === 'fantasy-ok';
  }
  /** 一個委託在 mapId 的抽題池：{ 科目: { need, base: [題], loose: [題], strict: [題] } } */
  function pools(questions, quest, mapId) {
    var need = needBySubject(quest), out = {};
    Object.keys(need).forEach(function (s) {
      var base = (questions || []).filter(function (x) { return x.subject === s && baseFits(x, quest); });
      var loose = base.filter(function (x) { return !isChest(x); });
      out[s] = { need: need[s], base: base, loose: loose, strict: loose.filter(function (x) { return strictFits(x, quest, mapId); }) };
    });
    return out;
  }
  /**
   * runHelp 用：回傳 { filter(x), layer: { 科目: 'strict'|'loose' }, fallback: [退回寬鬆的科目], pools }。
   * 第一層少於這一科要答的題數 → 這一科退回第二層（呼叫的人要 console.warn）
   */
  function helpFilter(questions, quest, mapId) {
    var P = pools(questions, quest, mapId), layer = {}, fallback = [];
    Object.keys(P).forEach(function (s) { if (P[s].strict.length >= P[s].need) layer[s] = 'strict'; else { layer[s] = 'loose'; fallback.push(s); } });
    return {
      layer: layer, fallback: fallback, pools: P,
      filter: function (x) { return layer[x.subject] === 'loose' ? looseFits(x, quest) : strictFits(x, quest, mapId); }
    };
  }
  /** 題目畫面的情境：{ text, intro }。generic 才換說話者（DialogText.questScene，第 3 參數＝題目的 speaker）；home 題在金包里以外加委託人的過場句「委託人：「…」」 */
  function sceneView(q, mapId, npcName, quest, DialogText) {
    var scene = String((q && q.scene) || '');
    if (!scene) return { text: '', intro: '' };
    var k = fitKind(q, mapId), t = scene;
    if (k === 'generic' && npcName && DialogText && DialogText.questScene) t = DialogText.questScene(scene, npcName, q.speaker);
    var line = String((quest && quest.home_intro) || DEFAULT_HOME_INTRO);
    var intro = k === 'home' ? (npcName ? npcName + '：「' + line + '」' : line) : '';   // 委託人說的過場句
    return { text: t, intro: intro };
  }
  /** v4.0（wip_v40/v40_apply.js；夜班審 v3.0.1 建議②、實玩觀察 O-2）：同一次幫忙連出好幾題家鄉題時，過場句只在第一題家鄉題講。
   *  memo＝這一次幫忙的紀錄 { q: 講過過場句的題目 id }；同一題（答錯重出）照樣講，換一題就拿掉 intro */
  function introOnce(view, qid, memo) {
    if (!view || !view.intro || !memo) return view;
    if (memo.q === undefined || memo.q === null) memo.q = qid;
    return memo.q === qid ? view : { text: view.text, intro: '' };
  }
  /** 委託的嚴格題池下限（遊戲設計師第 2 輪拍板前先用 max(15, 5×題數)）：need＝這一科要答的題數 */
  function minStrict(need) { return Math.max(15, 5 * (need || 1)); }

  var SceneFit = {
    HOME_MAP: HOME_MAP, PLACES: PLACES, FANTASY_WORDS: FANTASY_WORDS, FANTASY_SPEAKERS: FANTASY_SPEAKERS, FANTASY_MAPS: FANTASY_MAPS, DEFAULT_HOME_INTRO: DEFAULT_HOME_INTRO, MAP_ID_RE: MAP_ID_RE,
    introOnce: introOnce, scan: scan, scopeOf: scopeOf, fitKind: fitKind, isChest: isChest, helpSubject: helpSubject, needBySubject: needBySubject,
    unitLevelFits: unitLevelFits, baseFits: baseFits, looseFits: looseFits, strictFits: strictFits, pools: pools, helpFilter: helpFilter, sceneView: sceneView, minStrict: minStrict
  };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.SceneFit = SceneFit; }
  if (typeof module !== 'undefined') module.exports = SceneFit;
})();
