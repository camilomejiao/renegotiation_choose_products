import styled from "@emotion/styled";
import { Row, Typography } from "antd";

const { Title, Text } = Typography;

export const LoginPageLayout = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(12px, 3vw, 32px);
  background:
    radial-gradient(circle at top left, rgba(30, 58, 138, 0.08), transparent 32%),
    linear-gradient(180deg, #f8fbff 0%, #eef5fb 100%);
`;

export const LoginPageRow = styled(Row)`
  width: min(1120px, 100%);
  .ant-col {
    display: flex;
  }
`;

export const LoginCard = styled.div`
  width: 100%;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(148, 163, 184, 0.24);
  border-radius: 24px;
  padding: clamp(18px, 3vw, 32px);
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.12);
  backdrop-filter: blur(8px);
`;

export const LoginHeader = styled.div`
  display: grid;
  gap: 10px;
  margin-bottom: 28px;
  justify-items: center;
  text-align: center;
`;

export const LoginHeaderImage = styled.img`
  width: 100%;
  max-width: 180px;
  height: auto;
`;

export const LoginHeaderTitle = styled(Title)`
  && {
    margin: 0;
    color: #0f172a;
  }
`;

export const LoginHeaderText = styled(Text)`
  && {
    color: #475569;
    font-size: 0.96rem;
  }
`;

export const LoginFormLayout = styled.form`
  display: grid;
  gap: 18px;
`;

export const LoginField = styled.div`
  display: grid;
  gap: 8px;
`;

export const LoginFieldLabel = styled.label`
  color: #1e293b;
  font-size: 0.95rem;
  font-weight: 700;
`;

export const LoginFieldControl = styled.div`
  position: relative;
`;

export const LoginFieldIcon = styled.img`
  position: absolute;
  inset: 50% auto auto 14px;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  pointer-events: none;
  opacity: 0.82;
  z-index: 1;
`;

export const LoginFieldInputSlot = styled.div`
  .ant-input,
  .ant-input-affix-wrapper {
    padding-left: 42px;
  }

  .ant-input {
    padding-right: ${({ $hasToggle }) => ($hasToggle ? "42px" : "12px")};
  }
`;

export const LoginPasswordToggle = styled.button`
  border: 0;
  background: transparent;
  position: absolute;
  inset: 50% 14px auto auto;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  cursor: pointer;
  padding: 0;
  z-index: 1;

  &:hover {
    color: #1d4ed8;
  }
`;

export const LoginFieldError = styled.span`
  color: #dc2626;
  font-size: 0.84rem;
`;

export const LoginSubmitRow = styled.div`
  padding-top: 6px;
`;

export const LoginSubmitButton = styled.div`
  .ant-btn {
    width: 100%;
  }
`;

export const LoginIllustrationPanel = styled.div`
  width: 100%;
  display: flex;
  align-items: stretch;
  justify-content: center;
`;

export const LoginIllustrationImage = styled.img`
  width: 100%;
  height: 100%;
  max-height: 100%;
  object-fit: cover;
  border-radius: 24px;
`;
