# 世界內容資料格式（勇者大冒險）

- 給前端對照用。依據：`07_設計改版v0.2_多地圖冒險.md` 第 6 節。
- 本文件列出七個資料檔的**全部欄位**。標「（新增）」的欄位不在 6 節規格裡，是內容端加的；前端不讀也不會壞。
- 所有檔案都寫成 `window.XXX = …`，依序載入即可。
- 驗證指令：`node tests/validate_world.js`。結束碼 0＝通過。

| 檔案 | 全域變數 |
|---|---|
| `maps.js` | `window.MAPS` |
| `world.js` | `window.WORLD`（新增，世界地圖） |
| `quests.js` | `window.QUESTS` |
| `dialogs.js` | `window.DIALOGS`、`window.SPEAKERS`（新增） |
| `monsters.js` | `window.MONSTERS` |
| `items.js` | `window.ITEMS`、`window.SHOPS`（新增） |
| `jobs.js` | `window.JOBS`、`window.PLAYER_BASE`（新增）、`window.JOB_RULES`（新增） |

座標一律是 `x`＝欄、`y`＝列，從 0 開始算。

---

## 1. 地圖 `window.MAPS`

鍵是地圖 ID（`M01`–`M11`）。

| 欄位 | 型別 | 說明 |
|---|---|---|
| `name` | 字串 | 地圖中文名 |
| `type` | 字串 | `village`／`field`／`tribe`／`dungeon`／`town`／`castle` |
| `level` | 數字 1–5 | 地圖等級，用來決定 EXP 係數（1.0／1.1／1.2／1.3／1.5） |
| `bgm` | 字串 | 背景音樂 key |
| `battle_bg` | 字串 | 戰鬥背景 key：`grass`／`forest`／`swamp`／`cave`／`rock`／`town`／`harbor`／`castle`／`castle_top` |
| `tileset` | 字串 | 圖塊組：`village`／`field`／`forest`／`swamp`／`cave`／`town`／`castle` |
| `grid` | 字串陣列 | 文字格子，每個字元是一格，每列等長，尺寸在 24×14 到 32×20 之間。字元圖例見下表 |
| `real_ref` | 字串 | （新增）參考的真實地點 |
| `art_note` | 字串 | （新增）給美術依格子畫整張背景圖的文字說明 |
| `start` | `{x,y}` | （新增）M01：新遊戲的出生點。有車站的地圖：下車位置（和 world.js 的 tx, ty 相同，讓只讀 `start` 的引擎也能正確落點） |
| `station` | `{x,y,name}` | （新增）車站。站上去互動就打開世界地圖（world.js）；不擋路 |
| `places` | 陣列 | （新增，只有 M01 有）`{name,x,y,w,h}` 設施範圍，給美術與任務日誌標示用 |
| `exits` | 陣列 | 出口，見 1.2。遠方地圖（M04、M05、M08）沒有出口，只能搭車進出 |
| `npcs` | 陣列 | NPC，見 1.3 |
| `lamps` | 陣列 | （新增，只有 M01 有）五盞知識燈，見 1.4 |
| `chests` | 陣列 | 寶箱，見 1.5 |
| `spawns` | 陣列 | 怪物分佈，見 1.6 |
| `inn` | 物件或 `null` | 旅店，見 1.7 |
| `shop` | 物件或 `null` | 商店，見 1.7 |
| `extra_shops` | 陣列 | （新增，只有 M09 有）同一張圖的第二、三間店，格式和 `shop` 一樣 |

### 1.1 字元圖例

不在這張表裡的字元，驗證會報錯。

| 字元 | 意義 | 能不能走 |
|---|---|---|
| `.` | 地面（依 tileset 顯示為草地、地板或洞窟地） | 可 |
| `,` | 花草、裝飾地面 | 可 |
| `=` | 路、石板 | 可 |
| `%` | 淺泥、淺灘 | 可 |
| `D` | 門（裝飾用；v0.4 起不可走，NPC／商店在門前一格互動） | 擋 |
| `B` | 橋 | 可 |
| `S` | 樓梯 | 可 |
| `c` | 地毯 | 可 |
| `T` | 樹、柱 | 擋 |
| `#` | 牆、岩壁、城牆 | 擋 |
| `~` | 水、沼澤水 | 擋 |
| `H` | 房屋牆 | 擋 |
| `R` | 屋頂 | 擋 |
| `F` | 柵欄 | 擋 |
| `*` | 灌木、岩石 | 擋 |
| `K` | 王座、大型擺設 | 擋 |
| `U` | 上層格（v0.4 新增）：可以走，但背景圖這一格畫在角色上方（拱門、橋下、屋簷下）；角色被擋住時顯示半透明剪影 | 可 |

### 1.2 出口 `exits[]`

| 欄位 | 說明 |
|---|---|
| `x`, `y` | 出口格，一定在地圖邊緣的可走格上。踩到就換圖 |
| `to` | 目標地圖 ID |
| `tx`, `ty` | 到目標地圖後站的位置。一定是可走格，而且不是出口（避免來回彈） |

- 出口都是雙向的：目標地圖在落點旁邊，一定有一個回來的出口。
- 地圖邊緣上所有可走的格子都是出口；其他邊緣格都不能走。

### 1.3 NPC `npcs[]`

| 欄位 | 說明 |
|---|---|
| `id` | 全遊戲唯一。委託的 `giver` 和對話的 `who` 都用這個 id |
| `x`, `y` | 站的位置（可走格）。NPC 本身會擋路 |
| `sprite` | 圖像 key（`npc_*`） |
| `dialog` | 平常說話時用的對話 ID |
| `quest` | 第一個委託 ID；沒有委託時是 `null`。保留這欄是為了相容 6.1 |
| `quests` | （新增）這位 NPC 會發的**所有**委託 ID |

- 建議的顯示邏輯：從 `quests` 裡找第一個「還沒完成」的委託，再依狀態顯示不同對話：
  - 前置還沒完成：顯示 `dialog_locked`；沒有的話就顯示 `dialog`。
  - 可以接：顯示 `dialog_start`。
  - 完成時：顯示 `dialog_end`。
- 全部完成後，顯示 `dialog`。

### 1.4 知識燈 `lamps[]`（新增）

| 欄位 | 說明 |
|---|---|
| `subject` | 五科之一 |
| `x`, `y` | 位置（可走格上的擋路物件）。依點燈狀態顯示 `lamp_off`／`lamp_on` |

### 1.5 寶箱 `chests[]`

| 欄位 | 說明 |
|---|---|
| `id` | 全遊戲唯一，存檔用這個 id 記錄「開過了沒」 |
| `x`, `y` | 位置（可走格上的擋路物件） |
| `subject` | 一律是 `"數學"`。答對一題數學數字題才打得開 |
| `level` | 題目難度 1–4 |
| `reward.gold` | 金幣 20–60 |
| `reward.item` | 道具 ID，或 `null` |

### 1.6 怪物分佈 `spawns[]`

| 欄位 | 說明 |
|---|---|
| `monster` | 怪物 ID（`MONSTERS` 的鍵） |
| `count` | 同時存在幾隻 |
| `area` | `[x, y, w, h]` 遊走範圍。範圍內只能放在可走、不是出口、沒有物件的格子上 |
| `boss` | （新增）`true`＝頭目 |
| `quest` | （新增）頭目綁定的委託 ID。只在這個委託「進行中」時出現，打倒（完成委託）後就不再出現 |

### 1.7 旅店 `inn`、商店 `shop`／`extra_shops[]`

| 欄位 | 說明 |
|---|---|
| `x`, `y` | 互動位置。有站櫃 NPC 時，就是那位 NPC 的位置 |
| `npc` | （新增）站櫃 NPC 的 id；沒有站櫃的話是 `null`，前端自行顯示招牌或床 |
| `price` | （新增，只有旅店有）住宿費。目前全部是 0，失敗要安全 |
| `shop_id` | （只有商店有）對應 `window.SHOPS` 的鍵 |

---

## 1b. 世界地圖 `window.WORLD`（新增，world.js）

| 欄位 | 說明 |
|---|---|
| `image` | 世界地圖圖檔名（CTO 繪製後填入；`null`＝用前端備援畫面） |
| `regions` | 地區陣列，見下表 |

`regions[]`：

| 欄位 | 說明 |
|---|---|
| `id` | 地區 ID |
| `name` | 地區中文名（世界地圖上顯示） |
| `real_ref` | 參考的真實地點 |
| `map_entry` | 搭車抵達的地圖 ID（字串） |
| `tx`, `ty` | 下車後站的格子（可走、不是出口）。與該地圖的 `start` 相同（M01 除外：M01 的 `start` 是新遊戲出生點） |
| `x`, `y` | 在世界地圖圖片上的相對位置（0–1） |
| `unlock_quest` | 完成這個委託才解鎖；`null`＝一開始就能去；陣列＝全部完成才解鎖 |

- 搭車規則：在任何一張有 `station` 的地圖，站上車站就能打開世界地圖，前往已解鎖的地區。
- 驗證腳本會模擬：每個委託的委託人地圖、頭目地圖、打獵地圖，在它的前置委託完成時都到得了。
- M01 金包里的設施方位參考來源寫在 world.js 檔頭。

---

## 2. 委託 `window.QUESTS`

鍵是委託 ID。

| 欄位 | 說明 |
|---|---|
| `title` | 委託標題（任務日誌顯示） |
| `giver` | 委託人 NPC id，一定在 `map` 這張圖上 |
| `map` | 委託人所在地圖 |
| `kind` | `help`（答題）／`hunt`（收集掉落物）／`boss`（打倒頭目）／`chest`（保留，目前沒用到） |
| `goal` | （新增）任務日誌上的「目標」。**推進主線的關鍵資訊一定寫在這裡**，對話可以跳過 |
| `log_next` | （新增）完成後，任務日誌顯示的「下一步去哪裡」 |
| `teaches` | （新增，只有教學委託有）這個委託在教什麼，給前端決定要不要跳教學提示 |
| `subject` | 五科之一，或 `"混合"` |
| `subjects` | （新增）`subject` 是 `"混合"` 時，要輪流出題的科目 |
| `units` | 出題單元，字串和 `questions.js` 的 `unit` 完全相同。空陣列＝該科全部單元 |
| `count` | `help` 委託要答對幾題（2–5）。`hunt`／`boss` 是 `null` |
| `level_range` | `[最低, 最高]` 題目難度 |
| `hunt` | `hunt` 委託才有，見 2.1；其他是 `null` |
| `boss` | （新增）`boss` 委託要打倒的怪物 ID |
| `boss_map` | （新增）頭目所在地圖。頭目由該地圖 `spawns` 的 `quest` 綁定 |
| `requires` | 前置委託 ID 陣列，全部完成才能接 |
| `requires_lights` | （新增，只有 Q_FINAL 有）需要先拿回的光（科目陣列） |
| `reward.exp` | 0＝依答題自動計算（題目 exp × 地圖等級係數） |
| `reward.gold` | 完成時給的金幣 |
| `reward.item` | 道具 ID，或 `null` |
| `reward.light` | 拿回哪一科的光；只有頭目委託有。五科各由一個頭目委託給 |
| `dialog_start` | 接委託時的對話 |
| `dialog_end` | 完成時的對話 |
| `dialog_locked` | （新增）前置還沒完成時跟委託人說話的對話，會告訴孩子「先去哪裡」 |
| `dialog_ending` | （新增，只有 Q_FINAL 有）破關結尾對話 |

### 2.1 打獵 `hunt`

| 欄位 | 說明 |
|---|---|
| `item` | 要收集的道具 ID（素材） |
| `n` | 數量 |
| `monster` | （新增）會掉這個素材的怪，給任務日誌顯示 |
| `map` | （新增）那隻怪出沒的地圖，給任務日誌顯示 |

### 2.2 主線順序

```
Q_TUT_1 → Q_TUT_2 → Q_TUT_3
  ├→ Q_ELF_1→2→3→4（自然之光）→ Q_GNO_1→2→3→4（數學之光）─┐
  └→ Q_MER_1→2→3→4（英語之光）→ Q_GOB_1→2→3→4（國語之光）─┴→ Q_ORC_1→2→3→4（社會之光）
→ Q_LAMPS（金包里點燈）→ Q_FINAL（古城塔頂）
```

`Q_SIDE_*` 都是支線，不擋主線。

---

## 3. 對話 `window.DIALOGS`、`window.SPEAKERS`

`DIALOGS`：鍵是對話 ID，值是陣列 `[{ who, text, taigi? }, …]`，依序播放。

| 欄位 | 說明 |
|---|---|
| `who` | 說話者：NPC id、怪物 id、`"hero"`（主角）、`"pet"`（番薯仔）或 `"narrator"`（旁白，不顯示名字） |
| `text` | 台詞（一律是華語，給朗讀和聽不懂台語的孩子），每句不超過 30 字（`{name}` 以 8 字計算）。`{name}` 要換成主角自取的名字 |
| `taigi` | （新增，選填，只有 NPC 台詞有）台語版本 `{ hanji, tailo, huayu }`：`hanji` 台語漢字（≤30 字）、`tailo` 台羅拼音（目前留空，待課綱設計師依教育部辭典補上並修正用字）、`huayu` 華語翻譯。建議顯示：台語漢字在上、華語小字在下；朗讀用 `text` |

`SPEAKERS`（新增）：`who` → 顯示名稱。`hero` 是 `"{name}"`，`narrator` 是空字串。

- 主角有男生和女生兩種，所以台詞只用 `{name}` 或「冒險者」稱呼主角，不寫「她／他」。
- 只有外國商人的台詞會夾簡單英文，而且一定附中文。

### 3.1 系統對話（前端在特定時機播放）

| ID | 時機 |
|---|---|
| `D_INTRO` | 新遊戲開場 |
| `D_FAINT` | 主角累倒（HP 歸零），回旅店前 |
| `D_INN_REST` | 住完旅店 |
| `D_CHEST_LOCKED` | 碰到還沒開的寶箱 |
| `D_CHEST_DONE` | 碰到已經開過的寶箱 |
| `D_LAMP_LIT` | 點亮一盞知識燈 |
| `D_LIGHT_GET` | 拿回一道光（頭目委託完成時，可接在 `dialog_end` 後面） |
| `D_GUILD_JOB` | Lv5 以上找公會導師轉職 |
| `D_STATION` | 站上車站、打開世界地圖時 |
| `D_STATION_LOCKED` | 在世界地圖點了還沒解鎖的地區 |

---

## 4. 怪物 `window.MONSTERS`

鍵是怪物 ID。

| 欄位 | 說明 |
|---|---|
| `name` | 中文名 |
| `sprite` | 圖像 key（`mon_*`／`boss_*`） |
| `level` | 怪物等級（和出沒地圖的等級相同） |
| `hp`, `atk` | 體力、攻擊。怪物打主角＝max(1, atk − 主角 DEF)（內容端假設，待前端確認） |
| `subject` | 戰鬥出題科目；最終頭目是 `"混合"` |
| `subjects` | （新增，只有遺忘霧魔有）五科輪流 |
| `q_levels` | （新增）出題難度範圍 `[最低, 最高]` |
| `exp`, `gold` | 打倒後**額外**給的討伐獎勵。答題 EXP 由題目另外算 |
| `drops` | `[{ item, rate }]`，rate 是 0–1 的掉落機率 |
| `boss` | 是不是頭目 |
| `phases` | （新增，只有頭目有）階段數 3。依 CTO 裁定，階段＝體力剩 2/3、1/3 時換階段 |
| `phase_q` | （新增，只有頭目有）每階段至少答對 2 題 |
| `last_q_level` | （新增，只有頭目有）每階段最後一題的難度 4 |
| `ref_mobs` | （新增，只有頭目有）用來算體力倍率的同區小怪。一般頭目 ×5、最終頭目 ×6，驗證範圍 4.5–6.5 |
| `dialog_before`, `dialog_after` | （新增，只有頭目有）戰鬥前、戰鬥後的對話 |
| `desc` | （新增）圖鑑說明 |
| `wake` | （新增）打倒後顯示的「清醒了、跑走了」文字。不寫死亡、不寫血腥 |

數值的計算依據寫在 `monsters.js` 檔頭。

---

## 5. 道具 `window.ITEMS`、商店 `window.SHOPS`

`ITEMS`：鍵是道具 ID。`eraser`、`guide`、`snack` 沿用 v0.1 的 id，舊存檔不用轉換。

| 欄位 | 說明 |
|---|---|
| `name` | 中文名 |
| `sprite` | 圖像 key（`item_*`） |
| `kind` | `consumable`（消耗品）／`card`（答題輔助卡）／`weapon`／`armor`／`material`（素材） |
| `price` | 買價；素材是 0（不賣） |
| （素材） | 素材是任務素材，商店不收購，所以沒有 `sell` 欄位（2026-10-09 拿掉）。裝備、道具的賣價由遊戲依 `price` 計算（裝備 50%、道具 25%） |
| `effect` | 消耗品與卡片的效果：`hp`（回復體力）、`pet`（番薯仔好感）、`remove_option`（刪掉幾個錯的選項）、`hint_level`（打開到第幾層提示） |
| `atk`, `def`, `mp` | 裝備加成 |
| `jobs` | 裝備限定的職業 ID 陣列；`null`＝誰都能裝 |
| `desc` | 說明 |

`SHOPS`（新增）：鍵是 `shop_id`。

| 欄位 | 說明 |
|---|---|
| `name` | 店名 |
| `items` | 販賣的道具 ID 陣列 |

---

## 6. 職業 `window.JOBS`、`window.PLAYER_BASE`、`window.JOB_RULES`

`JOBS`：鍵是職業 ID，有 `novice`／`swordsman`／`mage`／`archer`／`bard`／`priest` 六種。

| 欄位 | 說明 |
|---|---|
| `name` | 中文名 |
| `sprite_f` | 女生主角走路圖 key：`hero_` 加職業 ID（CTO 定案） |
| `sprite_m` | 男生主角走路圖 key：`heroM_` 加職業 ID（CTO 定案） |
| `fav_subject` | 拿手科目；見習冒險者是 `null` |
| `bonus` | 拿手科目答對時的傷害倍率（1.5） |
| `unlock_level` | 可以轉職的等級 |
| `growth` | 每升一級的 `{hp, mp, atk}`。總和都是 13，只是分配不同 |
| `speed_bonus` | （新增，只有弓箭手有）答題時間條倍率 |
| `skill` | 技能，見下表；見習冒險者是 `null` |
| `desc` | 說明 |

技能 `skill` 的欄位：

| 欄位 | 說明 |
|---|---|
| `id` | 技能 ID |
| `name` | 中文名 |
| `mp` | 消耗魔力 |
| `subject` | 發動時出題的科目 |
| `effect` | 效果類型：`double_hit`（打兩下）／`hit_all`（打全體）／`preemptive`（戰鬥開始先打一下）／`extend_timer`（下一題時間條加長）／`heal`（回復體力） |
| `value` | 效果數值。`extend_timer` 是時間倍率，`heal` 是回復最大體力的比例 |
| `desc` | 說明 |

技能都是「答對才發動」。

`PLAYER_BASE`（新增）：主角 Lv1 的 `{hp, mp, atk, def}`。ATK 6 是依指示訂的；HP 30、MP 10、DEF 0 是內容端的假設。

`JOB_RULES`（新增）：

| 欄位 | 說明 |
|---|---|
| `change_map`, `change_npc` | 轉職地點：M10 的公會導師 |
| `unlock_level` | 5 |
| `change_cost` | 換職費用 0（免費） |
| `dialog_locked` | 未滿 5 級時的對話 |
| `dialog_open` | 可以轉職時的對話 |
