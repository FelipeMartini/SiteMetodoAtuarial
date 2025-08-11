# Exemplos de Código Moderno para CRUD/Admin

## 1. Exemplo de Componente CRUD (Usuário)
```tsx
// src/app/admin/usuarios/UserTable.tsx
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { useQuery } from "@tanstack/react-query";

export function UserTable() {
  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => fetch("/api/usuarios").then(res => res.json()),
  });
  return <DataTable columns={columns} data={data ?? []} loading={isLoading} />;
}
```

## 2. Exemplo de Formulário com Zod + React Hook Form
```tsx
// src/app/admin/usuarios/UserForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

type UserFormData = z.infer<typeof userSchema>;

export function UserForm({ onSubmit }: { onSubmit: (data: UserFormData) => void }) {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Input {...form.register("name")}/>
      <Input {...form.register("email")}/>
      <Button type="submit">Salvar</Button>
    </form>
  );
}
```

## 3. Exemplo de Proteção de Rota (Auth.js)
```tsx
// src/app/admin/layout.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  if (!session) redirect("/login");
  return <>{children}</>;
}
```

## 4. Exemplo de Uso de Zustand para Store
```tsx
// src/store/useUserStore.ts
import { create } from "zustand";

export const useUserStore = create(set => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

---

> Consulte estes exemplos como base para acelerar a implementação e padronizar o código entre as equipes.
