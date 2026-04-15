---
name: fsd-navigation-sidebar
description: Use when adding or modifying sidebar items, route registration, labels, icons, or submenu structure connected to `src/shared/config/sidebar-items.js` in FSD-based frontend projects.
---

# FSD Navigation Sidebar

Use this skill for sidebar and menu changes.

## Source of truth
- `src/shared/config/sidebar-items.js`

## Rules
- Every key must be unique, including nested items
- Prefer i18n keys instead of hardcoded labels
- Follow the existing route/path conventions
- A sidebar change is incomplete until the matching route in `src/pages/**` and composition in `src/pages-layer/**` exist
- Do not add business logic or side effects inside sidebar config
