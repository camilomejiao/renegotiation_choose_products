import { useMemo } from "react";
import { getAlertManagementColumns } from "../model/getAlertManagementColumns";
import { GESTIONAR_ROLES, SUBSANAR_ROLES, VER_ROLES } from "../model/alertManagementConstants";
import { useAlertManagementFilters } from "../model/useAlertManagementFilters";
import { useAlertManagementRecord } from "../model/useAlertManagementRecord";
import { AlertManagementFilters } from "./AlertManagementFilters";
import { AlertManagementGestionView } from "./AlertManagementGestionView";
import { AlertManagementTable } from "./AlertManagementTable";
import { AlertManagementVerView } from "./AlertManagementVerView";
import { WidgetRoot } from "./filters.styles";

export const AlertManagementWidget = ({ userAuth } = {}) => {
  const rolId = userAuth?.rol_id;
  const canGestionar   = GESTIONAR_ROLES.includes(rolId);
  const canSubsanar    = SUBSANAR_ROLES.includes(rolId);
  const canVerHistorial = VER_ROLES.includes(rolId);

  const filters = useAlertManagementFilters();
  const record  = useAlertManagementRecord();

  const columns = useMemo(
    () => getAlertManagementColumns({
      alertCategoryPillMap:   filters.alertCategoryPillMap,
      alertManagementPillMap: filters.alertManagementPillMap,
      canGestionar, canSubsanar, canVerHistorial,
      onGestionar: record.handleGestionar,
      onSubsanar:  record.handleSubsanar,
      onVer:       record.handleVer,
      onHistorial: record.handleHistorial,
    }),
    [filters.alertCategoryPillMap, filters.alertManagementPillMap,
     canGestionar, canSubsanar, canVerHistorial,
     record.handleGestionar, record.handleSubsanar, record.handleVer, record.handleHistorial]
  );

  if (record.managingRecord && record.isViewMode) {
    return (
      <AlertManagementVerView
        record={record.managingRecord}
        pillMap={filters.alertManagementPillMap}
        documents={record.documents}
        detailLoading={record.detailLoading}
        detailData={record.detailData}
        onBack={record.handleBackToTable}
        onViewDocument={record.handleViewDocument}
        onDownloadDocument={record.handleDownloadDocument}
        pdfViewer={record.pdfViewer}
        onClosePdfViewer={record.closePdfViewer}
        onDownloadFromViewer={record.handleDownloadFromViewer}
      />
    );
  }

  if (record.managingRecord) {
    return (
      <AlertManagementGestionView
        record={record.managingRecord}
        pillMap={filters.alertManagementPillMap}
        documents={record.documents}
        detailLoading={record.detailLoading}
        timeline={record.timeline}
        reviewMode={record.reviewMode}
        reviewObservation={record.reviewObservation}
        reviewFiles={record.reviewFiles}
        isConfirmOpen={record.isConfirmOpen}
        onBack={record.handleBackToTable}
        onViewDocument={record.handleViewDocument}
        onDownloadDocument={record.handleDownloadDocument}
        onSelectWithObservation={record.handleSelectWithObservation}
        onSelectWithoutObservation={record.handleSelectWithoutObservation}
        onObservationChange={record.setReviewObservation}
        onFilesChange={record.handleReviewFilesChange}
        onSubmitWithObservation={record.handleSubmitWithObservation}
        onConfirmWithoutObservation={record.handleConfirmWithoutObservation}
        onCloseConfirm={() => record.setIsConfirmOpen(false)}
        pdfViewer={record.pdfViewer}
        onClosePdfViewer={record.closePdfViewer}
        onDownloadFromViewer={record.handleDownloadFromViewer}
      />
    );
  }

  return (
    <WidgetRoot>
      <AlertManagementFilters
        draftFilters={filters.draftFilters}
        journeyOptions={filters.journeyOptions}
        alertCategoryOptions={filters.alertCategoryOptions}
        alertManagementOptions={filters.alertManagementOptions}
        loadingJourneys={filters.loadingJourneys}
        loadingAlertCategory={filters.loadingAlertCategory}
        loadingAlertManagement={filters.loadingAlertManagement}
        updateDraft={filters.updateDraft}
        onSearch={filters.handleSearch}
        onClear={filters.handleClear}
        searchDisabled={filters.tableLoading}
      />
      <AlertManagementTable
        columns={columns}
        dataSource={filters.dataSource}
        loading={filters.tableLoading}
        visible={filters.tableLoading || Boolean(filters.appliedFilters)}
      />
    </WidgetRoot>
  );
};