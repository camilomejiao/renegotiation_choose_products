import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import { Button, Col, Row } from "react-bootstrap";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { DataGrid } from "@mui/x-data-grid";
import Select from "react-select";

// Img
import imgPeople from "../../../../../assets/image/addProducts/people1.jpg";

// Components
import { HeaderImage } from "../../../shared/header_image/HeaderImage";
import { Loading } from "../../../shared/loading/Loading";
import { ApprovedDeniedModal } from "../../../shared/Modals/ApprovedDeniedModal";

// Services
import { productServices } from "../../../../../helpers/services/ProductServices";
import { convocationProductsServices } from "../../../../../helpers/services/ConvocationProductsServices";
import AlertComponent from "../../../../../helpers/alert/AlertComponent";

// Enum
import {
    GeneralStatusDeliveryProductEnum,
    ResponseStatusEnum,
    RolesEnum,
    StatusTeamProductEnum
} from "../../../../../helpers/GlobalEnum";

//Utils
import { showAlert } from "../../../../../helpers/utils/utils";
import {
    getObservationsSupervisionColumns,
    getStatusProduct,
} from "../../../../../helpers/utils/ValidateProductColumns";

const PAGE_SIZE = 100;
const BATCH_SIZE = 250;

export const ValidationSupervision = () => {

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
    const [rowCount, setRowCount] = useState(0);

    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingTable, setLoadingTable] = useState(false);
    const isSearchingRef = useRef(false);

    const [selectedIds, setSelectedIds] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [comment, setComment] = useState('');
    const [action, setAction] = useState('approve');

    //
    const getBaseColumns = [
        { field: "id", headerName: "Id", width: 70 },
        { field: "cod_id", headerName: "Código Producto", width: 110 },
        {
            field: "category",
            headerName: "Categoria",
            flex: 1,
            minWidth: 200,
            renderCell: (params) => (
                <div
                    style={{
                        whiteSpace: "normal",
                        lineHeight: "1.4",
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                    }}
                >
                    {params.value}
                </div>
            ),
        },
        {
            field: "name",
            headerName: "Nombre",
            flex: 1,
            minWidth: 400,
            renderCell: (params) => (
                <div
                    style={{
                        whiteSpace: "normal",
                        lineHeight: "1.4",
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                    }}
                >
                    {params.value}
                </div>
            ),
        },
        {
            field: "description",
            headerName: "Descripción",
            flex: 1,
            minWidth: 300,
            renderCell: (params) => (
                <div
                    style={{
                        whiteSpace: "normal",
                        lineHeight: "1.4",
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                    }}
                >
                    {params.value}
                </div>
            ),
        },
        {
            field: "brand",
            headerName: "Marca",
            flex: 1,
            minWidth: 100,
            renderCell: (params) => (
                <div
                    style={{
                        whiteSpace: "normal",
                        lineHeight: "1.4",
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                    }}
                >
                    {params.value}
                </div>
            ),
        },
        {
            field: "unit",
            headerName: "Unidad",
            flex: 1,
            minWidth: 80,
            renderCell: (params) => (
                <div
                    style={{
                        whiteSpace: "normal",
                        lineHeight: "1.4",
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                    }}
                >
                    {params.value}
                </div>
            ),
        },
        { field: "price_min", headerName: "Precio Min", width: 100},
        { field: "price_max", headerName: "Precio Max", width: 100},
        { field: "price", headerName: "Precio Proveedor", width: 100},
    ];

    const baseColumns = getBaseColumns;
    const statusProduct = getStatusProduct();
    const observationsColumns = getObservationsSupervisionColumns();

    const columns = [
        ...baseColumns,
        ...statusProduct,
        ...observationsColumns,
    ];

    //Obtener la lista de jornadas
    const getConvocations = async () => {
        setLoading(true);
        try {
            const {data, status} = await convocationProductsServices.getConvocations();
            if (status === ResponseStatusEnum.OK) {
                setConvocations(data.data.jornadas);
            }
        } catch (error) {
            console.error("Error al obtener la lista de proveedores:", error);
        } finally {
            setLoading(false);
        }
    };

    // Cargar planes
    const getPlans = async (convocationId) => {
        try {
            setLoading(true);
            const { data, status } = await convocationProductsServices.getPlansByConvocation(convocationId);
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
            const { data, status } = await convocationProductsServices.getSupplierByConvocation(convocationId);
            if (status === ResponseStatusEnum.OK) {
                setSuppliers(data.data.proveedores);
            }
        } catch (error) {
            console.error("Error al obtener la lista de proveedores:", error);
        } finally {
            setLoading(false);
        }
    };

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
            await getSuppliers(formFields.typeCall);
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
            await getProductList(1, PAGE_SIZE, selectedPlan.value, option.value);
        }
    };

    //Obtener la lista de productos
    const getProductList = async (pageToFetch = 1, sizeToFetch = PAGE_SIZE, plan, supplierId, search = "") => {
        setLoadingTable(true);
        try {
            const { data, status } = await convocationProductsServices.convocationServices(pageToFetch, sizeToFetch, plan, supplierId, search);
            if (status === ResponseStatusEnum.OK) {
                const products =  await normalizeRows(data?.data?.productos);
                setProductList(products);
                setFilteredData(products);
                setRowCount(data?.data?.total_productos);
            }

            if (status === ResponseStatusEnum.BAD_REQUEST) {
                showInfo('Proveedor no ha llenado la cotización de los productos.');
                setProductList([]);
                setFilteredData([]);
                setRowCount(0);
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
            return data.map((row) => {
                const priceMinValue = Number(row?.precio_min ?? 0);
                const priceMaxValue = Number(row?.precio_max ?? 0);
                const priceValue    = Number(row?.precio ?? 0);

                const isOutOfRange = priceValue < priceMinValue || priceValue > priceMaxValue;
                const isPriceMaxValue = priceValue > priceMaxValue;

                return {
                    id: row?.id,
                    cod_id: row?.jornada_producto_id,
                    name: row?.nombre,
                    description: row?.especificacion_tecnicas,
                    brand: row?.marca_comercial,
                    unit: row?.unidad_medida,
                    category: row?.categoria_producto,

                    // para mostrar
                    price_min: `$ ${priceMinValue.toLocaleString()}`,
                    price_max: `$ ${priceMaxValue.toLocaleString()}`,
                    price: `$ ${priceValue.toLocaleString()}`,

                    // para validar
                    priceMinValue,
                    priceMaxValue,
                    priceValue,
                    isPriceMaxValue,
                    isOutOfRange,

                    state: getProductState(row?.fecha_aprobado, row?.aprobados),
                    ...extractObservations(row?.aprobados),
                };
            });
        } catch (error) {
            console.error('Error al normalizar filas:', error);
            return [];
        }
    };

    //
    const getProductState = (approvalDate, approvalList) => {
        const isEmpty = !Array.isArray(approvalList) || approvalList.length === 0;

        // Si no hay evaluaciones, no puede estar aprobado ni rechazado
        if (isEmpty) return GeneralStatusDeliveryProductEnum.PENDING_APPROVAL;

        const APPROVED_ID = Number(StatusTeamProductEnum.APPROVED.id);
        const DENIED_ID   = Number(StatusTeamProductEnum.DENIED.id);

        const allApproved = approvalList.every(it => Number(it.estado) === APPROVED_ID && it.rol === RolesEnum.SUPERVISION);
        const hasRejected = approvalList.some(it => Number(it.estado) === DENIED_ID && it.rol === RolesEnum.SUPERVISION);

        if (hasRejected) {
            return GeneralStatusDeliveryProductEnum.REFUSED;
        }

        if (allApproved && approvalDate) {
            return GeneralStatusDeliveryProductEnum.APPROVED;
        }

        return GeneralStatusDeliveryProductEnum.PENDING_APPROVAL;
    };


    //Extraer observaciones
    const extractObservations = (rows) => {
        const roleMap = {
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
        setSelectedIds([]);
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

    //
    const handleApproveByAudit = async (ids, accion, comment) => {
        setLoading(true);

        const estado = accion === 'approve' ? 1 : 0;
        const label = accion === 'approve' ? 'Aprobado' : 'Denegado';

        try {
            await processBatches(ids, estado, comment);
            showAlert("Bien hecho!", `Producto ${label} exitosamente!`);
            await getProductList(page, pageSize, selectedPlan.value, selectedSupplier.value);
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
        setPage(0);
        isSearchingRef.current = true;
    };

    //
    const rowsById = useMemo(() => {
        const map = new Map();
        for (const row of productList) map.set(row.id, row);
        return map;
    }, [productList]);

    //
    const getOutOfRangeSelectedIds = useCallback((ids) => {
        return ids.filter((id) => rowsById.get(id)?.isPriceMaxValue);
    }, [rowsById]);

    //Aprobación o Denegación
    const handleApproveDenySubmit = async () => {
        try {

            // Solo aplica para aprobar
            if (action === "approve") {
                const outOfRangeIds = getOutOfRangeSelectedIds(selectedIds);

                if (outOfRangeIds.length > 0) {
                    showInfo(
                        "No se puede aprobar",
                        `Hay ${outOfRangeIds.length} producto(s) con precio superior del rango permitido. Debes corregirlos o denegarlos.`
                    );
                    return;
                }
            }

            await handleApproveByAudit(selectedIds, action, comment);
        } catch (error) {
            console.error('Error en la aprobación:', error);
        }
    };

    useEffect(() => {
        getConvocations();
    }, []);

    useEffect(() => {
        if (!selectedSupplier?.value) return;
        if (isSearchingRef.current) {
            const timer = setTimeout(() => {
                if (searchQuery.trim()) {
                    getProductList(1, pageSize, selectedPlan.value, selectedSupplier.value, searchQuery);
                } else {
                    getProductList(1, pageSize, selectedPlan.value, selectedSupplier.value, "");
                }
                isSearchingRef.current = false;
            }, 500);
            return () => clearTimeout(timer);
        }
        getProductList(page + 1, pageSize, selectedPlan.value, selectedSupplier.value, searchQuery);
    }, [page, pageSize, selectedPlan, selectedSupplier, searchQuery]);

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
                                    value={selectedConvocation ?? null}
                                    options={convocations?.map(opt => ({ value: opt.id, label: opt.nombre }))}
                                    placeholder="Selecciona una Jornada"
                                    onChange={handleSelectedConvocation}
                                    isClearable
                                    classNamePrefix="custom-select"
                                    className="custom-select w-100"
                                    styles={{
                                        placeholder: (base) => ({ ...base, color: '#6c757d' }),
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
                                    className="form-control management-search-input"
                                />
                            </Col>
                        </Row>

                        {loading && <Loading fullScreen text="Cargando..." />}

                        <div className="grid-wrap datagrid-scroll-wrapper" style={{ height: 600 }}>
                            <div className="datagrid-inner datagrid-inner--wide">
                                <DataGrid
                                loading={loadingTable}
                                columns={columns}
                                rows={filteredData}
                                checkboxSelection
                                rowSelectionModel={selectedIds}
                                onRowSelectionModelChange={handleSelectionChange}
                                paginationMode="server"
                                rowCount={rowCount}
                                paginationModel={{ page, pageSize }}
                                onPaginationModelChange={({ page, pageSize }) => {
                                    setPage(page);
                                    setPageSize(pageSize);
                                }}
                                rowsPerPageOptions={[10, 50, 100]}
                                rowHeight={100}// ↑ más alto para textos multilínea (p.ej. 64, 72, 88)
                                headerHeight={88}
                                getRowClassName={(params) => (params.row.isOutOfRange ? "row-out-range" : "")}
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
                                        backgroundColor: "#2d3a4d",
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
                                        backgroundColor: "#2d3a4d !important",
                                        color: "white !important",
                                    },
                                    "& .MuiDataGrid-cellContent": {
                                        whiteSpace: "normal",
                                        wordBreak: "break-word",
                                        lineHeight: 1.4,
                                    },
                                    "& .MuiDataGrid-cell": {
                                        fontSize: "12px",
                                        textAlign: "left",
                                        justifyContent: "left",
                                        whiteSpace: 'normal',
                                        wordBreak: 'break-word',
                                        display: 'block',
                                        paddingTop: '10px',
                                        alignItems: "flex-start",
                                        paddingBottom: '10px',
                                        lineHeight: "1.4 !important",
                                    },
                                    "& .MuiDataGrid-row:hover": {
                                        backgroundColor: "#E8F5E9",
                                    },
                                    "& .row-out-range": {
                                        backgroundColor: "rgba(244, 67, 54, 0.15)",
                                    },
                                    "& .row-out-range:hover": {
                                        backgroundColor: "rgba(244, 67, 54, 0.25)",
                                    },
                                }}
                            />
                            </div>

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
                                    variant="outline-warning"
                                    color="primary"
                                    onClick={handleOpenModal}
                                    disabled={loading}
                                    className="button-order-responsive"
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

