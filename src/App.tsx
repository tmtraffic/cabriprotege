
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import ClientDashboard from "./pages/dashboard/ClientDashboard";
import EmployeeDashboard from "./pages/dashboard/EmployeeDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import NotFound from "./pages/NotFound";
import InfosimplesSearch from "./pages/search/InfosimplesSearch";

import BulkImportForm from "./components/import/BulkImportForm";
import LeadManagement from "./components/crm/LeadManagement";
import InfractionConfig from "./components/admin/InfractionConfig";
import WebhookConfig from "./components/integration/WebhookConfig";

import UserManagement from "./pages/users/UserManagement";

import { lazy, Suspense } from "react";

const ClientRegistration = lazy(() => import("./pages/clients/ClientRegistration"));
const VehicleRegistration = lazy(() => import("./pages/vehicles/VehicleRegistration"));
const ProcessManagement = lazy(() => import("./pages/processes/ProcessManagement"));
const ClientProfile = lazy(() => import("./pages/clients/ClientProfile"));
const Settings = lazy(() => import("./pages/settings/Settings"));
const TestInfosimples = lazy(() => import("./pages/test/TestInfosimples"));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="w-8 h-8 border-4 border-cabricop-blue border-t-cabricop-orange rounded-full animate-spin"></div>
    <span className="ml-2">Carregando...</span>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          <Route path="/auth/login" element={<Login />} />
          
          <Route path="/dashboard" element={<Layout userRole="admin"><ClientDashboard /></Layout>} />
          
          <Route path="/clients" element={
            <Layout userRole="admin">
              <Suspense fallback={<PageLoader />}>
                <ClientProfile />
              </Suspense>
            </Layout>
          } />
          
          <Route path="/clients/new" element={
            <Layout userRole="admin">
              <Suspense fallback={<PageLoader />}>
                <ClientRegistration />
              </Suspense>
            </Layout>
          } />
          
          <Route path="/vehicles" element={
            <Layout userRole="admin">
              <Suspense fallback={<PageLoader />}>
                <VehicleRegistration />
              </Suspense>
            </Layout>
          } />
          
          <Route path="/veiculos" element={
            <Layout userRole="admin">
              <Suspense fallback={<PageLoader />}>
                <VehicleRegistration />
              </Suspense>
            </Layout>
          } />
          
          {/* Página unificada de processos */}
          <Route path="/processos" element={
            <Layout userRole="admin">
              <Suspense fallback={<PageLoader />}>
                <ProcessManagement />
              </Suspense>
            </Layout>
          } />
          
          <Route path="/clientes" element={
            <Layout userRole="admin">
              <Suspense fallback={<PageLoader />}>
                <ClientProfile />
              </Suspense>
            </Layout>
          } />
          
          <Route path="/import" element={<Layout userRole="admin"><BulkImportForm /></Layout>} />
          
          <Route path="/search/infosimples" element={<Layout userRole="admin"><InfosimplesSearch /></Layout>} />
          
          <Route path="/test/infosimples" element={
            <Layout userRole="admin">
              <Suspense fallback={<PageLoader />}>
                <TestInfosimples />
              </Suspense>
            </Layout>
          } />
          
          <Route path="/crm" element={<Layout userRole="admin"><LeadManagement /></Layout>} />
          
          <Route path="/admin/infraction-config" element={<Layout userRole="admin"><InfractionConfig /></Layout>} />
          
          <Route path="/admin/webhook-config" element={<Layout userRole="admin"><WebhookConfig /></Layout>} />
          
          <Route path="/configuracoes" element={
            <Layout userRole="admin">
              <Suspense fallback={<PageLoader />}>
                <Settings />
              </Suspense>
            </Layout>
          } />
          
          <Route path="/documentos" element={
            <Layout userRole="admin">
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Documentos</h1>
                <p className="text-muted-foreground">Gerencie os documentos relacionados aos processos e veículos.</p>
              </div>
            </Layout>
          } />
          
          <Route path="/usuarios" element={
            <Layout userRole="admin">
              <UserManagement />
            </Layout>
          } />
          
          <Route path="/employee" element={<Layout userRole="admin"><AdminDashboard /></Layout>} />
          
          <Route path="/admin" element={<Layout userRole="admin"><AdminDashboard /></Layout>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
