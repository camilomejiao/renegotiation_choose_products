import { Button } from "antd";
import { formatCurrency } from "./alertManagementConstants";

export const getAddProductColumns = ({ onAdd }) => [
  {
    title: "",
    dataIndex: "actions",
    key: "actions",
    width: 110,
    align: "center",
    render: (_, record) => (
      <Button type="primary" size="small" onClick={() => onAdd(record)}>
        Agregar
      </Button>
    ),
  },
  { title: "ID producto", dataIndex: "productId", key: "productId", render: (v) => v || "—" },
  { title: "Nombre producto", dataIndex: "productName", key: "productName", render: (v) => v || "—" },
  { title: "Proveedor", dataIndex: "supplier", key: "supplier", render: (v) => v || "—" },
  { title: "Categoría alerta", dataIndex: "alertCategory", key: "alertCategory", render: (v) => v || "—" },
  { title: "Precio mín.", dataIndex: "minimumPrice", key: "minimumPrice", render: (v) => formatCurrency(v) },
  { title: "Precio máx.", dataIndex: "maximumPrice", key: "maximumPrice", render: (v) => formatCurrency(v) },
];