
import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import RouteWithLayout from "./RouteWithLayout";
import VehicleList from "@/pages/vehicles/VehicleList";
import NewVehicle from "@/pages/vehicles/NewVehicle";
import VehicleDetail from "@/pages/vehicles/VehicleDetail";

const VehicleRegistration = lazy(() => import("@/pages/vehicles/VehicleRegistration"));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="w-8 h-8 border-4 border-cabricop-blue border-t-cabricop-orange rounded-full animate-spin"></div>
    <span className="ml-2">Carregando...</span>
  </div>
);

export const vehicleRoutes = [
  // English routes
  <Route 
    key="vehicles" 
    path="/vehicles" 
    element={
      <RouteWithLayout 
        component={() => (
          <Suspense fallback={<PageLoader />}>
            <VehicleList />
          </Suspense>
        )}
        userRole="admin" 
      />
    }
  />,
  
  // Portuguese routes
  <Route 
    key="veiculos" 
    path="/veiculos" 
    element={<RouteWithLayout component={VehicleList} userRole="admin" />}
  />,
  <Route 
    key="veiculos-novo" 
    path="/veiculos/novo" 
    element={<RouteWithLayout component={NewVehicle} userRole="admin" />}
  />,
  <Route 
    key="veiculos-detail" 
    path="/veiculos/:id" 
    element={<RouteWithLayout component={VehicleDetail} userRole="admin" />}
  />
];
