import styled from "@emotion/styled";
import { Checkbox } from "antd";

export const StyledAppCheckbox = styled(Checkbox)`
  .ant-checkbox-inner {
    border-radius: 6px;
  }

  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #198754;
    border-color: #198754;
  }
`;
