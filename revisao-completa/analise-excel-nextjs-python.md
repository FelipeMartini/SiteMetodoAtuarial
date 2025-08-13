# Integração e Análise Profunda de Excel com Next.js e Python

---

## 1. Visão Geral

Este documento detalha como integrar a análise de arquivos Excel (.xlsx) em um projeto Next.js, utilizando tanto Node.js quanto Python, e apresenta um plano de implementação para processar, extrair e exibir dados e fórmulas de planilhas enviadas pelo usuário.

---

## 2. Opções de Processamento

### A) Node.js/Next.js (API Backend)
- **Bibliotecas:** `exceljs` (lê valores e fórmulas), `xlsx` (lê valores, não fórmulas).
- **Limitações:** Não executa fórmulas, apenas lê a string da fórmula salva no arquivo. Não acessa macros, Power Pivot, nem recursos avançados do Excel.
- **Fluxo:**
  1. Usuário faz upload do arquivo pelo frontend Next.js.
  2. O arquivo é enviado para uma rota de API backend.
  3. A API processa o arquivo e retorna os dados/fórmulas extraídos.
  4. O frontend exibe os resultados.

### B) Python (Recomendado para análise profunda)
- **Bibliotecas:** `openpyxl` (lê valores e fórmulas), `pandas` (manipulação de dados).
- **Vantagens:** Suporte completo a fórmulas, fácil customização, integração com análise estatística.
- **Fluxo:**
  1. Usuário faz upload do arquivo pelo frontend Next.js.
  2. O arquivo é enviado para uma rota de API backend.
  3. A API chama um script Python (via subprocesso ou microserviço).
  4. O Python processa o arquivo, extrai dados e fórmulas, e retorna o resultado (JSON, CSV, etc).
  5. O backend devolve o resultado ao frontend.

---

## 3. Integração Python + Next.js

- O frontend Next.js faz upload do arquivo para uma API route.
- O backend executa o script Python usando `child_process` (Node.js) ou via HTTP (microserviço).
- O Python retorna os dados extraídos em JSON.
- O frontend exibe os dados e fórmulas para o usuário.

---

## 4. Exemplo de API Next.js chamando Python

```javascript
// pages/api/analisar-excel.js
import { spawn } from 'child_process';

export default function handler(req, res) {
  // Salve o arquivo recebido em disco
  // ...
  const python = spawn('python3', ['seuscript.py', 'arquivo.xlsx']);
  let output = '';
  python.stdout.on('data', (data) => { output += data.toString(); });
  python.on('close', (code) => {
    res.status(200).json({ resultado: output });
  });
}
```

---

## 5. Exemplo de Script Python

```python
import openpyxl
import sys

wb = openpyxl.load_workbook(sys.argv[1], data_only=False)
for sheet in wb.sheetnames:
    ws = wb[sheet]
    print(f'--- Aba: {sheet} ---')
    for row in ws.iter_rows():
        for cell in row:
            print(f'Celula {cell.coordinate}: valor={cell.value} formula={cell.value if cell.data_type == "f" else ""}')
```

---

## 6. Instalação e Ambiente Python

- Crie um ambiente virtual Python separado:
  ```bash
  python3 -m venv venv
  source venv/bin/activate
  pip install openpyxl pandas
  ```
- Não haverá conflito com seu projeto Next.js.

---

## 7. Página de Testes no Next.js

- Crie uma página (ex: `/pages/teste-excel.js`) para upload de arquivo e exibição dos dados/fórmulas extraídos.
- O frontend faz POST para a API, recebe o JSON e exibe em tabela ou visualização customizada.

---

## 8. Resumo Profissional

- Python é a melhor escolha para análise profunda de Excel.
- Integração via API backend é o padrão seguro e escalável.
- O frontend Next.js pode exibir dados e fórmulas extraídos de forma amigável ao usuário.

---
