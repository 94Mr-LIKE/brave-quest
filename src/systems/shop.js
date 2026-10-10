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
    var st = state; if (st.startItems && (st.startItems['snack'] || 0) > (st.inventory['snack'] || 0)) { if (st.inventory['snack'] > 0) st.startItems['snack'] = st.inventory['snack']; else delete st.startItems['snack']; }   // v0.9.2 先用掉一開始給的
    state.pet.hearts += 1;
    state.pet.fed = (state.pet.fed || 0) + 1;
    return { ok: true, hearts: state.pet.hearts };
  }

  // ---------------------------------------------------------------- 賣東西（v0.9.2，老闆 2026-10-09 裁示）
  // 裝備（武器、防具）原價 50%；道具（藥草、點心、卡片等在商店買的消耗品）原價 25%。一律無條件捨去。
  // 素材（怪物掉落、交打獵委託用）一律不能賣，也沒有收購價（老闆 2026-10-09 補充裁示：任務素材不能賣）。
  // 不能賣：重要任務道具（委託或主線要用的、資料標了 precious／rare／not_for_sale／quest）、建立角色時一開始給的（startItems）、
  //         身上正在裝備的那一件。職業專用裝備不是初始品就可以賣。
  var EQUIP_RATE = 0.5, ITEM_RATE = 0.25;
  var SELL_RATE = EQUIP_RATE;
  /** 資料標記的重要道具（劇情關鍵、珍貴、不賣） */
  function isPrecious(it) { return !!(it && (it.precious || it.rare || it.not_for_sale || it.quest)); }
  /** 主線或委託要用的東西：還沒完成的打獵委託要收集的（還沒接的也算，免得先賣掉） */
  function questNeeds(state, quests) {
    var need = {};
    Object.keys(quests || {}).forEach(function (qid) {
      var q = quests[qid], s = state && state.quests && state.quests[qid];
      if (!q || (s && s.status === 'done')) return;
      var h = q.hunt;
      if ((q.kind || q.type) === 'hunt' && h && h.item) need[String(h.item).replace(/^item_/, '')] = true;
    });
    return need;
  }
  /** 賣價（整數，無條件捨去） */
  function sellPrice(it) {
    if (!it) return 0;
    if (it.type === 'material') return 0;   // 任務素材不收購
    if (it.type === 'weapon' || it.type === 'armor') return Math.floor((Number(it.price) || 0) * EQUIP_RATE);
    return Math.floor((Number(it.price) || 0) * ITEM_RATE);
  }
  /**
   * 一開始給的還剩幾個：startItems 記的數量和背包裡的數量取小的（一開始給的算最後用掉，
   * 所以「之後自己買的、拿到的」永遠先算可以賣的那一份）
   */
  function startLeft(state, id) {
    var n = Number(((state && state.startItems) || {})[id]) || 0;
    return Math.max(0, Math.min(n, (state.inventory || {})[id] || 0));
  }
  /**
   * 背包裡可以賣的清單：[{ id, item, have, equipped, start（一開始給的幾個）, count（能賣幾個）, price, ok, reason }]
   * reason：'material'（任務素材）、'quest'（重要任務道具）、'start'（一開始拿到的）、'equipped'（身上這件要先卸下）、'free'（不值錢）
   */
  function sellList(state, items, quests) {
    var need = questNeeds(state, quests), out = [];
    Object.keys(state.inventory || {}).forEach(function (id) {
      var it = items[id], have = state.inventory[id] || 0;
      if (!it || have <= 0) return;
      var equipped = !!(state.equipment && (state.equipment.weapon === id || state.equipment.armor === id));
      var start = startLeft(state, id);
      var count = have - start - (equipped ? 1 : 0);
      // 身上那件如果就是一開始給的，不重複扣
      if (equipped && start > 0) count = have - Math.max(start, 1);
      var price = sellPrice(it), reason = '';
      if (it.type === 'material') reason = 'material';
      else if (isPrecious(it) || need[id]) reason = 'quest';
      else if (price <= 0) reason = 'free';
      else if (count <= 0) reason = start > 0 ? 'start' : 'equipped';
      out.push({ id: id, item: it, have: have, equipped: equipped, start: start, count: Math.max(0, count), price: price, ok: !reason, reason: reason });
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
    SELL_RATE: SELL_RATE, EQUIP_RATE: EQUIP_RATE, ITEM_RATE: ITEM_RATE, isPrecious: isPrecious, questNeeds: questNeeds, sellPrice: sellPrice, startLeft: startLeft, sellList: sellList, sell: sell };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.Shop = Shop; }
  if (typeof module !== 'undefined') module.exports = Shop;
})();
