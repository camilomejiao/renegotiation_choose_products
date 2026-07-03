import styled from "@emotion/styled";

export const ResultGrid = styled.div`
  display: grid;
  gap: 16px;
`;

export const ResultCard = styled.div`
  border: 1px solid #dbe4f0;
  border-radius: 12px;
  padding: 16px;
  background: ${({ $ok }) => ($ok ? "#f0fdf4" : "#fff7ed")};
`;

export const ResultLabel = styled.div`
  font-weight: 700;
  margin-bottom: 6px;
`;

export const ResultLine = styled.div`
  margin-bottom: 6px;
`;