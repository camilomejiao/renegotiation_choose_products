---
name: conventional-commit
description: Use when the user asks to create a commit, stage changes, or write a commit message with Conventional Commits, including scope selection, staging hygiene, and concise audit-friendly commit summaries.
---

# Conventional Commit

Use this skill when the user explicitly asks to create a commit or wants help naming one.

## Trigger examples
- "haz commit"
- "crea commit"
- "commit con conventional commit"
- "versiona estos cambios"

## Required format
Use:

```text
<type>(<scope>): <description>
```

## Allowed types
- `feat`
- `fix`
- `refactor`
- `perf`
- `docs`
- `test`
- `build`
- `ci`
- `chore`
- `revert`

## Scope rules
- The scope should represent the main module, slice, or domain affected.
- Use kebab-case.
- If several slices change for the same business goal, prefer an aggregate scope such as `catalog-management`.

## Description rules
- Imperative mood
- Short and specific
- No final period
- Keep it within 72 characters when practical

## Commit body
Add a body when the change includes architecture decisions, migrations, or non-obvious tradeoffs.

Useful body content:
- main changed areas
- why the structure changed
- migration or compatibility notes

## Suggested workflow
1. Review `git status --short`.
2. Confirm unrelated files are not staged accidentally.
3. Stage only the requested changes.
4. Create the commit using Conventional Commits.
5. Report the commit hash and a short summary back to the user.

## Restrictions
- Do not use `git commit --amend` unless the user explicitly asks for it.
- Do not mix unrelated changes in the same commit.
- If scope is unclear, prefer a conservative type like `refactor` or `chore` based on functional impact.

## Output expectation
- Produce a valid Conventional Commit message
- Keep staging aligned with the user request
- Report the final hash and affected files after committing
