import { SupplierList } from "../../../components/layout/private/management_module/suppliers/SupplierList";
import { UserList } from "../../../components/layout/private/management_module/user/UserList";

export const ADMIN_MANAGEMENT_TABS_CONFIG = [
  {
    key: "users",
    label: "USUARIOS DEL SISTEMA",
    Content: UserList,
  },
  {
    key: "suppliers",
    label: "PROVEEDORES",
    Content: SupplierList,
  },
];
