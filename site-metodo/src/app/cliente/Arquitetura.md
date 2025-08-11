# Arquitetura da Área Cliente – Estrutura de Páginas e Navegação

## Estrutura de Diretórios

- `/cliente` (layout base, widgets de resumo)
  - `/perfil` (dados pessoais, preferências)
  - `/seguranca` (MFA, sessões, histórico)
  - `/sessoes` (dispositivos conectados)
  - `/billing` (futuro)

## Navegação

- Sidebar fixa (desktop) com links para cada página
- Layout responsivo, mobile-first
- Providers globais: sessão, tema, toasts

## Providers

- `SessionProvider` (contexto global de sessão)
- `ThemeProvider` (tema light/dark)
- `Toaster` (feedback global)

## Padrões

- Todos os hooks e componentes reutilizam shadcn/ui
- Mensageria unificada (toasts, alerts)
- Acessibilidade e responsividade garantidas

## Próximos Passos

- Implementar hooks useSessions, useMfaStatus, useAuditLogs
- Integrar widgets reais nas páginas
- Adicionar testes unitários e de integração
- Documentar flows e decisões

---

Atualize este documento conforme a área cliente evoluir.
