import { createTheme } from "@mui/material/styles";

// Configuración global para todas las tablas DataGrid - Estilo moderno sin bordes
export const globalTableTheme = createTheme({
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: "none", // Sin borde base
          borderRadius: "0px",
          backgroundColor: "transparent",
          fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
          "& .MuiDataGrid-main": {
            borderRadius: "0px",
          },
          // Headers sin bordes internos
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "transparent",
            minHeight: "56px !important",
            height: "56px !important",
            position: "sticky",
            top: 0,
            zIndex: 2,
            border: "none",
          },
          "& .MuiDataGrid-columnHeader": {
            outline: "none",
            backgroundColor: "transparent !important",
            border: "none !important",
            "&:focus": {
              outline: "none",
            },
            "&:focus-within": {
              outline: "none",
            },
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "600 !important",
            fontSize: "0.875rem !important",
            color: "#333333 !important",
            textTransform: "uppercase !important",
            letterSpacing: "0.02em !important",
            lineHeight: "1.2 !important",
            overflow: "visible !important",
            whiteSpace: "normal !important",
            display: "block !important",
          },
          "& .MuiDataGrid-columnHeaderTitleContainer": {
            padding: "0 12px !important",
            height: "100% !important",
            display: "flex !important",
            alignItems: "center !important",
            justifyContent: "flex-start !important",
            overflow: "visible !important",
          },
          // Alineación de headers para valores monetarios (derecha)
          "& .MuiDataGrid-columnHeader[data-field*='price'], & .MuiDataGrid-columnHeader[data-field*='precio'], & .MuiDataGrid-columnHeader[data-field*='valor'], & .MuiDataGrid-columnHeader[data-field*='total'], & .MuiDataGrid-columnHeader[data-field*='amount_of_money'], & .MuiDataGrid-columnHeader[data-field*='money']":
            {
              "& .MuiDataGrid-columnHeaderTitleContainer": {
                justifyContent: "flex-end !important",
              },
            },
          // Alineación de headers para columnas de acciones (centro)
          "& .MuiDataGrid-columnHeader[data-field*='action']": {
            "& .MuiDataGrid-columnHeaderTitleContainer": {
              justifyContent: "center !important",
            },
          },
          "& .MuiDataGrid-columnSeparator": {
            display: "none !important",
          },
          // Celdas completamente limpias
          "& .MuiDataGrid-cell": {
            color: "#333333",
            fontSize: "0.875rem",
            lineHeight: 1.4,
            padding: "12px 16px",
            border: "none !important",
            "&:focus": {
              outline: "none",
            },
            "&:focus-within": {
              outline: "none",
            },
            // Alineación dinámica basada en el tipo de contenido
            // Columnas de acciones al CENTRO
            "&[data-field*='action']": {
              textAlign: "center",
              justifyContent: "center",
              display: "flex",
              alignItems: "center",
            },
            // Valores monetarios a la DERECHA
            "&[data-field*='price'], &[data-field*='precio'], &[data-field*='valor'], &[data-field*='total'], &[data-field*='amount_of_money'], &[data-field*='money']":
              {
                textAlign: "right",
                justifyContent: "flex-end",
                display: "flex",
                alignItems: "center",
              },
            // Texto y números normales a la IZQUIERDA (por defecto)
            "&[data-field*='name'], &[data-field*='nombre'], &[data-field*='description'], &[data-field*='categoria'], &[data-field*='marca'], &[data-field*='identification'], &[data-field*='id'], &[data-field*='amount']:not([data-field*='amount_of_money'])":
              {
                textAlign: "left",
                justifyContent: "flex-start",
                display: "flex",
                alignItems: "center",
              },
          },
          // Filas sin bordes internos
          "& .MuiDataGrid-row": {
            border: "none !important",
            "&:hover": {
              backgroundColor: "transparent",
            },
            "&.Mui-selected": {
              backgroundColor: "transparent",
              "&:hover": {
                backgroundColor: "transparent",
              },
            },
          },
          // Footer sin bordes
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: "transparent",
            padding: "8px 16px",
            border: "none",
            minHeight: "52px",
            "& .MuiTablePagination-root": {
              overflow: "visible",
            },
            "& .MuiTablePagination-toolbar": {
              padding: "0",
              minHeight: "52px",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            },
            "& .MuiTablePagination-spacer": {
              flex: "1 1 100%",
            },
            "& .MuiTablePagination-selectLabel": {
              margin: "0 8px 0 0",
              fontSize: "0.875rem",
              color: "#666666",
            },
            "& .MuiTablePagination-select": {
              fontSize: "0.875rem",
              marginRight: "16px",
              paddingRight: "24px",
            },
            "& .MuiTablePagination-displayedRows": {
              margin: "0 16px 0 0",
              fontSize: "0.875rem",
              color: "#666666",
            },
            "& .MuiTablePagination-actions": {
              marginLeft: "8px",
            },
            "& .MuiButtonBase-root": {
              color: "#1976d2",
              padding: "4px",
              "&:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.04)",
              },
              "&.Mui-disabled": {
                color: "#bdbdbd",
              },
            },
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: "#ffffff",
          },
          "& .MuiDataGrid-toolbarContainer": {
            padding: "0.75rem",
            borderBottom: "1px solid #e0e0e0",
          },
        },
      },
    },
  },
});

// Configuración de props comunes para todas las tablas
export const defaultTableProps = {
  disableRowSelectionOnClick: true,
  // Hacer 25 el tamaño de página predeterminado para toda la aplicación
  pageSizeOptions: [10, 25, 50, 100],
  initialState: {
    pagination: {
      paginationModel: { page: 0, pageSize: 25 },
    },
  },
  sx: {
    height: "100%",
    width: "100%",
    "& .MuiDataGrid-root": {
      height: "100%",
    },
    "& .MuiDataGrid-virtualScroller": {
      // Permitir que se ajuste a la altura del contenedor
      height: "auto",
      maxHeight: "none",
    },
    // Asegurar que los headers se muestren
    "& .MuiDataGrid-columnHeaders": {
      position: "sticky",
      top: 0,
      zIndex: 1,
    },
  },
  density: "comfortable",
  disableColumnFilter: false,
  disableColumnSelector: false,
  disableDensitySelector: false,
  checkboxSelection: false,
  rowSelectionModel: [],
};

// Función helper para aplicar estilos consistentes a botones en tablas
export const getTableButtonStyles = (variant = "primary") => {
  const baseStyles = {
    minWidth: "40px",
    height: "36px",
    borderRadius: "8px",
    padding: "8px 12px",
    fontSize: "0.875rem",
    fontWeight: 500,
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
  };

  const variants = {
    primary: {
      ...baseStyles,
      backgroundColor: "#046999",
      color: "#ffffff",
      border: "1px solid #046999",
      "&:hover": {
        backgroundColor: "#024f73",
        transform: "translateY(-1px)",
      },
    },
    secondary: {
      ...baseStyles,
      backgroundColor: "transparent",
      color: "#046999",
      border: "1px solid #046999",
      "&:hover": {
        backgroundColor: "rgba(4, 105, 153, 0.08)",
        transform: "translateY(-1px)",
      },
    },
    warning: {
      ...baseStyles,
      backgroundColor: "#ff9800",
      color: "#ffffff",
      border: "1px solid #ff9800",
      "&:hover": {
        backgroundColor: "#f57c00",
        transform: "translateY(-1px)",
      },
    },
    danger: {
      ...baseStyles,
      backgroundColor: "#f44336",
      color: "#ffffff",
      border: "1px solid #f44336",
      "&:hover": {
        backgroundColor: "#d32f2f",
        transform: "translateY(-1px)",
      },
    },
    success: {
      ...baseStyles,
      backgroundColor: "#2E7D32",
      color: "#ffffff",
      border: "1px solid #2E7D32",
      "&:hover": {
        backgroundColor: "#1b5e20",
        transform: "translateY(-1px)",
      },
    },
    info: {
      ...baseStyles,
      backgroundColor: "#2196f3",
      color: "#ffffff",
      border: "1px solid #2196f3",
      "&:hover": {
        backgroundColor: "#1976d2",
        transform: "translateY(-1px)",
      },
    },
  };

  return variants[variant] || variants.primary;
};

// Función para crear wrapper de tabla con estilos consistentes
export const createTableWrapper = (children) => {
  return `
    <div className="table-wrapper">
      <div className="table-container">
        ${children}
      </div>
    </div>
  `;
};
