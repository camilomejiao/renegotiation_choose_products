import styled from "@emotion/styled";
import { Button, Card, Divider, Space } from "antd";

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

export const ActionsSpace = styled(Space)`
  width: 100%;
  justify-content: flex-start;

  @media (min-width: 992px) {
    justify-content: flex-end;
  }
`;

export const ToolbarCard = styled(Card)`
  width: 100%;
  border-radius: 12px;
`;

export const SmartTableCard = styled(Card)`
  width: 100%;
  border-radius: 12px;
`;

export const SuppliersViewButton = styled(Button, {
  shouldForwardProp: (prop) =>
    !["$borderColor", "$textColor", "$hoverBg", "$hoverText"].includes(prop),
})`
  border-color: ${({ $borderColor }) => $borderColor};
  background: transparent;
  color: ${({ $textColor }) => $textColor};

  &:hover,
  &:focus {
    border-color: ${({ $hoverBg }) => $hoverBg} !important;
    background: ${({ $hoverBg }) => $hoverBg} !important;
    color: ${({ $hoverText }) => $hoverText} !important;
  }
`;
