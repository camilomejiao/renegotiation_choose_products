import styled from "@emotion/styled";
import { Button } from "antd";

const actionButtonShouldForwardProp = (prop) =>
  !["$borderColor", "$textColor", "$hoverBg", "$hoverText"].includes(prop);

const baseActionButtonStyles = `
  && {
    background: transparent;

    &:hover,
    &:focus {
      box-shadow: none;
    }
  }
`;

export const WarningActionButton = styled(Button, {
  shouldForwardProp: actionButtonShouldForwardProp,
})`
  ${baseActionButtonStyles}

  && {
    border-color: ${({ $borderColor }) => $borderColor};
    color: ${({ $textColor }) => $textColor};

    &:hover,
    &:focus {
      border-color: ${({ $hoverBg }) => $hoverBg} !important;
      background: ${({ $hoverBg }) => $hoverBg} !important;
      color: ${({ $hoverText }) => $hoverText} !important;
    }
  }
`;

export const PrimaryHoverActionButton = styled(Button, {
  shouldForwardProp: actionButtonShouldForwardProp,
})`
  ${baseActionButtonStyles}

  && {
    border-color: ${({ $borderColor }) => $borderColor};
    color: ${({ $textColor }) => $textColor};

    &:hover,
    &:focus {
      border-color: ${({ $hoverBg }) => $hoverBg} !important;
      background: ${({ $hoverBg }) => $hoverBg} !important;
      color: ${({ $hoverText }) => $hoverText} !important;
    }
  }
`;

export const DangerHoverActionButton = styled(Button, {
  shouldForwardProp: (prop) =>
    !["$borderColor", "$textColor", "$hoverBg", "$hoverText"].includes(prop),
})`
  ${baseActionButtonStyles}

  && {
    border-color: ${({ $borderColor }) => $borderColor};
    color: ${({ $textColor }) => $textColor};

    &:hover,
    &:focus {
      border-color: ${({ $hoverBg }) => $hoverBg} !important;
      background: ${({ $hoverBg }) => $hoverBg} !important;
      color: ${({ $hoverText }) => $hoverText} !important;
    }
  }
`;
