# 13 - CI/CD Moderno

## Objetivo
Automatizar build, testes, lint, deploy e versionamento para máxima qualidade e agilidade.

## Checklist
- [ ] Configurar pipeline no GitHub Actions (ou Vercel CI)
- [ ] Automatizar lint, testes e build
- [ ] Deploy automático para preview e produção
- [ ] Versionamento semântico e changelog automatizado
- [ ] Notificações de status (Slack, email, etc)

## Instruções Detalhadas
1. **Pipeline:**
   - Crie `.github/workflows/ci.yml` com etapas para lint, test, build e deploy.
2. **Deploy:**
   - Configure deploy contínuo para Vercel ou ambiente desejado.
3. **Versionamento:**
   - Use [semantic-release](https://semantic-release.gitbook.io/semantic-release/) para versionamento e changelog.
4. **Notificações:**
   - Integre notificações de status para o time.

## Referências
- [Next.js CI/CD](https://nextjs.org/docs/deployment)
- [GitHub Actions](https://docs.github.com/en/actions)
- [semantic-release](https://semantic-release.gitbook.io/semantic-release/)
