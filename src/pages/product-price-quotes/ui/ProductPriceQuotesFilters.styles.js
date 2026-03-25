import styled from "@emotion/styled";
import { Flex, Typography } from "antd";

const { Text } = Typography;

export const SwitchField = styled(Flex)`
  min-height: 42px;
  padding: 0 12px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  background: #ffffff;
`;

export const SwitchLabel = styled(Text)`
  font-weight: 500;
`;
