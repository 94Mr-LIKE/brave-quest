/*
 * 語音引擎（取代原本的 tts.js；保留 JQ.TTS 介面，題目朗讀照舊可用）
 *
 * 1. 預錄音檔優先：data/voice_manifest.js（window.VOICE_MANIFEST）列出的 assets/voice/<對話ID>_<句序>.mp3 才播放；
 *    清單裡沒有就「當作沒有」，絕不對不存在的檔案發請求（避免 404 與流量）。
 *    華語版可另錄 <對話ID>_<句序>_huayu.mp3（設定「華語優先」時使用）。
 * 2. 沒有音檔：用瀏覽器語音合成（speechSynthesis）。
 *    - 台語句（有 taigi 欄位）：先播很短的提示音，再用說話者的音色朗讀華語翻譯（瀏覽器沒有台語語音）。
 *    - 依說話者（window.VOICES）的性別、年齡、個性與這句的情緒（emotion）算出 pitch、rate；
 *      同一類角色再依 id 雜湊加一點固定差異，避免每個人聽起來一樣。
 *    - 挑音色：男性角色優先男聲；沒有男聲時用較低的 pitch 模擬。
 *    - 自然化：依標點切成短句逐段念，句間停 120～400ms；驚嘆句稍快稍高；疑問句尾的語助詞（嗎、呢、吧…）上揚；去掉括號裡的舞台說明；英文照舊用英文語音。
 *    - v0.7 挑語音：語言分＞品質分（Natural、Neural、Enhanced、Premium、增強、高品質）＞性別分；同一個角色每次都用同一個語音
 *      （同分的高品質語音依角色 id 固定分配，讓不同角色有不同聲音）。
 *    - v0.7 雲端語音（localService＝false，例如 Edge 的 Natural 語音）不再扣分，但送去雲端念的文字一律把玩家名字換成「勇者」；
 *      家長設定可以關掉雲端語音（關掉後只用本機語音）。
 *    - 不使用任何非官方或沒有授權的語音服務；只用瀏覽器內建的 speechSynthesis。
 *
 * 純計算的部分可以在 node 測試（module.exports）。
 */
(function () {
  'use strict';

  // ---------------------------------------------------------------- 音色辨識
  // 依語音名稱判斷性別（名稱含這些字就算；不分大小寫、忽略「-」與空白）
  var FEMALE = ['meijia', 'tingting', 'sinji', 'hanhan', 'yating', 'hsiaochen', 'hsiaoyu', 'huihui', 'yaoyao', 'xiaoxiao', 'xiaoyi', 'xiaohan', 'xiaomo', 'xiaorui', 'xiaoshuang', 'hiugaai', 'hiumaan', 'lili', 'female', '女'];
  var MALE = ['zhiwei', 'yunjhe', 'kangkang', 'yunxi', 'yunyang', 'yunjian', 'yunfeng', 'yunhao', 'wanlung', 'male', '男'];

  function voiceGender(name) {
    var n = String(name || '').toLowerCase().replace(/[\s\-_]/g, '');
    if (/female/.test(n)) return 'f';
    for (var i = 0; i < MALE.length; i++) if (n.indexOf(MALE[i]) >= 0) return 'm';
    for (var j = 0; j < FEMALE.length; j++) if (n.indexOf(FEMALE[j]) >= 0) return 'f';
    return 'n';   // 例如「Google 國語（臺灣）」：不知道性別，當中性
  }

  /** 語音品質分：名稱含 Natural／Neural（例如 Edge 的「Microsoft HsiaoChen Online (Natural)」）40；Enhanced／Premium／增強／高品質（iPad 增強版「美佳」）35 */
  var QUALITY = [[/natural|neural/i, 40], [/enhanced|premium|增強|高品質|優化/i, 35]];
  function voiceQuality(v) {
    var n = String((v && (v.name || '')) + ' ' + (v && v.voiceURI || ''));
    for (var i = 0; i < QUALITY.length; i++) if (QUALITY[i][0].test(n)) return QUALITY[i][1];
    return 0;
  }

  /**
   * 從語音清單挑一個。分數：語言（zh-TW 100 ＞ zh-HK 50 ＞ 其他 zh 20）＞ 品質（35～40）＞ 性別（相符 30、中性 10）。
   * opts = { allowCloud（預設 true；false 時不用雲端語音）, key（角色 id：同分時依 id 固定挑其中一個，讓不同角色聲音不同） }
   * 回傳 { voice, gender, matched, score, cloud }；沒有符合的語音時 voice 為 null。
   */
  function pickVoice(voices, want, lang, opts) {
    opts = opts || {};
    lang = (lang || 'zh-TW').toLowerCase();
    var pre = lang.split('-')[0];
    var cands = [];
    (voices || []).forEach(function (v) {
      var vl = String(v.lang || '').replace('_', '-').toLowerCase();
      if (vl.indexOf(pre) !== 0) return;
      if (opts.allowCloud === false && v.localService === false) return;
      var g = voiceGender(v.name);
      var score = 0;
      if (vl === lang) score += 100; else if (pre === 'zh' && vl === 'zh-hk') score += 50; else score += 20;
      score += voiceQuality(v);
      if (want && want !== 'n') score += g === want ? 30 : (g === 'n' ? 10 : 0);
      cands.push({ voice: v, gender: g, score: score });
    });
    if (!cands.length) return { voice: null, gender: 'n', matched: false, score: -1, cloud: false };
    var top = Math.max.apply(null, cands.map(function (c) { return c.score; }));
    var tier = cands.filter(function (c) { return c.score === top; });
    var best = tier[opts.key ? hash(String(opts.key)) % tier.length : 0];
    best.matched = !want || want === 'n' || best.gender === want;
    best.cloud = best.voice.localService === false;
    return best;
  }

  // 名字裡可能有的標點、括號、空白（半形與全形）
  var NAME_PUNCT = /[\s!-\/:-@\[-`{-~\u2018-\u201F\u2026\u3000-\u303F\uFF01-\uFF0F\uFF1A-\uFF20\uFF3B-\uFF40\uFF5B-\uFF65]/g;
  function escRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  /** 名字要遮蔽的寫法：整個名字、拿掉標點括號空白後的名字（由長到短，避免先換掉一部分） */
  function nameVariants(name) {
    var n = String(name || '').trim();
    if (!n) return [];
    var out = [n], core = n.replace(NAME_PUNCT, '');
    if (core && core !== n) out.push(core);
    return out.sort(function (a, b) { return b.length - a.length; });
  }

  /**
   * 送去雲端語音念的文字：把玩家自訂的名字換成「勇者」（兒童的名字不送到雲端）。
   * 整個名字與拿掉標點括號後的名字都換；英文字母不分大小寫（Ken／ken）。
   */
  function maskName(text, name) {
    var s = String(text || '');
    nameVariants(name).forEach(function (v) { s = s.replace(new RegExp(escRe(v), 'gi'), '勇者'); });
    return s;
  }

  /**
   * 這次朗讀有沒有可能用到雲端語音（裝置上有雲端語音、或語音清單還沒載入不知道）。
   * 有可能就在「切句之前」先把整句的名字遮掉（切句會拿掉括號、把英文切成另一段，名字被切開就比對不到）。
   * 不看「允許雲端」開關：關掉時某一段若找不到本機語音，瀏覽器會改用它的預設語音，而預設語音可能是雲端的（夜班審查 F1）。
   * 代價：關掉雲端時，本機語音念到名字也會說「勇者」。
   */
  function cloudPossible() {
    var list = voicesList();
    return !list.length || list.some(function (v) { return v.localService === false; });
  }
  function premask(text) { return cloudPossible() ? maskName(text, settings.playerName) : String(text || ''); }

  // ---------------------------------------------------------------- 說話者設定
  var GENDER_ALIAS = { m: 'm', male: 'm', man: 'm', boy: 'm', '男': 'm', f: 'f', female: 'f', woman: 'f', girl: 'f', '女': 'f' };
  var AGE_ALIAS = { child: 'child', kid: 'child', '小孩': 'child', '兒童': 'child', teen: 'teen', youth: 'teen', young: 'teen', '少年': 'teen', '青少年': 'teen',
    adult: 'adult', '大人': 'adult', '成人': 'adult', middle: 'adult', '中年': 'adult', elder: 'elder', old: 'elder', senior: 'elder', '老人': 'elder', '長者': 'elder', '老年': 'elder' };

  function normAge(a) {
    if (typeof a === 'number') return a < 12 ? 'child' : a < 18 ? 'teen' : a < 60 ? 'adult' : 'elder';
    return AGE_ALIAS[String(a || '').toLowerCase()] || AGE_ALIAS[a] || 'adult';
  }

  /** 沒有 VOICES 設定時，依名字猜（阿伯、阿姨、小孩…） */
  function inferProfile(id, name) {
    var s = String(name || '') + ' ' + String(id || '');
    var p = { gender: 'n', age: 'adult', persona: '' };
    if (/阿伯|伯|阿公|爺|老爺|國王|族長|酋長|里長|長老|師傅|廟公|導師|鐵匠|king|chief|elder|smith/.test(s)) p.gender = 'm';
    if (/阿姨|阿嬤|姨|婆|奶奶|老闆娘|小姐|女|aunt|grandma/.test(s)) p.gender = 'f';
    if (/阿伯|阿公|爺|阿嬤|奶奶|長老|廟公|老|國王|里長伯|elder|king/.test(s)) p.age = 'elder';
    if (/小孩|孩子|寶寶|葉葉|咕嚕|小朋友|kid|child/.test(s)) p.age = 'child';
    return p;
  }

  /** 說話者的設定：VOICES.speakers[id]／player／pet 優先，沒有就推測 */
  function profileFor(who, voices, ctx) {
    ctx = ctx || {};
    var V = voices || {};
    var raw = null;
    if (who === 'hero' || who === 'player') {
      // VOICES.player 可能依性別分開：{ f: {...}, m: {...} }
      var pl = V.player || {};
      var byG = pl[ctx.playerGender] || pl.f || pl.m;
      raw = Object.assign({ age: 'child', gender: ctx.playerGender || 'n' }, byG || pl, ctx.playerGender ? { gender: ctx.playerGender } : {});
    }
    else if (who === 'pet') raw = V.pet || { age: 'child', gender: 'n', persona: 'cute' };
    else if (who === 'narrator') raw = (V.speakers && V.speakers.narrator) || { age: 'adult', gender: 'n', persona: 'calm' };
    else if (V.speakers && V.speakers[who]) raw = V.speakers[who];
    else raw = inferProfile(who, ctx.name);
    // VOICES 寫了 pitch／rate 的角色：數值是劇情設計師依性別年齡調好的「絕對值」，直接用（不再疊加年齡、性別、個性與雜湊差異）
    var abs = typeof raw.pitch === 'number' || typeof raw.rate === 'number';
    return {
      id: who, gender: GENDER_ALIAS[String(raw.gender || '').toLowerCase()] || GENDER_ALIAS[raw.gender] || 'n',
      age: normAge(raw.age), persona: String(raw.persona || ''),
      pitch: Number(raw.pitch) || 1, rate: Number(raw.rate) || 1, taigi: !!raw.taigi, abs: abs
    };
  }

  // ---------------------------------------------------------------- 音高與語速
  var AGE = { child: { pitch: 0.32, rate: 0.1 }, teen: { pitch: 0.14, rate: 0.05 }, adult: { pitch: 0, rate: 0 }, elder: { pitch: -0.16, rate: -0.15 } };
  var GENDER = { f: 0.1, m: -0.12, n: 0 };
  // 個性關鍵字（中英文都可以）→ 調整
  var PERSONA = [
    [/energetic|lively|cheerful|活潑|開朗|熱情|元氣/, { pitch: 0.05, rate: 0.08 }],
    [/calm|steady|wise|沉穩|冷靜|穩重|睿智|慈祥/, { pitch: -0.03, rate: -0.07 }],
    [/grumpy|gruff|暴躁|兇|嚴肅|固執/, { pitch: -0.05, rate: 0.04 }],
    [/shy|timid|害羞|膽小/, { pitch: 0.04, rate: -0.06, volume: -0.15 }],
    [/gentle|kind|溫柔|和藹|親切/, { pitch: 0.03, rate: -0.04 }],
    [/cute|可愛|撒嬌/, { pitch: 0.08, rate: 0.04 }],
    [/proud|boastful|驕傲|得意|自信/, { pitch: 0.02, rate: 0.02 }],
    [/sleepy|lazy|愛睏|慵懶/, { pitch: -0.05, rate: -0.12 }]
  ];
  var EMOTION = {
    surprised: { pitch: 0.12, rate: 0.05 }, surprise: { pitch: 0.12, rate: 0.05 }, '驚訝': { pitch: 0.12, rate: 0.05 },
    worried: { pitch: -0.03, rate: -0.12 }, '擔心': { pitch: -0.03, rate: -0.12 }, anxious: { pitch: 0.02, rate: -0.08 },
    happy: { pitch: 0.06, rate: 0.05 }, '開心': { pitch: 0.06, rate: 0.05 }, excited: { pitch: 0.1, rate: 0.1 }, '興奮': { pitch: 0.1, rate: 0.1 },
    sad: { pitch: -0.08, rate: -0.1 }, '難過': { pitch: -0.08, rate: -0.1 },
    angry: { pitch: 0.03, rate: 0.08, volume: 0.1 }, '生氣': { pitch: 0.03, rate: 0.08, volume: 0.1 },
    scared: { pitch: 0.1, rate: 0.1 }, '害怕': { pitch: 0.1, rate: 0.1 },
    tired: { pitch: -0.06, rate: -0.12 }, '累': { pitch: -0.06, rate: -0.12 },
    proud: { pitch: 0.04, rate: 0.02 }, calm: { pitch: -0.02, rate: -0.05 }, '平靜': { pitch: -0.02, rate: -0.05 },
    mysterious: { pitch: -0.06, rate: -0.1, volume: -0.1 }, '神祕': { pitch: -0.06, rate: -0.1, volume: -0.1 },
    whisper: { pitch: 0, rate: -0.08, volume: -0.3 }
  };

  function hash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    return h >>> 0;
  }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  /**
   * 算出這句的 pitch、rate、volume（給 SpeechSynthesisUtterance）
   * opts = { emotion, rateMult（設定的整體語速）, volume（設定的音量 0～1）, lowerForMale（沒有男聲時壓低） }
   */
  function prosody(profile, opts) {
    opts = opts || {};
    var p = 1, r = 1, v = 1;
    if (profile.abs) {
      // VOICES 的絕對值（劇情設計師已依男女老少與個性調好，同類角色也已錯開）
      p = profile.pitch || 1; r = profile.rate || 1;
    } else {
      var a = AGE[profile.age] || AGE.adult;
      p += a.pitch; r += a.rate;
      p += GENDER[profile.gender] || 0;
      PERSONA.forEach(function (pr) { if (pr[0].test(profile.persona)) { p += pr[1].pitch || 0; r += pr[1].rate || 0; v += pr[1].volume || 0; } });
      // 個別差異：同一個 id 永遠一樣，不同 id 不同（pitch ±0.06、rate ±0.04）
      var h = hash(String(profile.id || ''));
      p += ((h % 1000) / 1000 - 0.5) * 0.12;
      r += (((h >>> 10) % 1000) / 1000 - 0.5) * 0.08;
      p *= profile.pitch || 1;
      r *= profile.rate || 1;
    }
    var e = EMOTION[opts.emotion] || EMOTION[String(opts.emotion || '').toLowerCase()];
    if (e) { p += e.pitch || 0; r += e.rate || 0; v += e.volume || 0; }
    if (opts.lowerForMale) p *= profile.abs ? 0.88 : 0.78;   // 男性角色卻沒有男聲：再壓低一點
    r *= opts.rateMult || 1;
    v *= opts.volume === undefined ? 1 : opts.volume;
    return { pitch: clamp(p, 0.3, 2), rate: clamp(r, 0.55, 1.6), volume: clamp(v, 0, 1) };
  }

  // ---------------------------------------------------------------- 分段
  var PAUSE = { '，': 180, ',': 180, '、': 130, '；': 230, ';': 230, '：': 180, '。': 380, '.': 380, '！': 340, '!': 340, '？': 360, '?': 360, '…': 420 };

  /** 去掉括號裡的舞台說明：（笑）、(小聲)、【動作】、［…］ */
  function stripStage(text) {
    return String(text || '').replace(/（[^（）]*）|\([^()]*\)|【[^【】]*】|［[^［］]*］|\[[^\[\]]*\]/g, '').replace(/\s{2,}/g, ' ').trim();
  }

  /**
   * 切成短句：[{ text, lang, pauseAfter, rise }]
   * - 依中文標點切，句間停頓依標點；「！」結尾 rise=true（尾音稍高）
   * - 每一短句裡的英文單字串照原規則用 latinLang（英文語音）念
   */
  function chunks(text, latinLang) {
    var s = stripStage(text);
    var out = [];
    var re = /[^，,、；;：。！!？?…]+(?:[，,、；;：。！!？?]|…+)*/g, m;
    while ((m = re.exec(s))) {
      var piece = m[0];
      var punct = (piece.match(/(?:[，,、；;：。！!？?]|…)+$/) || [''])[0];
      var body = piece.slice(0, piece.length - punct.length).trim();
      if (!body.replace(/[\s「」『』"“”'‘’]/g, '').length) continue;
      var last = punct.charAt(punct.length - 1);
      var pause = PAUSE[last] || 0;
      if (/…/.test(punct)) pause = PAUSE['…'];
      var rise = /[！!]/.test(punct), ask = /[？?]/.test(punct);
      var parts = splitLatin(body + (ask ? '？' : ''), latinLang);
      parts.forEach(function (pt, i) {
        var lastPart = i === parts.length - 1;
        // 疑問句：句尾的語助詞（嗎、呢、吧…）單獨念、音調上揚（例：「你準備好了」＋「嗎？」）
        var m2 = lastPart && ask && pt.lang === 'zh-TW' ? /^(.{3,}?)([嗎呢吧啊呀喔哦嘛咧捏麼])？$/.exec(pt.text) : null;
        if (m2) {
          out.push({ text: m2[1], lang: pt.lang, pauseAfter: 0, ask: true });
          out.push({ text: m2[2] + '？', lang: pt.lang, pauseAfter: pause, askTail: true });
        } else out.push({ text: pt.text, lang: pt.lang, pauseAfter: lastPart ? pause : 0, rise: rise && lastPart, ask: ask && lastPart });
      });
    }
    if (out.length) out[out.length - 1].pauseAfter = 0;
    return out;
  }

  /** 連續的英文字母（含空白、標點）用 latinLang（原本 tts.js 的規則） */
  function splitLatin(text, latinLang) {
    var out = [];
    var re = /([A-Za-z][A-Za-z0-9 ,.'!?\-]*[A-Za-z0-9.!?]|[A-Za-z])/g;
    var last = 0, m;
    while ((m = re.exec(text))) {
      if (m.index > last) out.push({ text: text.slice(last, m.index), lang: 'zh-TW' });
      out.push({ text: m[0], lang: latinLang || 'en-US' });
      last = m.index + m[0].length;
    }
    if (last < text.length) out.push({ text: text.slice(last), lang: 'zh-TW' });
    return out.filter(function (x) { return x.text.replace(/[\s，。、！？「」（）()]/g, '').length; });
  }

  // ---------------------------------------------------------------- 預錄音檔
  /**
   * 找這句的音檔：manifest[<對話ID>_<句序>]（華語版另找 _huayu）。沒有清單或沒有這筆 → null（不發任何請求）
   * pref：'taigi'（預設，台語句用台語錄音）或 'huayu'
   */
  function voiceFile(manifest, dialogId, index, line, pref) {
    if (!manifest || !dialogId || index === undefined || index === null) return null;
    var key = dialogId + '_' + index;
    var isTaigi = !!(line && line.taigi);
    if (isTaigi && pref === 'huayu') return manifest[key + '_huayu'] || null;
    return manifest[key] || null;
  }

  // ---------------------------------------------------------------- 播放（瀏覽器）
  var synth = typeof window !== 'undefined' ? (window.speechSynthesis || null) : null;
  var enabled = true, speaking = false, token = 0, audioEl = null, timers = [];
  var settings = { volume: 0.9, rateMult: 1, pref: 'taigi', allowCloud: true, playerName: '' };
  var voiceCache = {};   // 角色 id＋語言 → 語音名稱（同一個角色每次都用同一個語音）
  var stats = { utterances: 0, files: 0, cues: 0 };   // 給測試看

  function voicesList() { try { return synth && synth.getVoices ? synth.getVoices() || [] : []; } catch (e) { return []; } }
  function later(fn, ms) { var id = setTimeout(fn, ms); timers.push(id); return id; }

  function stop() {
    token++;
    timers.forEach(clearTimeout); timers = [];
    if (synth) { try { synth.cancel(); } catch (e) { /* 忽略 */ } }
    if (audioEl) { try { audioEl.pause(); } catch (e) { /* 忽略 */ } audioEl = null; }
    speaking = false;
  }

  /**
   * 角色固定用的語音：第一次挑好就記住（同一個角色不會這句男聲、下一句女聲）。
   * 記住的語音不在清單裡了（例如換了裝置設定）或雲端設定改了，才重新挑。
   */
  function voiceFor(profile, lang, list) {
    var key = (profile.id || 'narrator') + '|' + lang + '|' + (settings.allowCloud ? 'c' : 'l');
    var cached = voiceCache[key];
    if (cached) {
      var still = list.filter(function (v) { return v.name === cached.name && v.lang === cached.lang; })[0];
      if (still) return { voice: still, gender: cached.gender, matched: cached.matched, cloud: still.localService === false };
    }
    var pick = pickVoice(list, profile.gender, lang, { allowCloud: settings.allowCloud, key: profile.id });
    if (pick.voice) voiceCache[key] = { name: pick.voice.name, lang: pick.voice.lang, gender: pick.gender, matched: pick.matched };
    return pick;
  }

  /** 依序念一串短句；每句念完（或保險時間到）才停頓、念下一句。回傳 false＝不能朗讀 */
  function speakChunks(list, profile, emotion, onStart, onEnd) {
    if (!synth || !enabled || typeof SpeechSynthesisUtterance === 'undefined' || !list.length) { if (onEnd) onEnd(); return false; }
    stop();
    var my = token;
    speaking = true;
    if (onStart) onStart();
    // 語音清單還沒載入（有些瀏覽器要等一下）：先等最多 0.7 秒，免得第一句用預設聲音、之後換成別的聲音
    if (!voicesList().length && !speakChunks.waited) {
      speakChunks.waited = true;
      var resume = function () { if (my === token) speakChunks(list, profile, emotion, null, onEnd); };
      try { synth.addEventListener('voiceschanged', function once() { synth.removeEventListener('voiceschanged', once); resume(); }); } catch (e) { /* 忽略 */ }
      later(resume, 700);
      return true;
    }
    var pick = voiceFor(profile, 'zh-TW', voicesList());
    var base = prosody(profile, { emotion: emotion, rateMult: settings.rateMult, volume: settings.volume, lowerForMale: profile.gender === 'm' && !pick.matched });
    var i = 0;
    function finish() { if (my !== token) return; speaking = false; if (onEnd) onEnd(); }
    function next() {
      if (my !== token) return;
      if (i >= list.length) { finish(); return; }
      var c = list[i++];
      var vp = c.lang === 'zh-TW' ? pick : voiceFor(profile, c.lang, voicesList());
      // 雲端語音：玩家名字換成「勇者」再送出（第二道防線；第一道在切句之前 premask）
      var text = vp.cloud || !vp.voice ? maskName(c.text, settings.playerName) : c.text;
      var u = new SpeechSynthesisUtterance(text);
      u.lang = c.lang;
      if (vp.voice) u.voice = vp.voice;
      // 韻律：驚嘆句稍快稍高；疑問句整句略高、句尾語助詞再上揚
      var dp = (c.rise ? 0.07 : 0) + (c.ask ? 0.04 : 0) + (c.askTail ? 0.16 : 0);
      var dr = c.rise ? 1.08 : (c.askTail ? 0.95 : 1);
      u.pitch = clamp(base.pitch + dp, 0, 2);
      u.rate = clamp((c.lang === 'zh-TW' ? base.rate : base.rate * 0.9) * dr, 0.5, 1.6);
      u.volume = base.volume;
      var done = false;
      var go = function () { if (done || my !== token) return; done = true; later(next, c.pauseAfter || 0); };
      u.onend = go; u.onerror = go;
      later(go, 1500 + c.text.length * 320);   // 保險：有些瀏覽器不會觸發 onend
      try { synth.speak(u); stats.utterances++; } catch (e) { go(); }
    }
    next();
    return true;
  }

  /** 題目朗讀（相容舊 tts.js）：lang＝題目的 tts_lang，英文段落用英文語音 */
  function speak(text, lang, onStart, onEnd) {
    var latin = lang && lang.indexOf('en') === 0 ? lang : 'en-US';
    return speakChunks(chunks(premask(text), latin), { id: 'narrator', gender: 'n', age: 'adult', persona: 'calm', pitch: 1, rate: 1 }, null, onStart, onEnd);
  }

  /** 播預錄音檔（只會播 manifest 列出的檔案） */
  function playFile(url, profile, onEnd) {
    stop();
    var my = token;
    // 相對路徑（例 assets/voice/D_X_0.mp3）：<audio> 不經過 WebGL，http 與 file:// 都能直接播
    var src = String(url || '').replace(/^\.\//, '').replace(/^docs\//, '');
    if (!src || /^[a-z]+:\/\//i.test(src) || src.charAt(0) === '/') return false;   // 只播本站的相對路徑
    try {
      var a = new Audio(window.JQ && window.JQ.Assets && window.JQ.Assets.versioned ? window.JQ.Assets.versioned(src) : src);   // 網址加版本號，避免快取到舊錄音
      a.volume = clamp(settings.volume, 0, 1);
      // 依說話者微調播放速度（±10%）；preservesPitch=false 讓小孩更高、老人更低一點
      var p = prosody(profile, { rateMult: 1 });
      a.playbackRate = clamp(1 + (p.pitch - 1) * 0.15, 0.9, 1.1) * clamp(settings.rateMult, 0.8, 1.2);
      try { a.preservesPitch = false; a.mozPreservesPitch = false; a.webkitPreservesPitch = false; } catch (e) { /* 忽略 */ }
      audioEl = a;
      speaking = true;
      var end = function () { if (my !== token) return; speaking = false; audioEl = null; if (onEnd) onEnd(); };
      a.onended = end; a.onerror = end;
      var pr = a.play();
      if (pr && pr.catch) pr.catch(end);
      stats.files++;
      return true;
    } catch (e) { return false; }
  }

  /**
   * 念一句對話。o = { line, dialogId, index, who, name, playerGender, playerName }
   * 預錄音檔 → 台語提示音＋華語翻譯 → 語音合成
   */
  function sayLine(o, onEnd) {
    if (!enabled) { if (onEnd) onEnd(); return false; }
    var line = o.line || {};
    var profile = profileFor(o.who || line.who, typeof window !== 'undefined' ? window.VOICES : null, { name: o.name, playerGender: o.playerGender });
    var file = voiceFile(typeof window !== 'undefined' ? window.VOICE_MANIFEST : null, o.dialogId, o.index, line, settings.pref);
    if (file && playFile(file, profile, onEnd)) return true;
    var view = window.JQ.DialogText.view(line, 'both', o.playerName);
    if (view.isTaigi) {
      stop();
      if (window.JQ.Audio) { window.JQ.Audio.play('taigi'); stats.cues++; }
      var my = token;
      later(function () { if (my === token) speakChunks(chunks(premask(view.speak), 'en-US'), profile, line.emotion, null, onEnd); }, 320);
      speaking = true;
      return true;
    }
    return speakChunks(chunks(premask(view.speak), 'en-US'), profile, line.emotion, null, onEnd);
  }

  function warmUp() {
    if (!synth || typeof SpeechSynthesisUtterance === 'undefined') return;
    try { var u = new SpeechSynthesisUtterance(''); u.volume = 0; synth.speak(u); } catch (e) { /* 忽略 */ }
    try { synth.getVoices(); } catch (e) { /* 忽略：有些瀏覽器要先呼叫一次才會載入語音清單 */ }
  }

  /** s = { volume 0～1, rateMult 0.8～1.2, pref 'taigi'|'huayu' } */
  function configure(s) {
    if (!s) return;
    if (typeof s.volume === 'number') settings.volume = clamp(s.volume, 0, 1);
    if (typeof s.rateMult === 'number') settings.rateMult = clamp(s.rateMult, 0.6, 1.5);
    if (s.pref === 'taigi' || s.pref === 'huayu') settings.pref = s.pref;
    if (typeof s.allowCloud === 'boolean') settings.allowCloud = s.allowCloud;
    if (typeof s.playerName === 'string') settings.playerName = s.playerName;
  }

  /** 設定頁顯示用：說話者（預設旁白）現在會用哪一個語音 */
  function currentVoice(who) {
    var profile = profileFor(who || 'narrator', typeof window !== 'undefined' ? window.VOICES : null, {});
    var p = voiceFor(profile, 'zh-TW', voicesList());
    return p.voice ? { name: p.voice.name, lang: p.voice.lang, cloud: p.voice.localService === false, quality: voiceQuality(p.voice) } : null;
  }

  var Voice = {
    FEMALE: FEMALE, MALE: MALE, voiceGender: voiceGender, pickVoice: pickVoice, voiceQuality: voiceQuality, maskName: maskName, nameVariants: nameVariants, voiceFor: voiceFor, currentVoice: currentVoice,
    _settings: settings, _cache: voiceCache, inferProfile: inferProfile, profileFor: profileFor,
    prosody: prosody, stripStage: stripStage, chunks: chunks, splitLatin: splitLatin, voiceFile: voiceFile, hash: hash,
    sayLine: sayLine, speak: speak, stop: stop, warmUp: warmUp, configure: configure, stats: stats,
    isSpeaking: function () { return speaking; },
    available: function () { return !!(synth && typeof SpeechSynthesisUtterance !== 'undefined'); },
    setEnabled: function (v) { enabled = !!v; if (!v) stop(); }
  };
  if (typeof window !== 'undefined') {
    window.JQ = window.JQ || {};
    window.JQ.Voice = Voice;
    // 相容舊介面：題目朗讀、時間條暫停都還是用 JQ.TTS
    window.JQ.TTS = { speak: speak, stop: stop, warmUp: warmUp, segments: splitLatin, isSpeaking: Voice.isSpeaking, available: Voice.available, setEnabled: Voice.setEnabled };
  }
  if (typeof module !== 'undefined') module.exports = Voice;
})();
