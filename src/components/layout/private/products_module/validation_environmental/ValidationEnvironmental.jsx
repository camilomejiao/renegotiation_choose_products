import { useNavigate, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { FaSave, FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { DataGrid } from "@mui/x-data-grid";
import Select from "react-select";
import debounce from "lodash/debounce";

// Img
import imgPeople from "../../../../../assets/image/addProducts/people1.jpg";

// Components
import { HeaderImage } from "../../../shared/header_image/HeaderImage";
import { Loading } from "../../../shared/loading/Loading";
import { ApprovedDeniedModal } from "../../../shared/Modals/ApprovedDeniedModal";

// Services
import { convocationProductsServices } from "../../../../../helpers/services/ConvocationProductsServices";
import AlertComponent from "../../../../../helpers/alert/AlertComponent";

// Enum
import {
    GeneralStatusDeliveryProductEnum,
    ResponseStatusEnum,
    StatusTeamProductEnum,
} from "../../../../../helpers/GlobalEnum";

// Utils
import { handleError, showAlert } from "../../../../../helpers/utils/utils";
import {
    getEnvironmentalCategories,
    getObservationsEnvironmentalColumns,
    getEnvironmentalCategoriesColumns,
    getStatusProduct,
} from "../../../../../helpers/utils/ValidateProductColumns";

const PAGE_SIZE = 100;
const BATCH_SIZE = 250;

export const ValidationEnvironmental = () => {
    const { userAuth } = useOutletContext();
    const navigate = useNavigate();

    // Estado principal
    const [convocations, setConvocations] = useState([]);
    const [selectedConvocation, setSelectedConvocation] = useState(null);

    const [planRaw, setPlanRaw] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);

    const [formFields, setFormFields] = useState({ typeCall: "", typePlan: "" });

    const [productList, setProductList] = useState([]);
    const [editedProducts, setEditedProducts] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const [rowCount, setRowCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");

    const [loading, setLoading] = useState(false);
    const [loadingTable, setLoadingTable] = useState(false);
    const [environmentalCategoriesColumns, setEnvironmentalCategoriesColumns] = useState([]);

    const [selectedIds, setSelectedIds] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [comment, setComment] = useState("");
    const [action, setAction] = useState("approve");

    // Columnas base + columnas derivadas
    const getBaseColumns = [
        { field: "id", headerName: "ID", width: 70 },
        {
            field: "category",
            headerName: "CATEGORIA",
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
            field: "description",
            headerName: "Descripción",
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
            field: "brand",
            headerName: "Marca",
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
            field: "unit",
            headerName: "Unidad",
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
        { field: "price_min", headerName: "Precio Min", width: 100},
        { field: "price_max", headerName: "Precio Max", width: 100},
        { field: "price", headerName: "VALOR", width: 100},
    ];

    const baseColumns = getBaseColumns;
    const statusProduct = getStatusProduct();
    const observationsColumns = getObservationsEnvironmentalColumns();

    const columns = [
        ...baseColumns,
        ...statusProduct,
        ...observationsColumns,
        ...environmentalCategoriesColumns,
    ];

    /**
     * Obtiene las jornadas disponibles para el selector de Jornada.
     */
    const getConvocations = async () => {
        setLoading(true);
        try {
            const { data, status } = await convocationProductsServices.getConvocations();
            if (status === ResponseStatusEnum.OK) {
                setConvocations(data?.data?.jornadas);
            }
        } catch (error) {
            console.error("Error al obtener la lista de jornadas:", error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Carga los planes de una jornada específica (cuando se selecciona una Jornada).
     * @param {number} convocationId
     */
    const getPlans = async (convocationId) => {
        try {
            setLoading(true);
            const { data, status } = await convocationProductsServices.getPlansByConvocation(convocationId);
            if (status === ResponseStatusEnum.OK) {
                setPlanRaw(data?.data?.planes || []);
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

    /**
     * Maneja el cambio de Jornada: limpia plan, setea campos del formulario
     * y consulta los planes de la jornada seleccionada.
     * @param {{value:number,label:string}|null} option
     */
    const handleSelectedConvocation = async (option) => {
        setSelectedConvocation(option);
        setSelectedPlan(null);
        setFormFields((prev) => ({
            ...prev,
            typeCall: option?.value ?? "",
            typePlan: "",
        }));
        setPlanRaw([]);
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
            await getProductList(1, PAGE_SIZE,option.value);
        } else {
            setProductList([]);
            setFilteredData([]);
        }
    };

    /**
     * Obtiene los productos de un plan (para la tabla).
     * @param {number} planId
     */
    const getProductList = async (pageToFetch = 1, sizeToFetch = PAGE_SIZE, planId) => {
        setLoadingTable(true);
        try {
            const { data, status } = await convocationProductsServices.getProductByConvocationAndPlan(pageToFetch, sizeToFetch,planId);
            if (status === ResponseStatusEnum.OK) {
                const products = await normalizeRows(data?.data?.productos || []);
                setProductList(products);
                setFilteredData(products);
                setRowCount(data?.data?.total_productos);
            }
        } catch (error) {
            console.error("Error al obtener la lista de productos:", error);
        } finally {
            setLoadingTable(false);
        }
    };

    /**
     * Convierte la lista cruda de productos al formato que usa el DataGrid.
     * Incluye mapeo de campos visibles y los campos dinámicos ambientales.
     * @param {Array<object>} data
     * @returns {Promise<Array<object>>}
     */
    const normalizeRows = async (data) => {
        try {
            const environmentalCategories = await getEnvironmentalCategories();

            return data.map((row) => ({
                id: row?.id,
                name: row?.nombre,
                description: row?.especificacion_tecnicas ?? " - ",
                brand: row?.marca_comercial ?? " - ",
                unit: row?.unidad_medida?.nombre ?? " - ",
                category: row?.categoria_producto?.nombre ?? " - ",
                price_min: `$ ${row?.precio_min.toLocaleString()}`,
                price_max: `$ ${row?.precio_max.toLocaleString()}`,
                price: row?.precio ? `$ ${row?.precio.toLocaleString()}` : 0,
                state: getProductState(row?.uaprobado, row?.faprobado, row?.aprobado),
                ...extractObservations(row),
                ...buildEnvironmentalData(row, environmentalCategories),
                ...extractCountEnvironmental(row),
            }));
        } catch (error) {
            console.error("Error al normalizar filas:", error);
            return [];
        }
    };

    const toISODate = (val) => (typeof val === "string" ? val.split("T")[0] : "");
    const n01 = (v) => {
        const n = Number(v);
        return Number.isNaN(n) ? null : n;
    };

    // Estado general
    const getProductState = (approvUser, approvDate, status) => {
        const APPROVED_ID = Number(StatusTeamProductEnum.APPROVED.id); // normalmente 1
        const DENIED_ID   = Number(StatusTeamProductEnum.DENIED.id);   // normalmente 0

        const st = n01(status);
        const hasUser = Boolean(approvUser);
        const hasDate = Boolean(approvDate);

        if (st === APPROVED_ID && hasUser && hasDate) {
            return GeneralStatusDeliveryProductEnum.APPROVED;
        }

        if (st === DENIED_ID && hasUser && hasDate) {
            return GeneralStatusDeliveryProductEnum.REFUSED;
        }

        return GeneralStatusDeliveryProductEnum.PENDING_APPROVAL;
    };


    /**
     * Debounce para registrar cambios en celdas (evita spam de renders).
     * @param {string} field - nombre del campo a actualizar
     * @param {object} params - params de MUI DataGrid
     * @param {any} newValue - nuevo valor
     */
    const debouncedHandleChange = debounce((field, params, newValue) => {
        // Actualiza la celda en el DataGrid
        params.api.updateRows([{ id: params.row.id, [field]: newValue }]);

        // Registra cambios en el arreglo de editados
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

    /**
     * Crea un handler para Selects de columnas dinámicas.
     * @param {string} field
     * @returns {(params:any, newValue:any) => void}
     */
    const handleSelectChange = (field) => (params, newValue) => {
        debouncedHandleChange(field, params, newValue);
    };

    /**
     * Handler genérico para inputs custom (ambientales, etc.)
     * @param {object} params
     * @param {string} fieldKey
     * @param {any} newValue
     */
    const handleCustomChange = (params, fieldKey, newValue) => {
        debouncedHandleChange(fieldKey, params, newValue);
    };

    /**
     * Obtiene y setea las columnas dinámicas ambientales.
     */
    const getEnvironmentalColumns = async () => {
        const columns = await getEnvironmentalCategoriesColumns(handleSelectChange, handleCustomChange);
        setEnvironmentalCategoriesColumns(columns);
    };

    /**
     * Normaliza "ambiental" para aceptar objeto o string JSON.
     * @param {object|string|null|undefined} raw
     * @returns {object} objeto ambiental { "1": 0|1, ... }
     */
    const getAmbientalObj = (raw) => {
        if (!raw) return {};
        if (typeof raw === "object") return raw;

        const slice = raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1);
        try {
            return JSON.parse(slice);
        } catch {
            return {};
        }
    };

    /**
     * Construye un objeto con los códigos ambientales como keys dinámicas,
     * utilizando las categorías como guía.
     * @param {object} row
     * @param {Array<{codigo:string}>} categories
     */
    const buildEnvironmentalData = (row, categories) => {
        const amb = getAmbientalObj(row?.ambiental);

        return categories.reduce((acc, { codigo }) => {
            const k = String(codigo);
            acc[k] = String(amb[k] ?? 0);
            return acc;
        }, {});
    };

    /**
     * (Opcional) Construye un map de observaciones por rol. Seguro si rows está vacío.
     * @param {Array} rows
     */
    const extractObservations = (row = {}) => {
        const APPROVED_ID = Number(StatusTeamProductEnum.APPROVED.id); // 1
        const DENIED_ID   = Number(StatusTeamProductEnum.DENIED.id);   // 0

        const st = n01(row?.aprobado);
        const hasUser = Boolean(row?.uaprobado);
        const hasDate = Boolean(row?.faprobado);

        let statusLabel = "Pendiente"; // por defecto
        if (st === APPROVED_ID && hasUser && hasDate) {
            statusLabel = StatusTeamProductEnum.APPROVED.label;
        } else if (st === DENIED_ID && hasUser && hasDate) {
            statusLabel = StatusTeamProductEnum.DENIED.label;
        }

        return {
            status_environmental: statusLabel,
            observations_environmental: {
                comentario : row?.motivo_aprobacion ?? "",
                funcionario: row?.uaprobado ?? "",
                fecha      : toISODate(row?.faprobado) // "" si viene null/undefined
            },
        };
    };

    /**
     * (Opcional) Extrae el límite ambiental seleccionado (si existe en la fila).
     * @param {object} row
     */
    const extractCountEnvironmental = (row = {}) => {
        if (!row || !row?.cantidad_ambiental) {
            return { customValue: "", selectedCategory: "" };
        }
        const { cant, ambiental_key } = row?.cantidad_ambiental;
        return { customValue: cant ?? "", selectedCategory: ambiental_key ?? "" };
    };

    /**
     * MUI DataGrid: procesa la actualización de una fila completa (modo "row").
     * Guarda los cambios en `editedProducts` para enviar luego.
     * @param {object} newRow
     * @param {object} oldRow
     */
    const handleRowUpdate = (newRow, oldRow) => {
        if (JSON.stringify(newRow) !== JSON.stringify(oldRow)) {
            setEditedProducts((prevState) => {
                const index = prevState.findIndex((product) => product.id === newRow.id);
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

    /**
     * Maneja la selección de filas en la tabla.
     * @param {Array<number>} newSelection
     */
    const handleSelectionChange = (newSelection) => {
        setSelectedIds(newSelection);
    };

    /**
     * Abre el modal de aprobación/denegación validando que haya selección.
     */
    const handleOpenModal = () => {
        if (selectedIds.length === 0) {
            showInfo("Por favor seleccione al menos un producto.");
            return;
        }
        setOpenModal(true);
    };

    /**
     * Cierra el modal de aprobación y limpia estado local de acción/comentario.
     */
    const handleCloseModalApproved = () => {
        setOpenModal(false);
        setComment("");
        setAction("approve");
    };

    /**
     * Crea el payload para aprobación por lotes.
     */
    const createApprovalPayload = (idsBatch, estado, comentario) => ({
        ids: idsBatch,
        estado,
        comentario: comentario ? comentario : "Productos aprobados exitosamente por ambiental!",
    });

    /**
     * Llama al servicio de aprobación por lotes.
     * @param {object} payload
     * @returns {Promise<boolean>}
     */
    const sendBatchApproval = async (payload) => {
        try {
            const { status } = await convocationProductsServices.approveOrDennyEnvironmental(payload);
            if(status === ResponseStatusEnum.OK) {
                return ResponseStatusEnum.OK;
            }

            return ResponseStatusEnum.BAD_REQUEST;
        } catch (error) {
            console.error("Error sending batch approval:", error);
            return false;
        }
    };

    /**
     * Procesa los IDs seleccionados en lotes (batch) para aprobar/denegar.
     * @param {Array<number>} ids
     * @param {0|1} estado
     * @param {string} comentario
     */
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

    /**
     * Acción principal de aprobar/denegar los productos seleccionados.
     * @param {Array<number>} ids
     * @param {'approve'|'deny'} accion
     * @param {string} comment
     */
    const handleApproveByAudit = async (ids, accion, comment) => {
        setLoading(true);

        const estado = accion === "approve" ? 1 : 0;
        const label = accion === "approve" ? "Aprobado" : "Denegado";

        try {
            await processBatches(ids, estado, comment);
            showAlert("Bien hecho!", `Producto ${label} exitosamente!`);
            if (selectedPlan?.value) {
                await getProductList(1, PAGE_SIZE, selectedPlan.value);
            }
            handleCloseModalApproved();
        } catch (error) {
            console.error("Unexpected error during approval:", error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Obtiene solo los códigos (keys) de las categorías ambientales.
     * @returns {Promise<string[]>}
     */
    const getEnvironmentalCategoryKeys = async () => {
        const categories = await getEnvironmentalCategories();
        return categories.map((category) => category.codigo);
    };

    /**
     * Construye el objeto "ambiental" a partir de una fila y la lista de keys.
     * @param {object} product
     * @param {Array<string>} keys
     */
    const buildData = (product, keys) => {
        return Object.fromEntries(keys.map((key) => [key, parseInt(product[key]) || 0]));
    };

    /**
     * Prepara el arreglo de productos (editados) para ser enviado al backend.
     * @param {Array<object>} inputData
     */
    const transformData = async (inputData) => {
        const environmentalKeys = await getEnvironmentalCategoryKeys();

        return inputData.map((product) => ({
            id: product?.id,
            ambiental: buildData(product, environmentalKeys),
            cantidad_ambiental: {
                cant: parseInt(product.customValue) || 0,
                ambiental_key: product.selectedCategory || "",
            },
        }));
    };

    /**
     * Guarda los cambios realizados en la tabla (solo los editados).
     */
    const handleSaveProducts = async () => {
        try {
            setLoading(true);
            if (editedProducts.length === 0) {
                AlertComponent.warning("", "No hay productos modificados para guardar.");
                return;
            }

            const productos = await transformData(editedProducts);

            let sendData = {
                jornada_plan: Number(formFields.typePlan),
                productos
            }

            const { status } = await convocationProductsServices.updateValidationEnvironmental(sendData);

            if(status === ResponseStatusEnum.OK) {
                showAlert("Bien hecho!", "Productos actualizados con éxito.");
                setEditedProducts([]);
            }
        } catch (error) {
            handleError("Error", "Error al guardar los productos.");
        } finally {
            setLoading(false);
        }
    };

    /**
     * Muestra un alert informativo consistente.
     */
    const showInfo = (message, subtitle = "") => AlertComponent.info(subtitle, message);

    /**
     * Filtra la tabla por texto en varios campos visibles.
     */
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        const filtered = productList.filter(
            (product) =>
                (product.name || "").toLowerCase().includes(query.toLowerCase()) ||
                (product.description || "").toLowerCase().includes(query.toLowerCase()) ||
                (product.brand || "").toLowerCase().includes(query.toLowerCase()) ||
                (product.state || "").toLowerCase().includes(query.toLowerCase())
        );

        setFilteredData(filtered);
    };

    /**
     * Submit del modal de aprobación/denegación.
     */
    const handleApproveDenySubmit = async () => {
        try {
            await handleApproveByAudit(selectedIds, action, comment);
        } catch (error) {
            console.error("Error en la aprobación:", error);
        }
    };

    // Carga inicial
    useEffect(() => {
        getConvocations();
        getEnvironmentalColumns();
    }, []);

    useEffect(() => {
        if (!selectedPlan?.value) return;
        getProductList(page + 1, pageSize, selectedPlan?.value);
    }, [page, pageSize, selectedPlan]);

    return (
        <>
            <div className="main-container">
                <HeaderImage imageHeader={imgPeople} titleHeader="¡Listado de productos!" />

                <div className="container mt-lg-3">
                    <Row className="gy-2 align-items-center mt-3 mb-3">
                        <Col xs={12} md={4}>
                            <input
                                type="text"
                                placeholder="Buscar..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="form-control"
                            />
                        </Col>

                        {/* Select Jornada */}
                        <Col xs={12} md={4}>
                            <Select
                                value={selectedConvocation ?? null}
                                options={convocations?.map((opt) => ({ value: opt.id, label: opt.nombre }))}
                                placeholder="Selecciona una Jornada"
                                onChange={handleSelectedConvocation}
                                isClearable
                                classNamePrefix="custom-select"
                                className="custom-select w-100"
                                styles={{
                                    placeholder: (base) => ({ ...base, color: "#6c757d" }),
                                    singleValue: (base) => ({ ...base, color: "#212529" }),
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
                    </Row>

                    {loading && <Loading fullScreen text="Cargando..." />}

                    <div style={{ height: 600, width: "100%" }}>
                        <DataGrid
                            loading={loadingTable}
                            columns={columns}
                            rows={filteredData}
                            checkboxSelection
                            onRowSelectionModelChange={handleSelectionChange}
                            processRowUpdate={handleRowUpdate}
                            editMode="row"
                            paginationMode="server"
                            rowCount={rowCount}
                            paginationModel={{ page, pageSize }}
                            onPaginationModelChange={({ page, pageSize }) => {
                                setPage(page);
                                setPageSize(pageSize);
                            }}
                            rowsPerPageOptions={[10, 50, 100]}
                            rowHeight={64}// ↑ más alto para textos multilínea (p.ej. 64, 72, 88)
                            headerHeight={48}
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
                                    fontSize: "12px",
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
                        <Button
                            variant="outline-warning"
                            color="primary"
                            onClick={handleOpenModal}
                            disabled={loading}
                        >
                            <FaThumbsUp /> Aprobar / <FaThumbsDown /> Denegar
                        </Button>

                        <Button variant="outline-success" onClick={handleSaveProducts} disabled={loading}>
                            <FaSave /> {loading ? "Guardando..." : "Guardar Productos"}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};


