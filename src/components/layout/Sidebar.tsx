
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { FileSearch } from "lucide-react";

// Import components
import SidebarUser from "./sidebar/SidebarUser";
import MenuSection from "./sidebar/MenuSection";
import SupportLink from "./sidebar/SupportLink";

// Import menu configurations
import { getRoleMenuItems } from "./sidebar/menuConfigs";

interface SidebarProps {
  isOpen: boolean;
  userRole: "client" | "employee" | "admin";
}

const Sidebar = ({ isOpen, userRole = "admin" }: SidebarProps) => {
  const location = useLocation();
  const currentUser = {
    name: "Administrador",
    role: userRole
  };

  // Get menu items based on user role
  const menuItems = [
    ...getRoleMenuItems(userRole),
    {
      title: "Consultas Infosimples",
      href: "/search/infosimples",
      icon: FileSearch,
    },
  ];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-30 mt-16 h-[calc(100vh-4rem)] w-64 transition-transform duration-300 ease-in-out bg-sidebar border-r border-sidebar-border pb-4",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "md:translate-x-0"
      )}
    >
      <div className="flex flex-col h-full px-3 py-4">
        <SidebarUser name={currentUser.name} role={currentUser.role} />

        <div className="flex-1 overflow-auto">
          <nav className="space-y-1">
            {/* Dashboard Section */}
            <MenuSection items={menuItems} currentPath={location.pathname} />
          </nav>
        </div>

        <div className="mt-auto">
          <SupportLink />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
