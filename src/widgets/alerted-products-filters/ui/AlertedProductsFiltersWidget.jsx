import { FilterOutlined, SearchOutlined } from "@ant-design/icons";

import { matchesSupplierSelectOption } from "../../../pages/order-report/model/supplierSelectSearch";
import {
  productOptions,
} from "../model/filterOptions";
import { useAlertedProductsFilters } from "../model/useAlertedProductsFilters";
import {
  FiltersActions,
  FiltersCard,
  FiltersCol,
  FiltersFieldGroup,
  FiltersFieldLabel,
  FiltersForm,
  FiltersGrid,
  FiltersHeader,
  FiltersHeaderIcon,
  FiltersMultiSelect,
  FiltersRoot,
  FiltersSelect,
  FiltersTitle,
  PrimaryFilterButton,
  RequiredMark,
  SecondaryFilterButton,
} from "./AlertedProductsFiltersWidget.styles";

export const AlertedProductsFiltersWidget = () => {
  const {
    alertCategoryOptions,
    alertManagementOptions,
    departmentOptions,
    filters,
    journeyOptions,
    loadingManagementTypeOptions,
    loadingSupplierOptions,
    loadingDepartmentOptions,
    loadingMunicipalityOptions,
    loadingAlertCategoryOptions,
    loadingAlertManagementOptions,
    loadingJourneys,
    managementTypeOptions,
    municipalityOptions,
    supplierOptions,
    resetFilters,
    updateAlertCategory,
    updateAlertManagement,
    updateDepartment,
    updateManagementType,
    updateMunicipality,
    updateOperationalDay,
    updateProducts,
    updateSupplier,
  } = useAlertedProductsFilters();

  return (
    <FiltersCard bordered={false}>
      <FiltersRoot>
        <FiltersHeader>
          <FiltersHeaderIcon>
            <FilterOutlined />
          </FiltersHeaderIcon>
          <FiltersTitle>Filtros de búsqueda</FiltersTitle>
        </FiltersHeader>

        <FiltersForm>
          <FiltersGrid gutter={[16, 16]}>
            <FiltersCol span={24}>
              <FiltersFieldGroup>
                <FiltersFieldLabel>
                  Jornada
                  <RequiredMark>*</RequiredMark>
                </FiltersFieldLabel>
                <FiltersSelect
                  value={filters.operationalDay}
                  options={journeyOptions}
                  onChange={updateOperationalDay}
                  placeholder="Selecciona una jornada"
                  isLoading={loadingJourneys}
                  isClearable={false}
                  showSearch={false}
                />
              </FiltersFieldGroup>
            </FiltersCol>

            <FiltersCol xs={24} sm={12} lg={8} xl={6}>
              <FiltersFieldGroup>
                <FiltersFieldLabel>Categoría de alerta</FiltersFieldLabel>
                <FiltersSelect
                  value={filters.alertCategory}
                  options={alertCategoryOptions}
                  onChange={updateAlertCategory}
                  placeholder="Selecciona una categoría"
                  showSearch={false}
                  isClearable={false}
                  isLoading={loadingAlertCategoryOptions}
                />
              </FiltersFieldGroup>
            </FiltersCol>

            <FiltersCol xs={24} sm={12} lg={8} xl={6}>
              <FiltersFieldGroup>
                <FiltersFieldLabel>Tipo de gestión</FiltersFieldLabel>
                <FiltersSelect
                  value={filters.managementType}
                  options={managementTypeOptions}
                  onChange={updateManagementType}
                  placeholder="Selecciona un tipo"
                  showSearch={false}
                  isClearable={false}
                  isLoading={loadingManagementTypeOptions}
                />
              </FiltersFieldGroup>
            </FiltersCol>

            <FiltersCol xs={24} sm={12} lg={8} xl={6}>
              <FiltersFieldGroup>
                <FiltersFieldLabel>Gestión de alerta</FiltersFieldLabel>
                <FiltersSelect
                  value={filters.alertManagement}
                  options={alertManagementOptions}
                  onChange={updateAlertManagement}
                  placeholder="Selecciona una gestión"
                  showSearch={false}
                  isClearable={false}
                  isLoading={loadingAlertManagementOptions}
                />
              </FiltersFieldGroup>
            </FiltersCol>

            <FiltersCol xs={24} sm={12} lg={8} xl={6}>
              <FiltersFieldGroup>
                <FiltersFieldLabel>Departamento</FiltersFieldLabel>
                <FiltersSelect
                  value={filters.department}
                  options={departmentOptions}
                  onChange={updateDepartment}
                  placeholder="Selecciona un departamento"
                  showSearch={false}
                  isClearable={false}
                  isLoading={loadingDepartmentOptions}
                />
              </FiltersFieldGroup>
            </FiltersCol>

            <FiltersCol xs={24} sm={12} lg={8} xl={6}>
              <FiltersFieldGroup>
                <FiltersFieldLabel>Municipio</FiltersFieldLabel>
                <FiltersSelect
                  value={filters.municipality}
                  options={municipalityOptions}
                  onChange={updateMunicipality}
                  placeholder="Selecciona un municipio"
                  showSearch={false}
                  isClearable={false}
                  isLoading={loadingMunicipalityOptions}
                  isDisabled={!filters.department?.value}
                />
              </FiltersFieldGroup>
            </FiltersCol>

            <FiltersCol xs={24} sm={12} lg={8} xl={6}>
              <FiltersFieldGroup>
                <FiltersFieldLabel>Proveedor</FiltersFieldLabel>
                <FiltersSelect
                  value={filters.supplier}
                  options={supplierOptions}
                  onChange={updateSupplier}
                  placeholder="Proveedor (nombre o NIT)"
                  filterOption={matchesSupplierSelectOption}
                  isClearable={false}
                  isLoading={loadingSupplierOptions}
                />
              </FiltersFieldGroup>
            </FiltersCol>

            <FiltersCol xs={24} sm={12} lg={8} xl={6}>
              <FiltersFieldGroup>
                <FiltersFieldLabel>Producto</FiltersFieldLabel>
                <FiltersMultiSelect
                  mode="multiple"
                  value={filters.products.map((product) => product.value)}
                  options={productOptions}
                  onChange={(_, options) => updateProducts(Array.isArray(options) ? options : [])}
                  placeholder="Selecciona uno o varios productos"
                  showSearch={false}
                  allowClear={false}
                />
              </FiltersFieldGroup>
            </FiltersCol>
          </FiltersGrid>

          <FiltersActions>
            <PrimaryFilterButton icon={<SearchOutlined />}>
              Aplicar filtros
            </PrimaryFilterButton>
            <SecondaryFilterButton onClick={resetFilters}>
              Limpiar búsqueda
            </SecondaryFilterButton>
          </FiltersActions>
        </FiltersForm>
      </FiltersRoot>
    </FiltersCard>
  );
};
