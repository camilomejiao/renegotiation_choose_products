import styled from "@emotion/styled";
import { Input } from "antd";
import { CONTROL_HEIGHT } from "../lib/controlMetrics";

export const StyledSearchInput = styled(Input)`
  && {
    width: 100%;
    min-height: ${CONTROL_HEIGHT}px;
    height: ${CONTROL_HEIGHT}px;
    border-radius: 8px;
  }
`;
