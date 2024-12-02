import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "react-bootstrap";
import { FaBroom, FaCheck, FaPlus, FaSearch } from "react-icons/fa";
import { DataGrid } from "@mui/x-data-grid";

//Components
import { HeaderImage } from "../../shared/header-image/HeaderImage";
import { Footer } from "../../shared/footer/Footer";

//Img
import imgPeople from "../../../../assets/image/addProducts/people1.jpg";



export const Products = () => {

    const navigate = useNavigate();

    const productColumns = [
        { field: "id", headerName: "COD", flex: 0.5 },
        {
            field: "name",
            headerName: "NOMBRE",
            flex: 2,
            headerAlign: "left",
            renderCell: (params) => (
                <div
                    style={{
                        textAlign: "left",
                        whiteSpace: "normal",
                        overflow: "visible",
                    }}
                >
                    {params.value}
                </div>
            ),
        },
        {
            field: "description",
            headerName: "DESCRIPCIÓN",
            flex: 3,
            headerAlign: "left",
            renderCell: (params) => (
                <div
                    style={{
                        textAlign: "left",
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                        overflow: "visible",
                    }}
                >
                    {params.value}
                </div>
            ),
        },
        {
            field: "brand",
            headerName: "MARCA",
            flex: 2,
            headerAlign: "left",
            renderCell: (params) => (
                <div
                    style={{
                        textAlign: "left",
                        whiteSpace: "normal",
                        overflow: "visible",
                    }}
                >
                    {params.value}
                </div>
            ),
        },
        {
            field: "state",
            headerName: "ESTADO",
            flex: 1.5,
            renderCell: (params) => {
                return (
                    <div
                        style={{
                            textAlign: "left",
                            whiteSpace: "normal",
                            wordWrap: "break-word",
                            overflow: "visible",
                        }}
                    >
                        {params.value}
                    </div>
                );
            },
        },
        {
            field: "actions",
            headerName: "ACCIONES",
            width: 150,
            renderCell: (params) => {
                return (
                    <div>
                        <Button
                            variant="success"
                            size="sm"
                            // onClick={() =>
                            //     handleApproveByAudit(params.row.id)
                            // }
                        >
                            <FaCheck />
                        </Button>
                    </div>
                )},
            sortable: false,
            filterable: false,
        },
    ];

    const handleCreateProducts = () => {
        navigate(`/admin/create-products`);
    }

    useEffect(() => {

    }, [])

    return (
        <>
            <div className="main-container">
                <HeaderImage
                    imageHeader={imgPeople}
                    titleHeader={'¡Listado de productos!'}
                    bannerIcon={''}
                    bannerInformation={''}
                />

                <div className="container mt-lg-3">
                    <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center mt-3 mb-3">
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={''}
                            onChange={''}
                            className="input-responsive"
                        />
                        <div className="d-flex flex-column flex-md-row w-100 w-md-auto">
                            <Button
                                variant="primary"
                                size="md"
                                onClick={''}
                                className="button-order-responsive"
                            >
                                Buscar <FaSearch />
                            </Button>
                            <Button
                                variant="outline-success"
                                size="md"
                                onClick={''}
                                className="button-order-responsive"
                            >
                                Limpiar <FaBroom />
                            </Button>

                            <Button
                                variant="primary"
                                size="md"
                                onClick={handleCreateProducts}
                                className="button-order-responsive"
                                style={{
                                    backgroundColor: "#2148C0",
                                    borderColor: "#007BFF",
                                    fontWeight: "bold",
                                }}
                            >
                                Agregar producto <FaPlus />
                            </Button>
                        </div>
                    </div>

                    <div>
                        <DataGrid
                            columns={productColumns}
                            rows={''}
                            //rowCount={rowCountState}
                            //loading={isLoading}
                            //paginationModel={paginationModel}
                            //onPaginationModelChange={setPaginationModel}
                            //paginationMode="server"
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
                <Footer />
            </div>
        </>
    )
}