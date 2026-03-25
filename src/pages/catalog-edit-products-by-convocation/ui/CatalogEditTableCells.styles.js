import styled from "@emotion/styled";
import { Input, InputNumber, Select } from "antd";

export const CellSelect = styled(Select)`
  width: 100%;
`;

export const CellInput = styled(Input)`
  width: 100%;
`;

export const CellInputNumber = styled(InputNumber)`
  width: 100%;
`;

export const RowNameText = styled.span`
  display: inline-block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
