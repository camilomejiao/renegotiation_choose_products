import { useNavigate, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Col } from "react-bootstrap";
import {FaCheck, FaEdit, FaPlus, FaSave, FaTrash} from "react-icons/fa";
import { DataGrid } from "@mui/x-data-grid";
import Select from "react-select";
import debounce from "lodash/debounce";

// Img
import imgPeople from "../../../../assets/image/addProducts/people1.jpg";

// Components
import { HeaderImage } from "../../shared/header-image/HeaderImage";
import { ConfirmationModal } from "../../shared/Modals/ConfirmationModal";

// Services
import { productServices } from "../../../../helpers/services/ProductServices";
import { supplierServices } from "../../../../helpers/services/SupplierServices";
import AlertComponent from "../../../../helpers/alert/AlertComponent";

// Enum
import { ProductStatusEnum, ResponseStatusEnum, RolesEnum } from "../../../../helpers/GlobalEnum";

//Utils
import {chunkArray, extractMunicipios, handleError, showAlert} from "../../../../helpers/utils/utils";
import {
    getBaseColumns,
    getCategoryOptions,
    getDynamicColumnsBySupplier,
    getUnitOptions,
    getCategoriesColumns
} from "../../../../helpers/utils/ProductColumns";

const PAGE_SIZE = 100;

export const ProductList = () => {
    const { userAuth } = useOutletContext();
    const navigate = useNavigate();

    const [suppliers, setSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [productList, setProductList] = useState([]);
    const [editedProducts, setEditedProducts] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const [showModal, setShowModal] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [unitOptions, setUnitOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [dynamicMunicipalityColumns, setDynamicMunicipalityColumns] = useState([]);
    const [loading, setLoading] = useState(false);


    //Obtener la lista de proveedores
    const getSuppliers = async () => {
        try {
            const { data, status } = await supplierServices.getSuppliersAll();
            if (status === ResponseStatusEnum.OK) {
                setSuppliers(data);
            }
        } catch (error) {
            console.error("Error al obtener la lista de proveedores:", error);
        }
    }

    //
    const getSupplierId = () => {
        let supplierId = null;
        if (selectedSupplier && (userAuth.rol_id === RolesEnum.AUDITOR || userAuth.rol_id === RolesEnum.ADMIN)) {
            supplierId = selectedSupplier.value;
        }

        if (userAuth.rol_id === RolesEnum.SUPPLIER) {
            supplierId = supplierServices.getSupplierId();
        }

        return supplierId;
    }

    //Obtener la lista de productos
    const getProductList = async () => {
        try {
            const { data, status } = await productServices.getProductList(getSupplierId());
            if (status === ResponseStatusEnum.OK) {
                const products =  await normalizeRows(getSupplierId(), data);
                setProductList(products);
                setFilteredData(products);
            }
        } catch (error) {
            console.error("Error al obtener la lista de productos:", error);
        }
    };

    //
    const loadData = async () => {
        try {
            const [unitData, categoryData, { newDynamicColumns }] = await Promise.all([
                getUnitOptions(),
                getCategoryOptions(),
                getDynamicColumnsBySupplier(getSupplierId(), true)
            ]);

            setUnitOptions(unitData);
            setCategoryOptions(categoryData);
            setDynamicMunicipalityColumns(newDynamicColumns);
        } catch (error) {
            handleError(error, "Error cargando los datos iniciales.");
        }
    };

    //
    const normalizeRows = async (supplierId, data) => {
        try {
            const { municipalities } = await getDynamicColumnsBySupplier(supplierId,true);

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
                    reference: row.referencia,
                    unit: row.unidad_medida,
                    category: row.categoria_producto,
                    ...municipalityPrices,
                    state: row?.fecha_aprobado !== null ? ProductStatusEnum.APPROVED : ProductStatusEnum.PENDING_APPROVAL,
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
                };
            });
        } catch (error) {
            console.error('Error al normalizar filas:', error);
            return [];
        }
    };

    //
    const baseColumns = getBaseColumns(unitOptions, categoryOptions, false);

    const statusProduct = [
        { field: "state", headerName: "ESTADO", width: 150, },
    ];

    const actionsColumns = [
        {
            field: "actions",
            headerName: "ACCIONES",
            width: 150,
            renderCell: (params) => (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteClick(params.row.id)}
                        style={{marginRight: "10px"}}
                    >
                        <FaTrash/>
                    </Button>
                    {(userAuth.rol_id === RolesEnum.ADMIN || userAuth.rol_id === RolesEnum.AUDITOR) && (
                        <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleApproveByAudit(params.row.id)}
                            style={{ marginLeft: '10px' }}
                        >
                            <FaCheck/>
                        </Button>
                    )}
                </div>
            ),
            sortable: false,
            filterable: false,
        },
    ];

    const debouncedHandleChange = debounce((field, params, newValue) => {
        params.api.updateRows([{ id: params.row.id, [field]: newValue }]);

        setEditedProducts((prevState) => {
            const index = prevState.findIndex((product) => product.id === params.row.id);
            if (index > -1) {
                prevState[index][field] = newValue;
            } else {
                prevState.push({ ...params.row, [field]: newValue });
            }
            return [...prevState];
        });
    }, 300);


    const handleSelectChange = (field) => (params) => (event) => {
        const newValue = event.target.value;
        debouncedHandleChange(field, params, newValue);
    };

    const categoriesColumns = getCategoriesColumns(handleSelectChange, userAuth.rol_id);

    const columns = [...baseColumns, ...dynamicMunicipalityColumns, ...statusProduct, ...actionsColumns, ...categoriesColumns];

    const handleDeleteClick = (id) => {
        setSelectedRowId(id);
        setShowModal(true);
    };

    const handleApproveByAudit = async (id) => {
        try {
            const { status } = await productServices.productApprove(id);
            if (status === ResponseStatusEnum.OK) {
                showAlert("Bien hecho!", "Producto aprobado exitosamente!");
                await getProductList();
                handleCloseModal();
            }
        } catch (error) {
            console.error("Error al aprobar el producto:", error);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        selectedRowId(null);
    };

    const handleConfirmDelete = async () => {
        try {
            const { status } = await productServices.productRemove(selectedRowId);
            if (status === ResponseStatusEnum.NO_CONTENT) {
                showAlert("Bien hecho!", "Producto eliminado exitosamente!");
                await getProductList();
                handleCloseModal();
            }
            if (status === ResponseStatusEnum.FORBIDDEN) {
                showInfo("Atención!", "No puedes borrar este producto ya aprobado!");
                handleCloseModal();
            }
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
        }
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

    //
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

    //
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
            valor_municipio: extractMunicipios(product),
            ambiental: {
                PNN: parseInt(product?.PNN),
                ZRFA: parseInt(product?.ZRFA),
                ZRFB: parseInt(product?.ZRFB),
                ZRFC: parseInt(product?.ZRFC),
                AMEMPre: parseInt(product?.AMEMPre),
                AMEMProd: parseInt(product?.AMEMProd),
                DRMI: parseInt(product?.DRMI),
                RFPN: parseInt(product?.RFPN),
                ND: parseInt(product?.ND),
                RIL: parseInt(product?.RIL),
                CCL: parseInt(product?.CCL),
            }
        }));
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
        const { data, status } = await productServices.edit(batch, selectedSupplier.value);
        if (status !== ResponseStatusEnum.OK) {
            throw new Error(`Error en el estado de la respuesta. Status: ${status}`);
        }
        return data;
    };

    const showAlert = (title, message) => AlertComponent.success(title, message);

    const showInfo = (title, message) => AlertComponent.info(title, message);
    const handleCreateProducts = () => navigate(`/admin/create-products`);

    const handleEditProducts = () => navigate(`/admin/edit-product`);

    useEffect(() => {
        if(userAuth.rol_id === RolesEnum.ADMIN || userAuth.rol_id === RolesEnum.AUDITOR) {
            getSuppliers();
        }

        if(userAuth.rol_id === RolesEnum.SUPPLIER) {
            getProductList();
            loadData();
        }
    }, [userAuth.rol_id]);

    useEffect(() => {
        if (selectedSupplier && (userAuth.rol_id === RolesEnum.ADMIN || userAuth.rol_id === RolesEnum.AUDITOR)) {
            getProductList();
            loadData();
        }
    }, [selectedSupplier, userAuth.rol_id]);

    return (
        <>
            <div className="main-container">
                <HeaderImage
                    imageHeader={imgPeople}
                    titleHeader="¡Listado de productos!"
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

                            {(userAuth.rol_id === RolesEnum.SUPPLIER) && (
                                <>
                                    <Button onClick={handleCreateProducts} className="button-order-responsive">
                                        Agregar productos <FaPlus />
                                    </Button>

                                    <Button variant="secondary" onClick={handleEditProducts} className="button-order-responsive">
                                        Editar productos <FaEdit />
                                    </Button>
                                </>
                            )}

                            {(userAuth.rol_id === RolesEnum.ADMIN || userAuth.rol_id === RolesEnum.AUDITOR) && (
                                <Col xs={12} md={6} className="d-flex align-items-center">
                                    <Select
                                        value={selectedSupplier}
                                        onChange={(selectedOption) => setSelectedSupplier(selectedOption)}
                                        options={suppliers?.map((opt) => ({ value: opt.id, label: opt.nombre }))}
                                        placeholder="Selecciona una compañía"
                                        classNamePrefix="custom-select"
                                        className="custom-select w-100"
                                    />
                                </Col>
                            )}
                        </div>
                    </div>

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
                                    fontSize: "12px",
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
                                    fontSize: "12px",
                                    textAlign: "left",
                                    justifyContent: "left",
                                    alignItems: "flex-start",
                                    display: "flex",
                                },
                                "& .MuiSelect-root": {
                                    fontSize: "12px",
                                    fontFamily: "Arial, sans-serif",
                                    width: "100%",
                                },
                                "& .MuiDataGrid-row:hover": {
                                    backgroundColor: "#E8F5E9",
                                },
                            }}
                        />

                        <ConfirmationModal
                            show={showModal}
                            title="Confirmación de Eliminación"
                            message="¿Estás seguro de que deseas eliminar este elemento?"
                            onConfirm={handleConfirmDelete}
                            onClose={handleCloseModal}
                        />
                    </div>

                    {/* Botón Guardar */}
                    <div className="d-flex align-items-end mt-3">
                        {(userAuth.rol_id === RolesEnum.ADMIN || userAuth.rol_id === RolesEnum.AUDITOR) && (
                            <Button
                                variant="success"
                                size="md"
                                onClick={handleSaveProducts}
                                className="ms-auto"
                                disabled={loading}
                            >
                                {loading ? "Guardando..." : "Guardar Productos"} <FaSave/>
                            </Button>
                        )}
                    </div>

                </div>

            </div>
        </>
    );
};