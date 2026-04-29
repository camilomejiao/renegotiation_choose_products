import { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Loading } from "../../../shared/loading/Loading";
import { Button, Col, Row } from "react-bootstrap";
import Select from "react-select";

//img
import imgPayments from "../../../../../assets/image/payments/payments.png";
import imgAdd from "../../../../../assets/image/payments/imgPay.png";

//Components
import { HeaderImage } from "../../../shared/header_image/HeaderImage";

//services
import { deliveriesInformationServices } from "../../../../../helpers/services/DeliveriesInformationServices";
import { supplierServices } from "../../../../../helpers/services/SupplierServices";
import { deliveriesServices } from "../../../../../helpers/services/DeliveriesServices";
import { locationServices } from "../../../../../helpers/services/LocationServices";

//Enum
import {
    DeliveryStatusEnum,
    ResponseStatusEnum,
    RolesEnum
} from "../../../../../helpers/GlobalEnum";

import AlertComponent from "../../../../../helpers/alert/AlertComponent";
import { SmartTable } from "../../../../../shared/ui/smart-table";

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
const canShowRoles = [RolesEnum.ADMIN, RolesEnum.TECHNICAL, RolesEnum.PAYMENTS, RolesEnum.TRUST_PAYMENTS, RolesEnum.SUPERVISION, RolesEnum.SUPPLIER];
export const DeliveriesInformation = () => {

    const { userAuth } = useOutletContext();

    const canShowSupplier = canShowSuppliers.includes(userAuth.rol_id);
    const canShowOtherRoles = canShowOtherRol.includes(userAuth.rol_id);
    const canShowButton = canShowRoles.includes(userAuth.rol_id);

    const navigate = useNavigate();

    const [dataSuppliers, setDataDataSuppliers] = useState([]);
    const [dataDepts, setDataDepts] = useState([]);
    const [dataMunis, setDataMunis] = useState([]);
    const [dataTable, setDataTable] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(100);
    const [rowCount, setRowCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [committedSearch, setCommittedSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [informationLoadingText, setInformationLoadingText] = useState("");

    const [selectedSupplierId, setSelectedSupplierId] = useState("");
    const [selectedDeptId, setSelectedDeptId] = useState("");
    const [selectedMuniId, setSelectedMuniId] = useState("");

    const [activeStatusKey, setActiveStatusKey] = useState("");

    //Para no recargar el catálogo múltiples veces
    const loadedRef = useRef(false);
    const loadedDeptsRef = useRef(false);

    const columns = [
        { title: "N° Entrega", dataIndex: "id", key: "id", width: 110 },
        { title: "Fecha de envio", dataIndex: "send_date", key: "send_date", width: 140 },
        { title: "Departamento", dataIndex: "department_name", key: "department_name", width: 140 },
        { title: "Municipio", dataIndex: "municipality_name", key: "municipality_name", width: 140 },
        { title: "Estado", dataIndex: "status", key: "status", width: 140 },
        { title: "CUB", dataIndex: "cub_id", key: "cub_id", width: 100 },
        {
            title: "Nombre del Beneficiario",
            dataIndex: "name",
            key: "name",
            width: 280,
            render: (value) => (
                <div
                    style={{
                        whiteSpace: "normal",
                        lineHeight: "1.4",
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                    }}
                >
                    {value}
                </div>
            ),
        },
        { title: "Identificación", dataIndex: "identification", key: "identification", width: 140 },
        {
            title: "Proveedor",
            dataIndex: "supplier_name",
            key: "supplier_name",
            width: 280,
            render: (value) => (
                <div
                    style={{
                        whiteSpace: "normal",
                        lineHeight: "1.4",
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                    }}
                >
                    {value}
                </div>
            ),
        },
        { title: "Nit", dataIndex: "supplier_nit", key: "supplier_nit", width: 130 },
        { title: "Valor", dataIndex: "pay", key: "pay", width: 140 },
        {
            title: "Observación",
            dataIndex: "observation",
            key: "observation",
            width: 320,
            render: (value) => (
                <div
                    style={{
                        whiteSpace: "normal",
                        lineHeight: "1.4",
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                    }}
                >
                    {value}
                </div>
            ),
        },

    ];

    //
    const getStatusValueFromKey = (key) => STATUS_ARRAY.find(s => s.key === key)?.value ?? null;

    //
    const getDeliveriesInformation = async (pageToFetch = 1, sizeToFetch = 100, search = "", statusDeliveryKey = "", supplierIdParam = "", deptIdParam = "", muniIdParam = "") => {
        try {
            setLoading(true);
            let singleSupplier = supplierIdParam;
            let singleDept = deptIdParam;
            let singleMuni = muniIdParam;

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
                pageToFetch, sizeToFetch, search, statusValue, singleSupplier, onlySended, singleDept, singleMuni
            );

            if (status === ResponseStatusEnum.OK) {
                //console.log(data.results);
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
        return data.map((row) => {

            const valorFE = Number(row?.valor_factura_electronica ?? 0);
            const valorBase = Number(row?.valor ?? 0);

            const valorSP = valorFE > 0 ? valorFE : valorBase;

            return {
                id: row?.id,
                status: row?.estado,
                send_date: row?.fecha_envio_proveedor ? row?.fecha_envio_proveedor.split('T')[0] : '',
                cub_id: row?.beneficiario?.cub_id,
                name: `${row?.beneficiario?.nombre_completo ?? ''}`,
                identification: row?.beneficiario?.identificacion,
                supplier_name: row?.proveedor?.nombre,
                supplier_nit: row?.proveedor?.nit,
                department_name: row?.proveedor?.departamento?.nombre,
                municipality_name: row?.proveedor?.municipio?.nombre,
                beneficiario_id: row?.beneficiario?.id,
                pay: `$ ${valorSP.toLocaleString("es-CO")}`,
                observation: row?.observacion,
            }
        });
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

    const loadDepartmentsOnce = async () => {
        if (loadedDeptsRef.current) return;
        try {
            setLoading(true);
            const {data, status} = await locationServices.getDeptos();
            if(status === ResponseStatusEnum.OK) {
                setDataDepts(normalizeCatalogDepts(data));
                loadedDeptsRef.current = true;
            } else {
                setDataDepts([]);
            }
        } catch (e) {
            console.error("Error cargando departamentos:", e);
            setDataDepts([]);
        } finally {
            setLoading(false);
        }
    };

    // make the same for municipalities
    const loadMunicipalitiesForDepartment = async (deptId) => {
        try {
            setLoading(true);
            const {data, status} = await locationServices.getMunis(deptId);
            if(status === ResponseStatusEnum.OK) {
                setDataMunis(normalizeCatalogMunis(data));
            } else {
                setDataMunis([]);
            }
        } catch (e) {
            console.error("Error cargando municipios:", e);
            setDataMunis([]);
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

    const normalizeCatalogDepts = (data) => {
        const rows =  data;
        return rows.map((row) => ({
            id: Number(row?.id),
            name: row?.nombre ?? row?.name ?? "",
        }));
    }

    const normalizeCatalogMunis = (data) => {
        const rows =  data;
        return rows.map((row) => ({
            id: Number(row?.id),
            name: row?.nombre ?? row?.name ?? "",
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

        setPage(1);
        setActiveStatusKey("");
        setSelectedSupplierId("");
        setCommittedSearch(query);
    };

    //
    const supplierOptions = dataSuppliers.map(s => ({
        value: String(s.id),
        label: `${s.name} — ${s.nit}`,
    }));

    const deptOptions = dataDepts.map(d => ({
        value: String(d.id),
        label: d.name,
    }));

    const muniOptions = dataMunis.map(m => ({
        value: String(m.id),
        label: m.name,
    }));

    // tabs mantienen proveedor seleccionado
    const handleChangeStatus = (newKey) => {
        if (newKey === activeStatusKey) return;
        setActiveStatusKey(newKey);
        setPage(1);
        setCommittedSearch("");
        setSearchQuery("");
    };

    //
    const searchSupplier = (opt) => {
        setSelectedSupplierId(opt?.value ?? "");
        setCommittedSearch("");
        setSearchQuery("");
        setPage(1);
    }

    const searchDept = (opt) => {
        setSelectedDeptId(opt?.value ?? "");
        loadMunicipalitiesForDepartment(opt?.value ?? "");
        setCommittedSearch("");
        setSearchQuery("");
        setPage(1);
    }

    const searchMuni = (opt) => {
        setSelectedMuniId(opt?.value ?? "");
        setCommittedSearch("");
        setSearchQuery("");
        setPage(1);
    }

    //
    const handleGenerateDocument = async () => {
        try {
            setLoading(true);
            setInformationLoadingText("Generando documento, espere un momento por favor...");

            const { search, statusValue, supplierId, onlySended, deptId, muniId } = await getCurrentFilters();

            const { status, blob, type, filename, data } =
                await deliveriesServices.getExcelDeliveriesDetailToSupervision(
                    search,
                    statusValue,
                    supplierId,
                    onlySended,
                    deptId,
                    muniId
                );

            if (status === ResponseStatusEnum.OK && blob) {
                const fileURL = URL.createObjectURL(blob);
                // Si es PDF y quieres abrir en otra pestaña:
                if ((type).includes('pdf')) {
                    window.open(fileURL, '_blank');
                } else {
                    //Descarga (Excel)
                    const a = document.createElement('a');
                    a.href = fileURL;
                    a.download = filename || 'reporte.xlsx';
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                }
                // Limpia el ObjectURL
                setTimeout(() => URL.revokeObjectURL(fileURL), 1000);
            }
            if (status === ResponseStatusEnum.NOT_FOUND || !blob) {
                AlertComponent.error('Error', 'No se puede descargar el archivo.');
            }

            if (status === ResponseStatusEnum.BAD_REQUEST) {
                AlertComponent.info('', 'No exiten datos con esa busqueda.');
            }
        } catch (error) {
            console.error("Error al Generar documento PDF para cuenta:", error);
        } finally {
            setLoading(false);
        }
    };

    //
    const getCurrentFilters = async () => {
        const hasSearch = (committedSearch || "").length >= 4;

        const search = hasSearch ? committedSearch : "";
        const statusKey = hasSearch ? "" : activeStatusKey;
        const statusValue = getStatusValueFromKey(statusKey);

        let supplierId = "";
        let deptId = "";
        let muniId = "";

        if (!hasSearch) {
            supplierId = selectedSupplierId || "";
            deptId = selectedDeptId || "";
            muniId = selectedMuniId || "";
        }

        if (canShowSupplier) {
            supplierId = await supplierServices.getSupplierId();
        }

        let onlySended = false;
        if (statusValue === DeliveryStatusEnum.REGISTERED.value) {
            onlySended = true;
        }

        return { search, statusValue, supplierId, onlySended, deptId, muniId };
    };

    //
    useEffect(() => {
        if(canShowOtherRoles) {
            loadSuppliersOnce();
        }
    }, []);

    //
    useEffect(() => {
        (async () => {
            const { search, statusValue, supplierId, onlySended, deptId, muniId } =
                await getCurrentFilters();

            const statusKey = activeStatusKey;

            getDeliveriesInformation(
                page,
                pageSize,
                search,
                statusKey,
                supplierId,
                deptId,
                muniId
            );
        })();
    }, [page, pageSize, activeStatusKey, selectedSupplierId, committedSearch, selectedDeptId, selectedMuniId]);

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
                                onClick={() => handleGenerateDocument()}
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
                            isSearchable
                            isClearable
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
                        <>
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

                            {/* Selector de Depto */}
                            <Col xs={12} md={6}>
                                <Select
                                    classNamePrefix="rbD"
                                    options={deptOptions}
                                    placeholder="Departamento"
                                    isSearchable
                                    isClearable
                                    value={deptOptions.find(o => o.value === selectedDeptId) ?? null}
                                    onChange={(opt) => searchDept(opt)}
                                    onMenuOpen={loadDepartmentsOnce}
                                    filterOption={(option, input) => {
                                        const q = input.toLowerCase();
                                        return option.label.toLowerCase().includes(q);
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

                            {/* Selector de Muni */}
                            <Col xs={12} md={6}>
                                <Select
                                    classNamePrefix="rbM"
                                    options={muniOptions}
                                    placeholder="Municipio"
                                    isSearchable
                                    isClearable
                                    value={muniOptions.find(o => o.value === selectedMuniId) ?? null}
                                    onChange={(opt) => searchMuni(opt)}
                                    filterOption={(option, input) => {
                                        const q = input.toLowerCase();
                                        return option.label.toLowerCase().includes(q);
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
                        </>
                    )}
                </Row>


                {loading && <Loading fullScreen text={informationLoadingText} />}

                <div style={{ height: 600, width: "100%" }}>
                    <SmartTable
                        rowKey="id"
                        columns={columns}
                        dataSource={dataTable}
                        loading={loading}
                        total={rowCount}
                        currentPage={page}
                        defaultPageSize={pageSize}
                        pageSizeOptions={["25", "50", "100"]}
                        onPageChange={(nextPage, nextPageSize) => {
                            setPage(nextPage);
                            setPageSize(nextPageSize);
                        }}
                        onRow={(record) => ({
                            onClick: () => handleRowClick({ row: record }),
                        })}
                        defaultText="---"
                        emptyText="No hay entregas registradas."
                        enableRowSelection={false}
                        showToolbar={false}
                        showTableResize={false}
                        showColumnSettings={false}
                        scroll={{ x: 2200 }}
                    />

                </div>
            </div>
            
        </>
    )
}
