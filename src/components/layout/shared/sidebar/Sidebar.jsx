import { createElement, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Container, Accordion, Card } from 'react-bootstrap';
import {
    FaBars,
    FaSignOutAlt,
    FaShoppingCart,
    FaFileInvoiceDollar,
    FaChartPie,
    FaShippingFast,
    FaRegBuilding,
    FaUser,
    FaHandshake,
    FaHardHat,
    FaHouseUser,
    FaBoxOpen,
    FaDollyFlatbed,
    FaExclamationTriangle,
    FaSearchDollar,
    FaRoute,
    FaUserCog, FaRegAddressBook, FaBoxes, FaTools, FaLeaf, FaUserCheck, FaSearchPlus,
} from 'react-icons/fa';
import { MdCampaign, MdPeople } from "react-icons/md";
import { BsCashStack, BsShieldCheck } from "react-icons/bs";

//Css
import './Sidebar.css';

//Enum
import { RolesEnum } from "../../../../helpers/GlobalEnum";

const menuConfig = {
    [RolesEnum.ADMIN]: [
        { path: "/", icon: FaHouseUser, label: "Inicio" },
        {
            label: "Administración Catálogo de productos",
            icon: FaBoxes,
            children: [
                { path: "/admin/list-products-by-convocation", icon: FaTools, label: "Administración de Catálogo Técnica" },
                { path: "/admin/products-enviromental", icon: FaLeaf, label: "Validación de Ambiental" },
                { path: "/admin/products-supervision", icon: FaUserCheck, label: "Validación de Supervisión" },
            ]
        },
        { path: "/admin/search-user-for-renegociation", icon: FaHandshake, label: "Renegociación" },
        { path: "/admin/search-user", icon: FaRegAddressBook, label: "Gestión Integral del Beneficiario" },
        { path: "/admin/search-beneficiary-information", icon: FaSearchPlus, label: "Consultar Beneficiario" },
        { path: "/admin/management", icon: FaUserCog, label: "Control de Usuarios/Proveedores" },
        { path: "/admin/list-convocation", icon: MdCampaign, label: "Jornadas" },
        { path: "/admin/delivery-information-and-tracking", icon: FaRoute, label: "Seguimiento de entregas" },
        { path: "/admin/fiduciary/search-sp", icon: FaSearchDollar, label: "Consulta de Solicitudes de Pago" },
        //{ path: "/admin/supplier-validation", icon: BsShieldCheck, label: "Validación de proveedores" },
        //{ path: "/admin/create-calls-suppliers", icon: MdCampaign, label: "Convocatorias" },
        { path: "/admin/logout", icon: FaSignOutAlt, label: "Salir" },
    ],
    [RolesEnum.SUPERVISION]: [
        { path: "/", icon: FaHouseUser, label: "Inicio" },
        //{ path: "/admin/search-beneficiary-information", icon: FaSearchPlus, label: "Consultar Beneficiario" },
        { path: "/admin/products-supervision", icon: FaUserCheck, label: "Catálogo de productos" },
        { path: "/admin/search-user-for-renegociation", icon: FaHandshake, label: "Renegociación" },
        { path: "/admin/search-user", icon: FaRegAddressBook, label: "Gestión Integral del Beneficiario" },
        { path: "/admin/payments", icon: BsCashStack, label: "Modulo De Pagos" },
        { path: "/admin/delivery-information-and-tracking", icon: FaRoute, label: "Seguimiento de entregas" },
        { path: "/admin/fiduciary/search-sp", icon: FaSearchDollar, label: "Consulta de Solicitudes de Pago" },
        { path: "/admin/logout", icon: FaSignOutAlt, label: "Salir" },
    ],
    [RolesEnum.PAYMENTS]: [
        //{ path: "/admin/search-beneficiary-information", icon: FaSearchPlus, label: "Consultar Beneficiario" },
        { path: "/admin/payments", icon: BsCashStack, label: "Modulo De Pagos" },
        { path: "/admin/logout", icon: FaSignOutAlt, label: "Salir" },
    ],
    [RolesEnum.TRUST_PAYMENTS]: [
        //{ path: "/admin/search-beneficiary-information", icon: FaSearchPlus, label: "Consultar Beneficiario" },
        { path: "/admin/delivery-information-and-tracking", icon: FaRoute, label: "Seguimiento de entregas" },
        { path: "/admin/payments", icon: BsCashStack, label: "Modulo De Pagos" },
        { path: "/admin/fiduciary/search-sp", icon: FaSearchDollar, label: "Consulta de Solicitudes de Pago" },
        { path: "/admin/logout", icon: FaSignOutAlt, label: "Salir" },
    ],
    [RolesEnum.ENVIRONMENTAL]: [
        //{ path: "/admin/search-beneficiary-information", icon: FaSearchPlus, label: "Consultar Beneficiario" },
        { path: "/admin/products-enviromental", icon: FaLeaf, label: "Validación de Catálogo de productos" },
        { path: "/admin/search-user-for-renegociation", icon: FaHandshake, label: "Renegociación" },
        { path: "/admin/search-user", icon: FaRegAddressBook, label: "Gestión Integral del Beneficiario" },
        { path: "/admin/logout", icon: FaSignOutAlt, label: "Salir" },
    ],
    [RolesEnum.TECHNICAL]: [
        { path: "/", icon: FaHouseUser, label: "Inicio" },
        { path: "/admin/list-products-by-convocation", icon: FaTools, label: "Administración de Catálogo" },
        //{ path: "/admin/search-beneficiary-information", icon: FaSearchPlus, label: "Consultar Beneficiario" },
        { path: "/admin/search-user", icon: FaRegAddressBook, label: "Gestión Integral del Beneficiario" },
        { path: "/admin/delivery-information-and-tracking", icon: FaRoute, label: "Seguimiento de entregas" },
        { path: "/admin/logout", icon: FaSignOutAlt, label: "Salir" },
    ],
    [RolesEnum.TERRITORIAL_LINKS]: [
        { path: "/", icon: FaHouseUser, label: "Inicio" },
        { path: "/admin/search-user-for-renegociation", icon: FaHandshake, label: "Renegociación" },
        { path: "/admin/search-user", icon: FaRegAddressBook, label: "Gestión Integral del Beneficiario" },
        { path: "/admin/delivery-information-and-tracking", icon: FaRoute, label: "Seguimiento de entregas" },
        //{ path: "/admin/search-beneficiary-information", icon: FaSearchPlus, label: "Consultar Beneficiario" },
        { path: "/admin/logout", icon: FaSignOutAlt, label: "Salir" },
    ],
    [RolesEnum.SUPPLIER]: [
        { path: "/", icon: FaHouseUser, label: "Inicio" },
        { path: "/admin/product-price-quotes", icon: FaBoxOpen, label: "Cotización de catalogos" },
        { path: "/admin/search-user", icon: FaShoppingCart, label: "Carrito de compras" },
        { path: "/admin/order-report", icon: FaFileInvoiceDollar, label: "Ordenes de compra" },
        {
            label: "Entregas",
            icon: FaShippingFast,
            children: [
                { path: "/admin/search-user-for-deliveries", icon: FaDollyFlatbed, label: "Realizar Entregas" },
                { path: "/admin/delivery-information-and-tracking", icon: FaExclamationTriangle, label: "Seguimiento de entregas" },
            ]
        },
        { path: "/admin/payments-suppliers", icon: BsCashStack, label: "Solicitud de pago" },
        { path: "/admin/company-reports", icon: FaChartPie, label: "Reportes general" },
        { path: "/admin/logout", icon: FaSignOutAlt, label: "Salir" },
    ],
    [RolesEnum.SYSTEM_USER]: [
        { path: "/", icon: FaHouseUser, label: "Inicio" },
        { path: "/admin/list-convocation", icon: MdCampaign, label: "Jornadas" },
        { path: "/admin/supplier-validation", icon: BsShieldCheck, label: "Validación de proveedores" },
        { path: "/admin/search-user-for-renegociation", icon: FaHandshake, label: "Renegociación" },
        { path: "/admin/search-user", icon: FaRegAddressBook, label: "Gestión De Beneficiarios" },
        { path: "/admin/products-supervision", icon: FaBoxOpen, label: "Catálogo de productos" },
        { path: "/admin/management", icon: MdPeople, label: "Gestión Integral del Beneficiario" },
        { path: "/admin/search-beneficiary-information", icon: FaSearchPlus, label: "Consultar Beneficiario" },
        { path: "/admin/delivery-information-and-tracking", icon: FaRoute, label: "Seguimiento de entregas" },
        { path: "/admin/fiduciary/search-sp", icon: FaSearchDollar, label: "Consulta de Solicitudes de Pago" },
        { path: "/admin/logout", icon: FaSignOutAlt, label: "Salir" },
    ]
};

export const Sidebar = ({ userAuth }) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [openSubmenus, setOpenSubmenus] = useState({});

    const toggleSidebar = () => setIsOpen(!isOpen);

    const toggleSubmenu = (label) => {
        setOpenSubmenus((prev) => ({ ...prev, [label]: !prev[label] }));
    };

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
                                    {items.map((item) => {
                                        if (item.children && Array.isArray(item.children)) {
                                            const isSubmenuOpen = openSubmenus[item.label];

                                            return (
                                                <div className={`dropdown-item has-submenu ${isSubmenuOpen ? "expanded" : ""}`} key={item.label}>
                                                    <div className="submenu-header" onClick={() => toggleSubmenu(item.label)}>
                                                        {createElement(item.icon, { className: "sidebar-icon" })}
                                                        {isOpen && (
                                                            <>
                                                                <span className="sidebar-text">{item.label}</span>
                                                                <span className="submenu-toggle">{isSubmenuOpen ? "▲" : "▼"}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                    {isSubmenuOpen && (
                                                        <div className="submenu-body">
                                                            {item.children.map((subItem) => (
                                                                <div
                                                                    className="dropdown-item sub-item"
                                                                    key={subItem.path}
                                                                    onClick={() => navigate(subItem.path)}
                                                                >
                                                                    {subItem?.icon && createElement(subItem.icon, { className: "sidebar-icon" })}
                                                                    {isOpen && <span className="sidebar-text ms-4">{subItem.label}</span>}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        }

                                        const Icon = item.icon;
                                        return (
                                            <div className="dropdown-item" key={item.path} onClick={() => navigate(item.path)}>
                                                {Icon && <Icon className="sidebar-icon" />}
                                                {isOpen && <span className="sidebar-text">{item.label}</span>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </Accordion.Body>
                        </Card>
                    </Accordion>
                )}
            </Container>

            <div className="sidebar-toggle" onClick={toggleSidebar}>
                <FaBars className="toggle-icon" />
            </div>
        </div>
    );

};
