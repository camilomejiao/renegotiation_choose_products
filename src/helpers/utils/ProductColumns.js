import { MenuItem, Select, TextField } from "@mui/material";

// Services
import { supplierServices } from "../services/SupplierServices";
import { productServices } from "../services/ProductServices";

//Enum
import {ResponseStatusEnum, RolesEnum} from "../GlobalEnum";

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

//Categorías de restricciones ambientales
export const getCategoriesColumns = (handleSelectChange, userRole) => {

    const canEdit = userRole === RolesEnum.ADMIN || userRole === RolesEnum.AUDITOR;

    if (canEdit) {
        return [
            {
                field: "PNN",
                headerName: "PNN: Parque Nacional Natural",
                width: 200,
                editable: false,
                renderCell: (params) => {
                    return (
                        <Select
                            value={params.value}
                            onChange={handleSelectChange("PNN")(params)}
                            fullWidth
                        >
                            <MenuItem value="1">Si</MenuItem>
                            <MenuItem value="0">No</MenuItem>
                        </Select>
                    );
                },
                sortable: false,
                filterable: false,
            },
            {
                field: "ZRFA",
                headerName: "ZRF tipo A",
                width: 200,
                editable: false,
                renderCell: (params) => {
                    return (
                        <Select
                            value={params.value}
                            onChange={handleSelectChange("ZRFA")(params)}
                            style={{width: "100px"}}
                        >
                            <MenuItem value="1">Si</MenuItem>
                            <MenuItem value="0">No</MenuItem>
                        </Select>
                    );
                },
                sortable: false,
                filterable: false,
            },
            {
                field: "ZRFB",
                headerName: "ZRF tipo B",
                width: 200,
                editable: false,
                renderCell: (params) => {
                    return (
                        <Select
                            value={params.value}
                            onChange={handleSelectChange("ZRFB")(params)}
                            style={{width: "100px"}}
                        >
                            <MenuItem value="1">Si</MenuItem>
                            <MenuItem value="0">No</MenuItem>
                        </Select>
                    )
                },
                sortable: false,
                filterable: false,
            },
            {
                field: "ZRFC",
                headerName: "ZRF tipo C",
                width: 200,
                editable: false,
                renderCell: (params) => {
                    return (
                        <Select
                            value={params.value}
                            onChange={handleSelectChange("ZRFC")(params)}
                            style={{width: "100px"}}
                        >
                            <MenuItem value="1">Si</MenuItem>
                            <MenuItem value="0">No</MenuItem>
                        </Select>
                    )
                },
                sortable: false,
                filterable: false,
            },
            {
                field: "AMEMPre",
                headerName: "AMEM preservación",
                width: 200,
                editable: false,
                renderCell: (params) => {
                    return (
                        <Select
                            value={params.value}
                            onChange={handleSelectChange("AMEMPre")(params)}
                            style={{width: "100px"}}
                        >
                            <MenuItem value="1">Si</MenuItem>
                            <MenuItem value="0">No</MenuItem>
                        </Select>
                    )
                },
                sortable: false,
                filterable: false,
            },
            {
                field: "AMEMProd",
                headerName: "AMEM producción",
                width: 200,
                editable: false,
                renderCell: (params) => {
                    return (
                        <Select
                            value={params.value}
                            onChange={handleSelectChange("AMEMProd")(params)}
                            style={{width: "100px"}}
                        >
                            <MenuItem value="1">Si</MenuItem>
                            <MenuItem value="0">No</MenuItem>
                        </Select>
                    )
                },
                sortable: false,
                filterable: false,
            },
            {
                field: "DRMI",
                headerName: "DRMI",
                width: 200,
                editable: false,
                renderCell: (params) => {
                    return (
                        <Select
                            value={params.value}
                            onChange={handleSelectChange("DRMI")(params)}
                            style={{width: "100px"}}
                        >
                            <MenuItem value="1">Si</MenuItem>
                            <MenuItem value="0">No</MenuItem>
                        </Select>
                    )
                },
                sortable: false,
                filterable: false,
            },
            {
                field: "RFPN",
                headerName: "Reserva Forestal Protectora Nacional",
                width: 200,
                editable: false,
                renderCell: (params) => {
                    return (
                        <Select
                            value={params.value}
                            onChange={handleSelectChange("RFPN")(params)}
                            style={{width: "100px"}}
                        >
                            <MenuItem value="1">Si</MenuItem>
                            <MenuItem value="0">No</MenuItem>
                        </Select>
                    )
                },
                sortable: false,
                filterable: false,
            },
            {
                field: "ND",
                headerName: "ND: Núcleo de deforestación",
                width: 200,
                editable: false,
                renderCell: (params) => {
                    return (
                        <Select
                            value={params.value}
                            onChange={handleSelectChange("ND")(params)}
                            style={{width: "100px"}}
                        >
                            <MenuItem value="1">Si</MenuItem>
                            <MenuItem value="0">No</MenuItem>
                        </Select>
                    )
                },
                sortable: false,
                filterable: false,
            },
            {
                field: "RIL",
                headerName: "RIL: Resguardo Indígena Legalizado",
                width: 200,
                editable: false,
                renderCell: (params) => {
                    return (
                        <Select
                            value={params.value}
                            onChange={handleSelectChange("RIL")(params)}
                            style={{width: "100px"}}
                        >
                            <MenuItem value="1">Si</MenuItem>
                            <MenuItem value="0">No</MenuItem>
                        </Select>
                    )
                },
                sortable: false,
                filterable: false,
            },
            {
                field: "CCL",
                headerName: "CCL: Consejo Comunitario Legalizado",
                width: 200,
                editable: false,
                renderCell: (params) => {
                    return (
                        <Select
                            value={params.value}
                            onChange={handleSelectChange("CCL")(params)}
                            style={{width: "100px"}}
                        >
                            <MenuItem value="1">Si</MenuItem>
                            <MenuItem value="0">No</MenuItem>
                        </Select>
                    )
                },
                sortable: false,
                filterable: false,
            },
        ];
    }

    return [];

};
