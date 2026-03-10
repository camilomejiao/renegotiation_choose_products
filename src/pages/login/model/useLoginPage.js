import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AlertComponent from "../../../helpers/alert/AlertComponent";
import { authService } from "../../../helpers/services/Auth";
import useAuth from "../../../hooks/useAuth";
import {
  hasForcedPasswordChange,
  hasPasswordValidityWarning,
  normalizeAuthSession,
} from "../../../shared/auth/lib/authSession";
import { loginInitialValues, loginSchema } from "./loginSchema";

export const useLoginPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((previous) => !previous);
  };

  const handleSubmit = async (values, { resetForm }) => {
    const credentials = {
      mail: values.email,
      pass: values.password,
    };

    const response = await authService.login(credentials).then((data) => data);

    if (!response.access && !response.refresh) {
      AlertComponent.error("Oops...", response.error);
      resetForm();
      return;
    }

    AlertComponent.success("Bien hecho!", response.message);
    setAuth(response);
    window.dispatchEvent(new Event("authUpdated"));

    const nextAuth = normalizeAuthSession(response);
    const redirectPath = hasForcedPasswordChange(nextAuth)
      ? "/admin/edit-user"
      : "/admin";
    const shouldShowPasswordValidityNotice =
      !hasForcedPasswordChange(nextAuth) && hasPasswordValidityWarning(nextAuth);

    setTimeout(() => {
      navigate(redirectPath, {
        replace: true,
        state: shouldShowPasswordValidityNotice
          ? { showPasswordValidityNotice: true }
          : undefined,
      });
    }, 2000);

    resetForm();
  };

  return {
    initialValues: loginInitialValues,
    onSubmit: handleSubmit,
    showPassword,
    validationSchema: loginSchema,
    onTogglePasswordVisibility: handleTogglePasswordVisibility,
  };
};
