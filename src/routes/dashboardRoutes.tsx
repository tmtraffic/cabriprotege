
import { Route } from "react-router-dom";
import RouteWithLayout from "./RouteWithLayout";
import ClientDashboard from "@/pages/dashboard/ClientDashboard";
import EmployeeDashboard from "@/pages/dashboard/EmployeeDashboard";

export const dashboardRoutes = [
  <Route 
    key="dashboard" 
    path="/dashboard" 
    element={<RouteWithLayout component={ClientDashboard} userRole="admin" />} 
  />,
  <Route 
    key="employee" 
    path="/employee" 
    element={<RouteWithLayout component={EmployeeDashboard} userRole="admin" />} 
  />
];
