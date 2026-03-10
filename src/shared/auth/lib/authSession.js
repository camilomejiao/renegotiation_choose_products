import { jwtDecode } from "jwt-decode";

const AUTH_STORAGE_KEYS = {
  accessToken: "token",
  refreshToken: "refresh",
};

// Override temporal para probar flujo de cambio obligatorio de contraseña
// sin depender de que backend ya envíe los claims en el token.
const FORCED_PASSWORD_CHANGE_TEST_CLAIMS = {
  enabled: false,
  mustChangePassword: false,
  passwordValidity: 10,
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

const coerceBooleanClaim = (value) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value === 1;
  }

  if (typeof value === "string") {
    return value.toLowerCase() === "true" || value === "1";
  }

  return false;
};

const coerceNumberClaim = (value) => {
  if (value == null || value === "") {
    return null;
  }

  const nextValue = Number(value);
  return Number.isFinite(nextValue) ? nextValue : null;
};

export const buildAuthFromClaims = (claims) => {
  if (!claims) {
    return {};
  }

  const mustChangePassword = FORCED_PASSWORD_CHANGE_TEST_CLAIMS.enabled
    ? FORCED_PASSWORD_CHANGE_TEST_CLAIMS.mustChangePassword
    : coerceBooleanClaim(claims?.must_change_password);
  const passwordValidity = FORCED_PASSWORD_CHANGE_TEST_CLAIMS.enabled
    ? FORCED_PASSWORD_CHANGE_TEST_CLAIMS.passwordValidity
    : coerceNumberClaim(claims?.password_validity);

  return {
    id: claims?.proveedor ?? claims?.user_id,
    user_id: claims?.user_id,
    seg_usuario: claims?.seg_usuario,
    supplier_id: claims?.proveedor,
    rol_id: claims?.rol,
    username: claims?.username,
    jornada_id: claims?.jornada_id,
    must_change_password: mustChangePassword,
    password_validity: passwordValidity,
  };
};

export const hasForcedPasswordChange = (auth) =>
  coerceBooleanClaim(auth?.must_change_password);

export const hasPasswordValidityWarning = (auth) => {
  const passwordValidity = coerceNumberClaim(auth?.password_validity);

  if (passwordValidity == null) {
    return false;
  }

  return passwordValidity <= 10;
};

export const normalizeAuthSession = (payload) => {
  if (!payload || Object.keys(payload).length === 0) {
    return {};
  }

  const accessToken = payload?.access ?? payload?.accessToken;

  if (accessToken) {
    const claims = decodeAccessToken(accessToken);
    return buildAuthFromClaims(claims);
  }

  return payload;
};
