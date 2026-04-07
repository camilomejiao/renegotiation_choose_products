---
name: fsd-architecture
description: Use when working on repository architecture, file placement, FSD import direction, Next.js pages versus pages-layer boundaries, SmartTable conventions, or architecture reviews in FSD-based frontend projects.
---

# FSD Architecture

Use this skill for architectural decisions and reviews in FSD-based frontend projects.

Load these references when needed:
- `references/decomposition-guide.md` for expert rules on layers, slices, and segments
- `references/decision-tree.md` when deciding where a file or module belongs
- `references/examples.md` for project patterns

## Core principle
Decompose in this order:
1. Architectural responsibility -> layer
2. Business meaning -> slice
3. Technical purpose inside the slice -> segment

If you invert this order, you drift into generic technical folders such as `components`, `utils`, and `types` that ignore the domain boundary.

## Layer hierarchy
```text
app
processes
pages-layer
widgets
features
entities
shared
```

Imports only flow downward.

Allowed:
- `widgets -> features/entities/shared`
- `features -> entities/shared`
- `entities -> shared`

Forbidden:
- `entities -> features`
- `shared -> upper layers`

## Framework boundary
`src/pages/**`
- Routing, SSR/SSG, query reading, layout wrapper
- Delegates page composition to `src/pages-layer/**`
- No business logic

`src/pages-layer/**`
- Composes widgets and features
- No direct fetch
- No domain rules

## Official flow
```text
UI
-> widgets/model or features/model
-> entities/api
-> src/pages/api/**
-> backend
-> entities/model
-> UI
```

## Table rules
- `SmartTable` from `@ecs/ui-components` is the standard table
- Columns live in feature or widget `model/`
- Columns may use render callbacks, translations, widths, sorters, and handlers
- Columns must not use hooks, fetch, or decide business rules

## Review checklist
- Imports follow FSD direction
- UI does not fetch directly
- `entities/model` does not depend on router or UI libraries
- Routing stays in `src/pages/**`
- Composition stays in `src/pages-layer/**`
- Slices are named by business meaning, not by implementation detail
- Segments stay technical and local to the slice

## Output expectation
- Put code in the correct layer
- Prefer minimal refactors that restore architectural clarity
- When the placement is ambiguous, explain the tradeoff and name the decisive criterion
