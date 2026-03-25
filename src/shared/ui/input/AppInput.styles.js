import styled from "@emotion/styled";
import { Input } from "antd";
import { CONTROL_HEIGHT } from "../lib/controlMetrics";

const inputStyles = `
  width: 100%;
  min-height: ${CONTROL_HEIGHT}px;
  border-radius: 8px;
  border-color: #86b7a0;
  padding: 0 12px;
  transition: all 0.2s ease;

  &:hover {
    border-color: #198754;
  }

  &:focus,
  &.ant-input-focused {
    border-color: #198754;
    box-shadow: 0 0 0 2px rgba(25, 135, 84, 0.2);
  }

  &.ant-input-disabled,
  &[disabled] {
    color: #475569;
    background: #f8fafc;
    border-color: #dbe4f0;
  }
`;

export const StyledInput = styled(Input)`
  ${inputStyles}
`;

export const StyledPasswordInput = styled(Input.Password)`
  ${inputStyles}
`;
