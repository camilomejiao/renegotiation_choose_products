import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Col, Container, Row } from "react-bootstrap";

//Img
import imgPayments from "../../../../../../assets/image/payments/pay-supplier.png";
import imgAdd from "../../../../../../assets/image/payments/imgPay.png";

//Services
import { paymentServices} from "../../../../../../helpers/services/PaymentServices";

//Enum
import { CollectionAccountStatusEnum, ResponseStatusEnum} from "../../../../../../helpers/GlobalEnum";

//components
import { HeaderImage } from "../../../../shared/header_image/HeaderImage";

export const ListConciliation = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [dataTable, setDataTable] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(100);
    const [rowCount, setRowCount] = useState(0);
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
    ];

    const getAccountOfIssuedForPayment = async (pageToFetch = 1, sizeToFetch, search = "") => {
        setLoading(true);
        try {
            const {data, status} = await paymentServices.getCollectionAccounts(pageToFetch, sizeToFetch, '', CollectionAccountStatusEnum.ISSUED_FOR_PAYMENT.key, search);
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
            };
        });
    }

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
            getAccountOfIssuedForPayment(1, pageSize, query);
        }, 150);
    };

    const handleRowClick = (params) => {
        navigate(`/admin/conciliation/conciliation-detail/${params.id}`);
    }

    useEffect(() => {
        getAccountOfIssuedForPayment(page + 1, pageSize, "");
    }, [page, pageSize]);

    return (
        <>
            <HeaderImage
                imageHeader={imgPayments}
                titleHeader={'Conciliación'}
                bannerIcon={imgAdd}
                backgroundIconColor={'#2148C0'}
                bannerInformation={'Aquí podrás ver el listado de cuentas de cobro.'}
                backgroundInformationColor={'#40A581'}
            />

            <Container>
                <Row className="gy-2 align-items-center mt-3 mb-3">
                    <Col xs={12} md={6} lg={5}>
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

                    <Col>
                        <Button
                            variant="outline-primary"
                            className="button-order-responsive"
                            onClick={() => runSearch()}
                            disabled={
                                (searchQuery.trim().length > 0 && searchQuery.trim().length < 4) || loading
                            }
                            title={
                                searchQuery.trim().length > 0 && searchQuery.trim().length < 4
                                    ? "Escribe al menos 4 caracteres"
                                    : "Buscar"
                            }
                        >
                            Buscar
                        </Button>
                    </Col>
                </Row>

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

