---
name: auth-session-boundary
description: Use when implementing, refactoring, or reviewing frontend authentication/session handling so identity comes from a single trusted source, tokens are the only persisted auth values, and consumers depend on shared auth state instead of localStorage-derived user data.
---

# Auth Session Boundary

Use this skill when working on authentication, session hydration, guards, menus, or any code that reads current-user identity.

## Primary goal
- Keep authentication data flow centralized and replaceable
- Prevent frontend code from trusting arbitrary identity data persisted in storage
- Preserve a stable consumer contract for a future `/me` endpoint migration

## Source of truth
1. The user identity must come from a single trusted source.
2. Until `/me` exists, resolve session identity from the decoded `access token` in memory.
3. When `/me` is introduced, only the session-resolution strategy should change.
4. Consumers of `useAuth()` or equivalent auth context must not change when `/me` arrives.

## Allowed persistence
Persist only authentication tokens in `localStorage`:
- `token`
- `refresh`

Do not persist derived identity data:
- `user`
- `id`
- `rol_id`
- `jornada_id`
- any copy of JWT claims

## Architecture rules
1. `AuthProvider` must not read identity from `localStorage.user` or any derived storage keys.
2. `AuthProvider` should hydrate auth state through a single strategy function such as `resolveSession()`.
3. Auth state should live in memory and be consumed through context or a shared session layer.
4. UI, guards, routes, menus, and business logic must consume auth from `useAuth()` or the shared session boundary.
5. Features, widgets, pages, and business services must not read identity directly from `localStorage`.

## Shared auth implementation
1. Token read/write logic must be encapsulated in a shared auth module.
2. JWT decoding must be centralized.
3. Do not scatter multiple `jwtDecode` implementations across the codebase.
4. Session cleanup must remove only auth keys and must not call `localStorage.clear()`.

## Session invalidation
Invalidate session when:
- the token is missing
- the token cannot be decoded
- required claims are missing
- an authenticated request returns `401`

Current minimum claims:
- `rol_id`
- at least one of `id` or `seg_usuario`

## Security constraints
- The frontend is not a security boundary.
- Hiding UI actions does not replace backend authorization.
- Storing tokens in `localStorage` still carries residual risk if the token itself is replaced.
- Backend endpoints must validate permissions and scope independently.

## Output expectation
- Centralize session resolution behind a shared auth boundary
- Keep derived identity in memory, not persisted storage
- Route all new session logic through the shared auth layer
- Preserve a stable public auth contract for future backend-backed session resolution
