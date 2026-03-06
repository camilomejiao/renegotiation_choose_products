import { Global, css } from "@emotion/react";
import { CloseCircleFilled, DownOutlined } from "@ant-design/icons";
import { SelectWrapper, StyledSelect } from "./AppSelect.styles";

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
  className,
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
      <SelectWrapper className={className}>
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
        />
      </SelectWrapper>
    </>
  );
};
