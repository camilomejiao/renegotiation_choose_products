import { TITULAR_STATUS, TITULAR_STATUS_DESCRIPTIONS } from "./constants";

export const isTitularAttentionFinalized = (status) =>
  status === TITULAR_STATUS.ATTENTION_FINALIZED;

export const getTitularStatusDescription = (status, fallback = "---") =>
  TITULAR_STATUS_DESCRIPTIONS[status] || fallback;
