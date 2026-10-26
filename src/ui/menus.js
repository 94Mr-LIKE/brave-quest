/* 選單：背包與裝備、商店、冒險手帳、旅店、職業公會 */
(function () {
  'use strict';
  var J = window.JQ;
  var SUBJECTS = ['國語', '英語', '數學', '自然', '社會'];
  var TYPE_NAME = { consumable: '消耗品', card: '答題卡', weapon: '武器', armor: '防具', material: '素材', food: '點心', key: '重要物品' };

  function h() { return J.UI.h.apply(null, arguments); }
  function icon(it, id) { return h('span.icon', { html: J.Assets.domIcon(it.sprite || ('item_' + id), { size: 40, label: it.name, alt: '' }) }); }
  function closeBtn(fn) { return h('button.close.ghost', { onclick: fn, 'aria-label': '關閉' }, ['✕ 關閉']); }

  /** 誰能用（48 號 3.5）：通用「大家都能用」、專屬武器「○○專用」、其他列出能用的職業 */
  function whoCan(G, it) {
    var jobs = J.Character.usableJobs(it, G.data);
    if (jobs === null) return '大家都能用';
    var open = (G.data.jobRules && G.data.jobRules.open_jobs) || null;
    if (open) jobs = jobs.filter(function (j) { return open.indexOf(j) >= 0; });
    if (it.job) return jobNames(G, jobs) + '專用';
    return jobNames(G, jobs) + '能用';
  }
  /** 能用的職業頭像（通用不畫） */
  /** 說明文字裡已經寫了誰能用（items.js 的 desc 多半有「○○專用」「大家都能用」）就不再重複 */
  function whoCanText(G, it) { var d = it.desc || ''; return /專用|能用|能穿/.test(d) ? '' : whoCan(G, it); }
  function jobFaces(G, it) {
    var jobs = J.Character.usableJobs(it, G.data), open = (G.data.jobRules && G.data.jobRules.open_jobs) || null;
    if (!jobs) return null;
    if (open) jobs = jobs.filter(function (j) { return open.indexOf(j) >= 0; });
    return h('span.shop-jobs', { 'aria-hidden': 'true' }, jobs.map(function (j) { return h('span.icon', { html: J.Assets.domIcon(J.Assets.heroKey(G.state.player.gender, j), { size: 24, label: (G.data.jobs[j] || {}).name, alt: '' }) }); }));
  }

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
      // v1.0（48 號 2.1、B7）：力量＝能力的攻擊（不含武器）、物攻＝力量＋武器攻擊，兩個都顯示
      body.appendChild(h('p.status-line', { text: '體力 ' + st.player.hp + '/' + s.maxHp + '　魔力 ' + st.player.mp + '/' + s.maxMp + '　力量 ' + s.power + '　物攻 ' + s.atk + '　防禦力 ' + s.def +
        (s.dmgMult > 1 ? '　（武器特效：攻擊傷害 +' + Math.round((s.dmgMult - 1) * 100) + '%）' : '') }));
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
        if (it.atk) extra.push('攻擊 +' + it.atk);
        if (it.def) extra.push('防禦力 +' + it.def);
        if (it.mpBonus) extra.push('魔力 +' + it.mpBonus);
        if ((it.type === 'weapon' || it.type === 'armor') && whoCanText(G, it)) extra.push(whoCanText(G, it));
        if (it.fx_desc) extra.push('特效：' + it.fx_desc);
        list.appendChild(h('li', {}, [icon(it, id), h('div.what', {}, [h('b', { text: it.name + ' ×' + st.inventory[id] }), h('div.small', { text: (TYPE_NAME[it.type] || '') + '　' + it.desc + (extra.length ? '（' + extra.join('、') + '）' : '') })])].concat(btns)));
      });
      body.appendChild(skillSlots());
      body.appendChild(h('h3', { text: '道具' }));
      body.appendChild(list);
    }
    /** v1.0（48 號 2.6、F8）技能欄 4 格：從學會的技能裡挑；沒挑過＝最新學會的 4 個（現在職業的優先） */
    function skillSlots() {
      var s = G.stats(), box = h('div.skill-slots');
      box.appendChild(h('h3', { text: '✨ 技能欄（' + s.skills.length + '／4）' }));
      if (!s.learned.length) { box.appendChild(h('p.small', { text: '見習冒險者 Lv4 會學到第一個技能。' })); return box; }
      box.appendChild(h('p.small', { text: '戰鬥時只能用技能欄裡的 4 個。點一下放進去或拿出來。' }));
      var on = {}; s.skills.forEach(function (k) { on[k.id] = 1; });
      var row = h('div.row.skill-pick');
      s.learned.forEach(function (k) {
        row.appendChild(h('button' + (on[k.id] ? '.selected' : ''), { 'data-skill': k.id, 'aria-pressed': String(!!on[k.id]), title: k.desc,
          onclick: function () {
            var ids = s.skills.map(function (x) { return x.id; });
            if (on[k.id]) ids = ids.filter(function (x) { return x !== k.id; });
            else if (ids.length >= 4) { J.UI.toast('技能欄滿了（4 個），先拿掉一個。'); return; }
            else ids.push(k.id);
            J.Character.setSkillSlots(st, D, ids); G.save(); render();
          } }, [(J.SkillFx ? J.SkillFx.icon(k) + ' ' : '') + k.name + '（' + (D.jobs[k.job] || {}).name + '・魔力 ' + k.mp + '）']));
      });
      box.appendChild(row);
      if (Array.isArray(st.player.skillSlots)) box.appendChild(h('button.ghost', { onclick: function () { st.player.skillSlots = null; G.save(); render(); } }, ['回到預設（最新的 4 個）']));
      return box;
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
    var tabSell = h('button', { role: 'tab', 'aria-selected': 'false', onclick: function () { mode = 'sell'; render(); } }, ['賣東西']);
    var mode = 'buy', show = 'mine';   // v1.0（48 號 3.5）：預設只列「現在能用的＋通用」，另有「全部」
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
        var cat = J.Shop.forOpenJobs(J.Shop.catalog(shopId, D.items, D.shops ? (function () { var o = {}; Object.keys(D.shops).forEach(function (k) { o[k] = D.shops[k].items; }); return o; })() : null), D);
        var equipShop = cat.some(function (it) { return it.type === 'weapon' || it.type === 'armor'; });
        if (equipShop) {
          var canUse = function (it) { return (it.type !== 'weapon' && it.type !== 'armor') || J.Character.usable(it, st.player.job, D); };
          var nAll = cat.length, mine = cat.filter(canUse);
          body.appendChild(h('div.tabs.shop-tabs', { role: 'tablist' }, [
            h('button', { role: 'tab', 'data-show': 'mine', 'aria-selected': String(show === 'mine'), onclick: function () { show = 'mine'; render(); } }, ['現在能用的＋通用（' + mine.length + '）']),
            h('button', { role: 'tab', 'data-show': 'all', 'aria-selected': String(show === 'all'), onclick: function () { show = 'all'; render(); } }, ['全部（' + nAll + '）'])]));
          if (cat.some(function (it) { return it.type === 'weapon'; })) body.appendChild(h('p.small', { text: '劍士的力量最大；其他職業有自己的專屬武器幫忙（特效讓攻擊傷害變高）。' }));
          if (show === 'mine') cat = mine;
        }
        // v0.9.4（40 號）：有買不起的東西時，在清單上方提醒怎麼存錢
        if (cat.some(function (it) { return J.Shop.shortfall(st, it.price) > 0; })) body.appendChild(h('p.small.shop-broke', { text: '錢不夠喔！去打幾隻怪物、完成委託，就能存到錢。' }));
        cat.forEach(function (it) {
          var have = st.inventory[it.id] || 0;
          var info = [];
          if (it.atk) info.push('攻擊 +' + it.atk);
          if (it.def) info.push('防禦力 +' + it.def);
          if (it.mpBonus) info.push('魔力 +' + it.mpBonus);
          var gearItem = it.type === 'weapon' || it.type === 'armor';
          var cant = gearItem && !J.Character.usable(it, st.player.job, D);
          var fxNote = it.fx_desc ? h('div.small.fx-note', { text: '特效：' + it.fx_desc }) : null;
          var tip = st.player.job === 'novice' && it.id === 'cloak' ? h('div.small', { text: '轉職以後會有更適合的防具喔。' }) : null;
          var short = J.Shop.shortfall(st, it.price);   // v0.9.4 買不起時寫「還差 N 金幣」
          var b = h('button', { disabled: short > 0, onclick: function () { if (cant) confirmBuy(it); else buy(it.id); } }, [short > 0 ? '還差 ' + short + ' 金幣' : '買（' + it.price + ' 金幣）']);
          if (short > 0) b.setAttribute('aria-label', it.name + '：' + it.price + ' 金幣，還差 ' + short + ' 金幣');
          list.appendChild(h('li' + (cant ? '.cant-use' : ''), { 'data-id': it.id }, [icon(it, it.id), h('div.what', {}, [h('b', { text: it.name }), h('span.small', { text: '　已有 ' + have }),
            gearItem ? jobFaces(G, it) : null,
            h('div.small', { text: (gearItem && whoCanText(G, it) ? whoCanText(G, it) + '　' : '') + it.desc + (info.length ? '（' + info.join('、') + '）' : '') }), fxNote, tip]), b]));
        });
      } else {
        // v0.9.2：裝備原價 50%、道具 25%（無條件捨去）；任務素材、重要任務道具、一開始拿到的不能賣；身上正在用的要先卸下
        body.appendChild(h('p.small', { text: '裝備用原價的一半收購，道具用原價的四分之一。任務素材、重要任務道具和一開始拿到的東西不能賣；身上正在用的要先卸下。' }));
        var rows = J.Shop.sellList(st, D.items, D.quests);
        if (!rows.length) list.appendChild(h('li', { text: '背包裡沒有可以賣的東西。' }));
        var WHY = { material: '任務素材，不能賣', equipped: '正在裝備中，先到背包卸下才能賣', quest: '重要道具（珍貴的紀念），不能賣', start: '一開始拿到的，不能賣', free: '這個不能賣' };
        rows.forEach(function (r) {
          var it = r.item;
          var note = r.ok ? (r.count < r.have ? '（可以賣 ' + r.count + ' 個' + (r.start ? '；一開始拿到的 ' + r.start + ' 個不能賣' : '') + (r.equipped ? '；身上正在用 1 個' : '') + '）' : '') : WHY[r.reason];
          list.appendChild(h('li.sell-row', { 'data-id': r.id }, [icon(it, r.id), h('div.what', {}, [h('b', { text: it.name + ' ×' + r.have + (r.equipped ? '（裝備中）' : '') }),
            h('div.small', { text: note || it.desc })]),
            h('button', { disabled: !r.ok, onclick: function () { sell(r.id); } }, [r.ok ? '賣 1 個（' + r.price + ' 金幣）' : '不能賣'])]));
        });
      }
      body.appendChild(list);
    }
    /** 現在的職業不能用的裝備：可以買，買前確認（48 號 3.5） */
    function confirmBuy(it) {
      J.UI.confirm('「' + it.name + '」' + whoCan(G, it) + '，現在的職業（' + G.stats().jobName + '）不能用。還是要買嗎？', '要買', '不買').then(function (yes) { if (yes) buy(it.id); });
    }
    function buy(id) {
      var r = J.Shop.buy(st, id, D.items);
      if (!r.ok) { J.UI.toast(r.reason === 'coins' ? '還差 ' + r.short + ' 金幣喔！去打幾隻怪物、完成委託，就能存到錢。' : '買不到。', 4500); return; }
      var it = D.items[id];
      if (it.job && it.type === 'weapon') G.rareItem(); else J.Audio.play('chest');   // 職業武器＝珍貴道具
      var cmp = J.Character.compareEquip(st, id, D);
      var change = function (c) {
        var parts = [];
        if (c.before.atk !== c.after.atk) parts.push('物攻 ' + c.before.atk + '→' + c.after.atk);
        if (c.before.dmgMult !== c.after.dmgMult) parts.push('攻擊傷害 ' + (c.after.dmgMult > c.before.dmgMult ? '+' : '') + Math.round((c.after.dmgMult - c.before.dmgMult) * 100) + '%');
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
      var it = D.items[id], price = J.Shop.sellPrice(it);
      J.UI.confirm('要把「' + it.name + '」賣掉 1 個嗎？可以拿到 ' + price + ' 金幣。', '賣掉', '不要').then(function (yes) {
        if (!yes) return;
        var r = J.Shop.sell(st, id, D.items, D.quests);
        if (!r.ok) { J.UI.toast({ equipped: '正在裝備中，先卸下才能賣。', quest: '這是重要任務道具，不能賣。', material: '這是任務素材，不能賣。', start: '這是一開始拿到的，不能賣。' }[r.reason] || '這個不能賣。'); render(); return; }
        J.Audio.play('select');
        J.UI.toast('賣掉了「' + it.name + '」，拿到 ' + r.price + ' 金幣！');
        G.save(); G.refreshHud(); render();
      });
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
    [['quests', '委託'], ['book', '怪物名冊'], ['proverbs', '諺語'], ['lights', '五道光'], ['study', '學習紀錄'], ['daily', '每日小任務']].forEach(function (t) {
      tabs.appendChild(h('button', { role: 'tab', 'data-tab': t[0], onclick: function () { tab = t[0]; render(); } }, [t[1]]));
    });
    var panel = h('div.win.panel', {}, [h('button.close.ghost', { onclick: function () { handle.close(); }, 'aria-label': '關閉' }, ['✕ 關閉']), h('h2', { text: '📔 冒險手帳' }), tabs, body]);
    handle = J.UI.open(panel, { label: '冒險手帳' });
    // ---------- 怪物名冊：遇見過的顯示圖、名稱、出沒地區、叫聲、打倒次數；沒遇見顯示剪影「？？？」
    function renderBook() {
      var c = J.Bestiary.counts(st, D.monsters, D.maps);   // v0.9.3 只算至少出現在一張地圖的怪物
      body.appendChild(h('p', { text: '遇見 ' + c.seen + '／' + c.total + ' 種・小怪各打倒 3 次：' + c.mobsDefeated3 + '／' + c.mobs + '・頭目：' + c.bossesDefeated + '／' + c.bosses }));
      var rw = h('ul.list.book-rewards', { 'aria-label': '收集獎勵' });
      J.Bestiary.rewards(st, D.monsters, D.maps).forEach(function (r) {
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
      J.Bestiary.split(D.monsters, D.maps).all.forEach(function (id) {
        var m = J.Ch3Migrate ? J.Ch3Migrate.displayMonster(st, D.monsters[id]) : D.monsters[id], r = (st.bestiary || {})[id] || { seen: 0, defeated: 0 };   // v1.3 舊紅樹林旗標
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
    // ---------- v1.3.1 台語氣象諺語：收集到幾句；每句的台語（漢字、台羅）、華語、番薯仔的解釋、民間說法／傳說標記、挑錯關卡的進度
    function renderProverbs() {
      var PVL = window.PROVERBS || [], PQL = window.PROVERB_QUIZ || [], n = J.Proverbs.progress(st, PVL, PQL);
      body.appendChild(h('p', { text: '收集到 ' + n.got + '／' + n.total + ' 句台語諺語・挑錯 ' + n.solved + '／' + n.quizzes + ' 關。和各地的阿伯說話就能收集。' }));
      var ul = h('ul.list.proverbs', { 'aria-label': '台語諺語' });
      PVL.forEach(function (p) {
        var mp = (D.maps[p.map] || {}).name || p.map, who = G.speaker(p.npc).name;
        if (!J.Proverbs.has(st, p.id)) { ul.appendChild(h('li', {}, [h('div.what', {}, [h('b', { text: '？？？' }), h('div.small', { text: '聽說「' + mp + '」的' + who + '知道一句和天氣有關的話。' })])])); return; }
        var q = J.Proverbs.quizOf(p.id, PQL), kind = p.kind === '經驗' ? '' : '【' + J.Proverbs.kindLabel(p.kind) + '】';
        ul.appendChild(h('li', {}, [h('div.what', {}, [
          h('b', { text: p.hanji, lang: 'nan-Hant-TW' }),
          kind ? h('div.small.pv-kind', { text: kind }) : h('span'),
          h('div.small', { text: p.tailo }),
          h('div', { text: '華語：' + p.huayu }),
          h('div.small', { text: '番薯仔：' + J.Proverbs.explain(p, D.dialogs) }),
          h('div.small', { text: mp + '・' + who + (q ? (J.Proverbs.solved(st, q.id) ? '・挑錯 ✅' : '・挑錯：再找' + who + '說話') : '') })
        ])]));
      });
      body.appendChild(ul);
      body.appendChild(h('p.small', { text: '民間說法、民間傳說是老一輩流傳的話，不是天氣預報；要知道天氣，請看氣象預報。' }));
    }
    function claim(id) {
      var r = J.Bestiary.claim(st, D.monsters, id, D.maps);
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
        // v1.4 桃竹章（63 號 4.3）：曙光碎片（打倒各地區的霧將拿到；有一片以上才顯示）
        var ds = J.QuestLog.dawnShards ? J.QuestLog.dawnShards(st, D.items) : { have: 0, total: 4 };
        if (ds.have) { body.appendChild(h('h3', { text: '曙光碎片' })); body.appendChild(h('div.lights.dawn-shards', {}, [h('span.on', { text: '✧ 曙光碎片 ' + ds.have + '／' + ds.total })])); }
        var bosses = Object.keys(st.bosses).filter(function (k) { return st.bosses[k]; });
        var bk = (st.stickers || []).filter(function (x) { return J.Bestiary.STICKER_NAME[x]; });
        if (bk.length) { body.appendChild(h('h3', { text: '貼紙' })); body.appendChild(h('div.lights', {}, bk.map(function (x) { return h('span.on', { text: '⭐ ' + J.Bestiary.STICKER_NAME[x] }); }))); }
        body.appendChild(h('h3', { text: '清醒過來的頭目' }));
        body.appendChild(h('p', { text: bosses.length ? bosses.map(function (b) { return (D.monsters[b] || {}).name || b; }).join('、') : '還沒有。' }));
      } else if (tab === 'proverbs') {
        renderProverbs();
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
  /**
   * v0.9.4（老闆 2026-10-10 D23、40 號）住旅店要收費。金幣不夠時：金包里溫泉旅館（inn.freeIfBroke）免費住、每次都可以；
   * 其他旅店老闆說「金幣不夠喔！可以回金包里的溫泉旅館休息，或去打幾隻怪物存錢。」（inn.dialog_nocoin 台詞），不能住。金包里溫泉旅館免費住時也先播 inn.dialog_nocoin（D_INN_FREE）。
   * 回傳 Promise：true＝住了（G.innRest 播短曲）；G.lastInnStay 記下結果（'pay'／'free'／'refuse'，測試用）
   */
  function inn(G, mapId, innInfo, npcId) {
    var st = G.state, name = (innInfo && innInfo.name) || '旅店';
    var stay = J.Shop.innStay(st, innInfo || {});
    G.lastInnStay = stay;
    // v1.2（61 號 2.8）有泡溫泉的旅館（inn.bath）：先選「住一晚」或「泡溫泉」（住不起但泡得起也可以選）；選住一晚再走原本的流程
    var bp = innInfo && innInfo.bath && !innInfo.__stayOnly ? J.Shop.bathStay(st, innInfo) : null;
    if (bp && (stay.action !== 'refuse' || bp.action === 'pay')) {
      return J.UI.choose('要在' + name + '住一晚，還是' + String(innInfo.bath.label || '♨️ 泡溫泉').replace(/^♨️\s*/, '') + '呢？你現在有 ' + st.player.coins + ' 金幣。', [
        { value: 'stay', text: '🛏️ 住一晚（' + stay.price + ' 金幣）', primary: true },
        { value: 'bath', text: (innInfo.bath.label || '♨️ 泡溫泉') + '（' + bp.price + ' 金幣）' }
      ]).then(function (v) {
        G.lastInnChoice = v;   // 測試用
        if (v === 'stay') return inn(G, mapId, Object.assign({}, innInfo, { __stayOnly: true }), npcId);
        if (v === 'bath') return bath(G, innInfo, npcId);
        return false;
      });
    }
    if (stay.action === 'refuse') {
      return G.say(innInfo && innInfo.dialog_nocoin, [{ who: npcId || '__inn', text: '金幣不夠喔！可以回金包里的溫泉旅館休息，或去打幾隻怪物存錢。' }]).then(function () { return false; });
    }
    var q = stay.action === 'free'
      ? '要在' + name + '住一晚嗎？住一晚要 ' + stay.price + ' 金幣，你現在有 ' + st.player.coins + ' 金幣。'
      : '要在' + name + '住一晚嗎？體力和魔力會全部回滿。' + (stay.price ? '（' + stay.price + ' 金幣）' : '（免費）');
    return J.UI.confirm(q, stay.action === 'free' ? '拜託老闆' : '住一晚', '先不用').then(function (yes) {
      if (!yes) return false;
      var paid = J.Shop.payInn(st, innInfo || {});
      G.lastInnStay = paid;
      var go = function () {
        J.Character.rest(st, G.data);   // 音樂（旅店短曲）由 G.innRest 播
        J.UI.banner('體力和魔力都回滿了！');
        G.save(); G.refreshHud();
        return true;
      };
      // 免費住：老闆先說請客的話（D_INN_FREE），再休息
      if (paid.action === 'free') return G.say(innInfo && innInfo.dialog_nocoin, [{ who: npcId || '__inn', text: '錢不夠也沒關係，這次讓你免費住一晚！' }]).then(go);
      return go();
    });
  }

  /**
   * v1.2（61 號 2.8）泡溫泉：扣錢（價錢＝住宿的一半，進位到 5）、體力和魔力回滿；不記成累倒後回來的地方（lastInn 不動）。
   * 錢不夠不能泡（不給免費）。回傳 Promise：'bath'＝泡了（game.js 播泡湯的畫面）、false＝沒泡
   */
  function bath(G, innInfo, npcId) {
    var st = G.state, label = String((innInfo && innInfo.bath && innInfo.bath.label) || '♨️ 泡溫泉').replace(/^♨️\s*/, '');
    var b = J.Shop.bathStay(st, innInfo || {});
    G.lastBath = b;   // 測試用
    if (b.action !== 'pay') return G.say(null, [{ who: 'pet', text: '金幣不夠，不能' + label + '喔！去打幾隻怪物存錢吧。' }]).then(function () { return false; });
    return G.say(innInfo.dialog_bath || null, [{ who: 'pet', text: label + '不算住宿喔！記得要有大人陪。' }]).then(function () {
      G.lastBath = J.Shop.payBath(st, innInfo);
      J.Character.rest(st, G.data);
      J.UI.banner(label + '好舒服！體力和魔力都回滿了！');
      G.save(); G.refreshHud();
      return 'bath';
    });
  }

  // ---------------------------------------------------------------- 職業公會、慈護宮神像（v1.0 48 號 1.4、1.5、2.4、F8）
  var TRAIT_TEXT = {
    power: '力量最大：所有攻擊傷害 ×1.15', dmgTaken: '被打到的傷害 −10%', critFrac: '會心一擊的時間比較長（前 2/5）', skillPow: '攻擊技能威力 ×1.15',
    healPow: '回復技能效果 ×1.2', evade: '答錯時有時候會閃過攻擊', time: '答題時間條 ×1.2；打倒怪物時比較容易拿到東西', drop: null, mpRegen: '打贏後回復一點魔力',
    fleeSure: '逃跑一定成功（頭目戰不能逃）', petHit: '答對時番薯仔有時候會追加一擊', laugh: '答錯時怪物有時候會笑到忘了攻擊', friendCard: '打倒怪物有時候會拿到怪物朋友卡', gold: '戰鬥拿到的金幣 ×1.25'
  };
  function traitText(j) { return Object.keys(j.trait || {}).map(function (k) { return TRAIT_TEXT[k]; }).filter(Boolean).join('；'); }
  /** 這個職業在清單上的狀態：current、back（以前當過）、change（小考通過了）、trial（可以考）、today（明天再來）、level（見習還不到 10 級）、closed（即將開放） */
  function jobState(G, id) {
    var st = G.state, D = G.data;
    if (st.player.job === id) return { kind: 'current' };
    var c = J.Character.canChangeJob(st, id, D);
    if (c.ok) return { kind: c.back ? 'back' : 'change' };
    if (c.reason === 'closed') return { kind: 'closed' };
    if (c.reason === 'level') return { kind: 'level', need: c.need };
    var t = J.JobTrial.canStart(st, id, D, Date.now());
    if (t.ok) return { kind: 'trial' };
    return { kind: t.reason === 'today' ? 'today' : t.reason === 'time' ? 'time' : 'trial', minutes: t.minutes };
  }
  var JOB_BTN = { back: '換回去（免費）', change: '轉職', trial: '立志小考', today: '明天再來考', time: '今天時間不夠', level: '見習 10 級才能考', closed: '即將開放' };

  /**
   * 轉職清單。opts＝{ title, label, place（'temple'｜'guild'）, onPick(jobId, kind)：孩子按了按鈕（清單先關掉） }
   * 每個職業一張說明卡：拿手科目、特性、能用的武器防具、4 個技能（學會的等級）。
   */
  function guild(G, opts) {
    opts = opts || {};
    var st = G.state, D = G.data;
    var handle;
    var body = h('div');
    var panel = h('div.win.panel.guild-panel', {}, [h('button.close.ghost', { onclick: function () { handle.close(); }, 'aria-label': '關閉' }, ['✕ 關閉']), h('h2', { text: opts.title || '⚔️ 職業公會' }), body]);
    handle = J.UI.open(panel, { label: opts.label || '職業公會', onClose: function () { G.refreshHud(); } });
    function render() {
      body.innerHTML = '';
      var need = (D.jobRules && D.jobRules.master_level && D.jobRules.master_level.novice) || 10;
      body.appendChild(h('p', { text: '見習冒險者 ' + need + ' 級以後，通過「立志小考」就能轉職；以前當過的職業可以免費換回去。轉職後等級從 1 開始，能力有保底，不用擔心。' }));
      body.appendChild(h('p.small', { text: '職業只改變戰鬥方式和外觀，所有委託一樣要五科都學喔！' }));
      var list = h('ul.list.job-list');
      Object.keys(D.jobs).forEach(function (id) {
        var j = D.jobs[id], s = jobState(G, id);
        var key = J.Assets.heroKey(st.player.gender, id);
        var silhouette = s.kind === 'closed';
        var btn = s.kind === 'current' ? h('button.selected', { disabled: true }, ['目前的職業']) :
          h('button', { 'data-job': id, 'data-kind': s.kind, disabled: ['back', 'change', 'trial'].indexOf(s.kind) < 0, onclick: function () { handle.close(); if (opts.onPick) opts.onPick(id, s.kind); } },
            [JOB_BTN[s.kind] || '不能轉']);
        var lv = J.Character.jobLevel(st, id);
        var learned = (j.skills || []).map(function (sk) { return (lv >= sk.lv ? '✔' : 'Lv' + sk.lv) + ' ' + (J.SkillFx ? J.SkillFx.icon(sk) : '') + sk.name + '（魔力 ' + sk.mp + '）：' + sk.desc; });
        var gear = [];
        // 只列現在實際裝得上的類別（從 items.js 推算，不寫死）
        var wfs = J.Character.equipFams(id, D, 'weapon'), afs = J.Character.equipFams(id, D, 'armor');
        if (wfs.length) gear.push('武器：' + J.Character.famNames(wfs));
        if (afs.length) gear.push('防具：' + J.Character.famNames(afs));
        var card = h('details.job-card', {}, [h('summary', { text: '說明卡' }),
          h('div.small', { text: j.desc || '' }),
          traitText(j) ? h('div.small', { text: '特性：' + traitText(j) }) : null,
          gear.length ? h('div.small', { text: gear.join('　') }) : null,
          h('ul.small.job-skills', {}, learned.map(function (t) { return h('li', { text: t }); }))]);
        list.appendChild(h('li', { 'data-job': id, class: silhouette ? 'soon' : null }, [
          h('span.icon' + (silhouette ? '.silhouette' : ''), { html: J.Assets.domIcon(key, { size: 40, label: j.name, alt: '' }) }),
          h('div.what', {}, [h('b', { text: silhouette ? '？？？（即將開放）' : j.name }), h('span.small', { text: (j.favored ? '　拿手科目：' + j.favored : '') + (lv && id !== 'novice' ? '　Lv' + lv : '') }),
            silhouette ? null : card]), btn]));
      });
      body.appendChild(list);
    }
    render();
    return handle;
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

  window.JQ.Menus = { bag: bag, shop: shop, journal: journal, inn: inn, bath: bath, guild: guild, questList: questList };
})();
