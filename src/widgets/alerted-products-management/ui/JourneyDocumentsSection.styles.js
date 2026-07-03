import styled from "@emotion/styled";
import { Button } from "antd";

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