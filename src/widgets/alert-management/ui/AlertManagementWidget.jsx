import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DownloadOutlined,
  EyeOutlined,
  FilterOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import AlertComponent from "../../../helpers/alert/AlertComponent";
import { RolesEnum } from "../../../helpers/GlobalEnum";
import { getAlertedProductsSolicitudes } from "../../../pages/alerted-products/api/alertedProductsSolicitudesApi";
import {
  getAlertedProductsJourneys,
  getAlertedProductsParameterCatalog,
} from "../../../pages/alerted-products/api/alertedProductsFiltersApi";
import { Modal } from "../../../shared/ui/modal";
import { SmartTable } from "../../../shared/ui/smart-table";
import { StatusPill } from "../../../shared/ui/status-pill";
import {
  ActionsCell,
  DetailBackButton,
  DetailDocActions,
  DetailDocButton,
  DetailDocInfo,
  DetailDocItem,
  DetailDocMeta,
  DetailDocName,
  DetailDocsList,
  DetailGrid,
  DetailMetaCard,
  DetailMetaLabel,
  DetailMetaValue,
  DetailObservationBox,
  DetailProductsRow,
  DetailProductsTable,
  DetailProductsTableHead,
  DetailSectionCard,
  DetailSectionTitle,
  DetailTimeline,
  DetailTimelineItem,
  DetailTimelineMeta,
  DetailTimelineTitle,
  DetailTopGrid,
  DetailViewRoot,
  FiltersActions,
  FiltersCard,
  FiltersCol,
  FiltersFieldGroup,
  FiltersFieldLabel,
  FiltersForm,
  FiltersGrid,
  FiltersHeader,
  FiltersHeaderIcon,
  FiltersRoot,
  FiltersSelect,
  FiltersTitle,
  GestionarButton,
  HistorialButton,
  PrimaryFilterButton,
  ReviewActionsRow,
  ReviewFieldLabel,
  ReviewPanel,
  ReviewSubmitButton,
  ReviewSubmitRow,
  ReviewTextArea,
  ReviewUploadBox,
  ReviewUploadInput,
  ReviewUploadText,
  SecondaryFilterButton,
  SubsanarButton,
  TableCard,
  TableContent,
  TableDescription,
  TableHeader,
  TableTitle,
  VerButton,
  WithObservationButton,
  WithoutObservationButton,
  WidgetRoot,
} from "./AlertManagementWidget.styles";

const ALERT_CATEGORY_PARAMETER_TYPE_ID = 35;
const ALERT_MANAGEMENT_PARAMETER_TYPE_ID = 36;
const MANAGEMENT_TYPE_PARAMETER_TYPE_ID = 39;
const EN_SUBSANACION_GESTION_ID = 5260;

const GESTIONAR_ROLES = [RolesEnum.ADMIN, RolesEnum.SUPERVISION, RolesEnum.ADMINISTRATIVA];
const SUBSANAR_ROLES  = [RolesEnum.ADMIN, RolesEnum.TECHNICAL];
const VER_ROLES       = [RolesEnum.ADMIN, RolesEnum.SUPERVISION, RolesEnum.ADMINISTRATIVA, RolesEnum.TECHNICAL];

const PILL_TOKENS = {
  neutral: { background: "#F3F4F6", border: "#D1D5DB", color: "#374151" },
  blue:    { background: "#EEF2FF", border: "#C7D2FE", color: "#1D4ED8" },
  cyan:    { background: "#ECFEFF", border: "#A5F3FC", color: "#0F766E" },
  green:   { background: "#E8F8EE", border: "#B7E4C7", color: "#04995B" },
  amber:   { background: "#FFF4DB", border: "#FCDDA2", color: "#EA580C" },
  orange:  { background: "#FFF1E8", border: "#F9C9A7", color: "#C2410C" },
  red:     { background: "#FEE2E2", border: "#FCA5A5", color: "#991B1B" },
  violet:  { background: "#EDE9FE", border: "#C4B5FD", color: "#5B21B6" },
};

const PILL_TONES = ["blue", "cyan", "amber", "violet", "green", "orange", "red"];

const buildPillMap = (options = []) =>
  Object.fromEntries(options.map((opt, i) => [opt.value, PILL_TONES[i % PILL_TONES.length]]));

const normalizeText = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

const buildManagementPillMap = (options = []) =>
  Object.fromEntries(
    options.map((opt, i) => {
      const normalizedLabel = normalizeText(opt?.label);

      if (normalizedLabel === "en proceso") {
        return [opt.value, "blue"];
      }

      if (normalizedLabel === "en subsanacion") {
        return [opt.value, "amber"];
      }

      if (normalizedLabel === "resuelta" || normalizedLabel === "finalizada") {
        return [opt.value, "green"];
      }

      return [opt.value, PILL_TONES[i % PILL_TONES.length]];
    })
  );

const renderPill = (label, code, pillMap) => {
  const tone = pillMap[code] || "neutral";
  const tokens = PILL_TOKENS[tone];
  return (
    <StatusPill
      backgroundColor={tokens.background}
      borderColor={tokens.border}
      textColor={tokens.color}
      minHeight="28px"
      padding="4px 12px"
      fontSize="12px"
      fontWeight={800}
      uppercase
    >
      {label || "—"}
    </StatusPill>
  );
};

const wrapTitle = (...lines) => (
  <span style={{ display: "inline-block", width: "100%", whiteSpace: "normal", lineHeight: 1.15, textAlign: "center" }}>
    {lines.map((line, i) => <span key={i} style={{ display: "block" }}>{line}</span>)}
  </span>
);

const wrapCell = {
  onCell: () => ({
    style: { whiteSpace: "normal", wordBreak: "break-word", verticalAlign: "top" },
  }),
};

const formatDate = (value) => {
  if (!value) return "—";
  return new Intl.DateTimeFormat("es-CO", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
};

const defaultFilters = {
  operationalDay: null,
  alertCategory: null,
  managementType: null,
  alertManagement: null,
};
const REVIEW_MODE_WITH_OBSERVATION = "with-observation";
const REVIEW_MODE_WITHOUT_OBSERVATION = "without-observation";

const TABLE_SCROLL_X = 1760;

const formatCurrency = (value) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));

export const AlertManagementWidget = ({ userAuth } = {}) => {
  const rolId = userAuth?.rol_id;
  const canGestionar  = GESTIONAR_ROLES.includes(rolId);
  const canSubsanar   = SUBSANAR_ROLES.includes(rolId);
  const canVerHistorial = VER_ROLES.includes(rolId);

  const [journeyOptions, setJourneyOptions] = useState([]);
  const [alertCategoryOptions, setAlertCategoryOptions] = useState([]);
  const [managementTypeOptions, setManagementTypeOptions] = useState([]);
  const [alertManagementOptions, setAlertManagementOptions] = useState([]);
  const [loadingJourneys, setLoadingJourneys] = useState(false);
  const [loadingAlertCategory, setLoadingAlertCategory] = useState(false);
  const [loadingManagementType, setLoadingManagementType] = useState(false);
  const [loadingAlertManagement, setLoadingAlertManagement] = useState(false);

  const [draftFilters, setDraftFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [managingRecord, setManagingRecord] = useState(null);
  const [reviewMode, setReviewMode] = useState(null);
  const [reviewObservation, setReviewObservation] = useState("");
  const [reviewFiles, setReviewFiles] = useState([]);
  const [isConfirmWithoutObservationOpen, setIsConfirmWithoutObservationOpen] = useState(false);

  const loadJourneys = useCallback(async () => {
    setLoadingJourneys(true);
    try {
      const rows = await getAlertedProductsJourneys();
      setJourneyOptions(rows.map((item) => ({ value: item.id, label: item.nombre })));
    } catch {
      setJourneyOptions([]);
    } finally {
      setLoadingJourneys(false);
    }
  }, []);

  const loadAlertCategories = useCallback(async () => {
    setLoadingAlertCategory(true);
    try {
      const opts = await getAlertedProductsParameterCatalog(ALERT_CATEGORY_PARAMETER_TYPE_ID);
      setAlertCategoryOptions(opts);
    } catch {
      setAlertCategoryOptions([]);
    } finally {
      setLoadingAlertCategory(false);
    }
  }, []);

  const loadAlertManagements = useCallback(async () => {
    setLoadingAlertManagement(true);
    try {
      const opts = await getAlertedProductsParameterCatalog(ALERT_MANAGEMENT_PARAMETER_TYPE_ID);
      setAlertManagementOptions(opts);
    } catch {
      setAlertManagementOptions([]);
    } finally {
      setLoadingAlertManagement(false);
    }
  }, []);

  const loadManagementTypes = useCallback(async () => {
    setLoadingManagementType(true);
    try {
      const opts = await getAlertedProductsParameterCatalog(MANAGEMENT_TYPE_PARAMETER_TYPE_ID);
      setManagementTypeOptions(opts);
    } catch {
      setManagementTypeOptions([]);
    } finally {
      setLoadingManagementType(false);
    }
  }, []);

  useEffect(() => {
    loadJourneys();
    loadAlertCategories();
    loadManagementTypes();
    loadAlertManagements();
  }, [loadJourneys, loadAlertCategories, loadManagementTypes, loadAlertManagements]);

  useEffect(() => {
    if (!appliedFilters) return;

    const fetch = async () => {
      setTableLoading(true);
      try {
        const rows = await getAlertedProductsSolicitudes(appliedFilters);
        setDataSource(rows);
      } catch {
        setDataSource([]);
        AlertComponent.error("Error", "No fue posible cargar las gestiones de alertas.");
      } finally {
        setTableLoading(false);
      }
    };

    fetch();
  }, [appliedFilters]);

  const alertCategoryPillMap  = useMemo(() => buildPillMap(alertCategoryOptions),  [alertCategoryOptions]);
  const alertManagementPillMap = useMemo(
    () => buildManagementPillMap(alertManagementOptions),
    [alertManagementOptions]
  );
  const managementDetailDocuments = useMemo(() => {
    if (!managingRecord) return [];

    const journeySlug = String(managingRecord?.jornada || "jornada")
      .replace(/\s+/g, "_")
      .replace(/[^\w-]/g, "");

    return [
      {
        id: "journey-pdf",
        name: `Acta_Mesa_Tecnica_${journeySlug}.pdf`,
        meta: "Documento de jornada vigente",
        actions: ["view", "download"],
      },
      {
        id: "support-pdf",
        name: `Soporte_Solicitud_${journeySlug}.pdf`,
        meta: "Documento soporte de la solicitud",
        actions: ["view", "download"],
      },
    ];
  }, [managingRecord]);

  const managementTimeline = useMemo(() => {
    if (!managingRecord) return [];

    return [
      {
        id: "journey-docs",
        title: "Documentos de jornada asociados",
        meta: `${formatDate(managingRecord?.fechaRegistro)} · Sistema`,
        tone: "blue",
      },
      {
        id: "request-created",
        title: "Solicitud enviada por Implementación",
        meta: `${formatDate(managingRecord?.fechaRegistro)} · ${managingRecord?.rolRevisor || "Implementación"}`,
        tone: "orange",
      },
    ];
  }, [managingRecord]);

  const handleGestionar = useCallback((record) => {
    setManagingRecord(record);
    setReviewMode(null);
    setReviewObservation("");
    setReviewFiles([]);
    setIsConfirmWithoutObservationOpen(false);
  }, []);
  const handleSubsanar   = useCallback((_record) => {}, []);
  const handleVer        = useCallback((_record) => {}, []);
  const handleHistorial  = useCallback((_record) => {}, []);

  const handleBackToTable = useCallback(() => {
    setManagingRecord(null);
    setReviewMode(null);
    setReviewObservation("");
    setReviewFiles([]);
    setIsConfirmWithoutObservationOpen(false);
  }, []);

  const handleSelectWithObservation = useCallback(() => {
    setReviewMode(REVIEW_MODE_WITH_OBSERVATION);
    if (reviewObservation === "Sin observación") {
      setReviewObservation("");
    }
  }, [reviewObservation]);

  const handleSelectWithoutObservation = useCallback(() => {
    setReviewMode(REVIEW_MODE_WITHOUT_OBSERVATION);
    setReviewObservation("Sin observación");
    setIsConfirmWithoutObservationOpen(true);
  }, []);

  const handleReviewFilesChange = useCallback((event) => {
    const nextFiles = Array.from(event?.target?.files ?? []);
    setReviewFiles(nextFiles);
  }, []);

  const handleSubmitWithObservation = useCallback(() => {
    if (reviewMode === REVIEW_MODE_WITH_OBSERVATION && !reviewObservation.trim()) {
      AlertComponent.warning(
        "Observación requerida",
        "Debe diligenciar la observación del revisor para continuar."
      );
      return;
    }

    AlertComponent.info(
      "Recurso pendiente",
      "La integración del recurso para esta acción aún no ha sido definida."
    );
  }, [reviewMode, reviewObservation]);

  const handleConfirmWithoutObservation = useCallback(() => {
    setIsConfirmWithoutObservationOpen(false);
    AlertComponent.info(
      "Recurso pendiente",
      "La integración del recurso para esta acción aún no ha sido definida."
    );
  }, []);

  const columns = useMemo(() => [
    {
      title: "Jornada",
      dataIndex: "jornada",
      key: "jornada",
      width: 180,
      align: "center",
      render: (v) => v || "—",
      ...wrapCell,
    },
    {
      title: wrapTitle("Tipo de", "gestión"),
      dataIndex: "tipoGestion",
      key: "tipoGestion",
      width: 150,
      align: "center",
      render: (v) => v || "—",
      ...wrapCell,
    },
    {
      title: wrapTitle("Categoría", "alerta"),
      dataIndex: "categoriaAlerta",
      key: "categoriaAlerta",
      width: 170,
      align: "center",
      render: (value, record) => renderPill(value, record?.categoriaAlertaCodigo, alertCategoryPillMap),
    },
    {
      title: wrapTitle("Fecha de", "registro"),
      dataIndex: "fechaRegistro",
      key: "fechaRegistro",
      width: 150,
      align: "center",
      render: formatDate,
    },
    {
      title: wrapTitle("Observación", "justificativa"),
      dataIndex: "observacionJustificativa",
      key: "observacionJustificativa",
      width: 250,
      align: "center",
      render: (v) => v || "—",
      ...wrapCell,
    },
    {
      title: wrapTitle("Observación", "revisor"),
      dataIndex: "observacionRevisor",
      key: "observacionRevisor",
      width: 250,
      align: "center",
      render: (v) => v || "—",
      ...wrapCell,
    },
    {
      title: wrapTitle("Rol", "revisor"),
      dataIndex: "rolRevisor",
      key: "rolRevisor",
      width: 150,
      align: "center",
      render: (v) => v || "—",
      ...wrapCell,
    },
    {
      title: wrapTitle("Gestión", "alerta"),
      dataIndex: "gestionAlerta",
      key: "gestionAlerta",
      width: 160,
      align: "center",
      render: (value, record) => renderPill(value, record?.gestionAlertaCodigo, alertManagementPillMap),
    },
    {
      title: "Acciones",
      key: "actions",
      width: 160,
      align: "center",
      fixed: "right",
      render: (_, record) => {
        const isEnSubsanacion =
          Number(record?.gestionAlertaCodigo) === EN_SUBSANACION_GESTION_ID;

        return (
          <ActionsCell>
            {canGestionar && <GestionarButton onClick={() => handleGestionar(record)}>Gestionar</GestionarButton>}
            {canSubsanar && isEnSubsanacion && (
              <SubsanarButton onClick={() => handleSubsanar(record)}>Subsanar</SubsanarButton>
            )}
            {canVerHistorial && <VerButton onClick={() => handleVer(record)}>Ver</VerButton>}
            {canVerHistorial && <HistorialButton onClick={() => handleHistorial(record)}>Historial</HistorialButton>}
          </ActionsCell>
        );
      },
    },
  ], [
    alertCategoryPillMap,
    alertManagementPillMap,
    canGestionar,
    canSubsanar,
    canVerHistorial,
    handleGestionar,
    handleSubsanar,
    handleVer,
    handleHistorial,
  ]);

  const updateDraft = (key) => (nextValue) => {
    setDraftFilters((prev) => ({ ...prev, [key]: nextValue }));
  };

  const handleSearch = () => {
    setAppliedFilters({ ...draftFilters });
  };

  const handleClear = () => {
    setDraftFilters(defaultFilters);
    setAppliedFilters(null);
    setDataSource([]);
  };

  const shouldShowTable = !managingRecord && (tableLoading || Boolean(appliedFilters));

  if (managingRecord) {
    return (
      <DetailViewRoot>
        <DetailBackButton onClick={handleBackToTable}>Volver</DetailBackButton>

        <DetailTopGrid>
          <DetailMetaCard bordered={false}>
            <DetailMetaLabel>Estado de solicitud</DetailMetaLabel>
            <div>{renderPill(managingRecord?.gestionAlerta, managingRecord?.gestionAlertaCodigo, alertManagementPillMap)}</div>
          </DetailMetaCard>
          <DetailMetaCard bordered={false}>
            <DetailMetaLabel>Usuario origen</DetailMetaLabel>
            <DetailMetaValue>{managingRecord?.rolRevisor || "Implementación"}</DetailMetaValue>
          </DetailMetaCard>
          <DetailMetaCard bordered={false}>
            <DetailMetaLabel>Fecha implementación</DetailMetaLabel>
            <DetailMetaValue>{formatDate(managingRecord?.fechaRegistro)}</DetailMetaValue>
          </DetailMetaCard>
          <DetailMetaCard bordered={false}>
            <DetailMetaLabel>Jornada</DetailMetaLabel>
            <DetailMetaValue>{managingRecord?.jornada || "—"}</DetailMetaValue>
          </DetailMetaCard>
        </DetailTopGrid>

        <DetailGrid>
          <div style={{ display: "grid", gap: 16 }}>
            <DetailSectionCard bordered={false}>
              <DetailSectionTitle>Documentos de jornada y soporte</DetailSectionTitle>
              <DetailDocsList>
                {managementDetailDocuments.map((doc) => (
                  <DetailDocItem key={doc.id}>
                    <DetailDocInfo>
                      <DetailDocName>{doc.name}</DetailDocName>
                      <DetailDocMeta>{doc.meta}</DetailDocMeta>
                    </DetailDocInfo>
                    <DetailDocActions>
                      {doc.actions.includes("view") && (
                        <DetailDocButton icon={<EyeOutlined />} />
                      )}
                      {doc.actions.includes("download") && (
                        <DetailDocButton icon={<DownloadOutlined />} />
                      )}
                    </DetailDocActions>
                  </DetailDocItem>
                ))}
              </DetailDocsList>
            </DetailSectionCard>

            <DetailSectionCard bordered={false}>
              <DetailSectionTitle>Productos asociados</DetailSectionTitle>
              <DetailProductsTable>
                <DetailProductsTableHead>
                  <span>ID producto</span>
                  <span>Nombre</span>
                  <span>Precio mín.</span>
                  <span>Precio máx.</span>
                  <span>Valor venta</span>
                  <span>Resultado</span>
                </DetailProductsTableHead>
                <DetailProductsRow>
                  <span>{managingRecord?.id || "—"}</span>
                  <span>{managingRecord?.tipoGestion || "Producto asociado"}</span>
                  <span>{formatCurrency(95000)}</span>
                  <span>{formatCurrency(120000)}</span>
                  <span>{formatCurrency(128500)}</span>
                  <span>{formatCurrency(115000)}</span>
                </DetailProductsRow>
              </DetailProductsTable>

              <ReviewActionsRow>
                <WithObservationButton onClick={handleSelectWithObservation}>
                  Con observación
                </WithObservationButton>
                <WithoutObservationButton onClick={handleSelectWithoutObservation}>
                  Sin observación
                </WithoutObservationButton>
              </ReviewActionsRow>
            </DetailSectionCard>
          </div>

          <div style={{ display: "grid", gap: 16 }}>
            <DetailSectionCard bordered={false}>
              <DetailSectionTitle>Observación justificativa</DetailSectionTitle>
              <DetailObservationBox>
                {managingRecord?.observacionJustificativa || "Sin observación justificativa registrada."}
              </DetailObservationBox>
            </DetailSectionCard>

            <DetailSectionCard bordered={false}>
              <DetailSectionTitle>Traza de eventos</DetailSectionTitle>
              <DetailTimeline>
                {managementTimeline.map((item) => (
                  <DetailTimelineItem key={item.id} $tone={item.tone}>
                    <DetailTimelineTitle>{item.title}</DetailTimelineTitle>
                    <DetailTimelineMeta>{item.meta}</DetailTimelineMeta>
                  </DetailTimelineItem>
                ))}
              </DetailTimeline>
            </DetailSectionCard>

            {reviewMode === REVIEW_MODE_WITH_OBSERVATION && (
              <ReviewPanel bordered={false}>
                <DetailSectionTitle>Observación del revisor</DetailSectionTitle>
                <div style={{ display: "grid", gap: 8 }}>
                  <ReviewFieldLabel>
                    Observación <span style={{ color: "#dc2626" }}>*</span>
                  </ReviewFieldLabel>
                  <ReviewTextArea
                    value={reviewObservation}
                    onChange={(event) => setReviewObservation(event.target.value)}
                    placeholder="Registra la observación del revisor"
                  />
                </div>

                <div style={{ display: "grid", gap: 8 }}>
                  <ReviewFieldLabel>Adjuntos del revisor</ReviewFieldLabel>
                  <ReviewUploadBox>
                    <ReviewUploadInput type="file" multiple onChange={handleReviewFilesChange} />
                    <ReviewUploadText>
                      {reviewFiles.length
                        ? reviewFiles.map((file) => file.name).join(", ")
                        : "Elegir archivos"}
                    </ReviewUploadText>
                  </ReviewUploadBox>
                </div>

                <ReviewSubmitRow>
                  <ReviewSubmitButton onClick={handleSubmitWithObservation}>
                    Enviar a Subsanación
                  </ReviewSubmitButton>
                </ReviewSubmitRow>
              </ReviewPanel>
            )}
          </div>
        </DetailGrid>

        <Modal
          isOpen={isConfirmWithoutObservationOpen}
          onCloseModal={() => setIsConfirmWithoutObservationOpen(false)}
          title="Confirmar levantamiento sin observación"
          footer={null}
          width={760}
          centered
        >
          <div style={{ display: "grid", gap: 20 }}>
            <p style={{ margin: 0, color: "#0f172a", lineHeight: 1.6 }}>
              ¿Está seguro de levantar la alerta? La solicitud quedará en estado <strong>Resuelta</strong>,
              la categoría de alerta actual pasará a <strong>0 - Sin alerta</strong> y la categoría anterior
              quedará registrada en el histórico.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <SecondaryFilterButton onClick={() => setIsConfirmWithoutObservationOpen(false)}>
                Cancelar
              </SecondaryFilterButton>
              <WithoutObservationButton onClick={handleConfirmWithoutObservation}>
                Confirmar
              </WithoutObservationButton>
            </div>
          </div>
        </Modal>
      </DetailViewRoot>
    );
  }

  return (
    <WidgetRoot>
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
              <FiltersCol xs={24} sm={12} lg={6}>
                <FiltersFieldGroup>
                  <FiltersFieldLabel>Jornada</FiltersFieldLabel>
                  <FiltersSelect
                    value={draftFilters.operationalDay}
                    options={journeyOptions}
                    onChange={updateDraft("operationalDay")}
                    placeholder="Selecciona una jornada"
                    isLoading={loadingJourneys}
                    isClearable
                    showSearch={false}
                  />
                </FiltersFieldGroup>
              </FiltersCol>

              <FiltersCol xs={24} sm={12} lg={6}>
                <FiltersFieldGroup>
                  <FiltersFieldLabel>Categoría de alerta</FiltersFieldLabel>
                  <FiltersSelect
                    value={draftFilters.alertCategory}
                    options={alertCategoryOptions}
                    onChange={updateDraft("alertCategory")}
                    placeholder="Selecciona una categoría"
                    showSearch={false}
                    isClearable
                    isLoading={loadingAlertCategory}
                  />
                </FiltersFieldGroup>
              </FiltersCol>

              <FiltersCol xs={24} sm={12} lg={6}>
                <FiltersFieldGroup>
                  <FiltersFieldLabel>Tipo de gestión</FiltersFieldLabel>
                  <FiltersSelect
                    value={draftFilters.managementType}
                    options={managementTypeOptions}
                    onChange={updateDraft("managementType")}
                    placeholder="Selecciona un tipo"
                    showSearch={false}
                    isClearable
                    isLoading={loadingManagementType}
                  />
                </FiltersFieldGroup>
              </FiltersCol>

              <FiltersCol xs={24} sm={12} lg={6}>
                <FiltersFieldGroup>
                  <FiltersFieldLabel>Gestión de alerta</FiltersFieldLabel>
                  <FiltersSelect
                    value={draftFilters.alertManagement}
                    options={alertManagementOptions}
                    onChange={updateDraft("alertManagement")}
                    placeholder="Selecciona una gestión"
                    showSearch={false}
                    isClearable
                    isLoading={loadingAlertManagement}
                  />
                </FiltersFieldGroup>
              </FiltersCol>
            </FiltersGrid>

            <FiltersActions>
              <PrimaryFilterButton
                icon={<SearchOutlined />}
                onClick={handleSearch}
                disabled={tableLoading}
              >
                Buscar
              </PrimaryFilterButton>
              <SecondaryFilterButton onClick={handleClear} disabled={tableLoading}>
                Limpiar
              </SecondaryFilterButton>
            </FiltersActions>
          </FiltersForm>
        </FiltersRoot>
      </FiltersCard>

      {shouldShowTable && (
        <TableCard bordered={false}>
          <TableHeader>
            <TableTitle>Gestiones de alertas</TableTitle>
            <TableDescription>
              Solicitudes registradas para los productos alertados.
            </TableDescription>
          </TableHeader>
          <TableContent>
            <SmartTable
              loading={tableLoading}
              rowKey="id"
              columns={columns}
              columnWidthMode="fixed"
              dataSource={dataSource}
              total={dataSource.length}
              showPagination
              pageSizeOptions={["10", "20", "50"]}
              defaultPageSize="10"
              enableRowSelection={false}
              showToolbar={false}
              showColumnSettings={false}
              showTableResize={false}
              showReload={false}
              download={{ enable: false }}
              emptyText="No hay gestiones de alertas para los filtros aplicados."
              scroll={{ x: TABLE_SCROLL_X, y: undefined }}
            />
          </TableContent>
        </TableCard>
      )}
    </WidgetRoot>
  );
};
