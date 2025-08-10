// Lista dinâmica de provedores de login social disponíveis, baseada nas variáveis de ambiente
export interface ProvedorSocial {
  id: string;
  nome: string;
  icone: string;
  rota: string;
}

export const provedoresDisponiveis: ProvedorSocial[] = [
  ...(process.env.AUTH_GOOGLE_ID ? [{
    id: 'google',
    nome: 'Google',
    icone: '/social/google-g-logo.png',
    rota: '/api/auth/signin/google',
  }] : []),
  ...(process.env.AUTH_GITHUB_ID ? [{
    id: 'github',
    nome: 'GitHub',
    icone: '/social/github-mark-white.svg',
    rota: '/api/auth/signin/github',
  }] : []),
  ...(process.env.AUTH_MICROSOFT_ID ? [{
    id: 'microsoft',
    nome: 'Microsoft',
    icone: '/social/microsoft-logo.svg',
    rota: '/api/auth/signin/microsoft',
  }] : []),
  ...(process.env.AUTH_APPLE_ID ? [{
    id: 'apple',
    nome: 'Apple',
    icone: '/social/apple-logo.svg',
    rota: '/api/auth/signin/apple',
  }] : []),
  ...(process.env.AUTH_TWITTER_ID ? [{
    id: 'twitter',
    nome: 'Twitter',
    icone: '/social/twitter.svg',
    rota: '/api/auth/signin/twitter',
  }] : []),
];
