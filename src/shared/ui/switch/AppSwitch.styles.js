import styled from "@emotion/styled";
import { Switch } from "antd";

export const StyledAppSwitch = styled(Switch)`
  &.ant-switch {
    background: rgba(100, 116, 139, 0.45);
  }

  &.ant-switch:hover:not(.ant-switch-disabled) {
    background: rgba(100, 116, 139, 0.6);
  }

  &.ant-switch.ant-switch-checked {
    background: #198754;
  }

  &.ant-switch.ant-switch-checked:hover:not(.ant-switch-disabled) {
    background: #157347;
  }
`;
