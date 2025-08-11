# Exemplos Práticos - Site Método Atuarial

Esta documentação fornece exemplos práticos de uso da plataforma, incluindo integrações, casos de uso e código funcional.

## 📊 Casos de Uso Reais

### 1. Sistema de Gestão de Usuários

#### Cenário: Empresa de Consultoria Atuarial
Uma empresa precisa gerenciar diferentes tipos de usuários com permissões específicas.

```typescript
// Exemplo: Criação de usuário com role específico
const criarUsuarioConsultor = async (userData: {
  name: string
  email: string
  especialidade: string
}) => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...userData,
      role: 'consultor',
      permissions: ['read_reports', 'create_analysis', 'edit_own_content']
    })
  })
  
  return response.json()
}

// Uso no componente
function CadastroConsultor() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    especialidade: ''
  })
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const novoUsuario = await criarUsuarioConsultor(userData)
    console.log('Usuário criado:', novoUsuario)
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Nome completo"
        value={userData.name}
        onChange={(e) => setUserData({...userData, name: e.target.value})}
      />
      <Input
        type="email"
        placeholder="Email"
        value={userData.email}
        onChange={(e) => setUserData({...userData, email: e.target.value})}
      />
      <Select onValueChange={(value) => setUserData({...userData, especialidade: value})}>
        <SelectTrigger>
          <SelectValue placeholder="Especialidade" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pensoes">Pensões</SelectItem>
          <SelectItem value="seguros">Seguros</SelectItem>
          <SelectItem value="previdencia">Previdência</SelectItem>
        </SelectContent>
      </Select>
      <Button type="submit">Criar Consultor</Button>
    </form>
  )
}
```

### 2. Dashboard com Dados em Tempo Real

#### Cenário: Monitoramento de KPIs Atuariais
Dashboard que exibe métricas importantes com atualizações automáticas.

```typescript
// Hook customizado para dados em tempo real
function useRealtimeMetrics() {
  const { data, isLoading } = useQuery({
    queryKey: ['metrics', 'realtime'],
    queryFn: fetchMetrics,
    refetchInterval: 30000, // Atualiza a cada 30 segundos
    staleTime: 0, // Sempre considerar dados como stale
  })
  
  return { metrics: data, loading: isLoading }
}

// Componente do Dashboard
function DashboardExecutivo() {
  const { metrics, loading } = useRealtimeMetrics()
  
  if (loading) {
    return <DashboardSkeleton />
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Reservas Técnicas"
        value={formatCurrency(metrics?.reservasTecnicas)}
        change={metrics?.reservasChange}
        icon={<TrendingUp />}
      />
      <MetricCard
        title="Sinistralidade"
        value={formatPercent(metrics?.sinistralidade)}
        change={metrics?.sinistralindadeChange}
        icon={<AlertTriangle />}
      />
      <MetricCard
        title="Novos Segurados"
        value={metrics?.novosSegurados}
        change={metrics?.seguradosChange}
        icon={<Users />}
      />
      <MetricCard
        title="ROI Carteira"
        value={formatPercent(metrics?.roi)}
        change={metrics?.roiChange}
        icon={<DollarSign />}
      />
    </div>
  )
}

// Componente reutilizável de métrica
function MetricCard({ title, value, change, icon }: {
  title: string
  value: string
  change: number
  icon: React.ReactNode
}) {
  const isPositive = change >= 0
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={cn(
          "text-xs",
          isPositive ? "text-green-600" : "text-red-600"
        )}>
          {isPositive ? '+' : ''}{change.toFixed(2)}% em relação ao mês anterior
        </p>
      </CardContent>
    </Card>
  )
}
```

### 3. Sistema de Relatórios Personalizados

#### Cenário: Geração de Relatórios Atuariais
Interface para criação e visualização de relatórios customizados.

```typescript
// Schema de validação para relatórios
const RelatorioSchema = z.object({
  tipo: z.enum(['sinistralidade', 'reservas', 'performance']),
  periodo: z.object({
    inicio: z.string().datetime(),
    fim: z.string().datetime(),
  }),
  filtros: z.object({
    produtos: z.array(z.string()).optional(),
    regioes: z.array(z.string()).optional(),
    canais: z.array(z.string()).optional(),
  }),
  formato: z.enum(['pdf', 'excel', 'csv']),
})

type RelatorioConfig = z.infer<typeof RelatorioSchema>

// Hook para geração de relatórios
function useRelatorioGenerator() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (config: RelatorioConfig) => {
      const response = await fetch('/api/relatorios/gerar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })
      
      if (!response.ok) throw new Error('Erro ao gerar relatório')
      
      // Se for PDF/Excel, retornar blob para download
      if (config.formato !== 'csv') {
        return response.blob()
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['relatorios'] })
    },
  })
}

// Componente para configuração de relatório
function ConfiguradorRelatorio() {
  const [config, setConfig] = useState<Partial<RelatorioConfig>>({
    tipo: 'sinistralidade',
    formato: 'pdf',
  })
  
  const gerarRelatorio = useRelatorioGenerator()
  
  const handleGenerate = async () => {
    try {
      const validConfig = RelatorioSchema.parse(config)
      const resultado = await gerarRelatorio.mutateAsync(validConfig)
      
      // Se for blob (PDF/Excel), fazer download
      if (resultado instanceof Blob) {
        const url = URL.createObjectURL(resultado)
        const a = document.createElement('a')
        a.href = url
        a.download = `relatorio-${validConfig.tipo}-${Date.now()}.${validConfig.formato}`
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Erro na geração:', error)
    }
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurar Relatório</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Tipo de Relatório</Label>
          <Select
            value={config.tipo}
            onValueChange={(value) => setConfig({...config, tipo: value as any})}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sinistralidade">Sinistralidade</SelectItem>
              <SelectItem value="reservas">Reservas Técnicas</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Data Início</Label>
            <Input
              type="datetime-local"
              onChange={(e) => setConfig({
                ...config,
                periodo: { ...config.periodo, inicio: e.target.value }
              })}
            />
          </div>
          <div>
            <Label>Data Fim</Label>
            <Input
              type="datetime-local"
              onChange={(e) => setConfig({
                ...config,
                periodo: { ...config.periodo, fim: e.target.value }
              })}
            />
          </div>
        </div>
        
        <div>
          <Label>Formato</Label>
          <RadioGroup
            value={config.formato}
            onValueChange={(value) => setConfig({...config, formato: value as any})}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pdf" id="pdf" />
              <Label htmlFor="pdf">PDF</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="excel" id="excel" />
              <Label htmlFor="excel">Excel</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="csv" id="csv" />
              <Label htmlFor="csv">CSV</Label>
            </div>
          </RadioGroup>
        </div>
        
        <Button 
          onClick={handleGenerate}
          disabled={gerarRelatorio.isPending}
          className="w-full"
        >
          {gerarRelatorio.isPending ? 'Gerando...' : 'Gerar Relatório'}
        </Button>
      </CardContent>
    </Card>
  )
}
```

---

## 🔗 Integrações com APIs Externas

### 1. Integração com Sistema de CRM

```typescript
// Sincronização de leads com CRM externo
class CRMIntegration {
  private readonly apiKey: string
  private readonly baseURL: string
  
  constructor() {
    this.apiKey = process.env.CRM_API_KEY!
    this.baseURL = process.env.CRM_BASE_URL!
  }
  
  async syncLead(leadData: {
    name: string
    email: string
    phone: string
    interesse: string
  }) {
    try {
      const response = await fetch(`${this.baseURL}/leads`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...leadData,
          source: 'site_metodo_atuarial',
          timestamp: new Date().toISOString(),
        }),
      })
      
      if (!response.ok) {
        throw new Error(`CRM API error: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      // Log do erro mas não quebrar o fluxo principal
      console.error('Erro na sincronização com CRM:', error)
      
      // Adicionar a uma fila para retry posterior
      await this.addToRetryQueue(leadData)
    }
  }
  
  private async addToRetryQueue(leadData: any) {
    // Implementar fila de retry (Redis, banco, etc.)
    await prisma.integrationQueue.create({
      data: {
        service: 'CRM',
        action: 'sync_lead',
        payload: leadData,
        attempts: 0,
        nextRetry: new Date(Date.now() + 5 * 60 * 1000), // 5 min
      },
    })
  }
}

// Uso em API route
export async function POST(request: NextRequest) {
  const leadData = await request.json()
  
  // Salvar no banco local primeiro
  const lead = await prisma.lead.create({
    data: leadData,
  })
  
  // Sincronizar com CRM (não-bloqueante)
  const crm = new CRMIntegration()
  crm.syncLead(leadData).catch(console.error)
  
  return Response.json({ lead })
}
```

### 2. Integração com Sistema de Pagamentos

```typescript
// Integração com gateway de pagamento
import { Stripe } from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

class PaymentService {
  async createSubscription(customerId: string, planId: string) {
    try {
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: planId }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      })
      
      return subscription
    } catch (error) {
      console.error('Erro ao criar assinatura:', error)
      throw new Error('Não foi possível processar o pagamento')
    }
  }
  
  async handleWebhook(event: Stripe.Event) {
    switch (event.type) {
      case 'customer.subscription.created':
        await this.handleSubscriptionCreated(event.data.object as Stripe.Subscription)
        break
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break
      case 'invoice.payment_succeeded':
        await this.handlePaymentSucceeded(event.data.object as Stripe.Invoice)
        break
      default:
        console.log(`Evento não tratado: ${event.type}`)
    }
  }
  
  private async handleSubscriptionCreated(subscription: Stripe.Subscription) {
    await prisma.user.update({
      where: { stripeCustomerId: subscription.customer as string },
      data: {
        subscriptionId: subscription.id,
        subscriptionStatus: subscription.status,
        planId: subscription.items.data[0]?.price.id,
      },
    })
  }
}

// API route para webhook
export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!
  
  let event: Stripe.Event
  
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.log('Webhook signature verification failed.', err)
    return Response.json({ error: 'Webhook error' }, { status: 400 })
  }
  
  const paymentService = new PaymentService()
  await paymentService.handleWebhook(event)
  
  return Response.json({ received: true })
}
```

---

## 🧮 Calculadoras Atuariais

### 1. Calculadora de Reservas Técnicas

```typescript
// Classe para cálculos atuariais
class CalculadoraReservas {
  /**
   * Calcula reserva matemática para previdência
   */
  static calcularReservaMatematica(params: {
    valorBeneficio: number
    idadeAtual: number
    idadeAposentadoria: number
    taxaJuros: number
    tabua: string
  }) {
    const { valorBeneficio, idadeAtual, idadeAposentadoria, taxaJuros, tabua } = params
    
    // Buscar dados da tábua atuarial
    const probabilidades = this.obterTabuaAtuarial(tabua)
    
    let reserva = 0
    const anosDiferidos = idadeAposentadoria - idadeAtual
    
    for (let t = 0; t <= anosDiferidos; t++) {
      const probabilidadeSobrevivencia = this.calcularProbabilidadeSobrevivencia(
        idadeAtual, 
        idadeAtual + t, 
        probabilidades
      )
      
      const fatorDesconto = Math.pow(1 + taxaJuros, -t)
      reserva += valorBeneficio * probabilidadeSobrevivencia * fatorDesconto
    }
    
    return reserva
  }
  
  /**
   * Calcula reserva IBNR (Incurred But Not Reported)
   */
  static calcularIBNR(historicoSinistros: {
    trimestre: string
    sinistrosReportados: number
    sinistrosPagos: number
  }[]) {
    // Método Chain Ladder simplificado
    const triangulo = this.construirTriangulo(historicoSinistros)
    const fatoresDesenvolvimento = this.calcularFatoresDesenvolvimento(triangulo)
    
    return this.projetarSinistros(triangulo, fatoresDesenvolvimento)
  }
  
  private static obterTabuaAtuarial(tabua: string) {
    // Cache das tábuas mais utilizadas
    const tabuas = {
      'AT_2000': require('./tabuas/AT_2000.json'),
      'BR_EMS': require('./tabuas/BR_EMS.json'),
      'IBGE_2020': require('./tabuas/IBGE_2020.json'),
    }
    
    return tabuas[tabua as keyof typeof tabuas] || tabuas.AT_2000
  }
}

// Hook para usar a calculadora
function useCalculadoraReservas() {
  const [parametros, setParametros] = useState({
    valorBeneficio: 0,
    idadeAtual: 30,
    idadeAposentadoria: 65,
    taxaJuros: 0.06,
    tabua: 'AT_2000',
  })
  
  const resultado = useMemo(() => {
    if (parametros.valorBeneficio > 0) {
      return CalculadoraReservas.calcularReservaMatematica(parametros)
    }
    return 0
  }, [parametros])
  
  return {
    parametros,
    setParametros,
    reservaCalculada: resultado,
  }
}

// Componente da calculadora
function CalculadoraReservasComponent() {
  const { parametros, setParametros, reservaCalculada } = useCalculadoraReservas()
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Calculadora de Reservas Técnicas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Valor do Benefício (R$)</Label>
          <Input
            type="number"
            value={parametros.valorBeneficio}
            onChange={(e) => setParametros({
              ...parametros,
              valorBeneficio: Number(e.target.value)
            })}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Idade Atual</Label>
            <Input
              type="number"
              min="18"
              max="100"
              value={parametros.idadeAtual}
              onChange={(e) => setParametros({
                ...parametros,
                idadeAtual: Number(e.target.value)
              })}
            />
          </div>
          <div>
            <Label>Idade de Aposentadoria</Label>
            <Input
              type="number"
              min="50"
              max="100"
              value={parametros.idadeAposentadoria}
              onChange={(e) => setParametros({
                ...parametros,
                idadeAposentadoria: Number(e.target.value)
              })}
            />
          </div>
        </div>
        
        <div>
          <Label>Taxa de Juros (%)</Label>
          <Input
            type="number"
            step="0.01"
            value={(parametros.taxaJuros * 100).toFixed(2)}
            onChange={(e) => setParametros({
              ...parametros,
              taxaJuros: Number(e.target.value) / 100
            })}
          />
        </div>
        
        <div>
          <Label>Tábua Atuarial</Label>
          <Select
            value={parametros.tabua}
            onValueChange={(value) => setParametros({...parametros, tabua: value})}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AT_2000">AT-2000</SelectItem>
              <SelectItem value="BR_EMS">BR-EMS</SelectItem>
              <SelectItem value="IBGE_2020">IBGE 2020</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Separator />
        
        <div className="text-center">
          <Label className="text-lg">Reserva Matemática</Label>
          <div className="text-3xl font-bold text-primary">
            {formatCurrency(reservaCalculada)}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

---

## 📱 Componentes Mobile-First

### 1. Lista de Transações Responsiva

```typescript
// Componente otimizado para mobile
function TransactionsList() {
  const [transactions] = useTransactions()
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null)
  
  return (
    <div className="space-y-2">
      {transactions.map((transaction) => (
        <Card 
          key={transaction.id}
          className={cn(
            "transition-all duration-200",
            selectedTransaction === transaction.id && "ring-2 ring-primary"
          )}
        >
          <CardContent className="p-4">
            {/* Layout Desktop */}
            <div className="hidden md:flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  transaction.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                )}>
                  {transaction.type === 'credit' ? '+' : '-'}
                </div>
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-muted-foreground">{transaction.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={cn(
                  "font-bold",
                  transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                )}>
                  {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(transaction.date)}
                </p>
              </div>
            </div>
            
            {/* Layout Mobile */}
            <div className="md:hidden">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="font-medium text-sm leading-tight">
                    {transaction.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {transaction.category}
                  </p>
                </div>
                <div className={cn(
                  "ml-2 px-2 py-1 rounded text-xs font-bold",
                  transaction.type === 'credit' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                )}>
                  {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {formatDate(transaction.date)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTransaction(
                    selectedTransaction === transaction.id ? null : transaction.id
                  )}
                >
                  {selectedTransaction === transaction.id ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              {/* Detalhes expandidos */}
              {selectedTransaction === transaction.id && (
                <div className="mt-3 pt-3 border-t space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">ID:</span>
                      <span className="ml-1 font-mono">{transaction.id}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <span className="ml-1">{transaction.status}</span>
                    </div>
                  </div>
                  {transaction.notes && (
                    <div className="text-xs">
                      <span className="text-muted-foreground">Observações:</span>
                      <p className="mt-1">{transaction.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
```

---

## 🔍 Funcionalidades Avançadas

### 1. Busca Global com Filtros

```typescript
// Hook para busca global
function useGlobalSearch() {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState({
    type: 'all',
    dateRange: null,
    category: null,
  })
  
  const { data: results, isLoading } = useQuery({
    queryKey: ['global-search', query, filters],
    queryFn: () => performGlobalSearch(query, filters),
    enabled: query.length >= 2,
    debounceMs: 300, // Debounce para evitar muitas requisições
  })
  
  return {
    query,
    setQuery,
    filters,
    setFilters,
    results: results || [],
    isLoading,
  }
}

// Componente de busca
function GlobalSearchComponent() {
  const { query, setQuery, results, isLoading } = useGlobalSearch()
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar usuários, relatórios, documentos..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(e.target.value.length >= 2)
          }}
          className="pl-10 pr-4"
          onFocus={() => query.length >= 2 && setIsOpen(true)}
        />
      </div>
      
      {isOpen && (
        <Card className="absolute top-full mt-1 w-full z-50 max-h-96 overflow-auto">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                <p className="text-sm text-muted-foreground mt-2">Buscando...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="divide-y">
                {results.map((result) => (
                  <div
                    key={result.id}
                    className="p-3 hover:bg-muted cursor-pointer"
                    onClick={() => {
                      // Navegar para o resultado
                      window.location.href = result.url
                      setIsOpen(false)
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-xs",
                        result.type === 'user' && 'bg-blue-100 text-blue-600',
                        result.type === 'report' && 'bg-green-100 text-green-600',
                        result.type === 'document' && 'bg-purple-100 text-purple-600'
                      )}>
                        {result.type === 'user' && <User className="h-4 w-4" />}
                        {result.type === 'report' && <FileText className="h-4 w-4" />}
                        {result.type === 'document' && <File className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{result.title}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {result.description}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {result.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                Nenhum resultado encontrado
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
```

### 2. Sistema de Notificações em Tempo Real

```typescript
// Hook para notificações
function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const queryClient = useQueryClient()
  
  useEffect(() => {
    // Configurar WebSocket para notificações em tempo real
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL!)
    
    ws.onmessage = (event) => {
      const notification = JSON.parse(event.data)
      setNotifications(prev => [notification, ...prev.slice(0, 9)]) // Máximo 10
      
      // Mostrar toast
      toast({
        title: notification.title,
        description: notification.message,
        duration: 5000,
      })
      
      // Invalidar queries relacionadas
      if (notification.invalidateQueries) {
        notification.invalidateQueries.forEach((queryKey: string[]) => {
          queryClient.invalidateQueries({ queryKey })
        })
      }
    }
    
    return () => ws.close()
  }, [queryClient])
  
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }
  
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }
  
  return {
    notifications,
    unreadCount: notifications.filter(n => !n.read).length,
    markAsRead,
    markAllAsRead,
  }
}

// Componente de sino de notificações
function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-2">
          <h3 className="font-semibold">Notificações</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Marcar todas como lidas
            </Button>
          )}
        </div>
        
        <DropdownMenuSeparator />
        
        <div className="max-h-96 overflow-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "p-3 border-b last:border-b-0 cursor-pointer hover:bg-muted",
                  !notification.read && "bg-blue-50"
                )}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className={cn(
                    "w-2 h-2 rounded-full mt-2",
                    !notification.read ? "bg-blue-500" : "bg-transparent"
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt))} atrás
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              Nenhuma notificação
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

---

## 🛠️ Utilidades e Helpers

### 1. Formatadores de Dados Brasileiros

```typescript
// utils/formatters.ts
export const formatters = {
  // Moeda brasileira
  currency: (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  },
  
  // Porcentagem
  percentage: (value: number, decimals = 2) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value / 100)
  },
  
  // CPF
  cpf: (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  },
  
  // CNPJ
  cnpj: (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  },
  
  // Telefone
  phone: (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length === 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    }
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  },
  
  // Data brasileira
  date: (value: Date | string) => {
    const date = typeof value === 'string' ? new Date(value) : value
    return new Intl.DateTimeFormat('pt-BR').format(date)
  },
  
  // Data e hora
  datetime: (value: Date | string) => {
    const date = typeof value === 'string' ? new Date(value) : value
    return new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  },
}

// Hook para usar formatadores
export function useFormatters() {
  return formatters
}
```

### 2. Validadores Brasileiros

```typescript
// utils/validators.ts
export const validators = {
  cpf: (cpf: string): boolean => {
    const numbers = cpf.replace(/\D/g, '')
    
    if (numbers.length !== 11 || /^(\d)\1{10}$/.test(numbers)) {
      return false
    }
    
    // Validação do primeiro dígito
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(numbers[i]) * (10 - i)
    }
    let digit = 11 - (sum % 11)
    if (digit >= 10) digit = 0
    if (parseInt(numbers[9]) !== digit) return false
    
    // Validação do segundo dígito
    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(numbers[i]) * (11 - i)
    }
    digit = 11 - (sum % 11)
    if (digit >= 10) digit = 0
    if (parseInt(numbers[10]) !== digit) return false
    
    return true
  },
  
  cnpj: (cnpj: string): boolean => {
    const numbers = cnpj.replace(/\D/g, '')
    
    if (numbers.length !== 14 || /^(\d)\1{13}$/.test(numbers)) {
      return false
    }
    
    // Validação do primeiro dígito
    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    let sum = 0
    for (let i = 0; i < 12; i++) {
      sum += parseInt(numbers[i]) * weights1[i]
    }
    let digit = sum % 11
    digit = digit < 2 ? 0 : 11 - digit
    if (parseInt(numbers[12]) !== digit) return false
    
    // Validação do segundo dígito
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    sum = 0
    for (let i = 0; i < 13; i++) {
      sum += parseInt(numbers[i]) * weights2[i]
    }
    digit = sum % 11
    digit = digit < 2 ? 0 : 11 - digit
    if (parseInt(numbers[13]) !== digit) return false
    
    return true
  },
  
  email: (email: string): boolean => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(email)
  },
  
  phone: (phone: string): boolean => {
    const numbers = phone.replace(/\D/g, '')
    return numbers.length === 10 || numbers.length === 11
  },
}

// Schemas Zod com validadores brasileiros
export const BrazilianSchemas = {
  cpf: z.string().refine(validators.cpf, 'CPF inválido'),
  cnpj: z.string().refine(validators.cnpj, 'CNPJ inválido'),
  phone: z.string().refine(validators.phone, 'Telefone inválido'),
}
```

---

## 📊 Gráficos e Visualizações

### 1. Dashboard com Recharts

```typescript
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

// Componente de gráfico de evolução
function GraficoEvolucaoReservas({ data }: { data: Array<{
  periodo: string
  reservas: number
  sinistros: number
}> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução das Reservas Técnicas</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="periodo" />
            <YAxis tickFormatter={(value) => formatCurrency(value)} />
            <Tooltip 
              formatter={(value: number) => [formatCurrency(value), '']}
              labelFormatter={(label) => `Período: ${label}`}
            />
            <Area 
              type="monotone" 
              dataKey="reservas" 
              stackId="1"
              stroke="#8884d8" 
              fill="#8884d8" 
              fillOpacity={0.6}
            />
            <Area 
              type="monotone" 
              dataKey="sinistros" 
              stackId="1"
              stroke="#82ca9d" 
              fill="#82ca9d" 
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// Componente de distribuição por categoria
function GraficoDistribuicaoRiscos({ data }: { data: Array<{
  categoria: string
  valor: number
  cor: string
}> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição de Riscos</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ categoria, percent }) => 
                `${categoria} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="valor"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.cor} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
```

---

*Esta documentação de exemplos será continuamente atualizada com novos casos de uso e implementações práticas.*

---

## 📞 Suporte e Contribuições

- **Documentação**: [README.md](../README.md)
- **Issues**: [GitHub Issues](https://github.com/FelipeMartini/SiteMetodoAtuarial/issues)
- **Discussões**: [GitHub Discussions](https://github.com/FelipeMartini/SiteMetodoAtuarial/discussions)
- **Email**: dev@metodoatuarial.com.br

---

*Última atualização: Janeiro 2025*
