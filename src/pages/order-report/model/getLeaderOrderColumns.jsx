const formatCurrency = (value) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export const getLeaderOrderColumns = () => [
  {
    title: "ORDEN DE COMPRA",
    dataIndex: "orderId",
    key: "orderId",
    width: 220,
    align: "center",
  },
  {
    title: "CUB",
    dataIndex: "cubId",
    key: "cubId",
    width: 160,
    align: "center",
  },
  {
    title: "DOCUMENTO",
    dataIndex: "document",
    key: "document",
    width: 180,
    align: "center",
  },
  {
    title: "TITULAR",
    dataIndex: "beneficiary",
    key: "beneficiary",
    width: 260,
    align: "center",
    render: (value) => value || "---",
  },
  {
    title: "PROVEEDOR",
    dataIndex: "supplier",
    key: "supplier",
    width: 260,
    align: "center",
  },
  {
    title: "VALOR TOTAL",
    dataIndex: "totalValue",
    key: "totalValue",
    width: 180,
    align: "right",
    render: (value) => formatCurrency(value),
  },
];
