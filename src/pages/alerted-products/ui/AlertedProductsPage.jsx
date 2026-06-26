import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { Card } from "antd";

import imgPeople from "../../../assets/image/addProducts/people1.jpg";
import { HeaderImage } from "../../../components/layout/shared/header_image/HeaderImage";
import { PageNotFound } from "../../../components/layout/page404/PageNotFound";
import AlertComponent from "../../../helpers/alert/AlertComponent";
import { RolesEnum } from "../../../helpers/GlobalEnum";
import { getAlertedProductsJourneyDocuments } from "../api/alertedProductsDocumentsApi";
import { getAlertedProductsParameterCatalog } from "../api/alertedProductsFiltersApi";
import {
  assignAlertedProductsManagementType,
  createAlertedProductsRequest,
  getAlertedProductsPage,
} from "../api/alertedProductsTableApi";
import { AlertedProductsCentralizationWidget } from "../../../widgets/alerted-products-centralization";
import { Page } from "../../../shared/ui/page";
import { AlertedProductsDocumentsWidget } from "../../../widgets/alerted-products-documents";
import { AppTabs } from "../../../shared/ui/tabs";
import { AlertedProductsFiltersWidget } from "../../../widgets/alerted-products-filters";
import { AlertedProductsManagementWidget } from "../../../widgets/alerted-products-management";
import { AlertedProductsTableWidget } from "../../../widgets/alerted-products-table";
import { AlertManagementWidget } from "../../../widgets/alert-management";
import { useAlertedProductsFlow } from "../model/useAlertedProductsFlow";
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
  RolesEnum.TECHNICAL,
  RolesEnum.SUPERVISION,
  RolesEnum.ADMINISTRATIVA,
];

const ALERTED_PRODUCTS_TAB_KEY = "alerted-products";
const ALERT_MANAGEMENT_TAB_KEY = "alert-management";
const CENTRALIZATION_TAB_KEY = "centralization";
const SUPPORTED_MANAGEMENT_VIEW_CODES = new Set([5275, 5272]);

const normalizeManagementLabel = (value = "") =>
  String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toUpperCase();

const SUPPORTED_MANAGEMENT_VIEW_LABELS = new Set([
  "ACTA COMPLEMENTARIA",
  "JUSTIFICACION TECNICA",
]);

const MANAGEMENT_ERROR_MESSAGES = {
  SOLICITUD_INVALIDA: "Se requieren tipo_gestion_id y al menos un producto.",
  PRODUCTOS_NO_ENCONTRADOS:
    "Uno o más productos no existen o no pertenecen a la jornada consultada.",
  CAMBIO_GESTION_NO_PERMITIDO:
    "El cambio de tipo de gestión no está permitido para uno o más productos.",
  ERROR_INTERNO: "Ocurrió un error inesperado al actualizar el tipo de gestión.",
};

const REQUEST_ERROR_MESSAGES = {
  SOLICITUD_INVALIDA: "Se requieren orden_detalle_id, observacion y pdf.",
  ORDEN_DETALLE_NO_ENCONTRADO:
    "No existen items alertados asociados a los identificadores enviados.",
  DOCUMENTO_YA_REGISTRADO:
    "Ya existe una solicitud registrada para uno o más items enviados.",
  ARCHIVO_DEMASIADO_GRANDE: "El archivo PDF supera el tamaño máximo permitido.",
  TIPO_ARCHIVO_NO_SOPORTADO: "El archivo pdf no tiene un content-type permitido.",
  ARCHIVO_INVALIDO:
    "El archivo PDF está corrupto o no corresponde a los items indicados.",
  ERROR_INTERNO: "No se pudo registrar la solicitud.",
};

const buildServiceResult = (label, response, fallbackMessages) => {
  const code = response?.data?.codigo || null;
  const message =
    response?.data?.mensaje ||
    (code ? fallbackMessages[code] : null) ||
    (response?.status === 404
      ? "El endpoint aún no está disponible en el backend."
      : "Ocurrió un error inesperado al procesar la solicitud.");

  return {
    label,
    ok: false,
    status: response?.status ?? null,
    code,
    message,
  };
};

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
  const assignmentManagementTypeCode = assignment?.selectedRows?.[0]?.managementTypeCode;
  const shouldUseCurrentManagementView =
    SUPPORTED_MANAGEMENT_VIEW_CODES.has(Number(assignmentManagementTypeCode)) ||
    SUPPORTED_MANAGEMENT_VIEW_LABELS.has(
      normalizeManagementLabel(assignment?.managementType)
    );

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
    observation,
    pdf,
    selectedRows,
  }) => {
    if (!appliedFilters) {
      return;
    }

    const result = {
      management: null,
      request: null,
      success: false,
    };

    try {
      const managementResponse = await assignAlertedProductsManagementType({
        managementTypeId,
        selectedRows,
      });

      setRefreshKey((k) => k + 1);
      result.management = {
        label: "Gestión de alertas",
        ok: true,
        status: 200,
        code: null,
        message:
          managementResponse?.mensaje || "Tipo de gestión actualizado correctamente.",
      };
    } catch (error) {
      result.management = buildServiceResult(
        "Gestión de alertas",
        error,
        MANAGEMENT_ERROR_MESSAGES
      );
    }

    try {
      const requestResponse = await createAlertedProductsRequest({
        observation,
        pdf,
        selectedRows,
      });

      result.request = {
        label: "Solicitud documental",
        ok: true,
        status: 201,
        code: null,
        message: requestResponse?.mensaje || "Solicitud creada correctamente.",
      };
    } catch (error) {
      result.request = buildServiceResult(
        "Solicitud documental",
        error,
        REQUEST_ERROR_MESSAGES
      );
    }

    result.success = Boolean(result.management?.ok && result.request?.ok);

    return result;
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
    shouldUseCurrentManagementView ? (
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
      <Card
        bordered={false}
        style={{
          borderRadius: 20,
          border: "1px solid #dbe4f0",
          boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
        }}
        bodyStyle={{ padding: 24 }}
      >
        <div style={{ display: "grid", gap: 10 }}>
          <h3 style={{ margin: 0, color: "#0f172a", fontSize: "1rem", fontWeight: 800 }}>
            Vista en construcción
          </h3>
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>
            El flujo para el tipo de gestión{" "}
            <strong>{assignment?.managementType || "seleccionado"}</strong> tendrá
            una vista diferente. Por ahora solo están habilitadas las vistas de
            <strong> Acta complementaria</strong> y <strong>Justificación técnica</strong>.
          </p>
          <div>
            <button
              type="button"
              onClick={goToPreparation}
              style={{
                height: 42,
                minWidth: 120,
                borderRadius: 12,
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                color: "#334155",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Volver
            </button>
          </div>
        </div>
      </Card>
    )
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
              ],
            }}
          />
        </AlertedProductsPageWrapper>
      </ContentSection>
    </Page>
  );
};
