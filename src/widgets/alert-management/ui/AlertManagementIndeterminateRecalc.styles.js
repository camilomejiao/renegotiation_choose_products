import styled from "@emotion/styled";
import { Button, Input, InputNumber } from "antd";

import { up } from "../../../shared/ui/lib/breakpoints";

export const RecalcSection = styled.div`
  display: grid;
  gap: 14px;
  margin-top: 8px;
`;

export const RecalcBanner = styled.p`
  margin: 0;
  padding: 10px 14px;
  border-radius: 10px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #1e3a8a;
  font-size: 0.82rem;
  font-weight: 600;
  line-height: 1.5;
`;

/* La rejilla es ancha (7 columnas): scroll horizontal propio para no romper el layout. */
export const RecalcTableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const GRID = "minmax(180px, 1.6fr) 130px 130px 160px 160px minmax(180px, 1.6fr) 150px";

export const RecalcTable = styled.div`
  min-width: 1050px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
`;

export const RecalcHead = styled.div`
  display: grid;
  grid-template-columns: ${GRID};
  gap: 12px;
  padding: 12px 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;

  span {
    color: #475569;
    font-size: 0.76rem;
    font-weight: 800;
  }
`;

export const RecalcRow = styled.div`
  display: grid;
  grid-template-columns: ${GRID};
  gap: 12px;
  align-items: center;
  padding: 14px 16px;
`;

export const ProductName = styled.div`
  color: #0f172a;
  font-size: 0.86rem;
  font-weight: 700;
`;

export const CurrencyInput = styled(InputNumber)`
  && {
    width: 100%;
    border-radius: 8px;
  }

  && .ant-input-number-input {
    text-align: right;
    font-weight: 700;
    color: #0f172a;
  }
`;

export const ObservationInput = styled(Input)`
  && {
    border-radius: 8px;
  }
`;

export const CalcButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const CalcButton = styled(Button)`
  && {
    height: 42px;
    min-width: 160px;
    border-radius: 10px;
    font-weight: 700;
    box-shadow: none;
    background: #1e40af;
    border-color: #1e40af;
    color: #ffffff;
  }

  &&:hover,
  &&:focus {
    background: #1d4ed8 !important;
    border-color: #1d4ed8 !important;
    color: #ffffff !important;
  }

  &&:disabled {
    background: #e2e8f0 !important;
    border-color: #e2e8f0 !important;
    color: #94a3b8 !important;
  }
`;

const TONE = {
  green: { bg: "#E8F8EE", border: "#B7E4C7", color: "#04995B" },
  amber: { bg: "#FFF4DB", border: "#FCDDA2", color: "#B45309" },
  red: { bg: "#FEE2E2", border: "#FCA5A5", color: "#991B1B" },
};

export const ResultMessage = styled.div`
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 0.84rem;
  font-weight: 600;
  line-height: 1.5;
  background: ${({ $tone }) => TONE[$tone]?.bg ?? TONE.green.bg};
  border: 1px solid ${({ $tone }) => TONE[$tone]?.border ?? TONE.green.border};
  color: ${({ $tone }) => TONE[$tone]?.color ?? TONE.green.color};

  ${up("md")} {
    font-size: 0.86rem;
  }
`;