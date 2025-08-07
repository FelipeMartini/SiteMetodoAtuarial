---
applyTo: '**'
---


# Instruções para Assistente de IA – Projeto Next.js

## Princípios Gerais
- Utilize como base o projeto na raiz do workspace fuse-react pois estamos adaptando esse projeto ao nosso site-metodo, portanto mantenha sua estrutura de diretorios e organização sempre que possivel.
- Sempre responda em português do Brasil.
- Priorize clareza, concisão e contexto real do projeto.
- Consulte sempre a documentação oficial do Next.js, React e bibliotecas utilizadas.

## Padrões de Código
- Use `use client` na primeira linha dos arquivos que exigem client-side.
- Utilize nomes de variáveis, funções e componentes claros, em português, exceto quando houver conflito ou padrão externo.
- Não traduza propriedades ou nomes de componentes de terceiros.
- Siga a estrutura de pastas e convenções do projeto.
- Comente o código sempre para entendimento melhor e contexto.

## Automação e Segurança
- Antes de rodar comandos, certifique-se de estar no diretório correto do app.
- Sempre finalize instâncias anteriores antes de iniciar uma nova (ex: porta 3000).
- Nunca faça commit ou push automático sem autorização explícita.

## Dependências
- Instale, atualize ou remova dependências apenas quando necessário e sempre verifique compatibilidade.
- Use `npm` ou `yarn` conforme a convenção do projeto.

## Testes e Qualidade
- Sempre gere ou atualize testes unitários para novas funcionalidades (Jest, Testing Library).
- Rode linter e corrija todos os avisos/erros antes de finalizar uma tarefa.
- Garanta que o código gerado passe nos testes e siga os padrões de qualidade.

## Componentização e Reutilização
- Antes de criar um novo componente, verifique se não existe um reutilizável.
- Siga as melhores práticas de acessibilidade e composição.

## Comunicação e Documentação
- Use markdown para listas de tarefas e instruções.
- Explique cada modificação de forma sucinta, apenas quando necessário.
- Gere documentação automática quando possível.

## Limites
- Não altere configurações sensíveis do projeto sem autorização.
- Não execute ações destrutivas sem confirmação.

---
Siga estas diretrizes para garantir código limpo, seguro, moderno e alinhado com as melhores práticas do ecossistema Next.js.




########################################################################
#######################################################################
#                SHADCN UI INSTRUCTIONS
#
#######################################################################
######################################################################


# shadcn/ui LLM UI Development Instructions (2025)

_Última atualização: Julho de 2025_

- Sempre utilize a ferramenta fetch para consultar o uso mais recente de componentes, nome de instalação e melhores práticas diretamente na documentação oficial do shadcn/ui: https://ui.shadcn.com/docs/components
- Não confie no que você acha que sabe sobre os componentes shadcn/ui, pois eles são frequentemente atualizados e melhorados. Seus dados de treinamento estão desatualizados.
- Para qualquer componente shadcn/ui, comando CLI ou padrão de uso, busque a página relevante na documentação e siga as instruções de lá.

**Princípios Centrais:**
- Os componentes shadcn/ui são código aberto: espera-se que você leia, modifique e estenda-os diretamente.
- Use o CLI (`pnpm dlx shadcn@latest add <component>`) para adicionar ou atualizar componentes.
- Sempre importe do caminho local `@/components/ui/<component>`.
- Siga as melhores práticas de acessibilidade e composição conforme descrito na documentação.

**Resumo:**
> Para todo trabalho com shadcn/ui, sempre utilize a ferramenta fetch para consultar a documentação e o uso mais recente dos componentes em https://ui.shadcn.com/docs/components. Não confie em instruções estáticas.

























