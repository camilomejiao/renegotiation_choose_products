import styled from "@emotion/styled";
import { Card } from "antd";

export const UnderConstructionWrapper = styled(Card)`
  border-radius: 20px;
  border: 1px solid #dbe4f0;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);

  .ant-card-body {
    padding: 24px;
  }
`;

export const UnderConstructionBody = styled.div`
  display: grid;
  gap: 10px;
`;

export const UnderConstructionTitle = styled.h3`
  margin: 0;
  color: #0f172a;
  font-size: 1rem;
  font-weight: 800;
`;

export const UnderConstructionText = styled.p`
  margin: 0;
  color: #475569;
  line-height: 1.6;
`;

export const BackButton = styled.button`
  height: 42px;
  min-width: 120px;
  border-radius: 12px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #334155;
  font-weight: 600;
  cursor: pointer;
`;