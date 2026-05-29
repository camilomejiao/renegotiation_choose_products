import { Tag } from "antd";

const formatCurrency = (value) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value || 0);

const renderStatusTag = (value, color) => (
  <Tag
    color={color}
    style={{
      borderRadius: 999,
      fontWeight: 700,
      paddingInline: 10,
    }}
  >
    {value}
  </Tag>
);

const alertCategoryColors = {
  Sobreprecio: "red",
  "Sin estudio": "orange",
  "Fuera de rango": "gold",
};

const managementTypeColors = {
  "Mesa técnica": "blue",
  "Ajuste de precios": "purple",
  Validación: "green",
};

const alertManagementColors = {
  Asignada: "processing",
  "En revisión": "warning",
  Cerrada: "success",
};

export const getAlertedProductsTableColumns = () => [
  {
    title: "Proveedor",
    dataIndex: "supplier",
    key: "supplier",
    width: 170,
  },
  {
    title: "ID producto",
    dataIndex: "productId",
    key: "productId",
    width: 120,
  },
  {
    title: "Nombre producto",
    dataIndex: "productName",
    key: "productName",
    width: 210,
  },
  {
    title: "Unidad de medida",
    dataIndex: "unitOfMeasure",
    key: "unitOfMeasure",
    width: 140,
  },
  {
    title: "Marca comercial",
    dataIndex: "commercialBrand",
    key: "commercialBrand",
    width: 140,
  },
  {
    title: "Precio mínimo",
    dataIndex: "minimumPrice",
    key: "minimumPrice",
    width: 130,
    render: (value) => formatCurrency(value),
  },
  {
    title: "Precio máximo",
    dataIndex: "maximumPrice",
    key: "maximumPrice",
    width: 130,
    render: (value) => formatCurrency(value),
  },
  {
    title: "Valor unitario de venta",
    dataIndex: "saleUnitValue",
    key: "saleUnitValue",
    width: 160,
    render: (value) => formatCurrency(value),
  },
  {
    title: "Valor catálogo de feria",
    dataIndex: "fairCatalogValue",
    key: "fairCatalogValue",
    width: 160,
    render: (value) => formatCurrency(value),
  },
  {
    title: "Categoría de alerta",
    dataIndex: "alertCategory",
    key: "alertCategory",
    width: 150,
    render: (value) => renderStatusTag(value, alertCategoryColors[value] || "default"),
  },
  {
    title: "Tipo de gestión",
    dataIndex: "managementType",
    key: "managementType",
    width: 150,
    render: (value) => renderStatusTag(value, managementTypeColors[value] || "default"),
  },
  {
    title: "Gestión de alerta",
    dataIndex: "alertManagement",
    key: "alertManagement",
    width: 150,
    render: (value) => renderStatusTag(value, alertManagementColors[value] || "default"),
  },
];
