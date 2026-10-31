/*
 * 勇者大冒險 — 職業（v1.0 第一批：48 號 v2 規格，26 號第 4、5 節）
 * 撰寫：遊戲數值設計師（48 號）；前端照 48 號 F1 寫成資料
 *
 * 能力＝max( round((基礎＋成長×(職業等級−1)) × mods × (1＋transfer_step×n)), 保底 )   ← 48 號 2.1
 *   基礎 PLAYER_BASE；成長 JOB_RULES.growth（所有職業一樣）；n＝已出師的職業數（不含目前職業；見習 Lv10、初級 Lv30 算出師）
 *   保底：每次轉職記下「轉職前能力（不含裝備）× floor_ratio」，各項取以前保底的較大值
 * 欄位：
 *   tier：novice（見習，技能職階係數 0.9）／basic（初級 1.0）／inter（中級 1.25；v2.1）
 *   v2.1 中級：recipe＝配方（各初級職業都要 Lv30）、fav 兩個拿手科目、look＝還沒有走路圖時借哪個初級職業的圖；n 的出師：中級 Lv50
 *   mods：{hp, mp, atk, def} 職業倍率（48 號 2.2；劍士 1.20/0.60/1.40/1.10，老闆「物攻、力量調強」）
 *   fav：拿手科目（答對傷害 ×bonus）；trait：被動特性（48 號 2.5）
 *   wf／af：能用的武器／防具類別（items.js 的 fam；gen＝通用，大家都能用）
 *   skills：[{ id, lv（這個職業幾級學會）, name, eff（26 號 5.3 效果代碼）, arg, mp, desc, fx:{type, color, ms} }]   ← 26 號 5.5 第 1–50 號
 *     fx.type：slash 斬擊、strike 打擊、fire 火焰、ice 冰、thunder 雷、wind 風、water 水、light 光、heal 治療、buff 增益、debuff 減益、
 *              note 音符、star 星星、comic 搞笑、summon 召喚、coin 金幣、smoke 煙霧、arrow 箭、wave 聲波、burst 爆炸（26 號 5.4）
 * 主角走路圖 sprite key：女生 sprite_f＝'hero_'＋職業 id，男生 sprite_m＝'heroM_'＋職業 id。
 *   開放哪些職業由 JOB_RULES.open_jobs 決定（2026-10-12 7 個新職業的走路圖交件，12 個職業全開）。
 */
window.PLAYER_BASE = { hp: 30, mp: 10, atk: 6, def: 0 };

(function () {
  function S(id, lv, name, eff, arg, mp, desc, type, color, ms) { return { id: id, lv: lv, name: name, eff: eff, arg: arg, mp: mp, desc: desc, fx: { type: type, color: color, ms: ms } }; }
  function J(id, o) { o.sprite_f = 'hero_' + id; o.sprite_m = 'heroM_' + id; return o; }

  window.JOBS = {
    novice: J('novice', {
      name: "見習冒險者", tier: "novice", mods: { hp: 1.00, mp: 1.00, atk: 1.00, def: 1.00 }, fav: null, bonus: 1.0, trait: {},
      wf: [], af: [],
      skills: [
        S('nov_cheer', 4, "加油打氣", "heal", { r: 0.25 }, 2, "答對一題，回復一些體力。", "heal", "#7CFC8A", 600),
        S('nov_strike', 8, "用力一擊", "hit", { p: 1.4 }, 2, "答對一題，用力打一下。", "slash", "#FFFFFF", 400)
      ],
      desc: "剛出發的冒險者。什麼都學一點。見習 10 級、通過立志小考，就能轉職。"
    }),
    swordsman: J('swordsman', {
      name: "劍士", tier: "basic", mods: { hp: 1.20, mp: 0.60, atk: 1.40, def: 1.10 }, fav: "數學", bonus: 1.5,
      trait: { power: 1.15, dmgTaken: 0.9 }, wf: ["sword", "axe"], af: ["heavy"],
      skills: [
        S('sw_wind', 7, "破風斬", "hit", { p: 1.5 }, 3, "答對一題，劍快得像風。", "slash", "#CFE8FF", 450),
        S('sw_wall', 14, "鐵壁架式", "guard", { m: 0.5, t: 3 }, 5, "接下來被打 3 次，傷害減半。", "buff", "#C0C8D0", 700),
        S('sw_twin', 21, "雙刃旋風", "multi", { n: 2, p: 1.3 }, 9, "轉一圈，連砍兩下。", "slash", "#E0F0FF", 700),
        S('sw_quake', 28, "大地裂斬", "hit", { p: 3.2 }, 15, "用盡全力劈下去，地面都裂開了。", "slash", "#C8913A", 900)
      ],
      desc: "力量最大的職業：所有攻擊傷害 ×1.15，被怪物打到的傷害少一成。拿手科目是數學。"
    }),
    fighter: J('fighter', {
      name: "武鬥家", tier: "basic", mods: { hp: 1.15, mp: 0.60, atk: 1.25, def: 0.90 }, fav: "英語", bonus: 1.5,
      trait: { critFrac: 0.4 }, wf: ["fist"], af: ["light"],
      skills: [
        S('fi_combo', 7, "連環拳", "multi", { n: 2, p: 0.8 }, 3, "左一拳、右一拳，連打兩下。", "strike", "#FFA040", 500),
        S('fi_breath', 14, "深呼吸", "charge", { m: 2.2 }, 4, "吸一口氣，下一次攻擊變超強。", "buff", "#FFD34D", 700),
        S('fi_kick', 21, "旋風腿", "crit", { p: 1.7 }, 9, "轉身一踢，一定是會心一擊。", "strike", "#9EF0C0", 600),
        S('fi_hundred', 28, "百烈拳", "multi", { n: 5, p: 0.7 }, 16, "拳頭快到看不見，連打五下。", "strike", "#FF8030", 1200)
      ],
      desc: "答得快就容易會心一擊（會心的時間比別人長）。拿手科目是英語。"
    }),
    mage: J('mage', {
      name: "魔法師", tier: "basic", mods: { hp: 0.90, mp: 1.60, atk: 0.80, def: 0.90 }, fav: "自然", bonus: 1.5,
      trait: { skillPow: 1.15 }, wf: ["staff"], af: ["robe"],
      skills: [
        S('mg_fire', 7, "小火球", "hit", { p: 1.6 }, 3, "丟出一顆小火球。", "fire", "#FF6A2A", 600),
        S('mg_ice', 14, "冰晶箭", "hit_weak", { p: 1.9, m: 0.8, t: 2 }, 6, "冰箭打中，怪物凍得手腳變慢。", "ice", "#8FD8FF", 700),
        S('mg_bolt', 21, "落雷術", "hit_stun", { p: 2.4, t: 1 }, 10, "雷打下來，怪物麻麻的不能動。", "thunder", "#FFF06A", 700),
        S('mg_meteor', 28, "流星雨", "multi", { n: 4, p: 0.9 }, 18, "天上掉下四顆小流星。", "light", "#FFB0F0", 1400)
      ],
      desc: "魔力最高，攻擊技能威力 ×1.15。拿手科目是自然。"
    }),
    priest: J('priest', {
      name: "祭司", tier: "basic", mods: { hp: 1.00, mp: 1.30, atk: 0.90, def: 1.00 }, fav: "社會", bonus: 1.5,
      trait: { healPow: 1.2 }, wf: ["staff"], af: ["robe"],
      skills: [
        S('pr_light', 7, "療癒之光", "heal", { r: 0.30 }, 3, "回復三成體力。", "heal", "#7CFC8A", 700),
        S('pr_barrier', 14, "守護結界", "guard", { m: 0.5, t: 3 }, 5, "張開光罩，被打 3 次都減半。", "buff", "#BFEFFF", 800),
        S('pr_great', 21, "大療癒", "heal", { r: 0.70 }, 8, "回復七成體力。", "heal", "#A8FFB8", 900),
        S('pr_vow', 28, "不倒祈願", "revive", { r: 0.5 }, 12, "這場累倒時，會馬上站起來。", "light", "#FFFBE0", 1200)
      ],
      desc: "會回復的守護型：回復技能效果 ×1.2。拿手科目是社會。"
    }),
    dancer: J('dancer', {
      name: "舞者", tier: "basic", mods: { hp: 0.90, mp: 1.10, atk: 1.00, def: 0.90 }, fav: "數學", bonus: 1.5,
      trait: { evade: 0.10 }, wf: ["dagger", "perform"], af: ["light"],
      skills: [
        S('da_tap', 7, "旋轉踢踏", "hit", { p: 1.5 }, 3, "跳著舞踢一下。", "strike", "#FF8FC8", 600),
        S('da_charm', 14, "迷惑舞步", "stun", { t: 1 }, 5, "怪物看傻了，下一次忘了攻擊。", "debuff", "#D9A0FF", 900),
        S('da_vigor', 21, "元氣之舞", "heal", { r: 0.35 }, 7, "跳一支舞，回復體力。", "heal", "#FFC0E0", 900),
        S('da_ribbon', 28, "彩帶旋風", "multi", { n: 3, p: 1.1 }, 15, "彩帶轉成旋風，打三下。", "wind", "#FF70B0", 1200)
      ],
      desc: "答錯時有一成機會閃過怪物的攻擊。拿手科目是數學。"
    }),
    archer: J('archer', {
      name: "弓箭手", tier: "basic", mods: { hp: 0.95, mp: 0.90, atk: 1.00, def: 0.90 }, fav: "英語", bonus: 1.5,
      trait: { time: 1.2, drop: 1.5 }, wf: ["dagger"], af: ["light"],
      skills: [
        S('ar_quick', 7, "快手連擊", "multi", { n: 2, p: 0.8 }, 3, "手好快，連打兩下。", "slash", "#E8E8E8", 400),
        S('ar_pocket', 14, "神奇口袋", "steal", { p: 1 }, 4, "打一下，順便拿到怪物的東西。", "coin", "#FFD700", 700),
        S('ar_shadow', 21, "影子步", "time_up", { m: 1.5, t: 3 }, 6, "腳步變輕，3 題的時間變長。", "smoke", "#8A8AA0", 700),
        S('ar_night', 28, "暗夜突襲", "crit", { p: 2.6 }, 15, "從影子裡出手，一定會心。", "slash", "#6A5ACD", 800)
      ],
      desc: "動作快，答題時間條多兩成（家長把答題時間關掉時，改成每場戰鬥可以閃過一次答錯後的攻擊）；打倒怪物時比較容易掉東西。拿手科目是英語。"
    }),
    bard: J('bard', {
      name: "吟遊詩人", tier: "basic", mods: { hp: 0.90, mp: 1.30, atk: 0.90, def: 0.90 }, fav: "國語", bonus: 1.5,
      trait: { mpRegen: 0.05 }, wf: ["perform"], af: ["robe"],
      skills: [
        S('bd_song', 7, "鼓舞之歌", "time_up", { m: 1.5, t: 1, atk: 1.2 }, 3, "下一題時間變長，也打得比較痛。", "note", "#FFE066", 900),
        S('bd_lullaby', 14, "安眠曲", "stun", { t: 1 }, 5, "唱首搖籃曲，怪物打瞌睡。", "note", "#B0C4FF", 1000),
        S('bd_echo', 21, "回聲詩篇", "heal", { r: 0.40 }, 7, "念一首詩，回復四成體力。", "heal", "#9FF0D0", 900),
        S('bd_epic', 28, "英雄敘事詩", "atk_up", { m: 1.6, t: 3 }, 14, "唱出英雄故事，3 次攻擊變強。", "note", "#FFD34D", 1300)
      ],
      desc: "會幫自己加油的輔助型：打倒怪物後回復一點魔力。拿手科目是國語。"
    }),
    sailor: J('sailor', {
      name: "船員", tier: "basic", mods: { hp: 1.20, mp: 0.60, atk: 1.10, def: 1.10 }, fav: "社會", bonus: 1.5,
      trait: { fleeSure: true }, wf: ["axe"], af: ["heavy"],
      skills: [
        S('sa_anchor', 7, "船錨重擊", "hit", { p: 1.6 }, 3, "甩出船錨砸下去。", "strike", "#4A6FA5", 600),
        S('sa_splash', 14, "浪花潑潑", "hit_weak", { p: 1.4, m: 0.75, t: 3 }, 5, "潑一大片浪花，怪物變弱。", "water", "#3FA9F5", 800),
        S('sa_charge', 21, "拔錨衝鋒", "hit", { p: 2.6 }, 10, "像船一樣衝過去。", "strike", "#2F80ED", 800),
        S('sa_wave', 28, "大浪來襲", "hit", { p: 3.3 }, 16, "招來一道大浪。", "water", "#1E6FD9", 1300)
      ],
      desc: "逃跑一定成功（頭目戰還是不能逃）。拿手科目是社會。"
    }),
    shepherd: J('shepherd', {
      name: "牧羊人", tier: "basic", mods: { hp: 1.00, mp: 1.00, atk: 1.00, def: 1.00 }, fav: "自然", bonus: 1.5,
      trait: { petHit: 0.15 }, wf: ["whip"], af: ["light"],
      skills: [
        S('sh_dog', 7, "牧羊犬出動", "pet", { p: 1.6 }, 3, "牧羊犬衝出來幫忙咬一口。", "summon", "#F5DEB3", 800),
        S('sh_pillow', 14, "綿羊抱枕", "guard", { m: 0.5, t: 3 }, 5, "抱著軟綿綿的羊，被打不痛。", "buff", "#FFFFFF", 800),
        S('sh_tea', 21, "青草茶", "heal", { r: 0.45 }, 7, "喝一口青草茶，回復體力。", "heal", "#8BD17C", 800),
        S('sh_parade', 28, "羊群大遊行", "multi", { n: 4, p: 0.85 }, 16, "一群羊踩過去，打四下。", "summon", "#FFF8E7", 1500)
      ],
      desc: "答對時，番薯仔有時會追加一擊。拿手科目是自然。"
    }),
    jester: J('jester', {
      name: "搞笑藝人", tier: "basic", mods: { hp: 1.00, mp: 1.00, atk: 0.90, def: 0.90 }, fav: "國語", bonus: 1.5,
      trait: { laugh: 0.08 }, wf: ["perform"], af: ["light"],
      skills: [
        S('je_joke', 7, "冷笑話", "stun", { t: 1 }, 3, "講個冷笑話，怪物凍住了。", "comic", "#FFE45C", 900),
        S('je_banana', 14, "香蕉皮", "hit", { p: 1.8 }, 5, "怪物踩到香蕉皮滑一跤。", "comic", "#FFD23F", 700),
        S('je_laugh', 21, "笑聲回春", "heal", { r: 0.40 }, 7, "哈哈大笑，體力回來了。", "heal", "#FFB347", 900),
        S('je_stage', 28, "爆笑大舞台", "random", { table: [["hit", 2.5], ["hit", 3.5], ["hit", 4.5], ["heal", 0.6]] }, 14, "表演開始！會發生什麼呢？", "comic", "#FF6FD8", 1400)
      ],
      desc: "答錯時，怪物有時會笑到忘了攻擊。拿手科目是國語。"
    }),
    tamer: J('tamer', {
      name: "魔物大師", tier: "basic", mods: { hp: 1.00, mp: 1.10, atk: 0.95, def: 0.95 }, fav: "自然", bonus: 1.5,
      trait: { friendCard: 0.05 }, wf: ["whip"], af: ["light"],
      skills: [
        S('ta_friend', 7, "朋友來幫忙", "pet", { p: 1.6 }, 3, "怪物朋友跑出來幫你打。", "summon", "#9BE564", 800),
        S('ta_command', 14, "馴獸口令", "weaken", { m: 0.7, t: 3 }, 5, "喊一聲口令，怪物變乖了。", "debuff", "#C6A15B", 700),
        S('ta_wild', 21, "野性呼喚", "multi", { n: 2, p: 1.3 }, 9, "兩個朋友一起衝。", "summon", "#6BBF59", 1000),
        S('ta_roar', 28, "百獸齊鳴", "hit", { p: 3.2 }, 15, "所有朋友一起大叫。", "wave", "#E0C060", 1300)
      ],
      desc: "打倒怪物時，有時會收到「怪物朋友卡」。拿手科目是自然。"
    }),
    merchant: J('merchant', {
      name: "商人", tier: "basic", mods: { hp: 1.00, mp: 0.80, atk: 0.95, def: 1.00 }, fav: "數學", bonus: 1.5,
      trait: { gold: 1.25 }, wf: ["dagger"], af: ["light"],
      skills: [
        S('me_bead', 7, "算盤彈珠", "hit", { p: 1.5 }, 3, "彈出算盤珠子。", "strike", "#C68E4E", 500),
        S('me_boom', 14, "生意興隆", "hit_gold", { p: 1, g: 1.3 }, 4, "打一下，這場金幣變多。", "coin", "#FFD700", 900),
        S('me_haggle', 21, "討價還價", "weaken", { m: 0.6, t: 2 }, 6, "跟怪物殺價，牠變沒力氣。", "debuff", "#E8B04A", 700),
        S('me_rain', 28, "金幣雨", "hit", { p: 3 }, 15, "金幣嘩啦啦砸下去。", "coin", "#FFC800", 1200)
      ],
      desc: "戰鬥拿到的金幣 ×1.25。拿手科目是數學。"
    }),
    // ── v2.1 中級職業（69 號第六節；wip_v20/v21_apply.js 產生，數值改檔頭的 INTER／TUNE 再重跑）──
    // 技能威力寫原值，載入時（world.js normalizeSkill）乘中級職階係數 1.25；走路圖還沒畫好時借 look 職業的圖（assets.js heroKey）
    battle_master: J('battle_master', {
      name: "戰鬥大師", tier: "inter", recipe: { swordsman: 30, fighter: 30 }, look: "fighter",
      mods: { hp: 1.40, mp: 0.75, atk: 1.40, def: 1.30 }, fav: ["數學", "英語"], bonus: 1.5,
      trait: { critMult: 1.7 }, wf: ["sword", "axe", "fist"], af: ["heavy", "light"],
      skills: [
        S('bm_crit', 12, "雙重會心", "crit", { p: 2 }, 6, "瞄準要害，一定會心。", "slash", "#FFD34D", 700),
        S('bm_break', 24, "破甲重擊", "hit_weak", { p: 2.5, m: 0.8, t: 2 }, 10, "打碎怪物的盔甲。", "strike", "#FF9E3D", 800),
        S('bm_burst', 36, "千斤爆擊", "hit", { p: 3.4 }, 16, "像千斤石頭一樣重的一擊。", "strike", "#FF5E3A", 1000),
        S('bm_dance', 48, "戰神連舞", "multi", { p: 1.1, n: 4 }, 24, "劍和拳一起來，連打四下。", "slash", "#FFE07A", 1500)
      ],
      desc: "會心一擊的傷害變成 1.7 倍（一般是 1.5 倍）。拿手科目是數學和英語。"
    }),
    magic_knight: J('magic_knight', {
      name: "魔法戰士", tier: "inter", recipe: { swordsman: 30, mage: 30 }, look: "swordsman",
      mods: { hp: 1.30, mp: 1.20, atk: 1.10, def: 1.20 }, fav: ["數學", "自然"], bonus: 1.5,
      trait: { skillPow: 1.1, dmgTaken: 0.9 }, wf: ["sword", "axe", "staff"], af: ["heavy", "robe"],
      skills: [
        S('mk_fire', 12, "炎紋劍", "hit", { p: 1.9 }, 6, "劍上燒起火紋。", "fire", "#FF7A2A", 700),
        S('mk_ice', 24, "霜紋劍", "hit_weak", { p: 2.4, m: 0.8, t: 2 }, 10, "劍上結冰，怪物變慢。", "ice", "#9FE3FF", 800),
        S('mk_thunder', 36, "雷紋劍", "hit", { p: 3.3 }, 16, "劍上閃著雷光。", "thunder", "#FFF06A", 900),
        S('mk_triple', 48, "三紋合一", "multi", { p: 1.5, n: 3 }, 24, "火、冰、雷輪流砍三下。", "fire", "#FFFFFF", 1500)
      ],
      desc: "攻擊技能強一成，被打的傷害少一成。拿手科目是數學和自然。"
    }),
    sage: J('sage', {
      name: "賢者", tier: "inter", recipe: { priest: 30, mage: 30 }, look: "mage",
      mods: { hp: 1.10, mp: 1.60, atk: 0.85, def: 1.05 }, fav: ["社會", "自然"], bonus: 1.5,
      trait: { healPow: 1.15, skillPow: 1.15 }, wf: ["staff"], af: ["robe"],
      skills: [
        S('sg_heal', 12, "星光療癒", "heal", { r: 0.6 }, 6, "回復六成體力。", "heal", "#B8FFC8", 800),
        S('sg_assist', 24, "智慧之光", "assist", {}, 6, "下一題刪掉一個錯的答案。", "light", "#FFF8C0", 800),
        S('sg_burst', 36, "星辰爆裂", "hit", { p: 3.4 }, 16, "星星在怪物身邊爆開。", "light", "#C9B8FF", 1100),
        S('sg_prayer', 48, "全能祈福", "heal_guard", { r: 1, m: 0.5, t: 3 }, 24, "體力全滿，還有光罩保護。", "heal", "#FFFFFF", 1500)
      ],
      desc: "回復和攻擊技能都多一成半的力量。拿手科目是社會和自然。"
    }),
    paladin: J('paladin', {
      name: "聖騎士", tier: "inter", recipe: { priest: 30, fighter: 30 }, look: "priest",
      mods: { hp: 1.15, mp: 1.10, atk: 1.15, def: 1.05 }, fav: ["社會", "英語"], bonus: 1.5,
      trait: { dmgTaken: 0.8 }, wf: ["staff", "fist"], af: ["robe", "light"],
      skills: [
        S('pa_shield', 12, "守護之盾", "shield", { t: 2 }, 6, "接下來答錯 2 次都不會痛。", "buff", "#E0F0FF", 800),
        S('pa_fist', 24, "聖光拳", "hit_heal", { p: 2.2, r: 0.15 }, 10, "打一拳，自己也回復一點。", "light", "#FFF3B0", 800),
        S('pa_charge', 36, "光輝衝鋒", "hit", { p: 3.2 }, 15, "全身發光衝過去。", "light", "#FFE9A0", 1000),
        S('pa_vow', 48, "不滅誓約", "revive", { r: 1 }, 22, "這場累倒時，體力全滿站起來。", "light", "#FFFFFF", 1400)
      ],
      desc: "被打的傷害少兩成。拿手科目是社會和英語。"
    }),
    superstar: J('superstar', {
      name: "超級巨星", tier: "inter", recipe: { dancer: 30, bard: 30, jester: 30 }, look: "dancer",
      mods: { hp: 1.10, mp: 1.20, atk: 1.00, def: 0.95 }, fav: ["國語", "數學"], bonus: 1.5,
      trait: { evade: 0.15, mpRegen: 0.05 }, wf: ["dagger", "perform"], af: ["light", "robe"],
      skills: [
        S('ss_entry', 12, "閃亮登場", "atk_up", { m: 1.4, t: 3 }, 6, "大家都在看你！3 次攻擊變強。", "star", "#FFD1F0", 1000),
        S('ss_encore', 24, "安可曲", "heal_mp", { r: 0.5, mp: 0.1 }, 8, "再來一首！回復體力和魔力。", "note", "#FF9AD5", 1000),
        S('ss_wave', 36, "萬人迷光波", "hit_stun", { p: 3, t: 1 }, 16, "閃亮光波，怪物看呆了。", "star", "#FF5CC8", 1100),
        S('ss_concert', 48, "巨星演唱會", "multi", { p: 1.15, n: 4 }, 24, "開一場演唱會，打四下。", "note", "#FFC0F0", 1800)
      ],
      desc: "答錯時有 15% 機會閃過攻擊，打贏後回復 5% 魔力。拿手科目是國語和數學。"
    }),
    monster_hunter: J('monster_hunter', {
      name: "魔物獵人", tier: "inter", recipe: { shepherd: 30, archer: 30 }, look: "shepherd",
      mods: { hp: 1.40, mp: 1.05, atk: 1.15, def: 1.10 }, fav: ["自然", "英語"], bonus: 1.5,
      trait: { bossPow: 1.3 }, wf: ["whip", "dagger"], af: ["light"],
      skills: [
        S('mh_mark', 12, "弱點標記", "charge", { m: 2.2 }, 5, "找到弱點，下一次攻擊變超強。", "debuff", "#FF4D4D", 700),
        S('mh_net', 24, "獵網陷阱", "hit_stun", { p: 1.5, t: 1 }, 10, "撒網抓住怪物。", "debuff", "#A0805A", 900),
        S('mh_triple', 36, "獵人三連射", "multi", { p: 1.2, n: 3 }, 16, "連射三支箭。", "arrow", "#C0A060", 1000),
        S('mh_king', 48, "獵王一擊", "hit", { p: 4.5 }, 24, "專門對付大怪物的一擊。", "slash", "#FF7043", 1200)
      ],
      desc: "打頭目的傷害多三成。拿手科目是自然和英語。"
    }),
    pirate: J('pirate', {
      name: "海盜", tier: "inter", recipe: { archer: 30, sailor: 30 }, look: "sailor",
      mods: { hp: 1.50, mp: 0.95, atk: 1.20, def: 1.20 }, fav: ["英語", "社會"], bonus: 1.5,
      trait: { gold: 1.15, fleeSure: true, dmgTaken: 0.9 }, wf: ["dagger", "axe"], af: ["light", "heavy"],
      skills: [
        S('pi_dance', 12, "彎刀亂舞", "multi", { p: 1, n: 2 }, 6, "揮著彎刀砍兩下。", "slash", "#D0D0D0", 700),
        S('pi_map', 24, "藏寶圖", "steal", { p: 1.5 }, 6, "照著藏寶圖找，拿到怪物的東西。", "coin", "#FFD700", 900),
        S('pi_fireworks', 36, "砲擊齊發", "hit", { p: 3.4 }, 16, "船上的大砲一起放出煙火。", "star", "#FF8C42", 1100),
        S('pi_wave', 48, "七海大浪", "hit", { p: 4.6 }, 24, "七個大海的浪一起來。", "water", "#1565C0", 1400)
      ],
      desc: "被打的傷害少一成，戰鬥拿到的金幣 ×1.15，逃跑一定成功（頭目戰不能逃）。拿手科目是英語和社會。"
    }),
    ranger: J('ranger', {
      name: "遊俠", tier: "inter", recipe: { archer: 30, tamer: 30, merchant: 30 }, look: "archer",
      mods: { hp: 1.30, mp: 1.00, atk: 1.10, def: 1.10 }, fav: ["數學", "自然"], bonus: 1.5,
      trait: { time: 1.2, drop: 1.5, gold: 1.1 }, wf: ["dagger", "whip"], af: ["light"],
      skills: [
        S('ra_arrow', 12, "穿林箭", "hit", { p: 1.9 }, 6, "箭穿過樹林，打中怪物。", "arrow", "#8BC34A", 600),
        S('ra_aid', 24, "野外急救", "heal", { r: 0.55 }, 8, "用野外學到的方法包紮。", "heal", "#A5D6A7", 900),
        S('ra_friend', 36, "森林之友", "pet", { p: 3 }, 15, "森林的動物朋友一起幫忙。", "summon", "#66BB6A", 1200),
        S('ra_rain', 48, "萬箭穿雲", "multi", { p: 0.95, n: 5 }, 24, "好多箭穿過雲飛下來。", "arrow", "#C5E1A5", 1500)
      ],
      desc: "答題時間多兩成，掉寶機會變 1.5 倍，戰鬥拿到的金幣 ×1.1。拿手科目是數學和自然。"
    })
    // ── v2.1 中級職業：到這裡 ──
  };
})();

window.JOB_RULES = {
  // 48 號 1.4：一開始（E2-B）只開有走路圖的 5 個；2026-10-12 新職業走路圖交件（CTO），12 個全開。拿掉 id 就會變成「即將開放」
  // 立志小考與轉職台詞（35 號第十二節；台語組定的 id）。轉職地點的 kind：statue＝慈護宮（temple）、npc＝職業公會（guild）
  trial_dialogs: {
    temple: { locked: "D_TEMPLE_LOCKED", intro: "D_TRIAL_INTRO_TEMPLE", pass: "D_TRIAL_PASS_TEMPLE", fail: "D_TRIAL_FAIL_TEMPLE", again: "D_TRIAL_AGAIN_TEMPLE", lv1: "D_JOB_LV1_TEMPLE", back: "D_JOB_BACK_TEMPLE", intro2: "D_TRIAL2_INTRO_TEMPLE", fail2: "D_TRIAL2_FAIL_TEMPLE" },
    guild: { locked: "D_GUILD_IDLE", intro: "D_TRIAL_INTRO_GUILD", pass: "D_TRIAL_PASS_GUILD", fail: "D_TRIAL_FAIL_GUILD", again: "D_TRIAL_AGAIN_GUILD", lv1: "D_JOB_LV1_GUILD", back: "D_JOB_BACK_GUILD", intro2: "D_TRIAL2_INTRO_GUILD", fail2: "D_TRIAL2_FAIL_GUILD" },
    // v1.3 台北章（62 號 4.5；劇本組草稿）：intro_place＝第一次和志工說話的介紹，bless＝轉職成功的祝福（志工說「這是你自己努力得來的」）
    temple_ht: { locked: "D_TEMPLE_LOCKED_HT", intro: "D_TRIAL_INTRO_HT", pass: "D_TRIAL_PASS_HT", fail: "D_TRIAL_FAIL_HT", again: "D_TRIAL_AGAIN_HT", lv1: "D_JOB_LV1_HT", back: "D_JOB_BACK_HT", bless: "D_TEMPLE_BLESS_HT", intro_place: "D_TEMPLE_HT_INTRO", intro2: "D_TRIAL2_INTRO_HT", fail2: "D_TRIAL2_FAIL_HT" },
    temple_zn: { locked: "D_TEMPLE_LOCKED_ZN", intro: "D_TRIAL_INTRO_ZN", pass: "D_TRIAL_PASS_ZN", fail: "D_TRIAL_FAIL_ZN", again: "D_TRIAL_AGAIN_ZN", lv1: "D_JOB_LV1_ZN", back: "D_JOB_BACK_ZN", bless: "D_TEMPLE_BLESS_ZN", intro_place: "D_TEMPLE_ZN_INTRO", intro2: "D_TRIAL2_INTRO_ZN", fail2: "D_TRIAL2_FAIL_ZN" },
    // v2.0 中部（69 號 5.3；劇本組草稿）：intro_place＝第一次和志工說話的介紹，bless＝轉職成功的祝福（志工說「這是你自己努力得來的」）
    temple_zl: { locked: "D_TEMPLE_LOCKED_ZL", intro: "D_TRIAL_INTRO_ZL", pass: "D_TRIAL_PASS_ZL", fail: "D_TRIAL_FAIL_ZL", again: "D_TRIAL_AGAIN_ZL", lv1: "D_JOB_LV1_ZL", back: "D_JOB_BACK_ZL", bless: "D_TEMPLE_BLESS_ZL", intro_place: "D_TEMPLE_ZL_INTRO", intro2: "D_TRIAL2_INTRO_ZL", fail2: "D_TRIAL2_FAIL_ZL" },
    temple_lk: { locked: "D_TEMPLE_LOCKED_LK", intro: "D_TRIAL_INTRO_LK", pass: "D_TRIAL_PASS_LK", fail: "D_TRIAL_FAIL_LK", again: "D_TRIAL_AGAIN_LK", lv1: "D_JOB_LV1_LK", back: "D_JOB_BACK_LK", bless: "D_TEMPLE_BLESS_LK", intro_place: "D_TEMPLE_LK_INTRO", intro2: "D_TRIAL2_INTRO_LK", fail2: "D_TRIAL2_FAIL_LK" },
    temple_ct: { locked: "D_TEMPLE_LOCKED_CT", intro: "D_TRIAL_INTRO_CT", pass: "D_TRIAL_PASS_CT", fail: "D_TRIAL_FAIL_CT", again: "D_TRIAL_AGAIN_CT", lv1: "D_JOB_LV1_CT", back: "D_JOB_BACK_CT", bless: "D_TEMPLE_BLESS_CT", intro_place: "D_TEMPLE_CT_INTRO", intro2: "D_TRIAL2_INTRO_CT", fail2: "D_TRIAL2_FAIL_CT" },
    temple_wd: { locked: "D_TEMPLE_LOCKED_WD", intro: "D_TRIAL_INTRO_WD", pass: "D_TRIAL_PASS_WD", fail: "D_TRIAL_FAIL_WD", again: "D_TRIAL_AGAIN_WD", lv1: "D_JOB_LV1_WD", back: "D_JOB_BACK_WD", bless: "D_TEMPLE_BLESS_WD", intro_place: "D_TEMPLE_WD_INTRO", intro2: "D_TRIAL2_INTRO_WD", fail2: "D_TRIAL2_FAIL_WD" },
    pet: { cheer: "D_TRIAL_CHEER", wrong: "D_TRIAL_WRONG", fail: "D_TRIAL_FAIL_PET", quit: "D_TRIAL_QUIT_PET" }
  },
  // v2.1：中級職業不放在 open_jobs，由 state.tierOpen.inter（到過鎮瀾宮）和配方決定（Character.isOpen、recipeStatus）
  open_jobs: ["novice", "swordsman", "fighter", "mage", "priest", "dancer", "archer", "bard", "sailor", "shepherd", "jester", "tamer", "merchant"],
  // 48 號 1.5（E3-A）：轉職地點（規則完全一樣）。npc＝和他說話就打開轉職；statue＝站在神像前按 A
  places: [
    { id: "temple_jbl", map: "MT1", kind: "statue", name: "金包里慈護宮" },
    { id: "guild_fc", map: "M10", kind: "npc", npc: "guild", name: "府城古城職業公會" },
    // v1.3 台北章（62 號 4.5）：宮廟志工阿伯主持（不畫神像、不點香、不擲筊、不收費）；規則和慈護宮完全一樣
    { id: "temple_ht", map: "M12", kind: "npc", npc: "temple_volunteer_ht", name: "行天宮" },
    { id: "temple_zn", map: "M13", kind: "npc", npc: "temple_volunteer_zn", name: "指南宮" },
    // v2.0 中部（69 號 5.1）：宮廟志工阿伯主持（不畫神像、不點香、不擲筊、不收費）；規則和慈護宮完全一樣。opensTier＝第一次和志工說話就開放中級職業（state.tierOpen）
    { id: "temple_zl", map: "M18", kind: "npc", npc: "volunteer_zl", name: "鎮瀾宮", opensTier: "inter" },
    { id: "temple_lk", map: "M19", kind: "npc", npc: "volunteer_lk", name: "鹿港天后宮" },
    { id: "temple_ct", map: "M20", kind: "npc", npc: "volunteer_ct", name: "朝天宮" },
    { id: "temple_wd", map: "M20", kind: "npc", npc: "volunteer_wd", name: "武德宮" }
  ],
  growth: { hp: 8, mp: 2, atk: 2, def: 0.5 },   // 48 號 2.1：所有職業一樣
  floor_ratio: 0.5, transfer_step: 0.2,
  master_level: { novice: 10, basic: 30, inter: 50 },   // 出師等級；見習出師才能考 1 轉；中級（v2.1）另看各職業的 recipe（配方職業全部 Lv30）
  tier_mult: { novice: 0.9, basic: 1.0, inter: 1.25 },  // 26 號 5.2：技能職階係數
  exp_mult: { novice: 1, basic: 1, inter: 1.25 },       // v2.1（26 號 2.4）升級需求的職階倍率（exp.js 的 TIER 同一組）
  // v2.1（26 號 3.4、69 號 5.2）2 轉立志小考：20 題（五科各 2 星 2 題＋3 星 2 題）、三上加三下、答對 18 題、時間 50%
  trial_by_tier: { inter: { pass: 18, per_subject: { "2": 2, "3": 2 }, time_ratio: 0.5, term: ["三上", "三下"] } },
  skill_slots: 4,
  trial: { pass: 16, per_subject: { 1: 2, 2: 2 }, time_ratio: 0.75, term: "三上", min_minutes_left: 15 },
  change_map: "M10", change_npc: "guild", unlock_level: 10, change_cost: 0,
  dialog_locked: "D_GUILD_IDLE", dialog_open: "D_GUILD_JOB",
  // v0.9.5 金包里慈護宮（MT1）媽祖神像也能轉職。台詞：進廟時 temple_intro（廟公），
  // 轉職成功配光芒效果時 temple_bless（廟公：「這是你自己努力得來的」），最後 temple_done（番薯仔）
  temple_intro: "D_TEMPLE_INTRO", temple_bless: "D_TEMPLE_BLESS", temple_done: "D_TEMPLE_JOB_DONE"
};
