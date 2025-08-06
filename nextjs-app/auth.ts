// Arquivo removido: todas as referências a next-auth e provedores antigos foram eliminadas.
// Este arquivo pode ser utilizado para configuração Auth.js puro, se necessário.
GitHubProvider({
  clientId: process.env.AUTH_GITHUB_ID || "",
  clientSecret: process.env.AUTH_GITHUB_SECRET || "",
}),
  MicrosoftEntraIdProvider({
    clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID || "",
    clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET || "",
    issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER || "https://login.microsoftonline.com/common/v2.0",
  }),
  AppleProvider({
    clientId: process.env.AUTH_APPLE_ID || "",
    clientSecret: process.env.AUTH_APPLE_SECRET || "",
  }),
  TwitterProvider({
    clientId: process.env.AUTH_TWITTER_ID || "",
    clientSecret: process.env.AUTH_TWITTER_SECRET || "",
  }),
  CredentialsProvider({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials) {
      try {
        // Valida as credenciais
        const { email, password } = signInSchema.parse(credentials);

        // Busca o usuário no banco de dados
        const user = await prisma.user.findUnique({
          where: { email }
        });

        if (!user || !user.password) {
          return null;
        }

// Verifica a senha

// Arquivo removido: todas as referências a next-auth e provedores antigos foram eliminadas.
// Este arquivo pode ser utilizado para configuração Auth.js puro, se necessário.
