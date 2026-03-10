import styled from "@emotion/styled";
import { Flex, Typography } from "antd";

const { Title } = Typography;

export const ConexPageLayout = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background:
    radial-gradient(circle at top left, rgba(30, 58, 138, 0.08), transparent 32%),
    linear-gradient(180deg, #f8fbff 0%, #eef5fb 100%);
`;

export const ConexStatusCard = styled(Flex)`
  width: 100%;
  max-width: 420px;
  padding: 32px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.12);
  border: 1px solid rgba(148, 163, 184, 0.24);
`;

export const ConexStatusTitle = styled(Title)`
  && {
    margin: 0;
  }
`;
