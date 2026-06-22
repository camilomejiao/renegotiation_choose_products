import { Button } from "antd";
import { Modal } from "../../../shared/ui/modal";
import { ViewerFooter, ViewerFrame } from "./DocumentReportsSection.styles";

export const DocumentViewerModal = ({
  isOpen,
  title,
  subtitle,
  documentUrl,
  onClose,
  onDownload,
}) => (
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
        <Button type="primary" onClick={onDownload}>
          Descargar PDF
        </Button>
      </ViewerFooter>
    )}
  >
    {documentUrl ? <ViewerFrame title="Visor documento de cierre" src={documentUrl} /> : null}
  </Modal>
);
