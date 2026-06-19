import { Tag } from "antd";
import styled from "@emotion/styled";
import { getTitularStatusColor } from "../model/selectors";

export const BeneficiaryStatusPill = ({ status }) => (
  <StyledStatusTag color={getTitularStatusColor(status)}>
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
