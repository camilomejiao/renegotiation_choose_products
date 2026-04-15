# Frontend Architect Playbook

## Purpose
Implement and modify features in this repository while preserving:
- Feature-Sliced Design (FSD)
- Next.js as the framework boundary
- BFF through `src/pages/api/**`
- Explicit separation: UI -> Application -> Domain -> Infrastructure

## Core Rules

### Layer hierarchy
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
- `shared -> higher layers`
- UI doing HTTP directly

### Framework boundary
`src/pages/**`
- Owns routing, SSR/SSG, query reading, and layout wrapping
- Delegates real page composition to `src/pages-layer/**`
- Must not hold business logic

`src/pages-layer/**`
- Composes widgets and features
- Must not fetch directly
- Must not hold domain rules

### Official data flow
```text
UI
-> widgets/model or features/model
-> entities/api
-> src/pages/api/**
-> shared backend fetcher
-> backend
-> entities/model mapper
-> view model
-> UI
```

## Project Skill Map
This repository uses `.agents/skills` as the canonical skill system.

Default FSD activation for creations, modifications, and refactors:
- `./.agents/skills/fsd-task-intake/SKILL.md`
- `./.agents/skills/fsd-architecture/SKILL.md`
- `./.agents/skills/fsd-decomposition-expert/SKILL.md`

Load additionally as needed:
- Ambiguous requests, prompt shaping, and refactor intake: `./.agents/skills/fsd-task-intake/SKILL.md`
- FSD placement, import direction, architecture review: `./.agents/skills/fsd-architecture/SKILL.md`
- Layer, slice, and segment separation decisions: `./.agents/skills/fsd-decomposition-expert/SKILL.md`
- UI composition, pages-layer, widgets, SmartTable screens: `./.agents/skills/fsd-ui-composition/SKILL.md`
- Feature use cases and action wiring: `./.agents/skills/fsd-application-layer/SKILL.md`
- Entity API hooks, BFF, SWR reload flow: `./.agents/skills/fsd-data-bff/SKILL.md`
- DTO mappers and stable frontend contracts: `./.agents/skills/fsd-domain-model/SKILL.md`
- Sidebar and route registration: `./.agents/skills/fsd-navigation-sidebar/SKILL.md`
- Filter system work: `./.agents/skills/fsd-filters-system/SKILL.md`
- Testing-related tasks: `./.agents/skills/fsd-testing/SKILL.md`

Reference patterns:
- `./.agents/skills/fsd-architecture/references/examples.md`

## Project Workflow Skills
Local repo-specific workflow and guardrail skills:
- Authentication/session boundary and token persistence rules: `./.agents/skills/auth-session-boundary/SKILL.md`
- Commit creation with Conventional Commits and staging discipline: `./.agents/skills/conventional-commit/SKILL.md`
- Conservative pages-first refactors for legacy React screens: `./.agents/skills/pages-first-refactor/SKILL.md`

## Existing Shared Skills
Combine the project skills above with existing generic skills only when relevant:
- `next-best-practices`
- `vercel-react-best-practices`
- `vercel-composition-patterns`
- `accessibility`
- `frontend-design`

## Working Agreement
- For any new implementation, refactor, or structural change, always start from the default FSD skill set.
- Prefer the smallest change that preserves the architecture.
- Split mixed-responsibility work by layer instead of collapsing logic into one file.
- If a requested change violates the architecture, move it to the correct layer and explain the placement.
- If a feature or refactor request is underspecified, ask the minimum targeted questions needed to safely proceed instead of waiting for a fully rewritten prompt.
