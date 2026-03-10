import { Header } from "../../../widgets/layout/header";
import { useLoginPage } from "../model/useLoginPage";
import {
  LoginCard,
  LoginPageGrid,
  LoginPageLayout,
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
        <LoginPageGrid>
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
          <LoginPageIllustration />
        </LoginPageGrid>
      </LoginPageLayout>
    </>
  );
};
