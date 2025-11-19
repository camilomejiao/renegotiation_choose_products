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
    { path: "/admin/logout", icon: FaSignOutAlt, label: "Salir" },
  ],
};

export const Sidebar = ({ userAuth, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  
  // Usar localStorage para persistir el estado
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    if (saved) {
      return JSON.parse(saved);
    }
    // Por defecto: expandido en desktop/tablet, contraído en móvil
    return window.innerWidth >= 576;
  });

  const [expandedItems, setExpandedItems] = useState(new Set());

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 576;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Comunicar estado al componente padre solo cuando cambie isOpen
  useEffect(() => {
    if (onToggle && !isMobile) {
      onToggle(isOpen);
    }
  }, [isOpen, onToggle]);

  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    localStorage.setItem('sidebarOpen', JSON.stringify(newState));
  };

  const toggleExpanded = useCallback((label) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(label)) {
        newSet.delete(label);
      } else {
        newSet.add(label);
      }
      return newSet;
    });
  }, []);

  const roleId = userAuth?.rol_id;
  const roleName = userAuth?.rol_name;
  const userName = userAuth?.user_name;
  const items = menuConfig[roleId] || [];
  const titleIcon = roleId === RolesEnum.SUPPLIER ? FaRegBuilding : roleId === RolesEnum.TERRITORIAL_LINKS ? FaHardHat : FaUser;

  // Función para verificar si un item está activo
  const isItemActive = (itemPath) => {
    if (itemPath === '/' && location.pathname === '/admin') return true;
    if (itemPath === '/' && location.pathname === '/') return true;
    return location.pathname.includes(itemPath) && itemPath !== '/';
  };

  const renderMenuItem = (item, isChild = false) => {
    if (item.children) {
      const isExpanded = expandedItems.has(item.label);
      const hasActiveChild = item.children.some(child => isItemActive(child.path));
      
      return (
        <div key={item.label}>
          <div
            onClick={() => toggleExpanded(item.label)}
            style={{
              color: hasActiveChild ? '#ffffff' : 'rgba(255, 255, 255, 0.9)',
              padding: isOpen || isMobile ? '18px 24px' : '18px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: isOpen || isMobile ? 'space-between' : 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontWeight: hasActiveChild ? 600 : 500,
              fontSize: '15px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
              backgroundColor: hasActiveChild ? 'rgba(59, 130, 246, 0.3)' : 'transparent',
              borderRight: hasActiveChild ? '4px solid #3b82f6' : '4px solid transparent',
            }}
            onMouseEnter={(e) => {
              if (!hasActiveChild) {
                e.target.style.backgroundColor = 'rgba(59, 130, 246, 0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (!hasActiveChild) {
                e.target.style.backgroundColor = 'transparent';
              }
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {createElement(item.icon, { 
                style: { 
                  fontSize: '20px', 
                  minWidth: '20px',
                  color: hasActiveChild ? '#60a5fa' : 'rgba(255, 255, 255, 0.9)'
                }
              })}
              {(isOpen || isMobile) && (
                <span>{item.label}</span>
              )}
            </div>
            {(isOpen || isMobile) && (
              <span style={{ 
                transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }}>
                ▶
              </span>
            )}
          </div>
          
          {isExpanded && (isOpen || isMobile) && (
            <div>
              {item.children.map(child => renderMenuItem(child, true))}
            </div>
          )}
        </div>
      );
    }

    const isActive = isItemActive(item.path);
    
    return (
      <div key={item.path}>
        <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigate(item.path);
            if (isMobile) {
              setIsOpen(false);
            }
          }}
          style={{
            color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.9)',
            padding: isChild 
              ? (isOpen || isMobile ? '12px 24px 12px 48px' : '12px 12px')
              : (isOpen || isMobile ? '18px 24px' : '18px 12px'),
            display: 'flex',
            alignItems: 'center',
            justifyContent: isOpen || isMobile ? 'flex-start' : 'center',
            gap: '16px',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
            fontWeight: isActive ? 600 : 500,
            fontSize: isChild ? '14px' : '15px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            backgroundColor: isActive ? 'rgba(59, 130, 246, 0.3)' : 'transparent',
            borderRight: isActive ? '4px solid #3b82f6' : '4px solid transparent',
            boxShadow: isActive ? 'inset 0 0 20px rgba(59, 130, 246, 0.1)' : 'none'
          }}
          onMouseEnter={(e) => {
            if (!isActive) {
              e.target.style.backgroundColor = 'rgba(59, 130, 246, 0.15)';
              if (isOpen && !isMobile && !isChild) {
                e.target.style.paddingLeft = '28px';
              }
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive) {
              e.target.style.backgroundColor = 'transparent';
              if (isOpen && !isMobile && !isChild) {
                e.target.style.paddingLeft = '24px';
              }
            }
          }}
        >
          {createElement(item.icon, { 
            style: { 
              fontSize: isChild ? '16px' : '20px', 
              minWidth: isChild ? '16px' : '20px',
              color: isActive ? '#60a5fa' : 'rgba(255, 255, 255, 0.9)'
            }
          })}
          {(isOpen || isMobile) && (
            <span style={{ 
              position: 'relative',
              fontWeight: isActive ? 600 : 500
            }}>
              {item.label}
            </span>
          )}
        </a>
      </div>
    );
  };

  return (
    <>
      {/* Botón hamburguesa en el header para móviles */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          style={{
            position: 'fixed',
            top: '20px',
            left: '20px',
            zIndex: 1002,
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            padding: '12px',
            backdropFilter: 'blur(10px)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <FaBars style={{ fontSize: '18px' }} />
        </button>
      )}

      {/* Overlay para móviles */}
      {isMobile && isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
            backdropFilter: 'blur(4px)'
          }}
        />
      )}

      {/* Sidebar */}
      <div style={{
        width: isMobile ? '280px' : (isOpen ? '280px' : '70px'),
        position: 'fixed',
        top: isMobile ? '0' : '80px',
        left: 0,
        height: isMobile ? '100vh' : 'calc(100vh - 80px)',
        background: 'linear-gradient(180deg, #334155 0%, #1e293b 100%)',
        color: 'white',
        transition: 'transform 0.3s ease, width 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        zIndex: isMobile ? 1000 : 100,
        transform: isMobile && !isOpen ? 'translateX(-100%)' : 'translateX(0)',
        boxShadow: isMobile ? '4px 0 20px rgba(0, 0, 0, 0.3)' : 'none'
      }}>
        {/* Header del sidebar */}
        <div style={{
          padding: '20px 16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          minHeight: isMobile ? '100px' : '80px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          paddingTop: isMobile ? '80px' : '20px'
        }}>
          {titleIcon && createElement(titleIcon, { 
            style: { fontSize: '24px', color: 'white', minWidth: '24px' }
          })}
          {(isOpen || isMobile) && (
            <div style={{ color: 'white' }}>
              <div style={{ fontWeight: 600, fontSize: '16px' }}>{roleName}</div>
              <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>{userName}</div>
            </div>
          )}
          
          {/* Botón cerrar en móvil */}
          {isMobile && (
            <button
              onClick={() => setIsOpen(false)}
              style={{
                marginLeft: 'auto',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                padding: '8px',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Navegación */}
        <nav style={{ flex: 1, overflowY: 'auto' }}>
          {items.map(item => renderMenuItem(item))}
        </nav>

        {/* Toggle button solo para desktop */}
        {!isMobile && (
          <div style={{
            padding: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <button 
              onClick={toggleSidebar}
              style={{
                background: 'rgba(59, 130, 246, 0.2)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '8px',
                color: 'white',
                padding: '10px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <FaBars style={{ fontSize: '16px' }} />
              {isOpen && <span style={{ fontSize: '12px' }}>Contraer</span>}
            </button>
          </div>
        )}
      </div>
    </>
  );
};
