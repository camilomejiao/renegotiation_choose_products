import styled from "@emotion/styled";
import { Button, Input } from "antd";

export const SolicitudGrid = styled.div`
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 16px;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
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