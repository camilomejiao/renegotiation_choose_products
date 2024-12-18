import { useEffect, useState } from "react";
import { MenuItem, Select, TextField } from "@mui/material";
import { Button } from "react-bootstrap";
import { FaBackspace, FaPlus, FaSave } from "react-icons/fa";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

//Img
import imgPeople from "../../../../assets/image/addProducts/people1.jpg";

//Modules
import { HeaderImage } from "../../shared/header-image/HeaderImage";
import { Footer } from "../../shared/footer/Footer";
import AlertComponent from "../../shared/alert/AlertComponent";

//Services
import { authService } from "../../../../helpers/services/Auth";
import { supplierServices } from "../../../../helpers/services/SupplierServices";
import { productServices } from "../../../../helpers/services/ProductServices";

//Enums
import {ResponseStatusEnum as StatusEnum, ResponseStatusEnum} from "../../../../helpers/GlobalEnum";

const PAGE_SIZE = 50;

export const EditProduct = () => {

    const navigate = useNavigate();

    const [productList, setProductList] = useState([]);
    const [editedProducts, setEditedProducts] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const [unitOptions, setUnitOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [dynamicMunicipalityColumns, setDynamicMunicipalityColumns] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);

    const getProductList = async () => {
        try {
            const { data, status } = await productServices.getProductList();
            if (status === ResponseStatusEnum.OK) {
                const products = await normalizeRows(data);
                setProductList(products);
                setFilteredData(products);
            }
        } catch (error) {
            console.error("Error al obtener la lista de productos:", error);
        }
    };

    const normalizeRows = async (data) => {
        try {
            // Obtener la información de los municipios
            const { municipalities } = await getDynamicColumnsBySupplier();

            // Normalizar cada fila de productos
            const normalizedRows = data.map((row) => {
                // Extraer los precios de los municipios
                const municipalityPrices = Object.fromEntries(
                    Object.entries(municipalities).map(([key]) => {
                        const priceData = row.valor_municipio.find(v => v.ubicacion_proveedor === parseInt(key));
                        const price = priceData !== undefined ? priceData.valor_unitario : '0.00';
                        return [`price_${key}`, price];
                    })
                );

                // Devolver el objeto del producto con todos los campos necesarios
                return {
                    id: row.id,
                    name: row.nombre,
                    description: row.especificacion_tecnicas,
                    brand: row.marca_comercial,
                    reference: row.referencia,
                    unit: row.unidad_medida,
                    category: row.categoria_producto,
                    ...municipalityPrices // Esparcir los precios de los municipios
                };
            });

            return normalizedRows;
        } catch (error) {
            console.error('Error al normalizar filas:', error);
            return []; // Devolver array vacío en caso de error
        }
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
                return { municipalities: data.municipios, newDynamicColumns }; // Devuelve las columnas dinámicas
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
        {field: "id", headerName: "COD", flex: 0.5},
        {
            field: "category",
            headerName: "Categoría",
            width: 150,
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
        {
            field: "reference",
            headerName: "Referencia",
            width: 200,
            headerAlign: "left",
            editable: true,
            renderCell: (params) => (
                <div
                    style={{
                        textAlign: "left",
                        whiteSpace: "normal",
                        overflow: "visible",
                    }}
                >
                    {params.value}
                </div>
            ),
        },
        {
            field: "name",
            headerName: "NOMBRE",
            width: 170,
            headerAlign: "left",
            editable: true,
            renderCell: (params) => (
                <div
                    style={{
                        textAlign: "left",
                        whiteSpace: "normal",
                        overflow: "visible",
                    }}
                >
                    {params.value}
                </div>
            ),
        },
        {
            field: "description",
            headerName: "DESCRIPCIÓN",
            width: 250,
            headerAlign: "left",
            editable: true,
            renderCell: (params) => (
                <div
                    style={{
                        textAlign: "left",
                        whiteSpace: "normal",
                        overflow: "visible",
                    }}
                >
                    {params.value}
                </div>
            ),
        },
        { field: "brand", headerName: "MARCA", width: 100, editable: true },
        {
            field: "unit",
            headerName: "Unidad",
            width: 150,
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
            product.brand.toLowerCase().includes(query.toLowerCase())
        );

        setFilteredData(filtered);
    };

    const handleCreateProducts = () => navigate('/admin/create-products');

    const handleBack = () => navigate('/admin/products');

    const handleRowUpdate = (newRow, oldRow) => {
        if (JSON.stringify(newRow) !== JSON.stringify(oldRow)) {
            setEditedProducts(prevState => {
                const index = prevState.findIndex(product => product.id === newRow.id);
                if (index > -1) {
                    prevState[index] = newRow;
                } else {
                    prevState.push(newRow);
                }
                return [...prevState];
            });
        }
        return newRow;
    };

    const handleSaveProducts = async () => {
        try {
            setLoading(true);
            if (editedProducts.length === 0) {
                AlertComponent.warning('', 'No hay productos modificados para guardar.');
                return;
            }

            const products = await productsBeforeSend(editedProducts);
            const batches = chunkArray(products, 500);

            await sendBatchesInParallel(batches);

            AlertComponent.success('', 'Productos actualizados con éxito.');
            setEditedProducts([]);
        } catch (error) {
            AlertComponent.error('Error', 'Error al guardar los productos.');
        } finally {
            setLoading(false);
        }
    };

    //Dividir un array en lotes
    const chunkArray = (array, chunkSize) => {
        const chunks = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
    };

    //Enviar lotes en paralelo con control de concurrencia
    const sendBatchesInParallel = async (batches, maxConcurrent = 5) => {
        const errors = []; // Para almacenar los errores
        for (let i = 0; i < batches.length; i += maxConcurrent) {
            const batchChunk = batches.slice(i, i + maxConcurrent);

            const results = await Promise.allSettled(
                batchChunk.map(batch => sendBatchToService(batch))
            );

            // Filtrar los errores
            results.forEach((result, index) => {
                if (result.status === 'rejected') {
                    errors.push(result.reason); // Guardar el error
                    console.error(`Error al enviar el lote ${i + index + 1}:`, result.reason.message);
                    handleError('Error', `Error al enviar el lote ${i + index + 1}: ${result.reason.message}`)
                }
            });
        }

        if (errors.length > 0) {
            throw new Error('Uno o más lotes no se pudieron enviar correctamente.');
        }
    };

    const sendBatchToService = async (batch) => {
        const { data, status } = await productServices.edit(batch);
        if (status !== StatusEnum.OK) {
            throw new Error(`Error en el estado de la respuesta. Status: ${status}`);
        }
        return data;
    };

    //Obtener el ID del proveedor
    const getSupplierId = () => {
        return authService.getSupplierId();
    };

    const productsBeforeSend = (inputData) => {
        const supplierId = parseInt(getSupplierId());
        return inputData.map((product) => ({
            id: product.id,
            proveedor_id: supplierId,
            nombre: product.name,
            especificacion_tecnicas: product.description,
            marca_comercial: product.brand,
            referencia: product.reference,
            unidad_medida: product.unit,
            categoria_producto: product.category,
            valor_municipio: extractMunicipios(product)
        }));
    };

    //Extraer los precios de municipios dinámicos
    const extractMunicipios = (product) => {
        return Object.keys(product)
            .filter(key => key.startsWith("price_"))
            .reduce((acc, key) => {
                const municipioId = key.split("_")[1];
                acc[municipioId] = product[key];
                return acc;
            }, {});
    };

    useEffect(() => {
        getProductList();
        getDynamicColumnsBySupplier();
        getUnitOptions();
        getCategoryOptions();
    }, []);

    return (
        <>
            <div className="main-container">
                <HeaderImage
                    imageHeader={imgPeople}
                    titleHeader="¡Editar productos!"
                />

                <div className="container mt-lg-3">
                    <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center mt-3 mb-3">
                        <div className="d-flex flex-column flex-md-row w-100 w-md-auto">
                            <input
                                type="text"
                                placeholder="Buscar..."
                                value={searchQuery}
                                onChange={handleSearchQueryChange}
                                className="input-responsive"
                            />

                            <Button onClick={handleCreateProducts} className="button-order-responsive">
                                Agregar productos <FaPlus />
                            </Button>

                            <Button
                                variant="secondary"
                                size="md"
                                onClick={handleBack}
                                className="button-order-responsive">
                                Atras <FaBackspace />
                            </Button>
                        </div>
                    </div>

                    {loading && (
                        <div className="overlay">
                            <div className="loader">Guardando Productos...</div>
                        </div>
                    )}

                    <div style={{height: 600, width: "100%"}}>
                        <DataGrid
                            columns={columns}
                            rows={filteredData}
                            processRowUpdate={handleRowUpdate}
                            editMode="row"
                            pagination
                            page={page}
                            pageSize={pageSize}
                            onPageChange={(newPage) => setPage(newPage)}
                            onPageSizeChange={(newPageSize) => {
                                setPageSize(newPageSize);
                                setPage(0);
                            }}
                            rowsPerPageOptions={[10, 50, 100]}
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

                    {/* Botón Guardar */}
                    <div className="d-flex align-items-end mt-3">
                        <Button
                            variant="success"
                            size="md"
                            onClick={handleSaveProducts}
                            className="ms-auto"
                            disabled={loading}
                        >
                            {loading ? "Guardando..." : "Guardar Productos"} <FaSave/>
                        </Button>
                    </div>

                </div>
            <Footer/>
            </div>
        </>
    )
}