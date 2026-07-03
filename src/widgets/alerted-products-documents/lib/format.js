export const formatFileSize = (sizeInBytes = 0) => {
  if (!sizeInBytes) return "Tamaño no disponible";
  const sizeInKb = sizeInBytes / 1024;
  if (sizeInKb < 1024) return `${sizeInKb.toFixed(1)} KB`;
  return `${(sizeInKb / 1024).toFixed(2)} MB`;
};

export const extractDocumentPartName = (fileName = "") => {
  const withoutExtension = fileName.replace(/\.[^.]+$/, "");
  const parts = withoutExtension.split("_");
  return parts[2] ?? parts[parts.length - 1] ?? fileName;
};

export const formatTimestamp = (timestamp) => {
  if (!timestamp) return "";
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(timestamp));
};