import { RolesEnum } from "../../../helpers/GlobalEnum";
import { StatusPill } from "../../../shared/ui/status-pill";

export const ALERT_CATEGORY_PARAMETER_TYPE_ID = 35;
export const ALERT_MANAGEMENT_PARAMETER_TYPE_ID = 36;
export const EN_SUBSANACION_GESTION_ID = 5260;

export const GESTIONAR_ROLES = [RolesEnum.ADMIN, RolesEnum.SUPERVISION, RolesEnum.ADMINISTRATIVA];
export const SUBSANAR_ROLES  = [RolesEnum.ADMIN, RolesEnum.TECHNICAL];
export const VER_ROLES       = [RolesEnum.ADMIN, RolesEnum.SUPERVISION, RolesEnum.ADMINISTRATIVA, RolesEnum.TECHNICAL];

export const REVIEW_MODE_WITH_OBSERVATION    = "with-observation";
export const REVIEW_MODE_WITHOUT_OBSERVATION = "without-observation";
export const TABLE_SCROLL_X = 1760;

export const defaultFilters = { operationalDay: null, alertCategory: null, alertManagement: null };

const PILL_TOKENS = {
  neutral: { background: "#F3F4F6", border: "#D1D5DB", color: "#374151" },
  blue:    { background: "#EEF2FF", border: "#C7D2FE", color: "#1D4ED8" },
  cyan:    { background: "#ECFEFF", border: "#A5F3FC", color: "#0F766E" },
  green:   { background: "#E8F8EE", border: "#B7E4C7", color: "#04995B" },
  amber:   { background: "#FFF4DB", border: "#FCDDA2", color: "#EA580C" },
  orange:  { background: "#FFF1E8", border: "#F9C9A7", color: "#C2410C" },
  red:     { background: "#FEE2E2", border: "#FCA5A5", color: "#991B1B" },
  violet:  { background: "#EDE9FE", border: "#C4B5FD", color: "#5B21B6" },
};
const PILL_TONES = ["blue", "cyan", "amber", "violet", "green", "orange", "red"];

export const buildPillMap = (options = []) =>
  Object.fromEntries(options.map((opt, i) => [opt.value, PILL_TONES[i % PILL_TONES.length]]));

const normalizeText = (value) =>
  String(value ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").trim().toLowerCase();

export const buildManagementPillMap = (options = []) =>
  Object.fromEntries(
    options.map((opt, i) => {
      const n = normalizeText(opt?.label);
      if (n === "en proceso") return [opt.value, "blue"];
      if (n === "en subsanacion") return [opt.value, "amber"];
      if (n === "resuelta" || n === "finalizada") return [opt.value, "green"];
      return [opt.value, PILL_TONES[i % PILL_TONES.length]];
    })
  );

export const renderPill = (label, code, pillMap) => {
  const tone = pillMap[code] || "neutral";
  const t = PILL_TOKENS[tone];
  return (
    <StatusPill backgroundColor={t.background} borderColor={t.border} textColor={t.color}
      minHeight="28px" padding="4px 12px" fontSize="12px" fontWeight={800} uppercase>
      {label || "—"}
    </StatusPill>
  );
};

export const wrapTitle = (...lines) => (
  <span style={{ display: "inline-block", width: "100%", whiteSpace: "normal", lineHeight: 1.15, textAlign: "center" }}>
    {lines.map((line, i) => <span key={i} style={{ display: "block" }}>{line}</span>)}
  </span>
);

export const wrapCell = {
  onCell: () => ({ style: { whiteSpace: "normal", wordBreak: "break-word", verticalAlign: "top" } }),
};

export const formatDate = (value) => {
  if (!value) return "—";
  return new Intl.DateTimeFormat("es-CO", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
};

export const formatCurrency = (value) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(Number(value ?? 0));