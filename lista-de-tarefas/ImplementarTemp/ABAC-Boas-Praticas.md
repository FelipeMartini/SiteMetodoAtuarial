
          INSTRUÇOES DE SUAS TAREFAS PRINCIPAIS DESENVOLVA AS INTERMEDIARIA



  1 - [ ] Corrigir erro de build e melhorar a admin dashboard page adicione barra de navegação lateral na esquerda com menus e funcionalidades crie outras subpaginas para ela com os logs dos usuarios e veja o que mais que existe em uma dashboard admin e adicione elementos shadcn darkmode e modoclaro e nao esqueça de estilizar os componentes busque no github do shadcn O ERRO  ele trata do carregamento da tabela de usuarios, já tentamos de tudo resolva de forma aprofundada e busque fontes na internet, segue o erro aseguir:Após uma pesquisa exaustiva em mais de 10 fontes, incluindo discussões, issues, PRs e exemplos do GitHub, ficou claro:

Auth.js v5 Beta (NextAuth v5) – Uso Moderno
Não existe mais SessionProvider: O contexto de sessão é global e automático, não sendo necessário (nem permitido) envolver a aplicação com um provider.
O hook useSession pode ser usado diretamente em componentes client-side, desde que estejam marcados com 'use client'.
O erro de destructuring (Cannot destructure property 'data' of ... as it is undefined) ocorre quando:
O hook é chamado em ambiente server-side (SSR/prerender) ou em componente não-client.
O hook é chamado fora do contexto de uma rota/app que está corretamente configurada para rodar apenas no client.
O hook é chamado em um componente que é importado de forma errada (ex: importação cruzada entre client/server).
Pontos-chave da documentação e exemplos modernos
O hook useSession NUNCA deve ser chamado em componentes server-side, nem em layouts, nem em arquivos sem 'use client'.
O erro ocorre no build/prerender porque o Next.js tenta executar o componente no server, mas o contexto de sessão não existe nesse ambiente.
Solução oficial: Garanta que todo componente que usa useSession:
Tem 'use client' na primeira linha.
Não é importado ou usado em layouts/server components.
Não é chamado em rotas que usam SSR/prerender.
Não existe mais provider manual: O contexto é global, mas só existe no client.
Exemplo correto (Auth.js v5+):
O que NÃO fazer:
Não usar useSession em layouts, root layout, arquivos sem 'use client', nem em componentes server.
Não envolver a aplicação com SessionProvider (isso é legado, não existe mais no v5).


 Error occurred prerendering page "/area-cliente/dashboard-admin". Read more: https://nextjs.org/docs/messages/prerender-error
TypeError: Cannot destructure property 'data' of '(0 , d.wV)(...)' as it is undefined.
    at e (.next/server/app/area-cliente/dashboard-admin/page.js:3:11215)
    at I (.next/server/app/area-cliente/dashboard-admin/page.js:2:4844) {
  digest: '1278867052'
}
Export encountered an error on /area-cliente/dashboard-admin/page: /area-cliente/dashboard-admin, exiting the b
  2 - [ ] CRIAR UMA NOVA AREA/MODULO CHAMADA CALCULOS ATUARIAIS, DESENVOLVA ELA DE FORMA COMPLETA, DEVE TER UM ESPAÇO PARA IMPORTAR E EXPORTAR ARQUIVOS DO EXCEL CSV E PDF, CRIAR UMA BARRA DE NAVEGAÇÃO NA ESQUERDA COM ITENS DE EXEMPLO QUE FAÇAN SENTIDO, NO CENTRO DA PAGINA DEVE TER UM CAMPO DE TABELAS PARA MOSTRAR AS TABELAS IMPORTADAS E POSSIBILIDADE DE EDIÇÃO, DEVE SER GERADO TODOS CAMPOS IMPORTADOS DA TABELA EXCEL, QUE SERA UMA MASSA DE PARTICIPANTES COM IDADES MATRICULA DATADE NSCIMENTO OPCIONAL, SEXO E OUTRAS INFORMAÇOES, DEVE HAVER PAGINAÇÃO E FILTROS E TER TODOS CONTROLES QUE SE TERIA EM UMA PLANILHA EXCEL ORGANIZAR ITENS O QUE HÁ DE MAIS MODERNO EM TABELAS E SUAS OPÇOES MODERNAS DA ATUALIZADE SE NECESSÁRIO INSTALE MAIS DEPENDENCIAS, DE PREFERENCIA ADAPTE PARA REGISTRAR TUDO COM ZUSTAND POIS VAMOS TER QUE USAR ESSES DDOS EM VARIAVEIS PARA EFETUARMOS CALCULOS E EXIBIR RELATORIOS, MAS JA PREVEJA TODA FLEXIBILIDADE, PROCURE POR CALCULOS ATUARIAIS JAVASCRIPT PARE ENTENDER QUE TIPO DE CALCULOS VAMOS FAZER, APURANDO MORTALIDADE, TABUAS ATUARIAIS, EXPECTATIVA DE VIDA, CALCULO DE RESERVA DE APOSENTADORIA E VEJA MODELOS E COISAS QUE POSSSAM ILUSTRAR E NOS AJUDAR, TENTE DESENVOLVER DE FORMA COMPLETA JA COM EXEMPLOS DEMONSTRANDO COMO FICARIA, PODE INSERIR DADOS ALEATORIOS POR ENQUANTO, MAS JA DEIXE PARA PODER IMPORTAR E EXPORTAR OS DADOS REAIS.
  
    3 - [ ] CONVERTER SISTEMA DE ROLES E PAGINAS PROTEGIDAS PARA SISTEMA ABAC COM CASBIN, PARA ISSO HÁ UM ARQUIVO lista-de-tarefas/ImplementarTemp/ABAC-CASBIN.md ONDE ESTAO SUAS INSTRUÇÕES, SIGA DE FORMA COMPLETA ADAPTANDO PARA NOSSO CENARIO CONSULTE AS FONTES PARA SE INFORMAR, ANALISE TOTALMENTE NOSSO PROJETO E CENARIO PARA NAO QUEBRAR NENHUM SISTEMA QUE JA EXISTE COMO AUTH.JS V5 PURO BETA CREDENCIAIS LINKED PRISMA ADAPTER, com Middleware, speakeasy,  Prisma e prisma adapter, SQLite, sem SessionProvider, e integração com Zustand, ZOD, RATE LIMMIT, PROVEDORES SOCIAIS, E DEPOIS INPLEMENTE JA NA PAGINA CLIENTE E NA PAGINA ADMIN CRIANDO ESSES ATRIBUTOS COM NIVEIS CADA UM, ADMIN MODERADO, USER MAS CADA UM COM SEUS NIVEIS E ATRIBUIÇÕES SEJA CRIATIVO IMPLEMENTE DE FORMA COMPLETA


    -----------------------------------------------------------------------------

    RECOMENDAÇOES GERAIS, 

    O PROBLEMA NÃO PODE SER RESOLVIDO SEM PESQUISA EXTENSIVA NA INTERNET.

Você deve usar a ferramenta fetch_webpage para coletar recursivamente todas as informações das URLs fornecidas pelo usuário, assim como quaisquer links que encontrar no conteúdo dessas páginas. 
Busque quaisquer URLs fornecidas pelo usuário usando a ferramenta `fetch_webpage`.
- Use a ferramenta `fetch_webpage` para pesquisar no Google buscando a URL `https://www.google.com/search?q=sua+consulta+de+pesquisa`.
- Use a ferramenta `get_errors` para verificar quaisquer problemas no código
- Sempre utilize a ferramenta fetch para consultar o uso mais recente de componentes, nome de instalação e melhores práticas diretamente na documentação oficial do shadcn/ui: https://ui.shadcn.com/docs/components
- Não confie no que você acha que sabe sobre os componentes shadcn/ui, pois eles são frequentemente atualizados e melhorados. Seus dados de treinamento estão desatualizados.
- Para qualquer componente shadcn/ui, comando CLI ou padrão de uso, busque a página relevante na documentação e siga as instruções de lá.


NAO ESQUEÇA QUE VOCE DEVE PERSONALIZAR E ESTILIZAR OS COMPONENTES DO SHADCN DE ACORDO COM NOSSO TEMA BLACK E TEMA CLARO, CUIDE DO DESING E UTILIZE ESTILO MODERNO
**Princípios Centrais:**
- Os componentes shadcn/ui são código aberto: espera-se que você leia, modifique e estenda-os diretamente.
- Use o CLI (`pnpm dlx shadcn@latest add <component>`) para adicionar ou atualizar componentes.
- Sempre importe do caminho local `@/components/ui/<component>`.
- Siga as melhores práticas de acessibilidade e composição conforme descrito na documentação.

**Resumo:**
> Para todo trabalho com shadcn/ui, sempre utilize a ferramenta fetch para consultar a documentação e o uso mais recente dos componentes em https://ui.shadcn.com/docs/components. Não confie em instruções estáticas.







  4 - [ ] Testes automatizados
  5 - [ ] Evolução contínua
  6 - [ ] Performance
  7 - [ ] Documentação
  8 - [ ] Comunidade e suporte