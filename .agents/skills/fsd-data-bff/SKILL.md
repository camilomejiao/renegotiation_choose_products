---
name: fsd-data-bff
description: Use when working on entity API hooks, shared fetch helpers, SWR patterns, or BFF endpoints in `src/pages/api/**` for FSD-based frontend projects.
---

# FSD Data BFF

Use this skill for frontend data access and BFF work.

## Scope
- `src/entities/**/api/**`
- `src/shared/api/**`
- `src/pages/api/**`

## Rules
- `entities/api` returns raw DTO-oriented data and fetch state
- `entities/api` must not map backend data into UI contracts
- `src/pages/api/**` is the BFF/proxy layer with minimal normalization only
- Business rules do not belong here

## Reload contract
- Expose `reload()` when the entity hook pattern requires it
- Implement reload with SWR `mutate()` aligned with existing endpoint-key usage
