import { StatusPill } from "../../../shared/ui/status-pill";

const wrapColumnTitle = (...lines) => (
  <span
    style={{
      display: "inline-block",
      width: "100%",
      whiteSpace: "normal",
      lineHeight: 1.15,
      textAlign: "center",
    }}
  >
    {lines.map((line, index) => (
      <span key={`${line}-${index}`} style={{ display: "block" }}>
        {line}
      </span>
    ))}
  </span>
);

const formatCurrency = (value) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value || 0);

const PILL_TOKENS = {
  neutral: {
    background: "#F3F4F6",
    border: "#D1D5DB",
    color: "#374151",
  },
  blue: {
    background: "#E0F2FE",
    border: "#7DD3FC",
    color: "#075985",
  },
  cyan: {
    background: "#DDFBFB",
    border: "#6EE7E7",
    color: "#155E75",
  },
  green: {
    background: "#DCFCE7",
    border: "#86EFAC",
    color: "#166534",
  },
  amber: {
    background: "#FEF3C7",
    border: "#FCD34D",
    color: "#92400E",
  },
  orange: {
    background: "#FFEDD5",
    border: "#FDBA74",
    color: "#9A3412",
  },
  red: {
    background: "#FEE2E2",
    border: "#FCA5A5",
    color: "#991B1B",
  },
  violet: {
    background: "#EDE9FE",
    border: "#C4B5FD",
    color: "#5B21B6",
  },
};

const ALERT_CATEGORY_PILLS = {
  5254: "neutral",
  5255: "amber",
  5256: "red",
  5257: "blue",
  5258: "orange",
};

const MANAGEMENT_TYPE_PILLS = {
  0: "neutral",   // Sin gestión
  1: "blue",      // Revisión
  2: "cyan",      // Justificación técnica
  3: "amber",     // Subsanación
  4: "violet",    // Acta complementaria
  5: "green",     // Ajuste de precio
};

const ALERT_MANAGEMENT_PILLS = {
  sin_gestion:    "neutral",
  en_proceso:     "blue",
  en_subsanacion: "amber",
  resuelta:       "green",
};

const renderPill = (label, tone = "neutral") => {
  const tokens = PILL_TOKENS[tone] || PILL_TOKENS.neutral;

  return (
    <StatusPill
      backgroundColor={tokens.background}
      borderColor={tokens.border}
      textColor={tokens.color}
      minHeight="28px"
      padding="4px 12px"
      fontSize="12px"
      fontWeight={800}
      uppercase
    >
      {label || "NO DEFINIDO"}
    </StatusPill>
  );
};

const renderCatalogPill = (label, code, tonesByCode) =>
  renderPill(label, tonesByCode[code] || "neutral");

export const getAlertedProductsTableColumns = () => [
  {
    title: "Proveedor",
    dataIndex: "supplier",
    key: "supplier",
    width: 150,
    align: "center",
  },
  {
    title: wrapColumnTitle("ID", "producto"),
    dataIndex: "productId",
    key: "productId",
    width: 100,
    align: "center",
  },
  {
    title: wrapColumnTitle("Nombre", "producto"),
    dataIndex: "productName",
    key: "productName",
    width: 180,
    align: "center",
  },
  {
    title: wrapColumnTitle("Unidad de", "medida"),
    dataIndex: "unitOfMeasure",
    key: "unitOfMeasure",
    width: 120,
    align: "center",
  },
  {
    title: wrapColumnTitle("Marca", "comercial"),
    dataIndex: "commercialBrand",
    key: "commercialBrand",
    width: 120,
    align: "center",
  },
  {
    title: wrapColumnTitle("Precio", "minimo"),
    dataIndex: "minimumPrice",
    key: "minimumPrice",
    width: 118,
    align: "right",
    render: (value) => formatCurrency(value),
  },
  {
    title: wrapColumnTitle("Precio", "maximo"),
    dataIndex: "maximumPrice",
    key: "maximumPrice",
    width: 118,
    align: "right",
    render: (value) => formatCurrency(value),
  },
  {
    title: wrapColumnTitle("Valor unitario", "de venta"),
    dataIndex: "saleUnitValue",
    key: "saleUnitValue",
    width: 132,
    align: "right",
    render: (value) => formatCurrency(value),
  },
  {
    title: wrapColumnTitle("Valor catalogo", "de feria"),
    dataIndex: "fairCatalogValue",
    key: "fairCatalogValue",
    width: 132,
    align: "right",
    render: (value) => formatCurrency(value),
  },
  {
    title: wrapColumnTitle("Categoria", "de alerta"),
    dataIndex: "alertCategory",
    key: "alertCategory",
    width: 240,
    align: "center",
    render: (value, record) =>
      renderCatalogPill(value, record?.alertCategoryCode, ALERT_CATEGORY_PILLS),
  },
  {
    title: wrapColumnTitle("Tipo de", "gestion"),
    dataIndex: "managementType",
    key: "managementType",
    width: 188,
    align: "center",
    render: (value, record) =>
      renderCatalogPill(value, record?.managementTypeCode, MANAGEMENT_TYPE_PILLS),
  },
  {
    title: wrapColumnTitle("Gestion de", "alerta"),
    dataIndex: "alertManagement",
    key: "alertManagement",
    width: 168,
    align: "center",
    render: (value, record) =>
      renderCatalogPill(value, record?.alertManagementCode, ALERT_MANAGEMENT_PILLS),
  },
];
