
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import MobileNavigation from "./MobileNavigation";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  userRole?: "client" | "employee" | "admin";
  children?: React.ReactNode;
}

const Layout = ({ userRole = "admin", children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    // Auto-close sidebar on mobile, auto-open on desktop
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1">
        {!isMobile && (
          <Sidebar isOpen={sidebarOpen} userRole={userRole} />
        )}
        <main
          className={`flex-1 transition-all duration-300 ease-in-out pt-4 px-4 md:pt-6 md:px-6 ${
            sidebarOpen && !isMobile ? "md:ml-64" : "md:ml-0"
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
