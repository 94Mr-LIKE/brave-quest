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
window.MONSTERS = {

  // ── 地圖等級 1（M02 擎天草原）──
  dango: {
    name: "迷糊團子", sprite: "mon_dango", level: 1, hp: 12, atk: 4, subject: "數學", q_levels: [1, 1],
    exp: 8, gold: 4, drops: [{ item: "sticky_ball", rate: 0.5 }], boss: false,
    desc: "軟軟黏黏的小團子，被霧弄得數不清自己有幾顆。",
    wake: "迷糊團子清醒了，咕嚕咕嚕滾回草叢裡。"
  },
  rabbit: {
    name: "跳跳兔", sprite: "mon_rabbit", level: 1, hp: 14, atk: 5, subject: "國語", q_levels: [1, 1],
    exp: 9, gold: 4, drops: [{ item: "herb", rate: 0.3 }], boss: false,
    desc: "跳得很高的兔子，被霧弄得忘了回家的路。",
    wake: "跳跳兔清醒了，一蹦一跳地回家了。"
  },

  // ── 地圖等級 2（M03 硫磺谷、M04 神木森林、M09 山城市集；港口螃蟹住在 M06 海邊岩岸）──
  mushroom: {
    name: "毒菇怪", sprite: "mon_mushroom", level: 2, hp: 38, atk: 9, subject: "自然", q_levels: [1, 2],
    exp: 16, gold: 8, drops: [{ item: "mushroom_cap", rate: 0.5 }], boss: false,
    desc: "頭上戴著大菇帽。霧讓牠忘了自己要曬太陽還是躲陰涼。",
    wake: "毒菇怪清醒了，摘下菇帽向你敬禮，跑回樹下。"
  },
  sprout: {
    name: "樹精寶寶", sprite: "mon_sprout", level: 2, hp: 34, atk: 8, subject: "自然", q_levels: [1, 2],
    exp: 15, gold: 7, drops: [{ item: "herb", rate: 0.4 }], boss: false,
    desc: "剛發芽的小樹精，被霧弄得忘了要喝水。",
    wake: "樹精寶寶清醒了，開心地去找水喝。"
  },
  owl: {
    name: "貓頭鷹", sprite: "mon_owl", level: 2, hp: 42, atk: 10, subject: "國語", q_levels: [1, 2],
    exp: 18, gold: 9, drops: [{ item: "feather", rate: 0.3 }], boss: false,
    desc: "森林裡最愛讀書的鳥，霧讓牠把字都看反了。",
    wake: "貓頭鷹清醒了，咕咕叫著飛回樹洞。"
  },
  crab: {
    name: "港口螃蟹", sprite: "mon_crab", level: 2, hp: 40, atk: 9, subject: "英語", q_levels: [1, 2],
    exp: 16, gold: 8, drops: [{ item: "snack", rate: 0.3 }], boss: false,
    desc: "住在海邊岩岸的螃蟹，霧讓牠聽不懂外國船員的話。",
    wake: "港口螃蟹清醒了，橫著走回沙灘。"
  },
  seagull: {
    name: "搶食海鷗", sprite: "mon_seagull", level: 2, hp: 34, atk: 10, subject: "英語", q_levels: [1, 2],
    exp: 16, gold: 8, drops: [{ item: "feather", rate: 0.5 }], boss: false,
    desc: "被霧弄得到處亂搶東西的海鷗。",
    wake: "搶食海鷗清醒了，把東西還給你，飛回海上。"
  },

  // ── 地圖等級 3（M05 紅樹林濕地、M06 海蝕洞窟、M07 哥布林部落）──
  mudslime: {
    name: "泥泥怪", sprite: "mon_mudslime", level: 3, hp: 90, atk: 14, subject: "數學", q_levels: [2, 3],
    exp: 28, gold: 14, drops: [{ item: "gear", rate: 0.5 }], boss: false,
    desc: "濕地泥灘上的泥巴團，迷糊時會把亮亮的齒輪吞進肚子。",
    wake: "泥泥怪清醒了，吐出齒輪，慢慢滑回泥灘裡。"
  },
  frog: {
    name: "沼澤蛙", sprite: "mon_frog", level: 3, hp: 100, atk: 15, subject: "自然", q_levels: [2, 3],
    exp: 30, gold: 15, drops: [{ item: "gear", rate: 0.3 }], boss: false,
    desc: "呱呱叫的大青蛙，霧讓牠忘了天氣會怎麼變。",
    wake: "沼澤蛙清醒了，撲通一聲跳回河道裡。"
  },
  bat: {
    name: "洞窟蝙蝠", sprite: "mon_bat", level: 3, hp: 85, atk: 15, subject: "國語", q_levels: [2, 3],
    exp: 28, gold: 14, drops: [{ item: "bat_wing", rate: 0.4 }], boss: false,
    desc: "倒掛在洞頂睡覺的蝙蝠，被霧吵醒後脾氣不太好。",
    wake: "洞窟蝙蝠清醒了，飛回洞頂繼續睡覺。"
  },
  rock: {
    name: "石頭怪", sprite: "mon_rock", level: 3, hp: 110, atk: 14, subject: "數學", q_levels: [2, 3],
    exp: 32, gold: 16, drops: [{ item: "crystal", rate: 0.4 }], boss: false,
    desc: "會走路的石頭，身上常常黏著亮晶晶的水晶。",
    wake: "石頭怪清醒了，滾到角落安靜地休息。"
  },
  goblin: {
    name: "頑皮哥布林", sprite: "mon_goblin", level: 3, hp: 95, atk: 15, subject: "國語", q_levels: [2, 3],
    exp: 30, gold: 15, drops: [{ item: "scroll", rate: 0.5 }], boss: false,
    desc: "被霧弄迷糊的哥布林，把部落的告示撕下來當玩具。",
    wake: "頑皮哥布林清醒了，不好意思地跑回部落。"
  },

  // ── 地圖等級 4（M08 月世界泥岩丘、M10 府城古城、M11 古城塔頂）──
  boar: {
    name: "岩丘野豬", sprite: "mon_boar", level: 4, hp: 160, atk: 19, subject: "社會", q_levels: [3, 4],
    exp: 45, gold: 22, drops: [{ item: "key", rate: 0.4 }], boss: false,
    desc: "在泥岩溝谷裡亂跑的野豬，迷糊時把柵欄鑰匙叼走了。",
    wake: "岩丘野豬清醒了，放下鑰匙，跑回溝谷。"
  },
  wisp: {
    name: "迷霧精", sprite: "mon_wisp", level: 4, hp: 150, atk: 20, subject: "英語", q_levels: [3, 4],
    exp: 45, gold: 22, drops: [{ item: "crystal", rate: 0.3 }], boss: false,
    desc: "一小團會飄的霧。被光照到就會變回小水滴。",
    wake: "迷霧精被光照亮，變成小水滴飄走了。"
  },
  armor: {
    name: "空盔甲", sprite: "mon_armor", level: 4, hp: 175, atk: 20, subject: "社會", q_levels: [3, 4],
    exp: 48, gold: 24, drops: [{ item: "gear", rate: 0.3 }], boss: false,
    desc: "古城的舊盔甲，被霧吹得自己走來走去。",
    wake: "空盔甲清醒了，喀啦喀啦走回展示台站好。"
  },

  // ───────────────────────────── 頭目 ─────────────────────────────
  tree_king: {
    name: "枯萎樹王", sprite: "boss_tree", level: 2, hp: 190, atk: 12, subject: "自然", q_levels: [2, 4],
    exp: 120, gold: 60, drops: [{ item: "herb", rate: 1 }], boss: true,
    phases: 3, phase_q: 2, last_q_level: 4, ref_mobs: ["mushroom", "sprout", "owl"],
    dialog_before: "D_BOSS_TREE_A", dialog_after: "D_BOSS_TREE_B",
    desc: "守護神木森林的千年神木，被霧附身後忘了怎麼長葉子。",
    wake: "神木清醒了，枝頭冒出新的綠芽。"
  },
  fog_octopus: {
    name: "迷霧章魚", sprite: "boss_octopus", level: 2, hp: 185, atk: 12, subject: "英語", q_levels: [2, 4],
    exp: 120, gold: 60, drops: [{ item: "snack", rate: 1 }], boss: true,
    phases: 3, phase_q: 2, last_q_level: 4, ref_mobs: ["crab", "seagull"],
    dialog_before: "D_BOSS_OCTO_A", dialog_after: "D_BOSS_OCTO_B",
    desc: "從遠海漂來的大章魚，擋在漁港碼頭。只聽得懂英文，一直打瞌睡。",
    wake: "迷霧章魚清醒了，揮揮觸手游回大海。"
  },
  mud_frog: {
    name: "泥巴大蛙", sprite: "boss_frog", level: 3, hp: 475, atk: 19, subject: "數學", q_levels: [2, 4],
    exp: 200, gold: 100, drops: [{ item: "gear", rate: 1 }], boss: true,
    phases: 3, phase_q: 2, last_q_level: 4, ref_mobs: ["mudslime", "frog"],
    dialog_before: "D_BOSS_FROG_A", dialog_after: "D_BOSS_FROG_B",
    desc: "紅樹林濕地最大的青蛙，霧讓牠數字全亂掉，一直亂丟泥巴。",
    wake: "泥巴大蛙清醒了，呱呱笑著跳回池塘。"
  },
  noise_bat: {
    name: "噪音蝙蝠王", sprite: "boss_bat", level: 3, hp: 485, atk: 19, subject: "國語", q_levels: [2, 4],
    exp: 200, gold: 100, drops: [{ item: "bat_wing", rate: 1 }], boss: true,
    phases: 3, phase_q: 2, last_q_level: 4, ref_mobs: ["bat", "rock", "goblin"],
    dialog_before: "D_BOSS_BAT_A", dialog_after: "D_BOSS_BAT_B",
    desc: "蝙蝠們的老大，霧讓牠的叫聲變得好吵，大家都看不下書。",
    wake: "噪音蝙蝠王清醒了，安安靜靜地倒掛著睡著了。"
  },
  angry_golem: {
    name: "暴躁石像", sprite: "boss_golem", level: 4, hp: 775, atk: 25, subject: "社會", q_levels: [3, 4],
    exp: 300, gold: 150, drops: [{ item: "crystal", rate: 1 }], boss: true,
    phases: 3, phase_q: 2, last_q_level: 4, ref_mobs: ["boar", "wisp"],
    dialog_before: "D_BOSS_GOLEM_A", dialog_after: "D_BOSS_GOLEM_B",
    desc: "守護月世界的石像，被霧弄得忘了大家一起訂的規則。",
    wake: "暴躁石像清醒了，慢慢坐下來守護泥岩丘。"
  },
  fog_demon: {
    name: "遺忘霧魔", sprite: "boss_fog", level: 5, hp: 975, atk: 28, subject: "混合",
    subjects: ["國語", "英語", "數學", "自然", "社會"], q_levels: [3, 4],
    exp: 500, gold: 300, drops: [], boss: true,
    phases: 3, phase_q: 2, last_q_level: 4, ref_mobs: ["armor", "wisp"],
    dialog_before: "D_BOSS_FOG_A", dialog_after: "D_BOSS_FOG_B",
    desc: "讓大家忘記知識的大霧。五道光一起照它，它就會散開。",
    wake: "遺忘霧魔被五道光照亮，變成溫暖的晨光散開了。"
  }
};
