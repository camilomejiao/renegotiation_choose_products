import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { useParams}  from "react-router-dom";
import {Button, Col, Container, Form, Row, Spinner, Table} from "react-bootstrap";
import { FaTrashAlt} from "react-icons/fa";
import Swal from "sweetalert2";
import printJS from "print-js";

//Img
import imgPeople from '../../../../assets/image/addProducts/people1.jpg';
import imgAdd from '../../../../assets/image/addProducts/imgAdd.png';
import frame from '../../../../assets/image/addProducts/Frame.png';

//Css
import './AddProducts.css';


//Components
import { Footer} from "../footer/Footer";
import { HeaderImage} from "../../shared/header-image/HeaderImage";
import { UserInformation} from "../user-information/UserInformation";
import { CompanyReportPrinting } from "../ReportsCompany/report/CompanyReportPrinting";

//Services
import { userService } from "../../../../helpers/services/UserServices";
import { productsServices } from "../../../../helpers/services/ProductsServices";
import { reportServices } from "../../../../helpers/services/ReportServices";
import {StatusEnum} from "../../../../helpers/GlobalEnum";

export const AddProducts = () => {

    const params = useParams();
    const headlineReportRef = useRef();

    const [userData, setUserData] = useState({});
    const [options, setOption] = useState([]);
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [saldoRestante, setSaldoRestante] = useState(0);
    const [subtotal, setSubtotal] = useState(0);
    const [total, setTotal] = useState(0);
    const [headLineInformation, setHeadLineInformation] = useState({});
    const [isReportLoading, setIsReportLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    //
    const getOptionsProducts = async (searchWord) => {
        if (!searchWord) {
            setOption([]);
            return;
        }

        try {
            const {data, status} = await productsServices.searchProduct(searchWord);
            //console.log('data: ', data);
            if(status === StatusEnum.OK) {
                const formattedOptions = data.map(product => ({
                    value: product.id, // Ajusta según la estructura de tu producto
                    label: product.nombre // Ajusta según el campo que representa el nombre del producto
                }));
                setOption(formattedOptions);
            }

        } catch (error) {
            console.error('Error buscando productos:', error);
        }
    }

    const getUserInformation = async (cubId) => {
        try {
            const {data, status} = await userService.userInformation(cubId);

            if(status === StatusEnum.OK) {
                setUserData(data);
                setSaldoRestante(data.monto_proveedores);
            }
        } catch (error) {
            console.error('Error buscando productos:', error);
        }
    }

    const addItemToTable = async () => {
        if (selectedItem) {
            try {
                //Obtener los datos completos del producto desde el servicio
                const {data, status} = await productsServices.getProductId(selectedItem.value);

                // Agregar el producto con los datos
                setItems([...items, {
                    id: data.id,
                    nombre: data.nombre,
                    unidad: data.unidad,
                    valor_unitario: parseInt(data.valor_unitario),
                    quantity: 1,
                    discount: '0%'
                }]);
                // Reset the select
                setSelectedItem(null);
            } catch (error) {
                console.error('Error agregando producto a la tabla:', error);
            }
        }
    };

    const handleQuantityChange = (index, value) => {
        const newItems = [...items];
        newItems[index].quantity = value;
        setItems(newItems);
    };

    const handleDiscountChange = (index, value) => {
        const newItems = [...items];
        newItems[index].discount = value;
        setItems(newItems);
    };

    const handleDeleteItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const limitToFourDecimals = (value) => {
        // Utilizamos una expresión regular para permitir números con hasta 4 decimales
        const regex = /^\d*\.?\d{0,4}$/;

        // Si el valor coincide con la expresión regular, lo devolvemos tal cual
        if (regex.test(value)) {
            return value;
        }

        // Si no coincide (tiene más de 4 decimales), truncamos a 4 decimales
        const truncatedValue = parseFloat(value).toFixed(4);
        return truncatedValue;
    };

    const handleSaveProduct = async () => {
        // Mapeamos los items y calculamos el total para cada uno
        const itemsWithTotal = items.map((item) => {
            const totalByItem = Math.ceil(item.valor_unitario * item.quantity * (1 - (parseFloat(item.discount) || 0) / 100));
            return {
                producto: item.id,
                discount: item.discount,
                cantidad: item.quantity,
                valor_unitario: parseFloat(item.valor_unitario),
                valor_final: totalByItem
            };
        });

        // Creamos la estructura final
        const dataToSend = {
            persona_cub_id: params.id,
            valor_total: Math.ceil(total), // Aseguramos que sea un número flotante
            items: itemsWithTotal
        };

        try {
            //console.log('dataToSend: ', dataToSend);
            // Hacemos la llamada para guardar los productos
            const {data, status} = await productsServices.saveProducts(dataToSend, params.id);
            //console.log('saveProducts: ', data);

            if(status === StatusEnum.OK) {
                // Si la llamada fue exitosa
                Swal.fire({
                    title: 'Bien hecho!',
                    html: 'Productos guardados exitosamente',
                    icon: 'success',
                    width: 300,
                    heightAuto: true
                });

                setIsReportLoading(true);

                // Limpiar la lista de productos
                setItems([]);
                setSelectedItem(null);

                // Obtener el reporte y la información del usuario
                await getHeadlineReport(params.id);
                await getUserInformation(params.id);

                setIsReportLoading(false);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Error desconocido';
            // Aquí mostramos el mensaje de error en caso de que algo salga mal
            Swal.fire({
                title: 'Error al guardar los productos',
                text: `${errorMessage}`,
                icon: 'error',
                width: 300,
                heightAuto: true
            });
        }
    }

    const getHeadlineReport = async (cubId) => {
        setIsLoading(true);
        try {
            const {data, status} = await reportServices.companyAndUserReport(cubId);
            console.log('setHeadLineInformation: ', data);
            if(status === StatusEnum.OK) {
                setHeadLineInformation(data);
                setIsReportLoading(true);
            }
        } catch (error) {
            console.error('Error al obtener el reporte:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePrintOrder = async () => {
        // Después de obtener la información, generar el contenido a imprimir
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
              ${headlineReportRef.current.innerHTML} 
            </body>
            </html>`;

        printJS({
            printable: printContent,
            type: 'raw-html',
            documentTitle: 'Reporte Beneficiario',
        });
    };

    useEffect(() => {
        const subtotal = items.reduce((acc, item) => {
            const itemTotal = item.valor_unitario * item.quantity * (1 - (parseFloat(item.discount) || 0) / 100);
            return acc + itemTotal;
        }, 0);

        const total = subtotal;

        const saldoInicial = parseFloat(userData?.monto_proveedores || 0);
        const nuevoSaldo = saldoInicial - total;

        setSubtotal(subtotal);
        setTotal(total);
        setSaldoRestante(nuevoSaldo);
    }, [items]);

    useEffect(() => {
        if(params.id){
            getUserInformation(params.id);
        }
    },[]);

    useEffect(() => {
        if(isReportLoading) {
            handlePrintOrder();
            setIsReportLoading(false);
        }
    }, [isReportLoading]);


    return (
        <>
            <div className="main-container">
                <HeaderImage
                    imageHeader={imgPeople}
                    titleHeader={'¡Empieza a agregar tus productos!'}
                    bannerIcon={imgAdd}
                    bannerInformation={'Todo está listo para que completes tu pedido de forma rápida y sencilla.'}
                />

                {/* Contenedor de la información del usuario */}
                <UserInformation userData={userData} />

                {/* Sección de búsqueda de productos */}
                <div className="search-banner">
                   <Container>
                        <Row className="justify-content-center">
                            <Col md={6} className="d-flex align-items-center">
                                <div className="select-container d-flex align-items-center">
                                    <Select
                                        className="basic-single flex-grow-1" // Agrega flex-grow-1 para que ocupe el espacio disponible
                                        classNamePrefix="select"
                                        isClearable
                                        value={selectedItem}
                                        onChange={setSelectedItem}
                                        options={options}
                                        onInputChange={(inputValue, { action }) => {
                                            if (action === "input-change") {
                                                getOptionsProducts(inputValue);
                                            }
                                        }}
                                        placeholder="Buscar productos..."
                                    />
                                    <Button variant="success"
                                            disabled={parseFloat(saldoRestante) === 0}
                                            onClick={addItemToTable}
                                            className="addProductButton ms-2"
                                    >
                                        Agregar
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                   </Container>
                   {/* Imagen final del banner */}
                   <img src={frame} alt="Icono" className="banner-icon" />
                </div>

                {/* Tabla de productos */}
                <Container>
                    {/* Encabezado */}
                    <Row className="d-flex mt-4" style={{ border: "2px solid #BFD732", borderRadius: "5px", padding: "10px" }}>
                        <Col sm={9}>
                            {/* Contenedor del título */}
                            <div className="title-div">
                                <h3>FORMATO DE VENTA</h3>
                            </div>
                        </Col>
                        <Col sm={3}>
                            {/* Contenedor del saldo */}
                            <div className="d-flex justify-content-center align-items-center mt-1"
                                style={{ backgroundColor: "#AECA13", padding: "10px", borderRadius: "5px" }}>
                                <span style={{ fontSize: "25px", fontWeight: "bold", color: "#FFF" }}>
                                    Saldo: ${parseFloat(saldoRestante).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                </span>
                            </div>
                        </Col>
                    </Row>

                    {isLoading && (
                        <div className="spinner-container">
                            <Spinner animation="border" variant="success" />
                            <span>Cargando...</span>
                        </div>
                    )}

                    {/* Tabla */}
                    <Row className="mt-3">
                        <Col>
                            <Table bordered hover>
                                <thead style={{ backgroundColor: "#40A581", color: "white" }}>
                                <tr>
                                    <th>COD</th>
                                    <th>Nombre</th>
                                    <th>Vr. Unitario</th>
                                    <th>Unidad</th>
                                    <th>Cantidad</th>
                                    <th>Dto</th>
                                    <th>Total</th>
                                    <th>&nbsp;</th>
                                </tr>
                                </thead>
                                <tbody>
                                {items.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.id}</td>
                                        <td>{item.nombre}</td>
                                        <td>${item.valor_unitario.toLocaleString()}</td>
                                        <td>{item.unidad}</td>
                                        <td>
                                            <Form.Control
                                                type="number"
                                                className="small-input form-control-sm"
                                                value={item.quantity}
                                                onChange={(e) => handleQuantityChange(index, e.target.value)}
                                                min="1"
                                            />
                                        </td>
                                        <td>
                                            <Form.Control
                                                type="text"
                                                className="small-input form-control-sm"
                                                value={item.discount}
                                                onChange={(e) => handleDiscountChange(index, limitToFourDecimals(e.target.value))}
                                            />
                                        </td>
                                        <td>${(item.valor_unitario * item.quantity * (1 - (parseFloat(item.discount) || 0) / 100)).toLocaleString()}</td>
                                        <td>
                                            <Button variant="danger" size="sm" onClick={() => handleDeleteItem(index)}>
                                                <FaTrashAlt />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>

                    {/* Totales */}
                    <Row className="mt-2">
                        <Col className="text-end">
                            <p><strong>SUBTOTAL:</strong> ${subtotal.toLocaleString()}</p>
                            <p style={{ fontSize: "18px", fontWeight: "bold", color: "#2E7D32" }}>TOTAL: ${total.toLocaleString()}</p>
                        </Col>
                    </Row>

                    {/* Botón Guardar */}
                    <Row className="mt-3">
                        <Col className="text-end">
                            <Button variant="info" size="lg"
                                    onClick={() => getHeadlineReport(params.id)}
                                    disabled={isReportLoading}
                                    style={{
                                        backgroundColor: isReportLoading ? "#ccc" : "#2148C0",
                                        borderColor: "#007BFF",
                                        fontWeight: "bold",
                                        color: "white",
                                        cursor: isReportLoading ? "not-allowed" : "pointer",
                                        opacity: isReportLoading ? 0.6 : 1,
                                        marginRight: "10px"
                                    }}
                            >
                                {isReportLoading ? (
                                    <span>Cargando...</span> // Mostrar texto de carga
                                ) : (
                                    <>
                                        <i className="fas fa-print me-2"></i>IMPRIMIR ORDEN
                                    </>
                                )}
                            </Button>
                            <Button
                                variant="success"
                                size="lg"
                                onClick={handleSaveProduct}
                                disabled={items.length === 0} // Deshabilitar si no hay productos en la tabla
                                style={{
                                    backgroundColor: items.length === 0 ? "#ccc" : "#BFD732", // Cambiar color si está deshabilitado
                                    borderColor: "#BFD732",
                                    fontWeight: "bold"
                                }}
                            >
                                <i className="fas fa-save me-2"></i>GUARDAR
                            </Button>
                        </Col>
                    </Row>
                </Container>
                <Footer />
            </div>

            <div style={{ display: 'none' }}>
                <div ref={headlineReportRef}>
                    <CompanyReportPrinting titleReport={'ORDEN DE COMPRA'} dataReport={headLineInformation} userData={userData} />
                </div>
            </div>
        </>
    )
}