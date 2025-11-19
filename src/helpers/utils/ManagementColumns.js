import { Box } from "@mui/material";
import { FaCheck, FaRegEdit, FaTimes, FaTrash } from "react-icons/fa";

export const getSystemUsersColumns = () => [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "NOMBRE", width: 200 },
  { field: "last_name", headerName: "APELLIDO", width: 200 },
  { field: "identification_number", headerName: "CC Ó NIT", width: 200 },
  { field: "email", headerName: "EMAIL", width: "auto" },
  { field: "rol", headerName: "ROL", width: "auto" },
];

export const getSuppliersColumns = () => [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "NOMBRE REPRESNETATE LEGAL", width: "auto" },
  { field: "company_name", headerName: "RAZÓN SOCIAL", width: "auto" },
  { field: "nit", headerName: "NIT", width: 200 },
  { field: "email", headerName: "EMAIL", width: 200 },
  { field: "dept", headerName: "DEPARTAMENTO", width: 200 },
  { field: "muni", headerName: "MUNICIPIO", width: 200 },
  { field: "description", headerName: "DESCRIPCIÓN DEL ESTADO", width: 150 },
  { field: "resolution", headerName: "RESOLUCIÓN", width: 200 },
];

export const getBeneficiaryColumn = () => [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "NOMBRE", width: 200 },
  { field: "last_name", headerName: "APELLIDO", width: 200 },
  { field: "cub", headerName: "CUB", width: 200 },
  { field: "identification_number", headerName: "CEDULA", width: "auto" },
  { field: "email", headerName: "EMAIL", width: 200 },
  { field: "cellphone", headerName: "TELEFONO", width: 200 },
  { field: "dept", headerName: "DEPARTAMENTO", width: 200 },
  { field: "muni", headerName: "MUNICIPIO", width: "auto" },
  { field: "status", headerName: "ESTADO", width: 200 },
  { field: "resolution", headerName: "RESOLUCIÓN", width: 200 },
];

export const getConvocationColumn = () => [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "NOMBRE", width: "auto" },
  { field: "start_date", headerName: "FECHA INICIAL", width: 200 },
  { field: "end_date", headerName: "FECHA FINAL", width: 200 },
  { field: "remaining_days", headerName: "DIAS RESTANTES", width: 200 },
  { field: "description", headerName: "DESCRIPCIÓN", width: "auto" },
];

export const getAccionColumns = (
  handleActiveAndInactive,
  handleEditClick,
  handleDeleteClick
) => [
  {
    field: "status",
    headerName: "ESTADO",
    width: 150,
    renderCell: (params) => {
      const isActive = Boolean(params.value);
      return (
        <Box className="table-actions">
          <button
            className={`table-button table-button--icon-only ${
              isActive ? "table-button--success" : "table-button--danger"
            }`}
            onClick={() => handleActiveAndInactive(params.row)}
            title={isActive ? "Inactivar" : "Activar"}
          >
            {isActive ? <FaCheck /> : <FaTimes />}
          </button>
        </Box>
      );
    },
    sortable: false,
    filterable: false,
  },
  {
    field: "actions",
    headerName: "Acciones",
    width: 150,
    renderCell: (params) => (
      <Box className="table-actions">
        <button
          className="table-button table-button--warning table-button--icon-only"
          onClick={() => handleEditClick(params.row.id)}
          title="Editar usuario"
        >
          <FaRegEdit />
        </button>
        <button
          className="table-button table-button--danger table-button--icon-only"
          onClick={() => handleDeleteClick(params.row.id)}
          title="Eliminar usuario"
        >
          <FaTrash />
        </button>
      </Box>
    ),
    sortable: false,
    filterable: false,
  },
];
