
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

// Import components
import SidebarUser from "./sidebar/SidebarUser";
import MenuSection from "./sidebar/MenuSection";
import SupportLink from "./sidebar/SupportLink";

// Import menu configurations
import { getRoleMenuItems } from "./sidebar/menuConfigs";

interface SidebarProps {
  isOpen: boolean;
  userRole: "client" | "employee" | "admin";
  onClose?: () => void;
}

const Sidebar = ({ isOpen, userRole = "admin", onClose }: SidebarProps) => {
  const location = useLocation();
  const currentUser = {
    name: "Administrador",
    role: userRole
  };

  // Get menu items based on user role
  const menuItems = getRoleMenuItems(userRole);

  return (
    <>
      {/* Overlay for mobile/tablet when sidebar is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full px-3 py-4">
          <SidebarUser name={currentUser.name} role={currentUser.role} />

          <div className="flex-1 overflow-auto">
            <nav className="space-y-1">
              <MenuSection items={menuItems} currentPath={location.pathname} />
            </nav>
          </div>

          <div className="mt-auto">
            <SupportLink />
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
