# Documentação das Tasks VS Code (`tasks.json`)

> Atualizado em: 07/08/2025

## Tarefas Individuais

- **Instalar dependências**  
  Instala todas as dependências do projeto. Use sempre após clonar ou limpar o projeto.

- **Backup node_modules e lock**  
  Cria um backup rápido das dependências e do arquivo de lock (`package-lock.json`). Útil antes de grandes atualizações.

- **Atualizar dependências**  
  Atualiza todas as dependências para as versões mais recentes permitidas pelo `package.json`.

- **Limpeza-Geral**  
  Remove diretórios de build, dependências, cache e regenera o Prisma. Use se houver erros estranhos de dependência ou build.

- **Diagnóstico: Checar ambiente Node/Prisma**  
  Mostra as versões do Node, NPM, Prisma e o conteúdo do `.env` (se existir).

- **Diagnóstico: Mostrar logs de build**  
  Exibe o conteúdo do log de build para facilitar troubleshooting.

- **Segurança: npm audit fix**  
  Executa auditoria de segurança nas dependências e tenta corrigir vulnerabilidades automaticamente.

- **Atualizar shadcn/ui**  
  Atualiza os componentes shadcn/ui para a última versão disponível.

- **Lint Absoluto**  
  Executa o linter em todo o projeto para garantir o padrão de código.

- **Type Check Absoluto**  
  Checagem de tipos TypeScript em todo o projeto.

- **Build Next.js Absoluto**  
  Realiza o build completo do Next.js para produção.

- **Prisma Generate Absoluto**  
  Gera os clientes do Prisma a partir do schema.

- **Iniciar Next.js**  
  Inicia o servidor Next.js em modo desenvolvimento, matando instâncias antigas nas portas padrão.

- **Iniciar Next.js Seguro**  
  Inicia o Next.js aguardando liberação das portas, para maior segurança.

- **Reiniciar Next.js**  
  Reinicia o servidor Next.js, matando instâncias antigas.

- **Parar Next.js**  
  Para todas as instâncias do Next.js nas portas padrão.

- **Finalizar todas as instâncias Node.js**  
  Finaliza qualquer processo Node.js nas portas padrão.

- **Finalizar servidores Next.js (portas 3000-3010)**  
  Finaliza servidores Next.js em todas as portas padrão.

- **Cobertura de Testes**  
  Executa cobertura de testes com Jest.

- **Smoke Test Next.js**  
  Executa um teste rápido (smoke test) se implementado.

---

## Tarefas Compostas

- **Build Completo Seguro**  
  Executa toda a cadeia de build e validação do projeto, na ordem correta: diagnóstico, backup, limpeza, reinstalação, atualização, auditoria, build, geração Prisma, lint, type-check e cobertura de testes.

- **Start Seguro**  
  Executa o build completo e, em seguida, inicializa o Next.js de forma segura.

---

**Observações de Segurança e Boas Práticas:**
- Sempre execute tarefas críticas no diretório correto (`cwd`).
- Use as tarefas compostas para garantir que todas as etapas essenciais sejam realizadas na ordem ideal.
- Antes de grandes mudanças, utilize o backup de dependências.
- Em caso de erros de dependência, utilize a Limpeza-Geral.
- Auditorias de segurança devem ser feitas regularmente.
