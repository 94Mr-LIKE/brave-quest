/*
 * v4.0 霧之洞窟（M37–M40）解謎機關的規則與驗證（71 號 2.11）。純計算，可以在 node 測試。
 * 資料：docs/data/puzzles.js 的 window.PUZZLES（規則、答案、提示、expect）；地圖上的位置在 maps.js 各圖的 puzzles（地圖組）。
 * 十種類型：lights（開關與門）、pattern（圖形規律）、memory（記憶翻牌）、sokoban（推箱子）、balance（重量平衡）、
 *           numseq（數字規律）、mirror（光線反射）、euler（一筆畫）、symbol（符號規律）、hanoi（河內塔）。
 * 每一種都有：
 *   init(def, rng)        → 機關剛開始的樣子（rt）
 *   act(def, rt, action)  → { rt: 新的樣子, ok, solved, msg }（不改傳進來的 rt）
 *   solve(def)            → 搜尋類用 BFS／DFS 求最少步數（和 design_lab/cave_puzzles.py 同樣的算法）；答案類重算答案
 * 存檔：state.puzzles = { 'P1-1': true, … }（71 號 10.1：12 道機關解開與否；字典型欄位，只留 true）。
 * 失敗不扣血、不計時（71 號 2.11.1）：act 只回傳「不對」的說明，沒有任何懲罰。
 */
(function () {
  'use strict';
  var TYPES = ['lights', 'pattern', 'memory', 'sokoban', 'balance', 'numseq', 'mirror', 'euler', 'symbol', 'hanoi'];
  var DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
  var ZH_DIR = { '上': 'up', '下': 'down', '左': 'left', '右': 'right' };
  var DIR_ZH = { up: '上', down: '下', left: '左', right: '右' };

  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function res(rt, ok, solved, msg, extra) { var r = { rt: rt, ok: !!ok, solved: !!solved, msg: msg || '' }; if (extra) Object.keys(extra).forEach(function (k) { r[k] = extra[k]; }); return r; }

  // ═════════════════════ lights：踩一塊踏板（星石），連著的燈一起換 ═════════════════════
  /** 每個按鍵切換哪些燈（0 起算）。ring：五角星盤，踩一顆＝它和左右兩顆（71 號 2.11.5 P4-2） */
  function lightToggles(def) {
    var d = def.data, keys = d.keys || Object.keys(d.toggles || {}), out = {};
    if (d.ring) keys.forEach(function (k, i) { var n = keys.length; out[k] = [(i + n - 1) % n, i, (i + 1) % n]; });
    else keys.forEach(function (k) { out[k] = d.toggles[k].slice(); });
    return out;
  }
  function lightKeys(def) { return def.data.keys || Object.keys(def.data.toggles || {}); }
  function bits(arr) { var s = 0; arr.forEach(function (v, i) { if (v) s |= 1 << i; }); return s; }
  // ═════════════════════ 共用：BFS（狀態用字串當鍵） ═════════════════════
  function bfs(start, isGoal, next, keyOf) {
    var k0 = keyOf(start), prev = {}, q = [start], seen = {};
    seen[k0] = true; prev[k0] = null;
    for (var qi = 0; qi < q.length; qi++) {
      var s = q[qi], k = keyOf(s);
      if (isGoal(s)) {
        var path = [];
        while (prev[k]) { path.push(prev[k].move); k = prev[k].from; }
        return { steps: path.length, path: path.reverse(), explored: q.length };
      }
      next(s).forEach(function (e) {
        var nk = keyOf(e.state);
        if (seen[nk]) return;
        seen[nk] = true; prev[nk] = { from: k, move: e.move }; q.push(e.state);
      });
    }
    return { steps: null, path: null, explored: q.length };
  }

  function lightsSolveFrom(def, start) {
    var keys = lightKeys(def), tg = lightToggles(def), n = def.data.n;
    var goal = bits(def.data.goal || new Array(n).fill(1));
    var masks = keys.map(function (k) { return bits(new Array(n).fill(0).map(function (_, i) { return tg[k].indexOf(i) >= 0; })); });
    return bfs(bits(start), function (s) { return s === goal; }, function (s) { return masks.map(function (m, i) { return { state: s ^ m, move: keys[i] }; }); }, String);
  }

  // ═════════════════════ sokoban ═════════════════════
  /** 解析推箱子地圖（# 牆、$ 箱子、. 目標、* 箱子在目標上、@ 主角、+ 主角在目標上；和 cave_puzzles.py 同一套） */
  function sokoParse(rows) {
    var walls = {}, goals = [], boxes = [], player = null;
    rows.forEach(function (line, y) {
      for (var x = 0; x < line.length; x++) {
        var c = line[x];
        if (c === '#') walls[x + ',' + y] = true;
        if ('.*+'.indexOf(c) >= 0) goals.push([x, y]);
        if ('$*'.indexOf(c) >= 0) boxes.push([x, y]);
        if ('@+'.indexOf(c) >= 0) player = [x, y];
      }
    });
    return { walls: walls, goals: goals, boxes: boxes, player: player, w: Math.max.apply(null, rows.map(function (r) { return r.length; })), h: rows.length };
  }
  function boxKey(boxes) { return boxes.map(function (b) { return b[0] + ',' + b[1]; }).sort().join(';'); }
  function sokoStep(P, rt, dir) {
    var d = DIRS[dir];
    if (!d) return null;
    var nx = rt.player[0] + d[0], ny = rt.player[1] + d[1];
    if (P.walls[nx + ',' + ny]) return null;
    var bi = -1;
    rt.boxes.forEach(function (b, i) { if (b[0] === nx && b[1] === ny) bi = i; });
    var boxes = rt.boxes;
    if (bi >= 0) {
      var bx = nx + d[0], by = ny + d[1];
      if (P.walls[bx + ',' + by] || rt.boxes.some(function (b) { return b[0] === bx && b[1] === by; })) return null;
      boxes = rt.boxes.map(function (b, i) { return i === bi ? [bx, by] : b.slice(); });
    }
    return { player: [nx, ny], boxes: boxes, moves: (rt.moves || 0) + 1, pushes: (rt.pushes || 0) + (bi >= 0 ? 1 : 0), pushed: bi };
  }
  function sokoSolved(P, rt) { return boxKey(rt.boxes) === boxKey(P.goals); }
  /** 箱子推進角落（不在目標上，而且上下有一邊、左右有一邊是牆）＝卡死（71 號 2.11.1：自動跳出「箱子卡住了，按重來」） */
  function sokoStuck(P, rt) {
    var g = {}; P.goals.forEach(function (p) { g[p[0] + ',' + p[1]] = true; });
    return rt.boxes.some(function (b) {
      if (g[b[0] + ',' + b[1]]) return false;
      var W = function (x, y) { return !!P.walls[x + ',' + y]; };
      return (W(b[0], b[1] - 1) || W(b[0], b[1] + 1)) && (W(b[0] - 1, b[1]) || W(b[0] + 1, b[1]));
    });
  }

  // ═════════════════════ mirror：光從光源往一個方向走，碰到鏡子轉彎（和 cave_puzzles.py 的 beam_hits 一樣） ═════════════════════
  function beam(def, mstate) {
    var d = def.data, walls = {}, mpos = {};
    d.walls.forEach(function (p) { walls[p[0] + ',' + p[1]] = true; });
    d.mirrors.forEach(function (p, i) { mpos[p[0] + ',' + p[1]] = mstate[i]; });
    var x = d.src[0], y = d.src[1], dx = d.dir[0], dy = d.dir[1], seen = {}, path = [];
    for (;;) {
      x += dx; y += dy;
      if (x < 0 || y < 0 || x >= d.w || y >= d.h || walls[x + ',' + y]) return { hit: false, path: path };
      var k = x + ',' + y + ',' + dx + ',' + dy;
      if (seen[k]) return { hit: false, path: path };
      seen[k] = true;
      path.push([x, y]);
      if (x === d.target[0] && y === d.target[1]) return { hit: true, path: path };
      var m = mpos[x + ',' + y];
      if (m === '/') { var t = dx; dx = -dy; dy = -t; }
      else if (m === '\\') { var t2 = dx; dx = dy; dy = t2; }
    }
  }

  // ═════════════════════ euler：一筆畫 ═════════════════════
  function eulerAll(def) {
    var nodes = def.data.nodes, edges = def.data.edges, sols = [];
    function dfs(v, used, path) {
      if (path.length - 1 === edges.length) { sols.push(path.slice()); return; }
      edges.forEach(function (e, i) {
        if (used[i] || (e[0] !== v && e[1] !== v)) return;
        var w = e[0] === v ? e[1] : e[0];
        used[i] = true; path.push(w);
        dfs(w, used, path);
        path.pop(); used[i] = false;
      });
    }
    nodes.forEach(function (s) { dfs(s, {}, [s]); });
    var deg = {}; nodes.forEach(function (v) { deg[v] = 0; });
    edges.forEach(function (e) { deg[e[0]]++; deg[e[1]]++; });
    var starts = [];
    sols.forEach(function (p) { if (starts.indexOf(p[0]) < 0) starts.push(p[0]); });
    return { degrees: deg, odd: nodes.filter(function (v) { return deg[v] % 2; }), solutions: sols.length, valid_starts: starts.sort(), example: sols[0] || null, steps: edges.length };
  }
  function edgeIndex(def, a, b, used) {
    var E = def.data.edges;
    for (var i = 0; i < E.length; i++) if (!used[i] && ((E[i][0] === a && E[i][1] === b) || (E[i][0] === b && E[i][1] === a))) return i;
    return -1;
  }

  // ═════════════════════ 答案類 ═════════════════════
  /** 圖形規律：形狀 shapes 輪流、顏色 colors 輪流；第 i 個＝colors[i % 色數] + shapes[i % 形數]（P1-2） */
  function patternSeq(def, n) { var d = def.data, out = []; for (var i = 0; i < n; i++) out.push(d.colors[i % d.colors.length] + d.shapes[i % d.shapes.length]); return out; }
  /** 數字規律：第一個是 first，第 k 個＝第 k−1 個＋k（每次多加 1；P2-3） */
  function numSeq(def, n) { var a = [def.data.first]; for (var k = 1; k < n; k++) a.push(a[k - 1] + k * (def.data.step || 1)); return a; }
  /** 重量平衡：從 stones 選 pick 顆，加起來等於 left 的所有組合（P2-2） */
  function balanceAnswers(def) {
    var d = def.data, out = [];
    (function rec(start, picked) {
      if (picked.length === d.pick) { if (picked.reduce(function (s, i) { return s + d.stones[i]; }, 0) === d.left) out.push(picked.map(function (i) { return d.stones[i]; })); return; }
      for (var i = start; i < d.stones.length; i++) rec(i + 1, picked.concat([i]));
    })(0, []);
    return out;
  }
  /** 符號規律：每個符號 1–9，三個式子都成立的所有解（P3-3） */
  function symbolSolutions(def) {
    var d = def.data, syms = [];
    d.eqs.forEach(function (e) { e[0].forEach(function (s) { if (syms.indexOf(s) < 0) syms.push(s); }); });
    var out = [], lo = d.range[0], hi = d.range[1];
    (function rec(i, val) {
      if (i === syms.length) {
        if (d.eqs.every(function (e) { return e[0].reduce(function (s, sym) { return s + val[sym]; }, 0) === e[1]; })) out.push(clone(val));
        return;
      }
      for (var v = lo; v <= hi; v++) { val[syms[i]] = v; rec(i + 1, val); }
      delete val[syms[i]];
    })(0, {});
    return out;
  }
  function hanoiTopOk(pegs, from, to) {
    var a = pegs[from], b = pegs[to];
    if (!a || !b || !a.length || from === to) return false;
    return !b.length || b[b.length - 1] > a[a.length - 1];
  }

  // ═════════════════════ init／act（遊戲裡一步一步玩） ═════════════════════
  function shuffle(arr, rng) { var a = arr.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor((rng || Math.random)() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  function init(def, rng) {
    var d = def.data;
    switch (def.type) {
      case 'lights': return { on: d.start.slice(), steps: 0 };
      case 'pattern': case 'numseq': case 'symbol': return { tries: 0 };
      case 'memory': return { cards: shuffle(memoryDeck(def), rng), open: [], matched: [], flips: 0 };
      case 'sokoban': { var P = sokoParse(d.rows); return { player: P.player.slice(), boxes: P.boxes.map(function (b) { return b.slice(); }), moves: 0, pushes: 0 }; }
      case 'balance': return { on: [], tries: 0 };
      case 'mirror': return { m: d.start.slice(), rotations: 0 };
      case 'euler': return { cur: null, used: {}, trail: [] };
      case 'hanoi': { var pegs = [[], [], []]; for (var i = d.discs - 1; i >= 0; i--) pegs[d.from || 0].push(i); return { pegs: pegs, moves: 0 }; }
    }
    throw new Error('不認得的機關類型：' + def.type);
  }
  function memoryDeck(def) { var out = []; def.data.faces.forEach(function (f) { for (var i = 0; i < (def.data.copies || 2); i++) out.push(f); }); return out; }

  function isSolved(def, rt) {
    var d = def.data;
    switch (def.type) {
      case 'lights': return bits(rt.on) === bits(d.goal || new Array(d.n).fill(1));
      case 'memory': return rt.matched.length === rt.cards.length;
      case 'sokoban': return sokoSolved(sokoParse(d.rows), rt);
      case 'mirror': return beam(def, rt.m).hit;
      case 'euler': return Object.keys(rt.used).length === d.edges.length;
      case 'hanoi': return rt.pegs[d.to === undefined ? 2 : d.to].length === d.discs;
      default: return !!rt.solved;
    }
  }

  /**
   * 做一個動作。action：
   *   lights {press:'A'}｜pattern／numseq {pick: 選項序號}｜memory {flip: 牌序號} 或 {close:true}（兩張不一樣，蓋回去）｜
   *   sokoban {move:'up'…}｜balance {toggle: 石頭序號}｜mirror {rotate: 鏡子序號}｜euler {visit:'A'}｜symbol {pick: 數字}｜hanoi {move:[從, 到]}
   */
  function act(def, rt0, a) {
    var rt = clone(rt0), d = def.data, ok, solved;
    a = a || {};
    switch (def.type) {
      case 'lights': {
        var tg = lightToggles(def)[a.press];
        if (!tg) return res(rt0, false, isSolved(def, rt0), '這裡沒有踏板。');
        tg.forEach(function (i) { rt.on[i] = rt.on[i] ? 0 : 1; });
        rt.steps++;
        solved = isSolved(def, rt);
        return res(rt, true, solved, solved ? '燈全亮了！' : '');
      }
      case 'pattern': case 'numseq': {
        var seq = def.type === 'pattern' ? patternSeq(def, d.length + 1) : numSeq(def, d.length + 1);
        var pickV = d.options[a.pick];
        if (pickV === undefined) return res(rt0, false, false, '');
        rt.tries++;
        ok = pickV === seq[d.length];
        if (ok) rt.solved = true;
        return res(rt, ok, ok, ok ? '答對了！' : '好像不是這個，再看看規律。');
      }
      case 'symbol': {
        var sols = symbolSolutions(def);
        rt.tries++;
        ok = sols.length === 1 && sols[0][d.ask] === a.pick;
        if (ok) rt.solved = true;
        return res(rt, ok, ok, ok ? '密碼對了！' : '密碼不對，再算一次。');
      }
      case 'balance': {
        var i = a.toggle;
        if (!(i >= 0 && i < d.stones.length)) return res(rt0, false, false, '');
        var at = rt.on.indexOf(i);
        if (at >= 0) { rt.on.splice(at, 1); return res(rt, true, false, '拿下來了。'); }
        if (rt.on.length >= d.pick) return res(rt0, false, false, '右邊只能放 ' + d.pick + ' 顆。');
        rt.on.push(i);
        if (rt.on.length < d.pick) return res(rt, true, false, '');
        rt.tries++;
        var sum = rt.on.reduce(function (s, k) { return s + d.stones[k]; }, 0);
        if (sum === d.left) { rt.solved = true; return res(rt, true, true, '天平平平的了！', { sum: sum }); }
        var msg = sum < d.left ? '右邊太輕了（' + sum + ' 公斤）。' : '右邊太重了（' + sum + ' 公斤）。';
        rt.on = [];
        return res(rt, false, false, msg, { sum: sum });
      }
      case 'memory': {
        if (a.close) { rt.open = []; return res(rt, true, isSolved(def, rt), ''); }
        var c = a.flip;
        if (!(c >= 0 && c < rt.cards.length) || rt.matched.indexOf(c) >= 0 || rt.open.indexOf(c) >= 0 || rt.open.length >= 2) return res(rt0, false, isSolved(def, rt0), '');
        rt.open.push(c); rt.flips++;
        if (rt.open.length < 2) return res(rt, true, false, '');
        var x = rt.open[0], y = rt.open[1];
        if (rt.cards[x] === rt.cards[y]) { rt.matched.push(x, y); rt.open = []; solved = isSolved(def, rt); return res(rt, true, solved, solved ? '全部配對完成！' : '一樣！', { pair: true }); }
        return res(rt, true, false, '不一樣，記住它們的位置。', { mismatch: true });
      }
      case 'sokoban': {
        var P = sokoParse(d.rows), n = sokoStep(P, rt, a.move);
        if (!n) return res(rt0, false, isSolved(def, rt0), '推不動。');
        var pushed = n.pushed; delete n.pushed;
        solved = sokoSolved(P, n);
        return res(n, true, solved, solved ? '推到了！' : (sokoStuck(P, n) ? '箱子卡住了，按「重來」。' : ''), { pushed: pushed, stuck: !solved && sokoStuck(P, n) });
      }
      case 'mirror': {
        var mi = a.rotate;
        if (!(mi >= 0 && mi < d.mirrors.length)) return res(rt0, false, false, '');
        rt.m[mi] = rt.m[mi] === '/' ? '\\' : '/';
        rt.rotations++;
        solved = isSolved(def, rt);
        return res(rt, true, solved, solved ? '光照到水晶了！' : '');
      }
      case 'euler': {
        var v = a.visit;
        if (d.nodes.indexOf(v) < 0) return res(rt0, false, false, '');
        if (rt.cur === null) { rt.cur = v; rt.trail = [v]; return res(rt, true, false, '從這顆石頭出發。'); }
        if (rt.cur === v) return res(rt0, false, false, '已經站在這顆石頭上了。');
        var ei = edgeIndex(def, rt.cur, v, rt.used);
        if (ei < 0) return res(rt0, false, false, edgeIndex(def, rt.cur, v, {}) >= 0 ? '這條路已經走過了。' : '這兩顆石頭中間沒有路。');
        rt.used[ei] = true; rt.cur = v; rt.trail.push(v);
        solved = isSolved(def, rt);
        return res(rt, true, solved, solved ? '8 條路都走過了！' : '');
      }
      case 'hanoi': {
        var mv = a.move || [];
        if (!hanoiTopOk(rt.pegs, mv[0], mv[1])) return res(rt0, false, false, '大的不能壓在小的上面。');
        rt.pegs[mv[1]].push(rt.pegs[mv[0]].pop());
        rt.moves++;
        solved = isSolved(def, rt);
        return res(rt, true, solved, solved ? '全部搬好了！' : '');
      }
    }
    throw new Error('不認得的機關類型：' + def.type);
  }

  // ═════════════════════ 驗證（71 號 2.11.6：和 cave_puzzles.py 同樣的檢查） ═════════════════════
  /** 算出這道機關的結果（格式比照 cave_puzzles_results.json 的同一道） */
  function solve(def) {
    var d = def.data;
    switch (def.type) {
      case 'lights': { var r = lightsSolveFrom(def, d.start); return { min_steps: r.steps, solution: r.path }; }
      case 'pattern': { var seq = patternSeq(def, d.length + 1); return { shown: seq.slice(0, d.length), answer: seq[d.length], options: d.options.slice(), unique: d.options.filter(function (o) { return o === seq[d.length]; }).length === 1 }; }
      case 'numseq': { var ns = numSeq(def, d.length + 1); return { shown: ns.slice(0, d.length), answer: ns[d.length], options: d.options.slice(), unique: d.options.filter(function (o) { return o === ns[d.length]; }).length === 1 }; }
      case 'memory': { var deck = memoryDeck(def); return { pairs_ok: d.faces.every(function (f) { return deck.filter(function (x) { return x === f; }).length === 2; }), cards: deck.length, min_flips_if_lucky: deck.length }; }
      case 'balance': { var ans = balanceAnswers(def); return { left: d.left, stones: d.stones.slice(), pick: d.pick, answers: ans, unique: ans.length === 1 }; }
      case 'symbol': { var ss = symbolSolutions(def); return { solutions: ss.map(function (s) { return d.order.map(function (k) { return s[k]; }); }), answer: ss.length === 1 ? ss[0][d.ask] : null, unique: ss.length === 1 }; }
      case 'sokoban': {
        var P = sokoParse(d.rows);
        var r2 = bfs({ player: P.player, boxes: P.boxes, moves: 0, pushes: 0 }, function (s) { return sokoSolved(P, s); },
          function (s) { return Object.keys(DIRS).map(function (dir) { var n = sokoStep(P, s, dir); return n ? { state: n, move: dir } : null; }).filter(Boolean); },
          function (s) { return s.player[0] + ',' + s.player[1] + '|' + boxKey(s.boxes); });
        if (r2.steps === null) return { min_moves: null, min_pushes: null, solution: null };
        var rt = { player: P.player, boxes: P.boxes, moves: 0, pushes: 0 };
        r2.path.forEach(function (m) { rt = sokoStep(P, rt, m); });
        return { min_moves: r2.steps, min_pushes: rt.pushes, solution: r2.path.map(function (m) { return DIR_ZH[m]; }).join('') };
      }
      case 'mirror': {
        var r3 = bfs(d.start.slice(), function (s) { return beam(def, s).hit; },
          function (s) { return s.map(function (_, i) { var t = s.slice(); t[i] = t[i] === '/' ? '\\' : '/'; return { state: t, move: i }; }); }, function (s) { return s.join(''); });
        var win = [];
        (function rec(i, cur) { if (i === d.mirrors.length) { if (beam(def, cur).hit) win.push(cur.slice()); return; } ['/', '\\'].forEach(function (c) { cur[i] = c; rec(i + 1, cur); }); })(0, []);
        return { min_rotations: r3.steps, rotate_order: r3.path, winning_states: win };
      }
      case 'euler': return eulerAll(def);
      case 'hanoi': {
        var n = d.discs, to = d.to === undefined ? 2 : d.to;
        var start = new Array(n).fill(d.from || 0);
        var r4 = bfs(start, function (s) { return s.every(function (p) { return p === to; }); }, function (s) {
          var out = [];
          for (var k = 0; k < n; k++) {
            var top = true; for (var e = 0; e < k; e++) if (s[e] === s[k]) top = false;
            if (!top) continue;
            for (var t = 0; t < 3; t++) {
              if (t === s[k]) continue;
              var ok2 = true; for (var e2 = 0; e2 < k; e2++) if (s[e2] === t) ok2 = false;
              if (!ok2) continue;
              var ns2 = s.slice(); ns2[k] = t; out.push({ state: ns2, move: [s[k], t] });
            }
          }
          return out;
        }, function (s) { return s.join(''); });
        return { discs: n, min_moves: r4.steps, solution: r4.path };
      }
    }
    throw new Error('不認得的機關類型：' + def.type);
  }

  /** lights 的另一個參考：所有開始狀態的最少步數裡最多幾步（P4-2 的難度參考） */
  function lightsMaxOverStarts(def) {
    var n = def.data.n, best = 0;
    for (var s = 0; s < (1 << n); s++) {
      var st = []; for (var i = 0; i < n; i++) st.push((s >> i) & 1);
      var r = lightsSolveFrom(def, st);
      if (r.steps !== null && r.steps > best) best = r.steps;
    }
    return best;
  }

  /** 照 def.expect 檢查（有解、最少步數、答案唯一）；回傳問題清單（空＝通過） */
  function check(def) {
    var bad = [], e = def.expect || {}, r;
    if (TYPES.indexOf(def.type) < 0) return ['類型 ' + def.type + ' 不認得'];
    try { r = solve(def); } catch (x) { return ['算不出來：' + x.message]; }
    function eq(k, want, got) { if (JSON.stringify(want) !== JSON.stringify(got)) bad.push(k + ' 應該是 ' + JSON.stringify(want) + '，算出來是 ' + JSON.stringify(got)); }
    switch (def.type) {
      case 'lights': if (r.min_steps === null) bad.push('無解'); eq('min_steps', e.min_steps, r.min_steps); if (e.solution) eq('solution', e.solution, r.solution);
        if (e.max_over_all_starts !== undefined) eq('max_over_all_starts', e.max_over_all_starts, lightsMaxOverStarts(def)); break;
      case 'pattern': case 'numseq': case 'symbol': case 'balance': if (!r.unique) bad.push('答案不是唯一'); if (e.answer !== undefined) eq('answer', e.answer, r.answer); if (e.answers) eq('answers', e.answers, r.answers); break;
      case 'memory': if (!r.pairs_ok) bad.push('有圖案不是剛好 2 張'); eq('cards', e.cards, r.cards); break;
      case 'sokoban': if (r.min_moves === null) bad.push('無解'); eq('min_moves', e.min_moves, r.min_moves); eq('min_pushes', e.min_pushes, r.min_pushes); break;
      case 'mirror': if (r.min_rotations === null) bad.push('無解'); eq('min_rotations', e.min_rotations, r.min_rotations); break;
      case 'euler': if (!(r.odd.length === 0 || r.odd.length === 2)) bad.push('奇數路的石頭有 ' + r.odd.length + ' 顆（要 0 或 2）'); if (!r.solutions) bad.push('一筆畫不完');
        eq('valid_starts', e.valid_starts, r.valid_starts); eq('steps', e.steps, r.steps); if (e.solutions !== undefined) eq('solutions', e.solutions, r.solutions); break;
      case 'hanoi': if (r.min_moves === null) bad.push('無解'); eq('min_moves', e.min_moves, r.min_moves); break;
    }
    return bad;
  }

  // ═════════════════════ 存檔：state.puzzles ═════════════════════
  /** 修好 state.puzzles（不是物件就換成 {}；只留 true；鍵最多 40 字）；回傳它。舊存檔沒有這個欄位＝{} */
  function progress(state) {
    var p = state && state.puzzles;
    if (!p || typeof p !== 'object' || Array.isArray(p)) { p = {}; if (state) state.puzzles = p; }
    Object.keys(p).forEach(function (k) { if (p[k] !== true || k.length > 40) delete p[k]; });
    return p;
  }
  function solved(state, id) { return !!(state && state.puzzles && state.puzzles[id] === true); }
  /** 記成解開。回傳 true＝這次才解開 */
  function markSolved(state, id) { var p = progress(state); if (p[id] === true) return false; p[id] = true; return true; }
  /** 12 道（或指定清單）全部解開了嗎（稱號「霧之洞窟解謎王」） */
  function allSolved(state, ids) { return ids.length > 0 && ids.every(function (id) { return solved(state, id); }); }

  /** 推箱子提示 3：前 n 步的方向（遊戲裡畫成地上的箭頭） */
  function hintMoves(def, n) {
    if (def.type !== 'sokoban') return [];
    var s = def.expect && def.expect.solution ? def.expect.solution : solve(def).solution;
    return String(s || '').split('').slice(0, n).map(function (c) { return ZH_DIR[c]; }).filter(Boolean);
  }

  var CavePuzzle = { TYPES: TYPES, DIRS: DIRS, ZH_DIR: ZH_DIR, DIR_ZH: DIR_ZH, init: init, act: act, isSolved: isSolved, solve: solve, check: check,
    lightToggles: lightToggles, lightKeys: lightKeys, lightsMaxOverStarts: lightsMaxOverStarts, sokoParse: sokoParse, sokoStuck: sokoStuck, beam: beam, eulerAll: eulerAll,
    patternSeq: patternSeq, numSeq: numSeq, balanceAnswers: balanceAnswers, symbolSolutions: symbolSolutions, hintMoves: hintMoves,
    progress: progress, solved: solved, markSolved: markSolved, allSolved: allSolved, shuffle: shuffle };
  if (typeof window !== 'undefined') { window.JQ = window.JQ || {}; window.JQ.CavePuzzle = CavePuzzle; }
  if (typeof module !== 'undefined') module.exports = CavePuzzle;
})();
