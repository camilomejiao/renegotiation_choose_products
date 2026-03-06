import { Global, css } from "@emotion/react";
import styled from "@emotion/styled";
import { CloseCircleFilled, DownOutlined } from "@ant-design/icons";
import { Select } from "antd";
import { CONTROL_HEIGHT } from "../lib/controlMetrics";

const toOptionShape = (option) => {
  if (!option) {
    return null;
  }

  if (typeof option === "object" && "value" in option && "label" in option) {
    return option;
  }

  return { value: option, label: String(option) };
};

export const AppSelect = ({
  value,
  options = [],
  onChange,
  placeholder,
  isClearable = true,
  isDisabled = false,
  isLoading = false,
  noOptionsMessage,
  showSearch = true,
  style,
}) => {
  const handleChange = (nextValue, option) => {
    if (!onChange) {
      return;
    }

    if (nextValue === undefined || nextValue === null) {
      onChange(null);
      return;
    }

    onChange(toOptionShape(option));
  };

  return (
    <>
      <Global
        styles={css`
          .app-select-dropdown .ant-select-item-option-selected .ant-select-item-option-content {
            font-weight: 700;
          }
        `}
      />
      <StyledSelect
        value={value?.value}
        options={options}
        onChange={handleChange}
        placeholder={placeholder}
        allowClear={
          isClearable
            ? { clearIcon: <CloseCircleFilled className="app-select-clear-icon" /> }
            : false
        }
        suffixIcon={<DownOutlined className="app-select-suffix-icon" />}
        disabled={isDisabled}
        loading={isLoading}
        showSearch={showSearch}
        optionFilterProp="label"
        notFoundContent={noOptionsMessage ? noOptionsMessage() : "Sin opciones"}
        popupClassName="app-select-dropdown"
        style={{ width: "100%", ...style }}
      />
    </>
  );
};

const StyledSelect = styled(Select)`
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

  .app-select-suffix-icon {
    font-size: 18px;
    padding-top: 10px;
    pointer-events: none !important;
  }

  .ant-select-clear {
    right: 50px !important;
    width: 18px;
    justify-content: center;
  }

  .app-select-clear-icon {
    font-size: 16px;
    padding-top: 10px;
  }

  .ant-select-selection-item {
    font-weight: 600;
    line-height: ${CONTROL_HEIGHT}px !important;
  }

  &:hover .ant-select-selector {
    border-color: #198754 !important;
  }

  &.ant-select-focused .ant-select-selector {
    border-color: #198754 !important;
    box-shadow: 0 0 0 2px rgba(25, 135, 84, 0.2) !important;
  }
`;
