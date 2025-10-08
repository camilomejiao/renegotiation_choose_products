# Guía de Uso de StandardTable

## Descripción

El componente `StandardTable` es una implementación estandarizada de DataGrid que proporciona un estilo consistente en toda la aplicación.

## Características

- ✅ Estilos unificados siguiendo el design system de la aplicación
- ✅ Configuración de localización en español
- ✅ Props predeterminadas optimizadas
- ✅ Botones de acción estandarizados con clases CSS
- ✅ Soporte para temas personalizados
- ✅ Responsive design

## Uso Básico

```jsx
import StandardTable from "../../components/shared/StandardTable";
import { getConvocationColumns } from "../../helpers/utils/ConvocationProductColumns";

function MiComponente() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = getConvocationColumns(handleModalSuppliers, handleReport);

  return (
    <div className="page-wrapper">
      <StandardTable
        rows={rows}
        columns={columns}
        loading={loading}
        noRowsText="No hay convocatorias disponibles"
      />
    </div>
  );
}
```

## Props Disponibles

| Prop          | Tipo    | Default                    | Descripción                        |
| ------------- | ------- | -------------------------- | ---------------------------------- |
| `rows`        | Array   | `[]`                       | Datos de las filas                 |
| `columns`     | Array   | `[]`                       | Configuración de columnas          |
| `loading`     | Boolean | `false`                    | Estado de carga                    |
| `noRowsText`  | String  | "No hay datos disponibles" | Texto cuando no hay datos          |
| `customProps` | Object  | `{}`                       | Props personalizadas para DataGrid |
| `sx`          | Object  | `{}`                       | Estilos personalizados             |

## Clases CSS para Botones

### Variantes Disponibles

```css
/* Botón primario */
.table-button--primary

/* Botón secundario */
/* Botón secundario */
.table-button--secondary

/* Botón de advertencia */
.table-button--warning

/* Botón de peligro */
.table-button--danger

/* Botón de éxito */
.table-button--success

/* Botón de información */
.table-button--info

/* Botón solo icono */
.table-button--icon-only;
```

### Ejemplo de Uso en Columnas

```jsx
{
  field: 'actions',
  headerName: 'Acciones',
  width: 150,
  renderCell: (params) => (
    <Box className="table-actions">
      <button
        className="table-button table-button--warning table-button--icon-only"
        onClick={() => handleEdit(params.row.id)}
        title="Editar"
      >
        <FaEdit />
      </button>
      <button
        className="table-button table-button--danger table-button--icon-only"
        onClick={() => handleDelete(params.row.id)}
        title="Eliminar"
      >
        <FaTrash />
      </button>
    </Box>
  ),
  sortable: false,
  filterable: false,
}
```

## Migración desde DataGrid Original

### Antes

```jsx
<div className="table-card">
  <DataGrid
    rows={rows}
    columns={columns}
    pageSizeOptions={[5, 10, 25]}
    disableRowSelectionOnClick
    sx={
      {
        // estilos personalizados aquí
      }
    }
  />
</div>
```

### Después

```jsx
<StandardTable
  rows={rows}
  columns={columns}
  customProps={{
    pageSizeOptions: [5, 10, 25], // solo si necesitas override
  }}
/>
```

## Estilos Personalizados

Si necesitas personalizar estilos específicos:

```jsx
<StandardTable
  rows={rows}
  columns={columns}
  sx={{
    height: 800, // altura personalizada
    "& .MuiDataGrid-cell": {
      fontSize: "1rem", // tamaño de fuente personalizado
    },
  }}
/>
```

## Archivos Actualizados

Los siguientes archivos han sido actualizados con el nuevo estilo estandarizado:

- ✅ `ConvocationProductColumns.js`
- ✅ `ManagementColumns.js`
- ✅ `ValidateProductColumns.js`
- ✅ `PaymentsColumns.js` (sin cambios necesarios)

## Layout y Sidebar

### Cambios Implementados

1. **Sidebar siempre desplegado**: El sidebar ahora está desplegado por defecto
2. **Variables CSS actualizadas**: Se agregaron nuevas variables para manejar el ancho del sidebar
3. **Estilos responsive**: El sidebar se comporta correctamente en dispositivos móviles

### Variables CSS Disponibles

```css
:root {
  --sidebar-w: 240px; /* Ancho del sidebar desplegado */
  --sidebar-w-collapsed: 88px; /* Ancho del sidebar colapsado */
}
```

## Notas Importantes

- Todos los botones en las tablas ahora usan las clases CSS estandarizadas
- Los campos de entrada (TextField, Select) tienen estilos consistentes
- El componente es totalmente compatible con el tema actual de la aplicación
- Se mantiene la funcionalidad de todas las características existentes
