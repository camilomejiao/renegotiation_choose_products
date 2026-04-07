---
name: fsd-filters-system
description: Use when working on a project filtering system, including useFilter, filter drawer UI, active filter tags, filter config behavior, and backend query serialization in FSD-based frontend projects.
---

# FSD Filters System

Use this skill for the project filtering architecture.

Load `references/filter-contract.md` when the task touches serialization rules, field behavior, or state ownership.

## Main rule
`useFilter` is the single source of truth for filtering state.

## Responsibilities
- State layer owns values, updates, resets, and backend query params
- UI renders fields and triggers updates
- Tags reflect active query params, not drawer-local state

## Constraints
- Do not scatter filter logic across unrelated components
- Do not let presentational components build backend query payloads
- Preserve one canonical serialization format
