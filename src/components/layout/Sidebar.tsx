
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
  isMobile: boolean;
  onClose?: () => void;
}

const Sidebar = ({ isOpen, userRole = "admin", isMobile }: SidebarProps) => {
  const location = useLocation();
  const currentUser = {
    name: "Administrador",
    role: userRole
  };

  // Get menu items based on user role
  const menuItems = getRoleMenuItems(userRole);

  // Mobile: MobileNavigation cuida do mobile
  if (isMobile) {
    return null;
  }

  // Desktop: Sidebar colapsável
  return (
    <aside
      className={cn(
        "bg-white border-r transition-all duration-300 overflow-hidden",
        isOpen ? "w-64" : "w-0"
      )}
    >
      <div className={cn(
        "transition-opacity duration-300",
        isOpen ? "opacity-100" : "opacity-0"
      )}>
        <div className="flex flex-col h-full px-3 py-4">
          <SidebarUser name={currentUser.name} role={currentUser.role} />

          <div className="flex-1 overflow-auto mt-5">
            <nav className="space-y-1">
              <MenuSection items={menuItems} currentPath={location.pathname} />
            </nav>
          </div>

          <div className="mt-auto">
            <SupportLink />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
