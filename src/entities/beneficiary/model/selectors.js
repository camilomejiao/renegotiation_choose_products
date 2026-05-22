import {
  GRADUATION_CAUSE,
  TITULAR_STATUS,
  TITULAR_STATUS_DESCRIPTIONS,
} from "./constants";

const normalizeComparableText = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

const GRADUATION_CAUSE_BY_NORMALIZED_VALUE = Object.values(
  GRADUATION_CAUSE
).reduce((acc, cause) => {
  acc[normalizeComparableText(cause)] = cause;
  return acc;
}, {});

export const isTitularAttentionFinalized = (status) =>
  status === TITULAR_STATUS.ATTENTION_FINALIZED;

export const getTitularStatusDescription = (status, fallback = "---") =>
  TITULAR_STATUS_DESCRIPTIONS[status] || fallback;

export const getGraduationCause = (cause, fallback = "") =>
  GRADUATION_CAUSE_BY_NORMALIZED_VALUE[normalizeComparableText(cause)] ||
  fallback;
