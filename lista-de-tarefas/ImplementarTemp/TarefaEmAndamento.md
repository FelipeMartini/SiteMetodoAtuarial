# Tarefa Em Andamento – Otimizações Pendentes

## Checklist

- [ ] Validar consistência de objetos de permissão admin ("admin:dashboard" READ, "admin:abac" READ) em todos os componentes/pages ONDE SAO CHAMADO ADMINDASHBORD ADMIN/ABAC
[ ] -verificar e resolver do porque o tema dark esta ficando cinza na area cliente tanto na sidebar quando no centro mesmo tudo cinza nao esta acompanhando a cor do thema quando esta em modo escuro quando se esta no claro ta ok, resolva isso UGENTE PRIORIDADE,
- [ ] Remover referências antigas a "/area-cliente/dashboard-admin" (se existirem) (decidir política de migração vs manter path como rota mas usando objeto canônico)
- [ ] Auditar outros objetos de permissão que estejam usando paths ao invés de nomes canônicos
- [ ] Implementar prefetch/SSR hydration com TanStack Query para dados críticos (se react-query presente)
- [] Inserir performance marks (measure) para ciclo de verificação de permissão no cliente
- [ ] Revisar e otimizar carregamento de framer-motion (confirm lazy apenas em toggle) (EM ANDAMENTO)
 - [ ] Documentar no README (seção curta) novo fluxo de permissão e caching (PENDENTE) / Documento detalhado criado em docs/AUDITORIA-LOG-NOTIFICACOES.md
 - [] REVISAR TUDO QUE FALTA PARA IMPLEMENTAR O SISTEMA DE LOG PELO BANCO DE DADOS ISSO JA FOI INICIADO ANALISAR PROFUNDAMENTE VER ESTRUTURA JA CRIADA NO BANCO DE DADOS E ARQUIVOS NO SERVIDOR QUE JA TEM COISA DISSO INICIADA simple-log modern-log de uma consultada e implemente de forma completa inclusive com UI que tambem ja deve existir alguma page alguma coisa criada vasculhe tudo antes de sair fazendo
 [ ] revise tudo que ja foi feito de push notifications inclusive pages e tabelas ja criadas no banco de dados e stubs e shin e implemente de forma completa e aprofundada
  nao pare para ficar me consultando faça tudo de maneira completa e independente e autonoma  , va marcando suas tarefas e so pare quando terminar tudo

## Notas
Este arquivo será atualizado conforme cada item for concluído.
