# Town jigsaw: how Minaria's towns are made

Every city, town and village is made the same way. A seeded shuffle of whole, hand-built pieces is fitted into
a generated plan. The terrain is shaped to take the pieces, and the town is dressed in its own style. After that
it is checked by machine before it goes into a save.

A piece fits whole or it is not used: nothing is cut, resized or recoloured to fit. The first two libraries broke
this rule, and the result was half houses, wall scraps and dirt pedestals.

The quality bar is King's Landing (WesterosCraft), described in docs/LORE_MAP.md §9.

Commands are in [RUNBOOK.md](RUNBOOK.md) and the decoration kit is in [TOWN_KIT.md](TOWN_KIT.md).

## 1. Pieces: `kl_pieces.py`

The whole of King's Landing is cached on D:, memory-mapped (`D:/Minaria/schematics/kl_city`).

- **Footprints.** Found at walking height: walls, with rooms under 400 m² filled in.
- **Piece.** All built blocks that are 3D-connected to one footprint, up to the lane midline.
  - Street paving counts as ground.
  - Roof stairs and slabs above head height that cross the midline are eaves, and are trimmed.
  - Thin things that run on (lines, fences, signs) are trimmed.
  - If walls run on past the midline, the footprint is merged with the footprints it runs into, and the merged
    group is tried again. If it still runs on, it is dropped. It is never cut.
- **Building test.** A piece must pass all of these:
  - it has a ground floor
  - it is one mass, not scattered bits
  - it is roofed
  - it is enclosed
  - it is compact
  - it is not a field, garden or hedge
- **Also dropped:**
  - any part that doesn't reach the piece's footing
  - fortifications (more than 35% dun brick)
  - waterfront pieces
- **Stats** (`pieces/blocks.json`):
  - 329 pieces, 91,300 m² of roof
  - per piece: `walk` (ground-floor outline), `full` (outline with eaves), `floor`, `height`, `theme` (roof and
    wall colour cluster), `foundation`

## 2. Plan: `town.plan`

- An organic wall ring.
- Gates spaced evenly (jitter ≤ 1/5 of the spacing).
- Square: radius 0.12–0.17 R.
- Main streets from the gates to the square, bent.
- Voronoi block fabric: streets 9, 5 and 3 wide.
- A lane inside the wall (pomerium) where the stairs land.

## 3. Fill: `town.fill`

- Blocks are visited in shuffled order. For each candidate spot:
  - the ground-floor outline must fit inside the block, 3 clear of other ground floors
  - the full outline may reach 2 over the street, but must never touch another piece
- Fit is tested by FFT in 4 rotations. The best frontage wins.
- Never on ground that falls more than 3 under the piece.
- At most 3 uses of a piece per town.
- Themes: see §5.

## 4. Ground: `place.build`

- **Surface.** The terrain with spikes removed and smoothed (σ 2.5), then made walkable: at most 1 block per block.
- **Pieces.** Each piece sits level on its ground floor. The lanes ease to it over 3 blocks.
- **Square.** Level.
- **Foundations.**
  - Every ground-floor column is filled with plain stone, from the old ground up to the piece's first block.
  - Rooms included.
  - This covers columns where the first block is within 3 of the floor.
  - Result: no air under walls.
- **Terrace edges.** Where the ground steps by 2 or more, the face is dressed stone, never a dirt cliff.
- **Streets.** Climb in half-block slab steps.
- **Trees.** Removed whole if their trunk is in the town, and left whole otherwise.
- **Edges.**
  - Unwalled towns meet the country over a 14-block embankment.
  - Roads leave the gates at passage height, meet the terrain within 14 blocks, and fade out over 40.

## 5. Colour

Themes are k-means clusters (6) of CIELAB roof and wall colour.

| tier | themes used |
|---|---|
| capital, city | dark-roofed themes in the centre, thatch only in the outer ring (dsq > 0.62) |
| town | one dark theme and one thatch theme |
| village | thatch |

WesterosCraft's own textures for vanilla building materials come from `resourcepacks/Minaria WesterosCraft Materials.zip`.

## 6. Walls: `walls.py`

Designed profile, in King's Landing's materials, graded from bottom to top:

1. plinth with moss
2. large dun brick base band
3. mixed dun brick body, in patches that drift with height
4. stormlands brick course under the walk
5. dark sandstone merlons and caps
6. mixed walk paving

The rest of the wall:

- **Parapet.** Corbelled, with arrow slits.
- **Inner face.** Pilastered.
- **Walk.** Steps with the ground, at most 3 at once.
- **Glacis.** A stone glacis runs down steep ground outside.
- **Towers.** Round, either crenellated or slate-coned, at irregular spacing.
- **Gatehouses.** D-tower gatehouses with an arched passage, portcullis, hanging lanterns and stairs to the walk.
- **Curtain.** Runs into the gate towers, with no gaps.
- **Blocks.** Every Canvas state carries `waterlogged=false`, because WesterosBlocks defaults it to true.

## 6b. Outworks: `outworks.py`

- **Rampart.** Earth heaped against the outside of the wall (a 4-block berm, then 3 down in 4), grass with a
  little coarse dirt and podzol, and boulders where it is steepest. There is no stone glacis: it read as a cliff.
- **Approaches.** Each gate gets:
  - a level paved forecourt, 16 deep
  - a road leaving at the passage floor and descending at most 1 in 3:
    - where it stands over the ground, a causeway with earth banks (1:1)
    - where it stands more than 5 high, a mixed-stone retaining wall with buttresses every 7 and a parapet
    - where the ground rises, a cutting
  - a surface graded cobble → dark cobble → gravel → path → coarse dirt, fraying into the grass
  - half-slab steps and lamps every 14 blocks
  - a guard post, a hitching rail, and the state's banners over the arch
- **Suburbs.** Up to 4/3/2/0 whole pieces per gate (capital, city, town, village) beside the approach, on level
  ground, each with a cleared grass yard.
- **Trees.** Species by biome, at the biome's own canopy cover (`forest_cover`), denser on steep ground. None
  within 12 blocks of a wall, so the field of fire stays clear. Larger yards inside get garden trees.
- **Chunks.** Only chunks actually changed are written and marked fully generated (`WorldEditor.dirty`). The game
  decorates the rest with its own biome trees, so the worked area meets the country without a line.
- **Water.** Bridges only cross narrow water (every cell within 5 of a bank). Town ground within 3 of water stands
  1 over its surface.

## 7. Dressing: `decor.py`

Each town gets a Style made from its seed and its state's colours. It sets the centrepiece, lamps, stalls,
benches, bunting and street piles. See [TOWN_KIT.md](TOWN_KIT.md).

## 8. Checks: `qa_town.py`

Every town must show these zeros before it goes into a save:

| check | meaning |
|---|---|
| `floating_parts` | built blocks not joined to the ground |
| `street_steps` | a jump of 2+ between street cells |
| `wall_gaps` | a stretch of ring with no wall standing 8 above the town |
| `air_under_pieces` | air between a piece's floor and its first block |

`cliff_runs` is allowed where it is the natural terrain outside the wall. Look at `faults.png`.

After the numbers, look with your own eyes:

- `topview.py` for the whole town
- `world_iso.py` for close-ups of the gates and the square
- `dev/tour.ps1` in game, only when the user is not playing

## 9. Known limits and next ideas

The backlog is in [TOWN_KIT.md §4](TOWN_KIT.md).
