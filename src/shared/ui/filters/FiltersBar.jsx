import React from "react";
import { FiltersActions, FiltersBarWrapper, FiltersGroup, FiltersInput } from "./FiltersBar.styles";

export const FiltersBar = ({
  query,
  onQueryChange,
  placeholder = "Buscar...",
  actions,
}) => {
  return (
    <FiltersBarWrapper>
      <FiltersGroup>
        <FiltersInput
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={onQueryChange}
        />
      </FiltersGroup>
      {actions && <FiltersActions>{actions}</FiltersActions>}
    </FiltersBarWrapper>
  );
};
