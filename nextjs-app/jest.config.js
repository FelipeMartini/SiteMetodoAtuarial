module.exports = {
  // Configuração do ambiente de testes para React/Next.js
  testEnvironment: "jest-environment-jsdom", // Corrigido para o nome do módulo instalado
  setupFilesAfterEnv: ["@testing-library/jest-dom"], // Caminho atualizado conforme recomendação oficial
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
};
