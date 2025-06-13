
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

// Define route mappings
const routeNameMap: Record<string, string> = {
  'dashboard': 'Dashboard',
  'clients': 'Clients',
  'clients/new': 'New Client',
  'vehicles': 'Vehicles',
  'processos': 'Processes',
  'search': 'Search',
  'import': 'Import',
  'crm': 'CRM',
  'documentos': 'Documents',
  'usuarios': 'Users',
  'configuracoes': 'Settings',
  'admin': 'Admin',
  'admin/infraction-config': 'Infraction Configuration',
  'admin/webhook-config': 'Webhook Configuration',
};

interface BreadcrumbItem {
  path: string;
  label: string;
  icon?: React.ReactElement;
  isLast?: boolean;
}

export function BreadcrumbNavigation() {
  const location = useLocation();
  
  // Skip rendering on home page
  if (location.pathname === '/' || location.pathname === '/auth/login') {
    return null;
  }
  
  // Generate breadcrumb items from current path
  const generateBreadcrumbItems = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    
    const breadcrumbItems: BreadcrumbItem[] = [
      { path: '/', label: 'Home', icon: <Home className="h-4 w-4" /> }
    ];
    
    let currentPath = '';
    
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Find the most specific match for the current path
      const fullPath = currentPath.substring(1); // Remove leading slash
      const label = routeNameMap[fullPath] || segment.charAt(0).toUpperCase() + segment.slice(1);
      
      const isLast = index === pathSegments.length - 1;
      
      breadcrumbItems.push({
        path: currentPath,
        label,
        isLast
      });
    });
    
    return breadcrumbItems;
  };
  
  const breadcrumbItems = generateBreadcrumbItems();
  
  return (
    <div className="mb-4 px-4">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={item.path}>
              {index > 0 && <BreadcrumbSeparator />}
              {item.isLast ? (
                <BreadcrumbItem>
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                </BreadcrumbItem>
              ) : (
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={item.path}>
                      {item.icon || item.label}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
