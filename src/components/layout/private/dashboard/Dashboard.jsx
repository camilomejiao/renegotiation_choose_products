import {Button, Col, Container, Form, Row} from "react-bootstrap";
import magnifyingGlass from '../../../../assets/image/icons/magnifying_glass.png';
import {useState} from "react";
import Swal from "sweetalert2";

import {useNavigate, useOutletContext} from "react-router-dom";

//css
import './Dashboard.css';

//
import {userService} from "../../../../helpers/services/UserServices";
import {Footer} from "../footer/Footer";

export const Dashboard = () => {

    const { userAuth } = useOutletContext();

    const [searchValue, setSearchValue] = useState("");
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();

        if (searchValue.trim() !== "" && parseInt(searchValue) > 5) {
            await userService.searchUser(searchValue).then((data) => {
                console.log(data);
                if(data.length === 0) {
                    Swal.fire({title: 'Oops...', html: 'Usuario no existe en el sistema', icon: 'error', width: 300, heightAuto: true});
                } else {
                    Swal.fire({title: 'Bien hecho!', html: 'Usuario encontrado', icon: 'success', width: 300, heightAuto: true});
                    userAuth.rol_id === 2
                        ? navigate(`/admin/add_products/${data.id}`)
                        : navigate(`/admin/reports/${data.id}`)
                }
            });
        }
    };

    return (
        <>
            <Container fluid className="dashboard-container">
                <Row className="text-center mt-5">
                    <Col>
                        <h1 className="dashboard-title">
                            Bienvenido al <span className="highlight-text">banco de <br/>Proveedores</span> de la DSCI
                        </h1>
                        <p className="green-box">
                            Da el siguiente paso en tus <span className="highlight-text2">ventas</span> ahora.
                        </p>
                    </Col>
                </Row>
                <Row className="justify-content-center mt-4">
                    <Col md={6} className="text-center">
                        <Form className="search-form d-flex align-items-center" onSubmit={handleSearch}>
                            <Form.Control
                                type="number"
                                min="1"
                                placeholder="Buscar"
                                className="search-input"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                            <Button type="submit" variant="outline-primary" className="search-button ms-2">
                                <img src={magnifyingGlass} alt="Buscar" style={{ width: "20px", height: "20px" }} />
                            </Button>
                        </Form>
                        <p className="search-helper-text mt-2">Ingrese número de C.C</p>
                    </Col>
                </Row>

                <Footer />
            </Container>
        </>
    );
}