
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
  ChevronLeft,
  Clock,
  FileText,
  User,
  Car,
  Calendar,
  CheckCircle,
  XCircle 
} from "lucide-react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { fetchProcessById, Process } from "@/services/ProcessService";
import { fetchDeadlines, Deadline } from "@/services/DeadlineService";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const ProcessDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [process, setProcess] = useState<Process | null>(null);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadProcessData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const processData = await fetchProcessById(id);
        if (processData) {
          setProcess(processData);
          
          // Load related deadlines
          const deadlineData = await fetchDeadlines();
          setDeadlines(deadlineData.filter(d => d.process_id === id));
        } else {
          toast({
            title: "Erro",
            description: "Processo não encontrado",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error loading process:", error);
        toast({
          title: "Erro",
          description: "Falha ao carregar dados do processo",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadProcessData();
  }, [id, toast]);

  const renderStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string; label: string }> = {
      'pending': { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Novo' },
      'in_progress': { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Em Andamento' },
      'documentation_needed': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Aguardando Documentação' },
      'review': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Em Revisão' },
      'completed': { bg: 'bg-green-100', text: 'text-green-800', label: 'Concluído' },
      'canceled': { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelado' }
    };
    
    const style = statusMap[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Desconhecido' };
    
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${style.bg} ${style.text}`}>
        {style.label}
      </span>
    );
  };

  const renderTypeBadge = (type: string) => {
    const typeMap: Record<string, { label: string }> = {
      'fine_appeal': { label: 'Recurso de Multa' },
      'license_suspension': { label: 'Suspensão de CNH' },
      'license_revocation': { label: 'Cassação de CNH' },
      'other': { label: 'Outro' }
    };
    
    const info = typeMap[type] || { label: 'Outro' };
    
    return info.label;
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-cabricop-blue border-t-cabricop-orange rounded-full animate-spin"></div>
        <span className="ml-2">Carregando...</span>
      </div>
    );
  }

  if (!process) {
    return (
      <div className="text-center my-12">
        <h2 className="text-2xl font-bold">Processo não encontrado</h2>
        <p className="mt-2 text-muted-foreground">O processo solicitado não foi encontrado ou não existe</p>
        <Button asChild className="mt-6">
          <Link to="/processos">Voltar para listagem</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/processos" className="flex items-center">
              <ChevronLeft className="h-4 w-4 mr-1" />
              <span>Voltar</span>
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            Atualizar Status
          </Button>
          <Button>
            Incluir Documentos
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Process Information */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    Processo #{process.id.substring(0, 8)}
                    {renderStatusBadge(process.status)}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {renderTypeBadge(process.type)}: {process.description || "Sem descrição"}
                  </CardDescription>
                </div>
                <div className="text-right text-sm">
                  <p>Criado em: {new Date(process.created_at).toLocaleDateString('pt-BR')}</p>
                  <p>Atualizado em: {new Date(process.updated_at).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Client Information */}
              <div className="border rounded-md p-4">
                <h3 className="font-medium flex items-center gap-2 mb-3">
                  <User className="h-4 w-4 text-cabricop-blue" /> Informações do Cliente
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Nome</p>
                    <p className="font-medium">{process.client?.name || "Nome não disponível"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{process.client?.email || "Email não disponível"}</p>
                  </div>
                </div>
              </div>

              {/* Infraction Information */}
              {process.infraction && (
                <div className="border rounded-md p-4">
                  <h3 className="font-medium flex items-center gap-2 mb-3">
                    <FileText className="h-4 w-4 text-cabricop-blue" /> Informações da Infração
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Auto Nº</p>
                      <p className="font-medium">{process.infraction.auto_number || "Não informado"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Valor</p>
                      <p className="font-medium">
                        {process.infraction.value 
                          ? `R$ ${process.infraction.value.toFixed(2).replace('.', ',')}` 
                          : "Não informado"}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground">Descrição</p>
                      <p className="font-medium">{process.infraction.description || "Sem descrição"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Veículo</p>
                      <p className="font-medium">Placa: {process.infraction.vehicle.plate || "Não informado"}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Assignment Information */}
              <div className="border rounded-md p-4">
                <h3 className="font-medium flex items-center gap-2 mb-3">
                  <User className="h-4 w-4 text-cabricop-blue" /> Responsável
                </h3>
                <div>
                  <p className="font-medium">
                    {process.assignee?.name || "Não atribuído"}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-4">
              <Button variant="outline" className="mr-2">
                Editar Processo
              </Button>
              <Button variant="destructive">
                Cancelar Processo
              </Button>
            </CardFooter>
          </Card>

          {/* Deadlines */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Prazos</CardTitle>
                <Button size="sm">
                  Adicionar Prazo
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {deadlines.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead>Prioridade</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deadlines.map((deadline) => (
                      <TableRow key={deadline.id}>
                        <TableCell className="font-medium">{deadline.title}</TableCell>
                        <TableCell>
                          {new Date(deadline.due_date).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            deadline.priority === 'high' ? 'bg-red-100 text-red-800' :
                            deadline.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {deadline.priority === 'high' ? 'Alta' :
                             deadline.priority === 'medium' ? 'Média' :
                             deadline.priority === 'low' ? 'Baixa' : 'Normal'}
                          </span>
                        </TableCell>
                        <TableCell>
                          {deadline.completed ? 
                            <span className="inline-flex items-center text-green-600">
                              <CheckCircle className="h-4 w-4 mr-1" /> Concluído
                            </span> : 
                            <span className="inline-flex items-center text-orange-600">
                              <Clock className="h-4 w-4 mr-1" /> Pendente
                            </span>
                          }
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">Editar</Button>
                            {!deadline.completed && (
                              <Button size="sm" variant="outline">Concluir</Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center p-4 border rounded-md">
                  <p className="text-muted-foreground">Nenhum prazo cadastrado</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status History */}
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="h-7 w-7 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Processo Cadastrado</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(process.created_at).toLocaleDateString('pt-BR')} às {new Date(process.created_at).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="h-7 w-7 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                    <Clock className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium">Status Atualizado</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(process.updated_at).toLocaleDateString('pt-BR')} às {new Date(process.updated_at).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}
                    </p>
                    <p className="text-sm">
                      Status alterado para {renderStatusBadge(process.status)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Documents */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Documentos</CardTitle>
                <Button size="sm">
                  Upload
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center p-4 border rounded-md">
                <p className="text-muted-foreground">Nenhum documento anexado</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Gerar Relatório
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <User className="h-4 w-4 mr-2" />
                Transferir Responsável
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Agendar Reunião
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProcessDetail;
