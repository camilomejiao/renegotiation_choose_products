import { useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";
import {paymentServices} from "../../../../../../helpers/services/PaymentServices";
import {CollectionAccountStatusEnum, ResponseStatusEnum} from "../../../../../../helpers/GlobalEnum";
import {HeaderImage} from "../../../../shared/header_image/HeaderImage";
import imgPayments from "../../../../../../assets/image/payments/pay-supplier.png";
import imgAdd from "../../../../../../assets/image/payments/imgPay.png";
import {DataGrid} from "@mui/x-data-grid";


export const ListConciliation = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [dataTable, setDataTable] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(100);
    const [rowCount, setRowCount] = useState(0);

    const columns = [
        { field: "id", headerName: "ID", flex: 0.2 },
        { field: "collection_account", headerName: "N° Cuenta de Cobro", flex: 0.3 },
        { field: "date", headerName: "Fecha Creación", flex: 0.3 },
        { field: "supplier_nit", headerName: "Nit", flex: 0.4 },
        { field: "supplier_name", headerName: "Proveedor", flex: 1.5 },
        { field: "total", headerName: "Valor Total", flex: 0.5 },
    ];

    const getAccountOfIssuedForPayment = async (pageToFetch = 1, sizeToFetch) => {
        setLoading(true);
        try {
            const {data, status} = await paymentServices.getCollectionAccounts(pageToFetch, sizeToFetch, '', CollectionAccountStatusEnum.ISSUED_FOR_PAYMENT);
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
            date: row?.fecha_cuenta_cobro.split("T")[0],
            supplier_name: row?.nombre_proveedor,
            supplier_nit: row?.nit_proveedor,
            total: `$ ${parseFloat(row?.valor_total).toLocaleString()}`,
        }));
    }

    const handleRowClick = (params) => {
        navigate(`/admin/conciliation/conciliation-detail/${params.id}`);
    }

    useEffect(() => {
        getAccountOfIssuedForPayment(page + 1, pageSize);
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

            <div className="container mt-lg-5">
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
                                whiteSpace: 'normal',
                                wordBreak: 'break-word',
                                display: 'block',
                                paddingTop: '10px',
                                paddingBottom: '10px'
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