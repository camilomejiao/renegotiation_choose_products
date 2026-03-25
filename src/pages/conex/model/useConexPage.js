import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { authService } from "../../../helpers/services/Auth";
import useAuth from "../../../hooks/useAuth";
import {
  hasForcedPasswordChange,
  hasPasswordValidityWarning,
  normalizeAuthSession,
} from "../../../shared/auth/lib/authSession";

export const useConexPage = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadSessionFromUuid = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const uuid = queryParams.get("uuid");

      if (!uuid) {
        console.error("No se encontró el token en la URL.");
        navigate("/login", { replace: true });
        return;
      }

      try {
        const response = await authService.conex({ uuid }).then((data) => data);

        if (!response.access && !response.refresh) {
          navigate("/login", { replace: true });
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

        setTimeout(() => {
          navigate(redirectPath, {
            replace: true,
            state: shouldShowPasswordValidityNotice
              ? { showPasswordValidityNotice: true }
              : undefined,
          });
        }, 1500);
      } catch (error) {
        console.error("No se encontró el token en la URL.");
        navigate("/login", { replace: true });
      }
    };

    loadSessionFromUuid();
  }, [navigate, setAuth]);
};
