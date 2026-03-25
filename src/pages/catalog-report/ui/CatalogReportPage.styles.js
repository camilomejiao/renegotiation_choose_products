import styled from "@emotion/styled";
import { Button, Card, Col, Divider, Space } from "antd";
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

export const ReportTableCard = styled(Card)`
  width: 100%;
  border-radius: 12px;
`;

export const ActionsSpace = styled(Space)`
  width: 100%;
  justify-content: flex-start;

  @media (min-width: 992px) {
    justify-content: flex-end;
  }
`;

export const SearchButton = styled(Button)`
  width: 100%;
  height: ${CONTROL_HEIGHT}px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-color: #198754;
  color: #198754;
  background: #ffffff;
  font-weight: 600;

  &:hover,
  &:focus {
    border-color: #146c43 !important;
    color: #ffffff !important;
    background: #198754 !important;
  }
`;

export const SearchButtonCol = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: flex-start;

  @media (min-width: 992px) {
    justify-content: flex-end;
  }
`;
