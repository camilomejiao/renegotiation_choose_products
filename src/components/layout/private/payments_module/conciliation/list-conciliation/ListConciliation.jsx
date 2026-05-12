import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
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
import { SmartTable } from "../../../../../../shared/ui/smart-table";

export const ListConciliation = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [dataTable, setDataTable] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(100);
    const [rowCount, setRowCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");

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
        if (!canSearch) return; // no dispares la búsqueda si 1-3 chars
        setPage(1);

        searchTimerRef.current = setTimeout(() => {
            setAppliedSearch(query);
        }, 150);
    };

    const handleRowClick = (record) => {
        navigate(`/admin/conciliation/conciliation-detail/${record.id}`);
    }

    useEffect(() => {
        getAccountOfIssuedForPayment(page, pageSize, appliedSearch);
    }, [page, pageSize, appliedSearch]);

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
                            onClick: () => handleRowClick(record),
                        })}
                        defaultText="---"
                        emptyText="No hay cuentas de cobro registradas."
                        enableRowSelection={false}
                        showToolbar={false}
                        showTableResize={false}
                        showColumnSettings={false}
                        scroll={{ x: 1200 }}
                    />
                </div>
            </Container>

        </>
    )
}
