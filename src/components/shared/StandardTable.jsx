import { Box } from "@mui/material"; // CRÍTICO: Box es necesario para las líneas 38 y 40
import { ThemeProvider } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import {
  defaultTableProps,
  globalTableTheme,
} from "../../helpers/utils/TableConfig";

/**
 * Determina si una columna contiene valores monetarios basándose en el field
 * @param {String} field - Nombre del campo
 * @returns {Boolean}
 */
const isMonetaryField = (field) => {
  const monetaryPatterns = [
    "price",
    "precio",
    "valor",
    "total",
    "amount_of_money",
    "money",
    "valor_total",
  ];
  return monetaryPatterns.some((pattern) =>
    field.toLowerCase().includes(pattern.toLowerCase())
  );
};

/**
 * Determina si una columna es de acciones basándose en el field
 * @param {String} field - Nombre del campo
 * @returns {Boolean}
 */
const isActionField = (field) => {
  const actionPatterns = ["actions", "action", "acciones", "accion"];
  return actionPatterns.some((pattern) =>
    field.toLowerCase().includes(pattern.toLowerCase())
  );
};

/**
 * Procesa las columnas para agregar alineación automática
 * - Columnas de acciones: centradas
 * - Valores monetarios: alineados a la derecha
 * - Texto/números normales: alineados a la izquierda
 * @param {Array} columns - Configuración original de columnas
 * @returns {Array} - Columnas procesadas con alineación
 */
const processColumnsWithAlignment = (columns) => {
  return columns.map((col) => {
    // Si la columna ya tiene headerAlign y align definidos, respetarlos
    if (col.headerAlign !== undefined && col.align !== undefined) {
      return col;
    }

    // Determinar alineación basada en el tipo de campo
    const isAction = isActionField(col.field);
    const isMonetary = isMonetaryField(col.field);

    // Prioridad: Acciones > Monetario > Default (izquierda)
    if (isAction) {
      return {
        ...col,
        headerAlign: "center",
        align: "center",
      };
    }

    return {
      ...col,
      headerAlign: isMonetary ? "right" : "left",
      align: isMonetary ? "right" : "left",
    };
  });
};

/**
 * Componente de tabla estandarizado para toda la aplicación
 * Calcula altura dinámica basada en el número real de filas visibles
 * @param {Object} props - Props del componente
 * @param {Array} props.rows - Datos de las filas
 * @param {Array} props.columns - Configuración de las columnas
 * @param {Object} props.customProps - Props personalizadas para DataGrid
 * @param {Boolean} props.loading - Estado de carga
 * @param {String} props.noRowsText - Texto cuando no hay datos
 * @param {Object} props.sx - Estilos personalizados
 * @param {Boolean} props.enableDynamicHeight - Habilitar altura dinámica (máximo 15 filas = 888px)
 * @returns {JSX.Element}
 */
export const StandardTable = ({
  rows = [],
  columns = [],
  customProps = {},
  loading = false,
  noRowsText = "No hay datos disponibles",
  sx = {},
  enableDynamicHeight = true,
  ...otherProps
}) => {
  // Procesar columnas con alineación automática
  const processedColumns = useMemo(
    () => processColumnsWithAlignment(columns),
    [columns]
  );

  // Estado para tracking del pageSize actual
  const [currentPageSize, setCurrentPageSize] = useState(() => {
    return (
      customProps?.paginationModel?.pageSize ||
      customProps?.initialState?.pagination?.paginationModel?.pageSize ||
      (customProps?.pageSizeOptions && customProps.pageSizeOptions[0]) ||
      25
    );
  });

  // Wrapper para onPaginationModelChange que actualiza el pageSize
  const handlePaginationModelChange = (model) => {
    if (model.pageSize !== currentPageSize) {
      setCurrentPageSize(model.pageSize);
    }
    // Llamar al handler original si existe
    if (customProps?.onPaginationModelChange) {
      customProps.onPaginationModelChange(model);
    }
  };

  // Calcular altura dinámica precisa basada en número real de filas
  const dynamicHeight = useMemo(() => {
    if (!enableDynamicHeight) return { height: 600 }; // Altura fija por defecto

    // Altura base: Header (56px) + Footer (52px) = 108px
    const baseHeight = 108;
    // Altura por fila: 52px
    const rowHeight = 52;

    // Número de filas reales en la tabla (funciona tanto para paginación cliente como servidor)
    const actualRows = rows.length;

    // Si no hay filas, mostrar altura mínima
    if (actualRows === 0) {
      return {
        height: `${baseHeight + rowHeight * 3}px`,
      }; // Mínimo 3 filas para mensaje "No hay datos"
    }

    // Calcular altura exacta para las filas actuales
    const calculatedHeight = baseHeight + actualRows * rowHeight;

    // Máximo de 15 filas visibles antes de scroll (888px)
    const maxVisibleRows = 15;
    const maxHeight = baseHeight + maxVisibleRows * rowHeight;

    // Si tenemos menos filas que el máximo, usar altura exacta
    // Si tenemos más filas, usar altura máxima + scroll
    const finalHeight = Math.min(calculatedHeight, maxHeight);

    return {
      height: `${finalHeight}px`,
    };
  }, [enableDynamicHeight, rows.length]);

  const mergedProps = {
    ...defaultTableProps,
    ...customProps,
    // NO usar autoHeight, controlamos la altura manualmente
    onPaginationModelChange: handlePaginationModelChange,
    sx: {
      ...defaultTableProps.sx,
      ...dynamicHeight,
      // Estilo moderno sin bordes dobles
      border: "1px solid #e9ecef",
      borderRadius: "12px",
      backgroundColor: "#ffffff",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",

      // Headers modernos
      "& .MuiDataGrid-columnHeaders": {
        backgroundColor: "#f8f9fa",
        borderBottom: "1px solid #e9ecef",
        minHeight: "56px !important",
        height: "56px !important",
        borderRadius: "0",
      },
      "& .MuiDataGrid-columnHeader": {
        borderRight: "none !important",
        "&:focus": {
          outline: "none",
        },
        "&:focus-within": {
          outline: "none",
        },
      },
      "& .MuiDataGrid-columnHeaderTitle": {
        fontWeight: 600,
        color: "#495057",
        fontSize: "0.875rem",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
      },

      // Celdas limpias sin bordes internos
      "& .MuiDataGrid-cell": {
        borderBottom: "none !important",
        borderRight: "none !important",
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        "&:focus": {
          outline: "none",
        },
        "&:focus-within": {
          outline: "2px solid #0066cc",
          outlineOffset: "-2px",
        },
      },

      // Filas con separación sutil
      "& .MuiDataGrid-row": {
        minHeight: "52px !important",
        height: "52px !important",
        borderBottom: "1px solid #f1f3f4",
        "&:hover": {
          backgroundColor: "#f8f9fa",
        },
        "&:last-child": {
          borderBottom: "none",
        },
        "&.Mui-selected": {
          backgroundColor: "#e3f2fd",
          "&:hover": {
            backgroundColor: "#bbdefb",
          },
        },
      },

      // Eliminar todos los separadores verticales
      "& .MuiDataGrid-columnSeparator": {
        display: "none !important",
      },
      "& .MuiDataGrid-cellSeparator": {
        display: "none !important",
      },

      // Footer limpio
      "& .MuiDataGrid-footerContainer": {
        minHeight: "52px",
        borderTop: "1px solid #e9ecef",
        backgroundColor: "#fafbfc",
      },

      // Virtualización sin scroll cuando hay pocas filas
      "& .MuiDataGrid-virtualScroller": {
        backgroundColor: "#ffffff",
        // Scroll solo si hay más de 15 filas
        overflowY: rows.length > 15 ? "auto" : "hidden !important",
        overflowX: "hidden",
      },

      ...sx,
    },
  };

  return (
    <Box
      className="table-wrapper"
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ThemeProvider theme={globalTableTheme}>
        <DataGrid
          rows={rows}
          columns={processedColumns}
          loading={loading}
          disableColumnMenu={false}
          disableColumnSelector={false}
          disableDensitySelector={false}
          disableColumnFilter={false}
          disableColumnResize={false}
          disableMultipleColumnsSorting={false}
          showColumnVerticalBorder={false}
          showCellVerticalBorder={false}
          showColumnRightBorder={false}
          showCellRightBorder={false}
          hideFooterSelectedRowCount={true}
          localeText={{
            noRowsLabel: noRowsText,
            toolbarDensity: "Densidad",
            toolbarDensityLabel: "Densidad",
            toolbarDensityCompact: "Compacta",
            toolbarDensityStandard: "Estándar",
            toolbarDensityComfortable: "Cómoda",
            toolbarColumns: "Columnas",
            toolbarColumnsLabel: "Seleccionar columnas",
            toolbarFilters: "Filtros",
            toolbarFiltersLabel: "Mostrar filtros",
            toolbarFiltersTooltipHide: "Ocultar filtros",
            toolbarFiltersTooltipShow: "Mostrar filtros",
            toolbarQuickFilterPlaceholder: "Buscar...",
            columnsPanelTextFieldLabel: "Buscar columna",
            columnsPanelTextFieldPlaceholder: "Título de columna",
            columnsPanelDragIconLabel: "Reordenar columna",
            columnsPanelShowAllButton: "Mostrar todas",
            columnsPanelHideAllButton: "Ocultar todas",
            filterPanelAddFilter: "Agregar filtro",
            filterPanelDeleteIconLabel: "Eliminar",
            filterPanelOperators: "Operadores",
            filterOperatorContains: "contiene",
            filterOperatorEquals: "es igual a",
            filterOperatorStartsWith: "comienza con",
            filterOperatorEndsWith: "termina con",
            filterOperatorIsEmpty: "está vacío",
            filterOperatorIsNotEmpty: "no está vacío",
            filterOperatorIsAnyOf: "es cualquiera de",
            footerRowSelected: (count) =>
              count !== 1
                ? `${count.toLocaleString()} filas seleccionadas`
                : `${count.toLocaleString()} fila seleccionada`,
            footerTotalRows: "Total de filas:",
            footerTotalVisibleRows: (visibleCount, totalCount) =>
              `${visibleCount.toLocaleString()} de ${totalCount.toLocaleString()}`,
            columnMenuLabel: "Menú",
            columnMenuShowColumns: "Mostrar columnas",
            columnMenuFilter: "Filtro",
            columnMenuHideColumn: "Ocultar",
            columnMenuUnsort: "Desordenar",
            columnMenuSortAsc: "Ordenar ASC",
            columnMenuSortDesc: "Ordenar DESC",
            columnHeaderFiltersTooltipActive: (count) =>
              count !== 1
                ? `${count} filtros activos`
                : `${count} filtro activo`,
            columnHeaderFiltersLabel: "Mostrar filtros",
            columnHeaderSortIconLabel: "Ordenar",
          }}
          {...mergedProps}
          {...otherProps}
        />
      </ThemeProvider>
    </Box>
  );
};

export default StandardTable;
