'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Trash2, Edit, Shield, Users, Settings, Key } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ABACProtectedPage } from '@/lib/abac/hoc';

interface Policy {
  id: string;
  subject: string;
  object: string;
  action: string;
  effect: 'allow' | 'deny';
  conditions?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface RoleAssignment {
  userEmail: string;
  userName?: string;
  roleName: string;
  assignedAt: Date;
}

export default function ABACManagementPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [roleAssignments, setRoleAssignments] = useState<RoleAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddPolicyOpen, setIsAddPolicyOpen] = useState(false);
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);
  const { toast } = useToast();

  // Policy form state
  const [newPolicy, setNewPolicy] = useState({
    subject: '',
    object: '',
    action: 'read',
    effect: 'allow' as 'allow' | 'deny',
    conditions: '',
    description: ''
  });

  // Role assignment form state
  const [newRoleAssignment, setNewRoleAssignment] = useState({
    userEmail: '',
    roleName: ''
  });

  const loadPolicies = useCallback(async () => {
    try {
      const response = await fetch('/api/abac/policies');
      const data = await response.json();
      
      if (data.success) {
        setPolicies(data.data);
      } else {
        toast({
          title: "Erro",
          description: "Falha ao carregar políticas",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error loading policies:', error);
      toast({
        title: "Erro",
        description: "Erro ao conectar com o servidor",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const loadRoleAssignments = useCallback(async () => {
    try {
      const response = await fetch('/api/abac/roles');
      const data = await response.json();
      
      if (data.success) {
        setRoleAssignments(data.data);
      } else {
        toast({
          title: "Erro",
          description: "Falha ao carregar atribuições de roles",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error loading role assignments:', error);
      toast({
        title: "Erro",
        description: "Erro ao conectar com o servidor",
        variant: "destructive"
      });
    }
  }, [toast]);

  useEffect(() => {
    loadPolicies();
    loadRoleAssignments();
  }, [loadPolicies, loadRoleAssignments]);

  const addPolicy = async () => {
    try {
      const response = await fetch('/api/abac/policies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPolicy)
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Sucesso",
          description: "Política adicionada com sucesso"
        });
        setIsAddPolicyOpen(false);
        setNewPolicy({
          subject: '',
          object: '',
          action: 'read',
          effect: 'allow',
          conditions: '',
          description: ''
        });
        loadPolicies();
      } else {
        toast({
          title: "Erro",
          description: data.error || "Falha ao adicionar política",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error adding policy:', error);
      toast({
        title: "Erro",
        description: "Erro ao conectar com o servidor",
        variant: "destructive"
      });
    }
  };

  const removePolicy = async (policy: Policy) => {
    try {
      const response = await fetch('/api/abac/policies', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subject: policy.subject,
          object: policy.object,
          action: policy.action,
          effect: policy.effect
        })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Sucesso",
          description: "Política removida com sucesso"
        });
        loadPolicies();
      } else {
        toast({
          title: "Erro",
          description: data.error || "Falha ao remover política",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error removing policy:', error);
      toast({
        title: "Erro",
        description: "Erro ao conectar com o servidor",
        variant: "destructive"
      });
    }
  };

  const addRoleAssignment = async () => {
    try {
      const response = await fetch('/api/abac/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newRoleAssignment)
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Sucesso",
          description: "Role atribuído com sucesso"
        });
        setIsAddRoleOpen(false);
        setNewRoleAssignment({
          userEmail: '',
          roleName: ''
        });
        loadRoleAssignments();
      } else {
        toast({
          title: "Erro",
          description: data.error || "Falha ao atribuir role",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error adding role assignment:', error);
      toast({
        title: "Erro",
        description: "Erro ao conectar com o servidor",
        variant: "destructive"
      });
    }
  };

  return (
    <ABACProtectedPage requiredAction="manage" resource="/admin/abac" roles={['admin']}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Gestão ABAC</h1>
            <p className="text-muted-foreground">
              Sistema de controle de acesso baseado em atributos
            </p>
          </div>
          <Badge variant="outline" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Sistema Ativo
          </Badge>
        </div>

        <Tabs defaultValue="policies" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="policies" className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              Políticas
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Roles
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Monitoramento
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="policies" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Políticas de Acesso</h2>
              <Dialog open={isAddPolicyOpen} onOpenChange={setIsAddPolicyOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Nova Política
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Adicionar Nova Política</DialogTitle>
                    <DialogDescription>
                      Defina uma nova política de acesso ABAC
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="subject" className="text-right">
                        Sujeito
                      </Label>
                      <Input
                        id="subject"
                        placeholder="admin, user, role:*"
                        className="col-span-3"
                        value={newPolicy.subject}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPolicy({...newPolicy, subject: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="object" className="text-right">
                        Objeto
                      </Label>
                      <Input
                        id="object"
                        placeholder="/admin/*, data1"
                        className="col-span-3"
                        value={newPolicy.object}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPolicy({...newPolicy, object: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="action" className="text-right">
                        Ação
                      </Label>
                      <Select value={newPolicy.action} onValueChange={(value: string) => setNewPolicy({...newPolicy, action: value})}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="read">Read</SelectItem>
                          <SelectItem value="write">Write</SelectItem>
                          <SelectItem value="delete">Delete</SelectItem>
                          <SelectItem value="manage">Manage</SelectItem>
                          <SelectItem value="*">All</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="effect" className="text-right">
                        Efeito
                      </Label>
                      <Select value={newPolicy.effect} onValueChange={(value: 'allow' | 'deny') => setNewPolicy({...newPolicy, effect: value})}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="allow">Allow</SelectItem>
                          <SelectItem value="deny">Deny</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="conditions" className="text-right">
                        Condições
                      </Label>
                      <Textarea
                        id="conditions"
                        placeholder="JSON conditions (optional)"
                        className="col-span-3"
                        value={newPolicy.conditions}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewPolicy({...newPolicy, conditions: e.target.value})}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={addPolicy}>
                      Adicionar Política
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Políticas Ativas</CardTitle>
                <CardDescription>
                  Lista de todas as políticas de acesso configuradas no sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Carregando...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sujeito</TableHead>
                        <TableHead>Objeto</TableHead>
                        <TableHead>Ação</TableHead>
                        <TableHead>Efeito</TableHead>
                        <TableHead>Condições</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {policies.map((policy) => (
                        <TableRow key={policy.id}>
                          <TableCell>{policy.subject}</TableCell>
                          <TableCell>{policy.object}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{policy.action}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={policy.effect === 'allow' ? 'default' : 'destructive'}>
                              {policy.effect}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {policy.conditions ? (
                              <Badge variant="secondary">Com condições</Badge>
                            ) : (
                              <Badge variant="outline">Sem condições</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza que deseja remover esta política? Esta ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => removePolicy(policy)}>
                                      Remover
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roles" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Gestão de Roles</h2>
              <Dialog open={isAddRoleOpen} onOpenChange={setIsAddRoleOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Atribuir Role
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Atribuir Role a Usuário</DialogTitle>
                    <DialogDescription>
                      Vincule um role específico a um usuário
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="userEmail" className="text-right">
                        Email do Usuário
                      </Label>
                      <Input
                        id="userEmail"
                        type="email"
                        placeholder="usuario@exemplo.com"
                        className="col-span-3"
                        value={newRoleAssignment.userEmail}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewRoleAssignment({...newRoleAssignment, userEmail: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="roleName" className="text-right">
                        Nome do Role
                      </Label>
                      <Select value={newRoleAssignment.roleName} onValueChange={(value: string) => setNewRoleAssignment({...newRoleAssignment, roleName: value})}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Selecione um role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="moderator">Moderator</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="actuarial">Actuarial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={addRoleAssignment}>
                      Atribuir Role
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Atribuições de Roles</CardTitle>
                <CardDescription>
                  Visualize e gerencie os roles atribuídos aos usuários
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Carregando...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>E-mail do Usuário</TableHead>
                        <TableHead>Nome do Usuário</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Data de Atribuição</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {roleAssignments.map((assignment, index) => (
                        <TableRow key={`${assignment.userEmail}-${assignment.roleName}-${index}`}>
                          <TableCell>{assignment.userEmail}</TableCell>
                          <TableCell>{assignment.userName || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{assignment.roleName}</Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(assignment.assignedAt).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {roleAssignments.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            Nenhuma atribuição de role encontrada
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <h2 className="text-2xl font-semibold">Monitoramento de Acesso</h2>
            <Card>
              <CardHeader>
                <CardTitle>Logs de Acesso</CardTitle>
                <CardDescription>
                  Monitore tentativas de acesso e decisões de autorização
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Funcionalidade em desenvolvimento...
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-semibold">Configurações do Sistema</h2>
            <Card>
              <CardHeader>
                <CardTitle>Configurações ABAC</CardTitle>
                <CardDescription>
                  Configure o comportamento do sistema de autorização
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Funcionalidade em desenvolvimento...
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ABACProtectedPage>
  );
}
