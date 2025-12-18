import { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { Card, Row, Col, Button, Spinner, Container } from "react-bootstrap";
import { Autocomplete, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

//Components
import { HeaderImage } from "../../../shared/header_image/HeaderImage";
import imgDCSIPeople from "../../../../../assets/image/addProducts/people1.jpg";
import imgAdd from "../../../../../assets/image/payments/imgPay.png";

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

    //
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

    //
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

    //
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
            AlertComponent.error("Error al buscar la información del beneficiario.");
        } finally {
            setLoading(false);
        }
    }

    //
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

    //
    const handleDeptChange = async (_evt, value) => {
        formik.setFieldValue("depto", value);
        await loadMunicipalities(value?.id || null);
    };

    //
    const handleMuniChange = (_evt, value) => {
        formik.setFieldValue("muni", value);
    };

    //
    const handleClear = () => {
        formik.resetForm();
        setBeneficiaryInfo(null);
        setMovements(null);
    };

    //
    const handleExport = () => {
        if (!beneficiaryInfo) {
            AlertComponent.warning("Primero realice una búsqueda para exportar la información.");
            return;
        }

        console.log("Exportar información de: ", beneficiaryInfo);
        AlertComponent.success("Exportación generada (mock).");
    };

    //
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

    //
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
        { field: "cub", headerName: "CUB", width: 100 },
        { field: "cub_state", headerName: "ESTADO CUB", width: 100 },
        { field: "identification", headerName: "IDENTIFICACIÓN", width: 150 },
        { field: "name", headerName: "NOMBRE COMPLETO", width: 270 },
        { field: "depto", headerName: "DEPARTAMENTO", width: 130 },
        { field: "muni", headerName: "MUNICIPIO", width: 110 },
        { field: "village", headerName: "VEREDA", width: 150 },
        {
            field: "actions",
            headerName: "Detalles",
            width: 150,
            renderCell: renderActionsCell,
            sortable: false,
            filterable: false,
        },
    ];

    //
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
        { field: "id", headerName: "N°", width: 80 },
        { field: "component", headerName: "componente", width: 250 },
        { field: "pay", headerName: "Pago", width: 250 },
        { field: "debt", headerName: "Saldo", width: 250 },
        { field: "total", headerName: "Total", width: 250 },
    ];

    const PaymentSummaryColumns = [
        { field: "id", headerName: "N°", width: 80 },
        { field: "agreement", headerName: "contrato", width: 180 },
        { field: "component", headerName: "componente", width: 250 },
        { field: "secondary", headerName: "secundario", width: 200 },
        { field: "payment_identification", headerName: "identificacion pago", width: 150 },
        { field: "paid_holder", headerName: "Titular pago", width: 300 },
        { field: "paid", headerName: "Pagado", width: 90 },
        { field: "pay", headerName: "pago", width: 170 },
    ];

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
            linea: datos.linea || "",
            restriccion: datos.restriccion || "",
            nombre_completo_beneficiario: datos.nombre_completo_beneficiario || "NO APLICA",
            identificacion_beneficiario: datos.identificacion_beneficiario || "NO APLICA",
            sexo_beneficiario: datos.sexo_beneficiario || "NO APLICA",
        };
    };

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
                titleHeader={"Busqueda de beneficiarios"}
                bannerIcon={imgAdd}
                backgroundIconColor={"#2148C0"}
                bannerInformation={""}
                backgroundInformationColor={"#1ff675"}
            />

            <Container>
                {/* Card de búsqueda */}
                <Card className="mt-4 shadow-sm">
                    <Card.Body>
                        <h4 className="mb-4 text-primary fw-bold text-center text-md-start">
                            Búsqueda de titulares
                        </h4>

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

                        <div className="d-flex justify-content-start gap-2 mt-4">
                            <Button
                                variant="outline-primary"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Spinner
                                            size="sm"
                                            animation="border"
                                            className="me-2"
                                        />
                                        Buscando...
                                    </>
                                ) : (
                                    "Buscar"
                                )}
                            </Button>

                            <Button
                                variant="outline-secondary"
                                type="button"
                                onClick={handleClear}
                                disabled={loading}
                            >
                                Limpiar búsqueda
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

            {loading && (
                <div className="overlay">
                    <div className="loader">{loadingText}</div>
                </div>
            )}

            {/* Info básica */}
            {beneficiaryInfo && (
                <>
                    <Card className="mt-4">
                        <Card.Body>
                            <h4 className="mb-4 text-primary fw-bold text-center text-md-start">
                                Información básica del Titular
                            </h4>
                            <DataGrid
                                rows={beneficiaryInfo}
                                columns={ColumnsInitialInformationTable}
                                paginationMode="server"
                                rowCount={rowCount}
                                pageSizeOptions={[25, 50, 100]}
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
                        </Card.Body>
                    </Card>
                </>
            )}

            {/* Movimientos */}
            {movements?.datos_cub && (
                <>
                    <Card className="mt-4 mb-4 shadow-sm">
                        <Card.Body>
                            <h4 className="mb-4 text-primary fw-bold text-center text-md-start">
                                Detalle CUB
                            </h4>

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
                                                    <strong>Linea:</strong> {movements.datos_cub.linea}
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
                        <h4 className="mb-4 text-primary fw-bold text-center text-md-start">
                            Estado de cuenta
                        </h4>

                        {movements?.estado_cuenta?.length > 0 && (
                            <div className="mt-3">
                                <Card className="mb-2 border-0">
                                    <DataGrid
                                        rows={rows}
                                        columns={AccountStatementColumns}
                                        pageSize={25}
                                        rowHeight={50}
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
                                </Card>
                            </div>
                        )}

                        {movements?.resumen_pagos?.length > 0 && (
                            <div className="mt-3">
                                <Card className="mb-2 border-0">
                                    <h4 className="mb-4 text-primary fw-bold text-center text-md-start">
                                        Resumen de pagos
                                    </h4>
                                    <DataGrid
                                        rows={movements.resumen_pagos}
                                        columns={PaymentSummaryColumns}
                                        pageSize={10}
                                        rowsPerPageOptions={[5, 10, 20]}
                                        rowHeight={50}
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
