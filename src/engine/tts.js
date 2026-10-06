/*
 * 朗讀（speechSynthesis）。
 * 中英混合的句子會切段：英文字母段落用題目的 tts_lang（例如 en-US），其他用 zh-TW。
 * 沒有語音、或瀏覽器不支援時，靜靜地不做事，不影響作答。
 * onStart / onEnd 讓時間條在朗讀時暫停。
 */
(function () {
  'use strict';
  var synth = window.speechSynthesis || null;
  var enabled = true;
  var speaking = false;

  function pickVoice(lang) {
    if (!synth || !synth.getVoices) return null;
    var vs = synth.getVoices() || [];
    var exact = vs.filter(function (v) { return v.lang && v.lang.replace('_', '-').toLowerCase() === lang.toLowerCase(); });
    if (exact.length) return exact[0];
    var pre = lang.split('-')[0].toLowerCase();
    var near = vs.filter(function (v) { return v.lang && v.lang.toLowerCase().indexOf(pre) === 0; });
    return near[0] || null;
  }

  /** 把文字切成 [{text, lang}]：連續的英文字母（含空白、標點）用 latinLang */
  function segments(text, latinLang) {
    var out = [];
    var re = /([A-Za-z][A-Za-z0-9 ,.'!?\-]*[A-Za-z0-9.!?]|[A-Za-z])/g;
    var last = 0, m;
    while ((m = re.exec(text))) {
      if (m.index > last) out.push({ text: text.slice(last, m.index), lang: 'zh-TW' });
      out.push({ text: m[0], lang: latinLang });
      last = m.index + m[0].length;
    }
    if (last < text.length) out.push({ text: text.slice(last), lang: 'zh-TW' });
    return out.filter(function (s) { return s.text.replace(/[\s，。、！？「」（）()]/g, '').length; });
  }

  function stop() {
    if (synth) { try { synth.cancel(); } catch (e) { /* 忽略 */ } }
    speaking = false;
  }

  /** 朗讀。lang = 題目的 tts_lang；回傳 false 代表這台裝置不能朗讀 */
  function speak(text, lang, onStart, onEnd) {
    if (!synth || !enabled || !window.SpeechSynthesisUtterance) { if (onEnd) onEnd(); return false; }
    stop();
    var latin = lang && lang.indexOf('en') === 0 ? lang : 'en-US';
    var segs = segments(String(text || ''), latin);
    if (!segs.length) { if (onEnd) onEnd(); return false; }
    speaking = true;
    if (onStart) onStart();
    var finished = false;
    function done() { if (finished) return; finished = true; speaking = false; if (onEnd) onEnd(); }
    segs.forEach(function (s, i) {
      var u = new SpeechSynthesisUtterance(s.text);
      u.lang = s.lang;
      var v = pickVoice(s.lang);
      if (v) u.voice = v;
      u.rate = s.lang === 'zh-TW' ? 0.95 : 0.85;
      if (i === segs.length - 1) { u.onend = done; u.onerror = done; }
      try { synth.speak(u); } catch (e) { done(); }
    });
    // 保險：有些瀏覽器不會觸發 onend，最多暫停 40 秒
    setTimeout(done, Math.min(40000, 2500 + String(text).length * 260));
    return true;
  }

  function warmUp() {
    if (!synth || !window.SpeechSynthesisUtterance) return;
    try { var u = new SpeechSynthesisUtterance(''); u.volume = 0; synth.speak(u); } catch (e) { /* 忽略 */ }
  }

  window.JQ = window.JQ || {};
  window.JQ.TTS = {
    speak: speak, stop: stop, warmUp: warmUp, segments: segments,
    isSpeaking: function () { return speaking; },
    available: function () { return !!(synth && window.SpeechSynthesisUtterance); },
    setEnabled: function (v) { enabled = !!v; if (!v) stop(); }
  };
})();
