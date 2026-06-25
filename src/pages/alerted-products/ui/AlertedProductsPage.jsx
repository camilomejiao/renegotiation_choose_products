import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

import imgPeople from "../../../assets/image/addProducts/people1.jpg";
import { HeaderImage } from "../../../components/layout/shared/header_image/HeaderImage";
import { PageNotFound } from "../../../components/layout/page404/PageNotFound";
import AlertComponent from "../../../helpers/alert/AlertComponent";
import { RolesEnum } from "../../../helpers/GlobalEnum";
import { getAlertedProductsJourneyDocuments } from "../api/alertedProductsDocumentsApi";
import { getAlertedProductsParameterCatalog } from "../api/alertedProductsFiltersApi";
import {
  assignAlertedProductsManagementType,
  getAlertedProductsPage,
} from "../api/alertedProductsTableApi";
import { AlertedProductsCentralizationWidget } from "../../../widgets/alerted-products-centralization";
import { Page } from "../../../shared/ui/page";
import { AlertedProductsDocumentsWidget } from "../../../widgets/alerted-products-documents";
import { AppTabs } from "../../../shared/ui/tabs";
import { AlertedProductsFiltersWidget } from "../../../widgets/alerted-products-filters";
import { AlertedProductsManagementWidget } from "../../../widgets/alerted-products-management";
import { AlertedProductsTableWidget } from "../../../widgets/alerted-products-table";
import { useAlertedProductsFlow } from "../model/useAlertedProductsFlow";
import {
  AlertedProductsContentGrid,
  ContentSection,
  HeaderSection,
  AlertedProductsMainContent,
  AlertedProductsPlaceholderCard,
  AlertedProductsPageWrapper,
  AlertedProductsSidebar,
  StyledDivider,
} from "./AlertedProductsPage.styles";

const allowedRoles = [
  RolesEnum.TECHNICAL,
  RolesEnum.SUPERVISION,
  RolesEnum.ADMINISTRATIVA,
];

const ALERTED_PRODUCTS_TAB_KEY = "alerted-products";
const ALERT_MANAGEMENT_TAB_KEY = "alert-management";
const CENTRALIZATION_TAB_KEY = "centralization";

export const AlertedProductsPage = () => {
  const { userAuth } = useOutletContext();
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [selectedJourney, setSelectedJourney] = useState(null);
  const [tableDataSource, setTableDataSource] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const searchDebounceRef = useRef(null);
  const [activeTab, setActiveTab] = useState(ALERTED_PRODUCTS_TAB_KEY);
  const [managementTypeOptions, setManagementTypeOptions] = useState([]);
  const [alertCategoryOptions, setAlertCategoryOptions] = useState([]);
  const [alertManagementOptions, setAlertManagementOptions] = useState([]);

  useEffect(() => {
    getAlertedProductsParameterCatalog(39)
      .then((options) =>
        setManagementTypeOptions(
          options.filter(
            (o) => o.label?.trim().toLowerCase() !== "sin tipo de gestión"
          )
        )
      )
      .catch(() => setManagementTypeOptions([]));
    getAlertedProductsParameterCatalog(35)
      .then(setAlertCategoryOptions)
      .catch(() => setAlertCategoryOptions([]));
    getAlertedProductsParameterCatalog(36)
      .then(setAlertManagementOptions)
      .catch(() => setAlertManagementOptions([]));
  }, []);

  useEffect(() => {
    clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setDebouncedSearch(searchValue);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(searchDebounceRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  useEffect(() => {
    if (!appliedFilters) return;

    const fetchTable = async () => {
      setTableLoading(true);
      try {
        const productsResult = await getAlertedProductsPage({
          ...appliedFilters,
          search: debouncedSearch,
          page: currentPage,
          pageSize,
        });
        setTableDataSource(productsResult.rows);
        setTotalRecords(productsResult.meta?.total_registros ?? 0);
      } catch {
        setTableDataSource([]);
        AlertComponent.error("Error", "No fue posible cargar los productos alertados");
      } finally {
        setTableLoading(false);
      }
    };

    fetchTable();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedFilters, currentPage, pageSize, refreshKey, debouncedSearch]);

  const [historyByCategory, setHistoryByCategory] = useState({
    pdf: [],
    excel: [],
  });
  const {
    assignment,
    currentStep,
    goToCentralization,
    goToManagement,
    goToPreparation,
    handleRaiseAlert,
  } = useAlertedProductsFlow();

  const pageHeader = useMemo(
    () => ({
      title: "Productos Alertados",
      breadcrumbs: [
        { title: <Link to="/admin">Inicio</Link> },
        { title: "Productos Alertados" },
      ],
    }),
    []
  );

  if (!allowedRoles.includes(userAuth?.rol_id)) {
    return <PageNotFound />;
  }

  const shouldShowTable = tableLoading || Boolean(appliedFilters);
  const tableEmptyText = "No hay productos alertados para los filtros aplicados.";

  const handleApplyFilters = async (nextFilters) => {
    if (!nextFilters?.operationalDay?.value) {
      return;
    }

    setAppliedFilters(nextFilters);
    setCurrentPage(1);

    try {
      const documentsResult = await getAlertedProductsJourneyDocuments(nextFilters.operationalDay.value);
      setHistoryByCategory(documentsResult.historyByCategory);
    } catch {
      setHistoryByCategory({ pdf: [], excel: [] });
      AlertComponent.error("Error", "No fue posible cargar el historial de documentos");
    }
  };

  const handleJourneyChange = async (journey) => {
    setSelectedJourney(journey);
    if (!journey?.value) {
      setHistoryByCategory({ pdf: [], excel: [] });
      return;
    }
    try {
      const documentsResult = await getAlertedProductsJourneyDocuments(journey.value);
      setHistoryByCategory(documentsResult.historyByCategory);
    } catch {
      setHistoryByCategory({ pdf: [], excel: [] });
    }
  };

  const handleResetFilters = () => {
    setAppliedFilters(null);
    setTableDataSource([]);
    setTotalRecords(0);
    setCurrentPage(1);
    setHistoryByCategory({ pdf: [], excel: [] });
    setSearchValue("");
    setDebouncedSearch("");
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const reloadJourneyDocuments = async (journeyId) => {
    const documentsResult = await getAlertedProductsJourneyDocuments(journeyId);
    setHistoryByCategory(documentsResult.historyByCategory);
  };

  const handleRaiseAlertWithValidation = (nextAssignment) => {
    const hasPdf = historyByCategory.pdf.length > 0;
    const hasExcel = historyByCategory.excel.length > 0;

    if (!hasPdf || !hasExcel) {
      AlertComponent.warning(
        "Documentos requeridos",
        "La jornada no presenta documentos asociados aún. Para continuar con el levantamiento de la alerta, es necesario adjuntar un archivo PDF y un archivo Excel en la sección de documentos."
      );
      return;
    }

    handleRaiseAlert(nextAssignment);
  };

  const handleSubmitManagementRequest = async ({
    managementTypeId,
    selectedRows,
  }) => {
    if (!appliedFilters) {
      return;
    }

    try {
      const response = await assignAlertedProductsManagementType({
        managementTypeId,
        selectedRows,
      });

      setRefreshKey((k) => k + 1);

      AlertComponent.success(
        "Tipo de gestión actualizado",
        response?.mensaje || "La actualización se realizó correctamente."
      );
    } catch (error) {
      AlertComponent.error(
        "Error",
        error?.data?.mensaje || "No fue posible actualizar el tipo de gestión."
      );
      throw error;
    }
  };

  const handleGoToCentralization = () => {
    goToCentralization();
    setActiveTab(CENTRALIZATION_TAB_KEY);
  };

  const handleGoToManagement = () => {
    goToManagement();
    setActiveTab(ALERTED_PRODUCTS_TAB_KEY);
  };

  const handleTabChange = (nextTab) => {
    setActiveTab(nextTab);

    if (nextTab === ALERTED_PRODUCTS_TAB_KEY && currentStep === 2) {
      goToManagement();
    }
  };

  const alertedProductsTabContent = currentStep === 1 ? (
    <AlertedProductsManagementWidget
      assignment={assignment}
      appliedFilters={appliedFilters}
      historyByCategory={historyByCategory}
      managementTypeOptions={managementTypeOptions}
      onBack={goToPreparation}
      onContinue={handleGoToCentralization}
      onSubmitManagementRequest={handleSubmitManagementRequest}
    />
  ) : (
    <AlertedProductsContentGrid>
      <AlertedProductsSidebar>
        <AlertedProductsDocumentsWidget
          historyByCategory={historyByCategory}
          journey={selectedJourney}
          onDocumentsSaved={reloadJourneyDocuments}
        />
      </AlertedProductsSidebar>

      <AlertedProductsMainContent>
        <AlertedProductsFiltersWidget
          loading={tableLoading}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
          onJourneyChange={handleJourneyChange}
          initialFilters={appliedFilters}
        />
        {shouldShowTable ? (
          <AlertedProductsTableWidget
            dataSource={tableDataSource}
            emptyText={tableEmptyText}
            loading={tableLoading}
            onRaiseAlert={handleRaiseAlertWithValidation}
            totalRecords={totalRecords}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            managementTypeOptions={managementTypeOptions}
            alertCategoryOptions={alertCategoryOptions}
            alertManagementOptions={alertManagementOptions}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
          />
        ) : null}
      </AlertedProductsMainContent>
    </AlertedProductsContentGrid>
  );

  return (
    <Page showPageHeader header={pageHeader} contentPadding="0" minHeight="auto">
      <HeaderSection>
        <HeaderImage
          imageHeader={imgPeople}
          titleHeader="Ruta de gestión para productos alertados"
        />
      </HeaderSection>

      <ContentSection>
        <StyledDivider />

        <AlertedProductsPageWrapper>
          <AppTabs
            tabsProps={{
              activeKey: activeTab,
              onChange: handleTabChange,
              items: [
                {
                  key: ALERTED_PRODUCTS_TAB_KEY,
                  label: "Productos alertados",
                  children: alertedProductsTabContent,
                },
                {
                  key: ALERT_MANAGEMENT_TAB_KEY,
                  label: "Gestión de alertas",
                  children: (
                    <AlertedProductsPlaceholderCard bordered={false}>
                      Esta pestaña queda disponible para el flujo específico de gestión de alertas.
                    </AlertedProductsPlaceholderCard>
                  ),
                },
                {
                  key: CENTRALIZATION_TAB_KEY,
                  label: "Centralización",
                  children: (
                    <AlertedProductsCentralizationWidget
                      assignment={assignment}
                      onBack={handleGoToManagement}
                    />
                  ),
                },
              ],
            }}
          />
        </AlertedProductsPageWrapper>
      </ContentSection>
    </Page>
  );
};
