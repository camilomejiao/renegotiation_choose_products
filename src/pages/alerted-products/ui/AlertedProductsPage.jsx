import { useMemo } from "react";
import { Link, useOutletContext } from "react-router-dom";

import imgPeople from "../../../assets/image/addProducts/people1.jpg";
import { HeaderImage } from "../../../components/layout/shared/header_image/HeaderImage";
import { PageNotFound } from "../../../components/layout/page404/PageNotFound";
import { RolesEnum } from "../../../helpers/GlobalEnum";
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
                <AlertedProductsDocumentsWidget currentUser={userAuth} />
              </AlertedProductsSidebar>

              <AlertedProductsMainContent>
                <AlertedProductsFiltersWidget />
                <AlertedProductsTableWidget onRaiseAlert={handleRaiseAlert} />
              </AlertedProductsMainContent>
            </AlertedProductsContentGrid>
          ) : null}

          {currentStep === 1 ? (
            <AlertedProductsManagementWidget
              assignment={assignment}
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
