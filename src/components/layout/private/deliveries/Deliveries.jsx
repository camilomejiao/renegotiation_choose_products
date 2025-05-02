import { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import Select from "react-select";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import {FaCheck, FaCheckDouble, FaClipboardCheck, FaFilePdf, FaPencilAlt, FaTimes, FaTrash} from "react-icons/fa";
import printJS from "print-js";
import { DataGrid } from "@mui/x-data-grid";

//Components
import { DeliveryReport } from "./delivery-report/DeliveryReport";
import AlertComponent from "../../../../helpers/alert/AlertComponent";
import { UserInformation } from "../user-information/UserInformation";
import { ApprovedDeniedModal } from "../../shared/Modals/ApprovedDeniedModal";

//Img
import imgDCSIPeople from "../../../../assets/image/addProducts/imgDSCIPeople.png";
import imgFrame2 from "../../../../assets/image/icons/deliveries-img.png";

//Services
import { deliveriesServices } from "../../../../helpers/services/DeliveriesServices";
import { userService } from "../../../../helpers/services/UserServices";
import { supplierServices } from "../../../../helpers/services/SupplierServices";

//Css
import './Deliveries.css';

//Enum
import { ResponseStatusEnum, RolesEnum } from "../../../../helpers/GlobalEnum";

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

    //
    const [selectedDeliveryId, setSelectedDeliveryId] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [comment, setComment] = useState('');
    const [action, setAction] = useState('approve');

    //Trae las compañias con las que el usuario realizó compras
    const getSuppliersFromWhomYouPurchased = async () => {
        try {
            if (userAuth.rol_id === RolesEnum.TERRITORIAL_LINKS || userAuth.rol_id === RolesEnum.ADMIN || userAuth.rol_id === RolesEnum.SUPERVISION) {
                const { data, status} = await deliveriesServices.getSuppliers(params.id);
                if (status === ResponseStatusEnum.OK) {
                    setSuppliers(data);
                }
            }

            if (userAuth.rol_id === RolesEnum.SUPPLIER) {
                const itemId = await supplierServices.getSupplierId();
                const singleSupplier = [{ id: itemId }];
                setSuppliers(singleSupplier);
            }
        } catch (error) {
            console.error("Error obteniendo proveedores:", error);
        }
    }

    //Listado de entregas al titular
    const getListDeliveriesToUser = async (cubId) => {
        setIsLoading(true);
        try {
            const { data, status} = await deliveriesServices.searchDeliveriesToUser(cubId);
            if(status === ResponseStatusEnum.OK) {
                setListDeliveriesToUser(await normalizeDeliveryRows(data));
            }
        } catch (error) {
            console.error("Error fetching deliveries:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const getDeliveryUrl = async (deliveryId) => {
        try {
            const { data, status} = await deliveriesServices.searchDeliveriesPDF(deliveryId);
            if(status === ResponseStatusEnum.OK) {
                return {
                    urlFile: Array.isArray(data?.archivos) && data.archivos.length === 0 ? parseInt(0) : data?.archivos[0]?.ruta,
                    approvedTechnical: data?.aprobado_tecnica,
                    approvedTerritorial: data?.aprobado_territorial,
                }
            }
        } catch (error) {
            console.error("Error fetching deliveries:", error);
        }
    }

    //
    const normalizeDeliveryRows = async (data) => {
        return await Promise.all(
            data.map(async (row) => {
                const deliveryIdInfo = await getDeliveryUrl(row.id);
                return {
                    id: row.id,
                    date: row.fecha_creacion.split("T")[0],
                    supplier: row.proveedor,
                    evidencePdf: { urlFile: deliveryIdInfo?.urlFile },
                    actions: {
                        approvedTechnical: deliveryIdInfo?.approvedTechnical,
                        approvedTerritorial: deliveryIdInfo?.approvedTerritorial,
                    }
                };
            })
        );
    };

    //
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

    //
    const isButtonDisabled = (row) => {
        if((row.actions.approvedTerritorial === true || row.actions.approvedTerritorial === false) && (userAuth.rol_id === RolesEnum.TERRITORIAL_LINKS || userAuth.rol_id === RolesEnum.TECHNICAL)) {
            return true;
        }
    };

    //
    const isButtonDisabledTecnical = (row) => {
        const { approvedTerritorial, approvedTechnical } = row.actions;

        if(userAuth.rol_id === RolesEnum.TECHNICAL &&
            (approvedTerritorial === true || approvedTechnical === true || approvedTechnical === false)) {
            return true;
        }
        return false;
    };


    //
    const renderApprovalIcon = (status) => {
        if (status === 1 || status === true) {
            return <FaCheck title="Aprobado" style={{ backgroundColor: "#FFF", color: "#28A745" }} />;
        }
        if (status === 0 || status === false) {
            return <FaTimes title="Denegado" style={{ color: "#DC3545" }} />;
        }
        return <FaClipboardCheck title="Pendiente de revisión" style={{ color: "#FFC107" }} />;
    }

    // Definición de las columnas de entregas
    const deliveryColumns = [
        { field: "id", headerName: "N° ENTREGA", width: 150 },
        { field: "date", headerName: "FECHA", width: 150 },
        { field: "supplier", headerName: "PROVEEDOR", width: 250 },
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
            field: "evidencePdf",
            headerName: "EVIDENCIAS PDF",
            width: 200,
            renderCell: (params) => {
                return (
                    <div>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleUploadFile(params.row.id)}
                            disabled={isButtonDisabled(params.row)}
                        >
                            Subir PDF
                        </Button>

                        {(params.row.evidencePdf.urlFile !== 0) && (
                            <Button
                                variant="success"
                                size="sm"
                                onClick={() => handleViewFile(params.row.evidencePdf.urlFile)}
                                style={{marginLeft: "10px"}}
                            >
                                Ver PDF
                            </Button>
                        )}
                    </div>
                )
            }
        },
        {
            field: "actions",
            headerName: "ACCIONES",
            width: 150,
            renderCell: (params) => {
                return (
                    <div>
                        <Button
                            variant="warning"
                            size="sm"
                            onClick={() => handleEditDelivery(params.row.id) }
                            style={{marginRight: "10px"}}
                            disabled={isButtonDisabled(params.row)}
                        >
                            <FaPencilAlt/>
                        </Button>
                        {(userAuth.rol_id === RolesEnum.TERRITORIAL_LINKS || userAuth.rol_id === RolesEnum.TECHNICAL || userAuth.rol_id === RolesEnum.ADMIN) && (
                            <>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDeleteDelivery(params.row.id)}
                                    style={{marginRight: "10px"}}
                                    disabled={isButtonDisabled(params.row)}
                                >
                                    <FaTrash/>
                                </Button>
                                {params.row.evidencePdf?.urlFile !== 0 && (
                                    <Button
                                        style={{ backgroundColor: "#FFF", marginRight: "10px" }}
                                        size="sm"
                                        onClick={() => {
                                            setSelectedDeliveryId(params.row.id);
                                            setOpenModal(true);
                                        }}
                                        disabled={isButtonDisabled(params.row)}
                                    >
                                        {renderApprovalIcon(params.row.actions?.approvedTerritorial)}
                                    </Button>
                                )}
                            </>
                        )}
                        {((userAuth.rol_id === RolesEnum.TECHNICAL || userAuth.rol_id === RolesEnum.ADMIN) && params.row.evidencePdf?.urlFile !== 0) && (
                            <>
                                <Button
                                    variant="success"
                                    size="sm"
                                    onClick={() => {
                                        setSelectedDeliveryId(params.row.id);
                                        setOpenModal(true);
                                    }}
                                    disabled={isButtonDisabledTecnical(params.row)}
                                >
                                    <FaCheckDouble/>
                                </Button>
                            </>
                        )}
                    </div>
                );
            },
        },
    ];

    //
    const handleUploadFile = (rowId) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/pdf";
        input.style.display = "none";

        // Captura el archivo seleccionado
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                handleFileChange(file, rowId, "pdf");

                // Actualizar la fila correspondiente con el nombre del archivo
                setListDeliveriesToUser((prevRows) =>
                    prevRows.map((row) =>
                        row.id === rowId
                            ? { ...row, fileName: file.name, evidencePdf: URL.createObjectURL(file) }
                            : row
                    )
                );
            }
        };

        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);
    };

    //
    const handleViewFile = (pdfUrl) => {
        if (!pdfUrl) {
            AlertComponent.error('Error', 'No hay un archivo cargado para este producto.');
            return;
        }
        window.open(pdfUrl, '_blank');
    };

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
        if (!selectedSupplier && userAuth.rol_id === RolesEnum.TERRITORIAL_LINKS) {
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
        try {
            const { status} = await deliveriesServices.removeDelivery(id);
            if (status === ResponseStatusEnum.NO_CONTENT) {
                showAlert('Éxito', 'Entrega eliminada exitosamente');
                window.location.reload();
            }

            if (status === ResponseStatusEnum.METHOD_NOT_ALLOWED) {
                showError('Error', 'NO TIENES PERMISO PARA ESTA ACCIÓN');
            }
        } catch (error) {
            console.error("Error eliminando la entrega:", error);
        }
    }

    const handleApproveByAudit = async () => {
        if (!action || comment.trim() === "") {
            showError("Validación", "Debes seleccionar una acción o escribir un comentario.");
            return;
        }

        try {
            const aprobado = action === 'approve' ? 1 : 0;
            const payload = {
                aprobado,
                observacion: comment
            };

            const { status } = await deliveriesServices.approveDelivery(selectedDeliveryId, payload);
            if (status === ResponseStatusEnum.OK) {
                getListDeliveriesToUser(params.id);
                showAlert("Bien hecho!", `Entrega ${action === 'approve' ? 'Aprobada' : 'Denegada'} exitosamente!`);
                handleCloseModalApproved();
            }
        } catch (error) {
            console.error("Error al aprobar la entrega:", error);
        }
    };

    const handleCloseModalApproved = () => {
        setOpenModal(false);
        setComment('');
        setAction('approve');
    };

    //Guardar evidencias
    const handleFileChange = async (file, deliveryId, fileName) => {
        if (file) {
            // Validar el tipo de archivo
            const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
            if (!allowedTypes.includes(file.type)) {
                showError('Archivo no válido', 'Solo se permiten imágenes (PNG, JPEG, JPG) o archivos PDF.');
                return;
            }

            const formData = new FormData();
            formData.append("ruta", file);
            formData.append("indice", fileName);

            try {
                const { status } = await deliveriesServices.evidenceOfDeliveries(deliveryId, formData);

                if (status === ResponseStatusEnum.CREATE) {
                    showAlert('Éxito', 'Archivo enviado exitosamente');
                    window.location.reload();
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
                showError('Error', `${data}`);
            }
        } catch (error) {
            showError('Error al guardar los productos', `${error}`);
        }
    };

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
    }, [params.id]);

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
                            <>
                                {(userAuth.rol_id === RolesEnum.ADMIN) && (
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

                                {(userAuth.rol_id === RolesEnum.ADMIN || userAuth.rol_id === RolesEnum.SUPPLIER) && (
                                    <Col
                                        xs={12}
                                        md={6}
                                        className="d-flex align-items-center justify-content-md-start justify-content-center"
                                    >
                                        <button
                                            onClick={handleCreateDeliveries}
                                            className="deliveries-button deliveries d-flex align-items-center"
                                        >
                                            <img src={imgFrame2} alt="icono único" className="button-icon" />
                                            CREAR ENTREGAS
                                        </button>
                                    </Col>
                                )}
                            </>
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
                        <hr/>
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
                            {/*<div className="page-break"></div>*/}
                            {/*<PhotographicEvidenceReport deliveryInformation={deliveryInformation} />*/}
                        </div>
                    )}
                </div>

                {/* Modal de aprobación/denegación */}
                <ApprovedDeniedModal
                    open={openModal}
                    onClose={handleCloseModalApproved}
                    action={action}
                    setAction={setAction}
                    comment={comment}
                    setComment={setComment}
                    onSubmit={handleApproveByAudit}
                />

            </div>
        </>
    )
}