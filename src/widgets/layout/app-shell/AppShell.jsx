import React from "react";

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
    const shouldUsePageWrapper = resolvedContentMode !== "fluid";

    return (
        <div className={`app ${isDesktopSidebarOpen ? "sidebar-open" : "sidebar-collapsed"} ${isMobile ? "is-mobile" : ""}`}>
            {header}
            {isMobile && isMobileSidebarOpen && (
                <button
                    type="button"
                    aria-label="Cerrar menu lateral"
                    className="sidebar-overlay"
                    onClick={onCloseMobile}
                />
            )}
            <div className="layout-container">
                {sidebar}
                <main className={`content ${isDesktopSidebarOpen ? "" : "sidebar-collapsed"}`}>
                    {shouldUsePageWrapper ? (
                        <div className="page-wrapper">
                            {children}
                        </div>
                    ) : children}
                    {footer}
                </main>
            </div>
        </div>
    );
};
