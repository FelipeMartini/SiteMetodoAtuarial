// Exporta todos os componentes do design system para facilitar importação
/**
 * Barrel de exportação do design system.
 * Permite importar componentes de forma centralizada:
 *
 * @example
 * import { Botao, CardInfo, InputTexto } from "@/app/design-system";
 */
export { default as Botao } from "./Botao";
export { default as CardInfo } from "./CardInfo";
export { default as InputTexto } from "./InputTexto";

// Exportação dos componentes base do design system
export { Box, Paper, Typography, Avatar, Stack, Divider } from "../theme/ComponentesBase";
