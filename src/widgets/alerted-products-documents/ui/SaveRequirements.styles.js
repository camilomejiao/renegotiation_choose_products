import styled from "@emotion/styled";

export const SaveRequirements = styled.div`
  display: grid;
  gap: 6px;
  padding-top: 4px;
`;

export const SaveRequirementItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ $isMet }) => ($isMet ? "#334155" : "#94a3b8")};
  font-size: 0.84rem;
  font-weight: 600;
`;

export const SaveRequirementIndicator = styled.span`
  width: 18px;
  height: 18px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ $isMet }) => ($isMet ? "#86efac" : "#cbd5e1")};
  background: ${({ $isMet }) => ($isMet ? "#f0fdf4" : "#f8fafc")};
  color: ${({ $isMet }) => ($isMet ? "#16a34a" : "#94a3b8")};
  font-size: 0.72rem;
  flex: 0 0 auto;
`;