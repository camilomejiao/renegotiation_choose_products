import { Button, Input, InputNumber, Select } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

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
    render: (value, record) => {
      return (
        <Select
          value={value ?? undefined}
          onChange={(nextValue) => onRowChange(record.id, { category: nextValue })}
          options={categoryOptions.map((option) => ({
            value: option.id,
            label: option.nombre,
          }))}
          style={{ width: "100%" }}
          size="small"
        />
      );
    },
  },
  {
    title: "Nombre",
    dataIndex: "name",
    render: (value, record) => (
      <Input
        value={value}
        onChange={(event) => onRowChange(record.id, { name: event.target.value })}
        style={{ width: "100%" }}
        size="small"
      />
    ),
  },
  {
    title: "Unidad",
    dataIndex: "unit",
    render: (value, record) => {
      return (
        <Select
          value={value ?? undefined}
          onChange={(nextValue) => onRowChange(record.id, { unit: nextValue })}
          options={unitOptions.map((option) => ({
            value: option.id,
            label: option.nombre,
          }))}
          style={{ width: "100%" }}
          size="small"
        />
      );
    },
  },
  {
    title: "Precio Min",
    dataIndex: "price_min",
    align: "right",
    render: (value, record) => {
      return (
        <InputNumber
          value={value}
          onChange={(nextValue) => onRowChange(record.id, { price_min: nextValue })}
          style={{ width: "100%" }}
          size="small"
          min={0}
        />
      );
    },
  },
  {
    title: "Precio Max",
    dataIndex: "price_max",
    align: "right",
    render: (value, record) => {
      return (
        <InputNumber
          value={value}
          onChange={(nextValue) => onRowChange(record.id, { price_max: nextValue })}
          style={{ width: "100%" }}
          size="small"
          min={0}
        />
      );
    },
  },
  {
    title: "Acciones",
    dataIndex: "actions",
    align: "center",
    sorter: false,
    render: (_value, record) => (
      <Button danger type="text" icon={<DeleteOutlined />} onClick={() => onDelete(record.id)} />
    ),
  },
];
