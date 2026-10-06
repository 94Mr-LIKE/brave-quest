/*
 * DOM 介面共用工具：建立元素、視窗堆疊（含焦點管理）、提示訊息、對話框
 * 所有文字介面都用 DOM（中文清楚、螢幕報讀器讀得到），疊在 Phaser 畫布上。
 */
(function () {
  'use strict';
  var layer, toasts, live;
  var stack = [];   // 開著的視窗 [{node, onClose, prevFocus, modal}]

  function init() {
    layer = document.getElementById('layer');
    toasts = document.getElementById('toasts');
    live = document.getElementById('sr-live');
    document.addEventListener('keydown', onKey, true);
  }

  function esc(s) { return window.JQ.Assets.esc(s == null ? '' : s); }

  /** h('button.primary', {onclick:fn, 'aria-label':'…'}, ['文字' 或元素…]) */
  function h(sel, attrs, children) {
    var parts = sel.split('.');
    var node = document.createElement(parts[0] || 'div');
    if (parts.length > 1) node.className = parts.slice(1).join(' ');
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v === undefined || v === null || v === false) return;
      if (k.indexOf('on') === 0 && typeof v === 'function') node.addEventListener(k.slice(2), v);
      else if (k === 'html') node.innerHTML = v;
      else if (k === 'text') node.textContent = v;
      else if (k === 'style' && typeof v === 'object') Object.assign(node.style, v);
      else node.setAttribute(k, v === true ? '' : v);
    });
    (children || []).forEach(function (c) {
      if (c === null || c === undefined || c === false) return;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  }

  function focusables(node) {
    return Array.prototype.filter.call(node.querySelectorAll('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'),
      function (n) { return !n.disabled && n.offsetParent !== null; });
  }

  /**
   * 開一個視窗。opts: { modal(預設 true，有半透明遮罩), label, onClose, escClose(預設 true), focus(要先聚焦的元素) }
   * 回傳 { node, close() }
   */
  function open(content, opts) {
    opts = opts || {};
    var modal = opts.modal !== false;
    var wrap = modal ? h('div.modal-back', {}, [content]) : content;
    if (opts.label) { content.setAttribute('role', 'dialog'); content.setAttribute('aria-modal', modal ? 'true' : 'false'); content.setAttribute('aria-label', opts.label); }
    layer.appendChild(wrap);
    var entry = { node: wrap, content: content, onClose: opts.onClose, prevFocus: document.activeElement, escClose: opts.escClose !== false, modal: modal };
    stack.push(entry);
    setTimeout(function () {
      var f = opts.focus || focusables(content)[0];
      if (f && document.body.contains(f)) f.focus();
    }, 30);
    var handle = {
      node: content,
      close: function (silent) {
        var i = stack.indexOf(entry);
        if (i < 0) return;
        stack.splice(i, 1);
        syncBodyClass();
        if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
        if (entry.prevFocus && entry.prevFocus.focus && document.body.contains(entry.prevFocus)) { try { entry.prevFocus.focus(); } catch (e) { /* 忽略 */ } }
        if (!silent && entry.onClose) entry.onClose();
      }
    };
    entry.handle = handle;
    syncBodyClass();
    return handle;
  }

  /** body.modal-open：讓觸控 B 鍵移到遮罩上方（見 style.css） */
  function syncBodyClass() { document.body.classList.toggle('modal-open', stack.some(function (e) { return e.modal; })); }

  function closeAll() { while (stack.length) stack[stack.length - 1].handle.close(true); }
  function isOpen() { return stack.length > 0; }
  function top() { return stack[stack.length - 1] || null; }

  function onKey(e) {
    var t = top();
    if (!t) return;
    if (e.key === 'Escape' && t.escClose) { e.preventDefault(); t.handle.close(); return; }
    if (e.key === 'Tab') {   // 焦點留在最上層視窗裡
      var f = focusables(t.content);
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      else if (!t.content.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
    }
  }

  function toast(text, ms) {
    var n = h('div.win.toast', { text: text });
    toasts.appendChild(n);
    setTimeout(function () { if (n.parentNode) n.parentNode.removeChild(n); }, ms || 2600);
  }

  function banner(text, cls) {
    var n = h('div.win.' + (cls || 'big-banner'), { text: text, 'aria-hidden': 'true' });
    document.getElementById('ui').appendChild(n);
    setTimeout(function () { if (n.parentNode) n.parentNode.removeChild(n); }, 2700);
    announce(text);
  }

  function announce(text) { if (live) { live.textContent = ''; setTimeout(function () { live.textContent = text; }, 30); } }

  /**
   * 對話框：lines = [{who, text}]；ctx.speaker(who) → {name, sprite}；ctx.playerName
   * 回傳 Promise（看完全部句子後 resolve）
   */
  function dialog(lines, ctx) {
    ctx = ctx || {};
    lines = (lines || []).filter(function (l) { return l && l.text; });
    if (!lines.length) return Promise.resolve();
    return new Promise(function (resolve) {
      var i = 0;
      var portrait = h('div.portrait', { 'aria-hidden': 'true' });
      var speaker = h('div.speaker');
      var text = h('div.text', { 'aria-live': 'polite' });
      var tailo = h('div.tailo', { lang: 'nan-Latn-TW' });
      var huayu = h('div.huayu');
      var current = null;
      var speakBtn = h('button', { onclick: function () { if (current) window.JQ.TTS.speak(current.speak, 'zh-TW'); }, 'aria-label': '朗讀這句（台語句子讀華語翻譯）' }, ['🔊']);
      var nextBtn = h('button.primary', { onclick: advance }, ['下一句 ▶']);
      var skipBtn = h('button.ghost', { onclick: finish }, ['略過']);
      var box = h('div.win.dialog', {}, [portrait, h('div.grow', {}, [speaker, text, tailo, huayu, h('div.row.end', {}, [ctx.tts === false ? null : speakBtn, h('span.grow'), skipBtn, nextBtn])])]);
      var handle = open(box, { modal: true, label: '對話', escClose: true, onClose: function () { resolve(); }, focus: nextBtn });
      function render() {
        var l = lines[i];
        var sp = ctx.speaker ? ctx.speaker(l.who) : { name: l.who };
        speaker.textContent = sp.name || '';
        speaker.hidden = !sp.name;
        current = window.JQ.DialogText.view(l, ctx.taigiSub, ctx.playerName);
        text.textContent = current.main;
        text.lang = current.isTaigi ? 'nan-Hant-TW' : 'zh-Hant-TW';
        tailo.textContent = current.tailo; tailo.hidden = !current.tailo;
        huayu.textContent = current.huayu ? '（華語：' + current.huayu + '）' : ''; huayu.hidden = !current.huayu;
        portrait.innerHTML = sp.sprite ? window.JQ.Assets.domIcon(sp.sprite, { size: 80, label: sp.name || '？', alt: sp.name || '' }) : '<span class="ph">' + (sp.name ? esc(sp.name.slice(0, 1)) : '…') + '</span>';
        portrait.style.visibility = l.who === 'narrator' ? 'hidden' : 'visible';
        nextBtn.textContent = i === lines.length - 1 ? '好 ✓' : '下一句 ▶';
        skipBtn.hidden = lines.length <= 2;
      }
      function advance() { window.JQ.TTS.stop(); window.JQ.Audio.play('select'); i++; if (i >= lines.length) finish(); else render(); }
      function finish() { handle.close(); }
      render();
    });
  }

  /** 把 {name} 換成冒險者名字 */
  function fill(text, name) { return String(text || '').replace(/\{(name|player|hero)\}/g, name || '小冒險者'); }

  /** 是／否確認視窗 → Promise<boolean> */
  function confirmBox(message, yesText, noText) {
    return new Promise(function (resolve) {
      var done = false;
      var yes = h('button.primary', { onclick: function () { done = true; handle.close(); resolve(true); } }, [yesText || '好']);
      var no = h('button', { onclick: function () { done = true; handle.close(); resolve(false); } }, [noText || '不要']);
      var box = h('div.win.panel.narrow', {}, [h('p', { text: message }), h('div.row.end', {}, [no, yes])]);
      var handle = open(box, { label: message, onClose: function () { if (!done) resolve(false); }, focus: yes });
    });
  }

  window.JQ = window.JQ || {};
  window.JQ.UI = { init: init, h: h, esc: esc, open: open, closeAll: closeAll, isOpen: isOpen, toast: toast, banner: banner, announce: announce, dialog: dialog, fill: fill, confirm: confirmBox };
})();
