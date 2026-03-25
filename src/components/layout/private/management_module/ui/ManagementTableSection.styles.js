import styled from "@emotion/styled";
import { Card } from "antd";

export const ManagementSectionCard = styled(Card)`
  && {
    border-radius: 16px;
    border: 1px solid #dbe4f0;
    box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08);
  }
`;

export const ManagementSearchSlot = styled.div`
  width: 100%;
`;

export const ManagementTableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;
