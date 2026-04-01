import {
  buildAuthFromClaims,
  decodeAccessToken,
  getAccessToken,
} from "./authSession";

export const resolveSessionFromToken = () => {
  const token = getAccessToken();

  if (!token) {
    return null;
  }

  const claims = decodeAccessToken(token);
  const auth = buildAuthFromClaims(claims);

  if (!auth?.rol_id || (!auth?.id && !auth?.seg_usuario)) {
    return null;
  }

  return auth;
};

export const resolveSession = async () => {
  return resolveSessionFromToken();
};
