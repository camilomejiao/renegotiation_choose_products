import {Button, Col, Container, Form, Row, Table} from "react-bootstrap";
import './AddProducts.css';
import imgPeople from '../../../../assets/image/addProducts/people1.jpg';
import imgAdd from '../../../../assets/image/addProducts/imgAdd.png';
import frame from '../../../../assets/image/addProducts/Frame.png';
import {useEffect, useState} from "react";
import Select from "react-select";
import {useParams} from "react-router-dom";
import {userService} from "../../../../helpers/services/UserServices";
import {FaTrashAlt} from "react-icons/fa";
import {Footer} from "../footer/Footer";
import {HeaderImage} from "../../shared/header-image/HeaderImage";
import {UserInformation} from "../user_information/UserInformation";

export const AddProducts = () => {

    const params = useParams();

    const [userData, setUserData] = useState({});
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [subtotal, setSubtotal] = useState(0);
    const [iva, setIva] = useState(0);
    const [total, setTotal] = useState(0);

    const options = [
        { value: 'Semilla YIL8 X kg', label: 'Semilla YIL8 X kg', cod: 'CT567', price: 60000 },
        { value: 'Semilla df8 X kg', label: 'Semilla df8 X kg', cod: 'CT568', price: 60000 },
        { value: 'Semilla ghj56 X kg', label: 'Semilla ghj56 X kg', cod: 'CT569', price: 60000 },
    ];

    const getUserInformation = async (cubId) => {
        await userService.userInformation(cubId).then((data) => {
            console.log(data)
            setUserData(data);
        });
    }

    const addItemToTable = () => {
        if (selectedItem) {
            setItems([...items, { ...selectedItem, quantity: 1, discount: '0%' }]);
            setSelectedItem(null); // Reset the select
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

    const handleSaveProduct = () => {
        console.log(items);
    }

    useEffect(() => {
        const newSubtotal = items.reduce((acc, item) => {
            const itemTotal = item.price * item.quantity * (1 - (parseFloat(item.discount) || 0) / 100);
            return acc + itemTotal;
        }, 0);

        //const newIva = newSubtotal * 0.19; // Suponiendo que el IVA es del 19%
        const newIva = 0; // Suponiendo que el IVA es del 19%
        const newTotal = newSubtotal + newIva;

        setSubtotal(newSubtotal);
        setIva(newIva);
        setTotal(newTotal);
    }, [items]);

    useEffect(() => {
        if(params.id){
            getUserInformation(params.id);
        }
    }, []);

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
                                <span style={{ fontSize: "25px", fontWeight: "bold", color: "#FFF" }}>Saldo: $350.000</span>
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
                                        <td>{item.cod}</td>
                                        <td>{item.label}</td>
                                        <td>${item.price.toLocaleString()}</td>
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
                                        <td>${(item.price * item.quantity * (1 - (parseFloat(item.discount) || 0) / 100)).toLocaleString()}</td>
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
                            <Button variant="success" size="lg" onClick={handleSaveProduct}
                                    style={{ backgroundColor: "#BFD732", borderColor: "#BFD732", fontWeight: "bold" }}>
                                <i className="fas fa-save me-2"></i>GUARDAR
                            </Button>
                        </Col>
                    </Row>
                </Container>

                <Footer />
            </div>
        </>
    )
}