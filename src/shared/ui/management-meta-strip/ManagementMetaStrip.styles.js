import styled from "@emotion/styled";

export const MetaStripRoot = styled.div`
  display: flex;
  flex-wrap: wrap;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  background: #ffffff;
  overflow: hidden;
`;

export const MetaStripItem = styled.div`
  flex: 1;
  min-width: 130px;
  display: grid;
  gap: 6px;
  padding: 14px 18px;
  border-right: 1px solid #e2e8f0;

  &:last-child {
    border-right: none;
  }

  @media (max-width: 640px) {
    border-right: none;
    border-bottom: 1px solid #e2e8f0;

    &:last-child {
      border-bottom: none;
    }
  }
`;

export const MetaLabel = styled.span`
  color: #64748b;
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const MetaValue = styled.span`
  color: #0f172a;
  font-size: 0.9rem;
  font-weight: 700;
`;

export const MetaTypeBadge = styled.span`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  padding: 4px 10px;
  border-radius: 8px;
  background: #1e3a8a;
  color: #ffffff;
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

export const MetaStatusPill = styled.span`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;

  background: ${({ $color }) => {
    if ($color === "success") return "#dcfce7";
    if ($color === "warning") return "#fef9c3";
    if ($color === "error") return "#fef2f2";
    return "#f1f5f9";
  }};
  border: 1px solid ${({ $color }) => {
    if ($color === "success") return "#86efac";
    if ($color === "warning") return "#fde047";
    if ($color === "error") return "#fca5a5";
    return "#cbd5e1";
  }};
  color: ${({ $color }) => {
    if ($color === "success") return "#15803d";
    if ($color === "warning") return "#a16207";
    if ($color === "error") return "#b91c1c";
    return "#475569";
  }};
`;