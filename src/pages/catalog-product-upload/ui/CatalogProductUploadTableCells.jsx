import { WrappedCellText } from "./CatalogProductUploadTableCells.styles";

export const ReadOnlyWrappedCell = ({ value }) => {
  return <WrappedCellText>{value ?? ""}</WrappedCellText>;
};
