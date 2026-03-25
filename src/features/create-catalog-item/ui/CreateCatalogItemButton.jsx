import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

export const CreateCatalogItemButton = ({ onClick }) => {
  return (
    <Button icon={<PlusOutlined />} type="primary" onClick={onClick}>
      Crear jornada
    </Button>
  );
};
