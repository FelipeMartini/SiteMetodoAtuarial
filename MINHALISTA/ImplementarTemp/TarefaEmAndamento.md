---
applyTo: '**'
---




# Checklist de Automação de Gerenciamento de Dependências


- [x] Planejar scripts shell reutilizáveis para:
	- [x] Instalar dependências (npm ci e npm install)
	- [x] Atualizar dependências (todas, interativo, específicas)
	- [x] Remover dependências
	- [x] Checar pacotes desatualizados (npm outdated)
	- [x] Checar/corrigir vulnerabilidades (npm audit, npm audit fix)
	- [x] Atualização interativa/filtro (npm-check-updates)
	- [x] Suporte a prompts/variáveis (nome do pacote, modo interativo, etc)
- [x] Integrar scripts como tasks no VS Code (tasks.json)
- [x] Garantir instalação/uso de npm-check-updates (npx ou global)
- [x] Documentar todos os fluxos no README
- [x] Testar todos os fluxos e garantir robustez
- [x] Garantir que tasks sejam seguras, modernas e fáceis de usar
- [x] Validar integração com CI/CD e ambiente local
- [x] Auditoria e correção de todos os comandos/scripts/configs para robustez com caminhos contendo espaços

---

> Marque cada item conforme for implementando. Atualize este checklist a cada etapa.

