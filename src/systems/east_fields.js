/*
 * v4.0 東部終章：地圖資料新欄位的解析與規則（71 號 2.3–2.12、第十一節）。純計算，可以在 node 測試；畫圖、互動在 fx/east_fx.js。
 *
 * 認得的欄位（maps.js 各圖；地圖組 tools/bigmaps/<ID>.json 同名，integrate_maps.js 照抄）：
 *   no_minimap   洞窟不給小地圖（v2.0 minimap.js 已支援；這裡只決定「番薯仔找路箭頭」能不能用）
 *   fog_mask     霧遮罩（M37 回音霧廊、M39 遺失物書庫）：主角周圍半徑 4 格看得見，有曙光羅盤 6 格；M39 每送回 1 件淡一級
 *   lodge_lamps  山屋小燈（kind: lodge／marker 記號燈／final 最後的山屋小燈）；heal_points（雲之深層的回復點）也當山屋小燈
 *   echo_door    回音謎門（M37）：答對 3 題國語才開
 *   puzzles      12 道解謎機關的位置（規則在 data/puzzles.js 的 PUZZLES，合起來見 mergePuzzle）
 *   ice_rooms    冰地板滑行房（M38；規則在 systems/ice.js）
 *   decals       地上的記號：ice_pillar_dots（冰柱刻 1–3 點）、frost_arrow（霜花箭頭 N/E/S/W）
 *   shelves      書架（M39；cat、icon、area）；shelf_signs 只是說明文字
 *   lost_items   遺失物（M39；hidden＝藏在哪一道機關後面）；北門要送回 lost_items>=6
 *   trial_lamps  五燈試煉的燈座（M40；打倒那座的霧影 boss＝亮）
 *   soft_clouds  軟雲（M42；答對 1 題才變硬，沒變硬時擋路）
 *   constellations、stars  星座台與星星（M43；15 顆星放回 5 個星座＝constellations_done）
 *   light_pillar 光柱（M44；四隻曙光霧將都打倒後走進去＝稱號「曙光的源頭」）
 *   night_zone   夜路（M32；程式疊一層藍色半透明，area＝[x, y, 寬, 高]）
 *   signs        程式畫字的木牌（M44 入口）
 * 存檔：state.puzzles（12 道機關，CavePuzzle.progress）；state.east = { lost: {物品:true}, clouds: {SC1:true}, stars: {序號:true}, done: {事件:true} }
 *   （一般欄位、不升 schema；壞資料讀到時修回；舊存檔沒有＝空的）。正式整合（71 號 10.1 EastMigrate）時再決定要不要放進 createNewState。
 */
(function () {
  'use strict';
  var isNode = typeof module !== 'undefined' && typeof require === 'function';
  var CavePuzzle = isNode ? require('./cave_puzzle.js') : window.JQ.CavePuzzle;
  var Ice = isNode ? require('./ice.js') : window.JQ.Ice;

  var FIELDS = ['fog_mask', 'lodge_lamps', 'heal_points', 'echo_door', 'puzzles', 'ice_rooms', 'decals', 'shelves', 'lost_items', 'carpets',
    'trial_lamps', 'soft_clouds', 'constellations', 'stars', 'light_pillar', 'night_zone', 'signs'];
  var SUBJECTS = ['國語', '英語', '數學', '自然', '社會'];
  var FOG = { radius: 4, compassRadius: 6, alpha: 0.92, levels: 8 };   // 71 號 2.3、2.5
  var COMPASS_ITEM = 'dawn_compass';
  var NO_MAP_TIP = '洞窟裡霧太濃，看不到地圖，跟著羅盤走吧！';   // 71 號 2.12（第一次進 M37 時說一次）
  var SIGN_TEXT = { sign_challenge: '給想挑戰更高的冒險者' };    // 71 號 2.10（M44 入口木牌）
  var STARS_PER_CONSTELLATION = 3;
  var SHELF_ICON = { pencil: '✏️', umbrella: '☂️', shirt: '👕', blocks: '🧱', apple: '🍎', fish: '🐟', flower: '🌸', cloud_sun: '⛅' };
  var ARROW_MS = 30000;   // 番薯仔的找路箭頭 30 秒後消失（71 號 2.12）
  /** 記號燈旁邊是哪一座書架（71 號 2.5 D、2.12；地圖組的 json 只寫在 note 裡）。地圖組在 lodge_lamps 加 "shelf" 以後以 json 為準 */
  var MARKER_SHELF = { 'M39:14,20': '文具', 'M39:44,21': '天氣' };

  function isObj(v) { return !!v && typeof v === 'object' && !Array.isArray(v); }
  function isPt(p) { return Array.isArray(p) && p.length === 2 && Number.isInteger(p[0]) && Number.isInteger(p[1]); }
  function pt(p) { return [p[0], p[1]]; }
  function key(x, y) { return x + ',' + y; }
  /** [x0, y0, x1, y1]（含頭含尾）裡面嗎 */
  function inRect(x, y, r) { return !!r && x >= r[0] && x <= r[2] && y >= r[1] && y <= r[3]; }
  /** [x, y, 寬, 高] 裡面嗎（night_zone、spawns、landmarks 的寫法） */
  function inXYWH(x, y, a) { return !!a && x >= a[0] && x < a[0] + a[2] && y >= a[1] && y < a[1] + a[3]; }

  /** 這張地圖有沒有東部新欄位（沒有就不用掛 EastFx）。只有 no_minimap 的舊地圖（M06 海蝕洞窟）不算：行為和 v2.0 一樣 */
  function hasEast(map) { return !!map && FIELDS.some(function (k) { return map[k] !== undefined && map[k] !== null; }); }
  /** 這張地圖有沒有番薯仔找路箭頭（no_minimap＋東部洞窟的找路規則；71 號 2.12） */
  var WAY_MAPS = ['M37', 'M38', 'M39', 'M40'];
  function hasWayfinding(P) { return !!P && P.noMinimap && WAY_MAPS.indexOf(P.id) >= 0; }

  // ═════════════════════ 存檔 ═════════════════════
  function cleanDict(d) {
    if (!isObj(d)) return {};
    Object.keys(d).forEach(function (k) { if (d[k] !== true || k.length > 40) delete d[k]; });
    return d;
  }
  /** state.east（修好再回傳）。舊存檔沒有＝空的；壞資料（不是物件、值不是 true）丟掉 */
  function progress(state) {
    if (!state) return { lost: {}, clouds: {}, stars: {}, done: {} };
    if (!isObj(state.east)) state.east = {};
    var e = state.east;
    ['lost', 'clouds', 'stars', 'done'].forEach(function (k) { e[k] = cleanDict(e[k]); });
    Object.keys(e).forEach(function (k) { if (['lost', 'clouds', 'stars', 'done'].indexOf(k) < 0) delete e[k]; });
    CavePuzzle.progress(state);
    return e;
  }
  function mark(state, kind, id) { var e = progress(state); if (e[kind][id] === true) return false; e[kind][id] = true; return true; }
  function has(state, kind, id) { return !!(state && isObj(state.east) && isObj(state.east[kind]) && state.east[kind][id] === true); }

  // ═════════════════════ 解析 ═════════════════════
  /** 地圖上的 puzzles（位置）＋ PUZZLES（規則）→ 一道機關的完整資料（格子都是地圖上的絕對座標） */
  function mergePuzzle(mp, PUZ, issues) {
    var def = PUZ && PUZ[mp.id];
    if (!def) { issues.push('機關 ' + mp.id + '：data/puzzles.js 沒有這一道'); return null; }
    if (def.type !== mp.type) issues.push('機關 ' + mp.id + '：地圖寫 ' + mp.type + '、規則寫 ' + def.type);
    if (!Array.isArray(mp.area) || mp.area.length !== 4) issues.push('機關 ' + mp.id + '：area 要是 [x0, y0, x1, y1]');
    var o = { id: mp.id, type: def.type, required: mp.required === undefined ? !!def.required : !!mp.required, area: (mp.area || []).slice(), def: def, cells: {}, rewardChest: mp.reward_chest || (def.reward && def.reward.chest) || null };
    var C = o.cells;
    var org = [o.area[0], o.area[1]];
    switch (def.type) {
      case 'lights':
        if (mp.plates) { C.plates = {}; Object.keys(mp.plates).forEach(function (k) { C.plates[k] = pt(mp.plates[k]); }); }
        if (mp.stones) { C.plates = {}; Object.keys(mp.stones).forEach(function (k) { C.plates[k] = pt(mp.stones[k]); }); }
        C.door = (mp.door || []).map(pt);
        o.appearsAfter = mp.appears_after || null;
        CavePuzzle.lightKeys(def).forEach(function (k) { if (!C.plates || !isPt(C.plates[k])) issues.push('機關 ' + mp.id + '：踏板 ' + k + ' 沒有位置'); });
        break;
      case 'pattern': C.slabs = (mp.wall_slabs || []).map(pt); C.floors = (mp.answer_floors || []).map(pt);
        if (C.floors.length !== def.data.options.length) issues.push('機關 ' + mp.id + '：答案地板 ' + C.floors.length + ' 塊，選項 ' + def.data.options.length + ' 個'); break;
      case 'numseq': C.pillars = (mp.pillars || []).map(pt); C.floors = (mp.number_floors || []).map(pt); C.gate = (mp.ice_gate || []).map(pt);
        if (C.floors.length !== def.data.options.length) issues.push('機關 ' + mp.id + '：數字地板 ' + C.floors.length + ' 塊，選項 ' + def.data.options.length + ' 個'); break;
      case 'memory': C.cards = (mp.cards || []).map(pt);
        if (C.cards.length !== def.data.faces.length * (def.data.copies || 2)) issues.push('機關 ' + mp.id + '：石牌 ' + C.cards.length + ' 張'); break;
      case 'balance': C.scale = isPt(mp.scale) ? pt(mp.scale) : null; C.stones = (mp.stones || []).map(pt);
        if (C.stones.length !== def.data.stones.length) issues.push('機關 ' + mp.id + '：石頭 ' + C.stones.length + ' 顆'); break;
      case 'sokoban': {
        var P = CavePuzzle.sokoParse(def.data.rows);
        o.origin = org;
        C.door = isPt(mp.door) ? pt(mp.door) : null;
        C.enterTo = isPt(mp.enter_to) ? pt(mp.enter_to) : null;
        C.boxes = P.boxes.map(function (b) { return [org[0] + b[0], org[1] + b[1]]; });
        C.goals = P.goals.map(function (g) { return [org[0] + g[0], org[1] + g[1]]; });
        C.start = [org[0] + P.player[0], org[1] + P.player[1]];
        C.walls = Object.keys(P.walls).map(function (k) { var a = k.split(',').map(Number); return [org[0] + a[0], org[1] + a[1]]; });
        // 地圖組寫的箱子、目標、起點要和規則的地圖一致（area 左上角＝規則地圖的 (0,0)）
        var mb = (mp.boxes || (mp.box ? [mp.box] : [])).map(String).sort().join(';'), mg = (mp.goals || (mp.goal ? [mp.goal] : [])).map(String).sort().join(';');
        if (mb !== C.boxes.map(String).sort().join(';')) issues.push('機關 ' + mp.id + '：地圖的箱子 ' + mb + ' 和規則算出的 ' + C.boxes.map(String).join(';') + ' 不同');
        if (mg !== C.goals.map(String).sort().join(';')) issues.push('機關 ' + mp.id + '：地圖的目標 ' + mg + ' 和規則算出的 ' + C.goals.map(String).join(';') + ' 不同');
        if (C.enterTo && String(C.enterTo) !== String(C.start)) issues.push('機關 ' + mp.id + '：進門站的格子 ' + C.enterTo + ' 不是規則的起點 ' + C.start);
        break;
      }
      case 'mirror': {
        var d = def.data, mo = isPt(mp.origin) ? mp.origin : org;
        o.origin = pt(mo);
        C.mirrors = d.mirrors.map(function (m) { return [mo[0] + m[0], mo[1] + m[1]]; });
        C.pillars = d.walls.map(function (m) { return [mo[0] + m[0], mo[1] + m[1]]; });
        C.crystal = [mo[0] + d.target[0], mo[1] + d.target[1]];
        C.source = isPt(mp.source) ? pt(mp.source) : [mo[0] + d.src[0] - d.dir[0], mo[1] + d.src[1] - d.dir[1]];
        C.beamStart = [mo[0] + d.src[0], mo[1] + d.src[1]];
        if (mp.mirrors && mp.mirrors.map(String).join(';') !== C.mirrors.map(String).join(';')) issues.push('機關 ' + mp.id + '：地圖的鏡子位置和規則（origin＋相對座標）不同');
        if (mp.crystal && String(mp.crystal) !== String(C.crystal)) issues.push('機關 ' + mp.id + '：地圖的水晶位置和規則不同');
        if (mp.pillars && mp.pillars.map(String).sort().join(';') !== C.pillars.map(String).sort().join(';')) issues.push('機關 ' + mp.id + '：地圖的石柱位置和規則不同');
        break;
      }
      case 'euler': C.stones = {}; Object.keys(mp.stones || {}).forEach(function (k) { C.stones[k] = pt(mp.stones[k]); });
        def.data.nodes.forEach(function (k) { if (!isPt(C.stones[k])) issues.push('機關 ' + mp.id + '：石頭 ' + k + ' 沒有位置'); }); break;
      case 'symbol': C.desk = isPt(mp.desk) ? pt(mp.desk) : null; C.gate = (mp.gate || []).map(pt); break;
      case 'hanoi': C.door = isPt(mp.door) ? pt(mp.door) : null; C.pillars = (mp.pillars || []).map(pt);
        if (C.pillars.length !== 3) issues.push('機關 ' + mp.id + '：石柱要 3 根'); break;
    }
    return o;
  }

  /**
   * 解析一張地圖的東部欄位（maps.js 的一筆，或地圖組的 json 都可以）。回傳正規化後的資料＋ issues（格式問題；空＝沒問題）。
   * PUZ：window.PUZZLES；items：window.LOST_ITEMS
   */
  function parse(map, mapId, PUZ, items) {
    var issues = [], o = { id: mapId || map.map || null, noMinimap: map.no_minimap === true, fog: map.fog_mask === true, issues: issues };
    var size = map.size ? { w: map.size[0], h: map.size[1] } : { w: (map.grid && map.grid[0] || '').length, h: (map.grid || []).length };
    o.size = size;
    var lamps = (map.lodge_lamps || []).map(function (l) { return { x: l.x, y: l.y, kind: l.kind || 'lodge', id: l.id || 'obj_lodge_lamp' }; })
      .concat((map.heal_points || []).filter(function (h) { return h.kind === 'lodge_lamp' || !h.kind; }).map(function (h) { return { x: h.x, y: h.y, kind: 'lodge', id: 'obj_lodge_lamp' }; }));
    o.lamps = lamps;
    o.echoDoor = map.echo_door ? { cells: (map.echo_door.cells || []).map(pt), dialog: map.echo_door.dialog || 'D_ECHO_DOOR' } : null;
    o.puzzles = (map.puzzles || []).map(function (mp) { return mergePuzzle(mp, PUZ || {}, issues); }).filter(Boolean);
    o.iceRooms = (map.ice_rooms || []).map(function (r) {
      ['box', 'entrance', 'exit'].forEach(function (k) { if (!r[k]) issues.push('冰房間 ' + r.id + ' 沒有 ' + k); });
      return { id: r.id, box: (r.box || []).slice(), entrance: pt(r.entrance || [0, 0]), exit: pt(r.exit || [0, 0]), reset: r.reset ? pt(r.reset) : null,
        min_steps: r.min_steps, solution: r.solution || '', rocks: (r.rocks || []).map(pt), dots: r.dots || 0 };
    });
    o.decals = (map.decals || []).filter(function (d) {
      var ok = d && (d.type === 'ice_pillar_dots' || d.type === 'frost_arrow') && Number.isInteger(d.x) && Number.isInteger(d.y);
      if (!ok) issues.push('decals：不認得 ' + JSON.stringify(d));
      return ok;
    }).map(function (d) { return d.type === 'frost_arrow' ? { type: d.type, x: d.x, y: d.y, dir: d.dir } : { type: d.type, x: d.x, y: d.y, dots: d.dots || 1 }; });
    var rect4 = function (a) { return Array.isArray(a) && a.length === 4 && a.every(Number.isInteger); };
    o.shelves = (map.shelves || []).filter(function (s) { if (s && rect4(s.area) && s.cat) return true; issues.push('書架 ' + JSON.stringify(s) + '：要有 cat 和 area [x0, y0, x1, y1]'); return false; })
      .map(function (s) { return { cat: s.cat, icon: s.icon, emoji: SHELF_ICON[s.icon] || '📚', area: s.area.slice() }; });
    var shelfCats = o.shelves.map(function (s) { return s.cat; });
    o.lostItems = (map.lost_items || []).filter(function (it) { if (it && it.id && Number.isInteger(it.x) && Number.isInteger(it.y)) return true; issues.push('遺失物 ' + JSON.stringify(it) + '：要有 id、x、y'); return false; }).map(function (it) {
      var info = (items || {})[it.id] || {};
      if (items && !items[it.id]) issues.push('遺失物 ' + it.id + '：LOST_ITEMS 沒有');
      if (info.cat && shelfCats.length && shelfCats.indexOf(info.cat) < 0) issues.push('遺失物 ' + it.id + '：書架沒有「' + info.cat + '」');
      return { id: it.id, x: it.x, y: it.y, hidden: it.hidden || null, name: info.name || it.id, en: info.en || it.id, cat: info.cat || null, icon: info.icon || '❔' };
    });
    // 記號燈的木牌畫旁邊書架的圖案（71 號 2.5 D、2.12：(14,20) 文具、(46,22)→地圖組改 (44,21) 天氣）。
    //   json 的 lodge_lamps 寫了 shelf 就照它；沒寫時照 MARKER_SHELF（規格指定）；都沒有才找最近的書架
    var lampSrc = (map.lodge_lamps || []);
    o.lamps.forEach(function (l, i) {
      if (l.kind !== 'marker' || !o.shelves.length) return;
      var want = (lampSrc[i] && lampSrc[i].shelf) || MARKER_SHELF[(o.id || '') + ':' + l.x + ',' + l.y], best = null, bd = Infinity;
      o.shelves.forEach(function (s) {
        var dx = Math.max(s.area[0] - l.x, 0, l.x - s.area[2]), dy = Math.max(s.area[1] - l.y, 0, l.y - s.area[3]), dd = want ? (s.cat === want ? 0 : Infinity) : dx + dy;
        if (dd < bd) { bd = dd; best = s; }
      });
      if (want && !best) issues.push('記號燈 (' + l.x + ',' + l.y + ')：書架沒有「' + want + '」');
      if (best) { l.icon = best.emoji; l.shelf = best.cat; }
    });
    o.trialLamps = (map.trial_lamps || []).filter(function (t) { if (t && rect4(t.seat) && t.subject) return true; issues.push('燈座 ' + JSON.stringify(t) + '：要有 subject 和 seat [x0, y0, x1, y1]'); return false; })
      .map(function (t) { return { subject: t.subject, seat: t.seat.slice(), boss: t.boss || null }; });
    o.softClouds = (map.soft_clouds || []).map(function (c, i) { return { id: c.id || ('SC' + (i + 1)), cells: (c.cells || []).filter(isPt).map(pt), subject: SUBJECTS[i % SUBJECTS.length] }; });
    o.constellations = (map.constellations || []).map(function (c) { return { id: c.id, x: c.x, y: c.y, region: c.region || '' }; });
    o.stars = (map.stars || []).filter(function (s) { return isPt(Array.isArray(s) ? s : [s && s.x, s && s.y]); }).map(function (s, i) { var p = Array.isArray(s) ? s : [s.x, s.y]; return { i: i, x: p[0], y: p[1], constellation: o.constellations.length ? o.constellations[Math.floor(i / STARS_PER_CONSTELLATION) % o.constellations.length].id : null }; });
    if (o.stars.length && o.constellations.length && o.stars.length !== o.constellations.length * STARS_PER_CONSTELLATION) issues.push('星星 ' + o.stars.length + ' 顆，星座 ' + o.constellations.length + ' 個（每個 ' + STARS_PER_CONSTELLATION + ' 顆）');
    o.lightPillar = map.light_pillar ? { cells: (map.light_pillar.cells || []).filter(isPt).map(pt) } : null;
    if (map.night_zone) {
      var nz = map.night_zone.area || map.night_zone;
      if (!Array.isArray(nz) || nz.length !== 4) issues.push('night_zone 的 area 要是 [x, y, 寬, 高]');
      o.nightZone = { area: Array.isArray(nz) ? nz.slice() : [0, 0, 0, 0] };
    } else o.nightZone = null;
    o.signs = (map.signs || []).filter(function (s) { return s && Number.isInteger(s.x) && Number.isInteger(s.y); }).map(function (s) { return { id: s.id, x: s.x, y: s.y, text: SIGN_TEXT[s.id] || s.text || '' }; });
    o.bosses = (map.spawns || []).filter(function (s) { return s.boss; }).map(function (s) { return s.monster; });
    // 座標都要在地圖裡
    function inside(p, what) { if (!isPt(p) || p[0] < 0 || p[1] < 0 || (size.w && p[0] >= size.w) || (size.h && p[1] >= size.h)) issues.push(what + ' (' + p + ') 不在地圖裡'); }
    o.lamps.forEach(function (l) { inside([l.x, l.y], '山屋小燈'); });
    o.puzzles.forEach(function (pz) { inside([pz.area[0], pz.area[1]], pz.id + ' 機關區左上'); inside([pz.area[2], pz.area[3]], pz.id + ' 機關區右下'); });
    o.iceRooms.forEach(function (r) { inside(r.entrance, r.id + ' 入口'); inside(r.exit, r.id + ' 出口'); });
    o.lostItems.forEach(function (it) { inside([it.x, it.y], '遺失物 ' + it.id); });
    o.softClouds.forEach(function (c) { c.cells.forEach(function (p) { inside(p, '軟雲 ' + c.id); }); });
    o.stars.forEach(function (s) { inside([s.x, s.y], '星星 ' + s.i); });
    if (o.lightPillar) o.lightPillar.cells.forEach(function (p) { inside(p, '光柱'); });
    return o;
  }

  // ═════════════════════ 狀態判斷 ═════════════════════
  function trialLampLit(state, t) { return !!(state && ((isObj(state.trialLamps) && state.trialLamps[t.subject] === true) || (t.boss && isObj(state.bosses) && state.bosses[t.boss]))); }
  function trialLampsAll(state, P) { return P.trialLamps.length > 0 && P.trialLamps.every(function (t) { return trialLampLit(state, t); }); }
  function lostReturned(state, P) { return P.lostItems.filter(function (it) { return has(state, 'lost', it.id); }).length; }
  function starsCollected(state, P) { return P.stars.filter(function (s) { return has(state, 'stars', String(s.i)); }).length; }
  /** 每個星座放回幾顆（0–3） */
  function constellationFill(state, P) {
    var out = {}; P.constellations.forEach(function (c) { out[c.id] = 0; });
    P.stars.forEach(function (s) { if (has(state, 'stars', String(s.i)) && s.constellation) out[s.constellation]++; });
    return out;
  }
  function constellationsDone(state, P) { return P.stars.length > 0 && starsCollected(state, P) === P.stars.length; }
  function hasCompass(state) { return !!(state && state.inventory && state.inventory[COMPASS_ITEM] > 0); }
  /** 遺失物現在看得到嗎（藏在選做機關後面的，要先解開那一道） */
  function lostVisible(state, it) { return !it.hidden || CavePuzzle.solved(state, it.hidden); }
  function puzzleVisible(state, P, pz) { return pz.appearsAfter !== 'trial_lamps_all' || trialLampsAll(state, P); }
  function bossesDone(state, P) { return P.bosses.length > 0 && P.bosses.every(function (b) { return !!(state && state.bosses && state.bosses[b]); }); }

  /**
   * 出口、機關條件（71 號 2.2、2.6）：委託 id、'lost_items>=6'、'trial_lamps_all'、'puzzle.P4-2'、'pl>=60'、'item:dawn_compass'、
   * 'constellations_done'、'ending_done'（flags）。ctx = { P: parse 的結果, pl: 戰力, flags }。不認得的寫法一律當「沒過」。
   * （這一版還沒接到 World.exitOpen：出口在地圖整合時一起接，見 交接_前端v40.md）
   */
  function requirementMet(token, state, ctx) {
    ctx = ctx || {};
    var P = ctx.P || { lostItems: [], trialLamps: [], stars: [] }, m;
    if (Array.isArray(token)) return token.every(function (t) { return requirementMet(t, state, ctx); });
    if (typeof token !== 'string' || !token) return false;
    if ((m = /^lost_items>=(\d+)$/.exec(token))) return lostReturned(state, P) >= Number(m[1]);
    if (token === 'trial_lamps_all') return trialLampsAll(state, P);
    if ((m = /^puzzle\.(P\d-\d)$/.exec(token))) return CavePuzzle.solved(state, m[1]);
    if ((m = /^pl>=(\d+)$/.exec(token))) return typeof ctx.pl === 'number' && ctx.pl >= Number(m[1]);
    if ((m = /^item:(\w+)$/.exec(token))) return !!(state && state.inventory && state.inventory[m[1]] > 0);
    if (token === 'constellations_done') return constellationsDone(state, P);
    if (token === 'ending_done') return !!(state && ((isObj(state.flags) && state.flags.ending_done === true) || state.ending === true));
    if (/^Q_\w+$/.test(token)) return !!(state && state.quests && state.quests[token] && state.quests[token].status === 'done');
    return false;
  }

  /**
   * 霧遮罩（M37、M39）：{ on, radius（格）, alpha }。有曙光羅盤半徑 6 格；M39 每送回 1 件遺失物淡一級（共 8 級，全部送回就沒有霧）；
   * 主角站在機關區裡關掉（71 號 2.11.1：機關要看得清楚）。reduced＝「減少動態效果」：改成固定的淡霧（路照樣看得清楚；機關區裡也是同一層，不會忽亮忽暗）
   */
  function fogLevel(P, state, hero, reduced) {
    if (!P.fog) return { on: false, radius: 0, alpha: 0 };
    var radius = hasCompass(state) ? FOG.compassRadius : FOG.radius, alpha = FOG.alpha;
    if (P.lostItems.length) alpha = FOG.alpha * Math.max(0, FOG.levels - lostReturned(state, P)) / FOG.levels;
    // 減少動態效果：一直是同一層淡霧（進出機關區也不變，畫面不會一亮一暗）
    if (reduced) return alpha <= 0.001 ? { on: false, radius: radius, alpha: 0, still: true } : { on: true, radius: radius, alpha: Math.min(alpha, 0.35), still: true };
    var inPuzzle = hero && P.puzzles.some(function (pz) { return inRect(hero.x, hero.y, pz.area); });
    if (inPuzzle || alpha <= 0.001) return { on: false, radius: radius, alpha: 0, inPuzzle: !!inPuzzle };
    return { on: true, radius: radius, alpha: alpha };
  }

  /** 這一格在哪一道機關的範圍裡（沒有＝null） */
  function puzzleAt(P, x, y) { for (var i = 0; i < P.puzzles.length; i++) if (inRect(x, y, P.puzzles[i].area)) return P.puzzles[i]; return null; }
  function iceRoomAt(P, cell, x, y) { return Ice.roomAt(P.iceRooms, cell, x, y); }

  /**
   * 現在擋路的格子（狀態決定的那些；地圖本來就不能走的格子不用列）：
   *   山屋小燈；回音謎門（還沒開）；必做機關的門（P1-1 石門、P2-3 冰門、P3-3 木柵，還沒解開）；P1-2 牆上石板；P2-2 天平；
   *   軟雲（還沒變硬）。推箱子的箱子由遊戲畫面另外加（位置會動）。回傳 { 'x,y': '原因' }
   */
  function blockedCells(P, state) {
    var b = {};
    function add(p, why) { if (isPt(p)) b[key(p[0], p[1])] = why; }
    P.lamps.forEach(function (l) { add([l.x, l.y], 'lamp'); });
    if (P.echoDoor && !has(state, 'done', 'echo_' + P.id)) P.echoDoor.cells.forEach(function (p) { add(p, 'echo_door'); });
    P.puzzles.forEach(function (pz) {
      var solved = CavePuzzle.solved(state, pz.id), C = pz.cells;
      if (pz.type === 'lights' && !solved) (C.door || []).forEach(function (p) { add(p, pz.id + ':door'); });
      if (pz.type === 'numseq' && !solved) (C.gate || []).forEach(function (p) { add(p, pz.id + ':gate'); });
      if (pz.type === 'symbol' && !solved) (C.gate || []).forEach(function (p) { add(p, pz.id + ':gate'); });
      if (pz.type === 'pattern') (C.slabs || []).forEach(function (p) { add(p, pz.id + ':slab'); });
      // P1-3 的石牌平放在地上、不擋路（4×2 排在一起，(53,16) 下面是石頭：擋路的話中間那張從旁邊碰不到）
      if (pz.type === 'balance' && C.scale) add(C.scale, pz.id + ':scale');
    });
    P.softClouds.forEach(function (c) { if (!has(state, 'clouds', c.id)) c.cells.forEach(function (p) { add(p, 'cloud:' + c.id); }); });
    return b;
  }

  /**
   * 番薯仔的找路箭頭要指向哪裡（71 號 2.12；只在 no_minimap 的地圖）：
   *   M37：P1-1 石門（還沒開）→ 回音謎門 → 往下的樓梯；M38：冰房間二 → 冰柱數字（P2-3）→ 冰房間三 → 樓梯；
   *   M39：借書台（P3-3）→ 最近一件還沒送回的遺失物（送滿 6 件後指北門）；M40：最近一座沒亮的燈 → 星盤（P4-2）→ 最後的門。
   * ctx = { reach(x,y)：從主角走得到嗎（冰面、關著的門都當不能走）, exits: maps.js 的 exits }。回傳 { x, y, label } 或 null
   */
  function wayTarget(P, state, hero, ctx) {
    if (!hasWayfinding(P) || !hero) return null;
    ctx = ctx || {};
    var reach = ctx.reach || function () { return true; };
    var north = (ctx.exits || []).filter(function (e) { return e.y === 0; })[0];
    var northT = north ? { x: north.x, y: north.y + 1, label: '往上的樓梯' } : null;
    function near(list) {
      var best = null, bd = Infinity;
      list.forEach(function (t) { var d = Math.abs(t.x - hero.x) + Math.abs(t.y - hero.y); if (d < bd) { bd = d; best = t; } });
      return best;
    }
    var pz = function (id) { return P.puzzles.filter(function (p) { return p.id === id; })[0]; };
    var cen = function (p) { var a = p.area; return { x: Math.round((a[0] + a[2]) / 2), y: Math.round((a[1] + a[3]) / 2) }; };
    var req = P.puzzles.filter(function (p) { return p.required && !CavePuzzle.solved(state, p.id); });
    switch (P.id) {
      case 'M37': {
        var p11 = pz('P1-1');
        if (p11 && !CavePuzzle.solved(state, 'P1-1')) return Object.assign(cen(p11), { label: '三盞燈的石門' });
        if (P.echoDoor && !has(state, 'done', 'echo_' + P.id)) { var c = P.echoDoor.cells[0]; return { x: c[0], y: c[1] + 1, label: '回音謎門' }; }
        return northT;
      }
      case 'M38': {
        var rooms = P.iceRooms.filter(function (r) { return r.id !== 'ice1'; });
        var p23 = pz('P2-3');
        // 從後面往前找：已經走得到的最後一站
        if (northT && reach(northT.x, northT.y)) return northT;
        var r3 = rooms[1], r2 = rooms[0];
        if (r3 && reach(r3.exit[0], r3.exit[1])) return northT;
        if (p23 && !CavePuzzle.solved(state, 'P2-3') && reach(p23.cells.floors[0][0], p23.cells.floors[0][1])) return Object.assign(cen(p23), { label: '冰柱上的數字' });
        if (r3 && reach(r3.entrance[0], r3.entrance[1] + 1)) return { x: r3.entrance[0], y: r3.entrance[1], label: '冰房間三' };
        if (r2) return { x: r2.entrance[0], y: r2.entrance[1], label: '冰房間二' };
        return northT;
      }
      case 'M39': {
        var p33 = pz('P3-3');
        if (p33 && !CavePuzzle.solved(state, 'P3-3')) return { x: p33.cells.desk[0], y: p33.cells.desk[1] + 1, label: '借書台' };
        if (lostReturned(state, P) >= 6) return northT;
        var left = P.lostItems.filter(function (it) { return !has(state, 'lost', it.id) && lostVisible(state, it); });
        var t = near(left.map(function (it) { return { x: it.x, y: it.y, label: it.name }; }));
        return t || northT;
      }
      case 'M40': {
        var dark = P.trialLamps.filter(function (t2) { return !trialLampLit(state, t2); });
        if (dark.length) return near(dark.map(function (t2) { return { x: Math.round((t2.seat[0] + t2.seat[2]) / 2), y: t2.seat[3] + 2, label: t2.subject + '燈' }; }));
        var p42 = pz('P4-2');
        if (p42 && !CavePuzzle.solved(state, 'P4-2')) return Object.assign(cen(p42), { label: '五角星盤' });
        return northT ? { x: northT.x, y: northT.y, label: '最後的門' } : null;
      }
    }
    return req.length ? Object.assign(cen(req[0]), { label: req[0].def.name }) : northT;
  }

  /** 8 方向的箭頭角度（度；0＝右、90＝下）：從 (fx,fy) 指向 (tx,ty)，四捨五入到 45° */
  function arrowAngle(fx, fy, tx, ty) {
    if (fx === tx && fy === ty) return null;
    var a = Math.atan2(ty - fy, tx - fx) * 180 / Math.PI;
    return ((Math.round(a / 45) * 45) % 360 + 360) % 360;
  }

  /** 從 start 走到 goal 的最短路（只走 walk(x,y) 為真的格子；4 方向）。找不到回傳 null。曙光羅盤的光點用 */
  function pathTo(walk, w, h, start, goal, maxNodes) {
    var q = [start], prev = {}, k0 = key(start[0], start[1]), gk = key(goal[0], goal[1]);
    prev[k0] = null;
    for (var i = 0; i < q.length && i < (maxNodes || 6000); i++) {
      var p = q[i], k = key(p[0], p[1]);
      if (k === gk) { var out = []; while (prev[k]) { out.push(k.split(',').map(Number)); k = prev[k]; } return out.reverse(); }
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) {
        var nx = p[0] + d[0], ny = p[1] + d[1], nk = key(nx, ny);
        if (nx < 0 || ny < 0 || nx >= w || ny >= h || nk in prev) return;
        if (nk !== gk && !walk(nx, ny)) return;
        prev[nk] = k; q.push([nx, ny]);
      });
    }
    return null;
  }

  /**
   * 結局插圖依主角性別選圖（美術 2026-10-26：E1、E5 有女生版 ending_e1_f、ending_e5_f；其他幾張不分）。
   * 結局過場這一版還沒接；之後接的時候用：EastFields.endingArt('e1', G.state.player.gender, function (k) { return !!J.Assets.art().ui[k]; })
   * has(key)＝那張圖有沒有放好（女生版還沒後製好時退回原本那張）
   */
  var GENDERED_ENDING = ['e1', 'e5'];
  function endingArt(step, gender, has) {
    var base = 'ending_' + step;
    return gender === 'f' && GENDERED_ENDING.indexOf(step) >= 0 && (!has || has(base + '_f')) ? base + '_f' : base;
  }

  /** 遺失物的選項：對的書架＋另外 3 座（固定順序，答錯再選時不換） */
  function lostChoices(P, it) {
    var cats = P.shelves.map(function (s) { return s.cat; }), i0 = cats.indexOf(it.cat);
    if (i0 < 0) return cats.slice(0, 4);
    var others = cats.filter(function (c) { return c !== it.cat; });
    var start = (it.id.length * 3) % others.length, pick = [];
    for (var k = 0; k < 3 && k < others.length; k++) pick.push(others[(start + k) % others.length]);
    var pos = (it.id.charCodeAt(0) || 0) % (pick.length + 1);
    pick.splice(pos, 0, it.cat);
    return pick;
  }

  var EastFields = { FIELDS: FIELDS, SUBJECTS: SUBJECTS, FOG: FOG, COMPASS_ITEM: COMPASS_ITEM, NO_MAP_TIP: NO_MAP_TIP, SIGN_TEXT: SIGN_TEXT, SHELF_ICON: SHELF_ICON, ARROW_MS: ARROW_MS,
    STARS_PER_CONSTELLATION: STARS_PER_CONSTELLATION, WAY_MAPS: WAY_MAPS, hasEast: hasEast, hasWayfinding: hasWayfinding, parse: parse, mergePuzzle: mergePuzzle, inRect: inRect, inXYWH: inXYWH, key: key,
    progress: progress, mark: mark, has: has, trialLampLit: trialLampLit, trialLampsAll: trialLampsAll, lostReturned: lostReturned, lostVisible: lostVisible,
    starsCollected: starsCollected, constellationFill: constellationFill, constellationsDone: constellationsDone, hasCompass: hasCompass, puzzleVisible: puzzleVisible,
    bossesDone: bossesDone, requirementMet: requirementMet, fogLevel: fogLevel, puzzleAt: puzzleAt, iceRoomAt: iceRoomAt, blockedCells: blockedCells,
    wayTarget: wayTarget, arrowAngle: arrowAngle, pathTo: pathTo, lostChoices: lostChoices, GENDERED_ENDING: GENDERED_ENDING, endingArt: endingArt, MARKER_SHELF: MARKER_SHELF };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.EastFields = EastFields; }
  if (typeof module !== 'undefined') module.exports = EastFields;
})();
