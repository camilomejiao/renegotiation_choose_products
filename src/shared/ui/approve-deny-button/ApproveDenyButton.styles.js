import styled from "@emotion/styled";
import { Button } from "antd";
import { CONTROL_HEIGHT } from "../lib/controlMetrics";

export const StyledApproveDenyButton = styled(Button)`
  height: ${CONTROL_HEIGHT}px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-color: ${({ $borderColor }) => $borderColor};
  color: ${({ $textColor }) => $textColor};
  background: transparent;

  &:hover,
  &:focus,
  &:active {
    border-color: ${({ $hoverBg }) => $hoverBg} !important;
    background: ${({ $hoverBg }) => $hoverBg} !important;
    color: ${({ $hoverText }) => $hoverText} !important;
    font-weight: 500;
  }
`;
