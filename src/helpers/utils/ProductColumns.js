import { MenuItem, Select, TextField } from "@mui/material";
import { FaThumbsDown, FaThumbsUp, FaTrash } from "react-icons/fa";
import { Button } from "react-bootstrap";

// Services
import { supplierServices } from "../services/SupplierServices";
import { productServices } from "../services/ProductServices";

//Enum
import { ResponseStatusEnum, RolesEnum } from "../GlobalEnum";

//
export const getBaseColumns = (unitOptions, categoryOptions, editable = true) => ([
    { field: "id", headerName: "ID", width: 80 },
    {
        field: "category",
        headerName: "Categoría",
        width: 300,
        editable: editable,
        renderCell: (params) => (
            <Select
                value={params.value || ""}
                onChange={(e) =>
                    params.api.updateRows([{ id: params.row.id, category: e.target.value }])
                }
                fullWidth
            >
                {categoryOptions.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                        {option.nombre}
                    </MenuItem>
                ))}
            </Select>
        ),
    },
    { field: "reference", headerName: "Referencia", width: 150, editable: editable },
    { field: "name", headerName: "Nombre", width: 500, editable: editable },
    { field: "description", headerName: "Descripción", width: 500, editable: editable },
    { field: "brand", headerName: "Marca", width: 300, editable: editable },
    {
        field: "unit",
        headerName: "Unidad",
        width: 300,
        editable: editable,
        renderCell: (params) => (
            <Select
                value={params.value || ""}
                onChange={(e) =>
                    params.api.updateRows([{ id: params.row.id, unit: e.target.value }])
                }
                fullWidth
            >
                {unitOptions.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                        {option.nombre}
                    </MenuItem>
                ))}
            </Select>
        ),
    },
]);

// Obtener columnas dinámicas de los municipios
export const getDynamicColumnsBySupplier = async (supplierId, editable = true) => {
    try {
        const { data, status } = await supplierServices.getInfoSupplier(supplierId);
        if (status === ResponseStatusEnum.OK && data?.municipios) {
            const newDynamicColumns = data.municipios.map((municipio) => {
                return {
                    field: `price_${municipio.id}`,
                    headerName: `Precio - ${municipio.ubicacion}`,
                    width: 150,
                    editable: editable,
                    renderCell: (params) => (
                        <TextField
                            type="text"
                            value={formatPrice(params.value)} // Formatea el valor antes de mostrarlo
                            onChange={(e) => {
                                const value = parseFloat(e.target.value.replace(/[^\d]/g, ""));
                                if (!isNaN(value)) {
                                    params.api.updateRows([{ id: params.row.id, [`price_${municipio.id}`]: value }]);
                                }
                            }}
                            fullWidth
                        />
                    ),
                };
            });
            return { municipalities: data.municipios, newDynamicColumns };
        } else {
            throw new Error("No se encontraron municipios.");
        }
    } catch (error) {
        console.error("Error en getDynamicColumnsBySupplier:", error);
        throw error;
    }
};

export const formatPrice = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'COP' }).format(value);
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
//
export const getStatusProduct = () => [
    { field: "state", headerName: "ESTADO", width: 150, },
];

//Categorías de restricciones ambientales
export const getEnvironmentalCategoriesColumns = async (handleSelectChange) => {
    const categories = await getEnvironmentalCategories();

    return categories.map((category) => ({
        field: category.codigo,
        headerName: `${category.codigo}: ${category.descripcion}`,
        width: 200,
        editable: false,
        renderCell: (params) => (
            <Select
                value={String(params.value ?? "")}
                onChange={(e) => {
                    const newValue = e.target.value;
                    handleSelectChange(category.codigo)(params, newValue); // Asegúrate de pasar el valor correctamente.
                }}
                fullWidth
            >
                <MenuItem value="1">Sí</MenuItem>
                <MenuItem value="0">No</MenuItem>
            </Select>
        ),
        sortable: false,
        filterable: false,
    }));
};

//
export const getObservationsColumns = (userRole) => [
    {
        field: "observations_territorial",
        headerName: "Observación Territorial",
        width: 200,
        editable: false,
        renderCell: (params) => (
            <span style={{ color: params.value ? "black" : "gray" }}>
                {params.value || "Observación territorial..."}
            </span>
        ),
    },
    {
        field: "status_territorial",
        headerName: "Estado Territorial",
        width: 100,
        editable: false,
        renderCell: (params) => (
            <span style={{ color: params.value ? "black" : "gray" }}>
                {params.value}
            </span>
        ),
    },
    {
        field: "observations_technical",
        headerName: "Observación técnica",
        width: 200,
        editable: false,
        renderCell: (params) => (
            <span style={{ color: params.value ? "black" : "gray" }}>
                {params.value || "Observación técnica..."}
            </span>
        ),
    },
    {
        field: "status_technical",
        headerName: "Estado técnica",
        width: 100,
        editable: false,
        renderCell: (params) => (
            <span style={{ color: params.value ? "black" : "gray" }}>
                {params.value}
            </span>
        ),
    },
    {
        field: "observations_environmental",
        headerName: "Observación Ambiental",
        width: 200,
        editable: false,
        renderCell: (params) => (
            <span style={{ color: params.value ? "black" : "gray" }}>
                {params.value || "Observación ambiental..."}
            </span>
        ),
    },
    {
        field: "status_environmental",
        headerName: "Estado Ambiental",
        width: 100,
        editable: false,
        renderCell: (params) => (
            <span style={{ color: params.value ? "black" : "gray" }}>
                {params.value}
            </span>
        ),
    },
];

export const getActionsColumns = (userRole, handleDeleteClick, handleApproveByAudit) => [
    {
        field: "actions",
        headerName: "ACCIONES",
        width: 150,
        renderCell: (params) => (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: "5px" }}>

                {/* Botón de eliminar SOLO para SUPPLIER */}
                {userRole === RolesEnum.SUPPLIER && (
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteClick(params.row.id)}
                        style={{ marginRight: "10px" }}
                    >
                        <FaTrash />
                    </Button>
                )}

                {/* Aprobaciones y rechazos por perfil */}
                {[
                    { rol: RolesEnum.TERRITORIAL, label: "Supervisión" },
                    { rol: RolesEnum.ADMIN, label: "ADMIN" },
                ].map(({ rol, label }) => (
                    userRole === rol && (
                        <div key={rol} style={{ display: "flex", gap: "5px" }}>
                            <Button
                                variant="success"
                                size="sm"
                                onClick={() => handleApproveByAudit([params.row.id], "approve", "approve")}
                                style={{ marginLeft: '5px' }}
                            >
                                <FaThumbsUp  />
                            </Button>
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleApproveByAudit([params.row.id], "deny", "deny")}
                                style={{ marginLeft: '5px' }}
                            >
                                <FaThumbsDown />
                            </Button>
                        </div>
                    )
                ))}
            </div>
        ),
        sortable: false,
        filterable: false,
    },
];




