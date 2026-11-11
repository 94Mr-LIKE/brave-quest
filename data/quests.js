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
 * v2.0 新經濟（67 號第二節第 5、6 項）：委託、寶箱答題不再給經驗值和金幣；reward.exp、reward.gold＝這一區「8 場經驗、20 場金幣」平均分到每個委託和每張圖的寶箱
 *   （wip_v20/v20_0_econ_apply.js 照規則算；頭目委託另外有頭目本身的經驗值）。
 */
window.QUESTS = {
  // v4.1 中橫・南投：Z13 共 16 步，每個委託 120 經驗、81 金幣；寶箱分掉另兩步。
  Q_CH_1: {
    "title": "山路要加雪鏈",
    "giver": "road_engineer_cc",
    "map": "M30",
    "kind": "help",
    "goal": "從花蓮往西進中橫，聽工程員說結冰的山路要加雪鏈：答對 2 題自然。",
    "log_next": "山莊管理員說：雪地裡有雪球寶寶在打轉。",
    "subject": "自然",
    "units": [
      "三、天氣停看聽"
    ],
    "count": 2,
    "level_range": [
      2,
      3
    ],
    "hunt": null,
    "requires": [
      "Q_HL_3"
    ],
    "reward": {
      "exp": 120,
      "gold": 81,
      "item": null,
      "light": null
    },
    "dialog_start": "D_CH_1A",
    "dialog_end": "D_CH_1B"
  },
  Q_CH_5: {
    "title": "雪花結晶",
    "giver": "lodge_keeper_hh",
    "map": "M30",
    "kind": "hunt",
    "goal": "讓雪地裡打轉的雪球寶寶清醒，帶回 3 片雪花結晶。",
    "log_next": "再往上爬，就到武嶺了。",
    "subject": "英語",
    "units": [],
    "count": null,
    "level_range": [
      2,
      3
    ],
    "hunt": {
      "item": "snow_crystal",
      "n": 3,
      "monster": "wx_snow",
      "map": "M30"
    },
    "requires": [
      "Q_CH_1"
    ],
    "reward": {
      "exp": 120,
      "gold": 81,
      "item": "herb",
      "light": null
    },
    "dialog_start": "D_CH_5A",
    "dialog_end": "D_CH_5B"
  },
  Q_CH_4: {
    "title": "臺灣公路最高的地方",
    "giver": "wuling_guide",
    "map": "M30",
    "kind": "help",
    "goal": "爬到武嶺，聽解說員說這裡有多高：答對 2 題數學。",
    "log_next": "到武嶺了！解說員說：下山往埔里，那裡是臺灣的中心。",
    "subject": "數學",
    "units": [
      "1 10000以內的數"
    ],
    "count": 2,
    "level_range": [
      2,
      3
    ],
    "hunt": null,
    "requires": [
      "Q_CH_5"
    ],
    "reward": {
      "exp": 120,
      "gold": 81,
      "item": null,
      "light": null
    },
    "dialog_start": "D_CH_4A",
    "dialog_end": "D_CH_4B"
  },
  Q_CH_2: {
    "title": "高山上的高麗菜",
    "giver": "veg_farmer",
    "map": "M30",
    "kind": "help",
    "side": true,
    "goal": "聽蔬菜農說高麗菜為什麼喜歡涼涼的山上：答對 2 題自然。",
    "log_next": "蔬菜農說：高麗菜喜歡涼涼的天氣。",
    "subject": "自然",
    "units": [
      "一、快樂小農夫"
    ],
    "count": 2,
    "level_range": [
      2,
      3
    ],
    "hunt": null,
    "requires": [
      "Q_CH_1"
    ],
    "reward": {
      "exp": 120,
      "gold": 81,
      "item": null,
      "light": null
    },
    "dialog_start": "D_CH_2A",
    "dialog_end": "D_CH_2B"
  },
  Q_CH_3: {
    "title": "穿過大山的公路",
    "giver": "road_veteran",
    "map": "M30",
    "kind": "help",
    "side": true,
    "goal": "聽老工班阿伯說以前開這條公路的故事：答對 2 題社會。",
    "log_next": "阿伯說：這條公路，是以前的人一點一點開出來的。",
    "subject": "社會",
    "units": [
      "第四單元 生活與工作的轉變"
    ],
    "count": 2,
    "level_range": [
      2,
      3
    ],
    "hunt": null,
    "requires": [
      "Q_CH_1"
    ],
    "reward": {
      "exp": 120,
      "gold": 81,
      "item": null,
      "light": null
    },
    "dialog_start": "D_CH_3A",
    "dialog_end": "D_CH_3B"
  },
  Q_PU_2: {
    "title": "臺灣的中心",
    "giver": "center_volunteer",
    "map": "M31",
    "kind": "help",
    "goal": "到埔里的地理中心碑，聽志工說三角點：答對 2 題社會。",
    "log_next": "霧仔：四片碎片在發光……先到虎子山頂看看！",
    "subject": "社會",
    "units": [
      "第一單元 我居住的地方"
    ],
    "count": 2,
    "level_range": [
      2,
      3
    ],
    "hunt": null,
    "requires": [
      "Q_CH_4"
    ],
    "reward": {
      "exp": 120,
      "gold": 81,
      "item": null,
      "light": null
    },
    "dialog_start": "D_PUL_2A",
    "dialog_end": "D_PUL_2B"
  },
  Q_PU_1: {
    "title": "曙光羅盤",
    "giver": "dawn_ring_pu",
    "map": "M31",
    "kind": "help",
    "goal": "帶著四片曙光碎片爬上虎子山頂，五科各答對 1 題，做出曙光羅盤。",
    "log_next": "四片碎片合成了曙光羅盤！指針指向玉山。往南經過溪頭。",
    "subject": "混合",
    "subjects": [
      "國語",
      "英語",
      "數學",
      "自然",
      "社會"
    ],
    "units": [
      "第參單元 走進大自然",
      "第貳單元 解決問題",
      "第肆單元 美好的祝福",
      "第壹單元 運用時間",
      "Lesson 2 How old are you?（數字）",
      "Lesson 1 What's your name?（名字）",
      "Lesson 4 Are you tired?（感覺）",
      "Lesson 3 I'm short.（身材外貌）",
      "1 10000以內的數",
      "5 角與形狀",
      "3 毫米與數線",
      "7 公斤與公克",
      "2 10000以內的加減",
      "8 分數",
      "9 列表與規律",
      "4 乘法",
      "6 除法",
      "二、磁鐵好好玩",
      "一、植物大發現",
      "三、風與空氣",
      "四、奇妙的溶解",
      "第四單元 健康成長的快樂童年",
      "第二單元 校園規範和班級自治",
      "第三單元 我的校園和家庭生活",
      "第一單元 升上三年級的新學習",
      "第五單元 打造更美好的班級",
      "第壹單元 人物組曲",
      "第貳單元 臺灣風景畫",
      "愛閱讀一 熱愛昆蟲的法布爾",
      "第參單元 生活小智慧",
      "第肆單元 奇幻故事屋",
      "愛閱讀二 巨人傳說",
      "愛閱讀一 靈光一現",
      "愛閱讀二 老鼠嫁女兒",
      "Lesson 1 Stationery（文具用品）",
      "Lesson 2 Colors（顏色）",
      "Review 1 Fun Things（有趣的事物）",
      "Lesson 3 Animal（動物）",
      "Lesson 4 Things you can do（能力）",
      "Get Ready（開學預備）",
      "1 除法",
      "2 公升與毫升",
      "3 分數與加減",
      "4 圓",
      "5 兩步驟應用問題",
      "6 一位小數",
      "7 時間",
      "8 乘與除",
      "9 面積",
      "一、快樂小農夫",
      "二、千變萬化的水",
      "三、天氣停看聽",
      "四、動物王國",
      "第一單元 我居住的地方",
      "第二單元 多元的生活空間",
      "第三單元 生活中的各行各業",
      "第四單元 生活與工作的轉變",
      "第五單元 儲蓄與消費",
      "第六單元 小小街道觀察家"
    ],
    "count": 5,
    "level_range": [
      2,
      3
    ],
    "hunt": null,
    "requires": [
      "Q_PU_2"
    ],
    "reward": {
      "exp": 120,
      "gold": 81,
      "item": "dawn_compass",
      "light": null
    },
    "dialog_start": "D_PUL_1A",
    "dialog_end": "D_PUL_1B"
  },
  Q_PU_3: {
    "title": "手工造紙",
    "giver": "paper_master",
    "map": "M31",
    "kind": "help",
    "side": true,
    "goal": "聽紙寮師傅說手工造紙的老手藝：答對 2 題社會。",
    "log_next": "師傅說：老手藝要有人學，才不會不見。",
    "subject": "社會",
    "units": [
      "第三單元 生活中的各行各業"
    ],
    "count": 2,
    "level_range": [
      2,
      3
    ],
    "hunt": null,
    "requires": [
      "Q_PU_2"
    ],
    "reward": {
      "exp": 120,
      "gold": 81,
      "item": null,
      "light": null
    },
    "dialog_start": "D_PUL_3A",
    "dialog_end": "D_PUL_3B"
  },
  Q_PU_4: {
    "title": "美人腿",
    "giver": "jiaobai_farmer",
    "map": "M31",
    "kind": "help",
    "side": true,
    "goal": "聽茭白筍農說為什麼茭白筍叫美人腿：答對 2 題自然。",
    "log_next": "茭白筍白白的，大家叫它「美人腿」。",
    "subject": "自然",
    "units": [
      "一、快樂小農夫"
    ],
    "count": 2,
    "level_range": [
      2,
      3
    ],
    "hunt": null,
    "requires": [
      "Q_PU_2"
    ],
    "reward": {
      "exp": 120,
      "gold": 81,
      "item": null,
      "light": null
    },
    "dialog_start": "D_PUL_4A",
    "dialog_end": "D_PUL_4B"
  },
  Q_XT_1: {
    "title": "大學池",
    "giver": "forest_guide_xt",
    "map": "M32",
    "kind": "help",
    "goal": "從埔里往南到溪頭，跟解說員到大學池：答對 2 題自然。",
    "log_next": "燈籠店老闆說：一路上的鬼怪都迷路了。",
    "subject": "自然",
    "units": [
      "一、植物大發現"
    ],
    "count": 2,
    "level_range": [
      2,
      3
    ],
    "hunt": null,
    "requires": [
      "Q_PU_1"
    ],
    "reward": {
      "exp": 120,
      "gold": 81,
      "item": null,
      "light": null
    },
    "dialog_start": "D_XT_1A",
    "dialog_end": "D_XT_1B"
  },
  Q_XT_2: {
    "title": "送鬼怪回家",
    "giver": "lantern_shop",
    "map": "M32",
    "kind": "help",
    "goal": "把一路上遇到的鬼怪故事排好，送牠們回家：答對 3 題國語。",
    "log_next": "可是燈籠被偷走了！林間夜路有白鼻心。",
    "subject": "國語",
    "units": [
      "第肆單元 奇幻故事屋"
    ],
    "count": 3,
    "level_range": [
      2,
      3
    ],
    "hunt": null,
    "requires": [
      "Q_XT_1"
    ],
    "reward": {
      "exp": 120,
      "gold": 81,
      "item": null,
      "light": null
    },
    "dialog_start": "D_XT_2A",
    "dialog_end": "D_XT_2B"
  },
  Q_XT_3: {
    "title": "被偷走的燈籠",
    "giver": "lantern_shop",
    "map": "M32",
    "kind": "hunt",
    "goal": "讓林間夜路的森林夜遊白鼻心清醒，拿回 3 盞小燈籠。",
    "log_next": "把燈籠藏起來的是夜遊團長！去廣場找牠。",
    "subject": "社會",
    "units": [],
    "count": null,
    "level_range": [
      2,
      3
    ],
    "hunt": {
      "item": "small_lantern",
      "n": 3,
      "monster": "gh_civet_f",
      "map": "M32"
    },
    "requires": [
      "Q_XT_2"
    ],
    "reward": {
      "exp": 120,
      "gold": 81,
      "item": "herb",
      "light": null
    },
    "dialog_start": "D_XT_3A",
    "dialog_end": "D_XT_3B"
  },
  Q_XT_4: {
    "title": "中橫頭目：夜遊團長",
    "giver": "lantern_shop",
    "map": "M32",
    "kind": "boss",
    "goal": "讓把燈籠藏起來的夜遊團長清醒。",
    "log_next": "夜遊團長清醒了，送你一盞森林燈籠。往塔塔加的山路亮起來了。",
    "subject": "混合",
    "subjects": [
      "國語",
      "自然"
    ],
    "units": [
      "第參單元 走進大自然",
      "第貳單元 解決問題",
      "第肆單元 美好的祝福",
      "第壹單元 運用時間",
      "二、磁鐵好好玩",
      "一、植物大發現",
      "三、風與空氣",
      "四、奇妙的溶解",
      "第壹單元 人物組曲",
      "第貳單元 臺灣風景畫",
      "愛閱讀一 熱愛昆蟲的法布爾",
      "第參單元 生活小智慧",
      "第肆單元 奇幻故事屋",
      "愛閱讀二 巨人傳說",
      "愛閱讀一 靈光一現",
      "愛閱讀二 老鼠嫁女兒",
      "一、快樂小農夫",
      "二、千變萬化的水",
      "三、天氣停看聽",
      "四、動物王國"
    ],
    "count": null,
    "level_range": [
      2,
      4
    ],
    "hunt": null,
    "boss": "ghb_civetboss",
    "boss_map": "M32",
    "requires": [
      "Q_XT_3"
    ],
    "reward": {
      "exp": 120,
      "gold": 81,
      "item": "forest_lantern",
      "light": null
    },
    "dialog_start": "D_XT_4A",
    "dialog_end": "D_XT_4B"
  },
  Q_XT_5: {
    "title": "凍頂烏龍茶",
    "giver": "tea_farmer_lg",
    "map": "M32",
    "kind": "help",
    "side": true,
    "goal": "聽鹿谷茶農說凍頂烏龍茶：答對 2 題社會。",
    "log_next": "茶農說：凍頂茶原本種在鹿谷的山上。",
    "subject": "社會",
    "units": [
      "第二單元 多元的生活空間"
    ],
    "count": 2,
    "level_range": [
      2,
      3
    ],
    "hunt": null,
    "requires": [
      "Q_XT_1"
    ],
    "reward": {
      "exp": 120,
      "gold": 81,
      "item": null,
      "light": null
    },
    "dialog_start": "D_XT_5A",
    "dialog_end": "D_XT_5B"
  },

  // ═════════════════════ 金包里教學（M01）═════════════════════
  Q_TUT_1: {
    title: "燈座上的字", giver: "chief", map: "M01", kind: "help",
    goal: "在金包里慈護宮廟埕找里長伯，幫忙讀海風公園燈座上的字：答對 2 題國語。",
    log_next: "去金包里東北邊的磺火漁港，找漁夫阿伯。",
    teaches: ["移動", "對話", "答題", "提示"],
    subject: "國語", units: ["第參單元 走進大自然"], count: 2, level_range: [1, 1],
    hunt: null, requires: [], reward: { exp: 3, gold: 5, item: "herb", light: null },
    dialog_start: "D_TUT_1A", dialog_end: "D_TUT_1B"
  },
  Q_TUT_2: {
    title: "漁夫阿伯算魚錢", giver: "fisher", map: "M01", kind: "help",
    goal: "幫漁夫阿伯算魚錢、找零錢：答對 3 題數學。",
    log_next: "拿金幣去老街的雜貨店買木劍或皮衣。再去溫泉旁找旅館老闆。",
    teaches: ["商店"],
    subject: "數學", units: ["1 10000以內的數", "2 10000以內的加減"], count: 3, level_range: [1, 2],
    hunt: null, requires: ["Q_TUT_1"], reward: { exp: 3, gold: 5, item: null, light: null },
    dialog_start: "D_TUT_2A", dialog_end: "D_TUT_2B"
  },
  Q_TUT_3: {
    title: "黏黏球補窗戶", giver: "innkeeper", map: "M01", kind: "hunt",
    goal: "從金包里往南走到擎天草原，讓迷糊團子清醒，帶回 2 顆黏黏球。",
    log_next: "往西到硫磺谷、竹子湖；往東是野柳。",   // v1.1 審查：任務日誌一句 30 字內
    teaches: ["戰鬥", "旅店", "世界地圖"],
    subject: "數學", units: [], count: null, level_range: [1, 1],
    hunt: { item: "sticky_ball", n: 2, monster: "dango", map: "M02" },
    requires: ["Q_TUT_2"], reward: { exp: 3, gold: 5, item: "eraser", light: null },
    dialog_start: "D_TUT_3A", dialog_end: "D_TUT_3B"
  },

  // ═════════════════════ v1.1 第一章主線：硫磺谷、竹子湖、基隆港、金瓜石（59 號 4.2 節）═════════════════════
  Q_YM_1: {
    title: "七星山有多高", giver: "hiker", map: "M03", kind: "help",
    goal: "到硫磺谷找登山阿伯，算算七星山有多高：答對 3 題數學。",
    log_next: "從硫磺谷往南走，就到竹子湖了。",
    subject: "數學", units: ["1 10000以內的數", "2 10000以內的加減"], count: 3, level_range: [1, 2],
    hunt: null, requires: ["Q_TUT_3"], reward: { exp: 3, gold: 5, item: null, light: null },
    dialog_start: "D_YM_1A", dialog_end: "D_YM_1B"
  },
  Q_ZZH_1: {
    title: "海芋田數一數", giver: "calla_farmer", map: "M46", kind: "help",
    goal: "從硫磺谷往南走到竹子湖，幫海芋農阿伯數海芋：答對 3 題數學。",
    log_next: "去原種田故事館找解說員。",
    subject: "數學", units: ["4 乘法", "1 10000以內的數"], count: 3, level_range: [1, 2],
    hunt: null, requires: ["Q_YM_1"], reward: { exp: 6, gold: 10, item: null, light: null },
    dialog_start: "D_ZZH_1A", dialog_end: "D_ZZH_1B", dialog_locked: "D_ZZH_LOCK"
  },
  Q_ZZH_2: {
    title: "蓬萊米的故鄉", giver: "rice_guide", map: "M46", kind: "help",
    goal: "到原種田故事館，聽解說員說竹子湖的米：答對 3 題社會。",
    log_next: "還沒去哥布林部落嗎？回金包里往東，穿過野柳的海蝕洞窟。",   // v1.1 審查：條件式（先做完哥布林鏈的孩子不會被叫回去）
    subject: "社會", units: ["第一單元 我居住的地方", "第四單元 生活與工作的轉變"], count: 3, level_range: [1, 2],
    hunt: null, requires: ["Q_ZZH_1"], reward: { exp: 6, gold: 10, item: "guide", light: null },
    dialog_start: "D_ZZH_2A", dialog_end: "D_ZZH_2B"
  },
  Q_KL_1: {
    title: "雨港的小雨傘", giver: "harbor_uncle", map: "M47", kind: "hunt",
    goal: "從野柳東邊的海岸公路走到基隆港，讓碼頭的滴滴雨精清醒，找回 3 把小雨傘。",
    log_next: "從基隆港往東南走，就到九份的山城市集。",
    subject: "自然", units: [], count: null, level_range: [1, 2],
    hunt: { item: "umbrella", n: 3, monster: "wx_rain", map: "M47" },
    requires: ["Q_GOB_4"], reward: { exp: 7, gold: 9, item: "herb", light: null },
    dialog_start: "D_KL_1A", dialog_end: "D_KL_1B", dialog_locked: "D_KL_LOCK"
  },
  Q_JGS_1: {
    title: "礦車數一數", giver: "old_miner", map: "M48", kind: "help",
    goal: "從九份往東走到金瓜石，幫老礦工阿伯數礦車、分礦石：答對 3 題數學。",
    log_next: "回九份告訴外國商人：金包里漁港有大章魚擋住漁船！",   // 和 D_JGS_1B 番薯仔「快回九份，告訴外國商人吧！」一致（Q_MER_4 是商人給的）
    subject: "數學", units: ["4 乘法", "6 除法"], count: 3, level_range: [1, 3],
    hunt: null, requires: ["Q_MER_3"], reward: { exp: 7, gold: 9, item: null, light: null },
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
    hunt: null, requires: ["Q_JGS_1"], reward: { exp: 7, gold: 9, item: "crystal", light: null },
    dialog_start: "D_JGS_3A", dialog_end: "D_JGS_3B"
  },

  // ═════════════════════ 神木森林・精靈族（M04，自然）═════════════════════
  Q_ELF_1: {
    title: "葉子為什麼黃了", giver: "elf_elder", map: "M04", kind: "help",
    goal: "從北港來到嘉義的神木森林，幫精靈長老想起植物和風的知識：答對 3 題自然。",
    log_next: "去找村子南邊、森林小路旁的精靈小孩葉葉。",
    subject: "自然", units: ["一、植物大發現", "三、風與空氣"], count: 3, level_range: [1, 2],
    hunt: null, requires: ["Q_BG_4"], legacy_requires: ["Q_TUT_3"], reward: { exp: 35, gold: 32, item: null, light: null },
    dialog_start: "D_ELF_1A", dialog_end: "D_ELF_1B", dialog_locked: "D_ELF_LOCK"
  },
  Q_ELF_2: {
    title: "指北針亂轉了", giver: "elf_kid", map: "M04", kind: "help",
    goal: "幫葉葉修好指北針和風車：答對 4 題自然。",
    log_next: "回去找精靈長老。",
    subject: "自然", units: ["二、磁鐵好好玩", "三、風與空氣"], count: 4, level_range: [1, 3],
    hunt: null, requires: ["Q_ELF_1"], reward: { exp: 35, gold: 32, item: "herb", light: null },
    dialog_start: "D_ELF_2A", dialog_end: "D_ELF_2B"
  },
  Q_ELF_3: {
    title: "毒菇帽調查", giver: "elf_elder", map: "M04", kind: "hunt",
    goal: "在神木森林南邊的密林讓毒菇怪清醒，帶回 3 個毒菇帽給長老。",
    log_next: "精靈長老說：樹王的病，府城古城的古書也許有寫。",
    subject: "自然", units: [], count: null, level_range: [1, 2],
    hunt: { item: "mushroom_cap", n: 3, monster: "mushroom", map: "M04" },
    requires: ["Q_ELF_2"], reward: { exp: 35, gold: 32, item: "guide", light: null },
    dialog_start: "D_ELF_3A", dialog_end: "D_ELF_3B"
  },
  Q_ELF_4: {
    title: "淨化枯萎樹王", giver: "elf_elder", map: "M04", kind: "boss",
    goal: "到神木森林最北邊的千年神木前，讓枯萎樹王清醒，拿回自然之光。",
    log_next: "拿到自然之光！遠方的金包里，一盞燈亮了。往府城古城西邊的安平出發。",
    subject: "自然", units: ["一、植物大發現", "二、磁鐵好好玩", "三、風與空氣", "四、奇妙的溶解", "一、快樂小農夫", "二、千變萬化的水", "三、天氣停看聽", "四、動物王國"], count: null, level_range: [2, 4],
    boss: "tree_king", boss_map: "M04",
    hunt: null, requires: ["Q_ELF_3", "Q_FC_1"], legacy_requires: ["Q_ELF_3"], reward: { exp: 35, gold: 32, item: null, light: "自然" }, lamp_auto: true,
    dialog_start: "D_ELF_4A", dialog_end: "D_ELF_4B"
  },

  // ═════════════════════ 山城市集・外國商人（M09，英語）═════════════════════
  Q_MER_1: {
    title: "聽不懂的招呼", giver: "merchant", map: "M09", kind: "help",
    goal: "從基隆港往東南走到九份的山城市集，幫外國商人和客人打招呼：答對 3 題英語。",
    log_next: "商人還有別的煩惱，再跟商人說話。",
    subject: "英語", units: ["Lesson 1 What's your name?（名字）", "Lesson 2 How old are you?（數字）"], count: 3, level_range: [1, 2],
    hunt: null, requires: ["Q_KL_1"], reward: { exp: 7, gold: 9, item: null, light: null },
    dialog_start: "D_MER_1A", dialog_end: "D_MER_1B", dialog_locked: "D_MER_LOCK"
  },
  Q_MER_2: {
    title: "商人的心情和貨物", giver: "merchant", map: "M09", kind: "help",
    goal: "幫商人回答客人的心情問題、數清楚貨物：答對 4 題英語。",
    log_next: "海鷗搶走了商人的羽毛筆，再跟商人說話。",
    subject: "英語", units: ["Lesson 4 Are you tired?（感覺）", "Lesson 2 How old are you?（數字）"], count: 4, level_range: [2, 3],
    hunt: null, requires: ["Q_MER_1"], reward: { exp: 7, gold: 9, item: "herb", light: null },
    dialog_start: "D_MER_2A", dialog_end: "D_MER_2B"
  },
  Q_MER_3: {
    title: "海鷗搶走的羽毛", giver: "merchant", map: "M09", kind: "hunt",
    goal: "讓山城巷子裡的搶食海鷗清醒，找回 3 根羽毛。",
    log_next: "商人說：金瓜石的老礦工知道大章魚的事。往東走到金瓜石。",
    subject: "英語", units: [], count: null, level_range: [1, 2],
    hunt: { item: "feather", n: 3, monster: "seagull", map: "M09" },
    requires: ["Q_MER_2"], reward: { exp: 7, gold: 9, item: "eraser", light: null },
    dialog_start: "D_MER_3A", dialog_end: "D_MER_3B"
  },
  Q_MER_4: {
    title: "漁港的迷霧章魚", giver: "merchant", map: "M09", kind: "boss",
    goal: "回金包里的磺火漁港，沿著碼頭木橋走到底，讓迷霧章魚清醒，拿回英語之光。",
    log_next: "拿到英語之光！去海風公園找里長伯點燈。",
    subject: "英語", units: ["Lesson 1 What's your name?（名字）", "Lesson 2 How old are you?（數字）", "Lesson 3 I'm short.（身材外貌）", "Lesson 4 Are you tired?（感覺）", "Lesson 1 Stationery（文具用品）", "Lesson 2 Colors（顏色）", "Review 1 Fun Things（有趣的事物）", "Lesson 3 Animal（動物）", "Lesson 4 Things you can do（能力）"], count: null, level_range: [2, 4],
    boss: "fog_octopus", boss_map: "M01",
    hunt: null, requires: ["Q_JGS_1"], reward: { exp: 7, gold: 9, item: null, light: "英語" },
    dialog_start: "D_MER_4A", dialog_end: "D_MER_4B", dialog_locked: "D_MER_4_LOCK"
  },

  // ═════════════════════ 紅樹林濕地・地精族（M05，數學）═════════════════════
  Q_GNO_1: {
    title: "材料秤一秤", giver: "gnome_chief", map: "M05", kind: "help",
    goal: "從北投往西走到關渡的紅樹林濕地，幫地精族長秤材料、量長度：答對 4 題數學。",
    log_next: "去找工坊旁邊的地精工匠。",
    subject: "數學", units: ["7 公斤與公克", "3 毫米與數線", "2 10000以內的加減"], count: 4, level_range: [2, 3],
    hunt: null, requires: ["Q_BT_2"], reward: { exp: 10, gold: 12, item: null, light: null },   // v1.3：原本 Q_ELF_4（62 號 4.3）
    dialog_start: "D_GNO_1A", dialog_end: "D_GNO_1B", dialog_locked: "D_GNO_LOCK"
  },
  Q_GNO_2: {
    title: "木板要切幾段", giver: "gnome", map: "M05", kind: "help",
    goal: "幫地精工匠分木板、算數量：答對 4 題數學。",
    log_next: "泥泥怪把齒輪吞走了，回去找地精族長。",
    subject: "數學", units: ["4 乘法", "6 除法", "8 分數"], count: 4, level_range: [3, 4],
    hunt: null, requires: ["Q_GNO_1"], reward: { exp: 10, gold: 12, item: "herb", light: null },
    dialog_start: "D_GNO_2A", dialog_end: "D_GNO_2B"
  },
  Q_GNO_3: {
    title: "找回齒輪", giver: "gnome_chief", map: "M05", kind: "hunt",
    goal: "讓濕地泥灘上的泥泥怪清醒，帶回 3 個齒輪。",
    log_next: "濕地西南邊的泥灘上有泥巴大蛙，再跟族長說話。",
    subject: "數學", units: [], count: null, level_range: [2, 3],
    hunt: { item: "gear", n: 3, monster: "mudslime", map: "M05" },
    requires: ["Q_GNO_2"], reward: { exp: 10, gold: 12, item: "guide", light: null },
    dialog_start: "D_GNO_3A", dialog_end: "D_GNO_3B"
  },
  Q_GNO_4: {
    title: "泥巴大蛙", giver: "gnome_chief", map: "M05", kind: "boss",
    goal: "沿著木棧道走到濕地西南邊的泥灘，讓泥巴大蛙清醒，拿回數學之光。",
    log_next: "拿到數學之光！搭車回金包里，找里長伯點數學燈。",
    subject: "數學", units: ["1 10000以內的數", "2 10000以內的加減", "3 毫米與數線", "4 乘法", "5 角與形狀", "6 除法", "7 公斤與公克", "8 分數", "9 列表與規律", "1 除法", "2 公升與毫升", "3 分數與加減", "4 圓", "5 兩步驟應用問題", "6 一位小數", "7 時間", "8 乘與除", "9 面積"], count: null, level_range: [2, 4],
    boss: "mud_frog", boss_map: "M05",
    hunt: null, requires: ["Q_GNO_3"], reward: { exp: 10, gold: 12, item: null, light: "數學" },
    dialog_start: "D_GNO_4A", dialog_end: "D_GNO_4B"
  },

  // ═════════════════════ 哥布林部落（M07，國語）═════════════════════
  Q_GOB_1: {
    title: "看不懂的告示", giver: "goblin_chief", map: "M07", kind: "help",
    goal: "穿過海蝕洞窟到哥布林部落，幫酋長讀懂部落的作息告示：答對 4 題國語。",
    log_next: "去找部落裡的哥布林小孩咕嚕。",
    subject: "國語", units: ["第壹單元 運用時間", "第貳單元 解決問題"], count: 4, level_range: [2, 4],
    hunt: null, requires: ["Q_TUT_3"], reward: { exp: 6, gold: 10, item: null, light: null },
    dialog_start: "D_GOB_1A", dialog_end: "D_GOB_1B", dialog_locked: "D_GOB_LOCK"
  },
  Q_GOB_2: {
    title: "寫一張祝福卡", giver: "goblin_kid", map: "M07", kind: "help",
    goal: "幫咕嚕想出好聽的句子，寫祝福卡給家人：答對 3 題國語。",
    log_next: "告示被撕碎帶走了，回去找酋長。",
    subject: "國語", units: ["第肆單元 美好的祝福", "第參單元 走進大自然"], count: 3, level_range: [2, 3],
    hunt: null, requires: ["Q_GOB_1"], reward: { exp: 6, gold: 10, item: "herb", light: null },
    dialog_start: "D_GOB_2A", dialog_end: "D_GOB_2B"
  },
  Q_GOB_3: {
    title: "撿回告示卷軸", giver: "goblin_chief", map: "M07", kind: "hunt",
    goal: "讓部落南邊的頑皮哥布林清醒，找回 3 張告示卷軸。",
    log_next: "告示上寫著：蝙蝠王在部落東邊的洞裡。再跟酋長說話。",
    subject: "國語", units: [], count: null, level_range: [2, 3],
    hunt: { item: "scroll", n: 3, monster: "goblin", map: "M07" },
    requires: ["Q_GOB_2"], reward: { exp: 6, gold: 10, item: "guide", light: null },
    dialog_start: "D_GOB_3A", dialog_end: "D_GOB_3B"
  },
  Q_GOB_4: {
    title: "噪音蝙蝠王", giver: "goblin_chief", map: "M07", kind: "boss",
    goal: "到哥布林部落東邊的小洞，讓噪音蝙蝠王清醒，拿回國語之光。",
    log_next: "拿到國語之光！野柳東邊的海岸公路，可以走到基隆港。",
    subject: "國語", units: ["第壹單元 運用時間", "第貳單元 解決問題", "第參單元 走進大自然", "第肆單元 美好的祝福", "第壹單元 人物組曲", "第貳單元 臺灣風景畫", "第參單元 生活小智慧", "第肆單元 奇幻故事屋"], count: null, level_range: [2, 4],
    boss: "noise_bat", boss_map: "M07",
    hunt: null, requires: ["Q_GOB_3"], reward: { exp: 6, gold: 10, item: null, light: "國語" },
    dialog_start: "D_GOB_4A", dialog_end: "D_GOB_4B"
  },

  // ═════════════════════ 月世界泥岩丘・獸人族（M08，社會）═════════════════════
  Q_ORC_1: {
    title: "獵場要怎麼分", giver: "orc_chief", map: "M08", kind: "help",
    goal: "從府城往南到月世界，幫獸人族長想出公平的規則和分配方法：答對 4 題社會。",
    log_next: "去找營地大門外的獸人獵人。",
    subject: "社會", units: ["第一單元 升上三年級的新學習", "第二單元 校園規範和班級自治", "第五單元 打造更美好的班級"], count: 4, level_range: [2, 4],
    hunt: null, requires: ["Q_FINAL"], legacy_requires: ["Q_GNO_4", "Q_GOB_4"], reward: { exp: 77, gold: 62, item: null, light: null },
    dialog_start: "D_ORC_1A", dialog_end: "D_ORC_1B", dialog_locked: "D_ORC_LOCK"
  },
  Q_ORC_2: {
    title: "營地的生活約定", giver: "orc", map: "M08", kind: "help",
    goal: "幫獸人獵人想想怎麼照顧自己、和家人好好相處：答對 4 題社會。",
    log_next: "野豬把柵欄鑰匙叼走了，回去找族長。",
    subject: "社會", units: ["第三單元 我的校園和家庭生活", "第四單元 健康成長的快樂童年"], count: 4, level_range: [2, 4],
    hunt: null, requires: ["Q_ORC_1"], reward: { exp: 77, gold: 62, item: "herb", light: null },
    dialog_start: "D_ORC_2A", dialog_end: "D_ORC_2B"
  },
  Q_ORC_3: {
    title: "柵欄鑰匙", giver: "orc_chief", map: "M08", kind: "hunt",
    goal: "讓泥岩溝谷裡的野豬清醒，找回 3 把柵欄鑰匙。",
    log_next: "獸人族長說：石像生氣，是因為南方的水果被搶光了。去大樹看看。",
    subject: "社會", units: [], count: null, level_range: [3, 4],
    hunt: { item: "key", n: 3, monster: "boar", map: "M08" },
    requires: ["Q_ORC_2"], reward: { exp: 77, gold: 62, item: "guide", light: null },
    dialog_start: "D_ORC_3A", dialog_end: "D_ORC_3B"
  },
  Q_ORC_4: {
    title: "暴躁石像", giver: "orc_chief", map: "M08", kind: "boss",
    goal: "到月世界南邊的泥岩溝，讓暴躁石像清醒，拿回社會之光。",
    log_next: "拿到社會之光！五盞燈全亮了。往南到屏東。",
    subject: "社會", units: ["第一單元 升上三年級的新學習", "第二單元 校園規範和班級自治", "第三單元 我的校園和家庭生活", "第四單元 健康成長的快樂童年", "第五單元 打造更美好的班級", "第一單元 我居住的地方", "第二單元 多元的生活空間", "第三單元 生活中的各行各業", "第四單元 生活與工作的轉變", "第五單元 儲蓄與消費", "第六單元 小小街道觀察家"], count: null, level_range: [3, 4],
    boss: "angry_golem", boss_map: "M08",
    hunt: null, requires: ["Q_ORC_3", "Q_DS_2"], legacy_requires: ["Q_ORC_3"], reward: { exp: 77, gold: 62, item: null, light: "社會" }, lamp_auto: true,
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
    reward: { exp: 7, gold: 9, item: "guide", light: null }, chapter_end: 1,
    dialog_start: "D_LAMPS3_A", dialog_end: "D_LAMPS3_B", dialog_locked: "D_CHIEF_IDLE"
  },
  // v1.3 台北章章末（62 號 4.2、4.4）：拿到數學之光後回金包里點數學燈（只點數學燈，59 號 4.6 ① 的點燈程式）。要排在 Q_LAMPS 前面（同一位里長伯）
  Q_LAMPS_MATH: {
    title: "點亮數學燈", giver: "chief", map: "M01", kind: "help",
    goal: "搭車回金包里，在海風公園的數學燈前答對 1 題，把燈點亮。",
    log_next: "台北章完成！三盞燈亮了。台北城往西，就是桃園石門水庫。",
    subject: "混合", subjects: ["數學"], units: [], count: 1, level_range: [1, 2],
    hunt: null, requires: ["Q_GNO_4"], requires_lights: ["數學"], reward: { exp: 10, gold: 12, item: "guide", light: null }, chapter_end: 3,
    dialog_start: "D_LAMPS_MATH_A", dialog_end: "D_LAMPS_MATH_B", dialog_locked: "D_CHIEF_IDLE"
  },
  Q_LAMPS: {
    title: "點亮五盞知識燈", giver: "chief", map: "M01", kind: "help",
    goal: "回金包里，在海風公園的五盞燈前各答對 1 題（五科各一題），把燈點亮。",
    log_next: "霧魔在古城塔頂！搭車去府城古城，找城主。",
    subject: "混合", subjects: ["國語", "英語", "數學", "自然", "社會"], units: [], count: 5, level_range: [1, 3],
    hunt: null, requires: ["Q_ELF_4", "Q_MER_4", "Q_GNO_4", "Q_GOB_4", "Q_ORC_4"],
    reward: { exp: 64, gold: 68, item: "guide", light: null }, retired: true,
    dialog_start: "D_LAMPS_A", dialog_end: "D_LAMPS_B", dialog_locked: "D_CHIEF_IDLE"
  },
  Q_FINAL: {
    title: "南霧將：古城塔頂的遺忘霧魔", giver: "king", map: "M10", kind: "boss",
    goal: "從府城城主府後面的樓梯上古城塔頂，用四道光讓遺忘霧魔清醒。",
    log_next: "南霧將清醒了，拿到南之曙光碎片（3／4）！塔頂還有一小團霧……",
    subject: "混合", subjects: ["國語", "英語", "數學", "自然"], units: [], count: null, level_range: [3, 4],
    boss: "fog_demon", boss_map: "M11",
    hunt: null, requires: ["Q_LE_3", "Q_ELF_4"], requires_lights: ["國語", "英語", "數學", "自然"],
    reward: { exp: 35, gold: 32, item: null, light: null },
    dialog_start: "D_FINAL_A", dialog_end: "D_FINAL_B", dialog_locked: "D_FINAL_LOCK"
  },

  // ═════════════════════ v1.2 第二章：草嶺古道、頭城礁溪、三星、蘇澳南方澳（61 號 4.1、4.2 節）═════════════════════
  // 主線：（第一章 Q_LAMPS_3）→ Q_CL_1 → Q_YL_1 → Q_YL_2（打獵）→ Q_YL_3 → Q_YL_4 → Q_YL_5 黏黏雨雲王（chapter_end: 2，第二章完成；不給光）
  // 支線：Q_YL_SNOW、Q_YL_TURTLE、Q_YL_OPERA、Q_YL_FISH（前置都是 Q_CL_1）。主線排在支線前面（漁港阿伯先給 Q_YL_5，forNpc 依資料順序）
  Q_CL_1: {
    title: "虎字碑的字", giver: "trail_volunteer", map: "M49", kind: "help",
    goal: "從金瓜石往東南走上草嶺古道，聽志工阿伯說虎字碑的故事：答對 3 題國語。",
    log_next: "走下古道就是宜蘭的頭城礁溪。",
    subject: "國語", units: ["第貳單元 臺灣風景畫", "第參單元 走進大自然"], count: 3, level_range: [2, 3],
    hunt: null, requires: ["Q_LAMPS_3"], reward: { exp: 11, gold: 14, item: null, light: null },
    dialog_start: "D_CL_1A", dialog_end: "D_CL_1B", dialog_locked: "D_CL_1_LOCK"
  },
  Q_YL_1: {
    title: "雨下不停", giver: "kumquat_farmer", map: "M14", kind: "help",
    goal: "走下古道到頭城礁溪，幫金棗農阿伯看天氣：答對 3 題自然。",
    log_next: "金棗園外有金棗彈彈在亂跳，再跟阿伯說話。",
    subject: "自然", units: ["三、天氣停看聽"], count: 3, level_range: [2, 3],
    hunt: null, requires: ["Q_CL_1"], reward: { exp: 11, gold: 14, item: null, light: null },
    dialog_start: "D_YL_1A", dialog_end: "D_YL_1B", dialog_locked: "D_YL_1_LOCK"
  },
  Q_YL_2: {
    title: "金棗被搶走了", giver: "kumquat_farmer", map: "M14", kind: "hunt",
    goal: "讓金棗園外的金棗彈彈清醒，找回 3 顆金棗。",
    log_next: "往南走到三星，蔥田需要幫忙。",
    subject: "數學", units: [], count: null, level_range: [2, 3],
    hunt: { item: "kumquat", n: 3, monster: "ly_kumquat", map: "M14" },
    requires: ["Q_YL_1"], reward: { exp: 11, gold: 14, item: "herb", light: null },
    dialog_start: "D_YL_2A", dialog_end: "D_YL_2B"
  },
  Q_YL_3: {
    title: "三星蔥收成", giver: "scallion_farmer", map: "M50", kind: "help",
    goal: "往南走到三星，幫蔥農阿伯算蔥、綁蔥：答對 3 題數學。",
    log_next: "再往南就是蘇澳。",
    subject: "數學", units: ["4 乘法", "6 除法"], count: 3, level_range: [2, 3],
    hunt: null, requires: ["Q_YL_2"], reward: { exp: 11, gold: 14, item: null, light: null },
    dialog_start: "D_YL_3A", dialog_end: "D_YL_3B", dialog_locked: "D_YL_3_LOCK"
  },
  Q_YL_4: {
    title: "冷泉為什麼是冷的", giver: "coldspring_keeper", map: "M51", kind: "help",
    goal: "再往南到蘇澳，聽冷泉管理員說冷泉的祕密：答對 3 題自然。",
    log_next: "去南方澳漁港找漁港阿伯，堤防盡頭的雨雲黏住不走！",
    subject: "自然", units: ["四、奇妙的溶解", "二、千變萬化的水"], count: 3, level_range: [2, 3],
    hunt: null, requires: ["Q_YL_3"], reward: { exp: 11, gold: 14, item: "guide", light: null },
    dialog_start: "D_YL_4A", dialog_end: "D_YL_4B", dialog_locked: "D_YL_4_LOCK"
  },
  // chapter_end: 2：完成後橫幅「第二章 完成！」＋旁白 D_CH2_END（還沒轉職、見習已到 10 級再加 D_CH2_JOB_HINT），記 state.chapter = 2
  Q_YL_5: {
    title: "黏黏雨雲王", giver: "sa_fisher", map: "M51", kind: "boss",
    goal: "走到南方澳漁港的堤防盡頭，讓黏住天空的黏黏雨雲王清醒。",
    log_next: "第二章完成！搭車回頭城礁溪，從頭城礁溪往西走，就到坪林了。",
    subject: "自然", units: ["一、植物大發現", "二、磁鐵好好玩", "三、風與空氣", "四、奇妙的溶解", "一、快樂小農夫", "二、千變萬化的水", "三、天氣停看聽", "四、動物王國"], count: null, level_range: [2, 4],
    boss: "wxb_raincloud", boss_map: "M51",
    hunt: null, requires: ["Q_YL_4"], reward: { exp: 11, gold: 14, item: null, light: null }, chapter_end: 2,
    dialog_start: "D_YL_5A", dialog_end: "D_YL_5B", dialog_locked: "D_YL_5_LOCK"
  },
  Q_YL_SNOW: {
    title: "雪山隧道有多長", giver: "bus_driver", map: "M14", kind: "help", side: true,
    goal: "聽頭城礁溪站的客運司機說雪山隧道：答對 2 題社會。",
    log_next: "司機說：雪山隧道在坪林和頭城之間，長 12.9 公里。",
    subject: "社會", units: ["第二單元 多元的生活空間"], count: 2, level_range: [1, 3],
    hunt: null, requires: ["Q_CL_1"], reward: { exp: 11, gold: 14, item: null, light: null },
    dialog_start: "D_YL_SNOW_A", dialog_end: "D_YL_SNOW_B", dialog_locked: "D_YL_SNOW_LOCK"
  },
  Q_YL_TURTLE: {
    title: "海上的龜山島", giver: "levee_uncle", map: "M14", kind: "help", side: true,
    goal: "在東邊海堤上看龜山島，回答海堤阿伯的問題：答對 2 題社會。",
    log_next: "龜山島在頭城外海大約 10 公里，是一座火山島。",
    subject: "社會", units: ["第一單元 我居住的地方"], count: 2, level_range: [1, 3],
    hunt: null, requires: ["Q_CL_1"], reward: { exp: 11, gold: 14, item: null, light: null },
    dialog_start: "D_YL_TURTLE_A", dialog_end: "D_YL_TURTLE_B", dialog_locked: "D_YL_TURTLE_LOCK"
  },
  Q_YL_OPERA: {
    title: "歌仔戲的故鄉", giver: "opera_actor", map: "M50", kind: "help", side: true,
    goal: "幫戲台上的歌仔戲演員對台詞：答對 3 題國語。",
    log_next: "演員說：縣志記載，歌仔戲是從宜蘭員山開始的。",
    subject: "國語", units: ["第肆單元 奇幻故事屋", "第壹單元 人物組曲"], count: 3, level_range: [1, 3],
    hunt: null, requires: ["Q_CL_1"], reward: { exp: 11, gold: 14, item: null, light: null },
    dialog_start: "D_YL_OPERA_A", dialog_end: "D_YL_OPERA_B", dialog_locked: "D_YL_OPERA_LOCK"
  },
  Q_YL_FISH: {
    title: "鯖魚數一數", giver: "sa_fisher", map: "M51", kind: "help", side: true,
    goal: "幫漁港阿伯數鯖魚、分魚箱：答對 3 題數學。",
    log_next: "阿伯說：南方澳的鯖魚節，從 1997 年就開始辦了。",
    subject: "數學", units: ["4 乘法", "9 列表與規律"], count: 3, level_range: [2, 3],
    hunt: null, requires: ["Q_CL_1"], reward: { exp: 11, gold: 14, item: "snack", light: null },
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
    hunt: null, requires: ["Q_YL_5"], reward: { exp: 10, gold: 12, item: null, light: null },
    dialog_start: "D_PL_1A", dialog_end: "D_PL_1B", dialog_locked: "D_PL_1_LOCK"
  },
  Q_PL_2: {
    title: "焙茶籠的茶葉", giver: "tea_farmer", map: "M52", kind: "hunt",
    goal: "讓茶寮旁的焙籠火狸清醒，找回 3 包茶葉。",
    log_next: "往西走，就是木柵、貓空。",
    subject: "社會", units: [], count: null, level_range: [2, 3],
    hunt: { item: "tea_leaf", n: 3, monster: "tea_basket", map: "M52" },
    requires: ["Q_PL_1"], reward: { exp: 10, gold: 12, item: "herb", light: null },
    dialog_start: "D_PL_2A", dialog_end: "D_PL_2B"
  },
  Q_MK_1: {
    title: "纜車票不見了", giver: "gondola_staff", map: "M13", kind: "hunt",
    goal: "往西走到貓空，讓茶園步道的鈴鈴鬧鐘兵清醒，找回 3 張纜車票。",
    log_next: "站務員說：山上的茶農阿伯在找人幫忙。",
    subject: "數學", units: [], count: null, level_range: [2, 3],
    hunt: { item: "ticket", n: 3, monster: "mc_alarm", map: "M13" },
    requires: ["Q_PL_2"], reward: { exp: 10, gold: 12, item: null, light: null },
    dialog_start: "D_MK_1A", dialog_end: "D_MK_1B", dialog_locked: "D_MK_1_LOCK"
  },
  Q_MK_2: {
    title: "鐵觀音茶園", giver: "tea_farmer_mk", map: "M13", kind: "help",
    goal: "幫貓空的茶農阿伯秤茶葉、分茶包：答對 3 題數學。",
    log_next: "往北下山，就是台北城。",
    subject: "數學", units: ["7 公斤與公克", "8 分數"], count: 3, level_range: [2, 3],
    hunt: null, requires: ["Q_MK_1"], reward: { exp: 10, gold: 12, item: "guide", light: null },
    dialog_start: "D_MK_2A", dialog_end: "D_MK_2B", dialog_locked: "D_MK_2_LOCK"
  },
  Q_TPC_1: {
    title: "迪化街買年貨", giver: "dihua_shop", map: "M12", kind: "help",
    goal: "下山到台北城，幫大稻埕的南北貨店老闆算帳：答對 3 題數學。",
    log_next: "往北走到北投，那裡有冒白煙的地熱谷。",
    subject: "數學", units: ["5 兩步驟應用問題", "2 10000以內的加減"], count: 3, level_range: [2, 3],
    hunt: null, requires: ["Q_MK_2"], reward: { exp: 10, gold: 12, item: null, light: null },
    dialog_start: "D_TPC_1A", dialog_end: "D_TPC_1B", dialog_locked: "D_TPC_1_LOCK"
  },
  Q_BT_1: {
    title: "溫泉博物館", giver: "bt_museum_guide", map: "M53", kind: "help",
    goal: "從台北城往北走到北投，聽解說員說老浴場的故事：答對 3 題社會。",
    log_next: "去地熱谷找巡守員。",
    subject: "社會", units: ["第四單元 生活與工作的轉變", "第二單元 多元的生活空間"], count: 3, level_range: [2, 3],
    hunt: null, requires: ["Q_TPC_1"], reward: { exp: 10, gold: 12, item: null, light: null },
    dialog_start: "D_BT_1A", dialog_end: "D_BT_1B", dialog_locked: "D_BT_1_LOCK"
  },
  Q_BT_2: {
    title: "地熱谷不能碰", giver: "geo_ranger", map: "M53", kind: "help",
    goal: "幫巡守員提醒遊客：地熱谷的水很燙、不能碰。答對 3 題自然。",
    log_next: "往西走到關渡的紅樹林，地精族需要幫忙。",
    subject: "自然", units: ["四、奇妙的溶解", "二、千變萬化的水"], count: 3, level_range: [2, 3],
    hunt: null, requires: ["Q_BT_1"], reward: { exp: 10, gold: 12, item: "snack", light: null },
    dialog_start: "D_BT_2A", dialog_end: "D_BT_2B", dialog_locked: "D_BT_2_LOCK"
  },
  Q_TPC_2: {
    title: "北門的故事", giver: "culture_guide", map: "M12", kind: "help", side: true,
    goal: "聽文史解說員說北門：答對 2 題社會。",
    log_next: "北門是光緒 10 年（1884 年）完成的。",
    subject: "社會", units: ["第一單元 我居住的地方"], count: 2, level_range: [1, 3],
    hunt: null, requires: ["Q_YL_5"], reward: { exp: 10, gold: 12, item: null, light: null },
    dialog_start: "D_TPC_2A", dialog_end: "D_TPC_2B", dialog_locked: "D_TPC_2_LOCK"
  },
  Q_TPC_3: {
    title: "亂閃的紅綠燈", giver: "traffic_volunteer", map: "M12", kind: "help", side: true,
    goal: "幫交通志工阿伯讓路口恢復正常：答對 3 題社會。",
    log_next: "阿伯說：過馬路要看燈號、走斑馬線。",
    subject: "社會", units: ["第六單元 小小街道觀察家"], count: 3, level_range: [1, 3],
    hunt: null, requires: ["Q_YL_5"], reward: { exp: 10, gold: 12, item: null, light: null },
    dialog_start: "D_TPC_3A", dialog_end: "D_TPC_3B", dialog_locked: "D_TPC_3_LOCK"
  },
  Q_XY_1: {
    title: "508 有幾個百", giver: "observatory_staff", map: "M54", kind: "help", side: true,
    goal: "往東走到信義，回答觀景台服務員的數字問題：答對 3 題數學。",
    log_next: "臺北101 總高度 508 公尺。",
    subject: "數學", units: ["1 10000以內的數", "2 10000以內的加減"], count: 3, level_range: [2, 3],
    hunt: null, requires: ["Q_YL_5"], reward: { exp: 10, gold: 12, item: null, light: null },
    dialog_start: "D_XY_1A", dialog_end: "D_XY_1B", dialog_locked: "D_XY_1_LOCK"
  },
  Q_XY_2: {
    title: "臺北第一個眷村", giver: "village_guide", map: "M54", kind: "help", side: true,
    goal: "聽解說員說四四南村的故事：答對 2 題社會。",
    log_next: "四四南村是臺北地區的第一個眷村。",
    subject: "社會", units: ["第四單元 生活與工作的轉變"], count: 2, level_range: [1, 3],
    hunt: null, requires: ["Q_YL_5"], reward: { exp: 10, gold: 12, item: null, light: null },
    dialog_start: "D_XY_2A", dialog_end: "D_XY_2B", dialog_locked: "D_XY_2_LOCK"
  },
  // ═════════════════════ v1.4 桃竹章：石門水庫・大溪、新竹風城（63 號 4.1、4.2 節）═════════════════════
  // 主線：（台北章 Q_LAMPS_MATH）→ Q_TY_1 → Q_TY_2 → 新竹 Q_HC_1 → Q_HC_2（打獵）→ 回石門水庫 Q_TY_5 北霧將（chapter_end: 4，北之曙光碎片）
  // 支線：Q_TY_3、Q_TY_4、Q_HC_3（前置都是 Q_LAMPS_MATH）
  // v4.0.1（老闆 2026-11-07 選 A）：Q_TY_3、Q_HC_3 拿掉 v1.4.1 的 skip_scene，改由題目適用地點（scenefit.js：外地、奇幻、寶箱題不抽）統一把關
  Q_TY_1: {
    title: "水庫的水", giver: "reservoir_keeper", map: "M15", kind: "help",
    goal: "從台北城往西走到石門水庫，聽管理員介紹水庫：答對 3 題自然。",
    log_next: "管理員要你幫忙算水量。",
    subject: "自然", units: ["二、千變萬化的水"], count: 3, level_range: [2, 3],
    hunt: null, requires: ["Q_LAMPS_MATH"], reward: { exp: 32, gold: 34, item: null, light: null },
    dialog_start: "D_TY_1A", dialog_end: "D_TY_1B"
  },
  Q_TY_2: {
    title: "水量算一算", giver: "reservoir_keeper", map: "M15", kind: "help",
    goal: "幫管理員算下游需要多少水：答對 3 題數學。",
    log_next: "管理員說：新竹的風亂吹，好像跟水庫的霧有關。往西南走到新竹。",
    subject: "數學", units: ["2 公升與毫升", "8 乘與除"], count: 3, level_range: [2, 3],
    hunt: null, requires: ["Q_TY_1"], reward: { exp: 32, gold: 34, item: null, light: null },
    dialog_start: "D_TY_2A", dialog_end: "D_TY_2B"
  },
  Q_HC_1: {
    title: "米粉曬不乾", giver: "noodle_master", map: "M16", kind: "help",
    goal: "往西南走到新竹，幫米粉師傅看風向：答對 3 題自然。",
    log_next: "曬場外的咻咻風精把風車葉片吹走了。",
    subject: "自然", units: ["三、風與空氣"], count: 3, level_range: [2, 3],
    hunt: null, requires: ["Q_TY_2"], reward: { exp: 32, gold: 34, item: null, light: null },
    dialog_start: "D_HC_1A", dialog_end: "D_HC_1B", dialog_locked: "D_HC_1_LOCK"
  },
  Q_HC_2: {
    title: "亂吹的咻咻風精", giver: "noodle_master", map: "M16", kind: "hunt",
    goal: "讓曬場外的咻咻風精清醒，找回 3 片風車葉片。",
    log_next: "師傅說：亂風是從石門水庫那邊吹來的！回水庫找管理員。",
    subject: "自然", units: [], count: null, level_range: [2, 3],
    hunt: { item: "pinwheel", n: 3, monster: "wx_wind", map: "M16" },
    requires: ["Q_HC_1"], reward: { exp: 32, gold: 34, item: "herb", light: null },
    dialog_start: "D_HC_2A", dialog_end: "D_HC_2B"
  },
  Q_TY_5: {
    title: "北霧將：霧閘機將", giver: "reservoir_keeper", map: "M15", kind: "boss",
    goal: "回石門水庫，到大壩壩頂讓霧閘機將清醒，打開水門。",
    log_next: "桃園・新竹完成！拿到北之曙光碎片（1／4）。",
    subject: "混合", subjects: ["自然", "數學"], units: ["一、植物大發現", "二、磁鐵好好玩", "三、風與空氣", "四、奇妙的溶解", "一、快樂小農夫", "二、千變萬化的水", "三、天氣停看聽", "四、動物王國", "1 10000以內的數", "2 10000以內的加減", "3 毫米與數線", "4 乘法", "5 角與形狀", "6 除法", "7 公斤與公克", "8 分數", "9 列表與規律", "1 除法", "2 公升與毫升", "3 分數與加減", "4 圓", "5 兩步驟應用問題", "6 一位小數", "7 時間", "8 乘與除", "9 面積"], count: null, level_range: [2, 4],
    boss: "mb_floodgate", boss_map: "M15",
    hunt: null, requires: ["Q_HC_2"], reward: { exp: 32, gold: 34, item: null, light: null }, chapter_end: 4,
    dialog_start: "D_TY_5A", dialog_end: "D_TY_5B", dialog_locked: "D_TY_5_LOCK"
  },
  Q_TY_3: {
    title: "豆干店的帳", giver: "tofu_shop", map: "M15", kind: "help", side: true,
    goal: "幫大溪老街的豆干店老闆算帳：答對 3 題數學。",
    log_next: "老闆說：大溪老街的豆干最有名。",
    subject: "數學", units: ["5 兩步驟應用問題", "2 10000以內的加減"], count: 3, level_range: [2, 3],
    hunt: null, requires: ["Q_LAMPS_MATH"], reward: { exp: 32, gold: 34, item: "snack", light: null },
    dialog_start: "D_TY_3A", dialog_end: "D_TY_3B"
  },
  Q_TY_4: {
    title: "木藝工坊", giver: "wood_artisan", map: "M15", kind: "help", side: true,
    goal: "聽木藝職人說做木工的工作：答對 2 題社會。",
    log_next: "職人說：木頭要慢慢磨，才會漂亮。",
    subject: "社會", units: ["第三單元 生活中的各行各業"], count: 2, level_range: [1, 3],
    hunt: null, requires: ["Q_LAMPS_MATH"], reward: { exp: 32, gold: 34, item: null, light: null },
    dialog_start: "D_TY_4A", dialog_end: "D_TY_4B"
  },
  Q_HC_3: {
    title: "迎曦門", giver: "hc_guide", map: "M16", kind: "help", side: true,
    goal: "聽解說員說迎曦門的故事：答對 2 題社會。",
    log_next: "迎曦門是竹塹城唯一留下來的城門。",
    subject: "社會", units: ["第一單元 我居住的地方"], count: 2, level_range: [1, 3],
    hunt: null, requires: ["Q_LAMPS_MATH"], reward: { exp: 32, gold: 34, item: null, light: null },
    dialog_start: "D_HC_3A", dialog_end: "D_HC_3B"
  },
  // ═════════════════════ v2.0 中部（第五章）：苗栗、大甲、鹿港、北港（69 號 4.1、4.2；wip_v20/v20_apply.js）═════════════════════
  // 主線：（v1.4 Q_TY_5）→ Q_ML_1 → Q_ML_3 → 大甲 Q_DJ_1 → Q_DJ_2【藺草繩】→ 回苗栗 Q_ML_2 迷路火車頭 → 鹿港 Q_LK_1 → Q_LK_2（打獵）→ 北港 Q_BG_1 → Q_BG_2、Q_BG_3 → Q_BG_4 燈籠霧將（chapter_end: 5）
  // 支線：Q_ML_4、Q_ML_5、Q_DJ_3、Q_LK_3、Q_BG_5。轉職：鎮瀾宮、鹿港天后宮、朝天宮、武德宮（jobs.js JOB_RULES.places，不是委託）
  // 經濟：新經濟（67 號 B 案、69 號 4.4）：完成時給經驗 44／60、金幣 40／50（金幣和劇本台詞「送你 40／50 枚金幣」一致）；答題本身不給（v20_0_econ_apply.js）
  Q_ML_1: {
    title: "舊山線的火車頭", giver: "old_stationmaster", map: "M17", kind: "help",
    goal: "從新竹往南走到苗栗，聽老站長說舊山線：答對 3 題社會。",
    log_next: "老站長說：火車頭的鳴笛把石虎寶寶嚇跑了。",
    subject: "社會", units: ["第四單元 生活與工作的轉變"], count: 3, level_range: [2, 3],
    hunt: null, requires: ["Q_TY_5"], reward: { exp: 44, gold: 40, item: null, light: null },
    dialog_start: "D_ML_1A", dialog_end: "D_ML_1B", dialog_locked: "D_ML_1_LOCK"
  },
  Q_ML_3: {
    title: "找回石虎寶寶", giver: "conservation_guide", map: "M17", kind: "help",
    goal: "火車頭的鳴笛嚇跑了石虎寶寶，和保育志工一起找回牠：答對 3 題自然。",
    log_next: "老站長說：要一條結實的繩子才拉得住火車頭，大甲的藺草最結實。往南走到大甲。",
    subject: "自然", units: ["四、動物王國"], count: 3, level_range: [2, 3],
    hunt: null, requires: ["Q_ML_1"], reward: { exp: 44, gold: 40, item: null, light: null },
    dialog_start: "D_ML_3A", dialog_end: "D_ML_3B", dialog_locked: "D_ML_3_LOCK"
  },
  Q_DJ_1: {
    title: "藺草帽要編幾頂", giver: "rush_weaver", map: "M18", kind: "help",
    goal: "老站長說要一條結實的繩子。往南走到大甲，幫藺草工坊阿伯算帳：答對 3 題數學。",
    log_next: "阿伯答應幫你編繩子，先聽他說大甲帽蓆的故事。",
    subject: "數學", units: ["8 乘與除", "5 兩步驟應用問題"], count: 3, level_range: [2, 3],
    hunt: null, requires: ["Q_ML_3"], reward: { exp: 44, gold: 40, item: null, light: null },
    dialog_start: "D_DJ_1A", dialog_end: "D_DJ_1B", dialog_locked: "D_DJ_1_LOCK"
  },
  Q_DJ_2: {
    title: "結實的藺草繩", giver: "rush_weaver", map: "M18", kind: "help",
    goal: "聽阿伯說大甲帽蓆的故事，請他編一條藺草繩：答對 2 題社會。",
    log_next: "拿到藺草繩了！回苗栗找老站長。",
    subject: "社會", units: ["第三單元 生活中的各行各業"], count: 2, level_range: [2, 3],
    hunt: null, requires: ["Q_DJ_1"], reward: { exp: 44, gold: 40, item: "rush_rope", light: null },
    dialog_start: "D_DJ_2A", dialog_end: "D_DJ_2B"
  },
  Q_ML_2: {
    title: "苗中頭目：迷路火車頭", giver: "old_stationmaster", map: "M17", kind: "boss",
    goal: "帶著藺草繩回苗栗，讓舊山線上的迷路火車頭清醒，停回月台。",
    log_next: "火車頭停回月台了！大甲的南邊可以通行，往鹿港出發。",
    subject: "混合", subjects: ["社會", "數學"], units: ["第四單元 健康成長的快樂童年", "第二單元 校園規範和班級自治", "第三單元 我的校園和家庭生活", "第一單元 升上三年級的新學習", "第五單元 打造更美好的班級", "第一單元 我居住的地方", "第二單元 多元的生活空間", "第三單元 生活中的各行各業", "第四單元 生活與工作的轉變", "第五單元 儲蓄與消費", "第六單元 小小街道觀察家", "1 10000以內的數", "5 角與形狀", "3 毫米與數線", "7 公斤與公克", "2 10000以內的加減", "8 分數", "9 列表與規律", "4 乘法", "6 除法", "1 除法", "2 公升與毫升", "3 分數與加減", "4 圓", "5 兩步驟應用問題", "6 一位小數", "7 時間", "8 乘與除", "9 面積"], count: null, level_range: [2, 4],
    boss: "mb_train", boss_map: "M17",
    hunt: null, requires: ["Q_DJ_2"], reward: { exp: 44, gold: 40, item: null, light: null },
    dialog_start: "D_ML_2A", dialog_end: "D_ML_2B", dialog_locked: "D_ML_2_LOCK"
  },
  Q_LK_1: {
    title: "一府二鹿三艋舺", giver: "lk_guide", map: "M19", kind: "help",
    goal: "從大甲往南走到鹿港，跟著導覽員走老街：答對 3 題國語。",
    log_next: "傘店老闆說窄巷裡有紙傘在跳。",
    subject: "國語", units: ["第貳單元 臺灣風景畫"], count: 3, level_range: [2, 3],
    hunt: null, requires: ["Q_ML_2"], reward: { exp: 60, gold: 50, item: null, light: null },
    dialog_start: "D_LK_1A", dialog_end: "D_LK_1B", dialog_locked: "D_LK_1_LOCK"
  },
  Q_LK_2: {
    title: "紙傘妖藏起的傘骨", giver: "umbrella_shop", map: "M19", kind: "hunt",
    goal: "讓窄巷裡的傘傘紙傘妖清醒，帶回 3 根紙傘骨。",
    log_next: "老闆說：這些鬼怪是被霧從山上吹下來的。往南走到北港。",
    subject: "英語", units: [], count: null, level_range: [2, 3],
    hunt: { item: "umbrella_rib", n: 3, monster: "gh_umbrella", map: "M19" },
    requires: ["Q_LK_1"], reward: { exp: 60, gold: 50, item: "herb", light: null },
    dialog_start: "D_LK_2A", dialog_end: "D_LK_2B", dialog_locked: "D_LK_2_LOCK"
  },
  Q_BG_1: {
    title: "笨港", giver: "temple_elder", map: "M20", kind: "help",
    goal: "傘店老闆說鬼怪是被霧從山上吹下來的。往南走到北港，聽廟口阿伯說北港以前的名字：答對 2 題社會。",
    log_next: "藝閣師傅和雜貨店老闆都需要幫忙。",
    subject: "社會", units: ["第一單元 我居住的地方"], count: 2, level_range: [2, 3],
    hunt: null, requires: ["Q_LK_2"], reward: { exp: 60, gold: 50, item: null, light: null },
    dialog_start: "D_BG_1A", dialog_end: "D_BG_1B", dialog_locked: "D_BG_1_LOCK"
  },
  Q_BG_2: {
    title: "藝閣的祝福卡", giver: "float_master", map: "M20", kind: "help",
    goal: "燈籠被霧吹亂了，幫藝閣師傅寫祝福卡：答對 3 題國語。",
    log_next: "兩件事都做完了，就去鎮外的堤防。",
    subject: "國語", units: ["第參單元 生活小智慧", "第壹單元 人物組曲"], count: 3, level_range: [2, 3],
    hunt: null, requires: ["Q_BG_1"], reward: { exp: 60, gold: 50, item: null, light: null },
    dialog_start: "D_BG_2A", dialog_end: "D_BG_2B", dialog_locked: "D_BG_2_LOCK"
  },
  Q_BG_3: {
    title: "存錢筒亂糟糟", giver: "grocer_bg", map: "M20", kind: "help",
    goal: "幫雜貨店老闆整理存錢筒、想想錢怎麼用：答對 3 題社會。",
    log_next: "兩件事都做完了，就去鎮外的堤防。",
    subject: "社會", units: ["第五單元 儲蓄與消費"], count: 3, level_range: [2, 3],
    hunt: null, requires: ["Q_BG_1"], reward: { exp: 60, gold: 50, item: null, light: null },
    dialog_start: "D_BG_3A", dialog_end: "D_BG_3B", dialog_locked: "D_BG_3_LOCK"
  },
  Q_BG_4: {
    title: "中霧將：燈籠霧將", giver: "float_master", map: "M20", kind: "boss",
    goal: "到鎮外的堤防，讓燈籠霧將清醒。",
    log_next: "中部完成！拿到中之曙光碎片（2／4）。鬼怪們說：「我們的家在南投的森林。」",
    subject: "混合", subjects: ["國語", "自然"], units: ["第參單元 走進大自然", "第貳單元 解決問題", "第肆單元 美好的祝福", "第壹單元 運用時間", "第壹單元 人物組曲", "第貳單元 臺灣風景畫", "愛閱讀一 熱愛昆蟲的法布爾", "第參單元 生活小智慧", "第肆單元 奇幻故事屋", "愛閱讀二 巨人傳說", "愛閱讀一 靈光一現", "愛閱讀二 老鼠嫁女兒", "二、磁鐵好好玩", "一、植物大發現", "三、風與空氣", "四、奇妙的溶解", "一、快樂小農夫", "二、千變萬化的水", "三、天氣停看聽", "四、動物王國"], count: null, level_range: [2, 4],
    boss: "mb_lantern", boss_map: "M20",
    hunt: null, requires: ["Q_BG_2", "Q_BG_3"], reward: { exp: 60, gold: 50, item: null, light: null }, chapter_end: 5,
    dialog_start: "D_BG_4A", dialog_end: "D_BG_4B", dialog_locked: "D_BG_4_LOCK"
  },
  Q_ML_4: {
    title: "木雕街", giver: "wood_carver", map: "M17", kind: "help", side: true,
    goal: "幫木雕師傅量木板：答對 2 題數學。",
    log_next: "木雕師傅說：木頭要慢慢雕，急不得。",
    subject: "數學", units: ["9 面積"], count: 2, level_range: [2, 3],
    hunt: null, requires: ["Q_ML_1"], reward: { exp: 44, gold: 40, item: null, light: null },
    dialog_start: "D_ML_4A", dialog_end: "D_ML_4B", dialog_locked: "D_ML_4_LOCK"
  },
  Q_ML_5: {
    title: "草莓園", giver: "berry_farmer", map: "M17", kind: "help", side: true,
    goal: "幫草莓農分草莓：答對 3 題數學。",
    log_next: "草莓農說：大湖是草莓之鄉。",
    subject: "數學", units: ["3 分數與加減"], count: 3, level_range: [2, 3],
    hunt: null, requires: ["Q_ML_1"], reward: { exp: 44, gold: 40, item: "snack", light: null },
    dialog_start: "D_ML_5A", dialog_end: "D_ML_5B", dialog_locked: "D_ML_5_LOCK"
  },
  Q_DJ_3: {
    title: "糕餅店的時間表", giver: "pastry_shop", map: "M18", kind: "help", side: true,
    goal: "幫糕餅店老闆排烤餅的時間：答對 3 題數學。",
    log_next: "糕餅店老闆說：烤餅要看好時間。",
    subject: "數學", units: ["7 時間"], count: 3, level_range: [2, 3],
    hunt: null, requires: ["Q_DJ_1"], reward: { exp: 44, gold: 40, item: null, light: null },
    dialog_start: "D_DJ_3A", dialog_end: "D_DJ_3B", dialog_locked: "D_DJ_3_LOCK"
  },
  Q_LK_3: {
    title: "老街問路", giver: "pastry_lk", map: "M19", kind: "help", side: true,
    goal: "老街來了外國遊客，幫糕餅店老闆用英語打招呼：答對 3 題英語。",
    log_next: "外國遊客笑著說：Thank you!",
    subject: "英語", units: ["Review 1 Fun Things（有趣的事物）", "Lesson 4 Things you can do（能力）"], count: 3, level_range: [2, 3],
    hunt: null, requires: ["Q_LK_1"], reward: { exp: 60, gold: 50, item: null, light: null },
    dialog_start: "D_LK_3A", dialog_end: "D_LK_3B", dialog_locked: "D_LK_3_LOCK"
  },
  Q_BG_5: {
    title: "麻油行", giver: "oil_shop", map: "M20", kind: "help", side: true,
    goal: "幫麻油行老闆量麻油：答對 3 題數學。",
    log_next: "麻油行老闆說：北港的麻油香噴噴。",
    subject: "數學", units: ["6 一位小數", "2 公升與毫升"], count: 3, level_range: [2, 3],
    hunt: null, requires: ["Q_BG_1"], reward: { exp: 60, gold: 50, item: null, light: null },
    dialog_start: "D_BG_5A", dialog_end: "D_BG_5B", dialog_locked: "D_BG_5_LOCK"
  },
  // ═════════════════════ 村民委託（支線，散佈各圖）═════════════════════
  Q_SIDE_BOOK: {
    title: "書架亂糟糟", giver: "bookstore", map: "M01", kind: "help",
    goal: "幫海風圖書館的阿伯整理書架：答對 3 題國語。",
    log_next: "圖書館阿伯說：不會的題目，提示會告訴你課本哪裡有教。",
    subject: "國語", units: ["第壹單元 運用時間", "第貳單元 解決問題"], count: 3, level_range: [1, 2],
    hunt: null, requires: ["Q_TUT_1"], reward: { exp: 3, gold: 5, item: "guide", light: null },
    dialog_start: "D_BOOK_A", dialog_end: "D_BOOK_B"
  },
  // v1.1 第一章支線（59 號 4.2 節）
  Q_N1_TIDE: {
    title: "等退潮再跳過去", giver: "seaweed_uncle", map: "M01", kind: "help", side: true,
    goal: "在金包里北邊的跳石海岸，幫撿海菜的阿伯看天氣、等退潮：答對 3 題自然。",
    log_next: "阿伯說：退潮的時候才可以去跳石頭，要注意安全。",
    subject: "自然", units: ["三、天氣停看聽", "二、千變萬化的水"], count: 3, level_range: [1, 2],
    hunt: null, requires: ["Q_TUT_1"], reward: { exp: 3, gold: 5, item: "herb", light: null },
    dialog_start: "D_TIDE_A", dialog_end: "D_TIDE_B"
  },
  Q_N1_BUFFALO: {
    title: "和水牛保持 20 公尺", giver: "park_ranger", map: "M02", kind: "help", side: true,
    goal: "幫擎天草原的解說員提醒遊客：野生的水牛要保持 20 公尺。答對 2 題自然。",
    log_next: "解說員說：看到水牛，記得保持 20 公尺。",
    subject: "自然", units: ["四、動物王國"], count: 2, level_range: [1, 2],
    hunt: null, requires: ["Q_TUT_3"], reward: { exp: 3, gold: 5, item: null, light: null },
    dialog_start: "D_BUFFALO_A", dialog_end: "D_BUFFALO_B"
  },
  Q_KL_2: {
    title: "夜市的一碗鼎邊銼", giver: "stall_keeper", map: "M47", kind: "help", side: true,
    goal: "幫廟口夜市的攤販阿伯算帳、招呼客人：答對 3 題社會。",
    log_next: "攤販阿伯說：鷄籠中元祭是基隆很重要的民俗喔。",
    subject: "社會", units: ["第三單元 生活中的各行各業", "第五單元 儲蓄與消費"], count: 3, level_range: [1, 2],
    hunt: null, requires: ["Q_TUT_3"], reward: { exp: 7, gold: 9, item: "snack", light: null },
    dialog_start: "D_KL_2A", dialog_end: "D_KL_2B"
  },
  Q_JGS_2: {
    title: "基隆山的另一個名字", giver: "museum_guide", map: "M48", kind: "help", side: true,
    goal: "聽博物館解說員介紹金瓜石和基隆山：答對 3 題社會。",
    log_next: "解說員說：基隆山又叫大肚美人山，但和金山人說的『美人山』不一樣喔。",
    subject: "社會", units: ["第二單元 多元的生活空間", "第一單元 我居住的地方"], count: 3, level_range: [1, 2],
    hunt: null, requires: ["Q_TUT_3"], reward: { exp: 7, gold: 9, item: "guide", light: null },
    dialog_start: "D_JGS_2A", dialog_end: "D_JGS_2B"
  },
  Q_SIDE_POTATO: {
    title: "烤地瓜秤一秤", giver: "potato_seller", map: "M02", kind: "help",
    goal: "幫擎天草原步道口賣地瓜的阿伯秤重、數數：答對 3 題數學。",
    log_next: "阿伯送你番薯仔點心。",
    subject: "數學", units: ["7 公斤與公克", "1 10000以內的數"], count: 3, level_range: [1, 2],
    hunt: null, requires: ["Q_TUT_2"], reward: { exp: 3, gold: 5, item: "snack", light: null },
    dialog_start: "D_POTATO_A", dialog_end: "D_POTATO_B"
  },
  Q_SIDE_STEAM: {
    title: "冒白煙的山谷", giver: "hiker", map: "M03", kind: "help",
    goal: "幫硫磺谷的登山阿伯想起空氣和溶解的知識：答對 3 題自然。",
    log_next: "登山阿伯說：走步道要小心，不要靠近噴氣孔。",
    subject: "自然", units: ["四、奇妙的溶解", "三、風與空氣"], count: 3, level_range: [1, 3],
    hunt: null, requires: ["Q_TUT_3"], reward: { exp: 3, gold: 5, item: "herb", light: null },
    dialog_start: "D_STEAM_A", dialog_end: "D_STEAM_B"
  },
  Q_SIDE_LOST: {
    title: "迷路的精靈小孩", giver: "elf_kid_lost", map: "M04", kind: "help",
    goal: "幫神木森林密林裡迷路的精靈小孩，想起回家的路和規矩：答對 3 題社會。",
    log_next: "精靈的樹屋村在森林的北邊。",
    subject: "社會", units: ["第三單元 我的校園和家庭生活", "第二單元 校園規範和班級自治"], count: 3, level_range: [1, 2],
    hunt: null, requires: [], requires_visit: "M04", reward: { exp: 35, gold: 32, item: "herb", light: null },
    dialog_start: "D_LOST_A", dialog_end: "D_LOST_B"
  },
  Q_SIDE_MEASURE: {
    title: "量一量木板", giver: "gnome_measure", map: "M05", kind: "help",
    goal: "幫濕地西南邊的地精木匠量長度、認形狀：答對 3 題數學。",
    log_next: "木匠送你一顆回音水晶。",
    subject: "數學", units: ["3 毫米與數線", "5 角與形狀"], count: 3, level_range: [1, 2],
    hunt: null, requires: ["Q_TUT_3"], reward: { exp: 10, gold: 12, item: "crystal", light: null },
    dialog_start: "D_MEASURE_A", dialog_end: "D_MEASURE_B"
  },
  Q_SIDE_ECHO: {
    title: "回音猜詞語", giver: "goblin_kid_echo", map: "M06", kind: "help",
    goal: "和海蝕洞窟裡的哥布林小孩玩猜詞語：答對 3 題國語。",
    log_next: "哥布林部落在海蝕洞窟的東北邊深處。",
    subject: "國語", units: ["第參單元 走進大自然", "第肆單元 美好的祝福"], count: 3, level_range: [1, 3],
    hunt: null, requires: ["Q_TUT_3"], reward: { exp: 6, gold: 10, item: "herb", light: null },
    dialog_start: "D_ECHO_A", dialog_end: "D_ECHO_B"
  },
  Q_SIDE_PIGGY: {
    title: "班費買盆栽", giver: "orc_bank", map: "M08", kind: "help",
    goal: "幫獸人小班長規劃班費，買盆栽布置教室：答對 2 題社會。",
    log_next: "小班長說：班上的事，大家一起討論決定。",
    subject: "社會", units: ["第五單元 打造更美好的班級"], count: 2, level_range: [3, 4],
    hunt: null, requires: [], requires_visit: "M08", reward: { exp: 77, gold: 62, item: "guide", light: null },
    dialog_start: "D_PIGGY_A", dialog_end: "D_PIGGY_B"
  },
  Q_SIDE_MAGNET: {
    title: "鐵匠的磁鐵", giver: "blacksmith", map: "M09", kind: "help",
    goal: "幫山城武器鋪的鐵匠師傅想起磁鐵會吸什麼：答對 3 題自然。",
    log_next: "鐵匠師傅送你一顆回音水晶。",
    subject: "自然", units: ["二、磁鐵好好玩"], count: 3, level_range: [1, 3],
    hunt: null, requires: ["Q_TUT_3"], reward: { exp: 7, gold: 9, item: "crystal", light: null },
    dialog_start: "D_MAGNET_A", dialog_end: "D_MAGNET_B"
  },
  Q_SIDE_TARO: {
    title: "芋圓平分", giver: "taro_seller", map: "M09", kind: "help",
    goal: "幫山城的芋圓店老闆把芋圓平分到每一碗：答對 3 題數學。",
    log_next: "芋圓店老闆說：你真聰明，有空再來吃芋圓。",
    subject: "數學", units: ["4 乘法", "6 除法", "9 列表與規律"], count: 3, level_range: [3, 4],
    hunt: null, requires: ["Q_TUT_3"], reward: { exp: 7, gold: 9, item: "snack", light: null },
    dialog_start: "D_TARO_A", dialog_end: "D_TARO_B"
  },
  // ═════════════════════ v3.0 南部（第六章嘉南、第七章高屏；70 號 4.1–4.5；wip_v30_draft/v30_apply.js）═════════════════════
  // 主線：Q_ELF_1–3 → Q_FC_1 → Q_ELF_4 → 安平 Q_AP_1 → Q_AP_2、Q_AP_3 → Q_AP_4（精英錨錨大副）→ 台江 Q_LE_1、Q_LE_2 → Q_LE_3（霧帆號逃走）→ Q_FINAL 南霧將 → Q_V1_FOG（chapter_end: 6）
  //   → 月世界 Q_ORC_1–3 → 大樹 Q_DS_1 → Q_DS_2 → Q_ORC_4 → 東港 Q_LQ_0（船票）→ 小琉球 Q_LQ_1 → Q_LQ_2、Q_LQ_3 → 屏東 Q_PT_1 → Q_PT_2 → Q_PT_3 霧帆號（chapter_end: 7）
  // 支線：Q_AL_1、Q_DS_3、Q_PT_4。轉職：鹿耳門聖母廟、佛光山（jobs.js JOB_RULES.places）。經濟：新經濟規則（每區 8 場經驗、20 場金幣平均分給委託和寶箱；每步 Z8 35／32、Z9 77／62、Z10 240／180）
  Q_FC_1: {
    title: "府城的古書", giver: "librarian", map: "M10", kind: "help",
    goal: "到府城古城的圖書館，查樹王為什麼生病：答對 3 題自然。",
    log_next: "找到了！帶著古書回神木森林。",
    subject: "自然", units: ["一、植物大發現"], count: 3, level_range: [2, 3],
    hunt: null, requires: ["Q_ELF_3"], reward: { exp: 35, gold: 32, item: null, light: null },
    dialog_start: "D_FC_1A", dialog_end: "D_FC_1B", dialog_locked: "D_FC_1_LOCK"
  },
  Q_AL_1: {
    title: "森林小火車", giver: "forest_rail", map: "M04", kind: "help", side: true,
    goal: "幫林鐵站務阿伯算小火車的班次：答對 3 題數學。",
    log_next: "站務阿伯說：小火車從嘉義一路爬到阿里山。",
    subject: "數學", units: ["5 兩步驟應用問題"], count: 3, level_range: [2, 3],
    hunt: null, requires: ["Q_ELF_1"], reward: { exp: 35, gold: 32, item: null, light: null },
    dialog_start: "D_AL_1A", dialog_end: "D_AL_1B", dialog_locked: "D_AL_1_LOCK"
  },
  Q_AP_1: {
    title: "外國商船的招呼", giver: "harbor_clerk", map: "M21", kind: "help",
    goal: "從府城往西到安平，幫港口書記和外國商船打招呼：答對 3 題英語。",
    log_next: "古堡解說員和老屋阿伯，也有故事要說給你聽。",
    subject: "英語", units: ["Lesson 1 What's your name?（名字）"], count: 3, level_range: [2, 3],
    hunt: null, requires: ["Q_ELF_4"], reward: { exp: 35, gold: 32, item: null, light: null },
    dialog_start: "D_AP_1A", dialog_end: "D_AP_1B"
  },
  Q_AP_2: {
    title: "古堡的故事", giver: "fort_guide", map: "M21", kind: "help",
    goal: "聽古堡解說員說安平古堡的故事：答對 2 題社會。",
    log_next: "古堡和劍獅的故事都聽完，就回去找港口書記。",
    subject: "社會", units: ["第四單元 生活與工作的轉變"], count: 2, level_range: [2, 3],
    hunt: null, requires: ["Q_AP_1"], reward: { exp: 35, gold: 32, item: null, light: null },
    dialog_start: "D_AP_2A", dialog_end: "D_AP_2B", dialog_locked: "D_AP_2_LOCK"
  },
  Q_AP_3: {
    title: "門上的劍獅", giver: "oldhouse_grandpa", map: "M21", kind: "help",
    goal: "聽老屋阿伯說門上劍獅的故事：答對 2 題國語。",
    log_next: "古堡和劍獅的故事都聽完，就回去找港口書記。",
    subject: "國語", units: ["第參單元 生活小智慧"], count: 2, level_range: [2, 3],
    hunt: null, requires: ["Q_AP_1"], reward: { exp: 35, gold: 32, item: null, light: null },
    dialog_start: "D_AP_3A", dialog_end: "D_AP_3B", dialog_locked: "D_AP_3_LOCK"
  },
  Q_AP_4: {
    title: "拿回航海圖", giver: "harbor_clerk", map: "M21", kind: "hunt",
    goal: "讓碼頭的錨錨大副清醒，拿回航海圖。",
    log_next: "拿回航海圖了！往北過橋去台江。",
    subject: "數學", units: [], count: null, level_range: [2, 3],
    hunt: { item: "sea_chart", n: 1, monster: "pib_anchor", map: "M21" },
    requires: ["Q_AP_2", "Q_AP_3"], reward: { exp: 35, gold: 32, item: null, light: null },
    dialog_start: "D_AP_4A", dialog_end: "D_AP_4B", dialog_locked: "D_AP_4_LOCK"
  },
  Q_LE_1: {
    title: "台江的黑面琵鷺", giver: "wetland_ranger", map: "M22", kind: "help",
    goal: "過橋到台江，在賞鳥亭聽保育員介紹黑面琵鷺：答對 2 題自然。",
    log_next: "保育員說：看鳥不要靠太近，說話要小聲。",
    subject: "自然", units: ["四、動物王國"], count: 2, level_range: [2, 3],
    hunt: null, requires: ["Q_AP_4"], reward: { exp: 35, gold: 32, item: null, light: null },
    dialog_start: "D_LE_1A", dialog_end: "D_LE_1B"
  },
  Q_LE_2: {
    title: "濕地的生活", giver: "wetland_ranger", map: "M22", kind: "help",
    goal: "聽保育員說台江濕地有什麼：答對 2 題社會。",
    log_next: "保育員發現，海上有一艘灰色的船……",
    subject: "社會", units: ["第二單元 多元的生活空間"], count: 2, level_range: [2, 3],
    hunt: null, requires: ["Q_AP_4"], reward: { exp: 35, gold: 32, item: null, light: null },
    dialog_start: "D_LE_2A", dialog_end: "D_LE_2B"
  },
  Q_LE_3: {
    title: "趕走霧帆號", giver: "wetland_ranger", map: "M22", kind: "help",
    goal: "用正確的知識保護黑面琵鷺，趕走霧帆號：答對 3 題英語。",
    log_next: "霧帆號往南逃走了。保育員說：霧是從古城塔頂飄出來的。",
    subject: "英語", units: ["Lesson 3 Animal（動物）"], count: 3, level_range: [2, 3],
    hunt: null, requires: ["Q_LE_1", "Q_LE_2"], reward: { exp: 35, gold: 32, item: null, light: null }, cutscene: "D_SHIP_ESCAPE",
    dialog_start: "D_LE_3A", dialog_end: "D_LE_3B"
  },
  Q_V1_FOG: {
    title: "霧仔", giver: "fog_kid", map: "M11", kind: "help",
    goal: "遺忘霧魔散開後，留下一小團霧在哭。幫它想起霧是什麼：答對 3 題自然。",
    log_next: "霧仔加入了！牠說霧王在玉山。先往南去月世界吧。",
    subject: "自然", units: ["二、千變萬化的水"], count: 3, level_range: [2, 3],
    hunt: null, requires: ["Q_FINAL"], reward: { exp: 35, gold: 32, item: null, light: null }, chapter_end: 6, sets_flag: "fogling_joined",
    dialog_start: "D_V1_FOG_KID", dialog_end: "D_V1_FOG_KID_B"
  },
  Q_DS_1: {
    title: "舊鐵橋", giver: "rail_fan", map: "M23", kind: "help",
    goal: "從月世界往南到大樹，聽鐵道迷阿伯說舊鐵橋有多長：答對 2 題數學。",
    log_next: "鳳梨農說：鳳梨田裡的小怪把鳳梨搶走了。",
    subject: "數學", units: ["1 10000以內的數"], count: 2, level_range: [2, 3],
    hunt: null, requires: ["Q_ORC_3"], reward: { exp: 77, gold: 62, item: null, light: null },
    dialog_start: "D_DS_1A", dialog_end: "D_DS_1B", dialog_locked: "D_DS_1_LOCK"
  },
  Q_DS_2: {
    title: "鳳梨田的小怪", giver: "pineapple_farmer", map: "M23", kind: "hunt",
    goal: "讓鳳梨田裡的鳳梨盔甲蟲清醒，拿回 3 顆鳳梨。",
    log_next: "鳳梨找回來了！回月世界安撫暴躁石像。",
    subject: "數學", units: [], count: null, level_range: [2, 3],
    hunt: { item: "pineapple", n: 3, monster: "ds_pineapple", map: "M23" },
    requires: ["Q_DS_1"], reward: { exp: 77, gold: 62, item: null, light: null },
    dialog_start: "D_DS_2A", dialog_end: "D_DS_2B", dialog_locked: "D_DS_2_LOCK"
  },
  Q_DS_3: {
    title: "鳳荔之鄉", giver: "lychee_farmer", map: "M23", kind: "help", side: true,
    goal: "聽荔枝農說大樹的水果：答對 2 題社會。",
    log_next: "荔枝農說：大樹的鳳梨和荔枝都很有名。",
    subject: "社會", units: ["第三單元 生活中的各行各業"], count: 2, level_range: [2, 3],
    hunt: null, requires: ["Q_DS_1"], reward: { exp: 77, gold: 62, item: null, light: null },
    dialog_start: "D_DS_3A", dialog_end: "D_DS_3B", dialog_locked: "D_DS_3_LOCK"
  },
  Q_LQ_0: {
    title: "往小琉球的船", giver: "ticket_seller", map: "M25", kind: "ferry",
    goal: "在東港碼頭買往小琉球的來回船票（200 塊）。",
    log_next: "買到船票了！到碼頭點船，就能去小琉球。",
    subject: "社會", units: [], count: null, level_range: [2, 3],
    hunt: null, requires: ["Q_ORC_4"], reward: { exp: 0, gold: 0, item: null, light: null },
    dialog_start: "D_LQ_0", dialog_end: "D_LQ_0", dialog_locked: "D_FERRY_DONGGANG_LIUQIU_LOCKED"
  },
  Q_LQ_1: {
    title: "淨灘接力", giver: "turtle_volunteer", map: "M24", kind: "help",
    goal: "跟保育志工淨灘，想一想垃圾為什麼會傷到海龜：答對 3 題自然。",
    log_next: "保育志工說：看海龜要保持距離，不要打擾牠們。",
    subject: "自然", units: ["四、動物王國"], count: 3, level_range: [2, 3],
    hunt: null, requires: ["Q_LQ_0"], reward: { exp: 77, gold: 62, item: null, light: null },
    dialog_start: "D_LQ_1A", dialog_end: "D_LQ_1B"
  },
  Q_LQ_2: {
    title: "友善賞龜", giver: "turtle_volunteer", map: "M24", kind: "help",
    goal: "學會友善賞龜，用望遠鏡數一數海龜：答對 2 題數學。",
    log_next: "記住：和海龜保持五公尺以上。島上的委託做完，就坐船回東港。",
    subject: "數學", units: ["9 列表與規律", "1 10000以內的數"], count: 2, level_range: [2, 3],
    hunt: null, requires: ["Q_LQ_1"], reward: { exp: 77, gold: 62, item: null, light: null },
    dialog_start: "D_LQ_2A", dialog_end: "D_LQ_2B"
  },
  Q_LQ_3: {
    title: "珊瑚礁島", giver: "island_guide", map: "M24", kind: "help",
    goal: "聽島上解說員說小琉球是怎樣的島：答對 2 題社會。",
    log_next: "小琉球是珊瑚礁島！島上的委託做完，就坐船回東港。",
    subject: "社會", units: ["第二單元 多元的生活空間"], count: 2, level_range: [2, 3],
    hunt: null, requires: ["Q_LQ_1"], reward: { exp: 77, gold: 62, item: null, light: null },
    dialog_start: "D_LQ_3A", dialog_end: "D_LQ_3B", dialog_locked: "D_LQ_3_LOCK"
  },
  Q_PT_1: {
    title: "第一座國家公園", giver: "park_ranger_kt", map: "M25", kind: "help",
    goal: "回到屏東，聽解說員介紹墾丁國家公園：答對 2 題社會。",
    log_next: "解說員說：南邊燈塔的守護員需要幫忙。",
    subject: "社會", units: ["第一單元 我居住的地方"], count: 2, level_range: [2, 3],
    hunt: null, requires: ["Q_LQ_2", "Q_LQ_3"], reward: { exp: 240, gold: 180, item: null, light: null },
    dialog_start: "D_PT_1A", dialog_end: "D_PT_1B", dialog_locked: "D_PT_1_LOCK"
  },
  Q_PT_2: {
    title: "讓燈塔再亮", giver: "lighthouse_keeper", map: "M25", kind: "help",
    goal: "幫燈塔守護員排好燈火閃爍的規律：答對 3 題數學。",
    log_next: "燈塔亮了！外海的霧裡，好像有一艘船……",
    subject: "數學", units: ["9 列表與規律"], count: 3, level_range: [2, 3],
    hunt: null, requires: ["Q_PT_1"], reward: { exp: 240, gold: 180, item: null, light: null },
    dialog_start: "D_PT_2A", dialog_end: "D_PT_2B", dialog_locked: "D_PT_2_LOCK"
  },
  Q_PT_3: {
    title: "屏東頭目：霧帆號", giver: "lighthouse_keeper", map: "M25", kind: "boss",
    goal: "燈塔照出外海的霧帆號，讓它清醒。",
    log_next: "第七章完成！大家的記憶貝殼都回來了。",
    subject: "混合", subjects: ["英語", "自然", "社會"], units: ["Lesson 2 How old are you?（數字）", "Lesson 1 What's your name?（名字）", "Lesson 4 Are you tired?（感覺）", "Lesson 3 I'm short.（身材外貌）", "Lesson 1 Stationery（文具用品）", "Lesson 2 Colors（顏色）", "Review 1 Fun Things（有趣的事物）", "Lesson 3 Animal（動物）", "Lesson 4 Things you can do（能力）", "Get Ready（開學預備）", "二、磁鐵好好玩", "一、植物大發現", "三、風與空氣", "四、奇妙的溶解", "一、快樂小農夫", "二、千變萬化的水", "三、天氣停看聽", "四、動物王國", "第四單元 健康成長的快樂童年", "第二單元 校園規範和班級自治", "第三單元 我的校園和家庭生活", "第一單元 升上三年級的新學習", "第五單元 打造更美好的班級", "第一單元 我居住的地方", "第二單元 多元的生活空間", "第三單元 生活中的各行各業", "第四單元 生活與工作的轉變", "第五單元 儲蓄與消費", "第六單元 小小街道觀察家"], count: null, level_range: [2, 4],
    boss: "pib_ship", boss_map: "M25",
    hunt: null, requires: ["Q_PT_2"], reward: { exp: 240, gold: 180, item: null, light: null }, chapter_end: 7,
    dialog_start: "D_PT_3A", dialog_end: "D_PT_3B"
  },
  Q_PT_4: {
    title: "恆春古城", giver: "oldcity_guide", map: "M25", kind: "help", side: true,
    goal: "聽古城解說員說恆春古城的四座城門：答對 2 題社會。",
    log_next: "解說員說：走一走古城門，想想以前的人怎麼生活。",
    subject: "社會", units: ["第四單元 生活與工作的轉變"], count: 2, level_range: [2, 3],
    hunt: null, requires: ["Q_PT_1"], reward: { exp: 240, gold: 180, item: null, light: null },
    dialog_start: "D_PT_4A", dialog_end: "D_PT_4B", dialog_locked: "D_PT_4_LOCK"
  },
  // ═════════════════════ v3.0 南部委託 END（wip_v30_draft/v30_apply.js 每次照表整段重建）═════════════════════
  // v3.0：Q_SIDE_LIB 排在南部委託後面（府城圖書館員第一次說話先給主線 Q_FC_1；QuestLog.forNpc 照資料順序挑）
  Q_SIDE_LIB: {
    title: "古城圖書館的英文書", giver: "librarian", map: "M10", kind: "help",
    goal: "幫府城古城圖書館員讀英文書：答對 3 題英語。",
    log_next: "圖書館員說：常常讀，就不會忘。",
    subject: "英語", units: ["Lesson 3 I'm short.（身材外貌）", "Lesson 1 What's your name?（名字）"], count: 3, level_range: [1, 4],
    hunt: null, requires: [], requires_visit: "M10", reward: { exp: 35, gold: 32, item: "guide", light: null },
    dialog_start: "D_LIB_A", dialog_end: "D_LIB_B"
  },
  // ═════════════════════ v4.0 東部（第八章台東・綠島・蘭嶼・花蓮；71 號 4.1–4.10、8.1；wip_v40/v40_apply.js）BEGIN ═════════════════════
  // 主線：屏東 Q_PT_3（第七章）→ 台東 Q_TT_1 → Q_TT_2 → Q_TT_3 霧氣球大王（富岡漁港的船開了）→ 買船票 Q_GI_0、Q_LY_0 → 綠島 Q_GI_1 → Q_GI_2；蘭嶼 Q_LY_1 → Q_LY_2、Q_LY_3（兩座島先去哪一個都可以）
  //   → 花蓮 Q_HL_1（前置 Q_TT_3、Q_GI_2、Q_LY_2、Q_LY_3）→ Q_HL_2 → Q_HL_3 雲鯨霧將（chapter_end: 8，東之曙光碎片 4／4）
  // 支線：Q_TT_4、Q_TT_5、Q_GI_3、Q_HL_4、Q_HL_5。經濟：新經濟規則（每步 Z11 117／83、Z12 267／200；買船票不分預算）。兩座島都完成時霧仔說 D_ISLANDS_DONE（cutscene_when）
  Q_TT_1: {
    title: "卑南遺址", giver: "ruins_guide", map: "M26", kind: "help",
    goal: "從屏東到台東，在遺址公園看月形石柱：答對 2 題社會。",
    log_next: "熱氣球隊長說：高台的熱氣球飛不起來了。",
    subject: "社會", units: ["第一單元 我居住的地方"], count: 2, level_range: [2, 3],
    hunt: null, requires: ["Q_PT_3"], reward: { exp: 117, gold: 83, item: null, light: null },
    dialog_start: "D_TT_1A", dialog_end: "D_TT_1B"
  },
  Q_TT_2: {
    title: "熱氣球飛不起來", giver: "balloon_captain", map: "M26", kind: "help",
    goal: "高台的熱氣球被霧壓住了，幫熱氣球隊看風：答對 3 題自然。",
    log_next: "高台上空，有一顆好大的灰色霧氣球！",
    subject: "自然", units: ["三、風與空氣"], count: 3, level_range: [2, 3],
    hunt: null, requires: ["Q_TT_1"], reward: { exp: 117, gold: 83, item: null, light: null },
    dialog_start: "D_TT_2A", dialog_end: "D_TT_2B"
  },
  Q_TT_3: {
    title: "台東頭目：霧氣球大王", giver: "balloon_captain", map: "M26", kind: "boss",
    goal: "讓擋在高台上空的霧氣球大王清醒。",
    log_next: "隊長說：一隻雲做的大鯨魚往北游了。富岡漁港的船開了！",
    subject: "混合", subjects: ["自然", "數學"], units: ["二、磁鐵好好玩", "一、植物大發現", "三、風與空氣", "四、奇妙的溶解", "一、快樂小農夫", "二、千變萬化的水", "三、天氣停看聽", "四、動物王國", "1 10000以內的數", "5 角與形狀", "3 毫米與數線", "7 公斤與公克", "2 10000以內的加減", "8 分數", "9 列表與規律", "4 乘法", "6 除法", "1 除法", "2 公升與毫升", "3 分數與加減", "4 圓", "5 兩步驟應用問題", "6 一位小數", "7 時間", "8 乘與除", "9 面積"], count: null, level_range: [2, 4],
    boss: "fob_balloon", boss_map: "M26",
    hunt: null, requires: ["Q_TT_2"], reward: { exp: 117, gold: 83, item: null, light: null },
    dialog_start: "D_TT_3A", dialog_end: "D_TT_3B"
  },
  Q_TT_4: {
    title: "一年兩次的釋迦", giver: "custard_farmer", map: "M26", kind: "help", side: true,
    goal: "聽釋迦農說釋迦什麼時候收成：答對 2 題社會。",
    log_next: "釋迦農說：釋迦要放軟了才好吃。",
    subject: "社會", units: ["第三單元 生活中的各行各業"], count: 2, level_range: [2, 3],
    hunt: null, requires: ["Q_TT_1"], reward: { exp: 117, gold: 83, item: null, light: null },
    dialog_start: "D_TT_4A", dialog_end: "D_TT_4B"
  },
  Q_TT_5: {
    title: "小朋友畫的熱氣球", giver: "balloon_captain", map: "M26", kind: "help", side: true,
    goal: "隊長說台東第一顆彩繪熱氣球是小朋友畫的。數一數：答對 2 題數學。",
    log_next: "隊長說：謝謝你，熱氣球又能飛上天了。",
    subject: "數學", units: ["1 10000以內的數"], count: 2, level_range: [2, 3],
    hunt: null, requires: ["Q_TT_3"], reward: { exp: 117, gold: 83, item: null, light: null },
    dialog_start: "D_TT_5A", dialog_end: "D_TT_5B"
  },
  Q_GI_0: {
    title: "往綠島的船", giver: "ticket_seller_fg", map: "M26", kind: "ferry",
    goal: "在富岡漁港買往綠島的來回船票（200 塊）。",
    log_next: "買到船票了！到碼頭點船，就能去綠島。",
    subject: "社會", units: [], count: null, level_range: [2, 3],
    hunt: null, requires: ["Q_TT_3"], reward: { exp: 0, gold: 0, item: null, light: null },
    dialog_start: "D_GI_0", dialog_end: "D_GI_0"
  },
  Q_GI_1: {
    title: "擦亮燈塔", giver: "lighthouse_guide_gi", map: "M27", kind: "help",
    goal: "聽燈塔解說員說居民救人的故事，幫忙擦亮燈：答對 3 題國語。",
    log_next: "燈塔亮了！溫泉管理員在海邊等你。",
    subject: "國語", units: ["第肆單元 美好的祝福"], count: 3, level_range: [2, 3],
    hunt: null, requires: ["Q_GI_0"], reward: { exp: 117, gold: 83, item: null, light: null },
    dialog_start: "D_GI_1A", dialog_end: "D_GI_1B"
  },
  Q_GI_2: {
    title: "海底溫泉", giver: "onsen_keeper_gi", map: "M27", kind: "help",
    goal: "在朝日溫泉看日出，聽管理員說海底溫泉：答對 2 題自然。",
    log_next: "綠島完成了！還沒去蘭嶼的話，坐船回富岡漁港買船票。",
    subject: "自然", units: ["二、千變萬化的水"], count: 2, level_range: [2, 3],
    hunt: null, requires: ["Q_GI_1"], reward: { exp: 117, gold: 83, item: null, light: null }, cutscene: "D_ISLANDS_DONE", cutscene_when: ["Q_GI_2", "Q_LY_2", "Q_LY_3"],
    dialog_start: "D_GI_2A", dialog_end: "D_GI_2B"
  },
  Q_GI_3: {
    title: "珊瑚石蓋的房子", giver: "oldhouse_gi", map: "M27", kind: "help", side: true,
    goal: "聽古厝阿伯說古厝的牆為什麼這麼厚：答對 2 題社會。",
    log_next: "阿伯說：厚厚的牆，可以擋住冬天的東北季風。",
    subject: "社會", units: ["第二單元 多元的生活空間"], count: 2, level_range: [2, 3],
    hunt: null, requires: ["Q_GI_0"], reward: { exp: 117, gold: 83, item: null, light: null },
    dialog_start: "D_GI_3A", dialog_end: "D_GI_3B"
  },
  Q_LY_0: {
    title: "往蘭嶼的船", giver: "ticket_seller_fg", map: "M26", kind: "ferry",
    goal: "在富岡漁港買往蘭嶼的來回船票（200 塊）。",
    log_next: "買到船票了！到碼頭點船，就能去蘭嶼。",
    subject: "社會", units: [], count: null, level_range: [2, 3],
    hunt: null, requires: ["Q_TT_3"], reward: { exp: 0, gold: 0, item: null, light: null },
    dialog_start: "D_LY_0", dialog_end: "D_LY_0"
  },
  Q_LY_1: {
    title: "拜訪的禮儀", giver: "tao_guide", map: "M28", kind: "help",
    goal: "當個有禮貌的客人，跟著解說員走、不亂碰別人的東西：答對 3 題社會。",
    log_next: "記住：拍照前先問，不隨便進別人的家。",
    subject: "社會", units: ["第二單元 校園規範和班級自治"], count: 3, level_range: [2, 3],
    hunt: null, requires: ["Q_LY_0"], reward: { exp: 117, gold: 83, item: null, light: null },
    dialog_start: "D_LY_1A", dialog_end: "D_LY_1B"
  },
  Q_LY_2: {
    title: "拼板舟", giver: "tao_guide", map: "M28", kind: "help",
    goal: "聽解說員介紹拼板舟：答對 2 題社會。",
    log_next: "拼板舟是別人家的船，我們只看不碰。",
    subject: "社會", units: ["第二單元 多元的生活空間"], count: 2, level_range: [2, 3],
    hunt: null, requires: ["Q_LY_1"], reward: { exp: 117, gold: 83, item: null, light: null }, cutscene: "D_ISLANDS_DONE", cutscene_when: ["Q_GI_2", "Q_LY_2", "Q_LY_3"],
    dialog_start: "D_LY_2A", dialog_end: "D_LY_2B"
  },
  Q_LY_3: {
    title: "跟著黑潮來的飛魚", giver: "tao_guide", map: "M28", kind: "help",
    goal: "聽解說員說飛魚和黑潮：答對 2 題自然。",
    log_next: "海水跟著黑潮往北流……霧仔好像想到了什麼！",
    subject: "自然", units: ["四、動物王國"], count: 2, level_range: [2, 3],
    hunt: null, requires: ["Q_LY_1"], reward: { exp: 117, gold: 83, item: null, light: null }, cutscene: "D_ISLANDS_DONE", cutscene_when: ["Q_GI_2", "Q_LY_2", "Q_LY_3"],
    dialog_start: "D_LY_3A", dialog_end: "D_LY_3B"
  },
  Q_HL_1: {
    title: "最大的縣", giver: "station_hl", map: "M29", kind: "help",
    goal: "從台東往北到花蓮，聽車站服務員說花蓮有多大：答對 2 題數學。",
    log_next: "國家公園解說員在峽谷口等你。",
    subject: "數學", units: ["1 10000以內的數"], count: 2, level_range: [2, 3],
    hunt: null, requires: ["Q_TT_3", "Q_GI_2", "Q_LY_2", "Q_LY_3"], reward: { exp: 267, gold: 200, item: null, light: null },
    dialog_start: "D_HL_1A", dialog_end: "D_HL_1B"
  },
  Q_HL_2: {
    title: "大理岩峽谷", giver: "taroko_ranger", map: "M29", kind: "help",
    goal: "在峽谷口聽解說員說大理岩峽谷怎麼來的：答對 2 題自然。",
    log_next: "海邊的漁夫說：海上有一隻雲做的大鯨魚！",
    subject: "自然", units: ["二、千變萬化的水"], count: 2, level_range: [2, 3],
    hunt: null, requires: ["Q_HL_1"], reward: { exp: 267, gold: 200, item: null, light: null },
    dialog_start: "D_HL_2A", dialog_end: "D_HL_2B"
  },
  Q_HL_3: {
    title: "東霧將：雲鯨霧將", giver: "fisher_hl", map: "M29", kind: "boss",
    goal: "海上的雲鯨霧將把霧吹進山谷，讓它清醒。",
    log_next: "拿到東之曙光碎片（4／4）！四片碎片會指向哪裡呢？往西進中橫公路。",
    subject: "混合", subjects: ["自然", "英語"], units: ["二、磁鐵好好玩", "一、植物大發現", "三、風與空氣", "四、奇妙的溶解", "一、快樂小農夫", "二、千變萬化的水", "三、天氣停看聽", "四、動物王國", "Lesson 2 How old are you?（數字）", "Lesson 1 What's your name?（名字）", "Lesson 4 Are you tired?（感覺）", "Lesson 3 I'm short.（身材外貌）", "Lesson 1 Stationery（文具用品）", "Lesson 2 Colors（顏色）", "Review 1 Fun Things（有趣的事物）", "Lesson 3 Animal（動物）", "Lesson 4 Things you can do（能力）", "Get Ready（開學預備）"], count: null, level_range: [2, 4],
    boss: "wxb_whale", boss_map: "M29",
    hunt: null, requires: ["Q_HL_2"], reward: { exp: 267, gold: 200, item: null, light: null }, chapter_end: 8,
    dialog_start: "D_HL_3A", dialog_end: "D_HL_3B"
  },
  Q_HL_4: {
    title: "山路要照時間走", giver: "road_engineer", map: "M29", kind: "help", side: true,
    goal: "工程員說進山要照公告的時間走，幫他算一算時間：答對 2 題數學。",
    log_next: "工程員說：進太魯閣前，先查公路和步道有沒有開放。",
    subject: "數學", units: ["7 時間"], count: 2, level_range: [2, 3],
    hunt: null, requires: ["Q_HL_1"], reward: { exp: 267, gold: 200, item: null, light: null },
    dialog_start: "D_HL_4A", dialog_end: "D_HL_4B"
  },
  Q_HL_5: {
    title: "石頭的故鄉", giver: "stone_carver", map: "M29", kind: "help", side: true,
    goal: "聽石雕師傅說花蓮的石頭：答對 2 題社會。",
    log_next: "師傅說：石頭要一點一點，慢慢雕。",
    subject: "社會", units: ["第三單元 生活中的各行各業"], count: 2, level_range: [2, 3],
    hunt: null, requires: ["Q_HL_1"], reward: { exp: 267, gold: 200, item: null, light: null },
    dialog_start: "D_HL_5A", dialog_end: "D_HL_5B"
  },
  // ═════════════════════ v4.0 東部委託 END（wip_v40/v40_apply.js 每次照表整段重建）═════════════════════
  // ═══ v4.2 第 4a 批 QUESTS BEGIN（tools/v42_apply.js 每次整段重建）═══
  Q_TK_1: {
    "title": "上山前的申請",
    "giver": "paiyun_volunteer",
    "map": "M33",
    "kind": "help",
    "goal": "志工說：上山要先申請、當天報到。答對 3 題，完成登山報到。",
    "log_next": "報到好了，可以上山了！從東邊的登山口出發。",
    "subject": "自然",
    "units": [
      "三、天氣停看聽"
    ],
    "count": 3,
    "level_range": [
      2,
      3
    ],
    "hunt": null,
    "requires": [
      "Q_XT_4"
    ],
    "reward": {
      "exp": 90,
      "gold": 58,
      "item": "climb_permit",
      "light": null
    },
    "dialog_start": "D_TK_1A",
    "dialog_end": "D_TK_1B"
  },
  Q_TK_2: {
    "title": "第二座國家公園",
    "giver": "ysnp_ranger",
    "map": "M33",
    "kind": "help",
    "goal": "聽解說員說玉山國家公園：答對 2 題社會。",
    "log_next": "解說員說：玉山國家公園是臺灣第二座國家公園。",
    "subject": "社會",
    "units": [
      "第一單元 我居住的地方"
    ],
    "count": 2,
    "level_range": [
      2,
      3
    ],
    "hunt": null,
    "requires": [
      "Q_TK_1"
    ],
    "reward": {
      "exp": 90,
      "gold": 58,
      "item": null,
      "light": null
    },
    "dialog_start": "D_TK_2A",
    "dialog_end": "D_TK_2B",
    "dialog_locked": "D_TK_2_LOCK"
  },
  Q_TK_3: {
    "title": "安靜看帝雉",
    "giver": "bird_guide",
    "map": "M33",
    "kind": "help",
    "goal": "跟鳥類解說員安靜地看帝雉，不靠近、不打擾：答對 2 題自然。",
    "log_next": "解說員說：清早和傍晚，比較有機會看到帝雉。",
    "subject": "自然",
    "units": [
      "四、動物王國"
    ],
    "count": 2,
    "level_range": [
      2,
      3
    ],
    "hunt": null,
    "side": true,
    "requires": [
      "Q_TK_1"
    ],
    "reward": {
      "exp": 90,
      "gold": 58,
      "item": null,
      "light": null
    },
    "dialog_start": "D_TK_3A",
    "dialog_end": "D_TK_3B",
    "dialog_locked": "D_TK_3_LOCK"
  },
  Q_YS_1: {
    "title": "森林的交界",
    "giver": "trail_ranger",
    "map": "M34",
    "kind": "help",
    "goal": "在孟祿亭聽巡山員說溫帶林和寒帶林的交界：答對 2 題自然。",
    "log_next": "前面的步道好像有動靜，走路要小心。",
    "subject": "自然",
    "units": [
      "一、植物大發現"
    ],
    "count": 2,
    "level_range": [
      2,
      3
    ],
    "hunt": null,
    "requires": [
      "Q_TK_2"
    ],
    "reward": {
      "exp": 90,
      "gold": 58,
      "item": null,
      "light": null
    },
    "dialog_start": "D_YS_1A",
    "dialog_end": "D_YS_1B"
  },
  Q_YS_2: {
    "title": "遇到臺灣黑熊",
    "giver": "fog_kid",
    "map": "M34",
    "kind": "event",
    "goal": "步道前面有一隻臺灣黑熊。答對 3 題『遇到熊要怎麼辦』。",
    "log_next": "黑熊回森林了。要記得告訴巡山員。",
    "subject": "自然",
    "units": [],
    "count": 3,
    "level_range": [
      2,
      3
    ],
    "hunt": null,
    "trigger": {
      "map": "M34",
      "cells": [
        [
          38,
          23
        ],
        [
          38,
          24
        ]
      ]
    },
    "fixed_questions": [
      {
        "id": "FX-YS2-1",
        "subject": "自然",
        "level": 2,
        "type": "choice",
        "scene": "霧仔小聲說：「是臺灣黑熊！胸前有黃白色的 V 字……我們不要靠近。」",
        "stem": "走在玉山步道上，帶什麼可以讓黑熊早一點知道有人來了？",
        "options": [
          "熊鈴或哨子",
          "一包餅乾",
          "一面小鏡子",
          "一根樹枝"
        ],
        "answer": 0,
        "hints": [
          "第1層：熊聽到什麼，就會知道有人來了？",
          "第2層：要選會發出聲音的東西。",
          "第3層：走路時會叮叮噹噹響，或是吹了會響的東西是什麼？"
        ],
        "explanation": "熊鈴、哨子會發出聲音，熊聽到就知道有人來了，會自己避開。去山上還要和大人結伴同行。",
        "option_why": [
          "正確：熊鈴、哨子會發出聲音，熊聽到就會避開。",
          "餅乾不會發出聲音，食物的味道反而會吸引動物。",
          "鏡子不會發出聲音，熊聽不到。",
          "樹枝不會發出聲音，熊聽不到。"
        ],
        "tts_lang": "zh-TW",
        "shuffled": true
      },
      {
        "id": "FX-YS2-2",
        "subject": "自然",
        "level": 2,
        "type": "choice",
        "scene": "霧仔：「黑熊正在吃果子。我們帶的食物，也要好好收著。」",
        "stem": "在山上吃完東西，垃圾和吃剩的食物要怎麼辦？",
        "options": [
          "放在步道旁邊",
          "丟進樹林裡",
          "全部帶下山",
          "留給動物吃"
        ],
        "answer": 2,
        "hints": [
          "第1層：垃圾和食物留在山上，會引來誰？",
          "第2層：熊和其他野生動物，可能會跑來吃。",
          "第3層：要讓山上什麼都不留下，該怎麼做？"
        ],
        "explanation": "垃圾和吃剩的食物會吸引熊等野生動物來吃，改變牠們本來的生活習慣，所以要全部帶下山。",
        "option_why": [
          "放在步道旁，會吸引熊等野生動物來吃。",
          "丟進樹林裡一樣會吸引動物，也弄髒山林。",
          "正確：垃圾和食物全部帶下山，就不會吸引動物、改變牠們的生活習慣。",
          "餵動物會改變牠們的生活習慣，也可能讓牠們靠近人。"
        ],
        "tts_lang": "zh-TW",
        "shuffled": true
      },
      {
        "id": "FX-YS2-3",
        "subject": "自然",
        "level": 2,
        "type": "choice",
        "scene": "霧仔小聲說：「牠還沒發現我們……」",
        "stem": "如果在步道上看到黑熊，應該怎麼做？",
        "options": [
          "大聲叫，跑過去拍照",
          "安靜離開，告訴巡山員",
          "拿出零食，丟給牠吃",
          "慢慢走近，摸摸牠的頭"
        ],
        "answer": 1,
        "hints": [
          "第1層：看到黑熊，要靠近還是離開？",
          "第2層：要保持冷靜，不吵、不餵、不靠近。",
          "第3層：離開以後，還要告訴誰？"
        ],
        "explanation": "看到黑熊要保持冷靜，安靜地離開，不要靠近、不要餵牠。離開以後，要告訴巡山員（管理國家公園的人）。",
        "option_why": [
          "大叫、跑過去會驚嚇黑熊，靠近牠很危險。",
          "正確：保持冷靜、安靜離開，再告訴巡山員。",
          "餵食會讓熊靠近人，也會改變牠的生活習慣。",
          "黑熊是野生動物，靠近、摸牠都很危險。"
        ],
        "tts_lang": "zh-TW",
        "shuffled": true
      }
    ],
    "noRecord": true,
    "requires": [
      "Q_YS_1"
    ],
    "reward": {
      "exp": 90,
      "gold": 58,
      "item": null,
      "light": null
    },
    "dialog_start": "D_YS_2A",
    "dialog_end": "D_BEAR_LEAVE"
  },
  Q_YS_3: {
    "title": "玉山步道頭目：山嵐霧精",
    "giver": "trail_ranger",
    "map": "M34",
    "kind": "boss",
    "goal": "白木林前的步道被一大團霧堵住了，讓山嵐霧精清醒。",
    "log_next": "山嵐霧精清醒，霧散開了。前面就是排雲山莊。",
    "subject": "混合",
    "subjects": [
      "自然",
      "社會"
    ],
    "units": [],
    "count": null,
    "level_range": [
      2,
      4
    ],
    "hunt": null,
    "boss": "fob_mist",
    "boss_map": "M34",
    "requires": [
      "Q_YS_2"
    ],
    "reward": {
      "exp": 90,
      "gold": 58,
      "item": null,
      "light": null
    },
    "dialog_start": "D_YS_3A",
    "dialog_end": "D_YS_3B",
    "dialog_locked": "D_YS_3_LOCK"
  },
  Q_PY_1: {
    "title": "晚上才有電",
    "giver": "lodge_manager_py",
    "map": "M35",
    "kind": "help",
    "goal": "管理員說山莊下午 6 時到 8 時才有電：答對 2 題數學。",
    "log_next": "霧仔看著雲海，好像有話想說。",
    "subject": "數學",
    "units": [
      "7 時間"
    ],
    "count": 2,
    "level_range": [
      2,
      3
    ],
    "hunt": null,
    "requires": [
      "Q_YS_3"
    ],
    "reward": {
      "exp": 90,
      "gold": 58,
      "item": null,
      "light": null
    },
    "dialog_start": "D_PY_1A",
    "dialog_end": "D_PY_1B"
  },
  Q_PY_2: {
    "title": "霧王的身世",
    "giver": "fog_kid",
    "map": "M35",
    "kind": "event",
    "goal": "在山莊前的廣場，聽霧仔說霧王的故事：答對 2 題自然。",
    "log_next": "霧仔說：霧王只是怕被忘記……我們去找它。",
    "subject": "自然",
    "units": [
      "二、千變萬化的水"
    ],
    "count": 2,
    "level_range": [
      2,
      3
    ],
    "hunt": null,
    "trigger": {
      "map": "M35",
      "cells": [
        [
          24,
          24
        ]
      ]
    },
    "requires": [
      "Q_PY_1"
    ],
    "reward": {
      "exp": 90,
      "gold": 58,
      "item": null,
      "light": null
    },
    "dialog_start": "D_PY_2A",
    "dialog_end": "D_FOG_ORIGIN"
  },
  Q_FK_1: {
    "title": "霧中入口",
    "giver": "fog_kid",
    "map": "M36",
    "kind": "event",
    "goal": "風口上方被霧牆擋住了，拿出曙光羅盤：答對 2 題，照出洞窟。",
    "log_next": "霧牆裡出現了一個洞口。霧之洞窟！",
    "subject": "自然",
    "units": [
      "三、天氣停看聽"
    ],
    "count": 2,
    "level_range": [
      2,
      3
    ],
    "hunt": null,
    "trigger": {
      "map": "M36",
      "cells": [
        [
          29,
          4
        ],
        [
          30,
          4
        ]
      ],
      "requires": "item:dawn_compass"
    },
    "requires": [
      "Q_PY_2"
    ],
    "reward": {
      "exp": 90,
      "gold": 58,
      "item": null,
      "light": null
    },
    "dialog_start": "D_FK_1A",
    "dialog_end": "D_FK_1B"
  },
  Q_CV_1: {
    "title": "回音謎門",
    "giver": "fog_kid",
    "map": "M37",
    "kind": "event",
    "goal": "石門上的大嘴巴會重複你說的話。答對 3 題國語，門就會開。",
    "log_next": "門開了！往洞窟深處走。",
    "subject": "國語",
    "units": [
      "第貳單元 臺灣風景畫",
      "第肆單元 奇幻故事屋"
    ],
    "count": 3,
    "level_range": [
      2,
      4
    ],
    "hunt": null,
    "trigger": {
      "map": "M37",
      "echo_door": true
    },
    "requires": [
      "Q_FK_1"
    ],
    "reward": {
      "exp": 90,
      "gold": 58,
      "item": null,
      "light": null
    },
    "dialog_start": "D_ECHO_DOOR",
    "dialog_end": "D_CV_1B"
  },
  Q_CV_2: {
    "title": "送回遺失物",
    "giver": "fog_kid",
    "map": "M39",
    "kind": "event",
    "goal": "書庫裡飄著大家弄丟的東西。送回 6 件，北門就會開。",
    "log_next": "北門開了！前面就是五燈試煉。",
    "subject": "英語",
    "units": [],
    "count": 6,
    "level_range": [
      2,
      4
    ],
    "hunt": null,
    "trigger": {
      "map": "M39",
      "lost_item": true
    },
    "requires": [
      "Q_CV_1"
    ],
    "reward": {
      "exp": 90,
      "gold": 58,
      "item": null,
      "light": null
    },
    "dialog_start": "D_CV_2A",
    "dialog_end": "D_CV_2B"
  },
  Q_CV_3A: {
    "title": "五燈試煉：國語燈",
    "giver": "fog_kid",
    "map": "M40",
    "kind": "boss",
    "goal": "讓燈座上的霧影清醒，點亮國語燈。",
    "log_next": "國語燈亮了！五盞燈全亮，最後的門就會開。",
    "subject": "國語",
    "units": [],
    "count": null,
    "level_range": [
      2,
      4
    ],
    "hunt": null,
    "boss": "fob_shadow_bat",
    "boss_map": "M40",
    "auto_accept": true,
    "requires": [
      "Q_CV_2"
    ],
    "reward": {
      "exp": 90,
      "gold": 58,
      "item": null,
      "light": null
    },
    "dialog_start": "D_CV_3A",
    "dialog_end": "D_LAMP_TRIAL_KO",
    "cutscene": "D_LAMP_TRIAL_ALL",
    "cutscene_when": [
      "Q_CV_3A",
      "Q_CV_3B",
      "Q_CV_3C",
      "Q_CV_3D",
      "Q_CV_3E"
    ]
  },
  Q_CV_3B: {
    "title": "五燈試煉：英語燈",
    "giver": "fog_kid",
    "map": "M40",
    "kind": "boss",
    "goal": "讓燈座上的霧影清醒，點亮英語燈。",
    "log_next": "英語燈亮了！五盞燈全亮，最後的門就會開。",
    "subject": "英語",
    "units": [],
    "count": null,
    "level_range": [
      2,
      4
    ],
    "hunt": null,
    "boss": "fob_shadow_octo",
    "boss_map": "M40",
    "auto_accept": true,
    "requires": [
      "Q_CV_2"
    ],
    "reward": {
      "exp": 90,
      "gold": 58,
      "item": null,
      "light": null
    },
    "dialog_start": "D_CV_3A",
    "dialog_end": "D_LAMP_TRIAL_EN",
    "cutscene": "D_LAMP_TRIAL_ALL",
    "cutscene_when": [
      "Q_CV_3A",
      "Q_CV_3B",
      "Q_CV_3C",
      "Q_CV_3D",
      "Q_CV_3E"
    ]
  },
  Q_CV_3C: {
    "title": "五燈試煉：數學燈",
    "giver": "fog_kid",
    "map": "M40",
    "kind": "boss",
    "goal": "讓燈座上的霧影清醒，點亮數學燈。",
    "log_next": "數學燈亮了！五盞燈全亮，最後的門就會開。",
    "subject": "數學",
    "units": [],
    "count": null,
    "level_range": [
      2,
      4
    ],
    "hunt": null,
    "boss": "fob_shadow_frog",
    "boss_map": "M40",
    "auto_accept": true,
    "requires": [
      "Q_CV_2"
    ],
    "reward": {
      "exp": 90,
      "gold": 58,
      "item": null,
      "light": null
    },
    "dialog_start": "D_CV_3A",
    "dialog_end": "D_LAMP_TRIAL_MA",
    "cutscene": "D_LAMP_TRIAL_ALL",
    "cutscene_when": [
      "Q_CV_3A",
      "Q_CV_3B",
      "Q_CV_3C",
      "Q_CV_3D",
      "Q_CV_3E"
    ]
  },
  Q_CV_3D: {
    "title": "五燈試煉：自然燈",
    "giver": "fog_kid",
    "map": "M40",
    "kind": "boss",
    "goal": "讓燈座上的霧影清醒，點亮自然燈。",
    "log_next": "自然燈亮了！五盞燈全亮，最後的門就會開。",
    "subject": "自然",
    "units": [],
    "count": null,
    "level_range": [
      2,
      4
    ],
    "hunt": null,
    "boss": "fob_shadow_tree",
    "boss_map": "M40",
    "auto_accept": true,
    "requires": [
      "Q_CV_2"
    ],
    "reward": {
      "exp": 90,
      "gold": 58,
      "item": null,
      "light": null
    },
    "dialog_start": "D_CV_3A",
    "dialog_end": "D_LAMP_TRIAL_NA",
    "cutscene": "D_LAMP_TRIAL_ALL",
    "cutscene_when": [
      "Q_CV_3A",
      "Q_CV_3B",
      "Q_CV_3C",
      "Q_CV_3D",
      "Q_CV_3E"
    ]
  },
  Q_CV_3E: {
    "title": "五燈試煉：社會燈",
    "giver": "fog_kid",
    "map": "M40",
    "kind": "boss",
    "goal": "讓燈座上的霧影清醒，點亮社會燈。",
    "log_next": "社會燈亮了！五盞燈全亮，最後的門就會開。",
    "subject": "社會",
    "units": [],
    "count": null,
    "level_range": [
      2,
      4
    ],
    "hunt": null,
    "boss": "fob_shadow_golem",
    "boss_map": "M40",
    "auto_accept": true,
    "requires": [
      "Q_CV_2"
    ],
    "reward": {
      "exp": 90,
      "gold": 58,
      "item": null,
      "light": null
    },
    "dialog_start": "D_CV_3A",
    "dialog_end": "D_LAMP_TRIAL_SO",
    "cutscene": "D_LAMP_TRIAL_ALL",
    "cutscene_when": [
      "Q_CV_3A",
      "Q_CV_3B",
      "Q_CV_3C",
      "Q_CV_3D",
      "Q_CV_3E"
    ]
  },
  // ═══ v4.2 第 4a 批 QUESTS END ═══
  // ═══ v4.2 第 4b 批 QUESTS BEGIN（tools/v42_apply.js 每次整段重建）═══
  Q_END_1: {
    "title": "最終頭目：遺忘霧王‧佛格",
    "giver": "fog_kid",
    "map": "M41",
    "kind": "boss",
    "goal": "玉山之巔的霧裡，遺忘霧王在等你。",
    "log_next": "霧散了！第一道曙光就要來了。",
    "subject": "混合",
    "subjects": [
      "國語",
      "英語",
      "數學",
      "自然",
      "社會"
    ],
    "units": [],
    "count": null,
    "level_range": [
      2,
      4
    ],
    "hunt": null,
    "boss": "fob_king",
    "boss_map": "M41",
    "auto_accept": true,
    "final": true,
    "chapter_end": 9,
    "requires": [
      "Q_CV_3A",
      "Q_CV_3B",
      "Q_CV_3C",
      "Q_CV_3D",
      "Q_CV_3E"
    ],
    "reward": {
      "exp": 90,
      "gold": 58,
      "item": null,
      "light": null
    },
    "dialog_start": "D_SUMMIT_ARRIVE",
    "dialog_end": "D_FOG_KING_END"
  },
  Q_END_2: {
    "title": "第一道曙光",
    "giver": "fog_kid",
    "map": "M41",
    "kind": "event",
    "goal": "看第一道曙光照亮玉山，再回金包里點亮第六盞燈。",
    "log_next": "你是點亮曙光的人！雲上好像還有路……",
    "subject": "混合",
    "subjects": [
      "國語",
      "英語",
      "數學",
      "自然",
      "社會"
    ],
    "units": [],
    "count": 1,
    "level_range": [
      2,
      4
    ],
    "hunt": null,
    "ending": true,
    "trigger": {
      "map": "M41",
      "ending": true
    },
    "requires": [
      "Q_END_1"
    ],
    "reward": {
      "exp": 0,
      "gold": 0,
      "item": null,
      "light": null
    },
    "dialog_start": "D_END_E1",
    "dialog_end": "D_END_E6"
  },
  // ═══ v4.2 第 4b 批 QUESTS END ═══
  // ═══ v4.2 第 4c 批 QUESTS BEGIN（tools/v42_apply.js 每次整段重建）═══
  Q_POST_1: {
    "title": "晨光雲階",
    "giver": "fog_kid",
    "map": "M42",
    "kind": "event",
    "goal": "答對題目讓軟雲變硬，開出一條路，走到雲階最北邊。",
    "log_next": "雲階走完了！下一層是星光雲庭。",
    "subject": "混合",
    "subjects": [
      "國語",
      "英語",
      "數學",
      "自然",
      "社會"
    ],
    "units": [],
    "count": 1,
    "level_range": [
      3,
      4
    ],
    "hunt": null,
    "trigger": {
      "map": "M42",
      "enter": true
    },
    "finish": {
      "map": "M42",
      "cells": [
        [
          28,
          0
        ],
        [
          29,
          0
        ]
      ]
    },
    "requires": [
      "Q_END_2"
    ],
    "reward": {
      "exp": 2880,
      "gold": 1700,
      "item": null,
      "light": null
    },
    "dialog_start": "D_POST_1A",
    "dialog_end": "D_POST_1B"
  },
  Q_POST_2: {
    "title": "星光雲庭",
    "giver": "fog_kid",
    "map": "M43",
    "kind": "event",
    "goal": "撿起星星、答對題目，讓 15 顆星星飛回星座。",
    "log_next": "星星都回到星座了！最後一層是曙光源頭。",
    "subject": "混合",
    "subjects": [
      "國語",
      "英語",
      "數學",
      "自然",
      "社會"
    ],
    "units": [],
    "count": 15,
    "level_range": [
      3,
      4
    ],
    "hunt": null,
    "trigger": {
      "map": "M43",
      "enter": true
    },
    "requires": [
      "Q_POST_1"
    ],
    "reward": {
      "exp": 4000,
      "gold": 2000,
      "item": null,
      "light": null
    },
    "dialog_start": "D_POST_2A",
    "dialog_end": "D_POST_2B"
  },
  Q_POST_3: {
    "title": "曙光源頭",
    "giver": "fog_kid",
    "map": "M44",
    "kind": "boss",
    "goal": "讓四位發著曙光的霧將清醒，走進光柱。",
    "log_next": "你走到了曙光的源頭！",
    "subject": "混合",
    "subjects": [
      "國語",
      "英語",
      "數學",
      "自然",
      "社會"
    ],
    "units": [],
    "count": null,
    "level_range": [
      3,
      4
    ],
    "hunt": null,
    "boss": "mb_floodgate_s3",
    "bosses": [
      "mb_floodgate_s3",
      "mb_lantern_s3",
      "fog_demon_s3",
      "wxb_whale_s3"
    ],
    "boss_map": "M44",
    "auto_accept": true,
    "finish": {
      "map": "M44",
      "pillar": true,
      "cells": [
        [
          24,
          16
        ]
      ]
    },
    "requires": [
      "Q_POST_2"
    ],
    "reward": {
      "exp": 4960,
      "gold": 2300,
      "item": null,
      "light": null
    },
    "dialog_start": "D_POST_3A",
    "dialog_end": "D_POST_END"
  },
  // ═══ v4.2 第 4c 批 QUESTS END ═══
};
