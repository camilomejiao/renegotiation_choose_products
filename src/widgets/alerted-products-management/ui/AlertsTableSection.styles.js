import styled from "@emotion/styled";
import { Button } from "antd";

export const AlertsSectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

export const AlertsAddButton = styled(Button)`
  && {
    height: 36px;
    border-radius: 10px;
    font-weight: 700;
    font-size: 0.84rem;
    box-shadow: none;
    background: #1e3a8a;
    border-color: #1e3a8a;
    color: #ffffff;
  }

  &&:hover,
  &&:focus {
    background: #1e40af !important;
    border-color: #1e40af !important;
    color: #ffffff !important;
  }
`;

export const AlertsTableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;

  .ant-table-thead > tr > th {
    vertical-align: middle;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .ant-table-thead .ant-table-column-title {
    display: block;
    width: 100%;
    white-space: normal;
    line-height: 1.15;
    text-align: center;
  }
`;

export const TableValidationBanner = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 10px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #1e3a8a;
  font-size: 0.84rem;
  line-height: 1.5;

  strong {
    font-weight: 800;
  }
`;