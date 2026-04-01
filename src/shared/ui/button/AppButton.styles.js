import styled from "@emotion/styled";
import { Button } from "antd";
import { CONTROL_HEIGHT } from "../lib/controlMetrics";

const variantStyles = {
  primary: {
    background: "#1e3a8a",
    border: "#1e3a8a",
    color: "#ffffff",
    hoverBackground: "#3b82f6",
    hoverBorder: "#3b82f6",
    hoverColor: "#ffffff",
  },
  secondary: {
    background: "#ffffff",
    border: "#cbd5e1",
    color: "#0f172a",
    hoverBackground: "#f8fafc",
    hoverBorder: "#94a3b8",
    hoverColor: "#0f172a",
  },
  success: {
    background: "#198754",
    border: "#198754",
    color: "#ffffff",
    hoverBackground: "#157347",
    hoverBorder: "#157347",
    hoverColor: "#ffffff",
  },
  ghost: {
    background: "transparent",
    border: "#cbd5e1",
    color: "#0f172a",
    hoverBackground: "#eff6ff",
    hoverBorder: "#93c5fd",
    hoverColor: "#0f172a",
  },
};

export const StyledAppButton = styled(Button)`
  && {
    height: ${CONTROL_HEIGHT}px;
    border-radius: 10px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-weight: 600;
    padding-inline: 16px;
    border-style: solid;
    box-shadow: none;
    background: ${({ $variant }) =>
      variantStyles[$variant]?.background || variantStyles.primary.background};
    border-color: ${({ $variant }) =>
      variantStyles[$variant]?.border || variantStyles.primary.border};
    color: ${({ $variant }) =>
      variantStyles[$variant]?.color || variantStyles.primary.color};

    &:hover,
    &:focus,
    &:active {
      background: ${({ $variant }) =>
        variantStyles[$variant]?.hoverBackground || variantStyles.primary.hoverBackground} !important;
      border-color: ${({ $variant }) =>
        variantStyles[$variant]?.hoverBorder || variantStyles.primary.hoverBorder} !important;
      color: ${({ $variant }) =>
        variantStyles[$variant]?.hoverColor || variantStyles.primary.hoverColor} !important;
    }

    &:disabled,
    &.ant-btn:disabled {
      opacity: 0.65;
      color: ${({ $variant }) =>
        variantStyles[$variant]?.color || variantStyles.primary.color};
    }
  }
`;
