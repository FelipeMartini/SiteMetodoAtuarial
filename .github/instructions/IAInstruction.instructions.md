---
applyTo: '**'
---
Forneça contexto do projeto e diretrizes de codificação que a IA deve seguir ao gerar código, responder perguntas ou revisar alterações.

# Instruções adicionais para o assistente:
  - Sempre responda ao usuário em português do Brasil.
  - Sempre cuida para nao traduzir propriedades de componentes de terceiros para nao gerar comflitos.
  - Sempre utilize nomes de variáveis, funções, componentes, diretórios e arquivos que façam sentido e estejam em português do Brasil, priorizando clareza e significado, mas so quando possivel e nao for gerar conflito.
  - Sempre navegue até o diretório do aplicativo (ex: cd nextjs-app) antes de executar qualquer comando relacionado ao app.
  - Sempre que adicionar codigos e realizar adições adicione comentarios explicando cada modificação assim como explicação do que cada parte e função esta fazendo.
- Sempre apos terminar uma tarefa revise se nao possui erros e inconsistencias caso exista repida esse passo revisando e corrigindo o erro, até que não exista mais erros ou inconsistências.
- Sempre que criar novas funcionalidades crie testes unitários para garantir que o código funcione corretamente e que as funcionalidades estejam cobertas. Utilize bibliotecas de testes como Jest ou Mocha, conforme a convenção do projeto.
- Sempre que for necessário criar um novo componente, verifique se ele é realmente necessário e se não há um componente já existente que possa ser reutilizado. Utilize a convenção de nomenclatura do projeto para nomear o novo componente.
- Sempre que possível, utilize comentários explicativos no código para facilitar o entendimento.
- Sempre antes de rodar uma nova instancia finalize todas instancias anteriores, para evitar conflitos e garantir que a nova instancia seja executada corretamente e na porta padrão.
- Sempre verifique se não tem outra instancia em execução e se a porta padrão 3000 esta livre caso necessário finalize todas instancias anteriores.
- Sempre que for necessário instalar uma dependência, verifique se ela é realmente necessária e se não há uma dependência já instalada que possa ser utilizada. Utilize o comando `npm install` ou `yarn add` conforme a convenção do projeto.
- Sempre que for necessário atualizar uma dependência, verifique se a nova versão é compatível com o projeto e se não há problemas conhecidos. Utilize o comando `npm update` ou `yarn upgrade` conforme a convenção do projeto.
- Sempre que for necessário remover uma dependência, verifique se ela não é mais utilizada no projeto e se não há outras dependências que dependem dela. Utilize o comando `npm uninstall` ou `yarn remove` conforme a convenção do projeto.





























