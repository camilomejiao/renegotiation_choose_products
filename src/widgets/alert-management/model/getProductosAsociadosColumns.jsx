import { DeleteOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { formatCurrency, renderPill } from "./alertManagementConstants";

const BASE_COLUMNS = [
  { title: "ID producto", dataIndex: "id_producto", key: "id_producto", render: (v) => v || "—" },
  { title: "Nombre", dataIndex: "nombre", key: "nombre", render: (v) => v || "—" },
  { title: "Precio mín.", dataIndex: "precio_minimo", key: "precio_minimo", render: (v) => formatCurrency(v) },
  { title: "Precio máx.", dataIndex: "precio_maximo", key: "precio_maximo", render: (v) => formatCurrency(v) },
  { title: "Resultado", dataIndex: "resultado", key: "resultado", render: (v) => v || "—" },
];

export const getProductosGestionColumns = () => [
  ...BASE_COLUMNS.slice(0, 4),
  { title: "Valor venta", dataIndex: "valor_venta", key: "valor_venta", render: (v) => formatCurrency(v) },
  BASE_COLUMNS[4],
];

export const getProductosSubsanarColumns = ({ estadoLabel, estadoCode, pillMap = {}, onDelete, deletingOrderDetailId } = {}) => [
  { title: "ID producto", dataIndex: "id_producto", key: "id_producto", render: (v) => v || "—" },
  { title: "Nombre", dataIndex: "nombre", key: "nombre", render: (v) => v || "—" },
  {
    title: "Categoría",
    dataIndex: "categoria_alerta",
    key: "categoria_alerta",
    render: (v) => v?.nombre || "—",
  },
  {
    title: "Estado actual",
    key: "estado_actual",
    align: "center",
    render: () => renderPill(estadoLabel, estadoCode, pillMap),
  },
  {
    title: "Acción",
    key: "accion",
    align: "center",
    render: (_, record) => (
      <Button
        danger
        type="text"
        icon={<DeleteOutlined />}
        loading={deletingOrderDetailId != null && deletingOrderDetailId === record.id_orden_detalle}
        disabled={deletingOrderDetailId != null && deletingOrderDetailId !== record.id_orden_detalle}
        onClick={() => onDelete?.(record)}
      />
    ),
  },
];

export const mapPickedProductToAsociado = (product = {}) => ({
  id_orden_detalle: product.id,
  id_producto: product.productId,
  nombre: product.productName,
  categoria_alerta: { codigo: product.alertCategoryCode, nombre: product.alertCategory },
  precio_minimo: product.minimumPrice,
  precio_maximo: product.maximumPrice,
  valor_venta: product.saleUnitValue,
});