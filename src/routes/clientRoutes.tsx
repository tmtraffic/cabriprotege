
import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import RouteWithLayout from "./RouteWithLayout";
import ClientList from "@/pages/clients/ClientList";
import NewClient from "@/pages/clients/NewClient";

const ClientProfile = lazy(() => import("@/pages/clients/ClientProfile"));
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="w-8 h-8 border-4 border-cabricop-blue border-t-cabricop-orange rounded-full animate-spin"></div>
    <span className="ml-2">Carregando...</span>
  </div>
);

export const clientRoutes = [
  // English routes
  <Route 
    key="clients" 
    path="/clients" 
    element={
      <RouteWithLayout 
        component={() => (
          <Suspense fallback={<PageLoader />}>
            <ClientList />
          </Suspense>
        )}
        userRole="admin" 
      />
    } 
  />,
  <Route 
    key="clients-new" 
    path="/clients/new" 
    element={
      <RouteWithLayout 
        component={() => (
          <Suspense fallback={<PageLoader />}>
            <NewClient />
          </Suspense>
        )}
        userRole="admin" 
      />
    }
  />,
  <Route 
    key="clients-detail" 
    path="/clients/:id" 
    element={
      <RouteWithLayout 
        component={() => (
          <Suspense fallback={<PageLoader />}>
            <ClientProfile />
          </Suspense>
        )}
        userRole="admin" 
      />
    }
  />,
  
  // Portuguese routes
  <Route 
    key="clientes" 
    path="/clientes" 
    element={<RouteWithLayout component={ClientList} userRole="admin" />} 
  />,
  <Route 
    key="clientes-novo" 
    path="/clientes/novo" 
    element={<RouteWithLayout component={NewClient} userRole="admin" />} 
  />,
  <Route 
    key="clientes-detail" 
    path="/clientes/:id" 
    element={
      <RouteWithLayout 
        component={() => (
          <Suspense fallback={<PageLoader />}>
            <ClientProfile />
          </Suspense>
        )}
        userRole="admin" 
      />
    }
  />
];
