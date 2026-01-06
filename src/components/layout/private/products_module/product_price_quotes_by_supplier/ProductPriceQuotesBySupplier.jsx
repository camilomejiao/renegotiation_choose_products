import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {Button, Col, Row} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { DataGrid } from "@mui/x-data-grid";
import { FaSave } from "react-icons/fa";
import Select from "react-select";
import { TextField } from "@mui/material";

//
import imgPeople from "../../../../../assets/image/addProducts/people1.jpg";

//
import { HeaderImage } from "../../../shared/header_image/HeaderImage";

//Services
import { convocationProductsServices } from "../../../../../helpers/services/ConvocationProductsServices";
import { supplierServices } from "../../../../../helpers/services/SupplierServices";

//Enum
import {
    GeneralStatusDeliveryProductEnum,
    ResponseStatusEnum, RolesEnum,
    StatusTeamProductEnum
} from "../../../../../helpers/GlobalEnum";

//Utils
import { handleError, showAlert } from "../../../../../helpers/utils/utils";
import {
    formatPrice,
    getObservationsSupervisionColumns,
    getStatusProduct
} from "../../../../../helpers/utils/ValidateProductColumns";

//Css
import './ProductPriceQuotesBySupplier.css';

export const ProductPriceQuotesBySupplier = () => {

    const { userAuth } = useOutletContext();
    const navigate = useNavigate();

    const [productList, setProductList] = useState([]);
    const [editedProducts, setEditedProducts] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);

    const [planRaw, setPlanRaw] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [onlyMine, setOnlyMine] = useState(true);

    const [searchQuery, setSearchQuery] = useState("");
    const [loadingTable, setLoadingTable] = useState(false);
    const [loading, setLoading] = useState(false);


    //Columns
    const getProductsPriceQuotesColumns = [
        { field: "id", headerName: "ID", width: 70 },
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
            headerName: "Nombre Producto",
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
        {
            field: "description",
            headerName: "Descripción",
            flex: 1,
            minWidth: 300,
            editable: true,
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
            editable: true,
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
            field: "price",
            headerName: "Valor",
            width: 160,
            editable: true,
            renderCell: (params) => {
                const min = Number(params.row.precio_min ?? 0);
                const max = Number(params.row.precio_max ?? Infinity);
                const current = Number(params.row.price ?? 0);

                return (
                    <TextField
                        type="text"
                        value={current ? formatPrice(current) : ""}
                        fullWidth
                        onChange={(e) => {
                            // solo dígitos
                            const raw = e.target.value.replace(/[^\d]/g, "");
                            const value = raw ? Number(raw) : 0;

                            const newRow = { ...params.row, price: value };
                            // esto re-renderiza la celda; el commit real se hace al salir de la fila
                            params.api.updateRows([newRow]);
                        }}
                        style={{
                            fontSize: "10px"
                        }}
                    />
                );
            },
        },
    ];

    const baseColumns = getProductsPriceQuotesColumns;
    const statusProduct = getStatusProduct();
    const observationsColumns = getObservationsSupervisionColumns();

    const columns = [...baseColumns, ...statusProduct, ...observationsColumns];

    /**
     * Carga los planes de una jornada específica (cuando se selecciona una Jornada).
     */
    const getPlans = async () => {
        try {
            setLoading(true);
            const { data, status } = await convocationProductsServices.getPlansByConvocation(getIdActiveConvocationOfSupplier());
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

    const getIdActiveConvocationOfSupplier = () => {
        return supplierServices.getIdActiveConvocationOfSupplier();
    }

    /**
     * Maneja el cambio de Plan: actualiza form y, si hay valor, carga los productos.
     * @param {{value:number,label:string}|null} option
     */
    const handleSelectedPlan = async (option) => {
        setSelectedPlan(option);
        if (option?.value) {
            await getProductList(option.value, onlyMine);
        } else {
            setProductList([]);
        }
    };

    //
    const getProductList = async (jornadaPlanId, onlyMe) => {
        try {
            setLoadingTable(true);
            const { data, status } = await convocationProductsServices.getProductsBySupplier(userAuth.id, jornadaPlanId, onlyMe);
            if(status === ResponseStatusEnum.OK) {
                const products = await normalizeRows(data);
                setProductList(products);
                setFilteredRows(products);
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
    const normalizeRows = async (payload) => {
        const rows = payload?.data?.productos ?? [];
        try {
            return rows.map((row) => ({
                id: row?.id,
                category: row?.categoria_producto?.nombre,
                name: row?.nombre,
                unit: row?.unidad_medida?.nombre,
                description: row?.producto_especificaciones ?? "",
                brand: row?.producto_marca_comercial ?? "",
                price: row?.producto_valor_unitario ?? 0,
                precio_min: Number(row?.precio_min),
                precio_max: Number(row?.precio_max),
                state: getProductState(row?.faprobado, row?.producto_aprobaciones),
                ...extractObservations(row?.producto_aprobaciones),
            }));
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

        const allApproved = approvalList.every(it => it.aprobado === true);
        const hasRejected = approvalList.some(it => it.aprobado === false);

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

        return rows.reduce((acc, { rol_id, aprobado, comentario, usuario_modificacion, fecha_aprobacion }) => {
            const role = roleMap[rol_id];
            if (!role) return acc;
            let aaprobado = aprobado === true ? 1 : 0;

            acc[role.statusKey] = statusMap[aaprobado] ?? "Sin revisar";
            acc[role.observationKey] = { comentario, usuario_modificacion, fecha_aprobacion };

            return acc;
        }, {});
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
     * Filtra la tabla por texto en varios campos visibles.
     */
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        const filteredData = productList.filter(
            (product) =>
                (product.name || "").toLowerCase().includes(query.toLowerCase()) ||
                (product.description || "").toLowerCase().includes(query.toLowerCase()) ||
                (product.brand || "").toLowerCase().includes(query.toLowerCase()) ||
                (product.unit || "").toLowerCase().includes(query.toLowerCase()) ||
                (product.price || "").toLowerCase().includes(query.toLowerCase()) ||
                (product.state || "").toLowerCase().includes(query.toLowerCase())
        );

        setFilteredRows(filteredData);
    };

    const handleSaveProducts = async () => {
        try {
            setLoading(true);

            const emptyFields = editedProducts.some(r => {
                return !r.description || !r.brand || !r.price
            });

            if (emptyFields) {
                handleError(
                    "Revisa campos",
                    `La descripción, marca y precio son obligatorios, por favor revisa algún producto modificado.`
                );
                setLoading(false);
                return;
            }

            const productos = await transformData(editedProducts);

            let sendData = {
                proveedor_id: userAuth.id,
                productos
            }

            const { data, status } = await convocationProductsServices.saveProductBySupplier(sendData);

            if (status === ResponseStatusEnum.BAD_REQUEST || status === ResponseStatusEnum.INTERNAL_SERVER_ERROR) {
                handleError('Error', 'Error en el formato de productos');
            }

            if(status === ResponseStatusEnum.CREATED) {
                showAlert('Bien hecho!', 'Productos actualizados con éxito.');
                getProductList(selectedPlan.value, onlyMine);
            }
        } catch (error) {
            handleError('Error', 'Error al guardar los productos.');
        } finally {
            setLoading(false);
        }
    };

    //Transformar datos para ajustarlos al formato esperado por la API
    const transformData = async (inputData) => {
        return inputData.map(product => ({
            jornada_producto_id: product.id,
            descripcion: product.description,
            marca: product.brand,
            price: Number(product.price),
        }));
    };

    const handleToggleOnlyMine = (e) => {
        const checked = e.target.checked;
        setOnlyMine(checked);
        if (selectedPlan?.value) {
            getProductList(selectedPlan.value, checked);
        }
    };

    //Cargar datos iniciales
    useEffect(() => {
        getPlans();
    }, []);

    return (
        <>
            <div className="main-container">
                <HeaderImage
                    imageHeader={imgPeople}
                    titleHeader={"¡Empieza a agregar tus productos!"}
                    bannerIcon={''}
                    backgroundIconColor={''}
                    bannerInformation={''}
                    backgroundInformationColor={''}
                />

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

                        {/* Select Plan */}
                        <Col xs={12} md={4}>
                            <Select
                                value={selectedPlan}
                                options={planRaw.map((opt) => ({ value: opt.id, label: opt.plan_nombre }))}
                                placeholder="Selecciona un Plan"
                                onChange={handleSelectedPlan}
                                isClearable
                                isLoading={loading}
                                classNamePrefix="custom-select"
                                className="custom-select w-100"
                            />
                        </Col>

                        <Col xs={12} md={4} className="d-flex justify-content-md-start">
                            <Form.Check
                                type="switch"
                                id="only-mine-switch"
                                label={`Ver solo mis productos (${onlyMine ? 'SI' : 'NO'})`}
                                checked={onlyMine}
                                onChange={handleToggleOnlyMine}
                                reverse
                                className="form-switch-lg switch-compact"
                                disabled={!selectedPlan}
                            />
                        </Col>
                    </Row>

                    {loading && (
                        <div className="overlay">
                            <div className="loader">Guardando Productos...</div>
                        </div>
                    )}

                    <div style={{height: 600, width: "100%"}}>
                        <DataGrid
                            rows={filteredRows}
                            columns={columns}
                            processRowUpdate={handleRowUpdate}
                            editMode="row"
                            pagination
                            loading={loadingTable}
                            pageSize={100}
                            rowsPerPageOptions={[100, 500, 1000]}
                            rowHeight={100}// ↑ más alto para textos multilínea (p.ej. 64, 72, 88)
                            headerHeight={88}
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
                            }}
                        />
                    </div>

                    {/* Botón Guardar */}
                    <div className="d-flex align-items-end mt-3">
                        <Button
                            variant="outline-success"
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