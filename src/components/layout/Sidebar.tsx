
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  User,
  Car,
  FileText,
  Bell,
  Settings,
  Users,
  Database,
  Calendar,
  Search,
  BarChart2,
  Home,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  userRole: "client" | "employee" | "admin";
}

const Sidebar = ({ isOpen, userRole }: SidebarProps) => {
  const location = useLocation();

  // Common menu items for all users
  const commonMenuItems = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/",
    },
  ];

  // Client-specific menu items
  const clientMenuItems = [
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

  // Employee-specific menu items
  const employeeMenuItems = [
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
  ];

  // Admin-specific menu items
  const adminMenuItems = [
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

  // Choose menu items based on user role
  let menuItems;
  switch (userRole) {
    case "client":
      menuItems = [...commonMenuItems, ...clientMenuItems];
      break;
    case "employee":
      menuItems = [...commonMenuItems, ...employeeMenuItems];
      break;
    case "admin":
      menuItems = [...commonMenuItems, ...adminMenuItems];
      break;
    default:
      menuItems = commonMenuItems;
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-30 mt-16 h-[calc(100vh-4rem)] w-64 transition-transform duration-300 ease-in-out bg-sidebar border-r border-sidebar-border pb-4",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "md:translate-x-0"
      )}
    >
      <div className="flex flex-col h-full px-3 py-4">
        <div className="mb-8">
          <div className="w-full p-3 bg-sidebar-accent rounded-lg mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sidebar-primary flex items-center justify-center text-white">
                <User className="h-5 w-5" />
              </div>
              <div className="text-sidebar-foreground">
                <p className="font-medium text-sm">Bem-vindo(a),</p>
                <p className="font-bold">
                  {userRole === "client" ? "Cliente" : userRole === "employee" ? "Funcionário" : "Administrador"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                location.pathname === item.href
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto">
          <Link
            to="/ajuda"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          >
            <Search className="h-5 w-5" />
            <span>Ajuda e Suporte</span>
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
