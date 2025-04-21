
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Users, User, Shield, Settings, Eye, EyeOff, Trash, Edit, Plus } from "lucide-react";

// Mock user data for demonstration
const mockUsers = [
  {
    id: "1",
    name: "João Silva",
    email: "joao.silva@email.com",
    role: "admin",
    status: "active",
    lastLogin: "2025-04-19T14:30:00",
    createdAt: "2025-01-15T10:00:00",
  },
  {
    id: "2",
    name: "Maria Oliveira",
    email: "maria.oliveira@email.com",
    role: "employee",
    status: "active",
    lastLogin: "2025-04-20T09:15:00",
    createdAt: "2025-02-03T14:20:00",
  },
  {
    id: "3",
    name: "Carlos Mendes",
    email: "carlos.mendes@email.com",
    role: "employee",
    status: "inactive",
    lastLogin: "2025-03-25T16:45:00",
    createdAt: "2025-02-10T11:30:00",
  },
  {
    id: "4",
    name: "Ana Santos",
    email: "ana.santos@email.com",
    role: "client",
    status: "active",
    lastLogin: "2025-04-18T10:20:00",
    createdAt: "2025-03-05T09:45:00",
  },
  {
    id: "5",
    name: "Roberto Lima",
    email: "roberto.lima@email.com",
    role: "client",
    status: "active",
    lastLogin: "2025-04-15T13:10:00",
    createdAt: "2025-03-12T16:15:00",
  },
];

const UserManagement = () => {
  const [users, setUsers] = useState(mockUsers);
  const [showInactive, setShowInactive] = useState(false);
  const [editingUser, setEditingUser] = useState<typeof mockUsers[0] | null>(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "client",
    password: "",
    confirmPassword: "",
  });

  const filteredUsers = showInactive 
    ? users 
    : users.filter(user => user.status === "active");

  const handleUserActivation = (userId: string, active: boolean) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: active ? "active" : "inactive" } 
        : user
    ));
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const handleEditUser = (user: typeof mockUsers[0]) => {
    setEditingUser(user);
  };

  const handleSaveEdit = () => {
    if (editingUser) {
      setUsers(users.map(user => 
        user.id === editingUser.id ? editingUser : user
      ));
      setEditingUser(null);
    }
  };

  const handleAddUser = () => {
    if (newUser.password !== newUser.confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    if (!newUser.name || !newUser.email || !newUser.password) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    const newId = (parseInt(users[users.length - 1].id) + 1).toString();
    
    setUsers([
      ...users,
      {
        id: newId,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: "active",
        lastLogin: "",
        createdAt: new Date().toISOString(),
      }
    ]);
    
    setNewUser({
      name: "",
      email: "",
      role: "client",
      password: "",
      confirmPassword: "",
    });
    
    setIsAddUserOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Usuários</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center space-x-2">
            <Switch 
              id="show-inactive" 
              checked={showInactive}
              onCheckedChange={setShowInactive}
            />
            <Label htmlFor="show-inactive">Mostrar inativos</Label>
          </div>
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Usuário
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Usuário</DialogTitle>
                <DialogDescription>
                  Preencha os dados do novo usuário para criar uma conta.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Nome
                  </Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Perfil
                  </Label>
                  <Select 
                    value={newUser.role}
                    onValueChange={(value) => setNewUser({...newUser, role: value})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione o perfil" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="employee">Funcionário</SelectItem>
                      <SelectItem value="client">Cliente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    Senha
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="confirm-password" className="text-right">
                    Confirmar Senha
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={newUser.confirmPassword}
                    onChange={(e) => setNewUser({...newUser, confirmPassword: e.target.value})}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>Cancelar</Button>
                <Button onClick={handleAddUser}>Adicionar Usuário</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todos os Usuários</TabsTrigger>
          <TabsTrigger value="admins">Administradores</TabsTrigger>
          <TabsTrigger value="employees">Funcionários</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Todos os Usuários</CardTitle>
              <CardDescription>
                Lista completa de todos os usuários no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-blue-100' 
                          : user.role === 'employee' 
                            ? 'bg-orange-100' 
                            : 'bg-gray-100'
                      }`}>
                        <User className={`h-6 w-6 ${
                          user.role === 'admin' 
                            ? 'text-cabricop-blue' 
                            : user.role === 'employee' 
                              ? 'text-cabricop-orange' 
                              : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            user.role === 'admin' 
                              ? 'bg-blue-100 text-blue-800' 
                              : user.role === 'employee' 
                                ? 'bg-orange-100 text-orange-800' 
                                : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role === 'admin' ? 'Administrador' : user.role === 'employee' ? 'Funcionário' : 'Cliente'}
                          </span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            user.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status === 'active' ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon" onClick={() => handleEditUser(user)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        {editingUser && (
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Editar Usuário</DialogTitle>
                              <DialogDescription>
                                Atualize as informações do usuário
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-name" className="text-right">
                                  Nome
                                </Label>
                                <Input
                                  id="edit-name"
                                  value={editingUser.name}
                                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-email" className="text-right">
                                  Email
                                </Label>
                                <Input
                                  id="edit-email"
                                  value={editingUser.email}
                                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-role" className="text-right">
                                  Perfil
                                </Label>
                                <Select 
                                  value={editingUser.role}
                                  onValueChange={(value) => setEditingUser({...editingUser, role: value})}
                                >
                                  <SelectTrigger className="col-span-3">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="admin">Administrador</SelectItem>
                                    <SelectItem value="employee">Funcionário</SelectItem>
                                    <SelectItem value="client">Cliente</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setEditingUser(null)}>
                                Cancelar
                              </Button>
                              <Button onClick={handleSaveEdit}>
                                Salvar Alterações
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        )}
                      </Dialog>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleUserActivation(user.id, user.status !== 'active')}
                      >
                        {user.status === 'active' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-600"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {filteredUsers.length === 0 && (
                  <div className="text-center py-10">
                    <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-medium">Nenhum usuário encontrado</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Não há usuários para exibir com os filtros atuais.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="admins">
          <Card>
            <CardHeader>
              <CardTitle>Administradores</CardTitle>
              <CardDescription>
                Usuários com acesso completo ao sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers
                  .filter(user => user.role === 'admin')
                  .map((user) => (
                    <div key={user.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                          <Shield className="h-6 w-6 text-cabricop-blue" />
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                            Administrador
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleEditUser(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleUserActivation(user.id, user.status !== 'active')}
                        >
                          {user.status === 'active' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-600"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                
                {filteredUsers.filter(user => user.role === 'admin').length === 0 && (
                  <div className="text-center py-10">
                    <Shield className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-medium">Nenhum administrador encontrado</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Não há administradores para exibir com os filtros atuais.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="employees">
          <Card>
            <CardHeader>
              <CardTitle>Funcionários</CardTitle>
              <CardDescription>
                Usuários com acesso operacional ao sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers
                  .filter(user => user.role === 'employee')
                  .map((user) => (
                    <div key={user.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                          <User className="h-6 w-6 text-cabricop-orange" />
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800 mt-1">
                            Funcionário
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleEditUser(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleUserActivation(user.id, user.status !== 'active')}
                        >
                          {user.status === 'active' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-600"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                
                {filteredUsers.filter(user => user.role === 'employee').length === 0 && (
                  <div className="text-center py-10">
                    <User className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-medium">Nenhum funcionário encontrado</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Não há funcionários para exibir com os filtros atuais.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="clients">
          <Card>
            <CardHeader>
              <CardTitle>Clientes</CardTitle>
              <CardDescription>
                Usuários com acesso limitado ao sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers
                  .filter(user => user.role === 'client')
                  .map((user) => (
                    <div key={user.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                          <User className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 mt-1">
                            Cliente
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleEditUser(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleUserActivation(user.id, user.status !== 'active')}
                        >
                          {user.status === 'active' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-600"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                
                {filteredUsers.filter(user => user.role === 'client').length === 0 && (
                  <div className="text-center py-10">
                    <User className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-medium">Nenhum cliente encontrado</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Não há clientes para exibir com os filtros atuais.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagement;
