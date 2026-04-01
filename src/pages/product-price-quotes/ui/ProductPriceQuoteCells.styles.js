import styled from "@emotion/styled";
import { Input, InputNumber, Typography } from "antd";

const { Text } = Typography;
const { TextArea } = Input;

export const CellInput = styled(Input)`
  width: 100%;
`;

export const CellTextArea = styled(TextArea)`
  width: 100%;
`;

export const CellInputNumber = styled(InputNumber)`
  width: 100%;
`;

export const WrappedCellText = styled(Text)`
  display: block;
  width: 100%;
  white-space: normal;
  word-break: break-word;
  overflow-wrap: anywhere;
  line-height: 1.4;
`;
