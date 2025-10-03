import imgPayments from "../../../../../assets/image/payments/payments.png";
import imgAdd from "../../../../../assets/image/payments/imgPay.png";
import {HeaderImage} from "../../../shared/header_image/HeaderImage";
import {useEffect, useRef, useState} from "react";
import {DataGrid} from "@mui/x-data-grid";
import {beneficiaryColumns} from "../../../../../helpers/utils/PaymentsColumns";
import {paymentServices} from "../../../../../helpers/services/PaymentServices";
import {ResponseStatusEnum} from "../../../../../helpers/GlobalEnum";
import {Button, Col, Row} from "react-bootstrap";

export const CorrectionDeliveries = () => {

    const [dataTable, setDataTable] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(100);
    const [rowCount, setRowCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);

    const searchTimerRef = useRef(null);

    const baseColumns = beneficiaryColumns();
    const columns = [...baseColumns];

    const getCorrectionDeliveries = async (pageToFetch = 1, sizeToFetch = 100, search = "") => {
        setLoading(true);
        try {
            const {data, status} = await paymentServices.getApprovedDeliveries(pageToFetch, sizeToFetch, search);
            if (status === ResponseStatusEnum.OK) {
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
            cub_id: row?.beneficiario?.cub_id,
            name: `${row?.beneficiario?.nombre_completo ?? ''}`,
            identification: row?.beneficiario?.identificacion,
            supplier_name: row?.proveedor?.nombre,
            supplier_nit: row?.proveedor?.nit,
        }));
    }

    const handleRowClick = (params) => {
        console.log(params.id);
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
            getCorrectionDeliveries(1, pageSize, query);
        }, 150);
    };

    useEffect(() => {
        getCorrectionDeliveries(page + 1, pageSize, "");
    }, [page, pageSize]);

    return (
        <>
            <HeaderImage
                imageHeader={imgPayments}
                titleHeader={'Subsanación De Entregas'}
                bannerIcon={imgAdd}
                backgroundIconColor={'#2148C0'}
                bannerInformation={'Aquí podrás revisar tus entregas que estan en estado de subsanación.'}
                backgroundInformationColor={'#F66D1F'}
            />

            <div className="container mt-lg-5">

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
                        className="form-control"
                    />
                </Col>

                <Col>
                    <Button
                        variant="outline-primary"
                        className="button-order-responsive"
                        onClick={() => runSearch()}
                        disabled={
                            (searchQuery.trim().length > 0 &&
                                searchQuery.trim().length < 5) || loading
                        }
                        title={
                            searchQuery.trim().length > 0 && searchQuery.trim().length < 5
                                ? "Escribe al menos 5 caracteres"
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
                                    fontSize: "10px",
                                    wordWrap: "break-word",
                                },
                            },
                        }}
                        sx={{
                            "& .MuiDataGrid-columnHeaders": {
                                backgroundColor: "#40A581",
                                color: "white",
                                fontSize: "14px",
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
                            "& .MuiSelect-root": {
                                fontSize: "12px",
                                fontFamily: "Arial, sans-serif",
                                width: "100%",
                            },
                            "& .MuiDataGrid-row:hover": {
                                backgroundColor: "#E8F5E9",
                            },
                        }}
                    />

                </div>
            </div>
            
        </>
    )
}