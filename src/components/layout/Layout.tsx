import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  userRole?: "client" | "employee" | "admin";
  children?: React.ReactNode;
}

const Layout = ({ userRole = "admin", children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useIsMobile();

  // Auto-close sidebar on mobile, keep open on desktop
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header 
        toggleSidebar={toggleSidebar} 
        isMobile={isMobile}
        userRole={userRole} 
      />
      
      <div className="flex flex-1">
        {/* Sidebar - sempre presente, mas controlado por estado */}
        <Sidebar 
          isOpen={sidebarOpen} 
          userRole={userRole}
          isMobile={isMobile}
        />
        
        {/* Main content */}
        <main
          className={`flex-1 transition-all duration-300 pt-6 px-4 md:px-6 ${
            sidebarOpen && !isMobile ? "md:ml-64" : ""
          }`}
        >
          <div className="container mx-auto max-w-7xl">
            {children || <Outlet />}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Layout;
