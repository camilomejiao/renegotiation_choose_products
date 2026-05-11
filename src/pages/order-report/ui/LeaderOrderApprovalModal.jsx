import {
  CheckOutlined,
  CloseOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Alert, Descriptions, Input, Typography } from "antd";

import { AppButton } from "../../../shared/ui/button";
import { Modal } from "../../../shared/ui/modal";
import { DeleteModalFooter } from "./OrderReportPage.styles";

const { Paragraph, Text } = Typography;

export const LeaderOrderApprovalModal = ({
  comment,
  confirmationAction,
  errorMessage,
  isOpen,
  modalView,
  onApprove,
  onApprovalActionSelection,
  onApprovalConfirmationCancel,
  onCancel,
  onCommentChange,
  onReject,
  request,
  submitting,
}) => {
  const normalizedComment = comment.trim();
  const isCommentValid = normalizedComment.length > 0;
  const isConfirmingApprove = confirmationAction === "approve";
  const isConfirmingReject = confirmationAction === "reject";
  const isConfirming =
    modalView === "form" && (isConfirmingApprove || isConfirmingReject);
  const isProcessing = modalView === "processing";
  const isSuccess = modalView === "success";
  const isError = modalView === "error";
  const confirmationTitle = isConfirmingApprove
    ? "Confirmar Aprobación"
    : "Confirmar Rechazo";
  const confirmationMessage = isConfirmingApprove
    ? `¿Estas seguro de querer Aprobar la solicitud de anulacion de la orden de compra ${request?.orderId || "---"}?`
    : `¿Estas seguro de querer Rechazar la solicitud de anulacion de la orden de compra ${request?.orderId || "---"}?`;
  const confirmationNote = isConfirmingApprove
    ? "La orden sera anulada automaticamente y el saldo sera devuelto."
    : "La solicitud quedara rechazada y no se realizara la anulacion automatica de la orden.";
  const modalTitle = isProcessing
    ? "Aprobando solicitud"
    : isError
      ? "Aprobación fallida"
    : isSuccess
      ? "Solicitud aprobada"
      : isConfirming
        ? confirmationTitle
        : "Detalle de solicitud";

  return (
    <Modal
      isOpen={isOpen}
      onCloseModal={onCancel}
      titleCentered
      title={
        modalTitle
      }
      footer={
        <DeleteModalFooter
          style={isSuccess || isError ? { textAlign: "center" } : undefined}
        >
          {isSuccess || isError ? (
            <AppButton
              variant={isSuccess ? "confirmSuccess" : "primary"}
              onClick={onCancel}
              disabled={submitting}
            >
              Aceptar
            </AppButton>
          ) : isProcessing ? null : isConfirming ? (
            <>
              <AppButton
                variant="secondary"
                onClick={onApprovalConfirmationCancel}
                disabled={submitting}
              >
                Cancelar
              </AppButton>
              <AppButton
                variant={isConfirmingApprove ? "confirmSuccess" : "primary"}
                onClick={isConfirmingApprove ? onApprove : onReject}
                loading={submitting}
              >
                {isConfirmingApprove ? (
                  <>
                    <CheckOutlined style={{ marginRight: 8 }} />
                    Confirmar
                  </>
                ) : (
                  "Confirmar"
                )}
              </AppButton>
            </>
          ) : (
            <>
              <AppButton
                variant="secondary"
                onClick={() => onApprovalActionSelection("reject")}
                loading={submitting}
                disabled={!isCommentValid}
              >
                Rechazar
              </AppButton>
              <AppButton
                onClick={() => onApprovalActionSelection("approve")}
                loading={submitting}
                disabled={!isCommentValid}
              >
                Aprobar
              </AppButton>
            </>
          )}
        </DeleteModalFooter>
      }
    >
      {isProcessing ? (
        <div
          style={{
            paddingTop: 24,
            paddingBottom: 12,
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 88,
              height: 88,
              margin: "0 auto 20px",
              borderRadius: "50%",
              border: "2px solid #b7eb8f",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#389e0d",
              backgroundColor: "#f6ffed",
            }}
          >
            <LoadingOutlined style={{ fontSize: 36 }} />
          </div>

          <Paragraph
            style={{
              marginBottom: 0,
              fontSize: 18,
              fontWeight: 600,
              color: "#262626",
            }}
          >
            Aprobando solicitud...
          </Paragraph>
        </div>
      ) : null}
      {isSuccess ? (
        <div
          style={{
            paddingTop: 8,
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 88,
              height: 88,
              margin: "0 auto 20px",
              borderRadius: "50%",
              border: "2px solid #52c41a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#389e0d",
              backgroundColor: "#f6ffed",
            }}
          >
            <CheckOutlined style={{ fontSize: 36 }} />
          </div>

          <Paragraph
            style={{
              marginBottom: 12,
              fontSize: 20,
              fontWeight: 700,
              color: "#262626",
            }}
          >
            Solicitud aprobada correctamente.
          </Paragraph>

          <Paragraph style={{ marginBottom: 12, color: "#262626" }}>
            La solicitud de anulacion de la orden de compra{" "}
            <Text strong>{request?.orderId || "---"}</Text> ha sido aprobada.
          </Paragraph>

          <Paragraph style={{ marginBottom: 0, color: "#595959" }}>
            La orden de compra ha sido anulada y el saldo asociado ha sido
            devuelto.
          </Paragraph>
        </div>
      ) : null}
      {isError ? (
        <div
          style={{
            paddingTop: 8,
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 88,
              height: 88,
              margin: "0 auto 20px",
              borderRadius: "50%",
              border: "2px solid #ff7875",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#cf1322",
              backgroundColor: "#fff1f0",
            }}
          >
            <CloseOutlined style={{ fontSize: 36 }} />
          </div>

          <Paragraph
            style={{
              marginBottom: 12,
              fontSize: 20,
              fontWeight: 700,
              color: "#262626",
            }}
          >
            No se pudo aprobar la solicitud.
          </Paragraph>

          <Paragraph style={{ marginBottom: 12, color: "#262626" }}>
            La solicitud de anulacion de la orden de compra{" "}
            <Text strong>{request?.orderId || "---"}</Text> no pudo ser
            aprobada.
          </Paragraph>

          <Paragraph style={{ marginBottom: 0, color: "#595959" }}>
            {errorMessage ||
              "Ocurrio un error durante el proceso de aprobacion. Intenta nuevamente."}
          </Paragraph>
        </div>
      ) : null}
      {isConfirming ? (
        <div
          style={{
            paddingTop: 8,
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 88,
              height: 88,
              margin: "0 auto 20px",
              borderRadius: "50%",
              border: `2px solid ${isConfirmingApprove ? "#52c41a" : "#faad14"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: isConfirmingApprove ? "#389e0d" : "#d48806",
              backgroundColor: "#ffffff",
            }}
          >
            <CheckOutlined style={{ fontSize: 36 }} />
          </div>

          <Paragraph
            style={{
              marginBottom: 12,
              fontSize: 18,
              fontWeight: 600,
              color: "#262626",
            }}
          >
            {confirmationMessage}
          </Paragraph>

          <div
            style={{
              padding: 16,
              borderRadius: 10,
              backgroundColor: "#f6ffed",
              border: `1px solid ${isConfirmingApprove ? "#b7eb8f" : "#ffe58f"}`,
              textAlign: "center",
            }}
          >
            <Paragraph style={{ marginBottom: 0 }}>
              {confirmationNote}
            </Paragraph>
          </div>
        </div>
      ) : null}
      {modalView === "form" && !isConfirming ? (
        <>
          <Alert
            showIcon
            type="warning"
            message="Revisa la información de la solicitud y registra una observación para Aprobar o rechazar."
          />

          <div style={{ marginTop: 16 }}>
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
              <Descriptions.Item label="Fecha de solicitud">
                {request?.requestDate || "---"}
              </Descriptions.Item>
              <Descriptions.Item label="CUB">
                {request?.cubId || "---"}
              </Descriptions.Item>
              <Descriptions.Item label="Beneficiario">
                {request?.beneficiary || "---"}
              </Descriptions.Item>
              <Descriptions.Item label="Proveedor">
                {request?.supplier || "---"}
              </Descriptions.Item>
              <Descriptions.Item label="Estado">
                {request?.approvalStatus || "---"}
              </Descriptions.Item>
            </Descriptions>
          </div>

          <div style={{ marginTop: 16 }}>
            <Text strong>Observacion del proveedor</Text>
            <div
              style={{
                marginTop: 8,
                padding: 12,
                borderRadius: 8,
                backgroundColor: "#e6f4ff",
                border: "1px solid #91caff",
              }}
            >
              <Paragraph style={{ marginBottom: 0, color: "#0958d9" }}>
                {request?.supplierObservation || "---"}
              </Paragraph>
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <Text strong>Observacion del lider</Text>
            <Input.TextArea
              rows={4}
              value={comment}
              onChange={(event) => onCommentChange(event.target.value)}
              placeholder="Ingresa la observacion del lider"
              style={{ marginTop: 8 }}
            />
            {!isCommentValid ? (
              <Text type="danger" style={{ display: "block", marginTop: 8 }}>
                La observacion del lider es obligatoria.
              </Text>
            ) : null}
          </div>
        </>
      ) : null}
    </Modal>
  );
};
