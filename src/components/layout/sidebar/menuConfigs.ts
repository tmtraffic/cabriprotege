
import {
  Home,
  Car,
  FileText,
  Bell,
  Settings,
  Users,
  Database,
  Calendar,
  Search,
  BarChart2,
  UserCheck,
  Import,
  MessageSquare,
  ListTree,
  AlertTriangle,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

interface MenuItem {
  title: string;
  icon: LucideIcon;
  href: string;
}

// Common menu items for all users
export const getCommonMenuItems = (userRole: "client" | "employee" | "admin"): MenuItem[] => [
  {
    title: "Dashboard",
    icon: Home,
    href: userRole === "client" ? "/dashboard" : userRole === "employee" ? "/employee" : "/admin",
  },
];

// Client-specific menu items
export const clientMenuItems: MenuItem[] = [
  {
    title: "Meus Veículos",
    icon: Car,
    href: "/veiculos",
  },
  {
    title: "Processos",
    icon: FileText,
    href: "/processos",
  },
  {
    title: "Documentos",
    icon: FileText,
    href: "/documentos",
  },
  {
    title: "Notificações",
    icon: Bell,
    href: "/notificacoes",
  },
  {
    title: "Agenda",
    icon: Calendar,
    href: "/agenda",
  },
];

// Microservices items
export const microservicesItems: MenuItem[] = [
  {
    title: "API Gateway",
    icon: ListTree,
    href: "/gateway",
  },
  {
    title: "Serviço de Infrações",
    icon: AlertTriangle,
    href: "/infractions",
  },
];

// Employee-specific menu items
export const employeeMenuItems: MenuItem[] = [
  {
    title: "Clientes",
    icon: Users,
    href: "/clientes",
  },
  {
    title: "Veículos",
    icon: Car,
    href: "/veiculos",
  },
  {
    title: "Processos",
    icon: FileText,
    href: "/processos",
  },
  {
    title: "Documentos",
    icon: FileText,
    href: "/documentos",
  },
  {
    title: "Notificações",
    icon: Bell,
    href: "/notificacoes",
  },
  {
    title: "Agenda",
    icon: Calendar,
    href: "/agenda",
  },
  {
    title: "Consulta Avançada",
    icon: Search,
    href: "/search",
  },
  {
    title: "CRM",
    icon: MessageSquare,
    href: "/crm",
  },
  {
    title: "Importação",
    icon: Import,
    href: "/import",
  },
];

// Admin-specific menu items
export const adminMenuItems: MenuItem[] = [
  ...employeeMenuItems,
  {
    title: "Usuários",
    icon: Users,
    href: "/usuarios",
  },
  {
    title: "Relatórios",
    icon: BarChart2,
    href: "/relatorios",
  },
  {
    title: "Configurações",
    icon: Settings,
    href: "/configuracoes",
  },
  {
    title: "Base de Dados",
    icon: Database,
    href: "/dados",
  },
];

// Function to get role-specific menu items
export const getRoleMenuItems = (userRole: "client" | "employee" | "admin"): MenuItem[] => {
  switch (userRole) {
    case "client":
      return [...getCommonMenuItems(userRole), ...clientMenuItems];
    case "employee":
      return [...getCommonMenuItems(userRole), ...employeeMenuItems];
    case "admin":
    default:
      return [...getCommonMenuItems(userRole), ...adminMenuItems];
  }
};
