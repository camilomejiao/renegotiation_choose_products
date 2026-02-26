import { Col, Row } from "antd";
import { WelcomeBanner } from "../../../../shared/ui/dashboard/WelcomeBanner";
import { DashboardContainer, DashboardWrapper } from "./Dashboard.styles";

export const Dashboard = () => {
    return (
        <DashboardWrapper>
            <DashboardContainer>
                <WelcomeBanner />
            </DashboardContainer>
            <DashboardContainer>
                <Row gutter={[24, 24]}>
                    <Col span={24}>
                        {/* Sección de Alertas */}
                    </Col>
                    <Col span={24}>
                        {/* Sección de Gráficas */}
                    </Col>
                </Row>
            </DashboardContainer>
        </DashboardWrapper>
    );
};
