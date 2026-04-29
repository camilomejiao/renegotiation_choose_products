import { useEffect, useRef, useState } from "react";
import { Loading } from "../../../../shared/loading/Loading";
import { Button, Col, Row } from "react-bootstrap";
//
import { useOutletContext } from "react-router-dom";

//
import AlertComponent from "../../../../../../helpers/alert/AlertComponent";

//Services
import { paymentServices } from "../../../../../../helpers/services/PaymentServices";
import { deliveriesServices } from "../../../../../../helpers/services/DeliveriesServices";

//Enum
import { ReportTypePaymentsEnum, ResponseStatusEnum, RolesEnum } from "../../../../../../helpers/GlobalEnum";
import { SmartTable } from "../../../../../../shared/ui/smart-table";

/** Roles que pueden ver el boton descargra. */
const canShowRoles = [RolesEnum.ADMIN, RolesEnum.SUPERVISION, RolesEnum.PAYMENTS, RolesEnum.TRUST_PAYMENTS];
export const BeneficiaryDeliveryList = ({ onRowSelect }) => {

    const { userAuth } = useOutletContext();
    const canShowButton = canShowRoles.includes(userAuth.rol_id);

    const [dataTable, setDataTable] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(100);
    const [rowCount, setRowCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [informationLoadingText, setInformationLoadingText] = useState("");

    const searchTimerRef = useRef(null);

    const columns = [
        { title: "N° Entrega", dataIndex: "id", key: "id", width: 110 },
        { title: "Fecha Aprobación", dataIndex: "approval_date", key: "approval_date", width: 150 },
        { title: "CUB", dataIndex: "cub_id", key: "cub_id", width: 100 },
        { title: "Beneficiario", dataIndex: "name", key: "name", width: 320 },
        { title: "Identificación", dataIndex: "identification", key: "identification", width: 160 },
        { title: "Proveedor", dataIndex: "supplier_name", key: "supplier_name", width: 320 },
        { title: "Nit", dataIndex: "supplier_nit", key: "supplier_nit", width: 160 },
    ];

    const getDeliveryList = async (pageToFetch = 1, sizeToFetch = 100, search = "") => {
        setLoading(true);
        try {
            const { data, status } = await paymentServices.getApprovedDeliveries(pageToFetch, sizeToFetch, search);
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
    };

    const normalizeRows = async (data) => {
        return data.map((row) => {
            const approvalDate = userAuth.rol_id === RolesEnum.SUPERVISION ? row?.fecha_aprobacion_tecnica.split('T')[0] : row?.fecha_aprobado_supervision.split('T')[0];
            return {
                id: row?.id,
                cub_id: row?.beneficiario?.cub_id,
                approval_date: approvalDate,
                name: `${row?.beneficiario?.nombre_completo ?? ''}`,
                identification: row?.beneficiario?.identificacion,
                supplier_name: row?.proveedor?.nombre,
                supplier_nit: row?.proveedor?.nit,
            }
        });
    }

    const handleRowClick = (record) => {
        onRowSelect(record.id);
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
        if (!canSearch) return; // no dispares la busqueda si 1-3 caracteres

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

    useEffect(() => {
        getDeliveryList(page, pageSize, appliedSearch);
    }, [page, pageSize, appliedSearch]);

    return (
        <>
            <Row className="payments-toolbar gy-2 align-items-center mt-3 mb-3">
                <Col xs={12} md={6} lg={5} className="payments-toolbar__search">
                    <input
                        type="text"
                        placeholder="Buscar por Nombre/CUB/NIT..."
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
                        className="button-order-responsive"
                        onClick={() => runSearch()}
                        disabled={
                            (searchQuery.trim().length > 0 && searchQuery.trim().length < 5) || loading
                        }
                        title={"Buscar"}
                    >
                        Buscar
                    </Button>
                </Col>

                {canShowButton && (
                    <Col xs={6} md="auto" className="payments-toolbar__btn payments-toolbar__btn--right">
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
                        onClick: () => handleRowClick(record),
                    })}
                    defaultText="---"
                    emptyText="No hay entregas aprobadas registradas."
                    enableRowSelection={false}
                    showToolbar={false}
                    showTableResize={false}
                    showColumnSettings={false}
                    scroll={{ x: 1500 }}
                />
            </div>
        </>
    )
}

