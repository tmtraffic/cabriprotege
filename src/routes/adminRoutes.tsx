
import { Route } from "react-router-dom";
import RouteWithLayout from "./RouteWithLayout";
import InfractionConfig from "@/components/admin/InfractionConfig";
import WebhookConfig from "@/components/integration/WebhookConfig";
import AdminDashboard from "@/pages/dashboard/AdminDashboard";

export const adminRoutes = [
  <Route 
    key="admin-dashboard" 
    path="/admin" 
    element={<RouteWithLayout component={AdminDashboard} userRole="admin" />} 
  />,
  <Route 
    key="infraction-config" 
    path="/admin/infraction-config" 
    element={<RouteWithLayout component={InfractionConfig} userRole="admin" />} 
  />,
  <Route 
    key="webhook-config" 
    path="/admin/webhook-config" 
    element={<RouteWithLayout component={WebhookConfig} userRole="admin" />} 
  />
];
