/*
 * 開發用的世界地圖資料：只有正式的 window.WORLD（劇情設計師撰寫）還沒定義時才使用。
 * 格式：window.WORLD = { image?（例 'world_taiwan.png'，放 assets/maps/）, regions: [{ id, name, map_entry, x, y, unlock_quest }] }
 *   x, y 介於 0～1 時是圖片上的比例位置；大於 1 時是圖片像素座標。
 */
if (typeof window.WORLD === 'undefined') {
  window.WORLD = {
    title: '世界地圖（開發用）',
    regions: [
      { id: 'dev_a', name: '起點（開發用）', map_entry: 'M01', x: 0.62, y: 0.12, unlock_quest: null },
      { id: 'dev_b', name: '地圖 M09（開發用）', map_entry: 'M09', x: 0.5, y: 0.45, unlock_quest: 'Q_TUT_3' },
      { id: 'dev_c', name: '地圖 M10（開發用）', map_entry: 'M10', x: 0.42, y: 0.7, unlock_quest: ['Q_TUT_3', 'Q_LAMPS'] }
    ]
  };
}
