
import { Route } from "react-router-dom";
import RouteWithLayout from "./RouteWithLayout";
import LeadManagement from "@/components/crm/LeadManagement";
import NewQuote from "@/pages/crm/NewQuote";

export const crmRoutes = [
  <Route 
    key="crm" 
    path="/crm" 
    element={<RouteWithLayout component={LeadManagement} userRole="admin" />} 
  />,
  <Route 
    key="crm-orcamento-novo" 
    path="/crm/orcamento/novo" 
    element={<RouteWithLayout component={NewQuote} userRole="admin" />} 
  />
];
