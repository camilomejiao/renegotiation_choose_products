# Layer vs Slice vs Segment

## Layer
Layer answers:
- What kind of architectural responsibility is this?
- What is the allowed dependency direction?

Examples:
- `features`
- `entities`
- `shared`

## Slice
Slice answers:
- Which business concept or capability does this belong to?

Examples:
- `features/export-report`
- `entities/customer`

## Segment
Segment answers:
- What technical role does this code play inside that slice?

Examples:
- `ui`
- `model`
- `api`

## Fast test
If you can name the folder only with technical words, you are probably thinking in segments too early.
