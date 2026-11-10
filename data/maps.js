/*
 * 勇者大冒險 — 地圖資料（11 張，M01–M11；舞台以台灣地形為藍本）
 * 撰寫：遊戲劇情設計師＋關卡設計
 * 格式依 07_設計改版v0.2 第 6.1 節；新增欄位說明見 docs/data/README_資料格式.md。
 * 座標 x＝欄、y＝列（0 起算）。地名都是「致敬版」虛構地名，不對應真實店家、人物或神明；例外：金包里慈護宮用真實名稱（老闆 2026-10-11 裁示）。
 *
 * 格子是給 GPT 畫整張背景圖的「地形草圖」：大塊清楚；建築用 'R'（屋頂）＋'H'（牆）＋'D'（門）拼出輪廓。
 * 每張圖的 art_note 是給美術的文字說明，real_ref 是參考的真實地點。
 *
 * 字元圖例（tilesets.js 由前端維護；這裡只用這些字元）：
 *   '.' 地面   ',' 花草/裝飾地面   '=' 路/石板/月台   '%' 淺泥/淺灘/沙   'D' 門   'B' 橋/木棧道   'S' 樓梯   'c' 地毯（以上可走）
 *   'T' 樹/柱   '#' 牆/岩壁/城牆/泥岩脊   '~' 水   'H' 房屋牆   'R' 屋頂   'F' 柵欄   '*' 灌木/岩石   'K' 大型擺設（以上擋路）
 *
 * v0.5 大地圖：M01、M02、M03、M04、M05、M06、M07、M08、M09、M10、M11、M46、M47、M48、M49、M14、M50、M51、M52、M13、M12、M53、M54、M15、M16、M17、M18、M19、M20、M21、M22、M23、M24、M25、M26、M27、M28、M29 邊長放大約 3 倍（M01 96×60、M02 90×54、M03 84×48、M04 90×60、M05 90×57、M06 84×48、M07 84×48、M08 90×54、M09 96×57、M10 84×57、M11 72×42、M46 84×48、M47 96×57、M48 90×54、M49 84×48、M14 96×57、M50 90×54、M51 96×57、M52 84×48、M13 90×60、M12 96×60、M53 96×57、M54 84×54、M15 90×57、M16 90×54、M17 90×54、M18 90×54、M19 90×54、M20 96×57、M21 96×57、M22 96×60、M23 90×54、M24 72×48、M25 72×90、M26 90×57、M27 72×48、M28 72×48、M29 90×57），
 *   格子依 GPT 背景逐格重描（來源 tools/bigmaps/<ID>.txt／.json，背景 docs/assets/maps/bg_<ID>.webp）。
 *
 * 地區之間：
 *   走路相連：M01 金包里 ↔ M02 擎天草原 ↔ M03 硫磺谷；M01 ↔ M06 海蝕洞窟 ↔ M07 哥布林部落；M01 ↔ M09 山城市集；M10 ↔ M11（樓梯）
 *   搭車前往（world.js 世界地圖，從各地的 station 打開）：M04 神木森林、M05 紅樹林濕地、M08 月世界、M10 府城古城
 */
window.MAPS = {

  // ───────────────────────────── M01 金包里（起點）─────────────────────────────
  // 方位依真實金山市區壓縮（見 world.js 檔頭）：北邊是海；老街在中間偏西；金包里慈護宮在老街東南；
  // 溫泉在老街東邊；磺火漁港在東北；燭火雙岩在漁港外海。國小、圖書館、公園、客運站的位置是推論。
  M01: {
    name: "金包里", type: "village", level: 1, bgm: "village", battle_bg: "grass", tileset: "village",
    real_ref: "新北市金山區市區（金山老街、慈護宮、金山溫泉、磺港漁港、燭臺雙嶼）",
    art_note: "北邊大海與沙灘；東北角碼頭木橋伸進海裡，外海兩根細長岩柱（燭火雙岩）；左上是海風國小（只畫柵欄、校門、操場）；中間是客運站與漁會；右邊冒白煙的溫泉池；中間兩排紅磚老街；下方左起圖書館、海風公園（五盞燈）、金包里慈護宮（廟頂燕尾、前面廟埕廣場，不畫神像）。",
    grid: [
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "TTT*****~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~BBB~~~~~~~~~BBB~~~~~~~~~~~~~~~~~~",
      "TTT%%%%%%%*%%%*%%%%%%%%*%~~**~~~~~%%*~~~~~~~~~~~~~~~~~~~~~~~~~~BBB~~~~~~~~~BBB~~~~~~~~~~~~~~~~~~",
      "TTTU%*%U%%%%%%%U%%%%%%UU%%%**%U%%U%%%*~~~~~~~~~~~~~~~~~~~~~~~~~BBB~~~~~~~~~BBB~~~~~~~~~~~~~~~~~~",
      "TTTT%**T%%**%%%T*%%%%*T***%%%%T**T%%%%%%%%T**FFFFFF~~~~TT#~~~~~BBB~~~~~~~~~BBB~~~~~~~~~~~~~~~~~~",
      "TTTFFFFFFFFFFFFFFSSSFFFFFFFFFFFFFFSSSFFFFFFFFBBBBB*RRRRRT#~~~~~BBB~~~~~~~~~BBB~~~~~~~~~~~~~~~~TT",
      "TTTBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB**RRRRRT#~~~~~BBB~~~~~~~~~BBB~~~~~~~~~~~~~~~KTT",
      "TTFFFFFFFFFFFFFFFFFFFFFFUU===.....*.......*........HHHHHT#=====K==K=K=KK=KK=========KKKK=====KTT",
      "TTF*...................F**=========================HHHHH**===K=========K=============KKK==KK=K##",
      "TTF*...................F**=========================KK==KK====================================K**",
      "TTF*...................F**==UUUUUUUUUUUUUUUUUU.....==========UUUUUUUUUUUUU~~UUUUUUUUUUUUUUUU====",
      "TTF*U.................UF**==TTTRRRRRRRRRRRRRTT...**=UU=UU=UU=TTRRRRRRRRRTT~~TRRRRRRRRRRRRTTT*===",
      "TTF*K.................KF**==TTTRRRRRRRRRRRRRTT.....=KK=KK=KK=TTRRRRRRRRRTTKKTRRRRRRRRRRRRTTT**TT",
      "TTF*...................F**==TTTHHHHHHHHHHHHHTT.....==========TTHHHHHHHHHTT~~THHHHHHHHHHHHTTT**TT",
      "TTF*.K................KF**==TTTHHHHHHHHHHHHHKK.....=UU=UU=UU=TTHHHHHHHHHTT~~THHHHHHHHHHHHTTT**TT",
      "TTF....................F**==================.==....=KK=KK=KK=TTK========TT~~TK=KKK===KKK=KK***TT",
      "TTF**..........*.......F**================================================BB==================TT",
      "TTFFFFFFFFFF==FFFFFFFFFF**================================================BB==================TT",
      "TTT.......*.==..........**========U.============UUUUUUUUUUUUUUUUUUUUUUUUU=BB*.......BB........TT",
      "TTT.........==..........**==UUUUUUTTUUUUUUUU.==URRRRRTTTRRRTTTRRRRTTTRRRR*~~=U.....KBBK.*..UUUTT",
      "TTT.U.......==..........**==RRRRRRTTRRRRRTTTT==*RRRRRTTTRRRTTTRRRRTTTRRRR*~~=K*****KBBK****KKKTT",
      "TTT**.......==U.........**==RRRRRRTTRRRRRTTTT==*HHHHHTTTHHHTTTHHHHTTTHHHH*~~=.*~~~*.BB.*~~~*~~TT",
      "TTT**.....*.==**........**==HHHHHHTTHHHHHTTTT==*HHHHHTTTHHHTTTHHHHTTTHHHH*~~***~~~*.BB.*~~~*~~TT",
      "TTT****...**==**...*...***==HHHHHHTTHHHHHTTTT==*HHHHHTTTHHHTTTHHHH*KKHHHH*~~***~~~*.BB.*~~~***TT",
      "TTT**.......==.........===================================================~~=K*****KBBK*****K*TT",
      "TTT=======================================================================~~========BB========TT",
      "TTT==================================================UUU==================~~========BB========TT",
      "TTTUUUUUUUUU===UUUUUUUUUUU==UUUUUUUUUUUUUUUUU==UUUUUUTTTUUUUUUUUUUUUUUUUUU~~UUUUUUUUBBUUUUUUUUTT",
      "TTTRRRRRRRTT===TTRRRRRRRRT==RRRRRRR*RRRRRRTTT==RRRRRRTTTRRRRRRRRRRRRRRRRR*~~*RRRRRR*BB*RRRRRRTTT",
      "TTTRRRRRRRTT===TTRRRRRRRRT==RRRRRRR*RRRRRRTTT==RRRRRRTTTRRRRRRRRRRRRRRRRR*~~*RRRRRR*BB*RRRRRRTTT",
      "TTTHHHHHHHTT===TTHHHHHHHHT==HHHHHHH*HHHHHHTTT==HHHHHHTTTHHHHHHHHHHHHHHHHH*~~*HHHHHH*BB*HHHHHHTTT",
      "TTTHHHHHHHTT===TTHHHHHHHHT==HHHHHHH*HHHHHH***==HHHHHHTTTHHHHHHHHHHHHHHHHH*~~*HHHHHH*BB*HHHHHHTTT",
      "TTT==========================================================================================TTT",
      "TTT=================================================UUUUUUUUUUUUUUU=U.=======================TTT",
      "TTT=================================================UURRRRRRRRRRRUUUUUUU====UU========.U~~~~~TTT",
      "TTTUUUUUUUUUUUUUU=......*.==...*........UUUU.==UUUUUURRRRRRRRRRRRRRRUTUU**..**....**.=**~~~~~TTT",
      "TTT*RRRRRRRRRRRR*=.,*.....==.,..........TTTT.==TTTRRRRRRRRRRRRRRRRRRRTRR====================K***",
      "TTT*RRRRRRRRRRRR*=.UU.....==........UU..TTTT.==TTTRRRRRRRRRRRRRRRRRRRTTR=====================***",
      "TTT*HHHHHHHHHHHH*=TTTUUUUU==.......TTTU.TTTT.==TTTRRRRRRRRRRRRRRRRRRRTFFFFFFFFFF===FFFFFFFFFFFFT",
      "TTT*HHHHHHHHHHHH*=TTT~~~~*==.*.....TTTTUKK...==TTTRRRRRRRRRRRRRRRRRRRTTFTTT....*===***RRRRRRRRFT",
      "TTT*HHHHHHHHHHHH*=TTT~~~~*==.......TTTKKKK...==TTTRRHHHHHHHHHHHHHHHHHTTFTTT*..*.===***RRRRRRRRFT",
      "TTT*#####SS#####*=TT*~~~~*==.*........KKKKUUU==TTTHHHHHHHHHHHHHHHHHHHTTFTTT.....===***RRRRRRRRFT",
      "TTT===============..*~~~~*==.*........KKKK***==TTTHHHHHHHHH===HHHHHHHTTFTTT.....===***HHHHHHHHFT",
      "TTT=K==========K==..*~~~~*==..........KKKK***==TTTHHHHHHKK=====KKHHHHTTFTTT.....===.**HHHHHHHHFT",
      "TTTU*U.UUUUU...*==.,*..*..==.,***........**,.==****K..K.KSSSSSSSK.K**TTFF.......===...=KK=K===FT",
      "TTTTTTTTTTTTTTTT========================================================F=====================FT",
      "TTTTTTTTTTTTTTTT===========================================UUU==========F,,,,,,,,,,,,,,,,,,,,=FT",
      "TTTTTTTTTTTTTTTT==....*...==...==............==....========UUU==========F,,,,,,,,,,,,,,,,,,,,=FT",
      "TTTTTTTT..TTTTTT==.....*..==UUU==.K.....UUU..==....========KKK======.UF.F,,,,,,,,,U,,,,,,,,,,=FT",
      "TTTTTTTT..TTTTTT==UUU.....==***==.K.....TTT..==....=========K========TF.F,,,,,,,,,K,,,,,,,,,,=FT",
      "TTTTUUUUUUUTTTTT==UUU...*.==***==..**...TTT..==....=================UTF.F,,,,,,,,,,,,,,,,,,,,=FT",
      "TTTTUTTTTTTTTTTT==TTT.....==***==...*...TTT..==.*..=================TTF.F,,,,,,,,,,,,,,,,,,,,=FT",
      "TTTTUTTTTTTTTTTT==........==.*.==............======*****************TTF.F,,,,,,,,,,,,,,,,,,,,=FT",
      "TTT================================================*****************TTF.FFFFFFFFFFFFFFFFFFFFFFFT",
      "TTT*==*=======================================================================================.T",
      "TTTUUUUUUUU.UUUUUUUUU..UUU..UUUUUUUUU.UUUUUU.==..UUUUUUU...U....UUU.UUU....UUU....UUUU.UU..UUUUT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"
    ],
    start: { x: 36, y: 34 },
    station: { x: 46, y: 15, name: "金包里客運站", shelter: { x: 47, y: 13 } },
    places: [
      { name: "海風國小（校門與操場）", x: 2, y: 8, w: 22, h: 11 },
      { name: "金包里客運站", x: 31, y: 11, w: 13, h: 5 },
      { name: "磺火漁港", x: 51, y: 2, w: 44, h: 9 },
      { name: "魚市場", x: 51, y: 11, w: 10, h: 6 },
      { name: "漁會", x: 63, y: 11, w: 9, h: 5 },
      { name: "海風溫泉", x: 76, y: 11, w: 18, h: 17 },
      { name: "金包里老街", x: 3, y: 19, w: 90, h: 17 },
      { name: "海風圖書館", x: 3, y: 36, w: 14, h: 10 },
      { name: "海風公園", x: 18, y: 36, w: 27, h: 18 },
      { name: "金包里慈護宮與廟埕", x: 46, y: 35, w: 25, h: 18 },
      { name: "地瓜田", x: 70, y: 39, w: 25, h: 16 },
      { name: "燭火雙岩", x: 86, y: 0, w: 6, h: 4 }
    ],
    landmarks: [
      { name: "金包里慈護宮", area: [50, 45, 21, 8], plaque: { x: 60.156, y: 39.375, w: 4.3, h: 1.05, text: "慈護宮" } }
    ],
    exits: [
      { x: 95, y: 11, to: "M06", tx: 1, ty: 15 },
      { x: 95, y: 12, to: "M06", tx: 1, ty: 16 },
      { x: 45, y: 59, to: "M02", tx: 43, ty: 1 },
      { x: 46, y: 59, to: "M02", tx: 44, ty: 1 },
      { x: 59, y: 43, to: "MT1", tx: 11, ty: 18 },
      { x: 60, y: 43, to: "MT1", tx: 12, ty: 18 },
      { x: 61, y: 43, to: "MT1", tx: 13, ty: 18 }
    ],
    npcs: [
      { id: "chief", x: 57, y: 47, sprite: "npc_chief", dialog: "D_CHIEF_IDLE", quest: "Q_TUT_1", quests: ["Q_TUT_1", "Q_LAMPS_3", "Q_LAMPS_MATH", "Q_LAMPS"] },
      { id: "bookstore", x: 12, y: 43, sprite: "npc_bookstore_m", dialog: "D_BOOK_IDLE", quest: "Q_SIDE_BOOK", quests: ["Q_SIDE_BOOK"] },
      { id: "shopkeeper", x: 31, y: 33, sprite: "npc_shopkeeper", dialog: "D_SHOP_IDLE", quest: null, quests: [] },
      { id: "innkeeper", x: 84, y: 16, sprite: "npc_innkeeper_m", dialog: "D_INN_IDLE", quest: "Q_TUT_3", quests: ["Q_TUT_3"] },
      { id: "fisher", x: 62, y: 9, sprite: "npc_fisher", dialog: "D_FISHER_IDLE", quest: "Q_TUT_2", quests: ["Q_TUT_2"] },
      { id: "seaweed_uncle", x: 16, y: 4, sprite: "npc_seaweed_uncle", dialog: "D_SEAWEED_IDLE", quest: "Q_N1_TIDE", quests: ["Q_N1_TIDE"] }
    ],
    roadsigns: [
      { id: "sign_m01_east", x: 92, y: 37, dialog: "D_SIGN_M01_EAST" }
    ],
    // v1.1 美人山眺望點（59 號 2.9.4）：老街南側、海風公園北邊的街邊（可以走的格子）
    viewpoints: [{ id: "meiren", x: 36, y: 35, image: "meiren_view", dialog: "D_MEIREN_VIEW", label: "美人山" }],
    lamps: [
      { subject: "國語", x: 19, y: 37 },
      { subject: "英語", x: 29, y: 37 },
      { subject: "數學", x: 43, y: 45 },
      { subject: "自然", x: 19, y: 45 },
      { subject: "社會", x: 29, y: 45 },
      { subject: "曙光", x: 33, y: 40 }   // v4.2 第六盞曙光燈（lamps['曙光']）：flags.ending_done 之前不顯示、不擋路
    ],
    chests: [
      { id: "C_M01_1", x: 20, y: 10, subject: "數學", level: 1, reward: { gold: 1, exp: 1, item: "herb" } },
      { id: "C_M01_2", x: 3, y: 7, subject: "數學", level: 1, reward: { gold: 1, exp: 1, item: null } },
      { id: "C_M01_3", x: 8, y: 49, subject: "數學", level: 1, reward: { gold: 1, exp: 1, item: "herb" } },
      { id: "C_M01_4", x: 77, y: 22, subject: "數學", level: 1, reward: { gold: 1, exp: 0, item: null } },
      { id: "C_M01_5", x: 94, y: 55, subject: "數學", level: 1, reward: { gold: 1, exp: 0, item: "herb" } },
      { id: "C_M01_6", x: 41, y: 5, subject: "數學", level: 1, reward: { gold: 1, exp: 0, item: "herb" } }
    ],
    spawns: [
      { monster: "fog_octopus", count: 1, area: [64, 2, 1, 1], boss: true, quest: "Q_MER_4" }
    ],
    inn: { npc: "innkeeper", price: 2, x: 84, y: 16, name: "金包里溫泉旅館", sign: "溫泉", freeIfBroke: true, dialog_nocoin: "D_INN_FREE", bath: { price: 1, label: "♨️ 泡溫泉" }, dialog_bath: "D_INN_JINBAOLI_BATH" },
    shop: { shop_id: "general", npc: "shopkeeper", x: 31, y: 33 },
    lights: [
      { x: 34, y: 49, r: 1 },
      { x: 4, y: 44, r: 1 },
      { x: 15, y: 44, r: 1 },
      { x: 51, y: 45, r: 1 },
      { x: 77, y: 20, r: 1 },
      { x: 83, y: 20, r: 1 },
      { x: 86, y: 20, r: 1 },
      { x: 77, y: 25, r: 1 },
      { x: 83, y: 25, r: 1 },
      { x: 86, y: 25, r: 1 },
      { x: 92, y: 25, r: 1 },
      { x: 91, y: 21, r: 0.8 },
      { x: 79, y: 15, r: 0.8 },
      { x: 81, y: 15, r: 0.8 },
      { x: 85, y: 15, r: 0.8 },
      { x: 87, y: 15, r: 0.8 },
      { x: 68, y: 8, r: 1.3 },
      { x: 84, y: 8, r: 1.3 },
      { x: 54, y: 9, r: 0.8 },
      { x: 4, y: 31, r: 0.8 },
      { x: 9, y: 31, r: 0.8 },
      { x: 17, y: 31, r: 0.8 },
      { x: 23, y: 31, r: 0.8 },
      { x: 29, y: 31, r: 0.8 },
      { x: 34, y: 31, r: 0.8 },
      { x: 36, y: 31, r: 0.8 },
      { x: 41, y: 31, r: 0.8 }
    ]
  },

  // ───────────────────────────── M02 擎天草原 ─────────────────────────────
  M02: {
    name: "擎天草原", type: "field", level: 1, bgm: "field", battle_bg: "grass", tileset: "field",
    real_ref: "陽明山擎天崗大草原（放牧水牛的草原）",
    art_note: "開闊的大草坡，中間一大圈木柵欄圍成的牧場，兩頭水牛在柵欄裡休息（'K'）；石板步道從北邊金包里一路往南，西邊岔路通往硫磺谷；遠方是低矮山稜線。",
    grid: [
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT####",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==.KKTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT####",
      "TTTTTTTTTTTTTTTTTTTTTTT**........***.......==UKK**.*******......******TTT*****.....*TT####",
      "TTTTTTTTTTTTTTTTTTTTTTT...*U.U...***.......==KKK.....****U........****...******.....TT####",
      "TTTTTTTTTTTTTTTTTTTTTTT....***..........UU.==........****........*******........UU..TT####",
      "TTTTTTTTTTTTTTTTTTTTTTTU.......UU......***.==.UUU.UU.*****.U......*******......U***UTT####",
      "TTTTTTTTTTTTTTTTTTTTTTTT.......**......***.==.**TTTT....*****........****......****TTT####",
      "TTTTTTTTTT....UUUUUUUUUU...................==..**TTT.................................T####",
      "TTTTTTTTT...UU*TTTTTTTT*......UU...........==..*****..FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF..####",
      "TTTTTTTTT...***TTTTTTT*.......**.....*.....==..****..FF...........................FFF.####",
      "TTTTTTTTT.....TTTTTTTT............U.U***...==...***FFF......................**..*...FF####",
      "TTTTTTTTTUUUUUTTTTTTTTUU.UUUU.....*****....==......F....U...............%~~~~~~~%....F####",
      "TTTTTTTTTTUTTTTTTTTTTTTT*****..............==......F.U.***..UUUU........%*~~~~~~~%...F####",
      "TTTTTTTTTUUTTTTTTTTTT......................==....UUF.*****..KKKK........%%%%~~~~~UUU*F####",
      "TTTTTTTTTUUTTTTTTTTTT..UUU.........*....=====...***F..***...................%%%%%***.F####",
      "TTTTTTTTTUUTTTTTTTTTTU.***........*.....=====...***F......*.............UUUU.........F####",
      "TTTTTTTTTUUTTTTTTTTTTT........U.UUU.....===.....***F....................KKKK.........F####",
      "TTTT....*...TTTTTTTTTT.......******.....===...UU...F....F...............K............F####",
      "TT............***...**.................U===...TT========F............UU..............F####",
      "T......................................K===.....========F.....UUU...****.............F####",
      "===========================================........F....F.....KKK.................UU.F####",
      "===========================================...UU...F..............................***F####",
      "TUU.............................U.......===..TTT**.F.......UU................KKKKK...F####",
      "TTTT..UUUUU......UU...........****......===..TTT**.FF..**..***...............KKKKK..FF####",
      "TTT...*UUUU.....*****...................===.UTTTTT..FF.............................FF*####",
      "TTTU.******.....****...........UUUUUUUU.===.TTTTTTT..FFFFFFFFFFFFF===FFFFFFFFFFFFFFFF*####",
      "TTTTTTT.......UU*.........U.TTTTRRRRRRT.===.*TTTT**......**.......===...***.........**####",
      "TTTTTTTU.....****.......UUUUTTTTKKKKKKT.===..TTTT**U*..U***U......===..U****......****####",
      "TTTTTTTTTTU............TTTTTTTTTKKKKKKT.===..TTTT***U..*****......===.*****.........**####",
      "TTTTTTTTTTT........UUU....==....*.......===....*...**....***......===.................####",
      "TTTTTTTTTT.***.....***....BB.UU....UUUU.===.......................===..........*UU*...####",
      "TTTTTTTT......**......*~~~BB~*~....****.===....UUU...............F===F..UU...U..**U.U*####",
      "TTTTTTTT....UU..UU*..~~~~~BB~~~~........===...UUTT........%~~~~~~~BBB~~~~~~~~~~~~~~~~~####",
      "TTTTTTT....**...**..~~~~~~BB~~~~~.......===..TTT.*.......~%~~~~~~~BBB~~~~~~~~~~~~~~~~~####",
      "TTTT*.....*......*..~~~~~~~~~~~~~U....*.===...........~~~~%~*....FBBBF.***~~~~~~~~~~~~####",
      "TTTT..UU**.....U**....*~~~~~~~~~~*....*FFBBF......*~~~~~..........===..*****...*.*.~~*####",
      "TTTT,,**,,,*,,,***....*~~~~~~~~~~~....*FFBBF~~~~~~~~~~~............UU.....*..........*####",
      "TTTTU,,,,,,,,,,,,,......~~~~~**~~~~~~~~FFBBF..*TT*****.............TT........U.......*####",
      "TTT,*U,,,,,,,,,,,,.......~~~~**.........===....TT******........UU......UUU..U*T......*####",
      "TTT,,*,,,,,,,,,,,,...*............*.U...===.......****.......UTTTU....TTUU****TU.......###",
      "TTT,,,,,,,,,,,,,,,,,,,......**UU*..***..===.UUUU...........TTU***UU.....****TTTT....U*####",
      "TT.,,,,,,,,,,,,,,,,,,,........**.....***===.FUUTT............******.........TTT...UU**####",
      "TTT,,,,,,,,,,,,,**,,,,........**.....***===.FFFF..............****.....UT.........TT**####",
      "TTT,,,,,,,,,,,,,,,,,,,.*U......***FFFFFF===.BBBF....................UUUU..............####",
      "TTT*,,,,,,,,,,,,,,,,,,..**....***.FBBBBBBBBB.UBF...................*****.......UUU..**####",
      "TTT,,,,,,,,,,,,,,,,,**,,,,,,,,....FB.UBBBUBBFFFF..............................*****...####",
      "TTTU*,,,,,,,,,,,,,,,,,,,,,,,,,....FFFFFFFKF#####...........UU.....................*...####",
      "TTTTUU.U.UUUU,,,,,,,,,,,......###################.........***............UUU..........####",
      "TTTTTTTTTTTTTUUUUUUUU.U.UU...UTTTT##############*..UUU.....TT...TTU.U..****TU....U..**####",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT##############UUTTTT.UUUTTTU.TTTTTT....*TTTT..***UTT####",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT##############TTTTTTTTTTTTTTTTTTTTTUU.UUTTTTTTTTTTTT####",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT##############TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT####",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT##############TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT####",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT##############TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT####"
    ],
    start: { x: 44, y: 3 },
    exits: [
      { x: 43, y: 0, to: "M01", tx: 45, ty: 58 },
      { x: 44, y: 0, to: "M01", tx: 46, ty: 58 },
      { x: 0, y: 20, to: "M03", tx: 82, ty: 18 },
      { x: 0, y: 21, to: "M03", tx: 82, ty: 19 }
    ],
    npcs: [
      { id: "potato_seller", x: 48, y: 3, sprite: "npc_uncle_yam", dialog: "D_POTATO_IDLE", quest: "Q_SIDE_POTATO", quests: ["Q_SIDE_POTATO"] },
      { id: "park_ranger", x: 49, y: 17, sprite: "npc_park_ranger", dialog: "D_RANGER_IDLE", quest: "Q_N1_BUFFALO", quests: ["Q_N1_BUFFALO"] }
    ],
    chests: [
      { id: "C_M02_1", x: 8, y: 46, subject: "數學", level: 1, reward: { gold: 1, exp: 1, item: null } },
      { id: "C_M02_2", x: 82, y: 3, subject: "數學", level: 1, reward: { gold: 1, exp: 1, item: "eraser" } },
      { id: "C_M02_3", x: 27, y: 33, subject: "數學", level: 1, reward: { gold: 1, exp: 1, item: "herb" } },
      { id: "C_M02_4", x: 11, y: 9, subject: "數學", level: 1, reward: { gold: 1, exp: 0, item: "snack" } },
      { id: "C_M02_5", x: 84, y: 46, subject: "數學", level: 1, reward: { gold: 1, exp: 0, item: null } }
    ],
    spawns: [
      { monster: "dango", count: 3, area: [20, 2, 22, 14] },
      { monster: "dango", count: 2, area: [3, 34, 18, 13] },
      { monster: "rabbit", count: 3, area: [58, 37, 27, 12] },
      { monster: "rabbit", count: 2, area: [52, 9, 32, 15] },
      { monster: "dango", count: 2, area: [44, 37, 15, 11] }
    ],
    inn: null,
    shop: null,
    animals: [
      { id: "buffalo_1", sprite: "npc_buffalo", area: [53, 14, 16, 10], count: 3, name: "水牛" },
      { id: "buffalo_2", sprite: "npc_buffalo", area: [69, 15, 15, 9], count: 2, name: "水牛" }
    ]
  },

  // ───────────────────────────── M03 硫磺谷 ─────────────────────────────
  M03: {
    name: "硫磺谷", type: "field", level: 2, bgm: "field", battle_bg: "rock", tileset: "field",
    real_ref: "陽明山小油坑一帶（噴氣孔、硫磺結晶、溫泉溪）",
    art_note: "光禿禿的火山谷，'*' 是冒白煙的噴氣孔岩堆（畫黃色硫磺結晶），'~' 是冒熱氣的溫泉池與熱水溪，'%' 是灰白泥地；石板步道繞一圈，中間木橋跨過熱水溪。東邊回擎天草原。",
    grid: [
      "####################################################################################",
      "*,,,,,,......*.......TTT*TTTTTTTTTTT...~~~~~*TTTTTTT.*******TTTTTT....*...*****.***#",
      "*,,,,,,UU..U*.**......TT*TTTTTT..TTTT.*~~~~~*TTTT.....FFFFFFF....*..UU*UU..**...*..#",
      "*,,,,,,**..*.....UUUU...TTTTTTT....UU..**~~~*...======FBBBBBF====..U******....UUUU.#",
      "*,,,,,,,,........****......UTU...UUTTTTTTT~~..UU==*..UFFBBFFFU.*.=.*.**......U****U#",
      "*,,,,,,,,,*U..=================.TTTTTTTTTT~~.***==.U**FFBBFFF*U..==......*...******#",
      "*,,,.U,,,,.*..==*.....T......==UTTTTTTTTTT~~....==.**........**U..=..UU...*........#",
      "*,,,**,,,,....==..UU.....UU..==TTTTTTTTTTT~~UUU*==.**U....UU..**..=.****...*UU..U..#",
      "*,,,,,,,,,....==.U**U...U**U.==TTTTTTTTTTT~~TTT.==.***.U..**U...**=..**...*.**.U*..#",
      "*,,,,,,,,,....==.****UUU****.==TTTTTTTTTTT~~TTT.==.***~~~****~....=.*.........U****#",
      "*,,,,UU,,,**..==.....~~~.....==.TTTTTTTTTT~~TTT.==***~~~~~~~~~~UU.============*****#",
      "*,,,,***,,....==......~......==*TTTTTTTTTT~~TTTT==.**~**~~~~~~***.=...UU.UUUU.*****#",
      "*,,,,,,,,,,,,,==.UUUU...UUUU==..TT.TTT....~~..**==....**~~~~~****.=.UUTTURRRRURRTTT#",
      "*U.,,,,,,,,,,,==.****...****==.UTT....U.==========**..*~~~~~~*****=UTUTTRRRRRRRRTTT#",
      "***,,,,,,,,,,,==............==.TTT....**==========..UU*~~~~******.=TTTTTRRRRRRRRTTT#",
      "***FFFFFFFFF..=============BBBB=========.....UU.==.U****~~~.****..=.***KHHHHHHH***T#",
      "***FBKBBBBBF..=============BBBB==========.U*.TT.==.********.****..=.***KHHHHHHH*KKT#",
      "***FBKBBBBBF...............FFFF..........**.....==*...*.**..*.*.*.=.***.HHHHHHH.K.T#",
      "***FUBBBBBBB==...*.UU......*~~*....UU....**U..UU.===================================",
      "***FKBBBBBBB==.....**UU....*~~*.*.TUU*.******.**..==================================",
      "***FBBBBBBBB==.......***...*~~*..TTTT*...*.***.....UU....*==...*..........**.......#",
      "***FBUBBBBBF...UUUUU.......*~~*.........~~...UU....TT.U...==UUU..UU.**.U.......U...#",
      "***FBKBBBBBF..TUUTUT.......~~~~.U~~~~~~.~~..UTTU.TTTTU**.===UUTUUT....**UU.UUU.**U.#",
      "*****,,,,,.***.TTT.,,,..UU~~~*...~~~~~~*..,.**TTTTTTTT*..===***TTTT....*UTUUTTU***U#",
      "*******U,,,,,....*,,,,.~~~~~*.*..*~~~~*..U*************U*==,,,*TTTTT..***.*********#",
      "****U,,TUUU.,,.=========================.****TTT*....****==,,,.TTTT....**...*******#",
      "*****,TTTTTT,,.==....UUUU...==...UUU.....***.TTT..UU.***.==UU.T......U...T*..**TTTT#",
      "*****,,TTTTT,,.==*.KURRRR..U==.*UTTTU.T..***.*T...**U*...==TUT..U.*.U**U....U..TTTT#",
      "*****,,TTTTT,,.==...RRRRR..*==..UTTTT..*............**UUU==TT.UU**..****U.***U.TTTT#",
      "*****UU,,,,*...==..KTUUUT...==..TTTTT......U*..UU.******.==*.*****...****U..**U**TT#",
      "****,**,,UU..*.==...TKK.T*..==...TTTTU.....*.*~~~~..*****==.........U~~~~*~*~~~~*TT#",
      "****,,,,U***...==*..TKK.T.U.==...*TTTTU......*~~~~.......==.UU..UUUUT~~~*****~~*TTT#",
      "****,,,,****.*.==.........T.==***.TTTTU...**.*....*UU..*.==U**U.TTTTTT*******..*TTT#",
      "*****,,,,,,,...==.*.U~~~U...==..UUTTTTT.........UU~~***..==*****TTTTTT******TT..TT*#",
      "****,,,,*,,,*..==...*~~~*..U==.TTTTTTTT...**....*~~~***..==......TTTTT**.==.T...***#",
      "****,,,,,,,,,..==*U.*....***==.TTTT*T..*..====..*~~~.....==TT...T.TTT.FFFBBFFFF..**#",
      "*****,,,,,,,,,,==.*.*..*....==.TTTT*..*...====.**..TT..**==..UTU..,,,.FBBBBBBBF.U.*#",
      "*****..UUU,,,,,============BBBB==========....=...........==*.TTT..**,.FBBBBBUBF.*.*#",
      "***..U*****,,,,============BBBB==========*UU.==============.*....*..*.FBKBBBKBF..U*#",
      "****U*****..,,,.....,......FFFF...........**....**....*..=============FFFBBFFFF.U**#",
      "*****..,,,*.,,,...**.......*~~~..UUUUUU....*U......U....*=============...BB.....*.T#",
      "*****UU.,,,,,,,......UUU*..*~~~...TUUUT...***.UU,,U*UU..*==U....**......*.........T#",
      "********,,,,,..UUUUU.***..**~~~..TTTTTT.~*******U,TTTTUU.==UU**T..UUUUU...*UU.....T#",
      "********,,,,..TTTTTT,,,,...*~~~.......*~~****TTTTUTTTT**U==TT***UUTTT**UU*****U****#",
      "***,,,,,,,,*U.TTTTTT,,,,...*~~~U....~~~~~****TTTTTTTTT***==*****TTTTT**************#",
      "***U*,,,,,,.*UTTTTT,,,,,...*~~~*..U~~~~~~****TTTTTTTTT***==*****TTTT***************#",
      "****UU,,,,,,***TTTT,,,,,U.~~~~~*...~~~~~~*****TTTTTTTTTT*==*****TTTT***************#",
      "#########################################################==#########################"
    ],
    start: { x: 81, y: 19 },
    exits: [
      { x: 83, y: 18, to: "M02", tx: 1, ty: 20 },
      { x: 83, y: 19, to: "M02", tx: 1, ty: 21 },
      { x: 57, y: 47, to: "M46", tx: 41, ty: 1 },
      { x: 58, y: 47, to: "M46", tx: 42, ty: 1 }
    ],
    npcs: [
      { id: "hiker", x: 79, y: 17, sprite: "npc_fisher", dialog: "D_HIKER_IDLE", quest: "Q_YM_1", quests: ["Q_YM_1", "Q_SIDE_STEAM"] }
    ],
    chests: [
      { id: "C_M03_1", x: 81, y: 6, subject: "數學", level: 2, reward: { gold: 1, exp: 1, item: null } },
      { id: "C_M03_2", x: 80, y: 41, subject: "數學", level: 2, reward: { gold: 1, exp: 1, item: "guide" } },
      { id: "C_M03_3", x: 3, y: 5, subject: "數學", level: 2, reward: { gold: 1, exp: 1, item: "herb" } },
      { id: "C_M03_4", x: 24, y: 10, subject: "數學", level: 2, reward: { gold: 1, exp: 0, item: null } },
      { id: "C_M03_5", x: 24, y: 44, subject: "數學", level: 2, reward: { gold: 1, exp: 0, item: "eraser" } }
    ],
    spawns: [
      { monster: "mushroom", count: 3, area: [16, 6, 13, 9] },
      { monster: "rabbit", count: 2, area: [1, 1, 13, 14] },
      { monster: "mushroom", count: 1, area: [42, 24, 15, 14] },
      { monster: "gt_sulfur", count: 2, area: [63, 33, 20, 9] },
      { monster: "mushroom", count: 2, area: [67, 1, 15, 9] }
    ],
    inn: null,
    shop: null
  },

  // ───────────────────────────── M04 神木森林（精靈族）─────────────────────────────
  M04: {
    "name": "神木森林",
    "type": "tribe",
    "level": 5,
    "bgm": "elf",
    "battle_bg": "forest",
    "tileset": "forest",
    "real_ref": "嘉義阿里山森林（巨木群、森林小火車）",
    "art_note": "高大的檜木林。最北邊是一棵巨大的千年神木（'K'），周圍是花草圍成的空地；左右各有精靈樹屋；中段是密林小徑；最南邊是森林小火車的小車站與月台。",
    "grid": [
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT..T......TTTTTTTTTT...T..TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT..T.*....TTTTTTTTTTTT.....TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTHTTTTTTTTTTTTTTHTTTTTTT....UU..UTTTTTTTTTTUUUUU....**TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTSTTTTTTTTTTTTTTSTTTTTTT....TU..TTTTTTTTTTKKKTTT.....TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTSTTTTTTTTTTTTTTSTTTTTTT*...TT...TTTTTTTTTKKK........TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTSTTTTTTTTTTTTTTSTTTTTTT..U.......TTTTTTTTKKK....U...TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTT==TTTTTTTTTTTTT==TTTTTT*T*..U........===..KKK..**...TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTT==.TTTTTTTTTTTT==TTTTTT..T.UU..U.....===........TU=====U=======TT==UU=UU=UU==UTTTTT",
      "TT===========================T....TT..*.....===........TT*=========U==U========U=====TTTTT",
      "TT============================..............===..KKK...TTUUUUUUUUUUTUUTUUUUUUUUTUUU==TTTTT",
      "TTUUUUUUUUUUUU==....U.UUUU..===================........TTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTT",
      "TTTTTTTTTTTTT.==TTTTTTTTTTTT===================UUUUUUUUTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTT",
      "TTTTTTTTTTTTTT==TTTTTTTTTTTTUUUUUU....**.UUU===TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTT",
      "TTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTTT....***TTT===TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTT",
      "TTTTTTTHTTTTTT==TTTTTTHTTTTTTTTTTT*....**TTT===TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTT",
      "TTTTTTTSTTTTTT==TTTTTTSTTTTTTTTTTTUUU..**TTT===TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTT",
      "TTTTTTTSTTTTTT==TTTTTTSTTTTTTTTTTTUUUUU**TTT===TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTT",
      "TTTTTTTSTTTTTT==TTTTTTSTTTTTTTTTTTTTTT.**TTT===TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTT",
      "TTTTTTT==TTTTT==TTTTTT==TTTTTTT**TTTT..*TTTT===TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTT",
      "============================TTTT.TTT...*TTTT===TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTT",
      "=============================TTT..****.*TTTT===TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTT",
      "=============================TTT..****.*TTTT===TTTTTTTTTTTTTTTTTTTTTTTT.....T..**T.==TTTTT",
      "TTTKUUUUUUUU......UUUUUUUUUK.TTT..****.*TTTT===TTTTTTTTTTTTTTTTTTTTTTTT........**..==TTTTT",
      "TTT.KKKKKKKK......KKKK=KKKK.UTTT.......*TTTT===TTTTTTTTTTTTTTTTTTTTTTT.U*..........==TTTTT",
      "TTT.KKKKKKKK......KKKKKKKKK.UTTT....**.*TTTT===TTTTTTTTTTTTTTTTTTTTTTT.*..........========",
      "TTT.........................UTTTT*TTTTT*TTTT===TTTTTTTTTTTTTTTTTTTTTTT.......TUUU.========",
      "TTTUUUUUUUUU......UUUUUUUUU.UTTTTTTTTTTTTTTT===TTTTTTTTTTTTTTTTTTTTTTT....*U.*TTUUUUU..TTT",
      "TTTKKKKKKKKK......KKKKKKKKK.UTTTTTTTTTTTTTTT===TTTTTTTTTTTTTTTTTTTTTT.U..UU*..T*TTTTTU.TTT",
      "TTTKKKKKKKKK*.....KKKKKKKKK.UTTTTTTTTTTTTTTT===TTTTTTTTTTTTTTTTTTTTT..**.***....T*TTTT.TTT",
      "TTT*.*.TT..TTT..TTT...KKTTTTUTTTTTTTTTTTTTTT===TTTTTTTTTTTTTTTTTTTT...**.....TTUUUTTTTUTTT",
      "TTT*.............*........**UTTTTTTTTTTTTTTT===TTTTTTTTTTTTTTTTTTTTU........****TTTTTTTTTT",
      "TTT.UUUUUUU.......UUUUUUUUU.UTTTTTTTTTTTTTTT===TTTTTTTTTTTTTTTTTTT**U====U***TTTTTTTTTTTTT",
      "TTTUKKKKKKKT......KKKKKKKKK.KTTTTTTTTTTTTTTT===TTTTTTTTTTTTTTTTTTT**T====T***TTTTTTTTTTTTT",
      "TTTUKKKKKKKTU....UKKKKKKKKKKKTTTTTTTTTTTTTTT===TTTTTTTTTTTTTTTTTTTTTTFBBFTTTTTTTTTTTTTTTTT",
      "TTTT.**..*.TT...TT*...*...KK*TTTTTTTTTTTTTTT===######################FBBF################T",
      "TTT*=========================TTTTTTTTTTTTTTT===######################FBBF################T",
      "TTTT..UU...UU.==.......U....UTTTTTTTTTTTTTTT===######################FBBF################T",
      "TTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTTTT===~~~~~~~~~~~~~~~~~~~~~~FBBF~~~~~~~~~~~~~TTTT",
      "TTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTTTT===~~~~~~~~~~~~~~~~~~~~~~FBBF~~~~~~~~~~~~~TTTT",
      "TTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTTTT===~~~~~~~~~~~~~~~~~~~~~~FBBF~~~~~~~~~~~~~TTTT",
      "TTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTRRRRRRRRRRRT===~~~~~~~~~~~~~~~~~~~~~~FBBF~~~~~~~~~~~~~TTTT",
      "TTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTRRRRRRRRRRRT===######################FBBF#############TTTT",
      "TTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTRRRRRRRRRRRT===###########TTT########FBBF#############TTTT",
      "TTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTRRRRRRRRRRRT===TT****....TTTT...******==..************TTTT",
      "TTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTHHHHHHHHHHHT===TT****....TTTT....*****==..************TTTT",
      "TTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTHHHHHHHHHHHT===TT****....TTT...UUU**TT==.U******TT****TTTT",
      "TTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTHHHHHHHHHHHT===TT*..**UU......******TTU..T******TT****TTTT",
      "TTTTTTTTTTTTTT==================KKKK=KKKK=K====.....*.**.....*******TTU*U*.*...*TT*.**TTTT",
      "TTTKTTTTTTTTTT===============U=================..............*******TTT***....**....**TTTT",
      "TTTKKKKKKKKKKKUUUUU==========KKKFFFFFFFFFFFF===FF..............****..*...*.....*....**TTTT",
      "TTTKKKKKKKKKKKKKKKKBBBBBBBBBBBBKKBBBBBBBBBBBBBB.......................................TTTT",
      "TTTTKKKKKKKKKKKKKKKBBBBBBBBBBBBBBBBBBBBBBBBB==BB######################################TTTT",
      "TTTTTTTTTTTTTTTTTTTK########################==##TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTT#########################==#*TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"
    ],
    "start": {
      "x": 34,
      "y": 53
    },
    "station": {
      "x": 30,
      "y": 53,
      "name": "神木森林站",
      "shelter": {
        "x": 27,
        "y": 52
      }
    },
    "exits": [
      {
        "x": 44,
        "y": 59,
        "to": "M10",
        "tx": 82,
        "ty": 16
      },
      {
        "x": 45,
        "y": 59,
        "to": "M10",
        "tx": 82,
        "ty": 17
      },
      {
        "x": 0,
        "y": 22,
        "to": "M20",
        "tx": 70,
        "ty": 55
      },
      {
        "x": 0,
        "y": 23,
        "to": "M20",
        "tx": 71,
        "ty": 55
      },
      {
        "x": 0,
        "y": 24,
        "to": "M20",
        "tx": 72,
        "ty": 55
      },
      {
        "x": 89,
        "y": 27,
        "to": "M33",
        "tx": 1,
        "ty": 22,
        "requires": "Q_XT_4",
        "requires_dialog": "D_EXIT_LOCK_XT"
      },
      {
        "x": 89,
        "y": 28,
        "to": "M33",
        "tx": 1,
        "ty": 23,
        "requires": "Q_XT_4",
        "requires_dialog": "D_EXIT_LOCK_XT"
      }
    ],
    "npcs": [
      {
        "id": "elf_elder",
        "x": 8,
        "y": 9,
        "sprite": "npc_elf_elder",
        "dialog": "D_ELDER_IDLE",
        "quest": "Q_ELF_1",
        "quests": [
          "Q_ELF_1",
          "Q_ELF_3",
          "Q_ELF_4"
        ]
      },
      {
        "id": "elf_kid",
        "x": 15,
        "y": 42,
        "sprite": "npc_elf_kid",
        "dialog": "D_ELFKID_IDLE",
        "quest": "Q_ELF_2",
        "quests": [
          "Q_ELF_2"
        ]
      },
      {
        "id": "elf_kid_lost",
        "x": 76,
        "y": 28,
        "sprite": "npc_elf_kid",
        "dialog": "D_LOST_IDLE",
        "quest": "Q_SIDE_LOST",
        "quests": [
          "Q_SIDE_LOST"
        ]
      },
      {
        "id": "forest_rail",
        "x": 37,
        "y": 54,
        "sprite": "npc_forest_rail",
        "dialog": "D_FORESTRAIL_IDLE",
        "quest": "Q_AL_1",
        "quests": [
          "Q_AL_1"
        ]
      }
    ],
    "roadsigns": [],
    "chests": [
      {
        "id": "C_M04_1",
        "x": 28,
        "y": 12,
        "subject": "數學",
        "level": 3,
        "reward": {
          "gold": 6,
          "exp": 7,
          "item": null
        }
      },
      {
        "id": "C_M04_2",
        "x": 2,
        "y": 11,
        "subject": "數學",
        "level": 3,
        "reward": {
          "gold": 6,
          "exp": 7,
          "item": "herb"
        }
      },
      {
        "id": "C_M04_3",
        "x": 53,
        "y": 4,
        "subject": "數學",
        "level": 3,
        "reward": {
          "gold": 6,
          "exp": 7,
          "item": "herb"
        }
      },
      {
        "id": "C_M04_4",
        "x": 81,
        "y": 26,
        "subject": "數學",
        "level": 3,
        "reward": {
          "gold": 7,
          "exp": 7,
          "item": null
        }
      },
      {
        "id": "C_M04_5",
        "x": 85,
        "y": 53,
        "subject": "數學",
        "level": 3,
        "reward": {
          "gold": 7,
          "exp": 7,
          "item": "eraser"
        }
      }
    ],
    "spawns": [
      {
        "monster": "mushroom",
        "count": 2,
        "area": [
          3,
          38,
          27,
          15
        ]
      },
      {
        "monster": "owl",
        "count": 2,
        "area": [
          30,
          13,
          14,
          16
        ]
      },
      {
        "monster": "al_cypress",
        "count": 3,
        "area": [
          57,
          8,
          30,
          19
        ]
      },
      {
        "monster": "al_cloud",
        "count": 3,
        "area": [
          47,
          46,
          40,
          10
        ]
      },
      {
        "monster": "tree_king",
        "count": 1,
        "area": [
          45,
          9,
          1,
          1
        ],
        "boss": true,
        "quest": "Q_ELF_4"
      }
    ],
    "inn": {
      "npc": null,
      "price": 18,
      "x": 23,
      "y": 9,
      "name": "神木樹屋旅店",
      "sign": "樹屋",
      "dialog": "D_INN_SHENMU",
      "dialog_nocoin": "D_INN_SHENMU_NOCOIN"
    },
    "shop": null,
    "lights": [
      {
        "x": 5,
        "y": 4,
        "r": 1.2
      },
      {
        "x": 9,
        "y": 4,
        "r": 1.2
      },
      {
        "x": 20,
        "y": 4,
        "r": 1.2
      },
      {
        "x": 24,
        "y": 4,
        "r": 1.2
      },
      {
        "x": 5,
        "y": 16,
        "r": 1.2
      },
      {
        "x": 9,
        "y": 16,
        "r": 1.2
      },
      {
        "x": 4,
        "y": 19,
        "r": 1.2
      },
      {
        "x": 19,
        "y": 16,
        "r": 1.2
      },
      {
        "x": 24,
        "y": 16,
        "r": 1.2
      },
      {
        "x": 3,
        "y": 25,
        "r": 1.2
      },
      {
        "x": 27,
        "y": 25,
        "r": 1.2
      },
      {
        "x": 28,
        "y": 35,
        "r": 1.2
      },
      {
        "x": 7,
        "y": 26,
        "r": 1.2
      },
      {
        "x": 18,
        "y": 26,
        "r": 1.2
      },
      {
        "x": 9,
        "y": 35,
        "r": 1.2
      },
      {
        "x": 20,
        "y": 35,
        "r": 1.2
      },
      {
        "x": 31,
        "y": 49,
        "r": 1.2
      },
      {
        "x": 34,
        "y": 48,
        "r": 1.2
      },
      {
        "x": 39,
        "y": 48,
        "r": 1.2
      },
      {
        "x": 3,
        "y": 52,
        "r": 1.2
      }
    ]
  },

  // ───────────────────────────── M05 紅樹林濕地（地精族）─────────────────────────────
  M05: {
    name: "紅樹林濕地", type: "field", level: 4, bgm: "swamp", battle_bg: "swamp", tileset: "swamp",
    real_ref: "臺北市北投區關渡",
    art_note: "大片泥灘（'%'）上長著一叢叢紅樹林（'T'），中間一條寬河道（'~'）；一條木棧道（'B'）南北穿過河道；東北角乾地上是地精的小工坊；西南泥灘是泥巴大蛙的地盤；最南邊是濕地站月台。",
    grid: [
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTT~~FFFFFFFFFFFFFFFFFFFFFFFFFFF%TTT%%%TT%%TTTUTT%,,,,,,TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTT~~FBBBBBBBBBBBBBBBBBBBBBBBBBF%TTT%%%%%%%%%%UTTT,,,,,,RRRRRRRRRTTTRRRRRRRRTTTRRRRRRRRTTT",
      "TTT~~FBBBBBBBBBBBBBBBBBBBBBBBBBF%TTT%%%%%%%%%%TTTT,,,~,,RRRRRRRRRTTTRRRRRRRRTTTRRRRRRRRTTT",
      "TT~~~FBBFFFFFFFFFFFFFFFFFFFFFBBF%%%%%%%%%%%%%%%TUU,,UUU,RRRRRRRRRTTTRRRRRRRRTTTRRRRRRRRTTT",
      "T~~~~FBBF~TT~~~~~RRRRRRRTTT~FBBF%%%%%%%%%%%%%%%UTT,,UUU,HHHHHHHHHTTTHHHHHHHHTTTHHHHHHHHTTT",
      "TT~~~FBBFTTT~~~~~RRRRRRRTTT~FBBF%%%%%%%%%%%%%%%UTT,,TTTKHHHHHHHHHTTTHHHHHHHHK,KHHHHHHHHTTT",
      "TT~~~FBBFTTT~~~~~HHHHHHH~~~~FBBF%%%UU%%%%%%%%%%TTT,,TTT,HHHHHHHHH,,,HHHHHHHHK,KHHHHHHHHTTT",
      "T~~T~FBBF~~~~~~~~TTTKUBT~~~~FBBF%%%UUU%%%%%%%%%%UU,,===================================TTT",
      "T~~TTFBBF~~~~~~~~FFFBBFF~~~~FBBF%%%TTT%%%%FBBF%UUU,,========KKKKKKKK====KUUUU=====UUU==TTT",
      "T~~TTFBBF~~~~~~~~TTFBBF~~~~~FBBF%%%%TT%%%%FBBF%TTT,,,UUU**==KKKKKKKK=KKKK==KKKK===TTT==TTT",
      "T~~TTFBBF~~~~~~~~TTFBBF~~~~~FBBF%%%%%%%%%%FBBF%%T%,,,TTT**==KKKKKKKK=KKKKKKKKKKK==TTTRRRRT",
      "T~~FFFBBFFFFFFFFFFFFBBFFFFFFFBBFFFFFFFFFFFFBBFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFRRRRT",
      "T~~FBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBKKKKT",
      "T~~FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFBBFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFKKKKT",
      "T*****************************************FBBF***************************************KKKKT",
      "T~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~FBBF~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~KKKKT",
      "T~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~FBBF~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~T",
      "T~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~FBBF~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~T",
      "T~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~FBBF~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~T",
      "T~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~FBBF~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~T",
      "TTT~~TTT~~~~~~~~~~~~~~~~~~~TTTT~~~~~~~~~~~FBBF~TTTT~~TTT~~~~~~~~TT~~~~~~~~~TTTT~~~~~~~TTTT",
      "TTTTTTTT~~~~T~~~~~~~~T~~~~~TTTT~~~~~~~~~~~FBBF~TTTT~~TTT~~~T~~~TTTT~~~T~~~~TTTT~~~~~T~TTTT",
      "TTT~~~~~~~~TTTTT~~~~~T~~~T~TTT~~~~~~TTT~~~FBBF~TTTT~~TTT~~~T~~~TTTT~~~T~~~~TTTT~~~~~T~TTTT",
      "TTT~~~~~~~~TTTTT~~~~~TTTTT~~~~~~~~~~TTTT~~FBBF~TTTT~~~~~~T~T~~~TTTT~~TTTTTT~TT~~T~~~T~~TTT",
      "TT~~~TT~~~~TTTTT~~~~~TTTTT~~~~~~~~~~TTTT~~FBBF~TTT~~~~~~TTTTTT~~~~~~~TTTTTT~~~~TTT~~~~~~TT",
      "TTTTTTT~~~~~~TT~~T~~~TTTTT~~~~~~~~~~~TTT~TFBBF~TTT~TT~~~TTTTTTTT~~~~~TTTTTT~~~~TTT~~~TTTTT",
      "TTTT~TTT~~~~~~~TTTT~~TTTT~~~~~~~~~~~TTT~TTFBBFTTTT~TTTT~~TTTTTTTTTT~T~TTTTT~~T~TTT~TTTT~TT",
      "T~TTTTTTTT~~~TTTTTT~T~TT~~~~T~~~~~~TTTTTTTFBBFTTT~TTTTT~~~~~~~TTTTT~T~~~~~~TTT~~~~~TTTTTTT",
      "TTTTTTTTTT~TTTTTTTTTTTTTTTTTT~~T~~~TTTTTTTFBBFTTT~TTTTT~~~~~~TTTTTT~T~~~~~TTTT~~~~~TTTTTTT",
      "TTTTTTTTTT~TTTT~TTTTTTTTTTTTTTTTT~~TTTTTTTFBBFTFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFT",
      "TTTTTTTTTT~TTTT~TT~TTTT~TTTTTTTTT~~TTTTTTTFBBFTFBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBFT",
      "TTTTTT~~~~~TTT~~TT~TTT~~T~~TTTTTT~~TTTTTTTFBBFTFFFFFFFFFFFFFFFFFFFFFFFBBFFFFFFFFFFFFFFFFFT",
      "TTTFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFBBFFFF%T%%T%T%%%%T%%T%%T%TFBBF%%%%T%%T%%%%T%%TT",
      "TTT%BBBBBBBBBBUUUUUUUUUUUUUUUUBBBBBBBBBBBBBBBBBB%%%%%%%%%%%%%%%%%%%%%FBBF%%%%%%%%%%%%%%%%T",
      "TT%%FFFFFFFFFFFBBFFFFFFFFFFFFFFFFFFFFFFFFFFBBFFFF%%%%%%%%%U%%%%%%%%%%FBBF%%%%UU%%%%%%%%%%T",
      "TT%%%%%%%%%%%%FBBFT%U%%%%%%TTT%%%%T%%%%%%%FBBF%%TT%%%%%%UUU%%%%%%%%%%%BB%%%%%UUU%%%%%%%%%T",
      "TTU%%~TT%%%%%UFBBF%%T%%%%%%%%UU%%UTU%%%%%%FBBF%UUUU%%%%%UTTT%%%%%%%%%%BB%%%%%TTT%%%%%%%%%T",
      "TTT%%~~~~%%%%UFBBB%%~~~~~%%%TTU%%TTT%%%%%%FBBF%UUUU%%%%%TTT%%%%%%%%%%%%%%%%%%%%%%%%%%%%%BB",
      "TTT%%~~~~~%%%TUU%UU%~~~~~~%UTTT%%%%%%%%%%%FBBF%TTTTU%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%BB",
      "TTU%%%%%%~~%UTUTUUU%%TT~~%%TTTT%%%%%%%%%%%FBBF%%%%%U%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%UT%%%TT",
      "TUU%%%UU%%%UTTTTTTT%%%%%%%%%TT%%%RRRRRRRRRRBBF%%%%%T%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%T%%%%%T",
      "TTT%%%UU%%%%%TTTTTT%%%%%%%~%%%%%%RRRRRRRRRRBBF%U%U%%%%%%%%%%%%%%%%%UU%%%%%%%%%%%%%%%%%%%UT",
      "T%%%%~TT~~TT%%%%%%%%%%~T~~~%%%%UURRRRRRRRRRBBF%UUU%%%%%%%%%%%%%%%%UTUU%%%%%%%%%%%%%%%%%%TT",
      "T%%%~~~~~~~~T%%%%%%%~~~~~~~%%%%UUHHHHHHHHHFBBF%TUT%%%%%%%%%%%%%%%%TTTT%%%%%%%%%%%%%%%%%%UT",
      "T%%%~~~~~~~~%%%UU%%~~~~~~~~~%%UTTHHHHHHHHHFBBF%TTU%%%%U%%%%%%%%%%%TTTT%%%%%%%%%%%%%%%%%%TT",
      "TU%%%~~~~~~~~%%UU%%T~~~~~~~~%%TTFBKKBBBBKKFBBF%%%U%%%%T%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%T",
      "TU%UU%%%%%~~~~~TT%%%%%T~~~~T%%%%FBBBBBBBBKFBBF%TTT%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%UT",
      "TT%UU%%%%%%T~~~~~~%%%%%%%%%%%%%%FFFFSSSFFFFBBFUFFFFFFFFFFFFFFFF%%%%%%%%%%%%%%%%%%%%%%%%%TT",
      "T%%TT%%%%%%%~~~~~T%%%%%%%%%%%%%%%%%%SSST%TFBBFTFBKKBBBBBBBBBBBBFF%%%%%%%%%%%%%%%%%%%%%%%%T",
      "TU%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%FBBBBBBBBBBBBBBBFF%%%%%%KKKKKKKKKKKKKKKKK%T",
      "TTTBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBUUUUBBBBBBBBBBBBBBBBBBBBBKKKKKKKKKKKKKKKKKBT",
      "TTTBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBUUUUBBBBBBBBBBBBBBBBBBBBBKKKKKKKKKKKKKKKKKBT",
      "TTTTTTT%T%%UU%%UUUTTT%U%TUTTU%%U%TTUUU%%UUUTU%TTTT%TUUT%%%%TUUUT%%UTT%U%%%UT%%%%%UTTTTTTTT",
      "TTTTTTTTTTUU%UUUTUUTTTUUUTTTTUU%%TTTUTUUUTTTTUUTU%UUTTTTUUUUUTTTUTTTTTTUUUUUU%UU%TTTTTTTTT",
      "TTTTTTTTTTUTTU%TTTTTTTTTTTTTTTUTUTTTTTUTTTTTTUTTUUTTTTTTU%UTTTTTUTTTTTT%UTTTT%UUUTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"
    ],
    start: { x: 55, y: 49 },
    station: { x: 52, y: 49, name: "紅樹林濕地站", shelter: { x: 53, y: 48 } },
    exits: [
      { x: 89, y: 38, to: "M53", tx: 1, ty: 39 },
      { x: 89, y: 39, to: "M53", tx: 1, ty: 40 }
    ],
    npcs: [
      { id: "gnome_chief", x: 59, y: 9, sprite: "npc_gnome_chief", dialog: "D_GNOME_CHIEF_IDLE", quest: "Q_GNO_1", quests: ["Q_GNO_1", "Q_GNO_3", "Q_GNO_4"] },
      { id: "gnome", x: 70, y: 8, sprite: "npc_gnome", dialog: "D_GNOME_IDLE", quest: "Q_GNO_2", quests: ["Q_GNO_2"] },
      { id: "gnome_measure", x: 19, y: 38, sprite: "npc_gnome", dialog: "D_MEASURE_IDLE", quest: "Q_SIDE_MEASURE", quests: ["Q_SIDE_MEASURE"] }
    ],
    chests: [
      { id: "C_M05_1", x: 40, y: 3, subject: "數學", level: 3, reward: { gold: 2, exp: 1, item: "herb" } },
      { id: "C_M05_2", x: 85, y: 47, subject: "數學", level: 3, reward: { gold: 2, exp: 1, item: null } },
      { id: "C_M05_3", x: 22, y: 8, subject: "數學", level: 3, reward: { gold: 2, exp: 1, item: "herb" } },
      { id: "C_M05_4", x: 13, y: 43, subject: "數學", level: 3, reward: { gold: 2, exp: 1, item: null } },
      { id: "C_M05_5", x: 85, y: 9, subject: "數學", level: 3, reward: { gold: 1, exp: 1, item: "guide" } },
      { id: "C_M05_6", x: 84, y: 13, subject: "數學", level: 3, reward: { gold: 1, exp: 1, item: "herb" } },
      { id: "C_M05_7", x: 48, y: 31, subject: "數學", level: 3, reward: { gold: 1, exp: 2, item: "snack" } },
      { id: "C_M05_8", x: 87, y: 31, subject: "數學", level: 3, reward: { gold: 1, exp: 2, item: null } }
    ],
    spawns: [
      { monster: "mudslime", count: 3, area: [31, 1, 12, 11] },
      { monster: "fiddler_crab", count: 3, area: [2, 37, 28, 13] },
      { monster: "mud_frog", count: 1, area: [15, 44, 1, 1], boss: true, quest: "Q_GNO_4" },
      { monster: "mudslime", count: 2, area: [46, 36, 19, 12] },
      { monster: "fiddler_crab", count: 2, area: [65, 33, 22, 16] }
    ],
    inn: { npc: null, price: 10, x: 81, y: 9, name: "紅樹林地精旅舍", sign: "旅舍", dialog: "D_INN_MANGROVE", dialog_nocoin: "D_INN_MANGROVE_NOCOIN" },
    shop: null,
    lights: [
      { x: 60, y: 5, r: 1.5 },
      { x: 72, y: 5, r: 1.5 },
      { x: 82, y: 5, r: 1.5 }
    ]
  },

  // ───────────────────────────── M06 海蝕洞窟 ─────────────────────────────
  M06: {
    name: "海蝕洞窟", type: "dungeon", level: 3, bgm: "cave", battle_bg: "cave", tileset: "cave",
    real_ref: "北海岸野柳地質公園（蕈狀岩、海蝕地形）",
    art_note: "左半邊是海邊岩岸：沙灘（'%'）上立著一顆顆像香菇的蕈狀岩（'*'），北邊是海；右半邊是被海浪侵蝕出來的岩洞，'#' 是岩壁，東北角深處通往哥布林部落。",
    grid: [
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~###############################################",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~**~#############################.....############",
      "~~~~~**~~~~~~**~~~~~~~~~~~~~~**~~~#**#############################.....U*.##########",
      "~~~~#**###~~~**~~~~~~~~~~~~#~**~~~###%%%###########.#####.########.....**.##########",
      "~~##%##%%##~~###%###~~~~~~~*#~~~#%%%%%%%###########...##============================",
      "~###%%%%%%##~~~#%%##~~~~~~~~#%###%%%%%%.###########.#...============================",
      "###%%UU%%%%#~#%%%U*###~~~#%%%%%%#%%%UU%%%########..**#..===#####...........#########",
      "TT%%%**%%%%%%%%%%**%######%%%UU%%%%%**%%%#######...**#..===######.........##########",
      "TT#%%%%%%%UU%%%%%%%%%%%%%%%%%**%%%%%%%%%%#######...###..===######..........#########",
      "TT#%UU%%%%**%%%%%UU%%%%%%UU%%**%%%%%%%%%%#######~~......===#####.......UU..#########",
      "TT#%**%%%%%%%%%%%**%%%%%%**%%%#%%%%%%%%%%######~~~#.....===####.UU.....UU....#######",
      "TT#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%UU%%%########~~##...===###..**.....**....#######",
      "TT#%%%%%%%UU%%%%%%%%%U%%%%%%%%%%%%%%**%%%########~~~~~#.===####........**.....######",
      "TT#%%%%%%%**%%%%%%%%%**%%%%%%%%%%%%%%%%%%######~~~~~~~#.===####................#####",
      "TTT%%%%%%%%%%%%%%%%%%*%%%%%%%%%UU%%%%%%%%######~~#~~~##.===#####...............#####",
      "==============%%%%%%%%%%%%%%%%%**%%%%%%%%##########~~###===####..UUU........**...###",
      "==============%%%#%%%%%UU%%%%%%%%%%%%%%U*##########.....===#####.***.....UU......###",
      "T##%%%%%%%%===%%%%%%%%%**%%%%%%%%%%%%%%*%######..##.....===######***.....**.....####",
      "TT##%%%%%%%===%%%%%%%%%%%%%%%%%%%%%%%%%%%#####......#..#===#######.......**#...#####",
      "TTTT#%%##%%===%%%###%%%%%%%%###%%%%%%%%%%#####.......###===#######............######",
      "TTTT#######===########%#%#########%%##%%%#######....####===....................#####",
      "TTTTTT####SSSS########################SS%#####.....####.===..........UU........#####",
      "TTTTT#####SSSS########################SS#######...#####====..........**.....########",
      "##########SSSS#######################SS################====####......**....#########",
      "##########SSSS#######################SS################===#####...##################",
      "###%**####====###**############%%##%%%%################===#####...##################",
      "TT#%**%%%%====%%%**#%%%%%%%##%%%U*%%%##################===#####...##################",
      "T#%%**%%%%=======**#%%%%%%%%~~%%**%%%##################===#####....*~~~~~~##########",
      "TT#%%%%%%%%%%%===%%%%%%%UU%%~~%%**%%%%#################===.####...**~~~~~~##########",
      "TTT##%%%%%%%UU===%%%%%%%**%%%%%%%%%%%##################===######..~~~~~~~~####**####",
      "TTT######%%%**=========%%%%%%%%%%%%%###################===#####...~~~~~~~**###**####",
      "TTTTT####%%%##%%%%%%===%%%%%%%%##%%####################===#####....**~~~~~~**#**####",
      "TTTTT#######%%%%%%%##SS###%#%%####################...##===#####.U..**#~~~~~~*#######",
      "TTT#T%%%%############SS#################===#######.....===#####.**.****~~~***#######",
      "TTTTT%%UU%###########SS#################===######......===#####....**....**~~~~~~###",
      "TTTT#%%**%%~~##%%####SS########%%%#####.===######.....#===######.........*~~~~~~~###",
      "TTTT%%%#%%%#~~%%U*%##==%%##%%%%%%%%%%#..===UU=============######.......U*~~~~~~~~###",
      "TTT###%%%%%%%%%%**%%======================%UU=============######**.....*~~~~~~~~~###",
      "TTTTT#%%%%%UU%%%**%%======================%######################~~~~..*~~~~~~~**###",
      "#TTTTT#%%%%**%%%%%%%%%%%%%%%%%%UU%%%%%%%%%%#####################~~~~*...***~~~***###",
      "#TT#####%%%**%%%%%~~~#%%%UU%%%%**%%%%%UU%%%%###~~~~#############~~~~*...*********###",
      "########%%%%%%%%%%~~~#%%%**%%%%**%%%%%**#######~~~~#################....**.......###",
      "~##########%%######~##%%%**%%%%%%%~~%%**#######################.........**...UU.%%%%",
      "~~###~~################%%%%%%%%##~~~~%%%#######################.......**.....**.%%%%",
      "~~~~~~#############~~####%%%%%%%~~~~~#..#########################....***...UU...####",
      "~~~~~~##~~#########~~########%%%%%%###############################....**...**...####",
      "~~~~~~~~~~~##~~###~~#################~##############################..........######",
      "~~~~~~~~~~~~~~~~~~~#######~~########~###############################################"
    ],
    start: { x: 2, y: 16 },
    station: { x: 4, y: 14, name: "野柳海蝕站", shelter: { x: 5, y: 12 } },
    no_minimap: true,
    exits: [
      { x: 0, y: 15, to: "M01", tx: 94, ty: 11 },
      { x: 0, y: 16, to: "M01", tx: 94, ty: 12 },
      { x: 83, y: 4, to: "M07", tx: 1, ty: 3 },
      { x: 83, y: 5, to: "M07", tx: 1, ty: 4 },
      { x: 83, y: 42, to: "M47", tx: 1, ty: 23 },
      { x: 83, y: 43, to: "M47", tx: 1, ty: 24 }
    ],
    npcs: [
      { id: "goblin_kid_echo", x: 65, y: 28, sprite: "npc_goblin_kid", dialog: "D_ECHO_IDLE", quest: "Q_SIDE_ECHO", quests: ["Q_SIDE_ECHO"] }
    ],
    chests: [
      { id: "C_M06_1", x: 68, y: 2, subject: "數學", level: 3, reward: { gold: 2, exp: 1, item: "crystal" } },
      { id: "C_M06_2", x: 9, y: 40, subject: "數學", level: 3, reward: { gold: 2, exp: 1, item: null } },
      { id: "C_M06_3", x: 47, y: 18, subject: "數學", level: 3, reward: { gold: 2, exp: 1, item: "crystal" } },
      { id: "C_M06_4", x: 35, y: 5, subject: "數學", level: 3, reward: { gold: 2, exp: 1, item: "herb" } },
      { id: "C_M06_5", x: 80, y: 42, subject: "數學", level: 3, reward: { gold: 1, exp: 1, item: null } },
      { id: "C_M06_6", x: 41, y: 33, subject: "數學", level: 2, reward: { gold: 1, exp: 1, item: null } }
    ],
    spawns: [
      { monster: "crab", count: 3, area: [3, 4, 37, 15] },
      { monster: "bat", count: 3, area: [45, 6, 13, 30] },
      { monster: "rock", count: 2, area: [62, 6, 19, 17] },
      { monster: "crab", count: 3, area: [4, 36, 37, 10] },
      { monster: "bat", count: 2, area: [63, 27, 19, 20] }
    ],
    inn: null,
    shop: null,
    lights: [
      { x: 49, y: 11, r: 1.5, color: "#a8dcff" },
      { x: 51, y: 14, r: 1.5, color: "#a8dcff" },
      { x: 78, y: 3, r: 1.2 },
      { x: 78, y: 7, r: 1.2 }
    ]
  },

  // ───────────────────────────── M07 哥布林部落 ─────────────────────────────
  M07: {
    name: "哥布林部落", type: "tribe", level: 3, bgm: "goblin", battle_bg: "cave", tileset: "cave",
    real_ref: "（奇幻地點，接在野柳海蝕洞深處）",
    art_note: "洞窟裡的聚落：左半邊四間石頭小屋與一根告示柱（'K'），右上被岩壁隔開的小洞是噪音蝙蝠王的窩（另一個 'K' 是蝙蝠倒掛的石柱）。",
    grid: [
      "####################################################################################",
      "####################################################################################",
      "###################################################################.....KK.......###",
      "=====**===#######################################################..KK...KK..KKK..###",
      "==========######################################################...KK........KK...##",
      "##.........#####################################################...KK........KK...##",
      "##########UU####RRRRRR########RRRR##########RRR#######~~~#######.................###",
      "##########UU##RRRRRRRRRR####RRRRRRRR#####R#RRRRR#####~~~~#######.................###",
      "##########==##RRRRRRRRRR####RRRRRRRR#####RRRRRRR######~~~########...KK......KK...###",
      "##########==##RRRRRRRRRR....RRRRRRRR#####RRRRRRR..U.**~~~#########..KK......KK..####",
      "##########==#FRRRRRRRRRR....HHHHHHHH.####HHHHHHH..*..*~~###########.KK......KK.#####",
      "##########==#FHHHHHHHHHH...KHHHHHHHH....KHHHHHHHK...U*~~##############.==###########",
      "#########.==..HHHHHHHHHH...........................U**~~~##.RRRRRRR###.==###########",
      "#########.==.U*.........KKK......**................***~~##..RRRRRRR####==###########",
      "#########.==.***.....KK.KKK.KK..***...............U#**~~~#..RRRRRRRF##.==###KK######",
      "#########.==.........KK..K..KK...**.......=====...*#**~~~...HHHHHHHK...==##.KK..#K##",
      "#########.==..............................=====...*#**~~~...HHHHHHH.UU.==#*.....KK##",
      "#########.==.................................==...**.FBBF......HH...**.==#*......KK#",
      "#######...===========================================BBBB================######..KK#",
      "#######...===========================================BBBB================######..KK#",
      "######....U*....===.........===............F.........F~~F#................*.####..##",
      "######....*.................===......UUUUUUF.........~~~####.........*.*.....KK..###",
      "######............URRRRRRRUU===..RRRRRRRRRRF.........~~~#####UUUUUU######U.......###",
      "################.RRRRRRRRRRR===..RRRRRRRRRRFKUUUUUUUU~~~#################K.....#####",
      "################.RRRRRRRRRRR=**#FRRRRRRRRRR...#######~~~####################..######",
      "################FRRRRRRRRRRR===.FRRRRRRRRRR..########~~~############################",
      "################FHHHHHHHHHH.===.FHHHHHHHHH...#########~~########..KK#######.#K##.###",
      "######...**.....FHHHHHHHHHH.===.KHHHHHHHHHH..#########~~###KK###..KK#####....KK..###",
      "######......................===.................######~~###KK####...#..##....K...###",
      "######U..FFFFFFFF,,FFFFFFFFF===...............########~~#..##..##............#.#.###",
      "######*..F,,,,,,,,,,,,,,,,,F===...........~~~#########~~#.........KK..............##",
      "#######..FUUUUU,,UUU,UUUUUUF===..UU.......~~~#########~~###.......KK#........KK....#",
      "#######..F*****,,***,******F===..**.......~~~#########~~####.................KKK..##",
      "#######*.F*****,,***,******F===..........K~~~########F~F#####.#KK...........#.K#..##",
      "#######..F*****,,***,******F=============FFFFF=======BBB=======.......*..........###",
      "#######..F*****,,***,******F=============BBBBB=======BBB=======..................###",
      "#######..F*****,,***,******F===.......===FFBBB.######F~F............KKK.........####",
      "#######..FFFFFFFFFFFFFFFFFFF===..#######~~~FFF#######~~~#####UK......KK........#####",
      "#######..........................#######~~~~~########~~~#####K..............##.##KK#",
      "#######UU.=====================..........~~~~########~~~########..........#######KK#",
      "#######**.======UUUUUUUUUUUU===..UUUUUUUU~~~~########~~~#########...#...#########KK#",
      "#######....**...FRRRRRRRRRRR===..RRRRRRR#############~~~#####################K######",
      "################FRRRRRRRRRRR===.FRRRRRRR#############~~~#####KK#############KKK#####",
      "################FRRRRRRRRRRR===.FRRRRRRR#############~~~#####KK#####################",
      "################RRRRRRRRRRRR===.FRRRRRRR#############~~~############################",
      "################HHHHHHHHHHHH===..HHHHHHH#############~~~############################",
      "################HHHHHHHHHHHH===..HHHHHHH#############~~~############################",
      "################HHHHHHHHHHHH#####HHHHHHHH############~~~############################"
    ],
    start: { x: 11, y: 16 },
    station: { x: 12, y: 15, name: "哥布林村莊", shelter: { x: 13, y: 15 } },
    exits: [
      { x: 0, y: 3, to: "M06", tx: 82, ty: 4 },
      { x: 0, y: 4, to: "M06", tx: 82, ty: 5 }
    ],
    npcs: [
      { id: "goblin_chief", x: 21, y: 13, sprite: "npc_goblin_chief", dialog: "D_GOB_CHIEF_IDLE", quest: "Q_GOB_1", quests: ["Q_GOB_1", "Q_GOB_3", "Q_GOB_4"] },
      { id: "goblin_kid", x: 31, y: 15, sprite: "npc_goblin_kid", dialog: "D_GOBKID_IDLE", quest: "Q_GOB_2", quests: ["Q_GOB_2"] }
    ],
    chests: [
      { id: "C_M07_1", x: 64, y: 6, subject: "數學", level: 3, reward: { gold: 3, exp: 2, item: "guide" } },
      { id: "C_M07_2", x: 26, y: 30, subject: "數學", level: 3, reward: { gold: 3, exp: 2, item: "herb" } },
      { id: "C_M07_3", x: 66, y: 39, subject: "數學", level: 3, reward: { gold: 2, exp: 1, item: null } },
      { id: "C_M07_4", x: 3, y: 5, subject: "數學", level: 3, reward: { gold: 2, exp: 1, item: "snack" } }
    ],
    spawns: [
      { monster: "goblin", count: 3, area: [12, 13, 40, 12] },
      { monster: "noise_bat", count: 1, area: [73, 6, 1, 1], boss: true, quest: "Q_GOB_4" },
      { monster: "goblin", count: 2, area: [6, 27, 22, 14] },
      { monster: "bat", count: 2, area: [57, 26, 25, 15] }
    ],
    inn: { npc: null, price: 4, x: 30, y: 12, name: "哥布林石屋客棧", sign: "客棧", dialog: "D_INN_GOBLIN", dialog_nocoin: "D_INN_GOBLIN_NOCOIN" },
    shop: null,
    lights: [
      { x: 3, y: 2, r: 1.2 },
      { x: 11, y: 9, r: 0.8 },
      { x: 6, y: 3, r: 1 },
      { x: 21, y: 14, r: 1.5 },
      { x: 28, y: 14, r: 1.5 },
      { x: 16, y: 11, r: 1.2 },
      { x: 34, y: 13, r: 1 },
      { x: 64, y: 15, r: 1.2 },
      { x: 41, y: 32, r: 1.2 },
      { x: 70, y: 13, r: 1.2 },
      { x: 72, y: 13, r: 1.2 },
      { x: 67, y: 4, r: 1.5 },
      { x: 72, y: 2, r: 1.5 },
      { x: 77, y: 4, r: 1.5 },
      { x: 68, y: 9, r: 1.5 },
      { x: 76, y: 9, r: 1.5 },
      { x: 59, y: 27, r: 1.5, color: "#a98bff" },
      { x: 66, y: 30, r: 1.5, color: "#a98bff" },
      { x: 77, y: 31, r: 1.5, color: "#a98bff" },
      { x: 69, y: 36, r: 1.2, color: "#a98bff" },
      { x: 81, y: 18, r: 1.5, color: "#a98bff" },
      { x: 25, y: 26, r: 1 },
      { x: 40, y: 25, r: 1 }
    ]
  },

  // ───────────────────────────── M08 月世界泥岩丘（獸人族）─────────────────────────────
  M08: {
    name: "月世界泥岩丘", type: "field", level: 5, bgm: "hills", battle_bg: "rock", tileset: "field",
    real_ref: "高雄田寮月世界（泥岩惡地，翰林三下國語〈月世界之旅〉可呼應）",
    art_note: "灰白色的泥岩惡地：'#' 是一道道斜斜的光禿泥岩脊，中間是乾裂的溝谷；東北角柵欄圍起獸人營地；東側一個小水池；西南角是月世界站月台。幾乎沒有樹。",
    grid: [
      "###########################################==###############F##########################F##",
      "##......#####.........####......####......====....#######...FFFFFFFFFFFFFFFFFFFFFFFFFFFF##",
      "##.....U#####U.......U####U.....####U.....=====.....##...#..FFFFFFFFFFFFFFFFFFFFFFFFFFFF##",
      "##U....########.....U######U.....####U......====#UUU##U.....F...RRRRRRR.....RRRRRRR....F##",
      "###....####........###...###U.....####......====.#######....F...RRRRRRR.....RRRRRRR....F##",
      "###.................#.....###U.....###U......===.#####.....#F...RRRRRRR.....RRRRRRR....F##",
      "##....FFFFFFFFFF..........####U......##U......===######.....F...RRRRRRR.....RRRRRRR....F##",
      "##....FKKBBBKKBF...##UU....####U.......#.......===###.......F...HHHHHHH.....HHHHHHH....F##",
      "##..#UFBBBBBBBBF.....##U.....###U...............==.##......#F...........===............F##",
      "###..#FBBBBBBBBF.....###U....####U...............==.#UU#.#..F...........===............F##",
      "##....FKKBBBKUBFUU....###U.....####......UUUUU...=.####.....F...........===............F##",
      "##....FBBBBBBKBF##U....###U..............#####...==.###U...UF..UUUUUUU..===............F##",
      "##...#FFFFBBFFFF###U...####UU.............####U#.==.####U#.#F..RRRRRRR..===........UU..F##",
      "###....##FBBF...####.....####........##......##.===..####...F..RRRRRRR..===..KK...UKK..F##",
      "##......#FBBF....####....####U...............##====..####U..F..RRRRRRR..===.......KK...F##",
      "##UU.....FBBF........#.....###U......UUUU......===....####U.F..HHHHHHH..===............F##",
      "####U...UFBBFUUU#..........####U.....####......==.U....####.F..........F===F...........F##",
      "#####U..#FBBF###..#....U....####U.....###UU...===.#U....###.FFFFFFFFFFFF===FFFFFFFFFFFFF##",
      "##.###...FBBF###U.....##UU...####U.....####..===.U##U...###.FFFFFFFFFFFF===FFFFFFFFFFFFF##",
      "##..###..FBBF####UU....###U....###U....####.====.####.....#.#...........==.#...###.......#",
      "##.......FBBF.#####....####...#####UU....#..===U..###...................===...U..##......#",
      "##.....UUFBBF...###UU...###UU...#####......===.#U..###U........U......#.==....#.#.......U#",
      "##.....##FBBF....####....####U....#.......===.U##U....#UU.....##.......===..........UUUU##",
      "##UU...##FBBF...#####U....####......#...#.===#####...####............====..........#######",
      "####.....FBBF.....####.....###U......###..===..###U...###U#..........===...UU.......#.####",
      "####U....FBBFU..............###UU.........==....###....###........====.....#######.......#",
      "#####U...FBBF#UU.............####U......U........##.....##......====....#~~~~~~~~~~~#....#",
      "######UUUFBBF###UUUU...UUUUU..####UU.UUU#UUUUU........#.......====.....#~~~~~~~~~~~~~U...#",
      "#########FBBF#######..U#####UU######U##########.UU...........====.......#~~~~~~~~~~~~#...#",
      "###..####.==.######...########################.###U......#.===......#UUU#~~~~~~~~~~~~#.UU#",
      "###U..###.==..#####U...#########.###...######...#####..#..===........#####~~~~~~~~~~##U###",
      "#####.....==....####.....#####.........#####....##.......===..........#.###~~~~~~~~#######",
      "####....#.==.....####....#####..........###......==========....#.........#################",
      "##........==..............####U..........##....===...=====.................#####..###.####",
      "###.....#.==UU..#...........###..............====#U..#.===.........................#....##",
      "##...#....==##U.....UU......###UU......#....====..#U....==.#U........................##.##",
      "##U.......==###UU...##UU.....####U.........====..U##U.....=.##.....#........U....#......##",
      "###.......==.####U....##UU...#####UU......===....####UU....==..............U##..........##",
      "####...##.==..####....####U....#####..======#.#...#####U.....==.#..........##..#.........#",
      "###.......==...###U....####U.......========........#####U....====.....#......#.......U...#",
      "##........===...####....####...========.............#####U.....===..................##U..#",
      "#..UUUUUUUU===.............#..====.=................######UU.....===.................##..#",
      "#..RRRRRRRR..==.............=====........#........##########..##..===......#......U......#",
      "#..RRRRRRRR..==......==.======..........#***..........######UU.....===..........U.#......#",
      "#..HHHHHHHHK.===============.....#.....U*****#.........#######......===.......####.......#",
      "#KKHHHHHHHHK..============..##........*#*****............#####UU.....===.#...............#",
      "#F=========================.............*................#######U....====..#U..........UU#",
      "#FFFFFFFFFFFFFFFFFFFFFFFFFF............................#.##..####..##.====..##...##..#####",
      "#............................................BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB#",
      "#BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB#",
      "#BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB............................................#",
      "#............................................#..==.#........#.###......#........##......##",
      "###.#....###....##...............###....##..###.==..........######.#......#.....###......#",
      "################################################==########################################"
    ],
    start: { x: 12, y: 46 },
    station: { x: 4, y: 46, name: "月世界站", shelter: { x: 15, y: 41 } },
    exits: [
      { x: 43, y: 0, to: "M10", tx: 37, ty: 55 },
      { x: 44, y: 0, to: "M10", tx: 38, ty: 55 },
      { x: 48, y: 53, to: "M23", tx: 42, ty: 1 },
      { x: 49, y: 53, to: "M23", tx: 43, ty: 1 }
    ],
    npcs: [
      { id: "orc_chief", x: 81, y: 8, sprite: "npc_orc_chief", dialog: "D_ORC_CHIEF_IDLE", quest: "Q_ORC_1", quests: ["Q_ORC_1", "Q_ORC_3", "Q_ORC_4"] },
      { id: "orc", x: 75, y: 15, sprite: "npc_orc", dialog: "D_ORC_IDLE", quest: "Q_ORC_2", quests: ["Q_ORC_2"] },
      { id: "orc_bank", x: 72, y: 32, sprite: "npc_orc", dialog: "D_ORC_BANK_IDLE", quest: "Q_SIDE_PIGGY", quests: ["Q_SIDE_PIGGY"] }
    ],
    chests: [
      { id: "C_M08_1", x: 3, y: 3, subject: "數學", level: 3, reward: { gold: 16, exp: 19, item: null } },
      { id: "C_M08_2", x: 86, y: 45, subject: "數學", level: 3, reward: { gold: 16, exp: 19, item: "herb" } },
      { id: "C_M08_3", x: 13, y: 9, subject: "數學", level: 3, reward: { gold: 15, exp: 19, item: "guide" } },
      { id: "C_M08_4", x: 66, y: 44, subject: "數學", level: 3, reward: { gold: 15, exp: 20, item: "herb" } }
    ],
    spawns: [
      { monster: "boar", count: 3, area: [28, 37, 30, 10] },
      { monster: "mm_mudstone", count: 2, area: [16, 1, 24, 14] },
      { monster: "angry_golem", count: 1, area: [42, 34, 1, 1], boss: true, quest: "Q_ORC_4" },
      { monster: "boar", count: 2, area: [62, 20, 26, 14] },
      { monster: "mm_mudstone", count: 2, area: [14, 15, 26, 14] }
    ],
    inn: { npc: null, price: 20, x: 69, y: 8, name: "月世界帳篷營地", sign: "營帳", dialog: "D_INN_MOON", dialog_nocoin: "D_INN_MOON_NOCOIN" },
    shop: null,
    lights: [
      { x: 77, y: 13, r: 1.5 },
      { x: 78, y: 13, r: 1 }
    ]
  },

  // ───────────────────────────── M09 山城市集（外國商人）─────────────────────────────
  M09: {
    name: "山城市集", type: "town", level: 2, bgm: "town", battle_bg: "town", tileset: "town",
    real_ref: "新北市瑞芳九份（山城、豎崎路石階、基山街窄巷）",
    art_note: "依山而建的老山城：中間一條從下往上的長石階（'S'），三條橫向窄巷（'='）把一排排擠在一起的小屋隔開，屋頂掛紅燈籠；店主人站在自家門口。最下面是寬一點的公路，西邊通回金包里，左下角是山城公車站。",
    grid: [
      "################################################################################################",
      "###RRRRRRRRRRTTTTTRRRRRRRRRRRRRRRRRRTTT#KBBBBSSSFFFFTTTTTTRRRRRRRRRTTRRRRRRRRRRTTRRRRRRRRRRRTT##",
      "###RRRRRRRRRRTTTTTRRRRRRRRRRRRRRRRRRTTT######SSS#TTTTTTKTTRRRRRRRRRTTRRRRRRRRRRTTRRRRRRRRRRRTT##",
      "###RRRRRRRRRRTTTTTRRRRRRRRRRRRRRRRRRTTT######SSS#TTTTTTKTTRRRRRRRRRTTRRRRRRRRRRTTRRRRRRRRRRRTT##",
      "###HHHHHHHHHHTTKTTHHHHHHHHHHHHHHHHHHTTT######SSS#TTTTTTTTTHHHHHHHHHTTHHHHHHHHHHTTHHHHHHHHHHHTT##",
      "###HHHHHHHHHHTTKTTHHHHHHHHHHHHHHHHHHKTT######SSS#TTTTTTTTTHHHHHHHHHTTHHHHHHHHHHKTHHHHHHHHHHHTT##",
      "###HHHHHHHHHHTTKTTHHHHHHHHHHHHHHHHHHKTT######SSS#TTTTTTTTTHHHHHHHHHKTHHHHHHHHHHKTHHHHHHHHHHHKT##",
      "###HHHHHHHHHHTTSTTHHHHHHHHHHHHHHHHHHKTT######SSS#FFFFFFFFFFFFF==FFFKTFFFF==FFFFKTFFFFF==FFFFKF##",
      "###FFFFDDFFFFTTSTTFFFFFFFFHHFFFFFFFFKTT######SSS==============================================##",
      "###==========================================SSS#============================================###",
      "###==========================================SSS#TTRRRRRRRRRRTTRRRRRRRRRRRRRRR#SS#TTRRRRRRRRRT##",
      "###RRRRRRRRR#SS#RRRRRRRRTTRRRRRRRRRRTRRRRRRR#SSS#TTRRRRRRRRRRTTRRRRRRRRRRRRRRR#SS#TTRRRRRRRRRT##",
      "###RRRRRRRRR#SS#RRRRRRRRTTRRRRRRRRRRTRRRRRRR#SSS#TTRRRRRRRRRRTTRRRRRRRRRRRRRRR#SS#TTRRRRRRRRRT##",
      "###RRRRRRRRR#SS#RRRRRRRRTTRRRRRRRRRRTRRRRRRR#SSS#TTHHHHHHHHHHTTHHHHHHHHHHHHHHH#SS#TTHHHHHHHHHT##",
      "###HHHHHHHHH#SS#HHHHHHHHTTHHHHHHHHHHTHHHHHHH#SSS#TTHHHHHHHHHHTTHHHHHHHHHHHHHHH#SS#TTHHHHHHHHHT##",
      "###HHHHHHHHH#SS#HHHHHHHHTTHHHHHHHHHHTHHHHHHH#SSS#TTHHHHHHHHHHTTHHHHHHHHHHHHHHH#SS#TTHHHHHHHHHT##",
      "###HHHHHHHHH#SS#HHHHHHHHKTHHHHHHHHHHTHHHHHHH#SSS#TTKKKKDDKKKKTTKKKDKKKKKKKKKKK#SS#TTFFFHHFFFFK##",
      "###HHHHDDHHH#SS#HHHDDHHHKTKKKKKDDKKKTHHHHHHH#SSS==============K==============================K##",
      "###FFFF==FFF#SS#FFF==FFF============KF==FFFF#SSS==============================================##",
      "###==========================================SSS#==========TTTTTTTTTTTTTTTTTT====#SS#=========##",
      "###==========================================SSS#TTRRRRRRRRTTRRRRRRRRRRRRRRRRTTTT#SS#TRRRRRRRT##",
      "###RRRRRRRRR#SS#RRRRRRRRRRRRRRRRRRRRRRRTTTTT#SSS#TTRRRRRRRRTTRRRRRRRRRRRRRRRRTTTT#SS#TRRRRRRRT##",
      "###RRRRRRRRR#SS#RRRRRRRRRRRRRRRRRRRRRRRTTTTT#SSS#TTRRRRRRRRTTRRRRRRRRRRRRRRRRKKKK#SS#TRRRRRRRT##",
      "###RRRRRRRRR#SS#RRRRRRRRRRRRRRRRRRRRRRRTTTTT#SSS#TTHHHHHHHHTTHHHHHHHHHHHHHHHHKKKK#SS#THHHHHHHT##",
      "###HHHHHHHHH#SS#HHHHHHHHHHHHHHHHHHHHHHHTKTTT#SSS#TTHHHHHHHHTTHHHHHHHHHHHHHHHHKKKK#SS#THHHHHHHT##",
      "###HHHHHHHHH#SS#HHHHHHHHHHHHHHHHHHHHHHHTKTTT#SSS#TTHHHHHHHHTTHHHHHHHHHHHHHHHHKKKK#SS#THHHHHHHT##",
      "###HHHHHHHHH#SS#HHHHHHHHHHHHHHHHHHHHHHHTTTTT#SSS=================================K==K===========",
      "###==========================================SSS================================================",
      "###===========================================SS##TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT#SS#TTTTTTTT##",
      "###TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT#SS##TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT#SS#TTTTTTTT##",
      "###RRRRRRRRRTTTTRRRRRRRRRRRRRRRRRRRRRRRRRRTTT#SSS#TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT#SS#TTTTTTTT##",
      "###RRRRRRRRRTTTTRRRRRRRRRRRRRRRRRRRRRRRRRRTTT#SSS#FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFSSFFFFFFFFF##",
      "###RRRRRRRRR#SS#RRRRRRRRRRRRRRRRRRRRRRRRRRTTT#SSS#TT=========================================R##",
      "###HHHHHHHHH#SS#HHHHHHHHHHHHHHHHHHHHHHHHHHTTT#SSS#TTTTTT=========================TTRRRRRRRRRRR##",
      "###HHHHHHHHH#SS#HHHHHHHHHHHHHHHHHHHHHHHHHHTTT#SSS#TTTTTT=========================TTRRRRRRRRRRR##",
      "###HHHHHHHHH#SS#HHHHHHHHHHHHHHHHHHHHHHHHHHTTT#SSS#TTTTTT==========KKKKK==========TTRRRRRRRRRRR##",
      "###FFF===FFF#SS#FFFFFFFF==FFFFFFFFFFFF==FFFFT#SSSTTTTTTT=K=======KK~~~KK=======KTTTHHHHHHHHHHH##",
      "###===========================================SSSTTTTTTT=K=======KK~~~KK=======KRRRRRRHHHHHHHH##",
      "#############SS###############################SSS#TTTTTT=========KK~~~KK========RRRRRRHHHHHHHH##",
      "###RRRRRRRRR#SS#RRRRRRRRRTTTTRRRRRRRRRRRRRTTT#SSS#TTTTTT==========KKKKK=========RRRRRRHHHHHHHH##",
      "###RRRRRRRRR#SS#RRRRRRRRRTTTTRRRRRRRRRRRRRTTT#SSS#TTTTTT========================HHHHHHHHHHHHHH##",
      "###RRRRRRRRR#SS#RRRRRRRRRTTTTRRRRRRRRRRRRRTTT#SSS#TTTTTT=K======================KKKKKKKHHKKKKK##",
      "###HHHHHHHHH#SS#HHHHHHHHHTTKKHHHHHHTKKKKKKTTT#SSS#TT=====K================UUUU===============K##",
      "###HHHHHHHHH#SS#HHHHHHHHHTTKKHHHHHHKKKKKKKTTT#SSS#TT=====================UUUUUU===============##",
      "###FFFHHFFFF#SS#FFFFFHHFFFKFFFFFFFFKKKKK=KK=K#SSS#FFUUUUUKSSSKUUUUUUUUUUUFFFFFFFUUUUUUUUUUUUUU##",
      "==================================================KTTTTTTKSSSKTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT##",
      "==================================================KTTTTTTKSSSKTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT##",
      "###############################FFFFFFFFFFFFFFF==K=KTKKKTTKBBBKTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT##",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFBBBBBBBBBKKKBBBBKBBBBBBBBBBBBKFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT##",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFKBBBBKBBBBBBBBBBBBBBBBBBBBBBBBFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT##",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT##",
      "**********************************************************************************************##",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
    ],
    start: { x: 41, y: 45 },
    station: { x: 43, y: 45, name: "山城市集站", noShelter: "背景在站牌西邊已經畫了一座有屋頂、長椅和燈籠的候車亭（約 x35–41、y40–45）；站牌前是兩格寬的車道，東邊是石階出口，再放一座會擋路或疊在背景候車亭上" },
    exits: [
      { x: 0, y: 45, to: "M47", tx: 94, ty: 47 },
      { x: 0, y: 46, to: "M47", tx: 94, ty: 48 },
      { x: 95, y: 26, to: "M48", tx: 1, ty: 22 },
      { x: 95, y: 27, to: "M48", tx: 1, ty: 23 }
    ],
    npcs: [
      { id: "innkeeper_port", x: 6, y: 9, sprite: "npc_inn_port_m", dialog: "D_PORT_INN_IDLE", quest: null, quests: [] },
      { id: "blacksmith", x: 6, y: 19, sprite: "npc_blacksmith_m", dialog: "D_BLACKSMITH_IDLE", quest: "Q_SIDE_MAGNET", quests: ["Q_SIDE_MAGNET"] },
      { id: "armor_keeper", x: 21, y: 19, sprite: "npc_shopkeeper", dialog: "D_ARMOR_IDLE", quest: null, quests: [] },
      { id: "item_keeper", x: 33, y: 18, sprite: "npc_uncle_market", dialog: "D_ITEM_IDLE", quest: null, quests: [] },
      { id: "merchant", x: 57, y: 17, sprite: "npc_merchant", dialog: "D_MERCHANT_IDLE", quest: "Q_MER_1", quests: ["Q_MER_1", "Q_MER_2", "Q_MER_3", "Q_MER_4"] },
      { id: "taro_seller", x: 67, y: 17, sprite: "npc_uncle_taro", dialog: "D_TARO_IDLE", quest: "Q_SIDE_TARO", quests: ["Q_SIDE_TARO"] }
    ],
    chests: [
      { id: "C_M09_1", x: 41, y: 1, subject: "數學", level: 2, reward: { gold: 1, exp: 1, item: "snack" } },
      { id: "C_M09_2", x: 32, y: 48, subject: "數學", level: 2, reward: { gold: 1, exp: 1, item: "herb" } },
      { id: "C_M09_3", x: 93, y: 43, subject: "數學", level: 2, reward: { gold: 1, exp: 1, item: null } },
      { id: "C_M09_4", x: 93, y: 8, subject: "數學", level: 2, reward: { gold: 1, exp: 1, item: "snack" } },
      { id: "C_M09_5", x: 15, y: 7, subject: "數學", level: 2, reward: { gold: 1, exp: 1, item: "snack" } },
      { id: "C_M09_6", x: 13, y: 32, subject: "數學", level: 2, reward: { gold: 2, exp: 1, item: "herb" } },
      { id: "C_M09_7", x: 52, y: 42, subject: "數學", level: 2, reward: { gold: 2, exp: 1, item: null } }
    ],
    spawns: [
      { monster: "seagull", count: 3, area: [56, 32, 24, 10] },
      { monster: "seagull", count: 2, area: [30, 43, 33, 10] },
      { monster: "mn_cart", count: 2, area: [70, 24, 24, 8] }
    ],
    inn: { npc: "innkeeper_port", price: 6, x: 6, y: 9, name: "山城民宿", sign: "民宿", dialog_nocoin: "D_INN_PORT_NOCOIN" },
    shop: { shop_id: "item", npc: "item_keeper", x: 33, y: 18 },
    extra_shops: [
      { x: 6, y: 19, shop_id: "weapon", npc: "blacksmith" },
      { x: 21, y: 19, shop_id: "armor", npc: "armor_keeper" }
    ],
    lights: [
      { x: 15, y: 5, r: 1.2 },
      { x: 36, y: 6, r: 1.2 },
      { x: 40, y: 0, r: 1.2 },
      { x: 44, y: 4, r: 1 },
      { x: 44, y: 11, r: 1 },
      { x: 44, y: 21, r: 1 },
      { x: 12, y: 11, r: 1 },
      { x: 15, y: 11, r: 1 },
      { x: 12, y: 17, r: 1 },
      { x: 15, y: 17, r: 1 },
      { x: 12, y: 21, r: 1 },
      { x: 15, y: 21, r: 1 },
      { x: 40, y: 25, r: 1.2 },
      { x: 55, y: 2, r: 1.2 },
      { x: 67, y: 6, r: 1.2 },
      { x: 80, y: 4, r: 1.2 },
      { x: 91, y: 4, r: 1.2 },
      { x: 48, y: 10, r: 1 },
      { x: 79, y: 10, r: 1 },
      { x: 81, y: 10, r: 1 },
      { x: 79, y: 16, r: 1 },
      { x: 81, y: 16, r: 1 },
      { x: 62, y: 16, r: 1.2 },
      { x: 81, y: 21, r: 1 },
      { x: 84, y: 21, r: 1 },
      { x: 82, y: 29, r: 1 },
      { x: 85, y: 29, r: 1 },
      { x: 13, y: 30, r: 1 },
      { x: 15, y: 30, r: 1 },
      { x: 45, y: 30, r: 1 },
      { x: 13, y: 39, r: 1 },
      { x: 15, y: 39, r: 1 },
      { x: 13, y: 43, r: 1 },
      { x: 15, y: 43, r: 1 },
      { x: 45, y: 39, r: 1 },
      { x: 36, y: 43, r: 1 },
      { x: 41, y: 42, r: 1 },
      { x: 30, y: 47, r: 1 },
      { x: 32, y: 49, r: 1 },
      { x: 37, y: 49, r: 1 },
      { x: 44, y: 47, r: 1 },
      { x: 48, y: 29, r: 1 },
      { x: 57, y: 35, r: 1.2 },
      { x: 57, y: 41, r: 1.2 },
      { x: 79, y: 35, r: 1.2 },
      { x: 49, y: 38, r: 1 },
      { x: 52, y: 38, r: 1 },
      { x: 50, y: 46, r: 1 },
      { x: 57, y: 46, r: 1 },
      { x: 61, y: 46, r: 1 },
      { x: 50, y: 48, r: 1 },
      { x: 62, y: 48, r: 1 },
      { x: 80, y: 47, r: 1 }
    ]
  },

  // ───────────────────────────── M10 府城古城 ─────────────────────────────
  M10: {
    name: "府城古城", type: "castle", level: 5, bgm: "castle", battle_bg: "castle", tileset: "castle",
    real_ref: "台南府城（古城牆、城門、赤崁樓一帶的古城氛圍）",
    art_note: "紅磚古城：外圍 '#' 是古城牆；北半部是城主府，紅地毯通到城主的大椅（'KK'），左廳是職業公會、右廳是圖書館（'K' 書櫃、木樁）；城主府後方頂端的樓梯通往古城塔頂；南半部是庭園（'T' 老樹、'~' 水池）；左下角是府城車站月台。",
    grid: [
      "#########################################UU#########################################",
      "#TTTTTTTTTTTTTTTTTTTTTTTTTTTT#####RRRRRRRUURRRRRRRRRRRRRTTTTTT###TTTTTTTTTTTTTTTTTT#",
      "#TTTTTRRRRRRRRRRRRRRRRTTTTTTT#####KKKKKKKKSKTRRRRRRRRRRRTTTTTT###TTTTTTTTTTTTTTTTTT#",
      "#TTTTTRRRRRRRRRRRRRRRRTTTTTTT#######T#ccKKScTRRRRRRRRRRRTTTTTT###TTTTTTTTTTTTTTTTTT#",
      "#TTTTTRRRRRRRRRRRRRRRRTTTTTTT#######T#ccKKScTRRRRRRRRRRRTTTTTT###RRRRRRRRRRRRRRRRRT#",
      "#TTTTTRRRRRRRRRRRRRRRRTTTTTTT#####K#T.cKKKccTHHHHHHHHHHHTTTTTT###RRRRRRRRRRRRRRRRRT#",
      "#TTTTTHHHHHHHHHHHHHHHHTTTTTTT####.KKT.cKKKccTHHHHHHHHHHHTTTTTT###RRRRRRRRRRRRRRRRRT#",
      "#TTTTTHHHHHHHHHHHHHHHHTTTTTTT####.....ccccccTHHHHHHHHHHHTTTTTT###RRRRRRRRRRRRRRRRRT#",
      "#TTTTTHHHHHHHDDHHHHHHHTTTTTTT####FFFF.ccccccTHHHHHHHHHHHTTTTTT###RRRRRRRRRRRRRRRRRT#",
      "#TTTTTTTTTTTSSSSTTTTTTTTTTTTT####TTTTTccccccTTTTSSSSTTTTTTTTTT###HHHHHHHHHHHHHHHHHT#",
      "#TTTTTTTTTTTT==TTTTTTTTTTTTTT####TTTTTccccccTTTTT==TTTTTTTTTTT###HHHHHHHHHHHHHHHHHT#",
      "#TTTTTTTTTTTT==TTTTTTTTTTTTTT####TTTTTccccccTTTTT==TTTTTTTTTTT###HHHHHHHDDHHHHHHHHT#",
      "#TTTTTTTTTTTT==TTTTTTTTTTTTTT####TTTTTccccccTTTTT==TTTTTTTTTTT###TTTTTKSSSSSKTTTTTT#",
      "#TTTTTTTTTTTT==TTTTTTTTTTTTTT####TTTTKcccccKTTTTT==TTTTTTTTTTT###TTTTTTT===TTTTTTTT#",
      "#TTTTTTTTTTTT==TTTTTTTTTTTTTT####TTTTKcccccKTTTTT==TTTTTTTTTTT###TTTTTTT===TTTTTTTT#",
      "#==================================================================================#",
      "====================================================================================",
      "============================================UUUUUUUUUUUUUUUUUUU==============#======",
      "#KKKKKKKKKKKKKKKKKKKKKKKKKKKTT#TTTTTT=======KKKKKKKKKKKKKKKKKKKTTTTTTTTTTTTTT#=====#",
      "#KKKKKKKKKKKKKKKKKKKKKKKKKKKTT#TTTTTT=======KKKKKKKKKKKKKKKKKKKTTTTTTTTTTTTTT#K====#",
      "#KKKKKKKKKKKKKKKKKKKKKKKKKKK###KK==========KRRRRRRRRRRRRRRRRRRTTTTTTTTTTTTTTT#K====#",
      "#TT~~~~RRRRRRRRRRRRRRRRRRTTTT##KK==========KKKRRRRRRRRRRRRRRRRTTTTTTTTTTTTTTT#K===K#",
      "#TT~~~~RRRRRRRRRRRRRRRRRRTTTT##KK==========KKKRRRRRRRRRRRRRRRRTTTTTTTTTTTTTTT#K===K#",
      "#TT~~~~RRRRRRRRRRRRRRRRRRTTTT##TT==========KKKRRRRRRRRRRRRRRRRTTTTTTTTTTTTTTT#=====#",
      "#TT~~~~RRRRRRRRRRRRRRRRRRTTTT##TTTTT=======#KKRRRRRRRRRRRRRRRRTTTTTTTTTTTTTTT#*====#",
      "#TT~~~~RRRRRRRRRRRRRRRRRRTTTT##TTTTT=======#HHHHHHHHHHHHHHHHHHTTTTTTTTTTTTTTT#=====#",
      "#TT~~~~RRRRRRRRRRRRRRRRRRTTTT##TTTTT=======#HHHHHHHHHHHHHHHHHHTTTTTTTTTTTTTTT#=====#",
      "#TT~~~~HHHHHHHHHHHHHHHHHHTTTT##TTTTT=======#HHHHHHDDHHHHHHHHHHTTTTTTTTTTTTTTT#UU===#",
      "#TTTTTTHHHHHHHHHHHHHHHHHHTTTT#===================SSSSSTTTTTTT===========UUUUUUUUUU=#",
      "#TTTTTTTTTTTTTSSTTTTTTTTTTTTT#============TTTTTTT=====TTTTTTTTTTTT==TTTTTTTTTTTTTT=#",
      "#TTTTTTTTTTTTTSSTTTTTTTTTTTTT#============TTTTTTT=====TTTTTTTT~~~FBBF~~~~K~~~TTTTT=#",
      "#TTTTTTTTTTTTT==TTTTTTTTTTTTT#==K=======K=TTTTTTTTT==TTTTTTTTT~~~FBBF~~~~~~~~TTTTT=#",
      "#TTTTTTTTTTTTT==TTTTTTTTTTTTT#==K=======K=TTTTTTTTT==TTTTTTTTT~~~FBBF~~~~~~~~TTTTT=#",
      "#TTTTTT~~~~~~T==T~~~~~~TTTTTT#=====KKK====TTTTTTTTT==TTTTTTTTT~~~FBBF~~~~~~~~TTTTT=#",
      "#TTTTTT~~~~~~T==T~~~~~~TTTTTT#=====KKK====TTTTTTTTT==TTTTTTTTT~~~FBBF~~~~~~~~TTTTT=#",
      "#TTTTTT~~~~~~T==T~~~~~~TTTTTT#=====KKK====TTTTTTTTT==TTTTTTTTT~~~FBBF~~~~~~~~TTTTT=#",
      "#TTTTTT~~~~~~T==T~~~~~~TTTTTT#=====KKK====TTTTTTTTT==TTTTTTTTT~~~FBBF~~~~~~~~TTTTT=#",
      "#TTTTTT~~~~~~T==T~~~~~~TTTTTT#==K=======K=TTTTTTTTT==TTTTTTTTT~~~FBBF~~~~~~~~TTTTT=#",
      "#TTTTTTTTTTTTT==TTTTTTTTTTTTT#==K=======K=TTTTTTTTT==TTTTTTTTTTTTT==TTTTTKTTTTTTTT=#",
      "#TTTTTTTTTTTTT==TTTTTTTTTTTTT#==K=======K=TTTTTTTTT==TTTTTTTTTTTTT==TTTTTTTTTTTTTT=#",
      "#TTTTTTTTTTTTT==TTTTTTTTTTTTT#==RRRRUUURRRTTTTTTTTT==TTTTTTTTTTTTT==TTTTTTTTTTTTTT=#",
      "##############==############UU==RRRRUUURRRTTTTTTT#####TTTTTTTTTTTTTTTTTTTTTTTTTTTT##",
      "#===============================RRRRUUURRR##########################################",
      "#============================#RRRRKRUUURRR##########################################",
      "#TTTTTTTTTRRRRRRRRRRRRRRTTTT##RRRRKK===KRR##########################################",
      "#TTTTTTTTTRRRRRRRRRRRRRRTTTT##RRRRKK===KRR##########################################",
      "#TTTTTTTTTRRRRRRRRRRRRRRTTTTTTTTTTTK===TTTTTT#######################################",
      "#TTTTTTTTTHHHHHHHHHHHHHHTKTTTTTTTTTK===TTTTTTK================================UUUUU#",
      "#TTTTTTTTTHHHHHHHHHHHHHHTKTTTTTTTTTK===TTTTTTK======KKK==============KK==KKK==UUUUU#",
      "#TTTTTTFFFKKKKKK..K.KKKKFKFFTTTTTTTK===TTTTTTKFFFFFFFFFFFFFFFFFFKFFFFFFFFFFFFKK...K#",
      "#TTTTTTTBBBBBBBBBBBBBBBBBBBBTTTTTTTK===TTTTTTBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB#",
      "#TTTTTTTBBBBBBBBBBBBBBBBBBBBTTTTTTTK===TTTTTTBKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK#",
      "########............................====......KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK#",
      "########====================########====######KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK#",
      "########====================########====############################################",
      "####################################====############################################",
      "#####################################==#############################################"
    ],
    start: { x: 17, y: 51 },
    station: { x: 21, y: 50, name: "府城古城站", shelter: { x: 8, y: 49 } },
    exits: [
      { x: 41, y: 0, to: "M11", tx: 35, ty: 40 },
      { x: 42, y: 0, to: "M11", tx: 36, ty: 40 },
      { x: 0, y: 16, to: "M21", tx: 94, ty: 25, requires: "Q_ELF_4", requires_dialog: "D_EXIT_LOCK_FC_W" },
      { x: 0, y: 17, to: "M21", tx: 94, ty: 26, requires: "Q_ELF_4", requires_dialog: "D_EXIT_LOCK_FC_W" },
      { x: 83, y: 16, to: "M04", tx: 44, ty: 58 },
      { x: 83, y: 17, to: "M04", tx: 45, ty: 58 },
      { x: 37, y: 56, to: "M08", tx: 43, ty: 1, requires: "Q_FINAL", requires_dialog: "D_EXIT_LOCK_FC_S" },
      { x: 38, y: 56, to: "M08", tx: 44, ty: 1, requires: "Q_FINAL", requires_dialog: "D_EXIT_LOCK_FC_S" }
    ],
    npcs: [
      { id: "king", x: 40, y: 7, sprite: "npc_king", dialog: "D_KING_IDLE", quest: "Q_FINAL", quests: ["Q_FINAL"] },
      { id: "guild", x: 15, y: 9, sprite: "npc_guild_m", dialog: "D_GUILD_IDLE", quest: null, quests: [] },
      { id: "librarian", x: 75, y: 12, sprite: "npc_librarian", dialog: "D_LIBRARIAN_IDLE", quest: "Q_FC_1", quests: ["Q_FC_1", "Q_SIDE_LIB"] }
    ],
    chests: [
      { id: "C_M10_1", x: 1, y: 42, subject: "數學", level: 3, reward: { gold: 5, exp: 5, item: "guide" } },
      { id: "C_M10_2", x: 67, y: 40, subject: "數學", level: 3, reward: { gold: 5, exp: 5, item: "herb" } },
      { id: "C_M10_3", x: 82, y: 40, subject: "數學", level: 3, reward: { gold: 5, exp: 5, item: null } },
      { id: "C_M10_4", x: 46, y: 47, subject: "數學", level: 3, reward: { gold: 5, exp: 5, item: "guide" } },
      { id: "C_M10_5", x: 61, y: 28, subject: "數學", level: 3, reward: { gold: 4, exp: 5, item: "snack" } },
      { id: "C_M10_6", x: 33, y: 6, subject: "數學", level: 3, reward: { gold: 4, exp: 5, item: null } },
      { id: "C_M10_7", x: 51, y: 40, subject: "數學", level: 3, reward: { gold: 4, exp: 5, item: "herb" } }
    ],
    spawns: [
      { monster: "armor", count: 3, area: [45, 28, 30, 13] },
      { monster: "wisp", count: 2, area: [72, 17, 11, 24] },
      { monster: "wisp", count: 1, area: [57, 3, 24, 15] }
    ],
    inn: { npc: null, price: 18, x: 53, y: 29, name: "府城老客棧", sign: "客棧", dialog: "D_INN_FUCHENG", dialog_nocoin: "D_INN_FUCHENG_NOCOIN", sells: "gear_fucheng" },
    shop: null,
    lights: [
      { x: 34, y: 3, r: 1.2 },
      { x: 37, y: 3, r: 1.2 },
      { x: 43, y: 3, r: 1.2 },
      { x: 11, y: 7, r: 1.2 },
      { x: 16, y: 7, r: 1.2 },
      { x: 47, y: 7, r: 1.2 },
      { x: 51, y: 7, r: 1.2 },
      { x: 71, y: 9, r: 1.2 },
      { x: 76, y: 9, r: 1.2 },
      { x: 32, y: 21, r: 1 },
      { x: 43, y: 24, r: 1 },
      { x: 79, y: 20, r: 1 },
      { x: 32, y: 31, r: 1.2 },
      { x: 40, y: 31, r: 1.2 },
      { x: 32, y: 38, r: 1.2 },
      { x: 40, y: 38, r: 1.2 },
      { x: 34, y: 44, r: 1.2 },
      { x: 40, y: 44, r: 1.2 },
      { x: 11, y: 48, r: 1.2 },
      { x: 15, y: 48, r: 1.2 },
      { x: 19, y: 48, r: 1.2 },
      { x: 23, y: 48, r: 1.2 },
      { x: 73, y: 31, r: 1.2 },
      { x: 73, y: 39, r: 1.2 },
      { x: 54, y: 39, r: 1.2 },
      { x: 49, y: 45, r: 1.2 },
      { x: 64, y: 45, r: 1.2 },
      { x: 45, y: 49, r: 1 },
      { x: 64, y: 49, r: 1 },
      { x: 80, y: 49, r: 0.9 }
    ]
  },

  // ───────────────────────────── M11 古城塔頂（最終）─────────────────────────────
  M11: {
    name: "古城塔頂", type: "castle", level: 5, bgm: "final", battle_bg: "castle_top", tileset: "castle",
    real_ref: "（奇幻地點，參考古城樓閣屋頂的氛圍）",
    art_note: "古城樓閣的屋頂平台，四周是矮牆，'T' 是紅柱子；紅地毯一路通到最北邊，遺忘霧魔在地毯盡頭的霧裡；遠方可以看到整座古城。",
    grid: [
      "####RRRRRRRRRRRRRRRR##############KKKK##############RRRRRRRRRRRRRRRR####",
      "####RRRRRRRRRRRRRRRR##############cccc##############RRRRRRRRRRRRRRRR####",
      "####RRRRRRRRRRRRRRRR#===TT=K======cccc======K=T====#RRRRRRRRRRRRRRRR####",
      "####RRRRRRRRRRRRRRRR#===TT=K======cccc======K=T====#RRRRRRRRRRRRRRRR####",
      "####RRRRRRRRRRRRRRRR#===TT========cccc========T====#RRRRRRRRRRRRRRRR####",
      "####RRRRRRRRRRRRRRRR#=============cccc=============#RRRRRRRRRRRRRRRR####",
      "####RRRRRRRRRRRRRRRR#===UU========cccc========U====#RRRRRRRRRRRRRRRR####",
      "####RRRRRRRRRRRRRRRR#===TT========#SSS#=======T====#RRRRRRRRRRRRRRRR####",
      "####RRRRRRRRRRRRRRRR#===TT========#SSS#=======T====#RRRRRRRRRRRRRRRR####",
      "####RRRRRRRRRRRRRRRR#=============#SSS#============#RRRRRRRRRRRRRRRR####",
      "####RRRRRRRRRRRRRRRR####SS#########===#########SS###RRRRRRRRRRRRRRRR####",
      "####RRRRRRRRRRRRRRRRRRRSSSRRRRRRRR====RRRRRRRRRSSRRRRRRRRRRRRRRRRRRR####",
      "####RRRRRRRRRRRRRRRRRRRSSSRRRRRRRR====RRRRRRRRRSSRRRRRRRRRRRRRRRRRRR####",
      "####RRRRRRRRRRRRRRRRRRRRUURRRRRRRR====RRRRRRRRRUURRRRRRRRRRRRRRRRRRR####",
      "####RRRR#UUTUUUUUUTTUUUUUTUUUUUTTU====TTUUUUUUTUUUUUTTUUUUUUTUU#RRRR####",
      "####RRRR#==T======TT=====T=====TT=====TT======T=====TT======T==#RRRR####",
      "#########======================================================#RRRR####",
      "#########======================================================#RRRR####",
      "#########======================================================#RRRR####",
      "######=====================================================###RRRRRR####",
      "######=====================================================###RRRRRR####",
      "########=================================================#####RRRRRR####",
      "####RRR###############SS###########SS#####################RRRRRRRRRR####",
      "####RRR#RRRRRRRRRRRRR#SS#RRRRRRRRR#SS#####################RRRRRRRRRR####",
      "####RRR#RRRRRRRRRRRRR#SS#RRRRRRRRR#cc#======K=T==========#RRRRRRRRRR####",
      "####RRR#RRRRRRRRRRRRR#SS#RRRRRRRRR#cc=======K=T==========#RRRRRRRR#R####",
      "#####RRTRRRRRRRRRRRRR#SS#RRRRRRRRR#cc====================#TUUUTUUU#R####",
      "#######T===========================cc=====================TUUUTUUU#R####",
      "#######T===========================cc=====================T===T===#R####",
      "#######T===========================cc=============================#R####",
      "#######T==========================#cc#============================#R####",
      "#######T==========================#SS##===========================#R####",
      "#######T==========================#SS##UUUUUUU#SS#UUUUUUUUUUUUU####R####",
      "#######T==========================#SS##########SS###############RRRR####",
      "#######T==========================#SS#RRRRRRRR#SS#RRRRRRRRRRRRRRRRRR####",
      "#########UUUUUUUUUUUUUUUUUUUUUUUUU#===RRRRRRRR#SS#RRRRRRRRRRRRRRRRRR####",
      "#####RRRRRRRRRRRRRRRRRRRRRRRRRRRRR====TUUUUUUTUUUUUUTUUUUUUTUUU#RRRR####",
      "#####RRRRRRRRRRRRRRRRRRRRRRRRRRRRR====T======T======T======T===#RRRR####",
      "#######RRRRRRRRRRRRRRRRRRRRRRRRRRR====T======T======T======T===#########",
      "########UUUUUUUUUUUUUUUUUUUUUUUUUU=============================#########",
      "########=T======T======T======T================================#########",
      "###################################==###################################"
    ],
    start: { x: 35, y: 39 },
    exits: [
      { x: 35, y: 41, to: "M10", tx: 41, ty: 1 },
      { x: 36, y: 41, to: "M10", tx: 42, ty: 1 }
    ],
    npcs: [
      { id: "fog_kid", x: 39, y: 4, sprite: "npc_fog_kid", dialog: "D_V1_FOG_KID", quest: "Q_V1_FOG", quests: ["Q_V1_FOG"], show: { after: "Q_FINAL", until: "Q_V1_FOG" } }
    ],
    chests: [
      { id: "C_M11_1", x: 8, y: 40, subject: "數學", level: 3, reward: { gold: 11, exp: 12, item: "herb" } },
      { id: "C_M11_2", x: 65, y: 29, subject: "數學", level: 3, reward: { gold: 11, exp: 12, item: "guide" } },
      { id: "C_M11_3", x: 6, y: 20, subject: "數學", level: 3, reward: { gold: 10, exp: 11, item: "herb" } }
    ],
    spawns: [
      { monster: "wisp", count: 2, area: [8, 24, 26, 11] },
      { monster: "fog_demon", count: 1, area: [35, 1, 1, 1], boss: true, quest: "Q_FINAL" },
      { monster: "wisp", count: 1, area: [38, 23, 27, 10] },
      { monster: "armor", count: 2, area: [9, 12, 54, 10] }
    ],
    inn: null,
    shop: null,
    lights: [
      { x: 27, y: 3, r: 1.5 },
      { x: 44, y: 3, r: 1.5 },
      { x: 36, y: 1, r: 1.5, color: "#a98bff" },
      { x: 8, y: 30, r: 1.2 },
      { x: 8, y: 32, r: 1.2 },
      { x: 8, y: 27, r: 1.2 },
      { x: 44, y: 25, r: 1.5 }
    ]
  },

  // ───────────────────────────── MT1 金包里慈護宮（v0.9.5 新增；來源 tools/bigmaps/MT1.txt／.json）─────────────────────────────
  MT1: {
    name: "金包里慈護宮", type: "interior", level: 1, bgm: "village", battle_bg: "town", tileset: "village",
    real_ref: "新北市金山區金包里慈護宮（正殿；金包里街 16 號）",
    art_note: "慈護宮正殿室內（24×20 格）：上方中間是神龕和神像，前面供桌；兩側紅柱；下方中間是門口，出去就是 M01 廟埕。依老闆 2026-10-11 指示新增，背景 art_src/v1/temple/bg_MT1.png。",
    grid: [
      "########################",
      "####TT##KKKKKKKK##T#####",
      "KKKKTT##KKKKKKKK##T#KKKK",
      "KKKKTT##KKKKKKKK##T#KKKK",
      "KKKKTTK#KKKKKKKK#KT#KKKK",
      "KKK#TTK.KKKKKKKK.KT#KKKK",
      "KKK#TT..KKKKKKKK..TTKKKK",
      "#..UTT..KKKKKKKK..TUU..#",
      "#..UU...KKKKKKKK...UU..#",
      "#..UU...KKKKKKKK...UU..#",
      "#..UU.....====.....UU..#",
      "#..UU.....====.....UU..#",
      "#..UU.....====.....UU..#",
      "#..UU.....====.....UU..#",
      "#..TT.....====.....TT..#",
      "##########====##########",
      "#######K##====####K#####",
      "#######K##====####K#####",
      "##########====##########",
      "###########===##########"
    ],
    start: { x: 12, y: 18 },
    plaques: [
      { x: 12.016, y: 1, w: 4.1, h: 1.05, text: "慈護宮" }
    ],
    exits: [
      { x: 11, y: 19, to: "M01", tx: 59, ty: 44 },
      { x: 12, y: 19, to: "M01", tx: 60, ty: 44 },
      { x: 13, y: 19, to: "M01", tx: 61, ty: 44 }
    ],
    npcs: [
      { id: "temple_keeper", x: 17, y: 8, sprite: "npc_temple_keeper", dialog: "D_TEMPLE_INTRO", quest: null, quests: [] }
    ],
    chests: [],
    spawns: [],
    inn: null,
    shop: null,
    altar: { x: 11, y: 9, span: [8, 15] },
    statue: { x: 11, y: 5 }
  },

  // ───────────────────────────── M46 竹子湖（v1.1 新增；來源 tools/bigmaps/M46.txt／.json）─────────────────────────────
  M46: {
    name: "竹子湖", type: "field", level: 2, bgm: "field", battle_bg: "grass", tileset: "field",
    real_ref: "臺北市北投區陽明山竹子湖（海芋田、竹子湖蓬萊米原種田事務所；59 號 2.9.1，來源 S141、S142、S185–S188）",
    art_note: "三面環山、南邊打開的山谷：中央一格一格的海芋水田（白色海芋），東北是原種田故事館（1928 年的洋風小平房，只畫外觀）和一小塊稻田，南端是看得到臺北盆地的木頭觀景台。北口石板路接硫磺谷；往北投的路在南端被木柵擋住（台北章才開）。v1.1 新增，背景 docs/assets/maps/bg_M46.webp（GPT 分四塊延續法＋最小誤差接縫拼接）。",
    grid: [
      "TTTT#####################################==#####################################TTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTT..............RRRRRRRR...............==........RRRRRRR......................TTTT",
      "TTTT.......UU.....RRRRRRRR...............==........RRRRRRR.................UU...TTTT",
      "TTTT.......TT.....RRRRRRRR...UU..........==........RRRRRRR.UU..............TT...TTTT",
      "TTTT..............RRRRRRRR...TT..........==........HHHHHHH.TT..........UU.......TTTT",
      "TTTT..............HHHHHHHH......UUU......==........HHHHHHH.............TT.......TTTT",
      "TTTT..............HHHHHHHH......TTT......==.....................................TTTT",
      "TTTT.....................................=======================================TTTT",
      "TTT.....========================================================================TTTT",
      "TTT.....===================================......................==.............TTTT",
      "TTT.....==...............................==......................==.RRRRRRRRRR..TTTT",
      "TTT.UU..==...............................==..==================..==.RRRRRRRRRR..TTTT",
      "TTT.TT..==...========================....==..=~~~~~~~~~~~~~~~~...==.RRRRRRRRRR..TTTT",
      "TTT.....==....~~~~~~~~~~~~~~~~~~~~~~.....==..=~~~~~~~~~~~~~~~~~..==.RRRRRRRRRR..TTTT",
      "TTT.....==....~~~~~~~~~~~~~~~~~~~~~~.....==..=~~~~~~~~~~~~~~~~...==.HHHHHHHHHH..TTTT",
      "TTT...*.==....~~~~~~~~~~~~~~~~~~~~~~.....==..=~~~~~~~~~~~~~~~~...==.HHHHHHHHHH..TTTT",
      "TTTUU...==....~~~~~~~~~~~~~~~~~~~~~~.....==..==================..==..K.....KK...TTTT",
      "TTTTU...==UU..~~~~~~~~~~~~~~~~~~~~~~.....==..=~~~~~~~~~~~~~~~~~..==.............TTTT",
      "TTTTT...==**..~~~~~~~~~~~~~~~~~~~~~~.....==..=~~~~~~~~~~~~~~~~~..==.............TTTT",
      "TTTT.UU.==....~~~~~~~~~~~~~~~~~~~~~~.....==..=~~~~~~~~~~~~~~~~~==~~~~~=~~~~~~~UUTTTT",
      "TTTT.TT.==....~~~~~~~~~~~~~~~~~~~~~~.....==..=~~~~~~~~~~~~~~~~~==~~~~~=~~~~~~~TTTTTT",
      "TTTT....==...========================....==..~~~~~~~~~~~~~~~~..==~~~~~=~~~~~~~TTTTTT",
      "TTTTUU..==...............................==..~~~~~~~~~~~~~~~~..==~~~~~=~~~~~~~TTTTTT",
      "TTTTTT..==...............................==..====================.............TTTTTT",
      "TTTT.T..==..==========================...==..~~~~~~~~~~~~~~~~~~==.............TTTTTT",
      "TTTT....==...~~~~~~~~~~~~~~~~~~~~~~~~....==..~~~~~~~~~~~~~~~~~~==.............TTTTTT",
      "TTTT....==...~~~~~~~~~~~~~~~~~~~~~~~~....==..~~~~~~~~~~~~~~~~~~==.....UUU.....TTTTTT",
      "TTTT....==.*.~~~~~~~~~~~~~~~~~~~~~~~~....==..~~~~~~~~~~~~~~~~~~==.....UUU.....TTTTTT",
      "TTTT.*..==...~~~~~~~~~~~~~~~~~~~~~~~~....==..~~~~~~~~~~~~~~~~~~==......TT.....TTTTTT",
      "TTTT....==.U.~~~~~~~~~~~~~~~~~~~~~~~~....==.U~~~~~~~~~~~~~~~~~~==..........UU.TTTTTT",
      "TTTTUU..==.T.~~~~~~~~~~~~~~~~~~~~~~~~....==.*~~~~~~~~~~~~~~~~~~==..........TT.TTTTTT",
      "TTTTTT..==...~~~~~~~~~~~~~~~~~~~~~~~~....========================.UUU...*.....TTTTTT",
      "TTTT....=========================================================.UUU.......UUTTTTTT",
      "TTTT....=========================================================.TTT......TUUTTTTTT",
      "TTTT.....................................==.................................TTTTTTTT",
      "TTTT........UU................FFFFFFFFFFF==.**..................T...........T.TTTTTT",
      "TTTTUU......TT..........UU....FBBBBBBBBBF==...............UU...........**.....TTTTTT",
      "TTTTTTT..........UU.....UU....FBBBBBBBBBB==..........**..UUU..................TTTTTT",
      "TTTTTT...........UU.*...TT....FBBBBBBBBBB==...............TT..................TTTTTT",
      "TTTT**...........TT...........FBBBBBKBBBF==UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU**TTTT",
      "TTT***UUUUUUU.................FFFFFFFFFFF==*************************************TTTT",
      "TTT**********UUUUUUU**UUUUUUUU***********==*************************************TTTT",
      "TTT**************************************==*************************************TTTT",
      "TTT**************************************==*************************************TTTT",
      "TTT**************************************==*************************************TTTT"
    ],
    start: { x: 42, y: 8 },
    station: { x: 43, y: 7, name: "竹子湖站", shelter: { x: 44, y: 5 } },
    landmarks: [
      { name: "竹子湖海芋田", area: [13, 14, 50, 21] },
      { name: "原種田故事館", area: [66, 12, 13, 9] },
      { name: "竹子湖觀景台", area: [30, 37, 13, 7] }
    ],
    exits: [
      { x: 41, y: 0, to: "M03", tx: 57, ty: 46 },
      { x: 42, y: 0, to: "M03", tx: 58, ty: 46 },
      { x: 41, y: 47, to: "M53", tx: 47, ty: 1, requires: "Q_YL_5", requires_dialog: "D_EXIT_LOCK_CH2" },
      { x: 42, y: 47, to: "M53", tx: 48, ty: 1, requires: "Q_YL_5", requires_dialog: "D_EXIT_LOCK_CH2" }
    ],
    npcs: [
      { id: "calla_farmer", x: 40, y: 14, sprite: "npc_calla_farmer", dialog: "D_CALLA_IDLE", quest: "Q_ZZH_1", quests: ["Q_ZZH_1"] },
      { id: "rice_guide", x: 74, y: 19, sprite: "npc_rice_guide", dialog: "D_RICEGUIDE_IDLE", quest: "Q_ZZH_2", quests: ["Q_ZZH_2"] }
    ],
    chests: [
      { id: "C_M46_1", x: 5, y: 6, subject: "數學", level: 2, reward: { gold: 2, exp: 1, item: null } },
      { id: "C_M46_2", x: 79, y: 8, subject: "數學", level: 2, reward: { gold: 2, exp: 1, item: "herb" } },
      { id: "C_M46_3", x: 32, y: 41, subject: "數學", level: 2, reward: { gold: 2, exp: 1, item: null } },
      { id: "C_M46_4", x: 79, y: 15, subject: "數學", level: 2, reward: { gold: 2, exp: 1, item: "eraser" } },
      { id: "C_M46_5", x: 74, y: 40, subject: "數學", level: 2, reward: { gold: 2, exp: 2, item: "guide" } }
    ],
    spawns: [
      { monster: "mushroom", count: 3, area: [3, 13, 6, 30] },
      { monster: "sprout", count: 2, area: [65, 27, 14, 15] },
      { monster: "mushroom", count: 2, area: [9, 37, 21, 7] },
      { monster: "sprout", count: 2, area: [43, 37, 22, 6] }
    ],
    inn: null,
    shop: null
  },

  // ───────────────────────────── M47 基隆港（v1.1 新增；來源 tools/bigmaps/M47.txt／.json）─────────────────────────────
  M47: {
    name: "基隆港", type: "town", level: 2, bgm: "town", battle_bg: "harbor", tileset: "town",
    real_ref: "基隆市基隆港、廟口夜市（奠濟宮）、正濱漁港色彩屋、和平島（海蝕平臺、豆腐岩、蕈狀岩）（59 號 2.9.2，來源 S154–S159、S185、S186）",
    art_note: "三面山、一面海的雨港：北邊是港灣（停著漁船），一圈石板碼頭；西邊從野柳的海岸公路進城，港邊大路旁是公車站；廟口夜市街的街底只畫廟的外觀（門內暗、不畫神像）；東邊是正濱漁港的彩色小屋、和平橋與和平島的蕈狀岩、豆腐岩；東南的路往九份。地面一直是濕的。v1.1 新增，背景 docs/assets/maps/bg_M47.webp（GPT 分四塊延續法＋最小誤差接縫拼接）。",
    grid: [
      "*******************~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "*******************~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~KKK*********************~~",
      "*******************~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~%K%%%%%%%%%%%%%%%%K%%%**~~",
      "TTTTTTTTTTTTTTTTTTT==K~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~K==%%%%%KUK%%%%%%%%%%%%%%**~~",
      "TTTTTTTTTTTTTTTTTTT===~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~===%%%%%%K%%%%%%%%%%%%%%%%%~~",
      "TTTTTTTTTTTTTTTTTTTU==~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~===%%%%%%%%%%%%%%%%%%%%%%%%~~",
      "TTTTTTTTTTTTTTTTTTTK==~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~===***************BBU******~~",
      "TTTTTTTTTTTTTTTTTTTK=K~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~K==~~~~~~~~~~~~~~~BB~~~~~~~TT",
      "TTTTTTTTTTTTTTTTTTTK==~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~===~~~~~~~~~~~~~~~BB~~~~~~~TT",
      "TTTTTTTTTTTTTTTTTTTK==~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~===~~~~~~~~~~~~~~~BB~~~~~~~TT",
      "TTTTTTTTTTTTTTTTTTT===~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~===~~~~~~~~~~~~~~~BB~~~~~~~TT",
      "TTTTTTTTTTTTTTTTTTT===~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~===~~~~~~~~~~~~~~KBBK~~~~~~TT",
      "TTTTTTTTTTTTTTTTTTT==K~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~K=========================TTT",
      "TTTTTTTTTTTTTTTTTTT===~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~==========================TTT",
      "TTTTTTTTTTTTTTTTTTT===~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~===RRRRRRRRRRRRRRR===RRRRRTTT",
      "TTTTTTTTTTTTTTTTTTT===~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~===RRRRRRRRRRRRRRR===RRRRRTTT",
      "TTTTTTTTTTTTTTTTTTT===~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~===RRRRRRRRRRRRRRR==KRRRRRTTT",
      "TTTTTTTTTTTTTTTTTTT===~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~===HHHHHHHHHHHHHHH===HHHHHTTT",
      "TTTTTTTTTTTTTTTTTTT===~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~===HHHHHHHHHHHHHHH===HHHHHTTT",
      "TTTTTTTT#######TTT======K=====K=====K=====K====KKKK=KK=====K====K=====HHHHHHHHHHHHHHH===HHHHHTTT",
      "TTTTTTTT#.....#TTT==============================KKK==========================================TTT",
      "TTTTTTTT#.....#TTT==============================KKK==========================================TTT",
      "FFFFFFFF#.....TTTT===========================================================================TTT",
      "=============================================================================================TTT",
      "=============================================================================================TTT",
      "FFFFFFFFFFFFFFUUUUUUUUUUUUU==################==UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU==UUUUTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTT==RRRRRRRRRRRRRRRR==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTT==RRRRRRRRRRRRRRRR==TRRRRRRRRRRRRTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTT==RRRRRRRRRRRRRRRR==TRRRRRRRRRRRRTTTTRRRRRRRRTRRRRRRRRRRRRTT==TTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTT==RRRRRRRRRRRRRRRR==TRRRRRRRRRRRRTTTTRRRRRRRRTRRRRRRRRRRRRTT==TTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTT==HHHHHHHHHHHHHHHH==TRRRRRRRRRRRRTTTTRRRRRRRRTRRRRRRRRRRRRTT==TTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTT==HHHHHHHHHHHHHHHH==THHHHHHHHHHHHTTTTRRRRRRRRTRRRRRRRRRRRRTT==TTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTT==HHHHHHHHHHHHHHHH==THHHHHHHHHHHHTTTTHHHHHHHHTHHHHHHHHHHHHTT==TTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTT=======K====K====K==THHHHHHHHHHHHTTTTHHHHHHHHTHHHHHHHHHHHHTT==TTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTT==UUUUU=======KKKK==THHHHHD=HHHHHTTTTHHHHHHHHTHHHHHHHHHHHHTT==TTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTT==KKKKK=======KKKK============================================TTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTT==KKKKK=======KKKK==****************************************==TTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTT==KKKKK=======KKKK==TTRRRRRRRRRRTRRRRRRRRRRRRRRRRRRRRRRRRRU==UTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTT==KKKKK=======KKKK==TTRRRRRRRRRRTRRRRRRRRRRRRTRRRRRRRRRRRRT==TTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTT==KKKKK=======KKKK==TTRRRRRRRRRRTRRRRRRRRRRRRTRRRRRRRRRRRRT==TTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTT==KKKKK=======KKKK==TTHHHHHHHHHHTHHHHHHHHHHHHTHHHHHHHHHHHHT==TTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTT==KKKKK=======KKKK==TTHHHHHHHHHHTHHHHHHHHHHHHKHHHHHHHHHHHHT==TTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTT==KKKKK=======KKKK==TTHHHHHHHHHHTHHHHHHHHHHHHTHHHHHHHHHHHHT==TTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTT==KKKKK=======KKKK==TTHHHHHHHHHHTHHHHHHHHHHHHTHHHHHHHHHHHHT==TTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTT==KKKKK=======KKKK=KTTHHHHHHHHHHTHHHHHHHHHHHHTHHHHHHHHHHHHT==TTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTT==KKKKK=======KKKK==TTHHHHHHHHHHTHHHHHHHHHHHHTHHHHHHHHHHHHT==TTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTT==KKKKK=======KKKK==*****====================================#######T",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTT=====================================================================",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTT=====================================================================",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTT#####################################################################",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"
    ],
    start: { x: 13, y: 23 },
    station: { x: 12, y: 23, name: "基隆港站", shelter: { x: 10, y: 20 } },
    landmarks: [
      { name: "基隆港", area: [18, 3, 52, 22] },
      { name: "廟口夜市", area: [27, 25, 20, 24] },
      { name: "正濱漁港色彩屋", area: [70, 7, 24, 14] },
      { name: "和平島海岸", area: [70, 0, 26, 7] }
    ],
    exits: [
      { x: 0, y: 23, to: "M06", tx: 82, ty: 42 },
      { x: 0, y: 24, to: "M06", tx: 82, ty: 43 },
      { x: 95, y: 47, to: "M09", tx: 1, ty: 45 },
      { x: 95, y: 48, to: "M09", tx: 1, ty: 46 }
    ],
    npcs: [
      { id: "harbor_uncle", x: 23, y: 20, sprite: "npc_harbor_uncle", dialog: "D_HARBOR_IDLE", quest: "Q_KL_1", quests: ["Q_KL_1"] },
      { id: "stall_keeper", x: 40, y: 36, sprite: "npc_keelung_vendor", dialog: "D_SHOP_KEELUNG_IDLE", quest: "Q_KL_2", quests: ["Q_KL_2"] }
    ],
    chests: [
      { id: "C_M47_1", x: 20, y: 4, subject: "數學", level: 2, reward: { gold: 1, exp: 1, item: null } },
      { id: "C_M47_2", x: 68, y: 4, subject: "數學", level: 2, reward: { gold: 1, exp: 1, item: "herb" } },
      { id: "C_M47_3", x: 92, y: 4, subject: "數學", level: 2, reward: { gold: 1, exp: 1, item: null } },
      { id: "C_M47_4", x: 29, y: 47, subject: "數學", level: 2, reward: { gold: 1, exp: 1, item: "snack" } },
      { id: "C_M47_5", x: 92, y: 12, subject: "數學", level: 2, reward: { gold: 1, exp: 1, item: "eraser" } },
      { id: "C_M47_6", x: 63, y: 48, subject: "數學", level: 2, reward: { gold: 1, exp: 1, item: null } },
      { id: "C_M47_7", x: 51, y: 19, subject: "數學", level: 2, reward: { gold: 1, exp: 1, item: "herb" } },
      { id: "C_M47_8", x: 43, y: 33, subject: "數學", level: 2, reward: { gold: 2, exp: 0, item: null } }
    ],
    spawns: [
      { monster: "wx_rain", count: 3, area: [19, 19, 46, 6] },
      { monster: "seagull", count: 3, area: [66, 3, 8, 12] },
      { monster: "crab", count: 2, area: [70, 1, 24, 6] },
      { monster: "wx_rain", count: 2, area: [74, 10, 20, 6] }
    ],
    inn: { x: 54, y: 34, npc: null, price: 6, name: "港邊旅店", sign: "旅店", dialog: "D_INN_KEELUNG", dialog_nocoin: "D_INN_KEELUNG_NOCOIN" },
    shop: { x: 40, y: 36, shop_id: "item_keelung", npc: "stall_keeper" },
    lights: [
      { x: 33, y: 31, r: 1 },
      { x: 40, y: 31, r: 1 },
      { x: 43, y: 31, r: 1 },
      { x: 51, y: 33, r: 1 },
      { x: 56, y: 33, r: 1 }
    ]
  },

  // ───────────────────────────── M48 金瓜石（v1.1 新增；來源 tools/bigmaps/M48.txt／.json）─────────────────────────────
  M48: {
    name: "金瓜石", type: "town", level: 3, bgm: "hills", battle_bg: "mine", tileset: "town",
    real_ref: "新北市瑞芳區金瓜石（黃金博物館、日式宿舍四連棟、太子賓館、本山五坑；北邊是基隆山）（59 號 2.9.3，來源 S162–S165、S190）",
    art_note: "基隆山背後的老礦山聚落：西半部是紅磚牆、黑瓦的日式宿舍（左上第一棟是旅店；四連棟本身是展場不是旅館）、黃金博物館的展館、圍牆裡的太子賓館（只看外觀）；中間往下是有舊礦車軌道的山坡步道；東半部從木框坑道口進去是暗暗的坑道網，最深處的大礦室是金脈鐵顎王。東南的山路被木門擋住（往草嶺古道，第二章開放）。不畫坍方、事故。v1.1 新增，背景 docs/assets/maps/bg_M48.webp（GPT 分四塊延續法＋最小誤差接縫拼接）。",
    grid: [
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT##############################",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT##############################",
      "TTTTT#SSS##############################RRRRRRRRRRRRRRRRRRRRR##############################",
      "TTTTT#SSS##############################RRRRRRRRRRRRRRRRRRRRR##############################",
      "TTTTT#SSS#TTRRRRRRRR=RRRRRRRR=RRRRRRRRTRRRRRRRRRRRRRRRRRRRRR#################%%%%%%%%%%%%#",
      "TTTTT#SSS#TTRRRRRRRR=RRRRRRRR=RRRRRRRRTRRRRRRRRRRRRRRRRRRRRR#################%%%%%%%%%%%%#",
      "TTTTT#SSS#TTHHHHHHHH=HHHHHHHH=HHHHHHHHTHHHHHHHHHHHHHHHHHHHHH#################%%%%%%K%%%%%#",
      "TTTTT#SSS#TTHHHHHHHH=HHHHHHHH=HHHHHHHHTHHHHHHHHHHHHHHHHHHHHH##################%%##########",
      "TTTTT#SSS#TTHHHDHHHH=HHHHHHHH=HHHHHHHHTHHHHHHHHHHHHHHHHHHHHH##################%%##########",
      "TTTTT#SSS#TTTT==============================================##################%%##########",
      "TTTTT#SSS#TTTT#RRRRRRR=RRRRRRR=RRRRRRRU====================U##################%%#####%%###",
      "TTTTT#SSS#TTTTTRRRRRRR=RRRRRRR=RRRRRRRTFFFFFFFFFFFFFFFFFFFFF##################%%%%%%%%%###",
      "TTTTT#SSS#TTTTTRRRRRRR=RRRRRRR=RRRRRRRTFTTTTRRRRRRRRRRRTTTTF##################%%%%%%%%%###",
      "TTTTTT#SSS#TTTTHHHHHHH=HHHHHHH=HHHHHHHTFTTTTRRRRRRRRRRRTTTTF#########################%%###",
      "TTTTTT#SSS#TTTTHHHHHHH=HHHHHHH=HHHHHHHTFTTTTRRRRRRRRRRRTTTTF#########################%%###",
      "TTTTTT#SSS#TT==========================FTTTTRRRRRRRRRRRTTTTF#########################%%###",
      "TTTTTT#SSS#TT==========================FTTTTRRRRRRRRRRRTTTTF#########################%%###",
      "TTTTTT#SSS#TTUU==RRRRRRRRSRRRRRRR======FTTTTHHHHHHHHHHHTTTTF#########################%%###",
      "T...**#SSS#TTTT==RRRRRRRRSRRRRRRR======FTTTTHHHHHHHHHHHTTTTF#########################%%###",
      "T.....#SSS#TTTT==RRRRRRRRSRRRRRRR======FTTTTHHHHHHHHHHHTTTTF=%%=######%%#############%%###",
      "T.....#SSS#TTTT==HHHHHHHHSHHHHHHH======FFFFFFFFFFFFFFFFFFFFF===%%%%%%%%%#############%%###",
      "T*....#SSS#TTTT==HHHHHHHHSHHHHHHH======FFFFFFFFFFFFFFFFFFFFF====######%%#############%%###",
      "================================================================######%%#############%%###",
      "================================================================######%%%%%%%%%%%%%%%%%###",
      "TUT........................SS........................UUU....##########%%%%%%%%%%%%%%%%%###",
      "TT....**......**......*....SS......*....UU.......UUU.TTT....#########################%%###",
      "TT........................#SS#..........T*U..U....TT........#########################%%###",
      "TTFFFFFFFFFFFFFFFFFFFFFFFF#SS#FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF#########################%%###",
      "TT****T*******************#SS#******************************#########################%%###",
      "TT************************#SS#******************************###############%%########%%###",
      "TT************************#SS#******************************###############%%########%%###",
      "TT************************#SS#**************KKK*************###############%%########%%###",
      "TTTTFFFFFFFFFFFFFFFFFFFFFF#SS#FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF###############%%########%%###",
      "TT=========================SS===============================###############%%########%%###",
      "TT=========================SS===============================###############%%########%%###",
      "TT........................#SS#..............................###############%%########%%###",
      "TT........................#SS#..............................###############%%########%%###",
      "TT........................#SS#..........UU..................###############%%########%%###",
      "TT.................U......#SS#..........TT..U....U..........#####%%%%%%%%%%%%%%%%%%%%%%%##",
      "TT.*........TU.....T......#SS#..............**...UU.........#####%%%%%%%%%%%%%%%%%%%%%%%##",
      "TT......*....**...........#SS#...................TT..*......##############################",
      "TT........................#SS#..............*.....T............*.........**...**....*.####",
      "TT......*.....*...........#SS#...........................*............................####",
      "TT=========================SS=============================================================",
      "TT=========================SS=============================================================",
      "TT........................#SS#..............................UUUUUUUUUUUUUUUUUUUUUUUUUUUTTT",
      "TT...UUUU...U.............#SS#..UU.UU.......UU..............TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTUUUTTT*UUUTUUUUUUUUUUUUU#SS#UUTTUTTUUUUUUUTTUUUUUUUUUUUUUUTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTT#SS#TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTT#SS#TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTT....TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTUUUUTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTUUUUTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"
    ],
    start: { x: 3, y: 23 },
    station: { x: 2, y: 22, name: "金瓜石站", shelter: { x: 1, y: 18 } },
    landmarks: [
      { name: "金瓜石日式宿舍", area: [10, 2, 29, 20] },
      { name: "黃金博物館", area: [39, 1, 24, 10] },
      { name: "太子賓館", area: [38, 10, 22, 12] },
      { name: "金瓜石坑道", area: [60, 2, 30, 40] }
    ],
    exits: [
      { x: 0, y: 22, to: "M09", tx: 94, ty: 26 },
      { x: 0, y: 23, to: "M09", tx: 94, ty: 27 },
      { x: 89, y: 43, to: "M49", tx: 1, ty: 19, requires: "Q_LAMPS_3", requires_dialog: "D_EXIT_LOCK_CH1" },
      { x: 89, y: 44, to: "M49", tx: 1, ty: 20, requires: "Q_LAMPS_3", requires_dialog: "D_EXIT_LOCK_CH1" }
    ],
    npcs: [
      { id: "old_miner", x: 27, y: 15, sprite: "npc_old_miner", dialog: "D_MINER_IDLE", quest: "Q_JGS_1", quests: ["Q_JGS_1", "Q_JGS_3"] },
      { id: "museum_guide", x: 47, y: 9, sprite: "npc_museum_guide", dialog: "D_MUSEUM_IDLE", quest: "Q_JGS_2", quests: ["Q_JGS_2"] }
    ],
    chests: [
      { id: "C_M48_1", x: 7, y: 2, subject: "數學", level: 2, reward: { gold: 1, exp: 1, item: null } },
      { id: "C_M48_2", x: 59, y: 9, subject: "數學", level: 2, reward: { gold: 1, exp: 1, item: null } },
      { id: "C_M48_3", x: 27, y: 50, subject: "數學", level: 2, reward: { gold: 1, exp: 1, item: "herb" } },
      { id: "C_M48_4", x: 3, y: 45, subject: "數學", level: 2, reward: { gold: 1, exp: 1, item: "guide" } },
      { id: "C_M48_5", x: 75, y: 29, subject: "數學", level: 3, reward: { gold: 1, exp: 1, item: "crystal" } },
      { id: "C_M48_6", x: 87, y: 39, subject: "數學", level: 3, reward: { gold: 1, exp: 1, item: "herb" } },
      { id: "C_M48_7", x: 20, y: 4, subject: "數學", level: 2, reward: { gold: 1, exp: 1, item: "snack" } },
      { id: "C_M48_8", x: 29, y: 4, subject: "數學", level: 2, reward: { gold: 2, exp: 0, item: "herb" } }
    ],
    spawns: [
      { monster: "mn_cart", count: 3, area: [2, 33, 24, 10] },
      { monster: "mn_ore", count: 3, area: [30, 33, 30, 10] },
      { monster: "mn_dust", count: 2, area: [30, 43, 30, 6] },
      { monster: "mn_lamp", count: 2, area: [63, 19, 24, 6] },
      { monster: "mn_drill", count: 2, area: [74, 25, 13, 13] },
      { monster: "mn_timber", count: 2, area: [64, 36, 24, 6] },
      { monster: "mnb_goldjaw", count: 1, area: [84, 5, 1, 1], boss: true, quest: "Q_JGS_3" }
    ],
    inn: { x: 14, y: 9, npc: null, price: 6, name: "礦山宿舍旅店", sign: "宿舍", dialog: "D_INN_JINGUASHI", dialog_nocoin: "D_INN_JINGUASHI_NOCOIN" },
    shop: null,
    lights: [
      { x: 85, y: 3, r: 1.2 },
      { x: 78, y: 8, r: 1.2 },
      { x: 79, y: 10, r: 1.2 },
      { x: 84, y: 10, r: 1.2 },
      { x: 86, y: 17, r: 1.2 },
      { x: 61, y: 18, r: 1.2 },
      { x: 69, y: 19, r: 1.2 },
      { x: 72, y: 23, r: 1.2 },
      { x: 80, y: 23, r: 1.2 },
      { x: 85, y: 26, r: 1.2 },
      { x: 76, y: 29, r: 1.2 },
      { x: 76, y: 34, r: 1.2 },
      { x: 86, y: 33, r: 1.2 },
      { x: 66, y: 38, r: 1.2 },
      { x: 73, y: 38, r: 1.2 },
      { x: 77, y: 38, r: 1.2 },
      { x: 84, y: 38, r: 1.2 },
      { x: 15, y: 7, r: 1 }
    ]
  },

  // ───────────────────────────── M49 草嶺古道（v1.2 新增；來源 tools/bigmaps/M49.txt／.json）─────────────────────────────
  M49: {
    name: "草嶺古道", type: "field", level: 3, bgm: "forest", battle_bg: "coast", tileset: "field",
    real_ref: "新北市貢寮區遠望坑至宜蘭縣大里的草嶺古道（虎字碑、雄鎮蠻煙碑、埡口觀景亭、福德祠 S167）",
    art_note: "芒草山稜間蜿蜒的石階古道：西口接金瓜石，經休息亭、虎字碑，爬到埡口觀景亭與小小的福德祠（只畫外觀），再一路下到雄鎮蠻煙碑、東側緩坡，往東南走到宜蘭。東北遠景是海崖與太平洋。雲霧多。v1.2 新增，背景 tools/bigmaps/M49_bg.webp（石階東側的小土路是 GPT 局部補畫 M49_gap_fixed.png）。",
    grid: [
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT#####################",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT#####################",
      "*************************************RRRRR*********************#####################",
      "************************************.RRRRR......RRR..**********#####################",
      "************************************.RRRRR......RRR..**********#####################",
      "************************************.HHHHH......HHH..**********#####################",
      "************************************.................**********#####################",
      "******************************===============SSUUUUUU**********#####################",
      "******************************===============SS****************#####################",
      "******************************SS..........UUUSS****************#####################",
      "******************************SS...KK.....***SS****************#####################",
      "******************************SS...KK.....***SS****************#####################",
      "******************************SS..........***SS****************#####################",
      "************==================SS..........***SS****************#####################",
      "************==================SSUUUUUUUUUU***SS****************#####################",
      "************SS....RRRRR.....UUUU*************SS****************#####################",
      "************SS....RRRRR.....*****************SS****************#####################",
      "************SS....RRRRR.....*****************SS****************#####################",
      "************SS....HHHHH.....*****************SS****************#####################",
      "============SS..............*****************SS****************#####################",
      "============SS..............*****************SS****************#####################",
      "*UUUUUUUUUUUUUUUUUUUUUUUUUUU*****************SS****************#####################",
      "*********************************************SS****************#####################",
      "*********************************************=================*#####################",
      "*********************************************=================*#####################",
      "*********************************************UUUU**********SSU*#####################",
      "*************************************************..........SS**#####################",
      "*************************************************...KK.....SS**#####################",
      "*************************************************...KK.....SS*********..************",
      "*************************************************..........SS=====...UUU************",
      "*************************************************..........SS=====....TT...........*",
      "*************************************************UUUUUUUUUUSSUUU...................*",
      "***********************************************************SS***...................*",
      "***********************************************************SS***UUUUUUUUUUUUUUUUUUU*",
      "***********************************************************SS***********************",
      "***********************************************************SS***********************",
      "***********************************************************SS***********************",
      "***********************************************************SS***********************",
      "***********************************************************=========================",
      "***********************************************************=========================",
      "***********************************************************UUUUUUUUUUUUUUUUUUUUUUUU*",
      "************************************************************************************",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"
    ],
    start: { x: 2, y: 20 },
    landmarks: [
      { name: "虎字碑", area: [32, 9, 10, 5] },
      { name: "埡口觀景亭", area: [36, 2, 17, 5] },
      { name: "雄鎮蠻煙碑", area: [49, 26, 10, 5] }
    ],
    exits: [
      { x: 0, y: 19, to: "M48", tx: 88, ty: 43 },
      { x: 0, y: 20, to: "M48", tx: 88, ty: 44 },
      { x: 83, y: 38, to: "M14", tx: 46, ty: 1 },
      { x: 83, y: 39, to: "M14", tx: 47, ty: 1 }
    ],
    npcs: [
      { id: "trail_volunteer", x: 33, y: 11, sprite: "npc_trail_volunteer", dialog: "D_VOLUNTEER_IDLE", quest: "Q_CL_1", quests: ["Q_CL_1"] }
    ],
    chests: [
      { id: "C_M49_1", x: 15, y: 20, subject: "數學", level: 3, reward: { gold: 4, exp: 3, item: null } },
      { id: "C_M49_2", x: 52, y: 6, subject: "數學", level: 3, reward: { gold: 4, exp: 3, item: "herb" } },
      { id: "C_M49_3", x: 50, y: 30, subject: "數學", level: 3, reward: { gold: 3, exp: 3, item: null } },
      { id: "C_M49_4", x: 81, y: 31, subject: "數學", level: 3, reward: { gold: 3, exp: 2, item: "guide" } }
    ],
    spawns: [
      { monster: "mn_dust", count: 2, area: [0, 13, 30, 8] },
      { monster: "ly_tigerwind", count: 3, area: [29, 7, 33, 19] },
      { monster: "ly_tigerwind", count: 2, area: [59, 28, 25, 12] }
    ],
    inn: null,
    shop: null
  },

  // ───────────────────────────── M14 頭城・礁溪（v1.2 新增；來源 tools/bigmaps/M14.txt／.json）─────────────────────────────
  M14: {
    name: "頭城・礁溪", type: "town", level: 3, bgm: "town", battle_bg: "coast", tileset: "town",
    real_ref: "宜蘭縣頭城鎮、礁溪鄉（頭城老街「開蘭第一街」S108；礁溪溫泉 S168、S169；龜山島 S64；雪山隧道 S65；宜蘭站氣候 S185、S186、S199）",
    art_note: "西北是頭城老街（紅磚紅瓦、洗石子立面、圓拱的街屋，只畫外觀）；東北是金棗園；西南是礁溪溫泉旅館、泡腳池和冒熱氣的溫泉蔬菜田；東邊是海堤與沙灘，海上遠看龜山島（遠景，不能去）。西端往坪林的路有路牌擋住（第三章開）。v1.2 新增，背景 tools/bigmaps/M14_bg.webp。",
    grid: [
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT~~~~~~~~~~~~~~~~",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTTTT%%%%~~~~~~~~~~~~~~~~",
      "TT..........................................**==****........................%%%%~~~~~~~~~~~~~~~~",
      "TT..........................................**==****........................%%%%~~~~~~~~~~~~~~~~",
      "TT.....RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR**==****........................%%%%~~~~~~~~~~~~~~~~",
      "TT.....RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR**==****........................%%%%~~~~~~~~~~~~~~~~",
      "TT.....RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR**==****..UUU.UUU.UUU.UUU.UUU...%%%%~~~~~~~~~~~~~~~~",
      "TT.....HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH**==****..TTT.TTT.TTT.TTT.TTT...%%%%~~~~~~~~~~~~~~~~",
      "TT.....HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH**==****........................%%%%~~~~~~~~~~~~~~~~",
      "TT.....HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH**==****........................%%%%~~~~~~~~~~~~~~~~",
      "TT.....=========================================****..UUU.UUU.UUU.UUU.UUU...%%%%~~~~~~~~~~~~~~~~",
      "TT.....=========================================****..TTT.TTT.TTT.TTT.TTT...%%%%~~~~~~~~~~~~~~~~",
      "TT.....=========================================............................%%%%~~~~~~~~~~~~~~~~",
      "TT.....RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR..==............................%%%%~~~~~~~~~~~~~~~~",
      "TT.....RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR..==......UUU.UUU.UUU.UUU.UUU...%%%%~~~~~~~~~~~~~~~~",
      "TT.....RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR..==......TTT.TTT.TTT.TTT.TTT...%%%%~~~~~~~~~~~~~~~~",
      "TT.....HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH..==............................%%%%~~~~~~~~~~~~~~~~",
      "TT.....HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH..==............................%%%%~~~~~~~~~~~~~~~~",
      "TT.....=========================================......UUU.UUU.UUU.UUU.UUU...%%%%~~~~~~~~~~~~~~~~",
      "TT............................................==......TTT.TTT.TTT.TTT.TTT...%%%%~~~~~~~~~~~~~~~~",
      "TT............................................==............................%%%%~~~~~~~~~~~~~~~~",
      "TT............................................==............................%%%%~~~~~~~~~~~~~~~~",
      "TT............................................==............................%%%%~~~~~~~~~~~~~~~~",
      "TT............................................==............................%%%%~~~~~~~~~~~~~~~~",
      "TT............................................==............................%%%%~~~~~~~~~~~~~~~~",
      "TT............................................==............................%%%%~~~~~~~~~~~~~~~~",
      "TT............................................==............................%%%%~~~~~~~~~~~~~~~~",
      "TT............................................==............................%%%%~~~~~~~~~~~~~~~~",
      "=============================================================================%%%~~~~~~~~~~~~~~~~",
      "=============================================================================%%%~~~~~~~~~~~~~~~~",
      "TT*U.....................UU...................==...........................==%%%~~~~~~~~~~~~~~~~",
      "TT**UUURRRRRRRRRRRRRRRRRR**........UUU........==...........................==%%%~~~~~~~~~~~~~~~~",
      "TT*****RRRRRRRRRRRRRRRRRR**========***........==...........................==%%%~~~~~~~~~~~~~~~~",
      "TT*****RRRRRRRRRRRRRRRRRR.=========***........==...........................==%%%~~~~~~~~~~~~~~~~",
      "TT*****RRRRRRRRRRRRRRRRRR.=========***........==...........................==%%%~~~~~~~~~~~~~~~~",
      "TT*****RRRRRRRRRRRRRRRRRR.=K~~~~~K=***........==...........................==%%%~~~~~~~~~~~~~~~~",
      "TT*****HHHHHHHHHHHHHHHHHH.=K~~~~~K=***........==...........................==%%%~~~~~~~~~~~~~~~~",
      "TT*****HHHHHHHHHHHHHHHHHH.==~~~~~==***........==...........................==%%%~~~~~~~~~~~~~~~~",
      "TT*****HHHHHHHHHHHHHHHHHH.=========***........==...........................==%%%~~~~~~~~~~~~~~~~",
      "TT*****HHHHHHHHHDHHHHHHHH.=========***........==...........................==%%%~~~~~~~~~~~~~~~~",
      "TT**....=======================...............==............=================%%%~~~~~~~~~~~~~~~~",
      "TT**....~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~....==............=================%%%~~~~~~~~~~~~~~~~",
      "TT**....~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~....==...........................==%%%~~~~~~~~~~~~~~~~",
      "TT**....~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~....==...........................==%%%~~~~~~~~~~~~~~~~",
      "TT**....~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~....==...........................==%%%~~~~~~~~~~~~~~~~",
      "TT**....~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~....==...........................==%%%~~~~~~~~~~~~~~~~",
      "TT**....~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~....==...........................==%%%~~~~~~~~~~~~~~~~",
      "TT**....~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~....==...........................==%%%~~~~~~~~~~~~~~~~",
      "TT**....~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~....==...........................==%%%~~~~~~~~~~~~~~~~",
      "TT**....~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~....==...........................==%%%~~~~~~~~~~~~~~~~",
      "TT**....~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~....==...........................==%%%~~~~~~~~~~~~~~~~",
      "TT**....~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~....==UUUUUUUUUUUUUUUUUUUUUUUUUUU==%%%~~~~~~~~~~~~~~~~",
      "TT**...U**********************************UUUU==***************************==%%%~~~~~~~~~~~~~~~~",
      "TT**...***************************************==***************************==%%%~~~~~~~~~~~~~~~~",
      "TTTTUUUTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTTT==%%%~~~~~~~~~~~~~~~~",
      "TTTTUUUTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTTT==%%%~~~~~~~~~~~~~~~~",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT~~~~~~~~~~~~~~~~"
    ],
    start: { x: 46, y: 27 },
    station: { x: 45, y: 27, name: "頭城礁溪站", shelter: { x: 42, y: 24 } },
    landmarks: [
      { name: "頭城老街", area: [7, 4, 39, 15] },
      { name: "金棗園", area: [48, 2, 28, 18] },
      { name: "礁溪溫泉", area: [7, 31, 30, 10] },
      { name: "溫泉蔬菜田", area: [8, 41, 34, 11] },
      { name: "海堤（遠望龜山島）", area: [75, 0, 5, 56] }
    ],
    exits: [
      { x: 46, y: 0, to: "M49", tx: 82, ty: 38 },
      { x: 47, y: 0, to: "M49", tx: 82, ty: 39 },
      { x: 46, y: 56, to: "M50", tx: 44, ty: 1 },
      { x: 47, y: 56, to: "M50", tx: 45, ty: 1 },
      { x: 0, y: 28, to: "M52", tx: 82, ty: 18, requires: "Q_YL_5", requires_dialog: "D_EXIT_LOCK_CH2" },
      { x: 0, y: 29, to: "M52", tx: 82, ty: 19, requires: "Q_YL_5", requires_dialog: "D_EXIT_LOCK_CH2" }
    ],
    npcs: [
      { id: "kumquat_farmer", x: 52, y: 22, sprite: "npc_kumquat_farmer", dialog: "D_KUMQUAT_IDLE", quest: "Q_YL_1", quests: ["Q_YL_1", "Q_YL_2"] },
      { id: "bus_driver", x: 44, y: 27, sprite: "npc_bus_driver", dialog: "D_DRIVER_IDLE", quest: "Q_YL_SNOW", quests: ["Q_YL_SNOW"] },
      { id: "levee_uncle", x: 77, y: 40, sprite: "npc_levee_uncle", dialog: "D_LEVEE_IDLE", quest: "Q_YL_TURTLE", quests: ["Q_YL_TURTLE"] },
      { id: "stall_yilan", x: 30, y: 10, sprite: "npc_yilan_vendor", dialog: "D_SHOP_YILAN_IDLE" }
    ],
    chests: [
      { id: "C_M14_1", x: 43, y: 2, subject: "數學", level: 3, reward: { gold: 2, exp: 2, item: null } },
      { id: "C_M14_2", x: 74, y: 3, subject: "數學", level: 3, reward: { gold: 2, exp: 2, item: "herb" } },
      { id: "C_M14_3", x: 45, y: 18, subject: "數學", level: 3, reward: { gold: 2, exp: 2, item: null } },
      { id: "C_M14_4", x: 34, y: 32, subject: "數學", level: 3, reward: { gold: 2, exp: 2, item: "snack" } },
      { id: "C_M14_5", x: 5, y: 51, subject: "數學", level: 3, reward: { gold: 3, exp: 2, item: "eraser" } },
      { id: "C_M14_6", x: 74, y: 50, subject: "數學", level: 3, reward: { gold: 3, exp: 1, item: null } }
    ],
    spawns: [
      { monster: "ly_kumquat", count: 3, area: [48, 20, 27, 7] },
      { monster: "ly_tigerwind", count: 2, area: [3, 19, 38, 8] },
      { monster: "ly_kumquat", count: 2, area: [49, 30, 25, 9] }
    ],
    inn: { x: 25, y: 39, npc: null, price: 8, bath: { price: 4, label: "♨️ 泡溫泉" }, name: "礁溪溫泉旅館", sign: "溫泉", dialog: "D_INN_JIAOXI", dialog_nocoin: "D_INN_JIAOXI_NOCOIN", dialog_bath: "D_INN_JIAOXI_BATH" },
    shop: { x: 30, y: 10, shop_id: "item_yilan", npc: "stall_yilan" }
  },

  // ───────────────────────────── M50 三星（v1.2 新增；來源 tools/bigmaps/M50.txt／.json）─────────────────────────────
  M50: {
    name: "三星", type: "field", level: 3, bgm: "field", battle_bg: "paddy", tileset: "field",
    real_ref: "宜蘭縣三星鄉一帶的蘭陽平原（三星蔥、稻草種蔥術 S106；歌仔戲源於宜蘭員山 S107；蘭陽溪沖積扇平原 S192；宜蘭站氣候 S185–S187、S199）",
    art_note: "一望無際的平原田野：四大片三星蔥田（田畦上鋪金黃稻草，田間小路可走）、紅磚三合院民宿（前埕曬穀）、村子廣場的野台歌仔戲戲台（台前長板凳）；南邊是寬寬的蘭陽溪，一座木橋過溪往南。雨多、空氣濕。v1.2 新增，背景 tools/bigmaps/M50_bg.webp（GPT 分四塊延續法＋最小誤差接縫拼接）。",
    grid: [
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TT..=****=****=****=***.....................==..=***=***==***=***..................*****TT",
      "TT..=****=****=****=***..RRRRRRRRRRRRRR.....==..=***=***==***=***..................*****TT",
      "TT..=****=****=****=***..RRRRRRRRRRRRRR.....==..=***=***==***=***.......................TT",
      "TT..=****=****=****=***..RRRRRRRRRRRRRR.....==..=***=***==***=***.......................TT",
      "TT..=****=****=****=***..RRRRRRRRRRRRRR.....==..=***=***==***=***.......................TT",
      "TT..=****=****=****=***..RRRRRRRRRRRRRR.....==..=***=***==***=***.......................TT",
      "TT..=****=****=****=***..HHHHHHHHHHHHHH.....==..=***=***==***=***.......................TT",
      "TT..=****=****=****=***..HHHHHHDHHHHHHH.....==..=***=***==***=***.......................TT",
      "TT..=****=****=****=***..K===========KK.....==..=***=***==***=***.......................TT",
      "TT..=****=****=****=***...===========KK.....==..=***=***==***=***.......................TT",
      "TT..=****=****=****=***...============......==..=***=***==***=***.......................TT",
      "TT..=****=****=****=***.....................==..=***=***==***=***....................UUUTT",
      "TT..=****=****=****=***...UUUUUUUUU.........==..=***=***==***=***....................***TT",
      "TT..=****=****=****=***...*********.........==..=***=***==***=***....................***TT",
      "TT........................*********.........==.......................................***TT",
      "TT..........................................==.......................................***TT",
      "TT======================================================================================TT",
      "TT======================================================================================TT",
      "TT..........................................==..........................................TT",
      "TT..=UUUU=UUUU=UUUU=UUU..RRRRRRRRRRRRRR.....==....................=UUU==UUU==UUU=UUUU...TT",
      "TT..=****=****=****=***..RRRRRRRRRRRRRR.....==....................=***==***==***=****...TT",
      "TT..=****=****=****=***..RRRRRRRRRRRRRR.....==....................=***==***==***=****...TT",
      "TT..=****=****=****=***..RRRRRRRRRRRRRR.....==....................=***==***==***=****...TT",
      "TT..=****=****=****=***..RRRRRRRRRRRRRR.....==....................=***==***==***=****...TT",
      "TT..=****=****=****=***..HHHHHHHHHHHHHH.....==....................=***==***==***=****...TT",
      "TT..=****=****=****=***..HHHHHHHHHHHHHHU....==U...................=***==***==***=****...TT",
      "TT..=****=****=****=***...==KKK==KKK===*....==*...................=***==***==***=****...TT",
      "TT..=****=****=****=***...=============*....==*...................=***==***==***=****...TT",
      "TT..=****=****=****=***...==UUU==UUU===.....==*...................=***==***==***=****UUUTT",
      "TT..=****=****=****=***...==KKK==KKK==========*...................=***==***==***=*******TT",
      "TT..=****=****=****=***...=============UUUU.==*...................=***==***==***=*******TT",
      "TT........................==KKK==KKK===****.==*......................................***TT",
      "TT........................=============****.==*......................................***TT",
      "TT.....................................****.==.......................................***TT",
      "TTUU........................................===================......................***TT",
      "TT**........................................===================......................***TT",
      "TT**.......................................................FBBF.........................TT",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~FBBF~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~FBBF~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~FBBF~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~FBBF~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~FBBF~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~FBBF~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~FBBF~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFBBFTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTTTT"
    ],
    start: { x: 43, y: 21 },
    station: { x: 43, y: 20, name: "三星站", shelter: { x: 40, y: 17 } },
    landmarks: [
      { name: "三星蔥田", area: [4, 4, 61, 32] },
      { name: "歌仔戲戲台", area: [25, 23, 15, 14] },
      { name: "蘭陽溪", area: [0, 40, 90, 9] }
    ],
    exits: [
      { x: 44, y: 0, to: "M14", tx: 46, ty: 55 },
      { x: 45, y: 0, to: "M14", tx: 47, ty: 55 },
      { x: 60, y: 53, to: "M51", tx: 41, ty: 1 },
      { x: 61, y: 53, to: "M51", tx: 42, ty: 1 }
    ],
    npcs: [
      { id: "scallion_farmer", x: 23, y: 10, sprite: "npc_scallion_farmer", dialog: "D_SCALLION_IDLE", quest: "Q_YL_3", quests: ["Q_YL_3"] },
      { id: "opera_actor", x: 31, y: 34, sprite: "npc_opera_actor", dialog: "D_OPERA_IDLE", quest: "Q_YL_OPERA", quests: ["Q_YL_OPERA"] }
    ],
    chests: [
      { id: "C_M50_1", x: 3, y: 4, subject: "數學", level: 3, reward: { gold: 3, exp: 2, item: null } },
      { id: "C_M50_2", x: 86, y: 8, subject: "數學", level: 3, reward: { gold: 3, exp: 2, item: "herb" } },
      { id: "C_M50_3", x: 37, y: 36, subject: "數學", level: 3, reward: { gold: 3, exp: 2, item: null } },
      { id: "C_M50_4", x: 64, y: 36, subject: "數學", level: 3, reward: { gold: 3, exp: 2, item: "guide" } },
      { id: "C_M50_5", x: 2, y: 37, subject: "數學", level: 3, reward: { gold: 2, exp: 3, item: null } }
    ],
    spawns: [
      { monster: "ly_scallion", count: 3, area: [46, 22, 19, 15] },
      { monster: "ly_kumquat", count: 2, area: [65, 4, 21, 15] },
      { monster: "ly_scallion", count: 2, area: [62, 34, 24, 7] }
    ],
    inn: { x: 32, y: 12, npc: null, price: 8, name: "三星農村民宿", sign: "民宿", dialog: "D_INN_SANXING", dialog_nocoin: "D_INN_SANXING_NOCOIN" },
    shop: null
  },

  // ───────────────────────────── M51 蘇澳・南方澳（v1.2 新增；來源 tools/bigmaps/M51.txt／.json）─────────────────────────────
  M51: {
    name: "蘇澳・南方澳", type: "town", level: 3, bgm: "town", battle_bg: "coldspring", tileset: "town",
    real_ref: "宜蘭縣蘇澳鎮（蘇澳冷泉 S170、南方澳漁港 S173、鯖魚節 S172；蘇澳站雨量 S185、S186、S200）",
    art_note: "北半是蘇澳市街與蘇澳冷泉（露天冷泉池、冷泉浴室，只畫池子外觀）、冷泉旅店；中間一整排灰白色石灰岩山壁，只有一條窄路往南；南半是南方澳漁港：魚市場、曬魚架、港內很多漁船、三條突堤，東邊防波堤伸進海裡，盡頭雲最黑（頭目）。全圖雨最多、地面濕亮。v1.2 新增，背景 tools/bigmaps/M51_bg.webp（GPT 分四塊延續法＋最小誤差接縫拼接；左上塊沿用 90×54 版的 q0 拉成 51×31 格）。",
    grid: [
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTRRRRRRRRRRRRTTTTTTTTTTTTTTTTTTTTTT==TTRRRRRRRRRRRRRR***RRRRRRRRRRRRRRRRRRRRRRRRRRRRRTTTTT",
      "TTTTTTTRRRRRRRRRRRRTTTTTTTTTTTTTTTTTTTTTT===TRRRRRRRRRRRRRR***RRRRRRRRRRRRRRRRRRRRRRRRRRRRRTTTTT",
      "TT*****HHHHHHHHHHHH**.......************.===.RRRRRRRRRRRRRR***RRRRRRRRRRRRRRRRRRRRRRRRRRRRRTTTTT",
      "TT*****HHHHHHHHHHHH**....................===.RRRRRRRRRRRRRR***RRRRRRRRRRRRRRRRRRRRRRRRRRRRRTTTTT",
      "TT*****HHHHHHHHHHHH**....................===.HHHHHHHHHHHHHH***RRRRRRRRRRRRRRRRRRRRRRRRRRRRRTTTTT",
      "TT*****............**....................===.HHHHHHHHHHHHHH***HHHHHHHHHHHHHHHHHHHHHHHHHHHHHTTTTT",
      "TT****.=============================.....===.HHHHHHHHHHHHHH***HHHHHHHHHHHHHHHHHHHHHHHHHHHHHTTTTT",
      "TT****.=============================.....===.HHHHHHDHHHHHHH...HHHHHHHHHHHHHHHHHHHHHHHHHHHHHTTTTT",
      "TT****.=============================.....==================================================TTTTT",
      "TT****.===~~~~~~~~~~====~~~~~~~~~~===....==================================================TTTTT",
      "TT****.===~~~~~~~~~~====~~~~~~~~~~==.....==================================================TTTTT",
      "TT****.===~~~~~~~~~~====~~~~~~~~~~==.....==................................................TTTTT",
      "TT****.===~~~~~~~~~~====~~~~~~~~~~===....==...................RRRRRRRRRRRRRRRRRRRRRRRRRRRRRTTTTT",
      "TT****.===~~~~~~~~~~====~~~~~~~~~~===....==...................RRRRRRRRRRRRRRRRRRRRRRRRRRRRRTTTTT",
      "TT****.===~~~~~~~~~~====~~~~~~~~~~==.....==...................RRRRRRRRRRRRRRRRRRRRRRRRRRRRRTTTTT",
      "TT****.===~~~~~~~~~~====~~~~~~~~~~==.....==...................RRRRRRRRRRRRRRRRRRRRRRRRRRRRRTTTTT",
      "TT****.===~~~~~~~~~~====~~~~~~~~~~==.....==...................RRRRRRRRRRRRRRRRRRRRRRRRRRRRRTTTTT",
      "TT****.=============================.....==...................HHHHHHHHHHHHHHHHHHHHHHHHHHHHHTTTTT",
      "TT****.============================......==...................HHHHHHHHHHHHHHHHHHHHHHHHHHHHHTTTTT",
      "TT****.============================......==...................HHHHHHHHHHHHHHHHHHHHHHHHHHHHHTTTTT",
      "TT****...................................==................................................TTTTT",
      "TT.......................................==................................................TTTTT",
      "TT============================================================================================TT",
      "TT============================================================================================TT",
      "TT....===.=.==.==========.=============.=====..==============.==================...=========..TT",
      "TT.......................................==...................................................TT",
      "TT.......................................==...................................................TT",
      "TT.......................................==...................................................TT",
      "########################################===#####################################################",
      "########################################===#####################################################",
      "########################################===#####################################################",
      "########################################===#####################################################",
      "TT==============================================================================################",
      "TTUU===========================================================================K****~~~~~~~~~~~~",
      "TTTT.RRRRRRRRRRRRRR~====~~======~~~=~======~=~==~~~~~~~~===U==K~~~==~=~~~===~===****~~~~~~~~~~~~",
      "TTTT.RRRRRRRRRRRRRR~~~~~~~===~~~~~~~~~~====~~~~~~~~~~~~~~~~~===~~~~~~~~~~~~~~K==****~~~~~~~~~~~~",
      "TTTT.RRRRRRRRRRRRRR~~~~~~~===~~~~~~~~~~====~~~~~~~~~~~~~~~~~===~~~~~~~~~~~~~~===****~~~~~~~~~~~~",
      "TTTT.RRRRRRRRRRRRRR~~~~~~~===~~~~~~~~~~====~~~~~~~~~~~~~~~~~===~~~~~~~~~~~~~~===****~~~~~~~~~~~~",
      "TTTT.HHHHHHHHHHHHHH~~~~~~~===~~~~~~~~~~====~~~~~~~~~~~~~~~~~===~~~~~~~~~~~~~~===****~~~~~~~~~~~~",
      "TTTT.HHHHHHHHHHHHHH~~~~~~~===~~~~~~~~~~====~~~~~~~~~~~~~~~~~===~~~~~~~~~~~~~~===****~~~~~~~~~~~~",
      "TTTT.HHHHHHHHHHHHHH~~~~~~~===~~~~~~~~~~====~~~~~~~~~~~~~~~~~===~~~~~~~~~~~~~~===****~~~~~~~~~~~~",
      "TTTT.HHHHHHDHHHHHHH~~~~~~~===~~~~~~~~~~====~~~~~~~~~~~~~~~~~===~~~~~~~~~~~~~~===****~~~~~~~~~~~~",
      "TTTT.===============~~~~~~===~~~~~~~~~~====~~~~~~~~~~~~~~~~~===~~~~~~~~~~~~~~===****~~~~~~~~~~~~",
      "TTTT...............~~~~~~~===~~~~~~~~~~====~~~~~~~~~~~~~~~~~===~~~~~~~~~~~~~~===****~~~~~~~~~~~~",
      "TTTT.KKKK..KKK.KKK.~~~~~~~===~~~~~~~~~~====~~~~~~~~~~~~~~~~~==K~~~~~~~~~~~~~~===K***~~~~~~~~~~~~",
      "TTTT...............~~~~~~~===~~~~~~~~~~====~~~~~~~~~~~~~~~~~===~~~~~~~~~~~~~~===****~~~~~~~~~~~~",
      "TTTT...KKK.........~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~===============~~~~",
      "TTTT........KKK..KK~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~=============K=~~~~",
      "TTTT...............~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~===============~~~~",
      "TTTT................~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "TTTT...............~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "TTTT...............~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "TTTT...............~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "TTTTUUUUUUUUUUUUUUU~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "TTTTTTTTTTTTTTTTTTT~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
    ],
    start: { x: 41, y: 22 },
    station: { x: 40, y: 22, name: "蘇澳站", shelter: { x: 36, y: 20 } },
    landmarks: [
      { name: "蘇澳冷泉", area: [7, 8, 30, 14] },
      { name: "南方澳漁港", area: [19, 34, 58, 14] },
      { name: "南方澳防波堤", area: [77, 48, 15, 3] }
    ],
    exits: [
      { x: 41, y: 0, to: "M50", tx: 60, ty: 52 },
      { x: 42, y: 0, to: "M50", tx: 61, ty: 52 }
    ],
    npcs: [
      { id: "coldspring_keeper", x: 21, y: 20, sprite: "npc_coldspring_keeper", dialog: "D_COLDSPRING_IDLE", quest: "Q_YL_4", quests: ["Q_YL_4"] },
      { id: "sa_fisher", x: 26, y: 36, sprite: "npc_sa_fisher", dialog: "D_SAFISHER_IDLE", quest: "Q_YL_5", quests: ["Q_YL_5", "Q_YL_FISH"] }
    ],
    chests: [
      { id: "C_M51_1", x: 8, y: 9, subject: "數學", level: 3, reward: { gold: 2, exp: 2, item: null } },
      { id: "C_M51_2", x: 35, y: 20, subject: "數學", level: 3, reward: { gold: 2, exp: 2, item: "herb" } },
      { id: "C_M51_3", x: 89, y: 12, subject: "數學", level: 3, reward: { gold: 2, exp: 2, item: null } },
      { id: "C_M51_4", x: 16, y: 53, subject: "數學", level: 3, reward: { gold: 2, exp: 2, item: "snack" } },
      { id: "C_M51_5", x: 60, y: 47, subject: "數學", level: 3, reward: { gold: 3, exp: 2, item: "eraser" } },
      { id: "C_M51_6", x: 41, y: 47, subject: "數學", level: 3, reward: { gold: 3, exp: 1, item: "herb" } }
    ],
    spawns: [
      { monster: "ly_bubble", count: 3, area: [44, 13, 17, 10] },
      { monster: "ly_mackerel", count: 3, area: [19, 34, 58, 14] },
      { monster: "ly_bubble", count: 2, area: [2, 26, 37, 8] },
      { monster: "wxb_raincloud", count: 1, area: [88, 49, 1, 1], boss: true, quest: "Q_YL_5" }
    ],
    inn: { x: 52, y: 10, npc: null, price: 8, bath: { price: 4, label: "♨️ 泡冷泉" }, name: "蘇澳冷泉旅店", sign: "冷泉", dialog: "D_INN_SUAO", dialog_nocoin: "D_INN_SUAO_NOCOIN", dialog_bath: "D_INN_SUAO_BATH" },
    shop: null
  },

  // ───────────────────────────── M52 坪林茶鄉（v1.3 新增；來源 tools/bigmaps/M52.txt／.json）─────────────────────────────
  M52: {
    name: "坪林茶鄉", type: "field", level: 4, bgm: "field", battle_bg: "tea", tileset: "field",
    real_ref: "新北市坪林區（坪林茶業博物館、坪林舊橋、文山包種茶；62 號 2.3、2.10.1，來源 S174、S175）",
    art_note: "四面環山的山谷小鎮：北坡、南坡是一排排茶園，谷底一條清溪，溪上一座石砌舊橋；北岸是閩南式莊園造型的茶業博物館（紅瓦主屋、木柱長廊、白牆圍牆、前牆圓形月洞門，只畫外觀），兩間茶農紅瓦小屋；南岸是茶寮（焙茶竹籠、茶簍）。東邊大路往頭城礁溪，西邊小路往木柵。v1.3 新增，背景 tools/bigmaps/M52_bg.webp（GPT 分四塊延續法＋v13_align.py 平移對齊＋最小誤差接縫拼接；西邊茶農小屋用 v13_patch.py 移出路面）。",
    grid: [
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTT=TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTT......*==....*...........................****************.*******************TTTT",
      "TTT.******==******.###################......****************==******************TTTT",
      "TTT..*****==***.**.##RRRRRRRRRRRRRRR##......****************==******************TTTT",
      "TTT.......==.......##RRRRRRRRRRRRRRR##......................==..................TTTT",
      "TTT.******==******.##RRRRRRRRRRRRRRR##......................==..................TTTT",
      "TTT.******==******.##RRRRRRRRRRRRRRR##......****************==******************TTTT",
      "TTT.......==.......##HHHHHHHHHHHHHHH##......****************==******************TTTT",
      "TTT.......==.......##HHHHHHHHHHHHHHH##......................==..................TTTT",
      "TTT.******==******.#HHHHHHHHHHHHHHHHH#......****************==******************TTTT",
      "TTT.*~****==******.#H===============H#......****************==******************TTTT",
      "TTT.......==.......#H===============H#......................==..................TTTT",
      "TTT..RRRRRRRR......#H===============H#......................==..................TTTT",
      "TTT..RRRRRRRR......#########=#########*.....................==..................TTTT",
      "TTT..RRRRRRRR......#########=#########*.....................==..................TTTT",
      "TTT..HHHHHHHH.....==================================================================",
      "TTT..HHHHHHHH.....==================================================================",
      "TTT......=........==........==..................................................UUUT",
      "===.....==.......===........==..................................................TTTT",
      "====================........==.................................RRRRRRRR.........TTTT",
      "TUUUU.......................==.................................RRRRRRRR.........TTTT",
      "TTTTT.......................==.................................RRRRRRRR.........TTTT",
      "TTTTT.......................==.................................RRRRRRRR*........TTTT",
      "TTTTT.*.....................==.................................HHHHHHHH*........TTTT",
      "TTTTT....................*.FBBF..................................................TTT",
      "TTTTT~~~~~~~~~~~~~~~~~~~~~~FBBF~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TTT",
      "TTTTT~~~~~~~~~~~~~~~~~~~~~~FBBF~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TTT",
      "TTTTT~~~~~~~~~~~~~~~~~~~~~~FBBF~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TTT",
      "TTTTT....~..**.........~*..FBBF~....*..............~..~~~~~T~~~~~~~~~~~~~~~~~~~~~TTT",
      "TTTTT.......................==.............................*.*.*...**=....**.*..TTTT",
      "TTTTT.......................==..................................................TTTT",
      "TTTTT.....======================================================================TTTT",
      "TTTTT....===================================.==.=.==.=======..==.=.==.==========TTTT",
      "TTTTT.......RRRRRRRRRR......==............**************==.*********************TTTT",
      "TTTTT.......RRRRRRRRRR......==...***********************==**********************TTTT",
      "TTTTT......*RRRRRRRRRRKK....==...***********************==.*********************TTTT",
      "TTTTT.......HHHHHHHHHH......==..........................==......................TTTT",
      "TTTTT.......HHHHHHHHHH......==......*.....**************==**********************TTTT",
      "TTTTT.....KK..........KK....==...***********************==**********************TTTT",
      "TTTTT.......................==...TTTTTTTTTT.............==......................TTTT",
      "TTTTTUUUUUUUUUUUUUUUUUUUUUUUUUUUUTTTTTTTTTTUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"
    ],
    start: { x: 37, y: 21 },
    station: { x: 36, y: 21, name: "坪林站", shelter: { x: 33, y: 20 } },
    landmarks: [
      { name: "坪林茶業博物館", area: [19, 5, 19, 13] },
      { name: "坪林舊橋", area: [27, 26, 4, 7] },
      { name: "坪林茶園", area: [3, 4, 78, 10] },
      { name: "茶寮", area: [9, 35, 16, 8] }
    ],
    exits: [
      { x: 0, y: 21, to: "M13", tx: 88, ty: 27 },
      { x: 0, y: 22, to: "M13", tx: 88, ty: 28 },
      { x: 83, y: 18, to: "M14", tx: 1, ty: 28 },
      { x: 83, y: 19, to: "M14", tx: 1, ty: 29 }
    ],
    npcs: [
      { id: "tea_farmer", x: 19, y: 41, sprite: "npc_tea_farmer", dialog: "D_TEAFARMER_IDLE", quest: "Q_PL_1", quests: ["Q_PL_1", "Q_PL_2"] }
    ],
    chests: [
      { id: "C_M52_1", x: 4, y: 7, subject: "數學", level: 3, reward: { gold: 2, exp: 2, item: null } },
      { id: "C_M52_2", x: 41, y: 5, subject: "數學", level: 3, reward: { gold: 2, exp: 2, item: "herb" } },
      { id: "C_M52_3", x: 79, y: 7, subject: "數學", level: 3, reward: { gold: 2, exp: 2, item: null } },
      { id: "C_M52_4", x: 6, y: 33, subject: "數學", level: 3, reward: { gold: 3, exp: 2, item: "guide" } },
      { id: "C_M52_5", x: 79, y: 39, subject: "數學", level: 3, reward: { gold: 3, exp: 2, item: null } }
    ],
    spawns: [
      { monster: "tea_mantis", count: 3, area: [33, 36, 46, 7] },
      { monster: "tea_moth", count: 2, area: [44, 4, 36, 11] },
      { monster: "tea_basket", count: 3, area: [5, 35, 7, 8] }
    ],
    inn: null,
    shop: null
  },

  // ───────────────────────────── M13 木柵・貓空（v1.3 新增；來源 tools/bigmaps/M13.txt／.json）─────────────────────────────
  M13: {
    name: "木柵・貓空", type: "field", level: 4, bgm: "forest", battle_bg: "tea", tileset: "field",
    real_ref: "臺北市文山區木柵、貓空（指南宮、鐵觀音茶園、壺穴；62 號 2.4、2.10.2，來源 S35、S46、S105；纜車只當背景，S47 非官方）",
    art_note: "山上的廟、山坡的茶園、溪谷的壺穴，頭頂有纜線經過。北邊石板山路下山往台北城；東邊茶園大路往坪林。指南宮只畫外觀與廟埕（門內暗、不畫神像），長石階是遊戲化設計。v1.3 新增，背景 tools/bigmaps/M13_bg.webp（GPT 分四塊延續法＋最小誤差接縫拼接）。",
    grid: [
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTRRRRRRRRRRRRRRRRTT==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTT..RRRRRRRRRRRRRRRR..==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTT..RRRRRRRRRRRRRRRR..==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTT..RRRRRRRRRRRRRRRR..==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTT..RRRRRRRRRRRRRRRR..==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTT..HHHHHHHHHHHHHHH...==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTT..HHHHHHHHHHHHHHH...==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTT..HHHHHHHHHHHHHHH...==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTU================U=.==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTK================K=.==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTT===================.==TTTTTTTTTTTTTTTTTTTTTTTTTT.TTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTT===================.==TTTTTTTTTTTRRRRRRRRRRRRRRR............TTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTUUUUUUUUSSSUUUUUUUU.==.TTTTTTTTTTRRRRRRRRRRRRRRR.......U......TTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTSSSTTTTTTTT.==...TTTTTTTTRRRRRRRRRRRRRRR.UU....U...K...TTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTSSSTTTTTTTT.==....TTT....RRRRRRRRRRRRRRR.UU....U...U..TTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTSSSTTTTTTTT.==...........HHHHHHHHHHHHHH.U......U.......TTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTSSSTTTTTTTT.==..U........HHHHHHHHHHHHHH.TT.....K....T..TTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTSSSTTTTTTTT.==.UTT......===============........KTT....TTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTSSSTTTTTTTT.==TTT.......===KK=======KK=................TTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTSSSTTTTTTTT.==.TT.......=================..............TTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTSSSTTTTTTTT.==TTTU......=================..............TTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTSSSTTTTTTTT.==.TTT......=================..............TTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTSSSTTTTTTTT.==..........=================..............TTT",
      "TTT.....TTTTTTTT..........TTT...SSS....TTT..==..........=================..............TTT",
      "TTT=======================================================================================",
      "TTT=======================================================================================",
      "TTT.......RRRRRRRRRRRRRRR...UUUUUUUUUU.UUUU.==.UUUUUUUUUUUUUUUU==..UUUUUUUUUUUUUUUU..====T",
      "TTTU......RRRRRRRRRRRRRRR..U**********U****.==.****************==.U****************U.==..T",
      "TTTTUU....RRRRRRRRRRRRRRR..****************.==.****************==.******************U..UUT",
      "TTTTTTUU..RRRRRRRRRRRRRRR..****************.==*****************==.******************T..TUT",
      "TTTTTTTTU.RRRRRRRRRRRRRRR...................==.................==.....................UTTT",
      "TTTTTTTTT..HHHHHHHHHHHHHH...UUUUUUUUUUUUUU..==.UUUUUUUUUUUUUUU.==..UUUUUU.UUUUUU.UU...TTTT",
      "TTTTTTTTT..HHHHHHHHHHHHHH..U**************U.==****************U==.U******U******U**UU.TTTT",
      "TTTTTTTTTT.HHHHHHHHHHHHHH..****************.==.****************==.******************T.TTTT",
      "TTTTTTTTT.================..................==.................==....................UTTTT",
      "TTTTTTTT..==U===U===U===U=..UUUUUUUUUUUUUUU.==.UUUUUUUUUUUUUUUU==..UUUUUUUUUUUUUUUUU.TTTTT",
      "TTTTTTT...==K===K===K===K=.U***************.==.****************==.U*****************TTTTTT",
      "TTTTTTTU..==K===K===K===K=.****************.==.****************==.******************TTTTTT",
      "TTTTTTTT..================..................==.................==....................TTTTT",
      "TTTTTTT...================..UUUUUUUUUUUUUUU.==.UUUUUUUUUUUUUUUU==..UUUUUUUUUUUUUUUUU.TTTTT",
      "TTTTTTT....................****************.==.****************==.******************T.TTTT",
      "TTT.....................K...................==..................==.....................TTT",
      "TTT====================..==============================================================TTT",
      "TTT.......=......................=..........=..........................................TTT",
      "TTTU.......U..**.....U..U..U..*UT.UU..U................U......UUUU................UU...TTT",
      "TTTTUUUUU.U*.TTT**TTT*U.TUUTTTTTT**T.U*U.U.UUUUUU..UUU.T..UUUUTTTTUUUU..U..UUUUUU.TTUUUTTT",
      "TTTTT~~~T~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~T~TT~U~~~~~~~~~~~~T~TTTT~~~UTU~TT~~~TUT~TTTTTT",
      "TTT~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TTTT",
      "TTT~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TTT",
      "TTTT~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TTT",
      "TTTT~~~~~~~~~~~~~~~~~~~~~~~~~~T~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TTTT",
      "TTTT~TT~~~~~~~~~~~~~~~~~~~~~~~~T~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~T~TTT",
      "TTTT~T~TTT~~~T~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TT~~~~~~~~~~~~~~~~~~~~~~~~~~~T~~~~TTTTTT",
      "TTT~TTT~TTTTTT~T~T~~~~~TT~T~~~~~~~~~~~~~~~~TTTTTTTTT~TTTTTT~~~TT~~~~~~TTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"
    ],
    start: { x: 63, y: 25 },
    station: { x: 60, y: 25, name: "貓空站", shelter: { x: 57, y: 23 } },
    landmarks: [
      { name: "指南宮", area: [24, 3, 19, 24] },
      { name: "貓空站", area: [56, 13, 16, 14] },
      { name: "貓空茶園", area: [26, 29, 59, 16] },
      { name: "壺穴溪谷", area: [3, 47, 84, 10] }
    ],
    exits: [
      { x: 44, y: 0, to: "M12", tx: 47, ty: 58 },
      { x: 45, y: 0, to: "M12", tx: 48, ty: 58 },
      { x: 89, y: 27, to: "M52", tx: 1, ty: 21 },
      { x: 89, y: 28, to: "M52", tx: 1, ty: 22 }
    ],
    npcs: [
      { id: "temple_volunteer_zn", x: 36, y: 13, sprite: "npc_temple_volunteer_zn", dialog: "D_TEMPLE_ZN_INTRO", quest: null, quests: [] },
      { id: "gondola_staff", x: 66, y: 22, sprite: "npc_gondola_staff", dialog: "D_GONDOLA_IDLE", quest: "Q_MK_1", quests: ["Q_MK_1"] },
      { id: "tea_farmer_mk", x: 64, y: 37, sprite: "npc_tea_farmer_mk", dialog: "D_TEAFARMER_MK_IDLE", quest: "Q_MK_2", quests: ["Q_MK_2"] }
    ],
    chests: [
      { id: "C_M13_1", x: 25, y: 6, subject: "數學", level: 3, reward: { gold: 2, exp: 2, item: null } },
      { id: "C_M13_2", x: 42, y: 6, subject: "數學", level: 3, reward: { gold: 2, exp: 2, item: "herb" } },
      { id: "C_M13_3", x: 85, y: 24, subject: "數學", level: 3, reward: { gold: 2, exp: 2, item: null } },
      { id: "C_M13_4", x: 4, y: 44, subject: "數學", level: 3, reward: { gold: 2, exp: 2, item: "snack" } },
      { id: "C_M13_5", x: 50, y: 25, subject: "數學", level: 3, reward: { gold: 2, exp: 1, item: "eraser" } },
      { id: "C_M13_6", x: 86, y: 46, subject: "數學", level: 3, reward: { gold: 2, exp: 1, item: null } }
    ],
    spawns: [
      { monster: "an_magpie", count: 3, area: [46, 29, 17, 15] },
      { monster: "mc_gondola", count: 2, area: [74, 18, 12, 8] },
      { monster: "mc_alarm", count: 3, area: [65, 29, 20, 15] },
      { monster: "mc_roaster", count: 2, area: [26, 29, 17, 15] }
    ],
    inn: { x: 17, y: 37, npc: null, price: 10, name: "貓空茶館", sign: "茶館", dialog: "D_INN_MAOKONG", dialog_nocoin: "D_INN_MAOKONG_NOCOIN" },
    shop: null
  },

  // ───────────────────────────── M12 台北城・大稻埕（v1.3 新增；來源 tools/bigmaps/M12.txt／.json）─────────────────────────────
  M12: {
    name: "台北城・大稻埕", type: "town", level: 4, bgm: "town", battle_bg: "city", tileset: "castle",
    real_ref: "臺北市（行天宮、北門承恩門、大稻埕迪化街、淡水河；62 號 2.5、2.10.3，來源 S32、S48、S103、S104、S179、S180；遊戲把相距數公里的地點壓縮成一張）",
    art_note: "宮廟城：北半是北門廣場（石造城門承恩門，門洞只當地標凹口）與行天宮廟埕（外觀；門內暗、不畫神像；廟埕沒有香爐、供桌、金爐），中間是城中大街（車站、城市旅館、武器鋪、防具店、道具店），南半是大稻埕老街三列紅磚街屋（其中一棟紅磚拱廊洋樓當地標、一間麵店），西邊是淡水河。城裡不出怪。v1.3 新增，背景 tools/bigmaps/M12_bg.webp（GPT 分四塊延續法＋最小誤差接縫拼接；q2 用 v13_shiftpaste.py 對齊城中大街）。",
    grid: [
      "~~~~~##TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "~~~~~##TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "~~~~~##TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "~~~~~##===TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "~~~~~##===TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTTTTTRRRRRRRRRRRRRRRRRRRRRRRRRRRRRTTTT=TTTTT",
      "~~~~~##===TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==.TTTTTTTRRRRRRRRRRRRRRRRRRRRRRRRRRRRRTTTT=TTTTT",
      "~~~~~##======================================TT==TTTTTTTTRRRRRRRRRRRRRRRRRRRRRRRRRRRRRTTTT=TTTTT",
      "~~~~~##=====UUU========================UUU===TT==.TTTTTTTRRRRRRRRRRRRRRRRRRRRRRRRRRRRRTT..=TTTTT",
      "~~~~~##=====UUU======RRRRRRRRRRRRR=====UUU===TT==.TTTTTTTRRRRRRRRRRRRRRRRRRRRRRRRRRRRRTTUU=TTTTT",
      "~~~~~##=====UUU======RRRRRRRRRRRRR=====UUU===TT==UTTTTTTTRRRRRRRRRRRRRRRRRRRRRRRRRRRRRTTTT=TTTTT",
      "~~~~~##======TT======RRRRRRRRRRRRR=====TTT===TT==TTTTTTTTTHHHHHHHHHHHHHHHHHHHHHHHHHHHTTTT.=TTTTT",
      "~~~~~##=============##############===========TT==TTTTTT.TTHHHHHHHHHHHHHHHHHHHHHHHHHHHTTTT.=TTTTT",
      "~~~~~##=============##############===========TT==TTTTTT=================================..=TTTTT",
      "~~~~~##=============#####===######===========TT==.TTTT==================================UU=.TTTT",
      "~~~~~##=============#####===######===========TT==UTTTT==================================UU=UTTTT",
      "~~~~~##=============#####===######===========TT==UT...==================================TT=TTTTT",
      "~~~~~##=============#####===######===========TT==TT.UU==================================..=TTTTT",
      "~~~~~##======================================TT==.TUUU==================================..=TTTTT",
      "~~~~~##======================================TT==UTTTT==================================TT=TTTTT",
      "~~~~~##=================RRRRRRRRRRRRR==UUU===TT==UTTTTRRRRRRRRRR==RRRRRRRRRR=RRRRRRRRRRR..=TTTTT",
      "~~~~~##===...........UUURRRRRRRRRRRRRUUUUU===TT==TTTTTRRRRRRRRRR==RRRRRRRRRR=RRRRRRRRRRR..=TTTTT",
      "~~~~~##===..UU..*..*U***RRRRRRRRRRRRRTTUUU===TT==.TTTTRRRRRRRRRR==RRRRRRRRRR=RRRRRRRRRRRUU=TTTTT",
      "~~~~~##===..***.....****HHHHHHHHHHHHHTTUUU===TT==UTTTTRRRRRRRRRR==RRRRRRRRRR=RRRRRRRRRRRTT=.TTTT",
      "~~~~~##===...*...**...**HHHHHHHHHHHHHTTTTT===TT==TTTTTHHHHHHHHHH==HHHHHHHHHH=HHHHHHHHHHHTT=.TTTT",
      "~~~~~##U..U...........**HHHHHHHHHHHHH*.......TT==TTTTTHHHHHHHHHH==HHHHHHHHHH=HHHHHHHHHHHTT=UTTTT",
      "~~~~~##**.*..........***HHHHHHHHHHHHH*UU..**..*==TTTTTHHHHHHHHHH==HHHHHHHHHH=HHHHHHHHHHHTT=TTTTT",
      "~~~~~##*T*............**HHHHHHHHHHHHH***.......==TTTTTHHHHHHHHHH==HHHHHHHHHH=HHHHHHHHHHHTT=TTTTT",
      "~~~~~##*T*UU.*........**HHHHHHHHHHHHH**........==.TTTTHHHHHHHHHH==HHHHHHHHHH=HHHHHHHHHHHTT=TTTTT",
      "~~~~~##*****..........**HHHHHHHHHHHHH*...*.....==............................................TTT",
      "#######========================================================================================T",
      "================================================================================================",
      "================================================================================================",
      "~~~~~##========================================================================================T",
      "~~~~~##====URRRRRRRRRRURRRRRRRRRRRRUURRRRRRRRRU==UURRRRRRRRRRUURRRRRRRRRRRRUURRRRRRRRRRRRRUUUUUT",
      "~~~~~##====TRRRRRRRRRRTRRRRRRRRRRRRTTRRRRRRRRRT==TTRRRRRRRRRRTTRRRRRRRRRRRRTTRRRRRRRRRRRRRTTTTTT",
      "~~~~~##====THHHHHHHHHHTHHHHHHHHHHHHTTHHHHHHHHHT==TTHHHHHHHHHHTTHHHHHHHHHHHHTTHHHHHHHHHHHHHTTTTTT",
      "~~~~~##====THHHHHHHHHHTHHHHHHHHHHHHTTHHHHHHHHHT==TTHHHHHHHHHHTTHHHHHHHHHHHHTTHHHHHHHHHHHHHTTTTTT",
      "~~~~~##====THHHHHHHHHHTHHHHHHHHHHHHTTHHHHHHHHHT==TTHHHHHHHHHHTTHHHHHHHHHHHHTTHHHHHHHHHHHHHTTTTTT",
      "~~~~~##====THHHHHHHHHHTHHHHHHHHHHHHTTHHHHHHHHHT==TTHHHHHHHHHHTTHHHHHHHHHHHHTTHHHHHHHHHHHHHTTTTTT",
      "~~~~~##====THHHHHHHHHHTHHHHHHHHHHHHTTHHHHHHHHHT==TTHHHHHHHHHHTTHHHHHHHHHHHHTTHHHHHHHHHHHHHTT=TTT",
      "~~~~~##======================================================================================TTT",
      "~~~~~##=====UURRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR==UURRRRRRRRRRRUURRRRRRRRRRRU=UURRRRRRRRRRRUU=TTT",
      "~~~~~##=====TTRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR==TTRRRRRRRRRRRTTRRRRRRRRRRRT=TTRRRRRRRRRRRTT=TTT",
      "~~~~~##=====TTHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH==TTHHHHHHHHHHHTTHHHHHHHHHHHT=TTHHHHHHHHHHHTT=TTT",
      "~~~~~##=====TTHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH==TTHHHHHHHHHHHTTHHHHHHHHHHHT=TTHHHHHHHHHHHTT=TTT",
      "~~~~~##=====TTHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH==TTHHHHHHHHHHHTTHHHHHHHHHHHT=TTHHHHHHHHHHHTT=TTT",
      "~~~~~##======================================================================================TTT",
      "~~~~~##========================================================.............==...............TTT",
      "~~~~~##====UURRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR==UURRRRRRRRRRRR.............==T.UU..UU...UU..TTT",
      "~~~~~##====TTRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR==TTRRRRRRRRRRRRUU.~~~~~~~~~.==.UTT.TUTU.UTT..TTT",
      "~~~~~##====TTRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR==TTRRRRRRRRRRRRTTT~~~~~~~~~.==.TTTTTTTT.TTTT.TTT",
      "~~~~~##====TTHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH==TTHHHHHHHHHHHHTTT~~~~~~~~~.==..TTTTTT...TT..TTT",
      "~~~~~##====TTHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH==TTHHHHHHHHHHHHTTT~~~~~~~~~.==..TTTTTTU.TTT..TTT",
      "~~~~~##====TTHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH==TTHHHHHHHHHHHHTTT~~~~~~~~~.==.UTTTTTTU.TTT..TTT",
      "~~~~~##====TTHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH==TTHHHHHHHHHHHH.TT~~~~~~~~~U==.TTTT.TTT.TTTU.TTT",
      "~~~~~##========================================================.TT.TTTTTTTTT==.........TTTTTUTTT",
      "~~~~~##*........UU...............UU..........UU==UUUUUUUUUUUUUU....TTTTTTTTT==U..U....UTTTTTTTTT",
      "~~~~~##T*......U**U..UU...UUU...U**U....UU..U**==TTTTTTTTTTTTTTUUUUTTTTTTTTTUUTUUTUUUUTTTTTTTTTT",
      "~~~~~##TTUUUUUUTTTTUUTTUUUTTTUUUTTTTUUUUTTUUTTT==TTTTTTTTTTTTTTUUUUTTTTTTTTTUUTUUTUUUUTTTTTTTTTT",
      "~~~~~##TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"
    ],
    start: { x: 16, y: 29 },
    station: { x: 16, y: 28, name: "台北站", shelter: { x: 17, y: 26 } },
    landmarks: [
      { name: "北門承恩門", area: [7, 3, 38, 17] },
      { name: "行天宮", area: [54, 3, 34, 16] },
      { name: "城中大街", area: [7, 19, 89, 14] },
      { name: "大稻埕迪化街", area: [7, 33, 56, 23] },
      { name: "淡水河岸", area: [0, 0, 7, 60] }
    ],
    exits: [
      { x: 47, y: 0, to: "M53", tx: 47, ty: 55 },
      { x: 48, y: 0, to: "M53", tx: 48, ty: 55 },
      { x: 47, y: 59, to: "M13", tx: 44, ty: 1 },
      { x: 48, y: 59, to: "M13", tx: 45, ty: 1 },
      { x: 95, y: 30, to: "M54", tx: 1, ty: 25 },
      { x: 95, y: 31, to: "M54", tx: 1, ty: 26 },
      { x: 0, y: 30, to: "M15", tx: 88, ty: 28, requires: "Q_LAMPS_MATH", requires_dialog: "D_EXIT_LOCK_CH3" },
      { x: 0, y: 31, to: "M15", tx: 88, ty: 28, requires: "Q_LAMPS_MATH", requires_dialog: "D_EXIT_LOCK_CH3" }
    ],
    npcs: [
      { id: "temple_volunteer_ht", x: 71, y: 13, sprite: "npc_temple_volunteer_ht", dialog: "D_TEMPLE_HT_INTRO", quest: null, quests: [] },
      { id: "culture_guide", x: 24, y: 18, sprite: "npc_culture_guide", dialog: "D_CULTURE_IDLE", quest: "Q_TPC_2", quests: ["Q_TPC_2"] },
      { id: "dihua_shop", x: 16, y: 46, sprite: "npc_dihua_shop", dialog: "D_DIHUA_IDLE", quest: "Q_TPC_1", quests: ["Q_TPC_1"] },
      { id: "traffic_volunteer", x: 86, y: 30, sprite: "npc_traffic_volunteer", dialog: "D_TRAFFIC_IDLE", quest: "Q_TPC_3", quests: ["Q_TPC_3"] },
      { id: "smith_taipei", x: 59, y: 28, sprite: "npc_blacksmith_m", dialog: "D_SMITH_TAIPEI_IDLE", quest: null, quests: [] },
      { id: "armor_taipei", x: 70, y: 28, sprite: "npc_shopkeeper", dialog: "D_ARMOR_TAIPEI_IDLE", quest: null, quests: [] },
      { id: "item_taipei", x: 82, y: 28, sprite: "npc_uncle_market", dialog: "D_ITEM_TAIPEI_IDLE", quest: null, quests: [] }
    ],
    chests: [
      { id: "C_M12_1", x: 8, y: 4, subject: "數學", level: 3, reward: { gold: 2, exp: 2, item: null } },
      { id: "C_M12_2", x: 90, y: 4, subject: "數學", level: 3, reward: { gold: 2, exp: 2, item: "herb" } },
      { id: "C_M12_3", x: 44, y: 21, subject: "數學", level: 3, reward: { gold: 2, exp: 2, item: null } },
      { id: "C_M12_4", x: 8, y: 55, subject: "數學", level: 3, reward: { gold: 2, exp: 2, item: "guide" } },
      { id: "C_M12_5", x: 92, y: 47, subject: "數學", level: 3, reward: { gold: 2, exp: 1, item: "eraser" } },
      { id: "C_M12_6", x: 77, y: 56, subject: "數學", level: 3, reward: { gold: 2, exp: 1, item: null } }
    ],
    spawns: [],
    inn: { x: 29, y: 29, npc: null, price: 10, name: "台北城市旅館", sign: "旅館", dialog: "D_INN_TAIPEI", dialog_nocoin: "D_INN_TAIPEI_NOCOIN" },
    shop: { x: 82, y: 28, shop_id: "item_taipei", npc: "item_taipei" },
    extra_shops: [
      { x: 59, y: 28, shop_id: "weapon_taipei", npc: "smith_taipei" },
      { x: 70, y: 28, shop_id: "armor_taipei", npc: "armor_taipei" }
    ]
  },

  // ───────────────────────────── M53 北投・關渡（v1.3 新增；來源 tools/bigmaps/M53.txt／.json）─────────────────────────────
  M53: {
    name: "北投・關渡", type: "town", level: 4, bgm: "town", battle_bg: "hotspring", tileset: "town",
    real_ref: "臺北市北投區（北投溫泉博物館 S176、地熱谷 S197、關渡自然公園 S178）",
    art_note: "山腳下的溫泉鄉：公園裡的北投溫泉博物館（兩層樓，入口在二樓，東側石階接上去，只畫外觀）、圍欄圍起來冒白煙的地熱谷青磺泉（只能遠看）、冒熱氣的溫泉溪、溫泉旅館街；往西的小路通到河口，池塘裡有紅樹林遠景（真正的紅樹林在 M05）。背景由地圖師B 畫 q0–q2、地圖組接手畫 q3 與拼接（tools/bigmaps/M53_bg.webp）。",
    grid: [
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT===TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT===TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT===TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTT..............TTTTTTTTTTT===TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTT..............TTTTTTTTTTT===TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTT..............TTTTTTTTTTT===TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTT..............TTTTTTTTTTT====================================.TTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTT..............TTTTTTTTTTT====================================.TTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTT..............TTTTTTTTTTT==........==FFFFFFFFFFFFFFFFFFFFFF==.TTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTT..............TTTTTTTTTTT==...UUU..==F~~~~~~~~~~~~~~~~~~~~F==.TTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTT..............TTTTTTTTTTT==...UUU..==F~~~~~~~~~~~~~~~~~~~~F==.TTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTT.UUU.....................==...TTT..==F~~~~~~~~~~~~~~~~~~~~F==.TTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTT.UUURRRRRRRRRRRRRRRU.....==........==F~~~~~~~~~~~~~~~~~~~~F==.TTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTT.TTTRRRRRRRRRRRRRRRR.....==........==F~~~~~~~~~~~~~~~~~~~~F==.TTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTT....RRRRRRRRRRRRRRRRKK...==...UUU..==F~~~~~~~~~~~~~~~~~~~~F==.TTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTT....RRRRRRRRRRRRRRRRSS...==...UUU..==F~~~~~~~~~~~~~~~~~~~~F==.TTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTT....RRRRRRRRRRRRRRRRSS...==...TTT..==F~~~~~~~~~~~~~~~~~~~~F==.TTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTT.UUUHHHHHHHHHHHHHHHHSS...==........==F~~~~~~~~~~~~~~~~~~~~F==.TTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTT.UUUHHHHHHHHHHHHHHHHSS...==........==F~~~~~~~~~~~~~~~~~~~~F==.TTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTT.TTTHHHHHHHHHHHHHHHHSS...==........==F~~~~~~~~~~~~~~~~~~~~F==.TTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTT....HHHHHHHHHHHHHHHHSS...==...UUU..==FFFFFFFFFFFFFFFFFFFFFF==.TTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTT....=======================...UUU..==========================.TTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTT....=======================...TTT..==========================.TTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTT....=======================........==========================.TTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTT....=======================...................................TTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTT...............................==...................................TTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTT~~~~~~~~~~~~~BB~~~~~~~~~~~~~~~~BB~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TTTTTTT",
      "TTTTTTTTTTTTTTTT~~~~~~~~~~~~~BB~~~~~~~~~~~~~~~~BB~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TTTTTTT",
      "TTTTTTTTTTTTTTTT...............................==..RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRTTT",
      "TTTTTTTTTTTTTTTT....UUU........................==..RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRTTT",
      "TTTTTTTTTTTTTTTT....UUU........................==..RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRTTT",
      "TTTTTTTTTTTTTTTT....TTT........................==..RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRTTT",
      "TTTTTTTTTTTTTTTT...............UUU.............==..HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHTTT",
      "TTTTTTTTTTTTTTTT....UUU........UUU.............==..HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHTTT",
      "TTTTTTTTTTTTTTTT....UUU........TTT.....UUU.....==..HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHTTT",
      "TT..................TTT................UUU.....==============================================TTT",
      "TT.....................................TTT.....==============================================TTT",
      "TT.............................................==============================================TTT",
      "=================================================..RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRTTT",
      "=================================================..RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRTTT",
      "TU...UUU..........UUU............UUU...........==..RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRTTT",
      "TU...UUU..........UUU............UUU...........==..HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHTTT",
      "TT...TTT..........TTT............TTT...........==..HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHTTT",
      "T%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%................==..HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHTTT",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~................==............................................TTT",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~................==...........UUU...............UUU......UUUUUUTTT",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~................==...........UUU...............UUU......******TTT",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~................==...........TTT...............TTT......******TTT",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~................==......................................******TTT",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~................==......................................******TTT",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~................==UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUTTTTTTTTT",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~................===TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTUUUUUUUUUUUUUUUU===TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT===TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT===TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"
    ],
    start: { x: 47, y: 25 },
    station: { x: 48, y: 25, name: "北投站", shelter: { x: 49, y: 24 } },
    landmarks: [
      { name: "北投溫泉博物館", area: [24, 12, 22, 14] },
      { name: "地熱谷", area: [57, 7, 26, 18] },
      { name: "溫泉旅館街", area: [49, 29, 44, 16] },
      { name: "往關渡的小路", area: [0, 36, 46, 17] }
    ],
    exits: [
      { x: 47, y: 0, to: "M46", tx: 41, ty: 46, requires: "Q_YL_5", requires_dialog: "D_EXIT_LOCK_CH2" },
      { x: 48, y: 0, to: "M46", tx: 42, ty: 46, requires: "Q_YL_5", requires_dialog: "D_EXIT_LOCK_CH2" },
      { x: 47, y: 56, to: "M12", tx: 47, ty: 1 },
      { x: 48, y: 56, to: "M12", tx: 48, ty: 1 },
      { x: 0, y: 39, to: "M05", tx: 88, ty: 38 },
      { x: 0, y: 40, to: "M05", tx: 88, ty: 39 }
    ],
    npcs: [
      { id: "bt_museum_guide", x: 39, y: 23, sprite: "npc_bt_museum_guide", dialog: "D_BTGUIDE_IDLE", quest: "Q_BT_1", quests: ["Q_BT_1"] },
      { id: "geo_ranger", x: 57, y: 15, sprite: "npc_geo_ranger", dialog: "D_GEORANGER_IDLE", quest: "Q_BT_2", quests: ["Q_BT_2"] }
    ],
    chests: [
      { id: "C_M53_1", x: 22, y: 4, subject: "數學", level: 3, reward: { gold: 2, exp: 2, item: null } },
      { id: "C_M53_2", x: 82, y: 24, subject: "數學", level: 3, reward: { gold: 2, exp: 2, item: "herb" } },
      { id: "C_M53_3", x: 46, y: 30, subject: "數學", level: 3, reward: { gold: 2, exp: 2, item: null } },
      { id: "C_M53_4", x: 92, y: 38, subject: "數學", level: 3, reward: { gold: 2, exp: 2, item: "snack" } },
      { id: "C_M53_5", x: 2, y: 41, subject: "數學", level: 3, reward: { gold: 2, exp: 1, item: "guide" } },
      { id: "C_M53_6", x: 88, y: 45, subject: "數學", level: 3, reward: { gold: 2, exp: 1, item: null } }
    ],
    spawns: [
      { monster: "gt_steam", count: 3, area: [57, 7, 26, 18] },
      { monster: "gt_jade", count: 2, area: [16, 29, 30, 9] },
      { monster: "gt_steam", count: 2, area: [2, 39, 44, 6] }
    ],
    inn: { x: 56, y: 36, npc: null, price: 10, bath: { price: 5, label: "♨️ 泡溫泉" }, name: "北投溫泉旅館", sign: "溫泉", dialog: "D_INN_BEITOU", dialog_nocoin: "D_INN_BEITOU_NOCOIN", dialog_bath: "D_INN_BEITOU_BATH" },
    shop: null
  },

  // ───────────────────────────── M54 信義（v1.3 新增；來源 tools/bigmaps/M54.txt／.json）─────────────────────────────
  M54: {
    name: "信義", type: "town", level: 4, bgm: "town", battle_bg: "city", tileset: "town",
    real_ref: "臺北市信義區（臺北101 S181、四四南村 S207、象山 S209、臺北市政府 S210）",
    art_note: "大樓林立的新市區：中間是臺北101（底座擋、塔身用上層格畫高，不寫樓層數）；西北四四南村四棟對稱的眷村屋與小碉堡；東北市政府外觀；東南角象山步道（石階上去有觀景台，可以遠望 101）。背景 q0–q2 由地圖師B 畫、地圖組對齊 q1/q2 並畫 q3（tools/bigmaps/M54_bg.webp）。",
    grid: [
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTUUUUUUTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTT===========================UUUUUU========T=============TTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTU......UU==UU....U..U======UUUUUU==================U.RRRRRRRRRRRRRRRRRRRRRRRRTTT",
      "TTTTTRRRRRRRR==RRRRRRRRTT==UU==UUUUUU==============.U==TTRRRRRRRRRRRRRRRRRRRRRRRRTTT",
      "TTTTTRRRRRRRR==RRRRRRRRTT==TT==UUUUUU==============UU==TTRRRRRRRRRRRRRRRRRRRRRRRRTTT",
      "TTTTTRRRRRRRR==RRRRRRRRTT======UUUUUU==============TT==TTRRRRRRRRRRRRRRRRRRRRRRRRTTT",
      "TTTTTHHHHHHHH==HHHHHHHHTT======UUUUUU==================TTRRRRRRRRRRRRRRRRRRRRRRRRTTT",
      "TTTTTHHHHHHHH==HHHHHHHHTT======UUUUUU==================TTRRRRRRRRRRRRRRRRRRRRRRRRTTT",
      "TT=============================UUUUUU==================TTHHHHHHHHHHHHHHHHHHHHHHHHTTT",
      "TT=============================UUUUUU==================TTHHHHHHHHHHHHHHHHHHHHHHHHTTT",
      "TT..UUU...U.U==U......UUU======UUUUUU==================TTHHHHHHHHHHHHHHHHHHHHHHHHTTT",
      "TT..TRRRRRRRR==RRRRRRRRUU======UUUUUU==================TTHHHHHHHHHHHHHHHHHHHHHHHHTTT",
      "TTTTTRRRRRRRR==RRRRRRRRTT======UUUUUU==================TTTTTTTTTT=======TTTTTTTTTTTT",
      "TTTTTHHHHHHHH==HHHHHHHH..======UUUUUU=========================================TTTTTT",
      "TTTTTHHHHHHHH==HHHHHHHHU.======UUUUUU========================================UTTTTTT",
      "TTTTTHHHHHHHH==HHHHHHHHTU======UUUUUU====================================UUUUTTTTTTT",
      "TTTKK......TT==TTTTTTTTTT======UUUUUU===U================RRRRRRRRRRRR===.TTTTTTTTTTT",
      "TTTKKUU....TT==TTTTTTTTTT======UUUUUU===TT=======.U====UURRRRRRRRRRRR..UUTTTTTTTTTTT",
      "TTTTTTTT.TTTT==TTTTTTTTTT======UUUUUU============UU====TTRRRRRRRRRRRRUUUTTTTTTTTTTTT",
      "TT=========================RRRRRRRRRRRRRR========TT====TTRRRRRRRRRRRRTTTTTTTTTTTTTTT",
      "TTUUTTTTTTTTTTTTTUUTTTTUU==RRRRRRRRRRRRRR==============TTRRRRRRRRRRRRTTTTTFFFFFFFTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTT==RRRRRRRRRRRRRR==============TTHHHHHHHHHHHHTTTTTFBBBBBFTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTT==RRRRRRRRRRRRRR==============TTHHHHHHHHHHHHTTTTTFBBBBBFTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTT==HHHHHHHHHHHHHH==============TTHHHHHHHHHHHHTTTTTTUSSUUTTTT",
      "===========================HHHHHHHHHHHHHH==============TTHHHHHHHHHHHHTTTTTTTSSTTTTTT",
      "==========================UHHHHHHHHHHHHHH===========================TTTTTTT.SSTTTTTT",
      "T=U=RRRRRRRRRRTRRRRRRRRRR=THHHHHHHHHHHHHH===================.U=UUTUUTTTTTTTUSSTTTTTT",
      "TTTTRRRRRRRRRRTRRRRRRRRRR==T=TTT===TT==TT==================UUTTTTTTTTTTTTTTTSSTTTTTT",
      "TTTTRRRRRRRRRRTRRRRRRRRRR==============================.UUUUTTTTTTTTTTTTTTTTSSTTTTTT",
      "TTTTHHHHHHHHHHTHHHHHHHHHH=============================TTTTTTTTTTTTTTTTTTTTTTSSTTTTTT",
      "TTTTHHHHHHHHHHTHHHHHHHHHH==UU=============UU===========TTT=.T...TTTTTTTTTTTTSSTTTTTT",
      "TTTTHHHHHHHHHHTHHHHHHHHHH==TT=============TT============T==UTU........TTTTTTSSTTTTTT",
      "TTTTHHHHHHHHHHTHHHHHHHHHHU=================================TTT..........TTT.SSTTTTTT",
      "TTTTTTTT==TTTTTTTTT==TTTTT=================================............UTTTUSSTTTTTT",
      "TTTT.........TTT........TT===========================U=====..........T.UTTTTSSTTTTTT",
      "TTTTUU......UTTTU.....UUTT===========================U=====.U.........TTTTTTSSTTTTTT",
      "TTTTTTTT..TTTTTTTTT...TTTT=================UU========TT====UUU..........TTTTSSTTTTTT",
      "TTTT=======================================TT==============TTT...T......TTTTSSTTTTTT",
      "TTT===================================================================UTTTTTSSTTTTTT",
      "TTTU=================================================================UTTTTTTSSTTTTTT",
      "TTTTU............RRRRRRRRRRR....RRRRRRRRRRRRRRRRRRRRRRRRTU=UU.....UUUUTTTTTTSSTTTTTT",
      "TTTTTU..........URRRRRRRRRRRU..URRRRRRRRRRRRRRRRRRRRRRRRTT=TUUT...FFFFFFFFFFSSTTTTTT",
      "TTTTTTT.........TRRRRRRRRRRRT..TRRRRRRRRRRRRRRRRRRRRRRRRTT=.TT....BBBBBBBBBBBBTTTTTT",
      "TTTTT...........TRRRRRRRRRRRTT.TRRRRRRRRRRRRRRRRRRRRRRRRTT=....UU.FFFFFFFFFFFFTTTTTT",
      "TTTT............THHHHHHHHHHHT..THHHHHHHHHHHHHHHHHHHHHHHHTT=....TUUTTTTTTTTTTTTTTTTTT",
      "TTTT.U...........HHHHHHHHHHHT..THHHHHHHHHHHHHHHHHHHHHHHHTT=.....TTTTTTTTTTTTTTTTTTTT",
      "TTTTTT..........UHHHHHHHHHHHT..THHHHHHHHHHHHHHHHHHHHHHHHTT=UU...TTTTTTTTTTTTTTTTTTTT",
      "TTTTTTUUU.......THHHHHHHHHHHT..THHHHHHHHHHHHHHHHHHHHHHHHTT=UTU..TTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTT....................................TTTTTTTTTTTTT=TTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTT......UU...UU........U...U.U.....U.U.....TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTUUUUUUTTUUUTTUUUUUUU.TUUUTTTU.UUUTTTUUUUUTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTUUUUUUTTUUUTTUUUUUUUUTUUUTTTUUUUUTTTUUUUUTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"
    ],
    start: { x: 7, y: 25 },
    station: { x: 6, y: 25, name: "信義站", noShelter: "西口大路北側是四四南村外的樹籬花圃、南側是辦公大樓，放候車亭會壓到背景或擋住 2 格寬的西口" },
    landmarks: [
      { name: "臺北101", area: [27, 0, 14, 28] },
      { name: "四四南村", area: [3, 3, 22, 17] },
      { name: "象山步道", area: [66, 20, 15, 25] },
      { name: "臺北市政府", area: [56, 2, 26, 12] }
    ],
    exits: [
      { x: 0, y: 25, to: "M12", tx: 94, ty: 30 },
      { x: 0, y: 26, to: "M12", tx: 94, ty: 31 }
    ],
    npcs: [
      { id: "observatory_staff", x: 34, y: 29, sprite: "npc_observatory_staff", dialog: "D_OBSERV_IDLE", quest: "Q_XY_1", quests: ["Q_XY_1"] },
      { id: "village_guide", x: 13, y: 10, sprite: "npc_village_guide", dialog: "D_VILLAGE_IDLE", quest: "Q_XY_2", quests: ["Q_XY_2"] }
    ],
    chests: [
      { id: "C_M54_1", x: 3, y: 10, subject: "數學", level: 3, reward: { gold: 2, exp: 2, item: null } },
      { id: "C_M54_2", x: 77, y: 14, subject: "數學", level: 3, reward: { gold: 2, exp: 2, item: null } },
      { id: "C_M54_3", x: 79, y: 22, subject: "數學", level: 3, reward: { gold: 2, exp: 2, item: "herb" } },
      { id: "C_M54_4", x: 4, y: 46, subject: "數學", level: 3, reward: { gold: 3, exp: 2, item: "guide" } },
      { id: "C_M54_5", x: 61, y: 35, subject: "數學", level: 3, reward: { gold: 3, exp: 2, item: null } }
    ],
    spawns: [
      { monster: "mc_signal", count: 3, area: [41, 26, 15, 13] },
      { monster: "mc_vending", count: 2, area: [58, 30, 15, 12] }
    ],
    inn: { x: 22, y: 49, npc: null, price: 10, name: "信義城市旅館", sign: "旅館", dialog: "D_INN_XINYI", dialog_nocoin: "D_INN_XINYI_NOCOIN" },
    shop: null
  },

  // ───────────────────────────── M15 石門水庫・大溪（v1.4 新增；來源 tools/bigmaps/M15.txt／.json）─────────────────────────────
  M15: {
    name: "石門水庫・大溪", type: "field", level: 4, bgm: "field", battle_bg: "reservoir", tileset: "field",
    real_ref: "桃園市石門水庫（T1、T2）與大溪老街（T3 牌樓、T4 豆干）、大溪木藝生態博物館（T5）",
    art_note: "北半部水庫湖面；一道弧形土石大壩橫過中間（壩頂步道 2 格寬、湖側一排水門、石塊坡面、溢洪道上有小橋、右岸山脊的排洪隧道口只是裝飾）；壩下溪谷公園有小溪與木橋；東半部大溪老街：北排巴洛克石雕牌樓店面（含豆干店、旅店）、南排紅磚牌樓住家，南邊木藝工坊。背景 tools/bigmaps/M15_bg.webp（GPT 分四塊；溢洪道小橋是局部補畫 M15_sp_fixed.png）。",
    grid: [
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTT~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TTTTTTTTTTTTTTTTTTTT",
      "TTTTTT==T~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TTTTTTTTTTTTTTTTTTTT",
      "TTTTTT==.~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TTTTTTTTTTTTTTTTTTTT",
      "TTTTTT==.~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TTTTTTTTTTTTTTTTTTTT",
      "TTTTTT==.~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TTTTTTTTTTTTTTTTTTTT",
      "TTTTTT==.~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TTTTTTTTTTTTTTTTTTTT",
      "TTTTTT==U~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TTTTTTTTTTTTTTTTTTTT",
      "TTTT..==T~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TTTTTTTTTTTTTTTTTTTT",
      "TTTTUU==.~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TTTTTTTTTTTTTTTTTTTT",
      "TTTTTT==U~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TTTTTTTTTTTTTTTTTTTT",
      "TTTTTT==T~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TTTTTTTTTTTTTTTTTTTT",
      "TTTTTT==.~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TTTTTTTTTTTTTTTTTTTT",
      "TTTTTT==U~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TTTTTTTTTTTTTTTTTTTT",
      "TTTTTT==T~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TTTTTTTTTTTTTTTTTTTT",
      "TTTTTT==T~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TTTTTTTTTTTTTTTTTTTT",
      "TTTTTT==T~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TTTTTTTTTTTTTTTTTTTT",
      "TTTTTT==.~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TKKTTTTTTTTTTTTTTTTT",
      "TTTTTT==.~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TKKTTTTTTTTTTTTTTTTT",
      "TTTTTT==.KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK==TTTTTTTTT..TTTTTT",
      "TTTTTT===FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFKKFFFFFFFFFFF=T.............TTTT",
      "TTTTTT===================================================================.........U.U.TTTT",
      "TTTTTT===================================================================........TTTTTTTTT",
      "TTTTTTSS##################################################~~~#########==UUU.......TTTTTTTT",
      "TTTTTTSS##################################################~~~#########==TTTTT.....TTTTTTTT",
      "TTTTTTSS##################################################~~~#########==TTTTT..TUUTTTTTTTT",
      "TTTTTTSS##################################################~~~#########==TTTTTTTTTTTTTTTTTT",
      "TTTTTTSS##################################################~~~#============================",
      "TTTTTT==................................T.....TT..........~~~T============================",
      "TTTTT.==TUUUTT........................UUT.......U..U......~~~TRRRRRRRRRRRRRRRRRRRRRRRRRRRT",
      "TTTTTU==.TTT..T.....T.................TTT.....TTUUUTT.....~~~TRRRRRRRRRRRRRRRRRRRRRRRRRRRT",
      "TTTTTT==...............................TT.......TTT....TTTTTTTRRRRRRRRRRRRRRRRRRRRRRRRRRRT",
      "TTTT.===================================================U===UTHHHHHHHHHHHHHHHHHHHHHHHHHHHT",
      "TTTTU========================================================THHHHHHHHHHHHHHHHHHHHHHHHHHHT",
      "TTTTT.........................==...................UU==TTT===THHDHHHHHHHHHHHHHHDHHHHHHHHHT",
      "TTTT..........................==............UUU....TT====================================T",
      "TTTTU.........................==............TTT......====================================T",
      "TTTTTUU..U..........UU........==.U..........TTTU.UUU.UU=UUUU.URRRRRRRRRRRRRRRRRRRRRRRRRRRT",
      "TTTTTT~~~~~~~~~~~~~~~~~~~~~~~~==~~~~~~~~~~~~~~~~~~~~~~~~~~TTTTRRRRRRRRRRRRRRRRRRRRRRRRRRRT",
      "TTTTTT~~~~~~~~~~~~~~~~~~~~~~~~==~~~~~~~~~~~~~~~~~~~~~~~~~~TTTTRRRRRRRRRRRRRRRRRRRRRRRRRRRT",
      "TTTTTT~~~~~~~~~~~~~~~~~~~~~~~~==~~~~~~~~~~~~~~~~~~~~~~~~~~TTTTHHHHHHHHHHHHHHHHHHHHHHHHHHHT",
      "TTTTTT~~~~~~~~~~~~~~~~~~~~~~~~==~~~~~~~~~~~~~~~~~~~~~~~~~~TTTTHHHHHHHHHHHHHHHHHHHHHHHHHHHT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTT.==.TTTT..T=TT..................RRRRRRRTTTTTTTTTTTTTTTTTTTTTT",
      "================================...................UUU.......RRRRRRRTTTTTTTTTTTTTTTTTTTTTT",
      "================================...................TTT.......RRRRRRRTTTTTTTTTTTTTTTTTTTTTT",
      "TUU............U..............==...................TTT....UU.HHHHHHHTTTTTTTTTTTTTTTTTTTTTT",
      "TTT...TT.....UUUU.............==......UU............T.....**.HHDHHHHTTTTTTTTTTTTTTTTTTTTTT",
      "TTTUU........TTTTT............==.....UUU.T.........UUU....**........TTTTTTTTTTTTTTTTTTTTTT",
      "TTTTT.U.......................==.....TTTT..........TTT...............TTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTT....................T..==..............T....TTTUUU............TTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTUUU............U..U....==...............UUU..TTTTTUUUUU.U..U..TTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTUUU...UTUU.UTUUTUUU.==.UUUUUUUUUUU.UUTTTU..TTTTTTTTTTTUUTUUTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTUUUTTTTTTTTTTTTTU==UTTTTTTTTTTTTTTTTTTUUTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"
    ],
    start: { x: 25, y: 33 },
    station: { x: 24, y: 33, name: "石門水庫站", shelter: { x: 21, y: 30 } },
    landmarks: [
      { name: "石門水庫", area: [9, 2, 61, 18] },
      { name: "石門水庫大壩", area: [8, 20, 63, 9] },
      { name: "大溪老街", area: [56, 28, 34, 15] },
      { name: "木藝工坊", area: [60, 43, 9, 7] }
    ],
    exits: [
      { x: 89, y: 28, to: "M12", tx: 1, ty: 30 },
      { x: 89, y: 29, to: "M12", tx: 1, ty: 31 },
      { x: 0, y: 44, to: "M16", tx: 88, ty: 19 },
      { x: 0, y: 45, to: "M16", tx: 88, ty: 19 }
    ],
    npcs: [
      { id: "reservoir_keeper", x: 36, y: 32, sprite: "npc_reservoir_keeper", dialog: "D_RESERVOIR_IDLE", quest: "Q_TY_1", quests: ["Q_TY_1", "Q_TY_2", "Q_TY_5"] },
      { id: "tofu_shop", x: 66, y: 36, sprite: "npc_tofu_shop", dialog: "D_TOFU_IDLE", quest: "Q_TY_3", quests: ["Q_TY_3"] },
      { id: "wood_artisan", x: 60, y: 48, sprite: "npc_wood_artisan", dialog: "D_WOOD_IDLE", quest: "Q_TY_4", quests: ["Q_TY_4"] }
    ],
    chests: [
      { id: "C_M15_1", x: 6, y: 4, subject: "數學", level: 3, reward: { gold: 6, exp: 5, item: null } },
      { id: "C_M15_2", x: 62, y: 28, subject: "數學", level: 3, reward: { gold: 6, exp: 5, item: "herb" } },
      { id: "C_M15_3", x: 40, y: 50, subject: "數學", level: 3, reward: { gold: 6, exp: 5, item: null } },
      { id: "C_M15_4", x: 5, y: 46, subject: "數學", level: 3, reward: { gold: 6, exp: 5, item: "guide" } },
      { id: "C_M15_5", x: 67, y: 49, subject: "數學", level: 3, reward: { gold: 5, exp: 6, item: "eraser" } },
      { id: "C_M15_6", x: 88, y: 37, subject: "數學", level: 3, reward: { gold: 5, exp: 6, item: null } }
    ],
    spawns: [
      { monster: "ty_tofu", count: 3, area: [44, 33, 13, 6] },
      { monster: "ty_carve", count: 2, area: [44, 43, 16, 8] },
      { monster: "wx_thunder", count: 3, area: [3, 3, 6, 19] },
      { monster: "ty_tofu", count: 2, area: [8, 46, 20, 7] },
      { monster: "mb_floodgate", count: 1, area: [40, 22, 1, 1], boss: true, quest: "Q_TY_5" }
    ],
    inn: { x: 80, y: 36, npc: null, price: 12, name: "大溪老街旅店", sign: "旅店", dialog: "D_INN_DAXI", dialog_nocoin: "D_INN_DAXI_NOCOIN" },
    shop: null
  },

  // ───────────────────────────── M16 新竹風城（v1.4 新增；來源 tools/bigmaps/M16.txt／.json）─────────────────────────────
  M16: {
    name: "新竹風城", type: "town", level: 4, bgm: "field", battle_bg: "windcity", tileset: "field",
    real_ref: "新竹市（迎曦門、新竹米粉、風城；63 號 2.3、2.5.2，來源 T6–T9）",
    art_note: "三面丘陵、只有西邊面海的平原城市，風很大（草、樹梢、店門布條、曬著的米粉都往右下飄）。市區中央的石板圓環上是迎曦門：花崗石條砌的城座（中間拱形門洞）、上層紅柱柱廊、歇山重檐翹脊屋頂，周圍沒有城牆（T6：1902 年已拆）。西北是紅磚街屋與城市旅店；東北是市區外圍公園；東南是米粉曬場（三排木曬架掛白色米粉）與米粉工寮；南邊小溪上一座石橋，往南的路盡頭是路牌（往苗栗）。v1.4 新增，背景 tools/bigmaps/M16_bg.webp（GPT 分四塊延續法＋最小誤差接縫拼接）。",
    grid: [
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "~~~~**TTTTTTTTTTTTTTTTTTT.TT.TTTTTTTTTTTTTTTTTTTT.TTTTTTT..TTT...TTTTTTTTTTTTTTTTTTTTTTTTT",
      "~~~~**TTTTTTTTTTTTTTTTTTT....TTTTTTTTTTTTTTTTTTTT.......T..TTTT......TTTTTTTT...TTTTTTTTTT",
      "~~~~**TTRRRRRRRR==RRRRRRRR......TTTTTTTTTTTTTTTTTU.T.....T...TTT..T......TTTTT..TTTTTTTTTT",
      "~~~~**TTRRRRRRRR==RRRRRRRRUU..T...T.TTTTTTTTTTTTTU....U......TTT..........TT.......TTTTTTT",
      "~~~~**TTRRRRRRRR==RRRRRRRRTTT.......TTTTT..TTT..TTT..UTU......TT...UU.....TT.........TTTTT",
      "~~~~**TTHHHHHHHH==HHHHHHHHT.===========...TTTT.......TTUU..........UTU....TTT....TT..TTTTT",
      "~~~~**TTHHHHHHHH==HHHHHHHHT=============...TTTU........TT..........T.TT.........TTTT.TTTTT",
      "~~~~**TTHHHHHHHH==HHHHHHHH==...........==....TTT..T........T......T.....T........TTT.TTTTT",
      "~~~~**T=====================TRRRRRRRRTU==TT...========================================TTTT",
      "~~~~**T=====================.RRRRRRRR.T==.....========================================TTTT",
      "~~~~**TURRRRRRRR==RRRRRRRR==.RRRRRRRR..==.........................U..................UTTTT",
      "~~~~**TTRRRRRRRR==RRRRRRRR==.RRRRRRRR..==.........UU.............TTU............UU..TTTTTT",
      "~~~~**TTRRRRRRRR==RRRRRRRR==.HHHHHHHHH.==....TU..TTT..............TUT........T.TTT...TTTTT",
      "~~~~**TTHHHHHHHH==HHHHHHHH==.HHHHHHHHH.==.....UU..T.U.....TU.......T.....UU......TU..TTTTT",
      "~~~~**TTHHHHHHHH==HHHHHHHH==UHHH=HHHHHU==.TT..TT...UT.....TUU...........TTT......TT...TTTT",
      "~~~~**TTHHHHHHHH==HHHHHHHH==THHH=HHHHHT==.........TT...T...TTT...........TTT..........TTTT",
      "~~~~**TTHHHHHHHH==HHHHHHHH==.HHH=HHHHH.==................T..........T...............TT.TTT",
      "~~~~**T=====================T.T.===.TTT===================================================",
      "~~~~**T=====================....===....================================================.U=",
      "~~~~**TUUU................===============..........URRRRRRRRR.U......................UUUTT",
      "~~~~**TTUUT...............==============...UU.....TTRRRRRRRRRUTTT....T.......T......TTTTTT",
      "~~~~**TTTT......................===.......TTU.....TTRRRRRRRRRTTTT......T..T.T..T.....TTTTT",
      "~~~~**TT.................T......===.........TUT..T..HHHHHHHHHTTTT.T...........T....T.TTTTT",
      "~~~~**TTU.................T.....===..........T....T.KKKKHHHHHK======================.TTTTT",
      "~~~~**TTTU............U.........===...T.T.......T...=================================TTTTT",
      "~~~~**TTRRRRRRRR.RRRRRRRRR......===..U.....T........=KKKKKKKKKKKK====KKKKKKKKKKKKK===.TTTT",
      "~~~~**TTRRRRRRRR.RRRRRRRRR......===.UTU.....UU......=KKKKKKKKKKKK====KKKKKKKKKKKKK===..TTT",
      "~~~~**TTRRRRRRRRURRRRRRRRRU.....===.TTT.U..UTUU..T..=================================.TTTT",
      "~~~~**TTHHHHHHHHUHHHHHHHHHTTTT..===..TTTT..TTTUT...T=KKKKKKKKKKKK====KKKKKKKKKKKKK===..TTT",
      "~~~~**TTHHHHHHHHTHHHHHHHHHT.....===...........T.....=KKKKKKKKKKKK====KKKKKKKKKKKKK===..TTT",
      "~~~~**TTHHHHHHHH.HHHHHHHHHT.TT..===.....TT......T...=================================.TTTT",
      "~~~~**TTHHHHHHHH.HHHHHHHHHT.....===.........T.......=KKKKKKKKKKKK====KKKKKKKKKKKKK===..TTT",
      "~~~~**TT========================================...T=KKKKKKKKKKKK====KKKKKKKKKKKKK===.TTTT",
      "~~~~**TT========================================....=================================.TTTT",
      "~~~~**TT..T....U................===..........U...T.....................................TTT",
      "~~~~**TTU.....TT................===.TTT.....UTT.......T......U...T..T.....TT.U..T.UUUUUTTT",
      "~~~~**TTTUT...TTU.......TT...T..===.........TTT............TTU........TT....TT....TTUTTTTT",
      "~~~~**TTTT.....TT...T...........===TT.T..T...TTT.T..........TTU.....T.........TT...TTTTTTT",
      "~~~~**TTT..U..........U.....U...===..U............UU..UUU.....TUU......U.........U.TTTTTTT",
      "~~~~**TT~~~~~~~~~~~~~~~~~~~~~~~FBBF~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TTT",
      "~~~~**TT~~~~~~~~~~~~~~~~~~~~~~~FBBF~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TTT",
      "~~~~**TT~~~~~~~~~~~~~~~~~~~~~~~FBBF~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TTT",
      "~~~~**TTTTT..T...T.....TT.......===T.T.....T.TTTT...T..T.....TTTT.T.....TT.T.....T...TTTTT",
      "~~~~**TTTTTU....................===......UU...TTT..........T...T......T...............TTTT",
      "~~~~**TTTTTT........UUT.T.....T.===.....TTT.......UU.....T...TTT........TT.UU....T...TTTTT",
      "~~~~**TTTTTTTT.....TTU.....TTT..===......TT......TTUU........TTTU...T.....TTTU........TTTT",
      "~~~~**TTTTTTTT.......TUU......T.===.......UTT..U..TTT...T......TT.T........TTT.T..TUUU.TTT",
      "~~~~**TTTTTTT..UUU....TT..UU....===U..UU..TTTTTTU..TT....U..............U...TTU....TTTUTTT",
      "TTTTTTTTTTTTTUUTTTUUUUTTUUTTUUUU==TTUUTTUUTTTTTTTUUUTUUUUTUUUUUUUUUUUUUUTUUUUTTUUUUTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"
    ],
    start: { x: 15, y: 22 },
    station: { x: 14, y: 22, name: "新竹站", shelter: { x: 16, y: 21 } },
    landmarks: [
      { name: "迎曦門", area: [26, 7, 15, 16] },
      { name: "新竹市區", area: [6, 3, 20, 32] },
      { name: "米粉曬場", area: [52, 21, 34, 15] },
      { name: "溪邊平原", area: [6, 36, 82, 14] }
    ],
    exits: [
      { x: 89, y: 19, to: "M15", tx: 1, ty: 44 },
      { x: 89, y: 20, to: "M15", tx: 1, ty: 45 },
      { x: 32, y: 53, to: "M17", tx: 43, ty: 1, requires: "Q_TY_5", requires_dialog: "D_EXIT_LOCK_TY" },
      { x: 33, y: 53, to: "M17", tx: 44, ty: 1, requires: "Q_TY_5", requires_dialog: "D_EXIT_LOCK_TY" }
    ],
    npcs: [
      { id: "noodle_master", x: 63, y: 26, sprite: "npc_noodle_master", dialog: "D_NOODLE_IDLE", quest: "Q_HC_1", quests: ["Q_HC_1", "Q_HC_2"] },
      { id: "hc_guide", x: 36, y: 20, sprite: "npc_hc_guide", dialog: "D_HCGUIDE_IDLE", quest: "Q_HC_3", quests: ["Q_HC_3"] }
    ],
    chests: [
      { id: "C_M16_1", x: 28, y: 4, subject: "數學", level: 3, reward: { gold: 6, exp: 5, item: null } },
      { id: "C_M16_2", x: 83, y: 6, subject: "數學", level: 3, reward: { gold: 6, exp: 5, item: "herb" } },
      { id: "C_M16_3", x: 85, y: 29, subject: "數學", level: 3, reward: { gold: 6, exp: 5, item: null } },
      { id: "C_M16_4", x: 10, y: 24, subject: "數學", level: 3, reward: { gold: 6, exp: 5, item: "snack" } },
      { id: "C_M16_5", x: 13, y: 45, subject: "數學", level: 3, reward: { gold: 5, exp: 6, item: "guide" } },
      { id: "C_M16_6", x: 84, y: 46, subject: "數學", level: 3, reward: { gold: 5, exp: 6, item: null } }
    ],
    spawns: [
      { monster: "wx_wind", count: 3, area: [50, 35, 36, 6] },
      { monster: "mc_vacuum", count: 2, area: [44, 3, 42, 16] },
      { monster: "hc_noodle", count: 3, area: [42, 22, 10, 14] },
      { monster: "wx_wind", count: 2, area: [36, 44, 48, 6] }
    ],
    inn: { x: 12, y: 19, npc: null, price: 12, name: "新竹城市旅店", sign: "旅店", dialog: "D_INN_HSINCHU", dialog_nocoin: "D_INN_HSINCHU_NOCOIN" },
    shop: null
  },

  // ───────────────────────────── M17 苗栗山城（v2.0 新增；來源 tools/bigmaps/M17.txt／.json）─────────────────────────────
  M17: {
    name: "苗栗山城", type: "field", level: 5, bgm: "field", battle_bg: "railway", tileset: "field",
    real_ref: "苗栗縣三義鄉勝興車站與舊山線（C1）、三義木雕（C2、C3）、大湖草莓（C4）、淺山相思樹林（C5）",
    art_note: "淺山丘陵：西邊山壁上的舊山線隧道口（裝飾），一條停用的舊鐵軌（枕木間長草）往東經過日式木造的勝興車站站房（古蹟，不能進；月台上小石碑不寫字），再鑽進東邊樹林；車站東北是木雕街（兩排木造工坊，門口擺動物造型木雕，不畫宗教神像）；東南是草莓園；西南是相思樹林；南邊山城民宿。壓縮的遊戲地圖（三義與大湖放在同一張）。背景 tools/bigmaps/M17_bg.webp（GPT 四塊延續法＋最小誤差接縫）。",
    grid: [
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT...T==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT......UT==..TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT.........TT==....TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT...U.......==TT..TTTTTT....TTTRRRRRRRRRRRRRRRRRRRRRRRRRRTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT..TTT......==....TTTTT..T....TRRRRRRRRRRRRRRRRRRRRRRRRRRTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT...........==..U..............RRRRRRRRRRRRRRRRRRRRRRRRRRTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT......TT..==..TTT.....U..UU..HHHHHHHHHHHHHHHHHHHHHHHHHHTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT............==......UUU.TTTTTTTHHHDHHHHHDHHHHHDHHHHHDHHHHTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTT...U..........==....UUTTUU...==============================TT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTUUUUT........T==T...TTTTTTT..==============================TT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT....U....==.....TTT.....==..RRRRRRRRRRRRRRRRRRRRRRRRRRTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTRRRRRRRRRR==..........TTT==UURRRRRRRRRRRRRRRRRRRRRRRRRRTT",
      "TT####TTTTTTTTTTTTTTTTTTTTTTTTTTTRRRRRRRRRR==...UUU.......==UURRRRRRRRRRRRRRRRRRRRRRRRRRTT",
      "TT####TTTTTTTTTTTTTTTTTTTTTTTTTTTRRRRRRRRRR==..UUTTTT.....==TTHHHHHHHHHHHHHHHHHHHHHHHHHHTT",
      "TT####TTTTTTTTTTTTTTTTTTTTTTTTTTTHHHHHHHHHH===TTTTTTT.UUUU==........TTTTTTTTTTTTTTTTTTTTTT",
      "TT#KK#TTTTTTTTTTTTTTTTTT..TTTTTTTHHHHHHHHHH===..TTTTTUUUUU==U...UU..TTTTTTTTTTTTTTTTTTTTTT",
      "TT####TTT..TTTTTTTTTTTT...TTTT=K==============..TTTTTTTTTT==T...TTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTT==============================================================TTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTT==============================================================TTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTU.UUU....TT............U...........U..===..TTUU......==...TTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTUUUUU..........U......TUUU...TTTTTTTTT===...TTTU.UT..==T....TTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTT.......TTTTT.....TTT...===============T==TTT=====.UUU.TTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTT=======================================================UTTTT...........TTTTTTTTTTTTTT",
      "TTTTT=======================================================U............UU.TTTTTTTTTTTTTT",
      "TTTTTU.....T...............................===............==TT.....UUUU..TT....TTTTTTTTTTT",
      "TTTTTTTT......UUU..U......UU..........TTT..===.TUU....UU..==......TTUUUUU....UUTTTTTTTTTTT",
      "TTTTTTTTTUU...TTUUUTU....UTTU.==================TTTTTTUUU.==U.UU....TTTTTT.UUUUTTTTTTTTTTT",
      "TTTTTTTTTTTTT...TTTTTT..TTTTT.========================TTTT==UUUUUUU........TTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTT...TTT.....TTT..================T=TTTT========TTTTTTTT............TTTTTTTTTT",
      "TTTTTTTTTTTTTTUU.TTTUUUU.TTTU.==...........===......TTTUUT===============================T",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTU==...........===.UUUT....TU.===============================T",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==...........===TTTT......T.U=UUUUUUUUUUUU==UUUUUUUUUUUUU==T",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==...........===.....UUUU...T=************==*************==T",
      "TTTTTTTTT..........TTTTTTTTTTT==...........===T..TTUUTTUU.T=************==*************==T",
      "TTTTTTTTT.......UU.TTTTTTTTTTT==...........===.....TTTTTTTT=************==*************==T",
      "TTTTTTTTT.......TT.TTTTTTTTTTT==RRRRRRRRRRR===..U....TT...===============================T",
      "TTTTTTTTT.TUU......TTTTTTTTTT.==RRRRRRRRRRRT==UUTUU.......U=UUUUUUUUUUUU==UUUUUUUUUUUUU==T",
      "TTTTTTTTT..TT.....TTTTTTTTTTT.==RRRRRRRRRRR.==TTTTTT...UU.T=************==*************==T",
      "TT==============================RRRRRRRRRRRU==TTTTTT..TTTTT=************==*************==T",
      "TT==============================RRRRRRRRRRRT==TTTTTT......T=************==*************==T",
      "TTUUUU.TUUUUUU............UU.T==HHHHHHHHHHHT==........U...===============================T",
      "TTTTTTTTTTTTTT..........TUTTU.==HHHHHDHHHHHT==UU....UUTTU.U=UUUUUUUUUUUU==UUUUUUUUUUUUU==T",
      "TTTTTTTTTTTTTT.....T..U..UTTTU================TTT..UTTTTTTT=************==*************==T",
      "TTTTTTTTTTTTTT..U.....TT.TTTTT================....TTTTTTTTT=************==*************==T",
      "TTTTTTTTTTTTTTTTTTT.......TTTT================TTT..TTTTTTTT=************==*************==T",
      "TTTTTTTTTTTTTT...........UTTTTUU......U.....==............===============================T",
      "TTTTTTTTTTTTTT.U...UU.UUUTTTTTTT...UUUTUUUUT==U...UUU...UU===============================T",
      "TTTTTTTTTTTTTTTTUUUTU.TTTTTTTTTTT.UTTTTTTTT.==T..TTTTT.UTTUUU.....UUUUU.........UUUUUUUU.T",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT..TTTTTTTTTU==........UTTTTTTUU...TTUUTUUU..UUUUUTTTUUTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTUUTTTTTTTTTT==UUUU..UUUTTTTTTTTU....TTTTTUUUUTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT.==TTTTTTTTTTTTTTTTTTUUU...TTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTU==TTTTTTTTTTTTTTTTTTUUUU..TTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"
    ],
    start: { x: 44, y: 14 },
    station: { x: 45, y: 14, name: "苗栗站", shelter: { x: 46, y: 11 } },
    landmarks: [
      { name: "勝興車站", area: [30, 11, 14, 9] },
      { name: "舊山線", area: [2, 13, 65, 7] },
      { name: "木雕街", area: [58, 4, 30, 11] },
      { name: "草莓園", area: [58, 30, 31, 18] },
      { name: "相思樹林", area: [2, 31, 28, 20] }
    ],
    exits: [
      { x: 43, y: 0, to: "M16", tx: 32, ty: 52 },
      { x: 44, y: 0, to: "M16", tx: 33, ty: 52 },
      { x: 44, y: 53, to: "M18", tx: 42, ty: 1 },
      { x: 45, y: 53, to: "M18", tx: 43, ty: 1 }
    ],
    npcs: [
      { id: "old_stationmaster", x: 38, y: 20, sprite: "npc_old_stationmaster", dialog: "D_STATIONMASTER_IDLE", quest: "Q_ML_1", quests: ["Q_ML_1", "Q_ML_2"] },
      { id: "conservation_guide", x: 14, y: 36, sprite: "npc_conservation_guide", dialog: "D_CONSERV_IDLE", quest: "Q_ML_3", quests: ["Q_ML_3"] },
      { id: "wood_carver", x: 60, y: 11, sprite: "npc_wood_carver", dialog: "D_CARVER_IDLE", quest: "Q_ML_4", quests: ["Q_ML_4"] },
      { id: "berry_farmer", x: 57, y: 33, sprite: "npc_berry_farmer", dialog: "D_BERRY_IDLE", quest: "Q_ML_5", quests: ["Q_ML_5"] },
      { id: "leopardcat_cub", x: 18, y: 44, sprite: "npc_leopardcat_cub", dialog: "D_CUB_FOUND", show: { after: "Q_ML_1", until: "Q_ML_3" } }
    ],
    chests: [
      { id: "C_M17_1", x: 3, y: 39, subject: "數學", level: 3, reward: { gold: 7, exp: 7, item: "herb" } },
      { id: "C_M17_2", x: 87, y: 9, subject: "數學", level: 3, reward: { gold: 7, exp: 7, item: "guide" } },
      { id: "C_M17_3", x: 66, y: 19, subject: "數學", level: 3, reward: { gold: 7, exp: 7, item: "eraser" } },
      { id: "C_M17_4", x: 88, y: 47, subject: "數學", level: 3, reward: { gold: 7, exp: 7, item: "snack" } },
      { id: "C_M17_5", x: 32, y: 30, subject: "數學", level: 3, reward: { gold: 6, exp: 8, item: "herb" } },
      { id: "C_M17_6", x: 25, y: 45, subject: "數學", level: 3, reward: { gold: 6, exp: 8, item: "crystal" } }
    ],
    spawns: [
      { monster: "ml_signal", count: 3, area: [6, 18, 24, 7] },
      { monster: "ml_berry", count: 3, area: [46, 26, 11, 20] },
      { monster: "ml_signal", count: 2, area: [8, 33, 14, 7] },
      { monster: "ml_berry", count: 2, area: [12, 41, 14, 6] },
      { monster: "mb_train", count: 1, area: [20, 18, 1, 1], boss: true, quest: "Q_ML_2" }
    ],
    inn: { x: 38, y: 43, npc: null, price: 14, name: "苗栗山城民宿", sign: "民宿", dialog: "D_INN_SANYI", dialog_nocoin: "D_INN_SANYI_NOCOIN" },
    shop: null
  },

  // ───────────────────────────── M18 大甲藺草鎮（v2.0 新增；來源 tools/bigmaps/M18.txt／.json）─────────────────────────────
  M18: {
    name: "大甲藺草鎮", type: "town", level: 5, bgm: "town", battle_bg: "rushfield", tileset: "field",
    real_ref: "臺中市大甲區（大甲鎮瀾宮、大甲藺、奶油酥餅；69 號 2.3、2.9.2，來源 C6–C10）",
    art_note: "以大廟為中心的小鎮：北邊是鎮瀾宮外觀（一般閩南式廟宇畫法，不畫成特定的真實外觀；門內暗、不畫神像，廟埕沒有香爐、供桌）與廟埕，北口石板路從廟東側繞下來；西邊街道有兩間糕餅店（只畫餅的圖案）與紅磚街屋；東邊水圳旁是藺草工坊（門口晾著藺草、草帽、草蓆）和三塊藺草田；南邊是稻田與芋頭田，石板路往南通往鹿港。不畫遶境隊伍。v2.0 新增，背景 tools/bigmaps/M18_bg.webp（q0–q2 地圖師A、q3 地圖師B，GPT 分四塊延續法＋最小誤差接縫；北口繞廟的石板路為 GPT 局部補畫 M18_north_fixed.png）。",
    grid: [
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTTTTTTTTTTTTT~~TTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT...T===...TTTTTTTTTTTT~~=TTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTU...==========TTTTTTTT~~=...TTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTRRRRRRRRRRRRRRRRRRR.==TTTTTTTT~~=TTTTTTRRRRRRRRRRRRRRRRTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTRRRRRRRRRRRRRRRRRRRU.=TTTTTTTT~~.TTTTTTRRRRRRRRRRRRRRRRTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTRRRRRRRRRRRRRRRRRRRTU=..TTTTTT~~...TTTTRRRRRRRRRRRRRRRRTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTRRRRRRRRRRRRRRRRRRRTT=UUTTTTTT~~=TTTTTTRRRRRRRRRRRRRRRRTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTRRRRRRRRRRRRRRRRRRRT.=TTTTT.TT~~...TTTTRRRRRRRRRRRRRRRRTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTRRRRRRRRRRRRRRRRRRR..=TTT....T~~=T.TTTTHHHHHHHHHHHHHHHHTTTTT",
      "TTTTTRRRRRRRRRRTTRRRRRRRRRRRTTRRRRRRRRRRRRRRRRRRRU.=TT....TT~~=..TTTKKKKKHHHHHHKKKKKKKTTTT",
      "TTTTTRRRRRRRRRRTTRRRRRRRRRRRTTTHHHHHHHHHHHHHHHHHTTT=TTUU....~~=.TTTTKKKKKHHHHHHKKKKKKKTTTT",
      "TTTTTRRRRRRRRRRTTRRRRRRRRRRRTTTHHHHHHHHHHHHHHHHHTT.=TTUT.T.U~~......KKKKK...==.KKKKKKKTTTT",
      "TTTTTRRRRRRRRRRTTRRRRRRRRRRRTTTHHHHHHHHHHHHHHHHHTT.=.TTT...T~~=..UU.KKKKK..====KKKKKKKTTTT",
      "TTTTTRRRRRRRRRRTTRRRRRRRRRRRTTTHHHHHHHHHHHHHHHHHTTT=.TTT...T~~.TTUTT========.==KKKKKKK.TTT",
      "TTTTTHHHHHHHHHHTTHHHHHHHHHHHTTTTTTTTT.K=======.KTT.=TTTTT..T~~=TTT.TU......UUUU........TTT",
      "TTTTTHHHHHHHHHHTTHHHHHHHHHHHTTTT.T.TT.K=======.KT===========~~=TT..TT......TTTTT....UT..TT",
      "TT..THHHHHHHHHHTTHHHHHHHHHHHT..T============================~~=.......TTT..........TT..UTT",
      "TT..TT.........TTTT.........T..T===========================BBBBT.......................TTT",
      "TT..=======================================================BBBB=========================TT",
      "TTT.=======================================================.~~.========================.TT",
      "TT..RRRRRRR=RRRRRR=RRRRRRRRRR===================..........TU~~==**********************=UTT",
      "TT.URRRRRRR.RRRRRR.RRRRRRRRRR..U================..TT...T.T.T~~==**********************=TTT",
      "TT.TRRRRRRR.RRRRRR.RRRRRRRRRR..T......UU..===........U......~~==**********************=TTT",
      "TT.TRRRRRRR.RRRRRR.RRRRRRRRRR..TU....UTTU.===UUUUUU.UTU.....~~==**********************=TTT",
      "TTTTHHHHHHH.HHHHHH.HHHHHHHHHH..TU....TTTTU===TTUTTU.TTT..TT.~~==**********************=TTT",
      "TTTTHHHHHHH.HHHHHH.HHHHHHHHHH..TTT....TTTT===.TTTTTTTT......~~==**********************=TTT",
      "TTTTHHHHHHHTHHHHHHUHHHHHHHHHHT...TT...T.T.===.TTTTTTT.....TU~~=========================TTT",
      "TTT....T..T..TT...TT..T......TT.T....TT.TU===.TTTTTTT...T..~~~~...TU.U...TT.....U.UTU.TTTT",
      "TTT.============================.UU......T===..TTTTTTTTT...BBBBTT..TUTUU...T.TTTT.TTTTTTTT",
      "TTT.============================UUU.U....T===.UTTTTTTTTTT.U.~~...UUTTTTTU.......TTTTTTTTTT",
      "TTT.U................T..........TTTTT...TT===.TTTTTTTTTTT.T.~~==**********************=TTT",
      "TTTUTT..UUU....................T.........T===UTTTTTT.......T~~==**********************=TTT",
      "TTTUT..TTTTTT.............TT..........U...===TTTTTTTU....TT.~~==**********************=TTT",
      "TTTTTT........T......T..T....T..TT...TT...===..TT...TTTT....~~==**********************=TTT",
      "TT..========================================================~~==**********************=TTT",
      "TTU.========================================================~~==**********************=TTT",
      "TTT.=~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~===...****=******.~~==**********************=TTT",
      "TTTU=~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~===..U****=******.~~=========================TTT",
      "TTTT=~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~===.UU****=******.~~==**********************.TTT",
      "TTTT=========================================.TT****=******.~~==**********************=TTT",
      "TTTT=~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~===..T****=******BBBB=**********************=TTT",
      "TT..=~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~===TTU****=******BBBB=**********************=TTT",
      "TTU.=========================================..U****=******.~~.=**********************=TTT",
      "TTTU=~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~===TUT****=******.~~==**********************=TTT",
      "TT.T=~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~===.TT****=******.~~==**********************=TTT",
      "TT..=========================================..T****=******.~~=========================TTT",
      "TTTT=~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~===UTT****=******.~~=..........TT..U........UTTT",
      "TTTT=~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~===TTT****=******.~~=.....UT.TT...UTT..TT.T.UTTT",
      "TTTT=~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~===.TT****=******.~~=..T.UTTT...U.T......U..TTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT....===..T****=******.~~=T..TTTT...TTT..TUU.TTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTU...===.UTT...........~~..TTTTTTTT.......TT..TTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTUUT===TTTT.U.U.UUUUUUTTTTTTTTTTTT.T.TTTTTTUUTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTUU.===.TTTUUUUUUUUUUUTTTTTTTTTTTTTTTTTTTTTUUTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"
    ],
    start: { x: 11, y: 31 },
    station: { x: 12, y: 31, name: "大甲站", shelter: { x: 13, y: 30 } },
    landmarks: [
      { name: "大甲鎮瀾宮", area: [29, 2, 30, 18] },
      { name: "大甲街道", area: [2, 8, 27, 26] },
      { name: "藺草田", area: [59, 0, 30, 46] },
      { name: "稻田與芋頭田", area: [3, 34, 57, 17] }
    ],
    exits: [
      { x: 42, y: 0, to: "M17", tx: 44, ty: 52 },
      { x: 43, y: 0, to: "M17", tx: 45, ty: 52 },
      { x: 42, y: 53, to: "M19", tx: 44, ty: 1, requires: "Q_ML_2", requires_dialog: "D_EXIT_LOCK_ML" },
      { x: 43, y: 53, to: "M19", tx: 45, ty: 1, requires: "Q_ML_2", requires_dialog: "D_EXIT_LOCK_ML" }
    ],
    npcs: [
      { id: "volunteer_zl", x: 44, y: 17, sprite: "npc_volunteer_zl", dialog: "D_TEMPLE_ZL_INTRO", quest: null, quests: [] },
      { id: "pastry_shop", x: 9, y: 17, sprite: "npc_pastry_shop", dialog: "D_PASTRY_IDLE", quest: "Q_DJ_3", quests: ["Q_DJ_3"] },
      { id: "rush_weaver", x: 76, y: 12, sprite: "npc_rush_weaver", dialog: "D_WEAVER_IDLE", quest: "Q_DJ_1", quests: ["Q_DJ_1", "Q_DJ_2"] }
    ],
    chests: [
      { id: "C_M18_1", x: 39, y: 1, subject: "數學", level: 3, reward: { gold: 7, exp: 7, item: "herb" } },
      { id: "C_M18_2", x: 65, y: 2, subject: "數學", level: 3, reward: { gold: 7, exp: 7, item: "guide" } },
      { id: "C_M18_3", x: 2, y: 16, subject: "數學", level: 3, reward: { gold: 7, exp: 7, item: "crystal" } },
      { id: "C_M18_4", x: 3, y: 36, subject: "數學", level: 3, reward: { gold: 7, exp: 7, item: "eraser" } },
      { id: "C_M18_5", x: 87, y: 19, subject: "數學", level: 3, reward: { gold: 6, exp: 8, item: "snack" } },
      { id: "C_M18_6", x: 63, y: 47, subject: "數學", level: 3, reward: { gold: 6, exp: 8, item: "herb", n: 2 } }
    ],
    spawns: [
      { monster: "an_egret", count: 3, area: [4, 34, 41, 15] },
      { monster: "dj_rush", count: 3, area: [62, 19, 26, 27] },
      { monster: "dj_taro", count: 3, area: [44, 34, 16, 17] },
      { monster: "an_egret", count: 1, area: [62, 45, 26, 6] }
    ],
    inn: { x: 22, y: 17, npc: null, price: 14, name: "大甲小鎮旅店", sign: "旅店", dialog: "D_INN_DAJIA", dialog_nocoin: "D_INN_DAJIA_NOCOIN" },
    shop: null
  },

  // ───────────────────────────── M19 鹿港老街（v2.0 新增；來源 tools/bigmaps/M19.txt／.json）─────────────────────────────
  M19: {
    name: "鹿港老街", type: "town", level: 5, bgm: "town", battle_bg: "lanternlane", tileset: "town",
    real_ref: "彰化縣鹿港鎮（鹿港天后宮、清代街道與日治後期市街改正的中山路、舊港；69 號 2.4、2.9.3，來源 C11–C13）",
    art_note: "西半是一間間窄長的清代紅磚街屋，夾著彎彎曲曲的紅磚窄巷（不取名、不寫街名）；東北是鹿港天后宮的外觀與廟埕（前簷下密密的網目斗栱；門內暗、不畫神像、沒有香爐供桌）；中間一條較寬的大街（中山路）旁是三棟日治立面街屋（客棧、糕餅店）；東南是石砌岸邊的河口舊港，水上停著幾艘木船。v2.0 新增，背景 tools/bigmaps/M19_bg.webp（GPT 分四塊延續法＋最小誤差接縫拼接）。",
    grid: [
      "THTTTTHTHTHTTTTTTTHTTHTTHTTTTTTTTTHHTTTTTTTH==TTTHHTTTHHTTTTTTTTTTTTTTTTTTTTTTHTTHTHTTTTTT",
      "TTTTTTHTTTTTTTHTHTTTTHTHTHTTHHHTTTTTHTTHTTH.==HHTTTTHTTTTTHTTHHTTTTHTHHTTTTTHTHTTTTTHHHTTT",
      "TTTHHHHHHHHHHHHHHHH==HHHHHHHHHHHHHHHHHHHHHH===...THHHTTTHHTHHTHHHTTHHHTTHTTTTTTTTHTTTHTTTT",
      "HHTHHHHHHHHHHHHHHHH==HHHHHHHHHHHHHHHHHHHHHHH==H..HTHRRRRRRRRRRRRRRRRRRRRRRRRRTTTHTHTTHTTTT",
      "TTTHHHHHHHHHHHHHHHH==HHHHHHHHHHHHHHHHHHHHHHH==......RRRRRRRRRRRRRRRRRRRRRRRRR.......HHTTTT",
      "THTHHHHHHHHHHHHHHHH==HHHHHHHHHHHHH============.U....RRRRRRRRRRRRRRRRRRRRRRRRRHH......TTTTT",
      "THTHHHHHHHHHHHHHHHH==HHHHHHHHHHHHH============HH....RRRRRRRRRRRRRRRRRRRRRRRRRHH.......HHHT",
      "HHTHHHHHHHHHHHHHHHH==HHHHHHHHHHHHH=HHHHHHHHH==......RRRRRRRRRRRRRRRRRRRRRRRRRHH...UU...TTT",
      "TTTH==H==HH==HH=HH===HTHHTTHHHHHHH=HHHHHHHHT==TU....RRRRRRRRRRRRRRRRRRRRRRRRRHH..UUU....TT",
      "TTT==================HHHHHHHHHHHHH=HHHHHHHHT==.T.....HHHHHHHHHHHHHHHHHHHHHHHHHH..THT...TTT",
      "TTTHHHHHHH==HHHHHHH==HHHHHHHHHHHHH=HHHHHHHHT==.......HHHHHHHHHHHHHHHHHHHHHHHHHHH.......THT",
      "TTTHHHHHHH==HHHHHHH==HHHHHHHHHHHHH=HHHHHHHHT==......HHHHHHHHHHHHHHHHHHHHHHHH=HHH....UU.TTT",
      "TTTHHHHHHH==HHHHHHH==HHHHHHHHHHHHH=HHHHHHHHT==.T....===========================H.H..UU.TTT",
      "HTTHHHHHHH==HHHHHHH====================HHTHH==....==============================....TTTTTT",
      "TTTHHHHHHH==HHHHHHH===================HHHHH.==HU..==============================.......TTT",
      "HTTHHHHHHH==HHHHHHHHHHHHHH==HHHHHHHH==HHHHHU==HT..==============================..UU...TTT",
      "TTTHHHHHHH==HTHHTHHHHHHHHH==HHHHHHHHH=HHHHHT====================================..HU...TTH",
      "TTTHHHHHHH==HHHHHHHHHHHHHH==HHHHHHHHH=HHHHHT====================================..TT...TTT",
      "TTTHHHHHHH==HHHHHHHHHHHHHH==HHHHHHHHH=HHHHHT==.U..==============================.....H.TTT",
      "TTHHHHHHHH==HHHHHHHHHHHHHH==HHHHHHHHH=HHHHTT==.H..==============================.......TTT",
      "THTHHHHHHH==HHHHHHHHHHHHHH==HHHHHHHHH=HHHHHT==HH..=====================================HHH",
      "TTTHHHHH=H============================HHHHHT==....======================================TH",
      "TTTH=====H================================HH==HT.H======================================TT",
      "TTT=====================================================================================.T",
      "THTH===================================================================================HUT",
      "TTTHHHHH==HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH==..HHHHHHHH.HHHHHHH.HHHHHHHH..............HHT",
      "TTTHHHHH=HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH==.UHHHHHHHH.HHHHHHH.HHHHHHHH..............THT",
      "TTTHHHHH==HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHT==.THHHHHHHH.HHTHTHH.HHHHHHH=..............TTT",
      "TTTHHHHH==HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHT==HTH~HHHHHH.H~HHHHH.HHHHHHHH..............HTT",
      "HTTHHHHH==HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHT==.HHHHHHHHH.HHHHHHH.HHHHHHHH..............TTT",
      "THTHHTHH==HTHHTH=HHTHHTHHTHHTHHTHHTHHHTHHHHH==..HHHHHHHH.HHHHHHH.HHHHHHHH..............HTT",
      "TTTHHHHH==HHHHH==HHHHHHHHHHHHHHHHHHH==HHHHHH==T.=======================================TTT",
      "THTHHHHH==HHHHH==HHHHHHHHHHHHHHHHHHH==HHHHHT==.U=======================================THT",
      "TTTHHHHH==HHHHH==HHHT==H=HTHHHHHHHHH==HHHHHT==TUT======================================TTT",
      "TTTHHHHHH=HHHHH================HHHHHH=HHHHHH==.T=======================================HTT",
      "TTTHHHHHH=HHHHHHHHHHH==HHHHHH==HHHHHT=HHHHHH==..=======================================TTT",
      "TTTHHTHTH=HHHHHHHHHHH==HHHHHH==HHHHHH=HHHHHT==TT=======================================TTT",
      "TTTHHHHH==HHHHHHHHHHH==HHHHHH==HHHHH==========..#######################################HTT",
      "TTTHHHHH==HHHHHHHHHHH==HHHHHHH=HHHHH==========.U#######################################TTT",
      "TTTHHHHH=HHHHHHHHHHHH==HHHHHHT=HHHHHHHHHHHHH==TH~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TTH",
      "THTHHHHH=======HHHHHH==HHHHHHT=HHHHHHHHHHHHH==..~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TTH",
      "TTHHHHHHHHHHHHHHHHHHH==HHHHHHH=HHHHHHHHHHHHH==UU~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TTT",
      "TTTHHHHHHHHHHHHHHHHHH==HHHHHH==HHHHHHHHHHHHH==HU~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~HTT",
      "TTTTTTTHHHHHHHHHHHHHH==HHHHHH=================.H~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TTT",
      "TTTHTTTHHHHHHHHHHHHHH==HHHHHHHHHHHHHHHHHH=======~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~THT",
      "THTHHHHHHHHHHHHHHHHHH==HHHHHHHHHHHHHHHHHHHHH==.U~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~HHT",
      "TTTHHHHHHHHHHHHHHHHHHH=HHHHHHHHHHHHHHHHHHHHT==HT~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TTT",
      "TTTHHHHHH=H=HH==HH==HH=H=HH=HHHHHHHHHHHHHHHT==..~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~THT",
      "TTHHHHHH=====================HHHHHTHHHHHHHHH==TU~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TTT",
      "TTTHHHHHH..H.HH...H...H..HH.THHHHHHHHHHHHHHH==.TTHHTHTT~~~T~~~~~~~~~~H~HH~TT~H~~~~HT~HHTTT",
      "HTTTHTHTT.TT.TTHT.T..UT..TTTTHHTTHHTTHHTHHHH==...TTTTTTHHTTTTHTTTTTTTTTHTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTUHHT.TTTTHTTHTTTTTTTTTTHH==.U.THTTHTTTTTTHTTTHTTTHTTTTTHTHTTTTTTHTTTTTT",
      "HHTTTTHTTTTTTTTHTTHUTTTTTTTTTTHTTTTTTTTTTTTH==.HHTTHTTTHTHHTTTTTTTTTTTTTTTTTHHTTTTTHTTTTTT",
      "TTTTTTTHHTTHTTTTTTTTTTTHTHTTTTHHTHHTTTTTTHTT==TTTTTTTTTTTTTTTTHTTTTTHTHTTTTTHTTTHHHTTTTTHT"
    ],
    start: { x: 79, y: 30 },
    station: { x: 80, y: 29, name: "鹿港站", shelter: { x: 77, y: 25 } },
    landmarks: [
      { name: "鹿港天后宮", area: [46, 2, 41, 20] },
      { name: "鹿港老街", area: [3, 2, 41, 48] },
      { name: "中山路", area: [46, 22, 41, 9] },
      { name: "鹿港舊港", area: [48, 31, 39, 18] }
    ],
    exits: [
      { x: 44, y: 0, to: "M18", tx: 42, ty: 52 },
      { x: 45, y: 0, to: "M18", tx: 43, ty: 52 },
      { x: 44, y: 53, to: "M20", tx: 47, ty: 1 },
      { x: 45, y: 53, to: "M20", tx: 48, ty: 1 }
    ],
    npcs: [
      { id: "volunteer_lk", x: 64, y: 14, sprite: "npc_volunteer_lk", dialog: "D_TEMPLE_LK_INTRO", quest: null, quests: [] },
      { id: "lk_guide", x: 3, y: 9, sprite: "npc_lk_guide", dialog: "D_LKGUIDE_IDLE", quest: "Q_LK_1", quests: ["Q_LK_1"] },
      { id: "umbrella_shop", x: 20, y: 22, sprite: "npc_umbrella_shop", dialog: "D_UMBRELLA_IDLE", quest: "Q_LK_2", quests: ["Q_LK_2"] },
      { id: "pastry_lk", x: 61, y: 31, sprite: "npc_pastry_lk", dialog: "D_PASTRYLK_IDLE", quest: "Q_LK_3", quests: ["Q_LK_3"] }
    ],
    chests: [
      { id: "C_M19_1", x: 3, y: 23, subject: "數學", level: 3, reward: { gold: 8, exp: 10, item: "guide" } },
      { id: "C_M19_2", x: 34, y: 5, subject: "數學", level: 3, reward: { gold: 8, exp: 10, item: "herb" } },
      { id: "C_M19_3", x: 36, y: 38, subject: "數學", level: 3, reward: { gold: 8, exp: 10, item: "eraser" } },
      { id: "C_M19_4", x: 8, y: 48, subject: "數學", level: 3, reward: { gold: 8, exp: 10, item: "crystal" } },
      { id: "C_M19_5", x: 85, y: 34, subject: "數學", level: 3, reward: { gold: 9, exp: 10, item: "snack" } },
      { id: "C_M19_6", x: 84, y: 19, subject: "數學", level: 3, reward: { gold: 9, exp: 10, item: "guide" } }
    ],
    spawns: [
      { monster: "gh_umbrella", count: 3, area: [3, 3, 40, 20] },
      { monster: "gh_geta", count: 2, area: [3, 26, 40, 23] },
      { monster: "gh_umbrella", count: 2, area: [55, 31, 22, 6] }
    ],
    inn: { x: 52, y: 31, npc: null, price: 16, name: "鹿港老街客棧", sign: "客棧", dialog: "D_INN_LUKANG", dialog_nocoin: "D_INN_LUKANG_NOCOIN" },
    shop: null
  },

  // ───────────────────────────── M20 北港媽祖鎮（v2.0 新增；來源 tools/bigmaps/M20.txt／.json）─────────────────────────────
  M20: {
    name: "北港媽祖鎮", type: "town", level: 5, bgm: "town", battle_bg: "levee", tileset: "town",
    real_ref: "雲林縣北港鎮（北港朝天宮、北港老街、北港溪與女兒橋、北港武德宮、花生；69 號 2.5、2.9.4，來源 C14–C18）",
    art_note: "鎮中央是朝天宮的外觀和很大的石板廟埕（門內暗、不畫神像；沒有香爐、供桌、金爐），廟埕邊停一座還沒裝好的藝閣車（竹骨架、彩布、紅燈籠）；從廟口往南的老街兩旁是兩層紅磚店屋（麻油瓶、糕餅、雜貨竹簍），街尾接北港溪堤防與北港大橋；東邊是武德宮外觀與廟埕（不畫金爐、金紙、元寶）和幾間紅磚民宅；西邊是一畦畦花生田，田邊小路盡頭有空白路牌（往嘉義）；南邊是長長的堤防步道、北港溪、北港大橋與女兒橋（兩座橋都是裝飾，不能上橋）。不畫遊行隊伍與炮。v2.0 新增，背景 tools/bigmaps/M20_bg.webp（GPT 分四塊延續法＋最小誤差接縫拼接）。",
    grid: [
      "HTTTTTTTHHHTHTTTTTTTTTTT~TTTTTTTTTTT~TTTTTTTTHT==THTTTTTTTHTTTTTTTTTTTTTTTTTTTTTTTHTTTTTTTTHTTTT",
      "THTHTTTTHTTTTTTTTTTTTTHTTTTTHT~TTHTTTTTTT~THTTT==HTTTHHTTTTTTTTTTTHTTTTTHTTTTTTTTTTTTTTHTTTTTTHT",
      "TTTHHTHTTTHTHTTTTTHTHHHTTTTTHTTTTTTHHHHT~HTTTTT==TTTHHTTTTTTTHHTTTTHTTTTTTTTHTTTTHHHTTTTHHTTTTTT",
      "TT.....TTHHHTTTRRRRRRRRRRRRRRRRRRRRRRRRRRRRTTHT==HHTTTTTHHTTRRRRRRRRRRRRRRRRRRRRRRRRRRRTTTTTHTTH",
      "TT*...T..***TTTRRRRRRRRRRRRRRRRRRRRRRRRRRRRTTHT==.TTTTHHHTTHRRRRRRRRRRRRRRRRRRRRRRRRRRRTTTTTHTTT",
      "TTT....==.....HRRRRRRRRRRRRRRRRRRRRRRRRRRRRTT..==..TTTTHTTHTRRRRRRRRRRRRRRRRRRRRRRRRRRRTHTTTTTTT",
      "TTT**T*==**U*..RRRRRRRRRRRRRRRRRRRRRRRRRRRRTTU.==.UTTTTTTTTTRRRRRRRRRRRRRRRRRRRRRRRRRRRTHHTTTTHT",
      "TTT*T**==****..RRRRRRRRRRRRRRRRRRRRRRRRRRRRHTTU==HTTHTHTTTTTRRRRRRRRRRRRRRRRRRRRRRRRRRRTTTTTTHTT",
      "HT*....==.....URRRRRRRRRRRRRRRRRRRRRRRRRRRRT.HT==HHHTTHTTHTTRRRRRRRRRRRRRRRRRRRRRRRRRRRTTTHTHTTT",
      "TT.**U*==**U*.THHHHHHHHHHHHHHHHHHHHHHHHHHHT..TT==HTTHTTTTTHTHHHHHHHHHHHHHHHHHHHHHHHHHHHHHTTTTTTH",
      "TT.****==****.HTHHHHHHHHHHHHHHHHHHHHHHHHHHT..HT==.TTHTTTHTHTTHHHHHHHHHHHHHHHHHHHHHHHHHTTTTTTTTTH",
      "TT.....==.....TTT========================TTT..H==.TTTHTHHTTTTT========================HHTTTTTTTH",
      "TT***U*==**U*.HTT========================HTTT..==.TTTTTTTHHTHT========================HHTHHTTTTT",
      "HH*****==****.TTT=========================HTTH.==.HHTTTH.HTTTT========================HTTTT=THTT",
      "TT.....==.....===================================...HTHH...=================================.HTH",
      "HT.**U*==*UU*.==========================KKKKK====.UU..TTT..=================================.THT",
      "TT.****==****.==========================KKKKK====UTT.......=================================.HTT",
      "TT.....==.....==========================KKKKK====HH=========================================.THT",
      "HT.**U*==*UU*.==========================KKKKK====HT=========================================TTTT",
      "TT.****==****.===================================...H......=================================.HTT",
      "TT.....==.....=====================================HT..HH..=================================...T",
      "TT***U*==**U*.=====================================..UUTT..=================================UUUT",
      "TT*****==****.===================================...UTHTTH.=================================TTTH",
      "HH.....==.....===================================.U.UTTTTT.=================================THTT",
      "HT.*UU*==*UU*.===================================.HTTTHTTTHU......UU..........U....UU....H..HTTT",
      "T..****==****.==================.U==========.====TTTTTTTTTTT.HT...TT.UUUU.HH.UTUHU.TTU..UT..THTT",
      "T.*....==.....==================UTUU...HH..HUT..TTTTTTTTTTT..HTTTT...HTTT.TTUHTTTT..TT.UTTTTTTTH",
      "TU**UU*==*UU*.=.U==HHHHHHHHH====HHHHHHHHHHTTH..UTTTTHTTTHHHHHHHHHHHT.HHHHHHHHHHTHHHHHHHHHHTTTTHT",
      "TTT****==****.UUT.UHHHHHHHHH====HHHHHHHHHHTTTTTTTTTTTTTTHHHHHHHHHHT..HHHHHHHHHHTHHHHHHHHHHHHTHTT",
      "HTT....==.....HHTTHHHHHHHHHH====HHHHHHHHHHTTTTTTTTTTTTTTTHHHHHHHHHT..HHHHHHHHHTTHHHHHHHHHHTTTTTT",
      "HT*UUU*==*UU*.THTTTHH~HHH~HH====HHHHHH~~HHHTHTTTHTTTTHTTTHH~HHH~~HTHUHH~HHH~HHHTHH~HHH~HHHTTTTTT",
      "TTT****==****.TTHTTHHHHHHHHH====HHHHHHHHHTTTTTHTTHTTTTTTTHHHHHHHHHTTUHHHHHHHHHTTHHHHHHHHHHHTHHTH",
      "TT*....==.....TTHHTHHHHHHHHH====HHHHHHHHHHHHTTTTTTTTT...HHTHHTHHHHTTTHTHHTTHHTHHHTHHTHHHHTTTTTTT",
      "TTTU*U*==*UU*.HTTTTHHHHHHHHH====HHHHHHHHHTTTTTTTTTTTTH...HHHHHHHHH....HHHHHHHHTTHHHHHHHHHHTHTTTT",
      "HH.****==****.....HHHHHHHHHHT===HHHHHHHHHTTTTTTTTHHTTTT....T.....TU..........TTT.........TTTTHTT",
      "HT.....==.....UU...HHHHHHTTH====HHHHHHHHHHTTTTTTTTTHH..HT...HU..TTTTHT.UHH...TTTTTHU..HH.HTHTTTT",
      "TT.**U*==**U*.TTTTUHHHHHHHHH====HHHHHHHHHHTTTTTTT...H......TTTH.......TTT.........TT..TT..TTTTTT",
      "HT.****==****.HHTTTHHHHHHHHH====HHHHHHHHHHTTTTHHTT.=========================================THTT",
      "TT.....==.....HTTHTHHHHHHHHH====HHHHHHHHHHTTHHTTTTT...H..........U...............UH.........THTT",
      "TT***U*=====*....HHHHHHHHHHH====HHHHHHHHHHTH.....TTU..TUT.......UTU...T......T..UTT......UU.HHTT",
      "HH******======..HTHHHHHHHHHH====HHHHHHHHHHT.....UTTTU.TT...T...UTTTH...HU......UTTT..TT.TTTHTTTT",
      "TTT........H==TT..T======================HT..HU.HHHTUT...HU..H.HHHTHU..TT..UUUHHTHHU......TTHTHH",
      "TTT=....TTH.KH..T..======================....TTTHTTHT....HH..TTHHTTTTK.....TTT.TTTTT...HT.THHHTT",
      "HT=======================================================================F===================TTT",
      "TT==========================FFFF====================================FFUUUF===================TTH",
      "TT==========================FFFF====================================FFBBBF===================THH",
      "HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHBBBHHHHHHHHHHHHHHHHHHHHHHH",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~##~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#BBBH~~~~~~~~~~~~~~~~~~~~TT",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~##~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#BBBH~~~~~~~~~~~~~~~~~~~~TT",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~##~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#BBBH~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~##~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#BBBH~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~##~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~H~~~~~~#BBBH~~~~~~~~~~~~~~~~~~~~~~",
      "~~TT~~~TTT~~H~~~~~TTT~~~~~~~~##~~~~~~~~~~~~~~~~~~H~~HH~T~~H~~TTT~~~~~#BBBH~~~~~~~~~~~~~H~~H~~~H~",
      "TTTTTTTTTTT~TTT~HTTTTTTHTTTH~##~~T~~~TTT~HHTTTTHTTTTTTTTTTTTTTTTTTTTH#BBBHHT~~HTT~~~~TTTTTTTTTTT",
      "TTTHTTTTHTTTTTTTTTHHTTTTTTTTH##TTTTTTTTTTTTTTTTTTTTTTTTTTTHTTHTTTTTTT#BBBHTTTTTTTTTTTTTTTTHTTTTT",
      "THTTTTTTTTTTHTHHHTTTTTTTTTTTT##HTTTTTTHHTTTHTTTTTTTHHHTTHTHTTTTTTHTTT#BBBTTTTTTTTTTTTTTHTTTTTTTT",
      "TTTTHHTTTTTTTTHTTTTTTTTTTTHTH##HTTTTHHTTTHHTTTTTTHTHHTHHHTTTTTTTHTTTH#BBBHTTTTTTTHHHTTTTTTTTTHHT"
    ],
    start: { x: 35, y: 24 },
    station: { x: 36, y: 24, name: "北港站", noShelter: "北港站在朝天宮大廟埕的南緣，四周是廟埕和老街的石板路（GPT 依配置圖留空的是步道，不是草地），放候車亭會擋住廟埕往老街的人潮動線" },
    landmarks: [
      { name: "北港朝天宮", area: [14, 3, 35, 22] },
      { name: "北港老街", area: [19, 25, 22, 18] },
      { name: "北港武德宮", area: [55, 3, 38, 21] },
      { name: "北港溪堤防", area: [2, 43, 91, 3] },
      { name: "花生田", area: [2, 3, 12, 40] }
    ],
    exits: [
      { x: 47, y: 0, to: "M19", tx: 44, ty: 52 },
      { x: 48, y: 0, to: "M19", tx: 45, ty: 52 },
      { x: 70, y: 56, to: "M04", tx: 1, ty: 22, requires: "Q_BG_4", requires_dialog: "D_EXIT_LOCK_BG" },
      { x: 71, y: 56, to: "M04", tx: 1, ty: 23, requires: "Q_BG_4", requires_dialog: "D_EXIT_LOCK_BG" },
      { x: 72, y: 56, to: "M04", tx: 1, ty: 24, requires: "Q_BG_4", requires_dialog: "D_EXIT_LOCK_BG" }
    ],
    npcs: [
      { id: "volunteer_ct", x: 28, y: 12, sprite: "npc_volunteer_ct", dialog: "D_TEMPLE_CT_INTRO", quest: null, quests: [] },
      { id: "temple_elder", x: 20, y: 14, sprite: "npc_temple_elder", dialog: "D_ELDER_BG_IDLE", quest: "Q_BG_1", quests: ["Q_BG_1"] },
      { id: "float_master", x: 42, y: 19, sprite: "npc_float_master", dialog: "D_FLOAT_IDLE", quest: "Q_BG_2", quests: ["Q_BG_2", "Q_BG_4"] },
      { id: "volunteer_wd", x: 73, y: 12, sprite: "npc_volunteer_wd", dialog: "D_TEMPLE_WD_INTRO", quest: null, quests: [] },
      { id: "oil_shop", x: 23, y: 41, sprite: "npc_oil_shop", dialog: "D_OIL_IDLE", quest: "Q_BG_5", quests: ["Q_BG_5"] },
      { id: "grocer_bg", x: 36, y: 41, sprite: "npc_grocer_bg", dialog: "D_GROCER_IDLE", quest: "Q_BG_3", quests: ["Q_BG_3"] }
    ],
    roadsigns: [
      { id: "sign_chiayi", x: 69, y: 42, dialog: "D_SIGN_CHIAYI_V30" }
    ],
    chests: [
      { id: "C_M20_1", x: 2, y: 3, subject: "數學", level: 3, reward: { gold: 8, exp: 10, item: "herb" } },
      { id: "C_M20_2", x: 92, y: 14, subject: "數學", level: 3, reward: { gold: 8, exp: 10, item: "guide" } },
      { id: "C_M20_3", x: 3, y: 41, subject: "數學", level: 3, reward: { gold: 8, exp: 10, item: "crystal" } },
      { id: "C_M20_4", x: 50, y: 14, subject: "數學", level: 3, reward: { gold: 8, exp: 10, item: "eraser" } },
      { id: "C_M20_5", x: 90, y: 44, subject: "數學", level: 3, reward: { gold: 9, exp: 10, item: "snack" } },
      { id: "C_M20_6", x: 66, y: 33, subject: "數學", level: 3, reward: { gold: 9, exp: 10, item: "guide" } }
    ],
    spawns: [
      { monster: "gh_lantern", count: 3, area: [49, 37, 43, 6] },
      { monster: "gh_civet", count: 3, area: [2, 3, 12, 38] },
      { monster: "gh_lantern", count: 2, area: [44, 40, 22, 6] },
      { monster: "mb_lantern", count: 1, area: [82, 44, 1, 1], boss: true, quest: "Q_BG_4" }
    ],
    inn: { x: 62, y: 34, npc: null, price: 16, name: "北港鎮上旅店", sign: "旅店", dialog: "D_INN_BEIGANG", dialog_nocoin: "D_INN_BEIGANG_NOCOIN" },
    shop: null
  },

  // ───────────────────────────── M21 安平海港（v3.0 新增；來源 tools/bigmaps/M21.txt／.json）─────────────────────────────
  M21: {
    name: "安平海港", type: "town", level: 5, bgm: "town", battle_bg: "anping", tileset: "town",
    real_ref: "臺南市安平：安平古堡（D1）、億載金城（D2）、劍獅（D3）、安平小吃（D4）、台江國家公園海域（D7）",
    art_note: "西北是海港：灰帆小海盜船（帆上畫雲朵、不畫骷髏；遊戲虛構）、木頭碼頭、港口書記的瞭望小樓；碼頭路南邊一段紅磚殘牆、西邊沙洲。中央偏東是斑駁的紅磚高台，台上一座一般樣式的瞭望塔（D1 沒寫現在高台上建築的樣子，不畫成特定建築），台前一段紅磚城牆遺跡。西南是方形磚造砲台，四周護城河，只有一座城門開向東（D2「城門出入一座，開向東南」；門額是空白石匾）。東南老街：四戶紅磚老屋門楣掛劍獅（以前的人說的民間說法，D3）、兩個小吃攤、兩層的港邊客棧。背景 tools/bigmaps/M21_bg.webp（GPT 四塊延續法＋最小誤差接縫）。",
    grid: [
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~FBBF~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~RRRRRR~~~~~~~~~~~~~~~~~~~~~~~~~FBBF~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~RRRRRR~~~~~~~~~~~~~~~~~~~~~~~~~FBBF~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~KKKKKKKKKK~~TTRRRRRRTTTTTTTTTTTTTTTTTTTTTTTTTFBBFTTTTTTTTTRRRRRRRTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "~KKKKKKKKKK~~THHHHHHHH....TTTT...........TTTT.===.TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "~KKKKKKKKKK~~THHHHHHHH....TTTT......UUUU.TTTT.===..........RRRRRRRTTT......T.........TTTTTTTTTTT",
      "~KKKKKKKKKK~~THHHHHHHH....TTTT..UUUUTTTT.TTTT.===..........RRRRRRR.........TUUUUU....T...TTTTTTT",
      "~KKKKKKKKKK~~THHHHHHHH....TTTT..TTTTTTTT.TTTT.===.=========HHHHHHH=========.TTTTT........TTTTTTT",
      "~KKKKKKKKKK~~THHHDHHHH..........TTTTTTTT......===......HHHHHHHHHHHHHHHH..==.TTTTT........TTTTTTT",
      "~KKKKKKKKKK~~K...=.K..KK........TTTT..........===......HHHHHHHHHHHHHHHH..==.TTTTT........TTTTTTT",
      "~~~~~BBBBBBBB====================================......HHHHHHHHHHHHHHHH..==.TTTTT..UUUUU......TT",
      "~~~~~BBBBBBBB====================================......HHHHHHHHHHHHHHHH..==........TTTTT......TT",
      "~~~~~~~~~~~~~====================================....KTHHHHHHHHHHHHHHHHK.==........TTTTT......TT",
      "~~~~~~~~~~~~~T################################===...HHHHHHHHHHHHHHHHHHHHH==........TTTTT......TT",
      "~~KKKKKKK~~~TTTTTTTTTTTTT.....................===...HHHHHHHHHHHHHHHHHHHHH==....UUUU...........TT",
      "~~KKKKKKK~TTTTTTTTTTTTTTT...............UUUUU.===.U.HHHHHHHHHHHHHHHHHHHHH==....TTTT...........TT",
      "~~KKKKKKKTTTTTTT%%%%%%%%%..UUUUU........TTTTT.===.*.HHHHHHHHHHHHHHHHHHHHH==....TTTT...........TT",
      "~~~~~~TTTTTTT%%%%%%%%%%%%..TTTTT........TTTTT.===.*.HHHHHHHHHHHHHHHHHHHHH==....TTTT...........TT",
      "~~~~~TTTTT%%%%%%%%%%%%%%%..TTTTT........TTTTT.===...HHHHHHHHHHDHHHHHHHHHH==.......*....UUUUU..TT",
      "~~T~TTTTTT%%%%%%%%%%%%%%%..TTTTT........TTTTT.===........................==.UUUU.......TTTTT..TT",
      "~~TTTTTTTT%%%%%%%%%%%%%%%..TTTTT.UUUUU........=============================.TTTT.......TTTTT..TT",
      "~~~TTTTTT%%T%%%%%%%%%%%%%........TTTTT.....UUU=============================.TTTT.......TTTTT..TT",
      "~~TTTTT%%%%%%%%%%%%%%%%%U........TTTTT.....UUU===...####################.==.TTTT.......TTTTT..TT",
      "~~TTTTTT%%%%%%%%%%%%%%%%K........TTTTT.....TTTK==.K......................==KTTTT..............TT",
      "~~TTT%%%%%%%%%%%%%%%%%%TT.....................===........................==...................TT",
      "~TTTT%%%%%%%%%%%%%%%============================================================================",
      "~TTTT%T%%%%%%%%%%%%%============================================================================",
      "~TTTT%%%U%%%%%%%%%%%=#############################...==.UUUU...UUUU....==...........==..UUUU..UT",
      "~~T~T~~%T%%%%%%%%%%U=#############################...==.TTTT...TTTT....==...........==..TTTT..TT",
      "~~~TTTTU%%%%%%%%%%%T=#############################...==.TTTT...TTTT....==...........==..TTTT..TT",
      "TT~~~TTTU%%%%%%%%%%T=#############################...==.TTTT...TTTT....==...........==..TTTT..TT",
      "~TTTT~TTT~%%%%%%%%TT=#############################...==......RRRRRRRRR.==.RRRRRRRRR.==........TT",
      "~TTTTT~TTT%~%%%%%%%T=#############################...==......RRRRRRRRR.==.RRRRRRRRR.==........TT",
      "~~~TT~~TTTTT%%%%%%%T=#############################...==......RRRRRRRRR.==.RRRRRRRRR.==........TT",
      "~~~~T~TTTT~TT%%%%%%T=#############################...==......HHHHHHHHH.==.HHHHHHHHH.==RRRRRRRRTT",
      "~~~~~~TTTTTT%%%%T%%T=########.................####...==......HHHHHHHHH.==.HHHHHHHHH.==RRRRRRRRTT",
      "~~~~~~TTTT~%%%%%%%UT=########.................####...==......HHHDHHHHH.==.HHHHDHHHH.==RRRRRRRRTT",
      "~~~~~TTTTTTU%%%%%%TT=########.................####...=================================RRRRRRRRTT",
      "~~~TTTTTTTTT%%%%%%%T=########.................####...==..UUU.RRRRRRRRR.==.RRRRRRRRR.==RRRRRRRRTT",
      "~~T~TTTTTTT%%%%%%%%T=########.................####...==..KKK.RRRRRRRRR.==.RRRRRRRRR.==RRRRRRRRTT",
      "~~~~~T~~TT%%%%%%%%%T=########.................==BBB..==......RRRRRRRRR.==.RRRRRRRRR.==RRRRRRRRTT",
      "~~~~~TTT~TTTT%%%%%%T=###########################BBB..==......RRRRRRRRR.==.RRRRRRRRR.==HHHHHHHHTT",
      "~~~TTTTTT%%%%%%%%%UT=#############################~..==..UUU.HHHHHHHHH.==.HHHHHHHHH.==HHHHHHHHTT",
      "~~~~~TTT%%%%%%%%%%TT=#############################~..==..KKK.HHHHHHHHH.==.HHHHHHHHH.==HHHHHHHHTT",
      "~~~~~TT%%%%%%%%%%%%T=#############################~..==..KKK.HHHDHHHHH.==.HHHHDHHHH.==HHHHDHHHTT",
      "~~~~TTTTT%%%%%%%%%.T=#############################~..=========================================TT",
      "~~TTTTTT%%TT%%%%%%%T=#############################...=========================================TT",
      "~~~~T~TTT%%%%%%%%%TT===================================.......................................TT",
      "~~~TTTTT%%%%%%%%%%%T..........................=========.......................................TT",
      "~~TTTT~TU%%%%%%%%%%%.......UUUU.......................UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUTT",
      "~TTTT~TTTT%%%%%%%%%%.......TTTT...................**..TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "~TT~TT%%%%%%%%%%%%%%.......TTTT......**...............TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTT~TT~%%%%%%%%%%%%.......TTTT...........UUUUUUUU....TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTT%%%T%%%%%%U........TTTT...........TTTTTTTT....TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTUUUUUUUUTTTTUUUUUUUUUUUTTTTTTTTUUUUTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTUUUUUUUUTTTTUUUUUUUUUUUTTTTTTTTUUUUTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"
    ],
    start: { x: 85, y: 24 },
    station: { x: 85, y: 23, name: "安平站", shelter: { x: 83, y: 20 } },
    landmarks: [
      { name: "安平古堡（紅磚高台）", area: [49, 3, 26, 20] },
      { name: "紅磚城牆遺跡", area: [52, 22, 20, 1] },
      { name: "億載金城（砲台）", area: [21, 27, 30, 20] },
      { name: "劍獅老街", area: [53, 27, 41, 20] },
      { name: "木頭碼頭與海盜船", area: [0, 0, 13, 17] },
      { name: "沙洲", area: [5, 14, 20, 40] }
    ],
    exits: [
      { x: 95, y: 25, to: "M10", tx: 1, ty: 16 },
      { x: 95, y: 26, to: "M10", tx: 1, ty: 17 },
      { x: 47, y: 0, to: "M22", tx: 47, ty: 58, requires: "Q_AP_4", requires_dialog: "D_EXIT_LOCK_AP" },
      { x: 48, y: 0, to: "M22", tx: 48, ty: 58, requires: "Q_AP_4", requires_dialog: "D_EXIT_LOCK_AP" }
    ],
    npcs: [
      { id: "harbor_clerk", x: 20, y: 10, sprite: "npc_harbor_clerk", dialog: "D_HARBORCLERK_IDLE", quest: "Q_AP_1", quests: ["Q_AP_1", "Q_AP_4"] },
      { id: "fort_guide", x: 65, y: 20, sprite: "npc_fort_guide", dialog: "D_FORTGUIDE_IDLE", quest: "Q_AP_2", quests: ["Q_AP_2"] },
      { id: "oldhouse_grandpa", x: 60, y: 36, sprite: "npc_oldhouse_grandpa", dialog: "D_OLDHOUSE_IDLE", quest: "Q_AP_3", quests: ["Q_AP_3"] }
    ],
    chests: [
      { id: "C_M21_1", x: 66, y: 7, subject: "數學", level: 3, reward: { gold: 5, exp: 6, item: "herb" } },
      { id: "C_M21_2", x: 45, y: 16, subject: "數學", level: 3, reward: { gold: 5, exp: 6, item: "guide" } },
      { id: "C_M21_3", x: 30, y: 36, subject: "數學", level: 3, reward: { gold: 5, exp: 6, item: "eraser" } },
      { id: "C_M21_4", x: 93, y: 12, subject: "數學", level: 3, reward: { gold: 5, exp: 6, item: "crystal" } },
      { id: "C_M21_5", x: 21, y: 52, subject: "數學", level: 3, reward: { gold: 6, exp: 6, item: "snack" } },
      { id: "C_M21_6", x: 60, y: 28, subject: "數學", level: 3, reward: { gold: 6, exp: 5, item: "guide" } }
    ],
    spawns: [
      { monster: "pi_hermit", count: 3, area: [10, 27, 9, 20] },
      { monster: "pi_milkfish", count: 3, area: [12, 15, 13, 9] },
      { monster: "pi_anchor", count: 2, area: [25, 15, 20, 9] },
      { monster: "pib_anchor", count: 1, area: [5, 11, 1, 1], quest: "Q_AP_4", elite: true }
    ],
    inn: { x: 91, y: 45, npc: null, price: 18, name: "港邊客棧", sign: "客棧", dialog: "D_INN_ANPING", dialog_nocoin: "D_INN_ANPING_NOCOIN" },
    shop: null
  },

  // ───────────────────────────── M22 鹿耳門台江（v3.0 新增；來源 tools/bigmaps/M22.txt／.json）─────────────────────────────
  M22: {
    name: "鹿耳門台江", type: "field", level: 5, bgm: "field", battle_bg: "taijiang", tileset: "field",
    real_ref: "正統鹿耳門聖母廟（D5、D6）、台江國家公園（D7）、黑面琵鷺（D8）",
    art_note: "西邊寬闊的水道口通往大海（水面薄霧，Q_LE_3 霧帆號影子出現的地方）；西北是淺水潟湖與紅樹林，木棧道從賞鳥亭接到廟埕。東北是宮殿式大廟外觀（D5「仿若紫禁城般高貴典雅的設計」、D6；金黃屋頂、紅柱、白石欄杆台基，門內暗，不畫神像、香爐、香煙、神將雕像）與很大的石板廣場。南半是方形魚塭（水擋、土堤可走），南邊泥灘與水道，木橋往南回安平；東邊濕地民宿與台江站草地。背景 tools/bigmaps/M22_bg.webp（GPT 四塊延續法＋最小誤差接縫）。",
    grid: [
      "~~~~~~~~~~TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "~~~~~~~~~~%%*****~~~~~~~******~~~~~~~~~*******TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "~~~~~~~~~~%%*****~~~~~~~******~~~~~~~~~******..RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRTTTTTTTTTTTTT",
      "~~~~~~~~~~%%*****~~~~~~~~~~~~~~~~~~~~~~******..RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRTTTTTTTTTTTTT",
      "~~~~~~~~~~%%*****~~~~~~~~~~~~~~~~~~~~~~******..RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRTTTTTTTTTTTTT",
      "~~~~~~~~~~%%~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~..RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRTTTTTTTTTTTTT",
      "~~~~~~~~~~%%~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~..RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR..T....T..TTT",
      "~~~~~~~~~~%%~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~..RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR..T....T..TTT",
      "~~~~~~~~~~%%~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~..RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR..T.......TTT",
      "~~~~~~~~~~%%~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~..HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH.U*UU.UUUUTTT",
      "~~~~~~~~~~%%~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~..HHHHHHHHHHHHHHHHHDDHHHHHHHHHHHHHHHHH.****.****TTT",
      "~~~~~~~~~~%%~~~~~~RRRRRRR~~~~~~~~~~~~~~~~~~~~..HHHHHHHHHHHHHHHHSSSSSHHHHHHHHHHHHHHH.****.****TTT",
      "~~~~~~~~~~%%~~~~~~RRRRRRR~~~~~~~~~~~~~~~~~~~~..HHHHHHHHHHHHHHHHSSSSSHHHHHHHHHHHHHHH..........TTT",
      "~~~~~~~~~~%%~~~~~~RRRRRRR~~~~~~~~~~~~~~~~~~~~..HHHHHHHHHHHHHHHHSSSSSHHHHHHHHHHHHHHH..........TTT",
      "~~~~~~~~~~%%~~~~~~BBBBBBBBBBBBBBBBBBBBBBBBBBBBB==============================================TTT",
      "~~~~~~~~~~%%~~~~~~BBBBBBBBBBBBBBBBBBBBBBBBBBBBB==============================================TTT",
      "~~~~~~~~~~%%~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~UUUUUU==========================================TTT",
      "~~~~~~~~~~%%~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TTTTTT==========================================TTT",
      "~~~~~~~~~~%%~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TTTTTT==========================================TTT",
      "~~~~~~~~~~%%~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TTTTTT==========================================TTT",
      "~~~~~~~~~~%%~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TTTTTT==========================================TTT",
      "~~~~~~~~~~%%~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TTTTTT==========================================TTT",
      "~~~~~~~~~~%%~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TTTTTT==========================================TTT",
      "~~~~~~~~~~%%~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TTTTTT==========================================TTT",
      "~~~~~~~~~~%%~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TTTTTT==========================================TTT",
      "~~~~~~~~~~%%.................................TTTTTT==========================================TTT",
      "~~~~~~~~~~%%=======================================================================..........TTT",
      "~~~~~~~~~~%%=======================================================================...........TT",
      "~~~~~~~~~~%%...................................==................................==...........TT",
      "~~~~~~~~~~%%..%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%..==%%%%%%%%%%%%%%%%%%%%%%%%%%%%~%%%==.RRRRRRRRRRTT",
      "~~~~~~~~~~%%..%%~~~~~~~~%%~~~~~~~~%%~~~~~~~~%..==%~~~~~~~~~~%%~~~~~~~~~%~~~~~~~~%==TRRRRRRRRRRTT",
      "~~~~~~~~~~%%..%%~~~~~~~~%%~~~~~~~~%%~~~~~~~~%..==%~~~~~~~~~~%%~~~~~~~~~%~~~~~~~~%==.RRRRRRRRRRTT",
      "~~~~~~~~~~%%..%%~~~~~~~~%%~~~~~~~~%%~~~~~~~~%..==%~~~~~~~~~~%%~~~~~~~~~%~~~~~~~~%==.RRRRRRRRRRTT",
      "~~~~~~~~~~%%..%%~~~~~~~~%%~~~~~~~~%%~~~~~~~~%..==%~~~~~~~~~~%%~~~~~~~~~%~~~~~~~~%==UHHHHHHHHHHTT",
      "~~~~~~~~~~%%..%%~~~~~~~~%%~~~~~~~~%%~~~~~~~~%..==%~~~~~~~~~~%%~~~~~~~~~%~~~~~~~~%==UHHHHHHHHHHTT",
      "~~~~~~~~~~%%..%%~~~~~~~~%%~~~~~~~~%%~~~~~~~~%..==%~~~~~~~~~~%%~~~~~~~~~%~~~~~~~~%==THHHHDHHHHHTT",
      "~~~~~~~~~~%%..%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%..==%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%============TTT",
      "~~~~~~~~~~%%..%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%..==%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%============TTT",
      "~~~~~~~~~~%%..%%~~~~~~~~%%~~~~~~~~%%~~~~~~~~%..==%~~~~~~~~~~%%~~~~~~~~~%~~~~~~~~%==..........TTT",
      "~~~~~~~~~~%%..%%~~~~~~~~%%~~~~~~~~%%~~~~~~~~%..==%~~~~~~~~~~%%~~~~~~~~~%~~~~~~~~%==..UU......TTT",
      "~~~~~~~~~~%%..%%~~~~~~~~%%~~~~~~~~%%~~~~~~~~%..==%~~~~~~~~~~%%~~~~~~~~~%~~~~~~~~%==..TT.......TT",
      "~~~~~~~~~~%%..%%~~~~~~~~%%~~~~~~~~%%~~~~~~~~%..==%~~~~~~~~~~%%~~~~~~~~~%~~~~~~~~%==........UUUTT",
      "~~~~~~~~~~%%..%%~~~~~~~~%%~~~~~~~~%%~~~~~~~~%..==%~~~~~~~~~~%%~~~~~~~~~%~~~~~~~~%==........TTTTT",
      "~~~~~~~~~~%%..%%~~~~~~~~%%~~~~~~~~%%~~~~~~~~%..==%~~~~~~~~~~%%~~~~~~~~~%~~~~~~~~%==........TTTTT",
      "~~~~~~~~~~%%..%%~~~~~~~~%%~~~~~~~~%%~~~~~~~~%..==%~~~~~~~~~~%%~~~~~~~~~%~~~~~~~~%==........TTTTT",
      "~~~~~~~~~~%%..%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%..==%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%==UUUUUUUUTTTTT",
      "~~~~~~~~~~%%...................................==................................==TTTTTTTTTTTTT",
      "~~~~~~~~~~%%...................................==................................==TTTTTTTTTTTTT",
      "~~~~~~~~~~%%........UUU.................UUU....==..........UUU............UUU....==TTTTTTTTTTTTT",
      "~~~~~~~~~~%%........UUU.......UUU.......UUU....==..........UUU............UUU....==TTTTTTTTTTTTT",
      "~~~~~~~~~~%%........TTT.......UUU.......TTT....==..........TTT............TTT....==TTTTTTTTTTTTT",
      "~~~~~~~~~~%%..................TTT..............==..................................TTTTTTTTTTTTT",
      "~~~~~~~~~~%%...................................==..................................TTTTTTTTTTTTT",
      "~~~~~~~~~~%%...................................==..................................TTTTTTTTTTTTT",
      "~~~~~~~~~~%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%FBBF%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%TTTTTTTTTTTTT",
      "~~~~~~~~~~%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%FBBF%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%T~~~~~~~~T",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~FBBF~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~FBBF~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~FBBF~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~FBBF~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
    ],
    start: { x: 88, y: 43 },
    station: { x: 88, y: 42, name: "台江站", shelter: { x: 87, y: 39 } },
    landmarks: [
      { name: "正統鹿耳門聖母廟", area: [47, 2, 36, 12] },
      { name: "廟前石板廣場", area: [47, 14, 46, 12] },
      { name: "潟湖與紅樹林", area: [12, 2, 33, 24] },
      { name: "賞鳥亭", area: [18, 11, 7, 6] },
      { name: "魚塭", area: [14, 29, 67, 17] },
      { name: "水道口", area: [0, 0, 9, 60] }
    ],
    exits: [
      { x: 47, y: 59, to: "M21", tx: 47, ty: 1 },
      { x: 48, y: 59, to: "M21", tx: 48, ty: 1 }
    ],
    npcs: [
      { id: "volunteer_lem", x: 62, y: 15, sprite: "npc_volunteer_lem", dialog: "D_TEMPLE_LEM_INTRO" },
      { id: "wetland_ranger", x: 18, y: 15, sprite: "npc_wetland_ranger", dialog: "D_RANGER_LE_IDLE", quest: "Q_LE_1", quests: ["Q_LE_1", "Q_LE_2", "Q_LE_3"] }
    ],
    chests: [
      { id: "C_M22_1", x: 45, y: 3, subject: "數學", level: 3, reward: { gold: 5, exp: 6, item: "herb" } },
      { id: "C_M22_2", x: 92, y: 13, subject: "數學", level: 3, reward: { gold: 5, exp: 6, item: "guide" } },
      { id: "C_M22_3", x: 10, y: 2, subject: "數學", level: 3, reward: { gold: 5, exp: 6, item: "eraser" } },
      { id: "C_M22_4", x: 14, y: 53, subject: "數學", level: 3, reward: { gold: 5, exp: 6, item: "crystal" } },
      { id: "C_M22_5", x: 79, y: 52, subject: "數學", level: 3, reward: { gold: 6, exp: 6, item: "snack" } },
      { id: "C_M22_6", x: 24, y: 41, subject: "數學", level: 3, reward: { gold: 6, exp: 5, item: "herb" } }
    ],
    spawns: [
      { monster: "pi_crab", count: 3, area: [9, 2, 6, 24] },
      { monster: "pi_hermit", count: 2, area: [14, 29, 31, 17] },
      { monster: "pi_milkfish", count: 2, area: [49, 29, 32, 17] }
    ],
    inn: { x: 90, y: 36, npc: null, price: 18, name: "濕地民宿", sign: "民宿", dialog: "D_INN_TAIJIANG", dialog_nocoin: "D_INN_TAIJIANG_NOCOIN" },
    shop: null,
    friendly: [
      { id: "spoonbill_1", kind: "spoonbill", sprite: "npc_spoonbill", name: "黑面琵鷺", x: 28, y: 7 },
      { id: "spoonbill_2", kind: "spoonbill", sprite: "npc_spoonbill", name: "黑面琵鷺", x: 31, y: 9 },
      { id: "spoonbill_3", kind: "spoonbill", sprite: "npc_spoonbill", name: "黑面琵鷺", x: 26, y: 10 }
    ],
    keepaway: [
      { id: "spoonbill_1", x: 28, y: 7, radius: 5, hint: "遠遠看就好，不要嚇到牠們喔！" },
      { id: "spoonbill_2", x: 31, y: 9, radius: 5, hint: "遠遠看就好，不要嚇到牠們喔！" },
      { id: "spoonbill_3", x: 26, y: 10, radius: 5, hint: "遠遠看就好，不要嚇到牠們喔！" }
    ]
  },

  // ───────────────────────────── M23 大樹鳳梨山（v3.0 新增；來源 tools/bigmaps/M23.txt／.json）─────────────────────────────
  M23: {
    name: "大樹鳳梨山", type: "field", level: 5, bgm: "field", battle_bg: "pineapple", tileset: "field",
    real_ref: "高雄市大樹區（下淡水溪鐵橋／高屏舊鐵橋、金鑽鳳梨與玉荷包荔枝、佛光山；70 號 2.9、2.12.3，來源 D12–D14，2026-10-25 開頁核對）",
    art_note: "西半是寬闊的高屏溪，一座紅褐色鋼桁架長鐵橋從河岸伸向對岸、中間斷開一節（裝飾、不能上橋；斷橋原因原文沒寫，不畫成災害）；河岸步道、濕地草地；東北山上是佛光山大殿外觀（黃褐瓦重簷、門內暗，不畫佛像、塑像、香爐）、殿前石板空地與林蔭石板大道；東南是鳳梨田民宿、五畦鳳梨田、荔枝園；西南角草地是大樹站。v3.x 新增，背景 tools/bigmaps/M23_bg.webp（GPT 分四塊延續法＋最小誤差接縫拼接）。draft：NPC、怪物、寶箱位置先照 70 號放，待企劃定稿。",
    grid: [
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT..===.TTTTTTTTTTTTTTRRRRRRRRRRRRRRRRRRRRRRRRTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTT...TTT.=TTT.TTTT===.TT=TTTTTTTTTTTRRRRRRRRRRRRRRRRRRRRRRRRTTTTTT",
      "~~~~~~~~~~~~~~~~~~~~~~~~~**==T............===.....TTTTTTTTTTRRRRRRRRRRRRRRRRRRRRRRRRTTTTTT",
      "~~~~~~~~~~~~~~~~~~~~~~~~~**==.............===T......TT..T.T.RRRRRRRRRRRRRRRRRRRRRRRRTTTTTT",
      "~~~~~~~~~~~~~~~~~~~~~~~~~**==..........TTU===.UU.UUU.......=RRRRRRRRRRRRRRRRRRRRRRRRTTTTTT",
      "~~~~~~~~~~~~~~~~~~~~~~~~~**==UT..........T===.TTTTUU......T=HHHHHHHHHHHHHHHHHHHHHHHHTTTTTT",
      "~~~~~~~~~~~~~~~~~~~~~~~~~**==T...UU.......===.....TT...UU..=HHHHHHHHHHHHHHHHHHHHHHHHTTTTTT",
      "~~~~~~~~~~~~~~~~~~~~~~~~~**==.U.TTT...TT.T===T...T....TUU..=HHHHHHHHHHHHHHHHHHHHHHHHT..UUT",
      "~~~~~~~~~~~~~~~~~~~~~~~~~**==UT..TTT....T.===.......T..TTUU=HHHHHHHHHHHHHHHHHHHHHHHH..UTTT",
      "~~~~~~~~~~~~~~~~~~~~~~~~~**==T...TT......T===T...UU......TU===========================TTTT",
      "~~~~~~~~~~~~~~~~~~~~~~~~~**==.............===....UU...T...T===========================TTTT",
      "~~~~~~~~~~~~~~~~~~~~~~~~~**==TT.......TU..===....TTUT...TT============================TTTT",
      "~~~~~~~~~~~~~~~~~~~~~~~~~**==..TT.....TTT.===TTT...T......============================TTTT",
      "~~~~~~~~~~~~~~~~~~~~~~~~~**==.............===........UU.TU============================TTTT",
      "~~~~~~~~~~~~~~~~~~~~~~~~~**==UU...TT....TU===.U.....TUTTTT============================.TTT",
      "~~~~~~~~~~~~~~~~~~~~~~~~~**==TUUU........T===.T...T..TTTT.============================UTTT",
      "~~~~~~~~~~~~~~~~~~~~~~~~~**==TTUT.......UT===TTU...T..T.T.UUUTUTUUTUU===UUTUUUTUUTUTUUTTTT",
      "KKKKKKKKKKKKKKKKKKKKKKKKKKK##TTT.T....TTTT===.TTT.........TTTTTTTTTTT===TTTTTTTTTTTTTTTTTT",
      "KKKKKKKKKKKKKKKKKKKKKKKKKKK##TT...........===T........U...TTTTTTTTTTT===TTTTTTTTTTTTTTTTTT",
      "KKKKKKKKKKKKKKKKKKKKKKKKKKK##TTT..........===..T......TT..TTTTTTTTTTT===TTTTTTTTTTTTTTTTTT",
      "~~~~~~~~~~~~~~~~~~~~~~~~~**==.T....TT.....===TT..TTTT....TTTTTTTTTTTT===.TTTTTTTTTTTT=TTTT",
      "~~~~~~~~~~~~~~~~~~~~~~~~~**==..T.TT.....TT===..T.....TTT.TTTTTT.TT..T===TTTTTT.TT.T...TTTT",
      "~~~~~~~~~~~~~~~~~~~~~~~~~**===========================================================TTTT",
      "~~~~~~~~~~~~~~~~~~~~~~~~~**===========================================================TTTT",
      "~~~~~~~~~~~~~~~~~~~~~~~~~**==........UU...===...TT...TT..TUTUU..UUUT.===UUUUUUUUUUUUUUTTTT",
      "~~~~~~~~~~~~~~~~~~~~~~~~~**==UUU.....TTTTT===TUU..........TTTTUUTTTTT===TTTTTTUTTTTTTTTTTT",
      "~~~~~~~~~~~~~~~~~~~~~~~~~**==TUTU.........===.TTRRRRRRRRRRRTTTTTTTTTT===TTTTTTTTTTTTTTTTTT",
      "~~~~~~~~~~~~~~~~~~~~~~~~~**==.T.T....T.UU.===TTTRRRRRRRRRRRTTTTTTTTTT===TTTTTTTTTTTTTTTTTT",
      "~~~~~~~~~~~~~~~~~~~~~~~~~**==.........TUTU===.TTRRRRRRRRRRRTTTTTTTTTT===..TTTTTTTTTTTTTTTT",
      "~~~~~~~~~~~~~~~~~~~~~~~~~**==TT..U.....T.T===.TTHHHHHHHHHHHTTTTTTT.TT===TT.T.TT.T.TTTTTTTT",
      "~~~~~~~~~~~~~~~~~~~~~~~~~**==...UT........===T..HHHHHHHHHHHTTTTTT....===..............TTTT",
      "~~~~~~~~~~~~~~~~~~~~~~~~~**==U..TTU......U===..THHHHHHHHHHHTT..T....T===.U.U.TU...UU.TTTTT",
      "~~~~~~~~~~~~~~~~~~~~~~~~~**==TU..TTT....TT===.T.....==...............===TUTU..TU..TU...TTT",
      "~~~~~~~~~~~~~~~~~~~~~~~~~**==TU...........===..T.*******************.===.TTT.TTT.TTTT.UTTT",
      "~~~~~~~~~~~~~~~~~~~~~~~~~**==TT.......UU..===....*******************.===T.............TTTT",
      "~~~~~~~~~~~~~~~~~~~~~~~~~**==.........UUU.===.UU.....................===..T...T...T..UTTTT",
      "~~~~~~~~~~~~~~~~~~~~~~~~~**==UUU..TT..TTT.===TTT.*******************.===...U...U.....UTTTT",
      "~~~~~~~~~~~~~~~~~~~~~~~~~**==TUT..........===...T*******************.===UUUU..TU.UTU.TTTTT",
      "~~~~~~~~~~~~~~~~~~~~~~~~~**==TTTT.......U.===.U.....................T===TTTT.TTT.TTT..TTTT",
      "~~~~~~~~~~~~~~~~~~~~~~~~~**==T.TT..U....UU===TTUT.******************.===.............UTTTT",
      "~~~~~~~~~~~~~~~~~~~~~~~~~**==.....UTU...TT===..T..******************.===.TU..TU...UU.UTTTT",
      "~~~~~~~~~~~~~~~~~~~~~~~~~**==.....TTU.....===UUTU....................===..TU.TTT..TT.TTTTT",
      "~~~~~~~~~~~~~~~~~~~~~~~~~**==UU....TTT.T..===TTTT..*****************.===.UTU.TTT.TTT....TT",
      "~~~~~~~~~~~~~~~~~~~~~~~~~**==TT.........TT===......*****************.===.TTTTTTT..TT..UTTT",
      "TTTTT~~~~~~T~~TT~....T...**==.TU......TT..===..U.....................===........T....TTTTT",
      "TTTTTT.....TT.TT...T.TT..**==.TT.TTT.T..TT===TTT..******************.===.....UUU..U...TTTT",
      "TTTT...U...................=====================TT******************.===TT..TUTT.TT..TTTTT",
      "TTT....T.TT.............TT.=====================..TTTTTTTTTTTTTTTTTTT===...TTTTTTTTUUTTTTT",
      "TTTUU......U.U.................U.....UU.UU===...UUTTTTTTTTTTTTTTTTTTT===TTTTTTTTTTTTTTTTTT",
      "TTTTTUUUUUUT.TUUUU..UUUUUT.UU.UTUUUUUTTUTT===TTUTUTTTTTTTTTTTTTTTTTTTUUUTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTUTTTTTUUTTTTTTTTTUTTTTTTTTTTTT===.TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTUTTTTTUUTTTTTTTTTUTTTTTTTTTTTT===UUTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"
    ],
    start: { x: 6, y: 48 },
    station: { x: 8, y: 47, name: "大樹站", shelter: { x: 13, y: 47 } },
    landmarks: [
      { name: "高屏舊鐵橋", area: [0, 3, 29, 44] },
      { name: "佛光山", area: [58, 1, 28, 22] },
      { name: "鳳梨田", area: [45, 25, 24, 24] },
      { name: "荔枝園", area: [72, 25, 15, 25] }
    ],
    exits: [
      { x: 42, y: 0, to: "M08", tx: 48, ty: 52 },
      { x: 43, y: 0, to: "M08", tx: 49, ty: 52 },
      { x: 42, y: 53, to: "M25", tx: 35, ty: 1, requires: "Q_ORC_4", requires_dialog: "D_EXIT_LOCK_ORC" },
      { x: 43, y: 53, to: "M25", tx: 36, ty: 1, requires: "Q_ORC_4", requires_dialog: "D_EXIT_LOCK_ORC" }
    ],
    npcs: [
      { id: "volunteer_fgs", x: 71, y: 12, sprite: "npc_volunteer_fgs", dialog: "D_TEMPLE_FGS_INTRO", quest: null, quests: [] },
      { id: "rail_fan", x: 31, y: 19, sprite: "npc_rail_fan", dialog: "D_RAILFAN_IDLE", quest: "Q_DS_1", quests: ["Q_DS_1"] },
      { id: "pineapple_farmer", x: 59, y: 36, sprite: "npc_pineapple_farmer", dialog: "D_PINEAPPLE_IDLE", quest: "Q_DS_2", quests: ["Q_DS_2"] },
      { id: "lychee_farmer", x: 77, y: 36, sprite: "npc_lychee_farmer", dialog: "D_LYCHEE_IDLE", quest: "Q_DS_3", quests: ["Q_DS_3"] }
    ],
    chests: [
      { id: "C_M23_1", x: 40, y: 3, subject: "數學", level: 3, reward: { gold: 10, exp: 13, item: "herb" } },
      { id: "C_M23_2", x: 85, y: 15, subject: "數學", level: 3, reward: { gold: 10, exp: 13, item: "guide" } },
      { id: "C_M23_3", x: 85, y: 31, subject: "數學", level: 3, reward: { gold: 10, exp: 13, item: "eraser" } },
      { id: "C_M23_4", x: 45, y: 44, subject: "數學", level: 3, reward: { gold: 10, exp: 13, item: "crystal" } },
      { id: "C_M23_5", x: 33, y: 45, subject: "數學", level: 3, reward: { gold: 11, exp: 13, item: "snack" } },
      { id: "C_M23_6", x: 4, y: 48, subject: "數學", level: 3, reward: { gold: 11, exp: 12, item: "guide" } }
    ],
    spawns: [
      { monster: "ds_pineapple", count: 3, area: [48, 33, 21, 15] },
      { monster: "ds_lychee", count: 3, area: [72, 30, 14, 17] },
      { monster: "ds_pineapple", count: 2, area: [29, 25, 12, 20] }
    ],
    inn: { x: 53, y: 33, npc: null, price: 20, name: "鳳梨田民宿", sign: "民宿", dialog: "D_INN_DASHU", dialog_nocoin: "D_INN_DASHU_NOCOIN", sells: "gear_dashu" },
    shop: null
  },

  // ───────────────────────────── M24 小琉球（v3.0 新增；來源 tools/bigmaps/M24.txt／.json）─────────────────────────────
  M24: {
    name: "小琉球", type: "field", level: 5, bgm: "field", battle_bg: "anping", tileset: "field",
    real_ref: "屏東縣琉球鄉小琉球（臺灣近海唯一的珊瑚礁島嶼、花瓶岩、友善賞龜、麻花捲；70 號 2.10、2.12.4，來源 D15–D20，2026-10-25 開頁核對）",
    art_note: "一圈灰白色多孔的珊瑚礁岩海岸與白沙灘；北邊伸進海裡的小漁港突堤；島中央一般漁港小村（紅瓦白牆平房，不寫成在地特色）、環島小路、東邊木頭觀景台；西南海邊一塊上大下細、頂上長樹的花瓶岩；南邊是看得到海底礁石的潮間帶淺水（綠蠵龜由程式畫在水裡，只能遠看）。背景沒有畫海龜、船、垃圾袋（由程式放）。不戰鬥。v3.x 新增，背景 tools/bigmaps/M24_bg.webp（GPT 分四塊延續法＋v13_align.py 平移對齊＋最小誤差接縫拼接）。draft：NPC 位置先照 70 號放，待企劃定稿。",
    grid: [
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~==~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~==~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~==~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~******************~~~==~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~******************~~~==~~~~~~~********************************~~~~~",
      "~~~~~******************~~~==~~~~~~~********************************~~~~~",
      "~~~~~******************~~~==~~~~~~~********************************~~~~~",
      "~~~~~*****................==.......********************************~~~~~",
      "~~~~~*****..........=================.........................*****~~~~~",
      "~~~~~*****..........=================.........................*****~~~~~",
      "~~~~~*****..........=================.........................*****~~~~~",
      "~~~~~*****....................................................*****~~~~~",
      "~~~~~*****....................RRRRRRRRR.......................*****~~~~~",
      "~~~~~*****.........RRRRRRRRRR.RRRRRRRRR................UU.....*****~~~~~",
      "~~~~~*****.........RRRRRRRRRR.RRRRRRRRR................TT.....*****~~~~~",
      "~~~~~*****.........RRRRRRRRRR.RRRRRRRRR...RRRRRRRRR...........*****~~~~~",
      "~~~~~*****.....UU..RRRRRRRRRR.HHHHHHHHH...RRRRRRRRR..FFFFFFF..*****~~~~~",
      "~~~~~*****.....TT..HHHHHHHHHH.HHHHHHHHH...RRRRRRRRR..FBBBBBF..*****~~~~~",
      "~~~~~*****.........HHHHHHHHHH.HHHHH.......RRRRRRRRR..FBBBBBF..*****~~~~~",
      "~~~~~*****................................HHHHHHHHH..FBBBBBF..*****~~~~~",
      "~~~~~*****...........................RRR..HHHHHHHHH..FBBBBBF..*****~~~~~",
      "~~~~~*****...........................RRR.............FFSSFFF..*****~~~~~",
      "~~~~~*****...........RRRRRRRRRRRRRR..RRR...............SS.....*****~~~~~",
      "~~~~~*****...........RRRRRRRRRRRRRR..RRR......................*****~~~~~",
      "~~~~~*****...........RRRRRRRRRRRRRR..RRR.RRRRRRRR.............*****~~~~~",
      "~~~~~*****...........RRRRRRRRRRRRRR..RRR.RRRRRRRR.............*****~~~~~",
      "~~~~~*****...........RRRRRRRRRRRRRR...HH.RRRRRRRR.............*****~~~~~",
      "~~~~~*****.......UU..HHHHHHHHHHHHHH.UUHH.HHHHHHHH...UU........****~~~~~~",
      "~~~~~*****.......TT..HHHHHHHHHHHHHH.TTHH.HHHHHHHH...TT........****~~~~~~",
      "~~~~~*****...............................HHHHHHHH...T.........****~~~~~~",
      "~~~~~*****....................................................****~~~~~~",
      "~~~~~*****....................................................****~~~~~~",
      "~~~~######................................................********~~~~~~",
      "~~~~######*...............................................********~~~~~~",
      "~~~~######*...............................................*****~~~~~~~~~",
      "~~~~######*...............................................*****~~~~~~~~~",
      "~~~~######********************~~~~~~~~~~~~*********************~~~~~~~~~",
      "~~~~######********************~~~~~~~~~~~~*********************~~~~~~~~~",
      "~~~~######********************~~~~~~~~~~~~*******************~~~~~~~~~~~",
      "~~~~~~~~~~********************~~~~~~~~~~~~*******************~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
    ],
    start: { x: 27, y: 9 },
    landmarks: [
      { name: "小琉球漁港", area: [20, 0, 17, 12] },
      { name: "花瓶岩", area: [3, 32, 8, 9] },
      { name: "觀景台", area: [52, 16, 9, 9] },
      { name: "潮間帶", area: [10, 36, 52, 8] }
    ],
    exits: [],
    npcs: [
      { id: "turtle_volunteer", x: 34, y: 34, sprite: "npc_turtle_volunteer", dialog: "D_TURTLE_VOL_IDLE", quest: "Q_LQ_1", quests: ["Q_LQ_1", "Q_LQ_2"] },
      { id: "island_guide", x: 57, y: 24, sprite: "npc_island_guide", dialog: "D_ISLAND_GUIDE_IDLE", quest: "Q_LQ_3", quests: ["Q_LQ_3"] }
    ],
    chests: [],
    spawns: [],
    inn: { x: 23, y: 20, npc: null, price: 20, name: "島上民宿", sign: "民宿", dialog: "D_INN_LIUQIU", dialog_nocoin: "D_INN_LIUQIU_NOCOIN" },
    shop: null,
    boat_dock: { route: "F_DONGGANG_LIUQIU", to: "M25", board: { x: 27, y: 2 }, ship_area: [28, 1, 4, 6], arrive: { x: 27, y: 9 } },
    friendly: [
      { id: "green_turtle_1", kind: "green_turtle", sprite: "npc_green_turtle", name: "綠蠵龜", x: 34, y: 39 },
      { id: "green_turtle_2", kind: "green_turtle", sprite: "npc_green_turtle", name: "綠蠵龜", x: 38, y: 40 }
    ],
    keepaway: [
      { id: "green_turtle_1", x: 34, y: 39, radius: 5, hint: "要和海龜保持五公尺以上喔！" },
      { id: "green_turtle_2", x: 38, y: 40, radius: 5, hint: "要和海龜保持五公尺以上喔！" }
    ],
    props: [
      { id: "trash_bag", x: 12, y: 22, quest: "Q_LQ_1", note: "西邊沙灘（撿起來的垃圾袋，程式畫）" },
      { id: "trash_bag", x: 20, y: 35, quest: "Q_LQ_1" },
      { id: "trash_bag", x: 48, y: 35, quest: "Q_LQ_1" }
    ]
  },

  // ───────────────────────────── M25 屏東恆春半島（v3.0 新增；來源 tools/bigmaps/M25.txt／.json）─────────────────────────────
  M25: {
    name: "屏東恆春半島", type: "field", level: 5, bgm: "field", battle_bg: "pacific", tileset: "field",
    real_ref: "屏東縣（北端東港碼頭＋恆春古城＋南端墾丁、鵝鑾鼻，壓縮成一張直長圖；70 號 2.10、2.12.5，來源 D17、D21–D24，2026-10-25 開頁核對）",
    art_note: "直長圖：最北是東港碼頭（突堤、兩艘停靠的白色客船、碼頭廣場、售票亭）；沿海公路一路往南，西邊是海、沙灘與珊瑚礁，東邊是丘陵草原；中段東側一座恆春古城的石砌城門（只畫一座、兩側短短一段殘牆），往東的路通到地圖邊（往台東的路牌）；墾丁旅店；南端草原與珊瑚礁海岸，最南岬角一座白色鐵造圓形燈塔（鵝鑾鼻）與觀景平台。三面環海。不畫黑鮪魚季。v3.x 新增，背景 tools/bigmaps/M25_bg.webp（GPT 直式 1024×1536 分四塊延續法＋最小誤差接縫拼接）。draft：NPC、怪物、寶箱位置先照 70 號放，待企劃定稿。",
    grid: [
      "~~~~KKKKKKKKKKK~~~~~~~~~~~~TTHHHHTT==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "~~~~KKKKKKKKKKK~~~~~~~~~~~~==========TTT.TTTTTTT...........TT..TTT.TTTTT",
      "~~~~KKKKKKKKKKK~~~~~~~~~~~~==========.TT.....T......................TTTT",
      "~~~~~================================.TT..........UU................TTTT",
      "~~~~~================================..T.........UTU............UU..TTTT",
      "~~~~~================================............TTTT..........UUU..TTTT",
      "~~~~~FFFFFFFFFFFFFFFFFFFFFF==========....TUU...................TTT..TTTT",
      "~~~~KKKKKKKKKKK~~~~~~~~~~~~==========.....UUU.......................TTTT",
      "~~~~KKKKKKKKKKK~~~~~~~~~~~~=UUUUUU===....TTTT............UUU.........TTT",
      "~~~~KKKKKKKKKKK~~~~~~~~~~~~=TTTTTT===.U..................UUU........T.TT",
      "~~~~KKKKKKKKKKK~~~~~~~~~~~~=TTTTTT===.TT.................TTTT..........T",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~=TTTTTT===.......T........................U.T",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~====T=====...............................TTTT",
      "~~~~~~~~~~~~***...................===...........................U....TTT",
      "~~~~~~~~~~~~***...........UT.TU....==.UU......................TUT....TTT",
      "~~~~~~~~~~~~***=.........TTTTTTU...==UTU.......................UTU..TTTT",
      "~~~~~~~~~~~~***=..........TTTTTUTU.==TTT....UUU...............TTTT...TTT",
      "~~~~~~~~~~~~***==.........TTTTTTTTU==.TTT...UUU.....................UTTT",
      "~~~~~~~~~~~~***===........TTTTTTTTT==.......TTTT.......UU...........TTTT",
      "~~~~~~~~~~~~***==.T........TTTTTTTT==.................TUUU..........TTTT",
      "~~~~~~~~~~~~***==T.........T.TTTTTT==.=................TTT..........TTTT",
      "~~~~~~~~~~~~***===.....U.....TTTTTT==..............=................TTTT",
      "~~~~~~~~~~~~***===....UUU.TTTTTTTTT==.....T...............T..........TTT",
      "~~~~~~~~~~~~***==TT...TTTTTTTTTTTT.==.T...............T...........U..TTT",
      "~~~~~~~~~~~~***==.......TTTTTTTTTTU==............................UT..TTT",
      "~~~~~~~~~~~~***==.......TT..TTTTTTT==....UU......................UTU.TTT",
      "~~~~~~~~~~~~***==.............TTTTT==.T.UTU.....................TTTU.TTT",
      "~~~~~~~~~~~~***==.T.............TTT==..UTTT........................T.TTT",
      "~~~~~~~~~~~~***==...........UUUUTTT==TUU.T..........UU...T.......=....TT",
      "~~~~~~~~~~~~***===..........TTTTTTT==.TT...........UTT..............U..T",
      "~~~~~~~~~~~~***==............TTTTTT==......T.......TTTU.............TUUT",
      "~~~~~~~~~~~~***===...........TTTTTT==........=.RRRRRRRRRR...........TTTT",
      "~~~~~~~~~~~~***===..............TTT==........=.RRRRRRRRRR...........TTTT",
      "~~~~~~~~~~~~***==................T.==..........RRRRRRRRRR..........TTTTT",
      "~~~~~~~~~~~~***==..................==..........RRRRRRRRRR............TTT",
      "~~~~~~~~~~~~***===............U....==.....#####HHHHHHHHHH####.......TTTT",
      "~~~~~~~~~~~~***====.....U....UT..UT==..U..#####HHH===HHHH####=.....T.TTT",
      "~~~~~~~~~~~~***===.....UU...UTT.TT.==.UT..#####HHH===HHHH####=T......TTT",
      "~~~~~~~~~~~~***===.....TTT..TTTTT..==.UTU.#####HHH===HHHH####=........TT",
      "~~~~~~~~~~~~***==...........TTTTTUU==.TTT...T.TT.T=====T.=TT.T......UUTT",
      "~~~~~~~~~~~~***===T.........TTTTTTT==.............=====.............UTTT",
      "~~~~~~~~~~~~***==...........TTTTTT.==.TU..........=====.............TTTT",
      "~~~~~~~~~~~~***===........U..TTTTT.===.T..........=====..............TTT",
      "~~~~~~~~~~~~***===.......UUT...TTT.=====.==.===.============.=====.====T",
      "~~~~~~~~~~~~***===.......TT..UU..TT=====================================",
      "~~~~~~~~~~~~***==...==...TTTTTTT...=====================================",
      "~~~~~~~~~~~~***===......UTTTTTT..UT==....T..........................UTUT",
      "~~~~~~~~~~~~***===.T....TTTTTUUUUTT==.U.........U........T..........TTTT",
      "~~~~~~~~~~~~***..T....TT..TTTUUUUT.==.TRRRRRRRRRR.T.............UUUUTTTT",
      "~~~~~~~~~~~~***..........T...TTTTTT==..RRRRRRRRRR..............UTTTTTTTT",
      "~~~~~~~~~~~~***=..................===..RRRRRRRRRR.............TUTTTTTTTT",
      "~~~~~~~~~~~~***...................===.URRRRRRRRRR.......UU.....TTTTTTTTT",
      "~~~~~~~~~~~~***.UT...............T===.THHHHHHHHHHHTT...UTT.......TTTTTTT",
      "~~~~~~~~~~~~***.T.......T.........===..HHHHHHHHHHH.....UTTU......TTTTTTT",
      "~~~~~~~~~~~~***......T............===..HHHHHHHHHHHU....TTTT.......TTTTTT",
      "~~~~~~~~~~~~***==.................===..T...HH.....U................TTTTT",
      "~~~~~~~~~~~~***=................TU===.TT==.T==.TTTT............U...TTTTT",
      "~~~~~~~~~~~~***=.................T===================.........TT=....TTT",
      "~~~~~~~~~~~~***.=.................===================....TT............T",
      "~~~~~~~~~~~~***=.=................................T....T...UUUUU~~~~~~~~",
      "~~~~~~~~~~~~***=....................T...T.....T..........T.*****~~~~~~~~",
      "~~~~~~~~~~~~***==.....UUU.............T..........T.........*****~~~~~~~~",
      "~~~~~~~~~~~~***=......UTT................T....T....U.....TU*****~~~~~~~~",
      "~~~~~~~~~~~~***==.....TTTT...........U............UTU.....U*****~~~~~~~~",
      "~~~~~~~~~~~~***==.=....TT.......T....HHH..TT......UTT.....T*****~~~~~~~~",
      "~~~~~~~~~~~~***====...............T..HHHH......T..TTTT.TT..*****~~~~~~~~",
      "~~~~~~~~~~~~***==....................HHH............T......*****~~~~~~~~",
      "~~~~~~~~~~~~***===T..........U.......HHH...................*****~~~~~~~~",
      "~~~~~~~~~~~~***==...........UTT...TT.HHH.....T....U......U.*****~~~~~~~~",
      "~~~~~~~~~~~~***===.........TTTT......HHH.UUT......T......T.*****~~~~~~~~",
      "~~~~~~~~~~~~***==..U........T.UU.....HHH.TT...T........U..T*****~~~~~~~~",
      "~~~~~~~~~~~~***=...T........TTTT...T.HHH..T...........UTU..*****~~~~~~~~",
      "~~~~~~~~~~~~***===.....T.............HHH.=TTU........UTTT..*****~~~~~~~~",
      "~~~~~~~~~~~~***==.U.............T..==HHH....U........TTTTU.*****~~~~~~~~",
      "~~~~~~~~~~~~***=..T......U.........==HHH...TTTTU......TTTT.*****~~~~~~~~",
      "~~~~~~~~~~~~***=.=......TTT.....===============T..........=*****~~~~~~~~",
      "~~~~~~~~~~~~***=.=......TTT.....===============TT........TU*****~~~~~~~~",
      "~~~~~~~~~~~~***===T.T...TTTT....===============T......T...T*****~~~~~~~~",
      "~~~~~~~~~~~~***=.=............FF============FFFFFF........T*****~~~~~~~~",
      "~~~~~~~~~~~~***UUUUUUUUUUUUUUUFF=================FUUUUUUUU******~~~~~~~~",
      "~~~~~~~~~~~~******************FF=================F**************~~~~~~~~",
      "~~~~~~~~~~~~******************FF=================F**************~~~~~~~~",
      "~~~~~~~~~~~~******************FF=================F**************~~~~~~~~",
      "~~~~~~~~~~~~******************FFFFFFFFFFFFFFFFFFFF**************~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
    ],
    start: { x: 24, y: 14 },
    station: { x: 24, y: 13, name: "屏東站", shelter: { x: 21, y: 13 } },
    landmarks: [
      { name: "東港碼頭", area: [0, 0, 35, 13] },
      { name: "恆春古城", area: [42, 30, 19, 14] },
      { name: "墾丁", area: [15, 46, 45, 30] },
      { name: "鵝鑾鼻燈塔", area: [30, 62, 20, 22] }
    ],
    exits: [
      { x: 35, y: 0, to: "M23", tx: 42, ty: 52 },
      { x: 36, y: 0, to: "M23", tx: 43, ty: 52 },
      { x: 71, y: 44, to: "M26", tx: 1, ty: 44, requires: "Q_PT_3", requires_dialog: "D_EXIT_LOCK_PT" },
      { x: 71, y: 45, to: "M26", tx: 1, ty: 45, requires: "Q_PT_3", requires_dialog: "D_EXIT_LOCK_PT" }
    ],
    npcs: [
      { id: "ticket_seller", x: 31, y: 2, sprite: "npc_ticket_seller", dialog: "D_TICKET_IDLE", quest: "Q_LQ_0", ferry: { id: "F_DONGGANG_LIUQIU", side: "from" }, quests: ["Q_LQ_0"] },
      { id: "park_ranger_kt", x: 52, y: 41, sprite: "npc_park_ranger", dialog: "D_RANGER_PT_IDLE", quest: "Q_PT_1", quests: ["Q_PT_1"] },
      { id: "oldcity_guide", x: 47, y: 40, sprite: "npc_oldcity_guide", dialog: "D_OLDCITY_IDLE", quest: "Q_PT_4", quests: ["Q_PT_4"] },
      { id: "lighthouse_keeper", x: 42, y: 76, sprite: "npc_lighthouse_keeper", dialog: "D_LIGHTHOUSE_IDLE", quest: "Q_PT_2", quests: ["Q_PT_2", "Q_PT_3"] }
    ],
    chests: [
      { id: "C_M25_1", x: 19, y: 20, subject: "數學", level: 3, reward: { gold: 30, exp: 40, item: "herb" } },
      { id: "C_M25_2", x: 66, y: 2, subject: "數學", level: 3, reward: { gold: 30, exp: 40, item: "guide" } },
      { id: "C_M25_3", x: 60, y: 40, subject: "數學", level: 3, reward: { gold: 30, exp: 40, item: "eraser" } },
      { id: "C_M25_4", x: 21, y: 72, subject: "數學", level: 3, reward: { gold: 30, exp: 40, item: "crystal" } },
      { id: "C_M25_5", x: 57, y: 70, subject: "數學", level: 3, reward: { gold: 30, exp: 40, item: "snack" } },
      { id: "C_M25_6", x: 34, y: 80, subject: "數學", level: 3, reward: { gold: 30, exp: 40, item: "herb" } }
    ],
    spawns: [
      { monster: "pi_parrot", count: 3, area: [15, 18, 19, 26] },
      { monster: "pi_octo", count: 3, area: [15, 58, 15, 20] },
      { monster: "wx_wave", count: 3, area: [50, 60, 9, 18] },
      { monster: "pib_ship", count: 1, area: [40, 82, 1, 1], boss: true, quest: "Q_PT_3" }
    ],
    inn: { x: 44, y: 56, npc: null, price: 22, name: "墾丁旅店", sign: "旅店", dialog: "D_INN_KENTING", dialog_nocoin: "D_INN_KENTING_NOCOIN", sells: "gear_kenting" },
    shop: null,
    boat_dock: { route: "F_DONGGANG_LIUQIU", to: "M24", board: { x: 20, y: 5 }, ship_area: [15, 7, 11, 3], arrive: { x: 20, y: 4 } }
  },

  // ───────────────────────────── M26 台東縱谷海港（v4.0 新增；來源 tools/bigmaps/M26.txt／.json）─────────────────────────────
  M26: {
    name: "台東縱谷海港", type: "field", level: 5, bgm: "field", battle_bg: "grass", tileset: "field",
    real_ref: "卑南遺址公園（T1）、臺東熱氣球（T2、T3）、鹿野高台（T4）、釋迦（T5）、花東縱谷（T6）、富岡漁港客船（T9）",
    art_note: "左右兩邊山的邊緣，中間縱谷：北半一格格水田、鹿野高台的茶園與繫繩的彩色熱氣球（球面不寫字；一顆小朋友塗鴉風）；一條溪與木橋；西南卑南遺址公園（展示廳外觀、一根月形石柱、木欄杆圍起的考古淺坑，不畫骨骸石棺）；中南縱谷民宿與釋迦園；東南富岡漁港（水泥碼頭、售票亭、突堤；船由程式畫）。背景 tools/bigmaps/M26_bg.webp（q0–q2 地圖師B、q3 本組；GPT 四塊延續法）。",
    grid: [
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTT............TTTTTTTTTTTTTTTT..==...TT...........TTT....TTTTT....TTTTTTTTTTTTTT",
      "TTTTTTTTTTTT......T...........TT.....TT.U.==..UTT....T......TTT....TTT........TTTTTTTTTTTT",
      "TTTTTTT.................................TT==.UUTTU....TTT......UU..............TTTTTTTTTTT",
      "TTTTTTT.~~~~~~~~~~~~===~~~~~~~~~~~.KUU.....=******............TTT......U...........TTTTTTT",
      "TTTTTTT.~~~~~~~~~~~~===~~~~~~~~~~~.KKK..............UKUU............U.UTTTT.T......TTTTTTT",
      "TTTTTTT.~~~~~~~~~~~~===~~~~~~~~~~~.KKK.UKUU.UUUUU*TTKKKK..........T.TTT...........TTTTTTTT",
      "TTTTTT..~~~~~~~~~~~~===~~~~~~~~~~~.KKK.KKKK.TTTTT...KKKK..UUUUU........U.UT........TTTTTTT",
      "TTTTTT..~~~~~~~~~~~~===~~~~~~~~~~~.KKK.KKKK.*****UU.KKKK..KKKKK........TTTTTT....U..TTTTTT",
      "TTTTTT..~~~~~~~~~~~~===~~~~~~~~~~~.....KKKK...TTTTT.......KKKKK....TU.....TTTT..UTT....TTT",
      "TTTTTTT.~~~~~~~~~~~~===~~~~~~~~~~~.....KKKK.UU*****UU.....KKKKK...TTT......T..UTT...T..TTT",
      "TTTTTT..~~~~~~~~~~~~===~~~~~~~~~~~*UUU********TTTTTTT.....KKKKK......T.......TTTT..T..T..T",
      "TTTTT...==========================TTTTTTTTTTTTTT*****T**********UUUUU....UU...TTTU.......T",
      "TTTT....==========================****TTTT****TTTTTTTTTTTTTTTTTTTTTTT....TTT..T..T..T.T.UT",
      "TTTTUU..~~~~~~~~~~~~===~~~~~~~~~~~TTTTTTTTTTTTTTTTT******************.......T....TT....UUT",
      "TTTTTT..~~~~~~~~~~~~===~~~~~~~~~~~********T***TTTTTTTTTTTTTTTTTTTTTT.............TTTTTTTTT",
      "TTTTTTT.~~~~~~~~~~~~===~~~~~~~~~~~TTTTTTTTTTTTTT***TTTT********T*T*T...UU.......TTTTTTTTTT",
      "TTTTTT..~~~~~~~~~~~~===~~~~~~~~~~~***T********TTTTTTTTT........TTTTTTTTTTTT....TTTTTTTTTTT",
      "TTTTTT..~~~~~~~~~~~~===~~~~~~~~~~~...TTTTT==........................T.......UU..TTTTTTTTTT",
      "TTTTTTTT~~~~~~~~~~~~===~~~~~~~~~~~........==.TUUU.U..T....TUU.T.UT.....U....TT..TTTTTTTTTT",
      "TTTTTTTT~~~~~~~~~~~~===~~~~~~~~~~~.UU.....==.TTTTTT....U..TTT...TTTT...TUUU.....TTTTTTTTTT",
      "TTTTTT~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~BB~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "TTTTTT~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~BB~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "TTTTTT~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~BB~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "TTTTTT~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~BB~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "TTTTTTTTTT..TTT..TTT..T......TTTT...TTTT..==TT...TTT..TTTTTTTTTTTTTTTTTTTTTTTT~~~~~~~~~~~~",
      "TTTT.......U.....TTT..T........TT...T.....==....U..T...TTTT.....T.......TTTTTT~~~~~~~~~~~~",
      "TTTTUU...UUUT.....TT.............UU...U.U.==...TT........T.UU.....U.UTU...TTTT~~~~~~~~~~~~",
      "TTTTTT...TTTTTT.U..T.....U.......TT..UTTT.==....TUU..UU....TT..TTTTTTTTT..TT~~~~~~~~~~~~~~",
      "TTTTTTT.....TTTTT.......UTUU..T......UTTTT==..UUTTT..UUU...................TTT~~~~~~~~~~~~",
      "TTTTTT....T..TTTTT......TTTUU.......TTTTT.==..UUTT..TTTT....UU.U===============~~~~~~~~~~~",
      "TTTTTT.U.................TTTT......U......==..TTTT.........UTTTT===============~~~~~~~~~~~",
      "TTTTTTTT...........UU.....T......TTT......==........U......TTTT.===============~~~~~~~~~~~",
      "TTTTTTTT.........TTTTT........T...........==..UU...TTRRRRRRRRRR.===============~~~~~~~~~~~",
      "TTTTTTTT...UU.U......................U....==.TUU.....RRRRRRRRRRU===============~~~~~~~~~~~",
      "TTTTTTTTU..TTTT.....RRRRRRRRRR......TTU...==..TTUU.T.RRRRRRRRRRT===============~~~~~~~~~~~",
      "TTTTTTTTT...........RRRRRRRRRR........TTT.==..TTTT...RRRRRRRRRRT=========RRRRR=~~~~~~~~~~~",
      "TTTTTTTTTT........TTRRRRRRRRRRU...........==..TTTTU..RRRRRRRRRRT=========RRRRR=~~~~~~~~~~~",
      "TTTTTTTTTTTTT.......HHHHHHHHHHTT.......U..==....TTTT.HHHHHHHHHHT=========RRRRR=~~~~~~~~~~~",
      "TTTTTTT.............HHHHHHHHHHT.......UUU.==.........HHHHDHHHHHT=========HHHHH=~~~~~~~~~~~",
      "TTTTTTTU......U.........==............TTT.==..UUUU....T.....TTTT=========HHHHH=~~~~~~~~~~~",
      "TTTTTTTTT...TTT....U.........U............==.TTUUT.T............===============~~~~~~~~~~~",
      "TTTTTTTT..........TT.........KT..........T==...TT.....T.........===============~~~~~~~~~~~",
      "T.........................................==...........T.....T..===============~~~~~~~~~~~",
      "===================================================================================~~~~~~~",
      "===================================================================================~~~~~~~",
      "TU....U......................................UUUUUUUUUUUUUUUUUUU~~~~~~~~~~~~~~~~===~~~~~~~",
      "TTUUTTTTT.........UU.........T..FFFFFFFFF.T..TTTTTTTTTTTTTTTTTTT~~~~~~~~~~~~~~~~===~~~~~~~",
      "TTTTTTTT...U......TT..........T.FFFFFFFFF..T..................TT~~~~~~~~~~~~~~~~===~~~~~~~",
      "TTTTTTTT..TUU..T................FFFFFFFFF....UUUUUUUUUUUUUUUUUTT~~~~~~~~~~~~~~~~===~~~~~~~",
      "TTTTTTTT...TTT............UU....FFFFFFFFF....TTTTTTTTTTTTTTTTTTT~~~~~~~~~~~~~~~~===~~~~~~~",
      "TTTTTT...............TUUTTTTT...FFFFFFFFF..T.TTTTTTTTTTTTTTTTTTT~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "TTTTTTUU......UU......TT.....................TTTTTTTTTTTTTTTTTTT~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "TTTTTTTTUUUUUUTTUUUUUUTTUUUUUUUUUUUUUUUUUUUUUTTTTTTTTTTTTTTTTTTT~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT~~~~~~~~~~~~~~~~~~~~~~~~~~"
    ],
    start: { x: 10, y: 43 },
    station: { x: 10, y: 42, name: "台東站", shelter: { x: 9, y: 39 } },
    landmarks: [
      { name: "卑南遺址公園", area: [18, 33, 27, 20] },
      { name: "鹿野高台", area: [33, 2, 36, 18] },
      { name: "富岡漁港", area: [64, 30, 26, 27] },
      { name: "釋迦園", area: [44, 46, 20, 8] }
    ],
    exits: [
      { x: 42, y: 0, to: "M29", tx: 44, ty: 55, requires: ["Q_TT_3", "Q_GI_2", "Q_LY_2", "Q_LY_3"], requires_dialog: "D_EXIT_LOCK_TT_ISLE", requires_dialogs: { Q_TT_3: "D_EXIT_LOCK_TT_BOSS" } },
      { x: 43, y: 0, to: "M29", tx: 45, ty: 55, requires: ["Q_TT_3", "Q_GI_2", "Q_LY_2", "Q_LY_3"], requires_dialog: "D_EXIT_LOCK_TT_ISLE", requires_dialogs: { Q_TT_3: "D_EXIT_LOCK_TT_BOSS" } },
      { x: 0, y: 44, to: "M25", tx: 70, ty: 44 },
      { x: 0, y: 45, to: "M25", tx: 70, ty: 45 }
    ],
    npcs: [
      { id: "ruins_guide", x: 31, y: 42, sprite: "npc_ruins_guide", dialog: "D_RUINS_IDLE", quest: "Q_TT_1", quests: ["Q_TT_1"] },
      { id: "balloon_captain", x: 36, y: 10, sprite: "npc_balloon_captain", dialog: "D_BALLOON_IDLE", quest: "Q_TT_2", quests: ["Q_TT_2", "Q_TT_3", "Q_TT_5"] },
      { id: "custard_farmer", x: 52, y: 48, sprite: "npc_custard_farmer", dialog: "D_CUSTARD_IDLE", quest: "Q_TT_4", quests: ["Q_TT_4"] },
      { id: "ticket_seller_fg", x: 75, y: 41, sprite: "npc_ticket_seller_fg", dialog: "D_GI_0", quest: "Q_GI_0", ferry: { id: "F_FUGANG_GREENISLAND", side: "from", ids: ["F_FUGANG_GREENISLAND", "F_FUGANG_LANYU"] }, quests: ["Q_GI_0", "Q_LY_0"] }
    ],
    chests: [
      { id: "C_M26_1", x: 7, y: 27, subject: "數學", level: 3, reward: { gold: 14, exp: 20, item: "herb" } },
      { id: "C_M26_2", x: 40, y: 33, subject: "數學", level: 3, reward: { gold: 14, exp: 20, item: "guide" } },
      { id: "C_M26_3", x: 58, y: 30, subject: "數學", level: 3, reward: { gold: 14, exp: 20, item: "eraser" } },
      { id: "C_M26_4", x: 36, y: 52, subject: "數學", level: 3, reward: { gold: 14, exp: 19, item: "crystal" } },
      { id: "C_M26_5", x: 71, y: 3, subject: "數學", level: 3, reward: { gold: 14, exp: 19, item: "snack" } },
      { id: "C_M26_6", x: 33, y: 12, subject: "數學", level: 3, reward: { gold: 13, exp: 19, item: "guide" } }
    ],
    spawns: [
      { monster: "wx_rain_e", count: 3, area: [6, 26, 12, 6] },
      { monster: "wx_rainbow", count: 3, area: [62, 2, 14, 9] },
      { monster: "fob_balloon", count: 1, area: [38, 3, 1, 1], boss: true, quest: "Q_TT_3" }
    ],
    inn: { x: 58, y: 41, npc: null, price: 24, name: "縱谷民宿", sign: "民宿", dialog: "D_INN_TAITUNG", dialog_nocoin: "D_INN_TAITUNG_NOCOIN", sells: "gear_taitung" },
    shop: null,
    boat_dock: { route: "F_FUGANG_GREENISLAND", to: "M27", board: { x: 81, y: 50 }, ship_area: [83, 46, 7, 7], arrive: { x: 81, y: 49 }, routes: [{ route: "F_FUGANG_GREENISLAND", to: "M27" }, { route: "F_FUGANG_LANYU", to: "M28" }] }
  },

  // ───────────────────────────── M27 綠島（v4.0 新增；來源 tools/bigmaps/M27.txt／.json）─────────────────────────────
  M27: {
    name: "綠島", type: "field", level: 5, bgm: "field", battle_bg: "grass", tileset: "field",
    real_ref: "綠島燈塔（T7）、朝日溫泉（T8）、客船（T9）、咾咕石古厝（T10）、海草冰與珊瑚礁（T11）",
    art_note: "一圈珊瑚礁淺海與礁岩海岸、環島公路；西邊南寮漁港碼頭（船由程式畫）；西北高地白色圓形燈塔；島中央灰白珊瑚石砌的方正矮房子；東南帆船鼻礁岩潮間帶上三個石砌溫泉池冒熱氣。救起的人數不寫、不畫沉船、燈塔不標高度。背景 tools/bigmaps/M27_bg.webp（q0–q2 地圖師B、q3 本組；碼頭邊 GPT 畫的白色客船已用海面蓋掉）。",
    grid: [
      "~~~~~~~***~~~~~~~~~~~~***~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~***...HH.......***~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~***...HH.......***~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~***...HH.......*********************************************~~~~~",
      "~~~~~~~***...HH.......~~~******************************************~~~~~",
      "~~~~~~~***...HH.......~~~******************************************~~~~~",
      "~~~~~~~***=====================================================****~~~~~",
      "~~~~~~~***=====================================================****~~~~~",
      "~~~~~~~***==.................................................==****~~~~~",
      "~~~~~~~***==.................................................==****~~~~~",
      "~~~~~~~***==.................................................==****~~~~~",
      "~~~~~~~***==.................................................==****~~~~~",
      "~~~~~~~***==.................................................==****~~~~~",
      "~~~~~~~***==........................RRRRR....................==****~~~~~",
      "~~~~~~~***==........RRRRRRR..RRRRRRRRRRRR....................==****~~~~~",
      "~~~~~~~***==........RRRRRRR..RRRRRRRRRRRR....................==****~~~~~",
      "~~~~~~~***==........RRRRRRR..RRRRRRRHHHHH....................==****~~~~~",
      "~~~~~~~***==........RRRRRRR..RRRRRRRHHHHH....................==****~~~~~",
      "~~~~~~~~~~==........HHHHHHH..HHHHHHH======...................==****~~~~~",
      "~===========........HHHDHHH..HHDHHHH======...................==****~~~~~",
      "~===========.....===================....==...................==****~~~~~",
      "~~~~~~~~UU==.....===================....=============........==****~~~~~",
      "~~~~~~~***==............................=============........==****~~~~~",
      "~~~~~~~***==.................................................==****~~~~~",
      "~~~~~~~***==..............................................==.==****~~~~~",
      "~~~~~~~***==..............................................==...****~~~~~",
      "~~~~~~~***==..........RRRRRRR.RRRRRRR.....................==...*********",
      "~~~~~~~***==..........RRRRRRR.RRRRRRR.....................==...*********",
      "~~~~~~~***==..........RRRRRRR.RRRRRRR.....................==...*********",
      "~~~~~~~***==..........RRRRRRR.RRRRRRR.....RRRRRRR.........==...*********",
      "~~~~~~~***==..........HHHHHHH.HHHHHHH.....RRRRRRR.....%%%%%%%%%%%*******",
      "~~~~~~~***==..........HHHDHHH.HHHDHHH.....RRRRRRR.....%%%%%%%%%%%*******",
      "~~~~~~~***==..............................HHHHHHH.....%%%%%%%%%%%*******",
      "~~~~~~~***==..............................HHHDHHH.....%%%%%%%%%%%*******",
      "~~~~~~~***==..........................................%%%%~~~%%%%*******",
      "~~~~~~~***==.........................=======..........%%%%~~~%%%%*******",
      "~~~~~~~***==.........................=======..........%%%%%%%%~~~~******",
      "~~~~~~~***===========================.....==..........%%%%%%%%~~~~******",
      "~~~~~~~***===========================.....==..........%%%%~~~%~~~~******",
      "~~~~~~~***................................============%%%%~~~*%%%*******",
      "~~~~~~~***UUUUUUUUUUUUUUUUUUUUUUUUUUUUU*UU============%%%%~~~%%%%*******",
      "~~~~~~~***********************************UUUUUUUUUUUU%%%%%%%%%%%*******",
      "~~~~~~~***********************************************%%%%%%%%%%%*******",
      "~~~~~~~~~~********************************************UUUUUUUUUUU*******",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~******************",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*************~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
    ],
    start: { x: 9, y: 19 },
    landmarks: [
      { name: "綠島燈塔", area: [12, 0, 4, 6] },
      { name: "咾咕石古厝", area: [20, 13, 29, 21] },
      { name: "朝日溫泉", area: [54, 30, 14, 14] },
      { name: "南寮漁港", area: [0, 18, 10, 8] }
    ],
    exits: [],
    npcs: [
      { id: "lighthouse_guide_gi", x: 14, y: 9, sprite: "npc_lighthouse_guide_gi", dialog: "D_LIGHTHOUSE_GI_IDLE", quest: "Q_GI_1", quests: ["Q_GI_1"] },
      { id: "onsen_keeper_gi", x: 56, y: 32, sprite: "npc_onsen_keeper_gi", dialog: "D_ONSEN_GI_IDLE", quest: "Q_GI_2", quests: ["Q_GI_2"] },
      { id: "oldhouse_gi", x: 29, y: 33, sprite: "npc_oldhouse_gi", dialog: "D_OLDHOUSE_GI_IDLE", quest: "Q_GI_3", quests: ["Q_GI_3"] },
      { id: "ice_shop_gi", x: 24, y: 32, sprite: "npc_ice_shop_gi", dialog: "D_ICE_GI_IDLE" }
    ],
    chests: [],
    spawns: [],
    inn: { x: 46, y: 35, npc: null, price: 24, bath: { price: 24, label: "♨️ 泡溫泉" }, name: "綠島民宿", sign: "民宿", dialog: "D_INN_GREENISLAND", dialog_nocoin: "D_INN_GREENISLAND_NOCOIN", dialog_bath: "D_GI_BATH" },
    shop: { x: 24, y: 32, shop_id: "ice_gi", npc: "ice_shop_gi" },
    boat_dock: { route: "F_FUGANG_GREENISLAND", to: "M26", board: { x: 4, y: 20 }, ship_area: [0, 21, 7, 5], arrive: { x: 9, y: 19 } }
  },

  // ───────────────────────────── M28 蘭嶼（v4.0 新增；來源 tools/bigmaps/M28.txt／.json）─────────────────────────────
  M28: {
    "name": "蘭嶼",
    "type": "field",
    "level": 5,
    "bgm": "field",
    "battle_bg": "grass",
    "tileset": "field",
    "real_ref": "火山島與黑潮（T12、T13）、拼板舟（T14）、禮儀（T15、T16）、飛魚季與飛魚乾（T17、T18）、傳統屋（T19）、水芋田（T20）",
    "art_note": "v4.2 新背景（GPT 四塊延續法，A5 2026-11-09；老闆 2026-11-10 核可）：北岸灰黑火山岩礁；北部落 4 組家屋（後排木造工作房＋木柱涼台，前排往下凹、卵石砌三層石階的地下屋），家屋前一條草地巷道；3 排曬飛魚架掛銀藍色飛魚乾＋1 座斜放的曬魚台；水芋田小塊＋水圳＋2 座小木橋，東邊一塊不規則水芋田；中央東大片草坡＋龍眼樹、麵包樹叢＋1 塊火山岩；東海岸黑色礁岩平台、珊瑚礁潮池、奇岩；南灘頭白沙灘、卵石矮牆木屋頂的船屋、3 艘拼板舟（白底、紅黑太陽紋三角紋水波紋，不畫人形紋）；環島路沿海岸彎。西邊開元港碼頭＋解說處、民宿兩塊是舊圖原像素貼回（K3／K4）。圖上沒有字、人物、動物、祭典、雪、霧。背景 wip_v42/art/m28/M28_new_bg.webp（換上線的 docs/assets/maps/bg_M28.webp 由 Codex 做）。",
    "grid": [
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~***~~~*~~~********~~****~~~***~~~~~",
      "************************~*******************************************~~~~",
      "~~~~~***************************************..==..........==.,,,****~~~~",
      "~~~~*******=================================................=,,,,,**~~~~",
      "~~~~*******==...............................................=,,~~~~*~~~~",
      "~~~*~**~***==RRRKKK.RRKKK..RRKKK.RRKKKKTT*............TTTT..=,,~~~~*~~~~",
      "~~~~*******==HHHKKK.HHKKK..HHKKK.HHKKKKTT*............TTTT...,,,,,**~~~~",
      "~~~~*******==######.######.#####.#####................TTTT..=.,,,,***~~*",
      "~~~~***~~**==RRRRRR.RRRRRR.RRRRR.RRRRR........................,,,****~~*",
      "~~*********==######.######.#####.#####.......................=,,,***~~~~",
      "~~~********==................................................=,,,,**~~~~",
      "~~*********==..................................***...........,,~~~~~*~~*",
      "~~~********==....................,,,,,.........***............,~~~~~****",
      "~~~~*******==......~~~~~~~~~~~~~.,,,,,......................=,,~~~~~**~*",
      "~~~~*******==RRRRR.~~~~~~~~~~~~~.,KKKK.......................,,*,,**~~~~",
      "~~~~*******==RRRRR.~~~~~~~~~~~~~.,KKKK.................TTT...,,**,*~~~~~",
      "~~~~*******==HHHHH....BB.........,,,,,.................TTT...,,*,,*~~~~~",
      "~~~~*******==HHDHH.~~~~~~~~~~~~~.,KKK,.................TTT...,,,,,**~~~~",
      "~~~~*******==......~~~~~~~~~~~~~.,KKK,*......................,,,,,**~~~~",
      "~~~~~~~~~~~==KKKK..~~~~~~~~~~~~~.,,,,,~~~~~~~..............=,,,,,*~~~~~~",
      "~============.........BB.........,,,,,~~~~~~~~..............,,~~~**~~~~~",
      "~============.....~.**********...,KKKK~~~~~~~~..............,~~~~,*~~~~~",
      "~============.....~.*************KKKKK~~~~~~~~............=.,,,,,,~~~~~~",
      "~~~~~~~~~~~==.....~..............KKKKK~~~~~~~~............=.,,,,,,**~~~~",
      "~~~~~~~~~~~==.....~..............,,,,,~~~~~~~~............=.,,,~~~~*~~~~",
      "~~~~~~~~~~~==......*~~~~~~.~~~~~~,,,,,~~~~~~~~~~~.........=.,,,~~~~***~~",
      "~~~~~~~~~~~==.......~~~~~~.~~~~~~,,,,,~~~~~~~~~~~.........=.,,,~~~~*~~~~",
      "~~~~~~~~~~~==.......~~~~~~.~~~~~~.....*~~~~~~~~~..........=.,,,,,,**~~~~",
      "~~~~~~~****==...............***********.......TTTT........=.,~~,,*~~~~~~",
      "~~~~~~~**.=.................***********.......TTTT........=.,~~,,,*~~~~~",
      "~~~~~****.=...................RRRRRRRR........TTTT....TTT.=.,,,,,,***~~~",
      "~~~~~*****=..**...............RRRRRRRR................TTT.=.,,,,,**~~~~~",
      "~~~~~~~***=..**...............RRRRRRRR...TTT..........TTT.=.,,,,,~~~~~~~",
      "~~~~~~***.=...................HHHHHHHH...TTT..............=.,~~,,,*~~~~~",
      "~~~~~****.=............**.....HHHHHHHH...TTT.......TTT....=.,~~,,,**~~~~",
      "~~~~~****.=............**.....HHHDHHHH.............TTT....=.,,,,,,*~~~~~",
      "~~~~~****.=.................=============..........TTT....=.,,,,,~~~~~~~",
      "~~~~******========.===.===..=============.................=.,,,~~***~~~~",
      "~~~~~~***.............................=====================.,,,~~**~~~~~",
      "~~~~~******UUUUUUUUUUUUUUUUUUUUUUUUUU%%%%%%%%%%%%%%%%%%%%%%%%**********~",
      "~~~~~************~****************~*.***RRRRRRR%%%%%%%%%%%%%%%%*********",
      "~~********~*****************~**********%RRRRRRR%%%%%%%%%%%%%%%%*********",
      "~~******~********~~*************~******%HHHHHHH%KKKKK%KKKKK%KKKK********",
      "~*******~*****************************%%HHHHHHH%KKKKK%KKKKK%KKKK********",
      "~~***~************~*******************%%HHHHHHH%%%%%%%%%%%%%%%%%********",
      "~~~~~~~**~~~~~*~~*~~~~~~~~~*****~~****%%%%%%%%%%%%%%%%%%%%%%%%%%********",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~****~*~~***************************"
    ],
    "start": {
      "x": 9,
      "y": 22
    },
    "landmarks": [
      {
        "name": "開元港",
        "area": [
          0,
          20,
          11,
          9
        ]
      },
      {
        "name": "拼板舟沙灘",
        "area": [
          40,
          40,
          25,
          7
        ]
      }
    ],
    "exits": [],
    "npcs": [
      {
        "id": "tao_guide",
        "x": 17,
        "y": 20,
        "sprite": "npc_tao_guide",
        "dialog": "D_TAO_IDLE",
        "quest": "Q_LY_1",
        "quests": [
          "Q_LY_1",
          "Q_LY_2",
          "Q_LY_3"
        ],
        "note": "解說員（既有，位置與台詞不動；西塊裡）"
      },
      {
        "id": "tao_fisher",
        "x": 38,
        "y": 15,
        "sprite": "npc_tao_fisher",
        "dialog": "D_TAO_FISHER_IDLE",
        "quest": null,
        "quests": [],
        "note": "漁夫：第 1 排飛魚架 (34–37,15–16) 東端旁（K24；新背景架子在 x33.5–38、y14.6–16.6）"
      },
      {
        "id": "tao_taro",
        "x": 26,
        "y": 27,
        "sprite": "npc_tao_taro",
        "dialog": "D_TAO_TARO_IDLE",
        "quest": null,
        "quests": [],
        "note": "種芋頭的婦女：下排兩塊水芋田中間的田埂（x26.16–26.87）"
      },
      {
        "id": "tao_elder",
        "x": 32,
        "y": 7,
        "sprite": "npc_tao_elder",
        "dialog": "D_TAO_ELDER_IDLE",
        "quest": null,
        "quests": [],
        "note": "長者：第 3 組涼台 (29–31,6–7) 東側的小徑（新背景涼台在後排，原 (34,12) 是第 4 組主屋前巷道）"
      },
      {
        "id": "tao_owner",
        "x": 23,
        "y": 12,
        "sprite": "npc_tao_owner",
        "dialog": "D_TAO_OWNER_IDLE",
        "quest": null,
        "quests": [],
        "note": "屋主：第 2 組地下屋（主屋 x20–25）正前方的巷道（A5 建議）"
      },
      {
        "id": "tao_boatman",
        "x": 47,
        "y": 43,
        "sprite": "npc_tao_boatman",
        "dialog": "D_TAO_BOATMAN_IDLE",
        "quest": null,
        "quests": [],
        "note": "船主：船屋 (40–46,41–45) 東側沙灘"
      },
      {
        "id": "tao_kid",
        "x": 57,
        "y": 45,
        "sprite": "npc_tao_kid",
        "dialog": "D_TAO_KID_IDLE",
        "quest": null,
        "quests": [],
        "note": "孩子：沙灘上、第 2 艘拼板舟 (54–58,43–44) 南邊（原 (57,44) 會壓在舟上）"
      }
    ],
    "chests": [
      {
        "id": "C_M28_1",
        "x": 57,
        "y": 30,
        "subject": "數學",
        "level": 3,
        "reward": {
          "gold": 1,
          "exp": 0,
          "item": "guide"
        },
        "note": "山坡（東段環島路 x58 西邊的草地；原 (58,30) 在路上）；B3 A 案：引導卡＋1 金、經驗 0、不算步"
      },
      {
        "id": "C_M28_2",
        "x": 65,
        "y": 24,
        "subject": "數學",
        "level": 3,
        "reward": {
          "gold": 1,
          "exp": 0,
          "item": "eraser"
        },
        "note": "東海岸礁岩平台、潮池 (63–66,25–27) 北邊；B3 A 案：刪去卡＋1 金、經驗 0、不算步"
      }
    ],
    "spawns": [],
    "inn": {
      "x": 34,
      "y": 38,
      "npc": null,
      "price": 24,
      "name": "蘭嶼民宿",
      "sign": "民宿",
      "dialog": "D_INN_LANYU",
      "dialog_nocoin": "D_INN_LANYU_NOCOIN"
    },
    "shop": null,
    "boat_dock": {
      "route": "F_FUGANG_LANYU",
      "to": "M26",
      "board": {
        "x": 4,
        "y": 23
      },
      "ship_area": [
        0,
        24,
        10,
        5
      ],
      "arrive": {
        "x": 9,
        "y": 22
      }
    },
    "animals": [
      {
        "id": "goat_ly",
        "sprite": "npc_goat_ly",
        "area": [
          48,
          14,
          14,
          14
        ],
        "count": 3,
        "name": "山羊",
        "say": "咩～（山羊都有主人，不要追喔！）",
        "dialog": "D_ANIMAL_GOAT_LY",
        "note": "animals（會走動、碰到會走開）；圖 walk 3×4 每格 37×36（A5）；不另加 keepaway"
      }
    ],
    "scenery": [
      {
        "id": "canoe",
        "area": [
          48,
          43,
          5,
          2
        ],
        "interact": false,
        "note": "拼板舟（新背景 x48.3–52.4、y42.75–44.8；格子 K，不能走、不能碰）"
      },
      {
        "id": "canoe",
        "area": [
          54,
          43,
          5,
          2
        ],
        "interact": false
      },
      {
        "id": "canoe",
        "area": [
          60,
          43,
          4,
          2
        ],
        "interact": false
      },
      {
        "id": "boat_house",
        "area": [
          40,
          41,
          7,
          5
        ],
        "interact": false,
        "note": "船屋（不能進去；格子 R／H）"
      },
      {
        "id": "flying_fish_rack",
        "area": [
          13,
          20,
          4,
          1
        ],
        "interact": false,
        "note": "舊飛魚架（西塊，照 v4.1）"
      },
      {
        "id": "flying_fish_rack",
        "area": [
          34,
          15,
          4,
          2
        ],
        "interact": false,
        "note": "飛魚架底下不能走（格子 K）"
      },
      {
        "id": "flying_fish_rack",
        "area": [
          34,
          18,
          3,
          2
        ],
        "interact": false
      },
      {
        "id": "flying_fish_rack",
        "area": [
          34,
          22,
          4,
          1
        ],
        "interact": false
      },
      {
        "id": "flying_fish_rack",
        "area": [
          33,
          23,
          5,
          2
        ],
        "interact": false,
        "note": "斜放的曬魚台"
      },
      {
        "id": "tao_house",
        "area": [
          13,
          6,
          6,
          5
        ],
        "interact": false,
        "note": "家屋第 1 組（工作房＋涼台在後排 y6–7、卵石砌的地下屋在前排 y8–10）；只看外觀"
      },
      {
        "id": "tao_house",
        "area": [
          20,
          6,
          6,
          5
        ],
        "interact": false
      },
      {
        "id": "tao_house",
        "area": [
          27,
          6,
          5,
          5
        ],
        "interact": false
      },
      {
        "id": "tao_house",
        "area": [
          33,
          6,
          5,
          5
        ],
        "interact": false,
        "note": "第 4 組的涼台往東多一格到 x38（y6–7）"
      },
      {
        "id": "etiquette_sign",
        "x": 18,
        "y": 19,
        "note": "圖案告示牌（跟著解說員），程式畫，不寫字"
      }
    ]
  },

  // ───────────────────────────── M29 花蓮太魯閣口（v4.0 新增；來源 tools/bigmaps/M29.txt／.json）─────────────────────────────
  M29: {
    "name": "花蓮太魯閣口",
    "type": "field",
    "level": 5,
    "bgm": "field",
    "battle_bg": "pacific_east",
    "tileset": "field",
    "real_ref": "花蓮縣（太魯閣大理岩峽谷口、立霧溪、太平洋海岸、石雕、麻糬、林田山日式宿舍壓縮進來；71 號 4.6、4.7.4，T22–T29）",
    "art_note": "西北是灰白帶條紋、幾乎垂直的大理岩山壁，立霧溪從峽谷流出、往東流進太平洋，一座小橋；溪南一條公路往西進山（西口）；中間南北大路；東邊長長的灰色沙石海灘與太平洋；中南市街：麻糬店、兩層海岸旅店、草地上幾座抽象石雕；西南一小片深褐木牆黑瓦的日式宿舍（裝飾）。背景 tools/bigmaps/M29_bg.webp（GPT 四塊延續法＋最小誤差接縫）。draft。",
    "grid": [
      "########################################TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT~~~~~~~~~~~~~~~~~~",
      "########################################TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT~~~~~~~~~~~~~~~~~~",
      "########################################TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT~~~~~~~~~~~~~~~~~~",
      "########################################TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT~~~~~~~~~~~~~~~~~~",
      "########################################TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT~~~~~~~~~~~~~~~~~~",
      "########################################TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT~~~~~~~~~~~~~~~~~~",
      "########################################TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT~~~~~~~~~~~~~~~~~~",
      "########################################TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT~~~~~~~~~~~~~~~~~~",
      "########################################TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT~~~~~~~~~~~~~~~~~~",
      "########################################TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT~~~~~~~~~~~~~~~~~~",
      "########################################TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT~~~~~~~~~~~~~~~~~~",
      "########################################TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~BB~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~BB~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~BB~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~BB~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "=================================================....T..TT......T..%%%%%~~~~~~~~~~~~~~~~~~",
      "================================================............TT.....%%%%%~~~~~~~~~~~~~~~~~~",
      "T.........................UU..U.U.T...UUU...==.....................%%%%%~~~~~~~~~~~~~~~~~~",
      "############################UTTUTU..UUTTTU..==.U.................TT%%%%%~~~~~~~~~~~~~~~~~~",
      "############################TTTTTT.UTTTTTT..==.TU..................%%%%%~~~~~~~~~~~~~~~~~~",
      "############################TTTTTTUTTTTTTT..==.TTUUU...............%%%%%~~~~~~~~~~~~~~~~~~",
      "############################TTTTTTTTTTTTTT..==.T.TTTT............TT%%%%%~~~~~~~~~~~~~~~~~~",
      "############################TTTTTTTTTTTTTT..==.T...................%%%%%~~~~~~~~~~~~~~~~~~",
      "############################TTTTTTTTTTTTTT..==.....................%%%%%~~~~~~~~~~~~~~~~~~",
      "############################TTTTTTTTTTTTTT..==.....................%%%%%~~~~~~~~~~~~~~~~~~",
      "############################TTTTTTTTTTTTT...==..TTU.....UUU......UT%%%%%~~~~~~~~~~~~~~~~~~",
      "############################TTTTTTTTTTTTTU..==.T..TT....TTTT.....T.%%%%%~~~~~~~~~~~~~~~~~~",
      "############################TTTTTTTTTTTTTT..==TTT....U.............%%%%%~~~~~~~~~~~~~~~~~~",
      "############################TTTTTTTTTTTTTTT.==.KT.==TTT......UUU...%%%%%~~~~~~~~~~~~~~~~~~",
      "############################TTTTTTTTTTTTTT..==.K...=.....T..RRRRRRR%%%%%~~~~~~~~~~~~~~~~~~",
      "############################TTTTTTTTTTTTTT..==..............RRRRRRR%%%%%%%~~~~~~~~~~~~~~~~",
      "############################TTTTTTTTTTTTT.T.==...U.....TT...RRRRRRR%%%%%%%~~~~~~~~~~~~~~~~",
      "############################TTTTTTTTTTTT....==..UTU.K==....URRRRRRR%%%%%%%~~~~~~~~~~~~~~~~",
      "############################TTTTTTTTTTTTU.T.==.UTTT.K=.U..UURRRRRRR%%%%%%%~~~~~~~~~~~~~~~~",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT.TTTT...==.UTT...TTT..TTRRRRRRR%%%%%%%~~~~~~~~~~~~~~~~",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT....TT..TT==.TT.KK....U...HHHHHHH%%%%%%%%~~~~~~~~~~~~~~~",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT.........U..==.....=U..UUU..HHHHHHH%%%%%%%%~~~~~~~~~~~~~~~",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT.....T..==......T..TTTT.HHHHHHH%%%%%%%%~~~~~~~~~~~~~~~",
      "TTTTTTTTTTTTTTRRRRRRRRRRRRRRRRRRRRRRR.......==.T............T...=..%%%%%%%%~~~~~~~~~~~~~~~",
      "TTTTTTTTTTTTTTRRRRRRRRRRRRRRRRRRRRRRR..============================%%%%%%%%~~~~~~~~~~~~~~~",
      "TTTTTTTTTTTTTTRRRRRRRRRRRRRRRRRRRRRRRT.============================%%%%%%%%~~~~~~~~~~~~~~~",
      "TTTTTTTTTTTTTTHHHHHHHHHHHHHHHHHHHHHHH.......==..............RRRRRRRR%%%%%%%~~~~~~~~~~~~~~~",
      "TTTTTTTTTTTTTTHHHHHHHHHHHHHHHHHHHHHHHTU..T..==.U.....UUU...TRRRRRRRR%%%%%%%~~~~~~~~~~~~~~~",
      "TTTTTTTTTTTTTTTT...TTTTT....TTTT...TT.T.....==.TU....TTTT...RRRRRRRR%%%%%%%~~~~~~~~~~~~~~~",
      "TTTTTTTTTTTTTTTT............................==..TTT.........RRRRRRRR%%%%%%%~~~~~~~~~~~~~~~",
      "TTTTTTTTTTTTTTRRRRRRRRRRRRRRRRRRRRRRR.....TT==.....TTT...T..RRRRRRRR%%%%%%%~~~~~~~~~~~~~~~",
      "TTTTTTTTTTTTTTRRRRRRRRRRRRRRRRRRRRRRR..TTU..==TT..TTTTT.....RRRRRRRR%%%%%%%~~~~~~~~~~~~~~~",
      "TTTTTTTTTTTTTTRRRRRRRRRRRRRRRRRRRRRRR.U..T..==.....TTTTTT...HHHHHHHH%%%%%%%~~~~~~~~~~~~~~~",
      "TTTTTTTTTTTTTTHHHHHHHHHHHHHHHHHHHHHHHUT.T...==.......TTTT...HHHHHHHH%%%%%%%~~~~~~~~~~~~~~~",
      "TTTTTTTTTTTTTTHHHHHHHHHHHHHHHHHHHHHHHUT.....==.............UHHHHHHHH%%%%%%%~~~~~~~~~~~~~~~",
      "TTTTTTTTTTTTTTTT...TTTTT...TTTTT...T.TTU....==TT.....U....UTT....==%%%%%%%%~~~~~~~~~~~~~~~",
      "TTTTTTTTTTTTTT...............TTT......TT.TU.==....U..T....TTTU.....%%%%%%%%~~~~~~~~~~~~~~~",
      "TTTTTTTTTTTTTTT...........................T.==...UUU.......TTT....T%%%%%%%%~~~~~~~~~~~~~~~",
      "TTTTTTTTTTTTTT....U....U........UU..........==.U.TTTT..........UUU.%%%%%%%%~~~~~~~~~~~~~~~",
      "TTTTTTTTTTTTTT...UU..UUUU....U..UUUUU.......==UUU......UU.....UUUUU%%%%%%%%~~~~~~~~~~~~~~~",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTTTTT~~~~~~~~~~~~~~~"
    ],
    "start": {
      "x": 46,
      "y": 42
    },
    "station": {
      "x": 46,
      "y": 43,
      "name": "花蓮站",
      "shelter": {
        "x": 43,
        "y": 41
      }
    },
    "landmarks": [
      {
        "name": "太魯閣峽谷口",
        "area": [
          0,
          0,
          44,
          18
        ]
      },
      {
        "name": "太平洋海岸",
        "area": [
          66,
          0,
          24,
          57
        ]
      },
      {
        "name": "花蓮市街",
        "area": [
          45,
          28,
          22,
          24
        ]
      },
      {
        "name": "日式宿舍",
        "area": [
          13,
          38,
          25,
          13
        ]
      }
    ],
    "exits": [
      {
        "x": 44,
        "y": 56,
        "to": "M26",
        "tx": 42,
        "ty": 1
      },
      {
        "x": 45,
        "y": 56,
        "to": "M26",
        "tx": 43,
        "ty": 1
      },
      {
        "x": 0,
        "y": 16,
        "to": "M30",
        "tx": 94,
        "ty": 19,
        "requires": "Q_HL_3",
        "requires_dialog": "D_EXIT_LOCK_HL"
      },
      {
        "x": 0,
        "y": 17,
        "to": "M30",
        "tx": 94,
        "ty": 20,
        "requires": "Q_HL_3",
        "requires_dialog": "D_EXIT_LOCK_HL"
      }
    ],
    "npcs": [
      {
        "id": "station_hl",
        "x": 48,
        "y": 42,
        "sprite": "npc_station_hl",
        "dialog": "D_STATION_HL_IDLE",
        "quest": "Q_HL_1",
        "quests": [
          "Q_HL_1"
        ]
      },
      {
        "id": "taroko_ranger",
        "x": 24,
        "y": 18,
        "sprite": "npc_taroko_ranger",
        "dialog": "D_TAROKO_IDLE",
        "quest": "Q_HL_2",
        "quests": [
          "Q_HL_2"
        ]
      },
      {
        "id": "fisher_hl",
        "x": 69,
        "y": 20,
        "sprite": "npc_fisher_hl",
        "dialog": "D_FISHER_HL_IDLE",
        "quest": "Q_HL_3",
        "quests": [
          "Q_HL_3"
        ]
      },
      {
        "id": "road_engineer",
        "x": 3,
        "y": 18,
        "sprite": "npc_road_engineer",
        "dialog": "D_ENGINEER_IDLE",
        "quest": "Q_HL_4",
        "quests": [
          "Q_HL_4"
        ]
      },
      {
        "id": "stone_carver",
        "x": 50,
        "y": 38,
        "sprite": "npc_stone_carver",
        "dialog": "D_STONE_IDLE",
        "quest": "Q_HL_5",
        "quests": [
          "Q_HL_5"
        ]
      },
      {
        "id": "mochi_shop",
        "x": 63,
        "y": 39,
        "sprite": "npc_mochi_shop",
        "dialog": "D_MOCHI_IDLE",
        "quests": []
      }
    ],
    "roadsigns": [],
    "chests": [
      {
        "id": "C_M29_1",
        "x": 1,
        "y": 18,
        "subject": "數學",
        "level": 3,
        "reward": {
          "gold": 33,
          "exp": 45,
          "item": "herb"
        }
      },
      {
        "id": "C_M29_2",
        "x": 64,
        "y": 17,
        "subject": "數學",
        "level": 3,
        "reward": {
          "gold": 33,
          "exp": 45,
          "item": "guide"
        }
      },
      {
        "id": "C_M29_3",
        "x": 36,
        "y": 37,
        "subject": "數學",
        "level": 3,
        "reward": {
          "gold": 33,
          "exp": 45,
          "item": "eraser"
        }
      },
      {
        "id": "C_M29_4",
        "x": 16,
        "y": 45,
        "subject": "數學",
        "level": 3,
        "reward": {
          "gold": 33,
          "exp": 44,
          "item": "crystal"
        }
      },
      {
        "id": "C_M29_5",
        "x": 66,
        "y": 52,
        "subject": "數學",
        "level": 3,
        "reward": {
          "gold": 34,
          "exp": 44,
          "item": "snack"
        }
      },
      {
        "id": "C_M29_6",
        "x": 15,
        "y": 53,
        "subject": "數學",
        "level": 3,
        "reward": {
          "gold": 34,
          "exp": 44,
          "item": "herb"
        }
      }
    ],
    "spawns": [
      {
        "monster": "wx_wave_e",
        "count": 3,
        "area": [
          67,
          20,
          6,
          30
        ]
      },
      {
        "monster": "an_macaque",
        "count": 3,
        "area": [
          28,
          18,
          16,
          18
        ]
      },
      {
        "monster": "wxb_whale",
        "count": 1,
        "area": [
          70,
          16,
          1,
          1
        ],
        "boss": true,
        "quest": "Q_HL_3"
      }
    ],
    "inn": {
      "x": 64,
      "y": 51,
      "npc": null,
      "price": 26,
      "name": "海岸旅店",
      "sign": "旅店",
      "dialog": "D_INN_HUALIEN",
      "dialog_nocoin": "D_INN_HUALIEN_NOCOIN",
      "sells": "gear_hualien"
    },
    "shop": {
      "x": 63,
      "y": 39,
      "shop_id": "mochi_hl",
      "npc": "mochi_shop"
    },
    "props": [
      {
        "id": "sign_road_open",
        "cells": [
          [
            2,
            18
          ]
        ],
        "note": "西口旁圖案告示牌（查公路步道開放情形）；程式畫"
      }
    ]
  },

  M30: {
    "name": "中橫・合歡山",
    "type": "field",
    "level": 5,
    "bgm": "field",
    "battle_bg": "alpine",
    "tileset": "field",
    "suggest": "Lv47–51",
    "real_ref": "台 8 線東段峽谷＋大禹嶺＋台 14 甲線武嶺＋下山高冷菜園壓縮成一張（71 號 5.3、5.6.1，U1–U6）",
    "art_note": "東段峽谷公路貼著山壁、隧道口；中段大禹嶺管制站（小亭子＋柵欄）；西北武嶺鞍部空地與東側木造觀景台、箭竹草原、針葉樹、白枯木、一塊塊雪地；西南下山彎路與四畦高冷菜園；高山山莊。背景 tools/bigmaps/M30_bg.webp（GPT 四塊延續法＋最小誤差接縫；山莊門口一棵小樹用 v13_patch 蓋掉）。雪地可走。draft。",
    "grid": [
      "~##T~~~~~~~#####T#~~~###~~~~~#~~~~#~~~~~~~~~~~~~~~~~~~~~~##~~~~~~~~~~~~#~~~~~~#~~~~~~~~~~#~~~~~~",
      "~~##~.~~~~~........~...~~..~~~.~~~##~~~~~~~##~~~~~~~~~~~##~~~~~~~~~~~~~#~~~~~#~~~~~####~~~~~~~~#",
      "~.##...~~~~..........~.~~~......~.~~~~~~~~~#~~##~~~~~~~~~~~#~~~~~~~~#~~~~~~~##~~~~~~~#~~~~~~~~#~",
      "~....~.......~......~~~~~~........~~~~~~~~~#~~###~~~#~~~~~~~#~~~~#~#~~~~~~~~#~~~~~~~#~~#~#~~~~~~",
      "~...~~......~~~.....~~.~~~.......~~~~~~~~~~~~~~~~#~~~~~~~~~~~~~~#~~~~~~~~#~~~~~~~#~~~~~###~~~~~~",
      "#...~~~.....~~~~................~~~~~~~~~~~~~#~~~~#~~~~~~~~~~#~~#~~~~~~~~~#~~~~~~~~~~~~~#~#~~~~~",
      "#...........~..~....FFFFFF.....~~#~~#~~~~~~~~~~~~~~~...~~~~~###~~~~~#~~~~~#~~~~~~~~~~~~~#~~~#~~~",
      "~...................FBBBBF.....~~~~~~~~~~~~~~~~~#~~~....~~~~~~#~~~~~~~~~~#~~##~~~~~#~#~~~~~#~~~~",
      "#...................FBBBBF.......~~~~~~~~#~~~~~~~~~~.......~..~~#~~~~~~~~~~~~~##~~~~~~~~~~~~~~~~",
      "~...................FBBBBF........~~~~~~~~~~~~~~~~~#~~........~~~~~~~#~~~~~#~#~~#~~~~~~~~~~~#~~#",
      "#...................FBBBBF........~.~~~~~~~~~~~~~~~~...........~~~~~~~##~~~~~#~#~~~~~~~~~~~~~~#~",
      "#.............=.....FF..FF..........~~~~~~~~~~~~~~~~~~..~........~~~#~~~##~~~~~~~~~~~~~#~~~~~~~~",
      "#.............==.....................~~~~~~~~#~~~~~~~~#..........~~~~~~~#~~~~~~~#~~~~~~~~#~~~~~~",
      "~.............==.....................~~~~~###~~~~~~..~~.............~~~~~~~~~#~.~~~~~##~#~#~~~~~",
      "~~#~..........==........................~T~~#~~~.T~~....RRRR........~~#~.~~~~~~..~~~###~~~#~#~~~",
      "~~~~#.........==.~........................~~..~~.#.~#...RRRR..........~~.....#...~~HHHH.~~~~~~~~",
      "~~~~~.........==.~......................................RRRR..............#....#.~.HHHH..~~~~~~~",
      "#~~.~....~....==........................................HHHHFFF....................HHHH...~~~~~~",
      "#.......~~....=================================================================================#",
      "~#......~~....======================================#===========================================",
      "~~~~..........==.......RRRRRRRRRR.....=..==.........~..........#.##..#..U~#.......#~~#..#..=====",
      "~~~~~~........==.......RRRRRRRRRR..................~~~....######################################",
      "~T~~~~........==.......RRRRRRRRRR.........................######################################",
      "~~~~~~~....#..==.......HHHHHHHHHH.~.......................~#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "~~.~~.........==.......HHHHHHHHHH~~~.....................~~~#~~~~~~~~~~~~~~~~~~#~~~~~~~~~~~~~~~~",
      "~~..~.........==..................~~.....................~~~~~#~~~~~~~~~~#~##~~~#~#~~~~~~~~~~~~~",
      "~~....#.......==.........................................~#~~~~#~~~~~~~~~~~#~~~~~~~~~~~~#~~~~~~~",
      "#.....~~......==........................................#~~~~~~~###~~~~~~~~#~##~~~~~~~~~~~#~~~~~",
      "#....~~~......==................................~~~~....~~~~~~~~~~~~~~~~~~~~~#~#~~~~##~~~~~~~~~~",
      "#....~.~......==........#...................~.~#~~~~~....~~~~~~#~~~~#~#~~~~~~~~~~~##~~~~~~~~~~~~",
      "#.............==..........................~#~.~~~#~~T.....~~~~~~~~~~~~~~~~~~~~~~~~#~~~~##~~~~~~~",
      "~~.~~U........==.........................~~~~~~~#~~~......~#~#~~~~~~~~~~~~~~~~~~#~~~~~~~#~#~~~~~",
      "~~T~~~........==..................~~~..~~~~~.~~.~~~#..~..~~~~~~~~~~~~~~~~~~~~~~#~~~~~~~~~~~~~~~~",
      "#.............==...#............................................~~.~~~~~~~~~~~~~~~~~~#~~~~~~~~~~",
      "#.............==...~~~.......#.......~.....==...~~~..........~...~.~~~#~#~##~~~~~~###~~~~~~#~~~~",
      "~~***********.==..~~~~...............~~..#.==...~~~#...............#.##~~##~~~~~#~#~~~~~~~~~~~~~",
      "~~***********.==..~.~~~..............~~....=...~~~~~~.~..............~~~~~~~~~~~~~#~~~~~##~~~~~~",
      "##***********.==~...TT....................==...~~#~~~~......#....~~~~~~~#~~~~~~~~~#~~~~#~~~~~~~~",
      "~#***********.==~~............==============..~~#~~~~#~..#.~~.....~##~~~~~~~~~~~~~~~~~#~~~~~~~~~",
      "~#***********.==..#...........==============..~~#~~~T~~~...~..~...#~~~~~~~~#~~~~~~~~~~#~~~##~~~~",
      "~~***********.==....~T~~......==.#..........~..~~#~..~~...........#~~#~~~~~#~#~#~~~~~~~~~#~~~~~~",
      "#.***********.==...~~.~~......==.~..........~.~~~#~~....#~......~..~~~~~~~~~~~~~~~~~~~~~~#~~#~~#",
      "#.............==...~~.........==.~.........~~#~~~~~~#...........~~~..~~~#~~~~~~~#~~~~~~~~~~~~~~~",
      "#.............==..............==.............~~#~~~#~#~.........~~..~~~#~~~~~~~#~~##~~~~~~~~~~#~",
      "================================...........~~~#~~~~~~#~#.##...#.....~~~~~~~~~~~~~~~~~~#~~~~~~~~~",
      "================================...........~~~#~~~#~~~~#~~~~~#~~~##~~~~~~~~#~~~~~#~~~###~~#~~~~~",
      "#................#.......................#..~~~~~#~~~~~#~~~~~~~~~#~~~~~~~~~~~#~#~~~~~#~~##~~~~~~",
      "~.***********...***********....***********..~~~~#~~~~~~#~~#~~~~~~~~~~~~~~~~~#~~~#~~~~~~#~~~##~~~",
      "~~***********...***********....***********..~..~#~~~~~~~~#~~~~~~~~~~~~~~~~~~~~~~~#~~~~~#~~~~~~~~",
      "~~***********.~.***********..~#***********....~~#~~~~~~~~#~~#~~~~~~~~#~~~~~#~~~~~#~~~~~~~#~~~~##",
      "##***********~~.***********..~~***********....~~~~~~~#~~~~~#~##~~~~~~~##~~~~~~~~~~~##~~~~~~~~~#~",
      "##***********.~~***********.~~~***********....#~~~~~#~~~~~~#~#~~###~~~~~#~~~~#~~~~~~~~~~~~~~~#~~",
      "##***********...***********....***********...~~~~~~~~~~#~~~~~~~~#~~~~~~~~~~~~~~~~~~~~~##~~~~~~~~",
      "##***********...***********....***********..~~~#~~~~~~#~~~~~~~~#~~~~~~~~~~#~~~##~~~~~~~~#~~~~~~#",
      "##***********...***********.~~.***********.~~~~#~~#~~~~~~~~~~~~~~~~~~~~~~#~~~#~~~~~~~#~#~~~~~~~~",
      "#~***********~#.***********.~~#***********.~~~#~~#~~~~~~~~~~~~~~~~~~~~##~~~~~#~~~#~~~~##~~#~~~~~",
      "#~##########~~~.............~...~########~..~~~~~#~~~~~~~~~~#~~#~~~~~~~~~~~~~#~~~~~~~~~#~~~~#~~~",
      "~~~##########~~................#~~~######~.~~~~~~~~~~~~~~~~~~~#~~#~~##~~#~~~~~~~~#~~~~~~~#~#~~~~",
      "~~~~########~~~....#..#........~~~~~####~~~~#~~~~~~~#~~~~~~~~~#~~~#~~~~#~~~~~~#~~~~~~#~~~~~~~~~~",
      "~#~~~#########TT#T#####TT~#######~~~~###~#~~~#~~~~~~#~~~~#~~~~#~~~~~~~~#~~~~~~~~~~##~~~~~~~~~#~~"
    ],
    "start": {
      "x": 48,
      "y": 23
    },
    "station": {
      "x": 48,
      "y": 22,
      "name": "大禹嶺站",
      "shelter": {
        "x": 47,
        "y": 19
      }
    },
    "npcs": [
      {
        "id": "road_engineer_cc",
        "x": 56,
        "y": 20,
        "sprite": "npc_road_engineer_cc",
        "dialog": "D_ENGINEER_CC_IDLE",
        "quest": "Q_CH_1",
        "quests": [
          "Q_CH_1"
        ]
      },
      {
        "id": "lodge_keeper_hh",
        "x": 29,
        "y": 25,
        "sprite": "npc_lodge_keeper_hh",
        "dialog": "D_INN_HEHUAN",
        "quest": "Q_CH_5",
        "quests": [
          "Q_CH_5"
        ]
      },
      {
        "id": "wuling_guide",
        "x": 19,
        "y": 11,
        "sprite": "npc_wuling_guide",
        "dialog": "D_WULING_IDLE",
        "quest": "Q_CH_4",
        "quests": [
          "Q_CH_4"
        ]
      },
      {
        "id": "veg_farmer",
        "x": 21,
        "y": 46,
        "sprite": "npc_veg_farmer",
        "dialog": "D_VEG_IDLE",
        "quest": "Q_CH_2",
        "quests": [
          "Q_CH_2"
        ]
      },
      {
        "id": "road_veteran",
        "x": 36,
        "y": 40,
        "sprite": "npc_road_veteran",
        "dialog": "D_VETERAN_IDLE",
        "quest": "Q_CH_3",
        "quests": [
          "Q_CH_3"
        ]
      }
    ],
    "props": [
      {
        "id": "car_snow_chain",
        "cells": [
          [
            63,
            16
          ],
          [
            64,
            16
          ]
        ]
      },
      {
        "id": "sign_snow_chain",
        "cells": [
          [
            63,
            17
          ]
        ]
      }
    ],
    "roadsigns": [],
    "chests": [
      {
        "id": "C_M30_1",
        "x": 3,
        "y": 4,
        "subject": "數學",
        "level": 3,
        "reward": {
          "gold": 13,
          "exp": 20,
          "item": null
        }
      },
      {
        "id": "C_M30_2",
        "x": 30,
        "y": 6,
        "subject": "數學",
        "level": 3,
        "reward": {
          "gold": 13,
          "exp": 20,
          "item": null
        }
      },
      {
        "id": "C_M30_3",
        "x": 9,
        "y": 28,
        "subject": "數學",
        "level": 3,
        "reward": {
          "gold": 13,
          "exp": 20,
          "item": null
        }
      },
      {
        "id": "C_M30_4",
        "x": 40,
        "y": 25,
        "subject": "數學",
        "level": 3,
        "reward": {
          "gold": 14,
          "exp": 20,
          "item": null
        }
      },
      {
        "id": "C_M30_5",
        "x": 60,
        "y": 33,
        "subject": "數學",
        "level": 3,
        "reward": {
          "gold": 14,
          "exp": 20,
          "item": null
        }
      },
      {
        "id": "C_M30_6",
        "x": 25,
        "y": 57,
        "subject": "數學",
        "level": 3,
        "reward": {
          "gold": 14,
          "exp": 20,
          "item": null
        }
      }
    ],
    "spawns": [
      {
        "monster": "fo_puff",
        "count": 3,
        "area": [
          66,
          14,
          16,
          7
        ]
      },
      {
        "monster": "wx_snow",
        "count": 3,
        "area": [
          1,
          1,
          12,
          14
        ]
      }
    ],
    "inn": {
      "x": 29,
      "y": 25,
      "npc": "lodge_keeper_hh",
      "price": 28,
      "speaker": "lodge_keeper_hh",
      "name": "高山山莊",
      "sign": "旅店",
      "dialog": "D_INN_HEHUAN",
      "dialog_nocoin": "D_INN_HEHUAN_NOCOIN"
    },
    "exits": [
      {
        "x": 95,
        "y": 19,
        "to": "M29",
        "tx": 1,
        "ty": 16
      },
      {
        "x": 95,
        "y": 20,
        "to": "M29",
        "tx": 1,
        "ty": 17
      },
      {
        "x": 0,
        "y": 44,
        "to": "M31",
        "tx": 70,
        "ty": 25,
        "requires": "Q_CH_4",
        "requires_dialog": "D_EXIT_LOCK_ZH"
      },
      {
        "x": 0,
        "y": 45,
        "to": "M31",
        "tx": 70,
        "ty": 26,
        "requires": "Q_CH_4",
        "requires_dialog": "D_EXIT_LOCK_ZH"
      }
    ],
    "landmarks": [
      {
        "name": "峽谷公路與隧道口",
        "area": [
          64,
          4,
          32,
          36
        ]
      },
      {
        "name": "大禹嶺",
        "area": [
          34,
          10,
          30,
          30
        ]
      },
      {
        "name": "武嶺與高山草原",
        "area": [
          0,
          0,
          34,
          34
        ]
      },
      {
        "name": "下山路與高冷菜園",
        "area": [
          0,
          34,
          44,
          26
        ]
      }
    ],
    "safe_radius": {},
    "lights": [],
    "rec_level": [
      47,
      51
    ]
  },

  M31: {
    "name": "埔里・臺灣的中心",
    "type": "town",
    "level": 5,
    "bgm": "town",
    "battle_bg": "grass",
    "tileset": "town",
    "tileset_extra": "field",
    "safe": true,
    "suggest": "Lv47–51（安全區）",
    "real_ref": "南投埔里：臺灣地理中心碑、碑後石階、虎子山頂三角點、紙寮、茭白筍田壓縮成一張（71 號 5.4、5.6.2，U7–U9）",
    "art_note": "北邊虎子山頂：老松、小方形三角點石（不寫字）、木造觀景台；中間一條長石階往下到中心碑廣場（兩面白色弧牆＋紅褐屏牌＋銀桿頂端兩個交叉圓環，不畫題字）；東南小鎮：紙寮（不能進入，旁邊曬紙架）、鎮上旅店、茭白筍水田、東口兩條並排的路。背景 tools/bigmaps/M31_bg.webp（GPT 四塊延續法＋最小誤差接縫）。draft。",
    "grid": [
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTFFFFFFFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTT........FBBBBBF.TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTT~TTTTTT...KK..FBBBBBF.TTT~TTTTTTTTTTTTTTTTTTTTTT~TTTTT~TTT",
      "TTTT~T~TTTTTTTTTTTTTTT......FBBBBBF.TTT~TTTTT~TTTTT~TTTTTTTTTTTTTTTTTTTT",
      "TTTT~TTTTTTTTTTTTTTTTTU.....FFFBFFF.TTTTTTTTTTTTTTTTTTT~TTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTU.............TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TT~~TTTTTTTTTTTTTTTTTTT.SSS.......U.TTTTTTTTTTTTT~~TTTTTTTT~TTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTSSSUUUUUUUTUTTTTTTTTTTTT~TTTT~TTTTTTTTTTTTTTTTT~",
      "TTTTTTTTT~~TTTTTTTTTTTTTSSSTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT~TTTT",
      "TT~TTTTTTTTTTTTTTT~TTTTTSSSTTTTTTTTTTTTTTTTTTTTT~T~TTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTT~TTTTTTTT~TTTTSSSTTTTTTTTTTTTTTTTT~TTTTTTTTTTTTTTTTTTT~TTTTTTT",
      "TTTTTTTTTT~TTTTTTTTTTTTTSSSTTTTT~TTTTTTTTTTTTTTTTTTTTT~TTTTTTTTTTTTTTTTT",
      "TTTTTTTTT~TTTTT~TTTTTTTTSSSTTTTTTTTTTTTTTTTTTT~TTTTTTTTTTT~TTTTTTTTTTTTT",
      "TTTTTTTT~TTTTTTTTTTTTTTTSSSTTTTT~TTTTTTTTTTTTTTTTTTT~TTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTT~TTTTTTTSSSTTTT~TTTTTTTTTTTTTTTTTTT~TTTTTTTT~T~TTTTTTTTT",
      "TTTTTTTTTTTTTTTT~TT~TTTTSSSTTTTTTTTTTTTTTTT~~TTTTTT~T~TT~TTTTTTTTT~~TTTT",
      "TT~TTTTT~TTTTTTTTTT~TTTTSSSTTTTT~TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTT~T~TTTTTTTTTTTTTTTTSSSTTTTTTTTTTTTTTTTTTTTTTTTTT~~TTT~TTTTTTTTTTTTT",
      "TTTTT~TTTTTTTT~T========UUU=========TTTTTTTTTT~TTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTT~~TTTTTTTT~T========KKK=========TTTTTT~TT~~TTTTTTTTTTTTTTTTTTTT~TTTT",
      "TT~T~TTTTTTTT~TT======KKKKK=KK======TTTT~TTTTTTTTTTTTTTTT~T~TTT~TTTTTTTT",
      "TTTTTTTTTTTTTTTT======KKKKKKKK======TTTTTTTTTTTTTTTTTTTTT~TTT~TTTTTTTTTT",
      "TT~TTTTTTT~TTTTT======KKKKKKKK======TTTTTTTTTTTTTTTTTTTTTTTT~TTTTT~TTTTT",
      "TTTTTTTTTTTTTTTT======KKKKKKKK======TTTTTTT~TT~TTTTTTTTT~TTT~TTTTTTTTTTT",
      "TTTTTTTTTTTTTTTT======================TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTT~TTTT~TT======================TTTTTTTTTTTTTTTTTT================",
      "TTTTTTTTTTTT~TTT======================..TTTTTTTTTTTTTTTT================",
      "~TTTTTTTTTTTTTTT=======================================================T",
      "TTTTTTTTTTTTTTTTUUUUU..UU....U..U..====================================T",
      "TTTTTTTTTTTTTTTTTTTTTUUTT.UTUTTUTUUU==..RRRRRRRRRR....==....RRRRRRRRR..T",
      "TTTT~TTTTTTTTTTTTTTTTTTTTUTTTTTT~TTT==.URRRRRRRRRR....==...URRRRRRRRR..T",
      "TTTTTTTTTTTT~TTTTTTTTT~TTTTTTTTTTTTT==.TRRRRRRRRRRU...==...TRRRRRRRRR..T",
      "~TTTTTTTTTTTTT~TTTTTTTTTTTTTTTT~~~TT==.TRRRRRRRRRRT...==....RRRRRRRRRU.T",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTT~TTTTTTT==.KHHHHHHHHHHT...==...UHHHHHHHHHT.T",
      "TTTTTTTTTTTTTT~TTTTTTTTTT~~TTTTTTTTT==.KHHHHHHHHHHT...==...THHHHHHHHHT.T",
      "TTT~TTTTTTTTTTTTTTTTTTTTTTTTT~TTTTTT==.KHHHHHHHHHHT...==...THHHHHHHHHT.T",
      "TTTTTTTTTTTTTT~TTT~~TTTTTTTTTTTTT~TT==....K...........==...THHHHHHHHHT.T",
      "TTTT~TTTTTTTTTTTTTTTTTTTTTTTTT~~TTTT==.................................T",
      "TTTTTTTTTTTTTTTTTTT~~TTTTTT~TTTTTTTT==.~~~~~~~~~~~~U..................UT",
      "TTTTTTTTTTTTT~~TT~TTTTTTTTTTTTTTTTTT==U~~~~~~~~~~~~T.................UTT",
      "TTTTTTTTTTTT~TTTTTTTTTTTT~TTTTTT~TTT==T~~~~~~~~~~~~T................UTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTT~T~TTTTTTT~T==.~~~~~~~~~~~~T..==............UTTT",
      "TTTTTTTTTTTTTTTTTTTTT~~TTTTTTTTTTTTT==.~~~~~~~~~~~~T..==............TTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT~TTT==U~~~~~~~~~~~~T..==.........UU..TTT",
      "TTTTTTTTTTTTTTTTT~~TTTTTTTTTTTTTTTTT==T~~~~~~~~~~~~TU.==.........TT..TTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==T~~~~~~~~~~~~TT.==.............TTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTT~~TT~TTTTTT==T~~~~~~~~~~~~T..==.............TTT",
      "TTTTTTTT~TTTTTTTTTTT~~T~TTTT~TTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"
    ],
    "start": {
      "x": 56,
      "y": 39
    },
    "station": {
      "x": 56,
      "y": 40,
      "name": "埔里站",
      "shelter": {
        "x": 53,
        "y": 38
      }
    },
    "npcs": [
      {
        "id": "center_volunteer",
        "x": 30,
        "y": 24,
        "sprite": "npc_center_volunteer",
        "dialog": "D_CENTER_IDLE",
        "quest": "Q_PU_2",
        "quests": [
          "Q_PU_2"
        ]
      },
      {
        "id": "paper_master",
        "x": 45,
        "y": 36,
        "sprite": "npc_paper_master",
        "dialog": "D_PAPER_IDLE",
        "quest": "Q_PU_3",
        "quests": [
          "Q_PU_3"
        ]
      },
      {
        "id": "jiaobai_farmer",
        "x": 52,
        "y": 42,
        "sprite": "npc_jiaobai_farmer",
        "dialog": "D_JIAOBAI_IDLE",
        "quest": "Q_PU_4",
        "quests": [
          "Q_PU_4"
        ]
      },
      {
        "id": "inn_puli",
        "x": 65,
        "y": 37,
        "sprite": "npc_inn_puli_m",
        "dialog": "D_INN_PULI_IDLE",
        "quests": []
      },
      {
        "id": "dawn_ring_pu",
        "x": 26,
        "y": 2,
        "sprite": "npc_dawn_ring_pu",
        "dialog": "D_PUL_1A",
        "quest": "Q_PU_1",
        "quests": [
          "Q_PU_1"
        ],
        "show": {
          "after": "Q_PU_2",
          "until": "Q_PU_1"
        },
        "tw_exempt": true
      }
    ],
    "props": [],
    "roadsigns": [],
    "chests": [],
    "spawns": [],
    "inn": {
      "x": 65,
      "y": 37,
      "npc": "inn_puli",
      "price": 28,
      "speaker": "inn_puli",
      "name": "鎮上旅店",
      "sign": "旅店",
      "dialog": "D_INN_PULI",
      "dialog_nocoin": "D_INN_PULI_NOCOIN",
      "sells": "gear_puli"
    },
    "exits": [
      {
        "x": 71,
        "y": 25,
        "to": "M30",
        "tx": 1,
        "ty": 44
      },
      {
        "x": 71,
        "y": 26,
        "to": "M30",
        "tx": 1,
        "ty": 45
      },
      {
        "x": 36,
        "y": 47,
        "to": "M32",
        "tx": 42,
        "ty": 1,
        "requires": "Q_PU_1",
        "requires_dialog": "D_EXIT_LOCK_PU"
      },
      {
        "x": 37,
        "y": 47,
        "to": "M32",
        "tx": 43,
        "ty": 1,
        "requires": "Q_PU_1",
        "requires_dialog": "D_EXIT_LOCK_PU"
      }
    ],
    "landmarks": [
      {
        "name": "虎子山頂",
        "area": [
          16,
          0,
          20,
          7
        ]
      },
      {
        "name": "石階",
        "area": [
          24,
          6,
          3,
          12
        ]
      },
      {
        "name": "臺灣地理中心碑",
        "area": [
          16,
          18,
          20,
          10
        ]
      },
      {
        "name": "埔里鎮街",
        "area": [
          36,
          24,
          36,
          24
        ]
      }
    ],
    "lights": [],
    "rec_level": [
      47,
      51
    ]
  },

  M32: {
    "name": "溪頭森林・燈籠町",
    "type": "field",
    "level": 5,
    "bgm": "field",
    "battle_bg": "forest",
    "tileset": "field",
    "tileset_extra": "town",
    "suggest": "Lv47–51（頭目 PL 58）",
    "real_ref": "南投溪頭：柳杉林、孟宗竹林、大學池與竹拱橋、鹿谷茶園、松林町（遊戲裡叫燈籠町）壓縮成一張（71 號 5.5、5.6.3，U10–U13）",
    "art_note": "西北溪頭森林：高高的柳杉林、孟宗竹林、大學池與竹子搭的拱橋；東北茶園坡（一畦畦茶樹，行間草地可走）；中南燈籠町：日式木屋商店街、屋簷下大紅燈籠（不寫字）、石板廣場；町西南一圈林間夜路。不畫鳥居、不畫業者的妖怪雕像、不畫站著的神木。池邊往南的小路原本停在灌木前，用 v13_patch 接到夜路。背景 tools/bigmaps/M32_bg.webp（GPT 四塊延續法＋最小誤差接縫）。draft。",
    "grid": [
      "TTTTTT~TTTT~TTTTT~T~TTTT~~TTT~TTT~T~~TTT~T==TTT~TTTTT~TT~T~T~TT~TT~T~T~T~T~TTT~~TT~~TTT~TT",
      "~TTTTT~TT~TTT~~T~~T~TTTT~~T~T~TTTTTT~T~T~T==TTT~TTTT~T~TTT~T~~TTT~~T~T~T~T~TT~~TTT~T~~~TT~",
      "~TTTTTTTTTTTT~T~TTTTTT~T~TTTTTTTTTTTTT~TTT==TT~TTT~TTTTT~~TTT~TT~TTTTTTT~TTT~TTT~TT~TTTTT~",
      "TTT~~TTTT~TTT~TTT~TTTT~TTTTTTT~TTT~T~TTTTT==TT~TTTTTTTTTTTT~TTT~~TTTTTTTTTT~TTTTTTT~TTT~~T",
      "~TTTTT~TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "~T~TT~~TT~~TTT~~TTTTTTT~TTTTTTTTTTTTTTTTT.==.TT~T.....................................TT~T",
      "TTTTTTTTTTT...TT.....TTTTTTT.......TTTTTTT==T~~TT..**********************************.TTT~",
      "~T~T~TT...................................==.TTTT..**********************************.TTTT",
      "T~~T~~T...................................==UT~TT.....................................TTT~",
      "TTTTTTT...................................==TTTTT..**********************************.TT~T",
      "T~TTT~TU..=============================...==.T~~~..**********************************.TTTT",
      "~~T~TTTT..=============================...==UT~TT.....................................TTTT",
      "TTT~T~.............==.....==..............==TTTTT..**********************************.TT~T",
      "T~TTT~............UBBUUU..==..............==.TT~T..**********************************.TTTT",
      "TTTT~~UU.....~~~~~~BBF~~~~==.UUUUUUUTUUU..==.TTTT.....................................TTTT",
      "~T~TTTTU.....~~~~~~BBF~~~~==.TTTTTUTTTTTU.==.TTTT..**********************************..T~T",
      "T~~TTTTT....U~~~~~~BBF~~~~==UTTTTTTTTTTTTU==TT~T~..**********************************.TTTT",
      "TTT~~TT.....T~~~~~~BBF~~~~==TTTTTTTTTTTTTU==TT~T~.....................................TT~~",
      "~TTT~TT......~~~~~~BBF~~~~==TTTTTTTTTTTTTT==.TTTT..**********************************.TT~T",
      "TTTTTT~U...UU~~~~~~BBF~~~~==TTTTTTTTTTTTT.==UTTTT..**********************************.TTTT",
      "TT~TTT~T...TT~~~~~~BBF~~~~==TTTTTTTT~TTTTU==U~~TT.....................................TTTT",
      "TTTTTTTTU....~~~~~~BBF~~~~==..TTTTTTTTTTTT==TTTTT..**********************************.TT~T",
      "TTTTTTTTUU........TBB.....==.UTTTTTTTTTTTT==.TT~T..**********************************.T~TT",
      "TT~TTT.TTT..........=.....==UTTTTTTTTTTTTT==.T~TT.....................................TTT~",
      "T~TT~T.................UU.==UTTTTT====********************************************..UU~TTT",
      "TTTT~TUU...............TT.==TTTTTT====********************************************..TTTTTT",
      "TT~TTTTT..................==..TTT...==********************************************..TTT~TT",
      "~TT~TT~T..................==........RRRRRRRRRR=====================================UTTTTT~",
      "T~~~TTTT..................==........RRRRRRRRRR==RRRRRRRRRRRRRRRRRRR.........======UTTTT~~T",
      "TTTTTT~~U.UUU.............==.U.....URRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR.........======TTT~~TTT",
      "T~~T~T~TTUTTTU....UUUU....==UT...UUTHHHHHHHHHHRRRRRRRRRRRRRRRRRRRRR.........======TTT~TT~T",
      "~TTTT~~T~~T~~TUUUUTTTTU.UU==TTUUUTTT==HHHHHHHHHHHHHHHHHHHHHHHHHHHHHURRRRRRUU======TTTTT~TT",
      "TTTTTTTTTTTTT~UUUUTTTTU~UU==TTUU~TTT==HHHHHHHHHHHHHHHHHHHHHHHHHHHHHTRRRRRRTT======TTTTTTTT",
      "~T~TTTTTTTTTTTTTTTTTTTTTTT==TTTTTTTT================================RRRRRRTT======TTT~TTTT",
      "TTTTT=================================RRRRRRRR======================HHHHHHTT======TTTTT~~T",
      "TTTTT=====================U===========RRRRRRRR======================HHHHHHTT======TTTT~TTT",
      "TTTTT=UUUUUUUUUUUUTUUTUUUUTUUUUUUUUU==RRRRRRRRRRR===================HHHHHH========TTTTTTT~",
      "T~T~T=TTTTT~TTTTT~TT~T~~T~TTTTT~~TTT==HHHHHHHHRRR=================================TT~TTTTT",
      "TTTTT=TTTTTTTTTTTTTTTTTTTTT~TTTTTTTT==HHHHHHHHHHH===================RRRRRR========TTTT~~TT",
      "TTT~T=TTTTTTTTTTTT~TTTTT~T~TTTTTTTTT==HHHHHHHHHHH===================RRRRRR========TTT~TTTT",
      "TTTTT=TTTTTTTTTTTTTTTTTTTTTTT~TTTTTT==.TTTTTTT...===================RRRRRR========TTTTT~~T",
      "~TTTT=TTTTTTTTT~T~TTTTT~TTTTTTTT~TTT==T....T==...===================HHHHHH========TTTTTTTT",
      "TT~TT=TTT~TTTTTTT~TTTTT~TT~TTT~TTTTT==....TT==...===================HHHHHH========TTTT~TT~",
      "TTTTT=TTTTT~T~TTT~TT~TTTTTTT~TTTTTTT==......==...===================HHHHHH========TTT~TT~T",
      "TTTTT=TTTTTTTTTTTTTTT~TTTTT~TT~TTTTT==TU....==...=================================TTTTTTTT",
      "~~TTT=TTTTTTTTTTTT~~T~TTTT~TTTTT~TTT==.TT...==...=================================TT~TTT~T",
      "TT~~T=TTTTTT~TTT~TTT~~TT~~TTTTTTTTTT==TTTTTT==...=================================TTTTT~~T",
      "TTTTT=..TTTTTTTTT~TTTTTTTTTT~T~TTTTT==TTT...==...=================================TTT~TTT~",
      "~T~TT=UTTTTTTTTTTTTTTTTTTTTTTTTTTTTT==T....U==...=================================TTTTTTT~",
      "TTTTT=TTTTTTTTTTTTTTTTT~TTTTTTTTTTTT==T...TT==..UUUUUUU===UU====UUUUUUUUUUUUUUUUUUTTTTTT~T",
      "TTT~T==TTTTTTTTTTTTTTTTTTTTTTTTTTTTT==......==UUTTTTTTTUU.TTUUUUTTTTTTTTTTTTTTTTTTTTT~~TTT",
      "TTTTT=================================.UUU..==TTTTT~T~~TTTTTTTTT~T~TTT~TTT~~TTT~TTTTTTTT~~",
      "~T~~T.UU...UU.U....T....UUU...T........TTT.T==..TT~~TTTTTTT~~TT~TT~~TTTTT~TTT~~TTT~TTTTTTT",
      "TTTT~UTTUUUTUUTUUU..TTUUTTT.UU..............==.TTTTTT~T~~T~TTTTT~~TTTTTTTTTT~TTT~~TTT~TTTT",
      "TTTTTTTTTT~TTTTTTTTTTTTTTTTUTTUUUU..TUU...U.==..TTTT~TTTTTTT~~~TTTT~TTT~~TTTTTTTTTT~TTTT~~",
      "~~T~~TTT~~TTTTTT~TTTTTTTTTTUTTUUUUU..UU.UUUU==U.TTTTTT~~TTTTTTTTTT~TTTTTTTTTTTTTTTTTTTT~~T",
      "TTTTTT~TTTT~TTTTTT~TTTTTTTT~~TTTTTTTTTTTTTTT==TTTTTTTTTTT~TTTTTT~TTTT~TTTT~TTTTTTTTTTT~TTT"
    ],
    "start": {
      "x": 43,
      "y": 33
    },
    "station": {
      "x": 44,
      "y": 33,
      "name": "溪頭站",
      "shelter": {
        "x": 46,
        "y": 33
      }
    },
    "npcs": [
      {
        "id": "forest_guide_xt",
        "x": 25,
        "y": 23,
        "sprite": "npc_forest_guide_xt",
        "dialog": "D_FORESTXT_IDLE",
        "quest": "Q_XT_1",
        "quests": [
          "Q_XT_1"
        ]
      },
      {
        "id": "lantern_shop",
        "x": 56,
        "y": 34,
        "sprite": "npc_lantern_shop",
        "dialog": "D_LANTERN_IDLE",
        "quest": "Q_XT_2",
        "quests": [
          "Q_XT_2",
          "Q_XT_3",
          "Q_XT_4"
        ]
      },
      {
        "id": "tea_farmer_lg",
        "x": 64,
        "y": 17,
        "sprite": "npc_tea_farmer_lg",
        "dialog": "D_TEA_LG_IDLE",
        "quest": "Q_XT_5",
        "quests": [
          "Q_XT_5"
        ]
      },
      {
        "id": "inn_xitou",
        "x": 66,
        "y": 36,
        "sprite": "npc_inn_xitou_m",
        "dialog": "D_INN_XITOU_IDLE",
        "quests": []
      }
    ],
    "props": [],
    "roadsigns": [],
    "chests": [
      {
        "id": "C_M32_1",
        "x": 8,
        "y": 7,
        "subject": "數學",
        "level": 3,
        "reward": {
          "gold": 13,
          "exp": 20,
          "item": null
        }
      },
      {
        "id": "C_M32_2",
        "x": 36,
        "y": 8,
        "subject": "數學",
        "level": 3,
        "reward": {
          "gold": 13,
          "exp": 20,
          "item": null
        }
      },
      {
        "id": "C_M32_3",
        "x": 85,
        "y": 8,
        "subject": "數學",
        "level": 3,
        "reward": {
          "gold": 13,
          "exp": 20,
          "item": null
        }
      },
      {
        "id": "C_M32_4",
        "x": 43,
        "y": 23,
        "subject": "數學",
        "level": 3,
        "reward": {
          "gold": 14,
          "exp": 20,
          "item": null
        }
      },
      {
        "id": "C_M32_5",
        "x": 80,
        "y": 45,
        "subject": "數學",
        "level": 3,
        "reward": {
          "gold": 14,
          "exp": 20,
          "item": null
        }
      },
      {
        "id": "C_M32_6",
        "x": 8,
        "y": 52,
        "subject": "數學",
        "level": 3,
        "reward": {
          "gold": 14,
          "exp": 20,
          "item": null
        }
      }
    ],
    "spawns": [
      {
        "monster": "gh_bamboo",
        "count": 3,
        "area": [
          28,
          24,
          8,
          7
        ]
      },
      {
        "monster": "gh_cone",
        "count": 3,
        "area": [
          6,
          5,
          12,
          6
        ]
      },
      {
        "monster": "gh_civet_f",
        "count": 4,
        "area": [
          5,
          34,
          13,
          19
        ]
      },
      {
        "monster": "gh_lantern_f",
        "count": 2,
        "area": [
          5,
          34,
          13,
          19
        ]
      },
      {
        "monster": "gh_umbrella_f",
        "count": 1,
        "area": [
          18,
          34,
          15,
          19
        ]
      },
      {
        "monster": "gh_geta_f",
        "count": 1,
        "area": [
          18,
          34,
          15,
          19
        ]
      },
      {
        "monster": "ghb_civetboss",
        "count": 1,
        "area": [
          58,
          44,
          1,
          1
        ],
        "boss": true,
        "quest": "Q_XT_4"
      }
    ],
    "night_zone": {
      "area": [
        4,
        33,
        34,
        24
      ]
    },
    "inn": {
      "x": 66,
      "y": 36,
      "npc": "inn_xitou",
      "price": 28,
      "speaker": "inn_xitou",
      "name": "燈籠町旅店",
      "sign": "旅店",
      "dialog": "D_INN_XITOU",
      "dialog_nocoin": "D_INN_XITOU_NOCOIN"
    },
    "exits": [
      {
        "x": 42,
        "y": 0,
        "to": "M31",
        "tx": 36,
        "ty": 46
      },
      {
        "x": 43,
        "y": 0,
        "to": "M31",
        "tx": 37,
        "ty": 46
      },
      {
        "x": 44,
        "y": 56,
        "to": "M33",
        "tx": 41,
        "ty": 1,
        "requires": "Q_XT_4",
        "requires_dialog": "D_EXIT_LOCK_XT"
      },
      {
        "x": 45,
        "y": 56,
        "to": "M33",
        "tx": 42,
        "ty": 1,
        "requires": "Q_XT_4",
        "requires_dialog": "D_EXIT_LOCK_XT"
      }
    ],
    "landmarks": [
      {
        "name": "溪頭森林",
        "area": [
          0,
          4,
          50,
          30
        ]
      },
      {
        "name": "大學池",
        "area": [
          13,
          13,
          13,
          10
        ]
      },
      {
        "name": "茶園坡",
        "area": [
          49,
          4,
          37,
          23
        ]
      },
      {
        "name": "燈籠町",
        "area": [
          36,
          27,
          47,
          23
        ]
      },
      {
        "name": "林間夜路",
        "area": [
          4,
          33,
          34,
          24
        ]
      }
    ],
    "lights": [
      {
        "x": 37,
        "y": 29,
        "r": 1.2
      },
      {
        "x": 39,
        "y": 29,
        "r": 1.2
      },
      {
        "x": 41,
        "y": 30,
        "r": 1.2
      },
      {
        "x": 43,
        "y": 30,
        "r": 1.2
      },
      {
        "x": 45,
        "y": 31,
        "r": 1.2
      },
      {
        "x": 47,
        "y": 31,
        "r": 1.2
      },
      {
        "x": 49,
        "y": 30,
        "r": 1.2
      },
      {
        "x": 53,
        "y": 30,
        "r": 1.2
      },
      {
        "x": 56,
        "y": 30,
        "r": 1.2
      },
      {
        "x": 58,
        "y": 31,
        "r": 1.2
      },
      {
        "x": 61,
        "y": 31,
        "r": 1.2
      },
      {
        "x": 64,
        "y": 31,
        "r": 1.2
      },
      {
        "x": 69,
        "y": 33,
        "r": 1.2
      },
      {
        "x": 71,
        "y": 33,
        "r": 1.2
      },
      {
        "x": 72,
        "y": 33,
        "r": 1.2
      },
      {
        "x": 39,
        "y": 37,
        "r": 1.2
      },
      {
        "x": 41,
        "y": 37,
        "r": 1.2
      },
      {
        "x": 43,
        "y": 37,
        "r": 1.2
      },
      {
        "x": 45,
        "y": 38,
        "r": 1.2
      },
      {
        "x": 47,
        "y": 38,
        "r": 1.2
      },
      {
        "x": 69,
        "y": 40,
        "r": 1.2
      },
      {
        "x": 71,
        "y": 40,
        "r": 1.2
      },
      {
        "x": 72,
        "y": 40,
        "r": 1.2
      }
    ],
    "rec_level": [
      47,
      51
    ]
  },
  M33: {
    "name": "塔塔加鞍部",
    "type": "field",
    "level": 5,
    "bgm": "field",
    "battle_bg": "alpine",
    "tileset": "field",
    "suggest": "Lv51–54",
    "real_ref": "塔塔加鞍部（玉山國家公園管理處：「位於塔塔加鞍部，海拔約2,610公尺」「為南北向之狹長草原稜線腹地廣大」「可東眺玉山山塊、西望阿里山山脈」；71 號 6.3、6.8.1，V1、V3、V9）",
    "art_note": "中間一條南北向的狹長草原稜線（淺黃綠箭竹草原），兩側往下是針葉林；西北、西南角是遠方山脈，東北、東南角是遠方大山（玉山山塊）；稜線上一棟木造服務中心、一間山屋（招牌不寫字）；西側林下一塊空地（帝雉由程式放）；東邊登山口木棧道。背景不畫動物。背景 tools/bigmaps/M33_bg.webp（GPT 四塊延續法＋v13_align 對齊＋最小誤差接縫）。",
    "grid": [
      "############TTTTTTTTTTTTTTTTTTTTTTTTTTTTT=.TTTTTTTTTTTTTTTTTTTTTTTTTTT##############",
      "############TTTTTTTTTTTTTTTTTT.T.........=.TT..TT....TTTTTTTTTTTTTTTTT##############",
      "############TTTTTTTTTTTTTTTTTT........TT.=....T..T...TTTTTTTTTTTTTTTTT##############",
      "############TTTTTTTTTTTTTTTTTT...........=..TT.......TTTTTTTTTTTTTTTTT##############",
      "############TTTTTTTTTTTTTTTTTTT..........=.T.........TTTTTTTTTTTTTTTTT##############",
      "############TTTTTTTTTTTTTTTTTT..T.U......=..T...T....TTTTTTTTTTTTTTTTT##############",
      "############TTTTTTTTTTTTTTTTTT...TT......=...T.T......TTTTTTTTTTTTTTTT##############",
      "############TTTTTTTTTTTTTTTTTTU..........=..U.....U.TTTTTTTTTTTTTTTTTT##############",
      "############TTTTTTTTTTTTTTTTTTT..........=.TT.....T...TTTTTTTTTTTTTTTT##############",
      "############TTTTTTTTTTTTTTTTTT......T....=...U........TTTTTTTTTTTTTTTT##############",
      "############TTTTTTTTTTTTTTTTTTTT.....T...=.UUTU.......TTTTTTTTTTTTTTTT##############",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT...........=.RRRRRRR....TTTTTTTTTTTTTTTT##############",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT.T........=.RRRRRRR....TTTTTTTTTTTTTTTT##############",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT...U.......=.RRRRRRR....UTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTU..TTT.....=.HHHHHHHT...TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTT.........T........TTTTT......TTU.=.HHHHHHH.T...TTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTT.........T........TTTTT........T.=.............TTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTT..............T...TTTTTTT........=..T..........TTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTT..TT..........T...TTTTT......UT..=...UU...T..TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTT.............TT..TTTTT.....TT.T.=.UUTT...T....TTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTT..................TTTTT..T.......=.TT.....TTT..TTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTT..................TTTTTT.....T...=...T...T.....TTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "==============================..==..==.======.T.......TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "=============================================.....TT...TTTTTTTTTTTTTTTTTFFFFFFFFFFFT",
      "TUUUUUUU...................TUU.........===..============================BBBBBBBBBBBB",
      "TTTTTTTTT.T.........T..T..TTTT...T.T....==...===========================BBBBBBBBBBBB",
      "TTTTTTTT..................TTTTU.......T.==..TTT...T...TUUUUUUUUUUUUUUUTUUUUUUUUUUUUT",
      "TTTTTTTTTUT...TTTTTT.T.TTUTTTTTT...T....==.....TT......TTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTT.TT........T...TTTTT..........==.TU....T.TTT.TTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTT.........TTTT...TTTTU.........==..TUTT......TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTT.................TTTT.........===UTT...UUT...TTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTT...............T.TTTTT.TU.T...==.RRRRRRRU...TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTT.....T........TTTTTTT...T...T.===RRRRRRRT..TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTT....TT.........TTTTTTTT.......===RRRRRRR....TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTU................TTTT....U...T==.HHHHHHHU.T.TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTUUUUUUUUUUUUUUUUTTT.....U....===HHHHHHHU..TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT...TTUT..==....TTT.T...TTTTTTTTTTTTTTTTTT############",
      "############TTTTTTTTTTTTTTTTTT......T..T===...TTT......TTTTTTTTTTTTTTTTT############",
      "############TTTTTTTTTTTTTTTTTTUT.T......===.TU.......TTTTTTTTTTTTTTTTTTT############",
      "############TTTTTTTTTTTTTTTTTTT.........===..TUU.......TTTTTTTTTTTTTTTTT############",
      "############TTTTTTTTTTTTTTTTTTT...TT....==.UUTTT...T...TTTTTTTTTTTTTTTTT############",
      "############TTTTTTTTTTTTTTTTTTT.UT....UU==.UUT....TTU..TTTTTTTTTTTTTTTTT############",
      "############TTTTTTTTTTTTTTTTTTTTT....TTT==.TTTT.....T..TTTTTTTTTTTTTTTTT############",
      "############TTTTTTTTTTTTTTTTTTT...TUU...==.....TTT.....TTTTTTTTTTTTTTTTT############",
      "############TTTTTTTTTTTTTTTTTTT....TT........U....TT...TTTTTTTTTTTTTTTTT############",
      "############TTTTTTTTTTTTTTTTTTTTT...........TT.U.....T.TTTTTTTTTTTTTTTTT############",
      "############TTTTTTTTTTTTTTTTTTT....UUU..U....TUU.......TTTTTTTTTTTTTTTTT############",
      "############TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT############"
    ],
    "exits": [
      {
        "x": 41,
        "y": 0,
        "to": "M32",
        "tx": 44,
        "ty": 55
      },
      {
        "x": 42,
        "y": 0,
        "to": "M32",
        "tx": 45,
        "ty": 55
      },
      {
        "x": 0,
        "y": 22,
        "to": "M04",
        "tx": 88,
        "ty": 27
      },
      {
        "x": 0,
        "y": 23,
        "to": "M04",
        "tx": 88,
        "ty": 28
      },
      {
        "x": 83,
        "y": 24,
        "to": "M34",
        "tx": 1,
        "ty": 23,
        "requires": "Q_TK_1",
        "requires_dialog": "D_EXIT_LOCK_TK"
      },
      {
        "x": 83,
        "y": 25,
        "to": "M34",
        "tx": 1,
        "ty": 24,
        "requires": "Q_TK_1",
        "requires_dialog": "D_EXIT_LOCK_TK"
      }
    ],
    "roadsigns": [],
    "start": {
      "x": 40,
      "y": 6,
      "note": "塔塔加站旁（北端稜線）"
    },
    "station": {
      "x": 39,
      "y": 6,
      "name": "塔塔加站",
      "note": "稜線北段步道西側草地（71 號建議 (40,6)）",
      "noShelter": "高山步道旁的簡易站牌，旁邊沒有空地放候車亭"
    },
    "npcs": [
      {
        "id": "paiyun_volunteer",
        "x": 46,
        "y": 16,
        "sprite": "npc_paiyun_volunteer",
        "dialog": "D_PAIYUN_IDLE",
        "quest": "Q_TK_1",
        "quests": [
          "Q_TK_1"
        ],
        "note": "服務中心門前（71 號建議 (44,18)）"
      },
      {
        "id": "ysnp_ranger",
        "x": 38,
        "y": 28,
        "sprite": "npc_ysnp_ranger",
        "dialog": "D_YSNP_IDLE",
        "quest": "Q_TK_2",
        "quests": [
          "Q_TK_2"
        ],
        "note": "稜線中段"
      },
      {
        "id": "bird_guide",
        "x": 24,
        "y": 24,
        "sprite": "npc_bird_guide",
        "dialog": "D_BIRDGUIDE_IDLE",
        "quest": "Q_TK_3",
        "quests": [
          "Q_TK_3"
        ],
        "note": "西側林下空地東緣"
      }
    ],
    "spawns": [
      {
        "monster": "an_muntjac",
        "count": 2,
        "area": [
          31,
          36,
          23,
          11
        ],
        "note": "稜線南段（離帝雉 5 格以上）"
      },
      {
        "monster": "an_muntjac",
        "count": 1,
        "area": [
          46,
          37,
          8,
          8
        ],
        "note": "稜線東南"
      }
    ],
    "chests": [
      {
        "id": "C_M33_1",
        "x": 36,
        "y": 4,
        "subject": "數學",
        "level": 3,
        "reward": {
          "gold": 9,
          "exp": 15,
          "item": null
        },
        "note": "稜線北段西側（獎勵照 71 號 8.2 填）"
      },
      {
        "id": "C_M33_2",
        "x": 52,
        "y": 4,
        "subject": "數學",
        "level": 3,
        "reward": {
          "gold": 9,
          "exp": 15,
          "item": null
        },
        "note": "稜線北段東側"
      },
      {
        "id": "C_M33_3",
        "x": 9,
        "y": 16,
        "subject": "數學",
        "level": 3,
        "reward": {
          "gold": 10,
          "exp": 15,
          "item": null
        },
        "note": "林下空地西北角"
      },
      {
        "id": "C_M33_4",
        "x": 12,
        "y": 32,
        "subject": "數學",
        "level": 3,
        "reward": {
          "gold": 10,
          "exp": 15,
          "item": null
        },
        "note": "林下空地西南角；2026-10-26 關卡設計師：從 (12,34) 移到 (12,32)（原位置畫在松樹上；77 號 B9）"
      },
      {
        "id": "C_M33_5",
        "x": 34,
        "y": 42,
        "subject": "數學",
        "level": 3,
        "reward": {
          "gold": 10,
          "exp": 15,
          "item": null
        },
        "note": "稜線南段西側"
      },
      {
        "id": "C_M33_6",
        "x": 52,
        "y": 44,
        "subject": "數學",
        "level": 3,
        "reward": {
          "gold": 10,
          "exp": 15,
          "item": null
        },
        "note": "稜線南段東側"
      }
    ],
    "inn": {
      "x": 43,
      "y": 36,
      "npc": null,
      "price": 30,
      "speaker": "inn_tataka",
      "note": "山屋門口西側（門 x46 前畫了一棵樹，站櫃放在旁邊）；虛擬店員",
      "name": "塔塔加山屋",
      "sign": "山屋",
      "dialog": "D_INN_TATAKA",
      "dialog_nocoin": "D_INN_TATAKA_NOCOIN",
      "sells": "gear_tataka"
    },
    "landmarks": [
      {
        "name": "塔塔加鞍部",
        "area": [
          30,
          0,
          25,
          48
        ]
      }
    ],
    "lights": [],
    "friendly": [
      {
        "id": "pheasant_npc_0",
        "x": 14,
        "y": 20,
        "sprite": "npc_pheasant",
        "name": "帝雉"
      },
      {
        "id": "pheasant_npc_1",
        "x": 18,
        "y": 30,
        "sprite": "npc_pheasant",
        "name": "帝雉"
      }
    ],
    "keepaway": [
      {
        "id": "pheasant_npc_0",
        "x": 14,
        "y": 20,
        "radius": 5,
        "hint": "安靜地看帝雉，不靠近、不打擾喔！"
      },
      {
        "id": "pheasant_npc_1",
        "x": 18,
        "y": 30,
        "radius": 5,
        "hint": "安靜地看帝雉，不靠近、不打擾喔！"
      }
    ]
  },
  M34: {
    "name": "玉山步道",
    "type": "field",
    "level": 5,
    "bgm": "field",
    "battle_bg": "alpine",
    "tileset": "field",
    "suggest": "Lv51–54",
    "real_ref": "玉山主峰線步道（玉山國家公園管理處：孟祿亭「為溫帶林及寒帶林之交界處」；白木林「鐵杉及冷杉樹幹白化」；與熊共存；71 號 6.4、6.8.2，V6、V7、V8、V10）",
    "art_note": "登山步道從西往東爬：西段孟祿亭小木亭與空地（亭子西邊是傘形的臺灣鐵杉、東邊是尖塔形的冷杉＝森林交界）；中段步道貼著北側一大片灰色岩壁；東段白木林（樹幹銀白、沒有葉子的枯樹，地上矮草；不畫火、不畫燒焦）；步道旁 3 塊圖案告示牌（熊鈴、兩人結伴、垃圾帶下山，不寫字）。背景不畫黑熊。背景 tools/bigmaps/M34_bg.webp（GPT 四塊延續法＋v13_align＋最小誤差接縫）。",
    "grid": [
      "################################################################################################",
      "################################################################################################",
      "################################################################################################",
      "################################################################################################",
      "################################################################################################",
      "################################################################################################",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTT#############################TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTT#############################TT.T....T....T........TT....T.TTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTT#############################TT.TT...T....T...UT....T...TT...TTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTT#############################TT...............T....TTT...T..TTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTT#############################TTT..K....K...TU....U.....K.....TTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTT#############################TT...T....T....UK...TK...T....U.TTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTT#############################TTT..T....T....T....T...TTTT..U......T",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTT#############################TT........TT.K..T...TT........TT.....T",
      "TTTTTTTTTTTTTTT...........TTT#############################TT.....TT....KK....K........K........T",
      "TTTTTTTTTTTTTT...RRRRR......T#############################TT...........T....KT........T........T",
      "TTTTTTTTTTTTTT...RRRRR......T#############################TTTT.........TU....T........TU.......T",
      "TTTTTTTTTTTTT....RRRRR......TTTTTTTTT...............TTTTTTTTT.TT.K....TTTT...TT...T...TTT......T",
      "TTTTTTTTTTTTT....HHHHH......TTTTTTTTT...............TTTTTTTT=====K==============================",
      "TTTTTTTTTTTTT....HHHHH......TTTTTTTTTUU=========================================================",
      "TTTTTTTTTTTTT...............TTTTTTTTTTT===UUUUUUUUUUUUUUUUUUUT...................U.............T",
      "===============.............==============TTTTTTTTTTTTTTTTTTU..........K....K....K....K..T.....T",
      "===============............K==============TTTTTTTTTTTTTTTTTTTKT...K....T...KT....TK...T........T",
      "TUUUUUUUUUUUUK..............UUUUUUUUUUUUUUTTTTTTTTTTTTTTTTTTTTT...TK...T....T....T....TK.......T",
      "TTTTTTTTTTTTT...............TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT...KT...T....T....T....TTT......T",
      "TTTTTTTTTTTTT...............TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT.........TT...T....T....T........T",
      "TTTTTTTTTTTTT...............TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT.....K........K..........K.....UUUUUT",
      "TTTTTTTTTTTTTUUUUUUUUUUUUUUUTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT...T..T........TK..TT.....TK....TTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTUUT...T........T..........T..TTUTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT...TTT......TTT.....TT..TT...TTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTUU..........................TTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTUUUUUUUUUUUUUUUUUUUUUUUUUUTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "************************************************************************************************",
      "************************************************************************************************",
      "************************************************************************************************",
      "************************************************************************************************",
      "************************************************************************************************",
      "************************************************************************************************",
      "************************************************************************************************"
    ],
    "exits": [
      {
        "x": 0,
        "y": 23,
        "to": "M33",
        "tx": 82,
        "ty": 24
      },
      {
        "x": 0,
        "y": 24,
        "to": "M33",
        "tx": 82,
        "ty": 25
      },
      {
        "x": 95,
        "y": 20,
        "to": "M35",
        "tx": 1,
        "ty": 19,
        "requires": "Q_YS_3",
        "requires_dialog": "D_EXIT_LOCK_YS"
      },
      {
        "x": 95,
        "y": 21,
        "to": "M35",
        "tx": 1,
        "ty": 20,
        "requires": "Q_YS_3",
        "requires_dialog": "D_EXIT_LOCK_YS"
      }
    ],
    "roadsigns": [],
    "start": {
      "x": 1,
      "y": 23,
      "note": "從塔塔加登山口過來的到達站"
    },
    "npcs": [
      {
        "id": "trail_ranger",
        "x": 22,
        "y": 23,
        "sprite": "npc_trail_ranger",
        "dialog": "D_TRAILRANGER_IDLE",
        "quest": "Q_YS_1",
        "quests": [
          "Q_YS_1",
          "Q_YS_3"
        ],
        "note": "孟祿亭前（71 號建議 (22,25)）"
      }
    ],
    "spawns": [
      {
        "monster": "fo_puff",
        "count": 3,
        "area": [
          62,
          22,
          26,
          10
        ],
        "note": "白木林南半（起霧的地方）"
      },
      {
        "monster": "an_muntjac",
        "count": 3,
        "area": [
          13,
          16,
          15,
          13
        ],
        "note": "西段（孟祿亭空地；71 號寫西段林子，但林子是連續樹冠，改放空地南半，離亭子 3 格以上待前端處理）"
      },
      {
        "monster": "fob_mist",
        "count": 1,
        "area": [
          66,
          20,
          1,
          1
        ],
        "boss": true,
        "quest": "Q_YS_3",
        "note": "山嵐霧精：白木林前的步道 (66,20)（Q_YS_3 進行中才出現）"
      }
    ],
    "chests": [
      {
        "id": "C_M34_1",
        "x": 14,
        "y": 18,
        "subject": "數學",
        "level": 3,
        "reward": {
          "gold": 9,
          "exp": 15,
          "item": null
        },
        "note": "孟祿亭空地西北角（獎勵照 71 號 8.2 填）"
      },
      {
        "id": "C_M34_2",
        "x": 26,
        "y": 28,
        "subject": "數學",
        "level": 3,
        "reward": {
          "gold": 9,
          "exp": 15,
          "item": null
        },
        "note": "孟祿亭空地東南角"
      },
      {
        "id": "C_M34_3",
        "x": 49,
        "y": 19,
        "subject": "數學",
        "level": 3,
        "reward": {
          "gold": 10,
          "exp": 15,
          "item": null
        },
        "note": "岩壁腳下東端；2026-10-26 關卡設計師：從 (56,19) 移到 (49,19)（原位置在松樹林裡，移到岩壁腳下的草地；77 號 B10）"
      },
      {
        "id": "C_M34_4",
        "x": 62,
        "y": 9,
        "subject": "數學",
        "level": 3,
        "reward": {
          "gold": 10,
          "exp": 15,
          "item": null
        },
        "note": "白木林西北"
      },
      {
        "id": "C_M34_5",
        "x": 63,
        "y": 32,
        "subject": "數學",
        "level": 3,
        "reward": {
          "gold": 10,
          "exp": 15,
          "item": null
        },
        "note": "白木林西南"
      },
      {
        "id": "C_M34_6",
        "x": 93,
        "y": 15,
        "subject": "數學",
        "level": 3,
        "reward": {
          "gold": 10,
          "exp": 15,
          "item": null
        },
        "note": "東口北側草地"
      }
    ],
    "landmarks": [
      {
        "name": "孟祿亭",
        "area": [
          13,
          16,
          15,
          13
        ]
      },
      {
        "name": "白木林",
        "area": [
          56,
          8,
          34,
          26
        ]
      }
    ],
    "lights": [],
    "props": [
      {
        "id": "sign_safety",
        "cells": [
          [
            13,
            25
          ],
          [
            27,
            24
          ],
          [
            65,
            20
          ]
        ],
        "note": "圖案告示牌：熊鈴、結伴、垃圾帶下山（V10）；格子 K"
      }
    ],
    "friendly": [
      {
        "id": "bear_npc",
        "x": 44,
        "y": 20,
        "sprite": "npc_bear",
        "name": "臺灣黑熊",
        "show": {
          "after": "Q_YS_1",
          "until": "Q_YS_2"
        }
      }
    ],
    "keepaway": [
      {
        "id": "bear_npc",
        "x": 44,
        "y": 20,
        "radius": 6,
        "hint": "請停下腳步，和黑熊保持距離喔！",
        "show": {
          "after": "Q_YS_1",
          "until": "Q_YS_2"
        }
      }
    ]
  },
  M35: {
    "name": "排雲山莊",
    "type": "town",
    "level": 5,
    "bgm": "town",
    "battle_bg": "alpine",
    "tileset": "town",
    "no_monsters": true,
    "real_ref": "玉山主峰山腰的排雲山莊（玉山國家公園管理處：「位於玉山主峰山腰為一南向鋼骨結構山莊」「太陽能供電為主」；兒童版：「站在排雲山莊前的廣場，可以看到千奇萬變的雲海」；71 號 6.5、6.8.3，V2、V3）",
    "art_note": "山腰上一棟朝南的長方形兩層山莊（灰色鋼骨、深色木板牆、屋頂三排太陽能板，招牌不寫字）；前面一塊石板廣場，廣場南緣一道石砌矮牆，牆外是一大片雲海；西邊一條步道往玉山步道；山莊東側一條碎石路往東北上山（往風口）。安全區，不出怪。背景 tools/bigmaps/M35_bg.webp（GPT 一張畫完，v13_single.py fit）。",
    "grid": [
      "######################################==########",
      "######################################==########",
      "######################################==########",
      "######################################==########",
      "######################################==########",
      "#####################################*==########",
      "************************************====********",
      "************RRRRRRRRRRRRRRRRRRRRRR**====********",
      "************RRRRRRRRRRRRRRRRRRRRRR**==**********",
      "************RRRRRRRRRRRRRRRRRRRRRR**==**********",
      "************RRRRRRRRRRRRRRRRRRRRRR**==**********",
      "************RRRRRRRRRRRRRRRRRRRRRR**==**********",
      "************HHHHHHHHHHHHHHHHHHHHHH**==**********",
      "************HHHHHHHHHHHHHHHHHHHHHH**==**********",
      "************HHHHHHHHHHHHHHHHHHHHHH**==**********",
      "************HHHHHHHHHHHHHHHHHHHHHH**==**********",
      "************HHHHHHHHHHHHHHHHHHHHHH**==**********",
      "**********=============================*********",
      "*********==============================*********",
      "=======================================*********",
      "=======================================*********",
      "*********==============================*********",
      "*********==============================*********",
      "*********==============================*********",
      "*********==============================*********",
      "*********==============================*********",
      "*********==============================*********",
      "**********=============================*********",
      "*********FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF*********",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
    ],
    "exits": [
      {
        "x": 0,
        "y": 19,
        "to": "M34",
        "tx": 94,
        "ty": 20
      },
      {
        "x": 0,
        "y": 20,
        "to": "M34",
        "tx": 94,
        "ty": 21
      },
      {
        "x": 38,
        "y": 0,
        "to": "M36",
        "tx": 28,
        "ty": 43,
        "requires": "Q_PY_2",
        "requires_dialog": "D_EXIT_LOCK_PY"
      },
      {
        "x": 39,
        "y": 0,
        "to": "M36",
        "tx": 29,
        "ty": 43,
        "requires": "Q_PY_2",
        "requires_dialog": "D_EXIT_LOCK_PY"
      }
    ],
    "roadsigns": [],
    "start": {
      "x": 2,
      "y": 20,
      "note": "從玉山步道上來的到達站"
    },
    "npcs": [
      {
        "id": "lodge_manager_py",
        "x": 25,
        "y": 18,
        "sprite": "npc_lodge_manager_py",
        "dialog": "D_LODGE_PY_IDLE",
        "quest": "Q_PY_1",
        "quests": [
          "Q_PY_1"
        ],
        "note": "山莊門口（門 (23–24,16)）東側"
      }
    ],
    "spawns": [],
    "chests": [],
    "inn": {
      "x": 25,
      "y": 18,
      "npc": "lodge_manager_py",
      "price": 0,
      "free": true,
      "speaker": "lodge_manager_py",
      "note": "免費休息（全滿＋存檔）；旅店座標＝山莊管理員 lodge_manager_py 站的位置 (25,18)（山莊門口台階東南側，不擋台階前 (22–24,17)）。2026-11-09 A1：原 (22,17) 是台階正前方左側，改成和管理員同一格（validate_world 要求 inn 座標＝管理員 NPC 座標；4a 實作用 (25,18)）",
      "name": "排雲山莊",
      "sign": "山莊",
      "dialog": "D_INN_PAIYUN",
      "dialog_nocoin": "D_INN_PAIYUN"
    },
    "landmarks": [
      {
        "name": "排雲山莊",
        "area": [
          9,
          7,
          30,
          21
        ]
      }
    ],
    "lights": []
  },
  M36: {
    "name": "風口",
    "type": "field",
    "level": 5,
    "bgm": "field",
    "battle_bg": "alpine",
    "tileset": "field",
    "suggest": "Lv51–54",
    "real_ref": "玉山主峰風口（玉山國家公園管理處：「玉山主峰風口為碎石坡，坡滑且風勢大」「尤其起霧下雨時，請注意指標小心行走」；71 號 6.6、6.8.4，Y6、Y7）",
    "art_note": "整片灰色頁岩碎石坡，一條之字形碎石路往北爬；路邊 4 根木樁路標只畫箭頭圖案、不寫字；坡上方一道白色霧牆（霧王的霧，虛構），中間一小段路通到霧牆前（霧中入口）。不畫山頂、石碑、欄杆、鐵鍊、雪。背景 tools/bigmaps/M36_bg.webp（GPT 四塊延續法＋v13_align＋最小誤差接縫；兩處路面斷開用 v13_patch copy 以同圖路面補接）。",
    "grid": [
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~==~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~==~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "***************************K===*****************************",
      "******************=============*****************************",
      "******************=*****************************************",
      "******************=*****************************************",
      "******************=*****************************************",
      "*****************K=*****************************************",
      "******************=**********=====**************************",
      "******************=**********=====**************************",
      "******************=**********=***=============**************",
      "******************============**************==**************",
      "********************************************==**************",
      "********************************************==**************",
      "********************************************==**************",
      "********************************************==K*************",
      "********************************************==**************",
      "**************************************========**************",
      "**************************************=*********************",
      "**************************************=*********************",
      "**************************************=*********************",
      "**************************************=*********************",
      "**************************************=*********************",
      "******************======================********************",
      "******************=*****************************************",
      "******************=*****************************************",
      "******************=*****************************************",
      "****************K*=*****************************************",
      "******************=*****************************************",
      "******************=*****************************************",
      "*****************==*****************************************",
      "******************============******************************",
      "***************************K==******************************",
      "****************************==******************************",
      "****************************==******************************",
      "****************************==******************************",
      "****************************==******************************",
      "****************************==******************************",
      "****************************==******************************",
      "****************************==******************************",
      "****************************==******************************",
      "****************************==******************************"
    ],
    "exits": [
      {
        "x": 28,
        "y": 44,
        "to": "M35",
        "tx": 38,
        "ty": 1
      },
      {
        "x": 29,
        "y": 44,
        "to": "M35",
        "tx": 39,
        "ty": 1
      },
      {
        "x": 29,
        "y": 3,
        "to": "M37",
        "tx": 29,
        "ty": 43,
        "requires": [
          "Q_FK_1",
          "item:dawn_compass"
        ],
        "requires_dialog": "D_EXIT_LOCK_FK",
        "warp": true
      },
      {
        "x": 30,
        "y": 3,
        "to": "M37",
        "tx": 30,
        "ty": 43,
        "requires": [
          "Q_FK_1",
          "item:dawn_compass"
        ],
        "requires_dialog": "D_EXIT_LOCK_FK",
        "warp": true
      }
    ],
    "roadsigns": [
      {
        "id": "sign_fengkou",
        "x": 27,
        "y": 5,
        "dialog": "D_SIGN_FENGKOU",
        "note": "風口路標（2026-11-09 A1，4a 實作後補）：霧中入口前小平台 (28–30,5) 西側的岩邊；格子 K；從 (27,6)、(28,5) 都能按 A 讀；不擋路（原本就是礁岩 *）。台詞 D_SIGN_FENGKOU「起霧的時候，要看清楚路標，慢慢走。」（Y7）"
      }
    ],
    "start": {
      "x": 28,
      "y": 43,
      "note": "從排雲山莊上來的到達站"
    },
    "npcs": [],
    "spawns": [
      {
        "monster": "fo_puff",
        "count": 2,
        "area": [
          18,
          6,
          13,
          9
        ],
        "note": "碎石坡上段"
      },
      {
        "monster": "fo_puff",
        "count": 2,
        "area": [
          18,
          26,
          22,
          9
        ],
        "note": "碎石坡下段"
      }
    ],
    "chests": [
      {
        "id": "C_M36_1",
        "x": 30,
        "y": 6,
        "subject": "數學",
        "level": 3,
        "reward": {
          "gold": 14,
          "exp": 22,
          "item": null
        },
        "note": "霧牆前（獎勵照 71 號 8.2 填）"
      },
      {
        "id": "C_M36_2",
        "x": 33,
        "y": 11,
        "subject": "數學",
        "level": 3,
        "reward": {
          "gold": 14,
          "exp": 22,
          "item": null
        },
        "note": "之字路上段的小岔"
      },
      {
        "id": "C_M36_3",
        "x": 39,
        "y": 26,
        "subject": "數學",
        "level": 3,
        "reward": {
          "gold": 15,
          "exp": 23,
          "item": null
        },
        "note": "中段轉角"
      },
      {
        "id": "C_M36_4",
        "x": 17,
        "y": 33,
        "subject": "數學",
        "level": 3,
        "reward": {
          "gold": 15,
          "exp": 23,
          "item": null
        },
        "note": "下段路邊"
      }
    ],
    "landmarks": [
      {
        "name": "風口",
        "area": [
          0,
          0,
          60,
          45
        ]
      }
    ],
    "lights": [],
    "props": [
      {
        "id": "trail_marker",
        "cells": [
          [
            17,
            10
          ],
          [
            46,
            18
          ],
          [
            16,
            30
          ],
          [
            27,
            35
          ]
        ],
        "note": "圖案路標（箭頭，不寫字；格子 K）"
      }
    ]
  },
  M37: {
    "name": "回音霧廊",
    "type": "dungeon",
    "level": 5,
    "bgm": "dungeon",
    "battle_bg": "fogcave",
    "tileset": "cave",
    "real_ref": "虛構（霧之洞窟）",
    "art_note": "灰藍色岩洞：北邊往下的石階與刻著大嘴巴的回音謎門 (29–30,7)；中間洞室；三岔大廳往左、右各一條死路小洞室；地上淡藍綠發光苔蘚標出真正的路（中間那條）；牆邊淡藍水晶、小水窪。 背景 tools/bigmaps/<ID>_bg.webp（GPT 四塊延續法＋最小誤差接縫）。",
    "grid": [
      "#############################SS#############################",
      "############################SSS#############################",
      "############################%==%############################",
      "############################%==%############################",
      "#############################==%############################",
      "#############################==%############################",
      "#############################==#############################",
      "#############################==#############################",
      "#############################==#############################",
      "##########################%%%%%%%###########################",
      "##########################%%%%%%%################%%%%%%%%###",
      "####*#%%%%%###############%%%%%%%###############%%%%%%%%*###",
      "###%%%%%%%%%%#############%%%%%%################%%%%%%%%%###",
      "###%%%%%%%%%%############%%%%%##################~~%%%%%%%###",
      "###%%%%%%%~~%##########%%%%%####################~~%%%%%%%###",
      "###%%%%%%%~~%#########%%%%%%####################%%%%%%%%%%##",
      "###%%%%%%%%%##########%%%%%#####################%%%%%%%%%%##",
      "#####%%%%%%###########%%%%%######################%%%%*%%%%##",
      "######%*%%############%%%%%%#####################%%%%%%%%###",
      "######%%%%############%%%%%%%%%%################%%%%%%%#####",
      "######%%%##############%%%%%%%%%################%%%%%#######",
      "######%%%###################%%%%################%%%#########",
      "######%%#####################%%%###############%%%%#########",
      "######%%#####################%%%###############%%%##########",
      "#####%%%#####################%%%###############%%%##########",
      "######%%#####################%%%###############%%%##########",
      "######%%#####################%%%%##############%%%##########",
      "#######%%####################%%%%#~~###########%%%##########",
      "######%%%%%%%%%%%%#~~#######%%%%##~~%##########%%%##########",
      "######%%%%%%%%%%%%%~~%%####%%%%###%%%%%%%%####%%%%##########",
      "#######%%%%%%%%%%%%%%%%%%#%%%%%%#%%%%%%%%%%%%%%%%%%#########",
      "########%%%%%%%%%%%%%%%%%%%%%%%%#%%%%%%%%%%%%%%%%%##########",
      "#########%%%%%%%###%%%%%%%##%%%%%%%%%%%##%%##%%%#%##########",
      "############%%%######%#######==%%%%%########################",
      "#############%%#############%==%%%%#########################",
      "#############%%########%%%%%%==%K%%#########################",
      "#############%%#######%%%%%%%==%%%%%########################",
      "############%%%#######%%%%%%%==%%%%%########################",
      "#############%#########%%%%%%==%%%%%########################",
      "#########################%%%%==##%%%########################",
      "############################%==%%%%%########################",
      "#############################==%%%%%########################",
      "#############################==%%%%%########################",
      "#############################==%#%%#########################",
      "#############################==#############################"
    ],
    "exits": [
      {
        "x": 29,
        "y": 0,
        "to": "M38",
        "tx": 29,
        "ty": 43
      },
      {
        "x": 30,
        "y": 0,
        "to": "M38",
        "tx": 30,
        "ty": 43
      },
      {
        "x": 29,
        "y": 44,
        "to": "M36",
        "tx": 29,
        "ty": 5
      },
      {
        "x": 30,
        "y": 44,
        "to": "M36",
        "tx": 30,
        "ty": 5
      }
    ],
    "roadsigns": [],
    "start": {
      "x": 30,
      "y": 42,
      "note": "南口上來的苔蘚路"
    },
    "npcs": [],
    "spawns": [
      {
        "monster": "fo_puff_cave",
        "count": 2,
        "area": [
          6,
          27,
          19,
          6
        ],
        "note": "三岔大廳西半"
      },
      {
        "monster": "fo_puff_cave",
        "count": 2,
        "area": [
          36,
          27,
          14,
          6
        ],
        "note": "三岔大廳東半"
      },
      {
        "monster": "fo_echo",
        "count": 2,
        "area": [
          22,
          9,
          11,
          9
        ],
        "note": "回音謎門前的中間洞室"
      }
    ],
    "chests": [
      {
        "id": "C_M37_1",
        "x": 4,
        "y": 12,
        "subject": "數學",
        "level": 3,
        "reward": {
          "gold": 29,
          "exp": 45,
          "item": "grass_jelly"
        },
        "note": "P1-2 解開後出現（金幣、經驗等第二段數值）",
        "no_question": true
      },
      {
        "id": "C_M37_2",
        "x": 56,
        "y": 12,
        "subject": "數學",
        "level": 3,
        "reward": {
          "gold": 29,
          "exp": 45,
          "item": "grass_jelly"
        },
        "note": "P1-3 解開後出現（金幣、經驗等第二段數值）",
        "no_question": true
      }
    ],
    "landmarks": [
      {
        "name": "回音謎門",
        "area": [
          26,
          6,
          8,
          2
        ]
      },
      {
        "name": "三岔大廳",
        "area": [
          6,
          27,
          44,
          6
        ]
      }
    ],
    "lights": [],
    "no_minimap": true,
    "fog_mask": true,
    "lodge_lamps": [
      {
        "id": "obj_lodge_lamp",
        "x": 32,
        "y": 35,
        "kind": "lodge",
        "note": "入口山屋小燈（71 號寫 (30,41)；畫面上的石台在 (32,35)）"
      }
    ],
    "echo_door": {
      "cells": [
        [
          29,
          7
        ],
        [
          30,
          7
        ]
      ],
      "dialog": "D_ECHO_DOOR",
      "note": "答對 3 題國語才開（2.3 節）"
    },
    "puzzles": [
      {
        "id": "P1-1",
        "type": "lights",
        "required": true,
        "area": [
          28,
          21,
          32,
          25
        ],
        "door": [
          [
            29,
            21
          ],
          [
            30,
            21
          ],
          [
            31,
            21
          ]
        ],
        "plates": {
          "A": [
            29,
            24
          ],
          "B": [
            30,
            24
          ],
          "C": [
            31,
            24
          ]
        },
        "note": "71 號寫石門 (29–30,18)、踏板 y22；畫面上中間走廊 3 格寬、在 x29–31，石門改 (29–31,21)、踏板 (29–31,24)；連線與答案不變"
      },
      {
        "id": "P1-2",
        "type": "pattern",
        "required": false,
        "area": [
          3,
          11,
          12,
          19
        ],
        "wall_slabs": [
          [
            5,
            11
          ],
          [
            6,
            11
          ],
          [
            7,
            11
          ],
          [
            8,
            11
          ],
          [
            9,
            11
          ]
        ],
        "answer_floors": [
          [
            5,
            16
          ],
          [
            7,
            16
          ],
          [
            9,
            16
          ],
          [
            11,
            16
          ]
        ],
        "reward_chest": "C_M37_1",
        "note": "左邊死路的洞室（71 號 x6–14 y18–26；畫面上的死路洞室在 x3–12 y11–19）"
      },
      {
        "id": "P1-3",
        "type": "memory",
        "required": false,
        "area": [
          48,
          10,
          57,
          19
        ],
        "cards": [
          [
            51,
            15
          ],
          [
            52,
            15
          ],
          [
            53,
            15
          ],
          [
            54,
            15
          ],
          [
            51,
            16
          ],
          [
            52,
            16
          ],
          [
            53,
            16
          ],
          [
            54,
            16
          ]
        ],
        "reward_chest": "C_M37_2",
        "note": "右邊死路的洞室（71 號 x46–54 y18–26；畫面上在 x48–57 y10–19）"
      }
    ]
  },
  M38: {
    "name": "霜晶迴廊",
    "type": "dungeon",
    "level": 5,
    "bgm": "dungeon",
    "battle_bg": "fogcave",
    "tileset": "cave",
    "real_ref": "虛構（霧之洞窟）",
    "art_note": "淡藍白冰洞：三間冰地板滑行房（冰面重鋪成和格子對齊的方格，冰石由程式畫）；冰房間二、三之間的霜地走道；推冰箱小房間（71 號的 7×7 地圖原樣畫在背景）；西邊入口大廳。 背景 tools/bigmaps/<ID>_bg.webp（GPT 四塊延續法＋最小誤差接縫）。",
    "grid": [
      "#############################SS#SS##########################",
      "#############################SS#SS##########################",
      "#############################SS#SS##########################",
      "############################%%%%%%%%########################",
      "############################%%%%%%%*%%%%%%%%%%%#############",
      "############################%%%%%%%%%%%%%%%%%%%#############",
      "#############################################%%#############",
      "#############################################%##############",
      "############################################*II*IIIII*III###",
      "############################################*IIIIIIIIIIII###",
      "############################################IIII*IIIIIIII###",
      "############################################IIIII*IIIIIII###",
      "############################################III*IIIII*I*I###",
      "############################################II*IIIIIIIIII###",
      "############################################IIIIIIIII*III###",
      "############################################IIIIIII*IIIII###",
      "############################################IIIIIIIIIIIII###",
      "####################################################%#######",
      "####################################################%#######",
      "#########################################%%%%%%%%%%%%%%%%%%#",
      "#########################################*%%%%%%%%%%%%%%%%%#",
      "#############################IIIIIIIIIII%%%%%%%%%%%%%%%%%%%#",
      "#############################IIIIIIIII*I#%K%%%%%%%%%%%%%%%%#",
      "#############################IIII*II*III##########%%%%%%%%%#",
      "#############################IIIIIIII*II##########%%******%#",
      "#######**I*IIIII#############III***IIIII##########%%******%#",
      "#####%%IIIIIIIII#############II*IIIIIIII###%%%%%##%%******%#",
      "#####%#IIIIIIII*#############*IIIIIII*II###%##%%##%%%%%%%*%#",
      "#######I*II*IIII##%%%########IIIII*IIIII###%%%%%##%%%%%%%%%#",
      "#######IIIIIIIII%%%%%##########%###########%%#%%##%%%%%%%%%#",
      "#######IIIIIIIII##%%%########%%%###########%%%%%##%%%%%%%%%#",
      "#######I*IIIIIII##%%%########==############%######%%%%%%%%%#",
      "##################%%%########==##########%%%%%%%%%%%%%%%%%%#",
      "##################%%%########==##########%%%%%%%%%%%%%%%%*%#",
      "###########%%%%%%%%%%%%%#####==###################%%%%%%%%%#",
      "#########%%%*%%%%%%%%%%%%%%%%=K###################%%%%%%%%%#",
      "#########%%%%%%%%%%%%%%%%%%%%==#############################",
      "#########%%%%%%%%%%%%%%%*%%%%==#############################",
      "###########%%%%%%%%%*%#######==#############################",
      "#############################==#############################",
      "#############################==#############################",
      "#############################==#############################",
      "#############################==#############################",
      "#############################==#############################",
      "#############################==#############################"
    ],
    "exits": [
      {
        "x": 29,
        "y": 0,
        "to": "M39",
        "tx": 28,
        "ty": 43
      },
      {
        "x": 30,
        "y": 0,
        "to": "M39",
        "tx": 29,
        "ty": 43
      },
      {
        "x": 32,
        "y": 0,
        "to": "M39",
        "tx": 30,
        "ty": 43
      },
      {
        "x": 33,
        "y": 0,
        "to": "M39",
        "tx": 31,
        "ty": 43
      },
      {
        "x": 29,
        "y": 44,
        "to": "M37",
        "tx": 29,
        "ty": 1
      },
      {
        "x": 30,
        "y": 44,
        "to": "M37",
        "tx": 30,
        "ty": 1
      }
    ],
    "roadsigns": [],
    "start": {
      "x": 29,
      "y": 42,
      "note": "南口上來的石板路"
    },
    "npcs": [],
    "spawns": [
      {
        "monster": "fo_frost",
        "count": 3,
        "area": [
          52,
          27,
          7,
          8
        ],
        "note": "東廳（冰房間外）"
      },
      {
        "monster": "fo_puff_cave",
        "count": 2,
        "area": [
          20,
          33,
          8,
          6
        ],
        "note": "入口大廳東半（P2-2 的 3 格外）"
      }
    ],
    "chests": [
      {
        "id": "C_M38_1",
        "x": 9,
        "y": 35,
        "subject": "數學",
        "level": 3,
        "reward": {
          "gold": 19,
          "exp": 30,
          "item": "grass_jelly"
        },
        "note": "P2-2 天平平衡後出現（金幣、經驗等第二段數值）",
        "no_question": true
      },
      {
        "id": "C_M38_2",
        "x": 44,
        "y": 33,
        "subject": "數學",
        "level": 3,
        "reward": {
          "gold": 19,
          "exp": 30,
          "item": "grass_jelly"
        },
        "note": "P2-1 冰箱推到發光格子後出現（金幣、經驗等第二段數值）",
        "no_question": true
      },
      {
        "id": "C_M38_3",
        "x": 5,
        "y": 27,
        "subject": "數學",
        "level": 3,
        "reward": {
          "gold": 20,
          "exp": 30,
          "item": "grass_jelly"
        },
        "note": "冰房間一出口外的小凹室（金幣、經驗等第二段數值）",
        "no_question": true
      }
    ],
    "landmarks": [
      {
        "name": "冰房間一",
        "area": [
          6,
          24,
          11,
          9
        ]
      },
      {
        "name": "冰房間二",
        "area": [
          28,
          20,
          13,
          10
        ]
      },
      {
        "name": "冰房間三",
        "area": [
          43,
          7,
          15,
          11
        ]
      }
    ],
    "lights": [],
    "no_minimap": true,
    "lodge_lamps": [
      {
        "id": "obj_lodge_lamp",
        "x": 30,
        "y": 35,
        "kind": "lodge",
        "note": "入口山屋小燈（石台）"
      },
      {
        "id": "obj_lodge_lamp",
        "x": 42,
        "y": 22,
        "kind": "marker",
        "note": "記號燈 F（71 號寫 (41,23)，那格是冰岩壁；放在冰房間二出口旁的走道上）"
      }
    ],
    "puzzles": [
      {
        "id": "P2-3",
        "type": "numseq",
        "required": true,
        "area": [
          46,
          18,
          53,
          21
        ],
        "pillars": [
          [
            47,
            18
          ],
          [
            48,
            18
          ],
          [
            49,
            18
          ],
          [
            50,
            18
          ],
          [
            51,
            18
          ]
        ],
        "number_floors": [
          [
            47,
            20
          ],
          [
            48,
            20
          ],
          [
            50,
            20
          ],
          [
            51,
            20
          ]
        ],
        "ice_gate": [
          [
            52,
            18
          ]
        ],
        "note": "71 號寫 x37–41 y14–24（畫面上是冰岩壁）；改到冰房間三入口前：冰柱畫在南牆、冰門擋在入口 (52,18)"
      },
      {
        "id": "P2-2",
        "type": "balance",
        "required": false,
        "area": [
          9,
          34,
          16,
          38
        ],
        "scale": [
          12,
          35
        ],
        "stones": [
          [
            10,
            37
          ],
          [
            12,
            37
          ],
          [
            14,
            37
          ],
          [
            16,
            37
          ]
        ],
        "reward_chest": "C_M38_1",
        "note": "改到西邊入口大廳（CTO 同意）"
      },
      {
        "id": "P2-1",
        "type": "sokoban",
        "required": false,
        "area": [
          42,
          25,
          48,
          31
        ],
        "door": [
          43,
          31
        ],
        "enter_to": [
          43,
          30
        ],
        "box": [
          45,
          28
        ],
        "goal": [
          43,
          26
        ],
        "reward_chest": "C_M38_2",
        "note": "71 號的 7×7 地圖原樣，左上 (42,25)；門在下牆 (43,31)，進門就站在起點 @ (43,30)"
      }
    ],
    "ice_rooms": [
      {
        "id": "ice1",
        "box": [
          6,
          24,
          16,
          32
        ],
        "entrance": [
          16,
          29
        ],
        "exit": [
          6,
          26
        ],
        "reset": [
          17,
          29
        ],
        "min_steps": 3,
        "solution": "LUL",
        "rocks": [
          [
            7,
            25
          ],
          [
            8,
            25
          ],
          [
            8,
            28
          ],
          [
            8,
            31
          ],
          [
            10,
            25
          ],
          [
            11,
            28
          ],
          [
            15,
            27
          ]
        ],
        "dots": 1,
        "note": "選做：出口外的小凹室有寶箱 C_M38_3"
      },
      {
        "id": "ice2",
        "box": [
          28,
          20,
          40,
          29
        ],
        "entrance": [
          31,
          29
        ],
        "exit": [
          40,
          21
        ],
        "reset": [
          31,
          30
        ],
        "min_steps": 4,
        "solution": "ULUR",
        "rocks": [
          [
            29,
            27
          ],
          [
            31,
            26
          ],
          [
            32,
            25
          ],
          [
            33,
            23
          ],
          [
            33,
            25
          ],
          [
            34,
            25
          ],
          [
            34,
            28
          ],
          [
            36,
            23
          ],
          [
            37,
            24
          ],
          [
            37,
            27
          ],
          [
            38,
            22
          ]
        ],
        "dots": 2,
        "note": "必經"
      },
      {
        "id": "ice3",
        "box": [
          43,
          7,
          57,
          17
        ],
        "entrance": [
          52,
          17
        ],
        "exit": [
          45,
          7
        ],
        "reset": [
          52,
          18
        ],
        "min_steps": 5,
        "solution": "ULDLU",
        "rocks": [
          [
            44,
            8
          ],
          [
            44,
            9
          ],
          [
            46,
            13
          ],
          [
            47,
            8
          ],
          [
            47,
            12
          ],
          [
            48,
            10
          ],
          [
            49,
            11
          ],
          [
            51,
            15
          ],
          [
            53,
            8
          ],
          [
            53,
            12
          ],
          [
            53,
            14
          ],
          [
            55,
            12
          ]
        ],
        "dots": 3,
        "note": "必經；出口往北到樓梯"
      }
    ],
    "decals": [
      {
        "type": "ice_pillar_dots",
        "x": 16,
        "y": 28,
        "dots": 1
      },
      {
        "type": "ice_pillar_dots",
        "x": 32,
        "y": 29,
        "dots": 2
      },
      {
        "type": "ice_pillar_dots",
        "x": 53,
        "y": 17,
        "dots": 3
      },
      {
        "type": "frost_arrow",
        "x": 20,
        "y": 34,
        "dir": "N",
        "note": "入口大廳 → 冰房間一"
      },
      {
        "type": "frost_arrow",
        "x": 29,
        "y": 33,
        "dir": "N",
        "note": "入口 → 冰房間二"
      },
      {
        "type": "frost_arrow",
        "x": 44,
        "y": 20,
        "dir": "E",
        "note": "冰房間二出口 → 冰房間三"
      },
      {
        "type": "frost_arrow",
        "x": 40,
        "y": 5,
        "dir": "W",
        "note": "冰房間三出口 → 樓梯"
      }
    ]
  },
  M39: {
    "name": "遺失物書庫",
    "type": "dungeon",
    "level": 5,
    "bgm": "dungeon",
    "battle_bg": "fogcave",
    "tileset": "cave",
    "real_ref": "虛構（霧之洞窟）",
    "art_note": "暖灰色的霧中書庫：8 座深木色高書架（圖案分類牌放大），中央紅地毯、西區藍地毯、東區綠地毯；書架區南緣矮木欄，中央是借書台的木柵；北邊木門與石階。 背景 tools/bigmaps/<ID>_bg.webp（GPT 四塊延續法＋最小誤差接縫）。",
    "grid": [
      "#############################SS#############################",
      "#############################SS#############################",
      "#############################==#############################",
      "##############%%%%%%%%%%%%%%====%%##########################",
      "##############%%%%%%%%%%%%%%====%%##########################",
      "##############%%%%%%%%%%%%%%====%%##########################",
      "##############%%%%%%%%%%%%%%====%%##########################",
      "####%%%%%%%%%%%%%%%%%%%%%%%%====%%%%%%%%%%%%%%%%%%%%%%%K%###",
      "####KK%%%%%%%%%%%%%%%%%%%%%%====%%RRRRRRRRR%%RRRRRRRRR%%%###",
      "####%%RRRRRRRRR%%RRRRRRRRR%%====%%RRRRRRRRR%%RRRRRRRRR%%%###",
      "####%%RRRRRRRRR%%RRRRRRRRR%%====%%HHHHHHHHH%%HHHHHHHHH%%%###",
      "####%%HHHHHHHHH%%HHHHHHHHH%%====%%HHHHHHHHH%%HHHHHHHHH%%%###",
      "####%%HHHHHHHHH%%HHHHHHHHH%%====%%HHHHHHHHH%%HHHHHHHHH%%%###",
      "####%%HHHHHHHHH%%HHHHHHHHH%%====%%%%%%%%%%%%%%%%%%%%%%%%%###",
      "####%%%%%%%%%%%%%%%%%%%%%%%%====%%%%%%%%%%%%%%%%%%%%%%%%%###",
      "####%%%%%%%%%%%%%%%%%%%%%%%%====%%%%%%%%%%%%%%%%%%%%%%%%%###",
      "####K%%%K%KK%%%%%%%%%%%%%%%%====%%%%%%%%%%%%%K%%%%%%%%%%%###",
      "####%%%%%%%%%%%%%%%%%%%%%%%%====%%%%%%%%%%%%K%%%%%%%%%%%%###",
      "####%%KK%%%%%%KK%%%%%%%%%%%%====%%%%%%%%%%%%%%%%%%%%%%%%%###",
      "####%%%%K%%K%%%%%%%%%%%%%%%%====%%%%%%%%%%%%%%%%%%%%%%%%%###",
      "####%%%%%%%%%%K%%%%%%%%%%%%%====%%%%%%%%%%%%%%%%%%%%%%%%%###",
      "####%U%%%%%%%%%%%%%%%%%%%%%%====%%%%%%%%%%%%K%%%%%%%%%%%%###",
      "####%RRRRRRRRRR%%RRRRRRRR%%%====%%RRRRRRRRR%%RRRRRRRRR%%%###",
      "####%RRRRRRRRRR%%RRRRRRRR%%%====%%RRRRRRRRR%%RRRRRRRRR%%%###",
      "####%HHHHHHHHHH%%HHHHHHHH%%%====%%HHHHHHHHH%%HHHHHHHHH%%%###",
      "####%HHHHHHHHHH%%HHHHHHHH%%%====%%HHHHHHHHH%%HHHHHHHHH%%%###",
      "####%HHHHHHHHHH%%HHHHHHHH%%%====%%HHHHHHHHH%%HHHHHHHHH%%%###",
      "####%%%%%%%%%%%%%%%%%%%%%%%%====%%%%%%%%%%%%%%%%%%%%%%%%%###",
      "####FFFFFFFFFFFFFFFFFFFFFFFF====FFFFFFFFFFFFFFFFFFFFFFFFF###",
      "####%%%%%%%%%%%%%%%%%%%%%%%%====%%%%%%%%%%%%%%%%%%%%%%%%%###",
      "####%%%%%%%%%%%%%%%%%%%%%%%%====K%%%%%%%%%%%%%%%%%%%%%%%%###",
      "####%%%%%%%%%%%%%%%%%%%%%%%%====%%%%%%%%%%%%%%%%%%%%%%%%%###",
      "####%%%%%%%%%%%%%%%%%%%%%%%%====%%%%%%%%%%%%%%%%%%%%%%%%%###",
      "####%%%%%%%%%%%%%%%%%%%%%%%%====%%%%%%%%%%%%%%%%%%%%%%%%%###",
      "##########%%%%%%%%%%%%%%%%%%====%%%%%%%%%%%%%%%%%%%#########",
      "################%%%%%=%%%=%%====%%%%%%%%%%%%%%%%############",
      "##################%%%%K%%%%%====%%%%%%%%%%%%%%##############",
      "###################%%%%%%%%%====%%%%K%%%%%%%################",
      "####################%%%%%%%%====%%%%%%%%%%%#################",
      "#####################%%%%%%%====%%%%%%%%%%##################",
      "######################%%%%%%====%%%%%%%%%###################",
      "######################%%%%%%====%%%%%%%%####################",
      "#######################%%%%%====%%%%%%%#####################",
      "#######################%%%%%====%%%%%%######################",
      "############################====############################"
    ],
    "exits": [
      {
        "x": 29,
        "y": 0,
        "to": "M40",
        "tx": 30,
        "ty": 43,
        "requires": "lost_items>=6",
        "requires_dialog": "D_EXIT_LOCK_LIB"
      },
      {
        "x": 30,
        "y": 0,
        "to": "M40",
        "tx": 31,
        "ty": 43,
        "requires": "lost_items>=6",
        "requires_dialog": "D_EXIT_LOCK_LIB"
      },
      {
        "x": 28,
        "y": 44,
        "to": "M38",
        "tx": 29,
        "ty": 1
      },
      {
        "x": 29,
        "y": 44,
        "to": "M38",
        "tx": 30,
        "ty": 1
      },
      {
        "x": 30,
        "y": 44,
        "to": "M38",
        "tx": 32,
        "ty": 1
      },
      {
        "x": 31,
        "y": 44,
        "to": "M38",
        "tx": 33,
        "ty": 1
      }
    ],
    "roadsigns": [],
    "start": {
      "x": 29,
      "y": 42,
      "note": "南口上來的地毯"
    },
    "npcs": [],
    "spawns": [
      {
        "monster": "fo_eraser",
        "count": 2,
        "area": [
          15,
          14,
          12,
          8
        ],
        "note": "西區走道（P3-1 的 3 格外）"
      },
      {
        "monster": "fo_eraser",
        "count": 1,
        "area": [
          5,
          29,
          19,
          6
        ],
        "note": "西南閱覽區"
      },
      {
        "monster": "fo_umbrella",
        "count": 2,
        "area": [
          32,
          14,
          11,
          8
        ],
        "note": "東區走道（P3-2 的 3 格外）"
      },
      {
        "monster": "fo_umbrella",
        "count": 1,
        "area": [
          37,
          29,
          18,
          6
        ],
        "note": "東南閱覽區"
      }
    ],
    "chests": [
      {
        "id": "C_M39_1",
        "x": 32,
        "y": 26,
        "subject": "數學",
        "level": 3,
        "reward": {
          "gold": 58,
          "exp": 90,
          "item": "grass_jelly"
        },
        "note": "2026-10-26 關卡設計師 新增（71 號 8.2：C_M39_1 不答題、P3-3 的獎勵；77 號 D）：借書台木柵 (28–31,28) 北邊、地毯東側；獎勵建議值見 wip_v40_draft/east_chest_rewards.json（90 經驗、58 金幣、仙草露）",
        "no_question": true
      }
    ],
    "landmarks": [
      {
        "name": "借書台",
        "area": [
          28,
          28,
          5,
          3
        ]
      }
    ],
    "lights": [],
    "no_minimap": true,
    "fog_mask": true,
    "lodge_lamps": [
      {
        "id": "obj_lodge_lamp",
        "x": 30,
        "y": 40,
        "kind": "lodge",
        "note": "入口山屋小燈（程式畫；71 號寫 (30,41)）"
      },
      {
        "id": "obj_lodge_lamp",
        "x": 14,
        "y": 20,
        "kind": "marker",
        "note": "記號燈：西北，文具書架旁（木牌畫鉛筆）",
        "shelf": "文具"
      },
      {
        "id": "obj_lodge_lamp",
        "x": 44,
        "y": 21,
        "kind": "marker",
        "note": "記號燈：東北，天氣書架旁（木牌畫雲和太陽）；71 號寫 (46,22)，那格是書架",
        "shelf": "天氣"
      }
    ],
    "puzzles": [
      {
        "id": "P3-3",
        "type": "symbol",
        "required": true,
        "area": [
          27,
          28,
          33,
          31
        ],
        "desk": [
          32,
          30
        ],
        "gate": [
          [
            28,
            28
          ],
          [
            29,
            28
          ],
          [
            30,
            28
          ],
          [
            31,
            28
          ]
        ],
        "note": "借書台 71 號寫 (30,30)（在地毯上），改放地毯東邊 (32,30)；木柵是整條地毯寬 x28–31",
        "reward_chest": "C_M39_1"
      },
      {
        "id": "P3-1",
        "type": "mirror",
        "required": false,
        "area": [
          4,
          15,
          11,
          19
        ],
        "origin": [
          5,
          15
        ],
        "source": [
          4,
          16
        ],
        "mirrors": [
          [
            8,
            16
          ],
          [
            8,
            19
          ],
          [
            11,
            16
          ]
        ],
        "pillars": [
          [
            10,
            16
          ],
          [
            6,
            18
          ],
          [
            7,
            18
          ]
        ],
        "crystal": [
          11,
          19
        ],
        "note": "改到西區書架之間的走道（CTO 同意）；71 號 7×5 的相對座標不變，左上角 (5,15)"
      },
      {
        "id": "P3-2",
        "type": "euler",
        "required": false,
        "area": [
          46,
          14,
          55,
          21
        ],
        "stones": {
          "A": [
            47,
            21
          ],
          "B": [
            55,
            21
          ],
          "C": [
            55,
            16
          ],
          "D": [
            47,
            16
          ],
          "E": [
            51,
            14
          ]
        },
        "note": "改到東區書架之間（CTO 同意的 x44–54 y14–21 再往東移 2 格，避開畫面上的書堆與閱讀燈 (44–45,16–17)）；形狀與連線不變"
      }
    ],
    "shelves": [
      {
        "cat": "文具",
        "icon": "pencil",
        "area": [
          6,
          9,
          14,
          13
        ]
      },
      {
        "cat": "雨具",
        "icon": "umbrella",
        "area": [
          17,
          9,
          25,
          13
        ]
      },
      {
        "cat": "衣服",
        "icon": "shirt",
        "area": [
          34,
          8,
          42,
          12
        ]
      },
      {
        "cat": "玩具",
        "icon": "blocks",
        "area": [
          45,
          8,
          53,
          12
        ]
      },
      {
        "cat": "食物",
        "icon": "apple",
        "area": [
          5,
          22,
          14,
          26
        ]
      },
      {
        "cat": "動物",
        "icon": "fish",
        "area": [
          17,
          22,
          24,
          26
        ]
      },
      {
        "cat": "植物",
        "icon": "flower",
        "area": [
          34,
          22,
          42,
          26
        ]
      },
      {
        "cat": "天氣",
        "icon": "cloud_sun",
        "area": [
          45,
          22,
          53,
          26
        ]
      }
    ],
    "lost_items": [
      {
        "id": "eraser",
        "x": 20,
        "y": 16
      },
      {
        "id": "pencil",
        "x": 9,
        "y": 7
      },
      {
        "id": "umbrella",
        "x": 38,
        "y": 15
      },
      {
        "id": "raincoat",
        "x": 50,
        "y": 19
      },
      {
        "id": "hat",
        "x": 24,
        "y": 20
      },
      {
        "id": "workbook",
        "x": 36,
        "y": 19
      },
      {
        "id": "handkerchief",
        "x": 9,
        "y": 15,
        "hidden": "P3-1"
      },
      {
        "id": "blocks",
        "x": 51,
        "y": 18,
        "hidden": "P3-2"
      }
    ],
    "carpets": [
      {
        "color": "blue",
        "area": [
          4,
          15,
          27,
          16
        ],
        "zone": "西（背景已鋪）"
      },
      {
        "color": "red",
        "area": [
          28,
          3,
          31,
          44
        ],
        "zone": "中"
      },
      {
        "color": "green",
        "area": [
          32,
          19,
          56,
          20
        ],
        "zone": "東（背景已鋪）"
      }
    ]
  },
  M40: {
    "name": "五燈試煉",
    "type": "dungeon",
    "level": 5,
    "bgm": "dungeon",
    "battle_bg": "fogcave",
    "tileset": "cave",
    "real_ref": "虛構（霧之洞窟）",
    "art_note": "深藍紫色圓形大廳，地上刻大五角星；五座白石燈座；北邊兩根白石柱夾著刻五盞燈圖案的巨大石門；西南疊石盤小石室、東南推兩個石箱小石室。 背景 tools/bigmaps/<ID>_bg.webp（GPT 四塊延續法＋最小誤差接縫）。",
    "grid": [
      "###############################==###########################",
      "###############################==###########################",
      "###############################==###########################",
      "#########################%%%%##==###########################",
      "#########################%%%%##===##########################",
      "#########################%%%%##===##########################",
      "#########################%%%%##===##%%######################",
      "#########################%%%%##===##%%%%####################",
      "########################%%%%%##===##%%%%####################",
      "######################%%%%%%%##===##%%%%%%##################",
      "###################%%%%%%%%%%%%%%%%%%%%%%%%#################",
      "################%%%%%%%%%%%%%UUU%%%%%%%%%%%%%%##############",
      "##############%%%%%%%%%%%%%%%KKK%%%%%%%%%%%%%%%#############",
      "#############%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%###########",
      "###########%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%##########",
      "##########%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%#########",
      "#########%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%########",
      "#########%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%#######",
      "########%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%#######",
      "#######%%%%UUU%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%######",
      "#######%%%%KKK%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%UUU%%%######",
      "#######%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%KKK%%%######",
      "#######%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%######",
      "#######%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%#######",
      "#######%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%########",
      "########%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%#########",
      "#########%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%########",
      "##########%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%########",
      "###########%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%#######",
      "############%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%######",
      "#############%%%%%%UUU%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%######",
      "###############%%%%KKK%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%#######",
      "################%%%%%%%%%%%%%%%%%%%%%%%%%%%%%UUU%%%%%#######",
      "##############%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%KKK%%%#########",
      "##############%%##%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%#####",
      "##############%%#####%%%%%%%%%U=%%%%%%%%%%%%%%%%#%%%%%%#####",
      "###########%%%%%%######%%%%%%%K=%%%%%%%%%%%%%%%######%%#####",
      "###########%%%%%%#######%%%%%%==%%%%%%%%%%%%%%#######%%#####",
      "###########%%%%%%#########%%%#==%%%%%%%%%%%%%########=######",
      "###########%K%K%K#############==%%%%%%%%%%%########%%%#%%%##",
      "###########%%%%%%#############==%%%%%%%%###########%%%%%%%##",
      "###########%%%%%%#############==###################%%###%%##",
      "##############################==###################%%%%%%%##",
      "##############################==############################",
      "##############################==############################"
    ],
    "exits": [
      {
        "x": 31,
        "y": 0,
        "to": "M41",
        "tx": 34,
        "ty": 29,
        "requires": [
          "trial_lamps_all",
          "puzzle.P4-2",
          "pl>=60",
          "item:dawn_compass"
        ],
        "requires_dialog": "D_EXIT_LOCK_CV",
        "first_dialog": "D_SUMMIT_GATE"
      },
      {
        "x": 32,
        "y": 0,
        "to": "M41",
        "tx": 35,
        "ty": 29,
        "requires": [
          "trial_lamps_all",
          "puzzle.P4-2",
          "pl>=60",
          "item:dawn_compass"
        ],
        "requires_dialog": "D_EXIT_LOCK_CV",
        "first_dialog": "D_SUMMIT_GATE"
      },
      {
        "x": 30,
        "y": 44,
        "to": "M39",
        "tx": 29,
        "ty": 1
      },
      {
        "x": 31,
        "y": 44,
        "to": "M39",
        "tx": 30,
        "ty": 1
      }
    ],
    "roadsigns": [],
    "start": {
      "x": 30,
      "y": 42,
      "note": "南口上來的石板路"
    },
    "npcs": [],
    "spawns": [
      {
        "monster": "fob_shadow_bat",
        "count": 1,
        "area": [
          30,
          13,
          1,
          1
        ],
        "boss": true,
        "note": "霧影站在國語燈座前",
        "quest": "Q_CV_3A"
      },
      {
        "monster": "fob_shadow_golem",
        "count": 1,
        "area": [
          12,
          21,
          1,
          1
        ],
        "boss": true,
        "note": "霧影站在社會燈座前",
        "quest": "Q_CV_3E"
      },
      {
        "monster": "fob_shadow_octo",
        "count": 1,
        "area": [
          49,
          22,
          1,
          1
        ],
        "boss": true,
        "note": "霧影站在英語燈座前",
        "quest": "Q_CV_3B"
      },
      {
        "monster": "fob_shadow_tree",
        "count": 1,
        "area": [
          20,
          32,
          1,
          1
        ],
        "boss": true,
        "note": "霧影站在自然燈座前",
        "quest": "Q_CV_3D"
      },
      {
        "monster": "fob_shadow_frog",
        "count": 1,
        "area": [
          46,
          34,
          1,
          1
        ],
        "boss": true,
        "note": "霧影站在數學燈座前",
        "quest": "Q_CV_3C"
      }
    ],
    "chests": [
      {
        "id": "C_M40_1",
        "x": 54,
        "y": 36,
        "subject": "數學",
        "level": 3,
        "reward": {
          "gold": 29,
          "exp": 45,
          "item": "grass_jelly"
        },
        "note": "P4-1 兩個石箱都推到格子後出現（金幣、經驗等第二段數值）",
        "no_question": true
      },
      {
        "id": "C_M40_2",
        "x": 14,
        "y": 37,
        "subject": "數學",
        "level": 3,
        "reward": {
          "gold": 29,
          "exp": 45,
          "item": "grass_jelly"
        },
        "note": "P4-3 疊完石盤後出現（金幣、經驗等第二段數值）",
        "no_question": true
      }
    ],
    "landmarks": [
      {
        "name": "五燈大廳",
        "area": [
          7,
          10,
          47,
          30
        ]
      },
      {
        "name": "最後的門",
        "area": [
          29,
          0,
          7,
          10
        ]
      }
    ],
    "lights": [],
    "no_minimap": true,
    "lodge_lamps": [
      {
        "id": "obj_lodge_lamp",
        "x": 30,
        "y": 35,
        "kind": "lodge",
        "note": "入口山屋小燈（石台）"
      },
      {
        "id": "obj_lodge_lamp",
        "x": 31,
        "y": 4,
        "kind": "final",
        "note": "最後的山屋小燈（71 號寫 (30,4)；那格是白石柱）"
      },
      {
        "id": "obj_lodge_lamp",
        "x": 30,
        "y": 14,
        "kind": "lodge",
        "note": "國語燈座前"
      },
      {
        "id": "obj_lodge_lamp",
        "x": 12,
        "y": 22,
        "kind": "lodge",
        "note": "社會燈座前"
      },
      {
        "id": "obj_lodge_lamp",
        "x": 49,
        "y": 23,
        "kind": "lodge",
        "note": "英語燈座前"
      },
      {
        "id": "obj_lodge_lamp",
        "x": 20,
        "y": 33,
        "kind": "lodge",
        "note": "自然燈座前"
      },
      {
        "id": "obj_lodge_lamp",
        "x": 46,
        "y": 35,
        "kind": "lodge",
        "note": "數學燈座前"
      }
    ],
    "puzzles": [
      {
        "id": "P4-2",
        "type": "lights",
        "required": true,
        "area": [
          26,
          20,
          34,
          28
        ],
        "stones": {
          "1": [
            30,
            21
          ],
          "2": [
            33,
            23
          ],
          "3": [
            32,
            27
          ],
          "4": [
            28,
            27
          ],
          "5": [
            27,
            23
          ]
        },
        "appears_after": "trial_lamps_all"
      },
      {
        "id": "P4-1",
        "type": "sokoban",
        "required": false,
        "area": [
          50,
          38,
          58,
          43
        ],
        "door": [
          53,
          38
        ],
        "enter_to": [
          54,
          42
        ],
        "boxes": [
          [
            52,
            40
          ],
          [
            56,
            40
          ]
        ],
        "goals": [
          [
            51,
            42
          ],
          [
            57,
            42
          ]
        ],
        "reward_chest": "C_M40_1",
        "note": "71 號的 9×6 地圖原樣，左上 (50,38)（71 號寫 x40–48，畫面上的東南石室在 x50–58）；門在上牆 (53,38)，進門就站在起點 @ (54,42)（CTO 裁定）；內牆 (54,39)、(53–55,41) 背景沒畫，程式畫成石塊"
      },
      {
        "id": "P4-3",
        "type": "hanoi",
        "required": false,
        "area": [
          10,
          35,
          17,
          42
        ],
        "door": [
          14,
          35
        ],
        "pillars": [
          [
            12,
            39
          ],
          [
            14,
            39
          ],
          [
            16,
            39
          ]
        ],
        "reward_chest": "C_M40_2",
        "note": "71 號寫 x10–20 y38–43，畫面上的西南石室在 x10–17 y35–42；三根石柱 (12,39)、(14,39)、(16,39)"
      }
    ],
    "trial_lamps": [
      {
        "subject": "國語",
        "seat": [
          29,
          11,
          31,
          12
        ],
        "boss": "fob_shadow_bat"
      },
      {
        "subject": "社會",
        "seat": [
          11,
          19,
          13,
          20
        ],
        "boss": "fob_shadow_golem"
      },
      {
        "subject": "英語",
        "seat": [
          48,
          20,
          50,
          21
        ],
        "boss": "fob_shadow_octo"
      },
      {
        "subject": "自然",
        "seat": [
          19,
          30,
          21,
          31
        ],
        "boss": "fob_shadow_tree"
      },
      {
        "subject": "數學",
        "seat": [
          45,
          32,
          47,
          33
        ],
        "boss": "fob_shadow_frog"
      }
    ]
  },
  M41: {
    "name": "玉山之巔",
    "type": "field",
    "level": 9,
    "bgm": "final",
    "battle_bg": "summit",
    "tileset": "field",
    "no_monsters": true,
    "real_ref": "玉山主峰山頂（玉山國家公園管理處官網 Y1–Y4：頁岩裸岩重疊、南北峭壁、西為絕壑陡溝、東坡滾礫石堆；71 號 2.7，2026-10-26 開頁核對）",
    "art_note": "霧散後的玉山主峰山頂（背景一張兩用：決戰前由程式疊半透明濃霧，結局後拿掉霧層）：中上方是層層疊起的灰色頁岩裸岩，最高處一塊較大的頁岩岩塊；前面一片平整的岩台；東側碎石坡上一條之字形碎石路從霧中石縫往上接到岩台；北、南是峭壁，崖下是霧；西側深溝被雲海填滿；天快亮前的深藍灰天空，東方天邊一條淡亮線。不畫石碑、碑文、銅像、告示牌、欄杆、鐵鍊、人物、雪。v4.x 新增，背景 tools/bigmaps/M41_bg.webp（GPT 一張畫完，v13_single.py fit）。",
    "grid": [
      "~~~~~~~~~~~~~###################################",
      "~~~~~~~~~~~~~###################################",
      "~~~~~~~~~~~~~###################################",
      "~~~~~~~~~~~~~###################################",
      "~~~~~~~~~~~~~***********************************",
      "~~~~~~~~~~~~~*****##########********************",
      "~~~~~~~~~~~~~*****##########********************",
      "~~~~~~~~~~~~~*****##########********************",
      "~~~~~~~~~~~~~*****####KK####********************",
      "~~~~~~~~~~~%%%%***####KK####********************",
      "~~~~~~~~~~~%%%%%%%%%%%%%%%%%%%%*****************",
      "~~~~~~~~~~~###%%%%%%%%%%%%%%%%%*****************",
      "~~~~~~~~~~~~~*%%%%%%%%%%%%%%%%%*****************",
      "~~~~~~~~~~~~~*##%%%%%%%%%%%%%%%*****************",
      "~~~~~~~~~~~~~*###%%%%%%%%%%%%%%*****************",
      "~~~~~~~~~~~~~*############%%%%%*****************",
      "~~~~~~~~~~~~~*############=============*********",
      "~~~~~~~~~~~~~************************==*********",
      "~~~~~~~~~~~~~************************==*********",
      "~~~~~~~~~~~~~************************==*********",
      "~~~~~~~~~~~~~************************==*********",
      "~~~~~~~~~~~~~***************===========*********",
      "~~~~~~~~~~~~~***************==******************",
      "~~~~~~~~~~~~~***************==******************",
      "~~~~~~~~~~~~~***************==******************",
      "~~~~~~~~~~~~~***************==******************",
      "~~~~~~~~~~~~~****************=======************",
      "~~~~~~~~~~~~~*********************==************",
      "~~~~~~~~~~~~~*********************==************",
      "~~~~~~~~~~~~~*********************==************",
      "~~~~~~~~~~~~~********************....***********",
      "~~~~~~~~~~~~~***********************************",
      "~~~~~~~~~~~~~###################################",
      "~~~~~~~~~~~~~###################################",
      "~~~~~~~~~~~~~###################################",
      "~~~~~~~~~~~~~###################################"
    ],
    "exits": [
      {
        "x": 34,
        "y": 30,
        "to": "M40",
        "tx": 31,
        "ty": 2,
        "warp": true
      },
      {
        "x": 35,
        "y": 30,
        "to": "M40",
        "tx": 32,
        "ty": 2,
        "warp": true
      },
      {
        "x": 9,
        "y": 10,
        "to": "M42",
        "tx": 30,
        "ty": 43,
        "requires": "ending_done",
        "warp": true
      },
      {
        "x": 10,
        "y": 10,
        "to": "M42",
        "tx": 31,
        "ty": 43,
        "requires": "ending_done",
        "warp": true
      }
    ],
    "roadsigns": [],
    "start": {
      "x": 34,
      "y": 29,
      "note": "從 M40 最後的門上來的到達站（71 號 2.7 A 區）"
    },
    "station": {
      "x": 13,
      "y": 9,
      "name": "玉山站",
      "requires": "ending_done",
      "noShelter": "山頂岩台很窄、旁邊是雲海，放不下候車亭，只放站牌",
      "note": "世界地圖 R_YUSHAN 的回程；下車點 (12,10)"
    },
    "npcs": [],
    "spawns": [
      {
        "monster": "fob_king",
        "count": 1,
        "area": [
          22,
          12,
          1,
          1
        ],
        "boss": true,
        "note": "遺忘霧王‧佛格：站立圖 3×3 飄在山頂上空 (21–23,5–7)（岩塊正上方的霧裡，程式畫）；走到岩塊前 (22–23,12) 觸發（播 D_FOG_KING_MEET）",
        "quest": "Q_END_1"
      }
    ],
    "chests": [],
    "landmarks": [
      {
        "name": "玉山之巔",
        "area": [
          13,
          4,
          35,
          28
        ]
      }
    ],
    "lights": [],
    "cloud_stairs": {
      "cells": [
        [
          9,
          10
        ],
        [
          10,
          10
        ]
      ],
      "requires": "ending_done"
    }
  },
  M42: {
    "name": "雲之深層・一　晨光雲階",
    "type": "field",
    "level": 9,
    "bgm": "field",
    "battle_bg": "cloudsea",
    "tileset": "field",
    "real_ref": null,
    "art_note": "破關後的虛構地圖（71 號 2.8）：淡金橘的晨光天空與雲海上，一層層白色厚雲平台與雲階梯。三條路（左、中、右）＋橫向連接；12 處軟雲（json soft_clouds）由程式畫成半透明、邊緣飄動的雲，答對 1 題才變硬。背景 tools/bigmaps/M42_bg.webp（GPT 四塊延續法＋v13_align 對齊＋最小誤差接縫）。",
    "rec_level": [
      58,
      65
    ],
    "grid": [
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~==~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~....==....~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~....==....~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~....==....~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~.............~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~...~~~~SS~~~......~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~...~~~~SS~~~......~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~..................~~~~SS~~~......~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~...................~~~SS~~~~~....................~~~~~",
      "~~~~~~....~~..~.~.~~.~...~~~SS~~~~~....................~~~~~",
      "~~~~~~~SS~~~~~~~~~~~~~~~~~~~SS~~~~~....................~~~~~",
      "~~~~~~~SS~~~~~~~~~~~~~~~~~~~SS~~~~~~~~~~~~~~~~~~~~~SS~~~~~~~",
      "~~~~~~~SS~~~~~~~~~~~~~~~~~~~SS~~~~~~~~~~~~~~~~~~~~~SS~~~~~~~",
      "~~~~~~~SS~~~~~~~~~~~~~~~~~~~SS~~~~~~~~~~~~~~~~~~~~~SS~~~~~~~",
      "~~~~~~~SS~~~~~~~~~~~~~~~~~~~SS~~~~~~~~~~~~~~~~~~~~~SS~~~~~~~",
      "~~~~~~~SS..........SSSSS.............~~~~~~~~~~~~~~SS~~~~~~~",
      "~~~~~~~SS..........SSSSS.............~~~~...........~~~~~~~~",
      "~~~~~~~SS..........~~~~~.............SSSS...........~~~~~~~~",
      "~~~~~~~SS~~~~~~~~~~~~~~~.............SSSS...........~~~~~~~~",
      "~~~~~~~SS~~~~~~~~~~~~~~~............~~~~~...........~~~~~~~~",
      "~~~~~~~SS~~~~~~~~~~~~~~~~............~~~~~~~~~~SS~~~~~~~~~~~",
      "~~~~~~~SS~~~~~~~~~~~~~~~~~...........~~~~~~~~~~SS~~~~~~~~~~~",
      "~~~~~~~SS~~~~~~~~~~~~~~~~~~~...~~~~~~~~~~~~~~~~SS~~~~~~~~~~~",
      "~~~~~~~SS~~~~~~~~~~~~~~~~~~~...~~~~~~~~~~~~~~~~SS~~~~~~~~~~~",
      "~~~~~~~SS~~~~~~~~~~~~~~~~~~~...~~~~~~~~~~~~~~~~SS~~~~~~~~~~~",
      "~~~~~~~SS~~~~~~~~~~~~~~~~~~~...~~~~~~~~~~~~~~~~SS~~~~~~~~~~~",
      "~~~~~~~SS~~~~~~~~~~~~~~~~~~~...~~~~~~~~~~~~~~~~SS~~~~~~~~~~~",
      "~~~~~~~SS~~~~~~~~~~~~~~~~~~~...~~~~~~~~~~~~~~~~SS~~~~~~~~~~~",
      "~~~~~~~SS~~~~~~~~~~~~~~~~~~~...~~~~~~~~~~~~~~~~SS~~~~~~~~~~~",
      "~~~~~~~SS~~~~~~~~~~~~~~~~~~~...~~~~~~~~~~~~~~~~SS~~~~~~~~~~~",
      "~~~~~~.....................~...~~~~~~~~~~~~~~~~SS~~~~~~~~~~~",
      "~~~~~~.....................~...~~~~~~~~~~~~~~~~SS~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~....~...~~~~~~~~~~~~~~~~SS~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~...................~~~~....~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~...........................~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~...........................~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~......==...................~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~.......==..~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~.......==..~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~.......==..~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~.......==..~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~.......==..~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~.....==..~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~....~~.==.~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~==~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
    ],
    "exits": [
      {
        "x": 28,
        "y": 0,
        "to": "M43",
        "tx": 29,
        "ty": 43
      },
      {
        "x": 29,
        "y": 0,
        "to": "M43",
        "tx": 30,
        "ty": 43
      },
      {
        "x": 30,
        "y": 44,
        "to": "M41",
        "tx": 12,
        "ty": 10
      },
      {
        "x": 31,
        "y": 44,
        "to": "M41",
        "tx": 12,
        "ty": 10
      }
    ],
    "roadsigns": [],
    "start": {
      "x": 30,
      "y": 42,
      "note": "2026-11-04 關卡設計師：從 (30,41) 移到 (30,42)——原位置和 heal_points 的山屋小燈同一格（前端山屋小燈會擋路，人會生在燈裡）；(30,42) 是 71 號 2.2「從 M41 下來站在 (30,42)」的到達位置。原 note：回復點（71 號 2.2：入口 (30,41)）"
    },
    "npcs": [
      {
        "id": "cloud_shop_m42",
        "x": 27,
        "y": 40,
        "sprite": "npc_innkeeper_m",
        "name": "雲上小舖老闆",
        "dialog": "D_SHOP_CLOUD",
        "quest": null,
        "quests": [],
        "note": "雲上小舖（一般 NPC，裁定 K23）：圖用既有旅館老闆圖 npc_innkeeper（C docs/data/sprites.js:183；要換別張旅館老闆圖由 Codex 開工時定）；顯示名稱「雲上小舖老闆」；shop.npc 指向這位"
      }
    ],
    "spawns": [
      {
        "monster": "fo_puff_s1",
        "count": 2,
        "area": [
          6,
          4,
          19,
          6
        ]
      },
      {
        "monster": "fo_echo_s1",
        "count": 1,
        "area": [
          24,
          15,
          13,
          7
        ]
      },
      {
        "monster": "fo_frost_s1",
        "count": 2,
        "area": [
          35,
          5,
          20,
          6
        ]
      },
      {
        "monster": "fo_eraser_s1",
        "count": 2,
        "area": [
          6,
          26,
          21,
          6
        ]
      },
      {
        "monster": "fo_umbrella_s1",
        "count": 2,
        "area": [
          24,
          31,
          27,
          6
        ]
      }
    ],
    "chests": [],
    "shop": {
      "x": 27,
      "y": 40,
      "shop_id": "cloud_m42",
      "npc": "cloud_shop_m42"
    },
    "landmarks": [
      {
        "name": "晨光雲階",
        "area": [
          0,
          0,
          60,
          45
        ]
      }
    ],
    "lights": [],
    "heal_points": [
      {
        "x": 30,
        "y": 41,
        "kind": "lodge_lamp"
      }
    ],
    "soft_clouds": [
      {
        "id": "SC1",
        "cells": [
          [
            7,
            20
          ],
          [
            8,
            20
          ]
        ],
        "note": "左雲階中段"
      },
      {
        "id": "SC2",
        "cells": [
          [
            23,
            32
          ],
          [
            24,
            32
          ],
          [
            25,
            32
          ],
          [
            26,
            32
          ]
        ],
        "note": "入口 → 左下雲帶"
      },
      {
        "id": "SC3",
        "cells": [
          [
            28,
            30
          ],
          [
            29,
            30
          ],
          [
            30,
            30
          ],
          [
            28,
            31
          ],
          [
            29,
            31
          ],
          [
            30,
            31
          ],
          [
            28,
            32
          ],
          [
            29,
            32
          ],
          [
            30,
            32
          ]
        ],
        "note": "中路下段"
      },
      {
        "id": "SC4",
        "cells": [
          [
            28,
            26
          ],
          [
            29,
            26
          ],
          [
            30,
            26
          ],
          [
            28,
            27
          ],
          [
            29,
            27
          ],
          [
            30,
            27
          ],
          [
            28,
            28
          ],
          [
            29,
            28
          ],
          [
            30,
            28
          ],
          [
            28,
            29
          ],
          [
            29,
            29
          ],
          [
            30,
            29
          ]
        ],
        "note": "中路中段"
      },
      {
        "id": "SC5",
        "cells": [
          [
            28,
            22
          ],
          [
            29,
            22
          ],
          [
            30,
            22
          ],
          [
            28,
            23
          ],
          [
            29,
            23
          ],
          [
            30,
            23
          ],
          [
            28,
            24
          ],
          [
            29,
            24
          ],
          [
            30,
            24
          ],
          [
            28,
            25
          ],
          [
            29,
            25
          ],
          [
            30,
            25
          ]
        ],
        "note": "中路上段"
      },
      {
        "id": "SC6",
        "cells": [
          [
            47,
            20
          ],
          [
            48,
            20
          ],
          [
            47,
            21
          ],
          [
            48,
            21
          ]
        ],
        "note": "右下雲階頂"
      },
      {
        "id": "SC7",
        "cells": [
          [
            19,
            15
          ],
          [
            20,
            15
          ],
          [
            19,
            16
          ],
          [
            20,
            16
          ]
        ],
        "note": "左中雲台 → 中央"
      },
      {
        "id": "SC8",
        "cells": [
          [
            37,
            17
          ],
          [
            38,
            17
          ],
          [
            37,
            18
          ],
          [
            38,
            18
          ]
        ],
        "note": "中央 → 右中"
      },
      {
        "id": "SC9",
        "cells": [
          [
            28,
            13
          ],
          [
            29,
            13
          ],
          [
            28,
            14
          ],
          [
            29,
            14
          ]
        ],
        "note": "中央雲階下端"
      },
      {
        "id": "SC10",
        "cells": [
          [
            51,
            11
          ],
          [
            52,
            11
          ],
          [
            51,
            12
          ],
          [
            52,
            12
          ]
        ],
        "note": "右雲階上端"
      },
      {
        "id": "SC11",
        "cells": [
          [
            21,
            5
          ],
          [
            22,
            5
          ],
          [
            23,
            5
          ],
          [
            21,
            6
          ],
          [
            22,
            6
          ],
          [
            23,
            6
          ]
        ],
        "note": "左上雲帶 → 北台"
      },
      {
        "id": "SC12",
        "cells": [
          [
            33,
            5
          ],
          [
            34,
            5
          ],
          [
            33,
            6
          ],
          [
            34,
            6
          ]
        ],
        "note": "右上 → 北台"
      }
    ]
  },
  M43: {
    "name": "雲之深層・二　星光雲庭",
    "type": "field",
    "level": 9,
    "bgm": "field",
    "battle_bg": "cloudsea",
    "tileset": "field",
    "real_ref": null,
    "art_note": "破關後的虛構地圖（71 號 2.9）：深藍夜空、銀色星點下的淡紫灰雲庭園，雲花圃發著淡藍白微光；北邊石板星座台上一排圓形星座底座（星星的凹槽是空的），最北一道星光拱門（5 個星座完成才開，程式擋）。15 顆星星由程式散放在庭園裡（json stars）。背景 tools/bigmaps/M43_bg.webp（GPT 四塊延續法＋v13_align 對齊＋最小誤差接縫）。",
    "rec_level": [
      79,
      99
    ],
    "grid": [
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~==~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~.K..==.K~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~.K..==.K~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~K~~~~~.....==..~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~K..........==...~..~~~~K~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~KKK.KKKKKKKKKKK........K.~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~KKK.KKKKKKKKKKKKKKK.KKKK.~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~KKK.KKKKKKKKKKKKKKK.KKKK.~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~K...............KKKK.KKKK.~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~K..........................~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~.~~..............***............K~~~~~~~~~~~~~",
      "~~~~...........................***............K..~~~~~~~~~~~",
      "~~~~...........................***................~.~~~~~~~~",
      "~~~~....********........................................~~~~",
      "~~~.....********.........................................~~~",
      "~~~.....********............................********....~~~~",
      "~~~.....********............................********.....~~~",
      "~~~~........~...............................********.....~~~",
      "~~~.........................................********~.....~~",
      "~~~............................***..........********......~~",
      "~~~............................***.........................~",
      "~~.............................***........................~~",
      "~~...................................................~~...~~",
      "~~...................................................~~....~",
      "~~..................................***....................~",
      "~~~................*******..........***~..................~~",
      "~~~~~~~............*******.........~***~............~~....~~",
      "~~~~~~~............*******..........***~............~~.....~",
      "~~~~~~...********......~............***~..................~~",
      "~~~~~~...********...................***~.................~~~",
      "~~~~~....********...................***~~.............~~~~~~",
      "~~~~~....********...................~~~~.....~~......~~~~~~~",
      "~~~~~....********....................~~......~......~~~~~~~~",
      "~~~~.........~...................~~...............~~~~~~~~~~",
      "~~~..................~..........~~~.............~~~~~~~~~~~~",
      "~~~~................~~..........~~..............~~~~~~~~~~~~",
      "~~~~~~~......................==........~.~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~..................==........~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~..~............==.....~..~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~...........==.....~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~...........==.~~..~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~.......K==K~~..~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~.....K==K....~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~.....==.....~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~==~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
    ],
    "exits": [
      {
        "x": 29,
        "y": 0,
        "to": "M44",
        "tx": 23,
        "ty": 34,
        "requires": "constellations_done",
        "requires_dialog": "D_EXIT_LOCK_POST2"
      },
      {
        "x": 30,
        "y": 0,
        "to": "M44",
        "tx": 24,
        "ty": 34,
        "requires": "constellations_done",
        "requires_dialog": "D_EXIT_LOCK_POST2"
      },
      {
        "x": 29,
        "y": 44,
        "to": "M42",
        "tx": 28,
        "ty": 1
      },
      {
        "x": 30,
        "y": 44,
        "to": "M42",
        "tx": 29,
        "ty": 1
      }
    ],
    "roadsigns": [],
    "start": {
      "x": 30,
      "y": 42,
      "note": "2026-11-04 關卡設計師：從 (30,41) 移到 (30,42)——原位置和 heal_points 的山屋小燈同一格（前端山屋小燈會擋路，人會生在燈裡）；入口石板路上、山屋小燈正下方。原 note：入口回復點 (30,41)"
    },
    "npcs": [
      {
        "id": "cloud_shop_m43",
        "x": 26,
        "y": 42,
        "sprite": "npc_innkeeper_m",
        "name": "雲上小舖老闆",
        "dialog": "D_SHOP_CLOUD",
        "quest": null,
        "quests": [],
        "note": "雲上小舖（一般 NPC，裁定 K23）：圖用既有旅館老闆圖 npc_innkeeper（C docs/data/sprites.js:183；要換別張旅館老闆圖由 Codex 開工時定）；顯示名稱「雲上小舖老闆」；shop.npc 指向這位"
      }
    ],
    "spawns": [
      {
        "monster": "wxb_raincloud_s2",
        "count": 1,
        "area": [
          3,
          18,
          12,
          9
        ]
      },
      {
        "monster": "mb_train_s2",
        "count": 1,
        "area": [
          16,
          10,
          12,
          8
        ]
      },
      {
        "monster": "fob_balloon_s2",
        "count": 1,
        "area": [
          37,
          11,
          12,
          8
        ]
      },
      {
        "monster": "ghb_civetboss_s2",
        "count": 1,
        "area": [
          45,
          20,
          12,
          8
        ]
      },
      {
        "monster": "mnb_goldjaw_s2",
        "count": 1,
        "area": [
          3,
          32,
          14,
          6
        ]
      },
      {
        "monster": "pib_ship_s2",
        "count": 1,
        "area": [
          38,
          30,
          12,
          7
        ]
      }
    ],
    "chests": [],
    "shop": {
      "x": 26,
      "y": 42,
      "shop_id": "cloud_m43",
      "npc": "cloud_shop_m43"
    },
    "landmarks": [
      {
        "name": "星光雲庭",
        "area": [
          0,
          0,
          60,
          45
        ]
      }
    ],
    "lights": [],
    "heal_points": [
      {
        "x": 30,
        "y": 41,
        "kind": "lodge_lamp"
      },
      {
        "x": 30,
        "y": 22,
        "kind": "lodge_lamp"
      }
    ],
    "constellations": [
      {
        "id": "CS_NORTH",
        "x": 19,
        "y": 6,
        "region": "北",
        "note": "星座底座（3 顆星）；圖上的圓形底座"
      },
      {
        "id": "CS_CENTRAL",
        "x": 23,
        "y": 6,
        "region": "中"
      },
      {
        "id": "CS_SOUTH",
        "x": 27,
        "y": 6,
        "region": "南"
      },
      {
        "id": "CS_EAST",
        "x": 34,
        "y": 7,
        "region": "東"
      },
      {
        "id": "CS_JINBAOLI",
        "x": 39,
        "y": 7,
        "region": "金包里"
      }
    ],
    "stars": [
      [
        5,
        20
      ],
      [
        10,
        24
      ],
      [
        14,
        35
      ],
      [
        22,
        30
      ],
      [
        27,
        36
      ],
      [
        36,
        34
      ],
      [
        38,
        36
      ],
      [
        42,
        32
      ],
      [
        47,
        28
      ],
      [
        53,
        24
      ],
      [
        56,
        20
      ],
      [
        49,
        13
      ],
      [
        40,
        13
      ],
      [
        22,
        12
      ],
      [
        11,
        19
      ]
    ]
  },
  M44: {
    "name": "雲之深層・三　曙光源頭",
    "type": "field",
    "level": 9,
    "bgm": "field",
    "battle_bg": "cloudsea",
    "tileset": "field",
    "real_ref": null,
    "art_note": "破關後最後的虛構地圖（71 號 2.10）：白金色發光的天空與雲海上，一座圓形大雲平台，正中央一道向上的金白色光柱（底部金色紋路）；四角四座雲小島，中央都有一圈淡金色光紋（四位發著曙光的霧將站的位置），雲橋相連；南邊入口雲路。背景 tools/bigmaps/M44_bg.webp（GPT 一張畫完，v13_single.py fit）。",
    "rec_level": [
      99,
      99
    ],
    "grid": [
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~.........~~~~~~~~~~~~~~~~~~~~~~~.........~~~",
      "~~~~.........~~~~~~~~~~~~~~~~~~~~~~~.........~~~",
      "~~~~.........~~~~~~~~~~~~~~~~~~~~~~~.........~~~",
      "~~~~.........~~~~~~~~~~~~~~~~~~~~~~~.........~~~",
      "~~~~.........~~~~~~~~~~~~~~~~~~~~~~~.........~~~",
      "~~~~.............~~~~~~~~~~~~~~..............~~~",
      "~~~~.........................................~~~",
      "~~~~.........~~~................~~~~.........~~~",
      "~~~~.........~~~................~~~~.........~~~",
      "~~~~~~~~~~~~~~....................~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~....................~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~....................~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~.........UUU........~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~.........UUU........~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~.........UUU........~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~....................~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~....................~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~....................~~~~~~~~~~~~~~",
      "~~~~.........~....................~~.........~~~",
      "~~~~.........~~..................~~~.........~~~",
      "~~~~.........~~..................~~~.........~~~",
      "~~~~.........................................~~~",
      "~~~~.........................................~~~",
      "~~~~.........~~~~~~~~......~~~~~~~~~.........~~~",
      "~~~~.........~~~~~~~~......~~~~~~~~~.........~~~",
      "~~~~.........~~~~~~~~......~~~~~~~~~.........~~~",
      "~~~~.........~~~~~~~~......~~~~~~~~~.........~~~",
      "~~~~~~~~~~~~~~~~~~~~~......~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~......~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~..==..~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~..==..~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~..==..~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~==~~~~~~~~~~~~~~~~~~~~~~~"
    ],
    "exits": [
      {
        "x": 23,
        "y": 35,
        "to": "M43",
        "tx": 29,
        "ty": 1
      },
      {
        "x": 24,
        "y": 35,
        "to": "M43",
        "tx": 30,
        "ty": 1
      }
    ],
    "roadsigns": [],
    "start": {
      "x": 24,
      "y": 33,
      "note": "2026-11-04 關卡設計師：從 (24,32) 移到 (24,33)——原位置和 heal_points 的山屋小燈同一格（前端山屋小燈會擋路，人會生在燈裡）；入口石板路上、山屋小燈正下方。原 note：入口回復點 (24,32)"
    },
    "npcs": [
      {
        "id": "cloud_shop_m44",
        "x": 25,
        "y": 33,
        "sprite": "npc_innkeeper_m",
        "name": "雲上小舖老闆",
        "dialog": "D_SHOP_CLOUD",
        "quest": null,
        "quests": [],
        "note": "雲上小舖（一般 NPC，裁定 K23）：圖用既有旅館老闆圖 npc_innkeeper（C docs/data/sprites.js:183；要換別張旅館老闆圖由 Codex 開工時定）；顯示名稱「雲上小舖老闆」；shop.npc 指向這位"
      }
    ],
    "spawns": [
      {
        "monster": "mb_floodgate_s3",
        "count": 1,
        "area": [
          8,
          7,
          1,
          1
        ],
        "boss": true,
        "note": "西北小島（光紋中央）",
        "quest": "Q_POST_3"
      },
      {
        "monster": "mb_lantern_s3",
        "count": 1,
        "area": [
          40,
          7,
          1,
          1
        ],
        "boss": true,
        "note": "東北小島",
        "quest": "Q_POST_3"
      },
      {
        "monster": "fog_demon_s3",
        "count": 1,
        "area": [
          8,
          25,
          1,
          1
        ],
        "boss": true,
        "note": "西南小島",
        "quest": "Q_POST_3"
      },
      {
        "monster": "wxb_whale_s3",
        "count": 1,
        "area": [
          40,
          25,
          1,
          1
        ],
        "boss": true,
        "note": "東南小島",
        "quest": "Q_POST_3"
      }
    ],
    "chests": [],
    "shop": {
      "x": 25,
      "y": 33,
      "shop_id": "cloud_m44",
      "npc": "cloud_shop_m44"
    },
    "landmarks": [
      {
        "name": "曙光源頭",
        "area": [
          0,
          0,
          48,
          36
        ]
      }
    ],
    "lights": [],
    "heal_points": [
      {
        "x": 24,
        "y": 32,
        "kind": "lodge_lamp"
      }
    ],
    "signs": [
      {
        "id": "sign_challenge",
        "x": 22,
        "y": 31,
        "note": "入口木牌「給想挑戰更高的冒險者」（27 號 3.2；圖案木牌，程式畫字）",
        "dialog": "D_SIGN_CHALLENGE"
      }
    ],
    "light_pillar": {
      "cells": [
        [
          23,
          15
        ],
        [
          24,
          15
        ],
        [
          25,
          15
        ],
        [
          23,
          16
        ],
        [
          24,
          16
        ],
        [
          25,
          16
        ],
        [
          23,
          17
        ],
        [
          24,
          17
        ],
        [
          25,
          17
        ]
      ],
      "note": "四隻都打倒後走進光柱 → 稱號「曙光的源頭」，播 D_POST_END"
    }
  }
};
