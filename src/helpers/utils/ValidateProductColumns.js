import { Box, MenuItem, Select, TextField } from "@mui/material";
import { FaThumbsDown, FaThumbsUp, FaTrash } from "react-icons/fa";

// Services
import { productServices } from "../services/ProductServices";

//Enum
import {
  ResponseStatusEnum,
  RolesEnum,
  StatusTeamProductEnum,
} from "../GlobalEnum";

//
export const getBaseColumns = () => [
  { field: "id", headerName: "ID", width: 70 },
  { field: "category", headerName: "Categoría", width: 150 },
  { field: "name", headerName: "Nombre", width: 200 },
  { field: "description", headerName: "Descripción", width: 350 },
  { field: "brand", headerName: "Marca", width: 150 },
  { field: "unit", headerName: "Unidad", width: 100 },
  { field: "price_min", headerName: "Precio Min", width: 100 },
  { field: "price_max", headerName: "Precio Max", width: 100 },
  { field: "price", headerName: "VALOR", width: 100 },
];

export const formatPrice = (value) => {
  if (!value) return "";
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "COP",
  }).format(value);
};

// Obtener opciones de unidad de producto
export const getUnitOptions = async () => {
  try {
    const { data, status } = await productServices.getUnitList();
    if (status === ResponseStatusEnum.OK) return data;
    return [];
  } catch (error) {
    console.error("Error en getUnitOptions:", error);
    throw error;
  }
};

// Obtener opciones de categorías de productos
export const getCategoryOptions = async () => {
  try {
    const { data, status } = await productServices.getCategoryList();
    if (status === ResponseStatusEnum.OK) return data;
    return [];
  } catch (error) {
    console.error("Error en getCategoryOptions:", error);
    throw error;
  }
};

//
export const getStatusProduct = () => [
  { field: "state", headerName: "ESTADO", width: 150 },
];

//Obtener restricciones ambientales
export const getEnvironmentalCategories = async () => {
  try {
    const { data, status } = await productServices.getCategoriesENVIRONMENTAL();
    if (status === ResponseStatusEnum.OK) {
      return data;
    }
    return [];
  } catch (error) {
    console.error("Error obteniendo categorías ambientales:", error);
    return [];
  }
};

//Categorías de restricciones ambientales
export const getEnvironmentalCategoriesColumns = async (
  handleSelectChange,
  handleCustomChange
) => {
  const categories = await getEnvironmentalCategories();

  //Columnas SI/NO por categoría
  const environmentalColumns = categories.map((category) => ({
    field: category.codigo,
    headerName: `${category.codigo}: ${category.descripcion}`,
    width: 200,
    editable: false,
    renderCell: (params) => (
      <Select
        value={String(params.value ?? "")}
        onChange={(e) => {
          const newValue = e.target.value;
          handleSelectChange(category.codigo)(params, newValue);
        }}
        fullWidth
        size="small"
        variant="outlined"
        sx={{
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#d9e2ef",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#046999",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#046999",
          },
          fontSize: "0.95rem",
        }}
      >
        <MenuItem value="1">Sí</MenuItem>
        <MenuItem value="0">No</MenuItem>
      </Select>
    ),
    sortable: false,
    filterable: false,
  }));

  //Columna personalizada con valor numérico y select de categoría
  const customValueColumn = {
    field: "custom_category_value",
    headerName: "Valor Categoría Ambiental",
    width: 300,
    editable: false,
    renderCell: (params) => {
      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            gap: 1,
          }}
        >
          <TextField
            type="number"
            value={params.row.customValue || ""}
            onChange={(e) =>
              handleCustomChange(params, "customValue", e.target.value)
            }
            size="small"
            variant="outlined"
            sx={{
              width: "35%",
              "& .MuiOutlinedInput-root": {
                fontSize: "0.95rem",
              },
            }}
          />
          <Select
            value={params.row.selectedCategory || ""}
            onChange={(e) =>
              handleCustomChange(params, "selectedCategory", e.target.value)
            }
            size="small"
            variant="outlined"
            sx={{
              width: "65%",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#d9e2ef",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#046999",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#046999",
              },
              fontSize: "0.95rem",
            }}
          >
            {categories.map((cat) => (
              <MenuItem key={cat.codigo} value={cat.codigo}>
                {cat.descripcion}
              </MenuItem>
            ))}
          </Select>
        </Box>
      );
    },
    sortable: false,
    filterable: false,
  };

  return [...environmentalColumns, customValueColumn];
};

//
export const getObservationsEnvironmentalColumns = () => {
  const statusColors = {
    [StatusTeamProductEnum.DENIED.label]: "red",
    [StatusTeamProductEnum.APPROVED.label]: "green",
    [StatusTeamProductEnum.UNREVIEWED.label]: "orange",
  };

  const renderObservationCell = (params, placeholder) => {
    const { comentario, funcionario, fecha } = params.value || {};
    return (
      <span style={{ color: comentario ? "black" : "gray" }}>
        {comentario || placeholder}
        {funcionario && fecha && (
          <span>
            {" "}
            (Revisado por: {funcionario} - {fecha})
          </span>
        )}
      </span>
    );
  };

  const renderStatusCell = (params) => {
    return (
      <span
        style={{
          color: "white",
          backgroundColor: statusColors[params.value] || "gray",
          padding: "5px 10px",
          borderRadius: "5px",
          fontWeight: "bold",
          textAlign: "center",
          display: "inline-block",
          width: "100%",
          textTransform: "capitalize",
        }}
      >
        {params.value || "No definido"}
      </span>
    );
  };

  return [
    {
      field: "observations_environmental",
      headerName: "Observación Ambiental",
      width: 200,
      editable: false,
      renderCell: (params) =>
        renderObservationCell(params, "Observación ambiental..."),
    },
    {
      field: "status_environmental",
      headerName: "Estado Ambiental",
      width: 120,
      editable: false,
      renderCell: renderStatusCell,
    },
  ];
};

export const getObservationsSupervisionColumns = () => {
  const statusColors = {
    [StatusTeamProductEnum.DENIED.label]: "red",
    [StatusTeamProductEnum.APPROVED.label]: "green",
    [StatusTeamProductEnum.UNREVIEWED.label]: "orange",
  };

  const renderObservationCell = (params, placeholder) => {
    const { comentario, funcionario, fecha } = params.value || {};
    return (
      <span style={{ color: comentario ? "black" : "gray" }}>
        {comentario || placeholder}
        {funcionario && (
          <span>
            {" "}
            (Revisado por: {funcionario}
            {fecha ? ` - ${fecha}` : ""})
          </span>
        )}
      </span>
    );
  };

  const renderStatusCell = (params) => {
    return (
      <span
        style={{
          color: "white",
          backgroundColor: statusColors[params.value] || "gray",
          padding: "5px 10px",
          borderRadius: "5px",
          fontWeight: "bold",
          textAlign: "center",
          display: "inline-block",
          width: "100%",
          textTransform: "capitalize",
        }}
      >
        {params.value || "No definido"}
      </span>
    );
  };

  return [
    {
      field: "observations_supervision",
      headerName: "Observación supervision",
      width: 400,
      editable: false,
      renderCell: (params) =>
        renderObservationCell(params, "Observación supervision..."),
    },
    {
      field: "status_supervision",
      headerName: "Estado supervision",
      width: 150,
      editable: false,
      renderCell: renderStatusCell,
    },
  ];
};

export const getActionsColumns = (
  userRole,
  handleDeleteClick,
  handleApproveByAudit
) => [
  {
    field: "actions",
    headerName: "ACCIONES",
    width: 150,
    renderCell: (params) => (
      <Box className="table-actions">
        {/* Botón de eliminar SOLO para SUPPLIER */}
        {userRole === RolesEnum.SUPPLIER && (
          <button
            className="table-button table-button--danger table-button--icon-only"
            onClick={() => handleDeleteClick(params.row.id)}
            title="Eliminar producto"
          >
            <FaTrash />
          </button>
        )}

        {/* Aprobaciones y rechazos por perfil */}
        {[
          { rol: RolesEnum.SUPERVISION, label: "Supervisión" },
          { rol: RolesEnum.ADMIN, label: "ADMIN" },
        ].map(
          ({ rol, label }) =>
            userRole === rol && (
              <Box key={rol} sx={{ display: "flex", gap: 1 }}>
                <button
                  className="table-button table-button--success table-button--icon-only"
                  onClick={() =>
                    handleApproveByAudit([params.row.id], "approve", "approve")
                  }
                  title={`Aprobar - ${label}`}
                >
                  <FaThumbsUp />
                </button>
                <button
                  className="table-button table-button--danger table-button--icon-only"
                  onClick={() =>
                    handleApproveByAudit([params.row.id], "deny", "deny")
                  }
                  title={`Rechazar - ${label}`}
                >
                  <FaThumbsDown />
                </button>
              </Box>
            )
        )}
      </Box>
    ),
    sortable: false,
    filterable: false,
  },
];
