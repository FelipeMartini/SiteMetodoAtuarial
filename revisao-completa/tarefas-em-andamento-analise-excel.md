# Tarefas em Andamento: Análise de Excel com Next.js e Python

---

## Plano de Implementação (Memória do Agente)

### 1. Backend Next.js puro
- [ ] Criar rota de API para upload e processamento de arquivos Excel.
- [ ] Implementar leitura de dados e fórmulas usando `exceljs` (Node.js) para protótipo inicial.
- [ ] Documentar limitações e avaliar resultados.

### 2. Integração com Python
- [ ] Criar script Python para extração profunda de dados e fórmulas (`openpyxl`).
- [ ] Integrar chamada do script Python via API backend (Node.js `child_process`).
- [ ] Garantir retorno em JSON para fácil consumo pelo frontend.

### 3. Página de Testes Next.js
- [ ] Criar página separada para upload de arquivo, chamada da API e exibição dos dados/fórmulas.
- [ ] Exibir dados e fórmulas em tabela, com destaque para células com fórmulas.
- [ ] Permitir download do relatório extraído (CSV/JSON).

### 4. Documentação e Ajustes
- [ ] Documentar todo o fluxo, dependências e instruções de uso.
- [ ] Ajustar e otimizar conforme feedback dos testes.

---

## Observações
- O processamento pesado deve ser feito no backend.
- Python deve rodar em ambiente virtual separado para evitar conflitos.
- O frontend Next.js só faz upload e exibe resultados.
- O plano pode ser expandido para automação, logs e integração com outros sistemas.

---
