import { wrapTitle } from "../../../../shared/ui/lib/wrapTitle";
import { HomologatedProductCell } from "../../ui/HomologatedProductCell";

export const buildHomologationColumn = ({ byRow, touched, onAssign, onRemove }) => ({
  title: wrapTitle("Producto a", "Homologar"),
  key: "homologatedProduct",
  width: 320,
  align: "center",
  ellipsis: false,
  onCell: () => ({
    style: {
      whiteSpace: "normal",
      wordBreak: "break-word",
      verticalAlign: "top",
    },
  }),
  render: (_, record) => (
    <HomologatedProductCell
      product={byRow[record.id]}
      touched={touched}
      onAssign={() => onAssign(record.id)}
      onRemove={() => onRemove(record.id)}
    />
  ),
});