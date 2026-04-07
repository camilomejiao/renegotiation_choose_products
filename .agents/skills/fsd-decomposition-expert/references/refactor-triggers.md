# Refactor Triggers

Use these triggers to decide when decomposition is worth doing.

## Good triggers
- a file mixes UI, state, requests, and mapping
- the same business concept is scattered across unrelated folders
- cross-imports between sibling slices keep growing
- code review repeatedly flags wrong placement
- navigation in the codebase is slowing down

## Weak triggers
- wanting every folder to look symmetrical
- extracting a slice only because one more file was added
- creating an entity for every backend response
- moving code just to satisfy aesthetic preferences

## Preferred action
- first fix the strongest boundary violation
- then extract the smallest coherent slice or segment
- avoid large architecture rewrites without a real trigger
