import React from "react";
import { NavItem, NavLink } from "./Sidebar.styles";

export const SidebarSubmenu = ({
  label,
  icon: Icon,
  isOpen,
  isExpanded,
  hasActiveChild,
  onToggle,
  children,
}) => {
  return (
    <NavItem>
      <NavLink
        type="button"
        className={hasActiveChild ? "active" : ""}
        onClick={onToggle}
      >
        {Icon && <Icon className="sidebar-icon" />}
        {isOpen && (
          <>
            <span>{label}</span>
            <span style={{ marginLeft: "auto", fontSize: "10px" }}>
              {isExpanded ? "-" : "+"}
            </span>
          </>
        )}
      </NavLink>
      {isExpanded && <div>{children}</div>}
    </NavItem>
  );
};
