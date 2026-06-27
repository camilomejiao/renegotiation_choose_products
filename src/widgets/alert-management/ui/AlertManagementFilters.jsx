import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import {
  FiltersActions, FiltersCard, FiltersCol, FiltersFieldGroup, FiltersFieldLabel,
  FiltersForm, FiltersGrid, FiltersHeader, FiltersHeaderIcon, FiltersRoot,
  FiltersSelect, FiltersTitle, PrimaryFilterButton, SecondaryFilterButton,
} from "./filters.styles";

export const AlertManagementFilters = ({
  draftFilters, journeyOptions, alertCategoryOptions, alertManagementOptions,
  loadingJourneys, loadingAlertCategory, loadingAlertManagement,
  updateDraft, onSearch, onClear, searchDisabled,
}) => (
  <FiltersCard bordered={false}>
    <FiltersRoot>
      <FiltersHeader>
        <FiltersHeaderIcon><FilterOutlined /></FiltersHeaderIcon>
        <FiltersTitle>Filtros de búsqueda</FiltersTitle>
      </FiltersHeader>
      <FiltersForm>
        <FiltersGrid gutter={[16, 16]}>
          <FiltersCol xs={24} sm={12} lg={8}>
            <FiltersFieldGroup>
              <FiltersFieldLabel>Jornada</FiltersFieldLabel>
              <FiltersSelect value={draftFilters.operationalDay} options={journeyOptions}
                onChange={updateDraft("operationalDay")} placeholder="Selecciona una jornada"
                isLoading={loadingJourneys} isClearable showSearch={false} />
            </FiltersFieldGroup>
          </FiltersCol>
          <FiltersCol xs={24} sm={12} lg={8}>
            <FiltersFieldGroup>
              <FiltersFieldLabel>Categoría de alerta</FiltersFieldLabel>
              <FiltersSelect value={draftFilters.alertCategory} options={alertCategoryOptions}
                onChange={updateDraft("alertCategory")} placeholder="Selecciona una categoría"
                showSearch={false} isClearable isLoading={loadingAlertCategory} />
            </FiltersFieldGroup>
          </FiltersCol>
          <FiltersCol xs={24} sm={12} lg={8}>
            <FiltersFieldGroup>
              <FiltersFieldLabel>Gestión de alerta</FiltersFieldLabel>
              <FiltersSelect value={draftFilters.alertManagement} options={alertManagementOptions}
                onChange={updateDraft("alertManagement")} placeholder="Selecciona una gestión"
                showSearch={false} isClearable isLoading={loadingAlertManagement} />
            </FiltersFieldGroup>
          </FiltersCol>
        </FiltersGrid>
        <FiltersActions>
          <SecondaryFilterButton onClick={onClear} disabled={searchDisabled}>Limpiar</SecondaryFilterButton>
          <PrimaryFilterButton icon={<SearchOutlined />} onClick={onSearch} disabled={searchDisabled}>Buscar</PrimaryFilterButton>
        </FiltersActions>
      </FiltersForm>
    </FiltersRoot>
  </FiltersCard>
);