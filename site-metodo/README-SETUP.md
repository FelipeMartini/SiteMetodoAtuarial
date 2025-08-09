# Setup Inicial do Projeto CRUD/Admin

## 1. Instalação de Dependências

```bash
npm install shadcn/ui @radix-ui/react-slot lucide-react tailwindcss postcss autoprefixer framer-motion react-hook-form zod zustand @tanstack/react-query prisma @prisma/client @auth/core jest @testing-library/react cypress eslint prettier cspell husky commitlint helmet rate-limiter-flexible cors
```

## 2. Configuração do TailwindCSS

```bash
npx tailwindcss init -p
```

Adicione os paths do projeto no `tailwind.config.js`:
```js
content: [
  "./src/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
],
```

## 3. Inicialização do Prisma

```bash
npx prisma init
```

## 4. Instalação dos hooks do Husky

```bash
npx husky install
```

## 5. Scripts Úteis

- `npm run lint` — Lint do código
- `npm run test` — Testes unitários
- `npx prisma migrate dev` — Migração do banco
- `npx shadcn-ui@latest add <componente>` — Adicionar componente shadcn/ui

---

> Consulte também os arquivos DEPENDENCIAS.md e SCRIPTS.md para detalhes completos.
