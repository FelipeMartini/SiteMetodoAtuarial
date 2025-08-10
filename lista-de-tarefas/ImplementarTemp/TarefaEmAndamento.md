
# Checklist: Correção definitiva Next.js build error - /area-cliente/dashboard-admin

- [x] Remover dynamic import com ssr: false de PageDashboardAdmin.tsx
- [x] Importar DashboardAdmin diretamente
- [x] Garantir que 'use client' está na primeira linha
- [x] Validar se Skeleton e useAuth continuam funcionando normalmente
- [x] Rodar build Next.js Absoluto
- [ ] Corrigir eventuais erros de build (TypeError: Cannot destructure property 'data' of '(0 , d.wV)(...)' as it is undefined)
- [ ] Testar acesso à página /area-cliente/dashboard-admin
- [ ] Validar proteção de rota/admin
- [ ] Atualizar checklist e finalizar
