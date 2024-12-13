import { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import Select from "react-select";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import {
    FaCheck,
    FaFilePdf,
    FaFileUpload,
    FaPencilAlt,
    FaTrash
} from "react-icons/fa";
import printJS from "print-js";
import { DataGrid } from "@mui/x-data-grid";

//Components
import { Footer } from "../../shared/footer/Footer";
import { DeliveryReport } from "./delivery-report/DeliveryReport";
import AlertComponent from "../../shared/alert/AlertComponent";

//Img
import imgDCSIPeople from "../../../../assets/image/addProducts/imgDSCIPeople.png";
import imgFrame2 from "../../../../assets/image/icons/deliveries-img.png";

//Services
import { authService } from "../../../../helpers/services/Auth";
import { deliveriesServices } from "../../../../helpers/services/DeliveriesServices";

//Css
import './Deliveries.css';

//Enum
import { RolesEnum, ResponseStatusEnum } from "../../../../helpers/GlobalEnum";
import {PhotographicEvidenceReport} from "./photographic-evidence-report/photographicEvidenceReport";
import {UserInformation} from "../user-information/UserInformation";
import {userService} from "../../../../helpers/services/UserServices";

//Opciones para los productos a entregar
const deliveryStatus = [
    { id: 0, label: "NO ENTREGADO" },
    { id: 1, label: "ENTREGADO" },
    //{ id: 2, label: "PENDIENTE POR ENTREGAR" },
    { id: 3, label: "ENTREGA PARCIAL" }
];

export const Deliveries = () => {

    const { userAuth } = useOutletContext();
    const params = useParams();
    const navigate = useNavigate();
    const deliveryReportRef = useRef();

    const [suppliers, setSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [listDeliveriesToUser, setListDeliveriesToUser] = useState([]);
    const [userData, setUserData] = useState({});
    const [showDeliveryForm, setShowDeliveryForm] = useState(false);
    const [deliveryProducts, setDeliveryProducts] = useState([]);
    const [deliveryInformation, setDeliveryInformation] = useState({});
    const [isReadyToPrintDeliveryInformation, setIsReadyToPrintDeliveryInformation] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    //Trae las compañias con las que el usuario realizó compras
    const getSuppliersFromWhomYouPurchased = async () => {
        try {
            if (userAuth.rol_id === RolesEnum.MANAGEMENT_TECHNICIAN || userAuth.rol_id === RolesEnum.ADMIN || userAuth.rol_id === RolesEnum.AUDITOR) {
                const { status, data } = await deliveriesServices.getSuppliers(params.id);
                if (status === ResponseStatusEnum.OK) {
                    setSuppliers(data);
                }
            }

            if (userAuth.rol_id === RolesEnum.SUPPLIER) {
                const itemId = await authService.getSupplierId();
                const singleSupplier = [{ id: itemId }];
                setSuppliers(singleSupplier);
            }
        } catch (error) {
            console.error("Error obteniendo proveedores:", error);
        }
    }

    //Listado de entregas al titular
    const getListDeliveriesToUser = async (cubId) => {
        try {
            const { data, status} = await deliveriesServices.searchDeliveriesToUser(cubId);
            if(status === ResponseStatusEnum.OK) {
                setListDeliveriesToUser(normalizeDeliveryRows(data));
            }
        } catch (error) {
            console.error("Error fetching deliveries:", error);
        }
    }

    const getUserInformation = async (cubId) => {
        try {
            const { data, status} = await userService.userInformation(cubId);

            if(status === ResponseStatusEnum.OK) {
                setUserData(data);
            }
        } catch (error) {
            console.log(error);
            showError(error, 'Error buscando productos:');
        }
    }

    // Definición de las columnas de entregas
    const deliveryColumns = [
        { field: "id", headerName: "N° ENTREGA", width: 150 },
        { field: "date", headerName: "FECHA", width: 150 },
        { field: "supplier", headerName: "PROVEEDOR", width: 200 },
        // {
        //     field: "evidence",
        //     headerName: "EVIDENCIAS",
        //     width: 300,
        //     renderCell: (params) => (
        //         <div
        //             style={{
        //                 display: "flex",
        //                 flexWrap: "wrap",
        //                 gap: "8px",
        //             }}
        //         >
        //             {[1, 2, 3, 4, 5, 6].map((fileNumber) => (
        //                 <Button
        //                     key={fileNumber}
        //                     variant="primary"
        //                     size="sm"
        //                     onClick={() => {
        //                         const input = document.createElement("input");
        //                         input.type = "file";
        //                         input.accept = "image/*";
        //                         input.style.display = "none";
        //                         input.onchange = (e) =>
        //                             handleFileChange(
        //                                 e,
        //                                 params.row.id,
        //                                 `imagen${fileNumber}`
        //                             );
        //                         document.body.appendChild(input);
        //                         input.click();
        //                         document.body.removeChild(input);
        //                     }}
        //                     style={{
        //                         flex: "none",
        //                         width: "100px",
        //                         textAlign: "center",
        //                         padding: "2px 4px",
        //                         fontSize: "12px",
        //                         lineHeight: "1",
        //                         borderRadius: "12px",
        //                     }}
        //                 >
        //                     Imagen {fileNumber} <FaFileUpload />
        //                 </Button>
        //             ))}
        //         </div>
        //     ),
        //     sortable: false,
        //     filterable: false,
        // },
        {
            field: "evidencePdf",
            headerName: "EVIDENCIAS PDF",
            width: 200,
            renderCell: (params) => (
                <div>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                            const input = document.createElement("input");
                            input.type = "file";
                            input.accept = "application/pdf";
                            input.style.display = "none";
                            input.onchange = (e) =>
                                handleFileChange(e, params.row.id, "pdf");
                            document.body.appendChild(input);
                            input.click();
                            document.body.removeChild(input);
                        }}
                    >
                        Subir PDF
                    </Button>
                </div>
            ),
            sortable: false,
            filterable: false,
        },
        {
            field: "generatePdf",
            headerName: "GENERAR PDF",
            width: 150,
            renderCell: (params) => (
                <div>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() =>
                            handleDeliveryInformationReport(params.row.id)
                        }
                    >
                        <FaFilePdf />
                    </Button>
                </div>
            ),
            sortable: false,
            filterable: false,
        },
        {
            field: "actions",
            headerName: "ACCIONES",
            width: 150,
            renderCell: (params) => (
                <div>
                    <Button
                        variant="warning"
                        size="sm"
                        onClick={() =>
                            handleEditDelivery(params.row.id)
                        }
                        style={{ marginRight: "10px" }}
                    >
                        <FaPencilAlt />
                    </Button>
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={() =>
                            handleDeleteDelivery(params.row.id)
                        }
                        style={{ marginRight: "10px" }}
                    >
                        <FaTrash />
                    </Button>
                    <Button
                        variant="success"
                        size="sm"
                        onClick={() =>
                            handleApproveByAudit(params.row.id)
                        }
                    >
                        <FaCheck />
                    </Button>
                </div>
            ),
            sortable: false,
            filterable: false,
        },
    ];

    //
    const normalizeDeliveryRows = (data) => {
        return data.map((row) => ({
            id: row.id,
            date: row.fecha_creacion.split("T")[0],
            supplier: row.proveedor,
        }));
    }

    //
    const productsToBeDeliveredColumns = [
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
    const normalizeProductsToBeDeliveredRows = (data) => {
        return data.map((row) => ({
            id: row.id,
            name: row.nombre,
            description: row.descripcion,
            amount: row.cantidad,
            quantityToBeDelivered: row.quantityToDeliver || 0,
            state: row.estado,
        }));
    }

    //Crear entrega
    const handleCreateDeliveries = async () => {
        if (!selectedSupplier && userAuth.rol_id === RolesEnum.MANAGEMENT_TECHNICIAN) {
            showError('Error', 'Debe escoger al menos una empresa');
            return;
        }
        setListDeliveriesToUser([]);
        setShowDeliveryForm(true);

        const dataSupplier = selectedSupplier ? selectedSupplier.value : suppliers[0].id;

        try {
            const { data, status} = await deliveriesServices.productsToBeDelivered(dataSupplier, params.id);

            if (status === ResponseStatusEnum.OK) {
                const updatedData = data.map(product => ({
                    ...product,
                    estado: 1,
                    quantityToDeliver: product.cantidad
                }));
                setDeliveryProducts(normalizeProductsToBeDeliveredRows(updatedData));
            }

            if(status === ResponseStatusEnum.BAD_REQUEST) {
                showError("Error", "Error al obtener las órdenes de compra");
            }
        } catch (error) {
            console.error("Error obteniendo productos a entregar:", error);
        }
    }

    //
    const handleEditDelivery = async (id) => {
        navigate(`/admin/edit-delivery-order/${id}`)
    }

    //
    const handleDeleteDelivery = async (id) => {

    }

    //
    const handleApproveByAudit = async (id) => {

    }

    //Guardar evidencias
    const handleFileChange = async (e, deliveryId, fileName) => {
        const selectedFile = e.target.files[0]; // Obtener el archivo seleccionado
        if (selectedFile) {
            // Validar el tipo de archivo
            const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
            if (!allowedTypes.includes(selectedFile.type)) {
                showError('Archivo no válido', 'Solo se permiten imágenes (PNG, JPEG, JPG) o archivos PDF.');
                return;
            }

            const formData = new FormData();
            formData.append("ruta", selectedFile);
            formData.append("indice", fileName);

            try {
                const { status } = await deliveriesServices.evidenceOfDeliveries(deliveryId, formData);

                if (status === ResponseStatusEnum.CREATE) {
                    showAlert('Éxito', 'Archivo enviado exitosamente');
                }

                if (status === ResponseStatusEnum.BAD_REQUEST ||
                    status === ResponseStatusEnum.INTERNAL_SERVER_ERROR ||
                    status !== ResponseStatusEnum.CREATE) {
                    showError('Error', 'Error al enviar el archivo');
                }
            } catch (error) {
                console.error("Error al enviar el archivo:", error);
                showError('Error', 'Error al enviar el archivo');
            }
        }
    };

    const handleDeliveryInformationReport = async (deliveryId) => {
        setIsLoading(true);
        try {
            const { data } = await deliveriesServices.deliveryReport(deliveryId);
            setDeliveryInformation(data);
            setIsReadyToPrintDeliveryInformation(true);
        } catch (error) {
            console.error("Error obteniendo el reporte:", error);
            showError('Error', 'Error obteniendo el reporte:');
        } finally {
            setIsLoading(false);
        }
    }

    const handlePDFPrint = () => {
        const printContent = `
            <html>
                <head>
                  <style>           
                    body {
                      font-family: Arial, sans-serif;
                      margin: 20px;
                      font-size: 10px;
                    }
                    .page-break {
                        page-break-after: always;
                    }
                  </style>
                </head>
                <body>
                  <!-- Inyectamos el HTML del componente -->
                  ${deliveryReportRef.current.innerHTML} 
                </body>
            </html>`;

        printJS({
            printable: printContent,
            type: 'raw-html',
            documentTitle: 'Reporte Entrega',
        });
    }

    //
    const handleQuantityChange = (id, value) => {
        const newProducts = deliveryProducts.map((product) => {
            if (product.id === id) {
                return { ...product, quantityToBeDelivered: value.trim() === '' ? '' : Math.max(0, Number(value)) };
            }
            return product;
        });
        setDeliveryProducts(newProducts);
    };

    //
    const handleStatusChange = (id, value) => {
        const newProducts = deliveryProducts.map((product) => {
            if (product.id === id) {
                return { ...product, state: value };
            }
            return product;
        });
        setDeliveryProducts(newProducts);
    };

    //
    const handleSaveProduct = async () => {
        try {
            //
            const dataSaveProducts = deliveryProducts.map(prod => ({
                producto: prod.id,
                cantidad: prod.quantityToBeDelivered,
                estado: prod.state
            }));

            const dataSupplier = selectedSupplier ? selectedSupplier.value : suppliers[0].id;

            const {data, status} = await deliveriesServices.saveProducts(dataSupplier, params.id, dataSaveProducts);
            if(status === ResponseStatusEnum.OK) {
                showAlert('Éxito', 'Productos entregados correctamente.')
                window.location.reload();
            }

            if(status === ResponseStatusEnum.BAD_REQUEST) {
                showError('Error', `${data.message + ' ,debes entregar al menos un producto'}`);
            }
        } catch (error) {
            showError('Error al guardar los productos', `${error}`);
        }
    };

    const handleBack = () => {
        window.location.reload();
    }

    //
    const showAlert = (title, message) => {
        AlertComponent.success(title, message)
    };

    //
    const showError = (title, message) => {
        AlertComponent.error(title, message);
    };

    useEffect(() => {
        if(isReadyToPrintDeliveryInformation) {
         handlePDFPrint();
         setIsReadyToPrintDeliveryInformation(false);
        }
    }, [isReadyToPrintDeliveryInformation]);

    //Al cargar el componente
    useEffect(() => {
        if (params.id) {
            getSuppliersFromWhomYouPurchased();
            getListDeliveriesToUser(params.id);
            getUserInformation(params.id);
        }
    }, []);

    return (
        <>
            <div className="main-container">
                <div className="header-image position-relative">
                    <img src={imgDCSIPeople} alt="Fondo" className="background-image w-100" />
                    <div className="overlay-text position-absolute w-100 text-center">
                        <h1>¡Entrega de Productos!</h1>
                    </div>
                </div>

                {/* Contenedor de la información del usuario */}
                <UserInformation userData={userData} />

                <div className="deliveries-banner">
                    <Container>
                        <Row className="justify-content-start align-items-center mt-4">
                            {(userAuth.rol_id === RolesEnum.MANAGEMENT_TECHNICIAN || userAuth.rol_id === RolesEnum.ADMIN || userAuth.rol_id === RolesEnum.AUDITOR) && (
                                <Col xs={12} md={6} className="d-flex align-items-center">
                                    <Select
                                        value={selectedSupplier}
                                        onChange={(selectedOption) => setSelectedSupplier(selectedOption)}
                                        options={suppliers?.map((opt) => ({ value: opt.id, label: opt.nombre }))}
                                        placeholder="Selecciona una compañía"
                                        classNamePrefix="custom-select"
                                        className="custom-select w-100"
                                    />
                                </Col>
                            )}
                            <Col xs={12} md={6} className="d-flex align-items-center justify-content-md-start justify-content-center">
                                <button onClick={handleCreateDeliveries} className="deliveries-button deliveries d-flex align-items-center">
                                    <img src={imgFrame2} alt="icono único" className="button-icon" />
                                    CREAR ENTREGAS
                                </button>
                            </Col>
                        </Row>

                    </Container>
                </div>

                {isLoading && (
                    <div className="spinner-container">
                        <Spinner animation="border" variant="success" />
                        <span>Cargando...</span>
                    </div>
                )}

                <div className="">
                    <Container>
                        {listDeliveriesToUser.length > 0 && !showDeliveryForm ? (
                            <>
                                <DataGrid
                                    rows={listDeliveriesToUser}
                                    columns={deliveryColumns}
                                    pageSize={10}
                                    rowsPerPageOptions={[5, 10, 20]}
                                    disableColumnMenu
                                    disableSelectionOnClick
                                    rowHeight={100}
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
                                        onClick={() => navigate(-1)}
                                        className="responsive-button mb-2 mb-md-0"
                                        style={{
                                            backgroundColor: "#2148C0",
                                            borderColor: "#007BFF",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        <i className="fas fa-save me-2"></i>ATRÁS
                                    </Button>
                                </div>
                            </>

                        ) : (
                            !showDeliveryForm && (
                                <div className="text-center mt-4">
                                    <p>No se han realizado entregas.</p>
                                </div>
                            )
                        )}

                        {showDeliveryForm && (
                            <>
                                <DataGrid
                                    rows={deliveryProducts}
                                    columns={productsToBeDeliveredColumns}
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
                                        <i className="fas fa-save me-2"></i>GUARDAR ENTREGA
                                    </Button>
                                </div>
                            </>
                    )}
                    </Container>
                </div>

                {/* Aquí renderizas el componente pero lo ocultas */}
                <div style={{display: 'none'}}>
                    {isReadyToPrintDeliveryInformation && (
                        <div ref={deliveryReportRef}>
                            <DeliveryReport deliveryInformation={deliveryInformation} />
                            <div className="page-break"></div>
                            <PhotographicEvidenceReport deliveryInformation={deliveryInformation} />
                        </div>
                    )}
                </div>

                <Footer />
            </div>
        </>
    )
}