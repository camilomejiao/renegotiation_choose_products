import { Tag } from "antd";
import styled from "@emotion/styled";
import { TITULAR_STATUS_COLORS } from "../model/constants";

export const BeneficiaryStatusPill = ({ status }) => (
  <StyledStatusTag color={TITULAR_STATUS_COLORS[status] || "default"}>
    {status || "---"}
  </StyledStatusTag>
);

const StyledStatusTag = styled(Tag)`
  && {
    margin-inline-end: 0;
    border-radius: 999px;
    padding-inline: 10px;
    font-weight: 600;
  }
`;
