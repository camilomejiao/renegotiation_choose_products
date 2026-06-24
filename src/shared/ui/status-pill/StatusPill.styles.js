import styled from "@emotion/styled";
import { Tag } from "antd";

export const StyledStatusPill = styled(Tag)`
  && {
    margin-inline-end: 0;
    border-radius: 999px;
    padding: ${({ $padding }) => $padding};
    min-height: ${({ $minHeight }) => $minHeight};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: ${({ $fontSize }) => $fontSize};
    font-weight: ${({ $fontWeight }) => $fontWeight};
    line-height: 1.1;
    text-transform: ${({ $uppercase }) => ($uppercase ? "uppercase" : "none")};
    white-space: normal;
    border-color: ${({ $borderColor }) => $borderColor || undefined};
    background: ${({ $backgroundColor }) => $backgroundColor || undefined};
    color: ${({ $textColor }) => $textColor || undefined};
  }
`;
