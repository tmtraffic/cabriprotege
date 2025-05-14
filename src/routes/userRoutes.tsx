
import { Route } from "react-router-dom";
import RouteWithLayout from "./RouteWithLayout";
import UserManagement from "@/pages/users/UserManagement";
import NewUser from "@/pages/users/NewUser";

export const userRoutes = [
  <Route 
    key="usuarios" 
    path="/usuarios" 
    element={<RouteWithLayout component={UserManagement} userRole="admin" />}
  />,
  <Route 
    key="usuarios-novo" 
    path="/usuarios/novo" 
    element={<RouteWithLayout component={NewUser} userRole="admin" />}
  />
];
