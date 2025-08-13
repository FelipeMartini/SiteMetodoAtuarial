import ExcelJS from 'exceljs';
import type { DadosAnaliseExcel } from '@types/analise-excel';

export async function analisarExcel(buffer: Buffer): Promise<DadosAnaliseExcel> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const planilhas = workbook.worksheets.map((sheet) => {
    const colunas: string[] = [];
    const linhas: any[] = [];
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) {
        row.eachCell((cell, colNumber) => {
          colunas.push(cell.address.replace(/\d+$/, ''));
        });
      }
      const celulas = row.cells.map((cell) => ({
        coluna: cell.address.replace(/\d+$/, ''),
        valor: cell.value && typeof cell.value === 'object' && 'formula' in cell.value ? cell.value.result : cell.value,
        formula: cell.value && typeof cell.value === 'object' && 'formula' in cell.value ? cell.value.formula : null,
      }));
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
