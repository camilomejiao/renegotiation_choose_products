import React from "react";
import { Layout } from "../../../shared/ui/layout";

export const AppShell = ({
    isDesktopSidebarOpen,
    isMobile,
    isMobileSidebarOpen,
    header,
    sidebar,
    children,
    footer,
    onCloseMobile,
    contentMode = "legacy",
    disablePageWrapper = false,
}) => {
    const resolvedContentMode = contentMode || (disablePageWrapper ? "fluid" : "legacy");

    return (
        <Layout
            rootClassName="app"
            rootStateClassName={isDesktopSidebarOpen ? "sidebar-open" : "sidebar-collapsed"}
            isMobile={isMobile}
            isMobileSidebarOpen={isMobileSidebarOpen}
            onCloseMobile={onCloseMobile}
            header={header}
            sidebar={sidebar}
            footer={footer}
            contentMode={resolvedContentMode}
            contentClassName="content"
            contentStateClassName={isDesktopSidebarOpen ? "" : "sidebar-collapsed"}
        >
            {children}
        </Layout>
    );
};
