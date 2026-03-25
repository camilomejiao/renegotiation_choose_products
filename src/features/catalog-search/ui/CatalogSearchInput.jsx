import { AppSearchInput } from "../../../shared/ui/search-input";

export const CatalogSearchInput = ({ value, onChange }) => {
  return <AppSearchInput value={value} onChange={onChange} placeholder="Buscar..." />;
};
