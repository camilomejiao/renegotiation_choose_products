import { MenuItem, Select, TextField } from "@mui/material";
import { FaThumbsDown, FaThumbsUp, FaTrash } from "react-icons/fa";
import { Button } from "react-bootstrap";

// Services
import { supplierServices } from "../services/SupplierServices";
import { productServices } from "../services/ProductServices";

//Enum
import { ResponseStatusEnum, RolesEnum, StatusTeamProductEnum } from "../GlobalEnum";

//
export const getBaseColumns = (unitOptions, categoryOptions, handleRowUpdate, editable = true) => ([
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
    { field: "description", headerName: "Descripción", width: 300, editable: editable },
    { field: "brand", headerName: "Marca", width: 150, editable: editable },
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

//
export const getStatusProduct = () => [
    { field: "state", headerName: "ESTADO", width: 150, },
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
export const getEnvironmentalCategoriesColumns = async (handleSelectChange, handleCustomChange) => {
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
            return(
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '5px' }}>
                    <TextField
                        type="number"
                        value={params.row.customValue || ""}
                        onChange={(e) => handleCustomChange(params, "customValue", e.target.value)}
                        size="small"
                        style={{ width: "35%" }}
                    />
                    <Select
                        value={params.row.selectedCategory || ""}
                        onChange={(e) => handleCustomChange(params, "selectedCategory", e.target.value)}
                        size="small"
                        style={{ width: "65%" }}
                    >
                        {categories.map((cat) => (
                            <MenuItem key={cat.codigo} value={cat.codigo}>
                                {cat.descripcion}
                            </MenuItem>
                        ))}
                    </Select>
                </div>
            );
        },
        sortable: false,
        filterable: false,
    };

    return [...environmentalColumns, customValueColumn];
};

//
export const getObservationsColumns = (userRole) => {
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
                    <span> (Aprobado por: {funcionario} - {fecha})</span>
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
            width: 200,
            editable: false,
            renderCell: (params) => renderObservationCell(params, "Observación supervision..."),
        },
        {
            field: "status_supervision",
            headerName: "Estado supervision",
            width: 120,
            editable: false,
            renderCell: renderStatusCell,
        },
        {
            field: "observations_environmental",
            headerName: "Observación Ambiental",
            width: 200,
            editable: false,
            renderCell: (params) => renderObservationCell(params, "Observación ambiental..."),
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
                    { rol: RolesEnum.SUPERVISION, label: "Supervisión" },
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




