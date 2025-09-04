import { MenuItem, Select, TextField } from "@mui/material";
import {FaFile, FaFileExcel, FaTrash} from "react-icons/fa";
import { formatPrice } from "./ProductColumns";
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
                    size="sm"
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
    {
        field: 'report',
        headerName: 'REPORTE',
        width: 150,
        renderCell: (params) => (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Button
                    variant="outline-success"
                    size="sm"
                    onClick={() => handleReport(params.row)}
                    title="Generar reporte (Excel)"
                >
                    <FaFileExcel />
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
        width: 150,
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
        width: 150,
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
export const getActionsColumns = (handleDeleteClick) => ([
    {
        field: 'actions',
        headerName: 'Acciones',
        flex: 0.7,
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

//

export const getProductsPriceQuotesColumns = () => ([
    { field: "id", headerName: "ID", width: 70 },
    { field: "plan", headerName: "PLAN", width: 150 },
    { field: "category", headerName: "CATEGORIA", width: 300 },
    { field: "name", headerName: "NOMBRE PRODUCTO", width: 300 },
    { field: "unit", headerName: "UNIDAD", width: 150 },
    { field: "description", headerName: "DESCRIPCION", width: 300, editable: true, },
    { field: "brand", headerName: "MARCA", width: 200, editable: true, },
    {
        field: "price",
        headerName: "VALOR",
        width: 200,
        editable: true,
        renderCell: (params) => {
            const min = Number(params.row.precio_min ?? 0);
            const max = Number(params.row.precio_max ?? Infinity);
            const current = Number(params.row.price ?? 0);
            const outOfRange = current !== 0 && (current < min || current > max);

            return (
                <TextField
                    type="text"
                    value={current ? formatPrice(current) : ""}
                    error={outOfRange}
                    helperText={
                        outOfRange
                            ? `Fuera de rango (${formatPrice(min)} - ${formatPrice(max)})`
                            : " "
                    }
                    onChange={(e) => {
                        // solo dígitos
                        const raw = e.target.value.replace(/[^\d]/g, "");
                        const value = raw ? Number(raw) : 0;

                        const newRow = { ...params.row, price: value };
                        // esto re-renderiza la celda; el commit real se hace al salir de la fila
                        params.api.updateRows([newRow]);
                    }}
                    fullWidth
                    // verde sutil si dentro de rango y hay valor
                    sx={
                        !outOfRange && current
                            ? { "& .MuiInputBase-input": { color: "green", fontWeight: 600 } }
                            : undefined
                    }
                />
            );
        },
    },
]);
