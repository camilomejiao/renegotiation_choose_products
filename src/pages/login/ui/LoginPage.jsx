import { Col } from "antd";
import { Header } from "../../../widgets/layout/header";
import { useLoginPage } from "../model/useLoginPage";
import {
  LoginCard,
  LoginPageLayout,
  LoginPageRow,
} from "./LoginPage.styles";
import { LoginPageForm } from "./LoginPageForm";
import { LoginPageHeader } from "./LoginPageHeader";
import { LoginPageIllustration } from "./LoginPageIllustration";

export const LoginPage = () => {
  const {
    initialValues,
    onSubmit,
    showPassword,
    validationSchema,
    onTogglePasswordVisibility,
  } = useLoginPage();

  return (
    <>
      <Header showBrand logoOnRight />
      <LoginPageLayout>
        <LoginPageRow gutter={[24, 24]} align="stretch" justify="center">
          <Col xs={24} sm={24} md={24} lg={11} xl={10} xxl={9}>
            <LoginCard>
              <LoginPageHeader />
              <LoginPageForm
                initialValues={initialValues}
                onSubmit={onSubmit}
                showPassword={showPassword}
                validationSchema={validationSchema}
                onTogglePasswordVisibility={onTogglePasswordVisibility}
              />
            </LoginCard>
          </Col>
          <Col xs={0} sm={0} md={0} lg={13} xl={12} xxl={13}>
            <LoginPageIllustration />
          </Col>
        </LoginPageRow>
      </LoginPageLayout>
    </>
  );
};
