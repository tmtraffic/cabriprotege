
import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { Home, ChevronRight } from "lucide-react";

// Define the type for route item
type RouteItem = {
  path: string;
  label: string;
  icon: React.ReactNode;
};

// Define the routes structure
const routes: Record<string, RouteItem[]> = {
  '/dashboard': [
    { path: '/dashboard', label: 'Dashboard', icon: <Home className="h-4 w-4" /> }
  ],
  '/clients': [
    { path: '/dashboard', label: 'Dashboard', icon: <Home className="h-4 w-4" /> },
    { path: '/clients', label: 'Clientes', icon: <span>👤</span> }
  ],
  '/clients/new': [
    { path: '/dashboard', label: 'Dashboard', icon: <Home className="h-4 w-4" /> },
    { path: '/clients', label: 'Clientes', icon: <span>👤</span> },
    { path: '/clients/new', label: 'Novo Cliente', icon: <span>➕</span> }
  ],
  '/vehicles': [
    { path: '/dashboard', label: 'Dashboard', icon: <Home className="h-4 w-4" /> },
    { path: '/vehicles', label: 'Veículos', icon: <span>🚗</span> }
  ],
  '/vehicles/new': [
    { path: '/dashboard', label: 'Dashboard', icon: <Home className="h-4 w-4" /> },
    { path: '/vehicles', label: 'Veículos', icon: <span>🚗</span> },
    { path: '/vehicles/new', label: 'Novo Veículo', icon: <span>➕</span> }
  ],
  '/processes': [
    { path: '/dashboard', label: 'Dashboard', icon: <Home className="h-4 w-4" /> },
    { path: '/processes', label: 'Processos', icon: <span>📝</span> }
  ],
  '/processes/new': [
    { path: '/dashboard', label: 'Dashboard', icon: <Home className="h-4 w-4" /> },
    { path: '/processes', label: 'Processos', icon: <span>📝</span> },
    { path: '/processes/new', label: 'Novo Processo', icon: <span>➕</span> }
  ],
  '/settings': [
    { path: '/dashboard', label: 'Dashboard', icon: <Home className="h-4 w-4" /> },
    { path: '/settings', label: 'Configurações', icon: <span>⚙️</span> }
  ]
};

const BreadcrumbNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Find the matching route
  let matchingRoute = routes[currentPath];
  
  // If no direct match, try to find a parent route
  if (!matchingRoute) {
    const pathSegments = currentPath.split('/').filter(Boolean);
    
    while (pathSegments.length > 0) {
      const potentialPath = `/${pathSegments.join('/')}`;
      if (routes[potentialPath]) {
        matchingRoute = [
          ...routes[potentialPath],
          { path: currentPath, label: 'Detalhes', icon: <span>📋</span> }
        ];
        break;
      }
      pathSegments.pop();
    }
  }
  
  // If still no match, use dashboard as fallback
  if (!matchingRoute) {
    matchingRoute = routes['/dashboard'];
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {matchingRoute.map((item, index) => (
          <React.Fragment key={item.path}>
            {index === matchingRoute.length - 1 ? (
              <BreadcrumbItem>
                <BreadcrumbPage className="flex items-center">
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </BreadcrumbPage>
              </BreadcrumbItem>
            ) : (
              <BreadcrumbItem>
                <BreadcrumbLink href={item.path} className="flex items-center">
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
            )}
            
            {index < matchingRoute.length - 1 && (
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbNavigation;
