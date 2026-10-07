/*
 * 圖塊組圖例（前端工程師維護）：地圖 grid 的每個字元 → 圖塊、能不能走、要不要蓋在角色上方
 * 字元以 maps.js 檔頭的圖例為準；同一個字元在不同圖塊組可以畫成不同東西
 * （例：'#' 在海風村是海中的燭臺岩、在洞窟是岩壁、在王城是城牆）。
 *
 * 七組圖塊：village 村莊 / field 草原 / forest 森林 / swamp 沼澤 / cave 洞窟 / town 城鎮 / castle 城堡
 * 圖由 tools/make_tiles.py 產生；圖塊名稱一覽在 tile_frames.js。
 *
 * 欄位：
 *   tile    圖塊名稱
 *   walk    true = 可以走
 *   anim    有 2 影格動畫（tile 名稱結尾 _a，第 2 格自動用 _b）
 *   top     額外畫在「上一格」的覆蓋圖（樹冠、柱頭），依前後位置蓋住走在後面的角色
 *   overlay true = 這格本身是覆蓋層（屋頂），依前後位置蓋住角色
 *   water   true = 水面（相鄰的陸地邊會畫岸線）
 *   house   true = 房屋牆（引擎會在最下排自動交錯加窗戶）
 *   near    {字元: 圖塊}：上下左右有這個字元時改畫成指定圖塊（例：王城的 K 旁邊是地毯 c 才畫王座）
 *   upper   true = 「上層格」：可以走，但背景圖這一格會畫在角色上方（例：拱門、橋下、屋簷下、樹冠下）；
 *           角色被擋住時，引擎在最上層畫一個半透明剪影表示位置（DQ6 式）。
 *
 * ──────── maps.js 使用的字元 ────────
 *  .  可走地面        ,  花草（可走）       =  路／石板（可走）   %  淺灘／泥地（可走）
 *  T  樹／柱（擋）    #  牆／岩壁／城牆（擋） ~  水（擋）           *  灌木／岩石（擋）
 *  H  房屋牆（擋）    R  屋頂（擋）          D  門（擋；在門前一格對話）  B  橋（可走）
 *  F  柵欄（擋）      S  樓梯（可走）        c  地毯（可走）        K  王座／大型擺設（擋）
 *  U  上層格（可走，背景這格畫在角色上方；v0.4 新增，目前地圖尚未使用）
 * ──────── 另外可用（目前地圖沒用到）────────
 *  :  沙地   _  木地板   +  石磚地   W  有窗的牆   ^  屋頂   X  櫃檯   L/l  路燈（暗/亮）
 *  i  鐘乳石   b  灌木   r  岩石   C  懸崖   w  沼澤水   o  傳送光圈   P  牆上旗幟   (空白)  地圖外
 *  找不到的字元會當成可走的地面，並在 console 提醒（不會當掉）。
 */
window.TILESETS = (function () {
  var COMMON = {
    '.': { tile: 'grass', walk: true },
    ',': { tile: 'flowers', walk: true },
    '=': { tile: 'path', walk: true },
    '%': { tile: 'sand', walk: true },
    'T': { tile: 'tree_base', walk: false, top: 'tree_top' },
    '#': { tile: 'rockwall', walk: false },
    '~': { tile: 'water_a', walk: false, anim: true, water: true },
    '*': { tile: 'rock', walk: false },
    'H': { tile: 'wall', walk: false, house: true },
    'R': { tile: 'roof', walk: false, overlay: true },
    'D': { tile: 'door', walk: false },          // v0.4：門不能站上去（不然看起來像站在房子上），在門前一格互動
    'U': { tile: 'grass', walk: true, upper: true },  // v0.4：上層格
    'B': { tile: 'bridge', walk: true },
    'F': { tile: 'fence', walk: false },
    'S': { tile: 'stairs', walk: true },
    'c': { tile: 'carpet', walk: true },
    'K': { tile: 'statue', walk: false },
    // 以下目前地圖沒用到，留給之後的新地圖
    ':': { tile: 'sand', walk: true },
    '_': { tile: 'floor_wood', walk: true },
    '+': { tile: 'floor_stone', walk: true },
    'W': { tile: 'window', walk: false },
    '^': { tile: 'roof', walk: false, overlay: true },
    'X': { tile: 'counter', walk: false },
    'L': { tile: 'lamp_off', walk: false },
    'l': { tile: 'lamp_on', walk: false },
    'i': { tile: 'stalagmite', walk: false },
    'b': { tile: 'bush', walk: false },
    'r': { tile: 'rock', walk: false },
    'C': { tile: 'cliff', walk: false },
    'w': { tile: 'swamp_a', walk: false, anim: true, water: true },
    'o': { tile: 'warp_a', walk: true, anim: true },
    'P': { tile: 'banner', walk: false },
    ' ': { tile: 'void', walk: false }
  };
  function extend(over) {
    var o = {};
    Object.keys(COMMON).forEach(function (k) { o[k] = COMMON[k]; });
    Object.keys(over || {}).forEach(function (k) { o[k] = over[k]; });
    return o;
  }
  return {
    // 海風村：'#' 是海中的燭臺岩；'%' 是沙灘；'*' 是溫泉邊的岩石
    village: extend({ '#': { tile: 'stack', walk: false } }),
    // 金色草原、岩丘：'*' 是岩石
    field: extend(),
    // 低語森林、精靈之村：'*' 是灌木
    forest: extend({ '*': { tile: 'bush', walk: false } }),
    // 霧之沼澤：'~' 是沼澤水、'%' 是泥地
    swamp: extend({ '~': { tile: 'swamp_a', walk: false, anim: true, water: true }, '%': { tile: 'mud', walk: true } }),
    // 回音洞窟、哥布林部落：'.' 洞窟地面、',' 碎石地、'*' 鐘乳石、'T' 石筍
    cave: extend({ ',': { tile: 'path', walk: true }, '*': { tile: 'stalagmite', walk: false }, 'T': { tile: 'stalagmite', walk: false } }),
    // 港口市集城：'.' 石板廣場、'#' 磚造城牆、'*' 盆栽灌木
    town: extend({ '.': { tile: 'floor_stone', walk: true }, '#': { tile: 'wall', walk: false }, '*': { tile: 'bush', walk: false } }),
    // 王城：'.' 石地板、'#' 城牆、'T' 石柱、'K' 王座、'*' 石像、'~' 噴水池
    castle: extend({
      '.': { tile: 'floor_stone', walk: true }, '#': { tile: 'wall', walk: false },
      'T': { tile: 'pillar_base', walk: false, top: 'pillar_top' }, 'K': { tile: 'statue', walk: false, near: { c: 'throne' } }, '*': { tile: 'statue', walk: false }
    })
  };
})();
