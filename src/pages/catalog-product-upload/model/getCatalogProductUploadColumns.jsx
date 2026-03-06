import { ReadOnlyWrappedCell } from "../ui/CatalogProductUploadTableCells";

const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const getCatalogProductUploadColumns = () => [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    align: "center",
    width: 90,
    sorter: false,
  },
  {
    title: "Categoria",
    dataIndex: "categoryLabel",
    key: "category",
    width: 260,
    ellipsis: false,
    render: (value) => <ReadOnlyWrappedCell value={value} />,
  },
  {
    title: "Nombre",
    dataIndex: "name",
    key: "name",
    width: 360,
    ellipsis: false,
    render: (value) => <ReadOnlyWrappedCell value={value} />,
  },
  {
    title: "Unidad",
    dataIndex: "unitLabel",
    key: "unit",
    width: 240,
    ellipsis: false,
    align: "center",
    render: (value) => <ReadOnlyWrappedCell value={value} />,
  },
  {
    title: "Precio Min",
    dataIndex: "price_min",
    key: "price_min",
    align: "right",
    width: 180,
    render: (value) => currencyFormatter.format(Number(value || 0)),
  },
  {
    title: "Precio Max",
    dataIndex: "price_max",
    key: "price_max",
    align: "right",
    width: 180,
    render: (value) => currencyFormatter.format(Number(value || 0)),
  },
];
