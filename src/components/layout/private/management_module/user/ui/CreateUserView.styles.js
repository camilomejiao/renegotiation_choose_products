import styled from "@emotion/styled";
import { Card, Typography } from "antd";

const { Text } = Typography;

export const MainContainer = styled.div`
  display: grid;
  gap: 24px;
  padding-bottom: 32px;
`;

export const FormCard = styled(Card)`
  margin: 0 12px;
  border-radius: 12px;
  border: 1px solid #dbe4f0;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);

  .ant-card-body {
    padding: 20px;
  }

  @media (min-width: 992px) {
    margin: 0 24px;

    .ant-card-body {
      padding: 24px;
    }
  }
`;

export const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 24px;

  .ant-typography {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const FormMeta = styled(Text)`
  && {
    color: #64748b;
  }
`;

export const LockedFieldHint = styled.div`
  max-width: 360px;
  border-radius: 12px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #1d4ed8;
  padding: 12px 14px;
  font-size: 0.95rem;
  line-height: 1.45;
`;

export const FormSection = styled.section`
  display: grid;
  gap: 16px;
  margin-bottom: 28px;
`;

export const SectionTitle = styled.h2`
  margin: 0;
  color: #0f172a;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.01em;
`;

export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const FieldControl = styled.div`
  display: grid;
  gap: 8px;
`;

export const FieldContent = styled.div`
  display: grid;
  gap: 6px;
`;

export const FieldLabel = styled.label`
  color: #334155;
  font-weight: 700;
  font-size: 0.95rem;
`;

export const HelperText = styled(Text)`
  && {
    color: #64748b;
    font-size: 0.88rem;
    line-height: 1.45;
  }
`;

export const FieldError = styled(Text)`
  && {
    color: #dc2626;
    font-size: 0.84rem;
  }
`;

export const FormSwitchRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 56px;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid #dbe4f0;
  background: #ffffff;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5);
`;

export const PasswordStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

export const ActionsRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
  flex-wrap: wrap;
`;
