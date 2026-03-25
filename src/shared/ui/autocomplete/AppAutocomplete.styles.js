import styled from "@emotion/styled";
import { AutoComplete } from "antd";
import { CONTROL_HEIGHT } from "../lib/controlMetrics";

export const AutocompleteWrapper = styled.div`
  width: 100%;
`;

export const StyledAutoComplete = styled(AutoComplete)`
  width: 100%;

  .ant-select-selector {
    min-height: ${CONTROL_HEIGHT}px !important;
    height: ${CONTROL_HEIGHT}px !important;
    border-radius: 8px !important;
    border-color: #86b7a0 !important;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    padding: 0 12px !important;
    padding-right: 72px !important;
  }

  .ant-select-selection-wrap {
    display: flex;
    align-items: center;
  }

  .ant-select-selection-search {
    display: flex;
    align-items: center;
  }

  .ant-select-selection-search-input {
    height: ${CONTROL_HEIGHT}px !important;
    line-height: ${CONTROL_HEIGHT}px !important;
    padding: 0 !important;
    font-weight: 600;
  }

  .ant-select-selection-item {
    font-weight: 600;
    line-height: ${CONTROL_HEIGHT}px !important;
  }

  .ant-select-arrow,
  .ant-select-clear {
    top: 0 !important;
    margin-top: 0 !important;
    height: 100%;
    display: flex;
    align-items: center;
    transform: none !important;
  }

  .ant-select-arrow {
    right: 14px !important;
    width: 20px;
    justify-content: center;
    pointer-events: none !important;
  }

  .app-autocomplete-suffix-icon {
    font-size: 18px;
    padding-top: 10px;
    pointer-events: none !important;
  }

  .ant-select-clear {
    right: 50px !important;
    width: 18px;
    justify-content: center;
  }

  .app-autocomplete-clear-icon {
    font-size: 16px;
    padding-top: 10px;
  }

  &:hover .ant-select-selector {
    border-color: #198754 !important;
  }

  &.ant-select-focused .ant-select-selector {
    border-color: #198754 !important;
    box-shadow: 0 0 0 2px rgba(25, 135, 84, 0.2) !important;
  }
`;
