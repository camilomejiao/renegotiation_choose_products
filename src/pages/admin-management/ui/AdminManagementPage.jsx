import { Page } from "../../../shared/ui/page";
import { AdminManagementTabsWidget } from "../../../widgets/admin-management-tabs";
import { useAdminManagementPage } from "../model/useAdminManagementPage";
import { AdminManagementHero } from "./AdminManagementHero";

export const AdminManagementPage = () => {
  const { activeKey, pageHeader, handleTabChange } = useAdminManagementPage();

  return (
    <Page
      showPageHeader
      header={pageHeader}
      contentPadding="0"
      minHeight="auto"
      headerPaddingTop="36px"
      headerMarginBottom="12px"
    >
      <AdminManagementHero />

      <AdminManagementTabsWidget
        activeKey={activeKey}
        onTabChange={handleTabChange}
      />
    </Page>
  );
};
