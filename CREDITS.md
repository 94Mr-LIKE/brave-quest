# 素材與授權

## 程式庫

- **Phaser 4.2.1**（MIT License）
  - 版權：Richard Davey、Phaser Studio Inc.
  - 來源：npm registry <https://registry.npmjs.org/phaser/-/phaser-4.2.1.tgz>（2026-10-07 下載），取其中的 `dist/phaser.min.js`。
  - 授權全文：`lib/PHASER_LICENSE.txt`。

- **qrcode-generator 2.0.4**（MIT License）— 產生存檔 QR Code
  - 版權：Kazuhiko Arase（2009）。「QR Code」是 DENSO WAVE INCORPORATED 的註冊商標。
  - 來源：npm registry <https://registry.npmjs.org/qrcode-generator/-/qrcode-generator-2.0.4.tgz>（2026-10-07 下載），取其中的 `dist/qrcode.js` 存為 `lib/qrcode.js`。
  - 授權全文：`lib/QRCODE_LICENSE.txt`（npm 套件沒有附 LICENSE 檔，依 package.json 與原始碼檔頭標示的 MIT 授權附上標準條文）。

本遊戲沒有使用其他第三方程式庫、字型服務或 CDN。存檔碼壓縮用瀏覽器內建的 CompressionStream。

## 美術

- **角色、NPC、怪物、頭目、道具圖示、地圖背景、戰鬥背景、標題圖、台灣世界地圖**：GPT 繪製＋程式後製（去背、切格、縮放、限色），由 CTO 製作與逐張驗收。
  - `assets/chars/`、`assets/npcs/`、`assets/monsters/`、`assets/items/`、`assets/maps/`、`assets/battle/bb_*.png`、`assets/ui/`
  - 主畫面圖示 `assets/ui/icon-180/192/512.png`：從 `title.png` 裁切縮放（`tools/make_icons.py`），沒有重新繪製。
- **備援圖塊**（寶箱、知識燈、傳送光圈，以及沒有背景圖時的地面）：本專案程式產生（`tools/make_tiles.py`），沒有使用外部素材。
  - `assets/tiles/`
- **佔位圖**：找不到圖檔時由遊戲即時畫出的色塊與文字，不是外部素材。

## 聲音

- 音效全部用 Web Audio 即時合成，沒有音檔。
- 朗讀使用瀏覽器內建的語音合成（speechSynthesis）；台語句子朗讀華語翻譯。

## 題目與故事

- 題目全部原創；`source_ref` 只標示出版社、冊別與單元名稱，不重製課文、插圖或習作。
- 地名、店名、人物皆為以台灣各地為靈感的虛構設定。
