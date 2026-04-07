# Filter Contract

## Source of truth
`useFilter` owns:
- `formValues`
- `updateFilters`
- `clearFilters`
- `queryParams`

## UI responsibilities
`Filter`
- Renders the drawer
- Renders dynamic fields from `filterConfig`
- Triggers state updates through `useFilter`

`FilterTags`
- Reads from `queryParams`
- Renders active filters
- Removes filters and clears all

## Declarative config
Each field may define:
- `fieldKey`
- `type`
- `conditions`
- `options`
- `placeholder`
- `hidden`
- `value`

Additional config:
- `filterMode`
- `search`

## Normalization
- Standardize on `startsWith` and `endsWith`
- Number fields should only support numeric operators
- Standardize on `search`, not `filterSearch`
