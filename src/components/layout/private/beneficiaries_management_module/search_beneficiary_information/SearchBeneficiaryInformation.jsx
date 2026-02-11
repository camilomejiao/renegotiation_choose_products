import { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { Card, Row, Col, Button, Container } from "react-bootstrap";
import { FaFileAlt, FaListAlt, FaMoneyCheckAlt, FaUsers, FaUserTag } from "react-icons/fa";
import { SectionHeader } from "../../../shared/section_header/SectionHeader";
import { Autocomplete, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

//Components
import { HeaderImage } from "../../../shared/header_image/HeaderImage";
import imgDCSIPeople from "../../../../../assets/image/addProducts/people1.jpg";
import imgAdd from "../../../../../assets/image/payments/imgPay.png";
import { Loading } from "../../../shared/loading/Loading";

//Enum
import { ResponseStatusEnum } from "../../../../../helpers/GlobalEnum";

//Services
import { locationServices } from "../../../../../helpers/services/LocationServices";
import { beneficiaryInformationServices } from "../../../../../helpers/services/BeneficiaryInformationServices";

//Helpers
import AlertComponent from "../../../../../helpers/alert/AlertComponent";

//
const initialValues = {
    identification: "",
    cub: "",
    first_name: "",
    last_name: "",
    depto: null,
    muni: null,
    state: null,
    activity: null,
};

//
const onlyNumbersRegex = /^\d*$/;
const onlyTextRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/;

//
const validationSchema = yup.object().shape({
    identification: yup
        .string()
        .matches(onlyNumbersRegex, "Solo debes agregar números")
        .notRequired(),
    cub: yup
        .string()
        .matches(onlyNumbersRegex, "Solo debes agregar números")
        .notRequired(),
    first_name: yup
        .string()
        .matches(onlyTextRegex, "Solo debes agregar texto")
        .notRequired(),
    last_name: yup
        .string()
        .matches(onlyTextRegex, "Solo debes agregar texto")
        .notRequired(),
    depto: yup.mixed().nullable(),
    muni: yup.mixed().nullable(),
    state: yup.mixed().nullable(),
    activity: yup.mixed().nullable(),
});


const money = (n) => Number(n || 0).toLocaleString("es-CO", { style: "currency", currency: "COP" });


export const SearchBeneficiaryInformation = () => {
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("");
    const [deptOptions, setDeptOptions] = useState([]);
    const [muniOptions, setMuniOptions] = useState([]);
    const [loadingMunis, setLoadingMunis] = useState(false);
    const [stateOptions, setStateOptions] = useState([]);
    const [activityOptions, setActivityOptions] = useState([]);

    const [searchParams, setSearchParams] = useState(null);
    const [rowCount, setRowCount] = useState(0);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(100);

    const [beneficiaryInfo, setBeneficiaryInfo] = useState(null);
    const [movements, setMovements] = useState({
        datos_cub: null,
        estado_cuenta: [],
        resumen_pagos: [],
    });

    // cache de municipios por depto
    const muniCacheRef = useRef(new Map());

    /**
     * Carga las opciones iniciales requeridas por los filtros:
     * - Departamentos
     * - Estados de CUB
     * - Actividades CUB
     *
     * Internamente usa una función `load` para estandarizar:
     * - activación/desactivación del loader general
     * - manejo del texto informativo
     * - asignación del resultado al estado correspondiente
     */
    const fetchOptions = async () => {
        const load = async (fn, set) => {
            try {
                setLoading(true);
                setLoadingText("Cargando datos iniciales...");
                const { data, status } = await fn();
                if (status === ResponseStatusEnum.OK) {
                    set(data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        await load(() => locationServices.getDeptos(), setDeptOptions);
        await load(() => beneficiaryInformationServices.getCubStatus(), setStateOptions);
        await load(() => beneficiaryInformationServices.getCubActivity(), setActivityOptions);
    };

    /**
     * Configuración de Formik:
     * - initialValues: valores iniciales del formulario
     * - validationSchema: validaciones con Yup
     * - onSubmit:
     *   1) Valida que exista al menos un filtro/campo diligenciado.
     *   2) Si no hay filtros, muestra un warning y detiene el flujo.
     *   3) Si hay filtros, construye `searchParams` para disparar la Búsqueda.
     *
     * Nota: El efecto `useEffect([page, pageSize, searchParams])` es el que
     * finalmente ejecuta la consulta cuando `searchParams` cambia.
     */
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            const {
                identification,
                cub,
                first_name,
                last_name,
                depto,
                muni,
                state,
                activity,
            } = values;

            // Validación: al menos un campo / filtro diligenciado
            const hasAnyValue =
                (identification && identification.trim() !== "") ||
                (cub && cub.trim() !== "") ||
                (first_name && first_name.trim() !== "") ||
                (last_name && last_name.trim() !== "") ||
                !!depto ||
                !!muni ||
                !!state ||
                !!activity;

            if (!hasAnyValue) {
                AlertComponent.warning(
                    "Debe diligenciar al menos un campo o filtro para buscar."
                );
                return;
            }

            setBeneficiaryInfo('');
            setMovements({
                datos_cub: null,
                estado_cuenta: [],
                resumen_pagos: [],
            });

            setSearchParams({
                cub,
                identification,
                first_name,
                last_name,
                state,
                activity,
                depto,
                muni
            });
        },
    });

    /**
     * Ejecuta la Búsqueda de Información básica del titular/beneficiario con paginación.
     *
     * @param {number} pageSize - Cantidad de registros por página.
     * @param {number} page - Página (1-based) solicitada al backend.
     * @param {string} cub - CUB (opcional).
     * @param {string} identification - Identificación (opcional).
     * @param {string} first_name - Nombres (opcional).
     * @param {string} last_name - Apellidos (opcional).
     * @param {string|null} state - Estado CUB (en este caso se envía el nombre).
     * @param {string|null} activity - Actividad CUB (en este caso se envía el nombre).
     * @param {string|null} depto - Departamento (en este caso se envía el nombre).
     * @param {number|null} muni - Municipio (en este caso se envía el id).
     *
     * Flujo:
     * - Activa loader general y texto "Buscando..."
     * - Llama al servicio `searchForUserOrCubInformation`
     * - Normaliza filas con `normalizeInitialInformationRows`
     * - Actualiza `rowCount` para paginación server-side
     */
    const getBeneficiaryInformation = async (
        pageSize = 100,
        page = 1,
        cub,
        identification,
        first_name,
        last_name,
        state,
        activity,
        depto,
        muni
    ) => {
        try {
            setLoading(true);
            setLoadingText("Buscando...");
            const {data, status} = await beneficiaryInformationServices
                .searchForUserOrCubInformation(
                    pageSize,
                    page,
                    cub,
                    identification,
                    first_name,
                    last_name,
                    state,
                    activity,
                    depto,
                    muni
                );

            if (status === ResponseStatusEnum.OK) {
                setRowCount(data?.count);
                setBeneficiaryInfo(normalizeInitialInformationRows(data?.results));
            }

        } catch (error) {
            console.error(error);
            AlertComponent.error("Error al buscar la Información del beneficiario.");
        } finally {
            setLoading(false);
        }
    }

    /**
     * Carga municipios de un departamento (por id) con cache en memoria.
     *
     * - Si no llega deptId:
     *   - Limpia opciones de municipios
     *   - Resetea el campo `muni` en Formik
     *
     * - Si llega deptId:
     *   - Revisa si ya existe en `muniCacheRef`:
     *     - Si NO existe, consulta al servicio `getMunis(deptId)` y guarda en cache.
     *     - Si existe, reutiliza la lista cacheada.
     *   - Actualiza `muniOptions` con la lista resultante.
     *   - Si el municipio actualmente seleccionado no pertenece al nuevo depto, lo limpia.
     */
    const loadMunicipalities = async (deptId) => {
        if (!deptId) {
            setMuniOptions([]);
            formik.setFieldValue("muni", null);
            return;
        }

        try {
            setLoadingMunis(true);

            if (!muniCacheRef.current.has(deptId)) {
                const { data, status } = await locationServices.getMunis(deptId);
                if (status === ResponseStatusEnum.OK) {
                    muniCacheRef.current.set(deptId, data);
                } else {
                    muniCacheRef.current.set(deptId, []);
                }
            }

            const list = muniCacheRef.current.get(deptId) || [];
            setMuniOptions(list);

            const current = formik.values.muni;
            if (!current || !list.some((m) => m.id === current.id)) {
                formik.setFieldValue("muni", null);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingMunis(false);
        }
    };

    /**
     * Maneja el cambio de Departamento en el Autocomplete.
     * - Actualiza el valor `depto` en Formik
     * - Dispara la carga de municipios para ese depto
     */
    const handleDeptChange = async (_evt, value) => {
        formik.setFieldValue("depto", value);
        await loadMunicipalities(value?.id || null);
    };

    /**
     * Maneja el cambio de Municipio en el Autocomplete.
     * - Actualiza el valor `muni` en Formik
     */
    const handleMuniChange = (_evt, value) => {
        formik.setFieldValue("muni", value);
    };

    /**
     * Limpia el formulario y los resultados.
     * - Resetea Formik (valores y touched)
     * - Limpia Información básica (`beneficiaryInfo`)
     * - Limpia movimientos/detalle (`movements`)
     */
    const handleClear = () => {
        formik.resetForm();
        setBeneficiaryInfo(null);
        setMovements(null);
    };

    /**
     * Exportación (mock).
     * - Valida que exista Información cargada para exportar.
     * - Actualmente solo imprime por consola y muestra alerta.
     * Nota: El botón está comentado en el UI.
     */
    const handleExport = () => {
        if (!beneficiaryInfo) {
            AlertComponent.warning("Primero realice una Búsqueda para exportar la Información.");
            return;
        }

        console.log("Exportar Información de: ", beneficiaryInfo);
        AlertComponent.success("Exportación generada (mock).");
    };

    /**
     * Exportación (mock).
     * - Valida que exista Información cargada para exportar.
     * - Actualmente solo imprime por consola y muestra alerta.
     * Nota: El botón está comentado en el UI.
     */
    const showDetails = async (params) => {
        try {
            setLoading(true);
            setLoadingText("Cargando detalles del beneficiario...");
            const {data, status} = await beneficiaryInformationServices.getDetailInformation(params.cub);
            if(status ===  ResponseStatusEnum.OK) {
                const normalized = normalizeDetailData(data);
                setMovements(normalized);
            }
            if(status !==  ResponseStatusEnum.OK) {
                AlertComponent.info("No se pudieron obtener los datos deseados.");
            }
        } catch (error) {
            console.error(error);
            AlertComponent.error("Error al obtener la informacion de detalle.");
        } finally {
            setLoading(false);
        }

    }

    /**
     * Renderiza la celda de acciones en la tabla principal (info básica).
     * - Incluye botón "Detalles" que dispara `showDetails(row)`
     */
    const renderActionsCell = (params) => {
        const row = params.row;
        return (
            <div>
                {/* Detalles */}
                <Button
                    variant="outline-primary"
                    onClick={() => {
                        showDetails(row);
                    }}
                    title="Ver detalles"
                >
                    Detalles
                </Button>

            </div>
        )
    }

    //
    const ColumnsInitialInformationTable  = [
        { field: "id", headerName: "N°", width: 80 },
        { field: "cub", headerName: "Cub", width: 100 },
        { field: "cub_state", headerName: "Estado Cub", width: 100 },
        { field: "identification", headerName: "Identificación", width: 150 },
        { field: "name", headerName: "Nombre completo", width: 270 },
        { field: "depto", headerName: "Departamento", width: 130 },
        { field: "muni", headerName: "Municipio", width: 200 },
        { field: "village", headerName: "Vereda", width: 150 },
        {
            field: "actions",
            headerName: "Detalles",
            width: 150,
            renderCell: renderActionsCell,
            sortable: false,
            filterable: false,
        },
    ];

    /**
     * Normaliza la respuesta del backend para la tabla de Información básica.
     * Convierte `results` en filas compatibles con DataGrid y sus columnas.
     *
     * @param {Array} data - Lista cruda desde el backend.
     * @returns {Array} Filas normalizadas para DataGrid.
     */
    const normalizeInitialInformationRows = (data) => {
        return data.map((row) => ({
            id: row.id,
            cub: row?.cub_id,
            cub_state: row?.estado_cub,
            identification: row?.identificacion,
            name: row?.nombre_completo,
            depto: row?.departamento,
            muni: row?.municipio,
            village: row?.vereda
        }));
    };

    const AccountStatementColumns = [
        { field: "id", headerName: "N°", width: 120 },
        { field: "component", headerName: "Componente", width: 270 },
        { field: "pay", headerName: "Pago", width: 270 },
        { field: "debt", headerName: "Saldo", width: 270 },
        { field: "total", headerName: "Total", width: 270 },
    ];

    const PaymentSummaryColumns = [
        { field: "id", headerName: "N°", width: 80 },
        { field: "agreement", headerName: "Contrato", width: 180 },
        { field: "component", headerName: "Componente", width: 250 },
        { field: "secondary", headerName: "Secundario", width: 200 },
        { field: "payment_identification", headerName: "Identificación pago", width: 150 },
        { field: "paid_holder", headerName: "Titular pago", width: 300 },
        { field: "paid", headerName: "Pagado", width: 90 },
        { field: "pay", headerName: "Pago", width: 170 },
    ];

    /**
     * Normaliza el bloque `datos_cub` del detalle.
     * Asegura estructura consistente, evita null/undefined y aplica valores por defecto.
     *
     * @param {Object|null} datos - Objeto crudo del backend.
     * @returns {Object|null} Objeto normalizado o null si no existe.
     */
    const normalizeDatosCub = (datos) => {
        if (!datos) return null;

        return {
            cub: datos.cub_id,
            estado_cub: datos.estado_cub?.trim() || "",
            departamento: datos.departamento || "",
            municipio: datos.municipio || "",
            vereda: datos.vereda || "",
            actividad: datos.actividad || "",
            identificacion: datos.identificacion || "",
            nombre_completo: datos.nombre_completo || "",
            sexo: datos.sexo || "",
            plan: datos.plan || "",
            Línea: datos.Línea || "",
            restriccion: datos.restriccion || "",
            nombre_completo_beneficiario: datos.nombre_completo_beneficiario || "NO APLICA",
            identificacion_beneficiario: datos.identificacion_beneficiario || "NO APLICA",
            sexo_beneficiario: datos.sexo_beneficiario || "NO APLICA",
        };
    };

    /**
     * Normaliza el arreglo `estado_cuenta` y convierte valores numéricos a moneda COP.
     * Adicionalmente conserva versiones numéricas (payNum, debtNum, totalNum) para cálculos posteriores.
     *
     * @param {Array} data - Lista cruda de estado de cuenta.
     * @returns {Array} Filas normalizadas para DataGrid.
     */
    const normalizeAccountStatementRows = (data = []) => {
        if (!Array.isArray(data)) return [];

        return data.map((row, index) => {
            const payNum = Number(row?.pago || 0);
            const debtNum = Number(row?.deuda || 0);
            const totalNum = Number(row?.total || 0);

            return {
                id: index + 1,
                component: row?.componente || "",

                payNum,
                debtNum,
                totalNum,

                pay: money(payNum),
                debt: money(debtNum),
                total: money(totalNum),
            };
        });
    };

    /**
     * Agrega una fila adicional "TOTAL" al final del estado de cuenta.
     * Suma los valores numéricos (payNum, debtNum, totalNum) de todas las filas.
     *
     * @param {Array} rows - Filas de estado de cuenta ya normalizadas.
     * @returns {Array} Filas + fila total al final.
     */
    const addTotalRow = (rows = []) => {
        const totals = rows.reduce(
            (acc, r) => {
                acc.pay += Number(r.payNum || 0);
                acc.debt += Number(r.debtNum || 0);
                acc.total += Number(r.totalNum || 0);
                return acc;
            },
            { pay: 0, debt: 0, total: 0 }
        );

        return [
            ...rows,
            {
                id: "TOTAL",
                component: "",
                pay: money(totals.pay),
                debt: money(totals.debt),
                total: money(totals.total),
                // (opcionales por si luego necesitas validar)
                payNum: totals.pay,
                debtNum: totals.debt,
                totalNum: totals.total,
            },
        ];
    };

    const rows = addTotalRow(movements?.estado_cuenta || []);


    /**
     * Normaliza el arreglo `resumen_pagos` del detalle.
     * Convierte campos a string seguros y formatea `pago` a moneda COP.
     *
     * @param {Array} data - Lista cruda de resumen de pagos.
     * @returns {Array} Filas normalizadas para DataGrid.
     */
    const normalizePaymentSummaryRows = (data = []) => {
        if (!Array.isArray(data)) return [];

        return data.map((row, index) => ({
            id: index + 1,
            agreement: row?.nombre_contrato ?? "",
            component: row?.componente ?? "",
            secondary: row?.secundario ?? "",
            payment_identification: row?.identificacion_pago ?? "",
            paid_holder: row?.titular_pago ?? "",
            paid: row?.es_pagado ?? "",
            pay: Number(row?.pago || 0).toLocaleString("es-CO", {
                style: "currency",
                currency: "COP",
            }),
        }));
    };

    /**
     * Normaliza la respuesta completa del endpoint de detalle.
     * Unifica en un solo objeto los tres bloques usados por la UI:
     * - datos_cub
     * - estado_cuenta
     * - resumen_pagos
     *
     * @param {Object} data - Respuesta cruda del backend.
     * @returns {Object} Objeto normalizado para setear en `movements`.
     */
    const normalizeDetailData = (data) => ({
        datos_cub: normalizeDatosCub(data?.datos_cub),
        estado_cuenta: normalizeAccountStatementRows(data?.estado_cuenta),
        resumen_pagos: normalizePaymentSummaryRows(data?.resumen_pagos),
    });

    useEffect(() => {
        fetchOptions();
    }, []);

    useEffect(() => {
        if (!searchParams) return;

        getBeneficiaryInformation(
            pageSize,
            page + 1,
            searchParams.cub,
            searchParams.identification,
            searchParams.first_name,
            searchParams.last_name,
            searchParams.state?.nombre,
            searchParams.activity?.nombre,
            searchParams.depto?.nombre,
            searchParams.muni?.id
        );
    }, [page, pageSize, searchParams]);

    return (
        <>
        <div className="main-container">
            <HeaderImage
                imageHeader={imgDCSIPeople}
                titleHeader={"Búsqueda de Titulares"}
                bannerIcon={imgAdd}
                backgroundIconColor={"#2148C0"}
                bannerInformation={""}
                backgroundInformationColor={"#1ff675"}
            />

            <Container>
                {/* Card de Búsqueda */}
                <Card className="mt-4 shadow-sm">
                    <Card.Body>
                        <SectionHeader
                            icon={FaFileAlt}
                            title="Búsqueda de Titulares"
                            subtitle="Acceda a instructivos, formatos y documentos necesarios para la información del titular"
                        />

                        <form onSubmit={formik.handleSubmit}>
                            {/* Bloque 1: campos de texto */}
                            <div className="row g-3 mt-3">
                                {/* Identificacion */}
                                <div className="col-md-3">
                                    <TextField
                                        fullWidth
                                        label="Cédula"
                                        placeholder="Ingrese cédula"
                                        {...formik.getFieldProps("identification")}
                                        error={
                                            formik.touched.identification &&
                                            Boolean(formik.errors.identification)
                                        }
                                        helperText={
                                            formik.touched.identification &&
                                            formik.errors.identification
                                        }
                                    />
                                </div>

                                {/* Cub */}
                                <div className="col-md-3">
                                    <TextField
                                        fullWidth
                                        label="CUB"
                                        placeholder="Ingrese CUB"
                                        {...formik.getFieldProps("cub")}
                                        error={formik.touched.cub && Boolean(formik.errors.cub)}
                                        helperText={formik.touched.cub && formik.errors.cub}
                                    />
                                </div>

                                {/* Nombre */}
                                <div className="col-md-3">
                                    <TextField
                                        fullWidth
                                        label="Nombre"
                                        placeholder="Ingrese nombre"
                                        {...formik.getFieldProps("first_name")}
                                        error={
                                            formik.touched.first_name &&
                                            Boolean(formik.errors.first_name)
                                        }
                                        helperText={
                                            formik.touched.first_name && formik.errors.first_name
                                        }
                                    />
                                </div>

                                {/* Apellido */}
                                <div className="col-md-3">
                                    <TextField
                                        fullWidth
                                        label="Apellido"
                                        placeholder="Ingrese apellido"
                                        {...formik.getFieldProps("last_name")}
                                        error={
                                            formik.touched.last_name &&
                                            Boolean(formik.errors.last_name)
                                        }
                                        helperText={
                                            formik.touched.last_name && formik.errors.last_name
                                        }
                                    />
                                </div>
                            </div>

                            {/* Bloque 2: filtros */}
                            <div className="row g-3 mt-4">
                                {/* Departamento */}
                                <div className="col-md-3">
                                    <Autocomplete
                                        options={deptOptions}
                                        value={formik.values.depto}
                                        onChange={handleDeptChange}
                                        getOptionLabel={(o) => o?.nombre ?? ""}
                                        isOptionEqualToValue={(o, v) => o.id === v?.id}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Departamento"
                                                placeholder="Selecciona un departamento"
                                            />
                                        )}
                                    />
                                </div>

                                {/* Municipio */}
                                <div className="col-md-3">
                                    <Autocomplete
                                        options={muniOptions}
                                        value={formik.values.muni}
                                        onChange={handleMuniChange}
                                        getOptionLabel={(o) => o?.nombre ?? ""}
                                        isOptionEqualToValue={(o, v) => o.id === v?.id}
                                        loading={loadingMunis}
                                        disabled={!formik.values.depto}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Municipio"
                                                placeholder={
                                                    formik.values.depto
                                                        ? "Selecciona un municipio"
                                                        : "Primero elige un departamento"
                                                }
                                            />
                                        )}
                                    />
                                </div>

                                {/* Estado CUB */}
                                <div className="col-md-3">
                                    <TextField
                                        fullWidth
                                        select
                                        label="Estado CUB"
                                        SelectProps={{ native: true }}
                                        value={formik.values.state?.id ?? ""}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            const selected =
                                                stateOptions.find((s) => String(s.id) === val) ||
                                                null;
                                            formik.setFieldValue("state", selected);
                                        }}
                                    >
                                        <option value=""></option>
                                        {stateOptions.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.nombre}
                                            </option>
                                        ))}
                                    </TextField>
                                </div>

                                {/* Actividad */}
                                <div className="col-md-3">
                                    <TextField
                                        fullWidth
                                        select
                                        label="Actividad"
                                        SelectProps={{ native: true }}
                                        value={formik.values.activity?.id ?? ""}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            const selected =
                                                activityOptions.find(
                                                    (a) => String(a.id) === val
                                                ) || null;
                                            formik.setFieldValue("activity", selected);
                                        }}
                                    >
                                        <option value=""></option>
                                        {activityOptions.map((a) => (
                                            <option key={a.id} value={a.id}>
                                                {a.nombre}
                                            </option>
                                        ))}
                                    </TextField>
                                </div>
                            </div>

                        <div className="d-flex justify-content-end gap-2 mt-4 search-beneficiary-actions">
                            <Button
                                variant="outline-primary"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? "Buscando..." : "Buscar"}
                            </Button>

                            <Button
                                variant="outline-secondary"
                                type="button"
                                onClick={handleClear}
                                disabled={loading}
                            >
                                Limpiar Búsqueda
                            </Button>

                            {/*<Button*/}
                            {/*    variant="outline-success"*/}
                            {/*    type="button"*/}
                            {/*    onClick={handleExport}*/}
                            {/*    disabled={loading || !beneficiaryInfo}*/}
                            {/*>*/}
                            {/*    Exportar*/}
                            {/*</Button>*/}
                        </div>
                    </form>
                </Card.Body>
            </Card>

            {loading && <Loading fullScreen text={loadingText} />}

            {/* Info básica */}
            {beneficiaryInfo && (
                <>
                    <Card className="mt-4">
                        <Card.Body>
                            <SectionHeader
                                icon={FaUserTag}
                                title="Información básica del Titular"
                                subtitle="Datos generales del beneficiario según los filtros aplicados."
                            />
                            <DataGrid
                                rows={beneficiaryInfo}
                                columns={ColumnsInitialInformationTable}
                                paginationMode="server"
                                rowCount={rowCount}
                                pageSizeOptions={[25, 50, 100]}
                                rowHeight={40}
                                paginationModel={{ page, pageSize }}
                                onPaginationModelChange={({ page, pageSize }) => {
                                    setPage(page);
                                    setPageSize(pageSize);
                                }}
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
                        </Card.Body>
                    </Card>
                </>
            )}

            {/* Movimientos */}
            {movements?.datos_cub && (
                <>
                    <Card className="mt-4 mb-4 shadow-sm">
                        <Card.Body>
                            <SectionHeader
                                icon={FaUsers}
                                title="Detalle núcleo familiar"
                                subtitle="Información complementaria del titular y su núcleo familiar."
                            />

                            {movements?.datos_cub && Object.keys(movements.datos_cub).length > 0 && (
                                <div className="mt-3">
                                    <Card className="mb-3">
                                        <Card.Body>
                                            <Row>
                                                <Col md={4}>
                                                    <strong>CUB:</strong> {movements.datos_cub.cub}
                                                </Col>
                                                <Col md={4}>
                                                    <strong>Nombre beneficiario:</strong> {movements.datos_cub.nombre_completo_beneficiario}
                                                </Col>
                                                <Col md={4}>
                                                    <strong>Identificación beneficiario:</strong> {movements.datos_cub.identificacion_beneficiario}
                                                </Col>
                                            </Row>

                                            <Row className="mt-2">
                                                <Col md={4}>
                                                    <strong>Ubicación:</strong>{" "}
                                                    {`${movements.datos_cub.departamento} - ${movements.datos_cub.municipio}`}
                                                </Col>
                                                <Col md={4}>
                                                    <strong>Actividad:</strong> {movements.datos_cub.actividad}
                                                </Col>
                                                <Col md={4}>
                                                    <strong>Plan:</strong> {movements.datos_cub.plan}
                                                </Col>
                                            </Row>

                                            <Row className="mt-2">
                                                <Col md={8}>
                                                    <strong>Línea:</strong> {movements.datos_cub.Línea}
                                                </Col>
                                                <Col md={4}>
                                                    <strong>Restricción:</strong> {movements.datos_cub.restriccion}
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </div>
                            )}

                        </Card.Body>
                    </Card>
                </>
            )}

            {/* Movimientos */}
            {movements?.datos_cub && (
                <Card className="mt-4 mb-4 shadow-sm">

                    <Card.Body>
                        <SectionHeader
                            icon={FaMoneyCheckAlt}
                            title="Estado de cuenta"
                            subtitle="Resumen de pagos, saldos y totales por componente."
                        />

                        {movements?.estado_cuenta?.length > 0 && (
                            <div className="mt-3">
                                <Card className="mb-2 border-0">
                                    <DataGrid
                                        rows={rows}
                                        columns={AccountStatementColumns}
                                        pageSize={25}
                                        rowHeight={35}
                                        rowsPerPageOptions={[5, 10, 20]}
                                        getRowClassName={(params) => (params.id === "TOTAL" ? "row-total" : "")}
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
                                            "& .row-total": {
                                                fontWeight: "bold",
                                                backgroundColor: "#f5f5f5",
                                            },
                                            "& .MuiDataGrid-columnHeaders": {
                                                backgroundColor: "#2d3a4d",
                                                color: "white",
                                                fontSize: "14px",
                                            },
                                            "& .MuiDataGrid-columnHeader": {
                                                textAlign: "left",
                                                display: "flex",
                                                justifyContent: "left",
                                                alignItems: "left",
                                            },
                                            "& .MuiDataGrid-container--top [role=row], .MuiDataGrid-container--bottom [role=row]": {
                                                backgroundColor: "#2d3a4d !important",
                                                color: "white !important",
                                            },
                                            "& .MuiDataGrid-cell": {
                                                fontSize: "14px",
                                                textAlign: "left",
                                                justifyContent: "left",
                                                display: "flex",
                                            },
                                            "& .MuiDataGrid-row:hover": {
                                                backgroundColor: "#E8F5E9",
                                            },
                                        }}
                                    />
                                </Card>
                            </div>
                        )}

                        {movements?.resumen_pagos?.length > 0 && (
                            <div className="mt-3">
                                <Card className="mb-2 border-0">
                                    <SectionHeader
                                        icon={FaListAlt}
                                        title="Resumen de pagos"
                                        subtitle="Detalle de pagos registrados para el titular."
                                    />
                                    <DataGrid
                                        rows={movements.resumen_pagos}
                                        columns={PaymentSummaryColumns}
                                        pageSize={10}
                                        rowsPerPageOptions={[5, 10, 20]}
                                        rowHeight={35}
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
                                                textAlign: "left",
                                                display: "flex",
                                                justifyContent: "left",
                                                alignItems: "left",
                                            },
                                            "& .MuiDataGrid-container--top [role=row], .MuiDataGrid-container--bottom [role=row]": {
                                                backgroundColor: "#2d3a4d !important",
                                                color: "white !important",
                                            },
                                            "& .MuiDataGrid-cell": {
                                                fontSize: "14px",
                                                textAlign: "left",
                                                justifyContent: "left",
                                                display: "flex",
                                            },
                                            "& .MuiDataGrid-row:hover": {
                                                backgroundColor: "#E8F5E9",
                                            },
                                        }}
                                    />
                                </Card>
                            </div>
                        )}

                    </Card.Body>
                </Card>
            )}
            </Container>
        </div>
    </>
    );
};





