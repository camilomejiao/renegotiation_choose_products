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

const TITULAR_STATUS_BY_NORMALIZED_VALUE = Object.values(
  TITULAR_STATUS
).reduce((acc, status) => {
  acc[normalizeComparableText(status)] = status;
  return acc;
}, {});

export const isTitularAttentionFinalized = (status) =>
  normalizeComparableText(status) === normalizeComparableText(TITULAR_STATUS.ATTENTION_FINALIZED);

export const getTitularStatusDescription = (status, fallback = "---") =>
  TITULAR_STATUS_DESCRIPTIONS[status] || fallback;

export const getGraduationCause = (cause, fallback = "") =>
  GRADUATION_CAUSE_BY_NORMALIZED_VALUE[normalizeComparableText(cause)] ||
  fallback;

export const getTitularStatus = (rawStatus, fallback = "") =>
  TITULAR_STATUS_BY_NORMALIZED_VALUE[normalizeComparableText(rawStatus)] ||
  fallback;
