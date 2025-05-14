
import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import RouteWithLayout from "./RouteWithLayout";
import NewProcess from "@/pages/processes/NewProcess";

const ProcessManagement = lazy(() => import("@/pages/processes/ProcessManagement"));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="w-8 h-8 border-4 border-cabricop-blue border-t-cabricop-orange rounded-full animate-spin"></div>
    <span className="ml-2">Carregando...</span>
  </div>
);

export const processRoutes = [
  <Route 
    key="processos" 
    path="/processos" 
    element={
      <RouteWithLayout 
        component={() => (
          <Suspense fallback={<PageLoader />}>
            <ProcessManagement />
          </Suspense>
        )}
        userRole="admin" 
      />
    }
  />,
  <Route 
    key="processos-novo" 
    path="/processos/novo" 
    element={<RouteWithLayout component={NewProcess} userRole="admin" />}
  />
];
