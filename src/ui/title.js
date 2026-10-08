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
    var heroes = h('div.title-heroes', { 'aria-hidden': 'true', html: J.Assets.domIcon(J.Assets.heroKey('f', 'novice'), { size: 96, label: '女' }) +
      J.Assets.domIcon('pet_imo', { size: 56, label: '番' }) + J.Assets.domIcon(J.Assets.heroKey('m', 'novice'), { size: 96, label: '男' }) });

    function frame(children) {
      screen.innerHTML = '';
      screen.appendChild(h('h1', { text: J.CONFIG.GAME_TITLE }));
      screen.appendChild(h('div.sub', { text: '國小三年級・學習冒險' }));
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
        menu();
      } }, ['點一下開始']);
      frame([tap, h('p.note', { text: '可以用滑鼠、觸控或鍵盤（方向鍵走路、空白鍵或 Z 鍵對話）來玩。' })]);
      setTimeout(function () { tap.focus(); }, 50);
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
      if (o.loadError) notes.push(h('p.note', { role: 'alert', text: '原本的存檔沒辦法讀取（' + o.loadError + '）。可以用存檔碼還原，或開始新的冒險。' }));
      if (o.migrated) notes.push(h('p.note', { text: '已經把舊版的等級、金幣和學習紀錄搬過來了！故事會重新開始。' }));
      if (message) notes.push(h('p.note', { role: 'alert', text: message }));
      notes.push(h('p.note', { text: '存檔只放在這台裝置。要換裝置時，請家長在「設定」產生存檔碼。' }));
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
      screen.innerHTML = '';
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
      screen.innerHTML = '';
      screen.appendChild(form);
      setTimeout(function () { box.focus(); }, 50);
    }

    tapScreen();
    return handle;
  }

  window.JQ = window.JQ || {};
  window.JQ.Title = { show: show };
})();
