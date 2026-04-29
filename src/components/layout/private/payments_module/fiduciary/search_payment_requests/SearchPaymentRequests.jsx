import {useEffect, useRef, useState} from "react";
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
import { SmartTable } from "../../../../../../shared/ui/smart-table";

//
const STATUS_ARRAY = Object.values(CollectionAccountStatusEnum);

export const SearchPaymentRequests = () => {
    const [loading, setLoading] = useState(false);
    const [dataTable, setDataTable] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(100);
    const [rowCount, setRowCount] = useState(0);

    const [searchQuery, setSearchQuery] = useState("");

    const [activeStatusKey, setActiveStatusKey] = useState(CollectionAccountStatusEnum.REGISTERED.key);

    const searchTimerRef = useRef(null);

    const columns = [
        { title: "ID", dataIndex: "id", key: "id", width: 90 },
        { title: "N° Cuenta de Cobro", dataIndex: "collection_account", key: "collection_account", width: 180 },
        { title: "Estado", dataIndex: "status", key: "status", width: 160 },
        { title: "Fecha Creación", dataIndex: "date", key: "date", width: 150 },
        { title: "Nit", dataIndex: "supplier_nit", key: "supplier_nit", width: 140 },
        { title: "Proveedor", dataIndex: "supplier_name", key: "supplier_name", width: 320 },
        { title: "Valor Total", dataIndex: "total", key: "total", width: 160 },
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
        setPage(1);

        searchTimerRef.current = setTimeout(() => {
            getAccountOfSuppliers(1, pageSize, query, '');
        }, 150);
    };

    const handleChangeStatus = (newKey) => {
        if (newKey === activeStatusKey) return;
        setActiveStatusKey(newKey);
        setPage(1);
        setSearchQuery("");
        getAccountOfSuppliers(1, pageSize, "", newKey);
    };

    useEffect(() => {
        getAccountOfSuppliers(page, pageSize, searchQuery, activeStatusKey);
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
                        defaultText="---"
                        emptyText="No hay solicitudes de pago registradas."
                        enableRowSelection={false}
                        showToolbar={false}
                        showTableResize={false}
                        showColumnSettings={false}
                        scroll={{ x: 1400 }}
                    />
                </div>

            </Container>
        </>
    )
}
