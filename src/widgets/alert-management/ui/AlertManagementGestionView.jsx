import { DocumentViewerModal } from "../../../features/beneficiary-document-reports/ui/DocumentViewerModal";
import { Modal } from "../../../shared/ui/modal";
import { REVIEW_MODE_WITH_OBSERVATION } from "../model/alertManagementConstants";
import { AlertManagementDetailHeader } from "./AlertManagementDetailHeader";
import { AlertManagementDocsList } from "./AlertManagementDocsList";
import { AlertManagementReviewPanel } from "./AlertManagementReviewPanel";
import { AlertManagementTimeline } from "./AlertManagementTimeline";
import {
  DetailBackButton, DetailGrid, DetailObservationBox, DetailProductsRow,
  DetailProductsTable, DetailProductsTableHead, DetailSectionCard,
  DetailSectionTitle, DetailViewRoot, ReviewActionsRow,
  WithObservationButton, WithoutObservationButton,
} from "./detail.styles";
import { SecondaryFilterButton } from "./filters.styles";
import { formatCurrency } from "../model/alertManagementConstants";

export const AlertManagementGestionView = ({
  record, pillMap, documents, detailLoading, timeline,
  reviewMode, reviewObservation, reviewFiles, isConfirmOpen,
  onBack, onViewDocument, onDownloadDocument,
  onSelectWithObservation, onSelectWithoutObservation,
  onObservationChange, onFilesChange, onSubmitWithObservation,
  onConfirmWithoutObservation, onCloseConfirm,
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
        <DetailSectionCard bordered={false}>
          <DetailSectionTitle>Productos asociados</DetailSectionTitle>
          <DetailProductsTable>
            <DetailProductsTableHead>
              <span>ID producto</span><span>Nombre</span><span>Precio mín.</span>
              <span>Precio máx.</span><span>Valor venta</span><span>Resultado</span>
            </DetailProductsTableHead>
            <DetailProductsRow>
              <span>{record?.id || "—"}</span>
              <span>{record?.tipoGestion || "Producto asociado"}</span>
              <span>{formatCurrency(95000)}</span><span>{formatCurrency(120000)}</span>
              <span>{formatCurrency(128500)}</span><span>{formatCurrency(115000)}</span>
            </DetailProductsRow>
          </DetailProductsTable>
          <ReviewActionsRow>
            <WithObservationButton onClick={onSelectWithObservation}>Con observación</WithObservationButton>
            <WithoutObservationButton onClick={onSelectWithoutObservation}>Sin observación</WithoutObservationButton>
          </ReviewActionsRow>
        </DetailSectionCard>
      </div>
      <div style={{ display: "grid", gap: 16 }}>
        <DetailSectionCard bordered={false}>
          <DetailSectionTitle>Observación justificativa</DetailSectionTitle>
          <DetailObservationBox>
            {record?.observacionJustificativa || "Sin observación justificativa registrada."}
          </DetailObservationBox>
        </DetailSectionCard>
        <AlertManagementTimeline items={timeline} />
        {reviewMode === REVIEW_MODE_WITH_OBSERVATION && (
          <AlertManagementReviewPanel
            observation={reviewObservation} files={reviewFiles}
            onChange={onObservationChange} onFilesChange={onFilesChange}
            onSubmit={onSubmitWithObservation}
          />
        )}
      </div>
    </DetailGrid>
    <Modal isOpen={isConfirmOpen} onCloseModal={onCloseConfirm}
      title="Confirmar levantamiento sin observación" footer={null} width={760} centered>
      <div style={{ display: "grid", gap: 20 }}>
        <p style={{ margin: 0, color: "#0f172a", lineHeight: 1.6 }}>
          ¿Está seguro de levantar la alerta? La solicitud quedará en estado <strong>Resuelta</strong>,
          la categoría de alerta actual pasará a <strong>0 - Sin alerta</strong> y la categoría anterior
          quedará registrada en el histórico.
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <SecondaryFilterButton onClick={onCloseConfirm}>Cancelar</SecondaryFilterButton>
          <WithoutObservationButton onClick={onConfirmWithoutObservation}>Confirmar</WithoutObservationButton>
        </div>
      </div>
    </Modal>
    <DocumentViewerModal isOpen={pdfViewer.isOpen} title="Visor de documento"
      subtitle={pdfViewer.title} documentUrl={pdfViewer.url}
      onClose={onClosePdfViewer} onDownload={onDownloadFromViewer} />
  </DetailViewRoot>
);