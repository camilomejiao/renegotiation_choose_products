import { EyeOutlined } from "@ant-design/icons";
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

export const getLeaderOrderRequestColumns = ({
  onManageRequest,
  onViewRequest,
}) => [
  {
    title: "TIPO DE SOLICITUD",
    dataIndex: "requestType",
    key: "requestType",
    width: 220,
    align: "center",
    render: (value) => value || "---",
  },
  {
    title: "ORDEN DE COMPRA",
    dataIndex: "orderId",
    key: "orderId",
    width: 240,
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
    render: (value) => value || "---",
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
    width: 240,
    align: "center",
    render: (value) => value || "---",
  },
  {
    title: "VALOR TOTAL",
    dataIndex: "totalOrder",
    key: "totalOrder",
    width: 180,
    align: "center",
    render: (value) => formatCurrency(value),
  },
  {
    title: "ESTADO DE APROBACIÓN",
    dataIndex: "approvalStatus",
    key: "approvalStatus",
    width: 200,
    align: "center",
    render: (value) => <Tag color={STATUS_COLORS[value] ?? "default"}>{value}</Tag>,
  },
  {
    title: "FECHA DE APROBACIÓN",
    dataIndex: "approvalDate",
    key: "approvalDate",
    width: 200,
    align: "center",
    render: (value) => value || "---",
  },
  {
    title: "APROBADOR",
    dataIndex: "approver",
    key: "approver",
    width: 220,
    align: "center",
    render: (value) => value || "---",
  },
  {
    title: "ACCIONES",
    dataIndex: "__actions",
    key: "__actions",
    width: 220,
    align: "center",
    render: (_, record) =>
      record?.canManage ? (
        <AppButton onClick={() => onManageRequest(record)}>
          Gestionar Solicitud
        </AppButton>
      ) : (
        <AppButton
          variant="secondary"
          icon={<EyeOutlined />}
          onClick={() => onViewRequest(record)}
        >
          Ver
        </AppButton>
      ),
  },
];
