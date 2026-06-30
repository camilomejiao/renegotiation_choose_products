import styled from "@emotion/styled";
import { Button, Card } from "antd";

export const TableCard = styled(Card)`
  border-radius: 20px; border: 1px solid #dbe4f0;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  .ant-card-body { padding: 0; }
`;
export const TableHeader = styled.div`display: grid; gap: 4px; padding: 20px 20px 16px; border-bottom: 1px solid #e2e8f0;`;
export const TableTitle = styled.h3`margin: 0; font-size: 1rem; font-weight: 800; color: #0f172a;`;
export const TableDescription = styled.p`margin: 0; font-size: 0.85rem; color: #64748b;`;
export const TableContent = styled.div`padding: 0;`;
export const ActionsCell = styled.div`display: flex; flex-direction: row; flex-wrap: wrap; gap: 6px; align-items: center; justify-content: center;`;

const actionBase = `
  && { height: 30px; border-radius: 8px; font-size: 0.78rem; font-weight: 700; box-shadow: none; padding: 0 10px; width: auto; white-space: nowrap; }
`;
export const GestionarButton = styled(Button)`
  ${actionBase}
  && { border-color: #16a34a; background: #16a34a; color: #fff; }
  &&:hover, &&:focus { border-color: #15803d; background: #15803d; color: #fff; }
  &&:disabled, &&[disabled] { border-color: #d1d5db; background: #f3f4f6; color: #9ca3af; cursor: not-allowed; }
  &&:disabled:hover, &&[disabled]:hover { border-color: #d1d5db; background: #f3f4f6; color: #9ca3af; }
`;
export const SubsanarButton = styled(Button)`
  ${actionBase}
  && { border-color: #f97316; background: #f97316; color: #fff; }
  &&:hover, &&:focus { border-color: #ea6c0a; background: #ea6c0a; color: #fff; }
`;
export const VerButton = styled(Button)`
  ${actionBase}
  && { border-color: #1d4ed8; background: #ffffff; color: #1d4ed8; }
  &&:hover, &&:focus { border-color: #1e40af; background: #eff6ff; color: #1e40af; }
`;
export const HistorialButton = styled(Button)`
  ${actionBase}
  && { border-color: #c4b5fd; background: #f5f3ff; color: #5b21b6; }
  &&:hover, &&:focus { border-color: #a78bfa; background: #ede9fe; color: #4c1d95; }
`;