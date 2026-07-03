import {
  FiltersCol,
  FiltersFieldGroup,
  FiltersFieldLabel,
  RequiredMark,
} from "./AlertedProductsFiltersWidget.styles";

export const FULL_COL = { span: 24 };
export const THIRD_COL = { xs: 24, sm: 12, lg: 8 };

// Envoltura común de un campo de filtro: columna + grupo + etiqueta.
export const FilterField = ({ label, required = false, colProps = THIRD_COL, children }) => (
  <FiltersCol {...colProps}>
    <FiltersFieldGroup>
      <FiltersFieldLabel>
        {label}
        {required ? <RequiredMark>*</RequiredMark> : null}
      </FiltersFieldLabel>
      {children}
    </FiltersFieldGroup>
  </FiltersCol>
);