import {
  createElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { BsCashStack, BsShieldCheck } from "react-icons/bs";
import {
  FaBars,
  FaBoxOpen,
  FaBroadcastTower,
  FaChartPie,
  FaDollyFlatbed,
  FaExclamationTriangle,
  FaFileInvoiceDollar,
  FaHandshake,
  FaHardHat,
  FaHouseUser,
  FaRegBuilding,
  FaShippingFast,
  FaShoppingCart,
  FaSignOutAlt,
  FaUser,
  FaUsersCog,
} from "react-icons/fa";
import { MdCampaign, MdPeople } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";

//Enum
import { RolesEnum } from "../../../../helpers/GlobalEnum";

const menuConfig = {
  [RolesEnum.ADMIN]: [
    { path: "/", icon: FaHouseUser, label: "Inicio" },
    {
      label: "Administración Catalogo de productos",
      icon: FaBoxOpen,
      children: [
        {
          path: "/admin/list-products-by-convocation",
          icon: FaDollyFlatbed,
          label: "Administración de Catálogo",
        },
        {
          path: "/admin/products-supervision",
          icon: FaBroadcastTower,
          label: "Catálogo de productos",
        },
      ],
    },
    {
      path: "/admin/search-user-for-renegociation",
      icon: FaHandshake,
      label: "Renegociación",
    },
    {
      path: "/admin/search-user",
      icon: FaUsersCog,
      label: "Gestión De Beneficiarios",
    },
    { path: "/admin/management", icon: MdPeople, label: "Gestión de Usuarios" },
    { path: "/admin/list-convocation", icon: MdCampaign, label: "Jornadas" },
    //{ path: "/admin/supplier-validation", icon: BsShieldCheck, label: "Validación de proveedores" },
    //{ path: "/admin/create-calls-suppliers", icon: MdCampaign, label: "Convocatorias" },
    { path: "/admin/logout", icon: FaSignOutAlt, label: "Salir" },
  ],
  [RolesEnum.SUPERVISION]: [
    { path: "/", icon: FaHouseUser, label: "Inicio" },
    {
      path: "/admin/products-supervision",
      icon: FaBoxOpen,
      label: "Catálogo de productos",
    },
    {
      path: "/admin/search-user-for-renegociation",
      icon: FaHandshake,
      label: "Renegociación",
    },
    {
      path: "/admin/search-user",
      icon: FaUsersCog,
      label: "Gestión De Beneficiarios",
    },
    { path: "/admin/payments", icon: BsCashStack, label: "Modulo De Pagos" },
    { path: "/admin/logout", icon: FaSignOutAlt, label: "Salir" },
  ],
  [RolesEnum.PAYMENTS]: [
    { path: "/", icon: FaHouseUser, label: "Inicio" },
    { path: "/admin/payments", icon: BsCashStack, label: "Modulo De Pagos" },
    { path: "/admin/logout", icon: FaSignOutAlt, label: "Salir" },
  ],
  [RolesEnum.TRUST_PAYMENTS]: [
    { path: "/", icon: FaHouseUser, label: "Inicio" },
    { path: "/admin/payments", icon: BsCashStack, label: "Modulo De Pagos" },
    { path: "/admin/logout", icon: FaSignOutAlt, label: "Salir" },
  ],
  [RolesEnum.ENVIRONMENTAL]: [
    {
      path: "/admin/products-enviromental",
      icon: FaBoxOpen,
      label: "Validación de Catálogo de productos",
    },
    {
      path: "/admin/search-user-for-renegociation",
      icon: FaHandshake,
      label: "Renegociación",
    },
    {
      path: "/admin/search-user",
      icon: FaUsersCog,
      label: "Gestión De Beneficiarios",
    },
    { path: "/admin/logout", icon: FaSignOutAlt, label: "Salir" },
  ],
  [RolesEnum.TECHNICAL]: [
    { path: "/", icon: FaHouseUser, label: "Inicio" },
    {
      path: "/admin/list-products-by-convocation",
      icon: FaBoxOpen,
      label: "Administración de Catálogo",
    },
    {
      path: "/admin/search-user",
      icon: FaUsersCog,
      label: "Gestión De Beneficiarios",
    },
    { path: "/admin/payments", icon: BsCashStack, label: "Pagos" },
    { path: "/admin/logout", icon: FaSignOutAlt, label: "Salir" },
  ],
  [RolesEnum.TERRITORIAL_LINKS]: [
    { path: "/", icon: FaHouseUser, label: "Inicio" },
    {
      path: "/admin/search-user-for-renegociation",
      icon: FaHandshake,
      label: "Renegociación",
    },
    {
      path: "/admin/search-user",
      icon: FaUsersCog,
      label: "Gestión De Beneficiarios",
    },
    { path: "/admin/payments", icon: BsCashStack, label: "Pagos" },
    { path: "/admin/logout", icon: FaSignOutAlt, label: "Salir" },
  ],
  [RolesEnum.SUPPLIER]: [
    { path: "/", icon: FaHouseUser, label: "Inicio" },
    {
      path: "/admin/product-price-quotes",
      icon: FaBoxOpen,
      label: "Cotización de catalogos",
    },
    {
      path: "/admin/search-user",
      icon: FaShoppingCart,
      label: "Carrito de compras",
    },
    {
      path: "/admin/order-report",
      icon: FaFileInvoiceDollar,
      label: "Ordenes de compra",
    },
    {
      label: "Entregas",
      icon: FaShippingFast,
      children: [
        {
          path: "/admin/search-user-for-deliveries",
          icon: FaDollyFlatbed,
          label: "Realizar Entregas",
        },
        {
          path: "/admin/correction-deliveries",
          icon: FaExclamationTriangle,
          label: "Subsanación de entregas",
        },
      ],
    },
    {
      path: "/admin/payments-suppliers",
      icon: BsCashStack,
      label: "Solicitud de pago",
    },
    {
      path: "/admin/company-reports",
      icon: FaChartPie,
      label: "Reportes general",
    },
    { path: "/admin/logout", icon: FaSignOutAlt, label: "Salir" },
  ],
  [RolesEnum.SYSTEM_USER]: [
    { path: "/", icon: FaHouseUser, label: "Inicio" },
    {
      path: "/admin/search-user-for-renegociation",
      icon: FaHandshake,
      label: "Renegociación",
    },
    {
      path: "/admin/search-user",
      icon: FaUsersCog,
      label: "Gestión De Beneficiarios",
    },
    {
      path: "/admin/products-supervision",
      icon: FaBoxOpen,
      label: "Catálogo de productos",
    },
    { path: "/admin/management", icon: MdPeople, label: "Gestión de Usuarios" },
    { path: "/admin/list-convocation", icon: MdCampaign, label: "Jornadas" },
    {
      path: "/admin/supplier-validation",
      icon: BsShieldCheck,
      label: "Validación de proveedores",
    },
    { path: "/admin/logout", icon: FaSignOutAlt, label: "Salir" },
  ],
};

export const Sidebar = ({ userAuth }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [openSubmenus, setOpenSubmenus] = useState({});

  const role = userAuth?.rol_id;
  const items = useMemo(() => menuConfig[role] || [], [role]);

  // Función para verificar si un item está activo
  const isItemActive = useCallback(
    (itemPath) => {
      if (itemPath === "/" && location.pathname === "/") {
        return true;
      }
      if (itemPath !== "/") {
        // Comparación exacta para evitar conflictos entre rutas similares
        return location.pathname === itemPath;
      }
      return false;
    },
    [location.pathname]
  );

  // Función para verificar si un submenu contiene el item activo
  const isSubmenuActive = useCallback(
    (children) => {
      return children.some((child) => isItemActive(child.path));
    },
    [isItemActive]
  );

  // Abrir automáticamente submenús que contienen el item activo
  useEffect(() => {
    const newOpenSubmenus = {};
    items.forEach((item) => {
      if (item.children && Array.isArray(item.children)) {
        if (isSubmenuActive(item.children)) {
          newOpenSubmenus[item.label] = true;
        }
      }
    });
    setOpenSubmenus((prev) => ({ ...prev, ...newOpenSubmenus }));
  }, [location.pathname, items, isSubmenuActive]);

  const toggleSidebar = () => {
    setIsOpen((prev) => {
      const newIsOpen = !prev;
      // Agregar/remover clase del layout
      const layoutElement = document.querySelector(".app-layout");
      if (layoutElement) {
        if (newIsOpen) {
          layoutElement.classList.remove("sidebar-collapsed");
        } else {
          layoutElement.classList.add("sidebar-collapsed");
        }
      }
      return newIsOpen;
    });
  };

  const toggleSubmenu = (label) => {
    setOpenSubmenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const handleNavigate = (path) => {
    navigate(path);

    if (typeof window !== "undefined" && window.innerWidth < 992) {
      setIsOpen(false);
    }
  };

  const title =
    role === RolesEnum.SUPPLIER
      ? "Proveedor"
      : role === RolesEnum.TERRITORIAL_LINKS
      ? "Tecnico Territorio"
      : "Perfil";
  const titleIcon =
    role === RolesEnum.SUPPLIER
      ? FaRegBuilding
      : role === RolesEnum.TERRITORIAL_LINKS
      ? FaHardHat
      : FaUser;

  return (
    <aside className={`app-sidebar ${isOpen ? "is-open" : ""}`}>
      <div className="app-sidebar__content">
        {items.length > 0 && (
          <>
            <div className="app-sidebar__section-title">
              {titleIcon && createElement(titleIcon, { size: 18 })}
              {isOpen && <span>{title}</span>}
            </div>

            <nav className="app-sidebar__nav">
              {items.map((item) => {
                if (item.children && Array.isArray(item.children)) {
                  const isSubmenuOpen = openSubmenus[item.label];
                  const hasActiveChild = isSubmenuActive(item.children);

                  return (
                    <div
                      key={item.label}
                      className={`app-sidebar__item has-children ${
                        isSubmenuOpen ? "is-expanded" : ""
                      } ${hasActiveChild ? "is-active" : ""}`}
                    >
                      <button
                        type="button"
                        className="app-sidebar__item-main"
                        onClick={() => toggleSubmenu(item.label)}
                      >
                        {createElement(item.icon)}
                        {isOpen && (
                          <span className="app-sidebar__label">
                            {item.label}
                          </span>
                        )}
                        {isOpen && (
                          <span className="app-sidebar__chevron">
                            {isSubmenuOpen ? "▲" : "▼"}
                          </span>
                        )}
                      </button>

                      {isSubmenuOpen && (
                        <div className="app-sidebar__submenu">
                          {item.children.map((subItem) => (
                            <div
                              className={`app-sidebar__item ${
                                isItemActive(subItem.path) ? "is-active" : ""
                              }`}
                              key={subItem.path}
                              onClick={() => handleNavigate(subItem.path)}
                            >
                              {subItem?.icon && createElement(subItem.icon)}
                              {isOpen && (
                                <span className="app-sidebar__label">
                                  {subItem.label}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                const Icon = item.icon;
                return (
                  <div
                    className={`app-sidebar__item ${
                      isItemActive(item.path) ? "is-active" : ""
                    }`}
                    key={item.path}
                    onClick={() => handleNavigate(item.path)}
                  >
                    {Icon && createElement(Icon)}
                    {isOpen && (
                      <span className="app-sidebar__label">{item.label}</span>
                    )}
                  </div>
                );
              })}
            </nav>
          </>
        )}
      </div>

      <div className="app-sidebar__toggle" onClick={toggleSidebar}>
        <FaBars />
      </div>
    </aside>
  );
};
