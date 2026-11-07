/* v4.0 東部（71 號第十一節、4.2）船班資料：富岡漁港 ⇄ 綠島南寮漁港、⇄ 蘭嶼開元港（codex3 的格式；wip_v40/v40_apply.js 依 M26、M27、M28 的 boat_dock 產生）。
 * v3.0 的 data/ferries.js（東港⇄小琉球）不動：本檔在它後面載入，把東部兩條接在 window.FERRIES 後面；node 測試可以 require 本檔拿到東部兩條。
 * from／to 的座標＝下船後站的格子（boat_dock.arrive）。各自來回 200 金幣（66 號）。 */
(function () {
  'use strict';
  var east = [
    {
      "id": "F_FUGANG_GREENISLAND",
      "name": "富岡⇄綠島",
      "from": {
        "map": "M26",
        "x": 81,
        "y": 49,
        "dockLabel": "富岡漁港"
      },
      "to": {
        "map": "M27",
        "x": 9,
        "y": 19,
        "dockLabel": "綠島南寮漁港"
      },
      "price": 200,
      "ticketItem": "ferry_ticket_gi",
      "requires": "Q_TT_3",
      "quest": "Q_GI_0",
      "npc": {
        "from": "ticket_seller_fg",
        "to": "boat_greenisland"
      },
      "ticket": {
        "name": "富岡⇄綠島來回船票",
        "type": "key",
        "price": 0,
        "precious": true,
        "not_for_sale": true,
        "sprite": "item_ferry_ticket_gi",
        "desc": "富岡漁港和綠島南寮漁港的來回船票。坐船大約 50 分鐘。"
      },
      "dialog": {
        "buy": "D_FERRY_FUGANG_GI_BUY",
        "noMoney": "D_FERRY_FUGANG_GI_NO_MONEY",
        "locked": "D_FERRY_FUGANG_GI_LOCKED",
        "board": "D_FERRY_FUGANG_GI_BOARD",
        "arrive": "D_FERRY_FUGANG_GI_ARRIVE",
        "intro": "D_GI_0",
        "cutscene": "D_FERRY"
      },
      "dialogText": {
        "buy": "來回票要 {price} 金幣。要買一張嗎？",
        "noMoney": "來回票要 {price} 金幣喔",
        "locked": "海上的霧還很濃，船先不開喔。",
        "board": "船要開往{to}囉！",
        "arrive": "到{to}了！下船小心喔。"
      }
    },
    {
      "id": "F_FUGANG_LANYU",
      "name": "富岡⇄蘭嶼",
      "from": {
        "map": "M26",
        "x": 81,
        "y": 49,
        "dockLabel": "富岡漁港"
      },
      "to": {
        "map": "M28",
        "x": 9,
        "y": 22,
        "dockLabel": "蘭嶼開元港"
      },
      "price": 200,
      "ticketItem": "ferry_ticket_ly",
      "requires": "Q_TT_3",
      "quest": "Q_LY_0",
      "npc": {
        "from": "ticket_seller_fg",
        "to": "boat_lanyu"
      },
      "ticket": {
        "name": "富岡⇄蘭嶼來回船票",
        "type": "key",
        "price": 0,
        "precious": true,
        "not_for_sale": true,
        "sprite": "item_ferry_ticket_ly",
        "desc": "富岡漁港和蘭嶼開元港的來回船票。坐船要 2 到 3 小時。"
      },
      "dialog": {
        "buy": "D_FERRY_FUGANG_LY_BUY",
        "noMoney": "D_FERRY_FUGANG_LY_NO_MONEY",
        "locked": "D_FERRY_FUGANG_LY_LOCKED",
        "board": "D_FERRY_FUGANG_LY_BOARD",
        "arrive": "D_FERRY_FUGANG_LY_ARRIVE",
        "intro": "D_LY_0",
        "cutscene": "D_FERRY"
      },
      "dialogText": {
        "buy": "來回票要 {price} 金幣。要買一張嗎？",
        "noMoney": "來回票要 {price} 金幣喔",
        "locked": "海上的霧還很濃，船先不開喔。",
        "board": "船要開往{to}囉！",
        "arrive": "到{to}了！下船小心喔。"
      }
    }
  ];
  if (typeof window !== 'undefined') window.FERRIES = (window.FERRIES || []).filter(function (r) { return !east.some(function (e) { return e.id === r.id; }); }).concat(east);
  if (typeof module !== 'undefined') module.exports = east;
})();
