/*
 * 勇者大冒險 — 道具與商店（07 第 6.6 節）
 * 撰寫：遊戲劇情設計師＋關卡設計
 *
 * id 沿用 v0.1：eraser（刪去卡）、guide（引導卡）、snack（番薯仔點心），舊存檔的 items 不用轉換。
 * kind：consumable（消耗品）/ card（答題輔助卡）/ weapon / armor / material（素材，打獵委託要收集的）
 * 裝備欄位：atk / def / mp；jobs＝建議職業（null＝誰都能裝）。數值依 07 第 5 節：木劍 ATK+3 50 金、皮衣 DEF+2 40 金。
 * 價格依據【推論】：地圖等級 1 結束時大約有 100–150 金（教學委託 100＋寶箱＋小怪），買得起木劍＋皮衣；
 *   地圖等級 3 前約有 400–600 金，買得起一把 180–220 的職業武器。
 * sell：素材可以賣給商店換一點金幣（v0.1 沒有賣出功能；前端若不做可忽略）。
 * 本檔只賣道具與裝備，不賣真錢、沒有轉蛋。
 */
window.ITEMS = {
  // ── 消耗品與答題卡 ──
  herb:   { name: "藥草",       sprite: "item_herb",        kind: "consumable", price: 10, effect: { hp: 20 },           desc: "吃了可以回復 20 點體力。" },
  snack:  { name: "番薯仔點心", sprite: "item_snack",       kind: "consumable", price: 15, effect: { hp: 10, pet: 1 },   desc: "番薯仔最愛的烤地瓜點心，回復 10 點體力。" },
  eraser: { name: "刪去卡",     sprite: "item_card_remove", kind: "card",       price: 30, effect: { remove_option: 1 }, desc: "選擇題可以刪掉一個錯的選項。" },
  guide:  { name: "引導卡",     sprite: "item_card_guide",  kind: "card",       price: 40, effect: { hint_level: 4 },    desc: "打開第 3、4 層提示，告訴你課本哪裡有教。" },

  // ── 武器 ──
  wood_sword: { name: "木劍",     sprite: "item_wood_sword", kind: "weapon", price: 50,  atk: 3, def: 0, mp: 0, jobs: null,          desc: "輕輕的木劍，新手也拿得動。" },
  iron_sword: { name: "鐵劍",     sprite: "item_iron_sword", kind: "weapon", price: 220, atk: 8, def: 0, mp: 0, jobs: null,          desc: "鐵匠師傅打的好劍。劍士用最順手。" },
  staff:      { name: "星光法杖", sprite: "item_staff",      kind: "weapon", price: 180, atk: 5, def: 0, mp: 8, jobs: ["mage"],      desc: "頂端有小星星的法杖，魔法師專用。" },
  bow:        { name: "海風弓",   sprite: "item_bow",        kind: "weapon", price: 200, atk: 7, def: 0, mp: 0, jobs: ["archer"],    desc: "輕巧的弓，弓箭手專用。" },
  harp:       { name: "貝殼豎琴", sprite: "item_harp",       kind: "weapon", price: 180, atk: 4, def: 0, mp: 6, jobs: ["bard"],      desc: "用貝殼裝飾的小豎琴，吟遊詩人專用。" },
  rod:        { name: "祈願杖",   sprite: "item_rod",        kind: "weapon", price: 180, atk: 4, def: 1, mp: 6, jobs: ["priest"],    desc: "暖暖發光的手杖，祭司專用。" },

  // ── 防具 ──
  leather: { name: "皮衣", sprite: "item_leather", kind: "armor", price: 40,  atk: 0, def: 2, mp: 0, jobs: null, desc: "耐穿的冒險皮衣。" },
  robe:    { name: "法袍", sprite: "item_robe",    kind: "armor", price: 150, atk: 0, def: 4, mp: 5, jobs: null, desc: "織了防霧花紋的長袍，誰都能穿。" },

  // ── 素材（打獵委託）──
  sticky_ball:  { name: "黏黏球",     sprite: "item_sticky_ball",  kind: "material", price: 0, sell: 2,  desc: "迷糊團子身上掉下來的黏黏球，可以補洞。" },
  mushroom_cap: { name: "毒菇帽",     sprite: "item_mushroom_cap", kind: "material", price: 0, sell: 3,  desc: "毒菇怪的帽子。精靈長老拿來研究霧。不能吃喔！" },
  feather:      { name: "羽毛",       sprite: "item_feather",      kind: "material", price: 0, sell: 3,  desc: "白白的羽毛，可以做成羽毛筆。" },
  bat_wing:     { name: "夜翼徽章",   sprite: "item_bat_wing",     kind: "material", price: 0, sell: 4,  desc: "蝙蝠翅膀形狀的小徽章，是蝙蝠們撿來的寶物。" },
  crystal:      { name: "回音水晶",   sprite: "item_crystal",      kind: "material", price: 0, sell: 10, desc: "對它說話，會小小聲地回答你。" },
  gear:         { name: "齒輪",       sprite: "item_gear",         kind: "material", price: 0, sell: 5,  desc: "地精做機關用的齒輪。" },
  scroll:       { name: "告示卷軸",   sprite: "item_scroll",       kind: "material", price: 0, sell: 2,  desc: "哥布林部落的告示碎片，拼起來就能讀。" },
  key:          { name: "柵欄鑰匙",   sprite: "item_key",          kind: "material", price: 0, sell: 2,  desc: "獸人營地柵欄的鑰匙。" }
};

/* 商店：shop_id 對應 maps.js 的 shop.shop_id / extra_shops[].shop_id */
window.SHOPS = {
  general: { name: "老街雜貨店",   items: ["herb", "snack", "eraser", "guide", "wood_sword", "leather"] },
  item:    { name: "山城市場道具攤",     items: ["herb", "snack", "eraser", "guide"] },
  weapon:  { name: "山城武器鋪",     items: ["wood_sword", "iron_sword", "staff", "bow", "harp", "rod"] },
  armor:   { name: "山城防具店",     items: ["leather", "robe"] }
};
