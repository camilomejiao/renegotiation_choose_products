import {
  ReviewFieldLabel, ReviewPanel, ReviewSubmitButton, ReviewSubmitRow,
  ReviewTextArea, ReviewUploadBox, ReviewUploadInput, ReviewUploadText,
} from "./detail.styles";
import { DetailSectionTitle } from "./detail.styles";

export const AlertManagementReviewPanel = ({
  observation, files, onChange, onFilesChange, onSubmit,
}) => (
  <ReviewPanel bordered={false}>
    <DetailSectionTitle>Observación del revisor</DetailSectionTitle>
    <div style={{ display: "grid", gap: 8 }}>
      <ReviewFieldLabel>Observación <span style={{ color: "#dc2626" }}>*</span></ReviewFieldLabel>
      <ReviewTextArea
        value={observation}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Registra la observación del revisor"
      />
    </div>
    <div style={{ display: "grid", gap: 8 }}>
      <ReviewFieldLabel>Adjuntos del revisor</ReviewFieldLabel>
      <ReviewUploadBox>
        <ReviewUploadInput type="file" multiple onChange={onFilesChange} />
        <ReviewUploadText>
          {files.length ? files.map((f) => f.name).join(", ") : "Elegir archivos"}
        </ReviewUploadText>
      </ReviewUploadBox>
    </div>
    <ReviewSubmitRow>
      <ReviewSubmitButton onClick={onSubmit}>Enviar a Subsanación</ReviewSubmitButton>
    </ReviewSubmitRow>
  </ReviewPanel>
);