import ExcelJS from 'exceljs';
import type { DadosAnaliseExcel } from '@/types/analise-excel';


/**
 * Analisa um arquivo Excel a partir de um Buffer puro do Node.js.
 * @param buffer Buffer puro do Node.js (NÃO Buffer<ArrayBufferLike>).
 */
export async function analisarExcel(buffer: Buffer): Promise<DadosAnaliseExcel> {
  if (!Buffer.isBuffer(buffer)) {
    throw new Error('O parâmetro buffer deve ser um Buffer puro do Node.js');
  }
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const planilhas = workbook.worksheets.map((sheet: ExcelJS.Worksheet) => {
    const colunas: string[] = [];
    const linhas: any[] = [];
    sheet.eachRow((row: ExcelJS.Row, rowNumber: number) => {
      if (rowNumber === 1) {
        row.eachCell((cell: ExcelJS.Cell, colNumber: number) => {
          colunas.push(cell.address.replace(/\d+$/, ''));
        });
      }
      const celulas: Array<{ coluna: string; valor: any; formula: string | null }> = [];
      row.eachCell((cell: ExcelJS.Cell) => {
        let formula: string | null = null;
        if (cell.value && typeof cell.value === 'object' && 'formula' in cell.value) {
          formula = cell.value.formula ?? null;
        }
        celulas.push({
          coluna: cell.address.replace(/\d+$/, ''),
          valor: cell.value && typeof cell.value === 'object' && 'formula' in cell.value ? cell.value.result : cell.value,
          formula,
        });
      });
      linhas.push({ numero: rowNumber, celulas });
    });
    return {
      nome: sheet.name,
      colunas,
      linhas,
    };
  });
  return { planilhas };
}
