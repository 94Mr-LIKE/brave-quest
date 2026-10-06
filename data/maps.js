/*
 * 勇者大冒險 — 地圖資料（11 張，M01–M11；舞台以台灣地形為藍本）
 * 撰寫：遊戲劇情設計師＋關卡設計
 * 格式依 07_設計改版v0.2 第 6.1 節；新增欄位說明見 docs/data/README_資料格式.md。
 * 座標 x＝欄、y＝列（0 起算）。地名都是「致敬版」虛構地名，不對應真實店家、人物或神明。
 *
 * 格子是給 GPT 畫整張背景圖的「地形草圖」：大塊清楚；建築用 'R'（屋頂）＋'H'（牆）＋'D'（門）拼出輪廓。
 * 每張圖的 art_note 是給美術的文字說明，real_ref 是參考的真實地點。
 *
 * 字元圖例（tilesets.js 由前端維護；這裡只用這些字元）：
 *   '.' 地面   ',' 花草/裝飾地面   '=' 路/石板/月台   '%' 淺泥/淺灘/沙   'D' 門   'B' 橋/木棧道   'S' 樓梯   'c' 地毯（以上可走）
 *   'T' 樹/柱   '#' 牆/岩壁/城牆/泥岩脊   '~' 水   'H' 房屋牆   'R' 屋頂   'F' 柵欄   '*' 灌木/岩石   'K' 大型擺設（以上擋路）
 *
 * 地區之間：
 *   走路相連：M01 金包里 ↔ M02 擎天草原 ↔ M03 硫磺谷；M01 ↔ M06 海蝕洞窟 ↔ M07 哥布林部落；M01 ↔ M09 山城市集；M10 ↔ M11（樓梯）
 *   搭車前往（world.js 世界地圖，從各地的 station 打開）：M04 神木森林、M05 紅樹林濕地、M08 月世界、M10 府城古城
 */
window.MAPS = {

  // ───────────────────────────── M01 金包里（起點）─────────────────────────────
  // 方位依真實金山市區壓縮（見 world.js 檔頭）：北邊是海；老街在中間偏西；慈海宮在老街東南；
  // 溫泉在老街東邊；磺火漁港在東北；燭火雙岩在漁港外海。國小、圖書館、公園、客運站的位置是推論。
  M01: {
    name: "金包里", type: "village", level: 1, bgm: "village", battle_bg: "grass", tileset: "village",
    real_ref: "新北市金山區市區（金山老街、慈護宮、金山溫泉、磺港漁港、燭臺雙嶼）",
    art_note: "北邊大海與沙灘；東北角碼頭木橋伸進海裡，外海兩根細長岩柱（燭火雙岩）；左上是海風國小（只畫柵欄、校門、操場）；中間是客運站與漁會；右邊冒白煙的溫泉池；中間兩排紅磚老街；下方左起圖書館、海風公園（五盞燈）、慈海宮（廟頂燕尾、前面廟埕廣場，不畫神像）。",
    grid: [
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~#~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~#~#~",
      "T%%%%%%%%%%%%%%%%%%~~~~~BB~~~~~~",
      "T%%%%%%%%%%%%%%%%%%%~~~=BB=~~~~~",
      "TFFFFFFFFF......%%==============",
      "TF.......F..RRRRR..==RRRR=======",
      "TF.......F..HHHHH..==HHDH......T",
      "TF.......F..HHDHH..==..........T",
      "TFFFF.FFFF.........==....*****.T",
      "T..................==....*~~~*.T",
      "T.,.,..............==....*~~~*.T",
      "T.RRRR.RRRR.RRRR...==....*****.T",
      "T.HDHH.HHDH.HHDH...==..........T",
      "T===============================",
      "T===============================",
      "T.RRRR.,,,,,,,..RRRRRR.........T",
      "T.HHDH.,T,,,T,..HHDDHH.........T",
      "T......,,,,,,,..,,,,,,,,.......T",
      "TTTTTTTTTTTTTT==TTTTTTTTTTTTTTTT"
    ],
    start: { x: 8, y: 15 },
    station: { x: 14, y: 9, name: "金包里客運站" },
    places: [
      { name: "海風國小（校門與操場）", x: 1, y: 5, w: 9, h: 5 },
      { name: "金包里客運站", x: 12, y: 6, w: 5, h: 3 },
      { name: "漁會", x: 21, y: 6, w: 4, h: 2 },
      { name: "磺火漁港", x: 18, y: 3, w: 14, h: 3 },
      { name: "燭火雙岩", x: 28, y: 1, w: 3, h: 2 },
      { name: "海風溫泉", x: 25, y: 9, w: 5, h: 4 },
      { name: "金包里老街", x: 1, y: 12, w: 15, h: 4 },
      { name: "海風圖書館", x: 2, y: 16, w: 4, h: 2 },
      { name: "海風公園", x: 7, y: 16, w: 7, h: 3 },
      { name: "慈海宮與廟埕", x: 16, y: 16, w: 8, h: 3 }
    ],
    exits: [
      { x: 31, y: 5,  to: "M06", tx: 1,  ty: 7 },
      { x: 31, y: 6,  to: "M06", tx: 1,  ty: 8 },
      { x: 31, y: 14, to: "M09", tx: 1,  ty: 15 },
      { x: 31, y: 15, to: "M09", tx: 1,  ty: 16 },
      { x: 14, y: 19, to: "M02", tx: 14, ty: 1 },
      { x: 15, y: 19, to: "M02", tx: 15, ty: 1 }
    ],
    npcs: [
      { id: "chief",         x: 17, y: 18, sprite: "npc_chief",      dialog: "D_CHIEF_IDLE",  quest: "Q_TUT_1",     quests: ["Q_TUT_1", "Q_LAMPS"] },
      { id: "temple_keeper", x: 20, y: 18, sprite: "npc_chief",      dialog: "D_TEMPLE_IDLE", quest: null,          quests: [] },
      { id: "bookstore",     x: 4,  y: 18, sprite: "npc_bookstore",  dialog: "D_BOOK_IDLE",   quest: "Q_SIDE_BOOK", quests: ["Q_SIDE_BOOK"] },
      { id: "shopkeeper",    x: 3,  y: 13, sprite: "npc_shopkeeper", dialog: "D_SHOP_IDLE",   quest: null,          quests: [] },
      { id: "innkeeper",     x: 30, y: 10, sprite: "npc_innkeeper",  dialog: "D_INN_IDLE",    quest: "Q_TUT_3",     quests: ["Q_TUT_3"] },
      { id: "fisher",        x: 26, y: 4,  sprite: "npc_fisher",     dialog: "D_FISHER_IDLE", quest: "Q_TUT_2",     quests: ["Q_TUT_2"] }
    ],
    lamps: [
      { subject: "國語", x: 7,  y: 16 },
      { subject: "英語", x: 9,  y: 16 },
      { subject: "數學", x: 11, y: 16 },
      { subject: "自然", x: 13, y: 16 },
      { subject: "社會", x: 10, y: 18 }
    ],
    chests: [
      { id: "C_M01_1", x: 2, y: 6, subject: "數學", level: 1, reward: { gold: 20, item: "herb" } }
    ],
    spawns: [
      { monster: "fog_octopus", count: 1, area: [24, 3, 1, 1], boss: true, quest: "Q_MER_4" }
    ],
    inn:  { x: 30, y: 10, npc: "innkeeper", price: 0 },
    shop: { x: 3, y: 13, shop_id: "general", npc: "shopkeeper" }
  },

  // ───────────────────────────── M02 擎天草原 ─────────────────────────────
  M02: {
    name: "擎天草原", type: "field", level: 1, bgm: "field", battle_bg: "grass", tileset: "field",
    real_ref: "陽明山擎天崗大草原（放牧水牛的草原）",
    art_note: "開闊的大草坡，中間一大圈木柵欄圍成的牧場，兩頭水牛在柵欄裡休息（'K'）；石板步道從北邊金包里一路往南，西邊岔路通往硫磺谷；遠方是低矮山稜線。",
    grid: [
      "TTTTTTTTTTTTTT==TTTTTTTTTTTTTT",
      "T.............==.............T",
      "T..,,.........==......,,,....T",
      "T.............==.............T",
      "T....FFFFFFFF.==.FFFFFFFF....T",
      "T....F.......,==,.......F....T",
      "T....F..,,...........,,.F....T",
      "T....F...K.............,F....T",
      "=============...........F....T",
      "=============...........F....T",
      "T....F.............K...,F....T",
      "T....F..,,..........,,..F....T",
      "T....FFFFFFFFFF..FFFFFFFF....T",
      "T..**.....,,........,,...**..T",
      "T..........TT........TT......T",
      "T...,,...............,,.....,T",
      "T............................T",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"
    ],
    exits: [
      { x: 14, y: 0, to: "M01", tx: 14, ty: 18 },
      { x: 15, y: 0, to: "M01", tx: 15, ty: 18 },
      { x: 0,  y: 8, to: "M03", tx: 26, ty: 8 },
      { x: 0,  y: 9, to: "M03", tx: 26, ty: 9 }
    ],
    npcs: [
      { id: "potato_seller", x: 16, y: 2, sprite: "npc_shopkeeper", dialog: "D_POTATO_IDLE", quest: "Q_SIDE_POTATO", quests: ["Q_SIDE_POTATO"] }
    ],
    chests: [
      { id: "C_M02_1", x: 4,  y: 15, subject: "數學", level: 1, reward: { gold: 30, item: null } },
      { id: "C_M02_2", x: 27, y: 2,  subject: "數學", level: 1, reward: { gold: 20, item: "eraser" } }
    ],
    spawns: [
      { monster: "dango",  count: 3, area: [6, 5, 18, 7] },
      { monster: "dango",  count: 2, area: [1, 13, 10, 4] },
      { monster: "rabbit", count: 3, area: [14, 13, 15, 4] }
    ],
    inn: null, shop: null
  },

  // ───────────────────────────── M03 硫磺谷 ─────────────────────────────
  M03: {
    name: "硫磺谷", type: "field", level: 2, bgm: "field", battle_bg: "rock", tileset: "field",
    real_ref: "陽明山小油坑一帶（噴氣孔、硫磺結晶、溫泉溪）",
    art_note: "光禿禿的火山谷，'*' 是冒白煙的噴氣孔岩堆（畫黃色硫磺結晶），'~' 是冒熱氣的溫泉池與熱水溪，'%' 是灰白泥地；石板步道繞一圈，中間木橋跨過熱水溪。東邊回擎天草原。",
    grid: [
      "****************************",
      "**....**....****.....**...**",
      "*..~~..*..%%....*..~~~..,..*",
      "*..~~.....%%%.......~~~....*",
      "*.......===========......***",
      "**.....=*****....~~=.......*",
      "*..%%..=*~~~*..,..~=...%%..*",
      "*......=*****......=.......*",
      "*......=========BB==========",
      "*..,...=========BB==========",
      "*..%%%..........~~.....%%..*",
      "*..%%%..**......~~....*..,.*",
      "*.....****......~~..~~~....*",
      "*..,..........~~~~..~~~..,.*",
      "**.......**..~~~~.......****",
      "****************************"
    ],
    exits: [
      { x: 27, y: 8, to: "M02", tx: 1, ty: 8 },
      { x: 27, y: 9, to: "M02", tx: 1, ty: 9 }
    ],
    npcs: [
      { id: "hiker", x: 22, y: 7, sprite: "npc_fisher", dialog: "D_HIKER_IDLE", quest: "Q_SIDE_STEAM", quests: ["Q_SIDE_STEAM"] }
    ],
    chests: [
      { id: "C_M03_1", x: 24, y: 2,  subject: "數學", level: 2, reward: { gold: 40, item: null } },
      { id: "C_M03_2", x: 25, y: 11, subject: "數學", level: 2, reward: { gold: 20, item: "guide" } }
    ],
    spawns: [
      { monster: "mushroom", count: 3, area: [1, 1, 15, 7] },
      { monster: "owl",      count: 2, area: [1, 10, 14, 4] },
      { monster: "mushroom", count: 1, area: [18, 10, 9, 4] }
    ],
    inn: null, shop: null
  },

  // ───────────────────────────── M04 神木森林（精靈族）─────────────────────────────
  M04: {
    name: "神木森林", type: "tribe", level: 2, bgm: "elf", battle_bg: "forest", tileset: "forest",
    real_ref: "嘉義阿里山森林（巨木群、森林小火車）",
    art_note: "高大的檜木林。最北邊是一棵巨大的千年神木（'K'），周圍是花草圍成的空地；左右各有精靈樹屋；中段是密林小徑；最南邊是森林小火車的小車站與月台。",
    grid: [
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTT,,,,,,,,,,TTTTTTTTTT",
      "TT...TTTT,,,,KKKK,,,,TT....TTT",
      "TT.RRR.TT,,,,KKKK,,,,TT.RRR.TT",
      "TT.HDH.TT,,,,,,,,,,,,TT.HDH.TT",
      "TT.....TTTTT,,==,,TTTTT.....TT",
      "T.....,......==.......,......T",
      "T.RRRR.......==.......RRRR...T",
      "T.HHDH.......==.......HDHH...T",
      "T............==..........,...T",
      "TTTTTT..TTTTT==TTTTT..TTTTTTTT",
      "TT..TT..TT...==...TT..TT...TTT",
      "T....TT.....=====....TT.....,T",
      "T..,.TTT..TT==TTT..TTT...TTT.T",
      "T......TT...==...TT...,......T",
      "TT..,.......==.........TT...TT",
      "TTT.........==...RRRRRR....TTT",
      "TT..........==...HHDDHH....TTT",
      "TT==========================TT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"
    ],
    start: { x: 16, y: 18 },
    station: { x: 19, y: 18, name: "神木森林站" },
    exits: [],
    npcs: [
      { id: "elf_elder",    x: 4,  y: 5,  sprite: "npc_elf_elder", dialog: "D_ELDER_IDLE",  quest: "Q_ELF_1",     quests: ["Q_ELF_1", "Q_ELF_3", "Q_ELF_4"] },
      { id: "elf_kid",      x: 16, y: 9,  sprite: "npc_elf_kid",   dialog: "D_ELFKID_IDLE", quest: "Q_ELF_2",     quests: ["Q_ELF_2"] },
      { id: "elf_kid_lost", x: 27, y: 14, sprite: "npc_elf_kid",   dialog: "D_LOST_IDLE",   quest: "Q_SIDE_LOST", quests: ["Q_SIDE_LOST"] }
    ],
    chests: [
      { id: "C_M04_1", x: 25, y: 2,  subject: "數學", level: 2, reward: { gold: 50, item: null } },
      { id: "C_M04_2", x: 3,  y: 14, subject: "數學", level: 2, reward: { gold: 30, item: "herb" } }
    ],
    spawns: [
      { monster: "mushroom",  count: 3, area: [1, 11, 11, 5] },
      { monster: "sprout",    count: 2, area: [16, 11, 13, 5] },
      { monster: "owl",       count: 2, area: [6, 11, 18, 5] },
      { monster: "tree_king", count: 1, area: [14, 4, 1, 1], boss: true, quest: "Q_ELF_4" }
    ],
    inn: { x: 25, y: 5, npc: null, price: 0 },
    shop: null
  },

  // ───────────────────────────── M05 紅樹林濕地（地精族）─────────────────────────────
  M05: {
    name: "紅樹林濕地", type: "field", level: 3, bgm: "swamp", battle_bg: "swamp", tileset: "swamp",
    real_ref: "台北關渡自然公園、台南四草一帶的紅樹林與泥灘",
    art_note: "大片泥灘（'%'）上長著一叢叢紅樹林（'T'），中間一條寬河道（'~'）；一條木棧道（'B'）南北穿過河道；東北角乾地上是地精的小工坊；西南泥灘是泥巴大蛙的地盤；最南邊是濕地站月台。",
    grid: [
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "T%%%TT%%%%%%~~~~~.....RRR....T",
      "T%TT%%%%TT%%~~~~~.....HDH....T",
      "T%%%%TT%%%%%~~~~~,.......,...T",
      "T%%TT%%%%BBBBBBBBBBB.........T",
      "T%%%%%%%%B~~~~~~~~~%%%%%TT%%%T",
      "T~~~~~~~~B~~~~~~~~~~~~~~~~~~~T",
      "T~~~~~~~~B~~~~~~~~~~~~~~~~~~~T",
      "T%%TT%%%%B%%%%TT%%%%%%%%%%%%%T",
      "T%~~~%%%%B%%TTT%%~~~~~~~%%%%%T",
      "T%%~~~%%%B%%%%%%%%~~~~~~~%%%%T",
      "T%%%%%%%%B%%TT%%%%%%~~~~%%TT%T",
      "T%..%%%%%B%%%%%%%%TT%%%%%%%%%T",
      "T....%%%%B%%%%%%%%%%%%%,,,%%%T",
      "TTT..%%%%B%%%%TT%%%%%%%%%%%%TT",
      "TT.......=.......RRRRRR.....TT",
      "TT.......=.......HHDDHH.....TT",
      "TT.......=================..TT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"
    ],
    start: { x: 16, y: 17 },
    station: { x: 19, y: 17, name: "濕地站" },
    exits: [],
    npcs: [
      { id: "gnome_chief",   x: 23, y: 3,  sprite: "npc_gnome_chief", dialog: "D_GNOME_CHIEF_IDLE", quest: "Q_GNO_1",        quests: ["Q_GNO_1", "Q_GNO_3", "Q_GNO_4"] },
      { id: "gnome",         x: 26, y: 3,  sprite: "npc_gnome",       dialog: "D_GNOME_IDLE",       quest: "Q_GNO_2",        quests: ["Q_GNO_2"] },
      { id: "gnome_measure", x: 3,  y: 13, sprite: "npc_gnome",       dialog: "D_MEASURE_IDLE",     quest: "Q_SIDE_MEASURE", quests: ["Q_SIDE_MEASURE"] }
    ],
    chests: [
      { id: "C_M05_1", x: 2,  y: 1,  subject: "數學", level: 3, reward: { gold: 50, item: "herb" } },
      { id: "C_M05_2", x: 28, y: 12, subject: "數學", level: 3, reward: { gold: 60, item: null } }
    ],
    spawns: [
      { monster: "mudslime", count: 3, area: [10, 8, 19, 6] },
      { monster: "frog",     count: 3, area: [1, 8, 28, 7] },
      { monster: "mud_frog", count: 1, area: [2, 12, 1, 1], boss: true, quest: "Q_GNO_4" }
    ],
    inn: { x: 21, y: 4, npc: null, price: 0 },
    shop: null
  },

  // ───────────────────────────── M06 海蝕洞窟 ─────────────────────────────
  M06: {
    name: "海蝕洞窟", type: "dungeon", level: 3, bgm: "cave", battle_bg: "cave", tileset: "cave",
    real_ref: "北海岸野柳地質公園（蕈狀岩、海蝕地形）",
    art_note: "左半邊是海邊岩岸：沙灘（'%'）上立著一顆顆像香菇的蕈狀岩（'*'），北邊是海；右半邊是被海浪侵蝕出來的岩洞，'#' 是岩壁，東北角深處通往哥布林部落。",
    grid: [
      "~~~~~~~~~~~~~~##############",
      "~~~~~~~~~~~~~~#....##.....##",
      "~~~*~~~~*~~~~%#..*.##..,..##",
      "~~%%%%~~~%%%%%#.....##......",
      "~%%*%%%%%%*%%%#..*.......*..",
      "T%%%%%*%%%%%%%##..####..####",
      "T%*%%%%%%%*%%%...##....#...#",
      "%%%%%%%%%%%%%%.......#.....#",
      "%%%%%%*%%%%%%%..##.........#",
      "T%%*%%%%%%*%%%..##..###....#",
      "T%%%%%%%%%%%%%#.....###..*.#",
      "T%%*%%%%*%%%%%#..,.........#",
      "TT%%%%%%%%%%%%##...##.....##",
      "TTT%%%%%%%%%%%###..........#",
      "TTTTT%%%%%%%%####.....######",
      "############################"
    ],
    exits: [
      { x: 0,  y: 7, to: "M01", tx: 30, ty: 5 },
      { x: 0,  y: 8, to: "M01", tx: 30, ty: 6 },
      { x: 27, y: 3, to: "M07", tx: 1,  ty: 3 },
      { x: 27, y: 4, to: "M07", tx: 1,  ty: 4 }
    ],
    npcs: [
      { id: "goblin_kid_echo", x: 20, y: 11, sprite: "npc_goblin_kid", dialog: "D_ECHO_IDLE", quest: "Q_SIDE_ECHO", quests: ["Q_SIDE_ECHO"] }
    ],
    chests: [
      { id: "C_M06_1", x: 24, y: 1,  subject: "數學", level: 3, reward: { gold: 40, item: "crystal" } },
      { id: "C_M06_2", x: 4,  y: 13, subject: "數學", level: 3, reward: { gold: 60, item: null } }
    ],
    spawns: [
      { monster: "crab", count: 3, area: [1, 3, 13, 11] },
      { monster: "bat",  count: 3, area: [15, 6, 12, 8] },
      { monster: "rock", count: 2, area: [15, 1, 12, 4] }
    ],
    inn: null, shop: null
  },

  // ───────────────────────────── M07 哥布林部落 ─────────────────────────────
  M07: {
    name: "哥布林部落", type: "tribe", level: 3, bgm: "goblin", battle_bg: "cave", tileset: "cave",
    real_ref: "（奇幻地點，接在野柳海蝕洞深處）",
    art_note: "洞窟裡的聚落：左半邊四間石頭小屋與一根告示柱（'K'），右上被岩壁隔開的小洞是噪音蝙蝠王的窩（另一個 'K' 是蝙蝠倒掛的石柱）。",
    grid: [
      "############################",
      "###....#####......##.......#",
      "##......RRR...RRR..#.,...,.#",
      "........HDH...HDH..#.......#",
      "...........K.......#...K...#",
      "##.....,.......,...........#",
      "###..RRR....RRR....##.....##",
      "##...HHH....HHH....##..*..##",
      "##...HDH....HDH.....#.....##",
      "##........................##",
      "###...*.......,......*...###",
      "####.........====.........##",
      "#####.....#########......###",
      "######...###########....####",
      "############################",
      "############################"
    ],
    exits: [
      { x: 0, y: 3, to: "M06", tx: 26, ty: 3 },
      { x: 0, y: 4, to: "M06", tx: 26, ty: 4 }
    ],
    npcs: [
      { id: "goblin_chief", x: 9,  y: 4, sprite: "npc_goblin_chief", dialog: "D_GOB_CHIEF_IDLE", quest: "Q_GOB_1", quests: ["Q_GOB_1", "Q_GOB_3", "Q_GOB_4"] },
      { id: "goblin_kid",   x: 15, y: 4, sprite: "npc_goblin_kid",   dialog: "D_GOBKID_IDLE",    quest: "Q_GOB_2", quests: ["Q_GOB_2"] }
    ],
    chests: [
      { id: "C_M07_1", x: 21, y: 2, subject: "數學", level: 3, reward: { gold: 50, item: "guide" } }
    ],
    spawns: [
      { monster: "goblin",    count: 3, area: [4, 10, 21, 3] },
      { monster: "noise_bat", count: 1, area: [23, 3, 1, 1], boss: true, quest: "Q_GOB_4" }
    ],
    inn: { x: 13, y: 9, npc: null, price: 0 },
    shop: null
  },

  // ───────────────────────────── M08 月世界泥岩丘（獸人族）─────────────────────────────
  M08: {
    name: "月世界泥岩丘", type: "field", level: 4, bgm: "hills", battle_bg: "rock", tileset: "field",
    real_ref: "高雄田寮月世界（泥岩惡地，翰林三下國語〈月世界之旅〉可呼應）",
    art_note: "灰白色的泥岩惡地：'#' 是一道道斜斜的光禿泥岩脊，中間是乾裂的溝谷；東北角柵欄圍起獸人營地；東側一個小水池；西南角是月世界站月台。幾乎沒有樹。",
    grid: [
      "##############################",
      "#....###......##.......###...#",
      "#.....###....##..FFFFFFFFFF..#",
      "#..#...###..##...F.RRR.RRRF..#",
      "#..##...###..##..F.HHH.HHHF..#",
      "#...##...###..#..F.HDH.HDHF..#",
      "#....##...###....F........F..#",
      "#.....##...###...FFFF..FFFF..#",
      "#.......##.............~~~...#",
      "#..###....##..........~~~~~..#",
      "#....###....###.........~~~..#",
      "#.......###....###...........#",
      "#..##.....###....###....##...#",
      "#.....##.....###....###......#",
      "#RRRRR..##......###....###...#",
      "#HHDHH....##.........###.....#",
      "#=======================.....#",
      "##############################"
    ],
    start: { x: 6, y: 16 },
    station: { x: 3, y: 16, name: "月世界站" },
    exits: [],
    npcs: [
      { id: "orc_chief", x: 20, y: 6,  sprite: "npc_orc_chief", dialog: "D_ORC_CHIEF_IDLE", quest: "Q_ORC_1",      quests: ["Q_ORC_1", "Q_ORC_3", "Q_ORC_4"] },
      { id: "orc",       x: 24, y: 6,  sprite: "npc_orc",       dialog: "D_ORC_IDLE",       quest: "Q_ORC_2",      quests: ["Q_ORC_2"] },
      { id: "orc_bank",  x: 27, y: 10, sprite: "npc_orc",       dialog: "D_ORC_BANK_IDLE",  quest: "Q_SIDE_PIGGY", quests: ["Q_SIDE_PIGGY"] }
    ],
    chests: [
      { id: "C_M08_1", x: 2,  y: 1,  subject: "數學", level: 4, reward: { gold: 60, item: null } },
      { id: "C_M08_2", x: 27, y: 15, subject: "數學", level: 4, reward: { gold: 40, item: "herb" } }
    ],
    spawns: [
      { monster: "boar",        count: 3, area: [1, 8, 28, 8] },
      { monster: "wisp",        count: 2, area: [1, 1, 15, 6] },
      { monster: "angry_golem", count: 1, area: [17, 13, 1, 1], boss: true, quest: "Q_ORC_4" }
    ],
    inn: { x: 22, y: 6, npc: null, price: 0 },
    shop: null
  },

  // ───────────────────────────── M09 山城市集（外國商人）─────────────────────────────
  M09: {
    name: "山城市集", type: "town", level: 2, bgm: "town", battle_bg: "town", tileset: "town",
    real_ref: "新北市瑞芳九份（山城、豎崎路石階、基山街窄巷）",
    art_note: "依山而建的老山城：中間一條從下往上的長石階（'S'），三條橫向窄巷（'='）把一排排擠在一起的小屋隔開，屋頂掛紅燈籠；店主人站在自家門口。最下面是寬一點的公路，西邊通回金包里，左下角是山城公車站。",
    grid: [
      "################################",
      "#RRRRR.RRRRRR.SS.RRRRRR.RRRRRR.#",
      "#HHHHH.HHHHHH.SS.HHHHHH.HHHHHH.#",
      "#HHDHH.HHDHHH.SS.HHHDHH.HHDHHH.#",
      "#=============SS===============#",
      "#.RRRR.RRRRR..SS..RRRRR.RRRR.,.#",
      "#.HHHH.HHHHH..SS..HHHHH.HHHH...#",
      "#.HDHH.HHDHH..SS..HHDHH.HDHH...#",
      "#=============SS===============#",
      "#..TT..RRRRRR.SS.RRRRRR..,,..T.#",
      "#......HHHHHH.SS.HHHHHH........#",
      "#......HHDHHH.SS.HHHDHH........#",
      "#=============SS===============#",
      "#.RRRRR..,,...SS...,,..RRRRR...#",
      "#.HHDHH.......SS.......HHDHH...#",
      "==============================.#",
      "==============================.#",
      "#..T..,,..T..........,,..T.....#",
      "################################"
    ],
    start: { x: 6, y: 15 },
    station: { x: 4, y: 15, name: "山城公車站" },
    exits: [
      { x: 0, y: 15, to: "M01", tx: 30, ty: 14 },
      { x: 0, y: 16, to: "M01", tx: 30, ty: 15 }
    ],
    npcs: [
      { id: "innkeeper_port", x: 3,  y: 3, sprite: "npc_innkeeper",  dialog: "D_PORT_INN_IDLE",   quest: null,            quests: [] },
      { id: "blacksmith",     x: 9,  y: 3, sprite: "npc_blacksmith", dialog: "D_BLACKSMITH_IDLE", quest: "Q_SIDE_MAGNET", quests: ["Q_SIDE_MAGNET"] },
      { id: "armor_keeper",   x: 20, y: 3, sprite: "npc_shopkeeper", dialog: "D_ARMOR_IDLE",      quest: null,            quests: [] },
      { id: "item_keeper",    x: 26, y: 3, sprite: "npc_shopkeeper", dialog: "D_ITEM_IDLE",       quest: null,            quests: [] },
      { id: "merchant",       x: 3,  y: 7, sprite: "npc_merchant",   dialog: "D_MERCHANT_IDLE",   quest: "Q_MER_1",       quests: ["Q_MER_1", "Q_MER_2", "Q_MER_3", "Q_MER_4"] },
      { id: "taro_seller",    x: 25, y: 7, sprite: "npc_shopkeeper", dialog: "D_TARO_IDLE",       quest: "Q_SIDE_TARO",   quests: ["Q_SIDE_TARO"] }
    ],
    chests: [
      { id: "C_M09_1", x: 29, y: 5, subject: "數學", level: 2, reward: { gold: 30, item: "snack" } }
    ],
    spawns: [
      { monster: "seagull", count: 3, area: [1, 4, 30, 13] }
    ],
    inn:  { x: 3,  y: 3, npc: "innkeeper_port", price: 0 },
    shop: { x: 26, y: 3, shop_id: "item", npc: "item_keeper" },
    extra_shops: [
      { x: 9,  y: 3, shop_id: "weapon", npc: "blacksmith" },
      { x: 20, y: 3, shop_id: "armor",  npc: "armor_keeper" }
    ]
  },

  // ───────────────────────────── M10 府城古城 ─────────────────────────────
  M10: {
    name: "府城古城", type: "castle", level: 4, bgm: "castle", battle_bg: "castle", tileset: "castle",
    real_ref: "台南府城（古城牆、城門、赤崁樓一帶的古城氛圍）",
    art_note: "紅磚古城：外圍 '#' 是古城牆；北半部是城主府，紅地毯通到城主的大椅（'KK'），左廳是職業公會、右廳是圖書館（'K' 書櫃、木樁）；城主府後方頂端的樓梯通往古城塔頂；南半部是庭園（'T' 老樹、'~' 水池）；左下角是府城車站月台。",
    grid: [
      "#############SS#############",
      "#.....#.....cccc.....#.....#",
      "#.....#..K..cccc..K..#.....#",
      "#.....#.....cKKc.....#.....#",
      "#.....#.....cccc.....#.....#",
      "#.....###...cccc...###.....#",
      "#...........cccc...........#",
      "#.K.K.###...cccc...###.K.K.#",
      "#.....#.....cccc.....#.....#",
      "#######.....cccc.....#######",
      "#,,,,,,,T...cccc...T,,,,,,,#",
      "#,,T,,,.....====.....,,,T,,#",
      "#,,,,,,T....====....T,,,,,,#",
      "#..~~~......====......~~~..#",
      "#..~~~......====......~~~..#",
      "#RRRRR......====...........#",
      "#HHDHH......====...........#",
      "#==========================#",
      "############################"
    ],
    start: { x: 6, y: 17 },
    station: { x: 3, y: 17, name: "府城車站" },
    exits: [
      { x: 13, y: 0, to: "M11", tx: 11, ty: 12 },
      { x: 14, y: 0, to: "M11", tx: 12, ty: 12 }
    ],
    npcs: [
      { id: "king",      x: 13, y: 4, sprite: "npc_king",      dialog: "D_KING_IDLE",      quest: "Q_FINAL",    quests: ["Q_FINAL"] },
      { id: "guild",     x: 3,  y: 4, sprite: "npc_guild",     dialog: "D_GUILD_IDLE",     quest: null,         quests: [] },
      { id: "librarian", x: 24, y: 4, sprite: "npc_librarian", dialog: "D_LIBRARIAN_IDLE", quest: "Q_SIDE_LIB", quests: ["Q_SIDE_LIB"] }
    ],
    chests: [
      { id: "C_M10_1", x: 1, y: 1, subject: "數學", level: 4, reward: { gold: 60, item: "guide" } }
    ],
    spawns: [
      { monster: "armor", count: 2, area: [1, 10, 10, 5] },
      { monster: "wisp",  count: 2, area: [17, 10, 10, 5] }
    ],
    inn: { x: 9, y: 15, npc: null, price: 0 },
    shop: null
  },

  // ───────────────────────────── M11 古城塔頂（最終）─────────────────────────────
  M11: {
    name: "古城塔頂", type: "castle", level: 5, bgm: "final", battle_bg: "castle_top", tileset: "castle",
    real_ref: "（奇幻地點，參考古城樓閣屋頂的氛圍）",
    art_note: "古城樓閣的屋頂平台，四周是矮牆，'T' 是紅柱子；紅地毯一路通到最北邊，遺忘霧魔在地毯盡頭的霧裡；遠方可以看到整座古城。",
    grid: [
      "########################",
      "#..T......cccc......T..#",
      "#.........cccc.........#",
      "#..T......cccc......T..#",
      "#.........cccc.........#",
      "#..T......cccc......T..#",
      "#.........cccc.........#",
      "#..T......cccc......T..#",
      "#.........cccc.........#",
      "##..*.....cccc.....*..##",
      "###.......cccc.......###",
      "####......cccc......####",
      "#####......cc......#####",
      "###########SS###########"
    ],
    exits: [
      { x: 11, y: 13, to: "M10", tx: 13, ty: 1 },
      { x: 12, y: 13, to: "M10", tx: 14, ty: 1 }
    ],
    npcs: [],
    chests: [],
    spawns: [
      { monster: "wisp",      count: 2, area: [1, 3, 22, 6] },
      { monster: "fog_demon", count: 1, area: [11, 2, 1, 1], boss: true, quest: "Q_FINAL" }
    ],
    inn: null, shop: null
  }
};
