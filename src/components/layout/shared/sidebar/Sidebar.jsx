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

    const handleApplication = () => {
        navigate("/");
    };

    const handleRenegociation = () => {
        navigate("/admin/search-user-for-renegociation");
    };

    const handleOrderReport = () => {
        navigate(`/admin/order-report`)
    };

    const handleDeliveries = () => {
        navigate(`/admin/search-user-for-deliveries`)
    };

    const handleProducts = () => {
        navigate(`/admin/products`)
    };

    const handlePayments = () => {
        navigate(`/admin/payments`)
    };

    const handleUsers = () => {
        navigate(`/admin/users`)
    };

    const handleReport = () => {
        navigate(`/admin/company-reports`)
    };

    const handleLogout = () => {
        navigate("/admin/logout");
    };

    return (
        <>
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <Container fluid className="sidebar-content">
                    {/* Perfil del Usuario */}
                    {(userAuth.rol_id === RolesEnum.ADMIN || userAuth.rol_id === RolesEnum.SUPERVISION) && (
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
                                        <div className="dropdown-item" onClick={handleRenegociation}>
                                            <FaHandshake className="sidebar-icon" />
                                            {isOpen && <span className="sidebar-text">Renegociación</span>}
                                        </div>
                                        <div className="dropdown-item" onClick={handleApplication}>
                                            <FaUsersCog className="sidebar-icon" />
                                            {isOpen && <span className="sidebar-text">Gestión de usuarios</span>}
                                        </div>
                                        <div className="dropdown-item" onClick={handleUsers}>
                                            <FaUsers className="sidebar-icon" />
                                            {isOpen && <span className="sidebar-text">Modulo Usuarios</span>}
                                        </div>
                                        <div className="dropdown-item" onClick={handleProducts}>
                                            <FaDollyFlatbed className="sidebar-icon" />
                                            {isOpen && <span className="sidebar-text">Modulo Productos</span>}
                                        </div>
                                        <div className="dropdown-item" onClick={handlePayments}>
                                            <FaCcPaypal className="sidebar-icon" />
                                            {isOpen && <span className="sidebar-text">Modulo Pagos</span>}
                                        </div>
                                    </div>
                                </Accordion.Body>
                            </Card>
                        </Accordion>
                    )}

                    {/* Gestión de Usuarios para Roles Administrativos */}
                    {(userAuth.rol_id === RolesEnum.MANAGEMENT_TECHNICIAN) && (
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
                                        <div className="dropdown-item" onClick={handleRenegociation}>
                                            <FaHandshake className="sidebar-icon" />
                                            {isOpen && <span className="sidebar-text">Renegociación</span>}
                                        </div>
                                        <div className="dropdown-item" onClick={handleApplication}>
                                            <FaUsersCog className="sidebar-icon" />
                                            {isOpen && <span className="sidebar-text">Gestión de usuarios</span>}
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
                                        <div className="dropdown-item" onClick={handleApplication}>
                                            <FaShoppingCart className="sidebar-icon" />
                                            {isOpen && <span className="sidebar-text">Solicitud</span>}
                                        </div>
                                        <div className="dropdown-item" onClick={handleOrderReport}>
                                            <FaFileInvoiceDollar className="sidebar-icon" />
                                            {isOpen && <span className="sidebar-text">Ordenes de compra</span>}
                                        </div>
                                        <div className="dropdown-item" onClick={handleDeliveries}>
                                            <FaShippingFast className="sidebar-icon" />
                                            {isOpen && <span className="sidebar-text">Entregas</span>}
                                        </div>
                                        <div className="dropdown-item" onClick={handleProducts}>
                                            <FaDollyFlatbed className="sidebar-icon" />
                                            {isOpen && <span className="sidebar-text">Productos</span>}
                                        </div>
                                        <div className="dropdown-item" onClick={handleReport}>
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
