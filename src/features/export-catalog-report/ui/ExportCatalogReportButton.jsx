import { Button } from "antd";
import { FileExcelOutlined } from "@ant-design/icons";

export const ExportCatalogReportButton = ({ onClick }) => {
  return (
    <Button icon={<FileExcelOutlined />} onClick={onClick} title="Generar reporte (Excel)">
      Reporte
    </Button>
  );
};
