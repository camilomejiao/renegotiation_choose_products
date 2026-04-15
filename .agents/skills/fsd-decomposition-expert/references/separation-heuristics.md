# Separation Heuristics

## Split into a new layer boundary when
- dependency rules clearly differ
- the code must be protected from upper-layer concerns
- the module role is architectural, not merely organizational

## Split into a new slice when
- the concept is business-meaningful
- the code changes together
- the slice can expose a stable public surface
- sibling cross-imports decrease after the split

## Split into a segment when
- the slice already exists
- multiple technical responsibilities inside the slice are becoming noisy
- the segments improve navigation without hiding the domain meaning

## Do not split yet when
- reuse is hypothetical
- the naming is forced
- the scope is too small
- the split increases cross-imports or indirection
