/* 標題畫面：點一下開始（解鎖 iPad 音效）→ 繼續／新的冒險（名字＋男生/女生）／存檔碼
 * 不提供 Google 登入（Google 政策不允許以兒童為對象的應用程式使用 Google 登入）；存檔走 SaveProvider（本機＋存檔碼）。 */
(function () {
  'use strict';
  var J = window.JQ;
  function h() { return J.UI.h.apply(null, arguments); }

  /**
   * o = { summary: {name, level, job}|null, loadError: '', migrated: bool,
   *       onContinue(), onNew(name, gender), onImport(code) → Promise<string|''>（錯誤訊息） }
   */
  function show(o) {
    var screen = h('div.title-screen', { role: 'main' });
    var titleArt = J.Assets.art().ui.title ? J.Assets.resolveUrl(J.Assets.art().ui.title) : null;
    if (titleArt) { screen.style.backgroundImage = 'url("' + titleArt + '")'; screen.classList.add('has-art'); }
    var handle = J.UI.open(screen, { modal: false, label: '標題畫面', escClose: false });
    // v0.9.6 標題插畫變成會動的畫面（title_anim.js：WebGL；沒有 WebGL 或圖讀不到就維持原本的靜態背景圖）
    // 標題視窗關閉（進入遊戲、讀存檔碼）時停止並釋放 WebGL 資源
    var anim = !!(titleArt && J.TitleAnim && J.TitleAnim.start(screen, titleArt));
    var closeTitle = handle.close;
    handle.close = function () {
      if (anim) { anim = false; try { J.TitleAnim.stop(); } catch (e) { /* 停不下來也不影響進遊戲 */ } }
      return closeTitle.apply(handle, arguments);
    };
    /** 清掉標題畫面的內容（動畫畫布留著，放回最底層） */
    function clearScreen() {
      screen.innerHTML = '';
      if (anim) J.TitleAnim.attach(screen);
    }
    var heroes = h('div.title-heroes', { 'aria-hidden': 'true', html: J.Assets.domIcon(J.Assets.heroKey('f', 'novice'), { size: 96, label: '女' }) +
      J.Assets.domIcon('pet_imo', { size: 56, label: '番' }) + J.Assets.domIcon(J.Assets.heroKey('m', 'novice'), { size: 96, label: '男' }) });

    function frame(children) {
      clearScreen();
      screen.appendChild(h('h1', { text: J.CONFIG.GAME_TITLE }));
      screen.appendChild(h('div.sub', { text: '國小三年級・學習冒險' }));
      if (o.counterEl) screen.appendChild(o.counterEl);   // v1.0.1「已有 N 位冒險者加入」（game.js 讀到數字才顯示；在副標題下面的天空，不擋角色和按鈕）
      screen.appendChild(heroes);
      // v0.8 電腦版瀏覽器被縮放（同網域的其他網站縮小過）：提示一次 Ctrl＋0；關掉後這次開啟不再出現；平板不提示
      var z = J.Zoom ? J.Zoom.current() : { show: false };
      if (z.show && !window.__jqZoomHintClosed) {
        var hint = h('div.win.zoom-hint', { role: 'status' }, [h('span', { text: J.Zoom.MESSAGE }),
          h('button.ghost.zoom-close', { 'aria-label': '關閉縮放提示', onclick: function () { window.__jqZoomHintClosed = true; if (hint.parentNode) hint.parentNode.removeChild(hint); } }, ['✕'])]);
        hint.dataset.ratio = String(z.ratio);
        screen.appendChild(hint);
      }
      children.forEach(function (c) { if (c) screen.appendChild(c); });
      // v0.7.2 底部小字：聯絡作者（排在內容之後、推到最下面，不會蓋住按鈕）
      screen.appendChild(h('p.title-author', {}, ['聯絡作者：', h('a.author-mail', { href: 'mailto:' + J.Feedback.EMAIL, text: J.Feedback.EMAIL })]));
    }

    function tapScreen() {
      var tap = h('button.primary.tap', { onclick: function () {
        J.Audio.unlock(); J.TTS.warmUp(); J.Audio.play('select');
        // v0.9.5 片頭動畫：第一次（還沒看過）在選單之前播，配標題序曲；看過就直接進選單（家長設定可以重看）
        if (J.Opening && J.Opening.shouldPlay()) {
          var M = window.JQ.Music, music = false;
          try { music = !!(M && M.current && M.current().want === 'title'); } catch (e) { music = false; }   // 存檔裡關掉音樂時，標題曲本來就沒有播
          if (J.Opening.play({ music: music, onDone: function () { menu(); } })) return;
        }
        menu();
      } }, ['點一下', h('wbr'), '開始']);   // 窄的直式手機才在「點一下／開始」之間換行（style.css：word-break: keep-all）
      // v0.9.6 老闆：「開始」下移到主角腳邊（男生的右邊，不擋住兩位主角和番薯仔），說明文字跟著移；聯絡作者仍在最底下
      frame([h('div.title-start', {}, [tap, h('p.note', { text: '可以用滑鼠、觸控或鍵盤（方向鍵走路，兩鍵一起按就斜走；空白鍵或 Z 鍵對話）來玩。' })])]);
      setTimeout(function () { tap.focus(); }, 50);
    }

    /**
     * v1.0.6「存檔有限」提醒（systems/savetip.js）：選單出現時最多每 7 天顯示一次（bq_save_tip_at 記時間）。
     * 放在選單按鈕下面的小框（不蓋住「繼續冒險」「新的冒險」），按「知道了」收起來；這次開啟回到選單時照樣顯示，直到收起來。
     * 從主畫面圖示開啟（standalone／fullscreen）時只提醒備份存檔碼。
     */
    var saveTipText, saveTipClosed = false;
    function saveTipBox() {
      if (saveTipText === undefined) {
        saveTipText = null;
        try { saveTipText = J.SaveTip ? J.SaveTip.take(window.localStorage, Date.now(), window) : null; } catch (e) { saveTipText = null; }
      }
      if (!saveTipText || saveTipClosed) return null;
      var tip = h('div.win.save-tip', { role: 'note', 'aria-label': '存檔提醒' }, [
        h('span.save-tip-icon', { 'aria-hidden': 'true', text: '💾' }),
        h('span.save-tip-text', { text: saveTipText }),
        h('button.ghost.save-tip-close', { onclick: function () { saveTipClosed = true; if (tip.parentNode) tip.parentNode.removeChild(tip); } }, ['知道了'])]);
      return tip;
    }

    function menu(message) {
      var box = h('div.menu');
      if (o.summary) {
        box.appendChild(h('button.primary', { onclick: function () { handle.close(true); o.onContinue(); } },
          ['繼續冒險（' + o.summary.name + '・等級 ' + o.summary.level + '）']));
      }
      box.appendChild(h('button' + (o.summary ? '' : '.primary'), { onclick: newGame }, ['新的冒險']));
      box.appendChild(h('button', { onclick: importCode }, ['用存檔碼繼續']));
      var notes = [];
      // v1.0（夜班審查）：舊存檔升級失敗的說明本身就寫了該怎麼做，直接顯示
      if (o.loadError) notes.push(h('p.note.load-error', { role: 'alert', text: /原本的存檔還在/.test(o.loadError) ? o.loadError : '原本的存檔沒辦法讀取（' + o.loadError + '）。可以用存檔碼還原，或開始新的冒險。' }));
      if (o.migrated) notes.push(h('p.note', { text: '已經把舊版的等級、金幣和學習紀錄搬過來了！故事會重新開始。' }));
      if (message) notes.push(h('p.note', { role: 'alert', text: message }));
      var tip = saveTipBox();
      if (tip) notes.push(tip);
      else notes.push(h('p.note', { text: '存檔只放在這台裝置。要換裝置時，請家長在「設定」產生存檔碼。' }));
      frame([box].concat(notes));
      setTimeout(function () { var b = box.querySelector('button'); if (b) b.focus(); }, 50);
    }

    function newGame() {
      var gender = 'f';
      var nameInput = h('input', { type: 'text', id: 'hero-name', maxlength: '8', autocomplete: 'off', placeholder: '例如：小海星', 'aria-describedby': 'name-note' });
      var err = h('p.small', { role: 'alert' });
      var cards = h('div.choice-cards', { role: 'radiogroup', 'aria-label': '主角' });
      function renderCards() {
        cards.innerHTML = '';
        [['f', '女生'], ['m', '男生']].forEach(function (g) {
          cards.appendChild(h('button', { role: 'radio', 'aria-checked': String(gender === g[0]), 'aria-pressed': String(gender === g[0]), onclick: function () { gender = g[0]; renderCards(); } },
            [h('span', { html: J.Assets.domIcon(J.Assets.heroKey(g[0], 'novice'), { size: 72, label: g[1], alt: '' }) }), g[1]]));
        });
      }
      renderCards();
      var form = h('form.win.panel.narrow', { onsubmit: function (e) {
        e.preventDefault();
        var raw = nameInput.value;
        var clean = J.State.cleanName(raw);
        if (!raw.trim() || clean === '小冒險者' && raw.trim() !== '小冒險者') { err.textContent = '請取一個 1 到 8 個字的冒險者名字（不用填真名）。'; nameInput.focus(); return; }
        var go = function () { handle.close(true); o.onNew(clean, gender); };
        if (o.summary) J.UI.confirm('這台裝置已經有「' + o.summary.name + '」的存檔，開始新的冒險會蓋掉它。要繼續嗎？', '蓋掉，開始新的', '不要').then(function (y) { if (y) go(); });
        // v1.0（夜班審查）：讀不進來的存檔（例如舊存檔升級失敗）一樣要先確認，不能默默蓋掉
        else if (o.loadError) J.UI.confirm('這台裝置有一份現在讀不進來的存檔。開始新的冒險會蓋掉它（升級前的舊存檔另外有備份）。建議先請家長處理。還是要開始新的嗎？', '蓋掉，開始新的', '不要').then(function (y) { if (y) go(); });
        else go();
      } }, [
        h('h2', { text: '新的冒險' }),
        h('div.field', {}, [h('label', { for: 'hero-name', text: '冒險者名字' }), nameInput,
          h('p.small', { id: 'name-note', text: '不用填真名喔！取一個冒險者名字就好（1–8 個字，不能有空白或符號 < >）。' })]),
        h('h3', { text: '選擇主角' }), cards,
        h('p.small', { text: '只會改變主角的樣子，故事和能力都一樣。' }),
        err,
        h('div.row.end', {}, [h('button', { type: 'button', onclick: function () { menu(); } }, ['返回']), h('button.primary', { type: 'submit' }, ['出發！'])])
      ]);
      clearScreen();
      screen.appendChild(form);
      setTimeout(function () { nameInput.focus(); }, 50);
    }

    function importCode() {
      var box = h('textarea', { 'aria-label': '存檔碼', placeholder: '把存檔碼貼在這裡（JQ1- 開頭）' });
      var err = h('p.small', { role: 'alert' });
      var form = h('form.win.panel.narrow', { onsubmit: function (e) {
        e.preventDefault();
        Promise.resolve(o.onImport(box.value)).then(function (msg) {
          if (msg) { err.textContent = msg; return; }
          handle.close(true);
        });
      } }, [h('h2', { text: '用存檔碼繼續' }), h('p', { text: '貼上之前在「家長設定」產生的存檔碼。存檔碼錯了不會蓋掉原本的進度。' }), box, err,
        h('div.row.end', {}, [h('button', { type: 'button', onclick: function () { menu(); } }, ['返回']), h('button.primary', { type: 'submit' }, ['讀取'])])]);
      clearScreen();
      screen.appendChild(form);
      setTimeout(function () { box.focus(); }, 50);
    }

    tapScreen();
    return handle;
  }

  window.JQ = window.JQ || {};
  window.JQ.Title = { show: show };
})();
