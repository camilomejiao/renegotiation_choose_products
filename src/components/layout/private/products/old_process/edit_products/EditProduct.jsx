import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { FaBackspace, FaPlus, FaSave } from "react-icons/fa";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

//Img
import imgPeople from "../../../../../../assets/image/addProducts/people1.jpg";

//Components
import { HeaderImage } from "../../../../shared/header_image/HeaderImage";
import AlertComponent from "../../../../../../helpers/alert/AlertComponent";

//Services
import { productServices } from "../../../../../../helpers/services/ProductServices";
import { supplierServices } from "../../../../../../helpers/services/SupplierServices";

//Enums
import { ResponseStatusEnum } from "../../../../../../helpers/GlobalEnum";

//Utils
import {
    chunkArray,
    extractMunicipios,
    handleError,
    showAlert
} from "../../../../../../helpers/utils/utils";
import {
    getBaseColumns,
    getCategoryOptions,
    getDynamicColumnsBySupplier,
    getEnvironmentalCategories,
    getUnitOptions
} from "../../../../../../helpers/utils/ProductColumns";

const PAGE_SIZE = 100;

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
            const supplierId = getSupplierId();
            const { data, status } = await productServices.getProductList(supplierId);
            if (status === ResponseStatusEnum.OK) {
                const products = await normalizeRows(supplierId, data);
                setProductList(products);
                setFilteredData(products);
            }
        } catch (error) {
            console.error("Error al obtener la lista de productos:", error);
        }
    };

    const normalizeRows = async (supplierId, data) => {
        try {
            // Obtener la información de los municipios
            const { municipalities } = await getDynamicColumnsBySupplier(supplierId,true);

            // Normalizar cada fila de productos
            return data.map((row) => {
                // Extraer los precios de los municipios
                const municipalityPrices = Object.fromEntries(
                    municipalities.map((municipality) => {
                        const priceData = row.valor_municipio.find(v => v.ubicacion_proveedor === municipality.id);
                        const price = priceData !== undefined ? priceData.valor_unitario : '0.00';
                        return [`price_${municipality.id}`, price];
                    })
                );

                return {
                    id: row.id,
                    name: row.nombre,
                    description: row.especificacion_tecnicas,
                    brand: row.marca_comercial,
                    unit: row.unidad_medida,
                    category: row.categoria_producto,
                    ...municipalityPrices,
                    ambiental: {
                        PNN: row?.ambiental?.PNN ?? 0,
                        ZRFA: row?.ambiental?.ZRFA ?? 0,
                        ZRFB: row?.ambiental?.ZRFB ?? 0,
                        ZRFC: row?.ambiental?.ZRFC ?? 0,
                        AMEMPre: row?.ambiental?.AMEMPre ?? 0,
                        AMEMProd: row?.ambiental?.AMEMProd ?? 0,
                        DRMI: row?.ambiental?.DRMI ?? 0,
                        RFPN: row?.ambiental?.RFPN ?? 0,
                        ND: row?.ambiental?.ND ?? 0,
                        RIL: row?.ambiental?.RIL ?? 0,
                        CCL: row?.ambiental?.CCL ?? 0,
                    }
                };
            });
        } catch (error) {
            console.error('Error al normalizar filas:', error);
            return []; // Devolver array vacío en caso de error
        }
    };

    const loadData = async () => {
        try {
            const supplierId = getSupplierId();
            const [unitData, categoryData, { newDynamicColumns }] = await Promise.all([
                getUnitOptions(),
                getCategoryOptions(),
                getDynamicColumnsBySupplier(supplierId, true)
            ]);

            setUnitOptions(unitData);
            setCategoryOptions(categoryData);
            setDynamicMunicipalityColumns(newDynamicColumns);
        } catch (error) {
            handleError(error, "Error cargando los datos iniciales.");
        }
    };

    //
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

    const baseColumns = getBaseColumns(unitOptions, categoryOptions, handleRowUpdate, true);
    const columns = [...baseColumns, ...dynamicMunicipalityColumns];

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

    //
    const handleCreateProducts = () => navigate('/admin/create-products');

    //
    const handleBack = () => navigate('/admin/products');

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

            showAlert('Bien hecho!', 'Productos actualizados con éxito.');
            setEditedProducts([]);
        } catch (error) {
            handleError('Error', 'Error al guardar los productos.');
        } finally {
            setLoading(false);
        }
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
        if (status !== ResponseStatusEnum.OK) {
            throw new Error(`Error en el estado de la respuesta. Status: ${status}`);
        }
        return data;
    };

    //Obtener el ID del proveedor
    const getSupplierId = () => {
        return supplierServices.getSupplierId();
    };

    const productsBeforeSend = async (inputData) => {
        const supplierId = parseInt(getSupplierId());
        const environmentalKeys = await getEnvironmentalCategoryKeys();

        return inputData.map((product) => ({
            id: product.id,
            proveedor_id: supplierId,
            nombre: product.name,
            especificacion_tecnicas: product.description,
            marca_comercial: product.brand,
            unidad_medida: product.unit,
            categoria_producto: product.category,
            valor_municipio: extractMunicipios(product),
            ambiental: buildData(product, environmentalKeys),
            cantidad_ambiental: {cant: 0, ambiental_key: ''},
        }));
    };

    //Obtener las claves ambientales
    const getEnvironmentalCategoryKeys = async () => {
        const categories = await getEnvironmentalCategories();
        return categories.map((category) => category.codigo);
    };

    const buildData = (product, keys) => {
        return Object.fromEntries(
            keys.map((key) => [key, 1])
        );
    };

    //Cargar datos iniciales
    useEffect(() => {
        getProductList();
        loadData();
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
                                <FaPlus /> Agregar productos
                            </Button>

                            <Button
                                variant="secondary"
                                size="md"
                                onClick={handleBack}
                                className="button-order-responsive">
                                <FaBackspace /> Atras
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
                            <FaSave/> {loading ? "Guardando..." : "Guardar Productos"}
                        </Button>
                    </div>

                </div>

            </div>
        </>
    )
}