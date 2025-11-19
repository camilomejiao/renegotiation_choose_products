import PropTypes from "prop-types";
import { FaChevronRight, FaHome } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const routeNames = {
  "/admin": "Inicio",
  "/admin/search-user": "Gestión De Beneficiarios",
  "/admin/search-user-for-deliveries": "Realizar Entregas",
  "/admin/search-user-for-renegociation": "Renegociación",
  "/admin/payments-suppliers": "Proceso de Pago",
  "/admin/payments": "Modulo De Pagos",
  "/admin/products": "Kits",
  "/admin/users": "Usuarios",
  "/admin/management": "Gestión de Usuarios",
  "/admin/list-convocation": "Jornadas",
  "/admin/company-reports": "Reportes General",
  "/admin/order-report": "Ordenes de Compra",
  "/admin/product-price-quotes": "Cotización de Catalogos",
  "/admin/correction-deliveries": "Subsanación de Entregas",
  "/admin/products-supervision": "Catálogo de Productos",
  "/admin/list-products-by-convocation": "Administración de Catálogo",
  "/admin/products-enviromental": "Validación de Catálogo",
  "/admin/payments-suppliers/create-collection-account":
    "Crear Cuenta de Cobro",
};

export const Breadcrumb = ({ customItems = [] }) => {
  const location = useLocation();

  // Si hay items personalizados, usarlos
  if (customItems.length > 0) {
    return (
      <nav className="page-breadcrumb">
        <ol
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            margin: 0,
            padding: 0,
            listStyle: "none",
            fontSize: "14px",
          }}
        >
          <li>
            <Link
              to="/admin"
              style={{
                color: "var(--primary-color)",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "4px 8px",
                borderRadius: "var(--border-radius-sm)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "var(--gray-100)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
              }}
            >
              <FaHome size={12} />
              Inicio
            </Link>
          </li>
          {customItems.map((item, index) => (
            <li
              key={index}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <FaChevronRight size={10} style={{ color: "var(--gray-400)" }} />
              {item.href ? (
                <Link
                  to={item.href}
                  style={{
                    color: "var(--primary-color)",
                    textDecoration: "none",
                    padding: "4px 8px",
                    borderRadius: "var(--border-radius-sm)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "var(--gray-100)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent";
                  }}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  style={{
                    color: "var(--gray-600)",
                    fontWeight: 500,
                    padding: "4px 8px",
                  }}
                >
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    );
  }

  // Generar breadcrumb automático basado en la ruta
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav className="page-breadcrumb">
      <ol
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          margin: 0,
          padding: 0,
          listStyle: "none",
          fontSize: "14px",
        }}
      >
        <li>
          <Link
            to="/admin"
            style={{
              color: "var(--primary-color)",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "4px 8px",
              borderRadius: "var(--border-radius-sm)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "var(--gray-100)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
            }}
          >
            <FaHome size={12} />
            Inicio
          </Link>
        </li>

        {pathnames.map((pathname, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          const routeName =
            routeNames[routeTo] ||
            pathname.charAt(0).toUpperCase() + pathname.slice(1);

          return (
            <li
              key={routeTo}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <FaChevronRight size={10} style={{ color: "var(--gray-400)" }} />
              {isLast ? (
                <span
                  style={{
                    color: "var(--gray-600)",
                    fontWeight: 500,
                    padding: "4px 8px",
                  }}
                >
                  {routeName}
                </span>
              ) : (
                <Link
                  to={routeTo}
                  style={{
                    color: "var(--primary-color)",
                    textDecoration: "none",
                    padding: "4px 8px",
                    borderRadius: "var(--border-radius-sm)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "var(--gray-100)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent";
                  }}
                >
                  {routeName}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

Breadcrumb.propTypes = {
  customItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string,
    })
  ),
};
