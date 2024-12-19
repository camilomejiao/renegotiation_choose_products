import { MenuItem, Select, TextField } from "@mui/material";

// Services
import { supplierServices } from "../services/SupplierServices";
import { productServices } from "../services/ProductServices";

//Enum
import { ResponseStatusEnum } from "../GlobalEnum";

//
export const getBaseColumns = (unitOptions, categoryOptions, editable = true) => ([
    { field: "id", headerName: "ID", width: 80 },
    {
        field: "category",
        headerName: "Categoría",
        width: 150,
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
    { field: "reference", headerName: "Referencia", width: 200, editable: editable },
    { field: "name", headerName: "Nombre", width: 150, editable: editable },
    { field: "description", headerName: "Descripción", width: 200, editable: editable },
    { field: "brand", headerName: "Marca", width: 200, editable: editable },
    {
        field: "unit",
        headerName: "Unidad",
        width: 150,
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
export const getDynamicColumnsBySupplier = async (editable = true) => {
    try {
        const { data, status } = await supplierServices.getInfoSupplier();
        if (status === ResponseStatusEnum.OK && data?.municipios) {
            const newDynamicColumns = Object.entries(data.municipios).map(([key, value]) => {
                const [code, name] = value.split(" : ").map(str => str.trim());
                return {
                    field: `price_${key}`,
                    headerName: `Precio - ${name}`,
                    width: 150,
                    editable: editable,
                    renderCell: (params) => (
                        <TextField
                            type="text"
                            value={formatPrice(params.value)} // Formatea el valor antes de mostrarlo
                            onChange={(e) => {
                                const value = parseFloat(e.target.value.replace(/[^\d]/g, ""));
                                if (!isNaN(value)) {
                                    params.api.updateRows([{ id: params.row.id, [`price_${key}`]: value }]);
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
        console.error("❌ Error en getDynamicColumnsBySupplier:", error);
        throw error; // Lanza el error para ser capturado en los componentes
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
        console.error("❌ Error en getUnitOptions:", error);
        throw error; // Lanza el error para ser capturado en los componentes
    }
};

// Obtener opciones de categorías de productos
export const getCategoryOptions = async () => {
    try {
        const { data, status } = await productServices.getCategoryList();
        if (status === ResponseStatusEnum.OK) return data;
        return [];
    } catch (error) {
        console.error("❌ Error en getCategoryOptions:", error);
        throw error; // Lanza el error para ser capturado en los componentes
    }
};
