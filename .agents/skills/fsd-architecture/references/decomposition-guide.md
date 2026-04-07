# FSD Decomposition Guide

This reference captures the expert-level decision rules for Feature-Sliced Design.

## 1. Primary decomposition order

Always decide in this order:
1. Layer
2. Slice
3. Segment

Use:
- **Layer** for architectural responsibility
- **Slice** for business or product meaning
- **Segment** for technical purpose within one slice

## 2. When to separate by layer

Create or use a layer when the code has a distinct dependency level and architectural responsibility.

Quick heuristics:
- `app`: global app setup, providers, routing shell, initialization
- `pages`: route-level screens
- `widgets`: large UI blocks composed from lower layers
- `features`: user-visible capabilities or actions
- `entities`: domain nouns and stable business concepts
- `shared`: generic technical foundation and reusable primitives

Do not move code upward just because it is reused. First ask whether it is truly generic, domain-level, or action-level.

## 3. When to create a slice

Create a slice when:
- the code represents a recognizable business concept or user capability
- the code changes together frequently
- the name is stable and understandable to the team
- keeping it together reduces cross-import pressure

Examples:
- `entities/user`
- `entities/transaction`
- `features/sign-in`
- `features/export-report`
- `pages/payment-details`

## 4. When not to create a slice yet

Do not create a dedicated slice if:
- the concept is still unstable
- the code only exists in one place and stays small
- extraction would introduce artificial naming
- the module would depend too much on sibling slices
- the real business boundary is still unclear

In those cases, defer decomposition and keep the code closer to its current page, widget, or feature.

## 5. When to create segments

Use segments only inside a slice and only after the slice itself is clear.

Typical segments:
- `ui`
- `model`
- `api`
- `lib`
- `config`

Segments are technical, not business-oriented.

Bad example:
- `features/payment/components`
- `features/payment/hooks`
- `features/payment/utils`

Better example:
- `features/payment/ui`
- `features/payment/model`
- `features/payment/api`

## 6. Smells and corrections

### Smell: generic technical folders dominate
Signal:
- too many `components`, `utils`, `helpers`, `types`

Likely fix:
- recover the slice boundary
- group by business meaning first

### Smell: sibling slices import each other a lot
Signal:
- many same-layer cross-imports

Likely fix:
- merge the slices
- move coordination up to `pages` or `widgets`
- extract shared domain logic downward

### Smell: too many entities
Signal:
- almost every API shape becomes an entity

Likely fix:
- only create entities for stable domain concepts
- leave thin transport logic in lower-level API code when domain value is weak

### Smell: everything becomes a feature
Signal:
- tiny local buttons or one-off actions live in `features`

Likely fix:
- keep one-off behavior closer to the current page or widget until it proves reusable or significant

## 7. Stable rule set for placement

Ask these in order:
1. Is this app-global or startup-related?
2. Is this route-level?
3. Is this a big composed UI block?
4. Is this a user capability or action?
5. Is this a domain noun?
6. Is this generic enough for `shared`?

Then ask:
1. What business concept does it belong to?
2. What technical role does it play inside that concept?

That sequence usually gives the right location.
