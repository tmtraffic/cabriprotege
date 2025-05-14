
import { Route } from "react-router-dom";
import RouteWithLayout from "./RouteWithLayout";

export const documentRoutes = [
  <Route 
    key="documentos" 
    path="/documentos" 
    element={
      <RouteWithLayout 
        component={() => (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Documentos</h1>
            <p className="text-muted-foreground">Gerencie os documentos relacionados aos processos e veículos.</p>
          </div>
        )} 
        userRole="admin" 
      />
    }
  />
];
