import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Login from "./pages/auth/Login";
import ClientDashboard from "./pages/dashboard/ClientDashboard";
import EmployeeDashboard from "./pages/dashboard/EmployeeDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Auth Routes */}
          <Route path="/auth/login" element={<Login />} />
          
          {/* Client Routes */}
          <Route path="/" element={<Layout userRole="client"><ClientDashboard /></Layout>} />
          
          {/* Employee Routes */}
          <Route path="/employee" element={<Layout userRole="employee"><EmployeeDashboard /></Layout>} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<Layout userRole="admin"><AdminDashboard /></Layout>} />
          
          {/* Catch All Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
