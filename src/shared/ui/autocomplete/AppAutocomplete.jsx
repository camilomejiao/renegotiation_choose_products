import { useEffect, useMemo, useRef, useState } from "react";
import { Global, css } from "@emotion/react";
import { CloseCircleFilled, DownOutlined } from "@ant-design/icons";
import { AutocompleteWrapper, StyledAutoComplete } from "./AppAutocomplete.styles";

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
  showAllOnOpen = false,
  className,
}) => {
  const [inputValue, setInputValue] = useState(value?.label ?? "");
  const [searchText, setSearchText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const ignoreNextSearchRef = useRef(false);

  const resolvedOptions = useMemo(() => {
    const mappedOptions = toAutoCompleteOptions(options);

    if (!searchText.trim()) {
      return mappedOptions;
    }

    const normalizedQuery = searchText.toLowerCase().trim();
    return mappedOptions.filter((option) =>
      String(option?.label ?? "").toLowerCase().includes(normalizedQuery)
    );
  }, [options, searchText]);

  useEffect(() => {
    setInputValue(value?.label ?? "");
  }, [value]);

  const handleSelect = (_text, option) => {
    setInputValue(option?.label ?? "");
    setSearchText("");
    setIsOpen(false);
    if (!onChange) {
      return;
    }

    onChange(option?.raw ?? null);
  };

  const handleSearch = (text) => {
    if (ignoreNextSearchRef.current) {
      ignoreNextSearchRef.current = false;
      return;
    }

    setInputValue(text);
    setSearchText(text);
    if (onSearch) {
      onSearch(text);
    }
  };

  const handleClear = () => {
    setInputValue("");
    setSearchText("");
    if (onChange) {
      onChange(null);
    }
  };

  const handleOpenChange = (nextOpen) => {
    setIsOpen(nextOpen);

    if (nextOpen && showAllOnOpen) {
      // Always show full list on dropdown open (arrow click).
      ignoreNextSearchRef.current = true;
      setSearchText("");
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
      <AutocompleteWrapper className={className}>
        <StyledAutoComplete
          value={inputValue}
          open={isOpen}
          options={resolvedOptions}
          onSelect={handleSelect}
          onSearch={handleSearch}
          onChange={setInputValue}
          onDropdownVisibleChange={handleOpenChange}
          onClear={handleClear}
          allowClear={{
            clearIcon: <CloseCircleFilled className="app-autocomplete-clear-icon" />,
          }}
          suffixIcon={<DownOutlined className="app-autocomplete-suffix-icon" />}
          showArrow
          disabled={isDisabled}
          placeholder={placeholder}
          popupClassName="app-autocomplete-dropdown"
          notFoundContent={isLoading ? "Cargando..." : "Sin opciones"}
          filterOption={false}
        />
      </AutocompleteWrapper>
    </>
  );
};
