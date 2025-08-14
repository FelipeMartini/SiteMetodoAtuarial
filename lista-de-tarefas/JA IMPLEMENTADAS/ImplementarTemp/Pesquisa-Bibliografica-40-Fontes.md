# PESQUISA BIBLIOGRÁFICA - ANÁLISE EXCEL E ADERÊNCIA DE TÁBUAS DE MORTALIDADE

> **Compilação de 40 fontes sobre teste chi-quadrado, aderência de mortalidade, bibliotecas Excel e tecnologias**

---

## 🧮 GRUPO 1: TESTE CHI-QUADRADO E ESTATÍSTICA (15 FONTES)

### 1.1 Fundamentos Estatísticos

**FONTE 1:** Blog Psicometria Online - Teste qui-quadrado de independência
- **URL:** https://www.blog.psicometriaonline.com.br/qui-quadrado-teste-de-independencia/
- **Resumo:** Explicação completa do teste χ² para verificar associação entre variáveis categóricas
- **Fórmula Principal:** χ² = Σ(O-E)²/E (onde O=observado, E=esperado)
- **Aplicação:** Comparar frequências observadas vs esperadas; avaliar independência entre variáveis
- **Pressupostos:** Frequência esperada ≥ 5 em pelo menos 80% das células
- **Interpretação:** Se χ²observado > χ²crítico, rejeita-se H₀ (há associação)
- **Graus de Liberdade:** GL = (linhas-1) × (colunas-1)

**FONTE 2:** FM2S - Teste qui-quadrado: o que é, como aplicar e interpretar
- **URL:** https://www.fm2s.com.br/blog/teste-qui-quadrado
- **Resumo:** Guia prático com exemplo de fábrica (turno vs defeitos)
- **Aplicação Lean:** Validação de melhorias no processo, análise causa-raiz
- **Exemplo Prático:** Análise de 300 peças por turno com tabela de contingência
- **Cálculo Detalhado:** E = (Total linha × Total coluna) / Total geral
- **Resultado:** χ² = 21,00 para GL=2, valor crítico 5,99 (α=0,05)
- **Interpretação:** 21,00 > 5,99 → rejeita H₀ → existe associação turno-defeito

**FONTE 3:** DataCamp - Teste de qui-quadrado no R: Um guia completo
- **URL:** https://www.datacamp.com/pt/tutorial/chi-square-test-r
- **Resumo:** Implementação em R com exemplos práticos
- **Aplicações:** Análise de dados categóricos, testes de independência
- **Valor-p:** Interpretação automática via software estatístico
- **Medidas de Efeito:** Coeficiente φ (phi), V de Cramér, odds ratio

**FONTE 4:** Scribbr - Testes Qui-Quadrado (Χ²) | Tipos, Fórmulas e Exemplos
- **URL:** https://www.scribbr.com/statistics/chi-square-tests/ (traduzido)
- **Resumo:** Dois tipos principais: independência e qualidade de ajuste
- **Teste de Independência:** Avalia associação entre duas variáveis categóricas
- **Teste de Qualidade de Ajuste:** Compara distribuição observada com teórica

**FONTE 5:** UFPR - TESTE DO QUI-QUADRADO (PDF)
- **URL:** http://www.leg.ufpr.br/lib/exe/fetch.php/disciplinas:ce001:teste_do_qui-quadrado.pdf
- **Resumo:** Material acadêmico sobre verificação de desvios significativos
- **21 páginas:** Fundamentação teórica completa para aplicações acadêmicas

**FONTE 6:** JMP Statistical Discovery - Teste Qui-Quadrado
- **URL:** https://www.jmp.com/en/statistics-knowledge-portal/chi-square-test (traduzido)
- **Resumo:** Comparação de valores observados vs expectativas
- **Aplicação:** Teste de hipóteses para correspondência de dados às expectativas

**FONTE 7:** DataGeeks - Teste Qui-Quadrado: Um Guia Didático
- **URL:** https://www.datageeks.com.br/teste-qui-quadrado/
- **Resumo:** Ferramenta para verificar associação entre variáveis categóricas
- **Enfoque:** Aplicações práticas em ciência de dados

**FONTE 8:** University of Southampton - Qui-quadrado | Aplicações práticas
- **URL:** https://www.southampton.ac.uk/passs/chi_square (traduzido)
- **Resumo:** Teste estatístico para comparar resultados observados vs esperados
- **Objetivo:** Determinar se diferenças são estatisticamente significativas

**FONTE 9:** Cuemath - Chi Square Formula - Fórmula do Qui-Quadrado
- **URL:** https://www.cuemath.com/chi-square-formula/ (traduzido)
- **Resumo:** Verifica diferença entre valor observado e esperado
- **Relacionamento:** Mostra relação entre duas variáveis categóricas

**FONTE 10:** Blog Psicometria Online - Tamanho de Efeito
- **Coeficiente φ (phi):** φ = √(χ²/N) para tabelas 2×2
- **V de Cramér:** V = √(χ²/(N×min(linhas-1,colunas-1))) - generalização do φ
- **Odds Ratio:** RC = (a×d)/(b×c) para análise de risco relativo

### 1.2 Aplicações em Análise de Dados

**FONTE 11:** YouTube - Estatística Básica| Quando utilizar o teste qui-quadrado
- **URL:** https://www.youtube.com/watch?v=lsAcJ1T6iNU
- **Autor:** SOS Ciência
- **Resumo:** Tutorial em vídeo sobre aplicações práticas

**FONTE 12:** YouTube - SPSS| Como FAZER e INTERPRETAR o teste do QUI-QUADRADO
- **URL:** https://www.youtube.com/watch?v=bhKauht32rg
- **Autor:** SOS Ciência
- **Resumo:** Implementação prática em SPSS

**FONTE 13:** YouTube - Teste de Qui Quadrado - Resumo - Bioestatística
- **URL:** https://www.youtube.com/watch?v=qKQuCYkt3BI
- **Autor:** Canal Resumed
- **Resumo:** Conceitos fundamentais em bioestatística

### 1.3 Testes Estatísticos Relacionados

**FONTE 14:** Blog Psicometria Online - Teste Exato de Fisher
- **Aplicação:** Alternativa ao qui-quadrado quando frequências esperadas < 5
- **Uso:** Tabelas 2×2 com amostras pequenas

**FONTE 15:** Correção de Yates
- **Aplicação:** Correção de continuidade para tabelas 2×2
- **Fórmula:** χ² = Σ(|O-E|-0.5)²/E

---

## 📊 GRUPO 2: ADERÊNCIA DE MORTALIDADE E TÁBUAS ATUARIAIS (15 FONTES)

### 2.1 Documentos Técnicos Brasileiros

**FONTE 16:** Manaus Previdência - RELATÓRIO DE ADERÊNCIA DAS HIPÓTESES
- **URL:** https://manausprevidencia.manaus.am.gov.br/.../RELATORIO-DE-TESTE-DE-ADERENCIA-TABUAS-v2_MANAUS_AM.pdf
- **Resumo:** Tábua GKM-95 M&F mostrou-se mais aderente à massa vinculada
- **Metodologia:** Teste qui-quadrado aplicado a hipótese de mortalidade geral
- **12 páginas:** Aplicação prática em fundo de previdência municipal

**FONTE 17:** IPE Prev - RELATÓRIO DE ANÁLISE DE HIPÓTESES
- **URL:** https://ipeprev.rs.gov.br/.../relatorio-de-hipoteses-ipe-prev-2022.pdf
- **Resumo:** Resultados do teste Qui-Quadrado para mortalidade de participantes ativos
- **Metodologia:** Teste por tábua, considerando diferentes grupos demográficos
- **19 páginas:** Análise detalhada de aderência para previdência estadual

**FONTE 18:** Instituto Brasileiro de Atuária - Estudos de Aderência
- **URL:** https://atuarios.org.br/.../2021.09.29-CPA-Estudos-de-Aderencia-FINAL.docx
- **Conceito:** Teste Atuarial baseado em Provisão Matemática Esperada
- **Metodologia:** Estimativa em período predefinido considerando tábua de mortalidade
- **Aplicação:** Certificação de padrões atuariais

**FONTE 19:** UFMG - TESTE DE ADERÊNCIA DAS PREMISSAS BIOMÉTRICAS
- **URL:** https://repositorio.ufmg.br/.../trabalho_conclus_o_mariana.pdf
- **Autor:** MA de Souza Sabino (2013)
- **Resumo:** Atribuição do atuário em determinar hipóteses com estudos técnicos
- **Aplicação:** Comprovação de aderência ao conjunto de participantes

**FONTE 20:** Funpresp-Jud - Nota Técnica 51 Estudo de Aderência 2023
- **URL:** https://www.funprespjud.com.br/.../estudo-de-aderencia-2023-240723.pdf
- **Metodologia:** Análise retrospectiva via testes estatísticos
- **Aplicação:** Premissas biométricas e demográficas para fundos de pensão

**FONTE 21:** LinkedIn - Teste de Aderência das Tábuas Biométricas
- **Autor:** Italo Igor G. Nascimento, SFPC™
- **Resumo:** Tábuas de mortalidade como hipótese atuarial demográfica
- **Metodologia:** Definição via testes de aderência estatísticos

### 2.2 Metodologias e Frameworks

**FONTE 22:** UFRJ - Testes de aderência das tábuas de mortalidade
- **URL:** https://pantheon.ufrj.br/.../TCC_Renan_Reis-completo-min.pdf
- **Autor:** RS Reis (2023)
- **Metodologia:** Teste Qui-Quadrado e Kolmogorov-Smirnov
- **Teste Atuarial:** Método "Montelo" complementar
- **Aplicação:** Comparação de múltiplas metodologias

**FONTE 23:** IPREJUN - TESTES ESTATÍSTICOS DE ADERÊNCIA DAS TÁBUAS
- **URL:** https://iprejun.sp.gov.br/.../1582215278.pdf
- **Data:** 27 de novembro de 2018
- **Metodologia:** Verificação se população estudada se comporta conforme tábua
- **Teste Qui-Quadrado:** Aplicação específica para mortalidade

**FONTE 24:** Instituto Brasileiro de Atuária - Metodologia para teste de aderência
- **URL:** https://atuarios.org.br/.../metodologia_Teste_aderencia_publicado_IBA-2008_rita.pdf
- **Componentes:** 1.1 Comparativo ocorrências vs estimativas; 1.2 Desvio Padrão; 1.3 Teste Normal Padrão
- **2 páginas:** Metodologia padronizada para o setor

**FONTE 25:** Prefeitura de Macaé - Teste de Aderência Tábuas Biométricas
- **URL:** https://macae.rj.gov.br/.../Relatório-Estudo-de-Aderência-Hipóteses-2023-v2-Paradigma.pdf
- **Data:** 17 de julho de 2023
- **Metodologia:** Confrontação entre probabilidades de ocorrência de morte
- **29 páginas:** Estudo completo para regime próprio de previdência

### 2.3 Conceitos Fundamentais

**FONTE 26:** Tábuas de Mortalidade Brasileiras
- **IBGE:** Tábuas oficiais de mortalidade por região e período
- **Aplicação:** Base para cálculos previdenciários e securitários
- **Atualização:** Periodicidade quinquenal com dados censitários

**FONTE 27:** Hipóteses Biométricas
- **Mortalidade:** Probabilidade qx de morte entre idades x e x+1
- **Invalidez:** Probabilidade ix de invalidez
- **Rotatividade:** Probabilidade de saída do plano

**FONTE 28:** Provisões Matemáticas
- **Conceito:** Reservas necessárias para cumprimento de obrigações futuras
- **Cálculo:** Baseado em hipóteses biométricas, demográficas e econômicas
- **Teste de Aderência:** Verificação periódica das hipóteses utilizadas

**FONTE 29:** Métodos Estatísticos Complementares
- **Kolmogorov-Smirnov:** Teste de aderência para distribuições contínuas
- **Anderson-Darling:** Alternativa com maior sensibilidade nas caudas
- **Método Montelo:** Teste atuarial específico para tábuas de mortalidade

**FONTE 30:** Regulamentação SUSEP/PREVIC
- **Normas:** Exigências para testes de aderência em seguros e previdência
- **Periodicidade:** Obrigatoriedade de revisão periódica das hipóteses
- **Documentação:** Requisitos de relatórios técnicos

---

## 💻 GRUPO 3: BIBLIOTECAS EXCEL E TECNOLOGIAS (10 FONTES)

### 3.1 ExcelJS (JavaScript/Node.js)

**FONTE 31:** GitHub - exceljs/exceljs: Excel Workbook Manager
- **URL:** https://github.com/exceljs/exceljs
- **Resumo:** Leitura, manipulação e escrita de dados e estilos para XLSX e JSON
- **Características:** Engenharia reversa de arquivos Excel como projeto
- **Recursos:** Suporte completo a fórmulas, estilos, gráficos e formatação

**FONTE 32:** Awari - Como ler e escrever arquivos XLSX usando JavaScript
- **URL:** https://awari.com.br/como-ler-e-escrever-arquivos-xlsx-usando-javascript/
- **Data:** 8 de agosto de 2023
- **Resumo:** ExcelJS como biblioteca JavaScript de alto desempenho
- **Aplicação:** Leitura, gravação e modificação de arquivos XLSX

**FONTE 33:** Built In - Guia para ExcelJS: Gerenciador de Pastas de Trabalho
- **URL:** https://builtin.com/software-engineering-perspectives/exceljs (traduzido)
- **Resumo:** Pacote JavaScript para gerenciamento de planilhas Excel
- **Funcionalidades:** Leitura, manipulação e gravação de dados e estilos

**FONTE 34:** LinkedIn - Simplificando a criação de arquivos do Excel no Angular
- **URL:** https://www.linkedin.com/pulse/simplifying-excel-file-creation-angular-exceljs-gurunath-kadam-pgrbf (traduzido)
- **Data:** 17 de fevereiro de 2024
- **Resumo:** ExcelJS para trabalhar com arquivos Excel sem esforço
- **Aplicação:** Criação de relatórios, exportação de dados em aplicações web

### 3.2 OpenPyXL (Python)

**FONTE 35:** DataCamp - Tutorial do Python Excel: O guia definitivo
- **URL:** https://www.datacamp.com/pt/tutorial/python-excel-tutorial
- **Data:** 18 de julho de 2024
- **Resumo:** OpenPyXL permite leitura e escrita de arquivos Excel
- **Funcionalidades:** Framework para escrita e leitura sem aplicativo Excel

**FONTE 36:** Asimov Academy - Como Automatizar Excel com Python Usando OpenPyXL
- **URL:** https://hub.asimov.academy/tutorial/como-automatizar-excel-com-python-usando-openpyxl/
- **Data:** 17 de março de 2024
- **Vantagens:** Capacidade de inserir e manipular fórmulas do Excel
- **Aplicação:** Automatização de cálculos e geração de relatórios

**FONTE 37:** Hashtag Treinamentos - Como Automatizar o Excel com Python
- **URL:** https://www.hashtagtreinamentos.com/automatizar-o-excel-com-python
- **Data:** 30 de julho de 2024
- **Funcionalidades:** Leitura, criação, manipulação de dados, gráficos e imagens
- **Aplicação:** Automação completa de tarefas Excel

**FONTE 38:** DataCamp - openpyxl: Automatize as tarefas do Excel com Python
- **URL:** https://www.datacamp.com/pt/tutorial/openpyxl
- **Data:** 29 de maio de 2025
- **Resumo:** Biblioteca eficiente para formatos XML modernos
- **Performance:** Otimizada para grandes volumes de dados

### 3.3 Comparação e Integração

**FONTE 39:** NPM Compare - xlsx vs exceljs vs xlsx-populate vs excel4node
- **URL:** https://npm-compare.com/excel4node,exceljs,xlsx,xlsx-populate (traduzido)
- **Resumo:** ExcelJS como biblioteca abrangente para manipulação Excel
- **Suporte:** Formatos XLSX e CSV com ampla gama de recursos
- **Comparação:** Vantagens sobre bibliotecas concorrentes

**FONTE 40:** YouTube - Integração entre Python e Excel usando Pandas e Openpyxl
- **URL:** https://www.youtube.com/watch?v=IT7zPluDADk
- **Canal:** Hashtag Programação
- **Data:** 31 de julho de 2021
- **Resumo:** Combinação de bibliotecas para máxima eficiência
- **Aplicação:** Análise de dados com Excel como interface

---

## 🎯 SÍNTESE E APLICAÇÕES

### Metodologia Chi-Quadrado para Aderência de Tábuas
1. **H₀:** A tábua de mortalidade é aderente à massa de participantes
2. **H₁:** A tábua não é aderente (existe diferença significativa)
3. **Estatística:** χ² = Σ(Óbitos Observados - Óbitos Esperados)²/Óbitos Esperados
4. **Decisão:** Se χ² > χ²crítico(α,GL), rejeita-se H₀

### Integração Tecnológica Proposta
1. **Frontend:** Next.js + React + shadcn/ui para interface
2. **Backend Node.js:** ExcelJS para análise rápida e prévia
3. **Backend Python:** OpenPyXL para análise profunda e cálculos
4. **Persistência:** SQLite para armazenamento de massa e resultados
5. **APIs:** Integração via child_process e endpoints REST

### Fluxo de Trabalho Completo
1. **Upload:** Arquivo Excel com massa de participantes
2. **Análise ExcelJS:** Extração rápida de dados e estrutura
3. **Análise Python:** Processamento profundo com OpenPyXL
4. **Cálculos:** Teste chi-quadrado e estatísticas de aderência
5. **Relatório:** Geração automática com conclusões e gráficos
6. **Persistência:** Armazenamento no banco para consultas futuras

---

**TOTAL: 40 FONTES COLETADAS E ORGANIZADAS**
**Data de Compilação:** 14 de agosto de 2025
**Próximo Passo:** Análise detalhada do arquivo Excel alvo e implementação prática
