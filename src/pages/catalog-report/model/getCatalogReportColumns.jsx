import { Tag } from "antd";
import styled from "@emotion/styled";
import {
  GeneralStatusDeliveryProductEnum,
  StatusTeamProductEnum,
} from "../../../helpers/GlobalEnum";

const stateColorMap = {
  [GeneralStatusDeliveryProductEnum.APPROVED]: "success",
  [GeneralStatusDeliveryProductEnum.PENDING_APPROVAL]: "warning",
  [GeneralStatusDeliveryProductEnum.REFUSED]: "error",
};

const reviewStatusColorMap = {
  [StatusTeamProductEnum.DENIED.label]: "error",
  [StatusTeamProductEnum.APPROVED.label]: "success",
  [StatusTeamProductEnum.UNREVIEWED.label]: "warning",
};

const renderObservation = (value, placeholder) => {
  const comment = value?.comentario || placeholder;
  const reviewer = value?.funcionario ? ` - ${value.funcionario}` : "";
  const reviewedDate = value?.fecha ? ` (${value.fecha})` : "";

  return (
    <ObservationText $isPlaceholder={!value?.comentario}>
      {comment}
      {value?.funcionario ? `${reviewer}${reviewedDate}` : ""}
    </ObservationText>
  );
};

const renderStatusTag = (value, colorMap) => {
  return <Tag color={colorMap[value] || "default"}>{value || "No definido"}</Tag>;
};

export const getCatalogReportColumns = () => [
  { title: "ID", dataIndex: "id", width: 90, align: "center", sorter: false },
  { title: "Categoría", dataIndex: "category", width: 190, sorter: false },
  { title: "Nombre", dataIndex: "name", width: 240, sorter: false },
  { title: "Descripción", dataIndex: "description", width: 260 },
  { title: "Marca", dataIndex: "brand", width: 160 },
  { title: "Unidad", dataIndex: "unit", width: 120, align: "center" },
  { title: "Precio Min", dataIndex: "price_min", width: 140, align: "right" },
  { title: "Precio Max", dataIndex: "price_max", width: 140, align: "right" },
  { title: "Valor", dataIndex: "price", width: 140, align: "right" },
  {
    title: "Estado",
    dataIndex: "state",
    width: 140,
    align: "center",
    render: (value) => renderStatusTag(value, stateColorMap),
  },
  {
    title: "Observación Ambiental",
    dataIndex: "observations_environmental",
    width: 280,
    render: (value) => renderObservation(value, "Observación ambiental..."),
  },
  {
    title: "Estado Ambiental",
    dataIndex: "status_environmental",
    width: 170,
    align: "center",
    render: (value) => renderStatusTag(value, reviewStatusColorMap),
  },
  {
    title: "Observación Supervisión",
    dataIndex: "observations_supervision",
    width: 290,
    render: (value) => renderObservation(value, "Observación supervisión..."),
  },
  {
    title: "Estado Supervisión",
    dataIndex: "status_supervision",
    width: 180,
    align: "center",
    render: (value) => renderStatusTag(value, reviewStatusColorMap),
  },
];

const ObservationText = styled.span`
  color: ${({ $isPlaceholder }) => ($isPlaceholder ? "#6b7280" : "inherit")};
`;
