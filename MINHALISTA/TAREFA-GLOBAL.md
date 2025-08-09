releia suas instruções e siga a risca ok eis a situação, migramos de styled-components para tailwind e shadcn, precisamos investigar a fundo todo codigo do nosso aplicativo site-metodo a procura de residuos e concertar os erros de build, se tiver algo faltando que seja essencial teremos que recriar, mas tendo em mente utilizarmos um estilo global de tailwind e sempre com componentes de shadcn os quais voce deve estilizar para ficarem modernos e atraentes nunca use componentes puros eles devem ser estilizados, como referencia de desing e sistema de templates temos o projeto na pasta fuse-react de la que voce deve tirar o que precisarmos e adaptar aqui para o projeto, nosso projeto antigo antes de utilizar tailwind e shadcn esta na pasta next,js-app , nao realize alterações no projeto next.js-app  e nem no projeto fuse-reac apenas vamos trabalhar no projeto site-metodo e suas correções e reconstrução, temos que revisar por residuos imports quebrados remover tudo de styled components e converter pro modelo atual, é importante ressaltar que temos que ter nosso sistema de temas claro e escuro de acordo com as recomendações do isdarkmode e praticas do shadcn consulte sua fonte para encontrar o toglle e indicações de como usar  temas deles, mas tenha em mente que quermos visualmente algo parecido com nossos projetos antigos fuse-react e next.js-app, busque fontes atualziadadas na internet para cada topico e crie seu checklis de tarefas em andamento num arquivo na pasta tarefas em andamento, alem disso temos um problema grave que é comun e voce tambem deve pequisar na internet que eh um conlfito ao migrar de styled components para shadcn e tailwind, que nao renderiza nada, tem algum contexto global atraplahando e resetando toda renderização fica tudo sem formatação e na la esquerda precisamos resolver prioritariamente os erros de build e esse erro de renderização pesquise afundo analise todos projetos e implemente solcucoes automatizada de forma independente e sem ficar me consultando até nao haver mais erros e a implementação estar 100% completa




arrumanos o packege.json reintalamos todas as dependencias e ainda continuamos com algum problema pode ser mesmo conflito de versao revise tudo a fundo e compare nossas dependencias e insvestigue afundo por conflito de versos e erros de compatibilidade, e tente atualizar todas dependencias que possiveis para suas ultimas versos pode ter algo desatualizado tambem faça uma consulta profunda na internet para ver isso monte seu checklist e certifiquessse de encontrar o problema e resolver por completo de forma automatizada e sem ficar me consultando faça testes experimente ouse 









Bom agora que nosso aplicativo esta rodando novamente e implementamos tailwind e shadcn nosso novo aplicativo fica na pasta site-metodo , nosso aplicativo antigo ainda se encontra na pasta next.js-app e o projeto que estamos usando como referencia para pegar elementos e futuras implementações esta na pasta fuse-react, tenha em mente que temos que pegar elementos de fuse-react adaptarmos e estilizarmos de forma moderna com o shacn o qual voce deve adicionar o componente e estilizar por completo busque na internet exemplos e estilizações modernas para implementar, crie um check list para suas tarefas conforme manda suas instruçoes, releia elas e se atualize, temos uma coisa que eu nao gostei depois de migrarmos é que perdemos o estilo single page aplication agora a pagina inicial eh mais extensa com todos elementos nela mas quando penso em SPA penso que devemos ter um nav bar top com links e nao sair da pagina para recarrregar, temos que ter um componente central onde todas as outras paginas so carregam ail dentro e alteram o DOM apenas sem ter que recarrregar ou sair para outra pagina o sistame de routes e LINK do next, isso precisamos implementar novamente, eu nao sei porque se perdeu esse m enu superior procure nos arquivos do novo projeto site-metodo se o encontra ou algo parecido onde tinhamos os links da area cliente, serviço sobre, contato tudo num menu superiro inclusive o toogle para selecionar o tema, temos que ter em mente que precisamos resgatar ou reestruturar nossos temas claro e escuro e o seletor de tema, isso acho q se perdeu de uma procurada, caso nao econtre nada analise nosso projeto antigo pasta next.js-app e veja como era antes e tente adaptar novamente e tambem use como sua referencia o app do diretorio fuse-react que tmbem tem nav bars elegantes até prefiro que use mais ele como referencia, mas conulte a web tambem com componentes mordernos e estilizaçoes elegantentes e moderna do shadcn nao esqueça de estilizar os componentes adicionados, estude tudo isso a fundo e monte seu plano de açoes e para essas implementaçoes, use https://ui.shadcn.com/docs/dark-mode/next ,, use o seletor de tema "use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
  https://ui.shadcn.com/docs/javascript,  https://ui.shadcn.com/docs/theming , use essas referencias e aprenda https://ui.shadcn.com/docs/cli , e se preciso consulto tambem https://github.com/shadcn-ui/ui para entender como utilizar 







####################################################################
cuidado ao instalar e implementar tanstack/react-query" isso causa erro geral deve ver uma maneira especial de implementar
problema do carregamento rapido e erro do use state

Após pesquisa profunda em fontes oficiais, issues e especialistas, seguem os achados e próximos passos práticos:

1. Diagnóstico Profundo
Erro useState is not a function no build/prerender: ocorre quando um componente ou hook client-side (que depende de React no browser) é executado no server-side durante o build/prerender. Isso pode ser causado por:

Importação cruzada de hooks/client components em arquivos server.
Uso de React Query (useQuery, useQueryClient) fora de um provider ou em contexto server.
SSR não desabilitado corretamente em imports dinâmicos.
Alguma dependência (ex: TanStack Query) não sendo corretamente isolada do lado do servidor.
Não há issues abertas no TanStack Query ou Next.js que resolvam esse erro para React 19/Next 15. O padrão recomendado é isolar tudo que usa hooks em componentes client-only e garantir que nada disso seja importado em server components.

2. Teste prático sugerido por especialistas
Remover temporariamente o uso do React Query/TanStack Query do dashboard-admin para isolar o problema. Se o erro sumir, o problema está na integração do React Query com o SSR/prerender do Next.js.

3. Próximos passos práticos
A) Remover React Query do DashboardAdmin para teste
Vou editar o arquivo DashboardAdmin.tsx para:

Remover todos os imports e usos de useQuery, useQueryClient e TanStack Query.
Substituir por um carregamento simples (ex: useEffect + fetch + useState).
Manter o restante da lógica para garantir que a página renderize.
Após isso, rode o build novamente. Se o erro sumir, confirmamos a causa.

B) Se resolver, podemos:
Reimplementar o carregamento de dados apenas client-side (sem React Query).
Ou buscar workarounds para usar React Query apenas no client, nunca no server/prerender.
Vou iniciar a alteração agora.

DashboardAdmin.tsx+32-19
Removi todo o uso do React Query/TanStack Query do DashboardAdmin.tsx e substituí por um carregamento simples com useEffect + fetch + useState. Agora, o componente não depende mais de providers ou hooks avançados — está 100% client-only.

Próximos passos:

Rode novamente o build (npm run build).
Se o erro sumir, confirmamos que o problema era a integração do React Query com o SSR/prerender.
Se o erro persistir, o problema está em outro ponto.
Se o build passar, podemos reimplementar o carregamento de dados apenas client-side, sem React Query, ou buscar um workaround seguro para uso do React Query apenas no client.

Por favor, rode o build e me envie o resultado.

#################################################################################







entao busque na internet sobre o assunto de como personalizar a pagina not found procure tambem por paginas notfound estilizadas com shadcn e crie uma para nos com componentes modernos e estilizados que voce estilize mas busque por exemplos e desenvolva essa pagina conforme recomenda na web, e utilize entao o como server component sem use cliente, implemente isso segundo nossos temas e personalizaçoes e caracteristicas do nosso projeto de consultoria atuarial






AGPRA ESTUDE A FUNDO E ANALISE A FUNDO O PROJETO fuse-react e vamos começar a desenvolver consultando outros projetos parecidos com CRUD e dashboard admin e sistema de usuarios completos, consulte fontes na web exemplos dependencias tudo que há de mais modernos para realizar esse desenvolvimento em nosso aplicativo seguindo a estrutura e dependencias que ja temos , mas inovando e utilizando pacotes e codegios de comunidade ativa e inovadora de referencia e relevancia no mercado, bole um plano extenso e bem dividido com etapas intermediarias viando a completa adaptação e implementação utilizando tailwind e shadcn com componentes estilizados inovadores seguindo padrao do nosso projeto, cri e organize arquivos de instruções checlist e demais passos para uma boa implementação, simule que voce ira criar arquivos passo a passos e check bocks para outro time realizar a tarefa, entao seja bem descritovo mas ao mesmo tempo objetivo referenciando bibliotecas exemplos de codigos de implementação , documente tudo muito bem documentado e oganizado dentro da pasta MINHALISTA/PLANOCRUD enumere as tarefas e caminhos a ser seguidos para que multaplas equipes entenda e acompanhem o processo e possam contrinbir de forma conjuta e dinamica seja criativo e inovador utilizando as tecnicas mais modernas e que simplifiquem a implementção











