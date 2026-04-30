import { EyeOutlined } from "@ant-design/icons";
import { Tag } from "antd";

import { AppButton } from "../../../shared/ui/button";

const STATUS_COLORS = {
  Pendiente: "gold",
  Aprobado: "green",
  Rechazado: "red",
  Cancelado: "default",
};

export const getLeaderOrderRequestColumns = ({
  onManageRequest,
  onViewRequest,
}) => [
  {
    title: "NÚMERO DE ORDEN DE COMPRA",
    dataIndex: "orderId",
    key: "orderId",
    width: 240,
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
    width: 240,
  },
  {
    title: "ESTADO DE APROBACIÓN",
    dataIndex: "approvalStatus",
    key: "approvalStatus",
    width: 200,
    render: (value) => <Tag color={STATUS_COLORS[value] ?? "default"}>{value}</Tag>,
  },
  {
    title: "FECHA DE APROBACIÓN",
    dataIndex: "approvalDate",
    key: "approvalDate",
    width: 200,
    render: (value) => value || "---",
  },
  {
    title: "APROBADOR",
    dataIndex: "approver",
    key: "approver",
    width: 220,
    render: (value) => value || "---",
  },
  {
    title: "ACCIONES",
    dataIndex: "__actions",
    key: "__actions",
    width: 220,
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
