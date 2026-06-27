import { DocumentViewerModal } from "../../../features/beneficiary-document-reports/ui/DocumentViewerModal";
import { AlertManagementDetailHeader } from "./AlertManagementDetailHeader";
import { AlertManagementDocsList } from "./AlertManagementDocsList";
import { DetailBackButton, DetailGrid, DetailObservationBox, DetailSectionCard, DetailSectionTitle, DetailViewRoot } from "./detail.styles";

export const AlertManagementVerView = ({
  record, pillMap, documents, detailLoading, detailData,
  onBack, onViewDocument, onDownloadDocument,
  pdfViewer, onClosePdfViewer, onDownloadFromViewer,
}) => (
  <DetailViewRoot>
    <DetailBackButton onClick={onBack}>Volver</DetailBackButton>
    <AlertManagementDetailHeader record={record} pillMap={pillMap} />
    <DetailGrid>
      <div style={{ display: "grid", gap: 16 }}>
        <AlertManagementDocsList
          documents={documents} loading={detailLoading}
          onView={onViewDocument} onDownload={onDownloadDocument}
        />
      </div>
      <div style={{ display: "grid", gap: 16 }}>
        <DetailSectionCard bordered={false}>
          <DetailSectionTitle>Resumen</DetailSectionTitle>
          <DetailObservationBox>
            <p style={{ margin: 0, color: "#0f172a", lineHeight: 1.6 }}>
              {detailData?.resumen || "Sin resumen disponible."}
            </p>
          </DetailObservationBox>
        </DetailSectionCard>
      </div>
    </DetailGrid>
    <DocumentViewerModal
      isOpen={pdfViewer.isOpen} title="Visor de documento"
      subtitle={pdfViewer.title} documentUrl={pdfViewer.url}
      onClose={onClosePdfViewer} onDownload={onDownloadFromViewer}
    />
  </DetailViewRoot>
);