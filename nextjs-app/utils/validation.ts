// Validações para formulários de autenticação
export const emailValidation = {
  required: 'Email é obrigatório',
  pattern: {
    value: /^\S+@\S+$/i,
    message: 'Digite um email válido',
  },
};

export const passwordValidation = {
  required: 'Senha é obrigatória',
  minLength: {
    value: 6,
    message: 'Senha deve ter pelo menos 6 caracteres',
  },
};

export const confirmPasswordValidation = (password: string) => ({
  required: 'Confirme sua senha',
  validate: (value: string) =>
    value === password || 'Senhas não coincidem',
});

export const nameValidation = {
  required: 'Nome é obrigatório',
  minLength: {
    value: 2,
    message: 'Nome deve ter pelo menos 2 caracteres',
  },
};
