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

export const getGraduationCause = (cause, fallback = "") =>
  GRADUATION_CAUSE_BY_NORMALIZED_VALUE[normalizeComparableText(cause)] ||
  fallback;
