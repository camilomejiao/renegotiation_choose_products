import { useEffect, useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

import imgPeople from "../../../assets/image/addProducts/people1.jpg";
import { HeaderImage } from "../../../components/layout/shared/header_image/HeaderImage";
import { PageNotFound } from "../../../components/layout/page404/PageNotFound";
import AlertComponent from "../../../helpers/alert/AlertComponent";
import { RolesEnum } from "../../../helpers/GlobalEnum";
import { Page } from "../../../shared/ui/page";
import { AppTabs } from "../../../shared/ui/tabs";
import { AlertedProductsCentralizationWidget } from "../../../widgets/alerted-products-centralization";
import { AlertedProductsDocumentsWidget } from "../../../widgets/alerted-products-documents";
import { AlertedProductsFiltersWidget } from "../../../widgets/alerted-products-filters";
import { AlertedProductsManagementWidget } from "../../../widgets/alerted-products-management";
import { AlertedProductsTableWidget } from "../../../widgets/alerted-products-table";
import { AlertManagementWidget } from "../../../widgets/alert-management";
import { useAlertedProductsFlow } from "../model/useAlertedProductsFlow";
import { useAlertedProductsData } from "../model/useAlertedProductsData";
import { useManagementRequestSubmit } from "../model/useManagementRequestSubmit";
import { resolveManagementView } from "../model/managementView";
import { UnderConstructionCard } from "./UnderConstructionCard";
import {
  AlertedProductsContentGrid,
  ContentSection,
  HeaderSection,
  AlertedProductsMainContent,
  AlertedProductsPageWrapper,
  AlertedProductsSidebar,
  StyledDivider,
} from "./AlertedProductsPage.styles";

const allowedRoles = [
  RolesEnum.ADMIN,
  RolesEnum.TECHNICAL,
  RolesEnum.SUPERVISION,
  RolesEnum.ADMINISTRATIVA,
];

const ALERTED_PRODUCTS_TAB_KEY = "alerted-products";
const ALERT_MANAGEMENT_TAB_KEY = "alert-management";
const CENTRALIZATION_TAB_KEY = "centralization";
const TABLE_EMPTY_TEXT = "No hay productos alertados para los filtros aplicados.";

export const AlertedProductsPage = () => {
  const { userAuth } = useOutletContext();
  const hasRestrictedTabs = [RolesEnum.ADMINISTRATIVA, RolesEnum.SUPERVISION].includes(
    userAuth?.rol_id
  );
  const [activeTab, setActiveTab] = useState(
    hasRestrictedTabs ? ALERT_MANAGEMENT_TAB_KEY : ALERTED_PRODUCTS_TAB_KEY
  );

  const data = useAlertedProductsData();
  const { assignment, currentStep, goToManagement, goToPreparation, handleRaiseAlert } =
    useAlertedProductsFlow();
  const submitManagementRequest = useManagementRequestSubmit({
    appliedFilters: data.appliedFilters,
    onManagementSuccess: data.triggerRefresh,
  });

  useEffect(() => {
    if (hasRestrictedTabs && activeTab === ALERTED_PRODUCTS_TAB_KEY) {
      setActiveTab(ALERT_MANAGEMENT_TAB_KEY);
    }
  }, [activeTab, hasRestrictedTabs]);

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

  const { shouldUseCurrentView, variant } = resolveManagementView(assignment);
  const shouldShowTable = data.tableLoading || Boolean(data.appliedFilters);

  const handleRaiseAlertWithValidation = (nextAssignment) => {
    const hasPdf = data.historyByCategory.pdf.length > 0;
    const hasExcel = data.historyByCategory.excel.length > 0;

    if (!hasPdf || !hasExcel) {
      AlertComponent.warning(
        "Documentos requeridos",
        "La jornada no presenta documentos asociados aún. Para continuar con el levantamiento de la alerta, es necesario adjuntar un archivo PDF y un archivo Excel en la sección de documentos."
      );
      return;
    }

    // INDETERMINADO crea un producto nuevo por solicitud: solo admite un ítem.
    const isIndeterminate = (nextAssignment?.managementType || "")
      .trim()
      .toUpperCase()
      .includes("INDETERMINADO");
    if (isIndeterminate && (nextAssignment?.selectedRows?.length ?? 0) !== 1) {
      AlertComponent.warning(
        "Selección no válida",
        "El tipo de gestión INDETERMINADO requiere seleccionar un único producto."
      );
      return;
    }

    handleRaiseAlert(nextAssignment);
  };

  const handleGoToManagement = () => {
    goToManagement();
    setActiveTab(ALERTED_PRODUCTS_TAB_KEY);
  };

  const handleSubmitSuccess = () => {
    goToPreparation();
    setActiveTab(ALERT_MANAGEMENT_TAB_KEY);
  };

  const handleTabChange = (nextTab) => {
    if (
      hasRestrictedTabs &&
      ![ALERT_MANAGEMENT_TAB_KEY, CENTRALIZATION_TAB_KEY].includes(nextTab)
    ) {
      return;
    }

    setActiveTab(nextTab);

    if (nextTab === ALERTED_PRODUCTS_TAB_KEY && currentStep === 2) {
      goToManagement();
    }
  };

  const managementTabContent =
    currentStep === 1 ? (
      shouldUseCurrentView ? (
        <AlertedProductsManagementWidget
          assignment={assignment}
          appliedFilters={data.appliedFilters}
          historyByCategory={data.historyByCategory}
          managementTypeOptions={data.managementTypeOptions}
          variant={variant}
          onBack={goToPreparation}
          onContinue={handleSubmitSuccess}
          onSubmitManagementRequest={submitManagementRequest}
        />
      ) : (
        <UnderConstructionCard
          managementType={assignment?.managementType}
          onBack={goToPreparation}
        />
      )
    ) : (
      <AlertedProductsContentGrid>
        <AlertedProductsSidebar>
          <AlertedProductsDocumentsWidget
            historyByCategory={data.historyByCategory}
            journey={data.selectedJourney}
            onDocumentsSaved={data.reloadJourneyDocuments}
          />
        </AlertedProductsSidebar>

        <AlertedProductsMainContent>
          <AlertedProductsFiltersWidget
            loading={data.tableLoading}
            onApply={data.applyFilters}
            onReset={data.resetFilters}
            onJourneyChange={data.changeJourney}
            initialFilters={data.appliedFilters}
          />
          {shouldShowTable ? (
            <AlertedProductsTableWidget
              dataSource={data.tableDataSource}
              emptyText={TABLE_EMPTY_TEXT}
              loading={data.tableLoading}
              onRaiseAlert={handleRaiseAlertWithValidation}
              totalRecords={data.totalRecords}
              currentPage={data.currentPage}
              pageSize={data.pageSize}
              onPageChange={data.changePage}
              managementTypeOptions={data.managementTypeOptions}
              alertCategoryOptions={data.alertCategoryOptions}
              alertManagementOptions={data.alertManagementOptions}
              searchValue={data.searchValue}
              onSearchChange={data.setSearchValue}
            />
          ) : null}
        </AlertedProductsMainContent>
      </AlertedProductsContentGrid>
    );

  const tabItems = [
    !hasRestrictedTabs
      ? {
          key: ALERTED_PRODUCTS_TAB_KEY,
          label: "Productos alertados",
          children: managementTabContent,
        }
      : null,
    {
      key: ALERT_MANAGEMENT_TAB_KEY,
      label: "Gestión de alertas",
      children: <AlertManagementWidget userAuth={userAuth} />,
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
  ].filter(Boolean);

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
              items: tabItems,
            }}
          />
        </AlertedProductsPageWrapper>
      </ContentSection>
    </Page>
  );
};