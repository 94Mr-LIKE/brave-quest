/*
 * 台灣世界地圖：哪些地區解鎖了、點了要去哪裡
 * 資料：window.WORLD = { image?, regions: [{ id, name, map_entry, x, y, unlock_quest }] }（劇情設計師撰寫）
 *   map_entry：地圖 ID（例 "M01"，下車位置用 region 的 tx, ty，沒有就用該地圖的 start），或 { map, x, y }
 *   x, y：在世界地圖圖片上的位置；0～1 之間當成比例，大於 1 當成圖片像素座標
 *   unlock_quest：完成這個委託才解鎖；null／空字串＝一開始就解鎖
 *   unlock_visit：v1.1（59 號 2.7、4.6 節）去過這張地圖（state.visited[地圖 id]）才解鎖；可以是陣列。
 *                 和 unlock_quest 同時存在時兩個都要成立
 */
(function () {
  'use strict';

  function isUnlocked(region, state) {
    var TM = (typeof window !== 'undefined' && window.JQ && window.JQ.TestMode) || (typeof window === 'undefined' && typeof require === 'function' ? require('./testmode.js') : null);   // v1.3.1 測試模式（大人試玩）：全部解鎖
    if (TM && TM.on()) return true;
    var q = region.unlock_quest, v = region.unlock_visit;
    var qs = !q ? [] : Array.isArray(q) ? q : [q];
    var vs = !v ? [] : Array.isArray(v) ? v : [v];
    var quests = (state && state.quests) || {}, visited = (state && state.visited) || {};
    return qs.every(function (id) { return quests[id] && quests[id].status === 'done'; }) &&
      vs.every(function (m) { return visited[m] === true; });
  }

  /**
   * v1.1 審查必改 1：還沒解鎖的地區要寫什麼（世界地圖清單、圓點的說明）。
   * unlock_quest 先濾掉空值（null／''，舊寫法會變成「完成「null」才能去」）；有 state 時只列還沒完成的委託。
   *   只有委託     → 完成「A」、「B」才能去
   *   只有去過     → 先走路去過一次才能搭車
   *   兩個都有     → 完成「A」，先走路去過一次才能搭車
   * quests＝QUESTS（拿標題用）；回傳 ''＝沒有條件
   */
  function lockText(region, quests, state) {
    var q = region.unlock_quest, v = region.unlock_visit;
    var qs = (Array.isArray(q) ? q : [q]).filter(function (id) { return typeof id === 'string' && id; });
    var vs = (Array.isArray(v) ? v : [v]).filter(function (id) { return typeof id === 'string' && id; });
    if (state) {
      var done = (state.quests) || {}, visited = state.visited || {};
      qs = qs.filter(function (id) { return !(done[id] && done[id].status === 'done'); });
      vs = vs.filter(function (m) { return visited[m] !== true; });
    }
    var need = qs.map(function (id) { var t = quests && quests[id]; return '「' + (t && t.title ? t.title : id) + '」'; }).join('、');
    if (vs.length) return (need ? '完成' + need + '，' : '') + '先走路去過一次才能搭車';
    return need ? '完成' + need + '才能去' : '';
  }

  /** 回傳 [{id, name, x, y, unlocked, here}] */
  /** v4.2 4c 夜班：hide_locked 的地區（R_YUSHAN，破關後才出現）還沒解鎖時整個不出現（不畫點、不列清單、不掛下一步旗） */
  function visible(r, state) { return !(r && r.hide_locked === true) || isUnlocked(r, state); }
  function regions(world, state, currentMap) {
    return ((world && world.regions) || []).filter(function (r) { return visible(r, state); }).map(function (r) {
      var e = entry(r, null);
      return { id: r.id, name: r.name || r.id, x: r.x, y: r.y, unlocked: isUnlocked(r, state), here: !!(e && e.map === currentMap), raw: r };
    });
  }

  /** 進入點：{map, x, y}；maps 有給時，沒寫座標就用該地圖的 start */
  function entry(region, maps) {
    var e = region.map_entry;
    if (!e) return null;
    if (typeof e === 'string') {
      if (region.tx !== undefined && region.ty !== undefined) return { map: e, x: region.tx, y: region.ty };
      var m = maps && maps[e];
      var s = m && m.start;
      return { map: e, x: s ? s.x : undefined, y: s ? s.y : undefined };
    }
    return { map: e.map, x: e.x, y: e.y };
  }

  /** 換算成圖片上的比例位置（0～1） */
  function fraction(region, imgW, imgH) {
    var x = Number(region.x || 0), y = Number(region.y || 0);
    if (x > 1 || y > 1) return { fx: imgW ? x / imgW : 0, fy: imgH ? y / imgH : 0 };
    return { fx: x, fy: y };
  }

  /**
   * v0.9.6（47 號 B04）世界地圖北部的圓點疊在一起、點不到：把圓點在畫面上（像素）推開，圓心之間至少 minDist，
   * 而且都留在 0～w、0～h 裡（離邊 margin）。真正的位置不動，畫面另外畫一條細線連回去。
   * pts = [{x, y}]（像素）→ 回傳新的 [{x, y}]。固定次數的推開（同樣的輸入一定得到同樣的結果）
   */
  function spreadDots(pts, minDist, w, h, margin) {
    var m = margin === undefined ? minDist / 2 : margin;
    var out = pts.map(function (p) { return { x: Math.max(m, Math.min(w - m, p.x)), y: Math.max(m, Math.min(h - m, p.y)) }; });
    for (var it = 0; it < 200; it++) {
      var moved = false;
      for (var i = 0; i < out.length; i++) for (var j = i + 1; j < out.length; j++) {
        var dx = out[j].x - out[i].x, dy = out[j].y - out[i].y, d = Math.sqrt(dx * dx + dy * dy);
        if (d >= minDist - 0.01) continue;
        if (d < 0.01) { var a = (i * 2.399 + j * 1.3); dx = Math.cos(a); dy = Math.sin(a); d = 1; }   // 完全重疊：依編號決定方向
        var push = (minDist - d) / 2 + 0.5, ux = dx / d, uy = dy / d;
        out[i].x -= ux * push; out[i].y -= uy * push; out[j].x += ux * push; out[j].y += uy * push;
        moved = true;
      }
      out.forEach(function (p) { p.x = Math.max(m, Math.min(w - m, p.x)); p.y = Math.max(m, Math.min(h - m, p.y)); });
      if (!moved) break;
    }
    return out;
  }
  /** 兩兩之間最近的距離（測試用） */
  function minGap(pts) {
    var best = Infinity;
    for (var i = 0; i < pts.length; i++) for (var j = i + 1; j < pts.length; j++) best = Math.min(best, Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y));
    return best;
  }

  /*
   * v2.2.1（v20_畫面審查 缺陷 1；老闆 2026-11-02「照建議」＝方案 A）：手機小畫面的世界地圖，北部的點合成一個「北部」圓點，按了才放大北部。
   *   北部：地區寫 group: 'north' 就算、寫 group: 'none' 就不算；沒寫時看圖上位置 y（比例）< NORTH_MAX_Y（目前 18 個：金包里～新竹風城；苗栗 0.268 以南不算）。
   *   門檻 collapseFor(視窗寬, 高)：寬 ≤ 680（直放手機）或高 ≤ 460（橫放手機）才合併——和 dom.js 的 narrowPortrait／lowScreen、style.css 的手機斷點一樣；
   *   電腦、平板（寬 > 680 而且高 > 460）維持原樣全部畫。
   */
  var NORTH_MAX_Y = 0.25, COLLAPSE_MAX_W = 680, COLLAPSE_MAX_H = 460;
  function isNorth(raw, f) {
    var g = raw && raw.group;
    if (g === 'north') return true;
    if (g === 'none') return false;
    return !!f && Number(f.fy) < NORTH_MAX_Y;
  }
  /** raws＝地區資料、fracs＝同順序的比例位置（fraction）→ 北部的索引 */
  function northIndexes(raws, fracs) {
    var out = [];
    (fracs || []).forEach(function (f, i) { if (isNorth(raws && raws[i], f)) out.push(i); });
    return out;
  }
  function collapseFor(vw, vh) { return (vw > 0 && vw <= COLLAPSE_MAX_W) || (vh > 0 && vh <= COLLAPSE_MAX_H); }
  /** 幾個點的平均位置（北部合併點放這裡） */
  function centroid(fracs) {
    var n = (fracs || []).length, x = 0, y = 0;
    if (!n) return { fx: 0.5, fy: 0.5 };
    fracs.forEach(function (f) { x += f.fx; y += f.fy; });
    return { fx: x / n, fy: y / n };
  }
  /**
   * 放大北部：fracs＝北部各點 → { s, x0, y0 }：放大 s 倍後畫面看到的是圖上 [x0, x0+1/s]×[y0, y0+1/s]（比例）。
   * 北部外加 pad 剛好放得下、置中，不超出圖（1 ≤ s ≤ maxScale）。圖用 transform: scale(s) translate(−x0, −y0)，點用 zoomPoint 換算
   */
  function zoomBox(fracs, pad, maxScale) {
    pad = pad === undefined ? 0.04 : pad; maxScale = maxScale || 3;
    if (!fracs || !fracs.length) return { s: 1, x0: 0, y0: 0 };
    var x1 = 1, x2 = 0, y1 = 1, y2 = 0;
    fracs.forEach(function (f) { x1 = Math.min(x1, f.fx); x2 = Math.max(x2, f.fx); y1 = Math.min(y1, f.fy); y2 = Math.max(y2, f.fy); });
    x1 = Math.max(0, x1 - pad); x2 = Math.min(1, x2 + pad); y1 = Math.max(0, y1 - pad); y2 = Math.min(1, y2 + pad);
    var s = Math.max(1, Math.min(maxScale, 1 / Math.max(x2 - x1, y2 - y1, 1e-6))), v = 1 / s;
    return { s: s, x0: Math.max(0, Math.min(1 - v, (x1 + x2) / 2 - v / 2)), y0: Math.max(0, Math.min(1 - v, (y1 + y2) / 2 - v / 2)) };
  }
  function zoomPoint(f, box) { return { fx: (f.fx - box.x0) * box.s, fy: (f.fy - box.y0) * box.s }; }

  var WorldMap = { visible: visible, lockText: lockText, spreadDots: spreadDots, minGap: minGap, isUnlocked: isUnlocked, regions: regions, entry: entry, fraction: fraction,
    NORTH_MAX_Y: NORTH_MAX_Y, COLLAPSE_MAX_W: COLLAPSE_MAX_W, COLLAPSE_MAX_H: COLLAPSE_MAX_H, isNorth: isNorth, northIndexes: northIndexes, collapseFor: collapseFor, centroid: centroid, zoomBox: zoomBox, zoomPoint: zoomPoint };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.WorldMap = WorldMap; }
  if (typeof module !== 'undefined') module.exports = WorldMap;
})();
