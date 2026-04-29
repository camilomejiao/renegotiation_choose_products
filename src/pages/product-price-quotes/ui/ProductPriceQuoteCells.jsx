import {
  CellInput,
  CellInputNumber,
  CellTextArea,
  WrappedCellText,
} from "./ProductPriceQuoteCells.styles";

const CURRENCY_FORMATTER = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const ReadOnlyTextCell = ({ value }) => {
  return <WrappedCellText>{value ?? "-"}</WrappedCellText>;
};

export const EditableTextCell = ({ value, record, field, onRowChange, disabled = false }) => {
  return (
    <CellInput
      value={value}
      onChange={(event) => onRowChange(record.id, { [field]: event.target.value })}
      disabled={disabled}
      size="small"
    />
  );
};

export const EditableTextAreaCell = ({
  value,
  record,
  field,
  onRowChange,
  disabled = false,
}) => {
  return (
    <CellTextArea
      value={value}
      onChange={(event) => onRowChange(record.id, { [field]: event.target.value })}
      disabled={disabled}
      autoSize={{ minRows: 2, maxRows: 4 }}
    />
  );
};

export const EditablePriceCell = ({ value, record, onRowChange, disabled = false }) => {
  return (
    <CellInputNumber
      value={Number(value || 0)}
      onChange={(nextValue) => onRowChange(record.id, { price: Number(nextValue || 0) })}
      disabled={disabled}
      min={0}
      size="small"
      controls={false}
      formatter={(currentValue) =>
        currentValue === undefined || currentValue === null || currentValue === ""
          ? ""
          : CURRENCY_FORMATTER.format(Number(currentValue))
      }
      parser={(currentValue) => currentValue?.replace(/[^\d]/g, "") || ""}
    />
  );
};
