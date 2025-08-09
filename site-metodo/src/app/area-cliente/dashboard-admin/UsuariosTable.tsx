"use client";
// Tabela avançada de usuários (admin) - TanStack Table + shadcn/ui + ComponenteBase
import React, { useRef, useEffect } from "react";
import { ComponenteBase } from "@/components/ui/ComponenteBase";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Usuario {
  id: string;
  name: string;
  email: string;
  image?: string;
  accessLevel: number;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

interface UsuariosTableProps {
  usuarios: Usuario[];
  loading: boolean;
  onResetSenha: (id: string) => void;
  onToggleAtivo: (id: string, ativo: boolean) => void;
  onChangeNivel: (id: string, nivel: number) => void;
  selecionados: string[];
  onSelecionar: (id: string, checked: boolean) => void;
  onSelecionarTodos: (checked: boolean) => void;
  todosSelecionados: boolean;
  algumSelecionado: boolean;
}

export default function UsuariosTable({
  usuarios,
  loading,
  onResetSenha,
  onToggleAtivo,
  onChangeNivel,
  selecionados,
  onSelecionar,
  onSelecionarTodos,
  todosSelecionados,
  algumSelecionado,
}: UsuariosTableProps) {
  // Ref para o checkbox global de seleção
  const selectAllRef = useRef<HTMLInputElement>(null);

  // Atualiza o estado indeterminate do checkbox global conforme seleção parcial
  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = !todosSelecionados && algumSelecionado;
    }
  }, [todosSelecionados, algumSelecionado]);

  return (
    <ComponenteBase variant="default" size="lg" className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <input
                ref={selectAllRef}
                type="checkbox"
                aria-label="Selecionar todos"
                checked={todosSelecionados}
                onChange={e => onSelecionarTodos(e.target.checked)}
              />
            </TableHead>
            <TableHead>Foto</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Papel</TableHead>
            <TableHead>Flags</TableHead>
            <TableHead>MFA</TableHead>
            <TableHead>Nível</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Último Login</TableHead>
            <TableHead>Data de Criação</TableHead>
            <TableHead>Logs</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            [...Array(5)].map((_, idx) => (
              <TableRow key={idx}>
                <TableCell colSpan={9} className="h-12 bg-muted/40 animate-pulse" />
              </TableRow>
            ))
          ) : (
            usuarios.map(usuario => {
              // MOCK: role, bloqueado, mfa, logs
              const role = usuario.accessLevel >= 5 ? "admin" : usuario.accessLevel >= 3 ? "editor" : "user";
              const bloqueado = usuario.isActive ? false : Math.random() > 0.7; // 30% dos inativos são bloqueados
              const mfa = Math.random() > 0.5; // 50% dos usuários têm MFA
              const logs = [
                { tipo: "login", data: usuario.lastLogin || usuario.createdAt },
                { tipo: "reset", data: usuario.createdAt }
              ];
              return (
                <TableRow key={usuario.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      aria-label={`Selecionar usuário ${usuario.name}`}
                      checked={selecionados.includes(usuario.id)}
                      onChange={e => onSelecionar(usuario.id, e.target.checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <Avatar>
                      {usuario.image ? (
                        <AvatarImage src={usuario.image} alt={usuario.name || "Usuário"} />
                      ) : null}
                      <AvatarFallback>{usuario.name?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>{usuario.name}</TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  {/* Papel */}
                  <TableCell>
                    <Badge variant={role === "admin" ? "destructive" : role === "editor" ? "secondary" : "default"}>
                      {role}
                    </Badge>
                  </TableCell>
                  {/* Flags */}
                  <TableCell>
                    {usuario.isActive ? (
                      <Badge variant="default">Ativo</Badge>
                    ) : bloqueado ? (
                      <Badge variant="destructive">Bloqueado</Badge>
                    ) : (
                      <Badge variant="outline">Inativo</Badge>
                    )}
                  </TableCell>
                  {/* MFA */}
                  <TableCell>
                    {mfa ? (
                      <span title="MFA habilitado" className="text-green-600 font-bold">●</span>
                    ) : (
                      <span title="MFA não habilitado" className="text-gray-400">○</span>
                    )}
                  </TableCell>
                  {/* Nível */}
                  <TableCell>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={usuario.accessLevel}
                      onChange={e => onChangeNivel(usuario.id, Number(e.target.value))}
                      className="w-14 rounded border px-2 py-1 text-center"
                    />
                  </TableCell>
                  {/* Status */}
                  <TableCell>
                    <Badge variant={usuario.isActive ? "default" : "outline"}>
                      {usuario.isActive ? "Ativo" : "Inativo"}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      className="ml-2"
                      onClick={() => onToggleAtivo(usuario.id, !usuario.isActive)}
                    >
                      {usuario.isActive ? "Desativar" : "Ativar"}
                    </Button>
                  </TableCell>
                  {/* Último Login */}
                  <TableCell>
                    {usuario.lastLogin ? new Date(usuario.lastLogin).toLocaleString() : "-"}
                  </TableCell>
                  {/* Data de Criação */}
                  <TableCell>{new Date(usuario.createdAt).toLocaleString()}</TableCell>
                  {/* Logs */}
                  <TableCell>
                    <Button size="sm" variant="ghost" title="Ver logs" onClick={() => alert(`Logs de ${usuario.name}:\n` + logs.map(l => `${l.tipo}: ${l.data}`).join("\n"))}>
                      <span role="img" aria-label="Logs">📝</span>
                    </Button>
                  </TableCell>
                  {/* Ações */}
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => onResetSenha(usuario.id)}>
                      Resetar Senha
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </ComponenteBase>
  );
}