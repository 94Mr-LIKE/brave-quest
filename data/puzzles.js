/*
 * v4.0 霧之洞窟（M37–M40）解謎機關資料（71 號 2.11；企劃 2026-10-26）。規則與驗證在 src/systems/cave_puzzle.js。
 * 每一道：map、type、required（必做＝擋在主線路上）、name、dialogs（規則與 3 層提示的對白 ID：劇本語音組 dialogs_east2.js 的 PUZZLE_DIALOGS_EAST2，
 *   霧仔講華語；dialogs.js 由 v40_apply.js 加入）、rule／hints（同樣的文字，對白還沒載入時的備用）、data（機關本身）、expect（最少步數、答案；
 *   數字來自 design_lab/cave_puzzles.py 跑出的 cave_puzzles_results.json，tests/v40_ch7.test.js 兩邊對照）、reward。
 * 地圖上的位置（踏板、石門、箱子、鏡子……的格子）不在這裡：在 maps.js 各圖的 puzzles（地圖組 tools/bigmaps/M37–M40.json；
 *   遊戲用 JQ.EastFields.parse 把兩邊合起來）。推箱子、光線反射的地圖是「機關區左上角起算」的相對座標。
 * 機關不從題庫出題，答案固定在這裡（71 號 2.11.1）。
 */
window.PUZZLES = {
  // ───────── 第 1 層 M37 回音霧廊（最簡單）─────────
  'P1-1': {
    map: 'M37', type: 'lights', required: true, name: '三盞燈的石門',
    dialogs: { rule: 'D_PZ_P1_1_RULE', hints: ['D_PZ_P1_1_H1', 'D_PZ_P1_1_H2', 'D_PZ_P1_1_H3'] },   // 劇本組 dialogs_east2.js 的 PUZZLE_DIALOGS_EAST2
    rule: '踩一塊踏板，連著它的燈會換：暗的變亮、亮的變暗。讓三盞燈都亮，門就開。',
    data: { n: 3, keys: ['A', 'B', 'C'], toggles: { A: [0, 1], B: [1, 2], C: [2] }, start: [0, 0, 0], goal: [1, 1, 1] },
    expect: { min_steps: 2, solution: ['A', 'C'] },
    hints: ['看地上的線：每塊踏板連到哪幾盞燈？', '中間那塊會把已經亮的燈弄暗，先試試旁邊兩塊。', '踩最左邊的踏板，再踩最右邊的踏板。'],
    reward: { opens: 'door' }
  },
  'P1-2': {
    map: 'M37', type: 'pattern', required: false, name: '形狀和顏色的規律',
    dialogs: { rule: 'D_PZ_P1_2_RULE', hints: ['D_PZ_P1_2_H1', 'D_PZ_P1_2_H2', 'D_PZ_P1_2_H3'] },   // 劇本組 dialogs_east2.js 的 PUZZLE_DIALOGS_EAST2
    rule: '牆上的圖案照規律排。下一個是什麼？站到對的地板上。',
    data: { shapes: ['圓', '三角', '方'], colors: ['紅', '藍'], length: 5, options: ['紅方', '藍方', '藍三角', '紅圓'] },
    expect: { answer: '藍方', unique: true },
    hints: ['形狀是怎麼輪流的？', '顏色是紅、藍、紅、藍……', '下一個是方形，顏色是藍色。'],
    reward: { chest: 'C_M37_1' }
  },
  'P1-3': {
    map: 'M37', type: 'memory', required: false, name: '記憶翻牌',
    dialogs: { rule: 'D_PZ_P1_3_RULE', hints: ['D_PZ_P1_3_H1', 'D_PZ_P1_3_H2', 'D_PZ_P1_3_H3'] },   // 劇本組 dialogs_east2.js 的 PUZZLE_DIALOGS_EAST2
    rule: '一次翻兩張，一樣就留著，不一樣會蓋回去。把 4 對都找出來。',
    data: { faces: ['橡皮擦', '雨傘', '鑰匙', '手帕'], copies: 2 },
    expect: { cards: 8, pairs_ok: true },
    hints: ['翻過的牌，要記住它在哪裡。', '先把每張都翻一次，記住哪裡有什麼。', '（8 張牌一起亮 1 秒再蓋回去）'],
    hint3: 'reveal',
    reward: { chest: 'C_M37_2' }
  },
  // ───────── 第 2 層 M38 霜晶迴廊 ─────────
  'P2-1': {
    map: 'M38', type: 'sokoban', required: false, name: '推冰塊箱',
    dialogs: { rule: 'D_PZ_P2_1_RULE', hints: ['D_PZ_P2_1_H1', 'D_PZ_P2_1_H2', 'D_PZ_P2_1_H3'] },   // 劇本組 dialogs_east2.js 的 PUZZLE_DIALOGS_EAST2
    rule: '冰塊箱只能推、不能拉。把它推到發光的格子上。',
    data: { rows: ['#######', '#.    #', '# ##  #', '#  $  #', '#  #  #', '#@    #', '#######'] },
    expect: { min_moves: 11, min_pushes: 4, solution: '右右右上上左左下左上上' },
    hints: ['冰塊箱只能推，不能拉；推到牆角就推不出來了。', '先把冰塊箱往左推到牆邊，再往上推。', '（地上出現前 5 步的箭頭：右右右上上）'],
    hint3: 'arrows', hint_steps: 5,
    reward: { chest: 'C_M38_2' }
  },
  'P2-2': {
    map: 'M38', type: 'balance', required: false, name: '冰塊天平',
    dialogs: { rule: 'D_PZ_P2_2_RULE', hints: ['D_PZ_P2_2_H1', 'D_PZ_P2_2_H2', 'D_PZ_P2_2_H3'] },   // 劇本組 dialogs_east2.js 的 PUZZLE_DIALOGS_EAST2
    rule: '天平左邊是 7 公斤的冰塊。選兩顆石頭放到右邊，讓天平平平的。',
    data: { left: 7, stones: [1, 2, 4, 5], pick: 2 },
    expect: { answers: [[2, 5]], unique: true },
    hints: ['兩顆加起來要等於 7。', '1 和 4 加起來只有 5，不夠。', '試試 2 和 5。'],
    reward: { chest: 'C_M38_1' }
  },
  'P2-3': {
    map: 'M38', type: 'numseq', required: true, name: '冰柱上的數字',
    dialogs: { rule: 'D_PZ_P2_3_RULE', hints: ['D_PZ_P2_3_H1', 'D_PZ_P2_3_H2', 'D_PZ_P2_3_H3'] },   // 劇本組 dialogs_east2.js 的 PUZZLE_DIALOGS_EAST2
    rule: '冰柱上的數字照規律排。下一個是多少？站到對的地板上。',
    data: { first: 2, step: 1, length: 5, options: [15, 16, 17, 18] },
    expect: { answer: 17, unique: true },
    hints: ['看看每兩個數差多少。', '差是 1、2、3、4……', '12 再加 5。'],
    reward: { opens: 'ice_gate' }
  },
  // ───────── 第 3 層 M39 遺失物書庫 ─────────
  'P3-1': {
    map: 'M39', type: 'mirror', required: false, name: '天窗的光',
    dialogs: { rule: 'D_PZ_P3_1_RULE', hints: ['D_PZ_P3_1_H1', 'D_PZ_P3_1_H2', 'D_PZ_P3_1_H3'] },   // 劇本組 dialogs_east2.js 的 PUZZLE_DIALOGS_EAST2
    rule: '點一下鏡子，它會換方向。讓光從鏡子彈過去，照到水晶。',
    data: { w: 7, h: 5, walls: [[5, 1], [1, 3], [2, 3]], mirrors: [[3, 1], [3, 4], [6, 1]], start: ['/', '/', '/'], src: [0, 1], dir: [1, 0], target: [6, 4] },
    expect: { min_rotations: 2, rotate_order: [0, 1] },
    hints: ['光碰到鏡子會轉彎。', '有一面鏡子不管怎麼轉，光都碰不到它。', '點左上那面鏡子，再點下面那面。'],
    reward: { reveals: 'handkerchief' }
  },
  'P3-2': {
    map: 'M39', type: 'euler', required: false, name: '一筆畫的石頭路',
    dialogs: { rule: 'D_PZ_P3_2_RULE', hints: ['D_PZ_P3_2_H1', 'D_PZ_P3_2_H2', 'D_PZ_P3_2_H3'] },   // 劇本組 dialogs_east2.js 的 PUZZLE_DIALOGS_EAST2
    rule: '從一顆石頭出發，把 8 條路都走過，每條只能走一次。',
    data: { nodes: ['A', 'B', 'C', 'D', 'E'], edges: [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A'], ['A', 'C'], ['B', 'D'], ['D', 'E'], ['E', 'C']] },
    expect: { steps: 8, solutions: 88, valid_starts: ['A', 'B'] },
    hints: ['走過的路會發亮，發亮的路不能再走。', '有兩顆石頭連著 3 條路，要從其中一顆出發。', '從左下角的石頭出發。'],
    reward: { reveals: 'blocks' }
  },
  'P3-3': {
    map: 'M39', type: 'symbol', required: true, name: '借書台的密碼',
    dialogs: { rule: 'D_PZ_P3_3_RULE', hints: ['D_PZ_P3_3_H1', 'D_PZ_P3_3_H2', 'D_PZ_P3_3_H3'] },   // 劇本組 dialogs_east2.js 的 PUZZLE_DIALOGS_EAST2
    rule: '三個式子裡，一樣的符號代表一樣的數。■ 是多少？轉動密碼盤。',
    data: { eqs: [[['▲', '▲'], 8], [['▲', '●'], 7], [['●', '■'], 9]], ask: '■', order: ['▲', '●', '■'], range: [1, 9] },
    expect: { answer: 6, unique: true },
    hints: ['先看第一個式子：兩個 ▲ 一樣大。', '▲ 是 4，那 ● 是多少？', '● 是 3。9 減 3 是多少？'],
    reward: { opens: 'gate' }
  },
  // ───────── 第 4 層 M40 五燈試煉（最難）─────────
  'P4-1': {
    map: 'M40', type: 'sokoban', required: false, name: '推兩個石箱',
    dialogs: { rule: 'D_PZ_P4_1_RULE', hints: ['D_PZ_P4_1_H1', 'D_PZ_P4_1_H2', 'D_PZ_P4_1_H3'] },   // 劇本組 dialogs_east2.js 的 PUZZLE_DIALOGS_EAST2
    rule: '兩個石箱都要推到發光的格子上。只能推、不能拉。',
    data: { rows: ['#########', '#   #   #', '# $   $ #', '#  ###  #', '#.  @  .#', '#########'] },
    expect: { min_moves: 24, min_pushes: 6, solution: '左左上左上上右下下上右右右右上右下下左下左左左左' },
    hints: ['左邊的箱子推到左邊的格子，右邊的推到右邊。', '中間的牆擋住了，人要先從上面繞到箱子旁邊。', '（地上出現推左邊箱子的路線箭頭）'],
    hint3: 'arrows', hint_steps: 9,
    reward: { chest: 'C_M40_1' }
  },
  'P4-2': {
    map: 'M40', type: 'lights', required: true, name: '五角星盤',
    dialogs: { rule: 'D_PZ_P4_2_RULE', hints: ['D_PZ_P4_2_H1', 'D_PZ_P4_2_H2', 'D_PZ_P4_2_H3'] },   // 劇本組 dialogs_east2.js 的 PUZZLE_DIALOGS_EAST2
    rule: '踩一顆星石，它和旁邊兩顆會一起換：亮的變暗，暗的變亮。讓五顆都亮。',
    data: { n: 5, ring: true, keys: ['1', '2', '3', '4', '5'], start: [1, 0, 1, 0, 0], goal: [1, 1, 1, 1, 1] },
    expect: { min_steps: 3, solution: ['1', '2', '3'], max_over_all_starts: 5 },
    hints: ['每踩一顆，它和左右兩顆都會換。', '現在亮的是 1 號和 3 號；踩 2 號會讓 1、3 號變暗喔。', '踩 1 號、2 號、3 號各一次。'],
    reward: { opens: 'final_gate' }
  },
  'P4-3': {
    map: 'M40', type: 'hanoi', required: false, name: '疊石盤',
    dialogs: { rule: 'D_PZ_P4_3_RULE', hints: ['D_PZ_P4_3_H1', 'D_PZ_P4_3_H2', 'D_PZ_P4_3_H3'] },   // 劇本組 dialogs_east2.js 的 PUZZLE_DIALOGS_EAST2
    rule: '把三個石盤全部搬到最右邊的柱子。一次只能搬一個，大的不能壓在小的上面。',
    data: { discs: 3, from: 0, to: 2, names: ['小', '中', '大'], pegs: ['左', '中', '右'] },
    expect: { min_moves: 7 },
    hints: ['一次只能搬一個，大的不能壓在小的上面。', '第一步：把最小的放到最右邊。', '前 3 步：小→右、中→中、小→中。'],
    reward: { chest: 'C_M40_2' }
  }
};

/** M39 遺失物（71 號 2.5：8 件，圖示新畫；和最終頭目身邊漂浮的東西呼應）。cat＝要送回的書架；en＝英語單字題用的字【建議，請英語老師確認】 */
window.LOST_ITEMS = {
  eraser: { name: '橡皮擦', en: 'eraser', cat: '文具', icon: '🧽' },
  pencil: { name: '鉛筆', en: 'pencil', cat: '文具', icon: '✏️' },
  umbrella: { name: '雨傘', en: 'umbrella', cat: '雨具', icon: '☂️' },
  raincoat: { name: '雨衣', en: 'raincoat', cat: '雨具', icon: '🧥' },
  hat: { name: '帽子', en: 'hat', cat: '衣服', icon: '👒' },
  handkerchief: { name: '手帕', en: 'handkerchief', cat: '衣服', icon: '🧣' },
  blocks: { name: '小積木', en: 'blocks', cat: '玩具', icon: '🧱' },
  workbook: { name: '作業簿', en: 'workbook', cat: '文具', icon: '📒' }
};
