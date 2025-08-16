'use client'

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DataTable } from '@/components/admin/data-table';
import { StatsCard } from '@/components/admin/stats-card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { 
  Shield, 
  Users, 
  Lock, 
  CheckCircle, 
  XCircle, 
  Activity,
  UserCheck,
  Settings,
  Eye,
  Trash2,
  Plus,
  RefreshCw
} from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

interface Policy {
  id: string;
  ptype: string;
  v0: string;
  v1: string;
  v2: string;
  v3?: string;
  v4?: string;
  v5?: string;
}

interface PermissionTestResult {
  allowed: boolean;
  policies: string[];
  subject: string;
  object: string;
  action: string;
  context: Record<string, unknown>;
}

export default function ABACPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [testResult, setTestResult] = useState<PermissionTestResult | null>(null);
  const [testLoading, setTestLoading] = useState(false);
  
  // Test form state
  const [testSubject, setTestSubject] = useState('');
  const [testObject, setTestObject] = useState('');
  const [testAction, setTestAction] = useState('');
  const [testContext, setTestContext] = useState('{}');

  // Policy form state
  const [newPolicy, setNewPolicy] = useState({
    ptype: 'p',
    v0: '',
    v1: '',
    v2: '',
    v3: '',
    v4: '',
    v5: ''
  });

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/abac/policies');
      if (response.ok) {
        const data = await response.json();
        setPolicies(data.policies || []);
      }
    } catch (error) {
      console.error('Erro ao carregar políticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const testPermission = async () => {
    try {
      setTestLoading(true);
      const context = JSON.parse(testContext || '{}');
      
      const response = await fetch('/api/abac/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: testSubject,
          object: testObject,
          action: testAction,
          context
        })
      });

      if (response.ok) {
        const result = await response.json();
        setTestResult(result);
      }
    } catch (error) {
      console.error('Erro ao testar permissão:', error);
    } finally {
      setTestLoading(false);
    }
  };

  const addPolicy = async () => {
    try {
      const response = await fetch('/api/admin/abac/policies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPolicy)
      });

      if (response.ok) {
        await loadPolicies();
        setNewPolicy({
          ptype: 'p',
          v0: '',
          v1: '',
          v2: '',
          v3: '',
          v4: '',
          v5: ''
        });
      }
    } catch (error) {
      console.error('Erro ao adicionar política:', error);
    }
  };

  const deletePolicy = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/abac/policies/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadPolicies();
      }
    } catch (error) {
      console.error('Erro ao deletar política:', error);
    }
  };

  const policyColumns: ColumnDef<Policy>[] = [
    {
      accessorKey: 'ptype',
      header: 'Tipo',
      cell: ({ row }) => (
        <Badge variant={row.getValue('ptype') === 'p' ? 'default' : 'secondary'}>
          {row.getValue('ptype')}
        </Badge>
      )
    },
    {
      accessorKey: 'v0',
      header: 'Sujeito'
    },
    {
      accessorKey: 'v1',
      header: 'Objeto'
    },
    {
      accessorKey: 'v2',
      header: 'Ação'
    },
    {
      accessorKey: 'v3',
      header: 'Contexto'
    },
    {
      id: 'actions',
      header: 'Ações',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deletePolicy(row.original.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

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
      description: "Associação de papeis",
      icon: Users,
      change: { value: 3, isPositive: false }
    }
  ];

  return (
    <div>
      {/* Mantemos comportamento cliente intacto */}
      <div className="mb-4">
        <StatsCard items={statsData} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Políticas ABAC</CardTitle>
          <CardDescription>Adicione, remova e teste políticas ABAC</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex gap-2">
              <Input placeholder="subject (e.g. user@example.com)" value={testSubject} onChange={(e) => setTestSubject(e.target.value)} />
              <Input placeholder="object (e.g. admin:dashboard)" value={testObject} onChange={(e) => setTestObject(e.target.value)} />
              <Input placeholder="action (read|write)" value={testAction} onChange={(e) => setTestAction(e.target.value)} />
              <Button onClick={testPermission} disabled={testLoading}>{testLoading ? 'Testando...' : 'Testar'}</Button>
            </div>
            {testResult && (
              <Alert className="mt-2">
                <div className="flex flex-col">
                  <div>{testResult.allowed ? 'Permitido' : 'Negado'}</div>
                  <div className="text-xs text-muted-foreground">Políticas aplicadas: {testResult.policies.join('; ')}</div>
                </div>
              </Alert>
            )}
          </div>

          <div>
            <DataTable columns={policyColumns} data={policies} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
