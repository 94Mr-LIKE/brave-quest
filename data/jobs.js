/*
 * 勇者大冒險 — 職業（07 第 4 節）
 * 撰寫：遊戲劇情設計師＋關卡設計
 *
 * 規則（07 第 4 節）：Lv5 到 M10 府城古城職業公會（npc: guild）轉職，之後可以免費換職。
 * 拿手科目答對傷害 ×1.5。技能耗 MP，而且要「答對才會發動」。
 * 職業只影響戰鬥風格和外觀；所有委託仍需要五科，避免偏科。
 *
 * growth：每升一級的成長。見習冒險者＝07 第 5 節的基準（HP+8、MP+3、ATK+2）；
 *   其他職業是【提議】，加總都和基準一樣是 13 點，只是分配不同，不會有「最強職業」。
 * 主角走路圖 sprite key（CTO 2026-10-07 定案）：女生 sprite_f＝'hero_'＋職業 id，男生 sprite_m＝'heroM_'＋職業 id。
 */
window.PLAYER_BASE = { hp: 30, mp: 10, atk: 6, def: 0 };   // 【假設】Lv1 數值；ATK 6 依 07 指示，HP/MP 是我先定的

window.JOBS = {
  novice: {
    sprite_f: "hero_novice", sprite_m: "heroM_novice",
    name: "見習冒險者", fav_subject: null, bonus: 1.0, unlock_level: 1,
    growth: { hp: 8, mp: 3, atk: 2 },
    skill: null,
    desc: "剛出發的冒險者。什麼都學一點。"
  },
  swordsman: {
    sprite_f: "hero_swordsman", sprite_m: "heroM_swordsman",
    name: "劍士", fav_subject: "數學", bonus: 1.5, unlock_level: 5,
    growth: { hp: 10, mp: 1, atk: 2 },
    skill: { id: "double_slash", name: "連斬", mp: 4, subject: "數學", effect: "double_hit",
             desc: "答一題數學，答對就連打兩下。" },
    desc: "體力和攻擊力比較高。拿手科目是數學。"
  },
  mage: {
    sprite_f: "hero_mage", sprite_m: "heroM_mage",
    name: "魔法師", fav_subject: "自然", bonus: 1.5, unlock_level: 5,
    growth: { hp: 6, mp: 5, atk: 2 },
    skill: { id: "element_magic", name: "元素魔法", mp: 5, subject: "自然", effect: "hit_all",
             desc: "答對一題，打到所有怪物。" },
    desc: "魔力最高。拿手科目是自然。"
  },
  archer: {
    sprite_f: "hero_archer", sprite_m: "heroM_archer",
    name: "弓箭手", fav_subject: "英語", bonus: 1.5, unlock_level: 5,
    growth: { hp: 8, mp: 3, atk: 2 }, speed_bonus: 1.2,
    skill: { id: "first_shot", name: "先制射擊", mp: 3, subject: "英語", effect: "preemptive",
             desc: "戰鬥一開始先答一題，答對就先射一箭。" },
    desc: "動作快，答題時間條多兩成。拿手科目是英語。"
  },
  bard: {
    sprite_f: "hero_bard", sprite_m: "heroM_bard",
    name: "吟遊詩人", fav_subject: "國語", bonus: 1.5, unlock_level: 5,
    growth: { hp: 7, mp: 4, atk: 2 },
    skill: { id: "cheer_song", name: "鼓舞之歌", mp: 3, subject: "國語", effect: "extend_timer", value: 1.5,
             desc: "答對一題，下一題的時間條變成 1.5 倍長。" },
    desc: "會幫自己加油的輔助型。拿手科目是國語。"
  },
  priest: {
    sprite_f: "hero_priest", sprite_m: "heroM_priest",
    name: "祭司", fav_subject: "社會", bonus: 1.5, unlock_level: 5,
    growth: { hp: 7, mp: 4, atk: 2 },
    skill: { id: "heal", name: "治癒", mp: 4, subject: "社會", effect: "heal", value: 0.3,
             desc: "答對一題，回復三成的體力。" },
    desc: "會回復的守護型。拿手科目是社會。"
  }
};

window.JOB_RULES = {
  change_map: "M10", change_npc: "guild", unlock_level: 5, change_cost: 0,
  dialog_locked: "D_GUILD_IDLE", dialog_open: "D_GUILD_JOB"
};
