import {
  CategoryCell,
  DeleteActionCell,
  NameCell,
  PriceMaxCell,
  PriceMinCell,
  UnitCell,
} from "../ui/CatalogEditTableCells";

export const getCatalogEditColumns = ({
  unitOptions = [],
  categoryOptions = [],
  onRowChange,
  onDelete,
}) => [
  { title: "ID", dataIndex: "id", align: "center", sorter: true },
  {
    title: "Categoría",
    dataIndex: "category",
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
    render: (value, record) => <NameCell value={value} record={record} onRowChange={onRowChange} />,
  },
  {
    title: "Unidad",
    dataIndex: "unit",
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
    align: "right",
    render: (value, record) => (
      <PriceMinCell value={value} record={record} onRowChange={onRowChange} />
    ),
  },
  {
    title: "Precio Max",
    dataIndex: "price_max",
    align: "right",
    render: (value, record) => (
      <PriceMaxCell value={value} record={record} onRowChange={onRowChange} />
    ),
  },
  {
    title: "Acciones",
    dataIndex: "actions",
    align: "center",
    sorter: false,
    render: (_value, record) => <DeleteActionCell record={record} onDelete={onDelete} />,
  },
];
