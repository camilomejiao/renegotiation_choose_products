import { useEffect, useState } from "react";
import { CheckOutlined, PaperClipOutlined } from "@ant-design/icons";
import { Tabs } from "antd";

import AlertComponent from "../../../helpers/alert/AlertComponent";
import { downloadRouteFile } from "../../../shared/lib/fileDownload";
import { Modal } from "../../../shared/ui/modal";
import { DocumentViewerModal } from "../../../features/beneficiary-document-reports/ui/DocumentViewerModal";
import { getAlertedProductsHistoryTabNames } from "../../../entities/alerted-product";
import { useAlertedProductsDocuments } from "../model/useAlertedProductsDocuments";
import { usePdfDocumentViewer } from "../model/usePdfDocumentViewer";
import { DocumentHistoryTimeline } from "./DocumentHistoryTimeline";
import { DocumentUploadPanel } from "./DocumentUploadPanel";
import { SaveRequirements } from "./SaveRequirements";
import {
  DocumentsDescription,
  DocumentsHeader,
  DocumentsHeaderIcon,
  DocumentsIntro,
  DocumentsRoot,
  DocumentsShell,
  DocumentsTabs,
  DocumentsTitle,
  FullHistoryEmpty,
  FullHistoryTabs,
  HistoryLinkButton,
  HistoryLinkRow,
  SaveDocumentsButton,
  SaveDocumentsRow,
  UploadErrorText,
} from "./common.styles";

const UPLOAD_SLOTS = [
  {
    key: "pdf",
    label: "PDF",
    title: "Documento PDF",
    hint: "Carga el acta o soporte principal en formato PDF.",
    accept: ".pdf",
  },
  {
    key: "excel",
    label: "Excel",
    title: "Documento Excel",
    hint: "Carga la matriz o archivo de trabajo en formato Excel.",
    accept: ".xls,.xlsx",
  },
];

export const AlertedProductsDocumentsWidget = ({
  historyByCategory: initialHistoryByCategory,
  journey,
  onDocumentsSaved,
}) => {
  const [uploadError, setUploadError] = useState("");
  const [isEmptyHistoryModalOpen, setIsEmptyHistoryModalOpen] = useState(false);
  const [historyTabNames, setHistoryTabNames] = useState({
    pdf: "Historial PDF",
    excel: "Historial Excel",
  });

  const pdf = usePdfDocumentViewer();

  const {
    closeHistoryModal,
    canPersistDocuments,
    filesByCategory,
    hasRequiredFiles,
    isHistoryModalOpen,
    historyByCategory,
    handleBeforeUpload,
    handleRemoveFile,
    openHistoryModal,
    persistDocuments,
    savingDocuments,
  } = useAlertedProductsDocuments({
    historyByCategory: initialHistoryByCategory,
    journey,
  });

  useEffect(() => {
    getAlertedProductsHistoryTabNames().then(setHistoryTabNames).catch(() => {});
  }, []);

  const isUploadEnabled = Boolean(journey?.value);

  const buildBeforeUploadHandler = (category) => (file) => {
    if (!isUploadEnabled) {
      setUploadError("Primero selecciona una jornada y aplica los filtros.");
      return false;
    }

    const extension = file.name?.split(".").pop()?.toLowerCase();
    const isValid =
      (category === "pdf" && extension === "pdf") ||
      (category === "excel" && (extension === "xls" || extension === "xlsx"));

    if (!isValid) {
      setUploadError(
        category === "pdf"
          ? "Solo puedes cargar un archivo PDF en esta sección."
          : "Solo puedes cargar un archivo Excel en esta sección."
      );
      return false;
    }

    setUploadError("");
    return handleBeforeUpload(category)(file);
  };

  const documentTabs = UPLOAD_SLOTS.map((slot) => ({
    key: slot.key,
    label: slot.key === "pdf" ? "Cargar PDF" : "Cargar Excel",
    children: (
      <DocumentUploadPanel
        slot={slot}
        currentFile={filesByCategory[slot.key]}
        isUploadEnabled={isUploadEnabled}
        onBeforeUpload={buildBeforeUploadHandler(slot.key)}
        onRemove={() => handleRemoveFile(slot.key)}
      />
    ),
  }));

  const fullHistoryTabs = UPLOAD_SLOTS.map((slot) => {
    const isPdf = slot.key === "pdf";
    const fallbackName = isPdf ? "documento.pdf" : "documento.xlsx";

    return {
      key: `history-${slot.key}`,
      label: isPdf ? historyTabNames.pdf : historyTabNames.excel,
      children: (
        <DocumentHistoryTimeline
          history={historyByCategory[slot.key]}
          isPdf={isPdf}
          onView={(item) => pdf.openFromRoute(item.route, item.name || "documento.pdf")}
          onDownload={(item) => downloadRouteFile(item.route, item.name || fallbackName)}
        />
      ),
    };
  });

  const hasAnyHistory = UPLOAD_SLOTS.some((slot) => historyByCategory[slot.key].length);
  const hasSelectedJourney = Boolean(journey?.value);

  const handlePersistDocuments = async () => {
    if (!journey?.value) {
      AlertComponent.warning("Atención", "Debes aplicar una jornada antes de guardar documentos");
      return;
    }

    if (!canPersistDocuments) {
      AlertComponent.warning("Atención", "Debes adjuntar un archivo PDF y un archivo Excel");
      return;
    }

    try {
      await persistDocuments();
      await onDocumentsSaved?.(journey.value);
      AlertComponent.success("Bien hecho!", "Los documentos se guardaron correctamente");
    } catch (_error) {
      AlertComponent.error("Error", "No fue posible guardar los documentos");
    }
  };

  return (
    <DocumentsShell bordered={false}>
      <DocumentsRoot>
        <DocumentsIntro>
          <DocumentsHeader>
            <DocumentsHeaderIcon>
              <PaperClipOutlined />
            </DocumentsHeaderIcon>
            <DocumentsTitle>Cargar documentos de mesa técnica</DocumentsTitle>
          </DocumentsHeader>

          <DocumentsDescription>
            Adjunta los soportes que respaldan la gestión de alertas para la jornada
            seleccionada.
          </DocumentsDescription>
        </DocumentsIntro>

        <DocumentsTabs>
          <Tabs defaultActiveKey="pdf" items={documentTabs} />
        </DocumentsTabs>

        <SaveRequirements
          hasSelectedJourney={hasSelectedJourney}
          hasSelectedPdf={Boolean(filesByCategory.pdf)}
          hasSelectedExcel={Boolean(filesByCategory.excel)}
        />

        <SaveDocumentsRow>
          <SaveDocumentsButton
            type="primary"
            icon={<CheckOutlined />}
            onClick={handlePersistDocuments}
            disabled={!hasRequiredFiles || !journey?.value || savingDocuments}
            loading={savingDocuments}
          >
            Guardar Documentos
          </SaveDocumentsButton>
        </SaveDocumentsRow>

        <HistoryLinkRow>
          <HistoryLinkButton
            type="link"
            disabled={!hasSelectedJourney}
            onClick={hasAnyHistory ? openHistoryModal : () => setIsEmptyHistoryModalOpen(true)}
          >
            Ver historial completo
          </HistoryLinkButton>
        </HistoryLinkRow>

        {uploadError ? <UploadErrorText>{uploadError}</UploadErrorText> : null}
      </DocumentsRoot>

      <Modal
        title="Historial completo de documentos"
        subTitle="Consulta el historial de cargas de PDF y Excel."
        isOpen={isHistoryModalOpen}
        onCloseModal={closeHistoryModal}
        footer={null}
        width={760}
        centered
        destroyOnClose={false}
        maxBodyHeight="72vh"
      >
        <FullHistoryTabs>
          <Tabs defaultActiveKey="history-pdf" items={fullHistoryTabs} />
        </FullHistoryTabs>
      </Modal>

      <Modal
        title="Historial de documentos"
        isOpen={isEmptyHistoryModalOpen}
        onCloseModal={() => setIsEmptyHistoryModalOpen(false)}
        footer={null}
        centered
        destroyOnClose={false}
      >
        <FullHistoryEmpty>
          La Jornada seleccionada no tiene documentos asociados.
        </FullHistoryEmpty>
      </Modal>

      <DocumentViewerModal
        isOpen={pdf.viewer.isOpen}
        title="Visor de documento"
        subtitle={pdf.viewer.title}
        documentUrl={pdf.viewer.url}
        onClose={pdf.close}
        onDownload={pdf.downloadCurrent}
      />
    </DocumentsShell>
  );
};