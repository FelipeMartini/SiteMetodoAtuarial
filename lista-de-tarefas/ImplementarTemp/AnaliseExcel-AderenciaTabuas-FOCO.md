# ANÁLISE EXCEL E ADERÊNCIA DE TÁBUAS DE MORTALIDADE - LISTA DE TAREFAS FOCADA

> **PRIORIDADE MÁXIMA**: Desenvolvimento completo de análise Excel com ExcelJS e Python + Teste de aderência de tábuas de mortalidade usando qui-quadrado

---

## 📊 FASE 1: PESQUISA BIBLIOGRÁFICA PROFUNDA (40 FONTES)

### 1.1 Teste Chi-Quadrado e Estatística
- [ ] Buscar 10 fontes sobre teste chi-quadrado em estatística
- [ ] Buscar 5 fontes sobre testes de hipóteses estatísticas
- [ ] Documentar fórmulas, interpretação e aplicações

### 1.2 Aderência de Mortalidade e Tábuas Atuariais  
- [ ] Buscar 10 fontes sobre estudo de aderência de mortalidade
- [ ] Buscar 8 fontes sobre tábuas atuariais brasileiras e internacionais
- [ ] Buscar 3 fontes sobre massa de participantes em seguros/previdência
- [ ] Documentar metodologias e melhores práticas

### 1.3 Bibliotecas e Tecnologias
- [ ] Buscar 2 fontes sobre ExcelJS avançado (fórmulas, análise profunda)
- [ ] Buscar 2 fontes sobre OpenPyXL Python para análise Excel
- [ ] Analisar bibliotecas já existentes no projeto para cálculos

---

## 📁 FASE 2: ANÁLISE DO ARQUIVO EXCEL ALVO

### 2.1 Análise Inicial do Arquivo
- [ ] Localizar arquivo: `revisao-completa/MORTALIDADE APOSENTADOS dez 2024 2019 A 2024 FELIPE qx masc e fem (Massa Janeiro).xlsx`
- [ ] Mapear estrutura do arquivo (abas, colunas, dados)
- [ ] Identificar:
  - [ ] Massa de participantes (matrícula, sexo, idade)
  - [ ] Lista de óbitos ocorridos  
  - [ ] qx das tábuas de referência
  - [ ] Outras informações relevantes

### 2.2 Estruturação de Dados
- [ ] Definir schema padrão para massa de participantes
- [ ] Definir schema para óbitos esperados vs ocorridos
- [ ] Criar mapeamento de campos necessários para cálculos

---

## 💻 FASE 3: IMPLEMENTAÇÃO EXCELJS (APRIMORAR EXISTENTE)

### 3.1 Análise da Implementação Atual
- [ ] Localizar e analisar implementação existente de análise-excel
- [ ] Identificar limitações atuais
- [ ] Mapear oportunidades de melhoria

### 3.2 Aprimoramentos ExcelJS
- [ ] Implementar leitura profunda de fórmulas
- [ ] Adicionar extração de metadados das abas
- [ ] Implementar parser para diferentes tipos de dados (datas, números, texto)
- [ ] Adicionar validação de integridade dos dados
- [ ] Implementar cache para análises grandes

### 3.3 Interface de Usuário (ExcelJS)
- [ ] Aprimorar página existente de análise-excel
- [ ] Adicionar upload específico para arquivos de mortalidade
- [ ] Implementar visualização de massa de participantes
- [ ] Adicionar preview dos qx extraídos
- [ ] Implementar download de dados estruturados

---

## 🐍 FASE 4: IMPLEMENTAÇÃO PYTHON (OPENPYXL)

### 4.1 Script Python Base
- [ ] Criar script Python usando OpenPyXL
- [ ] Implementar leitura robusta de arquivos Excel
- [ ] Adicionar extração de fórmulas e valores calculados
- [ ] Implementar tratamento de erros e validações

### 4.2 Integração Node.js + Python
- [ ] Criar API endpoint para chamada do script Python
- [ ] Implementar `child_process` para execução do script
- [ ] Adicionar tratamento de timeout e erros
- [ ] Implementar retorno estruturado em JSON

### 4.3 Comparação ExcelJS vs Python
- [ ] Documentar vantagens e limitações de cada abordagem
- [ ] Criar benchmarks de performance
- [ ] Documentar casos de uso recomendados para cada método

---

## 📊 FASE 5: CÁLCULOS DE ADERÊNCIA DE MORTALIDADE

### 5.1 Algoritmos de Cálculo
- [ ] Implementar cálculo de óbitos esperados por faixa etária
- [ ] Implementar cálculo de óbitos ocorridos agrupados
- [ ] Implementar teste qui-quadrado completo
- [ ] Adicionar cálculo do valor crítico
- [ ] Implementar decisão automática sobre aderência

### 5.2 Validação Estatística
- [ ] Implementar diferentes níveis de significância (95%, 99%)
- [ ] Adicionar intervalos de confiança
- [ ] Implementar testes de normalidade quando aplicável
- [ ] Documentar pressupostos estatísticos

### 5.3 Visualização de Resultados
- [ ] Criar gráficos de óbitos esperados vs ocorridos
- [ ] Implementar visualização do teste qui-quadrado
- [ ] Adicionar indicadores visuais de aderência/não-aderência
- [ ] Criar relatório automático em PDF

---

## 🏗️ FASE 6: ESTRUTURA DA APLICAÇÃO

### 6.1 Criação da Página AderenciaTabua
- [ ] Criar estrutura: `site-metodo/src/app/AderenciaTabua/`
- [ ] Implementar página principal de aderência
- [ ] Criar subpáginas para diferentes funcionalidades
- [ ] Integrar com sistema de autenticação/ABAC

### 6.2 Componentes Específicos
- [ ] Criar componente de upload de arquivo Excel
- [ ] Implementar tabela de massa de participantes
- [ ] Criar visualizador de qx das tábuas
- [ ] Implementar componente de resultados do teste
- [ ] Adicionar exportador de relatórios

### 6.3 APIs e Endpoints
- [ ] Criar `/api/aderencia-tabuas/upload`
- [ ] Implementar `/api/aderencia-tabuas/analise-exceljs`
- [ ] Criar `/api/aderencia-tabuas/analise-python`
- [ ] Implementar `/api/aderencia-tabuas/calculo-aderencia`
- [ ] Adicionar `/api/aderencia-tabuas/relatorio`

---

## 💾 FASE 7: PERSISTÊNCIA DE DADOS

### 7.1 Schema do Banco de Dados
- [ ] Criar tabelas para massa de participantes
- [ ] Implementar tabela para óbitos registrados  
- [ ] Criar tabela para qx das tábuas de referência
- [ ] Adicionar tabela para resultados de testes de aderência
- [ ] Implementar tabela de histórico de análises

### 7.2 Importação para SQLite
- [ ] Implementar importador de massa do Excel para SQLite
- [ ] Adicionar validação de dados na importação
- [ ] Criar sistema de versionamento de dados
- [ ] Implementar backup automático antes da importação
- [ ] Adicionar logs detalhados de importação

### 7.3 Queries e Relatórios
- [ ] Implementar queries otimizadas para análises
- [ ] Criar views para relatórios comuns
- [ ] Adicionar índices para performance
- [ ] Implementar cache de resultados complexos

---

## 📋 FASE 8: INTERFACE UNIFICADA

### 8.1 Dashboard de Aderência
- [ ] Criar dashboard principal com métricas
- [ ] Implementar filtros por período, idade, sexo
- [ ] Adicionar comparação entre diferentes tábuas
- [ ] Criar histórico de análises realizadas

### 8.2 Relatórios Avançados
- [ ] Implementar relatório técnico detalhado
- [ ] Criar relatório executivo resumido
- [ ] Adicionar gráficos interativos
- [ ] Implementar exportação em múltiplos formatos

### 8.3 Configurações e Parâmetros
- [ ] Criar interface para configurar níveis de significância
- [ ] Implementar seletor de tábuas de referência
- [ ] Adicionar configuração de agrupamentos etários
- [ ] Criar presets para diferentes tipos de análise

---

## 🧪 FASE 9: TESTES E VALIDAÇÃO

### 9.1 Testes Unitários
- [ ] Criar testes para cálculos estatísticos
- [ ] Implementar testes para parsers Excel
- [ ] Adicionar testes para APIs
- [ ] Criar testes para componentes UI

### 9.2 Testes de Integração
- [ ] Testar fluxo completo ExcelJS
- [ ] Validar integração Python + Node.js
- [ ] Testar persistência no banco de dados
- [ ] Validar relatórios gerados

### 9.3 Validação com Dados Reais
- [ ] Processar arquivo MORTALIDADE APOSENTADOS completo
- [ ] Validar resultados com calculadoras atuariais conhecidas
- [ ] Comparar com análises manuais existentes
- [ ] Documentar discrepâncias e limitações

---

## 📚 FASE 10: DOCUMENTAÇÃO COMPLETA

### 10.1 Documentação Técnica
- [ ] Documentar arquitetura da solução
- [ ] Criar guia de instalação e configuração
- [ ] Documentar APIs e endpoints
- [ ] Adicionar exemplos de código

### 10.2 Documentação de Usuário
- [ ] Criar manual do usuário ilustrado
- [ ] Documentar fluxos de trabalho comuns
- [ ] Adicionar troubleshooting
- [ ] Criar vídeos tutoriais (opcional)

### 10.3 Documentação Acadêmica
- [ ] Documentar metodologia estatística utilizada
- [ ] Referenciar fontes bibliográficas
- [ ] Explicar pressupostos e limitações
- [ ] Criar bibliografia comentada

---

## ✅ CHECKLIST DE VALIDAÇÃO FINAL

### Funcionalidades Críticas
- [ ] Upload e análise do arquivo MORTALIDADE APOSENTADOS
- [ ] Extração correta de massa, óbitos e qx
- [ ] Cálculo preciso do teste qui-quadrado
- [ ] Decisão correta sobre aderência
- [ ] Importação para banco SQLite funcionando
- [ ] Relatórios completos e precisos

### Qualidade e Performance
- [ ] Todos os testes passando
- [ ] Performance adequada para arquivos grandes
- [ ] Interface responsiva e intuitiva
- [ ] Documentação completa e clara
- [ ] Código limpo e bem estruturado

### Integração com o Sistema
- [ ] Integração com autenticação/ABAC
- [ ] Compatibilidade com tema claro/escuro
- [ ] Integração com sistema de notificações
- [ ] Logs de auditoria implementados

---

**STATUS ATUAL: INICIANDO FASE 1 - PESQUISA BIBLIOGRÁFICA**
**PRÓXIMO: Buscar 40 fontes sobre teste chi-quadrado, aderência de mortalidade e tecnologias**
