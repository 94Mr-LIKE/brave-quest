/*
 * 收集冊（v3.0.1 ①；競品吸收清單第 1 項，老闆 2026-11-04 核准）：怪物名冊、到過的地方、台語諺語、證書冊、記憶卡的完成度，放在冒險手帳同一頁。
 * 由 wip_v301/v301_features_apply.js 複製成 docs/src/systems/collect.js。純函式（node 可以 require），只讀存檔，不改存檔、不收任何資料。
 *   證書冊：大結局前先留位子（reserved）；v4.2 大結局上線：呼叫的人傳 opts.certsOpen＝flags.ending_done、opts.certBook＝EndingRules.certBook（state.certs 職業 id → { d, e }）。
 *   記憶卡：還沒有內容（競品比較 codex2 未做），先留位子。
 */
(function () {
  'use strict';
  var isNode = typeof module !== 'undefined' && typeof require === 'function';
  var Bestiary = isNode ? require('./bestiary.js') : window.JQ.Bestiary;
  var Proverbs = isNode ? require('./proverbs.js') : window.JQ.Proverbs;

  function entryMap(r) { var e = r && r.map_entry; return !e ? null : typeof e === 'string' ? e : e.map; }
  /** 世界地圖上的地區：[{ id, name, ref（小知識）, map, got（去過了沒） }] */
  function places(state, world) {
    var visited = (state && state.visited) || {};
    // v4.2 4c 夜班：破關後才出現的地區（hide_locked，R_YUSHAN）解鎖前不列、不算總數（不顯示「？？？」）
    var WM = isNode ? require('./worldmap.js') : (window.JQ && window.JQ.WorldMap);
    return ((world && world.regions) || []).filter(function (r) { return !WM || WM.visible(r, state); }).map(function (r) {
      var m = entryMap(r);
      return { id: r.id, name: r.name || r.id, ref: String(r.real_ref || '').replace(/^[（(]|[）)]$/g, ''), map: m, got: !!(m && visited[m] === true) };
    });
  }
  /**
   * 收集冊總覽：{ items: [{ id, icon, name, unit, got, total, left, reserved, note }], got, total, left }（總計不算 reserved 的）
   * data＝G.data（monsters、maps、jobs）；opts＝{ proverbs, quizzes, world, certsOpen }
   */
  function summary(state, data, opts) {
    opts = opts || {};
    var D = data || {}, items = [];
    var bc = Bestiary.counts(state, D.monsters || {}, D.maps || {});
    items.push({ id: 'monsters', icon: '🐾', name: '怪物名冊', unit: '種', got: bc.seen, total: bc.total, note: '遇見過的怪物會出現在這裡' });
    var pl = places(state, opts.world);
    items.push({ id: 'places', icon: '🗺️', name: '到過的地方', unit: '個', got: pl.filter(function (p) { return p.got; }).length, total: pl.length, note: '走路或搭車到那裡就算' });
    var pv = Proverbs.progress(state, opts.proverbs || [], opts.quizzes || []);
    items.push({ id: 'proverbs', icon: '📜', name: '台語諺語', unit: '句', got: pv.got, total: pv.total, note: '和各地的阿伯說話就能收集' });
    var jobs = Object.keys(D.jobs || {}), certs = (state && state.certs) || {};
    // v4.2 第 4b 批：大結局後呼叫的人傳 certsOpen＝flags.ending_done、certBook＝EndingRules.certBook（只數證書冊實際顯示的格子，CERT_BOOK_RULE_4B）
    var cb = opts.certsOpen && opts.certBook ? opts.certBook : null;
    items.push({ id: 'certs', icon: '🏅', name: '證書冊', unit: '張', got: cb ? cb.got : opts.certsOpen ? jobs.filter(function (j) { return certs[j]; }).length : 0, total: cb ? cb.shown : jobs.length,
      reserved: !opts.certsOpen, note: opts.certsOpen ? '每個職業可以領一張勇者之證' : '打敗最後的魔王、完成大結局以後，每個職業可以領一張勇者之證' });
    items.push({ id: 'cards', icon: '🃏', name: '記憶卡', unit: '張', got: 0, total: 0, reserved: true, note: '還在準備中，敬請期待' });
    var got = 0, total = 0;
    items.forEach(function (it) { it.left = Math.max(0, it.total - it.got); if (!it.reserved) { got += it.got; total += it.total; } });
    return { items: items, got: got, total: total, left: Math.max(0, total - got) };
  }
  /** 「還差 N 個」的說法（三年級用字）；收集完了就說「全部收集完成！」 */
  function leftText(it) {
    if (it.reserved) return '還沒開放';
    if (!it.total) return '還沒有';
    return it.left ? '還差 ' + it.left + ' ' + (it.unit || '個') : '全部收集完成！';
  }

  var Collect = { places: places, summary: summary, leftText: leftText, entryMap: entryMap };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.Collect = Collect; }
  if (typeof module !== 'undefined') module.exports = Collect;
})();
