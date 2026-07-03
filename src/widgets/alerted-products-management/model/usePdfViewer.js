import { useCallback, useState } from "react";

import AlertComponent from "../../../helpers/alert/AlertComponent";
import { filesServices } from "../../../helpers/services/FilesServices";
import { triggerDownload } from "../lib/fileDownload";

const INITIAL = { isOpen: false, url: null, title: "" };

export const usePdfViewer = () => {
  const [viewer, setViewer] = useState(INITIAL);
  const [loadingRoute, setLoadingRoute] = useState(false);

  const close = useCallback(() => {
    setViewer((current) => {
      if (current.url) URL.revokeObjectURL(current.url);
      return INITIAL;
    });
  }, []);

  const openFromFile = useCallback((file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setViewer({ isOpen: true, url, title: file.name });
  }, []);

  const openFromRoute = useCallback(async (route, name = "documento.pdf") => {
    if (!route) return;
    setLoadingRoute(true);
    try {
      const response = await filesServices.downloadFile(route);
      if (!response?.blob) return;
      const url = URL.createObjectURL(response.blob);
      setViewer({ isOpen: true, url, title: name });
    } catch {
      AlertComponent.error("Error", "No fue posible abrir el documento.");
    } finally {
      setLoadingRoute(false);
    }
  }, []);

  const downloadCurrent = useCallback(() => {
    if (!viewer.url) return;
    triggerDownload(viewer.url, viewer.title);
  }, [viewer]);

  return { viewer, loadingRoute, openFromFile, openFromRoute, downloadCurrent, close };
};