import {
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Alert, Descriptions, Typography } from "antd";
import styled from "@emotion/styled";

import { AppButton } from "../../../shared/ui/button";
import { AppInput } from "../../../shared/ui/input";
import { Modal } from "../../../shared/ui/modal";
import { DeleteModalFooter } from "./OrderReportPage.styles";

const { Paragraph, Text } = Typography;

export const OrderReportDeleteModal = ({
  cancellationReason,
  errorMessage,
  hasReadLegalText,
  loading,
  modalView,
  onClose,
  onConfirmationCancel,
  onConfirm,
  onContinue,
  onLegalTextRead,
  onReasonChange,
  open,
  orderId,
}) => {
  const hasCancellationReason = cancellationReason.trim().length > 0;
  const isConfirming = modalView === "confirm";
  const isProcessing = modalView === "processing";
  const isSuccess = modalView === "success";
  const isError = modalView === "error";
  const canContinue = hasCancellationReason && hasReadLegalText;
  const modalTitle = isProcessing
    ? "Creando solicitud"
    : isSuccess
      ? "Solicitud registrada"
      : isError
        ? "No se pudo crear la solicitud"
        : isConfirming
          ? "Confirmar solicitud de anulación"
          : "Solicitar anulación de orden";

  return (
    <Modal
      title={modalTitle}
      subTitle={
        isProcessing || isSuccess || isError
          ? ""
          : "Esta acción inicia una revisión formal sobre la orden de compra seleccionada."
      }
      isOpen={open}
      onCloseModal={onClose}
      titleCentered
      centered
      destroyOnClose
      width={760}
      footer={
        <DeleteModalFooter
          style={isSuccess || isError ? { textAlign: "center" } : undefined}
        >
          {isSuccess || isError ? (
            <AppButton
              variant={isSuccess ? "confirmSuccess" : "primary"}
              onClick={onClose}
              disabled={loading}
            >
              Aceptar
            </AppButton>
          ) : isProcessing ? null : isConfirming ? (
            <>
              <AppButton
                variant="secondary"
                onClick={onConfirmationCancel}
                disabled={loading}
              >
                Volver
              </AppButton>
              <AppButton variant="danger" onClick={onConfirm} loading={loading}>
                Confirmar solicitud
              </AppButton>
            </>
          ) : (
            <>
              <AppButton variant="secondary" onClick={onClose} disabled={loading}>
                Cancelar
              </AppButton>
              <AppButton
                variant="danger"
                onClick={onContinue}
                disabled={!canContinue}
              >
                Continuar
              </AppButton>
            </>
          )}
        </DeleteModalFooter>
      }
    >
      {isProcessing ? (
        <FeedbackState>
          <FeedbackIconWrapper $tone="processing">
            <LoadingOutlined style={{ fontSize: 36 }} />
          </FeedbackIconWrapper>
          <FeedbackTitle>Registrando solicitud...</FeedbackTitle>
          <FeedbackText>
            Estamos creando la solicitud de anulación de la orden{" "}
            <Text strong>{orderId || "---"}</Text>.
          </FeedbackText>
        </FeedbackState>
      ) : null}

      {isSuccess ? (
        <FeedbackState>
          <FeedbackIconWrapper $tone="success">
            <CheckOutlined style={{ fontSize: 36 }} />
          </FeedbackIconWrapper>
          <FeedbackTitle>Solicitud registrada correctamente.</FeedbackTitle>
          <FeedbackText>
            La solicitud de anulación de la orden{" "}
            <Text strong>{orderId || "---"}</Text> fue enviada para revisión.
          </FeedbackText>
          <FeedbackSubText>
            El equipo responsable validará la información antes de gestionar la
            anulación.
          </FeedbackSubText>
        </FeedbackState>
      ) : null}

      {isError ? (
        <FeedbackState>
          <FeedbackIconWrapper $tone="error">
            <CloseOutlined style={{ fontSize: 36 }} />
          </FeedbackIconWrapper>
          <FeedbackTitle>No se pudo registrar la solicitud.</FeedbackTitle>
          <FeedbackText>
            La solicitud de anulación de la orden{" "}
            <Text strong>{orderId || "---"}</Text> no pudo ser creada.
          </FeedbackText>
          <FeedbackSubText>
            {errorMessage ||
              "Ocurrió un error durante el proceso. Intenta nuevamente."}
          </FeedbackSubText>
        </FeedbackState>
      ) : null}

      {isConfirming ? (
        <CenteredStepContent>
          <FeedbackIconWrapper $tone="confirm">
            <ExclamationCircleOutlined style={{ fontSize: 36 }} />
          </FeedbackIconWrapper>

          <ConfirmationHeading>
            ¿Estas seguro de querer crear la solicitud de anulacion de la orden
            de compra {orderId || "---"}?
          </ConfirmationHeading>

          <ConfirmationNote>
            La solicitud sera enviada al equipo responsable para su validacion y
            gestion posterior.
          </ConfirmationNote>
        </CenteredStepContent>
      ) : null}

      {!isConfirming && !isProcessing && !isSuccess && !isError ? (
        <ModalContent>
          <Alert
            showIcon
            type="warning"
            message="Revisa la información de la solicitud y desplázate hasta el final del texto jurídico antes de continuar."
          />

          <Descriptions
            bordered
            column={1}
            size="small"
            labelStyle={{ fontWeight: 700 }}
            contentStyle={{ fontWeight: 400 }}
          >
            <Descriptions.Item label="Orden de compra">
              {orderId || "---"}
            </Descriptions.Item>
          </Descriptions>

          <FieldCard>
            <SectionTitle>Texto jurídico</SectionTitle>
            <ScrollableLegalText
              onScroll={(event) => {
                if (hasReadLegalText) {
                  return;
                }

                const { scrollTop, scrollHeight, clientHeight } =
                  event.currentTarget;
                const hasReachedBottom =
                  scrollTop + clientHeight >= scrollHeight - 8;

                if (hasReachedBottom) {
                  onLegalTextRead();
                }
              }}
            >
              <Paragraph>
                Estimado Proveedor:
              </Paragraph>
              <Paragraph>
                Al continuar con esta solicitud, usted declara que ha leído,
                entendido y aceptado los términos aplicables a la anulación de
                la orden de compra en el Portal PNIS.
              </Paragraph>
              <Paragraph>
                Tenga en cuenta que la solicitud de anulación solo podrá ser
                cancelada mientras se encuentre en estado <Text strong>"Pendiente"</Text>.
                Una vez cambie a cualquier otro estado, no procederá su
                cancelación, reversión o modificación.
              </Paragraph>
              <Paragraph>
                Asimismo, acepta que no podrán generarse ni tramitarse actas de
                entrega asociadas a la orden de compra objeto de anulación.
              </Paragraph>
              <Paragraph>
                Verifique la información antes de continuar, ya que este
                trámite puede ser irreversible en el sistema.
              </Paragraph>
            </ScrollableLegalText>
            <ScrollHint type={hasReadLegalText ? "success" : "warning"}>
              {hasReadLegalText
                ? "Texto jurídico leído. Ya puedes registrar el motivo."
                : "Desplázate hasta el final del texto jurídico para habilitar el motivo de anulación."}
            </ScrollHint>
          </FieldCard>

          <FieldCard>
            <FieldHeader>
              <SectionTitle>Motivo de anulación</SectionTitle>
              <CharacterCount
                type={hasCancellationReason ? "secondary" : "danger"}
              >
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
              disabled={!hasReadLegalText}
            />

            <FieldHint type={hasCancellationReason ? "secondary" : "danger"}>
              {!hasReadLegalText
                ? "Debes leer primero el texto jurídico para habilitar este campo."
                : hasCancellationReason
                ? "Este motivo se enviará al equipo responsable de la revisión."
                : "El motivo de anulación es obligatorio."}
            </FieldHint>
          </FieldCard>
        </ModalContent>
      ) : null}
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

const SectionTitle = styled(Text)`
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
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

const CenteredStepContent = styled.div`
  padding-top: 8px;
  text-align: center;
`;

const ConfirmationHeading = styled(Paragraph)`
  max-width: 440px;
  margin: 0 auto 20px;
  font-size: 18px;
  font-weight: 700;
  color: #262626;
`;

const ConfirmationNote = styled.div`
  max-width: 440px;
  margin: 0 auto;
  padding: 16px;
  border-radius: 10px;
  background: #fff1f0;
  border: 1px solid #ffccc7;
  color: #a61d24;
`;

const ScrollableLegalText = styled.div`
  max-height: 180px;
  overflow-y: auto;
  margin-top: 12px;
  padding: 14px;
  border-radius: 10px;
  border: 1px solid #d9d9d9;
  background: #ffffff;

  .ant-typography {
    margin-bottom: 0;
    line-height: 1.7;
    color: #434343;
  }

  .ant-typography + .ant-typography {
    margin-top: 12px;
  }
`;

const ScrollHint = styled(Text)`
  display: block;
  margin-top: 10px;
  font-size: 12px;
`;

const FeedbackState = styled.div`
  padding-top: 8px;
  text-align: center;
`;

const FeedbackIconWrapper = styled.div`
  width: 88px;
  height: 88px;
  margin: 0 auto 20px;
  border-radius: 50%;
  border: 2px solid
    ${({ $tone }) =>
      $tone === "success"
        ? "#52c41a"
        : $tone === "error"
          ? "#ff7875"
          : $tone === "confirm"
            ? "#ff7875"
            : "#ff7875"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $tone }) =>
    $tone === "success"
      ? "#389e0d"
      : $tone === "error"
        ? "#cf1322"
        : $tone === "confirm"
          ? "#cf1322"
          : "#cf1322"};
  background-color: ${({ $tone }) =>
    $tone === "success" ? "#f6ffed" : "#fff1f0"};
`;

const FeedbackTitle = styled(Paragraph)`
  margin-bottom: 12px;
  font-size: 20px;
  font-weight: 700;
  color: #262626;
`;

const FeedbackText = styled(Paragraph)`
  margin-bottom: 12px;
  color: #262626;
`;

const FeedbackSubText = styled(Paragraph)`
  margin-bottom: 0;
  color: #595959;
`;
