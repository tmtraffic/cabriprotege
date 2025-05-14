
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { AlertTriangle, Clock, CheckCircle, FileText } from "lucide-react";
import { fetchInfractions, Infraction } from '@/services/InfractionService';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from '@/components/ui/use-toast';

const InfractionStats: React.FC = () => {
  const [infractions, setInfractions] = useState<Infraction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSupabaseAuth();

  useEffect(() => {
    const loadInfractions = async () => {
      try {
        setLoading(true);
        const data = await fetchInfractions(user?.id);
        setInfractions(data);
      } catch (error) {
        console.error("Error loading infractions:", error);
        toast({
          title: "Erro ao carregar infrações",
          description: "Não foi possível carregar os dados das infrações",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadInfractions();
    }
  }, [user]);

  // Cálculos para o dashboard
  const pendingCount = infractions.filter(i => i.status === 'pending').length;
  const processedCount = infractions.filter(i => ['processed', 'notified'].includes(i.status)).length;
  const closedCount = infractions.filter(i => i.status === 'closed').length;
  const contestedCount = infractions.filter(i => i.status === 'contested').length;
  
  const totalValue = infractions.reduce((sum, infraction) => sum + infraction.value, 0).toFixed(2);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Pendentes</p>
            <h3 className="text-2xl font-bold">{loading ? '...' : pendingCount}</h3>
          </div>
          <div className="p-2 bg-yellow-100 rounded-full">
            <Clock className="h-5 w-5 text-yellow-600" />
          </div>
        </div>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Processadas</p>
            <h3 className="text-2xl font-bold">{loading ? '...' : processedCount}</h3>
          </div>
          <div className="p-2 bg-blue-100 rounded-full">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
        </div>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Contestadas</p>
            <h3 className="text-2xl font-bold">{loading ? '...' : contestedCount}</h3>
          </div>
          <div className="p-2 bg-orange-100 rounded-full">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
          </div>
        </div>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Valor Total</p>
            <h3 className="text-2xl font-bold">R$ {loading ? '...' : totalValue}</h3>
          </div>
          <div className="p-2 bg-green-100 rounded-full">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InfractionStats;
