import styled from "@emotion/styled";
import { InputNumber, Select, Tag } from "antd";

export const WrappedText = styled.span`
  display: block;
  width: 100%;
  white-space: normal;
  word-break: break-word;
  overflow-wrap: anywhere;
  line-height: 1.35;
`;

export const ObservationText = styled(WrappedText)`
  font-size: 12px;
`;

export const BinarySelect = styled(Select)`
  width: 100%;
`;

export const CompactInput = styled(InputNumber)`
  width: 100%;
`;

export const CompactSelect = styled(Select)`
  width: 100%;
`;

export const StatusTag = styled(Tag)`
  margin-inline-end: 0;
  font-weight: 600;
`;
