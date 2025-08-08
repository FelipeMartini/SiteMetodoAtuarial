// Arquivo de configuração do Prisma para padronizar diretórios customizados
// https://www.prisma.io/docs/reference/api-reference/prisma-config

module.exports = {
  schema: "./src/prisma/schema.prisma",
  seed: "ts-node --compiler-options {\"module\":\"commonjs\"} ./src/prisma/seed/seed.ts",
  generator: {
    client: {
      output: "./src/prisma/generated/client"
    }
  }
};
