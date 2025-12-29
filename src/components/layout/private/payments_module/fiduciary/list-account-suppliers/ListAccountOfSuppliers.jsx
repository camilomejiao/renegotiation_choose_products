import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Col, Container, Row } from "react-bootstrap";

import './ListAccountOfSuppliers.css';

//Components
import { HeaderImage } from "../../../../shared/header_image/HeaderImage";

//img
import imgPayments from "../../../../../../assets/image/payments/pay-supplier.png";
import imgAdd from "../../../../../../assets/image/payments/imgPay.png";

//Services
import { paymentServices } from "../../../../../../helpers/services/PaymentServices";

//Enum
import {
    CollectionAccountStatusEnum,
    ReportTypePaymentsEnum,
    ResponseStatusEnum
} from "../../../../../../helpers/GlobalEnum";
import AlertComponent from "../../../../../../helpers/alert/AlertComponent";

export const ListAccountOfSuppliers = () => {

    const navigate = useNavigate();

    const [dataTable, setDataTable] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(100);
    const [rowCount, setRowCount] = useState(0);
    const [selectedIds, setSelectedIds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [informationLoadingText, setInformationLoadingText] = useState("");

    const [searchQuery, setSearchQuery] = useState("");

    const searchTimerRef = useRef(null);

    const columns = [
        { field: "id", headerName: "ID", flex: 0.2 },
        { field: "collection_account", headerName: "N° Cuenta de Cobro", flex: 0.3 },
        { field: "status", headerName: "Estado", flex: 0.3 },
        { field: "date", headerName: "Fecha Creación", flex: 0.3 },
        { field: "supplier_nit", headerName: "Nit", flex: 0.4 },
        { field: "supplier_name", headerName: "Proveedor", flex: 1.5 },
        { field: "total", headerName: "Valor Total", flex: 0.5 },
        { field: "user", headerName: "Registró", flex: 0.5 },
    ];

    const getAccountOfSuppliers = async (pageToFetch = 1, sizeToFetch = 100, search = "") => {
        setLoading(true);
        try {
            const {data, status} = await paymentServices.getCollectionAccounts(pageToFetch, sizeToFetch, '', CollectionAccountStatusEnum.REGISTERED.key, search);
            if(status === ResponseStatusEnum.OK) {
                const rows = await normalizeRows(data.results);
                setDataTable(rows);
                setRowCount(data.count);
            }
        } catch (error) {
            console.error("Error obteniendo las entregas:", error);
        } finally {
            setLoading(false);
        }
    }

    const normalizeRows = async (data) => {
        return data.map((row) => {
            const valorFE = Number(row?.valor_factura_electronica ?? 0);
            const valorBase = Number(row?.valor_total ?? 0);

            const valorSP = valorFE > 0 ? valorFE : valorBase;

            return {
                id: row?.id,
                collection_account: row?.numero,
                status: row?.estado_nombre,
                date: row?.fecha_cuenta_cobro.split("T")[0],
                supplier_name: row?.nombre_proveedor,
                supplier_nit: row?.nit_proveedor,
                total: `$ ${valorSP.toLocaleString("es-CO")}`,
                user: row?.usuario_creacion
            };
        });
    }

    //Manejar selección de filas
    const handleSelectionChange = (newSelectionModel) => {
        // Encuentra las filas seleccionadas, busca los id seleccionados para traer la informacion y luego la informacion que necesitamos
        const selectedAccounts = dataTable
            .filter((row) => newSelectionModel.includes(row.id))
            .map((row) => row.collection_account);
        setSelectedIds(selectedAccounts);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    //
    const runSearch = (q = searchQuery) => {
        // limpia un debounce previo
        if (searchTimerRef.current) clearTimeout(searchTimerRef.current);

        const query = (q || "").trim().toLowerCase();
        const canSearch = query.length === 0 || query.length >= 4;
        if (!canSearch) return; // no dispares la búsqueda si 1–3 chars
        // opcional: resetear página si usas paginación
        setPage(0);

        // Si quieres mantener un pequeño debounce para evitar doble click/enter rápidos:
        searchTimerRef.current = setTimeout(() => {
            getAccountOfSuppliers(1, pageSize, query);
        }, 150);
    };

    //
    const handleGenerateDocument = async (reportType) => {
        try {
            setLoading(true);
            setInformationLoadingText("Generando documento, espere un momento por favor...");

            const { status, blob, type, filename, data } = await paymentServices.getExcelAndPdfFile(selectedIds, reportType);
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

    const handleRowClick = (params) => {
        navigate(`/admin/fiduciary/collection-account-details/${params.id}`);
    }

    useEffect(() => {
        getAccountOfSuppliers(page + 1, pageSize, "");
    }, [page, pageSize]);

    return (
        <>
            <HeaderImage
                imageHeader={imgPayments}
                titleHeader={'Fiduciara'}
                bannerIcon={imgAdd}
                backgroundIconColor={'#2148C0'}
                bannerInformation={'Aquí podrás ver el listado de cuentas de cobro.'}
                backgroundInformationColor={'#40A581'}
            />

            <Container>

                <Row className="payments-toolbar gy-2 align-items-center mt-3 mb-3">
                    <Col xs={12} md={6} lg={5} className="payments-toolbar__search">
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    runSearch();
                                }
                            }}
                            className="form-control search-input"
                        />
                    </Col>

                    <Col xs={6} md="auto" className="payments-toolbar__btn">
                        <Button
                            variant="outline-primary"
                            className="button-order-responsive btn-responsive"
                            onClick={() => runSearch()}
                            disabled={(searchQuery.trim().length > 0 && searchQuery.trim().length < 4) || loading}
                            title="Buscar"
                        >
                            Buscar
                        </Button>
                    </Col>

                    <Col xs={6} md="auto" className="payments-toolbar__btn payments-toolbar__btn--right">
                        <Button
                            variant="outline-success"
                            className="btn-responsive"
                            onClick={() => handleGenerateDocument(ReportTypePaymentsEnum.EXCEL)}
                            disabled={!selectedIds.length > 0}
                            title="Generar excel"
                        >
                            Generar Excel
                        </Button>
                    </Col>
                </Row>

                {loading && (
                    <div className="overlay">
                        <div className="loader">{informationLoadingText}</div>
                    </div>
                )}

                <div style={{ height: 600, width: "auto" }}>
                    <DataGrid
                        rows={dataTable}
                        columns={columns}
                        loading={loading}
                        checkboxSelection
                        onRowSelectionModelChange={handleSelectionChange}
                        onRowClick={handleRowClick}
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
                                    fontSize: "9px",
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

            </Container>
        </>
    )
}