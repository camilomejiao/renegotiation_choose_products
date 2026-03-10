import { jwtDecode } from "jwt-decode";

const AUTH_STORAGE_KEYS = {
  accessToken: "token",
  refreshToken: "refresh",
};

export const getAccessToken = () =>
  localStorage.getItem(AUTH_STORAGE_KEYS.accessToken);

export const getRefreshToken = () =>
  localStorage.getItem(AUTH_STORAGE_KEYS.refreshToken);

export const saveAuthTokens = ({ accessToken, refreshToken }) => {
  localStorage.setItem(AUTH_STORAGE_KEYS.accessToken, accessToken || "");
  localStorage.setItem(AUTH_STORAGE_KEYS.refreshToken, refreshToken || "");
};

export const clearAuthSession = () => {
  localStorage.removeItem(AUTH_STORAGE_KEYS.accessToken);
  localStorage.removeItem(AUTH_STORAGE_KEYS.refreshToken);
};

export const decodeAccessToken = (token = getAccessToken()) => {
  if (!token) {
    return null;
  }

  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return null;
  }
};

export const buildAuthFromClaims = (claims) => {
  if (!claims) {
    return {};
  }

  return {
    id: claims?.proveedor ?? claims?.user_id,
    user_id: claims?.user_id,
    seg_usuario: claims?.seg_usuario,
    supplier_id: claims?.proveedor,
    rol_id: claims?.rol,
    username: claims?.username,
    jornada_id: claims?.jornada_id,
  };
};
