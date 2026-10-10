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
    temple_keeper:  { name: "廟公",           gender: "m", age: "elder", stage: "老年", look: "npc_chief",         pitch: 0.72, rate: 0.80, taigi: true,  persona: "慢條斯理、很和氣，像在廟埕泡茶聊天，句尾常拉長音。" },
    shopkeeper:     { name: "老街阿伯",       gender: "m", age: "adult", stage: "青年", look: "npc_shopkeeper",    pitch: 0.97, rate: 1.06, taigi: true,  persona: "嗓門大、愛招呼客人，講話很開朗，台語比華語順。" },   // 原 elder 0.90/0.95：圖是黑髮圓臉的年輕人
    fisher:         { name: "漁夫阿伯",       gender: "m", age: "adult", stage: "中年", look: "npc_fisher",        pitch: 0.75, rate: 0.97, taigi: true,  persona: "豪爽，聲音粗粗的，海風吹久了有點沙啞，笑聲很大。" },   // 原 elder 0.70/0.90：圖是灰黑頭髮、鬍渣的中年人
    bookstore:      { name: "圖書館阿姨",     gender: "f", age: "adult", stage: "中年", look: "npc_bookstore",     pitch: 0.93, rate: 0.90, taigi: true,  persona: "溫柔有耐心，一個字一個字說清楚，偶爾說一句台語。" },   // 原 1.12/0.92；老闆指定中年女
    innkeeper:      { name: "溫泉旅館老闆娘", gender: "f", age: "adult", stage: "中年", look: "npc_innkeeper",     pitch: 1.00, rate: 1.00, taigi: true,  persona: "親切愛笑，招呼客人很熱情，講話帶台語腔。" },   // 原 1.20/1.02；老闆指定中年女
    // ── 擎天草原、硫磺谷 ──
    potato_seller:  { name: "賣地瓜的阿姨",   gender: "f", age: "adult", stage: "中年", look: "npc_auntie_yam",    pitch: 1.05, rate: 1.10, taigi: true,  persona: "大聲叫賣、很有活力，句子短短的，常用台語招呼。" },   // 原 1.15/1.12
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
    blacksmith:     { name: "鐵匠師傅",       gender: "f", age: "adult", stage: "青年", look: "npc_blacksmith",    pitch: 1.10, rate: 1.08, taigi: true,  persona: "俐落、說話乾脆，邊打鐵邊聊天。" },   // 原 1.00：年輕女性
    armor_keeper:   { name: "防具店老闆",     gender: "m", age: "adult", stage: "青年", look: "npc_shopkeeper",    pitch: 0.92, rate: 1.00, taigi: true,  persona: "實在、講話直接，很關心客人安全。" },   // 原 0.85：和老街阿伯同一張年輕人的圖
    item_keeper:    { name: "市場阿姨",       gender: "f", age: "adult", stage: "中年", look: "npc_auntie_market", pitch: 0.92, rate: 1.04, taigi: true,  persona: "爽快，算錢很快，叫你「慢慢仔揀」。" },   // 原 1.08/1.08（老闆說的「草藥阿姨」應是她，見 34 號報告）
    innkeeper_port: { name: "山城民宿老闆娘", gender: "f", age: "adult", stage: "中年", look: "npc_innkeeper",     pitch: 0.98, rate: 0.85, taigi: true,  persona: "輕聲細語、慢慢說，讓人很放鬆。" },   // 原 1.05/0.90：和溫泉老闆娘同一張圖
    taro_seller:    { name: "芋圓店阿姨",     gender: "f", age: "adult", stage: "中年", look: "npc_auntie_taro",   pitch: 1.04, rate: 0.92, taigi: true,  persona: "溫暖，像在哄小孩，愛誇人聰明。" },   // 原 1.22/0.95
    // ── 府城古城 ──
    king:           { name: "城主",           gender: "m", age: "elder", stage: "老年", look: "npc_king",          pitch: 0.62, rate: 0.86, taigi: true,  persona: "威嚴但溫和，說話穩重、字字清楚。" },   // CTO：台語台詞補寫中，taigi 改 true
    guild:          { name: "公會導師",       gender: "f", age: "adult", stage: "青年", look: "npc_guild",         pitch: 1.10, rate: 1.00, taigi: true,  persona: "有精神，像老師一樣鼓勵人。" },   // CTO：taigi 改 true
    librarian:      { name: "圖書館員",       gender: "m", age: "adult", stage: "青年", look: "npc_librarian",     pitch: 0.92, rate: 0.90, taigi: true,  persona: "斯文、輕聲細語，很愛書。" },   // CTO：taigi 改 true
    // ── v0.9.3 B14 各地旅店老闆（還沒有精靈圖：先設中年＝adult，性別暫定，待語音組確認）──
    // 語音組 2026-10-10：還沒有精靈圖，無法照外觀確認性別；先照名稱（老闆娘＝女、老闆＝男）設中年，音高調進中年範圍。有圖後請把 look 補上。
    inn_shenmu:     { name: "樹屋旅店老闆娘", gender: "f", age: "adult", stage: "中年", look: null,                pitch: 1.04, rate: 0.86, taigi: true,  persona: "溫柔安靜，像在森林裡說悄悄話，讓人想睡。" },   // 原 1.17（青年女範圍）
    inn_mangrove:   { name: "地精旅舍老闆",   gender: "m", age: "adult", stage: "中年", look: null,                pitch: 0.88, rate: 1.15, taigi: false, persona: "勤快的地精，講話輕快，喜歡聊潮水漲退。" },
    inn_goblin:     { name: "石屋客棧老闆娘", gender: "f", age: "adult", stage: "中年", look: null,                pitch: 0.95, rate: 1.20, taigi: false, persona: "愛笑的哥布林，開口先「嘿嘿」，講話快快的。" },
    inn_moon:       { name: "帳篷營地老闆",   gender: "m", age: "adult", stage: "中年", look: null,                pitch: 0.80, rate: 0.94, taigi: true,  persona: "爽朗實在，講話不急不徐，很會照顧旅人。" },
    inn_fucheng:    { name: "府城老客棧老闆", gender: "m", age: "adult", stage: "中年", look: null,                pitch: 0.90, rate: 0.84, taigi: true,  persona: "客氣有禮，說話慢條斯理，帶一點古早味。" },   // 原 0.96（青年男範圍）
    // ── 旁白 ──
    narrator:       { name: "旁白",           gender: "f", age: "adult", stage: "中年", look: null,                pitch: 0.98, rate: 0.95, taigi: false, persona: "平穩溫和的說書人。" },
    // ── 會說話的頭目（戰鬥前後的台詞）── 圖沒有明顯性別特徵的頭目維持原設定（見 34 號報告）
    tree_king:      { name: "枯萎樹王",       gender: "m", age: "elder", stage: "老年", look: "boss_tree",         pitch: 0.55, rate: 0.70, taigi: false, persona: "迷迷糊糊、像樹枝嘎吱響，一個字一個字慢慢擠出來。" },
    fog_octopus:    { name: "迷霧章魚",       gender: "f", age: "adult", stage: "中年", look: "boss_octopus",      pitch: 0.80, rate: 0.70, taigi: false, persona: "睏睏的、拖長音，好像隨時會睡著。" },
    mud_frog:       { name: "泥巴大蛙",       gender: "m", age: "adult", stage: "中年", look: "boss_frog",         pitch: 0.60, rate: 0.95, taigi: false, persona: "低沉、呱呱叫，數到一半就亂掉。" },
    noise_bat:      { name: "噪音蝙蝠王",     gender: "m", age: "teen",  stage: "青少年", look: "boss_bat",        pitch: 1.75, rate: 1.25, taigi: false, persona: "尖聲又吵，講話很急，靜下來後變得很溫和。" },
    angry_golem:    { name: "暴躁石像",       gender: "m", age: "adult", stage: "中年", look: "boss_golem",        pitch: 0.50, rate: 0.72, taigi: false, persona: "低沉又重，像石頭敲地，一句一頓。" },
    fog_demon:      { name: "遺忘霧魔",       gender: "f", age: "adult", stage: "中年", look: "boss_fog",          pitch: 0.70, rate: 0.75, taigi: false, persona: "低低的、飄來飄去，像在耳邊說悄悄話。" }
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
    fog_demon:   { family: "spirit",  size: "boss", mood: "神祕", pitch_shift: -5,  cry: "呼嗚嗚……" }
  }
};
