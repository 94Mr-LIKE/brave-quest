/*
 * 勇者大冒險 — 角色聲音設定
 * 撰寫：遊戲劇情設計師
 *
 * 用途：給朗讀（Web Speech API）與音效用。前端讀 pitch／rate 設定 SpeechSynthesisUtterance，
 *       依 gender／age 挑選系統語音；taigi:true 的角色，台詞有 taigi 欄位時應優先用台語發音。
 *
 * 數值範圍：pitch 0.5–1.8、rate 0.6–1.3（1.0＝系統預設）。分布原則：
 *   小孩 pitch 1.3–1.6、rate 0.9–1.2；青少年 pitch 1.1–1.3；
 *   成年女性 pitch 0.9–1.3；成年男性 pitch 0.75–1.0，壯漢 0.6–0.8；
 *   老人 rate 0.8–0.95，男性長者 pitch 0.6–0.9。
 *   同性別、同年齡的角色，pitch 或 rate 至少差 0.05，避免聽起來一樣（validate_world.js 會檢查）。
 *   頭目說話時用 speakers 裡的設定；戰鬥音效用 monsters 裡的設定。
 *
 * 性別依 CTO 繪製的 NPC 圖判斷；圖看不出來的奇幻角色，刻意讓男女、老少都有，不讓「首領＝男性」。
 * 【待查證】瀏覽器內建語音大多沒有台語；用 zh-TW 語音念台語漢字會變成華語發音。
 *           台語句子可能需要預錄音檔或台語語音合成服務，請技術端評估。
 *
 * ── 語音組 2026-10-10 修正（老闆試玩回饋 A5–A9；CTO 裁示「聲音一律照精靈圖的外觀性別」）──
 *   - 每個說話者加 stage（外觀年齡：小孩／青少年／青年／中年／老年）與 look（用哪一張精靈圖）。
 *     age 仍只用 child／teen／adult／elder 四種（validate_world.js 檢查用）；中年、青年都算 adult，靠 pitch 區分：
 *     中年女 pitch 0.9–1.05、青年女 1.05–1.3；中年男 0.75–0.9、青年男 0.88–1.0；老年男 0.6–0.9 且 rate ≤ 0.95。
 *   - 外觀對照表在 tools/voice/npc_looks.js，systems.test.js 會檢查這裡的性別、年齡、音高範圍都跟外觀一致。
 *   - 老闆指定：溫泉旅館老闆娘、圖書館阿姨 → 中年女；哥布林酋長 → 老年男。
 *
 * monsters：family（聲音類型）、size（s 小／m 中／l 大／boss 頭目）、mood（個性）、pitch_shift（音效移調，半音 −12～+12）、
 *           cry（叫聲，給音效或對話泡泡用）。
 */
window.VOICES = {
  speakers: {
    // ── 金包里 ──
    // 語音組 2026-10-10：stage＝外觀年齡、look＝精靈圖（對照表 tools/voice/npc_looks.js）；有改的行在行尾註明原值
    chief:          { name: "里長伯",         gender: "m", age: "elder", stage: "老年", look: "npc_chief",         pitch: 0.78, rate: 0.85, taigi: true,  persona: "熱心又愛照顧人，說話慢慢的，常夾台語，「好啦好啦」掛在嘴邊。" },
    temple_keeper:  { name: "廟公",           gender: "m", age: "elder", stage: "老年", look: "npc_temple_keeper", pitch: 0.72, rate: 0.80, taigi: true,  persona: "慢條斯理、很和氣，像在廟埕泡茶聊天，句尾常拉長音。" },   // v0.9.5 廟公專屬圖（灰白平頭、深藍唐衫、竹掃帚；老年男）。前端依 CTO 指示改 look，請語音組確認
    shopkeeper:     { name: "老街阿伯",       gender: "m", age: "adult", stage: "青年", look: "npc_shopkeeper",    pitch: 0.97, rate: 1.06, taigi: true,  persona: "嗓門大、愛招呼客人，講話很開朗，台語比華語順。" },   // 原 elder 0.90/0.95：圖是黑髮圓臉的年輕人
    fisher:         { name: "漁夫阿伯",       gender: "m", age: "adult", stage: "中年", look: "npc_fisher",        pitch: 0.75, rate: 0.97, taigi: true,  persona: "豪爽，聲音粗粗的，海風吹久了有點沙啞，笑聲很大。" },   // 原 elder 0.70/0.90：圖是灰黑頭髮、鬍渣的中年人
    bookstore:      { name: "圖書館阿伯",   gender: "m", age: "elder", stage: "老年", look: "npc_bookstore_m",   pitch: 0.84, rate: 0.92, taigi: true,  persona: "溫柔有耐心，一個字一個字說清楚，偶爾說一句台語。" },   // v0.9.4 老闆 2026-10-11：講台語的角色一律男性（原 f 0.93/0.90）。語音組 10-11：新圖 npc_bookstore_m 是灰白髮老人→老年，0.80/0.88 改 0.84/0.92
    innkeeper:      { name: "溫泉旅館老闆", gender: "m", age: "adult", stage: "中年", look: "npc_innkeeper_m",   pitch: 0.68, rate: 1.02, taigi: true,  persona: "親切愛笑，招呼客人很熱情，講話帶台語腔。" },   // v0.9.4 老闆 2026-10-11：講台語的角色一律男性（原 f 1.00/1.00）。新圖 npc_innkeeper_m
    // ── 擎天草原、硫磺谷 ──
    potato_seller:  { name: "賣地瓜的阿伯", gender: "m", age: "elder", stage: "老年", look: "npc_uncle_yam",     pitch: 0.76, rate: 0.95, taigi: true,  persona: "大聲叫賣、很有活力，句子短短的，常用台語招呼。" },   // v0.9.4 老闆 2026-10-11：講台語的角色一律男性（原 f 1.05/1.10）。語音組 10-11：新圖 npc_uncle_yam 灰白髮→老年，0.78/1.12 改 0.76/0.95（老年 rate ≤ 0.95）
    hiker:          { name: "登山阿伯",       gender: "m", age: "adult", stage: "中年", look: "npc_fisher",        pitch: 0.86, rate: 0.90, taigi: true,  persona: "精神很好、愛叮嚀安全，講話一句一句很清楚。" },   // 原 elder 0.84/0.92：和漁夫阿伯同一張中年人的圖
    // ── 神木森林・精靈 ──
    elf_elder:      { name: "精靈長老",       gender: "f", age: "elder", stage: "老年", look: "npc_elf_elder",     pitch: 1.00, rate: 0.82, taigi: false, persona: "溫柔像在說故事，句子之間會停一下，很有智慧。" },
    elf_kid:        { name: "精靈小孩葉葉",   gender: "f", age: "child", stage: "小孩", look: "npc_elf_kid",       pitch: 1.55, rate: 1.10, taigi: false, persona: "活潑好動，講話又快又興奮。" },
    elf_kid_lost:   { name: "迷路的精靈小孩", gender: "f", age: "child", stage: "小孩", look: "npc_elf_kid",       pitch: 1.40, rate: 0.90, taigi: false, persona: "怯生生的，有點想哭，找到路後才放心。" },
    // ── 紅樹林濕地・地精 ──
    gnome_chief:    { name: "地精族長",       gender: "m", age: "elder", stage: "老年", look: "npc_gnome_chief",   pitch: 0.86, rate: 0.82, taigi: false, persona: "嚴謹又熱心的老工匠，講話有條有理，愛說「量兩次，切一次」。" },
    gnome:          { name: "地精工匠",       gender: "m", age: "adult", stage: "中年", look: "npc_gnome",         pitch: 0.90, rate: 1.10, taigi: false, persona: "開朗、愛敲敲打打，講話節奏輕快。" },   // 原 0.94/1.10：棕色大鬍子的中年人
    gnome_measure:  { name: "地精木匠",       gender: "m", age: "adult", stage: "中年", look: "npc_gnome",         pitch: 0.86, rate: 1.00, taigi: false, persona: "細心、講話一板一眼，喜歡把數字說得很準。" },   // 原 1.00/0.95：和地精工匠同一張中年人的圖
    // ── 海蝕洞窟、哥布林部落 ──
    goblin_kid_echo:{ name: "洞窟裡的哥布林小孩", gender: "m", age: "child", stage: "小孩", look: "npc_goblin_kid", pitch: 1.55, rate: 1.18, taigi: false, persona: "調皮愛玩，喜歡學回音、把尾音拉長。" },   // 原 f 1.60：和咕嚕（男孩）同一張圖
    goblin_chief:   { name: "哥布林酋長",     gender: "m", age: "elder", stage: "老年", look: "npc_goblin_chief",  pitch: 0.70, rate: 0.90, taigi: false, persona: "部落的老酋長，嗓門大，看起來兇，其實很照顧族人。" },   // 原 f adult 0.92/1.12；老闆指定老年男
    goblin_kid:     { name: "哥布林小孩咕嚕", gender: "m", age: "child", stage: "小孩", look: "npc_goblin_kid",    pitch: 1.35, rate: 1.05, taigi: false, persona: "有點害羞但很認真，想到家人就很開心。" },
    // ── 月世界・獸人 ──
    orc_chief:      { name: "獸人族長",       gender: "m", age: "adult", stage: "中年", look: "npc_orc_chief",     pitch: 0.62, rate: 0.88, taigi: false, persona: "壯漢，聲音低沉宏亮，脾氣直但講道理。" },
    orc:            { name: "獸人獵人",       gender: "m", age: "adult", stage: "青年", look: "npc_orc",           pitch: 0.88, rate: 1.05, taigi: false, persona: "爽朗、話不多，講話乾脆。" },   // 原 0.78：圖是年輕男性
    orc_bank:       { name: "獸人小班長",     gender: "m", age: "adult", stage: "青年", look: "npc_orc",           pitch: 0.98, rate: 0.94, taigi: false, persona: "認真負責，講話像在主持班會。" },   // 原 teen 1.15/1.00：用的是獸人獵人（成年）的圖
    // ── 山城市集 ──
    merchant:       { name: "外國商人",       gender: "f", age: "adult", stage: "青年", look: "npc_merchant",      pitch: 1.26, rate: 1.06, taigi: false, persona: "活潑愛笑，華語帶一點外國腔，常冒出簡單英文。" },
    blacksmith:     { name: "鐵匠師傅",     gender: "m", age: "adult", stage: "青年", look: "npc_blacksmith_m",  pitch: 0.96, rate: 1.14, taigi: true,  persona: "俐落、說話乾脆，邊打鐵邊聊天。" },   // v0.9.4 老闆 2026-10-11：講台語的角色一律男性（原 f 1.10/1.08）。新圖 npc_blacksmith_m（青年男）
    armor_keeper:   { name: "防具店老闆",     gender: "m", age: "adult", stage: "青年", look: "npc_shopkeeper",    pitch: 0.92, rate: 1.00, taigi: true,  persona: "實在、講話直接，很關心客人安全。" },   // 原 0.85：和老街阿伯同一張年輕人的圖
    item_keeper:    { name: "市場阿叔",     gender: "m", age: "adult", stage: "中年", look: "npc_uncle_market",  pitch: 0.80, rate: 1.20, taigi: true,  persona: "爽快，算錢很快，叫你「慢慢仔揀」。" },   // v0.9.4 老闆 2026-10-11：講台語的角色一律男性（原 f 0.92/1.04）。新圖 npc_uncle_market
    innkeeper_port: { name: "山城民宿老闆", gender: "m", age: "adult", stage: "青年", look: "npc_inn_port_m",    pitch: 0.95, rate: 0.80, taigi: true,  persona: "輕聲細語、慢慢說，讓人很放鬆。" },   // v0.9.4 老闆 2026-10-11：講台語的角色一律男性（原 f 0.98/0.85）。語音組 10-11：新圖 npc_inn_port_m 是年輕人→青年，0.83 改 0.95
    taro_seller:    { name: "芋圓店老闆",   gender: "m", age: "elder", stage: "老年", look: "npc_uncle_taro",    pitch: 0.64, rate: 0.92, taigi: true,  persona: "溫暖，像在哄小孩，愛誇人聰明。" },   // v0.9.4 老闆 2026-10-11：講台語的角色一律男性（原 f 1.04/0.92）。語音組 10-11：新圖 npc_uncle_taro 灰白髮→老年，0.72/0.90 改 0.64/0.92
    // ── 府城古城 ──
    king:           { name: "城主",           gender: "m", age: "elder", stage: "老年", look: "npc_king",          pitch: 0.62, rate: 0.86, taigi: true,  persona: "威嚴但溫和，說話穩重、字字清楚。" },   // CTO：台語台詞補寫中，taigi 改 true
    guild:          { name: "公會導師",     gender: "m", age: "adult", stage: "青年", look: "npc_guild_m",       pitch: 1.00, rate: 1.00, taigi: true,  persona: "有精神，像老師一樣鼓勵人。" },   // v0.9.4 老闆 2026-10-11：講台語的角色一律男性（原 f 1.10/1.00）。新圖 npc_guild_m（青年男）
    librarian:      { name: "圖書館員",       gender: "m", age: "adult", stage: "青年", look: "npc_librarian",     pitch: 0.92, rate: 0.90, taigi: true,  persona: "斯文、輕聲細語，很愛書。" },   // CTO：taigi 改 true
    // ── v0.9.3 B14 各地旅店老闆（還沒有精靈圖：先設中年＝adult，性別暫定，待語音組確認）──
    // 語音組 2026-10-10：還沒有精靈圖，無法照外觀確認性別；先照名稱（老闆娘＝女、老闆＝男）設中年，音高調進中年範圍。有圖後請把 look 補上。
    inn_shenmu:     { name: "樹屋旅店老闆", gender: "m", age: "adult", stage: "中年", look: "npc_inn_shenmu_m",  pitch: 0.74, rate: 0.82, taigi: true,  persona: "溫柔安靜，像在森林裡說悄悄話，讓人想睡。" },   // v0.9.4 老闆 2026-10-11：講台語的角色一律男性（原 f 1.04/0.86）。新圖 npc_inn_shenmu_m（中年男）
    inn_mangrove:   { name: "地精旅舍老闆",   gender: "m", age: "adult", stage: "中年", look: null,                pitch: 0.88, rate: 1.15, taigi: false, persona: "勤快的地精，講話輕快，喜歡聊潮水漲退。" },
    inn_goblin:     { name: "石屋客棧老闆娘", gender: "f", age: "adult", stage: "中年", look: null,                pitch: 0.95, rate: 1.20, taigi: false, persona: "愛笑的哥布林，開口先「嘿嘿」，講話快快的。" },
    inn_moon:       { name: "帳篷營地老闆",   gender: "m", age: "adult", stage: "中年", look: null,                pitch: 0.80, rate: 0.94, taigi: true,  persona: "爽朗實在，講話不急不徐，很會照顧旅人。" },
    inn_fucheng:    { name: "府城老客棧老闆", gender: "m", age: "adult", stage: "中年", look: null,                pitch: 0.90, rate: 0.84, taigi: true,  persona: "客氣有禮，說話慢條斯理，帶一點古早味。" },   // 原 0.96（青年男範圍）
    // ── v1.1 第一章（59 號 2.2–2.5）：新的人類 NPC 全部講台語、一律男性（35 號第九節）──
    // 走路圖還沒畫好：look 先填預定的圖名，tools/voice/npc_looks.js 標 pending、replaces＝地圖暫用的舊圖；
    // 攤販阿伯照 59 號第六節借 npc_uncle_market；旅店老闆是虛擬 NPC（同 inn_moon），look 為 null。
    // pitch／rate：和同性別、同年齡的每個角色至少差 0.05（validate_world.js 檢查）；老年 rate ≤ 0.95。
    seaweed_uncle:  { name: "撿海菜阿伯",     gender: "m", age: "elder", stage: "老年", look: "npc_seaweed_uncle", pitch: 0.82, rate: 0.75, taigi: true,  persona: "海邊長大的老人家，講話慢慢的，常提醒小孩海邊要注意安全。" },
    park_ranger:    { name: "國家公園解說員", gender: "m", age: "adult", stage: "青年", look: "npc_park_ranger",   pitch: 0.94, rate: 1.22, taigi: true,  persona: "年輕有活力的解說員，講話清楚、節奏快，很在意遊客和動物的安全。" },
    calla_farmer:   { name: "海芋農阿伯",     gender: "m", age: "elder", stage: "老年", look: "npc_calla_farmer",  pitch: 0.66, rate: 0.76, taigi: true,  persona: "種花種了一輩子，說起花田就笑咪咪，聲音低低的、很溫和。" },
    rice_guide:     { name: "故事館解說員",   gender: "m", age: "adult", stage: "青年", look: "npc_rice_guide",    pitch: 0.99, rate: 0.88, taigi: true,  persona: "斯文、愛講故事，講到米的歷史會放慢速度。" },
    harbor_uncle:   { name: "漁港阿伯",       gender: "m", age: "adult", stage: "中年", look: "npc_harbor_uncle",  pitch: 0.69, rate: 0.92, taigi: true,  persona: "雨港的漁夫，嗓門大、很熱心，講話直來直往。" },
    stall_keeper:   { name: "廟口攤販阿伯",   gender: "m", age: "adult", stage: "中年", look: "npc_keelung_vendor", pitch: 0.82, rate: 1.10, taigi: true,  persona: "夜市攤販，招呼客人很有精神，算錢算得飛快。" },
    old_miner:      { name: "老礦工阿伯",     gender: "m", age: "elder", stage: "老年", look: "npc_old_miner",     pitch: 0.58, rate: 0.78, taigi: true,  persona: "以前在礦山工作的老人家，聲音低沉沙啞，講話一字一句很穩。" },
    museum_guide:   { name: "博物館解說員",   gender: "m", age: "adult", stage: "青年", look: "npc_museum_guide",  pitch: 0.89, rate: 0.76, taigi: true,  persona: "很有耐心的解說員，說明時一句一句慢慢講，讓人聽得清楚。" },
    inn_keelung:    { name: "港邊旅店老闆",   gender: "m", age: "adult", stage: "中年", look: null,                pitch: 0.76, rate: 1.06, taigi: true,  persona: "港邊旅店的老闆，親切爽朗，喜歡聊下雨天。" },
    inn_jinguashi:  { name: "宿舍旅店老闆",   gender: "m", age: "adult", stage: "中年", look: null,                pitch: 0.63, rate: 0.80, taigi: true,  persona: "安安靜靜的老闆，講話輕聲慢慢，讓人想好好睡一覺。" },
    // ── 旁白 ──
    narrator:       { name: "旁白",           gender: "f", age: "adult", stage: "中年", look: null,                pitch: 0.98, rate: 0.95, taigi: false, persona: "平穩溫和的說書人。" },
    // ── 會說話的頭目（戰鬥前後的台詞）── 圖沒有明顯性別特徵的頭目維持原設定（見 34 號報告）
    tree_king:      { name: "枯萎樹王",       gender: "m", age: "elder", stage: "老年", look: "boss_tree",         pitch: 0.55, rate: 0.70, taigi: false, persona: "迷迷糊糊、像樹枝嘎吱響，一個字一個字慢慢擠出來。" },
    fog_octopus:    { name: "迷霧章魚",       gender: "f", age: "adult", stage: "中年", look: "boss_octopus",      pitch: 0.80, rate: 0.70, taigi: false, persona: "睏睏的、拖長音，好像隨時會睡著。" },
    mud_frog:       { name: "泥巴大蛙",       gender: "m", age: "adult", stage: "中年", look: "boss_frog",         pitch: 0.60, rate: 0.95, taigi: false, persona: "低沉、呱呱叫，數到一半就亂掉。" },
    noise_bat:      { name: "噪音蝙蝠王",     gender: "m", age: "teen",  stage: "青少年", look: "boss_bat",        pitch: 1.75, rate: 1.25, taigi: false, persona: "尖聲又吵，講話很急，靜下來後變得很溫和。" },
    angry_golem:    { name: "暴躁石像",       gender: "m", age: "adult", stage: "中年", look: "boss_golem",        pitch: 0.50, rate: 0.72, taigi: false, persona: "低沉又重，像石頭敲地，一句一頓。" },
    fog_demon:      { name: "遺忘霧魔",       gender: "f", age: "adult", stage: "中年", look: "boss_fog",          pitch: 0.70, rate: 0.75, taigi: false, persona: "低低的、飄來飄去，像在耳邊說悄悄話。" },
    mnb_goldjaw:    { name: "金脈鐵顎王",     gender: "m", age: "adult", stage: "中年", look: "boss_mnb_goldjaw",  pitch: 0.56, rate: 0.80, taigi: false, persona: "礦山巨獸，聲音像岩石和齒輪在摩擦，清醒後變得溫和緩慢。" },   // v1.1 支線頭目；圖是岩石齒輪的巨獸、沒有性別特徵
    // v1.2 第二章：宜蘭（61 號；劇本語音組草稿；look 照美術交件：頭目 boss_wxb_raincloud、老街道具攤阿伯 npc_yilan_vendor）
    trail_volunteer: { name: "步道志工阿伯", gender: "m", age: "elder", stage: "老年", look: "npc_trail_volunteer", pitch: 0.74, rate: 0.74, taigi: true, persona: "爬了一輩子山的志工，講古蹟故事慢慢的、很有耐心。" },
    kumquat_farmer: { name: "金棗農阿伯", gender: "m", age: "elder", stage: "老年", look: "npc_kumquat_farmer", pitch: 0.9, rate: 0.88, taigi: true, persona: "種金棗的老農夫，愛笑，講話帶著鄉下的親切。" },
    bus_driver: { name: "客運司機", gender: "m", age: "adult", stage: "中年", look: "npc_bus_driver", pitch: 0.8, rate: 0.84, taigi: true, persona: "開客運的司機，講話清楚、節奏穩，很注意乘客安全。" },
    levee_uncle: { name: "海堤阿伯", gender: "m", age: "elder", stage: "老年", look: "npc_levee_uncle", pitch: 0.55, rate: 0.86, taigi: true, persona: "每天在海堤散步看海的阿伯，聲音低沉、說話悠閒。" },
    stall_yilan: { name: "老街道具攤阿伯", gender: "m", age: "adult", stage: "中年", look: "npc_yilan_vendor", pitch: 0.75, rate: 1.12, taigi: true, persona: "老街道具攤的老闆，嗓門大、招呼客人很熱情。" },
    inn_jiaoxi: { name: "礁溪溫泉旅館老闆", gender: "m", age: "adult", stage: "中年", look: null, pitch: 0.62, rate: 1.01, taigi: true, persona: "溫泉旅館老闆，親切愛招呼，喜歡跟客人聊溫泉。" },
    scallion_farmer: { name: "蔥農阿伯", gender: "m", age: "elder", stage: "老年", look: "npc_scallion_farmer", pitch: 0.58, rate: 0.92, taigi: true, persona: "種蔥的老農夫，講話直爽、嗓門有點粗。" },
    opera_actor: { name: "歌仔戲演員", gender: "m", age: "adult", stage: "青年", look: "npc_opera_actor", pitch: 1, rate: 1.2, taigi: true, persona: "年輕的歌仔戲演員，咬字清楚、講話有點像在唱。" },
    inn_sanxing: { name: "三星民宿老闆", gender: "m", age: "adult", stage: "中年", look: null, pitch: 0.69, rate: 1.08, taigi: true, persona: "農村民宿老闆，說話溫和、慢慢的。" },
    coldspring_keeper: { name: "冷泉管理員", gender: "m", age: "adult", stage: "中年", look: "npc_coldspring_keeper", pitch: 0.78, rate: 0.75, taigi: true, persona: "冷泉管理員，說明事情一板一眼，很重視安全。" },
    sa_fisher: { name: "南方澳漁港阿伯", gender: "m", age: "adult", stage: "中年", look: "npc_sa_fisher", pitch: 0.74, rate: 1.19, taigi: true, persona: "南方澳的漁夫，豪爽、講話大聲，很愛自己的漁港。" },
    inn_suao: { name: "冷泉旅店老闆", gender: "m", age: "adult", stage: "中年", look: null, pitch: 0.62, rate: 1.07, taigi: true, persona: "冷泉旅店老闆，講話輕快、讓人放鬆。" },
    wxb_raincloud: { name: "黏黏雨雲王", gender: "m", age: "adult", stage: "中年", look: "boss_wxb_raincloud", pitch: 0.55, rate: 0.72, taigi: false, persona: "濕答答、慢吞吞，好像整個天空都黏在身上。" },
    // v1.3 台北章（62 號；劇本語音組草稿；新 NPC 的走路圖都已交件，look 用正式圖；旅店老闆是虛擬店員 look null）
    tea_farmer: { name: "茶農阿伯", gender: "m", age: "elder", stage: "老年", look: "npc_tea_farmer", pitch: 0.74, rate: 0.68, taigi: true, persona: "坪林的老茶農，講話慢、愛說茶園的事。" },
    gondola_staff: { name: "纜車站務員", gender: "m", age: "adult", stage: "青年", look: "npc_gondola_staff", pitch: 0.88, rate: 1.21, taigi: true, persona: "纜車站的年輕站務員，講話有精神、很注意安全。" },
    tea_farmer_mk: { name: "鐵觀音茶農阿伯", gender: "m", age: "elder", stage: "老年", look: "npc_tea_farmer_mk", pitch: 0.68, rate: 0.7, taigi: true, persona: "貓空種茶的老農夫，聲音沙沙的，很得意自己的茶。" },
    temple_volunteer_zn: { name: "指南宮志工阿伯", gender: "m", age: "elder", stage: "老年", look: "npc_temple_volunteer_zn", pitch: 0.8, rate: 0.69, taigi: true, persona: "指南宮廟埕的志工阿伯，和氣、說話慢慢的。" },
    inn_maokong: { name: "茶館老闆", gender: "m", age: "adult", stage: "中年", look: null, pitch: 0.68, rate: 0.86, taigi: true, persona: "茶館老闆，說話輕鬆，愛請人喝茶。" },
    dihua_shop: { name: "南北貨店老闆", gender: "m", age: "adult", stage: "中年", look: "npc_dihua_shop", pitch: 0.68, rate: 1.14, taigi: true, persona: "大稻埕南北貨店老闆，算錢很快、嗓門大。" },
    culture_guide: { name: "文史解說員", gender: "m", age: "adult", stage: "青年", look: "npc_culture_guide", pitch: 0.95, rate: 0.74, taigi: true, persona: "年輕的文史解說員，講古蹟很仔細。" },
    traffic_volunteer: { name: "交通志工阿伯", gender: "m", age: "elder", stage: "老年", look: "npc_traffic_volunteer", pitch: 0.74, rate: 0.62, taigi: true, persona: "路口的交通志工阿伯，聲音宏亮、很愛叮嚀安全。" },
    temple_volunteer_ht: { name: "行天宮志工阿伯", gender: "m", age: "elder", stage: "老年", look: "npc_temple_volunteer_ht", pitch: 0.88, rate: 0.76, taigi: true, persona: "行天宮廟埕的志工阿伯，客氣、說話清楚。" },
    inn_taipei: { name: "城市旅館老闆", gender: "m", age: "adult", stage: "中年", look: null, pitch: 0.72, rate: 0.76, taigi: true, persona: "城市旅館老闆，說話俐落、很熱心。" },
    smith_taipei: { name: "台北武器鋪老闆", gender: "m", age: "adult", stage: "青年", look: "npc_blacksmith_m", pitch: 0.94, rate: 1.28, taigi: true, persona: "台北武器鋪老闆，說話乾脆。" },
    armor_taipei: { name: "台北防具店老闆", gender: "m", age: "adult", stage: "青年", look: "npc_shopkeeper", pitch: 0.94, rate: 0.68, taigi: true, persona: "台北防具店老闆，很關心客人的安全。" },
    item_taipei: { name: "台北道具店老闆", gender: "m", age: "adult", stage: "中年", look: "npc_uncle_market", pitch: 0.78, rate: 1.26, taigi: true, persona: "台北道具店老闆，招呼客人很熱情。" },
    bt_museum_guide: { name: "溫泉博物館解說員", gender: "m", age: "adult", stage: "青年", look: "npc_bt_museum_guide", pitch: 1, rate: 1.26, taigi: true, persona: "溫泉博物館的解說員，說明時一句一句很清楚。" },
    geo_ranger: { name: "地熱谷巡守員", gender: "m", age: "adult", stage: "中年", look: "npc_geo_ranger", pitch: 0.78, rate: 0.69, taigi: true, persona: "地熱谷的巡守員，講話嚴肅、一直提醒大家安全。" },
    inn_beitou: { name: "北投溫泉旅館老闆", gender: "m", age: "adult", stage: "中年", look: null, pitch: 0.62, rate: 1.13, taigi: true, persona: "北投溫泉旅館老闆，親切愛招呼。" },
    observatory_staff: { name: "觀景台服務員", gender: "m", age: "adult", stage: "青年", look: "npc_observatory_staff", pitch: 0.88, rate: 1.27, taigi: true, persona: "觀景台服務員，講話開朗、很會說數字。" },
    village_guide: { name: "眷村故事館解說員", gender: "m", age: "adult", stage: "青年", look: "npc_village_guide", pitch: 0.88, rate: 0.7, taigi: true, persona: "眷村故事館的解說員，說故事溫溫的。" },
    inn_xinyi: { name: "信義旅館老闆", gender: "m", age: "adult", stage: "中年", look: null, pitch: 0.68, rate: 1.2, taigi: true, persona: "信義的旅館老闆，說話輕快。" },
    // v1.4 桃竹章（63 號；劇本語音組草稿）：男性聲音快排不下，tofu_shop、wood_artisan、noodle_master、inn_daxi、inn_hsinchu 共用既有角色的聲音（voice_share）；旅店老闆是虛擬店員 look null
    reservoir_keeper: { name: "水庫管理員", gender: "m", age: "adult", stage: "中年", look: "npc_reservoir_keeper", pitch: 0.6, rate: 0.66, taigi: true, persona: "石門水庫的管理員，講話穩重、很注意安全。" },
    hc_guide: { name: "文史解說員", gender: "m", age: "adult", stage: "青年", look: "npc_hc_guide", pitch: 1, rate: 0.62, taigi: true, persona: "年輕的文史解說員，講古蹟很仔細。" },
    tofu_shop: { name: "豆干店老闆", gender: "m", age: "adult", stage: "中年", look: "npc_tofu_shop", pitch: 0.8, rate: 1.2, taigi: true, persona: "大溪老街豆干店老闆，嗓門大、愛招呼人。", voice_share: "item_keeper" },
    wood_artisan: { name: "木藝職人", gender: "m", age: "elder", stage: "老年", look: "npc_wood_artisan", pitch: 0.58, rate: 0.78, taigi: true, persona: "做木工幾十年的老師傅，講話慢、很仔細。", voice_share: "old_miner" },
    noodle_master: { name: "米粉師傅", gender: "m", age: "elder", stage: "老年", look: "npc_noodle_master", pitch: 0.9, rate: 0.88, taigi: true, persona: "曬米粉的老師傅，聲音宏亮，最懂風。", voice_share: "kumquat_farmer" },
    inn_daxi: { name: "老街旅店老闆", gender: "m", age: "adult", stage: "中年", look: null, pitch: 0.62, rate: 1.07, taigi: true, persona: "老街旅店老闆，親切。", voice_share: "inn_suao" },
    inn_hsinchu: { name: "新竹旅店老闆", gender: "m", age: "adult", stage: "中年", look: null, pitch: 0.62, rate: 1.01, taigi: true, persona: "新竹旅店老闆，說話輕快。", voice_share: "inn_jiaoxi" },
    mb_floodgate: { name: "霧閘機將", gender: "m", age: "adult", stage: "中年", look: "boss_mb_floodgate", rate: 0.8, taigi: false, persona: "低沉、像機器喀啦喀啦的聲音，清醒後變得平穩。", pitch: 0.5 }
  },

  // 主角男女（目前沒有台詞，預留）
  player: {
    f: { name: "主角（女生）", gender: "f", age: "child", pitch: 1.42, rate: 1.00, taigi: false, persona: "勇敢、好奇，說話清楚有精神。" },
    m: { name: "主角（男生）", gender: "m", age: "child", pitch: 1.30, rate: 1.00, taigi: false, persona: "勇敢、好奇，說話清楚有精神。" }
  },

  pet: { name: "番薯仔", gender: "m", age: "child", pitch: 1.62, rate: 1.12, taigi: false, persona: "元氣十足、愛吃，說話短短的，常加「喔！」。" },

  monsters: {
    dango:       { family: "slime",   size: "s",    mood: "迷糊", pitch_shift: 7,   cry: "噗嚕噗嚕～" },
    rabbit:      { family: "beast",   size: "s",    mood: "頑皮", pitch_shift: 9,   cry: "啾啾！" },
    mushroom:    { family: "plant",   size: "s",    mood: "迷糊", pitch_shift: 4,   cry: "噗咻～" },
    sprout:      { family: "plant",   size: "s",    mood: "頑皮", pitch_shift: 10,  cry: "嘻嘻嘻！" },
    owl:         { family: "bird",    size: "m",    mood: "神祕", pitch_shift: -2,  cry: "咕——咕——" },
    crab:        { family: "aquatic", size: "s",    mood: "暴躁", pitch_shift: 3,   cry: "喀喀喀！" },
    seagull:     { family: "bird",    size: "s",    mood: "頑皮", pitch_shift: 8,   cry: "嘎嘎！" },
    mudslime:    { family: "slime",   size: "m",    mood: "迷糊", pitch_shift: -3,  cry: "咕嚕……咕嚕……" },
    frog:        { family: "frog",    size: "m",    mood: "迷糊", pitch_shift: -1,  cry: "呱！呱！" },
    fiddler_crab: { family: "aquatic", size: "s",   mood: "頑皮", pitch_shift: 5,   cry: "喀喀！喀喀！" },   // 2026-10-10 B13 新增（地圖組）
    bat:         { family: "bat",     size: "s",    mood: "暴躁", pitch_shift: 11,  cry: "吱吱吱！" },
    rock:        { family: "rock",    size: "m",    mood: "暴躁", pitch_shift: -8,  cry: "喀啦喀啦！" },
    goblin:      { family: "goblin",  size: "m",    mood: "頑皮", pitch_shift: 5,   cry: "嘿嘿嘿！" },
    boar:        { family: "beast",   size: "l",    mood: "暴躁", pitch_shift: -6,  cry: "哼哼——！" },
    wisp:        { family: "spirit",  size: "s",    mood: "神祕", pitch_shift: 6,   cry: "呼……呼……" },
    armor:       { family: "armor",   size: "l",    mood: "神祕", pitch_shift: -9,  cry: "鏘……鏘……" },
    tree_king:   { family: "plant",   size: "boss", mood: "迷糊", pitch_shift: -11, cry: "嘎吱……嘎吱……" },
    fog_octopus: { family: "aquatic", size: "boss", mood: "迷糊", pitch_shift: -7,  cry: "啵嚕嚕……" },
    mud_frog:    { family: "frog",    size: "boss", mood: "迷糊", pitch_shift: -10, cry: "呱——嗚！" },
    noise_bat:   { family: "bat",     size: "boss", mood: "暴躁", pitch_shift: 10,  cry: "吱嘎嘎嘎！" },
    angry_golem: { family: "rock",    size: "boss", mood: "暴躁", pitch_shift: -12, cry: "咚！咚！" },
    fog_demon:   { family: "spirit",  size: "boss", mood: "神祕", pitch_shift: -5,  cry: "呼嗚嗚……" },
    // v1.1 第一章新怪物（59 號 3.2）
    wx_rain:     { family: "spirit",  size: "s",    mood: "迷糊", pitch_shift: 8,   cry: "滴答滴答～" },
    mn_cart:     { family: "armor",   size: "m",    mood: "暴躁", pitch_shift: -4,  cry: "嘰嘎嘰嘎！" },
    mn_ore:      { family: "rock",    size: "m",    mood: "暴躁", pitch_shift: -7,  cry: "咕隆咕隆！" },
    mn_dust:     { family: "spirit",  size: "s",    mood: "頑皮", pitch_shift: 5,   cry: "咻咻咻～" },
    mn_lamp:     { family: "spirit",  size: "s",    mood: "神祕", pitch_shift: 7,   cry: "嗡……嗡……" },
    mn_drill:    { family: "beast",   size: "s",    mood: "頑皮", pitch_shift: 3,   cry: "嘰嘰嘰！" },
    mn_timber:   { family: "beast",   size: "m",    mood: "迷糊", pitch_shift: -2,  cry: "沙沙沙……" },
    mnb_goldjaw: { family: "rock",    size: "boss", mood: "暴躁", pitch_shift: -11, cry: "轟隆隆！" },
    // v1.2 第二章新怪物（61 號 3.2）
    ly_tigerwind: { family: "beast", size: "m", mood: "暴躁", pitch_shift: -3, cry: "呼嚕嚕！" },
    ly_kumquat: { family: "slime", size: "s", mood: "頑皮", pitch_shift: 9, cry: "咚咚咚！" },
    ly_scallion: { family: "plant", size: "m", mood: "暴躁", pitch_shift: -2, cry: "沙沙沙！" },
    ly_bubble: { family: "spirit", size: "s", mood: "迷糊", pitch_shift: 6, cry: "啵啵啵～" },
    ly_mackerel: { family: "aquatic", size: "m", mood: "頑皮", pitch_shift: 4, cry: "啪啪！" },
    wxb_raincloud: { family: "spirit", size: "boss", mood: "迷糊", pitch_shift: -8, cry: "嘩啦啦……" },
    // v1.3 台北章新怪物（62 號 3.2）
    tea_mantis: { family: "beast", size: "s", mood: "暴躁", pitch_shift: 4, cry: "唰唰！" },
    tea_moth: { family: "bird", size: "s", mood: "神祕", pitch_shift: 7, cry: "啪噠啪噠……" },
    tea_basket: { family: "beast", size: "m", mood: "頑皮", pitch_shift: 2, cry: "呼嚕呼嚕！" },
    an_magpie: { family: "bird", size: "m", mood: "頑皮", pitch_shift: 6, cry: "嘎嘎嘎！" },
    mc_gondola: { family: "armor", size: "m", mood: "迷糊", pitch_shift: -3, cry: "喀噹喀噹……" },
    mc_alarm: { family: "armor", size: "s", mood: "暴躁", pitch_shift: 8, cry: "鈴鈴鈴！" },
    mc_roaster: { family: "armor", size: "m", mood: "暴躁", pitch_shift: -4, cry: "轟轟轟！" },
    mc_signal: { family: "armor", size: "m", mood: "迷糊", pitch_shift: 3, cry: "嗶嗶嗶！" },
    mc_vending: { family: "armor", size: "m", mood: "頑皮", pitch_shift: -2, cry: "咚咚！" },
    gt_steam: { family: "beast", size: "m", mood: "暴躁", pitch_shift: -1, cry: "嘶嘶嘶！" },
    gt_jade: { family: "spirit", size: "s", mood: "神祕", pitch_shift: 5, cry: "咕嘟咕嘟……" },
    gt_sulfur: { family: "beast", size: "s", mood: "頑皮", pitch_shift: 9, cry: "刺刺！" },
    // v1.4 桃竹章新怪物（63 號 3.2）
    ty_tofu: { family: "beast", size: "s", mood: "暴躁", pitch_shift: 2, cry: "咚！咚！" },
    ty_carve: { family: "beast", size: "s", mood: "頑皮", pitch_shift: 5, cry: "喀喀喀！" },
    wx_thunder: { family: "spirit", size: "s", mood: "頑皮", pitch_shift: 6, cry: "咚咚！轟——" },
    wx_wind: { family: "spirit", size: "s", mood: "頑皮", pitch_shift: 8, cry: "咻——咻——" },
    mc_vacuum: { family: "armor", size: "s", mood: "迷糊", pitch_shift: 3, cry: "嗡嗡嗡……" },
    hc_noodle: { family: "spirit", size: "m", mood: "神祕", pitch_shift: 4, cry: "呼嚕呼嚕……" },
    mb_floodgate: { family: "armor", size: "boss", mood: "暴躁", pitch_shift: -8, cry: "喀啦喀啦——！" }
  }
};
