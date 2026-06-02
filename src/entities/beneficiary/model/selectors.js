import {
  GRADUATION_CAUSE,
  TITULAR_STATUS,
  TITULAR_STATUS_COLORS,
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

// Permite resolver también por KEY del enum (ej: "UNDOC_FAMILIES" → "RENEGOCIACION NO AGRO")
const GRADUATION_CAUSE_BY_NORMALIZED_KEY = Object.entries(
  GRADUATION_CAUSE
).reduce((acc, [key, value]) => {
  acc[normalizeComparableText(key)] = value;
  return acc;
}, {});

const DOCUMENT_GENERATING_GRADUATION_CAUSE_VALUES = new Set([
  GRADUATION_CAUSE.DIFFERENTIAL_ATTENTION,
  GRADUATION_CAUSE.FINANCIAL_OBLIGATION_PAYMENT,
  GRADUATION_CAUSE.AGRICULTURAL_PRODUCTIVE_PROJECTS,
  GRADUATION_CAUSE.UNDOC_FAMILIES,
  GRADUATION_CAUSE.RECOLECTOR,
]);

const TITULAR_STATUS_BY_NORMALIZED_VALUE = Object.values(
  TITULAR_STATUS
).reduce((acc, status) => {
  acc[normalizeComparableText(status)] = status;
  return acc;
}, {});

const TITULAR_STATUS_DESCRIPTIONS_BY_NORMALIZED_STATUS = Object.entries(
  TITULAR_STATUS_DESCRIPTIONS
).reduce((acc, [status, description]) => {
  acc[normalizeComparableText(status)] = description;
  return acc;
}, {});

const TITULAR_STATUS_COLORS_BY_NORMALIZED_STATUS = Object.entries(
  TITULAR_STATUS_COLORS
).reduce((acc, [status, color]) => {
  acc[normalizeComparableText(status)] = color;
  return acc;
}, {});

export const normalizeTitularStatus = (status) =>
  TITULAR_STATUS_BY_NORMALIZED_VALUE[normalizeComparableText(status)] || status;

export const isTitularAttentionFinalized = (status) =>
  normalizeTitularStatus(status) === TITULAR_STATUS.ATTENTION_FINALIZED;

export const getTitularStatusDescription = (status, fallback = "---") =>
  TITULAR_STATUS_DESCRIPTIONS_BY_NORMALIZED_STATUS[
    normalizeComparableText(status)
  ] || fallback;

export const getTitularStatusColor = (status, fallback = "default") =>
  TITULAR_STATUS_COLORS_BY_NORMALIZED_STATUS[normalizeComparableText(status)] ||
  fallback;

export const getGraduationCause = (cause, fallback = "") => {
  const normalized = normalizeComparableText(cause);
  return (
    GRADUATION_CAUSE_BY_NORMALIZED_VALUE[normalized] ||
    GRADUATION_CAUSE_BY_NORMALIZED_KEY[normalized] ||
    fallback
  );
};

export const canGenerateDocumentFromGraduationCause = (cause) =>
  DOCUMENT_GENERATING_GRADUATION_CAUSE_VALUES.has(getGraduationCause(cause));
