/* 家長設定（先過家長確認）、家長報表、存檔碼、休息提醒、今日上限畫面 */
(function () {
  'use strict';
  var J = window.JQ;
  function h() { return J.UI.h.apply(null, arguments); }
  var LIMIT_LABEL = { 0: '不限' };
  var TIME_LABEL = { relaxed: '寬鬆（時間 1.5 倍）', standard: '標準', off: '關閉（不計時）' };

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
        body.appendChild(radioRow('語音音量', 'vvol', [{ value: 0.4, label: '小' }, { value: 0.7, label: '中' }, { value: 0.9, label: '大' }],
          [0.4, 0.7, 0.9].reduce(function (a, b) { return Math.abs(b - st.settings.voiceVolume) < Math.abs(a - st.settings.voiceVolume) ? b : a; }), function (v) { st.settings.voiceVolume = v; apply(); }));
        body.appendChild(radioRow('語速', 'vrate', [{ value: 0.8, label: '慢' }, { value: 0.9, label: '稍慢' }, { value: 1, label: '標準' }, { value: 1.15, label: '稍快' }],
          st.settings.voiceRate || 1, function (v) { st.settings.voiceRate = v; apply(); }));
        body.appendChild(radioRow('台語台詞', 'vlang', [{ value: 'taigi', label: '台語語音（電腦合成）' }, { value: 'huayu', label: '華語（提示音＋念華語翻譯）' }],
          st.settings.voiceLang || 'taigi', function (v) { st.settings.voiceLang = v; apply(); }));
        body.appendChild(radioRow('允許使用雲端高品質語音（不會傳送名字）', 'vcloud', [{ value: true, label: '允許' }, { value: false, label: '只用本機語音' }],
          st.settings.voiceCloud !== false, function (v) { st.settings.voiceCloud = v; apply(); }));
        // 目前用的語音＋試聽
        var cur = J.Voice.currentVoice('narrator');
        var curText = cur ? '目前的語音：' + cur.name + (cur.cloud ? '（雲端）' : '（本機）') + (cur.quality ? '・高品質' : '') : '目前的語音：這台裝置沒有中文語音（會用瀏覽器預設的聲音）';
        body.appendChild(h('div.row.voice-now', {}, [h('span', { text: curText }),
          h('button', { onclick: function () { J.Voice.sayLine({ line: { who: 'narrator', text: '你好！我是勇者大冒險的說書人，歡迎來到金包里。' }, who: 'narrator' }); }, 'aria-label': '試聽目前的語音' }, ['🔊 試聽'])]));
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
        body.appendChild(radioRow('音樂音量', 'mvol', [{ value: 0.3, label: '小' }, { value: 0.55, label: '中' }, { value: 0.8, label: '大' }],
          [0.3, 0.55, 0.8].reduce(function (a, b) { return Math.abs(b - st.settings.musicVolume) < Math.abs(a - st.settings.musicVolume) ? b : a; }), function (v) { st.settings.musicVolume = v; G.save(); G.applySettings(); }));
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
        J.SaveCode.exportCompact(st).then(function (code) {
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
    }
    render();
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
  window.JQ.Settings = { gate: gate, open: open, restReminder: restReminder, limitScreen: limitScreen };
})();
