import { DeleteOutlined, InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

import { formatFileSize } from "../lib/format";
import {
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
  RemoveFileButton,
  SlotBadge,
  UploadButton,
  UploadIconBadge,
  UploadInner,
  UploadMeta,
  UploadPanel,
  UploadSlotHeader,
  UploadSlotHint,
  UploadSlotTitle,
  UploadSlotTitleRow,
  UploadTitle,
} from "./DocumentUploadPanel.styles";

export const DocumentUploadPanel = ({
  slot,
  currentFile,
  isUploadEnabled,
  onBeforeUpload,
  onRemove,
}) => (
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
      beforeUpload={onBeforeUpload}
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
                onClick={onRemove}
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
);