
---
applyTo: '**'
---

AQUI ESTAO SUAS TAREFAS PRINCIPAIS DESMBEBRE ELAS EM PEQUENAS SUBTAREFAS E EXECUTE TODAS, A CADA TAREFA  PRINCIPAL CONCLUIDA, REVISE SUAS TAREFAS PRINCIPAIS NO ARQUIVO TAREFAS EM ANDAMENTO PARA VER SE NAO FOI INCLUIDA NOVAS E EXECUTE TODAS INCLUSIVE AS NOVAS ATE COMPLETAR TUDO, UTILIZE UM ARQUIVO CHAMADO TAREFAS-SECUNDARIAS PARA COMPOR SEU CHECKLIST DE TAREFAS SECUNDARIAS E IR MARCANDO AS CONCLUIDAS.

- [x] 1. Corrigir todos os erros de lint até que não haja mais avisos ou falhas.
- [ ] 2. Corrigir todos os erros de TypeScript até que não haja mais avisos ou falhas.
- [ ] 3. Corrigir todos os erros de build até que não haja mais falhas.
- [ ] 4. Otimizar o carregamento do menu superior para que os links de área do cliente, admin dashboard, mensagem "Olá, nome do cliente" e o seletor de tema carreguem mais rápido.
- [ ] 5. Analisar a fundo o projeto e identificar oportunidades de melhoria de performance e carregamento, utilizando lazy loading e carregamento seletivo de itens pesados como página do cliente e admin dashboard.
- [ ] 6. Corrigir o sistema de dark mode do link "Admin Dashboard" no menu superior, garantindo boa visibilidade no modo escuro e identificar disposicao meio torta para direita em funcao de alarecer um seletor com a imagem do usuario e seu email meio perdido la pra baixo da pagina deslocando a pagina central para direita, e tambem recise pois temos um erro que ao dar zoom com mouse o menu superior corre para a eswuerda enquanto o componente central das paginas corre para direita quando se aumenta o zool vai um para cada lado, acredito q em todo projeto nao apenas na parte de admin dashboard.
- [ ] 7. Alterar para que, ao abrir o site em celular, o menu superior mostre o item de login ao invés do link de criar conta.
- [ ] 8. implemente e desenvolva a pagina /serviços seja criativo e de acordo com nosso projeto uma empresa de consultoria atuaria focada na area de previdencia complementar fechada, aproveite e crie uma pagina para mostrar quem sao os profissionais que trabalham na empresa com seus cargos, um deles é o felipe teixeira martini diretor atuario, outro é edson pereira atuario, e o outro atuario é luiz alberto macalão crie um espaço para adicionar a fotos deles e uma ja crie uma descrição de exemplo da trajetoria de cada um academica e curriculo.
- [ ] 9. Atualizar a documentação do projeto de forma completa, unifique e remove o que estiver desatualizado , atualizando o que for necessario e corrigir o que ja nao estivar mais em desacordo com o projeto, revise todos os pontos para isso.
- [ ] 10. Revisar todo nosso sistema de permissoes hibrido de RBAC e ABAC para que tenhamos apenas ABAC, portanto remova o sistema de roles (RBAC) e transformar apenas em ABAC, certifique de manter as mensas condiçoes e regras que eram do RBAC ou seja troque acess level e role por IsAdmin ou algo que faça sentido, alterando nos endpoints seguro a cechagem assim como no user session e todo sistema do auth.js puro v5 com multifator zod prisma adapter, cuide para nao quebrar nada adeque tudo para que nenhum ponto que ja existe seja quebrado, faça uma analise profunda e completa.
- [ ] 11. Implementar sistema de log de usuários e auditoria de forma completa, revisando o que já existe e adaptando/complementando para registrar todas as ações dos usuários.