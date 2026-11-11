/* v3.0 南部（70 號第七節）船班資料（codex3 的格式；wip_v30_draft/v30_apply.js 依 M24、M25 的 boat_dock 產生）。
 * from／to 的座標＝下船後站的格子（boat_dock.arrive）。只有東港⇄小琉球一條（綠島、蘭嶼在 v4.x，同一套）。航程時間不寫（兩個官方頁面寫法不同，70 號 2.12.4）。 */
(function () {
  'use strict';
  var ferries = [{
    "id": "F_DONGGANG_LIUQIU",
    "name": "東港⇄小琉球",
    "from": {
      "map": "M25",
      "x": 20,
      "y": 4,
      "dockLabel": "東港碼頭"
    },
    "to": {
      "map": "M24",
      "x": 27,
      "y": 9,
      "dockLabel": "小琉球碼頭"
    },
    "price": 200,
    "ticketItem": "ferry_ticket",
    "requires": "Q_ORC_4",
    "quest": "Q_LQ_0",
    "npc": {
      "from": "ticket_seller",
      "to": "boat_liuqiu"
    },
    "ticket": {
      "name": "東港⇄小琉球來回船票",
      "type": "key",
      "price": 0,
      "precious": true,
      "not_for_sale": true,
      "sprite": "item_ferry_ticket",
      "desc": "往返小琉球的船票，只賣來回。"
    },
    "dialog": {
      "buy": "D_FERRY_DONGGANG_LIUQIU_BUY",
      "noMoney": "D_FERRY_DONGGANG_LIUQIU_NO_MONEY",
      "locked": "D_FERRY_DONGGANG_LIUQIU_LOCKED",
      "board": "D_FERRY_DONGGANG_LIUQIU_BOARD",
      "arrive": "D_FERRY_DONGGANG_LIUQIU_ARRIVE",
      "intro": "D_LQ_0",
      "cutscene": "D_FERRY"
    },
    "dialogText": {
      "buy": "來回票要 {price} 塊。要買一張嗎？",
      "noMoney": "來回票要 {price} 塊喔",
      "locked": "海上的霧還很濃，船先不開喔。",
      "board": "船要開往{to}囉！",
      "arrive": "到{to}了！下船小心喔。"
    }
  }];
  if (typeof window !== 'undefined') window.FERRIES = ferries;
  if (typeof module !== 'undefined') module.exports = ferries;
})();
