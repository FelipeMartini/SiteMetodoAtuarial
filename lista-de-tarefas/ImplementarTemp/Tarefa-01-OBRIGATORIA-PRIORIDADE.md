---
# Tarefa 01 — OBRIGATÓRIA E PRIORITÁRIA

## Deploy Automatizado Next.js/Node.js no Plesk (Sem Docker)

### Objetivo
Implementar uma automação (tarefa/scripts) que permita, ao executar uma tarefa no VS Code, realizar o deploy completo e independente do projeto Next.js/Node.js diretamente no servidor Plesk, rodando sem container, utilizando o Node.js nativo do Plesk.

---

## Regras e Princípios Gerais
- **Siga as recomendações e padrões definidos para o ABAC/ASIC** (clareza, documentação, links, checklist, revisão, correção de erros a cada etapa, etc.).
- **Todos os links de referência devem ser obrigatoriamente acessados, lidos e analisados antes de implementar qualquer etapa.**
- **Documente cada etapa, comandos e decisões.**
- **Automatize ao máximo: evite etapas manuais.**
- **Garanta que o deploy funcione para Next.js 15+ e Node.js 18+ (ou versão do Plesk).**
- **Inclua verificação e correção de lint, typescript e build antes do deploy.**
- **Inclua rollback simples em caso de falha.**

---

## Passos Automatizados (Checklist)

1. **Pré-requisitos**
   - Conta e acesso SSH ao Plesk (habilite SSH no painel).
   - Node.js ativado no domínio (Plesk > Ferramentas > Node.js > Habilitar).
   - Repositório Git configurado (preferencialmente via SSH, com chave pública cadastrada).
   - Defina o diretório raiz do app como `/httpdocs`.

2. **Build Local e Validação**
   - Execute `npm run lint`, `npm run type-check` e `npm run build` localmente.
   - Só prossiga se não houver erros.

3. **Upload Automatizado**
   - Sincronize arquivos (exceto `node_modules` e `.next`) para `/httpdocs` via `rsync` ou `scp`.
   - Recomenda-se script de deploy com exclusão de arquivos antigos e backup automático.

4. **Instalação de Dependências no Servidor**
   - Execute `npm install` no servidor (via SSH ou comando remoto).

5. **Build no Servidor**
   - Execute `npm run build` no servidor.

6. **Configuração do Startup**
   - Crie um arquivo `start.js` em `/httpdocs` com o seguinte conteúdo:
     ```js
     // Força modo produção
     process.env.NODE_ENV = 'production';
     const app = require('next/dist/cli/next-start');
     app.nextStart({ port: process.env.PORT || 3000 });
     ```
   - No painel do Plesk, defina o arquivo de inicialização da aplicação como `start.js`.
   - Defina o Document Root como `/httpdocs/.next/static`.

7. **Reinicie a Aplicação pelo Painel do Plesk**
   - Use o botão "Restart App" ou comando equivalente.

8. **Validação Pós-Deploy**
   - Acesse a URL do domínio e valide o funcionamento.
   - Teste endpoints críticos e páginas principais.

9. **Rollback (em caso de falha)**
   - Mantenha backup automático do diretório anterior antes do deploy.
   - Em caso de erro, restaure backup e reinicie app.

10. **Documentação e Logs**
    - Gere logs de cada etapa do deploy.
    - Documente problemas e soluções encontradas.

---

## Referências Obrigatórias (leitura e análise ANTES de implementar)
- [How to set up your NEXT.JS app on Plesk server (Medium)](https://medium.com/@keithchasen/how-to-set-up-your-next-js-app-on-plesk-server-7d8d247a2db2)
- [How to deploy Next.js 15 on Plesk (mytchall.dev)](https://mytchall.dev/how-to-deploy-next-js-15-on-plesk/)
- [Deploying Next.js on Plesk (Medium)](https://medium.com/@devinred/deploying-next-js-on-plesk-4aae3030cbb2)
- [How to resolve common issues when running a Next.js node app on Plesk (mytchall.dev)](https://mytchall.dev/how-to-resolve-common-issues-when-running-a-next-js-node-app-on-plesk/)
- [Next.js — Self Hosting (Documentação Oficial)](https://nextjs.org/docs/app/guides/self-hosting)
- [Next.js — Deploying (Documentação Oficial)](https://nextjs.org/docs/app/getting-started/deploying)
- [Next.js — Production Checklist](https://nextjs.org/docs/app/guides/production-checklist)

---

## Observações e Dicas
- **Nunca edite arquivos em `node_modules` pelo gerenciador de arquivos do Plesk — use SSH.**
- **Prefira sempre scripts idempotentes e seguros.**
- **Automatize rollback e backup.**
- **Garanta que variáveis de ambiente estejam corretamente configuradas no painel do Plesk.**
- **Consulte sempre as referências acima antes de qualquer alteração.**

---

## Exemplo de Script de Deploy (resumido)
```bash
#!/bin/bash
# 1. Build local
npm run lint && npm run type-check && npm run build || exit 1
# 2. Backup remoto
ssh user@plesk 'cp -r ~/httpdocs ~/httpdocs-backup-$(date +%Y%m%d%H%M%S)'
# 3. Upload
rsync -avz --exclude node_modules --exclude .next ./ user@plesk:~/httpdocs/
# 4. Instalação e build remoto
ssh user@plesk 'cd ~/httpdocs && npm install && npm run build'
# 5. Reiniciar app
ssh user@plesk 'plesk bin node --restart-app -domain example.com'
```

---

## Checklist Final
- [ ] Validar todos os links de referência
- [ ] Garantir build, lint e type-check sem erros
- [ ] Automatizar upload, build e restart
- [ ] Validar funcionamento pós-deploy
- [ ] Documentar problemas e soluções
- [ ] Garantir rollback seguro

---

> **IMPORTANTE:** Antes de implementar, leia e analise TODOS os links de referência. Siga as recomendações de segurança, automação, rollback e documentação. Siga os mesmos princípios de clareza, checklist, logs e revisão contínua definidos para o ABAC/ASIC.
