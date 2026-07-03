import { DocumentViewerModal } from "../../../features/beneficiary-document-reports/ui/DocumentViewerModal";
import { Modal } from "../../../shared/ui/modal";
import { SmartTable } from "../../../shared/ui/smart-table";
import { REVIEW_MODE_WITH_OBSERVATION } from "../model/alertManagementConstants";
import { getProductosGestionColumns } from "../model/getProductosAsociadosColumns";
import { AlertManagementDetailHeader } from "./AlertManagementDetailHeader";
import { AlertManagementIndeterminateRecalc } from "./AlertManagementIndeterminateRecalc";
import { AlertManagementDocsList } from "./AlertManagementDocsList";
import { AlertManagementReviewPanel } from "./AlertManagementReviewPanel";
import { AlertManagementTimeline } from "./AlertManagementTimeline";
import {
  DetailBackButton, DetailGrid, DetailObservationBox, DetailSectionCard,
  DetailSectionTitle, DetailViewRoot, ReviewActionsRow,
  WithObservationButton, WithoutObservationButton,
} from "./detail.styles";
import { SecondaryFilterButton } from "./filters.styles";

const PRODUCTOS_COLUMNS = getProductosGestionColumns();

export const AlertManagementGestionView = ({
  record, pillMap, documents, detailLoading, productosAsociados, timeline,
  reviewMode, reviewObservation, reviewFiles, isConfirmOpen, isIndeterminate,
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
          <SmartTable
            rowKey="id_producto"
            columns={PRODUCTOS_COLUMNS}
            dataSource={productosAsociados ?? []}
            showPagination={false}
            showToolbar={false}
            enableRowSelection={false}
            showColumnSettings={false}
            emptyText="Sin productos asociados."
          />
          {isIndeterminate && (
            <AlertManagementIndeterminateRecalc
              productName={productosAsociados?.[0]?.nombre}
            />
          )}
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