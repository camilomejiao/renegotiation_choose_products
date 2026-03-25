import { Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { CellInput, CellInputNumber, CellSelect } from "./CatalogEditTableCells.styles";

const getRowIdentifier = (record) => record?.rowKey ?? record?.id;

export const CategoryCell = ({ value, record, options, onRowChange }) => {
  return (
    <CellSelect
      value={value ?? undefined}
      onChange={(nextValue) => onRowChange(getRowIdentifier(record), { category: nextValue })}
      options={options}
      size="small"
    />
  );
};

export const NameCell = ({ value, record, onRowChange }) => {
  return (
    <CellInput
      value={value}
      onChange={(event) => onRowChange(getRowIdentifier(record), { name: event.target.value })}
      size="small"
    />
  );
};

export const UnitCell = ({ value, record, options, onRowChange }) => {
  return (
    <CellSelect
      value={value ?? undefined}
      onChange={(nextValue) => onRowChange(getRowIdentifier(record), { unit: nextValue })}
      options={options}
      size="small"
    />
  );
};

export const PriceMinCell = ({ value, record, onRowChange }) => {
  return (
    <CellInputNumber
      value={value}
      onChange={(nextValue) => onRowChange(getRowIdentifier(record), { price_min: nextValue })}
      size="small"
      min={0}
    />
  );
};

export const PriceMaxCell = ({ value, record, onRowChange }) => {
  return (
    <CellInputNumber
      value={value}
      onChange={(nextValue) => onRowChange(getRowIdentifier(record), { price_max: nextValue })}
      size="small"
      min={0}
    />
  );
};

export const DeleteActionCell = ({ record, onDelete }) => {
  return (
    <Button
      danger
      type="text"
      icon={<DeleteOutlined />}
      onClick={() => onDelete(getRowIdentifier(record))}
    />
  );
};
