import { Box, MenuItem, Select, TextField } from "@mui/material";
import { FaFile, FaRegEdit, FaTrash } from "react-icons/fa";
import { formatPrice } from "./ValidateProductColumns";

export const getConvocationColumns = (handleModalSuppliers) => [
  { field: "id", headerName: "ID", width: 70 },
  { field: "date", headerName: "FECHA", width: 150 },
  { field: "name", headerName: "NOMBRE CONVOCATORIA", width: "auto" },
  {
    field: "plans",
    headerName: "PLANES PRODUCTIVOS",
    width: "auto",
    sortable: false,
    renderCell: ({ row }) =>
      row.plans?.length ? row.plans.map((p) => p.name).join(", ") : "—",
  },
  { field: "status", headerName: "ESTADO", width: 180 },
  { field: "n_suppliers", headerName: "N° PROVEEDORES", width: 150 },
  {
    field: "suppliersList",
    headerName: "PROVEEDORES",
    width: 150,
    renderCell: (params) => (
      <Box className="table-actions">
        <button
          className="table-button table-button--warning table-button--icon-only"
          onClick={() => handleModalSuppliers(params.row)}
          title="Mostrar usuarios que ya han llenado información"
        >
          <FaFile />
        </button>
      </Box>
    ),
    sortable: false,
    filterable: false,
  },
];

//
export const getNewCatalogBaseColumns = (
  unitOptions,
  categoryOptions,
  handleRowUpdate,
  editable = true
) => [
  { field: "id", headerName: "ID", width: 70 },
  {
    field: "category",
    headerName: "Categoría",
    width: "auto",
    renderCell: (params) => {
      const handleChange = (e) => {
        const newValue = e.target.value;
        const newRow = { ...params.row, category: newValue };
        params.api.updateRows([newRow]);
        handleRowUpdate(newRow, params.row);
      };

      return (
        <Select
          value={params.row.category || ""}
          onChange={handleChange}
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
          {categoryOptions.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.nombre}
            </MenuItem>
          ))}
        </Select>
      );
    },
  },
  { field: "name", headerName: "Nombre", width: 300, editable },
  {
    field: "unit",
    headerName: "Unidad",
    width: 200,
    editable: editable,
    renderCell: (params) => {
      const handleChange = (e) => {
        const newValue = e.target.value;
        const newRow = { ...params.row, unit: newValue };
        params.api.updateRows([newRow]);
        handleRowUpdate(newRow, params.row);
      };

      return (
        <Select
          value={params.row.unit || ""}
          onChange={handleChange}
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
          {unitOptions.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.nombre}
            </MenuItem>
          ))}
        </Select>
      );
    },
  },
  {
    field: "price_min",
    headerName: "Precio Min",
    width: 200,
    editable: editable,
    renderCell: (params) => (
      <TextField
        type="text"
        value={params.value ? formatPrice(params.value) : ""}
        size="small"
        variant="outlined"
        fullWidth
        onChange={(e) => {
          const raw = e.target.value.replace(/[^\d]/g, "");
          const value = raw ? Number(raw) : 0;
          const newRow = { ...params.row, price_min: value };
          params.api.updateRows([newRow]);
          handleRowUpdate(newRow, params.row);
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            fontSize: "0.95rem",
          },
        }}
      />
    ),
  },
  {
    field: "price_max",
    headerName: "Precio Max",
    width: 200,
    editable: editable,
    renderCell: (params) => (
      <TextField
        type="text"
        value={params.value ? formatPrice(params.value) : ""}
        size="small"
        variant="outlined"
        fullWidth
        onChange={(e) => {
          const raw = e.target.value.replace(/[^\d]/g, "");
          const value = raw ? Number(raw) : 0;
          const newRow = { ...params.row, price_max: value };
          params.api.updateRows([newRow]);
          handleRowUpdate(newRow, params.row);
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            fontSize: "0.95rem",
          },
        }}
      />
    ),
  },
];

//
export const getEditActionsColumns = (handleEditClick) => [
  {
    field: "actions",
    headerName: "Acciones",
    width: 150,
    renderCell: (params) => (
      <Box className="table-actions">
        <button
          className="table-button table-button--info table-button--icon-only"
          onClick={() => handleEditClick(params.row.id)}
          title="Edita productos"
        >
          <FaRegEdit />
        </button>
      </Box>
    ),
    sortable: false,
    filterable: false,
  },
];

//
export const getDeleteActionsColumns = (handleDeleteClick) => [
  {
    field: "actions",
    headerName: "Acciones",
    width: 150,
    renderCell: (params) => (
      <Box className="table-actions">
        <button
          className="table-button table-button--danger table-button--icon-only"
          onClick={() => handleDeleteClick(params.row.id)}
          title="Eliminar producto"
        >
          <FaTrash />
        </button>
      </Box>
    ),
    sortable: false,
    filterable: false,
  },
];

//

export const getProductsPriceQuotesColumns = () => [
  { field: "id", headerName: "ID", width: 70 },
  { field: "category", headerName: "CATEGORIA", width: 200 },
  { field: "name", headerName: "NOMBRE PRODUCTO", width: 200 },
  { field: "unit", headerName: "UNIDAD", width: 150 },
  {
    field: "description",
    headerName: "DESCRIPCION",
    width: 300,
    editable: true,
  },
  { field: "brand", headerName: "MARCA", width: 170, editable: true },
  {
    field: "price",
    headerName: "VALOR",
    width: 250,
    editable: true,
    renderCell: (params) => {
      const current = Number(params.row.price ?? 0);
      return (
        <TextField
          type="text"
          value={current ? formatPrice(current) : ""}
          fullWidth
          size="small"
          variant="outlined"
          onChange={(e) => {
            // solo dígitos
            const raw = e.target.value.replace(/[^\d]/g, "");
            const value = raw ? Number(raw) : 0;

            const newRow = { ...params.row, price: value };
            // esto re-renderiza la celda; el commit real se hace al salir de la fila
            params.api.updateRows([newRow]);
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              fontSize: "0.95rem",
            },
          }}
        />
      );
    },
  },
];
