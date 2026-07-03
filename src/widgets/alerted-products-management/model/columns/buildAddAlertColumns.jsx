import { wrapTitle } from "../../../../shared/ui/lib/wrapTitle";
import { AddAlertRowButton } from "../../ui/common.styles";
import { renderCategoryPill } from "../getAlertedProductsManagementColumns";

export const buildAddAlertColumns = ({ addedIds, addingId, onAdd, managementTypeLabel }) => [
  {
    title: "Acción",
    key: "action",
    width: 110,
    align: "center",
    fixed: "left",
    render: (_, record) => {
      const isAdded = addedIds.has(record.id);
      return (
        <AddAlertRowButton
          loading={addingId === record.id}
          disabled={isAdded || (addingId !== null && addingId !== record.id)}
          onClick={() => !isAdded && onAdd(record)}
        >
          {isAdded ? "Ya añadido" : "Añadir"}
        </AddAlertRowButton>
      );
    },
  },
  {
    title: "Categoría",
    dataIndex: "alertCategory",
    key: "alertCategory",
    width: 180,
    align: "center",
    render: (value, record) => renderCategoryPill(value, record?.alertCategoryCode),
  },
  {
    title: wrapTitle("Documento", "Titular"),
    dataIndex: "documentoTitular",
    key: "documentoTitular",
    width: 140,
    align: "center",
    render: (v) => v || "—",
  },
  {
    title: "CUB",
    dataIndex: "cub",
    key: "cub",
    width: 100,
    align: "center",
    render: (v) => v || "—",
  },
  {
    title: wrapTitle("N° de", "Orden"),
    dataIndex: "ordenNumero",
    key: "ordenNumero",
    width: 110,
    align: "center",
    render: (v) => v || "—",
  },
  {
    title: "Proveedor",
    dataIndex: "supplier",
    key: "supplier",
    width: 160,
    align: "center",
  },
  {
    title: wrapTitle("ID", "Producto"),
    dataIndex: "productId",
    key: "productId",
    width: 110,
    align: "center",
  },
  {
    title: wrapTitle("Nombre", "producto"),
    dataIndex: "productName",
    key: "productName",
    width: 200,
    align: "center",
  },
  {
    title: wrapTitle("Tipo", "gestión"),
    dataIndex: "managementType",
    key: "managementType",
    width: 160,
    align: "center",
    render: (value) => value || managementTypeLabel || "—",
  },
  {
    title: wrapTitle("Gestión", "alerta"),
    dataIndex: "alertManagement",
    key: "alertManagement",
    width: 150,
    align: "center",
    render: (v) => v || "—",
  },
];