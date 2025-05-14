
import { Route } from "react-router-dom";
import RouteWithLayout from "./RouteWithLayout";
import DocumentPage from "../pages/documents/DocumentPage";

export const documentRoutes = [
  <Route 
    key="documentos" 
    path="/documentos" 
    element={
      <RouteWithLayout 
        component={DocumentPage}
        userRole="admin" 
      />
    }
  />
];
