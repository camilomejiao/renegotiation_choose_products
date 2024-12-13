import { useEffect, useState } from "react";
import { MenuItem, Select, TextField } from "@mui/material";
import { Button } from "react-bootstrap";
import { FaBackspace, FaPlus } from "react-icons/fa";
import { DataGrid } from "@mui/x-data-grid";

//Img
import imgPeople from "../../../../assets/image/addProducts/people1.jpg";

//Modules
import { HeaderImage } from "../../shared/header-image/HeaderImage";
import AlertComponent from "../../shared/alert/AlertComponent";

//Services
import { supplierServices } from "../../../../helpers/services/SupplierServices";
import { productServices } from "../../../../helpers/services/ProductServices";

//Enums
import { ProductStatusEnum, ResponseStatusEnum } from "../../../../helpers/GlobalEnum";

const PAGE_SIZE = 50;

export const EditProduct = () => {

    const [productList, setProductList] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const [isLoading, setIsLoading] = useState(false);
    const [unitOptions, setUnitOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [dynamicMunicipalityColumns, setDynamicMunicipalityColumns] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const getProductList = async () => {
        setIsLoading(true);
        try {
            const { data, status } = await productServices.getProductList();
            if (status === ResponseStatusEnum.OK) {
                console.log(data.results);
                const products = normalizeRows(data.results);
                setProductList(products);
                setFilteredData(products);
            }
        } catch (error) {
            console.error("Error al obtener la lista de productos:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const normalizeRows = (data) => {
        return data.map((row) => ({
            id: row.id,
            name: row.nombre,
            description: row.especificacion_tecnicas,
            brand: row.marca_comercial,
            state: row?.fecha_aprobado !== null ? ProductStatusEnum.APPROVED : ProductStatusEnum.PENDING_APPROVAL,
            reference: row.especificacion_tecnicas,
            unit: row.unidad,
            category: row?.categoria
        }));
    };

    //
    const getDynamicColumnsBySupplier = async () => {
        try {
            const { data, status } = await supplierServices.getInfoSupplier();
            if (status === ResponseStatusEnum.OK) {

                const newDynamicColumns = Object.entries(data.municipios).map(([key, value]) => {
                    const [code, name] = value.split(" : ").map(str => str.trim());
                    return {
                        field: `price_${key}`,
                        headerName: `Precio - ${name}`,
                        width: 150,
                        editable: true,
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

                setDynamicMunicipalityColumns(newDynamicColumns);
                return newDynamicColumns; // Devuelve las columnas dinámicas
            }
        } catch (error) {
            console.log(error);
            handleError(error, "Error buscando productos:");
            return [];
        }
    };

    const formatPrice = (value) => {
        if (!value) return "";
        return new Intl.NumberFormat('es-ES', {style: 'currency', currency: 'COP'}).format(value);
    };

    //
    const getUnitOptions = async () => {
        try {
            const {data, status} = await productServices.getUnitList();
            if(status === ResponseStatusEnum.OK) setUnitOptions(data);
            return data;
        } catch (error) {
            console.log(error)
            handleError(error, 'Error buscando productos:');
        }
    }

    //
    const getCategoryOptions = async () => {
        try {
            const {data, status} = await productServices.getCategoryList();
            if(status === ResponseStatusEnum.OK) setCategoryOptions(data);
            return data;
        } catch (error) {
            handleError(error, 'Error buscando productos:');
        }
    }

    const baseColumns = [
        {field: "id", headerName: "ID", width: 90},
        {field: "name", headerName: "Nombre", width: 150, editable: true},
        {field: "description", headerName: "Descripción", width: 200, editable: true},
        {field: "brand", headerName: "Marca", width: 200, editable: true},
        {field: "reference", headerName: "Referencia", width: 200, editable: true},
        {
            field: "unit",
            headerName: "Unidad",
            width: 150,
            editable: true,
            renderCell: (params) => (
                <Select
                    value={params.value || ""}
                    onChange={(e) =>
                        params.api.updateRows([{id: params.row.id, unit: e.target.value}])
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
        {
            field: "category",
            headerName: "Categoría",
            width: 150,
            editable: true,
            renderCell: (params) => (
                <Select
                    value={params.value || ""}
                    onChange={(e) =>
                        params.api.updateRows([{id: params.row.id, category: e.target.value}])
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
    ];

    const columns = [...baseColumns, ...dynamicMunicipalityColumns];

    //Maneja el error en caso de fallo de la llamada
    const handleError = (error, title, ) => {
        AlertComponent.error(error, title);
    };

    const handleSearchQueryChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        const filtered = productList.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase()) ||
            product.brand.toLowerCase().includes(query.toLowerCase()) ||
            product.state.toLowerCase().includes(query.toLowerCase())
        );

        setFilteredData(filtered);
    };

    useEffect(() => {
        getProductList();
        getDynamicColumnsBySupplier();
        getUnitOptions();
        getCategoryOptions();
    }, []);

    return (
        <>
            <HeaderImage imageHeader={imgPeople} titleHeader="¡Editar productos!" />

            <div className="container mt-4">
                <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchQuery}
                    onChange={handleSearchQueryChange}
                    className="input-responsive"
                />

                <Button onClick={''} className="button-order-responsive">
                    Agregar productos <FaPlus />
                </Button>

                <Button variant="secondary" onClick={''} className="button-order-responsive">
                    Atras <FaBackspace />
                </Button>

                <DataGrid
                    columns={columns}
                    rows={filteredData}
                    pagination
                    page={page}
                    pageSize={pageSize}
                    onPageChange={(newPage) => setPage(newPage)}
                    onPageSizeChange={(newPageSize) => {
                        setPageSize(newPageSize);
                        setPage(0);
                    }}
                    rowsPerPageOptions={[10, 50, 100]}
                    rowCount={filteredData.length}
                    componentsProps={{
                        columnHeader: {
                            style: {
                                textAlign: "left",
                                fontWeight: "bold",
                                fontSize: "10px",
                                wordWrap: "break-word",
                            },
                        },
                    }}
                    sx={{
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: "#40A581",
                            color: "white",
                            fontSize: "14px",
                        },
                        "& .MuiDataGrid-columnHeader": {
                            textAlign: "center",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        },
                        "& .MuiDataGrid-container--top [role=row], .MuiDataGrid-container--bottom [role=row]": {
                            backgroundColor: "#40A581 !important",
                            color: "white !important",
                        },
                        "& .MuiDataGrid-cell": {
                            fontSize: "14px",
                            textAlign: "center",
                            justifyContent: "center",
                            display: "flex",
                        },
                        "& .MuiDataGrid-row:hover": {
                            backgroundColor: "#E8F5E9",
                        },
                    }}
                />
            </div>
        </>
    )
}