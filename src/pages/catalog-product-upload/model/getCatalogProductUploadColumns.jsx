import {
  CategoryCell,
  DeleteActionCell,
  NameCell,
  PriceMaxCell,
  PriceMinCell,
  UnitCell,
} from "../../catalog-edit-products-by-convocation/ui/CatalogEditTableCells";

export const getCatalogProductUploadColumns = ({
  unitOptions = [],
  categoryOptions = [],
  onRowChange,
  onDelete,
}) => [
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
    dataIndex: "category",
    key: "category",
    render: (value, record) => (
      <CategoryCell
        value={value}
        record={record}
        onRowChange={onRowChange}
        options={categoryOptions.map((option) => ({
          value: option.id,
          label: option.nombre,
        }))}
      />
    ),
  },
  {
    title: "Nombre",
    dataIndex: "name",
    key: "name",
    width: 360,
    render: (value, record) => (
      <NameCell value={value} record={record} onRowChange={onRowChange} />
    ),
  },
  {
    title: "Unidad",
    dataIndex: "unit",
    key: "unit",
    width: 240,
    align: "center",
    render: (value, record) => (
      <UnitCell
        value={value}
        record={record}
        onRowChange={onRowChange}
        options={unitOptions.map((option) => ({
          value: option.id,
          label: option.nombre,
        }))}
      />
    ),
  },
  {
    title: "Precio Min",
    dataIndex: "price_min",
    key: "price_min",
    align: "right",
    render: (value, record) => (
      <PriceMinCell value={value} record={record} onRowChange={onRowChange} />
    ),
  },
  {
    title: "Precio Max",
    dataIndex: "price_max",
    key: "price_max",
    align: "right",
    render: (value, record) => (
      <PriceMaxCell value={value} record={record} onRowChange={onRowChange} />
    ),
  },
  {
    title: "Acciones",
    dataIndex: "actions",
    key: "actions",
    align: "center",
    sorter: false,
    render: (_value, record) => <DeleteActionCell record={record} onDelete={onDelete} />,
  },
];
