import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { useParams}  from "react-router-dom";
import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
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
import { UserInformation} from "../user_information/UserInformation";
import { ReportHeadLine } from "../reports/ReportUser/ReportHeadLine";

//Services
import { userService } from "../../../../helpers/services/UserServices";
import { productsServices } from "../../../../helpers/services/ProductsServices";
import {reportServices} from "../../../../helpers/services/ReportServices";
import {ReportCompany} from "../reports/ReportCompany/ReportCompany";

export const AddProducts = () => {

    const params = useParams();
    const headlineReportRef = useRef();

    const [userData, setUserData] = useState({}); //dataUser
    const [options, setOption] = useState([]); //OPtions of select
    const [items, setItems] = useState([]); //Items seleccionados
    const [selectedItem, setSelectedItem] = useState(null);
    const [subtotal, setSubtotal] = useState(0);
    const [iva, setIva] = useState(0);
    const [total, setTotal] = useState(0);
    const [showPrintButton, setShowPrintButton] = useState(false); //Mostrar boton
    const [headLineInformation, setHeadLineInformation] = useState({});

    const getOptionsProducts = async (searchWord) => {
        if (!searchWord) {
            setOption([]);
            return;
        }

        try {
            const data = await productsServices.searchProduct(searchWord);
            console.log('data: ', data);
            const formattedOptions = data.map(product => ({
                value: product.id, // Ajusta según la estructura de tu producto
                label: product.nombre // Ajusta según el campo que representa el nombre del producto
            }));
            setOption(formattedOptions);
        } catch (error) {
            console.error('Error buscando productos:', error);
        }
    }

    const getUserInformation = async (cubId) => {
        await userService.userInformation(cubId).then((data) => {
            console.log(data);
            setUserData(data);
        });
    }

    const addItemToTable = async () => {
        if (selectedItem) {
            try {
                //Obtener los datos completos del producto desde el servicio
                const data = await productsServices.getProductId(selectedItem.value);

                // Agregar el producto con los datos
                setItems([...items, {
                    id: data.id,
                    nombre: data.nombre,
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

    const handleSaveProduct = async () => {
        // Mapeamos los items y calculamos el total para cada uno
        const itemsWithTotal = items.map((item) => {
            const totalByItem = item.valor_unitario * item.quantity * (1 - (parseFloat(item.discount) || 0) / 100);
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
            valor_total: total, // Aseguramos que sea un número flotante
            items: itemsWithTotal
        };

        try {
            // Hacemos la llamada para guardar los productos
            const data = await productsServices.saveProducts(dataToSend, params.id);
            console.log('data: ', data);

            // Si la llamada fue exitosa
            Swal.fire({
                title: 'Bien hecho!',
                html: 'Productos guardados exitosamente',
                icon: 'success',
                width: 300,
                heightAuto: true
            });
            setShowPrintButton(true);
            setItems([]);  // Limpiar la lista de productos
            setSelectedItem(null);  // Limpiar el select
            getHeadlineReport(params.id);  // Actualizar el reporte

        } catch (error) {
            // Aquí mostramos el mensaje de error en caso de que algo salga mal
            Swal.fire({
                title: 'Oops...',
                text: 'Error al guardar los productos',
                icon: 'error',
                width: 300,
                heightAuto: true
            });
        }
    }

    const getHeadlineReport = async (cubId) => {
        await reportServices.companyAndUserReport(cubId).then((data) => {
            setHeadLineInformation(data);
        });
    }

    const handlePrintOrder = () => {
        getHeadlineReport(params.id)
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
    }

    useEffect(() => {
        const subtotal = items.reduce((acc, item) => {
            const itemTotal = item.valor_unitario * item.quantity * (1 - (parseFloat(item.discount) || 0) / 100);
            return acc + itemTotal;
        }, 0);

        const iva = 0;
        const total = subtotal + iva;

        setSubtotal(subtotal);
        setIva(iva);
        setTotal(total);
    }, [items]);

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
                                    <Button variant="success" onClick={addItemToTable} className="addProductButton ms-2">
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
                                <span style={{ fontSize: "25px", fontWeight: "bold", color: "#FFF" }}>Saldo: ${parseFloat(userData?.deuda_componente).toFixed(2)}</span>
                            </div>
                        </Col>
                    </Row>

                    {/* Tabla */}
                    <Row className="mt-3">
                        <Col>
                            <Table bordered hover>
                                <thead style={{ backgroundColor: "#40A581", color: "white" }}>
                                <tr>
                                    <th>COD</th>
                                    <th>Nombre</th>
                                    <th>Vr. Unitario</th>
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
                                                onChange={(e) => handleDiscountChange(index, e.target.value)}
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
                            <p><strong>IVA:</strong> ${iva.toLocaleString()}</p>
                            <p style={{ fontSize: "18px", fontWeight: "bold", color: "#2E7D32" }}>TOTAL: ${total.toLocaleString()}</p>
                        </Col>
                    </Row>

                    {/* Botón Guardar */}
                    <Row className="mt-3">
                        <Col className="text-end">
                            {showPrintButton && (
                                <Button variant="info" size="lg" onClick={handlePrintOrder}
                                        style={{ backgroundColor: "#2148C0", borderColor: "#007BFF", fontWeight: "bold", color: "white", marginRight: "10px" }}>
                                    <i className="fas fa-print me-2"></i>IMPRIMIR ORDEN
                                </Button>
                            )}
                            <Button variant="success" size="lg" onClick={handleSaveProduct}
                                    style={{ backgroundColor: "#BFD732", borderColor: "#BFD732", fontWeight: "bold" }}>
                                <i className="fas fa-save me-2"></i>GUARDAR
                            </Button>
                        </Col>
                    </Row>
                </Container>
                <Footer />
            </div>

            <div style={{ display: 'none' }}>
                <div ref={headlineReportRef}>
                    <ReportCompany dataReport={headLineInformation} />
                </div>
            </div>
        </>
    )
}