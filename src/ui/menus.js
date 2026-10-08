/* 選單：背包與裝備、商店、冒險手帳、旅店、職業公會 */
(function () {
  'use strict';
  var J = window.JQ;
  var SUBJECTS = ['國語', '英語', '數學', '自然', '社會'];
  var TYPE_NAME = { consumable: '消耗品', card: '答題卡', weapon: '武器', armor: '防具', material: '素材', food: '點心', key: '重要物品' };

  function h() { return J.UI.h.apply(null, arguments); }
  function icon(it, id) { return h('span.icon', { html: J.Assets.domIcon(it.sprite || ('item_' + id), { size: 40, label: it.name, alt: '' }) }); }
  function closeBtn(fn) { return h('button.close.ghost', { onclick: fn, 'aria-label': '關閉' }, ['✕ 關閉']); }

  function jobNames(G, jobs) {
    if (!jobs) return '';
    return (Array.isArray(jobs) ? jobs : [jobs]).map(function (j) { return (G.data.jobs[j] || {}).name || j; }).join('、');
  }

  // ---------------------------------------------------------------- 背包與裝備
  function bag(G) {
    var st = G.state, D = G.data;
    var body = h('div');
    var panel = h('div.win.panel', {}, [closeBtnLater(), h('h2', { text: '🎒 背包與裝備' }), body]);
    var handle = J.UI.open(panel, { label: '背包與裝備', onClose: function () { G.refreshHud(); } });
    function closeBtnLater() { return h('button.close.ghost', { onclick: function () { handle.close(); }, 'aria-label': '關閉' }, ['✕ 關閉']); }
    function render() {
      var s = G.stats();
      body.innerHTML = '';
      body.appendChild(h('p', { text: '等級 ' + st.player.level + '　職業：' + s.jobName + (s.favored ? '（拿手科目：' + s.favored + '，傷害 ×' + s.favoredMult + '）' : '') }));
      body.appendChild(h('p', { text: '體力 ' + st.player.hp + '/' + s.maxHp + '　魔力 ' + st.player.mp + '/' + s.maxMp + '　攻擊力 ' + s.atk + '　防禦力 ' + s.def }));
      var w = st.equipment.weapon && D.items[st.equipment.weapon], a = st.equipment.armor && D.items[st.equipment.armor];
      body.appendChild(h('p', { text: '武器：' + (w ? w.name : '（沒有）') + '　防具：' + (a ? a.name : '（沒有）') }));
      body.appendChild(h('p.small', { text: '番薯仔的愛心：' + '❤'.repeat(Math.min(10, st.pet.hearts)) + (st.pet.hearts > 10 ? ' ×' + st.pet.hearts : '') + (st.pet.hearts ? '' : '（還沒有，餵點心試試看）') }));
      var list = h('ul.list');
      var ids = Object.keys(st.inventory).filter(function (id) { return st.inventory[id] > 0; });
      if (!ids.length) list.appendChild(h('li', { text: '背包是空的。' }));
      ids.forEach(function (id) {
        var it = D.items[id] || { name: id, type: 'material', desc: '' };
        var btns = [];
        if ((it.type === 'consumable') && (it.heal > 0 || it.mp > 0)) btns.push(h('button', { onclick: function () { use(id); } }, ['使用']));
        if (id === 'snack' || it.pet > 0) btns.push(h('button', { onclick: function () { feed(); } }, ['餵番薯仔']));
        if (it.type === 'weapon' || it.type === 'armor') {
          var slot = it.type === 'weapon' ? 'weapon' : 'armor';
          if (st.equipment[slot] === id) btns.push(h('button.selected', { onclick: function () { J.Character.unequip(st, slot, D); G.save(); render(); } }, ['已裝備（卸下）']));
          else btns.push(h('button', { onclick: function () { equip(id); } }, ['裝備']));
        }
        var extra = [];
        if (it.atk) extra.push('攻擊力 +' + it.atk);
        if (it.def) extra.push('防禦力 +' + it.def);
        if (it.mpBonus) extra.push('魔力 +' + it.mpBonus);
        if (it.job) extra.push('限 ' + jobNames(G, it.job));
        list.appendChild(h('li', {}, [icon(it, id), h('div.what', {}, [h('b', { text: it.name + ' ×' + st.inventory[id] }), h('div.small', { text: (TYPE_NAME[it.type] || '') + '　' + it.desc + (extra.length ? '（' + extra.join('、') + '）' : '') })])].concat(btns)));
      });
      body.appendChild(h('h3', { text: '道具' }));
      body.appendChild(list);
    }
    function use(id) {
      var r = J.Character.useItem(st, id, D);
      if (!r.ok) { J.UI.toast(r.reason === 'full' ? '體力已經是滿的了！' : '現在不能用。'); return; }
      J.Audio.play('correct'); J.UI.toast('體力回復了 ' + r.healed + ' 點！'); G.save(); render();
    }
    function equip(id) {
      var r = J.Character.equip(st, id, D);
      if (!r.ok) { J.UI.toast(r.reason === 'job' ? '這個只有「' + jobNames(G, r.jobs) + '」能用喔。' : '不能裝備。'); return; }
      J.Audio.play('select'); G.save(); render();
    }
    function feed() { G.feedPet(); render(); }
    render();
  }

  // ---------------------------------------------------------------- 商店
  function shop(G, shopId) {
    var st = G.state, D = G.data;
    var shopInfo = (D.shops && D.shops[shopId]) || { name: { general: '雜貨店', item: '道具店', weapon: '武器店', armor: '防具店' }[shopId] || '商店', items: null };
    var body = h('div');
    var tabBuy = h('button', { role: 'tab', 'aria-selected': 'true', onclick: function () { mode = 'buy'; render(); } }, ['買東西']);
    var tabSell = h('button', { role: 'tab', 'aria-selected': 'false', onclick: function () { mode = 'sell'; render(); } }, ['賣素材']);
    var mode = 'buy';
    var handle;
    var panel = h('div.win.panel', {}, [h('button.close.ghost', { onclick: function () { handle.close(); }, 'aria-label': '關閉' }, ['✕ 關閉']),
      h('h2', { text: '🏪 ' + (shopInfo.name || '商店') }), h('p.small', { text: '只用遊戲裡的金幣買東西，沒有真錢、沒有抽獎。' }), h('div.tabs', { role: 'tablist' }, [tabBuy, tabSell]), body]);
    handle = J.UI.open(panel, { label: shopInfo.name || '商店', onClose: function () { G.refreshHud(); } });
    function render() {
      tabBuy.setAttribute('aria-selected', String(mode === 'buy'));
      tabSell.setAttribute('aria-selected', String(mode === 'sell'));
      body.innerHTML = '';
      body.appendChild(h('p', { text: '你有 🪙 ' + st.player.coins + ' 金幣' }));
      var list = h('ul.list');
      if (mode === 'buy') {
        J.Shop.catalog(shopId, D.items, D.shops ? (function () { var o = {}; Object.keys(D.shops).forEach(function (k) { o[k] = D.shops[k].items; }); return o; })() : null).forEach(function (it) {
          var have = st.inventory[it.id] || 0;
          var info = [];
          if (it.atk) info.push('攻擊力 +' + it.atk);
          if (it.def) info.push('防禦力 +' + it.def);
          if (it.mpBonus) info.push('魔力 +' + it.mpBonus);
          if (it.job) info.push('限 ' + jobNames(G, it.job));
          var b = h('button', { disabled: st.player.coins < it.price, onclick: function () { buy(it.id); } }, ['買（' + it.price + ' 金幣）']);
          list.appendChild(h('li', {}, [icon(it, it.id), h('div.what', {}, [h('b', { text: it.name }), h('span.small', { text: '　已有 ' + have }), h('div.small', { text: it.desc + (info.length ? '（' + info.join('、') + '）' : '') })]), b]));
        });
      } else {
        var mats = Object.keys(st.inventory).filter(function (id) { var it = D.items[id]; return it && it.type === 'material' && it.sell > 0 && st.inventory[id] > 0; });
        if (!mats.length) list.appendChild(h('li', { text: '沒有可以賣的素材。打獵委託需要的素材，記得先留著喔！' }));
        mats.forEach(function (id) {
          var it = D.items[id];
          list.appendChild(h('li', {}, [icon(it, id), h('div.what', {}, [h('b', { text: it.name + ' ×' + st.inventory[id] }), h('div.small', { text: it.desc })]),
            h('button', { onclick: function () { sell(id); } }, ['賣 1 個（' + it.sell + ' 金幣）'])]));
        });
      }
      body.appendChild(list);
    }
    function buy(id) {
      var r = J.Shop.buy(st, id, D.items);
      if (!r.ok) { J.UI.toast(r.reason === 'coins' ? '金幣不夠喔。' : '買不到。'); return; }
      var it = D.items[id];
      if (it.job && it.type === 'weapon') G.rareItem(); else J.Audio.play('chest');   // 職業武器＝珍貴道具
      var cmp = J.Character.compareEquip(st, id, D);
      var change = function (c) {
        var parts = [];
        if (c.before.atk !== c.after.atk) parts.push('攻擊力 ' + c.before.atk + '→' + c.after.atk);
        if (c.before.def !== c.after.def) parts.push('防禦力 ' + c.before.def + '→' + c.after.def);
        if (c.before.maxMp !== c.after.maxMp) parts.push('魔力上限 ' + c.before.maxMp + '→' + c.after.maxMp);
        return parts.join('、');
      };
      if (cmp.slot && cmp.canEquip && !cmp.current) {
        // 裝備欄是空的：直接換上
        J.Character.equip(st, id, D);
        J.UI.toast('買了' + it.name + '，已經裝備上了！' + (change(cmp) ? '（' + change(cmp) + '）' : ''), 4000);
      } else if (cmp.slot && cmp.canEquip && cmp.better) {
        // v0.9：比身上的更好 → 問要不要換上（大按鈕），並比較攻擊力、防禦力
        var cur = D.items[cmp.current] || { name: '身上的裝備' };
        G.save(); G.refreshHud(); render();
        J.UI.confirm('買了' + it.name + '！要換上嗎？（' + cur.name + ' → ' + it.name + '：' + change(cmp) + '）', '換上', '先不要').then(function (yes) {
          if (yes) {
            J.Character.equip(st, id, D);
            J.Audio.play('select');
            J.UI.toast('已經換上' + it.name + '！' + change(cmp), 4000);
          }
          G.save(); G.refreshHud(); render();
        });
        return;
      } else if (cmp.slot && !cmp.canEquip && cmp.reason === 'job') {
        J.UI.toast('買了' + it.name + '！（這是轉職後的職業專用裝備，轉職後到背包裝備）', 4500);
      } else J.UI.toast('買了' + it.name + '！');
      G.save(); G.refreshHud(); render();
    }
    function sell(id) {
      var it = D.items[id];
      if (!J.Character.removeItem(st, id, 1)) return;
      st.player.coins += it.sell;
      J.Audio.play('select'); G.save(); G.refreshHud(); render();
    }
    render();
  }

  // ---------------------------------------------------------------- 冒險手帳
  function journal(G) {
    var st = G.state, D = G.data;
    var tab = (arguments[1] && arguments[1].tab) || 'quests';
    var body = h('div');
    var tabs = h('div.tabs', { role: 'tablist' });
    var handle;
    [['quests', '委託'], ['book', '怪物名冊'], ['lights', '五道光'], ['study', '學習紀錄'], ['daily', '每日小任務']].forEach(function (t) {
      tabs.appendChild(h('button', { role: 'tab', 'data-tab': t[0], onclick: function () { tab = t[0]; render(); } }, [t[1]]));
    });
    var panel = h('div.win.panel', {}, [h('button.close.ghost', { onclick: function () { handle.close(); }, 'aria-label': '關閉' }, ['✕ 關閉']), h('h2', { text: '📔 冒險手帳' }), tabs, body]);
    handle = J.UI.open(panel, { label: '冒險手帳' });
    // ---------- 怪物名冊：遇見過的顯示圖、名稱、出沒地區、叫聲、打倒次數；沒遇見顯示剪影「？？？」
    function renderBook() {
      var c = J.Bestiary.counts(st, D.monsters);
      body.appendChild(h('p', { text: '遇見 ' + c.seen + '／' + c.total + ' 種・小怪各打倒 3 次：' + c.mobsDefeated3 + '／' + c.mobs + '・頭目：' + c.bossesDefeated + '／' + c.bosses }));
      var rw = h('ul.list.book-rewards', { 'aria-label': '收集獎勵' });
      J.Bestiary.rewards(st, D.monsters).forEach(function (r) {
        var label = [];
        if (r.reward.gold) label.push('金幣 ' + r.reward.gold);
        if (r.reward.item) label.push((D.items[r.reward.item] || {}).name + ' ×' + (r.reward.n || 1));
        if (r.reward.title) label.push('稱號「' + r.reward.title + '」');
        if (r.reward.sticker) label.push(J.Bestiary.STICKER_NAME[r.reward.sticker] || '貼紙');
        var btn = r.claimed ? h('button.selected', { disabled: true }, ['已領取']) :
          h('button' + (r.ready ? '.primary' : ''), { disabled: !r.ready, onclick: function () { claim(r.id); } }, [r.ready ? '領獎' : (r.have + '／' + r.need)]);
        rw.appendChild(h('li', {}, [h('div.what', {}, [h('b', { text: r.text }), h('div.small', { text: '獎勵：' + label.join('、') })]), btn]));
      });
      body.appendChild(h('h3', { text: '收集獎勵' }));
      body.appendChild(rw);
      var V = (window.VOICES && window.VOICES.monsters) || {};
      var grid = h('ul.list.book', { 'aria-label': '怪物名冊' });
      J.Bestiary.split(D.monsters).all.forEach(function (id) {
        var m = D.monsters[id], r = (st.bestiary || {})[id] || { seen: 0, defeated: 0 };
        var known = r.seen > 0;
        var icon = h('span.icon.book-icon' + (known ? '' : '.unknown'), { html: J.Assets.domIcon(m.sprite, { size: 56, label: known ? m.name : '?', alt: '' }) });
        var where = J.Bestiary.habitats(id, D.maps);
        grid.appendChild(h('li', {}, [icon, h('div.what', {}, known ? [
          h('b', { text: m.name + (m.boss ? '（頭目）' : '') + '　等級 ' + m.level }),
          h('div.small', { text: '出沒：' + (where.join('、') || '—') + (V[id] && V[id].cry ? '　叫聲：「' + V[id].cry + '」' : '') }),
          h('div.small', { text: '遇見 ' + r.seen + ' 次・打倒 ' + r.defeated + ' 次' })
        ] : [h('b', { text: '？？？' }), h('div.small', { text: '還沒遇見過。' + (where.length ? '聽說在「' + where[0] + '」出沒。' : '') })])]));
      });
      body.appendChild(h('h3', { text: '名冊' }));
      body.appendChild(grid);
      var titles = st.titles || [];
      if (titles.length) {
        var row = h('div.row', { role: 'radiogroup', 'aria-label': '稱號' });
        [''].concat(titles).forEach(function (t) {
          row.appendChild(h('button', { role: 'radio', 'aria-checked': String((st.player.title || '') === t), 'aria-pressed': String((st.player.title || '') === t), onclick: function () { st.player.title = t; G.save(); G.refreshHud(); render(); } }, [t || '不戴稱號']));
        });
        body.appendChild(h('h3', { text: '稱號（顯示在名字旁）' }));
        body.appendChild(row);
      }
    }
    function claim(id) {
      var r = J.Bestiary.claim(st, D.monsters, id);
      if (!r.ok) return;
      G.rareItem();   // 名冊獎勵＝珍貴道具短曲 rare_item
      var rw = r.reward, msg = [];
      if (rw.gold) msg.push('金幣 +' + rw.gold);
      if (rw.item) msg.push('得到「' + (D.items[rw.item] || {}).name + '」×' + (rw.n || 1));
      if (rw.title) msg.push('稱號「' + rw.title + '」');
      if (rw.sticker) msg.push('得到「' + (J.Bestiary.STICKER_NAME[rw.sticker] || '貼紙') + '」');
      J.UI.banner('名冊獎勵：' + msg.join('、'));
      G.save(); G.refreshHud(); render();
    }
    function render() {
      Array.prototype.forEach.call(tabs.children, function (b) { b.setAttribute('aria-selected', String(b.dataset.tab === tab)); });
      body.innerHTML = '';
      if (tab === 'quests') {
        var j = J.QuestLog.journal(st, D.quests, D);
        body.appendChild(h('h3', { text: '進行中（' + j.active.length + '）' }));
        var a = h('ul.list');
        if (!j.active.length) a.appendChild(h('li', { text: '目前沒有進行中的委託。找頭上有「！」的人說話吧！' }));
        j.active.forEach(function (q) {
          var mapName = D.maps[q.map] ? D.maps[q.map].name : '';
          a.appendChild(h('li', {}, [h('div.what', {}, [h('b', { text: (q.side ? '【支線】' : '【主線】') + q.title + (mapName ? '（' + mapName + '）' : '') }),
            h('div', { text: '目標：' + (q.goal || '') }), h('div.small', { text: '進度：' + q.objective + (q.ready ? '　✅ 可以回報了！' : '') })])]));
        });
        body.appendChild(a);
        body.appendChild(h('h3', { text: '已完成（' + j.done.length + '）' }));
        var d = h('ul.list');
        j.done.slice().reverse().forEach(function (q, i) {
          d.appendChild(h('li', {}, [h('div.what', {}, [h('b', { text: '✔ ' + q.title }), i === 0 && q.next ? h('div.small', { text: '下一步：' + q.next }) : null])]));
        });
        if (!j.done.length) d.appendChild(h('li', { text: '還沒有完成的委託。' }));
        body.appendChild(d);
      } else if (tab === 'lights') {
        body.appendChild(h('p', { text: '打倒被霧附身的頭目，就能拿回五道光；回到' + G.lampMapName() + '，就能點亮五盞知識燈。' }));
        var l1 = h('div.lights', { 'aria-label': '拿回的光' });
        SUBJECTS.forEach(function (s) { l1.appendChild(h('span' + (st.lights[s] ? '.on' : ''), { text: (st.lights[s] ? '✦ ' : '・ ') + s + '之光' })); });
        body.appendChild(h('h3', { text: '拿回的光' })); body.appendChild(l1);
        var l2 = h('div.lights', { 'aria-label': '點亮的燈' });
        SUBJECTS.forEach(function (s) { l2.appendChild(h('span' + (st.lamps[s] ? '.on' : ''), { text: (st.lamps[s] ? '🏮 ' : '・ ') + s + '燈' })); });
        body.appendChild(h('h3', { text: G.lampMapName() + '的知識燈' })); body.appendChild(l2);
        var bosses = Object.keys(st.bosses).filter(function (k) { return st.bosses[k]; });
        var bk = (st.stickers || []).filter(function (x) { return J.Bestiary.STICKER_NAME[x]; });
        if (bk.length) { body.appendChild(h('h3', { text: '貼紙' })); body.appendChild(h('div.lights', {}, bk.map(function (x) { return h('span.on', { text: '⭐ ' + J.Bestiary.STICKER_NAME[x] }); }))); }
        body.appendChild(h('h3', { text: '清醒過來的頭目' }));
        body.appendChild(h('p', { text: bosses.length ? bosses.map(function (b) { return (D.monsters[b] || {}).name || b; }).join('、') : '還沒有。' }));
      } else if (tab === 'book') {
        renderBook();
      } else if (tab === 'study') {
        var t = h('table.report');
        t.appendChild(h('tr', {}, [h('th', { text: '科目' }), h('th', { text: '答對題數' }), h('th', { text: '一次就答對' })]));
        SUBJECTS.forEach(function (s) {
          var x = st.stats.subjects[s] || { done: 0, firstTry: 0 };
          t.appendChild(h('tr', {}, [h('td', { text: s }), h('td', { text: String(x.done) }), h('td', { text: String(x.firstTry) })]));
        });
        body.appendChild(t);
        body.appendChild(h('p.small', { text: '打倒怪物 ' + (st.stats.battles.won || 0) + ' 次・開過寶箱 ' + Object.keys(st.chests).length + ' 個・冒險 ' + (st.daily.adventureDays || 0) + ' 天' }));
      } else {
        var dl = h('ul.list');
        (st.daily.tasks || []).forEach(function (tk) {
          dl.appendChild(h('li', {}, [h('div.what', {}, [h('b', { text: (tk.done ? '✅ ' : '⬜ ') + tk.text }), h('div.small', { text: '進度 ' + tk.progress + '/' + tk.target + '　獎勵 ' + tk.reward + ' 金幣' })])]));
        });
        body.appendChild(dl);
        body.appendChild(h('p.small', { text: '每天換新任務。只記「累計冒險天數」，沒來玩也不會歸零。' }));
      }
    }
    render();
  }

  // ---------------------------------------------------------------- 旅店
  function inn(G, mapId, innInfo) {
    var price = innInfo && innInfo.price ? innInfo.price : 0;
    return J.UI.confirm('要在旅店休息嗎？體力和魔力會全部回滿。' + (price ? '（' + price + ' 金幣）' : '（免費）'), '休息', '先不用').then(function (yes) {
      if (!yes) return false;
      if (price && G.state.player.coins < price) { J.UI.toast('金幣不夠喔。'); return false; }
      G.state.player.coins -= price;
      J.Character.rest(G.state, G.data);   // 音樂（旅店短曲）由 G.innRest 播
      J.UI.banner('體力和魔力都回滿了！');
      G.save(); G.refreshHud();
      return true;
    });
  }

  // ---------------------------------------------------------------- 職業公會
  function guild(G) {
    var st = G.state, D = G.data;
    var handle;
    var body = h('div');
    var panel = h('div.win.panel', {}, [h('button.close.ghost', { onclick: function () { handle.close(); }, 'aria-label': '關閉' }, ['✕ 關閉']), h('h2', { text: '⚔️ 職業公會' }), body]);
    handle = J.UI.open(panel, { label: '職業公會', onClose: function () { G.refreshHud(); } });
    function render() {
      body.innerHTML = '';
      body.appendChild(h('p', { text: '到 ' + ((D.jobRules && D.jobRules.unlock_level) || 5) + ' 級就能轉職，之後可以免費換職業。職業只改變戰鬥方式和外觀，所有委託一樣要五科都學喔！' }));
      var list = h('ul.list');
      Object.keys(D.jobs).forEach(function (id) {
        var j = D.jobs[id];
        var c = J.Character.canChangeJob(st, id, D);
        var cur = st.player.job === id;
        var btn = cur ? h('button.selected', { disabled: true }, ['目前的職業']) :
          h('button', { disabled: !c.ok, onclick: function () { change(id); } }, [c.ok ? '轉職' : (c.reason === 'level' ? '需要 ' + c.need + ' 級' : '不能轉')]);
        var key = J.Assets.heroKey(st.player.gender, id);
        list.appendChild(h('li', {}, [h('span.icon', { html: J.Assets.domIcon(key, { size: 40, label: j.name, alt: '' }) }), h('div.what', {}, [
          h('b', { text: j.name }), h('span.small', { text: j.favored ? '　拿手科目：' + j.favored : '' }),
          h('div.small', { text: (j.desc || '') + (j.skill ? '　技能「' + j.skill.name + '」（魔力 ' + j.skill.mp + '）：' + (j.skill.desc || '') : '') })]), btn]));
      });
      body.appendChild(list);
    }
    function change(id) {
      var r = J.Character.changeJob(st, id, D);
      if (!r.ok) return;
      J.Audio.play('levelup');
      J.UI.banner('轉職成「' + D.jobs[id].name + '」了！');
      G.onJobChanged();
      G.save(); render();
    }
    render();
  }

  window.JQ = window.JQ || {};
  // ---------------------------------------------------------------- 任務列表（HUD「任務」按鈕）
  function questList(G) {
    var st = G.state, D = G.data, handle;
    var j = J.QuestLog.journal(st, D.quests, D);
    var mapName = function (id) { return D.maps[id] ? D.maps[id].name : ''; };
    var act = h('ul.list', { 'aria-label': '進行中的委託' });
    if (!j.active.length) act.appendChild(h('li', { text: '目前沒有進行中的委託。找頭上有「！」的人說話吧！' }));
    j.active.forEach(function (q) {
      act.appendChild(h('li', {}, [h('div.what', {}, [
        h('b', { text: (q.side ? '【支線】' : '【主線】') + q.title }),
        h('div', { text: '📍 地點：' + (mapName(q.map) || '—') }),
        h('div', { text: '🎯 目標：' + (q.goal || '') }),
        h('div.small', { text: '進度：' + q.objective + (q.ready ? '　✅ 可以回報了！' : '') }),
        q.next ? h('div.small', { text: '➡️ 完成後：' + q.next }) : null
      ])]));
    });
    var doneList = h('ul.list', { 'aria-label': '已完成的委託' });
    j.done.slice().reverse().forEach(function (q) { doneList.appendChild(h('li', {}, [h('div.what', {}, [h('b', { text: '✔ ' + q.title }), h('span.small', { text: mapName(q.map) ? '（' + mapName(q.map) + '）' : '' })])])); });
    if (!j.done.length) doneList.appendChild(h('li', { text: '還沒有完成的委託。' }));
    var details = h('details.done-quests', {}, [h('summary', { text: '已完成（' + j.done.length + '）— 點一下展開' }), doneList]);
    var panel = h('div.win.panel', {}, [h('button.close.ghost', { onclick: function () { handle.close(); }, 'aria-label': '關閉' }, ['✕ 關閉']),
      h('h2', { text: '📜 任務列表' }), h('h3', { text: '進行中（' + j.active.length + '）' }), act, details]);
    handle = J.UI.open(panel, { label: '任務列表' });
    return handle;
  }

  window.JQ.Menus = { bag: bag, shop: shop, journal: journal, inn: inn, guild: guild, questList: questList };
})();
