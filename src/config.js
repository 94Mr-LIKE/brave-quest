/*
 * 遊戲設定常數（可調參數集中在這裡）
 * 改這裡的數字不需要動其他程式；node 測試也讀這份。
 */
(function () {
  'use strict';
  var CONFIG = {
    GAME_TITLE: '勇者大冒險',
    VERSION_LABEL: 'v1.4',   // v1.4 桃竹章（之前是 v1.3.1）   // v1.3.1 台語氣象諺語（之前是 'v1.3'）   // v1.3 台北章（之前是 VERSION_LABEL: 'v1.2', 第二章）   // 給人看的版本（設定頁「關於本遊戲」）；網址快取用的版本號是 data/version.js 的 JQ_VERSION（內容雜湊）

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
    BATTLE_BG_BY_MAP: { M15: 'reservoir', M16: 'windcity', M52: 'tea', M13: 'tea', M12: 'city', M53: 'hotspring', M54: 'city', M01: 'harbor', M02: 'grass', M03: 'volcano', M04: 'forest', M05: 'swamp', M06: 'cave', M07: 'cave', M08: 'badlands', M09: 'town', M10: 'castle', M11: 'castle', MT1: 'town', M46: 'grass', M47: 'harbor', M48: 'mine', M49: 'coast', M14: 'coast', M50: 'paddy', M51: 'coldspring' },   // v0.9.5 MT1 慈護宮正殿：沒有怪物、不會遇敵（地圖組建議 town）；v1.1 第一章（59 號 4.6 ④）竹子湖 grass、基隆港 harbor、金瓜石 mine（2026-10-24 美術交 bb_mine 礦坑，原本暫用 cave）；v1.2 第二章戰鬥背景（美術 2026-10-24 交件）：草嶺古道、頭城礁溪 coast，三星 paddy，蘇澳南方澳 coldspring；v1.3 台北章戰鬥背景（美術 2026-10-24 交 bb_tea、bb_hotspring、bb_city）：坪林、貓空 tea，台北城、信義 city，北投 hotspring
    // 注意：maps.js 的 battle_bg 比這張表優先（G.battleBgFor：怪物 battle_bg → 地圖 battle_bg → 這張表）。M01 地圖是 grass，所以迷霧章魚在 monsters.js 指定 battle_bg: "harbor"
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
