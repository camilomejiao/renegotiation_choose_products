import styled from "@emotion/styled";
import { Card, Space } from "antd";

export const ManagementSectionCard = styled(Card)`
  && {
    border-radius: 16px;
    border: 1px solid #dbe4f0;
    box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08);
  }
`;

export const ManagementToolbar = styled(Space)`
  width: 100%;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

export const ManagementSearchSlot = styled.div`
  width: min(100%, 420px);
  min-width: 240px;

  @media (max-width: 768px) {
    width: 100%;
    min-width: 0;
  }
`;

export const ManagementTableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;
