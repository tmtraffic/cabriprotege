import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

interface LayoutProps {
  userRole?: "client" | "employee" | "admin";
  children?: React.ReactNode;
}

const Layout = ({ userRole = "admin", children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto-close sidebar on small screens when resizing
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Initialize sidebar state based on screen size
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} userRole={userRole} />
        <main
          className={`flex-1 transition-all duration-300 ease-in-out pt-6 px-4 md:px-6 ${
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
