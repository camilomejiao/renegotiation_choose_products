---
name: fsd-testing
description: Use when adding, reviewing, or explaining tests in FSD-based frontend projects. Covers Jest, React Testing Library, environment selection, test placement, and project testing priorities.
---

# FSD Testing

Use this skill for testing-related work in this repository.

## Stack
- Next.js 13.5.9
- Jest
- React Testing Library
- Jest DOM

## Placement
- Source code lives under `src/`
- Tests go inside `__tests__/`

## Priority order
1. Pure functions
2. Custom hooks
3. React components

## Rules
- Prefer deterministic and isolated tests
- Use node environment for pure functions when needed
- Use jsdom for hooks and components
- Test behavior over implementation details
- Mock external dependencies explicitly

## Commands
- `npm install`
- `npm run dev`
- `npm test`
