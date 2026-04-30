import { DeleteOutlined } from "@ant-design/icons";

import { AppButton } from "../../../shared/ui/button";

const formatCurrency = (value) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export const getOrderReportColumns = ({ onDelete }) => [
  {
    title: "ORDER ID",
    dataIndex: "id",
    key: "id",
    width: 140,
  },
  {
    title: "FECHA DE REGISTRO",
    dataIndex: "fecha_registro",
    key: "fecha_registro",
    width: 220,
  },
  {
    title: "CUB",
    dataIndex: "cub_id",
    key: "cub_id",
    width: 160,
  },
  {
    title: "DOCUMENTO",
    dataIndex: "cub_identificacion",
    key: "cub_identificacion",
    width: 180,
  },
  {
    title: "VALOR TOTAL",
    dataIndex: "valor_total",
    key: "valor_total",
    width: 180,
    align: "right",
    render: (value) => formatCurrency(value),
  },
  {
    title: "ACCIONES",
    dataIndex: "__actions",
    key: "__actions",
    width: 160,
    render: (_, record) =>
      record?.canCancelRequest ? (
        <AppButton
          variant="danger"
          icon={<DeleteOutlined />}
          onClick={() => onDelete(record)}
        >
          Anular
        </AppButton>
      ) : (
        "---"
      ),
  },
];
