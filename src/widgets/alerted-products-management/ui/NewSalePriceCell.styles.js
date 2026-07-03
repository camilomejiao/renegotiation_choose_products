import styled from "@emotion/styled";
import { InputNumber } from "antd";

export const NewPriceInput = styled(InputNumber)`
  && {
    width: 150px;
    border-radius: 8px;
  }

  &&:not(.ant-input-number-status-error) {
    border-color: #cbd5e1;
  }

  &&:hover:not(.ant-input-number-status-error),
  &&.ant-input-number-focused:not(.ant-input-number-status-error) {
    border-color: #2563eb;
    box-shadow: none;
  }

  && .ant-input-number-input {
    text-align: right;
    font-weight: 700;
    color: #0f172a;
  }
`;