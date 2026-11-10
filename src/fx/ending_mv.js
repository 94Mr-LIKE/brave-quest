/*
 * v4.2 大結局 MV：片尾曲〈曙光之歌〉v2（89.500 秒，3/4 拍，鈸點 26／42／62／72，最後和弦 82.618）＋17 鏡＋片名＋旁白字卡 6 張（方案丙）。
 *
 * 依據：v42_定案規劃.md 第七節（裁定一：Canvas 即時畫）、第三節 4b 第 4 步；01_執行長裁定_會後.md K16（效能與降級）、K18（卡 4 只在 V08）、
 *       K21（截圖時間點）；v42_decisions.json 的 mv 鍵；資深全端.md 第五節、6.2、10.5（裁切、1080p 座標×2/3、crop／zoom）；
 *       MV_v2_分鏡.md（17 鏡、FX 效果）；大結局_MV與頒獎腳本.md 2.2、2.4、5.7（跳過、減少動態效果、勇者特別版）；
 *       片尾曲_v2_段落秒數.md（段落與鈸點）；語文家教.md 2.2（v2 曲的鏡頭秒數）；dialogs_v42_fill.js 的 MV_NARR_4B（字卡秒數）；
 *       MV_小修疊層_座標表.json（K04 補丁、V13 星軌中心、V08 黑面琵鷺）。
 *
 * 做法（照 ui/opening.js 的寫法）：
 * - 純資料驅動：SCENES（每鏡圖、起訖秒、crop、zoom、疊層 fx、字卡 ID）、TITLE、CARDS、HERO_SPECIAL 都是資料；畫面＝frame(t)，同一個 t 畫同一張圖。
 * - 時間跟著片尾曲 audio.currentTime 走（呼叫端傳 audio 元素）；沒有聲音或曲子讀不到就照時鐘播，字卡秒數不變。
 * - 邏輯解析度 1280×720；畫布倍率上限 1.5（可用 opts.maxScale 改 1.0）；每秒最多 30 格；每一格不產生新物件（暫存物件、亂數表、星點都在開播前建好）。
 * - 圖檔：docs/assets/mv/*.webp（1280×720，已照 crop 裁好；tools/mv/make_mv_webp.py 產生）。只在結局時讀：開播前讀前 3 鏡，播到第 n 鏡讀 n+1、n+2，放掉 n−2 以前的圖。
 *   不打包進 packed_assets（雙擊 index.html 的 file:// 模式讀不到 → 直接呼叫 onSkip('image')，跳過 MV 直接頒獎）。
 * - 減少動態效果（家長設定，或系統 prefers-reduced-motion，或自動降級）：每鏡一張靜止圖、0.5 秒淡換，沒有推近平移、沒有疊層動畫與閃光；歌與字卡秒數不變。
 * - 自動降級（K16）：開播 1 秒後，連續 3 秒平均每格 >50 ms → 切成減少動態版；降級後連續 3 秒平均每格仍 >100 ms → onSkip('slow')；
 *   必要的圖讀不到 → onSkip('image')。網址加 ?mvslow=80（每格多卡 80 ms）可強迫降級測試。
 * - 跳過：opts.skippable＝true 才顯示「跳過 ▸▸」（Esc 也可以）；第一次看 MV 不給跳過（v42_decisions.json mv.first_play_skippable＝false）。
 * - 主角圖由呼叫端傳入（照性別＋目前職業挑 hero_<職業>／heroM_<職業> 走路圖）；V17 照 opts.female 用 E5 或 E5 女生版。
 * - 閃光：沒有白閃；開頭由白淡入（接 E2 白光）、結尾 88.3 秒起淡出到黑；光芒、水下光束亮度 ≤22%。
 *
 * 給 4b 接線：J.EndingMV.play(opts)；opts 與回呼見檔尾 play() 的說明，或 game/reports/v42_mv_report.md 第四節。
 */
(function (root) {
  'use strict';
  var J = root.JQ = root.JQ || {};

  // ====================================================================== 基本設定
  var W = 1280, H = 720;
  var FPS = 30, FRAME_MIN_MS = 1000 / FPS - 4;            // 每秒最多 30 格（照 title_anim.js）
  var K1080 = 2 / 3;                                      // 1080p 座標 × 2/3 ＝ 遊戲邏輯座標
  var RS = 2;                                             // 字卡預先繪製的解析度倍率
  var FONT = '"Microsoft JhengHei", "PingFang TC", "Noto Sans TC", "Heiti TC", sans-serif';
  var BASE = 'assets/mv/';

  // 片尾曲 v2（片尾曲_v2_段落秒數.md 第 2 節）
  var SONG = {
    id: 'ending_song', version: 'v2', dur: 89.5,
    sections: [
      { name: '前奏', t0: 0, t1: 10 }, { name: 'A 段', t0: 10, t1: 26 }, { name: '副歌', t0: 26, t1: 58 },
      { name: '轉調橋段', t0: 58, t1: 62 }, { name: '高潮副歌', t0: 62, t1: 78 }, { name: '尾聲', t0: 78, t1: 89.5 }
    ],
    cymbals: [26, 42, 62, 72], climax: 72, lastChord: 82.618,
    whiteIn: 0.8, whiteInReduced: 0.5,                    // 開頭由白淡入（接 E2 白光；減少動態 0.5 秒）
    fadeOut: [88.3, 89.5]                                  // 作曲表 88.3–89.5 淡出
  };

  /*
   * 分鏡（v2 曲；鏡頭秒數照語文家教.md 2.2 換算，V16／V17 交界改 81.0：分鏡第六節「每鏡 ≥3.0 秒」，80.8 會讓 V16 只有 2.8 秒）。
   * file：減少動態版（靜止圖）與一般版共用的底圖；fileFx：一般版改用的底圖（V13 星點調暗）；files：要讀的全部圖（必要）。
   * crop：轉檔時從 1536×1024 原圖取 16:9 的上緣 y（預設 80；V01＝0 貼齊上緣）；null＝不是 GPT 原圖（程式畫、結局插圖）。
   * cut：進這一鏡的換法（一般版）：hard＝硬切（鈸點、段落交界）、fade＝0.5 秒淡換（以換鏡點為中心）、white＝由白淡入。
   * zoom：{ from(預設 1), to, anchor, anchorTo, until }；anchor＝畫面上固定不動的點（0–1；'center'／'bottom'／'top'），anchorTo＝搖鏡終點。
   * fx：一般版的程式疊層（減少動態版不畫）；still：減少動態版也畫的靜止物件（主角站姿、剪影）。
   */
  var SCENES = [
    { id: 'V01', t0: 0, t1: 10, place: '金山・燭台雙嶼清晨空拍', file: 'mv_v01.webp', crop: { y: 0 }, cut: 'white',
      zoom: { from: 1, to: 1.12, anchor: [0.55, 0.62], anchorTo: [0.55, 0.42] },
      fx: [{ kind: 'mist', y: 150, h: 120, speed: 10, alpha: 0.35 }, { kind: 'sparkle', x0: 640, y0: 380, x1: 1260, y1: 700, n: 34, period: 1.3 }] },
    { id: 'V02', t0: 10, t1: 14, place: '陽明山・擎天崗清晨逆光', file: 'mv_v02.webp', crop: { y: 80 }, cut: 'fade',
      zoom: { from: 1.06, to: 1.06, anchor: [0.7, 0.5], anchorTo: [0.35, 0.5] },
      fx: [{ kind: 'mist', y: 300, h: 110, speed: 14, alpha: 0.32 }, { kind: 'mist', y: 345, h: 90, speed: 26, alpha: 0.22 }],
      still: [{ kind: 'hero_walk', t: 10.2, x0: 1380, x1: 880, speed: 150, feet: 694, scale: 2.4, petScale: 2.0 }] },
    { id: 'V03', t0: 14, t1: 18, place: '金瓜石・陰陽海黃昏空拍', file: 'mv_v03.webp', crop: { y: 80 }, cut: 'fade',
      zoom: { from: 1, to: 1.08, anchor: [0.3, 0.6], anchorTo: [0.6, 0.6] },
      fx: [{ kind: 'sparkle', x0: 200, y0: 470, x1: 1000, y1: 700, n: 26, period: 1.4 }] },
    { id: 'V04', t0: 18, t1: 22, place: '宜蘭・龜山島海面日出', file: 'mv_v04.webp', crop: { y: 80 }, cut: 'fade',
      zoom: { from: 1.03, to: 1.03, anchor: [0.5, 0.5], bob: { amp: 0.005, period: 4 } },
      fx: [{ kind: 'sparkle', x0: 100, y0: 470, x1: 1200, y1: 700, n: 36, period: 1.2 }] },
    { id: 'V05', t0: 22, t1: 26, place: '貓空纜車・台北盆地藍色時刻', file: 'mv_v05.webp', crop: { y: 80 }, cut: 'fade', card: 'D_MV_NARR_B3',
      zoom: { from: 1, to: 1.08, anchor: [0.4, 0.6], anchorTo: [0.5, 0.5] },
      fx: [{ kind: 'city', t0: 23.6, t1: 25.9, x0: 20, y0: 250, x1: 1260, y1: 372, n: 72 }] },
    { id: 'V06', t0: 26, t1: 34, place: '桃園・石門水庫空拍', file: 'mv_v06.webp', crop: { y: 80 }, cut: 'hard', card: 'D_MV_NARR_B4',
      zoom: { from: 1.12, to: 1, anchor: [0.5, 0.55] },
      fx: [{ kind: 'wake', sprite: 'boss_mb_floodgate', t: 26.4, x: 560, y: 450, size: 170 }, { kind: 'sparkle', x0: 200, y0: 420, x1: 900, y1: 700, n: 24, period: 1.5 }] },
    { id: 'V07', t0: 34, t1: 42, place: '雲林・北港溪河堤黃昏剪影', file: 'mv_v07.webp', crop: { y: 80 }, cut: 'fade',
      zoom: { from: 1, to: 1.04, anchor: [0.5, 0.6] },
      fx: [{ kind: 'wake', sprite: 'boss_mb_lantern', t: 36.4, x: 1060, y: 130, size: 150 }] },
    { id: 'V08', t0: 42, t1: 50, place: '台南・台江七股清晨空拍', file: 'mv_v08.webp', crop: { y: 80 }, cut: 'hard', card: 'D_MV_NARR_B5',
      zoom: { to: 1.05, anchor: 'bottom' },
      fx: [{ kind: 'wake', sprite: 'boss_fog', t: 42.4, x: 640, y: 120, size: 170, after: { sprite: 'npc_fog_kid', dur: 0.9, x1: -90, y1: 560, scale: 1.0 } },
        { kind: 'birds', t: 44.0, lead: -50, speed: 250 }] },
    { id: 'V09', t0: 50, t1: 54, place: '屏東・小琉球海底仰望海龜', file: 'mv_v09.webp', crop: { y: 80 }, cut: 'fade',
      zoom: { from: 1.1, to: 1.1, anchor: [0.5, 1], anchorTo: [0.5, 0] },
      fx: [{ kind: 'beams', xs: [200, 330, 470, 610], angle: 0.32, alpha: 0.14 }, { kind: 'bubbles', n: 14 }] },
    { id: 'V10', t0: 54, t1: 58, place: '屏東・鵝鑾鼻燈塔塔頂俯瞰', file: 'mv_v10.webp', crop: { y: 80 }, cut: 'fade',
      zoom: { from: 1.1, to: 1.1, anchor: [0.5, 0], anchorTo: [0.5, 1] }, fx: [] },
    { id: 'V11', t0: 58, t1: 62, place: '花蓮・清水斷崖海面低角度', file: 'mv_v11.webp', crop: { y: 80 }, cut: 'hard',
      zoom: { from: 1.08, to: 1.08, anchor: [0.5, 1], anchorTo: [0.5, 0] },
      fx: [{ kind: 'wake', sprite: 'boss_wxb_whale', t: 58.4, x: 960, y: 230, size: 180 }, { kind: 'sparkle', x0: 760, y0: 440, x1: 1270, y1: 560, n: 26, period: 1.1 }] },
    { id: 'V12', t0: 62, t1: 65.333, place: '花蓮・太魯閣峽谷谷底仰望', file: 'mv_v12.webp', crop: { y: 80 }, cut: 'hard',
      zoom: { from: 1.15, to: 1.15, anchor: [0.5, 1], anchorTo: [0.5, 0] },
      fx: [{ kind: 'beams', xs: [600, 690], angle: 0.06, alpha: 0.12 }] },
    { id: 'V13', t0: 65.333, t1: 68.667, place: '合歡山・暗空公園夜空', file: 'mv_v13.webp', fileFx: 'mv_v13_dim.webp',
      files: ['mv_v13.webp', 'mv_v13_dim.webp', 'mv_v13_fg.webp'], crop: { y: 80 }, cut: 'fade',
      zoom: { from: 1, to: 1, anchor: 'center' }, fx: [{ kind: 'stars', omega: -0.12, fg: 'mv_v13_fg.webp' }] },
    { id: 'V14', t0: 68.667, t1: 72, place: '金包里海風公園（夜）五盞燈', file: null, files: [], crop: null, cut: 'fade', draw: 'lamps',
      lamps: [68.9, 69.4, 69.9, 70.4, 70.9], dawnGlow: [71.3, 72.0], fx: [] },
    { id: 'V15', t0: 72, t1: 78, place: '玉山主峰雲海之上曙光', file: 'mv_v15.webp', crop: { y: 80 }, cut: 'hard', card: 'D_MV_NARR_B7',
      zoom: { from: 1, to: 1.06, anchor: [0.45, 0.4] },
      fx: [{ kind: 'rays', x: 1190, y: 40, alpha: 0.18 }],
      still: [{ kind: 'silhouettes', feet: 652, x: 236 }] },
    { id: 'V16', t0: 78, t1: 81, place: '一路上的朋友（E4）', file: 'mv_v16_e4.webp', crop: null, cut: 'fade',
      zoom: { from: 1.15, to: 1.15, anchor: [0, 0.4], anchorTo: [1, 0.4] }, fx: [] },
    { id: 'V17', t0: 81, t1: 89.5, place: '回家的海邊小路（E5）', file: 'mv_v17_e5.webp', fileFemale: 'mv_v17_e5_f.webp', crop: null, cut: 'fade', card: 'D_MV_NARR_B8',
      zoom: { from: 1, to: 1.08, anchor: [0.5, 0.5], until: 82.618 }, fx: [] }
  ];

  // 片名（MV_v2_分鏡.md 第五節；中心 y 照 v42_decisions.json mv.crop.title_center_y_1080p＝130）
  var TITLE = { id: 'MV_TITLE', text: '片尾曲〈曙光之歌〉', start: 1.0, end: 6.5, fade: 0.5, x1080: 960, y1080: 130, size1080: 88 };
  // 旁白字卡 6 張（方案丙；dialogs_v42_fill.js MV_NARR_4B 原秒數；卡 4 47.0–50.0 只在 V08＝K18）
  // x1080／y1080＝字卡中心（1920×1080 座標，×2/3 換成遊戲座標）；位置避開主體（分鏡 3.2 節）
  var CARDS = [
    { id: 'D_MV_NARR_B1', scene: 'V01', start: 6.8, end: 9.8, x1080: 960, y1080: 130 },
    { id: 'D_MV_NARR_B3', scene: 'V05', start: 22.3, end: 25.6, x1080: 560, y1080: 150 },
    { id: 'D_MV_NARR_B4', scene: 'V06', cross: 'V07', start: 32.0, end: 36.0, x1080: 620, y1080: 150 },
    { id: 'D_MV_NARR_B5', scene: 'V08', start: 47.0, end: 50.0, x1080: 960, y1080: 130 },
    { id: 'D_MV_NARR_B7', scene: 'V15', start: 72.1, end: 75.1, x1080: 560, y1080: 130 },
    { id: 'D_MV_NARR_B8', scene: 'V17', start: 82.7, end: 85.7, x1080: 960, y1080: 130 }
  ];
  var CARD_FADE = 0.3, CARD_SIZE1080 = 72;
  // 字卡文字：正式文字在 dialogs.js 的 D_MV_NARR_*（4b 併入）；讀不到時用這份（＝fill 檔原文，老闆核定方案丙）
  var FALLBACK_TEXT = {
    D_MV_NARR_B1: '旅程，從金山的海邊開始。',
    D_MV_NARR_B3: '來到有好多高樓的大城市。',
    D_MV_NARR_B4: '水庫邊、河堤上，都有人揮手。',
    D_MV_NARR_B5: '古城和大海，都醒過來了。',
    D_MV_NARR_B7: '玉山上，天亮了。',
    D_MV_NARR_B8: '海風吹來了，回家吧。'
  };

  /*
   * 勇者特別版 H2（大結局腳本 5.7 節；劇情設計師.md 第五節：改重用片尾曲 v2 的 58.000–89.500）。
   * 這裡只給時間表（頒獎畫面在地圖上演，4b 接線時照表排）；秒數＝片尾曲的絕對秒數。
   */
  var HERO_SPECIAL = {
    from: 58, to: 89.5,
    anchors: { modulation: 62, certOpen: 72, vo: 72.1, lastChord: 82.618, tapHint: 87 },
    segments: [
      { id: 'H2-C1', t0: 58, t1: 62, what: '五盞燈同時往上射出光柱（轉調橋段）' },
      { id: 'H2-C2', t0: 62, t1: 66, what: '轉調鈸：光柱往主角頭上合成大光柱；大結局版第六座燈座在 62.000 點亮' },
      { id: 'H2-C3', t0: 66, t1: 69, what: '插入 E4（一路上的朋友）' },
      { id: 'H2-C4', t0: 69, t1: 72, what: '回公園，夜色＋煙火光雨（每秒最多 2 朵、不閃白）' },
      { id: 'H2-C5', t0: 72, t1: 76, what: '最高潮：金色勇者之證展開；72.1 里長伯旁白 D_END_HERO_VO（自動播）' },
      { id: 'H2-C6', t0: 76, t1: 82.618, what: '勇者勳章；78.000 尾聲開始時稱號卡「傳說中的勇者」浮現' },
      { id: 'H2-C7', t0: 82.618, t1: 89.5, what: '最後和弦：公園全景，主角站在光柱中；約 87 秒出現「點一下繼續」' }
    ]
  };

  // 效能門檻（K16）
  var PERF = { warm: 1, win: 3, degradeMs: 50, skipMs: 100, maxSlowMs: 500 };

  // 五盞燈（科目顏色同 opening.js）
  var LAMP_RGB = [[255, 104, 104], [92, 172, 255], [255, 214, 64], [100, 216, 116], [255, 160, 72]];
  var LAMP_CSS = ['#ff6868', '#5cacff', '#ffd640', '#64d874', '#ffa048'];
  var DAWN_CSS = '#ffe6a0';

  // V08 黑面琵鷺（MV_小修疊層_座標表.json V08_黑面琵鷺；dx 原圖 px、y 邏輯座標、相位）
  var BIRD = { fw: 24, fh: 13, scale: 2 * 5 / 6, flapSec: 0.12, bobSec: 1.6, bobPx: 4 * 5 / 6,
    flock: [[0, 208.3, 0], [-46, 193.3, 1], [-40, 226.7, 2], [-94, 183.3, 1], [-88, 243.3, 0], [-150, 201.7, 2], [-142, 260.0, 1]] };
  var FLAP = [0, 1, 2, 1];

  // V13 星軌：旋轉中心＝北極星（原圖 768,645 → 邏輯 640,470.8）；起點＝A5 星點清單最亮 240 顆（tools/mv/mv_v13_stars.json），[x, y, 亮度]
  var STAR_C = [640, 470.8];
  var STARS = [1134.2,1.7,254,1175.8,68.6,254,985.8,70.8,254,1002.5,97.5,254,198.3,199.2,254,175.8,295.8,254,951.7,-54.2,253,346.7,-52.5,253,1056.7,-50.8,253,367.5,-31.7,253,687.6,-15.3,253,1180.8,-8.3,253,61.8,-6.3,253,104.9,4.1,253,831.7,33.5,253,335,54.2,253,490.8,60,253,1098.3,65.5,253,16.7,65.8,253,940.9,82.4,253,16.1,174.9,253,399.2,184.2,253,549.1,193.4,253,32.5,242.8,253,1078.3,273.2,253,1070.1,-25.1,252,489.3,11.6,252,670.9,19.2,252,305.8,30.2,252,375,103.3,252,595.2,106.2,252,1060.8,107.5,252,345.8,116.7,252,610.5,123.4,252,165,139.2,252,847.5,196.7,252,1151.8,205.1,252,421.7,205.4,252,80.9,207.6,252,108.8,224.2,252,80.9,270.8,252,1183.3,291.1,252,1164.2,340.1,252,471.7,-50.8,251,419.2,-44.2,251,385.8,70.8,251,895.8,71.1,251,1150.1,139.9,251,442.5,231.1,251,762.6,280.1,251,958.6,325,251,502.4,337.4,251,73.6,-48.3,250,1147.5,-27.3,250,1152.5,33.3,250,764.2,204.2,250,605.8,270.8,250,290.2,322.6,250,236.7,-25.6,249,1026.8,3.8,249,53.3,138.9,249,1250.9,220.8,249,604.2,-25.9,248,113.3,-2.4,248,1206.7,24.4,248,573.8,282.5,248,1109.2,328.7,248,109.2,85.4,247,290.1,260.8,247,378.3,260.8,247,902.9,-48.8,246,1036.8,-2.1,246,1199.8,310.8,246,630.6,106.7,245,918.3,205.4,245,1195.2,275,245,25.9,-30.9,244,503,-13.4,244,34.5,180.9,244,165,-53.8,243,1238.1,-53.7,241,730.1,-33.4,241,108.3,117.1,241,842.1,46.7,239,975.6,160.8,239,523.3,307.2,239,72.5,328.6,239,710.9,-54.1,238,992.5,-6.1,238,439.2,69.4,238,195.4,78.3,238,229.8,78.3,238,1263.3,168.6,238,438.3,309.6,238,1205.6,-29.2,236,880.1,135.9,236,960.6,153.3,235,849.6,227.5,234,36.7,25.2,233,507.9,192.1,232,670,270.4,232,38.4,-54.2,231,765.1,107.6,230,1089.6,139.6,230,867.6,-25.1,229,257.9,173.3,229,1113.9,200,229,330.8,343.8,229,906.2,105.8,228,1021.3,464,228,584.6,18.3,227,927.2,248.5,227,347.1,302.9,227,1110.8,41.2,226,143.6,60.8,226,1037.7,-10.5,225,1210.6,212.5,225,797.5,279.4,225,126.8,42.3,223,113.9,311.7,223,250,105.4,222,240,286.4,222,252.5,333.8,222,815,4.4,221,949.2,9.1,221,156.6,22.9,221,1118.8,163.8,221,671.7,352.1,221,220.4,51.2,220,301.1,-16.7,219,795.1,47.4,219,79.8,111.5,219,1063.6,142.5,217,871.1,191.7,216,180,170.4,214,401.5,369,213,213.3,3.9,212,1194.2,207.8,212,622.9,175.8,210,282.7,375.2,209,236.8,480.3,209,1034.2,69.6,208,1130.8,-54.4,204,1195,95.4,204,230.8,163.8,204,1171,1.8,198,763.3,-2.9,197,522.9,149.2,196,130.8,-43.9,195,1169.8,-16.5,195,1027.9,224.6,195,860,324.8,195,1141.7,69.6,194,683.3,252.1,194,275.4,272.5,194,1030,122.9,193,226.2,396.5,192,794.2,431.7,192,1116.1,105,189,703.3,267.1,187,1248.3,-25.6,186,170.4,4.2,186,704.1,14.1,186,426.2,151.7,186,555,-54.6,185,135.4,15.4,185,1262.1,325.4,185,927.5,402.5,185,140.5,39.8,181,224.8,64,181,268.3,131.4,181,254.8,259.8,180,715.7,352,180,178.3,100.4,179,312.5,447.9,179,299.4,101.7,178,182,44.3,177,23,220.7,177,157.9,351.2,176,738.8,174.2,174,790,472.1,173,553.4,8.4,172,403.4,16.6,172,550.4,252.1,172,1232.5,1.2,171,391.7,383.8,171,1185.4,473.3,170,740,53.8,168,804.2,178.8,168,562.9,451.2,168,847.8,-50.8,167,398.5,76.2,167,273.3,71.2,166,327.8,-13.3,165,1025,199.6,165,33.5,356.5,165,163.2,33,164,815,259.6,164,561.2,520.4,162,95.5,253.5,161,1232.8,257.5,161,658.1,71.7,160,932.5,-43.8,159,1085,14.6,159,1174.8,-51.7,158,298.2,251.7,158,1041.7,297.9,158,68.8,35.4,157,686.8,303,155,101.7,347.9,155,172.1,447.1,155,1040,392.9,154,81.7,397.9,154,258.5,411.7,154,1071.7,447.1,154,746.7,460.4,154,210.8,70.8,153,596.7,355.8,153,464.2,282.9,152,279.4,21.7,151,25.8,178.2,151,1219.2,306.1,151,504.6,484.6,150,258.3,-46.2,149,121.2,190,148,830.2,292.3,147,965,-20.4,146,868.8,32.9,145,32.7,92,145,720.7,424.5,145,492,171,144,1003.3,375.8,144,226.7,-12.1,143,136.2,191.2,143,1048.8,496.7,143,985.8,-47.1,141,536.6,153.9,141,656.7,207.8,140,464.2,428.3,140,793.3,123.8,139];

  // ====================================================================== 小工具（純函式）
  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }
  function lerp(a, b, u) { return a + (b - a) * u; }
  function sstep(a, b, x) { x = clamp((x - a) / (b - a), 0, 1); return x * x * (3 - 2 * x); }
  function fract(x) { return x - Math.floor(x); }
  function rng(seed) {   // mulberry32（同 opening.js）：固定種子，每次產生一樣的結果
    var s = seed >>> 0;
    return function () {
      s = (s + 0x6D2B79F5) >>> 0;
      var t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  var ANCHORS = { center: [0.5, 0.5], bottom: [0.5, 1], top: [0.5, 0] };
  function anchorOf(a) { return typeof a === 'string' ? ANCHORS[a] : (a || ANCHORS.center); }

  /** 這個秒數在第幾鏡（t0 ≤ t < t1；超過結尾算最後一鏡） */
  function sceneIndexAt(t) {
    if (t < 0) return 0;
    for (var i = 0; i < SCENES.length; i++) if (t < SCENES[i].t1) return i;
    return SCENES.length - 1;
  }
  function sceneById(id) { for (var i = 0; i < SCENES.length; i++) if (SCENES[i].id === id) return SCENES[i]; return null; }

  /**
   * 這一格要畫哪幾鏡：out.a 全畫、out.b（-1＝沒有）以 out.mix 疊上去。
   * 一般版：cut＝fade 的換鏡點前後各 0.25 秒交叉淡換；hard 硬切。減少動態版：每個換鏡點起 0.5 秒淡換（新鏡從換鏡點那一拍開始出現）。
   */
  function compose(t, reduced, out) {
    out = out || { a: 0, b: -1, mix: 0 };
    var i = sceneIndexAt(t), s = SCENES[i];
    out.a = i; out.b = -1; out.mix = 0;
    if (reduced) {
      if (i > 0 && t < s.t0 + 0.5) { out.a = i - 1; out.b = i; out.mix = clamp((t - s.t0) / 0.5, 0, 1); }
      return out;
    }
    if (i > 0 && s.cut === 'fade' && t < s.t0 + 0.25) { out.a = i - 1; out.b = i; out.mix = clamp((t - s.t0 + 0.25) / 0.5, 0, 1); return out; }
    var n = SCENES[i + 1];
    if (n && n.cut === 'fade' && t >= s.t1 - 0.25) { out.a = i; out.b = i + 1; out.mix = clamp((t - s.t1 + 0.25) / 0.5, 0, 1); }
    return out;
  }

  /** 鏡頭運鏡：底圖畫在 (dx, dy)、放大 s 倍。減少動態版一律 s＝1、不動 */
  function viewOf(scene, t, reduced, out) {
    out = out || { s: 1, dx: 0, dy: 0 };
    out.s = 1; out.dx = 0; out.dy = 0;
    var z = scene.zoom;
    if (reduced || !z) return out;
    var tEnd = z.until ? Math.min(z.until, scene.t1) : scene.t1;
    var u = sstep(scene.t0, tEnd, t);
    var s = lerp(z.from === undefined ? 1 : z.from, z.to === undefined ? 1 : z.to, u);
    var a0 = anchorOf(z.anchor), a1 = z.anchorTo ? anchorOf(z.anchorTo) : a0;
    var ax = lerp(a0[0], a1[0], u), ay = lerp(a0[1], a1[1], u);
    if (z.bob) ay = clamp(ay + Math.sin((t - scene.t0) * 2 * Math.PI / z.bob.period) * z.bob.amp / Math.max(0.001, s - 1), 0, 1);
    out.s = s; out.dx = ax * W * (1 - s); out.dy = ay * H * (1 - s);
    return out;
  }

  /** 字卡（含片名）的不透明度：淡入淡出各 fade 秒 */
  function cardAlpha(card, t) {
    var f = card.fade || CARD_FADE;
    if (t <= card.start || t >= card.end) return 0;
    return Math.min(1, (t - card.start) / f, (card.end - t) / f);
  }

  /** 要讀的圖（相對 docs/）。opts.female＝true 時 V17 用 E5 女生版 */
  function sceneFiles(scene, opts) {
    opts = opts || {};
    var list = scene.files ? scene.files.slice() : (scene.file ? [scene.file] : []);
    if (scene.fileFemale && opts.female) list = [scene.fileFemale];
    return list;
  }
  function fileUrl(name) { return BASE + name; }
  /** 全部必要的圖（測試、預載用） */
  function allFiles(opts) {
    var seen = {}, out = [];
    SCENES.forEach(function (s) { sceneFiles(s, opts).forEach(function (f) { if (!seen[f]) { seen[f] = 1; out.push(f); } }); });
    return out;
  }
  // 選用的小圖（讀不到就不畫那個疊層，不會跳過 MV）
  var SPRITES = {
    boss_mb_floodgate: 'assets/monsters/boss_mb_floodgate.png', boss_mb_lantern: 'assets/monsters/boss_mb_lantern.png',
    boss_fog: 'assets/monsters/boss_fog.png', boss_wxb_whale: 'assets/monsters/boss_wxb_whale.png',
    npc_fog_kid: 'assets/npcs/npc_fog_kid.png', pet: 'assets/chars/pet_imo.png', spoonbill: BASE + 'mv_spoonbill.webp'
  };

  /** 讀圖範圍：播到第 n 鏡時要讀 n、n+1、n+2；n−2 以前的可以放掉 */
  function loadWindow(n) { return { need: [n, n + 1, n + 2].filter(function (i) { return i < SCENES.length; }), dropBelow: n - 1 }; }

  /** 網址參數 ?mvslow=80 → 80（每格多卡幾毫秒；0–500） */
  function parseSlow(search) {
    var m = /[?&]mvslow=(\d+)/.exec(String(search || ''));
    return m ? Math.min(PERF.maxSlowMs, parseInt(m[1], 10) || 0) : 0;
  }

  /**
   * 自動降級的判斷（K16）。frame(秒, 這一格毫秒) 回傳 0＝照常、1＝切成減少動態版、2＝跳過 MV。
   * 一般版：開播 warm 秒以後才開始量；量滿 win 秒（含這一格）、最近 win 秒平均每格 > degradeMs → 1。
   * 減少動態版（降級後，或一開始就是）：從切換那一刻重新量；量滿 win 秒、平均 > skipMs → 2。
   */
  function createGuard(cfg) {
    cfg = cfg || {};
    var warm = cfg.warm === undefined ? PERF.warm : cfg.warm, win = cfg.win || PERF.win;
    var degradeMs = cfg.degradeMs || PERF.degradeMs, skipMs = cfg.skipMs || PERF.skipMs;
    var CAP = 1024, ts = new Float64Array(CAP), ms = new Float64Array(CAP), head = 0, len = 0, sum = 0;
    var g = { phase: cfg.reduced ? 'reduced' : 'normal', since: 0, decidedAt: -1 };
    function clear() { head = 0; len = 0; sum = 0; }
    g.reset = function (now, withWarm) { clear(); g.since = now + (withWarm === false ? 0 : warm); };
    g.frame = function (now, dtMs) {
      if (g.phase === 'done' || now < g.since) return 0;
      if (len === CAP) { sum -= ms[head]; head = (head + 1) % CAP; len--; }
      var k = (head + len) % CAP; ts[k] = now; ms[k] = dtMs; len++; sum += dtMs;
      while (len && ts[head] <= now - win) { sum -= ms[head]; head = (head + 1) % CAP; len--; }
      // 量滿 win 秒才判斷；「這一格結束後就滿」也算（差不到 1 格），所以 ?mvslow=80（每格約 83 ms）在 3.92 秒切換，符合「4 秒內」
      if (now + dtMs / 1000 - g.since < win - 1e-9 || !len) return 0;
      var avg = sum / len;
      if (g.phase === 'normal' && avg > degradeMs) { g.phase = 'reduced'; g.decidedAt = now; g.reset(now, false); return 1; }
      if (g.phase === 'reduced' && avg > skipMs) { g.phase = 'done'; g.decidedAt = now; return 2; }
      return 0;
    };
    g.avg = function () { return len ? sum / len : 0; };
    g.reset(0, true);
    return g;
  }

  /** 勇者特別版：片尾曲 t 秒在哪一段 */
  function heroSpecialAt(t) {
    var S = HERO_SPECIAL.segments;
    for (var i = 0; i < S.length; i++) if (t >= S[i].t0 && t < S[i].t1) return S[i];
    return null;
  }

  /** 減少動態效果：家長設定 settings.reduceMotion（'on'／'off'／'auto'＝跟系統），同 skillfx.js */
  function systemReduced() {
    var st = J.Game && J.Game.state, v = st && st.settings && st.settings.reduceMotion;
    if (v === 'on') return true;
    if (v === 'off') return false;
    try { return !!(root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) { return false; }
  }

  function textOf(id) {
    var s = null, D = root.DIALOGS;
    if (D && D[id] && D[id][0] && D[id][0].text) s = D[id][0].text;
    return s || FALLBACK_TEXT[id] || '';
  }

  // ====================================================================== 播放（瀏覽器版；env 可換成假的給測試用）
  var cur = null;
  var stats = { plays: 0, ends: 0, skips: 0, lastT: 0, mode: null, degradedAt: null, skipReason: null, frames: 0, cardsShown: {} };
  // 每一格重複使用的暫存物件（不在每一格建立新物件）
  var CMP = { a: 0, b: -1, mix: 0 }, VIEW = { s: 1, dx: 0, dy: 0 };

  function defaultEnv() {
    var perf = root.performance;
    return {
      now: function () { return perf && perf.now ? perf.now() : Date.now(); },
      raf: function (cb) { return root.requestAnimationFrame(cb); },
      caf: function (id) { root.cancelAnimationFrame(id); },
      createCanvas: function (w, h) { var c = root.document.createElement('canvas'); c.width = Math.max(1, Math.round(w)); c.height = Math.max(1, Math.round(h)); return c; },
      resolve: function (path) { return J.Assets && J.Assets.resolveUrl ? J.Assets.resolveUrl(path) : path; },
      loadImage: function (url, ok, fail) { var img = new root.Image(); img.onload = function () { ok(img); }; img.onerror = function () { fail(); }; img.src = url; },
      busyWait: function (ms) { var end = this.now() + ms; while (this.now() < end) { /* ?mvslow 測試：故意卡住 */ } },
      search: function () { try { return root.location ? root.location.search : ''; } catch (e) { return ''; } },
      mount: null
    };
  }

  /** 讀一張圖：狀態 0 沒讀、1 讀取中、2 好了、3 讀不到 */
  function requestImage(c, name, url, required) {
    var e = c.imgs[name];
    if (e && (e.st === 1 || e.st === 2)) return e;
    if (!e) e = c.imgs[name] = { st: 0, img: null, req: required };
    var real = c.env.resolve(url);
    if (!real) { e.st = 3; if (required) c.failed = name; return e; }
    e.st = 1;
    var gen = c;
    c.env.loadImage(real, function (img) { if (cur !== gen) return; e.st = 2; e.img = img; c.onImage(name); },
      function () { if (cur !== gen) return; e.st = 3; if (e.req) c.failed = name; c.onImage(name); });
    return e;
  }
  function imgReady(name) { var e = cur && cur.imgs[name]; return e && e.st === 2 ? e.img : null; }

  function ensureWindow(c, n) {
    var w = loadWindow(n), i, j, f;
    for (i = 0; i < w.need.length; i++) {
      f = sceneFiles(SCENES[w.need[i]], c.opts);
      for (j = 0; j < f.length; j++) requestImage(c, f[j], fileUrl(f[j]), true);
    }
    // 放掉 n−2 以前的圖（後面的鏡頭沒有再用到才放）
    for (i = 0; i < w.dropBelow && i < SCENES.length; i++) {
      f = sceneFiles(SCENES[i], c.opts);
      for (j = 0; j < f.length; j++) { var e = c.imgs[f[j]]; if (e && e.st === 2) { e.img = null; e.st = 0; } }
    }
  }

  // ---------------------------------------------------------------- 開播前建好的圖層（每次播放建一次）
  function buildStatic(c) {
    var env = c.env, R = rng(20261109), i, g;
    // 雜訊表與各鏡的點（水面閃光、城市燈、氣泡）
    c.pts = {};
    SCENES.forEach(function (s, si) {
      (s.fx || []).forEach(function (fx, fi) {
        var key = si + ':' + fi, n = fx.n || 0, a;
        if (fx.kind === 'sparkle' || fx.kind === 'city') {
          a = new Float32Array(n * 3);
          for (i = 0; i < n; i++) { a[i * 3] = lerp(fx.x0, fx.x1, R()); a[i * 3 + 1] = lerp(fx.y0, fx.y1, R()); a[i * 3 + 2] = R(); }
          c.pts[key] = a;
        } else if (fx.kind === 'bubbles') {
          a = new Float32Array(n * 3);
          for (i = 0; i < n; i++) { a[i * 3] = lerp(80, 1200, R()); a[i * 3 + 1] = R(); a[i * 3 + 2] = lerp(18, 46, R()); }
          c.pts[key] = a;
        }
      });
    });
    // 星軌：半徑、起始角、亮度分 3 組
    var n = STARS.length / 3; c.star = new Float32Array(n * 3);
    for (i = 0; i < n; i++) {
      var dx = STARS[i * 3] - STAR_C[0], dy = STARS[i * 3 + 1] - STAR_C[1];
      c.star[i * 3] = Math.sqrt(dx * dx + dy * dy); c.star[i * 3 + 1] = Math.atan2(dy, dx); c.star[i * 3 + 2] = STARS[i * 3 + 2] >= 253 ? 0 : STARS[i * 3 + 2] >= 251 ? 1 : 2;
    }
    // 霧（柔邊白色橢圓），1280×160
    c.mist = env.createCanvas(W, 160); g = c.mist.getContext('2d');
    for (i = 0; i < 14; i++) {
      var mx = R() * W, my = 50 + R() * 60, mr = 90 + R() * 120, gr = g.createRadialGradient(mx, my, 0, mx, my, mr);
      gr.addColorStop(0, 'rgba(255,255,255,0.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gr; g.fillRect(0, 0, W, 160);
      g.fillRect(mx > W / 2 ? -W : W, 0, W, 160);   // 左右接得起來
    }
    // 光束（上亮下淡的長條），160×760
    c.beam = env.createCanvas(160, 760); g = c.beam.getContext('2d');
    var lg = g.createLinearGradient(0, 0, 0, 760); lg.addColorStop(0, 'rgba(255,255,240,1)'); lg.addColorStop(1, 'rgba(255,255,240,0)');
    g.fillStyle = lg; g.beginPath(); g.moveTo(60, 0); g.lineTo(100, 0); g.lineTo(160, 760); g.lineTo(0, 760); g.closePath(); g.fill();
    // 日出光芒（12 道），900×900
    c.rays = env.createCanvas(900, 900); g = c.rays.getContext('2d');
    var rg = g.createRadialGradient(450, 450, 0, 450, 450, 450); rg.addColorStop(0, 'rgba(255,236,180,1)'); rg.addColorStop(1, 'rgba(255,236,180,0)');
    g.fillStyle = rg;
    for (i = 0; i < 12; i++) { var a0 = i * Math.PI / 6, a1 = a0 + 0.12; g.beginPath(); g.moveTo(450, 450); g.arc(450, 450, 450, a0, a1); g.closePath(); g.fill(); }
    // 柔光點（白、紫霧、各燈色）
    function glow(css, r) {
      var cv = env.createCanvas(r * 2, r * 2), gg = cv.getContext('2d'), q = gg.createRadialGradient(r, r, 0, r, r, r);
      q.addColorStop(0, css); q.addColorStop(1, 'rgba(0,0,0,0)'); gg.fillStyle = q; gg.fillRect(0, 0, r * 2, r * 2); return cv;
    }
    c.glowWhite = glow('rgba(255,255,255,0.9)', 64);
    c.haze = glow('rgba(150,110,200,0.8)', 128);
    c.lampGlow = LAMP_RGB.map(function (rgb) { return glow('rgba(' + rgb.join(',') + ',0.85)', 70); });
    c.dawnGlow = glow('rgba(255,230,160,0.8)', 70);
    // 讀不到圖時的底（淡藍漸層）
    c.fallback = env.createCanvas(W, H); g = c.fallback.getContext('2d');
    var fg = g.createLinearGradient(0, 0, 0, H); fg.addColorStop(0, '#9fc4e8'); fg.addColorStop(1, '#dbeaf6'); g.fillStyle = fg; g.fillRect(0, 0, W, H);
    // V14 夜晚的海風公園（程式畫）
    c.night = env.createCanvas(W, H + 60); g = c.night.getContext('2d');
    var ng = g.createLinearGradient(0, 0, 0, H + 60); ng.addColorStop(0, '#0e1434'); ng.addColorStop(0.62, '#22305e'); ng.addColorStop(0.7, '#1a3c60'); ng.addColorStop(1, '#1e3a2e');
    g.fillStyle = ng; g.fillRect(0, 0, W, H + 60);
    g.fillStyle = '#16305a'; g.fillRect(0, 452, W, 40);                 // 海
    g.fillStyle = '#1f3a30'; g.fillRect(0, 492, W, H + 60 - 492);      // 公園草地
    g.fillStyle = '#ffffff';
    for (i = 0; i < 90; i++) { g.globalAlpha = 0.25 + R() * 0.5; g.fillRect(Math.floor(R() * W), Math.floor(R() * 420), 2, 2); }
    g.globalAlpha = 1;
    // 字卡（含片名）預先畫好
    c.cards = CARDS.map(function (cd) { return makeCard(env, textOf(cd.id), CARD_SIZE1080 * K1080); });
    c.title = makeCard(env, TITLE.text, TITLE.size1080 * K1080);
  }

  function makeCard(env, text, size) {
    var probe = env.createCanvas(4, 4).getContext('2d');
    var font = 'bold ' + Math.round(size * RS) + 'px ' + FONT;
    probe.font = font;
    var tw = probe.measureText(text).width || text.length * size * RS;
    var pad = Math.ceil(size * RS * 0.35);
    var cv = env.createCanvas(tw + pad * 2, size * RS * 1.5 + pad), g = cv.getContext('2d');
    g.font = font; g.textAlign = 'center'; g.textBaseline = 'middle';
    var cx = cv.width / 2, cy = cv.height / 2;
    g.shadowColor = 'rgba(0,0,0,0.55)'; g.shadowBlur = size * RS * 0.18; g.shadowOffsetY = size * RS * 0.05;
    g.lineJoin = 'round'; g.lineWidth = size * RS * 0.16; g.strokeStyle = '#3a2614'; g.strokeText(text, cx, cy);
    g.shadowColor = 'rgba(0,0,0,0)'; g.fillStyle = '#ffffff'; g.fillText(text, cx, cy);
    return { cv: cv, w: cv.width / RS, h: cv.height / RS, text: text };
  }

  // 把走路圖的某一格做成剪影（黑影＋右緣暖色光），開播前做一次
  function silhouette(env, sp, row, col, scale) {
    var img = sp.img, fw = img.width / sp.cols, fh = img.height / sp.rows, w = Math.round(fw * scale), h = Math.round(fh * scale);
    var cv = env.createCanvas(w + 4, h + 2), g = cv.getContext('2d'), tmp = env.createCanvas(w, h), t = tmp.getContext('2d');
    t.imageSmoothingEnabled = false; t.drawImage(img, col * fw, row * fh, fw, fh, 0, 0, w, h);
    t.globalCompositeOperation = 'source-in';
    t.fillStyle = '#ffb860'; t.fillRect(0, 0, w, h);
    g.drawImage(tmp, 3, 0);                           // 暖色邊（右邊多 3 px）
    t.fillStyle = '#0c0a10'; t.fillRect(0, 0, w, h);
    g.drawImage(tmp, 0, 0);
    return { cv: cv, w: cv.width, h: cv.height };
  }
  // 整張圖的白色剪影（頭目清醒變白光用）
  function whiteOf(env, img) {
    var cv = env.createCanvas(img.width, img.height), g = cv.getContext('2d');
    g.drawImage(img, 0, 0); g.globalCompositeOperation = 'source-in'; g.fillStyle = '#ffffff'; g.fillRect(0, 0, img.width, img.height);
    return cv;
  }

  function normSprite(o, defCols, defRows) {
    if (!o) return null;
    if (typeof o === 'string') o = { src: o };
    return { img: o.img || null, src: o.src || null, cols: o.cols || defCols, rows: o.rows || defRows,
      rowLeft: o.rowLeft === undefined ? 1 : o.rowLeft, rowUp: o.rowUp === undefined ? 3 : o.rowUp };
  }

  // ---------------------------------------------------------------- 畫一格
  function frame(c, t) {
    var g = c.ctx, k = c.k, red = c.reduced;
    g.setTransform(k, 0, 0, k, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
    compose(t, red, CMP);
    var a = CMP.a, b = CMP.b, mix = CMP.mix;
    drawLayer(c, a, t, 1);
    if (b >= 0 && mix > 0) drawLayer(c, b, t, mix);
    g.setTransform(k, 0, 0, k, 0, 0);
    var wd = red ? SONG.whiteInReduced : SONG.whiteIn;
    if (t < wd) { g.globalAlpha = 1 - t / wd; g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, H); }
    drawCards(c, t);
    if (t > SONG.fadeOut[0]) { g.globalAlpha = clamp((t - SONG.fadeOut[0]) / (SONG.fadeOut[1] - SONG.fadeOut[0]), 0, 1); g.fillStyle = '#000000'; g.fillRect(0, 0, W, H); }
    g.globalAlpha = 1;
  }

  function drawLayer(c, i, t, la) {
    var g = c.ctx, k = c.k, s = SCENES[i], red = c.reduced;
    if (s.draw === 'lamps') { drawLamps(c, s, t, la); return; }
    var name = !red && s.fileFx ? s.fileFx : (s.fileFemale && c.opts.female ? s.fileFemale : s.file);
    var img = imgReady(name);
    viewOf(s, t, red, VIEW);
    g.globalAlpha = la;
    g.setTransform(k * VIEW.s, 0, 0, k * VIEW.s, k * VIEW.dx, k * VIEW.dy);
    g.imageSmoothingEnabled = !(s.crop === null);    // 結局插圖是像素畫：不要糊；GPT 圖平滑縮放
    g.drawImage(img || c.fallback, 0, 0, W, H);
    g.imageSmoothingEnabled = true;
    var fx = s.fx, j;
    if (!red) for (j = 0; j < fx.length; j++) drawFx(c, s, i, j, fx[j], t, la);
    if (s.still) for (j = 0; j < s.still.length; j++) drawStill(c, s, s.still[j], t, la, red);
  }

  function drawFx(c, s, si, fi, fx, t, la) {
    var g = c.ctx, k = c.k, i, n, p, a;
    var vs = VIEW.s, vx = VIEW.dx, vy = VIEW.dy;   // 跟著底圖一起推近、平移
    g.setTransform(k * vs, 0, 0, k * vs, k * vx, k * vy);
    switch (fx.kind) {
      case 'mist':
        var off = -((t * fx.speed) % W);
        g.globalAlpha = la * fx.alpha;
        g.drawImage(c.mist, off, fx.y, W, fx.h); g.drawImage(c.mist, off + W, fx.y, W, fx.h);
        break;
      case 'sparkle':   // FX9 水面閃光：每點亮 ≥0.4 秒，不是閃光
        p = c.pts[si + ':' + fi]; n = fx.n; g.fillStyle = '#ffffff';
        for (i = 0; i < n; i++) {
          a = Math.sin(fract(t / fx.period + p[i * 3 + 2]) * 2 * Math.PI);
          if (a <= 0) continue;
          g.globalAlpha = la * a * 0.8; g.fillRect(p[i * 3] - 1.5, p[i * 3 + 1] - 1.5, 3, 3);
          g.globalAlpha = la * a * 0.35; g.fillRect(p[i * 3] - 4, p[i * 3 + 1] - 0.5, 8, 1);
        }
        break;
      case 'city':      // FX12 城市燈一盞盞亮
        p = c.pts[si + ':' + fi]; n = fx.n;
        for (i = 0; i < n; i++) {
          var on = fx.t0 + (fx.t1 - fx.t0) * (i / n);
          if (t < on) continue;
          a = la * sstep(on, on + 0.3, t);
          g.globalAlpha = a * 0.3; g.fillStyle = '#ffcf6a'; g.fillRect(p[i * 3] - 3, p[i * 3 + 1] - 3, 6, 6);
          g.globalAlpha = a * 0.95; g.fillStyle = '#fff1b8'; g.fillRect(p[i * 3] - 1, p[i * 3 + 1] - 1, 2, 2);
        }
        break;
      case 'wake': drawWake(c, s, fx, t, la); break;
      case 'birds': drawBirds(c, s, fx, t, la); break;
      case 'beams':     // 水下／峽谷光束：亮度 ≤22%
        for (i = 0; i < fx.xs.length; i++) {
          var ang = fx.angle + Math.sin(t * 0.8 + i * 1.7) * 0.04, cs = Math.cos(ang), sn = Math.sin(ang);
          g.setTransform(k * vs * cs, k * vs * sn, -k * vs * sn, k * vs * cs, k * (vx + vs * fx.xs[i]), k * (vy - vs * 20));
          g.globalAlpha = la * fx.alpha * (0.75 + 0.25 * Math.sin(t * 1.3 + i)); g.drawImage(c.beam, -80, 0);
        }
        break;
      case 'bubbles':
        p = c.pts[si + ':' + fi]; n = fx.n; g.fillStyle = '#dff6ff';
        for (i = 0; i < n; i++) {
          var by = 740 - fract(t / 9 + p[i * 3 + 1]) * 780, bx = p[i * 3] + Math.sin(t * 2 + i) * 6, br = p[i * 3 + 2] / 12;
          g.globalAlpha = la * 0.55; g.fillRect(bx - br, by - br, br * 2, br * 2);
        }
        break;
      case 'stars': drawStars(c, s, fx, t, la); break;
      case 'rays':      // FX7 日出光芒（慢慢轉、慢慢擴大）
        var u = sstep(s.t0, s.t1, t), sc = lerp(0.8, 1.25, u), r = t * 0.05, rc = Math.cos(r) * sc, rs = Math.sin(r) * sc;
        g.setTransform(k * vs * rc, k * vs * rs, -k * vs * rs, k * vs * rc, k * (vx + vs * fx.x), k * (vy + vs * fx.y));
        g.globalAlpha = la * fx.alpha * sstep(s.t0, s.t0 + 1.2, t); g.drawImage(c.rays, -450, -450);
        break;
    }
    g.globalAlpha = 1;
  }

  // FX3′ 頭目清醒（2.8 秒）：0–0.8 紫霧淡掉 → 0.8–1.8 變白色柔光 → 1.8–2.8 往上飄、縮成光點
  function drawWake(c, s, fx, t, la) {
    var g = c.ctx, k = c.k, img = c.spr[fx.sprite], wh = c.white[fx.sprite];
    var u = t - fx.t, sz = fx.size;
    g.setTransform(k, 0, 0, k, 0, 0);
    if (img && u < 2.8) {
      var sc = sz / Math.max(img.width, img.height), w = img.width * sc, h = img.height * sc, x = fx.x, y = fx.y + Math.sin(t * 2) * 4;
      if (u < 0) {
        g.globalAlpha = la * 0.7; g.drawImage(c.haze, x - sz, y - sz, sz * 2, sz * 2);
        g.globalAlpha = la; g.drawImage(img, x - w / 2, y - h / 2, w, h);
      } else if (u < 0.8) {
        g.globalAlpha = la * 0.7 * (1 - u / 0.8); g.drawImage(c.haze, x - sz, y - sz, sz * 2, sz * 2);
        g.globalAlpha = la; g.drawImage(img, x - w / 2, y - h / 2, w, h);
      } else if (u < 1.8) {
        g.globalAlpha = la; g.drawImage(img, x - w / 2, y - h / 2, w, h);
        g.globalAlpha = la * 0.9 * (u - 0.8); g.drawImage(wh, x - w / 2, y - h / 2, w, h);
        g.globalAlpha = la * 0.18 * (u - 0.8); g.drawImage(c.glowWhite, x - sz * 0.8, y - sz * 0.8, sz * 1.6, sz * 1.6);
      } else {
        var v = u - 1.8, q = lerp(1, 0.12, v), yy = y - 120 * v;
        g.globalAlpha = la * 0.9 * (1 - v * 0.4); g.drawImage(wh, x - w * q / 2, yy - h * q / 2, w * q, h * q);
        g.globalAlpha = la * 0.22; g.drawImage(c.glowWhite, x - 24, yy - 24, 48, 48);
      }
    }
    var af = fx.after;
    if (af && u >= 2.8 && u < 2.8 + af.dur) {
      var kid = c.spr[af.sprite];
      if (kid) {
        var p = (u - 2.8) / af.dur, kx = lerp(fx.x, af.x1, p), ky = lerp(fx.y, af.y1, p);
        g.imageSmoothingEnabled = false; g.globalAlpha = la;
        g.drawImage(kid, kx - kid.width * af.scale / 2, ky - kid.height * af.scale / 2, kid.width * af.scale, kid.height * af.scale);
        g.imageSmoothingEnabled = true;
      }
    }
  }

  // V08 黑面琵鷺（A5 座標表；跟底圖一起縮放）
  function drawBirds(c, s, fx, t, la) {
    var g = c.ctx, img = c.spr.spoonbill;
    if (!img || t < fx.t) return;
    var lead = fx.lead + fx.speed * (t - fx.t), F = BIRD.flock, dw = BIRD.fw * BIRD.scale, dh = BIRD.fh * BIRD.scale;
    g.imageSmoothingEnabled = false; g.globalAlpha = la;
    for (var i = 0; i < F.length; i++) {
      var x = lead + F[i][0] * 5 / 6;
      if (x < -dw || x > W) continue;
      var f = FLAP[(Math.floor((t - fx.t) / BIRD.flapSec) + F[i][2]) % 4];
      var y = F[i][1] + Math.sin((t - fx.t) * 2 * Math.PI / BIRD.bobSec + i) * BIRD.bobPx;
      g.drawImage(img, f * BIRD.fw, 0, BIRD.fw, BIRD.fh, x, y, dw, dh);
    }
    g.imageSmoothingEnabled = true;
  }
  /** 鳥群最後一隻飛出右緣的秒數（測試：要在 V08 結束前） */
  function birdsExitAt() {
    var s = sceneById('V08'), fx = null;
    s.fx.forEach(function (f) { if (f.kind === 'birds') fx = f; });
    var minDx = 0; BIRD.flock.forEach(function (b) { minDx = Math.min(minDx, b[0] * 5 / 6); });
    return fx.t + (W - minDx - fx.lead) / fx.speed;
  }

  // FX11 星軌：繞北極星逆時針轉（往北看），拖尾越來越長；前景山稜最後蓋上
  function drawStars(c, s, fx, t, la) {
    var g = c.ctx, e = t - s.t0, sweep = fx.omega * e, n = c.star.length / 3, band, i;
    var fade = sstep(0, 0.4, e);
    g.lineWidth = 1.3; g.strokeStyle = '#eef3ff'; g.fillStyle = '#ffffff';
    for (band = 0; band < 3; band++) {
      g.globalAlpha = la * fade * (band === 0 ? 0.95 : band === 1 ? 0.7 : 0.45);
      g.beginPath();
      for (i = 0; i < n; i++) {
        if (c.star[i * 3 + 2] !== band) continue;
        var r = c.star[i * 3], a0 = c.star[i * 3 + 1];
        g.moveTo(STAR_C[0] + r * Math.cos(a0), STAR_C[1] + r * Math.sin(a0));
        g.arc(STAR_C[0], STAR_C[1], r, a0, a0 + sweep, sweep < 0);
      }
      g.stroke();
    }
    g.globalAlpha = la; g.fillRect(STAR_C[0] - 1.5, STAR_C[1] - 1.5, 3, 3);   // 北極星
    var fgImg = imgReady(fx.fg);
    if (fgImg) g.drawImage(fgImg, 0, 0, W, H);
  }

  // V14 金包里海風公園（夜）：吊臂上升＋五盞燈每 0.5 秒亮一盞＋第六座燈座微光（減少動態：五盞直接亮著）
  function drawLamps(c, s, t, la) {
    var g = c.ctx, k = c.k, red = c.reduced, u = red ? 1 : sstep(s.t0, s.t1, t);
    var lift = red ? 30 : lerp(0, 30, u);           // 鏡頭往上升 → 地面往下移
    g.setTransform(k, 0, 0, k, 0, 0); g.globalAlpha = la;
    g.drawImage(c.night, 0, -60 + lift, W, H + 60);
    for (var i = 0; i < 6; i++) {
      var x = 290 + i * 140, base = 610 + lift, top = base - 120;
      g.globalAlpha = la; g.fillStyle = '#2a2a36'; g.fillRect(x - 6, top, 12, 120); g.fillRect(x - 18, base - 8, 36, 10);
      var lit = i < 5 ? (red ? 1 : sstep(s.lamps[i], s.lamps[i] + 0.25, t)) : 0;
      if (i === 5 && !red) lit = 0.35 * Math.max(0, Math.sin(clamp((t - s.dawnGlow[0]) / (s.dawnGlow[1] - s.dawnGlow[0]), 0, 1) * Math.PI));
      g.fillStyle = '#3c3c4a'; g.fillRect(x - 14, top - 26, 28, 28);
      if (lit > 0) {
        g.globalAlpha = la * lit; g.fillStyle = i < 5 ? LAMP_CSS[i] : DAWN_CSS; g.fillRect(x - 11, top - 23, 22, 22);
        g.globalAlpha = la * lit * 0.9; g.drawImage(i < 5 ? c.lampGlow[i] : c.dawnGlow, x - 70, top - 82, 140, 140);
      }
    }
    g.globalAlpha = 1;
  }

  // 減少動態版也畫的靜止物件
  function drawStill(c, s, st, t, la, red) {
    var g = c.ctx, k = c.k;
    g.setTransform(k, 0, 0, k, 0, 0);
    g.imageSmoothingEnabled = false; g.globalAlpha = la;
    if (st.kind === 'hero_walk') {
      var hero = c.hero, pet = c.pet;
      var walking = !red && t >= st.t && st.x0 - st.speed * (t - st.t) > st.x1;
      var x = red ? st.x1 : (t < st.t ? st.x0 : Math.max(st.x1, st.x0 - st.speed * (t - st.t)));
      var col = walking ? FLAP[Math.floor((t - st.t) / 0.2) % 4] : 1;
      if (pet && pet.img) {
        var pw = pet.img.width / pet.cols, ph = pet.img.height / pet.rows;
        g.drawImage(pet.img, col * pw, pet.rowLeft * ph, pw, ph, x + 70, st.feet - ph * st.petScale, pw * st.petScale, ph * st.petScale);
      }
      if (hero && hero.img) {
        var fw = hero.img.width / hero.cols, fh = hero.img.height / hero.rows;
        g.drawImage(hero.img, col * fw, hero.rowLeft * fh, fw, fh, x - fw * st.scale / 2, st.feet - fh * st.scale, fw * st.scale, fh * st.scale);
      }
    } else if (st.kind === 'silhouettes') {
      var S = c.sil;
      if (S.cloud) g.drawImage(S.cloud.cv, st.x - 90, st.feet - 120 - S.cloud.h);
      if (S.hero) g.drawImage(S.hero.cv, st.x - S.hero.w / 2, st.feet - S.hero.h);
      if (S.pet) g.drawImage(S.pet.cv, st.x + 34, st.feet - S.pet.h);
    }
    g.imageSmoothingEnabled = true; g.globalAlpha = 1;
  }

  function drawCards(c, t) {
    var g = c.ctx, k = c.k, a, cd, im, i;
    g.setTransform(k, 0, 0, k, 0, 0);
    a = cardAlpha(TITLE, t);
    if (a > 0) { im = c.title; g.globalAlpha = a; g.drawImage(im.cv, TITLE.x1080 * K1080 - im.w / 2, TITLE.y1080 * K1080 - im.h / 2, im.w, im.h); }
    for (i = 0; i < CARDS.length; i++) {
      cd = CARDS[i]; a = cardAlpha(cd, t);
      if (a <= 0) continue;
      if (stats.cardsShown[cd.id] === undefined) stats.cardsShown[cd.id] = t;
      im = c.cards[i]; g.globalAlpha = a;
      var cx = Math.max(cd.x1080 * K1080, 64 + im.w / 2);   // 不出字幕安全框（左右各 96 px＠1080p＝64 px）
      g.drawImage(im.cv, cx - im.w / 2, cd.y1080 * K1080 - im.h / 2, im.w, im.h);
    }
    g.globalAlpha = 1;
  }

  // ---------------------------------------------------------------- 播放控制
  function songT(c) {
    if (c.clock === 'audio') {
      var au = c.audio;
      if (au && !au.error && !(au.paused && !c.paused && c.started && c.audioStartedAt !== null && c.env.now() - c.audioStartedAt > 1500)) return au.currentTime || 0;
      // 曲子讀不到、或被瀏覽器擋住沒在播 → 改照時鐘，從目前秒數接下去
      var at = au ? (au.currentTime || 0) : 0;
      c.clock = 'wall'; c.t0 = c.env.now() - at * 1000;
    }
    var now = c.paused ? c.pausedAt : c.env.now();
    return Math.max(0, (now - c.t0) / 1000);
  }

  function loop() {
    var c = cur;
    if (!c || c.done) return;
    c.raf = 0;
    if (c.paused) return;
    var now = c.env.now();
    if (c.lastDraw && now - c.lastDraw < FRAME_MIN_MS) { c.raf = c.env.raf(loop); return; }
    var dt = c.lastDraw ? now - c.lastDraw : 0;
    c.lastDraw = now;
    if (c.failed) { finish('image'); return; }
    var t = Math.min(SONG.dur, songT(c));
    stats.lastT = t;
    var n = sceneIndexAt(t);
    if (n !== c.shot) { c.shot = n; ensureWindow(c, n); }
    frame(c, t);
    stats.frames++;
    if (t >= SONG.dur) { finish('end'); return; }
    if (c.slowMs) c.env.busyWait(c.slowMs);
    if (dt > 0) {
      var r = c.guard.frame((now - c.start) / 1000, dt);
      if (r === 1) { c.reduced = true; c.degraded = true; stats.mode = 'reduced'; stats.degradedAt = (now - c.start) / 1000; stats.degradedSongT = t; }
      else if (r === 2) { finish('slow'); return; }
    }
    if (cur === c && !c.done) c.raf = c.env.raf(loop);
  }

  function onVisibility() {
    var c = cur, doc = root.document;
    if (!c || !doc) return;
    if (doc.visibilityState === 'hidden' && !c.paused) {
      c.paused = true; c.pausedAt = c.env.now();
      if (c.audio && c.clock === 'audio') { try { c.audio.pause(); } catch (e) { /* 忽略 */ } }
    } else if (doc.visibilityState === 'visible' && c.paused) {
      var now = c.env.now();
      c.t0 += now - c.pausedAt; c.paused = false; c.lastDraw = 0;
      c.guard.reset((now - c.start) / 1000, true);      // 切回來的第一格很久，不算進效能
      if (c.audio && c.clock === 'audio') { c.audioStartedAt = now; try { var p = c.audio.play(); if (p && p.catch) p.catch(function () {}); } catch (e) { /* 忽略 */ } }
      if (!c.raf) c.raf = c.env.raf(loop);
    }
  }

  function finish(how) {
    var c = cur;
    if (!c || c.done) return;
    c.done = true;
    if (c.loadTimer) { try { (c.env.clearTimeout || root.clearTimeout).call(root, c.loadTimer); } catch (e) { /* 忽略 */ } c.loadTimer = null; }
    if (c.raf) { try { c.env.caf(c.raf); } catch (e) { /* 忽略 */ } }
    cur = null;
    if (root.removeEventListener) { root.removeEventListener('resize', c.layout); root.removeEventListener('orientationchange', c.layout); }
    if (root.document && root.document.removeEventListener) root.document.removeEventListener('visibilitychange', onVisibility);
    if (how !== 'end' && c.audio && c.ownsAudio) { try { c.audio.pause(); } catch (e) { /* 忽略 */ } }
    if (c.handle) { try { c.handle.close(true); } catch (e) { /* 忽略 */ } }
    if (c.unmount) { try { c.unmount(); } catch (e) { /* 忽略 */ } }
    var info = { how: how, t: stats.lastT, mode: c.reduced ? 'reduced' : 'normal', degraded: !!c.degraded, failed: c.failed || null };
    if (how === 'end') { stats.ends++; if (c.opts.onEnd) { try { c.opts.onEnd(info); } catch (e) { if (root.console) root.console.error(e); } } }
    else if (how !== 'stop') {
      stats.skips++; stats.skipReason = how;
      if (c.opts.onSkip) { try { c.opts.onSkip(how, info); } catch (e) { if (root.console) root.console.error(e); } }
    }
  }

  function buildDom(c) {
    var UI = J.UI, doc = root.document;
    var cv = c.cv;
    cv.className = 'opening-canvas ending-mv-canvas'; cv.setAttribute('aria-hidden', 'true');
    cv.style.imageRendering = 'auto';   // .opening-canvas 是 pixelated（片頭是像素畫）；MV 的 GPT 圖放大時要平滑，不要鋸齒
    var stage = doc.createElement('div'); stage.className = 'opening-stage ending-mv-stage'; stage.appendChild(cv);
    var loadEl = doc.createElement('div'); loadEl.className = 'opening-loading'; loadEl.textContent = '片尾曲載入中……'; stage.appendChild(loadEl);
    c.loadEl = loadEl;
    if (c.opts.skippable) {
      var btn = doc.createElement('button'); btn.type = 'button'; btn.className = 'opening-skip ending-mv-skip';
      btn.setAttribute('aria-label', '跳過片尾曲'); btn.textContent = '跳過 ▸▸';
      btn.addEventListener('click', function (e) { e.stopPropagation(); finish('user'); });
      stage.appendChild(btn);
    }
    var overlay = doc.createElement('div'); overlay.className = 'opening ending-mv'; overlay.setAttribute('tabindex', '-1');
    overlay.setAttribute('aria-label', c.opts.skippable ? '片尾曲（右下角可以跳過）' : '片尾曲');
    overlay.appendChild(stage);
    c.stage = stage; c.overlay = overlay;
    if (UI && UI.open) {
      c.handle = UI.open(overlay, { modal: false, label: '片尾曲', focus: overlay, escClose: !!c.opts.skippable,
        onClose: function () { if (cur === c) finish(c.opts.skippable ? 'user' : 'stop'); } });
    } else if (doc.body) {
      doc.body.appendChild(overlay);
      c.unmount = function () { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); };
    }
    c.layout = function () {
      if (cur !== c) return;
      var w = Math.floor(Math.min(root.innerWidth, root.innerHeight * 16 / 9)), h = Math.floor(w * 9 / 16);
      stage.style.width = w + 'px'; stage.style.height = h + 'px';
      var dev = w * (root.devicePixelRatio || 1), kk = dev > 1500 ? c.maxScale : 1;   // 上限 1.5：保護平板效能
      if (kk !== c.k || cv.width !== Math.round(W * kk)) { c.k = kk; cv.width = Math.round(W * kk); cv.height = Math.round(H * kk); }
    };
    root.addEventListener('resize', c.layout);
    root.addEventListener('orientationchange', c.layout);
    doc.addEventListener('visibilitychange', onVisibility);
    c.layout();
  }

  /**
   * 播放大結局 MV。
   * opts = {
   *   female: true／false            V17 用 E5 女生版／男生版
   *   hero: { img 或 src, cols:3, rows:4, rowLeft:1, rowUp:3 }   目前職業的走路圖（hero_<職業>.png 或 heroM_<職業>.png）；V02 走進來、V15 剪影
   *   pet, cloud: 同上（選用；pet 預設 assets/chars/pet_imo.png；cloud＝小雲霧仔，沒給就不畫）
   *   audio: HTMLAudioElement        片尾曲 v2（src 已設好）；MV 會從 0 秒 play()，時間跟著 currentTime；沒給或讀不到就照時鐘
   *   reduced: true／false           減少動態效果；沒給就看家長設定與系統設定
   *   skippable: true／false         顯示「跳過」（第一次看傳 false）
   *   maxScale: 1.5                  畫布倍率上限（效能沒過時改 1.0）
   *   slowMs: 80                     每格多卡幾毫秒（沒給就讀網址 ?mvslow=）
   *   onEnd(info)                    播完（info＝{ how:'end', t, mode, degraded }）→ 記 flags.ending_mv_seen、接 F6
   *   onSkip(reason, info)           沒播完：'user' 按跳過／'image' 圖讀不到（含 file:// 模式）／'slow' 降級後仍太慢 → 直接頒獎
   *   env                            測試用（假時鐘、假畫布、假讀圖）
   * }
   * 回傳 true＝開始（圖讀好才真的開播）；已經在播就回傳 false。
   */
  function play(opts) {
    opts = opts || {};
    if (cur) return false;
    var env = opts.env || defaultEnv();
    var c = {
      opts: opts, env: env, imgs: {}, spr: {}, white: {}, sil: {}, failed: null, done: false, started: false,
      reduced: opts.reduced === undefined ? systemReduced() : !!opts.reduced, degraded: false,
      k: 1, maxScale: opts.maxScale || 1.5, raf: 0, lastDraw: 0, shot: -1, t0: 0, start: 0, paused: false, pausedAt: 0,
      clock: opts.audio ? 'audio' : 'wall', audio: opts.audio || null, ownsAudio: !!opts.audio, audioStartedAt: null,
      slowMs: opts.slowMs !== undefined ? Math.min(PERF.maxSlowMs, opts.slowMs | 0) : parseSlow(env.search ? env.search() : ''),
      hero: normSprite(opts.hero, 3, 4), pet: normSprite(opts.pet || SPRITES.pet, 3, 4), cloud: normSprite(opts.cloud, 1, 1)
    };
    c.guard = createGuard({ reduced: c.reduced });
    cur = c;
    stats.plays++; stats.mode = c.reduced ? 'reduced' : 'normal'; stats.degradedAt = null; stats.degradedSongT = null; stats.skipReason = null;
    stats.frames = 0; stats.cardsShown = {}; stats.lastT = 0;
    c.cv = env.createCanvas(W, H);
    c.ctx = c.cv.getContext('2d', { alpha: false });
    if (env.mount) { c.unmount = env.mount(c.cv) || null; c.layout = function () {}; } else buildDom(c);
    c.ctx.fillStyle = '#000'; c.ctx.fillRect(0, 0, c.cv.width, c.cv.height);

    // 必要的圖：先讀前 3 鏡；選用的小圖同時讀
    var first = loadWindow(0).need, wantList = [];
    first.forEach(function (i) { sceneFiles(SCENES[i], opts).forEach(function (f) { wantList.push(f); }); });
    var pending = wantList.length;
    function sprite(key, url, set) {
      requestImage(c, 'spr:' + key, url, false);
      c.sprSet = c.sprSet || {}; c.sprSet['spr:' + key] = set;
    }
    c.onImage = function (name) {
      if (cur !== c) return;
      var e = c.imgs[name];
      if (c.sprSet && c.sprSet[name]) { if (e.st === 2) c.sprSet[name](e.img); c.sprSet[name] = null; }
      if (!c.started) {
        if (c.failed) { finish('image'); return; }
        if (wantList.indexOf(name) >= 0) pending--;
        if (pending <= 0) begin();
      }
    };
    Object.keys(SPRITES).forEach(function (key) {
      if (key === 'pet') return;
      sprite(key, SPRITES[key], function (img) { c.spr[key] = img; if (key.indexOf('boss_') === 0) c.white[key] = whiteOf(env, img); });
    });
    [['hero', c.hero], ['pet', c.pet], ['cloud', c.cloud]].forEach(function (pair) {
      var sp = pair[1];
      if (!sp) return;
      if (sp.img) { madeSil(pair[0], sp); return; }
      if (sp.src) sprite(pair[0], sp.src, function (img) { sp.img = img; madeSil(pair[0], sp); });
    });
    function madeSil(kind, sp) {
      if (!sp.img || !sp.img.width) return;
      if (kind === 'hero') c.sil.hero = silhouette(env, sp, sp.rowUp, 1, 1.6);
      else if (kind === 'pet') c.sil.pet = silhouette(env, sp, sp.rowUp, 1, 1.4);
      else c.sil.cloud = silhouette(env, sp, 0, 0, 1.2);
    }
    function begin() {
      if (c.started || cur !== c) return;
      c.started = true;
      buildStatic(c);
      if (c.loadEl) c.loadEl.hidden = true;
      c.start = env.now(); c.t0 = c.start; c.lastDraw = 0;
      c.guard.reset(0, true);
      if (c.audio) {
        c.audioStartedAt = c.start;
        try {
          c.audio.currentTime = 0;
          var p = c.audio.play();
          if (p && p.catch) p.catch(function () { if (cur === c && c.clock === 'audio') { c.clock = 'wall'; c.t0 = env.now() - (c.audio.currentTime || 0) * 1000; } });
        } catch (e) { c.clock = 'wall'; }
        if (c.audio.addEventListener) c.audio.addEventListener('error', function () { if (cur === c && c.clock === 'audio') { c.clock = 'wall'; c.t0 = env.now() - (c.audio.currentTime || 0) * 1000; } });
      }
      if (root.document && root.document.visibilityState === 'hidden') { c.paused = true; c.pausedAt = c.start; }
      c.raf = env.raf(loop);
    }
    ensureWindow(c, 0);
    if (c.failed && !c.started) { finish('image'); return true; }
    if (pending <= 0) begin();
    // 4b 夜班建議 6：開播前的圖 LOAD_TIMEOUT_MS（8 秒）還沒讀好（網路卡住、onload／onerror 都不來）→ 當成讀不到，onSkip('image') 直接頒獎
    if (!c.started) {
      var later = env.setTimeout || (root.setTimeout && root.setTimeout.bind(root));
      if (later) { c.loadTimer = later(function () { if (cur === c && !c.started && !c.done) { c.failed = c.failed || 'timeout'; finish('image'); } }, LOAD_TIMEOUT_MS); if (c.loadTimer && c.loadTimer.unref) c.loadTimer.unref(); }   // node 測試：計時器不拖住程序結束
    }
    return true;
  }

  var LOAD_TIMEOUT_MS = 8000;   // 4b 夜班建議 6：開播前讀圖的逾時
  function skip() { if (cur && cur.opts.skippable) finish('user'); }
  function stop() { finish('stop'); }

  var EndingMV = {
    W: W, H: H, DUR: SONG.dur, FPS: FPS, LOAD_TIMEOUT_MS: LOAD_TIMEOUT_MS, K1080: K1080, BASE: BASE,
    SONG: SONG, SCENES: SCENES, TITLE: TITLE, CARDS: CARDS, CARD_FADE: CARD_FADE, CARD_SIZE1080: CARD_SIZE1080, FALLBACK_TEXT: FALLBACK_TEXT,
    HERO_SPECIAL: HERO_SPECIAL, PERF: PERF, BIRD: BIRD, STAR_C: STAR_C, STAR_COUNT: STARS.length / 3,
    sceneIndexAt: sceneIndexAt, sceneById: sceneById, compose: compose, viewOf: viewOf, cardAlpha: cardAlpha,
    sceneFiles: sceneFiles, allFiles: allFiles, fileUrl: fileUrl, loadWindow: loadWindow, parseSlow: parseSlow,
    createGuard: createGuard, heroSpecialAt: heroSpecialAt, birdsExitAt: birdsExitAt, textOf: textOf,
    play: play, skip: skip, stop: stop, isPlaying: function () { return !!cur; },
    time: function () { return cur && cur.started ? Math.min(SONG.dur, songT(cur)) : 0; },
    mode: function () { return cur ? (cur.reduced ? 'reduced' : 'normal') : null; },
    stats: stats
  };
  J.EndingMV = EndingMV;
  if (typeof module !== 'undefined' && module.exports) module.exports = EndingMV;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
