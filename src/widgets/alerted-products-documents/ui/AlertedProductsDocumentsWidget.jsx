import {
  CheckOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined,
  InboxOutlined,
  PaperClipOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Tabs, Tooltip } from "antd";

import AlertComponent from "../../../helpers/alert/AlertComponent";
import { filesServices } from "../../../helpers/services/FilesServices";
import { Modal } from "../../../shared/ui/modal";
import { DocumentViewerModal } from "../../../features/beneficiary-document-reports/ui/DocumentViewerModal";
import { getAlertedProductsHistoryTabNames } from "../../../pages/alerted-products/api/alertedProductsFiltersApi";
import { useAlertedProductsDocuments } from "../model/useAlertedProductsDocuments";
import {
  DocumentsDescription,
  DocumentsHeader,
  DocumentsHeaderIcon,
  DocumentsIntro,
  DocumentsRoot,
  DocumentsShell,
  DocumentsTabs,
  DocumentsTitle,
  DocumentsUpload,
  EmptyFilesState,
  FileCurrentSection,
  FileItem,
  FileList,
  FileMain,
  FileMeta,
  FileName,
  FileTypeBadge,
  FilesSection,
  FilesTitle,
  FullHistoryEmpty,
  FullHistoryPanel,
  FullHistoryTabs,
  HistoryActionButton,
  HistoryActions,
  HistoryActiveBadge,
  HistoryItem,
  HistoryItemContent,
  HistoryLinkButton,
  HistoryLinkRow,
  HistoryMeta,
  HistoryName,
  HistoryNameRow,
  HistoryTimeline,
  HistoryUser,
  RemoveFileButton,
  SaveDocumentsButton,
  SaveDocumentsRow,
  SaveRequirementIndicator,
  SaveRequirementItem,
  SaveRequirements,
  SlotBadge,
  UploadErrorText,
  UploadPanel,
  UploadButton,
  UploadIconBadge,
  UploadInner,
  UploadMeta,
  UploadSlotHeader,
  UploadSlotHint,
  UploadSlotTitle,
  UploadSlotTitleRow,
  UploadTitle,
} from "./AlertedProductsDocumentsWidget.styles";

const formatFileSize = (sizeInBytes = 0) => {
  if (!sizeInBytes) {
    return "Tamaño no disponible";
  }

  const sizeInKb = sizeInBytes / 1024;

  if (sizeInKb < 1024) {
    return `${sizeInKb.toFixed(1)} KB`;
  }

  return `${(sizeInKb / 1024).toFixed(2)} MB`;
};

const extractDocumentPartName = (fileName = "") => {
  const withoutExtension = fileName.replace(/\.[^.]+$/, "");
  const parts = withoutExtension.split("_");
  return parts[2] ?? parts[parts.length - 1] ?? fileName;
};

const formatTimestamp = (timestamp) => {
  if (!timestamp) {
    return "";
  }

  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(timestamp));
};

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
  const [pdfViewer, setPdfViewer] = useState({ isOpen: false, url: null, title: "" });

  const closePdfViewer = () => {
    if (pdfViewer.url) URL.revokeObjectURL(pdfViewer.url);
    setPdfViewer({ isOpen: false, url: null, title: "" });
  };

  const handleDownloadFromViewer = () => {
    if (!pdfViewer.url) return;
    const anchor = document.createElement("a");
    anchor.href = pdfViewer.url;
    anchor.download = pdfViewer.title || "documento.pdf";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  useEffect(() => {
    getAlertedProductsHistoryTabNames()
      .then(setHistoryTabNames)
      .catch(() => {});
  }, []);

  const openEmptyHistoryModal = () => setIsEmptyHistoryModalOpen(true);
  const closeEmptyHistoryModal = () => setIsEmptyHistoryModalOpen(false);
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

  const uploadSlots = [
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

  const documentTabs = uploadSlots.map((slot) => {
    const currentFile = filesByCategory[slot.key];

    return {
      key: slot.key,
      label: slot.key === "pdf" ? "Cargar PDF" : "Cargar Excel",
      children: (
        <UploadPanel>
          <UploadSlotHeader>
            <UploadSlotTitleRow>
              <UploadSlotTitle>{slot.title}</UploadSlotTitle>
              <SlotBadge>{slot.label}</SlotBadge>
            </UploadSlotTitleRow>
            <UploadSlotHint>{slot.hint}</UploadSlotHint>
          </UploadSlotHeader>

          <DocumentsUpload
            multiple={false}
            fileList={[]}
            showUploadList={false}
            beforeUpload={buildBeforeUploadHandler(slot.key)}
            accept={slot.accept}
            disabled={!isUploadEnabled}
          >
            <UploadInner>
              <UploadIconBadge>
                <InboxOutlined />
              </UploadIconBadge>
              <UploadTitle>Arrastra el archivo o selecciónalo</UploadTitle>
              <UploadMeta>
                {isUploadEnabled
                  ? `Si cargas un nuevo archivo ${slot.label}, reemplazará el actual.`
                  : "Selecciona una jornada y aplica los filtros para habilitar la carga."}
              </UploadMeta>
              <UploadButton icon={<UploadOutlined />} disabled={!isUploadEnabled}>
                Seleccionar archivo
              </UploadButton>
            </UploadInner>
          </DocumentsUpload>

          <FilesSection>
            <FilesTitle>Archivo actual</FilesTitle>

            {currentFile ? (
              <FileCurrentSection>
                <FileList>
                  <FileItem>
                    <FileMain>
                      <FileTypeBadge>{slot.label}</FileTypeBadge>
                      <Tooltip title={currentFile.name}>
                        <FileName>{currentFile.name}</FileName>
                      </Tooltip>
                      <FileMeta>{formatFileSize(currentFile.size)}</FileMeta>
                    </FileMain>

                    <RemoveFileButton
                      type="text"
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemoveFile(slot.key)}
                    />
                  </FileItem>
                </FileList>
              </FileCurrentSection>
            ) : (
              <EmptyFilesState>
                No hay un archivo {slot.label} cargado actualmente.
              </EmptyFilesState>
            )}
          </FilesSection>
        </UploadPanel>
      ),
    };
  });

  const fullHistoryTabs = uploadSlots.map((slot) => {
    const history = historyByCategory[slot.key];
    const isPdf = slot.key === "pdf";

    const handleOpenPdf = async (item) => {
      const response = await filesServices.downloadFile(item.route);
      if (!response?.blob) return;
      const url = URL.createObjectURL(response.blob);
      setPdfViewer({ isOpen: true, url, title: item.name || "documento.pdf" });
    };

    const handleDownloadFile = async (item) => {
      const response = await filesServices.downloadFile(item.route);
      if (!response?.blob) return;
      const url = URL.createObjectURL(response.blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = item.name || (isPdf ? "documento.pdf" : "documento.xlsx");
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    };

    return {
      key: `history-${slot.key}`,
      label: isPdf ? historyTabNames.pdf : historyTabNames.excel,
      children: history.length ? (
        <FullHistoryPanel>
          <HistoryTimeline
            items={history.map((item, index) => {
              const isActive = index === 0;
              return {
                color: isActive ? "green" : "blue",
                children: (
                  <HistoryItem key={item.uid}>
                    <HistoryItemContent>
                      <HistoryNameRow>
                        <HistoryName>{extractDocumentPartName(item.name)}</HistoryName>
                        {isActive && <HistoryActiveBadge>Activo</HistoryActiveBadge>}
                      </HistoryNameRow>
                      <HistoryMeta><strong>Versión {history.length - index}</strong> · {formatTimestamp(item.uploadedAt)}</HistoryMeta>
                      <HistoryUser>{item.user || "---"}</HistoryUser>
                    </HistoryItemContent>
                    {item.route ? (
                      <HistoryActions>
                        {isPdf && (
                          <Tooltip title="Visualizar">
                            <HistoryActionButton
                              type="text"
                              icon={<EyeOutlined />}
                              onClick={() => handleOpenPdf(item)}
                            />
                          </Tooltip>
                        )}
                        <Tooltip title="Descargar">
                          <HistoryActionButton
                            type="text"
                            icon={<DownloadOutlined />}
                            onClick={() => handleDownloadFile(item)}
                          />
                        </Tooltip>
                      </HistoryActions>
                    ) : null}
                  </HistoryItem>
                ),
              };
            })}
          />
        </FullHistoryPanel>
      ) : (
        <FullHistoryEmpty>
          No hay registros en el historial de {isPdf ? "PDF" : "Excel"}.
        </FullHistoryEmpty>
      ),
    };
  });

  const hasAnyHistory = uploadSlots.some((slot) => historyByCategory[slot.key].length);
  const hasSelectedJourney = Boolean(journey?.value);
  const hasSelectedPdf = Boolean(filesByCategory.pdf);
  const hasSelectedExcel = Boolean(filesByCategory.excel);

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
            Adjunta los soportes que respaldan la gestión de alertas para la jornada seleccionada.
          </DocumentsDescription>
        </DocumentsIntro>

        <DocumentsTabs>
          <Tabs defaultActiveKey="pdf" items={documentTabs} />
        </DocumentsTabs>

        <SaveRequirements>
          <SaveRequirementItem $isMet={hasSelectedJourney}>
            <SaveRequirementIndicator $isMet={hasSelectedJourney}>
              {hasSelectedJourney ? <CheckCircleOutlined /> : <CheckOutlined />}
            </SaveRequirementIndicator>
            Jornada seleccionada
          </SaveRequirementItem>

          <SaveRequirementItem $isMet={hasSelectedPdf}>
            <SaveRequirementIndicator $isMet={hasSelectedPdf}>
              {hasSelectedPdf ? <CheckCircleOutlined /> : <CheckOutlined />}
            </SaveRequirementIndicator>
            PDF seleccionado
          </SaveRequirementItem>

          <SaveRequirementItem $isMet={hasSelectedExcel}>
            <SaveRequirementIndicator $isMet={hasSelectedExcel}>
              {hasSelectedExcel ? <CheckCircleOutlined /> : <CheckOutlined />}
            </SaveRequirementIndicator>
            Excel seleccionado
          </SaveRequirementItem>
        </SaveRequirements>

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
            onClick={hasAnyHistory ? openHistoryModal : openEmptyHistoryModal}
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
        onCloseModal={closeEmptyHistoryModal}
        footer={null}
        centered
        destroyOnClose={false}
      >
        <FullHistoryEmpty>
          La Jornada seleccionada no tiene documentos asociados.
        </FullHistoryEmpty>
      </Modal>

      <DocumentViewerModal
        isOpen={pdfViewer.isOpen}
        title="Visor de documento"
        subtitle={pdfViewer.title}
        documentUrl={pdfViewer.url}
        onClose={closePdfViewer}
        onDownload={handleDownloadFromViewer}
      />
    </DocumentsShell>
  );
};
