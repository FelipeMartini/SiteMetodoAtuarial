## 01 - Plano detalhado: Aderência de Tábuas e Importação de Massa

Este documento descreve, de forma técnica e prática, o plano para
implementar e validar a funcionalidade de importação de massas de
participantes e análise de aderência de tábuas de mortalidade.

Objetivo imediato: garantir que as massas presentes em
`revisao-completa/` possam ser importadas de forma confiável para o
banco de dados (SQLite/Prisma) preservando pelo menos os campos
necessários para os cálculos: matrícula (ou identificador), sexo,
idade (ou data de nascimento) e data/ano do óbito quando existir.

---

```markdown
- [ ] Criar detector robusto de layout (headers + amostra) para Excel/CSV
- [ ] Implementar endpoint/server-side que valide e pré-processse arquivo
- [ ] Expor pré-visualização no frontend em `src/app/dashboard/aderencia-tabuas/page.tsx`
- [ ] Permitir mapeamento manual/confirmar mapeamento detectado
- [ ] Persistir massa normalizada em `massaParticipantes` via `/api/aderencia-tabuas/salvar-dados`
- [ ] Testar import com `revisao-completa/MASSA ASSISTIDOS EA.xlsx`
- [ ] Testar import com `revisao-completa/MORTALIDADE APOSENTADOS dez 2024 ...xlsx`
- [ ] Gerar checklist de qualidade e casos de borda
```

## Escopo e entregáveis

- Arquivo: `lista-de-tarefas/ImplementarTemp/01-Aderencia.md` (este)
- Detector server-side reutilizável: `src/lib/aderencia/detector-layout.ts`
- Endpoint de validação e pré-visualização: `POST /api/aderencia-tabuas/validar-upload`
- Alterações no dashboard: `src/app/dashboard/aderencia-tabuas/page.tsx` (preview + confirmar)
- Persistência final: usar o endpoint existente `/api/aderencia-tabuas/salvar-dados`
- Testes: scripts de integração minimal para validar fluxo com os arquivos em `revisao-completa/`

## Resumo técnico (contrato)

- Entrada: arquivo XLSX ou CSV com colunas desconhecidas; espera-se ao menos atributos que permitam extrair sexo e idade/data nascimento.
- Saída: objeto JSON com: { mapeamentoDetectado, amostraLinhas, confianca: 0..1, previewNormalizado }
- Erros: retornos claros com status 400/422 informando motivo (sem colunas encontradas, múltiplas colunas possíveis, leitura falhou)
- Critério de sucesso (mínimo): conseguir importar e persistir as duas planilhas exemplo em SQLite com campos: id_externo, matricula, sexo (M/F), idade (número), data_obito (ISO or null), importacaoId

## Dados: formatos e normalização

- Formatos suportados: .xlsx, .xls, .csv (UTF-8, ISO-8859-1 fallback se necessário)
- Normalização de sexo: aceitar `M`, `F`, `Masculino`, `Feminino`, `MASC`, `FEM`, `1`/`2` (mapear para `M`/`F`), ignorar espaços e acentos
- Normalização de idade: aceitar coluna `idade` numérica direta; ou calcular idade a partir de `data_nascimento` e `data_referencia` (ano/01-01 se faltar dia/mês)
- Chaves: preferir campo `matricula`/`registro`/`id`/`cpf` como identificador externo; se ausente, gerar `id_externo` como hash de (nome+data_nascimento)

### Mapeamento heurístico (detector)

- Passos do detector:
  1. Ler primeiras N linhas (ex.: 50) e identificar cabeçalho: procura strings com keywords (`idade`, `sex`, `sexo`, `genero`, `matricula`, `registro`, `cpf`, `nascimento`, `data_nasc`, `data_nascimento`, `data_obito`, `obito`, `morto`, `falecimento`).
  2. Se houver cabeçalho: aplicar fuzzy match (lowercase, remove acentos, trim) e pontuar colunas por correspondência.
  3. Se não houver cabeçalho: inferir por tipo de dado nas colunas (ex.: coluna com muitos 0..120 inteiros → provável `idade`, coluna com datas reconhecíveis → `data_nascimento` ou `data_obito`, coluna com tamanho 11 e apenas dígitos → `cpf`).
  4. Calcular `confianca` com base em: número de amostras compatíveis / N, força da correspondência keywords, consistência (ex.: valores esperados em sexo: `M/F`), presença de identificador único.
  5. Gerar `amostraLinhas` (ex.: 10 primeiras linhas normalizadas) e `previewNormalizado` (ex.: colunas `matricula`, `sexo`, `idade`, `data_obito`).

## API proposta para validação/preview

- Endpoint: `POST /api/aderencia-tabuas/validar-upload`
  - Entrada: multipart/form-data (campo `file`), opcional `data_referencia` (YYYY-MM-DD)
  - Saída: JSON {
      importacaoId?,
      mapeamentoDetectado: { colunaMatricula?, colunaSexo?, colunaIdade?, colunaDataNascimento?, colunaDataObito? },
      amostraLinhas: [...],
      previewNormalizado: [...],
      confianca: 0..1,
      acoesSugeridas: ["usar-mapeamento-detectado", "mapear-manualmente: {nome:col}"]
    }

## Fluxo de importação (passo a passo)

1. Usuário faz upload do arquivo na dashboard (`page.tsx`) — chamada para `POST /api/aderencia-tabuas/validar-upload`.
2. Backend lê arquivo (usando `exceljs` para xlsx/xls e `papaparse` ou `fast-csv` para csv) e executa o detector.
3. Backend retorna mapeamento detectado + previewNormalizado.
4. Usuário confere preview no frontend e pode ajustar mapeamento manualmente.
5. Ao confirmar, frontend chama `POST /api/aderencia-tabuas/salvar-dados` com `dadosProcessados.previewNormalizado` e `importacaoId`.
6. `salvar-dados` executa upserts em `massaParticipantes` (usar transação Prisma) e retorna relatório de inserções/atualizações/erros.

## Regras de persistência e chaves

- Preferir `upsert` usando chave única: (importacaoId, matricula) quando `matricula` existir.
- Se não houver `matricula`, usar `cpf` quando válido.
- Caso não haja chave única, persistir como nova linha com `id_externo` gerado (UUID) e sinalizar para revisão manual.

## Casos de borda e estratégias

- Arquivo sem cabeçalho: inferir, mas forçar revisão pelo usuário
- Sexo não padronizado (ex.: 0/1, M/F, Masc/Fem): aplicar mapeamento e marcar baixa confiança se mistura
- Idade negativa, ou > 120: marcar linhas inválidas e não persistir automaticamente
- Datas em formatos ambíguos: parsear com heurística (YYYY-MM-DD, DD/MM/YYYY, MM/DD/YYYY) e preferir DD/MM/YYYY para PT-BR
- Linhas duplicadas: agregação por chave e preferência por linha com dados mais completos
- Arquivos muito grandes (> 5MB ou > 100k linhas): rejeitar upload síncrono e sugerir job/background (melhoria futura)

## Testes e verificação

- Testes unitários (Jest) para `detector-layout` cobrindo:
  - cabeçalho explícito com nomes variados
  - cabeçalho ausente com inferência por tipos
  - colunas mistas (sexo e texto livre)
  - CSV com encoding ISO-8859-1

- Testes de integração (script de teste) que: faz upload do arquivo de exemplo, obtém preview, confirma mapeamento e verifica linhas persistidas no SQLite via Prisma.

## Plano incremental de implementação (prioridade)

1. Criar `src/lib/aderencia/detector-layout.ts` com funções exportadas: `detectarLayout(buffer, opts)` e `normalizarLinha(rawRow, mapping, opts)`.
2. Criar endpoint `POST /api/aderencia-tabuas/validar-upload` (server-side) que usa `exceljs` / `fast-csv` e retorna JSON de preview.
3. Atualizar `src/app/dashboard/aderencia-tabuas/page.tsx` para chamar novo endpoint, exibir `amostraLinhas` e permitir correção manual.
4. Reusar `/api/aderencia-tabuas/salvar-dados` para persistir `previewNormalizado` (ou criar uma rota dedicada `salvar-preview`).
5. Escrever testes unitários e de integração.
6. Testar com os dois arquivos em `revisao-completa/` e ajustar heurísticas caso necessário.

## Métricas de aceitação

- Importar e persistir ao menos 95% das linhas válidas das planilhas de exemplo sem intervenção manual.
- Para linhas com baixa confiança (<0.7), apresentar ao usuário para revisão antes de persistir.

## Recursos e bibliotecas recomendadas

- exceljs (Node.js) — leitura/escrita de XLSX
- fast-csv / papaparse — parsing de CSV
- zod — validação de payloads
- prisma — ORM (usar transação para upserts em massa)
- uuid — gerar id_externo quando necessário

## Próximos passos (imediatos)

1. Eu criei este plano em `lista-de-tarefas/ImplementarTemp/01-Aderencia.md`.
2. Próxima ação técnica que proponho executar: implementar `detector-layout` e o endpoint `POST /api/aderencia-tabuas/validar-upload` e rodar testes com os arquivos em `revisao-completa/`.
3. Se concordar, eu sigo implementando agora (criar os arquivos, testes e integrar com o dashboard). Se preferir revisar o plano antes, me diga e eu aguardo.

## Apêndice: comandos úteis (local)

```bash
# rodar lint e typecheck (na pasta site-metodo)
cd /home/felipe/Área\ de\ Trabalho/GitHub/SiteMetodoAtuarial/site-metodo && npm run lint && npm run type-check

# rodar dev server (assegure fechar instâncias antigas)
cd /home/felipe/Área\ de\ Trabalho/GitHub/SiteMetodoAtuarial/site-metodo && for porta in {3000..3010}; do fuser -k $porta/tcp; done && npm run dev
```

---

Arquivo gerado automaticamente por solicitação do usuário: plano detalhado para análise e importação de massas e aderência de tábuas.
