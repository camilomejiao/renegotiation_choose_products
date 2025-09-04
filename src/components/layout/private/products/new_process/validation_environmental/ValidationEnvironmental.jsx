import { useNavigate, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Col } from "react-bootstrap";
import { FaEdit, FaPlus, FaSave, FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { DataGrid } from "@mui/x-data-grid";
import Select from "react-select";
import debounce from "lodash/debounce";

// Img
import imgPeople from "../../../../../../assets/image/addProducts/people1.jpg";

// Components
import { HeaderImage } from "../../../../shared/header_image/HeaderImage";
import { ConfirmationModal } from "../../../../shared/Modals/ConfirmationModal";
import { ApprovedDeniedModal } from "../../../../shared/Modals/ApprovedDeniedModal";

// Services
import { productServices } from "../../../../../../helpers/services/ProductServices";
import { supplierServices } from "../../../../../../helpers/services/SupplierServices";
import AlertComponent from "../../../../../../helpers/alert/AlertComponent";

// Enum
import {
    GeneralStatusProductEnum,
    ResponseStatusEnum,
    RolesEnum,
    StatusTeamProductEnum
} from "../../../../../../helpers/GlobalEnum";

//Utils
import {chunkArray, extractMunicipios, handleError, showAlert} from "../../../../../../helpers/utils/utils";
import {
    getBaseColumns,
    getCategoryOptions,
    getDynamicColumnsBySupplier,
    getUnitOptions,
    getStatusProduct,
    getEnvironmentalCategoriesColumns,
    getObservationsColumns,
    getActionsColumns, getEnvironmentalCategories,
} from "../../../../../../helpers/utils/ValidateProductColumns";

const PAGE_SIZE = 1000;
const BATCH_SIZE = 250;

const mockData = [
    {

    }

];

export const ValidationEnvironmental = () => {
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
    const [loadingTable, setLoadingTable] = useState(false);
    const [environmentalCategoriesColumns, setEnvironmentalCategoriesColumns] = useState([]);

    const [selectedIds, setSelectedIds] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [comment, setComment] = useState('');
    const [action, setAction] = useState('approve');

    //Usuarios permitidos
    const allowedRoles = [
        RolesEnum.ADMIN,
        RolesEnum.ENVIRONMENTAL
    ];

    //
    const loadData = async () => {
        try {
            const [unitData, categoryData ] = await Promise.all([
                getUnitOptions(),
                getCategoryOptions(),
            ]);

            setUnitOptions(unitData);
            setCategoryOptions(categoryData);
        } catch (error) {
            handleError(error, "Error cargando los datos iniciales.");
        }
    };

    //Obtener la lista de jornadas
    const getConvocations = async () => {
        setLoading(true);
        try {
            //const { data, status } = await supplierServices.getSuppliersAll();
            //if (status === ResponseStatusEnum.OK) {
                setSuppliers(mockData);
            //}
        } catch (error) {
            console.error("Error al obtener la lista de proveedores:", error);
        } finally {
            setLoading(false);
        }
    }

    //Obtener la lista de productos
    const getProductList = async () => {
        setLoadingTable(true);
        try {
            // const { data, status } = await productServices.getProductList(getSupplierId());
            // if (status === ResponseStatusEnum.OK) {
            //     const products =  await normalizeRows(getSupplierId(), data);
            //     setProductList(products);
            //     setFilteredData(products);
            // }
        } catch (error) {
            console.error("Error al obtener la lista de productos:", error);
        } finally {
            setLoadingTable(false)
        }
    };

    //
    const normalizeRows = async (data) => {
        try {
            const environmentalCategories = await getEnvironmentalCategories();

            return data.map((row) => ({
                id: row?.id,
                name: row?.nombre,
                description: row?.especificacion_tecnicas,
                brand: row?.marca_comercial,
                unit: row?.unidad_medida,
                category: row?.categoria_producto,
                state: getProductState(row?.fecha_aprobado, row?.aprobados),
                ...buildEnvironmentalData(row, environmentalCategories),
                ...extractObservations(row?.aprobados),
                ...extractCountEnvironmental(row)
            }));
        } catch (error) {
            console.error('Error al normalizar filas:', error);
            return [];
        }
    };

    // Debounce para evitar actualizaciones continuas
    const debouncedHandleChange = debounce((field, params, newValue) => {
        // Actualiza la celda en el DataGrid
        params.api.updateRows([{ id: params.row.id, [field]: newValue }]);

        // Actualiza el estado de productos editados
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

    // Método principal para el cambio de selección
    const handleSelectChange = (field) => (params, newValue) => {
        debouncedHandleChange(field, params, newValue);
    };

    const handleCustomChange = (params, fieldKey, newValue) => {
        debouncedHandleChange(fieldKey, params, newValue);
    };

    const getEnvironmentalColumns = async () => {
        const columns = await getEnvironmentalCategoriesColumns(handleSelectChange, handleCustomChange);
        setEnvironmentalCategoriesColumns(columns);
    }





    //
    const getProductState = (approvalDate, approvalList) => {
        //Si todos están aprobados
        const allApproved = approvalList.every(item => item.estado === StatusTeamProductEnum.APPROVED.id);
        if (allApproved && approvalDate) {
            return GeneralStatusProductEnum.APPROVED;
        }

        //Si alguno está rechazado
        const hasRejected = approvalList.some(item => item.estado === StatusTeamProductEnum.DENIED.id);
        if (hasRejected && !approvalDate) {
            return GeneralStatusProductEnum.REFUSED;
        }

        if(!approvalDate) {
            return GeneralStatusProductEnum.PENDING_APPROVAL;
        }
    };

    //Extraer precios por municipio
    const extractMunicipalityPrices = (row, municipalities) => {
        return Object.fromEntries(
            municipalities.map((municipality) => {
                const priceData = row.valor_municipio.find(v => v.ubicacion_proveedor === municipality.id);
                return [`price_${municipality.id}`, priceData?.valor_unitario ?? '0.00'];
            })
        );
    }

    //Obtener las claves ambientales
    const getEnvironmentalCategoryKeys = async () => {
        const categories = await getEnvironmentalCategories();
        return categories.map((category) => category.codigo);
    };

    //Construir objeto ambiental dinámico
    const buildEnvironmentalData = (row, categories) => {
        return Object.fromEntries(
            categories.map(({codigo}) => [codigo, String(row?.ambiental?.[codigo] ?? 0)])
        );
    }

    //Extraer observaciones
    const extractObservations = (rows) => {
        const roleMap = {
            [RolesEnum.TECHNICAL]: {
                observationKey: "observations_technical",
                statusKey: "status_technical"
            },
            [RolesEnum.ENVIRONMENTAL]: {
                observationKey: "observations_environmental",
                statusKey: "status_environmental"
            },
            [RolesEnum.SUPERVISION]: {
                observationKey: "observations_territorial",
                statusKey: "status_territorial"
            }
        };
        const statusMap = Object.values(StatusTeamProductEnum).reduce((acc, { id, label }) => {
            acc[id] = label;
            return acc;
        }, {});
        return rows.reduce((acc, { rol, estado, comentario, funcionario, fecha }) => {
            const role = roleMap[rol];
            if (!role) return acc;

            acc[role.statusKey] = statusMap[estado] ?? "Sin revisar";
            acc[role.observationKey] = { comentario, funcionario, fecha };

            return acc;
        }, {});
    };

    //Limit enviromental
    const extractCountEnvironmental = (row) => {
        if (!row || !row.cantidad_ambiental) {
            return {customValue: "", selectedCategory: ""};
        }
        const { cant, ambiental_key } = row.cantidad_ambiental;
        return { customValue: cant ?? "", selectedCategory: ambiental_key ?? "" };
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
    const baseColumns = getBaseColumns(unitOptions, categoryOptions, handleRowUpdate, false);

    const statusProduct = getStatusProduct();

    const handleDeleteClick = (id) => {
        setSelectedRowId(id);
        setShowModal(true);
    };

    //Manejar selección de filas
    const handleSelectionChange = (newSelection) => {
        setSelectedIds(newSelection);
    };

    const handleOpenModal = () => {
        if (selectedIds.length === 0) {
            showInfo('Por favor seleccione al menos un producto.');
            return;
        }
        setOpenModal(true);
    };

    // Cerrar modal confirmación
    const handleCloseModalConfirm = () => {
        setShowModal(false);
        selectedRowId(null);
    };

    // Cerrar modal aprobacion
    const handleCloseModalApproved = () => {
        setOpenModal(false);
        setComment('');
        setAction('approve');
    };

    const handleConfirmDelete = async () => {
        try {
            const { status } = await productServices.productRemove(selectedRowId);
            if (status === ResponseStatusEnum.NO_CONTENT) {
                showAlert("Bien hecho!", "Producto eliminado exitosamente!");
                await getProductList();
                handleCloseModalConfirm();
            }
            if (status === ResponseStatusEnum.FORBIDDEN) {
                showInfo("Atención!", "No puedes borrar este producto ya aprobado!");
                handleCloseModalConfirm();
            }
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
        }
    };

    //
    const createApprovalPayload = (idsBatch, estado, comentario) => ({
        ids: idsBatch,
        estado,
        comentario,
    });

    //
    const sendBatchApproval = async (payload) => {
        try {
            const { status } = await productServices.productApprove(payload);
            return status === ResponseStatusEnum.OK;
        } catch (error) {
            console.error("Error sending batch approval:", error);
            return false;
        }
    };

    //
    const processBatches = async (ids, estado, comentario) => {
        for (let i = 0; i < ids.length; i += BATCH_SIZE) {
            const batch = ids.slice(i, i + BATCH_SIZE);
            const payload = createApprovalPayload(batch, estado, comentario);
            const success = await sendBatchApproval(payload);

            if (!success) {
                console.warn(`Failed to approve batch starting at index ${i}`);
                // Optional: break or continue based on your retry policy
            }
        }
    };

    const handleApproveByAudit = async (ids, accion, comment) => {
        setLoading(true);

        const estado = accion === 'approve' ? 1 : 0;
        const label = accion === 'approve' ? 'Aprobado' : 'Denegado';

        try {
            await processBatches(ids, estado, comment);
            showAlert("Bien hecho!", `Producto ${label} exitosamente!`);
            await getProductList();
            handleCloseModalApproved();
        } catch (error) {
            console.error("Unexpected error during approval:", error);
        } finally {
            setLoading(false);
        }
    };

    const actionsColumns = getActionsColumns(userAuth.rol_id, handleDeleteClick, handleApproveByAudit);

    const observationsColumns = getObservationsColumns(userAuth.rol_id);

    const columns = [
        ...baseColumns,
        ...dynamicMunicipalityColumns,
        ...statusProduct,
        ...( [RolesEnum.SUPPLIER].includes(userAuth.rol_id) ? actionsColumns : []),
        ...( allowedRoles.includes(userAuth.rol_id) ? observationsColumns : [] ),
        ...( [RolesEnum.ADMIN, RolesEnum.ENVIRONMENTAL].includes(userAuth.rol_id) ? environmentalCategoriesColumns : [] ),
    ];

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
    const productsBeforeSend = async (inputData) => {
        //Obtener claves ambientales
        const environmentalKeys = await getEnvironmentalCategoryKeys();

        return inputData.map((product) => ({
            id: product.id,
            nombre: product.name,
            especificacion_tecnicas: product.description,
            marca_comercial: product.brand,
            unidad_medida: product.unit,
            categoria_producto: product.category,
            valor_municipio: extractMunicipios(product),
            ambiental: buildData(product, environmentalKeys),
            observations_environmental: product.observations_environmental,
            observations_supervision: product.observations_supervision,
            cantidad_ambiental: {cant: parseInt(product.customValue), ambiental_key: product.selectedCategory},
        }));
    };

    //
    const buildData = (product, keys) => {
        return Object.fromEntries(
            keys.map((key) => [key, parseInt(product[key])])
        );
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
                    //console.error(`Error al enviar el lote ${i + index + 1}:`, result.reason.message);
                    handleError('Error', `Error al enviar el lote ${i + index + 1}: ${result.reason.message}`)
                }
            });
        }

        if (errors.length > 0) {
            throw new Error('Uno o más lotes no se pudieron enviar correctamente.');
        }
    };

    const sendBatchToService = async (batch) => {
        const {data, status} = await productServices.edit(batch, selectedSupplier.value);
        if (status !== ResponseStatusEnum.OK) {
            throw new Error(`Error en el estado de la respuesta. Status: ${status}`);
        }
        return data;
    };

    const showInfo = (title, message) => AlertComponent.info(title, message);

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

    //Aprobación o Denegación
    const handleApproveDenySubmit = async () => {
        try {
            await handleApproveByAudit(selectedIds, action, comment);
        } catch (error) {
            console.error('Error en la aprobación:', error);
        }
    };

    useEffect(() => {
        if (allowedRoles.includes(userAuth.rol_id)) {
            getConvocations();
        }

        if (userAuth.rol_id === RolesEnum.SUPPLIER) {
            getProductList();
            loadData();
        }
    }, [userAuth.rol_id]);

    useEffect(() => {
        if (selectedSupplier && (allowedRoles.includes(userAuth.rol_id))) {
            getProductList();
            loadData();
            getEnvironmentalColumns();
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
                                        <Button onClick={() => navigate(`/admin/create-products`)}
                                                className="button-order-responsive">
                                            <FaPlus/> Agregar productos
                                        </Button>

                                        <Button variant="secondary"
                                                onClick={() => navigate(`/admin/edit-product`)}
                                                className="button-order-responsive">
                                            <FaEdit/> Editar productos
                                        </Button>
                                    </>
                                )}

                                {allowedRoles.includes(userAuth.rol_id) && (
                                    <Col xs={12} md={6} className="d-flex align-items-center">
                                        <Select
                                            value={selectedSupplier}
                                            onChange={(selectedOption) => setSelectedSupplier(selectedOption)}
                                            options={suppliers?.map((opt) => ({value: opt.id, label: opt.nombre}))}
                                            placeholder="Selecciona una compañía"
                                            classNamePrefix="custom-select"
                                            className="custom-select w-100"
                                        />
                                    </Col>
                                )}
                            </div>
                        </div>

                        {loading && (
                            <div className="overlay">
                                <div className="loader">Cargando...</div>
                            </div>
                        )}

                        <div style={{height: 600, width: "100%"}}>
                            <DataGrid
                                loading={loadingTable}
                                columns={columns}
                                rows={filteredData}
                                checkboxSelection
                                onRowSelectionModelChange={handleSelectionChange}
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

                            {/* Modal de confirmación */}
                            <ConfirmationModal
                                show={showModal}
                                title="Confirmación de Eliminación"
                                message="¿Estás seguro de que deseas eliminar este elemento?"
                                onConfirm={handleConfirmDelete}
                                onClose={handleCloseModalConfirm}
                            />

                            {/* Modal de aprobación/denegación */}
                            <ApprovedDeniedModal
                                open={openModal}
                                onClose={handleCloseModalApproved}
                                action={action}
                                setAction={setAction}
                                comment={comment}
                                setComment={setComment}
                                onSubmit={handleApproveDenySubmit}
                            />
                        </div>

                        {/* Botón Guardar */}
                        <div className="d-flex justify-content-end gap-2 mt-3">
                            {allowedRoles.includes(userAuth.rol_id) && (
                                <>
                                    <Button
                                        variant="warning"
                                        size="md"
                                        color="primary"
                                        onClick={handleOpenModal}
                                        disabled={loading}
                                    >
                                        <FaThumbsUp/> Aprobar / <FaThumbsDown/> Denegar
                                    </Button>
                                    </>
                            )}
                            {[RolesEnum.ENVIRONMENTAL].includes(userAuth.rol_id) && (
                                <>
                                    <Button
                                        variant="success"
                                        size="md"
                                        onClick={handleSaveProducts}
                                        disabled={loading}
                                    >
                                        <FaSave/> {loading ? "Guardando..." : "Guardar Productos"}
                                    </Button>
                                </>
                            )}
                        </div>

                    </div>

                </div>
            </>
        );
    };