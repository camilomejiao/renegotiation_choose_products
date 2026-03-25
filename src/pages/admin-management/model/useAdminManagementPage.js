import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ADMIN_MANAGEMENT_SECTIONS,
  DEFAULT_ADMIN_MANAGEMENT_SECTION,
} from "./adminManagementSections";

export const useAdminManagementPage = () => {
  const [activeKey, setActiveKey] = useState(DEFAULT_ADMIN_MANAGEMENT_SECTION);

  const currentSectionLabel =
    ADMIN_MANAGEMENT_SECTIONS[activeKey] || ADMIN_MANAGEMENT_SECTIONS.users;

  const pageHeader = useMemo(
    () => ({
      title: "Administración",
      breadcrumbs: [
        { title: <Link to="/admin">Inicio</Link> },
        { title: "Administración" },
        { title: currentSectionLabel },
      ],
    }),
    [currentSectionLabel]
  );

  return {
    activeKey,
    pageHeader,
    handleTabChange: setActiveKey,
  };
};
