import {
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined,
  FilePdfOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Upload } from "antd";

import { FieldGroup, FieldLabel, RequiredMark, SectionCard, SectionTitle } from "./common.styles";
import {
  ActaDeleteButton,
  ActaDownloadButton,
  ActaFileActions,
  ActaFileCard,
  ActaFileName,
  ActaFileTop,
  ActaUploadZone,
  ActaViewButton,
  ObservationTextArea,
  SolicitudGrid,
} from "./SolicitudForm.styles";

export const SolicitudForm = ({
  isPriceAdjustment,
  observation,
  onObservationChange,
  actaFile,
  onBeforeUploadActa,
  onViewActa,
  onDownloadActa,
  onRemoveActa,
}) => (
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
          onChange={(e) => onObservationChange(e.target.value)}
          rows={6}
          maxLength={1000}
          showCount
        />
      </FieldGroup>

      <FieldGroup>
        <FieldLabel>
          {isPriceAdjustment
            ? "Documento de Ajuste de Precio"
            : "Documento de Acta Complementaria"}{" "}
          <RequiredMark>*</RequiredMark>
        </FieldLabel>
        {actaFile ? (
          <ActaFileCard>
            <ActaFileTop>
              <FilePdfOutlined
                style={{ color: "#dc2626", fontSize: "1.25rem", flexShrink: 0 }}
              />
              <ActaFileName>{actaFile.name}</ActaFileName>
            </ActaFileTop>
            <ActaFileActions>
              <ActaViewButton icon={<EyeOutlined />} onClick={onViewActa}>
                Ver
              </ActaViewButton>
              <ActaDownloadButton icon={<DownloadOutlined />} onClick={onDownloadActa}>
                Descargar
              </ActaDownloadButton>
              <ActaDeleteButton icon={<DeleteOutlined />} onClick={onRemoveActa}>
                Eliminar
              </ActaDeleteButton>
            </ActaFileActions>
          </ActaFileCard>
        ) : (
          <Upload accept=".pdf" showUploadList={false} beforeUpload={onBeforeUploadActa}>
            <ActaUploadZone>
              <PlusOutlined />
              <span>Adjuntar PDF</span>
            </ActaUploadZone>
          </Upload>
        )}
      </FieldGroup>
    </SolicitudGrid>
  </SectionCard>
);