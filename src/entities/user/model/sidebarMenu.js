import { RolesEnum } from "../../../helpers/GlobalEnum";

export const getSidebarMenu = (role, id) => {
  const config = {
    [RolesEnum.ADMIN]: [
      { path: "/", iconKey: "home", label: "Inicio" },
      {
        label: "Administración Catálogo de productos",
        iconKey: "boxes",
        children: [
          { path: "/admin/list-products-by-convocation", iconKey: "tools", label: "Administración de Catálogo Técnica" },
          { path: "/admin/products-enviromental", iconKey: "leaf", label: "Validación Ambiental" },
          { path: "/admin/products-supervision", iconKey: "userCheck", label: "Validación de Supervisión" },
        ],
      },
      { path: "/admin/search-user-for-renegociation", iconKey: "handshake", label: "Renegociación" },
      { path: "/admin/search-user", iconKey: "addressBook", label: "Gestión integral del beneficiario" },
      { path: "/admin/search-beneficiary-information", iconKey: "searchPlus", label: "Consultar Titular" },
      { path: "/admin/management", iconKey: "userCog", label: "Control de Usuarios/Proveedores" },
      { path: "/admin/list-convocation", iconKey: "campaign", label: "Jornadas" },
      { path: "/admin/delivery-information-and-tracking", iconKey: "route", label: "Seguimiento de entregas" },
      { path: "/admin/fiduciary/search-sp", iconKey: "searchDollar", label: "Consulta de Solicitudes de Pago" },
      { path: "/admin/payments-suppliers/create-collection-account", iconKey: "bank", label: "Solicitud de pago" },
    ],
    [RolesEnum.SUPERVISION]: [
      { path: "/admin/products-supervision", iconKey: "userCheck", label: "Catálogo de productos" },
      { path: "/admin/search-user-for-renegociation", iconKey: "handshake", label: "Renegociación" },
      { path: "/admin/search-user", iconKey: "addressBook", label: "Gestión integral del beneficiario" },
      { path: "/admin/search-beneficiary-information", iconKey: "searchPlus", label: "Consultar Titular" },
      { path: "/admin/payments", iconKey: "cashStack", label: "Módulo de pagos" },
      { path: "/admin/delivery-information-and-tracking", iconKey: "route", label: "Seguimiento de entregas" },
      { path: "/admin/fiduciary/search-sp", iconKey: "searchDollar", label: "Consulta de Solicitudes de Pago" },
    ],
    [RolesEnum.PAYMENTS]: [
      { path: "/admin/search-user", iconKey: "addressBook", label: "Gestión integral del beneficiario" },
      { path: "/admin/search-beneficiary-information", iconKey: "searchPlus", label: "Consultar Titular" },
      { path: "/admin/payments-suppliers/create-collection-account", iconKey: "bank", label: "Solicitud de pago" },
      { path: "/admin/payments", iconKey: "cashStack", label: "Módulo de pagos" },
    ],
    [RolesEnum.TRUST_PAYMENTS]: [
      { path: "/admin/search-beneficiary-information", iconKey: "searchPlus", label: "Consultar Titular" },
      { path: "/admin/delivery-information-and-tracking", iconKey: "route", label: "Seguimiento de entregas" },
      { path: "/admin/payments-suppliers/create-collection-account", iconKey: "bank", label: "Solicitud de pago" },
      { path: "/admin/payments", iconKey: "cashStack", label: "Módulo de pagos" },
      { path: "/admin/fiduciary/search-sp", iconKey: "searchDollar", label: "Consulta de Solicitudes de Pago" },
    ],
    [RolesEnum.ENVIRONMENTAL]: [
      { path: "/admin/search-beneficiary-information", iconKey: "searchPlus", label: "Consultar Titular" },
      { path: "/admin/products-enviromental", iconKey: "leaf", label: "Validación de catálogo de productos" },
      { path: "/admin/search-user-for-renegociation", iconKey: "handshake", label: "Renegociación" },
      { path: "/admin/search-user", iconKey: "addressBook", label: "Gestión integral del beneficiario" },
    ],
    [RolesEnum.TECHNICAL]: [
      { path: "/admin/list-products-by-convocation", iconKey: "tools", label: "Administración de catálogo" },
      { path: "/admin/search-beneficiary-information", iconKey: "searchPlus", label: "Consultar Titular" },
      { path: "/admin/search-user", iconKey: "addressBook", label: "Gestión integral del beneficiario" },
      { path: "/admin/delivery-information-and-tracking", iconKey: "route", label: "Seguimiento de entregas" },
    ],
    [RolesEnum.TERRITORIAL_LINKS]: [
      { path: "/", iconKey: "home", label: "Inicio" },
      { path: "/admin/search-user-for-renegociation", iconKey: "handshake", label: "Renegociación" },
      { path: "/admin/search-user", iconKey: "addressBook", label: "Gestión integral del beneficiario" },
      { path: "/admin/delivery-information-and-tracking", iconKey: "route", label: "Seguimiento de entregas" },
    ],
    [RolesEnum.SUPPLIER]: [
      { path: `/admin/edit-suppliers/${id}`, iconKey: "bank", label: "Gestión del proveedor" },
      { path: "/admin/product-price-quotes", iconKey: "boxOpen", label: "Cotización de catálogos" },
      { path: "/admin/search-user", iconKey: "shoppingCart", label: "Carrito de compras" },
      { path: "/admin/order-report", iconKey: "fileInvoice", label: "Órdenes de compra" },
      { path: "/admin/search-user-for-deliveries", iconKey: "shipping", label: "Entregas" },
      { path: "/admin/delivery-information-and-tracking", iconKey: "route", label: "Seguimiento de entregas" },
      { path: "/admin/payments-suppliers", iconKey: "cashStack", label: "Cuentas de cobro" },
      { path: "/admin/company-reports", iconKey: "chartPie", label: "Reportes generales" },
    ],
    [RolesEnum.SYSTEM_USER]: [
      { path: "/", iconKey: "home", label: "Inicio" },
      { path: "/admin/list-convocation", iconKey: "campaign", label: "Jornadas" },
      { path: "/admin/management", iconKey: "people", label: "Control de Usuarios/Proveedores" },
      { path: "/admin/search-beneficiary-information", iconKey: "searchPlus", label: "Consultar Titular" },
      { path: "/admin/search-user-for-renegociation", iconKey: "handshake", label: "Renegociación" },
      { path: "/admin/search-user", iconKey: "addressBook", label: "Gestión de beneficiarios" },
      { path: "/admin/delivery-information-and-tracking", iconKey: "route", label: "Seguimiento de entregas" },
      { path: "/admin/fiduciary/search-sp", iconKey: "searchDollar", label: "Consulta de Solicitudes de Pago" },
      {
        label: "Administración Catálogo de productos",
        iconKey: "boxes",
        children: [
          { path: "/admin/list-products-by-convocation", iconKey: "tools", label: "Administración de Catálogo Técnica" },
          { path: "/admin/products-enviromental", iconKey: "leaf", label: "Validación Ambiental" },
          { path: "/admin/products-supervision", iconKey: "userCheck", label: "Validación de Supervisión" },
        ],
      },
    ],
    [RolesEnum.LEGAL]: [
      { path: "/admin/management", iconKey: "people", label: "Gestión integral del beneficiario" },
      { path: "/admin/search-beneficiary-information", iconKey: "searchPlus", label: "Consultar Titular" },
    ],
  };

  return config[role] || [];
};

export const getRoleIconKey = (role) => {
  if (role === RolesEnum.SUPPLIER) return "building";
  if (role === RolesEnum.TERRITORIAL_LINKS) return "hardHat";
  return "user";
};
