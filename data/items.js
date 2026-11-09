/*
 * 勇者大冒險 — 道具與商店（07 第 6.6 節）
 * 撰寫：遊戲劇情設計師＋關卡設計
 *
 * id 沿用 v0.1：eraser（刪去卡）、guide（引導卡）、snack（番薯仔點心），舊存檔的 items 不用轉換。
 * kind：consumable（消耗品）/ card（答題輔助卡）/ weapon / armor / material（素材，打獵委託要收集的）
 * 裝備欄位：atk / def / mp；fam＝類別（48 號 F2）；jobs＝專屬武器限定的職業（null＝看類別）；fx＝特效。數值依 07 第 5 節：木劍 ATK+3、皮衣 DEF+2（價格見下）。
 * 價格依 40 號報告（40_物價與住宿收費調整.md 第 6 節，老闆 2026-10-10 核准；法袍改 4,000）：
 *   藥草 15、點心 20、刪去卡 40、引導卡 50、木劍 120、皮衣 100、職業武器 650／720、鐵劍 800、法袍 4,000。舊存檔的金幣不動。
 * 素材是怪物掉落、交打獵委託用的任務素材：不賣、也不收購（老闆 2026-10-09 裁示，已拿掉原本的 sell 收購價）。
 * 本檔只賣道具與裝備，不賣真錢、沒有轉蛋。
 */
window.ITEMS = {
  // v4.1 中橫・南投：素材不收購；兩件關鍵道具留在包包。防寒衣定價 3900。
  snow_crystal: {"name":"雪花結晶","sprite":"item_snow_crystal","kind":"material","price":0,"desc":"雪球寶寶清醒後留下的雪花結晶。"},
  bamboo_husk: {"name":"筍殼","sprite":"item_bamboo_husk","kind":"material","price":0,"desc":"筍筍竹筍妖清醒後留下的筍殼。"},
  cedar_cone: {"name":"杉樹毬果","sprite":"item_cedar_cone","kind":"material","price":0,"desc":"毬毬杉果精清醒後留下的杉樹毬果。"},
  small_lantern: {"name":"小燈籠","sprite":"item_small_lantern","kind":"material","price":0,"desc":"森林夜遊白鼻心清醒後還回的小燈籠。"},
  forest_lantern: {"name":"森林燈籠","sprite":"item_forest_lantern","kind":"key","price":0,"precious":true,"desc":"夜遊團長清醒後送你的森林燈籠。"},
  dawn_compass: {"name":"曙光羅盤","sprite":"item_dawn_compass","kind":"key","price":0,"precious":true,"desc":"四片曙光碎片合成的羅盤，指針指向玉山。"},
  gear_z13_coat: {"name":"高山防寒衣","sprite":"item_gear_z13_coat","kind":"armor","fam":"gen","price":3900,"atk":0,"def":14,"mp":0,"jobs":null,"desc":"上山保暖的防寒衣。大家都能穿。"},
  // ── 消耗品與答題卡 ──
  herb:   { name: "藥草",       sprite: "item_herb",        kind: "consumable", price: 12, effect: { hp: 20 },           desc: "吃了可以回復 20 點體力。" },
  snack:  { name: "番薯仔點心", sprite: "item_snack",       kind: "consumable", price: 15, effect: { hp: 10, pet: 1 },   desc: "番薯仔最愛的烤地瓜點心，回復 10 點體力。" },
  eraser: { name: "刪去卡",     sprite: "item_card_remove", kind: "card",       price: 60, effect: { remove_option: 1 }, desc: "選擇題可以刪掉一個錯的選項。" },
  guide:  { name: "引導卡",     sprite: "item_card_guide",  kind: "card",       price: 80, effect: { hint_level: 4 },    desc: "打開第 3、4 層提示，告訴你課本哪裡有教。" },

  // ── 武器（v1.0 第一批：48 號 v2 第 3.2 節）──
  // fam＝26 號的武器類別（gen＝通用，大家都能用，含見習）；jobs＝專屬武器限定的職業；fx.dmg＝特效「攻擊傷害 +x」（普通攻擊和攻擊技能都乘上 1＋x）
  // 專屬武器攻擊都和鋼劍一樣 10（法杖 9＋魔力），畫面上的物攻劍士永遠最高；其他職業靠特效拉近（老闆 2026-10-12）
  wood_sword:   { name: "木劍",     sprite: "item_wood_sword", kind: "weapon", fam: "gen",     price: 60,  atk: 3,  def: 0, mp: 0, jobs: null,          desc: "輕輕的木劍，新手也拿得動。大家都能用。" },
  iron_sword:   { name: "鐵劍",     sprite: "item_iron_sword", kind: "weapon", fam: "gen",     price: 270,  atk: 8,  def: 0, mp: 0, jobs: null,          desc: "鐵匠師傅打的好劍。大家都能用。" },
  steel_sword:  { name: "鋼劍",     sprite: "item_steel_sword", kind: "weapon", fam: "sword",  price: 310, atk: 10, def: 0, mp: 0, jobs: ["swordsman", "battle_master", "magic_knight"], desc: "又硬又亮的鋼劍，劍士專用（中級的戰鬥大師、魔法戰士也能用）。劍士的力量最大，用它最順手。" },
  gloves:       { name: "拳套",     sprite: "item_gloves",     kind: "weapon", fam: "fist",    price: 310, atk: 10, def: 0, mp: 0, jobs: ["fighter", "battle_master", "paladin"],   desc: "包得緊緊的拳套，武鬥家專用（中級的戰鬥大師、聖騎士也能用）。" },
  staff:        { name: "星光法杖", sprite: "item_staff",      kind: "weapon", fam: "staff",   price: 310, atk: 9,  def: 0, mp: 8, jobs: ["mage", "magic_knight", "sage"],      desc: "頂端有小星星的法杖，魔法師專用（中級的魔法戰士、賢者也能用）。魔力也會變多。" },
  rod:          { name: "祈願杖",   sprite: "item_rod",        kind: "weapon", fam: "staff",   price: 310, atk: 9,  def: 1, mp: 6, jobs: ["priest", "sage", "paladin"],    fx: { dmg: 0.55 }, fx_desc: "祈禱的光讓攻擊傷害 +55%", desc: "暖暖發光的手杖，祭司專用（中級的賢者、聖騎士也能用）。" },
  ribbon_fan:   { name: "彩帶扇",   sprite: "item_ribbon_fan", kind: "weapon", fam: "perform", price: 310, atk: 10, def: 0, mp: 0, jobs: ["dancer", "superstar"],    fx: { dmg: 0.15 }, fx_desc: "舞動的彩帶讓攻擊傷害 +15%", desc: "一揮就飄出彩帶的扇子，舞者專用（中級的超級巨星也能用）。" },
  bow:          { name: "海風弓",   sprite: "item_bow",        kind: "weapon", fam: "dagger",  price: 310, atk: 10, def: 0, mp: 0, jobs: ["archer", "monster_hunter", "pirate", "ranger"],    desc: "輕巧的弓，弓箭手專用（中級的魔物獵人、海盜、遊俠也能用）。" },
  harp:         { name: "貝殼豎琴", sprite: "item_harp",       kind: "weapon", fam: "perform", price: 310, atk: 10, def: 0, mp: 0, jobs: ["bard", "superstar"],      fx: { dmg: 0.50 }, fx_desc: "琴聲讓攻擊傷害 +50%", desc: "用貝殼裝飾的小豎琴，吟遊詩人專用（中級的超級巨星也能用）。" },
  anchor_axe:   { name: "船錨斧",   sprite: "item_anchor_axe", kind: "weapon", fam: "axe",     price: 310, atk: 10, def: 0, mp: 0, jobs: ["sailor", "pirate"],    fx: { dmg: 0.15 }, fx_desc: "海浪的力氣讓攻擊傷害 +15%", desc: "船錨形狀的斧頭，船員專用（中級的海盜也能用）。" },
  whip:         { name: "牧羊鞭",   sprite: "item_whip",       kind: "weapon", fam: "whip",    price: 310, atk: 10, def: 0, mp: 0, jobs: ["shepherd", "monster_hunter"],  fx: { dmg: 0.10 }, fx_desc: "清脆的鞭聲讓攻擊傷害 +10%", desc: "趕羊用的長鞭，牧羊人專用（中級的魔物獵人也能用）。" },
  clapper:      { name: "開心響板", sprite: "item_clapper",    kind: "weapon", fam: "perform", price: 310, atk: 10, def: 0, mp: 0, jobs: ["jester", "superstar"],    fx: { dmg: 0.40 }, fx_desc: "啪啪的響聲讓攻擊傷害 +40%", desc: "一敲大家就笑的響板，搞笑藝人專用（中級的超級巨星也能用）。" },
  tamer_whip:   { name: "馴獸鞭",   sprite: "item_tamer_whip", kind: "weapon", fam: "whip",    price: 310, atk: 10, def: 0, mp: 0, jobs: ["tamer", "ranger"],     fx: { dmg: 0.10 }, fx_desc: "朋友們聽到口令更有精神，攻擊傷害 +10%", desc: "綁著彩色繩子的鞭子，魔物大師專用（中級的遊俠也能用）。" },
  abacus_knife: { name: "算盤短刀", sprite: "item_abacus_dagger", kind: "weapon", fam: "dagger", price: 310, atk: 10, def: 0, mp: 0, jobs: ["merchant", "ranger"], fx: { dmg: 0.25 }, fx_desc: "算得又快又準，攻擊傷害 +25%", desc: "刀柄是算盤的短刀，商人專用（中級的遊俠也能用）。" },

  // ── 防具（48 號 3.3）──
  // 48 號 F13：圖示都交件了（2026-10-12）。算盤短刀的圖檔叫 item_abacus_dagger（美術命名），道具 id 仍是 abacus_knife
  leather:     { name: "皮衣",     sprite: "item_leather",     kind: "armor", fam: "gen",   price: 50,  atk: 0, def: 2, mp: 0, jobs: null, desc: "耐穿的冒險皮衣。大家都能穿。" },
  cloak:       { name: "旅行斗篷", sprite: "item_cloak",       kind: "armor", fam: "gen",   price: 200, atk: 0, def: 4, mp: 0, jobs: null, desc: "擋風又擋霧的斗篷。大家都能穿。" },
  heavy_armor: { name: "鐵甲",     sprite: "item_heavy_armor", kind: "armor", fam: "heavy", price: 250, atk: 0, def: 5, mp: 0, jobs: null, desc: "厚厚的鐵甲，劍士、船員能穿；中級的戰鬥大師、魔法戰士、海盜也能穿。" },
  light_armor: { name: "輕裝皮甲", sprite: "item_light_armor", kind: "armor", fam: "light", price: 250, atk: 0, def: 5, mp: 0, jobs: null, desc: "輕巧好動的皮甲，武鬥家、舞者、弓箭手、牧羊人、搞笑藝人、魔物大師、商人能穿；中級的戰鬥大師、聖騎士、超級巨星、魔物獵人、海盜、遊俠也能穿。" },
  robe:        { name: "法袍",     sprite: "item_robe",        kind: "armor", fam: "robe",  price: 250, atk: 0, def: 4, mp: 5, jobs: null, desc: "織了防霧花紋的長袍，魔法師、祭司、吟遊詩人能穿；中級的魔法戰士、賢者、聖騎士、超級巨星也能穿。魔力也會變多。" },

  // ── 素材（打獵委託）──
  // v1.0 立志小考通過的護身符（CTO Q6：職業名＋的護身符；珍貴道具，不能賣；不加能力）。圖示 item_amulet（2026-10-12 交件）
  amulet_swordsman: { name: "劍士的護身符", sprite: "item_amulet", kind: "key", price: 0, precious: true, desc: "通過立志小考的紀念。上面刻著「立志的劍士」。" },
  amulet_fighter: { name: "武鬥家的護身符", sprite: "item_amulet", kind: "key", price: 0, precious: true, desc: "通過立志小考的紀念。上面刻著「立志的武鬥家」。" },
  amulet_mage: { name: "魔法師的護身符", sprite: "item_amulet", kind: "key", price: 0, precious: true, desc: "通過立志小考的紀念。上面刻著「立志的魔法師」。" },
  amulet_priest: { name: "祭司的護身符", sprite: "item_amulet", kind: "key", price: 0, precious: true, desc: "通過立志小考的紀念。上面刻著「立志的祭司」。" },
  amulet_dancer: { name: "舞者的護身符", sprite: "item_amulet", kind: "key", price: 0, precious: true, desc: "通過立志小考的紀念。上面刻著「立志的舞者」。" },
  amulet_archer: { name: "弓箭手的護身符", sprite: "item_amulet", kind: "key", price: 0, precious: true, desc: "通過立志小考的紀念。上面刻著「立志的弓箭手」。" },
  amulet_bard: { name: "吟遊詩人的護身符", sprite: "item_amulet", kind: "key", price: 0, precious: true, desc: "通過立志小考的紀念。上面刻著「立志的吟遊詩人」。" },
  amulet_sailor: { name: "船員的護身符", sprite: "item_amulet", kind: "key", price: 0, precious: true, desc: "通過立志小考的紀念。上面刻著「立志的船員」。" },
  amulet_shepherd: { name: "牧羊人的護身符", sprite: "item_amulet", kind: "key", price: 0, precious: true, desc: "通過立志小考的紀念。上面刻著「立志的牧羊人」。" },
  amulet_jester: { name: "搞笑藝人的護身符", sprite: "item_amulet", kind: "key", price: 0, precious: true, desc: "通過立志小考的紀念。上面刻著「立志的搞笑藝人」。" },
  amulet_tamer: { name: "魔物大師的護身符", sprite: "item_amulet", kind: "key", price: 0, precious: true, desc: "通過立志小考的紀念。上面刻著「立志的魔物大師」。" },
  amulet_merchant: { name: "商人的護身符", sprite: "item_amulet", kind: "key", price: 0, precious: true, desc: "通過立志小考的紀念。上面刻著「立志的商人」。" },
  // v2.1 中級職業的 2 轉護身符（69 號 5.2：稱號、護身符比照 1 轉；圖示共用 item_amulet）
  amulet_battle_master: { name: "戰鬥大師的護身符", sprite: "item_amulet", kind: "key", price: 0, precious: true, desc: "通過立志小考（2 轉）的紀念。上面刻著「立志的戰鬥大師」。" },
  amulet_magic_knight: { name: "魔法戰士的護身符", sprite: "item_amulet", kind: "key", price: 0, precious: true, desc: "通過立志小考（2 轉）的紀念。上面刻著「立志的魔法戰士」。" },
  amulet_sage: { name: "賢者的護身符", sprite: "item_amulet", kind: "key", price: 0, precious: true, desc: "通過立志小考（2 轉）的紀念。上面刻著「立志的賢者」。" },
  amulet_paladin: { name: "聖騎士的護身符", sprite: "item_amulet", kind: "key", price: 0, precious: true, desc: "通過立志小考（2 轉）的紀念。上面刻著「立志的聖騎士」。" },
  amulet_superstar: { name: "超級巨星的護身符", sprite: "item_amulet", kind: "key", price: 0, precious: true, desc: "通過立志小考（2 轉）的紀念。上面刻著「立志的超級巨星」。" },
  amulet_monster_hunter: { name: "魔物獵人的護身符", sprite: "item_amulet", kind: "key", price: 0, precious: true, desc: "通過立志小考（2 轉）的紀念。上面刻著「立志的魔物獵人」。" },
  amulet_pirate: { name: "海盜的護身符", sprite: "item_amulet", kind: "key", price: 0, precious: true, desc: "通過立志小考（2 轉）的紀念。上面刻著「立志的海盜」。" },
  amulet_ranger: { name: "遊俠的護身符", sprite: "item_amulet", kind: "key", price: 0, precious: true, desc: "通過立志小考（2 轉）的紀念。上面刻著「立志的遊俠」。" },
  sticky_ball:  { name: "黏黏球",     sprite: "item_sticky_ball",  kind: "material", price: 0, desc: "迷糊團子身上掉下來的黏黏球，可以補洞。" },
  mushroom_cap: { name: "毒菇帽",     sprite: "item_mushroom_cap", kind: "material", price: 0, desc: "毒菇怪的帽子。精靈長老拿來研究霧。不能吃喔！" },
  feather:      { name: "羽毛",       sprite: "item_feather",      kind: "material", price: 0, desc: "白白的羽毛，可以做成羽毛筆。" },
  bat_wing:     { name: "夜翼徽章",   sprite: "item_bat_wing",     kind: "material", price: 0, desc: "蝙蝠翅膀形狀的小徽章，是蝙蝠們撿來的寶物。" },
  crystal:      { name: "回音水晶",   sprite: "item_crystal",      kind: "material", price: 0, desc: "對它說話，會小小聲地回答你。" },
  gear:         { name: "齒輪",       sprite: "item_gear",         kind: "material", price: 0, desc: "地精做機關用的齒輪。" },
  scroll:       { name: "告示卷軸",   sprite: "item_scroll",       kind: "material", price: 0, desc: "哥布林部落的告示碎片，拼起來就能讀。" },
  key:          { name: "柵欄鑰匙",   sprite: "item_key",          kind: "material", price: 0, desc: "獸人營地柵欄的鑰匙。" },
  // v1.1 第一章（59 號 3.4 節）：滴滴雨精的掉落、基隆港 Q_KL_1 的打獵目標。圖示 item_umbrella 是新圖（美術交件後登錄到 sprites.js）
  umbrella:     { name: "迷路的小雨傘", sprite: "item_umbrella",   kind: "material", price: 0, desc: "被雨精帶走的小雨傘，傘骨上還有水珠。" },
  // v1.2 第二章（61 號 3.3 節）：金棗彈彈的掉落（頭城礁溪 Q_YL_2 的打獵目標）；黏黏雨雲王的掉落（紀念品，不加數值、不能賣）
  kumquat:      { name: "金棗",       sprite: "item_kumquat",      kind: "material", price: 0, desc: "圓圓的金色小果實，酸酸甜甜。" },
  rainbow_piece: { name: "雨後彩虹片", sprite: "item_rainbow_piece", kind: "key", price: 0, precious: true, desc: "雨停後留下的一小片彩虹，亮亮的。" },
  // v1.3 台北章（62 號 3.4 節）：焙籠火狸、炒炒烘茶機的掉落（坪林 Q_PL_2 的打獵目標）；鈴鈴鬧鐘兵的掉落（貓空 Q_MK_1 的打獵目標）
  tea_leaf:     { name: "茶葉",       sprite: "item_tea_leaf",     kind: "material", price: 0, desc: "香香的茶葉，焙過之後更香。" },
  ticket:       { name: "纜車票",     sprite: "item_ticket",       kind: "material", price: 0, desc: "被鬧鐘兵叼走的纜車票。" },
  // v1.4 桃竹章（63 號 3.3 節）：咻咻風精的掉落（新竹 Q_HC_2 的打獵目標）；北霧將的珍貴道具（冒險手帳顯示「曙光碎片 1／4」，其他三片之後的章節才有）
  pinwheel:     { name: "風車葉片",     sprite: "item_pinwheel",     kind: "material", price: 0, desc: "被風精吹走的風車葉片。" },
  dawn_shard_n: { name: "北之曙光碎片", sprite: "item_dawn_shard_n", kind: "key", price: 0, precious: true, desc: "北霧將清醒後交出的一小片曙光，暖暖的。" },
  // v2.0 中部（69 號 3.5）：藺草繩（Q_DJ_2 獎勵）、火車汽笛（迷路火車頭）、紙傘骨（Q_LK_2 打獵）、燈籠紙、中之曙光碎片（燈籠霧將，手帳 2／4）
  rush_rope:     { name: "藺草繩",     sprite: "item_rush_rope",     kind: "key", price: 0, precious: true, desc: "藺草工坊阿伯編的結實繩子，可以把火車頭拉回月台。" },
  train_whistle: { name: "火車汽笛",   sprite: "item_train_whistle", kind: "key", price: 0, precious: true, desc: "迷路火車頭清醒後送的汽笛，吹起來嘟嘟響。" },
  umbrella_rib:  { name: "紙傘骨",     sprite: "item_umbrella_rib",  kind: "material", price: 0, desc: "傘傘紙傘妖掉下的竹製傘骨。" },
  lantern_paper: { name: "燈籠紙",     sprite: "item_lantern_paper", kind: "material", price: 0, desc: "燈燈小燈籠掉下的紅色燈籠紙。" },
  dawn_shard_c:  { name: "中之曙光碎片", sprite: "item_dawn_shard_c", kind: "key", price: 0, precious: true, desc: "中霧將清醒後交出的一小片曙光，暖暖的。" },
  // v3.0 南部（70 號 3.6）：記憶貝殼、航海圖碎片（素材）、航海圖（Q_AP_4）、鳳梨（Q_DS_2）、海玻璃、來回船票（codex3 船班）、南之曙光碎片（手帳 3／4）
  memory_shell: { name: "記憶貝殼", sprite: "item_memory_shell", kind: "material", price: 0, desc: "海盜們搶走的貝殼，裡面好像藏著大家的回憶。" },
  chart_piece: { name: "航海圖碎片", sprite: "item_chart_piece", kind: "material", price: 0, desc: "被撕下來的航海圖一角。" },
  sea_chart: { name: "航海圖", sprite: "item_sea_chart", kind: "key", price: 0, precious: true, desc: "港口書記被搶走的航海圖，畫著往台江的水道。" },
  pineapple: { name: "鳳梨", sprite: "item_pineapple", kind: "material", price: 0, desc: "被小怪搶走的鳳梨，要還給鳳梨農。" },
  sea_glass: { name: "海玻璃", sprite: "item_sea_glass", kind: "material", price: 0, desc: "被浪磨得圓圓的玻璃。" },
  ferry_ticket: { name: "東港⇄小琉球來回船票", sprite: "item_ferry_ticket", kind: "key", price: 0, precious: true, not_for_sale: true, desc: "往返小琉球的船票，只賣來回。" },
  dawn_shard_s: { name: "南之曙光碎片", sprite: "item_dawn_shard_s", kind: "key", price: 0, precious: true, desc: "南霧將清醒後交出的一小片曙光，暖暖的。" },
  // v3.0（71 號第九節，老闆同意「南部以後每區一件新裝備」）：通用款，武器、防具輪流；圖示 art_src\v1\east\items（沒有時先借既有裝備圖示）
  gear_z8_blade: { name: "古城長劍", sprite: "item_gear_z8_blade", kind: "weapon", fam: "gen", price: 2800, atk: 18, def: 0, mp: 0, jobs: null, desc: "府城古城老鐵匠打的長劍。大家都能用。" },
  gear_z9_vest: { name: "鳳梨硬殼背心", sprite: "item_gear_z9_vest", kind: "armor", fam: "gen", price: 2750, atk: 0, def: 10, mp: 0, jobs: null, desc: "用鳳梨葉纖維織的硬背心，又輕又耐打。大家都能穿。" },
  gear_z10_cutlass: { name: "燈塔守護劍", sprite: "item_gear_z10_cutlass", kind: "weapon", fam: "gen", price: 4050, atk: 25, def: 0, mp: 0, jobs: null, desc: "燈塔守護員送修的老劍，亮得像燈塔的光。大家都能用。" },
  // v4.0 東部（71 號 4.11）：七色絲帶、熱氣球繩結（素材）、東之曙光碎片（手帳 4／4）、富岡⇄綠島／蘭嶼來回船票（codex3 船班）、海草冰、麻糬（回復；效果和價錢照番薯仔點心）
  rainbow_ribbon: { name: "七色絲帶", sprite: "item_rainbow_ribbon", kind: "material", price: 0, desc: "彎彎彩虹清醒後留下的絲帶，有七種顏色，滑滑亮亮的。" },
  balloon_knot: { name: "熱氣球繩結", sprite: "item_balloon_knot", kind: "material", price: 0, desc: "霧氣球大王清醒後留下的繩結，綁得又緊又牢。是鹿野高台的紀念品。" },
  dawn_shard_e: { name: "東之曙光碎片", sprite: "item_dawn_shard_e", kind: "key", price: 0, precious: true, desc: "東霧將清醒後交出的一小片曙光，暖暖的。四片終於到齊了！" },
  ferry_ticket_gi: { name: "富岡⇄綠島來回船票", sprite: "item_ferry_ticket_gi", kind: "key", price: 0, precious: true, not_for_sale: true, desc: "富岡漁港和綠島南寮漁港的來回船票。坐船大約 50 分鐘。" },
  ferry_ticket_ly: { name: "富岡⇄蘭嶼來回船票", sprite: "item_ferry_ticket_ly", kind: "key", price: 0, precious: true, not_for_sale: true, desc: "富岡漁港和蘭嶼開元港的來回船票。坐船要 2 到 3 小時。" },
  seaweed_ice: { name: "海草冰", sprite: "item_seaweed_ice", kind: "consumable", price: 15, effect: { hp: 10, pet: 1 }, desc: "剉冰上放著綠綠的海草，鹹鹹涼涼的。回復 10 點體力，番薯仔也愛吃。" },
  mochi: { name: "麻糬", sprite: "item_mochi", kind: "consumable", price: 15, effect: { hp: 10, pet: 1 }, desc: "軟軟 QQ 的花蓮麻糬。回復 10 點體力，番薯仔也愛吃。" },
  // v4.0（71 號第九節，每區一件新裝備）：通用款，Z11 防具、Z12 武器；價錢＝新經濟v30擴充_設計確認.md 8.2 公式 ×1.6（老闆 11-02 後期裝備漲價）
  gear_z11_cloak: { name: "縱谷風斗篷", sprite: "item_gear_z11_cloak", kind: "armor", fam: "gen", price: 2750, atk: 0, def: 12, mp: 0, jobs: null, desc: "花東縱谷在兩條山脈中間。這件斗篷擋得住谷裡的風。大家都能穿。" },
  gear_z12_marble: { name: "大理石劍", sprite: "item_gear_z12_marble", kind: "weapon", fam: "gen", price: 4300, atk: 29, def: 0, mp: 0, jobs: null, desc: "用花蓮的大理石，請石雕師傅磨亮的劍。大家都能用。" }
};

/* 商店：shop_id 對應 maps.js 的 shop.shop_id / extra_shops[].shop_id */
window.SHOPS = {
  // v4.1 埔里旅店老闆兼賣高山防寒衣。
  gear_puli: {"name":"鎮上旅店（兼賣裝備）","items":["gear_z13_coat"]},
  general: { name: "老街雜貨店",   items: ["herb", "snack", "eraser", "guide", "wood_sword", "leather"] },
  item:    { name: "山城市場道具攤",     items: ["herb", "snack", "eraser", "guide"] },
  // v1.1 第一章（59 號 2.4 節）：基隆港廟口道具攤，品項同山城市場道具攤
  item_keelung: { name: "廟口道具攤", items: ["herb", "snack", "eraser", "guide"] },
  // v1.2 第二章（61 號 2.3）：頭城老街道具攤（M14 stall_yilan），品項同山城市場道具攤
  item_yilan: { name: "老街道具攤", items: ["herb", "snack", "eraser", "guide"] },
  // v1.0 第一批：每個職業的專屬武器、職業防具都在山城（48 號模擬的設定）。沒開放的職業（JOB_RULES.open_jobs）的專屬武器，商店自動不列
  weapon:  { name: "山城武器鋪",     items: ["wood_sword", "iron_sword", "steel_sword", "gloves", "staff", "rod", "ribbon_fan", "bow", "harp", "anchor_axe", "whip", "clapper", "tamer_whip", "abacus_knife"] },
  armor:   { name: "山城防具店",     items: ["leather", "cloak", "heavy_armor", "light_armor", "robe"] },
  // v1.3 台北章（62 號 2.5【建議】品項同九份三家）：台北城的武器鋪、防具店、道具店（照 v1.2 頭城老街道具攤的做法另開 id，店名寫台北）
  weapon_taipei: { name: "台北武器鋪", items: ["wood_sword", "iron_sword", "steel_sword", "gloves", "staff", "rod", "ribbon_fan", "bow", "harp", "anchor_axe", "whip", "clapper", "tamer_whip", "abacus_knife"] },
  armor_taipei: { name: "台北防具店", items: ["leather", "cloak", "heavy_armor", "light_armor", "robe"] },
  item_taipei: { name: "台北道具店", items: ["herb", "snack", "eraser", "guide"] },
  // v3.0 南部（71 號第九節）：旅館老闆兼賣的「每區一件新裝備」（maps.js inn.sells）
  gear_fucheng: { name: "府城老客棧（兼賣裝備）", items: ["gear_z8_blade"] },
  gear_dashu: { name: "鳳梨田民宿（兼賣裝備）", items: ["gear_z9_vest"] },
  gear_kenting: { name: "墾丁旅店（兼賣裝備）", items: ["gear_z10_cutlass"] },
  // v4.0 東部（71 號 4.4、4.6、第九節）：旅館老闆兼賣的新裝備（maps.js inn.sells）；綠島冰店、花蓮麻糬店（海草冰、麻糬＝番薯仔點心的效果與價錢，加賣藥草）
  gear_taitung: { name: "縱谷民宿（兼賣裝備）", items: ["gear_z11_cloak"] },
  gear_hualien: { name: "海岸旅店（兼賣裝備）", items: ["gear_z12_marble"] },
  ice_gi: { name: "綠島冰店", items: ["seaweed_ice", "herb"] },
  mochi_hl: { name: "花蓮麻糬店", items: ["mochi", "herb"] }
};
