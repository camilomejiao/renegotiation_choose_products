import { useCallback, useState } from "react";

import { filesServices } from "../../../helpers/services/FilesServices";
import { triggerDownload } from "../../../shared/lib/fileDownload";

const INITIAL = { isOpen: false, url: null, title: "" };

export const usePdfDocumentViewer = () => {
  const [viewer, setViewer] = useState(INITIAL);

  const close = useCallback(() => {
    setViewer((current) => {
      if (current.url) URL.revokeObjectURL(current.url);
      return INITIAL;
    });
  }, []);

  const openFromRoute = useCallback(async (route, name = "documento.pdf") => {
    if (!route) return;
    const response = await filesServices.downloadFile(route);
    if (!response?.blob) return;
    const url = URL.createObjectURL(response.blob);
    setViewer({ isOpen: true, url, title: name });
  }, []);

  const downloadCurrent = useCallback(() => {
    if (!viewer.url) return;
    triggerDownload(viewer.url, viewer.title || "documento.pdf");
  }, [viewer]);

  return { viewer, openFromRoute, downloadCurrent, close };
};