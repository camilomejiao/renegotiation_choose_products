import {DeleteOutlined} from "@ant-design/icons";
import {Tag} from "antd";

import {AppButton} from "../../../shared/ui/button";

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

export const getOrderCancellationRequestColumns = ({onCancelRequest}) => [
    {
        title: "TIPO DE SOLICITUD",
        dataIndex: "requestType",
        key: "requestType",
        width: 220,
        align: "center",
        render: (value) => value || "---",
    },
    {
        title: "ORDEN ID",
        dataIndex: "orderId",
        key: "orderId",
        width: 140,
        align: "center"
    },
    {
        title: "FECHA DE SOLICITUD",
        dataIndex: "requestDate",
        key: "requestDate",
        width: 220,
        align: "center"
    },
    {
        title: "CUB",
        dataIndex: "cubId",
        key: "cubId",
        width: 160,
        align: "center"
    },
    {
        title: "DOCUMENTO",
        dataIndex: "document",
        key: "document",
        width: 180,
        align: "center"
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
        title: "ESTADO",
        dataIndex: "status",
        key: "status",
        width: 160,
        align: "center",
        render: (value) => <Tag color={STATUS_COLORS[value] ?? "default"}>{value}</Tag>,
    },
    {
        title: "MOTIVO DE LA SOLICITUD",
        dataIndex: "requestReason",
        key: "requestReason",
        width: 280,
        align: "center",
        render: (value) => value || "---",
    },
    {
        title: "RESPUESTA A LA SOLICITUD",
        dataIndex: "leaderResponse",
        key: "leaderResponse",
        width: 280,
        align: "center",
        render: (value) => value || "---",
    },
    {
        title: "ACCIONES",
        dataIndex: "__actions",
        key: "__actions",
        width: 140,
        align: "center",
        render: (_, record) =>
            record?.canCancel ? (
                <AppButton
                    variant="danger"
                    icon={<DeleteOutlined/>}
                    onClick={() => onCancelRequest(record)}
                >
                    Eliminar solicitud
                </AppButton>
            ) : (
                "---"
            ),
    },
];
