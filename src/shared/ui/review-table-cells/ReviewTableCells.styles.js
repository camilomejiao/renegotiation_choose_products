import styled from "@emotion/styled";

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
