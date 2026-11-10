/*
 * 勇者大冒險 — 怪物與頭目資料（格式依 07 第 6.3 節）
 * 撰寫：遊戲劇情設計師＋關卡設計
 *
 * 兒童合宜：所有怪物都是「被遺忘霧弄迷糊的生物」。打倒＝清醒過來、開心地跑走（wake 欄位），
 * 不寫死亡、不寫流血。掉落物是牠們迷糊時撿走、清醒後還回來的東西。
 *
 * 6.3 之外多加的欄位：
 *   q_levels   這隻怪出題的難度範圍 [最低, 最高]
 *   desc       圖鑑說明（三年級讀得懂）
 *   wake       打倒後的顯示文字
 *   boss 專用：phases（階段數）、phase_q（每階段至少答對幾題）、last_q_level（每階段最後一題的難度）、
 *              ref_mobs（拿來算 HP 倍率的同區小怪）、dialog_before / dialog_after、subjects（五科輪流時）
 *
 * ───────────── 數值計算依據（初稿，之後用模擬校正）─────────────
 * 【事實｜07 文件】Lv1 ATK 6；每升一級 HP+8、MP+3、ATK+2；木劍 ATK+3；皮衣 DEF+2；
 *                 傷害＝ATK × 難度係數（L1 1.0／L2 1.3／L3 1.6／L4 2.0）× 速度加成；會心 ×1.5。
 * 【假設｜文件沒寫，我先定】主角 Lv1 HP 30、MP 10、DEF 0；怪物打主角＝max(1, 怪物 atk − 主角 DEF)。
 *                 鐵劍 ATK+8、法袍 DEF+4（見 items.js）。
 * 【推論】各地圖等級時，主角大約的等級與輸出：
 *   地圖等級 │ 預估主角等級 │ ATK(含武器)      │ 出題難度平均係數   │ 每次答對傷害 D │ 小怪要答對幾題 │ 小怪 HP ≈ D×題數
 *   1        │ Lv1–2 (1.5)  │ 7（還沒買劍）    │ L1 → 1.0           │ 7              │ 2              │ 14 → 取 12–14（規定 10–15）
 *   2        │ Lv3–4 (3.5)  │ 11+3 木劍 = 14   │ L1–2 → 1.15        │ 16             │ 2.5            │ 40 → 取 34–42
 *   3        │ Lv5–7 (6)    │ 16+8 鐵劍 = 24   │ L2–3 → 1.45        │ 35             │ 2.75           │ 96 → 取 85–110
 *   4        │ Lv8–10 (9)   │ 22+8 = 30        │ L3–4 → 1.8         │ 54             │ 3              │ 162 → 取 150–175
 *   會心（前 1/3 時間答對）會讓實際題數再少一點，所以平均一場小怪戰約 2–3 題、1–2 分鐘。
 * 【推論】怪物 atk：讓孩子大約「答錯 6–8 次才會累倒」。
 *   atk ≈ 主角 HP ÷ 7 ＋ 主角 DEF：地圖 1：34/7+0 ≈ 5 → 4–5；地圖 2：50/7+2 ≈ 9 → 8–10；
 *   地圖 3：70/7+4 ≈ 14 → 14–15；地圖 4：94/7+4 ≈ 17 → 19–20（第 4 區刻意稍兇一點）。
 *   頭目 atk ≈ 同區小怪 ×1.3。
 * 【CTO 裁定 2026-10-07】頭目 HP＝同區小怪平均 × 5（最終頭目 × 6）；階段＝HP 剩 2/3、1/3 時換階段（每階段至少答對 2 題）。
 *   枯萎樹王：M04 神木森林小怪平均 (38+34+42)/3 = 38 → ×5 = 190
 *   迷霧章魚：海邊小怪（M06 螃蟹、M09 海鷗）平均 (40+34)/2 = 37 → ×5 = 185
 *   泥巴大蛙：M05 紅樹林濕地小怪平均 (90+100)/2 = 95 → ×5 = 475
 *   噪音蝙蝠王：M06 海蝕洞窟／M07 小怪平均 (85+110+95)/3 ≈ 96.7 → ×5 ≈ 485
 *   暴躁石像：M08 月世界小怪平均 (160+150)/2 = 155 → ×5 = 775
 *   遺忘霧魔：M10 府城古城／M11 小怪平均 (175+150)/2 = 162.5 → ×6 = 975
 * 【推論】一場頭目戰大約要答對幾題（目標：一般頭目 7–8 題）：
 *   假設打頭目時主角已在該區等級上緣（鏈尾）、會心機率約 1/3（平均 ×1.17）、沒有拿手科目加成：
 *   頭目        │ 主角等級 │ ATK(含武器) │ 出題係數平均           │ 每題傷害 │ 約答對題數
 *   枯萎樹王    │ Lv4      │ 12+3 = 15   │ L2–4 → 1.63            │ 28.6     │ 190/28.6 ≈ 6.6
 *   迷霧章魚    │ Lv4      │ 15          │ 1.63                   │ 28.6     │ 185/28.6 ≈ 6.5
 *   泥巴大蛙    │ Lv7      │ 18+8 = 26   │ 1.63                   │ 49.6     │ 475/49.6 ≈ 9.6
 *   噪音蝙蝠王  │ Lv7      │ 26          │ 1.63                   │ 49.6     │ 485/49.6 ≈ 9.8
 *   暴躁石像    │ Lv10     │ 24+8 = 32   │ L3–4 → 1.8             │ 67.4     │ 775/67.4 ≈ 11.5
 *   遺忘霧魔    │ Lv11     │ 26+8 = 34   │ 1.8                    │ 71.6     │ 975/71.6 ≈ 13.6
 *   職業拿手科目對上頭目科目時傷害 ×1.5，題數約少三分之一（例：暴躁石像對祭司約 7.7 題）。
 * 【注意｜待模擬】等級 2 的頭目落在 7 題左右，符合目標；等級 3、4 的頭目在 ×5 下約 10–14 題，高於目標。
 *   原因：小怪 HP 依「要答對 2→3 題」逐區加重，頭目再乘固定倍率，所以後段會放大。
 *   若模擬確認偏長，可選：(a) 後段頭目倍率改用 4.5（仍在驗證範圍內，約 9–12 題）；
 *   (b) 頭目戰時主角傷害另乘 1.3；(c) 下修等級 3、4 小怪 HP。請遊戲設計師以模擬結果拍板。
 * EXP／金幣：exp＝打倒後額外給的討伐獎勵（答題 EXP 由題目另算）；約等於該區一題 L1 題的 EXP；gold ≈ exp ÷ 2。
 */
/*
 * v0.9.3（2026-10-10）數值調整：hp／atk／exp／gold 依成品匣 37_現行版等級與怪物數值調整.md 第 4 節修改表套用（21 隻）；
 * 招潮蟹（fiddler_crab）依同文件第 5 節用紅樹林沼澤蛙那一列。配合 C1（打倒怪物才給經驗值和金幣）、C5（頭目第 2、3 階段傷害 ×1.2、×1.4）。
 * 頭目的 atk 是第 1 階段的值。上面舊的推導說明是 v0.2～v0.9.2 的數值，僅供參考。
 */
/*
 * v1.1 第一章（2026-10-20，59_v1.1第一章實作規格.md 第三節；F1 照【建議 A】＝沿用現行升級表與 37 號算法）：
 *   - 新增 8 種：wx_rain、mn_cart、mn_ore、mn_dust、mn_lamp、mn_drill、mn_timber、頭目 mnb_goldjaw（3.2 節）。
 *   - 調整 6 種（3.3 節）：crab、rock、bat、goblin（野柳／哥布林部落改成第二區 Lv5–8）、noise_bat（建議 Lv8、出題 1–3 星）、
 *     fog_octopus（章末頭目建議 Lv10、gold 100）。名稱、科目、掉落、階段、對話、ref_mobs 不改。
 *   - systems 測試 S11-1 逐格比對本檔與 59 號 3.2、3.3 節的表。
 */
/*
 * v1.2 第二章（61_v1.2第二章宜蘭實作規格.md 3.2 節；wip_v12/v12_apply.js 套用）：新增 5 種蘭陽系小怪＋頭目黏黏雨雲王；舊怪物全部不改。
 *   systems 測試 S12-1（tests/v12_ch2.test.js）逐格比對本檔與 61 號 3.2 節的表。
 */
/*
 * v1.3 台北章（62_v1.3台北章實作規格.md 3.2、3.3 節；wip_v13/v13_apply.js 套用）：新增 12 種；紅樹林的泥泥怪、招潮蟹、泥巴大蛙照台北章重算，
 *   legacy 欄位＝v1.2 上線的數值（舊紅樹林旗標 state.legacyM05：v1.3 前就在做地精鏈的孩子在 M05 照舊數值打到地精鏈完成，systems/ch3migrate.js）。
 *   systems 測試 S13-1（tests/v13_ch3.test.js）逐格比對本檔與 62 號 3.2、3.3 節的表。
 */
window.MONSTERS = {
  // v4.1 中橫・南投：雪球與小燈籠掉落率 0.7；標準三階段頭目不加變暗效果。
  wx_snow: {"name":"雪球寶寶","sprite":"mon_wx_snow","level":5,"hp":570,"atk":89,"subject":"英語","q_levels":[2,3],"exp":220,"gold":60,"drops":[{"item":"snow_crystal","rate":0.7}],"boss":false,"dialog_after_once":"D_SNOWBALL_AFTER","desc":"戴紅色毛線帽的圓雪球，霧讓它在雪地裡一直打轉。","wake":"雪球寶寶清醒了，滾回雪地，乖乖不動了。"},
  fo_puff: {"name":"噗噗霧泡泡","sprite":"mon_fo_puff","level":5,"hp":580,"atk":91,"subject":"自然","q_levels":[2,3],"exp":230,"gold":65,"drops":[{"item":"crystal","rate":0.3}],"boss":false,"desc":"像棉花糖的小霧球，被打到會分成兩隻小的。","wake":"噗噗霧泡泡被光照暖了，小水滴變成水蒸氣，散掉了。"},
  gh_bamboo: {"name":"筍筍竹筍妖","sprite":"mon_gh_bamboo","level":5,"hp":580,"atk":91,"subject":"自然","q_levels":[2,3],"exp":240,"gold":65,"drops":[{"item":"bamboo_husk","rate":0.4}],"boss":false,"desc":"戴著咖啡色筍殼帽的胖竹筍，霧讓它一直長高。","wake":"筍筍竹筍妖清醒了，縮回竹林的土裡。"},
  gh_cone: {"name":"毬毬杉果精","sprite":"mon_gh_cone","level":5,"hp":580,"atk":92,"subject":"數學","q_levels":[2,3],"exp":240,"gold":65,"drops":[{"item":"cedar_cone","rate":0.4}],"boss":false,"desc":"圓滾滾的柳杉毬果，小刺軟軟的，被霧弄得滾來滾去撞人。","wake":"毬毬杉果精清醒了，滾回柳杉林的樹下。"},
  gh_lantern_f: {"name":"森林燈燈小燈籠","sprite":"mon_gh_lantern_f","level":5,"hp":590,"atk":93,"subject":"國語","q_levels":[2,3],"exp":250,"gold":65,"drops":[{"item":"lantern_paper","rate":0.4}],"boss":false,"desc":"深綠色的小燈籠，光是淡黃綠色，霧讓它在夜路亂飄。","wake":"森林燈燈小燈籠清醒了，乖乖掛回樹枝上。"},
  gh_umbrella_f: {"name":"森林傘傘紙傘妖","sprite":"mon_gh_umbrella_f","level":5,"hp":590,"atk":93,"subject":"英語","q_levels":[2,3],"exp":250,"gold":65,"drops":[{"item":"umbrella_rib","rate":0.4}],"boss":false,"desc":"竹青色的紙傘，傘骨像竹節，霧讓它在夜路亂跳。","wake":"森林傘傘紙傘妖清醒了，收起傘靠回竹林邊。"},
  gh_geta_f: {"name":"森林喀喀木屐","sprite":"mon_gh_geta_f","level":5,"hp":590,"atk":94,"subject":"數學","q_levels":[2,3],"exp":250,"gold":70,"drops":[{"item":"crystal","rate":0.3}],"boss":false,"desc":"綁著苔綠色帶子的木屐，霧讓它在夜路喀喀亂走。","wake":"森林喀喀木屐清醒了，排好放回屋簷下。"},
  gh_civet_f: {"name":"森林夜遊白鼻心","sprite":"mon_gh_civet_f","level":5,"hp":590,"atk":94,"subject":"社會","q_levels":[2,3],"exp":250,"gold":70,"drops":[{"item":"small_lantern","rate":0.7}],"boss":false,"dialog_after":"D_CIVET_AFTER","desc":"披著深綠斗篷、提著綠色小燈籠的白鼻心。","wake":"森林夜遊白鼻心清醒了，把小燈籠還給你，跑回樹林。"},
  ghb_civetboss: {"name":"中橫頭目：夜遊團長","sprite":"boss_ghb_civetboss","level":5,"hp":2620,"atk":84,"subject":"混合","subjects":["國語","自然"],"q_levels":[2,4],"exp":2500,"gold":700,"drops":[{"item":"forest_lantern","rate":1}],"boss":true,"phases":3,"phase_q":2,"last_q_level":4,"ref_mobs":["gh_civet_f","gh_lantern_f"],"battle_bg":"forest","dialog_before":"D_BOSS_CIVET_A","dialog_after":"D_BOSS_CIVET_B","desc":"中橫頭目。把燈籠町的燈全藏起來的大白鼻心，斗篷上掛滿燈籠。","wake":"夜遊團長清醒了，把燈籠一盞盞掛回燈籠町。"},

  // ── 地圖等級 1（M02 擎天草原）──
  dango: {
    name: "迷糊團子", sprite: "mon_dango", level: 1, hp: 25, atk: 6, subject: "數學", q_levels: [1, 1],
    exp: 4, gold: 3, drops: [{ item: "sticky_ball", rate: 0.5 }], boss: false,
    desc: "軟軟黏黏的小團子，被霧弄得數不清自己有幾顆。",
    wake: "迷糊團子清醒了，咕嚕咕嚕滾回草叢裡。"
  },
  rabbit: {
    name: "跳跳兔", sprite: "mon_rabbit", level: 1, hp: 30, atk: 7, subject: "國語", q_levels: [1, 1],
    exp: 4, gold: 3, drops: [{ item: "herb", rate: 0.3 }], boss: false,
    desc: "跳得很高的兔子，被霧弄得忘了回家的路。",
    wake: "跳跳兔清醒了，一蹦一跳地回家了。"
  },

  // ── 地圖等級 2（M03 硫磺谷、M04 神木森林、M09 山城市集；港口螃蟹住在 M06 海邊岩岸）──
  mushroom: {
    name: "毒菇怪", sprite: "mon_mushroom", level: 2, hp: 55, atk: 8, subject: "自然", q_levels: [1, 2],
    exp: 6, gold: 4, drops: [{ item: "mushroom_cap", rate: 0.5 }], boss: false,
    desc: "頭上戴著大菇帽。霧讓牠忘了自己要曬太陽還是躲陰涼。",
    wake: "毒菇怪清醒了，摘下菇帽向你敬禮，跑回樹下。"
  },
  sprout: {
    name: "樹精寶寶", sprite: "mon_sprout", level: 2, hp: 120, atk: 10, subject: "自然", q_levels: [1, 2],
    exp: 10, gold: 5, drops: [{ item: "herb", rate: 0.4 }], boss: false,
    desc: "剛發芽的小樹精，被霧弄得忘了要喝水。",
    wake: "樹精寶寶清醒了，開心地去找水喝。"
  },
  owl: {
    legacy_s: { level: 2, hp: 125, atk: 11, exp: 10, gold: 6, q_levels: [1, 2] },   // v3.0（70 號 3.3、5.1）舊南部旗標 legacySouth 時用的舊數值（套用前的數值）
    name: "貓頭鷹", sprite: "mon_owl", level: 5, hp: 310, atk: 51, subject: "國語", q_levels: [2, 3],
    exp: 85, gold: 30, drops: [{ item: "feather", rate: 0.3 }], boss: false,
    desc: "森林裡最愛讀書的鳥，霧讓牠把字都看反了。",
    wake: "貓頭鷹清醒了，咕咕叫著飛回樹洞。"
  },
  crab: {
    name: "港口螃蟹", sprite: "mon_crab", level: 2, hp: 50, atk: 11, subject: "英語", q_levels: [1, 2],
    exp: 8, gold: 5, drops: [{ item: "snack", rate: 0.3 }], boss: false,
    desc: "住在海邊岩岸的螃蟹，霧讓牠聽不懂外國船員的話。",
    wake: "港口螃蟹清醒了，橫著走回沙灘。"
  },
  seagull: {
    name: "搶食海鷗", sprite: "mon_seagull", level: 2, hp: 135, atk: 14, subject: "英語", q_levels: [1, 2],
    exp: 12, gold: 6, drops: [{ item: "feather", rate: 0.5 }], boss: false,
    desc: "被霧弄得到處亂搶東西的海鷗。",
    wake: "搶食海鷗清醒了，把東西還給你，飛回海上。"
  },

  // ── 地圖等級 3（M05 紅樹林濕地）；v1.1 起洞窟蝙蝠、石頭怪、頑皮哥布林（M06 海蝕洞窟、M07 哥布林部落）改成第二區、level 2 ──
  mudslime: {
    name: "泥泥怪", sprite: "mon_mudslime", level: 4, hp: 190, atk: 29, subject: "數學", q_levels: [2, 3],
    exp: 30, gold: 14, drops: [{ item: "gear", rate: 0.5 }], boss: false,
    legacy: { level: 3, hp: 200, atk: 16, exp: 18, gold: 9 },   // v1.3（62 號 3.3、5.4）紅樹林搬到台北章重算；legacy＝v1.2 數值（舊紅樹林旗標用）
    desc: "濕地泥灘上的泥巴團，迷糊時會把亮亮的齒輪吞進肚子。",
    wake: "泥泥怪清醒了，吐出齒輪，慢慢滑回泥灘裡。"
  },
  frog: {
    name: "沼澤蛙", sprite: "mon_frog", level: 3, hp: 210, atk: 17, subject: "自然", q_levels: [2, 3],
    exp: 20, gold: 10, drops: [{ item: "gear", rate: 0.3 }], boss: false,
    desc: "呱呱叫的大青蛙，霧讓牠忘了天氣會怎麼變。",
    wake: "沼澤蛙清醒了，撲通一聲跳回河道裡。"
  },
  // 2026-10-10 老闆 B13「紅樹林適合用招潮蟹當野怪」：取代 M05 的沼澤蛙出沒區（泥泥怪保留，委託 Q_GNO_3 要收集牠的齒輪）。
  // 數值照 37 號「數值請用紅樹林那一列」＝與沼澤蛙同一列；之後套用 37 號修改表時，請和 frog 一起改（210／17／110／16）。
  // 【美術需求｜佔位】還沒有招潮蟹的圖，先借用港口螃蟹的圖 mon_crab；招潮蟹圖完成後把 sprite 改成新圖的 id。
  fiddler_crab: {
    name: "招潮蟹", sprite: "mon_fiddler_crab", level: 4, hp: 190, atk: 29, subject: "自然", q_levels: [2, 3],
    exp: 35, gold: 15, drops: [{ item: "gear", rate: 0.3 }], boss: false,
    legacy: { level: 3, hp: 210, atk: 17, exp: 20, gold: 10 },   // v1.3（62 號 3.3、5.4）
    desc: "紅樹林泥灘上揮著一隻大螯的小螃蟹，霧讓牠忘了潮水什麼時候會來。",
    wake: "招潮蟹清醒了，揮揮大螯，鑽回泥灘的小洞裡。"
  },
  bat: {
    name: "洞窟蝙蝠", sprite: "mon_bat", level: 2, hp: 55, atk: 14, subject: "國語", q_levels: [1, 2],
    exp: 10, gold: 6, drops: [{ item: "bat_wing", rate: 0.4 }], boss: false,
    desc: "倒掛在洞頂睡覺的蝙蝠，被霧吵醒後脾氣不太好。",
    wake: "洞窟蝙蝠清醒了，飛回洞頂繼續睡覺。"
  },
  rock: {
    name: "石頭怪", sprite: "mon_rock", level: 2, hp: 55, atk: 13, subject: "數學", q_levels: [1, 2],
    exp: 10, gold: 5, drops: [{ item: "crystal", rate: 0.4 }], boss: false,
    desc: "會走路的石頭，身上常常黏著亮晶晶的水晶。",
    wake: "石頭怪清醒了，滾到角落安靜地休息。"
  },
  goblin: {
    name: "頑皮哥布林", sprite: "mon_goblin", level: 2, hp: 60, atk: 14, subject: "國語", q_levels: [1, 2],
    exp: 11, gold: 6, drops: [{ item: "scroll", rate: 0.5 }], boss: false,
    desc: "被霧弄迷糊的哥布林，把部落的告示撕下來當玩具。",
    wake: "頑皮哥布林清醒了，不好意思地跑回部落。"
  },

  // ── v1.1 第一章新怪（59 號 3.2 節）：基隆港（M47）滴滴雨精；九份東側（M09）、金瓜石（M48）礦坑系 ──
  // level＝圖鑑顯示的地圖等級；掉落只新增 umbrella（迷路的小雨傘），其他借既有道具、不用齒輪（Q_GNO_3 的打獵目標）
  wx_rain: {
    name: "滴滴雨精", sprite: "mon_wx_rain", level: 2, hp: 70, atk: 16, subject: "自然", q_levels: [1, 2],
    exp: 12, gold: 6, drops: [{ item: "umbrella", rate: 0.5 }], boss: false,
    desc: "一顆會走路的大雨滴，撐著葉子當傘。霧讓牠忘了雨要下在哪裡。",
    wake: "滴滴雨精清醒了，變成小雨滴回到雲裡。"
  },
  mn_cart: {
    name: "鏽輪礦車獸", sprite: "mon_mn_cart", level: 3, hp: 90, atk: 16, subject: "數學", q_levels: [1, 2],
    exp: 13, gold: 7, drops: [{ item: "herb", rate: 0.3 }], boss: false,
    desc: "生鏽的小礦車，被霧弄得到處亂衝。",
    wake: "鏽輪礦車獸清醒了，喀啦喀啦開回軌道上停好。"
  },
  mn_ore: {
    name: "金脈岩甲獸", sprite: "mon_mn_ore", level: 3, hp: 90, atk: 16, subject: "自然", q_levels: [1, 2],
    exp: 14, gold: 7, drops: [{ item: "crystal", rate: 0.4 }], boss: false,
    desc: "背上長著礦石的岩石野獸，霧讓牠以為大家都要搶牠的石頭。",
    wake: "金脈岩甲獸清醒了，縮起來變回一顆安靜的大石頭。"
  },
  // 戰鬥畫面變暗一回合＝純演出，不影響答題時間
  mn_dust: {
    name: "礦塵旋風", sprite: "mon_mn_dust", level: 3, hp: 90, atk: 16, subject: "自然", q_levels: [1, 2],
    exp: 14, gold: 7, drops: [{ item: "herb", rate: 0.3 }], boss: false,
    desc: "捲著碎石的小旋風，霧讓牠停不下來。",
    wake: "礦塵旋風清醒了，慢慢散成一陣微風。"
  },
  mn_lamp: {
    name: "坑道螢燈", sprite: "mon_mn_lamp", level: 3, hp: 95, atk: 17, subject: "自然", q_levels: [1, 2],
    exp: 15, gold: 8, drops: [{ item: "crystal", rate: 0.3 }], boss: false,
    desc: "一盞飄在空中的舊頭燈，霧讓它一下亮一下暗。",
    wake: "坑道螢燈清醒了，穩穩地亮著，飄回坑道的掛鉤上。"
  },
  mn_drill: {
    name: "鑿岩穿山獸", sprite: "mon_mn_drill", level: 3, hp: 95, atk: 17, subject: "數學", q_levels: [1, 2],
    exp: 15, gold: 8, drops: [{ item: "crystal", rate: 0.3 }], boss: false,
    desc: "尾巴像鑽頭的穿山獸，被霧弄得到處鑽洞。",
    wake: "鑿岩穿山獸清醒了，鑽回自己的小洞睡覺。"
  },
  mn_timber: {
    name: "坑木百足", sprite: "mon_mn_timber", level: 3, hp: 95, atk: 18, subject: "國語", q_levels: [1, 2],
    exp: 17, gold: 8, drops: [{ item: "herb", rate: 0.4 }], boss: false,
    desc: "舊坑木變成的長長蟲，霧讓牠忘了要撐住坑道。",
    wake: "坑木百足清醒了，乖乖地趴回坑道邊。"
  },

  // ── 地圖等級 4（M08 月世界泥岩丘、M10 府城古城、M11 古城塔頂）──
  boar: {
    legacy_s: { level: 4, hp: 320, atk: 20, exp: 30, gold: 13, q_levels: [3, 4] },   // v3.0（70 號 3.3、5.1）舊南部旗標 legacySouth 時用的舊數值（套用前的數值）
    name: "岩丘野豬", sprite: "mon_boar", level: 5, hp: 390, atk: 59, subject: "社會", q_levels: [2, 3],
    exp: 115, gold: 35, drops: [{ item: "key", rate: 0.4 }], boss: false,
    desc: "在泥岩溝谷裡亂跑的野豬，迷糊時把柵欄鑰匙叼走了。",
    wake: "岩丘野豬清醒了，放下鑰匙，跑回溝谷。"
  },
  wisp: {
    legacy_s: { level: 4, hp: 340, atk: 21, exp: 35, gold: 15, q_levels: [3, 4] },   // v3.0（70 號 3.3、5.1）舊南部旗標 legacySouth 時用的舊數值（套用前的數值）
    name: "迷霧精", sprite: "mon_wisp", level: 5, hp: 330, atk: 53, subject: "英語", q_levels: [2, 3],
    exp: 95, gold: 30, drops: [{ item: "crystal", rate: 0.3 }], boss: false,
    desc: "一小團會飄的霧，是很多很小的水滴。被光照暖就會散掉。",
    wake: "迷霧精被光照暖了，小水滴變成水蒸氣，散掉了。"
  },
  armor: {
    legacy_s: { level: 4, hp: 360, atk: 22, exp: 40, gold: 16, q_levels: [3, 4] },   // v3.0（70 號 3.3、5.1）舊南部旗標 legacySouth 時用的舊數值（套用前的數值）
    name: "空盔甲", sprite: "mon_armor", level: 5, hp: 330, atk: 54, subject: "社會", q_levels: [2, 3],
    exp: 95, gold: 35, drops: [{ item: "gear", rate: 0.3 }], boss: false,
    desc: "古城的舊盔甲，被霧吹得自己走來走去。",
    wake: "空盔甲清醒了，喀啦喀啦走回展示台站好。"
  },

  // ───────────────────────────── 頭目 ─────────────────────────────
  tree_king: {
    legacy_s: { level: 2, hp: 510, atk: 13, exp: 96, gold: 48, q_levels: [2, 4] },   // v3.0（70 號 3.3、5.1）舊南部旗標 legacySouth 時用的舊數值（套用前的數值）
    name: "枯萎樹王", sprite: "boss_tree", level: 5, hp: 1460, atk: 48, subject: "自然", q_levels: [2, 4],
    exp: 950, gold: 350, drops: [{ item: "herb", rate: 1 }], boss: true,
    phases: 3, phase_q: 2, last_q_level: 4, ref_mobs: ["al_cypress", "owl"],
    dialog_before: "D_BOSS_TREE_A", dialog_after: "D_BOSS_TREE_B",
    desc: "守護神木森林的千年神木，被霧附身後忘了怎麼長葉子。",
    wake: "神木清醒了，枝頭冒出新的綠芽。"
  },
  fog_octopus: {
    name: "迷霧章魚", sprite: "boss_octopus", level: 2, hp: 540, atk: 16, subject: "英語", q_levels: [2, 4],
    exp: 136, gold: 64, drops: [{ item: "snack", rate: 1 }], boss: true,
    phases: 3, phase_q: 2, last_q_level: 4, ref_mobs: ["crab", "seagull"],
    dialog_before: "D_BOSS_OCTO_A", dialog_after: "D_BOSS_OCTO_B",
    battle_bg: "harbor",   // v1.1 試玩建議 S2：章魚在磺火漁港木橋盡頭，戰鬥背景用漁港（M01 地圖的 battle_bg 是 grass）
    desc: "從遠海漂來的大章魚，擋在漁港碼頭。只聽得懂英文，一直打瞌睡。",
    wake: "迷霧章魚清醒了，揮揮觸手游回大海。"
  },
  mud_frog: {
    name: "泥巴大蛙", sprite: "boss_frog", level: 4, hp: 860, atk: 27, subject: "數學", q_levels: [2, 4],
    exp: 350, gold: 150, drops: [{ item: "gear", rate: 1 }], boss: true,
    legacy: { level: 3, hp: 750, atk: 16, exp: 160, gold: 80 },   // v1.3（62 號 3.3、5.4）建議 PL 17／轉職 Lv14
    phases: 3, phase_q: 2, last_q_level: 4, ref_mobs: ["mudslime", "frog"],
    dialog_before: "D_BOSS_FROG_A", dialog_after: "D_BOSS_FROG_B",
    desc: "紅樹林濕地最大的青蛙，霧讓牠數字全亂掉，一直亂丟泥巴。",
    wake: "泥巴大蛙清醒了，呱呱笑著跳回池塘。"
  },
  noise_bat: {
    name: "噪音蝙蝠王", sprite: "boss_bat", level: 2, hp: 310, atk: 14, subject: "國語", q_levels: [1, 3],
    exp: 96, gold: 48, drops: [{ item: "bat_wing", rate: 1 }], boss: true,
    phases: 3, phase_q: 2, last_q_level: 4, ref_mobs: ["bat", "rock", "goblin"],
    dialog_before: "D_BOSS_BAT_A", dialog_after: "D_BOSS_BAT_B",
    desc: "蝙蝠們的老大，霧讓牠的叫聲變得好吵，大家都看不下書。",
    wake: "噪音蝙蝠王清醒了，安安靜靜地倒掛著睡著了。"
  },
  angry_golem: {
    legacy_s: { level: 4, hp: 1200, atk: 21, exp: 350, gold: 150, q_levels: [3, 4] },   // v3.0（70 號 3.3、5.1）舊南部旗標 legacySouth 時用的舊數值（套用前的數值）
    name: "暴躁石像", sprite: "boss_golem", level: 5, hp: 1860, atk: 57, subject: "社會", q_levels: [2, 4],
    exp: 1400, gold: 450, drops: [{ item: "crystal", rate: 1 }], boss: true,
    phases: 3, phase_q: 2, last_q_level: 4, ref_mobs: ["boar", "mm_mudstone"],
    dialog_before: "D_BOSS_GOLEM_A", dialog_after: "D_BOSS_GOLEM_B",
    desc: "守護月世界的石像，被霧弄得忘了大家一起訂的規則。",
    wake: "暴躁石像清醒了，慢慢坐下來守護泥岩丘。"
  },
  fog_demon: {
    legacy_s: { level: 5, hp: 1510, atk: 24, exp: 450, gold: 180, q_levels: [3, 4] },   // v3.0（70 號 3.3、5.1）舊南部旗標 legacySouth 時用的舊數值（套用前的數值）
    name: "遺忘霧魔", sprite: "boss_fog", level: 5, hp: 1560, atk: 52, subject: "混合",
    subjects: ["國語", "英語", "數學", "自然"], q_levels: [2, 4],
    exp: 1100, gold: 350, drops: [{ item: "dawn_shard_s", rate: 1 }], boss: true,   // v3.0（70 號 2.5）：遺忘霧魔改成南霧將，不再是最終頭目（final 旗標拿掉；終章的遺忘霧王才標；v2.0 是「boss: true, final: true,」）
    phases: 3, phase_q: 2, last_q_level: 4, ref_mobs: ["wisp", "armor"],
    dialog_before: "D_BOSS_FOG_A", dialog_after: "D_BOSS_FOG_B",
    desc: "南霧將。盤在古城塔頂的大霧，讓整座府城忘了學過的知識。",
    wake: "遺忘霧魔被四道光照暖，大霧慢慢散開，只留下一小團霧。"
  },
  // v1.1 第一章支線頭目（59 號 3.2 節）：金瓜石坑道最深處，只在 Q_JGS_3 進行中出現；建議 Lv10
  mnb_goldjaw: {
    name: "金脈鐵顎王", sprite: "boss_mnb_goldjaw", level: 3, hp: 540, atk: 16, subject: "混合",
    subjects: ["數學", "自然"], q_levels: [2, 4],
    exp: 136, gold: 64, drops: [{ item: "crystal", rate: 1 }], boss: true,
    phases: 3, phase_q: 2, last_q_level: 4, ref_mobs: ["mn_cart", "mn_ore", "mn_drill"],
    dialog_before: "D_BOSS_GOLDJAW_A", dialog_after: "D_BOSS_GOLDJAW_B",
    desc: "由齒輪、鋼索和大岩石組成的礦山巨獸。霧讓它以為整座山的金子都要被搶走。",
    wake: "金脈鐵顎王清醒了，胸口的金光變得暖暖的，慢慢沉回坑道深處。"
  },

  // ── v1.2 第二章新怪（61 號 3.2 節）：草嶺古道（M49）與宜蘭（M14、M50、M51）的「蘭陽系」小怪、頭目黏黏雨雲王（M51 堤防盡頭）──
  // 數值：現行經濟、37 號公式，參考主角＝轉職後的代表職業（61 號 3.1）；小怪出題 2–3 星、頭目 2–4 星。礦塵旋風（mn_dust）數值不改，草嶺古道入口也出現
  ly_tigerwind: {
    name: "虎紋霧獸", sprite: "mon_ly_tigerwind", level: 3, hp: 145, atk: 21, subject: "國語", q_levels: [2, 3],
    exp: 18, gold: 9, drops: [{ item: "herb", rate: 0.3 }], boss: false,
    desc: "草嶺的霧聚成的小獸，霧讓牠忘了要讓路給走古道的人。",
    wake: "虎紋霧獸清醒了，化成一陣風吹過山坡。"
  },
  ly_kumquat: {
    name: "金棗彈彈", sprite: "mon_ly_kumquat", level: 3, hp: 150, atk: 23, subject: "數學", q_levels: [2, 3],
    exp: 20, gold: 10, drops: [{ item: "kumquat", rate: 0.5 }], boss: false,
    desc: "被霧弄迷糊的金棗，一直跳來跳去不肯回到樹上。",
    wake: "金棗彈彈清醒了，咚的一聲跳回金棗樹。"
  },
  ly_scallion: {
    name: "蔥稈草甲獸", sprite: "mon_ly_scallion", level: 3, hp: 160, atk: 24, subject: "自然", q_levels: [2, 3],
    exp: 20, gold: 11, drops: [{ item: "herb", rate: 0.4 }], boss: false,
    desc: "穿著稻草盔甲的蔥田小獸，霧讓牠以為大家都要來拔蔥。",
    wake: "蔥稈草甲獸清醒了，乖乖躺回田裡曬稻草。"
  },
  ly_bubble: {
    name: "冷泉氣泡精", sprite: "mon_ly_bubble", level: 3, hp: 165, atk: 25, subject: "自然", q_levels: [2, 3],
    exp: 25, gold: 11, drops: [{ item: "crystal", rate: 0.3 }], boss: false,
    desc: "冷泉裡冒出來的小水精，霧讓牠一直冒泡停不下來。",
    wake: "冷泉氣泡精清醒了，咕嚕咕嚕回到冷泉池。"
  },
  ly_mackerel: {
    name: "鯖鯖跳刀魚", sprite: "mon_ly_mackerel", level: 3, hp: 170, atk: 26, subject: "英語", q_levels: [2, 3],
    exp: 25, gold: 12, drops: [{ item: "snack", rate: 0.4 }], boss: false,
    desc: "漁港邊跳上岸的大魚，霧讓牠忘了回海裡的路。",
    wake: "鯖鯖跳刀魚清醒了，撲通一聲游回大海。"
  },
  // v1.2 第二章章末頭目（61 號 3.2 節）：南方澳漁港堤防盡頭，只在 Q_YL_5 進行中出現；建議轉職 Lv11 以上（PL 14）。掉落雨後彩虹片（紀念品）
  wxb_raincloud: {
    name: "黏黏雨雲王", sprite: "boss_wxb_raincloud", level: 3, hp: 760, atk: 23, subject: "自然", q_levels: [2, 4],
    exp: 250, gold: 120, drops: [{ item: "rainbow_piece", rate: 1 }], boss: true,
    phases: 3, phase_q: 2, last_q_level: 4, ref_mobs: ["ly_bubble", "ly_mackerel"],
    dialog_before: "D_BOSS_RAINCLOUD_A", dialog_after: "D_BOSS_RAINCLOUD_B",
    battle_bg: "harbor",   // 協調員裁定 2026-10-25：在南方澳防波堤，戰鬥背景用漁港（M51 地圖是 coldspring）
    desc: "一朵黏住不走的大雨雲。",
    wake: "黏黏雨雲王清醒了，下完最後一陣小雨，讓出藍天。"
  },

  // ── v1.3 台北章新怪（62 號 3.2 節）：茶山系（M52 坪林）、動物系與機械系（M13 貓空、M54 信義，機械系從桃竹提前）、地熱系（M53 北投；硫晶刺蝟在 M03 硫磺谷）──
  // 數值：現行經濟、37 號公式，參考主角＝轉職後代表職業（62 號 3.1）；小怪出題 2–3 星；硫晶刺蝟用 59 號見習公式。27 號的戰鬥演出（閃避、畫面變白、停一回合）只做演出、不改數值（還沒做）
  // 安全提醒（62 號 3.2，S197／27 號）：地熱系打倒後說「地熱谷、噴氣孔的水很燙……不能碰」；閃閃紅綠燈說「過馬路要看燈號」
  tea_mantis: {
    name: "茶芽螳螂", sprite: "mon_tea_mantis", level: 4, hp: 170, atk: 26, subject: "自然", q_levels: [2, 3],
    exp: 25, gold: 12, drops: [{ item: "herb", rate: 0.3 }], boss: false,
    desc: "嫩綠色的螳螂，前腳像兩片鋸齒茶葉，被霧弄得亂揮亂舞。",
    wake: "茶芽螳螂清醒了，收起茶葉前腳，躲回茶樹叢裡。"
  },
  tea_moth: {
    name: "霧茶夜蛾", sprite: "mon_tea_moth", level: 4, hp: 175, atk: 26, subject: "自然", q_levels: [2, 3],
    exp: 30, gold: 13, drops: [{ item: "crystal", rate: 0.3 }], boss: false,
    desc: "翅膀像捲起來的乾茶葉的大蛾，一拍翅膀就灑出霧粉。",
    wake: "霧茶夜蛾清醒了，輕輕飛回山坡的茶園。"
  },
  tea_basket: {
    name: "焙籠火狸", sprite: "mon_tea_basket", level: 4, hp: 180, atk: 28, subject: "社會", q_levels: [2, 3],
    exp: 30, gold: 13, drops: [{ item: "tea_leaf", rate: 0.5 }], boss: false,
    desc: "背著烘茶竹籠的狸，眼睛像炭火，被霧弄得搶走茶葉。",
    wake: "焙籠火狸清醒了，把茶葉還給你，跑回茶園。"
  },
  an_magpie: {
    name: "藍尾鵲鵲", sprite: "mon_an_magpie", level: 4, hp: 180, atk: 28, subject: "英語", q_levels: [2, 3],
    exp: 30, gold: 13, drops: [{ item: "feather", rate: 0.3 }], boss: false,
    desc: "寶藍色身體、長長藍尾巴的圓滾滾小鳥，霧讓牠一直搶先啄人。",
    wake: "藍尾鵲鵲清醒了，拖著長尾巴飛回樹梢。"
  },
  mc_gondola: {
    name: "搖搖纜車廂", sprite: "mon_mc_gondola", level: 4, hp: 185, atk: 28, subject: "自然", q_levels: [2, 3],
    exp: 30, gold: 14, drops: [{ item: "crystal", rate: 0.3 }], boss: false,
    desc: "貓空的淡綠色小纜車廂，霧讓它在空中搖來搖去停不下來。",
    wake: "搖搖纜車廂清醒了，穩穩地回到纜線上。"
  },
  mc_alarm: {
    name: "鈴鈴鬧鐘兵", sprite: "mon_mc_alarm", level: 4, hp: 185, atk: 28, subject: "數學", q_levels: [2, 3],
    exp: 30, gold: 14, drops: [{ item: "ticket", rate: 0.5 }], boss: false,
    desc: "紅色的雙鈴鬧鐘，霧讓它亂響，還叼走了纜車票。",
    wake: "鈴鈴鬧鐘兵清醒了，把時間調回正確的時刻。"
  },
  mc_roaster: {
    name: "炒炒烘茶機", sprite: "mon_mc_roaster", level: 4, hp: 190, atk: 29, subject: "自然", q_levels: [2, 3],
    exp: 30, gold: 14, drops: [{ item: "tea_leaf", rate: 0.3 }], boss: false,
    desc: "圓肚子的銅色烘茶機，頭頂一直冒白煙，眼睛很睏。",
    wake: "炒炒烘茶機清醒了，茶香飄滿整座山。"
  },
  mc_signal: {
    name: "閃閃紅綠燈", sprite: "mon_mc_signal", level: 4, hp: 185, atk: 28, subject: "社會", q_levels: [2, 3],
    exp: 30, gold: 14, drops: [{ item: "herb", rate: 0.3 }], boss: false,
    desc: "圓滾滾的小紅綠燈，霧讓它的燈號亂閃。",
    wake: "閃閃紅綠燈清醒了，紅黃綠又照順序亮起來。過馬路要看燈號喔！"
  },
  mc_vending: {
    name: "咚咚販賣機", sprite: "mon_mc_vending", level: 4, hp: 190, atk: 29, subject: "英語", q_levels: [2, 3],
    exp: 30, gold: 14, drops: [{ item: "snack", rate: 0.4 }], boss: false,
    desc: "淡藍色的販賣機，霧讓它一直咚咚地丟出飲料。",
    wake: "咚咚販賣機清醒了，乖乖站回原來的地方。"
  },
  gt_steam: {
    name: "噴氣嘶嘶蛇", sprite: "mon_gt_steam", level: 4, hp: 190, atk: 29, subject: "自然", q_levels: [2, 3],
    exp: 30, gold: 14, drops: [{ item: "herb", rate: 0.3 }], boss: false,
    desc: "從地面裂縫鑽出來的白色蒸氣蛇，一張口就嘶嘶叫。",
    wake: "噴氣嘶嘶蛇清醒了，鑽回地面的裂縫裡。地熱谷、噴氣孔的水很燙、腐蝕性很強，不能碰！"
  },
  gt_jade: {
    name: "青磺水靈", sprite: "mon_gt_jade", level: 4, hp: 190, atk: 29, subject: "自然", q_levels: [2, 3],
    exp: 35, gold: 15, drops: [{ item: "crystal", rate: 0.3 }], boss: false,
    desc: "地熱谷裡淡綠色的水團精靈，頭上一直冒熱氣。",
    wake: "青磺水靈清醒了，流回地熱谷。地熱谷、噴氣孔的水很燙、腐蝕性很強，不能碰！"
  },
  gt_sulfur: {
    name: "硫晶刺蝟", sprite: "mon_gt_sulfur", level: 2, hp: 40, atk: 10, subject: "自然", q_levels: [1, 2],
    exp: 6, gold: 4, drops: [{ item: "herb", rate: 0.3 }], boss: false,
    desc: "背上長滿淡黃色晶刺的刺蝟，生氣時晶刺會冒白煙。",
    wake: "硫晶刺蝟清醒了，縮成一團滾回草叢。地熱谷、噴氣孔的水很燙、腐蝕性很強，不能碰！"
  },

  // ── v1.4 桃竹章新怪（63 號 3.2 節）：桃竹系（豆干盾甲獸、木屑雕紋獸、米粉飄飄獸）、風雲系（雷咚咚、咻咻風精）、機械系（圓圓掃地機）、北霧將霧閘機將（M15 壩頂）──
  // 數值：現行經濟、37 號公式，參考主角＝轉職後代表職業（63 號 3.1，PL 17–21）；小怪出題 2–3 星、頭目 2–4 星。desc／wake＝劇本組（wip_v14_draft/dialogs_taoyuan.js）
  // 雷咚咚的閃光要柔和（27 號；技能特效每秒最多閃 3 次的規則照樣）；霧閘機將的演出（關水門、放水花、齒輪露出）只是演出、還沒做
  ty_tofu: {
    name: "豆干盾甲獸", sprite: "mon_ty_tofu", level: 4, hp: 200, atk: 31, subject: "數學", q_levels: [2, 3],
    exp: 35, gold: 16, drops: [{ item: "herb", rate: 0.3 }], boss: false,
    desc: "被霧弄迷糊的豆干小獸，把老街擋住不讓人過。",
    wake: "豆干盾甲獸清醒了，乖乖排回滷鍋旁邊。"
  },
  ty_carve: {
    name: "木屑雕紋獸", sprite: "mon_ty_carve", level: 4, hp: 200, atk: 32, subject: "國語", q_levels: [2, 3],
    exp: 40, gold: 16, drops: [{ item: "crystal", rate: 0.3 }], boss: false,
    desc: "工坊裡跑出來的木雕小獸，霧讓牠忘了自己是作品。",
    wake: "木屑雕紋獸清醒了，跳回工坊的木架上。"
  },
  wx_thunder: {
    name: "雷咚咚", sprite: "mon_wx_thunder", level: 4, hp: 210, atk: 32, subject: "自然", q_levels: [2, 3],
    exp: 40, gold: 17, drops: [{ item: "herb", rate: 0.3 }], boss: false,
    desc: "肚子綁著小鼓的灰紫色小雲，被霧弄得一直亂打鼓。",
    wake: "雷咚咚清醒了，抱著小鼓飄回天上。"
  },
  wx_wind: {
    name: "咻咻風精", sprite: "mon_wx_wind", level: 4, hp: 220, atk: 34, subject: "自然", q_levels: [2, 3],
    exp: 40, gold: 17, drops: [{ item: "pinwheel", rate: 0.5 }], boss: false,
    desc: "像捲捲圍巾的淡綠色風，霧讓它到處亂吹。",
    wake: "咻咻風精清醒了，輕輕吹著米粉架飄走了。"
  },
  mc_vacuum: {
    name: "圓圓掃地機", sprite: "mon_mc_vacuum", level: 4, hp: 220, atk: 34, subject: "數學", q_levels: [2, 3],
    exp: 45, gold: 18, drops: [{ item: "crystal", rate: 0.3 }], boss: false,
    desc: "扁扁圓圓的掃地機器人，霧讓它一直繞圈圈。",
    wake: "圓圓掃地機清醒了，乖乖回到充電座。"
  },
  hc_noodle: {
    name: "米粉飄飄獸", sprite: "mon_hc_noodle", level: 4, hp: 220, atk: 35, subject: "英語", q_levels: [2, 3],
    exp: 45, gold: 18, drops: [{ item: "snack", rate: 0.4 }], boss: false,
    desc: "曬場上的米粉被亂風吹成一團，變成了小怪獸。",
    wake: "米粉飄飄獸清醒了，整整齊齊掛回曬架。"
  },
  mb_floodgate: {
    name: "霧閘機將", sprite: "boss_mb_floodgate", level: 4, hp: 1000, atk: 32, subject: "混合",
    subjects: ["自然", "數學"], q_levels: [2, 4],
    exp: 450, gold: 190, drops: [{ item: "dawn_shard_n", rate: 1 }], boss: true,
    phases: 3, phase_q: 2, last_q_level: 4, ref_mobs: ["ty_tofu", "wx_thunder"],
    dialog_before: "D_BOSS_FLOODGATE_A", dialog_after: "D_BOSS_FLOODGATE_B",
    desc: "大水門機器人，胸口的大齒輪被灰霧包住，把水門關起來了。",
    wake: "霧閘機將清醒了，水門打開，清水流向田野。"
  },

  // ── v4.0 東部（71 號 7.3；wip_v40/v40_apply.js）BEGIN：台東（M26）縱谷滴滴雨精、彎彎彩虹，台東頭目霧氣球大王；花蓮（M29）東海岸浪花花、搶搶獼猴，東霧將雲鯨霧將 ──
  // exp、gold＝新經濟規則（V40_ECON.MON_PL；頭目 ×10）；hp、atk 照 71 號 7.3。K3-A 強化版（wx_rain_e、wx_wave_e）用程式改色的圖（art_src\v1\east\processed\recolor）
  wx_rain_e: {
    name: "縱谷滴滴雨精", sprite: "mon_wx_rain_e", level: 5, hp: 490, atk: 77, subject: "自然", q_levels: [2, 3],
    exp: 165, gold: 50, drops: [{ item: "umbrella", rate: 0.3 }], boss: false,
    desc: "淡青綠色的大雨滴，撐著茶葉當傘。霧讓它在縱谷亂下雨。",
    wake: "縱谷滴滴雨精清醒了，化成一陣小雨，落進縱谷的田裡。"
  },
  wx_rainbow: {
    name: "彎彎彩虹", sprite: "mon_wx_rainbow", level: 5, hp: 500, atk: 79, subject: "英語", q_levels: [2, 3],
    exp: 175, gold: 50, drops: [{ item: "rainbow_ribbon", rate: 0.4 }], boss: false,
    desc: "兩端踩著白雲的小彩虹，霧讓它把顏色排亂了。",
    wake: "彎彎彩虹清醒了，七種顏色排好，掛回天上。"
  },
  wx_wave_e: {
    name: "東海岸浪花花", sprite: "mon_wx_wave_e", level: 5, hp: 520, atk: 85, subject: "自然", q_levels: [2, 3],
    exp: 195, gold: 55, drops: [{ item: "sea_glass", rate: 0.3 }], boss: false,
    desc: "深藍色的浪花，泡沫頭髮閃著金光。霧讓它一直往岸上衝。",
    wake: "東海岸浪花花清醒了，變回小小的浪，回到太平洋。"
  },
  an_macaque: {
    name: "搶搶獼猴", sprite: "mon_an_macaque", level: 5, hp: 540, atk: 86, subject: "國語", q_levels: [2, 3],
    exp: 210, gold: 60, drops: [{ item: "herb", rate: 0.3 }], boss: false,
    dialog_after_once: "D_MACAQUE_AFTER",   // 清醒後第一次播一次旁白（71 號 4.11：野生的猴子不要餵）
    desc: "毛蓬蓬的灰褐色小猴子，抱著搶來的便當盒，蹲低身子盯著你。",
    wake: "搶搶獼猴清醒了，把便當還給你，跳回樹林。"
  },
  fob_balloon: {
    name: "台東頭目：霧氣球大王", sprite: "boss_fob_balloon", level: 5, hp: 2270, atk: 72, subject: "混合",
    subjects: ["自然", "數學"], q_levels: [2, 4],
    exp: 1850, gold: 550, drops: [{ item: "balloon_knot", rate: 1 }], boss: true,
    phases: 3, phase_q: 2, last_q_level: 4, ref_mobs: ["wx_rain_e", "wx_rainbow"], battle_bg: "grass",
    dialog_before: "D_BOSS_BALLOON_A", dialog_after: "D_BOSS_BALLOON_B",
    desc: "台東的頭目。巨大的灰色霧氣球擋住高台的天空，球裡的霧慢慢旋轉。",
    wake: "霧氣球大王清醒了，霧全部散掉，變回一顆彩色熱氣球。"
  },
  wxb_whale: {
    name: "東霧將：雲鯨霧將", sprite: "boss_wxb_whale", level: 5, hp: 2410, atk: 79, subject: "混合",
    subjects: ["自然", "英語"], q_levels: [2, 4],
    exp: 2200, gold: 600, drops: [{ item: "dawn_shard_e", rate: 1 }], boss: true,
    phases: 3, phase_q: 2, last_q_level: 4, ref_mobs: ["wx_wave_e", "an_macaque"], battle_bg: "pacific_east",
    dialog_before: "D_BOSS_WHALE_A", dialog_after: "D_BOSS_WHALE_B",
    desc: "東霧將。白雲和灰霧組成的大鯨魚，在海上的天空游，把霧吹進山谷。",
    wake: "雲鯨霧將清醒了，變成一朵大白雲，慢慢游向太平洋。"
  },
  // ── v4.0 東部 END ──

  // ── v3.0 南部（70 號 3.2；71 號 7.2；wip_v30_draft/v30_apply.js）：阿里山系（M04）、海盜系（M21、M22、M25）、月世界系（M08）、大樹系（M23）、風雲系（M25）；精英錨錨大副；屏東頭目霧帆號 ──
  // exp、gold＝新經濟規則（70 號 3.2 的建議 PL；頭目 ×10、精英 ×3）；Z9、Z10 的 hp、atk 照 71 號 7.2（和每區一件新裝備同一版）。錨錨大副是精英（elite，不是頭目）：只在 Q_AP_4 進行中出現
  // 27 號的戰鬥演出（升帆叫出小海盜、轉舵換科目、燈塔照到時防禦下降等）只做演出、不改數值（還沒做）
  al_cypress: {
    name: "紅檜樹根獸", sprite: "mon_al_cypress", level: 5, hp: 320, atk: 51, subject: "自然", q_levels: [2, 3],
    exp: 90, gold: 30, drops: [{ item: "herb", rate: 0.3 }], boss: false,
    desc: "紅檜的老樹根被霧弄迷糊，爬出土來，用樹根爪子到處絆人。",
    wake: "紅檜樹根獸清醒了，鑽回土裡，靜靜抱住大樹。"
  },
  al_cloud: {
    name: "雲海毛毛", sprite: "mon_al_cloud", level: 5, hp: 320, atk: 51, subject: "數學", q_levels: [2, 3],
    exp: 90, gold: 30, drops: [{ item: "crystal", rate: 0.3 }], boss: false,
    desc: "山谷裡的雲海被霧攪亂，捲成一團團亂滾的毛毛，一生氣就變灰。",
    wake: "雲海毛毛清醒了，輕輕飄回山谷，變回白白的雲海。"
  },
  pi_hermit: {
    name: "殼殼寄居蟹水手", sprite: "mon_pi_hermit", level: 5, hp: 340, atk: 54, subject: "英語", q_levels: [2, 3],
    exp: 100, gold: 35, drops: [{ item: "memory_shell", rate: 0.4 }], boss: false,
    desc: "背著小木桶當殼的寄居蟹，綁著水手頭巾，一被打就縮進桶裡。",
    wake: "殼殼寄居蟹清醒了，背著木桶跑回沙灘。"
  },
  pi_milkfish: {
    name: "目目跳跳兵", sprite: "mon_pi_milkfish", level: 5, hp: 340, atk: 56, subject: "數學", q_levels: [2, 3],
    exp: 100, gold: 35, drops: [{ item: "chart_piece", rate: 0.3 }], boss: false,
    desc: "穿水手背心的虱目魚，用尾巴一跳一跳，揮著木槳亂敲。",
    wake: "目目跳跳兵清醒了，撲通一聲游回魚塭。"
  },
  pi_anchor: {
    name: "錨錨船錨怪", sprite: "mon_pi_anchor", level: 5, hp: 340, atk: 56, subject: "數學", q_levels: [2, 3],
    exp: 105, gold: 35, drops: [{ item: "crystal", rate: 0.3 }], boss: false,
    desc: "拖著鐵鍊走路的大船錨，又硬又慢，一臉很累的樣子。",
    wake: "錨錨船錨怪清醒了，沉穩地坐回碼頭邊。"
  },
  pib_anchor: {
    name: "錨錨大副", sprite: "mon_pib_anchor", level: 5, hp: 880, atk: 57, subject: "數學", q_levels: [2, 3],
    subjects: ["數學", "社會"],   // 精英：數學、社會輪流（70 號 3.2）
    exp: 315, gold: 105, drops: [{ item: "sea_chart", rate: 1 }], boss: false, elite: true,
    dialog_before: "D_BOSS_ANCHOR_A", dialog_after: "D_BOSS_ANCHOR_B",   // 精英也播（game.js：boss 或 elite）
    desc: "戴著舊船長帽的大船錨，鐵鍊像披風，死守著搶來的航海圖。",
    wake: "錨錨大副清醒了，把航海圖還給港口書記。"
  },
  pi_crab: {
    name: "大鉗泡泡砲手", sprite: "mon_pi_crab", level: 5, hp: 350, atk: 57, subject: "自然", q_levels: [2, 3],
    exp: 110, gold: 35, drops: [{ item: "memory_shell", rate: 0.4 }], boss: false,
    desc: "揮著淡紫色大鉗子的招潮蟹，戴水手帽，把嘴邊吐的泡泡當砲彈。",
    wake: "大鉗泡泡砲手清醒了，揮著大鉗子鑽回泥洞。"
  },
  mm_mudstone: {
    name: "泥岩土偶", sprite: "mon_mm_mudstone", level: 5, hp: 400, atk: 60, subject: "自然", q_levels: [2, 3],
    exp: 120, gold: 40, drops: [{ item: "crystal", rate: 0.3 }], boss: false,
    desc: "青灰色的泥岩被霧捏成土偶，身上有雨水沖出的溝紋，一走就掉泥屑。",
    wake: "泥岩土偶清醒了，坐下來變回一座小土丘。"
  },
  ds_pineapple: {
    name: "鳳梨盔甲蟲", sprite: "mon_ds_pineapple", level: 5, hp: 410, atk: 62, subject: "數學", q_levels: [2, 3],
    exp: 125, gold: 40, drops: [{ item: "pineapple", rate: 0.5 }], boss: false,
    desc: "穿著金黃鳳梨盔甲的甲蟲，被霧弄得在鳳梨田裡橫衝直撞。",
    wake: "鳳梨盔甲蟲清醒了，鑽回鳳梨葉下面。"
  },
  ds_lychee: {
    name: "荔枝紅眼仔", sprite: "mon_ds_lychee", level: 5, hp: 420, atk: 64, subject: "國語", q_levels: [2, 3],
    exp: 130, gold: 40, drops: [{ item: "snack", rate: 0.4 }], boss: false,
    desc: "被霧吹落的大荔枝，紅殼一粒一粒，眼睛紅紅的，彈來彈去不肯回家。",
    wake: "荔枝紅眼仔清醒了，滾回荔枝樹下。"
  },
  pi_parrot: {
    name: "喳喳鸚鵡瞭望手", sprite: "mon_pi_parrot", level: 5, hp: 430, atk: 72, subject: "英語", q_levels: [2, 3],
    exp: 145, gold: 45, drops: [{ item: "chart_piece", rate: 0.3 }], boss: false,
    desc: "戴三角帽、拿望遠鏡的綠鸚鵡，一大叫就把小海盜叫過來。",
    wake: "喳喳鸚鵡清醒了，飛回船桅上唱歌。"
  },
  pi_octo: {
    name: "八八章魚舵手", sprite: "mon_pi_octo", level: 5, hp: 440, atk: 73, subject: "數學", q_levels: [2, 3],
    exp: 150, gold: 45, drops: [{ item: "memory_shell", rate: 0.4 }], boss: false,
    desc: "迷霧章魚的小姪子，八隻腳各拿一樣船上的東西，忙著亂打一通。",
    wake: "八八章魚舵手清醒了，把東西都放回船上。"
  },
  wx_wave: {
    name: "浪花花", sprite: "mon_wx_wave", level: 5, hp: 450, atk: 75, subject: "自然", q_levels: [2, 3],
    exp: 155, gold: 45, drops: [{ item: "sea_glass", rate: 0.3 }], boss: false,
    desc: "白浪捲成的小精靈，被霧推著一波一波衝上岸，第三波最大。",
    wake: "浪花花清醒了，嘩啦一聲回到大海。"
  },
  pib_ship: {
    name: "霧帆號", sprite: "boss_pib_ship", level: 5, hp: 1990, atk: 67, subject: "混合",
    subjects: ["英語", "自然", "社會"], q_levels: [2, 4],
    exp: 1550, gold: 450, drops: [{ item: "memory_shell", rate: 1 }], boss: true,
    phases: 3, phase_q: 2, last_q_level: 4, ref_mobs: ["pi_parrot", "pi_octo"], battle_bg: "pacific",
    dialog_before: "D_BOSS_SHIP_A", dialog_after: "D_BOSS_SHIP_B",
    desc: "南方海上的霧帆號，升起灰霧做的大帆，搶走了大家的記憶貝殼。",
    wake: "霧帆號清醒了，霧做的帆變成白雲，載著小海盜們回港。"
  },

  // ── v2.0 中部（69 號 3.2、附錄 A2；wip_v20/v20_apply.js）：苗栗系、大甲系、動物系（M17、M18，Z6）；鬼怪系（M19、M20，Z7）；頭目迷路火車頭、燈籠霧將（中霧將）──
  // hp、atk＝69 號 3.2（37 號公式、參考主角＝轉職後代表職業）；exp、gold＝新經濟（67 號 B 案：建議 PL 的 26 號 E、G，頭目 ×10；v20_current_econ.py 算），
  //   和 v20_0_econ_apply.js 的規則一樣。頭目是章節頭目：沒有 final 旗標（battleBgm 播 boss、不跑每日時間檢查）
  // 27 號的戰鬥演出（火車頭衝來衝去、燈籠霧將叫出小燈燈、喀喀木屐一次兩隻、白鼻心偷燈籠讓畫面變暗）只做演出、不改數值（還沒做）
  ml_signal: {
    name: "舊號誌臂", sprite: "mon_ml_signal", level: 5, hp: 230, atk: 37, subject: "社會", q_levels: [2, 3],
    exp: 50, gold: 19, drops: [{ item: "herb", rate: 0.3 }], boss: false,
    desc: "舊山線停用以後，號誌桿被霧弄迷糊，一直揮手叫人停下。",
    wake: "舊號誌臂清醒了，把手臂放下，乖乖站回鐵道邊。"
  },
  ml_berry: {
    name: "莓莓刺刺", sprite: "mon_ml_berry", level: 5, hp: 240, atk: 38, subject: "自然", q_levels: [2, 3],
    exp: 50, gold: 20, drops: [{ item: "snack", rate: 0.4 }], boss: false,
    desc: "草莓園邊的莓果被霧吹成了小刺球，誰靠近就扎誰。",
    wake: "莓莓刺刺清醒了，收起小刺，滾回草莓園。"
  },
  an_egret: {
    name: "高腳白鷺", sprite: "mon_an_egret", level: 5, hp: 250, atk: 39, subject: "自然", q_levels: [2, 3],
    exp: 55, gold: 20, drops: [{ item: "feather", rate: 0.3 }], boss: false,
    desc: "水田裡單腳站的白鷺，霧讓牠以為每個人都要搶牠的小魚。",
    wake: "高腳白鷺清醒了，張開翅膀飛向田野。"
  },
  dj_rush: {
    name: "藺草編編", sprite: "mon_dj_rush", level: 5, hp: 260, atk: 40, subject: "國語", q_levels: [2, 3],
    exp: 60, gold: 20, drops: [{ item: "herb", rate: 0.3 }], boss: false,
    desc: "工坊裡的藺草被霧吹亂，自己編成小獸跑了出來。",
    wake: "藺草編編清醒了，乖乖躺回工坊的草堆。"
  },
  dj_taro: {
    name: "芋頭圓圓", sprite: "mon_dj_taro", level: 5, hp: 260, atk: 42, subject: "數學", q_levels: [2, 3],
    exp: 60, gold: 25, drops: [{ item: "snack", rate: 0.4 }], boss: false,
    desc: "田裡的芋頭被霧吹醒，圓滾滾地到處撞人。",
    wake: "芋頭圓圓清醒了，滾回田裡的大葉子下面睡覺。"
  },
  mb_train: {
    name: "迷路火車頭", sprite: "boss_mb_train", level: 5, hp: 1180, atk: 38, subject: "混合",
    subjects: ["社會", "數學"], q_levels: [2, 4],
    exp: 650, gold: 250, drops: [{ item: "train_whistle", rate: 1 }], boss: true,
    phases: 3, phase_q: 2, last_q_level: 4, ref_mobs: ["ml_signal", "dj_taro"], battle_bg: "railway",
    dialog_before: "D_BOSS_TRAIN_A", dialog_after: "D_BOSS_TRAIN_B",
    desc: "圓滾滾的老火車頭，霧讓它找不到車站，在舊山線上衝來衝去。",
    wake: "迷路火車頭清醒了，嘟嘟兩聲，穩穩停回勝興車站。"
  },
  gh_umbrella: {
    name: "傘傘紙傘妖", sprite: "mon_gh_umbrella", level: 5, hp: 270, atk: 43, subject: "英語", q_levels: [2, 3],
    exp: 65, gold: 25, drops: [{ item: "umbrella_rib", rate: 0.5 }], boss: false,
    desc: "被霧從山上吹下來的油紙傘，在窄巷裡一跳一跳地嚇人。",
    wake: "傘傘紙傘妖清醒了，收起傘面靠在門邊。"
  },
  gh_geta: {
    name: "喀喀木屐", sprite: "mon_gh_geta", level: 5, hp: 280, atk: 45, subject: "數學", q_levels: [2, 3],
    exp: 70, gold: 25, drops: [{ item: "crystal", rate: 0.3 }], boss: false,
    desc: "一雙會自己走路的木屐，霧讓它們喀啦喀啦跑個不停。",
    wake: "喀喀木屐清醒了，排好隊回到玄關。"
  },
  gh_lantern: {
    name: "燈燈小燈籠", sprite: "mon_gh_lantern", level: 5, hp: 290, atk: 46, subject: "國語", q_levels: [2, 3],
    exp: 75, gold: 25, drops: [{ item: "lantern_paper", rate: 0.4 }], boss: false,
    desc: "被霧吹離屋簷的紅燈籠，飄來飄去找不到回家的路。",
    wake: "燈燈小燈籠清醒了，乖乖掛回屋簷下。"
  },
  gh_civet: {
    name: "夜遊白鼻心", sprite: "mon_gh_civet", level: 5, hp: 300, atk: 48, subject: "社會", q_levels: [2, 3],
    exp: 75, gold: 25, drops: [{ item: "herb", rate: 0.3 }], boss: false,
    desc: "提著小燈籠的調皮白鼻心，霧讓牠把大家的燈籠都偷走了。",
    wake: "夜遊白鼻心清醒了，把燈籠還回來，跑回森林。"
  },
  mb_lantern: {
    name: "燈籠霧將", sprite: "boss_mb_lantern", level: 5, hp: 1350, atk: 44, subject: "混合",
    subjects: ["國語", "自然"], q_levels: [2, 4],
    exp: 850, gold: 300, drops: [{ item: "dawn_shard_c", rate: 1 }], boss: true,
    phases: 3, phase_q: 2, last_q_level: 4, ref_mobs: ["gh_lantern", "gh_civet"], battle_bg: "levee",
    dialog_before: "D_BOSS_LANTERN_A", dialog_after: "D_BOSS_LANTERN_B",
    desc: "比房子還高的大紅燈籠，裡面不是火，而是慢慢旋轉的灰霧。",
    wake: "燈籠霧將清醒了，燈籠裡亮起暖暖的橘光。"
  },
  // ═══ v4.2 第 4a 批 MONSTERS BEGIN（tools/v42_apply.js 每次整段重建）═══
  an_muntjac: {
    "name": "吠吠山羌",
    "sprite": "mon_an_muntjac",
    "level": 5,
    "hp": 600,
    "atk": 97,
    "exp": 260,
    "gold": 70,
    "subject": "國語",
    "q_levels": [
      2,
      3
    ],
    "boss": false,
    "final": false,
    "phases": 1,
    "phase_q": 0,
    "drops": [
      {
        "item": "mountain_fruit",
        "rate": 0.4
      }
    ],
    "desc": "小小的棕色山羌，四腳站穩，聽到聲音就警戒地大叫。",
    "wake": "吠吠山羌清醒了，一溜煙跑進樹林。",
    "dialog_after_once": "D_MUNTJAC_AFTER"
  },
  fo_puff_cave: {
    "name": "洞窟噗噗霧泡泡",
    "sprite": "mon_fo_puff_cave",
    "level": 5,
    "hp": 610,
    "atk": 98,
    "exp": 270,
    "gold": 70,
    "subject": "自然",
    "q_levels": [
      2,
      3
    ],
    "boss": false,
    "final": false,
    "phases": 1,
    "phase_q": 0,
    "drops": [],
    "desc": "洞窟裡淡紫灰色的霧泡泡，比外面的強一點。",
    "wake": "噗噗霧泡泡被光照暖了，小水滴變成水蒸氣，散掉了。"
  },
  fo_echo: {
    "name": "喂喂回音霧",
    "sprite": "mon_fo_echo",
    "level": 5,
    "hp": 610,
    "atk": 99,
    "exp": 270,
    "gold": 70,
    "subject": "國語",
    "q_levels": [
      2,
      3
    ],
    "boss": false,
    "final": false,
    "phases": 1,
    "phase_q": 0,
    "drops": [],
    "desc": "像對話泡泡的白霧團，會學你說話，守著回音謎門。",
    "wake": "喂喂回音霧安靜下來，輕輕說了聲謝謝。"
  },
  fo_frost: {
    "name": "霜霜冰霧靈",
    "sprite": "mon_fo_frost",
    "level": 5,
    "hp": 620,
    "atk": 99,
    "exp": 270,
    "gold": 70,
    "subject": "數學",
    "q_levels": [
      2,
      3
    ],
    "boss": false,
    "final": false,
    "phases": 1,
    "phase_q": 0,
    "drops": [],
    "desc": "包著透明冰晶的小霧團，一生氣地板就結冰。",
    "wake": "霜霜冰霧靈慢慢融化，變成一滴晶亮的水。"
  },
  fo_eraser: {
    "name": "掉掉橡皮擦",
    "sprite": "mon_fo_eraser",
    "level": 5,
    "hp": 620,
    "atk": 101,
    "exp": 270,
    "gold": 70,
    "subject": "英語",
    "q_levels": [
      2,
      3
    ],
    "boss": false,
    "final": false,
    "phases": 1,
    "phase_q": 0,
    "drops": [],
    "desc": "被弄丟的橡皮擦長出手腳，在書庫裡飄，很想被主人找到。",
    "wake": "掉掉橡皮擦想起主人了，高高興興地回家。"
  },
  fo_umbrella: {
    "name": "忘忘雨傘",
    "sprite": "mon_fo_umbrella",
    "level": 5,
    "hp": 620,
    "atk": 101,
    "exp": 280,
    "gold": 75,
    "subject": "自然",
    "q_levels": [
      2,
      3
    ],
    "boss": false,
    "final": false,
    "phases": 1,
    "phase_q": 0,
    "drops": [],
    "desc": "被忘在書庫的黃色摺疊傘，會突然撐開擋住攻擊，有點委屈。",
    "wake": "忘忘雨傘想起下雨天的約定，回到主人的書包。"
  },
  fob_shadow_bat: {
    "name": "霧影・噪音蝙蝠王",
    "sprite": "boss_fob_shadow_bat",
    "level": 5,
    "hp": 1750,
    "atk": 101,
    "exp": 810,
    "gold": 210,
    "subject": "國語",
    "q_levels": [
      2,
      4
    ],
    "boss": false,
    "final": false,
    "phases": 1,
    "phase_q": 0,
    "drops": [],
    "desc": "噪音蝙蝠王形狀的灰白霧影，眼睛發著藍光，守著國語燈。",
    "wake": "霧影散開了，國語燈亮了起來。",
    "elite": true,
    "trial": true,
    "dialog_before": "D_BOSS_SHADOW_A"
  },
  fob_shadow_octo: {
    "name": "霧影・迷霧章魚",
    "sprite": "boss_fob_shadow_octo",
    "level": 5,
    "hp": 1750,
    "atk": 101,
    "exp": 810,
    "gold": 210,
    "subject": "英語",
    "q_levels": [
      2,
      4
    ],
    "boss": false,
    "final": false,
    "phases": 1,
    "phase_q": 0,
    "drops": [],
    "desc": "迷霧章魚形狀的灰白霧影，眼睛發著藍光，守著英語燈。",
    "wake": "霧影散開了，英語燈亮了起來。",
    "elite": true,
    "trial": true,
    "dialog_before": "D_BOSS_SHADOW_A"
  },
  fob_shadow_frog: {
    "name": "霧影・泥巴大蛙",
    "sprite": "boss_fob_shadow_frog",
    "level": 5,
    "hp": 1750,
    "atk": 101,
    "exp": 810,
    "gold": 210,
    "subject": "數學",
    "q_levels": [
      2,
      4
    ],
    "boss": false,
    "final": false,
    "phases": 1,
    "phase_q": 0,
    "drops": [],
    "desc": "泥巴大蛙形狀的灰白霧影，眼睛發著藍光，守著數學燈。",
    "wake": "霧影散開了，數學燈亮了起來。",
    "elite": true,
    "trial": true,
    "dialog_before": "D_BOSS_SHADOW_A"
  },
  fob_shadow_tree: {
    "name": "霧影・枯萎樹王",
    "sprite": "boss_fob_shadow_tree",
    "level": 5,
    "hp": 1750,
    "atk": 101,
    "exp": 810,
    "gold": 210,
    "subject": "自然",
    "q_levels": [
      2,
      4
    ],
    "boss": false,
    "final": false,
    "phases": 1,
    "phase_q": 0,
    "drops": [],
    "desc": "枯萎樹王形狀的灰白霧影，眼睛發著藍光，守著自然燈。",
    "wake": "霧影散開了，自然燈亮了起來。",
    "elite": true,
    "trial": true,
    "dialog_before": "D_BOSS_SHADOW_A"
  },
  fob_shadow_golem: {
    "name": "霧影・暴躁石像",
    "sprite": "boss_fob_shadow_golem",
    "level": 5,
    "hp": 1750,
    "atk": 101,
    "exp": 810,
    "gold": 210,
    "subject": "社會",
    "q_levels": [
      2,
      4
    ],
    "boss": false,
    "final": false,
    "phases": 1,
    "phase_q": 0,
    "drops": [],
    "desc": "暴躁石像形狀的灰白霧影，眼睛發著藍光，守著社會燈。",
    "wake": "霧影散開了，社會燈亮了起來。",
    "elite": true,
    "trial": true,
    "dialog_before": "D_BOSS_SHADOW_A"
  },
  fob_mist: {
    "name": "山嵐霧精",
    "sprite": "boss_fob_mist",
    "level": 5,
    "hp": 2650,
    "atk": 88,
    "exp": 2600,
    "gold": 700,
    "subject": "混合",
    "q_levels": [
      2,
      4
    ],
    "boss": true,
    "final": false,
    "phases": 3,
    "phase_q": 2,
    "drops": [],
    "desc": "玉山步道的頭目。被霧王叫來擋路的大霧團，把步道鋪成一片白。",
    "wake": "山嵐霧精清醒了，霧慢慢散開，一陣涼風往山頂吹去。",
    "subjects": [
      "自然",
      "社會"
    ],
    "last_q_level": 4,
    "ref_mobs": [
      "fo_puff",
      "an_muntjac"
    ],
    "battle_bg": "alpine",
    "dialog_before": "D_BOSS_MIST_A",
    "dialog_after": "D_BOSS_MIST_B"
  },
  // ═══ v4.2 第 4a 批 MONSTERS END ═══
  // ═══ v4.2 第 4b 批 MONSTERS BEGIN（tools/v42_apply.js 每次整段重建）═══
  fob_king: {
    "name": "遺忘霧王‧佛格",
    "sprite": "boss_fob_king",
    "level": 5,
    "hp": 3590,
    "atk": 88,
    "exp": 2700,
    "gold": 700,
    "subject": "混合",
    "subjects": [
      "國語",
      "英語",
      "數學",
      "自然",
      "社會"
    ],
    "q_levels": [
      2,
      4
    ],
    "boss": true,
    "final": true,
    "phases": 4,
    "phase_q": 2,
    "last_q_level": 4,
    "untimed_phases": [
      3
    ],
    "phase_q_by": {
      "4": 1
    },
    "exact_phases": [
      4
    ],
    "drops": [],
    "desc": "最終頭目。像一本攤開的空白大書，怕自己被大家忘記的霧王。",
    "wake": "佛格想起被記得的感覺，化成一片溫暖的雲海。",
    "ref_mobs": [
      "fo_eraser",
      "fo_umbrella"
    ],
    "battle_bg": "summit",
    "dialog_before": "D_FOG_KING_MEET",
    "dialog_after": "D_FOG_KING_END",
    "phase_dialogs": {
      "2": "D_FOG_KING_P2",
      "3": "D_FOG_KING_P3",
      "4": "D_FOG_KING_P4"
    },
    "phase_sprites": {
      "2": "boss_fob_king_p2",
      "4": "boss_fob_king_p4"
    },
    "ending": "Q_END_1"
  },
  // ═══ v4.2 第 4b 批 MONSTERS END ═══
  // ═══ v4.2 第 4c 批 MONSTERS BEGIN（tools/v42_apply.js 每次整段重建）═══
  fo_puff_s1: {
    "name": "晨光噗噗霧泡泡",
    "sprite": "mon_fo_puff_s1",
    "level": 5,
    "hp": 840,
    "atk": 107,
    "exp": 465,
    "gold": 75,
    "subject": "自然",
    "q_levels": [
      3,
      4
    ],
    "boss": false,
    "final": false,
    "phases": 1,
    "phase_q": 0,
    "drops": [],
    "battle_bg": "cloudsea",
    "desc": "被晨光染成淡金橘色的噗噗霧泡泡，眼睛閃著金光。",
    "wake": "晨光噗噗霧泡泡被照暖了，小水滴變成水蒸氣散掉，露出一道晨光。"
  },
  fo_echo_s1: {
    "name": "晨光喂喂回音霧",
    "sprite": "mon_fo_echo_s1",
    "level": 5,
    "hp": 860,
    "atk": 110,
    "exp": 480,
    "gold": 80,
    "subject": "國語",
    "q_levels": [
      3,
      4
    ],
    "boss": false,
    "final": false,
    "phases": 1,
    "phase_q": 0,
    "drops": [],
    "battle_bg": "cloudsea",
    "desc": "淡金橘色的回音霧，學你說話學得更快了。",
    "wake": "晨光喂喂回音霧安靜下來，霧散開了，露出一道晨光。"
  },
  fo_frost_s1: {
    "name": "晨光霜霜冰霧靈",
    "sprite": "mon_fo_frost_s1",
    "level": 5,
    "hp": 880,
    "atk": 113,
    "exp": 495,
    "gold": 80,
    "subject": "數學",
    "q_levels": [
      3,
      4
    ],
    "boss": false,
    "final": false,
    "phases": 1,
    "phase_q": 0,
    "drops": [],
    "battle_bg": "cloudsea",
    "desc": "淡金橘色的冰霧靈，冰晶在晨光裡一閃一閃。",
    "wake": "晨光霜霜冰霧靈慢慢融化，變成一滴水，映著一道晨光。"
  },
  fo_eraser_s1: {
    "name": "晨光掉掉橡皮擦",
    "sprite": "mon_fo_eraser_s1",
    "level": 5,
    "hp": 900,
    "atk": 116,
    "exp": 525,
    "gold": 85,
    "subject": "英語",
    "q_levels": [
      3,
      4
    ],
    "boss": false,
    "final": false,
    "phases": 1,
    "phase_q": 0,
    "drops": [],
    "battle_bg": "cloudsea",
    "desc": "淡金橘色的橡皮擦，在雲階上跑來跑去找主人。",
    "wake": "晨光掉掉橡皮擦想起主人了，化成一道晨光飛回家。"
  },
  fo_umbrella_s1: {
    "name": "晨光忘忘雨傘",
    "sprite": "mon_fo_umbrella_s1",
    "level": 5,
    "hp": 920,
    "atk": 118,
    "exp": 540,
    "gold": 85,
    "subject": "自然",
    "q_levels": [
      3,
      4
    ],
    "boss": false,
    "final": false,
    "phases": 1,
    "phase_q": 0,
    "drops": [],
    "battle_bg": "cloudsea",
    "desc": "淡金橘色的摺疊傘，在雲階上撐開又收起。",
    "wake": "晨光忘忘雨傘想起下雨天的約定，化成一道晨光。"
  },
  wxb_raincloud_s2: {
    "name": "星光黏黏雨雲王",
    "sprite": "boss_wxb_raincloud_s2",
    "level": 5,
    "hp": 2710,
    "atk": 122,
    "exp": 1935,
    "gold": 285,
    "subject": "自然",
    "q_levels": [
      3,
      4
    ],
    "boss": false,
    "final": false,
    "phases": 1,
    "phase_q": 0,
    "drops": [],
    "elite": true,
    "battle_bg": "cloudsea",
    "desc": "深藍色、閃著銀色星點的大雨雲，黏在雲庭不肯走。",
    "wake": "星光黏黏雨雲王清醒了，下完最後一陣小雨，露出滿天星光。"
  },
  mb_train_s2: {
    "name": "星光迷路火車頭",
    "sprite": "boss_mb_train_s2",
    "level": 5,
    "hp": 2830,
    "atk": 128,
    "exp": 2070,
    "gold": 285,
    "subject": "混合",
    "subjects": [
      "社會",
      "數學"
    ],
    "q_levels": [
      3,
      4
    ],
    "boss": false,
    "final": false,
    "phases": 1,
    "phase_q": 0,
    "drops": [],
    "elite": true,
    "battle_bg": "cloudsea",
    "desc": "深藍色、閃著銀色星點的老火車頭，在雲上衝來衝去。",
    "wake": "星光迷路火車頭清醒了，嘟嘟兩聲，化成一道星光開走了。"
  },
  fob_balloon_s2: {
    "name": "星光霧氣球大王",
    "sprite": "boss_fob_balloon_s2",
    "level": 5,
    "hp": 2960,
    "atk": 133,
    "exp": 2205,
    "gold": 300,
    "subject": "混合",
    "subjects": [
      "自然",
      "數學"
    ],
    "q_levels": [
      3,
      4
    ],
    "boss": false,
    "final": false,
    "phases": 1,
    "phase_q": 0,
    "drops": [],
    "elite": true,
    "battle_bg": "cloudsea",
    "desc": "深藍色、閃著銀色星點的霧氣球，飄在雲庭最高的地方。",
    "wake": "星光霧氣球大王清醒了，霧全部散掉，露出一片星光。"
  },
  ghb_civetboss_s2: {
    "name": "星光夜遊團長",
    "sprite": "boss_ghb_civetboss_s2",
    "level": 5,
    "hp": 3080,
    "atk": 139,
    "exp": 2295,
    "gold": 300,
    "subject": "混合",
    "subjects": [
      "國語",
      "自然"
    ],
    "q_levels": [
      3,
      4
    ],
    "boss": false,
    "final": false,
    "phases": 1,
    "phase_q": 0,
    "drops": [],
    "elite": true,
    "battle_bg": "cloudsea",
    "desc": "深藍色、閃著銀色星點的夜遊團長，把星星當燈籠藏起來。",
    "wake": "星光夜遊團長清醒了，把星星一顆顆掛回天上，化成一道星光。"
  },
  mnb_goldjaw_s2: {
    "name": "星光金脈鐵顎王",
    "sprite": "boss_mnb_goldjaw_s2",
    "level": 5,
    "hp": 3200,
    "atk": 145,
    "exp": 2340,
    "gold": 300,
    "subject": "混合",
    "subjects": [
      "數學",
      "自然"
    ],
    "q_levels": [
      3,
      4
    ],
    "boss": false,
    "final": false,
    "phases": 1,
    "phase_q": 0,
    "drops": [],
    "elite": true,
    "battle_bg": "cloudsea",
    "desc": "深藍色、閃著銀色星點的鐵顎巨獸，胸口的金光變成了銀光。",
    "wake": "星光金脈鐵顎王清醒了，胸口的光變得暖暖的，化成一道星光。"
  },
  pib_ship_s2: {
    "name": "星光霧帆號",
    "sprite": "boss_pib_ship_s2",
    "level": 5,
    "hp": 3330,
    "atk": 151,
    "exp": 2430,
    "gold": 315,
    "subject": "混合",
    "subjects": [
      "英語",
      "自然",
      "社會"
    ],
    "q_levels": [
      3,
      4
    ],
    "boss": false,
    "final": false,
    "phases": 1,
    "phase_q": 0,
    "drops": [],
    "elite": true,
    "battle_bg": "cloudsea",
    "desc": "深藍色、閃著銀色星點的霧帆號，在雲海上開來開去。",
    "wake": "星光霧帆號清醒了，霧做的帆變成白雲，露出一道星光。"
  },
  mb_floodgate_s3: {
    "name": "曙光霧閘機將",
    "sprite": "boss_mb_floodgate_s3",
    "level": 5,
    "hp": 6060,
    "atk": 176,
    "exp": 8850,
    "gold": 1100,
    "subject": "混合",
    "subjects": [
      "自然",
      "數學"
    ],
    "q_levels": [
      3,
      4
    ],
    "boss": true,
    "final": false,
    "phases": 3,
    "phase_q": 2,
    "drops": [],
    "last_q_level": 4,
    "dialog_before": "D_POST_BOSS_A",
    "dialog_after": "D_POST_BOSS_B",
    "ref_mobs": [
      "fo_puff_s1",
      "fo_echo_s1",
      "fo_frost_s1",
      "fo_eraser_s1",
      "fo_umbrella_s1",
      "wxb_raincloud_s2",
      "mb_train_s2",
      "fob_balloon_s2",
      "ghb_civetboss_s2",
      "mnb_goldjaw_s2",
      "pib_ship_s2"
    ],
    "battle_bg": "cloudsea",
    "desc": "白金色、閃著金色光暈的霧閘機將，守著曙光源頭的水門。",
    "wake": "曙光霧閘機將清醒了，水門打開，化成一道曙光。"
  },
  mb_lantern_s3: {
    "name": "曙光燈籠霧將",
    "sprite": "boss_mb_lantern_s3",
    "level": 5,
    "hp": 6450,
    "atk": 188,
    "exp": 9300,
    "gold": 1150,
    "subject": "混合",
    "subjects": [
      "國語",
      "自然"
    ],
    "q_levels": [
      3,
      4
    ],
    "boss": true,
    "final": false,
    "phases": 3,
    "phase_q": 2,
    "drops": [],
    "last_q_level": 4,
    "dialog_before": "D_POST_BOSS_A",
    "dialog_after": "D_POST_BOSS_B",
    "ref_mobs": [
      "fo_puff_s1",
      "fo_echo_s1",
      "fo_frost_s1",
      "fo_eraser_s1",
      "fo_umbrella_s1",
      "wxb_raincloud_s2",
      "mb_train_s2",
      "fob_balloon_s2",
      "ghb_civetboss_s2",
      "mnb_goldjaw_s2",
      "pib_ship_s2"
    ],
    "battle_bg": "cloudsea",
    "desc": "白金色、閃著金色光暈的大燈籠，裡面的霧轉得好快。",
    "wake": "曙光燈籠霧將清醒了，燈籠裡的霧散開，亮起一道曙光。"
  },
  fog_demon_s3: {
    "name": "曙光遺忘霧魔",
    "sprite": "boss_fog_demon_s3",
    "level": 5,
    "hp": 6840,
    "atk": 200,
    "exp": 9900,
    "gold": 1150,
    "subject": "混合",
    "subjects": [
      "國語",
      "英語",
      "數學",
      "自然"
    ],
    "q_levels": [
      3,
      4
    ],
    "boss": true,
    "final": false,
    "phases": 3,
    "phase_q": 2,
    "drops": [],
    "last_q_level": 4,
    "dialog_before": "D_POST_BOSS_A",
    "dialog_after": "D_POST_BOSS_B",
    "ref_mobs": [
      "fo_puff_s1",
      "fo_echo_s1",
      "fo_frost_s1",
      "fo_eraser_s1",
      "fo_umbrella_s1",
      "wxb_raincloud_s2",
      "mb_train_s2",
      "fob_balloon_s2",
      "ghb_civetboss_s2",
      "mnb_goldjaw_s2",
      "pib_ship_s2"
    ],
    "battle_bg": "cloudsea",
    "desc": "白金色、閃著金色光暈的大霧，是曙光源頭最濃的霧。",
    "wake": "曙光遺忘霧魔被照暖了，大霧慢慢散開，露出一道曙光。"
  },
  wxb_whale_s3: {
    "name": "曙光雲鯨霧將",
    "sprite": "boss_wxb_whale_s3",
    "level": 5,
    "hp": 7230,
    "atk": 212,
    "exp": 10500,
    "gold": 1200,
    "subject": "混合",
    "subjects": [
      "自然",
      "英語"
    ],
    "q_levels": [
      3,
      4
    ],
    "boss": true,
    "final": false,
    "phases": 3,
    "phase_q": 2,
    "drops": [],
    "last_q_level": 4,
    "dialog_before": "D_POST_BOSS_A",
    "dialog_after": "D_POST_BOSS_B",
    "ref_mobs": [
      "fo_puff_s1",
      "fo_echo_s1",
      "fo_frost_s1",
      "fo_eraser_s1",
      "fo_umbrella_s1",
      "wxb_raincloud_s2",
      "mb_train_s2",
      "fob_balloon_s2",
      "ghb_civetboss_s2",
      "mnb_goldjaw_s2",
      "pib_ship_s2"
    ],
    "battle_bg": "cloudsea",
    "desc": "白金色、閃著金色光暈的雲鯨，在曙光源頭慢慢游。",
    "wake": "曙光雲鯨霧將清醒了，變成一朵大白雲，迎著一道曙光游走。"
  },
  // ═══ v4.2 第 4c 批 MONSTERS END ═══
};
