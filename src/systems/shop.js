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

  var Shop = { SHOP_TYPES: SHOP_TYPES, catalog: catalog, buy: buy, feedPet: feedPet };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.Shop = Shop; }
  if (typeof module !== 'undefined') module.exports = Shop;
})();
