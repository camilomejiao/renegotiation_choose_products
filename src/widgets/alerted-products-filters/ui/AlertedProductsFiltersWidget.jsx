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
  FiltersInput,
  FiltersMultiSelect,
  FiltersRoot,
  FiltersSelect,
  FiltersTitle,
  PrimaryFilterButton,
  RequiredMark,
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
    if (isApplyDisabled) {
      return;
    }

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
            <FiltersCol span={24}>
              <FiltersFieldGroup>
                <FiltersFieldLabel>
                  Jornada
                  <RequiredMark>*</RequiredMark>
                </FiltersFieldLabel>
                <FiltersSelect
                  value={filters.operationalDay}
                  options={journeyOptions}
                  onChange={handleJourneyChange}
                  placeholder="Selecciona una jornada"
                  isLoading={loadingJourneys}
                  isClearable={true}
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
                  isClearable={true}
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
                  isClearable={true}
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
                  isClearable={true}
                  isLoading={loadingAlertManagementOptions}
                />
              </FiltersFieldGroup>
            </FiltersCol>

            <FiltersCol xs={24} sm={12} lg={8} xl={6}>
              <FiltersFieldGroup>
                <FiltersFieldLabel>Documento titular</FiltersFieldLabel>
                <FiltersInput
                  value={filters.documentoTitular}
                  onChange={(e) => updateDocumentoTitular(e.target.value)}
                  placeholder="Nº documento del titular"
                  allowClear
                />
              </FiltersFieldGroup>
            </FiltersCol>

            <FiltersCol xs={24} sm={12} lg={8} xl={6}>
              <FiltersFieldGroup>
                <FiltersFieldLabel>CUB</FiltersFieldLabel>
                <FiltersInput
                  value={filters.cub}
                  onChange={(e) => updateCub(e.target.value)}
                  placeholder="Código único de beneficiario"
                  allowClear
                />
              </FiltersFieldGroup>
            </FiltersCol>

            <FiltersCol xs={24} sm={12} lg={8} xl={6}>
              <FiltersFieldGroup>
                <FiltersFieldLabel>N° de orden</FiltersFieldLabel>
                <FiltersInput
                  value={filters.ordenNumero}
                  onChange={(e) => updateOrdenNumero(e.target.value)}
                  placeholder="Número de orden"
                  allowClear
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
                  isClearable={true}
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
                  isClearable={true}
                  isLoading={loadingMunicipalityOptions}
                  isDisabled={!filters.department?.value}
                />
              </FiltersFieldGroup>
            </FiltersCol>

            <FiltersCol xs={24} sm={12} lg={8} xl={6}>
              <FiltersFieldGroup>
                <FiltersFieldLabel>ID producto</FiltersFieldLabel>
                <FiltersInput
                  value={filters.idProducto}
                  onChange={(e) => updateIdProducto(e.target.value)}
                  placeholder="Identificador del producto"
                  allowClear
                  disabled={hasSupplierOrProduct}
                />
              </FiltersFieldGroup>
            </FiltersCol>

            <FiltersCol xs={24} sm={12} lg={8} xl={6}>
              <FiltersFieldGroup>
                <FiltersFieldLabel>Proveedor</FiltersFieldLabel>
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
                  allowClear
                  disabled={hasIdProducto}
                />
              </FiltersFieldGroup>
            </FiltersCol>
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
