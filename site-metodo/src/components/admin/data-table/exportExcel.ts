/**
 * AVISO DE SEGURANÇA: O pacote xlsx (SheetJS) utilizado neste arquivo está vulnerável a Prototype Pollution e ReDoS em todas as versões publicadas no npm.
 * O uso aqui é restrito à exportação de dados (NÃO leitura de arquivos externos), o que mitiga o risco.
 * Nunca utilize este código para ler arquivos Excel de fontes não confiáveis.
 * Para máxima segurança, considere migrar para exceljs ou importar SheetJS diretamente do CDN oficial.
 * Mais informações: https://cdn.sheetjs.com/advisories/CVE-2023-30533 e https://cdn.sheetjs.com/advisories/CVE-2024-22363
 */
// use client
// Exportação Excel usando SheetJS (xlsx). Carregamento dinâmico para minimizar impacto no bundle.
// Converte linhas (array de objetos) em planilha simples.

export async function salvarExcel(linhas: Record<string, unknown>[], nomeBase: string) {
  if (!linhas.length) return;
  const xlsx = await import('xlsx');
  const colunas = Object.keys(linhas[0]);
  const aoa: unknown[][] = [colunas];
  for (const l of linhas) {
    aoa.push(colunas.map((c) => l[c] ?? ''));
  }
  const ws = xlsx.utils.aoa_to_sheet(aoa);
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, 'Dados');
  xlsx.writeFileXLSX(wb, `${nomeBase}-${new Date().toISOString().slice(0,10)}.xlsx`);
}
