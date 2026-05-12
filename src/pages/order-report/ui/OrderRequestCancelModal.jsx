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

export const OrderRequestCancelModal = ({
  errorMessage,
  isOpen,
  loading,
  modalView,
  observation,
  onClose,
  onConfirm,
  onContinue,
  onObservationChange,
  onReturn,
  request,
}) => {
  const normalizedObservation = observation.trim();
  const isObservationValid = normalizedObservation.length > 0;
  const isConfirming = modalView === "confirm";
  const isProcessing = modalView === "processing";
  const isSuccess = modalView === "success";
  const isError = modalView === "error";
  const modalTitle = isProcessing
    ? "Cancelando solicitud"
    : isSuccess
      ? "Solicitud cancelada"
      : isError
        ? "No se pudo cancelar la solicitud"
        : isConfirming
          ? "Confirmar cancelación"
          : "Cancelar solicitud";

  return (
    <Modal
      title={modalTitle}
      subTitle={
        isProcessing || isSuccess || isError
          ? ""
          : "Esta acción dejará la solicitud en estado cancelado."
      }
      isOpen={isOpen}
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
                onClick={onReturn}
                disabled={loading}
              >
                Volver
              </AppButton>
              <AppButton variant="danger" onClick={onConfirm} loading={loading}>
                Confirmar cancelación
              </AppButton>
            </>
          ) : (
            <>
              <AppButton variant="secondary" onClick={onClose} disabled={loading}>
                Cerrar
              </AppButton>
              <AppButton
                variant="danger"
                onClick={onContinue}
                disabled={!isObservationValid}
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
          <FeedbackTitle>Cancelando solicitud...</FeedbackTitle>
          <FeedbackText>
            Estamos actualizando la solicitud asociada a la orden{" "}
            <Text strong>{request?.orderId || "---"}</Text>.
          </FeedbackText>
        </FeedbackState>
      ) : null}

      {isSuccess ? (
        <FeedbackState>
          <FeedbackIconWrapper $tone="success">
            <CheckOutlined style={{ fontSize: 36 }} />
          </FeedbackIconWrapper>
          <FeedbackTitle>Solicitud cancelada correctamente.</FeedbackTitle>
          <FeedbackText>
            La solicitud asociada a la orden{" "}
            <Text strong>{request?.orderId || "---"}</Text> quedó en estado
            cancelado.
          </FeedbackText>
        </FeedbackState>
      ) : null}

      {isError ? (
        <FeedbackState>
          <FeedbackIconWrapper $tone="error">
            <CloseOutlined style={{ fontSize: 36 }} />
          </FeedbackIconWrapper>
          <FeedbackTitle>No se pudo cancelar la solicitud.</FeedbackTitle>
          <FeedbackText>
            La solicitud asociada a la orden{" "}
            <Text strong>{request?.orderId || "---"}</Text> no pudo ser
            cancelada.
          </FeedbackText>
          <FeedbackSubText>
            {errorMessage || "Ocurrió un error durante el proceso."}
          </FeedbackSubText>
        </FeedbackState>
      ) : null}

      {isConfirming ? (
        <CenteredStepContent>
          <FeedbackIconWrapper $tone="confirm">
            <ExclamationCircleOutlined style={{ fontSize: 36 }} />
          </FeedbackIconWrapper>

          <ConfirmationHeading>
            ¿Estás seguro de querer cancelar la solicitud asociada a la orden de
            compra {request?.orderId || "---"}?
          </ConfirmationHeading>

          <ConfirmationNote>
            La solicitud quedará en estado CANCELADO y no continuará el flujo de
            revisión.
          </ConfirmationNote>
        </CenteredStepContent>
      ) : null}

      {!isConfirming && !isProcessing && !isSuccess && !isError ? (
        <ModalContent>
          <Alert
            showIcon
            type="warning"
            message="Revisa la información de la solicitud y registra una observación para continuar con la cancelación."
          />

          <Descriptions
            bordered
            column={1}
            size="small"
            labelStyle={{ fontWeight: 700 }}
            contentStyle={{ fontWeight: 400 }}
          >
            <Descriptions.Item label="Orden de compra">
              {request?.orderId || "---"}
            </Descriptions.Item>
            <Descriptions.Item label="Estado actual">
              {request?.status || "---"}
            </Descriptions.Item>
          </Descriptions>

          <FieldCard>
            <FieldHeader>
              <SectionTitle>Observación</SectionTitle>
              <CharacterCount
                type={isObservationValid ? "secondary" : "danger"}
              >
                {observation.length}/500
              </CharacterCount>
            </FieldHeader>

            <AppInput
              multiline
              rows={5}
              value={observation}
              onChange={(event) => onObservationChange(event.target.value)}
              placeholder="Describe por qué deseas cancelar la solicitud"
              maxLength={500}
            />

            <FieldHint type={isObservationValid ? "secondary" : "danger"}>
              {isObservationValid
                ? "Esta observación se enviará con el cambio de estado."
                : "La observación es obligatoria."}
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

const FieldHeader = styled.div``;

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
          : "#ff7875"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $tone }) =>
    $tone === "success" ? "#389e0d" : "#cf1322"};
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
