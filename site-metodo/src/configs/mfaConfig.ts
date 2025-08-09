// Configuração central de MFA para flows sensíveis
// Pode ser expandida para painel admin futuramente

export type MfaFlow = 'login' | 'reset-password' | 'admin-area' | 'transferencia' | 'alterar-email' | 'alterar-senha';

export interface MfaConfig {
  obrigatorio: MfaFlow[]; // Flows que exigem MFA obrigatoriamente
}

// Por padrão, MFA é obrigatório apenas para login e área admin
export const mfaConfig: MfaConfig = {
  obrigatorio: ['login', 'admin-area'],
};

// Função utilitária para checar se um flow exige MFA
export function isMfaObrigatorio(flow: MfaFlow): boolean {
  return mfaConfig.obrigatorio.includes(flow);
}
