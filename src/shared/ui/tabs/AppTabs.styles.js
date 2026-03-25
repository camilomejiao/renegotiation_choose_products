import styled from "@emotion/styled";
import { Card } from "antd";

export const TabsContainer = styled.section`
  padding: 40px 24px 24px;
  display: grid;
  gap: 16px;

  @media (max-width: 768px) {
    padding: 24px 12px 12px;
  }
`;

export const TabsCard = styled(Card)`
  && {
    border-radius: 20px;
    border: 1px solid #dbe4f0;
    box-shadow: 0 18px 48px rgba(15, 23, 42, 0.08);
  }
`;
