
//Img
import imgPayments from "../../../../../assets/image/payments/pay-supplier.png";
import imgAdd from "../../../../../assets/image/payments/imgPay.png";
import imgWorker from "../../../../../assets/image/payments/worker.png";
import imgHead from "../../../../../assets/image/payments/head-calendar.png";
import imgPlus from "../../../../../assets/image/payments/plus.png";

//Components
import { HeaderImage } from "../../../shared/header-image/HeaderImage";

//Css
import './PaySuppliers.css';
import {useState} from "react";
import {Button, Spinner} from "react-bootstrap";
import {DataGrid} from "@mui/x-data-grid";
import {FaSave} from "react-icons/fa";

export const PaySuppliers = () => {

    const [showCreateCollectionAccount, setShowCreateCollectionAccount] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateCollectionAccount = () => {
        setShowCreateCollectionAccount(true);

    }

    const CreateCollectionAccountColumns = [
        { field: "id", headerName: "ID", width: 150 },
        { field: "name", headerName: "Nombre", width: 150 },
        { field: "identification", headerName: "Identificacion", width: 150 },
    ];

    //Manejar selección de filas
    const handleSelectionChange = (newSelection) => {
        setSelectedIds(newSelection);
    };

    //
    const handleSaveUsers = () => {

    }

    return (
        <>
            <HeaderImage
                imageHeader={imgPayments}
                titleHeader={'Proceso de pago'}
                bannerIcon={imgAdd}
                backgroundIconColor={'#2148C0'}
                bannerInformation={'Aquí podrás revisar el estado de tus órdenes de pago.'}
                backgroundInformationColor={'#F66D1F'}
            />

            <div className="supplier-header">
                <div className="supplier-content">
                    <h2>Proveedor</h2>
                    <img src={imgWorker} alt="Proveedor" className="supplier-img" />
                </div>
            </div>
            <div className="supplier-footer">
                <div className="footer-content" onClick={handleCreateCollectionAccount} style={{ cursor: "pointer" }}>
                    <img src={imgHead} alt="Ícono calendario" />
                    <span>Crear nueva cuenta de cobro</span>
                    <img src={imgPlus} alt="Plus"  />
                </div>
            </div>

            {isLoading && (
                <div className="spinner-container">
                    <Spinner animation="border" variant="success" />
                    <span>Cargando...</span>
                </div>
            )}

            <div  className="container mt-lg-5">
                {showCreateCollectionAccount && (
                    <>
                        <div style={{height: 500, width: "100%"}}>
                            <DataGrid
                                checkboxSelection
                                onRowSelectionModelChange={handleSelectionChange}
                                rows={''}
                                columns={CreateCollectionAccountColumns}
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
                                variant="success"
                                size="md"
                                onClick={handleSaveUsers}
                            >
                                Guardar <FaSave/>
                            </Button>
                        </div>
                    </>
                )}


            </div>

        </>
    )
}