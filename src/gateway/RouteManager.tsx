
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash, Save, X, Plus } from "lucide-react";
import { ServiceRoute } from './ApiGateway';

interface RouteManagerProps {
  initialRoutes?: ServiceRoute[];
}

const RouteManager: React.FC<RouteManagerProps> = ({ initialRoutes = [] }) => {
  const [routes, setRoutes] = useState<ServiceRoute[]>(initialRoutes);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ServiceRoute>>({});

  useEffect(() => {
    // Em um cenário real, aqui buscaria as rotas da API
    if (initialRoutes.length > 0) {
      setRoutes(initialRoutes);
    }
  }, [initialRoutes]);

  const handleEditStart = (route: ServiceRoute) => {
    setEditingId(route.id);
    setEditForm({ ...route });
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleEditChange = (field: keyof ServiceRoute, value: any) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleEditSave = () => {
    if (editingId) {
      setRoutes(prev => prev.map(r => 
        r.id === editingId ? { ...r, ...editForm } as ServiceRoute : r
      ));
      setEditingId(null);
      setEditForm({});
    }
  };

  const handleDelete = (id: string) => {
    setRoutes(prev => prev.filter(r => r.id !== id));
  };

  const handleAddNew = () => {
    const newId = `route-${Date.now()}`;
    const newRoute: ServiceRoute = {
      id: newId,
      name: 'Novo Serviço',
      description: 'Descrição do novo serviço',
      endpoint: '/api/new-service',
      status: 'offline',
      latency: 0,
      lastChecked: new Date(),
    };
    
    setRoutes(prev => [...prev, newRoute]);
    handleEditStart(newRoute);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Gerenciamento de Rotas</CardTitle>
          <CardDescription>Configure e monitore as rotas do API Gateway</CardDescription>
        </div>
        <Button onClick={handleAddNew} className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Adicionar Rota
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Endpoint</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Latência</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {routes.map((route) => (
              <TableRow key={route.id}>
                <TableCell>
                  {editingId === route.id ? (
                    <Input 
                      value={editForm.name || ''} 
                      onChange={(e) => handleEditChange('name', e.target.value)} 
                      className="w-full"
                    />
                  ) : (
                    <div>
                      <div className="font-medium">{route.name}</div>
                      <div className="text-xs text-muted-foreground">{route.description}</div>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {editingId === route.id ? (
                    <Input 
                      value={editForm.endpoint || ''} 
                      onChange={(e) => handleEditChange('endpoint', e.target.value)} 
                      className="w-full"
                    />
                  ) : (
                    route.endpoint
                  )}
                </TableCell>
                <TableCell>
                  {editingId === route.id ? (
                    <Select 
                      value={editForm.status} 
                      onValueChange={(value: 'online' | 'offline' | 'degraded') => handleEditChange('status', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="offline">Offline</SelectItem>
                        <SelectItem value="degraded">Degradado</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={
                      route.status === 'online' 
                        ? 'bg-green-500' 
                        : route.status === 'degraded' 
                          ? 'bg-yellow-500' 
                          : 'bg-red-500'
                    }>
                      {route.status === 'online' ? 'Online' : 
                       route.status === 'degraded' ? 'Degradado' : 'Offline'}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {editingId === route.id ? (
                    <Input 
                      type="number"
                      value={editForm.latency || 0} 
                      onChange={(e) => handleEditChange('latency', parseInt(e.target.value))} 
                      className="w-full"
                    />
                  ) : (
                    `${route.latency}ms`
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {editingId === route.id ? (
                    <div className="flex justify-end gap-2">
                      <Button size="icon" variant="outline" onClick={handleEditSave}>
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline" onClick={handleEditCancel}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-2">
                      <Button size="icon" variant="outline" onClick={() => handleEditStart(route)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline" className="text-red-500" onClick={() => handleDelete(route.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RouteManager;
