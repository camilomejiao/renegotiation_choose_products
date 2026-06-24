import {
  BackButton,
  BackButtonRow,
  CentralizationCard,
  CentralizationDescription,
  CentralizationHeader,
  CentralizationNotice,
  CentralizationTag,
  CentralizationTitle,
} from "./AlertedProductsCentralizationWidget.styles";

export const AlertedProductsCentralizationWidget = ({
  assignment,
  onBack,
}) => {
  return (
    <CentralizationCard bordered={false}>
      <CentralizationHeader>
        <CentralizationTitle>Centralización</CentralizationTitle>
        <CentralizationDescription>
          Este módulo queda listo como siguiente destino del flujo para concentrar
          la información consolidada antes de persistir o remitir la solicitud.
        </CentralizationDescription>
      </CentralizationHeader>

      <CentralizationTag color="blue">
        {assignment?.selectedRows?.length || 0} productos recibidos
      </CentralizationTag>

      <CentralizationNotice>
        Aquí se podrá conectar el resumen final de documentos, el tipo de gestión
        aplicado, validaciones cruzadas y la confirmación definitiva del proceso.
      </CentralizationNotice>

      <BackButtonRow>
        <BackButton onClick={onBack}>Volver a gestión</BackButton>
      </BackButtonRow>
    </CentralizationCard>
  );
};
