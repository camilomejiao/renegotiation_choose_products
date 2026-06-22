import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "antd";
import { Modal } from "../../../shared/ui/modal";
import { ViewerFooter } from "./DocumentReportsSection.styles";
import { ClosureDocumentPrint } from "./ClosureDocumentPrint";

const PRINT_PAGE_STYLE = `
  @page { size: letter; margin: 10mm 20mm; }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
`;

export const DocumentViewerModal = ({
  isOpen,
  title,
  subtitle,
  viewModel,
  fileName,
  onClose,
}) => {
  const contentRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: fileName || "documento-cierre",
    pageStyle: PRINT_PAGE_STYLE,
  });

  return (
    <Modal
      isOpen={isOpen}
      onCloseModal={onClose}
      title={title}
      subTitle={subtitle}
      width={960}
      centered
      destroyOnClose
      maxBodyHeight="80vh"
      footer={(
        <ViewerFooter>
          <Button onClick={onClose}>Cerrar</Button>
          <Button type="primary" onClick={handlePrint}>
            Descargar PDF
          </Button>
        </ViewerFooter>
      )}
    >
      <ClosureDocumentPrint ref={contentRef} viewModel={viewModel} />
    </Modal>
  );
};
