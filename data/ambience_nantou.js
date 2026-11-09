/* v4.1 中橫・南投環境音。沿用 v4.0 的追加資料方式與現有音檔，接在 ambience_east.js 後載入。
 * 區域矩形照 M30–M32.json 的 landmarks；未指定新曲，燈籠町只換環境音層。
 * 音量配層尚待人耳試聽；循環點沿用 AMBIENCE.files.amb 的資料。 */
(function () {
  'use strict';
  var nantou = {
    M30: {
      base: [{ id: 'amb_wind', db: 0 }, { id: 'amb_forest', db: -10 }],
      areas: [
        { landmark: '峽谷公路與隧道口', rect: [64, 4, 32, 36], layers: [{ id: 'amb_wind', db: -2 }, { id: 'amb_stream', db: -8 }] },
        { landmark: '大禹嶺', rect: [34, 10, 30, 30], layers: [{ id: 'amb_wind', db: 0 }] },
        { landmark: '武嶺與高山草原', rect: [0, 0, 34, 34], layers: [{ id: 'amb_wind', db: 0 }] },
        { landmark: '下山路與高冷菜園', rect: [0, 34, 44, 26], layers: [{ id: 'amb_forest', db: -4 }, { id: 'amb_wind', db: -6 }] }
      ],
      zones: [], viewpointAreas: [{ landmark: '武嶺與高山草原', rect: [0, 0, 34, 34] }]
    },
    M31: {
      base: [{ id: 'amb_town', db: 0 }, { id: 'amb_forest', db: -10 }],
      areas: [
        { landmark: '虎子山頂', rect: [16, 0, 20, 7], layers: [{ id: 'amb_wind', db: -2 }, { id: 'amb_forest', db: -4 }] },
        { landmark: '石階', rect: [24, 6, 3, 12], layers: [{ id: 'amb_forest', db: -2 }] },
        { landmark: '臺灣地理中心碑', rect: [16, 18, 20, 10], layers: [{ id: 'amb_forest', db: -2 }, { id: 'amb_town', db: -8 }] },
        { landmark: '埔里鎮街', rect: [36, 24, 36, 24], layers: [{ id: 'amb_town', db: 0 }] }
      ],
      zones: [], viewpointAreas: [{ landmark: '虎子山頂', rect: [16, 0, 20, 7] }]
    },
    M32: {
      base: [{ id: 'amb_forest', db: 0 }, { id: 'amb_wind', db: -10 }],
      areas: [
        // 大學池先於森林大區域，以免先命中森林而聽不到水聲。
        { landmark: '大學池', rect: [13, 13, 13, 10], layers: [{ id: 'amb_stream', db: -4 }, { id: 'amb_forest', db: -4 }] },
        { landmark: '溪頭森林', rect: [0, 4, 50, 30], layers: [{ id: 'amb_forest', db: 0 }] },
        { landmark: '茶園坡', rect: [49, 4, 37, 23], layers: [{ id: 'amb_wind', db: -4 }, { id: 'amb_forest', db: -4 }] },
        { landmark: '燈籠町', rect: [36, 27, 47, 23], layers: [{ id: 'amb_town', db: -4 }, { id: 'amb_night', db: -8 }] },
        { landmark: '林間夜路', rect: [4, 33, 34, 24], layers: [{ id: 'amb_night', db: 0 }, { id: 'amb_forest', db: -8 }] }
      ],
      zones: [], viewpointAreas: [{ landmark: '大學池', rect: [13, 13, 13, 10] }]
    }
  };
  if (typeof window !== 'undefined' && window.AMBIENCE && window.AMBIENCE.maps) {
    Object.keys(nantou).forEach(function (id) { window.AMBIENCE.maps[id] = nantou[id]; });
  }
  if (typeof module !== 'undefined') module.exports = nantou;
})();
