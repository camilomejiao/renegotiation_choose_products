import { Spin, Typography } from "antd";

import {
  ConexPageLayout,
  ConexStatusCard,
  ConexStatusTitle,
} from "./ConexPage.styles";

const { Text } = Typography;

export const ConexPageStatus = () => {
  return (
    <ConexPageLayout>
      <ConexStatusCard vertical align="center" gap={12}>
        <Spin size="large" />
        <ConexStatusTitle level={4}>Validando acceso</ConexStatusTitle>
        <Text type="secondary">
          Estamos preparando tu sesión y redirigiéndote al sistema.
        </Text>
      </ConexStatusCard>
    </ConexPageLayout>
  );
};
