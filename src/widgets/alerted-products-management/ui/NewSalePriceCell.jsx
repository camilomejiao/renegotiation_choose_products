import { formatCopInput, parseCopInput } from "../lib/format";
import { isValidNewSalePrice } from "../model/constants";
import { NewPriceInput } from "./NewSalePriceCell.styles";

export const NewSalePriceCell = ({ record, value, touched, onChange }) => (
  <NewPriceInput
    value={value ?? null}
    min={0}
    controls={false}
    placeholder="$ 0"
    formatter={formatCopInput}
    parser={parseCopInput}
    status={touched && !isValidNewSalePrice(value, record) ? "error" : ""}
    onChange={(next) => onChange(record.id, next)}
  />
);