import styled from "@emotion/styled";
import { Button, Card, Col, Row } from "antd";
import { AppSelect } from "../../../shared/ui/select";

export const WidgetRoot = styled.div`
  display: grid;
  gap: 16px;
`;

export const FiltersCard = styled(Card)`
  border-radius: 20px;
  border: 1px solid #dbe4f0;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  .ant-card-body { padding: 20px 18px 16px; }
`;

export const FiltersRoot = styled.section`display: grid; gap: 18px;`;
export const FiltersHeader = styled.div`display: flex; align-items: center; gap: 10px; color: #1e3a8a;`;
export const FiltersHeaderIcon = styled.div`
  width: 32px; height: 32px; border-radius: 10px;
  display: inline-flex; align-items: center; justify-content: center;
  background: #eff6ff; font-size: 1rem; border: 1px solid #bfdbfe;
`;
export const FiltersTitle = styled.h3`margin: 0; font-size: 1rem; font-weight: 800; color: #0f172a;`;
export const FiltersForm = styled.div`display: grid; gap: 16px;`;
export const FiltersGrid = styled(Row)`width: 100%;`;
export const FiltersCol = styled(Col)`min-width: 0;`;
export const FiltersFieldGroup = styled.div`display: grid; gap: 8px;`;
export const FiltersFieldLabel = styled.label`color: #5b6780; font-size: 0.8rem; font-weight: 700;`;
export const FiltersSelect = styled(AppSelect)`width: 100%;`;
export const FiltersActions = styled.div`
  display: flex; gap: 10px; padding-top: 4px; flex-wrap: wrap;
  @media (min-width: 992px) { justify-content: flex-end; }
`;

export const PrimaryFilterButton = styled(Button)`
  && { height: 46px; min-width: 160px; border-radius: 12px; border-color: #1e3a8a; background: #1e3a8a; color: #ffffff; font-weight: 700; box-shadow: none; }
  &&:hover, &&:focus { border-color: #1e40af; background: #1e40af; color: #ffffff; }
`;
export const SecondaryFilterButton = styled(Button)`
  && { height: 46px; min-width: 160px; border-radius: 12px; border-color: #cbd5e1; background: #ffffff; color: #334155; font-weight: 600; box-shadow: none; }
  &&:hover, &&:focus { border-color: #94a3b8; color: #1e3a8a; background: #f8fafc; }
`;