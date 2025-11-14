import { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Col, Row } from "react-bootstrap";


//img
import imgPayments from "../../../../../assets/image/payments/payments.png";
import imgAdd from "../../../../../assets/image/payments/imgPay.png";

//Components
import { HeaderImage } from "../../../shared/header_image/HeaderImage";

//services
import { deliveriesInformationServices } from "../../../../../helpers/services/DeliveriesInformationServices";
import { supplierServices } from "../../../../../helpers/services/SupplierServices";
import { deliveriesServices } from "../../../../../helpers/services/DeliveriesServices";

//Enum
import {
    DeliveryStatusEnum,
    ReportTypePaymentsEnum,
    ResponseStatusEnum,
    RolesEnum
} from "../../../../../helpers/GlobalEnum";
import Select from "react-select";
import AlertComponent from "../../../../../helpers/alert/AlertComponent";

const canShowSuppliers = [RolesEnum.SUPPLIER];
const canShowOtherRol = [
    RolesEnum.SUPERVISION,
    RolesEnum.TERRITORIAL_LINKS,
    RolesEnum.TECHNICAL,
    RolesEnum.PAYMENTS,
    RolesEnum.TRUST_PAYMENTS,
    RolesEnum.SYSTEM_USER,
    RolesEnum.ADMIN
];

//Status
const STATUS_ARRAY = Object.values(DeliveryStatusEnum);

/** Roles que pueden ver el boton descargra. */
const canShowRoles = [RolesEnum.ADMIN, RolesEnum.TECHNICAL];
export const DeliveriesInformation = () => {

    const { userAuth } = useOutletContext();

    const canShowSupplier = canShowSuppliers.includes(userAuth.rol_id);
    const canShowOtherRoles = canShowOtherRol.includes(userAuth.rol_id);
    const canShowButton = canShowRoles.includes(userAuth.rol_id);

    const navigate = useNavigate();

    const [dataSuppliers, setDataDataSuppliers] = useState([]);
    const [dataTable, setDataTable] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(100);
    const [rowCount, setRowCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [committedSearch, setCommittedSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [informationLoadingText, setInformationLoadingText] = useState("");

    const [selectedSupplierId, setSelectedSupplierId] = useState("");

    const [activeStatusKey, setActiveStatusKey] = useState(DeliveryStatusEnum.REGISTERED.key);

    //Para no recargar el catálogo múltiples veces
    const loadedRef = useRef(false);

    const columns = [
        { field: "id", headerName: "N° Entrega", width: 100 },
        { field: "send_date", headerName: "Fecha de envio", width: 100 },
        { field: "status", headerName: "Estado", width: 110 },
        { field: "cub_id", headerName: "CUB", width: 80 },
        {
            field: "name",
            headerName: "Beneficiario",
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
        { field: "identification", headerName: "Identificación", width: 110 },
        {
            field: "supplier_name",
            headerName: "Proveedor",
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
        { field: "supplier_nit", headerName: "Nit", width: 110 },
        { field: "pay", headerName: "Valor", width: 110 },
        {
            field: "observation",
            headerName: "Observación",
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

    ];

    //
    const getStatusValueFromKey = (key) => STATUS_ARRAY.find(s => s.key === key)?.value ?? null;

    //
    const getDeliveriesInformation = async (pageToFetch = 1, sizeToFetch = 100, search = "", statusDeliveryKey = "", supplierIdParam = "") => {
        try {
            setLoading(true);
            let singleSupplier = supplierIdParam;

            //Si es proveedor, forzar su propio id (regla de negocio)
            if (canShowSupplier) {
                singleSupplier = await supplierServices.getSupplierId();
            }

            const statusValue = getStatusValueFromKey(statusDeliveryKey);
            let onlySended = false;
            if(statusValue === DeliveryStatusEnum.REGISTERED.value){
                onlySended = true;
            }
            const { data, status } = await deliveriesInformationServices.getDeliveriesInformation(
                pageToFetch, sizeToFetch, search, statusValue, singleSupplier, onlySended
            );

            if (status === ResponseStatusEnum.OK) {
                const rows = await normalizeRows(data.results);
                setDataTable(rows);
                setRowCount(data.count);
            }
        } catch (error) {
            console.error("Error obteniendo las entregas:", error);
        } finally {
            setLoading(false);
        }
    };

    //
    const normalizeRows = async (data) => {
        return data.map((row) => ({
            id: row?.id,
            status: row?.estado,
            send_date: row?.fecha_envio_proveedor.split('T')[0],
            cub_id: row?.beneficiario?.cub_id,
            name: `${row?.beneficiario?.nombre_completo ?? ''}`,
            identification: row?.beneficiario?.identificacion,
            supplier_name: row?.proveedor?.nombre,
            supplier_nit: row?.proveedor?.nit,
            beneficiario_id: row?.beneficiario?.id,
            pay: parseFloat(row?.valor_factura_electronica ?? row?.valor).toLocaleString("es-CO", { style: "currency",currency: "COP" }),
            observation: row?.observacion,
        }));
    }

    // Carga catálogo (activos) una sola vez
    const loadSuppliersOnce = async () => {
        if (loadedRef.current) return;
        try {
            setLoading(true);
            const { data, status } = await supplierServices.getSuppliers();
            if (status === ResponseStatusEnum.OK) {
                setDataDataSuppliers(normalizeCatalogSuppliers(data));
                loadedRef.current = true;
            } else {
                setDataDataSuppliers([]);
            }
        } catch (e) {
            console.error("Error cargando proveedores (catálogo):", e);
            setDataDataSuppliers([]);
        } finally {
            setLoading(false);
        }
    };

    //
    const normalizeCatalogSuppliers = (data) => {
        const rows =  data?.data?.proveedores;
        return rows.map((row) => ({
            id: Number(row?.id),
            name: row?.nombre,
            nit: row?.nit,
        }));
    }

    //
    const handleRowClick = (params) => {
        navigate(`/admin/deliveries/${params?.row?.beneficiario_id}`)
    }

    const runSearch = (q = searchQuery) => {
        const query = (q || "").trim().toLowerCase();
        const canSearch = query.length === 0 || query.length >= 4;
        if (!canSearch) return;

        setPage(0);
        setSelectedSupplierId("");
        setCommittedSearch(query);
    };

    //
    const supplierOptions = dataSuppliers.map(s => ({
        value: String(s.id),
        label: `${s.name} — ${s.nit}`,
    }));

    // tabs mantienen proveedor seleccionado
    const handleChangeStatus = (newKey) => {
        if (newKey === activeStatusKey) return;
        setActiveStatusKey(newKey);
        setPage(0);
        setCommittedSearch("");
        setSearchQuery("");
    };

    //
    const searchSupplier = (opt) => {
        setSelectedSupplierId(opt?.value ?? "");
        setCommittedSearch("");
        setSearchQuery("");
        setPage(0);
    }

    //
    const handleGenerateDocument = async (reportType) => {
        try {
            setLoading(true);
            setInformationLoadingText("Generando documento, espere un momento por favor...");

            const { status, blob, type, filename, data } = await deliveriesServices.getExcelDeliveriesDetailToSupervision();
            console.log(blob, status);

            if (status === ResponseStatusEnum.OK && blob) {
                const fileURL = URL.createObjectURL(blob);
                // Si es PDF y quieres abrir en otra pestaña:
                if ((type).includes('pdf')) {
                    window.open(fileURL, '_blank');
                } else {
                    // Descarga (Excel u otros binarios)
                    const a = document.createElement('a');
                    a.href = fileURL;
                    a.download = filename || 'reporte.xlsx';
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                }

                // Limpia el ObjectURL
                setTimeout(() => URL.revokeObjectURL(fileURL), 1000);
            } else if (status === ResponseStatusEnum.NOT_FOUND || !blob) {
                AlertComponent.error('Error', 'No se puede descargar el archivo.');
            }
        } catch (error) {
            console.error("Error al Generar documento PDF para cuenta:", error);
        } finally {
            setLoading(false);
        }
    };

    //
    useEffect(() => {
        if(canShowOtherRoles) {
            loadSuppliersOnce();
        }
    }, []);

    //
    useEffect(() => {
        const hasSearch = (committedSearch || "").length >= 4;

        // Si hay search => ignora tab y proveedor
        const effectiveStatusKey  = hasSearch ? "" : activeStatusKey;
        const effectiveSupplierId = hasSearch ? "" : (selectedSupplierId || "");

        getDeliveriesInformation(
            page + 1,
            pageSize,
            hasSearch ? committedSearch : "",
            effectiveStatusKey,
            effectiveSupplierId
        );
    }, [page, pageSize, activeStatusKey, selectedSupplierId, committedSearch]);

    return (
        <>
            <HeaderImage
                imageHeader={imgPayments}
                titleHeader={'Seguimientos De Entregas'}
                bannerIcon={imgAdd}
                backgroundIconColor={'#2148C0'}
                bannerInformation={'Aquí podrás revisar tus entregas.'}
                backgroundInformationColor={'#F66D1F'}
            />

            <div className="container mt-lg-5">
                {/* Toolbar */}
                <Row className="gy-2 align-items-center mt-3">
                    {/* Buscador + botón pegado */}
                    <Col xs={12} md={6}>
                        <input
                            type="text"
                            placeholder="Buscar por Nombre/CUB/NIT..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    runSearch();
                                }
                            }}
                            className="form-control search-input"
                        />
                    </Col>
                    {/* Buscador + botón pegado */}
                    <Col xs={12} md={2}>
                        <Button
                            variant="outline-primary"
                            className="btn-search"
                            onClick={() => runSearch()}
                            disabled={(searchQuery.trim().length > 0 && searchQuery.trim().length < 4) || loading}
                            title="Buscar"
                        >
                            Buscar
                        </Button>
                    </Col>
                    {/* Descargar reporte */}
                    {canShowButton && (
                        <Col xs={12} md={4} className="ms-auto d-flex justify-content-end">
                            <Button
                                variant="outline-success"
                                className="btn-responsive"
                                onClick={() => handleGenerateDocument(ReportTypePaymentsEnum.EXCEL)}
                                title="Generar excel"
                            >
                                Generar Reporte
                            </Button>
                        </Col>
                    )}
                </Row>

                {/* Filtro de estado (reemplazo de tabs) */}
                <Row className="gy-2 align-items-center mt-3 mb-4">
                    <Col xs={12} md={6}>
                        <Select
                            classNamePrefix="status-select"
                            options={STATUS_ARRAY.map((st) => ({
                                value: st.key,
                                label: st.label,
                            }))}
                            value={
                                STATUS_ARRAY
                                    .map((st) => ({ value: st.key, label: st.label }))
                                    .find((opt) => opt.value === activeStatusKey) || null
                            }
                            onChange={(opt) => handleChangeStatus(opt?.value)}
                            placeholder="Filtrar por estado"
                            isClearable={false}
                            styles={{
                                control: (base, state) => ({
                                    ...base,
                                    borderColor: state.isFocused ? "#40A581" : "#ccc",
                                    boxShadow: state.isFocused ? "0 0 0 1px #40A581" : "none",
                                    "&:hover": { borderColor: "#40A581" },
                                }),
                                option: (base, { isFocused, isSelected }) => ({
                                    ...base,
                                    backgroundColor: isSelected
                                        ? "#40A581"
                                        : isFocused
                                            ? "#E8F5E9"
                                            : "white",
                                    color: isSelected ? "white" : "#333",
                                    cursor: "pointer",
                                }),
                                singleValue: (base) => ({
                                    ...base,
                                    color: "#2148C0",
                                    fontWeight: "200",
                                }),
                            }}
                        />
                    </Col>

                    {/* Selector de proveedor con datalist (bonito y buscable) */}
                    {canShowOtherRoles && (
                        <Col xs={12} md={6}>
                            <Select
                                classNamePrefix="rb"
                                options={supplierOptions}
                                placeholder="Proveedor (nombre o NIT)"
                                isSearchable
                                isClearable
                                value={supplierOptions.find(o => o.value === selectedSupplierId) ?? null}
                                onChange={(opt) => searchSupplier(opt)}
                                onMenuOpen={loadSuppliersOnce}
                                filterOption={(option, input) => {
                                    const q = input.toLowerCase();
                                    return (
                                        option.label.toLowerCase().includes(q) || // nombre
                                        option.label.toLowerCase().split("—")[1]?.includes(q) // NIT
                                    );
                                }}
                                styles={{
                                    control: (base, state) => ({
                                        ...base,
                                        borderColor: state.isFocused ? "#40A581" : "#ccc",
                                        boxShadow: state.isFocused ? "0 0 0 1px #40A581" : "none",
                                        "&:hover": { borderColor: "#40A581" },
                                    }),
                                    option: (base, { isFocused, isSelected }) => ({
                                        ...base,
                                        backgroundColor: isSelected
                                            ? "#40A581"
                                            : isFocused
                                                ? "#E8F5E9"
                                                : "white",
                                        color: isSelected ? "white" : "#333",
                                        cursor: "pointer",
                                    }),
                                    singleValue: (base) => ({
                                        ...base,
                                        color: "#2148C0",
                                        fontWeight: "200",
                                    }),
                                }}
                            />
                        </Col>
                    )}
                </Row>

                {loading && (
                    <div className="overlay">
                        <div className="loader">{informationLoadingText}</div>
                    </div>
                )}

                <div style={{ height: 600, width: "100%" }}>
                    <DataGrid
                        rows={dataTable}
                        columns={columns}
                        loading={loading}
                        paginationMode="server"
                        rowCount={rowCount}
                        pageSizeOptions={[25, 50, 100]}
                        paginationModel={{ page, pageSize }}
                        onPaginationModelChange={({ page, pageSize }) => {
                            setPage(page);
                            setPageSize(pageSize);
                        }}
                        onRowClick={handleRowClick}
                        rowHeight={64}
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
            </div>
            
        </>
    )
}