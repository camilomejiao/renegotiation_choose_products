---
name: fsd-decomposition-expert
description: Use when deciding exactly when to separate code into layers, slices, and segments in Feature-Sliced Design, or when teaching, reviewing, or refactoring decomposition boundaries in FSD-based frontend projects.
---

# FSD Decomposition Expert

Use this skill when the hard part is not coding but deciding the correct decomposition boundary.

Load:
- `references/layer-vs-slice-vs-segment.md` for the conceptual model
- `references/separation-heuristics.md` for practical extraction rules
- `references/refactor-triggers.md` when deciding whether to split now or defer

## Primary rule
Separate code in this order:
1. Layer by architectural responsibility
2. Slice by business meaning
3. Segment by technical purpose

## What this skill is for
- Deciding whether something belongs in `features` or `entities`
- Deciding whether a block deserves its own `widget`
- Deciding whether to create a new slice or keep code local
- Deciding whether a segment is justified or premature
- Explaining tradeoffs during refactors and architecture reviews

## Operating mode
- Prefer deferred decomposition when the boundary is still weak
- Prefer explicit slices when the concept is stable and cohesive
- Prefer merging over over-fragmenting
- Explain the decisive criterion, not just the folder name

## Output expectation
- Name the target layer
- Name the slice if one should exist
- Name the segment if one is justified
- If separation is premature, say so directly and keep it local
