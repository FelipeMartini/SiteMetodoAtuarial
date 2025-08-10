# Boas Práticas para ABAC com node-casbin

- **Modelagem de atributos:**
  - Defina claramente quais atributos de usuário e recurso são relevantes para as políticas (ex: role, department, owner, tags).
  - Mantenha os modelos e políticas versionados e documentados.

- **Políticas dinâmicas:**
  - Prefira políticas baseadas em regras e expressões (ex: `r.sub.Department == r.obj.Department`).
  - Use o recurso de `eval` do Casbin para expressões mais complexas.

- **Auditoria e logs:**
  - Implemente logs detalhados para cada decisão de autorização.
  - Audite mudanças em políticas e modelos.

- **Testes automatizados:**
  - Cubra cenários de permissão e negação para todos os tipos de usuário e recurso.
  - Teste casos extremos e atributos inesperados.

- **Evolução contínua:**
  - Revise e atualize políticas conforme o domínio evolui.
  - Envolva o time de produto/negócio na definição de regras.

- **Performance:**
  - Carregue o enforcer Casbin uma vez por processo (singleton).
  - Evite consultas desnecessárias a banco para atributos já carregados.

- **Documentação:**
  - Documente exemplos de uso, atributos suportados e decisões de design.
  - Mantenha onboarding atualizado para novos devs.

- **Comunidade e suporte:**
  - Acompanhe atualizações do Casbin e da comunidade.
  - Participe de fóruns e canais oficiais para dúvidas e sugestões.

---

Seguindo essas práticas, o sistema ABAC será robusto, auditável e fácil de evoluir.
