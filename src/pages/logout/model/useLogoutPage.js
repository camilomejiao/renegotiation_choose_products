import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import useAuth from "../../../hooks/useAuth";
import { clearAuthSession } from "../../../shared/auth/lib/authSession";

export const useLogoutPage = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    clearAuthSession();
    setAuth({});
    navigate("/login", { replace: true });
  }, [navigate, setAuth]);
};
