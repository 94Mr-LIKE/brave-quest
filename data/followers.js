/* v3.0 南部（70 號 3.5、第七節）跟班資料（codex5 的格式）：順序就是隊伍順序，最多兩隻。霧仔在 Q_V1_FOG 完成後（state.flags.fogling_joined）跟著走。 */
(function () {
  'use strict';
  var followers = [
    { id: 'imo', name: '番薯仔', sprite: 'pet_imo' },
    { id: 'fogling', name: '霧仔', flag: 'fogling_joined', sprite: 'npc_fog_kid', mapH: 30, dialog: 'D_FOGLING_TALK',
      lines: [{ who: 'narrator', text: '霧仔：霧散開的地方，就有路喔！' }] }
  ];
  if (typeof window !== 'undefined') window.FOLLOWERS = followers;
  if (typeof module !== 'undefined') module.exports = followers;
})();
