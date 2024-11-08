import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Select from "react-select";
import { Button, Col, Container, Row, Table, Form, Spinner } from "react-bootstrap";
import { FaFilePdf } from "react-icons/fa";
import Swal from "sweetalert2";
import printJS from "print-js";

//Components
import { Footer } from "../../shared/footer/Footer";
import { DeliveryReport } from "./delivery-report/DeliveryReport";

//Img
import imgDCSIPeople from "../../../../assets/image/addProducts/imgDSCIPeople.png";
import imgFrame2 from "../../../../assets/image/icons/deliveries-img.png";

//Services
import { deliveriesServices } from "../../../../helpers/services/DeliveriesServices";

//Css
import './Deliveries.css';

//Enum
import { StatusEnum } from "../../../../helpers/GlobalEnum";

//Opciones para los productos a entregar
const deliveryStatus = [
    { id: 0, label: "SIN DEFINIR" },
    { id: 1, label: "ENTREGADO" },
    { id: 2, label: "PENDIENTE POR ENTREGAR" },
    { id: 3, label: "ENTREGA PARCIAL" }
];

export const Deliveries = () => {

    const params = useParams();
    const deliveryReportRef = useRef();

    const [suppliers, setSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [listDeliveriesToUser, setListDeliveriesToUser] = useState([]);
    const [showDeliveryForm, setShowDeliveryForm] = useState(false);
    const [files, setFiles] = useState({}); // Estado para almacenar los archivos
    const [deliveryProducts, setDeliveryProducts] = useState([]);
    const [deliveryInformation, setDeliveryInformation] = useState({});
    const [isReadyToPrintDeliveryInformation, setIsReadyToPrintDeliveryInformation] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    //Trae las compañias con las que el usuario realizó compras
    const getSuppliersFromWhomYouPurchased = async (cubId) => {
        try {
            const dataDeliveriesToUser = await deliveriesServices.getSuppliers(cubId);
            if (dataDeliveriesToUser.status === StatusEnum.OK) {
                setSuppliers(dataDeliveriesToUser.data); // Asigna los datos de proveedores
            }
        } catch (error) {
            console.error("Error obteniendo proveedores:", error);
        }
    }

    //Listado de entregas al titular
    const getListDeliveriesToUser = async (cubId) => {
        try {
            const response = await deliveriesServices.searchDeliveriesToUser(cubId);
            if(response.status === StatusEnum.OK) {
                setListDeliveriesToUser(response.data);
            }
        } catch (error) {
            console.error("Error fetching deliveries:", error);
        }
    }

    //Crear entrega
    const handleCreateDeliveries = async () => {
        if (!selectedSupplier) {
            Swal.fire({
                title: 'Error',
                text: 'Debe escoger al menos una empresa',
                icon: 'error',
                width: 300,
                heightAuto: true
            });
            return;
        }
        setListDeliveriesToUser([]); // Ocultar la tabla
        setShowDeliveryForm(true); // Mostrar el formulario

        try {
            const response = await deliveriesServices.productsToBeDelivered(selectedSupplier.value, params.id);

            if (response.status === StatusEnum.OK) {
                const dataProductsToBeDelivered = response.data;

                const updatedData = dataProductsToBeDelivered.map(product => ({
                    ...product,
                    estado: 1,
                    quantityToDeliver: product.cantidad
                }));

                setDeliveryProducts(updatedData);
            }
        } catch (error) {
            console.error("Error obteniendo productos a entregar:", error);
        }
    }

    //GUardar evidencias
    const handleFileChange = (e, deliveryId, fileNumber) => {
        const selectedFile = e.target.files[0]; // Obtener el archivo seleccionado
        if (selectedFile) {
            // Actualizar el estado para el archivo correspondiente a la entrega
            setFiles(prevFiles => ({
                ...prevFiles,
                [deliveryId]: {
                    ...prevFiles[deliveryId],
                    [fileNumber]: selectedFile // Guarda el archivo en el índice correspondiente
                }
            }));
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

            const response = await deliveriesServices.saveProducts(selectedSupplier.value, params.id, dataSaveProducts);
            if(response.status === StatusEnum.OK) {
                Swal.fire({
                    title: 'Éxito',
                    text: 'Productos entregados correctamente.',
                    icon: 'success',
                    width: 300,
                    heightAuto: true
                });
                window.location.reload();
            }

            if(response.status === StatusEnum.BAD_REQUEST) {
                Swal.fire({
                    title: 'Error',
                    text: `${response.data.message + ' ,debes entregar al menos un producto'}`,
                    icon: 'warning',
                    width: 300,
                    heightAuto: true
                });
            }
        } catch (error) {
            await Swal.fire({
                title: 'Error al guardar los productos',
                text: `${error}`,
                icon: 'error',
                width: 300,
                heightAuto: true
            });
        }
    };

    const handleBack = () => {
        window.location.reload();
    }


    //Al cargar el componente
    useEffect(() => {
        if(params.id){
            getSuppliersFromWhomYouPurchased(params.id);
            getListDeliveriesToUser(params.id);
        }
    }, []);

    useEffect(() => {
        if(isReadyToPrintDeliveryInformation) {
         handlePDFPrint();
         setIsReadyToPrintDeliveryInformation(false);
        }
    }, [isReadyToPrintDeliveryInformation]);

    return (
        <>
            <div className="main-container">
                <div className="header-image position-relative">
                    <img src={imgDCSIPeople} alt="Fondo" className="background-image w-100" />
                    <div className="overlay-text position-absolute w-100 text-center">
                        <h1>¡Entrega de Productos!</h1>
                    </div>
                </div>

                <div className="deliveries-banner">
                    <Container>
                        <Row className="justify-content-start align-items-center mt-4">
                            <Col xs={12} md={5} className="mb-2 mb-md-0">
                                <Select
                                    value={selectedSupplier}
                                    onChange={(selectedOption) => { setSelectedSupplier(selectedOption) }}
                                    options={suppliers?.map((opt) => ({ value: opt.id, label: opt.nombre }))}
                                    placeholder="Selecciona una compañia"
                                    classNamePrefix="custom-select"
                                    className="custom-select"
                                />
                            </Col>
                            <Col xs={12} md={4} className="d-flex justify-content-md-start justify-content-center">
                                <button onClick={handleCreateDeliveries} className="deliveries-button deliveries">
                                    <img src={imgFrame2} alt="icono único" className="button-icon" />
                                    ENTREGAS
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
                                                            onChange={(e) => handleFileChange(e, 1, fileNumber)}
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
                                                        onChange={(e) => handleFileChange(e, 1, 'pdf')}
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
                                        <i className="fas fa-save me-2"></i>GUARDAR
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