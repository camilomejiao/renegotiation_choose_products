import {
  BackButton,
  UnderConstructionBody,
  UnderConstructionText,
  UnderConstructionTitle,
  UnderConstructionWrapper,
} from "./UnderConstructionCard.styles";

export const UnderConstructionCard = ({ managementType, onBack }) => (
  <UnderConstructionWrapper bordered={false}>
    <UnderConstructionBody>
      <UnderConstructionTitle>Vista en construcción</UnderConstructionTitle>
      <UnderConstructionText>
        El flujo para el tipo de gestión{" "}
        <strong>{managementType || "seleccionado"}</strong> tendrá una vista
        diferente. Por ahora solo están habilitadas las vistas de{" "}
        <strong>Acta complementaria</strong> y <strong>Justificación técnica</strong>.
      </UnderConstructionText>
      <div>
        <BackButton type="button" onClick={onBack}>
          Volver
        </BackButton>
      </div>
    </UnderConstructionBody>
  </UnderConstructionWrapper>
);