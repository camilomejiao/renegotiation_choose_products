import React, { useMemo, useState } from "react";
import { Button, Divider, message, Popover, Radio, Space } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { downloadCsv } from "../lib/csvExport";

export const DownloadMenu = ({
  config,
  selectedRows,
  currentData,
  allData,
  columns,
}) => {
  const [format, setFormat] = useState(config?.fileTypes?.[0]?.key || "csv");
  const [scope, setScope] = useState("selected");
  const [messageApi, contextHolder] = message.useMessage();

  const dataByScope = useMemo(() => {
    if (scope === "selected") {
      return selectedRows;
    }

    if (scope === "current") {
      return currentData;
    }

    return allData;
  }, [allData, currentData, scope, selectedRows]);

  const startDownload = () => {
    if (!format) {
      messageApi.info(config?.labels?.selectFileTypeMsg || "Selecciona un formato");
      return;
    }

    if (!Array.isArray(dataByScope) || dataByScope.length === 0) {
      messageApi.info(config?.labels?.noRecordsMsg || "No hay registros para descargar");
      return;
    }

    if (config?.advanced && typeof config?.onDownload === "function") {
      config.onDownload(format, scope, dataByScope);
      return;
    }

    downloadCsv({
      data: config?.data?.length ? config.data : dataByScope,
      columns,
      fileName: config?.fileName || "records",
      headers: config?.headers,
    });
  };

  const content = (
    <>
      {config?.advanced && (
        <>
          <Radio.Group
            value={format}
            onChange={(event) => setFormat(event.target.value)}
            size="small"
          >
            <Space direction="vertical">
              {(config?.fileTypes || []).map((fileType) => (
                <Radio key={fileType.key} value={fileType.key}>
                  {fileType.label}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
          <Divider />
        </>
      )}

      <Radio.Group
        size="small"
        value={scope}
        onChange={(event) => setScope(event.target.value)}
      >
        <Space direction="vertical">
          <Radio value="selected">{config?.labels?.selected || "Seleccionados"}</Radio>
          <Radio value="current">{config?.labels?.current || "Página actual"}</Radio>
          <Radio value="all">{config?.labels?.all || "Todos"}</Radio>
        </Space>
      </Radio.Group>

      <Divider />

      <Button type="primary" block onClick={startDownload} loading={config?.isLoading}>
        {config?.labels?.download || "Descargar"}
      </Button>
    </>
  );

  return (
    <>
      <Popover placement="bottomRight" trigger="click" content={content}>
        <Button type="text" icon={<DownloadOutlined />}>
          {config?.label || "Descargar"}
        </Button>
      </Popover>
      {contextHolder}
    </>
  );
};
