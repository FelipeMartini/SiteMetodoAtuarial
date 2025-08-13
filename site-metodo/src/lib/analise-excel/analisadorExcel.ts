import ExcelJS from 'exceljs';
import type { DadosAnaliseExcel } from '@/types/analise-excel';


/**
 * Analisa um arquivo Excel a partir de um Buffer ou ArrayBuffer.
 * @param buffer Buffer do Node.js ou ArrayBuffer compatível.
 */
export async function analisarExcel(buffer: Buffer | ArrayBuffer | Uint8Array): Promise<DadosAnaliseExcel> {
  // Converte ArrayBuffer/Uint8Array para Buffer se necessário
  let workbookBuffer: Buffer;
  
  if (Buffer.isBuffer(buffer)) {
    workbookBuffer = buffer;
  } else if (buffer instanceof ArrayBuffer) {
    workbookBuffer = Buffer.from(buffer);
  } else if (buffer instanceof Uint8Array) {
    workbookBuffer = Buffer.from(buffer);
  } else {
    throw new Error('O parâmetro buffer deve ser um Buffer, ArrayBuffer ou Uint8Array');
  }
  
  const workbook = new ExcelJS.Workbook();
  // Type assertion necessária devido a incompatibilidade de tipos entre Node.js Buffer e definições do ExcelJS
  await workbook.xlsx.load(workbookBuffer as any);
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
