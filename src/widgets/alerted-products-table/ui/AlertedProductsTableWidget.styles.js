import styled from "@emotion/styled";
import { Button, Card, Radio } from "antd";

export const TableCard = styled(Card)`
  border-radius: 20px;
  border: 1px solid #dbe4f0;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);

  .ant-card-body {
    padding: 0;
  }
`;

export const TableWidgetRoot = styled.section`
  display: grid;
`;

export const TableHeader = styled.div`
  display: grid;
  gap: 6px;
  padding: 20px 20px 16px;
  border-bottom: 1px solid #e2e8f0;
`;

export const TableHeaderTopRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`;

export const TableHeaderActions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

export const TableTitle = styled.h3`
  margin: 0;
  color: #0f172a;
  font-size: 1rem;
  font-weight: 800;
`;

export const TableDescription = styled.p`
  margin: 0;
  color: #64748b;
  font-size: 0.88rem;
  line-height: 1.45;
`;

export const TableContent = styled.div`
  padding: 0 16px 16px;
  width: 100%;
  overflow-x: auto;

  .ant-table-wrapper {
    min-width: 0;
  }

  .ant-table-thead > tr > th {
    vertical-align: middle;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .ant-table-thead .ant-table-column-title {
    display: block;
    width: 100%;
    white-space: normal;
    line-height: 1.15;
    text-align: center;
  }
`;

export const AssignManagementButton = styled(Button)`
  && {
    height: 42px;
    border-radius: 12px;
    font-weight: 700;
    box-shadow: none;
  }
`;

export const RaiseAlertButton = styled(Button)`
  && {
    height: 42px;
    border-radius: 12px;
    font-weight: 700;
    box-shadow: none;
  }
`;

export const AssignmentModalContent = styled.section`
  display: grid;
  gap: 18px;
`;

export const AssignmentSummary = styled.div`
  color: #0f172a;
  font-size: 0.95rem;
  font-weight: 700;
`;

export const AssignmentDescription = styled.p`
  margin: 0;
  color: #475569;
  font-size: 0.9rem;
  line-height: 1.5;
`;

export const AssignmentOptionsGroup = styled(Radio.Group)`
  width: 100%;
  display: grid;
  gap: 12px;
`;

export const AssignmentOptionCard = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px solid ${({ $isActive }) => ($isActive ? "#2563eb" : "#dbe4f0")};
  background: ${({ $isActive }) => ($isActive ? "#eff6ff" : "#ffffff")};
  cursor: pointer;
  transition: all 0.2s ease;
`;

export const AssignmentOptionBody = styled.div`
  display: grid;
  gap: 6px;
`;

export const AssignmentOptionTitle = styled.div`
  color: #334155;
  font-size: 0.92rem;
  font-weight: 800;
  text-transform: uppercase;
`;

export const AssignmentOptionDescription = styled.p`
  margin: 0;
  color: #64748b;
  font-size: 0.84rem;
  line-height: 1.45;
`;

export const AssignmentHint = styled.div`
  padding: 14px 16px;
  border-radius: 12px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #334155;
  font-size: 0.86rem;
  line-height: 1.5;
`;

export const AssignmentFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  flex-wrap: wrap;
`;

export const AssignmentSecondaryButton = styled(Button)`
  && {
    height: 42px;
    min-width: 120px;
    border-radius: 12px;
    font-weight: 600;
    box-shadow: none;
  }
`;

export const AssignmentPrimaryButton = styled(Button)`
  && {
    height: 42px;
    min-width: 160px;
    border-radius: 12px;
    font-weight: 700;
    box-shadow: none;
  }
`;
