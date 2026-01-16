import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import logo1 from '../../../../assets/image/header/logo-DSCI.png'; // Asegúrate de que la ruta sea correcta
import './Header.css';

export const Header = () => {
    return (
        <header className="header">
            <Container fluid>
                <Row className="align-items-center">
                    <Col md={8} xs={8} className="d-flex align-items-center">
                        <h1 className="portal-title">
                            Portal <span className="portal-title-highlight">PNIS</span>
                        </h1>
                    </Col>
                    <Col md={4} xs={4} className="d-flex justify-content-end">
                        <img src={logo1} alt="Agencia de Renovación del Territorio" className="header-logo" />
                    </Col>
                </Row>
            </Container>
        </header>
    );
};
