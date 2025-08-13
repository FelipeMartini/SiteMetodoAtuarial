// Funções utilitárias para formatação de valores/fórmulas
export function formatarValor(valor: any): string {
  if (valor === null || valor === undefined) return '';
  if (typeof valor === 'number') return valor.toLocaleString('pt-BR');
  return String(valor);
}
