/* v4.2.2 NPC／野怪程式動畫（老闆 2026-11-13：先用程式讓單張圖動起來；同日再指示「有腳的踏步、沒腳的上下飄動」）：純數學，瀏覽器與 node 共用；回傳數字、不配置物件（每幀呼叫）。 */
(function () {
  'use strict';
  var STEP_TILT = 5;        // 有腳的野怪踏步：身體往踏出的一側傾斜的最大角度（度，以腳底中央為軸）
  var STEP_H = 2;           // 踏步的小起伏（像素），踩下去時回到 0
  var FLOAT_AMP = 3;        // 沒腳的野怪上下飄動：±3 像素
  var FLOAT_MIN = 1;        // 飄到最低點仍離地 1 像素（看起來是浮著的）；減少動態時就停在這個高度
  var FLOAT_TOP = FLOAT_MIN + 2 * FLOAT_AMP;   // 最高 7 像素（影子縮到 80%）
  var GROUND_TOP = 2;       // 貼地的（D 類）只在 0～2 像素之間來回，最低點貼地
  var NPC_AMP = 0.035;      // NPC 呼吸：垂直多長 3.5%
  var MOB_AMP = 0.08;       // 野怪站著的呼吸：沿用 v0.4 的 ×1.08
  var SHADOW_W = 0.7;       // 影子寬＝角色顯示寬的 70%（實測 65% 在草地上幾乎看不到）
  var SHADOW_ALPHA = 0.4;   // 規格約 0.25–0.3；實測 1280×720 石板、草地上看不出來，技術長要求一眼看得出來，調到 0.4
  var SHADOW_SHRINK = 0.2;  // 飄到最高點時影子縮成 80%

  /**
   * 沒腳的（飄動）：美術 2026-11-13 逐張看圖分類（C:\tmp\v422_motion\monster_motion.json 的 motion＝float，B 漂浮 34＋C 飛行 8＋D 貼地 25＝67 隻）。
   * 怪物 id（window.MONSTERS）；不在名單裡的怪物一律是有腳的（踏步，A 類 56 隻）。新增怪物要先分類，tests/v422_anim.test.js 會擋。
   */
  var FLOAT_MONSTERS = toSet(['al_cloud', 'an_magpie', 'bat', 'dj_taro', 'ds_lychee', 'fo_echo', 'fo_echo_s1', 'fo_frost', 'fo_frost_s1', 'fo_puff', 'fo_puff_cave', 'fo_puff_s1', 'fo_umbrella', 'fo_umbrella_s1', 'fob_balloon', 'fob_balloon_s2', 'fob_king', 'fob_mist', 'fob_shadow_bat', 'fob_shadow_octo', 'fob_shadow_tree', 'fog_demon', 'fog_demon_s3', 'fog_octopus', 'gh_cone', 'gh_lantern', 'gh_lantern_f', 'gt_jade', 'gt_steam', 'ly_bubble', 'ly_kumquat', 'ly_mackerel', 'mb_floodgate', 'mb_floodgate_s3', 'mb_lantern', 'mb_lantern_s3', 'mb_train', 'mb_train_s2', 'mc_gondola', 'mc_vacuum', 'mn_cart', 'mn_dust', 'mn_lamp', 'mudslime', 'noise_bat', 'owl', 'pi_anchor', 'pi_milkfish', 'pi_octo', 'pi_parrot', 'pib_anchor', 'pib_ship', 'pib_ship_s2', 'seagull', 'tea_moth', 'tree_king', 'wisp', 'wx_rainbow', 'wx_snow', 'wx_thunder', 'wx_wave', 'wx_wave_e', 'wx_wind', 'wxb_raincloud', 'wxb_raincloud_s2', 'wxb_whale', 'wxb_whale_s3']);
  /** 沒腳但貼地的（D 類：史萊姆、礦車、火車頭、船錨、章魚、魚…；FLOAT_MONSTERS 的子集）：只在 0～2 像素之間微浮（技術長依美術建議的折衷，等老闆看動圖確認） */
  var GROUNDED = toSet(['dj_taro', 'ds_lychee', 'fob_shadow_octo', 'fob_shadow_tree', 'fog_octopus', 'gh_cone', 'gt_jade', 'gt_steam', 'ly_bubble', 'ly_kumquat', 'ly_mackerel', 'mb_floodgate', 'mb_floodgate_s3', 'mb_train', 'mb_train_s2', 'mc_vacuum', 'mn_cart', 'mudslime', 'pi_anchor', 'pi_milkfish', 'pi_octo', 'pib_anchor', 'pib_ship', 'pib_ship_s2', 'tree_king']);

  /** 飛行的（C 類 8 隻；FLOAT_MONSTERS 的子集）：只有多幀圖換格的速度不同（拍翅較快），程式的飄動和 B 類相同 */
  var FLYING = toSet(['an_magpie', 'bat', 'fob_shadow_bat', 'noise_bat', 'owl', 'pi_parrot', 'seagull', 'tea_moth']);
  /**
   * 多幀圖（老闆 2026-11-13「要像 gif 一樣會動」；美術逐隻畫 4 格橫排，sprites.js 的 <圖像 key>_anim，type strip）每格的毫秒：
   * 漂浮 200、飛行 120、貼地 180。有腳的不用固定毫秒：走一格（MapScene 的 MOB_STEP_MS）剛好播一輪（兩步），和移動同步、不滑步。
   */
  var ANIM_MS = { float: 200, fly: 120, ground: 180 };
  var REST = 1;   // 有腳的「並攏」格（第 2 格）：站著、跑走、減少動態時停在這一格

  function toSet(ids) { var o = {}; for (var i = 0; i < ids.length; i++) o[ids[i]] = 1; return o; }
  function inside(k) { return k > 0 && k < 1; }
  // 像素圖最近鄰縮放：高度只取整數像素，避免每幀換一列造成整列閃爍
  function quant(v, h) { return Math.round(v * h) / h; }
  function cycle(t, period, phase) { return (((t + (phase || 0)) % period) + period) % period / period; }

  /** 'float'（沒腳，上下飄動）或 'step'（有腳，走路踏步、站著呼吸）；id＝怪物 id */
  function motionOf(id) { return FLOAT_MONSTERS[id] === 1 ? 'float' : 'step'; }
  /** 沒腳但貼地（D 類）：飄動幅度縮成 0～2 像素 */
  function grounded(id) { return GROUNDED[id] === 1; }

  /**
   * 踏步：k＝這一格走了多少（0～1），一格踏兩步（前半左腳、後半右腳）。每一步 u＝0→1 時 sin(πu) 先升後降，踩下去（u＝0、1）回到 0。
   * stepTilt：傾斜角（整數度；左步負＝往左傾、右步正＝往右傾）；stepLift：起伏（整數像素）。範圍外、減少動態＝0。
   */
  function stepTilt(k, reduced) {
    if (reduced || !inside(k)) return 0;
    var s = k * 2, u = s - Math.floor(s);
    return (s < 1 ? -1 : 1) * Math.round(STEP_TILT * Math.sin(Math.PI * u)) || 0;   // || 0：不回傳 −0
  }
  function stepLift(k, reduced) {
    if (reduced || !inside(k)) return 0;
    var s = k * 2;
    return Math.round(STEP_H * Math.sin(Math.PI * (s - Math.floor(s))));
  }

  /**
   * 飄動高度（整數像素）：正弦。一般（B 漂浮、C 飛行）1～7：中心 4、±3；貼地（gnd＝true，D 類）0～2：中心 1、±1。
   * 減少動態或沒有週期＝停在最低點（一般 1、貼地 0）
   */
  function floatLift(t, period, phase, reduced, gnd) {
    var lo = gnd ? 0 : FLOAT_MIN, amp = gnd ? GROUND_TOP / 2 : FLOAT_AMP;
    if (reduced || !(period > 0)) return lo;
    return lo + amp + Math.round(amp * Math.sin(2 * Math.PI * cycle(t, period, phase)));
  }
  /** 飄動週期 1.2～1.6 秒、相位依編號錯開（同一群不會一起上下） */
  function floatPeriod(idx) { return 1200 + ((idx * 7) % 5) * 100; }
  function floatPhase(idx, period) { return (idx * 331) % period; }

  /** 呼吸多長的比例（0～amp，腳底固定往上長）：t＝現在時間、period＝一輪毫秒、phase＝錯開的毫秒、h＝顯示高度；最高至少 1 像素（矮的角色也看得出來） */
  function breath(t, period, amp, phase, h, reduced) {
    if (reduced || !(period > 0) || !(h > 0)) return 0;
    var peak = Math.max(1, Math.round(amp * h));
    return quant(peak / h * (1 - Math.cos(2 * Math.PI * cycle(t, period, phase))) / 2, h);
  }

  /** NPC 呼吸週期 2.2～3.0 秒、相位依座標錯開（同一張圖的 NPC 不會一起動） */
  function npcPeriod(x, y) { return 2200 + ((x * 37 + y * 53) % 9) * 100; }
  function npcPhase(x, y, period) { return (x * 419 + y * 283) % period; }
  /** 野怪呼吸：沿用 v0.4 補間的來回時間 420＋(idx×53 mod 300) 毫秒（一輪＝兩倍） */
  function mobPeriod(idx) { return 2 * (420 + (idx * 53) % 300); }
  function mobPhase(idx, period) { return (idx * 197) % period; }

  /** 多幀圖的動作分類：'step'（A 有腳）、'float'（B 漂浮）、'fly'（C 飛行）、'ground'（D 貼地） */
  function animKind(id) { return motionOf(id) === 'step' ? 'step' : GROUNDED[id] === 1 ? 'ground' : FLYING[id] === 1 ? 'fly' : 'float'; }
  /**
   * 多幀圖現在播第幾格（0 起算）。n＝格數；k＝這一格走了多少（0～1，沒在走傳 NaN）；phase＝錯開的毫秒。
   * 有腳：走路中 floor(k×n)（一格播一輪），其他時候並攏格；其他類：每 ANIM_MS 毫秒換一格，不論走或停。減少動態：有腳並攏、其他第 1 格。
   */
  function animFrame(kind, t, k, phase, n, reduced) {
    if (!(n > 1)) return 0;
    var rest = kind === 'step' ? Math.min(REST, n - 1) : 0;
    if (reduced) return rest;
    if (kind === 'step') return k >= 0 && k < 1 ? Math.floor(k * n) : rest;
    var ms = ANIM_MS[kind] || ANIM_MS.float, p = n * ms;
    return Math.floor(((((t + (phase || 0)) % p) + p) % p) / ms);
  }
  /** 多幀圖相位（毫秒）依編號錯開，同一群不會一起換格；有腳的跟著移動，不用相位 */
  function animPhase(idx, n, kind) { return kind === 'step' ? 0 : (idx * 331) % (n * (ANIM_MS[kind] || ANIM_MS.float)); }

  /**
   * 角色被上層格蓋住的範圍（剪影只畫這一塊）：x、y、w、h＝角色的顯示框（世界像素），set＝上層格 {"x,y": true}，T＝格寬。
   * 回傳顯示框和「碰到的上層格外框」的交集 {x, y, w, h}；沒碰到回傳 null（不配置物件）。
   */
  function coverBox(x, y, w, h, set, T) {
    if (!(w > 0) || !(h > 0) || !set) return null;
    var x0 = Math.floor(x / T), x1 = Math.floor((x + w - 1) / T), y0 = Math.floor(y / T), y1 = Math.floor((y + h - 1) / T);
    var bx0 = Infinity, by0 = Infinity, bx1 = -Infinity, by1 = -Infinity;
    for (var cy = y0; cy <= y1; cy++) for (var cx = x0; cx <= x1; cx++) {
      if (!set[cx + ',' + cy]) continue;
      if (cx < bx0) bx0 = cx; if (cx > bx1) bx1 = cx; if (cy < by0) by0 = cy; if (cy > by1) by1 = cy;
    }
    if (bx0 === Infinity) return null;
    var l = Math.max(x, bx0 * T), t = Math.max(y, by0 * T);
    return { x: l, y: t, w: Math.min(x + w, (bx1 + 1) * T) - l, h: Math.min(y + h, (by1 + 1) * T) - t };
  }

  /** 影子寬（像素）＝顯示寬 70%，至少 4 */
  function shadowWidth(w) { return Math.max(4, Math.round(w * SHADOW_W)); }
  /** 影子縮放：離地 lift 像素時縮小，到 h（最高）縮成 80% */
  function shadowScale(lift, h) { return lift > 0 && h > 0 ? Math.round((1 - SHADOW_SHRINK * Math.min(1, lift / h)) * 100) / 100 : 1; }

  var SpriteAnim = {
    STEP_TILT: STEP_TILT, STEP_H: STEP_H, FLOAT_AMP: FLOAT_AMP, FLOAT_MIN: FLOAT_MIN, FLOAT_TOP: FLOAT_TOP, GROUND_TOP: GROUND_TOP, NPC_AMP: NPC_AMP, MOB_AMP: MOB_AMP,
    SHADOW_W: SHADOW_W, SHADOW_ALPHA: SHADOW_ALPHA, SHADOW_SHRINK: SHADOW_SHRINK,
    FLOAT_MONSTERS: FLOAT_MONSTERS, GROUNDED: GROUNDED, motionOf: motionOf, grounded: grounded,
    stepTilt: stepTilt, stepLift: stepLift, floatLift: floatLift, floatPeriod: floatPeriod, floatPhase: floatPhase,
    breath: breath, npcPeriod: npcPeriod, npcPhase: npcPhase,
    mobPeriod: mobPeriod, mobPhase: mobPhase, shadowWidth: shadowWidth, shadowScale: shadowScale,
    FLYING: FLYING, ANIM_MS: ANIM_MS, animKind: animKind, animFrame: animFrame, animPhase: animPhase, coverBox: coverBox
  };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.SpriteAnim = SpriteAnim; }
  if (typeof module !== 'undefined') module.exports = SpriteAnim;
})();
