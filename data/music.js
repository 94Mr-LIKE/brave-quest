/*
 * 勇者大冒險 — 原創音樂樂譜（全部原創旋律，2026-10-07 遊戲作曲家）
 *
 * 只參考 1990 年代 JRPG「曲目用途與風格」（城鎮／原野／洞窟／戰鬥／勝利號角／升級短曲……），
 * 沒有抄襲或改編任何既有作品的旋律、和聲特徵句或節奏型。
 *
 * 記譜（由 docs/src/engine/music.js 解析）：
 *   "C5:1"           音名＋八度：拍長（C4 = 中央 Do；升記號 #、降記號 b，例如 F#4、Bb3）
 *   "60:1"           也可以直接寫 MIDI 半音數（60 = C4）
 *   "r:0.5"          休止符（也可寫 rest:0.5）
 *   "C4+E4+G4:4"     和弦（同時發聲）
 *   "|"              小節線（測試會檢查每小節拍數 = meter）
 *   "[ ... ]x4"      重複 4 次（可巢狀）
 *   鼓組音軌（instrument: 'drums'）：k 大鼓、s 小鼓、h 閉合鈸、o 開放鈸、t 通鼓、c 輕銅鈸、w 木魚，例如 "k+h:0.5"
 * 也可以用陣列寫法：notes: [['C5', 1], ['rest', 0.5], [60, 1]]
 *
 * 欄位：name 名稱、key 調性、tempo 每分鐘拍數、meter 每小節拍數、loop 是否迴圈、mood 情緒、
 *       origin 原創說明、bgm（短曲專用：'pause' 暫停原 BGM、'duck' 壓低原 BGM）、
 *       tracks[{ instrument, role（melody 主旋律／harmony／pad／bass／drums）, gain（相對音量，預設 1）, notes }]
 * 音色 instrument：lead_square、lead_tri、lead_saw、brass、flute、bell、pluck、pad、bass、bass_pluck、arp、drums
 */
window.MUSIC = {
  bgm: {
    // ------------------------------------------------------------------ 標題
    title: {
      name: '標題：勇者的早晨', key: 'D 大調', tempo: 92, meter: 4, loop: true,
      audio: { file: 'assets/music/title.m4a', seconds: 73.64, loopStart: 10.28, loopEnd: 73.64, gainDb: 0, lufs: -15.9 },
      mood: '充滿希望、展開冒險的期待',
      origin: '以「Re 起音、下到 La 再跳回」的原創動機開頭，第二樂句升到 C#6 做開闊感；伴奏為搖擺分解和弦。',
      tracks: [
        { instrument: 'brass', role: 'melody', notes:
          'D5:1.5 A4:0.5 D5:1 E5:1 | F#5:3 E5:0.5 D5:0.5 | B4:1.5 D5:0.5 G5:1 F#5:1 | E5:4 |' +
          'D5:1.5 A4:0.5 D5:1 E5:1 | F#5:1.5 A5:0.5 C#6:1 A5:1 | B5:1.5 A5:0.5 G5:1 F#5:1 | E5:3 r:1 |' +
          'F#5:1 E5:1 D5:1 F#5:1 | G5:2 B4:2 | A4:1 B4:1 D5:1 F#5:1 | E5:3 C#5:1 |' +
          'D5:1 E5:1 G5:1 B5:1 | A5:2 G5:1 E5:1 | F#5:4 | D5:2 r:2 |' },
        { instrument: 'pluck', role: 'harmony', gain: 0.8, notes:
          '[D4:0.5 A4:0.5 F#4:0.5 A4:0.5]x2 | [D4:0.5 B4:0.5 F#4:0.5 B4:0.5]x2 | [D4:0.5 B4:0.5 G4:0.5 B4:0.5]x2 | [C#4:0.5 A4:0.5 E4:0.5 A4:0.5]x2 |' +
          '[D4:0.5 A4:0.5 F#4:0.5 A4:0.5]x2 | [C#4:0.5 A4:0.5 F#4:0.5 A4:0.5]x2 | [D4:0.5 B4:0.5 G4:0.5 B4:0.5]x2 | [C#4:0.5 A4:0.5 E4:0.5 A4:0.5]x2 |' +
          '[D4:0.5 B4:0.5 F#4:0.5 B4:0.5]x2 | [D4:0.5 B4:0.5 G4:0.5 B4:0.5]x2 | [D4:0.5 A4:0.5 F#4:0.5 A4:0.5]x2 | [C#4:0.5 A4:0.5 E4:0.5 A4:0.5]x2 |' +
          '[D4:0.5 B4:0.5 G4:0.5 B4:0.5]x2 | [C#4:0.5 A4:0.5 E4:0.5 A4:0.5]x2 | [D4:0.5 A4:0.5 F#4:0.5 A4:0.5]x2 | D4+F#4+A4:2 r:2 |' },
        { instrument: 'pad', role: 'pad', notes:
          'D4+F#4+A4:4 | D4+F#4+B4:4 | D4+G4+B4:4 | C#4+E4+A4:4 | D4+F#4+A4:4 | C#4+F#4+A4:4 | D4+G4+B4:4 | C#4+E4+A4:4 |' +
          'D4+F#4+B4:4 | D4+G4+B4:4 | D4+F#4+A4:4 | C#4+E4+A4:4 | D4+G4+B4:4 | C#4+E4+A4:4 | D4+F#4+A4:4 | D4+F#4+A4:4 |' },
        { instrument: 'bass', role: 'bass', notes:
          'D3:2 A3:2 | B2:2 F#3:2 | G3:2 D3:2 | A2:2 E3:2 | D3:2 A3:2 | F#3:2 C#3:2 | G3:2 D3:2 | A2:2 E3:2 |' +
          'B2:2 F#3:2 | G3:2 D3:2 | D3:2 A3:2 | A2:2 E3:2 | G3:2 D3:2 | A2:2 E3:2 | D3:2 A3:2 | D3:2 A2:2 |' },
        { instrument: 'drums', role: 'drums', gain: 0.8, notes: '[k:1 h:1 s:1 h:1 |]x15 k:1 s:1 s:0.5 s:0.5 s:1 |' }
      ]
    },

    // ------------------------------------------------------------------ 海邊小鎮（金包里）
    village: {
      name: '海邊小鎮：金包里的風', key: 'F 大調（宮調五聲音階）', tempo: 96, meter: 4, loop: true,
      audio: { file: 'assets/music/village.m4a', seconds: 85.0, loopStart: 5.0, loopEnd: 85.0, gainDb: 0, lufs: -16.0 },
      mood: '溫暖、悠閒、帶台灣民謠五聲音階的鄉土味',
      origin: '主旋律只用 Fa Sol La Do Re 五個音（台灣民謠常見的五聲音階），切分節奏像海風輕拂；木魚打出輕巧節拍。',
      tracks: [
        { instrument: 'flute', role: 'melody', notes:
          'C5:1 A4:0.5 C5:0.5 D5:1 F5:1 | D5:1.5 C5:0.5 A4:2 | G4:1 A4:0.5 C5:0.5 D5:1 C5:1 | G4:3 r:1 |' +
          'C5:1 A4:0.5 C5:0.5 F5:1 G5:1 | A5:1.5 G5:0.5 F5:1 D5:1 | D5:1 F5:0.5 D5:0.5 C5:1 G4:1 | A4:0.5 G4:0.5 F4:3 |' +
          'F5:1 D5:0.5 F5:0.5 G5:1 A5:1 | C6:1.5 A5:0.5 G5:1 A5:0.5 G5:0.5 | F5:1 D5:1 C5:1 D5:1 | C5:1 A4:1 C5:2 |' +
          'D5:1 C5:0.5 D5:0.5 G5:1 F5:1 | D5:1.5 C5:0.5 G4:2 | A4:1 G4:0.5 A4:0.5 C5:1 D5:1 | F5:3 r:1 |' },
        { instrument: 'pad', role: 'pad', notes:
          'A3+C4+F4:4 | A3+D4+F4:4 | Bb3+D4+F4:4 | G3+C4+E4:4 | A3+C4+F4:4 | A3+C4+E4:4 | Bb3+D4+F4:2 G3+C4+E4:2 | A3+C4+F4:4 |' +
          'A3+D4+F4:4 | A3+C4+E4:4 | Bb3+D4+F4:4 | A3+C4+F4:4 | G3+Bb3+D4:4 | G3+C4+E4:4 | A3+C4+F4:4 | A3+C4+F4:4 |' },
        { instrument: 'bass', role: 'bass', notes:
          'F3:1.5 C3:0.5 F3:1 C3:1 | D3:1.5 A2:0.5 D3:1 A2:1 | Bb2:1.5 F3:0.5 Bb2:1 F3:1 | C3:1.5 G3:0.5 C3:1 G3:1 |' +
          'F3:1.5 C3:0.5 F3:1 C3:1 | A2:1.5 E3:0.5 A2:1 E3:1 | Bb2:1.5 F3:0.5 C3:1 G3:1 | F3:1.5 C3:0.5 F3:1 C3:1 |' +
          'D3:1.5 A2:0.5 D3:1 A2:1 | A2:1.5 E3:0.5 A2:1 E3:1 | Bb2:1.5 F3:0.5 Bb2:1 F3:1 | F3:1.5 C3:0.5 F3:1 C3:1 |' +
          'G3:1.5 D3:0.5 G3:1 D3:1 | C3:1.5 G3:0.5 C3:1 G3:1 | F3:1.5 C3:0.5 F3:1 C3:1 | F3:2 C3:2 |' },
        { instrument: 'drums', role: 'drums', gain: 0.7, notes: '[k:1 w:0.5 w:0.5 k:0.5 k:0.5 w:1 |]x16' }
      ]
    },

    // ------------------------------------------------------------------ 原野（陽明山草原）
    field: {
      name: '原野：擎天草原向前走', key: 'G 大調', tempo: 112, meter: 4, loop: true,
      audio: { file: 'assets/music/field.m4a', seconds: 73.48, loopStart: 5.0, loopEnd: 73.48, gainDb: 0, lufs: -16.0 },
      mood: '明亮、輕快、想往前跑的冒險感',
      origin: '以「Sol-Si-Re 上行附點＋短音回落」的原創動機開頭，後半段一路爬到 D6 再回主音；中音域八分音符分解和弦推進。',
      tracks: [
        { instrument: 'lead_square', role: 'melody', notes:
          'G4:0.5 B4:0.5 D5:1.5 B4:0.5 D5:0.5 E5:0.5 | G5:2 E5:1 D5:1 | E5:0.5 D5:0.5 C5:1.5 E5:0.5 G5:1 | F#5:3 D5:1 |' +
          'G4:0.5 B4:0.5 D5:1.5 B4:0.5 G5:0.5 A5:0.5 | B5:2 F#5:1 D5:1 | E5:1 G5:1 C6:1 B5:0.5 A5:0.5 | A5:3 r:1 |' +
          'B5:1 G5:0.5 E5:0.5 B4:1 E5:1 | E5:1 G5:0.5 E5:0.5 C5:2 | D5:1 B4:0.5 D5:0.5 G5:1 B5:1 | A5:2 F#5:2 |' +
          'G5:1 E5:1 C5:1 E5:1 | F#5:1 A5:1 D6:1 C6:1 | B5:3 A5:1 | G5:2 r:2 |' },
        { instrument: 'arp', role: 'harmony', notes:
          '[B3:0.5 D4:0.5 G4:0.5 D4:0.5]x2 | [B3:0.5 E4:0.5 G4:0.5 E4:0.5]x2 | [C4:0.5 E4:0.5 G4:0.5 E4:0.5]x2 | [A3:0.5 D4:0.5 F#4:0.5 D4:0.5]x2 |' +
          '[B3:0.5 D4:0.5 G4:0.5 D4:0.5]x2 | [B3:0.5 D4:0.5 F#4:0.5 D4:0.5]x2 | [C4:0.5 E4:0.5 G4:0.5 E4:0.5]x2 | [A3:0.5 D4:0.5 F#4:0.5 D4:0.5]x2 |' +
          '[B3:0.5 E4:0.5 G4:0.5 E4:0.5]x2 | [C4:0.5 E4:0.5 G4:0.5 E4:0.5]x2 | [B3:0.5 D4:0.5 G4:0.5 D4:0.5]x2 | [A3:0.5 D4:0.5 F#4:0.5 D4:0.5]x2 |' +
          '[C4:0.5 E4:0.5 G4:0.5 E4:0.5]x2 | [A3:0.5 D4:0.5 F#4:0.5 D4:0.5]x2 | [B3:0.5 D4:0.5 G4:0.5 D4:0.5]x2 | B3+D4+G4:2 r:2 |' },
        { instrument: 'bass', role: 'bass', notes:
          'G3:1 G3:0.5 D3:0.5 G3:1 D3:1 | E3:1 E3:0.5 B2:0.5 E3:1 B2:1 | C3:1 C3:0.5 G3:0.5 C3:1 G3:1 | D3:1 D3:0.5 A2:0.5 D3:1 A2:1 |' +
          'G3:1 G3:0.5 D3:0.5 G3:1 D3:1 | B2:1 B2:0.5 F#3:0.5 B2:1 F#3:1 | C3:1 C3:0.5 G3:0.5 C3:1 G3:1 | D3:1 D3:0.5 A2:0.5 D3:1 A2:1 |' +
          'E3:1 E3:0.5 B2:0.5 E3:1 B2:1 | C3:1 C3:0.5 G3:0.5 C3:1 G3:1 | G3:1 G3:0.5 D3:0.5 G3:1 D3:1 | D3:1 D3:0.5 A2:0.5 D3:1 A2:1 |' +
          'C3:1 C3:0.5 G3:0.5 C3:1 G3:1 | D3:1 D3:0.5 A2:0.5 D3:1 A2:1 | G3:1 G3:0.5 D3:0.5 G3:1 D3:1 | G3:2 D3:2 |' },
        { instrument: 'drums', role: 'drums', notes: '[k:1 h:0.5 h:0.5 s:1 h:0.5 k:0.5 |]x15 k:1 h:0.5 h:0.5 s:0.5 s:0.5 s:0.5 s:0.5 |' }
      ]
    },

    // ------------------------------------------------------------------ 神木森林（阿里山）
    forest: {
      name: '森林：神木的低語', key: 'E 多利安調式', tempo: 66, meter: 3, loop: true,
      audio: { file: 'assets/music/forest.m4a', seconds: 91.4, loopStart: 5.0, loopEnd: 91.4, gainDb: 0, lufs: -16.0 },
      mood: '神祕、安靜、古老森林的呼吸',
      origin: '三拍子慢板，用多利安調式（升 C 的小調色彩）營造神祕感；八音盒般的高音「露珠」點綴，低音通鼓像心跳。',
      tracks: [
        { instrument: 'flute', role: 'melody', notes:
          'B4:2 E5:1 | F#5:1.5 E5:0.5 D5:1 | E5:3 | C#5:1 E5:1 A5:1 |' +
          'G5:2 F#5:1 | D5:2 B4:1 | A4:1 B4:1 D5:1 | E5:3 |' +
          'D5:1.5 F#5:0.5 B5:1 | A5:1.5 G5:0.5 D5:1 | E5:1 C#5:1 E5:1 | B4:3 |' +
          'A4:1 D5:1 F#5:1 | E5:1.5 C#5:0.5 A4:1 | G4:1 A4:1 B4:1 | E5:3 |' },
        { instrument: 'bell', role: 'harmony', gain: 0.7, notes:
          'r:2 B5:0.5 E6:0.5 | r:3 | r:2 G5:0.5 B5:0.5 | r:3 | r:2 B5:0.5 E6:0.5 | r:3 | r:2 F#5:0.5 A5:0.5 | r:1 C#6:2 |' +
          'r:2 D6:0.5 F#6:0.5 | r:3 | r:2 E6:0.5 C#6:0.5 | r:3 | r:2 A5:0.5 D6:0.5 | r:3 | r:2 B5:0.5 E6:0.5 | G6:3 |' },
        { instrument: 'pad', role: 'pad', notes:
          'G3+B3+E4:3 | F#3+A3+D4:3 | G3+B3+E4:3 | A3+C#4+E4:3 | G3+B3+E4:3 | G3+B3+D4:3 | F#3+A3+D4:3 | A3+C#4+E4:3 |' +
          'F#3+B3+D4:3 | G3+B3+D4:3 | A3+C#4+E4:3 | G3+B3+E4:3 | F#3+A3+D4:3 | A3+C#4+E4:3 | G3+B3+E4:3 | G3+B3+E4:3 |' },
        { instrument: 'bass', role: 'bass', notes:
          'E3:3 | D3:3 | E3:3 | A2:3 | E3:3 | G3:3 | D3:3 | A2:3 | B2:3 | G3:3 | A2:3 | E3:3 | D3:3 | A2:3 | E3:3 | E3:3 |' },
        { instrument: 'drums', role: 'drums', gain: 0.6, notes: '[t:3 | r:3 |]x8' }
      ]
    },

    // ------------------------------------------------------------------ 洞窟（海蝕洞／哥布林部落）
    cave: {
      name: '洞窟：滴答滴答的岩洞', key: 'A 小調', tempo: 84, meter: 4, loop: true,
      audio: { file: 'assets/music/cave.m4a', seconds: 74.12, loopStart: 5.0, loopEnd: 74.12, gainDb: 0, lufs: -15.9 },
      mood: '有點緊張、好奇地探索，但不可怕',
      origin: '低音「彈跳」頑固音型＋稀疏的三角波旋律；高音鐘聲像洞頂滴水。結尾用 E-F-E-D# 半音繞回主音。',
      tracks: [
        { instrument: 'lead_tri', role: 'melody', notes:
          'r:2 E5:1 C5:1 | B4:2 A4:2 | r:1 C5:0.5 D5:0.5 F5:1 E5:1 | G#4:3 r:1 |' +
          'r:2 A5:1 G5:1 | E5:2 C5:1 D5:1 | F5:1.5 E5:0.5 D5:1 A4:1 | B4:3 r:1 |' +
          'A4:1 C5:1 F5:1 A5:1 | G5:2 D5:2 | E5:1 F5:1 E5:1 D#5:1 | E5:3 r:1 |' },
        { instrument: 'bell', role: 'harmony', gain: 0.5, notes: '[r:3.5 E6:0.5 | r:4 | r:1.5 A6:0.5 r:2 | r:4 |]x3' },
        { instrument: 'pad', role: 'pad', notes:
          'A3+C4+E4:4 | A3+C4+E4:4 | F3+A3+C4:4 | E3+G#3+B3:4 | A3+C4+E4:4 | A3+C4+E4:4 | D3+F3+A3:4 | E3+G#3+B3:4 |' +
          'F3+A3+C4:4 | D3+G3+B3:4 | E3+G#3+B3:4 | E3+G#3+B3:4 |' },
        { instrument: 'bass_pluck', role: 'bass', notes:
          '[A2:0.5 r:0.5 A2:0.5 E3:0.5 r:0.5 A2:0.5 F3:0.5 E3:0.5 |]x2 F3:0.5 r:0.5 F3:0.5 C3:0.5 r:0.5 F3:0.5 G3:0.5 F3:0.5 | E3:0.5 r:0.5 E3:0.5 B2:0.5 r:0.5 E3:0.5 F3:0.5 E3:0.5 |' +
          '[A2:0.5 r:0.5 A2:0.5 E3:0.5 r:0.5 A2:0.5 F3:0.5 E3:0.5 |]x2 D3:0.5 r:0.5 D3:0.5 A2:0.5 r:0.5 D3:0.5 E3:0.5 D3:0.5 | E3:0.5 r:0.5 E3:0.5 B2:0.5 r:0.5 E3:0.5 F3:0.5 E3:0.5 |' +
          'F3:0.5 r:0.5 F3:0.5 C3:0.5 r:0.5 F3:0.5 G3:0.5 F3:0.5 | G3:0.5 r:0.5 G3:0.5 D3:0.5 r:0.5 G3:0.5 A3:0.5 G3:0.5 | [E3:0.5 r:0.5 E3:0.5 B2:0.5 r:0.5 E3:0.5 F3:0.5 E3:0.5 |]x2' },
        { instrument: 'drums', role: 'drums', gain: 0.6, notes: '[k:1.5 h:0.5 t:1 h:1 |]x12' }
      ]
    },

    // ------------------------------------------------------------------ 山城市集（九份）
    town: {
      name: '市集：山城好熱鬧', key: 'C 大調', tempo: 132, meter: 4, loop: true,
      audio: { file: 'assets/music/town.m4a', seconds: 77.96, loopStart: 5.0, loopEnd: 77.96, gainDb: 0, lufs: -16.0 },
      mood: '熱鬧、活潑、逛市集的開心',
      origin: '跳躍的「短音＋空拍」旋律配上反拍和弦與「碰恰」低音；第 17–20 小節轉到 D 大和弦（借屬和弦）製造期待再回頭。',
      tracks: [
        { instrument: 'lead_square', role: 'melody', notes:
          'E5:0.5 G5:0.5 r:0.5 G5:0.5 A5:0.5 G5:0.5 E5:1 | C5:0.5 E5:0.5 r:0.5 E5:0.5 D5:1 C5:1 | A4:0.5 C5:0.5 F5:0.5 A5:0.5 G5:1 F5:1 | G5:1.5 F5:0.5 D5:2 |' +
          'E5:0.5 G5:0.5 r:0.5 G5:0.5 A5:0.5 G5:0.5 C6:1 | B5:0.5 A5:0.5 E5:1 A5:0.5 G5:0.5 E5:1 | F5:1 A5:1 G5:1 B4:1 | C5:2 r:1 G4:1 |' +
          'A5:0.5 A5:0.5 r:0.5 A5:0.5 G5:0.5 F5:0.5 C5:1 | D5:0.5 D5:0.5 r:0.5 D5:0.5 E5:0.5 F5:0.5 G5:1 | G5:0.5 E5:0.5 B4:1 E5:0.5 G5:0.5 B5:1 | A5:3 r:1 |' +
          'F5:0.5 E5:0.5 D5:1 A5:0.5 G5:0.5 F5:1 | G5:1 B5:1 D6:1 B5:1 | C6:3 r:1 | G5:0.5 E5:0.5 C5:1 r:2 |' +
          'C5:1 E5:1 A5:1.5 G5:0.5 | F5:1 A5:1 C6:1.5 A5:0.5 | F#5:1 D5:1 A5:1 F#5:1 | G5:1 r:1 D5:0.5 E5:0.5 F5:0.5 D5:0.5 |' },
        { instrument: 'pluck', role: 'harmony', gain: 0.7, notes:
          '[r:0.5 E4+G4+C5:0.5]x4 | [r:0.5 E4+A4+C5:0.5]x4 | [r:0.5 F4+A4+C5:0.5]x4 | [r:0.5 D4+G4+B4:0.5]x4 |' +
          '[r:0.5 E4+G4+C5:0.5]x4 | [r:0.5 E4+A4+C5:0.5]x4 | [r:0.5 D4+F4+A4:0.5]x2 [r:0.5 D4+G4+B4:0.5]x2 | [r:0.5 E4+G4+C5:0.5]x4 |' +
          '[r:0.5 F4+A4+C5:0.5]x4 | [r:0.5 D4+G4+B4:0.5]x4 | [r:0.5 E4+G4+B4:0.5]x4 | [r:0.5 E4+A4+C5:0.5]x4 |' +
          '[r:0.5 D4+F4+A4:0.5]x4 | [r:0.5 D4+G4+B4:0.5]x4 | [r:0.5 E4+G4+C5:0.5]x4 | [r:0.5 E4+G4+C5:0.5]x4 |' +
          '[r:0.5 E4+A4+C5:0.5]x4 | [r:0.5 F4+A4+C5:0.5]x4 | [r:0.5 D4+F#4+A4:0.5]x4 | [r:0.5 D4+G4+B4:0.5]x4 |' },
        { instrument: 'bass_pluck', role: 'bass', notes:
          '[C3:0.5 r:0.5 G3:0.5 r:0.5]x2 | [A2:0.5 r:0.5 E3:0.5 r:0.5]x2 | [F3:0.5 r:0.5 C4:0.5 r:0.5]x2 | [G3:0.5 r:0.5 D3:0.5 r:0.5]x2 |' +
          '[C3:0.5 r:0.5 G3:0.5 r:0.5]x2 | [A2:0.5 r:0.5 E3:0.5 r:0.5]x2 | D3:0.5 r:0.5 A3:0.5 r:0.5 G3:0.5 r:0.5 D3:0.5 r:0.5 | [C3:0.5 r:0.5 G3:0.5 r:0.5]x2 |' +
          '[F3:0.5 r:0.5 C4:0.5 r:0.5]x2 | [G3:0.5 r:0.5 D3:0.5 r:0.5]x2 | [E3:0.5 r:0.5 B3:0.5 r:0.5]x2 | [A2:0.5 r:0.5 E3:0.5 r:0.5]x2 |' +
          '[D3:0.5 r:0.5 A3:0.5 r:0.5]x2 | [G3:0.5 r:0.5 D3:0.5 r:0.5]x2 | [C3:0.5 r:0.5 G3:0.5 r:0.5]x2 | [C3:0.5 r:0.5 G3:0.5 r:0.5]x2 |' +
          '[A2:0.5 r:0.5 E3:0.5 r:0.5]x2 | [F3:0.5 r:0.5 C4:0.5 r:0.5]x2 | [D3:0.5 r:0.5 A3:0.5 r:0.5]x2 | [G3:0.5 r:0.5 D3:0.5 r:0.5]x2 |' },
        { instrument: 'drums', role: 'drums', gain: 0.85, notes: '[k:0.5 h:0.5 s:0.5 h:0.5 k:0.5 k:0.5 s:0.5 h:0.5 |]x19 k:0.5 h:0.5 s:0.5 h:0.5 s:0.5 s:0.5 s:0.5 s:0.5 |' }
      ]
    },

    // ------------------------------------------------------------------ 府城古城
    castle: {
      name: '古城：府城的城門', key: '降 E 大調', tempo: 72, meter: 4, loop: true,
      audio: { file: 'assets/music/castle.m4a', seconds: 85.64, loopStart: 5.0, loopEnd: 85.64, gainDb: 0, lufs: -16.0 },
      mood: '莊嚴、穩重、歷史悠久的城牆',
      origin: '慢速銅管主旋律，第 7 小節借用 F 大和弦（升高的 La）帶出光亮感；每四小節一聲廟鐘，定音鼓式的通鼓收尾。',
      tracks: [
        { instrument: 'brass', role: 'melody', notes:
          'Bb4:1.5 Eb5:0.5 G5:2 | Ab5:1 G5:0.5 F5:0.5 Eb5:2 | D5:1.5 F5:0.5 Bb5:2 | G5:3 r:1 |' +
          'G5:1.5 C6:0.5 Bb5:1 G5:1 | Ab5:1.5 G5:0.5 F5:1 Eb5:1 | C5:1 F5:1 A5:1 C6:1 | Bb5:3 r:1 |' +
          'C6:1.5 Bb5:0.5 Ab5:1 Eb5:1 | D5:1.5 Eb5:0.5 F5:2 | G5:1 Bb5:1 C6:1 G5:1 | Ab5:1 G5:1 F5:2 |' },
        { instrument: 'bell', role: 'harmony', gain: 0.6, notes: 'Eb5:4 | r:4 | r:4 | r:4 | C5:4 | r:4 | r:4 | r:4 | Ab4:4 | r:4 | r:4 | r:4 |' },
        { instrument: 'pad', role: 'pad', notes:
          'G3+Bb3+Eb4:4 | Ab3+C4+Eb4:4 | F3+Bb3+D4:4 | G3+Bb3+Eb4:4 | G3+C4+Eb4:4 | Ab3+C4+Eb4:4 | F3+A3+C4:4 | F3+Bb3+D4:4 |' +
          'Ab3+C4+Eb4:4 | F3+Bb3+D4:4 | G3+Bb3+D4:2 G3+C4+Eb4:2 | Ab3+C4+Eb4:2 F3+Bb3+D4:2 |' },
        { instrument: 'bass', role: 'bass', notes:
          'Eb3:2 Bb2:2 | Ab3:2 Eb3:2 | Bb2:2 F3:2 | Eb3:2 Bb2:2 | C3:2 G3:2 | Ab3:2 Eb3:2 | F3:2 C3:2 | Bb2:2 F3:2 |' +
          'Ab3:2 Eb3:2 | Bb2:2 F3:2 | G3:2 C3:2 | Ab3:2 Bb2:2 |' },
        { instrument: 'drums', role: 'drums', gain: 0.8, notes: '[k:2 t:1 t:0.5 t:0.5 |]x11 t:0.5 t:0.5 t:0.5 t:0.5 k:1 t:1 |' }
      ]
    },

    // ------------------------------------------------------------------ 一般戰鬥
    battle: {
      name: '戰鬥：知識對決！', key: 'D 小調', tempo: 148, meter: 4, loop: true,
      audio: { file: 'assets/music/battle.m4a', seconds: 49.8, loopStart: 5.0, loopEnd: 49.8, gainDb: 0, lufs: -16.0 },
      mood: '緊張、有幹勁，但不嚇人（像一起解題的挑戰）',
      origin: '八分音符八度跳躍低音推動；主旋律以「Re-Fa-La 上行後級進下行」的原創動機開頭，中段用 F→C→Bb 三段模進；第 7 小節借用 G 大和弦（多利安色彩）讓聲音明亮。',
      tracks: [
        { instrument: 'lead_square', role: 'melody', notes:
          'D5:0.5 F5:0.5 A5:1 G5:0.5 F5:0.5 E5:0.5 F5:0.5 | D5:2 r:0.5 Bb4:0.5 D5:0.5 F5:0.5 | E5:0.5 G5:0.5 C6:1 Bb5:0.5 A5:0.5 G5:0.5 E5:0.5 | C#5:0.5 E5:0.5 A5:2 r:1 |' +
          'D5:0.5 F5:0.5 A5:1 D6:1 C6:0.5 A5:0.5 | Bb5:1.5 A5:0.5 G5:1 F5:1 | G5:0.5 B5:0.5 D6:1 C6:0.5 B5:0.5 A5:1 | A5:2 E5:1 C#5:1 |' +
          'F5:1 A5:0.5 F5:0.5 C5:1 F5:1 | E5:1 G5:0.5 E5:0.5 C5:1 E5:1 | D5:1 F5:0.5 D5:0.5 Bb4:1 D5:1 | C#5:2 E5:2 |' +
          'G5:0.5 A5:0.5 Bb5:1 D6:1 C6:1 | Bb5:0.5 A5:0.5 G5:1 E5:1 C5:1 | F5:0.5 E5:0.5 D5:1 A5:1 F5:1 | E5:3 r:1 |' +
          'F5:0.5 A5:0.5 F5:0.5 G5:0.5 A5:1 C6:1 | G5:0.5 Bb5:0.5 G5:0.5 A5:0.5 Bb5:1 D6:1 | A5:1 Bb5:1 A5:1 G5:0.5 E5:0.5 | C#6:1 r:1 A5:0.5 r:0.5 A4:1 |' },
        { instrument: 'pad', role: 'pad', gain: 0.9, notes:
          'D4+F4+A4:4 | D4+F4+Bb4:4 | C4+E4+G4:4 | C#4+E4+A4:4 | D4+F4+A4:4 | D4+F4+Bb4:4 | D4+G4+B4:4 | C#4+E4+A4:4 |' +
          'C4+F4+A4:4 | C4+E4+G4:4 | D4+F4+Bb4:4 | C#4+E4+A4:4 | D4+G4+Bb4:4 | C4+E4+G4:4 | D4+F4+A4:4 | C#4+E4+A4:4 |' +
          'D4+F4+Bb4:4 | C4+E4+G4:4 | D4+F4+Bb4:2 C#4+E4+A4:2 | C#4+E4+A4:4 |' },
        { instrument: 'bass_pluck', role: 'bass', notes:
          '[D3:0.5 D3:0.5 D4:0.5 D3:0.5]x2 | [Bb2:0.5 Bb2:0.5 Bb3:0.5 Bb2:0.5]x2 | [C3:0.5 C3:0.5 C4:0.5 C3:0.5]x2 | [A2:0.5 A2:0.5 A3:0.5 A2:0.5]x2 |' +
          '[D3:0.5 D3:0.5 D4:0.5 D3:0.5]x2 | [Bb2:0.5 Bb2:0.5 Bb3:0.5 Bb2:0.5]x2 | [G3:0.5 G3:0.5 G4:0.5 G3:0.5]x2 | [A2:0.5 A2:0.5 A3:0.5 A2:0.5]x2 |' +
          '[F3:0.5 F3:0.5 F4:0.5 F3:0.5]x2 | [C3:0.5 C3:0.5 C4:0.5 C3:0.5]x2 | [Bb2:0.5 Bb2:0.5 Bb3:0.5 Bb2:0.5]x2 | [A2:0.5 A2:0.5 A3:0.5 A2:0.5]x2 |' +
          '[G3:0.5 G3:0.5 G4:0.5 G3:0.5]x2 | [C3:0.5 C3:0.5 C4:0.5 C3:0.5]x2 | [D3:0.5 D3:0.5 D4:0.5 D3:0.5]x2 | [A2:0.5 A2:0.5 A3:0.5 A2:0.5]x2 |' +
          '[Bb2:0.5 Bb2:0.5 Bb3:0.5 Bb2:0.5]x2 | [C3:0.5 C3:0.5 C4:0.5 C3:0.5]x2 | Bb2:0.5 Bb2:0.5 Bb3:0.5 Bb2:0.5 A2:0.5 A2:0.5 A3:0.5 A2:0.5 | [A2:0.5 A2:0.5 A3:0.5 A2:0.5]x2 |' },
        { instrument: 'drums', role: 'drums', notes: '[k:0.5 h:0.5 s:0.5 k:0.5 k:0.5 h:0.5 s:0.5 h:0.5 |]x19 s:0.5 s:0.5 s:0.5 s:0.5 t:0.5 t:0.5 t:0.5 t:0.5 |' }
      ]
    },

    // ------------------------------------------------------------------ 頭目戰
    boss: {
      name: '頭目戰：迷霧中的大傢伙', key: 'E 小調', tempo: 144, meter: 4, loop: true,
      audio: { file: 'assets/music/boss.m4a', seconds: 71.56, loopStart: 5.0, loopEnd: 71.56, gainDb: 0, lufs: -16.0 },
      mood: '氣勢強、心跳加速，但仍然明亮有希望',
      origin: '低音用 3+3+2 切分頑固音型；第 7 小節的 F 大和弦（降二級）帶來壓迫感，再由 B 大和弦（屬和弦）拉回；結尾 F#-D# 導音回到 E。',
      tracks: [
        { instrument: 'lead_saw', role: 'melody', notes:
          'E5:1.5 B4:0.5 E5:1 F#5:1 | G5:1.5 F#5:0.5 E5:1 B4:1 | C5:1 E5:1 G5:1.5 F#5:0.5 | F#5:2 D5:1 A4:1 |' +
          'E5:1.5 B4:0.5 E5:1 G5:1 | B5:1.5 A5:0.5 G5:1 F#5:1 | F5:1.5 E5:0.5 F5:1 A5:1 | F#5:1 D#5:1 B4:2 |' +
          'A4:0.5 C5:0.5 E5:1 A5:1.5 G5:0.5 | G5:1 F#5:1 E5:1 B4:1 | C5:0.5 E5:0.5 G5:1 C6:1.5 B5:0.5 | B5:3 r:1 |' +
          'C6:1 B5:0.5 A5:0.5 E5:1 C5:1 | D#5:1 F#5:0.5 D#5:0.5 B4:1 F#5:1 | G5:1 E5:0.5 G5:0.5 C6:1 B5:1 | A5:1 F#5:0.5 A5:0.5 D6:1 C6:1 |' +
          'B5:2 G5:1 E5:1 | F5:2 A5:1 C6:1 | E6:2 D6:1 C6:1 | B5:1 A5:0.5 G5:0.5 F#5:1 D#5:1 |' },
        { instrument: 'pad', role: 'pad', notes:
          'E4+G4+B4:4 | E4+G4+B4:4 | C4+E4+G4:4 | D4+F#4+A4:4 | E4+G4+B4:4 | E4+G4+B4:4 | C4+F4+A4:4 | B3+D#4+F#4:4 |' +
          'C4+E4+A4:4 | E4+G4+B4:4 | C4+E4+G4:4 | B3+D#4+F#4:4 | C4+E4+A4:4 | B3+D#4+F#4:4 | C4+E4+G4:4 | D4+F#4+A4:4 |' +
          'E4+G4+B4:4 | C4+F4+A4:4 | C4+E4+G4:4 | B3+D#4+F#4:4 |' },
        { instrument: 'bass_pluck', role: 'bass', notes:
          '[E3:0.75 E3:0.75 E4:0.5 E3:0.75 E3:0.75 G3:0.5 |]x2 C3:0.75 C3:0.75 C4:0.5 C3:0.75 C3:0.75 E3:0.5 | D3:0.75 D3:0.75 D4:0.5 D3:0.75 D3:0.75 F#3:0.5 |' +
          '[E3:0.75 E3:0.75 E4:0.5 E3:0.75 E3:0.75 G3:0.5 |]x2 F3:0.75 F3:0.75 F4:0.5 F3:0.75 F3:0.75 A3:0.5 | B2:0.75 B2:0.75 B3:0.5 B2:0.75 B2:0.75 D#3:0.5 |' +
          'A2:0.75 A2:0.75 A3:0.5 A2:0.75 A2:0.75 C3:0.5 | E3:0.75 E3:0.75 E4:0.5 E3:0.75 E3:0.75 G3:0.5 | C3:0.75 C3:0.75 C4:0.5 C3:0.75 C3:0.75 E3:0.5 | B2:0.75 B2:0.75 B3:0.5 B2:0.75 B2:0.75 D#3:0.5 |' +
          'A2:0.75 A2:0.75 A3:0.5 A2:0.75 A2:0.75 C3:0.5 | B2:0.75 B2:0.75 B3:0.5 B2:0.75 B2:0.75 D#3:0.5 | C3:0.75 C3:0.75 C4:0.5 C3:0.75 C3:0.75 E3:0.5 | D3:0.75 D3:0.75 D4:0.5 D3:0.75 D3:0.75 F#3:0.5 |' +
          'E3:0.75 E3:0.75 E4:0.5 E3:0.75 E3:0.75 G3:0.5 | F3:0.75 F3:0.75 F4:0.5 F3:0.75 F3:0.75 A3:0.5 | C3:0.75 C3:0.75 C4:0.5 C3:0.75 C3:0.75 E3:0.5 | B2:0.75 B2:0.75 B3:0.5 B2:0.75 B2:0.75 D#3:0.5 |' },
        { instrument: 'drums', role: 'drums', notes: '[k:0.75 h:0.75 s:0.5 k:0.75 k:0.75 s:0.5 |]x19 s:0.5 s:0.5 t:0.5 t:0.5 s:0.25 s:0.25 s:0.25 s:0.25 c:1 |' }
      ]
    },

    // ------------------------------------------------------------------ 最終戰
    final: {
      name: '最終戰：照亮遺忘之霧', key: 'C 小調', tempo: 160, meter: 4, loop: true,
      audio: { file: 'assets/music/final.m4a', seconds: 76.04, loopStart: 5.0, loopEnd: 76.04, gainDb: 0, lufs: -16.0 },
      mood: '最高潮、壯闊、全力以赴，最後轉為光明',
      origin: '開頭四小節是原創的「主音反覆＋跳進」快速音型（C-C-G-C-Ab），接著寬廣的長音主題；中段轉到關係大調降 E 大調象徵希望，最後衝上 G6 再回到開頭。',
      tracks: [
        { instrument: 'lead_saw', role: 'melody', notes:
          'C5:0.5 C5:0.5 G5:0.5 C5:0.5 Ab5:0.5 C5:0.5 G5:0.5 Eb5:0.5 | C5:0.5 C5:0.5 G5:0.5 C5:0.5 Ab5:0.5 G5:0.5 F5:0.5 D5:0.5 | Eb5:0.5 Eb5:0.5 C6:0.5 Eb5:0.5 Bb5:0.5 Ab5:0.5 G5:0.5 Eb5:0.5 | D5:0.5 D5:0.5 B5:0.5 D5:0.5 G5:1 r:1 |' +
          'G5:2 Eb5:1 C5:1 | D5:1.5 Eb5:0.5 F5:2 | Eb5:1 Ab5:1 C6:1.5 Bb5:0.5 | B5:2 G5:1 D5:1 |' +
          'G5:2 C6:1 Eb6:1 | D6:1.5 C6:0.5 Bb5:2 | Ab5:1 F5:1 C6:1.5 Ab5:0.5 | G5:3 r:1 |' +
          'Bb5:1 G5:0.5 Bb5:0.5 Eb6:2 | D6:1 Bb5:0.5 F5:0.5 Bb5:2 | C6:1 G5:0.5 Eb5:0.5 G5:1 C6:1 | Ab5:3 G5:0.5 F5:0.5 |' +
          'F5:1.5 G5:0.5 Ab5:1 C6:1 | B5:1.5 C6:0.5 D6:2 | Eb6:1 D6:0.5 C6:0.5 Ab5:1 Eb5:1 | D5:1 F5:1 G5:1 B5:1 |' +
          'C6:2 Ab5:2 | D6:2 Bb5:2 | B5:1 D6:1 G6:2 | G5:0.5 r:0.5 D5:0.5 r:0.5 B4:2 |' },
        { instrument: 'pad', role: 'pad', notes:
          'C4+Eb4+G4:4 | C4+Eb4+G4:4 | C4+Eb4+Ab4:4 | B3+D4+G4:4 |' +
          'C4+Eb4+G4:4 | D4+F4+Bb4:4 | C4+Eb4+Ab4:4 | B3+D4+G4:4 |' +
          'C4+Eb4+G4:4 | D4+F4+Bb4:4 | C4+F4+Ab4:4 | B3+D4+G4:4 |' +
          'Eb4+G4+Bb4:4 | D4+F4+Bb4:4 | C4+Eb4+G4:4 | C4+Eb4+Ab4:4 |' +
          'C4+F4+Ab4:4 | B3+D4+G4:4 | C4+Eb4+Ab4:4 | B3+D4+G4:4 |' +
          'C4+Eb4+Ab4:4 | D4+F4+Bb4:4 | B3+D4+G4:4 | B3+D4+G4:4 |' },
        { instrument: 'bass_pluck', role: 'bass', notes:
          '[C3:0.5 C4:0.5]x4 | [C3:0.5 C4:0.5]x4 | [Ab3:0.5 Eb3:0.5]x4 | [G3:0.5 D3:0.5]x4 |' +
          '[C3:0.5 C4:0.5]x4 | [Bb2:0.5 Bb3:0.5]x4 | [Ab3:0.5 Eb3:0.5]x4 | [G3:0.5 D3:0.5]x4 |' +
          '[C3:0.5 C4:0.5]x4 | [Bb2:0.5 Bb3:0.5]x4 | [F3:0.5 C3:0.5]x4 | [G3:0.5 D3:0.5]x4 |' +
          '[Eb3:0.5 Bb2:0.5]x4 | [Bb2:0.5 Bb3:0.5]x4 | [C3:0.5 C4:0.5]x4 | [Ab3:0.5 Eb3:0.5]x4 |' +
          '[F3:0.5 C3:0.5]x4 | [G3:0.5 D3:0.5]x4 | [Ab3:0.5 Eb3:0.5]x4 | [G3:0.5 D3:0.5]x4 |' +
          '[Ab3:0.5 Eb3:0.5]x4 | [Bb2:0.5 Bb3:0.5]x4 | [G3:0.5 D3:0.5]x4 | G3:0.5 r:0.5 D3:0.5 r:0.5 G3:2 |' },
        { instrument: 'drums', role: 'drums', notes: '[k:0.5 h:0.5 s:0.5 h:0.5 k:0.5 h:0.5 s:0.5 k:0.5 |]x23 s:0.25 s:0.25 s:0.25 s:0.25 s:0.5 s:0.5 t:0.5 t:0.5 c:1 |' }
      ]
    }
  },

  jingle: {
    // ------------------------------------------------------------------ 戰鬥勝利號角
    victory: {
      name: '勝利號角', key: 'C 大調', tempo: 132, meter: 4, loop: false, bgm: 'pause',
      audio: { file: 'assets/music/victory.m4a', seconds: 8.0054, gainDb: 1.0, lufs: -14.6 },
      mood: '開心、驕傲、「我們做到了！」',
      origin: '以 Sol-Do-Mi-Sol 分解和弦一路上行、經 IV 和弦停在高音 Do 的原創號角；沒有使用同音反覆三連音等既有勝利曲的特徵句。',
      tracks: [
        { instrument: 'brass', role: 'melody', notes: 'G4:0.5 C5:0.5 E5:0.5 G5:0.5 E5:0.75 G5:0.25 A5:1 | F5:0.5 A5:0.5 C6:0.5 A5:0.5 B5:0.5 D6:0.5 C6:1 | C6:3 r:1 |' },
        { instrument: 'pad', role: 'pad', notes: 'C4+E4+G4:2 C4+F4+A4:2 | F4+A4+C5:2 G4+B4+D5:1 E4+G4+C5:1 | E4+G4+C5:3 r:1 |' },
        { instrument: 'bass', role: 'bass', notes: 'C3:2 F3:2 | F3:2 G3:1 C3:1 | C3:3 r:1 |' },
        { instrument: 'drums', role: 'drums', notes: 'k:1 h:1 k:1 s:1 | k:1 s:1 k:0.5 s:0.5 s:0.5 s:0.5 | c:3 r:1 |' }
      ]
    },
    // ------------------------------------------------------------------ 升級
    levelup: {
      name: '升級了！', key: 'F 大調', tempo: 150, meter: 4, loop: false, bgm: 'pause',
      audio: { file: 'assets/music/levelup.m4a', seconds: 6.1383, gainDb: 0, lufs: -13.2 },
      mood: '閃亮、雀躍、變強了',
      origin: '兩小節快速分解和弦向上衝到 F6，配高音鐘聲閃光；旋律輪廓為原創。',
      tracks: [
        { instrument: 'lead_square', role: 'melody', notes: 'C5:0.5 F5:0.5 A5:0.5 C6:0.5 Bb5:0.5 D6:0.5 F6:1 | E6:0.5 C6:0.5 G5:0.5 E6:0.5 F6:2 |' },
        { instrument: 'bell', role: 'harmony', gain: 0.7, notes: 'r:2 F6:0.5 A6:0.5 C7:1 | r:2 A6:2 |' },
        { instrument: 'pad', role: 'pad', notes: 'F4+A4+C5:2 Bb4+D5+F5:2 | C5+E5+G5:2 F4+A4+C5:2 |' },
        { instrument: 'bass', role: 'bass', notes: 'F3:2 Bb2:2 | C3:2 F3:2 |' },
        { instrument: 'drums', role: 'drums', notes: 'k:1 s:1 k:1 s:1 | k:0.5 k:0.5 s:0.5 s:0.5 c:2 |' }
      ]
    },
    // ------------------------------------------------------------------ 委託完成
    quest_clear: {
      name: '委託完成', key: 'G 大調', tempo: 120, meter: 4, loop: false, bgm: 'pause',
      audio: { file: 'assets/music/quest_clear.m4a', seconds: 9.1809, gainDb: 0, lufs: -14.0 },
      mood: '溫暖的成就感、被感謝的開心',
      origin: '兩句「上行跳進＋級進回落」的原創問答句，第二句移高四度，最後停在明亮的 Si 上，鐘聲收尾。',
      tracks: [
        { instrument: 'lead_tri', role: 'melody', notes: 'D5:0.5 G5:0.5 B5:1 A5:0.5 G5:0.5 E5:1 | C5:0.5 E5:0.5 A5:1 F#5:0.5 A5:0.5 D6:1 | B5:3 r:1 |' },
        { instrument: 'bell', role: 'harmony', gain: 0.7, notes: 'r:4 | r:4 | G5:0.5 B5:0.5 D6:0.5 G6:1.5 r:1 |' },
        { instrument: 'pad', role: 'pad', notes: 'B3+D4+G4:2 C4+E4+G4:2 | C4+E4+A4:2 D4+F#4+A4:2 | B3+D4+G4:3 r:1 |' },
        { instrument: 'bass', role: 'bass', notes: 'G3:2 C3:2 | A2:2 D3:2 | G3:3 r:1 |' },
        { instrument: 'drums', role: 'drums', gain: 0.6, notes: 'k:1 h:1 s:1 h:1 | k:1 h:1 s:1 s:1 | c:3 r:1 |' }
      ]
    },
    // ------------------------------------------------------------------ 旅店休息
    inn_rest: {
      name: '旅店的晚安曲', key: 'F 大調', tempo: 96, meter: 3, loop: false, bgm: 'pause',
      audio: { file: 'assets/music/inn_rest.m4a', seconds: 9.9608, gainDb: 2.0, lufs: -16.5 },
      mood: '溫柔、安心、像搖籃曲一樣睡著再醒來',
      origin: '三拍子八音盒搖籃曲，從高音 Do 緩緩下行再回到主音，原創旋律。',
      tracks: [
        { instrument: 'bell', role: 'melody', notes: 'C6:1 A5:1 F5:1 | G5:1.5 Bb5:0.5 A5:1 | F5:1 D5:1 C5:1 | F5:3 |' },
        { instrument: 'pad', role: 'pad', notes: 'A3+C4+F4:3 | Bb3+C4+E4:3 | Bb3+D4+F4:3 | A3+C4+F4:3 |' },
        { instrument: 'bass', role: 'bass', gain: 0.8, notes: 'F3:3 | C3:3 | Bb2:3 | F3:3 |' }
      ]
    },
    // ------------------------------------------------------------------ 取得珍貴道具
    rare_item: {
      name: '得到珍貴的寶物', key: 'E 大調', tempo: 100, meter: 4, loop: false, bgm: 'pause',
      audio: { file: 'assets/music/rare_item.m4a', seconds: 8.3312, gainDb: 0, lufs: -13.9 },
      mood: '驚喜、閃閃發光、「哇！」',
      origin: '分解和弦上行後在 C#6、F#6 停留（vi 和弦的驚喜色彩），高音鐘聲持續閃爍，最後回到 E 大和弦，原創。',
      tracks: [
        { instrument: 'lead_tri', role: 'melody', notes: 'E5:0.5 G#5:0.5 B5:0.5 E6:0.5 D#6:0.5 B5:0.5 C#6:1 | A5:0.5 C#6:0.5 F#6:1 E6:2 |' },
        { instrument: 'bell', role: 'harmony', gain: 0.55, notes: '[B6:0.25 G#6:0.25]x8 | E6:0.5 B6:0.5 r:3 |' },
        { instrument: 'pad', role: 'pad', notes: 'E4+G#4+B4:2 C#4+E4+G#4:2 | C#4+F#4+A4:2 E4+G#4+B4:2 |' },
        { instrument: 'bass', role: 'bass', notes: 'E3:2 C#3:2 | F#3:2 E3:2 |' }
      ]
    },
    // ------------------------------------------------------------------ 點亮知識燈
    lamp_lit: {
      name: '知識燈亮了', key: 'A 大調', tempo: 108, meter: 3, loop: false, bgm: 'duck',
      audio: { file: 'assets/music/lamp_lit.m4a', seconds: 6.2237, gainDb: 1.5, lufs: -15.4 },
      mood: '「叮！」想通了、心裡亮起來',
      origin: '鐘聲五聲音階上行到 A6 的短句，像燈一盞盞亮起，原創。',
      tracks: [
        { instrument: 'bell', role: 'melody', notes: 'E5:0.5 A5:0.5 B5:0.5 C#6:0.5 E6:1 | F#6:0.5 E6:0.5 A6:2 |' },
        { instrument: 'pluck', role: 'harmony', gain: 0.6, notes: 'A4+C#5+E5:1 r:2 | A4+E5:1 r:2 |' },
        { instrument: 'pad', role: 'pad', notes: 'A3+C#4+E4:3 | A3+C#4+E4:3 |' }
      ]
    },
    // ------------------------------------------------------------------ 累倒
    faint: {
      name: '累倒了……', key: 'F 大調', tempo: 80, meter: 4, loop: false, bgm: 'pause',
      audio: { file: 'assets/music/faint.m4a', seconds: 9.1934, gainDb: 0, lufs: -14.0 },
      mood: '有點可惜但溫和，像「沒關係，休息一下」',
      origin: '長笛緩慢下行，用大調和弦收在主音（不用陰森的小調或不協和音），原創。',
      tracks: [
        { instrument: 'flute', role: 'melody', notes: 'C5:1 A4:0.5 Bb4:0.5 G4:2 | A4:1 F4:0.5 G4:0.5 E4:1 F4:1 |' },
        { instrument: 'pad', role: 'pad', notes: 'A3+C4+F4:2 Bb3+D4+G4:2 | A3+C4+F4:1 Bb3+D4+F4:1 Bb3+C4+E4:1 A3+C4+F4:1 |' },
        { instrument: 'bass', role: 'bass', notes: 'F3:2 G3:2 | F3:1 Bb2:1 C3:1 F3:1 |' }
      ]
    },
    // ------------------------------------------------------------------ 開寶箱
    chest: {
      name: '開寶箱小號角', key: 'C 大調', tempo: 150, meter: 4, loop: false, bgm: 'duck',
      audio: { file: 'assets/music/chest.m4a', seconds: 6.4695, gainDb: 0, lufs: -13.9 },
      mood: '輕快、俏皮的「登登！」',
      origin: '先級進 Mi-Fa-Sol、空一拍後跳上高音 Do 並做 Do-Si-Do 的小迴音，最後衝到 E6，原創小號角。',
      tracks: [
        { instrument: 'brass', role: 'melody', notes: 'E5:0.25 F5:0.25 G5:0.5 r:0.5 G5:0.5 C6:1 B5:0.5 C6:0.5 | E6:3 r:1 |' },
        { instrument: 'bell', role: 'harmony', gain: 0.6, notes: 'r:4 | C6:0.5 E6:0.5 G6:1 r:2 |' },
        { instrument: 'pad', role: 'pad', notes: 'E4+G4+C5:2 C4+E4+G4:2 | E4+G4+C5:3 r:1 |' },
        { instrument: 'bass', role: 'bass', notes: 'C3:2 G3:2 | C3:3 r:1 |' }
      ]
    },
    // ------------------------------------------------------------------ 結局
    ending: {
      name: '結局：知識之光', key: 'D 大調', tempo: 66, meter: 4, loop: false, bgm: 'pause',
      audio: { file: 'assets/music/ending.m4a', seconds: 10.9573, gainDb: 0, lufs: -14.0 },
      mood: '感動、圓滿、溫暖的光',
      origin: '慢板長笛從 Re 分解和弦上行、在 Si 稍停，再經 IV-V 走到高音 Re，和聲 I-IV-V-I 圓滿收尾；與標題曲同調性呼應，但旋律為另寫的原創句子。',
      tracks: [
        { instrument: 'flute', role: 'melody', notes: 'D5:1 F#5:0.5 A5:0.5 B5:1.5 A5:0.5 | G5:0.5 B5:0.5 A5:0.5 C#6:0.5 D6:2 |' },
        { instrument: 'bell', role: 'harmony', gain: 0.6, notes: 'r:2 A5:1 B5:1 | r:2 D6:0.5 F#6:0.5 A6:1 |' },
        { instrument: 'pad', role: 'pad', notes: 'D4+F#4+A4:2 B3+D4+G4:2 | B3+D4+G4:1 C#4+E4+A4:1 D4+F#4+A4:2 |' },
        { instrument: 'bass', role: 'bass', notes: 'D3:2 G3:2 | G3:1 A3:1 D3:2 |' }
      ]
    }
  }
};
