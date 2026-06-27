import { DownloadOutlined, EyeOutlined } from "@ant-design/icons";
import {
  DetailDocActions, DetailDocButton, DetailDocInfo, DetailDocItem,
  DetailDocMeta, DetailDocName, DetailDocsList, DetailSectionCard, DetailSectionTitle,
} from "./detail.styles";

export const AlertManagementDocsList = ({ documents, loading, onView, onDownload }) => (
  <DetailSectionCard bordered={false}>
    <DetailSectionTitle>Documentos de jornada y soporte</DetailSectionTitle>
    {loading ? (
      <div style={{ padding: "16px 0", color: "#64748b" }}>Cargando documentos...</div>
    ) : (
      <DetailDocsList>
        {documents.length === 0 && (
          <div style={{ color: "#94a3b8", fontSize: 13 }}>Sin documentos registrados.</div>
        )}
        {documents.map((doc) => (
          <DetailDocItem key={doc.id}>
            <DetailDocInfo>
              <DetailDocName>{doc.nombre}</DetailDocName>
              <DetailDocMeta>{doc.descripcion || (doc.esPdf ? "Documento PDF" : "Documento Excel")}</DetailDocMeta>
            </DetailDocInfo>
            <DetailDocActions>
              {doc.puedeVer && <DetailDocButton icon={<EyeOutlined />} title="Visualizar" onClick={() => onView(doc)} />}
              {doc.puedeDescargar && <DetailDocButton icon={<DownloadOutlined />} title="Descargar" onClick={() => onDownload(doc)} />}
            </DetailDocActions>
          </DetailDocItem>
        ))}
      </DetailDocsList>
    )}
  </DetailSectionCard>
);