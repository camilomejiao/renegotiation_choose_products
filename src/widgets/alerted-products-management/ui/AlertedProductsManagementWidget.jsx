import { useCallback, useMemo, useState } from "react";
import {
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Modal as AntdModal, Tooltip, Upload } from "antd";

import AlertComponent from "../../../helpers/alert/AlertComponent";
import { filesServices } from "../../../helpers/services/FilesServices";
import { DocumentViewerModal } from "../../../features/beneficiary-document-reports/ui/DocumentViewerModal";
import { ManagementMetaStrip } from "../../../shared/ui/management-meta-strip";
import { Modal as AppModal } from "../../../shared/ui/modal";
import { SmartTable } from "../../../shared/ui/smart-table";
import {
  getAlertedProductsManagementColumns,
  renderCategoryPill,
} from "../model/getAlertedProductsManagementColumns";
import { useAddAlertModal } from "../model/useAddAlertModal";
import {
  ActaDeleteButton,
  ActaDownloadButton,
  ActaFileActions,
  ActaFileCard,
  ActaFileName,
  ActaFileTop,
  ActaUploadZone,
  ActaViewButton,
  ActionsRow,
  AddAlertRowButton,
  AlertsAddButton,
  AlertsSectionHeader,
  AlertsTableWrapper,
  FieldGroup,
  FieldLabel,
  JourneyDocActions,
  JourneyDocButton,
  JourneyDocEmpty,
  JourneyDocIcon,
  JourneyDocInfo,
  JourneyDocItem,
  JourneyDocMeta,
  JourneyDocName,
  JourneyDocumentsRow,
  ManagementBody,
  ManagementCard,
  ModalInfoBanner,
  ObservationTextArea,
  PrimaryActionButton,
  RequiredMark,
  SecondaryActionButton,
  SectionCard,
  SectionTitle,
  SolicitudGrid,
} from "./AlertedProductsManagementWidget.styles";

const JUSTIFICACION_TECNICA_LABEL = "JUSTIFICACION TECNICA";

const formatTimestamp = (timestamp) => {
  if (!timestamp) return "";
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(timestamp));
};

const extractFileName = (name = "") => {
  const withoutExt = name.replace(/\.[^.]+$/, "");
  const parts = withoutExt.split("_");
  return parts[2] ?? parts[parts.length - 1] ?? name;
};

const wrapTitle = (...lines) => (
  <span style={{ display: "inline-block", width: "100%", whiteSpace: "normal", lineHeight: 1.15, textAlign: "center" }}>
    {lines.map((line, i) => <span key={i} style={{ display: "block" }}>{line}</span>)}
  </span>
);

const normalizeLabel = (value = "") =>
  String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toUpperCase();

const buildManagementMetaItems = (managementTypeLabel = "") => {
  const normalizedType = normalizeLabel(managementTypeLabel);
  const reviewerRole =
    normalizedType === JUSTIFICACION_TECNICA_LABEL ? "Sub. Operativa" : "Supervisión";

  return [
    {
      label: "Tipo de gestión",
      value: managementTypeLabel || "—",
      variant: "type",
    },
    { label: "Rol Responsable", value: "Implementación" },
    { label: "Rol Revisor", value: reviewerRole },
    {
      label: "Estado",
      value: "Sin Gestión",
      variant: "status",
      statusColor: "default",
    },
  ];
};

export const AlertedProductsManagementWidget = ({
  assignment,
  appliedFilters,
  historyByCategory = { pdf: [], excel: [] },
  managementTypeOptions = [],
  onBack,
  onContinue,
  onSubmitManagementRequest,
}) => {
  const [observation, setObservation] = useState("");
  const [actaFile, setActaFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [viewingPdf, setViewingPdf] = useState(false);
  const [downloadingExcel, setDownloadingExcel] = useState(false);
  const [pdfViewer, setPdfViewer] = useState({ isOpen: false, url: null, title: "" });
  const [alertsData, setAlertsData] = useState(() => assignment?.selectedRows ?? []);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [missingRequirementsModal, setMissingRequirementsModal] = useState({
    isOpen: false,
    message: "",
  });
  const [servicesResponseModal, setServicesResponseModal] = useState({
    isOpen: false,
    result: null,
  });
  const [addingId, setAddingId] = useState(null);

  const activePdf   = historyByCategory.pdf?.[0]   ?? null;
  const activeExcel = historyByCategory.excel?.[0] ?? null;
  const assignmentManagementTypeCode = assignment?.selectedRows?.[0]?.managementTypeCode;

  const managementTypeOption = useMemo(
    () =>
      managementTypeOptions.find(
        (opt) =>
          String(opt.value) === String(assignmentManagementTypeCode) ||
          normalizeLabel(opt.label) === normalizeLabel(assignment?.managementType)
      ) ||
      (assignment?.managementType
        ? {
            value: assignmentManagementTypeCode ?? null,
            label: assignment.managementType,
          }
        : null),
    [assignment?.managementType, assignmentManagementTypeCode, managementTypeOptions]
  );
  const managementMetaItems = useMemo(
    () => buildManagementMetaItems(managementTypeOption?.label || assignment?.managementType || ""),
    [assignment?.managementType, managementTypeOption?.label]
  );

  const { allRows: modalAllRows, loading: modalLoading } = useAddAlertModal({
    isOpen: isAddModalOpen,
    appliedFilters,
  });

  const managementCategoryCodes = useMemo(
    () => new Set(alertsData.map((r) => r.alertCategoryCode).filter(Boolean)),
    [alertsData]
  );

  const addedIds = useMemo(
    () => new Set(alertsData.map((r) => r.id)),
    [alertsData]
  );

  const modalDataSource = useMemo(() => {
    return modalAllRows.filter((row) => {
      if (managementCategoryCodes.size > 0 && !managementCategoryCodes.has(row.alertCategoryCode)) return false;
      if (addedIds.has(row.id)) return false;
      const mgmt = (row.alertManagement ?? "").trim().toLowerCase();
      return !mgmt || mgmt === "sin gestión" || mgmt === "sin gestion";
    });
  }, [modalAllRows, addedIds, managementCategoryCodes]);

  const handleRemoveAlert = useCallback((record) => {
    setAlertsData((prev) => prev.filter((row) => row.id !== record.id));
  }, []);

  const alertsColumns = useMemo(
    () => getAlertedProductsManagementColumns({ onRemove: handleRemoveAlert }),
    [handleRemoveAlert]
  );

  const handleAddAlert = useCallback(async (product) => {
    if (!managementTypeOption) {
      AlertComponent.warning(
        "Tipo de gestión requerido",
        "No fue posible identificar el tipo de gestión de la solicitud actual."
      );
      return;
    }
    setAddingId(product.id);
    try {
      const enriched = {
        ...product,
        managementType: managementTypeOption.label,
        managementTypeCode: managementTypeOption.value,
        hasAssignedManagementType: true,
      };
      setAlertsData((prev) => [...prev, enriched]);
    } catch (error) {
      AlertComponent.error(
        "Error",
        error?.data?.mensaje || "No fue posible añadir el producto a la gestión."
      );
    } finally {
      setAddingId(null);
    }
  }, [managementTypeOption]);

  const modalColumns = useMemo(() => [
    {
      title: "Acción",
      key: "action",
      width: 110,
      align: "center",
      fixed: "left",
      render: (_, record) => {
        const isAdded = addedIds.has(record.id);
        return (
          <AddAlertRowButton
            loading={addingId === record.id}
            disabled={isAdded || (addingId !== null && addingId !== record.id)}
            onClick={() => !isAdded && handleAddAlert(record)}
          >
            {isAdded ? "Ya añadido" : "Añadir"}
          </AddAlertRowButton>
        );
      },
    },
    {
      title: "Categoría",
      dataIndex: "alertCategory",
      key: "alertCategory",
      width: 180,
      align: "center",
      render: (value, record) => renderCategoryPill(value, record?.alertCategoryCode),
    },
    {
      title: wrapTitle("Documento", "Titular"),
      dataIndex: "documentoTitular",
      key: "documentoTitular",
      width: 140,
      align: "center",
      render: (v) => v || "—",
    },
    {
      title: "CUB",
      dataIndex: "cub",
      key: "cub",
      width: 100,
      align: "center",
      render: (v) => v || "—",
    },
    {
      title: wrapTitle("N° de", "Orden"),
      dataIndex: "ordenNumero",
      key: "ordenNumero",
      width: 110,
      align: "center",
      render: (v) => v || "—",
    },
    {
      title: "Proveedor",
      dataIndex: "supplier",
      key: "supplier",
      width: 160,
      align: "center",
    },
    {
      title: wrapTitle("ID", "Producto"),
      dataIndex: "productId",
      key: "productId",
      width: 110,
      align: "center",
    },
    {
      title: wrapTitle("Nombre", "producto"),
      dataIndex: "productName",
      key: "productName",
      width: 200,
      align: "center",
    },
    {
      title: wrapTitle("Tipo", "gestión"),
      dataIndex: "managementType",
      key: "managementType",
      width: 160,
      align: "center",
      render: (value) => value || managementTypeOption?.label || "—",
    },
    {
      title: wrapTitle("Gestión", "alerta"),
      dataIndex: "alertManagement",
      key: "alertManagement",
      width: 150,
      align: "center",
      render: (v) => v || "—",
    },
  ], [addedIds, addingId, handleAddAlert, managementTypeOption?.label]);

  const closePdfViewer = () => {
    if (pdfViewer.url) URL.revokeObjectURL(pdfViewer.url);
    setPdfViewer({ isOpen: false, url: null, title: "" });
  };

  const handleDownloadFromViewer = () => {
    if (!pdfViewer.url) return;
    const anchor = document.createElement("a");
    anchor.href = pdfViewer.url;
    anchor.download = pdfViewer.title;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const handleViewJourneyPdf = async () => {
    if (!activePdf?.route) return;
    setViewingPdf(true);
    try {
      const response = await filesServices.downloadFile(activePdf.route);
      if (!response?.blob) return;
      const url = URL.createObjectURL(response.blob);
      setPdfViewer({ isOpen: true, url, title: activePdf.name || "documento.pdf" });
    } catch {
      AlertComponent.error("Error", "No fue posible abrir el documento.");
    } finally {
      setViewingPdf(false);
    }
  };

  const handleDownloadJourneyExcel = async () => {
    if (!activeExcel?.route) return;
    setDownloadingExcel(true);
    try {
      const response = await filesServices.downloadFile(activeExcel.route);
      if (!response?.blob) return;
      const url = URL.createObjectURL(response.blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = activeExcel.name || "documento.xlsx";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      AlertComponent.error("Error", "No fue posible descargar el documento.");
    } finally {
      setDownloadingExcel(false);
    }
  };

  const handleBeforeUploadActa = (file) => {
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      AlertComponent.error("Formato inválido", "Solo se permite archivos PDF.");
      return false;
    }
    const baseName = (assignment?.managementType || "Acta_Complementaria")
      .trim()
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join("_");
    setActaFile(new File([file], `${baseName}.pdf`, { type: file.type }));
    return false;
  };

  const handleViewActa = () => {
    const url = URL.createObjectURL(actaFile);
    setPdfViewer({ isOpen: true, url, title: actaFile.name });
  };

  const handleDownloadActa = () => {
    const url = URL.createObjectURL(actaFile);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = actaFile.name;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const openMissingRequirementsModal = (message) => {
    setMissingRequirementsModal({
      isOpen: true,
      message,
    });
  };

  const closeServicesResponseModal = () => {
    const shouldContinue = Boolean(servicesResponseModal.result?.success);

    setServicesResponseModal({
      isOpen: false,
      result: null,
    });

    if (shouldContinue) {
      onContinue?.();
    }
  };

  const handleSubmit = async () => {
    if (!observation.trim() && !actaFile) {
      openMissingRequirementsModal(
        "Debes diligenciar la observación justificada y adjuntar el archivo PDF antes de enviar."
      );
      return;
    }

    if (!observation.trim()) {
      openMissingRequirementsModal(
        "Debes diligenciar la observación justificada antes de enviar."
      );
      return;
    }

    if (!actaFile) {
      openMissingRequirementsModal(
        "Debes adjuntar el archivo PDF antes de enviar."
      );
      return;
    }

    if (!managementTypeOption?.value || alertsData.length === 0) {
      AlertComponent.warning(
        "Información incompleta",
        "No hay productos o tipo de gestión válidos para enviar la solicitud."
      );
      return;
    }

    if (!onSubmitManagementRequest) {
      onContinue?.();
      return;
    }

    setSubmitting(true);

    try {
      const result = await onSubmitManagementRequest({
        managementTypeId: managementTypeOption.value,
        selectedRows: alertsData,
        observation: observation.trim(),
        pdf: actaFile,
      });

      setServicesResponseModal({
        isOpen: true,
        result,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ManagementCard bordered={false}>
      <ManagementBody>
        <ManagementMetaStrip items={managementMetaItems} />

        {/* Documentos de Gestión de la Jornada */}
        <SectionCard>
          <SectionTitle>Documentos de Gestión de la Jornada</SectionTitle>
          <JourneyDocumentsRow>
            {activePdf ? (
              <JourneyDocItem>
                <JourneyDocIcon>
                  <FilePdfOutlined />
                </JourneyDocIcon>
                <JourneyDocInfo>
                  <JourneyDocName>{extractFileName(activePdf.name)}</JourneyDocName>
                  <JourneyDocMeta>{formatTimestamp(activePdf.uploadedAt)}</JourneyDocMeta>
                </JourneyDocInfo>
                <JourneyDocActions>
                  <Tooltip title="Visualizar">
                    <JourneyDocButton
                      icon={<EyeOutlined />}
                      loading={viewingPdf}
                      onClick={handleViewJourneyPdf}
                    />
                  </Tooltip>
                  <Tooltip title="Descargar">
                    <JourneyDocButton
                      icon={<DownloadOutlined />}
                      onClick={async () => {
                        const response = await filesServices.downloadFile(activePdf.route);
                        if (!response?.blob) return;
                        const url = URL.createObjectURL(response.blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = activePdf.name || "documento.pdf";
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        setTimeout(() => URL.revokeObjectURL(url), 1000);
                      }}
                    />
                  </Tooltip>
                </JourneyDocActions>
              </JourneyDocItem>
            ) : (
              <JourneyDocEmpty>Sin documento PDF activo</JourneyDocEmpty>
            )}

            {activeExcel ? (
              <JourneyDocItem>
                <JourneyDocIcon $type="excel">
                  <FileExcelOutlined />
                </JourneyDocIcon>
                <JourneyDocInfo>
                  <JourneyDocName>{extractFileName(activeExcel.name)}</JourneyDocName>
                  <JourneyDocMeta>{formatTimestamp(activeExcel.uploadedAt)}</JourneyDocMeta>
                </JourneyDocInfo>
                <JourneyDocActions>
                  <Tooltip title="Descargar">
                    <JourneyDocButton
                      icon={<DownloadOutlined />}
                      loading={downloadingExcel}
                      onClick={handleDownloadJourneyExcel}
                    />
                  </Tooltip>
                </JourneyDocActions>
              </JourneyDocItem>
            ) : (
              <JourneyDocEmpty>Sin documento Excel activo</JourneyDocEmpty>
            )}
          </JourneyDocumentsRow>
        </SectionCard>

        {/* Solicitud de Levantamiento */}
        <SectionCard>
          <SectionTitle>Solicitud de Levantamiento</SectionTitle>
          <SolicitudGrid>
            <FieldGroup>
              <FieldLabel>
                Observación justificada <RequiredMark>*</RequiredMark>
              </FieldLabel>
              <ObservationTextArea
                placeholder="Escribe el fundamento del levantamiento de la alerta con los soportes y análisis pertinentes en la mesa técnica."
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                rows={6}
                maxLength={1000}
                showCount
              />
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>
                Documento de Acta Complementaria <RequiredMark>*</RequiredMark>
              </FieldLabel>
              {actaFile ? (
                <ActaFileCard>
                  <ActaFileTop>
                    <FilePdfOutlined style={{ color: "#dc2626", fontSize: "1.25rem", flexShrink: 0 }} />
                    <ActaFileName>{actaFile.name}</ActaFileName>
                  </ActaFileTop>
                  <ActaFileActions>
                    <ActaViewButton icon={<EyeOutlined />} onClick={handleViewActa}>
                      Ver
                    </ActaViewButton>
                    <ActaDownloadButton icon={<DownloadOutlined />} onClick={handleDownloadActa}>
                      Descargar
                    </ActaDownloadButton>
                    <ActaDeleteButton icon={<DeleteOutlined />} onClick={() => setActaFile(null)}>
                      Eliminar
                    </ActaDeleteButton>
                  </ActaFileActions>
                </ActaFileCard>
              ) : (
                <Upload
                  accept=".pdf"
                  showUploadList={false}
                  beforeUpload={handleBeforeUploadActa}
                >
                  <ActaUploadZone>
                    <PlusOutlined />
                    <span>Adjuntar PDF</span>
                  </ActaUploadZone>
                </Upload>
              )}
            </FieldGroup>
          </SolicitudGrid>
        </SectionCard>

        {/* Alertas a Gestionar */}
        <SectionCard>
          <AlertsSectionHeader>
            <SectionTitle>Alertas a Gestionar</SectionTitle>
            <AlertsAddButton
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsAddModalOpen(true)}
            >
              Añadir item
            </AlertsAddButton>
          </AlertsSectionHeader>
          <AlertsTableWrapper>
            <SmartTable
              rowKey="id"
              columns={alertsColumns}
              columnWidthMode="fixed"
              dataSource={alertsData}
              total={alertsData.length}
              showPagination
              pageSizeOptions={["10", "20", "50"]}
              defaultPageSize="10"
              enableRowSelection={false}
              showToolbar={false}
              showColumnSettings={false}
              showTableResize={false}
              showReload={false}
              scroll={{ x: 1900, y: 400 }}
              emptyText="No hay alertas para el tipo de gestión seleccionado."
            />
          </AlertsTableWrapper>
        </SectionCard>

        <ActionsRow>
          <SecondaryActionButton onClick={onBack}>Cancelar</SecondaryActionButton>
          <PrimaryActionButton type="primary" onClick={handleSubmit} loading={submitting}>
            Enviar
          </PrimaryActionButton>
        </ActionsRow>
      </ManagementBody>

      <DocumentViewerModal
        isOpen={pdfViewer.isOpen}
        title="Visor de documento"
        subtitle={pdfViewer.title}
        documentUrl={pdfViewer.url}
        onClose={closePdfViewer}
        onDownload={handleDownloadFromViewer}
      />

      <AppModal
        title="Información requerida"
        isOpen={missingRequirementsModal.isOpen}
        onCloseModal={() =>
          setMissingRequirementsModal({ isOpen: false, message: "" })
        }
        footer={
          <SecondaryActionButton
            onClick={() =>
              setMissingRequirementsModal({ isOpen: false, message: "" })
            }
          >
            Entendido
          </SecondaryActionButton>
        }
        width={520}
        centered
      >
        <p style={{ margin: 0 }}>{missingRequirementsModal.message}</p>
      </AppModal>

      <AppModal
        title={
          servicesResponseModal.result?.success
            ? "Servicios procesados correctamente"
            : "Resultado del procesamiento"
        }
        isOpen={servicesResponseModal.isOpen}
        onCloseModal={closeServicesResponseModal}
        footer={
          <SecondaryActionButton onClick={closeServicesResponseModal}>
            {servicesResponseModal.result?.success ? "Continuar" : "Cerrar"}
          </SecondaryActionButton>
        }
        width={640}
        centered
      >
        <div style={{ display: "grid", gap: 16 }}>
          {[servicesResponseModal.result?.management, servicesResponseModal.result?.request]
            .filter(Boolean)
            .map((serviceResult) => (
              <div
                key={serviceResult.label}
                style={{
                  border: "1px solid #dbe4f0",
                  borderRadius: 12,
                  padding: 16,
                  background: serviceResult.ok ? "#f0fdf4" : "#fff7ed",
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: 6 }}>
                  {serviceResult.label}
                </div>
                <div style={{ marginBottom: 6 }}>
                  Estado: {serviceResult.ok ? "OK" : "Error"}
                  {serviceResult.status ? ` (${serviceResult.status})` : ""}
                </div>
                {serviceResult.code ? (
                  <div style={{ marginBottom: 6 }}>Código: {serviceResult.code}</div>
                ) : null}
                <div>{serviceResult.message}</div>
              </div>
            ))}
        </div>
      </AppModal>

      <AntdModal
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        title="Añadir item a la gestión"
        footer={
          <SecondaryActionButton onClick={() => setIsAddModalOpen(false)}>
            Cerrar
          </SecondaryActionButton>
        }
        width={1100}
        destroyOnClose
      >
        <ModalInfoBanner>
          Solo se listan registros de Productos Alertados que coinciden con la misma
          categoría de alerta de la gestión actual y cuyo estado de gestión de alerta
          es <strong>Sin Gestión</strong>.
        </ModalInfoBanner>
        <SmartTable
          rowKey="id"
          columns={modalColumns}
          columnWidthMode="fixed"
          dataSource={modalDataSource}
          total={modalDataSource.length}
          loading={modalLoading}
          showPagination
          pageSizeOptions={["10", "20", "50"]}
          defaultPageSize="10"
          showToolbar={false}
          showColumnSettings={false}
          showTableResize={false}
          showReload={false}
          scroll={{ x: 1200, y: 400 }}
          emptyText="No hay productos disponibles para añadir."
        />
      </AntdModal>
    </ManagementCard>
  );
};
