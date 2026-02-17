import { createElement, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
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
    FaSearchDollar,
    FaRoute,
    FaUserCog,
    FaRegAddressBook,
    FaBoxes,
    FaTools,
    FaLeaf,
    FaUserCheck,
    FaSearchPlus,
    FaTimes,
} from 'react-icons/fa';
import { MdCampaign, MdPeople } from "react-icons/md";
import { BsBank, BsCashStack } from "react-icons/bs";

import { RolesEnum } from "../../../../helpers/GlobalEnum";

const menuConfig = (role, id) => {
    const config = {
        [RolesEnum.ADMIN]: [
            { path: "/", icon: FaHouseUser, label: "Inicio" },
            {
                label: "Administracion Catalogo de productos",
                icon: FaBoxes,
                children: [
                    { path: "/admin/list-products-by-convocation", icon: FaTools, label: "Administracion de Catalogo Tecnica" },
                    { path: "/admin/products-enviromental", icon: FaLeaf, label: "Validacion de Ambiental" },
                    { path: "/admin/products-supervision", icon: FaUserCheck, label: "Validacion de Supervision" },
                ]
            },
            { path: "/admin/search-user-for-renegociation", icon: FaHandshake, label: "Renegociacion" },
            { path: "/admin/search-user", icon: FaRegAddressBook, label: "Gestion Integral del Beneficiario" },
            { path: "/admin/search-beneficiary-information", icon: FaSearchPlus, label: "Consultar Titular" },
            { path: "/admin/management", icon: FaUserCog, label: "Control de Usuarios/Proveedores" },
            { path: "/admin/list-convocation", icon: MdCampaign, label: "Jornadas" },
            { path: "/admin/delivery-information-and-tracking", icon: FaRoute, label: "Seguimiento de entregas" },
            { path: "/admin/fiduciary/search-sp", icon: FaSearchDollar, label: "Consulta de Solicitudes de Pago" },
            { path: "/admin/payments-suppliers/create-collection-account", icon: BsBank, label: "Solicitud de pago" },
            { path: "/admin/logout", icon: FaSignOutAlt, label: "Salir" },
        ],
        [RolesEnum.SUPERVISION]: [
            { path: "/admin/products-supervision", icon: FaUserCheck, label: "Catalogo de productos" },
            { path: "/admin/search-user-for-renegociation", icon: FaHandshake, label: "Renegociacion" },
            { path: "/admin/search-user", icon: FaRegAddressBook, label: "Gestion Integral del Beneficiario" },
            { path: "/admin/search-beneficiary-information", icon: FaSearchPlus, label: "Consultar Titular" },
            { path: "/admin/payments", icon: BsCashStack, label: "Modulo De Pagos" },
            { path: "/admin/delivery-information-and-tracking", icon: FaRoute, label: "Seguimiento de entregas" },
            { path: "/admin/fiduciary/search-sp", icon: FaSearchDollar, label: "Consulta de Solicitudes de Pago" },
            { path: "/admin/logout", icon: FaSignOutAlt, label: "Salir" },
        ],
        [RolesEnum.PAYMENTS]: [
            { path: "/admin/search-user", icon: FaRegAddressBook, label: "Gestion Integral del Beneficiario" },
            { path: "/admin/search-beneficiary-information", icon: FaSearchPlus, label: "Consultar Titular" },
            { path: "/admin/payments-suppliers/create-collection-account", icon: BsBank, label: "Solicitud de pago" },
            { path: "/admin/payments", icon: BsCashStack, label: "Modulo De Pagos" },
            { path: "/admin/logout", icon: FaSignOutAlt, label: "Salir" },
        ],
        [RolesEnum.TRUST_PAYMENTS]: [
            { path: "/admin/search-beneficiary-information", icon: FaSearchPlus, label: "Consultar Titular" },
            { path: "/admin/delivery-information-and-tracking", icon: FaRoute, label: "Seguimiento de entregas" },
            { path: "/admin/payments-suppliers/create-collection-account", icon: BsBank, label: "Solicitud de pago" },
            { path: "/admin/payments", icon: BsCashStack, label: "Modulo De Pagos" },
            { path: "/admin/fiduciary/search-sp", icon: FaSearchDollar, label: "Consulta de Solicitudes de Pago" },
            { path: "/admin/logout", icon: FaSignOutAlt, label: "Salir" },
        ],
        [RolesEnum.ENVIRONMENTAL]: [
            { path: "/admin/search-beneficiary-information", icon: FaSearchPlus, label: "Consultar Titular" },
            { path: "/admin/products-enviromental", icon: FaLeaf, label: "Validacion de Catalogo de productos" },
            { path: "/admin/search-user-for-renegociation", icon: FaHandshake, label: "Renegociacion" },
            { path: "/admin/search-user", icon: FaRegAddressBook, label: "Gestion Integral del Beneficiario" },
            { path: "/admin/logout", icon: FaSignOutAlt, label: "Salir" },
        ],
        [RolesEnum.TECHNICAL]: [
            { path: "/admin/list-products-by-convocation", icon: FaTools, label: "Administracion de Catalogo" },
            { path: "/admin/search-beneficiary-information", icon: FaSearchPlus, label: "Consultar Titular" },
            { path: "/admin/search-user", icon: FaRegAddressBook, label: "Gestion Integral del Beneficiario" },
            { path: "/admin/delivery-information-and-tracking", icon: FaRoute, label: "Seguimiento de entregas" },
            { path: "/admin/logout", icon: FaSignOutAlt, label: "Salir" },
        ],
        [RolesEnum.TERRITORIAL_LINKS]: [
            { path: "/", icon: FaHouseUser, label: "Inicio" },
            { path: "/admin/search-user-for-renegociation", icon: FaHandshake, label: "Renegociacion" },
            { path: "/admin/search-user", icon: FaRegAddressBook, label: "Gestion Integral del Beneficiario" },
            { path: "/admin/delivery-information-and-tracking", icon: FaRoute, label: "Seguimiento de entregas" },
            { path: "/admin/logout", icon: FaSignOutAlt, label: "Salir" },
        ],
        [RolesEnum.SUPPLIER]: [
            { path: `/admin/edit-suppliers/${id}`, icon: BsBank, label: "Gestion del Proveedor" },
            { path: "/admin/product-price-quotes", icon: FaBoxOpen, label: "Cotizacion de catalogos" },
            { path: "/admin/search-user", icon: FaShoppingCart, label: "Carrito de compras" },
            { path: "/admin/order-report", icon: FaFileInvoiceDollar, label: "Ordenes de compra" },
            { path: "/admin/search-user-for-deliveries", icon: FaShippingFast, label: "Entregas" },
            { path: "/admin/delivery-information-and-tracking", icon: FaRoute, label: "Seguimiento de entregas" },
            { path: "/admin/payments-suppliers", icon: BsCashStack, label: "Cuentas de cobro" },
            { path: "/admin/company-reports", icon: FaChartPie, label: "Reportes general" },
            { path: "/admin/logout", icon: FaSignOutAlt, label: "Salir" },
        ],
        [RolesEnum.SYSTEM_USER]: [
            { path: "/", icon: FaHouseUser, label: "Inicio" },
            { path: "/admin/list-convocation", icon: MdCampaign, label: "Jornadas" },
            { path: "/admin/management", icon: MdPeople, label: "Control de Usuarios/Proveedores" },
            { path: "/admin/search-beneficiary-information", icon: FaSearchPlus, label: "Consultar Titular" },
            { path: "/admin/search-user-for-renegociation", icon: FaHandshake, label: "Renegociacion" },
            { path: "/admin/search-user", icon: FaRegAddressBook, label: "Gestion De Beneficiarios" },
            { path: "/admin/delivery-information-and-tracking", icon: FaRoute, label: "Seguimiento de entregas" },
            { path: "/admin/fiduciary/search-sp", icon: FaSearchDollar, label: "Consulta de Solicitudes de Pago" },
            {
                label: "Administracion Catalogo de productos",
                icon: FaBoxes,
                children: [
                    { path: "/admin/list-products-by-convocation", icon: FaTools, label: "Administracion de Catalogo Tecnica" },
                    { path: "/admin/products-enviromental", icon: FaLeaf, label: "Validacion de Ambiental" },
                    { path: "/admin/products-supervision", icon: FaUserCheck, label: "Validacion de Supervision" },
                ]
            },
            { path: "/admin/logout", icon: FaSignOutAlt, label: "Salir" },
        ],
        [RolesEnum.LEGAL]: [
            { path: "/admin/management", icon: MdPeople, label: "Gestion Integral del Beneficiario" },
            { path: "/admin/search-beneficiary-information", icon: FaSearchPlus, label: "Consultar Titular" },
            { path: "/admin/logout", icon: FaSignOutAlt, label: "Salir" },
        ]
    };
    return config[role] || [];
};

const getRoleTitle = (role) => {
    const titles = {
        [RolesEnum.SUPPLIER]: 'Proveedor',
        [RolesEnum.TERRITORIAL_LINKS]: 'Tecnico Territorio',
        [RolesEnum.TECHNICAL]: 'Implementacion',
        [RolesEnum.PAYMENTS]: 'Pagos',
        [RolesEnum.TRUST_PAYMENTS]: 'Fiduciaria',
        [RolesEnum.ENVIRONMENTAL]: 'Ambiental',
        [RolesEnum.LEGAL]: 'Juridica',
    };

    return titles[role] ?? 'Perfil';
};

export const Sidebar = ({ userAuth, isOpen = true, isMobile = false, onToggle, onCloseMobile }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [openSubmenus, setOpenSubmenus] = useState({});

    const toggleSidebar = () => {
        if (onToggle) {
            onToggle(!isOpen);
        }
    };

    const toggleSubmenu = (label) => {
        setOpenSubmenus((prev) => ({ ...prev, [label]: !prev[label] }));
    };

    const handleNavigate = (path) => {
        navigate(path);
        if (isMobile && onCloseMobile) {
            onCloseMobile();
        }
    };

    const role = userAuth?.rol_id;
    const items = menuConfig(role, userAuth?.id);
    const title = getRoleTitle(role);
    const titleIcon = role === RolesEnum.SUPPLIER ? FaRegBuilding : role === RolesEnum.TERRITORIAL_LINKS ? FaHardHat : FaUser;

    const isActive = (path) => {
        if (!path) return false;
        if (path === "/" && (location.pathname === "/" || location.pathname === "/admin")) return true;
        return location.pathname.startsWith(path) && path !== "/";
    };

    return (
        <div className={`gov-sidebar ${isOpen ? 'open' : ''}`}>
            {isMobile && (
                <div className="sidebar-mobile-header">
                    <strong>Menu</strong>
                    <button type="button" className="sidebar-mobile-close" onClick={toggleSidebar} aria-label="Cerrar menu">
                        <FaTimes />
                    </button>
                </div>
            )}

            <div className="nav-item">
                <div className="nav-link" style={{ cursor: 'default' }}>
                    {titleIcon && createElement(titleIcon, { className: "sidebar-icon" })}
                    {isOpen && <span>{title}</span>}
                </div>
            </div>

            {items.map((item) => {
                if (item.children && Array.isArray(item.children)) {
                    const isSubmenuOpen = openSubmenus[item.label];
                    const hasActiveChild = item.children.some((subItem) => isActive(subItem.path));
                    return (
                        <div className="nav-item" key={item.label}>
                            <button
                                type="button"
                                className={`nav-link ${hasActiveChild ? 'active' : ''}`}
                                onClick={() => toggleSubmenu(item.label)}
                            >
                                {createElement(item.icon, { className: "sidebar-icon" })}
                                {isOpen && (
                                    <>
                                        <span>{item.label}</span>
                                        <span style={{ marginLeft: 'auto', fontSize: '10px' }}>
                                            {isSubmenuOpen ? "-" : "+"}
                                        </span>
                                    </>
                                )}
                            </button>
                            {isSubmenuOpen && (
                                <div>
                                    {item.children.map((subItem) => (
                                        <div className="nav-item" key={subItem.path}>
                                            <button
                                                type="button"
                                                className={`nav-link ${isActive(subItem.path) ? 'active' : ''}`}
                                                style={{ paddingLeft: isOpen ? '48px' : '24px' }}
                                                onClick={() => handleNavigate(subItem.path)}
                                            >
                                                {subItem?.icon && createElement(subItem.icon, { className: "sidebar-icon" })}
                                                {isOpen && <span>{subItem.label}</span>}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                }

                const Icon = item.icon;
                return (
                    <div className="nav-item" key={item.path}>
                        <button
                            type="button"
                            className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                            onClick={() => handleNavigate(item.path)}
                        >
                            {Icon && <Icon className="sidebar-icon" />}
                            {isOpen && <span>{item.label}</span>}
                        </button>
                    </div>
                );
            })}

            <div className="nav-item" style={{ marginTop: 'auto' }}>
                <button type="button" className="nav-link" onClick={toggleSidebar}>
                    <FaBars className="sidebar-icon" />
                    {isOpen && <span>{isMobile ? 'Cerrar menu' : 'Contraer'}</span>}
                    {!isOpen && !isMobile && <span>Expandir</span>}
                </button>
            </div>
        </div>
    );
};
