import { Modal as AppModal } from "../../../shared/ui/modal";
import { SecondaryActionButton } from "./common.styles";
import { ResultCard, ResultGrid, ResultLabel, ResultLine } from "./ServicesResponseModal.styles";

export const ServicesResponseModal = ({ isOpen, result, onClose }) => (
  <AppModal
    title={
      result?.success
        ? "Servicios procesados correctamente"
        : "Resultado del procesamiento"
    }
    isOpen={isOpen}
    onCloseModal={onClose}
    footer={
      <SecondaryActionButton onClick={onClose}>
        {result?.success ? "Continuar" : "Cerrar"}
      </SecondaryActionButton>
    }
    width={640}
    centered
  >
    <ResultGrid>
      {[result?.management, result?.request].filter(Boolean).map((serviceResult) => (
        <ResultCard key={serviceResult.label} $ok={serviceResult.ok}>
          <ResultLabel>{serviceResult.label}</ResultLabel>
          <ResultLine>
            Estado: {serviceResult.ok ? "OK" : "Error"}
            {serviceResult.status ? ` (${serviceResult.status})` : ""}
          </ResultLine>
          {serviceResult.code ? <ResultLine>Código: {serviceResult.code}</ResultLine> : null}
          <div>{serviceResult.message}</div>
        </ResultCard>
      ))}
    </ResultGrid>
  </AppModal>
);