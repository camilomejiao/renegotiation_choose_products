import { useNavigate, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { DataGrid } from "@mui/x-data-grid";
import Select from "react-select";

// Img
import imgPeople from "../../../../../../assets/image/addProducts/people1.jpg";

// Components
import { HeaderImage } from "../../../../shared/header_image/HeaderImage";
import { ApprovedDeniedModal } from "../../../../shared/Modals/ApprovedDeniedModal";

// Services
import { productServices } from "../../../../../../helpers/services/ProductServices";
import { convocationServices } from "../../../../../../helpers/services/ConvocationServices";
import AlertComponent from "../../../../../../helpers/alert/AlertComponent";

// Enum
import {
    GeneralStatusProductEnum,
    ResponseStatusEnum,
    RolesEnum,
    StatusTeamProductEnum
} from "../../../../../../helpers/GlobalEnum";

//Utils
import { showAlert } from "../../../../../../helpers/utils/utils";
import {
    getBaseColumns,
    getStatusProduct,
    getObservationsColumns
} from "../../../../../../helpers/utils/ValidateProductColumns";

const PAGE_SIZE = 1000;
const BATCH_SIZE = 250;

export const ValidationSupervision = () => {
    const { userAuth } = useOutletContext();
    const navigate = useNavigate();

    const [convocations, setConvocations] = useState([]);
    const [selectedConvocation, setSelectedConvocation] = useState(null);

    const [planRaw, setPlanRaw] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);

    const [suppliers, setSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState(null);

    const [formFields, setFormFields] = useState({typeCall: "", typePlan: "", typeSupplier: ""});

    const [productList, setProductList] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const [showModal, setShowModal] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingTable, setLoadingTable] = useState(false);

    const [selectedIds, setSelectedIds] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [comment, setComment] = useState('');
    const [action, setAction] = useState('approve');

    //
    const baseColumns = getBaseColumns();
    const statusProduct = getStatusProduct();
    const observationsColumns = getObservationsColumns(userAuth.rol_id);

    const columns = [
        ...baseColumns,
        ...statusProduct,
        ...observationsColumns,
    ];

    //Obtener la lista de jornadas
    const getConvocations = async () => {
        setLoading(true);
        try {
            const {data, status} = await convocationServices.getConvocations();
            if (status === ResponseStatusEnum.OK) {
                setConvocations(data.data.jornadas);
            }
        } catch (error) {
            console.error("Error al obtener la lista de proveedores:", error);
        } finally {
            setLoading(false);
        }
    }

    // Cargar planes
    const getPlans = async (convocationId) => {
        try {
            setLoading(true);
            const { data, status } = await convocationServices.getPlansByConvocation(convocationId);
            if (status === ResponseStatusEnum.OK) {
                setPlanRaw(data?.data?.planes);
            } else {
                setPlanRaw([]);
            }
        } catch (error) {
            console.log(error);
            setPlanRaw([]);
        } finally {
            setLoading(false);
        }
    };

    //Obtener la lista de proveedores
    const getSuppliers = async (convocationId) => {
        setLoading(true);
        try {
            const { data, status } = await convocationServices.getSupplierByConvocation(convocationId);
            if (status === ResponseStatusEnum.OK) {
                setSuppliers(data.data.proveedores);
            }
        } catch (error) {
            console.error("Error al obtener la lista de proveedores:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleSelectedConvocation = async (option) => {
        setSelectedConvocation(option);
        setSelectedSupplier(null);
        setFormFields(prev => ({
            ...prev,
            typeCall: option?.value ?? "",
            typePlan: "",
            typeSupplier: ""
        }));
        setSuppliers([]);
        if (option?.value) {
            await getPlans(option.value);
            await getSuppliers(option.value);
        }
    };

    /**
     * Maneja el cambio de Plan: actualiza form y, si hay valor, carga los productos.
     * @param {{value:number,label:string}|null} option
     */
    const handleSelectedPlan = async (option) => {
        setSelectedPlan(option ?? null);
        setFormFields((prev) => ({
            ...prev,
            typePlan: option?.value ?? "",
        }));
        if (option?.value) {
            await getProductList(option.value);
        } else {
            setProductList([]);
            setFilteredData([]);
        }
    };

    const handleSelectedSupplier = async (option) => {
        setSelectedSupplier(option);
        setFormFields(prev => ({
            ...prev,
            typeSupplier: option?.value ?? ""
        }));
        if (option?.value) {
            await getProductList(option.value);
        }
    };

    //Obtener la lista de productos
    const getProductList = async (supplierId) => {
        setLoadingTable(true);
        try {
            const { data, status } = await convocationServices.convocationServices(formFields.typePlan, supplierId);
            if (status === ResponseStatusEnum.OK) {
                const products =  await normalizeRows(data.data);
                setProductList(products);
                setFilteredData(products);
            }
        } catch (error) {
            console.error("Error al obtener la lista de productos:", error);
        } finally {
            setLoadingTable(false)
        }
    };

    //
    const normalizeRows = async (data) => {
        try {
            return data.map((row) => ({
                id: row?.id,
                name: row?.nombre,
                description: row?.especificacion_tecnicas,
                brand: row?.marca_comercial,
                unit: row?.unidad_medida,
                category: row?.categoria_producto,
                price_min: `$ ${row?.precio_min.toLocaleString()}`,
                price_max: `$ ${row?.precio_max.toLocaleString()}`,
                price: `$ ${row?.precio.toLocaleString()}`,
                state: getProductState(row?.fecha_aprobado, row?.aprobados),
                ...extractObservations(row?.aprobados),
            }));
        } catch (error) {
            console.error('Error al normalizar filas:', error);
            return [];
        }
    };

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

    //Extraer observaciones
    const extractObservations = (rows) => {
        const roleMap = {
            [RolesEnum.ENVIRONMENTAL]: {
                observationKey: "observations_environmental",
                statusKey: "status_environmental"
            },
            [RolesEnum.SUPERVISION]: {
                observationKey: "observations_supervision",
                statusKey: "status_supervision"
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

    // Cerrar modal aprobacion
    const handleCloseModalApproved = () => {
        setOpenModal(false);
        setComment('');
        setAction('approve');
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
            await getProductList(formFields.typeSupplier);
            handleCloseModalApproved();
        } catch (error) {
            console.error("Unexpected error during approval:", error);
        } finally {
            setLoading(false);
        }
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
        getConvocations();
    }, []);

    return (
            <>
                <div className="main-container">
                    <HeaderImage
                        imageHeader={imgPeople}
                        titleHeader="¡Listado de productos!"
                    />

                    <div className="container mt-lg-3">
                        <Row className="gy-2 align-items-center mt-3 mb-3">
                            {/* Select Jornada */}
                            <Col xs={12} md={4}>
                                <Select
                                    value={selectedConvocation ?? null}                          // 👈 null cuando no hay selección
                                    options={convocations?.map(opt => ({ value: opt.id, label: opt.nombre }))}
                                    placeholder="Selecciona una Jornada"
                                    onChange={handleSelectedConvocation}                         // recibe option o null
                                    isClearable
                                    classNamePrefix="custom-select"
                                    className="custom-select w-100"
                                    styles={{
                                        placeholder: (base) => ({ ...base, color: '#6c757d' }),   // 👈 visible siempre
                                        singleValue: (base) => ({ ...base, color: '#212529' }),
                                    }}
                                    noOptionsMessage={() => "Sin opciones"}
                                />
                            </Col>

                            {/* Select Plan */}
                            <Col xs={12} md={4}>
                                <Select
                                    value={selectedPlan ?? null}
                                    options={planRaw.map((opt) => ({ value: opt.id, label: opt.plan_nombre }))}
                                    placeholder="Selecciona un Plan"
                                    onChange={handleSelectedPlan}
                                    isClearable
                                    isDisabled={!selectedConvocation || loading}
                                    isLoading={loading}
                                    classNamePrefix="custom-select"
                                    className="custom-select w-100"
                                    noOptionsMessage={() => (selectedConvocation ? "Sin planes" : "Selecciona una jornada")}
                                />
                            </Col>

                            {/* Select Supplier */}
                            <Col xs={12} md={4}>
                                <Select
                                    value={selectedSupplier}
                                    options={suppliers.map(opt => ({ value: opt.id, label: opt.nombre }))}
                                    placeholder="Selecciona un Proveedor"
                                    onChange={handleSelectedSupplier}
                                    isClearable
                                    isDisabled={!selectedConvocation || loading}
                                    isLoading={loading}
                                    classNamePrefix="custom-select"
                                    className="custom-select w-100"
                                    noOptionsMessage={() => selectedConvocation ? "Sin proveedores" : "Selecciona una jornada"}
                                />
                            </Col>
                        </Row>

                        <Row className="gy-2 align-items-center mt-3 mb-3">
                            <Col xs={12} md={4}>
                                <input
                                    type="text"
                                    placeholder="Buscar..."
                                    value={searchQuery}
                                    onChange={handleSearchQueryChange}
                                    className="form-control"
                                />
                            </Col>
                        </Row>

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
                        </div>

                    </div>

                </div>
            </>
        );
    };