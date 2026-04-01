import { dataIndexToKey, getValueByDataIndex } from "./getValueByDataIndex";
import { formatByType } from "./formatByType";

const escapeCsvCell = (value) => {
  const str = value === null || value === undefined ? "" : String(value);
  const escaped = str.replace(/"/g, '""');
  return `"${escaped}"`;
};

const toCsvRows = (headers, data) => {
  const headerLine = headers.map((header) => escapeCsvCell(header.label)).join(",");

  const lines = data.map((row) => {
    return headers
      .map((header) => {
        const rawValue = getValueByDataIndex(row, header.dataIndex);
        const value = header.type ? formatByType(header.type, rawValue) : rawValue;
        return escapeCsvCell(value);
      })
      .join(",");
  });

  return [headerLine, ...lines].join("\n");
};

export const buildCsvHeaders = (columns = [], customHeaders = []) => {
  if (Array.isArray(customHeaders) && customHeaders.length > 0) {
    return customHeaders.map((header) => ({
      label: header.label,
      dataIndex: Array.isArray(header.key) ? header.key : String(header.key).split("."),
      type: header.type,
    }));
  }

  return columns.map((column) => ({
    label: column.title,
    dataIndex: column.dataIndex,
    key: dataIndexToKey(column.dataIndex),
    type: column.type,
  }));
};

export const downloadCsv = ({
  data = [],
  columns = [],
  fileName = "records",
  headers = [],
}) => {
  const effectiveHeaders = buildCsvHeaders(columns, headers);
  const csv = toCsvRows(effectiveHeaders, data);
  const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.setAttribute("download", `${fileName}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};
