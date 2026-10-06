/* 抬頭資訊（名字、等級、經驗值、體力、魔力、金幣、按鈕）、靠近提示、觸控虛擬搖桿與 A／B 鍵 */
(function () {
  'use strict';
  var J = window.JQ;
  var hudEl, promptEl, padEl, refs = {};

  function bar(cls, label) {
    var fill = document.createElement('i');
    var b = J.UI.h('span.bar.' + cls, { role: 'progressbar', 'aria-label': label, 'aria-valuemin': '0', 'aria-valuemax': '100' }, [fill]);
    return { el: b, fill: fill };
  }

  function init(handlers) {
    var h = J.UI.h;
    hudEl = document.getElementById('hud');
    promptEl = document.getElementById('prompt');
    padEl = document.getElementById('pad');
    refs.name = h('span.name');
    refs.level = h('span');
    refs.exp = bar('exp', '經驗值');
    refs.hp = bar('hp', '體力');
    refs.hpText = h('span');
    refs.mp = bar('mp', '魔力');
    refs.mpText = h('span');
    refs.coins = h('span');
    var card = h('div.win.hud-card', { 'aria-label': '冒險者狀態' }, [
      refs.name, refs.level, h('span', {}, ['經驗值 ', refs.exp.el]),
      h('span', {}, ['體力 ', refs.hp.el, ' ', refs.hpText]), h('span', {}, ['魔力 ', refs.mp.el, ' ', refs.mpText]), refs.coins
    ]);
    var btns = h('div.hud-buttons', {}, [
      h('button', { onclick: handlers.journal, 'aria-label': '冒險手帳' }, ['📔 手帳']),
      h('button', { onclick: handlers.bag, 'aria-label': '背包與裝備' }, ['🎒 背包']),
      h('button', { onclick: handlers.settings, 'aria-label': '家長設定' }, ['⚙️ 設定'])
    ]);
    hudEl.innerHTML = '';
    hudEl.appendChild(card);
    hudEl.appendChild(btns);

    // 觸控：左下虛擬搖桿（拖曳方向與力度控制移動，放開就停）、右下 A 鍵（對話／調查）與 B 鍵（取消／選單）
    var C = J.CONFIG;
    padEl.innerHTML = '';
    var knob = h('div.knob');
    var joy = h('div.joystick', { role: 'application', 'aria-label': '移動搖桿：按住往想走的方向拖', style: { width: C.JOYSTICK_SIZE + 'px', height: C.JOYSTICK_SIZE + 'px' } }, [knob]);
    var active = null;
    function moveKnob(e) {
      var r = joy.getBoundingClientRect();
      var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      var dx = e.clientX - cx, dy = e.clientY - cy;
      var rad = r.width / 2;
      var dist = Math.sqrt(dx * dx + dy * dy);
      var force = Math.min(1, dist / rad);
      var k = dist > rad ? rad / dist : 1;
      knob.style.transform = 'translate(' + (dx * k) + 'px,' + (dy * k) + 'px)';
      var dir = null;
      if (force >= C.JOYSTICK_DEADZONE) dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
      handlers.joystick(dir, force);
    }
    function release(e) {
      if (active === null || (e && e.pointerId !== active)) return;
      active = null;
      knob.style.transform = '';
      handlers.joystick(null, 0);
    }
    joy.addEventListener('pointerdown', function (e) { e.preventDefault(); active = e.pointerId; try { joy.setPointerCapture(e.pointerId); } catch (x) { /* 忽略 */ } moveKnob(e); });
    joy.addEventListener('pointermove', function (e) { if (active === e.pointerId) { e.preventDefault(); moveKnob(e); } });
    joy.addEventListener('pointerup', release);
    joy.addEventListener('pointercancel', release);
    joy.addEventListener('lostpointercapture', release);
    var size = C.TOUCH_BUTTON_SIZE + 'px';
    var abtn = h('button.abtn.primary', { onclick: handlers.action, 'aria-label': 'A 鍵：對話、調查', style: { width: size, height: size } }, ['A']);
    var bbtn = h('button.bbtn', { onclick: handlers.cancel, 'aria-label': 'B 鍵：取消、打開選單', style: { width: size, height: size } }, ['B']);
    padEl.appendChild(joy);
    padEl.appendChild(bbtn);
    padEl.appendChild(abtn);
    // 遊戲區域不要觸發瀏覽器的雙擊縮放、下拉重新整理
    ['dblclick', 'gesturestart'].forEach(function (ev) {
      document.getElementById('game').addEventListener(ev, function (e) { e.preventDefault(); }, { passive: false });
      padEl.addEventListener(ev, function (e) { e.preventDefault(); }, { passive: false });
    });
    setTouchMode('auto');
  }

  /** 'auto'（觸控裝置自動顯示）／'on'／'off' */
  function setTouchMode(mode) {
    var coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    padEl.dataset.touch = (mode === 'on' || (mode !== 'off' && coarse)) ? '1' : '';
    if (!hudEl.hidden) padEl.hidden = !padEl.dataset.touch;
  }

  function show(on) {
    hudEl.hidden = !on;
    padEl.hidden = !(on && padEl.dataset.touch);
    if (!on) promptEl.hidden = true;
  }

  function setBar(b, cur, max) {
    var p = max > 0 ? Math.max(0, Math.min(1, cur / max)) : 0;
    b.fill.style.width = (p * 100).toFixed(0) + '%';
    b.el.setAttribute('aria-valuenow', String(Math.round(p * 100)));
  }

  /** s = Character.stats */
  function update(state, s) {
    if (!hudEl || hudEl.hidden && !refs.name) return;
    var p = state.player;
    refs.name.textContent = p.name;
    refs.level.textContent = '等級 ' + p.level + '・' + (s.jobName || '');
    setBar(refs.exp, p.exp, J.Exp.expToNext(p.level));
    refs.exp.el.title = p.exp + ' / ' + J.Exp.expToNext(p.level);
    setBar(refs.hp, p.hp, s.maxHp);
    refs.hpText.textContent = p.hp + '/' + s.maxHp;
    setBar(refs.mp, p.mp, s.maxMp);
    refs.mpText.textContent = p.mp + '/' + s.maxMp;
    refs.coins.textContent = '🪙 金幣 ' + p.coins;
  }

  /** 靠近可以互動的東西時顯示提示按鈕；text = null 隱藏 */
  function prompt(text, onClick) {
    if (!text) { promptEl.hidden = true; promptEl.innerHTML = ''; return; }
    if (promptEl.dataset.text === text && !promptEl.hidden) return;
    promptEl.dataset.text = text;
    promptEl.innerHTML = '';
    promptEl.appendChild(J.UI.h('button.primary', { onclick: onClick }, ['Ⓐ ' + text]));
    promptEl.hidden = false;
  }

  function mapBanner(name) {
    var n = J.UI.h('div.win.map-banner', { text: name, 'aria-hidden': 'true' });
    document.getElementById('ui').appendChild(n);
    setTimeout(function () { if (n.parentNode) n.parentNode.removeChild(n); }, 2700);
    J.UI.announce('來到了' + name);
  }

  window.JQ = window.JQ || {};
  window.JQ.HUD = { init: init, show: show, setTouchMode: setTouchMode, update: update, prompt: prompt, mapBanner: mapBanner };
})();
