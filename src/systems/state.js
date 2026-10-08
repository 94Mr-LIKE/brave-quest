/* 遊戲狀態（存檔內容）的結構定義與建立 — schema v2（v0.2 多地圖冒險） */
(function () {
  'use strict';
  var isNode = typeof module !== 'undefined' && typeof require === 'function';
  var Adaptive = isNode ? require('./adaptive.js') : window.JQ.Adaptive;
  var Daily = isNode ? require('./daily.js') : window.JQ.Daily;
  var Playtime = isNode ? require('./playtime.js') : window.JQ.Playtime;

  var SCHEMA_VERSION = 2;
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

  function createNewState(name, gender, now) {
    return {
      version: SCHEMA_VERSION,
      createdAt: now || 0,
      player: {
        name: cleanName(name), gender: cleanGender(gender),
        level: 1, exp: 0, totalExp: 0, coins: 30, job: 'novice', hp: -1, mp: -1,   // hp/mp = -1 代表「補滿」
        title: '',                                                                  // 怪物名冊拿到的稱號（顯示在名字旁）
        pendingExp: 0                                                               // v0.7 戰鬥中答對、還沒結算的經驗值（戰鬥結束或下次讀檔時結算）
      },
      inventory: { herb: 2, eraser: 1, guide: 1, snack: 1 },
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
        voiceAuto: true, voiceVolume: 0.9, voiceRate: 1, voiceLang: 'taigi', voiceCloud: true, music: true, musicVolume: 0.55 },
      ending: false
    };
  }

  /**
   * 「字典」型欄位：鍵是動態的（道具 id、委託 id…），存檔裡有就整個以存檔為準，不逐鍵補預設值。
   * 根因（審查 F-06）：inventory 的預設是 {herb:2, eraser:1, guide:1, snack:1}，而 removeItem 用完時會刪掉該鍵，
   * 以前逐鍵補預設值會讓用完的道具在讀檔後「長回來」。
   */
  var DICT_KEYS = ['inventory', 'quests', 'chests', 'bosses', 'visited', 'answered', 'qhist', 'bestiary', 'bestiaryClaims', 'mapDims'];

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

  var State = { SCHEMA_VERSION: SCHEMA_VERSION, SUBJECTS: SUBJECTS, NAME_MAX: NAME_MAX, ANSWER_TIME_MODES: ANSWER_TIME_MODES, cleanName: cleanName, cleanGender: cleanGender, createNewState: createNewState, fillDefaults: fillDefaults, DICT_KEYS: DICT_KEYS };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.State = State; }
  if (typeof module !== 'undefined') module.exports = State;
})();
