# Outskirts: what lies outside King's Landing's walls, and the rules for building it elsewhere

Measured from the King's Landing source (`D:/Minaria/schematics/kl_city`) with `dev/worldgen/outskirts.py`:

```sh
python outskirts.py study     # land use per column, shares by distance band, field/orchard shapes, clusters
python outskirts.py trades    # every whole-structure piece outside the wall tagged with a trade
```

Outputs are in `D:/Minaria/schematics/kl_library/outskirts/`: `landuse.png` (the map), `study.json`,
`pieces.json` (piece -> trade, tier, size, distance from the wall, what surrounds it), `trade_*.png` contact
sheets. The walled city is `city_inside.npy`, traced once from the height map (wall, Red Keep, Aegon's hill).

## 1. Land use by distance from the wall

Share of the ground (outside the wall, real terrain only) in each distance band, in blocks from the wall:

| use | all | 0-40 | 40-100 | 100-200 | 200-350 | 350-600 | 600+ |
|---|---|---|---|---|---|---|---|
| buildings | 10% | **26%** | 18% | 5% | 4% | 10% | 20%* |
| yards, bare ground | 15% | 24% | 17% | 14% | 14% | 12% | 19% |
| roads and lanes | 7% | 12% | 9% | 7% | 9% | 5% | 3% |
| fields (crops) | 8% | 2% | 8% | **14%** | 9% | 6% | 7% |
| woods | 17% | 4% | 5% | 8% | 18% | **24%** | 20% |
| meadow | 23% | 16% | 11% | 11% | 28% | 26% | 28% |
| water | 20% | 17% | 34% | 40% | 16% | 17% | 2% |
| orchards, vineyards, marsh | 1% | | | | | | |

(*the far band is small and includes the south-bank villages.)

So the ring has three belts:

1. **Suburb (0-100):** a quarter of the ground built over, houses packed along the roads out of the gates, yards
   and lanes between. Almost no fields.
2. **Fields (100-200, running out to ~350):** the open-field belt. Farmsteads sit at the field edges on the lanes.
3. **Woods and meadow (200+):** woodland takes over; hamlets and a manor or two in clearings, fishers on the
   water.

## 2. Fields

- 77 field blocks (crops + tilled soil, closed over the 1-2 block balks). Area: median 1,800 m², quartiles 540
  and 4,600, the biggest 28,700. Long side median 73 (p90 160), short side median 35 (p90 93).
- They are **irregular strip fields**, not rectangles: filled area 0.73 of their bounding ellipse; orientations
  spread evenly over 0-180° (each block follows its own lane, not a grid).
- Inside a field: **crop strips 10-15 blocks wide** (median 12), separated by **1-2 block balks** of dirt or gravel.
- Crops: wheat 87%, then turnips, carrots, peas, cabbage (these as small plots by the houses).
- A field's edge is a lane (dirt, gravel, dirt/gravel slabs) on most sides, then wattle fence, a hedge of oak
  leaves, or mud. Fields touch buildings only at farmsteads.

## 3. Orchards, vineyards, marsh

- 32 orchards (fruit-tree leaves: apple, plum, cherry, apricot, lemon, hop): 800-4,600 m², 40-110 long, **always
  next to buildings or a lane** (they belong to a farmstead or a manor). Most sit 40-350 from the wall.
- One vineyard (grape leaves), ~200-350 out.
- Marsh (cattails, bog) along the river mouths and slow bends, 200-350 out.

## 4. Buildings outside the wall

- 273 whole-structure pieces from the library (`pieces/blocks.json`) stand outside the wall: most of the
  library, because the dense city inside rarely yields a piece that doesn't run into its neighbour.
- Clusters (buildings within ~22 blocks of each other): 21 farmsteads (2-4 buildings), 13 hamlets (5-15),
  11 suburb blocks (16+, the gate suburbs), 35 lone buildings.
- Buildings are close to a road: distance to the nearest road p25/50/75/90 = 3/5/6/12 blocks.

Trades, from the blocks inside each piece (`outskirts.py` `TRADES`), with distance from the wall p25/50/75:

| trade | pieces | wall distance | reads as |
|---|---|---|---|
| house | 140 | 47 / 128 / 264 | cottages, the default |
| farm | 69 | 61 / 110 / 230 | farmhouses with grain and turnip crates, harness, cart wheels, hay |
| butcher / hunter | 21 | 42 / 78 / 259 | carcasses, cleavers, hams |
| smith | 12 | 38 / 96 / 282 | horseshoes, crossbars, anvils; the rich one at 379 is a manor forge |
| fisher | 10 | 315 / 382 / 434 | nets, fish traps: on the far shores only |
| carpenter | 9 | 52 / 178 / 239 | saw benches, axes, log piles |
| tavern | 7 | 57 / 63 / 228 | tavern sign, flagons, cheese: at the gates and on the high road |
| watch | 3 | 86 / 131 / 246 | arrow slits: posts on the roads |
| mason | 2 | 142 / 147 | mason benches |

## 5. Rules for the outskirts generator (task 3)

For a **capital** (the full set), measured from its wall:

1. **Roads first.** The gate roads run out straight-ish to 200+, then bend to their destinations. Lanes branch off
   every 60-120 blocks and follow the ground (never straight across a slope). Every building is ≤12 from a road
   or lane (90%).
2. **Suburb belt, 0-100:** houses and trades lining the gate roads, two to three deep; butchers, smiths,
   carpenters and taverns nearest the gates (medians 60-100); yards between; small kitchen plots (turnips,
   carrots, peas, cabbage) behind the houses.
3. **Field belt, 100-350:** strip fields between lanes: blocks of 540-4,600 m² (a few up to 15-30k), each turned
   to its own lane, cut into 10-15 wide crop strips with 1-2 wide balks. Mostly wheat. Edges: lane, wattle fence
   or hedge. Farmsteads (a farmhouse + 1-3 barns/sheds + yard + an orchard of 800-4,600 m²) at the field corners on
   the lanes, one per ~3-5 field blocks.
4. **Wood belt, 200+:** leave woods and meadow (the terrain's own trees: Dynamic Trees). Hamlets of 5-15 buildings
   at crossroads in clearings; a manor (rich, large) with its orchard and forge now and then; fishers only on
   shores.
5. **Water:** marsh at slow river bends and mouths; fishers' huts and nets on the far shores.

For a **castle town** (town tier with a keep): the same belts at about half the distances (suburb 0-50, fields
50-200, woods beyond) and a third of the density; one tavern, one smith, farms. For a **town without a castle**:
no suburb belt beyond one row along the main road; fields start at the edge. A **village** is its own farmstead
cluster: fields and orchards around, nothing else.

**Slopes.** The KL outskirts are near-flat; ours are not. Pieces go only where the ground under them varies ≤3
(the rule `place.py` already uses for towns), otherwise on a terraced pad with a retaining wall (the walls'
retaining-wall material). Fields follow the ground: a strip may rise or fall, but each strip is split where the
slope passes 1 in 3; terraces with dry-stone edges on steeper hillsides (vineyards and orchards like those best).

**Variety.** Pieces are rotated (4 ways) and mirrored; roof and wall palettes swap per state and culture (task
4); a trade appears at most twice in a row along a road.

## 6. What country.py builds (2026-09-25)

- Gate roads carried on 150-330 blocks; a ring lane beyond the suburb belt; lanes off roads and lanes.
- Furlongs: land along every way cut into 22-48 wide, 45-115 deep blocks; ways and furlongs belong to the
  nearest way, so they bend with the lanes. Great fields (all furlongs along one way on one side) share a year
  of the three-field rotation: ripe, young, or fallow. Austrum's country (the declining empire) is half fallow.
- Wheat furlongs: 10-15 strips, 1-2 balks, a grass headland at the far end. Edges: fence, hedge or open.
- Farmsteads at the head of a furlong: farmhouse + 1-2 buildings + yard; the next furlongs along the lane are
  the kitchen garden and (55%) an orchard of fruit trees in rows.
- Hamlets (capital 3, city 2, town 1): 5-10 houses round a green with a King's Landing well, at lane ends out
  in the wood belt. Manors (capital 2, city 1): a rich house in a hedged garden with an orchard and a drive.
- Roadside suburb along the gate roads out to 70-100 (taverns, smiths, butchers nearest the gates).
- Pieces take their state's timber, roof slate and thatch (`walls.piece_palette`).
