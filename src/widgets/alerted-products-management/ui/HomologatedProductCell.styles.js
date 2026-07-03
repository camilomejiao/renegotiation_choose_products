import styled from "@emotion/styled";
import { Button } from "antd";

export const HomologateButton = styled(Button)`
  && {
    height: 34px;
    border-radius: 8px;
    font-size: 0.82rem;
    font-weight: 700;
    padding: 0 14px;
    box-shadow: none;
    background: #1e3a8a;
    border-color: #1e3a8a;
    color: #ffffff;
  }

  &&:hover,
  &&:focus {
    background: #1e40af !important;
    border-color: #1e40af !important;
    color: #ffffff !important;
  }
`;

export const HomologationEmptyText = styled.div`
  margin-top: 6px;
  color: ${({ $error }) => ($error ? "#dc2626" : "#94a3b8")};
  font-size: 0.72rem;
  font-style: italic;
`;

export const HomologationSummary = styled.div`
  display: grid;
  gap: 6px;
  text-align: left;
`;

export const HomologationNameBox = styled.div`
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #ffffff;
  color: #0f172a;
  font-size: 0.82rem;
  font-weight: 600;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
`;

export const HomologationSummaryPrimary = styled.div`
  color: #0f172a;
  font-size: 0.8rem;
  font-weight: 700;
`;

export const HomologationSummaryMeta = styled.div`
  color: #64748b;
  font-size: 0.75rem;
  line-height: 1.45;
`;

export const HomologationSummaryActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 2px;
`;

export const HomologationLinkButton = styled.button`
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  font-size: 0.74rem;
  font-weight: 700;
  color: ${({ $variant }) => ($variant === "danger" ? "#dc2626" : "#1e3a8a")};

  &:hover {
    text-decoration: underline;
  }
`;