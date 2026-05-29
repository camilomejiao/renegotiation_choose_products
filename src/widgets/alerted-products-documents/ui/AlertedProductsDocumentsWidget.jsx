import {
  DeleteOutlined,
  InboxOutlined,
  PaperClipOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { Tabs, Tooltip } from "antd";

import { Modal } from "../../../shared/ui/modal";
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
  HistoryItem,
  HistoryLinkButton,
  HistoryLinkRow,
  HistoryMeta,
  HistoryName,
  HistoryTimeline,
  HistoryUser,
  RemoveFileButton,
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

const formatTimestamp = (timestamp) => {
  if (!timestamp) {
    return "";
  }

  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(timestamp));
};

export const AlertedProductsDocumentsWidget = ({ currentUser }) => {
  const [uploadError, setUploadError] = useState("");
  const {
    closeHistoryModal,
    filesByCategory,
    isHistoryModalOpen,
    historyByCategory,
    handleBeforeUpload,
    handleRemoveFile,
    openHistoryModal,
  } = useAlertedProductsDocuments({ currentUser });

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

  const buildBeforeUploadHandler = (category) => (file) => {
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
          >
            <UploadInner>
              <UploadIconBadge>
                <InboxOutlined />
              </UploadIconBadge>
              <UploadTitle>Arrastra el archivo o selecciónalo</UploadTitle>
              <UploadMeta>
                Si cargas un nuevo archivo {slot.label}, reemplazará el actual.
              </UploadMeta>
              <UploadButton icon={<UploadOutlined />}>
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

    return {
      key: `history-${slot.key}`,
      label: slot.key === "pdf" ? "Historial PDF" : "Historial Excel",
      children: history.length ? (
        <FullHistoryPanel>
          <HistoryTimeline
            items={history.map((item) => ({
              color: "blue",
              children: (
                <HistoryItem key={item.uid}>
                  <HistoryName>{item.name}</HistoryName>
                  <HistoryMeta>{formatTimestamp(item.uploadedAt)}</HistoryMeta>
                  <HistoryUser>{item.user || "---"}</HistoryUser>
                </HistoryItem>
              ),
            }))}
          />
        </FullHistoryPanel>
      ) : (
        <FullHistoryEmpty>
          No hay registros en el historial de {slot.key === "pdf" ? "PDF" : "Excel"}.
        </FullHistoryEmpty>
      ),
    };
  });

  const hasAnyHistory = uploadSlots.some((slot) => historyByCategory[slot.key].length);

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

        {hasAnyHistory ? (
          <HistoryLinkRow>
            <HistoryLinkButton type="link" onClick={openHistoryModal}>
              Ver historial completo
            </HistoryLinkButton>
          </HistoryLinkRow>
        ) : null}

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
    </DocumentsShell>
  );
};
