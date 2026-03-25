import { Tag } from "antd";
import { ManagementRowActions } from "./ManagementRowActions";

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
