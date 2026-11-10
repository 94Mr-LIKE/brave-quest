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
  // v4.1 中橫・南投：名稱與說話者沿用劇本草稿；羅盤由霧仔講。
  road_engineer_cc: "管制站工程員",
  lodge_keeper_hh: "山莊管理員",
  wuling_guide: "武嶺解說員",
  veg_farmer: "高冷蔬菜農",
  road_veteran: "老工班阿伯",
  center_volunteer: "觀景台志工",
  paper_master: "紙寮師傅",
  jiaobai_farmer: "茭白筍農",
  inn_puli: "鎮上旅店老闆",
  forest_guide_xt: "森林解說員",
  lantern_shop: "燈籠店老闆",
  ghb_civetboss: "夜遊團長",
  tea_farmer_lg: "鹿谷茶農",
  inn_xitou: "燈籠町旅店老闆",
  dawn_ring_pu: "曙光碎片",
  // v4.0 東部（71 號 4.9；人類台語角色全部男性；蘭嶼解說員、蘭嶼民宿老闆講華語；頭目霧氣球大王、雲鯨霧將）
  ruins_guide: "遺址公園解說員", balloon_captain: "熱氣球隊長", fob_balloon: "霧氣球大王", custard_farmer: "釋迦農", ticket_seller_fg: "富岡漁港售票員", inn_taitung: "縱谷民宿老闆", lighthouse_guide_gi: "燈塔解說員", onsen_keeper_gi: "溫泉管理員", oldhouse_gi: "古厝阿伯", ice_shop_gi: "冰店老闆", inn_greenisland: "綠島民宿老闆", tao_guide: "蘭嶼文化解說員", inn_lanyu: "蘭嶼民宿老闆", station_hl: "車站服務員", taroko_ranger: "國家公園解說員", fisher_hl: "海邊的漁夫", wxb_whale: "雲鯨霧將", road_engineer: "公路工程員", stone_carver: "石雕師傅", mochi_shop: "麻糬店老闆", inn_hualien: "海岸旅店老闆",
  // v3.0 南部（70 號；人類 NPC 全部男性、講台語（佛光山志工也講台語）；霧仔講華語；墾丁的國家公園解說員 id 是 park_ranger_kt）
  forest_rail: "林鐵站務阿伯", harbor_clerk: "港口書記", fort_guide: "古堡解說員", oldhouse_grandpa: "老屋阿伯", wetland_ranger: "溼地保育員", volunteer_lem: "鹿耳門聖母廟志工阿伯", rail_fan: "鐵道迷阿伯", pineapple_farmer: "鳳梨農", lychee_farmer: "荔枝農", volunteer_fgs: "佛光山寺院志工", turtle_volunteer: "海龜保育志工", island_guide: "島上解說員", ticket_seller: "東港碼頭售票員", park_ranger_kt: "國家公園解說員", lighthouse_keeper: "燈塔守護員", oldcity_guide: "古城解說員", fog_kid: "霧仔", inn_anping: "港邊客棧老闆", inn_taijiang: "溼地民宿老闆", inn_dashu: "鳳梨田民宿老闆", inn_liuqiu: "島上民宿老闆", inn_kenting: "墾丁旅店老闆", pib_ship: "霧帆號", pib_anchor: "錨錨大副",
  // v2.0 中部（69 號；劇本語音組草稿 wip_v20_draft/dialogs_central.js；燈籠霧將 id 改 mb_lantern；石虎寶寶是不說話的友善 NPC）
  old_stationmaster: "老站長", conservation_guide: "保育志工", wood_carver: "木雕師傅", berry_farmer: "草莓農", inn_sanyi: "山城民宿老闆", rush_weaver: "藺草工坊阿伯", volunteer_zl: "鎮瀾宮志工阿伯", pastry_shop: "大甲糕餅店老闆", inn_dajia: "小鎮旅店老闆", lk_guide: "老街導覽員", umbrella_shop: "傘店老闆", volunteer_lk: "天后宮志工阿伯", pastry_lk: "鹿港糕餅店老闆", inn_lukang: "老街客棧老闆", temple_elder: "廟口阿伯", float_master: "藝閣師傅", grocer_bg: "雜貨店老闆", volunteer_ct: "朝天宮志工阿伯", volunteer_wd: "武德宮志工阿伯", oil_shop: "麻油行老闆", inn_beigang: "鎮上旅店老闆", mb_train: "迷路火車頭", mb_lantern: "燈籠霧將", leopardcat_cub: "石虎寶寶",
  // v1.4 桃竹章（63 號；劇本語音組草稿 wip_v14_draft/dialogs_taoyuan.js）
  reservoir_keeper: "水庫管理員", tofu_shop: "豆干店老闆", wood_artisan: "木藝職人", inn_daxi: "老街旅店老闆", noodle_master: "米粉師傅", hc_guide: "文史解說員", inn_hsinchu: "新竹旅店老闆", mb_floodgate: "霧閘機將",
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
  angry_golem: "暴躁石像", fog_demon: "遺忘霧魔", mnb_goldjaw: "金脈鐵顎王",
  // ═══ v4.2 第 4a 批 SPEAKERS BEGIN（tools/v42_apply.js 每次整段重建）═══
  paiyun_volunteer: "登山服務中心志工",
  ysnp_ranger: "國家公園解說員",
  bird_guide: "鳥類解說員",
  inn_tataka: "山屋管理員",
  trail_ranger: "步道巡山員",
  lodge_manager_py: "排雲山莊管理員",
  fo_echo: "喂喂回音霧",
  fob_mist: "山嵐霧精",
  fob_king: "遺忘霧王‧佛格",
  // ═══ v4.2 第 4a 批 SPEAKERS END ═══
  // ═══ v4.2 第 4c 批 SPEAKERS BEGIN（tools/v42_apply.js 每次整段重建）═══
  tao_fisher: "蘭嶼的漁夫",
  tao_taro: "種芋頭的阿姨",
  tao_elder: "部落的長者",
  tao_owner: "地下屋的屋主",
  tao_boatman: "船屋的船主",
  tao_kid: "蘭嶼的孩子",
  cloud_shop_m42: "雲上小舖老闆",
  cloud_shop_m43: "雲上小舖老闆",
  cloud_shop_m44: "雲上小舖老闆",
  // ═══ v4.2 第 4c 批 SPEAKERS END ═══
};

window.DIALOGS = {
  // v4.1 中橫・南投：草稿台詞套用定案補文，句序從 0 起算。
  D_CH_1A: [
    {"who":"road_engineer_cc","emotion":"開心","text":"歡迎來到山上的公路！這裡冬天會下雪。","taigi":{"hanji":"歡迎來山頂的公路！遮寒天會落雪。","tailo":"Huan-gîng lâi suann-tíng ê kong-lōo! Tsia kuânn-thinn ē lo̍h-seh.","huayu":"歡迎來到山上的公路！這裡冬天會下雪。"}},
    {"who":"pet","emotion":"開心","text":"這裡是合歡山，大家叫它「雪鄉」！"},
    {"who":"road_engineer_cc","emotion":"平靜","text":"路面結冰的時候，車子要照公告加雪鏈。","taigi":{"hanji":"路面結冰的時，車愛照公告加鍊仔。","tailo":"Lōo-bīn kiat-ping ê sî, tshia ài tsiàu kong-kò ka liān-á.","huayu":"路面結冰的時候，車子要照公告加雪鏈。"}},
    {"who":"road_engineer_cc","emotion":"平靜","text":"上山要穿暖，出門前先看路況和天氣。","taigi":{"hanji":"上山愛穿予燒，出門先看路況佮天氣。","tailo":"Tsiūnn-suann ài tshīng hōo sio, tshut-mn̂g sing khuànn lōo-hóng kah thinn-khì.","huayu":"上山要穿暖，出門前先看路況和天氣。"}},
    {"who":"road_engineer_cc","emotion":"擔心","text":"霧讓我忘了天氣的事，幫我想 2 題好嗎？","taigi":{"hanji":"霧予我袂記得天氣的代誌，共我想兩題，好無？","tailo":"Bū hōo guá bē-kì-tit thinn-khì ê tāi-tsì, kā guá siūnn nn̄g tê, hó--bô?","huayu":"霧讓我忘了天氣的事，幫我想 2 題好嗎？"}}
  ],
  D_CH_1B: [
    {"who":"road_engineer_cc","emotion":"開心","text":"你都答對了，聽得真認真！","taigi":{"hanji":"你攏回答著矣，聽甲真認真！","tailo":"Lí lóng huê-tap tio̍h--ah, thiann kah tsin jīn-tsin!","huayu":"你都答對了，聽得真認真！"}},
    {"who":"road_engineer_cc","emotion":"開心","text":"這些金幣送你，謝謝你！","taigi":{"hanji":"這寡金幣送你，多謝你！","tailo":"Tsit-kuá kim-pè sàng lí, to-siā--lí!","huayu":"這些金幣送你，謝謝你！"}},
    {"who":"pet","emotion":"平靜","text":"山莊的管理員，好像需要幫忙！"}
  ],
  D_ENGINEER_CC_IDLE: [
    {"who":"road_engineer_cc","emotion":"平靜","text":"上山要穿暖，出門前先看路況和天氣。","taigi":{"hanji":"上山愛穿予燒，出門先看路況佮天氣。","tailo":"Tsiūnn-suann ài tshīng hōo sio, tshut-mn̂g sing khuànn lōo-hóng kah thinn-khì.","huayu":"上山要穿暖，出門前先看路況和天氣。"}}
  ],
  D_CH_5A: [
    {"who":"lodge_keeper_hh","emotion":"擔心","text":"雪地上有幾顆雪球怪物，一直打轉。","taigi":{"hanji":"雪頂有幾粒雪球的怪物，一直踅。","tailo":"Seh tíng ū kuí lia̍p seh-kiû ê kuài-bu̍t, it-ti̍t se̍h.","huayu":"雪地上有幾顆雪球怪物，一直打轉。"}},
    {"who":"lodge_keeper_hh","emotion":"平靜","text":"讓怪物清醒，把 3 片雪花結晶找回來。","taigi":{"hanji":"予怪物清醒，共三片雪花揣轉來。","tailo":"Hōo kuài-bu̍t tshing-tshínn, kā sann phìnn seh-hue tshuē tńg--lâi.","huayu":"讓怪物清醒，把 3 片雪花結晶找回來。"}}
  ],
  D_CH_5B: [
    {"who":"lodge_keeper_hh","emotion":"開心","text":"雪花找回來了，謝謝你！","taigi":{"hanji":"雪花揣轉來矣，多謝你！","tailo":"Seh-hue tshuē tńg--lâi--ah, to-siā--lí!","huayu":"雪花找回來了，謝謝你！"}},
    {"who":"lodge_keeper_hh","emotion":"開心","text":"這些金幣和藥草送你。","taigi":{"hanji":"這寡金幣佮藥草送你。","tailo":"Tsit-kuá kim-pè kah io̍h-tsháu sàng lí.","huayu":"這些金幣和藥草送你。"}},
    {"who":"pet","emotion":"開心","text":"再往上爬，就到武嶺了！"}
  ],
  D_SNOWBALL_AFTER: [
    {"who":"narrator","emotion":"平靜","text":"山上下雪要穿暖，車子要照公告加雪鏈。"}
  ],
  D_CH_4A: [
    {"who":"wuling_guide","emotion":"開心","text":"這裡海拔 3,275 公尺！","taigi":{"hanji":"遮海拔三千兩百七十五公尺！","tailo":"Tsia hái-pua̍t sann-tshing nn̄g-pah tshit-tsa̍p-gōo kong-tshioh!","huayu":"這裡海拔 3,275 公尺！"}},
    {"who":"wuling_guide","emotion":"平靜","text":"這是開車能到的最高的地方。","taigi":{"hanji":"這是駛車會到的上懸的所在。","tailo":"Tse sī sái-tshia ē kàu ê siōng kuân ê sóo-tsāi.","huayu":"這是開車能到的最高的地方。"}},
    {"who":"pet","emotion":"驚訝","text":"這裡是武嶺，在合歡山主峰和東峰的中間！"},
    {"who":"wuling_guide","emotion":"平靜","text":"幫我算 2 題好嗎？","taigi":{"hanji":"共我算兩題，好無？","tailo":"Kā guá sǹg nn̄g tê, hó--bô?","huayu":"幫我算 2 題好嗎？"}}
  ],
  D_CH_4B: [
    {"who":"wuling_guide","emotion":"開心","text":"你都答對了，聽得真認真！","taigi":{"hanji":"你攏回答著矣，聽甲真認真！","tailo":"Lí lóng huê-tap tio̍h--ah, thiann kah tsin jīn-tsin!","huayu":"你都答對了，聽得真認真！"}},
    {"who":"wuling_guide","emotion":"開心","text":"這些金幣送你，謝謝你！","taigi":{"hanji":"這寡金幣送你，多謝你！","tailo":"Tsit-kuá kim-pè sàng lí, to-siā--lí!","huayu":"這些金幣送你，謝謝你！"}},
    {"who":"wuling_guide","emotion":"平靜","text":"下山往埔里，那裡是臺灣的地理中心。","taigi":{"hanji":"落山往埔里，遐是臺灣的地理中心。","tailo":"Lo̍h-suann óng Poo-lí, hia sī Tâi-uân ê tē-lí tiong-sim.","huayu":"下山往埔里，那裡是臺灣的地理中心。"}}
  ],
  D_WULING_IDLE: [
    {"who":"wuling_guide","emotion":"平靜","text":"東邊有看風景的地方，風很大，要站好喔。","taigi":{"hanji":"東爿有看風景的所在，風真透，愛徛予好。","tailo":"Tang-pîng ū khuànn hong-kíng ê sóo-tsāi, hong tsin thàu, ài khiā hōo hó.","huayu":"東邊有看風景的地方，風很大，要站好喔。"}}
  ],
  D_CH_2A: [
    {"who":"veg_farmer","emotion":"開心","text":"高麗菜喜歡涼涼的天氣，才長得好。","taigi":{"hanji":"高麗菜愛冷冷的天氣，才會大。","tailo":"Ko-lê-tshài ài líng-líng ê thinn-khì, tsiah ē tuā.","huayu":"高麗菜喜歡涼涼的天氣，才長得好。"}},
    {"who":"veg_farmer","emotion":"平靜","text":"一千到兩千公尺高的山上，最適合種。","taigi":{"hanji":"一千到兩千公尺懸的山頂，上適合種。","tailo":"Tsi̍t-tshing kàu nn̄g-tshing kong-tshioh kuân ê suann-tíng, siōng sik-ha̍p tsìng.","huayu":"一千到兩千公尺高的山上，最適合種。"}},
    {"who":"veg_farmer","emotion":"擔心","text":"霧讓我忘了種菜的事，幫我想 2 題好嗎？","taigi":{"hanji":"霧予我袂記得種菜的代誌，共我想兩題，好無？","tailo":"Bū hōo guá bē-kì-tit tsìng tshài ê tāi-tsì, kā guá siūnn nn̄g tê, hó--bô?","huayu":"霧讓我忘了種菜的事，幫我想 2 題好嗎？"}}
  ],
  D_CH_2B: [
    {"who":"veg_farmer","emotion":"開心","text":"你都答對了，聽得真認真！","taigi":{"hanji":"你攏回答著矣，聽甲真認真！","tailo":"Lí lóng huê-tap tio̍h--ah, thiann kah tsin jīn-tsin!","huayu":"你都答對了，聽得真認真！"}},
    {"who":"veg_farmer","emotion":"開心","text":"這些金幣送你，謝謝你！","taigi":{"hanji":"這寡金幣送你，多謝你！","tailo":"Tsit-kuá kim-pè sàng lí, to-siā--lí!","huayu":"這些金幣送你，謝謝你！"}}
  ],
  D_CH_3A: [
    {"who":"road_veteran","emotion":"平靜","text":"這條公路，是以前的人一點一點開出來的。","taigi":{"hanji":"這條公路，是較早的人一點仔一點仔開出來的。","tailo":"Tsit tiâu kong-lōo, sī khah-tsá ê lâng tsi̍t-tiám-á tsi̍t-tiám-á khui--tshut-lâi--ê.","huayu":"這條公路，是以前的人一點一點開出來的。"}},
    {"who":"pet","emotion":"平靜","text":"中橫公路 1956 年開工，1960 年通車喔！"},
    {"who":"road_veteran","emotion":"平靜","text":"它把東邊和西邊連起來了。","taigi":{"hanji":"伊共東爿佮西爿連起來矣。","tailo":"I kā tang-pîng kah sai-pîng liân--khí-lâi--ah.","huayu":"它把東邊和西邊連起來了。"}},
    {"who":"road_veteran","emotion":"擔心","text":"霧讓我忘了開路的故事，幫我想 2 題好嗎？","taigi":{"hanji":"霧予我袂記得開路的故事，共我想兩題，好無？","tailo":"Bū hōo guá bē-kì-tit khui-lōo ê kòo-sū, kā guá siūnn nn̄g tê, hó--bô?","huayu":"霧讓我忘了開路的故事，幫我想 2 題好嗎？"}}
  ],
  D_CH_3B: [
    {"who":"road_veteran","emotion":"開心","text":"你都答對了，聽得真認真！","taigi":{"hanji":"你攏回答著矣，聽甲真認真！","tailo":"Lí lóng huê-tap tio̍h--ah, thiann kah tsin jīn-tsin!","huayu":"你都答對了，聽得真認真！"}},
    {"who":"road_veteran","emotion":"開心","text":"這些金幣送你，謝謝你！","taigi":{"hanji":"這寡金幣送你，多謝你！","tailo":"Tsit-kuá kim-pè sàng lí, to-siā--lí!","huayu":"這些金幣送你，謝謝你！"}}
  ],
  D_INN_HEHUAN: [
    {"who":"lodge_keeper_hh","emotion":"開心","text":"歡迎來高山山莊！晚上很冷，要蓋暖一點。","taigi":{"hanji":"歡迎來山頂的山莊！暗時真寒，愛蓋予燒。","tailo":"Huan-gîng lâi suann-tíng ê san-tsong! Àm-sî tsin kuânn, ài kah hōo sio.","huayu":"歡迎來高山山莊！晚上很冷，要蓋暖一點。"}}
  ],
  D_INN_HEHUAN_NOCOIN: [
    {"who":"lodge_keeper_hh","emotion":"擔心","text":"金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。","taigi":{"hanji":"金幣無夠喔，金包里溫泉旅館會使免錢蹛，嘛會使去拍怪物趁金幣。","tailo":"Kim-pè bô-kàu--ooh, Kim-pau-lí un-tsuânn lí-kuán ē-sái bián-tsînn tuà, mā ē-sái khì phah kuài-bu̍t thàn kim-pè.","huayu":"金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。"}}
  ],
  D_PUL_2A: [
    {"who":"center_volunteer","emotion":"開心","text":"歡迎來埔里！你看，這是地理中心的碑。","taigi":{"hanji":"歡迎來埔里！你看，這是地理中心的碑。","tailo":"Huan-gîng lâi Poo-lí! Lí khuànn, tse sī tē-lí tiong-sim ê pi.","huayu":"歡迎來埔里！你看，這是地理中心的碑。"}},
    {"who":"pet","emotion":"驚訝","text":"它的樣子像一朵半開的百合花！"},
    {"who":"center_volunteer","emotion":"平靜","text":"碑後面的石階，走四百多階就到山頂。","taigi":{"hanji":"碑後壁的石階，行四百外階就到山頂。","tailo":"Pi āu-piah ê tsio̍h-kai, kiânn sì-pah guā kai tō kàu suann-tíng.","huayu":"碑後面的石階，走四百多階就到山頂。"}},
    {"who":"center_volunteer","emotion":"平靜","text":"山頂有全臺最大的三角點。","taigi":{"hanji":"山頂有全臺灣上大的三角點。","tailo":"Suann-tíng ū tsuân Tâi-uân siōng tuā ê sann-kak-tiám.","huayu":"山頂有全臺最大的三角點。"}},
    {"who":"center_volunteer","emotion":"擔心","text":"霧讓我忘了這裡的故事，幫我想 2 題好嗎？","taigi":{"hanji":"霧予我袂記得遮的故事，共我想兩題，好無？","tailo":"Bū hōo guá bē-kì-tit tsia ê kòo-sū, kā guá siūnn nn̄g tê, hó--bô?","huayu":"霧讓我忘了這裡的故事，幫我想 2 題好嗎？"}}
  ],
  D_PUL_2B: [
    {"who":"center_volunteer","emotion":"開心","text":"你都答對了，聽得真認真！","taigi":{"hanji":"你攏回答著矣，聽甲真認真！","tailo":"Lí lóng huê-tap tio̍h--ah, thiann kah tsin jīn-tsin!","huayu":"你都答對了，聽得真認真！"}},
    {"who":"center_volunteer","emotion":"開心","text":"這些金幣送你，謝謝你！","taigi":{"hanji":"這寡金幣送你，多謝你！","tailo":"Tsit-kuá kim-pè sàng lí, to-siā--lí!","huayu":"這些金幣送你，謝謝你！"}},
    {"who":"fog_kid","emotion":"驚訝","text":"四片碎片在發光……我們爬上山頂看看！"}
  ],
  D_CENTER_IDLE: [
    {"who":"center_volunteer","emotion":"平靜","text":"從山頂看得到整個埔里。","taigi":{"hanji":"對山頂看會著規个埔里。","tailo":"Tuì suann-tíng khuànn ē tio̍h kui-ê Poo-lí.","huayu":"從山頂看得到整個埔里。"}}
  ],
  D_V1_COMPASS: [
    {"who":"narrator","emotion":"神祕","text":"四片曙光碎片從手帳飛出來，繞成一圈。"}
  ],
  D_PUL_1A: [
    {"who":"fog_kid","emotion":"驚訝","text":"到山頂了！四片碎片繞成一圈了……"},
    {"who":"fog_kid","emotion":"平靜","text":"五科各答對 1 題，把碎片合在一起吧！"}
  ],
  D_PUL_1B: [
    {"who":"fog_kid","emotion":"開心","text":"做出曙光羅盤了！針指向南邊的玉山！"},
    {"who":"pet","emotion":"開心","text":"往南經過溪頭，去玉山吧！"}
  ],
  D_PUL_3A: [
    {"who":"paper_master","emotion":"平靜","text":"這裡是手工造紙的地方，現在很少了。","taigi":{"hanji":"遮是手工做紙的所在，這馬真少矣。","tailo":"Tsia sī tshiú-kang tsò tsuá ê sóo-tsāi, tsit-má tsin tsió--ah.","huayu":"這裡是手工造紙的地方，現在很少了。"}},
    {"who":"paper_master","emotion":"平靜","text":"我們還用傳統的方法做紙。","taigi":{"hanji":"阮猶閣用傳統的方法做紙。","tailo":"Guán iáu-koh īng thuân-thóng ê hong-huat tsò tsuá.","huayu":"我們還用傳統的方法做紙。"}},
    {"who":"paper_master","emotion":"擔心","text":"霧讓我忘了做紙的工作，幫我想 2 題好嗎？","taigi":{"hanji":"霧予我袂記得做紙的工課，共我想兩題，好無？","tailo":"Bū hōo guá bē-kì-tit tsò tsuá ê khang-khuè, kā guá siūnn nn̄g tê, hó--bô?","huayu":"霧讓我忘了做紙的工作，幫我想 2 題好嗎？"}}
  ],
  D_PUL_3B: [
    {"who":"paper_master","emotion":"開心","text":"你都答對了，聽得真認真！","taigi":{"hanji":"你攏回答著矣，聽甲真認真！","tailo":"Lí lóng huê-tap tio̍h--ah, thiann kah tsin jīn-tsin!","huayu":"你都答對了，聽得真認真！"}},
    {"who":"paper_master","emotion":"開心","text":"這些金幣送你，謝謝你！","taigi":{"hanji":"這寡金幣送你，多謝你！","tailo":"Tsit-kuá kim-pè sàng lí, to-siā--lí!","huayu":"這些金幣送你，謝謝你！"}}
  ],
  D_PUL_4A: [
    {"who":"jiaobai_farmer","emotion":"開心","text":"茭白筍白白的，大家叫它「美人腿」。","taigi":{"hanji":"茭白筍白鑠鑠，逐家叫伊「美人腿」。","tailo":"Kha-pe̍h-sún pe̍h-siak-siak, ta̍k-ke kiò i “bí-jîn-thuí”.","huayu":"茭白筍白白的，大家叫它「美人腿」。"}},
    {"who":"jiaobai_farmer","emotion":"平靜","text":"這是埔里的名產喔！","taigi":{"hanji":"這是埔里的名產喔！","tailo":"Tse sī Poo-lí ê bîng-sán--ooh!","huayu":"這是埔里的名產喔！"}},
    {"who":"jiaobai_farmer","emotion":"擔心","text":"霧讓我忘了種茭白筍的事，幫我想 2 題好嗎？","taigi":{"hanji":"霧予我袂記得種茭白筍的代誌，共我想兩題，好無？","tailo":"Bū hōo guá bē-kì-tit tsìng kha-pe̍h-sún ê tāi-tsì, kā guá siūnn nn̄g tê, hó--bô?","huayu":"霧讓我忘了種茭白筍的事，幫我想 2 題好嗎？"}}
  ],
  D_PUL_4B: [
    {"who":"jiaobai_farmer","emotion":"開心","text":"你都答對了，聽得真認真！","taigi":{"hanji":"你攏回答著矣，聽甲真認真！","tailo":"Lí lóng huê-tap tio̍h--ah, thiann kah tsin jīn-tsin!","huayu":"你都答對了，聽得真認真！"}},
    {"who":"jiaobai_farmer","emotion":"開心","text":"這些金幣送你，謝謝你！","taigi":{"hanji":"這寡金幣送你，多謝你！","tailo":"Tsit-kuá kim-pè sàng lí, to-siā--lí!","huayu":"這些金幣送你，謝謝你！"}}
  ],
  D_INN_PULI: [
    {"who":"inn_puli","emotion":"開心","text":"歡迎來埔里的旅店！好好休息喔。","taigi":{"hanji":"歡迎來埔里的旅社！好好仔歇睏喔。","tailo":"Huan-gîng lâi Poo-lí ê lí-siā! Hó-hó-á hioh-khùn--ooh.","huayu":"歡迎來埔里的旅店！好好休息喔。"}}
  ],
  D_INN_PULI_NOCOIN: [
    {"who":"inn_puli","emotion":"擔心","text":"金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。","taigi":{"hanji":"金幣無夠喔，金包里溫泉旅館會使免錢蹛，嘛會使去拍怪物趁金幣。","tailo":"Kim-pè bô-kàu--ooh, Kim-pau-lí un-tsuânn lí-kuán ē-sái bián-tsînn tuà, mā ē-sái khì phah kuài-bu̍t thàn kim-pè.","huayu":"金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。"}}
  ],
  D_XT_1A: [
    {"who":"forest_guide_xt","emotion":"開心","text":"歡迎來溪頭！這裡有一片樹林，已經五十多年了。","taigi":{"hanji":"歡迎來溪頭！遮有一片樹林，已經五十外年矣。","tailo":"Huan-gîng lâi Khe-thâu! Tsia ū tsi̍t phìnn tshiū-nâ, í-king gōo-tsa̍p guā nî--ah.","huayu":"歡迎來溪頭！這裡有一片樹林，已經五十多年了。"}},
    {"who":"pet","emotion":"平靜","text":"溪頭是臺灣大學的實驗林喔！"},
    {"who":"forest_guide_xt","emotion":"平靜","text":"大學池上有一座竹子搭的拱橋。","taigi":{"hanji":"大學池頂有一座竹仔搭的橋。","tailo":"Tāi-ha̍k-tî tíng ū tsi̍t tsō tik-á tah ê kiô.","huayu":"大學池上有一座竹子搭的拱橋。"}},
    {"who":"forest_guide_xt","emotion":"平靜","text":"有時候池面會飄著薄薄的霧。","taigi":{"hanji":"有時陣池面會飄薄薄的霧。","tailo":"Ū-sî-tsūn tî-bīn ē phiau po̍h-po̍h ê bū.","huayu":"有時候池面會飄著薄薄的霧。"}},
    {"who":"forest_guide_xt","emotion":"擔心","text":"霧讓我忘了樹林的故事，幫我想 2 題好嗎？","taigi":{"hanji":"霧予我袂記得樹林的故事，共我想兩題，好無？","tailo":"Bū hōo guá bē-kì-tit tshiū-nâ ê kòo-sū, kā guá siūnn nn̄g tê, hó--bô?","huayu":"霧讓我忘了樹林的故事，幫我想 2 題好嗎？"}}
  ],
  D_XT_1B: [
    {"who":"forest_guide_xt","emotion":"開心","text":"你都答對了，聽得真認真！","taigi":{"hanji":"你攏回答著矣，聽甲真認真！","tailo":"Lí lóng huê-tap tio̍h--ah, thiann kah tsin jīn-tsin!","huayu":"你都答對了，聽得真認真！"}},
    {"who":"forest_guide_xt","emotion":"開心","text":"這些金幣送你，謝謝你！","taigi":{"hanji":"這寡金幣送你，多謝你！","tailo":"Tsit-kuá kim-pè sàng lí, to-siā--lí!","huayu":"這些金幣送你，謝謝你！"}},
    {"who":"pet","emotion":"平靜","text":"燈籠町的燈籠店老闆，好像需要幫忙！"}
  ],
  D_FORESTXT_IDLE: [
    {"who":"forest_guide_xt","emotion":"平靜","text":"這裡的神木已經倒下了，樹林要好好照顧。","taigi":{"hanji":"遮的神木已經倒去矣，樹林愛好好仔顧。","tailo":"Tsia ê sîn-bo̍k í-king tó--khì--ah, tshiū-nâ ài hó-hó-á kòo.","huayu":"這裡的神木已經倒下了，樹林要好好照顧。"}}
  ],
  D_XT_2A: [
    {"who":"lantern_shop","emotion":"開心","text":"歡迎來燈籠町！每間屋簷下都掛著燈籠。","taigi":{"hanji":"歡迎來鼓燈町！逐間厝的簾簷跤攏掛鼓仔燈。","tailo":"Huan-gîng lâi Kóo-ting-ting! Ta̍k king tshù ê nî-tsînn-kha lóng kuà kóo-á-ting.","huayu":"歡迎來燈籠町！每間屋簷下都掛著燈籠。"}},
    {"who":"pet","emotion":"平靜","text":"真的溪頭有個松林町，大家叫它妖怪村。"},
    {"who":"lantern_shop","emotion":"擔心","text":"一路上的妖怪迷路了，要送牠們回家。","taigi":{"hanji":"一路的妖怪攏揣無路，欲送𪜶轉去厝。","tailo":"Tsi̍t-lōo ê iau-kuài lóng tshuē-bô lōo, beh sàng in tńg-khì tshù.","huayu":"一路上的妖怪迷路了，要送牠們回家。"}},
    {"who":"lantern_shop","emotion":"平靜","text":"幫我把故事排好，答對 3 題好嗎？","taigi":{"hanji":"共故事排予好，回答三題，好無？","tailo":"Kā kòo-sū pâi hōo hó, huê-tap sann tê, hó--bô?","huayu":"幫我把故事排好，答對 3 題好嗎？"}}
  ],
  D_XT_2B: [
    {"who":"lantern_shop","emotion":"開心","text":"故事排好了！牠們都回家了。","taigi":{"hanji":"故事排好矣！𪜶攏轉去厝矣。","tailo":"Kòo-sū pâi-hó--ah! In lóng tńg-khì tshù--ah.","huayu":"故事排好了！牠們都回家了。"}},
    {"who":"lantern_shop","emotion":"開心","text":"這些金幣送你，謝謝你！","taigi":{"hanji":"這寡金幣送你，多謝你！","tailo":"Tsit-kuá kim-pè sàng lí, to-siā--lí!","huayu":"這些金幣送你，謝謝你！"}}
  ],
  D_XT_3A: [
    {"who":"lantern_shop","emotion":"擔心","text":"可是有怪物把我們的燈籠偷走了！","taigi":{"hanji":"毋過有怪物共阮的鼓仔燈偷提去矣！","tailo":"M̄-koh ū kuài-bu̍t kā guán ê kóo-á-ting thau-the̍h--khì--ah!","huayu":"可是有怪物把我們的燈籠偷走了！"}},
    {"who":"lantern_shop","emotion":"平靜","text":"讓怪物清醒，把 3 盞小燈籠找回來。","taigi":{"hanji":"予怪物清醒，共三葩鼓仔燈揣轉來。","tailo":"Hōo kuài-bu̍t tshing-tshínn, kā sann pha kóo-á-ting tshuē tńg--lâi.","huayu":"讓怪物清醒，把 3 盞小燈籠找回來。"}},
    {"who":"pet","emotion":"驚訝","text":"是林間夜路的森林夜遊白鼻心！"}
  ],
  D_XT_3B: [
    {"who":"lantern_shop","emotion":"開心","text":"燈籠找回來了，謝謝你！","taigi":{"hanji":"鼓仔燈揣轉來矣，多謝你！","tailo":"Kóo-á-ting tshuē tńg--lâi--ah, to-siā--lí!","huayu":"燈籠找回來了，謝謝你！"}},
    {"who":"lantern_shop","emotion":"開心","text":"這些金幣和藥草送你。","taigi":{"hanji":"這寡金幣佮藥草送你。","tailo":"Tsit-kuá kim-pè kah io̍h-tsháu sàng lí.","huayu":"這些金幣和藥草送你。"}}
  ],
  D_XT_4A: [
    {"who":"lantern_shop","emotion":"擔心","text":"還有一隻大的，把整條街的燈籠都藏起來了！","taigi":{"hanji":"閣有一隻足大的，共規條街的鼓仔燈攏藏起來！","tailo":"Koh ū tsi̍t tsiah tsiok tuā--ê, kā kui tiâu ke ê kóo-á-ting lóng tshàng--khí-lâi!","huayu":"還有一隻大的，把整條街的燈籠都藏起來了！"}},
    {"who":"lantern_shop","emotion":"平靜","text":"去廣場讓牠清醒！","taigi":{"hanji":"去廣場予伊清醒！","tailo":"Khì kóng-tiûnn hōo i tshing-tshínn!","huayu":"去廣場讓牠清醒！"}},
    {"who":"pet","emotion":"驚訝","text":"是夜遊團長！答對題目，把燈籠拿回來！"}
  ],
  D_BOSS_CIVET_A: [
    {"who":"ghb_civetboss","emotion":"開心","text":"嘿嘿嘿……燈籠都是我的！今晚整條街都要黑漆漆！"},
    {"who":"pet","emotion":"驚訝","text":"答對題目，讓夜遊團長把燈籠還回來！"}
  ],
  D_BOSS_CIVET_B: [
    {"who":"ghb_civetboss","emotion":"平靜","text":"好啦好啦……燈籠一盞盞掛回去。這盞森林燈籠送你。"}
  ],
  D_XT_4B: [
    {"who":"lantern_shop","emotion":"開心","text":"燈籠又亮了！謝謝你，勇者！","taigi":{"hanji":"鼓仔燈閣光矣！多謝你，勇者！","tailo":"Kóo-á-ting koh kng--ah! To-siā lí, ióng-tsiá!","huayu":"燈籠又亮了！謝謝你，勇者！"}},
    {"who":"lantern_shop","emotion":"開心","text":"這些金幣送你，謝謝你！","taigi":{"hanji":"這寡金幣送你，多謝你！","tailo":"Tsit-kuá kim-pè sàng lí, to-siā--lí!","huayu":"這些金幣送你，謝謝你！"}},
    {"who":"pet","emotion":"開心","text":"拿到森林燈籠了！往塔塔加的山路亮起來了。"}
  ],
  D_CIVET_AFTER: [
    {"who":"narrator","emotion":"平靜","text":"野生動物不要餵，也不要抓喔。"}
  ],
  D_LANTERN_IDLE: [
    {"who":"lantern_shop","emotion":"平靜","text":"燈籠要小心，不可以玩火。","taigi":{"hanji":"鼓仔燈愛細膩，毋通耍火。","tailo":"Kóo-á-ting ài sè-jī, m̄-thang sńg hué.","huayu":"燈籠要小心，不可以玩火。"}}
  ],
  D_XT_5A: [
    {"who":"tea_farmer_lg","emotion":"開心","text":"我們的茶，原本是在鹿谷的山上種的。","taigi":{"hanji":"阮的茶，原底是佇鹿谷的山頂種的。","tailo":"Guán ê tê, guân-té sī tī Lo̍k-kok ê suann-tíng tsìng--ê.","huayu":"我們的茶，原本是在鹿谷的山上種的。"}},
    {"who":"pet","emotion":"平靜","text":"這是凍頂烏龍茶，原產在鹿谷鄉的山區！"},
    {"who":"tea_farmer_lg","emotion":"平靜","text":"那裡的山大約五百到八百公尺高。","taigi":{"hanji":"遐的山大約五百到八百公尺懸。","tailo":"Hia ê suann tāi-iok gōo-pah kàu peh-pah kong-tshioh kuân.","huayu":"那裡的山大約五百到八百公尺高。"}},
    {"who":"tea_farmer_lg","emotion":"擔心","text":"霧讓我忘了種茶的事，幫我想 2 題好嗎？","taigi":{"hanji":"霧予我袂記得種茶的代誌，共我想兩題，好無？","tailo":"Bū hōo guá bē-kì-tit tsìng tê ê tāi-tsì, kā guá siūnn nn̄g tê, hó--bô?","huayu":"霧讓我忘了種茶的事，幫我想 2 題好嗎？"}}
  ],
  D_XT_5B: [
    {"who":"tea_farmer_lg","emotion":"開心","text":"你都答對了，聽得真認真！","taigi":{"hanji":"你攏回答著矣，聽甲真認真！","tailo":"Lí lóng huê-tap tio̍h--ah, thiann kah tsin jīn-tsin!","huayu":"你都答對了，聽得真認真！"}},
    {"who":"tea_farmer_lg","emotion":"開心","text":"這些金幣送你，謝謝你！","taigi":{"hanji":"這寡金幣送你，多謝你！","tailo":"Tsit-kuá kim-pè sàng lí, to-siā--lí!","huayu":"這些金幣送你，謝謝你！"}}
  ],
  D_INN_XITOU: [
    {"who":"inn_xitou","emotion":"開心","text":"歡迎來燈籠町的旅店！好好休息喔。","taigi":{"hanji":"歡迎來鼓燈町的旅社！好好仔歇睏喔。","tailo":"Huan-gîng lâi Kóo-ting-ting ê lí-siā! Hó-hó-á hioh-khùn--ooh.","huayu":"歡迎來燈籠町的旅店！好好休息喔。"}}
  ],
  D_INN_XITOU_NOCOIN: [
    {"who":"inn_xitou","emotion":"擔心","text":"金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。","taigi":{"hanji":"金幣無夠喔，金包里溫泉旅館會使免錢蹛，嘛會使去拍怪物趁金幣。","tailo":"Kim-pè bô-kàu--ooh, Kim-pau-lí un-tsuânn lí-kuán ē-sái bián-tsînn tuà, mā ē-sái khì phah kuài-bu̍t thàn kim-pè.","huayu":"金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。"}}
  ],
  D_VEG_IDLE: [
    {"who":"veg_farmer","emotion":"平靜","text":"宜蘭、南投、臺中的山上，都有種高麗菜。","taigi":{"hanji":"宜蘭、南投、臺中的山頂，攏有種高麗菜。","tailo":"Gî-lân, Lâm-tâu, Tâi-tiong ê suann-tíng, lóng ū tsìng ko-lê-tshài.","huayu":"宜蘭、南投、臺中的山上，都有種高麗菜。"}}
  ],
  D_VETERAN_IDLE: [
    {"who":"road_veteran","emotion":"平靜","text":"以前開路很辛苦，走這條路要謝謝他們。","taigi":{"hanji":"較早開路真辛苦，行這條路愛感謝𪜶。","tailo":"Khah-tsá khui-lōo tsin sin-khóo, kiânn tsit tiâu lōo ài kám-siā in.","huayu":"以前開路很辛苦，走這條路要謝謝他們。"}}
  ],
  D_PAPER_IDLE: [
    {"who":"paper_master","emotion":"平靜","text":"我們也教大家認識手工紙。","taigi":{"hanji":"阮嘛教逐家認捌手工紙。","tailo":"Guán mā kà ta̍k-ke jīn-bat tshiú-kang-tsuá.","huayu":"我們也教大家認識手工紙。"}}
  ],
  D_JIAOBAI_IDLE: [
    {"who":"jiaobai_farmer","emotion":"開心","text":"茭白筍白白的，大家叫它「美人腿」。","taigi":{"hanji":"茭白筍白鑠鑠，逐家叫伊「美人腿」。","tailo":"Kha-pe̍h-sún pe̍h-siak-siak, ta̍k-ke kiò i “bí-jîn-thuí”.","huayu":"茭白筍白白的，大家叫它「美人腿」。"}}
  ],
  D_TEA_LG_IDLE: [
    {"who":"tea_farmer_lg","emotion":"平靜","text":"泡茶的水很燙，要請大人幫忙喔。","taigi":{"hanji":"泡茶的水真燒，愛請大人鬥相共喔。","tailo":"Phàu tê ê tsuí tsin sio, ài tshiánn tuā-lâng tàu-sann-kāng--ooh.","huayu":"泡茶的水很燙，要請大人幫忙喔。"}}
  ],
  D_INN_PULI_IDLE: [
    {"who":"inn_puli","emotion":"開心","text":"累了就來休息，睡飽才有力氣喔。","taigi":{"hanji":"忝矣就來歇睏，睏飽才有氣力喔。","tailo":"Thiám--ah tō lâi hioh-khùn, khùn pá tsiah ū khuì-la̍t--ooh.","huayu":"累了就來休息，睡飽才有力氣喔。"}}
  ],
  D_INN_XITOU_IDLE: [
    {"who":"inn_xitou","emotion":"平靜","text":"晚上山上比較涼，記得多穿一件外套喔。","taigi":{"hanji":"暗時山頂較冷，會記得加穿一領外套喔。","tailo":"Àm-sî suann-tíng khah líng, ē-kì-tit ka tshīng tsi̍t niá guā-thò--ooh.","huayu":"晚上山上比較涼，記得多穿一件外套喔。"}}
  ],
  D_EXIT_LOCK_ZH: [
    {"who":"pet","emotion":"平靜","text":"先爬到武嶺看看路況吧！"},
    {"who":"pet","emotion":"平靜","text":"看完路況，再下山往埔里吧！"}
  ],
  D_EXIT_LOCK_PU: [
    {"who":"pet","emotion":"驚訝","text":"四片曙光碎片在發光……"},
    {"who":"pet","emotion":"平靜","text":"先爬上虎子山頂，看看它們想做什麼！"}
  ],

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
    { who: "fisher", emotion: "開心", text: "這些金幣送你，謝謝你！",
      taigi: { hanji: "這寡金幣送你，多謝你！", tailo: "Tsit-kuá kim-pè sàng lí, to-siā--lí!", huayu: "這些金幣送你，謝謝你！" } },
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
    { who: "innkeeper", emotion: "開心", text: "累了就回來泡溫泉，住一晚只要一點金幣喔。", huayu_only: true,
      taigi_draft: { hanji: "忝矣就轉來浸溫泉，蹛一暝干焦愛淡薄仔金幣喔。", tailo: "Thiám--ah tō tńg-lâi tsìm un-tsuânn, tuà tsi̍t mê kan-na ài tām-po̍h-á kim-pè--ooh.", huayu: "累了就回來泡溫泉，住一晚只要一點金幣喔。" } },
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
    { who: "elf_elder", text: "先到中部的北港，讓燈籠霧將清醒吧。" }
  ],
  D_ELF_1A: [
    { who: "elf_elder", emotion: "開心", text: "你從北港一路走來，辛苦了。" },
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
    { who: "elf_elder", emotion: "擔心", text: "守護森林的神木，被霧附身了……" },
    { who: "elf_elder", emotion: "平靜", text: "樹王的病很奇怪，府城古城的古書也許有寫。" },
    { who: "pet", emotion: "開心", text: "從森林往南走，就到府城古城了！" }
  ],
  D_ELF_4A: [
    { who: "elf_elder", emotion: "擔心", text: "神木變成了「枯萎樹王」。" },
    { who: "elf_elder", emotion: "平靜", text: "請到森林最北邊，讓神木清醒過來。" },
    { who: "pet", emotion: "平靜", text: "頭目戰不能逃跑，先去樹屋休息吧！" }
  ],
  D_ELF_4B: [
    { who: "elf_elder", emotion: "開心", text: "神木醒了，綠葉又長出來了！" },
    { who: "narrator", emotion: "開心", text: "你拿回了「自然之光」！" },
    { who: "elf_elder", emotion: "擔心", text: "聽說府城古城西邊的海上，也起了大霧。" },
    { who: "pet", emotion: "開心", text: "從府城古城往西走，就到安平了！" }
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
    { who: "pet", emotion: "平靜", text: "先去府城古城的塔頂，讓南霧將清醒吧！" }
  ],
  D_ORC_1A: [
    { who: "orc_chief", emotion: "驚訝", text: "你就是讓古城塔頂的霧散開的冒險者？" },
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
    { who: "orc_chief", emotion: "驚訝", text: "可是南邊的石像突然動起來了！" },
    { who: "orc_chief", emotion: "擔心", text: "聽說南方的水果被搶光了，石像氣壞了。" },
    { who: "orc_chief", emotion: "平靜", text: "去南邊的大樹看看吧！" }
  ],
  D_ORC_4A: [
    { who: "orc_chief", emotion: "擔心", text: "暴躁石像在南邊的泥岩溝裡亂撞。" },
    { who: "orc_chief", emotion: "擔心", text: "它忘了大家一起訂的規則，拜託你！" }
  ],
  D_ORC_4B: [
    { who: "orc_chief", emotion: "開心", text: "石像安靜下來了，月世界又和平了。" },
    { who: "narrator", emotion: "開心", text: "你拿回了「社會之光」！" },
    { who: "pet", emotion: "開心", text: "從大樹往南走，就到屏東了！" }
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
    { who: "king", emotion: "平靜", text: "歡迎來到府城古城，小冒險者。", taigi: { hanji: "歡迎來府城，細漢的勇者。", tailo: "Huan-gîng lâi Hú-siânn, sè-hàn ê ióng-tsiá.", huayu: "歡迎來到府城古城，小冒險者。" } },
    { who: "king", emotion: "平靜", text: "先去東邊的森林幫忙，再去西邊的港口看看。", huayu_only: true, taigi_draft: { hanji: "先去東爿的樹林鬥相共，才閣去西爿的港口看覓。", tailo: "Sing khì tang-pîng ê tshiū-nâ tàu-sann-kāng, tsiah-koh khì sai-pîng ê káng-kháu khuànn-māi.", huayu: "先去東邊的森林幫忙，再去西邊的港口看看。" } },
    { who: "pet", emotion: "平靜", text: "要先完成神木森林、安平和台江的委託喔！" }
  ],
  D_FINAL_A: [
    { who: "king", emotion: "驚訝", text: "你就是把霧船趕走的冒險者嗎？", huayu_only: true, taigi_draft: { hanji: "你敢是共霧船趕走的勇者？", tailo: "Lí kám-sī kā bū-tsûn kuánn-tsáu ê ióng-tsiá?", huayu: "你就是把霧船趕走的冒險者嗎？" } },
    { who: "king", emotion: "擔心", text: "霧魔在古城塔頂，樓梯在城主府後面。", taigi: { hanji: "霧的妖怪佇府城的塔頂懸，樓梯佇阮兜後壁。", tailo: "Bū ê iau-kuài tī Hú-siânn ê thah tíng-kuân, lâu-thui tī guán tau āu-piah.", huayu: "霧魔在古城塔頂，樓梯在城主府後面。" } },
    { who: "king", emotion: "擔心", text: "它是南邊的霧將，會用四科的題目考你。", huayu_only: true, taigi_draft: { hanji: "伊是南爿的霧將，會用四科的題目考你。", tailo: "I sī lâm-pîng ê bū-tsiòng, ē īng sì kho ê tê-bo̍k khó lí.", huayu: "它是南邊的霧將，會用四科的題目考你。" } },
    { who: "pet", emotion: "開心", text: "不怕！學過的東西都在心裡！" }
  ],
  D_FINAL_B: [
    { who: "king", emotion: "開心", text: "塔頂的霧散了！大家都想起來了！", huayu_only: true, taigi_draft: { hanji: "塔頂的霧散矣！逐家攏想起來矣！", tailo: "Thah tíng ê bū suànn--ah! Ta̍k-ke lóng siūnn khí-lâi--ah!", huayu: "塔頂的霧散了！大家都想起來了！" } },
    { who: "king", emotion: "開心", text: "謝謝你，霧散了很多。", huayu_only: true, taigi_draft: { hanji: "多謝你，霧散真濟矣。", tailo: "To-siā--lí, bū suànn tsin tsē--ah.", huayu: "謝謝你，霧散了很多。" } },
    { who: "pet", emotion: "驚訝", text: "咦？塔頂好像還有一小團霧……" }
  ],
  D_BOSS_FOG_A: [
    { who: "fog_demon", emotion: "神祕", text: "我是南霧將……把學過的，全部忘掉吧……" },
    { who: "pet", emotion: "開心", text: "才不會忘！四道光，一起亮起來！" }
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
      taigi: { hanji: "毋著的單元轉去加練習，明仔載會使閣來考。", tailo: "M̄-tio̍h ê tan-guân tńg-khì ke liān-si̍p, miâ-á-tsài ē-sái koh lâi khó.", huayu: "答錯的單元回去多練習，明天可以再來考。" } },
    { who: "temple_keeper", emotion: "開心", text: "當見習冒險者，一樣能打倒魔王喔！",
      taigi: { hanji: "做見習冒險者，仝款會當拍贏魔王喔！", tailo: "Tsò kiàn-si̍p mōo-hiám-tsiá, kāng-khuán ē-tàng phah-iânn môo-ông--ooh!", huayu: "當見習冒險者，一樣能打倒魔王喔！" } }
  ],
  D_TRIAL_FAIL_GUILD: [
    { who: "guild", emotion: "平靜", text: "這次還沒過，沒關係。",
      taigi: { hanji: "這擺猶未過關，無要緊。", tailo: "Tsit pái iáu-buē kuè-kuan, bô iàu-kín.", huayu: "這次還沒過，沒關係。" } },
    { who: "guild", emotion: "平靜", text: "把答錯的單元多練習，明天再來考。",
      taigi: { hanji: "共毋著的單元加練習，明仔載閣來考。", tailo: "Kā m̄-tio̍h ê tan-guân ke liān-si̍p, miâ-á-tsài koh lâi khó.", huayu: "把答錯的單元多練習，明天再來考。" } },
    { who: "guild", emotion: "開心", text: "當見習冒險者也能打倒魔王，不用煩惱！",
      taigi: { hanji: "做見習冒險者嘛會當拍贏魔王，免煩惱！", tailo: "Tsò kiàn-si̍p mōo-hiám-tsiá mā ē-tàng phah-iânn môo-ông, bián huân-ló!", huayu: "當見習冒險者也能打倒魔王，不用煩惱！" } }
  ],
  D_TRIAL_AGAIN_TEMPLE: [
    { who: "temple_keeper", emotion: "平靜", text: "今天已經考一次了，明天再來喔。",
      taigi: { hanji: "今仔日已經考一擺矣，明仔載才閣來喔。", tailo: "Kin-á-ji̍t í-king khó tsi̍t pái--ah, miâ-á-tsài tsiah koh lâi--ooh.", huayu: "今天已經考一次了，明天再來喔。" } }
  ],
  D_TRIAL_AGAIN_GUILD: [
    { who: "guild", emotion: "平靜", text: "今天已經考一次了，明天再來喔。",
      taigi: { hanji: "今仔日已經考一擺矣，明仔載才閣來喔。", tailo: "Kin-á-ji̍t í-king khó tsi̍t pái--ah, miâ-á-tsài tsiah koh lâi--ooh.", huayu: "今天已經考一次了，明天再來喔。" } }
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
      taigi: { hanji: "歡迎光臨！藥草、卡片、柴劍攏有喔。", tailo: "Huan-gîng kong-lîng! Io̍h-tsháu, khah-phìnn, tshâ-kiàm lóng ū--ooh.", huayu: "歡迎光臨！藥草、卡片、木劍都有喔。" } },
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
      taigi: { hanji: "歡迎來阮民宿，好好仔歇睏。", tailo: "Huan-gîng lâi guán bîn-sok, hó-hó-á hioh-khùn.", huayu: "歡迎來我們民宿，好好休息。" } }
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
      taigi: { hanji: "歡迎來樹仔頂的厝蹛！聽樹林的聲，好好仔睏一暝。", tailo: "Huan-gîng lâi tshiū-á-tíng ê tshù tuà! Thiann tshiū-nâ ê siann, hó-hó-á khùn tsi̍t mê.", huayu: "歡迎來樹屋住！聽著森林的聲音，好好睡一覺。" } }
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
      taigi: { hanji: "歡迎光臨府城的古早客棧，予你一暝睏甲真好勢。", tailo: "Huan-gîng kong-lîng Hú-siânn ê kóo-tsá kheh-tsàn, hōo lí tsi̍t mê khùn kah tsin hó-sè.", huayu: "歡迎光臨府城老客棧，讓你一夜好眠。" } }
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
    { who: "park_ranger", emotion: "開心", text: "這些金幣送你，謝謝你！",
      taigi: { hanji: "這寡金幣送你，多謝你！", tailo: "Tsit-kuá kim-pè sàng lí, to-siā--lí!", huayu: "這些金幣送你，謝謝你！" } }
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
      taigi: { hanji: "予怪物清醒，共三支雨傘揣轉來。", tailo: "Hōo kuài-bu̍t tshing-tshínn, kā sann ki hōo-suànn tshuē tńg--lâi.", huayu: "讓怪物清醒，把 3 把雨傘找回來。" } },
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
      taigi: { hanji: "你會使去予伊清醒無？愛細膩喔。", tailo: "Lí ē-sái khì hōo i tshing-tshínn--bô? Ài sè-jī--ooh.", huayu: "你可以去讓它清醒嗎？要小心喔。" } },
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
      taigi: { hanji: "嘛會使先予漁港的大石距清醒，才閣轉來換職業喔。", tailo: "Mā ē-sái sing hōo hî-káng ê tuā tsio̍h-kī tshing-tshínn, tsiah-koh tńg-lâi uānn tsit-gia̍p--ooh.", huayu: "也可以先讓漁港的大章魚清醒，再回來換職業喔。" } }
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
      taigi: { hanji: "所以刻一个「虎」字，意思是「風從虎」。", tailo: "Sóo-í khik tsi̍t ê “hóo” jī, ì-sù sī “hong tsông hóo”.", huayu: "所以刻了「虎」字，取「風從虎」的意思。" } },
    { who: "trail_volunteer", emotion: "擔心", text: "霧讓大家看不懂碑上的字，幫我想 3 題好嗎？",
      taigi: { hanji: "霧予逐家看無碑頂的字，共我想三題，好無？", tailo: "Bū hōo ta̍k-ke khuànn-bô pi tíng ê jī, kā guá siūnn sann tê, hó--bô?", huayu: "霧讓大家看不懂碑上的字，幫我想 3 題好嗎？" } }
  ],
  D_CL_1B: [
    { who: "trail_volunteer", emotion: "開心", text: "你都答對了，真厲害！",
      taigi: { hanji: "你攏回答著矣，真讚！", tailo: "Lí lóng huê-tap tio̍h--ah, tsin tsán!", huayu: "你都答對了，真厲害！" } },
    { who: "trail_volunteer", emotion: "平靜", text: "這條路走到尾，就是宜蘭了。",
      taigi: { hanji: "這條路行到尾，就是宜蘭矣。", tailo: "Tsit tiâu lōo kiânn kàu bué, tō-sī Gî-lân--ah.", huayu: "這條路走到尾，就是宜蘭了。" } },
    { who: "trail_volunteer", emotion: "開心", text: "這些金幣送你，謝謝你！",
      taigi: { hanji: "這寡金幣送你，多謝你！", tailo: "Tsit-kuá kim-pè sàng lí, to-siā--lí!", huayu: "這些金幣送你，謝謝你！" } }
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
      taigi: { hanji: "予怪物清醒，共三粒金棗揣轉來。", tailo: "Hōo kuài-bu̍t tshing-tshínn, kā sann lia̍p kim-tsó tshuē tńg--lâi.", huayu: "讓怪物清醒，把 3 顆金棗找回來。" } },
    { who: "pet", emotion: "驚訝", text: "是金棗彈彈！讓牠們清醒，就會掉金棗。" }
  ],
  D_YL_2B: [
    { who: "kumquat_farmer", emotion: "開心", text: "金棗都找回來了，謝謝你！",
      taigi: { hanji: "金棗攏揣轉來矣，多謝你！", tailo: "Kim-tsó lóng tshuē tńg--lâi--ah, to-siā--lí!", huayu: "金棗都找回來了，謝謝你！" } },
    { who: "kumquat_farmer", emotion: "開心", text: "這些金幣和藥草送你。",
      taigi: { hanji: "這寡金幣佮藥草送你。", tailo: "Tsit-kuá kim-pè kah io̍h-tsháu sàng lí.", huayu: "這些金幣和藥草送你。" } },
    { who: "kumquat_farmer", emotion: "平靜", text: "往南走到三星，種蔥的阿伯也在找人幫忙。",
      taigi: { hanji: "向南爿行到三星，種蔥的阿伯嘛咧揣人鬥相共。", tailo: "Ǹg lâm-pîng kiânn kàu Sann-tshenn, tsìng tshang ê a-peh mā teh tshuē lâng tàu-sann-kāng.", huayu: "往南走到三星，種蔥的阿伯也在找人幫忙。" } }
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
      taigi: { hanji: "磅空佇坪林佮頭城中間，有十二點九公里長。", tailo: "Pōng-khang tī Phîng-lîm kah Thâu-siânn tiong-kan, ū tsa̍p-jī tiám káu kong-lí tn̂g.", huayu: "隧道在坪林和頭城中間，有 12.9 公里長。" } },
    { who: "bus_driver", emotion: "平靜", text: "民國 95 年就通車了。",
      taigi: { hanji: "民國九十五年就通車矣。", tailo: "Bîn-kok káu-tsa̍p-gōo nî tō thong-tshia--ah.", huayu: "民國 95 年就通車了。" } },
    { who: "bus_driver", emotion: "擔心", text: "霧讓大家忘了路怎麼走，幫我想 2 題好嗎？",
      taigi: { hanji: "霧予逐家袂記得路按怎行，共我想兩題，好無？", tailo: "Bū hōo ta̍k-ke bē-kì-tit lōo án-tsuánn kiânn, kā guá siūnn nn̄g tê, hó--bô?", huayu: "霧讓大家忘了路怎麼走，幫我想 2 題好嗎？" } }
  ],
  D_YL_SNOW_B: [
    { who: "bus_driver", emotion: "開心", text: "答對了！乘客都知道怎麼走了。",
      taigi: { hanji: "回答著矣！人客攏知影按怎行矣。", tailo: "Huê-tap tio̍h--ah! Lâng-kheh lóng tsai-iánn án-tsuánn kiânn--ah.", huayu: "答對了！乘客都知道怎麼走了。" } },
    { who: "bus_driver", emotion: "開心", text: "這些金幣送你，謝謝你！",
      taigi: { hanji: "這寡金幣送你，多謝你！", tailo: "Tsit-kuá kim-pè sàng lí, to-siā--lí!", huayu: "這些金幣送你，謝謝你！" } }
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
    { who: "levee_uncle", emotion: "開心", text: "這些金幣送你，謝謝你！",
      taigi: { hanji: "這寡金幣送你，多謝你！", tailo: "Tsit-kuá kim-pè sàng lí, to-siā--lí!", huayu: "這些金幣送你，謝謝你！" } }
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
    { who: "inn_jiaoxi", emotion: "開心", text: "歡迎！泡一下溫泉，就有精神了。",
      taigi: { hanji: "歡迎！浸一下溫泉，就有元氣矣。", tailo: "Huan-gîng! Tsìm tsi̍t-ē un-tsuânn, tō ū guân-khì--ah.", huayu: "歡迎！泡一下溫泉，就有精神了。" } },
    { who: "pet", emotion: "平靜", text: "泡溫泉不算住宿喔！記得要有大人陪。" }
  ],
  D_YL_3_LOCK: [
    { who: "scallion_farmer", emotion: "平靜", text: "先去北邊幫種金棗的阿伯，再來找我。",
      taigi: { hanji: "先去北爿共種金棗的阿伯鬥相共，才閣來揣我。", tailo: "Sing khì pak-pîng kā tsìng kim-tsó ê a-peh tàu-sann-kāng, tsiah-koh lâi tshuē guá.", huayu: "先去北邊幫種金棗的阿伯，再來找我。" } },
    { who: "pet", emotion: "平靜", text: "頭城礁溪的金棗農阿伯，好像需要幫忙！" }
  ],
  D_YL_3A: [
    { who: "scallion_farmer", emotion: "開心", text: "歡迎來三星！這裡的蔥很有名喔。",
      taigi: { hanji: "歡迎來三星！遮的蔥真出名喔。", tailo: "Huan-gîng lâi Sann-tshenn! Tsia ê tshang tsin tshut-miâ--ooh.", huayu: "歡迎來三星！這裡的蔥很有名喔。" } },
    { who: "scallion_farmer", emotion: "平靜", text: "我們把稻草鋪在蔥田上，用稻草種蔥。",
      taigi: { hanji: "阮共稻草鋪佇蔥仔田頂，用稻草種蔥。", tailo: "Guán kā tiū-tsháu phoo tī tshang-á-tshân tíng, īng tiū-tsháu tsìng tshang.", huayu: "我們把稻草鋪在蔥田上，用稻草種蔥。" } },
    { who: "scallion_farmer", emotion: "擔心", text: "要收成了，可是霧讓我算不清楚。",
      taigi: { hanji: "欲收成矣，毋過霧予我算袂清楚。", tailo: "Beh siu-sîng--ah, m̄-koh bū hōo guá sǹg bē tshing-tshó.", huayu: "要收成了，可是霧讓我算不清楚。" } },
    { who: "scallion_farmer", emotion: "平靜", text: "幫我算蔥、綁蔥，答對 3 題好嗎？",
      taigi: { hanji: "共我算蔥、縛蔥，回答著三題，好無？", tailo: "Kā guá sǹg tshang, pa̍k tshang, huê-tap tio̍h sann tê, hó--bô?", huayu: "幫我算蔥、綁蔥，答對 3 題好嗎？" } }
  ],
  D_YL_3B: [
    { who: "scallion_farmer", emotion: "開心", text: "綁好了！三星蔥的蔥白又長又香。",
      taigi: { hanji: "縛好矣！三星蔥的蔥白閣長閣芳。", tailo: "Pa̍k hó--ah! Sann-tshenn-tshang ê tshang-pe̍h koh tn̂g koh phang.", huayu: "綁好了！三星蔥的蔥白又長又香。" } },
    { who: "scallion_farmer", emotion: "平靜", text: "再往南走，就到蘇澳了。",
      taigi: { hanji: "閣向南爿行，就到蘇澳矣。", tailo: "Koh ǹg lâm-pîng kiânn, tō kàu Soo-ò--ah.", huayu: "再往南走，就到蘇澳了。" } }
  ],
  D_SCALLION_IDLE: [
    { who: "scallion_farmer", text: "南邊那條大溪，就是蘭陽溪。",
      taigi: { hanji: "南爿彼條大溪，就是蘭陽溪。", tailo: "Lâm-pîng hit tiâu tuā-khe, tō-sī Lân-iông-khe.", huayu: "南邊那條大溪，就是蘭陽溪。" } }
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
      taigi: { hanji: "冊頂有寫，歌仔戲是對宜蘭員山開始的。", tailo: "Tsheh tíng ū siá, kua-á-hì sī tuì Gî-lân Guân-suann khai-sí--ê.", huayu: "書上有寫，歌仔戲是從宜蘭員山開始的。" } },
    { who: "opera_actor", emotion: "擔心", text: "霧讓我忘了台詞，幫我想 3 題好嗎？",
      taigi: { hanji: "霧予我袂記得台詞，共我想三題，好無？", tailo: "Bū hōo guá bē-kì-tit tâi-sû, kā guá siūnn sann tê, hó--bô?", huayu: "霧讓我忘了台詞，幫我想 3 題好嗎？" } }
  ],
  D_YL_OPERA_B: [
    { who: "opera_actor", emotion: "開心", text: "想起來了！今天的戲可以開始演了。",
      taigi: { hanji: "想起來矣！今仔日的戲會使開始搬矣。", tailo: "Siūnn khí-lâi--ah! Kin-á-ji̍t ê hì ē-sái khai-sí puann--ah.", huayu: "想起來了！今天的戲可以開始演了。" } },
    { who: "opera_actor", emotion: "開心", text: "這些金幣送你，謝謝你！",
      taigi: { hanji: "這寡金幣送你，多謝你！", tailo: "Tsit-kuá kim-pè sàng lí, to-siā--lí!", huayu: "這些金幣送你，謝謝你！" } }
  ],
  D_OPERA_IDLE: [
    { who: "opera_actor", text: "歌仔戲要唱、要演，還要記很多台詞。",
      taigi: { hanji: "歌仔戲愛唱、愛搬，閣愛記真濟台詞。", tailo: "Kua-á-hì ài tshiùnn, ài puann, koh ài kì tsin tsē tâi-sû.", huayu: "歌仔戲要唱、要演，還要記很多台詞。" } }
  ],
  D_INN_SANXING: [
    { who: "inn_sanxing", emotion: "開心", text: "歡迎來我們的民宿！田邊很安靜，好好休息。",
      taigi: { hanji: "歡迎來阮的民宿！田園真恬靜，好好仔歇睏。", tailo: "Huan-gîng lâi guán ê bîn-sok! Tshân-hn̂g tsin tiām-tsīng, hó-hó-á hioh-khùn.", huayu: "歡迎來我們的民宿！田邊很安靜，好好休息。" } }
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
    { who: "inn_suao", emotion: "開心", text: "歡迎！泡一下冷泉，就有精神了。", huayu_only: true,
      taigi_draft: { hanji: "歡迎！浸一下冷泉，就有元氣矣。", tailo: "Huan-gîng! Tsìm tsi̍t-ē líng-tsuânn, tō ū guân-khì--ah.", huayu: "歡迎！泡一下冷泉，就有精神了。" } },
    { who: "pet", emotion: "平靜", text: "泡冷泉不算住宿喔！記得要有大人陪。" }
  ],
  D_INN_JINBAOLI_BATH: [
    { who: "innkeeper", emotion: "開心", text: "歡迎！泡一下溫泉，就有精神了。",
      taigi: { hanji: "歡迎！浸一下溫泉，就有元氣矣。", tailo: "Huan-gîng! Tsìm tsi̍t-ē un-tsuânn, tō ū guân-khì--ah.", huayu: "歡迎！泡一下溫泉，就有精神了。" } },
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
      taigi: { hanji: "遮辦花飛節，已經二十外年矣。", tailo: "Tsia pān hue-hui-tsiat, í-king jī-tsa̍p guā nî--ah.", huayu: "這裡辦鯖魚節，已經辦二十多年了。" } },
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
      taigi: { hanji: "你會使去予伊清醒無？愛細膩喔。", tailo: "Lí ē-sái khì hōo i tshing-tshínn--bô? Ài sè-jī--ooh.", huayu: "你可以去讓它清醒嗎？要小心喔。" } },
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
  // v2.0 新經濟（67 號 5.2 第 3 點）：舊存檔讀檔後說明一次（旁白）
  D_MIGRATE_ECON: [
    { who: "narrator", emotion: "開心", text: "勇者大冒險更新了！你的等級和能力都沒有變。" },
    { who: "narrator", emotion: "平靜", text: "打倒怪物、完成委託拿到的經驗值和金幣，數字變小了。" },
    { who: "narrator", emotion: "平靜", text: "升級要的經驗值也變少了，所以升級的速度差不多。" },
    { who: "narrator", emotion: "平靜", text: "裝備和旅店變便宜了；委託完成時，會一次拿到經驗值和金幣。" }
  ],
  D_PL_1_LOCK: [
    { who: "tea_farmer", emotion: "平靜", text: "先去蘇澳的漁港幫忙，再來找我。", taigi: { hanji: "先去蘇澳的漁港鬥相共，才閣來揣我。", tailo: "Sing khì Soo-ò ê hî-káng tàu-sann-kāng, tsiah-koh lâi tshuē guá.", huayu: "先去蘇澳的漁港幫忙，再來找我。" } },
    { who: "pet", emotion: "平靜", text: "南方澳的漁港阿伯，好像需要幫忙！" }
  ],
  D_PL_1A: [
    { who: "tea_farmer", emotion: "開心", text: "歡迎來坪林！這裡四面都是山。", taigi: { hanji: "歡迎來坪林！遮四面攏是山。", tailo: "Huan-gîng lâi Phîng-lîm! Tsia sì-bīn lóng sī suann.", huayu: "歡迎來坪林！這裡四面都是山。" } },
    { who: "tea_farmer", emotion: "平靜", text: "這裡種很多茶，大家叫這裡「包種茶鄉」。", taigi: { hanji: "遮種真濟茶，人攏叫遮「包種茶鄉」。", tailo: "Tsia tsìng tsin tsē tê, lâng lóng kiò tsia “pau-tsióng-tê hiong”.", huayu: "這裡種很多茶，大家叫這裡「包種茶鄉」。" } },
    { who: "tea_farmer", emotion: "平靜", text: "這裡十個人裡面，有八個是種茶的。", taigi: { hanji: "遮十个人內底，有八个是種茶的。", tailo: "Tsia tsa̍p ê lâng lāi-té, ū peh ê sī tsìng tê--ê.", huayu: "這裡十個人裡面，有八個是種茶的。" } },
    { who: "tea_farmer", emotion: "擔心", text: "霧讓我忘了怎麼照顧茶樹，幫我想 3 題好嗎？", taigi: { hanji: "霧予我袂記得按怎顧茶欉，共我想三題，好無？", tailo: "Bū hōo guá bē-kì-tit án-tsuánn kòo tê-tsâng, kā guá siūnn sann tê, hó--bô?", huayu: "霧讓我忘了怎麼照顧茶樹，幫我想 3 題好嗎？" } }
  ],
  D_PL_1B: [
    { who: "tea_farmer", emotion: "開心", text: "想起來了！茶樹又變健康了。", taigi: { hanji: "想起來矣！茶欉閣變健康矣。", tailo: "Siūnn khí-lâi--ah! Tê-tsâng koh piàn kiān-khong--ah.", huayu: "想起來了！茶樹又變健康了。" } },
    { who: "tea_farmer", emotion: "擔心", text: "可是茶寮旁邊的怪物，把茶葉搶走了！", taigi: { hanji: "毋過茶寮邊仔的怪物，共茶葉搶走矣！", tailo: "M̄-koh tê-liâu pinn--á ê kuài-bu̍t, kā tê-hio̍h tshiúnn-tsáu--ah!", huayu: "可是茶寮旁邊的怪物，把茶葉搶走了！" } }
  ],
  D_PL_2A: [
    { who: "tea_farmer", emotion: "擔心", text: "那隻怪物背著竹籠，被霧弄迷糊了。", taigi: { hanji: "彼个怪物揹著竹籠仔，予霧舞甲霧嗄嗄。", tailo: "Hit ê kuài-bu̍t phāinn-tio̍h tik-láng-á, hōo bū bú kah bū-sà-sà.", huayu: "那隻怪物背著竹籠，被霧弄迷糊了。" } },
    { who: "tea_farmer", emotion: "平靜", text: "讓怪物清醒，把 3 包茶葉找回來。", taigi: { hanji: "予怪物清醒，共三包茶葉揣轉來。", tailo: "Hōo kuài-bu̍t tshing-tshínn, kā sann pau tê-hio̍h tshuē tńg--lâi.", huayu: "讓怪物清醒，把 3 包茶葉找回來。" } },
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
    { who: "gondola_staff", emotion: "平靜", text: "讓怪物清醒，把 3 張車票找回來。", taigi: { hanji: "予怪物清醒，共三張車票揣轉來。", tailo: "Hōo kuài-bu̍t tshing-tshínn, kā sann tiunn tshia-phiò tshuē tńg--lâi.", huayu: "讓怪物清醒，把 3 張車票找回來。" } },
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
    { who: "temple_volunteer_ht", emotion: "平靜", text: "大香爐和供桌拿掉了，大家雙手合十就好。", taigi: { hanji: "大香爐佮尪架桌提掉矣，逐家雙手合掌就好。", tailo: "Tuā hiunn-lôo kah ang-kè-toh the̍h-tiāu--ah, ta̍k-ke siang-tshiú ha̍p-tsióng tō hó.", huayu: "大香爐和供桌拿掉了，大家雙手合十就好。" } }
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
    { who: "culture_guide", emotion: "開心", text: "這些金幣送你，謝謝你！", taigi: { hanji: "這寡金幣送你，多謝你！", tailo: "Tsit-kuá kim-pè sàng lí, to-siā--lí!", huayu: "這些金幣送你，謝謝你！" } }
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
    { who: "traffic_volunteer", emotion: "開心", text: "這些金幣送你，謝謝你！", taigi: { hanji: "這寡金幣送你，多謝你！", tailo: "Tsit-kuá kim-pè sàng lí, to-siā--lí!", huayu: "這些金幣送你，謝謝你！" } }
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
    { who: "observatory_staff", emotion: "開心", text: "這些金幣送你，謝謝你！", taigi: { hanji: "這寡金幣送你，多謝你！", tailo: "Tsit-kuá kim-pè sàng lí, to-siā--lí!", huayu: "這些金幣送你，謝謝你！" } }
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
    { who: "village_guide", emotion: "開心", text: "這些金幣送你，謝謝你！", taigi: { hanji: "這寡金幣送你，多謝你！", tailo: "Tsit-kuá kim-pè sàng lí, to-siā--lí!", huayu: "這些金幣送你，謝謝你！" } }
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
    { who: "inn_beitou", emotion: "開心", text: "歡迎！泡一下溫泉，就有精神了。", taigi: { hanji: "歡迎！浸一下溫泉，就有元氣矣。", tailo: "Huan-gîng! Tsìm tsi̍t-ē un-tsuânn, tō ū guân-khì--ah.", huayu: "歡迎！泡一下溫泉，就有精神了。" } },
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
    { who: "temple_volunteer_ht", emotion: "平靜", text: "答錯的單元回去多練習，明天可以再來考。", taigi: { hanji: "毋著的單元轉去加練習，明仔載會使閣來考。", tailo: "M̄-tio̍h ê tan-guân tńg-khì ke liān-si̍p, miâ-á-tsài ē-sái koh lâi khó.", huayu: "答錯的單元回去多練習，明天可以再來考。" } },
    { who: "temple_volunteer_ht", emotion: "開心", text: "當見習冒險者，一樣能打倒魔王喔！", taigi: { hanji: "做見習冒險者，仝款會當拍贏魔王喔！", tailo: "Tsò kiàn-si̍p mōo-hiám-tsiá, kāng-khuán ē-tàng phah-iânn môo-ông--ooh!", huayu: "當見習冒險者，一樣能打倒魔王喔！" } }
  ],
  D_TRIAL_AGAIN_HT: [
    { who: "temple_volunteer_ht", emotion: "平靜", text: "今天已經考一次了，明天再來喔。", taigi: { hanji: "今仔日已經考一擺矣，明仔載才閣來喔。", tailo: "Kin-á-ji̍t í-king khó tsi̍t pái--ah, miâ-á-tsài tsiah koh lâi--ooh.", huayu: "今天已經考一次了，明天再來喔。" } }
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
    { who: "temple_volunteer_zn", emotion: "平靜", text: "答錯的單元回去多練習，明天可以再來考。", taigi: { hanji: "毋著的單元轉去加練習，明仔載會使閣來考。", tailo: "M̄-tio̍h ê tan-guân tńg-khì ke liān-si̍p, miâ-á-tsài ē-sái koh lâi khó.", huayu: "答錯的單元回去多練習，明天可以再來考。" } },
    { who: "temple_volunteer_zn", emotion: "開心", text: "當見習冒險者，一樣能打倒魔王喔！", taigi: { hanji: "做見習冒險者，仝款會當拍贏魔王喔！", tailo: "Tsò kiàn-si̍p mōo-hiám-tsiá, kāng-khuán ē-tàng phah-iânn môo-ông--ooh!", huayu: "當見習冒險者，一樣能打倒魔王喔！" } }
  ],
  D_TRIAL_AGAIN_ZN: [
    { who: "temple_volunteer_zn", emotion: "平靜", text: "今天已經考一次了，明天再來喔。", taigi: { hanji: "今仔日已經考一擺矣，明仔載才閣來喔。", tailo: "Kin-á-ji̍t í-king khó tsi̍t pái--ah, miâ-á-tsài tsiah koh lâi--ooh.", huayu: "今天已經考一次了，明天再來喔。" } }
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

  // ═════════════ v1.3.1 台語氣象諺語（劇本語音組 2026-10-25；wip_v131_draft/dialogs_proverbs.js，v131_apply.js 併入）═════════════
  D_PV_01: [
    { who: "levee_uncle", emotion: "平靜", text: "龜山戴上黑帽子，雨馬上就下來。",
      taigi: { hanji: "龜山戴烏帽，連鞭雨著落。", tailo: "Ku-suann tì oo-bō, nā-mi̍h hōo tio̍h lo̍h.", huayu: "龜山戴上黑帽子，雨馬上就下來。" } },
    { who: "pet", emotion: "平靜", text: "雲蓋住龜山島的山頂，老一輩就說快下雨了。" },
    { who: "pet", emotion: "平靜", text: "這是民間說法，天氣還是要看氣象預報喔！" }
  ],
  D_PV_02: [
    { who: "trail_volunteer", emotion: "擔心", text: "米缸沒米了，也不可以去三貂角。",
      taigi: { hanji: "米甕仔無米，三貂角嘛毋通去。", tailo: "Bí-àng-á bô bí, Sam-tiau-kak mā m̄-thang khì.", huayu: "米缸沒米了，也不可以去三貂角。" } },
    { who: "pet", emotion: "平靜", text: "冬天東北季風很強，去海邊要特別小心。" },
    { who: "pet", emotion: "平靜", text: "去海邊前，要先看氣象署的提醒喔！" }
  ],
  D_PV_03: [
    { who: "bt_museum_guide", emotion: "平靜", text: "淡水這種天氣，雨傘靠在門邊。",
      taigi: { hanji: "淡水這號天，雨傘倚門邊。", tailo: "Tām-tsuí tsit-lō thinn, hōo-suànn uá mn̂g-pinn.", huayu: "淡水這種天氣，雨傘靠在門邊。" } },
    { who: "pet", emotion: "平靜", text: "老一輩說淡水常常下雨，雨傘放門邊隨時拿。" },
    { who: "pet", emotion: "平靜", text: "這是民間說法，天氣還是要看氣象預報喔！" }
  ],
  D_PV_04: [
    { who: "scallion_farmer", emotion: "平靜", text: "西北雨下不過田埂。",
      taigi: { hanji: "西北雨，落袂過田岸。", tailo: "Sai-pak-hōo, lo̍h bē kuè tshân-huānn.", huayu: "西北雨下不過田埂。" } },
    { who: "pet", emotion: "平靜", text: "夏天午後的雷陣雨，來得快、去得也快。" }
  ],
  D_PV_05: [
    { who: "tea_farmer", emotion: "平靜", text: "春天就像小孩子的臉。",
      taigi: { hanji: "春天，囡仔面。", tailo: "Tshun-thinn, gín-á bīn.", huayu: "春天就像小孩子的臉。" } },
    { who: "pet", emotion: "平靜", text: "春天天氣變來變去，一下晴天、一下下雨。" }
  ],
  D_PV_06: [
    { who: "calla_farmer", emotion: "平靜", text: "霧罩著散不開，戴斗笠、披蓑衣。",
      taigi: { hanji: "罩雺罩袂開，戴笠披棕蓑。", tailo: "Tà-bông tà bē khui, tì le̍h phi tsang-sui.", huayu: "霧罩著散不開，戴斗笠、披蓑衣。" } },
    { who: "pet", emotion: "平靜", text: "老一輩說霧久久不散，就快下雨了。" },
    { who: "pet", emotion: "平靜", text: "這是民間說法，天氣還是要看氣象預報喔！" }
  ],
  D_PV_07: [
    { who: "potato_seller", emotion: "平靜", text: "螞蟻搬家跑走，大雨快要來了。",
      taigi: { hanji: "狗蟻搬徙走，大雨欲來到。", tailo: "Káu-hiā puann-suá tsáu, tuā-hōo beh lâi kàu.", huayu: "螞蟻搬家跑走，大雨快要來了。" } },
    { who: "pet", emotion: "平靜", text: "老一輩說螞蟻搬家，就快下大雨了。" },
    { who: "pet", emotion: "平靜", text: "這是民間說法，天氣還是要看氣象預報喔！" }
  ],
  D_PV_08: [
    { who: "temple_keeper", emotion: "平靜", text: "大道公的風，媽祖婆的雨。",
      taigi: { hanji: "大道公風，媽祖婆雨。", tailo: "Tāi-tō-kong hong, Má-tsóo-pô hōo.", huayu: "大道公的風，媽祖婆的雨。" } },
    { who: "pet", emotion: "平靜", text: "傳說大道公生日會颳風，媽祖生日會下雨。" },
    { who: "pet", emotion: "平靜", text: "這是民間傳說，不是天氣預報喔！" }
  ],
  D_PV_09: [
    { who: "dihua_shop", emotion: "平靜", text: "還沒吃端午節的粽子，舊冬衣捨不得收。",
      taigi: { hanji: "未食五日節粽，破裘毋甘放。", tailo: "Buē tsia̍h Gōo-ji̍t-tseh tsàng, phuà hiû m̄-kam pàng.", huayu: "還沒吃端午節的粽子，舊冬衣捨不得收。" } },
    { who: "pet", emotion: "平靜", text: "端午節以前，天氣還可能變涼，冬衣先別收。" },
    { who: "pet", emotion: "平靜", text: "這是民間說法，天氣還是要看氣象預報喔！" }
  ],
  D_PV_10: [
    { who: "harbor_uncle", emotion: "擔心", text: "九月的颱風，沒有人知道。",
      taigi: { hanji: "九月颱，無人知。", tailo: "Káu-gue̍h thai, bô lâng tsai.", huayu: "九月的颱風，沒有人知道。" } },
    { who: "pet", emotion: "平靜", text: "農曆九月以後，很難從天空看出颱風要來。" }
  ],
  D_PVQ_1_ASK: [
    { who: "scallion_farmer", emotion: "開心", text: "阿伯故意說錯，你找找看哪裡錯了。",
      taigi: { hanji: "阿伯故意講毋著，你揣看覓佗位毋著。", tailo: "A-peh kòo-ì kóng m̄-tio̍h, lí tshuē khuànn-māi tó-uī m̄-tio̍h.", huayu: "阿伯故意說錯，你找找看哪裡錯了。" } },
    { who: "scallion_farmer", emotion: "開心", text: "西北雨下不過田埂，所以會下一整天。",
      taigi: { hanji: "西北雨落袂過田岸，所以會落規工。", tailo: "Sai-pak-hōo lo̍h bē kuè tshân-huānn, sóo-í ē lo̍h kui-kang.", huayu: "西北雨下不過田埂，所以會下一整天。" } }
  ],
  D_PVQ_1_RIGHT: [
    { who: "pet", emotion: "開心", text: "答對了！西北雨來得快、去得也快，不會下一整天。" },
    { who: "scallion_farmer", emotion: "開心", text: "對啦，西北雨下一下就停了。",
      taigi: { hanji: "著啦，西北雨落一下就停矣。", tailo: "Tio̍h--lah, sai-pak-hōo lo̍h tsi̍t-ē tō thîng--ah.", huayu: "對啦，西北雨下一下就停了。" } }
  ],
  D_PVQ_1_WRONG: [
    { who: "pet", emotion: "擔心", text: "再想想，西北雨是下很久，還是一下就停？" }
  ],
  D_PVQ_2_ASK: [
    { who: "potato_seller", emotion: "開心", text: "阿伯故意說錯，你找找看哪裡錯了。",
      taigi: { hanji: "阿伯故意講毋著，你揣看覓佗位毋著。", tailo: "A-peh kòo-ì kóng m̄-tio̍h, lí tshuē khuànn-māi tó-uī m̄-tio̍h.", huayu: "阿伯故意說錯，你找找看哪裡錯了。" } },
    { who: "potato_seller", emotion: "開心", text: "螞蟻搬家跑走，一定會下大雨，這是科學！",
      taigi: { hanji: "狗蟻搬徙走，一定會落大雨，這是科學！", tailo: "Káu-hiā puann-suá tsáu, it-tīng ē lo̍h tuā-hōo, tse sī kho-ha̍k!", huayu: "螞蟻搬家跑走，一定會下大雨，這是科學！" } }
  ],
  D_PVQ_2_RIGHT: [
    { who: "pet", emotion: "開心", text: "答對了！這是民間說法，螞蟻搬家不一定會下雨。" },
    { who: "potato_seller", emotion: "開心", text: "對啦，想知道會不會下雨，要看天氣預報。",
      taigi: { hanji: "著啦，欲知影會落雨無，愛看天氣預報。", tailo: "Tio̍h--lah, beh tsai-iánn ē lo̍h-hōo--bô, ài khuànn thinn-khì ī-pò.", huayu: "對啦，想知道會不會下雨，要看天氣預報。" } }
  ],
  D_PVQ_2_WRONG: [
    { who: "pet", emotion: "擔心", text: "再想想，民間說法可以說成「一定」和「科學」嗎？" }
  ],
  D_PVQ_3_ASK: [
    { who: "levee_uncle", emotion: "開心", text: "阿伯故意說錯，你找找看哪裡錯了。",
      taigi: { hanji: "阿伯故意講毋著，你揣看覓佗位毋著。", tailo: "A-peh kòo-ì kóng m̄-tio̍h, lí tshuē khuànn-māi tó-uī m̄-tio̍h.", huayu: "阿伯故意說錯，你找找看哪裡錯了。" } },
    { who: "levee_uncle", emotion: "開心", text: "龜山戴上黑帽子，臺北雨馬上就下來。",
      taigi: { hanji: "龜山戴烏帽，臺北連鞭雨著落。", tailo: "Ku-suann tì oo-bō, Tâi-pak nā-mi̍h hōo tio̍h lo̍h.", huayu: "龜山戴上黑帽子，臺北雨馬上就下來。" } }
  ],
  D_PVQ_3_RIGHT: [
    { who: "pet", emotion: "開心", text: "答對了！龜山島在宜蘭外海，這句說的是宜蘭的天氣。" },
    { who: "levee_uncle", emotion: "開心", text: "對啦，龜山戴帽，說的是宜蘭的天氣。",
      taigi: { hanji: "著啦，龜山戴帽，講的是宜蘭的天。", tailo: "Tio̍h--lah, Ku-suann tì bō, kóng ê sī Gî-lân ê thinn.", huayu: "對啦，龜山戴帽，說的是宜蘭的天氣。" } }
  ],
  D_PVQ_3_WRONG: [
    { who: "pet", emotion: "擔心", text: "再想想，龜山島在哪裡？是在臺北嗎？" }
  ],
  D_PVQ_4_ASK: [
    { who: "temple_keeper", emotion: "開心", text: "阿伯故意說錯，你找找看哪裡錯了。",
      taigi: { hanji: "阿伯故意講毋著，你揣看覓佗位毋著。", tailo: "A-peh kòo-ì kóng m̄-tio̍h, lí tshuē khuànn-māi tó-uī m̄-tio̍h.", huayu: "阿伯故意說錯，你找找看哪裡錯了。" } },
    { who: "temple_keeper", emotion: "開心", text: "大道公的風，媽祖婆的雨，這是天氣預報說的！",
      taigi: { hanji: "大道公風，媽祖婆雨，這是天氣預報講的！", tailo: "Tāi-tō-kong hong, Má-tsóo-pô hōo, tse sī thinn-khì ī-pò kóng--ê!", huayu: "大道公的風，媽祖婆的雨，這是天氣預報說的！" } }
  ],
  D_PVQ_4_RIGHT: [
    { who: "pet", emotion: "開心", text: "答對了！這是民間傳說故事，不是天氣預報。" },
    { who: "temple_keeper", emotion: "開心", text: "對啦，這是民間的傳說。",
      taigi: { hanji: "著啦，這是民間的傳說。", tailo: "Tio̍h--lah, tse sī bîn-kan ê thuân-suat.", huayu: "對啦，這是民間的傳說。" } }
  ],
  D_PVQ_4_WRONG: [
    { who: "pet", emotion: "擔心", text: "再想想，神明的故事是天氣預報嗎？" }
  ],
  D_PVQ_5_ASK: [
    { who: "harbor_uncle", emotion: "開心", text: "阿伯故意說錯，你找找看哪裡錯了。",
      taigi: { hanji: "阿伯故意講毋著，你揣看覓佗位毋著。", tailo: "A-peh kòo-ì kóng m̄-tio̍h, lí tshuē khuànn-māi tó-uī m̄-tio̍h.", huayu: "阿伯故意說錯，你找找看哪裡錯了。" } },
    { who: "harbor_uncle", emotion: "開心", text: "九月的颱風沒人知道，所以九月都不會有颱風。",
      taigi: { hanji: "九月颱，無人知，所以九月攏袂有風颱。", tailo: "Káu-gue̍h thai, bô lâng tsai, sóo-í káu-gue̍h lóng bē ū hong-thai.", huayu: "九月的颱風沒人知道，所以九月都不會有颱風。" } }
  ],
  D_PVQ_5_RIGHT: [
    { who: "pet", emotion: "開心", text: "答對了！意思是很難事先看出來，不是不會來。" },
    { who: "harbor_uncle", emotion: "開心", text: "對啦，九月也會有颱風，要小心。",
      taigi: { hanji: "著啦，九月嘛會有風颱，愛細膩。", tailo: "Tio̍h--lah, káu-gue̍h mā ē ū hong-thai, ài sè-jī.", huayu: "對啦，九月也會有颱風，要小心。" } }
  ],
  D_PVQ_5_WRONG: [
    { who: "pet", emotion: "擔心", text: "再想想，「沒人知道」是不會來，還是很難看出來？" }
  ],

  // ═════════════ v1.4 桃竹章（63 號 4.3 節；劇本語音組草稿 wip_v14_draft/dialogs_taoyuan.js，v14_apply.js 每次重跑都整段重建）BEGIN ═════════════
  D_EXIT_LOCK_CH3: [
    { who: "pet", emotion: "平靜", text: "要先完成台北章，才能走這條路喔！" },
    { who: "pet", emotion: "平靜", text: "先回金包里，把數學燈點亮吧！" }
  ],
  D_SIGN_MIAOLI: [
    { who: "pet", emotion: "平靜", text: "往苗栗的路，要等之後開放才能走。" }
  ],
  D_CH4_END: [
    { who: "narrator", emotion: "開心", text: "桃園・新竹完成！" },
    { who: "pet", emotion: "開心", text: "拿到北之曙光碎片了！還有三片在別的地方。" }
  ],
  D_TY_JOB_HINT: [
    { who: "narrator", emotion: "平靜", text: "要轉職的話，可以搭車去慈護宮、行天宮或指南宮。" }
  ],
  D_TY_1A: [
    { who: "reservoir_keeper", emotion: "開心", text: "歡迎來水庫！這裡把大漢溪的水擋起來。", taigi: { hanji: "歡迎來水庫！遮共大漢溪的水擋起來。", tailo: "Huan-gîng lâi tsuí-khòo! Tsia kā Tāi-hàn-khe ê tsuí tòng khí-lâi.", huayu: "歡迎來水庫！這裡把大漢溪的水擋起來。" } },
    { who: "pet", emotion: "開心", text: "這裡是石門水庫，1964 年蓋好的喔！" },
    { who: "reservoir_keeper", emotion: "平靜", text: "水庫能讓大家用水，還能發電、防大水。", taigi: { hanji: "水庫會使予逐家用水，閣會使發電、防大水。", tailo: "Tsuí-khòo ē-sái hōo ta̍k-ke īng tsuí, koh ē-sái huat-tiān, hông tuā-tsuí.", huayu: "水庫能讓大家用水，還能發電、防大水。" } },
    { who: "reservoir_keeper", emotion: "擔心", text: "霧讓我忘了水的變化，幫我想 3 題好嗎？", taigi: { hanji: "霧予我袂記得水的變化，共我想三題，好無？", tailo: "Bū hōo guá bē-kì-tit tsuí ê piàn-huà, kā guá siūnn sann tê, hó--bô?", huayu: "霧讓我忘了水的變化，幫我想 3 題好嗎？" } }
  ],
  D_TY_1B: [
    { who: "reservoir_keeper", emotion: "開心", text: "想起來了！謝謝你幫忙。", taigi: { hanji: "想起來矣！多謝你鬥相共。", tailo: "Siūnn khí-lâi--ah! To-siā lí tàu-sann-kāng.", huayu: "想起來了！謝謝你幫忙。" } },
    { who: "reservoir_keeper", emotion: "開心", text: "這些金幣送你，謝謝你！", taigi: { hanji: "這寡金幣送你，多謝你！", tailo: "Tsit-kuá kim-pè sàng lí, to-siā--lí!", huayu: "這些金幣送你，謝謝你！" } }
  ],
  D_TY_2A: [
    { who: "reservoir_keeper", emotion: "平靜", text: "這裡的水，要送到桃園、新北市和新竹的湖口。", taigi: { hanji: "遮的水，愛送去桃園、新北市佮新竹的湖口。", tailo: "Tsia ê tsuí, ài sàng khì Thô-hn̂g, Sin-pak-tshī kah Sin-tik ê Ôo-kháu.", huayu: "這裡的水，要送到桃園、新北市和新竹的湖口。" } },
    { who: "reservoir_keeper", emotion: "擔心", text: "霧讓我算不清楚水量，幫我算 3 題好嗎？", taigi: { hanji: "霧予我算袂清楚水量，共我算三題，好無？", tailo: "Bū hōo guá sǹg bē tshing-tshó tsuí-liōng, kā guá sǹg sann tê, hó--bô?", huayu: "霧讓我算不清楚水量，幫我算 3 題好嗎？" } }
  ],
  D_TY_2B: [
    { who: "reservoir_keeper", emotion: "開心", text: "算好了！水量剛剛好。", taigi: { hanji: "算好矣！水量拄仔好。", tailo: "Sǹg hó--ah! Tsuí-liōng tú-á-hó.", huayu: "算好了！水量剛剛好。" } },
    { who: "reservoir_keeper", emotion: "開心", text: "這些金幣送你，謝謝你！", taigi: { hanji: "這寡金幣送你，多謝你！", tailo: "Tsit-kuá kim-pè sàng lí, to-siā--lí!", huayu: "這些金幣送你，謝謝你！" } },
    { who: "reservoir_keeper", emotion: "擔心", text: "新竹的風亂吹，好像跟水庫的霧有關係。", taigi: { hanji: "新竹的風亂吹，敢若佮水庫的霧有關係。", tailo: "Sin-tik ê hong luān tshue, kánn-ná kah tsuí-khòo ê bū ū kuan-hē.", huayu: "新竹的風亂吹，好像跟水庫的霧有關係。" } },
    { who: "pet", emotion: "平靜", text: "往西南走，就會到新竹！" }
  ],
  D_TY_5_LOCK: [
    { who: "reservoir_keeper", emotion: "平靜", text: "先去新竹幫米粉師傅，再來找我。", taigi: { hanji: "先去新竹共米粉師傅鬥相共，才閣來揣我。", tailo: "Sing khì Sin-tik kā bí-hún sai-hū tàu-sann-kāng, tsiah-koh lâi tshuē guá.", huayu: "先去新竹幫米粉師傅，再來找我。" } },
    { who: "pet", emotion: "平靜", text: "新竹的米粉師傅，好像需要幫忙！" }
  ],
  D_TY_5A: [
    { who: "reservoir_keeper", emotion: "擔心", text: "壩頂有一隻機器將軍，把水門關起來了！", taigi: { hanji: "壩頂有一隻機器將軍，共水門關起來矣！", tailo: "Pà-tíng ū tsi̍t tsiah ki-khì tsiong-kun, kā tsuí-mn̂g kuainn khí-lâi--ah!", huayu: "壩頂有一隻機器將軍，把水門關起來了！" } },
    { who: "reservoir_keeper", emotion: "平靜", text: "這座壩是用土和石頭堆的，很堅固。", taigi: { hanji: "這座壩是用塗佮石頭疊的，真勇。", tailo: "Tsit tsō pà sī īng thôo kah tsio̍h-thâu tha̍h--ê, tsin ióng.", huayu: "這座壩是用土和石頭堆的，很堅固。" } },
    { who: "reservoir_keeper", emotion: "平靜", text: "去壩頂讓它清醒，把水門打開！", taigi: { hanji: "去壩頂予伊清醒，共水門開開！", tailo: "Khì pà-tíng hōo i tshing-tshínn, kā tsuí-mn̂g khui--khui!", huayu: "去壩頂讓它清醒，把水門打開！" } },
    { who: "pet", emotion: "驚訝", text: "要小心，那是北邊的霧將！" }
  ],
  D_TY_5B: [
    { who: "reservoir_keeper", emotion: "開心", text: "水門打開了！謝謝你，勇者！", taigi: { hanji: "水門開開矣！多謝你，勇者！", tailo: "Tsuí-mn̂g khui--khui--ah! To-siā lí, ióng-tsiá!", huayu: "水門打開了！謝謝你，勇者！" } },
    { who: "reservoir_keeper", emotion: "開心", text: "這些金幣送你，謝謝你！", taigi: { hanji: "這寡金幣送你，多謝你！", tailo: "Tsit-kuá kim-pè sàng lí, to-siā--lí!", huayu: "這些金幣送你，謝謝你！" } }
  ],
  D_BOSS_FLOODGATE_A: [
    { who: "mb_floodgate", emotion: "生氣", text: "喀啦喀啦……水門關上！誰也別想過去！" },
    { who: "pet", emotion: "驚訝", text: "是霧閘機將！答對題目，把它胸口的霧吹散！" }
  ],
  D_BOSS_FLOODGATE_B: [
    { who: "mb_floodgate", emotion: "平靜", text: "齒輪……不卡了。水門打開，讓清水流向田野吧。" }
  ],
  D_RESERVOIR_IDLE: [
    { who: "reservoir_keeper", emotion: "平靜", text: "水庫邊很危險，不要靠太近。", taigi: { hanji: "水庫邊仔真危險，毋通傷倚。", tailo: "Tsuí-khòo pinn--á tsin guî-hiám, m̄-thang siunn uá.", huayu: "水庫邊很危險，不要靠太近。" } }
  ],
  D_TY_3A: [
    { who: "tofu_shop", emotion: "開心", text: "歡迎來大溪老街！我們的豆干最有名。", taigi: { hanji: "歡迎來大溪的舊街！阮的豆干上出名。", tailo: "Huan-gîng lâi Tāi-khe ê kū-ke! Guán ê tāu-kuann siōng tshut-miâ.", huayu: "歡迎來大溪老街！我們的豆干最有名。" } },
    { who: "tofu_shop", emotion: "平靜", text: "現滷的豆干，是大家來老街一定要吃的。", taigi: { hanji: "現滷的豆干，逐家來舊街一定愛食。", tailo: "Hiān lóo ê tāu-kuann, ta̍k-ke lâi kū-ke it-tīng ài tsia̍h.", huayu: "現滷的豆干，是大家來老街一定要吃的。" } },
    { who: "tofu_shop", emotion: "擔心", text: "霧讓我把帳算錯了，幫我算 3 題好嗎？", taigi: { hanji: "霧予我共數算毋著矣，共我算三題，好無？", tailo: "Bū hōo guá kā siàu sǹg m̄-tio̍h--ah, kā guá sǹg sann tê, hó--bô?", huayu: "霧讓我把帳算錯了，幫我算 3 題好嗎？" } }
  ],
  D_TY_3B: [
    { who: "tofu_shop", emotion: "開心", text: "算對了！謝謝你。", taigi: { hanji: "算著矣！多謝你。", tailo: "Sǹg tio̍h--ah! To-siā--lí.", huayu: "算對了！謝謝你。" } },
    { who: "tofu_shop", emotion: "開心", text: "這些金幣送你，謝謝你！", taigi: { hanji: "這寡金幣送你，多謝你！", tailo: "Tsit-kuá kim-pè sàng lí, to-siā--lí!", huayu: "這些金幣送你，謝謝你！" } },
    { who: "tofu_shop", emotion: "開心", text: "這個點心送你，餓了就吃。", taigi: { hanji: "這个點心送你，枵就食。", tailo: "Tsit ê tiám-sim sàng lí, iau tō tsia̍h.", huayu: "這個點心送你，餓了就吃。" } }
  ],
  D_TOFU_IDLE: [
    { who: "tofu_shop", emotion: "開心", text: "豆干要趁熱吃，比較香。", taigi: { hanji: "豆干愛趁燒食，較芳。", tailo: "Tāu-kuann ài thàn sio tsia̍h, khah phang.", huayu: "豆干要趁熱吃，比較香。" } }
  ],
  D_TY_4A: [
    { who: "wood_artisan", emotion: "平靜", text: "我是做木工的，桌子椅子都是一刀一刀做的。", taigi: { hanji: "我是做木工的，桌仔椅仔攏是一刀一刀做的。", tailo: "Guá sī tsò ba̍k-kang--ê, toh-á í-á lóng sī tsi̍t to tsi̍t to tsò--ê.", huayu: "我是做木工的，桌子椅子都是一刀一刀做的。" } },
    { who: "wood_artisan", emotion: "平靜", text: "大溪有一間博物館，每個月都會教大家做木工。", taigi: { hanji: "大溪有一間博物館，逐個月攏會教人做木工。", tailo: "Tāi-khe ū tsi̍t king phok-bu̍t-kuán, ta̍k kò gue̍h lóng ē kà lâng tsò ba̍k-kang.", huayu: "大溪有一間博物館，每個月都會教大家做木工。" } },
    { who: "wood_artisan", emotion: "擔心", text: "霧讓我忘了做木工的工作，幫我想 2 題好嗎？", taigi: { hanji: "霧予我袂記得做木工的工課，共我想兩題，好無？", tailo: "Bū hōo guá bē-kì-tit tsò ba̍k-kang ê khang-khuè, kā guá siūnn nn̄g tê, hó--bô?", huayu: "霧讓我忘了做木工的工作，幫我想 2 題好嗎？" } }
  ],
  D_TY_4B: [
    { who: "wood_artisan", emotion: "開心", text: "對了！木頭要慢慢磨，才會漂亮。", taigi: { hanji: "著矣！柴頭愛沓沓仔磨，才會媠。", tailo: "Tio̍h--ah! Tshâ-thâu ài ta̍uh-ta̍uh-á buâ, tsiah ē suí.", huayu: "對了！木頭要慢慢磨，才會漂亮。" } },
    { who: "wood_artisan", emotion: "開心", text: "這些金幣送你，謝謝你！", taigi: { hanji: "這寡金幣送你，多謝你！", tailo: "Tsit-kuá kim-pè sàng lí, to-siā--lí!", huayu: "這些金幣送你，謝謝你！" } }
  ],
  D_WOOD_IDLE: [
    { who: "wood_artisan", emotion: "平靜", text: "做木工要小心，刀子不能亂玩。", taigi: { hanji: "做木工愛細膩，刀仔毋通亂耍。", tailo: "Tsò ba̍k-kang ài sè-jī, to-á m̄-thang luān sńg.", huayu: "做木工要小心，刀子不能亂玩。" } }
  ],
  D_INN_DAXI: [
    { who: "inn_daxi", emotion: "開心", text: "歡迎來大溪的老街旅店！好好休息喔。", taigi: { hanji: "歡迎來大溪的舊街旅社！好好仔歇睏喔。", tailo: "Huan-gîng lâi Tāi-khe ê kū-ke lí-siā! Hó-hó-á hioh-khùn--ooh.", huayu: "歡迎來大溪的老街旅店！好好休息喔。" } }
  ],
  D_INN_DAXI_NOCOIN: [
    { who: "inn_daxi", emotion: "擔心", text: "金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。", taigi: { hanji: "金幣無夠喔，金包里溫泉旅館會使免錢蹛，嘛會使去拍怪物趁金幣。", tailo: "Kim-pè bô-kàu--ooh, Kim-pau-lí un-tsuânn lí-kuán ē-sái bián-tsînn tuà, mā ē-sái khì phah kuài-bu̍t thàn kim-pè.", huayu: "金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。" } }
  ],
  D_HC_1_LOCK: [
    { who: "noodle_master", emotion: "平靜", text: "先去水庫幫管理員，再來找我。", taigi: { hanji: "先去水庫共管理員鬥相共，才閣來揣我。", tailo: "Sing khì tsuí-khòo kā kuán-lí-uân tàu-sann-kāng, tsiah-koh lâi tshuē guá.", huayu: "先去水庫幫管理員，再來找我。" } },
    { who: "pet", emotion: "平靜", text: "石門水庫的管理員，好像需要幫忙！" }
  ],
  D_HC_1A: [
    { who: "noodle_master", emotion: "開心", text: "歡迎來新竹！這裡風很大。", taigi: { hanji: "歡迎來新竹！遮的風真透。", tailo: "Huan-gîng lâi Sin-tik! Tsia ê hong tsin thàu.", huayu: "歡迎來新竹！這裡風很大。" } },
    { who: "pet", emotion: "平靜", text: "這裡叫「風城」，因為地形的關係，風特別大。" },
    { who: "noodle_master", emotion: "平靜", text: "新竹米粉好吃，就是靠這陣風。", taigi: { hanji: "新竹米粉好食，就是靠這陣風。", tailo: "Sin-tik bí-hún hó-tsia̍h, tō sī khò tsit tsūn hong.", huayu: "新竹米粉好吃，就是靠這陣風。" } },
    { who: "noodle_master", emotion: "平靜", text: "風強、雨少，米粉才曬得乾。", taigi: { hanji: "風透、雨少，米粉才曝會焦。", tailo: "Hong thàu, hōo tsió, bí-hún tsiah pha̍k ē ta.", huayu: "風強、雨少，米粉才曬得乾。" } },
    { who: "noodle_master", emotion: "擔心", text: "現在風亂吹，幫我想 3 題好嗎？", taigi: { hanji: "這馬風亂吹，共我想三題，好無？", tailo: "Tsit-má hong luān tshue, kā guá siūnn sann tê, hó--bô?", huayu: "現在風亂吹，幫我想 3 題好嗎？" } }
  ],
  D_HC_1B: [
    { who: "noodle_master", emotion: "開心", text: "想起來了！謝謝你幫忙。", taigi: { hanji: "想起來矣！多謝你鬥相共。", tailo: "Siūnn khí-lâi--ah! To-siā lí tàu-sann-kāng.", huayu: "想起來了！謝謝你幫忙。" } },
    { who: "noodle_master", emotion: "開心", text: "這些金幣送你，謝謝你！", taigi: { hanji: "這寡金幣送你，多謝你！", tailo: "Tsit-kuá kim-pè sàng lí, to-siā--lí!", huayu: "這些金幣送你，謝謝你！" } },
    { who: "noodle_master", emotion: "擔心", text: "可是外面的怪物，把風車葉片吹走了！", taigi: { hanji: "毋過外口的怪物，共風車葉仔吹走矣！", tailo: "M̄-koh guā-kháu ê kuài-bu̍t, kā hong-tshia hio̍h-á tshue tsáu--ah!", huayu: "可是外面的怪物，把風車葉片吹走了！" } }
  ],
  D_HC_2A: [
    { who: "noodle_master", emotion: "平靜", text: "讓怪物清醒，把 3 片風車葉片找回來。", taigi: { hanji: "予怪物清醒，共三片風車葉仔揣轉來。", tailo: "Hōo kuài-bu̍t tshing-tshínn, kā sann phìnn hong-tshia hio̍h-á tshuē tńg--lâi.", huayu: "讓怪物清醒，把 3 片風車葉片找回來。" } },
    { who: "pet", emotion: "平靜", text: "是咻咻風精！牠們在曬場外面的空地。" }
  ],
  D_HC_2B: [
    { who: "noodle_master", emotion: "開心", text: "風車又會轉了，謝謝你！", taigi: { hanji: "風車閣會踅矣，多謝你！", tailo: "Hong-tshia koh ē se̍h--ah, to-siā--lí!", huayu: "風車又會轉了，謝謝你！" } },
    { who: "noodle_master", emotion: "開心", text: "這些金幣和藥草送你。", taigi: { hanji: "這寡金幣佮藥草送你。", tailo: "Tsit-kuá kim-pè kah io̍h-tsháu sàng lí.", huayu: "這些金幣和藥草送你。" } },
    { who: "noodle_master", emotion: "擔心", text: "亂風是從水庫那邊吹來的！回去找管理員。", taigi: { hanji: "亂風是對水庫遐吹過來的！轉去揣管理員。", tailo: "Luān hong sī tuì tsuí-khòo hia tshue--kuè-lâi--ê! Tńg-khì tshuē kuán-lí-uân.", huayu: "亂風是從水庫那邊吹來的！回去找管理員。" } }
  ],
  D_NOODLE_IDLE: [
    { who: "noodle_master", emotion: "平靜", text: "十月到一月的風，最適合曬米粉。", taigi: { hanji: "十月到一月的風，上適合曝米粉。", tailo: "Tsa̍p-gue̍h kàu it-gue̍h ê hong, siōng sik-ha̍p pha̍k bí-hún.", huayu: "十月到一月的風，最適合曬米粉。" } }
  ],
  D_HC_3A: [
    { who: "hc_guide", emotion: "開心", text: "這座城門，以前是竹塹城的東門。", taigi: { hanji: "這座城門，以早是竹塹城的東門。", tailo: "Tsit tsō siânn-mn̂g, í-tsá sī Tik-tshàm-siânn ê Tang-mn̂g.", huayu: "這座城門，以前是竹塹城的東門。" } },
    { who: "pet", emotion: "開心", text: "它叫迎曦門，是竹塹城唯一留下來的城門喔！" },
    { who: "hc_guide", emotion: "平靜", text: "城門有兩層樓，下面是一條一條石頭疊的。", taigi: { hanji: "城門有兩層樓，下跤是一條一條石頭疊的。", tailo: "Siânn-mn̂g ū nn̄g tsân lâu, ē-kha sī tsi̍t tiâu tsi̍t tiâu tsio̍h-thâu tha̍h--ê.", huayu: "城門有兩層樓，下面是一條一條石頭疊的。" } },
    { who: "hc_guide", emotion: "平靜", text: "以前的城牆拆掉了，只留下這座東門。", taigi: { hanji: "以早的城牆拆掉矣，干焦留這座東門。", tailo: "Í-tsá ê siânn-tshiûnn thiah-tiāu--ah, kan-na lâu tsit tsō Tang-mn̂g.", huayu: "以前的城牆拆掉了，只留下這座東門。" } },
    { who: "hc_guide", emotion: "擔心", text: "霧讓我忘了城門的故事，幫我想 2 題好嗎？", taigi: { hanji: "霧予我袂記得城門的故事，共我想兩題，好無？", tailo: "Bū hōo guá bē-kì-tit siânn-mn̂g ê kòo-sū, kā guá siūnn nn̄g tê, hó--bô?", huayu: "霧讓我忘了城門的故事，幫我想 2 題好嗎？" } }
  ],
  D_HC_3B: [
    { who: "hc_guide", emotion: "開心", text: "你都答對了，聽得真認真！", taigi: { hanji: "你攏回答著矣，聽甲真認真！", tailo: "Lí lóng huê-tap tio̍h--ah, thiann kah tsin jīn-tsin!", huayu: "你都答對了，聽得真認真！" } },
    { who: "hc_guide", emotion: "開心", text: "這些金幣送你，謝謝你！", taigi: { hanji: "這寡金幣送你，多謝你！", tailo: "Tsit-kuá kim-pè sàng lí, to-siā--lí!", huayu: "這些金幣送你，謝謝你！" } }
  ],
  D_HCGUIDE_IDLE: [
    { who: "hc_guide", emotion: "平靜", text: "城門下面可以走過去，去看看吧。", taigi: { hanji: "城門下跤會使行過去，去看覓。", tailo: "Siânn-mn̂g ē-kha ē-sái kiânn--kuè-khì, khì khuànn-māi.", huayu: "城門下面可以走過去，去看看吧。" } }
  ],
  D_INN_HSINCHU: [
    { who: "inn_hsinchu", emotion: "開心", text: "歡迎來新竹！風很大，進來休息吧。", taigi: { hanji: "歡迎來新竹！風真透，入來歇睏。", tailo: "Huan-gîng lâi Sin-tik! Hong tsin thàu, ji̍p-lâi hioh-khùn.", huayu: "歡迎來新竹！風很大，進來休息吧。" } }
  ],
  D_INN_HSINCHU_NOCOIN: [
    { who: "inn_hsinchu", emotion: "擔心", text: "金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。", taigi: { hanji: "金幣無夠喔，金包里溫泉旅館會使免錢蹛，嘛會使去拍怪物趁金幣。", tailo: "Kim-pè bô-kàu--ooh, Kim-pau-lí un-tsuânn lí-kuán ē-sái bián-tsînn tuà, mā ē-sái khì phah kuài-bu̍t thàn kim-pè.", huayu: "金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。" } }
  ],
  // ═════════════ v1.4 桃竹章 END ═════════════

  // ═════════════ v2.0 中部（69 號 4.5、5.3 節；劇本語音組草稿 wip_v20_draft/dialogs_central.js，v20_apply.js 每次重跑都整段重建）BEGIN ═════════════
  D_EXIT_LOCK_TY: [
    { who: "pet", emotion: "平靜", text: "要先完成桃園新竹的冒險，才能走這條路喔！" },
    { who: "pet", emotion: "平靜", text: "先讓石門水庫的霧閘機將清醒，再往苗栗出發！" }
  ],
  D_EXIT_LOCK_ML: [
    { who: "pet", emotion: "平靜", text: "舊山線的火車頭還在亂跑，鐵道沿線都不安全。" },
    { who: "pet", emotion: "平靜", text: "先回苗栗幫老站長，讓火車頭清醒吧！" }
  ],
  D_SIGN_CHIAYI: [
    { who: "pet", emotion: "平靜", text: "往嘉義的路還在修，之後開放。" }
  ],
  D_INTER_OPEN: [
    { who: "narrator", emotion: "開心", text: "從現在起，在任何一間宮廟都可以挑戰中級職業了！" }
  ],
  D_CH5_END: [
    { who: "narrator", emotion: "開心", text: "中部完成！" },
    { who: "pet", emotion: "開心", text: "曙光碎片已經有兩片了，繼續加油！" }
  ],
  D_ML_1_LOCK: [
    { who: "old_stationmaster", emotion: "平靜", text: "先去北邊的水庫幫忙，再來找我。", taigi: { hanji: "先去北爿的水庫鬥相共，才閣來揣我。", tailo: "Sing khì pak-pîng ê tsuí-khòo tàu-sann-kāng, tsiah-koh lâi tshuē guá.", huayu: "先去北邊的水庫幫忙，再來找我。" } },
    { who: "pet", emotion: "平靜", text: "石門水庫的管理員，好像需要幫忙！" }
  ],
  D_ML_1A: [
    { who: "old_stationmaster", emotion: "開心", text: "歡迎來苗栗！這間用木頭蓋的車站是古蹟喔。", taigi: { hanji: "歡迎來苗栗！這間用柴起的車頭是古蹟喔。", tailo: "Huan-gîng lâi Biâu-li̍k! Tsit king īng tshâ khí ê tshia-thâu sī kóo-tsik--ooh.", huayu: "歡迎來苗栗！這間用木頭蓋的車站是古蹟喔。" } },
    { who: "pet", emotion: "開心", text: "這裡是勝興車站！" },
    { who: "old_stationmaster", emotion: "平靜", text: "這裡是西部鐵路最高的地方，有 402 公尺多高。", taigi: { hanji: "遮是西部鐵枝路上懸的所在，有四百空二公尺外懸。", tailo: "Tsia sī se-pōo thih-ki-lōo siōng kuân ê sóo-tsāi, ū sì-pah khòng jī kong-tshioh guā kuân.", huayu: "這裡是西部鐵路最高的地方，有 402 公尺多高。" } },
    { who: "old_stationmaster", emotion: "平靜", text: "舊山線最後一班車，民國 87 年就開走了。", taigi: { hanji: "舊山線上尾一班車，民國八十七年就開走矣。", tailo: "Kū Suann-suànn siōng-bué tsi̍t pan tshia, Bîn-kok peh-tsa̍p-tshit nî tō khui-tsáu--ah.", huayu: "舊山線最後一班車，民國 87 年就開走了。" } },
    { who: "old_stationmaster", emotion: "擔心", text: "現在有一台火車頭被霧弄迷糊，在舊鐵道上亂跑！", taigi: { hanji: "這馬有一台火車頭予霧舞甲霧嗄嗄，佇舊鐵枝路頂亂走！", tailo: "Tsit-má ū tsi̍t tâi hué-tshia-thâu hōo bū bú kah bū-sà-sà, tī kū thih-ki-lōo tíng luān tsáu!", huayu: "現在有一台火車頭被霧弄迷糊，在舊鐵道上亂跑！" } },
    { who: "old_stationmaster", emotion: "擔心", text: "霧讓我忘了舊山線的故事，幫我想 3 題好嗎？", taigi: { hanji: "霧予我袂記得舊山線的故事，共我想三題，好無？", tailo: "Bū hōo guá bē-kì-tit kū Suann-suànn ê kòo-sū, kā guá siūnn sann tê, hó--bô?", huayu: "霧讓我忘了舊山線的故事，幫我想 3 題好嗎？" } }
  ],
  D_ML_1B: [
    { who: "old_stationmaster", emotion: "開心", text: "想起來了！謝謝你幫忙。", taigi: { hanji: "想起來矣！多謝你鬥相共。", tailo: "Siūnn khí-lâi--ah! To-siā lí tàu-sann-kāng.", huayu: "想起來了！謝謝你幫忙。" } },
    { who: "old_stationmaster", emotion: "擔心", text: "糟了，火車頭的汽笛聲，把小山貓嚇跑了！", taigi: { hanji: "害矣，火車頭的水螺聲，共細隻山貓驚走矣！", tailo: "Hāi--ah, hué-tshia-thâu ê tsuí-lê-siann, kā sè-tsiah suann-niau kiann-tsáu--ah!", huayu: "糟了，火車頭的汽笛聲，把小山貓嚇跑了！" } },
    { who: "pet", emotion: "驚訝", text: "是石虎寶寶！我們快去找牠！" }
  ],
  D_STATIONMASTER_IDLE: [
    { who: "old_stationmaster", text: "這間車站蓋好，已經一百二十年了。", taigi: { hanji: "這間車頭起好，已經一百二十年矣。", tailo: "Tsit king tshia-thâu khí hó, í-king tsi̍t-pah jī-tsa̍p nî--ah.", huayu: "這間車站蓋好，已經一百二十年了。" } }
  ],
  D_ML_2_LOCK: [
    { who: "old_stationmaster", emotion: "擔心", text: "要一條很結實的繩子，才拉得住火車頭。", taigi: { hanji: "愛一條真勇的索仔，才拖會牢火車頭。", tailo: "Ài tsi̍t tiâu tsin ióng ê soh-á, tsiah thua ē tiâu hué-tshia-thâu.", huayu: "要一條很結實的繩子，才拉得住火車頭。" } },
    { who: "old_stationmaster", emotion: "平靜", text: "往南走到大甲，找會編草的阿伯吧。", taigi: { hanji: "向南爿行到大甲，揣會編草的阿伯。", tailo: "Ǹg lâm-pîng kiânn kàu Tāi-kah, tshuē ē pinn tsháu ê a-peh.", huayu: "往南走到大甲，找會編草的阿伯吧。" } }
  ],
  D_ML_2A: [
    { who: "old_stationmaster", emotion: "開心", text: "你把草繩帶回來了！", taigi: { hanji: "你共草索仔紮轉來矣！", tailo: "Lí kā tsháu-soh-á tsah tńg--lâi--ah!", huayu: "你把草繩帶回來了！" } },
    { who: "old_stationmaster", emotion: "平靜", text: "火車頭就在西邊的舊鐵道上。", taigi: { hanji: "火車頭就佇西爿的舊鐵枝路頂。", tailo: "Hué-tshia-thâu tō tī sai-pîng ê kū thih-ki-lōo tíng.", huayu: "火車頭就在西邊的舊鐵道上。" } },
    { who: "old_stationmaster", emotion: "平靜", text: "讓它清醒，把它拉回月台吧！", taigi: { hanji: "予伊清醒，共伊拖轉去月台！", tailo: "Hōo i tshing-tshínn, kā i thua tńg-khì gua̍t-tâi!", huayu: "讓它清醒，把它拉回月台吧！" } },
    { who: "pet", emotion: "平靜", text: "頭目戰不能逃跑，先去旅店休息吧！" }
  ],
  D_ML_2B: [
    { who: "old_stationmaster", emotion: "開心", text: "火車頭停回月台了！謝謝你！", taigi: { hanji: "火車頭停轉來月台矣！多謝你！", tailo: "Hué-tshia-thâu thîng tńg-lâi gua̍t-tâi--ah! To-siā--lí!", huayu: "火車頭停回月台了！謝謝你！" } },
    { who: "old_stationmaster", emotion: "平靜", text: "大甲南邊的路可以走了，往鹿港出發吧！", taigi: { hanji: "大甲南爿的路會使行矣，向鹿港出發！", tailo: "Tāi-kah lâm-pîng ê lōo ē-sái kiânn--ah, ǹg Lo̍k-káng tshut-huat!", huayu: "大甲南邊的路可以走了，往鹿港出發吧！" } }
  ],
  D_BOSS_TRAIN_A: [
    { who: "mb_train", emotion: "生氣", text: "嘟嘟！嘟嘟！月台在哪裡……我找不到！" },
    { who: "pet", emotion: "驚訝", text: "火車頭被霧弄迷糊了！答對社會和數學題叫醒它！" }
  ],
  D_BOSS_TRAIN_B: [
    { who: "mb_train", emotion: "平靜", text: "嘟……煙囪的霧散了。我想起月台在哪裡了。" }
  ],
  D_ML_3_LOCK: [
    { who: "conservation_guide", emotion: "平靜", text: "先去車站幫老站長，再來找我。", taigi: { hanji: "先去車頭共老站長鬥相共，才閣來揣我。", tailo: "Sing khì tshia-thâu kā lāu tsām-tiúnn tàu-sann-kāng, tsiah-koh lâi tshuē guá.", huayu: "先去車站幫老站長，再來找我。" } },
    { who: "pet", emotion: "平靜", text: "勝興車站的老站長，好像需要幫忙！" }
  ],
  D_ML_3A: [
    { who: "conservation_guide", emotion: "擔心", text: "小山貓跑進相思樹林了，我們一起找！", taigi: { hanji: "細隻山貓走入去相思仔林矣，咱做伙揣！", tailo: "Sè-tsiah suann-niau tsáu ji̍p-khì siunn-si-á nâ--ah, lán tsò-hué tshuē!", huayu: "小山貓跑進相思樹林了，我們一起找！" } },
    { who: "pet", emotion: "開心", text: "牠叫做石虎喔！" },
    { who: "conservation_guide", emotion: "平靜", text: "這種山貓已經很少了，是要保護的保育類動物。", taigi: { hanji: "這款山貓已經真少矣，是愛保護的保育類動物。", tailo: "Tsit khuán suann-niau í-king tsin tsió--ah, sī ài pó-hōo ê pó-io̍k luī tōng-bu̍t.", huayu: "這種山貓已經很少了，是要保護的保育類動物。" } },
    { who: "conservation_guide", emotion: "平靜", text: "苗栗、臺中和南投的淺山，是山貓主要的家。", taigi: { hanji: "苗栗、臺中佮南投的淺山，是山貓主要的厝。", tailo: "Biâu-li̍k, Tâi-tiong kah Lâm-tâu ê tshián-suann, sī suann-niau tsú-iàu ê tshù.", huayu: "苗栗、臺中和南投的淺山，是山貓主要的家。" } },
    { who: "conservation_guide", emotion: "擔心", text: "霧讓我忘了怎麼找動物，幫我想 3 題好嗎？", taigi: { hanji: "霧予我袂記得按怎揣動物，共我想三題，好無？", tailo: "Bū hōo guá bē-kì-tit án-tsuánn tshuē tōng-bu̍t, kā guá siūnn sann tê, hó--bô?", huayu: "霧讓我忘了怎麼找動物，幫我想 3 題好嗎？" } }
  ],
  D_CUB_FOUND: [
    { who: "narrator", emotion: "平靜", text: "石虎寶寶：「喵～」" },
    { who: "pet", emotion: "開心", text: "找到了！牠躲在相思樹下面。" },
    { who: "conservation_guide", emotion: "開心", text: "找到了！我們會把牠送回山裡。", taigi: { hanji: "揣著矣！阮會共伊送轉去山內。", tailo: "Tshuē--tio̍h--ah! Guán ē kā i sàng tńg-khì suann-lāi.", huayu: "找到了！我們會把牠送回山裡。" } }
  ],
  D_ML_3B: [
    { who: "conservation_guide", emotion: "開心", text: "謝謝你幫忙找到牠。", taigi: { hanji: "多謝你鬥相共揣著伊。", tailo: "To-siā lí tàu-sann-kāng tshuē--tio̍h i.", huayu: "謝謝你幫忙找到牠。" } },
    { who: "conservation_guide", emotion: "平靜", text: "老站長說，要一條結實的繩子才拉得住火車頭。", taigi: { hanji: "老站長講，愛一條真勇的索仔才拖會牢火車頭。", tailo: "Lāu tsām-tiúnn kóng, ài tsi̍t tiâu tsin ióng ê soh-á tsiah thua ē tiâu hué-tshia-thâu.", huayu: "老站長說，要一條結實的繩子才拉得住火車頭。" } },
    { who: "conservation_guide", emotion: "平靜", text: "大甲有人會編草繩，往南走到大甲吧。", taigi: { hanji: "大甲有人會編草索仔，向南爿行去大甲。", tailo: "Tāi-kah ū lâng ē pinn tsháu-soh-á, ǹg lâm-pîng kiânn khì Tāi-kah.", huayu: "大甲有人會編草繩，往南走到大甲吧。" } }
  ],
  D_CONSERV_IDLE: [
    { who: "conservation_guide", text: "淺山是指一千公尺以下的山區喔。", taigi: { hanji: "淺山就是一千公尺以下的山區喔。", tailo: "Tshián-suann tō-sī tsi̍t-tshing kong-tshioh í-hā ê suann-khu--ooh.", huayu: "淺山是指一千公尺以下的山區喔。" } }
  ],
  D_ML_4_LOCK: [
    { who: "wood_carver", emotion: "平靜", text: "先去車站幫老站長，再來找我。", taigi: { hanji: "先去車頭共老站長鬥相共，才閣來揣我。", tailo: "Sing khì tshia-thâu kā lāu tsām-tiúnn tàu-sann-kāng, tsiah-koh lâi tshuē guá.", huayu: "先去車站幫老站長，再來找我。" } },
    { who: "pet", emotion: "平靜", text: "勝興車站的老站長，好像需要幫忙！" }
  ],
  D_ML_4A: [
    { who: "wood_carver", emotion: "開心", text: "三義的木雕，一百多年前就開始了。", taigi: { hanji: "三義的木雕，一百外年前就開始矣。", tailo: "Sam-gī ê bo̍k-tiau, tsi̍t-pah guā nî tsîng tō khai-sí--ah.", huayu: "三義的木雕，一百多年前就開始了。" } },
    { who: "wood_carver", emotion: "平靜", text: "這裡還有全國唯一的木雕公立博物館喔。", taigi: { hanji: "遮閣有全國唯一的木雕公立博物館喔。", tailo: "Tsia koh ū tsuân-kok uî-it ê bo̍k-tiau kong-li̍p phok-bu̍t-kuán--ooh.", huayu: "這裡還有全國唯一的木雕公立博物館喔。" } },
    { who: "wood_carver", emotion: "擔心", text: "霧讓我量不準木頭，幫我算 2 題好嗎？", taigi: { hanji: "霧予我量袂準柴，共我算兩題，好無？", tailo: "Bū hōo guá niû bē tsún tshâ, kā guá sǹg nn̄g tê, hó--bô?", huayu: "霧讓我量不準木頭，幫我算 2 題好嗎？" } }
  ],
  D_ML_4B: [
    { who: "wood_carver", emotion: "開心", text: "量得剛剛好，謝謝你！", taigi: { hanji: "量甲拄仔好，多謝你！", tailo: "Niû kah tú-á-hó, to-siā--lí!", huayu: "量得剛剛好，謝謝你！" } },
    { who: "wood_carver", emotion: "開心", text: "送你 40 枚金幣，謝謝你！", taigi: { hanji: "送你四十个金幣，多謝你！", tailo: "Sàng lí sì-tsa̍p ê kim-pè, to-siā--lí!", huayu: "送你 40 枚金幣，謝謝你！" } }
  ],
  D_CARVER_IDLE: [
    { who: "wood_carver", text: "木雕要慢慢刻，不要急。", taigi: { hanji: "木雕愛慢慢仔刻，毋通急。", tailo: "Bo̍k-tiau ài bān-bān-á khik, m̄-thang kip.", huayu: "木雕要慢慢刻，不要急。" } }
  ],
  D_ML_5_LOCK: [
    { who: "berry_farmer", emotion: "平靜", text: "先去車站幫老站長，再來找我。", taigi: { hanji: "先去車頭共老站長鬥相共，才閣來揣我。", tailo: "Sing khì tshia-thâu kā lāu tsām-tiúnn tàu-sann-kāng, tsiah-koh lâi tshuē guá.", huayu: "先去車站幫老站長，再來找我。" } },
    { who: "pet", emotion: "平靜", text: "勝興車站的老站長，好像需要幫忙！" }
  ],
  D_ML_5A: [
    { who: "berry_farmer", emotion: "開心", text: "大湖是有名的草莓故鄉喔！", taigi: { hanji: "大湖是出名的草莓故鄉喔！", tailo: "Tāi-ôo sī tshut-miâ ê tsháu-m̂ kòo-hiong--ooh!", huayu: "大湖是有名的草莓故鄉喔！" } },
    { who: "berry_farmer", emotion: "平靜", text: "全臺灣的草莓，十顆裡有六顆是這裡種的。", taigi: { hanji: "全臺灣的草莓，十粒內底有六粒是遮種的。", tailo: "Tsuân Tâi-uân ê tsháu-m̂, tsa̍p lia̍p lāi-té ū la̍k lia̍p sī tsia tsìng--ê.", huayu: "全臺灣的草莓，十顆裡有六顆是這裡種的。" } },
    { who: "berry_farmer", emotion: "擔心", text: "霧讓我分不清楚，幫我算 3 題好嗎？", taigi: { hanji: "霧予我分袂清楚，共我算三題，好無？", tailo: "Bū hōo guá pun bē tshing-tshó, kā guá sǹg sann tê, hó--bô?", huayu: "霧讓我分不清楚，幫我算 3 題好嗎？" } }
  ],
  D_ML_5B: [
    { who: "berry_farmer", emotion: "開心", text: "分得剛剛好，謝謝你！", taigi: { hanji: "分甲拄仔好，多謝你！", tailo: "Pun kah tú-á-hó, to-siā--lí!", huayu: "分得剛剛好，謝謝你！" } },
    { who: "berry_farmer", emotion: "開心", text: "這個點心送你，餓了就吃。", taigi: { hanji: "這个點心送你，枵就食。", tailo: "Tsit ê tiám-sim sàng lí, iau tō tsia̍h.", huayu: "這個點心送你，餓了就吃。" } }
  ],
  D_BERRY_IDLE: [
    { who: "berry_farmer", text: "草莓要輕輕摘，才不會弄壞。", taigi: { hanji: "草莓愛輕輕仔挽，才袂舞歹。", tailo: "Tsháu-m̂ ài khin-khin-á bán, tsiah bē bú pháinn.", huayu: "草莓要輕輕摘，才不會弄壞。" } }
  ],
  D_INN_SANYI: [
    { who: "inn_sanyi", emotion: "開心", text: "歡迎來我們的民宿！好好休息喔。", taigi: { hanji: "歡迎來阮的民宿！好好仔歇睏喔。", tailo: "Huan-gîng lâi guán ê bîn-sok! Hó-hó-á hioh-khùn--ooh.", huayu: "歡迎來我們的民宿！好好休息喔。" } }
  ],
  D_INN_SANYI_NOCOIN: [
    { who: "inn_sanyi", emotion: "擔心", text: "金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。", taigi: { hanji: "金幣無夠喔，金包里溫泉旅館會使免錢蹛，嘛會使去拍怪物趁金幣。", tailo: "Kim-pè bô-kàu--ooh, Kim-pau-lí un-tsuânn lí-kuán ē-sái bián-tsînn tuà, mā ē-sái khì phah kuài-bu̍t thàn kim-pè.", huayu: "金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。" } }
  ],
  D_DJ_1_LOCK: [
    { who: "rush_weaver", emotion: "平靜", text: "先去苗栗幫保育志工，再來找我。", taigi: { hanji: "先去苗栗共保育的志工鬥相共，才閣來揣我。", tailo: "Sing khì Biâu-li̍k kā pó-io̍k ê tsì-kang tàu-sann-kāng, tsiah-koh lâi tshuē guá.", huayu: "先去苗栗幫保育志工，再來找我。" } },
    { who: "pet", emotion: "平靜", text: "苗栗的保育志工，好像需要幫忙！" }
  ],
  D_DJ_1A: [
    { who: "rush_weaver", emotion: "開心", text: "我是跟我媽媽學會編草帽的。", taigi: { hanji: "我是綴阮阿母學編草帽仔的。", tailo: "Guá sī tuè guán a-bú o̍h pinn tsháu-bō-á--ê.", huayu: "我是跟我媽媽學會編草帽的。" } },
    { who: "rush_weaver", emotion: "平靜", text: "以前大甲的婦女，就用這種草編帽子。", taigi: { hanji: "古早大甲的查某人，就用這款草編帽仔。", tailo: "Kóo-tsá Tāi-kah ê tsa-bóo-lâng, tō īng tsit khuán tsháu pinn bō-á.", huayu: "以前大甲的婦女，就用這種草編帽子。" } },
    { who: "rush_weaver", emotion: "擔心", text: "霧讓我算不清楚要編幾頂，幫我算 3 題好嗎？", taigi: { hanji: "霧予我算袂清楚愛編幾頂，共我算三題，好無？", tailo: "Bū hōo guá sǹg bē tshing-tshó ài pinn kuí tíng, kā guá sǹg sann tê, hó--bô?", huayu: "霧讓我算不清楚要編幾頂，幫我算 3 題好嗎？" } }
  ],
  D_DJ_1B: [
    { who: "rush_weaver", emotion: "開心", text: "算得又快又對！謝謝喔！", taigi: { hanji: "算甲閣緊閣著！多謝喔！", tailo: "Sǹg kah koh kín koh tio̍h! To-siā--ooh!", huayu: "算得又快又對！謝謝喔！" } },
    { who: "rush_weaver", emotion: "平靜", text: "繩子的事，先聽我說大甲帽蓆的故事。", taigi: { hanji: "索仔的代誌，先聽我講大甲帽蓆的故事。", tailo: "Soh-á ê tāi-tsì, sing thiann guá kóng Tāi-kah bō-tshio̍h ê kòo-sū.", huayu: "繩子的事，先聽我說大甲帽蓆的故事。" } }
  ],
  D_DJ_2A: [
    { who: "rush_weaver", emotion: "平靜", text: "很久以前，有人用溪邊的野草編草蓆。", taigi: { hanji: "真久以前，有人用溪邊的野草編草蓆。", tailo: "Tsin kú í-tsîng, ū lâng īng khe-pinn ê iá-tsháu pinn tsháu-tshio̍h.", huayu: "很久以前，有人用溪邊的野草編草蓆。" } },
    { who: "rush_weaver", emotion: "平靜", text: "後來大家都寫上「大甲」，大甲帽蓆就出名了。", taigi: { hanji: "後來逐家攏寫「大甲」，大甲帽蓆就出名矣。", tailo: "Āu--lâi ta̍k-ke lóng siá “Tāi-kah”, Tāi-kah bō-tshio̍h tō tshut-miâ--ah.", huayu: "後來大家都寫上「大甲」，大甲帽蓆就出名了。" } },
    { who: "rush_weaver", emotion: "擔心", text: "霧讓我忘了這些故事，幫我想 2 題好嗎？", taigi: { hanji: "霧予我袂記得遮的故事，共我想兩題，好無？", tailo: "Bū hōo guá bē-kì-tit tsia ê kòo-sū, kā guá siūnn nn̄g tê, hó--bô?", huayu: "霧讓我忘了這些故事，幫我想 2 題好嗎？" } }
  ],
  D_DJ_2B: [
    { who: "rush_weaver", emotion: "開心", text: "這條草繩很結實，送給你！", taigi: { hanji: "這條草索仔真勇，送予你！", tailo: "Tsit tiâu tsháu-soh-á tsin ióng, sàng hōo lí!", huayu: "這條草繩很結實，送給你！" } },
    { who: "rush_weaver", emotion: "平靜", text: "帶回苗栗給老站長吧。", taigi: { hanji: "提轉去苗栗予老站長。", tailo: "The̍h tńg-khì Biâu-li̍k hōo lāu tsām-tiúnn.", huayu: "帶回苗栗給老站長吧。" } }
  ],
  D_WEAVER_IDLE: [
    { who: "rush_weaver", text: "草帽要慢慢編，才會又密又牢。", taigi: { hanji: "草帽仔愛慢慢仔編，才會閣密閣牢。", tailo: "Tsháu-bō-á ài bān-bān-á pinn, tsiah ē koh ba̍t koh tiâu.", huayu: "草帽要慢慢編，才會又密又牢。" } }
  ],
  D_TEMPLE_ZL_INTRO: [
    { who: "volunteer_zl", emotion: "平靜", text: "這裡是大甲鎮瀾宮，拜的是媽祖。", taigi: { hanji: "這是大甲鎮瀾宮，拜的是媽祖。", tailo: "Tse sī Tāi-kah Tìn-lân-kiong, pài--ê sī Má-tsóo.", huayu: "這裡是大甲鎮瀾宮，拜的是媽祖。" } },
    { who: "volunteer_zl", emotion: "平靜", text: "每年農曆三月，大甲媽祖會出門遶境。", taigi: { hanji: "每年農曆三月，大甲媽祖會出巡。", tailo: "Muí nî lông-li̍k sann--gue̍h, Tāi-kah Má-tsóo ē tshut-sûn.", huayu: "每年農曆三月，大甲媽祖會出門遶境。" } },
    { who: "volunteer_zl", emotion: "平靜", text: "要走九天八夜，三百多公里喔。", taigi: { hanji: "愛行九工八暝，三百外公里喔。", tailo: "Ài kiânn káu kang peh mê, sann-pah guā kong-lí--ooh.", huayu: "要走九天八夜，三百多公里喔。" } }
  ],
  D_DJ_3_LOCK: [
    { who: "pastry_shop", emotion: "平靜", text: "先去幫編草的阿伯，再來找我。", taigi: { hanji: "先去共編草的阿伯鬥相共，才閣來揣我。", tailo: "Sing khì kā pinn tsháu ê a-peh tàu-sann-kāng, tsiah-koh lâi tshuē guá.", huayu: "先去幫編草的阿伯，再來找我。" } },
    { who: "pet", emotion: "平靜", text: "藺草工坊的阿伯，好像需要幫忙！" }
  ],
  D_DJ_3A: [
    { who: "pastry_shop", emotion: "開心", text: "大甲的糕餅很有名喔！", taigi: { hanji: "大甲的糕仔餅真出名喔！", tailo: "Tāi-kah ê ko-á-piánn tsin tshut-miâ--ooh!", huayu: "大甲的糕餅很有名喔！" } },
    { who: "pet", emotion: "開心", text: "聽說大甲是奶油酥餅的故鄉！" },
    { who: "pastry_shop", emotion: "擔心", text: "霧讓我排不好烤餅的時間，幫我算 3 題好嗎？", taigi: { hanji: "霧予我排袂好烘餅的時間，共我算三題，好無？", tailo: "Bū hōo guá pâi bē hó hang piánn ê sî-kan, kā guá sǹg sann tê, hó--bô?", huayu: "霧讓我排不好烤餅的時間，幫我算 3 題好嗎？" } }
  ],
  D_DJ_3B: [
    { who: "pastry_shop", emotion: "開心", text: "排好了，謝謝你！", taigi: { hanji: "排好矣，多謝你！", tailo: "Pâi hó--ah, to-siā--lí!", huayu: "排好了，謝謝你！" } },
    { who: "pastry_shop", emotion: "開心", text: "送你 40 枚金幣，謝謝你！", taigi: { hanji: "送你四十个金幣，多謝你！", tailo: "Sàng lí sì-tsa̍p ê kim-pè, to-siā--lí!", huayu: "送你 40 枚金幣，謝謝你！" } }
  ],
  D_PASTRY_IDLE: [
    { who: "pastry_shop", text: "剛烤好的餅，香噴噴的喔。", taigi: { hanji: "拄烘好的餅，芳貢貢喔。", tailo: "Tú hang hó ê piánn, phang-kòng-kòng--ooh.", huayu: "剛烤好的餅，香噴噴的喔。" } }
  ],
  D_INN_DAJIA: [
    { who: "inn_dajia", emotion: "開心", text: "歡迎來我們的旅店！好好休息喔。", taigi: { hanji: "歡迎來阮的旅社！好好仔歇睏喔。", tailo: "Huan-gîng lâi guán ê lí-siā! Hó-hó-á hioh-khùn--ooh.", huayu: "歡迎來我們的旅店！好好休息喔。" } }
  ],
  D_INN_DAJIA_NOCOIN: [
    { who: "inn_dajia", emotion: "擔心", text: "金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。", taigi: { hanji: "金幣無夠喔，金包里溫泉旅館會使免錢蹛，嘛會使去拍怪物趁金幣。", tailo: "Kim-pè bô-kàu--ooh, Kim-pau-lí un-tsuânn lí-kuán ē-sái bián-tsînn tuà, mā ē-sái khì phah kuài-bu̍t thàn kim-pè.", huayu: "金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。" } }
  ],
  D_LK_1_LOCK: [
    { who: "lk_guide", emotion: "平靜", text: "先去苗栗幫老站長，再來找我。", taigi: { hanji: "先去苗栗共老站長鬥相共，才閣來揣我。", tailo: "Sing khì Biâu-li̍k kā lāu tsām-tiúnn tàu-sann-kāng, tsiah-koh lâi tshuē guá.", huayu: "先去苗栗幫老站長，再來找我。" } },
    { who: "pet", emotion: "平靜", text: "舊山線的火車頭還在亂跑！" }
  ],
  D_LK_1A: [
    { who: "lk_guide", emotion: "開心", text: "歡迎來到鹿港！", taigi: { hanji: "歡迎來鹿港！", tailo: "Huan-gîng lâi Lo̍k-káng!", huayu: "歡迎來到鹿港！" } },
    { who: "pet", emotion: "開心", text: "我知道一句話：「一府二鹿三艋舺」！" },
    { who: "lk_guide", emotion: "平靜", text: "這句話說，鹿港是臺灣歷史文化很重要的地方。", taigi: { hanji: "這句話講，鹿港是臺灣歷史文化真重要的所在。", tailo: "Tsit kù uē kóng, Lo̍k-káng sī Tâi-uân li̍k-sú bûn-huà tsin tiōng-iàu ê sóo-tsāi.", huayu: "這句話說，鹿港是臺灣歷史文化很重要的地方。" } },
    { who: "lk_guide", emotion: "平靜", text: "這裡還留著很古老的街道喔。", taigi: { hanji: "遮閣留真古早的街路喔。", tailo: "Tsia koh lâu tsin kóo-tsá ê ke-lōo--ooh.", huayu: "這裡還留著很古老的街道喔。" } },
    { who: "lk_guide", emotion: "擔心", text: "霧讓我忘了怎麼介紹，幫我想 3 題好嗎？", taigi: { hanji: "霧予我袂記得按怎紹介，共我想三題，好無？", tailo: "Bū hōo guá bē-kì-tit án-tsuánn siāu-kài, kā guá siūnn sann tê, hó--bô?", huayu: "霧讓我忘了怎麼介紹，幫我想 3 題好嗎？" } }
  ],
  D_LK_1B: [
    { who: "lk_guide", emotion: "開心", text: "你都答對了，聽得真認真！", taigi: { hanji: "你攏回答著矣，聽甲真認真！", tailo: "Lí lóng huê-tap tio̍h--ah, thiann kah tsin jīn-tsin!", huayu: "你都答對了，聽得真認真！" } },
    { who: "lk_guide", emotion: "擔心", text: "傘店老闆說，窄巷裡有紙傘在跳！", taigi: { hanji: "傘店頭家講，狹巷仔內有紙傘咧跳！", tailo: "Suànn-tiàm thâu-ke kóng, e̍h hāng-á lāi ū tsuá-suànn teh thiàu!", huayu: "傘店老闆說，窄巷裡有紙傘在跳！" } }
  ],
  D_LKGUIDE_IDLE: [
    { who: "lk_guide", text: "鹿港成為商港，已經快三百年了。", taigi: { hanji: "鹿港做商港，已經欲三百年矣。", tailo: "Lo̍k-káng tsò siong-káng, í-king beh sann-pah nî--ah.", huayu: "鹿港成為商港，已經快三百年了。" } }
  ],
  D_LK_2_LOCK: [
    { who: "umbrella_shop", emotion: "平靜", text: "先去聽導覽員介紹老街，再來找我。", taigi: { hanji: "先去聽導覽員紹介舊街，才閣來揣我。", tailo: "Sing khì thiann tō-lám-uân siāu-kài Kū-ke, tsiah-koh lâi tshuē guá.", huayu: "先去聽導覽員介紹老街，再來找我。" } },
    { who: "pet", emotion: "平靜", text: "老街的導覽員，好像需要幫忙！" }
  ],
  D_LK_2A: [
    { who: "umbrella_shop", emotion: "擔心", text: "窄巷裡的紙傘怪物，被霧弄迷糊了。", taigi: { hanji: "狹巷仔內的紙傘怪物，予霧舞甲霧嗄嗄。", tailo: "E̍h hāng-á lāi ê tsuá-suànn kuài-bu̍t, hōo bū bú kah bū-sà-sà.", huayu: "窄巷裡的紙傘怪物，被霧弄迷糊了。" } },
    { who: "umbrella_shop", emotion: "平靜", text: "讓怪物清醒，把 3 根傘骨找回來。", taigi: { hanji: "予怪物清醒，共三支傘骨揣轉來。", tailo: "Hōo kuài-bu̍t tshing-tshínn, kā sann ki suànn-kut tshuē tńg--lâi.", huayu: "讓怪物清醒，把 3 根傘骨找回來。" } },
    { who: "pet", emotion: "驚訝", text: "是傘傘紙傘妖！讓牠們清醒，就會掉傘骨。" }
  ],
  D_LK_2B: [
    { who: "umbrella_shop", emotion: "開心", text: "傘骨都找回來了，謝謝你！", taigi: { hanji: "傘骨攏揣轉來矣，多謝你！", tailo: "Suànn-kut lóng tshuē tńg--lâi--ah, to-siā--lí!", huayu: "傘骨都找回來了，謝謝你！" } },
    { who: "umbrella_shop", emotion: "開心", text: "這些金幣和藥草送你。", taigi: { hanji: "這寡金幣佮藥草送你。", tailo: "Tsit-kuá kim-pè kah io̍h-tsháu sàng lí.", huayu: "這些金幣和藥草送你。" } },
    { who: "umbrella_shop", emotion: "擔心", text: "這些怪物，好像是被霧從山上吹下來的。", taigi: { hanji: "這寡怪物，敢若是予霧對山頂歕落來的。", tailo: "Tsit-kuá kuài-bu̍t, kánn-ná sī hōo bū tuì suann-tíng pûn lo̍h--lâi--ê.", huayu: "這些怪物，好像是被霧從山上吹下來的。" } }
  ],
  D_UMBRELLA_IDLE: [
    { who: "umbrella_shop", text: "紙傘要放在乾的地方喔。", taigi: { hanji: "紙傘愛囥佇焦的所在喔。", tailo: "Tsuá-suànn ài khǹg tī ta ê sóo-tsāi--ooh.", huayu: "紙傘要放在乾的地方喔。" } }
  ],
  D_TEMPLE_LK_INTRO: [
    { who: "volunteer_lk", emotion: "平靜", text: "這裡是鹿港天后宮，大家也叫它「媽祖宮」。", taigi: { hanji: "這是鹿港天后宮，逐家嘛叫伊「媽祖宮」。", tailo: "Tse sī Lo̍k-káng Thian-hiō-kiong, ta̍k-ke mā kiò i “Má-tsóo-kiong”.", huayu: "這裡是鹿港天后宮，大家也叫它「媽祖宮」。" } },
    { who: "volunteer_lk", emotion: "平靜", text: "廟裡主要拜的是開基二媽。", taigi: { hanji: "廟內主要拜開基二媽。", tailo: "Biō lāi tsú-iàu pài khai-ki Jī-má.", huayu: "廟裡主要拜的是開基二媽。" } },
    { who: "volunteer_lk", emotion: "平靜", text: "屋簷下密密交錯的木頭，很特別喔。", taigi: { hanji: "簾簷跤密密的柴，真特別喔。", tailo: "Nî-tsînn kha ba̍t-ba̍t ê tshâ, tsin ti̍k-pia̍t--ooh.", huayu: "屋簷下密密交錯的木頭，很特別喔。" } },
    { who: "pet", emotion: "開心", text: "那叫做「網目斗栱」！" },
    { who: "volunteer_lk", emotion: "平靜", text: "這間廟九十多年前重新蓋好。", taigi: { hanji: "這間廟九十外年前重新起好。", tailo: "Tsit king biō káu-tsa̍p guā nî tsîng tiông-sin khí hó.", huayu: "這間廟九十多年前重新蓋好。" } }
  ],
  D_LK_3_LOCK: [
    { who: "pastry_lk", emotion: "平靜", text: "先去聽導覽員介紹老街，再來找我。", taigi: { hanji: "先去聽導覽員紹介舊街，才閣來揣我。", tailo: "Sing khì thiann tō-lám-uân siāu-kài Kū-ke, tsiah-koh lâi tshuē guá.", huayu: "先去聽導覽員介紹老街，再來找我。" } },
    { who: "pet", emotion: "平靜", text: "老街的導覽員，好像需要幫忙！" }
  ],
  D_LK_3A: [
    { who: "pastry_lk", emotion: "擔心", text: "老街來了很多外國遊客，我不會說英語。", taigi: { hanji: "舊街仔來足濟外國遊客，我袂曉講英語。", tailo: "Kū-ke-á lâi tsiok tsē guā-kok iû-kheh, guá bē-hiáu kóng Ing-gí.", huayu: "老街來了很多外國遊客，我不會說英語。" } },
    { who: "pastry_lk", emotion: "平靜", text: "幫我用英語打招呼，答對 3 題好嗎？", taigi: { hanji: "共我用英語相借問，回答著三題，好無？", tailo: "Kā guá īng Ing-gí sio-tsioh-mn̄g, huê-tap tio̍h sann tê, hó--bô?", huayu: "幫我用英語打招呼，答對 3 題好嗎？" } }
  ],
  D_LK_3B: [
    { who: "pastry_lk", emotion: "開心", text: "你說得真好，謝謝你！", taigi: { hanji: "你講甲真好，多謝你！", tailo: "Lí kóng kah tsin hó, to-siā--lí!", huayu: "你說得真好，謝謝你！" } },
    { who: "pastry_lk", emotion: "開心", text: "送你 50 枚金幣，謝謝你！", taigi: { hanji: "送你五十个金幣，多謝你！", tailo: "Sàng lí gōo-tsa̍p ê kim-pè, to-siā--lí!", huayu: "送你 50 枚金幣，謝謝你！" } }
  ],
  D_PASTRYLK_IDLE: [
    { who: "pastry_lk", text: "牛舌餅外皮酥酥的，裡面軟軟的。", taigi: { hanji: "牛舌餅外殼酥酥，內底軟軟。", tailo: "Gû-tsi̍h-piánn guā-khak soo-soo, lāi-té nuí-nuí.", huayu: "牛舌餅外皮酥酥的，裡面軟軟的。" } }
  ],
  D_INN_LUKANG: [
    { who: "inn_lukang", emotion: "開心", text: "歡迎來老街的客棧！好好休息喔。", taigi: { hanji: "歡迎來舊街的客棧！好好仔歇睏喔。", tailo: "Huan-gîng lâi Kū-ke ê kheh-tsàn! Hó-hó-á hioh-khùn--ooh.", huayu: "歡迎來老街的客棧！好好休息喔。" } }
  ],
  D_INN_LUKANG_NOCOIN: [
    { who: "inn_lukang", emotion: "擔心", text: "金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。", taigi: { hanji: "金幣無夠喔，金包里溫泉旅館會使免錢蹛，嘛會使去拍怪物趁金幣。", tailo: "Kim-pè bô-kàu--ooh, Kim-pau-lí un-tsuânn lí-kuán ē-sái bián-tsînn tuà, mā ē-sái khì phah kuài-bu̍t thàn kim-pè.", huayu: "金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。" } }
  ],
  D_BG_1_LOCK: [
    { who: "temple_elder", emotion: "平靜", text: "先去鹿港幫傘店老闆，再來找我。", taigi: { hanji: "先去鹿港共傘店頭家鬥相共，才閣來揣我。", tailo: "Sing khì Lo̍k-káng kā suànn-tiàm thâu-ke tàu-sann-kāng, tsiah-koh lâi tshuē guá.", huayu: "先去鹿港幫傘店老闆，再來找我。" } },
    { who: "pet", emotion: "平靜", text: "鹿港的傘店老闆，好像需要幫忙！" }
  ],
  D_BG_1A: [
    { who: "temple_elder", emotion: "開心", text: "歡迎來北港！北港以前叫做「笨港」。", taigi: { hanji: "歡迎來北港！北港古早叫做「笨港」。", tailo: "Huan-gîng lâi Pak-káng! Pak-káng kóo-tsá kiò-tsò “Pùn-káng”.", huayu: "歡迎來北港！北港以前叫做「笨港」。" } },
    { who: "temple_elder", emotion: "平靜", text: "很久以前，有人帶著媽祖神像，從笨港上岸。", taigi: { hanji: "真久以前，有人紮媽祖的神像，對笨港上岸。", tailo: "Tsin kú í-tsîng, ū lâng tsah Má-tsóo ê sîn-siōng, tuì Pùn-káng tsiūnn-huānn.", huayu: "很久以前，有人帶著媽祖神像，從笨港上岸。" } },
    { who: "temple_elder", emotion: "擔心", text: "霧讓我忘了北港的故事，幫我想 2 題好嗎？", taigi: { hanji: "霧予我袂記得北港的故事，共我想兩題，好無？", tailo: "Bū hōo guá bē-kì-tit Pak-káng ê kòo-sū, kā guá siūnn nn̄g tê, hó--bô?", huayu: "霧讓我忘了北港的故事，幫我想 2 題好嗎？" } }
  ],
  D_BG_1B: [
    { who: "temple_elder", emotion: "開心", text: "你都答對了，聽得真認真！", taigi: { hanji: "你攏回答著矣，聽甲真認真！", tailo: "Lí lóng huê-tap tio̍h--ah, thiann kah tsin jīn-tsin!", huayu: "你都答對了，聽得真認真！" } },
    { who: "temple_elder", emotion: "平靜", text: "做花車的師傅和雜貨店老闆，都在找人幫忙。", taigi: { hanji: "做花車的師傅佮雜貨仔店的頭家，攏咧揣人鬥相共。", tailo: "Tsò hue-tshia ê sai-hū kah tsa̍p-huè-á-tiàm ê thâu-ke, lóng teh tshuē lâng tàu-sann-kāng.", huayu: "做花車的師傅和雜貨店老闆，都在找人幫忙。" } }
  ],
  D_ELDER_BG_IDLE: [
    { who: "temple_elder", text: "迎媽祖的時候，大家說是北港人的第二次過年。", taigi: { hanji: "迎媽祖的時陣，人講是北港人的第二擺過年。", tailo: "Ngiâ Má-tsóo ê sî-tsūn, lâng kóng sī Pak-káng-lâng ê tē-jī pái kuè-nî.", huayu: "迎媽祖的時候，大家說是北港人的第二次過年。" } }
  ],
  D_BG_2_LOCK: [
    { who: "float_master", emotion: "平靜", text: "先去廟口找阿伯聊聊，再來找我。", taigi: { hanji: "先去廟埕揣阿伯開講，才閣來揣我。", tailo: "Sing khì biō-tiânn tshuē a-peh khai-káng, tsiah-koh lâi tshuē guá.", huayu: "先去廟口找阿伯聊聊，再來找我。" } },
    { who: "pet", emotion: "平靜", text: "朝天宮廟口的阿伯，好像需要幫忙！" }
  ],
  D_BG_2A: [
    { who: "float_master", emotion: "擔心", text: "花車上的燈籠，被霧吹得亂七八糟。", taigi: { hanji: "花車頂的鼓仔燈，予霧歕甲亂操操。", tailo: "Hue-tshia tíng ê kóo-á-ting, hōo bū pûn kah luān-tshau-tshau.", huayu: "花車上的燈籠，被霧吹得亂七八糟。" } },
    { who: "float_master", emotion: "平靜", text: "幫我寫祝福卡，答對 3 題好嗎？", taigi: { hanji: "共我寫祝福卡片，回答著三題，好無？", tailo: "Kā guá siá tsiok-hok khah-phìnn, huê-tap tio̍h sann tê, hó--bô?", huayu: "幫我寫祝福卡，答對 3 題好嗎？" } }
  ],
  D_BG_2B: [
    { who: "float_master", emotion: "開心", text: "祝福卡寫好了，真漂亮！", taigi: { hanji: "祝福卡片寫好矣，真媠！", tailo: "Tsiok-hok khah-phìnn siá hó--ah, tsin suí!", huayu: "祝福卡寫好了，真漂亮！" } },
    { who: "float_master", emotion: "開心", text: "送你 50 枚金幣，謝謝你！", taigi: { hanji: "送你五十个金幣，多謝你！", tailo: "Sàng lí gōo-tsa̍p ê kim-pè, to-siā--lí!", huayu: "送你 50 枚金幣，謝謝你！" } }
  ],
  D_BG_4_LOCK: [
    { who: "float_master", emotion: "平靜", text: "雜貨店和我這邊的事都做好，再來吧。", taigi: { hanji: "雜貨仔店佮我遮的代誌攏做好，才閣來。", tailo: "Tsa̍p-huè-á-tiàm kah guá tsia ê tāi-tsì lóng tsò hó, tsiah-koh lâi.", huayu: "雜貨店和我這邊的事都做好，再來吧。" } },
    { who: "pet", emotion: "平靜", text: "雜貨店老闆也需要幫忙喔！" }
  ],
  D_BG_4A: [
    { who: "float_master", emotion: "擔心", text: "堤防那邊有一個好大的燈籠，被霧弄迷糊了。", taigi: { hanji: "駁岸遐有一个真大的鼓仔燈，予霧舞甲霧嗄嗄。", tailo: "Poh-huānn hia ū tsi̍t ê tsin tuā ê kóo-á-ting, hōo bū bú kah bū-sà-sà.", huayu: "堤防那邊有一個好大的燈籠，被霧弄迷糊了。" } },
    { who: "float_master", emotion: "平靜", text: "你可以去讓它清醒嗎？要小心喔。", taigi: { hanji: "你會使去予伊清醒無？愛細膩喔。", tailo: "Lí ē-sái khì hōo i tshing-tshínn--bô? Ài sè-jī--ooh.", huayu: "你可以去讓它清醒嗎？要小心喔。" } },
    { who: "pet", emotion: "平靜", text: "頭目戰不能逃跑，先去旅店休息吧！" }
  ],
  D_BG_4B: [
    { who: "float_master", emotion: "開心", text: "燈籠又亮起來了！謝謝你！", taigi: { hanji: "鼓仔燈閣光起來矣！多謝你！", tailo: "Kóo-á-ting koh kng khí-lâi--ah! To-siā--lí!", huayu: "燈籠又亮起來了！謝謝你！" } },
    { who: "narrator", emotion: "開心", text: "你拿到了「中之曙光碎片」！" },
    { who: "pet", emotion: "平靜", text: "鬼怪們說，牠們的家在南投的森林。" }
  ],
  D_BOSS_LANTERN_A: [
    { who: "mb_lantern", emotion: "神祕", text: "燈籠裡都是霧……好暗……好暗……" },
    { who: "pet", emotion: "驚訝", text: "燈籠霧將被霧困住了！答對國語和自然題叫醒它！" }
  ],
  D_BOSS_LANTERN_B: [
    { who: "mb_lantern", emotion: "平靜", text: "霧散了……燈籠裡又有暖暖的光了。" }
  ],
  D_FLOAT_IDLE: [
    { who: "float_master", text: "花車要用很多燈籠和彩色的布。", taigi: { hanji: "花車愛用真濟鼓仔燈佮彩色的布。", tailo: "Hue-tshia ài īng tsin tsē kóo-á-ting kah tshái-sik ê pòo.", huayu: "花車要用很多燈籠和彩色的布。" } }
  ],
  D_BG_3_LOCK: [
    { who: "grocer_bg", emotion: "平靜", text: "先去廟口找阿伯聊聊，再來找我。", taigi: { hanji: "先去廟埕揣阿伯開講，才閣來揣我。", tailo: "Sing khì biō-tiânn tshuē a-peh khai-káng, tsiah-koh lâi tshuē guá.", huayu: "先去廟口找阿伯聊聊，再來找我。" } },
    { who: "pet", emotion: "平靜", text: "朝天宮廟口的阿伯，好像需要幫忙！" }
  ],
  D_BG_3A: [
    { who: "grocer_bg", emotion: "擔心", text: "存錢筒裡的錢，被霧弄得亂糟糟。", taigi: { hanji: "錢筒仔內的錢，予霧舞甲亂操操。", tailo: "Tsînn-tâng-á lāi ê tsînn, hōo bū bú kah luān-tshau-tshau.", huayu: "存錢筒裡的錢，被霧弄得亂糟糟。" } },
    { who: "grocer_bg", emotion: "平靜", text: "幫我想想錢要怎麼存、怎麼用，答對 3 題好嗎？", taigi: { hanji: "共我想錢愛按怎儉、按怎用，回答著三題，好無？", tailo: "Kā guá siūnn tsînn ài án-tsuánn khiām, án-tsuánn īng, huê-tap tio̍h sann tê, hó--bô?", huayu: "幫我想想錢要怎麼存、怎麼用，答對 3 題好嗎？" } }
  ],
  D_BG_3B: [
    { who: "grocer_bg", emotion: "開心", text: "錢整理好了，要好好珍惜喔。", taigi: { hanji: "錢整理好矣，愛好好仔珍惜喔。", tailo: "Tsînn tsíng-lí hó--ah, ài hó-hó-á tin-sioh--ooh.", huayu: "錢整理好了，要好好珍惜喔。" } },
    { who: "grocer_bg", emotion: "開心", text: "送你 50 枚金幣，謝謝你！", taigi: { hanji: "送你五十个金幣，多謝你！", tailo: "Sàng lí gōo-tsa̍p ê kim-pè, to-siā--lí!", huayu: "送你 50 枚金幣，謝謝你！" } }
  ],
  D_GROCER_IDLE: [
    { who: "grocer_bg", text: "北港的花生和麻油，都很有名喔。", taigi: { hanji: "北港的塗豆佮麻油，攏真出名喔。", tailo: "Pak-káng ê thôo-tāu kah muâ-iû, lóng tsin tshut-miâ--ooh.", huayu: "北港的花生和麻油，都很有名喔。" } }
  ],
  D_TEMPLE_CT_INTRO: [
    { who: "volunteer_ct", emotion: "平靜", text: "這裡是北港朝天宮，正殿拜的是媽祖。", taigi: { hanji: "這是北港朝天宮，正殿拜媽祖。", tailo: "Tse sī Pak-káng Tiâu-thian-kiong, tsiànn-tiān pài Má-tsóo.", huayu: "這裡是北港朝天宮，正殿拜的是媽祖。" } },
    { who: "volunteer_ct", emotion: "平靜", text: "迎媽祖是國家重要民俗，也叫北港人的第二次過年。", taigi: { hanji: "迎媽祖是國家的重要民俗，嘛叫做北港人的第二擺過年。", tailo: "Ngiâ Má-tsóo sī kok-ka ê tiōng-iàu bîn-sio̍k, mā kiò-tsò Pak-káng-lâng ê tē-jī pái kuè-nî.", huayu: "迎媽祖是國家重要民俗，也叫北港人的第二次過年。" } }
  ],
  D_TEMPLE_WD_INTRO: [
    { who: "volunteer_wd", emotion: "平靜", text: "歡迎來我們這間廟。", taigi: { hanji: "歡迎來阮這間廟。", tailo: "Huan-gîng lâi guán tsit king biō.", huayu: "歡迎來我們這間廟。" } },
    { who: "pet", emotion: "開心", text: "這裡是北港武德宮喔！" },
    { who: "volunteer_wd", emotion: "平靜", text: "錢要靠認真工作賺來，也要好好珍惜。", taigi: { hanji: "錢愛靠認真做工課趁來，嘛愛好好仔珍惜。", tailo: "Tsînn ài khò jīn-tsin tsò khang-khuè thàn--lâi, mā ài hó-hó-á tin-sioh.", huayu: "錢要靠認真工作賺來，也要好好珍惜。" } },
    { who: "volunteer_wd", emotion: "平靜", text: "新廟是四十多年前蓋好的。", taigi: { hanji: "新廟是四十外年前起好的。", tailo: "Sin biō sī sì-tsa̍p guā nî tsîng khí hó--ê.", huayu: "新廟是四十多年前蓋好的。" } }
  ],
  D_BG_5_LOCK: [
    { who: "oil_shop", emotion: "平靜", text: "先去廟口找阿伯聊聊，再來找我。", taigi: { hanji: "先去廟埕揣阿伯開講，才閣來揣我。", tailo: "Sing khì biō-tiânn tshuē a-peh khai-káng, tsiah-koh lâi tshuē guá.", huayu: "先去廟口找阿伯聊聊，再來找我。" } },
    { who: "pet", emotion: "平靜", text: "朝天宮廟口的阿伯，好像需要幫忙！" }
  ],
  D_BG_5A: [
    { who: "oil_shop", emotion: "開心", text: "北港老街，從朝天宮廟口一直到北港大橋。", taigi: { hanji: "北港舊街，對朝天宮廟埕一直到北港大橋。", tailo: "Pak-káng Kū-ke, tuì Tiâu-thian-kiong biō-tiânn it-ti̍t kàu Pak-káng tuā-kiô.", huayu: "北港老街，從朝天宮廟口一直到北港大橋。" } },
    { who: "oil_shop", emotion: "擔心", text: "霧讓我量不準麻油，幫我算 3 題好嗎？", taigi: { hanji: "霧予我量袂準麻油，共我算三題，好無？", tailo: "Bū hōo guá niû bē tsún muâ-iû, kā guá sǹg sann tê, hó--bô?", huayu: "霧讓我量不準麻油，幫我算 3 題好嗎？" } }
  ],
  D_BG_5B: [
    { who: "oil_shop", emotion: "開心", text: "量得剛剛好，謝謝你！", taigi: { hanji: "量甲拄仔好，多謝你！", tailo: "Niû kah tú-á-hó, to-siā--lí!", huayu: "量得剛剛好，謝謝你！" } },
    { who: "oil_shop", emotion: "開心", text: "送你 50 枚金幣，謝謝你！", taigi: { hanji: "送你五十个金幣，多謝你！", tailo: "Sàng lí gōo-tsa̍p ê kim-pè, to-siā--lí!", huayu: "送你 50 枚金幣，謝謝你！" } }
  ],
  D_OIL_IDLE: [
    { who: "oil_shop", text: "麻油要放在涼涼的地方喔。", taigi: { hanji: "麻油愛囥佇涼的所在喔。", tailo: "Muâ-iû ài khǹg tī liâng ê sóo-tsāi--ooh.", huayu: "麻油要放在涼涼的地方喔。" } }
  ],
  D_INN_BEIGANG: [
    { who: "inn_beigang", emotion: "開心", text: "歡迎來我們的旅店！好好休息喔。", taigi: { hanji: "歡迎來阮的旅社！好好仔歇睏喔。", tailo: "Huan-gîng lâi guán ê lí-siā! Hó-hó-á hioh-khùn--ooh.", huayu: "歡迎來我們的旅店！好好休息喔。" } }
  ],
  D_INN_BEIGANG_NOCOIN: [
    { who: "inn_beigang", emotion: "擔心", text: "金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。", taigi: { hanji: "金幣無夠喔，金包里溫泉旅館會使免錢蹛，嘛會使去拍怪物趁金幣。", tailo: "Kim-pè bô-kàu--ooh, Kim-pau-lí un-tsuânn lí-kuán ē-sái bián-tsînn tuà, mā ē-sái khì phah kuài-bu̍t thàn kim-pè.", huayu: "金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。" } }
  ],
  D_TEMPLE_BLESS_ZL: [
    { who: "volunteer_zl", emotion: "開心", text: "你這陣子真認真，這是你自己努力得來的！", taigi: { hanji: "你這站足認真，這攏是你家己拍拚來的！", tailo: "Lí tsit-tsām tsiok jīn-tsin, tse lóng sī lí ka-kī phah-piànn lâi--ê!", huayu: "你這陣子真認真，這是你自己努力得來的！" } },
    { who: "volunteer_zl", emotion: "開心", text: "一路平安，再加油喔！", taigi: { hanji: "一路平安，閣加油喔！", tailo: "Tsi̍t-lōo pîng-an, koh ka-iû--ooh!", huayu: "一路平安，再加油喔！" } }
  ],
  D_TEMPLE_BLESS_LK: [
    { who: "volunteer_lk", emotion: "開心", text: "你這陣子真認真，這是你自己努力得來的！", taigi: { hanji: "你這站足認真，這攏是你家己拍拚來的！", tailo: "Lí tsit-tsām tsiok jīn-tsin, tse lóng sī lí ka-kī phah-piànn lâi--ê!", huayu: "你這陣子真認真，這是你自己努力得來的！" } },
    { who: "volunteer_lk", emotion: "開心", text: "一路平安，再加油喔！", taigi: { hanji: "一路平安，閣加油喔！", tailo: "Tsi̍t-lōo pîng-an, koh ka-iû--ooh!", huayu: "一路平安，再加油喔！" } }
  ],
  D_TEMPLE_BLESS_CT: [
    { who: "volunteer_ct", emotion: "開心", text: "你這陣子真認真，這是你自己努力得來的！", taigi: { hanji: "你這站足認真，這攏是你家己拍拚來的！", tailo: "Lí tsit-tsām tsiok jīn-tsin, tse lóng sī lí ka-kī phah-piànn lâi--ê!", huayu: "你這陣子真認真，這是你自己努力得來的！" } },
    { who: "volunteer_ct", emotion: "開心", text: "一路平安，再加油喔！", taigi: { hanji: "一路平安，閣加油喔！", tailo: "Tsi̍t-lōo pîng-an, koh ka-iû--ooh!", huayu: "一路平安，再加油喔！" } }
  ],
  D_TEMPLE_BLESS_WD: [
    { who: "volunteer_wd", emotion: "開心", text: "你這陣子真認真，這是你自己努力得來的！", taigi: { hanji: "你這站足認真，這攏是你家己拍拚來的！", tailo: "Lí tsit-tsām tsiok jīn-tsin, tse lóng sī lí ka-kī phah-piànn lâi--ê!", huayu: "你這陣子真認真，這是你自己努力得來的！" } },
    { who: "volunteer_wd", emotion: "開心", text: "一路平安，再加油喔！", taigi: { hanji: "一路平安，閣加油喔！", tailo: "Tsi̍t-lōo pîng-an, koh ka-iû--ooh!", huayu: "一路平安，再加油喔！" } }
  ],
  D_TEMPLE_LOCKED_ZL: [
    { who: "volunteer_zl", emotion: "平靜", text: "見習冒險者到 10 級，才能來考立志小考喔。", taigi: { hanji: "見習冒險者到十級，才會使來考立志小考喔。", tailo: "Kiàn-si̍p mōo-hiám-tsiá kàu tsa̍p kip, tsiah ē-sái lâi khó li̍p-tsì sió-khó--ooh.", huayu: "見習冒險者到 10 級，才能來考立志小考喔。" } }
  ],
  D_TRIAL_INTRO_ZL: [
    { who: "volunteer_zl", emotion: "平靜", text: "想換職業，要先考立志小考喔。", taigi: { hanji: "欲換職業，愛先考立志小考喔。", tailo: "Beh uānn tsit-gia̍p, ài sing khó li̍p-tsì sió-khó--ooh.", huayu: "想換職業，要先考立志小考喔。" } },
    { who: "volunteer_zl", emotion: "平靜", text: "總共 20 題，五科每科 4 題，答對 16 題就過關。", taigi: { hanji: "攏總二十題，五科逐科四題，回答著十六題就過關。", tailo: "Lóng-tsóng jī-tsa̍p tê, gōo kho ta̍k kho sì tê, huê-tap tio̍h tsa̍p-la̍k tê tō kuè-kuan.", huayu: "總共 20 題，五科每科 4 題，答對 16 題就過關。" } },
    { who: "volunteer_zl", emotion: "平靜", text: "題目會念給你聽，念完才開始算時間。", taigi: { hanji: "題目會念予你聽，念了才開始算時間。", tailo: "Tê-bo̍k ē liām hōo lí thiann, liām liáu tsiah khai-sí sǹg sî-kan.", huayu: "題目會念給你聽，念完才開始算時間。" } },
    { who: "volunteer_zl", emotion: "平靜", text: "提示和卡片不能用；中途離開也算考一次。", taigi: { hanji: "提示佮卡片袂使用；中途離開，嘛算考一擺。", tailo: "Thê-sī kah khah-phìnn bē-sái īng; tiong-tôo lī-khui, mā sǹg khó tsi̍t pái.", huayu: "提示和卡片不能用；中途離開也算考一次。" } }
  ],
  D_TRIAL_PASS_ZL: [
    { who: "volunteer_zl", emotion: "開心", text: "恭喜你！祝你越來越厲害喔！", taigi: { hanji: "恭喜你！祝你愈來愈𠢕喔！", tailo: "Kiong-hí--lí! Tsiok lí jú lâi jú gâu--ooh!", huayu: "恭喜你！祝你越來越厲害喔！" } }
  ],
  D_TRIAL_FAIL_ZL: [
    { who: "volunteer_zl", emotion: "平靜", text: "這次還沒過，沒關係。", taigi: { hanji: "這擺猶未過關，無要緊。", tailo: "Tsit pái iáu-buē kuè-kuan, bô iàu-kín.", huayu: "這次還沒過，沒關係。" } },
    { who: "volunteer_zl", emotion: "平靜", text: "答錯的單元回去多練習，明天可以再來考。", taigi: { hanji: "毋著的單元轉去加練習，明仔載會使閣來考。", tailo: "M̄-tio̍h ê tan-guân tńg-khì ke liān-si̍p, miâ-á-tsài ē-sái koh lâi khó.", huayu: "答錯的單元回去多練習，明天可以再來考。" } },
    { who: "volunteer_zl", emotion: "開心", text: "當見習冒險者，一樣能打倒魔王喔！", taigi: { hanji: "做見習冒險者，仝款會當拍贏魔王喔！", tailo: "Tsò kiàn-si̍p mōo-hiám-tsiá, kāng-khuán ē-tàng phah-iânn môo-ông--ooh!", huayu: "當見習冒險者，一樣能打倒魔王喔！" } }
  ],
  D_TRIAL_AGAIN_ZL: [
    { who: "volunteer_zl", emotion: "平靜", text: "今天已經考一次了，明天再來喔。", taigi: { hanji: "今仔日已經考一擺矣，明仔載才閣來喔。", tailo: "Kin-á-ji̍t í-king khó tsi̍t pái--ah, miâ-á-tsài tsiah koh lâi--ooh.", huayu: "今天已經考一次了，明天再來喔。" } }
  ],
  D_JOB_LV1_ZL: [
    { who: "volunteer_zl", emotion: "平靜", text: "換了職業，等級會從 1 開始。", taigi: { hanji: "換職業了後，等級會對一級開始。", tailo: "Uānn tsit-gia̍p liáu-āu, tíng-kip ē tuì tsi̍t kip khai-sí.", huayu: "換了職業，等級會從 1 開始。" } },
    { who: "volunteer_zl", emotion: "開心", text: "不過能力有保底，不會少太多，不用擔心。", taigi: { hanji: "毋過能力袂減傷濟，免煩惱。", tailo: "M̄-koh lîng-li̍k bē kiám siunn tsē, bián huân-ló.", huayu: "不過能力有保底，不會少太多，不用擔心。" } }
  ],
  D_JOB_BACK_ZL: [
    { who: "volunteer_zl", emotion: "開心", text: "這個職業你以前當過，免費換回去，不用考試。", taigi: { hanji: "這个職業你以早做過，免錢換轉去，免考試。", tailo: "Tsit ê tsit-gia̍p lí í-tsá tsò--kuè, bián-tsînn uānn tńg-khì, bián khó-tshì.", huayu: "這個職業你以前當過，免費換回去，不用考試。" } },
    { who: "volunteer_zl", emotion: "平靜", text: "等級也會和以前一樣喔。", taigi: { hanji: "等級嘛會佮以早仝款喔。", tailo: "Tíng-kip mā ē kah í-tsá kāng-khuán--ooh.", huayu: "等級也會和以前一樣喔。" } }
  ],
  D_TEMPLE_LOCKED_LK: [
    { who: "volunteer_lk", emotion: "平靜", text: "見習冒險者到 10 級，才能來考立志小考喔。", taigi: { hanji: "見習冒險者到十級，才會使來考立志小考喔。", tailo: "Kiàn-si̍p mōo-hiám-tsiá kàu tsa̍p kip, tsiah ē-sái lâi khó li̍p-tsì sió-khó--ooh.", huayu: "見習冒險者到 10 級，才能來考立志小考喔。" } }
  ],
  D_TRIAL_INTRO_LK: [
    { who: "volunteer_lk", emotion: "平靜", text: "想換職業，要先考立志小考喔。", taigi: { hanji: "欲換職業，愛先考立志小考喔。", tailo: "Beh uānn tsit-gia̍p, ài sing khó li̍p-tsì sió-khó--ooh.", huayu: "想換職業，要先考立志小考喔。" } },
    { who: "volunteer_lk", emotion: "平靜", text: "總共 20 題，五科每科 4 題，答對 16 題就過關。", taigi: { hanji: "攏總二十題，五科逐科四題，回答著十六題就過關。", tailo: "Lóng-tsóng jī-tsa̍p tê, gōo kho ta̍k kho sì tê, huê-tap tio̍h tsa̍p-la̍k tê tō kuè-kuan.", huayu: "總共 20 題，五科每科 4 題，答對 16 題就過關。" } },
    { who: "volunteer_lk", emotion: "平靜", text: "題目會念給你聽，念完才開始算時間。", taigi: { hanji: "題目會念予你聽，念了才開始算時間。", tailo: "Tê-bo̍k ē liām hōo lí thiann, liām liáu tsiah khai-sí sǹg sî-kan.", huayu: "題目會念給你聽，念完才開始算時間。" } },
    { who: "volunteer_lk", emotion: "平靜", text: "提示和卡片不能用；中途離開也算考一次。", taigi: { hanji: "提示佮卡片袂使用；中途離開，嘛算考一擺。", tailo: "Thê-sī kah khah-phìnn bē-sái īng; tiong-tôo lī-khui, mā sǹg khó tsi̍t pái.", huayu: "提示和卡片不能用；中途離開也算考一次。" } }
  ],
  D_TRIAL_PASS_LK: [
    { who: "volunteer_lk", emotion: "開心", text: "恭喜你！祝你越來越厲害喔！", taigi: { hanji: "恭喜你！祝你愈來愈𠢕喔！", tailo: "Kiong-hí--lí! Tsiok lí jú lâi jú gâu--ooh!", huayu: "恭喜你！祝你越來越厲害喔！" } }
  ],
  D_TRIAL_FAIL_LK: [
    { who: "volunteer_lk", emotion: "平靜", text: "這次還沒過，沒關係。", taigi: { hanji: "這擺猶未過關，無要緊。", tailo: "Tsit pái iáu-buē kuè-kuan, bô iàu-kín.", huayu: "這次還沒過，沒關係。" } },
    { who: "volunteer_lk", emotion: "平靜", text: "答錯的單元回去多練習，明天可以再來考。", taigi: { hanji: "毋著的單元轉去加練習，明仔載會使閣來考。", tailo: "M̄-tio̍h ê tan-guân tńg-khì ke liān-si̍p, miâ-á-tsài ē-sái koh lâi khó.", huayu: "答錯的單元回去多練習，明天可以再來考。" } },
    { who: "volunteer_lk", emotion: "開心", text: "當見習冒險者，一樣能打倒魔王喔！", taigi: { hanji: "做見習冒險者，仝款會當拍贏魔王喔！", tailo: "Tsò kiàn-si̍p mōo-hiám-tsiá, kāng-khuán ē-tàng phah-iânn môo-ông--ooh!", huayu: "當見習冒險者，一樣能打倒魔王喔！" } }
  ],
  D_TRIAL_AGAIN_LK: [
    { who: "volunteer_lk", emotion: "平靜", text: "今天已經考一次了，明天再來喔。", taigi: { hanji: "今仔日已經考一擺矣，明仔載才閣來喔。", tailo: "Kin-á-ji̍t í-king khó tsi̍t pái--ah, miâ-á-tsài tsiah koh lâi--ooh.", huayu: "今天已經考一次了，明天再來喔。" } }
  ],
  D_JOB_LV1_LK: [
    { who: "volunteer_lk", emotion: "平靜", text: "換了職業，等級會從 1 開始。", taigi: { hanji: "換職業了後，等級會對一級開始。", tailo: "Uānn tsit-gia̍p liáu-āu, tíng-kip ē tuì tsi̍t kip khai-sí.", huayu: "換了職業，等級會從 1 開始。" } },
    { who: "volunteer_lk", emotion: "開心", text: "不過能力有保底，不會少太多，不用擔心。", taigi: { hanji: "毋過能力袂減傷濟，免煩惱。", tailo: "M̄-koh lîng-li̍k bē kiám siunn tsē, bián huân-ló.", huayu: "不過能力有保底，不會少太多，不用擔心。" } }
  ],
  D_JOB_BACK_LK: [
    { who: "volunteer_lk", emotion: "開心", text: "這個職業你以前當過，免費換回去，不用考試。", taigi: { hanji: "這个職業你以早做過，免錢換轉去，免考試。", tailo: "Tsit ê tsit-gia̍p lí í-tsá tsò--kuè, bián-tsînn uānn tńg-khì, bián khó-tshì.", huayu: "這個職業你以前當過，免費換回去，不用考試。" } },
    { who: "volunteer_lk", emotion: "平靜", text: "等級也會和以前一樣喔。", taigi: { hanji: "等級嘛會佮以早仝款喔。", tailo: "Tíng-kip mā ē kah í-tsá kāng-khuán--ooh.", huayu: "等級也會和以前一樣喔。" } }
  ],
  D_TEMPLE_LOCKED_CT: [
    { who: "volunteer_ct", emotion: "平靜", text: "見習冒險者到 10 級，才能來考立志小考喔。", taigi: { hanji: "見習冒險者到十級，才會使來考立志小考喔。", tailo: "Kiàn-si̍p mōo-hiám-tsiá kàu tsa̍p kip, tsiah ē-sái lâi khó li̍p-tsì sió-khó--ooh.", huayu: "見習冒險者到 10 級，才能來考立志小考喔。" } }
  ],
  D_TRIAL_INTRO_CT: [
    { who: "volunteer_ct", emotion: "平靜", text: "想換職業，要先考立志小考喔。", taigi: { hanji: "欲換職業，愛先考立志小考喔。", tailo: "Beh uānn tsit-gia̍p, ài sing khó li̍p-tsì sió-khó--ooh.", huayu: "想換職業，要先考立志小考喔。" } },
    { who: "volunteer_ct", emotion: "平靜", text: "總共 20 題，五科每科 4 題，答對 16 題就過關。", taigi: { hanji: "攏總二十題，五科逐科四題，回答著十六題就過關。", tailo: "Lóng-tsóng jī-tsa̍p tê, gōo kho ta̍k kho sì tê, huê-tap tio̍h tsa̍p-la̍k tê tō kuè-kuan.", huayu: "總共 20 題，五科每科 4 題，答對 16 題就過關。" } },
    { who: "volunteer_ct", emotion: "平靜", text: "題目會念給你聽，念完才開始算時間。", taigi: { hanji: "題目會念予你聽，念了才開始算時間。", tailo: "Tê-bo̍k ē liām hōo lí thiann, liām liáu tsiah khai-sí sǹg sî-kan.", huayu: "題目會念給你聽，念完才開始算時間。" } },
    { who: "volunteer_ct", emotion: "平靜", text: "提示和卡片不能用；中途離開也算考一次。", taigi: { hanji: "提示佮卡片袂使用；中途離開，嘛算考一擺。", tailo: "Thê-sī kah khah-phìnn bē-sái īng; tiong-tôo lī-khui, mā sǹg khó tsi̍t pái.", huayu: "提示和卡片不能用；中途離開也算考一次。" } }
  ],
  D_TRIAL_PASS_CT: [
    { who: "volunteer_ct", emotion: "開心", text: "恭喜你！祝你越來越厲害喔！", taigi: { hanji: "恭喜你！祝你愈來愈𠢕喔！", tailo: "Kiong-hí--lí! Tsiok lí jú lâi jú gâu--ooh!", huayu: "恭喜你！祝你越來越厲害喔！" } }
  ],
  D_TRIAL_FAIL_CT: [
    { who: "volunteer_ct", emotion: "平靜", text: "這次還沒過，沒關係。", taigi: { hanji: "這擺猶未過關，無要緊。", tailo: "Tsit pái iáu-buē kuè-kuan, bô iàu-kín.", huayu: "這次還沒過，沒關係。" } },
    { who: "volunteer_ct", emotion: "平靜", text: "答錯的單元回去多練習，明天可以再來考。", taigi: { hanji: "毋著的單元轉去加練習，明仔載會使閣來考。", tailo: "M̄-tio̍h ê tan-guân tńg-khì ke liān-si̍p, miâ-á-tsài ē-sái koh lâi khó.", huayu: "答錯的單元回去多練習，明天可以再來考。" } },
    { who: "volunteer_ct", emotion: "開心", text: "當見習冒險者，一樣能打倒魔王喔！", taigi: { hanji: "做見習冒險者，仝款會當拍贏魔王喔！", tailo: "Tsò kiàn-si̍p mōo-hiám-tsiá, kāng-khuán ē-tàng phah-iânn môo-ông--ooh!", huayu: "當見習冒險者，一樣能打倒魔王喔！" } }
  ],
  D_TRIAL_AGAIN_CT: [
    { who: "volunteer_ct", emotion: "平靜", text: "今天已經考一次了，明天再來喔。", taigi: { hanji: "今仔日已經考一擺矣，明仔載才閣來喔。", tailo: "Kin-á-ji̍t í-king khó tsi̍t pái--ah, miâ-á-tsài tsiah koh lâi--ooh.", huayu: "今天已經考一次了，明天再來喔。" } }
  ],
  D_JOB_LV1_CT: [
    { who: "volunteer_ct", emotion: "平靜", text: "換了職業，等級會從 1 開始。", taigi: { hanji: "換職業了後，等級會對一級開始。", tailo: "Uānn tsit-gia̍p liáu-āu, tíng-kip ē tuì tsi̍t kip khai-sí.", huayu: "換了職業，等級會從 1 開始。" } },
    { who: "volunteer_ct", emotion: "開心", text: "不過能力有保底，不會少太多，不用擔心。", taigi: { hanji: "毋過能力袂減傷濟，免煩惱。", tailo: "M̄-koh lîng-li̍k bē kiám siunn tsē, bián huân-ló.", huayu: "不過能力有保底，不會少太多，不用擔心。" } }
  ],
  D_JOB_BACK_CT: [
    { who: "volunteer_ct", emotion: "開心", text: "這個職業你以前當過，免費換回去，不用考試。", taigi: { hanji: "這个職業你以早做過，免錢換轉去，免考試。", tailo: "Tsit ê tsit-gia̍p lí í-tsá tsò--kuè, bián-tsînn uānn tńg-khì, bián khó-tshì.", huayu: "這個職業你以前當過，免費換回去，不用考試。" } },
    { who: "volunteer_ct", emotion: "平靜", text: "等級也會和以前一樣喔。", taigi: { hanji: "等級嘛會佮以早仝款喔。", tailo: "Tíng-kip mā ē kah í-tsá kāng-khuán--ooh.", huayu: "等級也會和以前一樣喔。" } }
  ],
  D_TEMPLE_LOCKED_WD: [
    { who: "volunteer_wd", emotion: "平靜", text: "見習冒險者到 10 級，才能來考立志小考喔。", taigi: { hanji: "見習冒險者到十級，才會使來考立志小考喔。", tailo: "Kiàn-si̍p mōo-hiám-tsiá kàu tsa̍p kip, tsiah ē-sái lâi khó li̍p-tsì sió-khó--ooh.", huayu: "見習冒險者到 10 級，才能來考立志小考喔。" } }
  ],
  D_TRIAL_INTRO_WD: [
    { who: "volunteer_wd", emotion: "平靜", text: "想換職業，要先考立志小考喔。", taigi: { hanji: "欲換職業，愛先考立志小考喔。", tailo: "Beh uānn tsit-gia̍p, ài sing khó li̍p-tsì sió-khó--ooh.", huayu: "想換職業，要先考立志小考喔。" } },
    { who: "volunteer_wd", emotion: "平靜", text: "總共 20 題，五科每科 4 題，答對 16 題就過關。", taigi: { hanji: "攏總二十題，五科逐科四題，回答著十六題就過關。", tailo: "Lóng-tsóng jī-tsa̍p tê, gōo kho ta̍k kho sì tê, huê-tap tio̍h tsa̍p-la̍k tê tō kuè-kuan.", huayu: "總共 20 題，五科每科 4 題，答對 16 題就過關。" } },
    { who: "volunteer_wd", emotion: "平靜", text: "題目會念給你聽，念完才開始算時間。", taigi: { hanji: "題目會念予你聽，念了才開始算時間。", tailo: "Tê-bo̍k ē liām hōo lí thiann, liām liáu tsiah khai-sí sǹg sî-kan.", huayu: "題目會念給你聽，念完才開始算時間。" } },
    { who: "volunteer_wd", emotion: "平靜", text: "提示和卡片不能用；中途離開也算考一次。", taigi: { hanji: "提示佮卡片袂使用；中途離開，嘛算考一擺。", tailo: "Thê-sī kah khah-phìnn bē-sái īng; tiong-tôo lī-khui, mā sǹg khó tsi̍t pái.", huayu: "提示和卡片不能用；中途離開也算考一次。" } }
  ],
  D_TRIAL_PASS_WD: [
    { who: "volunteer_wd", emotion: "開心", text: "恭喜你！祝你越來越厲害喔！", taigi: { hanji: "恭喜你！祝你愈來愈𠢕喔！", tailo: "Kiong-hí--lí! Tsiok lí jú lâi jú gâu--ooh!", huayu: "恭喜你！祝你越來越厲害喔！" } }
  ],
  D_TRIAL_FAIL_WD: [
    { who: "volunteer_wd", emotion: "平靜", text: "這次還沒過，沒關係。", taigi: { hanji: "這擺猶未過關，無要緊。", tailo: "Tsit pái iáu-buē kuè-kuan, bô iàu-kín.", huayu: "這次還沒過，沒關係。" } },
    { who: "volunteer_wd", emotion: "平靜", text: "答錯的單元回去多練習，明天可以再來考。", taigi: { hanji: "毋著的單元轉去加練習，明仔載會使閣來考。", tailo: "M̄-tio̍h ê tan-guân tńg-khì ke liān-si̍p, miâ-á-tsài ē-sái koh lâi khó.", huayu: "答錯的單元回去多練習，明天可以再來考。" } },
    { who: "volunteer_wd", emotion: "開心", text: "當見習冒險者，一樣能打倒魔王喔！", taigi: { hanji: "做見習冒險者，仝款會當拍贏魔王喔！", tailo: "Tsò kiàn-si̍p mōo-hiám-tsiá, kāng-khuán ē-tàng phah-iânn môo-ông--ooh!", huayu: "當見習冒險者，一樣能打倒魔王喔！" } }
  ],
  D_TRIAL_AGAIN_WD: [
    { who: "volunteer_wd", emotion: "平靜", text: "今天已經考一次了，明天再來喔。", taigi: { hanji: "今仔日已經考一擺矣，明仔載才閣來喔。", tailo: "Kin-á-ji̍t í-king khó tsi̍t pái--ah, miâ-á-tsài tsiah koh lâi--ooh.", huayu: "今天已經考一次了，明天再來喔。" } }
  ],
  D_JOB_LV1_WD: [
    { who: "volunteer_wd", emotion: "平靜", text: "換了職業，等級會從 1 開始。", taigi: { hanji: "換職業了後，等級會對一級開始。", tailo: "Uānn tsit-gia̍p liáu-āu, tíng-kip ē tuì tsi̍t kip khai-sí.", huayu: "換了職業，等級會從 1 開始。" } },
    { who: "volunteer_wd", emotion: "開心", text: "不過能力有保底，不會少太多，不用擔心。", taigi: { hanji: "毋過能力袂減傷濟，免煩惱。", tailo: "M̄-koh lîng-li̍k bē kiám siunn tsē, bián huân-ló.", huayu: "不過能力有保底，不會少太多，不用擔心。" } }
  ],
  D_JOB_BACK_WD: [
    { who: "volunteer_wd", emotion: "開心", text: "這個職業你以前當過，免費換回去，不用考試。", taigi: { hanji: "這个職業你以早做過，免錢換轉去，免考試。", tailo: "Tsit ê tsit-gia̍p lí í-tsá tsò--kuè, bián-tsînn uānn tńg-khì, bián khó-tshì.", huayu: "這個職業你以前當過，免費換回去，不用考試。" } },
    { who: "volunteer_wd", emotion: "平靜", text: "等級也會和以前一樣喔。", taigi: { hanji: "等級嘛會佮以早仝款喔。", tailo: "Tíng-kip mā ē kah í-tsá kāng-khuán--ooh.", huayu: "等級也會和以前一樣喔。" } }
  ],
  // ═════════════ v2.0 中部 END ═════════════
  // ═════════════ v2.1 2 轉台詞（劇本組草稿 wip_v20_draft/dialogs_trial2.js；v21_apply.js 每次重跑都整段重建）BEGIN ═════════════
  D_TRIAL2_INTRO_TEMPLE: [
    { who: "temple_keeper", emotion: "平靜", text: "想當中級職業，也要先考立志小考喔。", taigi: { hanji: "欲做中級職業，嘛愛先考立志小考喔。", tailo: "Beh tsò tiong-kip tsit-gia̍p, mā ài sing khó li̍p-tsì sió-khó--ooh.", huayu: "想當中級職業，也要先考立志小考喔。" } },
    { who: "temple_keeper", emotion: "平靜", text: "總共 20 題，五科每科 4 題，答對 18 題才過關。", taigi: { hanji: "攏總二十題，五科逐科四題，回答著十八題才過關。", tailo: "Lóng-tsóng jī-tsa̍p tê, gōo kho ta̍k kho sì tê, huê-tap tio̍h tsa̍p-peh tê tsiah kuè-kuan.", huayu: "總共 20 題，五科每科 4 題，答對 18 題才過關。" } },
    { who: "temple_keeper", emotion: "平靜", text: "題目比較難，每題的時間也比較短喔。", taigi: { hanji: "題目較僫，逐題的時間嘛較短喔。", tailo: "Tê-bo̍k khah oh, ta̍k tê ê sî-kan mā khah té--ooh.", huayu: "題目比較難，每題的時間也比較短喔。" } },
    { who: "temple_keeper", emotion: "平靜", text: "題目會念給你聽，念完才開始算時間。", taigi: { hanji: "題目會念予你聽，念了才開始算時間。", tailo: "Tê-bo̍k ē liām hōo lí thiann, liām liáu tsiah khai-sí sǹg sî-kan.", huayu: "題目會念給你聽，念完才開始算時間。" } },
    { who: "temple_keeper", emotion: "平靜", text: "提示和卡片不能用；中途離開也算考一次。", taigi: { hanji: "提示佮卡片袂使用；中途離開，嘛算考一擺。", tailo: "Thê-sī kah khah-phìnn bē-sái īng; tiong-tôo lī-khui, mā sǹg khó tsi̍t pái.", huayu: "提示和卡片不能用；中途離開也算考一次。" } },
    { who: "pet", emotion: "開心", text: "題目有 2 顆星和 3 顆星，三上、三下都有。一起加油！" }
  ],
  D_TRIAL2_FAIL_TEMPLE: [
    { who: "temple_keeper", emotion: "平靜", text: "這次還沒過，沒關係。", taigi: { hanji: "這擺猶未過關，無要緊。", tailo: "Tsit pái iáu-buē kuè-kuan, bô iàu-kín.", huayu: "這次還沒過，沒關係。" } },
    { who: "temple_keeper", emotion: "平靜", text: "答錯的單元回去多練習，明天可以再來考。", taigi: { hanji: "毋著的單元轉去加練習，明仔載會使閣來考。", tailo: "M̄-tio̍h ê tan-guân tńg-khì ke liān-si̍p, miâ-á-tsài ē-sái koh lâi khó.", huayu: "答錯的單元回去多練習，明天可以再來考。" } },
    { who: "temple_keeper", emotion: "開心", text: "用現在的職業，一樣能打倒魔王喔！", taigi: { hanji: "用這馬的職業，仝款會當拍贏魔王喔！", tailo: "Īng tsit-má ê tsit-gia̍p, kāng-khuán ē-tàng phah-iânn môo-ông--ooh!", huayu: "用現在的職業，一樣能打倒魔王喔！" } }
  ],
  D_TRIAL2_INTRO_GUILD: [
    { who: "guild", emotion: "平靜", text: "想當中級職業，也要先考立志小考喔。", taigi: { hanji: "欲做中級職業，嘛愛先考立志小考喔。", tailo: "Beh tsò tiong-kip tsit-gia̍p, mā ài sing khó li̍p-tsì sió-khó--ooh.", huayu: "想當中級職業，也要先考立志小考喔。" } },
    { who: "guild", emotion: "平靜", text: "總共 20 題，五科每科 4 題，答對 18 題才過關。", taigi: { hanji: "攏總二十題，五科逐科四題，回答著十八題才過關。", tailo: "Lóng-tsóng jī-tsa̍p tê, gōo kho ta̍k kho sì tê, huê-tap tio̍h tsa̍p-peh tê tsiah kuè-kuan.", huayu: "總共 20 題，五科每科 4 題，答對 18 題才過關。" } },
    { who: "guild", emotion: "平靜", text: "題目比較難，每題的時間也比較短喔。", taigi: { hanji: "題目較僫，逐題的時間嘛較短喔。", tailo: "Tê-bo̍k khah oh, ta̍k tê ê sî-kan mā khah té--ooh.", huayu: "題目比較難，每題的時間也比較短喔。" } },
    { who: "guild", emotion: "平靜", text: "題目念完，才開始算時間，慢慢聽清楚。", taigi: { hanji: "題目念了，才開始算時間，慢慢仔聽予清楚。", tailo: "Tê-bo̍k liām liáu, tsiah khai-sí sǹg sî-kan, bān-bān-á thiann hōo tshing-tshó.", huayu: "題目念完，才開始算時間，慢慢聽清楚。" } },
    { who: "guild", emotion: "平靜", text: "提示和卡片不能用；中途離開也算考一次。", taigi: { hanji: "提示佮卡片袂使用；中途離開，嘛算考一擺。", tailo: "Thê-sī kah khah-phìnn bē-sái īng; tiong-tôo lī-khui, mā sǹg khó tsi̍t pái.", huayu: "提示和卡片不能用；中途離開也算考一次。" } },
    { who: "pet", emotion: "開心", text: "題目有 2 顆星和 3 顆星，三上、三下都有。一起加油！" }
  ],
  D_TRIAL2_FAIL_GUILD: [
    { who: "guild", emotion: "平靜", text: "這次還沒過，沒關係。", taigi: { hanji: "這擺猶未過關，無要緊。", tailo: "Tsit pái iáu-buē kuè-kuan, bô iàu-kín.", huayu: "這次還沒過，沒關係。" } },
    { who: "guild", emotion: "平靜", text: "把答錯的單元多練習，明天再來考。", taigi: { hanji: "共毋著的單元加練習，明仔載閣來考。", tailo: "Kā m̄-tio̍h ê tan-guân ke liān-si̍p, miâ-á-tsài koh lâi khó.", huayu: "把答錯的單元多練習，明天再來考。" } },
    { who: "guild", emotion: "開心", text: "用現在的職業，一樣能打倒魔王喔！", taigi: { hanji: "用這馬的職業，仝款會當拍贏魔王喔！", tailo: "Īng tsit-má ê tsit-gia̍p, kāng-khuán ē-tàng phah-iânn môo-ông--ooh!", huayu: "用現在的職業，一樣能打倒魔王喔！" } }
  ],
  D_TRIAL2_INTRO_HT: [
    { who: "temple_volunteer_ht", emotion: "平靜", text: "想當中級職業，也要先考立志小考喔。", taigi: { hanji: "欲做中級職業，嘛愛先考立志小考喔。", tailo: "Beh tsò tiong-kip tsit-gia̍p, mā ài sing khó li̍p-tsì sió-khó--ooh.", huayu: "想當中級職業，也要先考立志小考喔。" } },
    { who: "temple_volunteer_ht", emotion: "平靜", text: "總共 20 題，五科每科 4 題，答對 18 題才過關。", taigi: { hanji: "攏總二十題，五科逐科四題，回答著十八題才過關。", tailo: "Lóng-tsóng jī-tsa̍p tê, gōo kho ta̍k kho sì tê, huê-tap tio̍h tsa̍p-peh tê tsiah kuè-kuan.", huayu: "總共 20 題，五科每科 4 題，答對 18 題才過關。" } },
    { who: "temple_volunteer_ht", emotion: "平靜", text: "題目比較難，每題的時間也比較短喔。", taigi: { hanji: "題目較僫，逐題的時間嘛較短喔。", tailo: "Tê-bo̍k khah oh, ta̍k tê ê sî-kan mā khah té--ooh.", huayu: "題目比較難，每題的時間也比較短喔。" } },
    { who: "temple_volunteer_ht", emotion: "平靜", text: "題目會念給你聽，念完才開始算時間。", taigi: { hanji: "題目會念予你聽，念了才開始算時間。", tailo: "Tê-bo̍k ē liām hōo lí thiann, liām liáu tsiah khai-sí sǹg sî-kan.", huayu: "題目會念給你聽，念完才開始算時間。" } },
    { who: "temple_volunteer_ht", emotion: "平靜", text: "提示和卡片不能用；中途離開也算考一次。", taigi: { hanji: "提示佮卡片袂使用；中途離開，嘛算考一擺。", tailo: "Thê-sī kah khah-phìnn bē-sái īng; tiong-tôo lī-khui, mā sǹg khó tsi̍t pái.", huayu: "提示和卡片不能用；中途離開也算考一次。" } },
    { who: "pet", emotion: "開心", text: "題目有 2 顆星和 3 顆星，三上、三下都有。一起加油！" }
  ],
  D_TRIAL2_FAIL_HT: [
    { who: "temple_volunteer_ht", emotion: "平靜", text: "這次還沒過，沒關係。", taigi: { hanji: "這擺猶未過關，無要緊。", tailo: "Tsit pái iáu-buē kuè-kuan, bô iàu-kín.", huayu: "這次還沒過，沒關係。" } },
    { who: "temple_volunteer_ht", emotion: "平靜", text: "答錯的單元回去多練習，明天可以再來考。", taigi: { hanji: "毋著的單元轉去加練習，明仔載會使閣來考。", tailo: "M̄-tio̍h ê tan-guân tńg-khì ke liān-si̍p, miâ-á-tsài ē-sái koh lâi khó.", huayu: "答錯的單元回去多練習，明天可以再來考。" } },
    { who: "temple_volunteer_ht", emotion: "開心", text: "用現在的職業，一樣能打倒魔王喔！", taigi: { hanji: "用這馬的職業，仝款會當拍贏魔王喔！", tailo: "Īng tsit-má ê tsit-gia̍p, kāng-khuán ē-tàng phah-iânn môo-ông--ooh!", huayu: "用現在的職業，一樣能打倒魔王喔！" } }
  ],
  D_TRIAL2_INTRO_ZN: [
    { who: "temple_volunteer_zn", emotion: "平靜", text: "想當中級職業，也要先考立志小考喔。", taigi: { hanji: "欲做中級職業，嘛愛先考立志小考喔。", tailo: "Beh tsò tiong-kip tsit-gia̍p, mā ài sing khó li̍p-tsì sió-khó--ooh.", huayu: "想當中級職業，也要先考立志小考喔。" } },
    { who: "temple_volunteer_zn", emotion: "平靜", text: "總共 20 題，五科每科 4 題，答對 18 題才過關。", taigi: { hanji: "攏總二十題，五科逐科四題，回答著十八題才過關。", tailo: "Lóng-tsóng jī-tsa̍p tê, gōo kho ta̍k kho sì tê, huê-tap tio̍h tsa̍p-peh tê tsiah kuè-kuan.", huayu: "總共 20 題，五科每科 4 題，答對 18 題才過關。" } },
    { who: "temple_volunteer_zn", emotion: "平靜", text: "題目比較難，每題的時間也比較短喔。", taigi: { hanji: "題目較僫，逐題的時間嘛較短喔。", tailo: "Tê-bo̍k khah oh, ta̍k tê ê sî-kan mā khah té--ooh.", huayu: "題目比較難，每題的時間也比較短喔。" } },
    { who: "temple_volunteer_zn", emotion: "平靜", text: "題目會念給你聽，念完才開始算時間。", taigi: { hanji: "題目會念予你聽，念了才開始算時間。", tailo: "Tê-bo̍k ē liām hōo lí thiann, liām liáu tsiah khai-sí sǹg sî-kan.", huayu: "題目會念給你聽，念完才開始算時間。" } },
    { who: "temple_volunteer_zn", emotion: "平靜", text: "提示和卡片不能用；中途離開也算考一次。", taigi: { hanji: "提示佮卡片袂使用；中途離開，嘛算考一擺。", tailo: "Thê-sī kah khah-phìnn bē-sái īng; tiong-tôo lī-khui, mā sǹg khó tsi̍t pái.", huayu: "提示和卡片不能用；中途離開也算考一次。" } },
    { who: "pet", emotion: "開心", text: "題目有 2 顆星和 3 顆星，三上、三下都有。一起加油！" }
  ],
  D_TRIAL2_FAIL_ZN: [
    { who: "temple_volunteer_zn", emotion: "平靜", text: "這次還沒過，沒關係。", taigi: { hanji: "這擺猶未過關，無要緊。", tailo: "Tsit pái iáu-buē kuè-kuan, bô iàu-kín.", huayu: "這次還沒過，沒關係。" } },
    { who: "temple_volunteer_zn", emotion: "平靜", text: "答錯的單元回去多練習，明天可以再來考。", taigi: { hanji: "毋著的單元轉去加練習，明仔載會使閣來考。", tailo: "M̄-tio̍h ê tan-guân tńg-khì ke liān-si̍p, miâ-á-tsài ē-sái koh lâi khó.", huayu: "答錯的單元回去多練習，明天可以再來考。" } },
    { who: "temple_volunteer_zn", emotion: "開心", text: "用現在的職業，一樣能打倒魔王喔！", taigi: { hanji: "用這馬的職業，仝款會當拍贏魔王喔！", tailo: "Īng tsit-má ê tsit-gia̍p, kāng-khuán ē-tàng phah-iânn môo-ông--ooh!", huayu: "用現在的職業，一樣能打倒魔王喔！" } }
  ],
  D_TRIAL2_INTRO_ZL: [
    { who: "volunteer_zl", emotion: "平靜", text: "想當中級職業，也要先考立志小考喔。", taigi: { hanji: "欲做中級職業，嘛愛先考立志小考喔。", tailo: "Beh tsò tiong-kip tsit-gia̍p, mā ài sing khó li̍p-tsì sió-khó--ooh.", huayu: "想當中級職業，也要先考立志小考喔。" } },
    { who: "volunteer_zl", emotion: "平靜", text: "總共 20 題，五科每科 4 題，答對 18 題才過關。", taigi: { hanji: "攏總二十題，五科逐科四題，回答著十八題才過關。", tailo: "Lóng-tsóng jī-tsa̍p tê, gōo kho ta̍k kho sì tê, huê-tap tio̍h tsa̍p-peh tê tsiah kuè-kuan.", huayu: "總共 20 題，五科每科 4 題，答對 18 題才過關。" } },
    { who: "volunteer_zl", emotion: "平靜", text: "題目比較難，每題的時間也比較短喔。", taigi: { hanji: "題目較僫，逐題的時間嘛較短喔。", tailo: "Tê-bo̍k khah oh, ta̍k tê ê sî-kan mā khah té--ooh.", huayu: "題目比較難，每題的時間也比較短喔。" } },
    { who: "volunteer_zl", emotion: "平靜", text: "題目會念給你聽，念完才開始算時間。", taigi: { hanji: "題目會念予你聽，念了才開始算時間。", tailo: "Tê-bo̍k ē liām hōo lí thiann, liām liáu tsiah khai-sí sǹg sî-kan.", huayu: "題目會念給你聽，念完才開始算時間。" } },
    { who: "volunteer_zl", emotion: "平靜", text: "提示和卡片不能用；中途離開也算考一次。", taigi: { hanji: "提示佮卡片袂使用；中途離開，嘛算考一擺。", tailo: "Thê-sī kah khah-phìnn bē-sái īng; tiong-tôo lī-khui, mā sǹg khó tsi̍t pái.", huayu: "提示和卡片不能用；中途離開也算考一次。" } },
    { who: "pet", emotion: "開心", text: "題目有 2 顆星和 3 顆星，三上、三下都有。一起加油！" }
  ],
  D_TRIAL2_FAIL_ZL: [
    { who: "volunteer_zl", emotion: "平靜", text: "這次還沒過，沒關係。", taigi: { hanji: "這擺猶未過關，無要緊。", tailo: "Tsit pái iáu-buē kuè-kuan, bô iàu-kín.", huayu: "這次還沒過，沒關係。" } },
    { who: "volunteer_zl", emotion: "平靜", text: "答錯的單元回去多練習，明天可以再來考。", taigi: { hanji: "毋著的單元轉去加練習，明仔載會使閣來考。", tailo: "M̄-tio̍h ê tan-guân tńg-khì ke liān-si̍p, miâ-á-tsài ē-sái koh lâi khó.", huayu: "答錯的單元回去多練習，明天可以再來考。" } },
    { who: "volunteer_zl", emotion: "開心", text: "用現在的職業，一樣能打倒魔王喔！", taigi: { hanji: "用這馬的職業，仝款會當拍贏魔王喔！", tailo: "Īng tsit-má ê tsit-gia̍p, kāng-khuán ē-tàng phah-iânn môo-ông--ooh!", huayu: "用現在的職業，一樣能打倒魔王喔！" } }
  ],
  D_TRIAL2_INTRO_LK: [
    { who: "volunteer_lk", emotion: "平靜", text: "想當中級職業，也要先考立志小考喔。", taigi: { hanji: "欲做中級職業，嘛愛先考立志小考喔。", tailo: "Beh tsò tiong-kip tsit-gia̍p, mā ài sing khó li̍p-tsì sió-khó--ooh.", huayu: "想當中級職業，也要先考立志小考喔。" } },
    { who: "volunteer_lk", emotion: "平靜", text: "總共 20 題，五科每科 4 題，答對 18 題才過關。", taigi: { hanji: "攏總二十題，五科逐科四題，回答著十八題才過關。", tailo: "Lóng-tsóng jī-tsa̍p tê, gōo kho ta̍k kho sì tê, huê-tap tio̍h tsa̍p-peh tê tsiah kuè-kuan.", huayu: "總共 20 題，五科每科 4 題，答對 18 題才過關。" } },
    { who: "volunteer_lk", emotion: "平靜", text: "題目比較難，每題的時間也比較短喔。", taigi: { hanji: "題目較僫，逐題的時間嘛較短喔。", tailo: "Tê-bo̍k khah oh, ta̍k tê ê sî-kan mā khah té--ooh.", huayu: "題目比較難，每題的時間也比較短喔。" } },
    { who: "volunteer_lk", emotion: "平靜", text: "題目會念給你聽，念完才開始算時間。", taigi: { hanji: "題目會念予你聽，念了才開始算時間。", tailo: "Tê-bo̍k ē liām hōo lí thiann, liām liáu tsiah khai-sí sǹg sî-kan.", huayu: "題目會念給你聽，念完才開始算時間。" } },
    { who: "volunteer_lk", emotion: "平靜", text: "提示和卡片不能用；中途離開也算考一次。", taigi: { hanji: "提示佮卡片袂使用；中途離開，嘛算考一擺。", tailo: "Thê-sī kah khah-phìnn bē-sái īng; tiong-tôo lī-khui, mā sǹg khó tsi̍t pái.", huayu: "提示和卡片不能用；中途離開也算考一次。" } },
    { who: "pet", emotion: "開心", text: "題目有 2 顆星和 3 顆星，三上、三下都有。一起加油！" }
  ],
  D_TRIAL2_FAIL_LK: [
    { who: "volunteer_lk", emotion: "平靜", text: "這次還沒過，沒關係。", taigi: { hanji: "這擺猶未過關，無要緊。", tailo: "Tsit pái iáu-buē kuè-kuan, bô iàu-kín.", huayu: "這次還沒過，沒關係。" } },
    { who: "volunteer_lk", emotion: "平靜", text: "答錯的單元回去多練習，明天可以再來考。", taigi: { hanji: "毋著的單元轉去加練習，明仔載會使閣來考。", tailo: "M̄-tio̍h ê tan-guân tńg-khì ke liān-si̍p, miâ-á-tsài ē-sái koh lâi khó.", huayu: "答錯的單元回去多練習，明天可以再來考。" } },
    { who: "volunteer_lk", emotion: "開心", text: "用現在的職業，一樣能打倒魔王喔！", taigi: { hanji: "用這馬的職業，仝款會當拍贏魔王喔！", tailo: "Īng tsit-má ê tsit-gia̍p, kāng-khuán ē-tàng phah-iânn môo-ông--ooh!", huayu: "用現在的職業，一樣能打倒魔王喔！" } }
  ],
  D_TRIAL2_INTRO_CT: [
    { who: "volunteer_ct", emotion: "平靜", text: "想當中級職業，也要先考立志小考喔。", taigi: { hanji: "欲做中級職業，嘛愛先考立志小考喔。", tailo: "Beh tsò tiong-kip tsit-gia̍p, mā ài sing khó li̍p-tsì sió-khó--ooh.", huayu: "想當中級職業，也要先考立志小考喔。" } },
    { who: "volunteer_ct", emotion: "平靜", text: "總共 20 題，五科每科 4 題，答對 18 題才過關。", taigi: { hanji: "攏總二十題，五科逐科四題，回答著十八題才過關。", tailo: "Lóng-tsóng jī-tsa̍p tê, gōo kho ta̍k kho sì tê, huê-tap tio̍h tsa̍p-peh tê tsiah kuè-kuan.", huayu: "總共 20 題，五科每科 4 題，答對 18 題才過關。" } },
    { who: "volunteer_ct", emotion: "平靜", text: "題目比較難，每題的時間也比較短喔。", taigi: { hanji: "題目較僫，逐題的時間嘛較短喔。", tailo: "Tê-bo̍k khah oh, ta̍k tê ê sî-kan mā khah té--ooh.", huayu: "題目比較難，每題的時間也比較短喔。" } },
    { who: "volunteer_ct", emotion: "平靜", text: "題目會念給你聽，念完才開始算時間。", taigi: { hanji: "題目會念予你聽，念了才開始算時間。", tailo: "Tê-bo̍k ē liām hōo lí thiann, liām liáu tsiah khai-sí sǹg sî-kan.", huayu: "題目會念給你聽，念完才開始算時間。" } },
    { who: "volunteer_ct", emotion: "平靜", text: "提示和卡片不能用；中途離開也算考一次。", taigi: { hanji: "提示佮卡片袂使用；中途離開，嘛算考一擺。", tailo: "Thê-sī kah khah-phìnn bē-sái īng; tiong-tôo lī-khui, mā sǹg khó tsi̍t pái.", huayu: "提示和卡片不能用；中途離開也算考一次。" } },
    { who: "pet", emotion: "開心", text: "題目有 2 顆星和 3 顆星，三上、三下都有。一起加油！" }
  ],
  D_TRIAL2_FAIL_CT: [
    { who: "volunteer_ct", emotion: "平靜", text: "這次還沒過，沒關係。", taigi: { hanji: "這擺猶未過關，無要緊。", tailo: "Tsit pái iáu-buē kuè-kuan, bô iàu-kín.", huayu: "這次還沒過，沒關係。" } },
    { who: "volunteer_ct", emotion: "平靜", text: "答錯的單元回去多練習，明天可以再來考。", taigi: { hanji: "毋著的單元轉去加練習，明仔載會使閣來考。", tailo: "M̄-tio̍h ê tan-guân tńg-khì ke liān-si̍p, miâ-á-tsài ē-sái koh lâi khó.", huayu: "答錯的單元回去多練習，明天可以再來考。" } },
    { who: "volunteer_ct", emotion: "開心", text: "用現在的職業，一樣能打倒魔王喔！", taigi: { hanji: "用這馬的職業，仝款會當拍贏魔王喔！", tailo: "Īng tsit-má ê tsit-gia̍p, kāng-khuán ē-tàng phah-iânn môo-ông--ooh!", huayu: "用現在的職業，一樣能打倒魔王喔！" } }
  ],
  D_TRIAL2_INTRO_WD: [
    { who: "volunteer_wd", emotion: "平靜", text: "想當中級職業，也要先考立志小考喔。", taigi: { hanji: "欲做中級職業，嘛愛先考立志小考喔。", tailo: "Beh tsò tiong-kip tsit-gia̍p, mā ài sing khó li̍p-tsì sió-khó--ooh.", huayu: "想當中級職業，也要先考立志小考喔。" } },
    { who: "volunteer_wd", emotion: "平靜", text: "總共 20 題，五科每科 4 題，答對 18 題才過關。", taigi: { hanji: "攏總二十題，五科逐科四題，回答著十八題才過關。", tailo: "Lóng-tsóng jī-tsa̍p tê, gōo kho ta̍k kho sì tê, huê-tap tio̍h tsa̍p-peh tê tsiah kuè-kuan.", huayu: "總共 20 題，五科每科 4 題，答對 18 題才過關。" } },
    { who: "volunteer_wd", emotion: "平靜", text: "題目比較難，每題的時間也比較短喔。", taigi: { hanji: "題目較僫，逐題的時間嘛較短喔。", tailo: "Tê-bo̍k khah oh, ta̍k tê ê sî-kan mā khah té--ooh.", huayu: "題目比較難，每題的時間也比較短喔。" } },
    { who: "volunteer_wd", emotion: "平靜", text: "題目會念給你聽，念完才開始算時間。", taigi: { hanji: "題目會念予你聽，念了才開始算時間。", tailo: "Tê-bo̍k ē liām hōo lí thiann, liām liáu tsiah khai-sí sǹg sî-kan.", huayu: "題目會念給你聽，念完才開始算時間。" } },
    { who: "volunteer_wd", emotion: "平靜", text: "提示和卡片不能用；中途離開也算考一次。", taigi: { hanji: "提示佮卡片袂使用；中途離開，嘛算考一擺。", tailo: "Thê-sī kah khah-phìnn bē-sái īng; tiong-tôo lī-khui, mā sǹg khó tsi̍t pái.", huayu: "提示和卡片不能用；中途離開也算考一次。" } },
    { who: "pet", emotion: "開心", text: "題目有 2 顆星和 3 顆星，三上、三下都有。一起加油！" }
  ],
  D_TRIAL2_FAIL_WD: [
    { who: "volunteer_wd", emotion: "平靜", text: "這次還沒過，沒關係。", taigi: { hanji: "這擺猶未過關，無要緊。", tailo: "Tsit pái iáu-buē kuè-kuan, bô iàu-kín.", huayu: "這次還沒過，沒關係。" } },
    { who: "volunteer_wd", emotion: "平靜", text: "答錯的單元回去多練習，明天可以再來考。", taigi: { hanji: "毋著的單元轉去加練習，明仔載會使閣來考。", tailo: "M̄-tio̍h ê tan-guân tńg-khì ke liān-si̍p, miâ-á-tsài ē-sái koh lâi khó.", huayu: "答錯的單元回去多練習，明天可以再來考。" } },
    { who: "volunteer_wd", emotion: "開心", text: "用現在的職業，一樣能打倒魔王喔！", taigi: { hanji: "用這馬的職業，仝款會當拍贏魔王喔！", tailo: "Īng tsit-má ê tsit-gia̍p, kāng-khuán ē-tàng phah-iânn môo-ông--ooh!", huayu: "用現在的職業，一樣能打倒魔王喔！" } }
  ],
  D_TRIAL2_INTRO_LEM: [
    { who: "volunteer_lem", emotion: "平靜", text: "想當中級職業，也要先考立志小考喔。", taigi: { hanji: "欲做中級職業，嘛愛先考立志小考喔。", tailo: "Beh tsò tiong-kip tsit-gia̍p, mā ài sing khó li̍p-tsì sió-khó--ooh.", huayu: "想當中級職業，也要先考立志小考喔。" } },
    { who: "volunteer_lem", emotion: "平靜", text: "總共 20 題，五科每科 4 題，答對 18 題才過關。", taigi: { hanji: "攏總二十題，五科逐科四題，回答著十八題才過關。", tailo: "Lóng-tsóng jī-tsa̍p tê, gōo kho ta̍k kho sì tê, huê-tap tio̍h tsa̍p-peh tê tsiah kuè-kuan.", huayu: "總共 20 題，五科每科 4 題，答對 18 題才過關。" } },
    { who: "volunteer_lem", emotion: "平靜", text: "題目比較難，每題的時間也比較短喔。", taigi: { hanji: "題目較僫，逐題的時間嘛較短喔。", tailo: "Tê-bo̍k khah oh, ta̍k tê ê sî-kan mā khah té--ooh.", huayu: "題目比較難，每題的時間也比較短喔。" } },
    { who: "volunteer_lem", emotion: "平靜", text: "題目會念給你聽，念完才開始算時間。", taigi: { hanji: "題目會念予你聽，念了才開始算時間。", tailo: "Tê-bo̍k ē liām hōo lí thiann, liām liáu tsiah khai-sí sǹg sî-kan.", huayu: "題目會念給你聽，念完才開始算時間。" } },
    { who: "volunteer_lem", emotion: "平靜", text: "提示和卡片不能用；中途離開也算考一次。", taigi: { hanji: "提示佮卡片袂使用；中途離開，嘛算考一擺。", tailo: "Thê-sī kah khah-phìnn bē-sái īng; tiong-tôo lī-khui, mā sǹg khó tsi̍t pái.", huayu: "提示和卡片不能用；中途離開也算考一次。" } },
    { who: "pet", emotion: "開心", text: "題目有 2 顆星和 3 顆星，三上、三下都有。一起加油！" }
  ],
  D_TRIAL2_FAIL_LEM: [
    { who: "volunteer_lem", emotion: "平靜", text: "這次還沒過，沒關係。", taigi: { hanji: "這擺猶未過關，無要緊。", tailo: "Tsit pái iáu-buē kuè-kuan, bô iàu-kín.", huayu: "這次還沒過，沒關係。" } },
    { who: "volunteer_lem", emotion: "平靜", text: "答錯的單元回去多練習，明天可以再來考。", taigi: { hanji: "毋著的單元轉去加練習，明仔載會使閣來考。", tailo: "M̄-tio̍h ê tan-guân tńg-khì ke liān-si̍p, miâ-á-tsài ē-sái koh lâi khó.", huayu: "答錯的單元回去多練習，明天可以再來考。" } },
    { who: "volunteer_lem", emotion: "開心", text: "用現在的職業，一樣能打倒魔王喔！", taigi: { hanji: "用這馬的職業，仝款會當拍贏魔王喔！", tailo: "Īng tsit-má ê tsit-gia̍p, kāng-khuán ē-tàng phah-iânn môo-ông--ooh!", huayu: "用現在的職業，一樣能打倒魔王喔！" } }
  ],
  D_TRIAL2_INTRO_FGS: [
    { who: "volunteer_fgs", emotion: "平靜", text: "想當中級職業，也要先考立志小考喔。", taigi: { hanji: "欲做中級職業，嘛愛先考立志小考喔。", tailo: "Beh tsò tiong-kip tsit-gia̍p, mā ài sing khó li̍p-tsì sió-khó--ooh.", huayu: "想當中級職業，也要先考立志小考喔。" } },
    { who: "volunteer_fgs", emotion: "平靜", text: "總共 20 題，五科每科 4 題，答對 18 題才過關。", taigi: { hanji: "攏總二十題，五科逐科四題，回答著十八題才過關。", tailo: "Lóng-tsóng jī-tsa̍p tê, gōo kho ta̍k kho sì tê, huê-tap tio̍h tsa̍p-peh tê tsiah kuè-kuan.", huayu: "總共 20 題，五科每科 4 題，答對 18 題才過關。" } },
    { who: "volunteer_fgs", emotion: "平靜", text: "題目比較難，每題的時間也比較短喔。", taigi: { hanji: "題目較僫，逐題的時間嘛較短喔。", tailo: "Tê-bo̍k khah oh, ta̍k tê ê sî-kan mā khah té--ooh.", huayu: "題目比較難，每題的時間也比較短喔。" } },
    { who: "volunteer_fgs", emotion: "平靜", text: "題目會念給你聽，念完才開始算時間。", taigi: { hanji: "題目會念予你聽，念了才開始算時間。", tailo: "Tê-bo̍k ē liām hōo lí thiann, liām liáu tsiah khai-sí sǹg sî-kan.", huayu: "題目會念給你聽，念完才開始算時間。" } },
    { who: "volunteer_fgs", emotion: "平靜", text: "提示和卡片不能用；中途離開也算考一次。", taigi: { hanji: "提示佮卡片袂使用；中途離開，嘛算考一擺。", tailo: "Thê-sī kah khah-phìnn bē-sái īng; tiong-tôo lī-khui, mā sǹg khó tsi̍t pái.", huayu: "提示和卡片不能用；中途離開也算考一次。" } },
    { who: "pet", emotion: "開心", text: "題目有 2 顆星和 3 顆星，三上、三下都有。一起加油！" }
  ],
  D_TRIAL2_FAIL_FGS: [
    { who: "volunteer_fgs", emotion: "平靜", text: "這次還沒過，沒關係。", taigi: { hanji: "這擺猶未過關，無要緊。", tailo: "Tsit pái iáu-buē kuè-kuan, bô iàu-kín.", huayu: "這次還沒過，沒關係。" } },
    { who: "volunteer_fgs", emotion: "平靜", text: "答錯的單元回去多練習，明天可以再來考。", taigi: { hanji: "毋著的單元轉去加練習，明仔載會使閣來考。", tailo: "M̄-tio̍h ê tan-guân tńg-khì ke liān-si̍p, miâ-á-tsài ē-sái koh lâi khó.", huayu: "答錯的單元回去多練習，明天可以再來考。" } },
    { who: "volunteer_fgs", emotion: "開心", text: "用現在的職業，一樣能打倒魔王喔！", taigi: { hanji: "用這馬的職業，仝款會當拍贏魔王喔！", tailo: "Īng tsit-má ê tsit-gia̍p, kāng-khuán ē-tàng phah-iânn môo-ông--ooh!", huayu: "用現在的職業，一樣能打倒魔王喔！" } }
  ],
  // ═════════════ v2.1 2 轉台詞 END ═════════════

  // ═════════════ v3.0 南部（70 號 4.6；劇本語音組草稿 wip_v30_draft/dialogs_south.js，沒有的先用佔位句；v30_apply.js 每次重跑都整段重建）BEGIN ═════════════
  D_FC_1A: [
    { who: "librarian", emotion: "平靜", text: "你要找寫植物的古書嗎？", huayu_only: true, taigi_draft: { hanji: "你欲揣寫植物的古冊無？", tailo: "Lí beh tshuē siá si̍t-bu̍t ê kóo-tsheh--bô?", huayu: "你要找寫植物的古書嗎？" } },
    { who: "librarian", emotion: "擔心", text: "可是霧把書弄亂了，字都看不到。", huayu_only: true, taigi_draft: { hanji: "毋過霧共冊舞甲亂操操，字攏看無。", tailo: "M̄-koh bū kā tsheh bú kah luān-tshau-tshau, jī lóng khuànn-bô.", huayu: "可是霧把書弄亂了，字都看不到。" } },
    { who: "librarian", emotion: "擔心", text: "幫我想起植物的知識，答對 3 題好嗎？", huayu_only: true, taigi_draft: { hanji: "共我想起植物的智識，回答著三題，好無？", tailo: "Kā guá siūnn-khí si̍t-bu̍t ê tì-sik, huê-tap tio̍h sann tê, hó--bô?", huayu: "幫我想起植物的知識，答對 3 題好嗎？" } }
  ],
  D_FC_1B: [
    { who: "librarian", emotion: "開心", text: "找到了！古書上面有寫樹王的病。", huayu_only: true, taigi_draft: { hanji: "揣著矣！古冊頂懸有寫樹王的病。", tailo: "Tshuē--tio̍h--ah! Kóo-tsheh tíng-kuân ū siá tshiū-ông ê pēnn.", huayu: "找到了！古書上面有寫樹王的病。" } },
    { who: "librarian", emotion: "平靜", text: "古書說，答對自然的題目，樹王就會清醒。", huayu_only: true, taigi_draft: { hanji: "古冊講，回答著自然的題目，樹王就會清醒。", tailo: "Kóo-tsheh kóng, huê-tap tio̍h tsū-jiân ê tê-bo̍k, tshiū-ông tō ē tshing-tshínn.", huayu: "古書說，答對自然的題目，樹王就會清醒。" } },
    { who: "pet", emotion: "開心", text: "帶著古書，回神木森林吧！" }
  ],
  D_FC_1_LOCK: [
    { who: "librarian", emotion: "平靜", text: "先去東邊的森林幫忙，再來找我。", huayu_only: true, taigi_draft: { hanji: "先去東爿的樹林鬥相共，才閣來揣我。", tailo: "Sing khì tang-pîng ê tshiū-nâ tàu-sann-kāng, tsiah-koh lâi tshuē guá.", huayu: "先去東邊的森林幫忙，再來找我。" } },
    { who: "pet", emotion: "平靜", text: "神木森林的精靈長老，好像需要幫忙！" }
  ],
  D_AL_1A: [
    { who: "forest_rail", emotion: "開心", text: "歡迎來嘉義！你有坐過山上的小火車嗎？", huayu_only: true, taigi_draft: { hanji: "歡迎來嘉義！你敢有坐過山頂的小火車？", tailo: "Huan-gîng lâi Ka-gī! Lí kám ū tsē--kuè suann-tíng ê sió hué-tshia?", huayu: "歡迎來嘉義！你有坐過山上的小火車嗎？" } },
    { who: "forest_rail", emotion: "平靜", text: "小火車從嘉義出發，一路開到阿里山。", huayu_only: true, taigi_draft: { hanji: "小火車對嘉義出發，一路駛到阿里山。", tailo: "Sió hué-tshia tuì Ka-gī tshut-huat, tsi̍t-lōo sái kàu A-lí-san.", huayu: "小火車從嘉義出發，一路開到阿里山。" } },
    { who: "pet", emotion: "開心", text: "沿路有 47 個隧道、72 座橋喔！" },
    { who: "forest_rail", emotion: "平靜", text: "以前它載木頭，現在載大家去看風景。", huayu_only: true, taigi_draft: { hanji: "較早伊載柴，這馬載逐家去看風景。", tailo: "Khah-tsá i tsài tshâ, tsit-má tsài ta̍k-ke khì khuànn hong-kíng.", huayu: "以前它載木頭，現在載大家去看風景。" } },
    { who: "forest_rail", emotion: "擔心", text: "霧讓我排不好火車的時間，幫我算 3 題好嗎？", huayu_only: true, taigi_draft: { hanji: "霧予我排袂好火車的時間，共我算三題，好無？", tailo: "Bū hōo guá pâi bē hó hué-tshia ê sî-kan, kā guá sǹg sann tê, hó--bô?", huayu: "霧讓我排不好火車的時間，幫我算 3 題好嗎？" } }
  ],
  D_AL_1B: [
    { who: "forest_rail", emotion: "開心", text: "時間排好了，謝謝你！", huayu_only: true, taigi_draft: { hanji: "時間排好矣，多謝你！", tailo: "Sî-kan pâi hó--ah, to-siā--lí!", huayu: "時間排好了，謝謝你！" } },
    { who: "forest_rail", emotion: "開心", text: "這些金幣送你，謝謝你！", taigi: { hanji: "這寡金幣送你，多謝你！", tailo: "Tsit-kuá kim-pè sàng lí, to-siā--lí!", huayu: "這些金幣送你，謝謝你！" } },
    { who: "pet", emotion: "開心", text: "聽說阿里山的日出和雲海，都很美喔！" }
  ],
  D_AL_1_LOCK: [
    { who: "forest_rail", emotion: "平靜", text: "先去森林北邊幫忙，再來找我。", huayu_only: true, taigi_draft: { hanji: "先去樹林北爿鬥相共，才閣來揣我。", tailo: "Sing khì tshiū-nâ pak-pîng tàu-sann-kāng, tsiah-koh lâi tshuē guá.", huayu: "先去森林北邊幫忙，再來找我。" } },
    { who: "pet", emotion: "平靜", text: "樹屋村的精靈長老，好像需要幫忙！" }
  ],
  D_AP_1A: [
    { who: "harbor_clerk", emotion: "開心", text: "歡迎來到安平的港口！", huayu_only: true, taigi_draft: { hanji: "歡迎來安平的港口！", tailo: "Huan-gîng lâi An-pîng ê káng-kháu!", huayu: "歡迎來到安平的港口！" } },
    { who: "harbor_clerk", emotion: "擔心", text: "霧來了以後，外國的船長都忘了自己的名字。", huayu_only: true, taigi_draft: { hanji: "霧來了後，外國的船長攏袂記得家己的名。", tailo: "Bū lâi liáu-āu, guā-kok ê tsûn-tiúnn lóng bē-kì-tit ka-kī ê miâ.", huayu: "霧來了以後，外國的船長都忘了自己的名字。" } },
    { who: "harbor_clerk", emotion: "擔心", text: "幫我用英語和船長打招呼，答對 3 題好嗎？", huayu_only: true, taigi_draft: { hanji: "共我用英語佮船長相借問，回答著三題，好無？", tailo: "Kā guá īng Ing-gí kah tsûn-tiúnn sio-tsioh-mn̄g, huê-tap tio̍h sann tê, hó--bô?", huayu: "幫我用英語和船長打招呼，答對 3 題好嗎？" } }
  ],
  D_AP_1B: [
    { who: "harbor_clerk", emotion: "開心", text: "船長都想起自己的名字了！", huayu_only: true, taigi_draft: { hanji: "船長攏想起家己的名矣！", tailo: "Tsûn-tiúnn lóng siūnn-khí ka-kī ê miâ--ah!", huayu: "船長都想起自己的名字了！" } },
    { who: "harbor_clerk", emotion: "擔心", text: "可是海賊把大家的寶貝搶走了。", huayu_only: true, taigi_draft: { hanji: "毋過海賊共逐家的寶貝搶去矣。", tailo: "M̄-koh hái-tsha̍t kā ta̍k-ke ê pó-puè tshiúnn--khì--ah.", huayu: "可是海賊把大家的寶貝搶走了。" } },
    { who: "pet", emotion: "驚訝", text: "是霧帆海賊團！大家的記憶貝殼被搶走了！" },
    { who: "harbor_clerk", emotion: "平靜", text: "古堡和老房子的人，也忘了安平的故事。", huayu_only: true, taigi_draft: { hanji: "古堡佮舊厝的人，嘛袂記得安平的故事。", tailo: "Kóo-pó kah kū-tshù ê lâng, mā bē-kì-tit An-pîng ê kòo-sū.", huayu: "古堡和老房子的人，也忘了安平的故事。" } },
    { who: "pet", emotion: "平靜", text: "去聽古堡解說員和老屋阿伯說故事吧！" }
  ],
  D_AP_2A: [
    { who: "pet", emotion: "開心", text: "這裡是安平古堡！" },
    { who: "fort_guide", emotion: "平靜", text: "四百多年前，這裡就蓋了一座城。", huayu_only: true, taigi_draft: { hanji: "四百外年前，遮就起一座城矣。", tailo: "Sì-pah guā nî tsîng, tsia tō khí tsi̍t tsō siânn--ah.", huayu: "四百多年前，這裡就蓋了一座城。" } },
    { who: "pet", emotion: "開心", text: "是荷蘭人蓋的熱蘭遮堡！" },
    { who: "fort_guide", emotion: "平靜", text: "後來，這裡改名叫做「安平鎮」。", huayu_only: true, taigi_draft: { hanji: "後來，遮改名叫做「安平鎮」。", tailo: "Āu--lâi, tsia kái miâ kiò-tsò “An-pîng-tìn”.", huayu: "後來，這裡改名叫做「安平鎮」。" } },
    { who: "fort_guide", emotion: "平靜", text: "這段紅磚牆，是那時候留到今天的。", huayu_only: true, taigi_draft: { hanji: "這段紅磚仔牆，是彼時留到今仔日的。", tailo: "Tsit tuānn âng tsng-á tshiûnn, sī hit-sî lâu kàu kin-á-ji̍t--ê.", huayu: "這段紅磚牆，是那時候留到今天的。" } },
    { who: "fort_guide", emotion: "擔心", text: "霧讓我忘了這裡的故事，幫我想 2 題好嗎？", taigi: { hanji: "霧予我袂記得遮的故事，共我想兩題，好無？", tailo: "Bū hōo guá bē-kì-tit tsia ê kòo-sū, kā guá siūnn nn̄g tê, hó--bô?", huayu: "霧讓我忘了這裡的故事，幫我想 2 題好嗎？" } }
  ],
  D_AP_2B: [
    { who: "fort_guide", emotion: "開心", text: "你都答對了，聽得真認真！", taigi: { hanji: "你攏回答著矣，聽甲真認真！", tailo: "Lí lóng huê-tap tio̍h--ah, thiann kah tsin jīn-tsin!", huayu: "你都答對了，聽得真認真！" } },
    { who: "fort_guide", emotion: "開心", text: "這些金幣送你，謝謝你！", taigi: { hanji: "這寡金幣送你，多謝你！", tailo: "Tsit-kuá kim-pè sàng lí, to-siā--lí!", huayu: "這些金幣送你，謝謝你！" } }
  ],
  D_AP_2_LOCK: [
    { who: "fort_guide", emotion: "平靜", text: "先去碼頭找港口的人，再來找我。", huayu_only: true, taigi_draft: { hanji: "先去碼頭揣港口的人，才閣來揣我。", tailo: "Sing khì bé-thâu tshuē káng-kháu ê lâng, tsiah-koh lâi tshuē guá.", huayu: "先去碼頭找港口的人，再來找我。" } },
    { who: "pet", emotion: "平靜", text: "碼頭的港口書記，好像需要幫忙！" }
  ],
  D_AP_3A: [
    { who: "oldhouse_grandpa", emotion: "開心", text: "你看，我家門上面有一隻獅子咬劍。", huayu_only: true, taigi_draft: { hanji: "你看，阮兜門頂懸有一隻獅咬劍。", tailo: "Lí khuànn, guán tau mn̂g tíng-kuân ū tsi̍t tsiah sai kā kiàm.", huayu: "你看，我家門上面有一隻獅子咬劍。" } },
    { who: "pet", emotion: "驚訝", text: "是劍獅！" },
    { who: "oldhouse_grandpa", emotion: "平靜", text: "以前的人說，士兵回家會把武器掛在門口。", huayu_only: true, taigi_draft: { hanji: "以前的人講，兵仔轉來會共家私掛佇門口。", tailo: "Í-tsîng ê lâng kóng, ping-á tńg--lâi ē kā ke-si kuà tī mn̂g-kháu.", huayu: "以前的人說，士兵回家會把武器掛在門口。" } },
    { who: "pet", emotion: "開心", text: "是刻著獅子臉的盾牌和長劍！" },
    { who: "oldhouse_grandpa", emotion: "平靜", text: "遠遠看，就像獅子咬著劍一樣。", huayu_only: true, taigi_draft: { hanji: "遠遠看，就親像獅咬劍仝款。", tailo: "Hn̄g-hn̄g khuànn, tō tshin-tshiūnn sai kā kiàm kāng-khuán.", huayu: "遠遠看，就像獅子咬著劍一樣。" } },
    { who: "oldhouse_grandpa", emotion: "擔心", text: "霧讓我說不清楚，幫我想 2 題好嗎？", huayu_only: true, taigi_draft: { hanji: "霧予我講袂清楚，共我想兩題，好無？", tailo: "Bū hōo guá kóng bē tshing-tshó, kā guá siūnn nn̄g tê, hó--bô?", huayu: "霧讓我說不清楚，幫我想 2 題好嗎？" } }
  ],
  D_AP_3B: [
    { who: "oldhouse_grandpa", emotion: "開心", text: "想起來了！謝謝你幫忙。", taigi: { hanji: "想起來矣！多謝你鬥相共。", tailo: "Siūnn khí-lâi--ah! To-siā lí tàu-sann-kāng.", huayu: "想起來了！謝謝你幫忙。" } },
    { who: "oldhouse_grandpa", emotion: "開心", text: "安平還有蝦餅、豆花，都很好吃喔。", huayu_only: true, taigi_draft: { hanji: "安平閣有蝦餅、豆花，攏真好食喔。", tailo: "An-pîng koh ū hê-piánn, tāu-hue, lóng tsin hó-tsia̍h--ooh.", huayu: "安平還有蝦餅、豆花，都很好吃喔。" } },
    { who: "oldhouse_grandpa", emotion: "開心", text: "這些金幣送你，謝謝你！", taigi: { hanji: "這寡金幣送你，多謝你！", tailo: "Tsit-kuá kim-pè sàng lí, to-siā--lí!", huayu: "這些金幣送你，謝謝你！" } }
  ],
  D_AP_3_LOCK: [
    { who: "oldhouse_grandpa", emotion: "平靜", text: "先去碼頭找港口的人，再來找我。", huayu_only: true, taigi_draft: { hanji: "先去碼頭揣港口的人，才閣來揣我。", tailo: "Sing khì bé-thâu tshuē káng-kháu ê lâng, tsiah-koh lâi tshuē guá.", huayu: "先去碼頭找港口的人，再來找我。" } },
    { who: "pet", emotion: "平靜", text: "碼頭的港口書記，好像需要幫忙！" }
  ],
  D_AP_4A: [
    { who: "harbor_clerk", emotion: "開心", text: "大家的故事都想起來了，謝謝你！", huayu_only: true, taigi_draft: { hanji: "逐家的故事攏想起來矣，多謝你！", tailo: "Ta̍k-ke ê kòo-sū lóng siūnn khí-lâi--ah, to-siā--lí!", huayu: "大家的故事都想起來了，謝謝你！" } },
    { who: "harbor_clerk", emotion: "擔心", text: "可是我的地圖，被海賊搶走了。", huayu_only: true, taigi_draft: { hanji: "毋過我的地圖，予海賊搶去矣。", tailo: "M̄-koh guá ê tē-tôo, hōo hái-tsha̍t tshiúnn--khì--ah.", huayu: "可是我的地圖，被海賊搶走了。" } },
    { who: "pet", emotion: "驚訝", text: "是航海圖！錨錨大副守在碼頭最前面！" },
    { who: "harbor_clerk", emotion: "平靜", text: "讓它清醒，把地圖拿回來好嗎？", huayu_only: true, taigi_draft: { hanji: "予伊清醒，共地圖提轉來，好無？", tailo: "Hōo i tshing-tshínn, kā tē-tôo the̍h tńg--lâi, hó--bô?", huayu: "讓它清醒，把地圖拿回來好嗎？" } }
  ],
  D_AP_4B: [
    { who: "harbor_clerk", emotion: "開心", text: "是我的地圖！謝謝你！", huayu_only: true, taigi_draft: { hanji: "是我的地圖！多謝你！", tailo: "Sī guá ê tē-tôo! To-siā--lí!", huayu: "是我的地圖！謝謝你！" } },
    { who: "harbor_clerk", emotion: "平靜", text: "上面有畫往北邊的路。", huayu_only: true, taigi_draft: { hanji: "頂懸有畫去北爿的路。", tailo: "Tíng-kuân ū uē khì pak-pîng ê lōo.", huayu: "上面有畫往北邊的路。" } },
    { who: "harbor_clerk", emotion: "擔心", text: "海賊的船，好像躲在那裡。", huayu_only: true, taigi_draft: { hanji: "海賊的船，敢若覕佇遐。", tailo: "Hái-tsha̍t ê tsûn, kánn-ná bih tī hia.", huayu: "海賊的船，好像躲在那裡。" } },
    { who: "pet", emotion: "開心", text: "過橋往北走，就是鹿耳門台江了！" }
  ],
  D_AP_4_LOCK: [
    { who: "harbor_clerk", emotion: "平靜", text: "先去聽古堡和老房子的故事，再來找我。", huayu_only: true, taigi_draft: { hanji: "先去聽古堡佮舊厝的故事，才閣來揣我。", tailo: "Sing khì thiann kóo-pó kah kū-tshù ê kòo-sū, tsiah-koh lâi tshuē guá.", huayu: "先去聽古堡和老房子的故事，再來找我。" } }
  ],
  D_LE_1A: [
    { who: "wetland_ranger", emotion: "開心", text: "歡迎！這裡有很大片的溼地和紅樹林。", huayu_only: true, taigi_draft: { hanji: "歡迎！遮有真大片的溼地佮紅樹林。", tailo: "Huan-gîng! Tsia ū tsin tuā phìnn ê sip-tē kah âng-tshiū-nâ.", huayu: "歡迎！這裡有很大片的溼地和紅樹林。" } },
    { who: "pet", emotion: "開心", text: "這裡是台江國家公園！" },
    { who: "wetland_ranger", emotion: "平靜", text: "冬天的時候，黑面琵鷺會來這裡住。", huayu_only: true, taigi_draft: { hanji: "寒天的時，烏面抐桮會來遮蹛。", tailo: "Kuânn-thinn ê sî, oo-bīn-lā-pue ē lâi tsia tuà.", huayu: "冬天的時候，黑面琵鷺會來這裡住。" } },
    { who: "wetland_ranger", emotion: "平靜", text: "全世界的黑面琵鷺，來這裡過冬的最多喔。", huayu_only: true, taigi_draft: { hanji: "全世界的烏面抐桮，來遮過寒天的上濟喔。", tailo: "Tsuân sè-kài ê oo-bīn-lā-pue, lâi tsia kuè kuânn-thinn--ê siōng tsē--ooh.", huayu: "全世界的黑面琵鷺，來這裡過冬的最多喔。" } },
    { who: "wetland_ranger", emotion: "擔心", text: "霧讓我忘了怎麼介紹，幫我想 2 題好嗎？", huayu_only: true, taigi_draft: { hanji: "霧予我袂記得按怎紹介，共我想兩題，好無？", tailo: "Bū hōo guá bē-kì-tit án-tsuánn siāu-kài, kā guá siūnn nn̄g tê, hó--bô?", huayu: "霧讓我忘了怎麼介紹，幫我想 2 題好嗎？" } }
  ],
  D_LE_1B: [
    { who: "wetland_ranger", emotion: "開心", text: "你都答對了，聽得真認真！", taigi: { hanji: "你攏回答著矣，聽甲真認真！", tailo: "Lí lóng huê-tap tio̍h--ah, thiann kah tsin jīn-tsin!", huayu: "你都答對了，聽得真認真！" } },
    { who: "pet", emotion: "開心", text: "牠們飛的時候脖子伸直，叫做「黑面舞者」！" },
    { who: "wetland_ranger", emotion: "平靜", text: "看鳥不要靠太近，別讓鳥兒嚇到。", huayu_only: true, taigi_draft: { hanji: "看鳥仔毋通倚傷近，莫予鳥仔著驚。", tailo: "Khuànn tsiáu-á m̄-thang uá siunn kīn, mài hōo tsiáu-á tio̍h-kiann.", huayu: "看鳥不要靠太近，別讓鳥兒嚇到。" } },
    { who: "wetland_ranger", emotion: "開心", text: "這些金幣送你，謝謝你！", taigi: { hanji: "這寡金幣送你，多謝你！", tailo: "Tsit-kuá kim-pè sàng lí, to-siā--lí!", huayu: "這些金幣送你，謝謝你！" } }
  ],
  D_LE_2A: [
    { who: "wetland_ranger", emotion: "平靜", text: "這個國家公園，是民國 98 年成立的。", huayu_only: true, taigi_draft: { hanji: "這个國家公園，是民國九十八年成立的。", tailo: "Tsit ê kok-ka kong-hn̂g, sī Bîn-kok káu-tsa̍p-peh nî sîng-li̍p--ê.", huayu: "這個國家公園，是民國 98 年成立的。" } },
    { who: "wetland_ranger", emotion: "平靜", text: "有四條溪，從這裡流進大海。", huayu_only: true, taigi_draft: { hanji: "有四條溪，對遮流入去大海。", tailo: "Ū sì tiâu khe, tuì tsia lâu ji̍p-khì tuā-hái.", huayu: "有四條溪，從這裡流進大海。" } },
    { who: "wetland_ranger", emotion: "擔心", text: "霧讓我忘了這裡的故事，幫我想 2 題好嗎？", taigi: { hanji: "霧予我袂記得遮的故事，共我想兩題，好無？", tailo: "Bū hōo guá bē-kì-tit tsia ê kòo-sū, kā guá siūnn nn̄g tê, hó--bô?", huayu: "霧讓我忘了這裡的故事，幫我想 2 題好嗎？" } }
  ],
  D_LE_2B: [
    { who: "wetland_ranger", emotion: "開心", text: "你都答對了，聽得真認真！", taigi: { hanji: "你攏回答著矣，聽甲真認真！", tailo: "Lí lóng huê-tap tio̍h--ah, thiann kah tsin jīn-tsin!", huayu: "你都答對了，聽得真認真！" } },
    { who: "wetland_ranger", emotion: "開心", text: "這些金幣送你，謝謝你！", taigi: { hanji: "這寡金幣送你，多謝你！", tailo: "Tsit-kuá kim-pè sàng lí, to-siā--lí!", huayu: "這些金幣送你，謝謝你！" } }
  ],
  D_LE_3A: [
    { who: "wetland_ranger", emotion: "擔心", text: "你看，海上那艘灰色的船又來了！", huayu_only: true, taigi_draft: { hanji: "你看，海面彼隻殕色的船閣來矣！", tailo: "Lí khuànn, hái-bīn hit tsiah phú-sik ê tsûn koh lâi--ah!", huayu: "你看，海上那艘灰色的船又來了！" } },
    { who: "wetland_ranger", emotion: "擔心", text: "它在水邊繞來繞去，鳥兒都嚇到了。", huayu_only: true, taigi_draft: { hanji: "伊佇水邊踅來踅去，鳥仔攏著驚矣。", tailo: "I tī tsuí-pinn se̍h-lâi-se̍h-khì, tsiáu-á lóng tio̍h-kiann--ah.", huayu: "它在水邊繞來繞去，鳥兒都嚇到了。" } },
    { who: "wetland_ranger", emotion: "平靜", text: "大家說出正確的知識，霧就會變薄。", huayu_only: true, taigi_draft: { hanji: "逐家講出正確的智識，霧就會變薄。", tailo: "Ta̍k-ke kóng tshut tsìng-khak ê tì-sik, bū tō ē piàn po̍h.", huayu: "大家說出正確的知識，霧就會變薄。" } },
    { who: "wetland_ranger", emotion: "平靜", text: "用英語說出動物的名字，答對 3 題好嗎？", huayu_only: true, taigi_draft: { hanji: "用英語講出動物的名，回答著三題，好無？", tailo: "Īng Ing-gí kóng tshut tōng-bu̍t ê miâ, huê-tap tio̍h sann tê, hó--bô?", huayu: "用英語說出動物的名字，答對 3 題好嗎？" } }
  ],
  D_LE_3B: [
    { who: "wetland_ranger", emotion: "開心", text: "霧變薄了！鳥兒安心了，謝謝你！", huayu_only: true, taigi_draft: { hanji: "霧變薄矣！鳥仔安心矣，多謝你！", tailo: "Bū piàn po̍h--ah! Tsiáu-á an-sim--ah, to-siā--lí!", huayu: "霧變薄了！鳥兒安心了，謝謝你！" } },
    { who: "wetland_ranger", emotion: "平靜", text: "我看到，霧是從府城的塔頂飄過來的。", huayu_only: true, taigi_draft: { hanji: "我看著，霧是對府城的塔頂飄過來的。", tailo: "Guá khuànn--tio̍h, bū sī tuì Hú-siânn ê thah tíng phiau kuè--lâi--ê.", huayu: "我看到，霧是從府城的塔頂飄過來的。" } },
    { who: "wetland_ranger", emotion: "平靜", text: "回府城找城主，去塔頂看看吧！", huayu_only: true, taigi_draft: { hanji: "轉去府城揣城主，去塔頂看覓！", tailo: "Tńg-khì Hú-siânn tshuē siânn-tsú, khì thah tíng khuànn-māi!", huayu: "回府城找城主，去塔頂看看吧！" } }
  ],
  D_V1_FOG_KID: [
    { who: "narrator", emotion: "平靜", text: "遺忘霧魔散開了，只剩一小團霧。" },
    { who: "fog_kid", emotion: "擔心", text: "嗚……不要趕我走……" },
    { who: "pet", emotion: "驚訝", text: "是一小團霧！牠在哭耶！" },
    { who: "fog_kid", emotion: "擔心", text: "我是霧魔留下的一小片……我是什麼呢？" },
    { who: "pet", emotion: "開心", text: "我們一起想想，霧是什麼做的！" }
  ],
  D_V1_FOG_KID_B: [
    { who: "fog_kid", emotion: "驚訝", text: "霧是很多很小的水滴……原來我是水！" },
    { who: "fog_kid", emotion: "開心", text: "叫我霧仔！我想跟你們一起走。" },
    { who: "fog_kid", emotion: "平靜", text: "霧魔只是南邊的霧將，不是最大的。" },
    { who: "fog_kid", emotion: "擔心", text: "大霧王在臺灣最高的山上，好寂寞……" },
    { who: "fog_kid", emotion: "平靜", text: "東邊還有一位霧將，在花蓮的海上。" },
    { who: "hero", emotion: "開心", text: "那我們一起去，把霧王叫醒！" }
  ],
  D_DS_1A: [
    { who: "rail_fan", emotion: "開心", text: "歡迎來大樹！你看，那就是舊鐵橋。", huayu_only: true, taigi_draft: { hanji: "歡迎來大樹！你看，彼就是舊鐵橋。", tailo: "Huan-gîng lâi Tuā-tshiū! Lí khuànn, he tō-sī kū thih-kiô.", huayu: "歡迎來大樹！你看，那就是舊鐵橋。" } },
    { who: "rail_fan", emotion: "平靜", text: "這座橋一百多年前就蓋好了，在高屏溪上。", huayu_only: true, taigi_draft: { hanji: "這座橋一百外年前就起好矣，佇高屏溪頂。", tailo: "Tsit tsō kiô tsi̍t-pah guā nî tsîng tō khí hó--ah, tī Ko-pîn-khe tíng.", huayu: "這座橋一百多年前就蓋好了，在高屏溪上。" } },
    { who: "rail_fan", emotion: "平靜", text: "那時候，它是亞洲最長的橋喔。", huayu_only: true, taigi_draft: { hanji: "彼時，伊是亞洲上長的橋喔。", tailo: "Hit-sî, i sī A-tsiu siōng tn̂g ê kiô--ooh.", huayu: "那時候，它是亞洲最長的橋喔。" } },
    { who: "pet", emotion: "開心", text: "全長有 1526 公尺！現在是國定古蹟喔。" },
    { who: "rail_fan", emotion: "擔心", text: "霧讓我忘了橋的數字，幫我算 2 題好嗎？", huayu_only: true, taigi_draft: { hanji: "霧予我袂記得橋的數字，共我算兩題，好無？", tailo: "Bū hōo guá bē-kì-tit kiô ê sòo-jī, kā guá sǹg nn̄g tê, hó--bô?", huayu: "霧讓我忘了橋的數字，幫我算 2 題好嗎？" } }
  ],
  D_DS_1B: [
    { who: "rail_fan", emotion: "開心", text: "算得剛剛好，謝謝你！", huayu_only: true, taigi_draft: { hanji: "算甲拄仔好，多謝你！", tailo: "Sǹg kah tú-á-hó, to-siā--lí!", huayu: "算得剛剛好，謝謝你！" } },
    { who: "rail_fan", emotion: "擔心", text: "鳳梨園那邊好像出事了，去看看吧。", huayu_only: true, taigi_draft: { hanji: "王梨園遐敢若出代誌矣，去看覓。", tailo: "Ông-lâi-hn̂g hia kánn-ná tshut tāi-tsì--ah, khì khuànn-māi.", huayu: "鳳梨園那邊好像出事了，去看看吧。" } }
  ],
  D_DS_1_LOCK: [
    { who: "rail_fan", emotion: "平靜", text: "先去北邊幫忙，再來找我。", huayu_only: true, taigi_draft: { hanji: "先去北爿鬥相共，才閣來揣我。", tailo: "Sing khì pak-pîng tàu-sann-kāng, tsiah-koh lâi tshuē guá.", huayu: "先去北邊幫忙，再來找我。" } },
    { who: "pet", emotion: "平靜", text: "月世界的獸人族長，好像需要幫忙！" }
  ],
  D_DS_2A: [
    { who: "pineapple_farmer", emotion: "擔心", text: "我的鳳梨被小怪物搶走了！", huayu_only: true, taigi_draft: { hanji: "我的王梨予細隻怪物搶去矣！", tailo: "Guá ê ông-lâi hōo sè-tsiah kuài-bu̍t tshiúnn--khì--ah!", huayu: "我的鳳梨被小怪物搶走了！" } },
    { who: "pet", emotion: "開心", text: "大樹的金鑽鳳梨，很有名喔！" },
    { who: "pineapple_farmer", emotion: "平靜", text: "讓鳳梨園的怪物清醒，把 3 顆鳳梨拿回來。", huayu_only: true, taigi_draft: { hanji: "予王梨園的怪物清醒，共三粒王梨提轉來。", tailo: "Hōo ông-lâi-hn̂g ê kuài-bu̍t tshing-tshínn, kā sann lia̍p ông-lâi the̍h tńg--lâi.", huayu: "讓鳳梨園的怪物清醒，把 3 顆鳳梨拿回來。" } },
    { who: "pet", emotion: "驚訝", text: "是鳳梨盔甲蟲！讓牠們清醒，就會掉鳳梨。" }
  ],
  D_DS_2B: [
    { who: "pineapple_farmer", emotion: "開心", text: "鳳梨都找回來了，謝謝你！", huayu_only: true, taigi_draft: { hanji: "王梨攏揣轉來矣，多謝你！", tailo: "Ông-lâi lóng tshuē tńg--lâi--ah, to-siā--lí!", huayu: "鳳梨都找回來了，謝謝你！" } },
    { who: "pineapple_farmer", emotion: "開心", text: "這些金幣送你，謝謝你！", taigi: { hanji: "這寡金幣送你，多謝你！", tailo: "Tsit-kuá kim-pè sàng lí, to-siā--lí!", huayu: "這些金幣送你，謝謝你！" } },
    { who: "pet", emotion: "平靜", text: "回月世界，讓暴躁石像冷靜下來吧！" }
  ],
  D_DS_2_LOCK: [
    { who: "pineapple_farmer", emotion: "平靜", text: "先去溪邊找阿伯聊聊，再來找我。", huayu_only: true, taigi_draft: { hanji: "先去溪邊揣阿伯開講，才閣來揣我。", tailo: "Sing khì khe-pinn tshuē a-peh khai-káng, tsiah-koh lâi tshuē guá.", huayu: "先去溪邊找阿伯聊聊，再來找我。" } },
    { who: "pet", emotion: "平靜", text: "舊鐵橋旁邊的鐵道迷阿伯，好像需要幫忙！" }
  ],
  D_DS_3A: [
    { who: "lychee_farmer", emotion: "開心", text: "我們這裡的荔枝很甜喔！", huayu_only: true, taigi_draft: { hanji: "阮遮的荔枝真甜喔！", tailo: "Guán tsia ê nāi-tsi tsin tinn--ooh!", huayu: "我們這裡的荔枝很甜喔！" } },
    { who: "pet", emotion: "開心", text: "金鑽鳳梨和玉荷包荔枝，都很有名！" },
    { who: "lychee_farmer", emotion: "平靜", text: "每年五月、六月，這裡會辦鳳梨和荔枝的活動。", huayu_only: true, taigi_draft: { hanji: "每年五月、六月，遮會辦王梨佮荔枝的活動。", tailo: "Muí nî gōo-gue̍h, la̍k-gue̍h, tsia ē pān ông-lâi kah nāi-tsi ê ua̍h-tāng.", huayu: "每年五月、六月，這裡會辦鳳梨和荔枝的活動。" } },
    { who: "lychee_farmer", emotion: "擔心", text: "霧讓我忘了大家的工作，幫我想 2 題好嗎？", huayu_only: true, taigi_draft: { hanji: "霧予我袂記得逐家的工課，共我想兩題，好無？", tailo: "Bū hōo guá bē-kì-tit ta̍k-ke ê khang-khuè, kā guá siūnn nn̄g tê, hó--bô?", huayu: "霧讓我忘了大家的工作，幫我想 2 題好嗎？" } }
  ],
  D_DS_3B: [
    { who: "lychee_farmer", emotion: "開心", text: "你都答對了，聽得真認真！", taigi: { hanji: "你攏回答著矣，聽甲真認真！", tailo: "Lí lóng huê-tap tio̍h--ah, thiann kah tsin jīn-tsin!", huayu: "你都答對了，聽得真認真！" } },
    { who: "lychee_farmer", emotion: "開心", text: "這些金幣送你，謝謝你！", taigi: { hanji: "這寡金幣送你，多謝你！", tailo: "Tsit-kuá kim-pè sàng lí, to-siā--lí!", huayu: "這些金幣送你，謝謝你！" } }
  ],
  D_DS_3_LOCK: [
    { who: "lychee_farmer", emotion: "平靜", text: "先去溪邊找阿伯聊聊，再來找我。", huayu_only: true, taigi_draft: { hanji: "先去溪邊揣阿伯開講，才閣來揣我。", tailo: "Sing khì khe-pinn tshuē a-peh khai-káng, tsiah-koh lâi tshuē guá.", huayu: "先去溪邊找阿伯聊聊，再來找我。" } },
    { who: "pet", emotion: "平靜", text: "舊鐵橋旁邊的鐵道迷阿伯，好像需要幫忙！" }
  ],
  D_LQ_0: [
    { who: "ticket_seller", emotion: "開心", text: "這裡是東港碼頭，船會開去對面的島。", huayu_only: true, taigi_draft: { hanji: "遮是東港碼頭，船會駛去對面的島。", tailo: "Tsia sī Tang-káng bé-thâu, tsûn ē sái khì tuì-bīn ê tó.", huayu: "這裡是東港碼頭，船會開去對面的島。" } },
    { who: "pet", emotion: "開心", text: "對面的島，就是小琉球！" },
    { who: "ticket_seller", emotion: "平靜", text: "船票只賣來回，200 金幣。", huayu_only: true, taigi_draft: { hanji: "船票干焦賣來回，兩百个金幣。", tailo: "Tsûn-phiò kan-na bē lâi-huê, nn̄g-pah ê kim-pè.", huayu: "船票只賣來回，200 金幣。" } }
  ],
  D_FERRY_DONGGANG_LIUQIU_LOCKED: [
    { who: "ticket_seller", emotion: "擔心", text: "北邊還很亂，先去幫忙再來喔。", huayu_only: true, taigi_draft: { hanji: "北爿猶咧亂，先去鬥相共才閣來喔。", tailo: "Pak-pîng iáu teh luān, sing khì tàu-sann-kāng tsiah-koh lâi--ooh.", huayu: "北邊還很亂，先去幫忙再來喔。" } }
  ],
  D_LQ_1A: [
    { who: "turtle_volunteer", emotion: "開心", text: "歡迎來這個島！", huayu_only: true, taigi_draft: { hanji: "歡迎來這个島！", tailo: "Huan-gîng lâi tsit ê tó!", huayu: "歡迎來這個島！" } },
    { who: "pet", emotion: "開心", text: "這裡是小琉球！" },
    { who: "turtle_volunteer", emotion: "擔心", text: "海邊有好多垃圾，我們一起來撿。", huayu_only: true, taigi_draft: { hanji: "海墘有真濟糞埽，咱做伙來抾。", tailo: "Hái-kînn ū tsin tsē pùn-sò, lán tsò-hué lâi khioh.", huayu: "海邊有好多垃圾，我們一起來撿。" } },
    { who: "turtle_volunteer", emotion: "平靜", text: "海龜可能會把塑膠袋，當成食物吃下去。", huayu_only: true, taigi_draft: { hanji: "海龜可能會共塑膠袋仔，當做食物食落去。", tailo: "Hái-ku khó-lîng ē kā sok-ka-tē-á, tòng-tsò si̍t-bu̍t tsia̍h--lo̍h-khì.", huayu: "海龜可能會把塑膠袋，當成食物吃下去。" } },
    { who: "turtle_volunteer", emotion: "擔心", text: "霧讓我忘了怎麼保護海龜，幫我想 3 題好嗎？", huayu_only: true, taigi_draft: { hanji: "霧予我袂記得按怎保護海龜，共我想三題，好無？", tailo: "Bū hōo guá bē-kì-tit án-tsuánn pó-hōo hái-ku, kā guá siūnn sann tê, hó--bô?", huayu: "霧讓我忘了怎麼保護海龜，幫我想 3 題好嗎？" } }
  ],
  D_LQ_1B: [
    { who: "turtle_volunteer", emotion: "開心", text: "海邊乾淨了！謝謝你！", huayu_only: true, taigi_draft: { hanji: "海墘清氣矣！多謝你！", tailo: "Hái-kînn tshing-khì--ah! To-siā--lí!", huayu: "海邊乾淨了！謝謝你！" } },
    { who: "turtle_volunteer", emotion: "平靜", text: "垃圾帶回去，不要亂丟，海龜就比較安全。", huayu_only: true, taigi_draft: { hanji: "糞埽提轉去，莫烏白擲，海龜就較安全。", tailo: "Pùn-sò the̍h tńg-khì, mài oo-pe̍h tàn, hái-ku tō khah an-tsuân.", huayu: "垃圾帶回去，不要亂丟，海龜就比較安全。" } },
    { who: "turtle_volunteer", emotion: "開心", text: "這些金幣送你，謝謝你！", taigi: { hanji: "這寡金幣送你，多謝你！", tailo: "Tsit-kuá kim-pè sàng lí, to-siā--lí!", huayu: "這些金幣送你，謝謝你！" } }
  ],
  D_LQ_2A: [
    { who: "pet", emotion: "開心", text: "友善賞龜五不：不觸碰、不打擾、不餵食、不追逐、不傷害！" },
    { who: "turtle_volunteer", emotion: "平靜", text: "還要離海龜五公尺以上，不要擋住牠的路。", huayu_only: true, taigi_draft: { hanji: "閣愛離海龜五公尺以上，毋通擋著伊的路。", tailo: "Koh ài lī hái-ku gōo kong-tshioh í-siōng, m̄-thang tòng--tio̍h i ê lōo.", huayu: "還要離海龜五公尺以上，不要擋住牠的路。" } },
    { who: "turtle_volunteer", emotion: "開心", text: "用望遠鏡算算看，海裡有幾隻海龜？", huayu_only: true, taigi_draft: { hanji: "用千里鏡算看覓，海內有幾隻海龜？", tailo: "Īng tshian-lí-kiànn sǹg khuànn-māi, hái lāi ū kuí tsiah hái-ku?", huayu: "用望遠鏡算算看，海裡有幾隻海龜？" } },
    { who: "turtle_volunteer", emotion: "擔心", text: "霧讓我算不清楚，幫我算 2 題好嗎？", huayu_only: true, taigi_draft: { hanji: "霧予我算袂清楚，共我算兩題，好無？", tailo: "Bū hōo guá sǹg bē tshing-tshó, kā guá sǹg nn̄g tê, hó--bô?", huayu: "霧讓我算不清楚，幫我算 2 題好嗎？" } }
  ],
  D_LQ_2B: [
    { who: "turtle_volunteer", emotion: "開心", text: "算得剛剛好，謝謝你！", huayu_only: true, taigi_draft: { hanji: "算甲拄仔好，多謝你！", tailo: "Sǹg kah tú-á-hó, to-siā--lí!", huayu: "算得剛剛好，謝謝你！" } },
    { who: "turtle_volunteer", emotion: "開心", text: "這些金幣送你，謝謝你！", taigi: { hanji: "這寡金幣送你，多謝你！", tailo: "Tsit-kuá kim-pè sàng lí, to-siā--lí!", huayu: "這些金幣送你，謝謝你！" } }
  ],
  D_LQ_3A: [
    { who: "island_guide", emotion: "開心", text: "你看，這個島的石頭是珊瑚礁喔。", huayu_only: true, taigi_draft: { hanji: "你看，這个島的石頭是珊瑚礁喔。", tailo: "Lí khuànn, tsit ê tó ê tsio̍h-thâu sī suan-ôo-ta--ooh.", huayu: "你看，這個島的石頭是珊瑚礁喔。" } },
    { who: "pet", emotion: "驚訝", text: "小琉球是臺灣近海唯一的珊瑚礁島！" },
    { who: "island_guide", emotion: "平靜", text: "海邊那顆石頭上面大、下面小，好像花瓶。", huayu_only: true, taigi_draft: { hanji: "海邊彼粒石頭頂懸大、下跤細，親像花矸。", tailo: "Hái-pinn hit lia̍p tsio̍h-thâu tíng-kuân tuā, ē-kha sè, tshin-tshiūnn hue-kan.", huayu: "海邊那顆石頭上面大、下面小，好像花瓶。" } },
    { who: "pet", emotion: "開心", text: "那是花瓶岩，是小琉球的地標！" },
    { who: "island_guide", emotion: "擔心", text: "霧讓我忘了這個島的故事，幫我想 2 題好嗎？", huayu_only: true, taigi_draft: { hanji: "霧予我袂記得這个島的故事，共我想兩題，好無？", tailo: "Bū hōo guá bē-kì-tit tsit ê tó ê kòo-sū, kā guá siūnn nn̄g tê, hó--bô?", huayu: "霧讓我忘了這個島的故事，幫我想 2 題好嗎？" } }
  ],
  D_LQ_3B: [
    { who: "island_guide", emotion: "開心", text: "你都答對了，聽得真認真！", taigi: { hanji: "你攏回答著矣，聽甲真認真！", tailo: "Lí lóng huê-tap tio̍h--ah, thiann kah tsin jīn-tsin!", huayu: "你都答對了，聽得真認真！" } },
    { who: "island_guide", emotion: "平靜", text: "以前漁夫出海，會帶點心到船上吃。", huayu_only: true, taigi_draft: { hanji: "較早討海人出海，會提點心去船頂食。", tailo: "Khah-tsá thó-hái-lâng tshut-hái, ē the̍h tiám-sim khì tsûn tíng tsia̍h.", huayu: "以前漁夫出海，會帶點心到船上吃。" } },
    { who: "pet", emotion: "開心", text: "就是麻花捲！現在是小琉球有名的伴手禮。" },
    { who: "island_guide", emotion: "開心", text: "這些金幣送你，謝謝你！", taigi: { hanji: "這寡金幣送你，多謝你！", tailo: "Tsit-kuá kim-pè sàng lí, to-siā--lí!", huayu: "這些金幣送你，謝謝你！" } }
  ],
  D_LQ_3_LOCK: [
    { who: "island_guide", emotion: "平靜", text: "先去海邊幫保育志工，再來找我。", huayu_only: true, taigi_draft: { hanji: "先去海墘共保育志工鬥相共，才閣來揣我。", tailo: "Sing khì hái-kînn kā pó-io̍k tsì-kang tàu-sann-kāng, tsiah-koh lâi tshuē guá.", huayu: "先去海邊幫保育志工，再來找我。" } },
    { who: "pet", emotion: "平靜", text: "南邊沙灘的海龜保育志工，好像需要幫忙！" }
  ],
  D_PT_1A: [
    { who: "park_ranger_kt", emotion: "開心", text: "歡迎來到國家公園！", huayu_only: true, taigi_draft: { hanji: "歡迎來國家公園！", tailo: "Huan-gîng lâi kok-ka kong-hn̂g!", huayu: "歡迎來到國家公園！" } },
    { who: "pet", emotion: "開心", text: "墾丁國家公園，是我國第一座國家公園喔！" },
    { who: "park_ranger_kt", emotion: "平靜", text: "這裡三面都是海，東邊是太平洋。", huayu_only: true, taigi_draft: { hanji: "遮三面攏是海，東爿是太平洋。", tailo: "Tsia sann bīn lóng sī hái, tang-pîng sī Thài-pîng-iûnn.", huayu: "這裡三面都是海，東邊是太平洋。" } },
    { who: "park_ranger_kt", emotion: "擔心", text: "霧讓我忘了這裡的故事，幫我想 2 題好嗎？", taigi: { hanji: "霧予我袂記得遮的故事，共我想兩題，好無？", tailo: "Bū hōo guá bē-kì-tit tsia ê kòo-sū, kā guá siūnn nn̄g tê, hó--bô?", huayu: "霧讓我忘了這裡的故事，幫我想 2 題好嗎？" } }
  ],
  D_PT_1B: [
    { who: "park_ranger_kt", emotion: "開心", text: "你都答對了，聽得真認真！", taigi: { hanji: "你攏回答著矣，聽甲真認真！", tailo: "Lí lóng huê-tap tio̍h--ah, thiann kah tsin jīn-tsin!", huayu: "你都答對了，聽得真認真！" } },
    { who: "park_ranger_kt", emotion: "擔心", text: "南邊顧燈塔的人，好像有麻煩。", huayu_only: true, taigi_draft: { hanji: "南爿顧燈塔的人，敢若有麻煩。", tailo: "Lâm-pîng kòo ting-thah ê lâng, kánn-ná ū mâ-huân.", huayu: "南邊顧燈塔的人，好像有麻煩。" } }
  ],
  D_PT_1_LOCK: [
    { who: "park_ranger_kt", emotion: "平靜", text: "先坐船去對面的島幫忙，再來找我。", huayu_only: true, taigi_draft: { hanji: "先坐船去對面的島鬥相共，才閣來揣我。", tailo: "Sing tsē tsûn khì tuì-bīn ê tó tàu-sann-kāng, tsiah-koh lâi tshuē guá.", huayu: "先坐船去對面的島幫忙，再來找我。" } },
    { who: "pet", emotion: "平靜", text: "東港碼頭可以坐船去小琉球喔！" }
  ],
  D_PT_2A: [
    { who: "lighthouse_keeper", emotion: "開心", text: "這座白色的圓燈塔，一百四十多年前就蓋好了。", huayu_only: true, taigi_draft: { hanji: "這座白色的圓燈塔，一百四十外年前就起好矣。", tailo: "Tsit tsō pe̍h-sik ê înn ting-thah, tsi̍t-pah sì-tsa̍p guā nî tsîng tō khí hó--ah.", huayu: "這座白色的圓燈塔，一百四十多年前就蓋好了。" } },
    { who: "pet", emotion: "開心", text: "鵝鑾鼻燈塔是臺灣本島最南的燈塔，叫「東亞之光」！" },
    { who: "lighthouse_keeper", emotion: "擔心", text: "可是霧太濃，燈光一閃一閃都亂掉了。", huayu_only: true, taigi_draft: { hanji: "毋過霧傷厚，燈光閃閃爍爍攏亂去矣。", tailo: "M̄-koh bū siunn kāu, ting-kng siám-siám-sih-sih lóng luān--khì--ah.", huayu: "可是霧太濃，燈光一閃一閃都亂掉了。" } },
    { who: "lighthouse_keeper", emotion: "平靜", text: "燈光要怎麼閃，幫我排好，答對 3 題好嗎？", huayu_only: true, taigi_draft: { hanji: "燈光愛按怎閃，共我排予好勢，回答著三題，好無？", tailo: "Ting-kng ài án-tsuánn siám, kā guá pâi hōo hó-sè, huê-tap tio̍h sann tê, hó--bô?", huayu: "燈光要怎麼閃，幫我排好，答對 3 題好嗎？" } }
  ],
  D_PT_2B: [
    { who: "lighthouse_keeper", emotion: "開心", text: "燈塔又亮起來了！謝謝你！", huayu_only: true, taigi_draft: { hanji: "燈塔閣光起來矣！多謝你！", tailo: "Ting-thah koh kng khí-lâi--ah! To-siā--lí!", huayu: "燈塔又亮起來了！謝謝你！" } },
    { who: "lighthouse_keeper", emotion: "驚訝", text: "燈光照到外海，有一艘灰色的帆船！", huayu_only: true, taigi_draft: { hanji: "燈光照著外海，有一隻殕色的帆船！", tailo: "Ting-kng tsiò--tio̍h guā-hái, ū tsi̍t tsiah phú-sik ê phâng-tsûn!", huayu: "燈光照到外海，有一艘灰色的帆船！" } },
    { who: "pet", emotion: "驚訝", text: "是霧帆號！它躲在這裡！" }
  ],
  D_PT_2_LOCK: [
    { who: "lighthouse_keeper", emotion: "平靜", text: "先去聽國家公園的人介紹，再來找我。", huayu_only: true, taigi_draft: { hanji: "先去聽國家公園的人紹介，才閣來揣我。", tailo: "Sing khì thiann kok-ka kong-hn̂g ê lâng siāu-kài, tsiah-koh lâi tshuē guá.", huayu: "先去聽國家公園的人介紹，再來找我。" } },
    { who: "pet", emotion: "平靜", text: "古城門附近的國家公園解說員，好像需要幫忙！" }
  ],
  D_PT_3A: [
    { who: "lighthouse_keeper", emotion: "擔心", text: "那艘霧船，把大家的寶貝都搶走了。", huayu_only: true, taigi_draft: { hanji: "彼隻霧船，共逐家的寶貝攏搶去矣。", tailo: "Hit tsiah bū-tsûn, kā ta̍k-ke ê pó-puè lóng tshiúnn--khì--ah.", huayu: "那艘霧船，把大家的寶貝都搶走了。" } },
    { who: "lighthouse_keeper", emotion: "平靜", text: "燈塔會一直照著它，你去讓它清醒！", huayu_only: true, taigi_draft: { hanji: "燈塔會一直照伊，你去予伊清醒！", tailo: "Ting-thah ē it-ti̍t tsiò i, lí khì hōo i tshing-tshínn!", huayu: "燈塔會一直照著它，你去讓它清醒！" } },
    { who: "pet", emotion: "平靜", text: "頭目戰不能逃跑，先去旅店休息吧！" }
  ],
  D_PT_3B: [
    { who: "lighthouse_keeper", emotion: "開心", text: "霧船變成白雲了！謝謝你！", huayu_only: true, taigi_draft: { hanji: "霧船變做白雲矣！多謝你！", tailo: "Bū-tsûn piàn-tsò pe̍h-hûn--ah! To-siā--lí!", huayu: "霧船變成白雲了！謝謝你！" } },
    { who: "lighthouse_keeper", emotion: "開心", text: "大家的寶貝，都回來了。", huayu_only: true, taigi_draft: { hanji: "逐家的寶貝，攏轉來矣。", tailo: "Ta̍k-ke ê pó-puè, lóng tńg--lâi--ah.", huayu: "大家的寶貝，都回來了。" } }
  ],
  D_PT_4A: [
    { who: "oldcity_guide", emotion: "開心", text: "這裡是恆春古城的城門喔。", huayu_only: true, taigi_draft: { hanji: "遮是恆春古城的城門喔。", tailo: "Tsia sī Hîng-tshun kóo-siânn ê siânn-mn̂g--ooh.", huayu: "這裡是恆春古城的城門喔。" } },
    { who: "oldcity_guide", emotion: "平靜", text: "古城有東、西、南、北四個城門。", huayu_only: true, taigi_draft: { hanji: "古城有東、西、南、北四个城門。", tailo: "Kóo-siânn ū tang, sai, lâm, pak sì ê siânn-mn̂g.", huayu: "古城有東、西、南、北四個城門。" } },
    { who: "oldcity_guide", emotion: "平靜", text: "城牆差不多都壞了，不過四個城門都還在。", huayu_only: true, taigi_draft: { hanji: "城牆差不多攏歹去矣，毋過四个城門攏閣佇咧。", tailo: "Siânn-tshiûnn tsha-put-to lóng pháinn--khì--ah, m̄-koh sì ê siânn-mn̂g lóng koh tī--leh.", huayu: "城牆差不多都壞了，不過四個城門都還在。" } },
    { who: "oldcity_guide", emotion: "擔心", text: "霧讓我忘了古城的故事，幫我想 2 題好嗎？", huayu_only: true, taigi_draft: { hanji: "霧予我袂記得古城的故事，共我想兩題，好無？", tailo: "Bū hōo guá bē-kì-tit kóo-siânn ê kòo-sū, kā guá siūnn nn̄g tê, hó--bô?", huayu: "霧讓我忘了古城的故事，幫我想 2 題好嗎？" } }
  ],
  D_PT_4B: [
    { who: "oldcity_guide", emotion: "開心", text: "你都答對了，聽得真認真！", taigi: { hanji: "你攏回答著矣，聽甲真認真！", tailo: "Lí lóng huê-tap tio̍h--ah, thiann kah tsin jīn-tsin!", huayu: "你都答對了，聽得真認真！" } },
    { who: "oldcity_guide", emotion: "開心", text: "這些金幣送你，謝謝你！", taigi: { hanji: "這寡金幣送你，多謝你！", tailo: "Tsit-kuá kim-pè sàng lí, to-siā--lí!", huayu: "這些金幣送你，謝謝你！" } }
  ],
  D_PT_4_LOCK: [
    { who: "oldcity_guide", emotion: "平靜", text: "先去聽國家公園的人介紹，再來找我。", huayu_only: true, taigi_draft: { hanji: "先去聽國家公園的人紹介，才閣來揣我。", tailo: "Sing khì thiann kok-ka kong-hn̂g ê lâng siāu-kài, tsiah-koh lâi tshuē guá.", huayu: "先去聽國家公園的人介紹，再來找我。" } },
    { who: "pet", emotion: "平靜", text: "古城門附近的國家公園解說員，好像需要幫忙！" }
  ],
  D_FORESTRAIL_IDLE: [
    { who: "forest_rail", text: "坐火車要排隊，也要小心喔。", huayu_only: true, taigi_draft: { hanji: "坐火車愛排隊，嘛愛細膩喔。", tailo: "Tsē hué-tshia ài pâi-tuī, mā ài sè-jī--ooh.", huayu: "坐火車要排隊，也要小心喔。" } }
  ],
  D_HARBORCLERK_IDLE: [
    { who: "harbor_clerk", text: "船進港的時候，不要站在碼頭邊喔。", huayu_only: true, taigi_draft: { hanji: "船入港的時，毋通徛佇碼頭邊喔。", tailo: "Tsûn ji̍p káng ê sî, m̄-thang khiā tī bé-thâu pinn--ooh.", huayu: "船進港的時候，不要站在碼頭邊喔。" } }
  ],
  D_FORTGUIDE_IDLE: [
    { who: "fort_guide", text: "古蹟要好好保護，不可以亂畫喔。", huayu_only: true, taigi_draft: { hanji: "古蹟愛好好仔保護，毋通烏白畫喔。", tailo: "Kóo-tsik ài hó-hó-á pó-hōo, m̄-thang oo-pe̍h uē--ooh.", huayu: "古蹟要好好保護，不可以亂畫喔。" } }
  ],
  D_OLDHOUSE_IDLE: [
    { who: "oldhouse_grandpa", text: "安平的巷子很窄，走路要慢慢走喔。", huayu_only: true, taigi_draft: { hanji: "安平的巷仔真狹，行路愛慢慢仔行喔。", tailo: "An-pîng ê hāng-á tsin e̍h, kiânn-lōo ài bān-bān-á kiânn--ooh.", huayu: "安平的巷子很窄，走路要慢慢走喔。" } }
  ],
  D_RANGER_LE_IDLE: [
    { who: "wetland_ranger", text: "在這裡看鳥，說話要小聲喔。", huayu_only: true, taigi_draft: { hanji: "佇遮看鳥仔，講話愛細聲喔。", tailo: "Tī tsia khuànn tsiáu-á, kóng-uē ài sè-siann--ooh.", huayu: "在這裡看鳥，說話要小聲喔。" } }
  ],
  D_RAILFAN_IDLE: [
    { who: "rail_fan", text: "看火車要站在安全的地方喔。", huayu_only: true, taigi_draft: { hanji: "看火車愛徛佇安全的所在喔。", tailo: "Khuànn hué-tshia ài khiā tī an-tsuân ê sóo-tsāi--ooh.", huayu: "看火車要站在安全的地方喔。" } }
  ],
  D_PINEAPPLE_IDLE: [
    { who: "pineapple_farmer", text: "鳳梨的葉子尖尖的，摸的時候要小心。", huayu_only: true, taigi_draft: { hanji: "王梨的葉仔尖尖，摸的時愛細膩。", tailo: "Ông-lâi ê hio̍h-á tsiam-tsiam, bong ê sî ài sè-jī.", huayu: "鳳梨的葉子尖尖的，摸的時候要小心。" } }
  ],
  D_LYCHEE_IDLE: [
    { who: "lychee_farmer", text: "荔枝要趁新鮮吃喔。", huayu_only: true, taigi_draft: { hanji: "荔枝愛趁新鮮食喔。", tailo: "Nāi-tsi ài thàn sin-sian tsia̍h--ooh.", huayu: "荔枝要趁新鮮吃喔。" } }
  ],
  D_TURTLE_VOL_IDLE: [
    { who: "turtle_volunteer", text: "看海龜要離五公尺以上喔。", huayu_only: true, taigi_draft: { hanji: "看海龜愛離五公尺以上喔。", tailo: "Khuànn hái-ku ài lī gōo kong-tshioh í-siōng--ooh.", huayu: "看海龜要離五公尺以上喔。" } }
  ],
  D_ISLAND_GUIDE_IDLE: [
    { who: "island_guide", text: "這裡的石頭尖尖的，走路要穿鞋喔。", huayu_only: true, taigi_draft: { hanji: "遮的石頭尖尖，行路愛穿鞋喔。", tailo: "Tsia ê tsio̍h-thâu tsiam-tsiam, kiânn-lōo ài tshīng ê--ooh.", huayu: "這裡的石頭尖尖的，走路要穿鞋喔。" } }
  ],
  D_TICKET_IDLE: [
    { who: "ticket_seller", text: "坐船的時候，不要在船上跑來跑去喔。", huayu_only: true, taigi_draft: { hanji: "坐船的時，毋通佇船頂走來走去喔。", tailo: "Tsē tsûn ê sî, m̄-thang tī tsûn tíng tsáu-lâi-tsáu-khì--ooh.", huayu: "坐船的時候，不要在船上跑來跑去喔。" } }
  ],
  D_RANGER_PT_IDLE: [
    { who: "park_ranger_kt", text: "國家公園的花草，看就好，不要摘喔。", huayu_only: true, taigi_draft: { hanji: "國家公園的花草，看就好，毋通挽喔。", tailo: "Kok-ka kong-hn̂g ê hue-tsháu, khuànn tō hó, m̄-thang bán--ooh.", huayu: "國家公園的花草，看就好，不要摘喔。" } }
  ],
  D_LIGHTHOUSE_IDLE: [
    { who: "lighthouse_keeper", text: "燈塔的光，會讓船知道路。", huayu_only: true, taigi_draft: { hanji: "燈塔的光，會予船知影路。", tailo: "Ting-thah ê kng, ē hōo tsûn tsai-iánn lōo.", huayu: "燈塔的光，會讓船知道路。" } }
  ],
  D_OLDCITY_IDLE: [
    { who: "oldcity_guide", text: "城門下面很涼，可以休息一下。", huayu_only: true, taigi_draft: { hanji: "城門跤真涼，會使歇睏一下。", tailo: "Siânn-mn̂g kha tsin liâng, ē-sái hioh-khùn--tsi̍t-ē.", huayu: "城門下面很涼，可以休息一下。" } }
  ],
  D_INN_ANPING: [
    { who: "inn_anping", emotion: "開心", text: "歡迎來港邊的客棧！好好休息喔。", huayu_only: true, taigi_draft: { hanji: "歡迎來港邊的客棧！好好仔歇睏喔。", tailo: "Huan-gîng lâi káng-pinn ê kheh-tsàn! Hó-hó-á hioh-khùn--ooh.", huayu: "歡迎來港邊的客棧！好好休息喔。" } }
  ],
  D_INN_ANPING_NOCOIN: [
    { who: "inn_anping", emotion: "擔心", text: "金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。", taigi: { hanji: "金幣無夠喔，金包里溫泉旅館會使免錢蹛，嘛會使去拍怪物趁金幣。", tailo: "Kim-pè bô-kàu--ooh, Kim-pau-lí un-tsuânn lí-kuán ē-sái bián-tsînn tuà, mā ē-sái khì phah kuài-bu̍t thàn kim-pè.", huayu: "金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。" } }
  ],
  D_INN_TAIJIANG: [
    { who: "inn_taijiang", emotion: "開心", text: "歡迎來我們的民宿！好好休息喔。", taigi: { hanji: "歡迎來阮的民宿！好好仔歇睏喔。", tailo: "Huan-gîng lâi guán ê bîn-sok! Hó-hó-á hioh-khùn--ooh.", huayu: "歡迎來我們的民宿！好好休息喔。" } }
  ],
  D_INN_TAIJIANG_NOCOIN: [
    { who: "inn_taijiang", emotion: "擔心", text: "金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。", taigi: { hanji: "金幣無夠喔，金包里溫泉旅館會使免錢蹛，嘛會使去拍怪物趁金幣。", tailo: "Kim-pè bô-kàu--ooh, Kim-pau-lí un-tsuânn lí-kuán ē-sái bián-tsînn tuà, mā ē-sái khì phah kuài-bu̍t thàn kim-pè.", huayu: "金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。" } }
  ],
  D_INN_DASHU: [
    { who: "inn_dashu", emotion: "開心", text: "歡迎來我們的民宿！晚上好好睡喔。", huayu_only: true, taigi_draft: { hanji: "歡迎來阮的民宿！暗時好好仔睏喔。", tailo: "Huan-gîng lâi guán ê bîn-sok! Àm-sî hó-hó-á khùn--ooh.", huayu: "歡迎來我們的民宿！晚上好好睡喔。" } }
  ],
  D_INN_DASHU_NOCOIN: [
    { who: "inn_dashu", emotion: "擔心", text: "金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。", taigi: { hanji: "金幣無夠喔，金包里溫泉旅館會使免錢蹛，嘛會使去拍怪物趁金幣。", tailo: "Kim-pè bô-kàu--ooh, Kim-pau-lí un-tsuânn lí-kuán ē-sái bián-tsînn tuà, mā ē-sái khì phah kuài-bu̍t thàn kim-pè.", huayu: "金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。" } }
  ],
  D_INN_LIUQIU: [
    { who: "inn_liuqiu", emotion: "開心", text: "歡迎來島上的民宿！好好休息喔。", huayu_only: true, taigi_draft: { hanji: "歡迎來島頂的民宿！好好仔歇睏喔。", tailo: "Huan-gîng lâi tó tíng ê bîn-sok! Hó-hó-á hioh-khùn--ooh.", huayu: "歡迎來島上的民宿！好好休息喔。" } }
  ],
  D_INN_LIUQIU_NOCOIN: [
    { who: "inn_liuqiu", emotion: "擔心", text: "金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。", taigi: { hanji: "金幣無夠喔，金包里溫泉旅館會使免錢蹛，嘛會使去拍怪物趁金幣。", tailo: "Kim-pè bô-kàu--ooh, Kim-pau-lí un-tsuânn lí-kuán ē-sái bián-tsînn tuà, mā ē-sái khì phah kuài-bu̍t thàn kim-pè.", huayu: "金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。" } }
  ],
  D_INN_KENTING: [
    { who: "inn_kenting", emotion: "開心", text: "歡迎來我們的旅店！好好休息喔。", taigi: { hanji: "歡迎來阮的旅社！好好仔歇睏喔。", tailo: "Huan-gîng lâi guán ê lí-siā! Hó-hó-á hioh-khùn--ooh.", huayu: "歡迎來我們的旅店！好好休息喔。" } }
  ],
  D_INN_KENTING_NOCOIN: [
    { who: "inn_kenting", emotion: "擔心", text: "金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。", taigi: { hanji: "金幣無夠喔，金包里溫泉旅館會使免錢蹛，嘛會使去拍怪物趁金幣。", tailo: "Kim-pè bô-kàu--ooh, Kim-pau-lí un-tsuânn lí-kuán ē-sái bián-tsînn tuà, mā ē-sái khì phah kuài-bu̍t thàn kim-pè.", huayu: "金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。" } }
  ],
  D_TEMPLE_LEM_INTRO: [
    { who: "volunteer_lem", emotion: "開心", text: "歡迎來我們這間廟。", taigi: { hanji: "歡迎來阮這間廟。", tailo: "Huan-gîng lâi guán tsit king biō.", huayu: "歡迎來我們這間廟。" } },
    { who: "pet", emotion: "開心", text: "這裡是正統鹿耳門聖母廟喔！" },
    { who: "volunteer_lem", emotion: "平靜", text: "廟裡主要拜媽祖。", huayu_only: true, taigi_draft: { hanji: "廟內主要拜媽祖。", tailo: "Biō lāi tsú-iàu pài Má-tsóo.", huayu: "廟裡主要拜媽祖。" } },
    { who: "volunteer_lem", emotion: "平靜", text: "現在的廟，是五十多年前第三次重新蓋的。", huayu_only: true, taigi_draft: { hanji: "這馬的廟，是五十外年前第三擺重新起的。", tailo: "Tsit-má ê biō, sī gōo-tsa̍p guā nî tsîng tē-sann pái tiông-sin khí--ê.", huayu: "現在的廟，是五十多年前第三次重新蓋的。" } },
    { who: "volunteer_lem", emotion: "平靜", text: "廟蓋得像古時候的皇宮一樣。", huayu_only: true, taigi_draft: { hanji: "廟起甲親像古早的皇宮仝款。", tailo: "Biō khí kah tshin-tshiūnn kóo-tsá ê hông-kiong kāng-khuán.", huayu: "廟蓋得像古時候的皇宮一樣。" } },
    { who: "volunteer_lem", emotion: "開心", text: "每年元宵前後，這裡會辦「迎春牛」喔。", huayu_only: true, taigi_draft: { hanji: "每年元宵前後，遮會辦「迎春牛」喔。", tailo: "Muí nî Guân-siau tsîng-āu, tsia ē pān “ngiâ tshun-gû”--ooh.", huayu: "每年元宵前後，這裡會辦「迎春牛」喔。" } }
  ],
  D_TEMPLE_FGS_INTRO: [
    { who: "volunteer_fgs", emotion: "開心", text: "歡迎來佛光山！這裡在高雄市大樹區。", huayu_only: true, taigi_draft: { hanji: "歡迎來佛光山！遮佇高雄市大樹區。", tailo: "Huan-gîng lâi Hu̍t-kong-san! Tsia tī Ko-hiông-tshī Tuā-tshiū-khu.", huayu: "歡迎來佛光山！這裡在高雄市大樹區。" } },
    { who: "volunteer_fgs", emotion: "平靜", text: "這裡常常說：做好事、說好話、存好心。", huayu_only: true, taigi_draft: { hanji: "遮定定講：做好事、講好話、存好心。", tailo: "Tsia tiānn-tiānn kóng: tsò hó-sū, kóng hó-uē, tsûn hó-sim.", huayu: "這裡常常說：做好事、說好話、存好心。" } },
    { who: "pet", emotion: "開心", text: "這就是佛光山說的「三好」！" },
    { who: "volunteer_fgs", emotion: "平靜", text: "在這裡立一個心願，也可以換職業喔。", huayu_only: true, taigi_draft: { hanji: "佇遮立一个心願，嘛會使換職業喔。", tailo: "Tī tsia li̍p tsi̍t ê sim-guān, mā ē-sái uānn tsit-gia̍p--ooh.", huayu: "在這裡立一個心願，也可以換職業喔。" } }
  ],
  D_TEMPLE_LOCKED_LEM: [
    { who: "volunteer_lem", emotion: "平靜", text: "見習冒險者到 10 級，才能來考立志小考喔。", taigi: { hanji: "見習冒險者到十級，才會使來考立志小考喔。", tailo: "Kiàn-si̍p mōo-hiám-tsiá kàu tsa̍p kip, tsiah ē-sái lâi khó li̍p-tsì sió-khó--ooh.", huayu: "見習冒險者到 10 級，才能來考立志小考喔。" } }
  ],
  D_TRIAL_INTRO_LEM: [
    { who: "volunteer_lem", emotion: "平靜", text: "想換職業，要先考立志小考喔。", taigi: { hanji: "欲換職業，愛先考立志小考喔。", tailo: "Beh uānn tsit-gia̍p, ài sing khó li̍p-tsì sió-khó--ooh.", huayu: "想換職業，要先考立志小考喔。" } },
    { who: "volunteer_lem", emotion: "平靜", text: "總共 20 題，五科每科 4 題，答對 16 題就過關。", taigi: { hanji: "攏總二十題，五科逐科四題，回答著十六題就過關。", tailo: "Lóng-tsóng jī-tsa̍p tê, gōo kho ta̍k kho sì tê, huê-tap tio̍h tsa̍p-la̍k tê tō kuè-kuan.", huayu: "總共 20 題，五科每科 4 題，答對 16 題就過關。" } },
    { who: "volunteer_lem", emotion: "平靜", text: "題目會念給你聽，念完才開始算時間。", taigi: { hanji: "題目會念予你聽，念了才開始算時間。", tailo: "Tê-bo̍k ē liām hōo lí thiann, liām liáu tsiah khai-sí sǹg sî-kan.", huayu: "題目會念給你聽，念完才開始算時間。" } },
    { who: "volunteer_lem", emotion: "平靜", text: "提示和卡片不能用；中途離開也算考一次。", taigi: { hanji: "提示佮卡片袂使用；中途離開，嘛算考一擺。", tailo: "Thê-sī kah khah-phìnn bē-sái īng; tiong-tôo lī-khui, mā sǹg khó tsi̍t pái.", huayu: "提示和卡片不能用；中途離開也算考一次。" } }
  ],
  D_TRIAL_PASS_LEM: [
    { who: "volunteer_lem", emotion: "開心", text: "恭喜你！祝你越來越厲害喔！", taigi: { hanji: "恭喜你！祝你愈來愈𠢕喔！", tailo: "Kiong-hí--lí! Tsiok lí jú lâi jú gâu--ooh!", huayu: "恭喜你！祝你越來越厲害喔！" } }
  ],
  D_TRIAL_FAIL_LEM: [
    { who: "volunteer_lem", emotion: "平靜", text: "這次還沒過，沒關係。", taigi: { hanji: "這擺猶未過關，無要緊。", tailo: "Tsit pái iáu-buē kuè-kuan, bô iàu-kín.", huayu: "這次還沒過，沒關係。" } },
    { who: "volunteer_lem", emotion: "平靜", text: "答錯的單元回去多練習，明天可以再來考。", taigi: { hanji: "毋著的單元轉去加練習，明仔載會使閣來考。", tailo: "M̄-tio̍h ê tan-guân tńg-khì ke liān-si̍p, miâ-á-tsài ē-sái koh lâi khó.", huayu: "答錯的單元回去多練習，明天可以再來考。" } },
    { who: "volunteer_lem", emotion: "開心", text: "當見習冒險者，一樣能打倒魔王喔！", taigi: { hanji: "做見習冒險者，仝款會當拍贏魔王喔！", tailo: "Tsò kiàn-si̍p mōo-hiám-tsiá, kāng-khuán ē-tàng phah-iânn môo-ông--ooh!", huayu: "當見習冒險者，一樣能打倒魔王喔！" } }
  ],
  D_TRIAL_AGAIN_LEM: [
    { who: "volunteer_lem", emotion: "平靜", text: "今天已經考一次了，明天再來喔。", taigi: { hanji: "今仔日已經考一擺矣，明仔載才閣來喔。", tailo: "Kin-á-ji̍t í-king khó tsi̍t pái--ah, miâ-á-tsài tsiah koh lâi--ooh.", huayu: "今天已經考一次了，明天再來喔。" } }
  ],
  D_JOB_LV1_LEM: [
    { who: "volunteer_lem", emotion: "平靜", text: "換了職業，等級會從 1 開始。", taigi: { hanji: "換職業了後，等級會對一級開始。", tailo: "Uānn tsit-gia̍p liáu-āu, tíng-kip ē tuì tsi̍t kip khai-sí.", huayu: "換了職業，等級會從 1 開始。" } },
    { who: "volunteer_lem", emotion: "開心", text: "不過能力有保底，不會少太多，不用擔心。", taigi: { hanji: "毋過能力袂減傷濟，免煩惱。", tailo: "M̄-koh lîng-li̍k bē kiám siunn tsē, bián huân-ló.", huayu: "不過能力有保底，不會少太多，不用擔心。" } }
  ],
  D_JOB_BACK_LEM: [
    { who: "volunteer_lem", emotion: "開心", text: "這個職業你以前當過，免費換回去，不用考試。", taigi: { hanji: "這个職業你以早做過，免錢換轉去，免考試。", tailo: "Tsit ê tsit-gia̍p lí í-tsá tsò--kuè, bián-tsînn uānn tńg-khì, bián khó-tshì.", huayu: "這個職業你以前當過，免費換回去，不用考試。" } },
    { who: "volunteer_lem", emotion: "平靜", text: "等級也會和以前一樣喔。", taigi: { hanji: "等級嘛會佮以早仝款喔。", tailo: "Tíng-kip mā ē kah í-tsá kāng-khuán--ooh.", huayu: "等級也會和以前一樣喔。" } }
  ],
  D_TEMPLE_BLESS_LEM: [
    { who: "volunteer_lem", emotion: "開心", text: "你這陣子真認真，這是你自己努力得來的！", taigi: { hanji: "你這站足認真，這攏是你家己拍拚來的！", tailo: "Lí tsit-tsām tsiok jīn-tsin, tse lóng sī lí ka-kī phah-piànn lâi--ê!", huayu: "你這陣子真認真，這是你自己努力得來的！" } },
    { who: "volunteer_lem", emotion: "開心", text: "一路平安，再加油喔！", taigi: { hanji: "一路平安，閣加油喔！", tailo: "Tsi̍t-lōo pîng-an, koh ka-iû--ooh!", huayu: "一路平安，再加油喔！" } }
  ],
  D_TEMPLE_LOCKED_FGS: [
    { who: "volunteer_fgs", emotion: "平靜", text: "見習冒險者到 10 級，才能來考立志小考喔。", taigi: { hanji: "見習冒險者到十級，才會使來考立志小考喔。", tailo: "Kiàn-si̍p mōo-hiám-tsiá kàu tsa̍p kip, tsiah ē-sái lâi khó li̍p-tsì sió-khó--ooh.", huayu: "見習冒險者到 10 級，才能來考立志小考喔。" } }
  ],
  D_TRIAL_INTRO_FGS: [
    { who: "volunteer_fgs", emotion: "平靜", text: "想換職業，要先考立志小考喔。", taigi: { hanji: "欲換職業，愛先考立志小考喔。", tailo: "Beh uānn tsit-gia̍p, ài sing khó li̍p-tsì sió-khó--ooh.", huayu: "想換職業，要先考立志小考喔。" } },
    { who: "volunteer_fgs", emotion: "平靜", text: "總共 20 題，五科每科 4 題，答對 16 題就過關。", taigi: { hanji: "攏總二十題，五科逐科四題，回答著十六題就過關。", tailo: "Lóng-tsóng jī-tsa̍p tê, gōo kho ta̍k kho sì tê, huê-tap tio̍h tsa̍p-la̍k tê tō kuè-kuan.", huayu: "總共 20 題，五科每科 4 題，答對 16 題就過關。" } },
    { who: "volunteer_fgs", emotion: "平靜", text: "題目會念給你聽，念完才開始算時間。", taigi: { hanji: "題目會念予你聽，念了才開始算時間。", tailo: "Tê-bo̍k ē liām hōo lí thiann, liām liáu tsiah khai-sí sǹg sî-kan.", huayu: "題目會念給你聽，念完才開始算時間。" } },
    { who: "volunteer_fgs", emotion: "平靜", text: "提示和卡片不能用；中途離開也算考一次。", taigi: { hanji: "提示佮卡片袂使用；中途離開，嘛算考一擺。", tailo: "Thê-sī kah khah-phìnn bē-sái īng; tiong-tôo lī-khui, mā sǹg khó tsi̍t pái.", huayu: "提示和卡片不能用；中途離開也算考一次。" } }
  ],
  D_TRIAL_PASS_FGS: [
    { who: "volunteer_fgs", emotion: "開心", text: "恭喜你！祝你越來越厲害喔！", taigi: { hanji: "恭喜你！祝你愈來愈𠢕喔！", tailo: "Kiong-hí--lí! Tsiok lí jú lâi jú gâu--ooh!", huayu: "恭喜你！祝你越來越厲害喔！" } }
  ],
  D_TRIAL_FAIL_FGS: [
    { who: "volunteer_fgs", emotion: "平靜", text: "這次還沒過，沒關係。", taigi: { hanji: "這擺猶未過關，無要緊。", tailo: "Tsit pái iáu-buē kuè-kuan, bô iàu-kín.", huayu: "這次還沒過，沒關係。" } },
    { who: "volunteer_fgs", emotion: "平靜", text: "答錯的單元回去多練習，明天可以再來考。", taigi: { hanji: "毋著的單元轉去加練習，明仔載會使閣來考。", tailo: "M̄-tio̍h ê tan-guân tńg-khì ke liān-si̍p, miâ-á-tsài ē-sái koh lâi khó.", huayu: "答錯的單元回去多練習，明天可以再來考。" } },
    { who: "volunteer_fgs", emotion: "開心", text: "當見習冒險者，一樣能打倒魔王喔！", taigi: { hanji: "做見習冒險者，仝款會當拍贏魔王喔！", tailo: "Tsò kiàn-si̍p mōo-hiám-tsiá, kāng-khuán ē-tàng phah-iânn môo-ông--ooh!", huayu: "當見習冒險者，一樣能打倒魔王喔！" } }
  ],
  D_TRIAL_AGAIN_FGS: [
    { who: "volunteer_fgs", emotion: "平靜", text: "今天已經考一次了，明天再來喔。", taigi: { hanji: "今仔日已經考一擺矣，明仔載才閣來喔。", tailo: "Kin-á-ji̍t í-king khó tsi̍t pái--ah, miâ-á-tsài tsiah koh lâi--ooh.", huayu: "今天已經考一次了，明天再來喔。" } }
  ],
  D_JOB_LV1_FGS: [
    { who: "volunteer_fgs", emotion: "平靜", text: "換了職業，等級會從 1 開始。", taigi: { hanji: "換職業了後，等級會對一級開始。", tailo: "Uānn tsit-gia̍p liáu-āu, tíng-kip ē tuì tsi̍t kip khai-sí.", huayu: "換了職業，等級會從 1 開始。" } },
    { who: "volunteer_fgs", emotion: "開心", text: "不過能力有保底，不會少太多，不用擔心。", taigi: { hanji: "毋過能力袂減傷濟，免煩惱。", tailo: "M̄-koh lîng-li̍k bē kiám siunn tsē, bián huân-ló.", huayu: "不過能力有保底，不會少太多，不用擔心。" } }
  ],
  D_JOB_BACK_FGS: [
    { who: "volunteer_fgs", emotion: "開心", text: "這個職業你以前當過，免費換回去，不用考試。", taigi: { hanji: "這个職業你以早做過，免錢換轉去，免考試。", tailo: "Tsit ê tsit-gia̍p lí í-tsá tsò--kuè, bián-tsînn uānn tńg-khì, bián khó-tshì.", huayu: "這個職業你以前當過，免費換回去，不用考試。" } },
    { who: "volunteer_fgs", emotion: "平靜", text: "等級也會和以前一樣喔。", taigi: { hanji: "等級嘛會佮以早仝款喔。", tailo: "Tíng-kip mā ē kah í-tsá kāng-khuán--ooh.", huayu: "等級也會和以前一樣喔。" } }
  ],
  D_TEMPLE_BLESS_FGS: [
    { who: "volunteer_fgs", emotion: "開心", text: "你這陣子真認真，這是你自己努力得來的！", taigi: { hanji: "你這站足認真，這攏是你家己拍拚來的！", tailo: "Lí tsit-tsām tsiok jīn-tsin, tse lóng sī lí ka-kī phah-piànn lâi--ê!", huayu: "你這陣子真認真，這是你自己努力得來的！" } },
    { who: "volunteer_fgs", emotion: "開心", text: "一路平安，佛祖也會保佑。", huayu_only: true, taigi_draft: { hanji: "一路平安，佛祖嘛會保庇。", tailo: "Tsi̍t-lōo pîng-an, Pu̍t-tsóo mā ē pó-pì.", huayu: "一路平安，佛祖也會保佑。" } }
  ],
  D_ADV_OPEN: [
    { who: "narrator", emotion: "開心", text: "你到過鹿耳門聖母廟了！高級職業即將登場喔！", huayu_only: true },
    { who: "narrator", emotion: "平靜", text: "登場以後，要先把需要的中級職業練到 50 級。", huayu_only: true }
  ],
  D_LAMP_AUTO: [
    { who: "narrator", emotion: "開心", text: "遠方的金包里，一盞燈亮了。" },
    { who: "pet", emotion: "開心", text: "里長伯一定很高興！" }
  ],
  D_CH6_END: [
    { who: "narrator", emotion: "開心", text: "第六章完成！" },
    { who: "pet", emotion: "開心", text: "曙光碎片有三片了，霧仔也加入了！" },
    { who: "pet", emotion: "平靜", text: "從府城古城往南走，就到月世界了！" }
  ],
  D_CH7_END: [
    { who: "narrator", emotion: "開心", text: "第七章完成！" },
    { who: "pet", emotion: "開心", text: "五盞燈都亮了，記憶貝殼也回來了！" },
    { who: "fog_kid", emotion: "平靜", text: "東邊還有一位霧將，在花蓮的海上……" }
  ],
  D_MIGRATE_SOUTH: [
    { who: "narrator", emotion: "開心", text: "嘉義、台南和高雄的地方變了！以前去過的地方照樣能去。" }
  ],
  D_SHIP_ESCAPE: [
    { who: "narrator", emotion: "驚訝", text: "西邊水道口的霧裡，出現一艘灰帆船！" },
    { who: "pib_ship", emotion: "開心", text: "嘿嘿，被發現了！我先溜去南邊囉！" },
    { who: "narrator", emotion: "平靜", text: "霧帆號往南邊的大海逃走了。" },
    { who: "pet", emotion: "生氣", text: "別跑！我們一定會追上你！" }
  ],
  D_FERRY: [
    { who: "narrator", emotion: "平靜", text: "船慢慢開出港口，海風吹過來。" },
    { who: "pet", emotion: "開心", text: "海好藍喔！坐好、抓穩扶手！" }
  ],
  D_FERRY_DONGGANG_LIUQIU_BUY: [
    { who: "ticket_seller", emotion: "平靜", text: "來回票要 200 金幣喔。", huayu_only: true, taigi_draft: { hanji: "來回票愛兩百个金幣喔。", tailo: "Lâi-huê-phiò ài nn̄g-pah ê kim-pè--ooh.", huayu: "來回票要 200 金幣喔。" } }
  ],
  D_FERRY_DONGGANG_LIUQIU_NO_MONEY: [
    { who: "ticket_seller", emotion: "擔心", text: "金幣不夠喔，先去打怪賺金幣。", huayu_only: true, taigi_draft: { hanji: "金幣無夠喔，先去拍怪物趁金幣。", tailo: "Kim-pè bô-kàu--ooh, sing khì phah kuài-bu̍t thàn kim-pè.", huayu: "金幣不夠喔，先去打怪賺金幣。" } }
  ],
  D_FERRY_DONGGANG_LIUQIU_BOARD: [
    { who: "narrator", emotion: "開心", text: "上船囉！船要開了。" }
  ],
  D_FERRY_DONGGANG_LIUQIU_ARRIVE: [
    { who: "narrator", emotion: "平靜", text: "船靠岸了！下船要小心喔。" }
  ],
  D_SOUTH_JOB_HINT: [
    { who: "elf_elder", emotion: "平靜", text: "見習冒險者，到宮廟或府城公會轉職，會更快變強喔。" }
  ],
  D_BOSS_ANCHOR_A: [
    { who: "pib_anchor", emotion: "生氣", text: "嘿咻……這張圖……是我的……我要守好……" },
    { who: "pet", emotion: "驚訝", text: "錨錨大副被霧弄迷糊了！答對題目叫醒它！" }
  ],
  D_BOSS_ANCHOR_B: [
    { who: "pib_anchor", emotion: "平靜", text: "嗯……我想起來了，這張圖是港口書記的。" }
  ],
  D_FERRY_NEED_TICKET: [
    { who: "ticket_seller", emotion: "平靜", text: "要坐船，要先來我這裡買來回票喔。", huayu_only: true, taigi_draft: { hanji: "欲坐船，愛先來我遮買來回票喔。", tailo: "Beh tsē tsûn, ài sing lâi guá tsia bé lâi-huê-phiò--ooh.", huayu: "要坐船，要先來我這裡買來回票喔。" } },
    { who: "pet", emotion: "平靜", text: "來回票 200 金幣，買一次就能去小琉球再回來！" }
  ],
  D_FERRY_FREE_RETURN: [
    { who: "island_guide", emotion: "開心", text: "沒有票也別擔心，這班船免費載你回東港。", huayu_only: true, taigi_draft: { hanji: "無票嘛免煩惱，這班船免錢載你轉去東港。", tailo: "Bô phiò mā bián huân-ló, tsit pan tsûn bián-tsînn tsài lí tńg-khì Tang-káng.", huayu: "沒有票也別擔心，這班船免費載你回東港。" } },
    { who: "pet", emotion: "開心", text: "下次記得在東港碼頭先買來回票喔！" }
  ],
  D_FOGLING_TALK: [
    { who: "fog_kid", emotion: "開心", text: "霧散開的地方，就有路喔！" }
  ],
  D_SIGN_TAITUNG: [
    { who: "pet", emotion: "平靜", text: "往台東的路，要等之後開放才能走。" }
  ],
  D_BOSS_SHIP_A: [
    { who: "pib_ship", emotion: "生氣", text: "嘿呦！升起霧帆！小海盜們，上！" },
    { who: "pet", emotion: "驚訝", text: "霧帆號被霧弄迷糊了！答對題目叫醒它！" }
  ],
  D_BOSS_SHIP_B: [
    { who: "pib_ship", emotion: "平靜", text: "霧做的帆……變成白雲了。我想起來了。" },
    { who: "pib_ship", emotion: "平靜", text: "對不起，記憶貝殼都還給大家。" }
  ],
  D_EXIT_LOCK_BG: [
    { who: "pet", emotion: "平靜", text: "要先完成中部的冒險，才能走這條路喔！" },
    { who: "pet", emotion: "平靜", text: "先讓鎮外河堤的燈籠霧將清醒，再往嘉義出發！" }
  ],
  D_SIGN_CHIAYI_V30: [
    { who: "pet", emotion: "開心", text: "往嘉義：神木森林。過北港溪大橋往南走就到了！", huayu_only: true }
  ],
  D_SIGN_TATAKA: [
    { who: "pet", emotion: "平靜", text: "往塔塔加的路，要等之後開放才能走。" }
  ],
  D_EXIT_LOCK_ORC: [
    { who: "pet", emotion: "擔心", text: "月世界的暴躁石像還在發脾氣。" },
    { who: "pet", emotion: "平靜", text: "先回去幫獸人族長，再往屏東出發！" }
  ],
  D_EXIT_LOCK_AP: [
    { who: "pet", emotion: "擔心", text: "霧太濃了，要有航海圖才找得到往台江的水道。" },
    { who: "pet", emotion: "平靜", text: "先幫港口書記拿回航海圖吧！" }
  ],
  D_EXIT_LOCK_FC_W: [
    { who: "pet", emotion: "平靜", text: "先幫神木森林的精靈拿到自然之光。" },
    { who: "pet", emotion: "平靜", text: "拿到以後，再往西邊的安平出發！" }
  ],
  D_EXIT_LOCK_FC_S: [
    { who: "pet", emotion: "擔心", text: "古城塔頂的霧還沒散，先別往南走。" },
    { who: "pet", emotion: "平靜", text: "先去塔頂，讓南霧將清醒吧！" }
  ],
  // ═════════════ v3.0 南部 END ═════════════

  // ═════════════ v4.0 東部終章：洞窟解謎的規則與提示（71 號 2.11、2.12；劇本語音組 wip_v40_draft/dialogs_east2.js，v40_apply.js 每次重跑都整段重建）BEGIN ═════════════
  D_CAVE_NOMAP: [
    { who: "fog_kid", emotion: "平靜", text: "洞窟裡霧太濃，看不到地圖，跟著羅盤走吧！" },
    { who: "fog_kid", emotion: "開心", text: "拿出曙光羅盤！地上的金色光點，就是正確的路。" }
  ],
  D_CAVE_LAMP: [
    { who: "pet", emotion: "開心", text: "是山屋小燈！點亮它，可以休息、存檔喔。" }
  ],
  D_PZ_SOLVED: [
    { who: "fog_kid", emotion: "開心", text: "解開了！你好聰明！" }
  ],
  D_PZ_STUCK: [
    { who: "fog_kid", emotion: "平靜", text: "箱子卡住了，按「重來」再試一次吧！" }
  ],
  D_PZ_ALL: [
    { who: "narrator", emotion: "開心", text: "12 道機關全部解開了！得到稱號「霧之洞窟解謎王」！" }
  ],
  D_PZ_P1_1_RULE: [
    { who: "fog_kid", emotion: "平靜", text: "踩一塊踏板，連著它的燈會換：暗的變亮、亮的變暗。" },
    { who: "fog_kid", emotion: "平靜", text: "讓三盞燈都亮，門就開。" }
  ],
  D_PZ_P1_1_H1: [
    { who: "fog_kid", emotion: "平靜", text: "看地上的線：每塊踏板連到哪幾盞燈？" }
  ],
  D_PZ_P1_1_H2: [
    { who: "fog_kid", emotion: "平靜", text: "中間那塊會把已經亮的燈弄暗，先試試旁邊兩塊。" }
  ],
  D_PZ_P1_1_H3: [
    { who: "fog_kid", emotion: "平靜", text: "踩最左邊的踏板，再踩最右邊的踏板。" }
  ],
  D_PZ_P1_2_RULE: [
    { who: "fog_kid", emotion: "平靜", text: "牆上的圖案照規律排。下一個是什麼？" },
    { who: "fog_kid", emotion: "平靜", text: "站到對的地板上。" }
  ],
  D_PZ_P1_2_H1: [
    { who: "fog_kid", emotion: "平靜", text: "形狀是怎麼輪流的？" }
  ],
  D_PZ_P1_2_H2: [
    { who: "fog_kid", emotion: "平靜", text: "顏色是紅、藍、紅、藍……" }
  ],
  D_PZ_P1_2_H3: [
    { who: "fog_kid", emotion: "平靜", text: "下一個是方形，顏色是藍色。" }
  ],
  D_PZ_P1_3_RULE: [
    { who: "fog_kid", emotion: "平靜", text: "一次翻兩張，一樣就留著，不一樣會蓋回去。" },
    { who: "fog_kid", emotion: "平靜", text: "把 4 對都找出來。" }
  ],
  D_PZ_P1_3_H1: [
    { who: "fog_kid", emotion: "平靜", text: "翻過的牌，要記住它在哪裡。" }
  ],
  D_PZ_P1_3_H2: [
    { who: "fog_kid", emotion: "平靜", text: "先把每張都翻一次，記住哪裡有什麼。" }
  ],
  D_PZ_P1_3_H3: [
    { who: "fog_kid", emotion: "開心", text: "我讓牌一起亮一下，看清楚喔！" }
  ],
  D_PZ_P2_1_RULE: [
    { who: "fog_kid", emotion: "平靜", text: "冰塊箱只能推、不能拉。" },
    { who: "fog_kid", emotion: "平靜", text: "把它推到發光的格子上。" }
  ],
  D_PZ_P2_1_H1: [
    { who: "fog_kid", emotion: "平靜", text: "冰塊箱只能推，不能拉；推到牆角就推不出來了。" }
  ],
  D_PZ_P2_1_H2: [
    { who: "fog_kid", emotion: "平靜", text: "先把冰塊箱往左推到牆邊，再往上推。" }
  ],
  D_PZ_P2_1_H3: [
    { who: "fog_kid", emotion: "開心", text: "看地上的箭頭，先照著走 5 步！" }
  ],
  D_PZ_P2_2_RULE: [
    { who: "fog_kid", emotion: "平靜", text: "天平左邊是 7 公斤的冰塊。" },
    { who: "fog_kid", emotion: "平靜", text: "選兩顆石頭放到右邊，讓天平平平的。" }
  ],
  D_PZ_P2_2_H1: [
    { who: "fog_kid", emotion: "平靜", text: "兩顆加起來要等於 7。" }
  ],
  D_PZ_P2_2_H2: [
    { who: "fog_kid", emotion: "平靜", text: "1 和 4 加起來只有 5，不夠。" }
  ],
  D_PZ_P2_2_H3: [
    { who: "fog_kid", emotion: "平靜", text: "試試 2 和 5。" }
  ],
  D_PZ_P2_3_RULE: [
    { who: "fog_kid", emotion: "平靜", text: "冰柱上的數字照規律排。下一個是多少？" },
    { who: "fog_kid", emotion: "平靜", text: "站到對的地板上。" }
  ],
  D_PZ_P2_3_H1: [
    { who: "fog_kid", emotion: "平靜", text: "看看每兩個數差多少。" }
  ],
  D_PZ_P2_3_H2: [
    { who: "fog_kid", emotion: "平靜", text: "差是 1、2、3、4……" }
  ],
  D_PZ_P2_3_H3: [
    { who: "fog_kid", emotion: "平靜", text: "12 再加 5。" }
  ],
  D_PZ_P3_1_RULE: [
    { who: "fog_kid", emotion: "平靜", text: "點一下鏡子，它會換方向。" },
    { who: "fog_kid", emotion: "平靜", text: "讓光從鏡子彈過去，照到水晶。" }
  ],
  D_PZ_P3_1_H1: [
    { who: "fog_kid", emotion: "平靜", text: "光碰到鏡子會彈開，換一個方向。" }
  ],
  D_PZ_P3_1_H2: [
    { who: "fog_kid", emotion: "平靜", text: "有一面鏡子不管怎麼轉，光都碰不到它。" }
  ],
  D_PZ_P3_1_H3: [
    { who: "fog_kid", emotion: "平靜", text: "點左上那面鏡子，再點下面那面。" }
  ],
  D_PZ_P3_2_RULE: [
    { who: "fog_kid", emotion: "平靜", text: "從一顆石頭出發，把 8 條路都走過。" },
    { who: "fog_kid", emotion: "平靜", text: "每條路只能走一次。" }
  ],
  D_PZ_P3_2_H1: [
    { who: "fog_kid", emotion: "平靜", text: "走過的路會發亮，發亮的路不能再走。" }
  ],
  D_PZ_P3_2_H2: [
    { who: "fog_kid", emotion: "平靜", text: "有兩顆石頭連著 3 條路，要從其中一顆出發。" }
  ],
  D_PZ_P3_2_H3: [
    { who: "fog_kid", emotion: "平靜", text: "從左下角的石頭出發。" }
  ],
  D_PZ_P3_3_RULE: [
    { who: "fog_kid", emotion: "平靜", text: "三個式子裡，一樣的符號代表一樣的數。" },
    { who: "fog_kid", emotion: "平靜", text: "■ 是多少？轉動密碼盤。" }
  ],
  D_PZ_P3_3_H1: [
    { who: "fog_kid", emotion: "平靜", text: "先看第一個式子：兩個 ▲ 一樣大。" }
  ],
  D_PZ_P3_3_H2: [
    { who: "fog_kid", emotion: "平靜", text: "▲ 是 4，那 ● 是多少？" }
  ],
  D_PZ_P3_3_H3: [
    { who: "fog_kid", emotion: "平靜", text: "● 是 3。9 減 3 是多少？" }
  ],
  D_PZ_P4_1_RULE: [
    { who: "fog_kid", emotion: "平靜", text: "兩個石箱都要推到發光的格子上。" },
    { who: "fog_kid", emotion: "平靜", text: "只能推、不能拉。" }
  ],
  D_PZ_P4_1_H1: [
    { who: "fog_kid", emotion: "平靜", text: "左邊的箱子推到左邊的格子，右邊的推到右邊。" }
  ],
  D_PZ_P4_1_H2: [
    { who: "fog_kid", emotion: "平靜", text: "中間的牆擋住了，要先從上面繞到箱子旁邊。" }
  ],
  D_PZ_P4_1_H3: [
    { who: "fog_kid", emotion: "開心", text: "看地上的箭頭，照著推左邊的箱子！" }
  ],
  D_PZ_P4_2_RULE: [
    { who: "fog_kid", emotion: "平靜", text: "踩一顆星石，它和旁邊兩顆會一起換。" },
    { who: "fog_kid", emotion: "平靜", text: "亮的變暗，暗的變亮。讓五顆都亮。" }
  ],
  D_PZ_P4_2_H1: [
    { who: "fog_kid", emotion: "平靜", text: "每踩一顆，它和左右兩顆都會換。" }
  ],
  D_PZ_P4_2_H2: [
    { who: "fog_kid", emotion: "平靜", text: "現在亮的是 1 號和 3 號；踩 2 號會讓它們變暗喔。" }
  ],
  D_PZ_P4_2_H3: [
    { who: "fog_kid", emotion: "平靜", text: "踩 1 號、2 號、3 號各一次。" }
  ],
  D_PZ_P4_3_RULE: [
    { who: "fog_kid", emotion: "平靜", text: "把三個石盤全部搬到最右邊的柱子。" },
    { who: "fog_kid", emotion: "平靜", text: "一次只能搬一個，大的不能壓在小的上面。" }
  ],
  D_PZ_P4_3_H1: [
    { who: "fog_kid", emotion: "平靜", text: "一次只能搬一個，大的不能壓在小的上面。" }
  ],
  D_PZ_P4_3_H2: [
    { who: "fog_kid", emotion: "平靜", text: "第一步：把最小的放到最右邊。" }
  ],
  D_PZ_P4_3_H3: [
    { who: "fog_kid", emotion: "開心", text: "前 3 步：小→右、中→中、小→中。" }   // 實玩 D4（2026-11-09）：疊石盤地上沒有提示（puzzles.js hint3 沒有畫面提示），換回 puzzles.js P4-3 hints[2] 原文
  ],
  // ═════════════ v4.0 東部終章（洞窟解謎） END ═════════════

  // ═════════════ v4.0 東部（71 號第四節 M26–M29；劇本語音組 wip_v40_draft/dialogs_east.js 第一段＋前端佔位句；wip_v40/v40_apply.js 每次重跑都整段重建）BEGIN ═════════════
  D_EXIT_LOCK_TT_BOSS: [
    { who: "pet", emotion: "擔心", text: "高台上的霧氣球大王擋住了天空，先讓它清醒。" }
  ],
  D_EXIT_LOCK_TT_ISLE: [
    { who: "fog_kid", emotion: "平靜", text: "東霧將的霧是從海上來的，先去綠島和蘭嶼問問住在海邊的人。" }
  ],
  D_EXIT_LOCK_HL: [
    { who: "pet", emotion: "擔心", text: "東霧將還在海上吹霧，山谷裡什麼都看不見。" },
    { who: "pet", emotion: "平靜", text: "先去海邊，幫漁夫阿伯的忙吧！" }
  ],
  D_ISLANDS_DONE: [
    { who: "fog_kid", emotion: "驚訝", text: "海水是往北流的……東霧將一定在花蓮！" }
  ],
  D_CH8_END: [
    { who: "narrator", emotion: "開心", text: "第八章完成！" },
    { who: "fog_kid", emotion: "開心", text: "四片碎片會指向哪裡呢？往西進中橫公路吧！" }
  ],
  D_TT_1A: [
    { who: "ruins_guide", emotion: "開心", text: "歡迎來臺東！這裡有很多古時候的人留下的東西。", taigi: { hanji: "歡迎來臺東！遮有真濟古早人留落來的物件。", tailo: "Huan-gîng lâi Tâi-tang! Tsia ū tsin tsē kóo-tsá-lâng lâu--lo̍h-lâi ê mi̍h-kiānn.", huayu: "歡迎來臺東！這裡有很多古時候的人留下的東西。" } },
    { who: "pet", emotion: "開心", text: "這裡是卑南遺址公園，是臺灣第一座考古遺址公園喔！" },
    { who: "ruins_guide", emotion: "平靜", text: "你看，草地中間那根就是月形石柱。", taigi: { hanji: "你看，草埔中央彼支就是月形石柱。", tailo: "Lí khuànn, tsháu-poo tiong-ng hit ki tō-sī gue̍h-hîng tsio̍h-thiāu.", huayu: "你看，草地中間那根就是月形石柱。" } },
    { who: "ruins_guide", emotion: "擔心", text: "霧讓我忘了這裡的故事，幫我想 2 題好嗎？", taigi: { hanji: "霧予我袂記得遮的故事，共我想兩題，好無？", tailo: "Bū hōo guá bē-kì-tit tsia ê kòo-sū, kā guá siūnn nn̄g tê, hó--bô?", huayu: "霧讓我忘了這裡的故事，幫我想 2 題好嗎？" } }
  ],
  D_TT_1B: [
    { who: "ruins_guide", emotion: "開心", text: "你都答對了，聽得真認真！", taigi: { hanji: "你攏回答著矣，聽甲真認真！", tailo: "Lí lóng huê-tap tio̍h--ah, thiann kah tsin jīn-tsin!", huayu: "你都答對了，聽得真認真！" } },
    { who: "ruins_guide", emotion: "開心", text: "這些金幣送你，謝謝你！", taigi: { hanji: "這寡金幣送你，多謝你！", tailo: "Tsit-kuá kim-pè sàng lí, to-siā--lí!", huayu: "這些金幣送你，謝謝你！" } },
    { who: "pet", emotion: "平靜", text: "鹿野高台的熱氣球隊，好像需要幫忙！" }
  ],
  D_RUINS_IDLE: [
    { who: "ruins_guide", emotion: "平靜", text: "遺址圍起來了，在外面看就好。", taigi: { hanji: "古早人留落來的所在圍起來矣，佇外口看就好。", tailo: "Kóo-tsá-lâng lâu--lo̍h-lâi ê sóo-tsāi uî khí-lâi--ah, tī guā-kháu khuànn tō hó.", huayu: "遺址圍起來了，在外面看就好。" } }
  ],
  D_TT_2A: [
    { who: "balloon_captain", emotion: "開心", text: "歡迎來鹿野！這裡看得到一整片田野。", taigi: { hanji: "歡迎來鹿野！遮看會著規片田園。", tailo: "Huan-gîng lâi Lo̍k-iá! Tsia khuànn ē tio̍h kui phìnn tshân-hn̂g.", huayu: "歡迎來鹿野！這裡看得到一整片田野。" } },
    { who: "pet", emotion: "開心", text: "每年 6 到 8 月，是鹿野高台飛熱氣球的好時機！" },
    { who: "balloon_captain", emotion: "擔心", text: "可是霧把我們的球壓住，飛不起來。", taigi: { hanji: "毋過霧共阮的球硩咧，飛袂起來。", tailo: "M̄-koh bū kā guán ê kiû teh--leh, pue bē khí-lâi.", huayu: "可是霧把我們的球壓住，飛不起來。" } },
    { who: "balloon_captain", emotion: "平靜", text: "幫我們看風，答對 3 題好嗎？", taigi: { hanji: "共阮看風，回答三題，好無？", tailo: "Kā guán khuànn hong, huê-tap sann tê, hó--bô?", huayu: "幫我們看風，答對 3 題好嗎？" } }
  ],
  D_TT_2B: [
    { who: "balloon_captain", emotion: "開心", text: "知道風向了！謝謝你。", taigi: { hanji: "風向知影矣！多謝你。", tailo: "Hong-hiòng tsai-iánn--ah! To-siā--lí.", huayu: "知道風向了！謝謝你。" } },
    { who: "balloon_captain", emotion: "開心", text: "這些金幣送你，謝謝你！", taigi: { hanji: "這寡金幣送你，多謝你！", tailo: "Tsit-kuá kim-pè sàng lí, to-siā--lí!", huayu: "這些金幣送你，謝謝你！" } },
    { who: "balloon_captain", emotion: "擔心", text: "可是上面有一顆霧做的大球擋著！", taigi: { hanji: "毋過頂懸有一粒霧做的大球擋咧！", tailo: "M̄-koh tíng-kuân ū tsi̍t lia̍p bū tsò ê tuā kiû tòng--leh!", huayu: "可是上面有一顆霧做的大球擋著！" } }
  ],
  D_TT_3A: [
    { who: "balloon_captain", emotion: "平靜", text: "讓那顆大球清醒，天空才會乾淨。", taigi: { hanji: "予彼粒大球清醒，天頂才會清。", tailo: "Hōo hit lia̍p tuā kiû tshing-tshínn, thinn-tíng tsiah ē tshing.", huayu: "讓那顆大球清醒，天空才會乾淨。" } },
    { who: "pet", emotion: "驚訝", text: "是霧氣球大王！答對題目，把霧放出來！" }
  ],
  D_BOSS_BALLOON_A: [
    { who: "fob_balloon", emotion: "神祕", text: "呼嚕嚕……我要一直飄在這裡……誰也別想飛……" },
    { who: "pet", emotion: "驚訝", text: "答對題目，讓霧從大球裡漏出來！" }
  ],
  D_BOSS_BALLOON_B: [
    { who: "fob_balloon", emotion: "平靜", text: "霧……漏光了……我要變回彩色的熱氣球了。" }
  ],
  D_TT_3B: [
    { who: "balloon_captain", emotion: "開心", text: "天空乾淨了！謝謝你，勇者！", taigi: { hanji: "天頂清矣！多謝你，勇者！", tailo: "Thinn-tíng tshing--ah! To-siā lí, ióng-tsiá!", huayu: "天空乾淨了！謝謝你，勇者！" } },
    { who: "balloon_captain", emotion: "開心", text: "這些金幣送你，謝謝你！", taigi: { hanji: "這寡金幣送你，多謝你！", tailo: "Tsit-kuá kim-pè sàng lí, to-siā--lí!", huayu: "這些金幣送你，謝謝你！" } },
    { who: "balloon_captain", emotion: "驚訝", text: "我在上面看到一隻雲做的大鯨魚，往北游。", taigi: { hanji: "我佇頂懸看著一隻雲做的大海翁，向北爿泅。", tailo: "Guá tī tíng-kuân khuànn-tio̍h tsi̍t tsiah hûn tsò ê tuā hái-ang, ǹg pak-pîng siû.", huayu: "我在上面看到一隻雲做的大鯨魚，往北游。" } },
    { who: "fog_kid", emotion: "平靜", text: "東霧將的霧是從海上來的。先去島上，問問住在海邊的人吧！" },
    { who: "pet", emotion: "開心", text: "富岡漁港的船開了，可以去綠島和蘭嶼！" }
  ],
  D_TT_5A: [
    { who: "balloon_captain", emotion: "開心", text: "台東第一顆彩繪的大球，是小朋友畫的！", taigi: { hanji: "臺東第一粒畫圖的大球，是囡仔畫的！", tailo: "Tâi-tang tē-it lia̍p uē-tôo ê tuā kiû, sī gín-á uē--ê!", huayu: "台東第一顆彩繪的大球，是小朋友畫的！" } },
    { who: "pet", emotion: "開心", text: "是縱谷五所國小、335 位小朋友一起畫的！" },
    { who: "balloon_captain", emotion: "平靜", text: "幫我算 2 題好嗎？", taigi: { hanji: "共我算兩題，好無？", tailo: "Kā guá sǹg nn̄g tê, hó--bô?", huayu: "幫我算 2 題好嗎？" } }
  ],
  D_TT_5B: [
    { who: "balloon_captain", emotion: "開心", text: "算對了！你真聰明。", taigi: { hanji: "算著矣！你真巧。", tailo: "Sǹg tio̍h--ah! Lí tsin khiáu.", huayu: "算對了！你真聰明。" } },
    { who: "balloon_captain", emotion: "開心", text: "這些金幣送你，謝謝你！", taigi: { hanji: "這寡金幣送你，多謝你！", tailo: "Tsit-kuá kim-pè sàng lí, to-siā--lí!", huayu: "這些金幣送你，謝謝你！" } }
  ],
  D_BALLOON_IDLE: [
    { who: "balloon_captain", emotion: "平靜", text: "看風很重要，風對了，球才飛得穩。", taigi: { hanji: "看風真重要，風著矣，球才飛會穩。", tailo: "Khuànn hong tsin tiōng-iàu, hong tio̍h--ah, kiû tsiah pue ē ún.", huayu: "看風很重要，風對了，球才飛得穩。" } }
  ],
  D_TT_4A: [
    { who: "custard_farmer", emotion: "開心", text: "台東種的釋迦最多，也很有名。", taigi: { hanji: "臺東種的釋迦上濟，嘛真出名。", tailo: "Tâi-tang tsìng ê sik-khia siōng tsē, mā tsin tshut-miâ.", huayu: "台東種的釋迦最多，也很有名。" } },
    { who: "custard_farmer", emotion: "平靜", text: "釋迦一年可以收成兩次喔！", taigi: { hanji: "釋迦一年會當收兩擺喔！", tailo: "Sik-khia tsi̍t nî ē-tàng siu nn̄g pái--ooh!", huayu: "釋迦一年可以收成兩次喔！" } },
    { who: "pet", emotion: "平靜", text: "第一次在 7 到 11 月，第二次在 12 到 2 月。" },
    { who: "custard_farmer", emotion: "擔心", text: "霧讓我忘了收成的時間，幫我想 2 題好嗎？", taigi: { hanji: "霧予我袂記得收成的時間，共我想兩題，好無？", tailo: "Bū hōo guá bē-kì-tit siu-sîng ê sî-kan, kā guá siūnn nn̄g tê, hó--bô?", huayu: "霧讓我忘了收成的時間，幫我想 2 題好嗎？" } }
  ],
  D_TT_4B: [
    { who: "custard_farmer", emotion: "開心", text: "你都答對了，聽得真認真！", taigi: { hanji: "你攏回答著矣，聽甲真認真！", tailo: "Lí lóng huê-tap tio̍h--ah, thiann kah tsin jīn-tsin!", huayu: "你都答對了，聽得真認真！" } },
    { who: "custard_farmer", emotion: "開心", text: "這些金幣送你，謝謝你！", taigi: { hanji: "這寡金幣送你，多謝你！", tailo: "Tsit-kuá kim-pè sàng lí, to-siā--lí!", huayu: "這些金幣送你，謝謝你！" } }
  ],
  D_CUSTARD_IDLE: [
    { who: "custard_farmer", emotion: "平靜", text: "釋迦要放軟了才好吃。", taigi: { hanji: "釋迦愛囥予軟才好食。", tailo: "Sik-khia ài khǹg hōo nńg tsiah hó tsia̍h.", huayu: "釋迦要放軟了才好吃。" } }
  ],
  D_GI_0: [
    { who: "ticket_seller_fg", emotion: "平靜", text: "往綠島的船票只賣來回，200 金幣。", taigi: { hanji: "往綠島的船票干焦賣來回，兩百个金幣。", tailo: "Óng Li̍k-tó ê tsûn-phiò kan-na bē lâi-huê, nn̄g-pah ê kim-pè.", huayu: "往綠島的船票只賣來回，200 金幣。" } },
    { who: "pet", emotion: "平靜", text: "坐船大約 50 分鐘就到了！" }
  ],
  D_LY_0: [
    { who: "ticket_seller_fg", emotion: "平靜", text: "往蘭嶼的船票只賣來回，200 金幣。", taigi: { hanji: "往蘭嶼的船票干焦賣來回，兩百个金幣。", tailo: "Óng Lân-sū ê tsûn-phiò kan-na bē lâi-huê, nn̄g-pah ê kim-pè.", huayu: "往蘭嶼的船票只賣來回，200 金幣。" } },
    { who: "pet", emotion: "平靜", text: "去蘭嶼比較遠，坐船要 2 到 3 小時。" }
  ],
  D_INN_TAITUNG: [
    { who: "inn_taitung", emotion: "開心", text: "歡迎來台東的民宿！好好休息喔。", taigi: { hanji: "歡迎來臺東的民宿！好好仔歇睏喔。", tailo: "Huan-gîng lâi Tâi-tang ê bîn-sok! Hó-hó-á hioh-khùn--ooh.", huayu: "歡迎來台東的民宿！好好休息喔。" } }
  ],
  D_INN_TAITUNG_NOCOIN: [
    { who: "inn_taitung", emotion: "擔心", text: "金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。", taigi: { hanji: "金幣無夠喔，金包里溫泉旅館會使免錢蹛，嘛會使去拍怪物趁金幣。", tailo: "Kim-pè bô-kàu--ooh, Kim-pau-lí un-tsuânn lí-kuán ē-sái bián-tsînn tuà, mā ē-sái khì phah kuài-bu̍t thàn kim-pè.", huayu: "金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。" } }
  ],
  D_GI_1A: [
    { who: "lighthouse_guide_gi", emotion: "開心", text: "歡迎來綠島！你看，這座白色的燈塔。", taigi: { hanji: "歡迎來綠島！你看，這座白色的燈塔。", tailo: "Huan-gîng lâi Li̍k-tó! Lí khuànn, tsit tsō pe̍h-sik ê ting-thah.", huayu: "歡迎來綠島！你看，這座白色的燈塔。" } },
    { who: "lighthouse_guide_gi", emotion: "平靜", text: "以前有大船在這裡撞到礁石，島上的人勇敢救人。", taigi: { hanji: "較早有大船佇遮挵著礁，島頂的人勇敢救人。", tailo: "Khah-tsá ū tuā tsûn tī tsia lòng-tio̍h ta, tó-tíng ê lâng ióng-kám kiù lâng.", huayu: "以前有大船在這裡撞到礁石，島上的人勇敢救人。" } },
    { who: "pet", emotion: "平靜", text: "後來美國紅十字會為了感謝，捐錢蓋了這座燈塔。" },
    { who: "lighthouse_guide_gi", emotion: "擔心", text: "霧把燈蓋住了，幫我想 3 題好嗎？", taigi: { hanji: "霧共燈崁起來矣，共我想三題，好無？", tailo: "Bū kā ting khàm khí-lâi--ah, kā guá siūnn sann tê, hó--bô?", huayu: "霧把燈蓋住了，幫我想 3 題好嗎？" } }
  ],
  D_GI_1B: [
    { who: "lighthouse_guide_gi", emotion: "開心", text: "燈又亮了！看得好遠。", taigi: { hanji: "燈閣光矣！看會足遠。", tailo: "Ting koh kng--ah! Khuànn ē tsiok hn̄g.", huayu: "燈又亮了！看得好遠。" } },
    { who: "lighthouse_guide_gi", emotion: "開心", text: "這些金幣送你，謝謝你！", taigi: { hanji: "這寡金幣送你，多謝你！", tailo: "Tsit-kuá kim-pè sàng lí, to-siā--lí!", huayu: "這些金幣送你，謝謝你！" } },
    { who: "lighthouse_guide_gi", emotion: "平靜", text: "我看到一片雲往北邊飄去。", taigi: { hanji: "我看著一片雲向北爿飄去。", tailo: "Guá khuànn-tio̍h tsi̍t phìnn hûn ǹg pak-pîng phiau--khì.", huayu: "我看到一片雲往北邊飄去。" } }
  ],
  D_GI_2A: [
    { who: "onsen_keeper_gi", emotion: "開心", text: "這是海底溫泉，而且是鹹的喔！", taigi: { hanji: "這是海底的溫泉，閣是鹹的喔！", tailo: "Tse sī hái-té ê un-tsuânn, koh sī kiâm--ê--ooh!", huayu: "這是海底溫泉，而且是鹹的喔！" } },
    { who: "onsen_keeper_gi", emotion: "平靜", text: "這裡面對太平洋，看得到太陽從海上升起。", taigi: { hanji: "遮面對太平洋，看會著日頭對海出來。", tailo: "Tsia bīn-tuì Thài-pîng-iûnn, khuànn ē tio̍h ji̍t-thâu tuì hái tshut--lâi.", huayu: "這裡面對太平洋，看得到太陽從海上升起。" } },
    { who: "onsen_keeper_gi", emotion: "擔心", text: "霧讓我忘了溫泉的事，幫我想 2 題好嗎？", taigi: { hanji: "霧予我袂記得溫泉的代誌，共我想兩題，好無？", tailo: "Bū hōo guá bē-kì-tit un-tsuânn ê tāi-tsì, kā guá siūnn nn̄g tê, hó--bô?", huayu: "霧讓我忘了溫泉的事，幫我想 2 題好嗎？" } }
  ],
  D_GI_2B: [
    { who: "onsen_keeper_gi", emotion: "開心", text: "你都答對了，聽得真認真！", taigi: { hanji: "你攏回答著矣，聽甲真認真！", tailo: "Lí lóng huê-tap tio̍h--ah, thiann kah tsin jīn-tsin!", huayu: "你都答對了，聽得真認真！" } },
    { who: "onsen_keeper_gi", emotion: "開心", text: "這些金幣送你，謝謝你！", taigi: { hanji: "這寡金幣送你，多謝你！", tailo: "Tsit-kuá kim-pè sàng lí, to-siā--lí!", huayu: "這些金幣送你，謝謝你！" } }
  ],
  D_GI_BATH: [
    { who: "onsen_keeper_gi", emotion: "平靜", text: "一次不要泡太久，地上很滑，要慢慢走。", taigi: { hanji: "一擺毋通浸傷久，塗跤真滑，愛慢慢仔行。", tailo: "Tsi̍t pái m̄-thang tsìm siunn kú, thôo-kha tsin ku̍t, ài bān-bān-á kiânn.", huayu: "一次不要泡太久，地上很滑，要慢慢走。" } },
    { who: "pet", emotion: "平靜", text: "泡溫泉不算住宿喔！記得要有大人陪。" }
  ],
  D_GI_3A: [
    { who: "oldhouse_gi", emotion: "開心", text: "這是用海底的珊瑚石蓋的房子。", taigi: { hanji: "這是用海底的珊瑚石起的厝。", tailo: "Tse sī īng hái-té ê suan-ôo-tsio̍h khí ê tshù.", huayu: "這是用海底的珊瑚石蓋的房子。" } },
    { who: "oldhouse_gi", emotion: "平靜", text: "牆很厚、窗戶小小的，是為了擋東北風。", taigi: { hanji: "壁真厚、窗仔細細，是為著擋東北風。", tailo: "Piah tsin kāu, thang-á sè-sè, sī uī-tio̍h tòng tang-pak-hong.", huayu: "牆很厚、窗戶小小的，是為了擋東北風。" } },
    { who: "oldhouse_gi", emotion: "擔心", text: "霧讓我忘了古厝的故事，幫我想 2 題好嗎？", taigi: { hanji: "霧予我袂記得古厝的故事，共我想兩題，好無？", tailo: "Bū hōo guá bē-kì-tit kóo-tshù ê kòo-sū, kā guá siūnn nn̄g tê, hó--bô?", huayu: "霧讓我忘了古厝的故事，幫我想 2 題好嗎？" } }
  ],
  D_GI_3B: [
    { who: "oldhouse_gi", emotion: "開心", text: "你都答對了，聽得真認真！", taigi: { hanji: "你攏回答著矣，聽甲真認真！", tailo: "Lí lóng huê-tap tio̍h--ah, thiann kah tsin jīn-tsin!", huayu: "你都答對了，聽得真認真！" } },
    { who: "oldhouse_gi", emotion: "開心", text: "這些金幣送你，謝謝你！", taigi: { hanji: "這寡金幣送你，多謝你！", tailo: "Tsit-kuá kim-pè sàng lí, to-siā--lí!", huayu: "這些金幣送你，謝謝你！" } }
  ],
  D_ICE_GI_IDLE: [
    { who: "ice_shop_gi", emotion: "開心", text: "吃一碗冰，涼一下吧！", taigi: { hanji: "食一碗冰，涼一下！", tailo: "Tsia̍h tsi̍t uánn ping, liâng--tsi̍t-ē!", huayu: "吃一碗冰，涼一下吧！" } },
    { who: "pet", emotion: "開心", text: "這是綠島的海草冰！" }
  ],
  D_INN_GREENISLAND: [
    { who: "inn_greenisland", emotion: "開心", text: "歡迎來綠島的民宿！好好休息喔。", taigi: { hanji: "歡迎來綠島的民宿！好好仔歇睏喔。", tailo: "Huan-gîng lâi Li̍k-tó ê bîn-sok! Hó-hó-á hioh-khùn--ooh.", huayu: "歡迎來綠島的民宿！好好休息喔。" } }
  ],
  D_INN_GREENISLAND_NOCOIN: [
    { who: "inn_greenisland", emotion: "擔心", text: "金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。", taigi: { hanji: "金幣無夠喔，金包里溫泉旅館會使免錢蹛，嘛會使去拍怪物趁金幣。", tailo: "Kim-pè bô-kàu--ooh, Kim-pau-lí un-tsuânn lí-kuán ē-sái bián-tsînn tuà, mā ē-sái khì phah kuài-bu̍t thàn kim-pè.", huayu: "金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。" } }
  ],
  D_LY_1A: [
    { who: "tao_guide", emotion: "開心", text: "歡迎來蘭嶼。我是這裡的解說員，請跟著我走。" },
    { who: "tao_guide", emotion: "平靜", text: "這裡是達悟族世世代代生活的島。" },
    { who: "tao_guide", emotion: "平靜", text: "進村子要有禮貌，尊重這裡的文化。" },
    { who: "tao_guide", emotion: "平靜", text: "不隨便進別人的家。船是別人家的，我們只看不碰。" },
    { who: "tao_guide", emotion: "平靜", text: "幫我想 3 題，當一個有禮貌的客人。" }
  ],
  D_LY_1B: [
    { who: "tao_guide", emotion: "開心", text: "謝謝你，你是很有禮貌的客人。" }
  ],
  D_LY_2A: [
    { who: "tao_guide", emotion: "平靜", text: "沙灘上的船叫拼板舟，大船用二十幾塊木板拼起來。" },
    { who: "tao_guide", emotion: "平靜", text: "木板用木釘接起來，船身只用白、黑、紅三種顏色。" },
    { who: "tao_guide", emotion: "平靜", text: "大船可以坐 10 個人，一起出海捕魚。" },
    { who: "tao_guide", emotion: "平靜", text: "幫我想 2 題好嗎？" }
  ],
  D_LY_2B: [
    { who: "tao_guide", emotion: "開心", text: "答對了！你聽得很仔細。" }
  ],
  D_LY_3A: [
    { who: "tao_guide", emotion: "平靜", text: "黑潮是從南邊往北流的溫暖海流，會流過蘭嶼。" },
    { who: "tao_guide", emotion: "平靜", text: "每年 2 月起，飛魚跟著黑潮來到蘭嶼。" },
    { who: "tao_guide", emotion: "平靜", text: "飛魚季是達悟族一年裡最重要的盛事。" },
    { who: "tao_guide", emotion: "平靜", text: "飛魚乾是平常吃的食物，也用來送禮表示心意。" },
    { who: "tao_guide", emotion: "平靜", text: "幫我想 2 題好嗎？" }
  ],
  D_LY_3B: [
    { who: "tao_guide", emotion: "開心", text: "謝謝你認真聽。記得喔，這裡的海水是往北流的。" }
  ],
  D_TAO_IDLE: [
    { who: "tao_guide", emotion: "平靜", text: "這裡的海很清澈，有珊瑚。看就好喔。" }
  ],
  D_INN_LANYU: [
    { who: "inn_lanyu", emotion: "開心", text: "歡迎來蘭嶼的民宿！好好休息喔。" }
  ],
  D_INN_LANYU_NOCOIN: [
    { who: "inn_lanyu", emotion: "擔心", text: "金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。" }
  ],
  D_HL_1A: [
    { who: "station_hl", emotion: "開心", text: "歡迎來花蓮！花蓮是全國最大的縣。", taigi: { hanji: "歡迎來花蓮！花蓮是全國上大的縣。", tailo: "Huan-gîng lâi Hua-liân! Hua-liân sī tsuân-kok siōng tuā ê kuān.", huayu: "歡迎來花蓮！花蓮是全國最大的縣。" } },
    { who: "pet", emotion: "平靜", text: "花蓮的面積大約 4,628 平方公里！" },
    { who: "station_hl", emotion: "平靜", text: "可是適合人住的平地，一百份只有七份。", taigi: { hanji: "毋過適合人蹛的平地，一百份干焦七份。", tailo: "M̄-koh sik-ha̍p lâng tuà ê pênn-tē, tsi̍t-pah hūn kan-na tshit hūn.", huayu: "可是適合人住的平地，一百份只有七份。" } },
    { who: "station_hl", emotion: "平靜", text: "幫我算 2 題好嗎？", taigi: { hanji: "共我算兩題，好無？", tailo: "Kā guá sǹg nn̄g tê, hó--bô?", huayu: "幫我算 2 題好嗎？" } }
  ],
  D_HL_1B: [
    { who: "station_hl", emotion: "開心", text: "你都答對了，聽得真認真！", taigi: { hanji: "你攏回答著矣，聽甲真認真！", tailo: "Lí lóng huê-tap tio̍h--ah, thiann kah tsin jīn-tsin!", huayu: "你都答對了，聽得真認真！" } },
    { who: "station_hl", emotion: "開心", text: "這些金幣送你，謝謝你！", taigi: { hanji: "這寡金幣送你，多謝你！", tailo: "Tsit-kuá kim-pè sàng lí, to-siā--lí!", huayu: "這些金幣送你，謝謝你！" } }
  ],
  D_HL_2A: [
    { who: "taroko_ranger", emotion: "開心", text: "你看，那邊的山壁，幾乎是直直的。", taigi: { hanji: "你看，彼爿的山壁，差不多是直直的。", tailo: "Lí khuànn, hit-pîng ê suann-piah, tsha-put-to sī ti̍t-ti̍t--ê.", huayu: "你看，那邊的山壁，幾乎是直直的。" } },
    { who: "pet", emotion: "驚訝", text: "這是太魯閣的大理岩峽谷！" },
    { who: "taroko_ranger", emotion: "平靜", text: "溪水一直沖刷，山又一直升高，才變成這樣。", taigi: { hanji: "溪水一直沖，山閣一直懸起來，才變按呢。", tailo: "Khe-tsuí it-ti̍t tshiâng, suann koh it-ti̍t kuân--khí-lâi, tsiah piàn án-ne.", huayu: "溪水一直沖刷，山又一直升高，才變成這樣。" } },
    { who: "taroko_ranger", emotion: "擔心", text: "霧讓我忘了峽谷的故事，幫我想 2 題好嗎？", taigi: { hanji: "霧予我袂記得山谷的故事，共我想兩題，好無？", tailo: "Bū hōo guá bē-kì-tit suann-kok ê kòo-sū, kā guá siūnn nn̄g tê, hó--bô?", huayu: "霧讓我忘了峽谷的故事，幫我想 2 題好嗎？" } }
  ],
  D_HL_2B: [
    { who: "taroko_ranger", emotion: "開心", text: "你都答對了，聽得真認真！", taigi: { hanji: "你攏回答著矣，聽甲真認真！", tailo: "Lí lóng huê-tap tio̍h--ah, thiann kah tsin jīn-tsin!", huayu: "你都答對了，聽得真認真！" } },
    { who: "taroko_ranger", emotion: "開心", text: "這些金幣送你，謝謝你！", taigi: { hanji: "這寡金幣送你，多謝你！", tailo: "Tsit-kuá kim-pè sàng lí, to-siā--lí!", huayu: "這些金幣送你，謝謝你！" } }
  ],
  D_HL_3A: [
    { who: "fisher_hl", emotion: "擔心", text: "海上浮著一隻雲做的大鯨魚，把霧吹進山谷！", taigi: { hanji: "海頂浮一隻雲做的大海翁，共霧歕入去山谷！", tailo: "Hái-tíng phû tsi̍t tsiah hûn tsò ê tuā hái-ang, kā bū pûn ji̍p-khì suann-kok!", huayu: "海上浮著一隻雲做的大鯨魚，把霧吹進山谷！" } },
    { who: "fisher_hl", emotion: "擔心", text: "鯨魚不醒來，我們的船都不能出海。", taigi: { hanji: "海翁無清醒，阮的船攏袂當出海。", tailo: "Hái-ang bô tshing-tshínn, guán ê tsûn lóng bē-tàng tshut-hái.", huayu: "鯨魚不醒來，我們的船都不能出海。" } },
    { who: "pet", emotion: "驚訝", text: "是東霧將！走到海灘盡頭，讓它清醒！" }
  ],
  D_BOSS_WHALE_A: [
    { who: "wxb_whale", emotion: "神祕", text: "呼……噗……我要把霧吹滿整座山……" },
    { who: "pet", emotion: "驚訝", text: "雲鯨霧將！答對題目，把霧吹散！" }
  ],
  D_BOSS_WHALE_B: [
    { who: "wxb_whale", emotion: "平靜", text: "呼……身體變輕了……我要變成白雲，回到太平洋。" }
  ],
  D_HL_3B: [
    { who: "fisher_hl", emotion: "開心", text: "鯨魚變成白雲了！謝謝你，勇者！", taigi: { hanji: "海翁變做白雲矣！多謝你，勇者！", tailo: "Hái-ang piàn-tsò pe̍h-hûn--ah! To-siā lí, ióng-tsiá!", huayu: "鯨魚變成白雲了！謝謝你，勇者！" } },
    { who: "fisher_hl", emotion: "開心", text: "這些金幣送你，謝謝你！", taigi: { hanji: "這寡金幣送你，多謝你！", tailo: "Tsit-kuá kim-pè sàng lí, to-siā--lí!", huayu: "這些金幣送你，謝謝你！" } },
    { who: "pet", emotion: "開心", text: "拿到東之曙光碎片了！四片都到齊了！" }
  ],
  D_FISHER_HL_IDLE: [
    { who: "fisher_hl", emotion: "平靜", text: "海邊浪很大，不要太靠近。", taigi: { hanji: "海邊仔湧真大，毋通傷倚。", tailo: "Hái-pinn-á íng tsin tuā, m̄-thang siunn uá.", huayu: "海邊浪很大，不要太靠近。" } }
  ],
  D_HL_4A: [
    { who: "road_engineer", emotion: "平靜", text: "要進山，要先查公路和步道有沒有開放。", taigi: { hanji: "欲入山，愛先查公路佮步道有開無。", tailo: "Beh ji̍p suann, ài sing tshâ kong-lōo kah pōo-tō ū khui--bô.", huayu: "要進山，要先查公路和步道有沒有開放。" } },
    { who: "road_engineer", emotion: "平靜", text: "公路要照公告的時間走，幫我算 2 題好嗎？", taigi: { hanji: "公路愛照公告的時間行，共我算兩題，好無？", tailo: "Kong-lōo ài tsiàu kong-kò ê sî-kan kiânn, kā guá sǹg nn̄g tê, hó--bô?", huayu: "公路要照公告的時間走，幫我算 2 題好嗎？" } }
  ],
  D_HL_4B: [
    { who: "road_engineer", emotion: "開心", text: "你都答對了，聽得真認真！", taigi: { hanji: "你攏回答著矣，聽甲真認真！", tailo: "Lí lóng huê-tap tio̍h--ah, thiann kah tsin jīn-tsin!", huayu: "你都答對了，聽得真認真！" } },
    { who: "road_engineer", emotion: "開心", text: "這些金幣送你，謝謝你！", taigi: { hanji: "這寡金幣送你，多謝你！", tailo: "Tsit-kuá kim-pè sàng lí, to-siā--lí!", huayu: "這些金幣送你，謝謝你！" } }
  ],
  D_ENGINEER_IDLE: [
    { who: "road_engineer", emotion: "平靜", text: "要進山，要先查公路和步道有沒有開放。", taigi: { hanji: "欲入山，愛先查公路佮步道有開無。", tailo: "Beh ji̍p suann, ài sing tshâ kong-lōo kah pōo-tō ū khui--bô.", huayu: "要進山，要先查公路和步道有沒有開放。" } }
  ],
  D_HL_5A: [
    { who: "stone_carver", emotion: "開心", text: "花蓮的石頭很多，很多人在這裡雕石頭。", taigi: { hanji: "花蓮的石頭真濟，真濟人佇遮刻石頭。", tailo: "Hua-liân ê tsio̍h-thâu tsin tsē, tsin tsē lâng tī tsia khik tsio̍h-thâu.", huayu: "花蓮的石頭很多，很多人在這裡雕石頭。" } },
    { who: "pet", emotion: "平靜", text: "花蓮有全國第一座以石頭為主題的博物館！" },
    { who: "stone_carver", emotion: "擔心", text: "霧讓我忘了石頭的故事，幫我想 2 題好嗎？", taigi: { hanji: "霧予我袂記得石頭的故事，共我想兩題，好無？", tailo: "Bū hōo guá bē-kì-tit tsio̍h-thâu ê kòo-sū, kā guá siūnn nn̄g tê, hó--bô?", huayu: "霧讓我忘了石頭的故事，幫我想 2 題好嗎？" } }
  ],
  D_HL_5B: [
    { who: "stone_carver", emotion: "開心", text: "你都答對了，聽得真認真！", taigi: { hanji: "你攏回答著矣，聽甲真認真！", tailo: "Lí lóng huê-tap tio̍h--ah, thiann kah tsin jīn-tsin!", huayu: "你都答對了，聽得真認真！" } },
    { who: "stone_carver", emotion: "開心", text: "這些金幣送你，謝謝你！", taigi: { hanji: "這寡金幣送你，多謝你！", tailo: "Tsit-kuá kim-pè sàng lí, to-siā--lí!", huayu: "這些金幣送你，謝謝你！" } }
  ],
  D_MOCHI_IDLE: [
    { who: "mochi_shop", emotion: "開心", text: "麻糬軟軟的，吃一顆有精神！", taigi: { hanji: "麻糍軟軟，食一粒有元氣！", tailo: "Muâ-tsî nńg-nńg, tsia̍h tsi̍t lia̍p ū guân-khì!", huayu: "麻糬軟軟的，吃一顆有精神！" } }
  ],
  D_STATION_HL_IDLE: [
    { who: "station_hl", emotion: "平靜", text: "花蓮東邊是太平洋，西邊是中央山脈。", taigi: { hanji: "花蓮東爿是太平洋，西爿是中央山脈。", tailo: "Hua-liân tang-pîng sī Thài-pîng-iûnn, sai-pîng sī Tiong-iong-suann-me̍h.", huayu: "花蓮東邊是太平洋，西邊是中央山脈。" } }
  ],
  D_LINTIAN_VIEW: [
    { who: "pet", emotion: "平靜", text: "這種木頭宿舍在花蓮鳳林的林田山，是四大林場之一。" }
  ],
  D_INN_HUALIEN: [
    { who: "inn_hualien", emotion: "開心", text: "歡迎來海邊的旅店！好好休息喔。", taigi: { hanji: "歡迎來海邊的旅社！好好仔歇睏喔。", tailo: "Huan-gîng lâi hái-pinn ê lí-siā! Hó-hó-á hioh-khùn--ooh.", huayu: "歡迎來海邊的旅店！好好休息喔。" } }
  ],
  D_INN_HUALIEN_NOCOIN: [
    { who: "inn_hualien", emotion: "擔心", text: "金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。", taigi: { hanji: "金幣無夠喔，金包里溫泉旅館會使免錢蹛，嘛會使去拍怪物趁金幣。", tailo: "Kim-pè bô-kàu--ooh, Kim-pau-lí un-tsuânn lí-kuán ē-sái bián-tsînn tuà, mā ē-sái khì phah kuài-bu̍t thàn kim-pè.", huayu: "金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。" } }
  ],
  D_MACAQUE_AFTER: [
    { who: "narrator", emotion: "平靜", text: "野生的猴子不要餵，也不要靠近喔。" }
  ],
  D_FERRY_FUGANG_GI_BUY: [
    { who: "ticket_seller_fg", emotion: "開心", text: "要去綠島嗎？來回票在這裡買喔。", taigi: { hanji: "欲去綠島無？來回票佇遮買喔。", tailo: "Beh khì Li̍k-tó--bô? Lâi-huê-phiò tī tsia bé--ooh.", huayu: "要去綠島嗎？來回票在這裡買喔。" } }
  ],
  D_FERRY_FUGANG_GI_NO_MONEY: [
    { who: "ticket_seller_fg", emotion: "擔心", text: "金幣不夠喔，先去打怪賺金幣。", taigi: { hanji: "金幣無夠喔，先去拍怪物趁金幣。", tailo: "Kim-pè bô-kàu--ooh, sing khì phah kuài-bu̍t thàn kim-pè.", huayu: "金幣不夠喔，先去打怪賺金幣。" } }
  ],
  D_FERRY_FUGANG_GI_LOCKED: [
    { who: "ticket_seller_fg", emotion: "擔心", text: "海上起霧了，船暫時不開喔。", taigi: { hanji: "海頂咧罩霧，船暫時無開喔。", tailo: "Hái-tíng teh tà-bū, tsûn tsiām-sî bô khui--ooh.", huayu: "海上起霧了，船暫時不開喔。" } },
    { who: "pet", emotion: "平靜", text: "先在台東幫大家的忙吧！" }
  ],
  D_FERRY_FUGANG_GI_BOARD: [
    { who: "narrator", emotion: "開心", text: "船員看過船票，上船囉！" }
  ],
  D_FERRY_FUGANG_GI_ARRIVE: [
    { who: "narrator", emotion: "開心", text: "大約 50 分鐘，船靠岸了！下船要小心喔。" }
  ],
  D_FERRY_FUGANG_LY_BUY: [
    { who: "ticket_seller_fg", emotion: "開心", text: "要去蘭嶼嗎？來回票在這裡買喔。", taigi: { hanji: "欲去蘭嶼無？來回票佇遮買喔。", tailo: "Beh khì Lân-sū--bô? Lâi-huê-phiò tī tsia bé--ooh.", huayu: "要去蘭嶼嗎？來回票在這裡買喔。" } }
  ],
  D_FERRY_FUGANG_LY_NO_MONEY: [
    { who: "ticket_seller_fg", emotion: "擔心", text: "金幣不夠喔，先去打怪賺金幣。", taigi: { hanji: "金幣無夠喔，先去拍怪物趁金幣。", tailo: "Kim-pè bô-kàu--ooh, sing khì phah kuài-bu̍t thàn kim-pè.", huayu: "金幣不夠喔，先去打怪賺金幣。" } }
  ],
  D_FERRY_FUGANG_LY_LOCKED: [
    { who: "ticket_seller_fg", emotion: "擔心", text: "海上起霧了，船暫時不開喔。", taigi: { hanji: "海頂咧罩霧，船暫時無開喔。", tailo: "Hái-tíng teh tà-bū, tsûn tsiām-sî bô khui--ooh.", huayu: "海上起霧了，船暫時不開喔。" } },
    { who: "pet", emotion: "平靜", text: "先在台東幫大家的忙吧！" }
  ],
  D_FERRY_FUGANG_LY_BOARD: [
    { who: "narrator", emotion: "開心", text: "船員看過船票，上船囉！" }
  ],
  D_FERRY_FUGANG_LY_ARRIVE: [
    { who: "narrator", emotion: "開心", text: "坐了好久的船，靠岸了！下船要小心喔。" }
  ],
  D_SIGN_ZHONGHENG: [
    { who: "pet", emotion: "平靜", text: "往西是中橫公路，會穿過高高的中央山脈。" },
    { who: "pet", emotion: "平靜", text: "這條路要等之後開放才能走喔！" }
  ],
  D_FERRY_PICK_NONE: [
    { who: "pet", emotion: "平靜", text: "還沒有船票喔！先去找售票員買來回票吧。" }
  ],
  D_LIGHTHOUSE_GI_IDLE: [
    { who: "lighthouse_guide_gi", emotion: "平靜", text: "燈塔晚上會亮，讓船知道方向。", taigi: { hanji: "燈塔暗時會光，予船知影方向。", tailo: "Ting-thah àm-sî ē kng, hōo tsûn tsai-iánn hong-hiòng.", huayu: "燈塔晚上會亮，讓船知道方向。" } }
  ],
  D_ONSEN_GI_IDLE: [
    { who: "onsen_keeper_gi", emotion: "開心", text: "一大早來，可以一邊泡溫泉，一邊看日出。", taigi: { hanji: "透早來，會當那浸溫泉，那看日頭出來。", tailo: "Thàu-tsá lâi, ē-tàng ná tsìm un-tsuânn, ná khuànn ji̍t-thâu tshut--lâi.", huayu: "一大早來，可以一邊泡溫泉，一邊看日出。" } }
  ],
  D_OLDHOUSE_GI_IDLE: [
    { who: "oldhouse_gi", emotion: "平靜", text: "以前用珊瑚石蓋房子，現在不可以挖珊瑚了。", taigi: { hanji: "較早用珊瑚石起厝，這馬毋通掘珊瑚矣。", tailo: "Khah-tsá īng suan-ôo-tsio̍h khí tshù, tsit-má m̄-thang ku̍t suan-ôo--ah.", huayu: "以前用珊瑚石蓋房子，現在不可以挖珊瑚了。" } }
  ],
  D_TAROKO_IDLE: [
    { who: "taroko_ranger", emotion: "平靜", text: "花不要亂摘，垃圾要帶回去喔。", taigi: { hanji: "毋通烏白挽花，糞埽愛提轉去喔。", tailo: "M̄-thang oo-pe̍h bán hue, pùn-sò ài the̍h tńg-khì--ooh.", huayu: "花不要亂摘，垃圾要帶回去喔。" } }
  ],
  D_STONE_IDLE: [
    { who: "stone_carver", emotion: "平靜", text: "石頭雕好了，還要磨很久，才會亮晶晶。", taigi: { hanji: "石頭刻好，閣愛磨足久，才會金鑠鑠。", tailo: "Tsio̍h-thâu khik hó, koh ài buâ tsiok kú, tsiah ē kim-siak-siak.", huayu: "石頭雕好了，還要磨很久，才會亮晶晶。" } }
  ],
  D_EXIT_LOCK_PT: [
    { who: "pet", emotion: "擔心", text: "外海的霧帆號還沒清醒，先別往台東走。" },
    { who: "pet", emotion: "平靜", text: "先回最南邊的燈塔，讓霧帆號清醒吧！" }
  ],
  // ═════════════ v4.0 東部（M26–M29） END ═════════════
  // ═══ v4.2 第 4a 批 DIALOGS BEGIN（tools/v42_apply.js 每次整段重建）═══
  D_TK_1A: [
    {
      "who": "paiyun_volunteer",
      "emotion": "開心",
      "text": "歡迎！要上山的人，要先來這裡報到喔。",
      "taigi": {
        "hanji": "歡迎！欲上山的人，愛先來遮報到喔。",
        "tailo": "Huan-gîng! Beh tsiūnn-suann ê lâng, ài sing lâi tsia pò-tò--ooh.",
        "huayu": "歡迎！要上山的人，要先來這裡報到喔。"
      }
    },
    {
      "who": "pet",
      "emotion": "開心",
      "text": "這裡是塔塔加，排雲登山服務中心！"
    },
    {
      "who": "paiyun_volunteer",
      "emotion": "平靜",
      "text": "上山要先申請，出發那天再來報到。",
      "taigi": {
        "hanji": "上山愛先申請，出發彼日才閣來報到。",
        "tailo": "Tsiūnn-suann ài sing sin-tshíng, tshut-huat hit ji̍t tsiah-koh lâi pò-tò.",
        "huayu": "上山要先申請，出發那天再來報到。"
      }
    },
    {
      "who": "paiyun_volunteer",
      "emotion": "平靜",
      "text": "出發前要先看天氣，安全最重要。",
      "taigi": {
        "hanji": "出發進前愛先看天氣，安全上重要。",
        "tailo": "Tshut-huat tsìn-tsîng ài sing khuànn thinn-khì, an-tsuân siōng tiōng-iàu.",
        "huayu": "出發前要先看天氣，安全最重要。"
      }
    },
    {
      "who": "pet",
      "emotion": "平靜",
      "text": "山上越高越冷，要多帶一件外套！"
    },
    {
      "who": "paiyun_volunteer",
      "emotion": "擔心",
      "text": "霧讓我忘了天氣的知識，幫我想 3 題好嗎？",
      "taigi": {
        "hanji": "霧予我袂記得天氣的智識，共我想三題，好無？",
        "tailo": "Bū hōo guá bē-kì-tit thinn-khì ê tì-sik, kā guá siūnn sann tê, hó--bô?",
        "huayu": "霧讓我忘了天氣的知識，幫我想 3 題好嗎？"
      }
    }
  ],
  D_TK_1B: [
    {
      "who": "paiyun_volunteer",
      "emotion": "開心",
      "text": "你都答對了，聽得真認真！",
      "taigi": {
        "hanji": "你攏回答著矣，聽甲真認真！",
        "tailo": "Lí lóng huê-tap tio̍h--ah, thiann kah tsin jīn-tsin!",
        "huayu": "你都答對了，聽得真認真！"
      }
    },
    {
      "who": "paiyun_volunteer",
      "emotion": "開心",
      "text": "一路平安，要小心喔！",
      "taigi": {
        "hanji": "一路平安，愛細膩喔！",
        "tailo": "Tsi̍t-lōo pîng-an, ài sè-jī--ooh!",
        "huayu": "一路平安，要小心喔！"
      }
    },
    {
      "who": "pet",
      "emotion": "開心",
      "text": "報到好了，可以上山了！東邊就是登山口！"
    }
  ],
  D_PAIYUN_IDLE: [
    {
      "who": "paiyun_volunteer",
      "text": "上山要找伴一起去，不要自己一個去喔。",
      "taigi": {
        "hanji": "上山愛揣伴做伙去，毋通家己一个去喔。",
        "tailo": "Tsiūnn-suann ài tshuē phuānn tsò-hué khì, m̄-thang ka-kī tsi̍t ê khì--ooh.",
        "huayu": "上山要找伴一起去，不要自己一個去喔。"
      }
    }
  ],
  D_EXIT_LOCK_TK: [
    {
      "who": "pet",
      "emotion": "平靜",
      "text": "要爬玉山主峰，要先申請、當天先來報到喔。"
    },
    {
      "who": "pet",
      "emotion": "平靜",
      "text": "先去服務中心找志工吧！"
    }
  ],
  D_TK_2_LOCK: [
    {
      "who": "ysnp_ranger",
      "emotion": "平靜",
      "text": "先去報到，再來找我。",
      "taigi": {
        "hanji": "先去報到，才閣來揣我。",
        "tailo": "Sing khì pò-tò, tsiah-koh lâi tshuē guá.",
        "huayu": "先去報到，再來找我。"
      }
    },
    {
      "who": "pet",
      "emotion": "平靜",
      "text": "服務中心的志工，好像需要幫忙！"
    }
  ],
  D_TK_2A: [
    {
      "who": "ysnp_ranger",
      "emotion": "開心",
      "text": "這裡是玉山國家公園。",
      "taigi": {
        "hanji": "遮是玉山國家公園。",
        "tailo": "Tsia sī Gio̍k-san kok-ka kong-hn̂g.",
        "huayu": "這裡是玉山國家公園。"
      }
    },
    {
      "who": "pet",
      "emotion": "開心",
      "text": "它是臺灣第二座成立的國家公園喔！"
    },
    {
      "who": "ysnp_ranger",
      "emotion": "平靜",
      "text": "從這裡往東看是玉山，往西看是阿里山。",
      "taigi": {
        "hanji": "對遮向東爿看是玉山，向西爿看是阿里山。",
        "tailo": "Tuì tsia ǹg tang-pîng khuànn sī Gio̍k-san, ǹg sai-pîng khuànn sī A-lí-san.",
        "huayu": "從這裡往東看是玉山，往西看是阿里山。"
      }
    },
    {
      "who": "ysnp_ranger",
      "emotion": "擔心",
      "text": "霧讓我忘了這裡的故事，幫我想 2 題好嗎？",
      "taigi": {
        "hanji": "霧予我袂記得遮的故事，共我想兩題，好無？",
        "tailo": "Bū hōo guá bē-kì-tit tsia ê kòo-sū, kā guá siūnn nn̄g tê, hó--bô?",
        "huayu": "霧讓我忘了這裡的故事，幫我想 2 題好嗎？"
      }
    }
  ],
  D_TK_2B: [
    {
      "who": "ysnp_ranger",
      "emotion": "開心",
      "text": "你都答對了，聽得真認真！",
      "taigi": {
        "hanji": "你攏回答著矣，聽甲真認真！",
        "tailo": "Lí lóng huê-tap tio̍h--ah, thiann kah tsin jīn-tsin!",
        "huayu": "你都答對了，聽得真認真！"
      }
    },
    {
      "who": "ysnp_ranger",
      "emotion": "開心",
      "text": "這些金幣送你，謝謝你！",
      "taigi": {
        "hanji": "這寡金幣送你，多謝你！",
        "tailo": "Tsit-kuá kim-pè sàng lí, to-siā--lí!",
        "huayu": "這些金幣送你，謝謝你！"
      }
    }
  ],
  D_YSNP_IDLE: [
    {
      "who": "ysnp_ranger",
      "text": "這裡很高，要多穿一件衣服喔。",
      "taigi": {
        "hanji": "遮真懸，愛加穿一領衫喔。",
        "tailo": "Tsia tsin kuân, ài ke tshīng tsi̍t niá sann--ooh.",
        "huayu": "這裡很高，要多穿一件衣服喔。"
      }
    }
  ],
  D_TK_3_LOCK: [
    {
      "who": "bird_guide",
      "emotion": "平靜",
      "text": "先去報到，再來找我。",
      "taigi": {
        "hanji": "先去報到，才閣來揣我。",
        "tailo": "Sing khì pò-tò, tsiah-koh lâi tshuē guá.",
        "huayu": "先去報到，再來找我。"
      }
    },
    {
      "who": "pet",
      "emotion": "平靜",
      "text": "服務中心的志工，好像需要幫忙！"
    }
  ],
  D_TK_3A: [
    {
      "who": "bird_guide",
      "emotion": "開心",
      "text": "你看樹林裡，那是一種很珍貴的鳥。",
      "taigi": {
        "hanji": "你看樹林內，彼是一種真珍貴的鳥仔。",
        "tailo": "Lí khuànn tshiū-nâ lāi, he sī tsi̍t tsióng tsin tin-kuì ê tsiáu-á.",
        "huayu": "你看樹林裡，那是一種很珍貴的鳥。"
      }
    },
    {
      "who": "pet",
      "emotion": "驚訝",
      "text": "是帝雉！國家第二級保育類野生動物！"
    },
    {
      "who": "bird_guide",
      "emotion": "平靜",
      "text": "要很有耐心，安靜地看就好喔。",
      "taigi": {
        "hanji": "愛真有耐心，恬恬看就好喔。",
        "tailo": "Ài tsin ū nāi-sim, tiām-tiām khuànn tō hó--ooh.",
        "huayu": "要很有耐心，安靜地看就好喔。"
      }
    },
    {
      "who": "bird_guide",
      "emotion": "平靜",
      "text": "不要靠近，也不要吵牠。",
      "taigi": {
        "hanji": "毋通倚近，嘛毋通吵伊。",
        "tailo": "M̄-thang uá-kīn, mā m̄-thang tshá i.",
        "huayu": "不要靠近，也不要吵牠。"
      }
    },
    {
      "who": "bird_guide",
      "emotion": "擔心",
      "text": "霧讓我忘了怎麼介紹，幫我想 2 題好嗎？",
      "taigi": {
        "hanji": "霧予我袂記得按怎紹介，共我想兩題，好無？",
        "tailo": "Bū hōo guá bē-kì-tit án-tsuánn siāu-kài, kā guá siūnn nn̄g tê, hó--bô?",
        "huayu": "霧讓我忘了怎麼介紹，幫我想 2 題好嗎？"
      }
    }
  ],
  D_TK_3B: [
    {
      "who": "bird_guide",
      "emotion": "開心",
      "text": "你都答對了，聽得真認真！",
      "taigi": {
        "hanji": "你攏回答著矣，聽甲真認真！",
        "tailo": "Lí lóng huê-tap tio̍h--ah, thiann kah tsin jīn-tsin!",
        "huayu": "你都答對了，聽得真認真！"
      }
    },
    {
      "who": "bird_guide",
      "emotion": "開心",
      "text": "這些金幣送你，謝謝你！",
      "taigi": {
        "hanji": "這寡金幣送你，多謝你！",
        "tailo": "Tsit-kuá kim-pè sàng lí, to-siā--lí!",
        "huayu": "這些金幣送你，謝謝你！"
      }
    }
  ],
  D_BIRDGUIDE_IDLE: [
    {
      "who": "bird_guide",
      "text": "清早和傍晚，比較有機會看到這種鳥。",
      "taigi": {
        "hanji": "透早佮暗頭仔，較有機會看著這款鳥仔。",
        "tailo": "Thàu-tsá kah àm-thâu-á, khah ū ki-huē khuànn-tio̍h tsit khuán tsiáu-á.",
        "huayu": "清早和傍晚，比較有機會看到這種鳥。"
      }
    }
  ],
  D_INN_TATAKA: [
    {
      "who": "inn_tataka",
      "emotion": "開心",
      "text": "歡迎來我們這裡休息！山上晚上很冷喔。",
      "taigi": {
        "hanji": "歡迎來阮遮歇睏！山頂暗時真寒喔。",
        "tailo": "Huan-gîng lâi guán tsia hioh-khùn! Suann-tíng àm-sî tsin kuânn--ooh.",
        "huayu": "歡迎來我們這裡休息！山上晚上很冷喔。"
      }
    }
  ],
  D_INN_TATAKA_NOCOIN: [
    {
      "who": "inn_tataka",
      "emotion": "擔心",
      "text": "金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。",
      "taigi": {
        "hanji": "金幣無夠喔，金包里溫泉旅館會使免錢蹛，嘛會使去拍怪物趁金幣。",
        "tailo": "Kim-pè bô-kàu--ooh, Kim-pau-lí un-tsuânn lí-kuán ē-sái bián-tsînn tuà, mā ē-sái khì phah kuài-bu̍t thàn kim-pè.",
        "huayu": "金幣不夠喔，金包里溫泉旅館能免費住，也可以去打怪賺金幣。"
      }
    }
  ],
  D_YS_1A: [
    {
      "who": "trail_ranger",
      "emotion": "開心",
      "text": "歡迎！從入口走到這裡，快要兩公里了。",
      "taigi": {
        "hanji": "歡迎！對入口行到遮，強欲兩公里矣。",
        "tailo": "Huan-gîng! Tuì ji̍p-kháu kiânn kàu tsia, kiōng-beh nn̄g kong-lí--ah.",
        "huayu": "歡迎！從入口走到這裡，快要兩公里了。"
      }
    },
    {
      "who": "pet",
      "emotion": "開心",
      "text": "這裡是孟祿亭！"
    },
    {
      "who": "trail_ranger",
      "emotion": "平靜",
      "text": "你看，西邊的樹像一把大傘，東邊的樹尖尖的。",
      "taigi": {
        "hanji": "你看，西爿的樹仔親像一枝大雨傘，東爿的樹仔尖尖。",
        "tailo": "Lí khuànn, sai-pîng ê tshiū-á tshin-tshiūnn tsi̍t ki tuā hōo-suànn, tang-pîng ê tshiū-á tsiam-tsiam.",
        "huayu": "你看，西邊的樹像一把大傘，東邊的樹尖尖的。"
      }
    },
    {
      "who": "trail_ranger",
      "emotion": "平靜",
      "text": "兩種森林，在這裡相連。",
      "taigi": {
        "hanji": "兩種樹林，佇遮相連。",
        "tailo": "Nn̄g tsióng tshiū-nâ, tī tsia sio-liân.",
        "huayu": "兩種森林，在這裡相連。"
      }
    },
    {
      "who": "pet",
      "emotion": "開心",
      "text": "這裡是溫帶林和寒帶林的交界！"
    },
    {
      "who": "trail_ranger",
      "emotion": "擔心",
      "text": "霧讓我忘了樹的知識，幫我想 2 題好嗎？",
      "taigi": {
        "hanji": "霧予我袂記得樹仔的智識，共我想兩題，好無？",
        "tailo": "Bū hōo guá bē-kì-tit tshiū-á ê tì-sik, kā guá siūnn nn̄g tê, hó--bô?",
        "huayu": "霧讓我忘了樹的知識，幫我想 2 題好嗎？"
      }
    }
  ],
  D_YS_1B: [
    {
      "who": "trail_ranger",
      "emotion": "開心",
      "text": "你都答對了，聽得真認真！",
      "taigi": {
        "hanji": "你攏回答著矣，聽甲真認真！",
        "tailo": "Lí lóng huê-tap tio̍h--ah, thiann kah tsin jīn-tsin!",
        "huayu": "你都答對了，聽得真認真！"
      }
    },
    {
      "who": "trail_ranger",
      "emotion": "擔心",
      "text": "前面的步道好像有動靜，走路要小心。",
      "taigi": {
        "hanji": "頭前的步道敢若有動靜，行路愛細膩。",
        "tailo": "Thâu-tsîng ê pōo-tō kánn-ná ū tōng-tsīng, kiânn-lōo ài sè-jī.",
        "huayu": "前面的步道好像有動靜，走路要小心。"
      }
    },
    {
      "who": "trail_ranger",
      "emotion": "開心",
      "text": "這些金幣送你，謝謝你！",
      "taigi": {
        "hanji": "這寡金幣送你，多謝你！",
        "tailo": "Tsit-kuá kim-pè sàng lí, to-siā--lí!",
        "huayu": "這些金幣送你，謝謝你！"
      }
    }
  ],
  D_TRAILRANGER_IDLE: [
    {
      "who": "trail_ranger",
      "text": "垃圾和剩下的食物，都要帶下山喔。",
      "taigi": {
        "hanji": "糞埽佮賰的食物，攏愛提落山喔。",
        "tailo": "Pùn-sò kah tshun ê si̍t-bu̍t, lóng ài the̍h lo̍h-suann--ooh.",
        "huayu": "垃圾和剩下的食物，都要帶下山喔。"
      }
    }
  ],
  D_YS_2A: [
    {
      "who": "narrator",
      "emotion": "平靜",
      "text": "前面的林邊，有一隻黑熊坐著吃果子。"
    },
    {
      "who": "fog_kid",
      "emotion": "驚訝",
      "text": "是臺灣黑熊！胸前有黃白色的 V 字……"
    },
    {
      "who": "fog_kid",
      "emotion": "擔心",
      "text": "我們不要靠近。先想一想，遇到熊要怎麼辦？"
    }
  ],
  D_BEAR_LEAVE: [
    {
      "who": "narrator",
      "emotion": "平靜",
      "text": "大家安靜地往後退。"
    },
    {
      "who": "narrator",
      "emotion": "開心",
      "text": "黑熊吃完果子，慢慢走回森林了。"
    },
    {
      "who": "fog_kid",
      "emotion": "開心",
      "text": "牠回家了！我們也要記得告訴巡山員。"
    },
    {
      "who": "pet",
      "emotion": "開心",
      "text": "看到熊要冷靜、安靜離開，再告訴巡山員！"
    }
  ],
  D_YS_3_LOCK: [
    {
      "who": "trail_ranger",
      "emotion": "擔心",
      "text": "前面的步道好像有動靜，先去看看。",
      "taigi": {
        "hanji": "頭前的步道敢若有動靜，先去看覓。",
        "tailo": "Thâu-tsîng ê pōo-tō kánn-ná ū tōng-tsīng, sing khì khuànn-māi.",
        "huayu": "前面的步道好像有動靜，先去看看。"
      }
    }
  ],
  D_YS_3A: [
    {
      "who": "trail_ranger",
      "emotion": "開心",
      "text": "謝謝你們通報我，我會寫下來。",
      "taigi": {
        "hanji": "多謝恁共我通報，我會寫落來。",
        "tailo": "To-siā lín kā guá thong-pò, guá ē siá--lo̍h-lâi.",
        "huayu": "謝謝你們通報我，我會寫下來。"
      }
    },
    {
      "who": "trail_ranger",
      "emotion": "擔心",
      "text": "可是前面的步道，被一大團霧擋住了。",
      "taigi": {
        "hanji": "毋過頭前的步道，予一大丸霧擋牢矣。",
        "tailo": "M̄-koh thâu-tsîng ê pōo-tō, hōo tsi̍t tuā uân bū tòng-tiâu--ah.",
        "huayu": "可是前面的步道，被一大團霧擋住了。"
      }
    },
    {
      "who": "pet",
      "emotion": "驚訝",
      "text": "是白木林那邊！"
    },
    {
      "who": "trail_ranger",
      "emotion": "平靜",
      "text": "讓那團霧清醒，才走得過去。",
      "taigi": {
        "hanji": "予彼丸霧清醒，才行會過。",
        "tailo": "Hōo hit uân bū tshing-tshínn, tsiah kiânn ē kuè.",
        "huayu": "讓那團霧清醒，才走得過去。"
      }
    },
    {
      "who": "pet",
      "emotion": "平靜",
      "text": "頭目戰不能逃跑，準備好再過去喔！"
    }
  ],
  D_BOSS_MIST_A: [
    {
      "who": "fob_mist",
      "emotion": "神祕",
      "text": "呼……前面好危險……不要過來……"
    },
    {
      "who": "pet",
      "emotion": "驚訝",
      "text": "山嵐霧精把步道擋住了！答對題目叫醒牠！"
    }
  ],
  D_BOSS_MIST_B: [
    {
      "who": "fob_mist",
      "emotion": "平靜",
      "text": "呼……我只是……不想讓你們迷路……"
    },
    {
      "who": "fog_kid",
      "emotion": "平靜",
      "text": "牠是被霧王叫來擋路的……其實牠只是擔心我們。"
    }
  ],
  D_YS_3B: [
    {
      "who": "trail_ranger",
      "emotion": "開心",
      "text": "霧散了！你看那片樹幹白白的樹林。",
      "taigi": {
        "hanji": "霧散矣！你看彼片樹身白白的樹林。",
        "tailo": "Bū suànn--ah! Lí khuànn hit phiàn tshiū-sin pe̍h-pe̍h ê tshiū-nâ.",
        "huayu": "霧散了！你看那片樹幹白白的樹林。"
      }
    },
    {
      "who": "pet",
      "emotion": "開心",
      "text": "那是白木林！枯掉的鐵杉和冷杉，樹幹變白了。"
    },
    {
      "who": "trail_ranger",
      "emotion": "平靜",
      "text": "再往前走，就到山莊了。",
      "taigi": {
        "hanji": "閣向頭前行，就到山莊矣。",
        "tailo": "Koh ǹg thâu-tsîng kiânn, tō kàu san-tsong--ah.",
        "huayu": "再往前走，就到山莊了。"
      }
    },
    {
      "who": "trail_ranger",
      "emotion": "開心",
      "text": "這些金幣送你，謝謝你！",
      "taigi": {
        "hanji": "這寡金幣送你，多謝你！",
        "tailo": "Tsit-kuá kim-pè sàng lí, to-siā--lí!",
        "huayu": "這些金幣送你，謝謝你！"
      }
    }
  ],
  D_EXIT_LOCK_YS: [
    {
      "who": "pet",
      "emotion": "擔心",
      "text": "白木林前的霧太濃了，看不到路。"
    },
    {
      "who": "pet",
      "emotion": "平靜",
      "text": "先回孟祿亭問問巡山員吧！"
    }
  ],
  D_MUNTJAC_AFTER: [
    {
      "who": "narrator",
      "emotion": "平靜",
      "text": "山羌是野生動物，不可以隨便捉喔。"
    }
  ],
  D_PY_1A: [
    {
      "who": "lodge_manager_py",
      "emotion": "開心",
      "text": "歡迎來山莊！晚上可以在這裡休息。",
      "taigi": {
        "hanji": "歡迎來山莊！暗時會使佇遮歇睏。",
        "tailo": "Huan-gîng lâi san-tsong! Àm-sî ē-sái tī tsia hioh-khùn.",
        "huayu": "歡迎來山莊！晚上可以在這裡休息。"
      }
    },
    {
      "who": "pet",
      "emotion": "開心",
      "text": "這裡是排雲山莊！"
    },
    {
      "who": "lodge_manager_py",
      "emotion": "平靜",
      "text": "山莊每天下午 6 點到 8 點才有電。",
      "taigi": {
        "hanji": "山莊逐工下晡六點到八點才有電。",
        "tailo": "San-tsong ta̍k-kang ē-poo la̍k tiám kàu peh tiám tsiah ū tiān.",
        "huayu": "山莊每天下午 6 點到 8 點才有電。"
      }
    },
    {
      "who": "lodge_manager_py",
      "emotion": "平靜",
      "text": "電要省著用。這裡也不能升火烤肉喔。",
      "taigi": {
        "hanji": "電愛儉咧用。遮嘛袂使起火烘肉喔。",
        "tailo": "Tiān ài khiām--leh īng. Tsia mā bē-sái khí-hué hang-bah--ooh.",
        "huayu": "電要省著用。這裡也不能升火烤肉喔。"
      }
    },
    {
      "who": "lodge_manager_py",
      "emotion": "擔心",
      "text": "霧讓我算不清楚時間，幫我算 2 題好嗎？",
      "taigi": {
        "hanji": "霧予我算袂清楚時間，共我算兩題，好無？",
        "tailo": "Bū hōo guá sǹg bē tshing-tshó sî-kan, kā guá sǹg nn̄g tê, hó--bô?",
        "huayu": "霧讓我算不清楚時間，幫我算 2 題好嗎？"
      }
    }
  ],
  D_PY_1B: [
    {
      "who": "lodge_manager_py",
      "emotion": "開心",
      "text": "算得剛剛好，謝謝你！",
      "taigi": {
        "hanji": "算甲拄仔好，多謝你！",
        "tailo": "Sǹg kah tú-á-hó, to-siā--lí!",
        "huayu": "算得剛剛好，謝謝你！"
      }
    },
    {
      "who": "lodge_manager_py",
      "emotion": "平靜",
      "text": "冬天水管會結冰，水也要省著用。",
      "taigi": {
        "hanji": "寒天水管會結冰，水嘛愛儉咧用。",
        "tailo": "Kuânn-thinn tsuí-kóng ē kiat-ping, tsuí mā ài khiām--leh īng.",
        "huayu": "冬天水管會結冰，水也要省著用。"
      }
    },
    {
      "who": "lodge_manager_py",
      "emotion": "開心",
      "text": "這些金幣送你，謝謝你！",
      "taigi": {
        "hanji": "這寡金幣送你，多謝你！",
        "tailo": "Tsit-kuá kim-pè sàng lí, to-siā--lí!",
        "huayu": "這些金幣送你，謝謝你！"
      }
    }
  ],
  D_LODGE_PY_IDLE: [
    {
      "who": "lodge_manager_py",
      "text": "這裡不能搭帳篷喔。",
      "taigi": {
        "hanji": "遮袂使搭布棚喔。",
        "tailo": "Tsia bē-sái tah pòo-pênn--ooh.",
        "huayu": "這裡不能搭帳篷喔。"
      }
    }
  ],
  D_INN_PAIYUN: [
    {
      "who": "lodge_manager_py",
      "emotion": "開心",
      "text": "在這裡休息不用錢，好好睡一晚。",
      "taigi": {
        "hanji": "佇遮歇睏免錢，好好仔睏一暝。",
        "tailo": "Tī tsia hioh-khùn bián-tsînn, hó-hó-á khùn tsi̍t mê.",
        "huayu": "在這裡休息不用錢，好好睡一晚。"
      }
    }
  ],
  D_PY_2A: [
    {
      "who": "fog_kid",
      "emotion": "平靜",
      "text": "你看，山莊前面有好大一片雲海……"
    },
    {
      "who": "fog_kid",
      "emotion": "平靜",
      "text": "霧是很多很小的小水滴。雲和霧是怎麼來的呢？"
    },
    {
      "who": "fog_kid",
      "emotion": "擔心",
      "text": "答對 2 題，我就把霧王的故事告訴你。"
    }
  ],
  D_FOG_ORIGIN: [
    {
      "who": "fog_kid",
      "emotion": "平靜",
      "text": "霧王以前，也是一朵雲喔。"
    },
    {
      "who": "fog_kid",
      "emotion": "平靜",
      "text": "大家弄丟、忘記的東西，會飄到天上。"
    },
    {
      "who": "fog_kid",
      "emotion": "擔心",
      "text": "忘掉的字、忘記說的謝謝，都聚在一起……"
    },
    {
      "who": "fog_kid",
      "emotion": "擔心",
      "text": "就變成了遺忘霧。霧王只是怕自己被忘記。"
    },
    {
      "who": "fog_kid",
      "emotion": "平靜",
      "text": "我也是從霧裡生出來的，所以我懂它的寂寞。"
    },
    {
      "who": "pet",
      "emotion": "擔心",
      "text": "可是忘掉學過的東西，大家會更難過啊！"
    },
    {
      "who": "hero",
      "emotion": "開心",
      "text": "我們去告訴霧王：被記得，就不會消失。"
    },
    {
      "who": "fog_kid",
      "emotion": "開心",
      "text": "嗯！我們往風口出發吧！"
    }
  ],
  D_EXIT_LOCK_PY: [
    {
      "who": "fog_kid",
      "emotion": "平靜",
      "text": "等一下……我有一件事想先告訴你。"
    },
    {
      "who": "pet",
      "emotion": "平靜",
      "text": "去山莊前的廣場，聽霧仔說吧！"
    }
  ],
  D_FK_1A: [
    {
      "who": "narrator",
      "emotion": "平靜",
      "text": "這裡是風口，一大片灰灰的碎石坡。"
    },
    {
      "who": "pet",
      "emotion": "擔心",
      "text": "風好大，碎石坡很滑，要慢慢走！"
    },
    {
      "who": "fog_kid",
      "emotion": "平靜",
      "text": "這裡比排雲山莊還高，也更冷了。"
    },
    {
      "who": "fog_kid",
      "emotion": "擔心",
      "text": "上面被霧王的霧牆擋住了……"
    },
    {
      "who": "fog_kid",
      "emotion": "平靜",
      "text": "拿出曙光羅盤，答對 2 題，照出霧裡的路吧！"
    }
  ],
  D_FK_1B: [
    {
      "who": "narrator",
      "emotion": "驚訝",
      "text": "曙光羅盤一照，霧牆中間出現一個洞口！"
    },
    {
      "who": "fog_kid",
      "emotion": "驚訝",
      "text": "是霧之洞窟！路一直往上，通到山頂。"
    },
    {
      "who": "pet",
      "emotion": "開心",
      "text": "洞窟裡有山屋小燈，可以休息和存檔喔！"
    }
  ],
  D_EXIT_LOCK_FK: [
    {
      "who": "pet",
      "emotion": "擔心",
      "text": "往山頂的路被一片白霧牆擋住了。"
    },
    {
      "who": "fog_kid",
      "emotion": "平靜",
      "text": "曙光羅盤也許照得出路。"
    }
  ],
  D_SIGN_FENGKOU: [
    {
      "who": "pet",
      "emotion": "平靜",
      "text": "起霧的時候，要看清楚路標，慢慢走。"
    }
  ],
  D_ECHO_DOOR: [
    {
      "who": "narrator",
      "emotion": "平靜",
      "text": "石門上有一張大大的嘴巴。"
    },
    {
      "who": "hero",
      "emotion": "驚訝",
      "text": "有人在嗎？"
    },
    {
      "who": "fo_echo",
      "emotion": "開心",
      "text": "有人在嗎？有人在嗎？……"
    },
    {
      "who": "fog_kid",
      "emotion": "平靜",
      "text": "是喂喂回音霧！答對 3 題國語，門就會開。"
    }
  ],
  D_CV_1B: [
    {
      "who": "narrator",
      "emotion": "開心",
      "text": "石門慢慢打開了！"
    },
    {
      "who": "fo_echo",
      "emotion": "平靜",
      "text": "謝謝……謝謝……"
    },
    {
      "who": "fog_kid",
      "emotion": "開心",
      "text": "往北邊的樓梯走，去第 2 層！"
    }
  ],
  D_CV_2A: [
    {
      "who": "fog_kid",
      "emotion": "擔心",
      "text": "這裡飄著好多大家弄丟的東西……"
    },
    {
      "who": "fog_kid",
      "emotion": "平靜",
      "text": "把東西送回對的書架，送回 6 件，北門就會開。"
    },
    {
      "who": "pet",
      "emotion": "開心",
      "text": "書架上的圖案，就是分類的提示！"
    }
  ],
  D_CV_2B: [
    {
      "who": "narrator",
      "emotion": "開心",
      "text": "北門打開了！霧也變淡了。"
    },
    {
      "who": "fog_kid",
      "emotion": "開心",
      "text": "東西都回家了，主人一定很高興。"
    }
  ],
  D_CV_3A: [
    {
      "who": "fog_kid",
      "emotion": "驚訝",
      "text": "五座燈座上，都站著一個霧影！"
    },
    {
      "who": "fog_kid",
      "emotion": "平靜",
      "text": "讓霧影清醒，五盞燈全亮，最後的門才會開。"
    },
    {
      "who": "pet",
      "emotion": "開心",
      "text": "先打哪一個都可以，加油！"
    }
  ],
  D_BOSS_SHADOW_A: [
    {
      "who": "pet",
      "emotion": "驚訝",
      "text": "是霧影！長得好像以前遇過的頭目！"
    }
  ],
  D_LAMP_TRIAL_KO: [
    {
      "who": "narrator",
      "emotion": "開心",
      "text": "霧影散開了，國語燈亮了起來！"
    }
  ],
  D_LAMP_TRIAL_EN: [
    {
      "who": "narrator",
      "emotion": "開心",
      "text": "霧影散開了，英語燈亮了起來！"
    }
  ],
  D_LAMP_TRIAL_MA: [
    {
      "who": "narrator",
      "emotion": "開心",
      "text": "霧影散開了，數學燈亮了起來！"
    }
  ],
  D_LAMP_TRIAL_NA: [
    {
      "who": "narrator",
      "emotion": "開心",
      "text": "霧影散開了，自然燈亮了起來！"
    }
  ],
  D_LAMP_TRIAL_SO: [
    {
      "who": "narrator",
      "emotion": "開心",
      "text": "霧影散開了，社會燈亮了起來！"
    }
  ],
  D_LAMP_TRIAL_ALL: [
    {
      "who": "narrator",
      "emotion": "驚訝",
      "text": "五盞燈全亮了！地上浮出一個五角星盤。"
    },
    {
      "who": "fog_kid",
      "emotion": "開心",
      "text": "讓五顆星石都亮起來，最後的門就會開！"
    }
  ],
  D_EXIT_LOCK_CV: [
    {
      "who": "pet",
      "emotion": "擔心",
      "text": "最後的門還打不開。"
    }
  ],
  D_SUMMIT_GATE: [
    {
      "who": "fog_kid",
      "emotion": "平靜",
      "text": "門後面，就是玉山的山頂了。"
    },
    {
      "who": "narrator",
      "emotion": "平靜",
      "text": "真正的玉山頂很高、很冷，冬天常常積雪。"
    },
    {
      "who": "narrator",
      "emotion": "平靜",
      "text": "起霧、下雨的時候，要看清楚指標，慢慢走。"
    },
    {
      "who": "narrator",
      "emotion": "平靜",
      "text": "要去爬真的玉山，一定要跟大人結伴一起去，還要事先申請。"
    },
    {
      "who": "fog_kid",
      "emotion": "開心",
      "text": "準備好了嗎？我們上去吧！"
    }
  ],
  D_EXIT_LOCK_CV_LAMP: [
    {
      "who": "pet",
      "emotion": "平靜",
      "text": "還有燈座沒亮，先讓霧影清醒吧！"
    }
  ],
  D_EXIT_LOCK_CV_STAR: [
    {
      "who": "pet",
      "emotion": "平靜",
      "text": "地上的五顆星石，還沒全亮喔！"
    }
  ],
  D_EXIT_LOCK_CV_PL: [
    {
      "who": "pet",
      "emotion": "平靜",
      "text": "門上寫著：戰力 60 才推得開。"
    },
    {
      "who": "pet",
      "emotion": "平靜",
      "text": "你現在的戰力是 {pl}，再練強一點吧！"
    },
    {
      "who": "pet",
      "emotion": "平靜",
      "text": "剛轉職的話，換回以前的職業也可以過喔。"
    },
    {
      "who": "fog_kid",
      "emotion": "平靜",
      "text": "還沒準備好，可以先找小燈休息、練功喔。"
    }
  ],
  D_EXIT_LOCK_XT: [
    {
      "who": "pet",
      "emotion": "擔心",
      "text": "往塔塔加的山路黑漆漆的，要有森林燈籠才走得過去。"
    },
    {
      "who": "pet",
      "emotion": "平靜",
      "text": "先去幫燈籠町的燈籠店老闆吧！"
    }
  ],
  D_EXIT_LOCK_LIB: [
    {
      "who": "pet",
      "emotion": "平靜",
      "text": "北門還關著，還有東西沒回到書架上。"
    },
    {
      "who": "fog_kid",
      "emotion": "平靜",
      "text": "把 6 件東西送回對的書架，北門就會開。"
    }
  ],
  D_FOG_KING_P3: [
    {
      "who": "fob_king",
      "emotion": "擔心",
      "text": "你們一路上……記住了什麼？"
    },
    {
      "who": "fog_kid",
      "emotion": "平靜",
      "text": "想不起來也沒關係，慢慢想喔。"
    },
    {
      "who": "narrator",
      "emotion": "平靜",
      "text": "這一段不計時。"
    }
  ],
  D_EAST_JOB_HINT: [
    {
      "who": "fog_kid",
      "emotion": "平靜",
      "text": "見習冒險者，到宮廟或府城公會轉職，會更快變強喔。"
    }
  ],
  // ═══ v4.2 第 4a 批 DIALOGS END ═══
  // ═══ v4.2 第 4b 批 DIALOGS BEGIN（tools/v42_apply.js 每次整段重建）═══
  D_SUMMIT_ARRIVE: [
    {
      "who": "fog_kid",
      "emotion": "開心",
      "text": "我們到山頂了！這裡就是臺灣最高的地方。"
    },
    {
      "who": "fog_kid",
      "emotion": "平靜",
      "text": "空氣比較稀薄，也比山下冷。"
    },
    {
      "who": "pet",
      "emotion": "驚訝",
      "text": "四周都被濃霧蓋住了……"
    },
    {
      "who": "fog_kid",
      "emotion": "擔心",
      "text": "霧王的霧，把整座山藏起來了。"
    }
  ],
  D_FOG_KING_MEET: [
    {
      "who": "narrator",
      "emotion": "神祕",
      "text": "山頂上空的霧裡，浮出一本好大的書。"
    },
    {
      "who": "fob_king",
      "emotion": "神祕",
      "text": "你們……為什麼不肯忘記？"
    },
    {
      "who": "fob_king",
      "emotion": "擔心",
      "text": "大家都忘了，就不會難過了……"
    },
    {
      "who": "fog_kid",
      "emotion": "擔心",
      "text": "霧王，我們是來找你說話的。"
    },
    {
      "who": "pet",
      "emotion": "開心",
      "text": "學過的東西都在心裡！我們一起答題吧！"
    }
  ],
  D_FOG_KING_P2: [
    {
      "who": "fob_king",
      "emotion": "神祕",
      "text": "看……四位霧將的影子……"
    },
    {
      "who": "pet",
      "emotion": "驚訝",
      "text": "是一路上遇過的霧將！一題一題來！"
    }
  ],
  D_FOG_KING_P4: [
    {
      "who": "narrator",
      "emotion": "平靜",
      "text": "霧開始變薄，東邊亮起一條金色的光。"
    },
    {
      "who": "fob_king",
      "emotion": "平靜",
      "text": "最後一題……"
    },
    {
      "who": "pet",
      "emotion": "開心",
      "text": "加油！最後一題了！"
    }
  ],
  D_FOG_KING_ASK: [
    {
      "who": "fob_king",
      "emotion": "擔心",
      "text": "你們……會記得我嗎？"
    }
  ],
  D_FOG_KING_CHOICE_A: [
    {
      "who": "hero",
      "emotion": "開心",
      "text": "會！我們會一直記得你！"
    }
  ],
  D_FOG_KING_CHOICE_B: [
    {
      "who": "hero",
      "emotion": "開心",
      "text": "我們會把你寫進故事裡！"
    }
  ],
  D_FOG_KING_END: [
    {
      "who": "fob_king",
      "emotion": "開心",
      "text": "被記得……原來是這種暖暖的感覺。"
    },
    {
      "who": "fob_king",
      "emotion": "平靜",
      "text": "謝謝你們。我想變回一朵雲了。"
    },
    {
      "who": "fog_kid",
      "emotion": "開心",
      "text": "霧王，你也被我們記住了喔！"
    }
  ],
  D_CH9_END: [
    {
      "who": "narrator",
      "emotion": "開心",
      "text": "終章完成！"
    },
    {
      "who": "narrator",
      "emotion": "開心",
      "text": "你讓遺忘霧王想起了被記得的感覺。"
    }
  ],
  D_END_E1: [
    {
      "who": "narrator",
      "emotion": "平靜",
      "text": "霧王的書頁，一頁一頁變成白雲。"
    },
    {
      "who": "narrator",
      "emotion": "平靜",
      "text": "白雲從山頂流下去，鋪成一大片雲海。"
    }
  ],
  D_END_E2: [
    {
      "who": "narrator",
      "emotion": "開心",
      "text": "第一道曙光，照亮了玉山的山頂！"
    },
    {
      "who": "narrator",
      "emotion": "開心",
      "text": "霧散了，四周的山一座座從雲海裡露出來。"
    },
    {
      "who": "pet",
      "emotion": "開心",
      "text": "好漂亮！我們做到了！"
    },
    {
      "who": "fog_kid",
      "emotion": "開心",
      "text": "謝謝你，{name}！"
    }
  ],
  D_END_E3: [
    {
      "who": "narrator",
      "emotion": "開心",
      "text": "金包里的五盞知識燈旁邊，第六盞燈亮了。"
    },
    {
      "who": "chief",
      "emotion": "開心",
      "text": "第六盞燈亮起來了！",
      "taigi": {
        "hanji": "第六葩燈光起來矣！",
        "tailo": "Tē-la̍k pha ting kng--khí-lâi--ah!",
        "huayu": "第六盞燈亮起來了！"
      }
    },
    {
      "who": "pet",
      "emotion": "開心",
      "text": "它叫做「曙光燈」！"
    },
    {
      "who": "chief",
      "emotion": "開心",
      "text": "謝謝你！金包里又亮起來了！",
      "taigi": {
        "hanji": "多謝你！金包里閣光起來矣！",
        "tailo": "To-siā--lí! Kim-pau-lí koh kng--khí-lâi--ah!",
        "huayu": "謝謝你！金包里又亮起來了！"
      }
    }
  ],
  D_END_E4: [
    {
      "who": "narrator",
      "emotion": "開心",
      "text": "一路上幫過的朋友，都來揮手了。"
    },
    {
      "who": "pet",
      "emotion": "開心",
      "text": "精靈、地精、獸人……大家都來了！"
    }
  ],
  D_END_E5: [
    {
      "who": "narrator",
      "emotion": "平靜",
      "text": "霧仔變成了一朵小小的雲。"
    },
    {
      "who": "fog_kid",
      "emotion": "開心",
      "text": "我變成雲了！我還要跟著你們喔。"
    }
  ],
  D_END_E6: [
    {
      "who": "narrator",
      "emotion": "開心",
      "text": "謝謝你一路的努力！"
    },
    {
      "who": "narrator",
      "emotion": "開心",
      "text": "你得到稱號「點亮曙光的人」！"
    },
    {
      "who": "pet",
      "emotion": "開心",
      "text": "還可以繼續冒險喔！山頂西邊出現了雲做的階梯。"
    }
  ],
  D_END_HOME_1: [
    {
      "who": "narrator",
      "emotion": "開心",
      "text": "遺忘霧散了，天空變得好藍。"
    },
    {
      "who": "pet",
      "emotion": "開心",
      "text": "我們回到金包里了！"
    },
    {
      "who": "fog_kid",
      "emotion": "平靜",
      "text": "公園那邊，好像有什麼在發光……"
    }
  ],
  D_END_HOME_2: [
    {
      "who": "pet",
      "emotion": "驚訝",
      "text": "哇！五盞燈都亮著，大家都在公園等我們耶！"
    }
  ],
  D_END_AWARD_1: [
    {
      "who": "chief",
      "emotion": "開心",
      "text": "{name}，你來得正好！",
      "taigi": {
        "hanji": "你來甲拄仔好！",
        "tailo": "Lí lâi kah tú-á-hó!",
        "huayu": "你來得正好！"
      }
    },
    {
      "who": "chief",
      "emotion": "開心",
      "text": "大家都在等你回來。",
      "taigi": {
        "hanji": "逐家攏咧等你轉來。",
        "tailo": "Ta̍k-ke lóng teh tán lí tńg--lâi.",
        "huayu": "大家都在等你回來。"
      }
    },
    {
      "who": "chief",
      "emotion": "平靜",
      "text": "一路上辛苦了！",
      "taigi": {
        "hanji": "一路辛苦囉！",
        "tailo": "Tsi̍t-lōo sin-khóo--looh!",
        "huayu": "一路上辛苦了！"
      }
    },
    {
      "who": "chief",
      "emotion": "開心",
      "text": "這是勇者之證，送給你！",
      "taigi": {
        "hanji": "這是勇者之證，送你！",
        "tailo": "Tse sī ióng-tsiá tsi tsìng, sàng lí!",
        "huayu": "這是勇者之證，送給你！"
      }
    }
  ],
  D_END_AWARD_2: [
    {
      "who": "chief",
      "emotion": "開心",
      "text": "還有這個，幫你戴上！",
      "taigi": {
        "hanji": "閣有這个，共你掛起來！",
        "tailo": "Koh ū tsit ê, kā lí kuà--khí-lâi!",
        "huayu": "還有這個，幫你戴上！"
      }
    }
  ],
  D_END_AWARD_3: [
    {
      "who": "pet",
      "emotion": "開心",
      "text": "好漂亮！上面還有你的名字耶！"
    },
    {
      "who": "chief",
      "emotion": "開心",
      "text": "大家都會記得你的努力。",
      "taigi": {
        "hanji": "逐家攏會記得你的拍拚。",
        "tailo": "Ta̍k-ke lóng ē-kì-tit lí ê phah-piànn.",
        "huayu": "大家都會記得你的努力。"
      }
    },
    {
      "who": "fog_kid",
      "emotion": "驚訝",
      "text": "你看！五盞燈旁邊，有一座燈座在發光！"
    }
  ],
  D_END_NIGHT: [
    {
      "who": "narrator",
      "emotion": "開心",
      "text": "金包里的漁港點起燈火，大家一起慶祝。"
    },
    {
      "who": "pet",
      "emotion": "開心",
      "text": "{name}，下次冒險還要一起去喔！"
    }
  ],
  D_END_CHIEF_IDLE: [
    {
      "who": "chief",
      "text": "有空要回來金包里喔！",
      "taigi": {
        "hanji": "有閒愛轉來金包里喔！",
        "tailo": "Ū-îng ài tńg-lâi Kim-pau-lí--ooh!",
        "huayu": "有空要回來金包里喔！"
      }
    }
  ],
  D_END_CERT_1: [
    {
      "who": "chief",
      "emotion": "開心",
      "text": "你換職業了！",
      "taigi": {
        "hanji": "你換職業矣！",
        "tailo": "Lí uānn tsit-gia̍p--ah!",
        "huayu": "你換職業了！"
      }
    },
    {
      "who": "chief",
      "emotion": "開心",
      "text": "這是勇者之證，送給你！",
      "taigi": {
        "hanji": "這是勇者之證，送你！",
        "tailo": "Tse sī ióng-tsiá tsi tsìng, sàng lí!",
        "huayu": "這是勇者之證，送給你！"
      }
    }
  ],
  D_END_CERT_2: [
    {
      "who": "chief",
      "emotion": "開心",
      "text": "大家都會記得你的努力。",
      "taigi": {
        "hanji": "逐家攏會記得你的拍拚。",
        "tailo": "Ta̍k-ke lóng ē-kì-tit lí ê phah-piànn.",
        "huayu": "大家都會記得你的努力。"
      }
    },
    {
      "who": "pet",
      "emotion": "開心",
      "text": "證書收進手帳的「證書冊」了！"
    }
  ],
  D_END_CERT_HINT: [
    {
      "who": "pet",
      "emotion": "平靜",
      "text": "換成別的職業，再來找里長伯，可以再領一張證書喔！"
    }
  ],
  D_END_HERO_CALL: [
    {
      "who": "chief",
      "emotion": "驚訝",
      "text": "大家快來看！",
      "taigi": {
        "hanji": "逐家緊來看！",
        "tailo": "Ta̍k-ke kín lâi khuànn!",
        "huayu": "大家快來看！"
      }
    }
  ],
  D_END_HERO_1: [
    {
      "who": "chief",
      "emotion": "開心",
      "text": "我們金包里出了一位勇者！",
      "taigi": {
        "hanji": "咱金包里出一个勇者矣！",
        "tailo": "Lán Kim-pau-lí tshut tsi̍t ê ióng-tsiá--ah!",
        "huayu": "我們金包里出了一位勇者！"
      }
    },
    {
      "who": "pet",
      "emotion": "驚訝",
      "text": "全鎮的人和一路上的朋友都來了！"
    },
    {
      "who": "fog_kid",
      "emotion": "開心",
      "text": "你看！燈都在發光！"
    }
  ],
  D_END_HERO_VO: [
    {
      "who": "chief",
      "emotion": "開心",
      "text": "這是最特別的勇者之證！",
      "taigi": {
        "hanji": "這是上特別的勇者之證！",
        "tailo": "Tse sī siōng ti̍k-pia̍t ê ióng-tsiá tsi tsìng!",
        "huayu": "這是最特別的勇者之證！"
      }
    }
  ],
  D_END_HERO_2: [
    {
      "who": "chief",
      "emotion": "開心",
      "text": "金包里永遠是你的家！",
      "taigi": {
        "hanji": "金包里永遠是你的厝！",
        "tailo": "Kim-pau-lí íng-uán sī lí ê tshù!",
        "huayu": "金包里永遠是你的家！"
      }
    },
    {
      "who": "chief",
      "emotion": "開心",
      "text": "大家都會記得你的努力。",
      "taigi": {
        "hanji": "逐家攏會記得你的拍拚。",
        "tailo": "Ta̍k-ke lóng ē-kì-tit lí ê phah-piànn.",
        "huayu": "大家都會記得你的努力。"
      }
    },
    {
      "who": "pet",
      "emotion": "開心",
      "text": "你得到稱號「傳說中的勇者」！證書收進證書冊了！"
    }
  ],
  D_LAMP_DAWN_DARK: [
    {
      "who": "pet",
      "emotion": "平靜",
      "text": "這座燈還暗暗的，好像在等天亮。"
    }
  ],
  D_MV_NARR_B1: [
    {
      "who": "narrator",
      "emotion": "平靜",
      "text": "旅程，從金山的海邊開始。"
    }
  ],
  D_MV_NARR_B3: [
    {
      "who": "narrator",
      "emotion": "平靜",
      "text": "來到有好多高樓的大城市。"
    }
  ],
  D_MV_NARR_B4: [
    {
      "who": "narrator",
      "emotion": "開心",
      "text": "水庫邊、河堤上，都有人揮手。"
    }
  ],
  D_MV_NARR_B5: [
    {
      "who": "narrator",
      "emotion": "開心",
      "text": "古城和大海，都醒過來了。"
    }
  ],
  D_MV_NARR_B7: [
    {
      "who": "narrator",
      "emotion": "開心",
      "text": "玉山上，天亮了。"
    }
  ],
  D_MV_NARR_B8: [
    {
      "who": "narrator",
      "emotion": "平靜",
      "text": "海風吹來了，回家吧。"
    }
  ],
  // ═══ v4.2 第 4b 批 DIALOGS END ═══
  // ═══ v4.2 第 4c 批 DIALOGS BEGIN（tools/v42_apply.js 每次整段重建）═══
  D_POST_1A: [
    {
      "who": "fog_kid",
      "emotion": "開心",
      "text": "這裡是晨光雲階！有些雲軟軟的，踩不上去。"
    },
    {
      "who": "fog_kid",
      "emotion": "平靜",
      "text": "答對 1 題，軟軟的雲就會變硬。"
    },
    {
      "who": "pet",
      "emotion": "開心",
      "text": "不用每朵都答，開出一條路就可以！"
    },
    {
      "who": "pet",
      "emotion": "平靜",
      "text": "累了就回入口的小燈休息喔。"
    }
  ],
  D_POST_1B: [
    {
      "who": "narrator",
      "emotion": "開心",
      "text": "雲階走完了！"
    },
    {
      "who": "fog_kid",
      "emotion": "開心",
      "text": "下一層是星光雲庭，地上有好多星星喔！"
    }
  ],
  D_POST_2A: [
    {
      "who": "narrator",
      "emotion": "平靜",
      "text": "夜空下的雲庭裡，散落著發亮的星星。"
    },
    {
      "who": "fog_kid",
      "emotion": "平靜",
      "text": "天上 5 個星座，都少了星星。"
    },
    {
      "who": "fog_kid",
      "emotion": "平靜",
      "text": "每顆星星，都是你一路上的記憶。"
    },
    {
      "who": "pet",
      "emotion": "開心",
      "text": "撿起地上的星星，答對題目，星星就會飛回星座！"
    }
  ],
  D_POST_2B: [
    {
      "who": "fog_kid",
      "emotion": "開心",
      "text": "最後一層是曙光源頭。準備好再去喔！"
    }
  ],
  D_EXIT_LOCK_POST2: [
    {
      "who": "pet",
      "emotion": "平靜",
      "text": "5 個星座都完成，拱門才會打開喔。"
    }
  ],
  D_POST_3A: [
    {
      "who": "fog_kid",
      "emotion": "驚訝",
      "text": "四座雲島上，有四位發著曙光的霧將！"
    },
    {
      "who": "fog_kid",
      "emotion": "平靜",
      "text": "四位都清醒了，中間的光柱才會變亮。"
    },
    {
      "who": "pet",
      "emotion": "開心",
      "text": "先打哪一位都可以，準備好再去喔！"
    }
  ],
  D_POST_BOSS_A: [
    {
      "who": "pet",
      "emotion": "驚訝",
      "text": "發著曙光的霧將，比以前更強！"
    },
    {
      "who": "fog_kid",
      "emotion": "開心",
      "text": "沒關係，你也學會了好多東西！"
    }
  ],
  D_POST_BOSS_B: [
    {
      "who": "fog_kid",
      "emotion": "開心",
      "text": "又一位霧將清醒了！"
    }
  ],
  D_POST_END: [
    {
      "who": "narrator",
      "emotion": "開心",
      "text": "溫暖的光從腳下升起。大家的記憶，都在這道光裡。"
    },
    {
      "who": "fog_kid",
      "emotion": "開心",
      "text": "這裡就是曙光開始的地方。謝謝你陪我走到這裡！"
    },
    {
      "who": "pet",
      "emotion": "開心",
      "text": "辛苦了！累了就找小燈休息吧！"
    }
  ],
  D_SIGN_CHALLENGE: [
    {
      "who": "pet",
      "emotion": "平靜",
      "text": "木牌寫著：給想挑戰更高的冒險者。"
    }
  ],
  D_SHOP_CLOUD: [
    {
      "who": "cloud_shop_m42",
      "emotion": "開心",
      "text": "這是雲上小舖！這一層的裝備在這裡買。",
      "huayu_only": true
    }
  ],
  D_TAO_FISHER_IDLE: [
    {
      "who": "tao_fisher",
      "emotion": "平靜",
      "text": "飛魚季的時候，架子上會曬滿飛魚。",
      "huayu_only": true
    },
    {
      "who": "tao_fisher",
      "emotion": "平靜",
      "text": "請不要從曬飛魚的架子下面走過去喔。",
      "huayu_only": true
    }
  ],
  D_TAO_TARO_IDLE: [
    {
      "who": "tao_taro",
      "emotion": "開心",
      "text": "這是水芋田。芋頭是我們每天吃的主食。",
      "huayu_only": true
    },
    {
      "who": "tao_taro",
      "emotion": "平靜",
      "text": "大船做好的時候，要準備好多芋頭來慶祝。",
      "huayu_only": true
    }
  ],
  D_TAO_ELDER_IDLE: [
    {
      "who": "tao_elder",
      "emotion": "平靜",
      "text": "天氣熱的時候，大家坐在涼台上休息、聊天。",
      "huayu_only": true
    }
  ],
  D_TAO_OWNER_IDLE: [
    {
      "who": "tao_owner",
      "emotion": "平靜",
      "text": "這是用海邊的卵石砌的地下屋。",
      "huayu_only": true
    },
    {
      "who": "tao_owner",
      "emotion": "平靜",
      "text": "屋子蓋得低低的，不怕颱風和冬天的強風。",
      "huayu_only": true
    },
    {
      "who": "tao_owner",
      "emotion": "開心",
      "text": "冬天暖暖的，夏天涼涼的。",
      "huayu_only": true
    },
    {
      "who": "tao_owner",
      "emotion": "平靜",
      "text": "這是我的家。想進去，要先問過我喔。",
      "huayu_only": true
    }
  ],
  D_TAO_BOATMAN_IDLE: [
    {
      "who": "tao_boatman",
      "emotion": "平靜",
      "text": "船屋裡放的是大船，小船就放在海邊。",
      "huayu_only": true
    },
    {
      "who": "tao_boatman",
      "emotion": "平靜",
      "text": "拼板舟請不要隨便摸，也不要坐上去喔。",
      "huayu_only": true
    }
  ],
  D_TAO_KID_IDLE: [
    {
      "who": "tao_kid",
      "emotion": "開心",
      "text": "Akokey！見面打招呼時，我們這樣說喔。",
      "huayu_only": true
    },
    {
      "who": "tao_kid",
      "emotion": "平靜",
      "text": "想幫我拍照，要先問我喔！",
      "huayu_only": true
    }
  ],
  D_ANIMAL_GOAT_LY: [
    {
      "who": "narrator",
      "emotion": "平靜",
      "text": "山羊的耳朵上有記號，代表牠是誰家養的。"
    },
    {
      "who": "pet",
      "emotion": "平靜",
      "text": "牠們有主人，不要追，也不要嚇牠們喔！"
    }
  ],
  // ═══ v4.2 第 4c 批 DIALOGS END ═══
};
