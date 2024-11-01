import { useState } from 'react';
import { Container, Accordion, Card } from 'react-bootstrap';
import {
    FaBars,
    FaStore,
    FaClipboardList,
    FaSignOutAlt,
    FaHome,
    FaUserCircle,
    FaIndustry,
    FaReceipt
} from 'react-icons/fa';
import './Sidebar.css';
import { useNavigate } from "react-router-dom";

export const Sidebar = ({userAuth}) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleApplication = () => {
        navigate("/");
    }

    const handleLogout = () => {
        navigate("/admin/logout");
    };

    const handleOrderReport = () => {
        navigate(`/admin/order-report`)
    };

    const handleReport = () => {
        navigate(`/admin/company-reports`)
    };

    return (
        <>
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <Container fluid className="sidebar-content">
                    {userAuth.rol_id === 3 && (
                        <Accordion>
                            {/* Acordeón Menú 1 */}
                            <Card className="accordion-card">
                                <Accordion.Header>
                                    <div className="accordion-toggle">
                                        <FaUserCircle className="sidebar-icon" />
                                        {isOpen && <span className="sidebar-text">DSCI</span>}
                                    </div>
                                </Accordion.Header>
                                <Accordion.Body>
                                    <div className="dropdown-content">
                                        <div className="dropdown-item" onClick={handleApplication}>
                                            <FaStore className="sidebar-icon" />
                                            {isOpen && <span className="sidebar-text">Solicitud</span>}
                                        </div>
                                    </div>
                                </Accordion.Body>
                            </Card>
                        </Accordion>
                    )}
                    {userAuth.rol_id === 2 && (
                        <Accordion>
                            {/* Acordeón Menú 2 */}
                            <Card className="accordion-card">
                                <Accordion.Header>
                                    <div className="accordion-toggle">
                                        <FaIndustry className="sidebar-icon" />
                                        {isOpen && <span className="sidebar-text">Proveedores</span>}
                                    </div>
                                </Accordion.Header>
                                <Accordion.Body>
                                    <div className="dropdown-content">
                                        <div className="dropdown-item" onClick={handleApplication}>
                                            <FaHome className="sidebar-icon" />
                                            {isOpen && <span className="sidebar-text">Solicitud</span>}
                                        </div>
                                        <div className="dropdown-item" onClick={handleOrderReport}>
                                            <FaReceipt className="sidebar-icon" />
                                            {isOpen && <span className="sidebar-text">Ordenes de compra</span>}
                                        </div>
                                        <div className="dropdown-item" onClick={handleReport}>
                                            <FaClipboardList className="sidebar-icon" />
                                            {isOpen && <span className="sidebar-text">Reportes general</span>}
                                        </div>
                                    </div>
                                </Accordion.Body>
                            </Card>
                        </Accordion>
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
        </>
    );
};
