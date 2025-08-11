---
applyTo: '**'
---

# Tarefas Especiais Temporárias – Unificação Autenticação & Formulários

> Objetivo: Recuperar completamente o SocialLoginBox completo do commit bom (3f2c6ca) com TODOS os provedores necessários e modernizar o fluxo de criação de conta com validação robusta, acessibilidade e auto login, sem deixar resíduos de implementações antigas.

## 1. Recuperar / Unificar SocialLoginBox Completo
- [x] Verificar providers atualmente presentes em `src/auth.ts` (google, github, credentials, email condicional)
- [x] Adicionar providers adicionais (apple, twitter, microsoft via microsoft-entra-id) de forma condicional
- [x] Normalizar IDs usados pelos botões vs IDs configurados no provider (microsoft-entra-id)
- [x] Garantir que SocialLoginBox referencia somente `/api/auth/signin?provider=<id>` (sem rotas manuais) e consome `/api/auth/providers`
- [x] Implementar fallback (desabilitar botão) quando provider não configurado (env ausente) com tooltip
- [x] Remover/resolver duplicações de endpoints legados (`/api/auth/local/register` versus `/api/auth/register`)
- [x] Atualizar `.env.example` com placeholders das variáveis necessárias dos novos providers
- [x] Documentar no topo de `auth.ts` a lógica condicional de inclusão de providers
- [ ] Testar manualmente cada botão (dev) para verificar redirecionamento 302 sem erro imediato

## 2. Modernização Formulário Criar Conta
- [x] Criar schema Zod compartilhado `src/components/auth/schemas.ts` (RegisterSchema)
- [x] Criar componente reutilizável `FormularioCriarConta` (react-hook-form + zodResolver)
- [x] Hook `useRegistrarUsuario` (React Query mutate) centralizando POST /api/auth/register
- [x] Normalizar mensagens de erro API usando enum/códigos (`src/utils/authErrors.ts`)
- [x] Auto login pós-registro (submit de form oculto para callback credentials) redirecionando para área cliente
- [x] Mostrar força da senha (componente barra + label) usando util `passwordStrength.ts`
- [x] Botão mostrar/ocultar senha e confirmar senha (icones lucide)
- [x] Desabilitar submit enquanto `isSubmitting || isMutating`
- [x] Spinner/loading no botão principal
- [x] Acessibilidade: aria-invalid, aria-describedby, focus no primeiro erro
- [x] Sanitização: trim, email lowercase, limite de tamanho (nome/email <= 120)
- [x] Telemetria simples (console.info) registrando sucesso, falha validação e falha servidor
- [ ] Testes unit: força senha, validação mismatch senha, email inválido
- [ ] Teste integração: fluxo sucesso (mock fetch + auto login invocado)
- [ ] Snapshot básico do componente render inicial

## 3. Limpeza / Resíduos
- [x] Marcar `/api/auth/local/register` como deprecado ou remover após confirmar ausência de referências (REMOVIDO)
- [x] Procura global por rotas antigas de signin/callback específicas (google/github/microsoft) para garantir ausência de resíduos (removidas rotas manuais microsoft)
- [ ] Atualizar checklist principal com links para esta tarefa (quando concluída)

## 4. Documentação
- [ ] Comentar cada novo arquivo (header explicativo PT-BR) (PARCIAL: revisar utilitários criados)
- [ ] Adicionar seção README curta sobre novos providers e variáveis
- [ ] Anotar no arquivo esta tarefa com data de conclusão e commit hash

## 5. Critérios de Aceite
- [ ] Build sem erros / Lint zero warnings
- [ ] Testes novos passando
- [ ] Registro cria usuário e executa auto login (sessão visível ao consultar cookie / página autenticada)
- [ ] SocialLoginBox exibe todos os botões e desabilita os não configurados corretamente

---
Progresso: Providers dinâmicos implementados e rotas legadas removidas em (data): 2025-08-09. Commit: (pre-commit hash TBD).

---
_Este arquivo será removido ou incorporado ao mega-checklist após a conclusão._
