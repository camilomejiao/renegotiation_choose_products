import styled from "@emotion/styled";
import { Card } from "antd";

export const TabsContainer = styled.section`
  padding: 40px 24px 24px;
  width: 100%;
  max-width: 100%;
  min-width: 0;

  @media (max-width: 768px) {
    padding: 24px 12px 12px;
  }
`;

export const TabsCard = styled(Card)`
  && {
    width: 100%;
    max-width: 100%;
    min-width: 0;
    border-radius: 20px;
    border: 1px solid #dbe4f0;
    box-shadow: 0 18px 48px rgba(15, 23, 42, 0.08);
  }

  .ant-card-body,
  .ant-tabs,
  .ant-tabs-content-holder,
  .ant-tabs-content,
  .ant-tabs-tabpane {
    width: 100%;
    max-width: 100%;
    min-width: 0;
  }

  .ant-tabs-nav {
    margin-bottom: 0;
  }

  .ant-tabs-nav-wrap {
    min-width: 0;
  }
`;
