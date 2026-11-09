/* 由 tools/build_art.py 自動產生；v0.9.4 起怪物圖改用 art_src/v1/redesign/processed（不要重跑 build_art.py，會用舊圖蓋回），水牛、站牌、候車亭、v0.9.5 媽祖神像 obj_mazu_statue 與廟公 npc_temple_keeper 為手動加入。美術：GPT 繪製＋程式後製（去背、切格、縮放、限色）。  v1.0 第一批：7 個新職業走路圖、7 個裝備圖示（art_src/v1/jobs_v1/processed，2026-10-12 交件）。v1.1 第一章：8 隻新怪物戰鬥圖（mon_wx_rain、mon_mn_*、boss_mnb_goldjaw；docs/assets/monsters，2026-10-20 交件）手動加入。*/
window.SPRITES = {
 "hero_novice": {
  "file": "assets/chars/hero_novice.png",
  "type": "walk",
  "frameW": 33,
  "frameH": 50,
  "rows": [
   "down",
   "left",
   "right",
   "up"
  ]
 },
 "hero_swordsman": {
  "file": "assets/chars/hero_swordsman.png",
  "type": "walk",
  "frameW": 33,
  "frameH": 50,
  "rows": [
   "down",
   "left",
   "right",
   "up"
  ]
 },
 "hero_mage": {
  "file": "assets/chars/hero_mage.png",
  "type": "walk",
  "frameW": 37,
  "frameH": 50,
  "rows": [
   "down",
   "left",
   "right",
   "up"
  ]
 },
 "hero_archer": {
  "file": "assets/chars/hero_archer.png",
  "type": "walk",
  "frameW": 33,
  "frameH": 50,
  "rows": [
   "down",
   "left",
   "right",
   "up"
  ]
 },
 "hero_bard": {
  "file": "assets/chars/hero_bard.png",
  "type": "walk",
  "frameW": 32,
  "frameH": 50,
  "rows": [
   "down",
   "left",
   "right",
   "up"
  ]
 },
 "hero_priest": {
  "file": "assets/chars/hero_priest.png",
  "type": "walk",
  "frameW": 35,
  "frameH": 50,
  "rows": [
   "down",
   "left",
   "right",
   "up"
  ]
 },
 "heroM_novice": {
  "file": "assets/chars/heroM_novice.png",
  "type": "walk",
  "frameW": 27,
  "frameH": 50,
  "rows": [
   "down",
   "left",
   "right",
   "up"
  ]
 },
 "heroM_swordsman": {
  "file": "assets/chars/heroM_swordsman.png",
  "type": "walk",
  "frameW": 30,
  "frameH": 50,
  "rows": [
   "down",
   "left",
   "right",
   "up"
  ]
 },
 "heroM_mage": {
  "file": "assets/chars/heroM_mage.png",
  "type": "walk",
  "frameW": 29,
  "frameH": 50,
  "rows": [
   "down",
   "left",
   "right",
   "up"
  ]
 },
 "heroM_archer": {
  "file": "assets/chars/heroM_archer.png",
  "type": "walk",
  "frameW": 29,
  "frameH": 50,
  "rows": [
   "down",
   "left",
   "right",
   "up"
  ]
 },
 "heroM_bard": {
  "file": "assets/chars/heroM_bard.png",
  "type": "walk",
  "frameW": 34,
  "frameH": 50,
  "rows": [
   "down",
   "left",
   "right",
   "up"
  ]
 },
 "heroM_priest": {
  "file": "assets/chars/heroM_priest.png",
  "type": "walk",
  "frameW": 29,
  "frameH": 50,
  "rows": [
   "down",
   "left",
   "right",
   "up"
  ]
 },
 "pet_imo": {
  "file": "assets/chars/pet_imo.png",
  "type": "walk",
  "frameW": 29,
  "frameH": 29,
  "rows": [
   "down",
   "left",
   "right",
   "up"
  ]
 },
 "npc_chief": {
  "file": "assets/npcs/npc_chief.png",
  "type": "single",
  "frameW": 33,
  "frameH": 50
 },
 "npc_bookstore": {
  "file": "assets/npcs/npc_bookstore.png",
  "type": "single",
  "frameW": 24,
  "frameH": 50
 },
 "npc_fisher": {
  "file": "assets/npcs/npc_fisher.png",
  "type": "single",
  "frameW": 37,
  "frameH": 50
 },
 "npc_shopkeeper": {
  "file": "assets/npcs/npc_shopkeeper.png",
  "type": "single",
  "frameW": 38,
  "frameH": 50
 },
 "npc_innkeeper": {
  "file": "assets/npcs/npc_innkeeper.png",
  "type": "single",
  "frameW": 28,
  "frameH": 50
 },
 "npc_blacksmith": {
  "file": "assets/npcs/npc_blacksmith.png",
  "type": "single",
  "frameW": 34,
  "frameH": 50
 },
 "npc_elf_elder": {
  "file": "assets/npcs/npc_elf_elder.png",
  "type": "single",
  "frameW": 38,
  "frameH": 50
 },
 "npc_elf_kid": {
  "file": "assets/npcs/npc_elf_kid.png",
  "type": "single",
  "frameW": 32,
  "frameH": 50
 },
 "npc_gnome_chief": {
  "file": "assets/npcs/npc_gnome_chief.png",
  "type": "single",
  "frameW": 35,
  "frameH": 50
 },
 "npc_gnome": {
  "file": "assets/npcs/npc_gnome.png",
  "type": "single",
  "frameW": 40,
  "frameH": 50
 },
 "npc_goblin_chief": {
  "file": "assets/npcs/npc_goblin_chief.png",
  "type": "single",
  "frameW": 36,
  "frameH": 50
 },
 "npc_goblin_kid": {
  "file": "assets/npcs/npc_goblin_kid.png",
  "type": "single",
  "frameW": 39,
  "frameH": 50
 },
 "npc_orc_chief": {
  "file": "assets/npcs/npc_orc_chief.png",
  "type": "single",
  "frameW": 42,
  "frameH": 50
 },
 "npc_orc": {
  "file": "assets/npcs/npc_orc.png",
  "type": "single",
  "frameW": 41,
  "frameH": 50
 },
 "npc_merchant": {
  "file": "assets/npcs/npc_merchant.png",
  "type": "single",
  "frameW": 37,
  "frameH": 50
 },
 "npc_king": {
  "file": "assets/npcs/npc_king.png",
  "type": "single",
  "frameW": 41,
  "frameH": 50
 },
 "npc_guild": {
  "file": "assets/npcs/npc_guild.png",
  "type": "single",
  "frameW": 29,
  "frameH": 50
 },
 "npc_librarian": {
  "file": "assets/npcs/npc_librarian.png",
  "type": "single",
  "frameW": 25,
  "frameH": 50
 },
 "npc_auntie_yam": {
  "file": "assets/npcs/npc_auntie_yam.png",
  "type": "single",
  "frameW": 27,
  "frameH": 50
 },
 "npc_auntie_market": {
  "file": "assets/npcs/npc_auntie_market.png",
  "type": "single",
  "frameW": 26,
  "frameH": 50
 },
 "npc_auntie_taro": {
  "file": "assets/npcs/npc_auntie_taro.png",
  "type": "single",
  "frameW": 25,
  "frameH": 50
 },
 "chest_closed": {
  "file": "assets/ui/chest_closed.png",
  "type": "single",
  "frameW": 45,
  "frameH": 44
 },
 "chest_open": {
  "file": "assets/ui/chest_open.png",
  "type": "single",
  "frameW": 38,
  "frameH": 44
 },
 "sign_weapon": {
  "file": "assets/ui/sign_weapon.png",
  "type": "single",
  "frameW": 39,
  "frameH": 44
 },
 "sign_armor": {
  "file": "assets/ui/sign_armor.png",
  "type": "single",
  "frameW": 39,
  "frameH": 44
 },
 "sign_item": {
  "file": "assets/ui/sign_item.png",
  "type": "single",
  "frameW": 40,
  "frameH": 44
 },
 "sign_inn": {
  "file": "assets/ui/sign_inn.png",
  "type": "single",
  "frameW": 40,
  "frameH": 44
 },
 "sign_general": {
  "file": "assets/ui/sign_general.png",
  "type": "single",
  "frameW": 40,
  "frameH": 44
 },
 "mon_dango": {
  "file": "assets/monsters/mon_dango.png",
  "type": "single",
  "frameW": 89,
  "frameH": 96
 },
 "mon_rabbit": {
  "file": "assets/monsters/mon_rabbit.png",
  "type": "single",
  "frameW": 93,
  "frameH": 96
 },
 "mon_mushroom": {
  "file": "assets/monsters/mon_mushroom.png",
  "type": "single",
  "frameW": 109,
  "frameH": 96
 },
 "mon_sprout": {
  "file": "assets/monsters/mon_sprout.png",
  "type": "single",
  "frameW": 95,
  "frameH": 96
 },
 "mon_mudslime": {
  "file": "assets/monsters/mon_mudslime.png",
  "type": "single",
  "frameW": 109,
  "frameH": 96
 },
 "mon_frog": {
  "file": "assets/monsters/mon_frog.png",
  "type": "single",
  "frameW": 91,
  "frameH": 96
 },
 "mon_bat": {
  "file": "assets/monsters/mon_bat.png",
  "type": "single",
  "frameW": 105,
  "frameH": 96
 },
 "mon_rock": {
  "file": "assets/monsters/mon_rock.png",
  "type": "single",
  "frameW": 101,
  "frameH": 96
 },
 "mon_boar": {
  "file": "assets/monsters/mon_boar.png",
  "type": "single",
  "frameW": 102,
  "frameH": 96
 },
 "mon_crab": {
  "file": "assets/monsters/mon_crab.png",
  "type": "single",
  "frameW": 109,
  "frameH": 96
 },
 "mon_seagull": {
  "file": "assets/monsters/mon_seagull.png",
  "type": "single",
  "frameW": 100,
  "frameH": 96
 },
 "mon_wisp": {
  "file": "assets/monsters/mon_wisp.png",
  "type": "single",
  "frameW": 87,
  "frameH": 96
 },
 "mon_armor": {
  "file": "assets/monsters/mon_armor.png",
  "type": "single",
  "frameW": 82,
  "frameH": 96
 },
 "mon_owl": {
  "file": "assets/monsters/mon_owl.png",
  "type": "single",
  "frameW": 105,
  "frameH": 96
 },
 "item_herb": {
  "file": "assets/items/item_herb.png",
  "type": "icon",
  "frameW": 29,
  "frameH": 32
 },
 "item_card_remove": {
  "file": "assets/items/item_card_remove.png",
  "type": "icon",
  "frameW": 26,
  "frameH": 32
 },
 "item_card_guide": {
  "file": "assets/items/item_card_guide.png",
  "type": "icon",
  "frameW": 25,
  "frameH": 32
 },
 "item_snack": {
  "file": "assets/items/item_snack.png",
  "type": "icon",
  "frameW": 38,
  "frameH": 32
 },
 "item_wood_sword": {
  "file": "assets/items/item_wood_sword.png",
  "type": "icon",
  "frameW": 31,
  "frameH": 32
 },
 "item_iron_sword": {
  "file": "assets/items/item_iron_sword.png",
  "type": "icon",
  "frameW": 32,
  "frameH": 32
 },
 "item_staff": {
  "file": "assets/items/item_staff.png",
  "type": "icon",
  "frameW": 30,
  "frameH": 32
 },
 "item_bow": {
  "file": "assets/items/item_bow.png",
  "type": "icon",
  "frameW": 30,
  "frameH": 32
 },
 "item_harp": {
  "file": "assets/items/item_harp.png",
  "type": "icon",
  "frameW": 31,
  "frameH": 32
 },
 "item_rod": {
  "file": "assets/items/item_rod.png",
  "type": "icon",
  "frameW": 29,
  "frameH": 32
 },
 "item_leather": {
  "file": "assets/items/item_leather.png",
  "type": "icon",
  "frameW": 31,
  "frameH": 32
 },
 "item_robe": {
  "file": "assets/items/item_robe.png",
  "type": "icon",
  "frameW": 33,
  "frameH": 32
 },
 "item_sticky_ball": {
  "file": "assets/items/item_sticky_ball.png",
  "type": "icon",
  "frameW": 40,
  "frameH": 32
 },
 "item_mushroom_cap": {
  "file": "assets/items/item_mushroom_cap.png",
  "type": "icon",
  "frameW": 40,
  "frameH": 32
 },
 "item_feather": {
  "file": "assets/items/item_feather.png",
  "type": "icon",
  "frameW": 28,
  "frameH": 32
 },
 "item_bat_wing": {
  "file": "assets/items/item_bat_wing.png",
  "type": "icon",
  "frameW": 31,
  "frameH": 32
 },
 "item_crystal": {
  "file": "assets/items/item_crystal.png",
  "type": "icon",
  "frameW": 22,
  "frameH": 32
 },
 "item_gear": {
  "file": "assets/items/item_gear.png",
  "type": "icon",
  "frameW": 33,
  "frameH": 32
 },
 "item_scroll": {
  "file": "assets/items/item_scroll.png",
  "type": "icon",
  "frameW": 38,
  "frameH": 32
 },
 "item_key": {
  "file": "assets/items/item_key.png",
  "type": "icon",
  "frameW": 29,
  "frameH": 32
 },
 "mon_goblin": {
  "file": "assets/monsters/mon_goblin.png",
  "type": "single",
  "frameW": 92,
  "frameH": 96
 },
 "boss_tree": {
  "file": "assets/monsters/boss_tree.png",
  "type": "single",
  "frameW": 160,
  "frameH": 160
 },
 "boss_frog": {
  "file": "assets/monsters/boss_frog.png",
  "type": "single",
  "frameW": 169,
  "frameH": 160
 },
 "boss_bat": {
  "file": "assets/monsters/boss_bat.png",
  "type": "single",
  "frameW": 166,
  "frameH": 160
 },
 "boss_golem": {
  "file": "assets/monsters/boss_golem.png",
  "type": "single",
  "frameW": 167,
  "frameH": 160
 },
 "boss_octopus": {
  "file": "assets/monsters/boss_octopus.png",
  "type": "single",
  "frameW": 169,
  "frameH": 160
 },
 "boss_fog": {
  "file": "assets/monsters/boss_fog.png",
  "type": "single",
  "frameW": 178,
  "frameH": 176
 },
 "mon_fiddler_crab": {
  "file": "assets/monsters/mon_fiddler_crab.png",
  "type": "single",
  "frameW": 100,
  "frameH": 96
 },
 "npc_buffalo": {
  "file": "assets/npcs/npc_buffalo.png",
  "type": "walk",
  "frameW": 45,
  "frameH": 42,
  "rows": [
   "down",
   "left",
   "right",
   "up"
  ]
 },
 "obj_station": {
  "file": "assets/ui/obj_bus_sign.png",
  "type": "single",
  "frameW": 32,
  "frameH": 64
 },
 "obj_bus_shelter": {
  "file": "assets/ui/obj_bus_shelter.png",
  "type": "single",
  "frameW": 96,
  "frameH": 96
 },
 "npc_bookstore_m": {
  "file": "assets/npcs/npc_bookstore_m.png",
  "type": "single",
  "frameW": 28,
  "frameH": 50
 },
 "npc_inn_port_m": {
  "file": "assets/npcs/npc_inn_port_m.png",
  "type": "single",
  "frameW": 35,
  "frameH": 50
 },
 "npc_innkeeper_m": {
  "file": "assets/npcs/npc_innkeeper_m.png",
  "type": "single",
  "frameW": 31,
  "frameH": 50
 },
 "npc_uncle_market": {
  "file": "assets/npcs/npc_uncle_market.png",
  "type": "single",
  "frameW": 33,
  "frameH": 50
 },
 "npc_uncle_taro": {
  "file": "assets/npcs/npc_uncle_taro.png",
  "type": "single",
  "frameW": 30,
  "frameH": 50
 },
 "npc_uncle_yam": {
  "file": "assets/npcs/npc_uncle_yam.png",
  "type": "single",
  "frameW": 31,
  "frameH": 50
 },
 "npc_blacksmith_m": {
  "file": "assets/npcs/npc_blacksmith_m.png",
  "type": "single",
  "frameW": 41,
  "frameH": 50
 },
 "npc_guild_m": {
  "file": "assets/npcs/npc_guild_m.png",
  "type": "single",
  "frameW": 34,
  "frameH": 50
 },
 "npc_inn_shenmu_m": {
  "file": "assets/npcs/npc_inn_shenmu_m.png",
  "type": "single",
  "frameW": 37,
  "frameH": 50
 },
 "obj_mazu_statue": {
  "file": "assets/ui/obj_mazu_statue.png",
  "type": "single",
  "frameW": 64,
  "frameH": 96
 },
 "npc_temple_keeper": {
  "file": "assets/npcs/npc_temple_keeper.png",
  "type": "single",
  "frameW": 30,
  "frameH": 50
 },
 "hero_fighter": {
  "file": "assets/chars/hero_fighter.png",
  "type": "walk",
  "frameW": 33,
  "frameH": 50,
  "rows": [
   "down",
   "left",
   "right",
   "up"
  ]
 },
 "heroM_fighter": {
  "file": "assets/chars/heroM_fighter.png",
  "type": "walk",
  "frameW": 31,
  "frameH": 50,
  "rows": [
   "down",
   "left",
   "right",
   "up"
  ]
 },
 "hero_dancer": {
  "file": "assets/chars/hero_dancer.png",
  "type": "walk",
  "frameW": 38,
  "frameH": 50,
  "rows": [
   "down",
   "left",
   "right",
   "up"
  ]
 },
 "heroM_dancer": {
  "file": "assets/chars/heroM_dancer.png",
  "type": "walk",
  "frameW": 31,
  "frameH": 50,
  "rows": [
   "down",
   "left",
   "right",
   "up"
  ]
 },
 "hero_sailor": {
  "file": "assets/chars/hero_sailor.png",
  "type": "walk",
  "frameW": 33,
  "frameH": 50,
  "rows": [
   "down",
   "left",
   "right",
   "up"
  ]
 },
 "heroM_sailor": {
  "file": "assets/chars/heroM_sailor.png",
  "type": "walk",
  "frameW": 29,
  "frameH": 50,
  "rows": [
   "down",
   "left",
   "right",
   "up"
  ]
 },
 "hero_shepherd": {
  "file": "assets/chars/hero_shepherd.png",
  "type": "walk",
  "frameW": 35,
  "frameH": 50,
  "rows": [
   "down",
   "left",
   "right",
   "up"
  ]
 },
 "heroM_shepherd": {
  "file": "assets/chars/heroM_shepherd.png",
  "type": "walk",
  "frameW": 34,
  "frameH": 50,
  "rows": [
   "down",
   "left",
   "right",
   "up"
  ]
 },
 "hero_jester": {
  "file": "assets/chars/hero_jester.png",
  "type": "walk",
  "frameW": 37,
  "frameH": 50,
  "rows": [
   "down",
   "left",
   "right",
   "up"
  ]
 },
 "heroM_jester": {
  "file": "assets/chars/heroM_jester.png",
  "type": "walk",
  "frameW": 36,
  "frameH": 50,
  "rows": [
   "down",
   "left",
   "right",
   "up"
  ]
 },
 "hero_tamer": {
  "file": "assets/chars/hero_tamer.png",
  "type": "walk",
  "frameW": 31,
  "frameH": 50,
  "rows": [
   "down",
   "left",
   "right",
   "up"
  ]
 },
 "heroM_tamer": {
  "file": "assets/chars/heroM_tamer.png",
  "type": "walk",
  "frameW": 27,
  "frameH": 50,
  "rows": [
   "down",
   "left",
   "right",
   "up"
  ]
 },
 "hero_merchant": {
  "file": "assets/chars/hero_merchant.png",
  "type": "walk",
  "frameW": 33,
  "frameH": 50,
  "rows": [
   "down",
   "left",
   "right",
   "up"
  ]
 },
 "heroM_merchant": {
  "file": "assets/chars/heroM_merchant.png",
  "type": "walk",
  "frameW": 30,
  "frameH": 50,
  "rows": [
   "down",
   "left",
   "right",
   "up"
  ]
 },
 "item_steel_sword": {
  "file": "assets/items/item_steel_sword.png",
  "type": "icon",
  "frameW": 30,
  "frameH": 32
 },
 "item_cloak": {
  "file": "assets/items/item_cloak.png",
  "type": "icon",
  "frameW": 29,
  "frameH": 32
 },
 "item_heavy_armor": {
  "file": "assets/items/item_heavy_armor.png",
  "type": "icon",
  "frameW": 33,
  "frameH": 32
 },
 "item_light_armor": {
  "file": "assets/items/item_light_armor.png",
  "type": "icon",
  "frameW": 27,
  "frameH": 32
 },
 "item_anchor_axe": {
  "file": "assets/items/item_anchor_axe.png",
  "type": "icon",
  "frameW": 28,
  "frameH": 32
 },
 "item_gloves": {
  "file": "assets/items/item_gloves.png",
  "type": "icon",
  "frameW": 31,
  "frameH": 32
 },
 "item_whip": {
  "file": "assets/items/item_whip.png",
  "type": "icon",
  "frameW": 32,
  "frameH": 32
 },
 "item_ribbon_fan": {
  "file": "assets/items/item_ribbon_fan.png",
  "type": "icon",
  "frameW": 35,
  "frameH": 32
 },
 "item_clapper": {
  "file": "assets/items/item_clapper.png",
  "type": "icon",
  "frameW": 37,
  "frameH": 32
 },
 "item_tamer_whip": {
  "file": "assets/items/item_tamer_whip.png",
  "type": "icon",
  "frameW": 38,
  "frameH": 32
 },
 "item_abacus_dagger": {
  "file": "assets/items/item_abacus_dagger.png",
  "type": "icon",
  "frameW": 31,
  "frameH": 32
 },
 "item_amulet": {
  "file": "assets/items/item_amulet.png",
  "type": "icon",
  "frameW": 32,
  "frameH": 32
 },
 "item_umbrella": {
  "file": "assets/items/item_umbrella.png",
  "type": "icon",
  "frameW": 33,
  "frameH": 32
 },
 "mon_wx_rain": {
  "file": "assets/monsters/mon_wx_rain.png",
  "type": "single",
  "frameW": 107,
  "frameH": 96
 },
 "mon_mn_cart": {
  "file": "assets/monsters/mon_mn_cart.png",
  "type": "single",
  "frameW": 110,
  "frameH": 96
 },
 "mon_mn_lamp": {
  "file": "assets/monsters/mon_mn_lamp.png",
  "type": "single",
  "frameW": 94,
  "frameH": 96
 },
 "mon_mn_ore": {
  "file": "assets/monsters/mon_mn_ore.png",
  "type": "single",
  "frameW": 120,
  "frameH": 96
 },
 "mon_mn_drill": {
  "file": "assets/monsters/mon_mn_drill.png",
  "type": "single",
  "frameW": 91,
  "frameH": 96
 },
 "mon_mn_timber": {
  "file": "assets/monsters/mon_mn_timber.png",
  "type": "single",
  "frameW": 87,
  "frameH": 96
 },
 "mon_mn_dust": {
  "file": "assets/monsters/mon_mn_dust.png",
  "type": "single",
  "frameW": 99,
  "frameH": 96
 },
 "boss_mnb_goldjaw": {
  "file": "assets/monsters/boss_mnb_goldjaw.png",
  "type": "single",
  "frameW": 164,
  "frameH": 160
 },
 "npc_calla_farmer": {
  "file": "assets/npcs/npc_calla_farmer.png",
  "type": "single",
  "frameW": 39,
  "frameH": 50
 },
 "npc_rice_guide": {
  "file": "assets/npcs/npc_rice_guide.png",
  "type": "single",
  "frameW": 45,
  "frameH": 50
 },
 "obj_road_sign": {
  "file": "assets/ui/obj_road_sign.png",
  "type": "single",
  "frameW": 32,
  "frameH": 48
 },
 "npc_seaweed_uncle": {
  "file": "assets/npcs/npc_seaweed_uncle.png",
  "type": "single",
  "frameW": 34,
  "frameH": 50
 },
 "npc_park_ranger": {
  "file": "assets/npcs/npc_park_ranger.png",
  "type": "single",
  "frameW": 36,
  "frameH": 50
 },
 "npc_harbor_uncle": {
  "file": "assets/npcs/npc_harbor_uncle.png",
  "type": "single",
  "frameW": 38,
  "frameH": 50
 },
 "npc_old_miner": {
  "file": "assets/npcs/npc_old_miner.png",
  "type": "single",
  "frameW": 41,
  "frameH": 50
 },
 "npc_museum_guide": {
  "file": "assets/npcs/npc_museum_guide.png",
  "type": "single",
  "frameW": 34,
  "frameH": 50
 },
 "npc_keelung_vendor": {
  "file": "assets/npcs/npc_keelung_vendor.png",
  "type": "single",
  "frameW": 43,
  "frameH": 50
 },
 "boss_wxb_raincloud": {
  "file": "assets/monsters/boss_wxb_raincloud.png",
  "type": "single",
  "frameW": 173,
  "frameH": 160
 },
 "mon_ly_bubble": {
  "file": "assets/monsters/mon_ly_bubble.png",
  "type": "single",
  "frameW": 115,
  "frameH": 96
 },
 "mon_ly_kumquat": {
  "file": "assets/monsters/mon_ly_kumquat.png",
  "type": "single",
  "frameW": 86,
  "frameH": 96
 },
 "mon_ly_mackerel": {
  "file": "assets/monsters/mon_ly_mackerel.png",
  "type": "single",
  "frameW": 81,
  "frameH": 96
 },
 "mon_ly_scallion": {
  "file": "assets/monsters/mon_ly_scallion.png",
  "type": "single",
  "frameW": 103,
  "frameH": 96
 },
 "mon_ly_tigerwind": {
  "file": "assets/monsters/mon_ly_tigerwind.png",
  "type": "single",
  "frameW": 99,
  "frameH": 96
 },
 "mon_an_magpie": {
  "file": "assets/monsters/mon_an_magpie.png",
  "type": "single",
  "frameW": 92,
  "frameH": 96
 },
 "mon_an_pangolin": {
  "file": "assets/monsters/mon_an_pangolin.png",
  "type": "single",
  "frameW": 104,
  "frameH": 96
 },
 "mon_gt_jade": {
  "file": "assets/monsters/mon_gt_jade.png",
  "type": "single",
  "frameW": 97,
  "frameH": 96
 },
 "mon_gt_steam": {
  "file": "assets/monsters/mon_gt_steam.png",
  "type": "single",
  "frameW": 81,
  "frameH": 96
 },
 "mon_gt_sulfur": {
  "file": "assets/monsters/mon_gt_sulfur.png",
  "type": "single",
  "frameW": 90,
  "frameH": 96
 },
 "mon_mc_alarm": {
  "file": "assets/monsters/mon_mc_alarm.png",
  "type": "single",
  "frameW": 102,
  "frameH": 96
 },
 "mon_mc_gondola": {
  "file": "assets/monsters/mon_mc_gondola.png",
  "type": "single",
  "frameW": 102,
  "frameH": 96
 },
 "mon_mc_roaster": {
  "file": "assets/monsters/mon_mc_roaster.png",
  "type": "single",
  "frameW": 100,
  "frameH": 96
 },
 "mon_mc_signal": {
  "file": "assets/monsters/mon_mc_signal.png",
  "type": "single",
  "frameW": 81,
  "frameH": 96
 },
 "mon_mc_vending": {
  "file": "assets/monsters/mon_mc_vending.png",
  "type": "single",
  "frameW": 105,
  "frameH": 96
 },
 "mon_tea_basket": {
  "file": "assets/monsters/mon_tea_basket.png",
  "type": "single",
  "frameW": 100,
  "frameH": 96
 },
 "mon_tea_mantis": {
  "file": "assets/monsters/mon_tea_mantis.png",
  "type": "single",
  "frameW": 96,
  "frameH": 96
 },
 "mon_tea_moth": {
  "file": "assets/monsters/mon_tea_moth.png",
  "type": "single",
  "frameW": 107,
  "frameH": 96
 },
 "boss_mb_floodgate": {
  "file": "assets/monsters/boss_mb_floodgate.png",
  "type": "single",
  "frameW": 165,
  "frameH": 160
 },
 "mon_hc_noodle": {
  "file": "assets/monsters/mon_hc_noodle.png",
  "type": "single",
  "frameW": 100,
  "frameH": 96
 },
 "mon_mc_vacuum": {
  "file": "assets/monsters/mon_mc_vacuum.png",
  "type": "single",
  "frameW": 124,
  "frameH": 96
 },
 "mon_ty_carve": {
  "file": "assets/monsters/mon_ty_carve.png",
  "type": "single",
  "frameW": 101,
  "frameH": 96
 },
 "mon_ty_tofu": {
  "file": "assets/monsters/mon_ty_tofu.png",
  "type": "single",
  "frameW": 113,
  "frameH": 96
 },
 "mon_wx_thunder": {
  "file": "assets/monsters/mon_wx_thunder.png",
  "type": "single",
  "frameW": 93,
  "frameH": 96
 },
 "mon_wx_wind": {
  "file": "assets/monsters/mon_wx_wind.png",
  "type": "single",
  "frameW": 97,
  "frameH": 96
 },
 "npc_bus_driver": {
  "file": "assets/npcs/npc_bus_driver.png",
  "type": "single",
  "frameW": 38,
  "frameH": 50
 },
 "npc_coldspring_keeper": {
  "file": "assets/npcs/npc_coldspring_keeper.png",
  "type": "single",
  "frameW": 35,
  "frameH": 50
 },
 "npc_kumquat_farmer": {
  "file": "assets/npcs/npc_kumquat_farmer.png",
  "type": "single",
  "frameW": 32,
  "frameH": 50
 },
 "npc_levee_uncle": {
  "file": "assets/npcs/npc_levee_uncle.png",
  "type": "single",
  "frameW": 27,
  "frameH": 50
 },
 "npc_opera_actor": {
  "file": "assets/npcs/npc_opera_actor.png",
  "type": "single",
  "frameW": 43,
  "frameH": 50
 },
 "npc_sa_fisher": {
  "file": "assets/npcs/npc_sa_fisher.png",
  "type": "single",
  "frameW": 37,
  "frameH": 50
 },
 "npc_scallion_farmer": {
  "file": "assets/npcs/npc_scallion_farmer.png",
  "type": "single",
  "frameW": 40,
  "frameH": 50
 },
 "npc_trail_volunteer": {
  "file": "assets/npcs/npc_trail_volunteer.png",
  "type": "single",
  "frameW": 33,
  "frameH": 50
 },
 "npc_yilan_vendor": {
  "file": "assets/npcs/npc_yilan_vendor.png",
  "type": "single",
  "frameW": 42,
  "frameH": 50
 },
 "item_dawn_shard_n": {
  "file": "assets/items/item_dawn_shard_n.png",
  "type": "icon",
  "frameW": 31,
  "frameH": 32
 },
 "item_kumquat": {
  "file": "assets/items/item_kumquat.png",
  "type": "icon",
  "frameW": 36,
  "frameH": 32
 },
 "item_pinwheel": {
  "file": "assets/items/item_pinwheel.png",
  "type": "icon",
  "frameW": 26,
  "frameH": 32
 },
 "item_rainbow_piece": {
  "file": "assets/items/item_rainbow_piece.png",
  "type": "icon",
  "frameW": 32,
  "frameH": 32
 },
 "item_tea_leaf": {
  "file": "assets/items/item_tea_leaf.png",
  "type": "icon",
  "frameW": 30,
  "frameH": 32
 },
 "item_ticket": {
  "file": "assets/items/item_ticket.png",
  "type": "icon",
  "frameW": 37,
  "frameH": 32
 },
 "npc_bt_museum_guide": {
  "file": "assets/npcs/npc_bt_museum_guide.png",
  "type": "single",
  "frameW": 40,
  "frameH": 50
 },
 "npc_culture_guide": {
  "file": "assets/npcs/npc_culture_guide.png",
  "type": "single",
  "frameW": 31,
  "frameH": 50
 },
 "npc_dihua_shop": {
  "file": "assets/npcs/npc_dihua_shop.png",
  "type": "single",
  "frameW": 37,
  "frameH": 50
 },
 "npc_geo_ranger": {
  "file": "assets/npcs/npc_geo_ranger.png",
  "type": "single",
  "frameW": 37,
  "frameH": 50
 },
 "npc_gondola_staff": {
  "file": "assets/npcs/npc_gondola_staff.png",
  "type": "single",
  "frameW": 38,
  "frameH": 50
 },
 "npc_hc_guide": {
  "file": "assets/npcs/npc_hc_guide.png",
  "type": "single",
  "frameW": 43,
  "frameH": 50
 },
 "npc_noodle_master": {
  "file": "assets/npcs/npc_noodle_master.png",
  "type": "single",
  "frameW": 50,
  "frameH": 50
 },
 "npc_observatory_staff": {
  "file": "assets/npcs/npc_observatory_staff.png",
  "type": "single",
  "frameW": 33,
  "frameH": 50
 },
 "npc_reservoir_keeper": {
  "file": "assets/npcs/npc_reservoir_keeper.png",
  "type": "single",
  "frameW": 33,
  "frameH": 50
 },
 "npc_tea_farmer": {
  "file": "assets/npcs/npc_tea_farmer.png",
  "type": "single",
  "frameW": 32,
  "frameH": 50
 },
 "npc_tea_farmer_mk": {
  "file": "assets/npcs/npc_tea_farmer_mk.png",
  "type": "single",
  "frameW": 31,
  "frameH": 50
 },
 "npc_temple_volunteer_ht": {
  "file": "assets/npcs/npc_temple_volunteer_ht.png",
  "type": "single",
  "frameW": 34,
  "frameH": 50
 },
 "npc_temple_volunteer_zn": {
  "file": "assets/npcs/npc_temple_volunteer_zn.png",
  "type": "single",
  "frameW": 29,
  "frameH": 50
 },
 "npc_tofu_shop": {
  "file": "assets/npcs/npc_tofu_shop.png",
  "type": "single",
  "frameW": 34,
  "frameH": 50
 },
 "npc_traffic_volunteer": {
  "file": "assets/npcs/npc_traffic_volunteer.png",
  "type": "single",
  "frameW": 38,
  "frameH": 50
 },
 "npc_village_guide": {
  "file": "assets/npcs/npc_village_guide.png",
  "type": "single",
  "frameW": 31,
  "frameH": 50
 },
 "npc_wood_artisan": {
  "file": "assets/npcs/npc_wood_artisan.png",
  "type": "single",
  "frameW": 29,
  "frameH": 50
 },
 "boss_ghb_lantern": {
  "file": "assets/monsters/boss_ghb_lantern.png",
  "type": "single",
  "frameW": 161,
  "frameH": 160
 },
 "boss_mb_train": {
  "file": "assets/monsters/boss_mb_train.png",
  "type": "single",
  "frameW": 161,
  "frameH": 160
 },
 "mon_an_egret": {
  "file": "assets/monsters/mon_an_egret.png",
  "type": "single",
  "frameW": 96,
  "frameH": 96
 },
 "mon_dj_rush": {
  "file": "assets/monsters/mon_dj_rush.png",
  "type": "single",
  "frameW": 99,
  "frameH": 96
 },
 "mon_dj_taro": {
  "file": "assets/monsters/mon_dj_taro.png",
  "type": "single",
  "frameW": 104,
  "frameH": 96
 },
 "mon_gh_civet": {
  "file": "assets/monsters/mon_gh_civet.png",
  "type": "single",
  "frameW": 101,
  "frameH": 96
 },
 "mon_gh_geta": {
  "file": "assets/monsters/mon_gh_geta.png",
  "type": "single",
  "frameW": 103,
  "frameH": 96
 },
 "mon_gh_lantern": {
  "file": "assets/monsters/mon_gh_lantern.png",
  "type": "single",
  "frameW": 90,
  "frameH": 96
 },
 "mon_gh_umbrella": {
  "file": "assets/monsters/mon_gh_umbrella.png",
  "type": "single",
  "frameW": 93,
  "frameH": 96
 },
 "mon_ml_berry": {
  "file": "assets/monsters/mon_ml_berry.png",
  "type": "single",
  "frameW": 99,
  "frameH": 96
 },
 "mon_ml_signal": {
  "file": "assets/monsters/mon_ml_signal.png",
  "type": "single",
  "frameW": 80,
  "frameH": 96
 },
 "npc_berry_farmer": {
  "file": "assets/npcs/npc_berry_farmer.png",
  "type": "single",
  "frameW": 32,
  "frameH": 50
 },
 "npc_conservation_guide": {
  "file": "assets/npcs/npc_conservation_guide.png",
  "type": "single",
  "frameW": 29,
  "frameH": 50
 },
 "npc_float_master": {
  "file": "assets/npcs/npc_float_master.png",
  "type": "single",
  "frameW": 32,
  "frameH": 50
 },
 "npc_grocer_bg": {
  "file": "assets/npcs/npc_grocer_bg.png",
  "type": "single",
  "frameW": 32,
  "frameH": 50
 },
 "npc_leopardcat_cub": {
  "file": "assets/npcs/npc_leopardcat_cub.png",
  "type": "single",
  "frameW": 22,
  "frameH": 28
 },
 "npc_lk_guide": {
  "file": "assets/npcs/npc_lk_guide.png",
  "type": "single",
  "frameW": 42,
  "frameH": 50
 },
 "npc_oil_shop": {
  "file": "assets/npcs/npc_oil_shop.png",
  "type": "single",
  "frameW": 30,
  "frameH": 50
 },
 "npc_old_stationmaster": {
  "file": "assets/npcs/npc_old_stationmaster.png",
  "type": "single",
  "frameW": 34,
  "frameH": 50
 },
 "npc_pastry_lk": {
  "file": "assets/npcs/npc_pastry_lk.png",
  "type": "single",
  "frameW": 36,
  "frameH": 50
 },
 "npc_pastry_shop": {
  "file": "assets/npcs/npc_pastry_shop.png",
  "type": "single",
  "frameW": 32,
  "frameH": 50
 },
 "npc_rush_weaver": {
  "file": "assets/npcs/npc_rush_weaver.png",
  "type": "single",
  "frameW": 32,
  "frameH": 50
 },
 "npc_temple_elder": {
  "file": "assets/npcs/npc_temple_elder.png",
  "type": "single",
  "frameW": 35,
  "frameH": 50
 },
 "npc_umbrella_shop": {
  "file": "assets/npcs/npc_umbrella_shop.png",
  "type": "single",
  "frameW": 42,
  "frameH": 50
 },
 "npc_volunteer_ct": {
  "file": "assets/npcs/npc_volunteer_ct.png",
  "type": "single",
  "frameW": 29,
  "frameH": 50
 },
 "npc_volunteer_lk": {
  "file": "assets/npcs/npc_volunteer_lk.png",
  "type": "single",
  "frameW": 29,
  "frameH": 50
 },
 "npc_volunteer_wd": {
  "file": "assets/npcs/npc_volunteer_wd.png",
  "type": "single",
  "frameW": 29,
  "frameH": 50
 },
 "npc_volunteer_zl": {
  "file": "assets/npcs/npc_volunteer_zl.png",
  "type": "single",
  "frameW": 29,
  "frameH": 50
 },
 "npc_wood_carver": {
  "file": "assets/npcs/npc_wood_carver.png",
  "type": "single",
  "frameW": 35,
  "frameH": 50
 },
 "item_dawn_shard_c": {
 "file": "assets/items/item_dawn_shard_c.png",
 "type": "icon",
 "frameW": 31,
 "frameH": 32
},
 "item_lantern_paper": {
  "file": "assets/items/item_lantern_paper.png",
  "type": "icon",
  "frameW": 34,
  "frameH": 32
 },
 "item_rush_rope": {
  "file": "assets/items/item_rush_rope.png",
  "type": "icon",
  "frameW": 30,
  "frameH": 32
 },
 "item_train_whistle": {
  "file": "assets/items/item_train_whistle.png",
  "type": "icon",
  "frameW": 17,
  "frameH": 32
 },
 "item_umbrella_rib": {
  "file": "assets/items/item_umbrella_rib.png",
  "type": "icon",
  "frameW": 30,
  "frameH": 32
 },
 "boss_mb_lantern": {
  "file": "assets/monsters/boss_mb_lantern.png",
  "type": "single",
  "frameW": 161,
  "frameH": 160
 },
 "hero_battle_master": {
  "file": "assets/chars/hero_battle_master.png",
  "type": "walk",
  "frameW": 36,
  "frameH": 50,
  "rows": [
   "down",
   "left",
   "right",
   "up"
  ]
 },
 "heroM_battle_master": {
  "file": "assets/chars/heroM_battle_master.png",
  "type": "walk",
  "frameW": 30,
  "frameH": 50,
  "rows": [
   "down",
   "left",
   "right",
   "up"
  ]
 },
 "hero_magic_knight": {
  "file": "assets/chars/hero_magic_knight.png",
  "type": "walk",
  "frameW": 36,
  "frameH": 50,
  "rows": [
   "down",
   "left",
   "right",
   "up"
  ]
 },
 "heroM_magic_knight": {
  "file": "assets/chars/heroM_magic_knight.png",
  "type": "walk",
  "frameW": 32,
  "frameH": 50,
  "rows": [
   "down",
   "left",
   "right",
   "up"
  ]
 },
 "hero_sage": {
  "file": "assets/chars/hero_sage.png",
  "type": "walk",
  "frameW": 37,
  "frameH": 50,
  "rows": [
   "down",
   "left",
   "right",
   "up"
  ]
 },
 "heroM_sage": {
  "file": "assets/chars/heroM_sage.png",
  "type": "walk",
  "frameW": 35,
  "frameH": 50,
  "rows": [
   "down",
   "left",
   "right",
   "up"
  ]
 },
 "hero_paladin": {
  "file": "assets/chars/hero_paladin.png",
  "type": "walk",
  "frameW": 35,
  "frameH": 50,
  "rows": [
   "down",
   "left",
   "right",
   "up"
  ]
 },
 "heroM_paladin": {
  "file": "assets/chars/heroM_paladin.png",
  "type": "walk",
  "frameW": 33,
  "frameH": 50,
  "rows": [
   "down",
   "left",
   "right",
   "up"
  ]
 },
 "hero_superstar": {
  "file": "assets/chars/hero_superstar.png",
  "type": "walk",
  "frameW": 35,
  "frameH": 50,
  "rows": [
   "down",
   "left",
   "right",
   "up"
  ]
 },
 "heroM_superstar": {
  "file": "assets/chars/heroM_superstar.png",
  "type": "walk",
  "frameW": 31,
  "frameH": 50,
  "rows": [
   "down",
   "left",
   "right",
   "up"
  ]
 },
 "hero_monster_hunter": {
  "file": "assets/chars/hero_monster_hunter.png",
  "type": "walk",
  "frameW": 39,
  "frameH": 50,
  "rows": [
   "down",
   "left",
   "right",
   "up"
  ]
 },
 "heroM_monster_hunter": {
  "file": "assets/chars/heroM_monster_hunter.png",
  "type": "walk",
  "frameW": 35,
  "frameH": 50,
  "rows": [
   "down",
   "left",
   "right",
   "up"
  ]
 },
 "hero_pirate": {
  "file": "assets/chars/hero_pirate.png",
  "type": "walk",
  "frameW": 37,
  "frameH": 50,
  "rows": [
   "down",
   "left",
   "right",
   "up"
  ]
 },
 "heroM_pirate": {
  "file": "assets/chars/heroM_pirate.png",
  "type": "walk",
  "frameW": 37,
  "frameH": 50,
  "rows": [
   "down",
   "left",
   "right",
   "up"
  ]
 },
 "hero_ranger": {
  "file": "assets/chars/hero_ranger.png",
  "type": "walk",
  "frameW": 39,
  "frameH": 50,
  "rows": [
   "down",
   "left",
   "right",
   "up"
  ]
 },
 "heroM_ranger": {
  "file": "assets/chars/heroM_ranger.png",
  "type": "walk",
  "frameW": 37,
  "frameH": 50,
  "rows": [
   "down",
   "left",
   "right",
   "up"
  ]
 },
 "mon_al_cypress": {
  "file": "assets/monsters/mon_al_cypress.png",
  "type": "single",
  "frameW": 123,
  "frameH": 96
 },
 "mon_al_cloud": {
  "file": "assets/monsters/mon_al_cloud.png",
  "type": "single",
  "frameW": 96,
  "frameH": 96
 },
 "mon_pi_hermit": {
  "file": "assets/monsters/mon_pi_hermit.png",
  "type": "single",
  "frameW": 92,
  "frameH": 96
 },
 "mon_pi_milkfish": {
  "file": "assets/monsters/mon_pi_milkfish.png",
  "type": "single",
  "frameW": 82,
  "frameH": 96
 },
 "mon_pi_anchor": {
  "file": "assets/monsters/mon_pi_anchor.png",
  "type": "single",
  "frameW": 97,
  "frameH": 96
 },
 "mon_pib_anchor": {
  "file": "assets/monsters/mon_pib_anchor.png",
  "type": "single",
  "frameW": 127,
  "frameH": 128
 },
 "mon_pi_crab": {
  "file": "assets/monsters/mon_pi_crab.png",
  "type": "single",
  "frameW": 97,
  "frameH": 96
 },
 "mon_mm_mudstone": {
  "file": "assets/monsters/mon_mm_mudstone.png",
  "type": "single",
  "frameW": 92,
  "frameH": 96
 },
 "mon_ds_pineapple": {
  "file": "assets/monsters/mon_ds_pineapple.png",
  "type": "single",
  "frameW": 97,
  "frameH": 96
 },
 "mon_ds_lychee": {
  "file": "assets/monsters/mon_ds_lychee.png",
  "type": "single",
  "frameW": 104,
  "frameH": 96
 },
 "mon_pi_parrot": {
  "file": "assets/monsters/mon_pi_parrot.png",
  "type": "single",
  "frameW": 92,
  "frameH": 96
 },
 "mon_pi_octo": {
  "file": "assets/monsters/mon_pi_octo.png",
  "type": "single",
  "frameW": 100,
  "frameH": 96
 },
 "mon_wx_wave": {
  "file": "assets/monsters/mon_wx_wave.png",
  "type": "single",
  "frameW": 97,
  "frameH": 96
 },
 "boss_pib_ship": {
  "file": "assets/monsters/boss_pib_ship.png",
  "type": "single",
  "frameW": 160,
  "frameH": 160
 },
 "npc_forest_rail": {
  "file": "assets/npcs/npc_forest_rail.png",
  "type": "single",
  "frameW": 45,
  "frameH": 50
 },
 "npc_harbor_clerk": {
  "file": "assets/npcs/npc_harbor_clerk.png",
  "type": "single",
  "frameW": 25,
  "frameH": 50
 },
 "npc_fort_guide": {
  "file": "assets/npcs/npc_fort_guide.png",
  "type": "single",
  "frameW": 43,
  "frameH": 50
 },
 "npc_oldhouse_grandpa": {
  "file": "assets/npcs/npc_oldhouse_grandpa.png",
  "type": "single",
  "frameW": 39,
  "frameH": 50
 },
 "npc_wetland_ranger": {
  "file": "assets/npcs/npc_wetland_ranger.png",
  "type": "single",
  "frameW": 29,
  "frameH": 50
 },
 "npc_volunteer_lem": {
  "file": "assets/npcs/npc_volunteer_lem.png",
  "type": "single",
  "frameW": 29,
  "frameH": 50
 },
 "npc_rail_fan": {
  "file": "assets/npcs/npc_rail_fan.png",
  "type": "single",
  "frameW": 31,
  "frameH": 50
 },
 "npc_pineapple_farmer": {
  "file": "assets/npcs/npc_pineapple_farmer.png",
  "type": "single",
  "frameW": 29,
  "frameH": 50
 },
 "npc_lychee_farmer": {
  "file": "assets/npcs/npc_lychee_farmer.png",
  "type": "single",
  "frameW": 35,
  "frameH": 50
 },
 "npc_volunteer_fgs": {
  "file": "assets/npcs/npc_volunteer_fgs.png",
  "type": "single",
  "frameW": 27,
  "frameH": 50
 },
 "npc_turtle_volunteer": {
  "file": "assets/npcs/npc_turtle_volunteer.png",
  "type": "single",
  "frameW": 43,
  "frameH": 50
 },
 "npc_island_guide": {
  "file": "assets/npcs/npc_island_guide.png",
  "type": "single",
  "frameW": 45,
  "frameH": 50
 },
 "npc_ticket_seller": {
  "file": "assets/npcs/npc_ticket_seller.png",
  "type": "single",
  "frameW": 36,
  "frameH": 50
 },
 "npc_lighthouse_keeper": {
  "file": "assets/npcs/npc_lighthouse_keeper.png",
  "type": "single",
  "frameW": 31,
  "frameH": 50
 },
 "npc_oldcity_guide": {
  "file": "assets/npcs/npc_oldcity_guide.png",
  "type": "single",
  "frameW": 47,
  "frameH": 50
 },
 "npc_fog_kid": {
  "file": "assets/npcs/npc_fog_kid.png",
  "type": "walk",
  "frameW": 29,
  "frameH": 30,
  "rows": [
   "down",
   "left",
   "right",
   "up"
  ]
 },
 "npc_spoonbill": {
  "file": "assets/npcs/npc_spoonbill.png",
  "type": "walk",
  "frameW": 33,
  "frameH": 38,
  "rows": [
   "down",
   "left",
   "right",
   "up"
  ]
 },
 "npc_green_turtle": {
  "file": "assets/npcs/npc_green_turtle.png",
  "type": "walk",
  "frameW": 26,
  "frameH": 32,
  "rows": [
   "down",
   "left",
   "right",
   "up"
  ]
 },
 "item_memory_shell": {
  "file": "assets/items/item_memory_shell.png",
  "type": "icon",
  "frameW": 33,
  "frameH": 32
 },
 "item_chart_piece": {
  "file": "assets/items/item_chart_piece.png",
  "type": "icon",
  "frameW": 31,
  "frameH": 32
 },
 "item_sea_chart": {
  "file": "assets/items/item_sea_chart.png",
  "type": "icon",
  "frameW": 34,
  "frameH": 32
 },
 "item_pineapple": {
  "file": "assets/items/item_pineapple.png",
  "type": "icon",
  "frameW": 23,
  "frameH": 32
 },
 "item_sea_glass": {
  "file": "assets/items/item_sea_glass.png",
  "type": "icon",
  "frameW": 35,
  "frameH": 32
 },
 "item_ferry_ticket": {
  "file": "assets/items/item_ferry_ticket.png",
  "type": "icon",
  "frameW": 36,
  "frameH": 32
 },
 "item_dawn_shard_s": {
 "file": "assets/items/item_dawn_shard_s.png",
 "type": "icon",
 "frameW": 31,
 "frameH": 32
},
 "item_gear_z8_blade": {
  "file": "assets/items/item_gear_z8_blade.png",
  "type": "icon",
  "frameW": 33,
  "frameH": 32
 },
 "item_gear_z9_vest": {
  "file": "assets/items/item_gear_z9_vest.png",
  "type": "icon",
  "frameW": 38,
  "frameH": 32
 },
 "item_gear_z10_cutlass": {
  "file": "assets/items/item_gear_z10_cutlass.png",
  "type": "icon",
  "frameW": 35,
  "frameH": 32
 },
 "mon_wx_rain_e": {
  "file": "assets/monsters/mon_wx_rain_e.png",
  "type": "single",
  "frameW": 107,
  "frameH": 96
 },
 "mon_wx_rainbow": {
  "file": "assets/monsters/mon_wx_rainbow.png",
  "type": "single",
  "frameW": 115,
  "frameH": 96
 },
 "mon_wx_wave_e": {
  "file": "assets/monsters/mon_wx_wave_e.png",
  "type": "single",
  "frameW": 97,
  "frameH": 96
 },
 "mon_an_macaque": {
  "file": "assets/monsters/mon_an_macaque.png",
  "type": "single",
  "frameW": 103,
  "frameH": 96
 },
 "boss_fob_balloon": {
  "file": "assets/monsters/boss_fob_balloon.png",
  "type": "single",
  "frameW": 161,
  "frameH": 160
 },
 "boss_wxb_whale": {
  "file": "assets/monsters/boss_wxb_whale.png",
  "type": "single",
  "frameW": 164,
  "frameH": 160
 },
 "npc_ruins_guide": {
  "file": "assets/npcs/npc_ruins_guide.png",
  "type": "single",
  "frameW": 45,
  "frameH": 50
 },
 "npc_balloon_captain": {
  "file": "assets/npcs/npc_balloon_captain.png",
  "type": "single",
  "frameW": 43,
  "frameH": 50
 },
 "npc_custard_farmer": {
  "file": "assets/npcs/npc_custard_farmer.png",
  "type": "single",
  "frameW": 31,
  "frameH": 50
 },
 "npc_ticket_seller_fg": {
  "file": "assets/npcs/npc_ticket_seller_fg.png",
  "type": "single",
  "frameW": 42,
  "frameH": 50
 },
 "npc_lighthouse_guide_gi": {
  "file": "assets/npcs/npc_lighthouse_guide_gi.png",
  "type": "single",
  "frameW": 41,
  "frameH": 50
 },
 "npc_onsen_keeper_gi": {
  "file": "assets/npcs/npc_onsen_keeper_gi.png",
  "type": "single",
  "frameW": 33,
  "frameH": 50
 },
 "npc_oldhouse_gi": {
  "file": "assets/npcs/npc_oldhouse_gi.png",
  "type": "single",
  "frameW": 30,
  "frameH": 50
 },
 "npc_ice_shop_gi": {
  "file": "assets/npcs/npc_ice_shop_gi.png",
  "type": "single",
  "frameW": 26,
  "frameH": 50
 },
 "npc_tao_guide": {
  "file": "assets/npcs/npc_tao_guide.png",
  "type": "single",
  "frameW": 34,
  "frameH": 50
 },
 "npc_station_hl": {
  "file": "assets/npcs/npc_station_hl.png",
  "type": "single",
  "frameW": 43,
  "frameH": 50
 },
 "npc_taroko_ranger": {
  "file": "assets/npcs/npc_taroko_ranger.png",
  "type": "single",
  "frameW": 32,
  "frameH": 50
 },
 "npc_fisher_hl": {
  "file": "assets/npcs/npc_fisher_hl.png",
  "type": "single",
  "frameW": 36,
  "frameH": 50
 },
 "npc_road_engineer": {
  "file": "assets/npcs/npc_road_engineer.png",
  "type": "single",
  "frameW": 35,
  "frameH": 50
 },
 "npc_stone_carver": {
  "file": "assets/npcs/npc_stone_carver.png",
  "type": "single",
  "frameW": 34,
  "frameH": 50
 },
 "npc_mochi_shop": {
  "file": "assets/npcs/npc_mochi_shop.png",
  "type": "single",
  "frameW": 32,
  "frameH": 50
 },
 "npc_inn_taitung_m": {
  "file": "assets/npcs/npc_inn_taitung_m.png",
  "type": "single",
  "frameW": 32,
  "frameH": 50
 },
 "npc_inn_greenisland_m": {
  "file": "assets/npcs/npc_inn_greenisland_m.png",
  "type": "single",
  "frameW": 33,
  "frameH": 50
 },
 "npc_inn_lanyu_m": {
  "file": "assets/npcs/npc_inn_lanyu_m.png",
  "type": "single",
  "frameW": 31,
  "frameH": 50
 },
 "npc_inn_hualien_m": {
  "file": "assets/npcs/npc_inn_hualien_m.png",
  "type": "single",
  "frameW": 29,
  "frameH": 50
 },
 "item_rainbow_ribbon": {
  "file": "assets/items/item_rainbow_ribbon.png",
  "type": "icon",
  "frameW": 41,
  "frameH": 32
 },
 "item_balloon_knot": {
  "file": "assets/items/item_balloon_knot.png",
  "type": "icon",
  "frameW": 38,
  "frameH": 32
 },
 "item_dawn_shard_e": {
 "file": "assets/items/item_dawn_shard_e.png",
 "type": "icon",
 "frameW": 31,
 "frameH": 32
},
 "item_ferry_ticket_gi": {
  "file": "assets/items/item_ferry_ticket_gi.png",
  "type": "icon",
  "frameW": 44,
  "frameH": 32
 },
 "item_ferry_ticket_ly": {
  "file": "assets/items/item_ferry_ticket_ly.png",
  "type": "icon",
  "frameW": 35,
  "frameH": 32
 },
 "item_seaweed_ice": {
  "file": "assets/items/item_seaweed_ice.png",
  "type": "icon",
  "frameW": 29,
  "frameH": 32
 },
 "item_mochi": {
  "file": "assets/items/item_mochi.png",
  "type": "icon",
  "frameW": 43,
  "frameH": 32
 },
 "item_gear_z11_cloak": {
  "file": "assets/items/item_gear_z11_cloak.png",
  "type": "icon",
  "frameW": 42,
  "frameH": 32
 },
 "item_gear_z12_marble": {
  "file": "assets/items/item_gear_z12_marble.png",
  "type": "icon",
  "frameW": 34,
  "frameH": 32
 } ,
 // v4.1 中橫・南投：現有圖接線與兩倍最近鄰羅盤。
 "mon_wx_snow": {
 "file": "assets/monsters/mon_wx_snow.png",
 "type": "single",
 "frameW": 90,
 "frameH": 90
},
 "mon_fo_puff": {
 "file": "assets/monsters/mon_fo_puff.png",
 "type": "single",
 "frameW": 88,
 "frameH": 80
},
 "mon_gh_bamboo": {
 "file": "assets/monsters/mon_gh_bamboo.png",
 "type": "single",
 "frameW": 84,
 "frameH": 96
},
 "mon_gh_cone": {
 "file": "assets/monsters/mon_gh_cone.png",
 "type": "single",
 "frameW": 92,
 "frameH": 80
},
 "boss_ghb_civetboss": {
 "file": "assets/monsters/boss_ghb_civetboss.png",
 "type": "single",
 "frameW": 175,
 "frameH": 160
},
 "mon_gh_lantern_f": {
 "file": "assets/monsters/mon_gh_lantern_f.png",
 "type": "single",
 "frameW": 90,
 "frameH": 96
},
 "mon_gh_umbrella_f": {
 "file": "assets/monsters/mon_gh_umbrella_f.png",
 "type": "single",
 "frameW": 93,
 "frameH": 96
},
 "mon_gh_geta_f": {
 "file": "assets/monsters/mon_gh_geta_f.png",
 "type": "single",
 "frameW": 103,
 "frameH": 96
},
 "mon_gh_civet_f": {
 "file": "assets/monsters/mon_gh_civet_f.png",
 "type": "single",
 "frameW": 101,
 "frameH": 96
},
 "boss_ghb_civetboss_s2": {
 "file": "assets/monsters/boss_ghb_civetboss_s2.png",
 "type": "single",
 "frameW": 175,
 "frameH": 160
},
 "npc_road_engineer_cc": {
 "file": "assets/npcs/npc_road_engineer_cc.png",
 "type": "single",
 "frameW": 29,
 "frameH": 50
},
 "npc_lodge_keeper_hh": {
 "file": "assets/npcs/npc_lodge_keeper_hh.png",
 "type": "single",
 "frameW": 29,
 "frameH": 50
},
 "npc_wuling_guide": {
 "file": "assets/npcs/npc_wuling_guide.png",
 "type": "single",
 "frameW": 32,
 "frameH": 50
},
 "npc_veg_farmer": {
 "file": "assets/npcs/npc_veg_farmer.png",
 "type": "single",
 "frameW": 30,
 "frameH": 50
},
 "npc_road_veteran": {
 "file": "assets/npcs/npc_road_veteran.png",
 "type": "single",
 "frameW": 36,
 "frameH": 50
},
 "npc_center_volunteer": {
 "file": "assets/npcs/npc_center_volunteer.png",
 "type": "single",
 "frameW": 40,
 "frameH": 50
},
 "npc_paper_master": {
 "file": "assets/npcs/npc_paper_master.png",
 "type": "single",
 "frameW": 29,
 "frameH": 50
},
 "npc_jiaobai_farmer": {
 "file": "assets/npcs/npc_jiaobai_farmer.png",
 "type": "single",
 "frameW": 37,
 "frameH": 50
},
 "npc_inn_puli_m": {
 "file": "assets/npcs/npc_inn_puli_m.png",
 "type": "single",
 "frameW": 29,
 "frameH": 50
},
 "npc_forest_guide_xt": {
 "file": "assets/npcs/npc_forest_guide_xt.png",
 "type": "single",
 "frameW": 36,
 "frameH": 50
},
 "npc_lantern_shop": {
 "file": "assets/npcs/npc_lantern_shop.png",
 "type": "single",
 "frameW": 31,
 "frameH": 50
},
 "npc_tea_farmer_lg": {
 "file": "assets/npcs/npc_tea_farmer_lg.png",
 "type": "single",
 "frameW": 32,
 "frameH": 50
},
 "npc_inn_xitou_m": {
 "file": "assets/npcs/npc_inn_xitou_m.png",
 "type": "single",
 "frameW": 40,
 "frameH": 50
},
 "item_snow_crystal": {
 "file": "assets/items/item_snow_crystal.png",
 "type": "icon",
 "frameW": 29,
 "frameH": 32
},
 "item_bamboo_husk": {
 "file": "assets/items/item_bamboo_husk.png",
 "type": "icon",
 "frameW": 28,
 "frameH": 32
},
 "item_cedar_cone": {
 "file": "assets/items/item_cedar_cone.png",
 "type": "icon",
 "frameW": 27,
 "frameH": 32
},
 "item_small_lantern": {
 "file": "assets/items/item_small_lantern.png",
 "type": "icon",
 "frameW": 22,
 "frameH": 32
},
 "item_forest_lantern": {
 "file": "assets/items/item_forest_lantern.png",
 "type": "icon",
 "frameW": 26,
 "frameH": 32
},
 "item_dawn_compass": {
 "file": "assets/items/item_dawn_compass.png",
 "type": "icon",
 "frameW": 29,
 "frameH": 32
},
 "item_gear_z13_coat": {
 "file": "assets/items/item_gear_z13_coat.png",
 "type": "icon",
 "frameW": 36,
 "frameH": 32
},
 "npc_dawn_ring_pu": {
 "file": "assets/npcs/npc_dawn_ring_pu.png",
 "type": "single",
 "frameW": 58,
 "frameH": 64
}
};
