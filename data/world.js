/*
 * 勇者大冒險 — 世界地圖（搭車往返遠方地區）
 * 撰寫：遊戲劇情設計師＋關卡設計
 *
 * 格式：window.WORLD = { regions: [{ id, name, real_ref, map_entry, tx, ty, x, y, unlock_quest }] }
 *   map_entry  進入的地圖 ID；tx, ty 是下車後站的格子（就在該地圖的 station 旁邊，也和該地圖的 start 相同，
 *              讓只認 map_entry 字串、會讀 start 的引擎也能正確落點）
 *   x, y       在世界地圖圖片上的相對位置（0–1，左上角是 0,0）
 *   unlock_quest  完成這個委託才解鎖；null＝一開始就能去；陣列＝全部完成才解鎖
 *   打開世界地圖：站到各地圖的 station 格（客運站、火車站月台）上互動。
 *
 * x, y 的算法【推論】：用台灣本島的大約經緯度範圍（東經 120.0–122.0、北緯 21.9–25.3）換算，
 *   x＝(經度−120.0)÷2.0，y＝(25.3−緯度)÷3.4。這是我依一般地理知識抓的範圍，不是精確量測；
 *   CTO 畫好世界地圖後，請依圖上實際位置微調。
 *
 * ───────── M01 金包里：設施方位的參考來源（查詢日期 2026-10-07）─────────
 * 查法：curl 中文維基百科 action=raw，讀 {{coord}} 模板或資訊框地址；查不到時再查 Wikidata P625。
 * 基準點＝金包里廣安宮（位於老街中央，維基百科「金山老街」條目寫明）。
 *
 *   設施（遊戲名）          │ 參考的真實地點        │ 來源與資料                                                     │ 相對基準點
 *   金包里老街              │ 金山老街（金包里老街） │ zh.wikipedia「金山老街」（無座標）；「金包里廣安宮」{{Coord|25|13|19.200|N|121|38|18.042|E}} ≈ 25.2220, 121.6383 │ 基準點
 *   金包里慈護宮（真實名稱，老闆 2026-10-11 裁示）│ 金包里慈護宮          │ zh.wikipedia「金包里慈護宮」{{coord|25.220888|121.640259}}，地址：金包里街16號 │ 東約 200 m、南約 120 m → 老街東南
 *   海風溫泉                │ 金山溫泉              │ zh.wikipedia「金山溫泉」{{Coord|25.2219363|121.6410951}}（條目註明來源 GoogleMaps） │ 東約 280 m、同緯度 → 老街正東
 *   磺火漁港                │ 磺港漁港              │ zh.wikipedia「磺港漁港」{{coord|25|13|51.7|N|121|38|51.7|E}} ≈ 25.2310, 121.6477（模板帶 religion:TW 參數，疑似從廟宇模板沿用，座標本身合理但請留意） │ 東約 950 m、北約 1 km → 東北
 *   燭火雙岩                │ 燭臺雙嶼              │ zh.wikipedia「燭臺雙嶼」{{coord|25.23273|121.654742}} │ 東約 1.65 km、北約 1.2 km → 漁港外海的東北
 *   北邊大海                │ 金山海岸              │ zh.wikipedia「金山區 (台灣)」地形段：磺港半島尖端形成海上燭台；以上座標都顯示海在市區北邊 │ 北
 *   海風國小（虛構校名）     │ 新北市金山區金山國民小學 │ zh.wikipedia 條目只有地址「中山路234號」，無座標；Wikidata Q15903430 的座標 25.3145, 121.6268 落在市區北方約 10 km 的海上，判斷為錯誤，不採用 │ 查不到；【推論】放在老街西北
 *   海風圖書館              │ 新北市立圖書館金山分館 │ zh.wikipedia「新北市立圖書館」分館表：地址「金山區五湖里龜子山8號」，無座標；Wikidata Q97744824 無座標 │ 查不到；【推論】放在老街西南
 *   海風公園                │ 中山公園（金山）       │ zh.wikipedia 搜尋不到這個條目 │ 查不到；【推論】放在老街南側、廟埕旁
 *   （未放入地圖）           │ 金山區公所            │ zh.wikipedia「金山區 (台灣)」有照片與文字，但沒有獨立條目、沒有座標 │ 查不到
 *   金包里客運站            │ 金山的客運站           │ zh.wikipedia「新北市區公車790路線」站名有「金山站」「金山區公所」，但沒有座標 │ 查不到；【推論】放在老街北邊、漁港路口
 *   進出方向                │ 陽明山在金山南方；野柳在東邊海岸；九份在東南 │ 一般地理知識【推論】 │ 南出口→擎天草原；東北海岸出口→海蝕洞窟；東邊公路→山城市集
 */
window.WORLD = {
  image: null,   // 世界地圖圖檔由 CTO 繪製後填入（例："world_taiwan.png"）
  regions: [
    { id: "R_JINBAOLI", name: "金包里",     real_ref: "新北市金山區",                         map_entry: "M01", tx: 46, ty: 17,  x: 0.82, y: 0.03, unlock_quest: null },
    { id: "R_SHANCHENG", name: "山城市集",  real_ref: "新北市瑞芳九份",                       map_entry: "M09", tx: 41,  ty: 45, x: 0.92, y: 0.07, unlock_quest: null, unlock_visit: "M09" },
    { id: "R_SHENMU",   name: "神木森林",   real_ref: "嘉義阿里山",                           map_entry: "M04", tx: 34, ty: 53, x: 0.40, y: 0.53, unlock_quest: "Q_TUT_3" },
    { id: "R_FUCHENG",  name: "府城古城",   real_ref: "台南府城",                             map_entry: "M10", tx: 17,  ty: 51, x: 0.10, y: 0.68, unlock_quest: "Q_TUT_3" },
    { id: "R_MANGROVE", name: "紅樹林濕地", real_ref: "臺北市北投區關渡",   map_entry: "M05", tx: 55, ty: 49, x: 0.74, y: 0.05, unlock_quest: null, unlock_visit: "M05" },
    { id: "R_MOON",     name: "月世界",     real_ref: "高雄田寮月世界",                       map_entry: "M08", tx: 12,  ty: 46, x: 0.20, y: 0.71, unlock_quest: ["Q_GNO_4", "Q_GOB_4"] },
    { id: "R_YEHLIU",   name: "野柳海蝕洞", real_ref: "新北市萬里區野柳地質公園（海蝕洞、蕈狀岩）", map_entry: "M06", tx: 2,  ty: 16, x: 0.87, y: 0.01, unlock_quest: null },
    { id: "R_GOBLIN",   name: "哥布林村莊", real_ref: "（奇幻地點，接在野柳海蝕洞深處）",           map_entry: "M07", tx: 11, ty: 16, x: 0.88, y: 0.035, unlock_quest: null },
    { id: "R_ZHUZIHU", name: "竹子湖", real_ref: "臺北市北投區陽明山竹子湖", map_entry: "M46", tx: 42, ty: 8, x: 0.77, y: 0.04, unlock_quest: null, unlock_visit: "M46" },
    { id: "R_KEELUNG", name: "基隆港", real_ref: "基隆市基隆港（廟口夜市、正濱漁港、和平島）", map_entry: "M47", tx: 13, ty: 23, x: 0.87, y: 0.05, unlock_quest: null, unlock_visit: "M47" },
    { id: "R_JINGUASHI", name: "金瓜石", real_ref: "新北市瑞芳區金瓜石（黃金博物館）", map_entry: "M48", tx: 3, ty: 23, x: 0.93, y: 0.06, unlock_quest: null, unlock_visit: "M48" },
    { id: "R_TOUCHENG", name: "頭城・礁溪", real_ref: "宜蘭縣頭城鎮、礁溪鄉", map_entry: "M14", tx: 46, ty: 27, x: 0.9, y: 0.14, unlock_quest: null, unlock_visit: "M14" },
    { id: "R_SANXING", name: "三星", real_ref: "宜蘭縣三星鄉（蘭陽平原）", map_entry: "M50", tx: 43, ty: 21, x: 0.83, y: 0.19, unlock_quest: null, unlock_visit: "M50" },
    { id: "R_SUAO", name: "蘇澳・南方澳", real_ref: "宜蘭縣蘇澳鎮（蘇澳冷泉、南方澳漁港）", map_entry: "M51", tx: 41, ty: 22, x: 0.93, y: 0.21, unlock_quest: null, unlock_visit: "M51" },
    { id: "R_PINGLIN", name: "坪林", real_ref: "新北市坪林區（坪林茶業博物館、坪林舊橋）", map_entry: "M52", tx: 37, ty: 21, x: 0.86, y: 0.11, unlock_quest: null, unlock_visit: "M52" },
    { id: "R_MAOKONG", name: "木柵・貓空", real_ref: "臺北市文山區木柵、貓空（指南宮）", map_entry: "M13", tx: 63, ty: 25, x: 0.8, y: 0.1, unlock_quest: null, unlock_visit: "M13" },
    { id: "R_TAIPEI", name: "台北城", real_ref: "臺北市（行天宮、北門、大稻埕迪化街）", map_entry: "M12", tx: 16, ty: 29, x: 0.76, y: 0.07, unlock_quest: null, unlock_visit: "M12" },
    { id: "R_BEITOU", name: "北投・關渡", real_ref: "臺北市北投區（北投溫泉博物館、地熱谷）", map_entry: "M53", tx: 47, ty: 25, x: 0.75, y: 0.05, unlock_quest: null, unlock_visit: "M53" },
    { id: "R_XINYI", name: "信義", real_ref: "臺北市信義區（臺北101、四四南村、象山）", map_entry: "M54", tx: 7, ty: 25, x: 0.78, y: 0.08, unlock_quest: null, unlock_visit: "M54" },
    { id: "R_SHIMEN", name: "石門水庫・大溪", real_ref: "桃園市石門水庫、大溪老街", map_entry: "M15", tx: 25, ty: 33, x: 0.62, y: 0.14, unlock_quest: null, unlock_visit: "M15" },
    { id: "R_HSINCHU", name: "新竹風城", real_ref: "新竹市（迎曦門、新竹米粉）", map_entry: "M16", tx: 15, ty: 22, x: 0.49, y: 0.14, unlock_quest: null, unlock_visit: "M16" },
    { id: "R_MIAOLI", name: "苗栗山城", real_ref: "苗栗縣三義鄉勝興車站、舊山線，大湖草莓", map_entry: "M17", tx: 44, ty: 14, x: 0.391, y: 0.268, unlock_quest: null, unlock_visit: "M17" },
    { id: "R_DAJIA", name: "大甲藺草鎮", real_ref: "臺中市大甲區（大甲鎮瀾宮、大甲藺）", map_entry: "M18", tx: 11, ty: 31, x: 0.312, y: 0.281, unlock_quest: null, unlock_visit: "M18" },
    { id: "R_LUKANG", name: "鹿港老街", real_ref: "彰化縣鹿港鎮（鹿港天后宮、老街）", map_entry: "M19", tx: 79, ty: 30, x: 0.216, y: 0.365, unlock_quest: null, unlock_visit: "M19" },
    { id: "R_BEIGANG", name: "北港媽祖鎮", real_ref: "雲林縣北港鎮（北港朝天宮、武德宮、北港溪）", map_entry: "M20", tx: 35, ty: 24, x: 0.152, y: 0.509, unlock_quest: null, unlock_visit: "M20" }
  ]
};
