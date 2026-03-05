import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaFileInvoiceDollar,
  FaChartPie,
  FaShippingFast,
  FaRegBuilding,
  FaUser,
  FaHandshake,
  FaHardHat,
  FaHouseUser,
  FaBoxOpen,
  FaSearchDollar,
  FaRoute,
  FaUserCog,
  FaRegAddressBook,
  FaBoxes,
  FaTools,
  FaLeaf,
  FaUserCheck,
  FaSearchPlus,
} from "react-icons/fa";
import { MdCampaign, MdPeople } from "react-icons/md";
import { BsBank, BsCashStack } from "react-icons/bs";

import { getRoleIconKey, getRoleTitle, getSidebarMenu } from "../../../../entities/user/model/sidebarMenu";
import { SidebarShell } from "./Sidebar.styles";
import { SidebarBrandBlock } from "./SidebarBrand";
import { SidebarMobileHeader } from "./SidebarMobileHeader";
import { SidebarItem } from "./SidebarItem";
import { SidebarSubmenu } from "./SidebarSubmenu";
import { SidebarToggle } from "./SidebarToggle";

const iconMap = {
  home: FaHouseUser,
  boxes: FaBoxes,
  tools: FaTools,
  leaf: FaLeaf,
  userCheck: FaUserCheck,
  handshake: FaHandshake,
  addressBook: FaRegAddressBook,
  searchPlus: FaSearchPlus,
  userCog: FaUserCog,
  campaign: MdCampaign,
  route: FaRoute,
  searchDollar: FaSearchDollar,
  bank: BsBank,
  cashStack: BsCashStack,
  boxOpen: FaBoxOpen,
  shoppingCart: FaShoppingCart,
  fileInvoice: FaFileInvoiceDollar,
  shipping: FaShippingFast,
  chartPie: FaChartPie,
  people: MdPeople,
  building: FaRegBuilding,
  hardHat: FaHardHat,
  user: FaUser,
};

export const Sidebar = ({
  userAuth,
  isOpen = true,
  isMobile = false,
  onToggle,
  onCloseMobile,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openSubmenus, setOpenSubmenus] = useState({});

  const role = userAuth?.rol_id;
  const items = useMemo(() => getSidebarMenu(role, userAuth?.id), [role, userAuth?.id]);
  const title = getRoleTitle(role);
  const roleIconKey = getRoleIconKey(role);
  const titleIcon = iconMap[roleIconKey] || FaUser;

  const toggleSidebar = () => {
    if (onToggle) {
      onToggle(!isOpen);
    }
  };

  const toggleSubmenu = (label) => {
    setOpenSubmenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const handleNavigate = (path) => {
    if (!path) {
      return;
    }
    navigate(path);
    if (isMobile && onCloseMobile) {
      onCloseMobile();
    }
  };

  const isActive = (path) => {
    if (!path) return false;
    if (path === "/" && (location.pathname === "/" || location.pathname === "/admin")) return true;
    return location.pathname.startsWith(path) && path !== "/";
  };

  return (
    <SidebarShell isOpen={isOpen} isMobile={isMobile}>
      <SidebarBrandBlock isOpen={isOpen} isMobile={isMobile} />

      {isMobile && <SidebarMobileHeader onClose={toggleSidebar} />}

      <SidebarItem label={title} icon={titleIcon} isOpen={isOpen} dataStatic />

      {items.map((item) => {
        if (item.children && Array.isArray(item.children)) {
          const isSubmenuOpen = openSubmenus[item.label];
          const hasActiveChild = item.children.some((subItem) => isActive(subItem.path));
          return (
            <SidebarSubmenu
              key={item.label}
              label={item.label}
              icon={iconMap[item.iconKey]}
              isOpen={isOpen}
              isExpanded={isSubmenuOpen}
              hasActiveChild={hasActiveChild}
              onToggle={() => toggleSubmenu(item.label)}
            >
              {item.children.map((subItem) => (
                <SidebarItem
                  key={subItem.path}
                  label={subItem.label}
                  icon={iconMap[subItem.iconKey]}
                  isOpen={isOpen}
                  isActive={isActive(subItem.path)}
                  onClick={() => handleNavigate(subItem.path)}
                  indent={isOpen ? "48px" : "24px"}
                />
              ))}
            </SidebarSubmenu>
          );
        }

        return (
          <SidebarItem
            key={item.path}
            label={item.label}
            icon={iconMap[item.iconKey]}
            isOpen={isOpen}
            isActive={isActive(item.path)}
            onClick={() => handleNavigate(item.path)}
          />
        );
      })}

      <SidebarToggle onToggle={toggleSidebar} isOpen={isOpen} isMobile={isMobile} />
    </SidebarShell>
  );
};
