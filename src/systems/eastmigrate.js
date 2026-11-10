/* v4.2：東部存檔格式 7 → 8。只補欄位，舊結局不當成玉山結局。 */
(function () {
  'use strict';
  var isNode = typeof module !== 'undefined' && typeof require === 'function';
  var jobs;
  function object(v) { return !!v && typeof v === 'object' && !Array.isArray(v); }
  function jobIds() {
    if (isNode) {
      if (!jobs) { var w = {}; new Function('window', require('fs').readFileSync(require('path').join(__dirname, '../../data/jobs.js'), 'utf8'))(w); jobs = w.JOBS; }
      return jobs || {};
    }
    return window.JOBS || {};
  }
  function trueDict(v) {
    if (!object(v)) return {};
    Object.keys(v).forEach(function (k) { if (v[k] !== true || k.length > 40) delete v[k]; });
    return v;
  }
  function needs(s) { return !!s && s.version < 8; }
  function repair(s) {
    s.puzzles = trueDict(s.puzzles);
    if (!object(s.east)) s.east = {};
    ['lost', 'clouds', 'stars', 'done'].forEach(function (k) { s.east[k] = trueDict(s.east[k]); });
    if (!object(s.certs)) s.certs = {};
    var valid = jobIds();
    Object.keys(s.certs).forEach(function (k) { if (!Object.prototype.hasOwnProperty.call(valid, k) || !object(s.certs[k])) delete s.certs[k]; });
    if (!object(s.lamps)) s.lamps = {};
    if (typeof s.lamps['曙光'] !== 'boolean') s.lamps['曙光'] = false;
    if (!object(s.flags)) s.flags = {};
    if (s.ending === true) s.flags.old_ending = true;
    return s;
  }
  function migrate(s) { repair(s); if (needs(s)) s.version = 8; return s; }
  var EastMigrate = { needs: needs, migrate: migrate, repair: repair };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.EastMigrate = EastMigrate; }
  if (typeof module !== 'undefined') module.exports = EastMigrate;
})();
