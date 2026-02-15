# Estilos Gubernamentales Aplicados

## Descripción General

Se han aplicado los estilos del sistema de diseño gubernamental del proyecto `proveedores_pnis` al proyecto actual `renegotiation_choose_products`. Los cambios incluyen una paleta de colores profesional, tipografía moderna y componentes estandarizados.

## Archivos Modificados

### 1. `src/index.css`
- **Variables CSS actualizadas**: Implementación de la paleta de colores gubernamental
- **Tipografía**: Cambio a fuente Inter para mayor profesionalismo
- **Layout base**: Estilos para header, sidebar y contenido principal
- **Componentes base**: Formularios, botones, tablas, cards, alertas y badges

### 2. `src/components.css` (Nuevo)
- **Header gubernamental**: Gradiente azul con logo y información de usuario
- **Sidebar gubernamental**: Navegación lateral con efectos hover
- **Formularios**: Estilos para campos, labels y validaciones
- **Tablas**: Headers, filas y acciones con diseño profesional
- **Cards de estadísticas**: Componentes para mostrar métricas
- **Filtros y búsqueda**: Controles de filtrado con iconos
- **Modales y breadcrumbs**: Componentes de navegación

### 3. `src/utilities.css` (Nuevo)
- **Clases de utilidad**: Colores, espaciado, tipografía
- **Flexbox y Grid**: Utilidades de layout
- **Estados**: Hover, focus, validación
- **Responsive**: Breakpoints para diferentes dispositivos

### 4. `src/alerts.css` (Nuevo)
- **SweetAlert2**: Estilos modernos para alertas
- **Animaciones**: Efectos de entrada y salida
- **Botones**: Gradientes y estados hover
- **Toast notifications**: Notificaciones no intrusivas

### 5. `src/index.js`
- **Imports actualizados**: Inclusión de todos los archivos CSS

## Paleta de Colores

### Colores Principales
- **Primario**: `#1e3a8a` (Azul gubernamental)
- **Primario Oscuro**: `#1e40af`
- **Primario Claro**: `#3b82f6`
- **Secundario**: `#64748b` (Gris azulado)
- **Acento**: `#059669` (Verde)

### Colores de Estado
- **Éxito**: `#16a34a` (Verde)
- **Advertencia**: `#d97706` (Naranja)
- **Error**: `#dc2626` (Rojo)
- **Información**: `#0284c7` (Azul claro)

### Escala de Grises
- **Gray-50**: `#f8fafc` (Más claro)
- **Gray-100**: `#f1f5f9`
- **Gray-200**: `#e2e8f0`
- **Gray-300**: `#cbd5e1`
- **Gray-400**: `#94a3b8`
- **Gray-500**: `#64748b`
- **Gray-600**: `#475569`
- **Gray-700**: `#334155`
- **Gray-800**: `#1e293b`
- **Gray-900**: `#0f172a` (Más oscuro)

## Tipografía

- **Fuente Principal**: Inter (Google Fonts)
- **Tamaño Base**: 14px
- **Pesos Disponibles**: 300, 400, 500, 600, 700
- **Line Height**: 1.5

## Componentes Principales

### Formularios
```jsx
<div className="form-container">
  <div className="form-header">
    <h2 className="form-title">Título del Formulario</h2>
  </div>
  <div className="form-group">
    <label className="form-label required">Campo</label>
    <input type="text" className="form-control" />
  </div>
</div>
```

### Botones
```jsx
<button className="btn btn-primary">Guardar</button>
<button className="btn btn-secondary">Cancelar</button>
<button className="btn btn-success">Aprobar</button>
```

### Tablas
```jsx
<div className="table-container">
  <div className="table-header">
    <h3 className="table-title">Lista de Elementos</h3>
  </div>
  <table className="table">
    <thead>
      <tr>
        <th>Columna 1</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Dato</td>
        <td>
          <div className="table-actions">
            <button className="btn-table-action btn-table-edit">Editar</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### Cards de Estadísticas
```jsx
<div className="stats-grid">
  <div className="stat-card">
    <div className="stat-card-header">
      <span className="stat-card-title">Total</span>
    </div>
    <h3 className="stat-card-value">1,234</h3>
  </div>
</div>
```

### Alertas
```jsx
<div className="alert alert-success">Operación exitosa</div>
<div className="alert alert-warning">Advertencia</div>
<div className="alert alert-danger">Error</div>
```

### Badges
```jsx
<span className="badge badge-primary">Activo</span>
<span className="badge badge-success">Aprobado</span>
<span className="badge badge-warning">Pendiente</span>
```

## Clases de Utilidad

### Espaciado
- **Padding**: `p-0` a `p-6` (0px a 40px)
- **Margin**: `m-0` a `m-6` (0px a 40px)
- **Específicos**: `px-3`, `py-2`, `mx-auto`

### Colores de Texto
- `text-primary`, `text-secondary`, `text-success`
- `text-warning`, `text-danger`, `text-info`
- `text-muted`, `text-dark`, `text-light`

### Flexbox
- `d-flex`, `justify-content-between`, `align-items-center`
- `flex-column`, `flex-wrap`, `gap-3`

### Grid
- `d-grid`, `grid-cols-2`, `grid-cols-3`, `gap-4`

## Responsive Design

Todos los componentes incluyen breakpoints responsive:
- **Mobile**: max-width: 576px
- **Tablet**: max-width: 768px
- **Desktop**: max-width: 992px
- **Large**: max-width: 1200px

## Características Especiales

### Animaciones
- Transiciones suaves en botones y cards
- Efectos hover con elevación
- Animaciones de entrada para modales

### Accesibilidad
- Colores con contraste WCAG compliant
- Estados de focus visibles
- Navegación por teclado

### Performance
- Variables CSS para cambios globales rápidos
- Clases de utilidad para evitar CSS duplicado
- Optimización para carga rápida

## Uso Recomendado

1. **Consistencia**: Usar siempre las clases predefinidas
2. **Jerarquía**: Respetar la estructura de componentes
3. **Responsive**: Probar en diferentes dispositivos
4. **Accesibilidad**: Incluir labels y estados apropiados
5. **Performance**: Usar variables CSS para personalizaciones

## Migración de Componentes Existentes

Para migrar componentes existentes:

1. Reemplazar clases de Bootstrap por las nuevas clases gubernamentales
2. Actualizar colores usando las variables CSS
3. Aplicar la nueva estructura de formularios y tablas
4. Usar las nuevas clases de utilidad para espaciado y layout

## Mantenimiento

- Las variables CSS están centralizadas en `index.css`
- Los componentes específicos están en `components.css`
- Las utilidades están separadas en `utilities.css`
- Los estilos de alertas están en `alerts.css`

Este sistema permite fácil mantenimiento y personalización futura manteniendo la consistencia visual gubernamental.
