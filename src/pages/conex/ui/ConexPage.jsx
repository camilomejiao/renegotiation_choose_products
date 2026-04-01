import { useConexPage } from "../model/useConexPage";
import { ConexPageStatus } from "./ConexPageStatus";

export const ConexPage = () => {
  useConexPage();

  return <ConexPageStatus />;
};
