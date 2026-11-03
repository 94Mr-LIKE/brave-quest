/* 船班介面：售票、不能操控的海上過場，以及既有換地圖函式的小轉接。 */
(function () {
  'use strict';
  var J = window.JQ, playing = false;
  var DURATION = 4000;

  function reduced() {
    var s = J.Game && J.Game.state, value = s && s.settings && s.settings.reduceMotion;
    if (value === 'on') return true;
    if (value === 'off') return false;
    try { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); }
    catch (e) { return false; }
  }
  function label(end) { return typeof end === 'string' ? end : (end && end.dockLabel || '碼頭'); }

  /** 約 4 秒；按跳過、A／Z／Enter／空白／Esc 都只完成一次。 */
  function play(info, onDone) {
    if (playing) return false;
    var U = J.UI, h = U.h, done = false, timer, handle;
    var text = '船開往' + label(info.to) + '…';
    var skip = h('button.primary.ferry-skip', { type: 'button', text: '跳過', 'aria-label': '跳過搭船動畫', onclick: finish });
    var boat = h('div.ferry-boat', {}, [h('div.ferry-cabin'), h('div.ferry-hull')]);
    // 讀屏：開場由共用 sr-live 念一次目的地；焦點移到「跳過」時，對話框描述（aria-describedby）再帶出目的地。
    // 不在框內另設 aria-live，避免同一句被念兩次。
    var box = h('section.ferry-screen' + (reduced() ? '.ferry-reduced' : ''), { 'aria-describedby': 'ferry-status' }, [
      h('h2', { text: info.routeName || '搭船旅行' }),
      h('p.ferry-status', { id: 'ferry-status', text: text }),
      h('div.ferry-sea', { 'aria-hidden': 'true' }, [boat]),
      h('p.ferry-hint', { text: '休息一下，就快到囉！' }), skip
    ]);
    function finish() {
      if (done) return;
      done = true;
      clearTimeout(timer);
      document.removeEventListener('keydown', key, true);
      if (handle) handle.close(true);
      playing = false;
      if (onDone) onDone();
    }
    function key(e) {
      if (['Escape', 'Enter', ' ', 'z', 'Z', 'a', 'A'].indexOf(e.key) < 0) return;
      e.preventDefault(); e.stopImmediatePropagation();
      if (!e.repeat) finish();
    }
    handle = U.open(box, { label: '搭船旅行', escClose: false, focus: skip, onClose: finish });
    playing = true;
    document.addEventListener('keydown', key, true);
    U.announce(text);
    timer = setTimeout(finish, DURATION);
    return { skip: finish };
  }

  function lines(route, kind, side, who) {
    var to = route[side === 'from' ? 'to' : 'from'];
    var text = route.dialogText[kind].replace(/\{price\}/g, String(route.price)).replace(/\{to\}/g, to.dockLabel);
    return [{ who: who, text: text }];
  }

  /** NPC ferry: {id: 航線ID, side: 'from'|'to'}；只呼叫既有 G.changeMap，不另建場景。 */
  function interact(G, npc, scene) {
    var F = J.Ferry, U = J.UI, st = G.state, spec = npc.ferry;
    if (!st || !spec || G._ferryInteracting || G.blocked() || G.inTrial || G.mapChanging || scene.transitioning || U.blocksMove()) return Promise.resolve();
    var route = F.routes(G.data).filter(function (r) { return r.id === spec.id; })[0], side = spec.side;
    if (!route || (side !== 'from' && side !== 'to') || scene.mapId !== route[side].map) return Promise.resolve();
    F.ensure(st);
    var hasTicket = st.ferry.tickets[route.id] > 0;
    var check = hasTicket ? F.canBoard(st, route, side, G) : F.canBuy(st, route, G);
    function say(kind) { return G.say(route.dialog[kind], lines(route, kind, side, npc.id)); }
    function refuse(result) {
      if (result.reason === 'coins') return say('noMoney');
      if (result.reason === 'locked') return say('locked');
      if (result.reason === 'pending') return G.say(null, [{ who: npc.id, text: '這班船還在準備中喔。' }]);
      if (result.reason === 'direction') U.toast('這張票要留著搭回程喔。');
      return Promise.resolve();
    }
    if (!check.ok) return refuse(check);
    // 資料尚未備妥（例如下船格被擋住）時，不扣錢也不扣票。
    if (F.validate(Object.assign({}, G.data, { ferries: [route] })).length) return refuse({ reason: 'pending' });
    G._ferryInteracting = true;
    function current() { return G.state === st && G.mapScene === scene && scene.mapId === route[side].map; }
    function clearInput() { G.held = {}; G.heldOrder = []; G.joy = { dir: null, force: 0 }; if (scene.p) scene.p.path = []; }
    var work;
    if (!hasTicket) {
      var introId = route.dialog && route.dialog.intro, introDone = !!(route.quest && st.quests && st.quests[route.quest] && st.quests[route.quest].status === 'done');
      work = (introId && !introDone ? G.say(introId, []) : Promise.resolve()).then(function () { return say('buy'); }).then(function () {   // v3.0 第一次先介紹
        if (!current() || G.blocked()) return false;
        return U.confirm('要買來回票嗎？一張 ' + route.price + ' 金幣。', '買來回票', '等一下');
      }).then(function (yes) {
        if (!yes || !current()) return;
        var bought = F.buy(st, route, G.data.items, G);
        if (!bought.ok) return refuse(bought);
        G.save(); G.refreshHud();
        U.toast('船票買好了！再按 A 就能上船。');
      });
    } else {
      work = say('board').then(function () {   // v3.0：過場前的旁白（D_FERRY）
        var cs = route.dialog && route.dialog.cutscene;
        return cs && (G.data.dialogs || {})[cs] ? G.say(cs, []) : null;
      }).then(function () {
        if (!current()) return;
        var ready = F.canBoard(st, route, side, G);
        if (!ready.ok) return refuse(ready);
        return new Promise(function (resolve, reject) {
          G.busy = true; scene.transitioning = true; clearInput();
          function release() { G.busy = false; scene.transitioning = false; clearInput(); }
          try {
            var handle = play({ from: route[side], to: route[side === 'from' ? 'to' : 'from'], routeName: route.name }, function () {
              release();
              if (!current()) { resolve(); return; }
              // 船班掛鉤：過場中不扣票，結束後同步扣票＋換圖，避免中途存檔卡在原岸。
              var latest = F.routes(G.data).filter(function (r) { return r.id === route.id; })[0];
              if (!latest || F.validate(Object.assign({}, G.data, { ferries: [latest] })).length) { resolve(); return; }
              var dest = F.board(st, latest, side, G);
              if (!dest.ok) { resolve(); return; }
              try {
                G.changeMap(dest.map, dest.x, dest.y, 'down');
                G.refreshHud();
                Promise.resolve(say('arrive')).then(resolve, reject);
              } catch (e) { reject(e); }
            });
            if (!handle) { release(); resolve(); }
          } catch (e) { release(); reject(e); }
        });
      });
    }
    return work.then(function (value) { G._ferryInteracting = false; return value; }, function (error) {
      G._ferryInteracting = false;
      throw error;
    });
  }

  J.FerryUI = { play: play, interact: interact };
})();
