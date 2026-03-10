import { Col, Row, Skeleton, Typography } from "antd";
import {
  ActionsRow,
  FormCard,
  FormHeader,
  FormMeta,
  FormSection,
  LockedFieldHint,
  MainContainer,
  SkeletonFieldBlock,
  SkeletonSwitchRow,
} from "./UserFormWidget.styles";

const { Title } = Typography;

export const UserFormSkeleton = ({
  isEdit = false,
  showLockedHint = false,
}) => {
  return (
    <MainContainer>
      <FormCard>
        <FormHeader>
          <Row gutter={[16, 16]} align="top">
            <Col xs={24} sm={24} md={24} lg={14} xl={16} xxl={18}>
              <div>
                <Title level={3}>{isEdit ? "Configuración del usuario" : "Nuevo usuario"}</Title>
                <FormMeta>
                  {isEdit
                    ? "Aquí puedes actualizar tu información personal y cambiar tu contraseña."
                    : "Crea un usuario nuevo con la configuración requerida."}
                </FormMeta>
              </div>
            </Col>

            {showLockedHint && (
              <Col xs={24} sm={24} md={24} lg={10} xl={8} xxl={6}>
                <LockedFieldHint>
                  Puedes editar solo tu nombre, apellido, teléfono y contraseña.
                </LockedFieldHint>
              </Col>
            )}
          </Row>
        </FormHeader>

        <FormSection>
          <Skeleton.Input active size="small" style={{ width: 220 }} />
          <Row gutter={[18, 18]}>
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
              <SkeletonSwitchRow active paragraph={{ rows: 1 }} title={{ width: "48%" }} />
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
              <SkeletonSwitchRow active paragraph={{ rows: 1 }} title={{ width: "36%" }} />
            </Col>
          </Row>
        </FormSection>

        <FormSection>
          <Skeleton.Input active size="small" style={{ width: 220 }} />
          <Row gutter={[18, 18]}>
            <Col xs={24} sm={24} md={24} lg={16} xl={14} xxl={12}>
              <SkeletonFieldBlock active paragraph={{ rows: 1 }} title={{ width: "32%" }} />
            </Col>
          </Row>
        </FormSection>

        <FormSection>
          <Skeleton.Input active size="small" style={{ width: 180 }} />
          <Row gutter={[18, 18]}>
            {Array.from({ length: 6 }).map((_, index) => (
              <Col key={index} xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
                <SkeletonFieldBlock
                  active
                  paragraph={{ rows: 1 }}
                  title={{ width: `${32 + (index % 3) * 8}%` }}
                />
              </Col>
            ))}
          </Row>
        </FormSection>

        <Row gutter={[12, 12]} justify="end">
          <Col xs={24} sm={12} md="auto" lg="auto" xl="auto" xxl="auto">
            <ActionsRow>
              <Skeleton.Button active size="default" style={{ width: 110 }} />
            </ActionsRow>
          </Col>
          <Col xs={24} sm={12} md="auto" lg="auto" xl="auto" xxl="auto">
            <ActionsRow>
              <Skeleton.Button active size="default" style={{ width: 130 }} />
            </ActionsRow>
          </Col>
        </Row>
      </FormCard>
    </MainContainer>
  );
};
