import {createElement, useState} from 'react';
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
    FaUser,
    FaHandshake,
    FaHardHat,
    FaCcPaypal
} from 'react-icons/fa';

import './Sidebar.css';
import { RolesEnum } from "../../../../helpers/GlobalEnum";

const menuConfig = {
    [RolesEnum.ADMIN]: [
        { path: "/admin/search-user-for-renegociation", icon: FaHandshake, label: "Renegociación" },
        { path: "/", icon: FaUsersCog, label: "Gestión De Usuarios" },
        { path: "/admin/products", icon: FaDollyFlatbed, label: "Modulo De Productos" },
    ],
    [RolesEnum.SUPERVISION]: [
        { path: "/admin/search-user-for-renegociation", icon: FaHandshake, label: "Renegociación" },
        { path: "/", icon: FaUsersCog, label: "Gestión De Usuarios" },
        { path: "/admin/products", icon: FaDollyFlatbed, label: "Modulo De Productos" },
    ],
    [RolesEnum.ENVIRONMENTAL]: [
        { path: "/admin/search-user-for-renegociation", icon: FaHandshake, label: "Renegociación" },
        { path: "/", icon: FaUsersCog, label: "Gestión De Usuarios" },
        { path: "/admin/products", icon: FaDollyFlatbed, label: "Modulo De Productos" },
    ],
    [RolesEnum.TECHNICAL]: [
        { path: "/admin/products", icon: FaDollyFlatbed, label: "Modulo De Productos" },
    ],
    [RolesEnum.TERRITORIAL_LINKS]: [
        { path: "/admin/search-user-for-renegociation", icon: FaHandshake, label: "Renegociación" },
        { path: "/", icon: FaUsersCog, label: "Gestión De Usuarios" },
        { path: "/admin/products", icon: FaDollyFlatbed, label: "Modulo De Productos" },
    ],
    [RolesEnum.SUPPLIER]: [
        { path: "/", icon: FaShoppingCart, label: "Solicitud" },
        { path: "/admin/order-report", icon: FaFileInvoiceDollar, label: "Ordenes de compra" },
        { path: "/admin/search-user-for-deliveries", icon: FaShippingFast, label: "Entregas" },
        { path: "/admin/products", icon: FaDollyFlatbed, label: "Modulo Productos" },
        { path: "/admin/company-reports", icon: FaChartPie, label: "Reportes general" },
    ]
};

export const Sidebar = ({ userAuth }) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);

    const role = userAuth?.rol_id;
    const items = menuConfig[role] || [];
    const title = role === RolesEnum.SUPPLIER ? 'Proveedor' : role === RolesEnum.TERRITORIAL_LINKS ? 'Tecnico Territorio' : 'Perfil';
    const titleIcon = role === RolesEnum.SUPPLIER ? FaRegBuilding : role === RolesEnum.TERRITORIAL_LINKS ? FaHardHat : FaUser;

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <Container fluid className="sidebar-content">
                {items.length > 0 && (
                    <Accordion>
                        <Card className="accordion-card">
                            <Accordion.Header>
                                <div className="accordion-toggle">
                                    {titleIcon && createElement(titleIcon, { className: "sidebar-icon" })}
                                    {isOpen && <span className="sidebar-text">{title}</span>}
                                </div>
                            </Accordion.Header>
                            <Accordion.Body>
                                <div className="dropdown-content">
                                    {items.map(({ path, icon: Icon, label }) => (
                                        <div className="dropdown-item" key={path} onClick={() => navigate(path)}>
                                            <Icon className="sidebar-icon" />
                                            {isOpen && <span className="sidebar-text">{label}</span>}
                                        </div>
                                    ))}
                                </div>
                            </Accordion.Body>
                        </Card>
                    </Accordion>
                )}
            </Container>

            <div className="logout" onClick={() => navigate("/admin/logout")}>
                <FaSignOutAlt className="logout-icon" />
                {isOpen && <span className="sidebar-text">Salir</span>}
            </div>
            <div className="sidebar-toggle" onClick={toggleSidebar}>
                <FaBars className="toggle-icon" />
            </div>
        </div>
    );
};
