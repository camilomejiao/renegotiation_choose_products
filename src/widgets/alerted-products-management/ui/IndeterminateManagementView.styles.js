import styled from "@emotion/styled";
import { Input } from "antd";

import { down } from "../../../shared/ui/lib/breakpoints";
import { ManagementBody } from "./common.styles";

// Reduce el padding del cuerpo en móviles (XS/SM) sin tocar el estilo compartido
// que usan las demás variantes de gestión.
export const ResponsiveBody = styled(ManagementBody)`
  /* La columna nunca crece más allá del contenedor (evita overflow horizontal). */
  grid-template-columns: minmax(0, 1fr);

  ${down("sm")} {
    padding: 16px;
    gap: 16px;
  }
`;

export const ObservationTextArea = styled(Input.TextArea)`
  && {
    border-radius: 12px;
  }
`;

export const SectionHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

export const StepPill = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 5px 14px;
  border-radius: 999px;
  background: #eef2ff;
  border: 1px solid #c7d2fe;
  color: #3730a3;
  font-size: 0.76rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.02em;
`;

// width:100% + overflow-x:auto crea un contenedor de scroll propio (min-width 0),
// evitando que el ancho fijo de la tabla (scroll x) estire y recorte las secciones.
export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;

  .ant-table-thead .ant-table-column-title {
    display: block;
    width: 100%;
    white-space: normal;
    line-height: 1.15;
    text-align: center;
  }
`;

export const EmptyState = styled.div`
  padding: 24px;
  border-radius: 12px;
  border: 1px dashed #cbd5e1;
  background: #f8fafc;
  color: #64748b;
  font-size: 0.88rem;
  line-height: 1.5;
  text-align: center;
`;