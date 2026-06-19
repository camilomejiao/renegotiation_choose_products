import {
  GRADUATION_CAUSE,
  TITULAR_STATUS,
  TITULAR_STATUS_COLORS,
  TITULAR_STATUS_DESCRIPTIONS,
} from "./constants";

const DOCUMENT_SUPPORTED_CAUSES = new Set([
  GRADUATION_CAUSE.DIFFERENTIAL_ATTENTION,
  GRADUATION_CAUSE.FINANCIAL_OBLIGATION_PAYMENT,
  GRADUATION_CAUSE.AGRICULTURAL_PRODUCTIVE_PROJECTS,
  GRADUATION_CAUSE.NON_AGRICULTURAL_PRODUCTIVE_PROJECTS,
]);

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

export const normalizeTitularStatus = (rawStatus, fallback = "") =>
  TITULAR_STATUS_BY_NORMALIZED_VALUE[normalizeComparableText(rawStatus)] ||
  fallback;

export const getTitularStatusColor = (status, fallback = "default") =>
  TITULAR_STATUS_COLORS[status] || fallback;

export const canGenerateDocumentFromGraduationCause = (cause) =>
  DOCUMENT_SUPPORTED_CAUSES.has(cause);
