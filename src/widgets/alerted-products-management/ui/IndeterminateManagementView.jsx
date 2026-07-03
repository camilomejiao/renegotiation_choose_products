import { useMemo } from "react";

import AlertComponent from "../../../helpers/alert/AlertComponent";
import { DocumentViewerModal } from "../../../features/beneficiary-document-reports/ui/DocumentViewerModal";
import { ManagementMetaStrip } from "../../../shared/ui/management-meta-strip";
import { SmartTable } from "../../../shared/ui/smart-table";
import { buildManagementMetaItems } from "../model/buildManagementMetaItems";
import { buildAlertsToManageColumns } from "../model/columns/buildAlertsToManageColumns";
import { buildAssociatedProductColumns } from "../model/columns/buildAssociatedProductColumns";
import { useIndeterminateManagement } from "../model/useIndeterminateManagement";
import { useUnitOptions } from "../model/useUnitOptions";
import { usePdfViewer } from "../model/usePdfViewer";
import { IndeterminateProductFields } from "./IndeterminateProductFields";
import { JourneyDocumentsSection } from "./JourneyDocumentsSection";
import {
  ActionsRow,
  FieldGroup,
  FieldLabel,
  ManagementCard,
  PrimaryActionButton,
  RequiredMark,
  SecondaryActionButton,
  SectionCard,
  SectionTitle,
} from "./common.styles";
import {
  EmptyState,
  ObservationTextArea,
  ResponsiveBody,
  SectionHeaderRow,
  StepPill,
  TableWrapper,
} from "./IndeterminateManagementView.styles";

export const IndeterminateManagementView = ({
  assignment,
  historyByCategory = { pdf: [], excel: [] },
  onBack,
}) => {
  const row = assignment?.selectedRows?.[0] ?? null;
  const managementTypeLabel = assignment?.managementType || "INDETERMINADO";

  const { observation, setObservation, form, setField, canSubmit, buildPayload } =
    useIndeterminateManagement({ row });

  const { unitOptions, unitsLoading } = useUnitOptions();
  const pdf = usePdfViewer();

  const metaItems = useMemo(
    () => buildManagementMetaItems(managementTypeLabel, { isIndeterminate: true }),
    [managementTypeLabel]
  );

  const associatedColumns = useMemo(() => buildAssociatedProductColumns(), []);
  const alertsColumns = useMemo(() => buildAlertsToManageColumns(), []);

  const activePdf = historyByCategory.pdf?.[0] ?? null;
  const activeExcel = historyByCategory.excel?.[0] ?? null;

  const handleSubmit = () => {
    if (!canSubmit) return;
    // TODO: conectar al servicio cuando se defina la firma (payload listo abajo).
    const payload = buildPayload();
    // eslint-disable-next-line no-console
    console.info("[INDETERMINADO] payload listo para envío:", payload);
    AlertComponent.info(
      "Envío pendiente de integración",
      "El producto quedó preparado para creación. La firma del servicio aún no está definida."
    );
  };

  return (
    <ManagementCard bordered={false}>
      <ResponsiveBody>
        <ManagementMetaStrip items={metaItems} />

        <JourneyDocumentsSection
          activePdf={activePdf}
          activeExcel={activeExcel}
          viewingPdf={pdf.loadingRoute}
          onViewPdf={() => pdf.openFromRoute(activePdf?.route, activePdf?.name)}
        />

        <SectionCard>
          <SectionTitle>Solicitud de Levantamiento</SectionTitle>
          <FieldGroup>
            <FieldLabel>
              Observación justificativa <RequiredMark>*</RequiredMark>
            </FieldLabel>
            <ObservationTextArea
              placeholder="Escribe el fundamento del levantamiento de la alerta con los soportes y análisis pertinentes en la mesa técnica."
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              rows={5}
              maxLength={1000}
              showCount
            />
          </FieldGroup>
        </SectionCard>

        {row ? (
          <>
            <SectionCard>
              <SectionHeaderRow>
                <SectionTitle>Nuevo producto para el catálogo de la jornada</SectionTitle>
                <StepPill>Paso 1 · Implementación</StepPill>
              </SectionHeaderRow>
              <IndeterminateProductFields
                row={row}
                form={form}
                onFieldChange={setField}
                unitOptions={unitOptions}
                unitsLoading={unitsLoading}
              />
            </SectionCard>

            <SectionCard>
              <SectionTitle>Producto alertado asociado a la solicitud</SectionTitle>
              <TableWrapper>
                <SmartTable
                  rowKey="id"
                  columns={associatedColumns}
                  columnWidthMode="fixed"
                  dataSource={[row]}
                  showPagination={false}
                  showToolbar={false}
                  enableRowSelection={false}
                  showColumnSettings={false}
                  showTableResize={false}
                  showReload={false}
                  scroll={{ x: 1600 }}
                  emptyText="Sin producto asociado."
                />
              </TableWrapper>
            </SectionCard>

            <SectionCard>
              <SectionTitle>Alertas a Gestionar</SectionTitle>
              <TableWrapper>
                <SmartTable
                  rowKey="id"
                  columns={alertsColumns}
                  columnWidthMode="fixed"
                  dataSource={[row]}
                  showPagination={false}
                  showToolbar={false}
                  enableRowSelection={false}
                  showColumnSettings={false}
                  showTableResize={false}
                  showReload={false}
                  scroll={{ x: 1760 }}
                  emptyText="Sin alertas para gestionar."
                />
              </TableWrapper>
            </SectionCard>
          </>
        ) : (
          <SectionCard>
            <EmptyState>
              No hay un producto seleccionado para gestionar. Vuelve y selecciona un
              único ítem para el tipo de gestión INDETERMINADO.
            </EmptyState>
          </SectionCard>
        )}

        <ActionsRow>
          <SecondaryActionButton onClick={onBack}>Cancelar</SecondaryActionButton>
          <PrimaryActionButton type="primary" disabled={!canSubmit} onClick={handleSubmit}>
            Enviar
          </PrimaryActionButton>
        </ActionsRow>
      </ResponsiveBody>

      <DocumentViewerModal
        isOpen={pdf.viewer.isOpen}
        title="Visor de documento"
        subtitle={pdf.viewer.title}
        documentUrl={pdf.viewer.url}
        onClose={pdf.close}
        onDownload={pdf.downloadCurrent}
      />
    </ManagementCard>
  );
};