import { Formik } from "formik";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { AppButton } from "../../../shared/ui/button";
import {
  LoginFeedbackMessage,
  LoginFormLayout,
  LoginSubmitButton,
  LoginSubmitRow,
} from "./LoginPage.styles";
import { LoginFormFields } from "./LoginFormFields";

export const LoginPageForm = ({
  initialValues,
  onSubmit,
  showPassword,
  validationSchema,
  onTogglePasswordVisibility,
}) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({
        values,
        errors,
        touched,
        status,
        isSubmitting,
        setStatus,
        handleChange,
        handleBlur,
        handleSubmit,
      }) => (
        <LoginFormLayout onSubmit={handleSubmit} noValidate>
          <LoginFormFields
            errors={errors}
            handleBlur={handleBlur}
            handleChange={(event) => {
              if (status?.authError) {
                setStatus(undefined);
              }
              handleChange(event);
            }}
            showPassword={showPassword}
            touched={touched}
            values={values}
            onTogglePasswordVisibility={onTogglePasswordVisibility}
            passwordToggleIcon={showPassword ? <FaEyeSlash /> : <FaEye />}
          />

          <LoginSubmitRow>
            <LoginSubmitButton>
              <AppButton htmlType="submit" loading={isSubmitting} disabled={isSubmitting}>
                {isSubmitting ? "Accediendo..." : "Iniciar Sesión"}
              </AppButton>
            </LoginSubmitButton>
            {status?.authError && !isSubmitting && (
              <LoginFeedbackMessage $tone="error" role="alert">
                {status.authError}
              </LoginFeedbackMessage>
            )}
          </LoginSubmitRow>
        </LoginFormLayout>
      )}
    </Formik>
  );
};
