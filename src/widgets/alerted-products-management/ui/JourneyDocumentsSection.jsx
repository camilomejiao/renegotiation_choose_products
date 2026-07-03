import { useState } from "react";
import {
  DownloadOutlined,
  EyeOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import { Tooltip } from "antd";

import { downloadRouteFile } from "../lib/fileDownload";
import { formatTimestamp } from "../lib/format";
import { extractFileName } from "../lib/labels";
import { SectionCard, SectionTitle } from "./common.styles";
import {
  JourneyDocActions,
  JourneyDocButton,
  JourneyDocEmpty,
  JourneyDocIcon,
  JourneyDocInfo,
  JourneyDocItem,
  JourneyDocMeta,
  JourneyDocName,
  JourneyDocumentsRow,
} from "./JourneyDocumentsSection.styles";

export const JourneyDocumentsSection = ({
  activePdf,
  activeExcel,
  viewingPdf,
  onViewPdf,
}) => {
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingExcel, setDownloadingExcel] = useState(false);

  const handleDownload = async (doc, setLoading, fallback) => {
    setLoading(true);
    try {
      await downloadRouteFile(doc.route, doc.name || fallback);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SectionCard>
      <SectionTitle>Documentos de Gestión de la Jornada</SectionTitle>
      <JourneyDocumentsRow>
        {activePdf ? (
          <JourneyDocItem>
            <JourneyDocIcon>
              <FilePdfOutlined />
            </JourneyDocIcon>
            <JourneyDocInfo>
              <JourneyDocName>{extractFileName(activePdf.name)}</JourneyDocName>
              <JourneyDocMeta>{formatTimestamp(activePdf.uploadedAt)}</JourneyDocMeta>
            </JourneyDocInfo>
            <JourneyDocActions>
              <Tooltip title="Visualizar">
                <JourneyDocButton
                  icon={<EyeOutlined />}
                  loading={viewingPdf}
                  onClick={onViewPdf}
                />
              </Tooltip>
              <Tooltip title="Descargar">
                <JourneyDocButton
                  icon={<DownloadOutlined />}
                  loading={downloadingPdf}
                  onClick={() => handleDownload(activePdf, setDownloadingPdf, "documento.pdf")}
                />
              </Tooltip>
            </JourneyDocActions>
          </JourneyDocItem>
        ) : (
          <JourneyDocEmpty>Sin documento PDF activo</JourneyDocEmpty>
        )}

        {activeExcel ? (
          <JourneyDocItem>
            <JourneyDocIcon $type="excel">
              <FileExcelOutlined />
            </JourneyDocIcon>
            <JourneyDocInfo>
              <JourneyDocName>{extractFileName(activeExcel.name)}</JourneyDocName>
              <JourneyDocMeta>{formatTimestamp(activeExcel.uploadedAt)}</JourneyDocMeta>
            </JourneyDocInfo>
            <JourneyDocActions>
              <Tooltip title="Descargar">
                <JourneyDocButton
                  icon={<DownloadOutlined />}
                  loading={downloadingExcel}
                  onClick={() =>
                    handleDownload(activeExcel, setDownloadingExcel, "documento.xlsx")
                  }
                />
              </Tooltip>
            </JourneyDocActions>
          </JourneyDocItem>
        ) : (
          <JourneyDocEmpty>Sin documento Excel activo</JourneyDocEmpty>
        )}
      </JourneyDocumentsRow>
    </SectionCard>
  );
};