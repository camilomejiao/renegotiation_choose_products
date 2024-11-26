import { Box } from "@mui/material";
import { Button, Container } from "react-bootstrap";
import { FaCheck, FaPlus } from "react-icons/fa";
import { DataGrid } from "@mui/x-data-grid";

//Components
import { HeaderImage } from "../../shared/header-image/HeaderImage";
import { Footer } from "../../shared/footer/Footer";

//Img
import imgPeople from "../../../../assets/image/addProducts/people1.jpg";


export const Products = () => {

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

    return (
        <>
            <div className="main-container">
                <HeaderImage
                    imageHeader={imgPeople}
                    titleHeader={'¡Empieza a agregar tus productos!'}
                    bannerIcon={''}
                    bannerInformation={''}
                />

                <Box>
                    <Container>
                        <div className="p-3">
                            <Button
                                variant="success"
                                size="lg"
                                onClick={''}
                                className="responsive-button"
                                style={{
                                    backgroundColor: "#2148C0",
                                    borderColor: "#007BFF",
                                    fontWeight: "bold",
                                }}
                            >
                                Agregar producto <FaPlus />
                            </Button>
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



                    </Container>
                </Box>



                <Footer />
            </div>
        </>
    )
}