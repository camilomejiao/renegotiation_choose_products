import { useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

import imgPeople from "../../../assets/image/addProducts/people1.jpg";
import { HeaderImage } from "../../../components/layout/shared/header_image/HeaderImage";
import { PageNotFound } from "../../../components/layout/page404/PageNotFound";
import AlertComponent from "../../../helpers/alert/AlertComponent";
import { RolesEnum } from "../../../helpers/GlobalEnum";
import { getAlertedProductsJourneyDocuments } from "../api/alertedProductsDocumentsApi";
import {
  assignAlertedProductsManagementType,
  getAlertedProductsPage,
} from "../api/alertedProductsTableApi";
import { AlertedProductsCentralizationWidget } from "../../../widgets/alerted-products-centralization";
import { Page } from "../../../shared/ui/page";
import { AlertedProductsDocumentsWidget } from "../../../widgets/alerted-products-documents";
import { AppStepper } from "../../../shared/ui/stepper";
import { AlertedProductsFiltersWidget } from "../../../widgets/alerted-products-filters";
import { AlertedProductsManagementWidget } from "../../../widgets/alerted-products-management";
import { AlertedProductsTableWidget } from "../../../widgets/alerted-products-table";
import { alertedProductsSteps } from "../model/alertedProductsSteps";
import { useAlertedProductsFlow } from "../model/useAlertedProductsFlow";
import {
  AlertedProductsContentGrid,
  ContentSection,
  HeaderSection,
  AlertedProductsMainContent,
  AlertedProductsPageWrapper,
  AlertedProductsSidebar,
  AlertedProductsStepperCard,
  StyledDivider,
} from "./AlertedProductsPage.styles";

const allowedRoles = [
  RolesEnum.TECHNICAL,
  RolesEnum.SUPERVISION,
  RolesEnum.ADMINISTRATIVA,
];

export const AlertedProductsPage = () => {
  const { userAuth } = useOutletContext();
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [selectedJourney, setSelectedJourney] = useState(null);
  const [tableDataSource, setTableDataSource] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [assigningManagementType, setAssigningManagementType] = useState(false);
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

  const reloadAlertedProductsTable = async (filtersToApply) => {
    const productsResult = await getAlertedProductsPage(filtersToApply);
    setTableDataSource(productsResult.rows);
    return productsResult;
  };

  const handleApplyFilters = async (nextFilters) => {
    if (!nextFilters?.operationalDay?.value) {
      return;
    }

    setTableLoading(true);
    setAppliedFilters(nextFilters);

    const [productsResult, documentsResult] = await Promise.allSettled([
      reloadAlertedProductsTable(nextFilters),
      getAlertedProductsJourneyDocuments(nextFilters.operationalDay.value),
    ]);

    if (productsResult.status === "fulfilled") {
    } else {
      setTableDataSource([]);
      AlertComponent.error("Error", "No fue posible cargar los productos alertados");
    }

    if (documentsResult.status === "fulfilled") {
      setHistoryByCategory(documentsResult.value.historyByCategory);
    } else {
      setHistoryByCategory({ pdf: [], excel: [] });
      AlertComponent.error("Error", "No fue posible cargar el historial de documentos");
    }

    setTableLoading(false);
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
    setHistoryByCategory({ pdf: [], excel: [] });
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

  const handleAssignManagementType = async ({
    managementTypeId,
    selectedRows,
  }) => {
    if (!appliedFilters) {
      return;
    }

    setAssigningManagementType(true);

    try {
      const response = await assignAlertedProductsManagementType({
        managementTypeId,
        selectedRows,
      });

      await reloadAlertedProductsTable(appliedFilters);

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
    } finally {
      setAssigningManagementType(false);
    }
  };

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
          <AlertedProductsStepperCard bordered={false}>
            <AppStepper items={alertedProductsSteps} currentStep={currentStep} />
          </AlertedProductsStepperCard>

          {currentStep === 0 ? (
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
                    assigningManagementType={assigningManagementType}
                    loading={tableLoading}
                    onAssignManagementType={handleAssignManagementType}
                    onRaiseAlert={handleRaiseAlertWithValidation}
                  />
                ) : null}
              </AlertedProductsMainContent>
            </AlertedProductsContentGrid>
          ) : null}

          {currentStep === 1 ? (
            <AlertedProductsManagementWidget
              assignment={assignment}
              appliedFilters={appliedFilters}
              historyByCategory={historyByCategory}
              onBack={goToPreparation}
              onContinue={goToCentralization}
            />
          ) : null}

          {currentStep === 2 ? (
            <AlertedProductsCentralizationWidget
              assignment={assignment}
              onBack={goToManagement}
            />
          ) : null}
        </AlertedProductsPageWrapper>
      </ContentSection>
    </Page>
  );
};
