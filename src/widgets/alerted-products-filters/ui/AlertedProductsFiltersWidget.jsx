import { FilterOutlined, SearchOutlined } from "@ant-design/icons";

import { matchesSupplierSelectOption } from "../../../shared/lib/supplierSelectSearch";
import { useAlertedProductsFilters } from "../model/useAlertedProductsFilters";
import { FULL_COL, FilterField } from "./FilterField";
import {
  FiltersActions,
  FiltersCard,
  FiltersForm,
  FiltersGrid,
  FiltersHeader,
  FiltersHeaderIcon,
  FiltersInput,
  FiltersMultiSelect,
  FiltersRoot,
  FiltersSelect,
  FiltersTitle,
  PrimaryFilterButton,
  SecondaryFilterButton,
} from "./AlertedProductsFiltersWidget.styles";

export const AlertedProductsFiltersWidget = ({
  onApply,
  onReset,
  onJourneyChange,
  loading = false,
  initialFilters,
} = {}) => {
  const {
    alertCategoryOptions,
    alertManagementOptions,
    departmentOptions,
    filters,
    journeyOptions,
    loadingManagementTypeOptions,
    loadingProductOptions,
    loadingSupplierOptions,
    loadingDepartmentOptions,
    loadingMunicipalityOptions,
    loadingAlertCategoryOptions,
    loadingAlertManagementOptions,
    loadingJourneys,
    managementTypeOptions,
    municipalityOptions,
    productOptions,
    supplierOptions,
    resetFilters,
    updateAlertCategory,
    updateAlertManagement,
    updateCub,
    updateDocumentoTitular,
    updateDepartment,
    updateIdProducto,
    updateManagementType,
    updateMunicipality,
    updateOperationalDay,
    updateOrdenNumero,
    updateProducts,
    updateSupplier,
  } = useAlertedProductsFilters({ initialFilters });

  const isApplyDisabled = !filters.operationalDay?.value || loading;
  const hasIdProducto = Boolean(filters.idProducto?.trim());
  const hasSupplierOrProduct = filters.supplier.length > 0 || filters.products.length > 0;

  const handleApply = () => {
    if (isApplyDisabled) return;
    onApply?.(filters);
  };

  const handleJourneyChange = (value) => {
    updateOperationalDay(value);
    onJourneyChange?.(value);
  };

  const handleReset = () => {
    resetFilters();
    onJourneyChange?.(null);
    onReset?.();
  };

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
            <FilterField label="Jornada" required colProps={FULL_COL}>
              <FiltersSelect
                value={filters.operationalDay}
                options={journeyOptions}
                onChange={handleJourneyChange}
                placeholder="Selecciona una jornada"
                isLoading={loadingJourneys}
                isClearable
                showSearch={false}
              />
            </FilterField>

            <FilterField label="Categoría de alerta">
              <FiltersSelect
                value={filters.alertCategory}
                options={alertCategoryOptions}
                onChange={updateAlertCategory}
                placeholder="Selecciona una categoría"
                showSearch={false}
                isClearable
                isLoading={loadingAlertCategoryOptions}
              />
            </FilterField>

            <FilterField label="Tipo de gestión">
              <FiltersSelect
                value={filters.managementType}
                options={managementTypeOptions}
                onChange={updateManagementType}
                placeholder="Selecciona un tipo"
                showSearch={false}
                isClearable
                isLoading={loadingManagementTypeOptions}
              />
            </FilterField>

            <FilterField label="Gestión de alerta">
              <FiltersSelect
                value={filters.alertManagement}
                options={alertManagementOptions}
                onChange={updateAlertManagement}
                placeholder="Selecciona una gestión"
                showSearch={false}
                isClearable
                isLoading={loadingAlertManagementOptions}
              />
            </FilterField>

            <FilterField label="Documento titular">
              <FiltersInput
                value={filters.documentoTitular}
                onChange={(e) => updateDocumentoTitular(e.target.value)}
                placeholder="Nº documento del titular"
                allowClear
              />
            </FilterField>

            <FilterField label="CUB">
              <FiltersInput
                value={filters.cub}
                onChange={(e) => updateCub(e.target.value)}
                placeholder="Código único de beneficiario"
                allowClear
              />
            </FilterField>

            <FilterField label="N° de orden">
              <FiltersInput
                value={filters.ordenNumero}
                onChange={(e) => updateOrdenNumero(e.target.value)}
                placeholder="Número de orden"
                allowClear
              />
            </FilterField>

            <FilterField label="Departamento">
              <FiltersSelect
                value={filters.department}
                options={departmentOptions}
                onChange={updateDepartment}
                placeholder="Selecciona un departamento"
                showSearch={false}
                isClearable
                isLoading={loadingDepartmentOptions}
              />
            </FilterField>

            <FilterField label="Municipio">
              <FiltersSelect
                value={filters.municipality}
                options={municipalityOptions}
                onChange={updateMunicipality}
                placeholder="Selecciona un municipio"
                showSearch={false}
                isClearable
                isLoading={loadingMunicipalityOptions}
                isDisabled={!filters.department?.value}
              />
            </FilterField>

            <FilterField label="ID jornada producto">
              <FiltersInput
                value={filters.idProducto}
                onChange={(e) => updateIdProducto(e.target.value)}
                placeholder="Identificador del producto"
                allowClear
                disabled={hasSupplierOrProduct}
              />
            </FilterField>

            <FilterField label="Proveedor" colProps={FULL_COL}>
              <FiltersMultiSelect
                mode="multiple"
                value={filters.supplier.map((s) => s.value)}
                options={supplierOptions}
                onChange={(_, options) => updateSupplier(Array.isArray(options) ? options : [])}
                placeholder="Proveedor (nombre o NIT)"
                filterOption={matchesSupplierSelectOption}
                allowClear
                loading={loadingSupplierOptions}
                disabled={hasIdProducto}
              />
            </FilterField>

            <FilterField label="Producto" colProps={FULL_COL}>
              <FiltersMultiSelect
                mode="multiple"
                value={filters.products.map((product) => product.value)}
                options={productOptions}
                onChange={(_, options) => updateProducts(Array.isArray(options) ? options : [])}
                placeholder="Selecciona uno o varios productos"
                loading={loadingProductOptions}
                allowClear
                disabled={hasIdProducto || !filters.operationalDay?.value}
              />
            </FilterField>
          </FiltersGrid>

          <FiltersActions>
            <PrimaryFilterButton
              icon={<SearchOutlined />}
              onClick={handleApply}
              disabled={isApplyDisabled}
            >
              Aplicar filtros
            </PrimaryFilterButton>
            <SecondaryFilterButton onClick={handleReset} disabled={loading}>
              Limpiar búsqueda
            </SecondaryFilterButton>
          </FiltersActions>
        </FiltersForm>
      </FiltersRoot>
    </FiltersCard>
  );
};