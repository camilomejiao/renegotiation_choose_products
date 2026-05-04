import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import styled from "@emotion/styled";

import { AppButton } from "../../../shared/ui/button";
import { AppCheckbox } from "../../../shared/ui/checkbox";
import { AppInput } from "../../../shared/ui/input";
import { Modal } from "../../../shared/ui/modal";
import { DeleteModalFooter } from "./OrderReportPage.styles";

const { Paragraph, Text } = Typography;

const IMPACT_ITEMS = [
  "La solicitud será revisada por el equipo de Implementación antes de ser gestionada.",
  "Si la anulación es aceptada, la orden no podrá reactivarse ni deshacerse.",
  "Debes registrar un motivo claro para sustentar la solicitud.",
];

export const OrderReportDeleteModal = ({
  cancellationReason,
  confirmationChecked,
  loading,
  onClose,
  onConfirmationChange,
  onConfirm,
  onReasonChange,
  open,
  orderId,
}) => {
  const hasCancellationReason = cancellationReason.trim().length > 0;
  const canSubmit = hasCancellationReason && confirmationChecked;

  return (
    <Modal
      title="Solicitar anulación de orden"
      subTitle="Esta acción inicia una revisión formal sobre la orden de compra seleccionada."
      isOpen={open}
      onCloseModal={onClose}
      centered
      destroyOnClose
      footer={(
        <DeleteModalFooter>
          <AppButton variant="secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </AppButton>
          <AppButton
            variant="danger"
            onClick={onConfirm}
            loading={loading}
            disabled={!canSubmit}
          >
            Enviar
          </AppButton>
        </DeleteModalFooter>
      )}
    >
      <ModalContent>
        <HeroCard>
          <HeroIcon>
            <ExclamationCircleOutlined />
          </HeroIcon>

          <HeroBody>
            <HeroEyebrow>Advertencia importante</HeroEyebrow>
            <HeroTitle>
              Una vez la solicitud sea gestionada, no podrá ser cancelada.
            </HeroTitle>
            {orderId && (
              <OrderPill>Orden seleccionada: {orderId}</OrderPill>
            )}
          </HeroBody>
        </HeroCard>

        <SummaryCard>
          <SectionTitle>Puntos que debes confirmar antes de continuar</SectionTitle>
          <ImpactList>
            {IMPACT_ITEMS.map((item) => (
              <ImpactItem key={item}>
                <ImpactDot />
                <span>{item}</span>
              </ImpactItem>
            ))}
          </ImpactList>

          <LegalCopy>
            <Paragraph>
              PENDIENTE TEXTO JURÍDICO
            </Paragraph>
            <Paragraph>
              Al continuar, declaras que revisaste la información disponible y
              entiendes el impacto operativo de la solicitud.
            </Paragraph>
          </LegalCopy>
        </SummaryCard>

        <FieldCard>
          <FieldHeader>
            <SectionTitle>Motivo de anulación</SectionTitle>
            <CharacterCount type={hasCancellationReason ? "secondary" : "danger"}>
              {cancellationReason.length}/500
            </CharacterCount>
          </FieldHeader>

          <AppInput
            multiline
            rows={5}
            value={cancellationReason}
            onChange={(event) => onReasonChange(event.target.value)}
            placeholder="Describe por qué solicitas la anulación de esta orden"
            maxLength={500}
          />

          <FieldHint type={hasCancellationReason ? "secondary" : "danger"}>
            {hasCancellationReason
              ? "Este motivo se enviará al equipo responsable de la revisión."
              : "El motivo de anulación es obligatorio."}
          </FieldHint>
        </FieldCard>

        <ConfirmationCard $checked={confirmationChecked}>
          <AppCheckbox
            checked={confirmationChecked}
            onChange={(event) => onConfirmationChange(event.target.checked)}
          >
            He leído y acepto el texto jurídico aplicable a esta solicitud.
          </AppCheckbox>
        </ConfirmationCard>
      </ModalContent>
    </Modal>
  );
};

const ModalContent = styled.div`
  > * + * {
    margin-top: 16px;
  }
`;

const cardStyles = `
  border-radius: 18px;
  padding: 18px;
`;

const HeroCard = styled.div`
  ${cardStyles}
  background:
    radial-gradient(circle at top left, rgba(239, 68, 68, 0.18), transparent 44%),
    linear-gradient(135deg, #fff6f6 0%, #fff1f2 100%);
  border: 1px solid #fecaca;
`;

const HeroIcon = styled.div`
  width: 48px;
  height: 48px;
  line-height: 48px;
  text-align: center;
  border-radius: 14px;
  background: #b91c1c;
  color: #ffffff;
  font-size: 22px;
  box-shadow: 0 10px 24px rgba(185, 28, 28, 0.22);
`;

const HeroBody = styled.div`
  margin-top: 14px;
`;

const HeroEyebrow = styled(Text)`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #b91c1c;
`;

const HeroTitle = styled.div`
  font-size: 18px;
  line-height: 1.45;
  font-weight: 700;
  color: #7f1d1d;
`;

const OrderPill = styled.div`
  width: fit-content;
  margin-top: 8px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #fecaca;
  color: #991b1b;
  font-size: 12px;
  font-weight: 600;
`;

const SummaryCard = styled.div`
  ${cardStyles}
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #dbe4f0;

  > * + * {
    margin-top: 14px;
  }
`;

const SectionTitle = styled(Text)`
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
`;

const ImpactList = styled.div`
  > * + * {
    margin-top: 10px;
  }
`;

const ImpactItem = styled.div`
  color: #334155;
  line-height: 1.5;
`;

const ImpactDot = styled.span`
  display: inline-block;
  width: 10px;
  height: 10px;
  margin-top: 6px;
  margin-right: 10px;
  vertical-align: top;
  border-radius: 999px;
  background: linear-gradient(180deg, #ef4444 0%, #b91c1c 100%);
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.12);
`;

const LegalCopy = styled.div`
  .ant-typography {
    margin-bottom: 0;
    line-height: 1.65;
    color: #475569;
  }

  .ant-typography + .ant-typography {
    margin-top: 4px;
  }
`;

const FieldCard = styled.div`
  ${cardStyles}
  background: #ffffff;
  border: 1px solid #dbe4f0;

  > * + * {
    margin-top: 10px;
  }
`;

const FieldHeader = styled.div`
`;

const CharacterCount = styled(Text)`
  font-size: 12px;
  display: block;
  margin-top: 4px;
`;

const FieldHint = styled(Text)`
  font-size: 12px;
`;

const ConfirmationCard = styled.div`
  ${cardStyles}
  border: 1px solid ${({ $checked }) => ($checked ? "#86efac" : "#dbe4f0")};
  background:
    ${({ $checked }) =>
      $checked
        ? "linear-gradient(180deg, #f0fdf4 0%, #f7fee7 100%)"
        : "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)"};
  transition: border-color 0.2s ease, background 0.2s ease;
`;
