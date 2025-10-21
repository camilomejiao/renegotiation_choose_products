import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";

//Img
import imgDCSIPeople from "../../../../../assets/image/addProducts/imgDSCIPeople.png";

//Utils
import {getAccionColumns, getConvocationColumn} from "../../../../../helpers/utils/ManagementColumns";

//Services
import { convocationServices } from "../../../../../helpers/services/ConvocationServices";

//Enum
import { ResponseStatusEnum } from "../../../../../helpers/GlobalEnum";

//Helper
import AlertComponent from "../../../../../helpers/alert/AlertComponent";
import imgPayments from "../../../../../assets/image/payments/pay-supplier.png";
import imgAdd from "../../../../../assets/image/payments/imgPay.png";
import {HeaderImage} from "../../../shared/header_image/HeaderImage";


export const ConvocationList = () => {

    const navigate = useNavigate();

    const [convocations, setConvocations] = useState([]);
    const [filteredConvocations, setFilteredConvocations] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingTable, setLoadingTable] = useState(false);

    const getConvocationList = async () => {
        try {
            setLoading(true);
            setLoadingTable(true);
            const {data, status} = await convocationServices.get();
            if(status === ResponseStatusEnum.OK) {
                const convocationResponse = await normalizeRows(data);
                setConvocations(convocationResponse);
                setFilteredConvocations(convocationResponse);
            }

            if(status !== ResponseStatusEnum.OK) {
                AlertComponent.warning("Error", 'Al cargar los datos');
            }
        } catch (error) {
            console.error("Error al obtener la lista de jornadas:", error);
        } finally {
            setLoading(false);
            setLoadingTable(false);
        }
    }

    //
    const normalizeRows = async (data) => {
        const payload =  data.data.jornadas;

        return payload.map((row) => ({
            id: row?.id,
            name: row?.nombre,
            start_date: row?.fecha_inicio,
            end_date: row?.fecha_fin,
            remaining_days: row?.dias_restantes,
            status: row?.abierto ? 'ACTIVO' : 'INACTIVO',
            description: row?.estado_descripcion,
        }));
    };

    const handleEditClick = (rowId) => {
        navigate(`/admin/create-convocation/${rowId}`);
    }

    const handleDeleteClick = async (rowId) => {
        try {
            setLoading(true)
            const { status} = await convocationServices.delete(rowId);
            if (status === ResponseStatusEnum.OK) {
                AlertComponent.success('', 'Jornada eliminada exitosamente!');
                //reloadPage();
            }

            if (status === ResponseStatusEnum.INTERNAL_SERVER_ERROR) {
                AlertComponent.error('Error', 'No se ha podido eliminar la jornada');
                //reloadPage();
            }
        } catch (error) {
            console.error("Error al obtener la lista de productos:", error);
            AlertComponent.error('', 'Error al eliminar la jornada');
            reloadPage();
        } finally {
            setLoading(false);
        }
    }

    const handleActiveAndInactive = (rowId) => {
        console.log(rowId);
    }

    //
    const baseColumns = getConvocationColumn();
    const accions = getAccionColumns(handleActiveAndInactive, handleEditClick, handleDeleteClick);
    const columns = [...baseColumns, ...accions];

    //
    const handleSearchChange = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        const filteredData = convocations.filter((row) =>
            Object.values(row).some((value) =>
                value.toString().toLowerCase().includes(query)
            )
        );
        setFilteredConvocations(filteredData);
    };

    const reloadPage = () => {
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }

    useEffect(() => {
        getConvocationList();
    }, [])

    return (
        <>
            <HeaderImage
                imageHeader={imgPayments}
                titleHeader={'Gestión de jornadas'}
                bannerIcon={imgAdd}
                backgroundIconColor={'#2148C0'}
                bannerInformation={'Aquí podrás ver el listado de las jornadas.'}
                backgroundInformationColor={'#40A581'}
            />

            <div className="container mt-lg-3">

                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 w-100 mb-3 mt-5">
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="input-responsive me-2"
                    />
                    <div className="text-end">
                        <Button
                            variant="outline-success"
                            onClick={() => navigate('/admin/create-convocation')}
                            className="button-order-responsive"
                        >
                            <FaPlus/> Crear Jornada
                        </Button>
                    </div>
                </div>

                {loading && (
                    <div className="overlay">
                        <div className="loader">Cargando Datos...</div>
                    </div>
                )}

                <div style={{height: 600, width: "100%"}}>
                    <DataGrid
                        rows={filteredConvocations}
                        columns={columns}
                        editMode="row"
                        pagination
                        loading={loadingTable}
                        pageSize={100}
                        rowsPerPageOptions={[100, 500, 1000]}
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
            </div>


        </>
    )
}