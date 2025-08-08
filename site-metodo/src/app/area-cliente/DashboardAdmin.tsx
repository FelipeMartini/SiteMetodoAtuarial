"use client";

import React from "react";
import CheckboxCustom from "@/app/area-cliente/CheckboxCustom";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useQueryClient } from '@tanstack/react-query';

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

// Dashboard administrativo para usuários nível 5

const fetchUsuarios = async (): Promise<Usuario[]> => {
  const res = await fetch("/api/usuario/lista");
  if (!res.ok) throw new Error('Erro ao buscar usuários');
  const data = await res.json();
  return data.usuarios || [];
};

const DashboardAdmin: React.FC = () => {
  const queryClient = useQueryClient();
  const [mensagem, setMensagem] = React.useState<string | null>(null);
  const { data: usuarios = [], isLoading } = useQuery<Usuario[]>({
    queryKey: ['usuarios-admin'],
    queryFn: fetchUsuarios,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Atualiza dados do usuário
  const handleUpdate = async (id: string, campo: keyof Usuario, valor: string | number | boolean) => {
    setMensagem(null);
    const res = await fetch(`/api/usuario/editar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, campo, valor }),
    });
    if (res.ok) {
      setMensagem("Usuário atualizado!");
      await queryClient.invalidateQueries({ queryKey: ['usuarios-admin'] });
    } else {
      setMensagem("Erro ao atualizar usuário.");
    }
  };

  if (isLoading) {
    // Exibe Skeletons para tabela de usuários enquanto carrega
    return (
      <div style={{ maxWidth: 900, margin: "0 auto", padding: 32 }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Manutenção de Usuários</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f3f4f6" }}>
              <th>Foto</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Nível</th>
              <th>Ativo</th>
              <th>Último Login</th>
              <th>Data de Criação</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
                <td><Skeleton className="h-[40px] w-[40px] rounded-full" /></td>
                <td><Skeleton className="h-[20px] w-[100px]" /></td>
                <td><Skeleton className="h-[20px] w-[160px]" /></td>
                <td><Skeleton className="h-[20px] w-[40px]" /></td>
                <td><Skeleton className="h-[20px] w-[60px]" /></td>
                <td><Skeleton className="h-[20px] w-[120px]" /></td>
                <td><Skeleton className="h-[20px] w-[120px]" /></td>
                <td><Skeleton className="h-[32px] w-[100px]" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Manutenção de Usuários</h2>
      {mensagem && <div style={{ color: mensagem.includes("atualizado") ? "green" : "red", marginBottom: 16 }}>{mensagem}</div>}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f3f4f6" }}>
            <th>Foto</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Nível</th>
            <th>Ativo</th>
            <th>Último Login</th>
            <th>Data de Criação</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(usuario => (
            <tr key={usuario.id} style={{ borderBottom: "1px solid #eee" }}>
              <td>
                {usuario.image ? (
                  <Image src={usuario.image} alt="Foto" width={40} height={40} style={{ borderRadius: "50%" }} />
                ) : (
                  <span style={{ color: "#aaa" }}>Sem foto</span>
                )}
              </td>
              <td>{usuario.name}</td>
              <td>{usuario.email}</td>
              <td>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={usuario.accessLevel}
                  onChange={e => handleUpdate(usuario.id, "accessLevel", Number(e.target.value))}
                  style={{ width: 40 }}
                />
              </td>
              <td>
                <CheckboxCustom
                  checked={usuario.isActive}
                  onChange={checked => handleUpdate(usuario.id, "isActive", checked)}
                  label={usuario.isActive ? "Ativo" : "Inativo"}
                />
              </td>
              <td>{usuario.lastLogin ? new Date(usuario.lastLogin).toLocaleString() : "-"}</td>
              <td>{new Date(usuario.createdAt).toLocaleString()}</td>
              <td>
                <button onClick={async () => {
                  setMensagem(null);
                  const res = await fetch(`/api/usuario/reset-senha`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: usuario.id }),
                  });
                  if (res.ok) setMensagem("Senha resetada!");
                  else setMensagem("Erro ao resetar senha.");
                }} style={{ marginRight: 8 }}>
                  Resetar Senha
                </button>
                {/* Outras ações podem ser adicionadas aqui */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardAdmin;
// Comentário: Dashboard administrativo completo para manutenção de usuários, edição de dados, ativação, reset de senha e permissões.
