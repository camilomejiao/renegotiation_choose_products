import { DeleteOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import styled from "@emotion/styled";

import { StatusPill } from "../../../shared/ui/status-pill";

const wrapTitle = (...lines) => (
  <span style={{ display: "inline-block", width: "100%", whiteSpace: "normal", lineHeight: 1.15, textAlign: "center" }}>
    {lines.map((line, i) => <span key={i} style={{ display: "block" }}>{line}</span>)}
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
  neutral: { background: "#F3F4F6", border: "#D1D5DB", color: "#374151" },
  blue:    { background: "#E0F2FE", border: "#7DD3FC", color: "#075985" },
  amber:   { background: "#FEF3C7", border: "#FCD34D", color: "#92400E" },
  orange:  { background: "#FFEDD5", border: "#FDBA74", color: "#9A3412" },
  red:     { background: "#FEE2E2", border: "#FCA5A5", color: "#991B1B" },
};

const ALERT_CATEGORY_PILLS = {
  5254: "neutral",
  5255: "amber",
  5256: "red",
  5257: "blue",
  5258: "orange",
};

export const renderCategoryPill = (label, code) => {
  const tone = ALERT_CATEGORY_PILLS[code] || "neutral";
  const tokens = PILL_TOKENS[tone];
  return (
    <StatusPill
      backgroundColor={tokens.background}
      borderColor={tokens.border}
      textColor={tokens.color}
      minHeight="28px"
      padding="4px 10px"
      fontSize="12px"
      fontWeight={800}
      uppercase
    >
      {label || "NO DEFINIDO"}
    </StatusPill>
  );
};

const RemoveButton = styled(Button)`
  && {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 8px;
    padding: 0;
    color: #dc2626;
    background: #fef2f2;
    border: 1px solid #fecaca;
  }
  &&:hover, &&:focus {
    background: #fee2e2 !important;
    border-color: #fca5a5 !important;
    color: #b91c1c !important;
  }
`;

export const getAlertedProductsManagementColumns = ({
  onRemove,
  priceColumn,
  homologationColumn,
} = {}) => [
  {
    title: wrapTitle("Categoría", "alerta"),
    dataIndex: "alertCategory",
    key: "alertCategory",
    width: 200,
    align: "center",
    render: (value, record) => renderCategoryPill(value, record?.alertCategoryCode),
  },
  {
    title: wrapTitle("Documento", "Titular"),
    dataIndex: "documentoTitular",
    key: "documentoTitular",
    width: 140,
    align: "center",
    render: (value) => value || "—",
  },
  {
    title: "CUB",
    dataIndex: "cub",
    key: "cub",
    width: 100,
    align: "center",
    render: (value) => value || "—",
  },
  {
    title: wrapTitle("N° de", "Orden"),
    dataIndex: "ordenNumero",
    key: "ordenNumero",
    width: 110,
    align: "center",
    render: (value) => value || "—",
  },
  {
    title: "Proveedor",
    dataIndex: "supplier",
    key: "supplier",
    width: 150,
    align: "center",
  },
  {
    title: wrapTitle("ID", "producto"),
    dataIndex: "productId",
    key: "productId",
    width: 100,
    align: "center",
  },
  {
    title: wrapTitle("Nombre", "producto"),
    dataIndex: "productName",
    key: "productName",
    width: 180,
    align: "center",
  },
  {
    title: "Unidad",
    dataIndex: "unitOfMeasure",
    key: "unitOfMeasure",
    width: 110,
    align: "center",
  },
  {
    title: "Marca",
    dataIndex: "commercialBrand",
    key: "commercialBrand",
    width: 120,
    align: "center",
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
    title: wrapTitle("Valor Catálogo", "Jornada"),
    dataIndex: "fairCatalogValue",
    key: "fairCatalogValue",
    width: 150,
    align: "right",
    render: formatCurrency,
  },
  ...(priceColumn ? [priceColumn] : []),
  ...(homologationColumn ? [homologationColumn] : []),
  {
    title: "Acciones",
    key: "actions",
    width: 90,
    align: "center",
    fixed: "right",
    render: (_, record) =>
      onRemove ? (
        <Tooltip title="Quitar alerta">
          <RemoveButton icon={<DeleteOutlined />} onClick={() => onRemove(record)} />
        </Tooltip>
      ) : null,
  },
];