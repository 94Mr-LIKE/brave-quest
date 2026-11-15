/*
 * 地圖上的輔助計算（v0.4）：上層格（前景）、招牌位置、背景音樂、怪物遊走目標、寵物站位、燈光位置；v0.9.5 地標、放大地圖點選
 * 純計算，可以在 node 測試。
 */
(function () {
  'use strict';
  var isNode = typeof module !== 'undefined' && typeof require === 'function';
  var World = isNode ? require('./world.js') : window.JQ.World;

  // ---------------------------------------------------------------- 上層格（DQ6 式前景）
  /**
   * tilesets.js 裡 upper:true 的字元（目前是 'U'）：可以走，但背景圖這一格要畫在角色上方。
   * 回傳 { cells:[{x,y}], set:{ "x,y": true } }
   */
  function upperCells(map, tilesets) {
    var set = {}, cells = [];
    var ts = tilesets[map.tileset] || {};
    (map.grid || []).forEach(function (row, y) {
      for (var x = 0; x < row.length; x++) {
        var d = ts[row.charAt(x)];
        if (d && d.upper) { set[x + ',' + y] = true; cells.push({ x: x, y: y }); }
      }
    });
    return { cells: cells, set: set };
  }

  /** 一個矩形（像素）有沒有碰到前景格。tile＝每格幾像素 */
  function rectHitsCells(rect, set, tile) {
    var x0 = Math.floor(rect.x / tile), x1 = Math.floor((rect.x + rect.w - 1) / tile);
    var y0 = Math.floor(rect.y / tile), y1 = Math.floor((rect.y + rect.h - 1) / tile);
    for (var y = y0; y <= y1; y++) for (var x = x0; x <= x1; x++) if (set[x + ',' + y]) return true;
    return false;
  }

  // ---------------------------------------------------------------- 招牌
  // v4.2 4c：雲上小舖招牌照賣的東西（晨光雲衣、星光劍、曙光之鎧）
  // v4.2.2：台北城三家店（item/weapon/armor_taipei）、基隆廟口與宜蘭老街的道具攤以前沒有對應，都退回「雜貨」的籃子圖（舊錯）
  var SIGN_KIND = { general: 'general', item: 'item', weapon: 'weapon', armor: 'armor', inn: 'inn', cloud_m42: 'armor', cloud_m43: 'weapon', cloud_m44: 'armor',
    item_taipei: 'item', weapon_taipei: 'weapon', armor_taipei: 'armor', item_keelung: 'item', item_yilan: 'item',
    ice_gi: 'ice' };   // v4.2.3：綠島冰店改用剉冰招牌 sign_ice（以前退回「雜貨」的籃子圖）
  var SIGN_TEXT = { general: '雜貨', item: '道具', weapon: '武器', armor: '防具', inn: '旅店', ice: '冰店' };

  /**
   * v4.2.2 匾額位置表（老闆 2026-11-14「招牌通通掛在房屋上面當匾額」）：每一家店都看過背景圖，指定招牌掛在它那棟房子的哪裡。
   * SIGN_PLAQUES[地圖][shop_id 或 'inn'] =
   *   { x, y, on }：招牌「底部中心」在 (x·32+16, (y+1)·32) 像素（x、y 可以有小數，用來對準門楣、雨棚）；on＝掛在什麼上面
   *   { hide }：背景本來就畫了這家店的招牌（不畫程式招牌，免得兩塊疊在一起）；hide＝背景畫的是什麼
   *   open：露天攤、旁邊沒有房子（雲上小舖），格子檢查不要求落在建築格上；待老闆確認
   * 檢查：tests/validate_world.js「招牌掛在房子上」（每家都要有、不碰角色、落在不可走的建築格上）。
   * 背景是 docs/assets/maps/bg_Mxx.webp（每格 32 像素），選位時逐家看圖；總覽在 招牌匾額_總覽_第N頁.png。
   */
  var SIGN_PLAQUES = {
    M01: { general: { x: 31, y: 31, on: '店面招牌橫木（紅瓦屋簷下）' }, inn: { x: 84, y: 14, on: '溫泉旅館屋簷下橫樑' } },
    M04: { inn: { x: 22.5, y: 3.9, on: '樹屋小屋正面木牆（圓窗上方）' } },
    M05: { inn: { x: 81.5, y: 5, on: '旅舍門楣（屋簷下）' } },
    M07: { inn: { x: 30.5, y: 9.5, on: '圓石屋門上方（茅草屋簷下）' } },
    M08: { inn: { x: 67.2, y: 5.8, on: '營帳入口橫木上方' } },
    M09: { item: { x: 32.2, y: 14.5, on: '道具攤門上方屋簷' }, weapon: { hide: '背景已畫劍的招牌板' }, armor: { hide: '背景已畫盾的招牌板' },
      inn: { x: 7.5, y: 5.6, on: '民宿門楣雕花橫板' } },
    M10: { inn: { x: 51, y: 25.3, on: '客棧門楣（背景圓形碗招牌左邊）' } },
    M47: { item_keelung: { x: 41.9, y: 34.75, on: '廟口攤位的綠色棚子' }, inn: { x: 53.5, y: 32, on: '旅店門上方黃色雨棚' } },
    M48: { inn: { x: 15, y: 6.3, on: '宿舍門廊小屋頂' } },
    M14: { item_yilan: { x: 30, y: 8, on: '老街店面拱門上方牆面' }, inn: { x: 21.5, y: 36.4, on: '溫泉旅館右翼一樓屋簷' } },
    M50: { inn: { x: 31.6, y: 8.9, on: '民宿門楣' } },
    M51: { inn: { x: 49, y: 6.5, on: '冷泉旅館門上方屋簷' } },
    M13: { inn: { x: 16.9, y: 34, on: '茶館暖簾上方橫樑' } },
    M12: { item_taipei: { hide: '背景已畫藥水的招牌板' }, weapon_taipei: { hide: '背景已畫劍的招牌板' }, armor_taipei: { hide: '背景已畫盾的招牌板' },
      inn: { x: 29.7, y: 25.2, on: '旅館門廊雨棚' } },
    M53: { inn: { x: 55.5, y: 33, on: '溫泉旅館暖簾上方屋簷' } },
    M54: { inn: { x: 22, y: 46, on: '旅館入口玻璃雨棚' } },
    M15: { inn: { x: 79.6, y: 33, on: '旅店拱門上方簷口' } },
    M16: { inn: { x: 12, y: 15, on: '旅店門楣（紫色門簾處）' } },
    M17: { inn: { x: 36.1, y: 40, on: '民宿門上方一樓屋簷' } },
    M18: { inn: { x: 23.9, y: 14.6, on: '旅店門上方紅色雨棚' } },
    M19: { inn: { x: 52.5, y: 28, on: '客棧木製雨棚' } },
    M20: { inn: { x: 61.5, y: 29.2, on: '旅店門上方屋簷' } },
    M21: { inn: { x: 90, y: 41.8, on: '客棧門楣（獅頭裝飾下方）' } },
    M22: { inn: { x: 88, y: 32.3, on: '民宿門上方屋簷' } },
    M23: { inn: { x: 52.5, y: 29.6, on: '民宿門上方屋簷' } },
    M24: { inn: { x: 22.5, y: 17, on: '民宿門上方屋簷' } },
    M25: { inn: { x: 44.85, y: 54, on: '旅店門廊屋頂' } },
    M26: { inn: { x: 58.5, y: 37.5, on: '民宿門廊山牆' } },
    M27: { ice_gi: { x: 25.75, y: 30, on: '冰店門右邊牆面（掛勾招牌）' }, inn: { x: 44.75, y: 31, on: '民宿門上方屋簷' } },
    M28: { inn: { x: 33.5, y: 34.4, on: '民宿門上方屋頂邊緣' } },
    M29: { mochi_hl: { hide: '背景已畫麻糬的招牌板' }, inn: { x: 65.5, y: 48, on: '旅店門廊屋頂' } },
    M30: { inn: { x: 29, y: 23, on: '旅店屋簷下木牆' } },
    M31: { inn: { x: 63.9, y: 34, on: '旅店門上方一樓屋簷' } },
    M32: { inn: { x: 69, y: 34.3, on: '老闆右手邊那棟旅店的木牆（紅燈籠下）' } },
    M33: { inn: { x: 44.1, y: 33.4, on: '山屋門上方屋簷' } },
    M35: { inn: { x: 23, y: 14, on: '山莊入口雨棚' } },
    M42: { cloud_m42: { x: 25.7, y: 39, open: true, on: '雲上露天攤（沒有房子），立在店主人左邊' } },
    M43: { cloud_m43: { x: 24.7, y: 41, open: true, on: '雲上露天攤（沒有房子），立在店主人左邊' } },
    M44: { cloud_m44: { x: 26.3, y: 32, open: true, on: '雲上露天攤（沒有房子），立在店主人右邊' } }
  };

  /**
   * 每間店、旅店的招牌位置。回傳 [{kind, text, custom, x, y, npcX, npcY, onDoor, hidden, on, open, fromTable}]
   * 1. mapId 有在 SIGN_PLAQUES 指定 → 照表（hidden：背景已有招牌，不畫）。
   * 2. 沒有指定 → 規則「掛在房子上」：從店主人附近（2 格內）最近的門 'D' 往上找第一格牆（不能走的格子），掛在那一格；
   *    沒有門就從店主人那一直行（再來是左右各一行）往上找，跳過頭會碰到的那一格（店主人上一格），掛在第一格牆上。
   *    3 格內都找不到牆才退回店主人上方 2 格（不會壓到 50 像素高的頭）。
   * v4.2.2 沿革：以前沒有門時掛在店主人頭上 1 格（被頭蓋住），11-13 改 2 格（懸在路上），11-14 老闆要求全部掛在房子上。
   */
  var SIGN_ABOVE_KEEPER = 2;   // 3 格內找不到牆時的最後退路：店主人上方 2 格（上一格會被 50 像素高的頭蓋住）
  var WALL_CHARS = 'HRK#T';   // 牆、屋頂、櫃台／攤位、石牆、樹（maps.js 圖例裡不能走、屬於房子或攤位的格子）
  function isWall(map, x, y) { var ch = World.charAt(map, x, y); return !!ch && WALL_CHARS.indexOf(ch) >= 0; }
  function ruleSpot(map, s) {
    var best = null, bestD = 99;
    for (var dy = -2; dy <= 2; dy++) for (var dx = -2; dx <= 2; dx++) {
      if (World.charAt(map, s.x + dx, s.y + dy) !== 'D') continue;
      var d = Math.abs(dx) * 1.5 + Math.abs(dy);   // 同一直行的門優先
      if (d < bestD) { bestD = d; best = { x: s.x + dx, y: s.y + dy }; }
    }
    var cols = best ? [best.x] : [s.x, s.x - 1, s.x + 1];
    var from = best ? best.y - 1 : s.y - SIGN_ABOVE_KEEPER;   // 沒有門：店主人上一格會被頭蓋住，從上兩格開始
    for (var c = 0; c < cols.length; c++) for (var y = from; y >= Math.max(0, from - 2); y--) {
      if (isWall(map, cols[c], y)) return { x: cols[c], y: y, onDoor: !!best, onWall: true };
    }
    return best ? { x: best.x, y: Math.max(0, best.y - 1), onDoor: true, onWall: false } : { x: s.x, y: Math.max(0, s.y - SIGN_ABOVE_KEEPER), onDoor: false, onWall: false };
  }
  function signSpots(map, mapId) {
    var shops = [];
    if (map.shop) shops.push({ id: map.shop.shop_id, kind: SIGN_KIND[map.shop.shop_id] || 'general', x: map.shop.x, y: map.shop.y });
    (map.extra_shops || []).forEach(function (s) { shops.push({ id: s.shop_id, kind: SIGN_KIND[s.shop_id] || 'general', x: s.x, y: s.y }); });
    if (map.inn) shops.push({ id: 'inn', kind: 'inn', x: map.inn.x, y: map.inn.y, text: map.inn.sign || null });   // v0.9.3 B14 各地旅店的招牌字
    var table = (mapId && SIGN_PLAQUES[mapId]) || {};
    return shops.map(function (s) {
      var base = { kind: s.kind, shopId: s.id, text: s.text || SIGN_TEXT[s.kind], custom: !!s.text, npcX: s.x, npcY: s.y };
      var p = table[s.id];
      if (p && p.hide) return Object.assign(base, { x: s.x, y: Math.max(0, s.y - 2), onDoor: false, hidden: true, hide: p.hide, fromTable: true });
      if (p) return Object.assign(base, { x: p.x, y: p.y, onDoor: false, on: p.on || '', open: !!p.open, fromTable: true });
      var r = ruleSpot(map, s);
      return Object.assign(base, { x: r.x, y: r.y, onDoor: r.onDoor, onWall: r.onWall, fromTable: false });
    });
  }

  /**
   * v4.2.3 招牌鏡頭（老闆 2026-11-15 選 B「靠近店家時鏡頭往上移」；實玩 DEF-02：匾額掛上屋簷後，講話時常被上方狀態列蓋住）。
   * 做法和慈護宮的 shrineCamera 一樣（鏡頭 followOffset 往上），MapScene.shrineCamera 取兩者較大的偏移。
   * 觸發範圍（格）：店主人左右 3 格、上 1 下 4 格（站在店主人面前講話），或匾額左右 3 格、往下 6 格（走近店門）。
   * 已經在範圍裡的那一塊，離開時範圍多放寬 KEEP 格：在邊緣來回走不會一開一關（鏡頭不抖）。
   */
  var SIGN_CAM = { NEAR_X: 3, KEEPER_UP: 1, KEEPER_DOWN: 4, PLAQUE_DOWN: 6, KEEP: 1, MARGIN: 6, FOOT: 8 };
  function signCamNear(s, tx, ty, pad) {
    var nearKeeper = Math.abs(tx - s.npcX) <= SIGN_CAM.NEAR_X + pad && ty >= s.npcY - SIGN_CAM.KEEPER_UP - pad && ty <= s.npcY + SIGN_CAM.KEEPER_DOWN + pad;
    var py = Math.floor(s.y);
    var nearPlaque = Math.abs(tx - s.x) <= SIGN_CAM.NEAR_X + pad && ty >= py - pad && ty <= py + SIGN_CAM.PLAQUE_DOWN + pad;
    return nearKeeper || nearPlaque;
  }
  /** spots＝[{ x, y, npcX, npcY, … }]（MapScene 傳畫出來的匾額；背景已畫招牌的不傳）。prev＝上一次選到的那一塊（同一個物件）。回傳靠近的那一塊或 null */
  function signCamPick(spots, tx, ty, prev) {
    if (!Array.isArray(spots) || !spots.length) return null;
    if (prev && spots.indexOf(prev) >= 0 && signCamNear(prev, tx, ty, SIGN_CAM.KEEP)) return prev;
    var best = null, bd = 1e9;
    spots.forEach(function (s) {
      if (!signCamNear(s, tx, ty, 0)) return;
      var d = Math.abs(tx - s.npcX) + Math.abs(ty - s.npcY);
      if (d < bd) { bd = d; best = s; }
    });
    return best;
  }
  /**
   * 鏡頭要往上移多少（世界像素，0＝不移；正值＝鏡頭往上，和 Phaser followOffset.y 同方向）。
   * o＝{ signTop：匾額上緣 y，playerY：主角腳底 y，targetY：鏡頭目標 y，viewH：畫面高（世界像素），mapH：地圖高，
   *      hudH：上方狀態列佔掉的高度，bottomH：下方對話框佔掉的高度（沒有對話框時 0） }
   * 想要的鏡頭上緣＝匾額上緣－狀態列－MARGIN；但主角的腳要留在對話框（或畫面下緣）上面 FOOT 像素，也不超出地圖上緣（不露黑邊）。
   * 鏡頭本來就夠高（含被地圖下緣夾住的情形）就不移。
   */
  function signCamOffset(o) {
    if (!o || !(o.viewH > 0)) return 0;
    var raw = o.targetY - o.viewH / 2;
    var base = Math.max(0, Math.min(raw, Math.max(0, (o.mapH || 0) - o.viewH)));   // 現在的鏡頭上緣（Phaser setBounds 夾過）
    var want = Math.max(o.signTop - (o.hudH || 0) - SIGN_CAM.MARGIN, o.playerY - o.viewH + (o.bottomH || 0) + SIGN_CAM.FOOT, 0);
    if (!(want < base)) return 0;
    return Math.round((raw - want) * 10) / 10;
  }
  /** 每一幀往目標偏移靠近：一般每幀走 15%（和慈護宮一樣），差 0.5 像素內直接到；減少動態時直接切換 */
  function camEase(cur, want, reduce) {
    if (reduce || Math.abs(cur - want) <= 0.5) return want;
    return cur + (want - cur) * 0.15;
  }

  // ---------------------------------------------------------------- 建議等級（v0.9.3，37_現行版等級與怪物數值調整.md 第 3 節）
  /** maps.js 有 rec_level: [低, 高] 就用它；沒有時用這張表（金包里沒有野怪，不標） */
  // v1.1 第一章（59 號 2.6 節）：M06 11–14→5–8、M07 12–14→6–8、M09 6–9→9–10。新地圖 M46 4–6、M47 8–9、M48 10–11 等地圖交件後加（本表的地圖都要存在）
  var REC_LEVEL = { M02: [1, 4], M03: [3, 6], M04: [26, 28], M09: [9, 10], M05: [13, 14], M06: [5, 8], M07: [6, 8], M08: [31, 34], M10: [27, 28], M11: [29, 31], M46: [4, 6], M47: [8, 9], M48: [10, 11], M49: [8, 9], M14: [9, 10], M50: [10, 11], M51: [11, 12], M52: [11, 12], M13: [12, 13], M53: [13, 14], M54: [12, 13], M15: [14, 16], M16: [16, 17], M17: [17, 19], M18: [19, 22], M19: [22, 24], M20: [24, 27], M21: [28, 30], M22: [30, 31], M23: [34, 36], M25: [36, 40], M26: [40, 43], M29: [43, 47], M30: [47, 51], M31: [47, 51], M32: [47, 51] };   /* v3.0 南部（70 號 2.11，轉職後等級；M04、M08、M10、M11 搬到南部） */   /* v2.0 中部（69 號 2.6，轉職後等級） */   /* v1.4 桃竹章（63 號 2.4：轉職後的等級） */   /* v1.3 台北章（62 號 2.8；M12 城裡不出怪不標；M05 紅樹林 9–12 → 13–14） */   /* v1.2 第二章（61 號 2.6：顯示轉職後的等級） */   // v1.1 地圖組：M46 竹子湖 4–6、M47 基隆港 8–9、M48 金瓜石 10–11（59 號 2.6）
  /** v1.3（62 號 5.4）舊紅樹林旗標：v1.3 前就在做地精鏈的孩子，紅樹林照 v1.2 顯示 Lv9–12（瀏覽器裡才看得到存檔；node 測試直接測 Ch3Migrate.legacyRec） */
  function legacyRec(map, mapId) {
    var J3 = typeof window !== 'undefined' && window.JQ && window.JQ.Ch3Migrate, G3 = typeof window !== 'undefined' && window.JQ && window.JQ.Game;
    var JS = typeof window !== 'undefined' && window.JQ && window.JQ.SouthMigrate, mid = mapId || (map && map.id);
    var r3 = J3 && G3 && G3.state ? J3.legacyRec(G3.state, mid) : null;
    return r3 || (JS && G3 && G3.state ? JS.legacyRec(G3.state, mid) : null);   // v3.0 舊南部旗標：M04、M08、M10、M11 照 v1.3 顯示
  }
  function recLevel(map, mapId) {
    var lg = legacyRec(map, mapId);
    if (lg) return lg;
    var r = map && Array.isArray(map.rec_level) && map.rec_level.length === 2 ? map.rec_level : REC_LEVEL[mapId || (map && map.id)];
    return r ? [Number(r[0]), Number(r[1])] : null;
  }
  /** 「Lv1–4」；沒有建議等級時 '' */
  function levelText(map, mapId) {
    var r = recLevel(map, mapId);
    return r ? 'Lv' + r[0] + (r[1] !== r[0] ? '–' + r[1] : '') : '';
  }
  /** 地圖名稱＋建議等級：「擎天草原 Lv1–4」 */
  function nameWithLevel(map, mapId) {
    var lt = levelText(map, mapId), name = (map && map.name) || mapId || '';
    return lt ? name + ' ' + lt : name;
  }

  // ---------------------------------------------------------------- 會走動的動物 NPC（v0.9.3 框架；v0.9.4 老闆選 D2-a：擎天崗的水牛）
  /**
   * maps.js 的 animals: [{ id, sprite（預設 npc_buffalo）, area: [x, y, w, h], count, name（預設「水牛」）, say（預設見 ANIMAL_SAY）}]
   * 不能戰鬥；在 area 裡「可走、不是出口、不是上層格 U」的格子上慢慢走。
   */
  var ANIMAL_SAY = '哞～（野生的水牛要保持 20 公尺喔！）';
  function animalSpecs(map) {
    return ((map && map.animals) || []).filter(function (a) { return a && Array.isArray(a.area) && a.area.length === 4; }).map(function (a, i) {
      var sprite = a.sprite || 'npc_buffalo';
      // dialog：面對動物按 A 時播的台詞（dialogs.js）；水牛預設 D_ANIMAL_BUFFALO。沒有台詞時用 say 這一句
      return { id: a.id || ('animal_' + i), sprite: sprite, area: a.area, count: Math.max(1, Math.min(6, a.count | 0 || 1)),
        name: a.name || '水牛', say: a.say || ANIMAL_SAY, dialog: a.dialog || (sprite === 'npc_buffalo' ? 'D_ANIMAL_BUFFALO' : null) };
    });
  }
  /** 動物可以站的格子。walk(x,y)：地圖可走；不含出口、上層格 U */
  function animalTiles(map, area, walk) {
    var out = [];
    for (var y = area[1]; y < area[1] + area[3]; y++) for (var x = area[0]; x < area[0] + area[2]; x++) {
      if (walk(x, y) && !World.exitAt(map, x, y) && World.charAt(map, x, y) !== 'U') out.push({ x: x, y: y });
    }
    return out;
  }
  /** 被主角碰到時要走開：挑離主角最遠的幾格之一（rng 0～1） */
  function awayTarget(tiles, from, player, rng) {
    if (!tiles.length) return null;
    var d = function (t) { return Math.abs(t.x - player.x) + Math.abs(t.y - player.y); };
    var sorted = tiles.filter(function (t) { return t.x !== from.x || t.y !== from.y; }).sort(function (a, b) { return d(b) - d(a); });
    var top = sorted.slice(0, Math.max(1, Math.ceil(sorted.length / 4)));
    return top[Math.floor((rng || Math.random)() * top.length)] || null;
  }

  // ---------------------------------------------------------------- 旅店（v0.9.3 B14 各地旅店不一樣）
  /**
   * 旅店老闆說的台詞 ID：maps.js 的 inn.dialog；沒有設定時，站櫃 NPC 用自己的台詞，沒有 NPC 的旅店用 D_INN_IDLE
   */
  function innDialog(map, npc) {
    var inn = map && map.inn;
    if (inn && inn.dialog) return inn.dialog;
    if (npc && !npc.virtual && npc.dialog) return npc.dialog;
    return 'D_INN_IDLE';
  }
  /** 旅店老闆台詞的說話者（例：inn_shenmu）；找不到時 null */
  function innSpeaker(map, dialogs) {
    var lines = (dialogs || {})[innDialog(map, null)] || [];
    var who = lines.length && lines[0].who;
    return who && who !== 'narrator' && who !== 'pet' ? who : null;
  }
  /**
   * v0.9.4（老闆 2026-10-11：講台語的角色一律男性）沒有站櫃 NPC 的旅店（__inn 虛擬老闆）依老闆的性別選圖：
   *   女性（例：石屋客棧老闆娘）→ npc_innkeeper；男性 → npc_<說話者>_m（例：npc_inn_shenmu_m）→ npc_innkeeper_m → npc_innkeeper。
   * voices：window.VOICES；has(key)：sprites.js 有沒有這張圖
   */
  function innKeeperSprite(map, dialogs, voices, has) {
    return innSpeakerSprite(innSpeaker(map, dialogs), voices, has);
  }
  /** 旅店老闆說話者（inn_shenmu 等）的圖：女性用 npc_innkeeper；男性優先 npc_<說話者>_m，其次 npc_innkeeper_m（地圖上的老闆和對話框頭像共用這條規則） */
  function innSpeakerSprite(who, voices, has) {
    var v = who && voices && voices.speakers ? voices.speakers[who] : null;
    has = has || function () { return true; };
    var list = v && v.gender === 'f' ? ['npc_innkeeper'] : (who ? ['npc_' + who + '_m'] : []).concat(['npc_innkeeper_m', 'npc_innkeeper']);
    for (var i = 0; i < list.length; i++) if (has(list[i])) return list[i];
    return 'npc_innkeeper';
  }
  /**
   * 旅店老闆的稱呼：一律以 SPEAKERS 為準（例：「樹屋旅店老闆」，性別和聲音一致）；
   * 台詞的說話者不在 SPEAKERS 時才用「inn.name＋老闆」，再沒有就「旅店老闆」
   */
  function innKeeperName(map, dialogs, speakers) {
    var who = innSpeaker(map, dialogs);
    if (who && speakers && typeof speakers[who] === 'string' && speakers[who]) return speakers[who];
    var inn = map && map.inn;
    return (inn && inn.name ? inn.name : '旅店') + '老闆';
  }

  // ---------------------------------------------------------------- 背景音樂
  var MAP_BGM = ['village', 'field', 'forest', 'cave', 'town', 'castle'];
  var TILESET_BGM = { village: 'village', field: 'field', forest: 'forest', swamp: 'field', cave: 'cave', town: 'town', castle: 'castle' };

  /** 地圖的 BGM：maps.js 的 bgm 是這六種之一就用它，否則依圖塊組 */
  function bgmFor(map) {
    // v0.9.5 室內地圖（MT1 金包里慈護宮正殿）：用安靜的曲子（沿用現有的 forest「神祕、安靜」；maps.js 寫 castle 時用莊嚴的 castle）
    if (map && map.type === 'interior') return map.bgm === 'castle' ? 'castle' : 'forest';
    if (map && MAP_BGM.indexOf(map.bgm) >= 0) return map.bgm;
    return TILESET_BGM[map && map.tileset] || 'field';
  }

  /**
   * 戰鬥 BGM：最終頭目 final（五科輪流或最高等級地圖的頭目）、頭目 boss、其他 battle
   * v1.1：金脈鐵顎王是兩科（數學、自然）輪流的一般支線頭目，不算最終頭目（五科都有才算；也決定 game.js 的每日時間上限詢問）
   */
  function battleBgm(mon, map) {
    if (!mon || !mon.boss) return 'battle';
    // v2.0（69 號附錄 A4 建議 A）：最終頭目＝monsters.js 標 final: true，或五科輪流出題（final: false 可以明確排除）。不再看地圖等級——中部 M17–M20 是 level 5，
    //   迷路火車頭、燈籠霧將是章節頭目，不能播最終頭目音樂、也不跑每日時間檢查（game.js isFinalBoss 用同一個判斷）
    if (mon.final === true || (mon.final !== false && mon.subjects && mon.subjects.length >= 5)) return 'final';
    return 'boss';
  }

  // ---------------------------------------------------------------- 怪物遊走、寵物站位
  /** 在遊走範圍內挑一個目標格（盡量離目前位置 2 格以上，讓怪物走遍整個範圍） */
  function wanderTarget(tiles, from, rng) {
    rng = rng || Math.random;
    if (!tiles || !tiles.length) return null;
    var far = tiles.filter(function (t) { return Math.abs(t.x - from.x) + Math.abs(t.y - from.y) >= 2; });
    var pool = far.length ? far : tiles;
    return pool[Math.floor(rng() * pool.length)];
  }

  /** 寵物要停的格子：目標格能站就站，不能（障礙、NPC）就找最近的可站格 */
  function petSpot(walkable, cols, rows, target, from) {
    if (walkable(target.x, target.y)) return { x: target.x, y: target.y };
    var best = null, bestD = Infinity;
    for (var r = 1; r <= 3 && !best; r++) {
      for (var dy = -r; dy <= r; dy++) for (var dx = -r; dx <= r; dx++) {
        var x = target.x + dx, y = target.y + dy;
        if (x < 0 || y < 0 || x >= cols || y >= rows || !walkable(x, y)) continue;
        var d = Math.abs(dx) + Math.abs(dy) + (from ? 0.01 * (Math.abs(x - from.x) + Math.abs(y - from.y)) : 0);
        if (d < bestD) { bestD = d; best = { x: x, y: y }; }
      }
    }
    return best;
  }

  // ---------------------------------------------------------------- 燈光
  /**
   * 柔和圓形暖光的位置：maps.js 的 lights:[{x,y,r?}] 優先；
   * 沒寫時，洞窟裡的部落（type 'tribe'、tileset 'cave'，例如哥布林部落）在大型擺設 'K'（篝火、燈台）上加光。
   * 知識燈點亮後的光由程式另外加（lamps）。
   */
  /** 光暈顏色 '#rrggbb' → [r, g, b]；格式不對或沒給 → null（用原本的暖色） */
  function glowRgb(color) {
    var m = /^#?([0-9a-f]{6})$/i.exec(String(color || ''));
    if (!m) return null;
    var n = parseInt(m[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function lightSpots(map) {
    // v0.9.3：color（例：藍水晶 #a8dcff、紫水晶與祭壇 #a98bff）；沒寫 color 的維持暖色
    if (Array.isArray(map.lights)) return map.lights.map(function (l) { var o = { x: l.x, y: l.y, r: l.r || 1 }; if (glowRgb(l.color)) o.color = l.color; return o; });
    var out = [];
    if (map.type === 'tribe' && map.tileset === 'cave') {
      (map.grid || []).forEach(function (row, y) { for (var x = 0; x < row.length; x++) if (row.charAt(x) === 'K') out.push({ x: x, y: y, r: 1.2 }); });
    }
    return out;
  }

  // ---------------------------------------------------------------- 放大地圖（v0.5 試做：邊長 s 倍）
  /** 最近一格「能走、不是出口、沒被用過」的格子（由近到遠，最多找 radius 圈） */
  function snapCell(ok, x, y, radius) {
    for (var r = 0; r <= (radius || 8); r++) {
      var best = null, bestD = Infinity;
      for (var dy = -r; dy <= r; dy++) for (var dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r || !ok(x + dx, y + dy)) continue;
        var d = dx * dx + dy * dy;
        if (d < bestD) { bestD = d; best = { x: x + dx, y: y + dy }; }
      }
      if (best) return best;
    }
    return { x: x, y: y };
  }

  /**
   * 把小地圖的資料（出口、NPC、寶箱、燈、車站、旅店、商店、起點、怪物範圍、燈光）套到放大 s 倍的新格子上（不改原本的物件）。
   * 原本一格 → 新的 s×s 一塊；出口取那一塊落在地圖邊上的格子；其他東西放在那一塊的中心，不能站就找最近能站的格子。
   */
  function scaleMap(map, grid, s, tilesets) {
    var out = JSON.parse(JSON.stringify(map));
    out.grid = grid.slice();
    var w = grid[0].length, h = grid.length, c = Math.floor(s / 2);
    var walk = function (x, y) { return x >= 0 && y >= 0 && x < w && y < h && World.isWalkable(tilesets, out, x, y, null); };
    out.exits = [];
    (map.exits || []).forEach(function (e) {
      var cells = [];
      for (var j = 0; j < s; j++) for (var i = 0; i < s; i++) {
        var x = e.x * s + i, y = e.y * s + j;
        var edge = (e.x === 0 && x === 0) || (e.y === 0 && y === 0) || (x === w - 1 && e.x * s + s - 1 >= w - 1) || (y === h - 1 && e.y * s + s - 1 >= h - 1);
        if (edge && walk(x, y)) cells.push({ x: x, y: y });
      }
      if (!cells.length) cells.push(snapCell(walk, e.x * s + c, e.y * s + c));
      cells.forEach(function (p) { out.exits.push({ x: p.x, y: p.y, to: e.to, tx: e.tx, ty: e.ty }); });
    });
    var used = {};
    var free = function (x, y) { return walk(x, y) && !World.exitAt(out, x, y) && !used[x + ',' + y]; };
    var place = function (o) {
      if (!o || typeof o.x !== 'number') return;
      var p = snapCell(free, o.x * s + c, o.y * s + c);
      o.x = p.x; o.y = p.y; used[p.x + ',' + p.y] = true;
    };
    (out.npcs || []).forEach(place);
    (out.chests || []).forEach(place);
    (out.lamps || []).forEach(place);
    [out.station, out.start].forEach(place);
    // 旅店、商店的座標是站櫃 NPC 的位置：跟著同一個 NPC 走
    [out.inn, out.shop].concat(out.extra_shops || []).forEach(function (o) {
      if (!o || typeof o.x !== 'number') return;
      var npc = (out.npcs || []).filter(function (n) { return o.npc && n.id === o.npc; })[0];
      if (npc) { o.x = npc.x; o.y = npc.y; } else place(o);
    });
    (out.spawns || []).forEach(function (sp) { if (sp.area) sp.area = sp.area.map(function (v) { return v * s; }); });
    if (Array.isArray(out.lights)) out.lights.forEach(function (l) { l.x = l.x * s + c; l.y = l.y * s + c; });
    return out;
  }

  /** 別張地圖走進來的落點（tx,ty）換算到放大後的地圖 */
  function scalePoint(bigMap, x, y, s, tilesets) {
    var w = bigMap.grid[0].length, h = bigMap.grid.length, c = Math.floor(s / 2);
    var ok = function (xx, yy) { return xx >= 0 && yy >= 0 && xx < w && yy < h && World.isWalkable(tilesets, bigMap, xx, yy, null) && !World.exitAt(bigMap, xx, yy); };
    return snapCell(ok, x * s + c, y * s + c);
  }

  // ---------------------------------------------------------------- 存檔座標遷移（v0.5 地圖放大）
  /**
   * v0.4（含）以前的地圖尺寸 [欄, 列]。舊存檔沒有 mapDims 戳記時，視為存檔時地圖是這個大小。
   * 以後地圖再改尺寸不用改這張表：v0.5 起存檔會記下當時每張地圖的尺寸（state.mapDims）。
   */
  var LEGACY_DIMS = { M01: [32, 20], M02: [30, 18], M03: [28, 16], M04: [30, 20], M05: [30, 19], M06: [28, 16],
    M07: [28, 16], M08: [30, 18], M09: [32, 19], M10: [28, 19], M11: [24, 14] };

  function validDim(d) { return Array.isArray(d) && d.length === 2 && d[0] > 0 && d[1] > 0 && d[0] < 1000 && d[1] < 1000; }

  /** 目前每張地圖的尺寸 { 地圖id: [欄, 列] } */
  function currentDims(maps) {
    var out = {};
    Object.keys(maps || {}).forEach(function (id) { var s = World.size(maps[id]); out[id] = [s.w, s.h]; });
    return out;
  }

  /** 在新尺寸的地圖上找一格能站的位置：依比例換算後找最近能站的格子；找不到用 start（或 start 附近能站的格子） */
  function remapPoint(map, tilesets, x, y, oldDim, newDim) {
    var blk = World.blockers(map);
    var ok = function (xx, yy) { return World.isWalkable(tilesets, map, xx, yy, blk) && !World.exitAt(map, xx, yy); };
    if (typeof x === 'number' && typeof y === 'number') {
      var kx = newDim[0] / oldDim[0], ky = newDim[1] / oldDim[1];
      var nx = Math.min(newDim[0] - 1, Math.max(0, Math.floor((x + 0.5) * kx))), ny = Math.min(newDim[1] - 1, Math.max(0, Math.floor((y + 0.5) * ky)));
      var p = snapCell(ok, nx, ny, Math.max(4, Math.ceil(Math.max(kx, ky) * 3)));
      if (ok(p.x, p.y)) return { x: p.x, y: p.y, how: 'scaled' };
    }
    var st = map.start || { x: 1, y: 1 };
    var q = snapCell(ok, st.x, st.y, 20);
    return { x: q.x, y: q.y, how: 'start' };
  }

  /**
   * 讀檔時呼叫：存檔裡以格子座標記錄的位置（location、lastInn），所在地圖的尺寸和存檔時不同就換算到最近能站的格子，
   * 找不到就送到那張地圖的 start。最後把目前的地圖尺寸記進 state.mapDims（下次比較用）。
   * 寶箱、委託、頭目都用 id 記錄，不受影響。回傳換算紀錄 [{field, map, from, to, how}]。
   */
  function migrateCoords(state, maps, tilesets) {
    var log = [], now = currentDims(maps);
    var saved = state.mapDims && Object.keys(state.mapDims).length ? state.mapDims : LEGACY_DIMS;
    ['location', 'lastInn'].forEach(function (field) {
      var loc = state[field];
      if (!loc || !maps[loc.map]) return;
      var oldDim = validDim(saved[loc.map]) ? saved[loc.map] : LEGACY_DIMS[loc.map], newDim = now[loc.map];
      if (!oldDim || (oldDim[0] === newDim[0] && oldDim[1] === newDim[1])) return;
      var map = maps[loc.map], to;
      // 旅店重生點：地圖有旅店就用「旅店老闆前一格」（和新遊戲一樣的規則）
      if (field === 'lastInn' && map.inn && World.isWalkable(tilesets, map, map.inn.x, map.inn.y + 1, World.blockers(map))) to = { x: map.inn.x, y: map.inn.y + 1, how: 'inn' };
      else to = remapPoint(map, tilesets, loc.x, loc.y, oldDim, newDim);
      log.push({ field: field, map: loc.map, from: [loc.x, loc.y], to: [to.x, to.y], how: to.how, oldDim: oldDim, newDim: newDim });
      state[field] = { map: loc.map, x: to.x, y: to.y };
    });
    state.mapDims = now;
    return log;
  }

  // ---------------------------------------------------------------- 下車點安全範圍（v0.9）
  var SAFE_RADIUS = 5;
  /**
   * 下車點：這張地圖的車站，以及世界地圖搭車到這張地圖的落點（world.js 的 map_entry＋tx,ty；沒寫 tx,ty 時用地圖 start）。
   * 回傳 [{x,y}]
   */
  function safePoints(map, mapId, regions) {
    var pts = [];
    if (map.station && typeof map.station.x === 'number') pts.push({ x: map.station.x, y: map.station.y });
    (regions || []).forEach(function (r) {
      var e = r && r.map_entry;
      if (!e) return;
      var id = typeof e === 'string' ? e : e.map;
      if (id !== mapId) return;
      var x = typeof e === 'string' ? r.tx : e.x, y = typeof e === 'string' ? r.ty : e.y;
      if (typeof x !== 'number' && map.start) { x = map.start.x; y = map.start.y; }
      if (typeof x === 'number' && typeof y === 'number') pts.push({ x: x, y: y });
    });
    return pts;
  }
  /** 這一格在不在下車點周圍 SAFE_RADIUS 格內（方形範圍）——怪物不會出現在這裡，也不會走進來 */
  function inSafeZone(pts, x, y, radius) {
    var r = radius === undefined ? SAFE_RADIUS : radius;
    for (var i = 0; i < pts.length; i++) if (Math.abs(pts[i].x - x) <= r && Math.abs(pts[i].y - y) <= r) return true;
    return false;
  }

  // ---------------------------------------------------------------- 地標與地點名稱（v0.9.5 老闆：金包里慈護宮要看得到）
  /**
   * maps.js 的 landmarks: [{ name, area: [x, y, w, h], plaque: { x, y } }]
   * area＝走進來時跳出地名提示的範圍（廟前廣場）；plaque＝匾額中心（格子座標，可以有小數），沒有就不畫
   */
  function landmarks(map) {
    return ((map && map.landmarks) || []).filter(function (l) { return l && l.name && Array.isArray(l.area) && l.area.length === 4; });
  }
  /** 這一格在哪個地標的提示範圍裡；不在任何地標裡回傳 null */
  function landmarkAt(map, x, y) {
    var ls = landmarks(map);
    for (var i = 0; i < ls.length; i++) {
      var a = ls[i].area;
      if (x >= a[0] && y >= a[1] && x < a[0] + a[2] && y < a[1] + a[3]) return ls[i];
    }
    return null;
  }
  /**
   * 放大地圖上要寫的地點名稱：maps.js 的 places（設施範圍）＋地標；回傳 [{ name, x, y }]（格子座標）。
   * x＝範圍中線；y＝範圍上緣往下 1.5 格（寫在建築物上方，不蓋住廣場上的人和「！」）
   */
  function placeLabels(map) {
    var out = [];
    function at(x, y, w, h) { return { x: x + w / 2, y: y + Math.min(1.5, h / 2) }; }
    ((map && map.places) || []).forEach(function (p) { if (p && p.name) { var c = at(p.x, p.y, p.w, p.h); out.push({ name: p.name, x: c.x, y: c.y }); } });
    landmarks(map).forEach(function (l) {
      if (out.some(function (o) { return o.name.indexOf(l.name) >= 0; })) return;   // 「金包里慈護宮與廟埕」已經寫了名字
      var c = at(l.area[0], l.area[1], l.area[2], l.area[3]);
      out.push({ name: l.name, x: c.x, y: c.y });
    });
    return out;
  }
  /**
   * v0.9.5 廟內的神像（MT1）：maps.js 的 statue、altar 都是 { x, y }（不可走的擺設）。面對任一個按 A 都是向神像祈求（轉職）。
   * 回傳 [{ kind: 'statue'|'altar', x, y }]
   */
  var STATUE_SPRITE = 'obj_mazu_statue', STATUE_NAME = '媽祖神像';
  function shrineSpots(map) {
    var out = [];
    ['statue', 'altar'].forEach(function (k) {
      var s = map && map[k];
      if (s && typeof s.x === 'number' && typeof s.y === 'number') out.push({ kind: k, x: s.x, y: s.y });
    });
    return out;
  }
  /** span：[x0, x1]＝同一列 x0～x1 都算（長供桌：拜墊那一列面對供桌任何一格都能轉職；地圖組 MT1.json） */
  function shrineAt(map, x, y) {
    var keys = ['statue', 'altar'];
    for (var i = 0; i < keys.length; i++) {
      var s = map && map[keys[i]];
      if (!s || typeof s.x !== 'number' || s.y !== y) continue;
      var sp = Array.isArray(s.span) && s.span.length === 2 ? s.span : [s.x, s.x];
      if (x >= sp[0] && x <= sp[1]) return { kind: keys[i], x: s.x, y: s.y };
    }
    return null;
  }
  /** 要寫字的匾額：地標的 plaque ＋ maps.js 的 plaques（MT1 正殿後牆）。回傳 [{ x, y, w, h, text }]（格子座標，x、y＝寫字中心） */
  function plaqueSpots(map) {
    var out = [];
    landmarks(map).forEach(function (l) { if (l.plaque) out.push({ x: l.plaque.x, y: l.plaque.y, w: l.plaque.w || 0, h: l.plaque.h || 0, text: l.plaque.text || l.name }); });
    ((map && map.plaques) || []).forEach(function (p) { if (p && p.text) out.push({ x: p.x, y: p.y, w: p.w || 0, h: p.h || 0, text: p.text }); });
    return out;
  }

  /**
   * 點放大地圖（v0.9.5）：點的位置（相對於畫布左上角的 CSS 像素）→ 地圖格子。
   * cssW、cssH＝畫布在畫面上的大小；view＝畫布顯示的範圍（格），預設整張。點到畫布外回傳 null
   */
  function tileFromMinimap(px, py, cssW, cssH, view) {
    if (!(cssW > 0 && cssH > 0) || px < 0 || py < 0 || px >= cssW || py >= cssH) return null;
    return { x: view.x + Math.min(view.w - 1, Math.floor(px / cssW * view.w)), y: view.y + Math.min(view.h - 1, Math.floor(py / cssH * view.h)) };
  }

  var MapInfo = { STATUE_SPRITE: STATUE_SPRITE, STATUE_NAME: STATUE_NAME, shrineSpots: shrineSpots, shrineAt: shrineAt, plaqueSpots: plaqueSpots, landmarks: landmarks, landmarkAt: landmarkAt, placeLabels: placeLabels, tileFromMinimap: tileFromMinimap, ANIMAL_SAY: ANIMAL_SAY, animalSpecs: animalSpecs, animalTiles: animalTiles, awayTarget: awayTarget, REC_LEVEL: REC_LEVEL, recLevel: recLevel, levelText: levelText, nameWithLevel: nameWithLevel, innDialog: innDialog, innSpeaker: innSpeaker, innKeeperSprite: innKeeperSprite, innSpeakerSprite: innSpeakerSprite, innKeeperName: innKeeperName, SAFE_RADIUS: SAFE_RADIUS, safePoints: safePoints, inSafeZone: inSafeZone, upperCells: upperCells, rectHitsCells: rectHitsCells, signSpots: signSpots, SIGN_TEXT: SIGN_TEXT, SIGN_ABOVE_KEEPER: SIGN_ABOVE_KEEPER, SIGN_PLAQUES: SIGN_PLAQUES, SIGN_KIND: SIGN_KIND, bgmFor: bgmFor, battleBgm: battleBgm, MAP_BGM: MAP_BGM,
    wanderTarget: wanderTarget, petSpot: petSpot, glowRgb: glowRgb, lightSpots: lightSpots, scaleMap: scaleMap, scalePoint: scalePoint, snapCell: snapCell,
    LEGACY_DIMS: LEGACY_DIMS, currentDims: currentDims, remapPoint: remapPoint, migrateCoords: migrateCoords,
    SIGN_CAM: SIGN_CAM, signCamPick: signCamPick, signCamOffset: signCamOffset, camEase: camEase };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.MapInfo = MapInfo; }
  if (typeof module !== 'undefined') module.exports = MapInfo;
})();
