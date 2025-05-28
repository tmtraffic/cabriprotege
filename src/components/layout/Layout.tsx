
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  // Auto-close sidebar on mobile, auto-open on desktop
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
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Header 
        toggleSidebar={toggleSidebar} 
        isMobile={isMobile}
        userRole={userRole} 
      />
      
      <div className="flex flex-1 relative">
        {/* Desktop Sidebar - only show when not mobile */}
        {!isMobile && (
          <Sidebar 
            isOpen={sidebarOpen} 
            userRole={userRole}
            onClose={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 ease-in-out pt-4 px-4 md:pt-6 md:px-6 ${
            !isMobile && sidebarOpen ? "md:ml-64" : "md:ml-0"
          }`}
        >
          <div className="container mx-auto max-w-6xl">
            {children || <Outlet />}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Layout;
