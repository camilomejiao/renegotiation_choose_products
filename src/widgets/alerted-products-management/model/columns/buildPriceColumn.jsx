import { NewSalePriceCell } from "../../ui/NewSalePriceCell";
import { RequiredMark } from "../../ui/common.styles";

const priceTitleStyle = {
  display: "inline-block",
  width: "100%",
  whiteSpace: "normal",
  lineHeight: 1.15,
  textAlign: "center",
};

export const buildPriceColumn = ({ prices, touched, onChange }) => ({
  title: (
    <span style={priceTitleStyle}>
      <span style={{ display: "block" }}>Nuevo Precio</span>
      <span style={{ display: "block" }}>
        de Venta <RequiredMark>*</RequiredMark>
      </span>
    </span>
  ),
  key: "newSalePrice",
  width: 170,
  align: "center",
  render: (_, record) => (
    <NewSalePriceCell
      record={record}
      value={prices[record.id]}
      touched={touched}
      onChange={onChange}
    />
  ),
});