/* 船票與船班規則。次數和出發端隨一般存檔保存；不依賴 Phaser 或 DOM。 */
(function () {
  'use strict';
  var isNode = typeof module !== 'undefined' && typeof require === 'function';
  var defaults = isNode ? require('../../data/ferries.js') : (window.FERRIES || []);
  var World = isNode ? require('./world.js') : window.JQ.World;
  var own = function (o, k) { return Object.prototype.hasOwnProperty.call(o, k); };
  var object = function (v) { return !!v && typeof v === 'object' && !Array.isArray(v); };
  var safeId = function (v) { return typeof v === 'string' && /^[A-Za-z][A-Za-z0-9_-]*$/.test(v) && ['constructor', 'prototype'].indexOf(v) < 0; };
  var sideOK = function (v) { return v === 'from' || v === 'to'; };
  var fail = function (reason) { return { ok: false, reason: reason }; };

  function source(data) {
    if (Array.isArray(data)) return data;
    return (data && (data.ferries || data.FERRIES)) || defaults;
  }

  /** 航線副本；傳入 {ferries, maps} 時，依地圖是否備妥計算 pending。 */
  function routes(data) {
    var list = source(data), maps = data && data.maps;
    if (!Array.isArray(list)) return [];
    return list.filter(object).map(function (r) {
      var pending = maps ? !(r.from && r.to && own(maps, r.from.map) && own(maps, r.to.map)) : !!r.pending;
      return Object.assign({}, r, { pending: pending });
    });
  }

  /** 舊存檔第一次進遊戲／使用船班時補欄位；不接受負數、字串或超過兩次的票。 */
  function ensure(state) {
    if (!object(state.ferry)) state.ferry = {};
    var f = state.ferry;
    if (!object(f.tickets)) f.tickets = {};
    if (!object(f.origins)) f.origins = {};
    Object.keys(f.tickets).forEach(function (id) {
      var n = f.tickets[id];
      if (!safeId(id) || !Number.isInteger(n) || n < 0 || n > 2) delete f.tickets[id];
    });
    Object.keys(f.origins).forEach(function (id) {
      if (!own(f.tickets, id) || !f.tickets[id] || !sideOK(f.origins[id])) delete f.origins[id];
    });
    return f;
  }

  /** 合併票券到原始或正規化的道具表；已定義的同 ID 道具保持原樣。 */
  function registerItems(items, data) {
    routes(data).forEach(function (r) {
      if (safeId(r.ticketItem) && object(r.ticket) && !own(items, r.ticketItem)) {
        items[r.ticketItem] = Object.assign({}, r.ticket, { precious: true, not_for_sale: true });
      }
    });
    return items;
  }
  function install(data, definitions) {
    data.ferries = definitions || defaults;
    registerItems(data.items, data.ferries);
  }

  function validRoute(r) {
    return r && safeId(r.id) && safeId(r.ticketItem) && Number.isSafeInteger(r.price) && r.price >= 0 &&
      ['from', 'to'].every(function (side) {
        var e = r[side];
        return object(e) && safeId(e.map) && Number.isInteger(e.x) && e.x >= 0 && Number.isInteger(e.y) && e.y >= 0;
      }) && r.from.map !== r.to.map;
  }
  function unlocked(state, r) {
    var req = r.requires;
    if (!req) return true;
    return (Array.isArray(req) ? req : [req]).every(function (id) {
      return state.quests && own(state.quests, id) && state.quests[id].status === 'done';
    });
  }
  function atSide(state, r) {
    var map = state.location && state.location.map;
    return map === r.from.map ? 'from' : map === r.to.map ? 'to' : null;
  }
  /** context 可傳 G，直接沿用既有 blocked()；純規則測試也可傳 busy／battleCtx。 */
  function busy(state, context) {
    function blocked(c) {
      return !!(c && ((typeof c.blocked === 'function' && c.blocked()) || c.busy || c.inTrial || c.mapChanging ||
        (c.battleCtx && !c.battleCtx.over) || (c.mapScene && c.mapScene.transitioning)));
    }
    return blocked(state) || blocked(context);
  }
  function available(state, r, context) {
    ensure(state);
    if (!validRoute(r)) return fail('route');
    if (busy(state, context)) return fail('busy');
    if (!unlocked(state, r)) return fail('locked');
    if (r.pending) return fail('pending');
    return { ok: true };
  }
  function canBuy(state, r, context) {
    var check = available(state, r, context);
    if (!check.ok) return check;
    if (!atSide(state, r)) return fail('location');
    if (state.ferry.tickets[r.id] > 0) return fail('ticket');
    if (!state.player || !Number.isFinite(state.player.coins) || state.player.coins < r.price) return fail('coins');
    return { ok: true };
  }
  function buy(state, r, items, context) {
    var check = canBuy(state, r, context);
    if (!check.ok) return check;
    registerItems(items, [r]);
    state.player.coins -= r.price;
    state.ferry.tickets[r.id] = 2;
    state.ferry.origins[r.id] = atSide(state, r);
    if (!object(state.inventory)) state.inventory = {};
    state.inventory[r.ticketItem] = 1;
    if (r.quest && object(state.quests) && !(own(state.quests, r.quest) && object(state.quests[r.quest]) && state.quests[r.quest].status === 'done')) state.quests[r.quest] = { status: 'done', progress: 0 };   // v3.0：買到票＝Q_LQ_0 完成（70 號 4.3）
    return { ok: true, remaining: 2, item: items[r.ticketItem] };
  }
  function canBoard(state, r, side, context) {
    var check = available(state, r, context);
    if (!check.ok) return check;
    if (!sideOK(side)) return fail('side');
    if (atSide(state, r) !== side) return fail('location');
    var n = state.ferry.tickets[r.id];
    if (!(n > 0)) return fail('ticket');
    // 僅有次數的舊資料：2 次時以所在端為出發端；1 次時保留回到另一端的機會。
    var origin = state.ferry.origins[r.id];
    if (origin && (n === 2 ? side !== origin : side === origin)) return fail('direction');
    return { ok: true };
  }
  /** 成功回傳 {ok:true, map,x,y,remaining}；只扣票，由呼叫端同步換地圖。 */
  function board(state, r, side, context) {
    var check = canBoard(state, r, side, context);
    if (!check.ok) return check;
    var f = state.ferry, dest = r[side === 'from' ? 'to' : 'from'];
    if (f.tickets[r.id] === 2 && !f.origins[r.id]) f.origins[r.id] = side;
    var left = --f.tickets[r.id];
    if (!left) { delete f.origins[r.id]; if (state.inventory) delete state.inventory[r.ticketItem]; }
    return { ok: true, map: dest.map, x: dest.x, y: dest.y, remaining: left };
  }

  /** 和 World.validate 一樣回傳錯誤字串陣列；pending 只豁免缺圖，不豁免壞資料。 */
  function validate(data) {
    var errors = [], list = source(data), ids = {}, tickets = {}, maps = data && data.maps;
    if (!Array.isArray(list)) return ['船班資料必須是陣列'];
    list.forEach(function (r, index) {
      var label = '[船班 ' + (r && r.id || index) + '] ';
      function error(text) { errors.push(label + text); }
      if (!validRoute(r)) { error('ID、票價或碼頭座標不正確'); return; }
      if (own(ids, r.id)) error('航線 ID 重複'); ids[r.id] = true;
      if (own(tickets, r.ticketItem)) error('不同航線不能共用票券 ID'); tickets[r.ticketItem] = true;
      if (!r.name || !r.ticket || !r.ticket.name || r.ticket.type !== 'key' || !r.ticket.precious || !r.ticket.not_for_sale) error('票券必須是不能賣的珍貴道具');
      if (r.pending !== undefined && typeof r.pending !== 'boolean') error('pending 必須是布林值');
      ['buy', 'noMoney', 'locked', 'board', 'arrive'].forEach(function (k) {
        if (!r.dialog || !/^D_FERRY_[A-Z0-9_]+$/.test(r.dialog[k]) || !r.dialogText || typeof r.dialogText[k] !== 'string' || !r.dialogText[k].trim()) error('缺少 D_FERRY 對白或華語預設句：' + k);
      });
      var req = r.requires ? (Array.isArray(r.requires) ? r.requires : [r.requires]) : [];
      req.forEach(function (id) { if (!safeId(id) || (data.quests && !own(data.quests, id))) error('前置委託不存在：' + id); });
      ['from', 'to'].forEach(function (side) {
        var e = r[side], m = maps && maps[e.map];
        if (!e.dockLabel || !r.npc || !safeId(r.npc[side])) error('缺少碼頭名稱或售票 NPC：' + side);
        if (!maps) return;
        if (!m) { if (!r.pending) error('地圖尚未建立，請標 pending: true：' + e.map); return; }
        var block = World.blockers(m);
        (m.lamps || []).concat(m.exits || []).forEach(function (p) { block[p.x + ',' + p.y] = true; });
        if (m.inn && !m.inn.npc) block[m.inn.x + ',' + m.inn.y] = true;
        if (!World.isWalkable(data.tilesets || {}, m, e.x, e.y, block)) error('下船格不能站立：' + e.map);
      });
    });
    return errors;
  }

  var Ferry = { routes: routes, ensure: ensure, registerItems: registerItems, install: install,
    canBuy: canBuy, buy: buy, canBoard: canBoard, board: board, validate: validate };
  if (typeof window !== 'undefined') {
    window.JQ = window.JQ || {}; window.JQ.Ferry = Ferry;
    registerItems(window.ITEMS || (window.ITEMS = {}), window.FERRIES || defaults);
  }
  if (typeof module !== 'undefined') module.exports = Ferry;
})();
