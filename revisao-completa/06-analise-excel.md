---
# 06 – Análise Profunda de Excel: Integração Next.js, Node.js (exceljs) e Python (openpyxl)

> **ATENÇÃO:**
> - Esta tarefa já foi iniciada! Procure por "analise-excel" e verifique o que já foi implementado, melhorando, adaptando, inovando, modernizando e estilizando conforme o projeto e o tema.
> - **É OBRIGATÓRIO implementar as duas opções de importação/análise:**
>   1. **Node.js/Next.js usando exceljs** (já iniciado, deve ser aprimorado)
>   2. **Python usando openpyxl** (importador profundo, integração via API backend)
> - **Inicialmente, deve-se conseguir importar e analisar os dois arquivos Excel abaixo como teste, mesmo sem ação do usuário:**
>   - `revisao-completa/MASSA ASSISTIDOS EA.xlsx`
>   - `revisao-completa/MORTALIDADE APOSENTADOS dez 2024 2019 A 2024 FELIPE qx masc e fem (Massa Janeiro).xlsx`
> - Após conseguir ler variáveis e fórmulas desses arquivos, gere um arquivo com todos os dados e todas as fórmulas comentadas obrigatoriamente.

---

## Objetivo Geral
Unificar, modernizar e documentar o fluxo de análise de arquivos Excel, garantindo integração robusta entre Next.js, Node.js (exceljs) e Python (openpyxl), com exemplos práticos, documentação clara e testes reais usando os arquivos fornecidos.

---

## Checklist Unificado
- [ ] Importar e analisar os dois arquivos Excel de exemplo (caminhos acima), mesmo sem ação do usuário
- [ ] Implementar leitura de dados e fórmulas usando `exceljs` (Node.js/Next.js)
- [ ] Documentar limitações e avaliar resultados do exceljs
- [ ] Implementar importador profundo em Python usando `openpyxl` (script separado)
- [ ] Integrar chamada do script Python via API backend (Node.js `child_process`)
- [ ] Garantir retorno em JSON para fácil consumo pelo frontend
- [ ] Criar página separada para upload de arquivo, chamada da API e exibição dos dados/fórmulas
- [ ] Exibir dados e fórmulas em tabela, com destaque para células com fórmulas
- [ ] Permitir download do relatório extraído (CSV/JSON)
- [ ] Gerar arquivo com todos os dados e todas as fórmulas comentadas dos arquivos de exemplo
- [ ] Documentar todo o fluxo, dependências e instruções de uso
- [ ] Ajustar e otimizar conforme feedback dos testes
- [ ] Realizar limpeza de arquivos temporários, renomeados, em branco, marcados para deletar ou resíduos após build
- [ ] Revisar todas as variáveis e seus usos para evitar conflitos, especialmente em autenticação e endpoints seguros
- [ ] Garantir documentação técnica clara e exemplos de uso para todos os fluxos
- [ ] Validar integração com testes unitários e de integração
- [ ] Submeter código a revisão de especialista externo, se possível

---

## Plano de Implementação Unificado

### 1. Importação Estática Inicial
- Implemente scripts (Node.js e Python) para importar e analisar os dois arquivos Excel de exemplo.
- Gere um arquivo de saída (JSON/CSV) com todos os dados e fórmulas extraídas, comentando cada fórmula encontrada.
- Não dependa de ação do usuário nesta etapa: os arquivos devem ser lidos automaticamente ao rodar o script/API.

### 2. Opção Node.js/Next.js (`exceljs`)
- Utilize a biblioteca `exceljs` para ler valores e fórmulas dos arquivos.
- Documente as limitações: não executa fórmulas, apenas lê a string da fórmula salva.
- Implemente rota de API Next.js para processar uploads futuros.
- Exiba os dados e fórmulas extraídos em uma página de testes.

### 3. Opção Python (`openpyxl`)
- Implemente script Python para leitura profunda de dados e fórmulas.
- Integre o script Python ao backend Next.js via `child_process`.
- Garanta que o retorno seja em JSON, pronto para consumo pelo frontend.
- Documente como rodar o script Python em ambiente virtual separado.

### 4. Frontend e Visualização
- Crie página Next.js para upload de arquivos e exibição dos dados/fórmulas.
- Destaque células com fórmulas.
- Permita download do relatório extraído.

### 5. Documentação e Testes
- Documente todo o fluxo, dependências e instruções de uso.
- Garanta cobertura de testes unitários e de integração.
- Realize limpeza e revisão final conforme checklist.

---

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

---

## Referências Modernas
- [exceljs (npm)](https://www.npmjs.com/package/exceljs)
- [openpyxl (Python)](https://openpyxl.readthedocs.io/en/stable/)
- [Next.js API Routes](https://nextjs.org/docs/pages/api-reference/api-routes)
- [Node.js child_process](https://nodejs.org/api/child_process.html)
- [React Dropzone](https://react-dropzone.js.org/)
- [shadcn/ui - File Upload](https://ui.shadcn.com/docs/components/file-upload)
- [Testing Library](https://testing-library.com/)
- [Markdown Guide](https://www.markdownguide.org/)

---

## Observações Finais
- O processamento pesado deve ser feito no backend.
- Python deve rodar em ambiente virtual separado para evitar conflitos.
- O frontend Next.js só faz upload e exibe resultados.
- O plano pode ser expandido para automação, logs e integração com outros sistemas.

---
