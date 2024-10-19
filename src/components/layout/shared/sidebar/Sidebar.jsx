import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import {FaBars, FaStore, FaClipboardList, FaSignOutAlt} from 'react-icons/fa';
import './Sidebar.css';
import {useNavigate} from "react-router-dom";

export const Sidebar = ({userAuth}) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleApplication = () => {
        //Redirigir al login
        navigate("/");
    }

    const handleLogout = () => {
        //Redirigir al login
        navigate("/admin/logout");
    };

    const handleReport = () => {
        navigate(`/admin/reports-company`)
    };

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <Container fluid className="sidebar-content">

                <Row className="justify-content-center mt-3">
                    <Col xs={12} className="d-flex justify-content-center align-items-center application" onClick={handleApplication}>
                        <FaStore className="sidebar-icon" />
                        {isOpen && <span className="sidebar-text">Solicitud</span>}
                    </Col>
                </Row>
                {userAuth.rol_id === 2 && (
                    <Row className="justify-content-center mt-3">
                        <Col onClick={handleReport}
                             xs={12}
                             className="d-flex justify-content-center align-items-center reports"
                        >
                            <FaClipboardList className="sidebar-icon" />
                            {isOpen && <span className="sidebar-text">Reportes general</span>}
                        </Col>
                    </Row>
                )}

            </Container>
            <div className="logout" onClick={handleLogout}>
                <FaSignOutAlt className="logout-icon" />
                {isOpen && <span className="sidebar-text">Salir</span>}
            </div>
            <div className="sidebar-toggle" onClick={toggleSidebar}>
                <FaBars className="toggle-icon" />
            </div>
        </div>
    );
};
