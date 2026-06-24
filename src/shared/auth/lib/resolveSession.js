import {
  buildAuthFromClaims,
  decodeAccessToken,
  getAccessToken,
  isTokenExpired,
} from "./authSession";

export const resolveSessionFromToken = () => {
  const token = getAccessToken();

  if (!token) {
    return null;
  }

  const claims = decodeAccessToken(token);

  if (!claims || isTokenExpired(claims)) {
    return null;
  }

  const auth = buildAuthFromClaims(claims);

  if (!auth?.rol_id || (!auth?.id && !auth?.seg_usuario)) {
    return null;
  }

  return auth;
};

export const resolveSession = async () => {
  return resolveSessionFromToken();
};
