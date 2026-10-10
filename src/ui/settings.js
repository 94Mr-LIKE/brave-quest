/* 家長設定（先過家長確認）、家長報表、存檔碼、休息提醒、今日上限畫面 */
(function () {
  'use strict';
  var J = window.JQ;
  function h() { return J.UI.h.apply(null, arguments); }
  var LIMIT_LABEL = { 0: '不限' };
  var TIME_LABEL = { relaxed: '寬鬆（時間 1.5 倍）', standard: '標準', off: '關閉（不計時）' };
  var VOL_OPTIONS = [{ value: 'small', label: '小' }, { value: 'mid', label: '中' }, { value: 'large', label: '大' }];
  var SAMPLE_LINE = '你好！我是勇者大冒險的說書人，歡迎來到金包里。';

  /**
   * v0.9.3 語音模型：列出這台裝置可用的中文語音（下拉選單），選好就存起來並試聽一次。
   * 「自動」＝依角色男女老少挑（原本的做法）。台語預錄音檔不受影響。
   * 有些瀏覽器的語音清單要等一下才會出現：清單變了就重新整理這一塊。
   */
  function voicePicker(G, apply) {
    var st = G.state, box = h('div.voice-pick');
    function build() {
      box.innerHTML = '';
      var list = J.Voice.chineseVoices();
      var cur = st.settings.voiceName || '';
      var sel = h('select.voice-select', { 'aria-label': '選擇語音' });
      sel.appendChild(h('option', { value: '', text: '自動（依角色挑選男女老少的聲音）' }));
      list.forEach(function (v) {
        sel.appendChild(h('option', { value: v.name, text: v.name + '（' + v.lang + (v.cloud ? '・雲端' : '・本機') + (v.quality ? '・高品質' : '') + '）' }));
      });
      // 存的語音不在這台裝置上（例如換了裝置）：照樣顯示，但標示找不到，實際念的時候會改用自動
      if (cur && !list.some(function (v) { return v.name === cur; })) sel.appendChild(h('option', { value: cur, text: cur + '（這台裝置找不到，會改用自動）' }));
      sel.value = cur;
      sel.addEventListener('change', function () {
        st.settings.voiceName = sel.value;
        apply();
        J.Voice.sayLine({ line: { who: 'narrator', text: SAMPLE_LINE }, who: 'narrator' });
      });
      var now = J.Voice.currentVoice('narrator');
      box.appendChild(h('h3', { text: '語音（電腦合成的聲音）' }));
      box.appendChild(h('div.row', {}, [sel,
        h('button', { onclick: function () { J.Voice.sayLine({ line: { who: 'narrator', text: SAMPLE_LINE }, who: 'narrator' }); }, 'aria-label': '試聽目前的語音' }, ['🔊 試聽'])]));
      box.appendChild(h('p.small.voice-now', { text: (now ? '目前的語音：' + now.name + (now.cloud ? '（雲端）' : '（本機）') + (now.quality ? '・高品質' : '')
        : '目前的語音：這台裝置沒有中文語音（會用瀏覽器預設的聲音）') + (list.length ? '　這台裝置有 ' + list.length + ' 個中文語音。' : '') }));
      box.appendChild(h('p.small', { text: '選了語音之後，所有角色的華語台詞都用這個聲音（音高、快慢仍依角色調整）。台語台詞的預錄語音不受影響。' }));
    }
    build();
    try {
      if (window.speechSynthesis && window.speechSynthesis.addEventListener) {
        var onChange = function () { if (document.body.contains(box)) build(); else window.speechSynthesis.removeEventListener('voiceschanged', onChange); };
        window.speechSynthesis.addEventListener('voiceschanged', onChange);
      }
    } catch (e) { /* 忽略 */ }
    return box;
  }

  /**
   * 家長確認：兩位數 × 兩位數。回傳 Promise<boolean>
   * 資安審查 F-04：原本「兩位數 × 一位數」正好是三年級數學課的內容，孩子自己就能通過；改成四年級才學的兩位數 × 兩位數。
   */
  function gate() {
    return new Promise(function (resolve) {
      var a = 13 + Math.floor(Math.random() * 27), b = 13 + Math.floor(Math.random() * 17);
      var tries = 0, ok = false;
      var input = h('input', { type: 'text', inputmode: 'numeric', autocomplete: 'off', 'aria-label': '答案', maxlength: '4' });
      var msg = h('p.small', { 'aria-live': 'polite' });
      var handle;
      function check() {
        if (Number(input.value) === a * b) { ok = true; handle.close(); resolve(true); return; }
        tries++;
        msg.textContent = tries >= 3 ? '答錯太多次了，請家長再試一次。' : '不對喔，請再算一次。';
        if (tries >= 3) { setTimeout(function () { handle.close(); }, 900); }
        input.value = '';
      }
      input.addEventListener('keydown', function (e) { if (e.key === 'Enter') check(); });
      var panel = h('form.win.panel.narrow', { onsubmit: function (e) { e.preventDefault(); check(); } }, [
        h('h2', { text: '⚙️ 家長確認' }),
        h('p', { text: '這裡是家長設定。請家長算出答案：' }),
        h('p', { style: { fontSize: '30px' }, text: a + ' × ' + b + ' = ?' }),
        h('div.field', {}, [input]), msg,
        h('div.row.end', {}, [h('button', { type: 'button', onclick: function () { handle.close(); } }, ['取消']), h('button.primary', { type: 'submit' }, ['確定'])])
      ]);
      handle = J.UI.open(panel, { label: '家長確認', onClose: function () { if (!ok) resolve(false); }, focus: input });
    });
  }

  /**
   * 打開家長設定（v0.4）：通過家長確認一次後，設定開著的期間與關掉後 10 分鐘內不再詢問；
   * 設定已經開著、或確認視窗已經開著時，不會再開第二個。
   */
  function open(G) {
    var pass = G.gatePass || (G.gatePass = J.ParentGate.create());
    if (G.settingsHandle) return Promise.resolve(true);
    if (!J.ParentGate.needAsk(pass, Date.now())) { panel(G); return Promise.resolve(true); }
    if (!J.ParentGate.beginAsk(pass)) return Promise.resolve(false);
    G.gateAsks = (G.gateAsks || 0) + 1;   // 測試用：確認視窗開過幾次
    return gate().then(function (ok) {
      J.ParentGate.endAsk(pass);
      if (ok) { J.ParentGate.grant(pass, Date.now()); panel(G); }
      return ok;
    });
  }

  function panel(G) {
    var st = G.state;
    var body = h('div');
    var handle;
    var root = h('div.win.panel', {}, [h('button.close.ghost', { onclick: function () { handle.close(); }, 'aria-label': '關閉' }, ['✕ 關閉']), h('h2', { text: '⚙️ 家長設定' }), body]);
    handle = J.UI.open(root, { label: '家長設定', onClose: function () {
      G.settingsHandle = null;
      if (G.gatePass) J.ParentGate.closePanel(G.gatePass, Date.now());
      G.applySettings();
    } });
    G.settingsHandle = handle;

    function radioRow(title, name, options, current, onPick) {
      var row = h('div.row', { role: 'radiogroup', 'aria-label': title });
      options.forEach(function (op) {
        row.appendChild(h('button', { role: 'radio', 'aria-checked': String(op.value === current), 'aria-pressed': String(op.value === current), onclick: function () { onPick(op.value); render(); } }, [op.label]));
      });
      return h('div', {}, [h('h3', { text: title }), row]);
    }

    function render() {
      body.innerHTML = '';
      body.appendChild(radioRow('每日遊玩上限', 'limit', J.Playtime.LIMIT_OPTIONS.map(function (m) { return { value: m, label: LIMIT_LABEL[m] || (m + ' 分鐘') }; }),
        st.settings.dailyLimitMin, function (v) { st.settings.dailyLimitMin = v; G.save(); }));
      body.appendChild(h('p.small', { text: '連續玩 20 分鐘會跳出休息提醒；到達上限會存檔並顯示「今天冒險到這裡」，隔天重置。' }));
      body.appendChild(radioRow('戰鬥答題時間', 'time', ['relaxed', 'standard', 'off'].map(function (k) { return { value: k, label: TIME_LABEL[k] }; }),
        st.settings.answerTime, function (v) { st.settings.answerTime = v; G.save(); }));
      body.appendChild(h('p.small', { text: '標準：1 星題 30 秒、2 星 40 秒、3 星 60 秒、4 星 90 秒。朗讀時時間條會暫停。' }));
      // 語音（對話與題目朗讀）：家長可以整個關掉
      var apply = function () { G.save(); G.applySettings(); };
      body.appendChild(radioRow('語音（對話、題目朗讀）', 'tts', [{ value: true, label: '開' }, { value: false, label: '關' }], st.settings.tts, function (v) { st.settings.tts = v; apply(); }));
      if (st.settings.tts !== false) {
        body.appendChild(radioRow('對話自動念出來', 'vauto', [{ value: true, label: '自動' }, { value: false, label: '按 🔊 才念' }], st.settings.voiceAuto !== false, function (v) { st.settings.voiceAuto = v; apply(); }));
        // v0.9.3（老闆 2026-10-10）：音量「小／中／大」預設「中」（語音的「中」比以前大）；語速預設「稍快」
        body.appendChild(radioRow('語音音量', 'vvol', VOL_OPTIONS, st.settings.voiceVol || 'mid', function (v) { st.settings.voiceVol = v; apply(); }));
        body.appendChild(radioRow('語速', 'vrate', J.State.AUDIO.SPEEDS, J.State.AUDIO.nearestSpeed(J.State.AUDIO.voiceSpeed(st.settings)),
          function (v) { st.settings.voiceSpeed = v; st.settings.voiceRate = v; apply(); }));
        body.appendChild(voicePicker(G, apply));
        body.appendChild(radioRow('台語台詞', 'vlang', [{ value: 'taigi', label: '台語語音（電腦合成）' }, { value: 'huayu', label: '華語（提示音＋念華語翻譯）' }],
          st.settings.voiceLang || 'taigi', function (v) { st.settings.voiceLang = v; apply(); }));
        body.appendChild(radioRow('允許使用雲端高品質語音（不會傳送名字）', 'vcloud', [{ value: true, label: '允許' }, { value: false, label: '只用本機語音' }],
          st.settings.voiceCloud !== false, function (v) { st.settings.voiceCloud = v; apply(); }));
        body.appendChild(h('p.small', { text: '朗讀是裝置內建的電腦合成語音（不是真人錄音）。選「華語」時，台語台詞會先響一聲提示音，再念華語翻譯；對話框照常顯示台語漢字和台羅。' }));
        body.appendChild(h('p.small.voice-credit', { text: '台語語音：以 Meta MMS-TTS 閩南語模型（facebook/mms-tts-nan，CC BY-NC 4.0）依教育部台羅合成，非真人錄音' }));
        body.appendChild(h('details.voice-tips', {}, [h('summary', { text: '🎧 讓聲音更自然' }),
          h('ul', {}, [
            h('li', { text: 'iPad：設定 → 輔助使用 → 朗讀與說話（舊版叫「朗讀內容」）→ 聲音 → 中文（台灣）→ 下載標示「增強版」的聲音（請用 Wi-Fi，約 100 MB 以上）。下載後重新打開遊戲就會自動使用。' }),
            h('li', { text: '電腦：建議用 Microsoft Edge 瀏覽器，會自動使用比較自然的「Natural」語音（需要連網，玩家名字會換成「勇者」再念）。' }),
            h('li', { text: '說明來源：Apple 支援 https://support.apple.com/en-us/111798' })])]));
      }
      body.appendChild(radioRow('音效', 'sound', [{ value: true, label: '開' }, { value: false, label: '關' }], st.settings.sound, function (v) { st.settings.sound = v; G.save(); G.applySettings(); }));
      body.appendChild(radioRow('音樂', 'music', [{ value: true, label: '開' }, { value: false, label: '關' }], st.settings.music !== false, function (v) { st.settings.music = v; G.save(); G.applySettings(); }));
      if (st.settings.music !== false) {
        // v0.9.3：「中」比以前小，避免音樂蓋過語音
        body.appendChild(radioRow('音樂音量', 'mvol', VOL_OPTIONS, st.settings.musicVol || 'mid', function (v) { st.settings.musicVol = v; G.save(); G.applySettings(); }));
      }
      body.appendChild(radioRow('螢幕搖桿與 A／B 鍵', 'touch', [{ value: 'auto', label: '自動（觸控裝置才顯示）' }, { value: 'on', label: '一直顯示' }, { value: 'off', label: '不顯示' }],
        st.settings.touchControls || 'auto', function (v) { st.settings.touchControls = v; G.save(); G.applySettings(); }));
      body.appendChild(radioRow('台語對話的小字', 'taigi', [{ value: 'both', label: '台羅＋華語' }, { value: 'huayu', label: '只有華語翻譯' }, { value: 'tailo', label: '只有台羅' }, { value: 'none', label: '不顯示' }],
        st.settings.taigiSub || 'both', function (v) { st.settings.taigiSub = v; G.save(); }));

      // 報表
      var r = J.Report.build(st, Date.now());
      body.appendChild(h('h3', { text: '📊 家長報表' }));
      var t = h('table.report');
      t.appendChild(h('tr', {}, [h('th', { text: '科目' }), h('th', { text: '完成題數' }), h('th', { text: '一次就答對的比例' })]));
      r.subjects.forEach(function (s) {
        t.appendChild(h('tr', {}, [h('td', { text: s.subject }), h('td', { text: String(s.done) }), h('td', { text: s.rate === null ? '—' : Math.round(s.rate * 100) + '%' })]));
      });
      body.appendChild(t);
      body.appendChild(h('p', { text: '需要加強的單元：' + (r.weakUnits.length ? r.weakUnits.map(function (u) { return u.subject + '「' + u.unit + '」（' + Math.round(u.rate * 100) + '%）'; }).join('、') : '資料還不夠') }));
      body.appendChild(h('p', { text: '今天玩了 ' + r.todayMin + ' 分鐘・累計 ' + r.totalMin + ' 分鐘・冒險 ' + r.adventureDays + ' 天' }));

      // 存檔
      body.appendChild(h('h3', { text: '💾 存檔' }));
      body.appendChild(h('p.small', { text: '目前存在：' + G.provider.label + '。存檔只放在這台裝置，不會上傳。換裝置時可以用「存檔碼」搬家。' }));
      var codeBox = h('textarea', { readonly: true, 'aria-label': '存檔碼' });
      var importBox = h('textarea', { 'aria-label': '貼上存檔碼', placeholder: '把存檔碼貼在這裡' });
      body.appendChild(h('div.row', {}, [
        h('button', { onclick: function () { codeBox.value = G.provider.exportCode(st); codeBox.hidden = false; codeBox.select(); } }, ['產生存檔碼']),
        h('button', { onclick: function () { codeBox.select(); try { navigator.clipboard.writeText(codeBox.value); J.UI.toast('已複製'); } catch (e) { J.UI.toast('請手動複製'); } } }, ['複製'])
      ]));
      codeBox.hidden = true;
      body.appendChild(codeBox);
      // QR Code：掃描後用遊戲網址＋#load=存檔碼開啟，新裝置確認後就能接著玩
      var qrBox = h('div.qr-box', { hidden: true, 'aria-live': 'polite' });
      body.appendChild(h('div.row', {}, [h('button', { onclick: function () {
        qrBox.hidden = false; qrBox.innerHTML = '';
        qrBox.appendChild(h('p.small', { text: '產生中……' }));
        J.SaveCode.exportSlim(st).then(function (code) {
          var url = J.SaveCode.loadUrl(location.href, code);
          var r = J.QR.render(url, { size: 360 });
          qrBox.innerHTML = '';
          qrBox.dataset.url = url;
          if (!r.ok) { qrBox.appendChild(h('p', { role: 'alert', text: r.error })); return; }
          qrBox.appendChild(r.canvas);
          qrBox.appendChild(h('p.small', { text: '用另一台平板的相機掃描，會打開遊戲並詢問要不要讀取這個存檔。存檔資料只放在網址 # 後面，不會傳到網站伺服器。' }));
          if (location.protocol === 'file:') qrBox.appendChild(h('p.small', { text: '（現在是從本機檔案開啟的，掃描後的網址在別台裝置打不開；放上網站後再產生 QR Code。）' }));
        });
      } }, ['產生存檔 QR Code'])]));
      body.appendChild(qrBox);
      body.appendChild(importBox);
      body.appendChild(h('div.row', {}, [h('button', { onclick: function () { G.importCode(importBox.value); } }, ['用存檔碼覆蓋目前進度'])]));
      body.appendChild(h('div.row', {}, [h('button', { onclick: function () {
        J.UI.confirm('確定要刪除這台裝置上的存檔嗎？刪除後無法復原（建議先產生存檔碼）。', '刪除', '取消').then(function (y) { if (y) G.deleteSave(); });
      } }, ['刪除存檔'])]));
      body.appendChild(h('p.small', { text: '雲端存檔：目前不提供（Google 登入不適用以兒童為對象的應用程式）。請用「存檔碼」備份或換裝置。' }));
      body.appendChild(h('p.small', { text: 'iPad 請用 Safari「分享→加入主畫面」後，從主畫面圖示開啟，存檔比較不會被清除；也請定期用存檔碼／QR Code 備份。' }));

      // v0.7.2 使用者回饋（在家長確認之後才看得到）
      body.appendChild(h('h3', { text: '✉️ 使用者回饋' }));
      body.appendChild(h('p.small', { text: '請家長協助填寫：遊戲有問題、題目有錯或有建議，都歡迎告訴作者。' }));
      body.appendChild(h('div.row', {}, [h('button', { onclick: function () { feedback(G); } }, ['填寫回饋'])]));

      // v0.7.2 關於本遊戲
      body.appendChild(h('h3', { text: 'ℹ️ 關於本遊戲' }));
      body.appendChild(h('p.small', { text: J.CONFIG.GAME_TITLE + '　版本：' + (window.JQ_VERSION || '開發版') }));
      body.appendChild(h('p.small.author-line', {}, ['聯絡作者：', h('a.author-mail', { href: 'mailto:' + J.Feedback.EMAIL, text: J.Feedback.EMAIL })]));
    }
    render();
  }

  /** 回饋內容附上的資訊：只有版本號、地圖 ID、等級、userAgent、螢幕尺寸、語音設定（不含名字、存檔碼） */
  function deviceInfo(G) {
    var st = G.state || { settings: {}, player: {} }, s = st.settings || {};
    var voice = (s.tts === false ? '朗讀關' : '朗讀開') + '・' + (s.voiceAuto === false ? '按鍵才念' : '自動念') + '・台語台詞：' + (s.voiceLang === 'huayu' ? '華語' : '台語語音') +
      '・雲端語音：' + (s.voiceCloud === false ? '不允許' : '允許') + '・語速 ' + J.State.AUDIO.voiceSpeed(s) +
      '・語音 ' + (s.voiceName || '自動') + '・音量 語音' + ({ small: '小', mid: '中', large: '大' }[s.voiceVol] || '中') + '／音樂' + ({ small: '小', mid: '中', large: '大' }[s.musicVol] || '中');
    return {
      version: window.JQ_VERSION || '開發版',
      map: G.mapScene ? G.mapScene.mapId : (st.location && st.location.map) || '',
      level: st.player && typeof st.player.level === 'number' ? st.player.level : '',
      userAgent: navigator.userAgent || '',
      screen: (screen && screen.width ? screen.width + '×' + screen.height : '') + '（視窗 ' + window.innerWidth + '×' + window.innerHeight + '）',
      voice: voice
    };
  }

  /** 使用者回饋視窗：類別、文字、附上資訊 → 「用 Email 寄出」（mailto）／「複製內容」 */
  function feedback(G) {
    var st = G.state || {}, cat = '遊戲有問題';
    var text = h('textarea.fb-text', { maxlength: String(J.Feedback.MAX_TEXT), rows: '5', 'aria-label': '回饋內容', placeholder: '請描述發生了什麼事、在哪裡、怎麼重現（最多 ' + J.Feedback.MAX_TEXT + ' 字）' });
    var count = h('span.small.fb-count', { text: '0／' + J.Feedback.MAX_TEXT });
    var info = h('input', { type: 'checkbox', id: 'fb-info', checked: true });
    var mail = h('a.btn.fb-mail', { href: '#', role: 'button' }, ['用 Email 寄出']);
    var preview = h('pre.fb-preview', { 'aria-label': '將寄出的內容' });
    var copyBox = h('textarea.fb-copy', { readonly: true, hidden: true, 'aria-label': '回饋內容（請複製）' });
    var cats = h('div.row', { role: 'radiogroup', 'aria-label': '回饋類別' });
    var result = null;
    function build() {
      result = J.Feedback.build({ category: cat, text: text.value, includeInfo: info.checked, info: deviceInfo(G),
        recentQuestionIds: (st.recentQ || []).slice(), playerName: st.player && st.player.name });
      mail.setAttribute('href', result.url);
      preview.textContent = J.Feedback.plainText(result);
      count.textContent = text.value.length + '／' + J.Feedback.MAX_TEXT + (result.truncated ? '（太長，寄出時會截斷）' : '');
    }
    function renderCats() {
      cats.innerHTML = '';
      J.Feedback.CATEGORIES.forEach(function (c) {
        cats.appendChild(h('button', { role: 'radio', 'aria-checked': String(c === cat), 'aria-pressed': String(c === cat), onclick: function () { cat = c; renderCats(); build(); } }, [c]));
      });
    }
    text.addEventListener('input', build);
    info.addEventListener('change', build);
    var copyBtn = h('button', { onclick: function () {
      build();
      var plain = J.Feedback.plainText(result);
      var done = function () { J.UI.toast('已複製，請貼到 Email 寄給 ' + J.Feedback.EMAIL, 5000); };
      var fallback = function () { copyBox.hidden = false; copyBox.value = plain; copyBox.focus(); copyBox.select(); J.UI.toast('請按「拷貝」或 Ctrl＋C 複製選取的文字，再貼到 Email 寄給 ' + J.Feedback.EMAIL, 6000); };
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(plain).then(done, fallback);
        else fallback();
      } catch (e) { fallback(); }
    } }, ['複製內容']);
    var handle;
    var panel = h('div.win.panel.feedback-panel', {}, [
      h('button.close.ghost', { onclick: function () { handle.close(); }, 'aria-label': '關閉' }, ['✕ 關閉']),
      h('h2', { text: '✉️ 使用者回饋' }),
      h('p.small', { text: '請家長協助填寫。內容會用這台裝置的郵件 App 寄給作者（' + J.Feedback.EMAIL + '）；遊戲本身不會傳送任何資料。' }),
      h('h3', { text: '類別' }), cats,
      h('h3', { text: '內容' }), text, count,
      h('div.row.fb-check', {}, [info, h('label', { for: 'fb-info', text: '附上遊戲版本與裝置資訊（版本、地圖、等級、瀏覽器、螢幕尺寸、語音設定；不含名字和存檔）' })]),
      h('div.row', {}, [mail, copyBtn]),
      copyBox,
      h('details', {}, [h('summary', { text: '看看將寄出的內容' }), preview])
    ]);
    renderCats();
    build();
    handle = J.UI.open(panel, { label: '使用者回饋' });
    setTimeout(function () { text.focus(); }, 50);
    return handle;
  }

  /** 連續玩 20 分鐘的休息提醒 */
  function restReminder() {
    return new Promise(function (resolve) {
      var handle;
      var btn = h('button.primary', { onclick: function () { handle.close(); } }, ['我休息好了']);
      var panel = h('div.win.panel.narrow', {}, [h('h2', { text: '🌿 休息一下' }), h('p', { text: '已經連續冒險 20 分鐘了！' }),
        h('p', { text: '看看窗外遠方 20 秒，再喝一口水吧。番薯仔也要喝水！' }), h('div.row.end', {}, [btn])]);
      handle = J.UI.open(panel, { label: '休息提醒', onClose: resolve, focus: btn });
    });
  }

  /** 今天的遊玩時間到了 */
  function limitScreen(G) {
    // 資安審查 F-02：不再 closeAll()——靜默關掉戰鬥／對話／題目視窗會讓 Promise 永遠不結束（G.busy 卡住）。
    // 改成蓋在最上層的遮罩視窗；家長調高上限後關掉，就回到原本的畫面繼續。
    var handle;
    var panel = h('div.win.panel.narrow', {}, [h('h2', { text: '🌙 今天冒險到這裡' }),
      h('p', { text: '今天的冒險時間到囉！進度已經存好了。' }), h('p', { text: '番薯仔說：「明天見！我們再一起去找光。」' }),
      h('p.small', { text: '（家長可以在設定裡調整每日上限；調高後關掉設定就能繼續。）' }),
      h('div.row.end', {}, [h('button', { onclick: function () { open(G); } }, ['家長設定'])])]);
    handle = J.UI.open(panel, { label: '今天冒險到這裡', escClose: false });
    G.limitHandle = handle;
  }

  window.JQ = window.JQ || {};
  window.JQ.Settings = { feedback: feedback, deviceInfo: deviceInfo, gate: gate, open: open, restReminder: restReminder, limitScreen: limitScreen };
})();
