import React from "react";
import { NavItem, NavLink } from "./Sidebar.styles";

export const SidebarItem = ({
  label,
  icon: Icon,
  isOpen,
  isActive,
  onClick,
  dataStatic,
  indent,
}) => {
  return (
    <NavItem>
      <NavLink
        type="button"
        className={isActive ? "active" : ""}
        onClick={onClick}
        data-static={dataStatic ? "true" : undefined}
        style={indent ? { paddingLeft: indent } : undefined}
      >
        {Icon && <Icon className="sidebar-icon" />}
        {isOpen && <span>{label}</span>}
      </NavLink>
    </NavItem>
  );
};
