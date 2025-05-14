
import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import RouteWithLayout from "./RouteWithLayout";

const Settings = lazy(() => import("@/pages/settings/Settings"));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="w-8 h-8 border-4 border-cabricop-blue border-t-cabricop-orange rounded-full animate-spin"></div>
    <span className="ml-2">Carregando...</span>
  </div>
);

export const settingsRoutes = [
  <Route 
    key="configuracoes" 
    path="/configuracoes" 
    element={
      <RouteWithLayout 
        component={() => (
          <Suspense fallback={<PageLoader />}>
            <Settings />
          </Suspense>
        )}
        userRole="admin" 
      />
    }
  />
];
