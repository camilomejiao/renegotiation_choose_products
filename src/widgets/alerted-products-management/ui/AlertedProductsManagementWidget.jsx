import { useState } from "react";
import {
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Tooltip, Upload } from "antd";

import AlertComponent from "../../../helpers/alert/AlertComponent";
import { filesServices } from "../../../helpers/services/FilesServices";
import { DocumentViewerModal } from "../../../features/beneficiary-document-reports/ui/DocumentViewerModal";
import { ManagementMetaStrip } from "../../../shared/ui/management-meta-strip";
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
  ObservationTextArea,
  PrimaryActionButton,
  RequiredMark,
  SecondaryActionButton,
  SectionCard,
  SectionTitle,
  SolicitudGrid,
} from "./AlertedProductsManagementWidget.styles";

const ACTA_COMPLEMENTARIA_META = [
  { label: "Tipo de gestión", value: "ACTA COMPLEMENTARIA", variant: "type" },
  { label: "Rol Responsable", value: "Implementación" },
  { label: "Rol Revisor",     value: "Supervisión" },
  { label: "Estado",          value: "Sin Gestión", variant: "status", statusColor: "default" },
];

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

export const AlertedProductsManagementWidget = ({
  assignment,
  historyByCategory = { pdf: [], excel: [] },
  onBack,
  onContinue,
}) => {
  const [observation, setObservation] = useState("");
  const [actaFile, setActaFile] = useState(null);
  const [viewingPdf, setViewingPdf] = useState(false);
  const [downloadingExcel, setDownloadingExcel] = useState(false);
  const [pdfViewer, setPdfViewer] = useState({ isOpen: false, url: null, title: "" });

  const activePdf   = historyByCategory.pdf?.[0]   ?? null;
  const activeExcel = historyByCategory.excel?.[0] ?? null;

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

  const handleSubmit = () => {
    if (!observation.trim()) {
      AlertComponent.warning("Campo requerido", "La observación justificada es obligatoria.");
      return;
    }
    if (!actaFile) {
      AlertComponent.warning("Documento requerido", "Debes adjuntar el documento de Acta Complementaria.");
      return;
    }
    onContinue?.();
  };

  return (
    <ManagementCard bordered={false}>
      <ManagementBody>
        <ManagementMetaStrip items={ACTA_COMPLEMENTARIA_META} />

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

        <ActionsRow>
          <SecondaryActionButton onClick={onBack}>Cancelar</SecondaryActionButton>
          <PrimaryActionButton type="primary" onClick={handleSubmit}>
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
    </ManagementCard>
  );
};