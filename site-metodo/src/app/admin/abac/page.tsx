import { auth } from '@/lib/auth'
import { serverCheckPermissionDetailed } from '@/lib/abac/server'

export default async function ABACPageServer() {
  const session = await auth()
  if (!session?.user?.email) {
    return new Response(null, { status: 302, headers: { Location: '/login' } })
  }

  const authResult = await serverCheckPermissionDetailed(session.user.email, 'admin:abac', 'read')
  if (!authResult.allowed) {
    return new Response(null, { status: 302, headers: { Location: '/unauthorized' } })
  }

  const { default: ABACClient } = await import('./page-client')
  const ABACClientComp = ABACClient
  return (
    <ABACClientComp />
  )
}

  // Mock data for stats
  const statsData = [
    {
      title: "Total de Políticas",
      value: policies.length.toString(),
      description: "Políticas ABAC ativas",
      icon: Shield,
      change: { value: 12, isPositive: true }
    },
    {
      title: "Políticas de Permissão",
      value: policies.filter(p => p.ptype === 'p').length.toString(),
      description: "Regras de acesso",
      icon: Lock,
      change: { value: 8, isPositive: true }
    },
    {
      title: "Políticas de Papel",
      value: policies.filter(p => p.ptype === 'g').length.toString(),
      description: "Atribuições de papel",
      icon: Users,
      change: { value: 4, isPositive: true }
    },
    {
      title: "Testes Realizados",
      value: "156",
      description: "Verificações hoje",
      icon: Activity,
      change: { value: 23, isPositive: true }
    }
  ];

  return (
  <div className="flex min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/area-cliente">Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/area-cliente/dashboard-admin">Admin</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbPage>Gerenciamento ABAC</BreadcrumbPage>
                </BreadcrumbList>
              </Breadcrumb>
              
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Gerenciamento ABAC</h1>
                  <p className="text-muted-foreground">
                    Controle de acesso baseado em atributos para segurança avançada
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={loadPolicies} disabled={loading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Atualizar
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {statsData.map((stat, index) => (
                <StatsCard key={index} {...stat} />
              ))}
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="policies" className="space-y-4">
              <TabsList>
                <TabsTrigger value="policies">Políticas</TabsTrigger>
                <TabsTrigger value="test">Teste de Permissões</TabsTrigger>
                <TabsTrigger value="roles">Papéis e Grupos</TabsTrigger>
              </TabsList>

              <TabsContent value="policies" className="space-y-4">
                <div className="grid gap-4 lg:grid-cols-3">
                  {/* Policies Table */}
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="h-5 w-5" />
                          Políticas ABAC
                        </CardTitle>
                        <CardDescription>
                          Gerencie todas as políticas de controle de acesso
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <DataTable
                          data={policies}
                          columns={policyColumns}
                          searchKey="v0"
                          searchPlaceholder="Buscar por sujeito..."
                        />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Add Policy Form */}
                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Plus className="h-5 w-5" />
                          Nova Política
                        </CardTitle>
                        <CardDescription>
                          Adicione uma nova regra de acesso
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="ptype">Tipo</Label>
                          <Select
                            value={newPolicy.ptype}
                            onValueChange={(value) => setNewPolicy(prev => ({ ...prev, ptype: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="p">Permissão (p)</SelectItem>
                              <SelectItem value="g">Grupo (g)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="v0">Sujeito</Label>
                          <Input
                            id="v0"
                            value={newPolicy.v0}
                            onChange={(e) => setNewPolicy(prev => ({ ...prev, v0: e.target.value }))}
                            placeholder="usuário ou papel"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="v1">Objeto</Label>
                          <Input
                            id="v1"
                            value={newPolicy.v1}
                            onChange={(e) => setNewPolicy(prev => ({ ...prev, v1: e.target.value }))}
                            placeholder="recurso"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="v2">Ação</Label>
                          <Input
                            id="v2"
                            value={newPolicy.v2}
                            onChange={(e) => setNewPolicy(prev => ({ ...prev, v2: e.target.value }))}
                            placeholder="read, write, delete..."
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="v3">Contexto (opcional)</Label>
                          <Input
                            id="v3"
                            value={newPolicy.v3}
                            onChange={(e) => setNewPolicy(prev => ({ ...prev, v3: e.target.value }))}
                            placeholder="condições adicionais"
                          />
                        </div>

                        <Button 
                          onClick={addPolicy} 
                          className="w-full"
                          disabled={!newPolicy.v0 || !newPolicy.v1 || !newPolicy.v2}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar Política
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="test" className="space-y-4">
                <div className="grid gap-4 lg:grid-cols-2">
                  {/* Test Form */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <UserCheck className="h-5 w-5" />
                        Teste de Permissões
                      </CardTitle>
                      <CardDescription>
                        Verifique se uma ação é permitida para um usuário
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="subject">Sujeito</Label>
                        <Input
                          id="subject"
                          value={testSubject}
                          onChange={(e) => setTestSubject(e.target.value)}
                          placeholder="email do usuário ou papel"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="object">Objeto</Label>
                        <Input
                          id="object"
                          value={testObject}
                          onChange={(e) => setTestObject(e.target.value)}
                          placeholder="recurso (ex: admin:dashboard)"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="action">Ação</Label>
                        <Select value={testAction} onValueChange={setTestAction}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma ação" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="read">read</SelectItem>
                            <SelectItem value="write">write</SelectItem>
                            <SelectItem value="delete">delete</SelectItem>
                            <SelectItem value="admin">admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="context">Contexto (JSON)</Label>
                        <Textarea
                          id="context"
                          value={testContext}
                          onChange={(e) => setTestContext(e.target.value)}
                          placeholder='{"department": "TI", "location": "sede"}'
                          rows={3}
                        />
                      </div>

                      <Button 
                        onClick={testPermission} 
                        disabled={testLoading || !testSubject || !testObject || !testAction}
                        className="w-full"
                      >
                        {testLoading ? (
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Eye className="h-4 w-4 mr-2" />
                        )}
                        Testar Permissão
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Test Result */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Resultado do Teste
                      </CardTitle>
                      <CardDescription>
                        Resultado da verificação de permissão
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {testResult ? (
                        <div className="space-y-4">
                          <Alert className={testResult.allowed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                            <div className="flex items-center gap-2">
                              {testResult.allowed ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                              <AlertDescription className={testResult.allowed ? 'text-green-800' : 'text-red-800'}>
                                <strong>
                                  {testResult.allowed ? 'PERMITIDO' : 'NEGADO'}
                                </strong>
                                <br />
                                {testResult.subject} {testResult.allowed ? 'pode' : 'não pode'} fazer{' '}
                                {testResult.action} em {testResult.object}
                              </AlertDescription>
                            </div>
                          </Alert>

                          {testResult.policies && testResult.policies.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-2">Políticas Aplicadas:</h4>
                              <div className="space-y-1">
                                {testResult.policies.map((policy, index) => (
                                  <Badge key={index} variant="outline" className="mr-1 mb-1">
                                    {policy}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="text-sm text-muted-foreground">
                            <strong>Contexto:</strong>
                            <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-auto">
                              {JSON.stringify(testResult.context, null, 2)}
                            </pre>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-muted-foreground py-8">
                          <UserCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>Execute um teste para ver os resultados aqui</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="roles" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Papéis e Grupos
                    </CardTitle>
                    <CardDescription>
                      Gerencie atribuições de papéis e grupos de usuários
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center text-muted-foreground py-8">
                      <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Funcionalidade de gerenciamento de papéis em desenvolvimento</p>
                      <p className="text-sm mt-2">
                        Esta seção permitirá gerenciar atribuições de papéis e grupos
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
