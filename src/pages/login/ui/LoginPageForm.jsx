import { Formik } from "formik";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { AppButton } from "../../../shared/ui/button";
import {
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
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
        <LoginFormLayout onSubmit={handleSubmit} noValidate>
          <LoginFormFields
            errors={errors}
            handleBlur={handleBlur}
            handleChange={handleChange}
            showPassword={showPassword}
            touched={touched}
            values={values}
            onTogglePasswordVisibility={onTogglePasswordVisibility}
            passwordToggleIcon={showPassword ? <FaEyeSlash /> : <FaEye />}
          />

          <LoginSubmitRow>
            <LoginSubmitButton>
              <AppButton htmlType="submit">Iniciar Sesión</AppButton>
            </LoginSubmitButton>
          </LoginSubmitRow>
        </LoginFormLayout>
      )}
    </Formik>
  );
};
