import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { paymentServices } from "../../../../../../helpers/services/PaymentServices";
import { ResponseStatusEnum } from "../../../../../../helpers/GlobalEnum";

export const BeneficiaryDeliveryList = ({ onRowSelect }) => {

    const [loading, setLoading] = useState(false);
    const [dataTable, setDataTable] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(100);
    const [rowCount, setRowCount] = useState(0);

    const beneficiaryColumns = [
        { field: "id", headerName: "N° Entrega", width: 100 },
        { field: "cub_id", headerName: "CUB", width: 100 },
        { field: "name", headerName: "Beneficiario", width: 300 },
        { field: "identification", headerName: "Identificación", width: 200 },
        { field: "supplier_name", headerName: "Proveedor", width: 350 },
        { field: "supplier_nit", headerName: "Nit", width: 150 },
    ];

    const getDeliveryList = async (pageToFetch = 1, sizeToFetch) => {
        setLoading(true);
        try {
            const { data, status } = await paymentServices.getApprovedDeliveries(pageToFetch, sizeToFetch);
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
            cub_id: row?.beneficiario?.id,
            name: `${row?.beneficiario?.nombre ?? ''} ${row?.beneficiario?.apellido ?? ''}`,
            identification: row?.beneficiario?.identificacion,
            supplier_name: row?.proveedor?.nombre,
            supplier_nit: row?.proveedor?.nit,
        }));
    }

    const handleRowClick = (params) => {
        onRowSelect(params.id);
    }

    useEffect(() => {
        getDeliveryList(page + 1, pageSize);
    }, [page, pageSize]);

    return (
        <>
            <div style={{ height: 500, width: "100%" }}>
                <DataGrid
                    rows={dataTable}
                    columns={beneficiaryColumns}
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
                            textAlign: "left",
                            justifyContent: "left",
                            alignItems: "flex-start",
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
        </>
    )
}