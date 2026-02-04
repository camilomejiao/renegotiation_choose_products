import { DataGrid } from "@mui/x-data-grid";
import {useEffect, useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
import {Button, Col, Container, Nav, Row} from "react-bootstrap";

//Components
import { HeaderImage } from "../../../../shared/header_image/HeaderImage";

//img
import imgPayments from "../../../../../../assets/image/payments/pay-supplier.png";
import imgAdd from "../../../../../../assets/image/payments/imgPay.png";

//Services
import { paymentServices } from "../../../../../../helpers/services/PaymentServices";

//Enum
import { CollectionAccountStatusEnum, ResponseStatusEnum } from "../../../../../../helpers/GlobalEnum";

//
const STATUS_ARRAY = Object.values(CollectionAccountStatusEnum);

export const SearchPaymentRequests = () => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [dataTable, setDataTable] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(100);
    const [rowCount, setRowCount] = useState(0);

    const [searchQuery, setSearchQuery] = useState("");

    const [activeStatusKey, setActiveStatusKey] = useState(CollectionAccountStatusEnum.REGISTERED.key);

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

    const getStatusValueFromKey = (key) => STATUS_ARRAY.find((s) => s.key === key)?.key ?? null;

    const getAccountOfSuppliers = async (pageToFetch = 1, sizeToFetch = 100, search = "", statusKey = "") => {
        setLoading(true);
        try {
            const statusValue = getStatusValueFromKey(statusKey);
            const {data, status} = await paymentServices.getCollectionAccounts(pageToFetch, sizeToFetch, '', statusValue, search);
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
        return data.map((row) => ({
            id: row?.id,
            collection_account: row?.numero,
            status: row?.estado_nombre,
            date: row?.fecha_cuenta_cobro.split("T")[0],
            supplier_name: row?.nombre_proveedor,
            supplier_nit: row?.nit_proveedor,
            total: `$ ${parseFloat(row?.valor_total).toLocaleString()}`,
        }));
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
        if (!canSearch) return;
        //opcional: resetear página si usas paginación
        setPage(0);

        //Si quieres mantener un pequeño debounce para evitar doble click/enter rápidos:
        searchTimerRef.current = setTimeout(() => {
            getAccountOfSuppliers(1, pageSize, query, '');
        }, 150);
    };

    const handleChangeStatus = (newKey) => {
        if (newKey === activeStatusKey) return;
        setActiveStatusKey(newKey);
        setPage(0);
        setSearchQuery("");
        getAccountOfSuppliers(1, pageSize, "", newKey);
    };

    useEffect(() => {
        getAccountOfSuppliers(page + 1, pageSize, searchQuery, activeStatusKey);
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
                            title={"Buscar"}
                        >
                            Buscar
                        </Button>
                    </Col>

                    <Col xs={12} md={5}>
                        <Nav variant="tabs" activeKey={activeStatusKey} onSelect={(k) => handleChangeStatus(k)}>
                            {STATUS_ARRAY.map(st => (
                                <Nav.Item key={st.key}>
                                    <Nav.Link eventKey={st.key}>{st.label}</Nav.Link>
                                </Nav.Item>
                            ))}
                        </Nav>
                    </Col>
                </Row>

                <div style={{ height: 600, width: "auto" }}>
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