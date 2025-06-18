import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "react-bootstrap";
import { FaSave, FaStepBackward } from "react-icons/fa";
import {paymentServices} from "../../../../../../helpers/services/PaymentServices";
import {ResponseStatusEnum} from "../../../../../../helpers/GlobalEnum";

export const CreateCollectionAccount = ({ onBack }) => {

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

    const getBeneficiaryList = () => {
        setLoading(true);
        try {

        } catch (error) {

        } finally {
            setLoading(false);
        }
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
            if (status === ResponseStatusEnum.OK) {

            }
        } catch (error) {
            console.error("Error creando la cuenta de cobro:", error);
        } finally {
            setSendingData(false)
        }
    }

    useEffect(() => {
        getBeneficiaryList();
    }, []);

    return (
        <>

            {sendingData && (
                <div className="overlay">
                    <div className="loader">Enviando informacion...</div>
                </div>
            )}

            <div style={{height: 500, width: "100%"}}>
                <DataGrid
                    checkboxSelection
                    onRowSelectionModelChange={handleSelectionChange}
                    loading={loading}
                    rows={[]}
                    columns={statusCollectionAccountColumns}
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
                    <FaSave/> Guardar
                </Button>
            </div>
        </>
    )
}