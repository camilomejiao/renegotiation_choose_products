export { normalizeLabel } from "../../../shared/lib/normalizeLabel";

export const extractFileName = (name = "") => {
  const withoutExt = name.replace(/\.[^.]+$/, "");
  const parts = withoutExt.split("_");
  return parts[2] ?? parts[parts.length - 1] ?? name;
};