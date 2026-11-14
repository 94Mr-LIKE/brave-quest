/* 一般野怪放置：純邏輯，瀏覽器與 node 共用；只在放怪／重生時呼叫。 */
(function () {
  'use strict';
  function distance(a, b) { return Math.abs(a.x - b.x) + Math.abs(a.y - b.y); }
  // 與盤點／場景相同：spawn.elite 是限定精英；M43 的 monster.elite 強怪仍屬一般出沒群。
  function ordinary(s, mon) { return !(s.boss || (mon || {}).boss || s.elite || s.quest); }
  function features(map) {
    return [].concat(map.exits || [], map.npcs || [], map.chests || [],
      map.inn || [], map.shop || [], map.extra_shops || [], map.station || [])
      .filter(function (p) { return Number.isFinite(p.x) && Number.isFinite(p.y); });
  }
  /** 設施「4 格以內」不放怪（距離須 >4）。先放寬怪距，再把設施半徑降至 3、2。
   * 車站／下車點 5 格方形保護由呼叫端的 tiles 保證，永不放寬。
   * null 表示輸入無任何合法空格；不以疊怪或貼近主角掩蓋壞資料。 */
  function pick(options) {
    var occupied = options.occupied || [], features = options.features || [], rng = options.rng || Math.random;
    var base = (options.tiles || []).filter(function (t) {
      return (!options.player || distance(t, options.player) >= 4) &&
        occupied.every(function (p) { return distance(t, p) > 0; });
    });
    for (var radius = 4; radius >= 2; radius--) {
      var safe = base.filter(function (t) { return features.every(function (p) { return distance(t, p) > radius; }); });
      for (var min of [6, 4, 3, 1]) {
        var candidates = safe.filter(function (t) { return occupied.every(function (p) { return distance(t, p) >= min; }); });
        if (!candidates.length) continue;
        var relaxed = radius < 4 || min < 6;
        if (options.stats && relaxed) {
          options.stats.relaxed = (options.stats.relaxed || 0) + 1;
          if (min < 6) options.stats.r2 = (options.stats.r2 || 0) + 1;
          if (radius < 4) options.stats.r4 = (options.stats.r4 || 0) + 1;
        }
        return { tile: candidates[Math.min(candidates.length - 1, Math.floor(rng() * candidates.length))],
          monsterDistance: min, featureRadius: radius, relaxed: relaxed };
      }
    }
    return null;
  }
  var Spread = { pick: pick, distance: distance, features: features, ordinary: ordinary };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.SpawnSpread = Spread; }
  if (typeof module !== 'undefined') module.exports = Spread;
})();
