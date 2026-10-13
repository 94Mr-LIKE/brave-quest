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
 *
 * who：NPC id（對應 maps.js）、怪物 id（對應 monsters.js）、"hero"（主角）、"pet"（番薯仔）、"narrator"（旁白）。
 */
window.SPEAKERS = {
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
  tree_king: "枯萎樹王", fog_octopus: "迷霧章魚", mud_frog: "泥巴大蛙", noise_bat: "噪音蝙蝠王",
  angry_golem: "暴躁石像", fog_demon: "遺忘霧魔"
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
    { who: "innkeeper", emotion: "開心", text: "窗戶補好了，辛苦你了！",
      taigi: { hanji: "窗仔補好矣，勞力喔！", tailo: "Thang-á póo hó--ah, lóo-la̍t--ooh!", huayu: "窗戶補好了，謝謝你喔！" } },
    { who: "innkeeper", emotion: "開心", text: "送你一張刪去卡，可以刪掉一個錯的選項。",
      taigi: { hanji: "送你一張卡片，會使共一个毋著的選項提掉。", tailo: "Sàng lí tsi̍t tiunn khah-phìnn, ē-sái kā tsi̍t ê m̄-tio̍h ê suán-hāng the̍h-tiāu.", huayu: "送你一張刪去卡，可以刪掉一個錯的選項。" } },
    { who: "innkeeper", emotion: "平靜", text: "客運站可以搭車去遠方的神木森林。",
      taigi: { hanji: "佇客運站坐車，會使去真遠的神木森林。", tailo: "Tī kheh-ūn-tsām tsē tshia, ē-sái khì tsin hn̄g ê Sîn-bo̍k sim-lîm.", huayu: "客運站可以搭車去遠方的神木森林。" } },
    { who: "innkeeper", emotion: "平靜", text: "往東走，還有熱鬧的山城市集。",
      taigi: { hanji: "向東爿行，閣有一个真鬧熱的市場。", tailo: "Ǹg tang-pîng kiânn, koh ū tsi̍t ê tsin lāu-jia̍t ê tshī-tiûnn.", huayu: "往東走，還有熱鬧的山城市集。" } },
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
  D_ELF_4B: [
    { who: "elf_elder", emotion: "開心", text: "神木醒了，綠葉又長出來了！" },
    { who: "narrator", emotion: "開心", text: "你拿回了「自然之光」！" },
    { who: "elf_elder", emotion: "擔心", text: "紅樹林濕地的地精族也很煩惱。" },
    { who: "pet", emotion: "開心", text: "可以搭車去紅樹林濕地了！" }
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
    { who: "merchant", text: "先回金包里，幫溫泉旅館的忙吧。" }
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
    { who: "merchant", emotion: "驚訝", text: "可是金包里的漁港冒出了大觸手！" }
  ],
  D_MER_4A: [
    { who: "merchant", emotion: "擔心", text: "迷霧章魚把漁船都擋住了。" },
    { who: "merchant", emotion: "擔心", text: "牠只聽得懂英文，拜託你了！" },
    { who: "pet", emotion: "平靜", text: "回金包里的漁港，沿著木橋走到底！" }
  ],
  D_MER_4B: [
    { who: "merchant", emotion: "開心", text: "漁船可以出海了！Thank you!（謝謝你！）" },
    { who: "narrator", emotion: "開心", text: "你拿回了「英語之光」！" },
    { who: "merchant", emotion: "平靜", text: "金包里東北邊的海蝕洞窟裡，" },
    { who: "merchant", emotion: "平靜", text: "住著哥布林，也需要你的幫忙。" }
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
  D_GNO_LOCK: [
    { who: "gnome_chief", emotion: "擔心", text: "濕地的霧太濃，什麼都看不清楚。" },
    { who: "gnome_chief", emotion: "平靜", text: "聽說精靈的「自然之光」能照亮霧。" },
    { who: "pet", emotion: "平靜", text: "先去神木森林，幫精靈長老吧！" }
  ],
  D_GNO_1A: [
    { who: "gnome_chief", emotion: "驚訝", text: "自然之光照亮了濕地！你好厲害。" },
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
  D_GNO_4B: [
    { who: "gnome_chief", emotion: "開心", text: "棧道蓋好了！你真是算數高手。" },
    { who: "narrator", emotion: "開心", text: "你拿回了「數學之光」！" }
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
    { who: "goblin_chief", emotion: "平靜", text: "山城市集的外國商人，你幫過了嗎？" },
    { who: "pet", emotion: "平靜", text: "先去山城市集，幫商人的忙吧！" }
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
    { who: "goblin_chief", emotion: "擔心", text: "聽說月世界的獸人也在吵架。" }
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
      taigi: { hanji: "這是金包里慈護宮，金山人攏叫伊「大廟」。", tailo: "Tse sī Kim-pau-lí Tsû-hōo-kiong, Kim-suann-lâng lóng kiò i “Tuā-biō”.", huayu: "這裡是金包里慈護宮，金山人都叫它「大廟」。" } },
    { who: "temple_keeper", emotion: "平靜", text: "廟裡主要拜金面媽祖，已經有兩百多年了。",
      taigi: { hanji: "廟內主要拜金面媽祖，已經兩百外年矣。", tailo: "Biō lāi tsú-iàu pài Kim-bīn Má-tsóo, í-king nn̄g-pah guā nî--ah.", huayu: "廟裡主要拜金面媽祖，已經有兩百多年了。" } },
    { who: "temple_keeper", emotion: "神祕", text: "相傳二媽的神像從海上漂到野柳海岸，被漁民發現。",
      taigi: { hanji: "相傳二媽的神像流到野柳的海墘，予討海人看著。", tailo: "Siong-thuân Jī-má ê sîn-siōng lâu kàu Iá-liú ê hái-kînn, hōo thó-hái-lâng khuànn--tio̍h.", huayu: "相傳二媽的神像從海上漂到野柳海岸，被漁民發現。" } }
  ],
  D_TEMPLE_BLESS: [
    { who: "temple_keeper", emotion: "開心", text: "你這陣子真認真，這是你自己努力得來的！",
      taigi: { hanji: "你這站足認真，這攏是你家己拍拚來的！", tailo: "Lí tsit-tsām tsiok jīn-tsin, tse lóng sī lí ka-kī phah-piànn lâi--ê!", huayu: "你這陣子真認真，這是你自己努力得來的！" } },
    { who: "temple_keeper", emotion: "開心", text: "祝你一路平安，媽祖也會保佑你。",
      taigi: { hanji: "祝你一路平安，媽祖嘛會保庇你。", tailo: "Tsiok lí tsi̍t-lōo pîng-an, Má-tsóo mā ē pó-pì lí.", huayu: "祝你一路平安，媽祖也會保佑你。" } }
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
    { who: "temple_keeper", emotion: "平靜", text: "提示和卡片不能用；考到一半離開，也算考一次。",
      taigi: { hanji: "提示佮卡片袂使用；考一半離開，嘛算考一擺。", tailo: "Thê-sī kah khah-phìnn bē-sái īng; khó tsi̍t-puànn lī-khui, mā sǹg khó tsi̍t pái.", huayu: "提示和卡片不能用；考到一半離開，也算考一次。" } }
  ],
  D_TRIAL_INTRO_GUILD: [
    { who: "guild", emotion: "開心", text: "要換新職業，先來考立志小考吧！",
      taigi: { hanji: "欲換新的職業，先來考立志小考！", tailo: "Beh uānn sin ê tsit-gia̍p, sing lâi khó li̍p-tsì sió-khó!", huayu: "要換新職業，先來考立志小考吧！" } },
    { who: "guild", emotion: "平靜", text: "一共 20 題，五科各 4 題，答對 16 題就過關。",
      taigi: { hanji: "攏總二十題，五科逐科四題，回答著十六題就過關。", tailo: "Lóng-tsóng jī-tsa̍p tê, gōo kho ta̍k kho sì tê, huê-tap tio̍h tsa̍p-la̍k tê tō kuè-kuan.", huayu: "一共 20 題，五科各 4 題，答對 16 題就過關。" } },
    { who: "guild", emotion: "平靜", text: "題目念完，才開始算時間，慢慢聽清楚。",
      taigi: { hanji: "題目念了，才開始算時間，慢慢仔聽予清楚。", tailo: "Tê-bo̍k liām liáu, tsiah khai-sí sǹg sî-kan, bān-bān-á thiann hōo tshing-tshó.", huayu: "題目念完，才開始算時間，慢慢聽清楚。" } },
    { who: "guild", emotion: "平靜", text: "提示、卡片不能用；中途離開也算考一次喔。",
      taigi: { hanji: "提示、卡片袂使用；考一半離開嘛算考一擺喔。", tailo: "Thê-sī, khah-phìnn bē-sái īng; khó tsi̍t-puànn lī-khui mā sǹg khó tsi̍t pái--ooh.", huayu: "提示、卡片不能用；中途離開也算考一次喔。" } }
  ],
  D_TRIAL_PASS_TEMPLE: [
    { who: "temple_keeper", emotion: "開心", text: "恭喜你，立志小考過關了！",
      taigi: { hanji: "恭喜你，立志小考過關矣！", tailo: "Kiong-hí lí, li̍p-tsì sió-khó kuè-kuan--ah!", huayu: "恭喜你，立志小考過關了！" } }
  ],
  D_TRIAL_PASS_GUILD: [
    // 老闆 2026-10-13 選定候選 B（原句「真好，立志小考過關矣！」語意不通順、太生硬）。𠢕（gâu）是擴充 B 區字，前端負責替代顯示
    { who: "guild", emotion: "開心", text: "恭喜你！祝你越來越厲害喔！",
      taigi: { hanji: "恭喜你！祝你愈來愈𠢕喔！", tailo: "Kiong-hí--lí! Tsiok lí jú lâi jú gâu--ooh!", huayu: "恭喜你！祝你越來越厲害喔！" } },
    { who: "guild", emotion: "開心", text: "這是你自己努力得來的，新職業也要加油！",
      taigi: { hanji: "這是你家己拍拚來的，新職業嘛愛加油！", tailo: "Tse sī lí ka-kī phah-piànn lâi--ê, sin tsit-gia̍p mā ài ka-iû!", huayu: "這是你自己努力得來的，新職業也要加油！" } }
  ],
  D_TRIAL_FAIL_TEMPLE: [
    { who: "temple_keeper", emotion: "平靜", text: "這次差一點點，沒關係。",
      taigi: { hanji: "這擺差一屑仔，無要緊。", tailo: "Tsit pái tsha tsi̍t-sut-á, bô iàu-kín.", huayu: "這次差一點點，沒關係。" } },
    { who: "temple_keeper", emotion: "平靜", text: "答錯的單元回去多練習，明天可以再來考。",
      taigi: { hanji: "毋著的單元轉去加練習，明仔載會使閣來考。", tailo: "M̄-tio̍h ê tan-guân tńg-khì ke liān-si̍p, bîn-á-tsài ē-sái koh lâi khó.", huayu: "答錯的單元回去多練習，明天可以再來考。" } },
    { who: "temple_keeper", emotion: "開心", text: "當見習冒險者，一樣能打倒魔王喔！",
      taigi: { hanji: "做見習冒險者，仝款會當拍贏魔王喔！", tailo: "Tsò kiàn-si̍p mōo-hiám-tsiá, kāng-khuán ē-tàng phah-iânn môo-ông--ooh!", huayu: "當見習冒險者，一樣能打倒魔王喔！" } }
  ],
  D_TRIAL_FAIL_GUILD: [
    { who: "guild", emotion: "平靜", text: "差一點點！沒關係，這次就當作練習。",
      taigi: { hanji: "差一屑仔！無要緊，這擺就當做練習。", tailo: "Tsha tsi̍t-sut-á! Bô iàu-kín, tsit pái tō tòng-tsò liān-si̍p.", huayu: "差一點點！沒關係，這次就當作練習。" } },
    { who: "guild", emotion: "平靜", text: "把答錯的單元多練習，明天再來考。",
      taigi: { hanji: "共毋著的單元加練習，明仔載閣來考。", tailo: "Kā m̄-tio̍h ê tan-guân ke liān-si̍p, bîn-á-tsài koh lâi khó.", huayu: "把答錯的單元多練習，明天再來考。" } },
    { who: "guild", emotion: "開心", text: "當見習冒險者也能打倒魔王，不用煩惱！",
      taigi: { hanji: "做見習冒險者嘛會當拍贏魔王，免煩惱！", tailo: "Tsò kiàn-si̍p mōo-hiám-tsiá mā ē-tàng phah-iânn môo-ông, bián huân-ló!", huayu: "當見習冒險者也能打倒魔王，不用煩惱！" } }
  ],
  D_TRIAL_AGAIN_TEMPLE: [
    { who: "temple_keeper", emotion: "平靜", text: "今天考過一次了，明天再來喔。",
      taigi: { hanji: "今仔日考一擺矣，明仔載才閣來喔。", tailo: "Kin-á-ji̍t khó tsi̍t pái--ah, bîn-á-tsài tsiah koh lâi--ooh.", huayu: "今天考過一次了，明天再來喔。" } }
  ],
  D_TRIAL_AGAIN_GUILD: [
    { who: "guild", emotion: "平靜", text: "今天已經考過一次了，明天再來吧！",
      taigi: { hanji: "今仔日已經考一擺矣，明仔載才閣來！", tailo: "Kin-á-ji̍t í-king khó tsi̍t pái--ah, bîn-á-tsài tsiah koh lâi!", huayu: "今天已經考過一次了，明天再來吧！" } }
  ],
  D_JOB_LV1_TEMPLE: [
    { who: "temple_keeper", emotion: "平靜", text: "換了職業，等級會從 1 開始。",
      taigi: { hanji: "換職業了後，等級會對一級開始。", tailo: "Uānn tsit-gia̍p liáu-āu, tíng-kip ē tuì tsi̍t kip khai-sí.", huayu: "換了職業，等級會從 1 開始。" } },
    { who: "temple_keeper", emotion: "開心", text: "不過能力有保底，不會少太多，不用擔心。",
      taigi: { hanji: "毋過能力袂減傷濟，免煩惱。", tailo: "M̄-koh lîng-li̍k bē kiám siunn tsē, bián huân-ló.", huayu: "不過能力有保底，不會少太多，不用擔心。" } }
  ],
  D_JOB_LV1_GUILD: [
    { who: "guild", emotion: "平靜", text: "提醒你：轉職後等級從 1 開始喔。",
      taigi: { hanji: "共你提醒：換職業了後，等級對一級開始喔。", tailo: "Kā lí thê-tshénn: uānn tsit-gia̍p liáu-āu, tíng-kip tuì tsi̍t kip khai-sí--ooh.", huayu: "提醒你：轉職後等級從 1 開始喔。" } },
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
    { who: "pet", emotion: "平靜", text: "上次小考沒考完，算考過一次喔。明天再一起加油！" }
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
    { who: "guild", text: "你已經 10 級了！想當哪一種冒險者？",
      taigi: { hanji: "你已經十級矣！想欲揀佗一个職業？", tailo: "Lí í-king tsa̍p kip--ah! Siūnn-beh kíng tó tsi̍t ê tsit-gia̍p?", huayu: "你已經 10 級了！想當哪一種冒險者？" } },
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
  ]
};
