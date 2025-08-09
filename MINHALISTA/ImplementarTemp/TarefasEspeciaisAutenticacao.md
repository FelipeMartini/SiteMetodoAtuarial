---
applyTo: '**'
---

# Tarefas Especiais Temporárias – Unificação Autenticação & Formulários

> Objetivo: Recuperar completamente o SocialLoginBox completo do commit bom (3f2c6ca) com TODOS os provedores necessários e modernizar o fluxo de criação de conta com validação robusta, acessibilidade e auto login, sem deixar resíduos de implementações antigas.

## 1. Recuperar / Unificar SocialLoginBox Completo
- [ ] Verificar providers atualmente presentes em `src/auth.ts` (google, github, credentials, email condicional)
- [ ] Adicionar providers adicionais (apple, twitter, microsoft via azure-ad com id custom) de forma condicional
- [ ] Normalizar IDs usados pelos botões vs IDs configurados no provider
- [ ] Garantir que SocialLoginBox referencia somente `/api/auth/signin?provider=<id>` (sem rotas manuais)
- [ ] Implementar fallback (desabilitar botão) quando provider não configurado (env ausente) com tooltip
- [ ] Remover/resolver duplicações de endpoints legados (`/api/auth/local/register` versus `/api/auth/register`)
- [ ] Atualizar `.env.example` com placeholders das variáveis necessárias dos novos providers
- [ ] Documentar no topo de `auth.ts` a lógica condicional de inclusão de providers
- [ ] Testar manualmente cada botão (dev) para verificar redirecionamento 302 sem erro imediato

## 2. Modernização Formulário Criar Conta
- [ ] Criar schema Zod compartilhado `src/components/auth/schemas.ts` (RegisterSchema)
- [ ] Criar componente reutilizável `FormularioCriarConta` (react-hook-form + zodResolver)
- [ ] Hook `useRegistrarUsuario` (React Query mutate) centralizando POST /api/auth/register
- [ ] Normalizar mensagens de erro API usando enum/códigos (`src/utils/authErrors.ts`)
- [ ] Auto login pós-registro (submit de form oculto para callback credentials) redirecionando para área cliente
- [ ] Mostrar força da senha (componente barra + label) usando util `passwordStrength.ts`
- [ ] Botão mostrar/ocultar senha e confirmar senha (icones lucide)
- [ ] Desabilitar submit enquanto `isSubmitting || isMutating`
- [ ] Spinner/loading no botão principal
- [ ] Acessibilidade: aria-invalid, aria-describedby, focus no primeiro erro
- [ ] Sanitização: trim, email lowercase, limite de tamanho (nome/email <= 120)
- [ ] Telemetria simples (console.info) registrando sucesso, falha validação e falha servidor
- [ ] Testes unit: força senha, validação mismatch senha, email inválido
- [ ] Teste integração: fluxo sucesso (mock fetch + auto login invocado)
- [ ] Snapshot básico do componente render inicial

## 3. Limpeza / Resíduos
- [ ] Marcar `/api/auth/local/register` como deprecado ou remover após confirmar ausência de referências
- [ ] Procura global por rotas antigas de signin/callback específicas (google/github) para garantir ausência de resíduos
- [ ] Atualizar checklist principal com links para esta tarefa (quando concluída)

## 4. Documentação
- [ ] Comentar cada novo arquivo (header explicativo PT-BR)
- [ ] Adicionar seção README curta sobre novos providers e variáveis
- [ ] Anotar no arquivo esta tarefa com data de conclusão e commit hash

## 5. Critérios de Aceite
- [ ] Build sem erros / Lint zero warnings
- [ ] Testes novos passando
- [ ] Registro cria usuário e executa auto login (sessão visível ao consultar cookie / página autenticada)
- [ ] SocialLoginBox exibe todos os botões e desabilita os não configurados corretamente

---
_Este arquivo será removido ou incorporado ao mega-checklist após a conclusão._
