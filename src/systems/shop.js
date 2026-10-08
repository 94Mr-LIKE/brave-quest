/*
 * 商店（v0.2）：道具店 general、武器店 weapon、防具店 armor
 * 只用遊戲金幣；不賣能力點數、沒有轉蛋、沒有真錢。
 * 商品清單：優先用 shops[shop_id]（id 陣列），沒有的話依道具 type 自動分類。
 */
(function () {
  'use strict';
  var SHOP_TYPES = {
    general: ['consumable', 'card', 'food'],
    item: ['consumable', 'card', 'food'],
    weapon: ['weapon'],
    armor: ['armor'],
    equipment: ['weapon', 'armor']
  };

  /** items: 已正規化的道具表 {id: {name,type,price,...}} */
  function catalog(shopId, items, shops) {
    if (shops && Array.isArray(shops[shopId])) {
      return shops[shopId].filter(function (id) { return items[id]; }).map(function (id) { return Object.assign({ id: id }, items[id]); });
    }
    var types = SHOP_TYPES[shopId] || SHOP_TYPES.general;
    return Object.keys(items).filter(function (id) {
      var it = items[id];
      return it.price > 0 && types.indexOf(it.type) >= 0 && !it.not_for_sale;
    }).map(function (id) { return Object.assign({ id: id }, items[id]); })
      .sort(function (a, b) { return a.price - b.price; });
  }

  /** 回傳 {ok, reason?, item} */
  function buy(state, id, items) {
    var it = items[id];
    if (!it || !(it.price > 0)) return { ok: false, reason: 'unknown' };
    if (state.player.coins < it.price) return { ok: false, reason: 'coins', item: it };
    state.player.coins -= it.price;
    state.inventory[id] = (state.inventory[id] || 0) + 1;
    return { ok: true, item: it };
  }

  /** 餵番薯仔：消耗 1 個點心，愛心 +1 */
  function feedPet(state) {
    if ((state.inventory.snack || 0) < 1) return { ok: false, reason: 'no-snack' };
    state.inventory.snack -= 1;
    state.pet.hearts += 1;
    state.pet.fed = (state.pet.fed || 0) + 1;
    return { ok: true, hearts: state.pet.hearts };
  }

  // ---------------------------------------------------------------- v0.9.1 賣東西（老闆 2026-10-09：舊裝備可以賣，原價 50%）
  var SELL_RATE = 0.5;
  /** 珍貴道具：職業專用裝備（轉職的獎勵、珍貴道具短曲）、或資料標了 precious／rare／not_for_sale */
  function isPrecious(it) { return !!(it && (it.precious || it.rare || it.not_for_sale || it.job)); }
  /** 進行中的打獵委託要收集的東西（任務道具），這時候不能賣 */
  function questNeeds(state, quests) {
    var need = {};
    Object.keys((state && state.quests) || {}).forEach(function (qid) {
      var s = state.quests[qid], q = quests && quests[qid];
      if (!q || !s || s.status === 'done') return;
      var h = q.hunt;
      if ((q.kind || q.type) === 'hunt' && h && h.item) need[String(h.item).replace(/^item_/, '')] = true;
    });
    return need;
  }
  /** 賣價：裝備和道具＝原價的 50%（無條件捨去）；素材照原本的收購價 */
  function sellPrice(it) {
    if (!it) return 0;
    if (it.type === 'material') return Math.floor(Number(it.sell) || 0);
    return Math.floor((Number(it.price) || 0) * SELL_RATE);
  }
  /**
   * 背包裡可以賣的清單：[{ id, item, have, equipped, count（能賣幾個）, price, ok, reason }]
   * reason：'equipped'（身上這件要先卸下）、'precious'（珍貴道具）、'quest'（委託要用）、'free'（不值錢）
   */
  function sellList(state, items, quests) {
    var need = questNeeds(state, quests), out = [];
    Object.keys(state.inventory || {}).forEach(function (id) {
      var it = items[id], have = state.inventory[id] || 0;
      if (!it || have <= 0) return;
      var equipped = state.equipment && (state.equipment.weapon === id || state.equipment.armor === id);
      var count = have - (equipped ? 1 : 0), price = sellPrice(it), reason = '';
      if (isPrecious(it)) reason = 'precious';
      else if (need[id]) reason = 'quest';
      else if (price <= 0) reason = 'free';
      else if (count <= 0) reason = 'equipped';
      out.push({ id: id, item: it, have: have, equipped: !!equipped, count: Math.max(0, count), price: price, ok: !reason, reason: reason });
    });
    var order = { weapon: 0, armor: 1, consumable: 2, card: 3, material: 4 };
    out.sort(function (a, b) { return (order[a.item.type] === undefined ? 9 : order[a.item.type]) - (order[b.item.type] === undefined ? 9 : order[b.item.type]) || (a.id < b.id ? -1 : 1); });
    return out;
  }
  /** 賣 1 個。回傳 { ok, price } 或 { ok:false, reason } */
  function sell(state, id, items, quests) {
    var e = sellList(state, items, quests).filter(function (x) { return x.id === id; })[0];
    if (!e) return { ok: false, reason: 'none' };
    if (!e.ok) return { ok: false, reason: e.reason };
    state.inventory[id] -= 1;
    if (state.inventory[id] <= 0) delete state.inventory[id];
    state.player.coins += e.price;
    return { ok: true, price: e.price, item: e.item };
  }

  var Shop = { SHOP_TYPES: SHOP_TYPES, catalog: catalog, buy: buy, feedPet: feedPet,
    SELL_RATE: SELL_RATE, isPrecious: isPrecious, questNeeds: questNeeds, sellPrice: sellPrice, sellList: sellList, sell: sell };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.Shop = Shop; }
  if (typeof module !== 'undefined') module.exports = Shop;
})();
