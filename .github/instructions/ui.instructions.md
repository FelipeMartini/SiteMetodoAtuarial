---
applyTo: '**'
---

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