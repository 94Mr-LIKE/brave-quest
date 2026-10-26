/*
 * 勇者大冒險 — v1.3.1 台語氣象諺語（劇本語音組 2026-10-25；由 wip_v131/v131_apply.js 從 wip_v131_draft/dialogs_proverbs.js 產生，請改草稿再重跑）
 * PROVERBS：諺語清冊（手帳「諺語」頁）。kind：經驗＝有氣象署資料／民間說法／民間傳說；science、sources＝查證出處（給大人看，遊戲不顯示網址）
 * PROVERB_QUIZ：挑錯關卡。收集到 proverb 以後再找同一位阿伯；answer＝錯的那一句在 options 的位置（從 0 算）
 */
window.PROVERBS = [
  {
    "id": "PV_01",
    "dialog": "D_PV_01",
    "map": "M14",
    "npc": "levee_uncle",
    "hanji": "龜山戴烏帽，連鞭雨著落。",
    "tailo": "Ku-suann tì oo-bō, nā-mi̍h hōo tio̍h lo̍h.",
    "huayu": "龜山戴上黑帽子，雨馬上就下來。",
    "kind": "民間說法",
    "science": "民間說法。氣象署宜蘭站資料只寫宜蘭秋冬面迎東北季風、12 月到隔年 4 月有綿綿細雨，沒有說明「龜山戴帽」。",
    "sources": [
      "https://www.cwa.gov.tw/V8/C/A/organ/46708.html"
    ]
  },
  {
    "id": "PV_02",
    "dialog": "D_PV_02",
    "map": "M49",
    "npc": "trail_volunteer",
    "hanji": "米甕仔無米，三貂角嘛毋通去。",
    "tailo": "Bí-àng-á bô bí, Sam-tiau-kak mā m̄-thang khì.",
    "huayu": "米缸沒米了，也不可以去三貂角。",
    "kind": "經驗",
    "science": "氣象署：東北季風 10 月以後漸穩定、12–2 月最盛；臺灣東北部是迎風面，東北季風和颱風相互作用時會帶來強風豪雨。番薯仔只說到這些（技術長 2026-10-25 裁定用保守寫法）；諺語說的風浪兇險是原意，氣象署沒有針對三貂角的說明。",
    "sources": [
      "https://edu.cwa.gov.tw/PopularScience/wt/wt_3.html",
      "https://edu.cwa.gov.tw/PopularScience/kids/wt/wt_11.html"
    ]
  },
  {
    "id": "PV_03",
    "dialog": "D_PV_03",
    "map": "M53",
    "npc": "bt_museum_guide",
    "hanji": "淡水這號天，雨傘倚門邊。",
    "tailo": "Tām-tsuí tsit-lō thinn, hōo-suànn uá mn̂g-pinn.",
    "huayu": "淡水這種天氣，雨傘靠在門邊。",
    "kind": "民間說法",
    "science": "民間說法（沒有找到氣象署說明這句的資料）。",
    "sources": []
  },
  {
    "id": "PV_04",
    "dialog": "D_PV_04",
    "map": "M50",
    "npc": "scallion_farmer",
    "hanji": "西北雨，落袂過田岸。",
    "tailo": "Sai-pak-hōo, lo̍h bē kuè tshân-huānn.",
    "huayu": "西北雨下不過田埂。",
    "kind": "經驗",
    "science": "氣象署：夏季午後驟雨經常雷聲大作，來得快去得也快，常見的諺語「西北雨，落不過田埂」就是形容這種天氣；有時隔著一條大街就沒有下雨。",
    "sources": [
      "https://edu.cwa.gov.tw/PopularScience/wt/wt_4.html",
      "https://pweb.cwa.gov.tw/PopularScience/wt/wt_21.html",
      "https://south.cwa.gov.tw/file-manager/file/lecture/2015%E5%B9%B4%E5%9C%8B%E4%B8%AD%E5%B0%8F%E6%95%99%E5%B8%AB%E7%A0%94%E7%BF%92%E7%87%9F/%E9%96%A9%E5%8D%97%E6%B0%A3%E8%B1%A1%E8%AB%BA%E8%AA%9E.pdf"
    ]
  },
  {
    "id": "PV_05",
    "dialog": "D_PV_05",
    "map": "M52",
    "npc": "tea_farmer",
    "hanji": "春天，囡仔面。",
    "tailo": "Tshun-thinn, gín-á bīn.",
    "huayu": "春天就像小孩子的臉。",
    "kind": "經驗",
    "science": "氣象署：「春無三日晴」形容臺灣春季天氣善變，前一刻還晴天，下一刻卻突然下起雨來；春季冷暖氣團相遇形成鋒面。",
    "sources": [
      "https://edu.cwa.gov.tw/PopularScience/wt/wt_4.html",
      "https://climate.cwa.gov.tw/SeasonalClimate?subpage=Spring",
      "https://south.cwa.gov.tw/file-manager/file/lecture/2015%E5%B9%B4%E5%9C%8B%E4%B8%AD%E5%B0%8F%E6%95%99%E5%B8%AB%E7%A0%94%E7%BF%92%E7%87%9F/%E9%96%A9%E5%8D%97%E6%B0%A3%E8%B1%A1%E8%AB%BA%E8%AA%9E.pdf"
    ]
  },
  {
    "id": "PV_06",
    "dialog": "D_PV_06",
    "map": "M46",
    "npc": "calla_farmer",
    "hanji": "罩雺罩袂開，戴笠披棕蓑。",
    "tailo": "Tà-bông tà bē khui, tì le̍h phi tsang-sui.",
    "huayu": "霧罩著散不開，戴斗笠、披蓑衣。",
    "kind": "民間說法",
    "science": "民間說法（沒有找到氣象署說明這句的資料）。",
    "sources": []
  },
  {
    "id": "PV_07",
    "dialog": "D_PV_07",
    "map": "M02",
    "npc": "potato_seller",
    "hanji": "狗蟻搬徙走，大雨欲來到。",
    "tailo": "Káu-hiā puann-suá tsáu, tuā-hōo beh lâi kàu.",
    "huayu": "螞蟻搬家跑走，大雨快要來了。",
    "kind": "民間說法",
    "science": "民間說法（沒有找到氣象署說明螞蟻搬家和下雨關係的資料）。",
    "sources": []
  },
  {
    "id": "PV_08",
    "dialog": "D_PV_08",
    "map": "MT1",
    "npc": "temple_keeper",
    "hanji": "大道公風，媽祖婆雨。",
    "tailo": "Tāi-tō-kong hong, Má-tsóo-pô hōo.",
    "huayu": "大道公的風，媽祖婆的雨。",
    "kind": "民間傳說",
    "science": "民間傳說。教育部辭典「媽祖婆」條：民間傳說保生大帝在媽祖誕辰（農曆三月二十三）降大雨，媽祖在大帝誕辰（三月十五）颳大風。不是氣象知識。",
    "sources": []
  },
  {
    "id": "PV_09",
    "dialog": "D_PV_09",
    "map": "M12",
    "npc": "dihua_shop",
    "hanji": "未食五日節粽，破裘毋甘放。",
    "tailo": "Buē tsia̍h Gōo-ji̍t-tseh tsàng, phuà hiû m̄-kam pàng.",
    "huayu": "還沒吃端午節的粽子，舊冬衣捨不得收。",
    "kind": "民間說法",
    "science": "民間說法。教育部辭典：指未過端午節前，天氣雖然很熱，但冬衣還不能收起來。氣象署南區中心教材有列這句，但沒有說明。",
    "sources": [
      "https://south.cwa.gov.tw/file-manager/file/lecture/2015%E5%B9%B4%E5%9C%8B%E4%B8%AD%E5%B0%8F%E6%95%99%E5%B8%AB%E7%A0%94%E7%BF%92%E7%87%9F/%E9%96%A9%E5%8D%97%E6%B0%A3%E8%B1%A1%E8%AB%BA%E8%AA%9E.pdf"
    ]
  },
  {
    "id": "PV_10",
    "dialog": "D_PV_10",
    "map": "M47",
    "npc": "harbor_uncle",
    "hanji": "九月颱，無人知。",
    "tailo": "Káu-gue̍h thai, bô lâng tsai.",
    "huayu": "九月的颱風，沒有人知道。",
    "kind": "經驗",
    "science": "氣象署《颱風百問》第 100 題：農曆 9 月（國曆 10 月）以後受東北季風影響，颱風來襲前的徵兆不明顯或消失，不能根據天候徵兆判斷颱風會不會來。",
    "sources": [
      "https://www.cwa.gov.tw/V8/C/K/Encyclopedia/typhoon/typhoon.pdf"
    ]
  }
];

window.PROVERB_QUIZ = [
  {
    "id": "PVQ_1",
    "proverb": "PV_04",
    "map": "M50",
    "npc": "scallion_farmer",
    "options": [
      "西北雨下不過田埂",
      "所以會下一整天",
      "兩句都沒錯"
    ],
    "answer": 1,
    "ask": "D_PVQ_1_ASK",
    "right": "D_PVQ_1_RIGHT",
    "wrong": "D_PVQ_1_WRONG"
  },
  {
    "id": "PVQ_2",
    "proverb": "PV_07",
    "map": "M02",
    "npc": "potato_seller",
    "options": [
      "螞蟻搬家跑走",
      "一定會下大雨，這是科學",
      "兩句都沒錯"
    ],
    "answer": 1,
    "ask": "D_PVQ_2_ASK",
    "right": "D_PVQ_2_RIGHT",
    "wrong": "D_PVQ_2_WRONG"
  },
  {
    "id": "PVQ_3",
    "proverb": "PV_01",
    "map": "M14",
    "npc": "levee_uncle",
    "options": [
      "龜山戴上黑帽子",
      "臺北雨馬上就下來",
      "兩句都沒錯"
    ],
    "answer": 1,
    "ask": "D_PVQ_3_ASK",
    "right": "D_PVQ_3_RIGHT",
    "wrong": "D_PVQ_3_WRONG"
  },
  {
    "id": "PVQ_4",
    "proverb": "PV_08",
    "map": "MT1",
    "npc": "temple_keeper",
    "options": [
      "大道公的風，媽祖婆的雨",
      "這是天氣預報說的",
      "兩句都沒錯"
    ],
    "answer": 1,
    "ask": "D_PVQ_4_ASK",
    "right": "D_PVQ_4_RIGHT",
    "wrong": "D_PVQ_4_WRONG"
  },
  {
    "id": "PVQ_5",
    "proverb": "PV_10",
    "map": "M47",
    "npc": "harbor_uncle",
    "options": [
      "九月的颱風沒人知道",
      "所以九月都不會有颱風",
      "兩句都沒錯"
    ],
    "answer": 1,
    "ask": "D_PVQ_5_ASK",
    "right": "D_PVQ_5_RIGHT",
    "wrong": "D_PVQ_5_WRONG"
  }
];
