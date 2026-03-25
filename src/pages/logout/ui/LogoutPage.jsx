import { Spin } from "antd";

import { useLogoutPage } from "../model/useLogoutPage";

export const LogoutPage = () => {
  useLogoutPage();

  return <Spin fullscreen tip="Cerrando sesión..." />;
};
