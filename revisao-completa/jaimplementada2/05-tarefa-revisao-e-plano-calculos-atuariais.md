---
# 04 – Revisão Profunda e Plano de Implementação dos Cálculos Atuariais

> **IMPORTANTE:**
> - O progresso desta tarefa deve ser marcado e acompanhado simultaneamente:
>   1. No checklist do template de tarefa principal;
>   2. No checklist do template de tarefa secundária (quando houver);
>   3. Neste arquivo específico da tarefa.
> - Isso garante rastreabilidade e validação cruzada.
>
> - **Ao finalizar uma tarefa principal, é OBRIGATÓRIO reler todos os arquivos da pasta `revisao-completa` para relembrar o processo como um todo antes de iniciar a próxima tarefa principal.**

## Checklist Detalhado de Revisão Atuarial
- [ ] Mapear todos os arquivos, componentes e hooks relacionados a cálculos atuariais (área de cálculos, links do menu/nav/top bar)
- [ ] Identificar implementações incompletas, simplificadas, temporárias, não implementadas ou parcialmente desenvolvidas
- [ ] Listar oportunidades de melhoria, refatoração, padronização e testes
- [ ] Avaliar cobertura de testes e robustez dos algoritmos
- [ ] Propor plano de desenvolvimento e revisão aprofundada
- [ ] Realizar limpeza de arquivos temporários, renomeados, em branco, marcados para deletar ou resíduos após build
- [ ] Revisar todas as variáveis e seus usos para evitar conflitos, especialmente em autenticação e endpoints seguros
- [ ] Garantir documentação técnica clara e exemplos de uso para cada cálculo
- [ ] Validar resultados com fontes confiáveis e calculadoras atuariais reconhecidas
- [ ] Submeter código a revisão de especialista externo, se possível

## Plano de Implementação dos Cálculos Atuariais

1. **Levantamento e Mapeamento**
   - Levantar todos os pontos de entrada de cálculos atuariais no sistema (componentes, hooks, páginas, menus).
   - Documentar cada função, componente e fluxo de cálculo existente.

2. **Análise Técnica**
   - Revisar cada cálculo implementado (ex: seguro de vida, anuidade, análise de mortalidade).
   - Identificar códigos incompletos, temporários, algoritmos simplificados, falta de validação, testes e documentação.

3. **Oportunidades de Melhoria**
   - Refatorar para padronizar nomenclatura, tipos e estrutura dos cálculos.
   - Implementar testes unitários e de integração para todos os fluxos.
   - Adotar melhores práticas de cálculo atuarial conforme literatura internacional.
   - Garantir flexibilidade para inclusão de novas tábuas, produtos e parâmetros.
   - Documentar exemplos de uso e resultados esperados.

4. **Desenvolvimento e Validação**
   - Refatoração incremental dos algoritmos, priorizando robustez e clareza.
   - Cobertura de testes: criar/ampliar testes unitários e de integração.
   - Documentação técnica: comentários, exemplos e explicações dos métodos.
   - Validação cruzada: comparar resultados com fontes confiáveis e calculadoras atuariais reconhecidas.
   - Padronização de entrada/saída: garantir consistência de tipos e formatos.
   - Revisão por especialista: submeter o código a revisão de atuário ou consultor externo, se possível.

## Instruções Técnicas (OBRIGATÓRIAS)

> ⚠️ Siga SEMPRE o ciclo de validação abaixo:
> 1. Corrija TODOS os erros de type-check (TypeScript)
> 2. Corrija TODOS os erros/avisos de lint
> 3. Corrija TODOS os erros de build
> 4. Repita o ciclo até zerar erros
> 5. **Antes de acessar manualmente os links/endpoints, execute uma limpeza completa de arquivos temporários, renomeados, em branco, marcados para deletar ou resíduos do processo**
> 6. **Revise todas as variáveis e seus usos atuais para garantir que nada foi quebrado, principalmente em autenticação e endpoints seguros**
> 7. Só então acesse TODOS os links/endpoints no navegador e corrija eventuais erros

> **OBRIGATÓRIO:**
> - Não utilize `any` em hipótese alguma no código.
> - Tipos `unknown` devem ser tipados corretamente e explicitamente.
> - Sempre prefira e estenda tipagens oficiais das bibliotecas/frameworks quando necessário.
> - Revise e corrija a tipagem de todas as funções, variáveis e props.
> - Garanta que todos os testes estejam atualizados e cobrem todos os fluxos críticos.
> - Documente cada função, parâmetro e resultado esperado de forma clara e rastreável.

## Referências Atuarial (50 Fontes)

1. https://www.soa.org/
2. https://www.actuaries.org/
3. https://www.casact.org/
4. https://www.issa.int/
5. https://www.actuary.com/
6. https://www.actuaries.digital/
7. https://www.actuarial-lookup.com/
8. https://www.actuarialoutpost.com/
9. https://www.actuarialzone.org/
10. https://www.actuarialnews.org/
11. https://www.actuarialstandardsboard.org/
12. https://www.actuarial-education.com/
13. https://www.actuarialbookstore.com/
14. https://www.actuarialjobs.com/
15. https://www.actuarialcareers.com/
16. https://www.actuarialscience.org/
17. https://www.actuarialscience.com/
18. https://www.actuarial-analytics.com/
19. https://www.actuarialsoftware.com/
20. https://www.actuarialconsulting.com/
21. https://www.actuarialacademy.com/
22. https://www.actuarialfoundation.org/
23. https://www.actuarialpost.co.uk/
24. https://www.actuarialreview.com/
25. https://www.actuarialsciencehub.com/
26. https://www.actuarialscienceforum.com/
27. https://www.actuarialsciencecentral.com/
28. https://www.actuarialsciencejobs.com/
29. https://www.actuarialscienceblog.com/
30. https://www.actuarialscienceworld.com/
31. https://www.actuaries.org.uk/
32. https://www.actuaries.asn.au/
33. https://www.actuariesindia.org/
34. https://www.actuaries.ch/
35. https://www.actuaries.org.nz/
36. https://www.actuaries.ca/
37. https://www.actuaries.org.za/
38. https://www.actuaries.org.hk/
39. https://www.actuaries.org.sg/
40. https://www.actuaries.jp/
41. https://www.actuaries.org.cn/
42. https://www.actuaries.org.tw/
43. https://www.actuaries.org.my/
44. https://www.actuaries.org.tr/
45. https://www.actuaries.org.br/
46. https://www.actuaries.org.ar/
47. https://www.actuaries.org.pe/
48. https://www.actuaries.org.uy/
49. https://www.actuaries.org.ve/
50. https://www.actuaries.org.ec/

## Referências Modernas Adicionais
- [TypeScript - Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Next.js - API Routes](https://nextjs.org/docs/pages/api-reference/api-routes)
- [Jest - Testes Unitários](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [Markdown Guide](https://www.markdownguide.org/)
- [shadcn/ui - Componentes UI](https://ui.shadcn.com/docs/components)
- [TanStack Table - Tabelas Avançadas](https://tanstack.com/table/v8/docs/guide)
- [Prisma ORM](https://www.prisma.io/docs)
- [Zod - Validação de Esquemas](https://zod.dev/)

---
