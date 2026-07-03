import { filesServices } from "../../helpers/services/FilesServices";

// Dispara la descarga de un objectURL y limpia el anchor temporal.
export const triggerDownload = (url, filename) => {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
};

// Descarga un archivo del backend a partir de su ruta.
export const downloadRouteFile = async (route, fallbackName = "archivo") => {
  if (!route) return;
  const response = await filesServices.downloadFile(route);
  if (!response?.blob) return;
  const url = URL.createObjectURL(response.blob);
  triggerDownload(url, fallbackName);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};