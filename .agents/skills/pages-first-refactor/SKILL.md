---
name: pages-first-refactor
description: Use when refactoring an existing React screen toward a pages-first Feature-Sliced Design structure, keeping the page as the primary boundary, extracting features only when justified, and preparing legacy UI for cleaner Next.js migration paths.
---

# Pages-First Refactor

Use this skill when reorganizing a legacy React screen into a cleaner FSD structure with minimal over-decomposition.

## Intent
- Refactor incrementally toward Feature-Sliced Design
- Keep the page as the strongest initial boundary
- Preserve compatibility with future Next.js-oriented structure

## Core principles

### 1. Start from the page
Model the screen first as a strong page boundary. Do not extract lower layers before the page responsibility is clear.

### 2. Not everything is a feature
Create a `feature` only for a clear business action with reuse potential or meaningful application logic.

### 3. Widgets must earn their existence
Do not turn the main block of a single screen into a `widget` unless it has real reuse or isolation value.

### 4. Shared is only for truly shared code
Do not move page-local concerns into `shared`.

### 5. Segment by purpose
Prefer segments such as:
- `ui`
- `api`
- `model`
- `lib`
- `config`

Avoid generic technical folders such as:
- `components`
- `hooks`
- `utils`
- `types`

### 6. Public API discipline
Each slice should expose an `index.ts`. External imports should go through that public API instead of internal files.

### 7. FSD import direction
Respect layer direction:
- `app`
- `pages-layer`
- `widgets`
- `features`
- `entities`
- `shared`

Imports must only go downward.

## Refactor heuristics
- Keep screen composition near the page until reuse is proven.
- Extract entities when the data model and presentation concepts are stable.
- Extract features when actions such as search, create, edit, or export have their own use case and UI boundary.
- Defer widget creation when the screen is still mostly a single cohesive surface.

## Good candidates for extraction
- Search controls with their own state or use case
- Create and edit actions
- Export actions
- Stable entity mappers, status helpers, and reusable record UI

## Integration note
If the user also asks for a commit, combine this skill with `conventional-commit`.

## Output expectation
- Keep the main page as the initial organizing boundary
- Extract only justified features, widgets, or entities
- Preserve FSD import direction and strict public APIs
- Prefer the smallest refactor that improves architectural clarity
