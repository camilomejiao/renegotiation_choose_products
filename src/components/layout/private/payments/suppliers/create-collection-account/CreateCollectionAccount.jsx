import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "react-bootstrap";
import { FaSave, FaStepBackward } from "react-icons/fa";

//Services
import { paymentServices } from "../../../../../../helpers/services/PaymentServices";

//Enums
import { ResponseStatusEnum } from "../../../../../../helpers/GlobalEnum";

export const CreateCollectionAccount = () => {

    const navigate = useNavigate();

    const [dataTable, setDataTable] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(100);
    const [rowCount, setRowCount] = useState(0);
    const [selectedIds, setSelectedIds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sendingData, setSendingData] = useState(false);

    //
    const statusCollectionAccountColumns = [
        { field: "id", headerName: "ID", width: 150 },
        { field: "name", headerName: "Nombre", width: 150 },
        { field: "identification", headerName: "Identificacion", width: 150 },
        { field: "territorial_status", headerName: "Territorial", width: 150 },
        { field: "tecnical_status", headerName: "Tecnico", width: 150 },
        { field: "supervision_status", headerName: "Supervisión", width: 150 },
    ]

    const getApprovedDeliveries = async (pageToFetch = 1, sizeToFetch) => {
        setLoading(true);
        try {
            const {data, status} = await paymentServices.getAllApprovedDeliveriesBySupplier(pageToFetch, sizeToFetch);
            console.log(data);
            if (status === ResponseStatusEnum.OK) {
                const rows = await normalizeRows(data.results);
                setDataTable(rows);
                setRowCount(data.count);
            }
        } catch (error) {
            console.error("Error creando la cuenta de cobro:", error);
        } finally {
            setLoading(false);
        }
    }

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

    //Manejar selección de filas
    const handleSelectionChange = (newSelection) => {
        setSelectedIds(newSelection);
    };

    //
    const handleSaveUsers = async () => {
        setSendingData(true)

        const payload = [selectedIds];
        console.log('payload: ', payload);

        try {
            const {data, status} = await paymentServices.createCollectionAccounts(payload);
            console.log(data);
            if (status === ResponseStatusEnum.OK) {

            }
        } catch (error) {
            console.error("Error creando la cuenta de cobro:", error);
        } finally {
            setSendingData(false)
        }
    }

    const onBack = () => {
        navigate(`/admin/payments-suppliers`);
    }

    useEffect(() => {
        getApprovedDeliveries(page + 1, pageSize);
    }, [page, pageSize]);

    return (
        <>
            <div className="container mt-lg-5">
                {sendingData && (
                    <div className="overlay">
                        <div className="loader">Enviando informacion...</div>
                    </div>
                )}

                <div style={{ height: 500, width: "100%" }}>
                    <DataGrid
                        checkboxSelection
                        rows={dataTable}
                        columns={statusCollectionAccountColumns}
                        loading={loading}
                        paginationMode="server"
                        rowCount={rowCount}
                        pageSizeOptions={[50, 100]}
                        paginationModel={{ page, pageSize }}
                        onPaginationModelChange={({ page, pageSize }) => {
                            setPage(page);
                            setPageSize(pageSize);
                        }}
                        onRowSelectionModelChange={handleSelectionChange}
                        sx={{
                            "& .MuiDataGrid-columnHeaders": {
                                backgroundColor: "#40A581",
                                color: "white",
                                fontSize: "14px",
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
                                fontSize: "14px",
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

                <div className="d-flex justify-content-end gap-2 mt-3" >
                    <Button
                        variant="secondary"
                        size="md"
                        onClick={() => onBack()}
                    >
                        <FaStepBackward/> Atras
                    </Button>
                    <Button
                        variant="success"
                        size="md"
                        onClick={() => handleSaveUsers()}
                    >
                        <FaSave/> Crear cuenta de cobro
                    </Button>
                </div>
            </div>
        </>
    )
}