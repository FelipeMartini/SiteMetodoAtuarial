---
applyTo: '**'
---

# Mapeamento de Jornadas Principais do Usuário – Área Cliente

## Objetivo
Documentar as principais jornadas do usuário final na área cliente, servindo de referência para arquitetura, UX e implementação incremental.

## Jornadas Principais

1. **Onboarding**
   - Primeiro acesso após cadastro/login
   - Orientação inicial (boas-vindas, tour, checklist de perfil)
   - Sugestão de completar perfil e ativar MFA

2. **Perfil**
   - Visualizar e editar dados pessoais (nome, email, foto)
   - Alterar senha
   - Gerenciar preferências (tema, idioma, notificações)
   - Visualizar status de verificação de email

3. **Segurança**
   - Ativar/desativar MFA (TOTP, WebAuthn)
   - Gerar/visualizar códigos de backup
   - Listar e revogar sessões/dispositivos ativos
   - Histórico de acessos e atividades recentes

4. **Billing (Futuro)**
   - Visualizar plano atual e histórico de pagamentos
   - Gerenciar métodos de pagamento
   - Emitir faturas/recibos
   - Upgrade/downgrade de plano

5. **Widgets de Resumo**
   - Atalhos para ações rápidas (editar perfil, ativar MFA, sair)
   - Status de MFA, sessões, últimas atividades

6. **Feedback e Mensageria**
   - Toasts e alerts para sucesso, erro, avisos
   - Mensagens acessíveis (aria-live)

## Observações
- Todas as jornadas devem ser acessíveis, responsivas e seguir o design system (shadcn/ui).
- Preferir hooks dedicados para cada domínio (ex: useCurrentUser, useSessions, useMfaStatus).
- Mensageria unificada para feedbacks.
- Billing pode ser implementado em fase futura, mas a arquitetura deve prever expansão.

---
Atualize este documento conforme novas jornadas forem identificadas ou alteradas.
