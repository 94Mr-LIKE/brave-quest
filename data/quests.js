/*
 * 勇者大冒險 — 委託（07 第 6.4 節；新增欄位見 README_資料格式.md）
 * 撰寫：遊戲劇情設計師＋關卡設計
 *
 * units 全部取自 docs/data/questions.js 實際存在的 unit 字串（validate_world.js 會逐一比對）。
 * 版本：國數自社＝翰林三上／三下、英語＝何嘉仁 Super Fun 1／2（依 questions.js 檔頭與 01_課本版本調查.md）。v0.8 起五科頭目任務的單元清單加入三下單元。
 *
 * 委託鏈（requires）與地區解鎖（world.js 的 unlock_quest／unlock_visit）：
 *   v1.1 第一章（59_v1.1第一章實作規格.md 4.1 節，北部方案 B）：
 *   金包里 Q_TUT_1 → Q_TUT_2 → 擎天草原 Q_TUT_3（解鎖：神木森林、府城古城）
 *     → 硫磺谷 Q_YM_1 → 竹子湖 Q_ZZH_1 → Q_ZZH_2（竹子湖是引導不是關卡：Q_GOB_1 只要 Q_TUT_3）
 *     → 野柳／哥布林部落 Q_GOB_1 → 2 → 3 → Q_GOB_4 噪音蝙蝠王【國語之光】
 *     → 基隆港 Q_KL_1 → 九份 Q_MER_1 → 2 → 3 → 金瓜石 Q_JGS_1 → 回金包里漁港 Q_MER_4 迷霧章魚【英語之光】
 *     → 里長伯 Q_LAMPS_3 點國語、英語兩盞燈（chapter_end: 1，第一章完成）→ 慈護宮轉職（見習 Lv10＋立志小考，規則不變）
 *   第一章支線：Q_SIDE_BOOK、Q_N1_TIDE、Q_SIDE_POTATO、Q_N1_BUFFALO、Q_SIDE_STEAM、Q_SIDE_ECHO、Q_KL_2、Q_SIDE_MAGNET、
 *     Q_SIDE_TARO、Q_JGS_2、Q_JGS_3（金脈鐵顎王）
 *   舊冒險照舊（4.7 節）：Q_TUT_3 之後 精靈鏈 Q_ELF_1→2→3→4（自然之光；解鎖紅樹林濕地）→ 地精鏈 Q_GNO_1→2→3→4（數學之光）；
 *     Q_GNO_4＋Q_GOB_4 →（解鎖月世界）獸人鏈 Q_ORC_1→2→3→4（社會之光）
 *   五道光 → Q_LAMPS（金包里點五盞燈）→ Q_FINAL（古城塔頂，遺忘霧魔）
 *   Q_LAMPS_3 要排在 Q_LAMPS 前面（QuestLog.forNpc 依資料順序挑「可接」的委託）；Q_YM_1 要排在 Q_SIDE_STEAM 前面（同一位登山阿伯，主線先）。
 *   村民委託（Q_SIDE_*、Q_N1_*、Q_KL_2、Q_JGS_2、Q_JGS_3）都是支線，不擋主線。
 *   v1.2 第二章（61_v1.2第二章宜蘭實作規格.md 4.1 節）：Q_LAMPS_3 → 草嶺古道 Q_CL_1 → 頭城礁溪 Q_YL_1 → Q_YL_2（打獵）→ 三星 Q_YL_3
 *     → 蘇澳 Q_YL_4 → 南方澳 Q_YL_5 黏黏雨雲王（chapter_end: 2）；支線 Q_YL_SNOW、Q_YL_TURTLE、Q_YL_OPERA、Q_YL_FISH（前置 Q_CL_1）。舊委託都不改。
 *   v1.3 台北章（62_v1.3台北章實作規格.md 4.1 節）：Q_YL_5 → 坪林 Q_PL_1 → Q_PL_2（打獵）→ 貓空 Q_MK_1（打獵）→ Q_MK_2 → 台北城 Q_TPC_1
 *     → 北投 Q_BT_1 → Q_BT_2 → 紅樹林 Q_GNO_1（前置改成 Q_BT_2）～Q_GNO_4 → 金包里 Q_LAMPS_MATH（chapter_end: 3）；支線 Q_TPC_2、Q_TPC_3、Q_XY_1、Q_XY_2。
 *   府城古城在教學後就解鎖，是為了讓孩子 Lv5 時能去職業公會轉職。
 *
 * reward.exp 0＝依答題自動計算（題目 exp × 地圖等級係數）；hunt/boss 的 exp 也是 0（打怪本身就有 EXP）。
 */
window.QUESTS = {

  // ═════════════════════ 金包里教學（M01）═════════════════════
  Q_TUT_1: {
    title: "燈座上的字", giver: "chief", map: "M01", kind: "help",
    goal: "在金包里慈護宮廟埕找里長伯，幫忙讀海風公園燈座上的字：答對 2 題國語。",
    log_next: "去金包里東北邊的磺火漁港，找漁夫阿伯。",
    teaches: ["移動", "對話", "答題", "提示"],
    subject: "國語", units: ["第參單元 走進大自然"], count: 2, level_range: [1, 1],
    hunt: null, requires: [], reward: { exp: 0, gold: 20, item: "herb", light: null },
    dialog_start: "D_TUT_1A", dialog_end: "D_TUT_1B"
  },
  Q_TUT_2: {
    title: "漁夫阿伯算魚錢", giver: "fisher", map: "M01", kind: "help",
    goal: "幫漁夫阿伯算魚錢、找零錢：答對 3 題數學。",
    log_next: "拿金幣去老街的雜貨店買木劍或皮衣。再去溫泉旁找旅館老闆。",
    teaches: ["商店"],
    subject: "數學", units: ["1 10000以內的數", "2 10000以內的加減"], count: 3, level_range: [1, 2],
    hunt: null, requires: ["Q_TUT_1"], reward: { exp: 0, gold: 50, item: null, light: null },
    dialog_start: "D_TUT_2A", dialog_end: "D_TUT_2B"
  },
  Q_TUT_3: {
    title: "黏黏球補窗戶", giver: "innkeeper", map: "M01", kind: "hunt",
    goal: "從金包里往南走到擎天草原，讓迷糊團子清醒，帶回 2 顆黏黏球。",
    log_next: "往西到硫磺谷、竹子湖；往東是野柳。",   // v1.1 審查：任務日誌一句 30 字內
    teaches: ["戰鬥", "旅店", "世界地圖"],
    subject: "數學", units: [], count: null, level_range: [1, 1],
    hunt: { item: "sticky_ball", n: 2, monster: "dango", map: "M02" },
    requires: ["Q_TUT_2"], reward: { exp: 0, gold: 30, item: "eraser", light: null },
    dialog_start: "D_TUT_3A", dialog_end: "D_TUT_3B"
  },

  // ═════════════════════ v1.1 第一章主線：硫磺谷、竹子湖、基隆港、金瓜石（59 號 4.2 節）═════════════════════
  Q_YM_1: {
    title: "七星山有多高", giver: "hiker", map: "M03", kind: "help",
    goal: "到硫磺谷找登山阿伯，算算七星山有多高：答對 3 題數學。",
    log_next: "從硫磺谷往南走，就到竹子湖了。",
    subject: "數學", units: ["1 10000以內的數", "2 10000以內的加減"], count: 3, level_range: [1, 2],
    hunt: null, requires: ["Q_TUT_3"], reward: { exp: 0, gold: 60, item: null, light: null },
    dialog_start: "D_YM_1A", dialog_end: "D_YM_1B"
  },
  Q_ZZH_1: {
    title: "海芋田數一數", giver: "calla_farmer", map: "M46", kind: "help",
    goal: "從硫磺谷往南走到竹子湖，幫海芋農阿伯數海芋：答對 3 題數學。",
    log_next: "去原種田故事館找解說員。",
    subject: "數學", units: ["4 乘法", "1 10000以內的數"], count: 3, level_range: [1, 2],
    hunt: null, requires: ["Q_YM_1"], reward: { exp: 0, gold: 70, item: null, light: null },
    dialog_start: "D_ZZH_1A", dialog_end: "D_ZZH_1B", dialog_locked: "D_ZZH_LOCK"
  },
  Q_ZZH_2: {
    title: "蓬萊米的故鄉", giver: "rice_guide", map: "M46", kind: "help",
    goal: "到原種田故事館，聽解說員說竹子湖的米：答對 3 題社會。",
    log_next: "還沒去哥布林部落嗎？回金包里往東，穿過野柳的海蝕洞窟。",   // v1.1 審查：條件式（先做完哥布林鏈的孩子不會被叫回去）
    subject: "社會", units: ["第一單元 我居住的地方", "第四單元 生活與工作的轉變"], count: 3, level_range: [1, 2],
    hunt: null, requires: ["Q_ZZH_1"], reward: { exp: 0, gold: 80, item: "guide", light: null },
    dialog_start: "D_ZZH_2A", dialog_end: "D_ZZH_2B"
  },
  Q_KL_1: {
    title: "雨港的小雨傘", giver: "harbor_uncle", map: "M47", kind: "hunt",
    goal: "從野柳東邊的海岸公路走到基隆港，讓碼頭的滴滴雨精清醒，找回 3 把小雨傘。",
    log_next: "從基隆港往東南走，就到九份的山城市集。",
    subject: "自然", units: [], count: null, level_range: [1, 2],
    hunt: { item: "umbrella", n: 3, monster: "wx_rain", map: "M47" },
    requires: ["Q_GOB_4"], reward: { exp: 0, gold: 100, item: "herb", light: null },
    dialog_start: "D_KL_1A", dialog_end: "D_KL_1B", dialog_locked: "D_KL_LOCK"
  },
  Q_JGS_1: {
    title: "礦車數一數", giver: "old_miner", map: "M48", kind: "help",
    goal: "從九份往東走到金瓜石，幫老礦工阿伯數礦車、分礦石：答對 3 題數學。",
    log_next: "回九份告訴外國商人：金包里漁港有大章魚擋住漁船！",   // 和 D_JGS_1B 番薯仔「快回九份，告訴外國商人吧！」一致（Q_MER_4 是商人給的）
    subject: "數學", units: ["4 乘法", "6 除法"], count: 3, level_range: [1, 3],
    hunt: null, requires: ["Q_MER_3"], reward: { exp: 0, gold: 100, item: null, light: null },
    dialog_start: "D_JGS_1A", dialog_end: "D_JGS_1B", dialog_locked: "D_JGS_LOCK"
  },
  Q_JGS_3: {
    title: "坑道深處的金光", giver: "old_miner", map: "M48", kind: "boss", side: true,
    goal: "走進金瓜石的坑道最深處，讓金脈鐵顎王清醒。",
    log_next: "坑道又安靜了。",
    subject: "混合", subjects: ["數學", "自然"],
    units: ["1 10000以內的數", "2 10000以內的加減", "3 毫米與數線", "4 乘法", "5 角與形狀", "6 除法", "7 公斤與公克", "8 分數", "9 列表與規律", "1 除法", "2 公升與毫升", "3 分數與加減", "4 圓", "5 兩步驟應用問題", "6 一位小數", "7 時間", "8 乘與除", "9 面積",
      "一、植物大發現", "二、磁鐵好好玩", "三、風與空氣", "四、奇妙的溶解", "一、快樂小農夫", "二、千變萬化的水", "三、天氣停看聽", "四、動物王國"], count: null, level_range: [2, 4],
    boss: "mnb_goldjaw", boss_map: "M48",
    hunt: null, requires: ["Q_JGS_1"], reward: { exp: 0, gold: 150, item: "crystal", light: null },
    dialog_start: "D_JGS_3A", dialog_end: "D_JGS_3B"
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
    log_next: "拿到自然之光！地精族住在台北北投西邊的紅樹林（台北章）。",
    subject: "自然", units: ["一、植物大發現", "二、磁鐵好好玩", "三、風與空氣", "四、奇妙的溶解", "一、快樂小農夫", "二、千變萬化的水", "三、天氣停看聽", "四、動物王國"], count: null, level_range: [2, 4],
    boss: "tree_king", boss_map: "M04",
    hunt: null, requires: ["Q_ELF_3"], reward: { exp: 0, gold: 100, item: null, light: "自然" },
    dialog_start: "D_ELF_4A", dialog_end: "D_ELF_4B"
  },

  // ═════════════════════ 山城市集・外國商人（M09，英語）═════════════════════
  Q_MER_1: {
    title: "聽不懂的招呼", giver: "merchant", map: "M09", kind: "help",
    goal: "從基隆港往東南走到九份的山城市集，幫外國商人和客人打招呼：答對 3 題英語。",
    log_next: "商人還有別的煩惱，再跟商人說話。",
    subject: "英語", units: ["Lesson 1 What's your name?（名字）", "Lesson 2 How old are you?（數字）"], count: 3, level_range: [1, 2],
    hunt: null, requires: ["Q_KL_1"], reward: { exp: 0, gold: 60, item: null, light: null },
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
    log_next: "商人說：金瓜石的老礦工知道大章魚的事。往東走到金瓜石。",
    subject: "英語", units: [], count: null, level_range: [1, 2],
    hunt: { item: "feather", n: 3, monster: "seagull", map: "M09" },
    requires: ["Q_MER_2"], reward: { exp: 0, gold: 60, item: "eraser", light: null },
    dialog_start: "D_MER_3A", dialog_end: "D_MER_3B"
  },
  Q_MER_4: {
    title: "漁港的迷霧章魚", giver: "merchant", map: "M09", kind: "boss",
    goal: "回金包里的磺火漁港，沿著碼頭木橋走到底，讓迷霧章魚清醒，拿回英語之光。",
    log_next: "拿到英語之光！去海風公園找里長伯點燈。",
    subject: "英語", units: ["Lesson 1 What's your name?（名字）", "Lesson 2 How old are you?（數字）", "Lesson 3 I'm short.（身材外貌）", "Lesson 4 Are you tired?（感覺）", "Lesson 1 Stationery（文具用品）", "Lesson 2 Colors（顏色）", "Review 1 Fun Things（有趣的事物）", "Lesson 3 Animal（動物）", "Lesson 4 Things you can do（能力）"], count: null, level_range: [2, 4],
    boss: "fog_octopus", boss_map: "M01",
    hunt: null, requires: ["Q_JGS_1"], reward: { exp: 0, gold: 100, item: null, light: "英語" },
    dialog_start: "D_MER_4A", dialog_end: "D_MER_4B", dialog_locked: "D_MER_4_LOCK"
  },

  // ═════════════════════ 紅樹林濕地・地精族（M05，數學）═════════════════════
  Q_GNO_1: {
    title: "材料秤一秤", giver: "gnome_chief", map: "M05", kind: "help",
    goal: "從北投往西走到關渡的紅樹林濕地，幫地精族長秤材料、量長度：答對 4 題數學。",
    log_next: "去找工坊旁邊的地精工匠。",
    subject: "數學", units: ["7 公斤與公克", "3 毫米與數線", "2 10000以內的加減"], count: 4, level_range: [2, 3],
    hunt: null, requires: ["Q_BT_2"], reward: { exp: 0, gold: 100, item: null, light: null },   // v1.3：原本 Q_ELF_4（62 號 4.3）
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
    log_next: "拿到數學之光！搭車回金包里，找里長伯點數學燈。",
    subject: "數學", units: ["1 10000以內的數", "2 10000以內的加減", "3 毫米與數線", "4 乘法", "5 角與形狀", "6 除法", "7 公斤與公克", "8 分數", "9 列表與規律", "1 除法", "2 公升與毫升", "3 分數與加減", "4 圓", "5 兩步驟應用問題", "6 一位小數", "7 時間", "8 乘與除", "9 面積"], count: null, level_range: [2, 4],
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
    hunt: null, requires: ["Q_TUT_3"], reward: { exp: 0, gold: 100, item: null, light: null },
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
    log_next: "拿到國語之光！野柳東邊的海岸公路，可以走到基隆港。",
    subject: "國語", units: ["第壹單元 運用時間", "第貳單元 解決問題", "第參單元 走進大自然", "第肆單元 美好的祝福", "第壹單元 人物組曲", "第貳單元 臺灣風景畫", "第參單元 生活小智慧", "第肆單元 奇幻故事屋"], count: null, level_range: [2, 4],
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
    subject: "社會", units: ["第一單元 升上三年級的新學習", "第二單元 校園規範和班級自治", "第三單元 我的校園和家庭生活", "第四單元 健康成長的快樂童年", "第五單元 打造更美好的班級", "第一單元 我居住的地方", "第二單元 多元的生活空間", "第三單元 生活中的各行各業", "第四單元 生活與工作的轉變", "第五單元 儲蓄與消費", "第六單元 小小街道觀察家"], count: null, level_range: [3, 4],
    boss: "angry_golem", boss_map: "M08",
    hunt: null, requires: ["Q_ORC_3"], reward: { exp: 0, gold: 200, item: null, light: "社會" },
    dialog_start: "D_ORC_4A", dialog_end: "D_ORC_4B"
  },

  // ═════════════════════ 主線收尾 ═════════════════════
  // v1.1 第一章章末（59 號 4.2、4.4、4.6 節）：只點國語、英語兩盞燈（game.js 只點 subjects 裡的燈；Q_LAMPS 才點五盞）。
  // chapter_end：完成後顯示「第一章 完成！」、記 state.chapter。要排在 Q_LAMPS 前面（同一位里長伯，forNpc 依資料順序）。
  Q_LAMPS_3: {
    title: "點亮兩盞知識燈", giver: "chief", map: "M01", kind: "help",
    goal: "回金包里，在海風公園的國語燈、英語燈前各答對 1 題，把燈點亮。",
    log_next: "第一章完成！見習 10 級、通過立志小考，就可以到金包里慈護宮轉職。",
    subject: "混合", subjects: ["國語", "英語"], units: [], count: 2, level_range: [1, 2],
    hunt: null, requires: ["Q_GOB_4", "Q_MER_4"], requires_lights: ["國語", "英語"],
    reward: { exp: 0, gold: 150, item: "guide", light: null }, chapter_end: 1,
    dialog_start: "D_LAMPS3_A", dialog_end: "D_LAMPS3_B", dialog_locked: "D_CHIEF_IDLE"
  },
  // v1.3 台北章章末（62 號 4.2、4.4）：拿到數學之光後回金包里點數學燈（只點數學燈，59 號 4.6 ① 的點燈程式）。要排在 Q_LAMPS 前面（同一位里長伯）
  Q_LAMPS_MATH: {
    title: "點亮數學燈", giver: "chief", map: "M01", kind: "help",
    goal: "搭車回金包里，在海風公園的數學燈前答對 1 題，把燈點亮。",
    log_next: "台北章完成！三盞燈亮了。",
    subject: "混合", subjects: ["數學"], units: [], count: 1, level_range: [1, 2],
    hunt: null, requires: ["Q_GNO_4"], requires_lights: ["數學"], reward: { exp: 0, gold: 150, item: "guide", light: null }, chapter_end: 3,
    dialog_start: "D_LAMPS_MATH_A", dialog_end: "D_LAMPS_MATH_B", dialog_locked: "D_CHIEF_IDLE"
  },
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

  // ═════════════════════ v1.2 第二章：草嶺古道、頭城礁溪、三星、蘇澳南方澳（61 號 4.1、4.2 節）═════════════════════
  // 主線：（第一章 Q_LAMPS_3）→ Q_CL_1 → Q_YL_1 → Q_YL_2（打獵）→ Q_YL_3 → Q_YL_4 → Q_YL_5 黏黏雨雲王（chapter_end: 2，第二章完成；不給光）
  // 支線：Q_YL_SNOW、Q_YL_TURTLE、Q_YL_OPERA、Q_YL_FISH（前置都是 Q_CL_1）。主線排在支線前面（漁港阿伯先給 Q_YL_5，forNpc 依資料順序）
  Q_CL_1: {
    title: "虎字碑的字", giver: "trail_volunteer", map: "M49", kind: "help",
    goal: "從金瓜石往東南走上草嶺古道，聽志工阿伯說虎字碑的故事：答對 3 題國語。",
    log_next: "走下古道就是宜蘭的頭城礁溪。",
    subject: "國語", units: ["第貳單元 臺灣風景畫", "第參單元 走進大自然"], count: 3, level_range: [2, 3],
    hunt: null, requires: ["Q_LAMPS_3"], reward: { exp: 0, gold: 120, item: null, light: null },
    dialog_start: "D_CL_1A", dialog_end: "D_CL_1B", dialog_locked: "D_CL_1_LOCK"
  },
  Q_YL_1: {
    title: "雨下不停", giver: "kumquat_farmer", map: "M14", kind: "help",
    goal: "走下古道到頭城礁溪，幫金棗農阿伯看天氣：答對 3 題自然。",
    log_next: "金棗園外有金棗彈彈在亂跳，再跟阿伯說話。",
    subject: "自然", units: ["三、天氣停看聽"], count: 3, level_range: [2, 3],
    hunt: null, requires: ["Q_CL_1"], reward: { exp: 0, gold: 120, item: null, light: null },
    dialog_start: "D_YL_1A", dialog_end: "D_YL_1B", dialog_locked: "D_YL_1_LOCK"
  },
  Q_YL_2: {
    title: "金棗被搶走了", giver: "kumquat_farmer", map: "M14", kind: "hunt",
    goal: "讓金棗園外的金棗彈彈清醒，找回 3 顆金棗。",
    log_next: "往南走到三星，蔥田需要幫忙。",
    subject: "數學", units: [], count: null, level_range: [2, 3],
    hunt: { item: "kumquat", n: 3, monster: "ly_kumquat", map: "M14" },
    requires: ["Q_YL_1"], reward: { exp: 0, gold: 130, item: "herb", light: null },
    dialog_start: "D_YL_2A", dialog_end: "D_YL_2B"
  },
  Q_YL_3: {
    title: "三星蔥收成", giver: "scallion_farmer", map: "M50", kind: "help",
    goal: "往南走到三星，幫蔥農阿伯算蔥、綁蔥：答對 3 題數學。",
    log_next: "再往南就是蘇澳。",
    subject: "數學", units: ["4 乘法", "6 除法"], count: 3, level_range: [2, 3],
    hunt: null, requires: ["Q_YL_2"], reward: { exp: 0, gold: 130, item: null, light: null },
    dialog_start: "D_YL_3A", dialog_end: "D_YL_3B", dialog_locked: "D_YL_3_LOCK"
  },
  Q_YL_4: {
    title: "冷泉為什麼是冷的", giver: "coldspring_keeper", map: "M51", kind: "help",
    goal: "再往南到蘇澳，聽冷泉管理員說冷泉的祕密：答對 3 題自然。",
    log_next: "去南方澳漁港找漁港阿伯，堤防盡頭的雨雲黏住不走！",
    subject: "自然", units: ["四、奇妙的溶解", "二、千變萬化的水"], count: 3, level_range: [2, 3],
    hunt: null, requires: ["Q_YL_3"], reward: { exp: 0, gold: 140, item: "guide", light: null },
    dialog_start: "D_YL_4A", dialog_end: "D_YL_4B", dialog_locked: "D_YL_4_LOCK"
  },
  // chapter_end: 2：完成後橫幅「第二章 完成！」＋旁白 D_CH2_END（還沒轉職、見習已到 10 級再加 D_CH2_JOB_HINT），記 state.chapter = 2
  Q_YL_5: {
    title: "黏黏雨雲王", giver: "sa_fisher", map: "M51", kind: "boss",
    goal: "走到南方澳漁港的堤防盡頭，讓黏住天空的黏黏雨雲王清醒。",
    log_next: "第二章完成！搭車回頭城礁溪，從頭城礁溪往西走，就到坪林了。",
    subject: "自然", units: ["一、植物大發現", "二、磁鐵好好玩", "三、風與空氣", "四、奇妙的溶解", "一、快樂小農夫", "二、千變萬化的水", "三、天氣停看聽", "四、動物王國"], count: null, level_range: [2, 4],
    boss: "wxb_raincloud", boss_map: "M51",
    hunt: null, requires: ["Q_YL_4"], reward: { exp: 0, gold: 200, item: null, light: null }, chapter_end: 2,
    dialog_start: "D_YL_5A", dialog_end: "D_YL_5B", dialog_locked: "D_YL_5_LOCK"
  },
  Q_YL_SNOW: {
    title: "雪山隧道有多長", giver: "bus_driver", map: "M14", kind: "help", side: true,
    goal: "聽頭城礁溪站的客運司機說雪山隧道：答對 2 題社會。",
    log_next: "司機說：雪山隧道在坪林和頭城之間，長 12.9 公里。",
    subject: "社會", units: ["第二單元 多元的生活空間"], count: 2, level_range: [1, 3],
    hunt: null, requires: ["Q_CL_1"], reward: { exp: 0, gold: 80, item: null, light: null },
    dialog_start: "D_YL_SNOW_A", dialog_end: "D_YL_SNOW_B", dialog_locked: "D_YL_SNOW_LOCK"
  },
  Q_YL_TURTLE: {
    title: "海上的龜山島", giver: "levee_uncle", map: "M14", kind: "help", side: true,
    goal: "在東邊海堤上看龜山島，回答海堤阿伯的問題：答對 2 題社會。",
    log_next: "龜山島在頭城外海大約 10 公里，是一座火山島。",
    subject: "社會", units: ["第一單元 我居住的地方"], count: 2, level_range: [1, 3],
    hunt: null, requires: ["Q_CL_1"], reward: { exp: 0, gold: 80, item: null, light: null },
    dialog_start: "D_YL_TURTLE_A", dialog_end: "D_YL_TURTLE_B", dialog_locked: "D_YL_TURTLE_LOCK"
  },
  Q_YL_OPERA: {
    title: "歌仔戲的故鄉", giver: "opera_actor", map: "M50", kind: "help", side: true,
    goal: "幫戲台上的歌仔戲演員對台詞：答對 3 題國語。",
    log_next: "演員說：縣志記載，歌仔戲是從宜蘭員山開始的。",
    subject: "國語", units: ["第肆單元 奇幻故事屋", "第壹單元 人物組曲"], count: 3, level_range: [1, 3],
    hunt: null, requires: ["Q_CL_1"], reward: { exp: 0, gold: 90, item: null, light: null },
    dialog_start: "D_YL_OPERA_A", dialog_end: "D_YL_OPERA_B", dialog_locked: "D_YL_OPERA_LOCK"
  },
  Q_YL_FISH: {
    title: "鯖魚數一數", giver: "sa_fisher", map: "M51", kind: "help", side: true,
    goal: "幫漁港阿伯數鯖魚、分魚箱：答對 3 題數學。",
    log_next: "阿伯說：南方澳的鯖魚節，從 1997 年就開始辦了。",
    subject: "數學", units: ["4 乘法", "9 列表與規律"], count: 3, level_range: [2, 3],
    hunt: null, requires: ["Q_CL_1"], reward: { exp: 0, gold: 100, item: "snack", light: null },
    dialog_start: "D_YL_FISH_A", dialog_end: "D_YL_FISH_B", dialog_locked: "D_YL_FISH_LOCK"
  },

  // ═════════════════════ v1.3 台北章：坪林、木柵貓空、台北城、北投關渡、信義（62 號 4.1、4.2 節）═════════════════════
  // 主線：（第二章 Q_YL_5）→ Q_PL_1 → Q_PL_2（打獵）→ Q_MK_1（打獵）→ Q_MK_2 → Q_TPC_1 → Q_BT_1 → Q_BT_2 → 紅樹林 Q_GNO_1～4 → 金包里 Q_LAMPS_MATH（chapter_end: 3）
  // 支線：Q_TPC_2、Q_TPC_3、Q_XY_1、Q_XY_2（前置都是 Q_YL_5）。轉職：行天宮、指南宮（jobs.js JOB_RULES.places，不是委託）
  Q_PL_1: {
    title: "包種茶鄉", giver: "tea_farmer", map: "M52", kind: "help",
    goal: "從頭城礁溪往西走到坪林，幫茶農阿伯照顧茶園：答對 3 題自然。",
    log_next: "茶寮旁的焙籠火狸把茶葉搶走了，再跟阿伯說話。",
    subject: "自然", units: ["一、快樂小農夫", "一、植物大發現"], count: 3, level_range: [2, 3],
    hunt: null, requires: ["Q_YL_5"], reward: { exp: 0, gold: 140, item: null, light: null },
    dialog_start: "D_PL_1A", dialog_end: "D_PL_1B", dialog_locked: "D_PL_1_LOCK"
  },
  Q_PL_2: {
    title: "焙茶籠的茶葉", giver: "tea_farmer", map: "M52", kind: "hunt",
    goal: "讓茶寮旁的焙籠火狸清醒，找回 3 包茶葉。",
    log_next: "往西走，就是木柵、貓空。",
    subject: "社會", units: [], count: null, level_range: [2, 3],
    hunt: { item: "tea_leaf", n: 3, monster: "tea_basket", map: "M52" },
    requires: ["Q_PL_1"], reward: { exp: 0, gold: 140, item: "herb", light: null },
    dialog_start: "D_PL_2A", dialog_end: "D_PL_2B"
  },
  Q_MK_1: {
    title: "纜車票不見了", giver: "gondola_staff", map: "M13", kind: "hunt",
    goal: "往西走到貓空，讓茶園步道的鈴鈴鬧鐘兵清醒，找回 3 張纜車票。",
    log_next: "站務員說：山上的茶農阿伯在找人幫忙。",
    subject: "數學", units: [], count: null, level_range: [2, 3],
    hunt: { item: "ticket", n: 3, monster: "mc_alarm", map: "M13" },
    requires: ["Q_PL_2"], reward: { exp: 0, gold: 150, item: null, light: null },
    dialog_start: "D_MK_1A", dialog_end: "D_MK_1B", dialog_locked: "D_MK_1_LOCK"
  },
  Q_MK_2: {
    title: "鐵觀音茶園", giver: "tea_farmer_mk", map: "M13", kind: "help",
    goal: "幫貓空的茶農阿伯秤茶葉、分茶包：答對 3 題數學。",
    log_next: "往北下山，就是台北城。",
    subject: "數學", units: ["7 公斤與公克", "8 分數"], count: 3, level_range: [2, 3],
    hunt: null, requires: ["Q_MK_1"], reward: { exp: 0, gold: 140, item: "guide", light: null },
    dialog_start: "D_MK_2A", dialog_end: "D_MK_2B", dialog_locked: "D_MK_2_LOCK"
  },
  Q_TPC_1: {
    title: "迪化街買年貨", giver: "dihua_shop", map: "M12", kind: "help",
    goal: "下山到台北城，幫大稻埕的南北貨店老闆算帳：答對 3 題數學。",
    log_next: "往北走到北投，那裡有冒白煙的地熱谷。",
    subject: "數學", units: ["5 兩步驟應用問題", "2 10000以內的加減"], count: 3, level_range: [2, 3],
    hunt: null, requires: ["Q_MK_2"], reward: { exp: 0, gold: 150, item: null, light: null },
    dialog_start: "D_TPC_1A", dialog_end: "D_TPC_1B", dialog_locked: "D_TPC_1_LOCK"
  },
  Q_BT_1: {
    title: "溫泉博物館", giver: "bt_museum_guide", map: "M53", kind: "help",
    goal: "從台北城往北走到北投，聽解說員說老浴場的故事：答對 3 題社會。",
    log_next: "去地熱谷找巡守員。",
    subject: "社會", units: ["第四單元 生活與工作的轉變", "第二單元 多元的生活空間"], count: 3, level_range: [2, 3],
    hunt: null, requires: ["Q_TPC_1"], reward: { exp: 0, gold: 150, item: null, light: null },
    dialog_start: "D_BT_1A", dialog_end: "D_BT_1B", dialog_locked: "D_BT_1_LOCK"
  },
  Q_BT_2: {
    title: "地熱谷不能碰", giver: "geo_ranger", map: "M53", kind: "help",
    goal: "幫巡守員提醒遊客：地熱谷的水很燙、不能碰。答對 3 題自然。",
    log_next: "往西走到關渡的紅樹林，地精族需要幫忙。",
    subject: "自然", units: ["四、奇妙的溶解", "二、千變萬化的水"], count: 3, level_range: [2, 3],
    hunt: null, requires: ["Q_BT_1"], reward: { exp: 0, gold: 150, item: "snack", light: null },
    dialog_start: "D_BT_2A", dialog_end: "D_BT_2B", dialog_locked: "D_BT_2_LOCK"
  },
  Q_TPC_2: {
    title: "北門的故事", giver: "culture_guide", map: "M12", kind: "help", side: true,
    goal: "聽文史解說員說北門：答對 2 題社會。",
    log_next: "北門是光緒 10 年（1884 年）完成的。",
    subject: "社會", units: ["第一單元 我居住的地方"], count: 2, level_range: [1, 3],
    hunt: null, requires: ["Q_YL_5"], reward: { exp: 0, gold: 100, item: null, light: null },
    dialog_start: "D_TPC_2A", dialog_end: "D_TPC_2B", dialog_locked: "D_TPC_2_LOCK"
  },
  Q_TPC_3: {
    title: "亂閃的紅綠燈", giver: "traffic_volunteer", map: "M12", kind: "help", side: true,
    goal: "幫交通志工阿伯讓路口恢復正常：答對 3 題社會。",
    log_next: "阿伯說：過馬路要看燈號、走斑馬線。",
    subject: "社會", units: ["第六單元 小小街道觀察家"], count: 3, level_range: [1, 3],
    hunt: null, requires: ["Q_YL_5"], reward: { exp: 0, gold: 100, item: null, light: null },
    dialog_start: "D_TPC_3A", dialog_end: "D_TPC_3B", dialog_locked: "D_TPC_3_LOCK"
  },
  Q_XY_1: {
    title: "508 有幾個百", giver: "observatory_staff", map: "M54", kind: "help", side: true,
    goal: "往東走到信義，回答觀景台服務員的數字問題：答對 3 題數學。",
    log_next: "臺北101 總高度 508 公尺。",
    subject: "數學", units: ["1 10000以內的數", "2 10000以內的加減"], count: 3, level_range: [2, 3],
    hunt: null, requires: ["Q_YL_5"], reward: { exp: 0, gold: 120, item: null, light: null },
    dialog_start: "D_XY_1A", dialog_end: "D_XY_1B", dialog_locked: "D_XY_1_LOCK"
  },
  Q_XY_2: {
    title: "臺北第一個眷村", giver: "village_guide", map: "M54", kind: "help", side: true,
    goal: "聽解說員說四四南村的故事：答對 2 題社會。",
    log_next: "四四南村是臺北地區的第一個眷村。",
    subject: "社會", units: ["第四單元 生活與工作的轉變"], count: 2, level_range: [1, 3],
    hunt: null, requires: ["Q_YL_5"], reward: { exp: 0, gold: 100, item: null, light: null },
    dialog_start: "D_XY_2A", dialog_end: "D_XY_2B", dialog_locked: "D_XY_2_LOCK"
  },
  // ═════════════════════ 村民委託（支線，散佈各圖）═════════════════════
  Q_SIDE_BOOK: {
    title: "書架亂糟糟", giver: "bookstore", map: "M01", kind: "help",
    goal: "幫海風圖書館的阿伯整理書架：答對 3 題國語。",
    log_next: "圖書館阿伯說：不會的題目，提示會告訴你課本哪裡有教。",
    subject: "國語", units: ["第壹單元 運用時間", "第貳單元 解決問題"], count: 3, level_range: [1, 2],
    hunt: null, requires: ["Q_TUT_1"], reward: { exp: 0, gold: 30, item: "guide", light: null },
    dialog_start: "D_BOOK_A", dialog_end: "D_BOOK_B"
  },
  // v1.1 第一章支線（59 號 4.2 節）
  Q_N1_TIDE: {
    title: "等退潮再跳過去", giver: "seaweed_uncle", map: "M01", kind: "help", side: true,
    goal: "在金包里北邊的跳石海岸，幫撿海菜的阿伯看天氣、等退潮：答對 3 題自然。",
    log_next: "阿伯說：退潮的時候才可以去跳石頭，要注意安全。",
    subject: "自然", units: ["三、天氣停看聽", "二、千變萬化的水"], count: 3, level_range: [1, 2],
    hunt: null, requires: ["Q_TUT_1"], reward: { exp: 0, gold: 40, item: "herb", light: null },
    dialog_start: "D_TIDE_A", dialog_end: "D_TIDE_B"
  },
  Q_N1_BUFFALO: {
    title: "和水牛保持 20 公尺", giver: "park_ranger", map: "M02", kind: "help", side: true,
    goal: "幫擎天草原的解說員提醒遊客：野生的水牛要保持 20 公尺。答對 2 題自然。",
    log_next: "解說員說：看到水牛，記得保持 20 公尺。",
    subject: "自然", units: ["四、動物王國"], count: 2, level_range: [1, 2],
    hunt: null, requires: ["Q_TUT_3"], reward: { exp: 0, gold: 40, item: null, light: null },
    dialog_start: "D_BUFFALO_A", dialog_end: "D_BUFFALO_B"
  },
  Q_KL_2: {
    title: "夜市的一碗鼎邊銼", giver: "stall_keeper", map: "M47", kind: "help", side: true,
    goal: "幫廟口夜市的攤販阿伯算帳、招呼客人：答對 3 題社會。",
    log_next: "攤販阿伯說：鷄籠中元祭是基隆很重要的民俗喔。",
    subject: "社會", units: ["第三單元 生活中的各行各業", "第五單元 儲蓄與消費"], count: 3, level_range: [1, 2],
    hunt: null, requires: ["Q_TUT_3"], reward: { exp: 0, gold: 80, item: "snack", light: null },
    dialog_start: "D_KL_2A", dialog_end: "D_KL_2B"
  },
  Q_JGS_2: {
    title: "基隆山的另一個名字", giver: "museum_guide", map: "M48", kind: "help", side: true,
    goal: "聽博物館解說員介紹金瓜石和基隆山：答對 3 題社會。",
    log_next: "解說員說：基隆山又叫大肚美人山，但和金山人說的『美人山』不一樣喔。",
    subject: "社會", units: ["第二單元 多元的生活空間", "第一單元 我居住的地方"], count: 3, level_range: [1, 2],
    hunt: null, requires: ["Q_TUT_3"], reward: { exp: 0, gold: 80, item: "guide", light: null },
    dialog_start: "D_JGS_2A", dialog_end: "D_JGS_2B"
  },
  Q_SIDE_POTATO: {
    title: "烤地瓜秤一秤", giver: "potato_seller", map: "M02", kind: "help",
    goal: "幫擎天草原步道口賣地瓜的阿伯秤重、數數：答對 3 題數學。",
    log_next: "阿伯送你番薯仔點心。",
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
    goal: "幫山城的芋圓店老闆把芋圓平分到每一碗：答對 3 題數學。",
    log_next: "芋圓店老闆說：你真聰明，有空再來吃芋圓。",
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
