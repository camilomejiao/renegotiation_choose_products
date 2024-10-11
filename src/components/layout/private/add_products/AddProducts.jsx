import {Button, Col, Container, Form, Row, Table} from "react-bootstrap";
import './AddProducts.css';
import imgPeople from '../../../../assets/image/addProducts/people1.jpg';
import imgAdd from '../../../../assets/image/addProducts/imgAdd.png';
import frame from '../../../../assets/image/addProducts/Frame.png';
import imgFooter from '../../../../assets/image/footer/footer.png';
import {useEffect, useState} from "react";
import Select from "react-select";
import {useParams} from "react-router-dom";
import {userService} from "../../../../helpers/services/UserServices";
import {FaTrashAlt} from "react-icons/fa";

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
                {/* Encabezado con la imagen de fondo y el título */}
                <div className="header-image position-relative">
                    <img src={imgPeople} alt="Fondo" className="background-image w-100" />
                    <div className="overlay-text position-absolute w-100 text-center">
                        <h1>¡Empieza a agregar tus productos!</h1>
                    </div>
                </div>

                {/* Contenedor de la información del usuario */}
                <div className="user-info-container">
                    <Row className="position-relative">
                        <Col className="d-flex justify-content-center">
                            {/* Icono separado del banner */}
                            <div className="icon-wrapper position-absolute" style={{ top: '-90px', left: '330px' }}>
                                <img src={imgAdd} alt="Icono" className="icon-large" />
                            </div>
                            {/* Banner de información */}
                            <div className="small-banner d-flex align-items-center text-white text-center p-2">
                                <p className="mb-0 ms-5">Todo está listo para que completes tu pedido de forma rápida y sencilla.</p>
                            </div>
                        </Col>
                    </Row>
                </div>

                {/* Contenedor de la información del usuario */}
                <div className="user-info-container">
                    <Container>
                        <Row className="align-items-center">
                            <Col xs={12} className="d-flex justify-content-center mb-2">
                                <img src={imgAdd} alt="Icono Usuario" className="user-icon" style={{ width: '60px', height: '60px', borderRadius: '50%', border: '3px solid #0056b3'}} />
                                <div className="user-name-container">
                                    <div className="user-name text-white px-3 py-1 rounded" style={{ backgroundColor: '#BFD732', fontSize: '18px', fontWeight: 'bold' }}>
                                        {userData.nombre} {userData.apellido}
                                    </div>
                                    <div className="user-id-container d-flex justify-content-center">
                                        <div className="user-id px-2 py-1 rounded" style={{ backgroundColor: '#0056b3', color: 'white', fontSize: '14px' }}>
                                            <strong>C.C:</strong> {userData.identificacion} <span className="ms-3"><strong>CUP:</strong> {userData.id}</span>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={12} className="user-details mt-5">
                                <Row>
                                    <Col xs={4}><strong>Municipio:</strong> Jambaló</Col>
                                    <Col xs={4}><strong>Actividad:</strong> Cultivador</Col>
                                    <Col xs={4}><strong>Plan:</strong> Agrícola</Col>
                                    <Col xs={4}><strong>Vereda:</strong> La esperanza</Col>
                                    <Col xs={4}><strong>Estado:</strong> Activo</Col>
                                    <Col xs={4}><strong>Línea:</strong> Café tradicional, siembra o sostenimiento</Col>
                                    <Col xs={4}><strong>Tipo de persona:</strong> Titular</Col>
                                    <Col xs={8}><strong>Restricción:</strong> Resguardado 2022</Col>
                                    <Col xs={4}><strong>Teléfono:</strong> 3028974444</Col>
                                    <Col xs={4}><strong>Etnia:</strong> Resguardo indígena Jambaló</Col>
                                </Row>
                            </Col>
                        </Row>
                    </Container>
                </div>

                {/* Sección de búsqueda */}
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

                <Row className="footer-image-container mt-5">
                    <Col>
                        <img src={imgFooter} alt="Footer" className="footer-image" />
                    </Col>
                </Row>
            </div>
        </>
    )
}