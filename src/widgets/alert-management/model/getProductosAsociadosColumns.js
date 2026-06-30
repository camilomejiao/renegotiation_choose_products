import { formatCurrency } from "./alertManagementConstants";

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

export const getProductosSubsanarColumns = () => [...BASE_COLUMNS];