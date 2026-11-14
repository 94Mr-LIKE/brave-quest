/* 友善動物的保護區。blocked 只判斷格子，尋路時不顯示提示。 */
(function () {
  'use strict';
  var COOLDOWN_MS = 3000;
  var notices = new WeakMap();

  /** v4.2（K10）保護區可以寫 show: { after, until }（同 npcs[].show）：after 完成以後、until 完成以前才有。
   *  state 沒給時用遊戲目前的存檔；都沒有（資料檢查工具）時，有條件的保護區當成不在（不會一直擋路） */
  function currentState(state) { return state || (typeof window !== 'undefined' && window.JQ && window.JQ.Game && window.JQ.Game.state) || null; }
  function shown(a, state) {
    if (!a || !a.show) return true;
    var st = currentState(state);
    if (!st || !st.quests) return false;
    var done = function (id) { var r = st.quests[id]; return !!(r && r.status === 'done'); };
    return (!a.show.after || done(a.show.after)) && !(a.show.until && done(a.show.until));
  }
  function areas(map, state) { return map && Array.isArray(map.keepaway) ? map.keepaway.filter(function (a) { return shown(a, state); }) : []; }
  function validArea(a) {
    return a && Number.isInteger(a.x) && Number.isInteger(a.y) && Number.isInteger(a.radius) && a.radius >= 1 && a.radius <= 8;
  }
  function areaAt(map, x, y, state) {
    return areas(map, state).find(function (a) { return validArea(a) && Math.max(Math.abs(x - a.x), Math.abs(y - a.y)) < a.radius; }) || null;
  }
  function blocked(map, x, y, state) { return !!areaAt(map, x, y, state); }

  /** 只有玩家嘗試靠近才提示；同一張地圖、同一個區域各自計時。 */
  function warn(map, x, y, show, now) {
    var a = areaAt(map, x, y);
    if (!a) return false;
    if (now === undefined) now = Date.now();
    if (!show && typeof window !== 'undefined' && window.JQ && window.JQ.UI) show = window.JQ.UI.toast;
    if (typeof show !== 'function') return true;
    var times = notices.get(map);
    if (!times) { times = new Map(); notices.set(map, times); }
    var key = a.id || a;
    if (!times.has(key) || now - times.get(key) >= COOLDOWN_MS) {
      times.set(key, now);
      show(a.hint || '請和動物保持距離喔！');
    }
    return true;
  }

  /** 斜走時，兩側的保護區也算擋路；一次只顯示一則提示。 */
  function warnStep(map, x, y, direction, show, now) {
    if (!direction) return false;
    var dx = direction[0], dy = direction[1];
    if (warn(map, x + dx, y + dy, show, now)) return true;
    return !!(dx && dy && (warn(map, x + dx, y, show, now) || warn(map, x, y + dy, show, now)));
  }

  /** 給資料驗證工具使用；錯誤收集成陣列，不讓壞資料中斷整份檢查。 */
  function validate(map) {
    var errors = [];
    if (!map || map.keepaway === undefined) return errors;
    if (!Array.isArray(map.keepaway)) return ['keepaway 要是陣列'];
    var grid = map.grid || [], h = grid.length, w = h ? grid[0].length : 0, ids = new Set();
    map.keepaway.forEach(function (a, i) {
      var tag = 'keepaway[' + i + ']';
      if (!a || typeof a !== 'object' || Array.isArray(a)) { errors.push(tag + ' 要是物件'); return; }
      if (typeof a.id !== 'string' || !a.id.trim()) errors.push(tag + ' 要有 id');
      else if (ids.has(a.id)) errors.push(tag + ' id 重複：' + a.id);
      ids.add(a.id);
      if (!Number.isInteger(a.radius) || a.radius < 1 || a.radius > 8) errors.push(tag + ' radius 要是 1–8 的整數');
      if (!Number.isInteger(a.x) || !Number.isInteger(a.y) || a.x < 0 || a.y < 0 || a.x >= w || a.y >= h) errors.push(tag + ' 中心點要在地圖內的整數格');
      if (typeof a.hint !== 'string' || !a.hint.trim()) errors.push(tag + ' 要有 hint 提示');
    });
    return errors;
  }

  /**
   * v4.2.2（老闆 2026-11-14「M33帝雉記得分散跑」）：friendly 寫 wander: true 的動物可以走的格子＝自己保護區（同 id）裡、
   * 離中心 radius−2 格以內（主角被保護區擋在外面，所以動物走到哪裡都離主角 2 格以上、碰不到、不擋路）。
   * 沒有同 id 的保護區時用自己位置 ±2 格。walk(x, y)＝地形可不可以站（不看保護區）。回傳 [{x, y}]（由上到下、由左到右）
   */
  var WANDER_MARGIN = 2;
  function wanderTiles(map, f, walk) {
    if (!f || typeof walk !== 'function') return [];
    var a = (map && Array.isArray(map.keepaway) ? map.keepaway : []).filter(function (k) { return validArea(k) && k.id === f.id; })[0];
    var cx = a ? a.x : f.x, cy = a ? a.y : f.y, r = a ? a.radius - WANDER_MARGIN : WANDER_MARGIN, out = [];
    if (!Number.isInteger(cx) || !Number.isInteger(cy) || r < 0) return out;
    for (var y = cy - r; y <= cy + r; y++) for (var x = cx - r; x <= cx + r; x++) if (x >= 0 && y >= 0 && walk(x, y)) out.push({ x: x, y: y });
    return out;
  }

  var KeepAway = { shown: shown, blocked: blocked, warn: warn, warnStep: warnStep, validate: validate, COOLDOWN_MS: COOLDOWN_MS, WANDER_MARGIN: WANDER_MARGIN, wanderTiles: wanderTiles };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.KeepAway = KeepAway; }
  if (typeof module !== 'undefined') module.exports = KeepAway;
})();
