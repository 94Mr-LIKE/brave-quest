/*
 * 勇者大冒險 — 對話（07 第 6.5 節；新增欄位見 README_資料格式.md）
 * 撰寫：遊戲劇情設計師
 *
 * 規則：
 * - 每句 30 字以內（{name} 以 8 個字計算）；三年級讀得懂；不用真實店名、人名，不描繪特定神明。
 * - 不寫死亡、血腥；怪物打倒＝清醒跑走。主角有男生／女生，只用 {name} 或「冒險者」稱呼，不寫「她／他」。
 * - 推進主線的關鍵資訊（去哪裡、找誰）同時寫在 quests.js 的 goal / log_next，對話可以跳過也不會卡關。
 * - 只有外國商人的台詞夾簡單英文，並附中文。
 *
 * 台語：
 * - 普通人 NPC（人類角色，含城主、公會導師、圖書館員）每一句都有 taigi 欄位（v0.9.3，老闆 2026-10-10 指示）；
 *   精靈、地精、哥布林、獸人等奇幻種族，以及外國商人、旁白、番薯仔、頭目講華語。「老街」台語講「舊街」（Kū-ke）。
 * - taigi 的格式是 { hanji: 台語漢字, tailo: 台羅拼音, huayu: 華語翻譯 }。
 * - text 一律放華語版本，給朗讀和聽不懂台語的孩子看。
 * - hanji、tailo 已依教育部《臺灣台語常用詞辭典》查證（2026-10-07，查證表見 10_台語查證表.xlsx）；台羅標本調，不標連讀變調。
 * - v0.9.3 新增句依教育部辭典開放資料比對，網址待補（sutian 網站憑證過期，網站恢復後逐條補網址並重新核對；見查證表「v0.9.3 新增」工作表）。
 * - v1.1 第一章新增句（2026-10-20）：sutian 已恢復，逐詞附詞目網址（查證表「v1.1 第一章」「v1.1 地名查詢」）。
 *   地名先查地名附錄；附錄查無的地名（竹子湖、金瓜石、九份、野柳、跳石、美人山）台語句不說，由番薯仔或旁白用華語說。
 *
 * who：NPC id（對應 maps.js）、怪物 id（對應 monsters.js）、"hero"（主角）、"pet"（番薯仔）、"narrator"（旁白）。
 */
window.SPEAKERS = {
  // v1.3 台北章（62 號；劇本語音組草稿 wip_v13_draft/dialogs_taipei.js）
  tea_farmer: "茶農阿伯", gondola_staff: "纜車站務員", tea_farmer_mk: "鐵觀音茶農阿伯", temple_volunteer_zn: "指南宮志工阿伯", inn_maokong: "茶館老闆", dihua_shop: "南北貨店老闆", culture_guide: "文史解說員", traffic_volunteer: "交通志工阿伯", temple_volunteer_ht: "行天宮志工阿伯", inn_taipei: "城市旅館老闆", smith_taipei: "台北武器鋪老闆", armor_taipei: "台北防具店老闆", item_taipei: "台北道具店老闆", bt_museum_guide: "溫泉博物館解說員", geo_ranger: "地熱谷巡守員", inn_beitou: "北投溫泉旅館老闆", observatory_staff: "觀景台服務員", village_guide: "眷村故事館解說員", inn_xinyi: "信義旅館老闆",
  // v1.2 第二章：宜蘭（61 號；劇本語音組草稿 wip_v12_draft/dialogs_yilan.js）
  trail_volunteer: "步道志工阿伯", kumquat_farmer: "金棗農阿伯", bus_driver: "客運司機", levee_uncle: "海堤阿伯", stall_yilan: "老街道具攤阿伯", inn_jiaoxi: "礁溪溫泉旅館老闆", scallion_farmer: "蔥農阿伯", opera_actor: "歌仔戲演員", inn_sanxing: "三星民宿老闆", coldspring_keeper: "冷泉管理員", sa_fisher: "南方澳漁港阿伯", inn_suao: "冷泉旅店老闆", wxb_raincloud: "黏黏雨雲王",
  hero: "{name}", pet: "番薯仔", narrator: "",
  // v0.9.4 老闆 2026-10-11 裁示：台語語音只有一種男聲，講台語的角色一律男性（原女性角色改名，見 35_台語對白報告.md 第九節）
  chief: "里長伯", temple_keeper: "廟公", bookstore: "圖書館阿伯", fisher: "漁夫阿伯", shopkeeper: "老街阿伯",
  innkeeper: "溫泉旅館老闆", potato_seller: "賣地瓜的阿伯", hiker: "登山阿伯",
  elf_kid_lost: "迷路的精靈小孩", elf_elder: "精靈長老", elf_kid: "精靈小孩葉葉",
  gnome_chief: "地精族長", gnome: "地精工匠", gnome_measure: "地精木匠",
  goblin_kid_echo: "洞窟裡的哥布林小孩", goblin_chief: "哥布林酋長", goblin_kid: "哥布林小孩咕嚕",
  orc_chief: "獸人族長", orc: "獸人獵人", orc_bank: "獸人小班長",
  merchant: "外國商人", blacksmith: "鐵匠師傅", armor_keeper: "防具店老闆", item_keeper: "市場阿叔",
  innkeeper_port: "山城民宿老闆", taro_seller: "芋圓店老闆",
  king: "城主", guild: "公會導師", librarian: "圖書館員",
  // v0.9.3 B14 各地旅店老闆（還沒有精靈圖；性別、年齡暫定，待語音組確認）
  inn_shenmu: "樹屋旅店老闆", inn_mangrove: "地精旅舍老闆", inn_goblin: "石屋客棧老闆娘",
  inn_moon: "帳篷營地老闆", inn_fucheng: "府城老客棧老闆",
  // v1.1 第一章（59 號 2.2–2.5）：新的人類 NPC 全部講台語、一律男性
  seaweed_uncle: "撿海菜阿伯", park_ranger: "國家公園解說員", calla_farmer: "海芋農阿伯", rice_guide: "故事館解說員",
  harbor_uncle: "漁港阿伯", stall_keeper: "廟口攤販阿伯", old_miner: "老礦工阿伯", museum_guide: "博物館解說員",
  inn_keelung: "港邊旅店老闆", inn_jinguashi: "宿舍旅店老闆",
  tree_king: "枯萎樹王", fog_octopus: "迷霧章魚", mud_frog: "泥巴大蛙", noise_bat: "噪音蝙蝠王",
  angry_golem: "暴躁石像", fog_demon: "遺忘霧魔", mnb_goldjaw: "金脈鐵顎王"
};

window.DIALOGS = {

  // ═════════════ 系統與主線 ═════════════
  D_INTRO: [
    { who: "narrator", emotion: "平靜", text: "美麗島的北海岸，有個小鎮叫金包里。" },
    { who: "narrator", emotion: "擔心", text: "有一天，灰灰的「遺忘霧」從海上飄來。" },
    { who: "chief", emotion: "驚訝", text: "糟了！公園的知識燈都熄了！",
      taigi: { hanji: "害矣！公園的智識燈攏化去矣！", tailo: "Hāi--ah! Kong-hn̂g ê tì-sik-ting lóng hua--khì--ah!", huayu: "糟了！公園的知識燈都熄了！" } },
    { who: "chief", emotion: "擔心", text: "被霧碰到的人，會把學過的東西忘掉。",
      taigi: { hanji: "拄著霧的人，學過的物件攏會袂記得。", tailo: "Tú-tio̍h bū ê lâng, o̍h--kuè ê mi̍h-kiānn lóng ē bē-kì-tit.", huayu: "被霧碰到的人，會把學過的東西忘掉。" } },
    { who: "pet", emotion: "開心", text: "我是番薯仔！我們一起把光找回來吧！" },
    { who: "pet", emotion: "平靜", text: "走到人旁邊按對話鍵，就能聊天喔。" },
    { who: "pet", emotion: "開心", text: "有些阿伯、叔叔會說台語，下面有華語喔。" }
  ],
  D_FAINT: [
    { who: "pet", emotion: "擔心", text: "我們累倒了……先回旅店休息一下吧。" },
    { who: "pet", emotion: "開心", text: "沒關係！金幣和道具都還在喔。" }
  ],
  D_INN_REST: [
    { who: "narrator", emotion: "平靜", text: "好好休息了一下，體力和魔力都全滿了！" }
  ],
  D_CHEST_LOCKED: [
    { who: "pet", text: "寶箱上有數學鎖，答對才打得開！" }
  ],
  D_CHEST_DONE: [
    { who: "pet", text: "這個寶箱已經打開過了。" }
  ],
  D_LAMP_LIT: [
    { who: "narrator", emotion: "開心", text: "知識燈亮了起來！" }
  ],
  D_LIGHT_GET: [
    { who: "narrator", emotion: "開心", text: "你拿回了一道知識之光！" },
    { who: "pet", emotion: "開心", text: "快看任務日誌，下一步要去哪裡！" }
  ],
  D_STATION: [
    { who: "narrator", text: "這裡可以搭車。打開世界地圖，選要去哪裡吧！" }
  ],
  D_STATION_LOCKED: [
    { who: "pet", text: "那裡現在還去不了，先完成委託吧！" }
  ],

  // ═════════════ 金包里教學 ═════════════
  D_TUT_1A: [
    { who: "chief", emotion: "開心", text: "{name}，你來得正好！",
      taigi: { hanji: "你來甲拄仔好！", tailo: "Lí lâi kah tú-á-hó!", huayu: "你來得正好！" } },
    { who: "chief", emotion: "擔心", text: "公園燈座上刻著字，霧讓我看不清楚。",
      taigi: { hanji: "燈座頂懸有刻字，霧予我看袂清楚。", tailo: "Ting-tsō tíng-kuân ū khik-jī, bū hōo guá khuànn bē tshing-tshó.", huayu: "燈座上面有刻字，霧讓我看不清楚。" } },
    { who: "chief", emotion: "平靜", text: "你可以幫我讀一讀嗎？答對 2 題就好。",
      taigi: { hanji: "你會使共我讀看覓無？回答著兩題就好。", tailo: "Lí ē-sái kā guá tha̍k khuànn-māi--bô? Huê-tap tio̍h nn̄g tê tō hó.", huayu: "你可以幫我讀讀看嗎？答對兩題就好。" } },
    { who: "pet", emotion: "開心", text: "不會的話，按「提示」看課本哪裡有教！" }
  ],
  D_TUT_1B: [
    { who: "chief", emotion: "開心", text: "太好了！燈座上寫著「知識是光」。",
      taigi: { hanji: "真好！燈座頂懸有寫講「智識是光」。", tailo: "Tsin hó! Ting-tsō tíng-kuân ū siá kóng “tì-sik sī kng”.", huayu: "太好了！燈座上寫著「知識是光」。" } },
    { who: "chief", emotion: "平靜", text: "這是藥草，累了就吃一個。",
      taigi: { hanji: "這是藥草，忝矣就食一个。", tailo: "Tse sī io̍h-tsháu, thiám--ah tō tsia̍h tsi̍t ê.", huayu: "這是藥草，累了就吃一個。" } },
    { who: "chief", emotion: "擔心", text: "漁港的漁夫阿伯好像也遇到麻煩了。",
      taigi: { hanji: "漁港的討海阿伯，敢若嘛拄著麻煩矣。", tailo: "Hî-káng ê thó-hái a-peh, kánn-ná mā tú-tio̍h mâ-huân--ah.", huayu: "漁港的漁夫阿伯，好像也遇到麻煩了。" } },
    { who: "pet", emotion: "開心", text: "漁港在金包里的東北邊，我們去看看！" }
  ],
  D_TUT_2A: [
    { who: "fisher", emotion: "擔心", text: "唉，霧一來，我賣魚的錢都算不清了。",
      taigi: { hanji: "唉，霧一來，阮賣魚的錢攏算袂清矣。", tailo: "Haih, bū tsi̍t lâi, guán bē hî ê tsînn lóng sǹg bē tshing--ah.", huayu: "唉，霧一來，我賣魚的錢都算不清了。" } },
    { who: "fisher", emotion: "擔心", text: "客人給的錢、要找的錢，全亂了。",
      taigi: { hanji: "人客予的錢、愛找的錢，攏亂操操矣。", tailo: "Lâng-kheh hōo ê tsînn, ài tsāu ê tsînn, lóng luān-tshau-tshau--ah.", huayu: "客人給的錢、要找的錢，全都亂糟糟了。" } },
    { who: "fisher", emotion: "平靜", text: "幫阿伯算 3 題，好不好？",
      taigi: { hanji: "共阿伯算三題，好無？", tailo: "Kā a-peh sǹg sann tê, hó--bô?", huayu: "幫阿伯算三題，好不好？" } }
  ],
  D_TUT_2B: [
    { who: "fisher", emotion: "開心", text: "算得又快又對！謝謝喔！",
      taigi: { hanji: "算甲閣緊閣著！多謝喔！", tailo: "Sǹg kah koh kín koh tio̍h! To-siā--ooh!", huayu: "算得又快又對！謝謝喔！" } },
    { who: "fisher", emotion: "開心", text: "阿伯送你 50 枚金幣。",
      taigi: { hanji: "阿伯送你五十个金幣。", tailo: "A-peh sàng lí gōo-tsa̍p ê kim-pè.", huayu: "阿伯送你 50 枚金幣。" } },
    { who: "fisher", emotion: "平靜", text: "老街的商店有賣木劍和皮衣。",
      taigi: { hanji: "舊街的店頭有賣柴劍佮皮衫。", tailo: "Kū-ke ê tiàm-thâu ū bē tshâ-kiàm kah phuê-sann.", huayu: "老街的商店有賣木劍和皮衣。" } },
    { who: "pet", emotion: "平靜", text: "買東西前，先看看自己有幾枚金幣喔！" }
  ],
  D_TUT_3A: [
    { who: "innkeeper", emotion: "開心", text: "歡迎來泡溫泉喔！",
      taigi: { hanji: "歡迎來浸溫泉喔！", tailo: "Huan-gîng lâi tsìm un-tsuânn--ooh!", huayu: "歡迎來泡溫泉喔！" } },
    { who: "innkeeper", emotion: "擔心", text: "旅館的窗戶被海風吹破一個洞。",
      taigi: { hanji: "旅館的窗仔予海風吹破一空。", tailo: "Lí-kuán ê thang-á hōo hái-hong tshue phuà tsi̍t khang.", huayu: "旅館的窗戶被海風吹破一個洞。" } },
    { who: "innkeeper", emotion: "平靜", text: "南邊擎天草原的迷糊團子會掉黏黏球。",
      taigi: { hanji: "南爿草埔有圓圓的怪物，會落黏黐黐的球。", tailo: "Lâm-pîng tsháu-poo ū înn-înn ê kuài-bu̍t, ē lak liâm-thi-thi ê kiû.", huayu: "南邊擎天草原的迷糊團子會掉黏黏球。" } },
    { who: "innkeeper", emotion: "平靜", text: "幫我帶 2 顆回來補窗戶，好嗎？",
      taigi: { hanji: "共我紮兩粒轉來補窗仔，好無？", tailo: "Kā guá tsah nn̄g lia̍p tńg-lâi póo thang-á, hó--bô?", huayu: "幫我帶兩顆回來補窗戶，好嗎？" } },
    { who: "innkeeper", emotion: "開心", text: "累了就回來泡溫泉，住一晚 5 個金幣喔。",
      taigi: { hanji: "忝矣就轉來浸溫泉，蹛一暝五个金幣喔。", tailo: "Thiám--ah tō tńg-lâi tsìm un-tsuânn, tuà tsi̍t mê gōo ê kim-pè--ooh.", huayu: "累了就回來泡溫泉，住一晚 5 個金幣喔。" } },
    { who: "pet", emotion: "平靜", text: "碰到怪物就會開始戰鬥，答對就能攻擊！" },
    { who: "pet", emotion: "開心", text: "越快答對，打得越用力喔！" }
  ],
  D_TUT_3B: [
    { who: "innkeeper", emotion: "開心", text: "窗戶補好了，謝謝你喔！",
      taigi: { hanji: "窗仔補好矣，勞力喔！", tailo: "Thang-á póo hó--ah, lóo-la̍t--ooh!", huayu: "窗戶補好了，謝謝你喔！" } },
    { who: "innkeeper", emotion: "開心", text: "送你一張刪去卡，可以刪掉一個錯的選項。",
      taigi: { hanji: "送你一張卡片，會使共一个毋著的選項提掉。", tailo: "Sàng lí tsi̍t tiunn khah-phìnn, ē-sái kā tsi̍t ê m̄-tio̍h ê suán-hāng the̍h-tiāu.", huayu: "送你一張刪去卡，可以刪掉一個錯的選項。" } },
    // v1.1（59 號 4.5）：主線改走硫磺谷→竹子湖；金包里往東改通野柳（D20-A）。這兩句台語重錄
    { who: "innkeeper", emotion: "平靜", text: "南邊草原往西走，有一位阿伯在找人幫忙。",
      taigi: { hanji: "南爿草埔向西爿行，有一位阿伯咧揣人鬥相共。", tailo: "Lâm-pîng tsháu-poo ǹg sai-pîng kiânn, ū tsi̍t uī a-peh teh tshuē lâng tàu-sann-kāng.", huayu: "南邊草原往西走，有一位阿伯在找人幫忙。" } },
    { who: "innkeeper", emotion: "平靜", text: "往東走，可以到海邊的大山洞。",
      taigi: { hanji: "向東爿行，會使去海墘的大山空。", tailo: "Ǹg tang-pîng kiânn, ē-sái khì hái-kînn ê tuā suann-khang.", huayu: "往東走，可以到海邊的大山洞。" } },
    { who: "pet", emotion: "平靜", text: "任務日誌會寫下一步要去哪裡喔！" }
  ],

  // ═════════════ 神木森林・精靈族 ═════════════
  D_ELF_LOCK: [
    { who: "elf_elder", text: "歡迎你，遠方的小冒險者。" },
    { who: "elf_elder", text: "先回金包里，幫溫泉旅館的忙吧。" }
  ],
  D_ELF_1A: [
    { who: "elf_elder", emotion: "平靜", text: "歡迎來到神木森林。" },
    { who: "elf_elder", emotion: "擔心", text: "霧來了以後，大家忘了怎麼照顧植物。" },
    { who: "elf_elder", emotion: "擔心", text: "葉子黃了，風也亂吹，真讓人擔心。" },
    { who: "elf_elder", emotion: "平靜", text: "請幫我想起植物和風的知識，好嗎？" }
  ],
  D_ELF_1B: [
    { who: "elf_elder", emotion: "開心", text: "對了！植物需要陽光、空氣和水。" },
    { who: "elf_elder", emotion: "擔心", text: "南邊小路旁的葉葉，指北針好像壞了。" }
  ],
  D_ELF_2A: [
    { who: "elf_kid", emotion: "擔心", text: "我的指北針一直亂轉，找不到北邊！" },
    { who: "elf_kid", emotion: "平靜", text: "指北針裡面，有一根小磁針對不對？" },
    { who: "elf_kid", emotion: "擔心", text: "還有，風車也不轉了……幫幫我！" }
  ],
  D_ELF_2B: [
    { who: "elf_kid", emotion: "開心", text: "指北針又指向北邊了！謝謝你！" },
    { who: "elf_kid", emotion: "擔心", text: "長老說森林裡的毒菇怪變多了。" }
  ],
  D_ELF_3A: [
    { who: "elf_elder", emotion: "擔心", text: "南邊密林的毒菇怪被霧弄迷糊了。" },
    { who: "elf_elder", emotion: "平靜", text: "讓牠們清醒，帶回 3 個「毒菇帽」。" },
    { who: "elf_elder", emotion: "平靜", text: "我要用它們找出霧從哪裡來。" }
  ],
  D_ELF_3B: [
    { who: "elf_elder", emotion: "驚訝", text: "找到了！霧是從北邊的千年神木飄出來的。" },
    { who: "elf_elder", emotion: "擔心", text: "守護森林的神木，被霧附身了……" }
  ],
  D_ELF_4A: [
    { who: "elf_elder", emotion: "擔心", text: "神木變成了「枯萎樹王」。" },
    { who: "elf_elder", emotion: "平靜", text: "請到森林最北邊，讓神木清醒過來。" },
    { who: "pet", emotion: "平靜", text: "頭目戰不能逃跑，先去樹屋休息吧！" }
  ],
  D_ELF_4B: [   // v1.3 台北章改寫（62 號 4.6）
    { who: "elf_elder", emotion: "開心", text: "神木醒了，綠葉又長出來了！" },
    { who: "narrator", emotion: "開心", text: "你拿回了「自然之光」！" },
    { who: "elf_elder", emotion: "擔心", text: "紅樹林濕地的地精族也很煩惱。" },
    { who: "pet", emotion: "開心", text: "地精族住在台北北投西邊的紅樹林喔！" }
  ],
  D_BOSS_TREE_A: [
    { who: "tree_king", emotion: "神祕", text: "嗚……我……想不起來……葉子要什麼……" },
    { who: "pet", emotion: "驚訝", text: "樹王被霧弄迷糊了！答對題目叫醒它！" }
  ],
  D_BOSS_TREE_B: [
    { who: "tree_king", emotion: "開心", text: "啊……我想起來了。謝謝你。" }
  ],

  // ═════════════ 山城市集・外國商人 ═════════════
  D_MER_LOCK: [
    { who: "merchant", text: "Hello!（你好！）我在等勇敢的冒險者。" },
    { who: "merchant", text: "先去野柳幫哥布林，再沿海岸公路到基隆。" }
  ],
  D_MER_1A: [
    { who: "merchant", emotion: "開心", text: "Hello!（你好！）我從遠方來做生意。" },
    { who: "merchant", emotion: "擔心", text: "霧讓大家聽不懂我說的話。" },
    { who: "merchant", emotion: "平靜", text: "你可以幫我和客人打招呼嗎？" }
  ],
  D_MER_1B: [
    { who: "merchant", emotion: "開心", text: "Thank you!（謝謝你！）客人都聽懂了！" },
    { who: "merchant", emotion: "擔心", text: "可是我還有別的煩惱……" }
  ],
  D_MER_2A: [
    { who: "merchant", emotion: "擔心", text: "客人問我累不累、開不開心。" },
    { who: "merchant", emotion: "擔心", text: "我也要數清楚有幾箱貨，幫幫我！" }
  ],
  D_MER_2B: [
    { who: "merchant", emotion: "開心", text: "Great!（太棒了！）你的英文真好！" },
    { who: "merchant", emotion: "擔心", text: "可是海鷗把我的羽毛筆全搶走了。" }
  ],
  D_MER_3A: [
    { who: "merchant", emotion: "擔心", text: "巷子裡的搶食海鷗被霧弄糊塗了。" },
    { who: "merchant", emotion: "平靜", text: "讓牠們清醒，找回 3 根羽毛。" }
  ],
  D_MER_3B: [
    { who: "merchant", emotion: "開心", text: "有羽毛筆就能寫信了，謝謝！" },
    { who: "merchant", emotion: "驚訝", text: "金瓜石的老礦工說，漁港冒出了大觸手！" }
  ],
  D_MER_4A: [
    { who: "merchant", emotion: "擔心", text: "迷霧章魚把漁船都擋住了。" },
    { who: "merchant", emotion: "擔心", text: "牠只聽得懂英文，拜託你了！" },
    { who: "pet", emotion: "平靜", text: "回金包里的漁港，沿著木橋走到底！" }
  ],
  D_MER_4B: [
    { who: "merchant", emotion: "開心", text: "漁船可以出海了！Thank you!（謝謝你！）" },
    { who: "narrator", emotion: "開心", text: "你拿回了「英語之光」！" },
    { who: "merchant", emotion: "平靜", text: "回金包里找里長伯，把燈點亮吧！" }
  ],
  // v1.1（59 號 4.3）：Q_MER_4 的前置改成 Q_JGS_1
  D_MER_4_LOCK: [
    { who: "merchant", emotion: "平靜", text: "金瓜石的老礦工，知道大觸手的事。" },
    { who: "merchant", emotion: "平靜", text: "先去金瓜石找老礦工阿伯吧！" }
  ],
  D_BOSS_OCTO_A: [
    { who: "fog_octopus", emotion: "神祕", text: "你……是誰……？我好睏……" },
    { who: "pet", emotion: "驚訝", text: "牠聽得懂英文！答對英文題叫醒牠！" }
  ],
  D_BOSS_OCTO_B: [
    { who: "fog_octopus", emotion: "開心", text: "謝謝你！我要回大海了，再見！" },
    { who: "fisher", emotion: "開心", text: "章魚走了！漁船可以出海了！",
      taigi: { hanji: "石距走矣！漁船會使出海矣！", tailo: "Tsio̍h-kī tsáu--ah! Hî-tsûn ē-sái tshut-hái--ah!", huayu: "章魚走了！漁船可以出海了！" } }
  ],

  // ═════════════ 紅樹林濕地・地精族 ═════════════
  D_GNO_LOCK: [   // v1.3 台北章改寫（62 號 4.6）
    { who: "gnome_chief", emotion: "擔心", text: "濕地的霧太濃，什麼都看不清楚。" },
    { who: "gnome_chief", emotion: "平靜", text: "先去北投幫忙，再來找我們吧。" },
    { who: "pet", emotion: "平靜", text: "先到北投，幫地熱谷的巡守員吧！" }
  ],
  D_GNO_1A: [   // v1.3 台北章改寫（62 號 4.6）
    { who: "gnome_chief", emotion: "驚訝", text: "你是從北投走過來的嗎？你好厲害。" },
    { who: "gnome_chief", emotion: "平靜", text: "我們要在紅樹林蓋新的木棧道。" },
    { who: "gnome_chief", emotion: "擔心", text: "可是霧讓大家秤不準、量不準。" },
    { who: "gnome_chief", emotion: "平靜", text: "你能幫我們算一算嗎？" }
  ],
  D_GNO_1B: [
    { who: "gnome_chief", emotion: "開心", text: "材料都準備好了，太感謝了！" },
    { who: "gnome_chief", emotion: "平靜", text: "去找旁邊的工匠，木板還要分一分。" }
  ],
  D_GNO_2A: [
    { who: "gnome", emotion: "擔心", text: "這塊木板要分成好幾段……" },
    { who: "gnome", emotion: "擔心", text: "每段多長？要做幾個？頭好暈喔。" }
  ],
  D_GNO_2B: [
    { who: "gnome", emotion: "開心", text: "剛剛好！一點都沒有浪費。" },
    { who: "gnome", emotion: "擔心", text: "可是做棧道的齒輪被泥泥怪吞走了。" }
  ],
  D_GNO_3A: [
    { who: "gnome_chief", emotion: "擔心", text: "泥泥怪把齒輪當成點心吞下去了。" },
    { who: "gnome_chief", emotion: "平靜", text: "讓牠們清醒，帶回 3 個齒輪。" }
  ],
  D_GNO_3B: [
    { who: "gnome_chief", emotion: "開心", text: "齒輪都回來了，棧道可以動工了！" },
    { who: "gnome_chief", emotion: "擔心", text: "只是西南邊的泥灘，有隻好大的蛙……" }
  ],
  D_GNO_4A: [
    { who: "gnome_chief", emotion: "擔心", text: "泥巴大蛙一直把泥巴丟到棧道上。" },
    { who: "gnome_chief", emotion: "擔心", text: "牠在濕地西南邊的泥灘，拜託你！" }
  ],
  D_GNO_4B: [   // v1.3 台北章改寫（62 號 4.6）
    { who: "gnome_chief", emotion: "開心", text: "棧道蓋好了！你真是算數高手。" },
    { who: "narrator", emotion: "開心", text: "你拿回了「數學之光」！" },
    { who: "pet", emotion: "開心", text: "搭車回金包里，找里長伯點數學燈吧！" }
  ],
  D_BOSS_FROG_A: [
    { who: "mud_frog", emotion: "驚訝", text: "呱！一、二、五、三……數不清了呱！" },
    { who: "pet", emotion: "平靜", text: "牠的數字亂掉了，我們幫牠數對！" }
  ],
  D_BOSS_FROG_B: [
    { who: "mud_frog", emotion: "開心", text: "呱呱！我又會數數了，謝謝！" }
  ],

  // ═════════════ 哥布林部落 ═════════════
  D_GOB_LOCK: [
    { who: "goblin_chief", emotion: "平靜", text: "外面來的？我們現在很忙。" },
    { who: "goblin_chief", emotion: "平靜", text: "先幫金包里溫泉旅館的忙，再來找我。" },
    { who: "pet", emotion: "平靜", text: "溫泉旅館的老闆，在等黏黏球喔！" }
  ],
  D_GOB_1A: [
    { who: "goblin_chief", emotion: "平靜", text: "嘿，冒險者，你看得懂字嗎？" },
    { who: "goblin_chief", emotion: "擔心", text: "霧來了以後，大家看不懂告示了。" },
    { who: "goblin_chief", emotion: "擔心", text: "幾點吃飯、幾點睡覺，全亂了！" }
  ],
  D_GOB_1B: [
    { who: "goblin_chief", emotion: "驚訝", text: "原來告示寫的是作息時間！" },
    { who: "goblin_chief", emotion: "平靜", text: "咕嚕想寫卡片，你去幫幫咕嚕吧。" }
  ],
  D_GOB_2A: [
    { who: "goblin_kid", emotion: "平靜", text: "我想寫一張祝福卡給阿嬤。" },
    { who: "goblin_kid", emotion: "擔心", text: "可是我忘了好聽的句子……" }
  ],
  D_GOB_2B: [
    { who: "goblin_kid", emotion: "開心", text: "卡片寫好了！阿嬤一定很開心。" },
    { who: "goblin_kid", emotion: "擔心", text: "部落南邊的哥布林，把告示撕碎了。" }
  ],
  D_GOB_3A: [
    { who: "goblin_chief", emotion: "生氣", text: "迷糊的哥布林把告示撕碎帶走了。" },
    { who: "goblin_chief", emotion: "平靜", text: "讓哥布林們清醒，找回 3 張告示卷軸。" }
  ],
  D_GOB_3B: [
    { who: "goblin_chief", emotion: "開心", text: "告示拼回來了！上面寫著……" },
    { who: "goblin_chief", emotion: "驚訝", text: "「蝙蝠王在東邊的洞裡大吵大鬧」！" }
  ],
  D_GOB_4A: [
    { who: "goblin_chief", emotion: "生氣", text: "噪音蝙蝠王吵得大家睡不著。" },
    { who: "goblin_chief", emotion: "擔心", text: "牠在部落東邊的小洞裡，拜託你！" }
  ],
  D_GOB_4B: [
    { who: "goblin_chief", emotion: "開心", text: "終於安靜了！大家可以好好睡覺。" },
    { who: "narrator", emotion: "開心", text: "你拿回了「國語之光」！" },
    { who: "goblin_chief", emotion: "擔心", text: "聽說基隆港一直在下奇怪的雨。" }
  ],
  D_BOSS_BAT_A: [
    { who: "noise_bat", emotion: "生氣", text: "吱吱吱！好吵好吵，字都亂跑了！" },
    { who: "pet", emotion: "平靜", text: "一個字一個字讀，讓牠安靜下來！" }
  ],
  D_BOSS_BAT_B: [
    { who: "noise_bat", emotion: "平靜", text: "吱……好安靜。我可以好好睡了。" }
  ],

  // ═════════════ 月世界泥岩丘・獸人族 ═════════════
  D_ORC_LOCK: [
    { who: "orc_chief", emotion: "生氣", text: "大家在吵架，現在沒空聽你說。" },
    { who: "pet", emotion: "平靜", text: "先拿回「數學之光」和「國語之光」吧！" },
    { who: "pet", emotion: "平靜", text: "有了這兩道光，族長才聽得進去。" }
  ],
  D_ORC_1A: [
    { who: "orc_chief", emotion: "擔心", text: "月世界的泥岩丘，草少，獵物也少。" },
    { who: "orc_chief", emotion: "生氣", text: "霧來了以後，大家都在搶獵場。" },
    { who: "orc_chief", emotion: "擔心", text: "你能幫我們想出公平的辦法嗎？" }
  ],
  D_ORC_1B: [
    { who: "orc_chief", emotion: "開心", text: "一起討論、一起遵守，真好！" },
    { who: "orc_chief", emotion: "平靜", text: "大門外的獵人也需要幫忙。" }
  ],
  D_ORC_2A: [
    { who: "orc", emotion: "擔心", text: "營地裡每天都吵吵鬧鬧的。" },
    { who: "orc", emotion: "擔心", text: "要怎麼照顧自己、和家人好好相處？" }
  ],
  D_ORC_2B: [
    { who: "orc", emotion: "開心", text: "謝謝你！營地變得好和氣。" },
    { who: "orc", emotion: "擔心", text: "可是柵欄的鑰匙被野豬叼走了。" }
  ],
  D_ORC_3A: [
    { who: "orc_chief", emotion: "生氣", text: "泥岩溝裡的野豬叼走了柵欄鑰匙。" },
    { who: "orc_chief", emotion: "平靜", text: "讓牠們清醒，找回 3 把鑰匙。" }
  ],
  D_ORC_3B: [
    { who: "orc_chief", emotion: "開心", text: "柵欄可以關好了，謝謝！" },
    { who: "orc_chief", emotion: "驚訝", text: "可是南邊的石像突然動起來了！" }
  ],
  D_ORC_4A: [
    { who: "orc_chief", emotion: "擔心", text: "暴躁石像在南邊的泥岩溝裡亂撞。" },
    { who: "orc_chief", emotion: "擔心", text: "它忘了大家一起訂的規則，拜託你！" }
  ],
  D_ORC_4B: [
    { who: "orc_chief", emotion: "開心", text: "石像安靜下來了，月世界又和平了。" },
    { who: "narrator", emotion: "開心", text: "你拿回了「社會之光」！" },
    { who: "pet", emotion: "開心", text: "五道光都到齊了嗎？搭車回金包里吧！" }
  ],
  D_BOSS_GOLEM_A: [
    { who: "angry_golem", emotion: "生氣", text: "咚！咚！規則是什麼？我不記得！" },
    { who: "pet", emotion: "平靜", text: "我們一起想想，大家要怎麼相處！" }
  ],
  D_BOSS_GOLEM_B: [
    { who: "angry_golem", emotion: "平靜", text: "咚……我想起來了。要輪流，要分享。" }
  ],

  // ═════════════ 主線收尾 ═════════════
  D_LAMPS_A: [
    { who: "chief", emotion: "開心", text: "五道光都拿回來了！真厲害！",
      taigi: { hanji: "五葩燈的光攏提轉來矣！真讚！", tailo: "Gōo pha ting ê kng lóng the̍h tńg--lâi--ah! Tsin tsán!", huayu: "五盞燈的光都拿回來了！真棒！" } },
    { who: "chief", emotion: "平靜", text: "每盞燈前答對一題，燈就會亮。",
      taigi: { hanji: "每葩燈頭前回答著一題，燈就會光。", tailo: "Muí pha ting thâu-tsîng huê-tap tio̍h tsi̍t tê, ting tō ē kng.", huayu: "每盞燈前答對一題，燈就會亮。" } }
  ],
  D_LAMPS_B: [
    { who: "narrator", emotion: "開心", text: "五盞知識燈一起亮了起來！" },
    { who: "chief", emotion: "擔心", text: "可是霧還沒散……霧魔在古城塔頂。",
      taigi: { hanji: "毋過霧猶未散……霧的妖怪佇府城的塔頂懸。", tailo: "M̄-koh bū iáu-buē suànn...... Bū ê iau-kuài tī Hú-siânn ê thah tíng-kuân.", huayu: "可是霧還沒散……霧魔在古城塔頂。" } },
    { who: "chief", emotion: "平靜", text: "搭客運到府城古城，去找城主吧。",
      taigi: { hanji: "坐客運去府城，去揣城主。", tailo: "Tsē kheh-ūn khì Hú-siânn, khì tshuē siânn-tsú.", huayu: "搭客運去府城，去找城主。" } },
    { who: "pet", emotion: "開心", text: "我們一起把霧趕走！" }
  ],
  D_FINAL_LOCK: [
    { who: "king", emotion: "平靜", text: "歡迎來到府城古城，小冒險者。",
      taigi: { hanji: "歡迎來府城，細漢的勇者。", tailo: "Huan-gîng lâi Hú-siânn, sè-hàn ê ióng-tsiá.", huayu: "歡迎來到府城古城，小冒險者。" } },
    { who: "king", emotion: "平靜", text: "先點亮金包里的五盞燈，再來找我。",
      taigi: { hanji: "先去點金包里的五葩燈，才閣來揣我。", tailo: "Sing khì tiám Kim-pau-lí ê gōo pha ting, tsiah-koh lâi tshuē guá.", huayu: "先點亮金包里的五盞燈，再來找我。" } }
  ],
  D_FINAL_A: [
    { who: "king", emotion: "驚訝", text: "你就是點亮五盞燈的冒險者嗎？",
      taigi: { hanji: "你敢是點五葩燈的勇者？", tailo: "Lí kám-sī tiám gōo pha ting ê ióng-tsiá?", huayu: "你就是點亮五盞燈的冒險者嗎？" } },
    { who: "king", emotion: "擔心", text: "霧魔在古城塔頂，樓梯在城主府後面。",
      taigi: { hanji: "霧的妖怪佇府城的塔頂懸，樓梯佇阮兜後壁。", tailo: "Bū ê iau-kuài tī Hú-siânn ê thah tíng-kuân, lâu-thui tī guán tau āu-piah.", huayu: "霧魔在古城塔頂，樓梯在城主府後面。" } },
    { who: "king", emotion: "擔心", text: "它會用五科的題目考你，要小心。",
      taigi: { hanji: "伊會用五科的題目考你，愛細膩。", tailo: "I ē īng gōo kho ê tê-bo̍k khó lí, ài sè-jī.", huayu: "它會用五科的題目考你，要小心。" } },
    { who: "pet", emotion: "開心", text: "不怕！學過的東西都在心裡！" }
  ],
  D_FINAL_B: [
    { who: "king", emotion: "開心", text: "霧散了！大家都想起來了！",
      taigi: { hanji: "霧散矣！逐家攏想起來矣！", tailo: "Bū suànn--ah! Ta̍k-ke lóng siūnn khí-lâi--ah!", huayu: "霧散了！大家都想起來了！" } },
    { who: "king", emotion: "開心", text: "謝謝你，{name}。你是美麗島的勇者。",
      taigi: { hanji: "多謝你！你是美麗島的勇者。", tailo: "To-siā--lí! Lí sī Bí-lē-tó ê ióng-tsiá.", huayu: "謝謝你，{name}。你是美麗島的勇者。" } }
  ],
  D_BOSS_FOG_A: [
    { who: "fog_demon", emotion: "神祕", text: "呼呼……把學過的，全部忘掉吧……" },
    { who: "pet", text: "才不會忘！五道光，一起亮起來！" }
  ],
  D_BOSS_FOG_B: [
    { who: "fog_demon", emotion: "神祕", text: "好亮……原來，知識是忘不掉的……" }
  ],
  D_ENDING: [
    { who: "narrator", emotion: "開心", text: "遺忘霧散了，天空變得好藍。" },
    { who: "narrator", emotion: "開心", text: "金包里的漁港點起燈火，大家一起慶祝。" },
    { who: "chief", emotion: "開心", text: "謝謝你！金包里又亮起來了！",
      taigi: { hanji: "多謝你！金包里閣光起來矣！", tailo: "To-siā--lí! Kim-pau-lí koh kng khí-lâi--ah!", huayu: "謝謝你！金包里又亮起來了！" } },
    { who: "pet", emotion: "開心", text: "{name}，下次冒險還要一起去喔！" }
  ],

  // ═════════════ 村民委託 ═════════════
  D_BOOK_A: [
    { who: "bookstore", text: "圖書館的書全被霧弄亂了。",
      taigi: { hanji: "圖書館的冊，攏予霧舞甲亂操操矣。", tailo: "Tôo-su-kuán ê tsheh, lóng hōo bū bú kah luān-tshau-tshau--ah.", huayu: "圖書館的書全被霧弄亂了。" } },
    { who: "bookstore", text: "幫我想一想，書要怎麼排才好找？",
      taigi: { hanji: "共我想看覓，冊愛按怎排，才揣會著？", tailo: "Kā guá siūnn khuànn-māi, tsheh ài án-tsuánn pâi, tsiah tshuē ē tio̍h?", huayu: "幫我想一想，書要怎麼排才好找？" } },
    { who: "bookstore", text: "答對 3 題，我就送你一張引導卡。",
      taigi: { hanji: "回答著三題，我就送你一張卡片。", tailo: "Huê-tap tio̍h sann tê, guá tō sàng lí tsi̍t tiunn khah-phìnn.", huayu: "答對 3 題，我就送你一張引導卡。" } }
  ],
  D_BOOK_B: [
    { who: "bookstore", text: "書架整整齊齊的，謝謝你！",
      taigi: { hanji: "冊架仔整整齊齊，多謝你！", tailo: "Tsheh-kè-á tsíng-tsíng-tsê-tsê, to-siā--lí!", huayu: "書架整整齊齊的，謝謝你！" } },
    { who: "bookstore", text: "讀過的東西，會一直陪著你。",
      taigi: { hanji: "讀過的物件，會一直陪你。", tailo: "Tha̍k--kuè ê mi̍h-kiānn, ē it-ti̍t puê lí.", huayu: "讀過的東西，會一直陪著你。" } }
  ],
  D_POTATO_A: [
    { who: "potato_seller", text: "來喔！金包里的地瓜很好吃！",
      taigi: { hanji: "來喔！金包里的番薯真好食！", tailo: "Lâi--ooh! Kim-pau-lí ê han-tsî tsin hó-tsia̍h!", huayu: "來喔！金包里的地瓜很好吃！" } },
    { who: "potato_seller", text: "烤地瓜要先秤重，才能賣。",
      taigi: { hanji: "烘番薯愛先秤，才會使賣。", tailo: "Hang han-tsî ài sing tshìn, tsiah ē-sái bē.", huayu: "烤地瓜要先秤重，才能賣。" } },
    { who: "potato_seller", text: "霧讓我看不懂秤上的數字……",
      taigi: { hanji: "霧予我看無秤仔頂懸的數字……", tailo: "Bū hōo guá khuànn-bô tshìn-á tíng-kuân ê sòo-jī......", huayu: "霧讓我看不到秤上面的數字……" } },
    { who: "potato_seller", text: "幫我算算看，好嗎？",
      taigi: { hanji: "共我算看覓，好無？", tailo: "Kā guá sǹg khuànn-māi, hó--bô?", huayu: "幫我算算看，好嗎？" } }
  ],
  D_POTATO_B: [
    { who: "potato_seller", text: "謝謝！請你吃熱熱的烤地瓜。",
      taigi: { hanji: "多謝！請你食燒燒的烘番薯。", tailo: "To-siā! Tshiánn lí tsia̍h sio-sio ê hang han-tsî.", huayu: "謝謝！請你吃熱熱的烤地瓜。" } },
    { who: "pet", text: "哇！是我最喜歡的味道！" }
  ],
  D_STEAM_A: [
    { who: "hiker", text: "這裡的地上一直冒白煙。",
      taigi: { hanji: "遮的塗跤一直咧衝白煙。", tailo: "Tsia ê thôo-kha it-ti̍t teh tshìng pe̍h-ian.", huayu: "這裡的地上一直在冒白煙。" } },
    { who: "hiker", text: "走步道要小心，不要靠近噴氣孔。",
      taigi: { hanji: "行步道愛細膩，莫倚近衝煙的空。", tailo: "Kiânn pōo-tō ài sè-jī, mài uá-kīn tshìng ian ê khang.", huayu: "走步道要小心，不要靠近冒煙的洞。" } },
    { who: "hiker", text: "霧讓我忘了風和溶解的道理……",
      taigi: { hanji: "霧予我袂記得風，佮物件溶去的道理……", tailo: "Bū hōo guá bē-kì-tit hong, kah mi̍h-kiānn iûnn--khì ê tō-lí......", huayu: "霧讓我忘了風和溶解的道理……" } },
    { who: "hiker", text: "你可以幫我想一想嗎？",
      taigi: { hanji: "你會使共我想看覓無？", tailo: "Lí ē-sái kā guá siūnn khuànn-māi--bô?", huayu: "你可以幫我想想看嗎？" } }
  ],
  D_STEAM_B: [
    { who: "hiker", text: "原來是這樣！謝謝你喔！",
      taigi: { hanji: "原來是按呢！多謝你喔！", tailo: "Guân-lâi sī án-ne! To-siā--lí--ooh!", huayu: "原來是這樣！謝謝你喔！" } }
  ],
  D_LOST_A: [
    { who: "elf_kid_lost", text: "嗚嗚，我在密林裡迷路了。" },
    { who: "elf_kid_lost", text: "我忘了怎麼回家，也忘了家裡的約定。" }
  ],
  D_LOST_B: [
    { who: "elf_kid_lost", text: "我想起回家的路了！謝謝你！" },
    { who: "elf_kid_lost", text: "樹屋村就在森林北邊喔。" }
  ],
  D_MEASURE_A: [
    { who: "gnome_measure", text: "量木板要用尺，可是霧讓我忘了。" },
    { who: "gnome_measure", text: "刻度怎麼看？形狀叫什麼？幫幫我！" }
  ],
  D_MEASURE_B: [
    { who: "gnome_measure", text: "量得剛剛好！送你一顆回音水晶。" }
  ],
  D_ECHO_A: [
    { who: "goblin_kid_echo", text: "喂——喂——洞裡會有回音喔！" },
    { who: "goblin_kid_echo", text: "我們來玩猜詞語的遊戲吧！" }
  ],
  D_ECHO_B: [
    { who: "goblin_kid_echo", text: "你好會猜！我要回部落了。" },
    { who: "goblin_kid_echo", text: "部落在洞窟東北邊的深處喔。" }
  ],
  D_PIGGY_A: [
    { who: "orc_bank", text: "我們營地學堂的班上，想買盆栽。" },
    { who: "orc_bank", text: "班費要怎麼收、怎麼用，大家吵不停。" },
    { who: "orc_bank", text: "霧讓我忘了怎麼開班會，幫幫我！" }
  ],
  D_PIGGY_B: [
    { who: "orc_bank", text: "大家一起討論，訂好計畫了！" },
    { who: "orc_bank", text: "教室有了盆栽，變得好漂亮。" }
  ],
  D_MAGNET_A: [
    { who: "blacksmith", text: "打鐵的時候，我用磁鐵撿鐵釘。",
      taigi: { hanji: "拍鐵的時，我用吸石抾鐵釘。", tailo: "Phah-thih ê sî, guá īng khip-tsio̍h khioh thih-ting.", huayu: "打鐵的時候，我用磁鐵撿鐵釘。" } },
    { who: "blacksmith", text: "霧讓我忘了磁鐵會吸哪些東西。",
      taigi: { hanji: "霧予我袂記得吸石會吸啥物。", tailo: "Bū hōo guá bē-kì-tit khip-tsio̍h ē khip siánn-mih.", huayu: "霧讓我忘了磁鐵會吸什麼。" } }
  ],
  D_MAGNET_B: [
    { who: "blacksmith", text: "想起來了！這顆水晶送你。",
      taigi: { hanji: "想起來矣！這粒水晶送你。", tailo: "Siūnn khí-lâi--ah! Tsit lia̍p tsuí-tsinn sàng lí.", huayu: "想起來了！這顆水晶送你。" } }
  ],
  D_TARO_A: [
    { who: "taro_seller", text: "來喔，熱熱的芋圓！",
      taigi: { hanji: "來喔，燒燒的芋圓！", tailo: "Lâi--ooh, sio-sio ê ōo-înn!", huayu: "來喔，熱熱的芋圓！" } },
    { who: "taro_seller", text: "芋圓要平分到每一碗，",
      taigi: { hanji: "芋圓愛平分予每一碗，", tailo: "Ōo-înn ài pênn-pun hōo muí tsi̍t uánn,", huayu: "芋圓要平分給每一碗，" } },
    { who: "taro_seller", text: "一碗放幾顆呢？霧讓我算不出來。",
      taigi: { hanji: "一碗愛囥幾粒？霧予我算袂出來。", tailo: "Tsi̍t uánn ài khǹg kuí lia̍p? Bū hōo guá sǹg bē tshut--lâi.", huayu: "一碗放幾顆呢？霧讓我算不出來。" } }
  ],
  D_TARO_B: [
    { who: "taro_seller", text: "剛好分完！你真聰明。",
      taigi: { hanji: "拄好分了！你真巧。", tailo: "Tú-hó pun liáu! Lí tsin khiáu.", huayu: "剛好分完！你真聰明。" } }
  ],
  D_LIB_A: [
    { who: "librarian", text: "古城圖書館的英文書被霧弄亂了。",
      taigi: { hanji: "府城圖書館的英文冊，攏予霧舞甲亂操操矣。", tailo: "Hú-siânn tôo-su-kuán ê Ing-bûn tsheh, lóng hōo bū bú kah luān-tshau-tshau--ah.", huayu: "古城圖書館的英文書被霧弄亂了。" } },
    { who: "librarian", text: "幫我讀讀看，書上寫了什麼？",
      taigi: { hanji: "共我讀看覓，冊頂懸寫啥物？", tailo: "Kā guá tha̍k khuànn-māi, tsheh tíng-kuân siá siánn-mih?", huayu: "幫我讀讀看，書上寫了什麼？" } }
  ],
  D_LIB_B: [
    { who: "librarian", text: "謝謝你！書都回到書架上了。",
      taigi: { hanji: "多謝你！冊攏轉去冊架仔頂懸矣。", tailo: "To-siā--lí! Tsheh lóng tńg-khì tsheh-kè-á tíng-kuân--ah.", huayu: "謝謝你！書都回到書架上了。" } }
  ],

  // ═════════════ NPC 平常的話 ═════════════
  D_CHIEF_IDLE: [
    { who: "chief", text: "把光都拿回來，燈就會亮。",
      taigi: { hanji: "共光攏提轉來，燈就會光。", tailo: "Kā kng lóng the̍h tńg--lâi, ting tō ē kng.", huayu: "把光都拿回來，燈就會亮。" } }
  ],
  D_TEMPLE_IDLE: [
    { who: "temple_keeper", text: "吃飽了嗎？廟埕這裡很涼喔。",
      taigi: { hanji: "食飽未？廟埕遮真涼喔。", tailo: "Tsia̍h-pá--buē? Biō-tiânn tsia tsin liâng--ooh.", huayu: "吃飽了嗎？廟埕這裡很涼喔。" } },
    { who: "temple_keeper", text: "大家常常來廟埕聊天、乘涼。",
      taigi: { hanji: "逐家定定來廟埕開講、歇涼。", tailo: "Ta̍k-ke tiānn-tiānn lâi biō-tiânn khai-káng, hioh-liâng.", huayu: "大家常常來廟埕聊天、乘涼。" } },
    { who: "temple_keeper", text: "出門要看紅綠燈，早點回來喔。",
      taigi: { hanji: "出門愛看青紅燈，較早轉來喔。", tailo: "Tshut-mn̂g ài khuànn tshenn-âng-ting, khah tsá tńg--lâi--ooh.", huayu: "出門要看紅綠燈，早點回來喔。" } }
  ],
  // ═════════════ 金包里慈護宮：第一次轉職（v0.9.5，36 號 v5 第七節）═════════════
  // 依 36 號 7.1 官方資料（S202–S204）；傳說一律用「相傳」。不讓神明說話，不寫點香、擲筊、求籤、收費或因果。
  // 轉職的祝福由廟公說，一定要說「這是你自己努力得來的」（36 號 7.3）。
  D_TEMPLE_INTRO: [
    { who: "temple_keeper", emotion: "平靜", text: "這裡是金包里慈護宮，金山人都叫它「大廟」。",
      taigi: { hanji: "這是金包里慈護宮，金山人攏叫伊「大廟」。", tailo: "Tse sī Kim-pau-lí Tsû-hōo-kiong, Kim-san-lâng lóng kiò i “Tuā-biō”.", huayu: "這裡是金包里慈護宮，金山人都叫它「大廟」。" } },
    { who: "temple_keeper", emotion: "平靜", text: "廟裡主要拜金面媽祖，已經有兩百多年了。",
      taigi: { hanji: "廟內主要拜金面媽祖，已經兩百外年矣。", tailo: "Biō lāi tsú-iàu pài Kim-bīn Má-tsóo, í-king nn̄g-pah guā nî--ah.", huayu: "廟裡主要拜金面媽祖，已經有兩百多年了。" } },
    { who: "temple_keeper", emotion: "神祕", text: "相傳二媽的神像從海上漂到野柳海岸，被漁民發現。",
      taigi: { hanji: "相傳二媽的神像流到野柳的海墘，予討海人看著。", tailo: "Siong-thuân Jī-má ê sîn-siōng lâu kàu Iá-liú ê hái-kînn, hōo thó-hái-lâng khuànn--tio̍h.", huayu: "相傳二媽的神像從海上漂到野柳海岸，被漁民發現。" } }
  ],
  D_TEMPLE_BLESS: [
    { who: "temple_keeper", emotion: "開心", text: "你這陣子真認真，這是你自己努力得來的！",
      taigi: { hanji: "你這站足認真，這攏是你家己拍拚來的！", tailo: "Lí tsit-tsām tsiok jīn-tsin, tse lóng sī lí ka-kī phah-piànn lâi--ê!", huayu: "你這陣子真認真，這是你自己努力得來的！" } },
    // 老闆 2026-10-13：把「你」去掉。保庇不帶受詞結尾，依辭典用例「磕頭求神明保庇。」「拜請眾神來保庇。」
    { who: "temple_keeper", emotion: "開心", text: "一路平安，媽祖也會保佑。",
      taigi: { hanji: "一路平安，媽祖嘛會保庇。", tailo: "Tsi̍t-lōo pîng-an, Má-tsóo mā ē pó-pì.", huayu: "一路平安，媽祖也會保佑。" } }
  ],
  D_TEMPLE_JOB_DONE: [
    { who: "pet", emotion: "開心", text: "哇，身上亮亮的！新職業也要五科一起加油喔！" }
  ],

  // ═════════════ v1.0 第一批：立志小考與轉職（48 號 v2 第 4 節、2.4、第 5 節；F11）═════════════
  // 主持：慈護宮＝廟公（_TEMPLE），府城職業公會＝公會導師（_GUILD），規則相同。番薯仔、旁白講華語。
  // 規則用語照 48 號：20 題、五科各 4 題、答對 16 題及格；念完題目才計時；不能用提示和卡片；
  // 中途離開算考一次；沒通過隔天才能再考；轉職從 Lv1 開始、能力有保底；以前當過的職業免費換回去。
  // 不寫因果、不寫迷信誘導；鼓勵努力。
  D_TEMPLE_LOCKED: [
    { who: "temple_keeper", emotion: "平靜", text: "見習冒險者到 10 級，才能來考立志小考喔。",
      taigi: { hanji: "見習冒險者到十級，才會使來考立志小考喔。", tailo: "Kiàn-si̍p mōo-hiám-tsiá kàu tsa̍p kip, tsiah ē-sái lâi khó li̍p-tsì sió-khó--ooh.", huayu: "見習冒險者到 10 級，才能來考立志小考喔。" } }
  ],
  D_TRIAL_INTRO_TEMPLE: [
    { who: "temple_keeper", emotion: "平靜", text: "想換職業，要先考立志小考喔。",
      taigi: { hanji: "欲換職業，愛先考立志小考喔。", tailo: "Beh uānn tsit-gia̍p, ài sing khó li̍p-tsì sió-khó--ooh.", huayu: "想換職業，要先考立志小考喔。" } },
    { who: "temple_keeper", emotion: "平靜", text: "總共 20 題，五科每科 4 題，答對 16 題就過關。",
      taigi: { hanji: "攏總二十題，五科逐科四題，回答著十六題就過關。", tailo: "Lóng-tsóng jī-tsa̍p tê, gōo kho ta̍k kho sì tê, huê-tap tio̍h tsa̍p-la̍k tê tō kuè-kuan.", huayu: "總共 20 題，五科每科 4 題，答對 16 題就過關。" } },
    { who: "temple_keeper", emotion: "平靜", text: "題目會念給你聽，念完才開始算時間。",
      taigi: { hanji: "題目會念予你聽，念了才開始算時間。", tailo: "Tê-bo̍k ē liām hōo lí thiann, liām liáu tsiah khai-sí sǹg sî-kan.", huayu: "題目會念給你聽，念完才開始算時間。" } },
    { who: "temple_keeper", emotion: "平靜", text: "提示和卡片不能用；中途離開也算考一次。",
      taigi: { hanji: "提示佮卡片袂使用；中途離開，嘛算考一擺。", tailo: "Thê-sī kah khah-phìnn bē-sái īng; tiong-tôo lī-khui, mā sǹg khó tsi̍t pái.", huayu: "提示和卡片不能用；中途離開也算考一次。" } }
  ],
  D_TRIAL_INTRO_GUILD: [
    { who: "guild", emotion: "開心", text: "要換新職業，先來考立志小考吧！",
      taigi: { hanji: "欲換新的職業，先來考立志小考！", tailo: "Beh uānn sin ê tsit-gia̍p, sing lâi khó li̍p-tsì sió-khó!", huayu: "要換新職業，先來考立志小考吧！" } },
    { who: "guild", emotion: "平靜", text: "總共 20 題，五科每科 4 題，答對 16 題就過關。",
      taigi: { hanji: "攏總二十題，五科逐科四題，回答著十六題就過關。", tailo: "Lóng-tsóng jī-tsa̍p tê, gōo kho ta̍k kho sì tê, huê-tap tio̍h tsa̍p-la̍k tê tō kuè-kuan.", huayu: "總共 20 題，五科每科 4 題，答對 16 題就過關。" } },
    { who: "guild", emotion: "平靜", text: "題目念完，才開始算時間，慢慢聽清楚。",
      taigi: { hanji: "題目念了，才開始算時間，慢慢仔聽予清楚。", tailo: "Tê-bo̍k liām liáu, tsiah khai-sí sǹg sî-kan, bān-bān-á thiann hōo tshing-tshó.", huayu: "題目念完，才開始算時間，慢慢聽清楚。" } },
    { who: "guild", emotion: "平靜", text: "提示和卡片不能用；中途離開也算考一次。",
      taigi: { hanji: "提示佮卡片袂使用；中途離開，嘛算考一擺。", tailo: "Thê-sī kah khah-phìnn bē-sái īng; tiong-tôo lī-khui, mā sǹg khó tsi̍t pái.", huayu: "提示和卡片不能用；中途離開也算考一次。" } }
  ],
  D_TRIAL_PASS_TEMPLE: [
    // 老闆 2026-10-13「說話統一一致」：和公會導師 D_TRIAL_PASS_GUILD_0 相同。𠢕（gâu）是擴充 B 區字，前端負責替代顯示
    { who: "temple_keeper", emotion: "開心", text: "恭喜你！祝你越來越厲害喔！",
      taigi: { hanji: "恭喜你！祝你愈來愈𠢕喔！", tailo: "Kiong-hí--lí! Tsiok lí jú lâi jú gâu--ooh!", huayu: "恭喜你！祝你越來越厲害喔！" } }
  ],
  D_TRIAL_PASS_GUILD: [
    // 老闆 2026-10-13 選定候選 B（原句「真好，立志小考過關矣！」語意不通順、太生硬）。𠢕（gâu）是擴充 B 區字，前端負責替代顯示
    { who: "guild", emotion: "開心", text: "恭喜你！祝你越來越厲害喔！",
      taigi: { hanji: "恭喜你！祝你愈來愈𠢕喔！", tailo: "Kiong-hí--lí! Tsiok lí jú lâi jú gâu--ooh!", huayu: "恭喜你！祝你越來越厲害喔！" } },
    { who: "guild", emotion: "開心", text: "這是你自己努力得來的，新職業也要加油！",
      taigi: { hanji: "這是你家己拍拚來的，新職業嘛愛加油！", tailo: "Tse sī lí ka-kī phah-piànn lâi--ê, sin tsit-gia̍p mā ài ka-iû!", huayu: "這是你自己努力得來的，新職業也要加油！" } }
  ],
  D_TRIAL_FAIL_TEMPLE: [
    { who: "temple_keeper", emotion: "平靜", text: "這次還沒過，沒關係。",
      taigi: { hanji: "這擺猶未過關，無要緊。", tailo: "Tsit pái iáu-buē kuè-kuan, bô iàu-kín.", huayu: "這次還沒過，沒關係。" } },
    { who: "temple_keeper", emotion: "平靜", text: "答錯的單元回去多練習，明天可以再來考。",
      taigi: { hanji: "毋著的單元轉去加練習，明仔載會使閣來考。", tailo: "M̄-tio̍h ê tan-guân tńg-khì ke liān-si̍p, bîn-á-tsài ē-sái koh lâi khó.", huayu: "答錯的單元回去多練習，明天可以再來考。" } },
    { who: "temple_keeper", emotion: "開心", text: "當見習冒險者，一樣能打倒魔王喔！",
      taigi: { hanji: "做見習冒險者，仝款會當拍贏魔王喔！", tailo: "Tsò kiàn-si̍p mōo-hiám-tsiá, kāng-khuán ē-tàng phah-iânn môo-ông--ooh!", huayu: "當見習冒險者，一樣能打倒魔王喔！" } }
  ],
  D_TRIAL_FAIL_GUILD: [
    { who: "guild", emotion: "平靜", text: "這次還沒過，沒關係。",
      taigi: { hanji: "這擺猶未過關，無要緊。", tailo: "Tsit pái iáu-buē kuè-kuan, bô iàu-kín.", huayu: "這次還沒過，沒關係。" } },
    { who: "guild", emotion: "平靜", text: "把答錯的單元多練習，明天再來考。",
      taigi: { hanji: "共毋著的單元加練習，明仔載閣來考。", tailo: "Kā m̄-tio̍h ê tan-guân ke liān-si̍p, bîn-á-tsài koh lâi khó.", huayu: "把答錯的單元多練習，明天再來考。" } },
    { who: "guild", emotion: "開心", text: "當見習冒險者也能打倒魔王，不用煩惱！",
      taigi: { hanji: "做見習冒險者嘛會當拍贏魔王，免煩惱！", tailo: "Tsò kiàn-si̍p mōo-hiám-tsiá mā ē-tàng phah-iânn môo-ông, bián huân-ló!", huayu: "當見習冒險者也能打倒魔王，不用煩惱！" } }
  ],
  D_TRIAL_AGAIN_TEMPLE: [
    { who: "temple_keeper", emotion: "平靜", text: "今天已經考一次了，明天再來喔。",
      taigi: { hanji: "今仔日已經考一擺矣，明仔載才閣來喔。", tailo: "Kin-á-ji̍t í-king khó tsi̍t pái--ah, bîn-á-tsài tsiah koh lâi--ooh.", huayu: "今天已經考一次了，明天再來喔。" } }
  ],
  D_TRIAL_AGAIN_GUILD: [
    { who: "guild", emotion: "平靜", text: "今天已經考一次了，明天再來喔。",
      taigi: { hanji: "今仔日已經考一擺矣，明仔載才閣來喔。", tailo: "Kin-á-ji̍t í-king khó tsi̍t pái--ah, bîn-á-tsài tsiah koh lâi--ooh.", huayu: "今天已經考一次了，明天再來喔。" } }
  ],
  D_JOB_LV1_TEMPLE: [
    { who: "temple_keeper", emotion: "平靜", text: "換了職業，等級會從 1 開始。",
      taigi: { hanji: "換職業了後，等級會對一級開始。", tailo: "Uānn tsit-gia̍p liáu-āu, tíng-kip ē tuì tsi̍t kip khai-sí.", huayu: "換了職業，等級會從 1 開始。" } },
    { who: "temple_keeper", emotion: "開心", text: "不過能力有保底，不會少太多，不用擔心。",
      taigi: { hanji: "毋過能力袂減傷濟，免煩惱。", tailo: "M̄-koh lîng-li̍k bē kiám siunn tsē, bián huân-ló.", huayu: "不過能力有保底，不會少太多，不用擔心。" } }
  ],
  D_JOB_LV1_GUILD: [
    { who: "guild", emotion: "平靜", text: "提醒你：換職業以後，等級從 1 開始喔。",
      taigi: { hanji: "共你提醒：換職業了後，等級對一級開始喔。", tailo: "Kā lí thê-tshénn: uānn tsit-gia̍p liáu-āu, tíng-kip tuì tsi̍t kip khai-sí--ooh.", huayu: "提醒你：換職業以後，等級從 1 開始喔。" } },
    { who: "guild", emotion: "開心", text: "能力有保底，不會少太多，放心！",
      taigi: { hanji: "能力袂減傷濟，放心！", tailo: "Lîng-li̍k bē kiám siunn tsē, hòng-sim!", huayu: "能力有保底，不會少太多，放心！" } }
  ],
  D_JOB_BACK_TEMPLE: [
    { who: "temple_keeper", emotion: "開心", text: "這個職業你以前當過，免費換回去，不用考試。",
      taigi: { hanji: "這个職業你以早做過，免錢換轉去，免考試。", tailo: "Tsit ê tsit-gia̍p lí í-tsá tsò--kuè, bián-tsînn uānn tńg-khì, bián khó-tshì.", huayu: "這個職業你以前當過，免費換回去，不用考試。" } },
    { who: "temple_keeper", emotion: "平靜", text: "等級也會和以前一樣喔。",
      taigi: { hanji: "等級嘛會佮以早仝款喔。", tailo: "Tíng-kip mā ē kah í-tsá kāng-khuán--ooh.", huayu: "等級也會和以前一樣喔。" } }
  ],
  D_JOB_BACK_GUILD: [
    { who: "guild", emotion: "開心", text: "你當過這個職業，可以免費換回去喔。",
      taigi: { hanji: "你做過這个職業，會使免錢換轉去喔。", tailo: "Lí tsò-kuè tsit ê tsit-gia̍p, ē-sái bián-tsînn uānn tńg-khì--ooh.", huayu: "你當過這個職業，可以免費換回去喔。" } },
    { who: "guild", emotion: "平靜", text: "不用考試，等級也和以前一樣。",
      taigi: { hanji: "免考試，等級嘛佮以早仝款。", tailo: "Bián khó-tshì, tíng-kip mā kah í-tsá kāng-khuán.", huayu: "不用考試，等級也和以前一樣。" } }
  ],
  // 番薯仔（華語）：每 5 題打氣（依序第 5、10、15 題後）、答錯、沒通過、上次中途離開
  D_TRIAL_CHEER: [
    { who: "pet", emotion: "開心", text: "已經 5 題了！慢慢想，你可以的！" },
    { who: "pet", emotion: "開心", text: "一半了！深呼吸，繼續加油！" },
    { who: "pet", emotion: "開心", text: "剩下 5 題，我們一起加油！" }
  ],
  D_TRIAL_WRONG: [
    { who: "pet", emotion: "平靜", text: "沒關係，記下來就好！" }
  ],
  D_TRIAL_FAIL_PET: [
    { who: "pet", emotion: "開心", text: "沒關係！我們去做委託、開寶箱多練習，明天再來！" }
  ],
  D_TRIAL_QUIT_PET: [
    { who: "pet", emotion: "平靜", text: "上次小考中途離開，也算考一次喔。明天再一起加油！" }
  ],
  // 舊存檔升級（48 號 v2 第 5 節，旁白）
  D_MIGRATE_V3: [
    { who: "narrator", emotion: "開心", text: "勇者大冒險更新了！現在有更多職業和技能。" },
    { who: "narrator", emotion: "平靜", text: "你原本的職業和等級已經換算好，能力不會比以前低。" },
    { who: "narrator", emotion: "平靜", text: "頭目每個階段都要答對 2 題，才會換到下一個階段。" }
  ],
  D_MIGRATE_ROBE: [
    { who: "narrator", emotion: "平靜", text: "法袍不適合你現在的職業，已經換成同樣價錢的防具。" }
  ],
  D_MIGRATE_ROBE_NOVICE: [
    { who: "narrator", emotion: "平靜", text: "見習不能穿法袍，已經換成旅行斗篷，再退你 800 枚金幣。" }
  ],
  D_BOOK_IDLE: [
    { who: "bookstore", text: "不會的題目，提示會說課本哪裡有教。",
      taigi: { hanji: "袂曉的題目，提示會講課本佗位有教。", tailo: "Bē-hiáu ê tê-bo̍k, thê-sī ē kóng khò-pún tó-uī ū kà.", huayu: "不會的題目，提示會說課本哪裡有教。" } }
  ],
  D_FISHER_IDLE: [
    { who: "fisher", text: "晚上的漁港，火光一閃一閃，很美喔。",
      taigi: { hanji: "暗時的漁港，火光閃閃爍爍，真媠喔。", tailo: "Àm-sî ê hî-káng, hué-kng siám-siám-sih-sih, tsin suí--ooh.", huayu: "晚上的漁港，火光一閃一閃，很美喔。" } },
    { who: "fisher", text: "出海以前，要先看天氣。",
      taigi: { hanji: "出海進前，愛先看天氣。", tailo: "Tshut-hái tsìn-tsîng, ài sing khuànn thinn-khì.", huayu: "出海以前，要先看天氣。" } }
  ],
  D_SHOP_IDLE: [
    { who: "shopkeeper", text: "歡迎光臨！藥草、卡片、木劍都有喔。",
      taigi: { hanji: "歡迎光臨！藥草、卡片、柴劍攏有喔。", tailo: "Huan-gîng kong-lîm! Io̍h-tsháu, khah-phìnn, tshâ-kiàm lóng ū--ooh.", huayu: "歡迎光臨！藥草、卡片、木劍都有喔。" } },
    { who: "shopkeeper", text: "老街的小吃很好吃喔！",
      taigi: { hanji: "舊街的點心真好食喔！", tailo: "Kū-ke ê tiám-sim tsin hó-tsia̍h--ooh!", huayu: "老街的小吃很好吃喔！" } }
  ],
  D_INN_IDLE: [
    { who: "innkeeper", text: "歡迎！泡一下溫泉，就有精神了。",
      taigi: { hanji: "歡迎！浸一下溫泉，就有元氣矣。", tailo: "Huan-gîng! Tsìm tsi̍t-ē un-tsuânn, tō ū guân-khì--ah.", huayu: "歡迎！泡一下溫泉，就有精神了。" } }
  ],
  // v0.9.4 D23（老闆裁示選 A）：住溫泉旅館要收費；金幣不夠時，只有金包里溫泉旅館可以免費住（每次都可以）
  D_INN_FREE: [
    { who: "innkeeper", emotion: "開心", text: "錢不夠也沒關係，阿伯讓你免費住一晚！",
      taigi: { hanji: "錢無夠嘛無要緊，阿伯予你免錢蹛一暝！", tailo: "Tsînn bô-kàu mā bô iàu-kín, a-peh hōo lí bián-tsînn tuà tsi̍t mê!", huayu: "錢不夠也沒關係，阿伯讓你免費住一晚！" } }
  ],
  D_POTATO_IDLE: [
    { who: "potato_seller", text: "烤地瓜香噴噴，吃一條再出發！",
      taigi: { hanji: "烘番薯芳貢貢，食一條才出發！", tailo: "Hang han-tsî phang-kòng-kòng, tsia̍h tsi̍t tiâu tsiah tshut-huat!", huayu: "烤地瓜香噴噴，吃一條再出發！" } }
  ],
  D_HIKER_IDLE: [
    { who: "hiker", text: "出門要帶水，慢慢走喔。",
      taigi: { hanji: "出門愛紮水，慢慢仔行喔。", tailo: "Tshut-mn̂g ài tsah tsuí, bān-bān-á kiânn--ooh.", huayu: "出門要帶水，慢慢走喔。" } }
  ],
  D_LOST_IDLE:        [{ who: "elf_kid_lost", text: "密林的路彎彎曲曲，要小心喔。" }],
  D_ELDER_IDLE:       [{ who: "elf_elder", text: "植物不會說話，但會用葉子告訴我們。" }],
  D_ELFKID_IDLE:      [{ who: "elf_kid", text: "風車轉起來的時候，好漂亮喔！" }],
  D_GNOME_CHIEF_IDLE: [{ who: "gnome_chief", text: "量兩次，切一次，這是地精的祕訣。" }],
  D_GNOME_IDLE:       [{ who: "gnome", text: "叮叮噹噹，我最喜歡做東西了。" }],
  D_MEASURE_IDLE:     [{ who: "gnome_measure", text: "量長度時，尺要從 0 對齊喔。" }],
  D_ECHO_IDLE:        [{ who: "goblin_kid_echo", text: "喂——喂——你聽到回音了嗎？" }],
  D_GOB_CHIEF_IDLE:   [{ who: "goblin_chief", text: "告示要寫清楚，大家才看得懂。" }],
  D_GOBKID_IDLE:      [{ who: "goblin_kid", text: "我最喜歡寫卡片給家人了。" }],
  D_ORC_CHIEF_IDLE:   [{ who: "orc_chief", text: "規則是大家一起訂、一起守的。" }],
  D_ORC_IDLE:         [{ who: "orc", text: "輪流用獵場，大家都有份。" }],
  D_ORC_BANK_IDLE:    [{ who: "orc_bank", text: "班費是大家的，用法要一起決定。" }],
  D_MERCHANT_IDLE:    [{ who: "merchant", text: "Hello!（你好！）山城的風景真美。" }],
  D_BLACKSMITH_IDLE: [
    { who: "blacksmith", text: "要買武器嗎？選適合你的就好。",
      taigi: { hanji: "欲買武器無？揀合你的就好。", tailo: "Beh bé bú-khì--bô? Kíng ha̍h lí ê tō hó.", huayu: "要買武器嗎？挑適合你的就好。" } }
  ],
  D_ARMOR_IDLE: [
    { who: "armor_keeper", text: "穿上防具，被打到比較不痛。",
      taigi: { hanji: "穿防具，予人拍著較袂疼。", tailo: "Tshīng hông-khū, hōo lâng phah-tio̍h khah bē thiànn.", huayu: "穿上防具，被打到比較不痛。" } }
  ],
  D_ITEM_IDLE: [
    { who: "item_keeper", text: "藥草和卡片，出門要帶喔！",
      taigi: { hanji: "藥草佮卡片，出門愛紮喔！", tailo: "Io̍h-tsháu kah khah-phìnn, tshut-mn̂g ài tsah--ooh!", huayu: "藥草和卡片，出門要帶喔！" } },
    { who: "item_keeper", text: "慢慢挑，不用急。",
      taigi: { hanji: "慢慢仔揀，免急。", tailo: "Bān-bān-á kíng, bián kip.", huayu: "慢慢挑，不用急。" } }
  ],
  D_PORT_INN_IDLE: [
    { who: "innkeeper_port", text: "歡迎來我們民宿，好好休息。",
      taigi: { hanji: "歡迎來阮民宿，好好仔歇睏。", tailo: "Huan-gîng lâi guán bîn-siok, hó-hó-á hioh-khùn.", huayu: "歡迎來我們民宿，好好休息。" } }
  ],
  D_TARO_IDLE: [
    { who: "taro_seller", text: "芋圓軟軟彈彈，吃了有精神！",
      taigi: { hanji: "芋圓軟軟韌韌，食了有元氣！", tailo: "Ōo-înn nńg-nńg jūn-jūn, tsia̍h liáu ū guân-khì!", huayu: "芋圓軟軟彈彈，吃了有精神！" } }
  ],
  D_KING_IDLE: [
    { who: "king", text: "府城古城就拜託你了，冒險者。",
      taigi: { hanji: "府城就拜託你矣，勇者。", tailo: "Hú-siânn tō pài-thok--lí--ah, ióng-tsiá.", huayu: "府城古城就拜託你了，冒險者。" } }
  ],
  // v1.0 第一批（48 號 v2 2.4、F11）：見習 10 級＋立志小考才能轉職；以前當過的職業免費換回去
  D_GUILD_IDLE: [
    { who: "guild", text: "見習冒險者到 10 級，就能來這裡考立志小考喔。",
      taigi: { hanji: "見習冒險者到十級，就會使來遮考立志小考喔。", tailo: "Kiàn-si̍p mōo-hiám-tsiá kàu tsa̍p kip, tō ē-sái lâi tsia khó li̍p-tsì sió-khó--ooh.", huayu: "見習冒險者到 10 級，就能來這裡考立志小考喔。" } }
  ],
  D_GUILD_JOB: [
    { who: "guild", text: "你已經 10 級了！想選哪一個職業？",
      taigi: { hanji: "你已經十級矣！想欲揀佗一个職業？", tailo: "Lí í-king tsa̍p kip--ah! Siūnn-beh kíng tó tsi̍t ê tsit-gia̍p?", huayu: "你已經 10 級了！想選哪一個職業？" } },
    { who: "guild", text: "新職業要考立志小考；以前當過的，免費換回去。",
      taigi: { hanji: "新的職業愛考立志小考；以早做過的，免錢換轉去。", tailo: "Sin ê tsit-gia̍p ài khó li̍p-tsì sió-khó; í-tsá tsò--kuè ê, bián-tsînn uānn tńg-khì.", huayu: "新職業要考立志小考；以前當過的，免費換回去。" } },
    { who: "pet", text: "不管選哪個，五科都要加油喔！" }
  ],
  D_LIBRARIAN_IDLE: [
    { who: "librarian", text: "圖書館要安靜，說話要小聲喔。",
      taigi: { hanji: "圖書館愛恬靜，講話愛細聲喔。", tailo: "Tôo-su-kuán ài tiām-tsīng, kóng-uē ài sè-siann--ooh.", huayu: "圖書館要安靜，說話要小聲喔。" } }
  ],

  // ═════════════ 各地旅店（v0.9.3 B14：每一家旅店都不一樣）═════════════
  // 地精、哥布林是奇幻種族，照 CTO 裁定講華語（不加 taigi）。
  D_INN_SHENMU: [
    { who: "inn_shenmu", emotion: "開心", text: "歡迎來樹屋住！聽著森林的聲音，好好睡一覺。",
      taigi: { hanji: "歡迎來樹仔頂的厝蹛！聽森林的聲，好好仔睏一暝。", tailo: "Huan-gîng lâi tshiū-á-tíng ê tshù tuà! Thiann sim-lîm ê siann, hó-hó-á khùn tsi̍t mê.", huayu: "歡迎來樹屋住！聽著森林的聲音，好好睡一覺。" } }
  ],
  D_INN_MANGROVE: [
    { who: "inn_mangrove", emotion: "開心", text: "歡迎來地精旅舍！今晚聽著潮水聲休息吧。" }
  ],
  D_INN_GOBLIN: [
    { who: "inn_goblin", emotion: "開心", text: "嘿嘿，歡迎住石屋客棧！洞裡很安靜，很好睡。" }
  ],
  D_INN_MOON: [
    { who: "inn_moon", emotion: "開心", text: "歡迎來營地！帳篷裡很涼快，好好休息。",
      taigi: { hanji: "歡迎來遮蹛！布棚內底真涼，好好仔歇睏。", tailo: "Huan-gîng lâi tsia tuà! Pòo-pênn lāi-té tsin liâng, hó-hó-á hioh-khùn.", huayu: "歡迎來營地！帳篷裡很涼快，好好休息。" } }
  ],
  D_INN_FUCHENG: [
    { who: "inn_fucheng", emotion: "開心", text: "歡迎光臨府城老客棧，讓你一夜好眠。",
      taigi: { hanji: "歡迎光臨府城的古早客棧，予你一暝睏甲真好勢。", tailo: "Huan-gîng kong-lîm Hú-siânn ê kóo-tsá kheh-tsàn, hōo lí tsi̍t mê khùn kah tsin hó-sè.", huayu: "歡迎光臨府城老客棧，讓你一夜好眠。" } }
  ],

  // ═════════════ 旅店：金幣不夠（v0.9.4 D23）═════════════
  // 金包里溫泉旅館以外的旅店要付錢；金幣不夠時提示回金包里溫泉旅館免費住，或去打怪賺金幣。
  D_INN_SHENMU_NOCOIN: [
    { who: "inn_shenmu", emotion: "擔心", text: "金幣不夠喔！回金包里溫泉旅館免費住，或去打怪賺金幣吧。",
      taigi: { hanji: "金幣無夠喔！轉去金包里溫泉旅館免錢蹛，抑是去拍怪物趁金幣。", tailo: "Kim-pè bô-kàu--ooh! Tńg-khì Kim-pau-lí un-tsuânn lí-kuán bián-tsînn tuà, ia̍h-sī khì phah kuài-bu̍t thàn kim-pè.", huayu: "金幣不夠喔！回金包里溫泉旅館免費住，或去打怪賺金幣吧。" } }
  ],
  D_INN_MANGROVE_NOCOIN: [
    { who: "inn_mangrove", emotion: "擔心", text: "金幣不夠呢。金包里的溫泉旅館能免費住，或去打怪賺金幣吧。" }
  ],
  D_INN_GOBLIN_NOCOIN: [
    { who: "inn_goblin", emotion: "擔心", text: "嘿嘿，金幣不夠啦！去金包里溫泉旅館免費住，或打怪賺金幣！" }
  ],
  D_INN_MOON_NOCOIN: [
    { who: "inn_moon", emotion: "擔心", text: "金幣不夠啦！回金包里溫泉旅館免費住，不然就去打怪賺金幣。",
      taigi: { hanji: "金幣無夠啦！轉去金包里溫泉旅館免錢蹛，若無就去拍怪物趁金幣。", tailo: "Kim-pè bô-kàu--lah! Tńg-khì Kim-pau-lí un-tsuânn lí-kuán bián-tsînn tuà, nā-bô tō khì phah kuài-bu̍t thàn kim-pè.", huayu: "金幣不夠啦！回金包里溫泉旅館免費住，不然就去打怪賺金幣。" } }
  ],
  D_INN_FUCHENG_NOCOIN: [
    { who: "inn_fucheng", emotion: "擔心", text: "抱歉，金幣不夠喔。金包里溫泉旅館能免費住，或去打怪賺金幣。",
      taigi: { hanji: "歹勢，金幣無夠喔。金包里溫泉旅館免錢蹛，抑是去拍怪物趁金幣。", tailo: "Pháinn-sè, kim-pè bô-kàu--ooh. Kim-pau-lí un-tsuânn lí-kuán bián-tsînn tuà, ia̍h-sī khì phah kuài-bu̍t thàn kim-pè.", huayu: "抱歉，金幣不夠喔。金包里溫泉旅館能免費住，或去打怪賺金幣。" } }
  ],
  D_INN_PORT_NOCOIN: [
    { who: "innkeeper_port", emotion: "擔心", text: "金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。",
      taigi: { hanji: "金幣無夠喔，金包里溫泉旅館會使免錢蹛，嘛會使去拍怪物趁金幣。", tailo: "Kim-pè bô-kàu--ooh, Kim-pau-lí un-tsuânn lí-kuán ē-sái bián-tsînn tuà, mā ē-sái khì phah kuài-bu̍t thàn kim-pè.", huayu: "金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。" } }
  ],
  // v0.9.4 擎天崗的水牛（老闆 D2-a）：面對水牛按 A。只有華語，不需要台語語音
  D_ANIMAL_BUFFALO: [
    { who: "narrator", text: "水牛：「哞～」" },
    { who: "pet", text: "野生的水牛要保持 20 公尺喔！" }
  ],
  // ═════════════ v1.1 第一章（北部方案 B；59 號 4.5）═════════════
  // 事實句都對得到 36 號第十二節的來源（S 編號寫在各段標題）；查不到的不寫。新的人類 NPC 一律男性、每句都有台語。
  // 地名台語：先查教育部辭典地名附錄（基隆港 Ke-lâng-káng、基隆山 Ke-lâng-suann、七星山、陽明山）；竹子湖、金瓜石、九份、野柳、
  //   跳石、和平島在附錄查無，台語句不說這些地名，改由番薯仔（華語）說出地名。查證表：10_台語查證表.xlsx「v1.1 第一章」。
  // ── 金包里：跳石海岸（撿海菜阿伯，Q_N1_TIDE） ──
  D_TIDE_A: [
    { who: "seaweed_uncle", emotion: "平靜", text: "我在這裡的海邊撿海菜。",
      taigi: { hanji: "我佇遮的海墘抾海菜。", tailo: "Guá tī tsia ê hái-kînn khioh hái-tshài.", huayu: "我在這裡的海邊撿海菜。" } },
    { who: "seaweed_uncle", emotion: "平靜", text: "要等退潮，才能踩著石頭一跳一跳過去。",
      taigi: { hanji: "愛等洘流，才會使踏石頭一跳一跳過去。", tailo: "Ài tán khó-lâu, tsiah ē-sái ta̍h tsio̍h-thâu tsi̍t thiàu tsi̍t thiàu kuè--khì.", huayu: "要等退潮，才能踩著石頭一跳一跳過去。" } },
    { who: "seaweed_uncle", emotion: "擔心", text: "可是霧讓我忘了天氣和海水的事。",
      taigi: { hanji: "毋過霧予我袂記得天氣佮海水的代誌。", tailo: "M̄-koh bū hōo guá bē-kì-tit thinn-khì kah hái-tsuí ê tāi-tsì.", huayu: "可是霧讓我忘了天氣和海水的事。" } },
    { who: "seaweed_uncle", emotion: "平靜", text: "幫阿伯想一想，答對 3 題好嗎？",
      taigi: { hanji: "共阿伯想看覓，回答著三題，好無？", tailo: "Kā a-peh siūnn khuànn-māi, huê-tap tio̍h sann tê, hó--bô?", huayu: "幫阿伯想一想，答對 3 題好嗎？" } },
    { who: "pet", emotion: "開心", text: "這裡叫跳石海岸，名字就是這樣來的！" }
  ],
  D_TIDE_B: [
    { who: "seaweed_uncle", emotion: "開心", text: "想起來了！先看天氣，再等退潮。",
      taigi: { hanji: "想起來矣！先看天氣，才閣等洘流。", tailo: "Siūnn khí-lâi--ah! Sing khuànn thinn-khì, tsiah-koh tán khó-lâu.", huayu: "想起來了！先看天氣，再等退潮。" } },
    { who: "seaweed_uncle", emotion: "開心", text: "這些金幣和藥草送你。",
      taigi: { hanji: "這寡金幣佮藥草送你。", tailo: "Tsit-kuá kim-pè kah io̍h-tsháu sàng lí.", huayu: "這些金幣和藥草送你。" } },
    { who: "seaweed_uncle", emotion: "平靜", text: "跳石頭的時候，要小心喔！",
      taigi: { hanji: "跳石頭的時，愛細膩喔！", tailo: "Thiàu tsio̍h-thâu ê sî, ài sè-jī--ooh!", huayu: "跳石頭的時候，要小心喔！" } }
  ],
  D_SEAWEED_IDLE: [
    { who: "seaweed_uncle", text: "海邊的石頭很滑，要慢慢走喔。",
      taigi: { hanji: "海墘的石頭真滑，愛慢慢仔行喔。", tailo: "Hái-kînn ê tsio̍h-thâu tsin ku̍t, ài bān-bān-á kiânn--ooh.", huayu: "海邊的石頭很滑，要慢慢走喔。" } }
  ],
  // ── 擎天草原：國家公園解說員（Q_N1_BUFFALO；S138、S139、S184） ──
  D_BUFFALO_A: [
    { who: "park_ranger", emotion: "平靜", text: "我在國家公園當解說員。",
      taigi: { hanji: "我佇國家公園做解說員。", tailo: "Guá tī kok-ka kong-hn̂g tsò kái-sueh-uân.", huayu: "我在國家公園當解說員。" } },
    { who: "park_ranger", emotion: "平靜", text: "草原上的水牛是野生的。",
      taigi: { hanji: "草埔頂的水牛是野生的。", tailo: "Tsháu-poo tíng ê tsuí-gû sī iá-sing--ê.", huayu: "草原上的水牛是野生的。" } },
    { who: "park_ranger", emotion: "擔心", text: "看到水牛，要保持 20 公尺喔。",
      taigi: { hanji: "看著水牛，愛保持二十公尺喔。", tailo: "Khuànn-tio̍h tsuí-gû, ài pó-tshî jī-tsa̍p kong-tshioh--ooh.", huayu: "看到水牛，要保持 20 公尺喔。" } },
    { who: "park_ranger", emotion: "平靜", text: "大約是兩輛公車那麼長。",
      taigi: { hanji: "差不多兩台公車遐爾長。", tailo: "Tsha-put-to nn̄g tâi kong-tshia hiah-nī tn̂g.", huayu: "大約是兩輛公車那麼長。" } },
    { who: "park_ranger", emotion: "平靜", text: "幫我提醒遊客，答對 2 題好嗎？",
      taigi: { hanji: "共我提醒遊客，回答著兩題，好無？", tailo: "Kā guá thê-tshénn iû-kheh, huê-tap tio̍h nn̄g tê, hó--bô?", huayu: "幫我提醒遊客，答對 2 題好嗎？" } }
  ],
  D_BUFFALO_B: [
    { who: "park_ranger", emotion: "開心", text: "遊客都記住了，水牛也很安心！",
      taigi: { hanji: "遊客攏記牢矣，水牛嘛真安心！", tailo: "Iû-kheh lóng kì-tiâu--ah, tsuí-gû mā tsin an-sim!", huayu: "遊客都記住了，水牛也很安心！" } },
    { who: "park_ranger", emotion: "開心", text: "送你 40 枚金幣，謝謝你！",
      taigi: { hanji: "送你四十个金幣，多謝你！", tailo: "Sàng lí sì-tsa̍p ê kim-pè, to-siā--lí!", huayu: "送你 40 枚金幣，謝謝你！" } }
  ],
  D_RANGER_IDLE: [
    { who: "park_ranger", text: "看到水牛，記得保持 20 公尺喔。",
      taigi: { hanji: "看著水牛，會記得保持二十公尺喔。", tailo: "Khuànn-tio̍h tsuí-gû, ē-kì--tit pó-tshî jī-tsa̍p kong-tshioh--ooh.", huayu: "看到水牛，記得保持 20 公尺喔。" } }
  ],
  // ── 硫磺谷：登山阿伯（Q_YM_1；S136） ──
  D_YM_1A: [
    { who: "hiker", emotion: "開心", text: "你看，那座就是七星山。",
      taigi: { hanji: "你看，彼座就是七星山。", tailo: "Lí khuànn, hit tsō tō-sī Tshit-tshenn-suann.", huayu: "你看，那座就是七星山。" } },
    { who: "hiker", emotion: "平靜", text: "它有 1120 公尺高，是陽明山國家公園最高的山。",
      taigi: { hanji: "伊有一千一百二十公尺懸，是陽明山國家公園上懸的山。", tailo: "I ū tsi̍t-tshing tsi̍t-pah jī-tsa̍p kong-tshioh kuân, sī Iûnn-bîng-san kok-ka kong-hn̂g siōng kuân ê suann.", huayu: "它有 1120 公尺高，是陽明山國家公園最高的山。" } },
    { who: "hiker", emotion: "擔心", text: "霧讓我算不清楚，幫我算 3 題好嗎？",
      taigi: { hanji: "霧予我算袂清楚，共我算三題，好無？", tailo: "Bū hōo guá sǹg bē tshing-tshó, kā guá sǹg sann tê, hó--bô?", huayu: "霧讓我算不清楚，幫我算 3 題好嗎？" } }
  ],
  D_YM_1B: [
    { who: "hiker", emotion: "開心", text: "算對了！你真聰明。",
      taigi: { hanji: "算著矣！你真巧。", tailo: "Sǹg tio̍h--ah! Lí tsin khiáu.", huayu: "算對了！你真聰明。" } },
    { who: "hiker", emotion: "平靜", text: "從這裡往南走，有好多田喔。",
      taigi: { hanji: "對遮向南爿行，有真濟田喔。", tailo: "Tuì tsia ǹg lâm-pîng kiânn, ū tsin tsē tshân--ooh.", huayu: "從這裡往南走，有好多田喔。" } },
    { who: "pet", emotion: "開心", text: "往南就是竹子湖！我們去看看！" }
  ],
  // ── 竹子湖 M46：海芋農阿伯、故事館解說員（Q_ZZH_1、Q_ZZH_2；S141、S142、S185–S188） ──
  D_ZZH_LOCK: [
    { who: "calla_farmer", emotion: "平靜", text: "先去北邊幫那位阿伯的忙，再來找我。",
      taigi: { hanji: "先去北爿共彼位阿伯鬥相共，才閣來揣我。", tailo: "Sing khì pak-pîng kā hit uī a-peh tàu-sann-kāng, tsiah-koh lâi tshuē guá.", huayu: "先去北邊幫那位阿伯的忙，再來找我。" } },
    { who: "pet", emotion: "平靜", text: "先幫溫泉旅館老闆，再去找硫磺谷的登山阿伯！" }
  ],
  D_ZZH_1A: [
    { who: "calla_farmer", emotion: "開心", text: "歡迎！這一塊一塊的田，種的都是白色的花。",
      taigi: { hanji: "歡迎！這一坵一坵的田，種的攏是白色的花。", tailo: "Huan-gîng! Tsit tsi̍t khu tsi̍t khu ê tshân, tsìng--ê lóng sī pe̍h-sik ê hue.", huayu: "歡迎！這一塊一塊的田，種的都是白色的花。" } },
    { who: "pet", emotion: "開心", text: "是海芋！白白的花，好漂亮！" },
    { who: "calla_farmer", emotion: "平靜", text: "每年一月到五月開花，三、四月開得最多。",
      taigi: { hanji: "每年一月到五月開花，三、四月開上濟。", tailo: "Muí nî it-gue̍h kàu gōo-gue̍h khui-hue, sann, sì-gue̍h khui siōng tsē.", huayu: "每年一月到五月開花，三、四月開得最多。" } },
    { who: "calla_farmer", emotion: "擔心", text: "霧讓我算不清楚有幾朵花，幫我算 3 題好嗎？",
      taigi: { hanji: "霧予我算袂清楚有幾蕊花，共我算三題，好無？", tailo: "Bū hōo guá sǹg bē tshing-tshó ū kuí luí hue, kā guá sǹg sann tê, hó--bô?", huayu: "霧讓我算不清楚有幾朵花，幫我算 3 題好嗎？" } }
  ],
  D_ZZH_1B: [
    { who: "calla_farmer", emotion: "開心", text: "算好了！今年的花開得真漂亮。",
      taigi: { hanji: "算好矣！今年的花開甲真媠。", tailo: "Sǹg hó--ah! Kin-nî ê hue khui kah tsin suí.", huayu: "算好了！今年的花開得真漂亮。" } },
    { who: "calla_farmer", emotion: "平靜", text: "東邊的故事館，有解說員在講米的故事。",
      taigi: { hanji: "東爿的故事館，有解說員咧講米的故事。", tailo: "Tang-pîng ê kòo-sū-kuán, ū kái-sueh-uân teh kóng bí ê kòo-sū.", huayu: "東邊的故事館，有解說員在講米的故事。" } }
  ],
  D_CALLA_IDLE: [
    { who: "calla_farmer", text: "這裡一年有一半以上的日子會下雨喔。",
      taigi: { hanji: "遮一年有一半以上的日子會落雨喔。", tailo: "Tsia tsi̍t nî ū tsi̍t-puànn í-siōng ê ji̍t-tsí ē lo̍h-hōo--ooh.", huayu: "這裡一年有一半以上的日子會下雨喔。" } }
  ],
  D_ZZH_2A: [
    { who: "rice_guide", emotion: "開心", text: "歡迎來我們的故事館！",
      taigi: { hanji: "歡迎來阮的故事館！", tailo: "Huan-gîng lâi guán ê kòo-sū-kuán!", huayu: "歡迎來我們的故事館！" } },
    { who: "rice_guide", emotion: "平靜", text: "這棟洋房蓋好，快要一百年了。",
      taigi: { hanji: "這棟洋樓起好，強欲一百年矣。", tailo: "Tsit tòng iûnn-lâu khí hó, kiōng-beh tsi̍t-pah nî--ah.", huayu: "這棟洋房蓋好，快要一百年了。" } },
    { who: "rice_guide", emotion: "平靜", text: "以前這裡種米的種子，給全臺灣的農夫用。",
      taigi: { hanji: "以早遮種米的種子，予全臺灣的作穡人用。", tailo: "Í-tsá tsia tsìng bí ê tsíng-tsí, hōo tsuân Tâi-uân ê tsoh-sit-lâng īng.", huayu: "以前這裡種米的種子，給全臺灣的農夫用。" } },
    { who: "rice_guide", emotion: "開心", text: "這種米叫做蓬萊米，你知道嗎？",
      taigi: { hanji: "這款米叫做蓬萊米，你敢知影？", tailo: "Tsit khuán bí kiò-tsò hông-lâi-bí, lí kám tsai-iánn?", huayu: "這種米叫做蓬萊米，你知道嗎？" } },
    { who: "rice_guide", emotion: "擔心", text: "霧讓我忘了這些故事，幫我想 3 題好嗎？",
      taigi: { hanji: "霧予我袂記得遮的故事，共我想三題，好無？", tailo: "Bū hōo guá bē-kì-tit tsia ê kòo-sū, kā guá siūnn sann tê, hó--bô?", huayu: "霧讓我忘了這些故事，幫我想 3 題好嗎？" } }
  ],
  D_ZZH_2B: [
    { who: "rice_guide", emotion: "開心", text: "想起來了！謝謝你幫忙。",
      taigi: { hanji: "想起來矣！多謝你鬥相共。", tailo: "Siūnn khí-lâi--ah! To-siā lí tàu-sann-kāng.", huayu: "想起來了！謝謝你幫忙。" } },
    { who: "rice_guide", emotion: "平靜", text: "這張引導卡送你，答題時用得到。",
      taigi: { hanji: "這張卡片送你，回答題目用會著。", tailo: "Tsit tiunn khah-phìnn sàng lí, huê-tap tê-bo̍k īng ē tio̍h.", huayu: "這張引導卡送你，答題時用得到。" } },
    { who: "pet", emotion: "開心", text: "還沒去過野柳的話，回金包里往東走就到了！" }   // v1.1 審查：條件式說法（華語，不用重錄）
  ],
  D_RICEGUIDE_IDLE: [
    { who: "rice_guide", text: "這棟房子現在是歷史建築喔。",
      taigi: { hanji: "這棟厝這馬是歷史建築喔。", tailo: "Tsit tòng tshù tsit-má sī li̍k-sú kiàn-tio̍k--ooh.", huayu: "這棟房子現在是歷史建築喔。" } }
  ],
  // ── 基隆港 M47：漁港阿伯、廟口攤販阿伯、港邊旅店（Q_KL_1、Q_KL_2；S154–S157） ──
  D_KL_LOCK: [
    { who: "harbor_uncle", emotion: "平靜", text: "先去西邊的山洞幫忙，再來找我。",
      taigi: { hanji: "先去西爿的山空鬥相共，才閣來揣我。", tailo: "Sing khì sai-pîng ê suann-khang tàu-sann-kāng, tsiah-koh lâi tshuē guá.", huayu: "先去西邊的山洞幫忙，再來找我。" } },
    { who: "pet", emotion: "平靜", text: "先去野柳的哥布林部落幫忙吧！" }
  ],
  D_KL_1A: [
    { who: "harbor_uncle", emotion: "開心", text: "歡迎來基隆港！這裡常常下雨。",
      taigi: { hanji: "歡迎來基隆港！遮定定落雨。", tailo: "Huan-gîng lâi Ke-lâng-káng! Tsia tiānn-tiānn lo̍h-hōo.", huayu: "歡迎來基隆港！這裡常常下雨。" } },
    { who: "harbor_uncle", emotion: "擔心", text: "碼頭邊的雨滴怪物，被霧弄迷糊了。",
      taigi: { hanji: "碼頭邊的雨滴怪物，予霧舞甲霧嗄嗄。", tailo: "Bé-thâu pinn ê hōo-tih kuài-bu̍t, hōo bū bú kah bū-sà-sà.", huayu: "碼頭邊的雨滴怪物，被霧弄迷糊了。" } },
    { who: "harbor_uncle", emotion: "擔心", text: "怪物把大家的雨傘拿走了。",
      taigi: { hanji: "怪物共逐家的雨傘提走矣。", tailo: "Kuài-bu̍t kā ta̍k-ke ê hōo-suànn the̍h-tsáu--ah.", huayu: "怪物把大家的雨傘拿走了。" } },
    { who: "harbor_uncle", emotion: "平靜", text: "讓怪物清醒，把 3 把雨傘找回來。",
      taigi: { hanji: "予怪物清醒，共三支雨傘揣轉來。", tailo: "Hōo kuài-bu̍t tshing-tshénn, kā sann ki hōo-suànn tshuē tńg--lâi.", huayu: "讓怪物清醒，把 3 把雨傘找回來。" } },
    { who: "pet", emotion: "驚訝", text: "是滴滴雨精！讓牠們清醒，就會掉雨傘。" }
  ],
  D_KL_1B: [
    { who: "harbor_uncle", emotion: "開心", text: "雨傘都找回來了，謝謝你！",
      taigi: { hanji: "雨傘攏揣轉來矣，多謝你！", tailo: "Hōo-suànn lóng tshuē tńg--lâi--ah, to-siā--lí!", huayu: "雨傘都找回來了，謝謝你！" } },
    { who: "harbor_uncle", emotion: "平靜", text: "從這裡往東南走，有一個山上的市集。",
      taigi: { hanji: "對遮向東南爿行，有一个山頂的市場。", tailo: "Tuì tsia ǹg tang-lâm-pîng kiânn, ū tsi̍t ê suann-tíng ê tshī-tiûnn.", huayu: "從這裡往東南走，有一個山上的市集。" } },
    { who: "pet", emotion: "開心", text: "是九份的山城市集！外國商人在那裡！" }
  ],
  D_HARBOR_IDLE: [
    { who: "harbor_uncle", text: "下雨天出門，要記得帶雨傘喔。",
      taigi: { hanji: "落雨天出門，愛會記得紮雨傘喔。", tailo: "Lo̍h-hōo-thinn tshut-mn̂g, ài ē-kì--tit tsah hōo-suànn--ooh.", huayu: "下雨天出門，要記得帶雨傘喔。" } }
  ],
  D_KL_2A: [
    { who: "stall_keeper", emotion: "開心", text: "來喔！廟口夜市的鼎邊銼很好吃喔！",
      taigi: { hanji: "來喔！廟口夜市的鼎邊趖真好食喔！", tailo: "Lâi--ooh! Biō-kháu iā-tshī ê tiánn-pinn-sô tsin hó-tsia̍h--ooh!", huayu: "來喔！廟口夜市的鼎邊銼很好吃喔！" } },
    { who: "stall_keeper", emotion: "擔心", text: "客人好多，霧讓我算錢算不清楚。",
      taigi: { hanji: "人客真濟，霧予我算錢算袂清楚。", tailo: "Lâng-kheh tsin tsē, bū hōo guá sǹg tsînn sǹg bē tshing-tshó.", huayu: "客人好多，霧讓我算錢算不清楚。" } },
    { who: "stall_keeper", emotion: "平靜", text: "幫阿伯算帳、招呼客人，答對 3 題就好！",
      taigi: { hanji: "共阿伯算數、招呼人客，回答著三題就好！", tailo: "Kā a-peh sǹg-siàu, tsio-hoo lâng-kheh, huê-tap tio̍h sann tê tō hó!", huayu: "幫阿伯算帳、招呼客人，答對 3 題就好！" } }
  ],
  D_KL_2B: [
    { who: "stall_keeper", emotion: "開心", text: "生意變好了，謝謝你！",
      taigi: { hanji: "生理變好矣，多謝你！", tailo: "Sing-lí piàn hó--ah, to-siā--lí!", huayu: "生意變好了，謝謝你！" } },
    { who: "stall_keeper", emotion: "開心", text: "這個點心送你，餓了就吃。",
      taigi: { hanji: "這个點心送你，枵就食。", tailo: "Tsit ê tiám-sim sàng lí, iau tō tsia̍h.", huayu: "這個點心送你，餓了就吃。" } },
    { who: "pet", emotion: "開心", text: "哇！是我最喜歡的點心！" }
  ],
  D_SHOP_KEELUNG_IDLE: [
    { who: "stall_keeper", text: "藥草、點心和卡片，這裡都有喔！",
      taigi: { hanji: "藥草、點心佮卡片，遮攏有喔！", tailo: "Io̍h-tsháu, tiám-sim kah khah-phìnn, tsia lóng ū--ooh!", huayu: "藥草、點心和卡片，這裡都有喔！" } },
    { who: "stall_keeper", text: "基隆的中元祭，是很重要的民俗喔。",
      taigi: { hanji: "基隆的中元祭，是真重要的民俗喔。", tailo: "Ke-lâng ê Tiong-guân-tsè, sī tsin tiōng-iàu ê bîn-sio̍k--ooh.", huayu: "基隆的中元祭，是很重要的民俗喔。" } }
  ],
  D_INN_KEELUNG: [
    { who: "inn_keelung", emotion: "開心", text: "歡迎來港邊的旅店！聽著下雨的聲音，好好休息。",
      taigi: { hanji: "歡迎來港邊的旅社！聽落雨的聲，好好仔歇睏。", tailo: "Huan-gîng lâi káng-pinn ê lí-siā! Thiann lo̍h-hōo ê siann, hó-hó-á hioh-khùn.", huayu: "歡迎來港邊的旅店！聽著下雨的聲音，好好休息。" } }
  ],
  D_INN_KEELUNG_NOCOIN: [
    { who: "inn_keelung", emotion: "擔心", text: "金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。",
      taigi: { hanji: "金幣無夠喔，金包里溫泉旅館會使免錢蹛，嘛會使去拍怪物趁金幣。", tailo: "Kim-pè bô-kàu--ooh, Kim-pau-lí un-tsuânn lí-kuán ē-sái bián-tsînn tuà, mā ē-sái khì phah kuài-bu̍t thàn kim-pè.", huayu: "金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。" } }
  ],
  // ── 金瓜石 M48：老礦工阿伯、博物館解說員、宿舍旅店、金脈鐵顎王（Q_JGS_1–3；S162–S165、S190） ──
  D_JGS_LOCK: [
    { who: "old_miner", emotion: "平靜", text: "先去市集幫外國商人的忙，再來找我。",
      taigi: { hanji: "先去市場共外國的生理人鬥相共，才閣來揣我。", tailo: "Sing khì tshī-tiûnn kā guā-kok ê sing-lí-lâng tàu-sann-kāng, tsiah-koh lâi tshuē guá.", huayu: "先去市集幫外國商人的忙，再來找我。" } },
    { who: "pet", emotion: "平靜", text: "九份山城市集的外國商人，在等你喔！" }
  ],
  D_JGS_1A: [
    { who: "old_miner", emotion: "平靜", text: "這裡以前出產很多金子喔。",
      taigi: { hanji: "遮以早出真濟金仔喔。", tailo: "Tsia í-tsá tshut tsin tsē kim-á--ooh.", huayu: "這裡以前出產很多金子喔。" } },
    { who: "old_miner", emotion: "擔心", text: "霧讓我算不清楚有幾輛礦車、幾顆礦石。",
      taigi: { hanji: "霧予我算袂清楚有幾台礦車、幾粒礦石。", tailo: "Bū hōo guá sǹg bē tshing-tshó ū kuí tâi khòng-tshia, kuí lia̍p khòng-tsio̍h.", huayu: "霧讓我算不清楚有幾輛礦車、幾顆礦石。" } },
    { who: "old_miner", emotion: "平靜", text: "幫阿伯算 3 題，好不好？",
      taigi: { hanji: "共阿伯算三題，好無？", tailo: "Kā a-peh sǹg sann tê, hó--bô?", huayu: "幫阿伯算 3 題，好不好？" } }
  ],
  D_JGS_1B: [
    { who: "old_miner", emotion: "開心", text: "分得剛剛好，謝謝你！",
      taigi: { hanji: "分甲拄仔好，多謝你！", tailo: "Pun kah tú-á-hó, to-siā--lí!", huayu: "分得剛剛好，謝謝你！" } },
    { who: "old_miner", emotion: "驚訝", text: "還有，金包里的漁港有大章魚擋住漁船！",
      taigi: { hanji: "閣有，金包里的漁港有大石距共漁船擋咧！", tailo: "Koh ū, Kim-pau-lí ê hî-káng ū tuā tsio̍h-kī kā hî-tsûn tòng--leh!", huayu: "還有，金包里的漁港有大章魚擋住漁船！" } },
    { who: "pet", emotion: "平靜", text: "快回九份，告訴外國商人吧！" }
  ],
  D_MINER_IDLE: [
    { who: "old_miner", text: "坑道裡很暗，進去要帶燈喔。",
      taigi: { hanji: "磅空內底真暗，入去愛提燈喔。", tailo: "Pōng-khang lāi-té tsin àm, ji̍p--khì ài the̍h ting--ooh.", huayu: "坑道裡很暗，進去要帶燈喔。" } }
  ],
  D_JGS_2A: [
    { who: "museum_guide", emotion: "開心", text: "歡迎來到黃金博物館！",
      taigi: { hanji: "歡迎來黃金博物館！", tailo: "Huan-gîng lâi N̂g-kim Phok-bu̍t-kuán!", huayu: "歡迎來到黃金博物館！" } },
    { who: "museum_guide", emotion: "平靜", text: "北邊那座山是基隆山，大約 588 公尺高。",
      taigi: { hanji: "北爿彼座山是基隆山，差不多五百八十八公尺懸。", tailo: "Pak-pîng hit tsō suann sī Ke-lâng-suann, tsha-put-to gōo-pah peh-tsa̍p-peh kong-tshioh kuân.", huayu: "北邊那座山是基隆山，大約 588 公尺高。" } },
    { who: "museum_guide", emotion: "平靜", text: "從這裡看，它像一個大肚子的美人躺著。",
      taigi: { hanji: "對遮看，伊敢若一个大腹肚的美人倒咧。", tailo: "Tuì tsia khuànn, i kánn-ná tsi̍t ê tuā-pak-tóo ê bí-jîn tó--leh.", huayu: "從這裡看，它像一個大肚子的美人躺著。" } },
    { who: "pet", emotion: "開心", text: "所以叫它「大肚美人山」！金山也有美人山耶！" },
    { who: "museum_guide", emotion: "平靜", text: "金山人說的那座，是另一座山喔。",
      taigi: { hanji: "金山人講的彼座，是另外一座山喔。", tailo: "Kim-san-lâng kóng ê hit tsō, sī līng-guā tsi̍t tsō suann--ooh.", huayu: "金山人說的那座，是另一座山喔。" } },
    { who: "museum_guide", emotion: "擔心", text: "霧讓大家忘了這些事，幫我想 3 題好嗎？",
      taigi: { hanji: "霧予逐家袂記得遮的代誌，共我想三題，好無？", tailo: "Bū hōo ta̍k-ke bē-kì-tit tsia ê tāi-tsì, kā guá siūnn sann tê, hó--bô?", huayu: "霧讓大家忘了這些事，幫我想 3 題好嗎？" } }
  ],
  D_JGS_2B: [
    { who: "museum_guide", emotion: "開心", text: "你都答對了，聽得真認真！",
      taigi: { hanji: "你攏回答著矣，聽甲真認真！", tailo: "Lí lóng huê-tap tio̍h--ah, thiann kah tsin jīn-tsin!", huayu: "你都答對了，聽得真認真！" } },
    { who: "museum_guide", emotion: "平靜", text: "這張引導卡送你，答題時用得到。",
      taigi: { hanji: "這張卡片送你，回答題目用會著。", tailo: "Tsit tiunn khah-phìnn sàng lí, huê-tap tê-bo̍k īng ē tio̍h.", huayu: "這張引導卡送你，答題時用得到。" } },
    { who: "museum_guide", emotion: "平靜", text: "旁邊的宿舍，有紅磚圍牆和黑色屋瓦。",
      taigi: { hanji: "邊仔的宿舍，有紅磚圍牆佮烏色的厝瓦。", tailo: "Pinn--á ê sok-sià, ū âng-tsng uî-tshiûnn kah oo-sik ê tshù-hiā.", huayu: "旁邊的宿舍，有紅磚圍牆和黑色屋瓦。" } }
  ],
  D_MUSEUM_IDLE: [
    { who: "museum_guide", text: "太子賓館已經一百多年了，只能在圍牆外看喔。",
      taigi: { hanji: "太子賓館已經一百外年矣，干焦會使佇圍牆外看喔。", tailo: "Thài-tsú pin-kuán í-king tsi̍t-pah guā nî--ah, kan-na ē-sái tī uî-tshiûnn guā khuànn--ooh.", huayu: "太子賓館已經一百多年了，只能在圍牆外看喔。" } }
  ],
  D_JGS_3A: [
    { who: "old_miner", emotion: "擔心", text: "坑道最深的地方，一直有很大的聲音。",
      taigi: { hanji: "磅空上深的所在，一直有真大的聲。", tailo: "Pōng-khang siōng tshim ê sóo-tsāi, it-ti̍t ū tsin tuā ê siann.", huayu: "坑道最深的地方，一直有很大的聲音。" } },
    { who: "old_miner", emotion: "擔心", text: "有一隻好大的怪物，被霧弄迷糊了。",
      taigi: { hanji: "有一隻真大的怪物，予霧舞甲霧嗄嗄。", tailo: "Ū tsi̍t tsiah tsin tuā ê kuài-bu̍t, hōo bū bú kah bū-sà-sà.", huayu: "有一隻好大的怪物，被霧弄迷糊了。" } },
    { who: "old_miner", emotion: "平靜", text: "你可以去讓它清醒嗎？要小心喔。",
      taigi: { hanji: "你會使去予伊清醒無？愛細膩喔。", tailo: "Lí ē-sái khì hōo i tshing-tshénn--bô? Ài sè-jī--ooh.", huayu: "你可以去讓它清醒嗎？要小心喔。" } },
    { who: "pet", emotion: "平靜", text: "頭目戰不能逃跑，先去旅店休息吧！" }
  ],
  D_JGS_3B: [
    { who: "old_miner", emotion: "開心", text: "坑道又安靜了，謝謝你！",
      taigi: { hanji: "磅空閣恬靜矣，多謝你！", tailo: "Pōng-khang koh tiām-tsīng--ah, to-siā--lí!", huayu: "坑道又安靜了，謝謝你！" } },
    { who: "old_miner", emotion: "開心", text: "這顆水晶送你。",
      taigi: { hanji: "這粒水晶送你。", tailo: "Tsit lia̍p tsuí-tsinn sàng lí.", huayu: "這顆水晶送你。" } }
  ],
  D_BOSS_GOLDJAW_A: [
    { who: "mnb_goldjaw", emotion: "生氣", text: "喀啦喀啦！金子是我的，誰都不准搶！" },
    { who: "pet", emotion: "驚訝", text: "它被霧弄迷糊了！答對數學和自然題叫醒它！" }
  ],
  D_BOSS_GOLDJAW_B: [
    { who: "mnb_goldjaw", emotion: "平靜", text: "喀啦……沒有人要搶，是我想錯了。" },
    { who: "mnb_goldjaw", emotion: "開心", text: "胸口暖暖的……謝謝你，我要回去睡了。" }
  ],
  D_INN_JINGUASHI: [
    { who: "inn_jinguashi", emotion: "開心", text: "歡迎來宿舍旅店！這裡很安靜，好好睡一晚。",
      taigi: { hanji: "歡迎來宿舍旅社！遮真恬靜，好好仔睏一暝。", tailo: "Huan-gîng lâi sok-sià lí-siā! Tsia tsin tiām-tsīng, hó-hó-á khùn tsi̍t mê.", huayu: "歡迎來宿舍旅店！這裡很安靜，好好睡一晚。" } }
  ],
  D_INN_JINGUASHI_NOCOIN: [
    { who: "inn_jinguashi", emotion: "擔心", text: "金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。",
      taigi: { hanji: "金幣無夠喔，金包里溫泉旅館會使免錢蹛，嘛會使去拍怪物趁金幣。", tailo: "Kim-pè bô-kàu--ooh, Kim-pau-lí un-tsuânn lí-kuán ē-sái bián-tsînn tuà, mā ē-sái khì phah kuài-bu̍t thàn kim-pè.", huayu: "金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。" } }
  ],
  // ── 金包里：章末點燈、第一章完成、舊存檔說明、慈護宮提示、美人山眺望點（Q_LAMPS_3；59 號 4.6、5.1、7.1、2.9.4） ──
  D_LAMPS3_A: [
    { who: "chief", emotion: "開心", text: "國語和英語的光都拿回來了！真棒！",
      taigi: { hanji: "國語佮英語的光攏提轉來矣！真讚！", tailo: "Kok-gí kah Ing-gí ê kng lóng the̍h tńg--lâi--ah! Tsin tsán!", huayu: "國語和英語的光都拿回來了！真棒！" } },
    { who: "chief", emotion: "平靜", text: "每盞燈前答對一題，燈就會亮。",
      taigi: { hanji: "每葩燈頭前回答著一題，燈就會光。", tailo: "Muí pha ting thâu-tsîng huê-tap tio̍h tsi̍t tê, ting tō ē kng.", huayu: "每盞燈前答對一題，燈就會亮。" } }
  ],
  D_LAMPS3_B: [
    { who: "narrator", emotion: "開心", text: "國語燈和英語燈亮起來了！" },
    { who: "chief", emotion: "開心", text: "公園變亮了！大家都很高興。",
      taigi: { hanji: "公園較光矣！逐家攏真歡喜。", tailo: "Kong-hn̂g khah kng--ah! Ta̍k-ke lóng tsin huann-hí.", huayu: "公園變亮了！大家都很高興。" } },
    { who: "chief", emotion: "平靜", text: "還有三盞燈還沒亮，以後我們一起努力！",
      taigi: { hanji: "閣有三葩燈猶未光，以後咱做伙拍拚！", tailo: "Koh ū sann pha ting iáu-buē kng, í-āu lán tsò-hué phah-piànn!", huayu: "還有三盞燈還沒亮，以後我們一起努力！" } }
  ],
  D_CH1_END: [
    { who: "narrator", emotion: "開心", text: "第一章完成！" },
    { who: "pet", emotion: "開心", text: "見習 10 級、通過立志小考，就能到慈護宮轉職喔！" }
  ],
  D_MIGRATE_CH1: [
    { who: "narrator", emotion: "開心", text: "金包里附近多了新的地方：竹子湖、基隆港、金瓜石！" }
  ],
  D_TEMPLE_HINT_CH1: [
    { who: "temple_keeper", emotion: "平靜", text: "換了職業，等級會從 1 開始。",
      taigi: { hanji: "換職業了後，等級會對一級開始。", tailo: "Uānn tsit-gia̍p liáu-āu, tíng-kip ē tuì tsi̍t kip khai-sí.", huayu: "換了職業，等級會從 1 開始。" } },
    { who: "temple_keeper", emotion: "平靜", text: "也可以先讓漁港的大章魚清醒，再回來換職業喔。",
      taigi: { hanji: "嘛會使先予漁港的大石距清醒，才閣轉來換職業喔。", tailo: "Mā ē-sái sing hōo hî-káng ê tuā tsio̍h-kī tshing-tshénn, tsiah-koh tńg-lâi uānn tsit-gia̍p--ooh.", huayu: "也可以先讓漁港的大章魚清醒，再回來換職業喔。" } }
  ],
  D_MEIREN_VIEW: [
    { who: "narrator", emotion: "平靜", text: "往七星山的方向看，山稜一路連到跳石。" },
    { who: "narrator", emotion: "平靜", text: "金山人把這段山稜叫作「美人山」。" },
    { who: "pet", emotion: "驚訝", text: "真的耶！看起來像一個美人的側臉！" }
  ],
  // ── 路牌（番薯仔，華語；59 號 2.8） ──
  D_SIGN_M01_EAST: [{ who: "pet", emotion: "平靜", text: "這條路以前通九份。現在要先經過野柳、基隆才到得了喔！" }],
  // v1.1 審查：竹子湖本身就在臺北市北投區；這條路是等臺北那一章才開放（不是「變強一點」）。番薯仔華語，沒有台語、沒有音檔
  D_SIGN_BEITOU: [{ who: "pet", emotion: "平靜", text: "竹子湖已經是臺北市北投區了喔！" }, { who: "pet", emotion: "平靜", text: "往北投市區的路，要等臺北那一章開放才能走。" }],
  D_SIGN_CAOLING: [{ who: "pet", emotion: "平靜", text: "往草嶺古道，可以走到宜蘭。下一章再出發吧！" }],

  // ═════════════ v1.2 第二章：宜蘭（61 號 4.5 節；劇本語音組 2026-10-24 草稿 wip_v12_draft/dialogs_yilan.js，v12_apply.js 併入）═════════════
  D_EXIT_LOCK_CH1: [
    { who: "pet", emotion: "平靜", text: "要先完成第一章，才能走這條路喔！" },
    { who: "pet", emotion: "平靜", text: "先回金包里，把國語燈和英語燈點亮吧！" }
  ],
  D_SIGN_PINGLIN: [{ who: "pet", emotion: "平靜", text: "往坪林的路，要等臺北那一章開放才能走。" }],
  D_CL_1_LOCK: [
    { who: "trail_volunteer", emotion: "平靜", text: "先回金包里把燈點亮，再來找我。",
      taigi: { hanji: "先轉去金包里共燈點予光，才閣來揣我。", tailo: "Sing tńg-khì Kim-pau-lí kā ting tiám hōo kng, tsiah-koh lâi tshuē guá.", huayu: "先回金包里把燈點亮，再來找我。" } }
  ],
  D_CL_1A: [
    { who: "trail_volunteer", emotion: "開心", text: "歡迎來走這條步道！",
      taigi: { hanji: "歡迎來行這條步道！", tailo: "Huan-gîng lâi kiânn tsit tiâu pōo-tō!", huayu: "歡迎來走這條步道！" } },
    { who: "pet", emotion: "開心", text: "這裡是草嶺古道！走到底就是宜蘭了。" },
    { who: "trail_volunteer", emotion: "平靜", text: "你看，石碑上刻著一個好大的「虎」字。",
      taigi: { hanji: "你看，石碑頂懸刻一个真大的「虎」字。", tailo: "Lí khuànn, tsio̍h-pi tíng-kuân khik tsi̍t ê tsin tuā ê “hóo” jī.", huayu: "你看，石碑上刻著一個好大的「虎」字。" } },
    { who: "trail_volunteer", emotion: "平靜", text: "很久以前，有一位官員經過這裡，遇到大風雨。",
      taigi: { hanji: "真久以前，有一位官員行過遮，拄著大風雨。", tailo: "Tsin kú í-tsîng, ū tsi̍t uī kuann-uân kiânn-kuè tsia, tú-tio̍h tuā hong-ú.", huayu: "很久以前，有一位官員經過這裡，遇到大風雨。" } },
    { who: "trail_volunteer", emotion: "平靜", text: "所以刻了「虎」字，取「風從虎」的意思。",
      taigi: { hanji: "所以刻一个「虎」字，意思是「風從虎」。", tailo: "Sóo-í khik tsi̍t ê “hóo” jī, ì-sù sī “hong tsiông hóo”.", huayu: "所以刻了「虎」字，取「風從虎」的意思。" } },
    { who: "trail_volunteer", emotion: "擔心", text: "霧讓大家看不懂碑上的字，幫我想 3 題好嗎？",
      taigi: { hanji: "霧予逐家看無碑頂的字，共我想三題，好無？", tailo: "Bū hōo ta̍k-ke khuànn-bô pi tíng ê jī, kā guá siūnn sann tê, hó--bô?", huayu: "霧讓大家看不懂碑上的字，幫我想 3 題好嗎？" } }
  ],
  D_CL_1B: [
    { who: "trail_volunteer", emotion: "開心", text: "你都答對了，真厲害！",
      taigi: { hanji: "你攏回答著矣，真讚！", tailo: "Lí lóng huê-tap tio̍h--ah, tsin tsán!", huayu: "你都答對了，真厲害！" } },
    { who: "trail_volunteer", emotion: "平靜", text: "這條路走到尾，就是宜蘭了。",
      taigi: { hanji: "這條路行到尾，就是宜蘭矣。", tailo: "Tsit tiâu lōo kiânn kàu bué, tō-sī Gî-lân--ah.", huayu: "這條路走到尾，就是宜蘭了。" } },
    { who: "trail_volunteer", emotion: "開心", text: "送你 120 枚金幣，謝謝你！",
      taigi: { hanji: "送你一百二十个金幣，多謝你！", tailo: "Sàng lí tsi̍t-pah jī-tsa̍p ê kim-pè, to-siā--lí!", huayu: "送你 120 枚金幣，謝謝你！" } }
  ],
  D_VOLUNTEER_IDLE: [
    { who: "trail_volunteer", text: "山上常常有雲和霧，走路要看清楚喔。",
      taigi: { hanji: "山頂定定有雲佮霧，行路愛看予清楚喔。", tailo: "Suann-tíng tiānn-tiānn ū hûn kah bū, kiânn-lōo ài khuànn hōo tshing-tshó--ooh.", huayu: "山上常常有雲和霧，走路要看清楚喔。" } }
  ],
  D_YL_1_LOCK: [
    { who: "kumquat_farmer", emotion: "平靜", text: "先去北邊的山路幫志工阿伯的忙，再來找我。",
      taigi: { hanji: "先去北爿的山路共志工阿伯鬥相共，才閣來揣我。", tailo: "Sing khì pak-pîng ê suann-lōo kā tsì-kang a-peh tàu-sann-kāng, tsiah-koh lâi tshuē guá.", huayu: "先去北邊的山路幫志工阿伯的忙，再來找我。" } },
    { who: "pet", emotion: "平靜", text: "草嶺古道的志工阿伯，好像需要幫忙！" }
  ],
  D_YL_1A: [
    { who: "kumquat_farmer", emotion: "開心", text: "歡迎來到頭城礁溪！",
      taigi: { hanji: "歡迎來頭城、礁溪！", tailo: "Huan-gîng lâi Thâu-siânn, Ta-khe!", huayu: "歡迎來到頭城礁溪！" } },
    { who: "kumquat_farmer", emotion: "平靜", text: "我在這裡種金棗，金棗可以做成蜜餞。",
      taigi: { hanji: "我佇遮種金棗，金棗會使做鹹酸甜。", tailo: "Guá tī tsia tsìng kim-tsó, kim-tsó ē-sái tsò kiâm-sng-tinn.", huayu: "我在這裡種金棗，金棗可以做成蜜餞。" } },
    { who: "kumquat_farmer", emotion: "擔心", text: "宜蘭一年有一半以上的日子會下雨。",
      taigi: { hanji: "宜蘭一年有一半以上的日子會落雨。", tailo: "Gî-lân tsi̍t nî ū tsi̍t-puànn í-siōng ê ji̍t-tsí ē lo̍h-hōo.", huayu: "宜蘭一年有一半以上的日子會下雨。" } },
    { who: "kumquat_farmer", emotion: "擔心", text: "霧讓我不會看天氣了，幫我想 3 題好嗎？",
      taigi: { hanji: "霧予我袂曉看天氣矣，共我想三題，好無？", tailo: "Bū hōo guá bē-hiáu khuànn thinn-khì--ah, kā guá siūnn sann tê, hó--bô?", huayu: "霧讓我不會看天氣了，幫我想 3 題好嗎？" } }
  ],
  D_YL_1B: [
    { who: "kumquat_farmer", emotion: "開心", text: "想起來了！出門前要先看天氣。",
      taigi: { hanji: "想起來矣！出門進前愛先看天氣。", tailo: "Siūnn khí-lâi--ah! Tshut-mn̂g tsìn-tsîng ài sing khuànn thinn-khì.", huayu: "想起來了！出門前要先看天氣。" } },
    { who: "kumquat_farmer", emotion: "擔心", text: "可是金棗園外面的怪物，把金棗搶走了！",
      taigi: { hanji: "毋過金棗園外口的怪物，共金棗搶走矣！", tailo: "M̄-koh kim-tsó-hn̂g guā-kháu ê kuài-bu̍t, kā kim-tsó tshiúnn-tsáu--ah!", huayu: "可是金棗園外面的怪物，把金棗搶走了！" } }
  ],
  D_YL_2A: [
    { who: "kumquat_farmer", emotion: "擔心", text: "金棗變的怪物被霧弄迷糊，一直跳來跳去。",
      taigi: { hanji: "金棗變的怪物予霧舞甲霧嗄嗄，一直跳來跳去。", tailo: "Kim-tsó piàn ê kuài-bu̍t hōo bū bú kah bū-sà-sà, it-ti̍t thiàu lâi thiàu khì.", huayu: "金棗變的怪物被霧弄迷糊，一直跳來跳去。" } },
    { who: "kumquat_farmer", emotion: "平靜", text: "讓怪物清醒，把 3 顆金棗找回來。",
      taigi: { hanji: "予怪物清醒，共三粒金棗揣轉來。", tailo: "Hōo kuài-bu̍t tshing-tshénn, kā sann lia̍p kim-tsó tshuē tńg--lâi.", huayu: "讓怪物清醒，把 3 顆金棗找回來。" } },
    { who: "pet", emotion: "驚訝", text: "是金棗彈彈！讓牠們清醒，就會掉金棗。" }
  ],
  D_YL_2B: [
    { who: "kumquat_farmer", emotion: "開心", text: "金棗都找回來了，謝謝你！",
      taigi: { hanji: "金棗攏揣轉來矣，多謝你！", tailo: "Kim-tsó lóng tshuē tńg--lâi--ah, to-siā--lí!", huayu: "金棗都找回來了，謝謝你！" } },
    { who: "kumquat_farmer", emotion: "開心", text: "這些金幣和藥草送你。",
      taigi: { hanji: "這寡金幣佮藥草送你。", tailo: "Tsit-kuá kim-pè kah io̍h-tsháu sàng lí.", huayu: "這些金幣和藥草送你。" } },
    { who: "kumquat_farmer", emotion: "平靜", text: "往南走到三星，種蔥的阿伯也在找人幫忙。",
      taigi: { hanji: "向南爿行到三星，種蔥的阿伯嘛咧揣人鬥相共。", tailo: "Ǹg lâm-pîng kiânn kàu Sam-sing, tsìng tshang ê a-peh mā teh tshuē lâng tàu-sann-kāng.", huayu: "往南走到三星，種蔥的阿伯也在找人幫忙。" } }
  ],
  D_KUMQUAT_IDLE: [
    { who: "kumquat_farmer", text: "礁溪有用溫泉種的空心菜喔。",
      taigi: { hanji: "礁溪有用溫泉種的蕹菜喔。", tailo: "Ta-khe ū īng un-tsuânn tsìng ê ìng-tshài--ooh.", huayu: "礁溪有用溫泉種的空心菜喔。" } }
  ],
  D_YL_SNOW_LOCK: [
    { who: "bus_driver", emotion: "平靜", text: "先去北邊的山路幫志工阿伯的忙，再來找我。",
      taigi: { hanji: "先去北爿的山路共志工阿伯鬥相共，才閣來揣我。", tailo: "Sing khì pak-pîng ê suann-lōo kā tsì-kang a-peh tàu-sann-kāng, tsiah-koh lâi tshuē guá.", huayu: "先去北邊的山路幫志工阿伯的忙，再來找我。" } },
    { who: "pet", emotion: "平靜", text: "草嶺古道的志工阿伯，好像需要幫忙！" }
  ],
  D_YL_SNOW_A: [
    { who: "bus_driver", emotion: "開心", text: "我開客運，常常經過一條很長的隧道。",
      taigi: { hanji: "我駛客運，定定經過一條真長的磅空。", tailo: "Guá sái kheh-ūn, tiānn-tiānn king-kuè tsi̍t tiâu tsin tn̂g ê pōng-khang.", huayu: "我開客運，常常經過一條很長的隧道。" } },
    { who: "pet", emotion: "開心", text: "是雪山隧道吧！" },
    { who: "bus_driver", emotion: "平靜", text: "隧道在坪林和頭城中間，有 12.9 公里長。",
      taigi: { hanji: "磅空佇坪林佮頭城中間，有十二點九公里長。", tailo: "Pōng-khang tī Pînn-nâ kah Thâu-siânn tiong-kan, ū tsa̍p-jī tiám káu kong-lí tn̂g.", huayu: "隧道在坪林和頭城中間，有 12.9 公里長。" } },
    { who: "bus_driver", emotion: "平靜", text: "民國 95 年就通車了。",
      taigi: { hanji: "民國九十五年就通車矣。", tailo: "Bîn-kok káu-tsa̍p-gōo nî tō thong-tshia--ah.", huayu: "民國 95 年就通車了。" } },
    { who: "bus_driver", emotion: "擔心", text: "霧讓大家忘了路怎麼走，幫我想 2 題好嗎？",
      taigi: { hanji: "霧予逐家袂記得路按怎行，共我想兩題，好無？", tailo: "Bū hōo ta̍k-ke bē-kì-tit lōo án-tsuánn kiânn, kā guá siūnn nn̄g tê, hó--bô?", huayu: "霧讓大家忘了路怎麼走，幫我想 2 題好嗎？" } }
  ],
  D_YL_SNOW_B: [
    { who: "bus_driver", emotion: "開心", text: "答對了！乘客都知道怎麼走了。",
      taigi: { hanji: "回答著矣！人客攏知影按怎行矣。", tailo: "Huê-tap tio̍h--ah! Lâng-kheh lóng tsai-iánn án-tsuánn kiânn--ah.", huayu: "答對了！乘客都知道怎麼走了。" } },
    { who: "bus_driver", emotion: "開心", text: "送你 80 枚金幣，謝謝你！",
      taigi: { hanji: "送你八十个金幣，多謝你！", tailo: "Sàng lí peh-tsa̍p ê kim-pè, to-siā--lí!", huayu: "送你 80 枚金幣，謝謝你！" } }
  ],
  D_DRIVER_IDLE: [
    { who: "bus_driver", text: "坐車的時候，要坐好喔。",
      taigi: { hanji: "坐車的時，愛坐予好勢喔。", tailo: "Tsē tshia ê sî, ài tsē hōo hó-sè--ooh.", huayu: "坐車的時候，要坐好喔。" } }
  ],
  D_YL_TURTLE_LOCK: [
    { who: "levee_uncle", emotion: "平靜", text: "先去北邊的山路幫志工阿伯的忙，再來找我。",
      taigi: { hanji: "先去北爿的山路共志工阿伯鬥相共，才閣來揣我。", tailo: "Sing khì pak-pîng ê suann-lōo kā tsì-kang a-peh tàu-sann-kāng, tsiah-koh lâi tshuē guá.", huayu: "先去北邊的山路幫志工阿伯的忙，再來找我。" } },
    { who: "pet", emotion: "平靜", text: "草嶺古道的志工阿伯，好像需要幫忙！" }
  ],
  D_YL_TURTLE_A: [
    { who: "levee_uncle", emotion: "平靜", text: "你看海上那座島，就是龜山島。",
      taigi: { hanji: "你看海面頂彼粒島，就是龜山島。", tailo: "Lí khuànn hái-bīn tíng hit lia̍p tó, tō-sī Ku-suann-tó.", huayu: "你看海上那座島，就是龜山島。" } },
    { who: "levee_uncle", emotion: "平靜", text: "它在頭城外海，大約 10 公里遠。",
      taigi: { hanji: "伊佇頭城外海，差不多十公里遠。", tailo: "I tī Thâu-siânn guā-hái, tsha-put-to tsa̍p kong-lí hn̄g.", huayu: "它在頭城外海，大約 10 公里遠。" } },
    { who: "levee_uncle", emotion: "平靜", text: "龜山島是一座火山島喔。",
      taigi: { hanji: "龜山島是一粒火山島喔。", tailo: "Ku-suann-tó sī tsi̍t lia̍p hué-suann-tó--ooh.", huayu: "龜山島是一座火山島喔。" } },
    { who: "levee_uncle", emotion: "擔心", text: "霧讓我想不起來，幫我想 2 題好嗎？",
      taigi: { hanji: "霧予我想袂起來，共我想兩題，好無？", tailo: "Bū hōo guá siūnn bē khí--lâi, kā guá siūnn nn̄g tê, hó--bô?", huayu: "霧讓我想不起來，幫我想 2 題好嗎？" } }
  ],
  D_YL_TURTLE_B: [
    { who: "levee_uncle", emotion: "開心", text: "答對了！你真聰明。",
      taigi: { hanji: "回答著矣！你真巧。", tailo: "Huê-tap tio̍h--ah! Lí tsin khiáu.", huayu: "答對了！你真聰明。" } },
    { who: "levee_uncle", emotion: "開心", text: "送你 80 枚金幣，謝謝你！",
      taigi: { hanji: "送你八十个金幣，多謝你！", tailo: "Sàng lí peh-tsa̍p ê kim-pè, to-siā--lí!", huayu: "送你 80 枚金幣，謝謝你！" } }
  ],
  D_LEVEE_IDLE: [
    { who: "levee_uncle", text: "堤防上風很大，不要靠近海邊喔。",
      taigi: { hanji: "駁岸頂風真透，莫倚近海墘喔。", tailo: "Poh-huānn tíng hong tsin thàu, mài uá-kīn hái-kînn--ooh.", huayu: "堤防上風很大，不要靠近海邊喔。" } }
  ],
  D_SHOP_YILAN_IDLE: [
    { who: "stall_yilan", text: "藥草、點心和卡片，這裡都有喔！",
      taigi: { hanji: "藥草、點心佮卡片，遮攏有喔！", tailo: "Io̍h-tsháu, tiám-sim kah khah-phìnn, tsia lóng ū--ooh!", huayu: "藥草、點心和卡片，這裡都有喔！" } },
    { who: "stall_yilan", text: "頭城老街有紅磚、紅瓦的老房子。",
      taigi: { hanji: "頭城舊街有紅磚紅瓦的古早厝。", tailo: "Thâu-siânn Kū-ke ū âng-tsng âng-hiā ê kóo-tsá tshù.", huayu: "頭城老街有紅磚、紅瓦的老房子。" } }
  ],
  D_INN_JIAOXI: [
    { who: "inn_jiaoxi", emotion: "開心", text: "歡迎來礁溪！這是平地上的溫泉喔。",
      taigi: { hanji: "歡迎來礁溪！這是平地的溫泉喔。", tailo: "Huan-gîng lâi Ta-khe! Tse sī pênn-tē ê un-tsuânn--ooh.", huayu: "歡迎來礁溪！這是平地上的溫泉喔。" } }
  ],
  D_INN_JIAOXI_NOCOIN: [
    { who: "inn_jiaoxi", emotion: "擔心", text: "金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。",
      taigi: { hanji: "金幣無夠喔，金包里溫泉旅館會使免錢蹛，嘛會使去拍怪物趁金幣。", tailo: "Kim-pè bô-kàu--ooh, Kim-pau-lí un-tsuânn lí-kuán ē-sái bián-tsînn tuà, mā ē-sái khì phah kuài-bu̍t thàn kim-pè.", huayu: "金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。" } }
  ],
  D_INN_JIAOXI_BATH: [
    { who: "inn_jiaoxi", emotion: "開心", text: "泡溫泉 10 枚金幣，泡完就有精神了。",
      taigi: { hanji: "浸溫泉十个金幣，浸了就有元氣矣。", tailo: "Tsìm un-tsuânn tsa̍p ê kim-pè, tsìm liáu tō ū guân-khì--ah.", huayu: "泡溫泉 10 枚金幣，泡完就有精神了。" } },
    { who: "pet", emotion: "平靜", text: "泡溫泉不算住宿喔！記得要有大人陪。" }
  ],
  D_YL_3_LOCK: [
    { who: "scallion_farmer", emotion: "平靜", text: "先去北邊幫種金棗的阿伯，再來找我。",
      taigi: { hanji: "先去北爿共種金棗的阿伯鬥相共，才閣來揣我。", tailo: "Sing khì pak-pîng kā tsìng kim-tsó ê a-peh tàu-sann-kāng, tsiah-koh lâi tshuē guá.", huayu: "先去北邊幫種金棗的阿伯，再來找我。" } },
    { who: "pet", emotion: "平靜", text: "頭城礁溪的金棗農阿伯，好像需要幫忙！" }
  ],
  D_YL_3A: [
    { who: "scallion_farmer", emotion: "開心", text: "歡迎來三星！這裡的蔥很有名喔。",
      taigi: { hanji: "歡迎來三星！遮的蔥真出名喔。", tailo: "Huan-gîng lâi Sam-sing! Tsia ê tshang tsin tshut-miâ--ooh.", huayu: "歡迎來三星！這裡的蔥很有名喔。" } },
    { who: "scallion_farmer", emotion: "平靜", text: "我們把稻草鋪在蔥田上，用稻草種蔥。",
      taigi: { hanji: "阮共稻草鋪佇蔥仔田頂，用稻草種蔥。", tailo: "Guán kā tiū-tsháu phoo tī tshang-á-tshân tíng, īng tiū-tsháu tsìng tshang.", huayu: "我們把稻草鋪在蔥田上，用稻草種蔥。" } },
    { who: "scallion_farmer", emotion: "擔心", text: "要收成了，可是霧讓我算不清楚。",
      taigi: { hanji: "欲收成矣，毋過霧予我算袂清楚。", tailo: "Beh siu-sîng--ah, m̄-koh bū hōo guá sǹg bē tshing-tshó.", huayu: "要收成了，可是霧讓我算不清楚。" } },
    { who: "scallion_farmer", emotion: "平靜", text: "幫我算蔥、綁蔥，答對 3 題好嗎？",
      taigi: { hanji: "共我算蔥、縛蔥，回答著三題，好無？", tailo: "Kā guá sǹg tshang, pa̍k tshang, huê-tap tio̍h sann tê, hó--bô?", huayu: "幫我算蔥、綁蔥，答對 3 題好嗎？" } }
  ],
  D_YL_3B: [
    { who: "scallion_farmer", emotion: "開心", text: "綁好了！三星蔥的蔥白又長又香。",
      taigi: { hanji: "縛好矣！三星蔥的蔥白閣長閣芳。", tailo: "Pa̍k hó--ah! Sam-sing-tshang ê tshang-pe̍h koh tn̂g koh phang.", huayu: "綁好了！三星蔥的蔥白又長又香。" } },
    { who: "scallion_farmer", emotion: "平靜", text: "再往南走，就到蘇澳了。",
      taigi: { hanji: "閣向南爿行，就到蘇澳矣。", tailo: "Koh ǹg lâm-pîng kiânn, tō kàu Soo-ò--ah.", huayu: "再往南走，就到蘇澳了。" } }
  ],
  D_SCALLION_IDLE: [
    { who: "scallion_farmer", text: "南邊那條大溪，就是蘭陽溪。",
      taigi: { hanji: "南爿彼條大溪，就是蘭陽溪。", tailo: "Lâm-pîng hit tiâu tuā-khe, tō-sī Lân-iâng-khe.", huayu: "南邊那條大溪，就是蘭陽溪。" } }
  ],
  D_YL_OPERA_LOCK: [
    { who: "opera_actor", emotion: "平靜", text: "先去北邊的山路幫志工阿伯的忙，再來找我。",
      taigi: { hanji: "先去北爿的山路共志工阿伯鬥相共，才閣來揣我。", tailo: "Sing khì pak-pîng ê suann-lōo kā tsì-kang a-peh tàu-sann-kāng, tsiah-koh lâi tshuē guá.", huayu: "先去北邊的山路幫志工阿伯的忙，再來找我。" } },
    { who: "pet", emotion: "平靜", text: "草嶺古道的志工阿伯，好像需要幫忙！" }
  ],
  D_YL_OPERA_A: [
    { who: "opera_actor", emotion: "開心", text: "宜蘭是歌仔戲的故鄉，你知道嗎？",
      taigi: { hanji: "宜蘭是歌仔戲的故鄉，你敢知影？", tailo: "Gî-lân sī kua-á-hì ê kòo-hiong, lí kám tsai-iánn?", huayu: "宜蘭是歌仔戲的故鄉，你知道嗎？" } },
    { who: "opera_actor", emotion: "平靜", text: "書上有寫，歌仔戲是從宜蘭員山開始的。",
      taigi: { hanji: "冊頂有寫，歌仔戲是對宜蘭員山開始的。", tailo: "Tsheh tíng ū siá, kua-á-hì sī tuì Gî-lân Înn-suann khai-sí--ê.", huayu: "書上有寫，歌仔戲是從宜蘭員山開始的。" } },
    { who: "opera_actor", emotion: "擔心", text: "霧讓我忘了台詞，幫我想 3 題好嗎？",
      taigi: { hanji: "霧予我袂記得台詞，共我想三題，好無？", tailo: "Bū hōo guá bē-kì-tit tâi-sû, kā guá siūnn sann tê, hó--bô?", huayu: "霧讓我忘了台詞，幫我想 3 題好嗎？" } }
  ],
  D_YL_OPERA_B: [
    { who: "opera_actor", emotion: "開心", text: "想起來了！今天的戲可以開始演了。",
      taigi: { hanji: "想起來矣！今仔日的戲會使開始搬矣。", tailo: "Siūnn khí-lâi--ah! Kin-á-ji̍t ê hì ē-sái khai-sí puann--ah.", huayu: "想起來了！今天的戲可以開始演了。" } },
    { who: "opera_actor", emotion: "開心", text: "送你 90 枚金幣，謝謝你！",
      taigi: { hanji: "送你九十个金幣，多謝你！", tailo: "Sàng lí káu-tsa̍p ê kim-pè, to-siā--lí!", huayu: "送你 90 枚金幣，謝謝你！" } }
  ],
  D_OPERA_IDLE: [
    { who: "opera_actor", text: "歌仔戲要唱、要演，還要記很多台詞。",
      taigi: { hanji: "歌仔戲愛唱、愛搬，閣愛記真濟台詞。", tailo: "Kua-á-hì ài tshiùnn, ài puann, koh ài kì tsin tsē tâi-sû.", huayu: "歌仔戲要唱、要演，還要記很多台詞。" } }
  ],
  D_INN_SANXING: [
    { who: "inn_sanxing", emotion: "開心", text: "歡迎來我們的民宿！田邊很安靜，好好休息。",
      taigi: { hanji: "歡迎來阮的民宿！田園真恬靜，好好仔歇睏。", tailo: "Huan-gîng lâi guán ê bîn-siok! Tshân-hn̂g tsin tiām-tsīng, hó-hó-á hioh-khùn.", huayu: "歡迎來我們的民宿！田邊很安靜，好好休息。" } }
  ],
  D_INN_SANXING_NOCOIN: [
    { who: "inn_sanxing", emotion: "擔心", text: "金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。",
      taigi: { hanji: "金幣無夠喔，金包里溫泉旅館會使免錢蹛，嘛會使去拍怪物趁金幣。", tailo: "Kim-pè bô-kàu--ooh, Kim-pau-lí un-tsuânn lí-kuán ē-sái bián-tsînn tuà, mā ē-sái khì phah kuài-bu̍t thàn kim-pè.", huayu: "金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。" } }
  ],
  D_YL_4_LOCK: [
    { who: "coldspring_keeper", emotion: "平靜", text: "先去北邊幫種蔥的阿伯，再來找我。",
      taigi: { hanji: "先去北爿共種蔥的阿伯鬥相共，才閣來揣我。", tailo: "Sing khì pak-pîng kā tsìng tshang ê a-peh tàu-sann-kāng, tsiah-koh lâi tshuē guá.", huayu: "先去北邊幫種蔥的阿伯，再來找我。" } },
    { who: "pet", emotion: "平靜", text: "三星的蔥農阿伯，好像需要幫忙！" }
  ],
  D_YL_4A: [
    { who: "coldspring_keeper", emotion: "開心", text: "歡迎來到蘇澳的冷泉！",
      taigi: { hanji: "歡迎來蘇澳的冷泉！", tailo: "Huan-gîng lâi Soo-ò ê líng-tsuânn!", huayu: "歡迎來到蘇澳的冷泉！" } },
    { who: "coldspring_keeper", emotion: "平靜", text: "冷泉的水不到 22 度，摸起來涼涼的。",
      taigi: { hanji: "冷泉的水無到二十二度，摸起來涼涼。", tailo: "Líng-tsuânn ê tsuí bô kàu jī-tsa̍p-jī tōo, bong--khí-lâi liâng-liâng.", huayu: "冷泉的水不到 22 度，摸起來涼涼的。" } },
    { who: "pet", emotion: "開心", text: "冷泉是可以泡的碳酸泉喔！" },
    { who: "coldspring_keeper", emotion: "平靜", text: "因為雨多、石灰岩又厚，才有冷泉。",
      taigi: { hanji: "因為雨水濟、石灰岩閣厚，才有冷泉。", tailo: "In-uī hōo-tsuí tsē, tsio̍h-hue-gâm koh kāu, tsiah ū líng-tsuânn.", huayu: "因為雨多、石灰岩又厚，才有冷泉。" } },
    { who: "coldspring_keeper", emotion: "擔心", text: "霧讓我說不清楚，幫我想 3 題好嗎？",
      taigi: { hanji: "霧予我講袂清楚，共我想三題，好無？", tailo: "Bū hōo guá kóng bē tshing-tshó, kā guá siūnn sann tê, hó--bô?", huayu: "霧讓我說不清楚，幫我想 3 題好嗎？" } }
  ],
  D_YL_4B: [
    { who: "coldspring_keeper", emotion: "開心", text: "想起來了！謝謝你幫忙。",
      taigi: { hanji: "想起來矣！多謝你鬥相共。", tailo: "Siūnn khí-lâi--ah! To-siā lí tàu-sann-kāng.", huayu: "想起來了！謝謝你幫忙。" } },
    { who: "coldspring_keeper", emotion: "平靜", text: "這張引導卡送你，答題時用得到。",
      taigi: { hanji: "這張卡片送你，回答題目用會著。", tailo: "Tsit tiunn khah-phìnn sàng lí, huê-tap tê-bo̍k īng ē tio̍h.", huayu: "這張引導卡送你，答題時用得到。" } },
    { who: "coldspring_keeper", emotion: "擔心", text: "漁港阿伯說，堤防盡頭的雨雲黏住不走！",
      taigi: { hanji: "漁港的阿伯講，駁岸尾溜的雨雲黏咧毋走！", tailo: "Hî-káng ê a-peh kóng, poh-huānn bué-liu ê hōo-hûn liâm--leh m̄ tsáu!", huayu: "漁港阿伯說，堤防盡頭的雨雲黏住不走！" } }
  ],
  D_COLDSPRING_IDLE: [
    { who: "coldspring_keeper", text: "泡冷泉要有大人陪喔。",
      taigi: { hanji: "浸冷泉愛有大人陪喔。", tailo: "Tsìm líng-tsuânn ài ū tuā-lâng puê--ooh.", huayu: "泡冷泉要有大人陪喔。" } }
  ],
  D_INN_SUAO: [
    { who: "inn_suao", emotion: "開心", text: "歡迎來冷泉旅店！好好休息喔。",
      taigi: { hanji: "歡迎來冷泉旅社！好好仔歇睏喔。", tailo: "Huan-gîng lâi líng-tsuânn lí-siā! Hó-hó-á hioh-khùn--ooh.", huayu: "歡迎來冷泉旅店！好好休息喔。" } }
  ],
  D_INN_SUAO_NOCOIN: [
    { who: "inn_suao", emotion: "擔心", text: "金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。",
      taigi: { hanji: "金幣無夠喔，金包里溫泉旅館會使免錢蹛，嘛會使去拍怪物趁金幣。", tailo: "Kim-pè bô-kàu--ooh, Kim-pau-lí un-tsuânn lí-kuán ē-sái bián-tsînn tuà, mā ē-sái khì phah kuài-bu̍t thàn kim-pè.", huayu: "金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。" } }
  ],
  D_INN_SUAO_BATH: [
    { who: "inn_suao", emotion: "開心", text: "泡冷泉 10 枚金幣，泡完就有精神了。",
      taigi: { hanji: "浸冷泉十个金幣，浸了就有元氣矣。", tailo: "Tsìm líng-tsuânn tsa̍p ê kim-pè, tsìm liáu tō ū guân-khì--ah.", huayu: "泡冷泉 10 枚金幣，泡完就有精神了。" } },
    { who: "pet", emotion: "平靜", text: "泡冷泉不算住宿喔！記得要有大人陪。" }
  ],
  D_INN_JINBAOLI_BATH: [
    { who: "innkeeper", emotion: "開心", text: "泡溫泉 5 枚金幣，泡完就有精神了。",
      taigi: { hanji: "浸溫泉五个金幣，浸了就有元氣矣。", tailo: "Tsìm un-tsuânn gōo ê kim-pè, tsìm liáu tō ū guân-khì--ah.", huayu: "泡溫泉 5 枚金幣，泡完就有精神了。" } },
    { who: "pet", emotion: "平靜", text: "泡溫泉不算住宿喔！記得要有大人陪。" }
  ],
  D_YL_FISH_LOCK: [
    { who: "sa_fisher", emotion: "平靜", text: "先去北邊的山路幫志工阿伯的忙，再來找我。",
      taigi: { hanji: "先去北爿的山路共志工阿伯鬥相共，才閣來揣我。", tailo: "Sing khì pak-pîng ê suann-lōo kā tsì-kang a-peh tàu-sann-kāng, tsiah-koh lâi tshuē guá.", huayu: "先去北邊的山路幫志工阿伯的忙，再來找我。" } },
    { who: "pet", emotion: "平靜", text: "草嶺古道的志工阿伯，好像需要幫忙！" }
  ],
  D_YL_FISH_A: [
    { who: "sa_fisher", emotion: "開心", text: "我們這裡的鯖魚很有名喔！",
      taigi: { hanji: "阮遮的花飛真出名喔！", tailo: "Guán tsia ê hue-hui tsin tshut-miâ--ooh!", huayu: "我們這裡的鯖魚很有名喔！" } },
    { who: "pet", emotion: "開心", text: "南方澳的鯖魚！聽說還有鯖魚節呢！" },
    { who: "sa_fisher", emotion: "平靜", text: "這裡辦鯖魚節，已經辦二十多年了。",
      taigi: { hanji: "遮辦花飛節，已經辦二十外年矣。", tailo: "Tsia pān hue-hui-tseh, í-king pān jī-tsa̍p guā nî--ah.", huayu: "這裡辦鯖魚節，已經辦二十多年了。" } },
    { who: "sa_fisher", emotion: "擔心", text: "魚太多了，霧讓我算不清楚。",
      taigi: { hanji: "魚傷濟矣，霧予我算袂清楚。", tailo: "Hî siunn tsē--ah, bū hōo guá sǹg bē tshing-tshó.", huayu: "魚太多了，霧讓我算不清楚。" } },
    { who: "sa_fisher", emotion: "平靜", text: "幫阿伯數魚、分魚箱，答對 3 題好嗎？",
      taigi: { hanji: "共阿伯算魚、分魚箱，回答著三題，好無？", tailo: "Kā a-peh sǹg hî, pun hî-siunn, huê-tap tio̍h sann tê, hó--bô?", huayu: "幫阿伯數魚、分魚箱，答對 3 題好嗎？" } }
  ],
  D_YL_FISH_B: [
    { who: "sa_fisher", emotion: "開心", text: "分得剛剛好，謝謝你！",
      taigi: { hanji: "分甲拄仔好，多謝你！", tailo: "Pun kah tú-á-hó, to-siā--lí!", huayu: "分得剛剛好，謝謝你！" } },
    { who: "sa_fisher", emotion: "開心", text: "這個點心送你，餓了就吃。",
      taigi: { hanji: "這个點心送你，枵就食。", tailo: "Tsit ê tiám-sim sàng lí, iau tō tsia̍h.", huayu: "這個點心送你，餓了就吃。" } }
  ],
  D_YL_5_LOCK: [
    { who: "sa_fisher", emotion: "平靜", text: "先去冷泉那裡幫忙，再來找我。",
      taigi: { hanji: "先去冷泉遐鬥相共，才閣來揣我。", tailo: "Sing khì líng-tsuânn hia tàu-sann-kāng, tsiah-koh lâi tshuē guá.", huayu: "先去冷泉那裡幫忙，再來找我。" } },
    { who: "pet", emotion: "平靜", text: "蘇澳冷泉的管理員，好像需要幫忙！" }
  ],
  D_YL_5A: [
    { who: "sa_fisher", emotion: "擔心", text: "堤防盡頭有一朵大雨雲，黏住不走。",
      taigi: { hanji: "駁岸尾溜有一蕊大雨雲，黏咧毋走。", tailo: "Poh-huānn bué-liu ū tsi̍t luí tuā hōo-hûn, liâm--leh m̄ tsáu.", huayu: "堤防盡頭有一朵大雨雲，黏住不走。" } },
    { who: "sa_fisher", emotion: "擔心", text: "一直下雨，漁船都不能出海。",
      taigi: { hanji: "一直落雨，漁船攏袂當出海。", tailo: "It-ti̍t lo̍h-hōo, hî-tsûn lóng bē-tàng tshut-hái.", huayu: "一直下雨，漁船都不能出海。" } },
    { who: "sa_fisher", emotion: "平靜", text: "你可以去讓它清醒嗎？要小心喔。",
      taigi: { hanji: "你會使去予伊清醒無？愛細膩喔。", tailo: "Lí ē-sái khì hōo i tshing-tshénn--bô? Ài sè-jī--ooh.", huayu: "你可以去讓它清醒嗎？要小心喔。" } },
    { who: "pet", emotion: "平靜", text: "頭目戰不能逃跑，先去旅店休息吧！" }
  ],
  D_YL_5B: [
    { who: "sa_fisher", emotion: "開心", text: "雨停了！天空變藍了！",
      taigi: { hanji: "雨停矣！天變藍矣！", tailo: "Hōo thîng--ah! Thinn piàn nâ--ah!", huayu: "雨停了！天空變藍了！" } },
    { who: "sa_fisher", emotion: "開心", text: "漁船可以出海了，謝謝你！",
      taigi: { hanji: "漁船會使出海矣，多謝你！", tailo: "Hî-tsûn ē-sái tshut-hái--ah, to-siā--lí!", huayu: "漁船可以出海了，謝謝你！" } },
    { who: "pet", emotion: "開心", text: "太好了！宜蘭的天空又亮起來了！" }
  ],
  D_SAFISHER_IDLE: [
    { who: "sa_fisher", text: "漁港邊很滑，走路要小心喔。",
      taigi: { hanji: "漁港邊仔真滑，行路愛細膩喔。", tailo: "Hî-káng pinn--á tsin ku̍t, kiânn-lōo ài sè-jī--ooh.", huayu: "漁港邊很滑，走路要小心喔。" } }
  ],
  D_BOSS_RAINCLOUD_A: [
    { who: "wxb_raincloud", emotion: "神祕", text: "嘩啦啦……我要一直下……不想走……" },
    { who: "pet", emotion: "驚訝", text: "雨雲被霧黏住了！答對自然題叫醒它！" }
  ],
  D_BOSS_RAINCLOUD_B: [{ who: "wxb_raincloud", emotion: "平靜", text: "下完這一陣小雨……我就讓出藍天。" }],
  D_CH2_END: [
    { who: "narrator", emotion: "開心", text: "第二章完成！" },
    { who: "pet", emotion: "開心", text: "搭車回頭城礁溪，從頭城礁溪往西走，就到坪林了！" }
  ],
  D_CH2_JOB_HINT: [{ who: "narrator", emotion: "平靜", text: "要轉職的話，可以搭車回金包里的慈護宮。" }],

  // ═════════════ v1.3 台北章（62 號 4.5、4.6 節；劇本語音組草稿 wip_v13_draft/dialogs_taipei.js，v13_apply.js 每次重跑都整段重建）BEGIN ═════════════
  D_EXIT_LOCK_CH2: [
    { who: "pet", emotion: "平靜", text: "要先完成第二章，才能走這條路喔！" },
    { who: "pet", emotion: "平靜", text: "先去南方澳，讓黏黏雨雲王清醒吧！" }
  ],
  D_SIGN_TAOYUAN: [
    { who: "pet", emotion: "平靜", text: "往桃園的路，要等之後開放才能走。" }
  ],
  D_MIGRATE_CH3: [
    { who: "narrator", emotion: "開心", text: "紅樹林搬到台北北投的旁邊了！以後也可以從北投走過去。" }
  ],
  D_PL_1_LOCK: [
    { who: "tea_farmer", emotion: "平靜", text: "先去蘇澳的漁港幫忙，再來找我。", taigi: { hanji: "先去蘇澳的漁港鬥相共，才閣來揣我。", tailo: "Sing khì Soo-ò ê hî-káng tàu-sann-kāng, tsiah-koh lâi tshuē guá.", huayu: "先去蘇澳的漁港幫忙，再來找我。" } },
    { who: "pet", emotion: "平靜", text: "南方澳的漁港阿伯，好像需要幫忙！" }
  ],
  D_PL_1A: [
    { who: "tea_farmer", emotion: "開心", text: "歡迎來坪林！這裡四面都是山。", taigi: { hanji: "歡迎來坪林！遮四面攏是山。", tailo: "Huan-gîng lâi Pînn-nâ! Tsia sì-bīn lóng sī suann.", huayu: "歡迎來坪林！這裡四面都是山。" } },
    { who: "tea_farmer", emotion: "平靜", text: "這裡種很多茶，大家叫這裡「包種茶鄉」。", taigi: { hanji: "遮種真濟茶，人攏叫遮「包種茶鄉」。", tailo: "Tsia tsìng tsin tsē tê, lâng lóng kiò tsia “pau-tsióng-tê hiong”.", huayu: "這裡種很多茶，大家叫這裡「包種茶鄉」。" } },
    { who: "tea_farmer", emotion: "平靜", text: "這裡十個人裡面，有八個是種茶的。", taigi: { hanji: "遮十个人內底，有八个是種茶的。", tailo: "Tsia tsa̍p ê lâng lāi-té, ū peh ê sī tsìng tê--ê.", huayu: "這裡十個人裡面，有八個是種茶的。" } },
    { who: "tea_farmer", emotion: "擔心", text: "霧讓我忘了怎麼照顧茶樹，幫我想 3 題好嗎？", taigi: { hanji: "霧予我袂記得按怎顧茶欉，共我想三題，好無？", tailo: "Bū hōo guá bē-kì-tit án-tsuánn kòo tê-tsâng, kā guá siūnn sann tê, hó--bô?", huayu: "霧讓我忘了怎麼照顧茶樹，幫我想 3 題好嗎？" } }
  ],
  D_PL_1B: [
    { who: "tea_farmer", emotion: "開心", text: "想起來了！茶樹又變健康了。", taigi: { hanji: "想起來矣！茶欉閣變健康矣。", tailo: "Siūnn khí-lâi--ah! Tê-tsâng koh piàn kiān-khong--ah.", huayu: "想起來了！茶樹又變健康了。" } },
    { who: "tea_farmer", emotion: "擔心", text: "可是茶寮旁邊的怪物，把茶葉搶走了！", taigi: { hanji: "毋過茶寮邊仔的怪物，共茶葉搶走矣！", tailo: "M̄-koh tê-liâu pinn--á ê kuài-bu̍t, kā tê-hio̍h tshiúnn-tsáu--ah!", huayu: "可是茶寮旁邊的怪物，把茶葉搶走了！" } }
  ],
  D_PL_2A: [
    { who: "tea_farmer", emotion: "擔心", text: "那隻怪物背著竹籠，被霧弄迷糊了。", taigi: { hanji: "彼隻怪物揹竹籠，予霧舞甲霧嗄嗄。", tailo: "Hit tsiah kuài-bu̍t phāinn tik-láng, hōo bū bú kah bū-sà-sà.", huayu: "那隻怪物背著竹籠，被霧弄迷糊了。" } },
    { who: "tea_farmer", emotion: "平靜", text: "讓怪物清醒，把 3 包茶葉找回來。", taigi: { hanji: "予怪物清醒，共三包茶葉揣轉來。", tailo: "Hōo kuài-bu̍t tshing-tshénn, kā sann pau tê-hio̍h tshuē tńg--lâi.", huayu: "讓怪物清醒，把 3 包茶葉找回來。" } },
    { who: "pet", emotion: "驚訝", text: "是焙籠火狸！讓牠們清醒，就會掉茶葉。" }
  ],
  D_PL_2B: [
    { who: "tea_farmer", emotion: "開心", text: "茶葉都找回來了，謝謝你！", taigi: { hanji: "茶葉攏揣轉來矣，多謝你！", tailo: "Tê-hio̍h lóng tshuē tńg--lâi--ah, to-siā--lí!", huayu: "茶葉都找回來了，謝謝你！" } },
    { who: "tea_farmer", emotion: "開心", text: "這些金幣和藥草送你。", taigi: { hanji: "這寡金幣佮藥草送你。", tailo: "Tsit-kuá kim-pè kah io̍h-tsháu sàng lí.", huayu: "這些金幣和藥草送你。" } },
    { who: "tea_farmer", emotion: "平靜", text: "往西走，就是木柵了。", taigi: { hanji: "向西爿行，就是木柵矣。", tailo: "Ǹg sai-pîng kiânn, tō-sī Ba̍k-sa--ah.", huayu: "往西走，就是木柵了。" } },
    { who: "pet", emotion: "開心", text: "木柵的貓空，有好多茶園喔！" }
  ],
  D_TEAFARMER_IDLE: [
    { who: "tea_farmer", text: "茶業博物館，就在舊橋旁邊喔。", taigi: { hanji: "茶業博物館，就佇舊橋邊仔喔。", tailo: "Tê-gia̍p phok-bu̍t-kuán, tō tī kū kiô pinn--á--ooh.", huayu: "茶業博物館，就在舊橋旁邊喔。" } }
  ],
  D_MK_1_LOCK: [
    { who: "gondola_staff", emotion: "平靜", text: "先去東邊幫種茶的阿伯，再來找我。", taigi: { hanji: "先去東爿共種茶的阿伯鬥相共，才閣來揣我。", tailo: "Sing khì tang-pîng kā tsìng tê ê a-peh tàu-sann-kāng, tsiah-koh lâi tshuē guá.", huayu: "先去東邊幫種茶的阿伯，再來找我。" } },
    { who: "pet", emotion: "平靜", text: "坪林的茶農阿伯，好像需要幫忙！" }
  ],
  D_MK_1A: [
    { who: "gondola_staff", emotion: "擔心", text: "糟了，車票都被怪物叼走了！", taigi: { hanji: "害矣，車票攏予怪物咬去矣！", tailo: "Hāi--ah, tshia-phiò lóng hōo kuài-bu̍t kā--khì--ah!", huayu: "糟了，車票都被怪物叼走了！" } },
    { who: "gondola_staff", emotion: "擔心", text: "茶園步道的時鐘怪物，被霧弄迷糊了。", taigi: { hanji: "茶園步道的時鐘怪物，予霧舞甲霧嗄嗄。", tailo: "Tê-hn̂g pōo-tō ê sî-tsing kuài-bu̍t, hōo bū bú kah bū-sà-sà.", huayu: "茶園步道的時鐘怪物，被霧弄迷糊了。" } },
    { who: "gondola_staff", emotion: "平靜", text: "讓怪物清醒，把 3 張車票找回來。", taigi: { hanji: "予怪物清醒，共三張車票揣轉來。", tailo: "Hōo kuài-bu̍t tshing-tshénn, kā sann tiunn tshia-phiò tshuē tńg--lâi.", huayu: "讓怪物清醒，把 3 張車票找回來。" } },
    { who: "pet", emotion: "驚訝", text: "是鈴鈴鬧鐘兵！讓牠們清醒，就會掉纜車票。" }
  ],
  D_MK_1B: [
    { who: "gondola_staff", emotion: "開心", text: "車票都找回來了，謝謝你！", taigi: { hanji: "車票攏揣轉來矣，多謝你！", tailo: "Tshia-phiò lóng tshuē tńg--lâi--ah, to-siā--lí!", huayu: "車票都找回來了，謝謝你！" } },
    { who: "gondola_staff", emotion: "平靜", text: "山上種茶的阿伯，也在找人幫忙。", taigi: { hanji: "山頂種茶的阿伯，嘛咧揣人鬥相共。", tailo: "Suann-tíng tsìng tê ê a-peh, mā teh tshuē lâng tàu-sann-kāng.", huayu: "山上種茶的阿伯，也在找人幫忙。" } }
  ],
  D_GONDOLA_IDLE: [
    { who: "gondola_staff", text: "排隊上車，大家都會很安全喔。", taigi: { hanji: "排隊上車，逐家攏會真安全喔。", tailo: "Pâi-tuī tsiūnn-tshia, ta̍k-ke lóng ē tsin an-tsuân--ooh.", huayu: "排隊上車，大家都會很安全喔。" } }
  ],
  D_MK_2_LOCK: [
    { who: "tea_farmer_mk", emotion: "平靜", text: "先去車站那裡幫忙，再來找我。", taigi: { hanji: "先去車站遐鬥相共，才閣來揣我。", tailo: "Sing khì tshia-tsām hia tàu-sann-kāng, tsiah-koh lâi tshuē guá.", huayu: "先去車站那裡幫忙，再來找我。" } },
    { who: "pet", emotion: "平靜", text: "纜車站的站務員，好像需要幫忙！" }
  ],
  D_MK_2A: [
    { who: "tea_farmer_mk", emotion: "開心", text: "我們這裡的茶，很有名喔！", taigi: { hanji: "阮遮的茶，真出名喔！", tailo: "Guán tsia ê tê, tsin tshut-miâ--ooh!", huayu: "我們這裡的茶，很有名喔！" } },
    { who: "tea_farmer_mk", emotion: "平靜", text: "一百多年前，就有人來這裡種這種茶了。", taigi: { hanji: "一百外年前，就有人來遮種這款茶矣。", tailo: "Tsi̍t-pah guā nî tsîng, tō ū lâng lâi tsia tsìng tsit khuán tê--ah.", huayu: "一百多年前，就有人來這裡種這種茶了。" } },
    { who: "pet", emotion: "開心", text: "是鐵觀音茶！聽說這裡是臺灣最大的產地呢！" },
    { who: "tea_farmer_mk", emotion: "擔心", text: "霧讓我秤不準茶葉，幫我算 3 題好嗎？", taigi: { hanji: "霧予我秤袂準茶葉，共我算三題，好無？", tailo: "Bū hōo guá tshìn bē tsún tê-hio̍h, kā guá sǹg sann tê, hó--bô?", huayu: "霧讓我秤不準茶葉，幫我算 3 題好嗎？" } }
  ],
  D_MK_2B: [
    { who: "tea_farmer_mk", emotion: "開心", text: "秤得剛剛好，謝謝你！", taigi: { hanji: "秤甲拄仔好，多謝你！", tailo: "Tshìn kah tú-á-hó, to-siā--lí!", huayu: "秤得剛剛好，謝謝你！" } },
    { who: "tea_farmer_mk", emotion: "平靜", text: "這張引導卡送你，答題時用得到。", taigi: { hanji: "這張卡片送你，回答題目用會著。", tailo: "Tsit tiunn khah-phìnn sàng lí, huê-tap tê-bo̍k īng ē tio̍h.", huayu: "這張引導卡送你，答題時用得到。" } },
    { who: "tea_farmer_mk", emotion: "平靜", text: "往北下山，就是臺北了。", taigi: { hanji: "向北爿落山，就是臺北矣。", tailo: "Ǹg pak-pîng lo̍h-suann, tō-sī Tâi-pak--ah.", huayu: "往北下山，就是臺北了。" } }
  ],
  D_TEAFARMER_MK_IDLE: [
    { who: "tea_farmer_mk", text: "溪邊的石頭，有好多圓圓的洞喔。", taigi: { hanji: "溪邊的石頭，有真濟圓圓的空喔。", tailo: "Khe-pinn ê tsio̍h-thâu, ū tsin tsē înn-înn ê khang--ooh.", huayu: "溪邊的石頭，有好多圓圓的洞喔。" } }
  ],
  D_TEMPLE_ZN_INTRO: [
    { who: "temple_volunteer_zn", emotion: "平靜", text: "這裡是指南宮，大家都叫它「木柵仙公廟」。", taigi: { hanji: "這是指南宮，逐家攏叫伊「木柵仙公廟」。", tailo: "Tse sī Tsí-lâm-kiong, ta̍k-ke lóng kiò i “Ba̍k-sa Sian-kong-biō”.", huayu: "這裡是指南宮，大家都叫它「木柵仙公廟」。" } },
    { who: "temple_volunteer_zn", emotion: "平靜", text: "指南宮在臺北的文山區。", taigi: { hanji: "指南宮佇臺北的文山區。", tailo: "Tsí-lâm-kiong tī Tâi-pak ê Bûn-san-khu.", huayu: "指南宮在臺北的文山區。" } }
  ],
  D_TEMPLE_HT_INTRO: [
    { who: "temple_volunteer_ht", emotion: "平靜", text: "這裡是行天宮，歡迎你來。", taigi: { hanji: "這是行天宮，歡迎你來。", tailo: "Tse sī Hîng-thian-kiong, huan-gîng lí lâi.", huayu: "這裡是行天宮，歡迎你來。" } },
    { who: "temple_volunteer_ht", emotion: "平靜", text: "行天宮不燒金紙，也沒有功德箱。", taigi: { hanji: "行天宮無燒金紙，嘛無功德箱。", tailo: "Hîng-thian-kiong bô sio kim-tsuá, mā bô kong-tik-siunn.", huayu: "行天宮不燒金紙，也沒有功德箱。" } },
    { who: "temple_volunteer_ht", emotion: "平靜", text: "大香爐和供桌拿掉了，大家雙手合十就好。", taigi: { hanji: "大香爐佮神桌提掉矣，逐家雙手合掌就好。", tailo: "Tuā hiunn-lôo kah sîn-toh the̍h-tiāu--ah, ta̍k-ke siang-tshiú ha̍p-tsióng tō hó.", huayu: "大香爐和供桌拿掉了，大家雙手合十就好。" } }
  ],
  D_TPC_1_LOCK: [
    { who: "dihua_shop", emotion: "平靜", text: "先去南邊幫種茶的阿伯，再來找我。", taigi: { hanji: "先去南爿共種茶的阿伯鬥相共，才閣來揣我。", tailo: "Sing khì lâm-pîng kā tsìng tê ê a-peh tàu-sann-kāng, tsiah-koh lâi tshuē guá.", huayu: "先去南邊幫種茶的阿伯，再來找我。" } },
    { who: "pet", emotion: "平靜", text: "貓空的茶農阿伯，好像需要幫忙！" }
  ],
  D_TPC_1A: [
    { who: "dihua_shop", emotion: "開心", text: "歡迎來大稻埕！這條老街從以前就很熱鬧。", taigi: { hanji: "歡迎來大稻埕！這條舊街對古早就真鬧熱。", tailo: "Huan-gîng lâi Tuā-tiū-tiânn! Tsit tiâu Kū-ke tuì kóo-tsá tō tsin lāu-jia̍t.", huayu: "歡迎來大稻埕！這條老街從以前就很熱鬧。" } },
    { who: "dihua_shop", emotion: "平靜", text: "這裡有茶行、中藥店，還有賣布的店。", taigi: { hanji: "遮有茶館、中藥店，閣有賣布的店。", tailo: "Tsia ū tê-kuán, tiong-io̍h-tiàm, koh ū bē pòo ê tiàm.", huayu: "這裡有茶行、中藥店，還有賣布的店。" } },
    { who: "dihua_shop", emotion: "擔心", text: "要過年了，客人好多，我算不過來。", taigi: { hanji: "欲過年矣，人客真濟，我算袂赴。", tailo: "Beh kuè-nî--ah, lâng-kheh tsin tsē, guá sǹg bē hù.", huayu: "要過年了，客人好多，我算不過來。" } },
    { who: "dihua_shop", emotion: "平靜", text: "幫我算帳，答對 3 題好嗎？", taigi: { hanji: "共我算數，回答著三題，好無？", tailo: "Kā guá sǹg-siàu, huê-tap tio̍h sann tê, hó--bô?", huayu: "幫我算帳，答對 3 題好嗎？" } }
  ],
  D_TPC_1B: [
    { who: "dihua_shop", emotion: "開心", text: "算得又快又對！謝謝喔！", taigi: { hanji: "算甲閣緊閣著！多謝喔！", tailo: "Sǹg kah koh kín koh tio̍h! To-siā--ooh!", huayu: "算得又快又對！謝謝喔！" } },
    { who: "dihua_shop", emotion: "平靜", text: "往北走到北投，那裡有冒白煙的山谷。", taigi: { hanji: "向北爿行到北投，遐有咧衝白煙的山谷。", tailo: "Ǹg pak-pîng kiânn kàu Pak-tâu, hia ū teh tshìng pe̍h-ian ê suann-kok.", huayu: "往北走到北投，那裡有冒白煙的山谷。" } },
    { who: "pet", emotion: "驚訝", text: "是地熱谷！那裡的水很燙，不能靠近喔！" }
  ],
  D_DIHUA_IDLE: [
    { who: "dihua_shop", text: "臺北的牛肉麵也很有名喔。", taigi: { hanji: "臺北的牛肉麵嘛真出名喔。", tailo: "Tâi-pak ê gû-bah-mī mā tsin tshut-miâ--ooh.", huayu: "臺北的牛肉麵也很有名喔。" } }
  ],
  D_TPC_2_LOCK: [
    { who: "culture_guide", emotion: "平靜", text: "先去蘇澳的漁港幫忙，再來找我。", taigi: { hanji: "先去蘇澳的漁港鬥相共，才閣來揣我。", tailo: "Sing khì Soo-ò ê hî-káng tàu-sann-kāng, tsiah-koh lâi tshuē guá.", huayu: "先去蘇澳的漁港幫忙，再來找我。" } },
    { who: "pet", emotion: "平靜", text: "南方澳的漁港阿伯，好像需要幫忙！" }
  ],
  D_TPC_2A: [
    { who: "culture_guide", emotion: "平靜", text: "前面這座城門，就是北門。", taigi: { hanji: "頭前這座城門，就是北門。", tailo: "Thâu-tsîng tsit tsō siânn-mn̂g, tō-sī Pak-mn̂g.", huayu: "前面這座城門，就是北門。" } },
    { who: "pet", emotion: "開心", text: "北門又叫做「承恩門」喔！" },
    { who: "culture_guide", emotion: "平靜", text: "北門是一百多年前蓋好的。", taigi: { hanji: "北門是一百外年前起好的。", tailo: "Pak-mn̂g sī tsi̍t-pah guā nî tsîng khí hó--ê.", huayu: "北門是一百多年前蓋好的。" } },
    { who: "culture_guide", emotion: "平靜", text: "它還保留著以前臺北府城的樣子。", taigi: { hanji: "伊閣保留古早臺北府城的樣。", tailo: "I koh pó-liû kóo-tsá Tâi-pak Hú-siânn ê iūnn.", huayu: "它還保留著以前臺北府城的樣子。" } },
    { who: "culture_guide", emotion: "擔心", text: "霧讓大家忘了這些事，幫我想 2 題好嗎？", taigi: { hanji: "霧予逐家袂記得遮的代誌，共我想兩題，好無？", tailo: "Bū hōo ta̍k-ke bē-kì-tit tsia ê tāi-tsì, kā guá siūnn nn̄g tê, hó--bô?", huayu: "霧讓大家忘了這些事，幫我想 2 題好嗎？" } }
  ],
  D_TPC_2B: [
    { who: "culture_guide", emotion: "開心", text: "你都答對了，聽得真認真！", taigi: { hanji: "你攏回答著矣，聽甲真認真！", tailo: "Lí lóng huê-tap tio̍h--ah, thiann kah tsin jīn-tsin!", huayu: "你都答對了，聽得真認真！" } },
    { who: "culture_guide", emotion: "開心", text: "送你 100 枚金幣，謝謝你！", taigi: { hanji: "送你一百个金幣，多謝你！", tailo: "Sàng lí tsi̍t-pah ê kim-pè, to-siā--lí!", huayu: "送你 100 枚金幣，謝謝你！" } }
  ],
  D_CULTURE_IDLE: [
    { who: "culture_guide", text: "臺北的西邊，有一條很大的淡水河。", taigi: { hanji: "臺北的西爿，有一條真大的淡水河。", tailo: "Tâi-pak ê sai-pîng, ū tsi̍t tiâu tsin tuā ê Tām-tsuí-hô.", huayu: "臺北的西邊，有一條很大的淡水河。" } }
  ],
  D_TPC_3_LOCK: [
    { who: "traffic_volunteer", emotion: "平靜", text: "先去蘇澳的漁港幫忙，再來找我。", taigi: { hanji: "先去蘇澳的漁港鬥相共，才閣來揣我。", tailo: "Sing khì Soo-ò ê hî-káng tàu-sann-kāng, tsiah-koh lâi tshuē guá.", huayu: "先去蘇澳的漁港幫忙，再來找我。" } },
    { who: "pet", emotion: "平靜", text: "南方澳的漁港阿伯，好像需要幫忙！" }
  ],
  D_TPC_3A: [
    { who: "traffic_volunteer", emotion: "擔心", text: "路口的紅綠燈，被霧弄得亂閃。", taigi: { hanji: "路口的青紅燈，予霧舞甲亂閃。", tailo: "Lōo-kháu ê tshenn-âng-ting, hōo bū bú kah luān siám.", huayu: "路口的紅綠燈，被霧弄得亂閃。" } },
    { who: "traffic_volunteer", emotion: "擔心", text: "大家都不知道什麼時候能過馬路。", taigi: { hanji: "逐家攏毋知當時會使過馬路。", tailo: "Ta̍k-ke lóng m̄ tsai tang-sî ē-sái kuè bé-lōo.", huayu: "大家都不知道什麼時候能過馬路。" } },
    { who: "traffic_volunteer", emotion: "平靜", text: "幫阿伯想一想，答對 3 題好嗎？", taigi: { hanji: "共阿伯想看覓，回答著三題，好無？", tailo: "Kā a-peh siūnn khuànn-māi, huê-tap tio̍h sann tê, hó--bô?", huayu: "幫阿伯想一想，答對 3 題好嗎？" } }
  ],
  D_TPC_3B: [
    { who: "traffic_volunteer", emotion: "開心", text: "紅綠燈恢復正常了，謝謝你！", taigi: { hanji: "青紅燈恢復正常矣，多謝你！", tailo: "Tshenn-âng-ting khue-ho̍k tsìng-siông--ah, to-siā--lí!", huayu: "紅綠燈恢復正常了，謝謝你！" } },
    { who: "traffic_volunteer", emotion: "平靜", text: "過馬路要看燈號，走斑馬線喔。", taigi: { hanji: "過馬路愛看燈號，行斑馬線喔。", tailo: "Kuè bé-lōo ài khuànn ting-hō, kiânn pan-má-suànn--ooh.", huayu: "過馬路要看燈號，走斑馬線喔。" } },
    { who: "traffic_volunteer", emotion: "開心", text: "送你 100 枚金幣，謝謝你！", taigi: { hanji: "送你一百个金幣，多謝你！", tailo: "Sàng lí tsi̍t-pah ê kim-pè, to-siā--lí!", huayu: "送你 100 枚金幣，謝謝你！" } }
  ],
  D_TRAFFIC_IDLE: [
    { who: "traffic_volunteer", text: "走路要靠邊走，注意車子喔。", taigi: { hanji: "行路愛行邊仔，注意車喔。", tailo: "Kiânn-lōo ài kiânn pinn--á, tsù-ì tshia--ooh.", huayu: "走路要靠邊走，注意車子喔。" } }
  ],
  D_SMITH_TAIPEI_IDLE: [
    { who: "smith_taipei", text: "要買武器嗎？選適合你的就好。", taigi: { hanji: "欲買武器無？揀合你的就好。", tailo: "Beh bé bú-khì--bô? Kíng ha̍h lí ê tō hó.", huayu: "要買武器嗎？選適合你的就好。" } }
  ],
  D_ARMOR_TAIPEI_IDLE: [
    { who: "armor_taipei", text: "穿上防具，被打到比較不痛。", taigi: { hanji: "穿防具，予人拍著較袂疼。", tailo: "Tshīng hông-khū, hōo lâng phah-tio̍h khah bē thiànn.", huayu: "穿上防具，被打到比較不痛。" } }
  ],
  D_ITEM_TAIPEI_IDLE: [
    { who: "item_taipei", text: "藥草和卡片，出門要帶喔！", taigi: { hanji: "藥草佮卡片，出門愛紮喔！", tailo: "Io̍h-tsháu kah khah-phìnn, tshut-mn̂g ài tsah--ooh!", huayu: "藥草和卡片，出門要帶喔！" } }
  ],
  D_BT_1_LOCK: [
    { who: "bt_museum_guide", emotion: "平靜", text: "先去南邊的大稻埕幫忙，再來找我。", taigi: { hanji: "先去南爿的大稻埕鬥相共，才閣來揣我。", tailo: "Sing khì lâm-pîng ê Tuā-tiū-tiânn tàu-sann-kāng, tsiah-koh lâi tshuē guá.", huayu: "先去南邊的大稻埕幫忙，再來找我。" } },
    { who: "pet", emotion: "平靜", text: "大稻埕的南北貨店老闆，好像需要幫忙！" }
  ],
  D_BT_1A: [
    { who: "bt_museum_guide", emotion: "開心", text: "歡迎來到北投溫泉博物館！", taigi: { hanji: "歡迎來北投溫泉博物館！", tailo: "Huan-gîng lâi Pak-tâu Un-tsuânn Phok-bu̍t-kuán!", huayu: "歡迎來到北投溫泉博物館！" } },
    { who: "bt_museum_guide", emotion: "平靜", text: "這裡以前是公共浴場，一百多年前蓋的。", taigi: { hanji: "遮以早是公共浴場，一百外年前起的。", tailo: "Tsia í-tsá sī kong-kiōng i̍k-tiûnn, tsi̍t-pah guā nî tsîng khí--ê.", huayu: "這裡以前是公共浴場，一百多年前蓋的。" } },
    { who: "bt_museum_guide", emotion: "平靜", text: "它有兩層樓，入口在二樓喔。", taigi: { hanji: "伊有兩層樓，入口佇二樓喔。", tailo: "I ū nn̄g tsàn lâu, ji̍p-kháu tī jī-lâu--ooh.", huayu: "它有兩層樓，入口在二樓喔。" } },
    { who: "bt_museum_guide", emotion: "擔心", text: "霧讓我忘了浴場的故事，幫我想 3 題好嗎？", taigi: { hanji: "霧予我袂記得浴場的故事，共我想三題，好無？", tailo: "Bū hōo guá bē-kì-tit i̍k-tiûnn ê kòo-sū, kā guá siūnn sann tê, hó--bô?", huayu: "霧讓我忘了浴場的故事，幫我想 3 題好嗎？" } }
  ],
  D_BT_1B: [
    { who: "bt_museum_guide", emotion: "開心", text: "想起來了！謝謝你幫忙。", taigi: { hanji: "想起來矣！多謝你鬥相共。", tailo: "Siūnn khí-lâi--ah! To-siā lí tàu-sann-kāng.", huayu: "想起來了！謝謝你幫忙。" } },
    { who: "bt_museum_guide", emotion: "平靜", text: "去冒白煙的山谷，找顧山谷的叔叔吧。", taigi: { hanji: "去衝白煙的山谷，揣顧山谷的阿叔。", tailo: "Khì tshìng pe̍h-ian ê suann-kok, tshuē kòo suann-kok ê a-tsik.", huayu: "去冒白煙的山谷，找顧山谷的叔叔吧。" } }
  ],
  D_BTGUIDE_IDLE: [
    { who: "bt_museum_guide", text: "浴場裡面的牆上，有彩色玻璃喔。", taigi: { hanji: "浴場內底的壁頂，有彩色的玻璃喔。", tailo: "I̍k-tiûnn lāi-té ê piah tíng, ū tshái-sik ê po-lê--ooh.", huayu: "浴場裡面的牆上，有彩色玻璃喔。" } }
  ],
  D_BT_2_LOCK: [
    { who: "geo_ranger", emotion: "平靜", text: "先去博物館聽故事，再來找我。", taigi: { hanji: "先去博物館聽故事，才閣來揣我。", tailo: "Sing khì phok-bu̍t-kuán thiann kòo-sū, tsiah-koh lâi tshuē guá.", huayu: "先去博物館聽故事，再來找我。" } },
    { who: "pet", emotion: "平靜", text: "溫泉博物館的解說員，好像需要幫忙！" }
  ],
  D_BT_2A: [
    { who: "pet", emotion: "驚訝", text: "這裡就是地熱谷！" },
    { who: "geo_ranger", emotion: "擔心", text: "這個山谷的水很燙，絕對不能碰！", taigi: { hanji: "這个山谷的水真燒，絕對袂使摸！", tailo: "Tsit ê suann-kok ê tsuí tsin sio, tsua̍t-tuì bē-sái bong!", huayu: "這個山谷的水很燙，絕對不能碰！" } },
    { who: "geo_ranger", emotion: "平靜", text: "最燙的地方有 98 度，還會一直冒白煙。", taigi: { hanji: "上燒的所在有九十八度，閣會一直衝白煙。", tailo: "Siōng sio ê sóo-tsāi ū káu-tsa̍p-peh tōo, koh ē it-ti̍t tshìng pe̍h-ian.", huayu: "最燙的地方有 98 度，還會一直冒白煙。" } },
    { who: "geo_ranger", emotion: "平靜", text: "這種水很酸，會把東西弄壞。", taigi: { hanji: "這款水真酸，會共物件舞歹去。", tailo: "Tsit khuán tsuí tsin sng, ē kā mi̍h-kiānn bú pháinn--khì.", huayu: "這種水很酸，會把東西弄壞。" } },
    { who: "pet", emotion: "平靜", text: "大家叫這種水「青磺」喔。" },
    { who: "geo_ranger", emotion: "平靜", text: "幫我提醒遊客，答對 3 題好嗎？", taigi: { hanji: "共我提醒遊客，回答著三題，好無？", tailo: "Kā guá thê-tshénn iû-kheh, huê-tap tio̍h sann tê, hó--bô?", huayu: "幫我提醒遊客，答對 3 題好嗎？" } }
  ],
  D_BT_2B: [
    { who: "geo_ranger", emotion: "開心", text: "遊客都記住了，謝謝你！", taigi: { hanji: "遊客攏記牢矣，多謝你！", tailo: "Iû-kheh lóng kì-tiâu--ah, to-siā--lí!", huayu: "遊客都記住了，謝謝你！" } },
    { who: "geo_ranger", emotion: "開心", text: "這個點心送你，餓了就吃。", taigi: { hanji: "這个點心送你，枵就食。", tailo: "Tsit ê tiám-sim sàng lí, iau tō tsia̍h.", huayu: "這個點心送你，餓了就吃。" } },
    { who: "geo_ranger", emotion: "平靜", text: "往西走到關渡，紅樹林那邊在找人幫忙。", taigi: { hanji: "向西爿行到關渡，紅樹林遐咧揣人鬥相共。", tailo: "Ǹg sai-pîng kiânn kàu Kan-tāu, Âng-tshiū-nâ hia teh tshuē lâng tàu-sann-kāng.", huayu: "往西走到關渡，紅樹林那邊在找人幫忙。" } }
  ],
  D_GEORANGER_IDLE: [
    { who: "geo_ranger", text: "要站在欄杆外面看喔。", taigi: { hanji: "愛徛佇欄杆外口看喔。", tailo: "Ài khiā tī lân-kan guā-kháu khuànn--ooh.", huayu: "要站在欄杆外面看喔。" } }
  ],
  D_XY_1_LOCK: [
    { who: "observatory_staff", emotion: "平靜", text: "先去蘇澳的漁港幫忙，再來找我。", taigi: { hanji: "先去蘇澳的漁港鬥相共，才閣來揣我。", tailo: "Sing khì Soo-ò ê hî-káng tàu-sann-kāng, tsiah-koh lâi tshuē guá.", huayu: "先去蘇澳的漁港幫忙，再來找我。" } },
    { who: "pet", emotion: "平靜", text: "南方澳的漁港阿伯，好像需要幫忙！" }
  ],
  D_XY_1A: [
    { who: "observatory_staff", emotion: "開心", text: "歡迎來信義！你看那棟好高的大樓。", taigi: { hanji: "歡迎來信義！你看彼棟真懸的大樓。", tailo: "Huan-gîng lâi Sìn-gī! Lí khuànn hit tòng tsin kuân ê tuā-lâu.", huayu: "歡迎來信義！你看那棟好高的大樓。" } },
    { who: "pet", emotion: "開心", text: "是臺北101！" },
    { who: "observatory_staff", emotion: "平靜", text: "它總共有 508 公尺高。", taigi: { hanji: "伊攏總有五百空八公尺懸。", tailo: "I lóng-tsóng ū gōo-pah khòng peh kong-tshioh kuân.", huayu: "它總共有 508 公尺高。" } },
    { who: "observatory_staff", emotion: "擔心", text: "霧讓我算不清楚，幫我算 3 題好嗎？", taigi: { hanji: "霧予我算袂清楚，共我算三題，好無？", tailo: "Bū hōo guá sǹg bē tshing-tshó, kā guá sǹg sann tê, hó--bô?", huayu: "霧讓我算不清楚，幫我算 3 題好嗎？" } }
  ],
  D_XY_1B: [
    { who: "observatory_staff", emotion: "開心", text: "算對了！你真聰明。", taigi: { hanji: "算著矣！你真巧。", tailo: "Sǹg tio̍h--ah! Lí tsin khiáu.", huayu: "算對了！你真聰明。" } },
    { who: "observatory_staff", emotion: "開心", text: "送你 120 枚金幣，謝謝你！", taigi: { hanji: "送你一百二十个金幣，多謝你！", tailo: "Sàng lí tsi̍t-pah jī-tsa̍p ê kim-pè, to-siā--lí!", huayu: "送你 120 枚金幣，謝謝你！" } }
  ],
  D_OBSERV_IDLE: [
    { who: "observatory_staff", text: "象山就在信義的旁邊喔。", taigi: { hanji: "象山就佇信義的邊仔喔。", tailo: "Tshiūnn-suann tō tī Sìn-gī ê pinn--á--ooh.", huayu: "象山就在信義的旁邊喔。" } }
  ],
  D_XY_2_LOCK: [
    { who: "village_guide", emotion: "平靜", text: "先去蘇澳的漁港幫忙，再來找我。", taigi: { hanji: "先去蘇澳的漁港鬥相共，才閣來揣我。", tailo: "Sing khì Soo-ò ê hî-káng tàu-sann-kāng, tsiah-koh lâi tshuē guá.", huayu: "先去蘇澳的漁港幫忙，再來找我。" } },
    { who: "pet", emotion: "平靜", text: "南方澳的漁港阿伯，好像需要幫忙！" }
  ],
  D_XY_2A: [
    { who: "village_guide", emotion: "平靜", text: "這裡是臺北最早的眷村。", taigi: { hanji: "這是臺北上早的眷村。", tailo: "Tse sī Tâi-pak siōng tsá ê kuàn-tshun.", huayu: "這裡是臺北最早的眷村。" } },
    { who: "pet", emotion: "開心", text: "這裡叫做四四南村喔！" },
    { who: "village_guide", emotion: "平靜", text: "因為在兵工廠的南邊，所以取這個名字。", taigi: { hanji: "因為佇兵工廠的南爿，所以號這个名。", tailo: "In-uī tī ping-kang-tiûnn ê lâm-pîng, sóo-í hō tsit ê miâ.", huayu: "因為在兵工廠的南邊，所以取這個名字。" } },
    { who: "village_guide", emotion: "平靜", text: "這四棟房子，左右兩邊長得一樣。", taigi: { hanji: "這四棟厝，倒爿佮正爿生做仝款。", tailo: "Tsit sì tòng tshù, tò-pîng kah tsiànn-pîng senn-tsò kāng-khuán.", huayu: "這四棟房子，左右兩邊長得一樣。" } },
    { who: "village_guide", emotion: "擔心", text: "霧讓大家忘了這些故事，幫我想 2 題好嗎？", taigi: { hanji: "霧予逐家袂記得遮的故事，共我想兩題，好無？", tailo: "Bū hōo ta̍k-ke bē-kì-tit tsia ê kòo-sū, kā guá siūnn nn̄g tê, hó--bô?", huayu: "霧讓大家忘了這些故事，幫我想 2 題好嗎？" } }
  ],
  D_XY_2B: [
    { who: "village_guide", emotion: "開心", text: "你都答對了，聽得真認真！", taigi: { hanji: "你攏回答著矣，聽甲真認真！", tailo: "Lí lóng huê-tap tio̍h--ah, thiann kah tsin jīn-tsin!", huayu: "你都答對了，聽得真認真！" } },
    { who: "village_guide", emotion: "開心", text: "送你 100 枚金幣，謝謝你！", taigi: { hanji: "送你一百个金幣，多謝你！", tailo: "Sàng lí tsi̍t-pah ê kim-pè, to-siā--lí!", huayu: "送你 100 枚金幣，謝謝你！" } }
  ],
  D_VILLAGE_IDLE: [
    { who: "village_guide", text: "相傳有人看這裡的四座山，像四隻神獸。", taigi: { hanji: "相傳有人看遮的四座山，敢若四隻神獸。", tailo: "Siong-thuân ū lâng khuànn tsia ê sì tsō suann, kánn-ná sì tsiah sîn-siù.", huayu: "相傳有人看這裡的四座山，像四隻神獸。" } }
  ],
  D_INN_MAOKONG: [
    { who: "inn_maokong", emotion: "開心", text: "歡迎來茶館！喝杯茶，好好休息。", taigi: { hanji: "歡迎來茶館！啉一杯茶，好好仔歇睏。", tailo: "Huan-gîng lâi tê-kuán! Lim tsi̍t pue tê, hó-hó-á hioh-khùn.", huayu: "歡迎來茶館！喝杯茶，好好休息。" } }
  ],
  D_INN_MAOKONG_NOCOIN: [
    { who: "inn_maokong", emotion: "擔心", text: "金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。", taigi: { hanji: "金幣無夠喔，金包里溫泉旅館會使免錢蹛，嘛會使去拍怪物趁金幣。", tailo: "Kim-pè bô-kàu--ooh, Kim-pau-lí un-tsuânn lí-kuán ē-sái bián-tsînn tuà, mā ē-sái khì phah kuài-bu̍t thàn kim-pè.", huayu: "金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。" } }
  ],
  D_INN_TAIPEI: [
    { who: "inn_taipei", emotion: "開心", text: "歡迎來臺北！我們的旅店很方便喔。", taigi: { hanji: "歡迎來臺北！阮的旅社真方便喔。", tailo: "Huan-gîng lâi Tâi-pak! Guán ê lí-siā tsin hong-piān--ooh.", huayu: "歡迎來臺北！我們的旅店很方便喔。" } }
  ],
  D_INN_TAIPEI_NOCOIN: [
    { who: "inn_taipei", emotion: "擔心", text: "金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。", taigi: { hanji: "金幣無夠喔，金包里溫泉旅館會使免錢蹛，嘛會使去拍怪物趁金幣。", tailo: "Kim-pè bô-kàu--ooh, Kim-pau-lí un-tsuânn lí-kuán ē-sái bián-tsînn tuà, mā ē-sái khì phah kuài-bu̍t thàn kim-pè.", huayu: "金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。" } }
  ],
  D_INN_BEITOU: [
    { who: "inn_beitou", emotion: "開心", text: "歡迎來北投！溫泉就在我們這裡喔。", taigi: { hanji: "歡迎來北投！溫泉就佇阮遮喔。", tailo: "Huan-gîng lâi Pak-tâu! Un-tsuânn tō tī guán tsia--ooh.", huayu: "歡迎來北投！溫泉就在我們這裡喔。" } }
  ],
  D_INN_BEITOU_NOCOIN: [
    { who: "inn_beitou", emotion: "擔心", text: "金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。", taigi: { hanji: "金幣無夠喔，金包里溫泉旅館會使免錢蹛，嘛會使去拍怪物趁金幣。", tailo: "Kim-pè bô-kàu--ooh, Kim-pau-lí un-tsuânn lí-kuán ē-sái bián-tsînn tuà, mā ē-sái khì phah kuài-bu̍t thàn kim-pè.", huayu: "金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。" } }
  ],
  D_INN_BEITOU_BATH: [
    { who: "inn_beitou", emotion: "開心", text: "泡溫泉 10 枚金幣，泡完就有精神了。", taigi: { hanji: "浸溫泉十个金幣，浸了就有元氣矣。", tailo: "Tsìm un-tsuânn tsa̍p ê kim-pè, tsìm liáu tō ū guân-khì--ah.", huayu: "泡溫泉 10 枚金幣，泡完就有精神了。" } },
    { who: "pet", emotion: "平靜", text: "泡溫泉不算住宿喔！記得要有大人陪。" }
  ],
  D_INN_XINYI: [
    { who: "inn_xinyi", emotion: "開心", text: "歡迎來我們的旅店！好好睡一晚。", taigi: { hanji: "歡迎來阮的旅社！好好仔睏一暝。", tailo: "Huan-gîng lâi guán ê lí-siā! Hó-hó-á khùn tsi̍t mê.", huayu: "歡迎來我們的旅店！好好睡一晚。" } }
  ],
  D_INN_XINYI_NOCOIN: [
    { who: "inn_xinyi", emotion: "擔心", text: "金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。", taigi: { hanji: "金幣無夠喔，金包里溫泉旅館會使免錢蹛，嘛會使去拍怪物趁金幣。", tailo: "Kim-pè bô-kàu--ooh, Kim-pau-lí un-tsuânn lí-kuán ē-sái bián-tsînn tuà, mā ē-sái khì phah kuài-bu̍t thàn kim-pè.", huayu: "金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。" } }
  ],
  D_LAMPS_MATH_A: [
    { who: "chief", emotion: "開心", text: "數學的光拿回來了！真棒！", taigi: { hanji: "數學的光提轉來矣！真讚！", tailo: "Sòo-ha̍k ê kng the̍h tńg--lâi--ah! Tsin tsán!", huayu: "數學的光拿回來了！真棒！" } },
    { who: "chief", emotion: "平靜", text: "在數學燈前答對一題，燈就會亮。", taigi: { hanji: "數學燈頭前回答著一題，燈就會光。", tailo: "Sòo-ha̍k-ting thâu-tsîng huê-tap tio̍h tsi̍t tê, ting tō ē kng.", huayu: "在數學燈前答對一題，燈就會亮。" } }
  ],
  D_LAMPS_MATH_B: [
    { who: "narrator", emotion: "開心", text: "數學燈亮起來了！" },
    { who: "chief", emotion: "開心", text: "公園又更亮了！謝謝你。", taigi: { hanji: "公園閣較光矣！多謝你。", tailo: "Kong-hn̂g koh khah kng--ah! To-siā--lí.", huayu: "公園又更亮了！謝謝你。" } }
  ],
  D_CH3_END: [
    { who: "narrator", emotion: "開心", text: "台北章完成！" },
    { who: "pet", emotion: "開心", text: "國語、英語、數學，三盞燈都亮了！" }
  ],
  D_TEMPLE_BLESS_HT: [
    { who: "temple_volunteer_ht", emotion: "開心", text: "你這陣子真認真，這是你自己努力得來的！", taigi: { hanji: "你這站足認真，這攏是你家己拍拚來的！", tailo: "Lí tsit-tsām tsiok jīn-tsin, tse lóng sī lí ka-kī phah-piànn lâi--ê!", huayu: "你這陣子真認真，這是你自己努力得來的！" } },
    { who: "temple_volunteer_ht", emotion: "開心", text: "一路平安，再加油喔！", taigi: { hanji: "一路平安，閣加油喔！", tailo: "Tsi̍t-lōo pîng-an, koh ka-iû--ooh!", huayu: "一路平安，再加油喔！" } }
  ],
  D_TEMPLE_BLESS_ZN: [
    { who: "temple_volunteer_zn", emotion: "開心", text: "你這陣子真認真，這是你自己努力得來的！", taigi: { hanji: "你這站足認真，這攏是你家己拍拚來的！", tailo: "Lí tsit-tsām tsiok jīn-tsin, tse lóng sī lí ka-kī phah-piànn lâi--ê!", huayu: "你這陣子真認真，這是你自己努力得來的！" } },
    { who: "temple_volunteer_zn", emotion: "開心", text: "一路平安，再加油喔！", taigi: { hanji: "一路平安，閣加油喔！", tailo: "Tsi̍t-lōo pîng-an, koh ka-iû--ooh!", huayu: "一路平安，再加油喔！" } }
  ],
  D_TEMPLE_LOCKED_HT: [
    { who: "temple_volunteer_ht", emotion: "平靜", text: "見習冒險者到 10 級，才能來考立志小考喔。", taigi: { hanji: "見習冒險者到十級，才會使來考立志小考喔。", tailo: "Kiàn-si̍p mōo-hiám-tsiá kàu tsa̍p kip, tsiah ē-sái lâi khó li̍p-tsì sió-khó--ooh.", huayu: "見習冒險者到 10 級，才能來考立志小考喔。" } }
  ],
  D_TRIAL_INTRO_HT: [
    { who: "temple_volunteer_ht", emotion: "平靜", text: "想換職業，要先考立志小考喔。", taigi: { hanji: "欲換職業，愛先考立志小考喔。", tailo: "Beh uānn tsit-gia̍p, ài sing khó li̍p-tsì sió-khó--ooh.", huayu: "想換職業，要先考立志小考喔。" } },
    { who: "temple_volunteer_ht", emotion: "平靜", text: "總共 20 題，五科每科 4 題，答對 16 題就過關。", taigi: { hanji: "攏總二十題，五科逐科四題，回答著十六題就過關。", tailo: "Lóng-tsóng jī-tsa̍p tê, gōo kho ta̍k kho sì tê, huê-tap tio̍h tsa̍p-la̍k tê tō kuè-kuan.", huayu: "總共 20 題，五科每科 4 題，答對 16 題就過關。" } },
    { who: "temple_volunteer_ht", emotion: "平靜", text: "題目會念給你聽，念完才開始算時間。", taigi: { hanji: "題目會念予你聽，念了才開始算時間。", tailo: "Tê-bo̍k ē liām hōo lí thiann, liām liáu tsiah khai-sí sǹg sî-kan.", huayu: "題目會念給你聽，念完才開始算時間。" } },
    { who: "temple_volunteer_ht", emotion: "平靜", text: "提示和卡片不能用；中途離開也算考一次。", taigi: { hanji: "提示佮卡片袂使用；中途離開，嘛算考一擺。", tailo: "Thê-sī kah khah-phìnn bē-sái īng; tiong-tôo lī-khui, mā sǹg khó tsi̍t pái.", huayu: "提示和卡片不能用；中途離開也算考一次。" } }
  ],
  D_TRIAL_PASS_HT: [
    { who: "temple_volunteer_ht", emotion: "開心", text: "恭喜你！祝你越來越厲害喔！", taigi: { hanji: "恭喜你！祝你愈來愈𠢕喔！", tailo: "Kiong-hí--lí! Tsiok lí jú lâi jú gâu--ooh!", huayu: "恭喜你！祝你越來越厲害喔！" } }
  ],
  D_TRIAL_FAIL_HT: [
    { who: "temple_volunteer_ht", emotion: "平靜", text: "這次還沒過，沒關係。", taigi: { hanji: "這擺猶未過關，無要緊。", tailo: "Tsit pái iáu-buē kuè-kuan, bô iàu-kín.", huayu: "這次還沒過，沒關係。" } },
    { who: "temple_volunteer_ht", emotion: "平靜", text: "答錯的單元回去多練習，明天可以再來考。", taigi: { hanji: "毋著的單元轉去加練習，明仔載會使閣來考。", tailo: "M̄-tio̍h ê tan-guân tńg-khì ke liān-si̍p, bîn-á-tsài ē-sái koh lâi khó.", huayu: "答錯的單元回去多練習，明天可以再來考。" } },
    { who: "temple_volunteer_ht", emotion: "開心", text: "當見習冒險者，一樣能打倒魔王喔！", taigi: { hanji: "做見習冒險者，仝款會當拍贏魔王喔！", tailo: "Tsò kiàn-si̍p mōo-hiám-tsiá, kāng-khuán ē-tàng phah-iânn môo-ông--ooh!", huayu: "當見習冒險者，一樣能打倒魔王喔！" } }
  ],
  D_TRIAL_AGAIN_HT: [
    { who: "temple_volunteer_ht", emotion: "平靜", text: "今天已經考一次了，明天再來喔。", taigi: { hanji: "今仔日已經考一擺矣，明仔載才閣來喔。", tailo: "Kin-á-ji̍t í-king khó tsi̍t pái--ah, bîn-á-tsài tsiah koh lâi--ooh.", huayu: "今天已經考一次了，明天再來喔。" } }
  ],
  D_JOB_LV1_HT: [
    { who: "temple_volunteer_ht", emotion: "平靜", text: "換了職業，等級會從 1 開始。", taigi: { hanji: "換職業了後，等級會對一級開始。", tailo: "Uānn tsit-gia̍p liáu-āu, tíng-kip ē tuì tsi̍t kip khai-sí.", huayu: "換了職業，等級會從 1 開始。" } },
    { who: "temple_volunteer_ht", emotion: "開心", text: "不過能力有保底，不會少太多，不用擔心。", taigi: { hanji: "毋過能力袂減傷濟，免煩惱。", tailo: "M̄-koh lîng-li̍k bē kiám siunn tsē, bián huân-ló.", huayu: "不過能力有保底，不會少太多，不用擔心。" } }
  ],
  D_JOB_BACK_HT: [
    { who: "temple_volunteer_ht", emotion: "開心", text: "這個職業你以前當過，免費換回去，不用考試。", taigi: { hanji: "這个職業你以早做過，免錢換轉去，免考試。", tailo: "Tsit ê tsit-gia̍p lí í-tsá tsò--kuè, bián-tsînn uānn tńg-khì, bián khó-tshì.", huayu: "這個職業你以前當過，免費換回去，不用考試。" } },
    { who: "temple_volunteer_ht", emotion: "平靜", text: "等級也會和以前一樣喔。", taigi: { hanji: "等級嘛會佮以早仝款喔。", tailo: "Tíng-kip mā ē kah í-tsá kāng-khuán--ooh.", huayu: "等級也會和以前一樣喔。" } }
  ],
  D_TEMPLE_LOCKED_ZN: [
    { who: "temple_volunteer_zn", emotion: "平靜", text: "見習冒險者到 10 級，才能來考立志小考喔。", taigi: { hanji: "見習冒險者到十級，才會使來考立志小考喔。", tailo: "Kiàn-si̍p mōo-hiám-tsiá kàu tsa̍p kip, tsiah ē-sái lâi khó li̍p-tsì sió-khó--ooh.", huayu: "見習冒險者到 10 級，才能來考立志小考喔。" } }
  ],
  D_TRIAL_INTRO_ZN: [
    { who: "temple_volunteer_zn", emotion: "平靜", text: "想換職業，要先考立志小考喔。", taigi: { hanji: "欲換職業，愛先考立志小考喔。", tailo: "Beh uānn tsit-gia̍p, ài sing khó li̍p-tsì sió-khó--ooh.", huayu: "想換職業，要先考立志小考喔。" } },
    { who: "temple_volunteer_zn", emotion: "平靜", text: "總共 20 題，五科每科 4 題，答對 16 題就過關。", taigi: { hanji: "攏總二十題，五科逐科四題，回答著十六題就過關。", tailo: "Lóng-tsóng jī-tsa̍p tê, gōo kho ta̍k kho sì tê, huê-tap tio̍h tsa̍p-la̍k tê tō kuè-kuan.", huayu: "總共 20 題，五科每科 4 題，答對 16 題就過關。" } },
    { who: "temple_volunteer_zn", emotion: "平靜", text: "題目會念給你聽，念完才開始算時間。", taigi: { hanji: "題目會念予你聽，念了才開始算時間。", tailo: "Tê-bo̍k ē liām hōo lí thiann, liām liáu tsiah khai-sí sǹg sî-kan.", huayu: "題目會念給你聽，念完才開始算時間。" } },
    { who: "temple_volunteer_zn", emotion: "平靜", text: "提示和卡片不能用；中途離開也算考一次。", taigi: { hanji: "提示佮卡片袂使用；中途離開，嘛算考一擺。", tailo: "Thê-sī kah khah-phìnn bē-sái īng; tiong-tôo lī-khui, mā sǹg khó tsi̍t pái.", huayu: "提示和卡片不能用；中途離開也算考一次。" } }
  ],
  D_TRIAL_PASS_ZN: [
    { who: "temple_volunteer_zn", emotion: "開心", text: "恭喜你！祝你越來越厲害喔！", taigi: { hanji: "恭喜你！祝你愈來愈𠢕喔！", tailo: "Kiong-hí--lí! Tsiok lí jú lâi jú gâu--ooh!", huayu: "恭喜你！祝你越來越厲害喔！" } }
  ],
  D_TRIAL_FAIL_ZN: [
    { who: "temple_volunteer_zn", emotion: "平靜", text: "這次還沒過，沒關係。", taigi: { hanji: "這擺猶未過關，無要緊。", tailo: "Tsit pái iáu-buē kuè-kuan, bô iàu-kín.", huayu: "這次還沒過，沒關係。" } },
    { who: "temple_volunteer_zn", emotion: "平靜", text: "答錯的單元回去多練習，明天可以再來考。", taigi: { hanji: "毋著的單元轉去加練習，明仔載會使閣來考。", tailo: "M̄-tio̍h ê tan-guân tńg-khì ke liān-si̍p, bîn-á-tsài ē-sái koh lâi khó.", huayu: "答錯的單元回去多練習，明天可以再來考。" } },
    { who: "temple_volunteer_zn", emotion: "開心", text: "當見習冒險者，一樣能打倒魔王喔！", taigi: { hanji: "做見習冒險者，仝款會當拍贏魔王喔！", tailo: "Tsò kiàn-si̍p mōo-hiám-tsiá, kāng-khuán ē-tàng phah-iânn môo-ông--ooh!", huayu: "當見習冒險者，一樣能打倒魔王喔！" } }
  ],
  D_TRIAL_AGAIN_ZN: [
    { who: "temple_volunteer_zn", emotion: "平靜", text: "今天已經考一次了，明天再來喔。", taigi: { hanji: "今仔日已經考一擺矣，明仔載才閣來喔。", tailo: "Kin-á-ji̍t í-king khó tsi̍t pái--ah, bîn-á-tsài tsiah koh lâi--ooh.", huayu: "今天已經考一次了，明天再來喔。" } }
  ],
  D_JOB_LV1_ZN: [
    { who: "temple_volunteer_zn", emotion: "平靜", text: "換了職業，等級會從 1 開始。", taigi: { hanji: "換職業了後，等級會對一級開始。", tailo: "Uānn tsit-gia̍p liáu-āu, tíng-kip ē tuì tsi̍t kip khai-sí.", huayu: "換了職業，等級會從 1 開始。" } },
    { who: "temple_volunteer_zn", emotion: "開心", text: "不過能力有保底，不會少太多，不用擔心。", taigi: { hanji: "毋過能力袂減傷濟，免煩惱。", tailo: "M̄-koh lîng-li̍k bē kiám siunn tsē, bián huân-ló.", huayu: "不過能力有保底，不會少太多，不用擔心。" } }
  ],
  D_JOB_BACK_ZN: [
    { who: "temple_volunteer_zn", emotion: "開心", text: "這個職業你以前當過，免費換回去，不用考試。", taigi: { hanji: "這个職業你以早做過，免錢換轉去，免考試。", tailo: "Tsit ê tsit-gia̍p lí í-tsá tsò--kuè, bián-tsînn uānn tńg-khì, bián khó-tshì.", huayu: "這個職業你以前當過，免費換回去，不用考試。" } },
    { who: "temple_volunteer_zn", emotion: "平靜", text: "等級也會和以前一樣喔。", taigi: { hanji: "等級嘛會佮以早仝款喔。", tailo: "Tíng-kip mā ē kah í-tsá kāng-khuán--ooh.", huayu: "等級也會和以前一樣喔。" } }
  ],
  // ═════════════ v1.3 台北章 END ═════════════
};
