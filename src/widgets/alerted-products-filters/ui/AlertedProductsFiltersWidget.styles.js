import styled from "@emotion/styled";
import { Button, Card, Col, Input, Row, Select } from "antd";
import { AppSelect } from "../../../shared/ui/select";

export const FiltersCard = styled(Card)`
  border-radius: 20px;
  border: 1px solid #dbe4f0;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);

  .ant-card-body {
    padding: 20px 18px 16px;
  }
`;

export const FiltersRoot = styled.section`
  display: grid;
  gap: 18px;
`;

export const FiltersHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #1e3a8a;
`;

export const FiltersHeaderIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #eff6ff;
  font-size: 1rem;
  border: 1px solid #bfdbfe;
`;

export const FiltersTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 800;
  color: #0f172a;
`;

export const FiltersForm = styled.div`
  display: grid;
  gap: 16px;
`;

export const FiltersGrid = styled(Row)`
  width: 100%;
`;

export const FiltersCol = styled(Col)`
  min-width: 0;
`;

export const FiltersFieldGroup = styled.div`
  display: grid;
  gap: 8px;
`;

export const FiltersFieldLabel = styled.label`
  color: #5b6780;
  font-size: 0.8rem;
  font-weight: 700;
`;

export const RequiredMark = styled.span`
  color: #dc2626;
  margin-left: 4px;
`;

export const FiltersSelect = styled(AppSelect)`
  width: 100%;
`;

export const FiltersInput = styled(Input)`
  && {
    height: 44px;
    border-radius: 12px;
    border-color: #cbd5e1;
    font-size: 0.94rem;
    color: #0f172a;
    box-shadow: none;

    &:hover {
      border-color: #94a3b8;
    }

    &:focus,
    &.ant-input-focused {
      border-color: #1e3a8a;
      box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.12);
    }

    &::placeholder {
      color: #94a3b8;
    }
  }
`;

export const FiltersMultiSelect = styled(Select)`
  width: 100%;
  max-width: 100%;
  min-width: 0;

  .ant-select-selector {
    min-height: 44px !important;
    max-height: 112px !important;
    overflow-x: auto !important;
    overflow-y: auto !important;
    padding: 5px 10px !important;
    border-radius: 12px !important;
    border-color: #cbd5e1 !important;
    box-shadow: none !important;
    align-items: flex-start;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .ant-select-selection-overflow {
    gap: 6px;
    flex-wrap: wrap;
    align-content: flex-start;
    min-width: 0;
    width: 100%;
  }

  .ant-select-selection-item {
    height: 28px;
    flex-shrink: 0;
    min-width: 0;
    white-space: nowrap;
    margin-inline-end: 0 !important;
    padding-inline: 10px 6px !important;
    border-radius: 999px;
    background: #eff6ff !important;
    border: 1px solid #bfdbfe;
    color: #1e3a8a;
    font-size: 0.86rem;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
  }

  .ant-select-selection-item-remove {
    color: #1e3a8a !important;
    margin-left: 6px;
    display: inline-flex;
    align-items: center;
  }

  .ant-select-selection-placeholder,
  .ant-select-selection-search-input {
    color: #64748b;
    font-size: 0.94rem;
  }

  &:hover .ant-select-selector {
    border-color: #94a3b8 !important;
  }

  &.ant-select-focused .ant-select-selector {
    border-color: #1e3a8a !important;
    box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.12) !important;
  }
`;

export const FiltersActions = styled.div`
  display: flex;
  gap: 10px;
  padding-top: 4px;
  flex-wrap: wrap;

  @media (min-width: 992px) {
    justify-content: flex-end;
  }
`;

export const PrimaryFilterButton = styled(Button)`
  && {
    height: 46px;
    min-width: 180px;
    border-radius: 12px;
    border-color: #1e3a8a;
    background: #1e3a8a;
    color: #ffffff;
    font-weight: 700;
    box-shadow: none;
  }

  &&:hover,
  &&:focus {
    border-color: #1e40af;
    background: #1e40af;
    color: #ffffff;
  }
`;

export const SecondaryFilterButton = styled(Button)`
  && {
    height: 46px;
    min-width: 180px;
    border-radius: 12px;
    border-color: #cbd5e1;
    background: #ffffff;
    color: #334155;
    font-weight: 600;
    box-shadow: none;
  }

  &&:hover,
  &&:focus {
    border-color: #94a3b8;
    color: #1e3a8a;
    background: #f8fafc;
  }
`;
