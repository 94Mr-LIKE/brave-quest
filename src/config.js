/*
 * 遊戲設定常數（可調參數集中在這裡）
 * 改這裡的數字不需要動其他程式；node 測試也讀這份。
 */
(function () {
  'use strict';
  var CONFIG = {
    GAME_TITLE: '勇者大冒險',

    // 畫面：邏輯格子 32px、內部解析度 640×360（16:9）
    TILE: 32,
    VIEW_W: 640,
    VIEW_H: 360,

    // 地圖上角色的顯示高度（sprites.js 有 mapH 時以 sprites.js 為準）
    MAP_MONSTER_H: 40,     // 一般怪物在地圖上的高度（戰鬥圖約 96px，地圖上縮到約 40px）
    MAP_BOSS_H: 64,        // 頭目在地圖上的高度（戰鬥圖約 160px）
    STEP_MS: 210,          // 走一格的時間（毫秒）

    // 戰鬥
    BOSS_DAMAGE_MULT: 1.3,
    // 戰鬥背景：maps.js 的 battle_bg 若對得到 assets/battle/bb_<名稱>.png 就用它；否則用這張「地圖 ID → 戰鬥背景」對照表
    BATTLE_BG_BY_MAP: { M01: 'harbor', M02: 'grass', M03: 'volcano', M04: 'forest', M05: 'swamp', M06: 'cave', M07: 'cave', M08: 'badlands', M09: 'town', M10: 'castle', M11: 'castle' },
    // 舊名稱 → 現有的戰鬥背景
    BATTLE_BG_ALIAS: { rock: 'badlands', castle_top: 'castle', field: 'grass', village: 'harbor', hill: 'badlands' }, // 頭目戰時主角傷害倍率（頭目戰後段偏長，用這個縮短；1 = 不加成）
    MONSTER_RESPAWN_MS: 30000,

    // 虛擬搖桿
    JOYSTICK_SIZE: 150,    // 搖桿底座直徑（px，CSS 像素）
    JOYSTICK_DEADZONE: 0.25, // 拖不到這個比例不會走
    TOUCH_BUTTON_SIZE: 76  // A/B 鍵直徑（至少 64px）
  };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.CONFIG = CONFIG; }
  if (typeof module !== 'undefined') module.exports = CONFIG;
})();
