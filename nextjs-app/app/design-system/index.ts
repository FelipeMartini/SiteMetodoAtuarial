// Exporta todos os componentes do design system para facilitar importação
/**
 * Barrel de exportação do design system.
 * Permite importar componentes de forma centralizada:
 *
 * @example
 * import { Botao, CardInfo, InputTexto } from "@/app/design-system";
 */
// Design System - Exportações centralizadas
// Componentes reutilizáveis para todo o projeto

// Botões
export { default as Button } from './Button';
export { default as Botao } from './Botao';

// Campos de entrada
export { default as InputField } from './InputField';

// Cards informativos
// Se necessário, exportar Card moderno

// Componentes de login
export { default as SocialLoginButton } from './SocialLoginButton';
export { default as LoginForm } from './LoginForm';

// Re-exporta tipos úteis
export type { ButtonVariant, ButtonSize } from './Button';

// Exportação dos componentes base do design system
export { FlexContainer, CardBase, InputBase, LabelBase, Heading, Text, BotaoBase, Container, Secao } from "../../styles/ComponentesBase";
