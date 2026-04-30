import styled from "@emotion/styled";
import { Card, Divider } from "antd";

export const HeaderSection = styled.div`
  position: relative;
  z-index: 2;
`;

export const ContentSection = styled.div`
  position: relative;
  z-index: 1;
  padding: 12px 12px 24px;

  @media (min-width: 992px) {
    padding: 12px 24px 32px;
  }
`;

export const StyledDivider = styled(Divider)`
  margin: 0;
`;

export const ToolbarCard = styled(Card)`
  width: 100%;
  border-radius: 12px;
`;

export const ToolbarDivider = styled(Divider)`
  margin: 12px 0 16px;
`;

export const TableCard = styled(Card)`
  width: 100%;
  border-radius: 12px;
`;

export const DeleteModalFooter = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;
