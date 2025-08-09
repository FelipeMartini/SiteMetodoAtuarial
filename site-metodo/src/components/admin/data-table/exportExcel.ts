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
