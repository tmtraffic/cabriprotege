
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BulkImportForm from "./components/import/BulkImportForm";
import AdvancedSearch from "./components/search/AdvancedSearch";

import {
  adminRoutes,
  authRoutes,
  clientRoutes,
  crmRoutes,
  dashboardRoutes,
  documentRoutes,
  processRoutes,
  settingsRoutes,
  userRoutes,
  vehicleRoutes,
} from "./routes";
import RouteWithLayout from "./routes/RouteWithLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          
          {/* Authentication routes */}
          {authRoutes}
          
          {/* Main sections */}
          {dashboardRoutes}
          {clientRoutes}
          {vehicleRoutes}
          {processRoutes}
          {crmRoutes}
          {adminRoutes}
          {documentRoutes}
          {settingsRoutes}
          {userRoutes}
          
          {/* Utility routes */}
          <Route 
            path="/import" 
            element={<RouteWithLayout component={BulkImportForm} userRole="admin" />} 
          />
          
          <Route 
            path="/search" 
            element={<RouteWithLayout component={AdvancedSearch} userRole="admin" />} 
          />
          
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
