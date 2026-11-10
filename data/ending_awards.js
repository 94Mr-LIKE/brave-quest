/* v4.2 第 4b 批：勇者之證、冒險者勳章（大結局腳本 5.3–5.7；B 組；見習＝銅定案）。
 * tools/v42_apply.js 由 O/wip_v42/dialogs_v42_fill.js 的 ENDING_AWARDS、CERT_BOOK_RULE_4B 產生，不要手改。
 * 金屬一律由 jobs[職業].metal 取得（存檔不存金屬）；book_rule.hide_if_no_job：JOBS 裡沒有的職業先不顯示格子。
 */
window.ENDING_AWARDS = {
 "title": "勇者之證",
 "subtitle": "點亮曙光的人",
 "signer": "金包里　里長伯",
 "body": [
  "你走遍了臺灣，用學會的知識幫助大家，",
  "點亮了第一道曙光。"
 ],
 "cert_bg": "assets/ending/cert_v1_bg.webp",
 "medal_name": "冒險者勳章",
 "medal_img": "assets/ending/medals/{id}_{metal}.webp",
 "tier_name": {
  "novice": "",
  "basic": "初級職業",
  "inter": "中級職業",
  "adv": "高級職業"
 },
 "metal_name": {
  "copper": "銅",
  "silver": "銀",
  "platinum": "白金",
  "gold": "黃金"
 },
 "jobs": {
  "novice": {
   "tier": "novice",
   "metal": "copper",
   "praise": "一步一步勇敢前進的見習冒險者",
   "medal": [
    "item_wood_sword"
   ],
   "color": "#78be3c"
  },
  "swordsman": {
   "tier": "basic",
   "metal": "copper",
   "praise": "用勇氣守護大家的劍士",
   "medal": [
    "item_steel_sword"
   ],
   "color": "#2c5cb0"
  },
  "fighter": {
   "tier": "basic",
   "metal": "copper",
   "praise": "反應又快又準、從不放棄的武鬥家",
   "medal": [
    "item_gloves"
   ],
   "color": "#d64028"
  },
  "mage": {
   "tier": "basic",
   "metal": "copper",
   "praise": "用知識變出魔法的魔法師",
   "medal": [
    "item_staff"
   ],
   "color": "#8040b0"
  },
  "priest": {
   "tier": "basic",
   "metal": "copper",
   "praise": "用溫柔的光照顧大家的祭司",
   "medal": [
    "item_rod"
   ],
   "color": "#40b496"
  },
  "dancer": {
   "tier": "basic",
   "metal": "copper",
   "praise": "用輕快舞步帶來笑容的舞者",
   "medal": [
    "item_ribbon_fan"
   ],
   "color": "#e2568c"
  },
  "archer": {
   "tier": "basic",
   "metal": "copper",
   "praise": "看得清楚、射得又準的弓箭手",
   "medal": [
    "item_bow"
   ],
   "color": "#22783c"
  },
  "bard": {
   "tier": "basic",
   "metal": "copper",
   "praise": "用歌聲為大家加油的吟遊詩人",
   "medal": [
    "item_harp"
   ],
   "color": "#e68c1e"
  },
  "sailor": {
   "tier": "basic",
   "metal": "copper",
   "praise": "不怕大風大浪、勇往直前的船員",
   "medal": [
    "item_anchor_axe"
   ],
   "color": "#1c306e"
  },
  "shepherd": {
   "tier": "basic",
   "metal": "copper",
   "praise": "和動物朋友同心協力的牧羊人",
   "medal": [
    "item_whip"
   ],
   "color": "#64a032"
  },
  "jester": {
   "tier": "basic",
   "metal": "copper",
   "praise": "把歡笑帶給每個人的搞笑藝人",
   "medal": [
    "item_clapper"
   ],
   "color": "#d6aa14"
  },
  "tamer": {
   "tier": "basic",
   "metal": "copper",
   "praise": "和魔物朋友心連心的魔物大師",
   "medal": [
    "item_tamer_whip"
   ],
   "color": "#8c5a32"
  },
  "merchant": {
   "tier": "basic",
   "metal": "copper",
   "praise": "算得清楚、待人誠實的商人",
   "medal": [
    "item_abacus_dagger"
   ],
   "color": "#b08030"
  },
  "battle_master": {
   "tier": "inter",
   "metal": "silver",
   "praise": "劍和拳都練得很用心的戰鬥大師",
   "medal": [
    "item_steel_sword",
    "item_gloves"
   ],
   "color": "#a01828"
  },
  "magic_knight": {
   "tier": "inter",
   "metal": "silver",
   "praise": "劍和魔法都認真學會的魔法戰士",
   "medal": [
    "item_steel_sword",
    "item_staff"
   ],
   "color": "#3c3296"
  },
  "sage": {
   "tier": "inter",
   "metal": "silver",
   "praise": "用智慧和溫柔幫助大家的賢者",
   "medal": [
    "item_rod",
    "item_staff"
   ],
   "color": "#5a2882"
  },
  "paladin": {
   "tier": "inter",
   "metal": "silver",
   "praise": "總是站在前面保護大家的聖騎士",
   "medal": [
    "item_rod",
    "item_gloves"
   ],
   "color": "#46a0dc"
  },
  "superstar": {
   "tier": "inter",
   "metal": "silver",
   "praise": "用表演帶給大家勇氣的超級巨星",
   "medal": [
    "item_ribbon_fan",
    "item_harp",
    "item_clapper"
   ],
   "color": "#d22896"
  },
  "monster_hunter": {
   "tier": "inter",
   "metal": "silver",
   "praise": "面對大怪物也不退縮的魔物獵人",
   "medal": [
    "item_whip",
    "item_bow"
   ],
   "color": "#1e503c"
  },
  "pirate": {
   "tier": "inter",
   "metal": "silver",
   "praise": "勇敢航向大海、守護夥伴的海盜",
   "medal": [
    "item_bow",
    "item_anchor_axe"
   ],
   "color": "#14285a"
  },
  "ranger": {
   "tier": "inter",
   "metal": "silver",
   "praise": "走遍山林、熟悉大自然的遊俠",
   "medal": [
    "item_bow",
    "item_tamer_whip",
    "item_abacus_dagger"
   ],
   "color": "#6e7832"
  },
  "god_hand": {
   "tier": "adv",
   "metal": "platinum",
   "praise": "用雙手守護每一個人的神之手",
   "medal": [
    "item_gloves",
    "item_steel_sword",
    "item_rod"
   ],
   "color": "#d2781e"
  },
  "thunder_sage": {
   "tier": "adv",
   "metal": "platinum",
   "praise": "知識像雷聲一樣響亮的天地雷鳴士",
   "medal": [
    "item_staff",
    "item_rod",
    "item_harp"
   ],
   "color": "#7846c8"
  },
  "hero": {
   "tier": "adv",
   "metal": "gold",
   "praise": "把勇氣和知識帶到每個地方的勇者",
   "medal": [
    "item_steel_sword",
    "item_staff",
    "item_bow",
    "item_ribbon_fan"
   ],
   "special": true,
   "title_id": "legend_hero",
   "title": "傳說中的勇者",
   "medal_name": "勇者勳章",
   "cert_bg": "assets/ending/cert_hero_bg.webp",
   "medal_img": "assets/ending/medals/hero_gold.webp",
   "body": [
    "你學會了戰鬥大師、賢者、遊俠、超級巨星的本領，",
    "用勇氣和知識守護了大家。"
   ],
   "witnesses": [
    "npc_elf_elder",
    "npc_gnome_chief",
    "npc_orc_chief",
    "npc_goblin_chief",
    "npc_reservoir_keeper",
    "npc_old_stationmaster",
    "npc_lighthouse_keeper",
    "npc_balloon_captain"
   ],
   "color": "#d6961e"
  }
 },
 "order": [
  "novice",
  "swordsman",
  "fighter",
  "mage",
  "priest",
  "dancer",
  "archer",
  "bard",
  "sailor",
  "shepherd",
  "jester",
  "tamer",
  "merchant",
  "battle_master",
  "magic_knight",
  "sage",
  "paladin",
  "superstar",
  "monster_hunter",
  "pirate",
  "ranger",
  "god_hand",
  "thunder_sage",
  "hero"
 ],
 "medal_icon": "assets/ending/medals/{id}_{metal}_{size}.png",
 "book_rule": {
  "hide_if_no_job": [
   "god_hand",
   "thunder_sage",
   "hero"
  ],
  "count_shown_only": true
 }
};
