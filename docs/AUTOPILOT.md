# Autopilot: long unattended rounds

This file is the queue and the state for rounds when the user is away. Any session (or a heartbeat
prompt after a context reset or a usage-limit pause) resumes from here: read this file, pick the first unchecked
task whose prerequisites are done, work it through to a verified result, commit and push, tick it off, then go on.

Rules for unattended work (from the user and from memory):

- Quality bar: King's Landing detail; no copy-paste look; verify with renders/QA before calling anything done.
- In-game checks only when the user is not playing (`tasklist` shows no javaw that the user started, no recent
  input). Screenshots of the game window only (`dev/screen_shot.ps1`).
- Heavy data on D:; commit code and docs on `main`, push after each unit.
- Keep a written trail: findings go into the docs named per task, not only into chat.
- Things that are the user's to decide (deleting old saves, big visual direction changes) are staged and listed
  under "Waiting for the user" below, not done.

## Round of 2026-09-25 (user away ~10 h from ~05:00)

Order agreed from the user's message (Thai, 2026-09-25 ~04:50):

1. [~] **KL seam.** Done on D: (world + town backup) 2026-09-25 06:50, `dev/worldgen/seam.py`; QA 7 water-wall
   columns, ~190 steps of 4+ (mostly where our old rivers' banks meet). Still to do: install into the save,
   look in game once trees have grown in. Old task text: The King's Landing stamp (`stamps.json` `kings_landing_austrum`, target x -1248..1167,
   z -2784..-1009) shows its box: water walls and cliffs along the cut, a visible frame in
   `D:/Minaria/world/minaria/continent_preview.png`. Cut back the ragged border, blend terrain both ways, and grow
   the outer landscape (fields, hedgerows, lanes, farmsteads, woods) across the seam so the paste can't be seen.
2. [x] **KL outer ring study.** Done 2026-09-25 07:40: `docs/OUTSKIRTS.md` (belts, field shapes, trades, rules),
   `dev/worldgen/outskirts.py` (study, trades). Old task text: Catalogue everything outside the KL walls: farms and field patterns, orchards,
   gardens, windmills, brickworks/kilns, tanneries, manors, hamlets, docks, roadside inns. Output a piece library
   (`kl_library` style) + `docs/OUTSKIRTS.md` with the rules (what goes near which gate, spacing, slope handling).
3. [~] **Outskirts jigsaw.** First version 2026-09-25 07:35: `dev/worldgen/country.py` (gate roads carried on,
   a ring lane, lanes off them, furlong strip fields, farmsteads with yard, kitchen garden and orchard, roadside
   suburb), run after each town by `settlements.py build`. Tried on Aileau (D: world only). Next: look in game,
   hamlets in the wood belt, a manor, castle-town variant, variety (task 4). Old task text: Use the library to build the land outside the walls for capitals and for castle towns
   (and castle-less towns, scaled down so it is plausible). Stepped ground must be handled (terraces, retaining
   walls, no floating, no cut pieces).
4. [~] **Variety.** Walls per state (`walls.CULTURES`: stone family, roof slate, merlons, plinth), seen in game
   on Aileau (Valaria: pale limestone, blue slate) 2026-09-25 08:00. Three-field rotation in the country. Still:
   palette swaps of the pieces themselves per culture. Old task text: Palette swaps and rotations for jigsaw pieces; each city its own wall colour/material and
   identity from terrain, state and history (lore in `docs/LORE_MAP.md`, `docs/MINARIA_BIBLE.md`).
5. [~] **Dynamic Trees everywhere** — `dt_trees.py` harvests the game's own DT trees from the save (656, 14
   families) and plants them whole; towns now plant DT instead of drawn trees (seen in game on Aileau);
   `static_trees.py` swaps static trees for DT (next: King's Landing outside the walls). Mahogany leaves fixed
   (`Minaria Fixes.zip`). Old task text: (user marked important). Fix broken DT leaves (see findings), make DT species
   for tree mods that lack them, and convert the static trees already written into the pre-built world.
6. [x] Rebuilt all 99 settlements with their countries (one process per settlement), QA + `qa-fix`: 0 wall
   gaps, 0 air under pieces, 1 floating part (3 blocks) left of 172; installed into the save with Dragonstone
   (269 regions; the save's own copies in `D:/Minaria/world/save_backup_before_install`). Rebuilt again with the
   slope limit run to convergence: street steps 1,701 -> 515 (Lutesk 150 -> 0); installed (265 regions).
   Left: 5-10 block jumps at a few squares and under arches (Meyask 64, Milev 62, Bozieville 60). Old task text: Rebuild all settlements, QA, install, look in game (the earlier steps 2-4).
7. [x] Tectonic / Better Blending: kept. Better Blending is client-only rendering (softens block seams; no world
   effect). Tectonic only shapes chunks the game itself generates: beyond the WorldPainter continent. Its cost
   on fresh chunks is in PERFORMANCE.md (kept with the minaria_perf fixes). Committed 2026-09-25.
8. [x] **Proposal only:** `docs/GRAND_CITIES.md` (Dragonstone on the Wound island, Lutesk to capital scale;
   the rest of WesterosCraft is not released). Old task text: grand city schematics to add later (KL-class detail). A written shortlist with sources,
   licences, sizes, and where each would sit on the continent. Do not install.
9. [~] Ongoing (`docs/IDEAS.md` started): references (other builders, other games' lore) into `docs/IDEAS.md`.

10. [ ] **City plan** (`docs/CITY_PLAN.md`, asked 2026-09-25 evening): Lutesk as a KL-class capital; civic
    buildings in every town (merchant guild, adventurers' guild, bank, manors, noble house, barracks) in 3-5
    variants from KL, CTOV, Grand Capitals, taverns; fit-out interiors that work with MCA/Bountiful/Lootr;
    Supplementaries dressing everywhere; faster test loop (previews, one-town sandbox, parallel builds).
    2026-09-25 night: sandbox + parallel builds done; civic placement (town.place_civic, QA civic_missing);
    fit-out + dressing (fitout.py) for towns, country pieces and King's Landing (tried on a KL copy: 158 rooms,
    436 doors); hamlets get a village-mod building, windmills in the fields; Lutesk tier -> capital (sandbox:
    bank and lord's house missing on the slopes, 2 wall gaps where the ring climbs a cliff: being fixed).
    2026-09-26 00:00-02:00: full build (98 towns in 20 min, 3 at a time) + KL fit-out, QA (street steps 231,
    wall gaps only Lutesk, Milev lacks guild halls), installed (298 regions; the save's own copies in
    save_backup_before_install/2026-09-26). Tour: Lutesk's ring ran up the mountain (walls 60-150 tall);
    fixed step by step (ring keeps off slopes > 0.6, wall height from the street inside, rock scarp under
    hillside walls), Lutesk group rebuilt and installed again. Open: the rock scarp reads as a square block
    (needs a sloped glacis), Milev's two guild halls, the in-game look of the fit-out in towns.

11. [ ] **Gameplay structure** (asked 2026-09-26): lore v0.2 in `MINARIA_BIBLE.md` (the ten houses placed in the six
    states, starting politics, calendar, magic mods by faction, boss sites on the continent) and `docs/GAMEPLAY.md`
    (loops, where each act happens, act 0 beat by beat, gaps G1-G10 in order). Merged with `DESIGN.md` (one work
    order, DESIGN §10). 2026-09-26 morning: prerequisites done - SimpleBackups to D:, the save scanned (no Confluence
    structures or Corruption on the continent), G1 (realms read `kubejs/config/minaria_continent.json` from
    `realm_data.py`) with its screen, the Realm Ledger (key I / `/realm`). Rule from the user: every system gets an
    English screen (DESIGN §1b). Next: DESIGN §10 item 1, then money and tax with their screens.

## Round of 2026-09-26 (from ~08:00, "auto, long")

Order from DESIGN §10 (Create machines parked, STEAMPUNK_MACHINES.md). Session minaria-81 also committed here today
(System window button, 05:50); told it this session owns the round.

1. [x] **Cataclysm damage caps** (done 08:10: 3 min act II / 4 min act III at the cap, range 24; BALANCE §3) (CATACLYSM H1): `dps_cap`/`damage_cap` so the minimum kill time is minutes, not
   10-16 min; interim numbers until player DPS is measured (H2). BALANCE.md updated.
2. [x] **The System, 1a:** (done 26 Sep: STATUS, REPUTATION, BOSSES, QUESTS, APPRAISE, NOTICE, map zoom; tested in game with system_test.js) see the Realm Ledger button/hover box in game; [ STATUS ] with a [ REPUTATION ] tab;
   [ NOTICE ] pop-ups instead of title/chat; [ APPRAISE ] on a looked-at person. DESIGN §1b.
3. [~] **Money and tax (G3)** Counting House, gate toll, treasury, market tax on emerald exchange and coin rewards on Bountiful done; per-state boards (G4) and market-tax line on trade screens left. **Original:** (G3) + state job boards paying coins (G4)** with their screens (Counting House, Gate Toll,
   tax line on trades). GAME_SYSTEMS §4, DESIGN §4.
4. [ ] Town leftovers: Lutesk rock scarp as a sloped glacis, Milev's two guild halls, fit-out look in game.
5. [ ] Then DESIGN §10 items 4-5 in order.

## Findings log

- 2026-09-25: build-all stopped at 47/101 (Stapledon) at 03:23 with no error; the process ended with the old
  session. QA summary is stale (only Aileau).
- 2026-09-25: DT is installed (DynamicTrees 1.4.11, DT+, DenseTrees + DT DenseTrees, dtnatures_spirit, burnt_dt).
  Broken leaves in `logs/latest.log`: `dtnatures_spirit:mahogany_leaves` points at missing
  `natures_spirit:block/dark_oak_leaves(_canopy_2)` models; `dense_dynamictrees:dense_cocoa` needs a missing
  `dynamictrees:dense_cocoa_seed`; `dense_dynamictrees:dense_cherry` has no `minecraft:cherry` family.

- 2026-09-25 06:57: the game closed itself mid-tour: `NullPointerException ... "particle1" is null` in
  `AsyncParticles-2.4.0-beta.3` (`AsyncTicker.java:144`). A client crash in the particle mod, not in the world.
- 2026-09-25 07:00: seam written into `saves/Minaria Continent` too (copies of the 23 regions from before in
  `D:/Minaria/world/seam/kings_landing_austrum/before_save/`). The Distant Horizons cache still showed the old
  moat from afar, so `data/DistantHorizons.sqlite` was moved to `D:/Minaria/world/seam/dh_cache_backup/`
  (DH rebuilds it).

- 2026-09-25 ~09:00: Dragonstone placed on the Wound island (D: world and town backup; save not yet).
  Redcker and Wasingsham (old island) now part of the paste; Dunsinby became a city, Hertrinch a town.

- 2026-09-25 09:31: the full build (`settlements.py build`) was stopped by Claude Code for low system memory
  at 13/99 (Lubro). The D: world is half-built: settlements 14-99 still have their pre-town ground. Not
  restarted automatically (the harness asks for the user's go-ahead after a memory stop).

- 2026-09-25 ~15:00: a full build finished (99/99, QA: 0 wall gaps, 0 air under pieces; 190 small floating
  parts, fixed at the root: all-or-nothing DT planting, fences clear of yards). The rebuild with those fixes
  was stopped again by Claude Code for low memory right at its start, with no game open: the build process
  itself peaks high. The D: world is again half-restored.

## Waiting for the user

- The game was opened at 09:05 (not by the autopilot) and holds 7.3 GB of the 16 GB: that is what ran the
  machine out of memory. Close it before the build. Nothing is written into the save while it is open.
- (done 2026-09-25 ~16:30) full build rerun.

- AsyncParticles beta crashes the client (above). Options: update it, or disable it (`.jar.disabled`) and accept
  the particle cost. Not changed without asking, it is part of the performance setup (`docs/PERFORMANCE.md`).
