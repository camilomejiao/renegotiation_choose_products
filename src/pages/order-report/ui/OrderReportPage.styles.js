import styled from "@emotion/styled";
import { Card, Divider } from "antd";

export const HeaderSection = styled.div`
  position: relative;
  z-index: 2;
`;

export const ContentSection = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  padding: 12px 12px 24px;

  @media (min-width: 992px) {
    padding: 12px 24px 32px;
  }
`;

export const StyledDivider = styled(Divider)`
  margin: 0;
`;

export const ToolbarCard = styled(Card)`
  width: 100%;
  max-width: 100%;
  min-width: 0;
  border-radius: 12px;

  .ant-card-body {
    width: 100%;
    max-width: 100%;
    min-width: 0;
  }
`;

export const ToolbarDivider = styled(Divider)`
  margin: 12px 0 16px;
`;

export const TableCard = styled(Card)`
  width: 100%;
  max-width: 100%;
  min-width: 0;
  border-radius: 12px;
  overflow: hidden;

  .ant-card-body {
    width: 100%;
    max-width: 100%;
    min-width: 0;
    overflow-x: auto;
  }
`;

export const DeleteModalFooter = styled.div`
  width: 100%;
  text-align: right;

  > * + * {
    margin-left: 12px;
  }
`;
