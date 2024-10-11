import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import logo1 from '../../../../assets/image/header/logo-DSCI.png'; // Asegúrate de que la ruta sea correcta
import './Header.css';

export const Header = () => {
    return (
        <header className="header">
            <Container fluid>
                <Row className="align-items-center">
                    <Col md={8} xs={12}>
                        <h1 className="portal-title">
                            Portal de <span className="portal-title-highlight">Proveedores</span>
                        </h1>
                    </Col>
                    <Col md={4} xs={12} className="d-flex justify-content-center">
                        <img src={logo1} alt="Agencia de Renovación del Territorio" className="header-logo" />
                    </Col>
                </Row>
            </Container>
        </header>
    );
};
