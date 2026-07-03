import { useCallback, useMemo, useState } from "react";

import AlertComponent from "../../../helpers/alert/AlertComponent";
import { DocumentViewerModal } from "../../../features/beneficiary-document-reports/ui/DocumentViewerModal";
import { ManagementMetaStrip } from "../../../shared/ui/management-meta-strip";
import { triggerDownload } from "../lib/fileDownload";
import { normalizeLabel } from "../lib/labels";
import { MANAGEMENT_VARIANT } from "../model/constants";
import { buildManagementMetaItems } from "../model/buildManagementMetaItems";
import { getAlertedProductsManagementColumns } from "../model/getAlertedProductsManagementColumns";
import { buildAddAlertColumns } from "../model/columns/buildAddAlertColumns";
import { buildHomologationColumn } from "../model/columns/buildHomologationColumn";
import { buildPriceColumn } from "../model/columns/buildPriceColumn";
import { useAddAlertModal } from "../model/useAddAlertModal";
import { useActaFile } from "../model/useActaFile";
import { useHomologation } from "../model/useHomologation";
import { useManagementSubmit } from "../model/useManagementSubmit";
import { usePdfViewer } from "../model/usePdfViewer";
import { usePriceAdjustment } from "../model/usePriceAdjustment";
import { AddAlertModal } from "./AddAlertModal";
import { AlertsTableSection } from "./AlertsTableSection";
import { HomologationSearchModal } from "./HomologationSearchModal";
import { JourneyDocumentsSection } from "./JourneyDocumentsSection";
import { MissingRequirementsModal } from "./MissingRequirementsModal";
import { ServicesResponseModal } from "./ServicesResponseModal";
import { SolicitudForm } from "./SolicitudForm";
import {
  ActionsRow,
  ManagementBody,
  ManagementCard,
  PrimaryActionButton,
  SecondaryActionButton,
} from "./common.styles";

const isSinGestion = (value = "") => {
  const mgmt = value.trim().toLowerCase();
  return !mgmt || mgmt === "sin gestión" || mgmt === "sin gestion";
};

export const AlertedProductsManagementWidget = ({
  assignment,
  appliedFilters,
  historyByCategory = { pdf: [], excel: [] },
  managementTypeOptions = [],
  variant = MANAGEMENT_VARIANT.DEFAULT,
  onBack,
  onContinue,
  onSubmitManagementRequest,
}) => {
  const isPriceAdjustment = variant === MANAGEMENT_VARIANT.PRICE_ADJUSTMENT;
  const isHomologation = variant === MANAGEMENT_VARIANT.HOMOLOGATION;

  const [observation, setObservation] = useState("");
  const [alertsData, setAlertsData] = useState(() => assignment?.selectedRows ?? []);
  const [addingId, setAddingId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [missing, setMissing] = useState({ isOpen: false, message: "" });
  const [servicesResult, setServicesResult] = useState({ isOpen: false, result: null });

  const pdf = usePdfViewer();
  const acta = useActaFile({
    isPriceAdjustment,
    managementTypeLabel: assignment?.managementType,
  });
  const priceAdjustment = usePriceAdjustment(isPriceAdjustment);
  const homologation = useHomologation(isHomologation);

  const activePdf = historyByCategory.pdf?.[0] ?? null;
  const activeExcel = historyByCategory.excel?.[0] ?? null;
  const assignmentManagementTypeCode = assignment?.selectedRows?.[0]?.managementTypeCode;

  const managementTypeOption = useMemo(
    () =>
      managementTypeOptions.find(
        (opt) =>
          String(opt.value) === String(assignmentManagementTypeCode) ||
          normalizeLabel(opt.label) === normalizeLabel(assignment?.managementType)
      ) ||
      (assignment?.managementType
        ? { value: assignmentManagementTypeCode ?? null, label: assignment.managementType }
        : null),
    [assignment?.managementType, assignmentManagementTypeCode, managementTypeOptions]
  );

  const managementMetaItems = useMemo(
    () =>
      buildManagementMetaItems(managementTypeOption?.label || assignment?.managementType || "", {
        isPriceAdjustment,
        isHomologation,
      }),
    [assignment?.managementType, managementTypeOption?.label, isPriceAdjustment, isHomologation]
  );

  const { allRows: modalAllRows, loading: modalLoading } = useAddAlertModal({
    isOpen: isAddModalOpen || homologation.modal.isOpen,
    appliedFilters,
  });

  const addedIds = useMemo(
    () => new Set(alertsData.map((r) => r.orderDetailId).filter(Boolean)),
    [alertsData]
  );
  const managementCategoryCodes = useMemo(
    () => new Set(alertsData.map((r) => r.alertCategoryCode).filter(Boolean)),
    [alertsData]
  );

  const modalDataSource = useMemo(
    () =>
      modalAllRows.filter((row) => {
        if (managementCategoryCodes.size > 0 && !managementCategoryCodes.has(row.alertCategoryCode))
          return false;
        if (row.orderDetailId && addedIds.has(row.orderDetailId)) return false;
        return isSinGestion(row.alertManagement ?? "");
      }),
    [modalAllRows, addedIds, managementCategoryCodes]
  );

  const handleRemoveAlert = useCallback(
    (record) => {
      setAlertsData((prev) => prev.filter((row) => row.id !== record.id));
      priceAdjustment.clearRow(record.id);
      homologation.clearRow(record.id);
    },
    [priceAdjustment, homologation]
  );

  const handleAddAlert = useCallback(
    (product) => {
      if (!managementTypeOption) {
        AlertComponent.warning(
          "Tipo de gestión requerido",
          "No fue posible identificar el tipo de gestión de la solicitud actual."
        );
        return;
      }
      setAddingId(product.id);
      setAlertsData((prev) => [
        ...prev,
        {
          ...product,
          managementType: managementTypeOption.label,
          managementTypeCode: managementTypeOption.value,
          hasAssignedManagementType: true,
        },
      ]);
      setAddingId(null);
    },
    [managementTypeOption]
  );

  const alertsColumns = useMemo(
    () =>
      getAlertedProductsManagementColumns({
        onRemove: handleRemoveAlert,
        priceColumn: isPriceAdjustment
          ? buildPriceColumn({
              prices: priceAdjustment.newSalePrices,
              touched: priceAdjustment.touched,
              onChange: priceAdjustment.setPrice,
            })
          : null,
        homologationColumn: isHomologation
          ? buildHomologationColumn({
              byRow: homologation.byRow,
              touched: homologation.touched,
              onAssign: homologation.openModal,
              onRemove: homologation.removeRow,
            })
          : null,
      }),
    [
      handleRemoveAlert,
      isPriceAdjustment,
      isHomologation,
      priceAdjustment.newSalePrices,
      priceAdjustment.touched,
      priceAdjustment.setPrice,
      homologation.byRow,
      homologation.touched,
      homologation.openModal,
      homologation.removeRow,
    ]
  );

  const addAlertColumns = useMemo(
    () =>
      buildAddAlertColumns({
        addedIds,
        addingId,
        onAdd: handleAddAlert,
        managementTypeLabel: managementTypeOption?.label,
      }),
    [addedIds, addingId, handleAddAlert, managementTypeOption?.label]
  );

  const handleDownloadActa = useCallback(() => {
    if (!acta.actaFile) return;
    const url = URL.createObjectURL(acta.actaFile);
    triggerDownload(url, acta.actaFile.name);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, [acta.actaFile]);

  const closeServicesResult = () => {
    const shouldContinue = Boolean(servicesResult.result?.success);
    setServicesResult({ isOpen: false, result: null });
    if (shouldContinue) onContinue?.();
  };

  const { submitting, submit } = useManagementSubmit({
    observation,
    actaFile: acta.actaFile,
    alertsData,
    managementTypeOption,
    priceAdjustment,
    homologation,
    onSubmitManagementRequest,
    onContinue,
    onMissing: (message) => setMissing({ isOpen: true, message }),
    onResult: (result) => setServicesResult({ isOpen: true, result }),
  });

  return (
    <ManagementCard bordered={false}>
      <ManagementBody>
        <ManagementMetaStrip items={managementMetaItems} />

        <JourneyDocumentsSection
          activePdf={activePdf}
          activeExcel={activeExcel}
          viewingPdf={pdf.loadingRoute}
          onViewPdf={() => pdf.openFromRoute(activePdf?.route, activePdf?.name)}
        />

        <SolicitudForm
          isPriceAdjustment={isPriceAdjustment}
          observation={observation}
          onObservationChange={setObservation}
          actaFile={acta.actaFile}
          onBeforeUploadActa={acta.beforeUpload}
          onViewActa={() => pdf.openFromFile(acta.actaFile)}
          onDownloadActa={handleDownloadActa}
          onRemoveActa={acta.clear}
        />

        <AlertsTableSection
          variant={variant}
          columns={alertsColumns}
          dataSource={alertsData}
          onAddItem={() => setIsAddModalOpen(true)}
        />

        <ActionsRow>
          <SecondaryActionButton onClick={onBack}>Cancelar</SecondaryActionButton>
          <PrimaryActionButton type="primary" onClick={submit} loading={submitting}>
            Enviar
          </PrimaryActionButton>
        </ActionsRow>
      </ManagementBody>

      <DocumentViewerModal
        isOpen={pdf.viewer.isOpen}
        title="Visor de documento"
        subtitle={pdf.viewer.title}
        documentUrl={pdf.viewer.url}
        onClose={pdf.close}
        onDownload={pdf.downloadCurrent}
      />

      <MissingRequirementsModal
        isOpen={missing.isOpen}
        message={missing.message}
        onClose={() => setMissing({ isOpen: false, message: "" })}
      />

      <ServicesResponseModal
        isOpen={servicesResult.isOpen}
        result={servicesResult.result}
        onClose={closeServicesResult}
      />

      <AddAlertModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        columns={addAlertColumns}
        dataSource={modalDataSource}
        loading={modalLoading}
      />

      <HomologationSearchModal
        isOpen={homologation.modal.isOpen}
        onClose={homologation.closeModal}
        onSelect={homologation.select}
        dataSource={modalAllRows}
        loading={modalLoading}
        journeyLabel={appliedFilters?.operationalDay?.label || ""}
      />
    </ManagementCard>
  );
};