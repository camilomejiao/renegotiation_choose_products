import { useEffect, useState } from "react";
import { Global, css } from "@emotion/react";
import styled from "@emotion/styled";
import { CloseCircleFilled, DownOutlined } from "@ant-design/icons";
import { AutoComplete } from "antd";
import { CONTROL_HEIGHT } from "../lib/controlMetrics";

const toAutoCompleteOptions = (options = []) =>
  options.map((option) => ({
    value: String(option?.label ?? option?.value ?? ""),
    label: option?.label ?? String(option?.value ?? ""),
    raw: option,
  }));

export const AppAutocomplete = ({
  value,
  options = [],
  onChange,
  onSearch,
  placeholder,
  isDisabled = false,
  isLoading = false,
  style,
}) => {
  const [inputValue, setInputValue] = useState(value?.label ?? "");
  const resolvedOptions = toAutoCompleteOptions(options);

  useEffect(() => {
    setInputValue(value?.label ?? "");
  }, [value]);

  const handleSelect = (_text, option) => {
    setInputValue(option?.label ?? "");
    if (!onChange) {
      return;
    }

    onChange(option?.raw ?? null);
  };

  const handleSearch = (text) => {
    setInputValue(text);
    if (onSearch) {
      onSearch(text);
    }
  };

  const handleClear = () => {
    setInputValue("");
    if (onChange) {
      onChange(null);
    }
  };

  return (
    <>
      <Global
        styles={css`
          .app-autocomplete-dropdown .ant-select-item-option-selected .ant-select-item-option-content {
            font-weight: 700;
          }
        `}
      />
      <StyledAutoComplete
        value={inputValue}
        options={resolvedOptions}
        onSelect={handleSelect}
        onSearch={handleSearch}
        onChange={setInputValue}
        onClear={handleClear}
        allowClear={{
          clearIcon: <CloseCircleFilled className="app-autocomplete-clear-icon" />,
        }}
        suffixIcon={<DownOutlined className="app-autocomplete-suffix-icon" />}
        showArrow
        disabled={isDisabled}
        placeholder={placeholder}
        style={{ width: "100%", ...style }}
        popupClassName="app-autocomplete-dropdown"
        notFoundContent={isLoading ? "Cargando..." : "Sin opciones"}
        filterOption={(inputValue, option) =>
          String(option?.label ?? "")
            .toLowerCase()
            .includes(String(inputValue).toLowerCase())
        }
      />
    </>
  );
};

const StyledAutoComplete = styled(AutoComplete)`
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
