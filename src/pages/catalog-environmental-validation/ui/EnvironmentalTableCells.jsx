import { Col, Row } from "antd";
import {
  BinarySelect,
  CompactInput,
  CompactSelect,
  ObservationText,
  StatusTag,
  WrappedText,
} from "./EnvironmentalTableCells.styles";

const YES_NO_OPTIONS = [
  { value: "1", label: "Si" },
  { value: "0", label: "No" },
];

const STATUS_COLORS = {
  Aprobado: "success",
  Denegado: "error",
  Pendiente: "warning",
};

const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const ReadOnlyCell = ({ value }) => <WrappedText>{value ?? "-"}</WrappedText>;

export const CurrencyCell = ({ value }) => {
  const formatted = currencyFormatter.format(Number(value || 0));

  return <WrappedText>{formatted}</WrappedText>;
};

export const StatusCell = ({ value }) => {
  const normalized = value || "Pendiente";
  return <StatusTag color={STATUS_COLORS[normalized] || "default"}>{normalized}</StatusTag>;
};

export const ObservationCell = ({ value }) => {
  const comentario = value?.comentario || "Sin observacion";
  const funcionario = value?.funcionario || "";
  const fecha = value?.fecha || "";
  const detail = funcionario && fecha ? ` (${funcionario} - ${fecha})` : "";

  return <ObservationText>{`${comentario}${detail}`}</ObservationText>;
};

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
