import { Col, Row } from "antd";
import {
  CurrencyCell,
  ObservationCell,
  ReadOnlyCell,
  StatusCell,
} from "../../../shared/ui/review-table-cells";
import {
  BinarySelect,
  CompactInput,
  CompactSelect,
} from "./EnvironmentalTableCells.styles";

const YES_NO_OPTIONS = [
  { value: "1", label: "Si" },
  { value: "0", label: "No" },
];

export { ReadOnlyCell, CurrencyCell, StatusCell, ObservationCell };

export const EnvironmentalFlagCell = ({ value, record, columnKey, onChange }) => {
  return (
    <BinarySelect
      size="small"
      value={String(value ?? "0")}
      options={YES_NO_OPTIONS}
      onChange={(nextValue) => onChange(record.id, columnKey, String(nextValue))}
    />
  );
};

export const EnvironmentalAmountCell = ({ record, categoryOptions, onChange }) => {
  return (
    <Row gutter={[8, 8]}>
      <Col span={8}>
        <CompactInput
          min={0}
          size="small"
          controls={false}
          value={record?.customValue === "" ? null : Number(record?.customValue || 0)}
          onChange={(nextValue) => onChange(record.id, "customValue", nextValue ?? 0)}
        />
      </Col>
      <Col span={16}>
        <CompactSelect
          size="small"
          value={record?.selectedCategory || undefined}
          options={categoryOptions}
          onChange={(nextValue) => onChange(record.id, "selectedCategory", nextValue || "")}
          allowClear
          placeholder="Categoria"
        />
      </Col>
    </Row>
  );
};
