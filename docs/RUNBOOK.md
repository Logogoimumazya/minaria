# Runbook: commands for the world and the towns

Run everything from `dev/worldgen` unless it says otherwise.

Heavy data lives on D:. Downloaded builds and templates are never committed.

| where | what |
|---|---|
| `D:/Minaria/world/minaria` | the generated world (regions) |
| `D:/Minaria/world/region_backup_pre_towns` | the same world before any town (every rebuild restores from it) |
| `D:/Minaria/schematics/kl_city` | King's Landing, whole, memory-mapped |
| `D:/Minaria/schematics/kl_library/pieces` | the piece library (`blocks.json`, `blocks/*.nbt`) |
| `D:/Minaria/world/qa/<town>` | QA report, fault pictures, `build.npz` |
| `saves/Minaria Continent` | the playable save (a copy: 1.20 refuses junctions) |

## Towns

```sh
python kl_pieces.py prepare                  # once: cache King's Landing + walking maps (~2 min)
python kl_pieces.py blocks                   # rebuild the piece library (~40 s)
python kl_pieces.py sheets                   # contact sheets of every piece, to check by eye
python town.py preview --tier city --seed 1005        # plan picture only
python walls.py preview --tier city --seed 1005       # wall and gates, no world
python decor.py preview --tier city --seed 1005       # square and market, no world
python settlements.py plan                   # tiers and sites for all burgs -> settlements.json
python settlements.py build --only Aileau    # restore the town's regions, build it (~60 s)
python settlements.py build                  # all settlements, 3 at a time where they share no region, then
                                             # King's Landing's fit-out (only after one town is signed off)
python settlements.py sandbox --only Aileau  # one town on copies of its regions in D:/Minaria/world/sandbox/<name>
                                             # (~2 min; its own QA and top.png there; the world is not touched)
python fitout.py kl --world <world>          # King's Landing's rooms and doors (the full build runs it)
python country.py Aileau --preview           # the country round a built town: plan picture only
python country.py Aileau                     # write it (settlements.py build runs it after every town)
python qa_town.py Aileau                     # checks: floating, street steps, wall gaps, air under pieces
python settlements.py qa                     # QA every built town -> D:/Minaria/world/qa/summary.json
python topview.py --x -3798 --z -4392 --r 250 --out D:/Minaria/world/shots/aileau_top.png
python world_iso.py --x X --z Z --w 80 --d 80 --y0 110 --y1 180 --out close.png
```

Install into the save (the game must be closed; the regions a town covers are listed by `settlements.restore`):

```sh
for f in r.-8.-10.mca r.-8.-9.mca r.-7.-10.mca r.-7.-9.mca; do
  cp /d/Minaria/world/minaria/region/$f "saves/Minaria Continent/region/$f"; done
```

## Stamp seams

The ring around a pasted build (King's Landing) is rebuilt from the world as it stands: the source's superflat
floor and the old moat are replaced by ground relaxed between the paste and our terrain, our rivers are routed
in to the paste's water, the paste's creeks get springs, shores join with beaches. Changed chunks outside the
paste are left as proto-chunks so the game plants the biome's own (Dynamic) trees there.

```sh
python seam.py survey kings_landing_austrum            # heights/water/top block of the box + 320 -> D:/Minaria/world/seam/<name>
python seam.py plan kings_landing_austrum              # new ring -> plan.npz + plan_<time>.png
python seam.py apply kings_landing_austrum             # write it (the D: world)
python seam.py apply kings_landing_austrum D:/Minaria/world/region_backup_pre_towns   # and the town backup
python seam.py survey kings_landing_austrum kl_after && python seam.py qa kings_landing_austrum kl_after
```

`plan` always works from the first survey (taken before any apply); the touched regions are listed in
`D:/Minaria/world/seam/<name>/regions.txt`, with copies from before in `before_minaria/` and `before_backup/`.

## Trees

Towns and the country plant Dynamic Trees taken whole from the played save; static trees in built areas are
swapped for them.

```sh
python dt_trees.py harvest               # the game's own DT trees -> D:/Minaria/schematics/dt_trees (regions.txt lists where)
python static_trees.py survey X0 Z0 X1 Z1                       # count static trees in a box
python static_trees.py replace X0 Z0 X1 Z1 --skip-mask M.npz    # swap them (the mask keeps e.g. KL's walled city)
```

## In game (only when the user is not playing)

Run these from the instance root.

```sh
python dev/launch_test.py "Minaria Continent"      # background; wait for "joined the game" in logs/latest.log
powershell -File dev/mc_click.ps1 -Command "simpleclouds clouds clear all"   # clear sky for shots (weather clear leaves Simple Clouds)
powershell -File dev/mc_click.ps1 -Command "tp @s X Y Z yaw pitch"     # refuses unless the game is in front
powershell -File dev/tour.ps1 -Views "name:x y z yaw pitch;..."        # teleport, hide HUD, capture each view
powershell -File dev/screen_shot.ps1 -Out D:/Minaria/world/shots/x.png # game window only, never the desktop
python dev/console.py "realms here" --shot D:/Minaria/world/shots/y.png  # test world only: run commands with no input sent
```

## Mods and packs

```sh
cd D:/Minaria/tools/westerosblocks-port && ./gradlew build --offline   # port jar -> build/libs, copy to mods/
cd dev/minaria_system && ./gradlew build --offline   # first: minaria_realms compiles against its jar
cd dev/minaria_realms && ./gradlew build --offline   # then court, perf the same way; copy build/libs/*.jar to mods/
python dev/westerosblocks_port/make_materials_pack.py                  # resource pack of WC material textures
python blockcolors.py                                                  # block colour table for the renderers
```
