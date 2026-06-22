import { Card } from "react-bootstrap";
import { FaListAlt } from "react-icons/fa";
import { SectionHeader } from "../../../components/layout/shared/section_header/SectionHeader";
import { SmartTable } from "../../../shared/ui/smart-table";
import {
  DOCUMENT_REPORTS_EMPTY_TEXT,
  DOCUMENT_REPORTS_SECTION_SUBTITLE,
  DOCUMENT_REPORTS_SECTION_TITLE,
} from "../model/constants";
import { getDocumentReportsColumns } from "../model/getDocumentReportsColumns";
import { DocumentActionButton } from "./DocumentReportsSection.styles";
import { DocumentUnavailableModal } from "./DocumentUnavailableModal";
import { DocumentViewerModal } from "./DocumentViewerModal";

export const DocumentReportsSection = ({
  rows,
  isVisible,
  documentViewer,
  documentUnavailableModal,
  viewerTitle,
  viewerSubtitle,
  onOpenDocumentViewer,
  onCloseDocumentViewer,
  onCloseDocumentUnavailableModal,
  onDownloadViewerFile,
}) => {
  if (!isVisible) {
    return null;
  }

  const columns = getDocumentReportsColumns({
    onOpenDocumentViewer,
    DocumentActionButton,
  });

  return (
    <>
      <Card className="mt-4 mb-4 shadow-sm">
        <Card.Body>
          <SectionHeader
            icon={FaListAlt}
            title={DOCUMENT_REPORTS_SECTION_TITLE}
            subtitle={DOCUMENT_REPORTS_SECTION_SUBTITLE}
          />

          <div className="mt-3">
            <SmartTable
              rowKey="id"
              columns={columns}
              dataSource={rows}
              total={rows.length}
              currentPage={1}
              defaultPageSize={10}
              pageSizeOptions={["5", "10", "20"]}
              defaultText={DOCUMENT_REPORTS_EMPTY_TEXT}
              enableRowSelection={false}
              showTableResize={false}
              showColumnSettings={false}
              showToolbar={false}
              scroll={{ x: 1100 }}
            />
          </div>
        </Card.Body>
      </Card>

      <DocumentUnavailableModal
        isOpen={documentUnavailableModal.isOpen}
        title={documentUnavailableModal.title}
        message={documentUnavailableModal.message}
        onClose={onCloseDocumentUnavailableModal}
      />

      <DocumentViewerModal
        isOpen={documentViewer.isOpen}
        title={viewerTitle}
        subtitle={viewerSubtitle}
        viewModel={documentViewer.viewModel}
        fileName={documentViewer.fileName}
        onClose={onCloseDocumentViewer}
      />
    </>
  );
};
