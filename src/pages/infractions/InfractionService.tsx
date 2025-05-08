
import React, { useState } from 'react';
import InfractionForm from '@/components/infractions/InfractionForm';
import InfractionList from '@/components/infractions/InfractionList';
import InfractionStats from '@/components/infractions/InfractionStats';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

export interface Infraction {
  id: string;
  vehiclePlate: string;
  driverDocument?: string;
  infractionCode: string;
  infractionDescription: string;
  location: string;
  date: Date;
  agent: string;
  status: 'pending' | 'processed' | 'notified' | 'contested' | 'closed';
  severity: 'light' | 'medium' | 'serious' | 'very-serious';
  points: number;
  value: number;
  images?: string[];
}

// Mock de infrações para demonstração
const MOCK_INFRACTIONS: Infraction[] = [
  {
    id: 'inf-001',
    vehiclePlate: 'ABC1234',
    driverDocument: '123.456.789-00',
    infractionCode: '5452-1',
    infractionDescription: 'Avançar o sinal vermelho',
    location: 'Av. Paulista, 1000, São Paulo - SP',
    date: new Date(2023, 10, 15, 14, 30),
    agent: 'João Silva',
    status: 'notified',
    severity: 'serious',
    points: 7,
    value: 293.47,
    images: ['photo1.jpg', 'photo2.jpg']
  },
  {
    id: 'inf-002',
    vehiclePlate: 'DEF5678',
    infractionCode: '5010-0',
    infractionDescription: 'Estacionar em local proibido',
    location: 'Rua Augusta, 500, São Paulo - SP',
    date: new Date(2023, 10, 17, 9, 15),
    agent: 'Maria Oliveira',
    status: 'processed',
    severity: 'medium',
    points: 5,
    value: 195.23,
    images: ['photo3.jpg']
  },
  {
    id: 'inf-003',
    vehiclePlate: 'GHI9012',
    driverDocument: '987.654.321-00',
    infractionCode: '7013-0',
    infractionDescription: 'Excesso de velocidade (até 20% acima do limite)',
    location: 'Av. das Nações Unidas, 10000, São Paulo - SP',
    date: new Date(2023, 10, 18, 11, 45),
    agent: 'Carlos Santos',
    status: 'pending',
    severity: 'medium',
    points: 4,
    value: 157.70,
  }
];

const InfractionService: React.FC = () => {
  const [infractions, setInfractions] = useState<Infraction[]>(MOCK_INFRACTIONS);
  const { toast } = useToast();
  
  const handleAddInfraction = (infraction: Omit<Infraction, 'id'>) => {
    const newInfraction: Infraction = {
      ...infraction,
      id: `inf-${Date.now().toString(36)}`, // Gera um ID único
      status: 'pending',
    };
    
    setInfractions([newInfraction, ...infractions]);
    
    toast({
      title: "Infração registrada",
      description: `A infração para o veículo ${infraction.vehiclePlate} foi registrada com sucesso.`,
    });
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold mb-1">Serviço de Registro de Infrações</h1>
        <p className="text-muted-foreground">
          Cadastro e gestão de infrações de trânsito
        </p>
      </div>
      
      {/* Dashboard de estatísticas */}
      <InfractionStats infractions={infractions} />
      
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="list">Infrações</TabsTrigger>
          <TabsTrigger value="register">Nova Infração</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Infrações Registradas</CardTitle>
              <CardDescription>
                Lista completa de infrações registradas no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InfractionList infractions={infractions} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="register" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Registrar Nova Infração</CardTitle>
              <CardDescription>
                Cadastre uma nova infração de trânsito no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InfractionForm onSubmit={handleAddInfraction} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InfractionService;
