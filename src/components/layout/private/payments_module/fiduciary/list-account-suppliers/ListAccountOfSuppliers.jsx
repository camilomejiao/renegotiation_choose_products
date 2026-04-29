import { Loading } from "../../../../shared/loading/Loading";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Col, Container, Row } from "react-bootstrap";

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
import { SmartTable } from "../../../../../../shared/ui/smart-table";

export const ListAccountOfSuppliers = () => {

    const navigate = useNavigate();

    const [dataTable, setDataTable] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(100);
    const [rowCount, setRowCount] = useState(0);
    const [selectedIds, setSelectedIds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [informationLoadingText, setInformationLoadingText] = useState("");

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
        { title: "Registró", dataIndex: "user", key: "user", width: 180 },
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
    const handleSelectionChange = (_selectedKeys, selectedRecords) => {
        const selectedAccounts = selectedRecords.map((row) => row.collection_account);
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
        if (!canSearch) return; // no dispares la busqueda si 1-3 chars
        setPage(1);

        searchTimerRef.current = setTimeout(() => {
            setAppliedSearch(query);
        }, 150);
    };

    //
    const handleGenerateDocument = async (reportType) => {
        try {
            setLoading(true);
            setInformationLoadingText("Generando documento, espere un momento por favor...");

            const { status, blob, type, filename } = await paymentServices.getExcelAndPdfFile(selectedIds, reportType);
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
    const handleGenerateExelPayments = async (reportType) => {
        try {
            setLoading(true);
            setInformationLoadingText("Generando documento, espere un momento por favor...");

            const { status, blob, type, filename } = await paymentServices.getFileCollectionAccountExcel();
            //console.log(blob, status);

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

    const handleRowClick = (record) => {
        navigate(`/admin/fiduciary/collection-account-details/${record.id}`);
    }

    useEffect(() => {
        getAccountOfSuppliers(page, pageSize, appliedSearch);
    }, [page, pageSize, appliedSearch]);

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
                            style={{marginRight: '5px'}}
                            variant="outline-success"
                            className="btn-responsive"
                            onClick={() => handleGenerateDocument(ReportTypePaymentsEnum.EXCEL)}
                            disabled={!selectedIds.length > 0}
                            title="Generar excel"
                        >
                            Generar Documento FCP
                        </Button>

                        <Button
                            variant="outline-secondary"
                            className="btn-responsive"
                            onClick={() => handleGenerateExelPayments(ReportTypePaymentsEnum.EXCEL)}
                            title="Generar excel"
                        >
                            Generar Reporte de Cuentas de cobro
                        </Button>
                    </Col>
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
                        onRowSelectionChange={handleSelectionChange}
                        onRow={(record) => ({
                            onClick: () => handleRowClick(record),
                        })}
                        defaultText="---"
                        emptyText="No hay cuentas de cobro registradas."
                        enableRowSelection
                        showToolbar={false}
                        showTableResize={false}
                        showColumnSettings={false}
                        scroll={{ x: 1600 }}
                    />
                </div>

            </Container>
        </>
    )
}

