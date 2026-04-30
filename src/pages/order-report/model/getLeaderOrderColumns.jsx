const formatCurrency = (value) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export const getLeaderOrderColumns = () => [
  {
    title: "NÚMERO DE ORDEN DE COMPRA",
    dataIndex: "orderId",
    key: "orderId",
    width: 220,
  },
  {
    title: "CUB",
    dataIndex: "cubId",
    key: "cubId",
    width: 160,
  },
  {
    title: "BENEFICIARIO",
    dataIndex: "beneficiary",
    key: "beneficiary",
    width: 260,
  },
  {
    title: "PROVEEDOR",
    dataIndex: "supplier",
    key: "supplier",
    width: 260,
  },
  {
    title: "VALOR",
    dataIndex: "totalValue",
    key: "totalValue",
    width: 180,
    align: "right",
    render: (value) => formatCurrency(value),
  },
];
