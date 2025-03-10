import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Container, Accordion, Card } from 'react-bootstrap';
import {
    FaBars,
    FaSignOutAlt,
    FaShoppingCart,
    FaFileInvoiceDollar,
    FaChartPie,
    FaShippingFast,
    FaUsersCog,
    FaRegBuilding,
    FaDollyFlatbed,
    FaUsers,
    FaUser,
    FaHandshake,
    FaHardHat,
    FaCcPaypal
} from 'react-icons/fa';

//Css
import './Sidebar.css';

//Enum
import { RolesEnum } from "../../../../helpers/GlobalEnum";


export const Sidebar = ({userAuth}) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <Container fluid className="sidebar-content">
                    {/* Perfil del Usuario */}
                    {(
                        userAuth.rol_id === RolesEnum.ADMIN ||
                        userAuth.rol_id === RolesEnum.SUPERVISION ||
                        userAuth.rol_id === RolesEnum.TECHNICAL ||
                        userAuth.rol_id === RolesEnum.ENVIRONMENTAL) && (
                        <Accordion>
                            <Card className="accordion-card">
                                <Accordion.Header>
                                    <div className="accordion-toggle">
                                        <FaUser className="sidebar-icon" />
                                        {isOpen && <span className="sidebar-text">Perfil</span>}
                                    </div>
                                </Accordion.Header>
                                <Accordion.Body>
                                    <div className="dropdown-content">
                                        <div className="dropdown-item" onClick={() => navigate("/admin/search-user-for-renegociation")}>
                                            <FaHandshake className="sidebar-icon" />
                                            {isOpen && <span className="sidebar-text">Renegociación</span>}
                                        </div>
                                        <div className="dropdown-item" onClick={() => navigate("/")}>
                                            <FaUsersCog className="sidebar-icon" />
                                            {isOpen && <span className="sidebar-text">Gestión de usuarios</span>}
                                        </div>
                                        <div className="dropdown-item" onClick={() => navigate(`/admin/users`)}>
                                            <FaUsers className="sidebar-icon" />
                                            {isOpen && <span className="sidebar-text">Modulo Usuarios</span>}
                                        </div>
                                        <div className="dropdown-item" onClick={() => navigate(`/admin/payments`)}>
                                            <FaCcPaypal className="sidebar-icon" />
                                            {isOpen && <span className="sidebar-text">Modulo Pagos</span>}
                                        </div>
                                    </div>
                                </Accordion.Body>
                            </Card>
                        </Accordion>
                    )}

                    {/* Gestión de Usuarios para Roles Administrativos */}
                    {(userAuth.rol_id === RolesEnum.TERRITORIAL_LINKS) && (
                        <Accordion>
                            <Card className="accordion-card">
                                <Accordion.Header>
                                    <div className="accordion-toggle">
                                        <FaHardHat className="sidebar-icon" />
                                        {isOpen && <span className="sidebar-text">Tecnico Territorio</span>}
                                    </div>
                                </Accordion.Header>
                                <Accordion.Body>
                                    <div className="dropdown-content">
                                        <div className="dropdown-item" onClick={() => navigate("/admin/search-user-for-renegociation")}>
                                            <FaHandshake className="sidebar-icon" />
                                            {isOpen && <span className="sidebar-text">Renegociación</span>}
                                        </div>
                                        <div className="dropdown-item" onClick={() => navigate("/")}>
                                            <FaUsersCog className="sidebar-icon" />
                                            {isOpen && <span className="sidebar-text">Gestión de usuarios</span>}
                                        </div>
                                        <div className="dropdown-item" onClick={() => navigate(`/admin/products`)}>
                                            <FaDollyFlatbed className="sidebar-icon" />
                                            {isOpen && <span className="sidebar-text">Modulo Productos</span>}
                                        </div>
                                    </div>
                                </Accordion.Body>
                            </Card>
                        </Accordion>
                    )}

                    {/* Acordeón para Proveedores */}
                    {(userAuth.rol_id === RolesEnum.SUPPLIER) && (
                        <Accordion>
                            <Card className="accordion-card">
                                <Accordion.Header>
                                    <div className="accordion-toggle">
                                        <FaRegBuilding className="sidebar-icon" />
                                        {isOpen && <span className="sidebar-text">Proveedores</span>}
                                    </div>
                                </Accordion.Header>
                                <Accordion.Body>
                                    <div className="dropdown-content">
                                        <div className="dropdown-item" onClick={() => navigate("/")}>
                                            <FaShoppingCart className="sidebar-icon" />
                                            {isOpen && <span className="sidebar-text">Solicitud</span>}
                                        </div>
                                        <div className="dropdown-item" onClick={() => navigate(`/admin/order-report`)}>
                                            <FaFileInvoiceDollar className="sidebar-icon" />
                                            {isOpen && <span className="sidebar-text">Ordenes de compra</span>}
                                        </div>
                                        <div className="dropdown-item" onClick={() => navigate(`/admin/search-user-for-deliveries`)}>
                                            <FaShippingFast className="sidebar-icon" />
                                            {isOpen && <span className="sidebar-text">Entregas</span>}
                                        </div>
                                        <div className="dropdown-item" onClick={() => navigate(`/admin/products`)}>
                                            <FaDollyFlatbed className="sidebar-icon" />
                                            {isOpen && <span className="sidebar-text">Productos</span>}
                                        </div>
                                        <div className="dropdown-item" onClick={() => navigate(`/admin/company-reports`)}>
                                            <FaChartPie className="sidebar-icon" />
                                            {isOpen && <span className="sidebar-text">Reportes general</span>}
                                        </div>
                                    </div>
                                </Accordion.Body>
                            </Card>
                        </Accordion>
                    )}
                </Container>

                {/* Toggle Sidebar */}
                <div className="logout" onClick={() => navigate("/admin/logout")}>
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
