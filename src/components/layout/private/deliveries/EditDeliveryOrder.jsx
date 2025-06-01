import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {Button, Container, Form, Spinner} from "react-bootstrap";
import { DataGrid } from "@mui/x-data-grid";

//Img
import imgDCSIPeople from "../../../../assets/image/addProducts/imgDSCIPeople.png";

//Services
import { deliveriesServices } from "../../../../helpers/services/DeliveriesServices";

//Enum
import { ResponseStatusEnum } from "../../../../helpers/GlobalEnum";
import AlertComponent from "../../../../helpers/alert/AlertComponent";

//Opciones para los productos a entregar
const deliveryStatus = [
    { id: 0, label: "NO ENTREGADO" },
    { id: 1, label: "ENTREGADO" },
    //{ id: 2, label: "PENDIENTE POR ENTREGAR" },
    { id: 3, label: "ENTREGA PARCIAL" }
];

export const EditDeliveryOrder = () => {

    const params = useParams();
    const navigate = useNavigate();

    const deliverId =  params.id;
    const [listDeliveryProducts, setListDeliveryProducts] = useState([]);
    const [cubId, setCubId] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const columns = [
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
        { field: "amount", headerName: "CANT. SOLICITADA", flex: 1 },
        {
            field: "quantityToBeDelivered",
            headerName: "CANT. A ENTREGAR",
            flex: 1,
            renderCell: (params) => {
                return (
                    <Form.Control
                        type="number"
                        className="small-input form-control-sm"
                        value={params.row.quantityToBeDelivered}
                        min="0"
                        onChange={(e) =>
                            handleQuantityChange(params.row.id, e.target.value)
                        }
                        style={{
                            width: "100%",
                            padding: "5px",
                            fontSize: "14px",
                            cursor: "pointer",
                        }}
                    />
                );
            },
        },
        {
            field: "state",
            headerName: "ESTADO",
            flex: 1.5,
            renderCell: (params) => {
                return (
                    <select
                        value={params.row.state}
                        onChange={(e) =>
                            handleStatusChange(params.row.id, parseInt(e.target.value))
                        }
                        style={{
                            width: "100%",
                            padding: "5px",
                            fontSize: "14px",
                            borderRadius: "4px",
                            border: "1px solid #ccc",
                            backgroundColor: "white",
                            cursor: "pointer",
                        }}
                    >
                        {deliveryStatus.map((option) => (
                            <option key={option.id} value={option.id}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                );
            },
        },
    ];

    //
    const getDeliveryById = async (id) => {
        try {
            const {data, status} = await deliveriesServices.getProductsFromDelivery(id);
            if (status === ResponseStatusEnum.OK) {
                setCubId(data.cub?.id);
                setListDeliveryProducts(normalizeRows(data.items));
            }
        } catch (error) {
            console.error("Error fetching deliveries:", error);
        }
    }

    const normalizeRows = (data) => {
        return data.map((row) => ({
            id: row?.id,
            name: row?.producto.nombre,
            description: row?.producto.especificacion_tecnicas,
            amount: row?.cantidad,
            quantityToBeDelivered: row?.quantityToDeliver || row?.cantidad,
            state: row?.estado,
            price: parseFloat(row?.valor_final),
        }));
    }

    const handleQuantityChange = (id, value) => {
        const newProducts = listDeliveryProducts.map((product) => {
            if (product.id === id) {
                return { ...product, quantityToBeDelivered: value.trim() === '' ? '' : Math.max(0, Number(value)) };
            }
            return product;
        });
        setListDeliveryProducts(newProducts);
    };

    const handleStatusChange = (id, value) => {
        const newProducts = listDeliveryProducts.map((product) => {
            if (product.id === id) {
                return { ...product, state: value };
            }
            return product;
        });
        setListDeliveryProducts(newProducts);
    };

    //
    const handleSaveProduct = async () => {
        setIsLoading(true);
        try {
            const dataSaveProducts = listDeliveryProducts.map(prod => ({
                producto: prod?.id,
                cantidad: prod?.quantityToBeDelivered,
                estado: prod?.state
            }));

            console.log('params.id: ', params.id, 'dataSaveProducts: ', dataSaveProducts);

            const {data, status} = await deliveriesServices.editDelivery(deliverId, dataSaveProducts);
            if(status === ResponseStatusEnum.OK) {
                showAlert('Éxito', 'Producto actualizado correctamente.')
            }

            if(status === ResponseStatusEnum.BAD_REQUEST) {
                showError('Error', `${data.message + ' ,debes entregar al menos un producto'}`);
            }
        } catch (error) {
            showError('Error al guardar los productos', `${error}`);
        } finally {
            setIsLoading(false);
        }
    };

    //
    const showAlert = (title, message) => {
        AlertComponent.success(title, message);
    };

    //
    const showError = (title, message) => {
        AlertComponent.error(title, message);
    };

    const handleBack = () => {
        navigate(`/admin/deliveries/${cubId}`)
    }

    useEffect(() => {
        if (params.id) {
            getDeliveryById(params.id);
        }
    }, []);

    return (
        <>
            <div className="main-container">
                <div className="header-image position-relative">
                    <img src={imgDCSIPeople} alt="Fondo" className="background-image w-100" />
                    <div className="overlay-text position-absolute w-100 text-center">
                        <h1>¡Editar entrega de productos!</h1>
                    </div>
                </div>

                {isLoading && (
                    <div className="spinner-container">
                        <Spinner animation="border" variant="success" />
                        <span>Editando productos...</span>
                    </div>
                )}

                <div className="p-5">
                    <Container>

                        <DataGrid
                            rows={listDeliveryProducts}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5, 10, 20]}
                            disableColumnMenu
                            disableSelectionOnClick
                            componentsProps={{
                                columnHeader: {
                                    style: {
                                        textAlign: "left", // Alinea los títulos a la izquierda
                                        fontWeight: "bold", // Opcional: Aplica un peso específico
                                        fontSize: "14px", // Ajusta el tamaño de fuente
                                        wordWrap: "break-word", // Permite que el título se divida en varias líneas
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

                        <div className="button-container mt-2 d-flex flex-md-row flex-column justify-content-md-end justify-content-center">
                            <Button
                                variant="success"
                                size="lg"
                                onClick={handleBack}
                                className="responsive-button mb-2 mb-md-0"
                                style={{
                                    backgroundColor: "#2148C0",
                                    borderColor: "#007BFF",
                                    fontWeight: "bold",
                                }}
                            >
                                <i className="fas fa-save me-2"></i>ATRÁS
                            </Button>

                            <Button
                                variant="success"
                                size="lg"
                                onClick={handleSaveProduct}
                                className="responsive-button"
                                style={{
                                    backgroundColor: "#BFD732",
                                    borderColor: "#BFD732",
                                    fontWeight: "bold",
                                }}
                            >
                                <i className="fas fa-save me-2"></i>EDITAR ENTREGA
                            </Button>
                        </div>

                    </Container>
                </div>

            </div>
        </>
    )

}