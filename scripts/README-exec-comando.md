# exec-comando.sh – Execução Segura de Comandos

## Como usar

1. Dê permissão de execução ao script (apenas na primeira vez):
   ```bash
   chmod +x ./scripts/exec-comando.sh
   ```
2. Execute um comando permitido:
   ```bash
   ./scripts/exec-comando.sh "ls -la src"
   ```

## Listas de controle

- `Yprograma-comandos/comandos_permitidos.txt`: comandos liberados (um por linha, ex: `ls`)
- `Yprograma-comandos/comandos_bloqueados.txt`: comandos proibidos (ex: `rm`)
- `Yprograma-comandos/comandos_pendentes.txt`: comandos aguardando aprovação

## Funcionamento
- Comando na lista negra: bloqueado automaticamente.
- Comando na lista branca: executa se não usar caminhos proibidos.
- Comando novo: vai para lista pendente e pede confirmação manual.
- Todos os comandos e decisões são registrados em `Yprograma-comandos/exec-comando.log`.

## Segurança
- Só permite comandos que atuem dentro do workspace.
- Caminhos absolutos ou com `..` são bloqueados.
- Fácil de editar as listas para evoluir o controle.

## Exemplo de Task no VS Code
Adicione ao `tasks.json`:
```json
{
  "label": "Executar Comando Seguro",
  "type": "shell",
  "command": "${workspaceFolder}/scripts/exec-comando.sh",
  "args": ["${input:comando}"],
  "problemMatcher": [],
  "options": {
    "cwd": "${workspaceFolder}"
  }
},
{
  "label": "comando",
  "type": "promptString",
  "description": "Digite o comando seguro a executar (ex: ls -la src)",
  "default": "ls"
}
```

---
Ajuste as listas conforme necessário para personalizar a segurança.
