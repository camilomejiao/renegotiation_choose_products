# REFACTOR_FSD_AGENT.md

## Objetivo

Refactorizar una vista React existente hacia una estructura basada en **Feature-Sliced Design v2.1** con enfoque **pages-first**, manteniendo el proyecto compatible con una migración futura a Next.js.

## Integración con commits

Si el usuario pide crear commit, delegar las reglas de commit a:

- `agents/commit.md`

La vista a reorganizar corresponde al área principal de administración de catálogo/convocatorias y contiene:

- banner o encabezado visual
- toolbar con búsqueda y acciones
- tabla principal paginada
- acciones por fila
- estado visual por registro

## Principios arquitectónicos obligatorios

### 1. Pages first
Empieza por la `page`.

No extraigas `widgets`, `features` o `entities` antes de que exista una necesidad clara de reutilización o de separación de responsabilidades.

### 2. No todo debe ser feature
Solo crear `features` para acciones de negocio claras y con potencial de reutilización.

### 3. Widgets solo si aportan valor real
No convertir el bloque principal de la pantalla en `widget` si representa casi todo el contenido de una sola página y no se reutiliza.

### 4. Shared solo para lo realmente compartido
No mover a `shared` nada que viva en una sola página.

### 5. Segmentar por propósito, no por tipo de archivo
Usar segmentos como:

- `ui`
- `api`
- `model`
- `lib`
- `config`

No usar carpetas genéricas como:

- `components`
- `hooks`
- `utils`
- `types`

### 6. Public API estricta
Cada slice debe exponer un `index.ts`.

Desde afuera solo se puede importar desde ese `index.ts`, nunca desde archivos internos.

### 7. Regla de imports entre capas
Un módulo solo puede importar desde capas inferiores.

Orden de capas permitido:

- `app`
- `pages`
- `widgets`
- `features`
- `entities`
- `shared`

`processes` no debe usarse.

---

## Decisión para esta vista

La pantalla debe modelarse primero como una **page fuerte**.

### Slice principal
- `pages/catalog-management`

### Entity principal
- `entities/catalog-item`

### Features candidatas
Solo si ya existen o si se desea separarlas desde ahora:

- `features/catalog-search`
- `features/create-catalog-item`
- `features/edit-catalog-item`
- `features/export-catalog-report`

### Widgets
No crear widgets en esta primera iteración, salvo que exista reutilización comprobada.

---

## Estructura objetivo del proyecto

```txt
src/
  app/
    entrypoint/
    providers/
    routes/
    styles/

  pages/
    catalog-management/
      api/
      model/
      ui/
      index.ts

  features/
    catalog-search/
      model/
      ui/
      index.ts

    create-catalog-item/
      model/
      ui/
      index.ts

    edit-catalog-item/
      ui/
      index.ts

    export-catalog-report/
      model/
      ui/
      index.ts

  entities/
    catalog-item/
      api/
      lib/
      model/
      ui/
      index.ts

  shared/
    api/
    config/
    lib/
    routes/
    ui/
```

### Estructura detallada propuesta
```
src/
  app/
    entrypoint/
      main.tsx
    providers/
      router-provider.tsx
      query-provider.tsx
      store-provider.tsx
      index.ts
    routes/
      index.tsx
      route-paths.ts
    styles/
      globals.css

  pages/
    catalog-management/
      api/
        get-catalog-page.ts
      model/
        types.ts
        use-catalog-management-filters.ts
        use-catalog-management-sorting.ts
        use-catalog-management-pagination.ts
      ui/
        catalog-management-page.tsx
        catalog-management-header.tsx
        catalog-management-toolbar.tsx
        catalog-management-table-section.tsx
        catalog-management-empty-state.tsx
        catalog-management-error-state.tsx
      index.ts

  features/
    catalog-search/
      model/
        use-catalog-search.ts
      ui/
        catalog-search-input.tsx
      index.ts

    create-catalog-item/
      model/
        use-create-catalog-item.ts
      ui/
        create-catalog-item-button.tsx
      index.ts

    edit-catalog-item/
      ui/
        edit-catalog-item-button.tsx
      index.ts

    export-catalog-report/
      model/
        export-catalog-report.ts
      ui/
        export-catalog-report-button.tsx
      index.ts

  entities/
    catalog-item/
      api/
        get-catalog-items.ts
        update-catalog-item.ts
      lib/
        map-catalog-item.ts
        get-catalog-item-status-tone.ts
      model/
        types.ts
        constants.ts
      ui/
        catalog-item-status-badge.tsx
        catalog-item-row.tsx
      index.ts

  shared/
    api/
      http-client.ts
      index.ts

    config/
      env.ts
      index.ts

    routes/
      paths.ts
      index.ts

    lib/
      date/
        format-date.ts
        index.ts
      text/
        normalize-text.ts
        index.ts

    ui/
      badge/
        badge.tsx
        index.ts
      button/
        button.tsx
        index.ts
      card/
        card.tsx
        index.ts
      input/
        input.tsx
        index.ts
      pagination/
        pagination.tsx
        index.ts
      table/
        table.tsx
        index.ts
        

```

### Responsabilidad por capa
```app

Contiene lo global de la aplicación:

entrypoint React

providers

configuración de rutas

estilos globales

No poner aquí lógica de negocio de la pantalla.

pages

La vista completa vive aquí.

La page compone la pantalla y orquesta:

toolbar

carga de datos

estados visuales

render principal

La page puede contener bastante lógica mientras siga siendo clara.

features

Solo acciones de negocio con valor para el usuario:

buscar

crear

editar

exportar

No crear features para elementos puramente visuales.

entities

Representan el concepto principal del dominio:

item del catálogo

convocatoria

registro administrable

Aquí deben vivir:

tipos de dominio

mapeos

badge de estado

requests propias del entity cuando tenga sentido

shared

Solo piezas genéricas y reutilizables:

componentes de UI base

cliente HTTP

utilidades bien agrupadas por propósito

config global

constantes de rutas
```

### Reglas
```
Reglas de importación que Codex debe respetar
Permitido

pages puede importar de features, entities, shared

features puede importar de entities, shared

entities puede importar de shared

app puede importar de cualquier capa inferior

# Prohibido

una page importar otra page

una feature importar otra feature

una entity importar otra entity directamente salvo estrategia explícita controlada

importar archivos internos saltando el index.ts del slice

poner lógica de negocio específica en shared/ui

usar processes`
```
### Convenciones
```
Convenciones de nombres
Capas

Usar nombres estándar:

app

pages

widgets

features

entities

shared

Slices

Nombrar por dominio o caso de uso:

catalog-management

catalog-item

catalog-search

Segments

Usar solo nombres por propósito:

ui

api

model

lib

config

```

### Criterios
```
Extraer a feature cuando:

la acción aporta valor al usuario

tiene lógica propia

se reutiliza o probablemente se reutilizará

Extraer a entity cuando:

representa un concepto del negocio

requiere tipos, mappers o UI de representación propia

Extraer a widget cuando:

es un bloque grande, autosuficiente

se reutiliza

o la página tiene varios bloques grandes independientes

Mantener dentro de la page cuando:

pertenece solo a esta pantalla

no se reutiliza

la extracción no mejora claridad
```

### Que no debe hacer codex
```
no crear widgets por defecto

no crear demasiadas features

no usar processes

no crear carpetas como components, hooks, utils, types como segmento principal

no mover a shared código usado solo por esta page

no hacer imports profundos como:

@/features/catalog-search/ui/catalog-search-input

@/entities/catalog-item/model/types

no mezclar cliente HTTP genérico con lógica de dominio en el mismo lugar

no dejar botones de negocio sueltos en shared/ui
```
