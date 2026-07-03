import styled from "@emotion/styled";
import { Button, Card } from "antd";

/* ── Contenedor del widget ─────────────────────────────── */

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

/* ── Campos ────────────────────────────────────────────── */

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

/* ── Átomos compartidos por las modales ────────────────── */

export const ModalInfoBanner = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 10px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #1e3a8a;
  font-size: 0.84rem;
  line-height: 1.5;
  margin-bottom: 16px;
`;

export const AddAlertRowButton = styled(Button)`
  && {
    height: 36px;
    border-radius: 8px;
    font-size: 0.84rem;
    font-weight: 700;
    padding: 0 18px;
    box-shadow: none;
    background: #16a34a;
    border-color: #16a34a;
    color: #ffffff;
  }

  &&:hover,
  &&:focus {
    background: #15803d !important;
    border-color: #15803d !important;
    color: #ffffff !important;
  }

  &&:disabled {
    background: #e2e8f0 !important;
    border-color: #e2e8f0 !important;
    color: #94a3b8 !important;
  }
`;