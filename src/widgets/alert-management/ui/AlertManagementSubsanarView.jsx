import { useMemo, useRef, useState } from "react";
import { DownloadOutlined } from "@ant-design/icons";
import { Spin } from "antd";

import { DocumentViewerModal } from "../../../features/beneficiary-document-reports/ui/DocumentViewerModal";
import { SmartTable } from "../../../shared/ui/smart-table";
import { renderPill } from "../model/alertManagementConstants";
import { getProductosSubsanarColumns } from "../model/getProductosAsociadosColumns";
import { AddProductModal } from "./AddProductModal";
import {
  AddProductButton, CancelButton, DetailBackButton, DetailDocButton, DetailMetaCard, DetailMetaLabel,
  DetailMetaValue, DetailObservationBox, DetailSectionCard, DetailSectionTitle,
  DetailTopGrid, DetailViewRoot, ReemplazarButton, ReenviarButton,
  ReviewFieldLabel, ReviewTextArea, SubsanarBottomRow, SubsanarDocActions,
  SubsanarDocCard, SubsanarFormGrid, SubsanarProductsActions, SubsanarProductsHeader,
} from "./detail.styles";

const getLastPart = (nombre = "") => {
  const parts = nombre.trim().split("_");
  return parts[parts.length - 1] || nombre;
};

const getVersionedName = (baseName = "") => {
  const dotIdx = baseName.lastIndexOf(".");
  const hasExt = dotIdx > 0;
  const ext = hasExt ? baseName.slice(dotIdx) : "";
  const nameNoExt = hasExt ? baseName.slice(0, dotIdx) : baseName;
  const vMatch = nameNoExt.match(/^(.+)_v(\d+)$/i);
  if (vMatch) return `${vMatch[1]}_v${parseInt(vMatch[2], 10) + 1}${ext}`;
  return `${nameNoExt}_v1${ext}`;
};

export const AlertManagementSubsanarView = ({
  record, pillMap, detailData, detailLoading, submitting,
  subsanarObservacion, onObservacionChange,
  subsanarDocumento, onDocumentoChange,
  subsanarProductos, addProductModal,
  onBack, onSubmit,
  onDownloadDocument,
  pdfViewer, onClosePdfViewer, onDownloadFromViewer,
}) => {
  const fileInputRef = useRef(null);
  const [replacementDisplayName, setReplacementDisplayName] = useState(null);

  const pdfDocs = (detailData?.documentos ?? []).filter((d) => d.esPdf);
  const mainDoc = pdfDocs[0] ?? null;
  const productos = subsanarProductos ?? detailData?.productosAsociados ?? [];

  const estadoLabel = detailData?.estadoSolicitud?.nombre ?? record?.gestionAlerta;
  const estadoCode = detailData?.estadoSolicitud?.codigo ?? record?.gestionAlertaCodigo;

  const productosColumns = useMemo(
    () => getProductosSubsanarColumns({ estadoLabel, estadoCode, pillMap, onDelete: () => {} }),
    [estadoLabel, estadoCode, pillMap]
  );

  const shownDocName = subsanarDocumento
    ? (replacementDisplayName ?? getLastPart(mainDoc?.nombre ?? ""))
    : getLastPart(mainDoc?.nombre ?? "");

  const handleReemplazarClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    if (file && mainDoc) {
      const base = replacementDisplayName ?? getLastPart(mainDoc.nombre);
      setReplacementDisplayName(getVersionedName(base));
    }
    onDocumentoChange(file);
    e.target.value = "";
  };

  const handleCancelReplace = () => {
    onDocumentoChange(null);
    setReplacementDisplayName(null);
  };

  return (
    <DetailViewRoot>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <DetailBackButton onClick={onBack}>Volver</DetailBackButton>
        <span style={{ color: "#64748b", fontSize: "0.82rem" }}>
          Inicio &rsaquo; Gestión de Alertas &rsaquo; Subsanar
        </span>
      </div>

      <DetailTopGrid>
        <DetailMetaCard bordered={false}>
          <DetailMetaLabel>Estado</DetailMetaLabel>
          <div>{renderPill(estadoLabel, estadoCode, pillMap)}</div>
        </DetailMetaCard>
        <DetailMetaCard bordered={false}>
          <DetailMetaLabel>Solicitado por</DetailMetaLabel>
          <DetailMetaValue>{record?.rolRevisor || "—"}</DetailMetaValue>
        </DetailMetaCard>
        <DetailMetaCard bordered={false}>
          <DetailMetaLabel>Tipo de gestión</DetailMetaLabel>
          <DetailMetaValue>{record?.tipoGestion || "—"}</DetailMetaValue>
        </DetailMetaCard>
        <DetailMetaCard bordered={false}>
          <DetailMetaLabel>Jornada</DetailMetaLabel>
          <DetailMetaValue>{detailData?.jornada?.nombre || record?.jornada || "—"}</DetailMetaValue>
        </DetailMetaCard>
      </DetailTopGrid>

      <DetailSectionCard bordered={false}>
        <DetailSectionTitle>Observación del revisor</DetailSectionTitle>
        <DetailObservationBox>
          {detailLoading
            ? <Spin size="small" />
            : (record?.observacionRevisor || "Sin observación del revisor.")}
        </DetailObservationBox>
      </DetailSectionCard>

      <DetailSectionCard bordered={false}>
        <DetailSectionTitle>Documentos y observación de subsanación</DetailSectionTitle>
        {detailLoading ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}><Spin /></div>
        ) : (
          <SubsanarFormGrid>
            <div style={{ display: "grid", gap: 8 }}>
              <ReviewFieldLabel>
                Nueva observación justificativa <span style={{ color: "#dc2626" }}>*</span>
              </ReviewFieldLabel>
              <ReviewTextArea
                value={subsanarObservacion}
                onChange={(e) => onObservacionChange(e.target.value)}
                placeholder="Registra la nueva observación justificativa"
                style={{ minHeight: 160 }}
              />
            </div>

            <div style={{ display: "grid", gap: 8, alignContent: "start" }}>
              <ReviewFieldLabel>Mantener o reemplazar documento soporte</ReviewFieldLabel>
              {mainDoc ? (
                <SubsanarDocCard>
                  <div style={{ display: "grid", gap: 3, minWidth: 0 }}>
                    <span style={{ color: "#1e3a8a", fontWeight: 800, fontSize: "0.9rem", wordBreak: "break-word" }}>
                      {shownDocName}
                    </span>
                    <span style={{ color: "#64748b", fontSize: "0.78rem" }}>
                      {subsanarDocumento ? "Reemplazará al documento actual" : "Puede mantenerse o reemplazarse"}
                    </span>
                  </div>
                  <SubsanarDocActions>
                    {subsanarDocumento ? (
                      <ReemplazarButton
                        onClick={handleCancelReplace}
                        style={{ borderColor: "#cbd5e1", color: "#64748b", background: "#f8fafc" }}
                      >
                        Cancelar
                      </ReemplazarButton>
                    ) : (
                      <ReemplazarButton onClick={handleReemplazarClick}>Reemplazar</ReemplazarButton>
                    )}
                    <DetailDocButton
                      icon={<DownloadOutlined />}
                      title="Descargar"
                      onClick={() => onDownloadDocument(mainDoc)}
                    />
                  </SubsanarDocActions>
                </SubsanarDocCard>
              ) : (
                <div style={{ color: "#94a3b8", fontSize: 13 }}>Sin documento de soporte registrado.</div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>
          </SubsanarFormGrid>
        )}
      </DetailSectionCard>

      <DetailSectionCard bordered={false}>
        <SubsanarProductsHeader>
          <DetailSectionTitle style={{ margin: 0 }}>Productos asociados</DetailSectionTitle>
          <SubsanarProductsActions>
            <AddProductButton
              onClick={addProductModal?.openModal}
              disabled={detailLoading}
            >
              Adicionar producto
            </AddProductButton>
          </SubsanarProductsActions>
        </SubsanarProductsHeader>
        <SmartTable
          rowKey={(row) => row.id_orden_detalle ?? row.id_producto}
          columns={productosColumns}
          dataSource={productos}
          loading={detailLoading}
          showPagination={false}
          showToolbar={false}
          enableRowSelection={false}
          showColumnSettings={false}
          emptyText="Sin productos asociados."
        />
      </DetailSectionCard>

      <AddProductModal
        isOpen={addProductModal?.isOpen}
        onClose={addProductModal?.closeModal}
        rows={addProductModal?.rows}
        loading={addProductModal?.loading}
        currentPage={addProductModal?.currentPage}
        pageSize={addProductModal?.pageSize}
        totalRecords={addProductModal?.totalRecords}
        onPageChange={addProductModal?.handlePageChange}
        onAdd={addProductModal?.handleAdd}
      />

      <SubsanarBottomRow>
        <CancelButton onClick={onBack}>Cancelar</CancelButton>
        <ReenviarButton loading={submitting} onClick={onSubmit}>
          Reenviar a revisión
        </ReenviarButton>
      </SubsanarBottomRow>

      <DocumentViewerModal
        isOpen={pdfViewer.isOpen}
        title="Visor de documento"
        subtitle={pdfViewer.title}
        documentUrl={pdfViewer.url}
        onClose={onClosePdfViewer}
        onDownload={onDownloadFromViewer}
      />
    </DetailViewRoot>
  );
};