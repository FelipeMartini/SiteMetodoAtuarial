# Automação de Git: Commit & Push

O projeto possui um script profissional para automatizar o fluxo de git add/commit/push, tanto de forma interativa quanto automática.

## Uso interativo (com prompts)

Execute a task "Git Auto Commit & Push" pelo VS Code (Ctrl+Shift+B ou F1 > Tarefas) ou rode manualmente:

```bash
./git-auto.sh
```

Você será guiado por prompts para adicionar arquivos, digitar a mensagem de commit e confirmar o push.

## Uso automático (sem prompts)

Passe a mensagem de commit como argumento:

```bash
./git-auto.sh "Sua mensagem de commit aqui"
```

O script irá:
- Adicionar todos os arquivos alterados
- Fazer commit com a mensagem informada
- Fazer push automaticamente para o branch atual

Também é possível editar a task no VS Code para passar a mensagem de commit diretamente.

---
