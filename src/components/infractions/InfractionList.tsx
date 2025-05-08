
import React, { useState } from 'react';
import { Infraction } from '@/pages/infractions/InfractionService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Eye } from "lucide-react";

interface InfractionListProps {
  infractions: Infraction[];
}

const InfractionList: React.FC<InfractionListProps> = ({ infractions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filtrar infrações com base no termo de pesquisa
  const filteredInfractions = infractions.filter(infraction => 
    infraction.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    infraction.infractionDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
    infraction.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Status das infrações
  const getStatusBadge = (status: Infraction['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pendente</Badge>;
      case 'processed':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Processada</Badge>;
      case 'notified':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Notificada</Badge>;
      case 'contested':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Contestada</Badge>;
      case 'closed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Encerrada</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  // Severidade das infrações
  const getSeverityBadge = (severity: Infraction['severity']) => {
    switch (severity) {
      case 'light':
        return <Badge className="bg-gray-500">Leve</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500">Média</Badge>;
      case 'serious':
        return <Badge className="bg-orange-500">Grave</Badge>;
      case 'very-serious':
        return <Badge className="bg-red-500">Gravíssima</Badge>;
      default:
        return <Badge>Desconhecida</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por placa, descrição ou local..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Placa</TableHead>
              <TableHead>Infração</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Gravidade</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInfractions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Nenhuma infração encontrada com os critérios de busca.
                </TableCell>
              </TableRow>
            ) : (
              filteredInfractions.map((infraction) => (
                <TableRow key={infraction.id}>
                  <TableCell className="font-medium">{infraction.vehiclePlate}</TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <div className="font-medium truncate">{infraction.infractionDescription}</div>
                      <div className="text-xs text-muted-foreground truncate">{infraction.location}</div>
                    </div>
                  </TableCell>
                  <TableCell>{infraction.date.toLocaleDateString()}</TableCell>
                  <TableCell>{getStatusBadge(infraction.status)}</TableCell>
                  <TableCell>{getSeverityBadge(infraction.severity)}</TableCell>
                  <TableCell>R$ {infraction.value.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default InfractionList;
