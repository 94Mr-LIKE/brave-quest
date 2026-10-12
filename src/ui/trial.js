/*
 * v1.0 第一批（48 號 v2 第 4 節、F7）：立志小考的畫面
 *
 * - 20 題（JQ.JobTrial.pick），每題時間＝標準 × 75%，和家長的「答題時間」設定無關。
 * - 語音讀題一律開啟（家長關掉語音也照念），念題目、英語朗讀時倒數停住；裝置沒有語音時，題目顯示 3 秒後才開始倒數，
 *   並提示「這台裝置沒有語音，請家長幫忙念題目」（CTO Q4）。
 * - 不能用提示、刪去卡、引導卡；倒數不用紅字；答錯說「沒關係，記下來就好」；每 5 題番薯仔打氣；每考完一科亮一盞小燈。
 * - 考試中不會被每日上限打斷（G.inTrial）；開始時先存 inProgress（中途關掉算考過一次）。
 * - 小考答對的題目不算進「答對過」（不經過 Session，不給經驗值、金幣）。
 * JQ.TrialUI.run(G, jobId, place) → Promise<結果 | null（題目不夠）>
 */
(function () {
  'use strict';
  var J = window.JQ;
  var NO_VOICE_WAIT = 3000;
  var NO_VOICE_TEXT = '這台裝置沒有語音，請家長幫忙念題目';

  function h() { return J.UI.h.apply(null, arguments); }

  /** 選擇題、多選題打亂選項（答案跟著換） */
  function shuffled(q, rng) {
    if (q.type !== 'choice' && q.type !== 'multi') return q;
    var idx = q.options.map(function (_, i) { return i; });
    for (var i = idx.length - 1; i > 0; i--) { var j = Math.floor(rng() * (i + 1)); var t = idx[i]; idx[i] = idx[j]; idx[j] = t; }
    var c = Object.assign({}, q);
    c.options = idx.map(function (k) { return q.options[k]; });
    var map = function (a) { return idx.indexOf(a); };
    c.answer = Array.isArray(q.answer) ? q.answer.map(map) : map(q.answer);
    return c;
  }

  function petLine(G, id, fallback, k) {
    var d = G.data.dialogs && G.data.dialogs[id];
    var lines = (d && (d.lines || d)) || [];
    var l = Array.isArray(lines) ? lines[k === undefined ? 0 : Math.min(k, lines.length - 1)] : null;
    return (l && l.text) || fallback;
  }

  function run(G, jobId, place) {
    var st = G.state, D = G.data, JT = J.JobTrial, now = Date.now();
    var rec = (st.trial && st.trial[jobId]) || {};
    var qs = JT.pick(st, G.questions, D, { lastQ: rec.lastQ || [], exclude: function (q) { return J.Chests && J.Chests.isChestQuestion(q); } });
    if (qs.length < JT.total(JT.rules(D))) return Promise.resolve(null);
    var rng = Math.random;
    qs = qs.map(function (q) { return shuffled(q, rng); });
    JT.begin(st, jobId, qs.map(function (q) { return q.id; }), now);
    G.save();
    G.inTrial = { job: jobId, place: place, n: 0 };
    var ttsWasOn = st.settings.tts !== false;
    if (!ttsWasOn && J.TTS.setEnabled) J.TTS.setEnabled(true);   // 強制語音讀題
    var voiceOk = !!(J.TTS.available && J.TTS.available());
    var job = D.jobs[jobId];
    var answers = [];
    var R = JT.rules(D), per = JT.total(R) / JT.SUBJECTS.length;

    return new Promise(function (resolve) {
      var lamps = h('div.trial-lamps', { 'aria-label': '每科的小燈' }, JT.SUBJECTS.map(function (s) { return h('span.lamp', { 'data-subject': s, text: '○ ' + s }); }));
      var title = h('strong');
      var timerFill = h('i'), timerLabel = h('span.label');
      var timerBar = h('div.timer.trial-timer', { role: 'progressbar', 'aria-label': '答題時間' }, [timerFill, timerLabel]);
      var noVoice = h('p.small.trial-novoice', { hidden: voiceOk, text: '🔇 ' + NO_VOICE_TEXT });
      var stage = h('div.trial-q');
      var feedback = h('div.feedback', { role: 'status', 'aria-live': 'assertive' });
      var actions = h('div.row');
      var panel = h('div.win.quiz.trial', {}, [h('div.quiz-head', {}, [h('span.chip', { text: '立志小考' }), title]), lamps, timerBar, noVoice, stage, feedback, actions]);
      var handle = J.UI.open(panel, { label: '立志小考：' + job.name, escClose: false });
      var i = 0;
      next();

      function next() {
        if (i >= qs.length) { done(); return; }
        ask(qs[i]);
      }

      function ask(q) {
        var answer = { choice: null, multi: [], number: '', order: [] };
        var finished = false, startAt = 0, elapsed = 0, lastT = 0, rafId = 0;
        var limit = JT.timeLimitMs(q.level, D);
        G.inTrial.n = i;
        G.inTrial.q = { id: q.id, level: q.level, limit: limit };
        G.inTrial.cur = q;   // 測試用（debug.currentQuestion）
        title.textContent = job.name + '　第 ' + (i + 1) + '／' + qs.length + ' 題　' + q.subject + ' ' + '★★★★'.slice(0, q.level);
        stage.innerHTML = ''; feedback.textContent = ''; feedback.className = 'feedback'; actions.innerHTML = '';
        if (q.scene) stage.appendChild(h('div.scene', { text: J.UI.fill(q.scene, st.player.name) }));
        stage.appendChild(h('div.stem', { id: 'trial-stem', text: J.UI.fill(q.stem, st.player.name) }));
        var area = h('div', { 'aria-labelledby': 'trial-stem' });
        stage.appendChild(area);
        build();
        var submitBtn = h('button.primary', { onclick: submit }, [q.type === 'multi' || q.type === 'order' ? '完成 ✓' : '確定 ✓']);
        var speakBtn = h('button', { onclick: speak, 'aria-label': '再念一次' }, ['🔊 再念一次']);
        actions.appendChild(speakBtn);
        if (q.type === 'order') actions.appendChild(h('button', { onclick: function () { answer.order = []; build(); } }, ['清除重來']));
        actions.appendChild(h('span.grow'));
        actions.appendChild(submitBtn);
        // 語音讀題：念完才開始倒數；沒有語音時，題目顯示 3 秒後開始
        if (voiceOk) speak(); else startAt = Date.now() + NO_VOICE_WAIT;
        lastT = performance.now();
        rafId = requestAnimationFrame(loop);

        function speak() {
          if (!voiceOk) return;
          var parts = [q.scene || '', q.stem];
          if (q.options && q.type !== 'number') parts.push(q.options.map(function (op, k) { return '第' + (k + 1) + '個，' + op; }).join('。'));
          J.TTS.speak(J.UI.fill(parts.join('。'), st.player.name), q.tts_lang || 'zh-TW', null, null);
        }
        function paused() { return J.TTS.isSpeaking() || Date.now() < startAt; }
        function loop(t) {
          if (finished) return;
          var dt = Math.min(250, t - lastT); lastT = t;
          var p = paused();
          if (!p) elapsed = Math.min(limit, elapsed + dt);
          G.inTrial.elapsed = elapsed; G.inTrial.paused = p;
          var frac = Math.max(0, 1 - elapsed / limit);
          timerFill.style.width = (frac * 100).toFixed(1) + '%';
          timerBar.setAttribute('aria-valuenow', String(Math.round(frac * 100)));
          timerLabel.textContent = (p ? (voiceOk ? '🔊 念題目中' : '⏸ 準備') + '　' : '') + Math.ceil((limit - elapsed) / 1000) + ' 秒';
          if (elapsed >= limit) { end(false, true); return; }
          rafId = requestAnimationFrame(loop);
        }
        function build() {
          area.innerHTML = '';
          if (q.type === 'choice' || q.type === 'multi') {
            var box = h('div.options', { role: q.type === 'choice' ? 'radiogroup' : 'group', 'aria-label': '選項' });
            q.options.forEach(function (opt, k) {
              var on = q.type === 'choice' ? answer.choice === k : answer.multi.indexOf(k) >= 0;
              box.appendChild(h('button', { 'aria-pressed': String(on), onclick: function () { pick(k); } }, [(k + 1) + '. ' + opt]));
            });
            area.appendChild(box);
          } else if (q.type === 'number') {
            var disp = h('span.number-display', { 'aria-live': 'polite', text: answer.number || ' ' });
            var pad = h('div.keypad', { role: 'group', 'aria-label': '數字鍵盤' });
            ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.'].forEach(function (d) { pad.appendChild(h('button', { onclick: function () { key(d); } }, [d])); });
            pad.appendChild(h('button', { onclick: function () { key('back'); }, 'aria-label': '刪掉一個字' }, ['⌫']));
            pad.appendChild(h('button', { onclick: function () { key('clear'); }, style: { gridColumn: 'span 2' } }, ['清除']));
            area.appendChild(h('div.row', {}, [disp, q.unit_label ? h('span', { text: ' ' + q.unit_label, style: { fontSize: '26px' } }) : null]));
            area.appendChild(pad);
          } else {
            var picked = h('div.order-picked', { 'aria-live': 'polite' });
            answer.order.forEach(function (k, n) { picked.appendChild(h('span', { text: (n + 1) + '. ' + q.options[k] })); });
            var opts = h('div.options', { role: 'group' });
            q.options.forEach(function (opt, k) { opts.appendChild(h('button', { disabled: answer.order.indexOf(k) >= 0, onclick: function () { answer.order.push(k); build(); } }, [opt])); });
            area.appendChild(picked); area.appendChild(opts);
          }
        }
        function pick(k) {
          J.Audio.play('select');
          if (q.type === 'choice') answer.choice = k;
          else { var x = answer.multi.indexOf(k); if (x >= 0) answer.multi.splice(x, 1); else answer.multi.push(k); }
          build();
        }
        function key(k) {
          if (k === 'back') answer.number = answer.number.slice(0, -1);
          else if (k === 'clear') answer.number = '';
          else if (k === '.' && answer.number.indexOf('.') >= 0) return;
          else if (answer.number.length < 7) answer.number += k;
          build();
        }
        function response() { return q.type === 'choice' ? answer.choice : q.type === 'multi' ? answer.multi.slice() : q.type === 'number' ? answer.number : answer.order.slice(); }
        function ready() {
          if (q.type === 'choice') return answer.choice !== null;
          if (q.type === 'multi') return answer.multi.length > 0;
          if (q.type === 'number') return answer.number !== '' && answer.number !== '.';
          return answer.order.length === q.options.length;
        }
        function submit() {
          if (finished) return;
          if (!ready()) { feedback.textContent = '先選好或輸入答案喔！'; return; }
          end(J.Answer.checkAnswer(q, response()), false);
        }
        function end(ok, timeout) {
          finished = true;
          cancelAnimationFrame(rafId);
          J.TTS.stop();
          answers.push({ id: q.id, subject: q.subject, unit: q.unit || '', correct: !!ok, timeout: !!timeout });
          J.Audio.play(ok ? 'correct' : 'wrong');
          feedback.className = 'feedback ' + (ok ? 'good' : 'soft');
          feedback.textContent = ok ? '答對了！' : (timeout ? '時間到了。' : '') + petLine(G, 'D_TRIAL_WRONG', '沒關係，記下來就好！');
          Array.prototype.forEach.call(area.querySelectorAll('button'), function (b) { b.disabled = true; });
          i++;
          if (i % per === 0) {   // 考完一科亮一盞小燈
            var lamp = lamps.querySelector('.lamp[data-subject="' + q.subject + '"]');
            if (lamp) { lamp.classList.add('on'); lamp.textContent = '● ' + q.subject; }
          }
          actions.innerHTML = '';
          actions.appendChild(h('span.grow'));
          var cont = h('button.primary', { onclick: function () {
            cont.disabled = true;
            if (JT.cheerAfter(i, D)) {   // 每 5 題番薯仔打氣（D_TRIAL_CHEER 依序 3 句）
              G.say(null, [{ who: 'pet', text: petLine(G, 'D_TRIAL_CHEER', '加油！已經寫完 ' + i + ' 題了！', i / R.cheer_every - 1) }]).then(next);
            } else next();
          } }, [i >= qs.length ? '看結果 ▶' : '下一題 ▶']);
          actions.appendChild(cont);
          setTimeout(function () { cont.focus(); }, 30);
          G.save();
        }
      }

      function done() {
        var res = JT.finish(st, jobId, answers, Date.now(), D);
        G.inTrial = null;
        if (!ttsWasOn && J.TTS.setEnabled) J.TTS.setEnabled(false);
        G.save();
        stage.innerHTML = ''; actions.innerHTML = ''; feedback.textContent = '';
        timerBar.hidden = true; noVoice.hidden = true;   // 結果畫面不顯示倒數
        title.textContent = job.name + '　結果';
        stage.appendChild(h('p.trial-score', { text: '答對 ' + res.correct + ' 題／' + res.total + ' 題（' + res.need + ' 題以上就通過）' }));
        if (res.pass) stage.appendChild(h('p', { text: '🎉 通過了！得到稱號「' + res.title + '」和「' + ((D.items[res.amulet] || {}).name || '護身符') + '」。' }));
        else {
          stage.appendChild(h('p', { text: '這次還差一點點。明天可以再來考一次！' }));
          if (res.wrongUnits.length) {
            stage.appendChild(h('p.small', { text: '可以再練習的單元：' }));
            stage.appendChild(h('ul.trial-units', {}, res.wrongUnits.map(function (u) { return h('li', { text: u }); })));
          }
          stage.appendChild(h('p.small', { text: '到委託、寶箱多練習這些單元，明天一定更厲害！' }));
        }
        var ok = h('button.primary', { onclick: function () { handle.close(true); resolve(res); } }, ['好 ▶']);
        actions.appendChild(h('span.grow')); actions.appendChild(ok);
        setTimeout(function () { ok.focus(); }, 30);
      }
    });
  }

  J.TrialUI = { run: run, shuffled: shuffled, NO_VOICE_TEXT: NO_VOICE_TEXT, NO_VOICE_WAIT: NO_VOICE_WAIT };
})();
