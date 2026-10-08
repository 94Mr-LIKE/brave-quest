/*
 * 使用者回饋（v0.7.2）：組出寄給作者的 Email 內容與 mailto 連結。純計算，可以在 node 測試。
 * - 不發任何網路請求：mailto 交給瀏覽器（郵件 App）處理；沒有郵件 App 時用「複製內容」。
 * - 附上的資訊只有：版本號、目前地圖 ID、等級、瀏覽器 userAgent、螢幕尺寸、語音設定。
 *   不放玩家名字、存檔碼或其他個資；家長在文字框裡打到玩家名字，也會換成「（玩家名字）」。
 * - 整個 mailto 網址控制在 MAX_URL（1800）字元以內，太長就截斷文字內容。
 */
(function () {
  'use strict';
  var EMAIL = 'Mr.bigboss.office@gmail.com';
  var CATEGORIES = ['遊戲有問題', '題目有錯', '建議', '其他'];
  var MAX_TEXT = 500, MAX_URL = 1800, SUBJECT_PREFIX = '【勇者大冒險回饋】';
  var CUT_NOTE = '…（內容太長，後面已截斷）';

  function enc(s) { return encodeURIComponent(s); }
  /** 安全截斷：不在 emoji 等代理對中間切開（切開會讓 encodeURIComponent 丟錯，夜班審查 v0.7.2） */
  function cut(s, n) { return String(s).slice(0, Math.max(0, n)).replace(/[\uD800-\uDBFF]$/, ''); }

  /** 只留允許的欄位 */
  function safeInfo(info) {
    info = info || {};
    var ua = cut(info.userAgent || '', 300);
    return {
      version: cut(info.version || '', 40),
      map: cut(info.map || '', 20),
      level: typeof info.level === 'number' ? info.level : '',
      userAgent: ua,
      screen: cut(info.screen || '', 60),
      voice: cut(info.voice || '', 120)
    };
  }

  /** 把文字裡的玩家名字遮掉（家長可能順手打了孩子的名字）；不分大小寫（名字是 Ken、家長打 ken 也要遮） */
  function maskName(text, name) {
    var s = String(text || '');
    var n = String(name || '').trim();
    if (!n) return s;
    return s.replace(new RegExp(n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '（玩家名字）');
  }

  function bodyText(o, text, ua) {
    var lines = ['類別：' + o.category, '', '內容：', text || '（沒有填寫）'];
    if (o.category === '題目有錯' && o.questionIds && o.questionIds.length) lines.push('', '最近答過的題目 ID：' + o.questionIds.join('、'));
    if (o.includeInfo) {
      var i = o.info;
      lines.push('', '——遊戲版本與裝置資訊——', '版本：' + (i.version || '（沒有版本號）'), '地圖：' + (i.map || '—'), '等級：' + (i.level === '' ? '—' : i.level),
        '瀏覽器：' + ua, '螢幕：' + (i.screen || '—'), '語音設定：' + (i.voice || '—'));
    }
    return lines.join('\n');
  }

  function mailto(subject, body) {
    return 'mailto:' + EMAIL + '?subject=' + enc(subject) + '&body=' + enc(body);
  }

  /**
   * o = { category, text, includeInfo, info:{version,map,level,userAgent,screen,voice}, recentQuestionIds:[], playerName }
   * 回傳 { subject, body, url, truncated, questionIds }
   */
  function build(o) {
    o = o || {};
    var cat = CATEGORIES.indexOf(o.category) >= 0 ? o.category : '其他';
    var qids = cat === '題目有錯' ? (o.recentQuestionIds || []).slice(-3).reverse().map(function (x) { return cut(x, 40); }) : [];
    var spec = { category: cat, includeInfo: o.includeInfo !== false, info: safeInfo(o.info), questionIds: qids };
    var subject = SUBJECT_PREFIX + cat;
    var text = maskName(cut(o.text || '', MAX_TEXT), o.playerName).trim();
    var ua = spec.info.userAgent;
    var body = bodyText(spec, text, ua), truncated = false;
    if (mailto(subject, body).length > MAX_URL) {
      // 先縮短 userAgent，還太長就從後面截斷文字內容
      ua = cut(ua, 120);
      body = bodyText(spec, text, ua);
      if (mailto(subject, body).length > MAX_URL) {
        var lo = 0, hi = text.length;
        while (lo < hi) {
          var mid = Math.ceil((lo + hi) / 2);
          if (mailto(subject, bodyText(spec, cut(text, mid) + CUT_NOTE, ua)).length <= MAX_URL) lo = mid; else hi = mid - 1;
        }
        body = bodyText(spec, cut(text, lo) + CUT_NOTE, ua);
        truncated = true;
      }
      while (mailto(subject, body).length > MAX_URL && body.length) body = cut(body, body.length - 20);   // 最後保險
    }
    return { subject: subject, body: body, url: mailto(subject, body), truncated: truncated, questionIds: qids, to: EMAIL };
  }

  /** 「複製內容」用的純文字（收件人、主旨、內文） */
  function plainText(r) { return '收件人：' + r.to + '\n主旨：' + r.subject + '\n\n' + r.body; }

  var Feedback = { EMAIL: EMAIL, CATEGORIES: CATEGORIES, MAX_TEXT: MAX_TEXT, MAX_URL: MAX_URL, build: build, plainText: plainText, safeInfo: safeInfo, maskName: maskName };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.Feedback = Feedback; }
  if (typeof module !== 'undefined') module.exports = Feedback;
})();
