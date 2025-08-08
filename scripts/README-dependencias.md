# Automação de Gerenciamento de Dependências

Este projeto possui automação completa para instalar, atualizar, remover, auditar e listar dependências via scripts e tasks do VS Code.

## Scripts disponíveis (`/scripts`)

- `depend-install.sh [ci|install]` — Instala dependências (limpa ou padrão)
- `depend-add.sh <pacote> [flags]` — Adiciona uma dependência específica (ex: chalk --save-dev)
- `depend-update.sh [all|interactive|<pacote>]` — Atualiza todas, modo interativo ou uma dependência específica
- `depend-remove.sh <pacote>` — Remove uma dependência
- `depend-outdated.sh` — Lista dependências desatualizadas
- `depend-audit.sh [fix]` — Checa ou corrige vulnerabilidades

## Tasks VS Code

Acesse pelo menu de tarefas (Ctrl+Shift+P → "Executar Tarefa") ou pelo painel lateral:

- **Dependências: Instalar (ci/padrão)** — Instala dependências (escolha entre `ci` ou `install`)
- **Dependências: Adicionar (específica)** — Adiciona uma dependência específica (prompt para nome e flags)
- **Dependências: Atualizar (todas)** — Atualiza todas as dependências para a última versão
- **Dependências: Atualizar (interativo)** — Atualização interativa (escolha quais atualizar)
- **Dependências: Atualizar (específica)** — Atualiza um pacote específico (prompt)
- **Dependências: Remover (específica)** — Remove um pacote específico (prompt)
- **Dependências: Listar desatualizadas** — Lista dependências desatualizadas
- **Dependências: Auditoria de vulnerabilidades** — Checa vulnerabilidades (npm audit)
- **Dependências: Corrigir vulnerabilidades** — Corrige vulnerabilidades automaticamente (npm audit fix)

## Requisitos
- Node.js LTS
- npm >= 8
- O script usa `npm-check-updates` (npx será usado automaticamente se não estiver global)

## Exemplos de uso manual

```bash
# Instalar dependências (limpa)
./scripts/depend-install.sh ci

# Instalar dependências (padrão)
./scripts/depend-install.sh install

# Adicionar dependência específica (ex: chalk --save-dev)
./scripts/depend-add.sh chalk --save-dev

# Atualizar todas as dependências
./scripts/depend-update.sh all

# Atualizar de forma interativa
./scripts/depend-update.sh interactive

# Atualizar apenas o React
./scripts/depend-update.sh react

# Remover o pacote tailwindcss
./scripts/depend-remove.sh tailwindcss

# Listar dependências desatualizadas
./scripts/depend-outdated.sh

# Checar vulnerabilidades
./scripts/depend-audit.sh

# Corrigir vulnerabilidades
./scripts/depend-audit.sh fix
```

## Observações
- Todos os scripts são seguros, modernos e seguem as melhores práticas do Node.js.
- O uso via tasks do VS Code permite prompts e seleção interativa.
- O fluxo é totalmente documentado e integrado ao README.

---

> Para dúvidas ou sugestões, consulte o README principal ou abra uma issue.
