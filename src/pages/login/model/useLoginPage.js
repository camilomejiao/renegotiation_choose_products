import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

  const handleSubmit = async (values, { resetForm, setStatus, setSubmitting }) => {
    const credentials = {
      mail: values.email,
      pass: values.password,
    };

    try {
      setStatus(undefined);
      const response = await authService.login(credentials).then((data) => data);

      if (!response.access && !response.refresh) {
        setStatus({
          authError:
            response?.error || "No fue posible iniciar sesión. Inténtalo de nuevo.",
        });
        return;
      }

      setAuth(response);
      window.dispatchEvent(new Event("authUpdated"));

      const nextAuth = normalizeAuthSession(response);
      const redirectPath = hasForcedPasswordChange(nextAuth)
        ? "/admin/edit-user"
        : "/admin";
      const shouldShowPasswordValidityNotice =
        !hasForcedPasswordChange(nextAuth) && hasPasswordValidityWarning(nextAuth);

      navigate(redirectPath, {
        replace: true,
        state: shouldShowPasswordValidityNotice
          ? { showPasswordValidityNotice: true }
          : undefined,
      });

      resetForm();
    } catch (error) {
      console.error("Error iniciando sesión:", error);
      setStatus({
        authError:
          "Tu sesión no se pudo llevar a cabo en este momento. Inténtalo nuevamente.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    initialValues: loginInitialValues,
    onSubmit: handleSubmit,
    showPassword,
    validationSchema: loginSchema,
    onTogglePasswordVisibility: handleTogglePasswordVisibility,
  };
};
