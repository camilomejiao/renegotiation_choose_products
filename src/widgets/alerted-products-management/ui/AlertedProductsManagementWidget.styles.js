import styled from "@emotion/styled";
import { Button, Card, Input } from "antd";

export const ManagementCard = styled(Card)`
  border-radius: 20px;
  border: 1px solid #dbe4f0;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  overflow: hidden;

  .ant-card-body {
    display: grid;
    gap: 0;
    padding: 0;
  }
`;

export const ManagementBody = styled.div`
  display: grid;
  gap: 20px;
  padding: 24px;
`;

/* ── Secciones ─────────────────────────────────────────── */

export const SectionCard = styled.div`
  display: grid;
  gap: 14px;
  padding: 18px 20px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #ffffff;
`;

export const SectionTitle = styled.h4`
  margin: 0;
  color: #0f172a;
  font-size: 0.96rem;
  font-weight: 800;
`;

/* ── Documentos de Gestión de la Jornada ───────────────── */

export const JourneyDocumentsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const JourneyDocItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #f8fafc;
`;

export const JourneyDocIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  flex-shrink: 0;
  font-size: 1.15rem;
  background: ${({ $type }) => ($type === "excel" ? "#f0fdf4" : "#fef2f2")};
  border: 1px solid ${({ $type }) => ($type === "excel" ? "#bbf7d0" : "#fecaca")};
  color: ${({ $type }) => ($type === "excel" ? "#16a34a" : "#dc2626")};
`;

export const JourneyDocInfo = styled.div`
  display: grid;
  gap: 2px;
  flex: 1;
  min-width: 0;
`;

export const JourneyDocName = styled.div`
  color: #0f172a;
  font-size: 0.84rem;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const JourneyDocMeta = styled.div`
  color: #64748b;
  font-size: 0.74rem;
`;

export const JourneyDocActions = styled.div`
  display: flex;
  gap: 6px;
  flex-shrink: 0;
`;

export const JourneyDocButton = styled(Button)`
  && {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    min-width: 32px;
    border-radius: 8px;
    padding: 0;
    font-size: 0.88rem;
    color: #1e3a8a;
    border: 1px solid #bfdbfe;
    background: #eff6ff;
  }

  &&:hover,
  &&:focus {
    background: #dbeafe !important;
    border-color: #93c5fd !important;
    color: #1e40af !important;
  }
`;

export const JourneyDocEmpty = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border: 1px dashed #e2e8f0;
  border-radius: 12px;
  background: #f8fafc;
  color: #94a3b8;
  font-size: 0.84rem;
`;

/* ── Solicitud de Levantamiento ────────────────────────── */

export const SolicitudGrid = styled.div`
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 16px;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const FieldGroup = styled.div`
  display: grid;
  gap: 8px;
`;

export const FieldLabel = styled.label`
  color: #334155;
  font-size: 0.84rem;
  font-weight: 700;
`;

export const RequiredMark = styled.span`
  color: #dc2626;
  margin-left: 2px;
`;

export const ObservationTextArea = styled(Input.TextArea)`
  && {
    border-radius: 10px;
    resize: none;
    font-size: 0.88rem;
    line-height: 1.55;
  }
`;

export const ActaUploadZone = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 28px 16px;
  border: 2px dashed #bfdbfe;
  border-radius: 12px;
  background: #f8fafc;
  cursor: pointer;
  transition: all 0.2s;
  color: #2563eb;
  font-size: 0.88rem;
  font-weight: 600;
  min-height: 110px;
  text-align: center;

  .anticon {
    font-size: 1.4rem;
  }

  &:hover {
    border-color: #2563eb;
    background: #eff6ff;
  }
`;

export const ActaFileCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #ffffff;
  min-height: 110px;
`;

export const ActaFileTop = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
`;

export const ActaFileName = styled.span`
  flex: 1;
  min-width: 0;
  color: #0f172a;
  font-size: 0.84rem;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ActaFileActions = styled.div`
  display: flex;
  gap: 6px;
  flex-shrink: 0;
`;

export const ActaViewButton = styled(Button)`
  && {
    height: 32px;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 700;
    box-shadow: none;
    background: #eff6ff;
    border-color: #bfdbfe;
    color: #1e3a8a;
  }

  &&:hover,
  &&:focus {
    background: #dbeafe !important;
    border-color: #93c5fd !important;
    color: #1e40af !important;
  }
`;

export const ActaDownloadButton = styled(Button)`
  && {
    height: 32px;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 700;
    box-shadow: none;
    background: #f0fdf4;
    border-color: #bbf7d0;
    color: #15803d;
  }

  &&:hover,
  &&:focus {
    background: #dcfce7 !important;
    border-color: #86efac !important;
    color: #166534 !important;
  }
`;

export const ActaDeleteButton = styled(Button)`
  && {
    height: 32px;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 700;
    box-shadow: none;
    background: #fef2f2;
    border-color: #fecaca;
    color: #dc2626;
  }

  &&:hover,
  &&:focus {
    background: #fee2e2 !important;
    border-color: #fca5a5 !important;
    color: #b91c1c !important;
  }
`;

/* ── Acciones ──────────────────────────────────────────── */

export const ActionsRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  flex-wrap: wrap;
`;

export const SecondaryActionButton = styled(Button)`
  && {
    height: 42px;
    min-width: 120px;
    border-radius: 12px;
    font-weight: 600;
    box-shadow: none;
  }
`;

export const PrimaryActionButton = styled(Button)`
  && {
    height: 42px;
    min-width: 120px;
    border-radius: 12px;
    font-weight: 700;
    box-shadow: none;
    background: #16a34a;
    border-color: #16a34a;
  }

  &&:hover,
  &&:focus {
    background: #15803d !important;
    border-color: #15803d !important;
  }
`;