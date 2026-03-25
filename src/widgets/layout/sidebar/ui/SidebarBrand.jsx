import React from "react";
import { BrandAccent, BrandText, SidebarBrand } from "./Sidebar.styles";

export const SidebarBrandBlock = ({ isOpen, isMobile }) => {
  return (
    <SidebarBrand isOpen={isOpen} isMobile={isMobile}>
      {isOpen ? (
        <BrandText>
          <span>Portal</span>
          <BrandAccent>PNIS</BrandAccent>
        </BrandText>
      ) : (
        <BrandText>
          <BrandAccent>PNIS</BrandAccent>
        </BrandText>
      )}
    </SidebarBrand>
  );
};
