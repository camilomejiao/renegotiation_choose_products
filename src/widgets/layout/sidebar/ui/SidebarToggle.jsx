import React from "react";
import { FaBars } from "react-icons/fa";
import { SidebarToggleBtn, SidebarToggleRow } from "./Sidebar.styles";

export const SidebarToggle = ({ onToggle, isOpen, isMobile }) => {
  return (
    <SidebarToggleRow>
      <SidebarToggleBtn type="button" onClick={onToggle}>
        <FaBars className="sidebar-icon" />
        {isMobile && <span>{isOpen ? "Cerrar menu" : "Abrir menu"}</span>}
      </SidebarToggleBtn>
    </SidebarToggleRow>
  );
};
