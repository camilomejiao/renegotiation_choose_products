import { DeleteOutlined } from "@ant-design/icons";
import { Tag } from "antd";

import { AppButton } from "../../../shared/ui/button";

const STATUS_COLORS = {
  Pendiente: "gold",
  Aprobado: "green",
  Rechazado: "red",
  Cancelado: "default",
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export const getOrderCancellationRequestColumns = ({ onCancelRequest }) => [
  {
    title: "ORDEN ID",
    dataIndex: "orderId",
    key: "orderId",
    width: 140,
  },
  {
    title: "FECHA DE SOLICITUD",
    dataIndex: "requestDate",
    key: "requestDate",
    width: 220,
  },
  {
    title: "CUB",
    dataIndex: "cubId",
    key: "cubId",
    width: 160,
  },
  {
    title: "DOCUMENTO",
    dataIndex: "document",
    key: "document",
    width: 180,
  },
  {
    title: "TOTAL ORDEN",
    dataIndex: "totalOrder",
    key: "totalOrder",
    width: 180,
    align: "right",
    render: (value) => formatCurrency(value),
  },
  {
    title: "ESTADO",
    dataIndex: "status",
    key: "status",
    width: 160,
    render: (value) => <Tag color={STATUS_COLORS[value] ?? "default"}>{value}</Tag>,
  },
  {
    title: "OBSERVACIÓN",
    dataIndex: "observation",
    key: "observation",
    width: 280,
    render: (value) => value || "---",
  },
  {
    title: "ACCIONES",
    dataIndex: "__actions",
    key: "__actions",
    width: 140,
    render: (_, record) =>
      record?.canCancel ? (
        <AppButton
          variant="danger"
          icon={<DeleteOutlined />}
          onClick={() => onCancelRequest(record)}
        >
          Eliminar solicitud
        </AppButton>
      ) : (
        "---"
      ),
  },
];
