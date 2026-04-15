---
name: fsd-ui-composition
description: Use when creating or updating UI in `src/pages-layer/**`, `src/widgets/**/ui/**`, or `src/shared/ui/**`, especially SmartTable screens and presentational components in FSD-based frontend projects.
---

# FSD UI Composition

Use this skill for presentational and page-composition work.

## Scope
- `src/pages-layer/**`
- `src/widgets/**/ui/**`
- `src/shared/ui/**`

## Rules
- UI does not fetch directly
- UI does not hold domain rules
- When orchestration grows, split model/container from view

## SmartTable
Use `SmartTable` from `@ecs/ui-components`.

Typical props:
- `dataSource`
- `columns`
- `rowKey`
- `loading`
- `showTableResize`
- `total`
- `currentPage`
- `pageSizeOptions`
- `onPageChange`
- `onSortChange`
- `onRowSelection`
- `download`
- `toolbarExtensions`
- `reload`

## Columns
- Define columns in feature or widget `model/`
- Columns may receive handlers, translations, and render callbacks
- Columns must not use hooks, fetch, or business rules
