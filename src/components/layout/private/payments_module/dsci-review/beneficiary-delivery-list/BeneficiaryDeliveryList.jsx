import { useEffect, useRef, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
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

/** Roles que pueden ver el boton descargra. */
const canShowRoles = [RolesEnum.ADMIN, RolesEnum.SUPERVISION];
export const BeneficiaryDeliveryList = ({ onRowSelect }) => {

    const { userAuth } = useOutletContext();
    const canShowButton = canShowRoles.includes(userAuth.rol_id);

    const [dataTable, setDataTable] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(100);
    const [rowCount, setRowCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [informationLoadingText, setInformationLoadingText] = useState("");

    const searchTimerRef = useRef(null);

    const columns = [
        { field: "id", headerName: "N° Entrega", width: 100 },
        { field: "cub_id", headerName: "CUB", width: 80 },
        { field: "name", headerName: "Beneficiario", width: 350 },
        { field: "identification", headerName: "Identificación", width: 100 },
        { field: "supplier_name", headerName: "Proveedor", width: 350 },
        { field: "supplier_nit", headerName: "Nit", width: 150 },
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
        return data.map((row) => ({
            id: row?.id,
            cub_id: row?.beneficiario?.cub_id,
            name: `${row?.beneficiario?.nombre_completo ?? ''}`,
            identification: row?.beneficiario?.identificacion,
            supplier_name: row?.proveedor?.nombre,
            supplier_nit: row?.proveedor?.nit,
        }));
    }

    const handleRowClick = (params) => {
        onRowSelect(params.id);
    }

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    //
    const runSearch = (q = searchQuery) => {
        // limpia un debounce previo
        if (searchTimerRef.current) clearTimeout(searchTimerRef.current);

        const query = (q || "").trim().toLowerCase();
        const canSearch = query.length === 0 || query.length >= 5;
        if (!canSearch) return; // no dispares la búsqueda si 1–4 chars

        // opcional: resetear página si usas paginación
        setPage(0);

        // Si quieres mantener un pequeño debounce para evitar doble click/enter rápidos:
        searchTimerRef.current = setTimeout(() => {
            getDeliveryList(1, pageSize, query);
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
        getDeliveryList(page + 1, pageSize, "");
    }, [page, pageSize]);

    return (
        <>
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
        </>
    )
}