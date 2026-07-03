import { CheckCircleOutlined, CheckOutlined } from "@ant-design/icons";

import {
  SaveRequirementIndicator,
  SaveRequirementItem,
  SaveRequirements as SaveRequirementsList,
} from "./SaveRequirements.styles";

const REQUIREMENT_LABELS = {
  journey: "Jornada seleccionada",
  pdf: "PDF seleccionado",
  excel: "Excel seleccionado",
};

export const SaveRequirements = ({ hasSelectedJourney, hasSelectedPdf, hasSelectedExcel }) => {
  const requirements = [
    { key: "journey", isMet: hasSelectedJourney },
    { key: "pdf", isMet: hasSelectedPdf },
    { key: "excel", isMet: hasSelectedExcel },
  ];

  return (
    <SaveRequirementsList>
      {requirements.map(({ key, isMet }) => (
        <SaveRequirementItem key={key} $isMet={isMet}>
          <SaveRequirementIndicator $isMet={isMet}>
            {isMet ? <CheckCircleOutlined /> : <CheckOutlined />}
          </SaveRequirementIndicator>
          {REQUIREMENT_LABELS[key]}
        </SaveRequirementItem>
      ))}
    </SaveRequirementsList>
  );
};