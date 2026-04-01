export const buildPasswordUpdatePayload = ({
  nextPassword = "",
  clientIp = "",
}) => ({
  password_nueva: nextPassword,
  password_confirmacion: nextPassword,
  ip_update_password: clientIp,
});
