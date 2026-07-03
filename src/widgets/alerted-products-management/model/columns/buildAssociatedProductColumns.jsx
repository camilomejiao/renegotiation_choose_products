import { wrapTitle } from "../../../../shared/ui/lib/wrapTitle";
import { renderCategoryPill } from "../getAlertedProductsManagementColumns";

const formatCurrency = (value) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value || 0);

// "Producto alertado asociado a la solicitud": vista de solo lectura del insumo
// que originó la alerta indeterminada. Los precios los completa Sub. Operativa.
export const buildAssociatedProductColumns = () => [
  {
    title: wrapTitle("Categoría", "alerta"),
    dataIndex: "alertCategory",
    key: "alertCategory",
    width: 200,
    align: "center",
    render: (value, record) => renderCategoryPill(value, record?.alertCategoryCode),
  },
  {
    title: "Proveedor",
    dataIndex: "supplier",
    key: "supplier",
    width: 160,
    align: "center",
    render: (v) => v || "—",
  },
  {
    title: wrapTitle("ID", "producto"),
    dataIndex: "productId",
    key: "productId",
    width: 110,
    align: "center",
    render: (v) => v || "—",
  },
  {
    title: wrapTitle("Nombre", "producto"),
    dataIndex: "productName",
    key: "productName",
    width: 200,
    align: "center",
    render: (v) => v || "—",
  },
  {
    title: wrapTitle("Especificación", "técnica"),
    dataIndex: "technicalSpecification",
    key: "technicalSpecification",
    width: 220,
    align: "center",
    render: (v) => v || "—",
  },
  {
    title: "Unidad",
    dataIndex: "unitOfMeasure",
    key: "unitOfMeasure",
    width: 110,
    align: "center",
    render: (v) => v || "—",
  },
  {
    title: "Marca",
    dataIndex: "commercialBrand",
    key: "commercialBrand",
    width: 120,
    align: "center",
    render: (v) => v || "—",
  },
  {
    title: wrapTitle("Precio", "mínimo"),
    dataIndex: "minimumPrice",
    key: "minimumPrice",
    width: 120,
    align: "right",
    render: formatCurrency,
  },
  {
    title: wrapTitle("Precio", "máximo"),
    dataIndex: "maximumPrice",
    key: "maximumPrice",
    width: 120,
    align: "right",
    render: formatCurrency,
  },
  {
    title: wrapTitle("Valor", "venta"),
    dataIndex: "saleUnitValue",
    key: "saleUnitValue",
    width: 120,
    align: "right",
    render: formatCurrency,
  },
  {
    title: wrapTitle("Valor catálogo", "feria"),
    dataIndex: "fairCatalogValue",
    key: "fairCatalogValue",
    width: 150,
    align: "right",
    render: formatCurrency,
  },
];