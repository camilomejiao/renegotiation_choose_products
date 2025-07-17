import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//Components
import { HeaderImage } from "../../../../shared/header_image/HeaderImage";

//img
import imgPayments from "../../../../../../assets/image/payments/pay-supplier.png";
import imgAdd from "../../../../../../assets/image/payments/imgPay.png";


export const ListAccountOfSuppliers = () => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [dataTable, setDataTable] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(100);
    const [rowCount, setRowCount] = useState(0);

    const columns = [
        { field: "id", headerName: "N° Cuenta de Cobro", width: 250 },
        { field: "date", headerName: "Fecha Creación", width: 200 },
        { field: "supplier_nit", headerName: "Nit", width: 250 },
        { field: "supplier_name", headerName: "Proveedor", width: 380 },
        { field: "total", headerName: "Valor Total", width: 200 },
    ];

    const getAccountOfSuppliers = (pageToFetch = 1, sizeToFetch) => {
        setLoading(true);
        try {

        } catch (error) {
            console.error("Error obteniendo las entregas:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleRowClick = (params) => {
        navigate(`/admin/fiduciary/collection-account-details/${params.id}`);
    }

    useEffect(() => {
        getAccountOfSuppliers(page + 1, pageSize);
    }, [page, pageSize]);

    return (
        <>

            <HeaderImage
                imageHeader={imgPayments}
                titleHeader={'Fiduciara'}
                bannerIcon={imgAdd}
                backgroundIconColor={'#2148C0'}
                bannerInformation={'Aquí podrás ver el lisatdo de cuentas de cobro.'}
                backgroundInformationColor={'#40A581'}
            />

            <div className="container mt-lg-5">
                <div style={{ height: 500, width: "100%" }}>
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
            </div>
        </>
    )
}