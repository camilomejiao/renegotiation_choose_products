import styled from "@emotion/styled";
import { Button, Card, List, Tag } from "antd";

export const ManagementCard = styled(Card)`
  border-radius: 20px;
  border: 1px solid #dbe4f0;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);

  .ant-card-body {
    display: grid;
    gap: 20px;
    padding: 24px;
  }
`;

export const ManagementHeader = styled.div`
  display: grid;
  gap: 6px;
`;

export const ManagementTitle = styled.h3`
  margin: 0;
  color: #0f172a;
  font-size: 1.15rem;
  font-weight: 800;
`;

export const ManagementDescription = styled.p`
  margin: 0;
  color: #64748b;
  font-size: 0.92rem;
  line-height: 1.5;
`;

export const ManagementSummary = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

export const SummaryTag = styled(Tag)`
  && {
    margin: 0;
    padding: 6px 12px;
    border-radius: 999px;
    font-size: 0.82rem;
    font-weight: 700;
  }
`;

export const ManagementSection = styled.section`
  display: grid;
  gap: 12px;
`;

export const SectionTitle = styled.h4`
  margin: 0;
  color: #334155;
  font-size: 0.96rem;
  font-weight: 800;
`;

export const ProductsList = styled(List)`
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  background: #ffffff;

  .ant-list-item {
    padding: 14px 16px;
  }
`;

export const ProductListItem = styled(List.Item)``;

export const ProductRow = styled.div`
  display: grid;
  gap: 4px;
`;

export const ProductTitle = styled.div`
  color: #0f172a;
  font-size: 0.9rem;
  font-weight: 700;
`;

export const ProductMeta = styled.div`
  color: #64748b;
  font-size: 0.82rem;
`;

export const ActionsRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  flex-wrap: wrap;
`;

export const SecondaryActionButton = styled(Button)`
  && {
    height: 42px;
    min-width: 160px;
    border-radius: 12px;
    font-weight: 600;
    box-shadow: none;
  }
`;

export const PrimaryActionButton = styled(Button)`
  && {
    height: 42px;
    min-width: 220px;
    border-radius: 12px;
    font-weight: 700;
    box-shadow: none;
  }
`;
