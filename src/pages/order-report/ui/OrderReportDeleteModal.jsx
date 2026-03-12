import { useEffect, useRef, useState } from "react";
import { Typography } from "antd";
import styled from "@emotion/styled";

import { AppButton } from "../../../shared/ui/button";
import { Modal } from "../../../shared/ui/modal";
import { DeleteModalFooter } from "./OrderReportPage.styles";

const { Paragraph, Text } = Typography;

const LEGAL_ORDER_CANCELLATION_NOTICE = `
La anulacion de una orden de compra constituye una actuacion administrativa sensible y debe
realizarse exclusivamente cuando existan razones objetivas, verificables y suficientemente
documentadas que impidan la continuidad del proceso. Al avanzar con esta accion, el usuario deja
constancia de que ha revisado la informacion disponible, que entiende el impacto operativo de la
anulacion y que actua en el marco de sus competencias funcionales.

El usuario reconoce que una anulacion puede afectar reportes, trazabilidad documental, procesos de
seguimiento interno, validaciones posteriores y controles asociados a la orden. En consecuencia,
esta accion no debe utilizarse como mecanismo de prueba, reversa temporal o ajuste informal, sino
como una decision debidamente sustentada dentro del flujo operativo del sistema.

Tambien se entiende que la anulacion puede requerir revisiones complementarias por parte de otras
areas y generar efectos sobre registros dependientes, historicos y auditoria. Por ello, antes de
confirmar, el usuario declara que ha verificado la pertinencia de la solicitud, que comprende sus
efectos y que asume responsabilidad sobre el uso diligente de esta opcion.

Al pulsar el boton de confirmacion, el usuario manifiesta que ha leido de forma completa esta
advertencia, que comprende el alcance de la anulacion y que cuenta con fundamentos suficientes para
ejecutarla en nombre del proceso que administra.
`;

export const OrderReportDeleteModal = ({
  loading,
  onClose,
  onConfirm,
  open,
  orderId,
}) => {
  const scrollRef = useRef(null);
  const [hasReachedBottom, setHasReachedBottom] = useState(false);

  useEffect(() => {
    if (!open) {
      setHasReachedBottom(false);
      return;
    }

    const node = scrollRef.current;
    if (!node) {
      return;
    }

    node.scrollTop = 0;
    setHasReachedBottom(false);
  }, [open]);

  const handleScroll = () => {
    const node = scrollRef.current;
    if (!node) {
      return;
    }

    const reachedBottom =
      node.scrollTop + node.clientHeight >= node.scrollHeight - 4;

    if (reachedBottom) {
      setHasReachedBottom(true);
    }
  };

  return (
    <Modal
      title="Anular orden"
      subTitle="Lee la advertencia completa antes de continuar."
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
            disabled={!hasReachedBottom}
          >
            Anular orden
          </AppButton>
        </DeleteModalFooter>
      )}
    >
      <ModalContent>
        {orderId && (
          <Text strong>Orden seleccionada: {orderId}</Text>
        )}

        <LegalScrollBox ref={scrollRef} onScroll={handleScroll}>
          <Paragraph>{LEGAL_ORDER_CANCELLATION_NOTICE}</Paragraph>
        </LegalScrollBox>

        <Text type={hasReachedBottom ? "success" : "secondary"}>
          {hasReachedBottom
            ? "Has leído el texto completo. Ya puedes continuar."
            : "Desplázate hasta el final del texto para habilitar la acción."}
        </Text>
      </ModalContent>
    </Modal>
  );
};

const ModalContent = styled.div`
  display: grid;
  gap: 12px;
`;

const LegalScrollBox = styled.div`
  max-height: 260px;
  overflow-y: auto;
  padding: 16px;
  border: 1px solid #dbe4f0;
  border-radius: 12px;
  background: #f8fafc;

  .ant-typography {
    margin-bottom: 0;
    white-space: pre-line;
    line-height: 1.65;
    color: #334155;
  }
`;
