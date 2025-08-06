module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    "@babel/preset-react",
    "@babel/preset-typescript"
  ]
};
// Este arquivo Babel é usado apenas para os testes do Jest, nunca para o build do Next.js.
// Mantendo fora da raiz e do diretório do app para evitar conflito com SWC.
