import { MenuItem, Select, TextField } from "@mui/material";
import { FaFile, FaRegEdit, FaTrash } from "react-icons/fa";
import { formatPrice } from "./ValidateProductColumns";
import { Button } from "react-bootstrap";

export const getConvocationColumns = (handleModalSuppliers, handleReport) => ([
    { field: "id", headerName: "ID", width: 70 },
    { field: "date", headerName: "FECHA", width: 150 },
    { field: "name", headerName: "NOMBRE CONVOCATORIA", width: 250 },
    {
        field: "plans",
        headerName: "PLANES PRODUCTIVOS",
        width:310,
        sortable: false,
        renderCell: ({ row }) =>
            row.plans?.length ? row.plans.map(p => p.name).join(", ") : "—",
    },
    { field: "status", headerName: "ESTADO", width: 180 },
    { field: "n_suppliers", headerName: "N° PROVEEDORES", width: 150 },
    {
        field: 'suppliersList',
        headerName: 'PROVEEDORES',
        width: 150,
        renderCell: (params) => (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Button
                    variant="outline-warning"
                    onClick={() => handleModalSuppliers(params.row)}
                    title="Mostrar usuarios que ya han llenado información"
                >
                    <FaFile />
                </Button>
            </div>
        ),
        sortable: false,
        filterable: false,
    },
]);

//
export const getNewCatalogBaseColumns = (unitOptions, categoryOptions, handleRowUpdate, editable = true) => ([
    { field: "id", headerName: "ID", width: 70 },
    {
        field: "category",
        headerName: "Categoría",
        width: 200,
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
                value={formatPrice(params.value)} // Formatea el valor antes de mostrarlo
                onChange={(e) => {
                    const value = parseFloat(e.target.value.replace(/[^\d]/g, ""));
                    if (!isNaN(value)) {
                        params.api.updateRows([{ id: params.row.id}]);
                    }
                }}
                fullWidth
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
                value={formatPrice(params.value)} // Formatea el valor antes de mostrarlo
                onChange={(e) => {
                    const value = parseFloat(e.target.value.replace(/[^\d]/g, ""));
                    if (!isNaN(value)) {
                        params.api.updateRows([{ id: params.row.id}]);
                    }
                }}
                fullWidth
            />
        ),
    },
]);

//
export const getEditActionsColumns = (handleEditClick) => ([
    {
        field: 'actions',
        headerName: 'Acciones',
        width: 150,
        renderCell: (params) => (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Button
                    variant="outline-info"
                    onClick={() => handleEditClick(params.row.id)}
                    title="Edita productos"
                >
                    <FaRegEdit />
                </Button>
            </div>
        ),
        sortable: false,
        filterable: false,
    },
]);

//
export const getDeleteActionsColumns = (handleDeleteClick) => ([
    {
        field: 'actions',
        headerName: 'Acciones',
        width: 150,
        renderCell: (params) => (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FaTrash
                    style={{ color: 'red', cursor: 'pointer' }}
                    onClick={() => handleDeleteClick(params.row.id)}
                />
            </div>
        ),
        sortable: false,
        filterable: false,
    },
]);
