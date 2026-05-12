import { Tag } from "antd";
import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { ManagementRowActions } from "./ManagementRowActions";
import { DangerHoverActionButton, PrimaryHoverActionButton, WarningActionButton } from "./ManagementRowActions.styles";

const renderBooleanStatus = (value) => {
  const isActive = Boolean(value);

  return <Tag color={isActive ? "success" : "error"}>{isActive ? "Activo" : "Inactivo"}</Tag>;
};

export const createUsersManagementColumns = ({
  onToggleStatus,
  onEdit,
  onDelete,
}) => [
  { title: "ID", dataIndex: "id", key: "id", width: 90 },
  { title: "NOMBRE", dataIndex: "name", key: "name", width: 180 },
  { title: "APELLIDO", dataIndex: "last_name", key: "last_name", width: 180 },
  {
    title: "CC O NIT",
    dataIndex: "identification_number",
    key: "identification_number",
    width: 160,
  },
  { title: "EMAIL", dataIndex: "email", key: "email", width: 240 },
  { title: "ROL", dataIndex: "rol", key: "rol", width: 180 },
  {
    title: "ESTADO",
    dataIndex: "status",
    key: "status",
    width: 140,
    render: renderBooleanStatus,
  },
  {
    title: "ACCIONES",
    dataIndex: "actions",
    key: "actions",
    width: 210,
    render: (_, record) =>
      (
        <ManagementRowActions
          record={record}
          onToggleStatus={onToggleStatus}
          onEdit={onEdit}
          onDelete={onDelete}
          deleteMessage="¿Deseas eliminar este usuario?"
        />
      ),
  },
];

export const createSuppliersManagementColumns = ({
  onToggleStatus,
  onEdit,
  onDelete,
}) => [
  { title: "ID", dataIndex: "id", key: "id", width: 90 },
  { title: "NOMBRE REPRESENTANTE LEGAL", dataIndex: "name", key: "name", width: 240 },
  { title: "RAZON SOCIAL", dataIndex: "company_name", key: "company_name", width: 260 },
  { title: "NIT", dataIndex: "nit", key: "nit", width: 160 },
  { title: "EMAIL", dataIndex: "email", key: "email", width: 220 },
  { title: "DEPARTAMENTO", dataIndex: "dept", key: "dept", width: 180 },
  { title: "MUNICIPIO", dataIndex: "muni", key: "muni", width: 180 },
  { title: "ESTADO", dataIndex: "status", key: "status", width: 140, render: renderBooleanStatus },
  { title: "DESCRIPCION DEL ESTADO", dataIndex: "description", key: "description", width: 240 },
  { title: "RESOLUCION", dataIndex: "resolution", key: "resolution", width: 180 },
  {
    title: "ACCIONES",
    dataIndex: "actions",
    key: "actions",
    width: 210,
    render: (_, record) =>
      (
        <ManagementRowActions
          record={record}
          onToggleStatus={onToggleStatus}
          onEdit={onEdit}
          onDelete={onDelete}
          deleteMessage="¿Deseas eliminar este proveedor?"
        />
      ),
  },
];

export const createConvocationManagementColumns = ({
  onToggleStatus,
  onEdit,
  onDelete,
}) => [
  { title: "ID", dataIndex: "id", key: "id", width: 90 },
  { title: "NOMBRE", dataIndex: "name", key: "name", width: 220 },
  { title: "FECHA INICIAL", dataIndex: "start_date", key: "start_date", width: 180 },
  { title: "FECHA FINAL", dataIndex: "end_date", key: "end_date", width: 180 },
  {
    title: "DIAS RESTANTES",
    dataIndex: "remaining_days",
    key: "remaining_days",
    width: 160,
  },
  { title: "DESCRIPCION", dataIndex: "description", key: "description", width: 260 },
  {
    title: "ESTADO",
    dataIndex: "status",
    key: "status",
    width: 140,
    render: (value, record) => (
      <PrimaryHoverActionButton
        shape="circle"
        icon={value ? <StopOutlined /> : <CheckCircleOutlined />}
        onClick={() => onToggleStatus?.(record)}
        title={value ? "Inactivar" : "Activar"}
        $borderColor="#2563eb"
        $textColor="#2563eb"
        $hoverBg="#2563eb"
        $hoverText="#ffffff"
      />
    ),
  },
  {
    title: "ACCIONES",
    dataIndex: "actions",
    key: "actions",
    width: 160,
    render: (_, record) => (
      <>
        <WarningActionButton
          shape="circle"
          icon={<EditOutlined />}
          onClick={() => onEdit?.(record.id)}
          title="Editar"
          $borderColor="#d97706"
          $textColor="#d97706"
          $hoverBg="#f59e0b"
          $hoverText="#ffffff"
        />
        <DangerHoverActionButton
          shape="circle"
          icon={<DeleteOutlined />}
          onClick={() => onDelete?.(record.id)}
          title="Eliminar"
          $borderColor="#dc2626"
          $textColor="#dc2626"
          $hoverBg="#dc2626"
          $hoverText="#ffffff"
          style={{ marginLeft: 8 }}
        />
      </>
    ),
  },
];
