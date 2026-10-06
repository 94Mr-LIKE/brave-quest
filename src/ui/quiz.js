/*
 * 題目視窗（委託、寶箱、戰鬥共用）
 *  - 四種題型：choice 單選、multi 多選（點物品卡再按完成）、number 數字鍵盤、order 依序點選
 *  - 🔊 朗讀（朗讀時時間條暫停）
 *  - 提示階梯：①小提示 ②課本哪裡找（免費）③④引導問題（引導卡或 15 金幣）；選擇題可用刪去卡
 *  - mode 'help' / 'chest'：答錯可以再試；'battle'：一次機會＋時間條，答錯或超時換怪物攻擊
 */
(function () {
  'use strict';
  var J = window.JQ;
  var h, esc;

  var TYPE_TIP = { choice: '選一個答案，再按「確定」。', multi: '答案可能不只一個：選好全部，再按「完成」。', number: '用數字鍵盤輸入答案，再按「確定」。', order: '依照正確的順序一個一個點，再按「完成」。' };

  function stars(level) { var s = ''; for (var i = 1; i <= 4; i++) s += i <= level ? '★' : '☆'; return s; }

  /**
   * o = { session, mode, title, subtitle, timerMs, state, onDone(result), onRewards(res) }
   * 題目要先用 Session.next 準備好（session.q）
   */
  function ask(o) {
    h = J.UI.h; esc = J.UI.esc;
    var sess = o.session, q = sess.q, st = o.state;
    var battle = o.mode === 'battle';
    var answer = { choice: null, multi: [], number: '', order: [] };
    var finished = false, locked = false;
    var timer = J.Battle.createTimer(battle ? (o.timerMs || 0) : 0);
    var rafId = 0, lastT = 0;
    sess.shownAt = Date.now();

    // ---------- 版面
    var head = h('div.quiz-head', {}, [
      h('span.chip', { text: q.subject }),
      h('span.stars', { 'aria-label': '難度 ' + q.level + ' 顆星', text: stars(q.level) }),
      h('strong', { text: o.title || '' }),
      o.subtitle ? h('span.small', { text: o.subtitle }) : null
    ]);
    var timerBar = null, timerFill = null, timerLabel = null;
    if (battle && timer.limit > 0) {
      timerFill = h('i');
      timerLabel = h('span.label');
      timerBar = h('div.timer.crit-zone', { role: 'progressbar', 'aria-label': '答題時間', 'aria-valuemin': '0', 'aria-valuemax': '100' }, [timerFill, timerLabel]);
    }
    var speakBtn = h('button', { onclick: speak, 'aria-label': '朗讀題目' }, ['🔊 朗讀']);
    var sceneEl = q.scene ? h('div.scene', { text: J.UI.fill(q.scene, st.player.name) }) : null;
    var stemEl = h('div.stem', { id: 'quiz-stem', text: J.UI.fill(q.stem, st.player.name) });
    var tipEl = h('p.small', { text: TYPE_TIP[q.type] || '' });
    var answerArea = h('div', { 'aria-labelledby': 'quiz-stem' });
    var hintBox = h('div.hintbox', { hidden: true, 'aria-live': 'polite' });
    var feedback = h('div.feedback', { role: 'status', 'aria-live': 'assertive' });
    var submitBtn = h('button.primary', { onclick: submit }, [q.type === 'multi' || q.type === 'order' ? '完成 ✓' : '確定 ✓']);
    var hintBtn = h('button', { onclick: hint }, ['需要幫忙']);
    var eraserBtn = q.type === 'choice' ? h('button', { onclick: eraser }) : null;
    var leaveBtn = !battle ? h('button.ghost', { onclick: leave }, ['先離開']) : null;
    var clearBtn = q.type === 'order' ? h('button', { onclick: function () { answer.order = []; buildAnswer(); } }, ['清除重來']) : null;
    var actions = h('div.row', {}, [hintBtn, eraserBtn, clearBtn, h('span.grow'), leaveBtn, submitBtn]);
    var payRow = h('div.row', { hidden: true });
    var footer = h('div.quiz-foot', {}, [feedback, actions]);
    var panel = h('div.win.quiz', {}, [head, timerBar, h('div.row', {}, [speakBtn, h('span.small.grow', { text: battle ? '答得越快傷害越高；在虛線前答對是會心一擊！' : '' })]),
      sceneEl, stemEl, tipEl, answerArea, hintBox, payRow, footer]);
    var handle = J.UI.open(panel, { label: '題目：' + q.stem, escClose: false });

    buildAnswer();
    refreshEraser();
    if (battle && timer.limit > 0) { lastT = performance.now(); rafId = requestAnimationFrame(loop); }
    else if (battle) { lastT = performance.now(); rafId = requestAnimationFrame(loop); }

    // ---------- 題型
    function buildAnswer() {
      answerArea.innerHTML = '';
      if (q.type === 'choice' || q.type === 'multi') {
        var box = h('div.options', { role: q.type === 'choice' ? 'radiogroup' : 'group', 'aria-label': '選項' });
        q.options.forEach(function (opt, i) {
          var erased = sess.erased.indexOf(i) >= 0;
          var b = h('button', {
            'aria-pressed': q.type === 'choice' ? String(answer.choice === i) : String(answer.multi.indexOf(i) >= 0),
            disabled: erased, class: erased ? 'erased' : null,
            onclick: function () { pick(i); }
          }, [(i + 1) + '. ' + opt]);
          if (erased) b.className = 'erased';
          box.appendChild(b);
        });
        answerArea.appendChild(box);
      } else if (q.type === 'number') {
        var disp = h('span.number-display', { 'aria-live': 'polite', 'aria-label': '你輸入的答案', text: answer.number || ' ' });
        var unit = q.unit_label ? h('span', { text: ' ' + q.unit_label, style: { fontSize: '26px' } }) : null;
        var pad = h('div.keypad', { role: 'group', 'aria-label': '數字鍵盤' });
        ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].forEach(function (d) { pad.appendChild(h('button', { onclick: function () { key(d); } }, [d])); });
        pad.appendChild(h('button', { onclick: function () { key('.'); }, 'aria-label': '小數點' }, ['.']));
        pad.appendChild(h('button', { onclick: function () { key('back'); }, 'aria-label': '刪掉一個字' }, ['⌫']));
        pad.appendChild(h('button', { onclick: function () { key('clear'); }, style: { gridColumn: 'span 2' } }, ['清除']));
        answerArea.appendChild(h('div.row', {}, [disp, unit]));
        answerArea.appendChild(pad);
      } else if (q.type === 'order') {
        var picked = h('div.order-picked', { 'aria-label': '你排的順序', 'aria-live': 'polite' });
        if (!answer.order.length) picked.appendChild(h('span.small', { text: '（依序點下面的卡片）', style: { background: 'none', color: '#d9e2ff' } }));
        answer.order.forEach(function (idx, n) { picked.appendChild(h('span', { text: (n + 1) + '. ' + q.options[idx] })); });
        var opts = h('div.options', { role: 'group', 'aria-label': '可以選的卡片' });
        q.options.forEach(function (opt, i) {
          var used = answer.order.indexOf(i) >= 0;
          opts.appendChild(h('button', { disabled: used, onclick: function () { answer.order.push(i); J.Audio.play('select'); buildAnswer(); } }, [opt]));
        });
        answerArea.appendChild(picked);
        answerArea.appendChild(opts);
      }
    }

    function pick(i) {
      J.Audio.play('select');
      if (q.type === 'choice') answer.choice = i;
      else {
        var k = answer.multi.indexOf(i);
        if (k >= 0) answer.multi.splice(k, 1); else answer.multi.push(i);
      }
      var btns = answerArea.querySelectorAll('.options button');
      Array.prototype.forEach.call(btns, function (b, n) {
        b.setAttribute('aria-pressed', String(q.type === 'choice' ? answer.choice === n : answer.multi.indexOf(n) >= 0));
      });
    }

    function key(k) {
      if (k === 'back') answer.number = answer.number.slice(0, -1);
      else if (k === 'clear') answer.number = '';
      else if (k === '.' && answer.number.indexOf('.') >= 0) return;
      else if (answer.number.length < 7) answer.number += k;
      J.Audio.play('select');
      var d = answerArea.querySelector('.number-display');
      if (d) d.textContent = answer.number || ' ';
    }

    function onKeyDown(e) {
      if (finished || locked) return;
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      if (q.type === 'number') {
        if (/^[0-9]$/.test(e.key)) { key(e.key); e.preventDefault(); }
        else if (e.key === '.') { key('.'); e.preventDefault(); }
        else if (e.key === 'Backspace') { key('back'); e.preventDefault(); }
      }
    }
    document.addEventListener('keydown', onKeyDown);

    function response() {
      if (q.type === 'choice') return answer.choice;
      if (q.type === 'multi') return answer.multi.slice();
      if (q.type === 'number') return answer.number;
      return answer.order.slice();
    }

    function ready() {
      if (q.type === 'choice') return answer.choice !== null;
      if (q.type === 'multi') return answer.multi.length > 0;
      if (q.type === 'number') return answer.number !== '' && answer.number !== '.';
      return answer.order.length === q.options.length;
    }

    // ---------- 時間條
    function loop(t) {
      if (finished) return;
      var dt = Math.min(250, t - lastT); lastT = t;
      var paused = J.TTS.isSpeaking() || locked || !!(J.Game && J.Game.limitHandle);   // 「今天冒險到這裡」蓋在上面時也暫停（F-02）
      timer.paused = paused;
      if (timer.limit > 0) {
        var exp = J.Battle.tick(timer, dt);
        var frac = J.Battle.remainingFrac(timer);
        timerFill.style.width = (frac * 100).toFixed(1) + '%';
        timerBar.classList.toggle('low', frac < 0.25);
        timerBar.setAttribute('aria-valuenow', String(Math.round(frac * 100)));
        timerLabel.textContent = (paused ? '⏸ ' : '') + Math.ceil((timer.limit - timer.elapsed) / 1000) + ' 秒';
        if (exp) { timeout(); return; }
      } else J.Battle.tickFree(timer, dt);
      rafId = requestAnimationFrame(loop);
    }

    // ---------- 動作
    function speak() {
      var parts = [q.scene || '', q.stem];
      if (q.options && q.type !== 'number') parts.push(q.options.map(function (op, i) { return '第' + (i + 1) + '個，' + op; }).join('。'));
      J.TTS.speak(J.UI.fill(parts.join('。'), st.player.name), q.tts_lang || 'zh-TW', null, function () { sess.shownAt = Date.now() - 3000; });
    }

    function lockFor(ms) {
      locked = true;
      setButtons(false);
      var until = Date.now() + ms;
      (function tick() {
        if (finished) return;
        var left = Math.ceil((until - Date.now()) / 1000);
        if (left <= 0) { locked = false; setButtons(true); feedback.textContent = '好，再試一次！'; feedback.className = 'feedback'; sess.shownAt = Date.now(); return; }
        feedback.textContent = J.Guard.MESSAGE + '（' + left + ' 秒）';
        feedback.className = 'feedback bad';
        setTimeout(tick, 250);
      })();
    }

    function setButtons(on) {
      Array.prototype.forEach.call(panel.querySelectorAll('button'), function (b) {
        if (b === speakBtn) return;
        if (on) { if (b.dataset.lockedOff) { b.disabled = false; delete b.dataset.lockedOff; } }
        else if (!b.disabled) { b.disabled = true; b.dataset.lockedOff = '1'; }
      });
      if (on) { buildAnswer(); refreshEraser(); }
    }

    function submit() {
      if (finished || locked) return;
      if (!ready()) { feedback.textContent = q.type === 'order' ? '還有卡片沒有排喔！' : '先選好或輸入答案喔！'; feedback.className = 'feedback'; return; }
      var res = J.Session.submit(sess, response(), Date.now());
      if (res.status === 'locked') { lockFor(res.remainingMs); return; }
      if (res.status === 'wrong') {
        J.Audio.play('wrong');
        if (battle) { end({ correct: false, res: res }, '沒打中……再加油！', 'bad'); return; }
        feedback.textContent = '再想想看！可以按「需要幫忙」。';
        feedback.className = 'feedback bad';
        answer = { choice: null, multi: [], number: '', order: [] };
        buildAnswer();
        if (res.locked) lockFor(res.lockMs);
        if (o.onSave) o.onSave();
        return;
      }
      J.Audio.play('correct');
      var r = res.reward;
      var lines = [];
      if (r.outcome === 'repeat') lines.push('這題以前答對過囉：金幣 +' + r.coins);
      else lines.push('經驗值 +' + r.exp + '　金幣 +' + r.coins);
      if (r.bonusPaid) lines.push('（變化題一次答對，補回 ' + r.bonusPaid + ' 經驗值！）');
      if (res.needVariant) lines.push('下一題是類似的題目，第一次就答對可以補回另一半獎勵！');
      if (res.dailyDone && res.dailyDone.length) res.dailyDone.forEach(function (t) { lines.push('每日小任務完成：「' + t.text + '」金幣 +' + t.reward); });
      end({ correct: true, res: res }, '答對了！' + (q.explanation ? ' ' + q.explanation : ''), 'good', lines);
    }

    function timeout() {
      if (finished) return;
      sess.guard.lockedUntil = 0;
      J.Session.submit(sess, null, Date.now()); // 超時記錄為答錯（不揭曉答案）
      J.Audio.play('wrong');
      end({ correct: false, timeout: true }, '時間到！', 'bad');
    }

    function end(result, msg, cls, extra) {
      finished = true;
      cancelAnimationFrame(rafId);
      J.TTS.stop();
      result.elapsedMs = timer.elapsed;
      result.limitMs = timer.limit;
      feedback.textContent = msg;
      feedback.className = 'feedback ' + cls;
      (extra || []).forEach(function (t) { feedback.appendChild(h('div.small', { text: t })); });
      actions.innerHTML = '';
      var cont = h('button.primary', { onclick: function () { close(); o.onDone(result); } }, ['繼續 ▶']);
      actions.appendChild(h('span.grow'));
      actions.appendChild(cont);
      Array.prototype.forEach.call(answerArea.querySelectorAll('button'), function (b) { b.disabled = true; });
      hintBtn.disabled = true;
      if (o.onSave) o.onSave();
      if (o.onRewards && result.correct) o.onRewards(result.res);
      setTimeout(function () { cont.focus(); }, 30);
    }

    function leave() {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(rafId);
      J.Session.abandon(sess);
      close();
      o.onDone({ correct: false, left: true });
    }

    function close() { document.removeEventListener('keydown', onKeyDown); J.TTS.stop(); handle.close(true); }

    function refreshEraser() {
      if (!eraserBtn) return;
      var n = st.inventory.eraser || 0;
      eraserBtn.textContent = '刪去卡（' + n + '）';
      eraserBtn.disabled = n < 1 || finished;
    }

    function eraser() {
      var r = J.Session.useEraser(sess);
      if (!r.ok) { J.UI.toast(r.reason === 'no-more' ? '不能再刪了，剩下的要自己想喔！' : '沒有刪去卡了，可以到商店買。'); return; }
      J.Audio.play('select');
      if (answer.choice === r.index) answer.choice = null;
      buildAnswer(); refreshEraser();
      showHint('刪去卡刪掉了一個錯的選項。');
      if (o.onSave) o.onSave();
    }

    function showHint(text) {
      hintBox.hidden = false;
      hintBox.appendChild(h('p', { text: '💡 ' + text }));
    }

    function hint() {
      var step = J.Hints.nextStep(sess.hintsOpened);
      if (!step) { J.UI.toast('提示都打開了，慢慢想一想！'); return; }
      if (!step.paid) { var r = J.Session.openHint(sess); if (r.ok) showHint(r.text); return; }
      // 付費層：有引導卡就問要不要用卡，沒有就問要不要用 15 金幣
      payRow.innerHTML = '';
      payRow.hidden = false;
      var cards = st.inventory.guide || 0;
      payRow.appendChild(h('span.small', { text: '第 ' + step.step + ' 層提示需要：' }));
      payRow.appendChild(h('button', { disabled: cards < 1, onclick: function () { pay('card'); } }, ['用引導卡（剩 ' + cards + ' 張）']));
      payRow.appendChild(h('button', { disabled: st.player.coins < J.Hints.HINT_COIN_COST, onclick: function () { pay('coins'); } }, ['用 ' + J.Hints.HINT_COIN_COST + ' 金幣']));
      payRow.appendChild(h('button.ghost', { onclick: function () { payRow.hidden = true; } }, ['先不要']));
    }

    function pay(method) {
      var r = J.Session.openHint(sess, method);
      payRow.hidden = true;
      if (!r.ok) { J.UI.toast(r.reason === 'no-card' ? '沒有引導卡了。' : '金幣不夠喔。'); return; }
      showHint(r.text);
      if (o.onRewards) o.onRewards(null);
      if (o.onSave) o.onSave();
    }

    return { close: close };
  }

  window.JQ = window.JQ || {};
  window.JQ.Quiz = { ask: ask };
})();
