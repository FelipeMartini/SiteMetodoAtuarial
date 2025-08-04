// Sistema de temas moderno com 5 variações elegantes
export type NomesTema = 'escuro' | 'claro' | 'verde-natural' | 'roxo-profissional' | 'coral-vibrante';

// Interface do tema customizado
export interface TemaCustomizado {
  nome: NomesTema;
  displayName: string;
  icone: string;
  cores: {
    primario: string;
    primariaHover: string;
    primariaClara: string;
    secundario: string;
    secundariaHover: string;
    terciario: string;
    
    fundo: string;
    fundoSecundario: string;
    fundoTerciario: string;
    superficie: string;
    superficieElevada: string;
    
    texto: string;
    textoSecundario: string;
    textoTerciario: string;
    textoInvertido: string;
    
    borda: string;
    bordaFoco: string;
    bordaHover: string;
    
    sucesso: string;
    sucessoFundo: string;
    aviso: string;
    avisoFundo: string;
    erro: string;
    erroFundo: string;
    info: string;
    infoFundo: string;
    
    gradiente: string;
    gradienteSecundario: string;
  };
  tipografia: {
    fontes: {
      principal: string;
      codigo: string;
    };
    tamanhos: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
      '5xl': string;
    };
    pesos: {
      normal: number;
      medio: number;
      negrito: number;
      extra: number;
    };
    alturas: {
      tight: number;
      normal: number;
      relaxed: number;
      loose: number;
    };
  };
  espacamentos: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
  };
  bordas: {
    raios: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
      full: string;
    };
    larguras: {
      thin: string;
      normal: string;
      thick: string;
    };
  };
  sombras: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    inner: string;
    elevacao1: string;
    elevacao2: string;
    elevacao3: string;
  };
  animacoes: {
    transicoes: {
      rapida: string;
      normal: string;
      lenta: string;
    };
    curvas: {
      ease: string;
      easeIn: string;
      easeOut: string;
      easeInOut: string;
    };
  };
}

// Elementos compartilhados entre todos os temas
const tipografiaBase = {
  fontes: {
    principal: '"Inter", "Roboto", "Helvetica Neue", Arial, sans-serif',
    codigo: '"Fira Code", "Monaco", "Cascadia Code", monospace',
  },
  tamanhos: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
  },
  pesos: {
    normal: 400,
    medio: 500,
    negrito: 600,
    extra: 700,
  },
  alturas: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
};

const espacamentosBase = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
  '4xl': '6rem',   // 96px
  '5xl': '8rem',   // 128px
};

const bordasBase = {
  raios: {
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    '2xl': '1.5rem', // 24px
    full: '9999px',
  },
  larguras: {
    thin: '1px',
    normal: '2px',
    thick: '4px',
  },
};

const sombrasBase = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  elevacao1: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  elevacao2: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  elevacao3: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
};

const animacoesBase = {
  transicoes: {
    rapida: '150ms',
    normal: '250ms',
    lenta: '400ms',
  },
  curvas: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
};

// TEMA 1: ESCURO (Padrão) - Elegante e profissional
export const temaEscuro: TemaCustomizado = {
  nome: 'escuro',
  displayName: 'Escuro',
  icone: '🌙',
  cores: {
    primario: '#4F46E5',     // Indigo vibrante
    primariaHover: '#4338CA',
    primariaClara: '#A5B4FC',
    secundario: '#059669',    // Verde esmeralda
    secundariaHover: '#047857',
    terciario: '#06B6D4',     // Cyan
    
    fundo: '#0F0F23',         // Azul escuro profundo
    fundoSecundario: '#1A1B3A',
    fundoTerciario: '#262653',
    superficie: '#1E1E2E',
    superficieElevada: '#2A2A3A',
    
    texto: '#F8FAFC',
    textoSecundario: '#CBD5E1',
    textoTerciario: '#94A3B8',
    textoInvertido: '#1E293B',
    
    borda: '#374151',
    bordaFoco: '#6366F1',
    bordaHover: '#4B5563',
    
    sucesso: '#10B981',
    sucessoFundo: '#064E3B',
    aviso: '#F59E0B',
    avisoFundo: '#78350F',
    erro: '#EF4444',
    erroFundo: '#7F1D1D',
    info: '#3B82F6',
    infoFundo: '#1E3A8A',
    
    gradiente: 'linear-gradient(135deg, #0F0F23 0%, #1A1B3A 50%, #262653 100%)',
    gradienteSecundario: 'linear-gradient(135deg, #4F46E5 0%, #059669 100%)',
  },
  tipografia: tipografiaBase,
  espacamentos: espacamentosBase,
  bordas: bordasBase,
  sombras: sombrasBase,
  animacoes: animacoesBase,
};

// TEMA 2: CLARO - Limpo e moderno
export const temaClaro: TemaCustomizado = {
  nome: 'claro',
  displayName: 'Claro',
  icone: '☀️',
  cores: {
    primario: '#4F46E5',
    primariaHover: '#4338CA',
    primariaClara: '#EEF2FF',
    secundario: '#059669',
    secundariaHover: '#047857',
    terciario: '#0891B2',
    
    fundo: '#FFFFFF',
    fundoSecundario: '#F8FAFC',
    fundoTerciario: '#F1F5F9',
    superficie: '#FFFFFF',
    superficieElevada: '#F8FAFC',
    
    texto: '#1E293B',
    textoSecundario: '#475569',
    textoTerciario: '#64748B',
    textoInvertido: '#FFFFFF',
    
    borda: '#E2E8F0',
    bordaFoco: '#6366F1',
    bordaHover: '#CBD5E1',
    
    sucesso: '#059669',
    sucessoFundo: '#D1FAE5',
    aviso: '#D97706',
    avisoFundo: '#FEF3C7',
    erro: '#DC2626',
    erroFundo: '#FEE2E2',
    info: '#2563EB',
    infoFundo: '#DBEAFE',
    
    gradiente: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
    gradienteSecundario: 'linear-gradient(135deg, #4F46E5 0%, #059669 100%)',
  },
  tipografia: tipografiaBase,
  espacamentos: espacamentosBase,
  bordas: bordasBase,
  sombras: sombrasBase,
  animacoes: animacoesBase,
};

// TEMA 3: VERDE NATURAL - Sustentabilidade e crescimento
export const temaVerdeNatural: TemaCustomizado = {
  nome: 'verde-natural',
  displayName: 'Verde Natural',
  icone: '🌿',
  cores: {
    primario: '#059669',      // Verde esmeralda
    primariaHover: '#047857',
    primariaClara: '#A7F3D0',
    secundario: '#16A34A',    // Verde vivo
    secundariaHover: '#15803D',
    terciario: '#0D9488',     // Teal
    
    fundo: '#F0FDF4',         // Verde muito claro
    fundoSecundario: '#DCFCE7',
    fundoTerciario: '#BBF7D0',
    superficie: '#FFFFFF',
    superficieElevada: '#F0FDF4',
    
    texto: '#064E3B',         // Verde escuro
    textoSecundario: '#065F46',
    textoTerciario: '#047857',
    textoInvertido: '#FFFFFF',
    
    borda: '#A7F3D0',
    bordaFoco: '#10B981',
    bordaHover: '#86EFAC',
    
    sucesso: '#22C55E',
    sucessoFundo: '#DCFCE7',
    aviso: '#F59E0B',
    avisoFundo: '#FEF3C7',
    erro: '#EF4444',
    erroFundo: '#FEE2E2',
    info: '#06B6D4',
    infoFundo: '#CFFAFE',
    
    gradiente: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 50%, #BBF7D0 100%)',
    gradienteSecundario: 'linear-gradient(135deg, #059669 0%, #16A34A 100%)',
  },
  tipografia: tipografiaBase,
  espacamentos: espacamentosBase,
  bordas: bordasBase,
  sombras: sombrasBase,
  animacoes: animacoesBase,
};

// TEMA 4: ROXO PROFISSIONAL - Criatividade e inovação
export const temaRoxoProfissional: TemaCustomizado = {
  nome: 'roxo-profissional',
  displayName: 'Roxo Profissional',
  icone: '💜',
  cores: {
    primario: '#7C3AED',      // Roxo vibrante
    primariaHover: '#6D28D9',
    primariaClara: '#DDD6FE',
    secundario: '#8B5CF6',    // Violeta
    secundariaHover: '#7C3AED',
    terciario: '#A855F7',     // Púrpura
    
    fundo: '#FAF5FF',         // Roxo muito claro
    fundoSecundario: '#F3E8FF',
    fundoTerciario: '#E9D5FF',
    superficie: '#FFFFFF',
    superficieElevada: '#FAF5FF',
    
    texto: '#581C87',         // Roxo escuro
    textoSecundario: '#6B21A8',
    textoTerciario: '#7C2D92',
    textoInvertido: '#FFFFFF',
    
    borda: '#D8B4FE',
    bordaFoco: '#8B5CF6',
    bordaHover: '#C4B5FD',
    
    sucesso: '#10B981',
    sucessoFundo: '#D1FAE5',
    aviso: '#F59E0B',
    avisoFundo: '#FEF3C7',
    erro: '#EF4444',
    erroFundo: '#FEE2E2',
    info: '#6366F1',
    infoFundo: '#E0E7FF',
    
    gradiente: 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 50%, #E9D5FF 100%)',
    gradienteSecundario: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)',
  },
  tipografia: tipografiaBase,
  espacamentos: espacamentosBase,
  bordas: bordasBase,
  sombras: sombrasBase,
  animacoes: animacoesBase,
};

// TEMA 5: CORAL VIBRANTE - Energia e entusiasmo
export const temaCoralVibrante: TemaCustomizado = {
  nome: 'coral-vibrante',
  displayName: 'Coral Vibrante',
  icone: '🌺',
  cores: {
    primario: '#F97316',      // Laranja coral
    primariaHover: '#EA580C',
    primariaClara: '#FED7AA',
    secundario: '#FB923C',    // Laranja claro
    secundariaHover: '#F97316',
    terciario: '#F59E0B',     // Âmbar
    
    fundo: '#FFF7ED',         // Laranja muito claro
    fundoSecundario: '#FFEDD5',
    fundoTerciario: '#FED7AA',
    superficie: '#FFFFFF',
    superficieElevada: '#FFF7ED',
    
    texto: '#9A3412',         // Laranja escuro
    textoSecundario: '#C2410C',
    textoTerciario: '#EA580C',
    textoInvertido: '#FFFFFF',
    
    borda: '#FDE68A',
    bordaFoco: '#F97316',
    bordaHover: '#FED7AA',
    
    sucesso: '#10B981',
    sucessoFundo: '#D1FAE5',
    aviso: '#F59E0B',
    avisoFundo: '#FEF3C7',
    erro: '#EF4444',
    erroFundo: '#FEE2E2',
    info: '#3B82F6',
    infoFundo: '#DBEAFE',
    
    gradiente: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 50%, #FED7AA 100%)',
    gradienteSecundario: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
  },
  tipografia: tipografiaBase,
  espacamentos: espacamentosBase,
  bordas: bordasBase,
  sombras: sombrasBase,
  animacoes: animacoesBase,
};

// Array com todos os temas disponíveis
export const temasDisponiveis: TemaCustomizado[] = [
  temaEscuro,
  temaClaro,
  temaVerdeNatural,
  temaRoxoProfissional,
  temaCoralVibrante,
];

// Função para obter tema por nome
export const obterTemaPorNome = (nome: NomesTema): TemaCustomizado => {
  const tema = temasDisponiveis.find(t => t.nome === nome);
  return tema || temaEscuro; // Fallback para tema escuro
};

// Função para obter próximo tema na lista
export const obterProximoTema = (nomeAtual: NomesTema): TemaCustomizado => {
  const indiceAtual = temasDisponiveis.findIndex(t => t.nome === nomeAtual);
  const proximoIndice = (indiceAtual + 1) % temasDisponiveis.length;
  return temasDisponiveis[proximoIndice];
};

// Exportações compatíveis com versão anterior
export { 
  temaEscuro as coresEscuro, 
  temaClaro as coresClaro,
  tipografiaBase as tipografia,
  espacamentosBase as espacamentos,
  bordasBase as bordas,
  sombrasBase as sombras,
  animacoesBase as animacoes
};
