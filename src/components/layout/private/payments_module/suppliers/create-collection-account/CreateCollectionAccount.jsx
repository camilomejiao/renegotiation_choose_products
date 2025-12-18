import {useEffect, useRef, useState} from "react";
import {useNavigate, useOutletContext} from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Card, Col, Row } from "react-bootstrap";
import { FaSave, FaStepBackward } from "react-icons/fa";
import Select from "react-select";

//Components
import { HeaderImage } from "../../../../shared/header_image/HeaderImage";

//Img
import imgPayments from "../../../../../../assets/image/payments/pay-supplier.png";
import imgAdd from "../../../../../../assets/image/payments/imgPay.png";
import imgWorker from "../../../../../../assets/image/payments/worker.png";

// Services
import { paymentServices } from "../../../../../../helpers/services/PaymentServices";
import {supplierServices} from "../../../../../../helpers/services/SupplierServices";

// Enums
import { ResponseStatusEnum, RolesEnum } from "../../../../../../helpers/GlobalEnum";
import AlertComponent from "../../../../../../helpers/alert/AlertComponent";

//
const canShowSelect = [
    RolesEnum.PAYMENTS,
    RolesEnum.TRUST_PAYMENTS,
    RolesEnum.SYSTEM_USER,
    RolesEnum.ADMIN
];

export const CreateCollectionAccount = () => {

    const { userAuth } = useOutletContext();
    const isSupplier = userAuth.rol_id === RolesEnum.SUPPLIER;
    const isCanShowSelect = canShowSelect.includes(userAuth.rol_id);
    const navigate = useNavigate();

    const [dataSuppliers, setDataDataSuppliers] = useState([]);
    const [selectedSupplierId, setSelectedSupplierId] = useState("");
    const [accountType, setAccountType] = useState([]);
    const [selectedAccountTypeId, setSelectedAccountTypeId] = useState("");

    const [dataTable, setDataTable] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(100);
    const [rowCount, setRowCount] = useState(0);
    const [selectedIds, setSelectedIds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingDeliveries, setLoadingDeliveries] = useState(false);
    const [informationLoadingText, setInformationLoadingText] = useState("");
    const [sendingData, setSendingData] = useState(false);

    //Para no recargar el catálogo múltiples veces
    const loadRef = useRef(false);

    const statusCollectionAccountColumns = [
        { field: "id", headerName: "N° Entrega", flex: 0.8 },
        { field: "cub_id", headerName: "Cub", flex: 0.4 },
        { field: "name", headerName: "Beneficiario", flex: 2.5 },
        { field: "identification", headerName: "Identificacion", flex: 1 },
        { field: "date", headerName: "Fecha", flex: 0.6 },
        { field: "unid", headerName: "Productos", flex: 0.6 },
        { field: "amount", headerName: "Cantidad de Productos", flex: 1.2 },
        { field: "amount_of_money", headerName: "Valor", flex: 1 },
    ];

    // Carga catálogo (activos) una sola vez
    const loadSuppliersOnce = async () => {
        if (loadRef.current) return;
        try {
            setLoading(true);
            setInformationLoadingText('Cargando proveedores...');
            const { data, status } = await supplierServices.getSuppliers();
            if (status === ResponseStatusEnum.OK) {
                setDataDataSuppliers(normalizeCatalogSuppliers(data));
                loadRef.current = true;
            }
        } catch (error) {
            console.error("Error cargando proveedores (catálogo):", error);
            setDataDataSuppliers([]);
        } finally {
            setLoading(false);
        }
    };

    //
    const normalizeCatalogSuppliers = (data) => {
        const rows =  data?.data?.proveedores;
        return rows.map((row) => ({
            value: String(row.id),
            label: `${row.nombre} — ${row.nit}`,
        }));
    }

    //
    const selectedSupplier = async (opt) => {
        if(!opt){
            return;
        }
        setSelectedSupplierId(opt?.value ?? opt);
        try {
            setLoading(true);
            setInformationLoadingText('Verificando cuentas bancarias del proveedor...');
            const suppId = opt?.value ?? opt;
            const {data, status} = await supplierServices.getBankAccountsBySupplierId(suppId);

            if (status === ResponseStatusEnum.BAD_REQUEST || status === ResponseStatusEnum.NOT_FOUND || data?.data?.bancos.length === 0) {
                AlertComponent.warning('', 'Proveedor no tiene cuentras registradas');
            }

            if (status === ResponseStatusEnum.OK) {
                console.log(data);
                setAccountType(normalizeBanks(data));
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const selectedBank = async (optB) => {
        setSelectedAccountTypeId(optB?.value);
        if(!isSupplier) {
            await getApprovedDeliveries(1, 100, selectedSupplierId);
        }
    }

    //
    const normalizeBanks = (data) => {
        const rows =  data?.data?.bancos;
        return rows.map((row) => ({
            value: row?.banco_id,
            label: `${row?.entidad_bancaria} - ${row?.numero_cuenta}`
        }));

    }

    //
    const getApprovedDeliveries = async (pageToFetch = 1, sizeToFetch, supplierId) => {
        try {
            setLoadingDeliveries(true);
            setInformationLoadingText('Cargando entregas...');
            let SP_ID = ""
            if(supplierId){
                SP_ID = supplierId ?? userAuth?.id;
            }
            const { data, status } = await paymentServices.getAllApprovedDeliveriesBySupplier(pageToFetch, sizeToFetch, SP_ID);
            if (status === ResponseStatusEnum.OK) {
                const rows = normalizeRows(data.results);
                setDataTable(rows);
                setRowCount(data.count);
            }
        } catch (error) {
            console.error("Error cargando entregas aprobadas:", error);
        } finally {
            setLoadingDeliveries(false);
        }
    };

    const normalizeRows = (data) => {
        return data.map((row) => {
            const beneficiario = row?.beneficiario ?? {};
            const valorFE = Number(row?.valor_factura_electronica ?? 0);
            const valorBase = Number(row?.valor ?? 0);

            const valorFactura = valorFE > 0 ? valorFE : valorBase;

            return {
                id: row?.id,
                cub_id: beneficiario?.cub_id,
                name: `${beneficiario?.nombre ?? ""} ${beneficiario?.apellido ?? ""}`.trim(),
                identification: beneficiario?.identificacion ?? "",
                date: row.fecha_creacion.split("T")[0],
                unid: row?.cantidad_productos ?? 0,
                amount: row?.total_cantidad_productos ?? 0,
                amount_of_money: valorFactura.toLocaleString("es-CO"),
            };
        });
    };

    const handleSelectionChange = (newSelection) => {
        setSelectedIds(newSelection);
    };

    const handleSaveDeliveries = async () => {
        if (!selectedAccountTypeId) {
            AlertComponent.error("Error", "Debe seleccionar una cuenta bancaria.");
            return;
        }

        if (selectedIds.length === 0) {
            AlertComponent.error("Error", "Debe seleccionar al menos una entrega.");
            return;
        }

        if (selectedIds.length > 20) {
            AlertComponent.info("Error", "Solo puedes seleccionar 20 entregas por cuenta de cobro.");
            return;
        }

        const payload = {
            entregas_ids: selectedIds,
            cuenta_id: selectedAccountTypeId
        };

        let supplier = selectedSupplierId ?? userAuth?.id;

        try {
            setSendingData(true);
            setLoading(true);
            const { status } = await paymentServices.createCollectionAccounts(payload, supplier);
            if (status === ResponseStatusEnum.CREATED) {
                AlertComponent.success("Éxito", "Cuenta de cobro creada exitosamente.");
                navigate('/admin/payments-suppliers');
            }
        } catch (error) {
            console.error("Error al crear cuenta de cobro:", error);
            AlertComponent.error("Error", "Hubo un problema al crear la cuenta de cobro.");
        } finally {
            setLoading(true);
            setSendingData(false);
        }
    };

    const onBack = () => navigate(`/admin/payments-suppliers`);

    //
    useEffect(() => {
        if(!isSupplier) {
            loadSuppliersOnce();
        }

        if(isSupplier) {
            selectedSupplier(userAuth.id);
        }
    }, []);

    useEffect(() => {
        if(isSupplier) {
            getApprovedDeliveries(page + 1, pageSize, userAuth.id);
        }
    }, [page, pageSize]);

    return (
        <>
            <HeaderImage
                imageHeader={imgPayments}
                titleHeader={'Proceso de pago'}
                bannerIcon={imgAdd}
                backgroundIconColor={'#2148C0'}
                bannerInformation={'Aquí podrás revisar el estado de tus órdenes de pago.'}
                backgroundInformationColor={'#F66D1F'}
            />

            <div className="supplier-header">
                <div className="supplier-content">
                    <h2>Proveedor</h2>
                    <img src={imgWorker} alt="Proveedor" className="supplier-img" />
                </div>
            </div>

            <div className="container mt-lg-5">
                {(sendingData || loadingDeliveries) && (
                    <div className="overlay">
                        <div className="loader">{informationLoadingText}</div>
                    </div>
                )}

                <Card className="p-3 p-md-4 shadow-sm mb-4">
                    <h4 className="mb-4 text-primary fw-bold text-center text-md-start">Información para Cuenta de Cobro</h4>

                    {/* Selects */}
                    <Row className="gy-3 mb-4">
                        {isCanShowSelect && (
                            <>
                                <Col xs={12} md={5}>
                                    <Select
                                        classNamePrefix="rb"
                                        options={dataSuppliers}
                                        placeholder="Selecciona un proveedor (nombre o NIT)"
                                        isSearchable
                                        isClearable
                                        value={dataSuppliers.find(o => o.value === selectedSupplierId) ?? null}
                                        onChange={(opt) => selectedSupplier(opt)}
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
                            </>
                        )}

                        <Col xs={12} md={5}>
                            <Select
                                classNamePrefix="rb1"
                                options={accountType}
                                placeholder="Selecciona una cuenta bancaria"
                                isSearchable
                                isClearable
                                value={accountType.find(o => o.value === selectedAccountTypeId) ?? null}
                                onChange={(optB) => selectedBank(optB)}
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

                        {isCanShowSelect && (
                            <Col xs={12} md={2}>
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    type="button"
                                    //onClick={() => handleViewFile(formik.values.rutFile)}
                                >
                                    Ver Certificado
                                </Button>
                            </Col>
                        )}

                    </Row>

                    {loading && (
                        <div className="overlay">
                            <div className="loader">{informationLoadingText}</div>
                        </div>
                    )}

                    <div style={{ height: 500, width: "100%" }}>
                        <DataGrid
                            checkboxSelection
                            rows={dataTable}
                            columns={statusCollectionAccountColumns}
                            loading={loading}
                            paginationMode="server"
                            rowCount={rowCount}
                            pageSizeOptions={[50, 100]}
                            paginationModel={{ page, pageSize }}
                            onPaginationModelChange={({ page, pageSize }) => {
                                setPage(page);
                                setPageSize(pageSize);
                            }}
                            onRowSelectionModelChange={handleSelectionChange}
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
                    </div>

                    <div className="d-flex justify-content-end gap-2 mt-3">
                        <Button variant="outline-secondary"
                                onClick={onBack}
                        >
                            <FaStepBackward /> Atras
                        </Button>
                        <Button variant="outline-success"
                                onClick={handleSaveDeliveries}
                        >
                            <FaSave /> Crear cuenta de cobro
                        </Button>
                    </div>
                </Card>
            </div>
        </>
    );
};