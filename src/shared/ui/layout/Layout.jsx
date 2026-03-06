import React from "react";

export const Layout = ({
  rootClassName = "app",
  rootStateClassName = "",
  isMobile = false,
  isMobileSidebarOpen = false,
  onCloseMobile,
  header,
  sidebar,
  children,
  footer,
  contentMode = "legacy",
  contentClassName = "content",
  contentStateClassName = "",
  pageWrapperClassName = "page-wrapper",
}) => {
  const shouldUsePageWrapper = contentMode !== "fluid";

  return (
    <div className={`${rootClassName} ${rootStateClassName} ${isMobile ? "is-mobile" : ""}`.trim()}>
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

        <main className={`${contentClassName} ${contentStateClassName}`.trim()}>
          {shouldUsePageWrapper ? (
            <div className={pageWrapperClassName}>{children}</div>
          ) : (
            children
          )}

          {footer}
        </main>
      </div>
    </div>
  );
};
