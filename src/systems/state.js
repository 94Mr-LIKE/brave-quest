/* 遊戲狀態（存檔內容）的結構定義與建立 — schema v4（v1.0 第一批 v3：職業分開記等級、保底、技能欄、立志小考；v1.1 第一章 v4：chapter，舊存檔由 Ch1Migrate 補記） */
(function () {
  'use strict';
  var isNode = typeof module !== 'undefined' && typeof require === 'function';
  var Adaptive = isNode ? require('./adaptive.js') : window.JQ.Adaptive;
  var Daily = isNode ? require('./daily.js') : window.JQ.Daily;
  var Playtime = isNode ? require('./playtime.js') : window.JQ.Playtime;

  var SCHEMA_VERSION = 5;   // v1.3 台北章（62 號第五節）v5：legacyM05＋Ch3Migrate；   // v1.0 第一批（48 號 F9）v3：player.jobs、player.floor、player.skillSlots、trial；v1.1 第一章（59 號第五節）v4：chapter＋Ch1Migrate
  var SUBJECTS = ['國語', '英語', '數學', '自然', '社會'];
  var NAME_MAX = 8;
  var ANSWER_TIME_MODES = ['relaxed', 'standard', 'off'];

  /**
   * 冒險者名字：去掉 HTML 標籤、所有空白、控制字元與 < > & " '，限 1–8 字
   * （以字元計，表情符號也算 1 字）；清完是空的就給預設名字。
   */
  function cleanName(name) {
    var s = String(name || '').replace(/<[^>]*>/g, '').replace(/[\s\u0000-\u001f\u007f​-‍﻿<>&"']/g, '');
    var chars = Array.from(s);
    if (chars.length > NAME_MAX) s = chars.slice(0, NAME_MAX).join('');
    return s || '小冒險者';
  }

  /** 性別只影響主角圖：'f' 女生、'm' 男生（對話不寫死性別） */
  function cleanGender(g) { return g === 'm' ? 'm' : 'f'; }

  function emptyBySubject(fn) {
    var o = {};
    SUBJECTS.forEach(function (s) { o[s] = fn(s); });
    return o;
  }

  /**
   * v0.9.3 聲音設定的數值（老闆 2026-10-10：背景音樂調小、語音調大，預設都是「中」；語速稍快才是標準）
   * - 語音音量（乘在每句的音量上）：小 0.6、中 1.0（舊預設 0.9）、大 1.3（預錄音檔會更大聲；瀏覽器合成語音最大就是 1）
   * - 音樂音量（JQ.Music.setVolume）：小 0.2、中 0.35（舊預設 0.55）、大 0.55
   * - 語速（乘在每個角色的語速上）：慢 0.9、普通 1、稍快 1.15（預設）、快 1.3
   */
  var AUDIO = {
    VOICE_VOL: { small: 0.6, mid: 1.0, large: 1.3 },
    MUSIC_VOL: { small: 0.2, mid: 0.35, large: 0.55 },
    SPEEDS: [{ value: 0.9, label: '慢' }, { value: 1, label: '普通' }, { value: 1.15, label: '稍快（標準）' }, { value: 1.3, label: '快' }],
    SPEED_DEFAULT: 1.15,
    voiceVolume: function (s) { return AUDIO.VOICE_VOL[s && s.voiceVol] || AUDIO.VOICE_VOL.mid; },
    musicVolume: function (s) { return AUDIO.MUSIC_VOL[s && s.musicVol] || AUDIO.MUSIC_VOL.mid; },
    voiceSpeed: function (s) { var v = Number(s && s.voiceSpeed); return v >= 0.6 && v <= 1.5 ? v : AUDIO.SPEED_DEFAULT; },
    /** 最接近的語速選項（舊存檔的 0.8 → 慢 0.9），讓設定頁一定有一個選項是選中的 */
    nearestSpeed: function (v) {
      v = Number(v);
      if (!(v > 0)) return AUDIO.SPEED_DEFAULT;
      return AUDIO.SPEEDS.reduce(function (a, b) { return Math.abs(b.value - v) < Math.abs(a.value - v) ? b : a; }).value;
    }
  };

  /**
   * v0.9.3 舊存檔的聲音設定：語速沒有新欄位時，原本是預設的 1 倍 → 改成新的預設「稍快」；
   * 家長原本選過別的語速就保留（不在選項裡的改成最接近的選項，例如 0.8 → 0.9）。音量一律從「中」開始（老闆指定預設值）。
   */
  function migrateAudio(settings) {
    if (!settings || typeof settings !== 'object') return;
    if (!('voiceSpeed' in settings)) {
      var r = Number(settings.voiceRate);
      settings.voiceSpeed = r > 0 && r !== 1 ? AUDIO.nearestSpeed(r) : AUDIO.SPEED_DEFAULT;   // 舊的 0.8 → 慢 0.9
    } else {
      var cur = Number(settings.voiceSpeed);
      if (AUDIO.SPEEDS.every(function (o) { return o.value !== cur; })) settings.voiceSpeed = AUDIO.nearestSpeed(cur);
    }
  }

  function createNewState(name, gender, now) {
    return {
      version: SCHEMA_VERSION,
      createdAt: now || 0,
      player: {
        name: cleanName(name), gender: cleanGender(gender),
        level: 1, exp: 0, totalExp: 0, coins: 30, job: 'novice', hp: -1, mp: -1,   // hp/mp = -1 代表「補滿」
        title: '',                                                                  // 怪物名冊拿到的稱號（顯示在名字旁）
        pendingExp: 0,                                                              // v0.7 戰鬥中答對、還沒結算的經驗值（v0.9.3 起只剩舊存檔會有；讀檔時結算）
        pendingDaily: 0,                                                            // v0.9.3 戰鬥中完成每日小任務、還沒給的金幣（戰鬥結束或下次讀檔時結算）
        // v1.0 第一批（48 號 2.4、F9）：每個職業分開記等級；保底；技能欄（null＝最新學會的 4 個）
        jobs: { novice: { lv: 1, exp: 0 } }, floor: {}, skillSlots: null
      },
      trialLog: [],               // v1.0 立志小考紀錄（家長報表；最多 30 筆）
      trial: {},                  // v1.0 立志小考 { 職業id: { lastFailDate, tries, lastQ:[題目id], inProgress, passedAt } }
      inventory: { herb: 2, eraser: 1, guide: 1, snack: 1 },
      startItems: { herb: 2, eraser: 1, guide: 1, snack: 1 },   // v0.9.2 建立角色時一開始給的（不能賣）；舊存檔沒有這筆時補上同樣的初始配置
      equipment: { weapon: null, armor: null },
      pet: { hearts: 0, fed: 0 },
      lights: emptyBySubject(function () { return false; }),  // 從頭目拿回的五道光
      lamps: emptyBySubject(function () { return false; }),   // 起點村子點亮的五盞知識燈
      stickers: [],
      story: ['intro'],
      activeQuest: null,          // v0.1 單地圖委託（保留給練習模式）
      quests: {},                 // v0.2 委託：{ id: {status:'active'|'done', progress:n} }
      chests: {},                 // 已打開的寶箱 {id:true}
      bosses: {},                 // 已淨化的頭目 {monsterId:true}
      location: null,             // {map, x, y}
      lastInn: null,              // 最近去過的旅店 {map, x, y}
      mapDims: {},                // v0.5：存檔時每張地圖的尺寸 {地圖id:[欄,列]}；地圖放大後讀檔用來換算 location、lastInn
      visited: {},
      qhist: {},                  // 每科最近 80 題的出題紀錄（最近最少出現優先）
      bestiary: {},               // 怪物名冊 { 怪物id: {seen, defeated} }
      bestiaryClaims: {},         // 名冊獎勵領過了 { 獎勵id: true }
      titles: [],                 // 拿到的稱號
      pendingVariant: null,       // 待補回的一半 經驗值（ADR-005）
      answered: {},               // {questionId: true} 曾經答對過
      recentQ: [],                // v0.7.2 最近答過的題目 ID（最多 10 題，回饋「題目有錯」用）
      stats: { subjects: emptyBySubject(function () { return { done: 0, firstTry: 0, submissions: 0 }; }), units: {}, battles: { won: 0, fled: 0, ko: 0 } },
      adaptive: Adaptive.createState(),
      daily: Daily.create(),
      playtime: Playtime.create(),
      settings: { dailyLimitMin: Playtime.DEFAULT_LIMIT, tts: true, sound: true, answerTime: 'standard', touchControls: 'auto', taigiSub: 'both',
        voiceAuto: true, voiceVolume: 0.9, voiceRate: 1, voiceLang: 'taigi', voiceCloud: true, music: true, musicVolume: 0.55,
        // v0.9.3（老闆 2026-10-10）：語速預設「稍快」（舊的 1 倍 × 1.15）；音樂、語音音量改成 小／中／大，預設都是「中」；可以選語音（'' = 依角色自動挑）
        voiceSpeed: AUDIO.SPEED_DEFAULT, voiceVol: 'mid', musicVol: 'mid', voiceName: '',
        reduceMotion: 'auto' },   // v1.0 技能特效：'auto' 跟裝置的 prefers-reduced-motion、'on' 只顯示數字、'off' 一律播放
      chapter: 0,                 // v1.1 完成到第幾章（Q_LAMPS_3 chapter_end: 1 → 1；之後章節用）
      proverbs: { got: {}, quiz: {} },   // v1.3.1 台語氣象諺語：收集到的諺語、答對的挑錯關卡（一般欄位，不升 schema）
      legacyM05: false,           // v1.3 舊紅樹林旗標（62 號 5.4；只有 Ch3Migrate 會設成 true，Q_GNO_4 完成時關掉）
      ending: false
    };
  }

  /**
   * 「字典」型欄位：鍵是動態的（道具 id、委託 id…），存檔裡有就整個以存檔為準，不逐鍵補預設值。
   * 根因（審查 F-06）：inventory 的預設是 {herb:2, eraser:1, guide:1, snack:1}，而 removeItem 用完時會刪掉該鍵，
   * 以前逐鍵補預設值會讓用完的道具在讀檔後「長回來」。
   */
  var DICT_KEYS = ['inventory', 'quests', 'chests', 'bosses', 'visited', 'answered', 'qhist', 'bestiary', 'bestiaryClaims', 'mapDims', 'startItems', 'player.jobs', 'player.floor', 'trial', 'proverbs.got', 'proverbs.quiz'];

  /** 以預設值補齊缺漏欄位（舊存檔、匯入存檔用），不覆蓋已有的值；字典型欄位只在整個不存在時才補 */
  function fillDefaults(target, defaults, path) {
    Object.keys(defaults).forEach(function (k) {
      var dv = defaults[k];
      var p = path ? path + '.' + k : k;
      if (!(k in target) || target[k] === undefined) {
        target[k] = dv && typeof dv === 'object' ? JSON.parse(JSON.stringify(dv)) : dv;
      } else if (DICT_KEYS.indexOf(p) < 0 && dv && typeof dv === 'object' && !Array.isArray(dv) && target[k] && typeof target[k] === 'object' && !Array.isArray(target[k])) {
        fillDefaults(target[k], dv, p);
      }
    });
    return target;
  }

  /**
   * v0.9.2 一開始給的道具記錄（startItems）不會比背包裡現有的多：道具用掉時先算用掉一開始給的，
   * 所以用完之後再買、再拿到的同名道具都可以賣。id 不給就整份檢查（讀舊存檔時用）。
   */
  function trimStart(state, id) {
    var s = state && state.startItems, inv = (state && state.inventory) || {};
    if (!s || typeof s !== 'object') return;
    (id ? [id] : Object.keys(s)).forEach(function (k) {
      if (!(k in s)) return;
      var n = Math.min(Number(s[k]) || 0, Number(inv[k]) || 0);
      if (n > 0) s[k] = n; else delete s[k];
    });
  }

  var State = { AUDIO: AUDIO, migrateAudio: migrateAudio, trimStart: trimStart, SCHEMA_VERSION: SCHEMA_VERSION, SUBJECTS: SUBJECTS, NAME_MAX: NAME_MAX, ANSWER_TIME_MODES: ANSWER_TIME_MODES, cleanName: cleanName, cleanGender: cleanGender, createNewState: createNewState, fillDefaults: fillDefaults, DICT_KEYS: DICT_KEYS };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.State = State; }
  if (typeof module !== 'undefined') module.exports = State;
})();
