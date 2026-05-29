import styled from "@emotion/styled";
import { Button, Card, Tag } from "antd";

export const CentralizationCard = styled(Card)`
  border-radius: 20px;
  border: 1px solid #dbe4f0;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);

  .ant-card-body {
    display: grid;
    gap: 20px;
    padding: 24px;
  }
`;

export const CentralizationHeader = styled.div`
  display: grid;
  gap: 6px;
`;

export const CentralizationTitle = styled.h3`
  margin: 0;
  color: #0f172a;
  font-size: 1.15rem;
  font-weight: 800;
`;

export const CentralizationDescription = styled.p`
  margin: 0;
  color: #64748b;
  font-size: 0.92rem;
  line-height: 1.5;
`;

export const CentralizationTag = styled(Tag)`
  && {
    width: fit-content;
    margin: 0;
    padding: 6px 12px;
    border-radius: 999px;
    font-size: 0.82rem;
    font-weight: 700;
  }
`;

export const CentralizationNotice = styled.div`
  padding: 18px 20px;
  border-radius: 16px;
  border: 1px solid #dbe4f0;
  background: #f8fafc;
  color: #334155;
  font-size: 0.9rem;
  line-height: 1.55;
`;

export const BackButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const BackButton = styled(Button)`
  && {
    height: 42px;
    min-width: 180px;
    border-radius: 12px;
    font-weight: 600;
    box-shadow: none;
  }
`;
