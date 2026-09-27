# Town kit: dressing, variants, and what comes next

Towns share their pieces, but no two towns should read alike. `decor.Style` is drawn from the town's seed and its
state. The only thing two towns of one state share is their heraldic colours.

Every block id below was checked against the jar it comes from (blockstate files) on 2026-09-25. A new block goes
into the kit only after its jar has been read the same way (see memory: jar verification).

## 1. Style (per town)

| choice | options | where it shows |
|---|---|---|
| colours | state heraldry pair (1 red/yellow, 2 blue/white, 3 green/yellow, 4 black/orange, 5 purple/white, 6 brown/light blue) plus 3 accents | awnings, bunting pennants |
| centre | fountain (capital), fountain or cross (city), well, cross or fountain (town), well (village) | the square's centre |
| lamp | brick post and lantern / stone brazier / bracket with hanging lantern | main-street kerbs every ~15 blocks |
| wood | spruce / oak / dark oak | stall posts, stools, benches, well frame, bunting poles |
| trades | 2–6 of greengrocer, fishmonger, baker, brewer, clothier, chandler | stall goods |
| bunting | cities always, towns 60% | over the square |
| flowers | 3 of 8 | planters |

## 2. Kit (mod → block, state used)

| mod | blocks | state used |
|---|---|---|
| Supplementaries | `awning_<dye>` | `slanted=true`, `facing`, `bottom=true` (stall cloth, sloped) |
| | `rope` | `east/west` or `north/south`, `knot` at the ends (bunting line) |
| | `sack` | `open=false` |
| | `jar`, `planter` | `extended=false` (flower on top) |
| Amendments | `ceiling_banner_<dye>` | `facing`, `attached=true`, hung under the rope as pennants |
| Farmer's Delight | `cabbage/carrot/potato/onion/tomato/beetroot_crate`, `basket` (`facing=up`), `straw_bale` (`axis`) | |
| Brewin' and Chewin' | `keg` | `facing`, `vertical=true` |
| Decorative Blocks | `brazier` (`lit`), `stone_pillar`, `<wood>_beam` (`axis`) | |
| Yet Another Furniture (`yaf:`) | `<wood>_bench` | `facing`, `main_type=single`, `back_type=single`, `back=true` |
| | `<wood>_tall_stool` | |
| WesterosBlocks | goods baskets and slabs, crates, `closed_barrel` (`axis`), bread and cheese blocks, flagstone, stone brick | |

**Checked in game** (2026-09-25, Aileau):
- awnings slope correctly with `facing` = the stall's back direction
- YAF bench `facing` = the direction the sitter looks
- rope needs `up=false`/`down=false` stated, or it shows vertical pickets
- ceiling banners render only with a block entity (`{"id": "amendments:ceiling_banner", "Patterns": []}`), which
  `walls.write` adds from `Canvas.bes`

Any block that is drawn by a block entity (banners, flags, signs, jars with contents) needs its block entity
written, or it is invisible.

## 3. Rules that keep dressing from looking pasted

- **Everything faces something.**
  - Stalls face the centrepiece or the houses across an aisle.
  - Benches face the centrepiece.
  - Lamp brackets reach into the street.
- **Clear ways.** Nothing stands in a main street's corridor across the square, and nothing in a junction.
- **Street piles.** Crates, a barrel, a sack or a straw bale, only against a house wall and never two touching.
- **Colour budget.** Each stall's cloth is the town pair (50%) or one town colour plus an accent. Nothing else in
  the town is saturated.
- **Blending.** Better Blending (client shader) softens seams between different ground blocks. Its config
  (`config/better-blending.json`) uses `SMALL_FEATURES` style and excludes crates, barrels, planters and flagstone,
  so small props keep their own texture.

## 4. Backlog: ideas for the next rounds

Rough order of value:

1. **Shopfronts.** At a piece's street-facing ground-floor door, add a Supplementaries awning over the door and a
   Farmer's Delight hanging canvas sign in the trade's colour. This needs door detection in a piece: a door block
   at `floor+1` on the outline facing a street.
2. **Window boxes.** Supplementaries `flower_box` under ground-floor and first-floor windows facing streets, 30%
   of windows, flowers from the Style.
3. **Bunting along the main streets.** Poles on both kerbs where the street runs along an axis, a rope across at
   7–9 above the street.
4. **Yards and gardens.** Small fruit trees, straw bales, a well, washing lines (`rope` plus wool) in the yards
   between pieces. Vegetable plots from Farmer's Delight wild crops in villages.
5. **Gate dressing.** A toll table, a guard brazier, a notice board (Supplementaries `notice_board`), and state
   banners on the gate towers.
6. **District character.**
   - Around the square: rich (dark themes, tall).
   - Near the gates: inns and stables (King's Landing pieces with stables or kegs).
   - Outer ring: crafts (piles, carts, workshops).
7. **Culture kits.** New piece libraries from the D: schematics:
   - Valaria from Balathor or Kianúr
   - the north from Norfall
   - dwarves from Khal Khalirak

   The same tools apply (`kl_pieces.py` with another `CITY` box and cache). Each state gets its own pieces, walls
   (`walls.MIXES` per culture) and Style tables.
8. **Villages without walls.** Hedges and wattle fences (WesterosBlocks `wattle_fence`) round the plots, and a
   green instead of a paved square.
9. **Life.** Villager or MCA residents placed at stalls and benches (W6 population), and ambient sounds from the
   WesterosBlocks `market_small` and `market_large` sound blocks hidden under the square.
11. **Landform edges.** Where a town sits on a set-piece landform (Aileau's acropolis), its raw stone face
    should get vines, ledges with shrubs and a switchback path.
12. **Gate variety.** A second and third gatehouse design (barbican with a drawbridge over a ditch; a simple
    arch between two square towers), chosen by Style.
10. **Wear.** Moss, cracked variants and vines on walls near water and on north faces. Soot above chimneys.
