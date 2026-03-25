import { Col, Row } from "antd";
import { DashboardPageContainer, DashboardPageWrapper } from "./DashboardPage.styles";
import { WelcomeBanner } from "../../../widgets/dashboard";

export const DashboardPage = () => {
    return (
        <DashboardPageWrapper>
            <DashboardPageContainer>
                <WelcomeBanner />
            </DashboardPageContainer>
            <DashboardPageContainer>
                <Row gutter={[24, 24]}>
                    <Col span={24}>
                        {/* Sección de Alertas */}
                    </Col>
                    <Col span={24}>
                        {/* Sección de Gráficas */}
                    </Col>
                </Row>
            </DashboardPageContainer>
        </DashboardPageWrapper>
    );
};
