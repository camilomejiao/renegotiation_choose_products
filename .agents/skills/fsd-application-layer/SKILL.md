---
name: fsd-application-layer
description: Use when working on feature use cases, action handlers, mutation flows, and application-layer orchestration in `src/features/**/model/**` for FSD-based frontend projects.
---

# FSD Application Layer

Use this skill for feature-level use cases and action orchestration.

## Scope
- `src/features/**/model/**`
- Action handlers exposed to UI
- Mutation flow coordination

## Rules
- Centralize use-case logic here instead of in UI
- Keep business and action rules out of presentational components
- Trigger `reload()` or SWR `mutate()` after successful mutations using the repo pattern

## Output expectation
- Thin UI handlers
- Explicit action flow
- Stable coordination between UI, domain, and data layers
