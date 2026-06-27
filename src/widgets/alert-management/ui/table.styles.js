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
export const ActionsCell = styled.div`display: flex; flex-direction: row; flex-wrap: nowrap; gap: 6px; align-items: center; justify-content: center;`;

const actionBase = `
  && { height: 30px; border-radius: 8px; font-size: 0.78rem; font-weight: 700; box-shadow: none; padding: 0 10px; width: auto; white-space: nowrap; }
`;
export const GestionarButton = styled(Button)`
  ${actionBase}
  && { border-color: #1e3a8a; background: #1e3a8a; color: #fff; }
  &&:hover, &&:focus { border-color: #1e40af; background: #1e40af; color: #fff; }
`;
export const SubsanarButton = styled(Button)`
  ${actionBase}
  && { border-color: #d97706; background: #fffbeb; color: #92400e; }
  &&:hover, &&:focus { border-color: #b45309; background: #fef3c7; color: #78350f; }
`;
export const VerButton = styled(Button)`
  ${actionBase}
  && { border-color: #cbd5e1; background: #f8fafc; color: #334155; }
  &&:hover, &&:focus { border-color: #94a3b8; background: #f1f5f9; color: #1e3a8a; }
`;
export const HistorialButton = styled(Button)`
  ${actionBase}
  && { border-color: #c4b5fd; background: #f5f3ff; color: #5b21b6; }
  &&:hover, &&:focus { border-color: #a78bfa; background: #ede9fe; color: #4c1d95; }
`;