import styled from "@emotion/styled";
import { Button, Card, Divider, Space } from "antd";
import { CONTROL_HEIGHT } from "../../../shared/ui/lib/controlMetrics";

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

export const ToolbarDivider = styled(Divider)`
  margin: 12px 0 16px;
`;

export const ToolbarCard = styled(Card)`
  width: 100%;
  border-radius: 12px;
`;

export const TableCard = styled(Card)`
  width: 100%;
  border-radius: 12px;
`;

export const ActionsSpace = styled(Space)`
  width: 100%;
  justify-content: flex-start;
  flex-wrap: wrap;

  @media (min-width: 992px) {
    justify-content: flex-end;
  }
`;

export const ActionButton = styled(Button)`
  height: ${CONTROL_HEIGHT}px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export const SaveSection = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;
`;

export const TableContainer = styled.div`
  width: 100%;
`;
