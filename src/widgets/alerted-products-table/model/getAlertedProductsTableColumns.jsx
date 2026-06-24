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
  0: "neutral",
  1: "blue",
  2: "cyan",
  3: "amber",
  4: "violet",
  5: "green",
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

const wrapCell = {
  onCell: () => ({
    style: { whiteSpace: "normal", wordBreak: "break-word", verticalAlign: "top" },
  }),
};

const renderText = (value) => value || "---";

export const getAlertedProductsTableColumns = () => [
  {
    title: "Jornada",
    dataIndex: "jornada",
    key: "jornada",
    width: 130,
    align: "center",
    render: renderText,
    ...wrapCell,
  },
  {
    title: wrapColumnTitle("Documento", "Titular"),
    dataIndex: "documentoTitular",
    key: "documentoTitular",
    width: 120,
    align: "center",
    render: renderText,
    ...wrapCell,
  },
  {
    title: "CUB",
    dataIndex: "cub",
    key: "cub",
    width: 110,
    align: "center",
    render: renderText,
    ...wrapCell,
  },
  {
    title: wrapColumnTitle("N° de", "Orden"),
    dataIndex: "ordenNumero",
    key: "ordenNumero",
    width: 110,
    align: "center",
    render: renderText,
    ...wrapCell,
  },
  {
    title: "Proveedor",
    dataIndex: "supplier",
    key: "supplier",
    width: 180,
    align: "center",
    ...wrapCell,
  },
  {
    title: wrapColumnTitle("ID", "Producto"),
    dataIndex: "productId",
    key: "productId",
    width: 90,
    align: "center",
  },
  {
    title: wrapColumnTitle("Nombre", "Producto"),
    dataIndex: "productName",
    key: "productName",
    width: 200,
    align: "center",
    ...wrapCell,
  },
  {
    title: "Unidad",
    dataIndex: "unitOfMeasure",
    key: "unitOfMeasure",
    width: 90,
    align: "center",
    ...wrapCell,
  },
  {
    title: "Marca",
    dataIndex: "commercialBrand",
    key: "commercialBrand",
    width: 110,
    align: "center",
    ...wrapCell,
  },
  {
    title: wrapColumnTitle("Precio", "mín."),
    dataIndex: "minimumPrice",
    key: "minimumPrice",
    width: 110,
    align: "right",
    render: (value) => formatCurrency(value),
  },
  {
    title: wrapColumnTitle("Precio", "máx."),
    dataIndex: "maximumPrice",
    key: "maximumPrice",
    width: 110,
    align: "right",
    render: (value) => formatCurrency(value),
  },
  {
    title: wrapColumnTitle("Valor unitario", "venta"),
    dataIndex: "saleUnitValue",
    key: "saleUnitValue",
    width: 125,
    align: "right",
    render: (value) => formatCurrency(value),
  },
  {
    title: wrapColumnTitle("Valor catálogo", "jornada"),
    dataIndex: "fairCatalogValue",
    key: "fairCatalogValue",
    width: 130,
    align: "right",
    render: (value) => formatCurrency(value),
  },
  {
    title: wrapColumnTitle("Categoría", "alerta"),
    dataIndex: "alertCategory",
    key: "alertCategory",
    width: 160,
    align: "center",
    render: (value, record) =>
      renderCatalogPill(value, record?.alertCategoryCode, ALERT_CATEGORY_PILLS),
  },
  {
    title: wrapColumnTitle("Tipo", "gestión"),
    dataIndex: "managementType",
    key: "managementType",
    width: 160,
    align: "center",
    render: (value, record) =>
      renderCatalogPill(value, record?.managementTypeCode, MANAGEMENT_TYPE_PILLS),
  },
  {
    title: wrapColumnTitle("Estado", "Gestión"),
    dataIndex: "alertManagement",
    key: "alertManagement",
    width: 160,
    align: "center",
    render: (value, record) =>
      renderCatalogPill(value, record?.alertManagementCode, ALERT_MANAGEMENT_PILLS),
  },
];