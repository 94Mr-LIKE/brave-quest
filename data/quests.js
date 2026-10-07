/*
 * 勇者大冒險 — 委託（07 第 6.4 節；新增欄位見 README_資料格式.md）
 * 撰寫：遊戲劇情設計師＋關卡設計
 *
 * units 全部取自 docs/data/questions.js 實際存在的 unit 字串（validate_world.js 會逐一比對）。
 * 版本：國數自社＝翰林三上、英語＝何嘉仁 Super Fun 1（依 questions.js 檔頭與 01_課本版本調查.md）。
 *
 * 委託鏈（requires）與地區解鎖（world.js 的 unlock_quest）：
 *   Q_TUT_1 → Q_TUT_2 → Q_TUT_3（解鎖：神木森林、府城古城）
 *     ├→ 精靈鏈 Q_ELF_1→2→3→4（自然之光；解鎖紅樹林濕地）→ 地精鏈 Q_GNO_1→2→3→4（數學之光）─┐
 *     └→ 商人鏈 Q_MER_1→2→3→4（英語之光）→ 哥布林鏈 Q_GOB_1→2→3→4（國語之光）────────────┴→（解鎖月世界）獸人鏈 Q_ORC_1→2→3→4（社會之光）
 *   五道光 → Q_LAMPS（金包里點燈）→ Q_FINAL（古城塔頂，遺忘霧魔）
 *   村民委託（Q_SIDE_*）都是支線，不擋主線。
 *   府城古城在教學後就解鎖，是為了讓孩子 Lv5 時能去職業公會轉職。
 *
 * reward.exp 0＝依答題自動計算（題目 exp × 地圖等級係數）；hunt/boss 的 exp 也是 0（打怪本身就有 EXP）。
 */
window.QUESTS = {

  // ═════════════════════ 金包里教學（M01）═════════════════════
  Q_TUT_1: {
    title: "燈座上的字", giver: "chief", map: "M01", kind: "help",
    goal: "在慈海宮廟埕找里長伯，幫忙讀海風公園燈座上的字：答對 2 題國語。",
    log_next: "去金包里東北邊的磺火漁港，找漁夫阿伯。",
    teaches: ["移動", "對話", "答題", "提示"],
    subject: "國語", units: ["第參單元 走進大自然"], count: 2, level_range: [1, 1],
    hunt: null, requires: [], reward: { exp: 0, gold: 20, item: "herb", light: null },
    dialog_start: "D_TUT_1A", dialog_end: "D_TUT_1B"
  },
  Q_TUT_2: {
    title: "漁夫阿伯算魚錢", giver: "fisher", map: "M01", kind: "help",
    goal: "幫漁夫阿伯算魚錢、找零錢：答對 3 題數學。",
    log_next: "拿金幣去老街的雜貨店買木劍或皮衣。再去溫泉旁找旅館老闆娘。",
    teaches: ["商店"],
    subject: "數學", units: ["1 10000以內的數", "2 10000以內的加減"], count: 3, level_range: [1, 2],
    hunt: null, requires: ["Q_TUT_1"], reward: { exp: 0, gold: 50, item: null, light: null },
    dialog_start: "D_TUT_2A", dialog_end: "D_TUT_2B"
  },
  Q_TUT_3: {
    title: "黏黏球補窗戶", giver: "innkeeper", map: "M01", kind: "hunt",
    goal: "從金包里往南走到擎天草原，讓迷糊團子清醒，帶回 2 顆黏黏球。",
    log_next: "客運站可以搭車去神木森林、府城古城了！往東走是山城市集。神木森林和山城市集都需要幫忙！",
    teaches: ["戰鬥", "旅店", "世界地圖"],
    subject: "數學", units: [], count: null, level_range: [1, 1],
    hunt: { item: "sticky_ball", n: 2, monster: "dango", map: "M02" },
    requires: ["Q_TUT_2"], reward: { exp: 0, gold: 30, item: "eraser", light: null },
    dialog_start: "D_TUT_3A", dialog_end: "D_TUT_3B"
  },

  // ═════════════════════ 神木森林・精靈族（M04，自然）═════════════════════
  Q_ELF_1: {
    title: "葉子為什麼黃了", giver: "elf_elder", map: "M04", kind: "help",
    goal: "在金包里客運站搭車到神木森林，幫精靈長老想起植物和風的知識：答對 3 題自然。",
    log_next: "去找村子南邊、森林小路旁的精靈小孩葉葉。",
    subject: "自然", units: ["一、植物大發現", "三、風與空氣"], count: 3, level_range: [1, 2],
    hunt: null, requires: ["Q_TUT_3"], reward: { exp: 0, gold: 60, item: null, light: null },
    dialog_start: "D_ELF_1A", dialog_end: "D_ELF_1B", dialog_locked: "D_ELF_LOCK"
  },
  Q_ELF_2: {
    title: "指北針亂轉了", giver: "elf_kid", map: "M04", kind: "help",
    goal: "幫葉葉修好指北針和風車：答對 4 題自然。",
    log_next: "回去找精靈長老。",
    subject: "自然", units: ["二、磁鐵好好玩", "三、風與空氣"], count: 4, level_range: [1, 3],
    hunt: null, requires: ["Q_ELF_1"], reward: { exp: 0, gold: 70, item: "herb", light: null },
    dialog_start: "D_ELF_2A", dialog_end: "D_ELF_2B"
  },
  Q_ELF_3: {
    title: "毒菇帽調查", giver: "elf_elder", map: "M04", kind: "hunt",
    goal: "在神木森林南邊的密林讓毒菇怪清醒，帶回 3 個毒菇帽給長老。",
    log_next: "長老發現霧是從森林北邊的千年神木飄出來的。",
    subject: "自然", units: [], count: null, level_range: [1, 2],
    hunt: { item: "mushroom_cap", n: 3, monster: "mushroom", map: "M04" },
    requires: ["Q_ELF_2"], reward: { exp: 0, gold: 60, item: "guide", light: null },
    dialog_start: "D_ELF_3A", dialog_end: "D_ELF_3B"
  },
  Q_ELF_4: {
    title: "淨化枯萎樹王", giver: "elf_elder", map: "M04", kind: "boss",
    goal: "到神木森林最北邊的千年神木前，讓枯萎樹王清醒，拿回自然之光。",
    log_next: "拿到自然之光！紅樹林濕地解鎖了，搭車去幫地精族。",
    subject: "自然", units: ["一、植物大發現", "二、磁鐵好好玩", "三、風與空氣", "四、奇妙的溶解"], count: null, level_range: [2, 4],
    boss: "tree_king", boss_map: "M04",
    hunt: null, requires: ["Q_ELF_3"], reward: { exp: 0, gold: 100, item: null, light: "自然" },
    dialog_start: "D_ELF_4A", dialog_end: "D_ELF_4B"
  },

  // ═════════════════════ 山城市集・外國商人（M09，英語）═════════════════════
  Q_MER_1: {
    title: "聽不懂的招呼", giver: "merchant", map: "M09", kind: "help",
    goal: "從金包里往東走到山城市集，幫外國商人和客人打招呼：答對 3 題英語。",
    log_next: "商人還有別的煩惱，再跟商人說話。",
    subject: "英語", units: ["Lesson 1 What's your name?（名字）", "Lesson 2 How old are you?（數字）"], count: 3, level_range: [1, 2],
    hunt: null, requires: ["Q_TUT_3"], reward: { exp: 0, gold: 60, item: null, light: null },
    dialog_start: "D_MER_1A", dialog_end: "D_MER_1B", dialog_locked: "D_MER_LOCK"
  },
  Q_MER_2: {
    title: "商人的心情和貨物", giver: "merchant", map: "M09", kind: "help",
    goal: "幫商人回答客人的心情問題、數清楚貨物：答對 4 題英語。",
    log_next: "海鷗搶走了商人的羽毛筆，再跟商人說話。",
    subject: "英語", units: ["Lesson 4 Are you tired?（感覺）", "Lesson 2 How old are you?（數字）"], count: 4, level_range: [2, 3],
    hunt: null, requires: ["Q_MER_1"], reward: { exp: 0, gold: 70, item: "herb", light: null },
    dialog_start: "D_MER_2A", dialog_end: "D_MER_2B"
  },
  Q_MER_3: {
    title: "海鷗搶走的羽毛", giver: "merchant", map: "M09", kind: "hunt",
    goal: "讓山城巷子裡的搶食海鷗清醒，找回 3 根羽毛。",
    log_next: "金包里的漁港有大章魚擋住漁船，再跟商人說話。",
    subject: "英語", units: [], count: null, level_range: [1, 2],
    hunt: { item: "feather", n: 3, monster: "seagull", map: "M09" },
    requires: ["Q_MER_2"], reward: { exp: 0, gold: 60, item: "eraser", light: null },
    dialog_start: "D_MER_3A", dialog_end: "D_MER_3B"
  },
  Q_MER_4: {
    title: "漁港的迷霧章魚", giver: "merchant", map: "M09", kind: "boss",
    goal: "回金包里的磺火漁港，沿著碼頭木橋走到底，讓迷霧章魚清醒，拿回英語之光。",
    log_next: "拿到英語之光！金包里東北邊海岸的海蝕洞窟深處，有哥布林部落需要幫忙。",
    subject: "英語", units: ["Lesson 1 What's your name?（名字）", "Lesson 2 How old are you?（數字）", "Lesson 3 I'm short.（身材外貌）", "Lesson 4 Are you tired?（感覺）"], count: null, level_range: [2, 4],
    boss: "fog_octopus", boss_map: "M01",
    hunt: null, requires: ["Q_MER_3"], reward: { exp: 0, gold: 100, item: null, light: "英語" },
    dialog_start: "D_MER_4A", dialog_end: "D_MER_4B"
  },

  // ═════════════════════ 紅樹林濕地・地精族（M05，數學）═════════════════════
  Q_GNO_1: {
    title: "材料秤一秤", giver: "gnome_chief", map: "M05", kind: "help",
    goal: "搭車到紅樹林濕地，幫地精族長秤材料、量長度：答對 4 題數學。",
    log_next: "去找工坊旁邊的地精工匠。",
    subject: "數學", units: ["7 公斤與公克", "3 毫米與數線", "2 10000以內的加減"], count: 4, level_range: [2, 3],
    hunt: null, requires: ["Q_ELF_4"], reward: { exp: 0, gold: 100, item: null, light: null },
    dialog_start: "D_GNO_1A", dialog_end: "D_GNO_1B", dialog_locked: "D_GNO_LOCK"
  },
  Q_GNO_2: {
    title: "木板要切幾段", giver: "gnome", map: "M05", kind: "help",
    goal: "幫地精工匠分木板、算數量：答對 4 題數學。",
    log_next: "泥泥怪把齒輪吞走了，回去找地精族長。",
    subject: "數學", units: ["4 乘法", "6 除法", "8 分數"], count: 4, level_range: [3, 4],
    hunt: null, requires: ["Q_GNO_1"], reward: { exp: 0, gold: 110, item: "herb", light: null },
    dialog_start: "D_GNO_2A", dialog_end: "D_GNO_2B"
  },
  Q_GNO_3: {
    title: "找回齒輪", giver: "gnome_chief", map: "M05", kind: "hunt",
    goal: "讓濕地泥灘上的泥泥怪清醒，帶回 3 個齒輪。",
    log_next: "濕地西南邊的泥灘上有泥巴大蛙，再跟族長說話。",
    subject: "數學", units: [], count: null, level_range: [2, 3],
    hunt: { item: "gear", n: 3, monster: "mudslime", map: "M05" },
    requires: ["Q_GNO_2"], reward: { exp: 0, gold: 100, item: "guide", light: null },
    dialog_start: "D_GNO_3A", dialog_end: "D_GNO_3B"
  },
  Q_GNO_4: {
    title: "泥巴大蛙", giver: "gnome_chief", map: "M05", kind: "boss",
    goal: "沿著木棧道走到濕地西南邊的泥灘，讓泥巴大蛙清醒，拿回數學之光。",
    log_next: "拿到數學之光！國語之光也拿到的話，月世界就會解鎖。",
    subject: "數學", units: ["1 10000以內的數", "2 10000以內的加減", "3 毫米與數線", "4 乘法", "5 角與形狀", "6 除法", "7 公斤與公克", "8 分數", "9 列表與規律"], count: null, level_range: [2, 4],
    boss: "mud_frog", boss_map: "M05",
    hunt: null, requires: ["Q_GNO_3"], reward: { exp: 0, gold: 150, item: null, light: "數學" },
    dialog_start: "D_GNO_4A", dialog_end: "D_GNO_4B"
  },

  // ═════════════════════ 哥布林部落（M07，國語）═════════════════════
  Q_GOB_1: {
    title: "看不懂的告示", giver: "goblin_chief", map: "M07", kind: "help",
    goal: "穿過海蝕洞窟到哥布林部落，幫酋長讀懂部落的作息告示：答對 4 題國語。",
    log_next: "去找部落裡的哥布林小孩咕嚕。",
    subject: "國語", units: ["第壹單元 運用時間", "第貳單元 解決問題"], count: 4, level_range: [2, 4],
    hunt: null, requires: ["Q_MER_4"], reward: { exp: 0, gold: 100, item: null, light: null },
    dialog_start: "D_GOB_1A", dialog_end: "D_GOB_1B", dialog_locked: "D_GOB_LOCK"
  },
  Q_GOB_2: {
    title: "寫一張祝福卡", giver: "goblin_kid", map: "M07", kind: "help",
    goal: "幫咕嚕想出好聽的句子，寫祝福卡給家人：答對 3 題國語。",
    log_next: "告示被撕碎帶走了，回去找酋長。",
    subject: "國語", units: ["第肆單元 美好的祝福", "第參單元 走進大自然"], count: 3, level_range: [2, 3],
    hunt: null, requires: ["Q_GOB_1"], reward: { exp: 0, gold: 110, item: "herb", light: null },
    dialog_start: "D_GOB_2A", dialog_end: "D_GOB_2B"
  },
  Q_GOB_3: {
    title: "撿回告示卷軸", giver: "goblin_chief", map: "M07", kind: "hunt",
    goal: "讓部落南邊的頑皮哥布林清醒，找回 3 張告示卷軸。",
    log_next: "告示上寫著：蝙蝠王在部落東邊的洞裡。再跟酋長說話。",
    subject: "國語", units: [], count: null, level_range: [2, 3],
    hunt: { item: "scroll", n: 3, monster: "goblin", map: "M07" },
    requires: ["Q_GOB_2"], reward: { exp: 0, gold: 100, item: "guide", light: null },
    dialog_start: "D_GOB_3A", dialog_end: "D_GOB_3B"
  },
  Q_GOB_4: {
    title: "噪音蝙蝠王", giver: "goblin_chief", map: "M07", kind: "boss",
    goal: "到哥布林部落東邊的小洞，讓噪音蝙蝠王清醒，拿回國語之光。",
    log_next: "拿到國語之光！數學之光也拿到的話，月世界就會解鎖。",
    subject: "國語", units: ["第壹單元 運用時間", "第貳單元 解決問題", "第參單元 走進大自然", "第肆單元 美好的祝福"], count: null, level_range: [2, 4],
    boss: "noise_bat", boss_map: "M07",
    hunt: null, requires: ["Q_GOB_3"], reward: { exp: 0, gold: 150, item: null, light: "國語" },
    dialog_start: "D_GOB_4A", dialog_end: "D_GOB_4B"
  },

  // ═════════════════════ 月世界泥岩丘・獸人族（M08，社會）═════════════════════
  Q_ORC_1: {
    title: "獵場要怎麼分", giver: "orc_chief", map: "M08", kind: "help",
    goal: "搭車到月世界，幫獸人族長想出公平的規則和分配方法：答對 4 題社會。",
    log_next: "去找營地大門外的獸人獵人。",
    subject: "社會", units: ["第一單元 升上三年級的新學習", "第二單元 校園規範和班級自治", "第五單元 打造更美好的班級"], count: 4, level_range: [2, 4],
    hunt: null, requires: ["Q_GNO_4", "Q_GOB_4"], reward: { exp: 0, gold: 150, item: null, light: null },
    dialog_start: "D_ORC_1A", dialog_end: "D_ORC_1B", dialog_locked: "D_ORC_LOCK"
  },
  Q_ORC_2: {
    title: "營地的生活約定", giver: "orc", map: "M08", kind: "help",
    goal: "幫獸人獵人想想怎麼照顧自己、和家人好好相處：答對 4 題社會。",
    log_next: "野豬把柵欄鑰匙叼走了，回去找族長。",
    subject: "社會", units: ["第三單元 我的校園和家庭生活", "第四單元 健康成長的快樂童年"], count: 4, level_range: [2, 4],
    hunt: null, requires: ["Q_ORC_1"], reward: { exp: 0, gold: 150, item: "herb", light: null },
    dialog_start: "D_ORC_2A", dialog_end: "D_ORC_2B"
  },
  Q_ORC_3: {
    title: "柵欄鑰匙", giver: "orc_chief", map: "M08", kind: "hunt",
    goal: "讓泥岩溝谷裡的野豬清醒，找回 3 把柵欄鑰匙。",
    log_next: "泥岩丘南邊的石像動起來了，再跟族長說話。",
    subject: "社會", units: [], count: null, level_range: [3, 4],
    hunt: { item: "key", n: 3, monster: "boar", map: "M08" },
    requires: ["Q_ORC_2"], reward: { exp: 0, gold: 150, item: "guide", light: null },
    dialog_start: "D_ORC_3A", dialog_end: "D_ORC_3B"
  },
  Q_ORC_4: {
    title: "暴躁石像", giver: "orc_chief", map: "M08", kind: "boss",
    goal: "到月世界南邊的泥岩溝，讓暴躁石像清醒，拿回社會之光。",
    log_next: "五道光都拿回來了嗎？搭車回金包里找里長伯點燈！",
    subject: "社會", units: ["第一單元 升上三年級的新學習", "第二單元 校園規範和班級自治", "第三單元 我的校園和家庭生活", "第四單元 健康成長的快樂童年", "第五單元 打造更美好的班級"], count: null, level_range: [3, 4],
    boss: "angry_golem", boss_map: "M08",
    hunt: null, requires: ["Q_ORC_3"], reward: { exp: 0, gold: 200, item: null, light: "社會" },
    dialog_start: "D_ORC_4A", dialog_end: "D_ORC_4B"
  },

  // ═════════════════════ 主線收尾 ═════════════════════
  Q_LAMPS: {
    title: "點亮五盞知識燈", giver: "chief", map: "M01", kind: "help",
    goal: "回金包里，在海風公園的五盞燈前各答對 1 題（五科各一題），把燈點亮。",
    log_next: "霧魔在古城塔頂！搭車去府城古城，找城主。",
    subject: "混合", subjects: ["國語", "英語", "數學", "自然", "社會"], units: [], count: 5, level_range: [1, 3],
    hunt: null, requires: ["Q_ELF_4", "Q_MER_4", "Q_GNO_4", "Q_GOB_4", "Q_ORC_4"],
    reward: { exp: 0, gold: 200, item: "guide", light: null },
    dialog_start: "D_LAMPS_A", dialog_end: "D_LAMPS_B", dialog_locked: "D_CHIEF_IDLE"
  },
  Q_FINAL: {
    title: "驅散遺忘霧魔", giver: "king", map: "M10", kind: "boss",
    goal: "從府城城主府後面的樓梯上古城塔頂，用五道光驅散遺忘霧魔。",
    log_next: "霧散了！可以繼續解村民委託、開寶箱，或回金包里看看。",
    subject: "混合", subjects: ["國語", "英語", "數學", "自然", "社會"], units: [], count: null, level_range: [3, 4],
    boss: "fog_demon", boss_map: "M11",
    hunt: null, requires: ["Q_LAMPS"], requires_lights: ["國語", "英語", "數學", "自然", "社會"],
    reward: { exp: 0, gold: 300, item: null, light: null },
    dialog_start: "D_FINAL_A", dialog_end: "D_FINAL_B", dialog_locked: "D_FINAL_LOCK", dialog_ending: "D_ENDING"
  },

  // ═════════════════════ 村民委託（支線，散佈各圖）═════════════════════
  Q_SIDE_BOOK: {
    title: "書架亂糟糟", giver: "bookstore", map: "M01", kind: "help",
    goal: "幫海風圖書館的阿姨整理書架：答對 3 題國語。",
    log_next: "圖書館阿姨說：不會的題目，提示會告訴你課本哪裡有教。",
    subject: "國語", units: ["第壹單元 運用時間", "第貳單元 解決問題"], count: 3, level_range: [1, 2],
    hunt: null, requires: ["Q_TUT_1"], reward: { exp: 0, gold: 30, item: "guide", light: null },
    dialog_start: "D_BOOK_A", dialog_end: "D_BOOK_B"
  },
  Q_SIDE_POTATO: {
    title: "烤地瓜秤一秤", giver: "potato_seller", map: "M02", kind: "help",
    goal: "幫擎天草原步道口賣地瓜的阿姨秤重、數數：答對 3 題數學。",
    log_next: "阿姨送你番薯仔點心。",
    subject: "數學", units: ["7 公斤與公克", "1 10000以內的數"], count: 3, level_range: [1, 2],
    hunt: null, requires: ["Q_TUT_2"], reward: { exp: 0, gold: 30, item: "snack", light: null },
    dialog_start: "D_POTATO_A", dialog_end: "D_POTATO_B"
  },
  Q_SIDE_STEAM: {
    title: "冒白煙的山谷", giver: "hiker", map: "M03", kind: "help",
    goal: "幫硫磺谷的登山阿伯想起空氣和溶解的知識：答對 3 題自然。",
    log_next: "登山阿伯說：走步道要小心，不要靠近噴氣孔。",
    subject: "自然", units: ["四、奇妙的溶解", "三、風與空氣"], count: 3, level_range: [1, 3],
    hunt: null, requires: ["Q_TUT_3"], reward: { exp: 0, gold: 60, item: "herb", light: null },
    dialog_start: "D_STEAM_A", dialog_end: "D_STEAM_B"
  },
  Q_SIDE_LOST: {
    title: "迷路的精靈小孩", giver: "elf_kid_lost", map: "M04", kind: "help",
    goal: "幫神木森林密林裡迷路的精靈小孩，想起回家的路和規矩：答對 3 題社會。",
    log_next: "精靈的樹屋村在森林的北邊。",
    subject: "社會", units: ["第三單元 我的校園和家庭生活", "第二單元 校園規範和班級自治"], count: 3, level_range: [1, 2],
    hunt: null, requires: ["Q_TUT_3"], reward: { exp: 0, gold: 50, item: "herb", light: null },
    dialog_start: "D_LOST_A", dialog_end: "D_LOST_B"
  },
  Q_SIDE_MEASURE: {
    title: "量一量木板", giver: "gnome_measure", map: "M05", kind: "help",
    goal: "幫濕地西南邊的地精木匠量長度、認形狀：答對 3 題數學。",
    log_next: "木匠送你一顆回音水晶。",
    subject: "數學", units: ["3 毫米與數線", "5 角與形狀"], count: 3, level_range: [1, 2],
    hunt: null, requires: ["Q_TUT_3"], reward: { exp: 0, gold: 60, item: "crystal", light: null },
    dialog_start: "D_MEASURE_A", dialog_end: "D_MEASURE_B"
  },
  Q_SIDE_ECHO: {
    title: "回音猜詞語", giver: "goblin_kid_echo", map: "M06", kind: "help",
    goal: "和海蝕洞窟裡的哥布林小孩玩猜詞語：答對 3 題國語。",
    log_next: "哥布林部落在海蝕洞窟的東北邊深處。",
    subject: "國語", units: ["第參單元 走進大自然", "第肆單元 美好的祝福"], count: 3, level_range: [1, 3],
    hunt: null, requires: ["Q_TUT_3"], reward: { exp: 0, gold: 80, item: "herb", light: null },
    dialog_start: "D_ECHO_A", dialog_end: "D_ECHO_B"
  },
  Q_SIDE_PIGGY: {
    title: "班費買盆栽", giver: "orc_bank", map: "M08", kind: "help",
    goal: "幫獸人小班長規劃班費，買盆栽布置教室：答對 2 題社會。",
    log_next: "小班長說：班上的事，大家一起討論決定。",
    subject: "社會", units: ["第五單元 打造更美好的班級"], count: 2, level_range: [3, 4],
    hunt: null, requires: ["Q_TUT_3"], reward: { exp: 0, gold: 120, item: "guide", light: null },
    dialog_start: "D_PIGGY_A", dialog_end: "D_PIGGY_B"
  },
  Q_SIDE_MAGNET: {
    title: "鐵匠的磁鐵", giver: "blacksmith", map: "M09", kind: "help",
    goal: "幫山城武器鋪的鐵匠師傅想起磁鐵會吸什麼：答對 3 題自然。",
    log_next: "鐵匠師傅送你一顆回音水晶。",
    subject: "自然", units: ["二、磁鐵好好玩"], count: 3, level_range: [1, 3],
    hunt: null, requires: ["Q_TUT_3"], reward: { exp: 0, gold: 60, item: "crystal", light: null },
    dialog_start: "D_MAGNET_A", dialog_end: "D_MAGNET_B"
  },
  Q_SIDE_TARO: {
    title: "芋圓平分", giver: "taro_seller", map: "M09", kind: "help",
    goal: "幫山城的芋圓店阿姨把芋圓平分到每一碗：答對 3 題數學。",
    log_next: "芋圓店阿姨說：你真聰明，有空再來吃芋圓。",
    subject: "數學", units: ["4 乘法", "6 除法", "9 列表與規律"], count: 3, level_range: [3, 4],
    hunt: null, requires: ["Q_TUT_3"], reward: { exp: 0, gold: 100, item: "snack", light: null },
    dialog_start: "D_TARO_A", dialog_end: "D_TARO_B"
  },
  Q_SIDE_LIB: {
    title: "古城圖書館的英文書", giver: "librarian", map: "M10", kind: "help",
    goal: "幫府城古城圖書館員讀英文書：答對 3 題英語。",
    log_next: "圖書館員說：常常讀，就不會忘。",
    subject: "英語", units: ["Lesson 3 I'm short.（身材外貌）", "Lesson 1 What's your name?（名字）"], count: 3, level_range: [1, 4],
    hunt: null, requires: ["Q_TUT_3"], reward: { exp: 0, gold: 100, item: "guide", light: null },
    dialog_start: "D_LIB_A", dialog_end: "D_LIB_B"
  }
};
