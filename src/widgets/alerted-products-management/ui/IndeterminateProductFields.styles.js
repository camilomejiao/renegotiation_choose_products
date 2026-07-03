import styled from "@emotion/styled";
import { Input } from "antd";

import { up } from "../../../shared/ui/lib/breakpoints";

export const PanelNote = styled.p`
  margin: 0 0 16px;
  padding: 10px 14px;
  border-radius: 10px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #1e3a8a;
  font-size: 0.82rem;
  line-height: 1.5;
`;

/* Rejilla de 3 columnas que escala con los breakpoints de Ant Design.
   XS/SM (< md): apilada en una sola columna. MD/LG/XL/XXL: 3 columnas. */
const gridColumns = `
  ${up("md")} {
    grid-template-columns: 170px minmax(0, 1fr) 150px;
  }
  ${up("lg")} {
    grid-template-columns: 210px minmax(0, 1fr) 180px;
  }
  ${up("xl")} {
    grid-template-columns: 260px minmax(0, 1fr) 220px;
  }
`;

export const FieldTable = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
`;

export const FieldTableHead = styled.div`
  display: none;
  gap: 16px;
  padding: 12px 18px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;

  span {
    color: #475569;
    font-size: 0.76rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }

  ${up("md")} {
    display: grid;
  }
  ${gridColumns}
`;

export const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  padding: 14px;

  &:not(:last-of-type) {
    border-bottom: 1px solid #eef2f7;
  }

  ${up("md")} {
    gap: 16px;
    padding: 14px 18px;
    align-items: center;
  }
  ${gridColumns}
`;

export const FieldName = styled.div`
  color: #334155;
  font-size: 0.84rem;
  font-weight: 700;
`;

export const FieldResponsable = styled.div`
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 600;
  font-style: italic;

  ${up("md")} {
    font-style: normal;
  }
`;

export const Required = styled.span`
  color: #dc2626;
  margin-left: 2px;
`;

export const TextInput = styled(Input)`
  && {
    border-radius: 10px;
    height: 40px;
  }
`;

export const TextArea = styled(Input.TextArea)`
  && {
    border-radius: 10px;
  }
`;

/* Input deshabilitado para los valores que completa Sub. Operativa. */
export const PendingInput = styled(Input)`
  && {
    border-radius: 10px;
    height: 40px;
    background: #ffffff;
  }

  &&::placeholder,
  && input::placeholder {
    color: #94a3b8;
    font-style: italic;
  }
`;

/* Caja gris de solo lectura para datos ya conocidos del producto alertado. */
export const ReadonlyBox = styled.div`
  min-height: 40px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #f1f5f9;
  color: #0f172a;
  font-size: 0.86rem;
  font-weight: 700;
`;

/* Pill informativo para el ID que se asigna tras la creación. */
export const AutoAssignPill = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 999px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 600;
`;