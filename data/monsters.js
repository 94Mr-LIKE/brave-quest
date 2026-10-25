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

  // ── 地圖等級 1（M02 擎天草原）──
  dango: {
    name: "迷糊團子", sprite: "mon_dango", level: 1, hp: 25, atk: 6, subject: "數學", q_levels: [1, 1],
    exp: 30, gold: 3, drops: [{ item: "sticky_ball", rate: 0.5 }], boss: false,
    desc: "軟軟黏黏的小團子，被霧弄得數不清自己有幾顆。",
    wake: "迷糊團子清醒了，咕嚕咕嚕滾回草叢裡。"
  },
  rabbit: {
    name: "跳跳兔", sprite: "mon_rabbit", level: 1, hp: 30, atk: 7, subject: "國語", q_levels: [1, 1],
    exp: 40, gold: 5, drops: [{ item: "herb", rate: 0.3 }], boss: false,
    desc: "跳得很高的兔子，被霧弄得忘了回家的路。",
    wake: "跳跳兔清醒了，一蹦一跳地回家了。"
  },

  // ── 地圖等級 2（M03 硫磺谷、M04 神木森林、M09 山城市集；港口螃蟹住在 M06 海邊岩岸）──
  mushroom: {
    name: "毒菇怪", sprite: "mon_mushroom", level: 2, hp: 55, atk: 8, subject: "自然", q_levels: [1, 2],
    exp: 50, gold: 6, drops: [{ item: "mushroom_cap", rate: 0.5 }], boss: false,
    desc: "頭上戴著大菇帽。霧讓牠忘了自己要曬太陽還是躲陰涼。",
    wake: "毒菇怪清醒了，摘下菇帽向你敬禮，跑回樹下。"
  },
  sprout: {
    name: "樹精寶寶", sprite: "mon_sprout", level: 2, hp: 120, atk: 10, subject: "自然", q_levels: [1, 2],
    exp: 65, gold: 9, drops: [{ item: "herb", rate: 0.4 }], boss: false,
    desc: "剛發芽的小樹精，被霧弄得忘了要喝水。",
    wake: "樹精寶寶清醒了，開心地去找水喝。"
  },
  owl: {
    name: "貓頭鷹", sprite: "mon_owl", level: 2, hp: 125, atk: 11, subject: "國語", q_levels: [1, 2],
    exp: 75, gold: 10, drops: [{ item: "feather", rate: 0.3 }], boss: false,
    desc: "森林裡最愛讀書的鳥，霧讓牠把字都看反了。",
    wake: "貓頭鷹清醒了，咕咕叫著飛回樹洞。"
  },
  crab: {
    name: "港口螃蟹", sprite: "mon_crab", level: 2, hp: 50, atk: 11, subject: "英語", q_levels: [1, 2],
    exp: 35, gold: 8, drops: [{ item: "snack", rate: 0.3 }], boss: false,
    desc: "住在海邊岩岸的螃蟹，霧讓牠聽不懂外國船員的話。",
    wake: "港口螃蟹清醒了，橫著走回沙灘。"
  },
  seagull: {
    name: "搶食海鷗", sprite: "mon_seagull", level: 2, hp: 135, atk: 14, subject: "英語", q_levels: [1, 2],
    exp: 80, gold: 11, drops: [{ item: "feather", rate: 0.5 }], boss: false,
    desc: "被霧弄得到處亂搶東西的海鷗。",
    wake: "搶食海鷗清醒了，把東西還給你，飛回海上。"
  },

  // ── 地圖等級 3（M05 紅樹林濕地）；v1.1 起洞窟蝙蝠、石頭怪、頑皮哥布林（M06 海蝕洞窟、M07 哥布林部落）改成第二區、level 2 ──
  mudslime: {
    name: "泥泥怪", sprite: "mon_mudslime", level: 4, hp: 190, atk: 29, subject: "數學", q_levels: [2, 3],
    exp: 80, gold: 20, drops: [{ item: "gear", rate: 0.5 }], boss: false,
    legacy: { level: 3, hp: 200, atk: 16, exp: 95, gold: 14 },   // v1.3（62 號 3.3、5.4）紅樹林搬到台北章重算；legacy＝v1.2 數值（舊紅樹林旗標用）
    desc: "濕地泥灘上的泥巴團，迷糊時會把亮亮的齒輪吞進肚子。",
    wake: "泥泥怪清醒了，吐出齒輪，慢慢滑回泥灘裡。"
  },
  frog: {
    name: "沼澤蛙", sprite: "mon_frog", level: 3, hp: 210, atk: 17, subject: "自然", q_levels: [2, 3],
    exp: 110, gold: 16, drops: [{ item: "gear", rate: 0.3 }], boss: false,
    desc: "呱呱叫的大青蛙，霧讓牠忘了天氣會怎麼變。",
    wake: "沼澤蛙清醒了，撲通一聲跳回河道裡。"
  },
  // 2026-10-10 老闆 B13「紅樹林適合用招潮蟹當野怪」：取代 M05 的沼澤蛙出沒區（泥泥怪保留，委託 Q_GNO_3 要收集牠的齒輪）。
  // 數值照 37 號「數值請用紅樹林那一列」＝與沼澤蛙同一列；之後套用 37 號修改表時，請和 frog 一起改（210／17／110／16）。
  // 【美術需求｜佔位】還沒有招潮蟹的圖，先借用港口螃蟹的圖 mon_crab；招潮蟹圖完成後把 sprite 改成新圖的 id。
  fiddler_crab: {
    name: "招潮蟹", sprite: "mon_fiddler_crab", level: 4, hp: 190, atk: 29, subject: "自然", q_levels: [2, 3],
    exp: 80, gold: 20, drops: [{ item: "gear", rate: 0.3 }], boss: false,
    legacy: { level: 3, hp: 210, atk: 17, exp: 110, gold: 16 },   // v1.3（62 號 3.3、5.4）
    desc: "紅樹林泥灘上揮著一隻大螯的小螃蟹，霧讓牠忘了潮水什麼時候會來。",
    wake: "招潮蟹清醒了，揮揮大螯，鑽回泥灘的小洞裡。"
  },
  bat: {
    name: "洞窟蝙蝠", sprite: "mon_bat", level: 2, hp: 55, atk: 14, subject: "國語", q_levels: [1, 2],
    exp: 45, gold: 10, drops: [{ item: "bat_wing", rate: 0.4 }], boss: false,
    desc: "倒掛在洞頂睡覺的蝙蝠，被霧吵醒後脾氣不太好。",
    wake: "洞窟蝙蝠清醒了，飛回洞頂繼續睡覺。"
  },
  rock: {
    name: "石頭怪", sprite: "mon_rock", level: 2, hp: 55, atk: 13, subject: "數學", q_levels: [1, 2],
    exp: 40, gold: 9, drops: [{ item: "crystal", rate: 0.4 }], boss: false,
    desc: "會走路的石頭，身上常常黏著亮晶晶的水晶。",
    wake: "石頭怪清醒了，滾到角落安靜地休息。"
  },
  goblin: {
    name: "頑皮哥布林", sprite: "mon_goblin", level: 2, hp: 60, atk: 14, subject: "國語", q_levels: [1, 2],
    exp: 45, gold: 10, drops: [{ item: "scroll", rate: 0.5 }], boss: false,
    desc: "被霧弄迷糊的哥布林，把部落的告示撕下來當玩具。",
    wake: "頑皮哥布林清醒了，不好意思地跑回部落。"
  },

  // ── v1.1 第一章新怪（59 號 3.2 節）：基隆港（M47）滴滴雨精；九份東側（M09）、金瓜石（M48）礦坑系 ──
  // level＝圖鑑顯示的地圖等級；掉落只新增 umbrella（迷路的小雨傘），其他借既有道具、不用齒輪（Q_GNO_3 的打獵目標）
  wx_rain: {
    name: "滴滴雨精", sprite: "mon_wx_rain", level: 2, hp: 70, atk: 16, subject: "自然", q_levels: [1, 2],
    exp: 50, gold: 11, drops: [{ item: "umbrella", rate: 0.5 }], boss: false,
    desc: "一顆會走路的大雨滴，撐著葉子當傘。霧讓牠忘了雨要下在哪裡。",
    wake: "滴滴雨精清醒了，變成小雨滴回到雲裡。"
  },
  mn_cart: {
    name: "鏽輪礦車獸", sprite: "mon_mn_cart", level: 3, hp: 90, atk: 16, subject: "數學", q_levels: [1, 2],
    exp: 45, gold: 11, drops: [{ item: "herb", rate: 0.3 }], boss: false,
    desc: "生鏽的小礦車，被霧弄得到處亂衝。",
    wake: "鏽輪礦車獸清醒了，喀啦喀啦開回軌道上停好。"
  },
  mn_ore: {
    name: "金脈岩甲獸", sprite: "mon_mn_ore", level: 3, hp: 90, atk: 16, subject: "自然", q_levels: [1, 2],
    exp: 50, gold: 12, drops: [{ item: "crystal", rate: 0.4 }], boss: false,
    desc: "背上長著礦石的岩石野獸，霧讓牠以為大家都要搶牠的石頭。",
    wake: "金脈岩甲獸清醒了，縮起來變回一顆安靜的大石頭。"
  },
  // 戰鬥畫面變暗一回合＝純演出，不影響答題時間
  mn_dust: {
    name: "礦塵旋風", sprite: "mon_mn_dust", level: 3, hp: 90, atk: 16, subject: "自然", q_levels: [1, 2],
    exp: 50, gold: 12, drops: [{ item: "herb", rate: 0.3 }], boss: false,
    desc: "捲著碎石的小旋風，霧讓牠停不下來。",
    wake: "礦塵旋風清醒了，慢慢散成一陣微風。"
  },
  mn_lamp: {
    name: "坑道螢燈", sprite: "mon_mn_lamp", level: 3, hp: 95, atk: 17, subject: "自然", q_levels: [1, 2],
    exp: 50, gold: 12, drops: [{ item: "crystal", rate: 0.3 }], boss: false,
    desc: "一盞飄在空中的舊頭燈，霧讓它一下亮一下暗。",
    wake: "坑道螢燈清醒了，穩穩地亮著，飄回坑道的掛鉤上。"
  },
  mn_drill: {
    name: "鑿岩穿山獸", sprite: "mon_mn_drill", level: 3, hp: 95, atk: 17, subject: "數學", q_levels: [1, 2],
    exp: 50, gold: 12, drops: [{ item: "crystal", rate: 0.3 }], boss: false,
    desc: "尾巴像鑽頭的穿山獸，被霧弄得到處鑽洞。",
    wake: "鑿岩穿山獸清醒了，鑽回自己的小洞睡覺。"
  },
  mn_timber: {
    name: "坑木百足", sprite: "mon_mn_timber", level: 3, hp: 95, atk: 18, subject: "國語", q_levels: [1, 2],
    exp: 60, gold: 14, drops: [{ item: "herb", rate: 0.4 }], boss: false,
    desc: "舊坑木變成的長長蟲，霧讓牠忘了要撐住坑道。",
    wake: "坑木百足清醒了，乖乖地趴回坑道邊。"
  },

  // ── 地圖等級 4（M08 月世界泥岩丘、M10 府城古城、M11 古城塔頂）──
  boar: {
    name: "岩丘野豬", sprite: "mon_boar", level: 4, hp: 320, atk: 20, subject: "社會", q_levels: [3, 4],
    exp: 165, gold: 25, drops: [{ item: "key", rate: 0.4 }], boss: false,
    desc: "在泥岩溝谷裡亂跑的野豬，迷糊時把柵欄鑰匙叼走了。",
    wake: "岩丘野豬清醒了，放下鑰匙，跑回溝谷。"
  },
  wisp: {
    name: "迷霧精", sprite: "mon_wisp", level: 4, hp: 340, atk: 21, subject: "英語", q_levels: [3, 4],
    exp: 180, gold: 30, drops: [{ item: "crystal", rate: 0.3 }], boss: false,
    desc: "一小團會飄的霧。被光照到就會變回小水滴。",
    wake: "迷霧精被光照亮，變成小水滴飄走了。"
  },
  armor: {
    name: "空盔甲", sprite: "mon_armor", level: 4, hp: 360, atk: 22, subject: "社會", q_levels: [3, 4],
    exp: 210, gold: 35, drops: [{ item: "gear", rate: 0.3 }], boss: false,
    desc: "古城的舊盔甲，被霧吹得自己走來走去。",
    wake: "空盔甲清醒了，喀啦喀啦走回展示台站好。"
  },

  // ───────────────────────────── 頭目 ─────────────────────────────
  tree_king: {
    name: "枯萎樹王", sprite: "boss_tree", level: 2, hp: 510, atk: 13, subject: "自然", q_levels: [2, 4],
    exp: 660, gold: 60, drops: [{ item: "herb", rate: 1 }], boss: true,
    phases: 3, phase_q: 2, last_q_level: 4, ref_mobs: ["mushroom", "sprout", "owl"],
    dialog_before: "D_BOSS_TREE_A", dialog_after: "D_BOSS_TREE_B",
    desc: "守護神木森林的千年神木，被霧附身後忘了怎麼長葉子。",
    wake: "神木清醒了，枝頭冒出新的綠芽。"
  },
  fog_octopus: {
    name: "迷霧章魚", sprite: "boss_octopus", level: 2, hp: 540, atk: 16, subject: "英語", q_levels: [2, 4],
    exp: 410, gold: 100, drops: [{ item: "snack", rate: 1 }], boss: true,
    phases: 3, phase_q: 2, last_q_level: 4, ref_mobs: ["crab", "seagull"],
    dialog_before: "D_BOSS_OCTO_A", dialog_after: "D_BOSS_OCTO_B",
    battle_bg: "harbor",   // v1.1 試玩建議 S2：章魚在磺火漁港木橋盡頭，戰鬥背景用漁港（M01 地圖的 battle_bg 是 grass）
    desc: "從遠海漂來的大章魚，擋在漁港碼頭。只聽得懂英文，一直打瞌睡。",
    wake: "迷霧章魚清醒了，揮揮觸手游回大海。"
  },
  mud_frog: {
    name: "泥巴大蛙", sprite: "boss_frog", level: 4, hp: 860, atk: 27, subject: "數學", q_levels: [2, 4],
    exp: 470, gold: 150, drops: [{ item: "gear", rate: 1 }], boss: true,
    legacy: { level: 3, hp: 750, atk: 16, exp: 1010, gold: 100 },   // v1.3（62 號 3.3、5.4）建議 PL 17／轉職 Lv14
    phases: 3, phase_q: 2, last_q_level: 4, ref_mobs: ["mudslime", "frog"],
    dialog_before: "D_BOSS_FROG_A", dialog_after: "D_BOSS_FROG_B",
    desc: "紅樹林濕地最大的青蛙，霧讓牠數字全亂掉，一直亂丟泥巴。",
    wake: "泥巴大蛙清醒了，呱呱笑著跳回池塘。"
  },
  noise_bat: {
    name: "噪音蝙蝠王", sprite: "boss_bat", level: 2, hp: 310, atk: 14, subject: "國語", q_levels: [1, 3],
    exp: 300, gold: 100, drops: [{ item: "bat_wing", rate: 1 }], boss: true,
    phases: 3, phase_q: 2, last_q_level: 4, ref_mobs: ["bat", "rock", "goblin"],
    dialog_before: "D_BOSS_BAT_A", dialog_after: "D_BOSS_BAT_B",
    desc: "蝙蝠們的老大，霧讓牠的叫聲變得好吵，大家都看不下書。",
    wake: "噪音蝙蝠王清醒了，安安靜靜地倒掛著睡著了。"
  },
  angry_golem: {
    name: "暴躁石像", sprite: "boss_golem", level: 4, hp: 1200, atk: 21, subject: "社會", q_levels: [3, 4],
    exp: 1570, gold: 150, drops: [{ item: "crystal", rate: 1 }], boss: true,
    phases: 3, phase_q: 2, last_q_level: 4, ref_mobs: ["boar", "wisp"],
    dialog_before: "D_BOSS_GOLEM_A", dialog_after: "D_BOSS_GOLEM_B",
    desc: "守護月世界的石像，被霧弄得忘了大家一起訂的規則。",
    wake: "暴躁石像清醒了，慢慢坐下來守護泥岩丘。"
  },
  fog_demon: {
    name: "遺忘霧魔", sprite: "boss_fog", level: 5, hp: 1510, atk: 24, subject: "混合",
    subjects: ["國語", "英語", "數學", "自然", "社會"], q_levels: [3, 4],
    exp: 1730, gold: 300, drops: [], boss: true,
    phases: 3, phase_q: 2, last_q_level: 4, ref_mobs: ["armor", "wisp"],
    dialog_before: "D_BOSS_FOG_A", dialog_after: "D_BOSS_FOG_B",
    desc: "讓大家忘記知識的大霧。五道光一起照它，它就會散開。",
    wake: "遺忘霧魔被五道光照亮，變成溫暖的晨光散開了。"
  },
  // v1.1 第一章支線頭目（59 號 3.2 節）：金瓜石坑道最深處，只在 Q_JGS_3 進行中出現；建議 Lv10
  mnb_goldjaw: {
    name: "金脈鐵顎王", sprite: "boss_mnb_goldjaw", level: 3, hp: 540, atk: 16, subject: "混合",
    subjects: ["數學", "自然"], q_levels: [2, 4],
    exp: 350, gold: 150, drops: [{ item: "crystal", rate: 1 }], boss: true,
    phases: 3, phase_q: 2, last_q_level: 4, ref_mobs: ["mn_cart", "mn_ore", "mn_drill"],
    dialog_before: "D_BOSS_GOLDJAW_A", dialog_after: "D_BOSS_GOLDJAW_B",
    desc: "由齒輪、鋼索和大岩石組成的礦山巨獸。霧讓它以為整座山的金子都要被搶走。",
    wake: "金脈鐵顎王清醒了，胸口的金光變得暖暖的，慢慢沉回坑道深處。"
  },

  // ── v1.2 第二章新怪（61 號 3.2 節）：草嶺古道（M49）與宜蘭（M14、M50、M51）的「蘭陽系」小怪、頭目黏黏雨雲王（M51 堤防盡頭）──
  // 數值：現行經濟、37 號公式，參考主角＝轉職後的代表職業（61 號 3.1）；小怪出題 2–3 星、頭目 2–4 星。礦塵旋風（mn_dust）數值不改，草嶺古道入口也出現
  ly_tigerwind: {
    name: "虎紋霧獸", sprite: "mon_ly_tigerwind", level: 3, hp: 145, atk: 21, subject: "國語", q_levels: [2, 3],
    exp: 45, gold: 11, drops: [{ item: "herb", rate: 0.3 }], boss: false,
    desc: "草嶺的霧聚成的小獸，霧讓牠忘了要讓路給走古道的人。",
    wake: "虎紋霧獸清醒了，化成一陣風吹過山坡。"
  },
  ly_kumquat: {
    name: "金棗彈彈", sprite: "mon_ly_kumquat", level: 3, hp: 150, atk: 23, subject: "數學", q_levels: [2, 3],
    exp: 50, gold: 12, drops: [{ item: "kumquat", rate: 0.5 }], boss: false,
    desc: "被霧弄迷糊的金棗，一直跳來跳去不肯回到樹上。",
    wake: "金棗彈彈清醒了，咚的一聲跳回金棗樹。"
  },
  ly_scallion: {
    name: "蔥稈草甲獸", sprite: "mon_ly_scallion", level: 3, hp: 160, atk: 24, subject: "自然", q_levels: [2, 3],
    exp: 60, gold: 14, drops: [{ item: "herb", rate: 0.4 }], boss: false,
    desc: "穿著稻草盔甲的蔥田小獸，霧讓牠以為大家都要來拔蔥。",
    wake: "蔥稈草甲獸清醒了，乖乖躺回田裡曬稻草。"
  },
  ly_bubble: {
    name: "冷泉氣泡精", sprite: "mon_ly_bubble", level: 3, hp: 165, atk: 25, subject: "自然", q_levels: [2, 3],
    exp: 60, gold: 14, drops: [{ item: "crystal", rate: 0.3 }], boss: false,
    desc: "冷泉裡冒出來的小水精，霧讓牠一直冒泡停不下來。",
    wake: "冷泉氣泡精清醒了，咕嚕咕嚕回到冷泉池。"
  },
  ly_mackerel: {
    name: "鯖鯖跳刀魚", sprite: "mon_ly_mackerel", level: 3, hp: 170, atk: 26, subject: "英語", q_levels: [2, 3],
    exp: 60, gold: 14, drops: [{ item: "snack", rate: 0.4 }], boss: false,
    desc: "漁港邊跳上岸的大魚，霧讓牠忘了回海裡的路。",
    wake: "鯖鯖跳刀魚清醒了，撲通一聲游回大海。"
  },
  // v1.2 第二章章末頭目（61 號 3.2 節）：南方澳漁港堤防盡頭，只在 Q_YL_5 進行中出現；建議轉職 Lv11 以上（PL 14）。掉落雨後彩虹片（紀念品）
  wxb_raincloud: {
    name: "黏黏雨雲王", sprite: "boss_wxb_raincloud", level: 3, hp: 760, atk: 23, subject: "自然", q_levels: [2, 4],
    exp: 400, gold: 150, drops: [{ item: "rainbow_piece", rate: 1 }], boss: true,
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
    exp: 60, gold: 16, drops: [{ item: "herb", rate: 0.3 }], boss: false,
    desc: "嫩綠色的螳螂，前腳像兩片鋸齒茶葉，被霧弄得亂揮亂舞。",
    wake: "茶芽螳螂清醒了，收起茶葉前腳，躲回茶樹叢裡。"
  },
  tea_moth: {
    name: "霧茶夜蛾", sprite: "mon_tea_moth", level: 4, hp: 175, atk: 26, subject: "自然", q_levels: [2, 3],
    exp: 60, gold: 16, drops: [{ item: "crystal", rate: 0.3 }], boss: false,
    desc: "翅膀像捲起來的乾茶葉的大蛾，一拍翅膀就灑出霧粉。",
    wake: "霧茶夜蛾清醒了，輕輕飛回山坡的茶園。"
  },
  tea_basket: {
    name: "焙籠火狸", sprite: "mon_tea_basket", level: 4, hp: 180, atk: 28, subject: "社會", q_levels: [2, 3],
    exp: 70, gold: 18, drops: [{ item: "tea_leaf", rate: 0.5 }], boss: false,
    desc: "背著烘茶竹籠的狸，眼睛像炭火，被霧弄得搶走茶葉。",
    wake: "焙籠火狸清醒了，把茶葉還給你，跑回茶園。"
  },
  an_magpie: {
    name: "藍尾鵲鵲", sprite: "mon_an_magpie", level: 4, hp: 180, atk: 28, subject: "英語", q_levels: [2, 3],
    exp: 70, gold: 18, drops: [{ item: "feather", rate: 0.3 }], boss: false,
    desc: "寶藍色身體、長長藍尾巴的圓滾滾小鳥，霧讓牠一直搶先啄人。",
    wake: "藍尾鵲鵲清醒了，拖著長尾巴飛回樹梢。"
  },
  mc_gondola: {
    name: "搖搖纜車廂", sprite: "mon_mc_gondola", level: 4, hp: 185, atk: 28, subject: "自然", q_levels: [2, 3],
    exp: 70, gold: 18, drops: [{ item: "crystal", rate: 0.3 }], boss: false,
    desc: "貓空的淡綠色小纜車廂，霧讓它在空中搖來搖去停不下來。",
    wake: "搖搖纜車廂清醒了，穩穩地回到纜線上。"
  },
  mc_alarm: {
    name: "鈴鈴鬧鐘兵", sprite: "mon_mc_alarm", level: 4, hp: 185, atk: 28, subject: "數學", q_levels: [2, 3],
    exp: 70, gold: 18, drops: [{ item: "ticket", rate: 0.5 }], boss: false,
    desc: "紅色的雙鈴鬧鐘，霧讓它亂響，還叼走了纜車票。",
    wake: "鈴鈴鬧鐘兵清醒了，把時間調回正確的時刻。"
  },
  mc_roaster: {
    name: "炒炒烘茶機", sprite: "mon_mc_roaster", level: 4, hp: 190, atk: 29, subject: "自然", q_levels: [2, 3],
    exp: 80, gold: 20, drops: [{ item: "tea_leaf", rate: 0.3 }], boss: false,
    desc: "圓肚子的銅色烘茶機，頭頂一直冒白煙，眼睛很睏。",
    wake: "炒炒烘茶機清醒了，茶香飄滿整座山。"
  },
  mc_signal: {
    name: "閃閃紅綠燈", sprite: "mon_mc_signal", level: 4, hp: 185, atk: 28, subject: "社會", q_levels: [2, 3],
    exp: 70, gold: 18, drops: [{ item: "herb", rate: 0.3 }], boss: false,
    desc: "圓滾滾的小紅綠燈，霧讓它的燈號亂閃。",
    wake: "閃閃紅綠燈清醒了，紅黃綠又照順序亮起來。過馬路要看燈號喔！"
  },
  mc_vending: {
    name: "咚咚販賣機", sprite: "mon_mc_vending", level: 4, hp: 190, atk: 29, subject: "英語", q_levels: [2, 3],
    exp: 80, gold: 20, drops: [{ item: "snack", rate: 0.4 }], boss: false,
    desc: "淡藍色的販賣機，霧讓它一直咚咚地丟出飲料。",
    wake: "咚咚販賣機清醒了，乖乖站回原來的地方。"
  },
  gt_steam: {
    name: "噴氣嘶嘶蛇", sprite: "mon_gt_steam", level: 4, hp: 190, atk: 29, subject: "自然", q_levels: [2, 3],
    exp: 80, gold: 20, drops: [{ item: "herb", rate: 0.3 }], boss: false,
    desc: "從地面裂縫鑽出來的白色蒸氣蛇，一張口就嘶嘶叫。",
    wake: "噴氣嘶嘶蛇清醒了，鑽回地面的裂縫裡。地熱谷、噴氣孔的水很燙、腐蝕性很強，不能碰！"
  },
  gt_jade: {
    name: "青磺水靈", sprite: "mon_gt_jade", level: 4, hp: 190, atk: 29, subject: "自然", q_levels: [2, 3],
    exp: 80, gold: 20, drops: [{ item: "crystal", rate: 0.3 }], boss: false,
    desc: "地熱谷裡淡綠色的水團精靈，頭上一直冒熱氣。",
    wake: "青磺水靈清醒了，流回地熱谷。地熱谷、噴氣孔的水很燙、腐蝕性很強，不能碰！"
  },
  gt_sulfur: {
    name: "硫晶刺蝟", sprite: "mon_gt_sulfur", level: 2, hp: 40, atk: 10, subject: "自然", q_levels: [1, 2],
    exp: 30, gold: 6, drops: [{ item: "herb", rate: 0.3 }], boss: false,
    desc: "背上長滿淡黃色晶刺的刺蝟，生氣時晶刺會冒白煙。",
    wake: "硫晶刺蝟清醒了，縮成一團滾回草叢。地熱谷、噴氣孔的水很燙、腐蝕性很強，不能碰！"
  }
};
