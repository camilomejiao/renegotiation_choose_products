import { useCallback, useMemo, useState } from "react";
import AlertComponent from "../../../helpers/alert/AlertComponent";
import { filesServices } from "../../../helpers/services/FilesServices";
import {
  gestionarAlertedProductsSolicitud,
  getAlertedProductsSolicitudDetalle,
  subsanarAlertedProductsSolicitud,
} from "../../../pages/alerted-products/api/alertedProductsSolicitudesApi";
import {
  formatDate,
  REVIEW_MODE_WITH_OBSERVATION, REVIEW_MODE_WITHOUT_OBSERVATION,
} from "./alertManagementConstants";

export const useAlertManagementRecord = ({ onGestionSuccess } = {}) => {
  const [managingRecord, setManagingRecord] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [isSubsanarMode, setIsSubsanarMode] = useState(false);
  const [pdfViewer, setPdfViewer] = useState({ isOpen: false, url: null, title: "" });
  const [reviewMode, setReviewMode] = useState(null);
  const [reviewObservation, setReviewObservation] = useState("");
  const [reviewFiles, setReviewFiles] = useState([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [subsanarObservacion, setSubsanarObservacion] = useState("");
  const [subsanarDocumento, setSubsanarDocumento] = useState(null);
  const [subsanarSubmitting, setSubsanarSubmitting] = useState(false);

  const resetRecord = useCallback((pdfUrl) => {
    setManagingRecord(null); setDetailData(null); setIsViewMode(false); setIsSubsanarMode(false);
    setReviewMode(null); setReviewObservation(""); setReviewFiles([]);
    setIsConfirmOpen(false);
    setSubsanarObservacion(""); setSubsanarDocumento(null); setSubsanarSubmitting(false);
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

  const handleSubsanar = useCallback((record) => {
    setManagingRecord(record); setIsViewMode(false); setIsSubsanarMode(true);
    setSubsanarObservacion(""); setSubsanarDocumento(null);
    loadDetalle(record);
  }, [loadDetalle]);

  const handleSubsanarSubmit = useCallback(async () => {
    if (!subsanarObservacion.trim()) {
      AlertComponent.warning("Observación requerida", "Debe diligenciar la nueva observación justificativa.");
      return;
    }
    if (!managingRecord?.id) return;
    setSubsanarSubmitting(true);
    try {
      await subsanarAlertedProductsSolicitud({
        idEncabezado: managingRecord.id,
        observacion: subsanarObservacion,
        documento: subsanarDocumento,
      });
      AlertComponent.success("Subsanación enviada", "La solicitud fue reenviada a revisión correctamente.");
      onGestionSuccess?.();
      resetRecord(pdfViewer.url);
    } catch {
      AlertComponent.error("Error", "No fue posible enviar la subsanación.");
    } finally {
      setSubsanarSubmitting(false);
    }
  }, [managingRecord, subsanarObservacion, subsanarDocumento, pdfViewer.url, resetRecord, onGestionSuccess]);
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

  const handleSubmitWithObservation = useCallback(async () => {
    if (!reviewObservation.trim()) {
      AlertComponent.warning("Observación requerida", "Debe diligenciar la observación del revisor para continuar.");
      return;
    }
    if (!managingRecord?.id) return;
    try {
      await gestionarAlertedProductsSolicitud({
        idEncabezado: managingRecord.id,
        idEstado: "5260",
        observacion: reviewObservation,
        documento: reviewFiles[0] ?? null,
      });
      AlertComponent.success("Enviado a subsanación", "La solicitud fue enviada a subsanación correctamente.");
      onGestionSuccess?.();
      resetRecord(pdfViewer.url);
    } catch {
      AlertComponent.error("Error", "No fue posible enviar la solicitud a subsanación.");
    }
  }, [managingRecord, reviewObservation, reviewFiles, pdfViewer.url, resetRecord, onGestionSuccess]);

  const handleConfirmWithoutObservation = useCallback(async () => {
    setIsConfirmOpen(false);
    if (!managingRecord?.id) return;
    try {
      await gestionarAlertedProductsSolicitud({
        idEncabezado: managingRecord.id,
        idEstado: "5261",
        observacion: 'Solicitud resuelta. Categoría de alerta pasa a "SIN ALERTA"',
      });
      AlertComponent.success("Gestión exitosa", "La solicitud fue resuelta correctamente.");
      onGestionSuccess?.();
      resetRecord(pdfViewer.url);
    } catch {
      AlertComponent.error("Error", "No fue posible gestionar la solicitud.");
    }
  }, [managingRecord, pdfViewer.url, resetRecord, onGestionSuccess]);

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
    managingRecord, detailData, detailLoading, isViewMode, isSubsanarMode, pdfViewer,
    reviewMode, reviewObservation, setReviewObservation, reviewFiles, isConfirmOpen, documents, timeline,
    subsanarObservacion, setSubsanarObservacion, subsanarDocumento, setSubsanarDocumento, subsanarSubmitting,
    handleGestionar, handleVer, handleSubsanar, handleSubsanarSubmit, handleHistorial, handleBackToTable,
    handleViewDocument, handleDownloadDocument, closePdfViewer, handleDownloadFromViewer,
    handleSelectWithObservation, handleSelectWithoutObservation,
    handleReviewFilesChange, handleSubmitWithObservation, handleConfirmWithoutObservation,
    setIsConfirmOpen,
  };
};