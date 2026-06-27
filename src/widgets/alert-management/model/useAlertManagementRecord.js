import { useCallback, useMemo, useState } from "react";
import AlertComponent from "../../../helpers/alert/AlertComponent";
import { filesServices } from "../../../helpers/services/FilesServices";
import {
  getAlertedProductsSolicitudDetalle,
} from "../../../pages/alerted-products/api/alertedProductsSolicitudesApi";
import {
  formatDate,
  REVIEW_MODE_WITH_OBSERVATION, REVIEW_MODE_WITHOUT_OBSERVATION,
} from "./alertManagementConstants";

export const useAlertManagementRecord = () => {
  const [managingRecord, setManagingRecord] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [pdfViewer, setPdfViewer] = useState({ isOpen: false, url: null, title: "" });
  const [reviewMode, setReviewMode] = useState(null);
  const [reviewObservation, setReviewObservation] = useState("");
  const [reviewFiles, setReviewFiles] = useState([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const resetRecord = useCallback((pdfUrl) => {
    setManagingRecord(null); setDetailData(null); setIsViewMode(false);
    setReviewMode(null); setReviewObservation(""); setReviewFiles([]);
    setIsConfirmOpen(false);
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setPdfViewer({ isOpen: false, url: null, title: "" });
  }, []);

  const loadDetalle = useCallback(async (record) => {
    setDetailData(null);
    if (!record?.id) return;
    setDetailLoading(true);
    try { setDetailData(await getAlertedProductsSolicitudDetalle(record.id)); }
    catch { AlertComponent.error("Error", "No fue posible cargar el detalle de la solicitud."); }
    finally { setDetailLoading(false); }
  }, []);

  const handleGestionar = useCallback(async (record) => {
    setManagingRecord(record); setIsViewMode(false);
    setReviewMode(null); setReviewObservation(""); setReviewFiles([]);
    setIsConfirmOpen(false);
    loadDetalle(record);
  }, [loadDetalle]);

  const handleVer = useCallback(async (record) => {
    setManagingRecord(record); setIsViewMode(true); setDetailData(null);
    loadDetalle(record);
  }, [loadDetalle]);

  const handleSubsanar  = useCallback((_r) => {}, []);
  const handleHistorial = useCallback((_r) => {}, []);
  const handleBackToTable = useCallback(() => resetRecord(pdfViewer.url), [resetRecord, pdfViewer.url]);

  const handleViewDocument = useCallback(async (doc) => {
    if (!doc?.rutaArchivo) return;
    try {
      const res = await filesServices.downloadFile(doc.rutaArchivo);
      if (!res?.blob) return;
      setPdfViewer({ isOpen: true, url: URL.createObjectURL(res.blob), title: doc.nombre || "documento.pdf" });
    } catch { AlertComponent.error("Error", "No fue posible abrir el documento."); }
  }, []);

  const handleDownloadDocument = useCallback(async (doc) => {
    if (!doc?.rutaArchivo) return;
    try {
      const res = await filesServices.downloadFile(doc.rutaArchivo);
      if (!res?.blob) return;
      const url = URL.createObjectURL(res.blob);
      const a = document.createElement("a");
      a.href = url; a.download = doc.nombre || "documento";
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch { AlertComponent.error("Error", "No fue posible descargar el documento."); }
  }, []);

  const closePdfViewer = useCallback(() => {
    if (pdfViewer.url) URL.revokeObjectURL(pdfViewer.url);
    setPdfViewer({ isOpen: false, url: null, title: "" });
  }, [pdfViewer.url]);

  const handleDownloadFromViewer = useCallback(() => {
    if (!pdfViewer.url) return;
    const a = document.createElement("a");
    a.href = pdfViewer.url; a.download = pdfViewer.title;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  }, [pdfViewer]);

  const handleSelectWithObservation = useCallback(() => {
    setReviewMode(REVIEW_MODE_WITH_OBSERVATION);
    if (reviewObservation === "Sin observación") setReviewObservation("");
  }, [reviewObservation]);

  const handleSelectWithoutObservation = useCallback(() => { setReviewMode(REVIEW_MODE_WITHOUT_OBSERVATION); setIsConfirmOpen(true); }, []);
  const handleReviewFilesChange = useCallback((e) => setReviewFiles(Array.from(e?.target?.files ?? [])), []);

  const handleSubmitWithObservation = useCallback(() => {
    if (reviewMode === REVIEW_MODE_WITH_OBSERVATION && !reviewObservation.trim()) {
      AlertComponent.warning("Observación requerida", "Debe diligenciar la observación del revisor para continuar.");
      return;
    }
    AlertComponent.info("Recurso pendiente", "La integración del recurso para esta acción aún no ha sido definida.");
  }, [reviewMode, reviewObservation]);

  const handleConfirmWithoutObservation = useCallback(() => {
    setIsConfirmOpen(false);
    AlertComponent.info("Recurso pendiente", "La integración del recurso para esta acción aún no ha sido definida.");
  }, []);

  const documents = useMemo(() => detailData?.documentos ?? [], [detailData]);

  const timeline = useMemo(() => {
    if (detailData?.trazaEventos?.length) {
      return detailData.trazaEventos.map((e, i) => ({
        id: `evento-${i}`,
        title: e.titulo,
        meta: `${formatDate(e.fecha_evento)} · ${e.usuario}`,
        tone: e.variante === "informacion" ? "blue" : "orange",
      }));
    }
    if (!managingRecord) return [];
    return [
      { id: "journey-docs", title: "Documentos de jornada asociados", meta: `${formatDate(managingRecord?.fechaRegistro)} · Sistema`, tone: "blue" },
      { id: "request-created", title: "Solicitud enviada por Implementación", meta: `${formatDate(managingRecord?.fechaRegistro)} · ${managingRecord?.rolRevisor || "Implementación"}`, tone: "orange" },
    ];
  }, [detailData, managingRecord]);

  return {
    managingRecord, detailData, detailLoading, isViewMode, pdfViewer,
    reviewMode, reviewObservation, setReviewObservation, reviewFiles, isConfirmOpen, documents, timeline,
    handleGestionar, handleVer, handleSubsanar, handleHistorial, handleBackToTable,
    handleViewDocument, handleDownloadDocument, closePdfViewer, handleDownloadFromViewer,
    handleSelectWithObservation, handleSelectWithoutObservation,
    handleReviewFilesChange, handleSubmitWithObservation, handleConfirmWithoutObservation,
    setIsConfirmOpen,
  };
};