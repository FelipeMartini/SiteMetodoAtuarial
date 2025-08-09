# 04 - Notificações em Tempo Real

## Objetivo
Melhorar a experiência do usuário com feedback instantâneo e comunicação em tempo real.

## Checklist
- [ ] Integrar [Socket.io](https://socket.io/) ou [Pusher](https://pusher.com/) no backend e frontend
- [ ] Criar contexto global `/contexts/notification` para gerenciamento de notificações
- [ ] Adicionar componente de toast/alerta (Sonner, Toastify)
- [ ] Documentar exemplos de uso e integração
- [ ] Garantir fallback para ambientes sem WebSocket

## Instruções Detalhadas
1. **Backend:**
   - Configure Socket.io/Pusher para emitir eventos de notificação.
2. **Frontend:**
   - Crie contexto global para consumir e exibir notificações.
   - Use componente de toast para feedback visual.
3. **Fallback:**
   - Implemente fallback para polling ou notificações via REST.
4. **Documentação:**
   - Explique como emitir, consumir e contribuir com notificações.

## Referências
- [Socket.io Docs](https://socket.io/docs/v4/)
- [Pusher Docs](https://pusher.com/docs/)
- [Notificações em tempo real Next.js](https://dev.to/abidullah786/real-time-notifications-in-nextjs-using-socket-io-4e5g)
