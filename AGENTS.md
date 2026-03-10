# Codex Agent — Table Feature Generator
## Next.js + Ant Design + Feature-Sliced Design (FSD)

This agent generates **complete table features** following the project's architecture.

The goal is to allow developers to say:

Create a new table feature: <feature-name>

And the agent will automatically generate:

- page
- widget
- entity
- api
- mapper
- columns factory
- table hook

All following **Feature-Sliced Design (FSD)**.

---

# 1. How the Agent is Used

The developer gives the instruction:

Create a new table feature: <feature-name>

Example:

Create a new table feature: convocations

Optional parameters:

Entity: <entity-name>
Route: /path
Filters: yes/no
Download: yes/no
Row actions: view/edit/delete

If not specified:

entity = singular form of feature
filters = yes
download = no
row actions = view/edit

---

# 2. Architecture Rules

The agent must follow **Feature-Sliced Design**.

Project structure:

src
├ pages
├ widgets
├ features
├ entities
└ shared

Each layer has strict responsibilities.

---

# 3. Pages Layer

Location:

src/pages/<feature-name>/page.tsx

Responsibilities:

- render layout
- render page title
- mount widget

Rules:

The page must NOT:

- define columns
- call APIs
- transform backend data
- manage table state

The page only renders components.

Example:

Page
├ Title
└ TableWidget

---

# 4. Widgets Layer

Location:

src/widgets/<feature-name>-table/

Structure:

ui/
<FeaturePascal>TableWidget.tsx
<FeaturePascal>TableHeader.tsx

model/
use<FeaturePascal>Table.ts
types.ts

lib/
tableStateToApiParams.ts

index.ts

Responsibilities:

- fetch data
- manage filters
- manage pagination
- manage sorting
- render table
- connect columns with UI

Widgets orchestrate the UI but must not contain domain logic.

---

# 5. Entities Layer

Location:

src/entities/<entity-name>/

Structure:

api/
<entity>.api.ts

model/
types.ts
build<EntityPascal>TableRows.ts

ui/
<entity>.columns.ts

index.ts

Responsibilities:

- API communication
- data mapping
- column structure

---

# 6. API Layer

File:

entities/<entity>/api/<entity>.api.ts

Responsibilities:

- call backend endpoints
- return DTO data

Example functions:

get<Entity>List()
create<Entity>()
update<Entity>()
delete<Entity>()

Until the backend is connected, return mock data.

---

# 7. Data Mapping

File:

entities/<entity>/model/build<Entity>TableRows.ts

Purpose:

Transform backend data into table rows.

Concept:

API response → Table rows

Example:

function buildRows(data) {

return data.map(item => ({
key: item.id,
...item
}))

}

Rules:

- pure functions
- no UI logic
- no API calls

---

# 8. Column Factory

File:

entities/<entity>/ui/<entity>.columns.ts

Columns must be generated using a **factory function**.

Example:

export function create<EntityPascal>Columns(config) {

const { columnsSpec } = config

if (columnsSpec) {

return columnsSpec.map(c => ({
title: c.title,
dataIndex: c.dataIndex,
width: c.width,
sorter: c.sortable
}))

}

return [
{
title: "ID",
dataIndex: "id"
},
{
title: "Actions",
dataIndex: "__actions"
}
]

}

Important:

The agent must NOT hardcode real column values.

The developer will provide:

- title
- dataIndex
- render
- sorter
- width
- handlers

---

# 9. Widget Hook

File:

widgets/<feature>-table/model/use<FeaturePascal>Table.ts

Responsibilities:

- load data
- manage pagination
- manage filters
- manage sorting
- expose table state

The hook must return:

rows
loading
error
pagination
filters
sort
handlers
refresh

---

# 10. Table State

Typical state variables:

rows
loading
error
page
pageSize
total
filters
sort

Handlers:

onPageChange
onSortChange
onFilterChange
refresh

---

# 11. Table Widget

File:

widgets/<feature>-table/ui/<FeaturePascal>TableWidget.tsx

Responsibilities:

- render table
- connect columns
- connect hook state

Example concept:

const table = useFeatureTable()

const columns = createColumns(config)

<Table
columns={columns}
dataSource={table.rows}
loading={table.loading}
pagination={table.pagination}
/>

---

# 12. Optional Features

If requested, the agent may generate reusable features:

features/edit-entity
features/delete-entity
features/download-table

Structure:

features/edit-entity
ui/
EditEntityButton.tsx

model/
useEditEntity.ts

---

# 13. Shared Layer Usage

The agent must reuse shared utilities if they exist.

Examples:

shared/ui/table
shared/ui/filters-engine
shared/constants/pagination

Example pagination options:

PAGE_SIZE_OPTIONS = [10,15,20,25,50,100,200]

---

# 14. Mandatory Rules

The agent must enforce these rules:

Rule 1

Columns must live in:

entities/ui

Rule 2

Table orchestration must live in:

widgets

Rule 3

Pages only render components.

Rule 4

API calls live in:

entities/api

Rule 5

Data transformation lives in:

entities/model

Rule 6

Reusable utilities live in:

shared

Rule 7

If a columns config is page-local (main table or modal table used only by one screen),
place it in:

pages/<page-slice>/model

Keep UI files presentational. Only move columns to entities when they represent reusable domain behavior.

---

# 15. Expected Output Structure

For feature: convocations

src
├ pages
│  └ convocations
│     └ page.tsx
│
├ widgets
│  └ convocations-table
│     ├ ui
│     │  └ ConvocationsTableWidget.tsx
│     └ model
│        └ useConvocationsTable.ts
│
├ entities
│  └ convocation
│     ├ api
│     │  └ convocation.api.ts
│     ├ model
│     │  └ buildConvocationTableRows.ts
│     └ ui
│        └ convocation.columns.ts
│
├ features
│
└ shared
├ ui
└ constants

---

# 16. Completion Criteria

A generated table feature is valid if:

- page mounts the widget
- widget renders an Ant Design table
- entity provides API + mapper + columns factory
- no real backend dependency exists
- columns remain dynamic
- architecture follows FSD

---

# 16.1 UI And Styling Rule

When refactoring or creating UI:

- keep business logic and styles in separate files
- use `@emotion/styled` for component styling
- prefer shared reusable controls in `src/shared/ui` before creating page-local controls
- avoid inline style objects except for trivial one-off cases that are not part of the component design system

---
# 17. Commit Rule Integration

When the user asks to create a commit, use the local commit agent first:

- `.codex/agents/commit.md`

This commit agent defines Conventional Commit format, scope selection, and commit workflow.

# Example colymns
```javascript
/**
 * @license
 * Copyright (c) ECS FIN. All rights reserved.
 *
 * Unauthorized copying or reproduction of this file, in any form,
 * including file content and design, is strictly prohibited. This source code is
 * confidential and proprietary to ECS FIN.
 */

import {Button} from "antd";

export const COLUMNS_BANKS_TABLE = (translateBanks, editBank, deleteBank) => [
    {
        title: translateBanks('columnsTable.lastUpdated'),
        dataIndex: 'updatedDate',
        width: 220,
        hidden: false,
        sorter: true,
        key: 'updatedDate'
    },
    {
        title: translateBanks('columnsTable.bankName'),
        dataIndex: 'bankName',
        width: 220,
        hidden: false,
        sorter: true,
        key: 'bankName'
    },
    {
        title: translateBanks('columnsTable.branch'),
        dataIndex: 'branch',
        width: 200,
        key: 'branch',
        hidden: false,
        sorter: true
    },
    {
        title: translateBanks('columnsTable.address'),
        dataIndex: 'address',
        key: 'address',
        width: 200,
        hidden: false,
        sorter: true
    },
    {
        title: translateBanks('columnsTable.phoneNumber'),
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
        width: 200,
        hidden: false,
        sorter: true
    },
    {
        title: translateBanks('columnsTable.swiftCode'),
        dataIndex: 'swiftCode',
        key: 'swiftCode',
        width: 200,
        hidden: false,
        sorter: true
    },
    {
        title: translateBanks('columnsTable.bankCode'),
        dataIndex: 'bankCode',
        key: 'bankCode',
        width: 200,
        hidden: false,
        sorter: true
    },
    {
        title: translateBanks('columnsTable.country'),
        dataIndex: 'country',
        key: 'country',
        width: 200,
        hidden: false,
        sorter: true
    },
    {
        title: 'Actions',
        dataIndex: '',
        width: 200,
        key: 'x',
        render: (item) => (
            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <Button onClick={() => editBank(item)}>{translateBanks('columnsTable.actions.edit')}</Button>
                <Button onClick={() => deleteBank(item)}>{translateBanks('columnsTable.actions.delete')}</Button>
            </div>
        )
    },
    {
        title: translate("columnsTableResponses.status"),
        dataIndex: "status",
        key: "status",
        hidden: false,
        type: "tag",
        getTagColor: (item) => statusColors[item],
    },
]
``` 

# End of Agent Specification


# uses

Always read ./.codex/agents/refactor.md before answering refactor-related requests
