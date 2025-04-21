
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

// Importando novas páginas para funcionalidades solicitadas
import BulkImportForm from "./components/import/BulkImportForm";
import AdvancedSearch from "./components/search/AdvancedSearch";
import LeadManagement from "./components/crm/LeadManagement";
import InfractionConfig from "./components/admin/InfractionConfig";
import WebhookConfig from "./components/integration/WebhookConfig";

// Lazy loaded pages
import { lazy, Suspense } from "react";
const ClientRegistration = lazy(() => import("./pages/clients/ClientRegistration"));
const VehicleRegistration = lazy(() => import("./pages/vehicles/VehicleRegistration"));
const ProcessManagement = lazy(() => import("./pages/processes/ProcessManagement"));
const ClientProfile = lazy(() => import("./pages/clients/ClientProfile"));
const Settings = lazy(() => import("./pages/settings/Settings"));
const Reports = lazy(() => import("./pages/reports/Reports"));

// Loading fallback
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
          {/* Página inicial - redireciona para login ou dashboard apropriado */}
          <Route path="/" element={<Index />} />
          
          {/* Auth Routes */}
          <Route path="/auth/login" element={<Login />} />
          
          {/* Dashboard principal (Cliente) */}
          <Route path="/dashboard" element={<Layout userRole="client"><ClientDashboard /></Layout>} />
          
          {/* Rotas para Clientes */}
          <Route path="/clients" element={
            <Layout userRole="employee">
              <Suspense fallback={<PageLoader />}>
                <ClientProfile />
              </Suspense>
            </Layout>
          } />
          <Route path="/clients/new" element={
            <Layout userRole="employee">
              <Suspense fallback={<PageLoader />}>
                <ClientRegistration />
              </Suspense>
            </Layout>
          } />
          
          {/* Rotas para Veículos */}
          <Route path="/vehicles" element={
            <Layout userRole="employee">
              <Suspense fallback={<PageLoader />}>
                <VehicleRegistration />
              </Suspense>
            </Layout>
          } />
          <Route path="/vehicles/new" element={
            <Layout userRole="employee">
              <Suspense fallback={<PageLoader />}>
                <VehicleRegistration />
              </Suspense>
            </Layout>
          } />
          
          {/* Versões em português das rotas */}
          <Route path="/veiculos" element={
            <Layout userRole="employee">
              <Suspense fallback={<PageLoader />}>
                <VehicleRegistration />
              </Suspense>
            </Layout>
          } />
          <Route path="/veiculos/novo" element={
            <Layout userRole="employee">
              <Suspense fallback={<PageLoader />}>
                <VehicleRegistration />
              </Suspense>
            </Layout>
          } />
          
          {/* Rotas para Processos */}
          <Route path="/processos" element={
            <Layout userRole="employee">
              <Suspense fallback={<PageLoader />}>
                <ProcessManagement />
              </Suspense>
            </Layout>
          } />
          <Route path="/processos/novo" element={
            <Layout userRole="employee">
              <Suspense fallback={<PageLoader />}>
                <ProcessManagement />
              </Suspense>
            </Layout>
          } />
          
          {/* Versões em inglês das rotas */}
          <Route path="/processes" element={
            <Layout userRole="employee">
              <Suspense fallback={<PageLoader />}>
                <ProcessManagement />
              </Suspense>
            </Layout>
          } />
          <Route path="/processes/new" element={
            <Layout userRole="employee">
              <Suspense fallback={<PageLoader />}>
                <ProcessManagement />
              </Suspense>
            </Layout>
          } />
          
          {/* Outras rotas em português */}
          <Route path="/clientes" element={
            <Layout userRole="employee">
              <Suspense fallback={<PageLoader />}>
                <ClientProfile />
              </Suspense>
            </Layout>
          } />
          <Route path="/clientes/novo" element={
            <Layout userRole="employee">
              <Suspense fallback={<PageLoader />}>
                <ClientRegistration />
              </Suspense>
            </Layout>
          } />
          
          {/* Importação em Massa */}
          <Route path="/import" element={<Layout userRole="employee"><BulkImportForm /></Layout>} />
          
          {/* Pesquisa Avançada */}
          <Route path="/search" element={<Layout userRole="employee"><AdvancedSearch /></Layout>} />
          
          {/* CRM */}
          <Route path="/crm" element={<Layout userRole="employee"><LeadManagement /></Layout>} />
          
          {/* Configurações de Infrações (Admin) */}
          <Route path="/admin/infraction-config" element={<Layout userRole="admin"><InfractionConfig /></Layout>} />
          
          {/* Configurações de Webhook (Admin) */}
          <Route path="/admin/webhook-config" element={<Layout userRole="admin"><WebhookConfig /></Layout>} />
          
          {/* Relatórios */}
          <Route path="/relatorios" element={
            <Layout userRole="admin">
              <Suspense fallback={<PageLoader />}>
                <Reports />
              </Suspense>
            </Layout>
          } />
          <Route path="/reports" element={
            <Layout userRole="admin">
              <Suspense fallback={<PageLoader />}>
                <Reports />
              </Suspense>
            </Layout>
          } />
          
          {/* Configurações */}
          <Route path="/configuracoes" element={
            <Layout userRole="admin">
              <Suspense fallback={<PageLoader />}>
                <Settings />
              </Suspense>
            </Layout>
          } />
          <Route path="/settings" element={
            <Layout userRole="admin">
              <Suspense fallback={<PageLoader />}>
                <Settings />
              </Suspense>
            </Layout>
          } />
          
          {/* Documentos */}
          <Route path="/documentos" element={
            <Layout userRole="employee">
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Documentos</h1>
                <p className="text-muted-foreground">Gerencie os documentos relacionados aos processos e veículos.</p>
              </div>
            </Layout>
          } />
          
          {/* Notificações */}
          <Route path="/notificacoes" element={
            <Layout userRole="employee">
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Notificações</h1>
                <p className="text-muted-foreground">Veja as notificações e alertas do sistema.</p>
              </div>
            </Layout>
          } />
          
          {/* Agenda */}
          <Route path="/agenda" element={
            <Layout userRole="employee">
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Agenda</h1>
                <p className="text-muted-foreground">Gerencie compromissos e prazos importantes.</p>
              </div>
            </Layout>
          } />
          
          {/* Employee Dashboard */}
          <Route path="/employee" element={<Layout userRole="employee"><EmployeeDashboard /></Layout>} />
          
          {/* Admin Dashboard */}
          <Route path="/admin" element={<Layout userRole="admin"><AdminDashboard /></Layout>} />
          
          {/* Catch All Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
