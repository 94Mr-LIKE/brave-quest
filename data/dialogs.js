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
 * - 生活化的 NPC（老街阿伯、漁夫阿伯、廟公、市場阿姨等）有些句子加 taigi 欄位。
 * - taigi 的格式是 { hanji: 台語漢字, tailo: 台羅拼音, huayu: 華語翻譯 }。
 * - text 一律放華語版本，給朗讀和聽不懂台語的孩子看。
 * - hanji、tailo 已依教育部《臺灣台語常用詞辭典》查證（2026-10-07，查證表見 10_台語查證表.xlsx）；台羅標本調，不標連讀變調。
 *
 * who：NPC id（對應 maps.js）、怪物 id（對應 monsters.js）、"hero"（主角）、"pet"（番薯仔）、"narrator"（旁白）。
 */
window.SPEAKERS = {
  hero: "{name}", pet: "番薯仔", narrator: "",
  chief: "里長伯", temple_keeper: "廟公", bookstore: "圖書館阿姨", fisher: "漁夫阿伯", shopkeeper: "老街阿伯",
  innkeeper: "溫泉旅館老闆娘", potato_seller: "賣地瓜的阿姨", hiker: "登山阿伯",
  elf_kid_lost: "迷路的精靈小孩", elf_elder: "精靈長老", elf_kid: "精靈小孩葉葉",
  gnome_chief: "地精族長", gnome: "地精工匠", gnome_measure: "地精木匠",
  goblin_kid_echo: "洞窟裡的哥布林小孩", goblin_chief: "哥布林酋長", goblin_kid: "哥布林小孩咕嚕",
  orc_chief: "獸人族長", orc: "獸人獵人", orc_bank: "獸人小班長",
  merchant: "外國商人", blacksmith: "鐵匠師傅", armor_keeper: "防具店老闆", item_keeper: "市場阿姨",
  innkeeper_port: "山城民宿老闆娘", taro_seller: "芋圓店阿姨",
  king: "城主", guild: "公會導師", librarian: "圖書館員",
  tree_king: "枯萎樹王", fog_octopus: "迷霧章魚", mud_frog: "泥巴大蛙", noise_bat: "噪音蝙蝠王",
  angry_golem: "暴躁石像", fog_demon: "遺忘霧魔"
};

window.DIALOGS = {

  // ═════════════ 系統與主線 ═════════════
  D_INTRO: [
    { who: "narrator", text: "美麗島的北海岸，有個小鎮叫金包里。" },
    { who: "narrator", text: "有一天，灰灰的「遺忘霧」從海上飄來。" },
    { who: "chief", text: "糟了！公園的知識燈都熄了！",
      taigi: { hanji: "害矣！公園的智識燈攏化去矣！", tailo: "Hāi--ah! Kong-hn̂g ê tì-sik-ting lóng hua--khì--ah!", huayu: "糟了！公園的知識燈都熄了！" } },
    { who: "chief", text: "被霧碰到的人，會把學過的東西忘掉。" },
    { who: "pet", text: "我是番薯仔！我們一起把光找回來吧！" },
    { who: "pet", text: "走到人旁邊按對話鍵，就能聊天喔。" },
    { who: "pet", text: "有些阿伯阿姨會說台語，下面有華語喔。" }
  ],
  D_FAINT: [
    { who: "pet", text: "我們累倒了……先回旅店休息一下吧。" },
    { who: "pet", text: "沒關係！金幣和道具都還在喔。" }
  ],
  D_INN_REST: [
    { who: "narrator", text: "好好休息了一下，體力和魔力都全滿了！" }
  ],
  D_CHEST_LOCKED: [
    { who: "pet", text: "寶箱上有數學鎖，答對才打得開！" }
  ],
  D_CHEST_DONE: [
    { who: "pet", text: "這個寶箱已經打開過了。" }
  ],
  D_LAMP_LIT: [
    { who: "narrator", text: "知識燈亮了起來！" }
  ],
  D_LIGHT_GET: [
    { who: "narrator", text: "你拿回了一道知識之光！" },
    { who: "pet", text: "快看任務日誌，下一步要去哪裡！" }
  ],
  D_STATION: [
    { who: "narrator", text: "這裡可以搭車。打開世界地圖，選要去哪裡吧！" }
  ],
  D_STATION_LOCKED: [
    { who: "pet", text: "那裡現在還去不了，先完成委託吧！" }
  ],

  // ═════════════ 金包里教學 ═════════════
  D_TUT_1A: [
    { who: "chief", text: "{name}，你來得正好！",
      taigi: { hanji: "你來甲拄仔好！", tailo: "Lí lâi kah tú-á-hó!", huayu: "你來得正好！" } },
    { who: "chief", text: "公園燈座上刻著字，霧讓我看不清楚。",
      taigi: { hanji: "燈座頂懸有刻字，霧予我看袂清楚。", tailo: "Ting-tsō tíng-kuân ū khik-jī, bū hōo guá khuànn bē tshing-tshó.", huayu: "燈座上面有刻字，霧讓我看不清楚。" } },
    { who: "chief", text: "你可以幫我讀一讀嗎？答對 2 題就好。",
      taigi: { hanji: "你會使共我讀看覓無？回答著兩題就好。", tailo: "Lí ē-sái kā guá tha̍k khuànn-māi--bô? Huê-tap tio̍h nn̄g tê tō hó.", huayu: "你可以幫我讀讀看嗎？答對兩題就好。" } },
    { who: "pet", text: "不會的話，按「提示」看課本哪裡有教！" }
  ],
  D_TUT_1B: [
    { who: "chief", text: "太好了！燈座上寫著「知識是光」。" },
    { who: "chief", text: "這是藥草，累了就吃一個。",
      taigi: { hanji: "這是藥草，忝矣就食一个。", tailo: "Tse sī io̍h-tsháu, thiám--ah tō tsia̍h tsi̍t ê.", huayu: "這是藥草，累了就吃一個。" } },
    { who: "chief", text: "漁港的漁夫阿伯好像也遇到麻煩了。",
      taigi: { hanji: "漁港的討海阿伯，敢若嘛拄著麻煩矣。", tailo: "Hî-káng ê thó-hái a-peh, kánn-ná mā tú-tio̍h mâ-huân--ah.", huayu: "漁港的漁夫阿伯，好像也遇到麻煩了。" } },
    { who: "pet", text: "漁港在金包里的東北邊，我們去看看！" }
  ],
  D_TUT_2A: [
    { who: "fisher", text: "唉，霧一來，我賣魚的錢都算不清了。",
      taigi: { hanji: "唉，霧一來，阮賣魚的錢攏算袂清矣。", tailo: "Haih, bū tsi̍t lâi, guán bē hî ê tsînn lóng sǹg bē tshing--ah.", huayu: "唉，霧一來，我賣魚的錢都算不清了。" } },
    { who: "fisher", text: "客人給的錢、要找的錢，全亂了。",
      taigi: { hanji: "人客予的錢、愛找的錢，攏亂操操矣。", tailo: "Lâng-kheh hōo ê tsînn, ài tsāu ê tsînn, lóng luān-tshau-tshau--ah.", huayu: "客人給的錢、要找的錢，全都亂糟糟了。" } },
    { who: "fisher", text: "幫阿伯算 3 題，好不好？",
      taigi: { hanji: "共阿伯算三題，好無？", tailo: "Kā a-peh sǹg sann tê, hó--bô?", huayu: "幫阿伯算三題，好不好？" } }
  ],
  D_TUT_2B: [
    { who: "fisher", text: "算得又快又對！謝謝喔！",
      taigi: { hanji: "算甲閣緊閣著！多謝喔！", tailo: "Sǹg kah koh kín koh tio̍h! To-siā--ooh!", huayu: "算得又快又對！謝謝喔！" } },
    { who: "fisher", text: "阿伯送你 50 枚金幣。",
      taigi: { hanji: "阿伯送你五十个金幣。", tailo: "A-peh sàng lí gōo-tsa̍p ê kim-pè.", huayu: "阿伯送你 50 枚金幣。" } },
    { who: "fisher", text: "老街的商店有賣木劍和皮衣。",
      taigi: { hanji: "老街的店頭有賣柴劍佮皮衫。", tailo: "Lāu-ke ê tiàm-thâu ū bē tshâ-kiàm kah phuê-sann.", huayu: "老街的商店有賣木劍和皮衣。" } },
    { who: "pet", text: "買東西前，先看看自己有幾枚金幣喔！" }
  ],
  D_TUT_3A: [
    { who: "innkeeper", text: "歡迎來泡溫泉喔！",
      taigi: { hanji: "歡迎來浸溫泉喔！", tailo: "Huan-gîng lâi tsìm un-tsuânn--ooh!", huayu: "歡迎來泡溫泉喔！" } },
    { who: "innkeeper", text: "旅館的窗戶被海風吹破一個洞。" },
    { who: "innkeeper", text: "南邊擎天草原的迷糊團子會掉黏黏球。" },
    { who: "innkeeper", text: "幫我帶 2 顆回來補窗戶，好嗎？",
      taigi: { hanji: "共我紮兩粒轉來補窗仔，好無？", tailo: "Kā guá tsah nn̄g lia̍p tńg-lâi póo thang-á, hó--bô?", huayu: "幫我帶兩顆回來補窗戶，好嗎？" } },
    { who: "innkeeper", text: "累了就回來泡溫泉，不用錢喔。",
      taigi: { hanji: "忝矣就轉來浸溫泉，免錢喔。", tailo: "Thiám--ah tō tńg-lâi tsìm un-tsuânn, bián-tsînn--ooh.", huayu: "累了就回來泡溫泉，不用錢喔。" } },
    { who: "pet", text: "碰到怪物就會開始戰鬥，答對就能攻擊！" },
    { who: "pet", text: "越快答對，打得越用力喔！" }
  ],
  D_TUT_3B: [
    { who: "innkeeper", text: "窗戶補好了，辛苦你了！",
      taigi: { hanji: "窗仔補好矣，勞力喔！", tailo: "Thang-á póo hó--ah, lóo-la̍t--ooh!", huayu: "窗戶補好了，謝謝你喔！" } },
    { who: "innkeeper", text: "送你一張刪去卡，可以刪掉一個錯的選項。" },
    { who: "innkeeper", text: "客運站可以搭車去遠方的神木森林。" },
    { who: "innkeeper", text: "往東走，還有熱鬧的山城市集。" },
    { who: "pet", text: "任務日誌會寫下一步要去哪裡喔！" }
  ],

  // ═════════════ 神木森林・精靈族 ═════════════
  D_ELF_LOCK: [
    { who: "elf_elder", text: "歡迎你，遠方的小冒險者。" },
    { who: "elf_elder", text: "先回金包里，幫溫泉旅館的忙吧。" }
  ],
  D_ELF_1A: [
    { who: "elf_elder", text: "歡迎來到神木森林。" },
    { who: "elf_elder", text: "霧來了以後，大家忘了怎麼照顧植物。" },
    { who: "elf_elder", text: "葉子黃了，風也亂吹，真讓人擔心。" },
    { who: "elf_elder", text: "請幫我想起植物和風的知識，好嗎？" }
  ],
  D_ELF_1B: [
    { who: "elf_elder", text: "對了！植物需要陽光、空氣和水。" },
    { who: "elf_elder", text: "南邊小路旁的葉葉，指北針好像壞了。" }
  ],
  D_ELF_2A: [
    { who: "elf_kid", text: "我的指北針一直亂轉，找不到北邊！" },
    { who: "elf_kid", text: "指北針裡面，有一根小磁針對不對？" },
    { who: "elf_kid", text: "還有，風車也不轉了……幫幫我！" }
  ],
  D_ELF_2B: [
    { who: "elf_kid", text: "指北針又指向北邊了！謝謝你！" },
    { who: "elf_kid", text: "長老說森林裡的毒菇怪變多了。" }
  ],
  D_ELF_3A: [
    { who: "elf_elder", text: "南邊密林的毒菇怪被霧弄迷糊了。" },
    { who: "elf_elder", text: "讓牠們清醒，帶回 3 個「毒菇帽」。" },
    { who: "elf_elder", text: "我要用它們找出霧從哪裡來。" }
  ],
  D_ELF_3B: [
    { who: "elf_elder", text: "找到了！霧是從北邊的千年神木飄出來的。" },
    { who: "elf_elder", text: "守護森林的神木，被霧附身了……" }
  ],
  D_ELF_4A: [
    { who: "elf_elder", text: "神木變成了「枯萎樹王」。" },
    { who: "elf_elder", text: "請到森林最北邊，讓神木清醒過來。" },
    { who: "pet", text: "頭目戰不能逃跑，先去樹屋休息吧！" }
  ],
  D_ELF_4B: [
    { who: "elf_elder", text: "神木醒了，綠葉又長出來了！" },
    { who: "narrator", text: "你拿回了「自然之光」！" },
    { who: "elf_elder", text: "紅樹林濕地的地精族也很煩惱。" },
    { who: "pet", text: "可以搭車去紅樹林濕地了！" }
  ],
  D_BOSS_TREE_A: [
    { who: "tree_king", text: "嗚……我……想不起來……葉子要什麼……" },
    { who: "pet", text: "樹王被霧弄迷糊了！答對題目叫醒它！" }
  ],
  D_BOSS_TREE_B: [
    { who: "tree_king", text: "啊……我想起來了。謝謝你。" }
  ],

  // ═════════════ 山城市集・外國商人 ═════════════
  D_MER_LOCK: [
    { who: "merchant", text: "Hello!（你好！）我在等勇敢的冒險者。" },
    { who: "merchant", text: "先回金包里，幫溫泉旅館的忙吧。" }
  ],
  D_MER_1A: [
    { who: "merchant", text: "Hello!（你好！）我從遠方來做生意。" },
    { who: "merchant", text: "霧讓大家聽不懂我說的話。" },
    { who: "merchant", text: "你可以幫我和客人打招呼嗎？" }
  ],
  D_MER_1B: [
    { who: "merchant", text: "Thank you!（謝謝你！）客人都聽懂了！" },
    { who: "merchant", text: "可是我還有別的煩惱……" }
  ],
  D_MER_2A: [
    { who: "merchant", text: "客人問我累不累、開不開心。" },
    { who: "merchant", text: "我也要數清楚有幾箱貨，幫幫我！" }
  ],
  D_MER_2B: [
    { who: "merchant", text: "Great!（太棒了！）你的英文真好！" },
    { who: "merchant", text: "可是海鷗把我的羽毛筆全搶走了。" }
  ],
  D_MER_3A: [
    { who: "merchant", text: "巷子裡的搶食海鷗被霧弄糊塗了。" },
    { who: "merchant", text: "讓牠們清醒，找回 3 根羽毛。" }
  ],
  D_MER_3B: [
    { who: "merchant", text: "有羽毛筆就能寫信了，謝謝！" },
    { who: "merchant", text: "可是金包里的漁港冒出了大觸手！" }
  ],
  D_MER_4A: [
    { who: "merchant", text: "迷霧章魚把漁船都擋住了。" },
    { who: "merchant", text: "牠只聽得懂英文，拜託你了！" },
    { who: "pet", text: "回金包里的漁港，沿著木橋走到底！" }
  ],
  D_MER_4B: [
    { who: "merchant", text: "漁船可以出海了！Thank you!（謝謝你！）" },
    { who: "narrator", text: "你拿回了「英語之光」！" },
    { who: "merchant", text: "金包里東北邊的海蝕洞窟裡，" },
    { who: "merchant", text: "住著哥布林，也需要你的幫忙。" }
  ],
  D_BOSS_OCTO_A: [
    { who: "fog_octopus", text: "你……是誰……？我好睏……" },
    { who: "pet", text: "牠聽得懂英文！答對英文題叫醒牠！" }
  ],
  D_BOSS_OCTO_B: [
    { who: "fog_octopus", text: "謝謝你！我要回大海了，再見！" },
    { who: "fisher", text: "章魚走了！漁船可以出海了！",
      taigi: { hanji: "石距走矣！漁船會使出海矣！", tailo: "Tsio̍h-kī tsáu--ah! Hî-tsûn ē-sái tshut-hái--ah!", huayu: "章魚走了！漁船可以出海了！" } }
  ],

  // ═════════════ 紅樹林濕地・地精族 ═════════════
  D_GNO_LOCK: [
    { who: "gnome_chief", text: "濕地的霧太濃，什麼都看不清楚。" },
    { who: "gnome_chief", text: "聽說精靈的「自然之光」能照亮霧。" },
    { who: "pet", text: "先去神木森林，幫精靈長老吧！" }
  ],
  D_GNO_1A: [
    { who: "gnome_chief", text: "自然之光照亮了濕地！你好厲害。" },
    { who: "gnome_chief", text: "我們要在紅樹林蓋新的木棧道。" },
    { who: "gnome_chief", text: "可是霧讓大家秤不準、量不準。" },
    { who: "gnome_chief", text: "你能幫我們算一算嗎？" }
  ],
  D_GNO_1B: [
    { who: "gnome_chief", text: "材料都準備好了，太感謝了！" },
    { who: "gnome_chief", text: "去找旁邊的工匠，木板還要分一分。" }
  ],
  D_GNO_2A: [
    { who: "gnome", text: "這塊木板要分成好幾段……" },
    { who: "gnome", text: "每段多長？要做幾個？頭好暈喔。" }
  ],
  D_GNO_2B: [
    { who: "gnome", text: "剛剛好！一點都沒有浪費。" },
    { who: "gnome", text: "可是做棧道的齒輪被泥泥怪吞走了。" }
  ],
  D_GNO_3A: [
    { who: "gnome_chief", text: "泥泥怪把齒輪當成點心吞下去了。" },
    { who: "gnome_chief", text: "讓牠們清醒，帶回 3 個齒輪。" }
  ],
  D_GNO_3B: [
    { who: "gnome_chief", text: "齒輪都回來了，棧道可以動工了！" },
    { who: "gnome_chief", text: "只是西南邊的泥灘，有隻好大的蛙……" }
  ],
  D_GNO_4A: [
    { who: "gnome_chief", text: "泥巴大蛙一直把泥巴丟到棧道上。" },
    { who: "gnome_chief", text: "牠在濕地西南邊的泥灘，拜託你！" }
  ],
  D_GNO_4B: [
    { who: "gnome_chief", text: "棧道蓋好了！你真是算數高手。" },
    { who: "narrator", text: "你拿回了「數學之光」！" }
  ],
  D_BOSS_FROG_A: [
    { who: "mud_frog", text: "呱！一、二、五、三……數不清了呱！" },
    { who: "pet", text: "牠的數字亂掉了，我們幫牠數對！" }
  ],
  D_BOSS_FROG_B: [
    { who: "mud_frog", text: "呱呱！我又會數數了，謝謝！" }
  ],

  // ═════════════ 哥布林部落 ═════════════
  D_GOB_LOCK: [
    { who: "goblin_chief", text: "外面來的？我們現在很忙。" },
    { who: "goblin_chief", text: "山城市集的外國商人，你幫過了嗎？" },
    { who: "pet", text: "先去山城市集，幫商人的忙吧！" }
  ],
  D_GOB_1A: [
    { who: "goblin_chief", text: "嘿，冒險者，你看得懂字嗎？" },
    { who: "goblin_chief", text: "霧來了以後，大家看不懂告示了。" },
    { who: "goblin_chief", text: "幾點吃飯、幾點睡覺，全亂了！" }
  ],
  D_GOB_1B: [
    { who: "goblin_chief", text: "原來告示寫的是作息時間！" },
    { who: "goblin_chief", text: "咕嚕想寫卡片，你去幫幫咕嚕吧。" }
  ],
  D_GOB_2A: [
    { who: "goblin_kid", text: "我想寫一張祝福卡給阿嬤。" },
    { who: "goblin_kid", text: "可是我忘了好聽的句子……" }
  ],
  D_GOB_2B: [
    { who: "goblin_kid", text: "卡片寫好了！阿嬤一定很開心。" },
    { who: "goblin_kid", text: "部落南邊的哥布林，把告示撕碎了。" }
  ],
  D_GOB_3A: [
    { who: "goblin_chief", text: "迷糊的哥布林把告示撕碎帶走了。" },
    { who: "goblin_chief", text: "讓哥布林們清醒，找回 3 張告示卷軸。" }
  ],
  D_GOB_3B: [
    { who: "goblin_chief", text: "告示拼回來了！上面寫著……" },
    { who: "goblin_chief", text: "「蝙蝠王在東邊的洞裡大吵大鬧」！" }
  ],
  D_GOB_4A: [
    { who: "goblin_chief", text: "噪音蝙蝠王吵得大家睡不著。" },
    { who: "goblin_chief", text: "牠在部落東邊的小洞裡，拜託你！" }
  ],
  D_GOB_4B: [
    { who: "goblin_chief", text: "終於安靜了！大家可以好好睡覺。" },
    { who: "narrator", text: "你拿回了「國語之光」！" },
    { who: "goblin_chief", text: "聽說月世界的獸人也在吵架。" }
  ],
  D_BOSS_BAT_A: [
    { who: "noise_bat", text: "吱吱吱！好吵好吵，字都亂跑了！" },
    { who: "pet", text: "一個字一個字讀，讓牠安靜下來！" }
  ],
  D_BOSS_BAT_B: [
    { who: "noise_bat", text: "吱……好安靜。我可以好好睡了。" }
  ],

  // ═════════════ 月世界泥岩丘・獸人族 ═════════════
  D_ORC_LOCK: [
    { who: "orc_chief", text: "大家在吵架，現在沒空聽你說。" },
    { who: "pet", text: "先拿回「數學之光」和「國語之光」吧！" },
    { who: "pet", text: "有了這兩道光，族長才聽得進去。" }
  ],
  D_ORC_1A: [
    { who: "orc_chief", text: "月世界的泥岩丘，草少，獵物也少。" },
    { who: "orc_chief", text: "霧來了以後，大家都在搶獵場。" },
    { who: "orc_chief", text: "你能幫我們想出公平的辦法嗎？" }
  ],
  D_ORC_1B: [
    { who: "orc_chief", text: "一起討論、一起遵守，真好！" },
    { who: "orc_chief", text: "大門外的獵人也需要幫忙。" }
  ],
  D_ORC_2A: [
    { who: "orc", text: "營地裡每天都吵吵鬧鬧的。" },
    { who: "orc", text: "要怎麼照顧自己、和家人好好相處？" }
  ],
  D_ORC_2B: [
    { who: "orc", text: "謝謝你！營地變得好和氣。" },
    { who: "orc", text: "可是柵欄的鑰匙被野豬叼走了。" }
  ],
  D_ORC_3A: [
    { who: "orc_chief", text: "泥岩溝裡的野豬叼走了柵欄鑰匙。" },
    { who: "orc_chief", text: "讓牠們清醒，找回 3 把鑰匙。" }
  ],
  D_ORC_3B: [
    { who: "orc_chief", text: "柵欄可以關好了，謝謝！" },
    { who: "orc_chief", text: "可是南邊的石像突然動起來了！" }
  ],
  D_ORC_4A: [
    { who: "orc_chief", text: "暴躁石像在南邊的泥岩溝裡亂撞。" },
    { who: "orc_chief", text: "它忘了大家一起訂的規則，拜託你！" }
  ],
  D_ORC_4B: [
    { who: "orc_chief", text: "石像安靜下來了，月世界又和平了。" },
    { who: "narrator", text: "你拿回了「社會之光」！" },
    { who: "pet", text: "五道光都到齊了嗎？搭車回金包里吧！" }
  ],
  D_BOSS_GOLEM_A: [
    { who: "angry_golem", text: "咚！咚！規則是什麼？我不記得！" },
    { who: "pet", text: "我們一起想想，大家要怎麼相處！" }
  ],
  D_BOSS_GOLEM_B: [
    { who: "angry_golem", text: "咚……我想起來了。要輪流，要分享。" }
  ],

  // ═════════════ 主線收尾 ═════════════
  D_LAMPS_A: [
    { who: "chief", text: "五道光都拿回來了！真厲害！",
      taigi: { hanji: "五葩燈的光攏提轉來矣！真讚！", tailo: "Gōo pha ting ê kng lóng the̍h tńg--lâi--ah! Tsin tsán!", huayu: "五盞燈的光都拿回來了！真棒！" } },
    { who: "chief", text: "每盞燈前答對一題，燈就會亮。",
      taigi: { hanji: "每葩燈頭前回答著一題，燈就會光。", tailo: "Muí pha ting thâu-tsîng huê-tap tio̍h tsi̍t tê, ting tō ē kng.", huayu: "每盞燈前答對一題，燈就會亮。" } }
  ],
  D_LAMPS_B: [
    { who: "narrator", text: "五盞知識燈一起亮了起來！" },
    { who: "chief", text: "可是霧還沒散……霧魔在古城塔頂。" },
    { who: "chief", text: "搭客運到府城古城，去找城主吧。",
      taigi: { hanji: "坐客運去府城，去揣城主。", tailo: "Tsē kheh-ūn khì Hú-siânn, khì tshuē siânn-tsú.", huayu: "搭客運去府城，去找城主。" } },
    { who: "pet", text: "我們一起把霧趕走！" }
  ],
  D_FINAL_LOCK: [
    { who: "king", text: "歡迎來到府城古城，小冒險者。" },
    { who: "king", text: "先點亮金包里的五盞燈，再來找我。" }
  ],
  D_FINAL_A: [
    { who: "king", text: "你就是點亮五盞燈的冒險者嗎？" },
    { who: "king", text: "霧魔在古城塔頂，樓梯在城主府後面。" },
    { who: "king", text: "它會用五科的題目考你，要小心。" },
    { who: "pet", text: "不怕！學過的東西都在心裡！" }
  ],
  D_FINAL_B: [
    { who: "king", text: "霧散了！大家都想起來了！" },
    { who: "king", text: "謝謝你，{name}。你是美麗島的勇者。" }
  ],
  D_BOSS_FOG_A: [
    { who: "fog_demon", text: "呼呼……把學過的，全部忘掉吧……" },
    { who: "pet", text: "才不會忘！五道光，一起亮起來！" }
  ],
  D_BOSS_FOG_B: [
    { who: "fog_demon", text: "好亮……原來，知識是忘不掉的……" }
  ],
  D_ENDING: [
    { who: "narrator", text: "遺忘霧散了，天空變得好藍。" },
    { who: "narrator", text: "金包里的漁港點起燈火，大家一起慶祝。" },
    { who: "chief", text: "謝謝你！金包里又亮起來了！",
      taigi: { hanji: "多謝你！金包里閣光起來矣！", tailo: "To-siā--lí! Kim-pau-lí koh kng khí-lâi--ah!", huayu: "謝謝你！金包里又亮起來了！" } },
    { who: "pet", text: "{name}，下次冒險還要一起去喔！" }
  ],

  // ═════════════ 村民委託 ═════════════
  D_BOOK_A: [
    { who: "bookstore", text: "圖書館的書全被霧弄亂了。" },
    { who: "bookstore", text: "幫我想一想，書要怎麼排才好找？" },
    { who: "bookstore", text: "答對 3 題，我就送你一張引導卡。" }
  ],
  D_BOOK_B: [
    { who: "bookstore", text: "書架整整齊齊的，謝謝你！",
      taigi: { hanji: "冊架仔整整齊齊，多謝你！", tailo: "Tsheh-kè-á tsíng-tsíng-tsê-tsê, to-siā--lí!", huayu: "書架整整齊齊的，謝謝你！" } },
    { who: "bookstore", text: "讀過的東西，會一直陪著你。" }
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
    { who: "hiker", text: "霧讓我忘了風和溶解的道理……" },
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
    { who: "taro_seller", text: "一碗放幾顆呢？霧讓我算不出來。" }
  ],
  D_TARO_B: [
    { who: "taro_seller", text: "剛好分完！你真聰明。",
      taigi: { hanji: "拄好分了！你真巧。", tailo: "Tú-hó pun liáu! Lí tsin khiáu.", huayu: "剛好分完！你真聰明。" } }
  ],
  D_LIB_A: [
    { who: "librarian", text: "古城圖書館的英文書被霧弄亂了。" },
    { who: "librarian", text: "幫我讀讀看，書上寫了什麼？" }
  ],
  D_LIB_B: [
    { who: "librarian", text: "謝謝你！書都回到書架上了。" }
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
      taigi: { hanji: "老街的點心真好食喔！", tailo: "Lāu-ke ê tiám-sim tsin hó-tsia̍h--ooh!", huayu: "老街的小吃很好吃喔！" } }
  ],
  D_INN_IDLE: [
    { who: "innkeeper", text: "歡迎！泡一下溫泉，就有精神了。",
      taigi: { hanji: "歡迎！浸一下溫泉，就有元氣矣。", tailo: "Huan-gîng! Tsìm tsi̍t-ē un-tsuânn, tō ū guân-khì--ah.", huayu: "歡迎！泡一下溫泉，就有精神了。" } }
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
  D_KING_IDLE:        [{ who: "king", text: "府城古城就拜託你了，冒險者。" }],
  D_GUILD_IDLE:       [{ who: "guild", text: "到 5 級，就能來這裡選職業喔。" }],
  D_GUILD_JOB: [
    { who: "guild", text: "你已經 5 級了！想當哪一種冒險者？" },
    { who: "guild", text: "之後還能免費換職業，放心選吧。" },
    { who: "pet", text: "不管選哪個，五科都要加油喔！" }
  ],
  D_LIBRARIAN_IDLE:   [{ who: "librarian", text: "圖書館要安靜，說話要小聲喔。" }]
};
