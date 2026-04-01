import { RolesEnum } from "../../../helpers/GlobalEnum";

const ROLE_TITLES = {
  [RolesEnum.ADMIN]: "Administrador",
  [RolesEnum.SUPPLIER]: "Proveedor",
  [RolesEnum.TERRITORIAL_LINKS]: "Técnico Territorio",
  [RolesEnum.SUPERVISION]: "Supervisión",
  [RolesEnum.TECHNICAL]: "Implementación",
  [RolesEnum.PAYMENTS]: "Pagos",
  [RolesEnum.SYSTEM_USER]: "Usuario del sistema",
  [RolesEnum.TRUST_PAYMENTS]: "Fiduciaria",
  [RolesEnum.ENVIRONMENTAL]: "Ambiental",
  [RolesEnum.LEGAL]: "Jurídica",
};

export const getRoleTitle = (role) => ROLE_TITLES[role] ?? "Perfil";
