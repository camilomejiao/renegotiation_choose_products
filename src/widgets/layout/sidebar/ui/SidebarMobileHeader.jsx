import React from "react";
import { FaTimes } from "react-icons/fa";
import { MobileClose, MobileHeader } from "./Sidebar.styles";

export const SidebarMobileHeader = ({ onClose }) => {
  return (
    <MobileHeader>
      <strong>Menu</strong>
      <MobileClose type="button" onClick={onClose} aria-label="Cerrar menu">
        <FaTimes />
      </MobileClose>
    </MobileHeader>
  );
};
