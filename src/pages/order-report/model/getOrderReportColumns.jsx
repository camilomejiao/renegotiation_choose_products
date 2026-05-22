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
    title: "ORDEN DE COMPRA",
    dataIndex: "id",
    key: "id",
    width: 140,
    align: "center",
  },
  {
    title: "FECHA DE REGISTRO",
    dataIndex: "fecha_registro",
    key: "fecha_registro",
    width: 220,
    align: "center",
  },
  {
    title: "CUB",
    dataIndex: "cub_id",
    key: "cub_id",
    width: 160,
    align: "center",
  },
  {
    title: "TITULAR",
    dataIndex: "titular",
    key: "titular",
    width: 240,
    align: "center",
  },
  {
    title: "DOCUMENTO",
    dataIndex: "cub_identificacion",
    key: "cub_identificacion",
    width: 180,
    align: "center",
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
    align: "center",
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
