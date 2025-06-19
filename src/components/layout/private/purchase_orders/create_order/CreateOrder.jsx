import { useCallback, useEffect, useRef, useState } from "react";
import Select from "react-select";
import { useParams} from "react-router-dom";
import { Button, Col, Container, Form, Row, Spinner, Table } from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa";
import { debounce } from "@mui/material";
import printJS from "print-js";

//Img
import imgPeople from '../../../../../assets/image/addProducts/people1.jpg';
import imgAdd from '../../../../../assets/image/addProducts/imgAdd.png';
import frame from '../../../../../assets/image/addProducts/Frame.png';

//Css
import './CreateOrder.css';

//Components
import { HeaderImage } from "../../../shared/header_image/HeaderImage";
import { UserInformation } from "../../user_information/UserInformation";
import { CompanyReportPrinting } from "../../reports/report_company/report/CompanyReportPrinting";
import AlertComponent from "../../../../../helpers/alert/AlertComponent";

//Services
import { userService } from "../../../../../helpers/services/UserServices";
import { productForPurchaseOrderServices } from "../../../../../helpers/services/ProductForPurchaseOrderServices";
import { reportServices } from "../../../../../helpers/services/ReportServices";

//Enum
import { ResponseStatusEnum } from "../../../../../helpers/GlobalEnum";
import {supplierServices} from "../../../../../helpers/services/SupplierServices";

export const CreateOrder = () => {

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

    //Obtener la información del usuario
    const getUserInformation = async (cubId) => {
        try {
            const { data, status} = await userService.userInformation(cubId);

            if(status === ResponseStatusEnum.OK) {
                setUserData(data);
                setSaldoRestante(data.monto_proveedores);
            }
        } catch (error) {
            handleError(error, 'Error buscando productos:');
        }
    }

    //Buscar producto
    const getOptionsProducts = useCallback(
        debounce(async (searchWord) => {
            if (searchWord.length < 3) {
                setOption([]);
                return;
            }

            try {
                const { data, status } = await productForPurchaseOrderServices.searchProduct(searchWord);
                if (status === ResponseStatusEnum.OK) {
                    const formattedOptions = data.map((product) => ({
                        value: product.id,
                        label: product.nombre,
                    }));
                    setOption(formattedOptions);
                }
            } catch (error) {
                handleError(error, "Error buscando productos:");
            }
        }, 300),
        []
    );

    //Adicionar item a la tabla
    const addItemToTable = async () => {
        if (selectedItem) {
            try {
                //Obtenemos los datos completos del producto desde el servicio
                const { data } = await productForPurchaseOrderServices.getProductId(selectedItem.value);

                //Obtenemos la ubicacion del proveedor
               const { locationKey, location_id, locationName} = getSupplierLocation();

                //Buscamos el objeto que coincide con la ubicación del proveedor
                const matchingMunicipio = data.valor_municipio.find((location) => {
                    return location.ubicacion_proveedor === parseInt(locationKey);
                });

                if(!matchingMunicipio) {
                    AlertComponent.error('Error', 'El producto no tiene valor total configurado!');
                    return;
                }

                const valorUnitario = parseInt(matchingMunicipio.valor_unitario);

                // Agregar el producto con los datos
                setItems([...items, {
                    id: data.id,
                    nombre: data.nombre,
                    unidad: data.unidad,
                    valor_unitario: valorUnitario,
                    quantity : 1,
                    discount: '0'
                }]);
                // Reset the select
                setSelectedItem(null);
            } catch (error) {
                handleError(error, 'Error agregando producto a la tabla:');
            }
        }
    };

    //
    const handleQuantityChange = (index, value) => {
        const newItems = [...items];
        newItems[index].quantity = value;
        setItems(newItems);
    };

    //
    const handleDiscountChange = (index, value) => {
        const newItems = [...items];
        newItems[index].discount = value;
        setItems(newItems);
    };

    //Eliminar un itema de la tabla
    const handleDeleteItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    //
    const limitToFourDecimals = (value) => {
        // Utilizamos una expresión regular para permitir números con hasta 4 decimales
        const regex = /^\d*\.?\d{0,4}$/;

        // Si el valor coincide con la expresión regular, lo devolvemos tal cual
        if (regex.test(value)) {
            return value;
        }

        // Si no coincide (tiene más de 4 decimales), truncamos a 4 decimales
        return parseFloat(value).toFixed(4);
    };

    //Enviar los productos
    const handleSaveProduct = async () => {
        const itemsWithTotal = calculateItemsWithTotal();
        const dataToSend = buildDataToSend(itemsWithTotal);

        try {
            const { data, status} = await productForPurchaseOrderServices.saveOrderProducts(dataToSend, params.id);
            handleSaveResponse(data, status);
        } catch (error) {
            handleError(error, 'Error al guardar los productos');
        }
    };

    //Calcula el total por cada item y mapea los datos necesarios
    const calculateItemsWithTotal = () => {
        return items
            .filter(item => item.quantity > 0)
            .map(item => {
                const discountRate = parseFloat(item.discount) || 0;
                const totalByItem = Math.ceil(item.valor_unitario * item.quantity * (1 - discountRate / 100));
                return {
                    producto: item.id,
                    discount: item.discount || 0,
                    cantidad: item.quantity,
                    valor_unitario: parseFloat(item.valor_unitario),
                    valor_final: totalByItem
                };
            });
    };

    //Construye la estructura de datos a enviar
    const buildDataToSend = (itemsWithTotal) => {
        const { locationKey} = getSupplierLocation();
        return {
            persona_cub_id: params.id,
            ubicacion_id: parseInt(locationKey),
            valor_total: Math.ceil(total),
            items: itemsWithTotal
        };
    };

    //Maneja la respuesta del servicio y muestra la alerta correspondiente
    const handleSaveResponse = (data, status) => {
        if (status === ResponseStatusEnum.CREATE) {
            setSaldoRestante(parseFloat(data?.cub?.monto_proveedores));
            AlertComponent.success('Bien hecho!', 'Productos guardados exitosamente');
            resetProductList();

            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }

        if (status === ResponseStatusEnum.BAD_REQUEST) {
            AlertComponent.error('Error al guardar los productos', data);
        }
    };

    // Reinicia la lista de productos
    const resetProductList = () => {
        setIsReportLoading(true);
        setItems([]);
        setSelectedItem(null);
        setIsReportLoading(false);
    };

    //Maneja el error en caso de fallo de la llamada
    const handleError = (error, title) => {
        console.log('error: ', error, 'title: ', title);
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido';
        AlertComponent.error(title,errorMessage);
    };

    const getHeadlineReport = async (cubId) => {
        setIsLoading(true);
        try {
            const { data, status} = await reportServices.companyAndUserReport(cubId);
            if(status === ResponseStatusEnum.OK) {
                setHeadLineInformation(data);
                setIsReportLoading(true);
            }
        } catch (error) {
            handleError(error, 'Error al obtener el reporte:');
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

    const getSupplierLocation = () => {
        return supplierServices.getLocation();
    }

    //
    const validateProducts = () => {
        return total === 0 || saldoRestante <= 0 ;
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
        if(isReportLoading) {
            handlePrintOrder();
            setIsReportLoading(false);
        }
    }, [isReportLoading]);

    useEffect(() => {
        if(params.id){
            getUserInformation(params.id);
        }
    },[]);

    return (
        <>
            <div className="main-container">
                <HeaderImage
                    imageHeader={imgPeople}
                    titleHeader={'¡Empieza a agregar tus productos!'}
                    bannerIcon={imgAdd}
                    backgroundIconColor={'#ff5722'}
                    bannerInformation={'Todo está listo para que completes tu pedido de forma rápida y sencilla.'}
                    backgroundInformationColor={'#0056b3'}
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
                    <Row className="head-title-table d-flex mt-4" >
                        <Col md={12} sm={12} xl={8} className="mb-2">
                            {/* Contenedor del título */}
                            <div className="title-div">
                                <h3>FORMATO DE VENTA</h3>
                            </div>
                        </Col>
                        <Col md={12} sm={12} xl={4} className="mb-2">
                            {/* Contenedor del saldo */}
                            <div className="head-title-balance d-flex justify-content-center align-items-center mt-1">
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
                    <div className="mt-3 table-responsive scrollable-thead-body">
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
                                        <td style={{textAlign: 'left'}} >{item.nombre}</td>
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
                                            <Button variant="danger"
                                                    size="sm"
                                                    onClick={() => handleDeleteItem(index)}>
                                                <FaTrashAlt />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>

                    {/* Totales */}
                    <Row className="mt-2 justify-content-md-end justify-content-center">
                        <Col xs={12} md={6} className="text-end">
                            <p className="subtotal-text"><strong>SUBTOTAL:</strong> ${subtotal.toLocaleString()}</p>
                            <p className="total-text">TOTAL: ${total.toLocaleString()}</p>
                        </Col>
                    </Row>

                    {/* Botón Guardar */}
                    <Row className="mt-3 justify-content-md-end justify-content-center">
                        <Col xs="auto" className="text-center text-md-end">
                            <Button
                                variant="info"
                                size="lg"
                                onClick={() => getHeadlineReport(params.id)}
                                disabled={isReportLoading}
                                className="button-responsive me-md-2 mb-2 mb-md-0"
                                style={{
                                    backgroundColor: isReportLoading ? "#ccc" : "#2148C0",
                                    borderColor: "#007BFF",
                                    fontWeight: "bold",
                                    color: "white",
                                    cursor: isReportLoading ? "not-allowed" : "pointer",
                                    opacity: isReportLoading ? 0.6 : 1,
                                }}
                            >
                                {isReportLoading ? (
                                    <span>Cargando...</span>
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
                                disabled={validateProducts()}
                                className="button-responsive"
                                style={{
                                    backgroundColor: validateProducts() ? "#ccc" : "#BFD732",
                                    borderColor: "#BFD732",
                                    fontWeight: "bold",
                                }}
                            >
                                <i className="fas fa-save me-2"></i>GUARDAR ORDEN
                            </Button>
                        </Col>
                    </Row>
                </Container>

            </div>

            <div style={{ display: 'none' }}>
                {headLineInformation && (
                    <div ref={headlineReportRef}>
                        <CompanyReportPrinting
                            titleReport={'ORDEN DE COMPRA'}
                            dataReport={headLineInformation}
                            userData={userData}
                            isCompanyReport={false}/>
                    </div>
                )}
            </div>
        </>
    )
}