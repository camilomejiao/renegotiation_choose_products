import { useMemo } from "react";
import { AppTabs } from "../../../shared/ui/tabs";
import { ADMIN_MANAGEMENT_TABS_CONFIG } from "../config/adminManagementTabsConfig";

export const AdminManagementTabsWidget = ({ activeKey, onTabChange }) => {
  const items = useMemo(
    () =>
      ADMIN_MANAGEMENT_TABS_CONFIG.map(({ Content, ...tab }) => ({
        ...tab,
        children: <Content />,
      })),
    []
  );

  return (
    <AppTabs
      tabsProps={{
        activeKey,
        onChange: onTabChange,
        items,
      }}
    />
  );
};
