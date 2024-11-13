import {useEffect, useRef, useState} from "react";
import {useOutletContext, useParams} from "react-router-dom";
import Select from "react-select";
import {Button, Col, Container, Form, Row, Spinner, Table} from "react-bootstrap";
import {FaFilePdf} from "react-icons/fa";
import Swal from "sweetalert2";
import printJS from "print-js";

//Components
import {Footer} from "../../shared/footer/Footer";
import {DeliveryReport} from "./delivery-report/DeliveryReport";

//Img
import imgDCSIPeople from "../../../../assets/image/addProducts/imgDSCIPeople.png";
import imgFrame2 from "../../../../assets/image/icons/deliveries-img.png";

//Services
import {deliveriesServices} from "../../../../helpers/services/DeliveriesServices";

//Css
import './Deliveries.css';

//Enum
import {StatusEnum} from "../../../../helpers/GlobalEnum";
import {authService} from "../../../../helpers/services/Auth";

//Opciones para los productos a entregar
const deliveryStatus = [
    { id: 0, label: "SIN DEFINIR" },
    { id: 1, label: "ENTREGADO" },
    { id: 2, label: "PENDIENTE POR ENTREGAR" },
    { id: 3, label: "ENTREGA PARCIAL" }
];

export const Deliveries = () => {

    const { userAuth } = useOutletContext();
    const params = useParams();
    const deliveryReportRef = useRef();

    const [supplier, setSupplier] = useState('');
    const [listDeliveriesToUser, setListDeliveriesToUser] = useState([]);
    const [showDeliveryForm, setShowDeliveryForm] = useState(false);
    const [deliveryProducts, setDeliveryProducts] = useState([]);
    const [deliveryInformation, setDeliveryInformation] = useState({});
    const [isReadyToPrintDeliveryInformation, setIsReadyToPrintDeliveryInformation] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    //Trae el id de la compañia
    const getSuppliersFromWhomYouPurchased = async () => {
        try {
            const itemId = await authService.getSupplierId();
            setSupplier(itemId);
        } catch (error) {
            console.error("Error obteniendo proveedores:", error);
        }
    }

    //Listado de entregas al titular
    const getListDeliveriesToUser = async (cubId) => {
        try {
            const { data, status} = await deliveriesServices.searchDeliveriesToUser(cubId);
            if(status === StatusEnum.OK) {
                setListDeliveriesToUser(data);
            }
        } catch (error) {
            console.error("Error fetching deliveries:", error);
        }
    }

    //Crear entrega
    const handleCreateDeliveries = async () => {
        setListDeliveriesToUser([]);
        setShowDeliveryForm(true);

        try {
            const { data, status} = await deliveriesServices.productsToBeDelivered(supplier, params.id);

            if (status === StatusEnum.OK) {
                const updatedData = data.map(product => ({
                    ...product,
                    estado: 1,
                    quantityToDeliver: product.cantidad
                }));

                setDeliveryProducts(updatedData);
            }

            if(status === StatusEnum.BAD_REQUEST) {
                showError("Error", "Error al obtener las órdenes de compra");
            }
        } catch (error) {
            console.error("Error obteniendo productos a entregar:", error);
        }
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

                if (status === StatusEnum.CREATE) {
                    showAlert('Éxito', 'Archivo enviado exitosamente');
                }

                if (status === StatusEnum.BAD_REQUEST ||
                    status === StatusEnum.INTERNAL_SERVER_ERROR ||
                    status !== StatusEnum.CREATE) {
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

    const handleQuantityChange = (id, value) => {
        const newProducts = deliveryProducts.map((product) => {
            if (product.id === id) {
                return { ...product, quantityToDeliver: value.trim() === '' ? '' : Math.max(0, Number(value)) };
            }
            return product;
        });
        setDeliveryProducts(newProducts);
    };

    const handleStatusChange = (id, value) => {
        const newProducts = deliveryProducts.map((product) => {
            if (product.id === id) {
                return { ...product, estado: value };
            }
            return product;
        });
        setDeliveryProducts(newProducts);
    };

    const handleSaveProduct = async () => {
        try {
            //
            const dataSaveProducts = deliveryProducts.map(prod => ({
                producto: prod.id,
                cantidad: prod.quantityToDeliver,
                estado: prod.estado
            }));

            const {data, status} = await deliveriesServices.saveProducts(supplier, params.id, dataSaveProducts);
            if(status === StatusEnum.OK) {
                showAlert('Éxito', 'Productos entregados correctamente.')
                window.location.reload();
            }

            if(status === StatusEnum.BAD_REQUEST) {
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
        Swal.fire({
            title: title,
            text: message,
            icon: 'success',
            width: 300,
            heightAuto: true,
        });
    };

    //
    const showError = (title, message) => {
        Swal.fire({
            title: title,
            text: message,
            icon: "error",
            width: 300,
            heightAuto: true,
        });
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

                {userAuth.rol_id === 2 &&(
                    <div className="deliveries-banner">
                        <Container>
                            <Row className="justify-content-start align-items-center mt-4">
                                <Col xs={12} className="d-flex justify-content-md-start justify-content-center">
                                    <button onClick={handleCreateDeliveries} className="deliveries-button deliveries">
                                        <img src={imgFrame2} alt="icono único" className="button-icon" />
                                        CREAR ENTREGAS
                                    </button>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                )}

                {isLoading && (
                    <div className="spinner-container">
                        <Spinner animation="border" variant="success" />
                        <span>Cargando...</span>
                    </div>
                )}

                <div className="deliveries-info">
                    <Container>
                        {listDeliveriesToUser.length > 0 && !showDeliveryForm && (
                            <div className="table-responsive">
                                <Table bordered hover>
                                    <thead style={{ backgroundColor: "#40A581", color: "white" }}>
                                        <tr>
                                            <th>COD. ENTREGA</th>
                                            <th>FECHA</th>
                                            <th>PROVEEDOR</th>
                                            <th>EVIDENCIAS</th>
                                            <th>EVIDENCIAS PDF</th>
                                            <th>GENERAR PDF</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {listDeliveriesToUser.map(delivery => (
                                        <tr key={delivery?.id}>
                                            <td>{delivery?.id}</td>
                                            <td>{delivery.fecha_creacion.split('T')[0]}</td>
                                            <td>{delivery?.proveedor}</td>
                                            <td className="button-grid-cell">
                                                {[1, 2, 3, 4].map(fileNumber => (
                                                    <label className="custom-file-label" key={fileNumber}>
                                                        Subir Imagen {fileNumber}
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => handleFileChange(e, delivery?.id, `imagen${fileNumber}`)}
                                                            className="custom-file-input"
                                                        />
                                                    </label>
                                                ))}
                                            </td>
                                            <td>
                                                <label className="custom-file-label">
                                                    Subir PDF
                                                    <input
                                                        type="file"
                                                        accept="application/pdf"
                                                        onChange={(e) => handleFileChange(e, delivery?.id, 'pdf')}
                                                        className="custom-file-input"
                                                    />
                                                </label>
                                            </td>
                                            <td>
                                                <Button variant="primary" size="sm" onClick={() => handleDeliveryInformationReport(delivery?.id)}>
                                                    <FaFilePdf />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </Table>
                            </div>
                        )}

                        {showDeliveryForm && (
                            <>
                                <div className="table-responsive">
                                    <Table bordered hover>
                                        <thead style={{ backgroundColor: "#40A581", color: "white" }}>
                                        <tr>
                                            <th>COD</th>
                                            <th>NOMBRE</th>
                                            <th>DESCRIPCIÓN</th>
                                            <th>CANTIDAD SOLICITADA</th>
                                            <th>CANTIDAD A ENTREGAR</th>
                                            <th>ESTADO</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {deliveryProducts.map((product) => (
                                            <tr  key={product?.id}>
                                                <td>{product?.id}</td>
                                                <td style={{textAlign: 'left'}}>{product?.nombre}</td>
                                                <td style={{textAlign: 'left'}}>{product?.descripcion}</td>
                                                <td>{product?.cantidad}</td>
                                                <td>
                                                    <Form.Control
                                                        type="number"
                                                        className="small-input form-control-sm"
                                                        value={product?.quantityToDeliver !== undefined ? product.quantityToDeliver : product.cantidad}
                                                        min="0"
                                                        onChange={(e) => handleQuantityChange(product?.id, e.target.value)}
                                                    />
                                                </td>
                                                <td style={{width: '13%'}}>
                                                    <Select
                                                        value={deliveryStatus.find(opt => opt.id === product?.estado )}
                                                        onChange={(e) => handleStatusChange(product?.id, e.id)}
                                                        options={deliveryStatus.map((opt) => ({ id: opt.id, label: opt.label }))}
                                                        placeholder="Selecciona la opción"
                                                        classNamePrefix="custom-select"
                                                        className="custom-select"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </Table>
                                </div>

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
                        </div>
                    )}
                </div>

                <Footer />
            </div>
        </>
    )
}