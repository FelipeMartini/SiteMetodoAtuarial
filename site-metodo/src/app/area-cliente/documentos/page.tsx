'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/admin/data-table';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { 
  FileText, 
  Download, 
  Eye, 
  Search,
  Filter,
  Plus,
  Calendar,
  File,
  Folder,
  MoreHorizontal
} from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  createdAt: Date;
  status: 'completed' | 'processing' | 'draft';
  category: string;
}

// Dados mock para demonstração
const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Relatório Atuarial 2024',
    type: 'PDF',
    size: '2.4 MB',
    createdAt: new Date('2024-01-15'),
    status: 'completed',
    category: 'Relatórios'
  },
  {
    id: '2', 
    name: 'Cálculo de Reservas Técnicas',
    type: 'Excel',
    size: '1.8 MB',
    createdAt: new Date('2024-01-10'),
    status: 'completed',
    category: 'Cálculos'
  },
  {
    id: '3',
    name: 'Análise de Mortalidade',
    type: 'PDF',
    size: '3.2 MB',
    createdAt: new Date('2024-01-08'),
    status: 'processing',
    category: 'Análises'
  },
  {
    id: '4',
    name: 'Proposta Comercial',
    type: 'PDF',
    size: '896 KB',
    createdAt: new Date('2024-01-05'),
    status: 'draft',
    category: 'Propostas'
  }
];

export default function DocumentosPage() {
  const [searchTerm, setSearchTerm] = React.useState('');

  const columns: ColumnDef<Document>[] = [
    {
      accessorKey: 'name',
      header: 'Nome',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded bg-blue-100 flex items-center justify-center">
            <FileText className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="font-medium">{row.getValue('name')}</p>
            <p className="text-sm text-muted-foreground">{row.original.category}</p>
          </div>
        </div>
      )
    },
    {
      accessorKey: 'type',
      header: 'Tipo',
      cell: ({ row }) => (
        <Badge variant="outline">
          {row.getValue('type')}
        </Badge>
      )
    },
    {
      accessorKey: 'size',
      header: 'Tamanho'
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
          completed: 'default',
          processing: 'secondary', 
          draft: 'destructive'
        };
        const labels: Record<string, string> = {
          completed: 'Concluído',
          processing: 'Processando',
          draft: 'Rascunho'
        };
        
        return (
          <Badge variant={variants[status] || 'secondary'}>
            {labels[status] || status}
          </Badge>
        );
      }
    },
    {
      accessorKey: 'createdAt',
      header: 'Data',
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {format(row.getValue('createdAt'), "dd 'de' MMM, yyyy", { locale: ptBR })}
        </span>
      )
    },
    {
      id: 'actions',
      header: 'Ações',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const filteredDocuments = mockDocuments.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/area-cliente">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbPage>Meus Documentos</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Meus Documentos</h1>
          <p className="text-muted-foreground">
            Gerencie todos os seus relatórios e documentos
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Documento
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Documentos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDocuments.length}</div>
            <p className="text-xs text-muted-foreground">+2 este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
            <File className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockDocuments.filter(d => d.status === 'completed').length}
            </div>
            <p className="text-xs text-muted-foreground">75% do total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Processamento</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockDocuments.filter(d => d.status === 'processing').length}
            </div>
            <p className="text-xs text-muted-foreground">Aguardando conclusão</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Espaço Usado</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.3 MB</div>
            <p className="text-xs text-muted-foreground">de 100 MB</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documentos
          </CardTitle>
          <CardDescription>
            Todos os seus documentos e relatórios em um só lugar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar documentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>

          <DataTable
            data={filteredDocuments}
            columns={columns}
            searchKey="name"
            searchPlaceholder="Buscar documentos..."
          />
        </CardContent>
      </Card>
    </div>
  );
}
