---
name: fsd-domain-model
description: Use when working on DTO mappers, normalization, defaults, and stable frontend contracts inside `src/entities/**/model/**` for FSD-based frontend projects.
---

# FSD Domain Model

Use this skill for frontend domain modeling.

## Scope
- `src/entities/**/model/**`

## Rules
- No fetch logic
- No router access
- No UI library dependencies
- Protect the UI from backend shape drift

## Output expectation
- Stable frontend contracts
- Defensive defaults
- Small, explicit mappers
