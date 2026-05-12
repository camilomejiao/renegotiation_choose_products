import styled from "@emotion/styled";

import { CONTROL_HEIGHT } from "../lib/controlMetrics";
import { AppSearchInput } from "../search-input";
import { AppSelect } from "../select";

const ControlShell = styled.div`
  display: inline-flex;
  align-items: stretch;
  flex-wrap: nowrap;
  min-width: 0;

  &:focus-within {
    box-shadow: 0 0 0 2px rgba(25, 135, 84, 0.2);
    border-radius: 8px;
  }
`;

const SelectSlot = styled.div`
  width: 156px;
  min-width: 156px;
  flex: 0 0 156px;

  .table-search-select .ant-select-selector {
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
    box-shadow: none !important;
    padding-right: 28px !important;
  }

  .table-search-select.ant-select-single.ant-select-show-arrow
    .ant-select-selection-item,
  .table-search-select.ant-select-single.ant-select-show-arrow
    .ant-select-selection-search,
  .table-search-select.ant-select-single.ant-select-show-arrow
    .ant-select-selection-placeholder {
    padding-inline-end: 0 !important;
  }

  .table-search-select.ant-select-focused .ant-select-selector {
    box-shadow: none !important;
  }

  .table-search-select .ant-select-arrow {
    right: 10px !important;
  }
`;

const InputSlot = styled.div`
  width: 230px;
  min-width: 230px;
  flex: 0 0 230px;

  .table-search-input.ant-input-affix-wrapper {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    margin-left: -1px;
    min-height: ${CONTROL_HEIGHT}px;
    height: ${CONTROL_HEIGHT}px;
    padding-inline-end: 0;
  }

  .table-search-input.ant-input-affix-wrapper:focus,
  .table-search-input.ant-input-affix-wrapper:focus-within {
    z-index: 1;
    box-shadow: none;
  }

  .table-search-input .ant-input {
    min-width: 0;
  }
`;

export const TableSearchControl = ({
  attributeOptions,
  loading,
  onAttributeChange,
  onSearchValueChange,
  searchValue,
  selectedAttribute,
}) => {
  return (
    <ControlShell>
      <SelectSlot>
        <AppSelect
          className="table-search-select"
          value={selectedAttribute}
          options={attributeOptions}
          placeholder="Buscar por"
          onChange={onAttributeChange}
          isDisabled={loading}
          isClearable={false}
        />
      </SelectSlot>

      <InputSlot>
        <AppSearchInput
          className="table-search-input"
          placeholder="Ingresa el valor"
          value={searchValue}
          onChange={onSearchValueChange}
          disabled={loading}
          allowClear={false}
        />
      </InputSlot>
    </ControlShell>
  );
};
