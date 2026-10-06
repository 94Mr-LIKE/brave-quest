/*
 * 範例題庫（每科 3 題，涵蓋 choice / multi / number / order 四種題型）
 * 只有在 data/questions.js 沒有載入（window.QUESTIONS 未定義）時才會使用。
 * 題目全部原創，source_ref 只標出版社、冊別、單元名稱，不標頁碼、不重製課文。
 * 單元名稱依 01_課本版本調查.md（115 學年度三上：翰林；英語何嘉仁 Super Fun 1）。
 */
if (typeof window.QUESTIONS === 'undefined') {
  window.QUESTIONS = [
    // ---------------- 國語
    {
      id: 'CH-3A-01-001', subject: '國語', publisher: '翰林', term: '三上', unit: '第壹單元 運用時間',
      source_ref: '翰林 三上 國語 第壹單元〈運用時間〉', level: 1, type: 'choice',
      scene: '墨香姨說：「我的店員小安每天都比開店時間早到，從來不拖拖拉拉。」',
      stem: '哪一個詞語最適合用來形容小安？',
      options: ['準時', '慢吞吞', '遲到', '健忘'], answer: 0,
      hints: ['第1層：重讀「比開店時間早到」「不拖拖拉拉」這兩個地方。', '第2層：早到的人，是「來得太晚」還是「按照時間到」呢？', '第3層：把每個詞放進「小安很＿＿」，哪一個和「早到」的意思一樣？'],
      explanation: '「準時」是按照約定的時間到，小安每天都早到，所以很準時。',
      variant_group: 'CH-time-word-1', exp: 10, tts_lang: 'zh-TW'
    },
    {
      id: 'CH-3A-01-002', subject: '國語', publisher: '翰林', term: '三上', unit: '第壹單元 運用時間',
      source_ref: '翰林 三上 國語 第壹單元〈運用時間〉', level: 2, type: 'order',
      scene: '書店的便條紙被風吹散了，句子的順序亂掉了。',
      stem: '請依序點選，把句子排成通順的一句話。',
      options: ['提早十分鐘', '出門上學', '我每天都'], answer: [2, 0, 1],
      hints: ['第1層：一句話通常先說「誰」，再說「做什麼」。', '第2層：哪一張卡片說的是「誰」？先點它。', '第3層：「什麼時候」出門？把說時間的卡片放在「出門上學」前面。'],
      explanation: '「我每天都提早十分鐘出門上學」：先說誰，再說什麼時候，最後說做什麼。',
      variant_group: 'CH-sentence-order-1', exp: 20, tts_lang: 'zh-TW'
    },
    {
      id: 'CH-3A-02-001', subject: '國語', publisher: '翰林', term: '三上', unit: '第貳單元 解決問題',
      source_ref: '翰林 三上 國語 第貳單元〈解決問題〉', level: 2, type: 'multi',
      scene: '墨香姨的書架卡住了，打不開。她想找出好辦法。',
      stem: '遇到問題時，哪些是好的做法？請選出所有正確的，再按「完成」。',
      options: ['先想一想問題出在哪裡', '生氣地用力踢書架', '請別人一起想辦法', '試試看不同的方法'], answer: [0, 2, 3],
      hints: ['第1層：好的做法會讓問題「變好」，不會讓事情更糟。', '第2層：用力踢書架，書架可能會怎麼樣？', '第3層：一個一個問自己：「這樣做，問題會比較容易解決嗎？」'],
      explanation: '先找原因、請人幫忙、多試幾種方法，都能幫助解決問題；生氣踢東西只會更糟。',
      variant_group: 'CH-problem-1', exp: 20, tts_lang: 'zh-TW'
    },

    // ---------------- 英語
    {
      id: 'EN-3A-L1-001', subject: '英語', publisher: '何嘉仁', term: '三上', unit: 'Lesson 1 Name',
      source_ref: '何嘉仁 三上 英語 Super Fun 1 Lesson 1〈Name〉', level: 1, type: 'choice',
      scene: 'Emma 揮揮手說：Hi! I\'m Emma.',
      stem: 'Emma 想知道你的名字，她會怎麼問？',
      options: ['What\'s your name?', 'How old are you?', 'Are you tired?', 'I\'m short.'], answer: 0,
      hints: ['第1層：找一找有 name（名字）這個字的句子。', '第2層：問問題的句子，最後面會有哪一個符號？', '第3層：「How old」是在問年紀，「name」是在問什麼？'],
      explanation: 'What\'s your name? 是「你叫什麼名字？」',
      variant_group: 'EN-name-1', exp: 10, tts_lang: 'en-US'
    },
    {
      id: 'EN-3A-L2-001', subject: '英語', publisher: '何嘉仁', term: '三上', unit: 'Lesson 2 Number',
      source_ref: '何嘉仁 三上 英語 Super Fun 1 Lesson 2〈Number〉', level: 1, type: 'number',
      scene: '你問 Emma 的妹妹：How old are you? 她笑著說：I\'m nine.',
      stem: '妹妹說她自己幾歲？請用數字鍵盤輸入。',
      answer: 9, unit_label: '歲',
      hints: ['第1層：注意聽 I\'m 後面的那個字。', '第2層：nine 是哪一個數字？可以從 one, two, three… 數下去。', '第3層：seven、eight 之後是什麼？'],
      explanation: 'nine 就是 9，I\'m nine. 是「我九歲」。',
      variant_group: 'EN-number-1', exp: 10, tts_lang: 'en-US'
    },
    {
      id: 'EN-3A-L4-001', subject: '英語', publisher: '何嘉仁', term: '三上', unit: 'Lesson 4 Feelings',
      source_ref: '何嘉仁 三上 英語 Super Fun 1 Lesson 4〈Feelings〉', level: 2, type: 'multi',
      scene: 'Emma 在寫旅行日記，她想記下今天的心情。',
      stem: '哪些英文字是在說「感覺、心情」？請選出所有正確的，再按「完成」。',
      options: ['happy', 'tired', 'short', 'sad'], answer: [0, 1, 3],
      hints: ['第1層：想一想，哪些字可以放在「我覺得……」後面？', '第2層：short 是在說身高，還是心情？', '第3層：happy 是開心，sad 是難過，tired 呢？累的時候是一種感覺嗎？'],
      explanation: 'happy（開心）、tired（累）、sad（難過）都是感覺；short（矮）是在說外表。',
      variant_group: 'EN-feelings-1', exp: 20, tts_lang: 'en-US'
    },

    // ---------------- 數學
    {
      id: 'MA-3A-07-001', subject: '數學', publisher: '翰林', term: '三上', unit: '7 公斤與公克',
      source_ref: '翰林 三上 數學 第7單元〈公斤與公克〉', level: 1, type: 'number',
      scene: '海生伯把一條魚放上秤：「指針停在 1 公斤再多 250 公克的地方。」',
      stem: '這條魚一共重幾公克？',
      answer: 1250, unit_label: '公克',
      hints: ['第1層：題目要的單位是「公克」，先把公斤換成公克。', '第2層：1 公斤等於幾公克？', '第3層：1 公斤換成公克以後，再加上多出來的 250 公克是多少？'],
      explanation: '1 公斤 = 1000 公克，1000 + 250 = 1250 公克。',
      variant_group: 'MA-kg-g-1', exp: 10, tts_lang: 'zh-TW'
    },
    {
      id: 'MA-3A-07-002', subject: '數學', publisher: '翰林', term: '三上', unit: '7 公斤與公克',
      source_ref: '翰林 三上 數學 第7單元〈公斤與公克〉', level: 1, type: 'number',
      scene: '一籃小卷秤起來是 2 公斤 300 公克，客人想知道是幾公克。',
      stem: '這籃小卷一共重幾公克？',
      answer: 2300, unit_label: '公克',
      hints: ['第1層：先把「2 公斤」換成公克。', '第2層：1 公斤是 1000 公克，那 2 公斤是幾公克？', '第3層：把 2 公斤換成的公克數，再加上 300 公克。'],
      explanation: '2 公斤 = 2000 公克，2000 + 300 = 2300 公克。',
      variant_group: 'MA-kg-g-1', exp: 10, tts_lang: 'zh-TW'
    },
    {
      id: 'MA-3A-08-001', subject: '數學', publisher: '翰林', term: '三上', unit: '8 分數',
      source_ref: '翰林 三上 數學 第8單元〈分數〉', level: 2, type: 'choice',
      scene: '海生伯把一條長長的魚乾平分成 4 段，送你 1 段。',
      stem: '你拿到的是這條魚乾的幾分之幾？',
      options: ['4 分之 1', '1 分之 4', '4 分之 3', '2 分之 1'], answer: 0,
      hints: ['第1層：重讀「平分成 4 段」「送你 1 段」。', '第2層：分母是「一共平分成幾份」，分子是「拿了幾份」。', '第3層：一共幾份？你拿了幾份？依照「幾分之幾」的順序說說看。'],
      explanation: '平分成 4 份，拿 1 份，就是 4 分之 1。',
      variant_group: 'MA-fraction-1', exp: 20, tts_lang: 'zh-TW'
    },

    // ---------------- 自然
    {
      id: 'SC-3A-02-001', subject: '自然', publisher: '翰林', term: '三上', unit: '二、磁鐵好好玩',
      source_ref: '翰林 三上 自然 二、磁鐵好好玩', level: 1, type: 'choice',
      scene: '湯博士拿著一塊磁鐵：「我們來猜猜看，誰會被吸過來？」',
      stem: '下面哪一樣東西會被磁鐵吸住？',
      options: ['鐵做的迴紋針', '木頭筷子', '塑膠尺', '玻璃彈珠'], answer: 0,
      hints: ['第1層：注意每樣東西是用什麼材料做的。', '第2層：磁鐵會吸住哪一種材料？', '第3層：木頭、塑膠、玻璃、鐵，哪一個是金屬？'],
      explanation: '磁鐵會吸住鐵做的東西，迴紋針是鐵做的。',
      variant_group: 'SC-magnet-1', exp: 10, tts_lang: 'zh-TW'
    },
    {
      id: 'SC-3A-02-002', subject: '自然', publisher: '翰林', term: '三上', unit: '二、磁鐵好好玩',
      source_ref: '翰林 三上 自然 二、磁鐵好好玩', level: 2, type: 'multi',
      scene: '湯博士的工具箱打翻了，他想用磁鐵把東西撿起來。',
      stem: '哪些東西可以被磁鐵吸起來？請選出所有正確的，再按「完成」。',
      options: ['鐵釘', '橡皮擦', '鐵湯匙', '紙杯'], answer: [0, 2],
      hints: ['第1層：答案可能不只一個喔。', '第2層：先把「鐵做的」東西找出來。', '第3層：橡皮擦和紙杯是用什麼做的？它們有鐵嗎？'],
      explanation: '鐵釘和鐵湯匙是鐵做的，會被磁鐵吸起來。',
      variant_group: 'SC-magnet-1', exp: 20, tts_lang: 'zh-TW'
    },
    {
      id: 'SC-3A-04-001', subject: '自然', publisher: '翰林', term: '三上', unit: '四、奇妙的溶解',
      source_ref: '翰林 三上 自然 四、奇妙的溶解', level: 3, type: 'order',
      scene: '湯博士想看看糖在水裡會不會溶解，請你幫忙做實驗。',
      stem: '請依照正確的實驗順序點選。',
      options: ['用攪拌棒攪一攪，觀察糖還看不看得到', '在杯子裡倒入一定量的水', '放入一小匙糖'], answer: [1, 2, 0],
      hints: ['第1層：做實驗前，杯子裡要先有什麼？', '第2層：還沒放糖之前，可以先攪拌嗎？', '第3層：想一想「先準備 → 再放東西 → 最後觀察」。'],
      explanation: '先倒水，再放糖，最後攪拌並觀察，這樣才看得出糖有沒有溶解。',
      variant_group: 'SC-dissolve-1', exp: 35, tts_lang: 'zh-TW'
    },

    // ---------------- 社會
    {
      id: 'SO-3A-02-001', subject: '社會', publisher: '翰林', term: '三上', unit: '第二單元 校園規範和班級自治',
      source_ref: '翰林 三上 社會 第二單元〈校園規範和班級自治〉', level: 1, type: 'choice',
      scene: '石里長說：「社區要選一位小志工隊長，大家想想怎麼選比較好。」',
      stem: '下面哪一種選隊長的方法最公平？',
      options: ['大家投票決定', '只讓里長的孫子當', '誰最大聲誰就當', '乾脆不要選'], answer: 0,
      hints: ['第1層：「公平」是讓每個人都有機會表達意見。', '第2層：哪一個方法，每個人都可以說出自己的選擇？', '第3層：只由一個人決定，或比誰大聲，其他人有機會說話嗎？'],
      explanation: '投票讓每個人都能表達意見，是比較公平的方法。',
      variant_group: 'SO-fair-1', exp: 10, tts_lang: 'zh-TW'
    },
    {
      id: 'SO-3A-04-001', subject: '社會', publisher: '翰林', term: '三上', unit: '第四單元 健康成長的快樂童年',
      source_ref: '翰林 三上 社會 第四單元〈健康成長的快樂童年〉', level: 2, type: 'order',
      scene: '要走到對面的古道入口，得先過馬路。',
      stem: '安全過馬路的步驟是什麼？請依序點選。',
      options: ['左右看看有沒有車', '走到斑馬線前停下來', '確定安全後，走斑馬線過馬路'], answer: [1, 0, 2],
      hints: ['第1層：過馬路前，要先站在哪裡？', '第2層：停下來以後，要用眼睛做什麼？', '第3層：什麼時候才可以開始走？'],
      explanation: '先在斑馬線前停下來，左右看清楚，確定安全再走斑馬線。',
      variant_group: 'SO-safety-1', exp: 20, tts_lang: 'zh-TW'
    },
    {
      id: 'SO-3A-04-002', subject: '社會', publisher: '翰林', term: '三上', unit: '第四單元 健康成長的快樂童年',
      source_ref: '翰林 三上 社會 第四單元〈健康成長的快樂童年〉', level: 2, type: 'multi',
      scene: '石里長在社區上課：「在網路上，也要保護好自己喔！」',
      stem: '哪些是保護自己隱私的好做法？請選出所有正確的，再按「完成」。',
      options: ['不在網路上寫出自己家的地址', '把密碼告訴不認識的人', '別人想看我的日記，要先問過我', '玩遊戲時用冒險者名字，不用真名'], answer: [0, 2, 3],
      hints: ['第1層：隱私是「自己的事，自己決定要不要讓別人知道」。', '第2層：不認識的人知道你的密碼，會發生什麼事？', '第3層：一個一個問：「這樣做，我的個人資料比較安全嗎？」'],
      explanation: '不公開地址、日記要經過同意、用冒險者名字，都是保護隱私；密碼不能給陌生人。',
      variant_group: 'SO-privacy-1', exp: 20, tts_lang: 'zh-TW'
    }
  ];
}
