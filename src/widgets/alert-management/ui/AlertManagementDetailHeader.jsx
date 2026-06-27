import { formatDate, renderPill } from "../model/alertManagementConstants";
import { DetailMetaCard, DetailMetaLabel, DetailMetaValue, DetailTopGrid } from "./detail.styles";

export const AlertManagementDetailHeader = ({ record, pillMap }) => (
  <DetailTopGrid>
    <DetailMetaCard bordered={false}>
      <DetailMetaLabel>Estado de solicitud</DetailMetaLabel>
      <div>{renderPill(record?.gestionAlerta, record?.gestionAlertaCodigo, pillMap)}</div>
    </DetailMetaCard>
    <DetailMetaCard bordered={false}>
      <DetailMetaLabel>Usuario origen</DetailMetaLabel>
      <DetailMetaValue>{record?.rolRevisor || "Implementación"}</DetailMetaValue>
    </DetailMetaCard>
    <DetailMetaCard bordered={false}>
      <DetailMetaLabel>Fecha implementación</DetailMetaLabel>
      <DetailMetaValue>{formatDate(record?.fechaRegistro)}</DetailMetaValue>
    </DetailMetaCard>
    <DetailMetaCard bordered={false}>
      <DetailMetaLabel>Jornada</DetailMetaLabel>
      <DetailMetaValue>{record?.jornada || "—"}</DetailMetaValue>
    </DetailMetaCard>
  </DetailTopGrid>
);